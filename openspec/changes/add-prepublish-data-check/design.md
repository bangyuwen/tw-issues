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

The validator resolves the receipt to a regular file outside the canonical repository root. The receipt is a closed schema: root, fingerprint, scope, proposition, audit, and source objects each reject unknown keys; no attachment, blob, notes, or arbitrary metadata field is allowed. Free text exists only in bounded `finding`, `proof_scope`, and `limitations` fields. The validator recursively rejects forbidden keys (`secret`, `token`, `password`, `private_key`, `ledger_id`, and `deployment_project_id`) and forbidden string values (`context/`, `account/`, `.claude/`, and `evidence-ledger`), including when nested inside an otherwise allowed field.

### 2. Derive the smallest factual scope

The validator reads `public-bundle.json`, `app/public-evidence.json`, and `app/research-topics.json` from the base and `HEAD` Git blobs, not from unchecked working files, and fails if any corresponding worktree path differs from `HEAD`. Candidate propositions are changed `openQuestions`, proceeding-track status or conclusions, the latest changed `reportedTimeline` entry ordered by `occurredAt`, `reportedAt`, then `publicKey`, freshness dates, and changed strings with temporal markers such as `目前`, `仍`, `尚未`, `將`, `進行中`, `截至`, `current`, `still`, `not yet`, `will`, `in progress`, or `as of`.

Temporal matching uses Unicode-normalized, case-insensitive substring matching on changed visible string leaves. Identifier, canonical-URL, digest, and machine-only timestamp fields are excluded. `MOVE_OUT_OF_OPEN_QUESTIONS` requires a `target_path` that exists in the `HEAD` public data, is outside `openQuestions`, and contains the receipt-bound replacement text.

Freshness dates use semantic slug-keyed paths: `public-bundle.json:topics.<slug>.as_of` and `app/research-topics.json:topics[slug].lastUpdated`. The matching `allTopics[slug].lastUpdated` mirror is validated for equality but does not create a duplicate proposition. A mismatch between mirrored dates is blocking. `reportedTimeline` is the only timeline collection in scope.

Timeline entries match across base and `HEAD` by unique `publicKey`, never array position. Missing or duplicate keys block scope derivation, and array-only reordering creates no proposition.

Every candidate must appear exactly once in the receipt. A diff with no mutable candidate returns `NOT_APPLICABLE` without requiring a receipt. The validator never widens the audit to unchanged topics.

### 3. Keep evidence judgment explicit

Each proposition records a disposition and one or more public evidence entries with `publicRef`, source role, publisher, canonical HTTPS URL, publication date, proof scope, and limitations. Source metadata must exactly match a source in the `HEAD` public data. Source role is a closed enum: `official_record`, `primary_document`, `attributed_report`, or `bounded_search`. `official_record` additionally requires a canonical `.gov.tw` host and a current published `displayRole` of `制度或機關紀錄`, `原始紀錄`, `檢察機關偵查終結公告`, or `行政法院判決`; a government statement cannot self-promote through its hostname. `primary_document` requires a match to the topic's published `primaryDocument.source` plus its provenance and coverage boundaries. Proceeding outcomes and `MOVE_OUT_OF_OPEN_QUESTIONS` require one of those two roles. `attributed_report` can support only a target proposition that retains named attribution; `bounded_search` can support only `OPEN_WITH_CUTOFF`. `CURRENT` and `UPDATE_REQUIRED` must use the role allowed for the proposition type. Sources that cannot meet a stricter deterministic role remain attributed rather than being promoted.

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
