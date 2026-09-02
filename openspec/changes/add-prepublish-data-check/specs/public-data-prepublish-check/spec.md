## ADDED Requirements

### Requirement: The repository exposes a deterministic prepublish data check
The repository SHALL expose `npm run check:prepublish-data`. The command MUST derive public scope and fingerprints from Git blobs, verify that the three public worktree paths equal current `HEAD`, and read a caller-supplied receipt; it MUST NOT use the network or modify the worktree.

#### Scenario: A factual release is checked
- **WHEN** the command receives a resolvable full base revision and a receipt for current `HEAD`
- **THEN** it SHALL validate scope, integrity, evidence boundaries, and release outcome
- **AND** it SHALL succeed only for `READY` or `READY_WITH_OPEN_GAPS`

#### Scenario: A presentation-only release is checked
- **WHEN** the base-to-HEAD diff yields no mutable public proposition
- **THEN** it SHALL return `NOT_APPLICABLE` without requiring a receipt or research

### Requirement: Scope contains every changed mutable proposition exactly once
The check SHALL derive changed topics from the base and `HEAD` Git blobs of `public-bundle.json`, `app/public-evidence.json`, and `app/research-topics.json`. Mutable propositions SHALL include changed open questions, proceeding status or conclusions, the latest changed `reportedTimeline` entry ordered by `occurredAt`, `reportedAt`, then `publicKey`, `public-bundle.json:topics.<slug>.as_of`, `app/research-topics.json:topics[slug].lastUpdated`, and changed visible strings containing configured temporal wording. Timeline entries SHALL match across revisions by unique `publicKey`; a missing/duplicate key SHALL block derivation and array-only reordering SHALL create no proposition. The matching `allTopics[slug].lastUpdated` value SHALL equal the canonical `topics[slug].lastUpdated` value and SHALL NOT create a duplicate proposition. Temporal matching SHALL be Unicode-normalized and case-insensitive and SHALL exclude identifier, canonical-URL, digest, and machine-only timestamp fields.

#### Scenario: One topic changes
- **WHEN** only one topic contains changed mutable propositions
- **THEN** only that topic and those propositions SHALL require audit entries
- **AND** unchanged topics SHALL remain outside scope

#### Scenario: Scope is missing or widened
- **WHEN** a receipt omits, duplicates, or adds a candidate proposition
- **THEN** the check SHALL return `BLOCKED_STALE_DATA`

#### Scenario: A public worktree input differs from HEAD
- **WHEN** any of the three public input paths has staged, unstaged, or untracked content that differs from its `HEAD` blob
- **THEN** the check SHALL fail before evaluating the receipt

#### Scenario: Only a canonical freshness date changes
- **WHEN** a public topic's `as_of` or `lastUpdated` date changes without another mutable text change
- **THEN** the date SHALL appear once in scope under its slug-keyed semantic path
- **AND** mismatched `topics` and `allTopics` mirrors SHALL be blocked

#### Scenario: Timeline entries are reordered
- **WHEN** `reportedTimeline` array order changes but each unique `publicKey` entry is unchanged
- **THEN** the reorder SHALL create no mutable proposition
- **AND** missing or duplicate `publicKey` values SHALL block scope derivation

#### Scenario: A stale temporal wording is still published
- **WHEN** a changed proposition says `仍`, `尚未`, `將`, `截至`, `still`, `not yet`, `will`, or `as of` but the receipt supplies no direct current support, retrieval cutoff, or bounded limitation
- **THEN** the proposition SHALL be `BLOCKED`
- **AND** the overall outcome SHALL be `BLOCKED_STALE_DATA`

