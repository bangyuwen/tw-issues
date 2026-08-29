## ADDED Requirements

### Requirement: Primary document is the first Hsinchu evidence locator
The system SHALL render an eligible Hsinchu primary-document section after the reading legend and document-order table of contents, before the case-context section, and SHALL list it as the first table-of-contents destination without changing non-Hsinchu topic order.

#### Scenario: Hsinchu primary document is available
- **WHEN** the Hsinchu public projection contains an eligible primary document
- **THEN** the table of contents SHALL begin with a link to `#primary-document`
- **AND** the `#primary-document` section SHALL precede `#context`
- **AND** case context SHALL still precede claims, proceedings, attributed statements, political narratives, and TW Issues analysis

#### Scenario: Primary document is absent
- **WHEN** a sparse or non-Hsinchu projection does not contain an eligible primary document
- **THEN** the system SHALL omit the primary-document link and section
- **AND** the topic's existing section eligibility and order SHALL remain unchanged

### Requirement: Importance and provenance authority remain separate
The system MUST identify `source-58` as an important third-party social-media reproduction of a redacted, partial non-prosecution disposition and MUST NOT present its structural priority as official-source authority, completeness, a court judgment, or a confidence score.

#### Scenario: Reader encounters the source identity
- **WHEN** the primary-document section is rendered
- **THEN** a visible warning SHALL state that the artifact is a third-party reproduction, is not the official complete text, is redacted, and covers only document pages 3–22
- **AND** the title SHALL describe it as a social-media image excerpt from a non-prosecution disposition rather than a judgment
- **AND** the warning SHALL be visible without opening a disclosure

#### Scenario: Legal terminology is rendered
- **WHEN** the section describes the disposition or its decision-maker
- **THEN** it SHALL attribute prosecutorial reasoning to the prosecutor or prosecutors office as supported by the source
- **AND** it MUST NOT attribute the disposition to a judge or describe it as a court acquittal

### Requirement: Coverage and missing-page boundaries are explicit
The system SHALL state the observed page range, missing pages, redaction status, capture date, and canonical source before presenting excerpts or interpretation, and MUST NOT reconstruct content outside the observed images.

#### Scenario: Partial coverage is shown
- **WHEN** `source-58` coverage is rendered
- **THEN** the system SHALL state that images cover document pages 3–22
- **AND** it SHALL state that pages 1–2 are absent and that at least pages 23–25 are absent based on the attachment boundary and poster reference
- **AND** it SHALL explain that missing context and redacted identities cannot be inferred

#### Scenario: Missing or redacted text is discussed
- **WHEN** a public excerpt would require an absent page or restoration of a hidden name or company
- **THEN** the system MUST omit the unsupported text or mark the uncertainty explicitly
- **AND** it MUST NOT use the poster's summary or OCR residue to fill the gap

### Requirement: Reading guide distinguishes document functions
The system SHALL provide a page-scoped reading guide that distinguishes accusation or referral material from legal standards and prosecutorial reasoning, with each entry carrying an exact observed page range and a neutral function label.

#### Scenario: Allegation pages are described
- **WHEN** the guide describes document pages 3–8
- **THEN** it SHALL identify those pages as accusation, complaint, or referral material rather than a prosecutorial finding
- **AND** it SHALL not apply a verified-fact presentation to the allegations

#### Scenario: Prosecutorial reasoning is described
- **WHEN** the guide describes a page range containing the prosecutor's evidentiary analysis
- **THEN** it SHALL label the range as visible prosecutorial reasoning from the partial reproduction
- **AND** it SHALL preserve the distinction between criminal sufficiency and separate administrative, contractual, civil, or safety questions

### Requirement: Only checked page-level excerpts are published
The system MUST limit primary-document excerpts to content that has been reviewed against the corresponding visible image and SHALL give every excerpt an exact document-page locator, review status, proof scope, and limitation.

#### Scenario: Page 18 pipe and wiring passage is presented
- **WHEN** the checked page 18 excerpt is rendered
- **THEN** it SHALL state only that the visible passage identifies the PE net, irrigation-system plastic pipes, and electrical wiring at issue there as installed works and not waste
- **AND** it SHALL NOT generalize that statement to every excavated object, every engineering defect, or every legal and administrative question
- **AND** it SHALL identify the text as visible in a third-party reproduction rather than verified from an official complete disposition

