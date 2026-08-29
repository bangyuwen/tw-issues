## ADDED Requirements

### Requirement: Context-first Hsinchu document order
The system SHALL render the Hsinchu Baseball Stadium dossier as one linear context-first document in which the evidence-state reading contract and five responsibility lanes precede the claim collection, and the claim collection precedes the detailed chronology and procedural record.

#### Scenario: Reader encounters the Hsinchu dossier in the intended order
- **WHEN** the Hsinchu Baseball Stadium public projection is rendered
- **THEN** the page SHALL present the case header, evidence-status legend, document table of contents, context overview and five responsibility lanes, known evidence and unresolved questions, chronology and procedural records, people and public statements, editorial analysis, supplemental social observations, and sources in that order
- **AND** the five responsibility lanes SHALL be presented as explanatory content rather than graph nodes or navigation state

### Requirement: Single document-order table of contents
The system SHALL provide one non-sticky semantic table of contents whose links reflect the Hsinchu document order and whose DOM and link set are shared by desktop and mobile layouts.

#### Scenario: Table of contents navigation
- **WHEN** a reader activates a table-of-contents link
- **THEN** the browser SHALL navigate to the corresponding stable section hash without filtering, hiding, or reclassifying any dossier content
- **AND** browser Back and Forward navigation SHALL preserve standard fragment behavior

#### Scenario: Section is absent from a sparse projection
- **WHEN** a section has no eligible public content
- **THEN** the system SHALL omit its table-of-contents link and empty presentation container
- **AND** the remaining links SHALL retain document order

### Requirement: Stable section and source deep links
The system SHALL preserve the existing public section anchors and source-registry hash behavior while adding no incompatible routing state.

#### Scenario: Existing section hash is opened
- **WHEN** a reader opens a URL containing an existing Hsinchu section hash such as `#questions`, `#proceedings`, `#reports`, `#narratives`, `#analysis`, `#social-observations`, or `#sources`
- **THEN** the corresponding rendered section SHALL remain directly addressable
- **AND** its heading or target SHALL not be obscured by persistent page chrome

#### Scenario: Existing source hash is opened with enhancement available
- **WHEN** a reader opens a URL targeting a rendered public source and client enhancement is available
- **THEN** the source disclosure SHALL open and the target source SHALL receive visible programmatic focus or equivalent target emphasis
- **AND** the canonical source link SHALL remain unchanged

### Requirement: Claim boundaries remain visible while collapsed
The system SHALL display each rendered claim's unchanged evidence state, statement, proof scope, and limitation without requiring the detailed evidence disclosure to be expanded.

#### Scenario: Claim disclosure is collapsed
- **WHEN** a claim card is rendered with its detailed disclosure collapsed
- **THEN** the reader SHALL still see the claim statement, the exact public proof-scope value under a clear confirmation boundary, and the exact public limitation value under a clear non-conclusion boundary
- **AND** no proof-scope or limitation text SHALL be truncated, regenerated, summarized, or inferred

#### Scenario: Claim details are expanded
- **WHEN** a reader expands a claim's native disclosure
- **THEN** the remaining eligible evidence details and canonical source links SHALL become available
- **AND** the always-visible proof boundaries SHALL retain the same meaning and values

### Requirement: Evidence families use distinct semantics
The system SHALL distinguish procedural records, people and attributed statements, political narratives, TW Issues analysis or stance, and open questions through headings, labels, field anatomy, and semantic containers rather than color alone.

#### Scenario: Person and procedure records are scanned together
- **WHEN** the dossier contains both a public person entry and a procedural record
- **THEN** the person entry SHALL present identity, role, attribution, and sources without verdict or responsibility styling
- **AND** the procedural record SHALL keep actor, outcome or action, effect, non-conclusion, and next-step fields distinct

#### Scenario: Analysis is rendered beside factual material
- **WHEN** a TW Issues analysis or stance item is eligible for rendering
- **THEN** it SHALL appear under a separately headed editorial section with its original classification
- **AND** it SHALL not use a verified-fact label or presentation

### Requirement: Social samples remain supplemental and non-representative
The system SHALL render eligible social observations in a separate supplemental section after editorial analysis and before the source registry, without presenting them as political-narrative magnitude, verified fact, or public opinion.

#### Scenario: Social observations are rendered
- **WHEN** the Hsinchu projection contains eligible social observations
- **THEN** the section SHALL keep the provided sample size and non-representative limitation visible without expansion
- **AND** criticism and counterpoint entries SHALL retain their existing content and sources
- **AND** the presentation SHALL not calculate or display sentiment percentages, confidence, representativeness, or population-level conclusions