### Requirement: Evidence retains its authority and limits
Each audited proposition SHALL record a `publicRef` whose publisher, canonical HTTPS URL, and publication date exactly match a source in current `HEAD`, a source role from `official_record`, `primary_document`, `attributed_report`, or `bounded_search`, plus proof scope, limitations, and retrieval cutoff. `official_record` SHALL additionally require a canonical hostname ending in `.gov.tw` and a current published `displayRole` of `制度或機關紀錄`, `原始紀錄`, `檢察機關偵查終結公告`, or `行政法院判決`; a government statement or press release without one of those classifications SHALL remain attributed. `primary_document` SHALL require the source to match the topic's published `primaryDocument.source` and SHALL retain its provenance and coverage boundaries. Proceeding outcomes and `MOVE_OUT_OF_OPEN_QUESTIONS` SHALL require `official_record` or `primary_document`. `attributed_report` SHALL support only a target proposition retaining named attribution. `bounded_search` SHALL support only `OPEN_WITH_CUTOFF`. `CURRENT` and `UPDATE_REQUIRED` SHALL use the role allowed for the proposition type; evidence that cannot meet a stricter role SHALL remain attributed.

#### Scenario: A newer official result resolves an open question
- **WHEN** an official record establishes a newer result
- **THEN** the proposition SHALL use `MOVE_OUT_OF_OPEN_QUESTIONS` or `UPDATE_REQUIRED` according to the target data
- **AND** `MOVE_OUT_OF_OPEN_QUESTIONS` SHALL name a `target_path` that exists in current `HEAD`, is outside `openQuestions`, and contains the receipt-bound replacement text

#### Scenario: Search finds no public result by the cutoff
- **WHEN** a bounded search locates no identifiable result
- **THEN** the proposition MAY use `OPEN_WITH_CUTOFF` with its search scope and limitation
- **AND** the overall outcome MAY be `READY_WITH_OPEN_GAPS`
- **AND** its `finding` SHALL equal `No identifiable public result was located within the recorded search scope by the retrieval cutoff.`
- **AND** its bounded-search `proof_scope` SHALL equal `This evidence records only a bounded public search completed by the retrieval cutoff.`
- **AND** its bounded-search `limitations` SHALL equal `The search may be incomplete; later, unpublished, or unindexed results may exist.`
- **AND** any other value in those three fields, including a claim that no result exists, SHALL be blocked

#### Scenario: A named speaker is the only source
- **WHEN** a named speaker or report is the only evidence
- **THEN** it SHALL support only an attributed statement or reported procedure
- **AND** promotion to a verified official outcome SHALL be blocked

#### Scenario: A source self-labels as official without official authority
- **WHEN** a receipt labels evidence `official_record` but its `publicRef` metadata does not match `HEAD`, its canonical hostname is not `.gov.tw`, or its current published `displayRole` is not record-classified
- **THEN** the evidence SHALL be blocked

### Requirement: The receipt is external and bound to the release candidate
The receipt SHALL be a regular, non-symlink file whose canonical path is outside the repository root and public output. It SHALL use a closed schema whose root, fingerprint, scope, proposition, audit, and source objects reject unknown keys. It SHALL allow bounded free text only in `finding`, `proof_scope`, and `limitations`; it SHALL NOT allow attachment, blob, notes, or arbitrary metadata fields. It SHALL bind its schema version, full base revision, current full HEAD, public-data fingerprint, scoped paths and before/after text, retrieval cutoff, and overall outcome. A revision or scoped-data change SHALL invalidate it. The validator SHALL recursively reject keys named `secret`, `token`, `password`, `private_key`, `ledger_id`, or `deployment_project_id`, and any string value containing `context/`, `account/`, `.claude/`, or `evidence-ledger`.

#### Scenario: Receipt bindings match
- **WHEN** the base, HEAD, public inputs, scope, and text match the receipt
- **THEN** the check SHALL evaluate its dispositions

#### Scenario: Revision or data drifts
- **WHEN** HEAD, a public input, or a scoped proposition differs from the receipt
- **THEN** the check SHALL return `BLOCKED_STALE_DATA`

#### Scenario: Receipt contains private material
- **WHEN** a receipt includes a private producer path, account data, ledger identifier, secret, deployment ID, or raw private research
- **THEN** the check SHALL reject it

#### Scenario: Receipt path is inside the repository
- **WHEN** the receipt resolves inside the canonical repository root or through a symlink
- **THEN** the check SHALL reject it before parsing

#### Scenario: Private material is hidden in a nested field
- **WHEN** an unknown nested key carries raw notes or an allowed text field contains a forbidden private path or identifier
- **THEN** the check SHALL reject the receipt

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
