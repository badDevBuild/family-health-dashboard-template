import assert from "node:assert/strict";
import crypto from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

const script = path.resolve("scripts/generate-data.mjs");

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "health-generator-"));
  fs.mkdirSync(path.join(root, "src/lib"), { recursive: true });
  return root;
}

function writeJson(root, relative, value) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
}

function baseContext() {
  return {
    schemaVersion: 1,
    members: [
      { personId: "person-a", displayName: "示例甲", gender: "男", birthYear: 1990 },
    ],
  };
}

function extraction(encounterId, reportId, date = "2026-01-02") {
  return {
    schemaVersion: 1,
    personId: "person-a",
    event: {
      encounterId,
      type: "体检",
      date,
      source: "示例机构",
      reports: [{ reportId, sourceFile: `synthetic/${reportId}.json`, pageRefs: [1] }],
    },
    measurements: [
      {
        measurementId: `${reportId}-m1`,
        reportId,
        page: 1,
        standardName: "示例指标",
        originalName: "示例指标",
        value: 1,
        numericValue: 1,
        unit: "示例单位",
        referenceRange: { low: 0, high: 2 },
        isAbnormal: false,
        organs: ["代谢/内分泌"],
      },
    ],
  };
}

function analysis(trend = "stable") {
  return {
    personId: "person-a",
    organAnalyses: [{
      organ: "代谢/内分泌",
      status: "normal",
      narrative: "虚构分析。",
      keyIndicators: [{
        name: "示例指标",
        latestValue: 1,
        unit: "示例单位",
        trend,
        isAbnormal: false,
        history: [{ date: "2026-01-02", value: 1 }],
      }],
    }],
    crossOrganInsights: [],
    actionSuggestions: [],
  };
}

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function extractionHash(root, relative) {
  const file = path.join(root, "private-data", relative);
  return crypto.createHash("sha256")
    .update(relative).update("\0").update(fs.readFileSync(file)).update("\0")
    .digest("hex");
}

test("没有显式模式时拒绝运行，且不覆盖公开模块", () => {
  const root = makeRoot();
  writeJson(root, "data/family-context.json", baseContext());
  writeJson(root, "data/extracted/person-a/r1.json", extraction("enc-1", "r1"));
  const publicFile = path.join(root, "src/lib/health-data.ts");
  fs.writeFileSync(publicFile, "PUBLIC_SENTINEL");
  const result = spawnSync(process.execPath, [script], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(publicFile, "utf8"), "PUBLIC_SENTINEL");
});

test("私有模式拒绝写入公开模块", () => {
  const root = makeRoot();
  writeJson(root, "private-data/family-context.json", baseContext());
  writeJson(root, "private-data/extracted/person-a/r1.json", extraction("enc-1", "r1"));
  const result = spawnSync(process.execPath, [
    script,
    "--mode", "private",
    "--data-dir", "private-data",
    "--output", "src/lib/health-data.ts",
  ], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /公开|private|输出/);
});

