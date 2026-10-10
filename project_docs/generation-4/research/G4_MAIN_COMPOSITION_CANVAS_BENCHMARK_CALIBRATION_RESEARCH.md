# G4 — Main Composition Canvas Benchmark Environment & Threshold Calibration Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Purpose

Refine `G4_MAIN_COMPOSITION_CANVAS_PERFORMANCE_BENCHMARK_RESEARCH.md` with a repeatable environment matrix and a method for calibrating performance thresholds without inventing one universal FPS target.

This artifact remains provider-neutral. It does not select Three.js, React Three Fiber, Playwright, WebGL/WebGPU, a worker library, browser engine, GPU class, CI machine or implementation architecture.

The governing rule is:

```text
Threshold
= task + semantic fixture + interaction trace + environment class + reference baseline + evidence distribution

Threshold != one global FPS number
```

The benchmark must preserve semantic continuity, accessibility and disclosure before throughput optimization can qualify a candidate.

## Evidence basis

Primary browser/tooling documentation supports the following research conclusions:

- `requestAnimationFrame()` normally follows the display refresh rate, and displays commonly run at 60, 75, 120 or 144 Hz. Therefore raw frame interval is partly a property of the display/browser environment; a fixed `60 FPS` gate would confound renderer work with refresh-rate configuration.
- Playwright can repeat a test across Chromium, Firefox and WebKit projects and can explicitly control viewport, device scale factor, touch/mobile characteristics and related browser context. This is evidence that the environment envelope can be reproducibly declared, not a provider-selection decision.
- WebGL availability depends on both browser and GPU capabilities. GPU/driver strings exposed by `WEBGL_debug_renderer_info` may be unavailable under privacy settings, so exact renderer identity is diagnostic metadata rather than a mandatory benchmark prerequisite.
- Three.js exposes renderer statistics such as draw calls, triangles, points, lines and resource counters. These are useful provider diagnostics, not portable pass/fail semantics.

## 1. BenchmarkEnvironmentProfile

Every benchmark result must bind to an explicit environment record rather than an informal machine name.

Candidate research shape:

```text
BenchmarkEnvironmentProfile {
  environmentProfileId
  evidenceTier

  osFamily
  osVersion?
  architecture

  cpuClass
  logicalProcessorCount?
  memoryClass

  gpuClass
  gpuIdentity?          // optional diagnostic only
  gpuDriverIdentity?    // optional diagnostic only
  acceleratedRendering: YES | NO | UNKNOWN

  browserEngine
  browserChannel
  browserVersion

  rendererBackend?      // provider-specific diagnostic
  webglVersion?         // if applicable

  viewportWidth
  viewportHeight
  deviceScaleFactor
  displayRefreshHzObserved

  pointerClass
  touchAvailable
  keyboardAvailable

  reducedMotion
  colorScheme
  zoomScale

  powerMode: AC | BATTERY | UNKNOWN
  thermalState: NOMINAL | WARM | THROTTLED | UNKNOWN

  backgroundLoadClass
  networkProfile

  benchmarkHarnessRevision
  semanticFixtureRevision
  scenarioCorpusRevision
}
```

Exact GPU/driver identity is intentionally optional because browser privacy controls may suppress it. Missing debug renderer metadata is `NOT_AVAILABLE`, not benchmark failure.

## 2. Device/evidence classes

The earlier evidence tiers are refined into workload classes rather than named consumer hardware models.

### LAB_REFERENCE

Purpose: comparative engineering baseline under controlled conditions.

Properties:

- fixed machine or pinned hosted runner where practical;
- AC power;
- known browser versions;
- background workload minimized;
- fixed viewport/DPR;
- repeated runs;
- thermal warm-up recorded;
- no artificial CPU/GPU throttling in the authoritative baseline.

This tier is best for detecting regressions between revisions/providers. It is not evidence that ordinary user hardware is adequate.

### MAINTAINER_DESKTOP

Purpose: realistic primary development workstation evidence.

