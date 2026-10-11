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


## Station S4 WP3 portable composition operation (historical v1 scope)

Addendum 004/RESOLUTION-01/02 use the existing ADR-0009 public envelope with a strict composition payload. The installed application/composition/baseRevision and source registry own identities/topology/order/labels; imported files are inert data and may change only admitted spans. The initial two catalog entries each have three nodes. JSON payloads reject malformed/version/schema/identity/revision/source/script fields and unsafe keys before replacement. Limits are inclusive 1,048,576 UTF-8 bytes, 256 nodes, 32 JSON nesting levels and 256 code points per graph token; no URI/extension is executed or fetched.

1. Open the Station Composition Editor or `/component-editor`; choose a composition and layer, edit Columns/Rows and choose Apply size. Text still in the Inspector is unapplied until Apply size succeeds.
2. Save changes accepts only the mounted session; the saved/unsaved indicator describes that session. Save locally retains the complete validated applied graph/envelope under the separate `station:composition-artifact:v1:` namespace and accepts the session only after retention succeeds. Window layout preferences never hold the artifact. Reload/close starts a fresh session; explicitly choose Open saved to restore the entry's retained artifact. Catalog entries have independent keys.
3. Save As file requests an independent `.composition.json` download of the applied graph, with a new UUID URI/version 1.0.0; it preserves accepted inert metadata and records predecessor provenance when applicable. It neither applies pending Inspector text nor cleans a dirty draft nor proves the user retained the file. Keep the actual file; Open file reopens it in another session/context after size/codec/source validation.
4. Open saved/Open file warns before replacing dirty, unapplied or session-only accepted graph changes. Cancel open preserves fields/draft/selection and returns focus to the initiating control. Explicit discard/open replaces only a fully validated document; valid selection is retained for the same composition. Invalid input and superseded asynchronous reads preserve the current session.
5. Re-saving unchanged content preserves identity/version/provenance/extensions. Changed graph meaning keeps logical identity, increments caller SemVer patch and appends predecessor provenance; installed baseRevision remains distinct. Save As forks identity. No silent migration or server version authority.
6. Quota/denial/conflict/corrupt input returns an error without cleaning the draft or replacing prior bytes. If a saved artifact already exists/changed, retain current work with Save As file before Open saved and explicit replacement. A corrupt saved slot is conservatively preserved; use portable export/open for recovery rather than treating failed local saving as success. Browser data may be cleared or origin-specific. Expected-text checking is not transactional synchronization between concurrent tabs.

The package review and closure reports under project_docs/execution_planning/STATION-S4-WP3-* map accepted delivery to actual API/product/browser/Windows/Ubuntu proof and classified residuals. No automatic saving/loading, Core/server storage, structural authoring, File Manager, canonical .process, network sync or deployment is included.

## Station S4 WP4 applied size history (historical scope)

The Composition Editor route and Station window use one ephemeral history wrapper around the current EditorSession. Undo and Redo restore up to 50 applied changed size edits, retain the selected layer and accepted baseline, and increment draft revision; returning to the accepted baseline is clean. Changed branching clears redo; no-op/rejected edits retain it. Source topology and public artifact format remain unchanged.

Use Undo/Redo or Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z and Ctrl+Y while focus is on editor controls or Layers. Inputs, textareas, selects, contenteditable text and IME retain native text undo. Unapplied Inspector values and pending file/catalog replacement block graph history; apply the fields or restore their applied values and finish/cancel the pending operation first. Polite feedback explains blocked/empty/rejected operations; aria-disabled reflects availability while keeping controls focusable.

Successful Save changes, Save locally, Discard changes or open/switch starts an empty stack. Failed saving/opening, cancellation and Save As download preserve history. Minimize/restore preserves the mounted history; close/reopen or reload clears it. Neither artifacts nor layout preferences store history. Origin/file retention and version semantics remain WP3 rules.

Construction B expands the existing Chromium suite from 21 to 29 journeys, adding convergence, branch/no-op/rejection, native-input shortcuts, checkpoints, cancellation/failure/export, successful replacement/reload, Station lifecycle and the actual 51-edit/50-undo limit. Pure engine tests use both real installed compositions and existing projections/codec. No generic structural authoring, persistent history or full Component Editor is claimed.