### Requirement: Public content and provenance are preserved
The system MUST preserve all eligible public facts, classifications, attributed statements, analysis and stance labels, source contents, canonical links, proof scope, limitations, counts, and public-bundle provenance during the redesign.

#### Scenario: Hsinchu content preservation is verified
- **WHEN** the redesigned page is compared with the unchanged Hsinchu public projection
- **THEN** every previously rendered eligible claim, open question, timeline event, administrative action, proceeding track, public person, grouped attributed statement, political narrative, analysis item, social observation, and public source SHALL remain accessible
- **AND** the redesign SHALL add no private identifier, private producer field, invented source, inferred relationship, or rewritten factual assertion

#### Scenario: Currently excluded public projection fields exist
- **WHEN** the projection contains bare top-level `attributedClaims`, `coverageGaps`, or an empty editorial-position collection that the current renderer does not expose
- **THEN** this change SHALL NOT introduce new public rendering for those fields
- **AND** any future exposure SHALL require a separately approved content-contract change

### Requirement: Hsinchu presentation changes do not alter other topics
The system SHALL apply the context-first structure and associated styles only to the Hsinchu dossier while preserving the shared renderer's sparse and unavailable-topic behavior.

#### Scenario: A non-Hsinchu topic is rendered
- **WHEN** a different public topic uses the shared dossier page
- **THEN** its current section eligibility, navigation, order, layout, and source behavior SHALL remain unchanged unless independently specified

#### Scenario: No eligible public evidence is available
- **WHEN** a topic has no eligible public evidence projection
- **THEN** the existing unavailable-topic presentation SHALL remain the rendered outcome
- **AND** no Hsinchu-only navigation or empty evidence shell SHALL appear

### Requirement: Responsive layout preserves one readable content flow
The system SHALL use one semantic content order across breakpoints and SHALL provide a readable single-column layout at 390 CSS pixels without horizontal page scrolling.

#### Scenario: Hsinchu dossier is viewed at 390 pixels
- **WHEN** the viewport width is 390 CSS pixels
- **THEN** the table of contents, responsibility lanes, claims, records, people, narratives, analysis, social samples, and sources SHALL fit a single-column reading flow
- **AND** long labels and canonical URLs SHALL wrap without creating horizontal page overflow
- **AND** no horizontal carousel, clipped table, or separate mobile content tree SHALL be required

#### Scenario: Page is viewed at desktop width
- **WHEN** the viewport has sufficient desktop width
- **THEN** primary prose SHALL retain an approximately 65-to-72-character reading measure
- **AND** wider treatment SHALL be limited to content such as the source registry that requires it

### Requirement: Accessibility acceptance is testable
The redesigned Hsinchu dossier MUST satisfy keyboard, focus, contrast, target-size, motion, heading, zoom, and deep-link acceptance criteria.

#### Scenario: Keyboard-only navigation
- **WHEN** a reader uses only a keyboard
- **THEN** focus order SHALL follow the semantic document order from skip link through header, table of contents, dossier sections, disclosures, sources, and footer
- **AND** every interactive element SHALL have a visible focus indicator that is not obscured by page chrome
- **AND** native disclosure controls and links SHALL be operable without a pointer

#### Scenario: Visual and touch accessibility
- **WHEN** the page is rendered in its default light theme
- **THEN** normal text and state labels SHALL meet WCAG AA contrast for their actual foreground and background colors
- **AND** state SHALL be conveyed by text or semantics in addition to color
- **AND** interactive targets SHALL be at least 44 by 44 CSS pixels with sufficient separation

#### Scenario: Zoom and motion preferences
- **WHEN** a reader views the page at 200 percent zoom or requests reduced motion
- **THEN** no dossier content or focused control SHALL become clipped, obscured, or horizontally inaccessible
- **AND** smooth scrolling and nonessential motion SHALL be disabled under the reduced-motion preference

#### Scenario: Heading navigation
- **WHEN** a reader navigates by headings with assistive technology
- **THEN** the page SHALL expose one page `h1`, sequential `h2` section headings, and `h3` item or group headings without skipped levels caused by styling

### Requirement: Core reading remains available without JavaScript
The system SHALL render the complete public dossier, table of contents, headings, native disclosures, source registry, and canonical source links in server-rendered HTML.

#### Scenario: JavaScript is unavailable
- **WHEN** JavaScript is disabled or client enhancement fails
- **THEN** every eligible public section and source SHALL remain reachable through semantic HTML, anchors, and native disclosure controls
- **AND** no claim boundary, navigation destination, or canonical source link SHALL depend on client-only state