The exact machine is recorded, but the class is not defined by that one machine. Results are useful for product-development feedback and comparative traces, not as the sole release threshold.

### MIDRANGE_INTEGRATED_GPU

Purpose: candidate ordinary floor for the engineering workspace.

Class characteristics should be frozen later from observed target users, not from a vendor/model name. Candidate qualification dimensions are CPU generation/per-core class, memory band, integrated/shared-memory GPU class and available accelerated browser rendering.

### CONSTRAINED_DEVICE

Purpose: determine graceful degradation and fallback boundaries, not require full D0 representation.

The expected outcome may legitimately be `DEGRADED_BUT_OPERABLE` with earlier clustering/LOD/2D fallback while preserving semantic/accessibility obligations.

### SOFTWARE_OR_ACCELERATION_CAVEAT

New adversarial class. If hardware acceleration is unavailable or the browser reports a major performance caveat, the test should determine whether the WorkSurface can enter an explicit degraded/fallback mode. It must not silently freeze, lose work or pretend full 3D qualification.

`No accelerated 3D != no usable Builder`.

## 3. Browser matrix

Cross-browser qualification should separate semantic correctness from throughput characterization.

Candidate matrix:

```text
SEMANTIC / ACCESSIBILITY MATRIX
  Chromium family
  Firefox
  WebKit

PERFORMANCE CHARACTERIZATION MATRIX
  one pinned reference engine/channel for longitudinal comparison
  + representative Firefox run
  + representative WebKit run
  + branded Chromium run only where product support requires it
```

The same semantic fixture and scenario trace must be used where browser capability permits it.

A browser lacking a non-essential performance telemetry API receives `METRIC_NOT_AVAILABLE`; it does not automatically fail the Canvas. Failure occurs when required user-facing semantics, interaction, accessibility, recovery or declared browser support fail.

Browser-version changes invalidate environment equivalence for longitudinal performance comparison unless re-baselined.

## 4. Viewport / DPR matrix

Performance and label pressure depend materially on pixel area and DPR, so viewport is part of the benchmark contract.

Candidate profiles to calibrate empirically:

```text
DESKTOP_COMPACT   1280 x 720  @ DPR 1
DESKTOP_STANDARD  1440 x 900  @ DPR 1
DESKTOP_DENSE     1920 x 1080 @ DPR 1
HIGH_DPI          1440 x 900  @ DPR 2
```

These are candidate benchmark profiles, not product minimum requirements.

The important rule is that DPR cannot be omitted from a performance claim. `1440x900 @ 2` can require materially more raster work than `1440x900 @ 1`.

Responsive UX proof remains separate: Ribbon/Tool Rail/Inspector availability and alternate action paths must also be tested at narrower widths, but a narrow viewport is not automatically a meaningful 3D throughput benchmark.

## 5. Refresh-rate normalization

Because animation callbacks generally track display refresh rate, benchmark reports should record observed refresh cadence and express frame evidence in two forms:

```text
absolute frame interval distribution (ms)
+
refresh-budget utilization / missed-refresh evidence
```

Do not compare a 60 Hz run and a 144 Hz run as if `FPS` were an environment-independent score.

For deterministic longitudinal comparison, the reference environment should keep display/virtual display refresh configuration stable where possible.

Camera transitions must be time-based, not frame-count-based; otherwise high-refresh displays can change motion speed and invalidate interaction equivalence.

## 6. Warm-up, repetition and sampling

One run is insufficient evidence.

Candidate protocol:

1. load the fixture and wait for declared semantic readiness;
2. execute one non-recorded warm-up trace to populate expected caches/JIT/provider initialization;
3. return to a deterministic initial state;
4. execute at least 5 recorded repetitions for NORMAL profiles during exploratory research;
5. use more repetitions when variance is high rather than averaging it away;
6. record every repetition and aggregate median plus tail distributions;
7. preserve first-run/cold-start evidence separately because warm performance cannot hide startup cost;
8. abort/reclassify runs with uncontrolled background load or thermal throttling rather than silently mixing them into the baseline.