WP4 delivery traceability: engine #1051, actual route/window #1052 and package review #1053 validated/integrated; 29 real Chromium journeys and Windows/Ubuntu production builds. Documentation & Closure reconciles memory without product change. To inspect locally after pulling main, use Node 24/npm 11, `npm ci`, then `npm run station:dev`; open the Station launcher Composition Editor or `/component-editor`. For production proof use the build/start/browser commands above. Undo/Redo affects only applied span edits; subsequent structural component authoring remains separately gated.

## Station S4 WP5 bounded structural authoring — current operation
Addendum 006 extends the editor's installed catalog with add, non-root subtree removal and sibling reorder. Choose an existing container and slot, choose an installed component and add it with recommended spans. Layers, Inspector and Preview use the same draft and authored array order. Select a non-root node to remove its subtree; move earlier/later changes only siblings in that parent/slot. Root identity is fixed; external descriptors, reparenting and free drag are excluded. Incompatible/occupied slots or exceeded bounds reject without changing the draft. New references use the first available node:added-N identity.

Structural commands and applied span edits share the 50-entry ephemeral Undo/Redo history. Pending Inspector fields or replacement dialogs block graph changes; native input undo stays separate. Removal, undo and discard repair selection to a surviving ancestor/root. Save changes/local, successful open/switch and discard establish fresh history checkpoints. Minimize retains mounted state; close/reload resets history. Artifacts/preferences never persist history.

Save locally/Save As/Open saved/Open file operate on the validated applied graph. Changed topology/order uses composition payload schema 2.0.0; exact source topology/order remains 1.0.0. Both are readable by the integrated codec, while older readers explicitly reject v2. Updating retained v1 to structural v2 preserves artifact identity, advances caller patch/provenance and retains inert extensions. ADR-0009 envelope and installed source identity remain unchanged. WP3's origin/quota/conflict/download-receipt limits still apply. Historical WP3/WP4 fixed-topology statements above describe those predecessors and are superseded only within Addendum 006's admitted scope.

The same production build/start and Playwright commands above now execute **37 browser journeys**: 29 retained WP2/WP3/WP4 cases plus eight structural/history/file/local/keyboard/window cases. Engine #1056, workbench #1057 and review #1058 integrate bounded WBS 21.2.1/21.2.3/21.3.1/21.3.2 slices. See WP5 review/closure reports for exact-head CI and residuals. This does not complete the full ComponentEditor, whole WBS 21 or deployment. Quantitative max-bound snapshot validation remains optimization debt, not a latency guarantee.

## Station S4 WP6 history validation maintenance — current operation
WP6 preserves the WP5 editor controls, graph/selection/checkpoint behavior, native input undo, source/root/typed slots, v1/v2 artifacts and all data/history bounds. No new user-facing operation, catalog, storage or deployment is introduced. Continue using the existing Station launcher or /component-editor and the same build/start/browser commands; the actual Chromium regression remains 37 journeys.

Internally, history reuses successful validation of its own immutable snapshots only under matching source/baseline/registry/session context. Current graph/session and external/mutable/custom-registry histories still receive full validation. The reusable verdict is ephemeral private memory, absent from artifacts/preferences; successful checkpoint/open/close semantics remain unchanged. No certificate/history persistence or public API/schema change.

Reproduce the API measurement from the repository root with Node 24: node --import tsx scripts/benchmark-station-editor-history.ts. Optional --history-module path selects a reconstructed baseline algorithm; WP6 B report documents reconstruction and the paired protocol. The script measures both actual installed compositions, wide/deep 256-node fixtures and 50 snapshots, five warmups/30 samples/three batches, including caller-copy full validation. No timing assertion is added to normal product tests.

