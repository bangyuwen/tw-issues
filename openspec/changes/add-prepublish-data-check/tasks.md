## 1. Freeze the implementation boundary

- [ ] 1.1 Measure every planned production edit, including the validator and documentation; stop for approval before implementation if the change would exceed three production files or 120 changed production lines.
- [ ] 1.2 Confirm the receipt is a regular non-symlink file outside the canonical repository root and is excluded from Git, the public bundle, and static output.

## 2. Implement the deterministic check

- [ ] 2.1 Add the dependency-free Node validator that reads base/HEAD Git blobs, rejects public-path worktree drift, matches timeline entries by unique `publicKey`, and validates a closed receipt schema, exact bindings, evidence-role matrix, dispositions, and outcomes.
- [ ] 2.2 Add `npm run check:prepublish-data` without wrapping or changing existing release commands.
- [ ] 2.3 Document the short operator flow in `README.md`: fix HEAD, gather bounded public evidence, write the external receipt, run the check, then continue existing gates.

## 3. Verify the contract

- [ ] 3.1 Add focused tests for one-topic factual scope, timeline reorder/ties/missing or duplicate `publicKey`, date-only `as_of`/`lastUpdated` scope and mirror mismatch, presentation-only `NOT_APPLICABLE`, `publicRef`/official-domain/primary-document role binding, attributed-source non-promotion, and honest `OPEN_WITH_CUTOFF` gaps.
- [ ] 3.2 Add focused tests for omitted or duplicate scope, revision/data/worktree drift, move target paths, invalid outcomes, unknown or nested private receipt fields, every forbidden receipt boundary, no network calls, and no worktree mutation.
- [ ] 3.3 Run the focused tests, `npm test`, `npm run lint`, `npm run build`, and `npm run build:github-pages`.
- [ ] 3.4 Inspect the fixed diff and static output to confirm the receipt is absent, rendering is unchanged, and no private producer, global skill, CI search, deployment, or secret surface was added.
