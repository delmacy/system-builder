# G4 — Main Composition Canvas Navigation, Disorientation & Recovery Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Purpose

Research a bounded navigation and recovery grammar for the semantic 3D Main Composition Canvas. The problem is not how to make a general-purpose 3D editor. The problem is how to let a user inspect and compose a system spatially without losing semantic identity, task context, currentness, revision or an accessible path back to a known state.

This artifact extends `G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md`, `G4_MAIN_COMPOSITION_CANVAS_FLOOR_IDENTITY_RESEARCH.md`, `G4_MAIN_COMPOSITION_CANVAS_PERFORMANCE_BENCHMARK_RESEARCH.md` and `G4_MAIN_COMPOSITION_CANVAS_PAIRED_BASELINE_RESEARCH.md`.

It does not select Three.js, React Three Fiber, a camera-control package or any renderer.

Core rule:

```text
Camera state != semantic context != selection != focus.

User can lose the camera
without losing semantic identity or task state.

Recovery must restore orientation
without fabricating semantic state.
```

## Evidence basis

Evidence classes used in this round:

- Blender primary navigation documentation: point-of-interest orbit, discrete axis-aligned navigation, Frame All, Frame Selected, Local View and cancellable navigation operations;
- Autodesk primary viewer documentation: Home/reset, ViewCube standard/isometric orientations, Fit to View, orbit around a focal point and pan;
- WCAG/WAI primary guidance: focus visible/not obscured and motion animation from interactions/reduced-motion behavior;
- HCI/wayfinding research: layout complexity increases navigation errors/time; global/local landmarks have different wayfinding roles; richer visibility can create false affordance; 2D and 3D navigation aids can support different strategies; guided/actionable navigation can outperform richer but more interpretive spatial representations under demanding conditions.

Portable conclusion: mature 3D tools expose strong recovery primitives because disorientation is a normal failure mode of spatial navigation. The System Builder should go further and make semantic recovery first-class because the WorkSurface represents qualified engineering meaning rather than arbitrary geometry.

## 1. Navigation is a state machine, not free camera motion

Candidate navigation state dimensions:

```text
NavigationContext {
  semanticAnchorIdentity?
  selectedIdentitySet[]
  focusedControlIdentity?
  projectionMode
  floorContext?
  moduleContext?
  capabilityContext?
  corridorContext?
  activeLenses[]
  revisionCurrentnessContext
  disclosureEnvelope

  cameraMode
  cameraPose
  pointOfInterest?
  semanticZoomBand
  isolateScope?
  transitionState
  recoveryState
}
```

`cameraPose` is disposable representation state. `semanticAnchorIdentity`, selection, revision/currentness and disclosure are not.

Candidate camera modes remain:

```text
ISOMETRIC
TOP
FRONT
FLOOR
MODULE
CAPABILITY
CORRIDOR
```

Free orbit/pan/zoom may exist as bounded inspection gestures, but they do not create a new semantic mode and cannot be required to complete a task.

### Camera transition states

```text
STABLE
TRANSITION_REQUESTED
TRANSITIONING
SETTLING
SETTLED
CANCELLED
INTERRUPTED
RECOVERY_REQUESTED
RECOVERING
RECOVERED
DEGRADED
FALLBACK_OFFERED
```

Rules:

- semantic selection is committed independently of camera settlement;
- cancelling camera travel does not cancel the semantic selection that caused it unless the action contract explicitly says so;
- a new navigation command may supersede an in-flight camera transition, but the supersession must not erase semantic history;
- renderer/camera failure leaves DOM shell, Inspector and recoverable semantic context intact;
- reduced-motion may replace `TRANSITIONING` with an immediate projection jump while preserving the same semantic destination.

## 2. Orientation anchors

The WorkSurface needs stable orientation anchors that survive camera movement and representation changes.

Candidate anchor hierarchy:

