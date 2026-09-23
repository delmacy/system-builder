# Next Work — STATION-VISUAL-WP-01 Construction A

Date: 2026-09-23

## Planning authority

ADR-0017, `STATION_FRONTEND_FOUNDATION.md`, `STATION-VISUAL-WP-01.md` and `STATION-VISUAL-M1-EMPTY-SHELL.md`.

## Next committed Sprint after planning integration

`STATION-VISUAL-CONSTRUCTION-A-01`

Dependency order:

```text
TASK-588 frontend host + daedalOS extraction boundary
 -> TASK-589 ui-core tokens/primitives
 -> TASK-590 semantic icon registry
 -> TASK-591 command/shortcut/focus/selection runtime
 -> TASK-592 window model/reducer
 -> TASK-593 bounded daedalOS-informed window adapter
 -> TASK-594 AppManifest/ToolManifest registry
 -> TASK-595 presentation settings/local adapter
 -> TASK-596 cumulative visual foundation proof
```

## Construction A exit

The Station host boots disconnected, renders an empty desktop, discovers utility manifests, opens at least one manifest-driven SB WindowFrame and applies presentation settings through the actual foundation packages.

## Forecast after Construction A

Construction B assembles the user-visible M1 shell: Navbar, Toolbar, Taskbar/Launcher, multiple windows, Settings UI, Component Lab, layout persistence, keyboard/accessibility and Playwright browser proof.

No forecast task is execution authority.