Observed paired max-bound warm Undo medians 125.364–229.787 ms -> 4.091–6.166 ms and Redo 125.244–228.868 ms -> 6.379–10.478 ms. This Node/runtime/workload evidence is not a browser-event or portable production latency guarantee. Cold copies retain full-validation cost; allocation deltas are not retained-memory certification. Full table/provenance: project_docs/execution_planning/STATION-S4-WP6-CONSTRUCTION-B-01.report.md; review/closure records retain WP6-L1/L2/D1 and inherited limits. 89 editor product cases pass. Planning #1060, A #1061, B #1062 and Review #1063 deliver internal maintenance only; closure is effective on validated TASK-671 merge.

## Station S4 WP7 bounded button-text operations — 2026-10-11 UTC
Installed Example composition and Station button group buttons expose Button text in the Inspector. Apply text commits plain display data to the same graph as Layers/Preview; Reset text removes the override and restores the catalog label. Restore fields abandons unapplied Inspector input; explicit Discard changes restores the accepted session baseline. Pending input blocks graph history/structure/save/export and text-selection loss; opening/switching offers explicit cancellation/replacement. Native input undo stays native. Applied text shares the50-entry span/structure history, checkpoints and window lifecycle.
Only1–256 nonblank Unicode code points without control/unpaired surrogate values are admitted for the two installed button refs. Root/container identities/actions remain unchanged. Labels are literal React text; preview uses one-line ellipsis and full title/accessible name to preserve discrete grid geometry. Layers/Inspector wrap long tokens;256-character no-overflow browser proof is recorded.
Payloadv3 retains optional text and authored topology. Readers acceptv1/v2/v3; text fields are forbidden inv1/v2. Producers usev3 when an override exists, otherwise retainv1/v2 selection; v3 readers also accept omission. Text-only retained changes preserve artifact identity and advance artifact version. Save/open remains explicit browser-local or portable file operations, not server/business persistence. Existing artifact/node/depth/token/history limits remain.
Existing npm run station:build/start and Playwright commands execute44 actual journeys (37 predecessors plus7 text cases). API98 editor cases, review133 editor/composition cases and B seven workflows/platform/frontend evidence support the bounded goal. Closure effective only on validated TASK-676 integration; all WP7-L1/L2/D1 and inherited debt remain. No general properties/catalog, File Manager/Studio/Core/server/sync/deploy, broad accessibility or performance certification is claimed.

## Station S4 WP8 typed button-properties operations — 2026-10-11 UTC
Select an installed Example composition or Station button group button. Button variant offers
Default/Outline/Ghost; Disabled preview is a presentation-only checkbox. Apply properties commits
both typed fields atomically; Reset properties removes only the properties override. Text/placement
remain. Preview shows the variant and disabled appearance without executing or authorizing actions.
Restore fields abandons pending input; Discard changes restores the accepted session baseline.
Pending properties protect selection, text/size/structure/history/save/export and explicit open/switch
replacements. Cancel retains input; confirmed replacement clears it. Native select/input shortcuts
remain native; keyboard submit, narrow layout and shell minimize/restore/close are proven.
Only non-root component:button/component:lab-button accept exact {variant,disabled} data. Both fields
are required when properties exists; no coercion/unknown/accessor/symbol fields. Nested snapshots
copy/freeze data and do not freeze or retain mutable caller-owned objects.
Current payload readers accept exactv1/v2/v3/v4. v4 allows optional properties/text omission; older
payloads reject properties. Producer choosesv4 whenever a node owns properties, otherwise minimum
v1/v2/v3. Reset can return a legacy schema. Property-only changes and explicit default presence
advance retained artifact version while preserving identity. Save/open remains explicit browser-local
or portable file workflow, not a business/server persistence receipt. Existing limits remain.
Local107 editor+35 composition cases and actual50 Chromium journeys support this bounded result;
CI also supplies full repository/platform/frontend proof. Broad accessibility and retained-memory
certification remain unproven. Closure effective only on validated TASK681 integration.

