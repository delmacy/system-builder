# STATION-VISUAL-M1 — Empty Station Shell

Date: 2026-09-23  
Status: PLANNED  
Authority: ADR-0017 / STATION-VISUAL-WP-01

## Milestone statement

A user can launch the System Builder Station and interact with a coherent empty desktop environment before any real domain Studio is implemented.

## User-visible exit proof

1. Start the Station with one documented command.
2. See an explicit `Core: Disconnected` or simulator state; no fake connected business data.
3. See Global Navbar, Toolbar/Command Bar, Desktop and Taskbar/Launcher.
4. Open at least three windows from manifests: Welcome, Component Lab and Settings.
5. Move, resize, focus, minimize, maximize/restore and close windows.
6. Running-window state is reflected in the Taskbar.
7. Settings live-change theme, density, motion and shell visibility/configuration.
8. Reload restores versioned local presentation preferences and window layout.
9. Reset returns presentation state to defaults without affecting Station/Core canonical state.
10. Keyboard-only interaction can reach launcher, window controls and Settings.
11. Semantic icon tokens are used for shell actions.
12. Component Lab displays the M1 primitive/state inventory.

## Milestone architecture proof

- `apps/station` composes packages; it does not own reusable shell mechanics.
- daedalOS is not a runtime authority or filesystem/process dependency.
- no Station-local business authority/canonical state is introduced.
- presentation persistence is isolated behind a disposable adapter.
- controls invoke registered Commands.
- icon consumers use semantic tokens.
- shell can boot without Core availability.

## Explicit non-goals

No VFS/File Manager, Workflow Studio, Canvas/3D, real client data, Core adapter transport, production auth, Host Agent, deployment controls, Grafana/n8n integrations, installer/native wrapper or generated client UI.

## Acceptance evidence

- deterministic package tests;
- Station build/typecheck/lint;
- Playwright M1 browser journey;
- accessibility/focus checks;
- dependency-direction/architecture checks;
- exact-head CI and merge-candidate CI.
