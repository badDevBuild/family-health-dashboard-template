import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const projectRoot = process.cwd();
const demoRoot = path.join(projectRoot, "examples", "demo-data");

test("公开演示包含五位成员、每人五年六次记录、病例和项目内头像", () => {
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

    assert.equal(eventFiles.length, 6, `${member.personId} 应有 6 次健康事件`);
    const events = eventFiles.map((name) =>
      JSON.parse(fs.readFileSync(path.join(extractedDir, name), "utf8")),
    );
    assert.deepEqual(
      [...new Set(events.map((item) => item.event.date.slice(0, 4)))].sort(),
      ["2022", "2023", "2024", "2025", "2026"],
      `${member.personId} 应覆盖 2022–2026`,
    );
    assert.ok(
      events.some((item) => item.event.type === "就医" && item.event.diagnoses?.length > 0),
      `${member.personId} 应至少有一条带诊断证据的虚构病例`,
    );
    assert.match(member.avatar, /^avatars\/[a-z0-9-]+\.webp$/);
    assert.equal(
      fs.existsSync(path.join(projectRoot, "public", member.avatar)),
      true,
      `${member.personId} 的头像必须存在于 public 目录`,
    );
  }
});
