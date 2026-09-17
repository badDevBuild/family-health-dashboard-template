import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignored = new Set([".git", "node_modules", "dist", "data", "reports", "体检报告", "exports", "research", "public/avatars"]);
const binaryExtensions = new Set([".pdf", ".jpg", ".jpeg", ".png", ".heic", ".dcm", ".zip", ".7z"]);
const riskyFiles = [/\.pem$/i, /\.key$/i, /\.p12$/i, /\.pfx$/i, /^\.env$/, /^\.env\.(?!example$)/, /health-data\.private\.ts$/];
const textRules = [
  ["私钥材料", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["macOS 用户绝对路径", /\/Users\/(?!example|your-name|username)[^/\s]+\//],
  ["Linux 用户绝对路径", /\/home\/(?!example|your-name|username)[^/\s]+\//],
  ["疑似中国身份证号", /(?<!\d)\d{17}[\dXx](?!\d)/],
  ["疑似中国手机号", /(?<!\d)1[3-9]\d{9}(?!\d)/],
  ["疑似硬编码密钥", /(?:api[_-]?key|access[_-]?token|auth[_-]?secret|password)\s*[:=]\s*["'][A-Za-z0-9_\-./+=]{12,}["']/i],
];

function walk(dir, relative = "") {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name) || entry.name === "privacy-denylist.local.txt") continue;
    const rel = path.join(relative, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full, rel));
    else files.push(rel);
  }
  return files;
}

const denylistFile = path.join(root, "privacy-denylist.local.txt");
const denylist = fs.existsSync(denylistFile)
  ? fs.readFileSync(denylistFile, "utf8").split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
  : [];
const findings = [];

for (const rel of walk(root)) {
  if (riskyFiles.some((rule) => rule.test(rel)) || binaryExtensions.has(path.extname(rel).toLowerCase())) {
    findings.push(`${rel}: 禁止提交的敏感或二进制文件类型`);
    continue;
  }
  const full = path.join(root, rel);
  const buffer = fs.readFileSync(full);
  if (buffer.includes(0)) continue;
  const text = buffer.toString("utf8");
  for (const [label, rule] of textRules) {
    if (rule.test(text)) findings.push(`${rel}: ${label}`);
  }
  for (const denied of denylist) {
    if (text.includes(denied) || rel.includes(denied)) findings.push(`${rel}: 命中本地隐私拒绝词`);
  }
}

if (findings.length > 0) {
  console.error("隐私检查失败:\n" + findings.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`隐私检查通过，共检查 ${walk(root).length} 个文件。`);
