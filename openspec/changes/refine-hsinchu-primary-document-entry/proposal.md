## Why

The Hsinchu dossier currently places its central non-prosecution-disposition reading experience below the reading legend, coverage limits, table of contents, and Chapter 01 heading. That weakens the source-first hierarchy, while the directory points to destinations on both sides of itself and the `#primary-document` target uses an oversized red outline that looks like an error state.

## What Changes

- Render a concise Hsinchu-only primary-document source gateway immediately after the hero. It becomes the sole visible owner of the document title, exact provenance warning, observed and missing-page boundaries, redaction and copy-status limits, source metadata, canonical Threads link, and `#source-58` registry link.
- Preserve `#primary-document` on that source gateway so existing direct links continue to enter at the document identity and limitations.
- Keep the longer page-range guide, checked excerpt, three-layer separation, and non-conclusion material inside Chapter 01 under a new downward destination, `#primary-document-reading`, without duplicating the gateway's provenance content.
- Make the Hsinchu table of contents reflect downward document order: Chapter 01 links to `#primary-document-reading`, `#context`, `#responsibility-lines`, and `#coverage-limits`; it does not point back to the source gateway above it.
- Move dossier-wide public coverage limits into Chapter 01 after case context, separating overall evidence gaps from the primary document's page-specific coverage boundary.
- Remove the red rectangular fragment-target outline while retaining visible keyboard focus indicators on interactive controls.
- Preserve all existing factual wording, evidence classifications, proof scope, limitations, canonical links, stable existing anchors, server-rendered readability, native Back/Forward behavior, and the same semantic DOM across breakpoints.

## Capabilities

### New Capabilities

- `hsinchu-primary-document-entry`: Defines the Hsinchu-only source-first gateway, downstream document-reading guide, forward-only directory order, fragment treatment, responsive semantics, and content-preservation contract.

### Modified Capabilities

None. The repository has no synchronized main OpenSpec capability for this page; the completed prior Hsinchu changes remain historical context, and this delta records the post-release IA refinement explicitly rather than rewriting them.

## Impact

- Hsinchu-only rendering and navigation in `app/dossier-page.tsx` and `app/dossier-page-model.ts`.
- Hsinchu-scoped layout and target styling in `app/globals.css`.
- Hsinchu structural, rendered-HTML, accessibility, fragment, and cross-topic regression tests.
- The prior `elevate-hsinchu-primary-document` placement decision is superseded only for source-gateway position and table-of-contents behavior; its provenance, coverage, excerpt, classification, canonical-source, and public-output boundaries remain unchanged.
- No new runtime dependency, client state, private producer input, public evidence rewrite, or non-Hsinchu behavior change.
