## Context

This change began as a fresh, design-only exploration of the Hsinchu Baseball Stadium dossier. After the design and review were complete, the user explicitly authorized a local `fix and apply`; commit, push, pull request, merge, and deployment remain outside scope. The inspected worktree was detached at `a39c1e8ee42a34aabe0cb30fbcc468cca7dd4481`, and a live fetch confirmed that exact commit was also `origin/main` on 2026-08-29. The tracked public inputs were unchanged:

- `app/public-evidence.json`: `cab032426ecd24e0479ec45a9f417b375212011fe7ee795d91d2a1c8fecf87bb`
- `public-bundle.json`: `930f4576c1c771b4a645861718032773cf43e98a296565da7345a6a6b13f1a91`

The production page at `https://bangyuwen.github.io/tw-issues/topics/hsinchu-baseball-stadium/` returned the expected H1, 57-source metadata, evidence-state legend, seven-link contents list, complete long-form sections, and source fragments. A 390px Chrome DevTools readback measured no horizontal overflow (`scrollWidth == clientWidth`), found no interactive target below 44px among 346 current controls, and confirmed that `#source-49` opens the source disclosure and focuses the exact source row. These are baseline contracts to preserve, not defects to re-solve.

The actual stack is Node 22+, Vinext 0.0.50 and Vite 8 rendering a Next 16 / React 19 application. Tailwind 4 is imported through PostCSS, but the dossier is primarily composed with handwritten selectors in `app/globals.css`.

### Current-state critique

What already works:

- Evidence is visibly distinguished as confirmed, attributed, unresolved, or TW Issues analysis with text labels as well as color.
- Claim-local “這能確認／這不能證明” boundaries and canonical source links are present.
- People, administration actions, proceedings, political narratives, editorial analysis, and nonrepresentative social observations remain separate content types.
- The social sample explicitly states that it is non-random and cannot represent public opinion or event truth.
- Native disclosures, stable fragments, a skip link, visible focus styles, reduced-motion handling, and exact source focus already exist.
- Hsinchu-specific presentation is partly scoped through the case wrapper, while generic topics retain their own navigation and order.

What remains weak:

1. The page contains 12 confirmed claims, 8 open questions, 16 timeline events, 12 administration actions, 6 proceeding tracks, 13 people, 7 grouped attributed statements, 9 political narratives, 5 analyses, 10 social observations, and 57 sources. The seven-link table of contents hides `#responsibility-lines`, `#questions`, `#administration-actions`, `#proceedings`, `#reports`, and `#narratives` behind broad labels, making re-entry into the long page expensive.
2. The hero promises that readers will first see how events developed, but the actual case order is context, claims/questions, then chronology. The promise and document order should describe the same reading model.
3. The public projection already contains `coverageStatus: GAPS_DISCLOSED` and three public gap records, but the public TypeScript model and page do not present them. The UI therefore omits a meaningful evidence limitation that is already part of the public input.
4. Three standalone attributed claims exist, while the page model consumes only grouped speaker statements. Two `source-06` city-government claims have identical statements and proof scopes but non-identical limitation wording; one `source-09` procedural media report has no grouped counterpart. The projection supplies no claim relation key. Reconciliation must therefore be an explicit Hsinchu owner mapping, not string matching or a speaker-name heuristic. In particular, the institutional label `新竹市政府` must not imply continuity across administrations, officeholders, or governing parties.
5. The source count is useful inventory, but must not imply completeness, confidence, consensus, or source independence. The hero should pair the count with a short count caveat.
6. Five analysis claims share one section even though the last two discuss related legal controversies beyond the stadium's direct procedures. The design cannot hide or reclassify them without an explicit content-owner applicability decision.
7. Repeated bordered cards give many blocks equal visual weight. Chapter rhythm, ruled rows, and prose width can distinguish evidence boundaries from ordinary grouping without adding dashboard chrome.
8. Current small coral text on paper uses `#cf6555`, which measures 3.35:1 against `#f5f3ee`. That coral remains valid as an accent or large text, but small paper-surface text needs the darker existing coral ink (`#a34336`, 5.55:1).

### Guidance used

