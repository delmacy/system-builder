# G4 — Main Composition Canvas Collaborative Presence, Follow & Review Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no product implementation authority
Branch: `research/g4-product-rnd-foundations`
Date: 2026-09-22

## Purpose

Research collaboration over the semantic Main Composition Canvas when multiple users inspect the same system while holding different authorization, disclosure, revision/currentness, projection and local navigation contexts.

This extends the 3D Canvas, navigation recovery, saved-view and portable deep-link research. It does not select realtime transport, presence provider, CRDT/OT library, renderer, persistence mechanism or collaboration backend.

## Fixed boundaries

- `Shared semantic reference != shared synchronized truth`.
- `Presence != authority`.
- `Presence != canonical model membership`.
- `Presenter camera != follower semantic context`.
- `Follow mode != remote control`.
- `Same deep link != same disclosed scene`.
- `Same semantic identity != same admissible representation`.
- `Remote selection != local selection != local focus`.
- `Remote cursor != semantic identity proof`.
- `Review anchor != mutable screen coordinate`.
- `Participant count != disclosed object count`.
- `Camera synchronization != revision synchronization`.
- `Renderer synchronization != semantic synchronization`.
- `3D mode != mandatory collaboration mode`.

The repository remains authoritative. Collaboration state is a projection/coordination aid and never silently becomes canonical business or architecture state.

## Evidence and benchmark grammar

### Miro attention management

Miro exposes a useful collaboration distinction: a participant can explicitly follow another collaborator's view; direct local interaction such as moving the cursor, zooming or clicking exits that follow relationship. Miro also exposes `Bring everyone to me` and `Bring a specific collaborator to my view`, while availability depends on role/access. Its presentation mode lets participants join a presenter view, move away, and return to the presenter.

Portable grammar for SB:

- following must be explicit and visible;
- local navigation can suspend/break following without destroying the user's semantic context;
- presenter attention guidance and participant authority are separate;
- follow/presentation eligibility remains access-qualified;
- a participant needs an obvious `Return to presenter`/`Resume follow` path.

This is interaction evidence, not adoption of Miro behavior or branding.

### Autodesk shared-view boundary

Autodesk Viewer/Construction Cloud evidence reinforces that a shareable visual reference and access to richer project/collaboration data are separate capabilities. Shared model views can be distributed as links, while access to embedded issues/markups or project data depends on account/subscription/product context. For SB this reinforces `share reference != share authority/evidence/disclosure`.

## Collaboration context model

A participant needs independently qualified context:

```text
ParticipantViewContext {
  participantRef
  sessionPresenceRef
  semanticAnchorRef?
  localSelectionRef?
  localFocusRef?
  projectionIntent
  floor/module/capability/corridor context?
  activeLenses[]
  semanticZoom
  revisionQualifier
  currentnessQualifier
  disclosureContextRef
  navigationState
  followState
  presenterRef?
  rendererState?          // local/diagnostic only
}
```

No field above grants business authority. `participantRef` and `sessionPresenceRef` are not interchangeable: reconnect may create a new presence occurrence while preserving user identity.

## Presence state machine

Candidate presence states:

```text
ABSENT
JOINING
PRESENT
PRESENT_IDLE
PRESENT_ACTIVE
PRESENT_BACKGROUND
STALE_PRESENCE
RECONNECTING
DISCONNECTED
LEFT
UNKNOWN
```

Presence must carry an observation/currentness basis. A stale remote cursor must not continue to look live after connectivity loss.

Presence is intentionally weaker than collaboration capability:

```text
PRESENT != CAN_EDIT
PRESENT != CAN_SEE_MY_SELECTION
PRESENT != CAN_FOLLOW
PRESENT != CAN_PRESENT
PRESENT != SAME_REVISION
```

## Selection, focus and remote attention

The Canvas now needs at least four distinct concepts:

```text
localFocus
localSelection
remoteSelection(participant)
attentionTarget(presenter/session)
```

Rules:

1. remote selection never steals local keyboard focus;
2. remote selection never overwrites local semantic selection merely because follow mode is active;
3. a presenter may suggest an attention target, but the follower resolves that target under local disclosure/currentness;
4. multiple remote selections aggregate without making the 3D scene unreadable;
5. hidden remote targets cannot leak identity, label, count, topology or geometry through presence markers;
6. `selected != focused != followed != presented` remains true in 2D, 3D and textual equivalents.

## Follow model

