import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const result = { scope: "staged" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--scope" || arg === "--artifact" || arg === "--expected-mode") {
      result[arg.slice(2)] = argv[index + 1];
      index += 1;
    } else fail(`无法识别的参数: ${arg}`);
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const binaryExtensions = new Set([
  ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".dcm",
  ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  ".zip", ".7z", ".rar", ".p12", ".pfx", ".pem", ".key",
]);
const textRules = [
  ["私钥材料", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["macOS 用户绝对路径", /\/Users\/(?!example|your-name|username)[^/\s]+\//],
  ["Linux 用户绝对路径", /\/home\/(?!example|your-name|username)[^/\s]+\//],
  ["疑似中国身份证号", /(?<!\d)\d{17}[\dXx](?!\d)/],
  ["疑似中国手机号", /(?<!\d)1[3-9]\d{9}(?!\d)/],
  ["疑似硬编码密钥", /(?:api[_-]?key|access[_-]?token|auth[_-]?secret|password)\s*[:=]\s*["'][A-Za-z0-9_\-./+=]{12,}["']/i],
];

function normalize(relative) { return relative.split(path.sep).join("/").replace(/^\.\//, ""); }
function forbiddenPath(relative, isApprovedDemoAvatar = false) {
  const rel = normalize(relative);
  const basename = path.posix.basename(rel);
  if (/^(data|reports|体检报告|exports|research)(\/|$)/.test(rel)) return "禁止提交的私有数据路径";
  if (rel === "src/lib/health-data.private.ts") return "禁止提交私有数据模块";
  if (/^\.env(?:\..+)?$/.test(basename) && basename !== ".env.example") return "禁止提交环境变量文件";
  if (rel === "public/avatars/manifest.json") return null;
  if (binaryExtensions.has(path.posix.extname(rel).toLowerCase()) && !isApprovedDemoAvatar) return "禁止提交敏感或二进制文件类型";
  if (/^public\/avatars(?:\/|$)/.test(rel) && !isApprovedDemoAvatar) return "禁止提交真实头像目录";
  return null;
}

function denylist() {
  const file = path.join(root, "privacy-denylist.local.txt");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/).map((item) => item.trim()).filter(Boolean) : [];
}

function inspect(relative, buffer, findings, localDenylist, approvedDemoAvatars) {
  const rel = normalize(relative);
  const expectedAvatarHash = approvedDemoAvatars.get(rel);
  const isApprovedDemoAvatar = Boolean(expectedAvatarHash);
  const pathFinding = forbiddenPath(rel, isApprovedDemoAvatar);
  if (pathFinding) findings.push(`${rel}: ${pathFinding}`);
  if (isApprovedDemoAvatar) {
    const actualHash = crypto.createHash("sha256").update(buffer).digest("hex");
    if (actualHash !== expectedAvatarHash) findings.push(`${rel}: 演示头像哈希与清单不匹配`);
    for (const denied of localDenylist) if (rel.includes(denied)) findings.push(`${rel}: 命中本地隐私拒绝词`);
    return;
  }
  if (buffer.includes(0)) {
    findings.push(`${rel}: 未知二进制内容默认拒绝提交`);
    return;
  }
  const text = buffer.toString("utf8");
  for (const [label, rule] of textRules) if (rule.test(text)) findings.push(`${rel}: ${label}`);
  for (const denied of localDenylist) if (text.includes(denied) || rel.includes(denied)) findings.push(`${rel}: 命中本地隐私拒绝词`);
}

function approvedAvatarManifest(entries, scope, findings) {
  const manifestPath = scope === "staged" ? "public/avatars/manifest.json" : "avatars/manifest.json";
  const manifestEntry = entries.find((entry) => normalize(entry.relative) === manifestPath);
  if (!manifestEntry) return new Map();

  let manifest;
  try { manifest = JSON.parse(manifestEntry.buffer.toString("utf8")); }
  catch (error) {
    findings.push(`${manifestPath}: 演示头像清单 JSON 无法解析 (${error.message})`);
    return new Map();
  }
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.avatars)) {
    findings.push(`${manifestPath}: 演示头像清单结构无效`);
    return new Map();
  }

  const approved = new Map();
  for (const [index, item] of manifest.avatars.entries()) {
    if (!/^demo-[a-z0-9-]+\.webp$/i.test(item?.file || "") || !/^[a-f0-9]{64}$/.test(item?.sha256 || "")) {
      findings.push(`${manifestPath}: avatars[${index}] 只能列出 demo-*.webp 和 SHA-256`);
      continue;
    }
    const relative = scope === "staged" ? `public/avatars/${item.file}` : `avatars/${item.file}`;
    if (approved.has(relative)) findings.push(`${manifestPath}: ${item.file} 重复`);
    approved.set(relative, item.sha256);
  }
  return approved;
}

function git(argsList, options = {}) {
  try { return execFileSync("git", argsList, { cwd: root, ...options }); }
  catch (error) { fail(`Git 索引检查失败: ${error.stderr?.toString() || error.message}`); }
}

function stagedEntries() {
  const raw = git(["ls-files", "-z", "--cached"], { encoding: "buffer" }).toString("utf8");
  return raw.split("\0").filter(Boolean).map((relative) => {
    const modeLine = git(["ls-files", "--stage", "--", relative], { encoding: "utf8" }).trim();
    if (!modeLine.startsWith("100")) fail(`${relative}: 只允许普通文件进入公开仓库（不接受符号链接或 Git 特殊条目）`);
    return { relative, buffer: git(["show", `:${relative}`], { encoding: "buffer" }) };
  });
}

function walk(directory, base = directory) {
  const items = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) fail(`${normalize(path.relative(base, full))}: 构建产物中禁止符号链接`);
    if (entry.isDirectory()) items.push(...walk(full, base));
    else if (entry.isFile()) items.push({ relative: normalize(path.relative(base, full)), buffer: fs.readFileSync(full) });
  }
  return items;
}

let entries;
if (args.scope === "staged") {
  entries = stagedEntries();
} else if (args.scope === "artifact") {
  if (!args.artifact || !args["expected-mode"]) fail("artifact 范围必须同时提供 --artifact 和 --expected-mode");
  const artifact = path.resolve(root, args.artifact);
  if (!fs.existsSync(artifact) || !fs.statSync(artifact).isDirectory()) fail(`未找到构建产物目录: ${args.artifact}`);
  entries = walk(artifact);
} else {
  fail("--scope 仅支持 staged 或 artifact");
}

const findings = [];
const localDenylist = denylist();
const approvedDemoAvatars = approvedAvatarManifest(entries, args.scope, findings);
const entryPaths = new Set(entries.map((entry) => normalize(entry.relative)));
for (const relative of approvedDemoAvatars.keys()) {
  if (!entryPaths.has(relative)) findings.push(`${relative}: 演示头像清单引用的文件不存在`);
}
for (const entry of entries) inspect(entry.relative, entry.buffer, findings, localDenylist, approvedDemoAvatars);

if (args.scope === "artifact") {
  const combined = Buffer.concat(entries.map((entry) => entry.buffer)).toString("utf8");
  const expected = args["expected-mode"];
  if (!new Set(["demo", "private"]).has(expected)) findings.push(`未知的预期发布模式: ${expected}`);
  const modeProof = new RegExp(`(?:\\"mode\\"|mode)\\s*:\\s*[\\"'\u0060]${expected}[\\"'\u0060]`);
  if (!modeProof.test(combined)) findings.push(`产物缺少 ${expected} 模式证明`);
  if (expected === "demo" && (combined.includes("PRIVATE_SENTINEL") || combined.includes("health-data.private"))) findings.push("公开产物包含私有数据标记");
}

if (findings.length > 0) fail("隐私检查失败:\n" + [...new Set(findings)].map((item) => `- ${item}`).join("\n"));
console.log(`隐私检查通过（${args.scope}），共检查 ${entries.length} 个文件。`);