- USWDS treats in-page navigation as appropriate for lengthy content and requires keyboard-operable links tested in the page's own context: https://designsystem.digital.gov/components/in-page-navigation/
- GOV.UK recommends trying a single page with headings and a table of contents before tabs, and warns against hiding information most users need inside details: https://design-system.service.gov.uk/components/tabs/ and https://design-system.service.gov.uk/components/details/
- The UK Office for National Statistics describes task-oriented scanning and front-loaded headings rather than assuming top-to-bottom reading: https://service-manual.ons.gov.uk/content/writing-for-users/how-people-read-online
- WCAG 2.2 requires reflow without two-dimensional scrolling at 320 CSS pixels, visible keyboard focus that is not fully obscured, and a 24px minimum target subject to defined exceptions. This design keeps the product's stronger 44px target convention: https://www.w3.org/TR/WCAG22/
- ProPublica's current publishing direction explicitly packages investigations with supporting methodology and related material; here, coverage limitations play that supporting role without becoming a credibility score: https://www.propublica.org/article/why-propublica-redesign

No private research repository, evidence ledger, producer path, account/context data, deployment identifier, `.serena`, or `.codegraph` content informed this design.

## Goals / Non-Goals

**Goals:**

- Make every current primary and secondary section directly findable from one document-order chapter directory.
- Preserve the baseline's fact/attribution/analysis/stance/limitation distinctions and canonical-source traceability.
- Make already-public coverage gaps visible without exposing producer diagnostics or inferring missing facts.
- Preserve one linear, server-rendered document and native browser navigation while improving scanning and return navigation.
- Keep people, public statements, procedures, political narratives, editorial analysis, and social observations visibly separate inside a coherent chapter hierarchy.
- Maintain or improve 390px reflow, 44px targets, keyboard order, visible and unobscured focus, contrast, reduced motion, heading hierarchy, and fragment behavior.
- Isolate the planned presentation to the Hsinchu topic and identify every shared-surface risk.

**Non-Goals:**

- Editing, rewriting, upgrading, suppressing, or reclassifying any public fact, legal conclusion, attributed statement, analysis/stance label, proof scope, limitation, source, count, canonical link, content digest, or bundle provenance.
- Inferring public opinion, manipulation, causality, responsibility, confidence, or completeness from source volume or social samples.
- Adding filters, sorting, sentiment, scoring, tabs, a dashboard, a mode switch, scroll-jacking, animated counters, local storage, personalization, or CTA-led marketing patterns.
- Creating producer-owned lane associations, private evidence, new social nodes, or related-case applicability decisions in the public frontend.
- Modifying other topics' document order, navigation, rendering, or styling.
- Committing, pushing, opening a pull request, merging, or deploying the local implementation.

## Decisions

### 1. Use a chaptered public evidence dossier

The recommended direction is a six-chapter document directory. It keeps the current DOM order and content types, but exposes each existing secondary anchor under a clear parent chapter:

| Chapter | Primary and secondary targets | Boundary |
|---|---|---|
| 01 Case and evidence limits | `#context`, `#responsibility-lines`, new `#coverage-limits` | Five responsibility lines remain distinct; public gaps are limitations, not conclusions. |
| 02 What is known and unresolved | `#claims`, `#questions` | Confirmed claims and open questions remain separately labelled and adjacent. |
| 03 Time, administration, and proceedings | `#progress`, `#administration-actions`, `#proceedings` | Chronology does not collapse institutional actions or legal/administrative effects into one verdict. |
| 04 People and public narratives | `#people`, `#reports`, `#narratives` | Identity/role, attributed statements, and political framing remain separate sub-sections. |
| 05 TW Issues interpretation | `#analysis`, conditional `#positions` | Analysis and stance never receive confirmed styling; an empty stance section does not render. |
| 06 Supplemental samples and verification | `#social-observations`, `#sources`, `#source-*` | Social observations remain nonrepresentative; canonical sources remain the terminal verification layer. |

Every chapter ends with a normal link to `#case-contents`. The directory itself is static in document order: no sticky rail, scroll spy, selected chapter state, or hidden mobile navigation.

**Alternative rejected for now — five-responsibility-line casebook.** A genuinely different evidence-first direction would make administrative, criminal, civil/contract, political/communication, and operational/reopening responsibility lines the five main chapters, placing related facts, events, people, procedures, questions, and sources within each line. This would answer task-oriented questions quickly, but the current public projection does not canonically associate every affected entity with one or more lanes. Implementing it now would require frontend inference, duplication, or causal grouping. It remains blocked until the canonical producer supplies explicit associations and duplication rules.

### 2. Present public coverage gaps as evidence boundaries

