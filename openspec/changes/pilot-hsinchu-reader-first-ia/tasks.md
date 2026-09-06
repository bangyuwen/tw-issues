## 1. Freeze the pilot boundary

- [x] 1.1 Record D1 as introduction-first and capture the exact baseline revision, public-input hashes, Hsinchu record/content inventory, existing fragments, and non-pilot SSR fingerprints in `content-preservation.json` and `acceptance-evidence.md`.
- [x] 1.2 Verify the inventory contains the primary-document provenance/coverage boundaries, all Hsinchu statuses, attributions, proof scopes, limitations, canonical source links, and the unchanged EZ WAY/homepage boundary.

## 2. Implement the Hsinchu reading order

- [x] 2.1 Add the Hsinchu primary-document shortcut and issue-first explanatory copy without adding a new factual conclusion.
- [x] 2.2 Update `getHsinchuDossierChapters()` so Chapter 01 lists the existing document gateway and guide after context/coverage in actual DOM order.
- [x] 2.3 Move the existing primary-document gateway and guide into Chapter 01 for Hsinchu only, preserving each component, fragment, provenance owner, and canonical action exactly once.
- [x] 2.4 Verify the existing Hsinchu-scoped spacing/focus styles cover the new order; no additional CSS is needed, and homepage, EZ WAY, generic routes, and other topics remain unchanged.

## 3. Verify the pilot

- [x] 3.1 Add rendered-HTML and component assertions for Hsinchu order, contents destinations, stable fragments, document/source behavior, and visible evidence boundaries.
- [x] 3.2 Add preservation/regression assertions for public input bytes, Hsinchu records, homepage, EZ WAY, and all other approved topic renderings.
- [x] 3.3 Exercise the SSR/no-JavaScript link contract, keyboard focus rules, canonical document/source actions, native Back/Forward coverage, and 390/1440px responsive CSS; record outcomes and remaining accessibility gates.
- [x] 3.4 Run `npm test`, `npm run lint`, `npm run build`, strict OpenSpec validation, and `git diff --check`; record exact revision evidence.

## 4. Review and delivery gate

- [x] 4.1 Commit the exact implementation and acceptance evidence on the Hsinchu branch (`f3dc8df`, `1b395d4`, `f2edeb2`).
- [x] 4.2 Obtain a fresh exact-range `independent-reviewer` result and resolve any findings with a new reviewed commit. Corrected review of `179f4fc5..32ffd14` reported no P1/P2/P3 findings.
- [x] 4.3 Prepare a PR summary that distinguishes the Hsinchu pilot from the unchanged EZ WAY process page and does not publish until separately authorized.