#### Scenario: Transcript passage has not completed excerpt review
- **WHEN** a passage exists only in the auxiliary transcript or poster summary and lacks the required image review and boundary metadata
- **THEN** the system MUST NOT publish it as a primary-document excerpt
- **AND** it MUST NOT infer a claim from its page number alone

### Requirement: Document text, poster framing, and TW Issues analysis are separate
The system SHALL render visible document text, the poster's attributed framing, and TW Issues analysis as separate semantic layers with complete text labels, separate proof boundaries, and no interchange of attribution.

#### Scenario: Poster framing is referenced
- **WHEN** the section references 楊玲宜's summary or political framing
- **THEN** it SHALL label the content as an attributed statement by the poster
- **AND** it SHALL link to the canonical Threads post
- **AND** it MUST NOT present the poster's wording as disposition text or use it to reconstruct missing pages

#### Scenario: TW Issues explains the document
- **WHEN** TW Issues draws an inference from a checked excerpt
- **THEN** the inference SHALL be labeled `TW Issues 分析｜非司法結論`
- **AND** it SHALL remain distinct from `影像可見文字｜第三方重製`
- **AND** it SHALL state material uncertainty or a condition that could change the analysis

#### Scenario: Political shorthand is discussed
- **WHEN** the dossier discusses the phrase `大秘寶`
- **THEN** it SHALL classify the phrase as political or attributed framing unless a source proves otherwise
- **AND** it MUST NOT imply that the phrase appears in the disposition

### Requirement: Canonical source remains the public inspection path
The system SHALL provide the canonical Threads URL for `source-58`, preserve the existing `#source-58` registry target, and MUST NOT replace that provenance path with a locally hosted raw archive.

#### Scenario: Reader follows the core document source
- **WHEN** the reader activates the source link in the primary-document section
- **THEN** the link SHALL point to the canonical `source-58` Threads post
- **AND** the source registry SHALL retain the same publisher, publication date, source role, and canonical URL

#### Scenario: Source hash is opened
- **WHEN** a reader opens the dossier with `#source-58`
- **THEN** the existing source-disclosure behavior SHALL continue to identify the same source
- **AND** adding the primary-document section SHALL not redirect or repurpose the source hash

### Requirement: Raw local archive is excluded from public output
The public site MUST NOT publish or link the locally preserved `source-58` page images, raw manifest, or full auxiliary transcript under the selected source-link treatment.

#### Scenario: Public static output is inspected
- **WHEN** the GitHub Pages build completes
- **THEN** the output SHALL contain no locally hosted `source-58` `page-*.jpg`, raw manifest, or full transcript artifact
- **AND** rendered HTML SHALL contain no local archive URL for those artifacts
- **AND** the canonical Threads source link and bounded public excerpts SHALL remain available

#### Scenario: Local archive is preserved for analysis
- **WHEN** implementation relocates the current untracked archive outside the deployable `public/` tree
- **THEN** every attachment hash SHALL still match the captured manifest
- **AND** the move SHALL not be represented as a durable public or private archival guarantee

### Requirement: Core reading is responsive and progressively enhanced
The primary-document section SHALL use one semantic content order across breakpoints, remain fully readable without JavaScript, and satisfy the dossier's keyboard, contrast, target-size, zoom, and overflow acceptance criteria.

#### Scenario: Section is viewed at 390 CSS pixels
- **WHEN** the viewport width is 390 CSS pixels
- **THEN** provenance, coverage, guide entries, excerpt boundaries, and source links SHALL form one column without horizontal page scrolling
- **AND** long canonical URLs SHALL wrap
- **AND** every interactive target SHALL be at least 44 by 44 CSS pixels

#### Scenario: JavaScript is unavailable
- **WHEN** JavaScript is disabled or client enhancement fails
- **THEN** the primary-document heading, warning, coverage, guide, checked excerpts, limitations, canonical source link, and table-of-contents destination SHALL remain present in server-rendered HTML
- **AND** direct `#primary-document`, browser Back, and browser Forward behavior SHALL use native fragments

#### Scenario: Assistive technology navigates the section
- **WHEN** a reader navigates by headings or keyboard at default or 200 percent zoom
- **THEN** the section SHALL use a sequential `h2` and `h3` hierarchy, visible unobscured focus, non-color text labels, and WCAG AA text contrast
- **AND** no content or focused control SHALL be clipped or horizontally inaccessible