```text
SYSTEM
WORKSPACE / TASK
FLOOR
MODULE
CAPABILITY
CORRIDOR / RELATION
SELECTED IDENTITY
CURRENT WORK ITEM
```

An anchor is not necessarily a visible object. It is a semantic reference from which a useful view can be resolved.

Candidate always-reachable DOM orientation controls:

- current projection/mode label;
- current floor/context breadcrumb;
- selected semantic identity summary;
- `Frame Selected`;
- `Frame Context`;
- `Frame Floor`;
- `Home / System Overview`;
- `Previous View` / `Next View` when history exists;
- `Show in TOP` / `Show in 2D`;
- `Open textual equivalent`;
- camera orientation indicator / guided-view picker.

Autodesk's ViewCube is evidence for persistent orientation feedback plus standard/isometric view recovery. Blender's Frame Selected/Frame All is evidence for explicit re-framing. The SB should extract the grammar, not copy appearance.

## 3. Semantic camera history

A raw stack of matrices is insufficient. Recovery history should store semantic intent plus a bounded pose hint.

```text
SemanticViewCheckpoint {
  checkpointId
  semanticAnchorIdentity?
  projectionMode
  floorContext?
  moduleContext?
  capabilityContext?
  corridorContext?
  activeLenses[]
  semanticZoomBand
  revisionCurrentnessContext
  disclosureQualification
  cameraMode
  poseHint?
  createdBy
  createdAt
}
```

Candidate `createdBy` values:

```text
EXPLICIT_NAVIGATION
FRAME_SELECTED
FRAME_CONTEXT
FLOOR_SWITCH
MODE_SWITCH
FOLLOW_RELATION
FOLLOW_SHAFT
OPEN_MODULE
ISOLATE
RECOVERY
```

Do not add a history entry for every wheel tick or pan pixel. History represents meaningful navigation decisions.

### History restoration qualification

Restoring an old checkpoint is not permission to restore old disclosure or stale semantic truth.

```text
checkpoint requested
-> re-resolve semantic identity
-> re-evaluate disclosure
-> re-evaluate revision/currentness
-> resolve current projection
-> restore admissible camera framing
```

Possible outcomes:

```text
RESTORED_EXACT
RESTORED_REPROJECTED
RESTORED_WITH_CURRENTNESS_CHANGE
RESTORED_WITH_REDACTION
ANCHOR_NOT_MATERIALIZED
ANCHOR_NO_LONGER_DISCLOSED
ANCHOR_SUPERSEDED
AMBIGUOUS_RESTORE
FAILED_RESTORE
```

`History != time travel authority`.

## 4. Lost-context model

Do not infer that a user is lost from one gesture. Treat disorientation as qualified evidence assembled from observable navigation behavior.

Candidate `NavigationRecoverySignal` inputs:

```text
repeatedHomeOrFrameActions
rapidModeOscillation
rapidFloorOscillation
backtrackCount
cameraReversalCount
selectionNotVisibleDuration
focusedIdentityNotRepresentedDuration
repeatedSearchForSameIdentity
repeatedUndoViewActions
failedPickCount
emptyViewportAfterNavigation
criticalAnchorOutsideRepresentationFloor
explicitUserRecoveryRequest
```

These are product-interaction signals, not business truth and not user-performance scoring.

Candidate dispositions:

```text
ORIENTED
RECOVERY_OPPORTUNITY
LIKELY_DISORIENTED
RECOVERY_IN_PROGRESS
RECOVERED
UNKNOWN
```

No opaque scalar "lostness score" should silently control the user. A threshold, if later adopted, must be evidence-based, explainable and testable.

### Hard lost-context conditions

Regardless of heuristics, the UI has an immediate recovery obligation when:

- selected semantic identity exists but no longer has any visible/announced representation and no fallback is exposed;
- focus moves to a WorkSurface target that becomes fully obscured/unrepresented;
- a mode/floor transition lands in a projection where the anchor cannot be resolved and the UI provides no explanation;
- LOD/clustering removes a critical selected/gate/UNKNOWN marker without aggregate or Inspector continuity;
- renderer degradation leaves the WorkSurface blank while the shell still has recoverable semantic state.

