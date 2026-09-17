import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ORGAN_SYSTEMS = new Set(["心血管", "代谢/内分泌", "肝胆", "肾脏/泌尿", "消化", "血液", "肺/呼吸", "眼/五官"]);
const EVENT_TYPES = new Set(["体检", "就医", "手动备注"]);
const HEALTH_STATUSES = new Set(["normal", "attention", "alert"]);
const DIAGNOSIS_STATUSES = new Set(["confirmed", "under_evaluation", "resolved"]);

function fail(message) { throw new Error(message); }
function requireValue(condition, file, field, message = "字段缺失或类型错误") {
  if (!condition) fail(`${file}: ${field} ${message}`);
}

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) fail(`无法识别的参数: ${arg}`);
    const key = arg.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) fail(`参数 --${key} 缺少值`);
    result[key] = value;
    index += 1;
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const mode = args.mode;
if (!new Set(["demo", "private"]).has(mode)) {
  fail("必须显式指定 --mode demo 或 --mode private；不会猜测数据是否可公开");
}

const projectRoot = process.cwd();
const fixedDemoDir = path.resolve(projectRoot, "examples/demo-data");
const fixedPublicOutput = path.resolve(projectRoot, "src/lib/health-data.ts");
const fixedPrivateOutput = path.resolve(projectRoot, "src/lib/health-data.private.ts");
const dataDir = path.resolve(projectRoot, args["data-dir"] || (mode === "demo" ? "examples/demo-data" : "data"));
const output = path.resolve(projectRoot, args.output || (mode === "demo" ? "src/lib/health-data.ts" : "src/lib/health-data.private.ts"));

if (mode === "demo" && (dataDir !== fixedDemoDir || output !== fixedPublicOutput)) {
  fail("演示模式只允许 examples/demo-data/ → src/lib/health-data.ts");
}
if (mode === "private" && output !== fixedPrivateOutput) {
  fail("私有模式只允许输出到 src/lib/health-data.private.ts，禁止写入公开模块");
}
if (mode === "private" && dataDir === fixedDemoDir) fail("私有模式不能读取公开演示数据目录");

function readJson(file) {
  let text;
  try { text = fs.readFileSync(file, "utf8"); }
  catch (error) { fail(`${file}: 无法读取 (${error.message})`); }
  try { return JSON.parse(text); }
  catch (error) { fail(`${file}: JSON 解析失败 (${error.message})`); }
}

function isDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function jsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    requireValue(!entry.isSymbolicLink(), dir, entry.name, "不允许符号链接");
    requireValue(entry.isFile() && entry.name.endsWith(".json"), dir, entry.name, "只允许 JSON 文件");
    files.push(path.join(dir, entry.name));
  }
  return files.sort();
}

function sha256(content) { return crypto.createHash("sha256").update(content).digest("hex"); }
function hashFiles(files) {
  const hash = crypto.createHash("sha256");
  for (const file of files) {
    hash.update(path.relative(dataDir, file)); hash.update("\0"); hash.update(fs.readFileSync(file)); hash.update("\0");
  }
  return hash.digest("hex");
}

function validateContext(file) {
  const context = readJson(file);
  requireValue(context?.schemaVersion === 1, file, "schemaVersion", "必须为 1");
  requireValue(Array.isArray(context.members) && context.members.length > 0, file, "members", "必须是非空数组");
  const ids = new Set();
  for (const [index, member] of context.members.entries()) {
    const prefix = `members[${index}]`;
    requireValue(typeof member?.personId === "string" && /^[a-z0-9][a-z0-9-]{1,63}$/i.test(member.personId), file, `${prefix}.personId`);
    requireValue(typeof member?.displayName === "string" && member.displayName.trim(), file, `${prefix}.displayName`);
    requireValue(member.role === undefined || typeof member.role === "string" && member.role.trim(), file, `${prefix}.role`);
    requireValue(member.avatar === undefined || typeof member.avatar === "string" && /^avatars\/[a-z0-9-]+\.webp$/i.test(member.avatar), file, `${prefix}.avatar`, "必须是 avatars/ 下的 WebP 相对路径");
    requireValue(!ids.has(member.personId), file, `${prefix}.personId`, "不得重复");
    ids.add(member.personId);
  }
  return context;
}

