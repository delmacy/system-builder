# G4 — Web Desktop Window Lifecycle & Shell Contracts Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Frontend Design System & UI Foundation / Web Desktop & Application Environment
Date: 2026-09-22

## Purpose

Bounded research into the shell-level contract for `Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`, with emphasis on lifecycle, focus/selection, browser visibility, resource suspension, restore/recovery and accessible tab/window interaction.

This artifact does not authorize frontend implementation or select a synchronization/runtime technology. It refines interaction and state contracts that later implementation planning must satisfy.

## Evidence classes

### E1 — web-platform evidence

Current browser platform evidence establishes that document visibility is distinct from focus. A document may become hidden because its browser tab/window is backgrounded or minimized; browsers may stop `requestAnimationFrame` and throttle timers for background documents. Therefore SB cannot infer semantic application/window state from browser scheduling or visibility alone.

BroadcastChannel is evidence that same-origin browsing contexts can exchange messages, but it defines transport only: it does not define SB ordering, authority, durability, conflict resolution, recovery or canonical state. Storage partitioning also bounds where it can communicate.

### E2 — accessibility interaction evidence

WAI-ARIA APG explicitly separates focus from selection. For tabs, automatic activation is recommended only when panel activation is effectively immediate; otherwise manual activation with Enter/Space avoids making keyboard focus traversal incur latency. Composite widgets should expose predictable keyboard navigation and a visible focus indicator distinct from selected state.

### E3 — existing G4 architectural constraints

Existing G4 research already requires `Client != Workspace != Desktop != Application != Window`, `Window lifecycle != runtime lifecycle`, `Close/minimize UI != stop service`, `Desktop presence != app loaded`, `Browser tab != SB tab`, `Display Surface != Workspace`, `SELECTED != FOCUSED`, and projection/UI state not becoming business truth.

## Finding 1 — shell lifecycle needs independent axes

A single `OPEN/CLOSED` or `ACTIVE/INACTIVE` state is insufficient. Research candidate:

```text
WindowExistence      = NOT_OPEN | OPEN
WindowPresentation   = VISIBLE | OCCLUDED | MINIMIZED | DETACHED
WindowActivation     = ACTIVE | INACTIVE
DocumentVisibility   = VISIBLE | HIDDEN | UNKNOWN
ResourceResidency    = HOT | WARM | SUSPENDED | EVICTED
ContentReadiness     = UNLOADED | LOADING | READY | PARTIAL | ERROR | STALE
EditDisposition      = CLEAN | DIRTY | SAVING | SAVE_FAILED | CONFLICTED | RECONCILING
AuthorityDisposition = EDITABLE | READ_ONLY | PERMISSION_DENIED | AUTHORITY_STALE
RecoveryDisposition  = LIVE | RESTORABLE | RESTORING | RECOVERY_BLOCKED
```

These are orthogonal dimensions, not one flattened enum.

### New invariants

```text
VISIBLE != ACTIVE
ACTIVE != FOCUSED_SEMANTIC_OBJECT
HIDDEN != SUSPENDED
MINIMIZED != EVICTED
SUSPENDED != CLOSED
EVICTED != FORGOTTEN
RESTORED_LAYOUT != RESTORED_CURRENTNESS
RESTORED_CONTENT != RESTORED_AUTHORITY
BROWSER_HIDDEN != SB_WINDOW_MINIMIZED
BROWSER_TAB != SB_TAB
DIRTY != UNSAVED_SERVER_TRUTH
```

A hidden browser document can contain an SB window that remains logically open. Conversely, an SB window can be minimized while its containing document remains visible.

## Finding 2 — resource suspension must preserve semantic identity

The browser may throttle hidden contexts, so shell performance policy must be explicit rather than assuming timers/render loops remain timely.

Candidate lifecycle:

```text
OPEN/READY/HOT
  -> inactive threshold
WARM
  -> suspension policy + safe checkpoint
SUSPENDED
  -> memory pressure / bounded eviction policy
EVICTED
  -> user activates
RESTORING
  -> rehydrate + revalidate context/currentness/authority
READY
```

Guards before `SUSPENDED` or `EVICTED` must consider dirty edits, pending effects, unsent local draft, active capture/stream, non-reconstructable transient state and explicit user pinning.

