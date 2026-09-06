## ADDED Requirements

### Requirement: Hsinchu issue-first entry

The Hsinchu topic route SHALL render the existing issue hero and a direct primary-document shortcut, then the reading legend and `#case-contents`, before the long primary-document unit. Chapter 01 SHALL render the existing context, responsibility lines, and public coverage limits before adjacent `#primary-document` and `#primary-document-reading` sections. Chapters 02–06 SHALL retain their existing content and order.

#### Scenario: First-time reader enters Hsinchu

- **WHEN** a reader opens `/topics/hsinchu-baseball-stadium`
- **THEN** the visible issue entry and `#case-contents` appear before the primary-document gateway, and the contents exposes a direct link to the complete document
- **AND** the page does not replace the existing document, evidence, or analysis text with a new conclusion

### Requirement: Stable Hsinchu navigation and fragments

The route SHALL retain `/topics/hsinchu-baseball-stadium`, `#main-content`, `#case-contents`, `#primary-document`, `#primary-document-reading`, every existing chapter/section fragment, and every source fragment exactly once at meaningful destinations. The contents SHALL list only present sections in their actual DOM order.

#### Scenario: Direct document and legacy links

- **WHEN** a reader opens `#primary-document`, `#primary-document-reading`, `#case-contents`, or an existing chapter/source fragment directly
- **THEN** the browser resolves to the preserved target and the target remains readable and navigable without a generated replacement ID

### Requirement: Public evidence is preserved

The implementation SHALL consume the existing public projections without changing public input bytes, classifications, statuses, attribution, proof scopes, limitations, counts, canonical source URLs, document provenance, visible page coverage, missing-page/redaction boundaries, or analysis separation. The primary-document gateway and guide SHALL render once each, and Hsinchu canonical source actions SHALL retain `_blank` and `noreferrer` behavior.

#### Scenario: Evidence inventory remains identical

- **WHEN** baseline and post-change Hsinchu renderings are compared
- **THEN** every frozen public record and source reference remains present with the same qualification and the same canonical URL
- **AND** the public input hashes are identical

### Requirement: Pilot scope is isolated

The change SHALL alter only the Hsinchu route and its Hsinchu-scoped styles, tests, and acceptance evidence. The homepage, EZ WAY route, generic dossier routes, metadata-only exclusions, and other approved topic renderings SHALL remain unchanged.

#### Scenario: Non-pilot regression

- **WHEN** the homepage, EZ WAY route, or a non-Hsinchu approved topic is rendered after the change
- **THEN** its baseline SSR structure, anchors, source behavior, and public evidence remain unchanged

### Requirement: Accessible reading order

The Hsinchu route SHALL provide one semantic DOM for desktop and narrow screens, visible keyboard focus, native fragment navigation, no-JavaScript access to the contents/document/source links, and no horizontal overflow at the accepted viewport widths. The canonical document/source actions SHALL remain ordinary links.

#### Scenario: No-JavaScript and narrow viewport

- **WHEN** JavaScript is disabled and the route is viewed at 390 CSS pixels
- **THEN** a reader can reach the contents, document gateway, document guide, existing sections, and source registry with native links and disclosures without horizontal scrolling
