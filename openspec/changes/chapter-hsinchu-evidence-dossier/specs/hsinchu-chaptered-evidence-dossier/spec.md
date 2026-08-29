## ADDED Requirements

### Requirement: Chaptered directory preserves the complete dossier route
The Hsinchu dossier SHALL present a static, document-order directory that groups the public material into six chapters while preserving every current primary and secondary destination: `#context`, `#responsibility-lines`, `#claims`, `#questions`, `#progress`, `#administration-actions`, `#proceedings`, `#people`, `#reports`, `#narratives`, `#analysis`, conditional `#positions`, `#social-observations`, and `#sources`.

#### Scenario: Reader scans the desktop directory
- **WHEN** a reader reaches `#case-contents` on a desktop viewport
- **THEN** the directory shows all six chapters in document order
- **AND** every applicable current destination is visible as a subordinate link rather than being hidden behind interaction

#### Scenario: Reader scans the mobile directory
- **WHEN** the dossier is displayed at a 390 CSS-pixel viewport
- **THEN** the same directory and destinations appear in one column and in the same reading order
- **AND** no alternate mobile-only content model is introduced

### Requirement: Public factual content and evidence classifications remain authoritative
The presentation SHALL render the existing public projection without rewriting, promoting, suppressing, or inferring any fact, legal conclusion, attributed statement, TW Issues analysis or stance label, proof scope, limitation, source count, canonical source link, or bundle provenance.

#### Scenario: Existing evidence category is presented in a chapter
- **WHEN** a claim, event, action, proceeding, person entry, report, narrative, analysis item, social observation, or source is placed within the chapter structure
- **THEN** its public wording, evidence state, proof scope, limitations, and canonical references remain unchanged

#### Scenario: Source volume is visible
- **WHEN** the directory, summary, or source section communicates the number of records or sources
- **THEN** the interface does not infer completeness, credibility, public opinion, manipulation, causality, or confidence from that count

### Requirement: Public-safe coverage limits are first-class content
The dossier SHALL expose the public-safe coverage gaps already present in the public projection as a visible limitation statement in the first chapter, using only publishable gap text, gap reason, and source references.

#### Scenario: Coverage gaps are available
- **WHEN** the Hsinchu public projection contains one or more coverage gaps
- **THEN** the first chapter includes a visible `#coverage-limits` destination that names those gaps without hiding the primary limitation behind a disclosure control
- **AND** any supporting citations may use a native disclosure without concealing the limitation itself

#### Scenario: Coverage metadata contains producer-only fields
- **WHEN** a coverage-gap record also contains internal workflow metadata
- **THEN** actor roles, search timestamps, search queries, raw readiness enums, and other producer-owned fields are not exposed or interpreted by the presentation layer

### Requirement: Attributed collections use an explicit time-bounded reconciliation
The dossier SHALL use only the approved Hsinchu mapping for overlapping attributed records and SHALL NOT infer relationships from speaker names, party labels, string similarity, ranking, or a general frontend deduplication rule.

#### Scenario: Approved city-government pairs are rendered
- **WHEN** the public projection contains the approved two `source-06` standalone/grouped city-government pairs
- **THEN** each identical statement and proof scope appears once
- **AND** every distinct limitation from both public records appears verbatim while an exactly repeated limitation appears once
- **AND** each statement exposes its public source date

#### Scenario: Standalone procedural report is rendered
- **WHEN** the public projection contains the `source-09` attributed procedural report
- **THEN** it appears as a separate procedural-report row under `#reports`
- **AND** the presentation does not assign it to the city government, prosecutors, a proceeding, or a timeline event

#### Scenario: Institutional attribution crosses dates
- **WHEN** the dossier displays a statement attributed to `新竹市政府`
- **THEN** the attribution describes only the source-recorded institution at the displayed source date
- **AND** the UI does not infer continuity across administrations, officeholders, or governing parties
- **AND** the UI does not add a party label absent from the public projection

#### Scenario: Expected reconciliation inputs drift
- **WHEN** the paired positions, statement, proof scope, speaker, or source reference no longer match the approved Hsinchu mapping
- **THEN** a test or build gate fails
- **AND** the presentation does not fall back to heuristic matching or silently omit the affected public record

### Requirement: Chapter flow remains a linear evidence document
The dossier SHALL keep all applicable sections in one semantic document and SHALL use chaptering only to improve orientation and scanning, not to turn the topic into a dashboard, filterable dataset, tab set, sentiment display, or call-to-action funnel.