The exact repetition count remains calibratable; `5` is an initial research floor, not a statistical guarantee.

## 7. Threshold calibration method

Thresholds should be derived in stages.

### Stage A — semantic hard gates

These do not become looser on slower hardware:

- semantic identity survives projection/LOD/clustering/re-instancing;
- selected/focused/critical representation floor survives degradation;
- disclosure does not leak hidden membership;
- keyboard/non-drag equivalents remain available;
- reduced-motion preserves task completion;
- stale/UNKNOWN/designed/observed meanings remain intact;
- renderer failure preserves recoverable work/context;
- cancellation is not reported as semantic completion.

Any failure here is a semantic/accessibility/disclosure failure, not a performance trade-off.

### Stage B — reference baseline

Run the same fixture and trace on the pinned LAB_REFERENCE environment for:

```text
DOM/2D baseline
specialized 3D candidate
```

The DOM/2D baseline is not expected to provide identical representation. It supplies reference latency for shared semantic operations such as selection, Inspector synchronization, command execution and floor/projection context changes.

Compare deltas for shared operations instead of demanding equal renderer cost.

### Stage C — task usability envelope

For each interaction family, derive candidate latency bands from measured traces plus human task evaluation:

- pointer/keyboard selection;
- Inspector synchronization;
- command invocation;
- floor/projection switch;
- cluster expansion;
- camera frame/focus;
- fallback/recovery.

Do not derive a single Canvas latency threshold. A camera settle operation and a selection acknowledgement have different user expectations and semantic criticality.

### Stage D — environment floor

Repeat NORMAL-A/B on MIDRANGE_INTEGRATED_GPU. If the full representation exceeds the usability envelope, exercise the declared degradation ladder. Qualification can still succeed as `QUALIFIED_WITH_BOUNDS` when the degraded representation remains semantically and accessibly complete.

### Stage E — stress qualification

STRESS-A is evaluated for bounded operability, not full-fidelity throughput. It must prove that the system reaches clustering/bounded materialization/fallback without interaction lockup or semantic loss.

### Stage F — regression guard bands

After enough stable baseline runs exist, establish per-metric guard bands from observed variance. A future revision is a regression candidate when its distribution moves materially outside the established band.

Do not freeze arbitrary percentages before variance is known.

## 8. Absolute threshold vs relative regression

Two independent questions must be answered:

```text
ABSOLUTE USABILITY
Can the user complete the task acceptably on the qualified device class?

RELATIVE REGRESSION
Did this revision materially worsen a previously qualified environment/profile?
```

A candidate can be faster than the previous revision and still be unusable. It can also remain within an acceptable absolute envelope while exhibiting a regression worth investigation.

Therefore:

`Faster than baseline != qualified`.

`Within absolute envelope != no regression`.

## 9. Controlled throttling

Synthetic CPU/network throttling is useful for adversarial diagnosis but should not define the authoritative hardware class. Emulation cannot manufacture a representative GPU or thermal/power envelope.

Use controlled throttling to answer questions such as:

- does semantic selection remain correct under main-thread pressure?
- does cancellation/recovery remain reachable?
- does a delayed Inspector incorrectly show old currentness as current?
- does fallback activate coherently?

Record throttling configuration as part of the environment. Never compare a throttled trace against an unthrottled baseline without qualification.

## 10. Renderer/provider diagnostics

Provider-specific counters are permitted as explanatory evidence only.

For a Three.js candidate, examples include draw calls, triangle/point/line counts and renderer resource counters. They help explain why a trace changed but do not become System Builder semantics or universal gates.

GPU renderer/vendor strings, when available, are similarly diagnostic. Browser privacy settings can suppress them.

The portable benchmark authority remains user-visible interaction spans plus semantic/accessibility/disclosure/recovery obligations.

## 11. Performance state model

The WorkSurface needs explicit performance states rather than an invisible quality knob:

```text
NOMINAL
PRESSURE_DETECTED
DEGRADING_REPRESENTATION
DEGRADED_OPERABLE
FALLBACK_TRANSITION
FALLBACK_2D_TEXTUAL
RECOVERING
RECOVERED
UNRECOVERABLE_RENDERER_ERROR
```

