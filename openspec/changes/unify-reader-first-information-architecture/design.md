## Context

Baseline: `a4a16e75921a5c8f443cc56fe9c884c721c5f400`, inspected in a clean detached worktree. The confirmed audience is first-time issue readers; scope is a common site architecture, Hsinchu and EZ WAY pilots, then a migration plan for remaining topics. This document is a proposed design, not user-tested evidence or implementation approval.

`app/page.tsx` maps twelve `research-topics.json` entries without sorting despite a recent-updates heading. `allTopics` has seven additional metadata-only entries; their presence does not establish a generated public page. `app/topics/[slug]/page.tsx` builds the public projection through `buildDossierPageModel` and renders the shared dossier. Hsinchu alone has a chapter wrapper and document eligibility rules.

Hsinchu has 12 known claims, eight questions, 16 events, six proceeding tracks, twelve administration actions, five analyses and a partial document guide. EZ WAY has six known claims, two questions, three events and four statements across two speaker groups. These counts describe input collections, not unique propositions or credibility.

Existing change-local contracts matter:
- `refine-hsinchu-primary-document-entry/design.md` deliberately places the source gateway and full guide before the legend and contents. Moving them is a substantive IA decision, pending below.
- `chapter-hsinchu-evidence-dossier/design.md` rejects wholesale five-lane regrouping without producer-owned entity associations. Retain that boundary and the approved Hsinchu attribution reconciliation.
- The existing chapter change has an unchecked accessibility acceptance item. Do not inherit a claim that all accessibility checks passed.

## Goals / Non-Goals

**Goals:** predictable entry and return paths; question-oriented navigation; content-appropriate outlines; auditable preservation; honest update ordering; staged migration.

**Non-Goals:** new research, private producer reads, evidence upgrades, automatic topic/claim classification, full five-lane regrouping, a universal six-chapter template, sticky navigation, search infrastructure, package changes, or release execution.

## Decisions

### 1. Share the reading contract, vary the body

Proposed flow:

```text
All issues / Recent updates
  -> Title + issue scope + page date + prominent inspection shortcuts
  -> Contents in body order, with reader-question labels
  -> Topic-specific sections
  -> Independent source index + return to issue index
```

Use the existing page model and renderer as owners. Add only the narrow section descriptors and explicit pilot mappings needed by the approved outlines; do not build a generic layout engine. One responsive semantic DOM supplies headings, keyboard order, native fragments and no-JavaScript content. A fixed six-chapter format creates empty or misleading EZ WAY sections; independently designed pages make navigation unpredictable.

The entry must not synthesize an unsupported conclusion. Hsinchu can reuse its public context summary. EZ WAY needs an explicit selection of existing purpose/scope material; any new editorial prose must have an approved public mapping before use. Do not use the first array item as an automatically authoritative summary.

### 2. Pilot outlines and ownership

| Existing material | Reader question / proposed owner | Boundary |
|---|---|---|
| Hsinchu context and lanes | What different questions does this case contain? / introduction | Preserve lane findings and proof scopes; do not turn the overview into a verdict |
| Hsinchu proceeding tracks | What has each procedure answered? / responsibility and status | Preserve all six tracks and their separate effects and next steps |
| Hsinchu known claims and questions | What is supported or unresolved? / retained evidence subsections | No automatic distribution across lanes; retain complete records until explicit mapping exists |
| Hsinchu phases, events and actions | How did this develop? / chronology with action-detail links | Preserve event identity, date precision and item status |
| Hsinchu primary document | What does the source support? / one adjacent gateway-and-guide unit | Preserve partial third-party provenance, missing pages, redactions, excerpt scope and separate analysis |
| People, statements and narratives | Who said what? / statements with person index | Keep source-date attribution and existing reconciliation |
| Analysis and social observations | How does TW Issues interpret it? / analysis; what samples exist? / supplement | Do not promote samples into public opinion; keep related-case analyses unchanged pending applicability metadata |
| EZ WAY claims 1, 3 and 6 | What is this and when does it apply? / scope and purpose | Array positions here identify baseline records only; freeze exact records before implementation |
| EZ WAY claims 2, 4 and 5 | What does the published process describe? / process, checks and registration | Preserve exceptions, version limits and individual-case boundaries |
| EZ WAY speaker groups | What concerns and responses were reported? / named statements | All four statements remain attributed, including agency statistics |
| EZ WAY events | When did the rules change? / chronology | Link to explanatory owners without repeating full claim bodies |
| EZ WAY questions | What requires individual confirmation? / unresolved cases | Do not imply that the whole policy is unresolved |
| Source collections | Where can I inspect the material? / independent source index | Never nest the site-wide source function under social samples |

Proposed Hsinchu outline: introduction and contents; responsibility/procedural overview with retained known/unresolved evidence; chronology and actions; core document; named statements and people; TW Issues analysis; gaps, supplemental samples and independent sources. The latter three remain distinct sections rather than one evidentiary category.

Proposed EZ WAY outline: purpose and applicability; published process/checks/registration; industry concerns and agency responses; three time nodes; individual-case questions; sources. No empty analysis, person biography or judicial chapter is generated.

