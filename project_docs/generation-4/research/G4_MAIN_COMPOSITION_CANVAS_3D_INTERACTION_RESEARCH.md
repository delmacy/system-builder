# G4 — Main Composition Canvas 3D Semantic Interaction Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

Research the interaction grammar, state model, accessibility obligations and performance envelope of a future **Main Composition Canvas 3D** for the System Builder. This artifact does not authorize implementation or select Three.js, React Three Fiber, React Flow, a layout engine, renderer or provider.

Fixed platform boundary:

```text
Application shell / Ribbon / Tool Rail / Inspector / Status Bar
  -> Next.js + React + TypeScript + DOM

Main Composition WorkSurface
  -> projection technology qualified by workload
  -> Three.js / React Three Fiber are research candidates only
```

`3D semantic != 3D decorative`.
`3D mode != mandatory interaction mode`.
`Rendering technology != computation technology`.
`Complex UI != justification for WASM`.
`Semantic identity survives projection changes`.

## 1. Material finding — 3D is a typed semantic projection, not a free spatial editor

The strongest candidate is **guided semantic 3D**, not unrestricted scene authoring. The camera and geometry exist to answer architectural questions, not to create arbitrary spatial truth.

Candidate semantic mapping:

```text
X / horizontal neighborhood
  -> qualified relation/composition neighborhood

Y / vertical floor transition
  -> manifestation / projection across typed system floors

Z / semantic depth
  -> bounded concentric/detail depth chosen by the active surface
```

These axes are interaction conventions, not canonical semantics. A relation exists because the canonical model declares/qualifies it, never because two objects are visually adjacent.

`Visual adjacency != relation`.
`Corridor drawn != semantic compatibility`.
`Vertical alignment != ownership`.
`3D containment != canonical containment`.

The WorkSurface should therefore materialize a `ProjectionScene` from canonical identities and a qualified `ViewportContext`, rather than persist a giant 3D document as system truth.

## 2. Stable shell around the WorkSurface

Candidate desktop grammar:

```text
┌─────────────────────────────────────────────────────────────────┐
│ Global/App Bar                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Collapsible Ribbon: mode + contextual commands                  │
├────────┬──────────────────────────────────────────────┬─────────┤
│ Tool   │                                              │         │
│ Rail   │      Main Composition WorkSurface            │Inspector│
│        │      2D / guided semantic 3D                 │         │
│        │                                              │         │
├────────┴──────────────────────────────────────────────┴─────────┤
│ Status / currentness / revision / activity                      │
└─────────────────────────────────────────────────────────────────┘
```

The Ribbon, Tool Rail, Inspector and Status Bar remain DOM/React even when the center uses WebGL/Canvas. This keeps command discovery, keyboard access, responsive adaptation, text rendering and accessibility independent from scene technology.

### Ribbon modes

Candidate stable mode tabs/groups:

- `2D / 3D` — projection choice, not different semantic identity;
- `FLOOR` — isolate/compare typed floors;
- `MODULE` — module neighborhood and Module Workbox commands;
- `CAPABILITY` — capability manifestations and shafts;
- `CORRIDOR` — handoffs/qualified relation paths;
- contextual groups for `DESIGNED / OBSERVED / CONFORMANCE` overlays.

A collapsed Ribbon must preserve every command through its tab/menu/command-search/shortcut path. `Ribbon collapsed != action unavailable`.

## 3. Guided camera contract

Candidate camera modes:

```text
ISOMETRIC
TOP
FRONT
FLOOR(floorId)
MODULE(moduleId)
CAPABILITY(capabilityId)
CORRIDOR(relation/path identity)
```

Free orbit/pan may exist as a convenience, but **no task may require free-camera skill**. Mature 3D tools demonstrate the value of discrete views, orthographic alignment, frame-all/frame-selected and focal-point orbit. The SB should go further by making semantic camera presets first-class.

Required camera recovery commands:

