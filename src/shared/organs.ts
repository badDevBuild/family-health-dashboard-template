import type { OrganSystem } from "./types.js";

// 指标定义：标准名称、别名、单位、参考范围、关联器官
export interface IndicatorDefinition {
  standardName: string;
  aliases: string[]; // 不同医院可能使用的名称
  standardUnit: string;
  referenceRange?: { low?: number; high?: number };
  organs: OrganSystem[];
}

// 核心指标字典（~30 个常见体检指标）
export const INDICATOR_DICTIONARY: IndicatorDefinition[] = [
  // ===== 心血管 =====
  {
    standardName: "收缩压",
    aliases: ["SBP", "收缩压", "高压"],
    standardUnit: "mmHg",
    referenceRange: { high: 130 },
    organs: ["心血管"],
  },
  {
    standardName: "舒张压",
    aliases: ["DBP", "舒张压", "低压"],
    standardUnit: "mmHg",
    referenceRange: { high: 85 },
    organs: ["心血管"],
  },
  {
    standardName: "心率",
    aliases: ["HR", "心率", "脉搏", "脉率"],
    standardUnit: "次/分",
    referenceRange: { low: 60, high: 100 },
    organs: ["心血管"],
  },
  {
    standardName: "总胆固醇",
    aliases: ["TC", "CHOL", "总胆固醇", "胆固醇", "胆固醇（总）"],
    standardUnit: "mmol/L",
    referenceRange: { high: 5.2 },
    organs: ["心血管"],
  },
  {
    standardName: "低密度脂蛋白胆固醇",
    aliases: ["LDL-C", "LDL", "低密度脂蛋白", "低密度脂蛋白胆固醇"],
    standardUnit: "mmol/L",
    referenceRange: { high: 3.4 },
    organs: ["心血管"],
  },
  {
    standardName: "高密度脂蛋白胆固醇",
    aliases: ["HDL-C", "HDL", "高密度脂蛋白", "高密度脂蛋白胆固醇"],
    standardUnit: "mmol/L",
    referenceRange: { low: 1.0 },
    organs: ["心血管"],
  },
  {
    standardName: "甘油三酯",
    aliases: ["TG", "甘油三酯", "三酰甘油"],
    standardUnit: "mmol/L",
    referenceRange: { high: 1.7 },
    organs: ["心血管"],
  },

  // ===== 代谢/内分泌 =====
  {
    standardName: "空腹血糖",
    aliases: ["FPG", "GLU", "FBG", "葡萄糖", "空腹血糖", "血糖"],
    standardUnit: "mmol/L",
    referenceRange: { low: 3.9, high: 6.1 },
    organs: ["代谢/内分泌", "心血管"],
  },
  {
    standardName: "糖化血红蛋白",
    aliases: ["HbA1c", "糖化血红蛋白", "糖化"],
    standardUnit: "%",
    referenceRange: { high: 6.0 },
    organs: ["代谢/内分泌"],
  },
  {
    standardName: "尿酸",
    aliases: ["UA", "尿酸", "血尿酸"],
    standardUnit: "μmol/L",
    referenceRange: { high: 420 },
    organs: ["代谢/内分泌", "肾脏/泌尿"],
  },
  {
    standardName: "BMI",
    aliases: ["BMI", "体质指数", "体重指数"],
    standardUnit: "kg/m²",
    referenceRange: { low: 18.5, high: 24.0 },
    organs: ["代谢/内分泌", "心血管"],
  },
  {
    standardName: "促甲状腺激素",
    aliases: ["TSH", "促甲状腺激素", "促甲状腺素"],
    standardUnit: "mIU/L",
    referenceRange: { low: 0.27, high: 4.2 },
    organs: ["代谢/内分泌"],
  },
  {
    standardName: "游离甲状腺素",
    aliases: ["FT4", "游离T4", "游离甲状腺素"],
    standardUnit: "pmol/L",
    referenceRange: { low: 12.0, high: 22.0 },
    organs: ["代谢/内分泌"],
  },

  // ===== 肝胆 =====
  {
    standardName: "谷丙转氨酶",
    aliases: ["ALT", "GPT", "谷丙转氨酶", "丙氨酸氨基转移酶"],
    standardUnit: "U/L",
    referenceRange: { high: 40 },
    organs: ["肝胆"],
  },
  {
    standardName: "谷草转氨酶",
    aliases: ["AST", "GOT", "谷草转氨酶", "天门冬氨酸氨基转移酶"],
    standardUnit: "U/L",
    referenceRange: { high: 40 },
    organs: ["肝胆"],
  },
  {
    standardName: "谷氨酰转肽酶",
    aliases: ["GGT", "γ-GT", "谷氨酰转肽酶", "γ-谷氨酰转肽酶"],
    standardUnit: "U/L",
    referenceRange: { high: 60 },
    organs: ["肝胆"],
  },
  {
    standardName: "总胆红素",
    aliases: ["TBIL", "总胆红素"],
    standardUnit: "μmol/L",
    referenceRange: { high: 26.0 },
    organs: ["肝胆"],
  },

  // ===== 肾脏/泌尿 =====
  {
    standardName: "肌酐",
    aliases: ["Cr", "CREA", "肌酐", "血肌酐"],
    standardUnit: "μmol/L",
    referenceRange: { low: 44, high: 133 },
    organs: ["肾脏/泌尿"],
  },
  {
    standardName: "尿素氮",
    aliases: ["BUN", "UREA", "尿素", "尿素氮", "血尿素氮"],
    standardUnit: "mmol/L",
    referenceRange: { low: 2.6, high: 7.5 },
    organs: ["肾脏/泌尿"],
  },

  // ===== 血液 =====
  {
    standardName: "白细胞计数",
    aliases: ["WBC", "白细胞", "白细胞计数"],
    standardUnit: "×10⁹/L",
    referenceRange: { low: 3.5, high: 9.5 },
    organs: ["血液"],
  },
  {
    standardName: "红细胞计数",
    aliases: ["RBC", "红细胞", "红细胞计数"],
    standardUnit: "×10¹²/L",
    referenceRange: { low: 4.3, high: 5.8 },
    organs: ["血液"],
  },
  {
    standardName: "血红蛋白",
    aliases: ["Hb", "HGB", "血红蛋白"],
    standardUnit: "g/L",
    referenceRange: { low: 130, high: 175 },
    organs: ["血液"],
  },
  {
    standardName: "血小板计数",
    aliases: ["PLT", "血小板", "血小板计数"],
    standardUnit: "×10⁹/L",
    referenceRange: { low: 125, high: 350 },
    organs: ["血液"],
  },

  // ===== 消化 =====
  {
    standardName: "幽门螺杆菌",
    aliases: ["Hp", "HP", "幽门螺杆菌", "幽门螺旋杆菌", "C13", "C14"],
    standardUnit: "",
    organs: ["消化"],
  },

  // ===== 肺/呼吸 =====
  // 胸片/CT 通常是定性结果，不在数值字典中

  // ===== 眼/五官 =====
  {
    standardName: "左眼视力",
    aliases: ["左眼视力", "左视力", "OS"],
    standardUnit: "",
    organs: ["眼/五官"],
  },
  {
    standardName: "右眼视力",
    aliases: ["右眼视力", "右视力", "OD"],
    standardUnit: "",
    organs: ["眼/五官"],
  },
];

