// 自动生成，请勿手动编辑
// 发布模式: demo

export type HealthStatus = "unknown" | "normal" | "attention" | "alert";
export type ReviewStatus = "demo" | "approved" | "not_reviewed";
export type AnalysisData = { personId: string; crossOrganInsights?: string[]; actionSuggestions?: string[]; organAnalyses: Array<{ organ: string; status: string; narrative: string; keyIndicators: Array<{ name: string; latestValue: number | string | null; unit: string; referenceRange?: string; trend: string; isAbnormal: boolean; history: Array<{ date: string; value: number | string | null }> }> }>; [key: string]: unknown };
export type LifestyleData = Record<string, any>;
export type SuggestionData = { personId: string; reviewSuggestions: Array<{ priority: string; organ: string; what: string; when: string; where: string; why: string; status?: "ai_pending" | "doctor_confirmed" | "completed"; owner?: string; completedAt?: string; evidence?: Array<{ eventId: string; measurementIds?: string[] }> }>; [key: string]: unknown };

export interface FamilyMember { id: string; name: string; role: string; avatar?: string; status: HealthStatus; reviewStatus: ReviewStatus; lastCheckup: string; dataSpan: string; }
export interface ReportEvidence { reportId: string; pageRefs: number[]; }
export interface HealthEvent { id: string; encounterId: string; date: string; type: string; source: string; personId: string; reports: ReportEvidence[]; organTags: string[]; measurementCount: number; abnormalCount: number; }
export interface MeasurementItem { measurementId: string; reportId: string; page: number; standardName: string; originalName: string; value: number | string | null; numericValue?: number | null; unit: string | null; referenceRange?: { low?: number; high?: number; text?: string }; isAbnormal: boolean; organs: string[]; }