`ResourceResidency` is a client optimization axis only. It must not mutate service/runtime lifecycle or imply that remote work stopped.

### Recovery obligation

Reactivation after suspension/eviction MUST requalify at least:

- client/tenant identity;
- workspace identity;
- desktop sphere;
- application/window identity;
- semantic object selection where still resolvable;
- revision/environment;
- permission/authority;
- currentness/evidence horizons;
- dirty/local-draft lineage;
- pending/unknown effects.

Rehydration cannot silently promote cached `STALE` evidence to `CURRENT`.

## Finding 3 — tab activation policy depends on latency

SB tabs are application composites, not browser tabs. Candidate contract:

```text
if panel activation is effectively immediate:
    selection MAY follow keyboard focus
else:
    focus moves independently
    Enter/Space activates selected panel
```

This applies to local tab bars, docked window groups and inspector tab sets. Expensive application/view activation should default to manual activation semantics so arrow-key exploration does not trigger network requests, heavy renderer initialization or destructive context switches.

### Keyboard baseline

For a horizontal tab group candidate:

- `Tab` enters/exits the composite;
- `Left/Right` moves focus among tabs;
- `Home/End` may move to first/last;
- `Enter/Space` activates under manual activation;
- close has an explicit command and must preserve a deterministic next focus target;
- pointer activation must not create a keyboard-only semantic difference.

Focus ring and selected/active window/tab treatment must remain visually distinct.

## Finding 4 — window activation, semantic selection and command routing are separate

Candidate command-routing context:

```text
CommandContext {
  clientId
  workspaceId
  desktopSphereId
  applicationId
  windowId
  activeViewId?
  focusedControlId?
  selectedSemanticRefs[]
  revisionRef
  environmentRef
  authoritySnapshotRef
  currentnessRef
}
```

The focused DOM control can receive keyboard input without becoming the selected semantic object. A semantic object may remain selected while focus moves into Ribbon, Inspector or Command Palette.

Candidate routing precedence:

```text
explicit command target
-> active window/view context
-> selected semantic object(s)
-> desktop/workspace context
-> global shell command
```

Commands must declare applicability/guards; visual enablement is a projection of those guards, not their authority source.

## Finding 5 — multi-context synchronization is transport, not authority

For future multi-display or detached windows, same-origin messaging can be a synchronization candidate, but G4 must preserve:

```text
message received != canonical state committed
message order != business order
window heartbeat != semantic currentness
peer visible != peer authoritative
local cache != workspace truth
```

Any synchronization mechanism later selected needs message identity, source window identity, workspace/revision/environment scope, replay/idempotency behavior, stale-peer handling and recovery after a browsing context disappears.

A detached display closing unexpectedly must not destroy canonical workspace state or silently discard dirty work.

## Finding 6 — Desktop Sphere is a task-context lens, not an ownership boundary

The proposed spheres remain useful as discoverability/work-layout hypotheses, but they should be tested as task-context lenses rather than canonical module partitions.

Candidate evaluation criteria for each sphere:

- coherent user job-to-be-done;
- stable command vocabulary;
- common inspectors/tools;
- meaningful saved layout;
- bounded cognitive load;
- cross-sphere object continuity;
- no fabricated semantic ownership.

A capability/application may participate in several spheres without duplication of identity.

`Desktop placement != capability ownership`.

## Componentization impact

### Primitive / atomic

- `FocusIndicator`
- `SelectionIndicator`
- `CurrentnessIndicator`
- `DirtyIndicator`
- `WindowStateIndicator`
- `ShortcutHint`

### Compound component

- `WindowTitleBar`
- `TabStrip`
- `WindowControlGroup`
- `ContextualCommandGroup`
- `StatusActivityItem`
- `RecoveryBanner`
- `StaleContextBanner`

### Module component / tool

- `WindowRegistry`
- `Taskbar/OpenWindowSwitcher`
- `DockGroup`
- `SplitGroup`
- `InspectorHost`
- `CommandPalette`
- `CommandApplicabilityInspector`
- `SessionRecoveryPanel`

### Application / window / desktop

- `ApplicationWindow`
- `DesktopSphereSurface`
- `DetachedDisplaySurface`
- `WorkspaceSession`

`composedOf` relations should remain structural. They must not imply semantic ownership.

