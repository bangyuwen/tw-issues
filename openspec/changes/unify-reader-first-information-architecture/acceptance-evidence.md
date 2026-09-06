# IA acceptance evidence contract

Planning correction baseline: `440348e16fe40da9c44058330b79109ec7c78d15`. Status: **NOT RUN** for every runtime case below. This file defines required evidence and contains no usability, implementation or owner-approval receipt. D1 is unresolved; D2 remains deferred. `content-preservation.json` is not yet produced.

## Recording format

For each executed case record case ID, topic, exact tested commit, public inventory digest, command or manual procedure, browser/viewport/JavaScript mode, expected and observed result, and artifact location. For navigation steps also record start/end pathname+query+fragment, `twIssuesCitationOrigin` state or its absence, active/focused target and disclosure state. Keep only public evidence. Failed or unexecuted cases remain explicit; screenshots alone do not prove history or source identity.

Task 1.2 records the actual public baseline and complete content/citation inventory. Task 1.5 records the exact EZ WAY activation boundary. Tasks 1.1/1.4 record the owner-selected D1 order and reconciled requirements before any new Hsinchu output is accepted. Do not mark a proposed decision approved or an inventory complete by filling this template with expected results.

## Source cases — tasks 2.3 and 4.4

| ID | Procedure and required evidence | Expected result | Status |
|---|---|---|---|
| S1 | Select two mapped occurrences A/B of one source; record both citation IDs, full source hrefs and source backlink labels; render a reordered fixture using the same map. | A/B remain distinct and stable after reorder; one source owner, both backlinks present; no missing scope/limitations. | NOT RUN |
| S2 | Activate canonical action; capture exact href/target/rel and topic URL/history state before/after. Include source-58 on activated Hsinchu after D1. | Hsinchu retains canonical URL, `_blank` and `noreferrer`; topic history and preferred source origin do not change. | NOT RUN |
| S3 | Enter `#<sourceRef>` directly, then test invalid/wrong-topic/wrong-source origin state. | No guessed preferred return; static occurrence backlinks and appropriate contents fallback exist; enhancement opens/focuses source. | NOT RUN |
| S4 | Disable JavaScript; follow B's native inspection link, manually expand sources when needed, choose B's labeled backlink, use native Back/Forward. | SSR evidence and links work; return targets B; no automatic-origin promise or JavaScript-only controls. | NOT RUN |
| S5 | With enhancement: inspect B, Back, Forward, preferred return, Back. Record each URL/state/focus transition. | Inspection replaces prior fragment with B then pushes source with B origin; Back → B, Forward → source/B origin, return → B, Back → source. History handlers add no entries. | NOT RUN |
| S6 | Modified-click/open inspection in new tab; inspect source A then source B; navigate unrelated/direct legacy source and section hashes. | Modified clicks retain native behavior; direct/new-tab entries do not inherit a guessed origin; each source accepts only its own map-valid origin; legacy destinations and focus remain meaningful. | NOT RUN |

Run EZ WAY after 2.3/3.2. Run the new Hsinchu source model only after 1.1/1.4/3.1. Before that, Hsinchu canonical and hash checks assert baseline behavior only.

## Homepage cases — tasks 2.1 and 4.1

| ID | Procedure and required evidence | Expected result | Status |
|---|---|---|---|
| H1 | Inspect SSR of `/` and no-JavaScript `/#recent-updates`, including configured base path; enumerate IDs and navigation hrefs. | Same route contains visible `#all-issues` then `#recent-updates`; both native navigation links work; no tab state or new route; no duplicate IDs. | NOT RUN |
| H2 | Compare each section's topic link set against frozen `research-topics.json.topics` and the `allTopics`-only set. | Exactly twelve distinct approved slugs once per section; all seven metadata-only slugs absent; every approved topic reachable. | NOT RUN |
| H3 | Compare arrays, page time elements and event previews; exercise unequal/equal/invalid page dates and a page date differing from occurredAt. | All issues follows source array; updates sorts lastUpdated descending then slug, undated last by slug. `頁面更新` uses lastUpdated, optional `事件日期` uses occurredAt with original precision/status. No event-as-update inference. | NOT RUN |

## D1 boundary cases — tasks 1.5, 2.2 and 4.1

| ID | Procedure and required evidence | Expected result | Status |
|---|---|---|---|
| G1 | With D1 unresolved and EZ WAY enabled, compare Hsinchu/non-pilot rendered output, ordered heading/section/nav IDs, eligibility, canonical href/target/rel, and applicable styles to frozen baseline. Inspect changed ordering tests/snapshots. | Hsinchu/non-pilots unchanged; no default-on descriptors, broad styles or refreshed expected order; EZ WAY changes confined to its opt-in. | NOT RUN |
| G2 | Trace prerequisites for every planned Hsinchu-affecting renderer/order/style/citation or acceptance change. | All wait for 1.1/1.4 and 3.1; non-isolatable shared changes also wait; baseline regression success cannot mark Hsinchu migration accepted. | NOT RUN |

Repository checks and accessible reading walkthroughs remain tasks 4.2/4.3/4.5. Record new Hsinchu results only after its gate; preserve any still-pending screen-reader, reflow or pilot-owner acceptance instead of claiming full completion. No case authorizes remaining-topic migration or deployment.
