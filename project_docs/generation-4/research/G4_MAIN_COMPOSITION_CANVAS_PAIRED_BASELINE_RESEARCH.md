# G4 — Main Composition Canvas Paired Baseline & Candidate Qualification Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Purpose

Define how a DOM/2D reference surface and a specialized semantic 3D WorkSurface can be compared without rewarding either projection merely for rendering less information or using a different representation technology.

This artifact extends `G4_MAIN_COMPOSITION_CANVAS_PERFORMANCE_BENCHMARK_RESEARCH.md` and `G4_MAIN_COMPOSITION_CANVAS_BENCHMARK_CALIBRATION_RESEARCH.md`. It does not select Three.js, React Three Fiber, React Flow, Playwright, WebGL/WebGPU or any renderer/provider.

Core rule:

```text
Compare semantic task equivalence, not pixel/rendering equivalence.

Same canonical question + same admissible action + same identity/currentness result
!= same geometry, camera work or rendered primitive count
```

## Evidence basis

Primary documentation supports several bounded conclusions:

- Playwright can control browser, viewport, DPR/device characteristics and related context, which makes a declared environment envelope reproducible enough for comparative evidence; this is tooling evidence, not provider selection.
- browser User Timing / Performance APIs support named application spans, which fits semantic operations such as selection-to-Inspector synchronization better than a renderer-only FPS score.
- Three.js exposes renderer-local draw/resource diagnostics. These are useful explanatory counters but cannot be the common comparison authority against DOM/2D.
- WCAG 2.2 requires visible focus, alternatives to dragging and minimum target-size/spacing behavior. A 3D projection cannot claim task equivalence when its only interaction path is a tiny port or drag gesture.
- mature graph-renderer guidance emphasizes avoiding unnecessary re-renders for large graphs. This supports bounded rendering as a general concern, not a reason to prefer 2D or 3D by assumption.

## 1. PairedTaskContract

The comparison unit is a semantic task contract rather than a screenshot or scene.

```text
PairedTaskContract {
  taskId
  canonicalQuestion
  startingSemanticContext
  disclosureEnvelope
  revisionCurrentnessContext
  targetIdentityOrRelation
  admissibleInputPaths[]
  requiredSemanticOutcome
  requiredInspectorOutcome?
  requiredAuthorityDisposition?
  requiredRecoveryOutcome?
  accessibilityEquivalentRequired
  representationSpecificStepsAllowed[]
}
```

A pair is comparable only when both projections answer the same canonical question and reach the same qualified semantic outcome.

`Same click count != same task`.

`Same visual density != same disclosed information`.

## 2. Comparison classes

### CLASS A — directly comparable shared semantic operations

These should use the same fixture, identity and expected semantic result:

- select identity by pointer;
- select identity by keyboard/command path;
- synchronize selection with Inspector;
- search/find and frame/reveal an identity;
- switch floor/projection while preserving semantic identity;
- inspect currentness/revision;
- qualify a relation candidate;
- open context actions;
- toggle Designed/Observed and inspect conformance disposition;
- recover selection/context after representation degradation.

For these operations, compare latency distributions and semantic/accessibility proof using the same `PairedTaskContract`.

### CLASS B — semantically comparable, interaction-path different

Examples:

```text
2D: fit/reveal selected node
3D: Frame Selected + guided camera transition

2D: expand group
3D: expand semantic cluster/workbox

2D: follow edge
3D: follow corridor/shaft projection
```

The semantic destination is comparable; renderer-specific transition cost is recorded separately.

Do not penalize the 3D candidate merely because it performs a camera transition, but do measure whether that transition delays task acknowledgement, causes disorientation or loses identity.

### CLASS C — 3D-only representational affordances

Examples:

- guided `ISOMETRIC/FRONT` camera movement;
- floor separation in depth;
- capability shaft traversal as a spatial projection;
- face-oriented Module Workbox exploration.

These have no artificial DOM/2D twin. They are evaluated for utility, semantic correctness, accessibility equivalence and incremental cost, not against a fabricated 2D latency number.

### CLASS D — 2D/textual accessibility/reference affordances

Examples:

- RelationTable traversal;
- textual manifestations list;
- explicit keyboard target list;
- dense table comparison.

