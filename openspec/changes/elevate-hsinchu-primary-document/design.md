## Context

`source-58` is a Threads post by 楊玲宜 containing twenty redacted images that visibly cover document pages 3–22. A local manifest, the images, and a machine-assisted transcript that was checked page by page have been captured for analysis. The public projection currently cites `source-58` only inside one high-risk attributed statement, so the Hsinchu dossier gives this central legal record no structural priority and no explanation of the difference between allegations, prosecutorial reasoning, the poster's summary, and TW Issues analysis.

The artifact is not an official Hsinchu District Prosecutors Office PDF. It omits pages 1–2 and at least pages 23–25, contains redactions, and cannot establish the missing context or restore hidden identities. The poster's caption also uses political and legally inaccurate framing, including referring to a judge, which must not be attributed to the document itself.

The completed `redesign-hsinchu-dossier-reading-flow` change established a context-first linear dossier and deliberately excluded public-data changes. This is a separate content-contract change prompted by new source material. It treats source identity and reading boundaries as front matter before context while leaving all substantive TW Issues interpretation in the later analysis section.

The repository publicly deploys everything committed under `public/`, while its declared `source-specific` license policy does not grant blanket republication rights. The user selected a link-to-source treatment: TW Issues will link to the canonical Threads post and publish only bounded, checked excerpts and a reading guide. It will not republish the twenty full-page images or the full auxiliary transcript.

## Goals / Non-Goals

**Goals:**

- Make the document the first evidence locator in the Hsinchu dossier without presenting a third-party-published partial document-page image set as an official complete record.
- Let readers distinguish visible document text, the poster's attributed framing, and TW Issues analysis before drawing conclusions.
- Explain which observed pages contain allegation or referral material and which contain prosecutorial reasoning, using exact document-page locators.
- Publish only editor-checked, necessary excerpts with explicit proof scope and limitations.
- Preserve the canonical Threads link, existing source registry, and standard fragment navigation.
- Keep the raw images and full auxiliary transcript available locally for analysis but out of public static output.
- Preserve the same semantic order and usable presentation at 390px, desktop widths, 200 percent zoom, keyboard-only use, reduced motion, and with JavaScript disabled.

**Non-Goals:**

- Republishing the twenty source images, the raw manifest, or the full transcript from the public site.
- Calling the artifact a court judgment, an official complete disposition, or a finding by a judge.
- Reconstructing missing pages, unredacting names or companies, or inferring text that is not visible.
- Treating allegations on pages 3–8, the poster's caption, or a TW Issues interpretation as prosecutorial findings.
- Reclassifying every claim cited by `source-58` as verified or using document priority as a confidence score.
- Resolving administrative, contractual, civil, safety, political, or high-prosecutor review questions that the partial disposition does not resolve.
- Changing non-Hsinchu routes, adding client-side filters, or introducing a new runtime dependency.

## Decisions

### 1. Treat the primary document as source front matter, not as an official verdict

The Hsinchu table of contents will gain `#primary-document` as its first item, and the corresponding section will render after the reading legend/table of contents and before `#context`. This intentionally changes the prior context-first order only by adding a source-identity and reading-boundary layer. Case context still precedes claims, proceedings, attributed statements, political narratives, and editorial analysis.

The section will use a fixed visible warning equivalent to:

> 文件頁面可見紅色騎縫印文・由第三方社群公開・已遮蔽・僅涵蓋第 3–22 頁

It will call the source an `不起訴處分書社群影像節錄`, never a `判決書`. Importance will be communicated through position, heading, and explanatory anatomy rather than a verified badge or rank score.

Alternatives considered:

- **Leave it in the source registry:** rejected because readers would not encounter the document's scope or decisive page distinctions until after all interpretations.
- **Place it after public statements:** rejected because the poster's framing would precede the document boundary and could be mistaken for source text.
- **Place a full transcript before context:** rejected because it would overwhelm the dossier, republish substantially more third-party material, and make allegations easy to scan as findings.

### 2. Extend the existing public projection with a Hsinchu-scoped descriptor

`app/public-evidence.json` will remain the public data source. The Hsinchu projection will gain an optional `primaryDocument` object; `public-bundle.json` will receive the corresponding digest/provenance update. The renderer will not read local archive files at build or runtime.

The descriptor will contain only public presentation data:

- identity: public key, title, document kind, provenance status, source metadata, publication and capture dates;
- coverage: first and last observed page, explicit missing-before and missing-after statements, redaction status;
- structure: page ranges with neutral labels such as allegation/referral material, legal standard, and prosecutorial reasoning;
- checked excerpts: exact document page, short visible text or faithful bounded paraphrase, review status, proof scope, and limitations;
- layer boundaries: a short attributed-poster note and a pointer to the separately classified TW Issues analysis;
- canonical Threads URL only, with no public local-archive URL.

The initial checked excerpt set will include page 18's visible statement that the PE net, irrigation-system plastic pipes, and electrical wiring identified there were installed works and were not waste. Other pages may enter the checked-excerpt set only after the same image-to-text review and boundary assignment. The source's importance does not authorize bulk conversion of the auxiliary transcript into public facts.

Alternatives considered:

- **Import the manifest or transcript directly into a server component:** rejected because the public build contract names the allowlisted JSON inputs and because it would couple rendering to a local analysis artifact.
- **Add a new public transcript JSON:** rejected because it would create a second source of truth and publicly republish the full transcript contrary to the selected source-link treatment.
- **Hard-code source-58 in the component:** rejected because provenance, page coverage, and eligibility must remain testable data rather than hidden presentation logic.

### 3. Publish a compact reading guide, not a public page-image reader

