## Context

Base: `7101fbbd270e9f8933a41883ec1f2f7279da6d68`. The clean-task read-only Astra planning dispatch (`/root/oil_ia_plan`, requested model gpt-6-astra/high) inspected the actual public shape: 9 verified claims, 26 events, 16 speaker groups, 1 dated open question, 3 coverage gaps, 2 social observations, no context overview, primary document, analysis or stance. Native dispatch accepted the requested model; resolved rollout metadata was not independently inspected.

The generic renderer currently leads with chronology and combines known/open records. The parent captured `content-preservation.json` before implementation, including every projection key, complete source index, 44 actual HTML IDs and homepage plus 11 other topic outputs.

## Goals / Non-Goals

**Goals:** Make the initial reading path explain the oil issue using its existing records; separate the early investigation question from later findings; keep source limitations nearby and navigation in DOM order.

**Non-Goals:** No research, facts, causality, health guidance, source-role changes, model changes, new chapter engine, cross-topic redesign, dependencies or publication. No measured comprehension or owner-acceptance claim.

## Decisions

1. Opt in only when both route slug and model topicId equal `benzopyrene-food-safety` / `benzopyrene-food-safety-2026`. Other routes and foreign synthetic topicIds keep their existing renderer.
2. Hero gives a scope-only introduction (inspection/handling records, investigation progress and attributed statements), labels the existing date as page update, and replaces the prominent source count with a source link. No invented factual summary.
3. DOM and native contents order: `#claims` (inspection and handling records), `#progress` (all dated events), `#reports` (all attributed groups), `#questions` (dated investigation questions), `#coverage-limits` (supplied gaps), `#social-observations`, `#sources`. Optional links appear only with rendered material. Add `#issue-contents`. Retain optional supported modules if supplied; do not create empty chapters.
4. Prioritize complete verified records at public JSON pointers `/benzopyrene-food-safety/claims/1`, `/claims/5`, `/claims/6` (batch inspection, July 21 handling, July 27 investigation). Compare complete record content to canonical public input; keep unmatched records in original order. Tests bind these pointers and full record identities to the frozen projection. Do not choose the first array item as an overview or rewrite any record. Expose proof scope and limitations through the existing claim-card path; keep remaining records expandable.
5. Split the oil verified and question sections inside the existing presentation owner. The question's own statement/proofScope already says July 3; introduce it as a dated record, explicitly directing readers to dates and subsequent progress without declaring its current resolution. Coverage uses only the safe existing gap/gapReason/sourceRefs view model. Retain generic source inspection and canonical links.
6. Reuse typography/styles and add only `.dossier-shell--oil` layout rules for a single-column claim reading path and visible boundaries. Keep native disclosures, anchors, source focus behavior and one semantic DOM.

### Existing change reconciliation

`unify-reader-first-information-architecture` / `shared-issue-reading` / “Shared entry with topic-specific body” and “Pilot acceptance before broad migration” previously excluded remaining topics pending pilot acceptance. This user's explicit isolated food-oil pilot supersedes that exclusion for this exact slug only; it does not certify prior pilot acceptance or activate shared defaults. Its source-occurrence/history enhancement remains limited to its existing implementation; this change preserves the oil source mechanism and does not claim that feature. The prior blanket untouched-topic SSR test excludes oil now, replaced by this change's frozen record/fragment and non-target output checks. Historical manifests stay immutable. All Hsinchu-specific changes remain authoritative for Hsinchu and untouched.

## Risks / Trade-offs

- Moving an old question can imply current uncertainty → retain its exact dated statement and add date-reading guidance.
- Priority records can drift → full-record matching, frozen pointers and public byte tests force intentional remapping.
- Shared owner regression → gate on route and topicId; compare exact baseline SSR for homepage and every non-target topic.
- Hidden details can obscure qualifications → oil verified/open card boundaries are visible outside their source disclosures; all text remains in SSR.

## Migration Plan

Complete planning and strict validation before code. Implement scoped layout and tests, run required commands and inspect rendered output, then commit and obtain one fresh registered independent-reviewer verdict for the exact base..HEAD. Any fix needs an additive commit and fresh review. No push, PR, merge or release. A later authorized rollback is a normal revert.

## Open Questions

Manual screen-reader navigation, actual browser zoom/overflow and owner acceptance remain unperformed unless separately evidenced. Static/headless checks do not settle them.
