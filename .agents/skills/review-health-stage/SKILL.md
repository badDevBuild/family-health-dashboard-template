---
name: review-health-stage
description: Independently review one staged extraction, analysis, suggestion, or lifestyle result against its complete evidence. Use before promotion to formal dashboard data.
---

# Review one health stage

Build one review input containing the complete evidence and candidate output for exactly one stage. A list of paths is not a complete input.

Review independently before comparing the candidate. Return:

- evidence coverage and any unreadable or missing parts;
- `corrections` with target, reason, and evidence;
- `additions` that are supported but absent;
- `safetyIssues` for diagnosis, prescription, overclaiming, or privacy problems;
- a clear terminal status.

A successful transport or tool call does not approve content. The primary agent or authorized reviewer must resolve every item, record accepted and rejected changes, and create a new downstream input. Do not modify source files, reuse a review after inputs change, or transmit real data to an external model without explicit authorization for that processor and scope.