The 3D candidate is not required to recreate these inside WebGL. It must preserve an equivalent reachable path in the stable DOM shell/Inspector.

`Equivalent capability != identical renderer`.

## 3. Information-parity envelope

A fair pair needs a declared information envelope.

```text
InformationParityEnvelope {
  disclosedIdentitySetPolicy
  disclosedRelationSetPolicy
  requiredCriticalMarkers
  requiredCurrentnessSignals
  requiredDesignedObservedSignals
  requiredSelectionContext
  aggregateDisclosurePolicy
  labelPriorityPolicy
}
```

The 2D baseline cannot win by omitting required conformance/currentness information. The 3D candidate cannot claim richer utility by disclosing identities/relations that the paired task does not authorize.

Exact visual simultaneity is not required. Information may be progressively disclosed through Inspector or contextual detail if task completion and discoverability remain equivalent.

## 4. Cost decomposition

For each paired run, separate shared semantic cost from representation-specific cost.

```text
T_total =
  T_input
+ T_semantic_resolution
+ T_selection_context
+ T_projection_materialization
+ T_representation_transition
+ T_inspector_sync
+ T_settle
```

Candidate named spans:

```text
INPUT_TO_SEMANTIC_HIT
SEMANTIC_HIT_TO_SELECTION_CONTEXT
SELECTION_CONTEXT_TO_VISIBLE_ACK
SELECTION_CONTEXT_TO_INSPECTOR
PROJECTION_COMMAND_TO_IDENTITY_REPROJECTED
REPRESENTATION_TRANSITION_TO_SETTLED
```

This prevents a smooth camera from hiding slow semantic selection, and prevents a fast 2D visual acknowledgement from hiding delayed Inspector/currentness synchronization.

## 5. Common proof gates before performance comparison

A pair is not performance-comparable if either projection fails a hard semantic gate:

1. canonical identity is preserved;
2. `selected != focused` remains distinguishable;
3. stale/current and Designed/Observed meaning is preserved;
4. relation-candidate is not shown as compatible without qualification;
5. disclosure rules are equivalent;
6. keyboard/non-drag path exists;
7. focus remains visible and recoverable;
8. critical/UNKNOWN/gate state remains representable;
9. renderer/projection failure does not destroy recoverable draft/context;
10. cancellation is not relabeled as semantic completion.

A semantic failure cannot be compensated by better frame pacing.

## 6. Relative metrics that are legitimate

For CLASS A/B tasks, compare:

- semantic selection latency p50/p95/p99;
- Inspector synchronization latency;
- command-to-semantic-outcome latency;
- projection/floor identity continuity;
- main-thread pressure during the task;
- memory/resource trend under repeated traces;
- recovery latency after induced representation pressure;
- error/unknown/ambiguous disposition correctness.

Frame pacing remains representation-specific supporting evidence. Draw calls/triangles are provider diagnostics and are never compared to DOM node counts as if they were the same unit.

`DOM nodes != draw calls != semantic objects`.

## 7. Utility delta for 3D

A specialized 3D candidate must justify its additional cost through a task-relevant utility claim, not novelty.

Candidate utility claims requiring evidence:

- faster recognition of cross-floor participation;
- clearer manifestation cardinality or shared placement;
- easier tracing of capability shafts/handoffs;
- improved spatial comprehension of deployment/topology context;
- lower context-switch cost between module/floor/corridor scopes;
- better detection of Designed/Observed drift patterns.

Each claim should be tested against a paired task outcome such as completion time, navigation errors, wrong-identity selections, backtracking, recovery actions or subjective disorientation collected as qualified usability evidence.

If no material task utility survives comparison, the 3D representation remains optional and must not become mandatory workflow.

`3D richer-looking != 3D more useful`.

## 8. Candidate maturity gate in Componentes

A renderer/WorkSurface strategy may move from `EXPERIMENTAL` to `CANDIDATE` only with a minimum evidence bundle.

```text
CanvasCandidateEvidenceBundle {
  providerStrategyId
  strategyRevision

  NORMAL_A:
    semanticHardGates
    pairedClassAResults
    pairedClassBResults
    accessibilityEquivalentProof
    reducedMotionProof
    recoveryProof

  NORMAL_B:
    semanticHardGates
    pairedClassAResults
    degradationEvidence
    disclosureEvidence

  STRESS_A:
    boundedOperabilityEvidence
    representationFloorEvidence
    fallbackEvidence

  environments[]
  browserProfiles[]
  knownBounds[]
  unresolvedGaps[]
}
```

