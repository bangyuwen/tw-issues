## 1. Characterize the Current Public Contract

- [x] 1.1 Add or tighten Hsinchu rendered-HTML assertions for every existing section anchor, eligible content category, source count, canonical source registry, and private-string exclusion before changing the layout.
- [x] 1.2 Add regression coverage proving sparse projections, unavailable topics, and non-Hsinchu dossier routes retain their current navigation, order, and rendering behavior.
- [x] 1.3 Record an immutable pre-change readback confirming that `app/public-evidence.json`, `public-bundle.json`, public classifications, proof scope, limitations, counts, and canonical links are outside the implementation diff.

## 2. Build the Hsinchu Reading Structure

- [x] 2.1 Add Hsinchu-specific section descriptors and presentation guards in the dossier page model without duplicating or changing public projection data.
- [x] 2.2 Replace the Hsinchu grouped sticky navigation and six-question case map with one non-sticky semantic document-order table of contents that renders only eligible sections.
- [x] 2.3 Reorder the Hsinchu page into the specified context-first evidence spine while preserving every existing rendered secondary anchor and source-disclosure target.
- [x] 2.4 Keep the five responsibility lanes as static explanatory content without links, graph edges, rankings, active state, or implied one-to-one mappings to document sections.

## 3. Strengthen Evidence Boundaries

- [x] 3.1 Refactor claim cards so their unchanged evidence state, statement, proof scope, and limitation remain visible when detailed evidence disclosures are collapsed.
- [x] 3.2 Preserve detailed evidence and canonical source links in native disclosures without truncating, summarizing, regenerating, or inferring public content.
- [x] 3.3 Give procedural records, people and attributed statements, political narratives, and TW Issues analysis distinct headings, labels, fields, and semantic containers without changing their classifications.
- [x] 3.4 Move social observations into an independent supplemental section after editorial analysis, with the provided sample size and non-representative limitation always visible and no percentage or opinion inference.
- [x] 3.5 Confirm that bare top-level `attributedClaims`, `coverageGaps`, and empty editorial positions remain outside the newly rendered public surface.

## 4. Implement Scoped Responsive and Accessible Styling

- [x] 4.1 Add Hsinchu-scoped layout and component styles that preserve the existing warm-paper, navy, coral, mint, and editorial evidence language without affecting other topic routes.
- [x] 4.2 Implement one mobile-first semantic content flow with approximately 20px gutters and single-column navigation/cards at 390px, wrapping long labels and URLs without horizontal page overflow.
- [x] 4.3 Preserve a readable desktop prose measure and allow wider layout only for content such as the source registry that requires it.
- [x] 4.4 Verify accessible foreground/background pairs, non-color state labels, at least 44-by-44 CSS-pixel interactive targets, and visible high-contrast focus indicators.
- [x] 4.5 Preserve sequential heading levels, skip-link behavior, anchor offsets, focus non-obscuration, and reduced-motion behavior without introducing sticky reading state or duplicate breakpoint-specific content.

## 5. Verify Navigation, Content, and Cross-Topic Safety

- [x] 5.1 Update Hsinchu structural tests for the new document order and table of contents while retaining all content, anchor, count, canonical-link, and public-only assertions.
- [x] 5.2 Add tests for table-of-contents eligibility, stable secondary hashes, browser-compatible fragment navigation, and the existing source-disclosure open/focus enhancement.
- [x] 5.3 Add tests proving visible collapsed claim boundaries and the semantic separation of procedure, people/statements, analysis, and social samples.
- [x] 5.4 Re-run the full topic-route suite and verify that non-Hsinchu, sparse, and unavailable projections have no structural or styling regression.
- [x] 5.5 Perform a post-change diff and content readback proving that no public bundle, evidence JSON, source URL, classification, proof scope, limitation, count, or provenance value changed.

## 6. Run Release-Quality Acceptance

- [x] 6.1 Run `npm test`, `npm run lint`, and `npm run build` in an environment with the declared frontend dependencies installed, and resolve every failure attributable to the change.
- [x] 6.2 Verify the page at 390px, immediately below/at/above affected breakpoints, and desktop width with no horizontal page scroll or clipped content.
- [x] 6.3 Verify keyboard-only order and operation, visible and unobscured focus, direct section and source hashes, Back/Forward behavior, and heading navigation.
- [x] 6.4 Verify 200 percent zoom, reduced-motion behavior, and JavaScript-disabled access to all eligible dossier sections, native disclosures, sources, and canonical links.
- [x] 6.5 Obtain a fresh independent review of the exact implementation revision for public-content boundaries, cross-topic regressions, accessibility, and missing test coverage before any delivery action.
