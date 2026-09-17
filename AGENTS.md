# Agent working agreement

## Project goal

Build a privacy-first, read-only family health dashboard. Data is organized around health events and projected onto both organ and timeline views.

## Non-negotiable boundaries

- Never commit real health reports, personal identifiers, avatars, credentials, deployment paths, private generated data, or model-review payloads.
- Treat `data/`, `reports/`, and `src/lib/health-data.private.ts` as local-only.
- Do not diagnose disease or prescribe medication. Separate facts, trends, reference-only associations, actions, and unknowns.
- A successful model call is not content approval. A successful build is not publication.
- Any external transfer of real health data requires explicit authorization for the processor and data scope.

## Architecture

- `HealthEvent` is the write model; organ and timeline views are projections.
- One measurement may belong to multiple organ systems.
- The frontend is read-only. Report processing happens in the staged pipeline described in `docs/PIPELINE.md`.
- Upstream changes invalidate downstream analysis, suggestions, lifestyle guidance, and reviews.

## Before changing UI

Read `docs/DESIGN-SYSTEM.md`. Preserve 16px minimum body text, 44px touch targets, warm colors, light mode, and low-anxiety status language.

## Verification

Run `npm run check`. For a private build, generate `src/lib/health-data.private.ts`, run the same checks, then build with `VITE_AUTH_ENABLED=true npm run build-private` without committing private artifacts.