## 5. Recovery ladder

Recovery should be progressive rather than abruptly throwing the user to a global overview.

Candidate ladder:

```text
R0 — ACKNOWLEDGE
  keep semantic selection and Inspector stable

R1 — FRAME SELECTED
  frame current selected identity or its qualified aggregate

R2 — FRAME CONTEXT
  frame the smallest semantic context that explains the selection

R3 — FRAME FLOOR / MODULE / CORRIDOR
  return to a typed guided view

R4 — PREVIOUS SEMANTIC VIEW
  restore the previous qualified checkpoint

R5 — TOP / 2D PEER PROJECTION
  preserve semantic identity while simplifying spatial interpretation

R6 — TEXTUAL / TREE / TABLE / GRAPH EQUIVALENT
  preserve the task without requiring 3D navigation

R7 — SYSTEM HOME
  broadest disclosed overview; selection remains retained in Inspector when admissible
```

The system may offer a recovery action proactively, but should not silently change semantic selection or task scope.

`Recovery suggestion != forced camera takeover`.

## 6. Proactive recovery affordance

Candidate unobtrusive `OrientationRecoveryChip` appears when evidence crosses a qualified recovery condition.

Possible actions:

```text
Frame selected
Return to previous view
Show floor
Show TOP
Switch to 2D
Open list/table
```

The chip should explain the cause where useful, e.g. `Selected module is outside the current floor projection` or `Selected gate is inside a collapsed cluster`.

Anti-patterns:

- animated rescue camera without user activation;
- auto-switching floors while the user is editing;
- changing selection to whatever object is nearest the camera;
- forcing Home after a failed pick;
- hiding recovery behind hover-only controls;
- treating repeated recovery use as evidence of user incompetence.

## 7. Guided camera grammar

### ISOMETRIC

Purpose: system/module spatial comprehension with stable up direction.

- bounded orbit around semantic point of interest;
- axis snap available;
- roll should normally be absent from the primary interaction grammar;
- `Frame Selected` and `Frame Context` always available.

### TOP

Purpose: low-disorientation overview and 2.5D relation inspection.

- candidate recovery destination from complex perspective views;
- preserves floors/semantic depth through explicit encodings rather than perspective alone;
- useful bridge to pure 2D peer projection.

### FRONT

Purpose: floor participation/vertical manifestation inspection.

- prioritizes floor/shaft readability;
- horizontal panning and bounded zoom;
- no requirement for free orbit.

### FLOOR

Purpose: one typed floor plus relevant cross-floor context.

- current floor remains named in DOM;
- adjacent floors may appear dimmed/aggregated if disclosure permits;
- vertical `+` and shaft transitions are explicit commands.

### MODULE

Purpose: selected ModuleNode/Workbox inspection.

- camera is anchored to module identity, not world coordinates;
- expand/collapse does not equal open dedicated workspace;
- face navigation has DOM/keyboard equivalents.

### CAPABILITY

Purpose: trace one capability's qualified participation/manifests.

- shaft may become primary spatial guide;
- branches/aggregates preserve cardinality qualification;
- capability identity remains stable while floor manifestations change.

### CORRIDOR

Purpose: inspect one qualified relation/handoff path.

- path traversal is stepwise and bounded;
- each gate/counter/handoff has textual equivalent;
- visual corridor never implies semantic compatibility.

## 8. Selection, focus and camera

Hard rules:

```text
SELECTED != FOCUSED != FRAMED != CAMERA_ANCHOR
```

Examples:

- keyboard focus may be on `Frame Selected` while a module remains selected;
- camera may frame a floor while a capability remains selected in Inspector;
- hovering a relation may temporarily emphasize it without changing semantic selection;
- `Frame Context` changes camera anchor but not canonical selection;
- a selection can remain valid while offscreen.

