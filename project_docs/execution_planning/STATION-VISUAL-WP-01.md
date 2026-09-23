# STATION Visual Work Package 01 — source-owned M1 shell

Date: 2026-09-23  
Planning base: `main@e0602eb51b1c8a4cee5bf4b89c0a1cfba26e9258`  
Current materialization base: `main@4434f21acc532a5481bb5412fcf228af11083458`  
Status: CONSTRUCTION B COMMITTED  
Architecture authority: ADR-0017  
Milestone: STATION-VISUAL-M1

## Goal
Deliver the first executable source-owned Station desktop shell with semantic design primitives, commands/icons, windowing, shell chrome, Settings and Component Lab.

## WBS
- V1 Host/substrate: Next/React, OKLCH tokens, ui-core, semantic icons.
- V2 Interaction: commands/shortcuts, focus vs semantic selection, manifests, window lifecycle/geometry.
- V3 Shell: Navbar, contextual Toolbar/Command Surface, Desktop, Taskbar/Launcher.
- V4 Presentation: versioned local settings, live theme/density/motion/chrome/snap, layout persistence/reset.
- V5 Qualification: Component Lab, keyboard/accessibility, browser/cross-platform proof, architecture checks.

## Construction A — INTEGRATED
TASK-588..596, PR #903. Bounded fixes/extensions through PR #910 are current main and must not be reimplemented.

## Construction B — COMMITTED
TASK-597..605 completes M1 composition from the fresh main.

## Construction C — OPTIONAL
Only bounded qualification/hardening shown necessary by fresh evidence.

## Non-goals
Canonical Station DB/files, Core authorization/business workflows/provider effects/deploy, Host Agent execution, schedulers/agents, File Manager, Workflow Studio, Canvas/3D, real Core transport, native wrapper, multi-Core or generated client UI.