function validateExtraction(file, personId) {
  const value = readJson(file);
  requireValue(value?.schemaVersion === 1, file, "schemaVersion", "必须为 1");
  requireValue(value.personId === personId, file, "personId", `必须等于目录名 ${personId}`);
  requireValue(typeof value.event?.encounterId === "string" && value.event.encounterId.trim(), file, "event.encounterId");
  requireValue(EVENT_TYPES.has(value.event?.type), file, "event.type");
  requireValue(isDate(value.event?.date), file, "event.date", "必须是有效 YYYY-MM-DD 日期");
  requireValue(typeof value.event?.source === "string" && value.event.source.trim(), file, "event.source");
  requireValue(value.event.title === undefined || typeof value.event.title === "string" && value.event.title.trim(), file, "event.title");
  requireValue(value.event.clinicalSummary === undefined || typeof value.event.clinicalSummary === "string" && value.event.clinicalSummary.trim(), file, "event.clinicalSummary");
  requireValue(Array.isArray(value.event?.reports) && value.event.reports.length > 0, file, "event.reports", "必须是非空数组");
  const reportIds = new Set();
  const reportPages = new Map();
  for (const [index, report] of value.event.reports.entries()) {
    const prefix = `event.reports[${index}]`;
    requireValue(typeof report?.reportId === "string" && report.reportId.trim(), file, `${prefix}.reportId`);
    requireValue(!reportIds.has(report.reportId), file, `${prefix}.reportId`, "不得重复");
    requireValue(typeof report.sourceFile === "string" && report.sourceFile.trim(), file, `${prefix}.sourceFile`);
    requireValue(Array.isArray(report.pageRefs) && report.pageRefs.length > 0 && report.pageRefs.every((page) => Number.isInteger(page) && page > 0), file, `${prefix}.pageRefs`, "必须是非空正整数数组");
    reportIds.add(report.reportId);
    reportPages.set(report.reportId, new Set(report.pageRefs));
  }
  requireValue(value.event.diagnoses === undefined || Array.isArray(value.event.diagnoses), file, "event.diagnoses", "必须是数组");
  const diagnosisIds = new Set();
  for (const [index, diagnosis] of (value.event.diagnoses || []).entries()) {
    const prefix = `event.diagnoses[${index}]`;
    requireValue(typeof diagnosis?.diagnosisId === "string" && diagnosis.diagnosisId.trim(), file, `${prefix}.diagnosisId`);
    requireValue(!diagnosisIds.has(diagnosis.diagnosisId), file, `${prefix}.diagnosisId`, "不得重复");
    requireValue(typeof diagnosis.name === "string" && diagnosis.name.trim(), file, `${prefix}.name`);
    requireValue(DIAGNOSIS_STATUSES.has(diagnosis.status), file, `${prefix}.status`);
    requireValue(reportIds.has(diagnosis.reportId), file, `${prefix}.reportId`, "必须引用本文件 event.reports 中的 reportId");
    requireValue(Number.isInteger(diagnosis.page) && diagnosis.page > 0, file, `${prefix}.page`);
    requireValue(reportPages.get(diagnosis.reportId)?.has(diagnosis.page), file, `${prefix}.page`, "必须出现在所引用报告的 pageRefs 中");
    requireValue(diagnosis.note === undefined || typeof diagnosis.note === "string" && diagnosis.note.trim(), file, `${prefix}.note`);
    diagnosisIds.add(diagnosis.diagnosisId);
  }
  requireValue(Array.isArray(value.measurements), file, "measurements", "必须是数组");
  const measurementIds = new Set();
  for (const [index, item] of value.measurements.entries()) {
    const prefix = `measurements[${index}]`;
    requireValue(typeof item?.measurementId === "string" && item.measurementId.trim(), file, `${prefix}.measurementId`);
    requireValue(!measurementIds.has(item.measurementId), file, `${prefix}.measurementId`, "不得重复");
    requireValue(reportIds.has(item.reportId), file, `${prefix}.reportId`, "必须引用本文件 event.reports 中的 reportId");
    requireValue(Number.isInteger(item.page) && item.page > 0, file, `${prefix}.page`);
    requireValue(reportPages.get(item.reportId)?.has(item.page), file, `${prefix}.page`, "必须出现在所引用报告的 pageRefs 中");
    requireValue(typeof item.standardName === "string" && item.standardName.trim(), file, `${prefix}.standardName`);
    requireValue(typeof item.originalName === "string" && item.originalName.trim(), file, `${prefix}.originalName`);
    requireValue(["number", "string"].includes(typeof item.value) || item.value === null, file, `${prefix}.value`);
    requireValue(item.numericValue === undefined || item.numericValue === null || Number.isFinite(item.numericValue), file, `${prefix}.numericValue`);
    requireValue(typeof item.unit === "string" || item.unit === null, file, `${prefix}.unit`);
    requireValue(typeof item.isAbnormal === "boolean", file, `${prefix}.isAbnormal`);
    requireValue(Array.isArray(item.organs) && item.organs.length > 0 && item.organs.every((organ) => ORGAN_SYSTEMS.has(organ)), file, `${prefix}.organs`);
    measurementIds.add(item.measurementId);
  }
  return value;
}

