---
name: create-lifestyle-guide
description: Create a concrete, culturally adaptable lifestyle guide from approved analysis, suggestions, and local family context. Use after upstream approval and lower confidence when evidence is incomplete.
---

# Create lifestyle guide

Read the approved analysis, suggestions, and only the relevant member context from `data/family-context.json`.

- Prioritize one to three practical actions.
- Give implementable exercise frequency, duration, intensity, meal structure, food swaps, and seasonal notes when medically appropriate.
- Adapt to age, mobility, climate, household food culture, and stated preferences without stereotyping.
- Set `dataConfidence` to `partial` or `insufficient` when source coverage cannot support personalization.
- Non-prescription supplements may be discussed cautiously with a clinician-confirmation note; do not prescribe drugs or recommend traditional medicines.
- Set `sourceAnalysisHash` from the final approved analysis file bytes so later changes can invalidate the guide.

Keep this candidate staged until independent review and synthesis are complete.
