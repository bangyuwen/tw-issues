## Why

`tests/verify-projection-freshness.mjs` proves that the public bundle is internally consistent, but it cannot tell when a real-world proceeding has advanced while a time-sensitive proposition remains unchanged. The Hsinchu baseball-stadium review exposed stale or conflated open questions about the main non-prosecution disposition, reconsideration, acceptance/testing, civil and procurement progress, and budget scope; a release-time evidence check is needed before those propositions are published again.

## What Changes

- Add a repository-native `npm run check:prepublish-data` entrypoint for the factual-release boundary. It validates a caller-supplied audit receipt against the exact release-candidate revision and public data currently being released.
- Define a small external JSON receipt contract that records the changed factual topics, only the mutable propositions in scope (`openQuestions`, proceeding-track status/conclusions, latest timeline entries, and temporal wording), evidence roles and proof boundaries, canonical links, publication dates, retrieval cutoff, and exact data digests.
- Separate the agent/human evidence-gathering action from deterministic validation: official or primary-source research produces bounded dispositions, while the repository check validates receipt schema, bindings, and release decisions without live web access.
- Support `CURRENT`, `UPDATE_REQUIRED`, `OPEN_WITH_CUTOFF`, `MOVE_OUT_OF_OPEN_QUESTIONS`, and `BLOCKED` proposition dispositions with `READY`, `READY_WITH_OPEN_GAPS`, and `BLOCKED_STALE_DATA` overall outcomes. Block only stale, contradicted, unsupported, or unbounded mutable claims; preserve an explicit cutoff-bounded gap when public search is inconclusive.
- Return `NOT_APPLICABLE` for presentation-only changes without performing web research, and invalidate receipts when revision, topic/data digest, scoped text, or retrieval binding drifts.
- Document the operator/agent sequence at the existing pre-release boundary: gather evidence and write the receipt, run the deterministic check, then continue the existing tests, lint, build, fixed-diff review, pull request, GitHub Pages deployment, and production readback without duplicating those gates.

## Capabilities

### New Capabilities

- `public-data-prepublish-check`: Defines the changed-topic scope, public audit receipt, evidence-role and cutoff contract, disposition and release outcomes, drift invalidation, deterministic validation boundary, and acceptance cases for time-sensitive factual releases.

### Modified Capabilities

None. The repository has no synchronized main capability under `openspec/specs/`; the existing Hsinchu changes are historical deltas and are not rewritten by this project-level release contract.

## Impact

- `tests/verify-prepublish-data.mjs`: new deterministic receipt/schema/binding validator and `NOT_APPLICABLE` scope handling.
- `package.json`: one repository-local check script, invoked by the documented factual-release boundary rather than by a live web search in CI.
- `README.md`: public-repo operator and agent workflow, receipt fields, and the separation between evidence gathering and deterministic checks.
- `tests/verify-prepublish-data.test.mjs`: focused contract coverage for scope, drift, evidence boundaries, and release outcomes.
- The receipt is generated after the release-candidate commit, supplied explicitly to the command, and remains outside the repository and public output. It must not contain private producer paths, ledger identifiers, secrets, deployment IDs, or raw private research.
- No frontend rendering, public-bundle schema, runtime dependency, private producer, GitHub Actions live-search step, deployment, or production readback behavior changes.
- The planned implementation is limited to three production files (`package.json`, `tests/verify-prepublish-data.mjs`, and `README.md`); the external receipt is evidence input, not repository data or a runtime abstraction.
