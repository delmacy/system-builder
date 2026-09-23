# STATION-VISUAL-WP-01 — Initial frontend and empty-shell milestone

Date: 2026-09-23  
Planning base: `main@e0602eb51b1c8a4cee5bf4b89c0a1cfba26e9258`  
Status: PLANNING & MATERIALIZATION / CONSTRUCTION A COMMITTED  
Architecture authority: ADR-0017  
Milestone: STATION-VISUAL-M1

## Goal

Create the reusable frontend substrate and deliver the first executable visual Station: an empty desktop shell with windowing, semantic commands/icons, shell chrome, Settings/Config Panel and component inventory.

## Owner sequencing decision

Visual Station work has priority over deferred Core/Agent/Palantir-derived improvements. `STATION-WP-01` Construction B (real Core adapter/session transport) remains deferred and is not silently absorbed into this package.

## WBS

### WBS-V1 — Host and visual substrate
- Station Next/React host and scripts;
- design tokens/theme;
- source-owned accessible primitives;
- semantic icons.

### WBS-V2 — Interaction runtime
- command registry/shortcuts;
- focus and minimal selection;
- AppManifest/ToolManifest;
- window state/lifecycle/geometry;
- daedalOS extraction/adaptation boundary.

### WBS-V3 — Shell composition
- navbar;
- toolbar/command bar;
- desktop;
- taskbar/launcher;
- running-window projection.

### WBS-V4 — Presentation configuration
- versioned presentation settings;
- Config Panel;
- live settings;
- persistence/reset;
- saved window layout.

### WBS-V5 — Qualification
- Component Lab;
- keyboard/accessibility baseline;
- browser E2E milestone proof;
- architecture/dependency checks.

## Package dependency DAG

```text
ui-core
   |
ui-icons
   |
station-interaction
   +-------------------+
   |                   |
station-windowing   station-settings
   |                   |
station-app-runtime    |
   +---------+---------+
             |
       station-shell
             |
        apps/station
             |
       M1 browser proof
```

## Construction A — Visual substrate + interaction/windowing core — COMMITTED

Sprint: `STATION-VISUAL-CONSTRUCTION-A-01`  
TASKs: 588..596.

Exit proof:

```text
Station dev host
 -> SB tokens/primitives/icons
 -> Command Registry
 -> Window runtime
 -> App manifests
 -> presentation settings
 -> render an empty desktop with one manifest-driven utility window
```

No complete shell chrome is required yet; the point is to establish reusable foundations.

## Construction B — Empty shell assembly — FORECAST

Candidate scope, materialized only after Construction A integration/fresh-main revalidation:

1. compose Global Navbar + explicit connection indicator/context placeholders;
2. compose Toolbar/Command Bar from Command Registry;
3. compose Taskbar + Launcher + running-window projection;
4. finish multi-window move/resize/minimize/maximize/focus/close and bounded snap;
5. implement Welcome, Settings and Component Lab utility apps;
6. wire Config Panel live settings and reset;
7. persist/restore presentation settings and layout;
8. add keyboard/focus/accessibility behavior;
9. add Playwright M1 end-to-end proof.

Exit: every STATION-VISUAL-M1 user-visible criterion passes.

## Construction C — Optional M1 qualification/hardening — FORECAST CANDIDATE

Promote only if fresh evidence after Construction B shows bounded work is required for the milestone, such as:

- cross-browser window/focus defects;
- accessibility blockers;
- performance/lazy-loading defects;
- daedalOS-derived attribution/refactor debt necessary for release;
- deterministic layout/persistence defects.

No new domain app scope is allowed here.

## Package Integration & Review

Regress complete M1, inspect dependency direction, presentation-state isolation, accessibility, shell performance, licensing/attribution, bundle breadth and actual-vs-forecast complexity. Missing M1 capability returns to explicit construction.

## Documentation & Closure

Reconcile repository memory, ADR, package status, milestone proof, frontend architecture and successor readiness. No new product behavior.

## Non-goals

File Manager, Workflow Studio, generic Canvas, 3D System Map, real Core transport, Host Agent, infrastructure/deployment surfaces, native wrapper, multi-Core and generated client UI.
