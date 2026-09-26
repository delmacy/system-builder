# G4 — Web Desktop WorkspaceSession Recovery & Close Protocol Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment
Date: 2026-09-22

## Purpose

Bounded research into the persisted `WorkspaceSession` recovery envelope and close/recovery protocol for the candidate hierarchy `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

This artifact does not authorize implementation, select persistence/synchronization technology, or make browser lifecycle events semantic authority. It extends `G4_WEB_DESKTOP_WINDOW_LIFECYCLE_RESEARCH.md`.

## Evidence classes

### E1 — web-platform lifecycle evidence

Browser termination is not a reliable transaction boundary. `beforeunload`, `unload`, and even `pagehide` can be skipped, especially on mobile/process termination. `visibilitychange` is a better checkpoint opportunity, but remains a lifecycle hint rather than a guaranteed final callback. Back/forward cache may preserve a page rather than destroy it.

Research consequence: correctness cannot depend on a final synchronous save-on-close operation. Recoverable user state must be checkpointed incrementally before destructive lifecycle transitions become unavoidable.

### E2 — mature editor evidence

VS Code Hot Exit is evidence for preserving unsaved editor changes independently of ordinary file save, restoring backups after unexpected close. This supports a separation between canonical save and recovery checkpoint rather than treating them as synonyms.

### E3 — existing G4 invariants

Existing research already requires `RESTORED_LAYOUT != RESTORED_CURRENTNESS`, `RESTORED_CONTENT != RESTORED_AUTHORITY`, `DIRTY != UNSAVED_SERVER_TRUTH`, `Window lifecycle != runtime lifecycle`, and requalification of revision/environment/authority/currentness on restore.

## Finding 1 — WorkspaceSession is a recovery envelope, not workspace truth

Candidate identity:

```text
WorkspaceSessionEnvelope {
  envelopeId
  schemaVersion
  sessionEpoch
  clientRef
  workspaceRef
  desktopSphereRef
  revisionRef
  environmentRef
  capturedAt
  surfaceRefs[]
  windowRefs[]
  activeWindowRef?
  semanticSelectionRefs[]
  layoutSnapshotRef?
  localDraftRefs[]
  pendingEffectRefs[]
  unknownEffectRefs[]
  authorityEvidenceRefs[]
  currentnessEvidenceRefs[]
  recoveryIntent
}
```

The envelope is a reconstructable projection/checkpoint. It is not the canonical workspace, business object, permission decision, effect ledger, or currentness authority.

New invariants:

```text
SESSION_CHECKPOINT != CANONICAL_SAVE
RECOVERABLE != CURRENT
RECOVERABLE != AUTHORIZED
LAYOUT_RESTORED != WORK_RECONCILED
WINDOW_PRESENT != CONTENT_RESIDENT
DRAFT_RESTORED != DRAFT_COMMITTED
EFFECT_REFERENCE_RESTORED != EFFECT_STATUS_KNOWN
LAST_ACTIVE != SAFE_TO_REACTIVATE
```

## Finding 2 — recovery must be staged and monotonic in claims

Candidate recovery state machine:

```text
ABSENT
 -> ENVELOPE_FOUND
 -> STRUCTURE_RESTORING
 -> CONTEXT_REQUALIFYING
 -> CONTENT_REHYDRATING
 -> DRAFT_RECONCILING
 -> EFFECTS_REQUALIFYING
 -> READY | DEGRADED | RECOVERY_BLOCKED
```

`STRUCTURE_RESTORING` may reconstruct desktop/window/tab geometry without asserting semantic currentness. `CONTEXT_REQUALIFYING` checks client/workspace existence, revision/environment, permissions and applicable currentness horizons. `DRAFT_RECONCILING` compares local draft lineage with canonical state. `EFFECTS_REQUALIFYING` resolves pending/unknown effect references without inventing completion.

Invalid transitions include:

```text
ENVELOPE_FOUND -> READY             // skips qualification
STALE -> CURRENT                    // without fresh evidence
PERMISSION_DENIED -> EDITABLE       // because layout restored
UNKNOWN_EFFECT -> COMPLETED         // because window reopened
DIRTY_LOCAL -> CLEAN                // because checkpoint persisted
```

Recovery may reduce confidence (`CURRENT -> STALE/UNKNOWN`, `EDITABLE -> READ_ONLY/PERMISSION_DENIED`) when fresh evidence demands it; it may not increase confidence merely from persisted UI state.

## Finding 3 — checkpointing is incremental; close is not the durability primitive

Because browser finalization callbacks are not reliable, candidate checkpoint triggers are additive hints:

- material edit/draft mutation;
- window/layout mutation after bounded debounce;
- semantic selection/context mutation where recovery value justifies it;
- before deliberate suspend/evict;
- browser visibility becoming hidden;
- explicit workspace/client switch;
- periodic bounded checkpoint while dirty or effects are unresolved.

A final close callback MAY improve freshness but MUST NOT be the only durability path.

`beforeunload` is a user-loss warning candidate only while materially dirty/uncheckpointed work exists; it is not a commit protocol and should not be permanently installed as shell infrastructure.

## Finding 4 — close protocol needs separate UI disposition and work/effect disposition

Candidate close request:

```text
CloseWindowRequest {
  windowRef
  draftDisposition
  unresolvedEffects[]
  checkpointDisposition
  authorityDisposition
  closeReason
}
```

Candidate decision states:

```text
CLOSE_REQUESTED
 -> SAFE_TO_CLOSE
 | CHECKPOINT_REQUIRED
 | USER_DECISION_REQUIRED
 | EFFECT_REQUALIFICATION_REQUIRED
 | CLOSE_BLOCKED