Add `#coverage-limits` after the reading legend and before the chapter directory. The section consumes only a public-safe view of the existing three gap records:

- a concise visible gap statement;
- an explicit statement that absence of a retrieved document is not proof of absence or outcome;
- the existing public source references.

Do not render `coverageStatus`, raw status values, `actorRole`, `searchedAt`, `searchQueries`, internal diagnostics, or a progress/completeness score. The limitation itself remains visible; a disclosure may hide only lower-priority citations or elaboration, not the core gap.

### 3. Use an explicit, time-bounded attributed-content mapping

The content owner approved this Hsinchu-only mapping:

- Pair `attributedClaims[0]` with `attributedSpeakerGroups[0].claims[0]` and `attributedClaims[1]` with `attributedSpeakerGroups[0].claims[1]`. Both pairs are the `source-06` city-government statements. Render each identical statement and proof scope once; render every distinct limitation from both public records verbatim, while an exactly repeated limitation string appears once.
- Keep `attributedClaims[2]`, the `source-09` procedural media report, as its own attributed procedural-report row under `#reports`. Do not assign it to the city government, the prosecutors, a proceeding, or a timeline event.
- Keep all five grouped prosecution statements unchanged.

This is a recorded content-owner decision, not a general frontend deduplication algorithm. The Hsinchu model shall validate the expected pair positions, identical statement/proof scope, speaker, and source reference; changed input fails a test/build gate instead of falling back to text matching. Each institutional statement shows its source publication date. `新竹市政府` identifies the source-recorded institution at that date only: the UI does not infer that statements across dates belong to one administration, officeholder, or political party, and it does not add party labels absent from the public projection.

### 4. Keep URL fragments as the only persistent navigation state

- Plain anchor links update the URL and browser history.
- Browser Back/Forward returns readers to prior sections or claims.
- The existing source disclosure continues to open and focus exact `#source-*` targets.
- `#sources` continues to open and focus its summary.
- Section targets gain a visible `:target` treatment using outline/left rule/background, not color alone.
- Chapter return links point to `#case-contents` and do not rewrite history with custom state.
- Native `details/summary` remains the disclosure primitive. Important claim boundaries and gap headlines remain visible without expansion.

### 5. Use editorial hierarchy, not application chrome

The six chapters use large chapter numerals, a single H2, ruled rows, and generous section breaks. Cards remain only where an entity needs a bounded record (for example, a person profile); long matrices should prefer label/value rows. There are no feature cards, conversion CTAs, dashboard tiles, floating controls, or visual scores.

Typography:

- Keep `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", ui-sans-serif, system-ui, sans-serif`; do not add a webfont.
- Desktop H1: 64–80px; 390px H1: 40px; line-height about 1.12.
- Desktop H2: 44–52px; 390px H2: 30px.
- H3: 22–24px desktop and 21–22px mobile.
- Body: 17px with 1.75–1.85 line height; primary prose measure no wider than 68ch.
- Metadata: 13px minimum when spaced uppercase styling is used.
- Long source titles and identifiers use `overflow-wrap:anywhere`; normal prose never uses global `break-all`.

Color:

| Role | Token | Use |
|---|---|---|
| Warm paper | `#f5f3ee` | Page background |
| Surface | `#fffefa` | Evidence rows and bounded records |
| Ink | `#18313d` | Primary text |
| Deep navy | `#102936` | Hero and high-contrast rules |
| Coral accent | `#cf6555` | Large text, rules, and decoration only on light surfaces |
| Coral ink | `#a34336` | Small text and links on paper surfaces |
| Mint | `#a9cbbc` | Calm supporting accent; remains high contrast on navy |
| Confirmed | `#1d6b5d` | Status plus text label |
| Attributed | `#8b5d13` | Status plus text label |
| Unresolved | `#8c463e` | Status plus text label |
| Analysis | `#65547b` | Status plus text label and non-circular marker |

Motion is limited to 160–200ms color, opacity, and focus feedback. There is no reveal-on-scroll, parallax, animated count, width/height animation, or scroll-jacking. Under `prefers-reduced-motion`, smooth scrolling and transitions are disabled and the complete readable state is available immediately.

### 6. Desktop annotated wireframe

