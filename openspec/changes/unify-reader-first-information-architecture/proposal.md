## Why

First-time readers currently encounter document detail or chronology before understanding an issue's scope. Hsinchu and the generic dossiers also differ in navigation and citation behavior, while the homepage labels an unsorted list as recent updates.

## What Changes

- Establish a shared issue entry, question-oriented contents, source inspection and return path, and explicit missing-material behavior, with topic-specific body length and order.
- Pilot the architecture on Hsinchu baseball stadium and EZ WAY using only existing public material; document an exact content-preservation map before moving or reconciling records.
- Propose introductory context and contents before Hsinchu's full document guide, with a prominent document shortcut. This intentionally revisits the existing document-first decision and remains an unresolved owner decision before implementation.
- Separate homepage discovery from date-ordered updates. Use an all-issues entry initially; topical taxonomy and individual assignments remain proposed rather than approved.
- Preserve existing routes, fragments, evidence status, proof scopes, limitations, attribution, canonical URLs, and no-JavaScript reading.
- Define a pilot acceptance gate and a staged migration plan for the other ten public topics; do not automatically publish the seven metadata-only topics.

## Capabilities

### New Capabilities

- `shared-issue-reading`: Common reading, content ownership, evidence boundaries, navigation, and the two pilot outlines.
- `issue-discovery`: Honest homepage ordering and explicit topic inclusion and classification.

### Modified Capabilities

None in `openspec/specs/`, which does not exist at the baseline. The affected change-local capabilities are `hsinchu-primary-document-entry`, `hsinchu-primary-document-reading`, `hsinchu-chaptered-evidence-dossier`, and `hsinchu-dossier-reading-flow`. Their exact ordering clauses and conditional replacements are enumerated in `contract-reconciliation.md`; this explicit reconciliation artifact governs their proposed supersession rather than treating them as unaffected or creating invalid MODIFIED deltas against absent main specs. No replacement activates before the recorded owner decision and aligned specification update.

## Impact

Expected implementation owners are `app/page.tsx`, `app/dossier-page.tsx`, `app/dossier-page-model.ts`, `app/topic-data.ts`, topic route/source-disclosure components, and their existing tests. Styling changes are limited to supporting the approved information architecture. No new runtime dependencies, private producer access, deployment changes, or factual research are proposed.

This action creates planning artifacts only. New editorial summaries, category assignments, and claim relationships require explicit public content mappings; unavailable mappings remain deferred rather than inferred by the frontend. Remaining-topic migration follows pilot acceptance rather than shipping all twelve pages at once.