```text
Frame Selected
Frame Context
Frame Floor
Frame All Disclosed
Return to Previous View
Reset Guided View
```

`Frame All Disclosed` is deliberately disclosure-aware; it must not reveal hidden identities through scene bounds.

Candidate camera states:

```text
CAMERA_STABLE
CAMERA_TRANSITION_REQUESTED
CAMERA_TRANSITIONING
CAMERA_SETTLING
CAMERA_INTERRUPTED
CAMERA_REDUCED_MOTION_JUMP
CAMERA_RECOVERING
CAMERA_FAILED
```

A camera transition never changes selection, canonical identity, revision or authority by itself.

### Reduced motion

With reduced motion enabled, semantic view changes should use immediate/small bounded transforms, cross-fade/static orientation cues where safe, or direct jumps. Meaning must not depend on animated travel through space.

## 4. Semantic zoom contract

Semantic zoom must change representation rather than merely scaling geometry.

Candidate bands:

```text
DISTANT
  silhouette / aggregate / floor occupancy

MEDIUM
  identity + major qualified relations + currentness summary

NEAR
  ports + counters + gates + handoff markers

SELECTED
  bounded scene emphasis + full semantic detail in DOM Inspector
```

Selection is orthogonal to zoom. A selected identity that crosses a LOD boundary remains selected even if its scene representation changes from mesh -> aggregate -> marker.

Critical information has **representation floors**. A blocking gate, unresolved unknown outcome, authority block or critical conformance finding may simplify geometrically, but cannot silently disappear because of LOD. It must retain a marker/aggregate count/textual equivalent appropriate to disclosure.

`LOD omission != semantic absence`.
`Aggregate != deletion`.
`Selected identity != current mesh instance`.

## 5. ModuleNode -> Expanded Module Workbox

Candidate progression:

```text
ModuleNode
  -> selected ModuleNode
  -> expanded Module Workbox
  -> contextual faces / bounded internal composition
  -> open dedicated MODULE workspace (explicit command)
```

`Expanded != opened-in-workspace`.

A Module Workbox is a projection container, not a new canonical owner. Candidate faces are typed by active context rather than fixed decorative cube faces. Examples:

- composition/dependencies;
- capabilities;
- data/exchange;
- runtime/deployment;
- evidence/currentness.

Only faces meaningful to the active lens/surface should materialize. Face rotation must not become the only route to information; Inspector and textual/tree/table projections remain peers.

## 6. Qualified `+` insertion grammar

### Horizontal `+`

A horizontal insertion affordance proposes a relation/composition operation in the current floor/context.

```text
IDLE
 -> RELATION_CANDIDATE
 -> QUALIFYING
 -> ELIGIBLE | INELIGIBLE(reason) | UNKNOWN(needs qualification)
 -> PROPOSED
 -> SUBMITTED
 -> ACCEPTED | REJECTED | UNKNOWN_OUTCOME
 -> EFFECTIVE | PARTIAL | FAILED | RECONCILING
```

`Relation-candidate != compatible`.
`Submitted != accepted != effective`.

### Vertical `+`

A vertical insertion affordance proposes a **manifestation/projection on another typed floor**, not an arbitrary duplicate. It must identify what relation binds the manifestation to the same semantic identity or to a derived identity when the model explicitly requires one.

Examples to qualify later:

- capability manifestation across module/deployment/operations floors;
- designed element -> observed runtime manifestation;
- logical module -> deployment placement projection.

The vertical affordance must never imply that every object is valid on every floor.

## 7. Capability shafts / elevators

A `CapabilityShaft` is a candidate visualization for one semantic capability identity and its permitted manifestations across typed floors.

Candidate states:

```text
COMPLETE
PARTIAL
DESIGNED_ONLY
OBSERVED_ONLY
STALE
DRIFTED
CONFLICTED
UNKNOWN
BLOCKED
RECONCILING
```

The shaft itself is not proof of conformance. It is a navigation/projection aid. Selecting a manifestation must preserve the canonical capability identity while also carrying the selected projection/floor context.

