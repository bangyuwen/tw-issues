## Context

TW Issues already verifies that its three public inputs are internally fresh and safe to publish. That structural check cannot detect a real-world proceeding that advanced while an open question or time-sensitive sentence stayed unchanged. The missing control belongs to this repository because its fields, evidence roles, and public/private boundary are project-specific.

The control has two phases: an agent or human researches current public evidence and writes a bounded receipt; a deterministic local command validates that receipt against the exact release candidate. Research remains judgmental and networked. Validation remains reproducible, offline, and read-only.

## Goals / Non-Goals

**Goals:**

- Audit only changed public topics and mutable propositions.
- Preserve source role, proof scope, limitations, canonical URL, and retrieval cutoff.
- Bind every audit to an exact base, HEAD, public-data fingerprint, and scoped text.
- Produce one of `READY`, `READY_WITH_OPEN_GAPS`, `BLOCKED_STALE_DATA`, or `NOT_APPLICABLE`.
- Fit the existing release sequence without owning tests, review, PR, deploy, or production readback.

**Non-Goals:**

- No live research in CI or in the validator.
- No automatic content rewrite or factual inference.
- No committed audit receipt, new frontend behavior, bundle schema, private producer, secret, or deployment configuration.
- No full-site audit when the release changes only presentation or one bounded topic.

## Decisions

### 1. Use an external receipt bound to the current HEAD

`npm run check:prepublish-data -- --base-ref <full-commit> --receipt <path>` derives scope from the base and current `HEAD`, then validates the supplied JSON receipt. The receipt records schema version, base revision, target revision, a fingerprint of the three public inputs, scoped proposition paths and before/after text, retrieval cutoff, evidence, dispositions, and overall outcome.

The receipt is created after the release-candidate commit and is not committed. This avoids a circular requirement where a tracked receipt would need to name the hash of the commit that contains itself. Any new commit or public-data change invalidates it.

### 2. Derive the smallest factual scope

The validator examines only `public-bundle.json`, `app/public-evidence.json`, and `app/research-topics.json` between the base and `HEAD`. Candidate propositions are changed `openQuestions`, proceeding-track status or conclusions, latest timeline content, and changed strings with temporal markers such as `目前`, `仍`, `尚未`, `將`, `進行中`, `截至`, `current`, `still`, `not yet`, `will`, `in progress`, or `as of`.

Every candidate must appear exactly once in the receipt. A diff with no changed public input or mutable candidate returns `NOT_APPLICABLE` without requiring a receipt. The validator never widens the audit to unchanged topics.

### 3. Keep evidence judgment explicit

Each proposition records a disposition and one or more public evidence entries with source role, publisher, canonical HTTPS URL, publication date, proof scope, and limitations. Official or primary records support outcomes. A named speaker or report supports only an attributed statement or reported procedure. A search that finds no result may support only `OPEN_WITH_CUTOFF`; it cannot prove that no result exists.

Allowed dispositions are `CURRENT`, `UPDATE_REQUIRED`, `OPEN_WITH_CUTOFF`, `MOVE_OUT_OF_OPEN_QUESTIONS`, and `BLOCKED`. The deterministic reducer maps all current or valid moved propositions to `READY`; adds bounded open gaps as `READY_WITH_OPEN_GAPS`; and maps any required update, unsupported evidence, unbounded wording, or blocked proposition to `BLOCKED_STALE_DATA`.

### 4. Keep one narrow implementation owner

The implementation adds one Node standard-library validator, one package script, focused tests, and a short README release step. It does not call the network, mutate the worktree, wrap existing commands, or add CI/deployment integration. Before implementation, measure all planned production edits; if they exceed three production files or 120 changed production lines, stop for scope approval.

## Risks / Trade-offs

- **Research can still be wrong.** Required proof scope and limitations make the judgment reviewable; deterministic validation does not claim to replace research review.
- **Temporal wording may evade the marker list.** Explicit changed-field categories cover known structured locations; adding markers requires a reviewed contract change.
- **A manual gate can be skipped.** README places the command immediately before existing release gates, without pretending CI can perform current-world research.
- **An external receipt is not durable by default.** The release record should retain it with the review evidence, but it must not enter the public bundle or repository.

## Migration Plan

1. Measure the implementation surface and stop if the repository limit would be exceeded.
2. Add the validator, package script, focused tests, and README step.
3. Validate fixtures for factual, presentation-only, open-gap, stale, drift, and private-boundary cases.
4. Run existing test, lint, build, and GitHub Pages build commands.
5. For a factual release, fix the release candidate, create the external receipt against its exact HEAD, run the check, then continue the existing review and release sequence.

Rollback is a normal revert of the validator, package script, tests, and documentation; no public data migration is required.

## Open Questions

None.