## Station S4 WP9 installed reusable catalog — current operation
Addendum009 extends installed catalog to three entries, preserving Example composition and Station
button group, and adding Reusable action panel. The new source definition has five nodes: grid,
self-owned column Action panel, self-owned Action row and two existing buttons. Panel content
accepts atomic/none and layout-container/row; row actions accepts atomic/none only.
Use Search installed compositions and Composition to install, then Install composition. Search
matches literal title/ref, case-insensitively, with256-character bound; no remote query. Original
Composition selector always exposes installed entries, including current composition when filtered.
Installation opens an independent editable source session; it never inserts a subtree into the
current document. Pending/dirty work uses the existing Cancel switch/Discard changes and open
choice. Installation of the already current source is disabled; explicit Discard restores baseline.
In Layers select Action panel then ArrowRight to expand; repeat for Action row to reach its
buttons. Inspector size/text/properties and Add component/Container/Slot reuse current APIs.
Incompatible family/layout/slot additions fail without graph mutation. Containers have no button
properties/action behavior. Preview remains inert; row/column layout and source labels are projections.
Save locally/Open saved and actual Save As file/Open file retain/reopen applied nested edits
with unchanged exact payload1/2/3/4, identity/revision/source-root and data/history caps. No remote
catalog, template subtree insertion, user descriptor authoring, reparenting or action execution.
Same launch/build/start/browser commands above apply; suite now55 Chromium journeys (50 inherited
plus five WP9). Actual B run38133778952/job114453326488:55 passed46.1s, seven CI gates PASS.
149 editor/composition cases (114+35) and Windows/Ubuntu/frontend quality proof. Review/Closure
reports retain exact traceability and bounded WP9-L1/L2/D1; no universal accessibility/scale claim.

## Station S4 WP10 compatible movement — current operation
Select a non-root node in Layers. Move to container lists existing containers; Move to slot selects
that container's installed slot. Choose Move component to request atomic typed movement. An
incompatible family/layout/occupied slot, root/self/descendant cycle or unknown/stale target rejects
without changing graph/history. Fields pending in Inspector must be applied or Restore fields;
pending replacement also protects movement. Destination ancestors expand, selected identity remains.
The moved node preserves spans, text/properties and component identity. Moving a container carries
its entire subtree: descendants retain their parent references. Graph array order stays unchanged;
destination sibling order follows it, while Move before/after remains a separate sibling operation.
Choosing its existing container/slot is a no-op preserving session revision, history and redo.
Changed movement advances once and shares existing50-entry mixed history; Undo/Redo restore exact
placements. Save changes accepts the mounted session. Save locally/Open saved or actual Save As
file/Open file retain applied topology explicitly. Close/reload starts a new session, explicit reopen
rehydrates it; minimized mounted windows keep their in-memory draft. Native file/local failure and
conflict/replacement protections remain. A requested download is not an automatic filesystem receipt.
Payload1/2/3/4 and minimal schema selection remain: changed topology emitsv2 unless text/properties
requirev3/v4. Existing legacy readers/current exact admission semantics and source-root/revision/
identity/provenance rules remain. Caps:1MiB UTF-8,256 nodes,32 JSON nesting levels,256 graph-token
code points and50 history snapshots. Flat graph ancestry has no independent32-level cap; full
acyclic rooted connectivity is admitted before mutation. Fixed-span preview can clip undersized
nested content; full labels remain in Inspector/Layers/title. No automatic sizing promise.
Production build/run/browser commands above remain. Suite61 actual Chromium journeys (55 inherited,
six WP10 including a short Portuguese-captioned real shell/editor/retention/window video). Browser
recording is test harness presentation only, not product code.121 construction editor cases and151
combined review editor/composition cases, plus seven construction gates/Windows-Ubuntu/frontend
proof. Addendum010 and WP10 review/closure reports trace exact heads/runs; effective closure requires
validated TASK691 merge. WP10-L1/L2/D1 and inherited debt remain. No cross-composition copying,
templates, wider user/remote catalog, arbitrary CSS/actions, File Manager/process/Studio/Core/server.