Transitions must preserve selection/currentness/revision context where disclosure still permits it.

Examples:

```text
NOMINAL
 -> PRESSURE_DETECTED
 -> DEGRADING_REPRESENTATION
 -> DEGRADED_OPERABLE

DEGRADED_OPERABLE
 -> FALLBACK_TRANSITION
 -> FALLBACK_2D_TEXTUAL

FALLBACK_2D_TEXTUAL
 -> RECOVERING
 -> RECOVERED
```

A quality reduction is not a semantic state change. The Status Bar/Inspector may expose that representation is degraded without implying that the underlying system is degraded.

`Renderer degraded != system degraded`.

## 12. Componentes impact

Add benchmark environment/scenario metadata to the `Componentes` research model:

```text
BenchmarkEvidence {
  componentRecordId
  scenarioId
  semanticFixtureRevision
  scenarioCorpusRevision
  environmentProfileId
  browserEngine
  browserVersion
  viewport
  deviceScaleFactor
  observedRefreshHz
  evidenceClass
  repetitions
  coldStartEvidence
  warmEvidence
  degradationLevel
  semanticProofDisposition
  accessibilityProofDisposition
  performanceDisposition
}
```

Material playback scenarios include:

- same semantic selection at DPR 1 and DPR 2;
- same trace across Chromium/Firefox/WebKit;
- high-refresh camera transition with identical semantic destination;
- accelerated renderer unavailable -> explicit fallback;
- pressure -> degradation -> recovery without identity loss;
- cold-start vs warmed scene;
- constrained device reaching D5/D6 while selected/critical identities remain reachable.

Evidence from one environment must not silently become evidence for every environment.

## 13. Adversarial/proof obligations

This calibration layer must reject:

1. `60 FPS` treated as a universal truth without recording refresh rate/environment;
2. benchmark run without viewport/DPR/browser version;
3. one powerful developer machine used as proof of product adequacy;
4. one cold or warm run used as a stable distribution;
5. privacy-hidden GPU identity treated as failure;
6. synthetic CPU throttling claimed to represent a real GPU class;
7. provider-specific draw-call count promoted to product-level success;
8. cross-browser telemetry absence confused with user-facing failure;
9. STRESS requiring render-all instead of bounded degradation;
10. degraded renderer state shown as degraded business/system state;
11. performance optimization changing semantic identity/currentness/disclosure;
12. baseline update that erases a regression without explicit evidence/review.

## 14. Candidate qualification record

A comparison should preserve raw vectors rather than a winner-only label:

```text
CanvasQualificationComparison {
  fixtureRevision
  scenarioCorpusRevision
  environmentProfile

  baseline2D
  candidate3D

  semanticContinuity
  accessibilityContinuity
  disclosureSafety
  recovery

  framePacing
  interactionLatency
  pickingLatency
  inspectorSyncLatency
  cameraLatency
  labelPressure
  memoryPressure
  mainThreadPressure

  degradationReached
  variance
  regressionDelta
  disposition
  bounds[]
}
```

A 3D candidate may be qualified only for NORMAL-A/B and bounded by device class. Such a result is preferable to claiming universal support without evidence.

## Research outcome

Material delta:

```text
Benchmark reproducibility requires an environment contract.
Performance thresholds are calibrated per task/profile and evidence class,
while semantic/accessibility/disclosure obligations remain hard gates.
```

This closes the immediate gap left by the provider-neutral performance benchmark: the research now has a repeatable environment vocabulary and a threshold-calibration method without fabricating one FPS target.

## Next highest-value gap

Run the model conceptually against a **paired baseline protocol**: define which semantic operations are legitimately comparable between DOM/2D and specialized 3D, which are 3D-only, and how to avoid rewarding the 2D baseline simply for rendering less information. Then define the minimum evidence bundle required before a renderer/provider can move from `EXPERIMENTAL` to `CANDIDATE` in `Componentes`.