# 数据契约

真实数据目录 `data/` 默认被 Git 忽略。`examples/demo-data/` 只用于虚构演示，两者使用同一结构。

```text
data/
  family-context.json
  processed-files.json
  extracted/<成员>/<日期>.json
  analysis/<成员>.json
  suggestions/<成员>.json
  lifestyle/<成员>.json
  verified/<成员>/runs/<运行编号>/...
```

## ExtractionResult

```json
{
  "person": "成员标识",
  "event": {
    "type": "体检",
    "date": "2026-01-12",
    "source": "机构名称",
    "sourceFiles": ["受控存储中的相对路径"]
  },
  "measurements": [
    {
      "standardName": "空腹血糖",
      "originalName": "葡萄糖",
      "value": 5.2,
      "numericValue": 5.2,
      "unit": "mmol/L",
      "referenceRange": { "low": 3.9, "high": 6.1 },
      "isAbnormal": false,
      "organs": ["代谢/内分泌", "心血管"]
    }
  ]
}
```

## AnalysisReport

必须包含 `personContext`、`organAnalyses`、`crossOrganInsights` 和 `actionSuggestions`。每个器官分析包含状态、面向普通人的叙事和关键指标趋势。

表达边界：

- 事实：指出数值和参考范围。
- 趋势：在日期一致、单位可比时描述变化。
- 关联：必须标为参考，不能写成因果或诊断。
- 行动：最多到复查和咨询医生，不给处方。

## 防重复与变更检测

- `processed-files.json` 用 SHA-256 记录已处理报告。
- `LifestyleGuide.sourceAnalysisHash` 用分析文件原始字节的 MD5 检测过期；这是兼容性标识，不用于安全校验。
- 时间线按报告内的事件日期排序，不依赖文件名。
