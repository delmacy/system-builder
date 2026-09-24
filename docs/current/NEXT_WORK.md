# Next Work — STATION-VISUAL-WP-01 Construction B

Date: 2026-09-24

## Planning authority
ADR-0017, `STATION_FRONTEND_FOUNDATION.md`, `STATION-VISUAL-WP-01.md`, `STATION-VISUAL-M1-EMPTY-SHELL.md` and `STATION-VISUAL-CONSTRUCTION-B-01.md`.

## Fresh-main basis
Construction A (`TASK-588..596`) is integrated by PR #903. Bounded post-A work through PR #910 is already integrated. Construction B was materialized from `main@4434f21acc532a5481bb5412fcf228af11083458`; already integrated resize/taskbar/multi-window behavior remains authoritative and was not replayed.

## Construction B status
`TASK-597 -> TASK-598 -> TASK-599 -> TASK-600 -> TASK-601 -> TASK-602 -> TASK-603 -> TASK-604 -> TASK-605` is complete. TASK-604 predecessor exact head `5cd2c9600a4e2784ebe26984771f5fb559123da2` is green across the relevant CI/browser gates. TASK-605 is the cumulative closure record.

## Next eligible work
No further Construction B product TASK is materialized after TASK-605. The only eligible action is exact-head validation of the TASK-605 closure commit and, if green, Integration/Review of PR #911 according to the existing Work Package gates. Do not invent or absorb a next feature TASK.

## M1 exit demonstrated
Station boots explicitly disconnected; Navbar/Toolbar/Desktop/Taskbar compose; Welcome/Component Lab/Settings are usable; presentation preferences/layout persist locally; reset is presentation-only; primary shell journeys are keyboard-accessible and browser-proven on the dedicated Windows/Ubuntu Station gate.

## Boundaries
Station remains perception/interaction only. No canonical DB/files, authorization decisions, business workflows, provider effects, deploy engine, schedulers, agents or invented domain truth. Real Core transport, Host Agent, File Manager, Workflow Studio, Canvas/3D and deferred runtimes remain out of scope.
