## ADDED Requirements

### Requirement: Same-page discovery sections
The existing `/` homepage SHALL render two visible sections, `#all-issues` labeled `全部議題` followed by `#recent-updates` labeled `最近更新`, after native navigation links to those fragments. Both sections SHALL be present without JavaScript, with no new route, tab or filter state. Existing base-path-aware site links SHALL be used for cross-page home-fragment links. Each section SHALL link once to every approved `research-topics.json.topics` slug, twelve at the frozen baseline, and SHALL exclude the seven additional metadata-only slugs. Per-card DOM IDs, if used, SHALL NOT collide between sections.

#### Scenario: First-time and returning reader entry
- **WHEN** a reader opens `/` or follows `/#recent-updates` with JavaScript disabled
- **THEN** both visible sections and both native navigation entries exist, with the fragment targeting recent updates when supplied
- **AND** every one of the twelve approved topic routes is reachable from each section and none of the seven metadata-only slugs appears in either list

#### Scenario: Page and event dates have different owners
- **WHEN** an entry renders page metadata and an optional event preview
- **THEN** `頁面更新` comes only from that topic's `lastUpdated` with a valid time element, or `頁面更新日期未提供` for a missing/invalid value
- **AND** `事件日期` comes from the selected timeline event's `occurredAt` using its existing date-precision formatter, with its status/attribution/limitations preserved

### Requirement: Honest discovery and update ordering
The homepage SHALL distinguish all-issue discovery from recent page updates. All issues SHALL preserve the array order of the approved `research-topics.json.topics` input, including explicitly positioned new entries; array position defines a total order without ties. Recent updates SHALL sort valid `lastUpdated` dates descending with slug ascending for ties; unknown or invalid dates SHALL follow valid dates in slug-ascending order and be explicitly labeled unavailable. Event dates SHALL be identified separately from page dates, and latest events MUST NOT be described as newly added without change-history evidence.

#### Scenario: Input order differs from update date
- **WHEN** an August-updated topic follows a July-updated topic in the input array
- **THEN** recent updates place the August entry first while all-issue discovery uses its documented stable order

#### Scenario: Equal or missing dates
- **WHEN** two topics share a valid date and another has no valid date
- **THEN** the tied topics use slug order and the undated topic follows dated topics with no fabricated date

#### Scenario: Page changed after its newest event
- **WHEN** a page date is later than the latest recorded event
- **THEN** both dates retain their separate meanings and the event is not presented as a newly occurring or newly added event

### Requirement: Public topic inclusion and classification
Discovery SHALL use the approved public topic set, keeping metadata-only topics out of readable-issue listings unless they separately qualify for publication. Topical categories SHALL be deferred until explicit labels and slug assignments are recorded in public site-owned metadata. Unassigned public topics SHALL remain reachable through all issues. No source count or topic label SHALL imply credibility or completeness.

#### Scenario: Metadata-only topic exists
- **WHEN** a topic exists only in the additional `allTopics` metadata without qualified public content
- **THEN** it is not automatically promoted into the readable-issue listing or generated as a substantive dossier

#### Scenario: No approved taxonomy
- **WHEN** category labels and topic assignments remain unapproved
- **THEN** all issues and recent updates remain usable without keyword-derived categories

#### Scenario: Optional taxonomy is approved later
- **WHEN** explicit public category assignments are supplied
- **THEN** the homepage applies those assignments and retains all unassigned public topics in all issues