`Same capability across floors != duplicated capability identity`.

## 8. Corridors, doors, counters and gates

These metaphors are acceptable only when backed by typed contracts:

```text
Corridor
  -> qualified relation/path projection

Door
  -> typed boundary/entry point

Counter
  -> interaction/handoff station with declared contract

Gate
  -> validation/authority/policy/effect transition point

Handoff marker
  -> occurrence/transition evidence

Current work-item marker
  -> current occurrence projection, revision/currentness qualified
```

A corridor may be visually connectable while semantically incompatible. Connection affordances therefore require `ELIGIBLE / INELIGIBLE / UNKNOWN` qualification before submission.

## 9. Designed vs observed overlay

Designed and observed are separate evidence planes over shared identity.

Candidate dispositions:

```text
DESIGNED_ONLY
OBSERVED_ONLY
CONFORMANT_OBSERVED
DRIFTED
PARTIAL_OBSERVATION
STALE_OBSERVATION
CONFLICTED
UNKNOWN
UNVERIFIED
```

Never render `observed` as equivalent to `effective desired state`. A designed relation may not exist operationally; an observed runtime relation may be unexpected; observation may be stale or incomplete.

Conformance overlays must be redundant in shape/icon/text/Inspector, not hue alone.

## 10. Selection, focus and direct manipulation

Required independent state dimensions:

```text
hoveredIdentity?
focusedIdentity?
selectedIdentities[]
primaryIdentity?
activeTool
activeCameraMode
activeFloor?
activeLens[]
interactionGesture?
revision/currentness
```

`Selected != focused != hovered != attention`.

Candidate scene interaction states:

```text
IDLE
HOVER
FOCUS_VISIBLE
PRESSED
DRAG_START
DRAGGING
DRAG_OVER_ELIGIBLE
DRAG_OVER_INELIGIBLE
DROP_PENDING
PANNING
ZOOMING
CAMERA_TRANSITIONING
CONTEXT_MENU
ISOLATING
EXPANDING
COLLAPSING
```

Dragging expresses candidate intent only. Every drag operation requires a non-drag path through command/picker/Inspector. Tiny ports must not be the sole interaction target.

## 11. Keyboard and non-spatial equivalent

The WebGL/Canvas scene must not be the accessibility tree for the product's semantics.

Candidate accessibility architecture:

```text
Canonical/qualified projection model
       ├─ 3D scene projection
       ├─ keyboard navigation model
       ├─ Tree/List/Table relation projection
       ├─ Inspector
       └─ announcements/status
```

Keyboard-reachable operations must include:

- move focus among disclosed semantic objects;
- select/toggle/range where meaningful;
- open context actions;
- propose relation via picker instead of drag;
- move between floors via command;
- frame selected/context;
- isolate/unisolate;
- expand/collapse Module Workbox;
- switch 2D/3D/guided views;
- escape/cancel in-progress camera/connection actions.

The equivalent textual/list/table/graph projection must preserve identity and selection handoff. It is not a second canonical model.

## 12. Picking and target semantics

Picking must resolve a stable semantic identity, not expose renderer object identity as product identity.

Candidate chain:

```text
pointer/raycast hit
 -> renderInstanceId
 -> ProjectionIdentity
 -> semanticIdentity + projection context
 -> disclosure/currentness qualification
 -> SelectionContext
```

For dense ports/markers, use larger invisible/equivalent hit regions only when they do not create ambiguous overlaps. Provide DOM/picker alternatives regardless.

## 13. Performance envelope

### Research workloads

NORMAL SCENE:

- 50–200 modules;
- 5–10 floors;
- hundreds of relations/ports/handoffs;
- thousands of simple repeated primitives.

STRESS SCENE:

- approximately 1000 modules;
- aggregation/clustering required;
- labels and fine ports bounded by semantic zoom;
- no requirement to render every primitive simultaneously.

