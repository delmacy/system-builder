# G4 — Main Composition Canvas Provider-Neutral Performance Benchmark Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Purpose

Define a provider-neutral performance and interaction benchmark for the semantic Main Composition Canvas. This artifact does not select Three.js, React Three Fiber, WebGL/WebGPU, a graph renderer, a worker library, or implementation architecture.

The benchmark exists to prevent a visually fast renderer from passing while semantic identity, critical gates, currentness, accessibility, selection, or recovery are degraded incorrectly.

Core rule:

```text
Canvas performance
= interaction responsiveness
+ bounded representation cost
+ semantic continuity under degradation
+ recoverability

High FPS alone != acceptable Canvas
```

This research follows the fixed frontend direction `Next.js + React + TypeScript`, keeps Ribbon/Tool Rail/Inspector/Status Bar in React/DOM, and treats specialized rendering as restricted to the WorkSurface.

## Evidence basis

Primary documentation supports several mechanisms worth qualifying, without selecting them:

- Three.js `InstancedMesh` exists to reduce draw calls when many objects share geometry/material.
- Three.js `LOD` switches representations according to camera distance and includes hysteresis, useful evidence that geometric detail can be bounded independently of semantic identity.
- Three.js frustum primitives support excluding objects outside the camera view.
- Three.js `Raycaster` is the picking mechanism and returns an `instanceId` for instanced meshes. That id is renderer-local and must never become product identity.
- Web Workers execute work away from the main UI thread and communicate by messages/structured clone or transferables. They are candidates for layout/analysis, not a reason to move canonical UI semantics into a worker.
- browser Performance APIs permit custom marks/measures and observed performance entries. Long-task timing, where supported, treats tasks of 50 ms or more as UI-thread blocking evidence; support varies by browser and therefore cannot be the sole benchmark signal.
- web performance guidance treats interaction latency as input delay + processing + presentation delay; page-level INP is useful external context but is not a sufficient metric for an engineering WorkSurface benchmark.

## 1. Benchmark principle: measure semantic workload, not only render primitives

A scene fixture must record at least:

```text
SemanticSceneProfile {
  canonicalIdentityCount
  moduleCount
  floorCount
  capabilityCount
  relationCount
  portCount
  gateCount
  handoffCount
  currentWorkItemCount
  designedIdentityCount
  observedManifestationCount
  ambiguousMappingCount
  renderedPrimitiveCount
  visibleLabelCount
  candidateLabelCount
  selectedIdentityCount
  criticalMarkerCount
}
```

`RenderedPrimitiveCount` is intentionally separate from semantic object counts. Instancing, clustering and LOD may radically change rendered primitives without changing the modeled system.

## 2. Canonical benchmark profiles

### NORMAL-A — ordinary engineering view

Candidate deterministic fixture:

- 50 modules;
- 5 floors;
- 120 capabilities;
- 250 relations;
- 300 ports;
- 50 gates/handoffs;
- 1,500 simple render primitives before aggregation;
- 150 candidate labels;
- 40 visible labels at the initial camera;
- one selected identity and three critical markers.

### NORMAL-B — upper normal bound

- 200 modules;
- 10 floors;
- 500 capabilities;
- 1,000 relations;
- 1,200 ports;
- 250 gates/handoffs;
- 6,000 simple primitives before aggregation;
- designed/observed overlay with controlled 1:N and N:1 mappings;
- at least 20 stale/unknown/drifted markers;
- one selected identity that moves in and out of the camera frustum during the scenario.

### STRESS-A — aggregation required

- approximately 1,000 modules;
- 10 floors;
- several thousand capabilities/relations/ports;
- at least 20,000 simple primitives before aggregation;
- fan-out hotspots and dense relation corridors;
- designed/observed manifestations materially exceeding logical module count;
- label candidates deliberately exceeding the readable label budget;
- selected, focused and critical identities distributed across clusters.

STRESS is not a requirement to render everything individually. It is a requirement to remain operable through bounded materialization, aggregation and degradation.

### ADVERSARIAL-DISCLOSURE

A fixture includes identities that exist canonically but are outside the active `DisclosureEnvelope`. Exact hidden membership/count must not leak through cluster counts, picking, labels, timing-dependent placeholders or fallback tables.

### ADVERSARIAL-REVISION-DRIFT

During navigation, the selected object remains semantically identifiable while its revision/currentness changes. The benchmark checks that background refresh does not silently relabel stale as current or discard selection/draft context.

## 3. Scenario corpus

Each profile executes the same deterministic interaction corpus where applicable:

```text
COLD_OPEN
  -> FIRST_SEMANTIC_FRAME
  -> READY

READY
  -> POINTER_PICK
  -> SELECTED
  -> INSPECTOR_SYNCED

SELECTED
  -> FRAME_SELECTED
  -> CAMERA_TRANSITION
  -> SETTLED

SETTLED
  -> FLOOR_SWITCH
  -> REPROJECTED_SELECTION

REPROJECTED_SELECTION
  -> 3D_TO_TOP
  -> 2D_EQUIVALENT
  -> 3D_RESTORE

READY
  -> PAN_BURST
  -> ZOOM_BURST
  -> SEMANTIC_LOD_CHANGE

READY
  -> CLUSTER_EXPAND
  -> PICK_MEMBER
  -> CLUSTER_COLLAPSE
  -> MEMBER_SELECTION_RETAINED

READY
  -> DESIGNED_OBSERVED_TOGGLE
  -> OVERLAY_READY

READY
  -> RELATION_CANDIDATE
  -> QUALIFYING
  -> ELIGIBLE | INELIGIBLE | UNKNOWN

READY
  -> CONTEXT_MENU
  -> KEYBOARD_EQUIVALENT_ACTION

READY
  -> SIMULATED_RENDERER_DEGRADED
  -> FALLBACK_REPRESENTATION
  -> RECOVERING
  -> RECOVERED
```

Reduced-motion repeats camera/floor/projection scenarios with travel animation suppressed or materially reduced while preserving destination/context.

## 4. Metric families

### 4.1 Frame pacing

Record distributions, not averages:

- frame interval p50/p95/p99 while idle, pan, zoom and camera transition;
- dropped/over-budget frame ratio;
- longest contiguous jank interval;
- time to stable frame after LOD/cluster transition.

No universal FPS pass threshold is frozen by research. Device class and interaction class must be qualified first. The important initial rule is that p95/p99 and jank bursts are first-class; an average can hide unusable interaction.

### 4.2 Semantic interaction latency

Measure named spans:

```text
pointer-down/up -> semantic hit resolved
semantic hit -> SelectionContext updated
SelectionContext -> visible selected representation
SelectionContext -> Inspector synchronized
keyboard command -> same semantic selection/action state
floor switch -> selection reprojected
projection switch -> equivalent identity available
cluster expand -> requested member pickable
```

Browser INP may be recorded as supporting evidence, but these domain-specific spans are the benchmark authority because they expose where picking, semantic resolution and presentation diverge.

### 4.3 Picking

Record:

- candidate intersection count;
- raycast/picking duration distribution;
- semantic-resolution duration after renderer hit;
- false/no-hit rate for deterministic targets;
- result stability across instancing/re-instancing;
- pointer target alternative availability for tiny ports/gates.

Hard invariant:

```text
renderer instanceId != ProjectionIdentity != ManifestationIdentity != canonical semantic identity
```

Re-instancing may change renderer ids without changing selection.

### 4.4 Camera/navigation

Record command-to-transition-start, transition duration, settle time and focus/selection continuity for `ISOMETRIC`, `TOP`, `FRONT`, `FLOOR`, `MODULE`, `CAPABILITY`, `CORRIDOR`, `Frame Selected`, `Frame Context` and reset/recovery.

A camera animation that is smooth but loses semantic selection fails.

### 4.5 Labels

A label budget must be explicit per semantic zoom band. Candidate priority:

1. selected/focused identity;
2. blocking/critical gate and UNKNOWN outcome;
3. current work item / actionable finding;
4. primary module/capability identity;
5. secondary relation/context labels.

When budget is exceeded, lower-priority labels aggregate or defer. They do not overlap indefinitely or cause selected/critical labels to disappear.

Measure candidate count, materialized count, collision/occlusion pressure, update latency and DOM/renderer label cost separately.

### 4.6 Memory/resource pressure

Record at minimum where observable:

- JS heap trend before/after repeated navigation cycles;
- renderer-reported geometry/texture/resource statistics when a provider exposes them;
- scene object/material/geometry counts;
- retained label nodes/resources;
- worker transfer/copy volume;
- growth after repeated floor/projection switches.

Provider-specific counters are diagnostics, not portable pass criteria.

### 4.7 Main-thread contention

Use custom Performance marks/measures around semantic operations. Where supported, long-task evidence supplements the trace. The benchmark must not depend on Long Tasks API because browser support is incomplete.

Worker experiments compare:

```text
MAIN_THREAD_LAYOUT
vs
WORKER_LAYOUT
```

for analysis/layout only. Measure worker startup, serialization/transfer cost, result latency and main-thread responsiveness. A worker is justified only by measured benefit after algorithmic/bounded-rendering improvements.

## 5. Degradation ladder

Performance pressure should degrade representation in a declared order rather than randomly deleting objects:

```text
D0 FULL_QUALIFIED
D1 LABEL_BUDGETED
D2 RELATION_SIMPLIFIED
D3 REPEATED_PRIMITIVES_INSTANCED/BATCHED
D4 DISTANT_DETAIL_LOD
D5 SEMANTIC_CLUSTERED
D6 BOUNDED_MATERIALIZATION
D7 DEGRADED_2D/TEXTUAL_FALLBACK
```

This ordering is a research candidate, not an implementation mandate. A provider may use different mechanics if the same semantic obligations hold.

### Representation floor

At every degradation level the following remain representable or explicitly surfaced through DOM/Inspector/status fallback:

- current selection;
- keyboard focus;
- blocking/critical gates;
- UNKNOWN effect/outcome where material;
- stale/currentness warning material to the current task;
- active current-work marker;
- disclosure-safe recovery/navigation path.

`LOD omission != semantic absence`.

`Clustered != inaccessible`.

