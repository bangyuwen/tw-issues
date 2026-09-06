## Why

The food-oil topic currently begins with a long timeline before readers can distinguish confirmed records, attributed statements and unresolved questions. Its public projection differs from Hsinchu: it has no context overview or primary-document dossier, and needs its own bounded reading path.

## What Changes

- Opt only `benzopyrene-food-safety` into a reader-first entry, evidence order and native section navigation.
- Reuse existing public records and evidence components; expose local proof scope and limitations and the supplied coverage gaps.
- Freeze public-input bytes, all target record/source/provenance fingerprints, fragments, homepage and every other topic output before implementation.
- Explicitly authorize this one-topic presentation pilot as an exception to the broader migration gate; no claim of Hsinchu/EZ WAY owner acceptance or measured reader comprehension is made.

## Capabilities

### New Capabilities

- `benzopyrene-reader-first`: Food-oil-specific entry, evidence reading order, navigation and preservation acceptance.

### Modified Capabilities

None. Existing change-local contracts are reconciled in design.md; there are no canonical specs under openspec/specs.

## Impact

The canonical presentation owner is `app/dossier-page.tsx`, called by `app/topics/[slug]/page.tsx` with `buildDossierPageModel`. Scoped styles may be added to `app/globals.css`; regression tests and this OpenSpec change are in scope. Public JSON inputs, model classification/source roles, other route behavior, dependencies, producers and deployment are unchanged. Delivery stops at verified local commits and a fresh registered review; no push, PR, merge or publication is authorized.
