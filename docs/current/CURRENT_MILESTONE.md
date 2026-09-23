# Current Execution Milestone — Station Visual Planning & Materialization

Date: 2026-09-23

## Integrated predecessor

Station Construction A integrated through PR #901 at `main@e0602eb51b1c8a4cee5bf4b89c0a1cfba26e9258`.

## Owner priority

Implement the Station visual/application environment before resuming deferred Core/Agent improvements.

## Architecture

ADR-0017 establishes a source-owned Station shell with daedalOS used only as a bounded MIT-licensed donor/reference.

```text
apps/station
  -> station-shell
  -> station-app-runtime
  -> station-windowing
  -> station-interaction
  -> station-settings
  -> ui-icons
  -> ui-core
```

## Target milestone

`STATION-VISUAL-M1-EMPTY-SHELL`

The Station must launch visibly with Navbar, Toolbar/Command Bar, Desktop, Taskbar/Launcher, multiple utility windows, semantic icons and a Settings/Config Panel that changes presentation settings live.

## Current gate

Integrate the Planning & Materialization PR. Then start only `STATION-VISUAL-CONSTRUCTION-A-01` from fresh main.

Construction B remains forecast until Construction A is integrated and revalidated.

## Non-goals

No File Manager, Workflow Studio, Canvas/3D, real Core transport, Host Agent, infrastructure/deployment UI, native wrapper or generated client UI in this milestone.
