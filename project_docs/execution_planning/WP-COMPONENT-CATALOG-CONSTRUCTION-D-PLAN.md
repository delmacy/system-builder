# WP-COMPONENT-CATALOG-COMPLETENESS — Construction D Planning

Date: 2026-10-13
Status: PLANNING; no implementation gate promoted.

## Scope and boundaries
Construction D supplies source-owned workstation composition primitives with constrained geometry, not a new shell window manager or backend orchestration. Must reuse existing Station icon tokens and `ui-core` Toolbar, ToolbarGroup, ToolbarButton, SplitButton and TabStrip patterns.

## Increment plan (batch implementation; run integrated tests at exit)
- D-A: survey shell/windowing geometry, existing panel/inspector and tab ownership; define split-pane contract with min sizes, valid resize and keyboard accessibility.
- D-B: controlled SplitPane horizontal/vertical and resize separator; no pixel-free drag or overlap with shell window resize authority.
- D-C: dock/panel grouping and active tab ownership with stable identity, long-label overflow, accessible drag-free reordering where needed.
- D-D: table/filter/action compounds with clear controlled state ownership; reuse existing DataTable and avoid duplicate implementation.
- D-E: compact icon toolbar and tooltip parity, density/theme; 390px and desktop responsive real consumer proof.
- D-F: integrated Playwright, state boundary tests, architecture/TypeScript/lint/build, then final exact-head GitHub CI and documented enclosure.

## Acceptance
All new exports have types, keyboard/ARIA and disabled/resize boundary coverage, Component Lab preview and real Station consumer proof; persistence/Inspector/composition artifact round trip remains Construction G. Do not claim Construction D done until final CI and documented scope exclusions. Construction C residual accessibility limitations remain tracked and must not be laundered into D completion.

## Current inventory observations
- `packages/ui-core/industrial.ts` already exports toolbar/group/button, split action button, and controlled tab patterns; extend rather than clone.
- `apps/station/web/app/station-file-manager-workbench.tsx` already owns a directory/panel view, so a general layout primitive must not replace artifact ownership.
- Shell window resize is separate from nested panel geometry; tests must establish the boundary.
