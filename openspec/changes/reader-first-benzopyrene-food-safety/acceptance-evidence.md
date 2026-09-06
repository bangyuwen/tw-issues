# Local acceptance evidence

Base: `7101fbbd270e9f8933a41883ec1f2f7279da6d68`.
Tested code/test/lock bytes: `tested-files.json`. The implementation commit containing this file binds these bytes; the final delivery receipt records the exact reviewed HEAD. All checks ran in this dedicated worktree with Node v22.22.2 and the unchanged package lock (npm ci). No public input or dependency changes.

## Results

- Baseline `npm test`: passed before implementation.
- Final `npm test`: passed, including projection freshness, build, 23 rendered-HTML tests and 62 component/model tests.
- `npm run lint`: passed.
- `npm run build`: passed separately. Existing vinext route-classification and dependency deprecation warnings remain; they did not fail the build.
- `openspec validate reader-first-benzopyrene-food-safety --strict`: passed before implementation and after it.
- `git diff --check`: passed.
- Preservation: three public files byte-identical; all target projection keys and full source objects match baseline; all baseline statement/scope/limitations remain in HTML; all 44 actual HTML IDs remain once; all internal fragments resolve; homepage and 11 non-target topic SSR hashes unchanged.

The initial fragment collector also matched two `data-collection-id` attributes (46 matches). The corrected collector was verified against an archive of the exact baseline commit: its regenerated SSR SHA matched the pre-implementation SHA exactly, yielding 44 unique actual IDs. No baseline source or record fingerprint was recaptured from changed code.

## Browser inspection

Procedure: `browser-procedure.cjs.txt`; result: `browser-results.json`; viewports: `oil-390.png`, `oil-1440.png`.

Headless Google Chrome 151.0.7922.138 against the local vinext dev server:

- At 320, 390, 800 and 1440 CSS pixels, document scroll width equaled viewport width. Contents followed the actual DOM order.
- Parent visually inspected the 390 and 1440 screenshots: title/scope/date, source entry and section navigation are readable; the first verified record leads the evidence section.
- Keyboard Tab first reached the skip link; Enter navigated to `#main-content`.
- Question navigation reached `#questions`; its citation opened the source disclosure and focused `#source-35`; Back returned to `#questions`.
- With JavaScript disabled, the dated question and local scope/limitations remained readable; native keyboard activation expanded the 36 canonical source links.

An initial dev-server connection attempt preceded server readiness. A later no-JavaScript pointer activation timed out while its target was unstable. The final run used reduced motion and native keyboard activation and completed successfully. This does not claim that pointer activation under all animation states was verified.

## Review and delivery boundary

Decision: the user and repository require a fresh registered independent-reviewer over a committed exact base..HEAD. Dispatch and final outcome are recorded in the delivery receipt, after the implementation commit exists. Any fixes require new commits and fresh review. There is no push, PR, merge or publication authorization.

## Residual acceptance

Manual screen-reader use, actual browser zoom and overflow under zoom, pointer behavior during scrolling/animation, and owner/reader acceptance remain unverified. Headless responsive checks and semantic-heading assertions are not a user study or a full accessibility audit. Browser checks used the development server; production output was covered by build/worker SSR tests, not a deployed browser session. This is local presentation work, not factual revalidation of the public sources.
