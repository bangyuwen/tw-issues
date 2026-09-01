## Why

The Hsinchu dossier currently places its central non-prosecution-disposition reading experience below the reading legend, coverage limits, table of contents, and Chapter 01 heading. That weakens the source-first hierarchy, while the directory points to destinations on both sides of itself and the `#primary-document` target uses an oversized red outline that looks like an error state.

## What Changes

- Render a concise Hsinchu-only primary-document source gateway immediately after the hero. It becomes the sole visible owner of the document title, affirmative source-backed lead, directly supported document summary, one neutral scope boundary for observed and missing pages, redaction and copy status, source metadata, canonical Threads link, and `#source-58` registry link.
- Preserve `#primary-document` on that source gateway so existing direct links continue to enter at the document identity and limitations.
- Keep the longer page-range guide, checked excerpt, and document-content/TW Issues-analysis separation inside Chapter 01 under a new downward destination, `#primary-document-reading`, without duplicating the gateway's provenance content or repeating a standalone non-conclusion checklist.
- Remove the poster's political evaluation as a standalone primary-document layer and from the `PrimaryDocument` data contract. Preserve publisher, platform, canonical link, and source limitations in the gateway, while leaving the dossier's later explicitly attributed political narrative unchanged.
- Make the Hsinchu table of contents reflect downward document order: Chapter 01 links to `#primary-document-reading`, `#context`, `#responsibility-lines`, and `#coverage-limits`; it does not point back to the source gateway above it.
- Move dossier-wide public coverage limits into Chapter 01 after case context, separating overall evidence gaps from the primary document's page-specific coverage boundary.
- Remove the red rectangular fragment-target outline while retaining visible keyboard focus indicators on interactive controls.
- For non-prosecution-disposition content visible in the partial images, treat the page images represented by `source-58` as the first evidentiary basis. Treat Threads only as the third-party publication channel, and keep media sources limited to attributed later reactions, reporting, or procedural status that the visible pages do not establish.
- Rewrite only the primary-document reading copy needed to lead with what the visible pages directly support, identify the publisher as Hsinchu City Councilor Yang Ling-yi, reduce repeated cautionary phrasing, and improve page-range chronology. Preserve every underlying fact, evidence classification, proof-scope and limitation meaning, canonical link, stable existing anchor, server-rendered readability, native Back/Forward behavior, and the same semantic DOM across breakpoints.

## Capabilities

### New Capabilities

- `hsinchu-primary-document-entry`: Defines the Hsinchu-only source-first gateway, downstream document-reading guide, forward-only directory order, fragment treatment, responsive semantics, and content-preservation contract.

### Modified Capabilities

None. The repository has no synchronized main OpenSpec capability for this page; the completed prior Hsinchu changes remain historical context, and this delta records the post-release IA refinement explicitly rather than rewriting them.

## Impact

- Hsinchu-only rendering and navigation in `app/dossier-page.tsx`, the primary-document type in `app/topic-data.ts`, and Hsinchu public projection data in `app/public-evidence.json`.
- Hsinchu-scoped layout and target styling in `app/globals.css`.
- Hsinchu structural, rendered-HTML, accessibility, fragment, public-bundle freshness, and cross-topic regression tests.
- The prior `elevate-hsinchu-primary-document` decision is superseded for source-gateway position, table-of-contents behavior, and inclusion of a poster-attribution card inside the primary-document guide; its provenance, coverage, excerpt, classification, canonical-source, and public-output boundaries remain unchanged.
- No new runtime dependency, client state, private producer input, or non-Hsinchu behavior change. Hsinchu source ordering and proof-scope wording may change only where needed to enforce the document/channel/media role boundary.
