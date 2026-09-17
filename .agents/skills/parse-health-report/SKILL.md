---
name: parse-health-report
description: Extract structured health events and measurements from local medical reports for this dashboard. Use when new PDF or image reports must enter the staged data pipeline; do not use for diagnosis.
---

# Parse health report

Read `docs/DATA-CONTRACT.md` and `docs/PIPELINE.md` before processing.

1. Scan only the member/report paths named by the user. Compare each file SHA-256 with `data/processed-files.json`.
2. Extract every readable page into a staged `ExtractionResult`. Preserve event date, source, source files, original indicator names, normalized names, units, reference ranges, abnormal flags, and all relevant organ mappings.
3. Merge same-member, same-date files only when they are clearly one encounter; retain every source file and record the merge decision.
4. Distinguish report text, calculated values, user corrections, and unknown fields. Never infer an unreadable number.
5. Report page coverage and unresolved fields. Do not update formal data or the processed-file index until review is approved.

Do not diagnose, prescribe, transmit reports externally, or expose personal data in logs. If OCR or another processor is external, stop until the user has authorized that processor and exact data scope.
