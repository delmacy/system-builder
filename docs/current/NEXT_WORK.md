# Next Work — STATION-VISUAL-WP-01 Construction B

Date: 2026-09-23

## Planning authority
ADR-0017, `STATION_FRONTEND_FOUNDATION.md`, `STATION-VISUAL-WP-01.md`, `STATION-VISUAL-M1-EMPTY-SHELL.md` and `STATION-VISUAL-CONSTRUCTION-B-01.md`.

## Fresh-main basis
Construction A (`TASK-588..596`) is integrated by PR #903. Bounded post-A work through PR #910 is already integrated. Construction B is materialized from `main@4434f21acc532a5481bb5412fcf228af11083458`; already integrated resize/taskbar/multi-window behavior is current evidence and must not be repeated.

## Next committed Sprint
`STATION-VISUAL-CONSTRUCTION-B-01`

```text
TASK-597 Navbar
 -> TASK-598 contextual Toolbar / Command Surface
 -> TASK-599 Taskbar / Launcher completion
 -> TASK-600 multi-window journey + bounded snap completion
 -> TASK-601 Settings M1 + Component Lab
 -> TASK-602 presentation/layout persistence + reset
 -> TASK-603 keyboard/focus/accessibility
 -> TASK-604 browser/cross-platform M1 proof
 -> TASK-605 cumulative M1 shell proof
```

## Exit
Station boots explicitly disconnected; Navbar/Toolbar/Desktop/Taskbar compose; Welcome/Component Lab/Settings are usable; presentation preferences/layout persist locally; reset is presentation-only; primary shell journeys are keyboard-accessible.

## Boundaries
Station remains perception/interaction only. No canonical DB/files, authorization decisions, business workflows, provider effects, deploy engine, schedulers, agents or invented domain truth. Real Core transport and deferred Studios remain out of scope.
