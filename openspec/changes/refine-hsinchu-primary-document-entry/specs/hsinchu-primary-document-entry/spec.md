## ADDED Requirements

### Requirement: Primary-document source gateway is the first substantive content
The system SHALL render an eligible Hsinchu primary-document source gateway immediately after the topic hero and before the evidence-status reading legend and table of contents, while preserving `#primary-document` as its stable fragment.

#### Scenario: Eligible Hsinchu primary document is rendered
- **WHEN** the Hsinchu public projection contains the existing eligible primary document
- **THEN** `#primary-document` SHALL occur after `#main-content` and before the reading legend and `#case-contents`
- **AND** its document title SHALL be a top-level section `h2` under the page `h1`
- **AND** it SHALL be the first substantive evidence content after the hero

#### Scenario: Primary document is unavailable
- **WHEN** a sparse or non-Hsinchu projection has no eligible primary document
- **THEN** the system SHALL omit both the source gateway and detailed document-reading section
- **AND** it SHALL omit `#primary-document-reading` from the directory without changing the remaining topic order

### Requirement: Source provenance has one visible owner
The source gateway MUST be the only visible owner of the document title, affirmative source-backed lead, directly supported document summary, one neutral document-scope boundary, source metadata, canonical Threads action, and `#source-58` registry action.

#### Scenario: Reader encounters the source gateway
- **WHEN** `#primary-document` is rendered
- **THEN** it SHALL identify Hsinchu City Councilor Yang Ling-yi as the publisher and Threads as the third-party publication channel for document pages whose images visibly show red stamped seams
- **AND** it SHALL preserve that only pages 3–22 are visible, pages outside the observed range are missing, the material is redacted, and missing or hidden context cannot be inferred
- **AND** it SHALL preserve that stamped appearance alone cannot determine whether the holder's paper copy is an original or a copy
- **AND** the canonical Threads URL, publication date, capture date, and `#source-58` registry destination SHALL remain unchanged
- **AND** the publisher label SHALL add the verified Hsinchu City Councilor role without changing the Threads platform or third-party publication-channel classification

#### Scenario: Rendered ownership is inspected
- **WHEN** the server-rendered Hsinchu HTML is checked
- **THEN** the document title, affirmative lead, direct-support summary, neutral scope boundary, page-coverage values, source metadata, and canonical actions SHALL each appear in one visible ownership block
- **AND** the downstream detailed guide MUST NOT duplicate those scope or provenance fields, use a warning-style alert for them, or elevate the publisher's political evaluation into a primary-document content layer

### Requirement: Affirmative document hierarchy precedes the scope boundary
The source gateway SHALL explain what the visible disposition pages directly support before presenting one neutral document-scope boundary, and the detailed guide SHALL avoid repeating global or local limits as multiple warning surfaces.

#### Scenario: Reader starts with the core document
- **WHEN** `#primary-document` is read in semantic order
- **THEN** the document identity, source-backed lead, and direct-support summary SHALL precede source metadata and the neutral document-scope section
- **AND** Hsinchu City Councilor Yang Ling-yi's public role SHALL be visible as publisher context but MUST NOT change the evidence classification of her political evaluation
- **AND** the document-scope facts MUST NOT be rendered as an alert, trust badge, score, or error-like warning

#### Scenario: Reader continues through the detailed guide
- **WHEN** `#primary-document-reading` is read in semantic order
- **THEN** page-range summaries SHALL describe document content without repeating global provenance caveats
- **AND** the checked excerpt SHALL retain one page-specific proof scope and one local non-generalization boundary, while a separate analysis-limitations list and standalone non-conclusions checklist SHALL be omitted

### Requirement: Detailed document reading completes the source-first flow
The system SHALL render `#primary-document-reading` immediately after `#primary-document` and before the reading legend, table of contents, and case context, containing a content-first page-range guide, checked excerpts, document-content/TW Issues-analysis separation, one local proof scope, and one local non-generalization boundary without changing their underlying facts or classifications.