#### Scenario: Reader follows the document without interaction
- **WHEN** scripts are unavailable or the reader chooses not to operate any optional disclosure
- **THEN** all primary dossier sections remain reachable in document order
- **AND** no evidence category depends on scrollspy, tabs, filters, hover, local storage, or a sticky side rail to become available

#### Scenario: A conditional category is empty
- **WHEN** `positions` has no public entries
- **THEN** the dossier omits an empty positions section and its directory link
- **AND** the surrounding chapter order and heading hierarchy remain valid

### Requirement: Stable fragments support direct entry and browser history
The dossier SHALL preserve existing fragment identifiers, source-fragment behavior, and native Back/Forward navigation while adding `#coverage-limits` and chapter-return links to `#case-contents`.

#### Scenario: Reader opens an existing secondary fragment
- **WHEN** a reader opens any current primary or secondary fragment URL directly
- **THEN** the corresponding target exists, is brought into view, and is not obscured by persistent UI

#### Scenario: Reader opens a source fragment
- **WHEN** a reader opens a URL such as `#source-49`
- **THEN** the sources disclosure opens, the source target receives programmatic focus, and the canonical fragment remains in browser history

#### Scenario: Reader navigates through several fragments
- **WHEN** the reader follows directory, chapter-return, or source links and then uses browser Back or Forward
- **THEN** the browser restores the expected fragment and document position without application-owned history replacement

### Requirement: Responsive reading meets accessibility acceptance criteria
The Hsinchu dossier SHALL provide semantic headings, keyboard-operable navigation, visible focus, adequate contrast, resilient reflow, and motion preferences across desktop and 390 CSS-pixel layouts.

#### Scenario: Keyboard reader traverses the dossier
- **WHEN** a reader uses only the keyboard from page entry
- **THEN** focus order follows the skip link, global navigation, dossier directory, document links, and source controls in DOM order
- **AND** every focus indicator is clearly visible and not obscured

#### Scenario: Dossier is viewed at 390 CSS pixels
- **WHEN** the viewport width is 390 CSS pixels at default zoom
- **THEN** the page has no horizontal document scrolling
- **AND** long URLs and labels wrap without clipping or overlapping adjacent content
- **AND** interactive targets are at least 44 by 44 CSS pixels

#### Scenario: Heading outline is inspected
- **WHEN** the page heading structure is evaluated
- **THEN** there is one page-level heading followed by chapter and subsection headings in a logical, non-skipping hierarchy

#### Scenario: Reader requests reduced motion
- **WHEN** `prefers-reduced-motion: reduce` is active
- **THEN** non-essential animated scrolling and decorative transitions are disabled

### Requirement: Editorial visual language remains consistent and legible
The redesign SHALL retain the established warm-paper, deep-navy, coral, mint, and evidence-state language while using system CJK typography, a readable line length, and contrast-safe color roles.

#### Scenario: Small text appears on the paper surface
- **WHEN** coral is used for small text or an interactive label on the warm-paper background
- **THEN** the darker coral role is used rather than the low-contrast light coral role

#### Scenario: Long-form body copy is rendered
- **WHEN** evidence prose appears in the main reading column
- **THEN** it uses a comfortable long-form measure of approximately 65 to 75 characters, resilient wrapping, and a line height appropriate for Traditional Chinese reading

#### Scenario: Evidence state is communicated
- **WHEN** verified, attributed, unresolved, analysis, or stance state is shown
- **THEN** meaning is conveyed by explicit text and structure in addition to color

### Requirement: Topic-specific behavior does not regress shared pages
The chaptered dossier SHALL be scoped to the Hsinchu topic and SHALL identify any necessary shared-component or shared-style edit before implementation.

#### Scenario: Another topic uses the shared dossier renderer
- **WHEN** a non-Hsinchu topic is rendered after this change is implemented
- **THEN** its content order, navigation, anchors, styles, and disclosure behavior remain unchanged unless an explicit cross-topic specification is approved

#### Scenario: A shared surface must change
- **WHEN** implementation requires modifying `app/dossier-page.tsx`, `app/dossier-page-model.ts`, or `app/globals.css`
- **THEN** the implementation isolates Hsinchu behavior through an explicit topic capability or scoped selector
- **AND** related rendered-HTML and topic tests cover both the Hsinchu outcome and a non-Hsinchu regression case
