---
name: create-health-suggestions
description: Turn an approved health analysis into prioritized recheck and self-monitoring suggestions. Use after analysis approval; do not create medication or diagnosis advice.
---

# Create health suggestions

Use only the approved analysis and relevant evidence. Produce:

- `reviewSuggestions`: what to review, when, which specialty, and why;
- `watchItems`: observable changes and the condition that should trigger medical attention;
- `lifestyleDirections`: broad diet, movement, sleep, or other directions;
- `nextCheckup`: timing and focus items.

Preserve uncertainty and distinguish routine follow-up from urgent action. Do not name prescription drugs, dosages, diagnoses, or unsupported causes. Save the candidate under the staged run; approval is separate from generation.
