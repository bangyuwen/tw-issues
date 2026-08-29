## 1. Resolve public-content owner gates

- [x] 1.1 The public-content owner approved visible coverage limits using only existing public gap text, reasons, and source references without changing `app/public-evidence.json` or `public-bundle.json`.
- [x] 1.2 The content owner approved explicit pairing of the two `source-06` city-government records, preservation of every distinct limitation, separate rendering of the `source-09` procedural report, and source-date boundaries that prevent administration or party continuity inference.
- [x] 1.3 The content owner decided to preserve the final two related-case `analysisClaims` unchanged until separate public applicability metadata exists.
- [x] 1.4 Freeze the content-preservation mapping, current anchor inventory, public-input hashes, and non-inference constraints as the implementation baseline.

## 2. Add a narrow Hsinchu presentation model

- [x] 2.1 Update `app/topic-data.ts` only as needed to type the already-public coverage-gap projection and align any public JSON union values; do not expose producer-only metadata or alter public JSON.
- [x] 2.2 Add a Hsinchu-only six-chapter descriptor to `app/dossier-page-model.ts`, including every applicable current primary and secondary anchor plus the new `#coverage-limits` target.
- [x] 2.3 Add a public-safe coverage-limit view model that emits only approved visible text, gap reason, and source references and excludes raw status, actor role, search time, search query, and readiness fields.
- [x] 2.4 Add the approved Hsinchu-only mapping for the two `source-06` city-government pairs, preserve every distinct limitation verbatim, render the `source-09` procedural report separately, expose source dates, and fail tests on mapping drift without a heuristic fallback or inferred party label.
- [x] 2.5 Keep empty `editorialPositions` conditional so neither `#positions` nor its directory link renders when the collection has no public entries.

## 3. Render the chaptered evidence document

- [x] 3.1 Update the Hsinchu branch of `app/dossier-page.tsx` to render the six-chapter, document-order directory with direct links to all applicable secondary anchors.
- [x] 3.2 Render the visible `#coverage-limits` section before the directory, keeping the limitation headline outside any optional native `details/summary` disclosure.
- [x] 3.3 Add semantic chapter headings, source-date context for institutional statements, and normal “back to this page” links to `#case-contents` without changing the order or wording of existing evidence categories or implying administration/party continuity.
- [x] 3.4 Preserve existing IDs, source-disclosure opening and focus behavior, canonical links, browser history, and `#source-*` fragments while adding only the approved new anchor.
- [x] 3.5 Verify the rendered Hsinchu markup contains no dashboard, tabs, filters, sentiment score, scrollspy, sticky rail, local storage, hidden primary evidence, or CTA pattern.

## 4. Apply scoped editorial presentation

- [x] 4.1 Add Hsinchu-scoped rules in `app/globals.css` for chapter numerals, ruled rows, two-column desktop directory, one-column mobile directory, and a primary reading measure no wider than about 68ch.
- [x] 4.2 Preserve the warm-paper, deep-navy, coral, mint, and evidence-state palette while routing small light-surface coral text to the darker contrast-safe coral ink.
- [x] 4.3 Keep system CJK typography, logical heading scale, resilient `overflow-wrap` for long source tokens, and text/structure labels for every evidence state.
- [x] 4.4 Ensure 390px and 320px reflow has no document-level horizontal scroll, no clipped source text, no overlapping content, and at least 44×44 CSS-pixel product controls.
- [x] 4.5 Add non-color-only `:target` and focus treatments that are not obscured, and disable nonessential transitions and smooth scrolling under `prefers-reduced-motion: reduce`.

## 5. Prove content preservation and cross-topic isolation

- [x] 5.1 Extend `tests/topic-page.test.tsx` to assert the six chapter groups, complete applicable target list, conditional positions behavior, explicit attributed mapping and drift failure, source-date boundaries, and unchanged evidence-category order for Hsinchu.
- [x] 5.2 Extend `tests/rendered-html.test.mjs` to assert one H1, logical chapter/subsection hierarchy, all href/target pairs, public-safe coverage rendering, time-bounded institutional attribution, and absence of internal diagnostics, raw enums, or inferred party labels.
- [x] 5.3 Extend source-disclosure tests to cover `#sources`, representative `#source-*` direct entry, exact focus, chapter-return links, and native Back/Forward restoration.
- [x] 5.4 Add content-preservation assertions for all current quantities and categories, including 12 claims, 8 questions, 16 outer timeline events containing 17 event items, 12 actions, 6 proceedings, 13 people, 9 narratives, 5 analyses, 10 social observations, and 57 unique sources; verify every timeline item's status, wording, proof scope, limitations, and source references.
- [x] 5.5 Add at least one non-Hsinchu rendered-page regression case proving shared renderer and stylesheet edits do not change another topic's order, navigation, anchors, disclosures, or visual class contract.
- [x] 5.6 Recompute `app/public-evidence.json` and `public-bundle.json` hashes and verify both files, every public claim payload, canonical link, digest, and bundle provenance are unchanged by presentation work.

## 6. Run implementation acceptance gates

- [x] 6.1 Run `npm test`, `npm run lint`, and `npm run build` on the exact implementation revision and record the revision and results.
  - 2026-08-29 receipt: base `a39c1e8ee42a34aabe0cb30fbcc468cca7dd4481`; tracked `app/` + `tests/` diff SHA-256 `70127023e744f4e17f6a2a585779cbd540fafba707601b732cecd7c945fc2a5c`; public-bundle freshness, 22 rendered tests, 44 model/component tests, lint, and build all passed.
- [x] 6.2 Inspect desktop and 390px rendered pages for the annotated chapter hierarchy, direct secondary navigation, line length, wrapping, source readability, and no horizontal scrolling.
- [x] 6.3 Complete sequential keyboard, visible/unobscured focus, skip-link, chapter-link, disclosure, source-fragment, and browser Back/Forward checks.
- [ ] 6.4 Complete 200% and 400% zoom/reflow, reduced-motion, automated contrast, and one current screen-reader heading/landmark/source-focus pass.
  - Still open: automated contrast and static reduced-motion checks passed, but the independent verifier had no browser engine for exact zoom/reflow or current screen-reader interaction evidence.
- [x] 6.5 Compare a non-Hsinchu production-equivalent render before and after the exact implementation revision and record any shared-surface effect before requesting review.