// 器官系统显示配置
export const ORGAN_SYSTEMS: {
  name: OrganSystem;
  icon: string;
  coreIndicators: string[]; // 在卡片上优先显示的指标
}[] = [
  {
    name: "心血管",
    icon: "♡",
    coreIndicators: ["收缩压", "低密度脂蛋白胆固醇"],
  },
  {
    name: "代谢/内分泌",
    icon: "◈",
    coreIndicators: ["空腹血糖", "尿酸"],
  },
  { name: "肝胆", icon: "◆", coreIndicators: ["谷丙转氨酶", "谷草转氨酶"] },
  { name: "肾脏/泌尿", icon: "◉", coreIndicators: ["肌酐", "尿素氮"] },
  { name: "消化", icon: "○", coreIndicators: ["幽门螺杆菌"] },
  {
    name: "血液",
    icon: "●",
    coreIndicators: ["白细胞计数", "血红蛋白"],
  },
  { name: "肺/呼吸", icon: "△", coreIndicators: [] },
  { name: "眼/五官", icon: "◇", coreIndicators: ["左眼视力", "右眼视力"] },
];

// 根据别名查找标准指标定义
export function findIndicator(name: string): IndicatorDefinition | undefined {
  const normalized = name.trim();
  return INDICATOR_DICTIONARY.find(
    (ind) =>
      ind.standardName === normalized ||
      ind.aliases.some(
        (alias) => alias.toLowerCase() === normalized.toLowerCase(),
      ),
  );
}