Minimum candidate disposition requires:

- no failed semantic/accessibility/disclosure hard gate in the declared support envelope;
- NORMAL-A/B evidence on at least the pinned reference environment and one representative lower device class;
- cross-browser semantic proof for declared supported engines even when performance characterization is pinned to one reference engine;
- reduced-motion and non-drag completion paths;
- explicit degraded/fallback behavior;
- raw vectors and known bounds retained rather than a winner-only score.

This is research maturity for a future provider candidate, not authority to install/adopt it.

## 9. Baseline lifecycle

The DOM/2D baseline is a calibration/reference projection, not a permanent implementation mandate.

A baseline revision changes when semantic task contracts, disclosure rules, fixture revision or shared interaction grammar materially change. Cosmetic changes alone do not automatically invalidate behavioral baseline evidence.

Never update a baseline solely because a candidate regressed.

Record:

```text
baselineRevision
fixtureRevision
pairedTaskContractRevision
environmentProfileRevision
reasonForRebaseline
priorEvidenceDisposition
```

`Rebaseline != erase history`.

## 10. Performance degradation fairness

If the 3D candidate reaches D5/D6 clustering/bounded materialization under STRESS while the 2D baseline uses its own virtualization/aggregation, compare task completion under each projection's declared bounded strategy.

Do not require both to render identical primitive counts. Require both to preserve the same semantic representation floor and disclosure envelope.

A provider that degrades earlier may still qualify if it remains operable within the declared device bound. A provider that preserves fidelity longer but causes interaction lockup may fail.

## 11. Componentes impact

Add paired evidence to relevant records:

```text
PairedScenarioEvidence {
  componentRecordId
  pairedTaskId
  comparisonClass
  baselineRevision
  candidateRevision
  fixtureRevision
  environmentProfileId
  informationParityEnvelopeRevision
  semanticProofDisposition
  accessibilityProofDisposition
  baselineMetricVector
  candidateMetricVector
  representationSpecificCosts
  utilityClaim?
  utilityEvidence?
  bounds[]
}
```

Material `Componentes` playbacks:

- same identity selection in 2D and 3D;
- 2D reveal vs 3D Frame Selected;
- group expansion vs semantic cluster expansion;
- edge-follow vs corridor/shaft navigation;
- same Designed/Observed drift inspection;
- tiny 3D port action completed through DOM/keyboard equivalent;
- reduced-motion 3D transition reaching the same semantic destination;
- both projections under pressure preserving selected/critical/currentness representation floor.

## 12. Adversarial/proof obligations

Reject these comparisons:

- 2D wins because it silently renders less required information;
- 3D wins because it exposes more information than disclosure permits;
- camera animation time is counted as semantic processing without decomposition;
- DOM node count is compared directly with draw calls/triangles;
- a 3D-only affordance gets an invented 2D equivalent merely to produce a score;
- tiny 3D ports are treated as acceptable because picking latency is fast;
- inaccessible 3D action is called equivalent to a keyboard-reachable 2D action;
- selected/focused/currentness semantics differ between projections;
- provider candidate reaches `CANDIDATE` from one powerful machine or one browser;
- baseline is rewritten after regression without preserving lineage;
- 3D visual richness substitutes for demonstrated task utility;
- STRESS comparison demands render-all instead of bounded strategies.

## 13. Research outcome

Material delta:

```text
DOM/2D vs specialized 3D is a paired semantic-task comparison,
not a renderer race.

Shared semantic spans are comparable.
Representation-specific work is measured separately.
3D-only affordances require utility evidence, not fake parity.
Semantic/accessibility/disclosure gates precede throughput claims.
```

## Next highest-value gap

Define a **guided-navigation disorientation/recovery protocol** for the 3D WorkSurface: measurable lost-context conditions, camera-history/backtracking behavior, Frame Selected/Context recovery, floor/module/corridor transitions, reduced-motion equivalents and the boundary at which the system should proactively offer TOP/2D/textual fallback. This should use the paired-task protocol so 3D utility is tested against navigation error and recovery cost rather than visual preference.