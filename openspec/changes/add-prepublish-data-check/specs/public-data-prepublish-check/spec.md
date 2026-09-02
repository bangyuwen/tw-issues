## ADDED Requirements

### Requirement: The repository exposes a deterministic prepublish data check
The repository SHALL expose `npm run check:prepublish-data`. The command MUST read local public files, Git objects, and a caller-supplied receipt only; it MUST NOT use the network or modify the worktree.

#### Scenario: A factual release is checked
- **WHEN** the command receives a resolvable full base revision and a receipt for current `HEAD`
- **THEN** it SHALL validate scope, integrity, evidence boundaries, and release outcome
- **AND** it SHALL succeed only for `READY` or `READY_WITH_OPEN_GAPS`

#### Scenario: A presentation-only release is checked
- **WHEN** the base-to-HEAD diff changes no public input or mutable public proposition
- **THEN** it SHALL return `NOT_APPLICABLE` without requiring a receipt or research

### Requirement: Scope contains every changed mutable proposition exactly once
The check SHALL derive changed topics from `public-bundle.json`, `app/public-evidence.json`, and `app/research-topics.json`. Mutable propositions SHALL include changed open questions, proceeding status or conclusions, the latest changed timeline entry ordered by `occurredAt` then `reportedAt`, changed topic `as_of`/public-index update dates, and changed strings containing configured temporal wording.

#### Scenario: One topic changes
- **WHEN** only one topic contains changed mutable propositions
- **THEN** only that topic and those propositions SHALL require audit entries
- **AND** unchanged topics SHALL remain outside scope

#### Scenario: Scope is missing or widened
- **WHEN** a receipt omits, duplicates, or adds a candidate proposition
- **THEN** the check SHALL return `BLOCKED_STALE_DATA`

#### Scenario: A stale temporal wording is still published
- **WHEN** a changed proposition says `仍`, `尚未`, `將`, `截至`, `still`, `not yet`, `will`, or `as of` but the receipt supplies no direct current support, retrieval cutoff, or bounded limitation
- **THEN** the proposition SHALL be `BLOCKED`
- **AND** the overall outcome SHALL be `BLOCKED_STALE_DATA`

### Requirement: Evidence retains its authority and limits
Each audited proposition SHALL record a source role, publisher, canonical HTTPS URL, publication date, proof scope, limitations, and retrieval cutoff. An official or primary record MAY support an outcome; an attributed source MUST remain attributed; an inconclusive search MUST record its bounded `search_scope` and MUST NOT be treated as proof that no outcome exists.

#### Scenario: A newer official result resolves an open question
- **WHEN** an official record establishes a newer result
- **THEN** the proposition SHALL use `MOVE_OUT_OF_OPEN_QUESTIONS` or `UPDATE_REQUIRED` according to the target data
- **AND** a ready outcome SHALL require the resolved proposition to be represented outside `openQuestions`

#### Scenario: Search finds no public result by the cutoff
- **WHEN** a bounded search locates no identifiable result
- **THEN** the proposition MAY use `OPEN_WITH_CUTOFF` with its search scope and limitation
- **AND** the overall outcome MAY be `READY_WITH_OPEN_GAPS`
- **AND** the receipt SHALL NOT claim that no result exists

#### Scenario: A named speaker is the only source
- **WHEN** a named speaker or report is the only evidence
- **THEN** it SHALL support only an attributed statement or reported procedure
- **AND** promotion to a verified official outcome SHALL be blocked

### Requirement: The receipt is external and bound to the release candidate
The receipt SHALL remain outside the repository and public output. It SHALL bind its schema version, full base revision, current full HEAD, public-data fingerprint, scoped paths and before/after text, retrieval cutoff, and overall outcome. A revision or scoped-data change SHALL invalidate it.

#### Scenario: Receipt bindings match
- **WHEN** the base, HEAD, public inputs, scope, and text match the receipt
- **THEN** the check SHALL evaluate its dispositions

#### Scenario: Revision or data drifts
- **WHEN** HEAD, a public input, or a scoped proposition differs from the receipt
- **THEN** the check SHALL return `BLOCKED_STALE_DATA`

#### Scenario: Receipt contains private material
- **WHEN** a receipt includes a private producer path, account data, ledger identifier, secret, deployment ID, or raw private research
- **THEN** the check SHALL reject it

### Requirement: Dispositions reduce to one bounded release outcome
Each scoped proposition SHALL have exactly one of `CURRENT`, `UPDATE_REQUIRED`, `OPEN_WITH_CUTOFF`, `MOVE_OUT_OF_OPEN_QUESTIONS`, or `BLOCKED`. The check SHALL derive `READY` for current or valid moved propositions, `READY_WITH_OPEN_GAPS` when only valid cutoff-bounded gaps remain, and `BLOCKED_STALE_DATA` for any required update, blocked proposition, unsupported evidence, invalid binding, or inconsistent declared outcome.

#### Scenario: All propositions are current or validly moved
- **WHEN** every scoped proposition is `CURRENT` or a valid `MOVE_OUT_OF_OPEN_QUESTIONS`
- **THEN** the outcome SHALL be `READY`

#### Scenario: A stale proposition remains
- **WHEN** any proposition is `UPDATE_REQUIRED`, `BLOCKED`, unsupported, or unbounded
- **THEN** the outcome SHALL be `BLOCKED_STALE_DATA`

### Requirement: The check composes with existing release gates
The check SHALL run immediately before the existing test, lint, build, review, pull-request, deployment, and production-readback sequence. It SHALL NOT invoke, replace, or weaken those owners and SHALL NOT change frontend rendering or the public bundle schema.

#### Scenario: The data check passes
- **WHEN** the outcome is `READY` or `READY_WITH_OPEN_GAPS`
- **THEN** the operator SHALL continue the existing release sequence
- **AND** the check SHALL not duplicate any downstream command

#### Scenario: Existing public fragments are rendered
- **WHEN** a reader opens an existing topic fragment or canonical public source link after the check
- **THEN** the check SHALL not modify frontend rendering, fragment targets, canonical URLs, or public evidence boundaries
- **AND** the existing rendered-page and public-output tests SHALL remain the authority for those behaviors
