# Conditional Hsinchu contract reconciliation

Status: proposed; D1 unresolved. This artifact explicitly identifies affected change-local requirements at baseline `a4a16e75921a5c8f443cc56fe9c884c721c5f400`. It does not select a new order. Requirement names below are exact headings in each named change's `specs/<capability>/spec.md`.

## Activation and precedence

Before implementing a conflicting Hsinchu order, record D1 in this change's `acceptance-evidence.md`, finalize the Hsinchu ordering table, and update `shared-issue-reading/spec.md` with the selected full ordering requirements and scenarios. Task 1.4 must record exact old-heading → replacement-heading mappings and which ordering tests change for the Hsinchu ordering table; task 1.5 separately records the cross-topic table mappings. If D1 retains document-first, retain its Hsinchu placement clauses and revise the shared entry requirement to explicitly permit that exception. No unresolved conditional replacement overrides an existing SHALL contract.

If D1 selects introduction-first, the finalized shared reading requirements take precedence only over the ordering and grouping clauses listed below. The existing files remain historical records; they are not silently rewritten. Before later spec sync/archive, carry this explicit reconciliation into canonical requirements rather than installing contradictory old and new contracts. Unlisted provenance, factual, attribution, source identity and accessibility guarantees remain binding.

Cross-topic reconciliation is separate from D1 and applies under either Hsinchu placement choice. Before tasks 2.2–3.2 change EZ WAY or shared inspection behavior, task 1.5 must finalize the second table against the approved `shared-issue-reading` requirements and record the exact affected topics, surfaces and replacement scenarios in `acceptance-evidence.md`. Task 1.5 does not depend on tasks 1.1 or 1.4; the Hsinchu-reordering part of task 3.1 still does. Only explicitly mapped pilot/inspection changes supersede the listed cross-topic immutability clauses; other topics retain their baseline behavior. Creating or merging this planning PR does not itself approve those implementation mappings.

## Affected requirements and proposed replacements

| Source change / capability | Exact requirement heading | Proposed replacement if introduction-first is selected |
|---|---|---|
| `refine-hsinchu-primary-document-entry` / `hsinchu-primary-document-entry` | Primary-document source gateway is the first substantive content | Replace only immediate-after-hero/before-contents placement: scope entry and contents precede the downstream document unit; preserve eligibility, stable fragment and heading semantics. |
| Same | Detailed document reading completes the source-first flow | Replace only before-legend/contents/context placement. Keep gateway and guide immediately adjacent, full SSR content, unique provenance owner and independent stable fragments. |
| Same | Table of contents reflects downward document order | Replace Chapter 01's fixed destination list and document-before-contents scenario with the finalized pilot section sequence; every contents destination remains downstream and in DOM order. |
| Same | Document coverage and dossier coverage remain distinct | Replace only the Chapter 01 position and inherited heading-level assumption if dossier gaps move; keep the two coverage owners separate and headings sequential in the selected outline. |
| `elevate-hsinchu-primary-document` / `hsinchu-primary-document-reading` | Primary document is the first Hsinchu evidence locator | Its older first-contents-destination/before-context ordering must not revive. Use the finalized downstream document position, while preserving eligibility and source authority. |
| `chapter-hsinchu-evidence-dossier` / `hsinchu-chaptered-evidence-dossier` | Chaptered directory preserves the complete dossier route | Replace the mandatory six-chapter grouping with the finalized question-oriented pilot outline; preserve all actual baseline destinations. |
| Same | Public-safe coverage limits are first-class content | Replace only mandatory first-chapter placement if gaps move; retain visible public-safe gap text, reasons and references. |
| `redesign-hsinchu-dossier-reading-flow` / `hsinchu-dossier-reading-flow` | Context-first Hsinchu document order | Replace the fixed whole-page ordering scenario with the finalized pilot sequence, including the document unit and independent sources; preserve semantic evidence separation and non-interchangeable responsibility lines. |

## Cross-topic requirements and scenarios under either D1 outcome

| Source change / capability | Exact requirement heading / scenario | Bounded replacement and retained conditions |
|---|---|---|
| `refine-hsinchu-primary-document-entry` / `hsinchu-primary-document-entry` | Primary-document source gateway is the first substantive content / Primary document is unavailable | Replace only “without changing the remaining topic order” for the explicitly mapped EZ WAY outline. Continue omitting ineligible gateway/guide sections and their directory entries; no primary-document eligibility expansion. |
| Same | Responsive semantics and content boundaries are preserved / Public and cross-topic boundaries are checked | Replace the blanket non-Hsinchu order/anchors/styles/navigation immutability clause only for the approved EZ WAY outline and explicitly mapped shared inspection behavior. Preserve all existing anchors, permit only scoped supporting styles/navigation, retain private-output exclusions and the non-credibility meaning of source counts. |
| `elevate-hsinchu-primary-document` / `hsinchu-primary-document-reading` | Primary document is the first Hsinchu evidence locator / requirement text and Primary document is absent | Replace “without changing non-Hsinchu topic order” and the absent-document scenario's unchanged-order clause only for mapped EZ WAY sections. Preserve section eligibility, omission of ineligible document links/sections, and other topics' baseline order. |
| `chapter-hsinchu-evidence-dossier` / `hsinchu-chaptered-evidence-dossier` | Topic-specific behavior does not regress shared pages / Another topic uses the shared dossier renderer; A shared surface must change | Supply the explicit cross-topic specification contemplated by the existing exception. Permit only mapped EZ WAY and shared inspection changes; retain scoped selectors/capabilities, stable anchors, and Hsinchu plus non-pilot regression coverage. |
| `redesign-hsinchu-dossier-reading-flow` / `hsinchu-dossier-reading-flow` | Hsinchu presentation changes do not alter other topics / A non-Hsinchu topic is rendered | Supply the independently specified EZ WAY outline and mapped shared inspection behavior allowed by this scenario. Preserve sparse/unavailable behavior, all other topics' eligibility/order/layout/source behavior, and the separate No eligible public evidence is available scenario. |

## Preserved conditions

- A page-position change does not authorize new claims, new lane relations, deduplication by text, or omission of distinct limitations.
- Core document identity, third-party provenance, source-58, page 3–22 coverage, missing/redacted boundaries, checked excerpt scope and separate analysis remain unchanged.
- All actual baseline routes and fragments remain unique and meaningful, with native history, keyboard and no-JavaScript reading.
- The complete old requirement blocks and scenario sets must be checked when finalizing tasks 1.4 and 1.5 for their respective tables; this proposal authorizes only the explicit clause-level changes above, not blanket replacement of whole historical capabilities.
