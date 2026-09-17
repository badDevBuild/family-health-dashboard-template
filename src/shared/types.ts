// 器官系统枚举
export type OrganSystem =
  | "心血管"
  | "代谢/内分泌"
  | "肝胆"
  | "肾脏/泌尿"
  | "消化"
  | "血液"
  | "肺/呼吸"
  | "眼/五官";

// 健康状态
export type HealthStatus = "normal" | "attention" | "alert";

// 家庭成员
export interface Person {
  id: string;
  name: string;
  relation?: string; // "自己", "父亲", "母亲", "妻子"
}

// 健康事件（一次体检/就医）
export interface HealthEvent {
  id: string;
  personId: string;
  type: "体检" | "就医" | "手动备注";
  date: string; // YYYY-MM-DD
  source?: string; // 医院/体检中心名称
  sourceFiles: string[]; // 原始 PDF 路径
  measurements: Measurement[];
  summary?: string; // LLM 生成的事件摘要
}

// 单项指标测量
export interface Measurement {
  id: string;
  eventId: string;
  standardName: string; // 标准化名称
  originalName: string; // 原始报告中的名称
  value: number | string; // 数值或定性结果如"阴性"
  numericValue?: number; // 仅数值型指标
  unit: string;
  referenceRange?: {
    low?: number;
    high?: number;
    text?: string; // 非数值型参考范围如"阴性"
  };
  isAbnormal: boolean;
  organs: OrganSystem[];
}

// 已处理文件记录（防重复提取）
export interface ProcessedFile {
  sourceFilePath: string;
  fileHash: string; // SHA-256
  processedAt: string; // ISO datetime
  eventId: string;
}

// 个人背景信息
export interface PersonContext {
  gender: "男" | "女";
  age: number;
  dataSpan: string; // 如 "5次体检（2021-2025）"
  note?: string;
}

// 分析报告（按人存储）
export interface AnalysisReport {
  personId: string;
  analysisDate: string; // ISO datetime
  personContext: PersonContext;
  organAnalyses: OrganAnalysis[];
  crossOrganInsights: string[]; // 跨器官关联发现
  actionSuggestions: string[]; // 行动建议（止步于"建议就医"）
  dataHash: string; // 输入数据 hash，检测是否需要重新分析
}

// 健康建议报告（按人存储，基于分析结论生成）
export interface SuggestionReport {
  personId: string;
  suggestionDate: string; // ISO datetime
  basedOnAnalysis: string; // 依据的分析报告日期
  personContext: PersonContext;
  reviewSuggestions: ReviewSuggestion[];
  watchItems: WatchItem[];
  lifestyleDirections: LifestyleDirection[];
  nextCheckup: NextCheckup;
}

// 复查建议
export interface ReviewSuggestion {
  priority: "high" | "medium" | "low";
  organ: string;
  what: string; // 建议复查什么
  when: string; // 建议什么时候
  where: string; // 建议哪个科室
  why: string; // 为什么建议（一句话）
}

// 日常关注事项
export interface WatchItem {
  organ: string;
  description: string;
  selfCheck: string; // 日常自我观察要点
}

// 生活方式方向（大方向，不给具体数值处方）
export interface LifestyleDirection {
  area: "饮食" | "运动" | "作息" | "其他";
  direction: string;
  relatedOrgan: string;
}

// 下次体检提醒
export interface NextCheckup {
  lastCheckupDate: string;
  suggestedNextDate: string;
  focusItems: string[]; // 下次体检重点关注项目
}

// 单个器官系统的分析结论
export interface OrganAnalysis {
  organ: OrganSystem;
  status: HealthStatus;
  narrative: string; // LLM 生成的综合叙事
  keyIndicators: IndicatorSummary[];
}

// 指标摘要（用于器官分析中的关键指标展示）
export interface IndicatorSummary {
  name: string;
  latestValue: number | string;
  unit: string;
  trend: "up" | "down" | "stable";
  isAbnormal: boolean;
  history: { date: string; value: number | string }[];
}

// 提取任务（扫描器输出）
export interface ExtractionTask {
  person: string;
  date: string; // YYYY-MM-DD
  files: string[]; // PDF 文件路径
}

// 提取结果（单次事件）
export interface ExtractionResult {
  person: string;
  event: {
    type: "体检" | "就医";
    date: string;
    source: string;
    sourceFiles: string[];
  };
  measurements: Array<{
    standardName: string;
    originalName: string;
    value: number | string;
    numericValue?: number;
    unit: string;
    referenceRange?: {
      low?: number;
      high?: number;
      text?: string;
    };
    isAbnormal: boolean;
    organs: OrganSystem[];
  }>;
}