Target: 1440px viewport, 1180px maximum shell, 68ch primary prose.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ TW Issues                                                   ← Issue index   │
│ [76px topbar; existing brand and return path]                                 │
├════════════════════════════ deep navy hero ═══════════════════════════════════┤
│ Deep research · public-claim evidence                                         │
│ Hsinchu Baseball Stadium dispute                  As of 2026-08-29             │
│ [Reading promise that matches the actual order]   57 listed sources           │
│                                                   Count ≠ completeness         │
├──────────────────────────── warm paper ───────────────────────────────────────┤
│ READING LEGEND       ● Confirmed ● Attributed ● Unresolved ◆ Analysis         │
│ [Four text-labelled states; no color-only meaning]                            │
├───────────────────────────────────────────────────────────────────────────────┤
│ EVIDENCE LIMITS                                                               │
│ The public record still has 3 documented gaps                                 │
│ 01 Follow-up records   02 Procurement case status   03 Social-node threshold │
│ [Visible gap statement + limit; citations may disclose below]                 │
├───────────────────────────────────────────────────────────────────────────────┤
│ THIS PAGE                                                                     │
│ ┌───────────────────────────────┐  ┌────────────────────────────────┐         │
│ │ 01 Case and evidence limits   │  │ 02 Known and unresolved       │         │
│ │ context · responsibility · gap│  │ confirmed · open questions    │         │
│ ├───────────────────────────────┤  ├────────────────────────────────┤         │
│ │ 03 Time and proceedings       │  │ 04 People and narratives      │         │
│ │ timeline · actions · tracks   │  │ people · reports · narratives │         │
│ ├───────────────────────────────┤  ├────────────────────────────────┤         │
│ │ 05 TW Issues interpretation   │  │ 06 Samples and verification   │         │
│ │ analysis · stance if present  │  │ social sample · sources       │         │
│ └───────────────────────────────┘  └────────────────────────────────┘         │
│ [Every secondary label is a direct fragment link; 2-column document index]   │
├───────────────────────────────────────────────────────────────────────────────┤
│ 01  CASE AND EVIDENCE LIMITS                                                  │
│     One stadium, five responsibility lines, not one interchangeable verdict  │
│     [68ch summary]                                                             │
│     ─ Engineering/administrative row ─ Criminal row ─ Civil row ─ …           │
│                                                         Back to this page ↑   │
├───────────────────────────────────────────────────────────────────────────────┤
│ 02  WHAT IS KNOWN AND UNRESOLVED                                              │
│ ┌ Confirmed: 12 ───────────────────┐ ┌ Unresolved: 8 ─────────────────────┐   │
│ │ Statement                         │ │ Question                            │   │
│ │ Can confirm / cannot prove        │ │ Can confirm / cannot prove          │   │
│ │ ▾ View evidence and sources       │ │ ▾ View evidence and sources         │   │
│ └───────────────────────────────────┘ └─────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────────────────────────┤
│ 03–06 repeat one chapter header, ruled rows, and restrained entity cards.     │
│ Procedures, people, narratives, analysis, and social samples never merge.     │
└───────────────────────────────────────────────────────────────────────────────┘
```

### 7. 390px annotated wireframe

The mobile page uses the same DOM and fragment order. It has 20px gutters, one content column, no horizontal strip, and no fixed overlay.

```text
┌──────────────────────────────────┐
│ TW Issues           ← Index      │  44px+ interactive targets
├════════════ deep navy ═══════════┤
│ Deep research · evidence         │
│ Hsinchu Baseball Stadium dispute │  H1 40px / 1.12
│ Updated 2026-08-29               │
│ 57 listed sources                │
│ Count does not mean completeness │
├──────────────────────────────────┤
│ READING LEGEND                   │
│ ● Confirmed                      │
│ ● Attributed                     │
│ ● Unresolved                     │
│ ◆ TW Issues analysis             │  Single-column text labels
├──────────────────────────────────┤
│ EVIDENCE LIMITS                  │
│ 3 documented public gaps         │
│ 01 [visible gap statement]       │
│    ▾ Evidence and sources        │  Disclosure hides support, not the gap
│ 02 [visible gap statement]       │
│ 03 [visible gap statement]       │
├──────────────────────────────────┤
│ THIS PAGE                        │
│ 01 Case and evidence limits      │  Primary row min-height 56px
│    Context                       │  Secondary targets are real links
│    Responsibility lines          │
│    Coverage limits               │
│ ──────────────────────────────── │
│ 02 Known and unresolved          │
│    Confirmed · Open questions    │
│ …                                │
├──────────────────────────────────┤
│ 01 CASE AND EVIDENCE LIMITS      │
│ [single-column prose]            │
│ [responsibility row]             │
│ ↑ Back to this page              │
├──────────────────────────────────┤
│ 02 CONFIRMED                     │
│ Statement                        │
│ Can confirm                      │
│ Cannot prove                     │
│ ▾ View evidence and sources      │
│                                  │
│ UNRESOLVED                       │
│ …                                │
└──────────────────────────────────┘
```

Responsive rules:

- At 801px and above, the chapter directory may use two columns and confirmed/unresolved evidence may retain the current asymmetric comparison grid.
- At 800px and below, chapter content, proceedings, actions, narratives, people, and evidence boundaries become one column.
- At 390px and at a 320 CSS-pixel reflow test, source titles, publisher names, dates, and identifiers wrap without loss; no normal reading path requires two-dimensional scrolling.
- Desktop and mobile use identical semantic content and source order. Mobile does not remove limitations, citations, states, or sections.

### 8. Content-preservation mapping

| Public input/category | Quantity | Target/presentation | Preservation rule |
|---|---:|---|---|
| `contextOverview` | 1 | `#context` | Preserve headline and summary; do not turn the overview into a verdict dashboard. |
| Responsibility lanes | 5 | `#responsibility-lines` | Preserve each finding, proof scope, and sources; no lane overrides another. |
| `coverageGaps` | 3 | new `#coverage-limits` | Render only public-safe gap text and existing citations; no raw diagnostics or inferred outcome. |
| `claims` | 12 | `#claims` | Preserve statement, confirmed label, proof scope, limitations, and sources. |
| `openQuestions` | 8 | `#questions` | Preserve unresolved label and boundaries; never restate as a forecast or cause. |
| `attributedClaims` | 3 | `#reports` | Pair the two approved `source-06` city statements with their grouped counterparts and preserve every distinct limitation; render the `source-09` procedural report separately. No general heuristic. |
| `attributedSpeakerGroups` | 2 groups / 7 statements | `#reports` | Preserve speaker, role, summary, statement boundaries, source dates, and sources. Institutional attribution is date-bounded and does not imply administration or party continuity. |
| `reportedTimeline` | 16 events / 17 items | `#progress` | Preserve five phases, event order, item status, proof scope, limitations, and sources. |
| `administrationActions` | 12 | `#administration-actions` | Keep actor, action, observable outcome, status, proof scope, and limitations separate; city action is not automatically personal action. |
| `proceedingTracks` | 6 | `#proceedings` | Preserve body, question, conclusion, effect, unanswered matters, status, next step, and sources. |
| `publicPeople` | 13 | `#people` | Preserve public role, period, relation, summary, boundary, and sources; do not infer personal stance. |
| `politicalNarratives` | 9 | `#narratives` | Preserve attributed/analysis labels and dates; amplification is not opinion, manipulation, causality, or confidence. |
| `analysisClaims` | 5 | `#analysis` | Preserve premises, inference, uncertainty, falsifier, limitations, sources, and analysis styling. Related-case applicability remains an owner decision. |
| `editorialPositions` | 0 | conditional `#positions` | Do not render an empty anchor or invent a stance. |
| `socialObservations` | 10, N=10 | `#social-observations` | Preserve criticism/counterpoint groups, non-random warning, boundaries, and sources; never infer public opinion. |
| Unique public sources | 57 | `#sources`, `#source-*` | Preserve order, publisher, date, title, canonical URL, and exact fragment focus. Count is inventory, not a score. |
| AI production disclaimer | 1 | after sources | Preserve it; it does not replace claim-local provenance. |
| Existing navigation anchors | all | `#main-content`, `#case-contents`, all current section and source IDs | Keep stable so shared links and browser history remain valid. |

