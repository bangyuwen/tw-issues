## Context

The Hsinchu Baseball Stadium route is rendered by the shared dossier page and currently combines a hero, a four-group sticky navigation, a six-question case map, evidence-status guidance, context lanes, chronology, administrative and proceeding records, claims and open questions, people and attributed statements, political narratives, editorial analysis, social observations, and a source registry. The current presentation preserves the public evidence contract, but its navigation and visual grouping create two competing information architectures and place important proof boundaries behind collapsed disclosures.

The site is a public-only consumer of `public-bundle.json`, `app/public-evidence.json`, and `app/research-topics.json`. The redesign must not read private producer data or alter public facts, claim classifications, attributed statements, source contents, canonical links, proof scope, limitations, counts, or provenance. The shared renderer also supports sparse projections and unavailable topics, so Hsinchu-specific structure must not become a global requirement.

The existing visual language is editorial rather than application-like: warm paper, deep navy, coral, mint, bordered evidence cards, native disclosures, and long-form typography. The design retains that language and does not introduce a generic landing-page pattern, remote font dependency, dark mode, confidence score, evidence graph, or dashboard behavior.

## Goals / Non-Goals

**Goals:**

- Establish a single, predictable context-first reading order for the Hsinchu dossier.
- Let a reader distinguish event context, procedural responsibility, attributed statements, editorial analysis, and social samples before drawing conclusions.
- Keep each claim's proof scope and limitation visible while the claim's detailed evidence disclosure is collapsed.
- Improve scanning and orientation without adding stateful filtering, graph relationships, or duplicate mobile and desktop navigation.
- Preserve all existing public sections, eligible entries, stable anchors, canonical source links, and source-disclosure behavior.
- Provide an implementation contract for keyboard access, focus visibility and non-obscuration, contrast, target sizes, heading hierarchy, reduced motion, deep links, 390px layout, zoom, and horizontal overflow.
- Limit presentation changes to the Hsinchu dossier and narrowly shared components whose behavior remains compatible with every topic route.

**Non-Goals:**

- Changing public facts, legal conclusions, evidence states, attributed statements, analysis or stance labels, source counts, source contents, proof scope, limitations, or bundle provenance.
- Rendering currently suppressed bare `attributedClaims` or empty editorial-position sections.
- Adding a public `coverageGaps` section, changing the projection schema for private producer fields, or importing any private research data.
- Inferring responsibility, causality, confidence, public opinion, political manipulation, or source quality from counts or social samples.
- Adding search, sorting, filtering, confidence scores, an active reading rail, IntersectionObserver state, local storage, a client-side evidence graph, or a second mobile navigation tree.
- Changing other topic layouts, deployment configuration, runtime dependencies, or producer workflows.

## Decisions

### 1. Use a context-first evidence spine

The Hsinchu page will use this document order:

```text
Case header and provenance locator
  -> evidence-status reading contract
  -> document-order table of contents
  -> context overview and five responsibility lanes (#context)
  -> known evidence and unresolved questions (#claims, #questions)
  -> chronology and procedural record
       (#progress, #administration-actions, #proceedings)
  -> people and public statements
       (#people, #reports, #narratives)
  -> TW Issues analysis and optional positions (#analysis, #positions)
  -> supplemental non-representative social sample (#social-observations)
  -> public source registry (#sources)
  -> existing disclaimer, next-topic link, and footer
```

The five responsibility lanes are a reading model, not navigation. They remain static content and do not gain graph edges, active states, ranking, or implied one-to-one mappings with sections.

Alternatives considered:

- **Evidence first:** rejected because statements are easy to overread before the responsibility and proof-scope contract is established.
- **Full chronology before evidence:** rejected because requiring readers to inspect every event before reaching known and unresolved evidence harms scanning.
- **Six question links plus five responsibility lanes:** rejected because it creates two incompatible top-level taxonomies.
- **Literal evidence map:** rejected because the public projection has no graph-edge, causality, confidence, or completeness contract.

### 2. Replace Hsinchu navigation with one static table of contents

The table of contents will reflect document order only:

1. Case scope (`#context`)
2. Known and unresolved (`#claims`)
3. Timeline and procedure (`#progress`)
4. People and public statements (`#people`)
5. TW Issues analysis (`#analysis`)
6. Supplemental social sample (`#social-observations`)
7. Sources (`#sources`)

Existing secondary anchors remain addressable even when they are not top-level table-of-contents entries. The same semantic navigation and link set will be rendered once for all breakpoints. Desktop may arrange the links in columns; 390px will use a single column. The navigation will not be sticky and will not maintain a selected-section state. The destination itself may use `:target` styling, and browser Back and Forward behavior remains authoritative.

This replaces the current grouped sticky navigation, six-question case-map links, and proposed active reading rail. A non-sticky table of contents avoids client state, preserves the reading measure, and reduces focus-obscuration risk.

### 3. Make proof boundaries visible before disclosure expansion

Each public claim card will show, without expansion:

- the existing evidence-state label;
- the unchanged claim statement;
- the unchanged proof-scope value under a clear "What this confirms" label; and
- the unchanged limitation value under a clear "What this does not prove" label.

The native disclosure will contain the remaining detailed evidence and source links. No value is summarized, truncated, regenerated, or inferred. Open questions remain a separate collection and are not converted into claim states or scores.

