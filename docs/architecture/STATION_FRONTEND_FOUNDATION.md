# Station Frontend Foundation

Date: 2026-09-23  
Authority: ADR-0017  
Milestone target: `STATION-VISUAL-M1-EMPTY-SHELL`

## Layer model

```text
apps/station
  composition root / Next host
          |
          v
packages/station-shell
  Navbar / Toolbar / Desktop / Taskbar / Launcher
          |
          +-------------------+
          v                   v
station-app-runtime      station-settings
AppManifest/ToolManifest preferences + local adapter
          |
          v
station-windowing
WindowDefinition/Instance/Manager/Layout
          |
          v
station-interaction
CommandRegistry / shortcuts / focus / selection
          |
       +--+--+
       v     v
   ui-icons ui-core
```

Existing `StationApplication` and `station-sdk` remain the connection boundary and are not replaced by this frontend architecture.

## Package responsibilities

### `packages/ui-core`
Owns design tokens and source-owned primitives. Initial primitive set: Button, IconButton, Toggle, Select, Input, Separator, Tooltip, Menu surface, Panel, ScrollArea, Badge and focus ring utilities.

### `packages/ui-icons`
Owns semantic `IconToken` -> provider mapping. Consumers never import Lucide symbols directly outside the adapter.

### `packages/station-interaction`
Owns presentation-safe Command Registry, command availability, keyboard shortcuts, focus identity and minimal selection context. It does not grant Core authority.

### `packages/station-windowing`
Owns window definitions, instances, lifecycle, geometry, z-order, focus, minimize/maximize/restore and optional snap metadata. Rendering adapter may use `react-rnd`.

### `packages/station-app-runtime`
Owns `AppManifest`, `ToolManifest`, app registry and mapping from an app launch to one or more WindowDefinitions. M1 apps are utilities/demos only.

### `packages/station-settings`
Owns versioned presentation preferences, normalization/migration and storage adapter. Initial local provider uses browser storage and is disposable.

### `packages/station-shell`
Composes Global Navbar, Toolbar/Command Bar, Desktop, Taskbar, Launcher and window host. It knows shell semantics, not business domains.

### `apps/station`
Owns the executable host, providers, route/bootstrap and composition. Product behavior belongs in packages rather than ad-hoc page components.

## Presentation state

Candidate M1 shape:

```text
StationPresentationState
  schemaVersion
  shell
    navbarVisible
    toolbarVisible
    taskbarVisible
    taskbarAutoHide
  appearance
    theme: system | light | dark
    density: comfortable | compact
    motion: full | reduced
    accent
  windowing
    snapEnabled
    windows[]
    activeWindowRef?
    savedLayout?
```

`StationPresentationState != StationApplicationState != Core state`.

## Window model

```text
WindowDefinition
  id
  appRef
  title
  icon
  defaultSize
  minSize
  multiInstance
  resizable
  commands[]

WindowInstance
  windowRef
  definitionRef
  state: OPEN | MINIMIZED | CLOSED
  mode: NORMAL | MAXIMIZED | SNAPPED
  geometry
  zOrder
  focused
  presentationPayload?
```

No canonical resource revision lives inside WindowInstance.

## App/tool model

```text
AppManifest
  id
  name
  icon
  windows[]
  commands[]
  tools[]
  launchPolicy

ToolManifest
  id
  name
  icon
  supportedSurfaces[]
  commands[]
  lazyLoad
```

M1 proves manifests with utility apps. Real domain apps follow after the milestone.

## M1 shell anatomy

```text
+-------------------------------------------------------+
| Navbar: SB | Core: Disconnected | Context | Search... |
+-------------------------------------------------------+
| Toolbar / Command Bar                                 |
+-------------------------------------------------------+
|                                                       |
|                    Desktop                            |
|        +-----------+     +----------------+            |
|        | Welcome   |     | Component Lab  |            |
|        +-----------+     +----------------+            |
|                         +----------------+              |
|                         | Settings       |              |
|                         +----------------+              |
|                                                       |
+-------------------------------------------------------+
| Taskbar / Launcher / Running windows                  |
+-------------------------------------------------------+
```

## Settings / Config Panel

M1 settings are presentation-only and update live:

- theme: system/light/dark;
- density: comfortable/compact;
- motion: full/reduced;
- accent preset;
- navbar visible;
- toolbar visible;
- taskbar visible/auto-hide;
- window snapping enabled;
- reset presentation/layout.

A reset cannot affect Core or client runtime state.

## daedalOS adoption boundary

Initial classification to validate during TASK-588/TASK-593:

| daedalOS area | M1 disposition |
|---|---|
| Desktop composition | ADAPT pattern |
| Window interaction/focus | ADAPT pattern / bounded code if worthwhile |
| Taskbar running-window behavior | ADAPT pattern |
| StartMenu/Menu interaction | ADAPT pattern |
| Dialogs | REFERENCE; use SB primitives |
| Apps/process context | REIMPLEMENT as AppManifest/WindowManager |
| Session context | DISCARD as authority model |
| Browser filesystem | DISCARD |
| bundled apps/emulators | DISCARD |
| default theme/styled-components identity | DISCARD; SB token system instead |
| react-rnd | REUSE upstream provider candidate |

## Test strategy

Pure state packages use deterministic unit/product tests. React/UI behavior receives component-level tests where economical. M1 requires Playwright browser proof for:

- cold boot;
- open three windows;
- focus/z-order;
- drag/resize;
- minimize/maximize/restore/close;
- launcher/taskbar behavior;
- settings live update;
- reload persistence;
- reset;
- keyboard focus/shortcuts;
- disconnected state labeling.

Visual snapshots may support review, but pixel snapshots are not sole correctness evidence.

## Performance budget for M1

M1 is small, but establishes rules:

- unopened utility apps are lazy-load candidates;
- hidden/minimized windows do not continuously perform expensive work;
- shell render cost must not scale with future catalog breadth;
- no background timer/animation merely to look alive;
- reduced-motion is functional.

## Post-M1 succession

After M1, likely next visual packages are File Manager/Resource Explorer, generic Explorer+Inspector, then first real Studio. These are not executable scope of this milestone.
