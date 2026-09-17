import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const checker = path.resolve("scripts/privacy-check.mjs");

function repo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "privacy-index-"));
  execFileSync("git", ["init", "-q"], { cwd: root });
  fs.writeFileSync(path.join(root, ".gitignore"), "data/\nreports/\nsrc/lib/health-data.private.ts\n.env\n");
  fs.writeFileSync(path.join(root, "safe.txt"), "公开示例内容\n");
  execFileSync("git", ["add", ".gitignore", "safe.txt"], { cwd: root });
  return root;
}

function run(root) {
  return spawnSync(process.execPath, [checker, "--scope", "staged"], {
    cwd: root,
    encoding: "utf8",
  });
}

function writeAvatarManifest(root, baseDirectory, fileName, buffer) {
  const avatarDir = path.join(root, baseDirectory, "avatars");
  fs.mkdirSync(avatarDir, { recursive: true });
  fs.writeFileSync(path.join(avatarDir, fileName), buffer);
  fs.writeFileSync(
    path.join(avatarDir, "manifest.json"),
    JSON.stringify({
      schemaVersion: 1,
      avatars: [
        {
          file: fileName,
          sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
        },
      ],
    }),
  );
}

test("被忽略且未跟踪的私有模块不阻塞提交检查", () => {
  const root = repo();
  fs.mkdirSync(path.join(root, "src/lib"), { recursive: true });
  fs.writeFileSync(path.join(root, "src/lib/health-data.private.ts"), "PRIVATE_SENTINEL");
  assert.equal(run(root).status, 0);
});

for (const forbidden of ["data/private.json", "reports/report.json", "src/lib/health-data.private.ts", "server/.env"]) {
  test(`强制暂存 ${forbidden} 时失败`, () => {
    const root = repo();
    const file = path.join(root, forbidden);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, "PRIVATE_SENTINEL");
    execFileSync("git", ["add", "-f", forbidden], { cwd: root });
    const result = run(root);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
}

test("检查 Git 索引内容而不是被后来覆盖的工作树内容", () => {
  const root = repo();
  const syntheticPhone = ["138", "0013", "8000"].join("");
  fs.writeFileSync(path.join(root, "staged.txt"), `联系电话 ${syntheticPhone}\n`);
  execFileSync("git", ["add", "staged.txt"], { cwd: root });
  fs.writeFileSync(path.join(root, "staged.txt"), "工作树已经改成安全内容\n");
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /staged\.txt/);
});

test("非敏感目录中的报告图片和未知二进制也会失败", () => {
  const root = repo();
  fs.mkdirSync(path.join(root, "docs"), { recursive: true });
  fs.writeFileSync(path.join(root, "docs/report.png"), Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00]));
  fs.writeFileSync(path.join(root, "docs/blob.bin"), Buffer.from([0x01, 0x00, 0x02]));
  fs.writeFileSync(path.join(root, "docs/nul.txt"), Buffer.concat([Buffer.from(["138", "0013", "8000"].join("")), Buffer.from([0])]));
  execFileSync("git", ["add", "docs/report.png", "docs/blob.bin", "docs/nul.txt"], { cwd: root });
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /docs\/report\.png/);
  assert.match(`${result.stdout}\n${result.stderr}`, /docs\/blob\.bin/);
  assert.match(`${result.stdout}\n${result.stderr}`, /docs\/nul\.txt/);
});

test("只允许哈希清单中完全匹配的公开演示头像", () => {
  const root = repo();
  const avatar = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x57, 0x45, 0x42, 0x50]);
  writeAvatarManifest(root, "public", "demo-member.webp", avatar);
  execFileSync("git", ["add", "public/avatars/manifest.json", "public/avatars/demo-member.webp"], { cwd: root });
  assert.equal(run(root).status, 0);

  fs.appendFileSync(path.join(root, "public/avatars/demo-member.webp"), Buffer.from([0x01]));
  execFileSync("git", ["add", "public/avatars/demo-member.webp"], { cwd: root });
  const changed = run(root);
  assert.notEqual(changed.status, 0);
  assert.match(`${changed.stdout}\n${changed.stderr}`, /头像哈希与清单不匹配/);
});

test("构建产物也只接受与清单一致的演示头像", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "privacy-avatar-artifact-"));
  const artifact = path.join(root, "dist-demo");
  fs.mkdirSync(artifact, { recursive: true });
  fs.writeFileSync(path.join(artifact, "index.html"), '<script>const metadata = {"mode":"demo"}</script>');
  const avatar = Buffer.from([0x52, 0x49, 0x46, 0x46, 0x00, 0x57, 0x45, 0x42, 0x50]);
  writeAvatarManifest(root, "dist-demo", "demo-member.webp", avatar);

  const result = spawnSync(process.execPath, [checker, "--scope", "artifact", "--artifact", "dist-demo", "--expected-mode", "demo"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});