This increases card length, but it prevents the more serious failure mode in which a reader scans the statement while missing its boundary.

### 4. Give evidence families distinct semantic anatomy

- **Procedural records:** actor, action or outcome, effect, what the record does not conclude, and next step remain distinct fields.
- **People and attributed statements:** name, role, statement, attribution, date, and canonical source remain separate from procedural outcomes. Person cards do not use responsibility or verdict styling.
- **Political narratives:** speaker, date, attribution or analysis boundary, and amplification evidence remain explicit.
- **TW Issues analysis and stance:** remain in a separately headed editorial section and retain their classifications.
- **Social observations:** render in an independent supplemental `aside` after editorial analysis. The section always exposes the provided sample size and non-representative limitations, and does not share a container, status palette, comparison chart, or heading with political narratives.

The existing warm-paper visual system remains, but semantic status colors must meet WCAG AA for their actual text/background pair. Coral remains decorative or large-text emphasis unless a darker accessible token is used for small text. Color never acts as the only state indicator.

### 5. Scope structure and styles to Hsinchu

The shared data-selection and source-deduplication model remains authoritative. The implementation may derive Hsinchu section descriptors in `dossier-page-model.ts`, but it will not fork or duplicate the public evidence data.

The page renderer will select the context-first structure only when the Hsinchu projection supplies the relevant Hsinchu context. CSS will use a Hsinchu/case-specific root class so navigation, grid, spacing, and evidence-card changes do not alter other topic routes. Sparse projections continue to omit unavailable sections and their navigation links.

### 6. Use progressive enhancement for navigation and disclosures

The complete dossier, headings, table of contents, disclosures, source registry, and canonical links must be present in server-rendered HTML. Native anchors and `<details>/<summary>` remain the primary interaction model.

The existing source-disclosure enhancement may open and focus a hash-targeted source when JavaScript is available. Without JavaScript, the reader can still open the native source disclosure and access all sources. No core content or navigation depends on observers, persisted state, or client-only rendering.

### 7. Preserve a single responsive content model

The layout is mobile-first and uses one semantic DOM order:

- At 390px, the page uses approximately 20px gutters, a single-column table of contents, single-column evidence and record cards, wrapped long URLs, and no horizontal carousel or table.
- On desktop, the main prose measure remains approximately 65-72 characters, with wider source-registry space only where necessary.
- Interactive targets are at least 44 by 44 CSS pixels with sufficient separation.
- Focus indicators are visible, high-contrast, and not hidden by fixed or sticky UI; anchor targets account for any persistent site chrome.
- Reduced-motion preferences disable smooth scrolling and nonessential transitions.
- The heading hierarchy uses one `h1`, sequential `h2` section headings, and `h3` item/group headings without styling-only level changes.

## Risks / Trade-offs

- **[Risk] Moving sections could invalidate assumptions in rendered-HTML order tests.** -> Update only Hsinchu structural expectations while retaining every content, anchor, source-count, and private-string assertion.
- **[Risk] Shared component or CSS changes could regress sparse or non-Hsinchu topics.** -> Gate the structure with Hsinchu projection context, scope CSS under a case-specific root, and rerun all topic route tests.
- **[Risk] Permanently visible proof scope and limitations make claim cards taller.** -> Prefer readable measure and spacing over truncation; keep detailed source lists in native disclosures.
- **[Risk] A non-sticky table of contents offers less persistent orientation.** -> Use strong sequential headings, stable deep links, destination highlighting, and optional plain "Back to contents" anchors after long sections.
- **[Risk] Social observations may still be mistaken for opinion polling.** -> Keep the sample size, sampling limitation, and non-representative label visible without expansion; do not add percentages or comparison graphics.
- **[Risk] Source hashes could be obscured after the layout changes.** -> Preserve the existing source-opening and focus behavior and verify direct source URLs, Back/Forward, and focus position at every supported breakpoint.
- **[Trade-off] Deferring `coverageGaps` leaves a public bundle field unrendered.** -> Treat any new public gap presentation as a separately approved content-contract change rather than hiding it inside a layout implementation.

## Migration Plan

1. Add Hsinchu-specific section descriptors and presentation guards without changing the public projection data.
2. Implement the new order, table of contents, visible claim boundaries, and semantic section separation behind the Hsinchu guard.
3. Add scoped responsive and accessibility styles while preserving existing visual tokens.
4. Update Hsinchu rendered-structure tests and add behavioral tests for stable anchors, source hashes, omitted sparse sections, and content preservation.
5. Run `npm test`, `npm run lint`, and `npm run build`, then perform browser acceptance at 390px, breakpoint boundaries, desktop, 200% zoom, keyboard-only navigation, reduced motion, direct hashes, and JavaScript-disabled content access.
6. Release through the repository's normal reviewed website workflow. Roll back by reverting the presentation change; public bundles and producer outputs require no rollback or migration.

## Open Questions

- A future change may decide whether and how the already-public `coverageGaps` projection becomes visible. This does not block the current layout change because it is explicitly excluded.
- Browser acceptance requires an environment with installed frontend dependencies and a reachable production or local preview; the proposal does not treat unavailable runtime evidence as a pass.
