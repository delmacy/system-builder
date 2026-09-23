# STATION Visual Work Package 01 — source-owned M1 shell

Date: 2026-09-23  
Planning base: `main@e0602eb51b1c8a4cee5bf4b89c0a1cfba26e9258`  
Current materialization base: `main@4434f21acc532a5481bb5412fcf228af11083458`  
Status: CONSTRUCTION B COMMITTED  
Architecture authority: ADR-0017  
Milestone: STATION-VISUAL-M1

## Goal
Create the reusable frontend substrate and deliver the first executable visual Station desktop shell with source-owned design primitives, semantic commands/icons, windowing, shell chrome, Settings and Component Lab.

## Owner sequencing decision
Visual Station work has priority here. Real Core connectivity, Agent/provider execution and deferred Studios remain outside this Work Package.

## WBS
### WBS-V1 — Host and visual substrate
Station Next/React host/scripts; semantic OKLCH tokens/theme; source-owned accessible primitives; semantic icons.

### WBS-V2 — Interaction runtime
Command registry/shortcuts; focus and semantic selection separation; AppManifest/ToolManifest; window state/lifecycle/geometry; bounded daedalOS reference/adaptation.

### WBS-V3 — Shell composition
Navbar; contextual Toolbar/Command Surface; Desktop; Taskbar/Launcher; running-window projection.

### WBS-V4 — Presentation configuration
Versioned local presentation settings; Settings UI; live theme/density/motion/chrome/snap controls; local persistence/reset; saved presentation layout.

### WBS-V5 — Qualification
Component Lab; keyboard/focus/accessibility baseline; browser/cross-platform milestone proof; architecture/dependency checks.

## Construction A — INTEGRATED
Sprint `STATION-VISUAL-CONSTRUCTION-A-01`, TASK-588..596, PR #903. Bounded fixes and foundation extensions through PR #910 are part of current main and must not be reimplemented.

## Construction B — COMMITTED
Sprint `STATION-VISUAL-CONSTRUCTION-B-01`, TASK-597..605. It completes M1 shell composition from the current main rather than replaying already integrated interaction work.

## Construction C — Optional
Only bounded qualification/hardening demonstrated necessary by fresh evidence after Construction B. No new domain application scope.

## Non-goals
Canonical Station database/files, Core authorization decisions, business workflows, provider effects, deploy engine, Host Agent implementation, schedulers, agents, File Manager, Workflow Studio, generic Canvas, 3D System Map, real Core transport, native wrapper, multi-Core or generated client UI.