Candidate follow states:

```text
NOT_FOLLOWING
FOLLOW_AVAILABLE
FOLLOW_REQUESTED
FOLLOWING_QUALIFIED
FOLLOWING_WITH_LOCAL_DIVERGENCE
FOLLOW_SUSPENDED_BY_LOCAL_INPUT
FOLLOW_BLOCKED_BY_DISCLOSURE
FOLLOW_BLOCKED_BY_REVISION
FOLLOW_DEGRADED_TO_EQUIVALENT
FOLLOW_RECONNECTING
FOLLOW_ENDED
```

A follower does not consume raw presenter camera transforms as authority. The presenter emits a qualified semantic attention intent:

```text
PresenterAttentionIntent {
  presenterRef
  semanticAnchorRef?
  projectionIntent?
  scopeIntent?
  floor/module/capability/corridor intent?
  semanticZoomIntent?
  cameraHint?               // disposable
  revision/currentness hint
  emittedAt
}
```

Follower resolution:

```text
ATTENTION_RECEIVED
-> PRESENTER_IDENTITY/SESSION QUALIFIED
-> TARGET SEMANTICALLY RESOLVED
-> LOCAL AUTHORIZATION/DISCLOSURE REQUALIFIED
-> LOCAL REVISION/CURRENTNESS QUALIFIED
-> PROJECTION ELIGIBILITY QUALIFIED
-> LOCAL REPRESENTATION MATERIALIZED
-> CAMERA HINT APPLIED IF SAFE/USEFUL
-> FOLLOWING_QUALIFIED | DEGRADED | BLOCKED
```

`Follow mode != pixel mirroring`.

## Cross-disclosure behavior

Two users opening the same semantic link may legitimately see different representations.

Example:

```text
Presenter: capability X + deployment manifestations + observed drift
Follower A: capability X + deployment manifestations, observed evidence redacted
Follower B: capability X only, deployment floor unavailable
Follower C: semantic target not disclosable
```

The collaboration layer must not manufacture parity. Candidate dispositions:

```text
SAME_SEMANTIC_TARGET_EQUIVALENT_DISCLOSURE
SAME_TARGET_DIFFERENT_PROJECTION
SAME_TARGET_REDACTED_DETAIL
TARGET_RETAINED_AS_NONSPATIAL_EQUIVALENT
TARGET_NOT_DISCLOSABLE
TARGET_AMBIGUOUS_LOCALLY
TARGET_SUPERSEDED_LOCALLY
REVISION_DIVERGED
CURRENTNESS_DIVERGED
```

A follower must not be told enough detail to infer a hidden target when policy forbids existence disclosure. A generic `Presenter is viewing content unavailable in your context` may be safer than exposing its name/floor/neighbor count.

## Revision/currentness divergence

Collaboration does not imply one global revision.

Candidate participant relation states:

```text
REVISION_ALIGNED
REVISION_COMPATIBLE_DIFFERENT
REVISION_DRIFTED
REVISION_SUPERSEDED
CURRENTNESS_ALIGNED
CURRENTNESS_DIFFERENT
CURRENTNESS_UNKNOWN
OBSERVATION_STALE
```

A presenter moving to a newly revised object while a follower is reviewing an older qualified revision must not silently advance the follower's review. Candidate behavior:

```text
FOLLOWING
-> REMOTE_REVISION_CHANGED
-> COMPATIBILITY_QUALIFYING
-> FOLLOW_CONTINUES_REPROJECTED
 | FOLLOWING_WITH_LOCAL_DIVERGENCE
 | FOLLOW_BLOCKED_BY_REVISION
```

The Status Bar/Inspector should explain divergence. `Remote latest != local review authority`.

## Presenter and follower camera grammar

The guided camera vocabulary remains `ISOMETRIC / TOP / FRONT / FLOOR / MODULE / CAPABILITY / CORRIDOR`.

Presenter camera transmission is only a representation hint. The follower may:

- use the same guided mode when locally admissible;
- frame the same semantic anchor using different geometry;
- remain TOP/2D because 3D is unavailable or reduced-motion/user preference selects a peer projection;
- resolve directly without animated travel under reduced motion;
- show a textual/list/table/graph equivalent when spatial representation is unavailable.

A presenter must never force free-camera movement as a condition of collaboration.

## Local divergence and recovery