These are qualification scenarios, not capacity promises.

### Candidate optimization order

```text
1. algorithm / data structure / bounded materialization
2. semantic aggregation + clustering
3. virtualization / label budget / bounded rendering
4. instancing + shared geometry/material
5. frustum/viewport culling and LOD
6. render-on-demand when scene is idle
7. off-main-thread layout/analysis in Web Worker
8. renderer-specific tuning
```

WASM is explicitly outside the frontend research path.

### Findings from current candidate documentation

Three.js `InstancedMesh` exists specifically to reduce draw calls for repeated geometry/material. Three.js `LOD` switches representations by distance. React Three Fiber documents on-demand rendering for scenes that can rest and recommends instancing to reduce draw calls; it also warns against expensive mount/unmount churn and unnecessary React state work in frame loops.

Candidate SB implications:

- repeated floor slabs, ports, markers, gates and simple module silhouettes are strong instancing candidates;
- semantic LOD should drive renderer LOD, not vice versa;
- labels should be virtualized/budgeted independently from meshes;
- selected/focused/critical identities need a representation floor even when clusters replace members;
- camera movement may temporarily raise rendering frequency, then return to demand-driven idle;
- layout/route analysis is a better Web Worker candidate than UI semantics or DOM controls;
- do not create one React component/state subscription per primitive if the stress workload proves that pathological.

React Flow's current performance guidance independently reinforces bounded/collapsed graphs, memoized components/functions, avoiding subscriptions to whole frequently-changing node arrays, and simplifying expensive edge/node styling. This is useful as a 2D graph comparator, not a 3D implementation choice.

### Performance states

```text
SCENE_UNINITIALIZED
SCENE_LOADING
SCENE_PARTIAL
SCENE_READY
SCENE_INTERACTIVE
SCENE_DEGRADED_DETAIL
SCENE_RECLUSTERING
SCENE_LAYOUT_PENDING
SCENE_LAYOUT_WORKER_BUSY
SCENE_RECOVERING
SCENE_RENDER_ERROR
```

Performance degradation may lower representation detail but must not change semantic meaning or silently hide critical state.

## 14. Componentes impact

The permanent `Componentes` inventory must include the 3D semantic vocabulary as first-class reusable artifacts and scenarios.

Candidate records:

```text
SemanticViewport
GuidedCameraControl
FloorSelector
ModuleNode3D
ModuleWorkbox
CapabilityShaft
SemanticCorridor
SemanticDoor
HandoffCounter
SemanticGate
PortMarker
CurrentWorkItemMarker
DesignedObservedOverlay
ConformanceOverlay
SceneStatus
SceneSelectionBridge
```

Each record requires:

- function / inputs / outputs / events;
- interaction, semantic, operational and representation states;
- transition scenarios;
- composition lineage and UsedBy;
- 2D/textual equivalent where required;
- keyboard/touch paths;
- reduced-motion behavior;
- dark/light and density behavior for labels/overlays;
- performance scenario envelope;
- accessibility/manual evidence;
- cross-projection identity tests.

Material scenarios include:

```text
select 3D module -> switch TOP -> switch 2D -> identity remains selected
select manifestation -> move floor -> capability identity preserved
relation candidate -> incompatible -> reason exposed -> choose alternate
camera transition -> Escape -> stable prior/nearest guided view
reduced motion -> same semantic navigation without animated travel
LOD transition -> critical gate remains represented
stress clustering -> selected item survives cluster/uncluster
observed overlay becomes stale during review -> currentness visibly requalified
drag relation -> equivalent command path yields same proposal semantics
scene render error -> DOM shell/Inspector and recoverable context survive
```

## 15. Adversarial proof obligations

