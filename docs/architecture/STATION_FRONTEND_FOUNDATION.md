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
Owns the Station design tokens and source-owned primitives. **shadcn/ui is the default source/design baseline**: semantic OKLCH variables, Tailwind v4 composition, `data-slot` anatomy and restrained accessible states. Initial primitive set: Button, IconButton, Toggle, Select, Input, Separator, Tooltip, Menu surface, Panel, ScrollArea, Badge and focus-ring utilities. SB owns the exported source/API; shadcn is not a runtime authority. For complex future composites, Base UI is the preferred first headless provider behind SB-owned components, with Radix kept replaceable.

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

## Visual design-source policy

```text
Desktop/window mechanics  <- daedalOS patterns + bounded providers
Visual component grammar  <- shadcn/ui open-code baseline
Semantic icons            <- SB IconRegistry (initial provider decided separately)
Product semantics         <- SB contracts
```

Rules:

- Station shell controls should use `ui-core` rather than ad-hoc styled HTML when a primitive exists.
- Product code does not depend on shadcn CLI output paths or Base UI/Radix identities.
- Simple primitives remain dependency-light; headless providers are introduced only where behavior/accessibility justifies them.
- Current shadcn source conventions such as semantic tokens and `data-slot` are adopted where they improve consistency, but SB may diverge intentionally.
- Any substantially copied MIT source receives the applicable third-party notice; conceptually similar reimplementations are still documented as shadcn-derived design work.

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

## Station S4 WP2/WP3 operational Composition Editor

Addendum 003's bounded implementation uses an app-local normalized `app:composition-editor` manifest registered with the ordinary StationAppRegistry. Station's launcher opens one `composition-editor` WindowDefinition; the workbench uses the source-owned catalog and public editor/composition session APIs. The two admitted entries are the default grid/two-button example and Station ButtonGroup with actual typed slots. Layers, Inspector and Preview derive from one Station-owned draft; descriptor bounds constrain spans. Dirty catalog switching requires explicit Cancel or Discard-and-open.

The window host retains minimized WindowFrame children mounted and hidden; restoring reveals that same in-memory editor draft, fields and selection. Closing unmounts the window; reopening or reloading starts a fresh editor session. Browser local layout storage records presentation-only window identity/lifecycle/geometry; it does not store graphs, drafts or accepted edits. The earlier Component Lab proof's display-only Layers fixture is separate and is not an editor graph.

To run the integrated UI locally with Node 24 and npm 11: `npm ci`, `npm run station:build`, then `npm run station:start -- --hostname 127.0.0.1 --port 3100`. Open `http://127.0.0.1:3100/`, choose Open applications in the taskbar, then Composition Editor. The standalone `/component-editor` route exercises the same workbench. To verify, run `npm run verify` and `npx playwright test --config tests/browser/station-editor.playwright.config.ts` after installing Playwright Chromium as needed; the browser config starts the built Station server and includes 21 route/window/file/local-artifact journeys (12 WP2 plus 9 WP3). WP3 B browser run 38076637656/artifact 11679256267 and review run 38077056098/artifact 11679646414 contain actual-browser reports/reopen screenshots. This is a local production build, not a deployed user environment. Save changes/Discard changes remain session-local; WP3 adds explicit file/origin retention below.

See `project_docs/execution_planning/STATION-S4-WP2-DOCUMENTATION-CLOSURE-01.report.md` for integrated PR/CI traceability and residual limits. The M1 foundation and diagrams above remain historical design context.


## Station S4 WP3 portable composition operation

Addendum 004/RESOLUTION-01/02 use the existing ADR-0009 public envelope with a strict composition payload. The installed application/composition/baseRevision and source registry own identities/topology/order/labels; imported files are inert data and may change only admitted spans. The initial two catalog entries each have three nodes. JSON payloads reject malformed/version/schema/identity/revision/source/script fields and unsafe keys before replacement. Limits are inclusive 1,048,576 UTF-8 bytes, 256 nodes, 32 container levels and 256 code points per graph token; no URI/extension is executed or fetched.

1. Open the Station Composition Editor or `/component-editor`; choose a composition and layer, edit Columns/Rows and choose Apply size. Text still in the Inspector is unapplied until Apply size succeeds.
2. Save changes accepts only the mounted session; the saved/unsaved indicator describes that session. Save locally retains the complete validated applied graph/envelope under the separate `station:composition-artifact:v1:` namespace and accepts the session only after retention succeeds. Window layout preferences never hold the artifact. Reload/close starts a fresh session; explicitly choose Open saved to restore the entry's retained artifact. Catalog entries have independent keys.
3. Save As file requests an independent `.composition.json` download of the applied graph, with a new UUID URI/version 1.0.0; it preserves accepted inert metadata and records predecessor provenance when applicable. It neither applies pending Inspector text nor cleans a dirty draft nor proves the user retained the file. Keep the actual file; Open file reopens it in another session/context after size/codec/source validation.
4. Open saved/Open file warns before replacing dirty, unapplied or session-only accepted graph changes. Cancel open preserves fields/draft/selection and returns focus to the initiating control. Explicit discard/open replaces only a fully validated document; valid selection is retained for the same composition. Invalid input and superseded asynchronous reads preserve the current session.
5. Re-saving unchanged content preserves identity/version/provenance/extensions. Changed graph meaning keeps logical identity, increments caller SemVer patch and appends predecessor provenance; installed baseRevision remains distinct. Save As forks identity. No silent migration or server version authority.
6. Quota/denial/conflict/corrupt input returns an error without cleaning the draft or replacing prior bytes. If a saved artifact already exists/changed, retain current work with Save As file before Open saved and explicit replacement. A corrupt saved slot is conservatively preserved; use portable export/open for recovery rather than treating failed local saving as success. Browser data may be cleared or origin-specific. Expected-text checking is not transactional synchronization between concurrent tabs.

The package review and closure reports under project_docs/execution_planning/STATION-S4-WP3-* map accepted delivery to actual API/product/browser/Windows/Ubuntu proof and classified residuals. No automatic saving/loading, Core/server storage, structural authoring, File Manager, canonical .process, network sync or deployment is included.

## Station S4 WP4 applied size history

The Composition Editor route and Station window use one ephemeral history wrapper around the current EditorSession. Undo and Redo restore up to 50 applied changed size edits, retain the selected layer and accepted baseline, and increment draft revision; returning to the accepted baseline is clean. Changed branching clears redo; no-op/rejected edits retain it. Source topology and public artifact format remain unchanged.

Use Undo/Redo or Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl+Y while focus is on editor controls or Layers. Inputs, textareas, selects, contenteditable text and IME retain native text undo. Unapplied Inspector values and pending file/catalog replacement block graph history; apply the fields or restore their applied values and finish/cancel the pending operation first. Polite feedback explains blocked/empty/rejected operations; aria-disabled reflects availability while keeping controls focusable.

Successful Save changes, Save locally, Discard changes or open/switch starts an empty stack. Failed saving/opening, cancellation and Save As download preserve history. Minimize/restore preserves the mounted history; close/reopen or reload clears it. Neither artifacts nor layout preferences store history. Origin/file retention and version semantics remain WP3 rules.

Construction B expands the existing Chromium suite from 21 to 29 journeys, adding convergence, branch/no-op/rejection, native-input shortcuts, checkpoints, cancellation/failure/export, successful replacement/reload, Station lifecycle and the actual 51-edit/50-undo limit. Pure engine tests use both real installed compositions and existing projections/codec. No generic structural authoring, persistent history or full Component Editor is claimed.