test("同日不同就诊保留唯一事件和各自指标", () => {
  const root = makeRoot();
  writeJson(root, "examples/demo-data/family-context.json", baseContext());
  writeJson(root, "examples/demo-data/extracted/person-a/r1.json", extraction("enc-1", "r1"));
  writeJson(root, "examples/demo-data/extracted/person-a/r2.json", extraction("enc-2", "r2"));
  execFileSync(process.execPath, [script, "--mode", "demo"], { cwd: root });
  const generated = fs.readFileSync(path.join(root, "src/lib/health-data.ts"), "utf8");
  const ids = [...generated.matchAll(/"id": "(person-a:enc-[^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, 2);
  assert.match(generated, /person-a:enc-1/);
  assert.match(generated, /person-a:enc-2/);
  assert.match(generated, /"r1"/);
  assert.match(generated, /"r2"/);
  assert.match(generated, /"status": "unknown"/);
});

test("缺少事件日期时给出文件与字段并拒绝生成", () => {
  const root = makeRoot();
  writeJson(root, "examples/demo-data/family-context.json", baseContext());
  const invalid = extraction("enc-1", "r1");
  delete invalid.event.date;
  writeJson(root, "examples/demo-data/extracted/person-a/bad.json", invalid);
  const result = spawnSync(process.execPath, [script, "--mode", "demo"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /bad\.json/);
  assert.match(`${result.stdout}\n${result.stderr}`, /event\.date/);
});

test("指标页码必须属于所引用报告的 pageRefs", () => {
  const root = makeRoot();
  writeJson(root, "examples/demo-data/family-context.json", baseContext());
  const invalid = extraction("enc-1", "r1");
  invalid.measurements[0].page = 2;
  writeJson(root, "examples/demo-data/extracted/person-a/bad-page.json", invalid);
  const result = spawnSync(process.execPath, [script, "--mode", "demo"], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /measurements\[0\]\.page/);
  assert.match(`${result.stdout}\n${result.stderr}`, /pageRefs/);
});

test("病例诊断必须有受控状态并引用同一报告页码", () => {
  const root = makeRoot();
  writeJson(root, "examples/demo-data/family-context.json", baseContext());
  const valid = extraction("enc-1", "r1");
  valid.event.type = "就医";
  valid.event.title = "示例病例复查";
  valid.event.clinicalSummary = "这是完全虚构的病例摘要。";
  valid.event.diagnoses = [{
    diagnosisId: "diagnosis-1",
    name: "示例疾病",
    status: "confirmed",
    reportId: "r1",
    page: 1,
    note: "由示例医生确认。",
  }];
  writeJson(root, "examples/demo-data/extracted/person-a/valid.json", valid);
  execFileSync(process.execPath, [script, "--mode", "demo"], { cwd: root });
  const generated = fs.readFileSync(path.join(root, "src/lib/health-data.ts"), "utf8");
  assert.match(generated, /示例病例复查/);
  assert.match(generated, /示例疾病/);

  valid.event.diagnoses[0].page = 2;
  writeJson(root, "examples/demo-data/extracted/person-a/valid.json", valid);
  const result = spawnSync(process.execPath, [script, "--mode", "demo"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /event\.diagnoses\[0\]\.page/);
  assert.match(`${result.stdout}\n${result.stderr}`, /pageRefs/);
});

test("解释性趋势词和不存在的建议证据都会被运行时 Schema 拒绝", () => {
  const root = makeRoot();
  writeJson(root, "examples/demo-data/family-context.json", baseContext());
  writeJson(root, "examples/demo-data/extracted/person-a/r1.json", extraction("enc-1", "r1"));
  writeJson(root, "examples/demo-data/analysis/person-a.json", analysis("stable-high"));
  let result = spawnSync(process.execPath, [script, "--mode", "demo"], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /keyIndicators\[0\]\.trend/);

  writeJson(root, "examples/demo-data/analysis/person-a.json", analysis());
  writeJson(root, "examples/demo-data/suggestions/person-a.json", {
    personId: "person-a",
    reviewSuggestions: [{
      priority: "medium", organ: "代谢/内分泌", what: "复查示例指标", when: "以后", where: "示例科室", why: "虚构原因",
      status: "ai_pending", evidence: [{ eventId: "person-a:missing", measurementIds: ["r1-m1"] }],
    }],
  });
  result = spawnSync(process.execPath, [script, "--mode", "demo"], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /evidence\[0\]\.eventId/);
});

test("过期生活指南会阻止生成而不是只发警告", () => {
  const root = makeRoot();
  writeJson(root, "examples/demo-data/family-context.json", baseContext());
  writeJson(root, "examples/demo-data/extracted/person-a/r1.json", extraction("enc-1", "r1"));
  writeJson(root, "examples/demo-data/analysis/person-a.json", analysis());
  writeJson(root, "examples/demo-data/lifestyle/person-a.json", {
    personId: "person-a",
    sourceAnalysisHash: "00000000000000000000000000000000",
    dataConfidence: "partial",
  });
  const result = spawnSync(process.execPath, [script, "--mode", "demo"], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /sourceAnalysisHash|生活指南已过期/);
});

test("私有模式只接受与当前输入完全匹配的批准记录", () => {
  const root = makeRoot();
  writeJson(root, "private-data/family-context.json", baseContext());
  writeJson(root, "private-data/extracted/person-a/r1.json", extraction("enc-1", "r1"));
  const analysisData = { personId: "person-a", organAnalyses: [] };
  writeJson(root, "private-data/analysis/person-a.json", analysisData);
  const extractHash = extractionHash(root, "extracted/person-a/r1.json");
  const contextHash = sha256(fs.readFileSync(path.join(root, "private-data/family-context.json")));
  const analysisFile = path.join(root, "private-data/analysis/person-a.json");
  const analysisHash = sha256(fs.readFileSync(analysisFile));
  const approval = (outputHash, dependsOn = {}) => ({
    status: "approved",
    outputHash,
    dependsOn,
    reviewer: "reviewer-a",
    approvedBy: "owner-a",
    approvedAt: "2026-09-17T08:00:00Z",
  });
  writeJson(root, "private-data/manifests/person-a.json", {
    schemaVersion: 1,
    personId: "person-a",
    stages: {
      extract: approval(extractHash, { context: contextHash }),
      analysis: approval(analysisHash, { context: contextHash, extract: extractHash }),
    },
  });

  execFileSync(process.execPath, [script, "--mode", "private", "--data-dir", "private-data"], { cwd: root });
  assert.equal(fs.existsSync(path.join(root, "src/lib/health-data.private.ts")), true);

  writeJson(root, "private-data/analysis/person-a.json", { ...analysisData, changed: true });
  const stale = spawnSync(process.execPath, [script, "--mode", "private", "--data-dir", "private-data"], { cwd: root, encoding: "utf8" });
  assert.notEqual(stale.status, 0);
  assert.match(`${stale.stdout}\n${stale.stderr}`, /批准已失效|哈希不匹配/);
});

test("成员背景变化会使旧批准失效", () => {
  const root = makeRoot();
  writeJson(root, "private-data/family-context.json", baseContext());
  writeJson(root, "private-data/extracted/person-a/r1.json", extraction("enc-1", "r1"));
  const extractHash = extractionHash(root, "extracted/person-a/r1.json");
  const contextFile = path.join(root, "private-data/family-context.json");
  const contextHash = sha256(fs.readFileSync(contextFile));
  writeJson(root, "private-data/manifests/person-a.json", {
    schemaVersion: 1,
    personId: "person-a",
    stages: {
      extract: {
        status: "approved",
        outputHash: extractHash,
        dependsOn: { context: contextHash },
        reviewer: "reviewer-a",
        approvedBy: "owner-a",
        approvedAt: "2026-09-17T08:00:00Z",
      },
    },
  });
  const changed = baseContext();
  changed.members[0].birthYear = 1989;
  writeJson(root, "private-data/family-context.json", changed);
  const result = spawnSync(process.execPath, [script, "--mode", "private", "--data-dir", "private-data"], { cwd: root, encoding: "utf8" });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /dependsOn\.context|上游版本已变化/);
});