For keyboard operation, focus remains in the DOM control/navigation model or an explicit accessible WorkSurface interaction model. Camera travel must not make the focused control disappear behind author-created UI. WCAG 2.2 focus-visible/not-obscured obligations remain applicable to shell controls and peer representations.

## 9. Reduced motion

Camera animation is representation, not semantic proof.

When `prefers-reduced-motion` or an equivalent product preference is active:

```text
semantic command
-> immediate or near-immediate view resolution
-> optional opacity/detail transition if non-disorienting
-> selection/Inspector update
-> announcement of destination/context
```

Do not require animated travel to communicate that a floor/module/corridor changed. WAI guidance explicitly supports suppressing non-essential motion animation triggered by interaction.

Candidate reduced-motion proof scenarios:

- `Frame Selected` resolves without flight animation;
- FLOOR -> MODULE preserves identity with immediate camera change;
- shaft traversal changes floor/context without vertical travel animation;
- recovery from lost context does not animate through intermediate geometry;
- semantic zoom does not require scale-travel animation to expose a new representation.

## 10. Landmarks and representation floor

Wayfinding research supports landmarks, but also shows that more visibility is not automatically better and that environment complexity increases errors/time. Therefore the SB should use a small stable landmark vocabulary rather than exposing the whole scene as orientation aid.

Candidate global landmarks:

- floor planes/labels;
- selected semantic identity beacon (non-color redundant);
- current Module Workbox anchor;
- capability shaft anchor when in CAPABILITY mode;
- current corridor start/end anchors;
- System Home/orientation indicator.

Candidate local landmarks:

- gate/counter identifiers;
- relation/handoff markers;
- module-face labels;
- selected manifestation marker.

`Landmark salience != semantic importance`.

Critical gates, UNKNOWN outcomes, stale/currentness warnings and selected/focused identity belong to the representation floor even when ordinary labels/details are reduced.

## 11. Navigation complexity budget

The 3D WorkSurface should not expose every possible navigation mechanism simultaneously.

Candidate default grammar:

```text
Primary:
  select
  Frame Selected
  guided mode switch
  floor switch
  bounded orbit/pan/zoom
  Home / Frame Context

Secondary:
  isolate
  follow shaft/corridor
  previous/next semantic view
  face navigation

Expert/optional:
  freer orbit controls
  saved viewpoints
  advanced projection settings
```

Free-flight/walk navigation is not a default System Builder requirement. Blender exposes it for large scenes, but the SB's semantic engineering task does not justify making first-person locomotion part of normal operation.

## 12. Performance implications

Recovery is itself a performance contract.

Candidate measures:

```text
T_RECOVERY_COMMAND_TO_VISIBLE_ACK
T_RECOVERY_COMMAND_TO_SEMANTIC_REPROJECTED
T_RECOVERY_COMMAND_TO_SETTLED
T_FALLBACK_TO_2D_READY
T_SELECTED_OFFSCREEN_TO_FRAME_SELECTED
```

Stress-scene requirements:

- `Frame Selected` must not require materializing the entire scene;
- semantic anchor lookup must operate independently of render-instance identity;
- recovery can target an aggregate/cluster while preserving selected identity in Inspector;
- Home/Frame Context should use bounded scene metadata rather than an O(N) synchronous main-thread reconstruction where avoidable;
- label recovery prioritizes selected/context/critical markers before ordinary labels;
- a degraded renderer can hand off to 2D/textual projection without discarding semantic selection.

A stress scene that maintains FPS but makes recovery slow/unreliable is not qualified.

## 13. Componentes impact

Candidate permanent inventory records:

```text
GuidedCameraController
CameraModePicker
OrientationIndicator
SemanticViewHistory
PreviousViewAction
NextViewAction
FrameSelectedAction
FrameContextAction
FrameFloorAction
SystemHomeAction
OrientationRecoveryChip
ProjectionFallbackAction
SelectedOffscreenIndicator
SemanticAnchorBeacon
FloorLandmark
CorridorEndpointLandmark
ReducedMotionCameraPolicy
NavigationRecoveryBoundary
```

Each record needs FUNCTION -> STATE -> TRANSITION -> COMPOSITION -> CONSISTENCY -> REPRESENTATION -> ACCESSIBILITY -> PERFORMANCE evidence.

### Material scenario set

```text
NAV-01 select offscreen identity -> Frame Selected -> same semantic identity
NAV-02 3D -> TOP -> 2D -> 3D -> selection/currentness preserved
NAV-03 FLOOR A -> MODULE -> FLOOR B -> Previous View -> qualified restore
NAV-04 camera transition interrupted by new Frame Selected command
NAV-05 selected node clustered by LOD -> recovery frames aggregate but Inspector retains exact identity
NAV-06 selected identity no longer disclosed -> recovery explains redaction; never jumps to neighbor
NAV-07 revision changes during camera transition -> destination requalified; stale/current explicit
NAV-08 reduced-motion Frame Selected -> no spatial flight, same destination
NAV-09 renderer degraded -> 2D fallback -> selection/draft retained
NAV-10 focus-visible remains distinct from selected during camera operations
NAV-11 corridor traversal reaches incompatible/blocked gate -> no visual implication of compatibility
NAV-12 repeated backtracking -> recovery affordance offered, never forced
NAV-13 Home reset -> task selection retained unless user explicitly clears it
NAV-14 history checkpoint restored after floor no longer materializable -> retained semantic anchor + fallback
NAV-15 stress scene -> recovery latency bounded without render-all
```

## 14. Adversarial findings / proof obligations

| Adversarial | Required proof |
| --- | --- |
| user gets lost in camera | explicit Frame Selected/Context/Home plus semantic history and 2D/text fallback |
| object disappears under LOD | selected/critical representation floor or qualified aggregate + Inspector continuity |
| same object gets new identity after mode switch | semantic identity invariant across ProjectionIdentity/render instance changes |
| focus and selection become indistinguishable | independent visual/programmatic states and scenarios |
| tiny 3D target is only path | DOM/list/command equivalent and target-size qualification |
| ribbon collapsed hides recovery | recovery commands remain reachable by menu/search/shortcut/peer control |
| reduced motion removes meaning | same semantic destination and announcements without camera travel |
| camera history restores stale authority/disclosure | requalification on restore; history never restores permission |
| recovery changes selection silently | prohibited; selection mutation must be explicit |
| stress scene makes Frame Selected expensive | bounded anchor lookup/materialization proof |
| rich 3D visibility increases confusion | stable landmark budget + progressive disclosure; more visibility is not assumed better |
| 3D navigation utility does not beat simpler projection | 3D remains optional; paired baseline determines utility delta |

## 15. Candidate maturity implications

The semantic 3D WorkSurface should not advance beyond `EXPERIMENTAL` merely because NORMAL/STRESS frame pacing is acceptable.

Navigation/recovery candidate evidence must include:

```text
semanticIdentityContinuity
selectionFocusSeparation
cameraModeStateMatrix
semanticViewHistoryQualification
FrameSelectedRecovery
FrameContextRecovery
HomeRecovery
2DTextualFallback
reducedMotionRecovery
rendererFailureRecovery
revisionCurrentnessDriftRecovery
disclosureChangeRecovery
stressRecoveryLatency
lostContextAdversarialRuns
```

Candidate maturity remains:

```text
FUNCTIONALLY_DEFINED
-> STATE_DEFINED
-> COMPOSITION_VALIDATED
-> ACCESSIBILITY_VALIDATED
-> VISUALLY_REFINED
-> STABLE
```

Visual polish of camera easing, landmark styling or orientation widgets cannot substitute for these earlier gates.

## 16. Findings classification