#### Scenario: Reader continues from source identity into document content
- **WHEN** the reader reaches the end of `#primary-document`
- **THEN** `#primary-document-reading` SHALL follow without an intervening reading legend, directory, chapter heading, or reciprocal jump link
- **AND** both sections SHALL remain independently addressable using their stable native fragments without JavaScript or client state

#### Scenario: Reader enters the detailed guide directly
- **WHEN** the page is opened with `#primary-document-reading`
- **THEN** the guide heading, page-range structure, checked excerpts, document-content and TW Issues-analysis labels, local proof scope, and local non-generalization boundary SHALL be present in server-rendered HTML
- **AND** the immediately preceding `#primary-document` SHALL remain the sole source and coverage owner without repeated scope facts, metadata, or a return link

### Requirement: Table of contents reflects downward document order
The Hsinchu directory SHALL describe downstream chapter content only and SHALL order every Chapter 01 destination according to its semantic DOM position.

#### Scenario: Chapter 01 directory is rendered
- **WHEN** an eligible Hsinchu primary document and coverage limits are available
- **THEN** Chapter 01 SHALL link in order to `#context`, `#responsibility-lines`, and `#coverage-limits`
- **AND** the directory SHALL NOT contain an upward link to either already-visible primary-document section
- **AND** the Chapter 01 primary destination SHALL be `#context`

#### Scenario: Chapter 01 content is read linearly
- **WHEN** the Hsinchu dossier is inspected in DOM order
- **THEN** `#primary-document` and `#primary-document-reading` SHALL precede the reading legend and `#case-contents`
- **AND** `#context` and its `#responsibility-lines` content SHALL precede `#coverage-limits`
- **AND** all three Chapter 01 directory destinations SHALL occur after `#case-contents`

### Requirement: Document coverage and dossier coverage remain distinct
The system SHALL keep page-specific coverage for the partial non-prosecution-disposition images in the source gateway and SHALL render dossier-wide public evidence gaps as the separate `#coverage-limits` section inside Chapter 01 after case context.

#### Scenario: Both coverage layers are available
- **WHEN** the eligible primary document and public-safe coverage gaps are rendered
- **THEN** the source gateway SHALL describe only observed document pages, missing document pages, and redaction status
- **AND** `#coverage-limits` SHALL retain only the existing publishable wider-record gaps, gap reasons, and source references
- **AND** neither layer SHALL infer that an unavailable document does not exist or establish responsibility, causality, or outcome

#### Scenario: Assistive technology navigates coverage limits
- **WHEN** `#coverage-limits` is rendered inside Chapter 01
- **THEN** its title SHALL use an `h3` beneath the Chapter 01 `h2`
- **AND** its existing visible limitations and source citations SHALL remain available without a client-only interaction

### Requirement: Coverage status follows the observed chronology without duplicate field content
The first Hsinchu dossier coverage limit SHALL present the official disposition occurrence supported by `source-39` before the city's later stated intent to seek reconsideration, and SHALL give its gap and gap-reason fields distinct visible responsibilities.

#### Scenario: Reader checks the first dossier-wide gap
- **WHEN** the first item in `#coverage-limits` is rendered
- **THEN** its main gap SHALL first state that the non-prosecution disposition has an official occurrence record, then concisely identify the still-unavailable official complete disposition, pages outside the observed third-party image range, formal reconsideration filing and result, and later administrative-accountability records
- **AND** its gap reason SHALL identify the third-party page 3–22 images already available before the city's later stated reconsideration intent
- **AND** the main gap and gap reason MUST NOT repeat the same complete paragraph
- **AND** the wording SHALL preserve that the official complete text, missing pages, formal filing or acceptance, reconsideration result, and administrative-accountability records remain unavailable in the public projection
- **AND** the wording SHALL NOT imply that missing records do not exist or that any responsibility, causality, or outcome has been established

### Requirement: Visible disposition pages control document-content claims
The system SHALL use `source-58` as the first direct basis for non-prosecution-disposition content actually visible on pages 3–22, while preserving separate roles for the third-party publication channel, official disposition occurrence, and later media reporting.

#### Scenario: Document content is presented
- **WHEN** a statement describes content visible in the partial disposition images
- **THEN** `source-58` SHALL be its first direct evidentiary basis
- **AND** page-specific proof scope SHALL retain its exact page locator and local non-generalization boundary, while the gateway retains the visible-range, missing-page, redaction, and copy-status limits once
- **AND** information outside the visible pages MUST NOT be attributed to `source-58`