export const BUILD_METADATA = {
  "mode": "demo",
  "schemaVersion": 1,
  "containsSyntheticData": true
} as const;
export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    "id": "demo-father",
    "name": "林远山",
    "role": "爸爸 · 45岁",
    "avatar": "avatars/demo-father.webp",
    "status": "attention",
    "reviewStatus": "demo",
    "lastCheckup": "2026-06-21",
    "dataSpan": "5次检查 · 2022–2026"
  },
  {
    "id": "demo-mother",
    "name": "苏青禾",
    "role": "妈妈 · 42岁",
    "avatar": "avatars/demo-mother.webp",
    "status": "normal",
    "reviewStatus": "demo",
    "lastCheckup": "2026-04-18",
    "dataSpan": "5次检查 · 2022–2026"
  },
  {
    "id": "demo-grandfather",
    "name": "林松年",
    "role": "爷爷 · 70岁",
    "avatar": "avatars/demo-grandfather.webp",
    "status": "normal",
    "reviewStatus": "demo",
    "lastCheckup": "2026-09-09",
    "dataSpan": "5次检查 · 2022–2026"
  },
  {
    "id": "demo-grandmother",
    "name": "周瑞云",
    "role": "奶奶 · 67岁",
    "avatar": "avatars/demo-grandmother.webp",
    "status": "attention",
    "reviewStatus": "demo",
    "lastCheckup": "2026-07-17",
    "dataSpan": "5次检查 · 2022–2026"
  },
  {
    "id": "demo-daughter",
    "name": "林小满",
    "role": "女儿 · 12岁",
    "avatar": "avatars/demo-daughter.webp",
    "status": "attention",
    "reviewStatus": "demo",
    "lastCheckup": "2026-08-20",
    "dataSpan": "5次检查 · 2022–2026"
  }
];
export const ANALYSIS_DATA: Record<string, AnalysisData> = {
  "demo-father": {
    "personId": "demo-father",
    "analysisDate": "2026-06-22T09:00:00+08:00",
    "personContext": {
      "gender": "男",
      "age": 45,
      "dataSpan": "5次检查（2022–2026）"
    },
    "organAnalyses": [
      {
        "organ": "心血管",
        "status": "attention",
        "narrative": "过去五年的血压整体在参考范围内，低密度脂蛋白胆固醇从 3.2 升到 3.7 后回落到 3.5 mmol/L，最新值仍略高于本次报告参考上限。变化方向正在改善，但是否需要进一步处理，应结合复查和医生意见判断。",
        "keyIndicators": [
          {
            "name": "低密度脂蛋白胆固醇",
            "latestValue": 3.5,
            "unit": "mmol/L",
            "referenceRange": "0–3.4",
            "trend": "up",
            "isAbnormal": true,
            "history": [
              {
                "date": "2022-06-18",
                "value": 3.2
              },
              {
                "date": "2023-06-20",
                "value": 3.4
              },
              {
                "date": "2024-06-22",
                "value": 3.6
              },
              {
                "date": "2025-06-19",
                "value": 3.7
              },
              {
                "date": "2026-06-21",
                "value": 3.5
              }
            ]
          },
          {
            "name": "收缩压",
            "latestValue": 132,
            "unit": "mmHg",
            "referenceRange": "90–139",
            "trend": "up",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-06-18",
                "value": 128
              },
              {
                "date": "2023-06-20",
                "value": 130
              },
              {
                "date": "2024-06-22",
                "value": 134
              },
              {
                "date": "2025-06-19",
                "value": 136
              },
              {
                "date": "2026-06-21",
                "value": 132
              }
            ]
          }
        ]
      },
      {
        "organ": "代谢/内分泌",
        "status": "normal",
        "narrative": "空腹血糖五年内从 5.4 到 5.7 mmol/L，仍在本次报告参考范围内。可以继续保持规律运动和饮食节奏，并在年度检查中观察是否持续变化。",
        "keyIndicators": [
          {
            "name": "空腹血糖",
            "latestValue": 5.7,
            "unit": "mmol/L",
            "referenceRange": "3.9–6.1",
            "trend": "up",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-06-18",
                "value": 5.4
              },
              {
                "date": "2023-06-20",
                "value": 5.5
              },
              {
                "date": "2024-06-22",
                "value": 5.7
              },
              {
                "date": "2025-06-19",
                "value": 5.9
              },
              {
                "date": "2026-06-21",
                "value": 5.7
              }
            ]
          }
        ]
      },
      {
        "organ": "肝胆",
        "status": "normal",
        "narrative": "谷丙转氨酶五次结果都在参考范围内，近两年还有小幅回落，目前没有需要特别提示的变化。",
        "keyIndicators": [
          {
            "name": "谷丙转氨酶",
            "latestValue": 27,
            "unit": "U/L",
            "referenceRange": "9–50",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-06-18",
                "value": 28
              },
              {
                "date": "2023-06-20",
                "value": 30
              },
              {
                "date": "2024-06-22",
                "value": 32
              },
              {
                "date": "2025-06-19",
                "value": 29
              },
              {
                "date": "2026-06-21",
                "value": 27
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [
      "【参考信息】心血管与代谢/内分泌指标会同时受到饮食、活动和体重变化影响，适合放在一起看长期趋势。"
    ],
    "actionSuggestions": [
      "下次年度检查继续复查血脂和空腹血糖；若 LDL 持续超出报告参考范围，建议带历年结果咨询医生。"
    ],
    "dataHash": "synthetic-demo-father-2022-2026"
  },
  "demo-mother": {
    "personId": "demo-mother",
    "analysisDate": "2026-04-19T09:00:00+08:00",
    "personContext": {
      "gender": "女",
      "age": 42,
      "dataSpan": "5次检查（2022–2026）"
    },
    "organAnalyses": [
      {
        "organ": "血液",
        "status": "normal",
        "narrative": "血红蛋白在 2024 年短暂低于参考下限，之后连续两年回升到 122 g/L；铁蛋白也同步回升。现阶段更像是已经改善的阶段性变化，仍适合在年度检查里继续观察。",
        "keyIndicators": [
          {
            "name": "血红蛋白",
            "latestValue": 122,
            "unit": "g/L",
            "referenceRange": "115–150",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-04-12",
                "value": 123
              },
              {
                "date": "2023-04-15",
                "value": 120
              },
              {
                "date": "2024-04-13",
                "value": 114
              },
              {
                "date": "2025-04-16",
                "value": 118
              },
              {
                "date": "2026-04-18",
                "value": 122
              }
            ]
          },
          {
            "name": "血清铁蛋白",
            "latestValue": 28,
            "unit": "ng/mL",
            "referenceRange": "15–150",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-04-12",
                "value": 30
              },
              {
                "date": "2023-04-15",
                "value": 26
              },
              {
                "date": "2024-04-13",
                "value": 17
              },
              {
                "date": "2025-04-16",
                "value": 22
              },
              {
                "date": "2026-04-18",
                "value": 28
              }
            ]
          }
        ]
      },
      {
        "organ": "代谢/内分泌",
        "status": "normal",
        "narrative": "维生素D逐年从 22 上升到 31 ng/mL，促甲状腺激素五年内保持稳定，均在本次报告参考范围内。",
        "keyIndicators": [
          {
            "name": "25-羟维生素D",
            "latestValue": 31,
            "unit": "ng/mL",
            "referenceRange": "20–100",
            "trend": "up",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-04-12",
                "value": 22
              },
              {
                "date": "2023-04-15",
                "value": 24
              },
              {
                "date": "2024-04-13",
                "value": 27
              },
              {
                "date": "2025-04-16",
                "value": 29
              },
              {
                "date": "2026-04-18",
                "value": 31
              }
            ]
          },
          {
            "name": "促甲状腺激素",
            "latestValue": 2,
            "unit": "mIU/L",
            "referenceRange": "0.27–4.2",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-04-12",
                "value": 2.1
              },
              {
                "date": "2023-04-15",
                "value": 2
              },
              {
                "date": "2024-04-13",
                "value": 2.2
              },
              {
                "date": "2025-04-16",
                "value": 2.1
              },
              {
                "date": "2026-04-18",
                "value": 2
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [
      "【参考信息】血液与代谢/内分泌指标整体稳定，2024 年的低值已经通过后续结果得到补充说明。"
    ],
    "actionSuggestions": [
      "保持年度复查；如果出现持续疲倦、心悸或月经量明显变化，可提前咨询医生。"
    ],
    "dataHash": "synthetic-demo-mother-2022-2026"
  },
  "demo-grandfather": {
    "personId": "demo-grandfather",
    "analysisDate": "2026-09-10T09:00:00+08:00",
    "personContext": {
      "gender": "男",
      "age": 70,
      "dataSpan": "5次检查（2022–2026）"
    },
    "organAnalyses": [
      {
        "organ": "心血管",
        "status": "normal",
        "narrative": "收缩压由 142 逐步下降到 134 mmHg，低密度脂蛋白胆固醇也从 3.7 下降到 3.1 mmol/L，最近三年都在本次报告参考范围内。方向稳定向好，仍要继续按医生建议监测。",
        "keyIndicators": [
          {
            "name": "收缩压",
            "latestValue": 134,
            "unit": "mmHg",
            "referenceRange": "90–139",
            "trend": "down",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-09-08",
                "value": 142
              },
              {
                "date": "2023-09-10",
                "value": 140
              },
              {
                "date": "2024-09-12",
                "value": 138
              },
              {
                "date": "2025-09-11",
                "value": 136
              },
              {
                "date": "2026-09-09",
                "value": 134
              }
            ]
          },
          {
            "name": "低密度脂蛋白胆固醇",
            "latestValue": 3.1,
            "unit": "mmol/L",
            "referenceRange": "0–3.4",
            "trend": "down",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-09-08",
                "value": 3.7
              },
              {
                "date": "2023-09-10",
                "value": 3.5
              },
              {
                "date": "2024-09-12",
                "value": 3.3
              },
              {
                "date": "2025-09-11",
                "value": 3.2
              },
              {
                "date": "2026-09-09",
                "value": 3.1
              }
            ]
          }
        ]
      },
      {
        "organ": "肾脏/泌尿",
        "status": "normal",
        "narrative": "血肌酐从 86 缓慢变化到 94 μmol/L，五次结果都在本次报告参考范围内。数值方向本身不等于好坏，建议继续用同类检查方法做年度比较。",
        "keyIndicators": [
          {
            "name": "血肌酐",
            "latestValue": 94,
            "unit": "μmol/L",
            "referenceRange": "57–111",
            "trend": "up",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-09-08",
                "value": 86
              },
              {
                "date": "2023-09-10",
                "value": 89
              },
              {
                "date": "2024-09-12",
                "value": 91
              },
              {
                "date": "2025-09-11",
                "value": 92
              },
              {
                "date": "2026-09-09",
                "value": 94
              }
            ]
          }
        ]
      },
      {
        "organ": "代谢/内分泌",
        "status": "normal",
        "narrative": "空腹血糖在 5.8–6.1 mmol/L 之间波动，最新为 5.9，仍在本次报告参考范围内。",
        "keyIndicators": [
          {
            "name": "空腹血糖",
            "latestValue": 5.9,
            "unit": "mmol/L",
            "referenceRange": "3.9–6.1",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-09-08",
                "value": 5.8
              },
              {
                "date": "2023-09-10",
                "value": 6
              },
              {
                "date": "2024-09-12",
                "value": 6.1
              },
              {
                "date": "2025-09-11",
                "value": 6
              },
              {
                "date": "2026-09-09",
                "value": 5.9
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [
      "【参考信息】心血管、代谢/内分泌和肾脏/泌尿指标适合一起长期观察，但单个方向变化不能替代医生判断。"
    ],
    "actionSuggestions": [
      "按既定节奏监测家庭血压，并在年度检查时复查血脂、血糖和肾功能。"
    ],
    "dataHash": "synthetic-demo-grandfather-2022-2026"
  },
  "demo-grandmother": {
    "personId": "demo-grandmother",
    "analysisDate": "2026-07-18T09:00:00+08:00",
    "personContext": {
      "gender": "女",
      "age": 67,
      "dataSpan": "5次检查（2022–2026）"
    },
    "organAnalyses": [
      {
        "organ": "代谢/内分泌",
        "status": "attention",
        "narrative": "维生素D从 18 上升到 30 ng/mL，已经回到本次报告参考范围；骨密度T值也从 -1.6 改善到 -1.3，但最新值仍低于报告参考下限。它提示需要继续关注骨骼健康，不等同于诊断。",
        "keyIndicators": [
          {
            "name": "25-羟维生素D",
            "latestValue": 30,
            "unit": "ng/mL",
            "referenceRange": "20–100",
            "trend": "up",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-10-15",
                "value": 18
              },
              {
                "date": "2023-10-14",
                "value": 19
              },
              {
                "date": "2024-10-12",
                "value": 23
              },
              {
                "date": "2025-10-18",
                "value": 27
              },
              {
                "date": "2026-07-17",
                "value": 30
              }
            ]
          },
          {
            "name": "骨密度T值",
            "latestValue": -1.3,
            "unit": "",
            "referenceRange": "≥ -1.0",
            "trend": "up",
            "isAbnormal": true,
            "history": [
              {
                "date": "2022-10-15",
                "value": -1.6
              },
              {
                "date": "2023-10-14",
                "value": -1.5
              },
              {
                "date": "2024-10-12",
                "value": -1.5
              },
              {
                "date": "2025-10-18",
                "value": -1.4
              },
              {
                "date": "2026-07-17",
                "value": -1.3
              }
            ]
          }
        ]
      },
      {
        "organ": "心血管",
        "status": "normal",
        "narrative": "总胆固醇连续五年缓慢下降，最近三次均在本次报告参考范围内，趋势较稳定。",
        "keyIndicators": [
          {
            "name": "总胆固醇",
            "latestValue": 4.9,
            "unit": "mmol/L",
            "referenceRange": "0–5.2",
            "trend": "down",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-10-15",
                "value": 5.4
              },
              {
                "date": "2023-10-14",
                "value": 5.3
              },
              {
                "date": "2024-10-12",
                "value": 5.1
              },
              {
                "date": "2025-10-18",
                "value": 5
              },
              {
                "date": "2026-07-17",
                "value": 4.9
              }
            ]
          }
        ]
      },
      {
        "organ": "肾脏/泌尿",
        "status": "normal",
        "narrative": "估算肾小球滤过率五年内从 82 变化到 78，均在本次报告参考范围内。需要结合年龄、检查方法和医生意见继续观察。",
        "keyIndicators": [
          {
            "name": "估算肾小球滤过率",
            "latestValue": 78,
            "unit": "mL/min/1.73m²",
            "referenceRange": "60–150",
            "trend": "down",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-10-15",
                "value": 82
              },
              {
                "date": "2023-10-14",
                "value": 80
              },
              {
                "date": "2024-10-12",
                "value": 79
              },
              {
                "date": "2025-10-18",
                "value": 78
              },
              {
                "date": "2026-07-17",
                "value": 78
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [
      "【参考信息】代谢/内分泌与骨骼指标需要结合活动、营养和复查结果理解，不根据单个数值自行用药。"
    ],
    "actionSuggestions": [
      "与医生确认下一次骨密度复查时间，并继续保留历年同部位检查结果用于比较。"
    ],
    "dataHash": "synthetic-demo-grandmother-2022-2026"
  },
  "demo-daughter": {
    "personId": "demo-daughter",
    "analysisDate": "2026-08-21T09:00:00+08:00",
    "personContext": {
      "gender": "女",
      "age": 12,
      "dataSpan": "5次检查（2022–2026）"
    },
    "organAnalyses": [
      {
        "organ": "眼/五官",
        "status": "attention",
        "narrative": "双眼裸眼视力从 1.0 逐步变化到 0.8，最近两年保持在 0.8。裸眼视力只反映当次辨认视标的能力，不能单独判断屈光状态，适合带历年结果到眼科进一步确认。",
        "keyIndicators": [
          {
            "name": "右眼裸眼视力",
            "latestValue": 0.8,
            "unit": "",
            "referenceRange": "1.0–2.0",
            "trend": "down",
            "isAbnormal": true,
            "history": [
              {
                "date": "2022-08-25",
                "value": 1
              },
              {
                "date": "2023-08-24",
                "value": 1
              },
              {
                "date": "2024-08-22",
                "value": 0.9
              },
              {
                "date": "2025-08-21",
                "value": 0.8
              },
              {
                "date": "2026-08-20",
                "value": 0.8
              }
            ]
          },
          {
            "name": "左眼裸眼视力",
            "latestValue": 0.8,
            "unit": "",
            "referenceRange": "1.0–2.0",
            "trend": "down",
            "isAbnormal": true,
            "history": [
              {
                "date": "2022-08-25",
                "value": 1
              },
              {
                "date": "2023-08-24",
                "value": 0.9
              },
              {
                "date": "2024-08-22",
                "value": 0.9
              },
              {
                "date": "2025-08-21",
                "value": 0.8
              },
              {
                "date": "2026-08-20",
                "value": 0.8
              }
            ]
          }
        ]
      },
      {
        "organ": "代谢/内分泌",
        "status": "normal",
        "narrative": "身高与体重随年龄持续增长。成长指标需要结合年龄、发育阶段和儿童保健记录判断，这里只展示连续变化，不给出诊断结论。",
        "keyIndicators": [
          {
            "name": "身高",
            "latestValue": 162,
            "unit": "cm",
            "referenceRange": "按年龄评估",
            "trend": "up",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-08-25",
                "value": 138
              },
              {
                "date": "2023-08-24",
                "value": 145
              },
              {
                "date": "2024-08-22",
                "value": 151
              },
              {
                "date": "2025-08-21",
                "value": 157
              },
              {
                "date": "2026-08-20",
                "value": 162
              }
            ]
          },
          {
            "name": "体重",
            "latestValue": 49,
            "unit": "kg",
            "referenceRange": "按年龄评估",
            "trend": "up",
            "isAbnormal": false,
            "history": [
              {
                "date": "2022-08-25",
                "value": 32
              },
              {
                "date": "2023-08-24",
                "value": 36
              },
              {
                "date": "2024-08-22",
                "value": 40
              },
              {
                "date": "2025-08-21",
                "value": 45
              },
              {
                "date": "2026-08-20",
                "value": 49
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [
      "【参考信息】成长变化和眼/五官检查应分别由儿童保健与眼科专业人员结合完整资料判断。"
    ],
    "actionSuggestions": [
      "安排规范视力复查；若医生认为需要，可进一步做散瞳验光和眼轴测量。"
    ],
    "dataHash": "synthetic-demo-daughter-2022-2026"
  }
};
export const EVENTS_DATA: Record<string, HealthEvent[]> = {
  "demo-father": [
    {
      "id": "demo-father:enc-2026-father",
      "encounterId": "enc-2026-father",
      "date": "2026-06-21",
      "type": "体检",
      "source": "安和市家庭健康中心",
      "personId": "demo-father",
      "reports": [
        {
          "reportId": "report-father-2026",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肝胆"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-father:enc-2025-father",
      "encounterId": "enc-2025-father",
      "date": "2025-06-19",
      "type": "体检",
      "source": "安和市家庭健康中心",
      "personId": "demo-father",
      "reports": [
        {
          "reportId": "report-father-2025",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肝胆"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-father:enc-2024-father",
      "encounterId": "enc-2024-father",
      "date": "2024-06-22",
      "type": "体检",
      "source": "安和市家庭健康中心",
      "personId": "demo-father",
      "reports": [
        {
          "reportId": "report-father-2024",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肝胆"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-father:enc-2023-father",
      "encounterId": "enc-2023-father",
      "date": "2023-06-20",
      "type": "体检",
      "source": "安和市家庭健康中心",
      "personId": "demo-father",
      "reports": [
        {
          "reportId": "report-father-2023",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肝胆"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    },
    {
      "id": "demo-father:enc-2022-father",
      "encounterId": "enc-2022-father",
      "date": "2022-06-18",
      "type": "体检",
      "source": "安和市家庭健康中心",
      "personId": "demo-father",
      "reports": [
        {
          "reportId": "report-father-2022",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肝胆"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    }
  ],
  "demo-mother": [
    {
      "id": "demo-mother:enc-2026-mother",
      "encounterId": "enc-2026-mother",
      "date": "2026-04-18",
      "type": "体检",
      "source": "安和市女性健康中心",
      "personId": "demo-mother",
      "reports": [
        {
          "reportId": "report-mother-2026",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "血液",
        "代谢/内分泌"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    },
    {
      "id": "demo-mother:enc-2025-mother",
      "encounterId": "enc-2025-mother",
      "date": "2025-04-16",
      "type": "体检",
      "source": "安和市女性健康中心",
      "personId": "demo-mother",
      "reports": [
        {
          "reportId": "report-mother-2025",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "血液",
        "代谢/内分泌"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    },
    {
      "id": "demo-mother:enc-2024-mother",
      "encounterId": "enc-2024-mother",
      "date": "2024-04-13",
      "type": "体检",
      "source": "安和市女性健康中心",
      "personId": "demo-mother",
      "reports": [
        {
          "reportId": "report-mother-2024",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "血液",
        "代谢/内分泌"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-mother:enc-2023-mother",
      "encounterId": "enc-2023-mother",
      "date": "2023-04-15",
      "type": "体检",
      "source": "安和市女性健康中心",
      "personId": "demo-mother",
      "reports": [
        {
          "reportId": "report-mother-2023",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "血液",
        "代谢/内分泌"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    },
    {
      "id": "demo-mother:enc-2022-mother",
      "encounterId": "enc-2022-mother",
      "date": "2022-04-12",
      "type": "体检",
      "source": "安和市女性健康中心",
      "personId": "demo-mother",
      "reports": [
        {
          "reportId": "report-mother-2022",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "血液",
        "代谢/内分泌"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    }
  ],
  "demo-grandfather": [
    {
      "id": "demo-grandfather:enc-2026-grandfather",
      "encounterId": "enc-2026-grandfather",
      "date": "2026-09-09",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandfather",
      "reports": [
        {
          "reportId": "report-grandfather-2026",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    },
    {
      "id": "demo-grandfather:enc-2025-grandfather",
      "encounterId": "enc-2025-grandfather",
      "date": "2025-09-11",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandfather",
      "reports": [
        {
          "reportId": "report-grandfather-2025",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    },
    {
      "id": "demo-grandfather:enc-2024-grandfather",
      "encounterId": "enc-2024-grandfather",
      "date": "2024-09-12",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandfather",
      "reports": [
        {
          "reportId": "report-grandfather-2024",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    },
    {
      "id": "demo-grandfather:enc-2023-grandfather",
      "encounterId": "enc-2023-grandfather",
      "date": "2023-09-10",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandfather",
      "reports": [
        {
          "reportId": "report-grandfather-2023",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 2
    },
    {
      "id": "demo-grandfather:enc-2022-grandfather",
      "encounterId": "enc-2022-grandfather",
      "date": "2022-09-08",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandfather",
      "reports": [
        {
          "reportId": "report-grandfather-2022",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "心血管",
        "代谢/内分泌",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 2
    }
  ],
  "demo-grandmother": [
    {
      "id": "demo-grandmother:enc-2026-grandmother",
      "encounterId": "enc-2026-grandmother",
      "date": "2026-07-17",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandmother",
      "reports": [
        {
          "reportId": "report-grandmother-2026",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "心血管",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-grandmother:enc-2025-grandmother",
      "encounterId": "enc-2025-grandmother",
      "date": "2025-10-18",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandmother",
      "reports": [
        {
          "reportId": "report-grandmother-2025",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "心血管",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-grandmother:enc-2024-grandmother",
      "encounterId": "enc-2024-grandmother",
      "date": "2024-10-12",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandmother",
      "reports": [
        {
          "reportId": "report-grandmother-2024",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "心血管",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-grandmother:enc-2023-grandmother",
      "encounterId": "enc-2023-grandmother",
      "date": "2023-10-14",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandmother",
      "reports": [
        {
          "reportId": "report-grandmother-2023",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "心血管",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 3
    },
    {
      "id": "demo-grandmother:enc-2022-grandmother",
      "encounterId": "enc-2022-grandmother",
      "date": "2022-10-15",
      "type": "体检",
      "source": "安和市长者健康中心",
      "personId": "demo-grandmother",
      "reports": [
        {
          "reportId": "report-grandmother-2022",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "心血管",
        "肾脏/泌尿"
      ],
      "measurementCount": 4,
      "abnormalCount": 3
    }
  ],
  "demo-daughter": [
    {
      "id": "demo-daughter:enc-2026-daughter",
      "encounterId": "enc-2026-daughter",
      "date": "2026-08-20",
      "type": "体检",
      "source": "安和市儿童保健中心",
      "personId": "demo-daughter",
      "reports": [
        {
          "reportId": "report-daughter-2026",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "眼/五官"
      ],
      "measurementCount": 4,
      "abnormalCount": 2
    },
    {
      "id": "demo-daughter:enc-2025-daughter",
      "encounterId": "enc-2025-daughter",
      "date": "2025-08-21",
      "type": "体检",
      "source": "安和市儿童保健中心",
      "personId": "demo-daughter",
      "reports": [
        {
          "reportId": "report-daughter-2025",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "眼/五官"
      ],
      "measurementCount": 4,
      "abnormalCount": 2
    },
    {
      "id": "demo-daughter:enc-2024-daughter",
      "encounterId": "enc-2024-daughter",
      "date": "2024-08-22",
      "type": "体检",
      "source": "安和市儿童保健中心",
      "personId": "demo-daughter",
      "reports": [
        {
          "reportId": "report-daughter-2024",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "眼/五官"
      ],
      "measurementCount": 4,
      "abnormalCount": 2
    },
    {
      "id": "demo-daughter:enc-2023-daughter",
      "encounterId": "enc-2023-daughter",
      "date": "2023-08-24",
      "type": "体检",
      "source": "安和市儿童保健中心",
      "personId": "demo-daughter",
      "reports": [
        {
          "reportId": "report-daughter-2023",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "眼/五官"
      ],
      "measurementCount": 4,
      "abnormalCount": 1
    },
    {
      "id": "demo-daughter:enc-2022-daughter",
      "encounterId": "enc-2022-daughter",
      "date": "2022-08-25",
      "type": "体检",
      "source": "安和市儿童保健中心",
      "personId": "demo-daughter",
      "reports": [
        {
          "reportId": "report-daughter-2022",
          "pageRefs": [
            1,
            2
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "眼/五官"
      ],
      "measurementCount": 4,
      "abnormalCount": 0
    }
  ]
};
export const MEASUREMENTS_DATA: Record<string, Record<string, MeasurementItem[]>> = {
  "demo-father": {
    "demo-father:enc-2022-father": [
      {
        "measurementId": "demo-father-ldl-2022",
        "reportId": "report-father-2022",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.2,
        "numericValue": 3.2,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-father-glucose-2022",
        "reportId": "report-father-2022",
        "page": 1,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 5.4,
        "numericValue": 5.4,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-sbp-2022",
        "reportId": "report-father-2022",
        "page": 2,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 128,
        "numericValue": 128,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-alt-2022",
        "reportId": "report-father-2022",
        "page": 2,
        "standardName": "谷丙转氨酶",
        "originalName": "ALT",
        "value": 28,
        "numericValue": 28,
        "unit": "U/L",
        "referenceRange": {
          "low": 9,
          "high": 50
        },
        "isAbnormal": false,
        "organs": [
          "肝胆"
        ]
      }
    ],
    "demo-father:enc-2023-father": [
      {
        "measurementId": "demo-father-ldl-2023",
        "reportId": "report-father-2023",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.4,
        "numericValue": 3.4,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-father-glucose-2023",
        "reportId": "report-father-2023",
        "page": 1,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 5.5,
        "numericValue": 5.5,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-sbp-2023",
        "reportId": "report-father-2023",
        "page": 2,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 130,
        "numericValue": 130,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-alt-2023",
        "reportId": "report-father-2023",
        "page": 2,
        "standardName": "谷丙转氨酶",
        "originalName": "ALT",
        "value": 30,
        "numericValue": 30,
        "unit": "U/L",
        "referenceRange": {
          "low": 9,
          "high": 50
        },
        "isAbnormal": false,
        "organs": [
          "肝胆"
        ]
      }
    ],
    "demo-father:enc-2024-father": [
      {
        "measurementId": "demo-father-ldl-2024",
        "reportId": "report-father-2024",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.6,
        "numericValue": 3.6,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": true,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-father-glucose-2024",
        "reportId": "report-father-2024",
        "page": 1,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 5.7,
        "numericValue": 5.7,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-sbp-2024",
        "reportId": "report-father-2024",
        "page": 2,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 134,
        "numericValue": 134,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-alt-2024",
        "reportId": "report-father-2024",
        "page": 2,
        "standardName": "谷丙转氨酶",
        "originalName": "ALT",
        "value": 32,
        "numericValue": 32,
        "unit": "U/L",
        "referenceRange": {
          "low": 9,
          "high": 50
        },
        "isAbnormal": false,
        "organs": [
          "肝胆"
        ]
      }
    ],
    "demo-father:enc-2025-father": [
      {
        "measurementId": "demo-father-ldl-2025",
        "reportId": "report-father-2025",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.7,
        "numericValue": 3.7,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": true,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-father-glucose-2025",
        "reportId": "report-father-2025",
        "page": 1,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 5.9,
        "numericValue": 5.9,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-sbp-2025",
        "reportId": "report-father-2025",
        "page": 2,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 136,
        "numericValue": 136,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-alt-2025",
        "reportId": "report-father-2025",
        "page": 2,
        "standardName": "谷丙转氨酶",
        "originalName": "ALT",
        "value": 29,
        "numericValue": 29,
        "unit": "U/L",
        "referenceRange": {
          "low": 9,
          "high": 50
        },
        "isAbnormal": false,
        "organs": [
          "肝胆"
        ]
      }
    ],
    "demo-father:enc-2026-father": [
      {
        "measurementId": "demo-father-ldl-2026",
        "reportId": "report-father-2026",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.5,
        "numericValue": 3.5,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": true,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-father-glucose-2026",
        "reportId": "report-father-2026",
        "page": 1,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 5.7,
        "numericValue": 5.7,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-sbp-2026",
        "reportId": "report-father-2026",
        "page": 2,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 132,
        "numericValue": 132,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-father-alt-2026",
        "reportId": "report-father-2026",
        "page": 2,
        "standardName": "谷丙转氨酶",
        "originalName": "ALT",
        "value": 27,
        "numericValue": 27,
        "unit": "U/L",
        "referenceRange": {
          "low": 9,
          "high": 50
        },
        "isAbnormal": false,
        "organs": [
          "肝胆"
        ]
      }
    ]
  },
  "demo-mother": {
    "demo-mother:enc-2022-mother": [
      {
        "measurementId": "demo-mother-hemoglobin-2022",
        "reportId": "report-mother-2022",
        "page": 1,
        "standardName": "血红蛋白",
        "originalName": "HGB",
        "value": 123,
        "numericValue": 123,
        "unit": "g/L",
        "referenceRange": {
          "low": 115,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-ferritin-2022",
        "reportId": "report-mother-2022",
        "page": 1,
        "standardName": "血清铁蛋白",
        "originalName": "FER",
        "value": 30,
        "numericValue": 30,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 15,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-vitd-2022",
        "reportId": "report-mother-2022",
        "page": 2,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 22,
        "numericValue": 22,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-mother-tsh-2022",
        "reportId": "report-mother-2022",
        "page": 2,
        "standardName": "促甲状腺激素",
        "originalName": "TSH",
        "value": 2.1,
        "numericValue": 2.1,
        "unit": "mIU/L",
        "referenceRange": {
          "low": 0.27,
          "high": 4.2
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      }
    ],
    "demo-mother:enc-2023-mother": [
      {
        "measurementId": "demo-mother-hemoglobin-2023",
        "reportId": "report-mother-2023",
        "page": 1,
        "standardName": "血红蛋白",
        "originalName": "HGB",
        "value": 120,
        "numericValue": 120,
        "unit": "g/L",
        "referenceRange": {
          "low": 115,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-ferritin-2023",
        "reportId": "report-mother-2023",
        "page": 1,
        "standardName": "血清铁蛋白",
        "originalName": "FER",
        "value": 26,
        "numericValue": 26,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 15,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-vitd-2023",
        "reportId": "report-mother-2023",
        "page": 2,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 24,
        "numericValue": 24,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-mother-tsh-2023",
        "reportId": "report-mother-2023",
        "page": 2,
        "standardName": "促甲状腺激素",
        "originalName": "TSH",
        "value": 2,
        "numericValue": 2,
        "unit": "mIU/L",
        "referenceRange": {
          "low": 0.27,
          "high": 4.2
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      }
    ],
    "demo-mother:enc-2024-mother": [
      {
        "measurementId": "demo-mother-hemoglobin-2024",
        "reportId": "report-mother-2024",
        "page": 1,
        "standardName": "血红蛋白",
        "originalName": "HGB",
        "value": 114,
        "numericValue": 114,
        "unit": "g/L",
        "referenceRange": {
          "low": 115,
          "high": 150
        },
        "isAbnormal": true,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-ferritin-2024",
        "reportId": "report-mother-2024",
        "page": 1,
        "standardName": "血清铁蛋白",
        "originalName": "FER",
        "value": 17,
        "numericValue": 17,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 15,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-vitd-2024",
        "reportId": "report-mother-2024",
        "page": 2,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 27,
        "numericValue": 27,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-mother-tsh-2024",
        "reportId": "report-mother-2024",
        "page": 2,
        "standardName": "促甲状腺激素",
        "originalName": "TSH",
        "value": 2.2,
        "numericValue": 2.2,
        "unit": "mIU/L",
        "referenceRange": {
          "low": 0.27,
          "high": 4.2
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      }
    ],
    "demo-mother:enc-2025-mother": [
      {
        "measurementId": "demo-mother-hemoglobin-2025",
        "reportId": "report-mother-2025",
        "page": 1,
        "standardName": "血红蛋白",
        "originalName": "HGB",
        "value": 118,
        "numericValue": 118,
        "unit": "g/L",
        "referenceRange": {
          "low": 115,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-ferritin-2025",
        "reportId": "report-mother-2025",
        "page": 1,
        "standardName": "血清铁蛋白",
        "originalName": "FER",
        "value": 22,
        "numericValue": 22,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 15,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-vitd-2025",
        "reportId": "report-mother-2025",
        "page": 2,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 29,
        "numericValue": 29,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-mother-tsh-2025",
        "reportId": "report-mother-2025",
        "page": 2,
        "standardName": "促甲状腺激素",
        "originalName": "TSH",
        "value": 2.1,
        "numericValue": 2.1,
        "unit": "mIU/L",
        "referenceRange": {
          "low": 0.27,
          "high": 4.2
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      }
    ],
    "demo-mother:enc-2026-mother": [
      {
        "measurementId": "demo-mother-hemoglobin-2026",
        "reportId": "report-mother-2026",
        "page": 1,
        "standardName": "血红蛋白",
        "originalName": "HGB",
        "value": 122,
        "numericValue": 122,
        "unit": "g/L",
        "referenceRange": {
          "low": 115,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-ferritin-2026",
        "reportId": "report-mother-2026",
        "page": 1,
        "standardName": "血清铁蛋白",
        "originalName": "FER",
        "value": 28,
        "numericValue": 28,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 15,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "血液"
        ]
      },
      {
        "measurementId": "demo-mother-vitd-2026",
        "reportId": "report-mother-2026",
        "page": 2,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 31,
        "numericValue": 31,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-mother-tsh-2026",
        "reportId": "report-mother-2026",
        "page": 2,
        "standardName": "促甲状腺激素",
        "originalName": "TSH",
        "value": 2,
        "numericValue": 2,
        "unit": "mIU/L",
        "referenceRange": {
          "low": 0.27,
          "high": 4.2
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      }
    ]
  },
  "demo-grandfather": {
    "demo-grandfather:enc-2022-grandfather": [
      {
        "measurementId": "demo-grandfather-sbp-2022",
        "reportId": "report-grandfather-2022",
        "page": 1,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 142,
        "numericValue": 142,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": true,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-grandfather-ldl-2022",
        "reportId": "report-grandfather-2022",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.7,
        "numericValue": 3.7,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": true,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandfather-creatinine-2022",
        "reportId": "report-grandfather-2022",
        "page": 2,
        "standardName": "血肌酐",
        "originalName": "CREA",
        "value": 86,
        "numericValue": 86,
        "unit": "μmol/L",
        "referenceRange": {
          "low": 57,
          "high": 111
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      },
      {
        "measurementId": "demo-grandfather-glucose-2022",
        "reportId": "report-grandfather-2022",
        "page": 2,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 5.8,
        "numericValue": 5.8,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      }
    ],
    "demo-grandfather:enc-2023-grandfather": [
      {
        "measurementId": "demo-grandfather-sbp-2023",
        "reportId": "report-grandfather-2023",
        "page": 1,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 140,
        "numericValue": 140,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": true,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-grandfather-ldl-2023",
        "reportId": "report-grandfather-2023",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.5,
        "numericValue": 3.5,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": true,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandfather-creatinine-2023",
        "reportId": "report-grandfather-2023",
        "page": 2,
        "standardName": "血肌酐",
        "originalName": "CREA",
        "value": 89,
        "numericValue": 89,
        "unit": "μmol/L",
        "referenceRange": {
          "low": 57,
          "high": 111
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      },
      {
        "measurementId": "demo-grandfather-glucose-2023",
        "reportId": "report-grandfather-2023",
        "page": 2,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 6,
        "numericValue": 6,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      }
    ],
    "demo-grandfather:enc-2024-grandfather": [
      {
        "measurementId": "demo-grandfather-sbp-2024",
        "reportId": "report-grandfather-2024",
        "page": 1,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 138,
        "numericValue": 138,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-grandfather-ldl-2024",
        "reportId": "report-grandfather-2024",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.3,
        "numericValue": 3.3,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandfather-creatinine-2024",
        "reportId": "report-grandfather-2024",
        "page": 2,
        "standardName": "血肌酐",
        "originalName": "CREA",
        "value": 91,
        "numericValue": 91,
        "unit": "μmol/L",
        "referenceRange": {
          "low": 57,
          "high": 111
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      },
      {
        "measurementId": "demo-grandfather-glucose-2024",
        "reportId": "report-grandfather-2024",
        "page": 2,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 6.1,
        "numericValue": 6.1,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      }
    ],
    "demo-grandfather:enc-2025-grandfather": [
      {
        "measurementId": "demo-grandfather-sbp-2025",
        "reportId": "report-grandfather-2025",
        "page": 1,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 136,
        "numericValue": 136,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-grandfather-ldl-2025",
        "reportId": "report-grandfather-2025",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.2,
        "numericValue": 3.2,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandfather-creatinine-2025",
        "reportId": "report-grandfather-2025",
        "page": 2,
        "standardName": "血肌酐",
        "originalName": "CREA",
        "value": 92,
        "numericValue": 92,
        "unit": "μmol/L",
        "referenceRange": {
          "low": 57,
          "high": 111
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      },
      {
        "measurementId": "demo-grandfather-glucose-2025",
        "reportId": "report-grandfather-2025",
        "page": 2,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 6,
        "numericValue": 6,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      }
    ],
    "demo-grandfather:enc-2026-grandfather": [
      {
        "measurementId": "demo-grandfather-sbp-2026",
        "reportId": "report-grandfather-2026",
        "page": 1,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 134,
        "numericValue": 134,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      },
      {
        "measurementId": "demo-grandfather-ldl-2026",
        "reportId": "report-grandfather-2026",
        "page": 1,
        "standardName": "低密度脂蛋白胆固醇",
        "originalName": "LDL-C",
        "value": 3.1,
        "numericValue": 3.1,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 3.4
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandfather-creatinine-2026",
        "reportId": "report-grandfather-2026",
        "page": 2,
        "standardName": "血肌酐",
        "originalName": "CREA",
        "value": 94,
        "numericValue": 94,
        "unit": "μmol/L",
        "referenceRange": {
          "low": 57,
          "high": 111
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      },
      {
        "measurementId": "demo-grandfather-glucose-2026",
        "reportId": "report-grandfather-2026",
        "page": 2,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 5.9,
        "numericValue": 5.9,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      }
    ]
  },
  "demo-grandmother": {
    "demo-grandmother:enc-2022-grandmother": [
      {
        "measurementId": "demo-grandmother-vitd-2022",
        "reportId": "report-grandmother-2022",
        "page": 1,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 18,
        "numericValue": 18,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-bmd-2022",
        "reportId": "report-grandmother-2022",
        "page": 1,
        "standardName": "骨密度T值",
        "originalName": "腰椎T值",
        "value": -1.6,
        "numericValue": -1.6,
        "unit": "",
        "referenceRange": {
          "low": -1,
          "high": 5
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-tc-2022",
        "reportId": "report-grandmother-2022",
        "page": 2,
        "standardName": "总胆固醇",
        "originalName": "TC",
        "value": 5.4,
        "numericValue": 5.4,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 5.2
        },
        "isAbnormal": true,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-egfr-2022",
        "reportId": "report-grandmother-2022",
        "page": 2,
        "standardName": "估算肾小球滤过率",
        "originalName": "eGFR",
        "value": 82,
        "numericValue": 82,
        "unit": "mL/min/1.73m²",
        "referenceRange": {
          "low": 60,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      }
    ],
    "demo-grandmother:enc-2023-grandmother": [
      {
        "measurementId": "demo-grandmother-vitd-2023",
        "reportId": "report-grandmother-2023",
        "page": 1,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 19,
        "numericValue": 19,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-bmd-2023",
        "reportId": "report-grandmother-2023",
        "page": 1,
        "standardName": "骨密度T值",
        "originalName": "腰椎T值",
        "value": -1.5,
        "numericValue": -1.5,
        "unit": "",
        "referenceRange": {
          "low": -1,
          "high": 5
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-tc-2023",
        "reportId": "report-grandmother-2023",
        "page": 2,
        "standardName": "总胆固醇",
        "originalName": "TC",
        "value": 5.3,
        "numericValue": 5.3,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 5.2
        },
        "isAbnormal": true,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-egfr-2023",
        "reportId": "report-grandmother-2023",
        "page": 2,
        "standardName": "估算肾小球滤过率",
        "originalName": "eGFR",
        "value": 80,
        "numericValue": 80,
        "unit": "mL/min/1.73m²",
        "referenceRange": {
          "low": 60,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      }
    ],
    "demo-grandmother:enc-2024-grandmother": [
      {
        "measurementId": "demo-grandmother-vitd-2024",
        "reportId": "report-grandmother-2024",
        "page": 1,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 23,
        "numericValue": 23,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-bmd-2024",
        "reportId": "report-grandmother-2024",
        "page": 1,
        "standardName": "骨密度T值",
        "originalName": "腰椎T值",
        "value": -1.5,
        "numericValue": -1.5,
        "unit": "",
        "referenceRange": {
          "low": -1,
          "high": 5
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-tc-2024",
        "reportId": "report-grandmother-2024",
        "page": 2,
        "standardName": "总胆固醇",
        "originalName": "TC",
        "value": 5.1,
        "numericValue": 5.1,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 5.2
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-egfr-2024",
        "reportId": "report-grandmother-2024",
        "page": 2,
        "standardName": "估算肾小球滤过率",
        "originalName": "eGFR",
        "value": 79,
        "numericValue": 79,
        "unit": "mL/min/1.73m²",
        "referenceRange": {
          "low": 60,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      }
    ],
    "demo-grandmother:enc-2025-grandmother": [
      {
        "measurementId": "demo-grandmother-vitd-2025",
        "reportId": "report-grandmother-2025",
        "page": 1,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 27,
        "numericValue": 27,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-bmd-2025",
        "reportId": "report-grandmother-2025",
        "page": 1,
        "standardName": "骨密度T值",
        "originalName": "腰椎T值",
        "value": -1.4,
        "numericValue": -1.4,
        "unit": "",
        "referenceRange": {
          "low": -1,
          "high": 5
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-tc-2025",
        "reportId": "report-grandmother-2025",
        "page": 2,
        "standardName": "总胆固醇",
        "originalName": "TC",
        "value": 5,
        "numericValue": 5,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 5.2
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-egfr-2025",
        "reportId": "report-grandmother-2025",
        "page": 2,
        "standardName": "估算肾小球滤过率",
        "originalName": "eGFR",
        "value": 78,
        "numericValue": 78,
        "unit": "mL/min/1.73m²",
        "referenceRange": {
          "low": 60,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      }
    ],
    "demo-grandmother:enc-2026-grandmother": [
      {
        "measurementId": "demo-grandmother-vitd-2026",
        "reportId": "report-grandmother-2026",
        "page": 1,
        "standardName": "25-羟维生素D",
        "originalName": "25-OH-D",
        "value": 30,
        "numericValue": 30,
        "unit": "ng/mL",
        "referenceRange": {
          "low": 20,
          "high": 100
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-bmd-2026",
        "reportId": "report-grandmother-2026",
        "page": 1,
        "standardName": "骨密度T值",
        "originalName": "腰椎T值",
        "value": -1.3,
        "numericValue": -1.3,
        "unit": "",
        "referenceRange": {
          "low": -1,
          "high": 5
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-tc-2026",
        "reportId": "report-grandmother-2026",
        "page": 2,
        "standardName": "总胆固醇",
        "originalName": "TC",
        "value": 4.9,
        "numericValue": 4.9,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 0,
          "high": 5.2
        },
        "isAbnormal": false,
        "organs": [
          "心血管",
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-grandmother-egfr-2026",
        "reportId": "report-grandmother-2026",
        "page": 2,
        "standardName": "估算肾小球滤过率",
        "originalName": "eGFR",
        "value": 78,
        "numericValue": 78,
        "unit": "mL/min/1.73m²",
        "referenceRange": {
          "low": 60,
          "high": 150
        },
        "isAbnormal": false,
        "organs": [
          "肾脏/泌尿"
        ]
      }
    ]
  },
  "demo-daughter": {
    "demo-daughter:enc-2022-daughter": [
      {
        "measurementId": "demo-daughter-height-2022",
        "reportId": "report-daughter-2022",
        "page": 1,
        "standardName": "身高",
        "originalName": "身高",
        "value": 138,
        "numericValue": 138,
        "unit": "cm",
        "referenceRange": {
          "low": 120,
          "high": 190
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-weight-2022",
        "reportId": "report-daughter-2022",
        "page": 1,
        "standardName": "体重",
        "originalName": "体重",
        "value": 32,
        "numericValue": 32,
        "unit": "kg",
        "referenceRange": {
          "low": 25,
          "high": 70
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-r-2022",
        "reportId": "report-daughter-2022",
        "page": 2,
        "standardName": "右眼裸眼视力",
        "originalName": "右眼视力",
        "value": 1,
        "numericValue": 1,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": false,
        "organs": [
          "眼/五官"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-l-2022",
        "reportId": "report-daughter-2022",
        "page": 2,
        "standardName": "左眼裸眼视力",
        "originalName": "左眼视力",
        "value": 1,
        "numericValue": 1,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": false,
        "organs": [
          "眼/五官"
        ]
      }
    ],
    "demo-daughter:enc-2023-daughter": [
      {
        "measurementId": "demo-daughter-height-2023",
        "reportId": "report-daughter-2023",
        "page": 1,
        "standardName": "身高",
        "originalName": "身高",
        "value": 145,
        "numericValue": 145,
        "unit": "cm",
        "referenceRange": {
          "low": 120,
          "high": 190
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-weight-2023",
        "reportId": "report-daughter-2023",
        "page": 1,
        "standardName": "体重",
        "originalName": "体重",
        "value": 36,
        "numericValue": 36,
        "unit": "kg",
        "referenceRange": {
          "low": 25,
          "high": 70
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-r-2023",
        "reportId": "report-daughter-2023",
        "page": 2,
        "standardName": "右眼裸眼视力",
        "originalName": "右眼视力",
        "value": 1,
        "numericValue": 1,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": false,
        "organs": [
          "眼/五官"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-l-2023",
        "reportId": "report-daughter-2023",
        "page": 2,
        "standardName": "左眼裸眼视力",
        "originalName": "左眼视力",
        "value": 0.9,
        "numericValue": 0.9,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": true,
        "organs": [
          "眼/五官"
        ]
      }
    ],
    "demo-daughter:enc-2024-daughter": [
      {
        "measurementId": "demo-daughter-height-2024",
        "reportId": "report-daughter-2024",
        "page": 1,
        "standardName": "身高",
        "originalName": "身高",
        "value": 151,
        "numericValue": 151,
        "unit": "cm",
        "referenceRange": {
          "low": 120,
          "high": 190
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-weight-2024",
        "reportId": "report-daughter-2024",
        "page": 1,
        "standardName": "体重",
        "originalName": "体重",
        "value": 40,
        "numericValue": 40,
        "unit": "kg",
        "referenceRange": {
          "low": 25,
          "high": 70
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-r-2024",
        "reportId": "report-daughter-2024",
        "page": 2,
        "standardName": "右眼裸眼视力",
        "originalName": "右眼视力",
        "value": 0.9,
        "numericValue": 0.9,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": true,
        "organs": [
          "眼/五官"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-l-2024",
        "reportId": "report-daughter-2024",
        "page": 2,
        "standardName": "左眼裸眼视力",
        "originalName": "左眼视力",
        "value": 0.9,
        "numericValue": 0.9,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": true,
        "organs": [
          "眼/五官"
        ]
      }
    ],
    "demo-daughter:enc-2025-daughter": [
      {
        "measurementId": "demo-daughter-height-2025",
        "reportId": "report-daughter-2025",
        "page": 1,
        "standardName": "身高",
        "originalName": "身高",
        "value": 157,
        "numericValue": 157,
        "unit": "cm",
        "referenceRange": {
          "low": 120,
          "high": 190
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-weight-2025",
        "reportId": "report-daughter-2025",
        "page": 1,
        "standardName": "体重",
        "originalName": "体重",
        "value": 45,
        "numericValue": 45,
        "unit": "kg",
        "referenceRange": {
          "low": 25,
          "high": 70
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-r-2025",
        "reportId": "report-daughter-2025",
        "page": 2,
        "standardName": "右眼裸眼视力",
        "originalName": "右眼视力",
        "value": 0.8,
        "numericValue": 0.8,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": true,
        "organs": [
          "眼/五官"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-l-2025",
        "reportId": "report-daughter-2025",
        "page": 2,
        "standardName": "左眼裸眼视力",
        "originalName": "左眼视力",
        "value": 0.8,
        "numericValue": 0.8,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": true,
        "organs": [
          "眼/五官"
        ]
      }
    ],
    "demo-daughter:enc-2026-daughter": [
      {
        "measurementId": "demo-daughter-height-2026",
        "reportId": "report-daughter-2026",
        "page": 1,
        "standardName": "身高",
        "originalName": "身高",
        "value": 162,
        "numericValue": 162,
        "unit": "cm",
        "referenceRange": {
          "low": 120,
          "high": 190
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-weight-2026",
        "reportId": "report-daughter-2026",
        "page": 1,
        "standardName": "体重",
        "originalName": "体重",
        "value": 49,
        "numericValue": 49,
        "unit": "kg",
        "referenceRange": {
          "low": 25,
          "high": 70
        },
        "isAbnormal": false,
        "organs": [
          "代谢/内分泌"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-r-2026",
        "reportId": "report-daughter-2026",
        "page": 2,
        "standardName": "右眼裸眼视力",
        "originalName": "右眼视力",
        "value": 0.8,
        "numericValue": 0.8,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": true,
        "organs": [
          "眼/五官"
        ]
      },
      {
        "measurementId": "demo-daughter-vision-l-2026",
        "reportId": "report-daughter-2026",
        "page": 2,
        "standardName": "左眼裸眼视力",
        "originalName": "左眼视力",
        "value": 0.8,
        "numericValue": 0.8,
        "unit": "",
        "referenceRange": {
          "low": 1,
          "high": 2
        },
        "isAbnormal": true,
        "organs": [
          "眼/五官"
        ]
      }
    ]
  }
};
export const SUGGESTIONS_DATA: Record<string, SuggestionData | null> = {
  "demo-father": {
    "personId": "demo-father",
    "suggestionDate": "2026-06-22T10:00:00+08:00",
    "reviewSuggestions": [
      {
        "priority": "medium",
        "organ": "心血管",
        "what": "复查血脂",
        "when": "下一次年度检查或按医生建议",
        "where": "全科或心血管内科",
        "why": "最新 LDL 仍略高于本次报告参考上限，适合结合历年趋势确认。",
        "status": "ai_pending",
        "owner": "林远山",
        "evidence": [
          {
            "eventId": "demo-father:enc-2026-father",
            "measurementIds": [
              "demo-father-ldl-2026"
            ]
          }
        ]
      },
      {
        "priority": "low",
        "organ": "代谢/内分泌",
        "what": "继续观察空腹血糖",
        "when": "下一次年度检查",
        "where": "体检中心或全科",
        "why": "目前仍在参考范围内，但五年数据可用于继续观察长期方向。",
        "status": "doctor_confirmed",
        "owner": "林远山",
        "evidence": [
          {
            "eventId": "demo-father:enc-2026-father",
            "measurementIds": [
              "demo-father-glucose-2026"
            ]
          }
        ]
      }
    ],
    "watchItems": [],
    "lifestyleDirections": [],
    "nextCheckup": {
      "lastCheckupDate": "2026-06-21",
      "suggestedNextDate": "2027年中",
      "focusItems": [
        "血脂",
        "空腹血糖",
        "血压"
      ]
    }
  },
  "demo-mother": {
    "personId": "demo-mother",
    "suggestionDate": "2026-04-19T10:00:00+08:00",
    "reviewSuggestions": [
      {
        "priority": "low",
        "organ": "血液",
        "what": "年度复查血常规和铁蛋白",
        "when": "下一次年度检查",
        "where": "体检中心或全科",
        "why": "2024 年曾出现阶段性低值，后续已经回升，保留连续记录便于确认稳定性。",
        "status": "doctor_confirmed",
        "owner": "苏青禾",
        "evidence": [
          {
            "eventId": "demo-mother:enc-2026-mother",
            "measurementIds": [
              "demo-mother-hemoglobin-2026",
              "demo-mother-ferritin-2026"
            ]
          }
        ]
      }
    ],
    "watchItems": [],
    "lifestyleDirections": [],
    "nextCheckup": {
      "lastCheckupDate": "2026-04-18",
      "suggestedNextDate": "2027年春季",
      "focusItems": [
        "血常规",
        "铁蛋白",
        "维生素D"
      ]
    }
  },
  "demo-grandfather": {
    "personId": "demo-grandfather",
    "suggestionDate": "2026-09-10T10:00:00+08:00",
    "reviewSuggestions": [
      {
        "priority": "medium",
        "organ": "心血管",
        "what": "保持家庭血压记录",
        "when": "每周固定时间并按医生建议",
        "where": "居家记录，复诊时携带",
        "why": "过去五年收缩压逐步回落，连续记录有助于确认是否保持稳定。",
        "status": "doctor_confirmed",
        "owner": "林松年",
        "evidence": [
          {
            "eventId": "demo-grandfather:enc-2026-grandfather",
            "measurementIds": [
              "demo-grandfather-sbp-2026"
            ]
          }
        ]
      },
      {
        "priority": "low",
        "organ": "肾脏/泌尿",
        "what": "年度复查肾功能",
        "when": "下一次年度检查",
        "where": "全科或肾内科",
        "why": "当前血肌酐在参考范围内，长期对照时仍要注意检查方法和单位一致。",
        "status": "ai_pending",
        "owner": "林松年",
        "evidence": [
          {
            "eventId": "demo-grandfather:enc-2026-grandfather",
            "measurementIds": [
              "demo-grandfather-creatinine-2026"
            ]
          }
        ]
      }
    ],
    "watchItems": [],
    "lifestyleDirections": [],
    "nextCheckup": {
      "lastCheckupDate": "2026-09-09",
      "suggestedNextDate": "2027年秋季",
      "focusItems": [
        "血压",
        "血脂",
        "血糖",
        "肾功能"
      ]
    }
  },
  "demo-grandmother": {
    "personId": "demo-grandmother",
    "suggestionDate": "2026-07-18T10:00:00+08:00",
    "reviewSuggestions": [
      {
        "priority": "medium",
        "organ": "代谢/内分泌",
        "what": "确认骨密度复查计划",
        "when": "按医生建议安排",
        "where": "全科、内分泌科或骨科",
        "why": "骨密度T值虽逐步改善，最新结果仍低于本次报告参考下限。",
        "status": "ai_pending",
        "owner": "周瑞云",
        "evidence": [
          {
            "eventId": "demo-grandmother:enc-2026-grandmother",
            "measurementIds": [
              "demo-grandmother-bmd-2026"
            ]
          }
        ]
      },
      {
        "priority": "low",
        "organ": "肾脏/泌尿",
        "what": "继续年度肾功能比较",
        "when": "下一次年度检查",
        "where": "体检中心或全科",
        "why": "当前结果在参考范围内，连续记录有助于区分正常波动与持续变化。",
        "status": "doctor_confirmed",
        "owner": "周瑞云",
        "evidence": [
          {
            "eventId": "demo-grandmother:enc-2026-grandmother",
            "measurementIds": [
              "demo-grandmother-egfr-2026"
            ]
          }
        ]
      }
    ],
    "watchItems": [],
    "lifestyleDirections": [],
    "nextCheckup": {
      "lastCheckupDate": "2026-07-17",
      "suggestedNextDate": "按医生建议",
      "focusItems": [
        "骨密度",
        "维生素D",
        "肾功能"
      ]
    }
  },
  "demo-daughter": {
    "personId": "demo-daughter",
    "suggestionDate": "2026-08-21T10:00:00+08:00",
    "reviewSuggestions": [
      {
        "priority": "medium",
        "organ": "眼/五官",
        "what": "安排规范视力复查",
        "when": "近期与医生确认",
        "where": "儿童眼科或视光门诊",
        "why": "双眼裸眼视力近两年均为 0.8，需要结合规范验光进一步确认。",
        "status": "ai_pending",
        "owner": "家长",
        "evidence": [
          {
            "eventId": "demo-daughter:enc-2026-daughter",
            "measurementIds": [
              "demo-daughter-vision-r-2026",
              "demo-daughter-vision-l-2026"
            ]
          }
        ]
      },
      {
        "priority": "low",
        "organ": "代谢/内分泌",
        "what": "保留年度成长记录",
        "when": "每年儿童保健或体检",
        "where": "儿童保健门诊",
        "why": "连续的身高和体重记录比单次数字更有参考价值。",
        "status": "doctor_confirmed",
        "owner": "家长",
        "evidence": [
          {
            "eventId": "demo-daughter:enc-2026-daughter",
            "measurementIds": [
              "demo-daughter-height-2026",
              "demo-daughter-weight-2026"
            ]
          }
        ]
      }
    ],
    "watchItems": [],
    "lifestyleDirections": [],
    "nextCheckup": {
      "lastCheckupDate": "2026-08-20",
      "suggestedNextDate": "2027年开学前",
      "focusItems": [
        "视力",
        "身高",
        "体重"
      ]
    }
  }
};
export const LIFESTYLE_DATA: Record<string, LifestyleData | null> = {
  "demo-father": {
    "personId": "demo-father",
    "sourceAnalysisHash": "ee91f72cbcba6d89776e788b32c17e48",
    "dataConfidence": "high",
    "topPriorities": [
      {
        "rank": 1,
        "action": "把每周运动固定下来",
        "why": "血脂和血糖都适合结合长期生活节奏观察",
        "howToStart": "先在日历里固定 3 次晚饭后快走"
      },
      {
        "rank": 2,
        "action": "下次检查继续带上历年血脂",
        "why": "连续数据比单次高低更容易看清方向",
        "howToStart": "体检前把五年结果整理成同一张表"
      }
    ],
    "exerciseGuide": {
      "overview": "在身体允许且医生没有特别限制时，以能长期坚持为目标。",
      "weeklyPlan": [
        {
          "activity": "快走或骑车",
          "frequency": "每周3次",
          "duration": "每次35分钟",
          "intensity": "能说完整句子、略微出汗"
        },
        {
          "activity": "自重力量训练",
          "frequency": "每周2次",
          "duration": "每次20分钟",
          "intensity": "动作稳定，不追求力竭"
        }
      ],
      "avoidOrCaution": [
        "出现胸痛、明显气短或头晕时停止活动并及时就医"
      ]
    },
    "dietGuide": {
      "culturalAdaptation": "家常饭不用全部改变，先从少含糖饮料、主食适量和每餐增加蔬菜开始。",
      "mealStructure": [
        {
          "meal": "早餐",
          "recommendation": "保证蛋白质和一份全谷物或薯类"
        },
        {
          "meal": "午晚餐",
          "recommendation": "一半蔬菜，四分之一蛋白质，四分之一主食"
        }
      ],
      "keyFoodSwaps": [
        {
          "from": "含糖饮料",
          "to": "白水或无糖茶"
        },
        {
          "from": "肥肉和油炸肉",
          "to": "鱼、禽肉或豆制品"
        }
      ]
    },
    "seasonalTips": {
      "spring": "逐步增加户外活动。",
      "summer": "避开最热时段并注意补水。",
      "autumn": "保持固定运动频率。",
      "winter": "充分热身后再运动。"
    }
  },
  "demo-mother": {
    "personId": "demo-mother",
    "sourceAnalysisHash": "375a65d0e1d084da21d04a5297bd21f9",
    "dataConfidence": "high",
    "topPriorities": [
      {
        "rank": 1,
        "action": "保持规律三餐和优质蛋白质",
        "why": "血红蛋白和铁蛋白已经回升，稳定节奏比短期强化更重要",
        "howToStart": "每周提前准备两种富含铁和蛋白质的家常食材"
      },
      {
        "rank": 2,
        "action": "继续保持户外活动",
        "why": "维生素D五年趋势稳定向上",
        "howToStart": "工作日午间安排 20 分钟户外步行"
      }
    ],
    "exerciseGuide": {
      "overview": "选择对工作节奏干扰小、容易恢复的活动。",
      "weeklyPlan": [
        {
          "activity": "快走或轻松慢跑",
          "frequency": "每周3次",
          "duration": "每次30分钟",
          "intensity": "轻到中等"
        },
        {
          "activity": "瑜伽或拉伸",
          "frequency": "每周2次",
          "duration": "每次20分钟",
          "intensity": "动作舒适"
        }
      ],
      "avoidOrCaution": [
        "明显疲倦、心悸或头晕时先休息，并视情况咨询医生"
      ]
    },
    "dietGuide": {
      "culturalAdaptation": "不需要追求补品，优先从正常饭菜获得蛋白质、铁和蔬果。",
      "mealStructure": [
        {
          "meal": "早餐",
          "recommendation": "鸡蛋、奶或豆制品搭配主食"
        },
        {
          "meal": "正餐",
          "recommendation": "轮换瘦肉、鱼、豆制品和深色蔬菜"
        }
      ],
      "keyFoodSwaps": [
        {
          "from": "只吃面包或咖啡",
          "to": "增加鸡蛋、奶或豆浆"
        }
      ]
    },
    "seasonalTips": {
      "spring": "利用天气舒适多做户外活动。",
      "summer": "保证饮水和规律进餐。",
      "autumn": "继续户外步行。",
      "winter": "日照较少时与医生确认是否需要复查维生素D。"
    }
  },
  "demo-grandfather": {
    "personId": "demo-grandfather",
    "sourceAnalysisHash": "e80ca07eb51f6ace8cc7928d5cc3947d",
    "dataConfidence": "high",
    "topPriorities": [
      {
        "rank": 1,
        "action": "保持家庭血压记录",
        "why": "五年趋势正在改善，固定方法能让比较更可靠",
        "howToStart": "每周选 2 天、同一时间测量并记录"
      },
      {
        "rank": 2,
        "action": "稳稳地动，不追求强度",
        "why": "规律活动比偶尔大量运动更容易长期坚持",
        "howToStart": "从每天饭后散步 20 分钟开始"
      }
    ],
    "exerciseGuide": {
      "overview": "以安全、平稳和可持续为原则，逐步增加活动量。",
      "weeklyPlan": [
        {
          "activity": "饭后散步",
          "frequency": "每周5天",
          "duration": "每次20–30分钟",
          "intensity": "能轻松交谈"
        },
        {
          "activity": "坐站和提踵练习",
          "frequency": "每周2次",
          "duration": "每次15分钟",
          "intensity": "扶稳支撑物"
        }
      ],
      "avoidOrCaution": [
        "不在头晕、胸闷或身体不适时勉强运动",
        "变更运动强度前先结合医生意见"
      ]
    },
    "dietGuide": {
      "culturalAdaptation": "保留熟悉口味，先减少额外加盐和腌制食品频率。",
      "mealStructure": [
        {
          "meal": "一日三餐",
          "recommendation": "规律进餐，每餐有蔬菜和优质蛋白质"
        }
      ],
      "keyFoodSwaps": [
        {
          "from": "腌菜和加工肉",
          "to": "新鲜蔬菜和鱼禽肉"
        }
      ]
    },
    "seasonalTips": {
      "spring": "天气转暖后逐步恢复户外步行。",
      "summer": "避开高温并注意补水。",
      "autumn": "适合保持规律散步。",
      "winter": "注意保暖，起身和运动时放慢速度。"
    }
  },
  "demo-grandmother": {
    "personId": "demo-grandmother",
    "sourceAnalysisHash": "c2cdeaab89a63ff8bbb184435d235620",
    "dataConfidence": "high",
    "topPriorities": [
      {
        "rank": 1,
        "action": "把骨骼复查计划确认清楚",
        "why": "骨密度方向有所改善，但最新值仍需要继续关注",
        "howToStart": "下次复诊时带上历年同部位骨密度结果"
      },
      {
        "rank": 2,
        "action": "增加安全的负重活动",
        "why": "骨骼健康更需要长期活动习惯",
        "howToStart": "从每天 20 分钟步行和简单坐站练习开始"
      }
    ],
    "exerciseGuide": {
      "overview": "重点是防跌倒、维持腿部力量和日常活动能力。",
      "weeklyPlan": [
        {
          "activity": "户外步行",
          "frequency": "每周5天",
          "duration": "每次20–30分钟",
          "intensity": "舒适速度"
        },
        {
          "activity": "坐站和平衡练习",
          "frequency": "每周3次",
          "duration": "每次15分钟",
          "intensity": "在稳固支撑旁进行"
        }
      ],
      "avoidOrCaution": [
        "不在湿滑或光线不足的环境练习",
        "若有骨折史、持续疼痛或医生限制，先咨询专业人员"
      ]
    },
    "dietGuide": {
      "culturalAdaptation": "保证正常三餐中的奶或豆制品、蛋白质和蔬菜，不依赖单一补品。",
      "mealStructure": [
        {
          "meal": "早餐",
          "recommendation": "奶或强化豆制品搭配鸡蛋和主食"
        },
        {
          "meal": "正餐",
          "recommendation": "每餐有一掌心蛋白质和充足蔬菜"
        }
      ],
      "importantWarnings": [
        {
          "topic": "补充剂",
          "detail": "维生素D或钙的具体补充量应结合检查、饮食和医生意见确认。"
        }
      ]
    },
    "seasonalTips": {
      "spring": "天气舒适时多做户外步行。",
      "summer": "注意防晒、补水和防滑。",
      "autumn": "保持下肢力量练习。",
      "winter": "穿防滑鞋，室内保持通道明亮。"
    }
  },
  "demo-daughter": {
    "personId": "demo-daughter",
    "sourceAnalysisHash": "e4485dd533e535fb494d800d035a7175",
    "dataConfidence": "high",
    "topPriorities": [
      {
        "rank": 1,
        "action": "把视力复查排进日程",
        "why": "双眼裸眼视力近两年都保持在 0.8，需要规范检查进一步确认",
        "howToStart": "本周和家长一起选择儿童眼科时间"
      },
      {
        "rank": 2,
        "action": "每天保证户外活动",
        "why": "户外活动有助于形成更健康的用眼和运动节奏",
        "howToStart": "放学后先到户外活动再开始作业"
      }
    ],
    "exerciseGuide": {
      "overview": "以兴趣和同伴活动为主，减少久坐。",
      "weeklyPlan": [
        {
          "activity": "跑跳、球类或骑车",
          "frequency": "每周5天",
          "duration": "每天累计60分钟",
          "intensity": "中等为主"
        },
        {
          "activity": "亲子户外活动",
          "frequency": "每周1次",
          "duration": "60–90分钟",
          "intensity": "轻松愉快"
        }
      ],
      "avoidOrCaution": [
        "运动环境注意交通安全和防晒补水"
      ]
    },
    "dietGuide": {
      "culturalAdaptation": "成长阶段不节食，保证三餐、蛋白质、蔬果和主食结构完整。",
      "mealStructure": [
        {
          "meal": "早餐",
          "recommendation": "主食、蛋白质和水果至少包含两类"
        },
        {
          "meal": "放学后",
          "recommendation": "用水果、奶或原味坚果替代高糖零食"
        }
      ],
      "keyFoodSwaps": [
        {
          "from": "边写作业边吃零食",
          "to": "固定一次简单加餐"
        }
      ]
    },
    "seasonalTips": {
      "spring": "增加户外球类活动。",
      "summer": "避开正午高温并注意防晒。",
      "autumn": "开学后保持每日户外时间。",
      "winter": "减少连续近距离用眼，利用白天户外活动。"
    }
  }
};

export function getAnalysis(personId: string): AnalysisData | undefined { return ANALYSIS_DATA[personId]; }
export function getEvents(personId: string): HealthEvent[] { return EVENTS_DATA[personId] || []; }
export function getMeasurements(personId: string, eventId: string): MeasurementItem[] { return MEASUREMENTS_DATA[personId]?.[eventId] || []; }
export function getSuggestions(personId: string): SuggestionData | null { return SUGGESTIONS_DATA[personId] || null; }
export function getLifestyle(personId: string): LifestyleData | null { return LIFESTYLE_DATA[personId] || null; }
