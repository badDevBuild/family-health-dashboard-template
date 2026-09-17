// 自动生成，请勿手动编辑
// 发布模式: demo

export type HealthStatus = "unknown" | "normal" | "attention" | "alert";
export type ReviewStatus = "demo" | "approved" | "not_reviewed";
export type AnalysisData = { personId: string; crossOrganInsights?: string[]; actionSuggestions?: string[]; organAnalyses: Array<{ organ: string; status: string; narrative: string; keyIndicators: Array<{ name: string; latestValue: number | string | null; unit: string; referenceRange?: string; trend: string; isAbnormal: boolean; history: Array<{ date: string; value: number | string | null }> }> }>; [key: string]: unknown };
export type LifestyleData = Record<string, any>;
export type SuggestionData = { personId: string; reviewSuggestions: Array<{ priority: string; organ: string; what: string; when: string; where: string; why: string; status?: "ai_pending" | "doctor_confirmed" | "completed"; owner?: string; completedAt?: string; evidence?: Array<{ eventId: string; measurementIds?: string[] }> }>; [key: string]: unknown };

export interface FamilyMember { id: string; name: string; status: HealthStatus; reviewStatus: ReviewStatus; lastCheckup: string; dataSpan: string; }
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
    "id": "demo-a",
    "name": "示例成员甲",
    "status": "attention",
    "reviewStatus": "demo",
    "lastCheckup": "2026-01-12",
    "dataSpan": "1次检查"
  },
  {
    "id": "demo-b",
    "name": "示例成员乙",
    "status": "attention",
    "reviewStatus": "demo",
    "lastCheckup": "2026-02-18",
    "dataSpan": "1次检查"
  },
  {
    "id": "demo-c",
    "name": "示例成员丙",
    "status": "normal",
    "reviewStatus": "demo",
    "lastCheckup": "2026-03-04",
    "dataSpan": "1次检查"
  }
];
export const ANALYSIS_DATA: Record<string, AnalysisData> = {
  "demo-a": {
    "personId": "demo-a",
    "analysisDate": "2026-01-13T09:00:00+08:00",
    "personContext": {
      "gender": "男",
      "age": 38,
      "dataSpan": "1次虚构检查"
    },
    "organAnalyses": [
      {
        "organ": "代谢/内分泌",
        "status": "attention",
        "narrative": "这组虚构数据里，空腹血糖略高于示例参考范围。血糖反映身体调节能量的情况，单次偏高不能用于诊断，建议结合复查结果向医生咨询。",
        "keyIndicators": [
          {
            "name": "空腹血糖",
            "latestValue": 6.3,
            "unit": "mmol/L",
            "referenceRange": "3.9-6.1",
            "trend": "up",
            "isAbnormal": true,
            "history": [
              {
                "date": "2026-01-12",
                "value": 6.3
              }
            ]
          }
        ]
      },
      {
        "organ": "肝胆",
        "status": "normal",
        "narrative": "这组虚构数据中的肝酶在示例参考范围内，目前没有需要特别提示的变化。",
        "keyIndicators": [
          {
            "name": "谷丙转氨酶",
            "latestValue": 24,
            "unit": "U/L",
            "referenceRange": "9-50",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2026-01-12",
                "value": 24
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [
      "【参考信息】血糖变化需要结合饮食、睡眠和复查结果综合理解。"
    ],
    "actionSuggestions": [
      "如复查仍异常，建议携带报告咨询医生。"
    ],
    "dataHash": "synthetic-demo-a"
  },
  "demo-b": {
    "personId": "demo-b",
    "analysisDate": "2026-02-19T09:00:00+08:00",
    "personContext": {
      "gender": "女",
      "age": 35,
      "dataSpan": "1次虚构检查"
    },
    "organAnalyses": [
      {
        "organ": "血液",
        "status": "attention",
        "narrative": "这组虚构数据里的血红蛋白略低，表示血液携带氧气的能力可能需要进一步确认。单次结果不能说明原因，建议结合复查并咨询医生。",
        "keyIndicators": [
          {
            "name": "血红蛋白",
            "latestValue": 108,
            "unit": "g/L",
            "referenceRange": "115-150",
            "trend": "down",
            "isAbnormal": true,
            "history": [
              {
                "date": "2026-02-18",
                "value": 108
              }
            ]
          }
        ]
      },
      {
        "organ": "心血管",
        "status": "normal",
        "narrative": "这组虚构数据中的血压在示例参考范围内。",
        "keyIndicators": [
          {
            "name": "收缩压",
            "latestValue": 118,
            "unit": "mmHg",
            "referenceRange": "90-139",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2026-02-18",
                "value": 118
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [
      "【参考信息】血液指标需结合饮食、月经情况及医生判断理解。"
    ],
    "actionSuggestions": [
      "建议按医生意见复查血常规。"
    ],
    "dataHash": "synthetic-demo-b"
  },
  "demo-c": {
    "personId": "demo-c",
    "analysisDate": "2026-03-05T09:00:00+08:00",
    "personContext": {
      "gender": "女",
      "age": 11,
      "dataSpan": "1次虚构检查"
    },
    "organAnalyses": [
      {
        "organ": "眼/五官",
        "status": "normal",
        "narrative": "这组虚构筛查数据没有标记异常。儿童视力仍应按学校和医生建议定期复查。",
        "keyIndicators": [
          {
            "name": "裸眼视力",
            "latestValue": "5.0",
            "unit": "",
            "referenceRange": "示例范围",
            "trend": "stable",
            "isAbnormal": false,
            "history": [
              {
                "date": "2026-03-04",
                "value": "5.0"
              }
            ]
          }
        ]
      }
    ],
    "crossOrganInsights": [],
    "actionSuggestions": [
      "按常规节奏进行视力筛查。"
    ],
    "dataHash": "synthetic-demo-c"
  }
};
export const EVENTS_DATA: Record<string, HealthEvent[]> = {
  "demo-a": [
    {
      "id": "demo-a:enc-2026-01-12-a",
      "encounterId": "enc-2026-01-12-a",
      "date": "2026-01-12",
      "type": "体检",
      "source": "示例社区医院",
      "personId": "demo-a",
      "reports": [
        {
          "reportId": "report-demo-a-20260112",
          "pageRefs": [
            1
          ]
        }
      ],
      "organTags": [
        "代谢/内分泌",
        "心血管",
        "肝胆"
      ],
      "measurementCount": 2,
      "abnormalCount": 1
    }
  ],
  "demo-b": [
    {
      "id": "demo-b:enc-2026-02-18-b",
      "encounterId": "enc-2026-02-18-b",
      "date": "2026-02-18",
      "type": "体检",
      "source": "示例体检中心",
      "personId": "demo-b",
      "reports": [
        {
          "reportId": "report-demo-b-20260218",
          "pageRefs": [
            1
          ]
        }
      ],
      "organTags": [
        "血液",
        "心血管"
      ],
      "measurementCount": 2,
      "abnormalCount": 1
    }
  ],
  "demo-c": [
    {
      "id": "demo-c:enc-2026-03-04-c",
      "encounterId": "enc-2026-03-04-c",
      "date": "2026-03-04",
      "type": "体检",
      "source": "示例学校筛查",
      "personId": "demo-c",
      "reports": [
        {
          "reportId": "report-demo-c-20260304",
          "pageRefs": [
            1
          ]
        }
      ],
      "organTags": [
        "眼/五官"
      ],
      "measurementCount": 1,
      "abnormalCount": 0
    }
  ]
};
export const MEASUREMENTS_DATA: Record<string, Record<string, MeasurementItem[]>> = {
  "demo-a": {
    "demo-a:enc-2026-01-12-a": [
      {
        "measurementId": "demo-a-glucose-20260112",
        "reportId": "report-demo-a-20260112",
        "page": 1,
        "standardName": "空腹血糖",
        "originalName": "葡萄糖",
        "value": 6.3,
        "numericValue": 6.3,
        "unit": "mmol/L",
        "referenceRange": {
          "low": 3.9,
          "high": 6.1
        },
        "isAbnormal": true,
        "organs": [
          "代谢/内分泌",
          "心血管"
        ]
      },
      {
        "measurementId": "demo-a-alt-20260112",
        "reportId": "report-demo-a-20260112",
        "page": 1,
        "standardName": "谷丙转氨酶",
        "originalName": "ALT",
        "value": 24,
        "numericValue": 24,
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
  "demo-b": {
    "demo-b:enc-2026-02-18-b": [
      {
        "measurementId": "demo-b-hgb-20260218",
        "reportId": "report-demo-b-20260218",
        "page": 1,
        "standardName": "血红蛋白",
        "originalName": "HGB",
        "value": 108,
        "numericValue": 108,
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
        "measurementId": "demo-b-sbp-20260218",
        "reportId": "report-demo-b-20260218",
        "page": 1,
        "standardName": "收缩压",
        "originalName": "收缩压",
        "value": 118,
        "numericValue": 118,
        "unit": "mmHg",
        "referenceRange": {
          "low": 90,
          "high": 139
        },
        "isAbnormal": false,
        "organs": [
          "心血管"
        ]
      }
    ]
  },
  "demo-c": {
    "demo-c:enc-2026-03-04-c": [
      {
        "measurementId": "demo-c-vision-20260304",
        "reportId": "report-demo-c-20260304",
        "page": 1,
        "standardName": "裸眼视力",
        "originalName": "右眼裸眼视力",
        "value": "5.0",
        "numericValue": null,
        "unit": "",
        "referenceRange": {
          "text": "示例范围"
        },
        "isAbnormal": false,
        "organs": [
          "眼/五官"
        ]
      }
    ]
  }
};
export const SUGGESTIONS_DATA: Record<string, SuggestionData | null> = {
  "demo-a": {
    "personId": "demo-a",
    "suggestionDate": "2026-01-13T10:00:00+08:00",
    "reviewSuggestions": [
      {
        "priority": "medium",
        "organ": "代谢/内分泌",
        "what": "复查空腹血糖",
        "when": "按医生建议安排",
        "where": "全科或内分泌科",
        "why": "一次虚构检查中的空腹血糖略高于示例参考范围，需要复查确认。",
        "status": "ai_pending",
        "owner": "示例成员甲",
        "evidence": [
          {
            "eventId": "demo-a:enc-2026-01-12-a",
            "measurementIds": [
              "demo-a-glucose-20260112"
            ]
          }
        ]
      }
    ],
    "watchItems": [],
    "lifestyleDirections": [],
    "nextCheckup": {
      "lastCheckupDate": "2026-01-12",
      "suggestedNextDate": "请与医生确认",
      "focusItems": [
        "空腹血糖"
      ]
    }
  },
  "demo-b": null,
  "demo-c": null
};
export const LIFESTYLE_DATA: Record<string, LifestyleData | null> = {
  "demo-a": {
    "personId": "demo-a",
    "sourceAnalysisHash": "98afacce5c274e0d37f270b3ac90858a",
    "dataConfidence": "partial",
    "topPriorities": [
      {
        "rank": 1,
        "action": "保持规律作息和复查",
        "why": "单次示例数据不足以形成长期趋势",
        "howToStart": "先记录一周作息，并按医生建议安排复查"
      }
    ],
    "exerciseGuide": {
      "overview": "在身体允许且医生无特别限制时，逐步增加日常活动。",
      "weeklyPlan": [
        {
          "activity": "快走",
          "frequency": "每周3次",
          "duration": "每次30分钟",
          "intensity": "能说话、略微出汗"
        }
      ],
      "avoidOrCaution": [
        "出现胸痛、明显气短或头晕时停止并及时就医"
      ]
    },
    "dietGuide": {
      "culturalAdaptation": "不用追求极端饮食，优先保证蔬菜、蛋白质和主食结构均衡。",
      "mealStructure": [
        {
          "meal": "一日三餐",
          "recommendation": "规律进餐，减少含糖饮料"
        }
      ]
    },
    "seasonalTips": {
      "spring": "逐步恢复户外活动。",
      "summer": "炎热天气注意补水。",
      "autumn": "保持规律运动。",
      "winter": "充分热身后再运动。"
    }
  },
  "demo-b": null,
  "demo-c": null
};

export function getAnalysis(personId: string): AnalysisData | undefined { return ANALYSIS_DATA[personId]; }
export function getEvents(personId: string): HealthEvent[] { return EVENTS_DATA[personId] || []; }
export function getMeasurements(personId: string, eventId: string): MeasurementItem[] { return MEASUREMENTS_DATA[personId]?.[eventId] || []; }
export function getSuggestions(personId: string): SuggestionData | null { return SUGGESTIONS_DATA[personId] || null; }
export function getLifestyle(personId: string): LifestyleData | null { return LIFESTYLE_DATA[personId] || null; }
