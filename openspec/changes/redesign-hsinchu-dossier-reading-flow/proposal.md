## Why

The Hsinchu Baseball Stadium dossier contains the necessary public evidence boundaries, but its competing navigation structures and current section order make it harder to distinguish event context, procedural responsibility, attributed statements, analysis, and non-representative social samples while scanning a long page. A context-first linear case file will make the dossier easier to orient, audit, and read on mobile without changing any public fact, classification, source, or provenance.

## What Changes

- Replace the Hsinchu-specific grouped sticky navigation and six-question case map with one document-order table of contents shared by desktop and mobile.
- Reorder the Hsinchu dossier into a context-first evidence spine: reading contract and status legend, five responsibility lanes, known and unresolved evidence, chronology and procedural records, people and public statements, editorial analysis, supplemental social observations, and sources.
- Keep proof scope and limitations visible when claim disclosures are collapsed so a statement cannot be scanned without its evidence boundary.
- Give procedural records, people and attributed statements, political narratives, TW Issues analysis, and social observations distinct section and card semantics.
- Isolate the non-representative social sample from political narratives and keep its sample size and limitations visible.
- Preserve all existing public content, evidence states, source links, source-disclosure behavior, and stable section anchors.
- Scope the redesigned structure and styles to the Hsinchu dossier so sparse projections, unavailable topics, and other dossier routes retain their current behavior.
- Require responsive and accessibility acceptance at desktop and 390px, including keyboard order, visible and unobscured focus, contrast, target size, heading hierarchy, reduced motion, deep links, and no horizontal overflow.
- Defer any new public rendering of `coverageGaps`; this change does not expand the current public-content presentation contract.

## Capabilities

### New Capabilities

- `hsinchu-dossier-reading-flow`: Defines the Hsinchu-specific context-first reading order, evidence-boundary presentation, navigation behavior, responsive layout, accessibility, and content-preservation requirements.

### Modified Capabilities

None.

## Impact

- Presentation and model surfaces: `app/dossier-page.tsx`, `app/dossier-page-model.ts`, `app/globals.css`, and narrowly related shared disclosure components if required.
- Verification surfaces: rendered HTML tests, topic-page/model tests, and browser-level responsive and accessibility acceptance.
- Public data contracts remain unchanged: `app/public-evidence.json`, `public-bundle.json`, canonical source URLs, proof scope, limitations, classifications, counts, and provenance are not edited.
- No new runtime dependency, private producer dependency, API, or deployment configuration is introduced.