## Station S4 WP11 artifact workspace — current operation
Launch File Manager from Open applications. Create folders with New folder name/Create folder;
select a folder to navigate. Folder contents lists named compositions and type; selecting a file
shows its logical identity/version/source/schema/component count in the read-only File Inspector.
Editor Artifact workspace has a folder selector, Workspace copy name and Save to workspace.
Apply or Restore pending fields first. A save appends a separately identified version1.0.0 copy;
it preserves the current draft/history and existing per-composition slots. Refresh workspace folders
after another view changes storage; stale snapshots reject instead of silently replacing files.
File Manager Import composition reads a real .composition.json file and validates extension,
native size/read and full installed-source envelope. Export composition downloads the selected
full envelope. Open in editor re-reads the snapshot, decodes the retained file and launches/focuses
the ordinary editor. Dirty/unapplied drafts require Cancel or Discard changes and open. A successful
open initializes the actual fresh source session; close/reopen never replays a consumed handoff.
Refresh failures preserve previous visible contents and block mutation/open until valid refresh.
Corrupt/quota/denied/stale input preserves stored bytes. Navigation/refresh/unmount cancels obsolete
async import targets. Browser-origin key station:artifact-workspace:v1 is separate from window
preferences and legacy slots. Previously opened window preferences can restore File Manager and
read metadata on reload; composition graph opening remains explicit. Portable copies support
independent retention; browser storage can still be cleared, denied or quota-limited.
Caps16 folders including root,48 files,8 folder levels,4MiB total encoded snapshot; each composition
retains1MiB/256 nodes/32 JSON nesting/token256/history50. Whole snapshot/per-file admission is bounded,
not a latency guarantee. Atomic native setItem plus raw-text re-read is best-effort stale detection,
not cross-tab transactional CAS. Append-only: no rename/move/delete/overwrite; WP12 below adds named revisions without Git branches/merges.
Existing production build/start/browser commands apply.159 combined local product cases and68 actual
Chromium journeys (61 inherited +7 workspace), seven construction gates and Windows/Ubuntu/frontend
quality proof. Addendum011/review/closure trace exact heads/runs; TASK696 independently gated.
Bounded WBS30.1.1/30.1.3/30.2.1/30.2.2 and21.3.1/21.3.2 only; WP11-L1/L2/D1 retained.
No server/Core/host filesystem, sync/CAS, generic binary/provider, .process or whole WBS/S4 completion.

## Station S4 WP12 workspace revisions — current operation
The editor's Save workspace revision section appends a new named file under an explicitly chosen
retained logical identity. Apply or Restore pending fields first. Refresh revision targets reads
the actual workspace and clears the old selection/comparison; choose Revision target (the last
retained file for that source-compatible identity). Set Revision file name, optionally Compare
draft with revision, then Save workspace revision. A successful append retains the chosen ID/source/
metadata, advances stable patch version and records predecessor provenance; earlier files remain
immutable. Save preserves applied draft, accepted checkpoint, Undo/Redo and legacy local slots.
Repeated saving requires another refresh/reselection. Save to workspace remains an independent
new identity; portable Save As file remains an independent retained copy/download.
Revision target follows storage order, not greatest SemVer. Explicit import can change it even to
an older version. Invalid/unstable predecessor, unchanged graph, reused version tuple, provenance/
source/identity/metadata mismatch, name/capacity/quota/corrupt/stale failures do not append. Conflict
feedback preserves current draft/history: refresh targets, choose actual head, compare and deliberately
retry, or keep an independent workspace copy/portable file. Retrying does not automatically merge
competing graphs; it prepares the current applied graph against the explicitly selected predecessor.
File Manager File Inspector includes Retained revision and Comparison base. Select a historical or
latest retained file and optionally another same-identity base; comparison shows full-envelope JSON
pointer changes with Before/After literal data. Object keys sort, arrays compare by authored index;
512 changed paths display at most, with explicit truncation. Export both files for complete external
inspection. Selecting/navigation/refresh clears obsolete comparisons. Export composition and Open
in editor use the actual selected revision; dirty/pending Cancel/Discard protection still applies.
New draft/target/replacement invalidates editor comparison. Minimize preserves mounted choices,
close resets them; opening consumes its one-shot handoff. Failed refresh preserves prior visible
snapshot and blocks further mutations/open until valid refresh. Labels and values are inert text.
Original schema1/key,16 folders/48 files/8 folder levels/4MiB snapshot and per-file1MiB/256nodes/
32JSON nesting/token256/history50 caps remain. Native expected-text/head/re-read detects stale
updates best-effort, without transactional cross-tab CAS, synchronization, automatic merge or latency
guarantee. Browser data can be cleared/denied/quota-limited; retain independent portable files.
Production station:build/start and browser config unchanged. Final Construction B and independent
Review both observed75 Chromium journeys (68 predecessors +7 new), seven construction gates and
Windows/Ubuntu/frontend quality; Review166 direct product cases PASS. Closure has its own CI gate.
Addendum012/WP12 PLAN/Review and Closure reports trace exact identities. WP12-L1/L2/L3/D1 and inherited
debt remain. No process/Core/server/host/integrity hashes, whole WBS/H2/S4 or broad browser/accessibility
certification. Bounded WP12 CLOSED only on independently validated TASK701 integration.

