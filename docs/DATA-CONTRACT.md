# 数据契约

真实数据目录 `data/` 默认被 Git 忽略。`examples/demo-data/` 只用于虚构演示。生成器采用严格模式：字段缺失、无效日期、重复 ID 或引用断裂都会指出文件和字段并终止，不会静默跳过。

```text
data/
  family-context.json
  processed-files.json
  extracted/<personId>/<reportId>.json
  analysis/<personId>.json
  suggestions/<personId>.json
  lifestyle/<personId>.json
  manifests/<personId>.json
  verified/<personId>/runs/<运行编号>/...
```

## 稳定身份

- `personId`：成员稳定 ID，只允许字母、数字和连字符；展示名变化不影响关联。
- `encounterId`：一次就诊或体检的稳定 ID。同一天可以有多个不同就诊。
- `reportId`：一份报告的稳定 ID。同一次就诊可显式合并多份报告。
- `measurementId`：一项测量的稳定 ID，并引用 `reportId` 和页码。

“同一天”不是合并条件。只有 `encounterId` 相同，且日期、类型和机构一致时，生成器才合并报告；任何重复报告或指标 ID 都会拒绝发布。

## FamilyContext

```json
{
  "schemaVersion": 1,
  "members": [
    { "personId": "person-a", "displayName": "成员甲", "birthYear": 1990, "gender": "男" }
  ]
}
```

## ExtractionResult

```json
{
  "schemaVersion": 1,
  "personId": "person-a",
  "event": {
    "encounterId": "encounter-20260112-a",
    "type": "体检",
    "date": "2026-01-12",
    "source": "机构名称",
    "reports": [
      { "reportId": "report-a", "sourceFile": "受控存储中的相对路径", "pageRefs": [1, 2] }
    ]
  },
  "measurements": [
    {
      "measurementId": "measurement-a",
      "reportId": "report-a",
      "page": 1,
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

前端只收到 `reportId` 和页码，不暴露本机 `sourceFile` 路径。展示证据链为：结论 → 指标 → 事件 → 报告 ID/页码。原始文件应由另一个受控接口提供，不能放进前端 bundle。

## AnalysisReport 与趋势

必须包含 `personId` 和 `organAnalyses`。每个器官分析包含状态、面向普通人的叙事和关键指标趋势。

- 事实：指出数值和报告自身的参考范围。
- 数值变化：`up`、`down`、`stable` 只表达方向，使用中性色，不自动代表改善或恶化。
- 健康解释：必须由已审核分析单独给出；没有分析时整体状态是 `unknown`，不是 `normal`。
- 缺失值和定性结果不能转换为零；仅数值且单位、方法可比时绘制趋势。

## SuggestionReport

`reviewSuggestions` 会进入“下一步”页。每项至少包含 `what`、`when`、`where`、`why`，并可包含：

- `status`: `ai_pending`、`doctor_confirmed` 或 `completed`。
- `owner`、`completedAt`。
- `evidence`: 关联的 `eventId` 与 `measurementIds`。

AI 待确认事项必须明确标注，不能伪装成医生意见。

## 私有发布批准记录

私有生成要求 `manifests/<personId>.json` 中每个现有阶段都有与当前文件完全匹配的批准记录：

```json
{
  "schemaVersion": 1,
  "personId": "person-a",
  "stages": {
    "extract": {
      "status": "approved",
      "outputHash": "SHA-256",
      "dependsOn": { "context": "family-context.json 的 SHA-256" },
      "reviewer": "reviewer-id",
      "approvedBy": "owner-id",
      "approvedAt": "2026-09-17T08:00:00Z"
    },
    "analysis": {
      "status": "approved",
      "outputHash": "SHA-256",
      "dependsOn": { "context": "family-context.json 的 SHA-256", "extract": "同一份提取输出的 SHA-256" },
      "reviewer": "reviewer-id",
      "approvedBy": "owner-id",
      "approvedAt": "2026-09-17T08:10:00Z"
    }
  }
}
```

所有阶段都依赖当前 `family-context.json` 哈希；`suggestions` 和 `lifestyle` 还依赖当前 `analysis` 哈希。任何成员背景或上游内容变化都会使下游批准失效并阻止私有生成。`LifestyleGuide.sourceAnalysisHash` 继续使用分析文件原始字节的 MD5 作为兼容性标识，但批准记录使用 SHA-256。
