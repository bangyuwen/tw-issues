# Hsinchu reader-first pilot acceptance evidence

## Scope and D1

- Baseline commit: `179f4fc5eefe2390e9a7fb2d5583541b3a16fc6e` (`origin/main` at implementation start).
- Implementation commits: `f3dc8df` (`feat(tw-issues): pilot Hsinchu reader-first issue flow`), `1b395d4` (bind acceptance evidence), and `f2edeb2` (freeze Hsinchu record fingerprints and source metadata).
- Corrected exact-range review: `179f4fc5eefe2390e9a7fb2d5583541b3a16fc6e..32ffd14`, fresh `independent-reviewer`, no P1/P2/P3 findings.
- D1 selected: introduction-first. The route must introduce the dispute and reading map before the long primary-document unit while retaining a prominent direct document shortcut.
- The frozen inventory is `content-preservation.json`. Its three public input hashes, baseline SSR hashes/fragments for all twelve approved topics, Hsinchu projection hash, record summaries, source references, and primary-document coverage describe the pre-change contract.
- EZ WAY remains a process/information page. The homepage, EZ WAY, generic dossier routes, other approved topics, and seven metadata-only topics are outside this pilot.

## Required readback

| Case | Procedure | Expected result | Status |
|---|---|---|---|
| H1 | Render Hsinchu SSR and inspect the first section IDs/headings. | Issue entry, reading legend, and `#case-contents` now precede `#primary-document`; the hero shortcut reaches the document. | Passed in `npm test` / `tests/rendered-html.test.mjs` |
| H2 | Compare Hsinchu record/source inventory and public input hashes with `content-preservation.json`. | The three public input hashes, 12-topic baseline inventory, Hsinchu record counts, source references, and source-58 page 3–22/redaction boundaries match. | Passed by inventory readback and `tests/topic-page.test.tsx` |
| H3 | Open `#case-contents`, `#primary-document`, `#primary-document-reading`, each existing chapter/source fragment, and the canonical document/source actions. | Every target remains unique and native; component tests retain fragment targets, canonical source links, `_blank`, and `noreferrer`. | Passed in component/SSR tests |
| H4 | Render homepage, EZ WAY, and all other approved topic routes against their baseline SSR hashes. | Public inputs, homepage, EZ WAY, and all non-Hsinchu approved topic outputs remain unchanged. | Passed by preservation regression tests; Hsinchu is the only changed route |
| H5 | Exercise the SSR/no-JavaScript link contract and responsive/focus rules at the 390px and 1440px CSS breakpoints; use the existing Back/Forward fragment test. | Native links remain usable, focus styles and 44px targets remain scoped to the Hsinchu shell, and responsive rules avoid introducing overflow. | Passed by SSR/static CSS and unit coverage; screen-reader, actual browser zoom, and manual visual overflow checks remain residual gates |

## Repository validation

The exact implementation revision passed `npm test`, `npm run lint`, `npm run build` (also exercised by `npm test`), `openspec validate pilot-hsinchu-reader-first-ia --strict`, and `git diff --check`. An initial exact-range review identified and was corrected by `f2edeb2`: the Hsinchu preservation test now compares every frozen record fingerprint plus canonical source metadata, rather than only counts. The corrected exact-range review found no actionable findings. Screen-reader user testing, actual browser zoom, and owner acceptance remain explicit residual gates; no evaluator or headless result may be described as a reader study.

## Content boundary

This change moves existing rendered components only. It does not add facts, infer responsibility, deduplicate similar text, change source roles, promote the third-party partial document, or alter `source-58`'s page 3–22 and redaction/missing-page limits. The production release remains a separate authorization.