Following must preserve autonomy. Local pan/zoom/select/focus/context-menu or projection switch can enter `FOLLOW_SUSPENDED_BY_LOCAL_INPUT` or `FOLLOWING_WITH_LOCAL_DIVERGENCE` according to the interaction contract.

The shell should expose:

```text
Resume follow
Return to presenter
Keep my view
Stop following
Frame presenter's disclosed target
```

Returning to presenter re-runs semantic/disclosure/currentness qualification; it does not replay a stale camera matrix.

## Review anchors and annotations

Review collaboration requires semantic anchors, not screen coordinates.

Candidate anchor:

```text
ReviewAnchor {
  anchorId
  semanticIdentityRef
  optional manifestation/projection qualifier
  revisionQualifier
  currentnessAtCreation
  evidenceRef?
  authorRef
  createdAt
  anchorSchemaVersion
  representationHint?       // disposable
}
```

A review anchor can become:

```text
CURRENT
REPROJECTED
REVISION_DRIFTED
SUPERSEDED
AMBIGUOUS
REDACTED
MISSING
HISTORICAL_ONLY
```

A comment marker attached to a 3D face/port must resolve to the semantic target or qualified subtarget. Geometry changes must not silently move it to the nearest face.

`Review anchor != mutation authority` and `comment agreement != accepted/effective system change`.

## Ribbon / shell implications

Candidate DOM/React shell commands:

- `People` / presence list;
- `Follow…`;
- `Present view`;
- `Bring attention` where authorized;
- `Resume follow` / `Return to presenter`;
- `Show remote selections` preference;
- `Review anchors`;
- `Compare participant context` only when disclosure-safe;
- contextual indicator for `Revision differs`, `Currentness differs`, `Projection differs`.

Ribbon collapse must not remove access to active follow/presenter state or the command to leave it. Status Bar should retain collaboration/follow/revision divergence visibility.

## Semantic 3D representation

Remote presence must remain lightweight:

- do not render one full 3D avatar per participant;
- remote cursor is optional and projection-local;
- remote semantic selection should use bounded non-color-only emphasis and participant label only where allowed;
- multiple selections may collapse into a count/stack only when count itself is disclosable;
- presenter target receives attention emphasis distinct from local selection/focus;
- clustering/LOD must preserve the local user's selected/focused identity and disclose remote activity only within budget.

`Remote attention accent != operational status color`.

## Accessibility

Collaboration must be fully operable without the 3D WorkSurface.

Required peer representations include:

- People/presence list;
- `Follow` and `Return to presenter` controls reachable by keyboard;
- textual announcement when presenter target changes, qualified to what the follower may know;
- remote-selection summary in Inspector/Activity rather than relying on cursor color;
- review-anchor list/table with target, author, revision/currentness and disposition;
- no requirement to track moving cursors visually;
- reduced-motion follow that jumps/reframes without camera flight;
- predictable focus: follow changes semantic attention but does not steal focus unless the user explicitly invokes a navigation command that moves it.

## Performance research

Collaboration introduces a second load dimension beyond scene size: `scene complexity × participant activity`.

NORMAL collaboration fixture candidate:

```text
50-200 modules
5-10 floors
hundreds of relations/ports/handoffs
thousands of simple primitives
5-15 present participants
<= 5 concurrently active navigation/selection streams
```

STRESS collaboration fixture candidate:

```text
~1000 modules with aggregation/clustering
25-50 present participants
10-20 active navigation/selection streams
burst of remote selections/presence updates
```

Research metrics:

```text
T_REMOTE_INTENT_TO_QUALIFIED_ACK
T_REMOTE_SELECTION_TO_DISCLOSED_REPRESENTATION
T_FOLLOW_COMMAND_TO_SEMANTIC_ALIGNMENT
T_LOCAL_INPUT_TO_FOLLOW_SUSPENSION
T_RECONNECT_TO_PRESENCE_REQUALIFIED
remote-update main-thread budget
presence-update coalescing/drop rate
scene invalidations caused by collaboration
label/remote-marker budget
```

Candidate performance rules:

1. coalesce/drop superseded cursor/camera hints before semantic events;
2. never drop authority/currentness/revision divergence events merely to preserve animation smoothness;
3. remote camera hints must not trigger render-all;
4. presence updates should not invalidate unrelated scene subtrees;
5. semantic selection/review anchors have stronger delivery value than high-frequency cursor telemetry;
6. background participants should not consume active-cursor rendering budget;
7. Web Worker remains a candidate only for qualified heavy layout/analysis; presence synchronization itself does not justify WASM or frontend polyglot.

