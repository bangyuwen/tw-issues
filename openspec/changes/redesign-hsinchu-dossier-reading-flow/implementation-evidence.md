# Implementation Evidence

## Pre-change public contract

- Baseline Git revision: `f05c360a2e51801f81b0f4c30cf56de147d542ed`
- `app/public-evidence.json` SHA-256: `cab032426ecd24e0479ec45a9f417b375212011fe7ee795d91d2a1c8fecf87bb`
- `public-bundle.json` SHA-256: `930f4576c1c771b4a645861718032773cf43e98a296565da7345a6a6b13f1a91`
- Existing unrelated untracked paths: `.codegraph/`, `.serena/`

Hsinchu public-projection inventory at the baseline:

- 12 claims
- 3 bare top-level attributed claims, not rendered by the current public page
- 2 attributed speaker groups containing 7 rendered statements
- 8 open questions
- 16 reported timeline events
- 12 administration actions
- 6 proceeding tracks
- 13 public people
- 9 political narratives
- 5 analysis claims
- 0 editorial positions
- 10 social observations with `socialObservationCount = 10`
- 5 context lanes and 5 context phases
- 3 coverage gaps, not rendered by the current public page
- 57 rendered unique public sources, asserted by the existing rendered-HTML contract

The implementation scope excludes both public JSON files and every value inventoried above. Post-change readback must reproduce both hashes and the rendered content/source assertions before task 5.5 can be completed.

## Post-change public contract

- `app/public-evidence.json` SHA-256: `cab032426ecd24e0479ec45a9f417b375212011fe7ee795d91d2a1c8fecf87bb` (unchanged)
- `public-bundle.json` SHA-256: `930f4576c1c771b4a645861718032773cf43e98a296565da7345a6a6b13f1a91` (unchanged)
- `git diff --name-only -- app/public-evidence.json public-bundle.json` returned no paths.
- Post-change projection readback reproduced every baseline count: 12 claims; 3 unrendered bare attributed claims; 2 speaker groups with 7 rendered statements; 8 questions; 16 timeline events; 12 administration actions; 6 proceedings; 13 people; 9 narratives; 5 analysis claims; 0 positions; 10 social observations with declared count 10; 5 lanes; 5 phases; 3 unrendered coverage gaps; and 57 rendered sources.
- The rendered-route suite retained canonical-link, source-count, public-only, and private-string exclusion assertions. No public fact, source, classification, proof scope, limitation, count, canonical link, or provenance value changed.

Validation on the exact working tree:

- `npm test`: passed (`public bundle PASS`, 20 rendered-route tests, 40 topic/model tests).
- `npm run lint`: passed.
- `npm run build`: passed on the same source revision; `npm test` also rebuilt successfully.
- Headless Chrome production-preview acceptance passed at widths 390, 519, 520, 521, 799, 800, 801, 999, 1000, 1001, and 1440 CSS pixels with no horizontal page overflow.
- At 390px all 346 visible interactive elements met or exceeded 44 by 44 CSS pixels; the first 14 keyboard stops had visible outlines and settled unobscured, including the skip link, document contents, a native disclosure, and a citation.
- Skip-link activation focused `#main-content`; Space opened a native evidence disclosure; `#analysis`, Back/Forward, and `#source-01` all resolved, with the source disclosure opened and the exact source focused unobscured.
- Reduced-motion emulation produced `scroll-behavior: auto` and zero transition duration; a 720px CSS viewport used as the desktop 200 percent zoom equivalent had no horizontal overflow.
- Measured contrast ratios were 11.60:1 for hero prose, 14.94:1 for contents links and legend labels, and 6.15:1 for evidence-state text. The primary prose measure was 653px while the source registry was allowed 980px.
- With JavaScript disabled, every eligible section and all 57 canonical source links remained in the server-rendered DOM, and the native sources disclosure opened via a browser click.
- Final visual captures: `/Volumes/MacOWC/Services/codex/home/visualizations/2026/08/29/01a04d53-0e28-7c32-b091-9e8208df4d7a/hsinchu-390-final.png` and `/Volumes/MacOWC/Services/codex/home/visualizations/2026/08/29/01a04d53-0e28-7c32-b091-9e8208df4d7a/hsinchu-desktop-final.png`.
- The implementation review against fixed base `f05c360a2e51801f81b0f4c30cf56de147d542ed` confirmed the Hsinchu guard, document order, secondary anchors, visible claim boundaries, source disclosure, social-sample separation, unchanged public JSON, and generic-route fallback. The delivery review loop found two P2 heading-navigation gaps in `#reports` and the Hsinchu editorial sections; those sections now receive real `h2` headings with rendered-HTML regression assertions while generic topic markup remains unchanged. Browser acceptance was not rerun by the static reviewer; the production Chrome evidence above remains the independent runtime path for those unchanged layout and interaction claims. The final exact-head reviewer receipt is delivery evidence outside this repository artifact.

## Checkpoint after first context compaction

- Repository: `/Volumes/MacOWC/Services/codex/worktrees/ed84/tw-issues`
- Fixed baseline revision: `f05c360a2e51801f81b0f4c30cf56de147d542ed`
- Working tree: detached HEAD with scoped edits in `app/dossier-page.tsx`, `app/dossier-page-model.ts`, `tests/rendered-html.test.mjs`, `tests/topic-page.test.tsx`, and this OpenSpec change; unrelated `.codegraph/` and `.serena/` remain untouched.
- Completed validation: strict OpenSpec validation passed; `npm ci --no-audit --no-fund` passed; the focused topic-page test reached the intended red state with only the two new reading-flow assertions failing.
- Remaining work: complete the Hsinchu-only table of contents, document order, visible claim boundaries, responsive styles, full automated validation, browser acceptance, public-contract readback, and fresh independent review.
- Blockers: none in the product implementation. Serena project activation is unavailable because its server attempts to open a stale deleted worktree before switching projects; use repository-scoped search and patch tools instead.
- Next gate: make the two new contract tests pass without changing either public JSON artifact, then validate the browser behavior at desktop and 390px.
