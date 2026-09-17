import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();
const demoRoot = path.join(projectRoot, "examples", "demo-data");

test("公开演示包含五位成员、每人五年记录和项目内头像", () => {
  const context = JSON.parse(
    fs.readFileSync(path.join(demoRoot, "family-context.json"), "utf8"),
  );

  assert.equal(context.members.length, 5);

  for (const member of context.members) {
    const extractedDir = path.join(demoRoot, "extracted", member.personId);
    const eventFiles = fs
      .readdirSync(extractedDir)
      .filter((name) => name.endsWith(".json"))
      .sort();

    assert.equal(eventFiles.length, 5, `${member.personId} 应有 5 次检查`);
    assert.deepEqual(
      eventFiles.map((name) => name.slice(0, 4)),
      ["2022", "2023", "2024", "2025", "2026"],
      `${member.personId} 应覆盖 2022–2026`,
    );
    assert.match(member.avatar, /^avatars\/[a-z0-9-]+\.webp$/);
    assert.equal(
      fs.existsSync(path.join(projectRoot, "public", member.avatar)),
      true,
      `${member.personId} 的头像必须存在于 public 目录`,
    );
  }
});
