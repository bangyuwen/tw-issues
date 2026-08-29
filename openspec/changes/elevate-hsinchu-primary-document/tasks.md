## 1. Protect the Existing Evidence and Worktree

- [x] 1.1 Record the detached-head identity and exact modified/untracked inventory, distinguish the existing `source-58` work from unrelated user-owned files, and avoid staging or rewriting unrelated changes.
- [x] 1.2 Verify that the local `source-58` manifest describes exactly twenty attachments covering document pages 3–22 and that every current page-image SHA-256 matches before any path change.
- [x] 1.3 Read back page 18 against its image and freeze the initial public excerpt, proof scope, limitations, and terminology before editing the public projection.

## 2. Correct the Local-versus-Public Archive Boundary

- [x] 2.1 Preserve the complete `source-58` directory by moving it intact from the deployable `public/source-archives/` tree to the explicit ignored local analysis path `work/source-archives/hsinchu-baseball-stadium/source-58/`.
- [x] 2.2 Re-run the twenty attachment hash checks and transcript/manifest inventory after the move, proving that the boundary correction changed no captured content.
- [x] 2.3 Confirm that no public renderer, test fixture, or static route depends on a local archive URL and that the local archive is reported as workspace-local rather than a durable archival guarantee.

## 3. Add the Public Primary-Document Contract

- [x] 3.1 Add typed optional primary-document, coverage, structure-guide, checked-excerpt, and attributed-layer models to the public projection without making the field mandatory for other topics.
- [x] 3.2 Add the Hsinchu `primaryDocument` data with `source-58` identity, third-party/redacted/partial provenance, pages 3–22 coverage, missing-page boundaries, neutral document-function ranges, and the checked page 18 excerpt.
- [x] 3.3 Update existing Hsinchu gap and next-step language so it says the third-party-published stamped page images covering pages 3–22 are available while the official complete disposition, absent pages, formal reconsideration materials, and result remain unavailable.
- [x] 3.4 Keep the poster's framing attributed, keep `大秘寶` classified as political framing rather than disposition wording, and retain the existing high-risk claim classifications, proof scopes, limitations, and canonical `source-58` URL.
- [x] 3.5 Synchronize the Hsinchu projection and content digests in `public-bundle.json`, then verify source deduplication still produces one `source-58` registry item and the expected total source count.

## 4. Render the Core Document as Hsinchu Front Matter

- [x] 4.1 Propagate the optional primary-document descriptor through `DossierPageModel`, include its source in standard deduplication, and add `#primary-document` only when the Hsinchu descriptor is eligible.
- [x] 4.2 Make `#primary-document` the first Hsinchu table-of-contents item and render the section before `#context` while preserving the remainder of the context-first evidence spine and all existing secondary anchors.
- [x] 4.3 Implement the source identity, visible provenance warning, coverage ledger, canonical Threads link, neutral page-range guide, checked excerpt, poster-attribution boundary, TW Issues-analysis boundary, and explicit non-conclusions in semantic server-rendered HTML.
- [x] 4.4 Preserve `#source-58` source-disclosure behavior and the existing registry metadata; do not add a public archive, manifest, image, or full-transcript link.
- [x] 4.5 Add Hsinchu-scoped styles for readable 65–75-character desktop measure, one-column 390px flow, wrapped URLs, 44px links, sequential headings, visible focus, WCAG AA text contrast, 200 percent zoom, and reduced motion without introducing client state.

## 5. Prove Content, Provenance, and Cross-Topic Safety

- [x] 5.1 Add model tests for Hsinchu primary-document eligibility, first table-of-contents position, section order, source deduplication, and omission from sparse and non-Hsinchu projections.
- [x] 5.2 Add rendered-HTML assertions for the non-official/partial/redacted warning, pages 3–22 and missing-page boundaries, page 18 pipe/wiring excerpt limits, three evidence-layer labels, canonical Threads link, and unchanged `#source-58` behavior.
- [x] 5.3 Add negative content assertions proving that allegation pages are not labeled as prosecutorial findings, the artifact is not called a judgment or judge's finding, 高虹安 is not said to have personally excavated the objects, and `大秘寶` is not presented as disposition wording.
- [x] 5.4 Add public-output checks proving the GitHub Pages build contains no local `source-58` page image, raw manifest, full transcript, or `/source-archives/` link while retaining bounded excerpts and the canonical source.
- [x] 5.5 Re-run projection-freshness and public-only boundary tests, including private-string exclusion, exact source count, canonical-link preservation, and unchanged non-Hsinchu route behavior.

## 6. Complete Release-Quality Verification

- [x] 6.1 Run `npm test`, `npm run lint`, `npm run build`, and `npm run build:github-pages`, resolving every failure attributable to this change.
- [x] 6.2 Inspect the rendered Hsinchu section at 390px, breakpoint-adjacent and desktop widths, 200 percent zoom, keyboard-only navigation, direct `#primary-document` and `#source-58` hashes, Back/Forward, reduced motion, and with JavaScript disabled.
- [x] 6.3 Perform an exact post-change diff and output readback proving that local source files were preserved, public raw assets were excluded, source provenance stayed canonical, and unrelated user-owned changes were untouched.
- [x] 6.4 Dispatch the registered `independent-reviewer` against the exact fixed implementation diff for public-evidence classification, source-republication boundary, accessibility, cross-topic regressions, and missing tests; resolve every actionable P1 finding and re-run affected verification before any delivery action.