## Componentes metadata additions

Research candidate metadata for shell components:

```text
componentLevel
semanticIdentityRole
focusModel
selectionModel
activationModel
resourceResidencyPolicy
restorePolicy
currentnessPolicy
keyboardContract
pointerContract
reducedMotionContract
responsiveContract
failureRecoveryContract
composedOf[]
usedBy[]
scenarioRefs[]
proofObligationRefs[]
```

Catalog metadata remains descriptive evidence and does not become business truth.

## Adversarial scenarios

1. Browser tab becomes hidden while a dirty SB window remains logically open.
2. Browser throttling delays heartbeat/timer; shell must not infer remote failure solely from delayed UI timer.
3. User arrows through expensive tabs; focus traversal must not trigger heavy activation unless latency is negligible.
4. Window is evicted under memory pressure while carrying dirty local draft; eviction must be blocked or draft durably checkpointed.
5. Detached display crashes; primary workspace restores window identity/layout without pretending stale data is current.
6. Focus moves from canvas selection to Ribbon; semantic selection remains stable while keyboard focus changes.
7. Permission is revoked while a suspended window is inactive; restore must requalify authority before edits/effects.
8. Revision/environment changes in another surface; stale peer cannot silently issue commands under old context.
9. Minimized monitoring window continues receiving shared telemetry evidence but does not run independent high-frequency rendering.
10. Close window with pending unknown effect; close cannot relabel the effect as cancelled/completed.

## Performance findings

- Browser hidden-state throttling is expected platform behavior; the shell should use visibility as a resource hint, not semantic truth.
- Render loops and expensive visualization work should be pausable/render-on-demand when hidden/inactive where semantics permit.
- Telemetry subscriptions should be shared/aggregated above individual widgets/windows when possible; minimizing a view should primarily reduce rendering, not fabricate a telemetry lifecycle.
- High window count requires a bounded residency policy (`HOT/WARM/SUSPENDED/EVICTED`) rather than keeping every application tree fully rendered.
- Restore should be staged: lightweight shell/layout first, then active-window content, then lower-priority inactive content.

## Accessibility findings

- `SELECTED != FOCUSED` must be represented visually and programmatically.
- Composite controls should expose one predictable tab stop and internal arrow-key navigation where matching established patterns.
- Expensive tab activation should use manual activation to avoid keyboard navigation latency.
- Dock/snap/reorder must have non-drag command alternatives.
- Minimize/maximize/detach/move-to-display/close require keyboard-operable commands with accessible names.
- Restore/recovery banners must expose state text, not color/motion alone.
- Small-screen equivalent operation may collapse layout but cannot remove required commands; complex desktop authoring may intentionally degrade to review/approve/status workflows rather than fake full parity.

## Proof obligations

1. Hiding/minimizing/suspending a UI cannot stop or mutate service/runtime state.
2. Dirty work survives permitted suspension/eviction or the transition is refused.
3. Restored UI revalidates revision/environment/authority/currentness before presenting effective/editable state.
4. Focus, selected semantic object and active window can diverge without ambiguity.
5. Keyboard-only users can activate, switch, close, dock/split via equivalent commands without drag.
6. Heavy tab/view activation is not triggered by mere focus traversal unless activation latency is proven negligible.
7. Detached/multi-display synchronization cannot create a second semantic authority.
8. Browser timer throttling cannot be interpreted as remote service failure without independent evidence.
9. Layout restore does not imply content/evidence restore.
10. Componentes metadata remains descriptive and cannot override canonical semantic contracts.

## Maturity / open gaps

This slice is `MATERIAL_DELTA / PARTIALLY_MATURE`.

Remaining high-value gaps:

1. exact persisted `WorkspaceSession` recovery envelope and conflict/reconcile rules across multiple browser surfaces;
2. formal window close protocol for dirty state + pending/unknown effects;
3. resource-residency budget policy for NORMAL/STRESS window counts;
4. command-registry applicability/authority/currentness algebra;
5. empirical latency threshold and loading strategy for automatic vs manual tab activation;
6. small-screen equivalent-operation matrix per Desktop Sphere;
7. multi-display leader/coordinator failure and stale-peer recovery without creating semantic authority.

Do not advance this slice to implementation planning until these gaps are reconciled with the broader G4 frontend corpus.