Before coding, expand this block-level map into an exact record inventory: existing key (or baseline path and full-record digest), complete content and limitation variants, owner destination, summary/secondary references, and preserved fragments. Missing cross-record relation metadata blocks reconciliation, not unrelated layout work. Similar wording is insufficient to deduplicate. Timeline summaries may point to a full explanation, but all distinct evidence and status variants must remain inspectable.

### 3. Document placement is an unresolved design choice

Recommendation: put introduction and contents before the long document unit, with a prominent shortcut beside the introductory scope. Keep gateway and guide adjacent so the source-to-excerpt narrative remains continuous. The contents lists only downstream destinations.

Alternative: retain full document-first order. This preserves the previous decision but requires revising this proposal's common entry requirement for Hsinchu before implementation. Silence or invoking this proposal skill does not select either option. Resolve D1 and reconcile affected historical ordering tests explicitly; preserve all other provenance and accessibility assertions.

### 4. Homepage discovery and dates

Use an all-issues entry with a deterministic baseline editorial order and a separate recent-updates view ordered by valid `lastUpdated` descending, with slug ascending as tie-breaker. Unknown/invalid dates follow dated entries and display an explicit unavailable label. Distinguish page date from event date; event summaries continue to retain status and attribution. There is no change log, so do not label a latest event as newly added in this revision.

A candidate taxonomy is livelihood/consumption, public governance, and international security/human rights. It is not approved and has no current public field. Defer categories until D2 confirms labels and exact slug assignments in a public site-owned mapping. Keep unassigned topics reachable through all issues. No classification from keywords or source counts, no metadata-only topic promotion.

### 5. Evidence boundaries and inspection round trips

The full owner keeps each record's status, proof scope, limitations, named speaker and canonical source links. A short entry or timeline reference must retain enough status and scope to prevent a stronger reading and link to the full owner; the source index alone cannot replace local qualifications.

Use clearly named actions for opening the original source and inspecting the on-page source record. The latter supports returning to the originating citation, including a source cited from multiple places; direct source-fragment entry without an origin offers return to contents. Preserve existing source IDs, stable registry ordering, native history and accessible disclosure expansion. Essential metadata must work without hover. Without JavaScript, original links, readable evidence and manually expandable source records remain usable.

### 6. Missing material and migration compatibility

An absent optional module is omitted along with its contents link. An issue-wide absence of usable material uses the existing unavailable state. A missing public record, an unresolved outcome and an inapplicable module must not be conflated; only supplied public gaps justify a missing-record assertion. Do not invent reasons for an absent module.

Preserve `/topics/{slug}` and every existing section/source fragment, including `#main-content`, `#case-contents`, `#primary-document`, `#primary-document-reading`, `#context`, `#responsibility-lines`, `#coverage-limits`, `#claims`, `#questions`, `#progress`, `#administration-actions`, `#proceedings`, `#people`, `#reports`, `#narratives`, `#analysis`, `#social-observations`, and `#sources` where present. Freeze actual baseline IDs and retain each exactly once at a meaningful destination. Do not retain a hash on hidden or unrelated content merely to satisfy an existence assertion.

## Risks / Trade-offs

- New entry order contradicts earlier intentional Hsinchu flow → Resolve D1 explicitly; keep the gateway/guide continuous and document the replaced ordering assertions.
- Repeated records have different limitations → Freeze exact inventory and keep distinct variants; no heuristic reconciliation.
- Question labels imply claims the material cannot support → Check each label and summary against its mapped public record and preserve qualification locally.
- Shared renderer changes affect all topics → Opt in the pilots, compare untouched topics, and defer broad rollout until pilot acceptance.
- Public snapshots are not current-policy verification → Display dates and limits; do not claim live factual validation or usability gains from this proposal.

## Migration Plan

1. Resolve D1; retain category deferral unless D2 is explicitly selected. Freeze baseline records, anchors and remaining-topic inventory in this change's acceptance evidence.
2. Implement common shell behavior and two explicit pilot mappings; retain other topic bodies. Support the approved homepage date behavior.
3. Validate pilots with repository tests, lint and build, plus keyboard, source round trips, direct hashes/Back/Forward, no-JavaScript, mobile/reflow and screen-reader checks. Record actual outcomes rather than inherited receipts.
4. Conduct task walkthroughs: locate issue scope, distinguish a named claim from a result, find a limitation, inspect a source and return. Report whether this was evaluator inspection or an actual reader study. Obtain owner acceptance of the pilot before broad migration.
5. Sequence the remaining ten topics by actual material: first a simpler event/statement page, then richer mixed-source material such as food safety, then the remaining pages. Freeze a concrete slug-by-slug map and acceptance results for each batch; no invented content to fill optional sections.
6. Release remains a separate action. Rollback, if later authorized, restores the prior site rendering change without changing public evidence data or URLs. This planning action performs no deployment or rollback.

## Open Questions

- **D1 — before Hsinchu reordering:** approve introduction/contents before the full core document, or retain the document-first exception? Recommendation: introduction first with a prominent shortcut.
- **D2 — optional, deferred by default:** approve topical categories and individual slug assignments? Recommendation: ship all issues plus recent updates first; add categories only after explicit mapping.
- **Content follow-up, outside frontend inference:** related-case analysis applicability and canonical claim/lane associations remain unavailable. Preserve their existing presentation unless separately resolved.