### 9. Accessibility acceptance design

- Keyboard order follows the single DOM order: skip link, topbar links, hero source link, legend/coverage controls if any, chapter links, document controls, source disclosure, source links, return link, disclaimer/footer links.
- Every operable control has a visible focus indicator. Use at least a 3px high-contrast ring in this product; never remove the native/author focus indication without replacement.
- Focused components and their focus rings remain fully visible by design, exceeding WCAG 2.2 AA's minimum “not entirely hidden” requirement. No sticky or fixed author UI may obscure them.
- All product controls keep at least a 44×44 CSS-pixel target, with at least 8px spacing when adjacent. Inline prose links retain readable line height and an equivalent 44px navigation path where practical.
- Normal text and interactive small text meet 4.5:1 against their actual background; non-text state/focus boundaries meet 3:1. Light coral is not used for small paper-surface text.
- Status is never encoded only by color. Text labels and analysis marker shape remain present.
- The page has one H1. Each chapter begins with one H2; subsection headings descend without skipping levels. Decorative labels are paragraphs/spans rather than false headings.
- `#main-content`, every chapter/secondary section, `#sources`, and every `#source-*` fragment resolve to an existing element. Back/Forward restores the hash and readable position.
- Exact source links open the source disclosure, move focus to the target, and scroll it into view without a hidden focus state.
- At 390px and 320 CSS pixels, there is no page-level horizontal scrolling, content loss, clipped source title, or overlap.
- `prefers-reduced-motion: reduce` disables smooth scrolling and nonessential transitions. No information depends on motion.
- Hover tooltips have an equivalent keyboard focus path; essential source metadata remains available in the source list and accessible label.
- Manual acceptance includes sequential keyboard navigation, 200% and 400% zoom/reflow, browser Back/Forward across section and source hashes, and at least one screen-reader heading/landmark pass.