function validateAnalysis(file, personId) {
  const value = readJson(file);
  requireValue(value?.personId === personId, file, "personId", `必须等于 ${personId}`);
  requireValue(Array.isArray(value.organAnalyses), file, "organAnalyses", "必须是数组");
  requireValue(value.crossOrganInsights === undefined || Array.isArray(value.crossOrganInsights) && value.crossOrganInsights.every((item) => typeof item === "string"), file, "crossOrganInsights", "必须是字符串数组");
  requireValue(value.actionSuggestions === undefined || Array.isArray(value.actionSuggestions) && value.actionSuggestions.every((item) => typeof item === "string"), file, "actionSuggestions", "必须是字符串数组");
  const organs = new Set();
  for (const [index, item] of value.organAnalyses.entries()) {
    requireValue(ORGAN_SYSTEMS.has(item?.organ), file, `organAnalyses[${index}].organ`);
    requireValue(!organs.has(item.organ), file, `organAnalyses[${index}].organ`, "不得重复");
    organs.add(item.organ);
    requireValue(HEALTH_STATUSES.has(item?.status), file, `organAnalyses[${index}].status`);
    requireValue(typeof item?.narrative === "string" && item.narrative.trim(), file, `organAnalyses[${index}].narrative`);
    requireValue(Array.isArray(item?.keyIndicators), file, `organAnalyses[${index}].keyIndicators`, "必须是数组");
    for (const [indicatorIndex, indicator] of item.keyIndicators.entries()) {
      const prefix = `organAnalyses[${index}].keyIndicators[${indicatorIndex}]`;
      requireValue(typeof indicator?.name === "string" && indicator.name.trim(), file, `${prefix}.name`);
      requireValue(["number", "string"].includes(typeof indicator.latestValue) || indicator.latestValue === null, file, `${prefix}.latestValue`);
      requireValue(typeof indicator.unit === "string", file, `${prefix}.unit`);
      requireValue(new Set(["up", "down", "stable", "not-comparable"]).has(indicator.trend), file, `${prefix}.trend`);
      requireValue(typeof indicator.isAbnormal === "boolean", file, `${prefix}.isAbnormal`);
      requireValue(Array.isArray(indicator.history), file, `${prefix}.history`, "必须是数组");
      for (const [historyIndex, point] of indicator.history.entries()) {
        requireValue(isDate(point?.date), file, `${prefix}.history[${historyIndex}].date`);
        requireValue(["number", "string"].includes(typeof point?.value) || point?.value === null, file, `${prefix}.history[${historyIndex}].value`);
      }
    }
  }
  return value;
}

