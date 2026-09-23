# Next Work — STATION-VISUAL-WP-01 Construction B

Date: 2026-09-23

## Planning authority
ADR-0017, `STATION_FRONTEND_FOUNDATION.md`, `STATION-VISUAL-WP-01.md`, `STATION-VISUAL-M1-EMPTY-SHELL.md` and `STATION-VISUAL-CONSTRUCTION-B-01.md`.

## Fresh-main basis
Construction A (`TASK-588..596`) is integrated by PR #903. Bounded post-A corrections and interaction work through PR #910 are already integrated. Construction B is materialized from `main@4434f21acc532a5481bb5412fcf228af11083458`; work already present on main is evidence/current behavior, not work to repeat.

## Next committed Sprint
`STATION-VISUAL-CONSTRUCTION-B-01`

Dependency order:
```text
TASK-597 Navbar
 -> TASK-598 contextual Toolbar / Command Surface
 -> TASK-599 Taskbar / Launcher completion
 -> TASK-600 multi-window journey + bounded snap completion
 -> TASK-601 Settings M1 + Component Lab
 -> TASK-602 live presentation settings + layout persistence/reset
 -> TASK-603 keyboard/focus/accessibility
 -> TASK-604 Station browser/cross-platform M1 proof
 -> TASK-605 cumulative M1 shell proof
```

## Construction B exit
Station boots explicitly disconnected and exposes Navbar, contextual Toolbar, measured Desktop, Windows and Taskbar/Launcher; Welcome/Component Lab/Settings are usable; presentation preferences/layout persist locally; reset is presentation-only; primary shell journeys are keyboard-accessible; semantic icons and ui-core remain source-owned.

## Hard boundaries
Station = perception/interação humana. Core = canonical truth/authority/cognition/orchestration. Host Agent = authorized local execution. Client Runtime = autonomous generated client runtime.

Do not add canonical DB/files, authorization decisions, business workflows, provider effects, deploy engine, schedulers, agents or invented domain truth to Station. No real Core transport, Host Agent expansion, File Manager, Workflow Studio, Canvas/3D or other deferred subsystem is part of this phase.

After Construction B integration, proceed to Package Integration & Review. Construction C remains optional and requires fresh evidence.