## Risks / Trade-offs

- **The chapter directory is longer than the current seven-link row** → Use two columns on desktop, one column on mobile, concise parent labels, and direct secondary links. The added length buys complete findability without application state.
- **Coverage gaps may duplicate open questions** → Keep gaps about missing public records/coverage and questions about unresolved case outcomes; test that copy is sourced, not generated by the frontend.
- **Raw gap records contain fields unsuitable for public UI** → Introduce a narrow public-safe model and rendered-HTML negative assertions for diagnostics and enums.
- **Standalone and grouped attributed claims overlap without relation IDs** → Use only the approved Hsinchu pair map, preserve distinct limitation variants verbatim, render the procedural report separately, and fail tests if the expected records drift. Never generalize this into speaker-name or string-based deduplication.
- **Related-case analyses may be outside the dossier's tight scope** → Preserve current content until an owner explicitly provides applicability metadata or a separate content change.
- **Shared component and stylesheet edits can alter every topic** → Gate all new markup through the Hsinchu slug and scope CSS to the case wrapper; snapshot/SSR-test generic topic order and navigation.
- **Changing heading wrappers can break fragments or assistive-tech navigation** → Retain current IDs, add only `#coverage-limits`, and test the heading outline and every href/target pair.
- **A static directory does not show the currently viewed chapter** → Accept this trade-off. It avoids scroll observers, sticky obstruction, and state complexity while preserving browser-native behavior.
- **The page remains long** → This is deliberate. The design improves task entry and return without hiding primary evidence or splitting provenance across routes.

## Migration Plan

1. Record the approved coverage, attributed-content, analysis-applicability, and administration-period decisions and freeze the public category-preservation mapping.
2. Add only the narrow public-safe TypeScript fields needed for coverage limitations and attributed reconciliation; do not change JSON content or bundle provenance.
3. Introduce the Hsinchu-only chapter descriptor and coverage-limit presentation while retaining all old anchors.
4. Apply case-scoped visual tokens and responsive rules; do not change generic topic selectors unless the generic output is proven unchanged.
5. Add focused model, SSR, rendered-HTML, keyboard/hash, and 390px acceptance checks.
6. Run the repository's required `npm test`, `npm run lint`, and `npm run build` on the implementation revision, followed by desktop/390px browser and assistive-technology checks.

Rollback is a normal revert of the Hsinchu-scoped presentation and model additions. Because the design does not require public JSON, canonical link, digest, package, route, or deployment changes, rollback does not migrate content or data.

## Owner Decisions

1. Public coverage gaps are visible using only existing public gap text, reasons, and source references.
2. The two `source-06` city-government pairs use the explicit mapping above; the `source-09` procedural report remains separate. Institutional attribution is source-date bounded and never creates administration or party continuity.
3. The final two related-case analyses remain unchanged in the current analysis section until a separate content-owner applicability decision supplies public metadata.

## Open Questions

1. **Should a future producer add lane associations for the rejected five-line casebook?** Recommended: defer. The chaptered dossier solves navigation without expanding the evidence contract.
2. **Should chapter return links be repeated after every secondary section or only at each chapter end?** Recommended: chapter end on desktop; after long secondary sections at 390px only if usability testing shows the return distance remains excessive. Both choices use the same `#case-contents` target.