function validateOptionalStage(file, personId, stage, references = null) {
  if (!fs.existsSync(file)) return null;
  const value = readJson(file);
  requireValue(value?.personId === personId, file, "personId", `必须等于 ${personId}`);
  if (stage === "suggestions") {
    requireValue(Array.isArray(value.reviewSuggestions), file, "reviewSuggestions", "必须是数组");
    for (const [index, item] of value.reviewSuggestions.entries()) {
      const prefix = `reviewSuggestions[${index}]`;
      requireValue(new Set(["high", "medium", "low"]).has(item?.priority), file, `${prefix}.priority`);
      for (const field of ["organ", "what", "when", "where", "why"]) requireValue(typeof item?.[field] === "string" && item[field].trim(), file, `${prefix}.${field}`);
      requireValue(item.status === undefined || new Set(["ai_pending", "doctor_confirmed", "completed"]).has(item.status), file, `${prefix}.status`);
      requireValue(item.owner === undefined || typeof item.owner === "string" && item.owner.trim(), file, `${prefix}.owner`);
      requireValue(item.completedAt === undefined || typeof item.completedAt === "string" && !Number.isNaN(Date.parse(item.completedAt)), file, `${prefix}.completedAt`);
      requireValue(item.evidence === undefined || Array.isArray(item.evidence), file, `${prefix}.evidence`, "必须是数组");
      for (const [evidenceIndex, evidence] of (item.evidence || []).entries()) {
        const evidencePrefix = `${prefix}.evidence[${evidenceIndex}]`;
        requireValue(typeof evidence?.eventId === "string" && references.eventIds.has(evidence.eventId), file, `${evidencePrefix}.eventId`, "必须引用当前成员已有事件");
        requireValue(evidence.measurementIds === undefined || Array.isArray(evidence.measurementIds) && evidence.measurementIds.every((id) => references.measurementsByEvent.get(evidence.eventId)?.has(id)), file, `${evidencePrefix}.measurementIds`, "必须全部属于所引用事件");
      }
    }
  }
  if (stage === "lifestyle") {
    requireValue(new Set(["high", "partial", "insufficient"]).has(value.dataConfidence), file, "dataConfidence");
  }
  return value;
}

function requireApproval(personId, stage, outputHash, dependencyHashes = {}) {
  if (mode !== "private") return;
  const file = path.join(dataDir, "manifests", `${personId}.json`);
  requireValue(fs.existsSync(file), file, "manifest", `缺少 ${personId} 的批准记录`);
  const manifest = readJson(file);
  requireValue(manifest?.schemaVersion === 1 && manifest.personId === personId, file, "personId/schemaVersion");
  const record = manifest.stages?.[stage];
  requireValue(record?.status === "approved", file, `stages.${stage}.status`, "必须为 approved");
  requireValue(record.outputHash === outputHash, file, `stages.${stage}.outputHash`, "与当前输出哈希不匹配，旧批准已失效");
  requireValue(typeof record.reviewer === "string" && record.reviewer.trim(), file, `stages.${stage}.reviewer`);
  requireValue(typeof record.approvedBy === "string" && record.approvedBy.trim(), file, `stages.${stage}.approvedBy`);
  requireValue(typeof record.approvedAt === "string" && !Number.isNaN(Date.parse(record.approvedAt)), file, `stages.${stage}.approvedAt`);
  for (const [dependency, hash] of Object.entries(dependencyHashes)) {
    requireValue(record.dependsOn?.[dependency] === hash, file, `stages.${stage}.dependsOn.${dependency}`, "上游版本已变化，当前批准已失效");
  }
}