The primary-document section will present, in this order:

1. document identity and the provenance warning;
2. observed coverage and missing-page boundary;
3. canonical Threads source link;
4. neutral document-structure guide with exact page ranges;
5. checked page-level excerpt cards;
6. explicit separation between the poster's attributed framing and later TW Issues analysis;
7. what the partial artifact cannot establish.

No dedicated public route is required in this change. Page locators mean visible labels such as `文件第 18 頁`, not fabricated fragment links into raw Markdown. The existing source registry keeps `#source-58` and the same canonical URL.

This keeps the dossier linear, makes the source central, and avoids both a dashboard and a duplicate navigation tree. A future approved change may add a full reader if an official full document or a clear public-republication basis becomes available.

### 4. Keep three evidence layers explicit and non-interchangeable

Every relevant block will use a complete text label, not color alone:

- `具印文頁面可見文字｜第三方公開`
- `楊玲宜貼文摘要｜具名說法`
- `TW Issues 分析｜非司法結論`

The poster layer will link to the original post and may state what the poster claimed, but it will not reproduce the full caption or use that caption to fill missing pages. TW Issues analysis remains in the existing analysis section; the primary-document section may link to it but will not merge analysis into visible document text.

The content model and tests will prohibit common category errors: pages 3–8 are accusation/referral material rather than the prosecutor's conclusion; an不起訴處分 is not a court acquittal; the document does not state that 高虹安 personally performed the excavation; and the political phrase `大秘寶` is not presented as wording from the disposition.

### 5. Keep local analysis artifacts outside deployment output

Before implementation is considered complete, the current untracked archive under `public/source-archives/hsinchu-baseball-stadium/source-58/` will be preserved with the same hashes in an ignored local analysis path such as `work/source-archives/hsinchu-baseball-stadium/source-58/`. Moving it is an output-boundary correction, not deletion. The manifest will be rechecked after the move.

Tests and the GitHub Pages post-build inspection will prove that no `page-*.jpg`, raw manifest, or full transcript from `source-58` appears in the public static output or rendered links. The local archive is a workspace aid, not a versioned archival guarantee; durable private evidence storage remains an owner decision outside this public repository.

### 6. Use semantic, responsive, progressively enhanced HTML

The section will use an `h2`, nested `h3` headings, a definition/list structure for coverage, and ordinary links. It will not require client state. Direct `#primary-document`, table-of-contents navigation, browser Back/Forward, and all text remain functional without JavaScript.

The main text measure will remain approximately 65–75 characters on desktop. At 390px, all content will use one DOM and one column with no horizontal overflow. Canonical URLs will wrap, and links will provide at least a 44-by-44 CSS-pixel target. Provenance, layer, and review states will be expressed in text and use WCAG AA foreground/background pairs; small text will not use the existing low-contrast decorative coral token.

## Risks / Trade-offs

- **[Risk] Structural priority may be mistaken for official authority.** -> Put the non-official, partial, and redacted warning before excerpts, avoid verdict styling, and retain attributed/analysis classifications.
- **[Risk] Allegation pages may be quoted as findings.** -> Label document structure explicitly, expose only reviewed excerpts, and test that allegation/referral ranges are not presented as prosecutorial conclusions.
- **[Risk] A compact guide omits useful full-text context.** -> Link to the canonical source, retain exact page locators and limitations, and keep the full local transcript available for analysis; do not compensate by reconstructing missing material.
- **[Risk] The Threads post may later be edited or removed.** -> Preserve public source metadata and capture date, state that the canonical source may be unavailable, and never imply that TW Issues hosts an official substitute.
- **[Risk] Local analysis files can be lost with the worktree.** -> Retain hashes and identify the absence of a durable private owner as an open follow-up; do not solve it by publishing the files from this repository.
- **[Risk] Moving untracked files could accidentally change or lose them.** -> Inventory exact paths and hashes before the move, use a non-destructive move to an explicit ignored path, and verify every manifest hash afterward.
- **[Risk] The new optional projection field could regress sparse or other topics.** -> Gate model and rendering on the Hsinchu field, preserve generic eligibility behavior, and add non-Hsinchu and sparse-projection tests.
- **[Trade-off] No public image/transcript reader reduces independent first-party inspection.** -> This follows the user's source-link choice and the repository's source-specific policy; future official-source acquisition can replace this limitation through a separate change.

## Migration Plan

1. Inventory the untracked `source-58` archive and verify all twenty attachment hashes against its manifest.
2. Move the archive intact from the deployable `public/` tree to an ignored local analysis path and repeat the hash check.
3. Add the optional public `primaryDocument` descriptor and types, then synchronize public-bundle digests without changing unrelated evidence classifications or canonical links.
4. Add the Hsinchu-only model eligibility, first table-of-contents entry, section renderer, and scoped responsive styles.
5. Add model, rendered HTML, canonical-link, content-boundary, cross-topic, and public-output-exclusion tests.
6. Run `npm test`, `npm run lint`, `npm run build`, and `npm run build:github-pages`; inspect narrow/desktop layouts, 200 percent zoom, keyboard order, direct hashes, reduced motion, and JavaScript-disabled output.
7. Release through the normal reviewed website workflow. Roll back by reverting the public projection and presentation changes; retain the local analysis archive unless the owner separately requests deletion.

## Open Questions

- The public repository is not the authoritative long-term home for the full local archive. The owner may later select a private evidence store; this does not block the source-link public treatment.
- If an official complete disposition becomes available, it should receive a new authoritative source record and explicit supersession relationship rather than silently replacing `source-58`.
- Public image or full-transcript republication requires a separate owner decision and source-specific review; it is intentionally outside this change.
