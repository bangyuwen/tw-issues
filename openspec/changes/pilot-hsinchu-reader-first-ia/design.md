## Context

The published Hsinchu route is a clear public issue, but its current order still puts the long primary-document gateway and guide before the issue navigation. The route already has a Hsinchu-only renderer, stable fragments, public evidence boundaries, and a six-chapter model. The implementation must change only the reading order; `public-bundle.json`, `app/public-evidence.json`, `app/research-topics.json`, the homepage, EZ WAY, and all other topic routes remain outside this change.

## Goals / Non-Goals

**Goals:**

- Make the dispute, evidence boundary, responsibility/procedure context, and contents visible before the long document unit.
- Keep a prominent direct shortcut to the complete primary document.
- Preserve every existing Hsinchu record, classification, limitation, source URL, route, and fragment.
- Keep the change Hsinchu-only and testable against the published `main` baseline.

**Non-Goals:**

- No new factual research, claim rewriting, lane association, taxonomy, or evidence upgrade.
- No citation-occurrence/history enhancement in this small pilot; existing Hsinchu canonical source behavior stays unchanged.
- No homepage, EZ WAY, generic dossier, metadata-only topic, or remaining-topic migration.
- No production deployment in this implementation change.

## Decisions

### 1. Resolve D1 as introduction-first

Use this DOM order for the Hsinchu route:

```text
hero + issue summary + primary-document shortcut
  -> reading legend
  -> #case-contents
  -> Chapter 01: context / responsibility / coverage limits
  -> #primary-document + #primary-document-reading (adjacent)
  -> Chapters 02–06 unchanged in content and order
  -> next-topic / disclaimer / footer
```

This gives a first-time reader an issue entry before the long document while retaining a direct path for readers who came for the document. The document gateway and guide remain adjacent and retain their separate provenance and coverage owners.

### 2. Keep ownership local

`getHsinchuDossierChapters()` remains the owner of Hsinchu table-of-contents descriptors. `DossierPage` moves the existing primary-document elements into Chapter 01 only when the Hsinchu route is active. The generic renderer and EZ WAY opt-in branch remain untouched. Supporting CSS is scoped to `.dossier-shell--hsinchu`.

### 3. Preserve source and fragment contracts

Keep `#primary-document`, `#primary-document-reading`, `#case-contents`, every existing section/source ID, and the Hsinchu canonical source action (`target="_blank"`, `rel="noreferrer"`) unchanged. Add only the document destinations to the Chapter 01 contents in their actual DOM order. Do not invent a per-citation origin map for this pilot.

### 4. Freeze before moving

Before implementation, record hashes for the three public inputs, baseline SSR/fragment output for Hsinchu, homepage, EZ WAY, and the other approved topics, plus a Hsinchu record inventory covering status, attribution, proof scope, limitations, and canonical source references. Acceptance evidence binds the implementation to its exact tested revision.

## Risks / Trade-offs

- **Historical document-first requirements conflict with the new order** → Record D1 and the exact clause-level replacement in this change; do not silently rewrite old change-local artifacts.
- **Moving the document can lose content or anchors** → Render the existing gateway/guide components once, add fragment/order assertions, and compare the frozen record inventory.
- **A shared renderer edit can regress other routes** → Keep the branch inside the Hsinchu condition and assert unchanged SSR for EZ WAY, homepage, and non-Hsinchu routes.
- **Visual order may hide a keyboard target** → Test no-JavaScript fragments, keyboard focus, reduced motion, and 390/1440px layouts before review.

## Migration Plan

1. Freeze the baseline inventory and record D1 as introduction-first.
2. Update the Hsinchu chapter descriptors, render order, shortcut, and scoped styles.
3. Run focused and full repository checks plus browser acceptance.
4. Commit the exact implementation, obtain a fresh independent review, and open a PR from this branch.
5. Release only after a separate user-authorized publish step; rollback is a normal revert of this Hsinchu-only PR.

## Open Questions

- Screen-reader user testing, actual browser zoom, and owner acceptance remain separate acceptance gates and must not be inferred from static or headless checks.
- The broader reader-first migration remains deferred until this Hsinchu pilot is accepted.