`Offscreen != deselected`.

## 6. Pass/fail is multidimensional

A benchmark run yields a vector rather than one score:

```text
CanvasBenchmarkResult {
  framePacing
  interactionLatency
  picking
  semanticContinuity
  labelDiscipline
  accessibilityContinuity
  disclosureSafety
  recovery
  memoryPressure
  mainThreadPressure
}
```

A renderer with excellent frame pacing but failed semantic continuity does not pass.

Candidate dispositions:

```text
QUALIFIED
QUALIFIED_WITH_BOUNDS
DEGRADED_BUT_OPERABLE
INCOMPLETE_EVIDENCE
FAILED_SEMANTIC_CONTINUITY
FAILED_ACCESSIBILITY_CONTINUITY
FAILED_DISCLOSURE
FAILED_RESPONSIVENESS
FAILED_RECOVERY
```

Do not collapse these into a single green/red performance badge.

## 7. Proof obligations

Every candidate renderer/scene strategy must demonstrate:

1. selection survives LOD changes, clustering, frustum exit/re-entry and re-instancing;
2. cross-projection identity survives `3D -> TOP -> 2D -> 3D`;
3. selected/focused/critical markers retain a representation floor;
4. cluster counts and labels obey disclosure policy;
5. tiny 3D ports/gates have keyboard/DOM alternatives;
6. drag operations have non-drag alternatives;
7. reduced-motion preserves navigation semantics without requiring camera travel;
8. ribbon/context commands remain reachable while Ribbon is collapsed;
9. semantic incompatibility cannot be made to look compatible by corridor geometry;
10. background refresh/currentness drift does not silently erase dirty/selected context;
11. renderer failure does not destroy canonical draft/selection and permits fallback/recovery;
12. cancellation of layout/render work is not reported as semantic completion;
13. a stress fixture remains operable even when individual rendering is intentionally replaced by aggregation.

## 8. `Componentes` impact

The permanent `Componentes` surface should host benchmarkable records/scenarios for:

- `SemanticViewport`;
- `ModuleNode3D`;
- `ModuleWorkbox`;
- `CapabilityShaft` / aggregate shaft stop;
- `SemanticCorridor`;
- `SemanticGate` / `PortMarker` / handoff marker;
- `GuidedCameraControl`;
- `FloorSelector`;
- `ProjectionIdentityBridge`;
- `CrossProjectionSelectionBridge`;
- `DesignedObservedOverlay`;
- `SceneCluster`;
- `SemanticLODRepresentation`;
- `LabelBudgetController`;
- `RendererFallbackBoundary`.

Material scenarios include NORMAL-A/B and bounded slices of STRESS-A, with recorded state transitions and evidence. `Componentes` metadata records semantic fixture revision, benchmark profile, environment/device class and evidence class; a preview is not a separate production implementation.

## 9. Provider qualification shape

Three.js / React Three Fiber remain candidates because their ecosystem exposes scene graph, picking, instancing, LOD and demand-driven rendering patterns. Qualification must compare at least:

- semantic mapping ergonomics;
- React lifecycle/update cost;
- picking behavior;
- instancing/batching;
- LOD/culling support;
- render-on-demand suitability;
- label strategy;
- worker/layout integration;
- instrumentation;
- bundle/runtime cost;
- SSR/RSC boundary behavior;
- recovery/disposal/resource lifecycle;
- autonomous generated-system dependency closure, if any generated runtime ever uses a specialized renderer.

`Renderer candidate != frontend platform decision`.

`Rendering technology != computation technology`.

## 10. Open thresholds

This round intentionally does not invent universal hardware/FPS/memory thresholds. Before freezing gates, research must define representative device classes and repeatable browser/viewport profiles. Thresholds then follow observed task usability and comparative baselines.

Candidate evidence tiers:

```text
LAB_REFERENCE
MAINTAINER_DESKTOP
MIDRANGE_INTEGRATED_GPU
CONSTRAINED_DEVICE
```

Cross-browser support must be recorded; unsupported Performance API entry types are `NOT_AVAILABLE`, not a benchmark failure by themselves.

## 11. Adversarial outcomes

The benchmark explicitly fails these patterns:

- FPS optimized by hiding semantically critical objects;
- picking returns a renderer-local id that changes semantic selection;
- average FPS looks good while p99 interaction stalls;
- LOD removes a selected or blocking gate without fallback;
- clustering leaks hidden exact membership;
- labels become the dominant DOM/render cost;
- worker transfer overhead exceeds the computation saved;
- camera remains smooth while Inspector/currentness lags behind;
- renderer crash destroys work recoverable outside the WorkSurface;
- stress scene freezes because every canonical object is materialized;
- visual degradation changes designed/observed or stale/current meaning.

## 12. Research outcome

Material delta:

```text
Performance qualification is not renderer throughput qualification.
It is semantic interaction qualification under bounded representation pressure.
```

The next highest-value gap is to define the repeatable device/browser matrix and threshold-calibration method, then compare at least one DOM/2D baseline and one specialized 3D candidate using the same semantic fixture and interaction trace. Only measured hotspots may justify workers or lower-level rendering specialization.