import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const dataDir = process.env.HEALTH_DATA_DIR || "data";
const output = process.env.HEALTH_DATA_OUTPUT || "src/lib/health-data.ts";

function readJson(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
}

function fileStemNames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.basename(entry.name, ".json"));
}

function directoryNames(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function discoverMembers() {
  const context = readJson(path.join(dataDir, "family-context.json"));
  const fromContext = context?.members ? Object.keys(context.members) : [];
  const discovered = new Set([
    ...fileStemNames(path.join(dataDir, "analysis")),
    ...fileStemNames(path.join(dataDir, "suggestions")),
    ...fileStemNames(path.join(dataDir, "lifestyle")),
    ...directoryNames(path.join(dataDir, "extracted")),
  ]);
  const remaining = [...discovered]
    .filter((name) => !fromContext.includes(name))
    .sort((a, b) => a.localeCompare(b, "zh-CN"));
  return [...fromContext, ...remaining];
}

const members = discoverMembers();
if (members.length === 0) {
  throw new Error(`在 ${dataDir} 中未发现任何成员数据`);
}

const allData = {};

for (const name of members) {
  const analysisFile = path.join(dataDir, "analysis", `${name}.json`);
  const lifestyleFile = path.join(dataDir, "lifestyle", `${name}.json`);
  const extractedDir = path.join(dataDir, "extracted", name);
  const analysis = readJson(analysisFile);
  const lifestyle = readJson(lifestyleFile);
  const events = [];
  const measurements = {};

  if (fs.existsSync(extractedDir)) {
    const files = fs.readdirSync(extractedDir).filter((file) => file.endsWith(".json"));
    for (const file of files) {
      const extracted = readJson(path.join(extractedDir, file));
      if (!extracted?.event?.date || !Array.isArray(extracted.measurements)) continue;
      const id = `${name}-${extracted.event.date}`;
      const organs = [...new Set(extracted.measurements.flatMap((item) => item.organs || []))];
      events.push({
        id,
        date: extracted.event.date,
        type: extracted.event.type,
        source: extracted.event.source,
        person: name,
        organTags: organs,
        measurementCount: extracted.measurements.length,
        abnormalCount: extracted.measurements.filter((item) => item.isAbnormal).length,
      });
      measurements[id] = extracted.measurements;
    }
  }

  events.sort((a, b) => b.date.localeCompare(a.date));
  const statuses = analysis?.organAnalyses?.map((item) => item.status) || [];
  const overallStatus = statuses.includes("alert")
    ? "alert"
    : statuses.includes("attention")
      ? "attention"
      : "normal";

  if (analysis && lifestyle) {
    const expectedHash = crypto.createHash("md5").update(fs.readFileSync(analysisFile)).digest("hex");
    if (lifestyle.sourceAnalysisHash && lifestyle.sourceAnalysisHash !== expectedHash) {
      console.warn(`警告: ${name} 的生活指南与当前分析文件不匹配`);
    }
  }

  allData[name] = {
    analysis,
    lifestyle,
    events,
    measurements,
    overallStatus,
    lastCheckup: events[0]?.date || "",
    dataSpan: events.length > 0 ? `${events.length}次检查` : "暂无数据",
  };
}

const generated = `// 自动生成，请勿手动编辑\n// 数据源: ${dataDir}\n\ntype AnalysisData = Record<string, any>;\n\nexport interface FamilyMember {\n  name: string;\n  status: string;\n  lastCheckup: string;\n  dataSpan: string;\n}\n\nexport interface HealthEvent {\n  id: string;\n  date: string;\n  type: string;\n  source: string;\n  person: string;\n  organTags: string[];\n  measurementCount: number;\n  abnormalCount: number;\n}\n\nexport interface MeasurementItem {\n  standardName: string;\n  value: number | string | null;\n  unit: string | null;\n  isAbnormal: boolean;\n  organs: string[];\n  [key: string]: unknown;\n}\n\nexport const FAMILY_MEMBERS: FamilyMember[] = ${JSON.stringify(members.map((name) => ({
  name,
  status: allData[name].overallStatus,
  lastCheckup: allData[name].lastCheckup,
  dataSpan: allData[name].dataSpan,
})), null, 2)};\n\nexport const ANALYSIS_DATA: Record<string, AnalysisData> = ${JSON.stringify(Object.fromEntries(members.filter((name) => allData[name].analysis).map((name) => [name, allData[name].analysis])), null, 2)};\n\nexport const EVENTS_DATA: Record<string, HealthEvent[]> = ${JSON.stringify(Object.fromEntries(members.map((name) => [name, allData[name].events])), null, 2)};\n\nexport const MEASUREMENTS_DATA: Record<string, Record<string, MeasurementItem[]>> = ${JSON.stringify(Object.fromEntries(members.map((name) => [name, allData[name].measurements])), null, 2)};\n\nexport const LIFESTYLE_DATA: Record<string, Record<string, any> | null> = ${JSON.stringify(Object.fromEntries(members.map((name) => [name, allData[name].lifestyle])), null, 2)};\n\nexport function getAnalysis(name: string): AnalysisData | undefined {\n  return ANALYSIS_DATA[name];\n}\n\nexport function getEvents(name: string): HealthEvent[] {\n  return EVENTS_DATA[name] || [];\n}\n\nexport function getMeasurements(name: string, eventId: string): MeasurementItem[] {\n  return MEASUREMENTS_DATA[name]?.[eventId] || [];\n}\n\nexport function getLifestyle(name: string): Record<string, any> | null {\n  return LIFESTYLE_DATA[name] || null;\n}\n`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, generated);
console.log(`已生成 ${output}: ${members.length} 位成员，${Object.values(allData).reduce((sum, item) => sum + item.events.length, 0)} 个事件`);