## Componentes inventory impact

Candidate reusable records:

```text
PresenceAvatar
PresenceList
PresenceCurrentnessBadge
RemoteSelectionMarker
RemoteSelectionSummary
PresenterIndicator
FollowParticipantAction
FollowStateIndicator
ReturnToPresenterAction
LocalDivergenceNotice
ParticipantRevisionBadge
ParticipantCurrentnessBadge
DisclosureDivergenceNotice
ReviewAnchorMarker
ReviewAnchorList
ReviewAnchorInspector
CollaborationStatusBarSegment
RemoteAttentionBeacon
CollaborationRecoveryBoundary
```

Each requires full state/transition matrices rather than visual variants alone.

Material Componentes scenarios:

1. follow participant -> semantic target changes -> follower reprojects same identity;
2. follower pans -> follow suspended -> Resume follow;
3. presenter target hidden from follower -> generic disclosure-safe notice;
4. presenter 3D / follower TOP 2D -> semantic alignment preserved;
5. presenter current / follower stale review revision -> divergence explicit;
6. remote selection never steals local focus;
7. selected local object remains selected while presenter changes target;
8. remote participant disconnects -> stale marker removed/qualified;
9. review anchor survives 3D -> 2D -> textual projection;
10. review anchor target superseded -> no nearest-object substitution;
11. reduced-motion follow performs direct semantic reframe;
12. renderer failure while following -> non-3D equivalent remains usable;
13. 50 participants -> remote markers budgeted without losing local critical state;
14. reconnect -> presence and follow context requalified rather than blindly resumed;
15. presenter switches revision during active review -> follower not silently advanced;
16. ribbon collapsed -> leave/resume follow remains reachable;
17. hidden remote selection does not leak label/count/topology;
18. local keyboard-only user follows and exits follow without pointer/drag.

## Adversarials and proof obligations

### A. Pixel-mirroring masquerades as semantic follow

Failure: follower consumes raw camera transform and ends looking at empty/wrong geometry because local disclosure/layout differs.

Proof: same semantic attention intent resolves correctly with different local projection geometry.

### B. Remote selection steals local state

Failure: presenter's selection overwrites follower selection/focus.

Proof: local selection/focus survive remote attention changes unless the user explicitly adopts the target.

### C. Collaboration leaks hidden topology

Failure: remote cursor/selection/count reveals an object or relation the follower cannot disclose.

Proof: remote presence events pass disclosure qualification before representation; hidden targets use non-revealing disposition.

### D. Revision drift becomes silent synchronization

Failure: presenter advances to revision R+1 and follower's active review silently changes.

Proof: revision/currentness divergence is first-class and follow may degrade/block without mutating review authority.

### E. Follow traps the user

Failure: camera continuously snaps back after local exploration.

Proof: local navigation suspends/diverges follow and `Keep my view`/`Stop following` are always reachable.

### F. 3D collaboration becomes inaccessible

Failure: collaboration requires tracking colored moving cursors or free-camera travel.

Proof: keyboard People/Follow controls, textual announcements, review lists and non-spatial projections provide equivalent collaboration tasks.

### G. Presence overload freezes scene

Failure: high-frequency cursor/camera streams invalidate the full scene under STRESS.

Proof: telemetry is bounded/coalesced; semantic events remain responsive; local selection/gates/currentness preserve representation floor.

### H. Reconnect resurrects stale follow

Failure: follower reconnects and resumes an old presenter target under changed permission/revision.

Proof: reconnect requalifies presenter session, target, disclosure, revision/currentness and projection before resuming.

## Maturity

`MAIN_COMPOSITION_CANVAS_COLLABORATION = EMERGING / MATERIAL_DELTA`.

This round materially adds cross-user semantics to the 3D Canvas without creating a shared synchronized truth. Presence, follow, remote selection, presenter attention, revision divergence and review anchors are now separate contracts.

## Next highest-value gap

Research **collaborative mutation intent and conflict boundaries** without selecting a CRDT/OT/provider: how two users can concurrently propose arrangement, qualified relations, vertical manifestations or review-driven changes while preserving `proposal != accepted != effective`, canonical ownership, revision preconditions, partial acceptance, conflict/rebase/reconcile and undo provenance. The key question is where collaboration can remain optimistic UI coordination and where semantic mutation must return to canonical authority/revision checks.