## Station S4 WP13 process context — current operation
Launch Process Context from Open applications, or visit /process-context. Refresh composition choices
reads the actual retained workspace. Enter Context title, Process identity, Process revision
identity, Process revision number and Previous process revision where applicable; select up to16 retained
compositions, then Create context. This records a canonical process identity and pinned composition
references; it does not validate business rules or make the process owner available.
The anchor is read-only. Process owner: unavailable remains explicit because no live semantic service
is connected. Each reference shows available/missing/stale/invalid/unavailable; Refresh references
re-reads storage. Only available exact type/id/version can Open referenced composition. Opening
re-resolves and requests the ordinary editor; dirty/unapplied drafts retain Cancel/Discard protection.
Historical references never select latest silently. A corrupt workspace blocks resolution/opening.
Save context locally explicitly retains one context under station:process-context:v1, independently
of unchanged workspace and legacy composition slots. Open retained context explicitly reopens it.
Refresh context storage permits deliberate recovery after another view's update. Same logical context
tuple with changed content rejects; identical re-save allowed and a distinct new identity can explicitly
replace. Invalid/quota/denied/corrupt/stale saves preserve stored bytes; corruption has no hidden repair.
Export context downloads .process.json; Import context validates native extension/size/read and strict
inert codec. Keep pinned composition parts separately: the manifest does not embed or transport them.
Replacement confirms pending/current unretained context loss, Cancel preserves form/context, obsolete
async reads are cancelled. Minimize retains mounted state; close/reload require explicit context reopen.
Caps1MiB UTF8/32JSON depth/16views/ref256/title80 codepoints; one browser-origin slot may clear/deny/quota.
Raw snapshot/re-read detection is best effort, not cross-tab CAS. Per-view bounded whole workspace scan
and codec copies do not establish max-bound latency/memory or universal accessibility certification.
Existing station:build/start and browser configuration apply. B82 actual Chromium journeys1.9m and
independent Review82 journeys1.7m include all75 predecessors and seven new context cases; seven
construction workflows include Windows/Ubuntu/frontend quality, Review193 direct product tests PASS.
Addendum013/PLAN/Review/Closure reports trace evidence. WP13-L1/L2/L3/D1 and inherited debt retained.
Bounded WP13 CLOSED only on independently validated TASK706 merge. No semantic business authoring,
generic multiview Studio (WP14), C10 (WP15), real service journey (WP16), Core/server/host or whole S4.

## Station S4 WP14 shared projections — operation
Process Context uses one admitted context model for Explorer, Context outline/Reference table and Inspector.
Select a process anchor or authored composition reference using Explorer or the active projection;
switching projections preserves qualified selection. Inspector displays read-only logical identity,
pinned revision and current status. Process anchor remains unavailable without a live semantic owner.
Only available composition selections enable Open selected composition; clicking freshly resolves exact
revision through the WP13 adapter before ordinary editor Cancel/Discard protection. Original reference
list remains compatible and derives the same model. No newest-version substitution or semantic mutation.
Refresh references preserves selected identity while updating status; context replacement clears selection.
Minimize preserves mounted state, close/reload resets it and context reopening remains explicit.
No portable envelope/context/workspace schema/key changes or persisted selection. Two source-owned
descriptors/17 items maximum; no remote renderers, timers, generic domain models or C10 Studio.