```

Important cases:

1. `CLEAN + no unresolved effects` -> close may proceed.
2. `DIRTY + durable recovery checkpoint` -> UI may close while draft remains explicitly recoverable, subject to policy.
3. `DIRTY + checkpoint failed` -> require explicit discard or block close where the shell still controls the transition.
4. `PENDING/UNKNOWN effect` -> closing the window does not cancel, complete or roll back the effect; preserve effect identity and expose it through Status/Activity/recovery surfaces.
5. `SAVE_FAILED/CONFLICTED` -> close cannot relabel work clean; preserve conflict lineage and recovery route.
6. browser/process crash -> no interactive close protocol is guaranteed; recovery depends on the latest durable checkpoint.

New invariants:

```text
CLOSE_WINDOW != DISCARD_DRAFT
CLOSE_WINDOW != CANCEL_EFFECT
CHECKPOINTED_DIRTY != SAVED
PENDING_AT_CLOSE != CANCELLED
UNKNOWN_AT_CLOSE != FAILED
CRASH != USER_DISCARD
```

## Finding 5 — multi-surface recovery requires ownership of UI mutation, not semantic authority

Multiple browser surfaces can reference the same WorkspaceSession. To avoid layout/draft races, candidate envelope fragments require writer identity and monotonic checkpoint lineage:

```text
SurfaceCheckpoint {
  surfaceId
  sessionEpoch
  checkpointSeq
  parentCheckpointRef?
  capturedAt
  fragmentKind
}
```

A coordinator may serialize shell/layout mutations, but `UI coordinator != business authority`. Split/duplicate surfaces must not create duplicate effect authority.

Conflicting checkpoint branches should be classified rather than last-write-wins by default:

```text
NON_OVERLAPPING -> merge candidate
LAYOUT_ONLY_CONFLICT -> deterministic/user layout policy
DRAFT_SAME_LINEAGE -> content reconciliation
DRAFT_DIVERGENT_LINEAGE -> conflict
EFFECT_REFERENCE_CONFLICT -> requalify from effect authority
CONTEXT_SCOPE_CONFLICT -> block/reselect context
```

## Finding 6 — client/workspace switch is a recovery boundary, not merely navigation

Before switching `Client` or `Workspace`, the shell must inventory dirty drafts and unresolved effects scoped to the outgoing context. The incoming context must not inherit semantic selection, authority snapshots or environment/revision merely because the same application/window type is restored.

Candidate preserved-across-switch data:

- application/window placement preferences when scope permits;
- generic layout preferences;
- command/tool preferences not tied to semantic authority.

Candidate requalified or reset data:

- semantic selection;
- revision/environment;
- authority/currentness;
- context-bound inspectors;
- pending effect views;
- local drafts, which remain attached to their original workspace lineage.

`Same window type != same workspace context`.

## Componentization impact

### Primitive / atomic

- `RecoveryDispositionIndicator`
- `CheckpointFreshnessIndicator`
- `DraftLineageIndicator`
- `UnresolvedEffectIndicator`
- `ContextQualificationIndicator`

### Compound

- `CloseDispositionPrompt`
- `RecoveryBanner`
- `DraftRecoveryItem`
- `EffectRecoveryItem`
- `CheckpointStatusItem`

### Module component / tool

- `WorkspaceSessionRegistry`
- `RecoveryCoordinator`
- `SessionRecoveryPanel`
- `CloseProtocolController`
- `DraftReconciliationPanel`
- `ContextRequalificationPanel`

### Application/window/desktop/workspace

- `ApplicationWindow` consumes close/recovery disposition but does not own canonical draft/effect truth.
- `DesktopSphereSurface` restores layout independently from semantic qualification.
- `WorkspaceSession` aggregates recoverable shell references without becoming workspace authority.

Candidate Componentes metadata additions:

```text
recoveryScope
checkpointPolicy
checkpointDurabilityClass
contextQualificationPolicy
closeDispositionPolicy
draftLineageContract
unresolvedEffectContract
multiSurfaceConflictPolicy
restorePriority
```

## Accessibility / responsive findings

- Recovery and close decisions must be fully keyboard operable; no drag or spatial memory is required to recover work.
- Recovery lists need textual identity for client/workspace/application/window/object/revision/environment and explicit currentness/authority disposition.
- Focus after recovery should move to a deterministic restored target only after that target exists; otherwise focus lands on the recovery/status surface.
- A crash/recovery warning must not rely on color or motion.
- Small-screen recovery can flatten desktop geometry into a list without losing draft/effect/context identity.
- Reduced motion changes transition presentation only, never recovery semantics.

## Performance findings

- Persist lightweight envelope/index metadata separately from heavyweight application payloads so cold restore can reconstruct shell first.
- Restore priority candidate: active/recovery-critical window -> visible windows -> minimized/inactive windows -> optional previews.
- High window count should restore descriptors before component trees; `window descriptor present != application loaded`.
- Checkpoint writes should be incremental/coalesced but must not merge away distinct draft lineage or unresolved-effect identity.
- Recovery scans should be bounded by workspace/session indexes rather than eagerly hydrating every application.

## Scenarios / proof obligations

1. Kill browser process after a material edit without a final unload callback: latest durable draft checkpoint remains discoverable.
2. Restore layout while permission was revoked offline: window returns read-only/denied, not editable.
3. Restore after revision/environment changed: stale context is surfaced and must reconcile/reselect before effectful commands.
4. Close dirty window with successful recovery checkpoint: draft remains recoverable and explicitly dirty.
5. Close window with unknown remote effect: effect remains unknown and visible in Status/Activity after window closure.
6. Crash during checkpoint write: prior complete checkpoint remains usable; incomplete checkpoint is not promoted.
7. Two surfaces checkpoint non-overlapping layout changes: merge does not fabricate semantic state.
8. Two surfaces edit same draft lineage divergently: conflict is surfaced; no silent last-write-wins.
9. Switch Client with dirty draft in old Workspace: draft remains bound to old context and cannot leak into new client.
10. Small-screen restore: all recovery-critical actions remain available without reconstructing desktop geometry.
11. Browser bfcache return: preserved page memory does not bypass authority/currentness requalification when horizons require it.
12. Fatal application renderer failure: shell recovery envelope and draft/effect references survive independent component-tree failure.

Proof obligations:

- No correctness property depends on `unload` firing.
- A persisted UI envelope cannot upgrade authority/currentness/effect status.
- Dirty recoverability is demonstrably distinct from canonical save.
- Window close never implicitly cancels or completes an external effect.
- Multi-surface shell coordination cannot mint business/effect authority.
- Recovery preserves client/workspace/revision/environment lineage or explicitly blocks ambiguous restoration.
- Recovery can operate through non-spatial list/text representation.
- Partial/corrupt checkpoints fail closed to the previous qualified checkpoint or explicit recovery error.

## Deduplication

This artifact does not redefine window residency, focus/selection, tab activation or Desktop Sphere semantics from `G4_WEB_DESKTOP_WINDOW_LIFECYCLE_RESEARCH.md`. It closes two explicit gaps there: the `WorkspaceSession` recovery envelope and close behavior under dirty + pending/unknown effects.

## Maturity / remaining gaps

This slice is `MATERIAL_DELTA / PARTIALLY_MATURE`.

Material gaps remain before implementation planning:

1. command-registry applicability/authority/currentness algebra;
2. concrete durability classes and privacy/security rules for local recovery material;
3. retention/expiry and user-visible cleanup of abandoned session checkpoints;
4. empirical NORMAL/STRESS budgets for checkpoint frequency, window descriptor count and staged restore;
5. multi-display coordinator election/rejoin details without semantic authority;
6. small-screen equivalent-operation matrix by candidate Desktop Sphere.

Next recommended vector: Command Registry applicability and execution lifecycle, especially `visible/enabled/applicable/authorized/current/pending/effective` separation across Ribbon, context menus, Command Palette and keyboard shortcuts.