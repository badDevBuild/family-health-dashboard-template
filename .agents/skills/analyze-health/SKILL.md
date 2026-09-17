---
name: analyze-health
description: Analyze one member's complete approved health-event history by organ system. Use after extraction is approved and a plain-language, trend-aware analysis is needed.
---

# Analyze health history

Read the member's complete approved events and `docs/DATA-CONTRACT.md`.

- Organize results by the eight systems in `src/shared/organs.ts`; one indicator may inform multiple systems.
- Explain each important indicator in ordinary language, then cite the relevant dates, values, units, and reference conditions.
- Describe a trend only when dates, units, and measurement conditions are comparable.
- Label cross-organ relationships as reference information, not causation.
- End actions at monitoring, recheck, and consulting a qualified clinician. Never diagnose or prescribe.
- Keep OCR corrections, file reconciliation, and model execution details in the run receipt, not the family-facing narrative.

Write to the staged run directory. Any upstream data change invalidates the candidate analysis and its review.
