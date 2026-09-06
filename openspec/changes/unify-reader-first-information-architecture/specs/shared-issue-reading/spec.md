## ADDED Requirements

### Requirement: Shared entry with topic-specific body
Each migrated issue SHALL expose its title, public material date, mapped scope introduction, question-oriented contents, and source inspection entry before its long body. Contents SHALL follow the actual body order and link only to present sections. The renderer MUST NOT manufacture content to fill a fixed chapter template. Hsinchu document reordering MUST remain pending until D1 in the design is explicitly resolved; a document-first selection requires updating this proposed entry requirement before implementation.

#### Scenario: EZ WAY first-time entry
- **WHEN** a reader opens the migrated EZ WAY issue
- **THEN** purpose and applicability precede detailed chronology, and the page provides process/checks/registration, named concerns/responses, time nodes, individual-case questions, and sources without empty judicial or analysis chapters

#### Scenario: Hsinchu ordering decision remains unresolved
- **WHEN** D1 has no recorded owner selection
- **THEN** the implementation does not move the Hsinchu document unit on the assumption that proposal creation approved reordering

#### Scenario: Introductory Hsinchu order is selected
- **WHEN** D1 selects introductory scope and contents first
- **THEN** the page provides a prominent document shortcut and a downstream adjacent document gateway and guide, alongside procedural overview, known/unresolved evidence, chronology/actions, statements/people, analysis, gaps, samples and independent sources

### Requirement: Exact public content preservation
Every moved or reconciled public record SHALL have an explicit baseline identity and destination mapping committed in this change's `content-preservation.json` before implementation uses that mapping. The inventory SHALL contain a schema version, baseline commit, topic and record keys or public JSON pointers with full-record SHA-256, full public content and limitation variants, owner and secondary-reference destinations, and preserved-fragment mappings. Verification SHALL be recorded against the tested revision in `acceptance-evidence.md`. Full records SHALL retain status, attribution, proof scope, all limitation variants and canonical links. Short summaries SHALL retain qualifications needed to avoid a stronger assertion and link to the full explanation. Similar text, source counts, speaker names or missing lane metadata MUST NOT authorize merging or factual promotion.

#### Scenario: Repeated EZ WAY policy text
- **WHEN** a timeline entry repeats a policy statement that also appears in explanatory content
- **THEN** its date and item status remain inspectable and a cross-reference identifies the full explanation without dropping distinct scope or limitation information

#### Scenario: Hsinchu records lack lane relationships
- **WHEN** a proposed regrouping requires associations absent from public material
- **THEN** affected records retain their existing ownership until an explicit mapping exists, and no causal or responsibility association is inferred

#### Scenario: Partial document inspection
- **WHEN** the Hsinchu document unit is rendered
- **THEN** it retains the third-party publisher and canonical URL, visible pages 3–22, missing-page and redaction boundaries, copy-status qualification, excerpt-specific scope, and visibly separate TW Issues interpretation

### Requirement: Source inspection and return
Migrated issues SHALL distinguish opening the canonical source from inspecting its on-page source entry. On-page inspection SHALL provide return to the originating citation when known, with contents as fallback for direct source entry. Source metadata and qualifications MUST remain usable without hover and full evidence MUST remain readable without JavaScript.

#### Scenario: One source cited in two places
- **WHEN** a reader inspects the source from the second citation and chooses return
- **THEN** the page returns to that citation rather than the first citation for the same source

#### Scenario: Direct source link
- **WHEN** a reader enters an existing source fragment without a citation origin
- **THEN** the source is reachable with disclosure and focus behavior appropriate to the target and a contents return path is available

#### Scenario: JavaScript disabled
- **WHEN** JavaScript is disabled
- **THEN** evidence, local qualifications, native section links, canonical links and manually expandable source entries remain usable

### Requirement: Honest absence and supplemental content
The site SHALL distinguish supplied public coverage gaps, unresolved questions and absent optional modules. It MUST NOT infer an absence reason or claim that a procedure remains open merely because no outcome was found. Social samples SHALL remain separate from source indexing and MUST NOT imply representative opinion.

#### Scenario: EZ WAY lacks editorial analysis
- **WHEN** its public projection contains no editorial analysis
- **THEN** neither an empty analysis chapter nor an invented analysis or absence explanation is rendered

#### Scenario: Unavailable topic material
- **WHEN** no usable public material is available for a recognized route
- **THEN** the page uses an explicit unavailable state without an invented issue summary

### Requirement: Fragment and accessible reading compatibility
Migration SHALL preserve each baseline route and section/source fragment exactly once at a meaningful destination. One semantic DOM SHALL support sequential headings, visible keyboard focus, direct links and native Back/Forward. Mobile reflow MUST NOT hide evidence or require horizontal page scrolling.

#### Scenario: Shared Hsinchu document URL
- **WHEN** an existing URL targets `#primary-document-reading`
- **THEN** it resolves to the preserved guide and browser history remains usable after navigating to contents and back

#### Scenario: Narrow-screen keyboard reading
- **WHEN** a reader uses keyboard navigation at 320 or 390 CSS pixels
- **THEN** the contents and source controls remain reachable, focus is visible, and the same evidence is available as on desktop

### Requirement: Pilot acceptance before broad migration
The implementation SHALL validate Hsinchu and EZ WAY first and retain other topic bodies until pilot acceptance. Acceptance evidence SHALL include content/fragment preservation, required repository checks, source round trips and reading-task walkthroughs. Reports MUST distinguish evaluator inspection from reader studies and MUST NOT claim unmeasured comprehension improvements.

#### Scenario: Remaining-topic migration requested
- **WHEN** the next migration batch is prepared
- **THEN** a recorded pilot acceptance and explicit slug/content mapping precede that batch, and each topic retains its evidence boundaries