const contextFile = path.join(dataDir, "family-context.json");
requireValue(fs.existsSync(contextFile), contextFile, "file", "不存在");
const context = validateContext(contextFile);
const contextHash = sha256(fs.readFileSync(contextFile));
const members = context.members;
const memberIds = new Set(members.map((member) => member.personId));
for (const directory of ["extracted", "analysis", "suggestions", "lifestyle", "manifests"]) {
  const stageDir = path.join(dataDir, directory);
  if (!fs.existsSync(stageDir)) continue;
  for (const entry of fs.readdirSync(stageDir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    requireValue(!entry.isSymbolicLink(), stageDir, entry.name, "不允许符号链接");
    const personId = directory === "extracted" ? entry.name : path.basename(entry.name, ".json");
    requireValue(directory === "extracted" ? entry.isDirectory() : entry.isFile() && entry.name.endsWith(".json"), stageDir, entry.name, "目录结构不符合数据契约");
    requireValue(memberIds.has(personId), stageDir, entry.name, "没有对应的 family-context 成员");
  }
}
const allData = {};

for (const member of members) {
  const { personId } = member;
  const extractedFiles = jsonFiles(path.join(dataDir, "extracted", personId));
  const analysisFile = path.join(dataDir, "analysis", `${personId}.json`);
  const suggestionsFile = path.join(dataDir, "suggestions", `${personId}.json`);
  const lifestyleFile = path.join(dataDir, "lifestyle", `${personId}.json`);
  const extractionHash = hashFiles(extractedFiles);
  if (extractedFiles.length > 0) requireApproval(personId, "extract", extractionHash, { context: contextHash });

  const encounters = new Map();
  const seenReports = new Set();
  const seenMeasurements = new Set();
  const seenDiagnoses = new Set();
  for (const file of extractedFiles) {
    const extracted = validateExtraction(file, personId);
    const { event } = extracted;
    let encounter = encounters.get(event.encounterId);
    if (!encounter) {
      encounter = {
        id: `${personId}:${event.encounterId}`,
        encounterId: event.encounterId,
        date: event.date,
        type: event.type,
        source: event.source,
        title: event.title,
        clinicalSummary: event.clinicalSummary,
        personId,
        reports: [],
        diagnoses: [],
        measurements: [],
      };
      encounters.set(event.encounterId, encounter);
    } else {
      requireValue(encounter.date === event.date && encounter.type === event.type && encounter.source === event.source, file, "event", "同一 encounterId 的日期、类型和机构必须一致");
      requireValue(event.title === undefined || encounter.title === undefined || encounter.title === event.title, file, "event.title", "同一 encounterId 的标题必须一致");
      requireValue(event.clinicalSummary === undefined || encounter.clinicalSummary === undefined || encounter.clinicalSummary === event.clinicalSummary, file, "event.clinicalSummary", "同一 encounterId 的病例摘要必须一致");
      encounter.title ||= event.title;
      encounter.clinicalSummary ||= event.clinicalSummary;
    }
    for (const report of event.reports) {
      requireValue(!seenReports.has(report.reportId), file, "event.reports[].reportId", `全成员范围内重复: ${report.reportId}`);
      seenReports.add(report.reportId);
      encounter.reports.push({ reportId: report.reportId, pageRefs: report.pageRefs });
    }
    for (const diagnosis of event.diagnoses || []) {
      requireValue(!seenDiagnoses.has(diagnosis.diagnosisId), file, "event.diagnoses[].diagnosisId", `全成员范围内重复: ${diagnosis.diagnosisId}`);
      seenDiagnoses.add(diagnosis.diagnosisId);
      encounter.diagnoses.push(diagnosis);
    }
    for (const measurement of extracted.measurements) {
      requireValue(!seenMeasurements.has(measurement.measurementId), file, "measurements[].measurementId", `全成员范围内重复: ${measurement.measurementId}`);
      seenMeasurements.add(measurement.measurementId);
      encounter.measurements.push(measurement);
    }
  }

  const events = [...encounters.values()].map((encounter) => ({
    id: encounter.id, encounterId: encounter.encounterId, date: encounter.date, type: encounter.type, source: encounter.source, personId,
    ...(encounter.title ? { title: encounter.title } : {}),
    ...(encounter.clinicalSummary ? { clinicalSummary: encounter.clinicalSummary } : {}),
    reports: encounter.reports,
    diagnoses: encounter.diagnoses,
    organTags: [...new Set(encounter.measurements.flatMap((item) => item.organs))],
    measurementCount: encounter.measurements.length,
    abnormalCount: encounter.measurements.filter((item) => item.isAbnormal).length,
  })).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  const measurements = Object.fromEntries([...encounters.values()].map((encounter) => [encounter.id, encounter.measurements]));

  let analysis = null;
  let analysisHash = null;
  if (fs.existsSync(analysisFile)) {
    requireValue(extractedFiles.length > 0, analysisFile, "analysis", "没有提取事实时不能发布分析");
    analysisHash = sha256(fs.readFileSync(analysisFile));
    requireApproval(personId, "analysis", analysisHash, { context: contextHash, extract: extractionHash });
    analysis = validateAnalysis(analysisFile, personId);
  }
  let suggestions = null;
  if (fs.existsSync(suggestionsFile)) {
    requireValue(Boolean(analysisHash), suggestionsFile, "suggestions", "没有当前分析时不能发布建议");
    const suggestionsHash = sha256(fs.readFileSync(suggestionsFile));
    requireApproval(personId, "suggestions", suggestionsHash, { context: contextHash, analysis: analysisHash });
    const eventIds = new Set(events.map((event) => event.id));
    const measurementsByEvent = new Map(Object.entries(measurements).map(([eventId, items]) => [eventId, new Set(items.map((item) => item.measurementId))]));
    suggestions = validateOptionalStage(suggestionsFile, personId, "suggestions", { eventIds, measurementsByEvent });
  }
  let lifestyle = null;
  if (fs.existsSync(lifestyleFile)) {
    requireValue(Boolean(analysisHash), lifestyleFile, "lifestyle", "没有当前分析时不能发布生活指南");
    const lifestyleHash = sha256(fs.readFileSync(lifestyleFile));
    requireApproval(personId, "lifestyle", lifestyleHash, { context: contextHash, analysis: analysisHash });
    lifestyle = validateOptionalStage(lifestyleFile, personId, "lifestyle");
    if (analysisFile) {
      const expectedMd5 = crypto.createHash("md5").update(fs.readFileSync(analysisFile)).digest("hex");
      requireValue(lifestyle.sourceAnalysisHash === expectedMd5, lifestyleFile, "sourceAnalysisHash", "与当前分析不匹配，生活指南已过期");
    }
  }

  const statuses = analysis?.organAnalyses?.map((item) => item.status) || [];
  const overallStatus = !analysis || statuses.length === 0 ? "unknown" : statuses.includes("alert") ? "alert" : statuses.includes("attention") ? "attention" : "normal";
  const years = events.map((event) => event.date.slice(0, 4)).sort();
  const yearSpan = years.length === 0 ? "" : years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`;
  allData[personId] = {
    analysis, suggestions, lifestyle, events, measurements, overallStatus,
    reviewStatus: mode === "demo" ? "demo" : analysis ? "approved" : "not_reviewed",
    lastCheckup: events[0]?.date || "", dataSpan: events.length > 0 ? `${events.length}次检查 · ${yearSpan}` : "暂无数据",
  };
}

const json = (value) => JSON.stringify(value, null, 2);
const generated = `// 自动生成，请勿手动编辑
// 发布模式: ${mode}

export type HealthStatus = "unknown" | "normal" | "attention" | "alert";
export type ReviewStatus = "demo" | "approved" | "not_reviewed";
export type AnalysisData = { personId: string; crossOrganInsights?: string[]; actionSuggestions?: string[]; organAnalyses: Array<{ organ: string; status: string; narrative: string; keyIndicators: Array<{ name: string; latestValue: number | string | null; unit: string; referenceRange?: string; trend: string; isAbnormal: boolean; history: Array<{ date: string; value: number | string | null }> }> }>; [key: string]: unknown };
export type LifestyleData = Record<string, any>;
export type SuggestionData = { personId: string; reviewSuggestions: Array<{ priority: string; organ: string; what: string; when: string; where: string; why: string; status?: "ai_pending" | "doctor_confirmed" | "completed"; owner?: string; completedAt?: string; evidence?: Array<{ eventId: string; measurementIds?: string[] }> }>; [key: string]: unknown };

export interface FamilyMember { id: string; name: string; status: HealthStatus; reviewStatus: ReviewStatus; lastCheckup: string; dataSpan: string; }
export interface ReportEvidence { reportId: string; pageRefs: number[]; }
export interface DiagnosisEvidence { diagnosisId: string; name: string; status: "confirmed" | "under_evaluation" | "resolved"; reportId: string; page: number; note?: string; }
export interface HealthEvent { id: string; encounterId: string; date: string; type: string; source: string; title?: string; clinicalSummary?: string; personId: string; reports: ReportEvidence[]; diagnoses: DiagnosisEvidence[]; organTags: string[]; measurementCount: number; abnormalCount: number; }
export interface MeasurementItem { measurementId: string; reportId: string; page: number; standardName: string; originalName: string; value: number | string | null; numericValue?: number | null; unit: string | null; referenceRange?: { low?: number; high?: number; text?: string }; isAbnormal: boolean; organs: string[]; }

export const BUILD_METADATA = ${json({ mode, schemaVersion: 1, containsSyntheticData: mode === "demo" })} as const;
export const FAMILY_MEMBERS: FamilyMember[] = ${json(members.map(({ personId, displayName }) => ({ id: personId, name: displayName, status: allData[personId].overallStatus, reviewStatus: allData[personId].reviewStatus, lastCheckup: allData[personId].lastCheckup, dataSpan: allData[personId].dataSpan })))};
export const ANALYSIS_DATA: Record<string, AnalysisData> = ${json(Object.fromEntries(members.filter(({ personId }) => allData[personId].analysis).map(({ personId }) => [personId, allData[personId].analysis])))};
export const EVENTS_DATA: Record<string, HealthEvent[]> = ${json(Object.fromEntries(members.map(({ personId }) => [personId, allData[personId].events])))};
export const MEASUREMENTS_DATA: Record<string, Record<string, MeasurementItem[]>> = ${json(Object.fromEntries(members.map(({ personId }) => [personId, allData[personId].measurements])))};
export const SUGGESTIONS_DATA: Record<string, SuggestionData | null> = ${json(Object.fromEntries(members.map(({ personId }) => [personId, allData[personId].suggestions])))};
export const LIFESTYLE_DATA: Record<string, LifestyleData | null> = ${json(Object.fromEntries(members.map(({ personId }) => [personId, allData[personId].lifestyle])))};

export function getAnalysis(personId: string): AnalysisData | undefined { return ANALYSIS_DATA[personId]; }
export function getEvents(personId: string): HealthEvent[] { return EVENTS_DATA[personId] || []; }
export function getMeasurements(personId: string, eventId: string): MeasurementItem[] { return MEASUREMENTS_DATA[personId]?.[eventId] || []; }
export function getSuggestions(personId: string): SuggestionData | null { return SUGGESTIONS_DATA[personId] || null; }
export function getLifestyle(personId: string): LifestyleData | null { return LIFESTYLE_DATA[personId] || null; }
`;

const publicMembers = members.map(({ personId, displayName, role = "家庭成员", avatar }) => ({
  id: personId,
  name: displayName,
  role,
  ...(avatar ? { avatar } : {}),
  status: allData[personId].overallStatus,
  reviewStatus: allData[personId].reviewStatus,
  lastCheckup: allData[personId].lastCheckup,
  dataSpan: allData[personId].dataSpan,
}));
const finalGenerated = generated
  .replace(
    "export interface FamilyMember { id: string; name: string; status: HealthStatus; reviewStatus: ReviewStatus; lastCheckup: string; dataSpan: string; }",
    "export interface FamilyMember { id: string; name: string; role: string; avatar?: string; status: HealthStatus; reviewStatus: ReviewStatus; lastCheckup: string; dataSpan: string; }",
  )
  .replace(
    /export const FAMILY_MEMBERS: FamilyMember\[\] = [\s\S]*?;\nexport const ANALYSIS_DATA/,
    `export const FAMILY_MEMBERS: FamilyMember[] = ${json(publicMembers)};\nexport const ANALYSIS_DATA`,
  );

fs.mkdirSync(path.dirname(output), { recursive: true });
const temporary = `${output}.${process.pid}.tmp`;
fs.writeFileSync(temporary, finalGenerated);
fs.renameSync(temporary, output);
console.log(`已生成 ${path.relative(projectRoot, output)}: ${members.length} 位成员，${Object.values(allData).reduce((sum, item) => sum + item.events.length, 0)} 个事件（${mode}）`);
