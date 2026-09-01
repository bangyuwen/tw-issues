## Context

The deployed Hsinchu dossier currently renders this order:

```text
Hero
-> evidence-status reading legend
-> dossier-wide coverage limits
-> document-order table of contents
-> Chapter 01
   -> #primary-document
   -> #context
```

That order was produced by several additive Hsinchu changes. It no longer matches the intended information architecture: the core source is not the first substantive content, `#coverage-limits` is presented above the directory even though the directory classifies it within Chapter 01, and the directory contains destinations on both sides of itself. Direct `#primary-document` entry also draws a red rectangular outline around the long heading block, visually resembling an error or focus state.

The source facts and evidence boundaries remain authoritative and unchanged. The images visibly show red stamped seams, the public channel is 楊玲宜's third-party Threads post, the visible document range is pages 3–22 with redactions and missing context, and the stamped appearance alone cannot determine whether the holder's paper copy is an original or a copy. The canonical Threads URL and `#source-58` registry entry remain the inspection paths.

## Goals / Non-Goals

**Goals:**

- Make primary-document identity and limitations the first substantive Hsinchu content after the hero.
- Preserve one visible owner for provenance, document-page coverage, source metadata, and canonical actions.
- Keep the longer page-range guide and checked excerpt available without forcing a 390px reader through the entire long module before reaching navigation.
- Restore a table of contents whose destinations follow downward document order.
- Separate page-specific document coverage from dossier-wide public evidence gaps.
- Preserve one semantic DOM, sequential headings, stable existing fragments, native Back/Forward behavior, no-JavaScript readability, and Hsinchu-only scope.
- Remove the red fragment-target rectangle without weakening keyboard focus indication.

**Non-Goals:**

- Changing, promoting, or inferring any underlying fact, legal conclusion, responsibility, causality, evidence level, proof scope, limitation meaning, or source authority; presentation copy may be rewritten only to improve order and remove repetition, while later attributed political narrative remains unchanged.
- Republishing source images or transcript material, changing canonical source metadata, or reading private producer inputs.
- Collapsing the document guide, adding client state, sticky navigation, scrollspy, filters, scores, local storage, hover-only behavior, or breakpoint-specific DOM.
- Changing non-Hsinchu topic rendering.

## Decisions

### 1. Split source front matter from the detailed reading guide

The eligible Hsinchu primary-document model will render into two semantic sections with non-overlapping responsibilities:

```text
Hero
-> section#primary-document (source gateway)
-> reading legend
-> table of contents
-> Chapter 01
   -> section#primary-document-reading (detailed guide)
   -> section#context
   -> section#coverage-limits
```

`#primary-document` remains the stable existing fragment and becomes a top-level source gateway immediately after the hero. It owns, exactly once:

- the document title, affirmative source-backed lead, and directly supported document summary;
- the publisher, publication channel, publication date, and capture date;
- one neutral document-scope boundary containing the observed page range, missing-before, missing-after, redaction, and copy-status facts;
- the canonical Threads action and `#source-58` registry action; and
- one ordinary internal link to `#primary-document-reading`.

The source gateway uses an `h2`; its document-coverage subheading uses an `h3`. The Hsinchu hero lede may be adjusted only to signpost the new order, for example by telling readers to verify the core document's source and range before proceeding. It must not add a factual claim.

`#primary-document-reading` stays inside Chapter 01 and owns only:

- a neutral page-range structure guide written as document-content summaries;
- checked page-level excerpts with one local proof scope and one local non-generalization boundary; and
- the separate visible-document and TW Issues analysis layers.

It uses an `h3` under the Chapter 01 `h2`, followed by existing `h4`, `h5`, and `h6` descendants. A visible introductory sentence links back to `#primary-document` so direct entry never leaves the source and coverage owner undiscoverable. This reference may describe the relationship but must not repeat scope facts, metadata, coverage values, or canonical actions.

The poster is not a third primary-document content layer. Publisher identity and platform remain source provenance in the gateway, while the poster's political evaluation is omitted from the guide rather than relocated or duplicated. Existing later attributed political-narrative surfaces remain unchanged.

Alternatives considered:

- **Move the entire primary-document module above navigation:** rejected because the current mobile module is roughly 3,300 CSS pixels tall, delaying the reading legend and directory and forcing the directory's first document link to point upward.
- **Duplicate a compact summary above the existing full module:** rejected because duplicated provenance can drift and makes it unclear which block owns the source boundary.
- **Keep the current order and remove only the outline:** rejected because it leaves the core IA and bidirectional directory problem unchanged.

### 2. Make the directory describe only downstream content

The source gateway is already visible before the directory and therefore is not repeated as a directory destination. Chapter 01 begins with a link labelled `文件頁段導讀` to `#primary-document-reading`, followed by the existing `#context`, `#responsibility-lines`, and `#coverage-limits` destinations.

The detailed DOM order must match that link order. `CoverageLimitsSection` moves from the top-level pre-directory flow into Chapter 01 after the case-context section. This deliberately distinguishes:

- **document coverage**, owned by the source gateway and limited to the observed partial page-image set; and
- **dossier coverage limits**, owned by `#coverage-limits` and describing which wider public records remain unavailable.

