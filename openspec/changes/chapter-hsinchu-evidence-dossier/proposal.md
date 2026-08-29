## Why

The deployed Hsinchu Baseball Stadium dossier preserves evidence boundaries well, but its seven-item, single-level contents list hides important secondary sections inside an exceptionally long page and does not expose the public projection's documented coverage gaps. A chaptered evidence dossier can improve task-based scanning and return navigation without turning the page into a dashboard or changing any public fact, attributed statement, analysis, limitation, source, or provenance record.

## What Changes

- Organize the Hsinchu-only reading flow into six document-order chapters whose parent entries expose every existing secondary anchor for context, known and unresolved evidence, chronology, administration actions, proceedings, people, attributed reports, political narratives, editorial analysis, nonrepresentative social observations, and sources.
- Add a public-safe coverage-limits section that presents only already-published gap descriptions and their canonical citations; do not render producer diagnostics, raw readiness enums, search queries, source-count confidence, or inferred completeness.
- Preserve every current evidence-state label and claim-local proof scope, limitations, and canonical-source links. Reconcile the two `source-06` city-government pairs through an explicit Hsinchu mapping, render their identical statements once while preserving every distinct limitation verbatim, and keep the `source-09` procedural report separate. Institutional attribution remains bounded to each source date and never implies continuity across administrations, officeholders, or political parties.
- Keep the current warm paper, deep navy, coral, mint, and editorial evidence language, but reserve light coral for decoration or large text and use a darker accessible coral for small text on paper surfaces.
- Preserve one server-rendered document, stable URL fragments, native disclosure semantics, browser Back/Forward behavior, the current source-target focus flow, and the same DOM order at desktop and 390px.
- Define keyboard, focus, contrast, 44px target, reflow, reduced-motion, heading hierarchy, deep-link, and cross-topic isolation acceptance criteria.
- Keep a five-responsibility-line, question-led casebook as a rejected alternative until a canonical producer-owned lane association exists for every affected claim, event, person, procedure, and narrative.

## Capabilities

### New Capabilities

- `hsinchu-chaptered-evidence-dossier`: Hsinchu-only chapter navigation, public coverage-limit presentation, evidence-category preservation, responsive reading, stable fragment behavior, and accessibility contracts.

### Modified Capabilities

None. There is no main OpenSpec capability currently governing this page; the completed prior change remains historical context rather than an authoritative main spec.

## Impact

- Local implementation surfaces: `app/dossier-page.tsx`, `app/dossier-page-model.ts`, `app/globals.css`, `app/topic-data.ts`, `tests/topic-page.test.tsx`, and `tests/rendered-html.test.mjs`.
- `app/public-evidence.json` and `public-bundle.json` remain content and provenance inputs, not design-owned edit surfaces. The approved Hsinchu presentation mapping is code- and test-scoped, fails closed if the expected public records drift, and never adds a party label that the public projection does not source.
- Shared dossier components and CSS create cross-topic regression risk; all new structure and styling must be scoped to the existing Hsinchu case path or wrapper, and generic topic order/navigation must remain unchanged.
- No new package, client-side state store, image asset, filter, sentiment score, confidence score, analytics dependency, or deployment change is required.