1. **3D gimmick:** every spatial encoding names the semantic question it helps answer; decorative depth alone is rejected.
2. **Camera loss:** Frame Selected/Context/All Disclosed and guided presets recover orientation without free-camera expertise.
3. **LOD disappearance:** selected, focused, blocking, unknown and critical identities retain an aggregate/marker/textual representation floor.
4. **Identity fracture:** 2D/3D/floor/module/capability/corridor projections use the same semantic identity handoff contract.
5. **Drag-only:** every relation/move/composition gesture has command/picker/keyboard alternative.
6. **Tiny ports:** ports are not the only activation path and pointer targets/hit regions are qualified against ambiguity.
7. **Collapsed Ribbon:** command remains reachable by tab/menu/search/shortcut path.
8. **Focus vs selection:** separate state, styling and keyboard semantics.
9. **False corridor compatibility:** visual connectability never bypasses semantic qualification.
10. **Zoom hides gate:** critical gate has representation floor and Inspector/status equivalent.
11. **Label pollution:** labels obey semantic zoom, collision/budget policy and selection priority.
12. **Stress freeze:** bounded materialization, clustering, instancing and demand rendering are measured before exotic computation.
13. **Disclosure leak:** scene bounds, clusters, labels, counts, picking and Frame All obey the DisclosureEnvelope.
14. **Scene failure:** renderer failure must not destroy draft/selection/canonical state; DOM recovery controls remain usable.
15. **Designed/observed collapse:** conformance state never silently equates intended and observed reality.

## 16. Benchmark translation

### Office / Photoshop

Extract: stable command shell, collapsible command surfaces, contextual commands, compact tool rail, inspector/panels and workspace presets. Do not copy visual trade dress.

### Blender / CAD viewers

Extract: orbit around point of interest, discrete axis views, orthographic alignment, frame selected/all, fit-to-view and local/isolate concepts. SB should constrain these into semantic guided modes rather than expose a professional 3D package as the required interaction model.

### n8n / node editors

Extract: contextual insertion, ports, relation creation, execution overlays and bounded graph navigation. Preserve `visual connectability != semantic compatibility`.

### Canva / Budibase

Extract: progressive disclosure, selection -> quick/contextual actions -> deeper Inspector, component hierarchy and decomposable compositions.

## 17. Candidate decision record

Material candidate decisions from this round:

1. Keep all peripheral shell UI in React/DOM; scope 3D to the WorkSurface.
2. Treat 3D as an optional typed projection over canonical identity, never the only interaction mode.
3. Prefer guided semantic camera modes and recovery commands over free-camera expertise.
4. Make semantic zoom authoritative over representation choice; renderer LOD is subordinate.
5. Give critical/selected/focused identities a representation floor across LOD/clustering.
6. Model horizontal/vertical `+` as qualified proposal grammars, not geometry mutation shortcuts.
7. Treat Module Workbox expansion as projection state, distinct from opening a dedicated workspace.
8. Keep designed/observed/conformance as qualified overlays over shared identity.
9. Require textual/list/table/graph equivalents and non-drag paths.
10. Qualify performance first through bounded materialization, aggregation, instancing, LOD, demand rendering and workers; no WASM UI path.

## 18. Open gaps

Highest-value next research gaps:

1. define the exact **semantic floor taxonomy** and which object kinds may manifest on each floor;
2. define `ProjectionIdentity` / manifestation identity rules so shafts and vertical `+` cannot fabricate sameness;
3. define keyboard spatial-navigation ordering for a scene whose geometry changes under semantic zoom;
4. define clustering rules that preserve selection, critical markers, disclosure and relation counts without leaking hidden membership;
5. build a provider-neutral performance benchmark specification for NORMAL/STRESS scenes, including interaction latency, frame-time percentiles, picking latency, label budget and memory;
6. compare Three.js/R3F scene architecture with a minimal imperative Three.js approach only after those contracts exist.

## Maturity

`MAIN_COMPOSITION_CANVAS_3D = EMERGING / MATERIAL_DELTA`

The 3D interaction grammar is materially clearer, but floor semantics, manifestation identity, clustering/disclosure and measurable performance thresholds remain unsaturated.