`CoverageLimitsSection` must accept the enclosing heading level instead of retaining a hard-coded top-level `h2`; inside Chapter 01 it renders an `h3`. The chapter's own return link continues to target `#case-contents`.

Alternative considered:

- **Keep `#primary-document` as the first directory link above the directory:** rejected because a document-order directory must not present an already-passed destination as its first forward step. The stable fragment remains available through direct URLs and the detailed guide's visible return link.

### 3. Preserve one eligibility boundary and narrow the primary-document data owner

The existing model eligibility, source deduplication, source metadata, page coverage, excerpts, analysis boundary, and source registry remain unchanged. The `primaryDocument.posterAttribution` field and its dedicated type remain removed. The primary-document model adds data-owned lead and direct-support text, removes the duplicated warning and non-conclusion fields, and reduces the analysis boundary to one integrated summary. Both sections render only when the existing Hsinchu eligibility guard returns a primary document; sparse and non-Hsinchu topics render neither section nor the new directory link. The later `politicalNarratives` data remains unchanged.

Rendered-HTML tests will prove that the document title, affirmative lead, direct-support summary, neutral scope boundary, coverage values, source metadata, and canonical actions appear once, while guide entries, excerpts, document/analysis labels, local proof scope, and local limitation remain present once. They will also prove that the former warning block, standalone non-conclusion checklist, removed poster label, speaker role, summary, and attribution ID do not appear in the primary-document flow.

### 4. Remove fragment decoration that resembles an error state

The red `outline` applied to `.primary-document-heading` when `#primary-document` is targeted will be removed. The primary-document source gateway and detailed guide may neutralize any inherited non-focus `:target` outline and retain appropriate `scroll-margin`, but they will not add a replacement rectangle, rail, animation, or color-only state cue.

This affects fragment location feedback only. Existing link and control `:focus-visible` indicators remain visible, high contrast, unobscured, and independent from `:target` styling.

### 5. Keep layout responsive and topic scoped

The source gateway now sits outside the padded chapter container, so its width must provide its own Hsinchu-scoped 20px mobile gutters and approximately 65–75-character desktop measure. The detailed guide keeps the chapter measure. All new or changed selectors remain under `.dossier-shell--hsinchu`; no shared topic receives the source-gateway layout.

At 390px, breakpoint-adjacent widths, desktop, and 200 percent zoom, both sections use the same DOM order, ordinary wrapping, one column where necessary, at least 44-by-44 CSS-pixel interactive targets, and no horizontal overflow. No behavior depends on JavaScript or motion.

### 6. Give dossier-wide coverage fields distinct chronological roles

The first Hsinchu `coverageGaps` item currently repeats one complete paragraph in both `gap` and `gapReason`, and starts with the city's later reconsideration intent before stating that the non-prosecution disposition was already publicly reported. This is a source-data and information-order defect, not a shared renderer defect.

The public projection will therefore keep the existing two-field renderer and change only this Hsinchu item:

- `gap` becomes a concise inventory of the records still unavailable in the public projection;
- `gapReason` becomes a chronological status explanation: publicly reported non-prosecution disposition, currently inspectable third-party page 3–22 images, then the city's later stated intent to seek reconsideration; and
- both fields retain the limits around official complete text, missing pages, formal filing or acceptance, later result, and administrative-accountability records.

The wording must not conflate the third-party partial images with an official complete publication, or a stated intent with a filed, accepted, upheld, or reversed reconsideration result. No shared rendering component, source classification, proof scope, canonical link, or non-Hsinchu data changes.

### 7. Make the visible document pages the first basis for document content

The public projection will use three explicit source roles for the non-prosecution disposition:

- `source-58` represents only the document content actually visible in the partial page images, limited to pages 3–22. Page-specific claims must retain their page range, redaction, missing-page, and incomplete-context limits.
- 楊玲宜 Threads is only the third-party publication channel for those images. Publisher identity remains in the source gateway; the poster's summaries and political evaluations do not render as primary-document content, while any later dossier occurrence remains separately attributed and cannot be promoted into document text or prosecutorial findings.
- Media sources may support later reactions, attributed reporting, or procedural status not established by the visible pages. They cannot replace the visible document pages or manufacture the impression of a complete disposition rationale.

This priority is an evidence, citation, and rendered-reading priority. It does not renumber `source-58`, make it the first item in every page-wide source registry, or promote the third-party post into an official complete publication. If one claim mixes content visible in the images with information supported only by media, the claim must be split or its proof scope narrowed; reversing the source array alone is insufficient.

The first dossier-wide coverage gap will therefore cite `source-58` first for the currently inspectable page scope, `source-39` for the official occurrence of the disposition, `source-34` only for the city's later stated intent to seek reconsideration, and `source-01` only for the still-missing administrative-accountability record. Media reporting of a possible reconsideration must not imply that a request was filed, accepted, upheld, or reversed.

### 8. Lead with inspectable document content and consolidate boundaries

The source gateway remains immediately after the hero because the user explicitly selected the non-prosecution disposition as the page's first substantive evidence. Within that position, the reading order becomes:

```text
Document identity
-> affirmative source-backed lead
-> what the visible pages directly support
-> publisher and dates
-> one neutral document-scope boundary
-> canonical inspection actions
```

The lead identifies the publisher as Hsinchu City Councilor Yang Ling-yi and identifies Threads as the publication channel. Her office is relevant attribution context, but it is not itself a trust badge or an evidence-classification upgrade. Confidence in document-content claims comes from the visible page images and their page locators; her later political evaluation remains attributed elsewhere.

The gateway's document-scope section owns global limits exactly once: visible pages 3–22, missing pages before and after that range, redaction, the appearance of red stamped seams, and the inability to determine original-versus-copy status from the stamps alone. These facts use neutral “document scope” language rather than an alert treatment.

The downstream guide summarizes only what each visible page range covers. The page 18 excerpt retains one exact proof scope and one local statement of what that paragraph does not generalize to. The TW Issues interpretation integrates its boundary into one paragraph. Separate guide-entry caveats, an analysis-limitations list, and a standalone non-conclusions block are removed because they repeat the same global or local boundaries without adding evidence.

Alternatives considered:

- **Move the gateway into Chapter 01:** rejected because it would contradict the selected source-first hierarchy and move the disposition below navigation again.
- **Use the councilor title as a credibility indicator:** rejected because a source's office does not convert a unilateral political interpretation into a prosecutorial finding.
- **Remove all limitations:** rejected because page, redaction, copy-status, and non-generalization boundaries remain necessary to describe what the public material can establish.

## Risks / Trade-offs

- **[Risk] Two sections backed by one model may look like duplicated documents.** -> Use distinct headings (`核心文件` source identity versus `文件頁段導讀`), non-overlapping content, and reciprocal native links; assert single ownership in rendered HTML.
- **[Risk] A new fragment could break heading or directory assumptions.** -> Preserve `#primary-document`, add `#primary-document-reading`, keep all existing anchors, and assert exact Hsinchu-only order and sequential heading levels.
- **[Risk] Moving coverage limits could obscure evidence gaps.** -> Keep the section permanently visible in Chapter 01, retain its directory link and wording, and place it immediately after the context that makes the gaps understandable.
- **[Risk] The top-level gateway may lose chapter gutters.** -> Give the Hsinchu-scoped gateway an explicit responsive measure and verify 390px, 800px boundaries, desktop, and zoom.
- **[Risk] Removing `:target` decoration could be confused with removing focus.** -> Change only non-interactive fragment styling and independently verify every operable control's `:focus-visible` indicator.
- **[Trade-off] The directory no longer lists the source gateway.** -> The gateway is already encountered before the directory, retains its stable direct fragment, and links forward to the detailed guide; excluding it restores honest document-order navigation.
- **[Risk] Correcting chronology could accidentally promote media reporting into an official-document claim.** -> Keep the result explicitly attributed to public reporting, identify the inspectable material as third-party partial images, and assert the remaining official and procedural gaps separately.
- **[Risk] Putting `source-58` first could overstate a third-party post as a complete official publication.** -> Limit it to the content visible on pages 3–22, identify Threads only as the publication channel, and use `source-39` separately for the official disposition occurrence.
- **[Trade-off] Removing the poster layer omits one attributed summary from the core guide.** -> Retain publisher/platform/canonical provenance in the gateway and leave the existing later political narrative unchanged; do not recreate the summary in another primary-document card.

## Migration Plan

1. Add structural tests for the source-first order, forward-only directory, unique content ownership, heading hierarchy, and non-Hsinchu omission before changing the renderer.
2. Split the existing primary-document presentation into the source gateway and detailed guide without changing its public data model or factual text.
3. Move dossier-wide coverage limits into Chapter 01 and update the Hsinchu chapter descriptor to target `#primary-document-reading` first.
4. Add only Hsinchu-scoped responsive styles, remove the red fragment outline, and preserve focus-visible rules.
5. Run focused tests, `npm test`, `npm run lint`, `npm run build`, and `npm run build:github-pages`.
6. Inspect server-rendered and runtime output at 390px, 799px, 800px, 801px, desktop, and a 200-percent-zoom equivalent; verify keyboard focus, direct fragments, Back/Forward, reduced motion, no JavaScript, contrast, and overflow.
7. Correct the duplicated first Hsinchu dossier gap in the public projection, assert distinct field roles and non-prosecution-before-reconsideration order in model and rendered output, and recheck narrow-screen wrapping.
8. Submit only after a fresh independent-reviewer gate accepts the fixed diff. Roll back by reverting this delta; no producer migration is required.
9. Reconcile Hsinchu disposition-content claims and coverage references to the visible-page, publication-channel, and later-reaction roles; rerun the full validation and reviewer gate on the revised fixed diff.
10. Remove the poster-attribution field, primary-document card, ARIA ID, and attributed-only style; update the guide to two linear layers while preserving gateway provenance, later attributed narratives, and every page/limitation boundary.

## Open Questions

None. The user selected the split source-gateway and downstream-guide architecture over moving the complete long module above navigation.
