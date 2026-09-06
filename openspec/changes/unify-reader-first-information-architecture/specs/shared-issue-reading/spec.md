## ADDED Requirements

### Requirement: Shared entry with topic-specific body
Each migrated issue SHALL expose its title, page date from topic `lastUpdated`, mapped scope introduction, question-oriented contents, and source inspection entry before its long body. Contents SHALL follow the actual body order and link only to present sections. The renderer MUST NOT manufacture content to fill a fixed chapter template. Before D1 and tasks 1.1/1.4 are complete, only the exact EZ WAY slug SHALL opt into new dossier behavior after its 1.2/1.3/1.5 prerequisites. Hsinchu renderer output, heading/section/navigation order, eligibility, canonical actions, supporting styles and ordering assertions MUST remain at baseline. Task 2.2 MUST NOT activate shared defaults for Hsinchu. Hsinchu activation, source enhancement and changed-order validation SHALL wait for task 3.1 after 1.1/1.4; a document-first selection requires updating this proposed entry requirement to permit that exception. Shared helper edits SHALL prove unchanged frozen output, or wait for that gate.

#### Scenario: EZ WAY first-time entry
- **WHEN** a reader opens the migrated EZ WAY issue
- **THEN** purpose and applicability precede detailed chronology, and the page provides process/checks/registration, named concerns/responses, time nodes, individual-case questions, and sources without empty judicial or analysis chapters

#### Scenario: Hsinchu ordering decision remains unresolved
- **WHEN** D1 has no recorded owner selection
- **THEN** tasks 2.2–2.4 and EZ WAY task 3.2 leave the complete Hsinchu renderer output and order unchanged, including its document unit, legend, contents and chapters
- **AND** validation retains the existing Hsinchu ordering assertions and snapshots; passing unchanged-output checks does not approve new Hsinchu behavior

#### Scenario: Shared change cannot isolate Hsinchu
- **WHEN** a helper, selector or section descriptor change would alter Hsinchu output before tasks 1.1/1.4 complete
- **THEN** that change waits for task 3.1 rather than refreshing expected output or enabling a generic default

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
Migrated issues SHALL keep the existing topic path and source `publicRef` fragment and SHALL assign every citation occurrence a permanent unique `cite-<occurrenceKey>` anchor from the committed `content-preservation.json.citations` map. Entries SHALL bind occurrenceKey, recordIdentity, surfaceKey, sourceRef, anchorId and a distinct returnLabel; reordering SHALL NOT regenerate IDs from array positions, sourceRef alone or mutable text. Each focusable citation wrapper SHALL have an unchanged canonical action and a separate native `本頁來源` link to `#<sourceRef>`. Hsinchu canonical actions SHALL retain the exact canonical href, `_blank` target and `noreferrer` relation without changing topic history.

Each source SHALL render all occurrence backlinks and a contents fallback in SSR: `#case-contents` for Hsinchu, additive `#issue-contents` for EZ WAY. No source query parameter, compound fragment or new route SHALL be introduced. Without JavaScript readers SHALL be able to manually expand the existing source disclosure and choose the distinctly labeled native backlink. Automatic origin selection MUST NOT be claimed in that mode.

Optional enhancement SHALL handle only unmodified same-tab inspection clicks. It SHALL validate the occurrence/source pair, replace the initiating history entry's fragment with the citation anchor while retaining path/query/unrelated state, and push the source-fragment entry with `twIssuesCitationOrigin: {topicSlug, anchorId, sourceRef}`. It SHALL open, scroll and focus the source. A map-valid origin matching the current topic and source SHALL enable a preferred native `回到引用處` link; static backlinks remain. Direct/invalid source entries SHALL use static backlinks and contents fallback without guessing an origin. History handlers SHALL validate current entry state and fragment on popstate/hashchange and restore the relevant target without adding history entries or retaining a stale global origin. Source metadata and qualifications MUST remain usable without hover and full evidence MUST remain readable without JavaScript.

#### Scenario: One source cited in two places
- **WHEN** a reader inspects the source from the second citation and chooses return
- **THEN** its unique citation anchor is the preferred return target, and both distinct labeled occurrence backlinks still exist
- **AND** reordering the records retains both mapped occurrence IDs

#### Scenario: Direct source link
- **WHEN** a reader enters an existing source fragment without a citation origin
- **THEN** the source is reachable, with enhancement opening/focusing it when available, and static occurrence backlinks and the topic's contents link are available without a guessed preferred origin

#### Scenario: Canonical Hsinchu action
- **WHEN** a reader activates the canonical source action on an activated Hsinchu citation
- **THEN** the unchanged canonical URL opens in a new tab with `noreferrer`, without altering topic history or turning the action into a source-registry jump

#### Scenario: Enhanced browser history round trip
- **WHEN** citation B is inspected, then browser Back and Forward are used
- **THEN** Back targets `#cite-<B>` and Forward targets the original `#<sourceRef>` with B as the preferred origin
- **AND** choosing the native return link creates a citation entry whose Back target is that source, without history entries created by event handlers

#### Scenario: Origin state is invalid or belongs elsewhere
- **WHEN** a source entry's origin names another topic, another source or an unknown citation ID
- **THEN** enhancement omits the preferred return action and retains only mapped static backlinks and contents fallback

#### Scenario: JavaScript disabled
- **WHEN** JavaScript is disabled
- **THEN** evidence, local qualifications, native inspection/canonical links and manually expandable source entries remain usable; the reader can select the labeled backlink for citation B and use native Back/Forward
- **AND** no automatic preferred-origin return or JavaScript-only control is required

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