### Evidence

- Mature 3D tools expose explicit orientation/recovery operations such as Frame Selected, Frame All, Home, Fit to View and preset orientations.
- Blender explicitly notes Frame All/Frame Selected as recovery when users become lost in 3D space.
- Autodesk ViewCube exposes persistent viewpoint feedback and standard/isometric recovery.
- WCAG/WAI requires visible focus and supports disabling non-essential interaction-triggered motion.
- Wayfinding studies show navigation performance depends on environment complexity, landmarks and representation strategy; richer visibility/3D does not guarantee better wayfinding.

### Candidate decisions

- semantic view history rather than raw camera-history authority;
- guided camera modes as primary navigation grammar;
- explicit recovery ladder from Frame Selected through 2D/textual fallback;
- stable orientation landmarks with bounded visual budget;
- proactive but non-forcing recovery affordance;
- reduced-motion semantic jumps;
- recovery latency included in performance qualification.

### Trade-offs

- too much automatic guidance can reduce user control and mask the actual spatial model;
- too little guidance makes the 3D projection expensive cognitively;
- preserving semantic selection while resetting camera can surprise users unless Inspector/breadcrumbs explain it;
- semantic history costs more qualification logic than a raw matrix stack but avoids restoring stale disclosure/currentness assumptions.

### Open gaps

1. Calibrate which navigation signals reliably indicate disorientation without invasive user profiling.
2. Define whether semantic view history is local/session-only, workspace-persisted or selectively saved by the user.
3. Test the recovery ladder against NORMAL-A/B and STRESS-A fixtures.
4. Compare TOP/2D fallback against continued guided 3D for complex corridor/shaft tasks.
5. Define announcement grammar for camera/projection transitions without screen-reader noise.
6. Determine landmark density budgets under semantic zoom and label virtualization.

## 17. Sources

Primary/product documentation:

- Blender Manual — 3D Viewport Navigation: https://docs.blender.org/manual/en/latest/editors/3dview/navigate/navigation.html
- Blender Manual — navigation overview: https://docs.blender.org/manual/en/latest/editors/3dview/navigate/index.html
- Autodesk Viewer — Model Viewing Toolbars: https://help.autodesk.com/cloudhelp/ENU/Collab-Home/files/using-the-viewer/Design_Collab_Viewing_Toolbar.html
- Autodesk Viewer — Home and ViewCube: https://help.autodesk.com/cloudhelp/ENU/Coord-Models/files/models-viewing-toolbar/Model_Coord_Viewcube.html
- W3C WAI — WCAG 2.2 Focus Visible / Focus Not Obscured / Animation from Interactions and reduced-motion techniques: https://www.w3.org/WAI/WCAG22/understanding/

Research evidence:

- Darken & Sibert, *A Theoretical Model of Wayfinding in Virtual Environments: Proposed Strategies for Navigational Aiding*, Presence 8(6), 1999, DOI 10.1162/105474699566558.
- Roberts, *Role of Landmark Size and Location in Way-finding and Spatial Cognition in Virtual Environments*, 2009, DOI 10.1177/154193120905302709.
- Slone et al., *Floor Plan Connectivity Influences Wayfinding Performance in Virtual Environments*, Environment and Behavior 47(9), DOI 10.1177/0013916514533189.
- Parush et al., *Overall Visibility Might Offer False Affordance to Indoor Wayfinding: The Role of Global and Local Landmarks*, 2022, DOI 10.1177/1071181322661435.

These sources qualify interaction grammar and failure modes only. They do not select a renderer, camera library or product implementation.

## Research disposition

`MAIN_COMPOSITION_CANVAS_NAVIGATION_RECOVERY = EMERGING / MATERIAL_DELTA`

This round materially changes the Canvas qualification model by making disorientation/recovery, semantic view history and recovery latency explicit proof domains rather than treating camera navigation as a cosmetic renderer concern.

No implementation authority follows from this research.