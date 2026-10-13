# Construction D — Workstation completion candidate

Date: 2026-10-13
Status: IMPLEMENTED / FINAL VALIDATION REQUIRED

## Scope delivered (D-A to D-F)
- D-A inventory: reused `ui-core/industrial.ts` Toolbar, ToolbarGroup, ToolbarButton, PaneHeader, TabStrip, SearchField, SelectField, SplitButton and existing Station Icon API, without cloning them.
- D-B `SplitPane` source-owned controlled fraction: horizontal/vertical separator, keyboard arrows/Home/End/Shift+arrows, pointer dragging, bounded min/max, disabled state, locally controlled geometry with no shell-window authority.
- D-C `DockGroup`: selected panel ID and close request are caller-owned; panels have semantic icons, scrollable tab header and explicit disabled states; no draggable/floating window framework.
- D-D `FilterBar`: controlled query, toggles, action slot and accessible labels; no DataTable reimplementation or backend mutation.
- D-E `StationIndustrialFoundationLab`: split/dock/filter live demos, icon-only ToolbarButton hover labels, responsive wrapping; proof in a real Studio workbench uses a separate safe preview, leaving canonical authoring workbenches mounted.
- D-F browser tests include geometry bounds, dock selection, filter state at 390px, and real Studio layout preview persistence across navigation.

## Contracts and limitations
- All three new primitives are exported from `@system-builder/ui-core`. They are presentation-only and do not take over Shell window geometry, persistent docking, canonical state, authorization, workflow execution or arbitrary drag/drop.
- No new component is `EDITOR_READY`; manifests/Inspector insertion/artifact round-trip remain Construction G.
- Floating window docking, persisted multi-region rearrangement, non-virtualized huge datasets and arbitrary toolbar command permission are out of bounded D scope.
- D completion evidence requires passing architecture, TypeScript, lint, production build, browser tests and exact-head GitHub Actions; update status to ENCLOSED only after this occurs.

## Verification pointers
- Source: `packages/ui-core/workstation.tsx`, `packages/ui-core/industrial.ts`, `packages/ui-core/index.ts`.
- Live Lab: `apps/station/web/app/station-industrial-foundation-lab.tsx`.
- Real Studio consumer: `apps/station/web/app/station-studio-workbench.tsx` (preview only; does not remount authoring drafts).
- Browser tests: `tests/browser/station-ui-industrial.spec.ts`.