#### Scenario: Publication channel is identified
- **WHEN** the source gateway or a document-content claim identifies how the images became public
- **THEN** Hsinchu City Councilor Yang Ling-yi SHALL be identified as the publisher and Threads SHALL be identified as the third-party publication channel
- **AND** publisher identity, public role, platform, canonical link, and the single global document-scope boundary SHALL remain owned by the source gateway
- **AND** the poster's summaries or political evaluations MUST NOT render as primary-document content; any later dossier occurrence SHALL remain explicitly attributed and MUST NOT be presented as document text or a prosecutorial finding

#### Scenario: Media coverage is used
- **WHEN** media supports the Hsinchu non-prosecution narrative
- **THEN** it SHALL be limited to later reactions, attributed reporting, or procedural status not established by the visible pages
- **AND** it MUST NOT replace the visible document pages as the basis for page-visible content
- **AND** reporting that the city will seek reconsideration MUST NOT be promoted into a filed, accepted, upheld, or reversed procedural status

#### Scenario: Coverage-gap citations are rendered
- **WHEN** the first Hsinchu dossier-wide coverage gap is rendered
- **THEN** `source-58` SHALL appear first for the currently inspectable page scope
- **AND** `source-39` SHALL separately support the official disposition occurrence
- **AND** later reaction and missing administrative-accountability records SHALL retain their own scoped sources
- **AND** the priority of `source-58` MUST NOT imply an official complete text or a complete disposition rationale

### Requirement: Fragment location and keyboard focus remain visually distinct
The system MUST NOT draw a red rectangular outline, rail, animation, or color-only state cue around either primary-document section merely because its fragment is targeted, and MUST preserve visible focus indication for every operable link and control.

#### Scenario: Primary-document fragment is targeted
- **WHEN** the browser opens or navigates to `#primary-document` or `#primary-document-reading`
- **THEN** the target heading SHALL be brought into an unobscured view without a red rectangular fragment decoration
- **AND** native browser Back and Forward navigation SHALL preserve the fragment history

#### Scenario: Reader uses the keyboard
- **WHEN** keyboard focus moves through gateway actions, directory links, citations, disclosures, and chapter-return links
- **THEN** each interactive target SHALL retain a visible high-contrast `:focus-visible` indicator
- **AND** removing fragment decoration SHALL NOT remove or weaken the focus indicator

### Requirement: Responsive semantics and content boundaries are preserved
The source gateway and detailed guide SHALL use one server-rendered semantic order across breakpoints, remain fully readable without JavaScript, and preserve the existing Hsinchu factual, provenance, evidence-classification, canonical-source, and public-output boundaries.

#### Scenario: Page is viewed across required widths
- **WHEN** the Hsinchu dossier is viewed at 390px, immediately around the 800px breakpoint, desktop width, or a 200-percent-zoom equivalent
- **THEN** the gateway, guide, directory, context, coverage limits, actions, and long labels SHALL fit without horizontal page overflow or clipped focus
- **AND** interactive targets SHALL remain at least 44 by 44 CSS pixels
- **AND** the same content and DOM order SHALL be used at every width

#### Scenario: JavaScript is unavailable
- **WHEN** JavaScript is disabled or enhancement fails
- **THEN** both primary-document sections, the directory, source and guide cross-links, document-scope boundary, excerpts, local proof boundary, canonical links, and chapter content SHALL remain readable and navigable
- **AND** no filter, disclosure replacement, local storage, scrollspy, sticky rail, hover-only interaction, or client navigation state SHALL be required

#### Scenario: Public and cross-topic boundaries are checked
- **WHEN** the rendered output and non-Hsinchu topics are inspected
- **THEN** no local source image, manifest, full transcript, private producer data, secret, or deployment identifier SHALL be published or linked
- **AND** non-Hsinchu content order, anchors, styles, and navigation SHALL remain unchanged
- **AND** source quantity SHALL continue to be described only as an index rather than completeness or credibility
