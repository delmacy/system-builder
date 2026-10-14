# FM-02 — Construction A: controlled shared tree navigation

Date: 2026-10-14
Status: IMPLEMENTED IN BRANCH — WP TEST REVIEW PENDING
Predecessor: FM-01 PR #1202, merged `576ed633`

## Implemented
- `NavigationTree` accepts optional `expandedIds` and `onExpandedIdsChange` properties. Consumers omitting both keep prior internal disclosure state and API behavior.
- File Manager opt-in shared tree passes its existing `expanded` identities into `NavigationTree`; disclosure changes update the same File Manager expansion set used by the original tree and `navigate` ancestor reveal.
- Folder refs, canonical workspace identity, storage, import/export, revisions and Inspector are unchanged.

## Next increments within FM-02
- Construction B: navigation history / back-forward, breadcrumb consistency, focus state.
- Construction C: responsive inspector/panes and keyboard/390px fixes.
- Integrated Test Review at end of WP as instructed: Playwright real app, nested selected ancestors, fallback tree, keyboard semantics, desktop/390px, malformed workspace, regressions.
- Documentation & Enclosure requires exact-head passing CI, reviewed limitations and merged PR.

This Construction A does not claim fully resolved WAI-ARIA treegroup hierarchy, complete focus resilience or FM-02 completion.
