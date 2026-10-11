# Addendum009 — Station reusable installed catalog
Date: 2026-10-11 UTC
Status: ACCEPTED effective on validated WP9 Planning integration
Admission: owner explicitly requests execution of WP09 after WP8 closure #1075.

## Admitted scope
Install two source-owned layout-container descriptors: component:action-panel (column) and
component:action-row (row), explicit self layout ownership and typed slots.
Panel content accepts atomic/none or layout-container/row; row actions accepts only atomic/none.
Both use existing discrete bounds; source definitions declare exact recommendations.
One installed reusable composition composition:action-panel uses grid → panel → action row →
two existing component:button nodes. Existing example and button-group identities/revisions remain.
Installation means opening a fresh editable session from this installed source definition,
through the existing catalog lifecycle. It is not insertion of a template subtree into another draft.
Catalog navigation adds bounded title/ref search with explicit Install composition selection.
Original Composition selector remains compatible. A current entry remains discoverable when filtered.
Installing a different entry protects applied dirty or pending fields via Cancel/Discard-and-open;
installation never silently retains edits, grants actions or loads remote descriptors.
Palette exposes these installed descriptors only in the new entry. Incompatible family/layout/slot,
unknown component/composition and malformed imported graph reject with zero partial mutation.

## Compatibility and ownership
No new graph field, payload version or envelope change. Existing strict v1/v2/v3/v4 and
source-owned identity/revision/root rules apply. Text/properties/history/retention APIs are reused.
Source graph is immutable including any nested properties; independent installations cannot alias edits.
Station remains presentation-only, no Core or business authority. No L4 boundary/ADR change.

## Proof obligations
Real installation, nested projections, valid placement and incompatible slots/families/layouts,
unknown references, session independence, mixed edits/history, portable/local fresh-session reopening,
malformed import preservation, pending cancellation and replacement, keyboard and narrow/shell journeys.

## Exclusions
Universal/remote/user catalog; template subgraph insertion; reparenting; executable actions;
new atomic/property families; arbitrary CSS; File Manager/process/Studio/server/sync/deploy.
Bounded WBS21.2.1/21.2.3/21.3.1/21.3.2 only, not whole ComponentEditor/S4 completion.
