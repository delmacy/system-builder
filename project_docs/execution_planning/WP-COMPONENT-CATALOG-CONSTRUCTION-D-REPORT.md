# Construction D — Workstation completion candidate

Date: 2026-10-13
Status: ENCLOSED — bounded Construction D acceptance passed

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
- D completion evidence is backed by PR #1179 on exact head `8bc0148b` and squash merge `72f1a354`: architecture, TypeScript, lint, production build and 146/146 station-editor browser tests passed. Station Frontend Quality, Cross-Platform Build, Merge Candidate CI, Deterministic CI, Heavy Product Tests and Station Editor Browser Journey succeeded. Automation Handoff State Machine was cancelled without jobs on this head; it did not report a code failure.

## Verification pointers
- Source: `packages/ui-core/workstation.tsx`, `packages/ui-core/industrial.ts`, `packages/ui-core/index.ts`.
- Live Lab: `apps/station/web/app/station-industrial-foundation-lab.tsx`.
- Real Studio consumer: `apps/station/web/app/station-studio-workbench.tsx` (preview only; does not remount authoring drafts).
- Browser tests: `tests/browser/station-ui-industrial.spec.ts`.

## Final disposition
Construction D-A through D-F are enclosed as **LAB_PROVEN** reusable workstation primitives and a bounded Studio geometry preview. This is not a floating docking/windowing engine, persistence layer, or editor-insertable declaration; those responsibilities remain outside this construction and require explicit separate proof. Construction E may begin without upgrading D components to EDITOR_READY.
