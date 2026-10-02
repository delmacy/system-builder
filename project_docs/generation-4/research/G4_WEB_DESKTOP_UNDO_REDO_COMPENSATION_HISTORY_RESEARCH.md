# G4 — Web Desktop Undo/Redo, Compensation & Command History Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment
Date: 2026-09-23

## Purpose

Bounded research into undo/redo semantics across presentation/layout state, local drafts, canonical mutations and admitted external effects. This extends the Web Desktop Command Registry, bulk execution, input/dialog transaction and workspace-session recovery research. It does not authorize implementation, select a state/history library, or imply that every command is reversible.

The central question is: what may legitimately be called `undo`, what requires a new compensating command, what is irreversible, and how should history survive multiple windows/surfaces and recovery without fabricating rollback semantics?

## Evidence classes

### E1 — selective editor history

ProseMirror history is selective rather than a reset to an earlier global state: it can undo selected transactions while preserving later/concurrent changes, supports excluding transactions from history, and requires preserved items for collaboration. This is strong evidence against treating Web Desktop undo as a universal snapshot rewind.

### E2 — distributed compensation

Azure Saga and Compensating Transaction guidance distinguishes compensation from atomic rollback. Compensation consists of new domain-specific actions, may fail, may require retry/manual intervention, may not run in exact reverse order, and may not restore the exact original state because concurrent work can exist. Irreversible/pivot steps require explicit treatment.

### E3 — browser session history

The browser History API controls browser navigation history. It is not an application edit-history authority. Therefore browser Back/Forward, SB navigation history, window/tab history and semantic undo history must remain distinct.

## Finding 1 — one universal Undo stack is semantically unsafe

Candidate history domains:

```text
PRESENTATION_HISTORY
  window position/size, docking, split ratios, selected projection, local view preferences

LOCAL_DRAFT_HISTORY
  reversible edits inside an uncommitted draft lineage

CANONICAL_MUTATION_HISTORY
  committed model mutations only when an explicit inverse/revert contract exists

EFFECT_HISTORY
  admitted/executed external effects; never silently rewound

NAVIGATION_HISTORY
  visited SB views/objects; not edit history
```

Invariants:

```text
BROWSER_BACK != SB_UNDO
NAVIGATE_BACK != REVERT_EDIT
LAYOUT_UNDO != SEMANTIC_UNDO
DRAFT_UNDO != CANONICAL_REVERT
CANONICAL_REVERT != EXTERNAL_COMPENSATION
COMPENSATION != TIME_REVERSAL
```

A single keyboard gesture may dispatch to the currently scoped history domain, but the domain must be explicit and derivable from focus/context. A global stack must not interleave unrelated semantic domains and then pretend they share rollback semantics.

## Finding 2 — history entries require semantic identity and lineage

Candidate entry:

```text
HistoryEntry {
  historyEntryId
  historyDomain
  commandId?
  operationIdentity
  actorRef?
  clientRef
  workspaceRef
  applicationRef?
  windowRef?
  semanticTargetRefs[]
  draftLineageRef?
  baseRevisionRef?
  resultingRevisionRef?
  environmentRef?
  forwardIntentRef?
  inverseIntentRef?
  externalEffectRefs[]
  createdAt
  disposition
  currentnessEvidenceRef?
}
```

History identity is not window identity. Closing the originating window must not erase a workspace-scoped canonical/effect lineage. Conversely, purely local layout history may legitimately remain surface/window scoped.

```text
WINDOW_CLOSED != HISTORY_FORGOTTEN
WINDOW_MOVED != CANONICAL_MUTATION
SAME_COMMAND_ID != SAME_HISTORY_ENTRY
SAME_TARGET != SAME_LINEAGE
```

## Finding 3 — local draft undo is selective lineage editing, not workspace rewind

Candidate draft lifecycle:

```text
DRAFT_STEP_APPLIED
 -> UNDO_AVAILABLE
 -> UNDO_REQUESTED
 -> INVERSE_APPLIED_TO_CURRENT_LINEAGE
 -> UNDONE
 -> REDO_AVAILABLE
```

But concurrent/canonical drift may invalidate an inverse:

```text
UNDO_AVAILABLE
 -> REQUALIFYING
 -> APPLICABLE
    | STALE
    | CONFLICTED
    | NO_LONGER_APPLICABLE
```

The ProseMirror selective-history model is useful evidence: collaboration-safe undo can reverse the user's relevant transaction without erasing later unrelated work. SB therefore should research lineage-aware inverse application rather than snapshot restoration.

```text
UNDO_DEPTH_PRESENT != UNDO_CURRENTLY_APPLICABLE
OLD_INVERSE != CURRENTLY_SAFE_INVERSE
CONCURRENT_CHANGE != PERMISSION_TO_ERASE_OTHER_CHANGE
```

## Finding 4 — canonical revert is a new admitted mutation

Once a mutation is canonical/published/committed, a later `Revert` is not merely local history navigation. It is a new command evaluated under current revision, authority, policy and environment.

Candidate lifecycle:

```text
REVERT_REQUESTED
 -> TARGET_HISTORY_ENTRY_RESOLVED
 -> CURRENT_STATE_REQUALIFYING
 -> INVERSE_INTENT_DERIVED
 -> PREVIEW_REQUIRED?
 -> ADMISSION_REQUESTED
 -> ADMITTED
 -> PENDING / ACKNOWLEDGED / VERIFYING
 -> EFFECTIVE | PARTIAL | FAILED | EFFECT_UNKNOWN
```

Invariants:

```text
WAS_AUTHORIZED_THEN != AUTHORIZED_NOW
WAS_REVERSIBLE_THEN != REVERSIBLE_NOW
INVERSE_EXISTS != INVERSE_ADMISSIBLE
REVERT_ACK != REVERT_EFFECTIVE
REVERT_EFFECTIVE != HISTORY_ERASED
```

The original entry remains immutable audit/history evidence; successful revert adds another linked entry rather than deleting history.

## Finding 5 — external effect compensation is a forward operation

For admitted external effects, compensation is modeled as a new forward intent with causal linkage:

```text
OriginalEffect
  --compensatedBy--> CompensationEffect
```

Candidate dispositions:

```text
NOT_COMPENSABLE
COMPENSATION_AVAILABLE
COMPENSATION_REQUIRES_REQUALIFICATION
COMPENSATION_PENDING
COMPENSATION_ACKNOWLEDGED
COMPENSATION_VERIFYING
COMPENSATED
PARTIALLY_COMPENSATED
COMPENSATION_FAILED
COMPENSATION_UNKNOWN
MANUAL_REMEDIATION_REQUIRED
```

Compensation can have different business semantics from reversal: cancel reservation, issue refund, create corrective record, revoke entitlement, publish successor revision, or reconcile externally.

```text
COMPENSATION_AVAILABLE != SAFE_AUTOMATIC_UNDO
COMPENSATION_REQUESTED != ORIGINAL_EFFECT_CANCELLED
COMPENSATED != ORIGINAL_EFFECT_NEVER_HAPPENED
FAILED_COMPENSATION != ORIGINAL_EFFECT_FAILED
```

Irreversible/pivot effects must remain explicitly representable. UI must never expose a generic Undo affordance that suggests time reversal where only remediation exists.

## Finding 6 — cancel, undo, revert and compensate are four distinct command families

```text
CANCEL
  attempts to stop work that has not yet crossed its declared cancellation boundary

UNDO
  reverses an eligible local/history operation within a declared history domain

REVERT
  creates a new canonical mutation intended to semantically counter a prior canonical mutation

COMPENSATE
  creates new domain/effect work addressing already-realized external effects
```

Therefore:

```text
CANCEL != UNDO
UNDO != REVERT
REVERT != COMPENSATE
CANCEL_REQUESTED != CANCELLED_CONFIRMED
```

Status/Activity must project these distinctions and preserve the original effect lineage.

## Finding 7 — redo is reapplication under lineage rules, not blind replay

Local draft redo may reapply a known inverse pair when lineage is unchanged. Canonical/effectful redo cannot blindly replay an old admitted command because authority/currentness/targets may have changed.

Candidate redo dispositions:

```text
REDO_LOCALLY_APPLICABLE
REDO_REQUALIFICATION_REQUIRED
REDO_CONFLICTED
REDO_NO_LONGER_AVAILABLE
REEXECUTION_REQUIRED
```

```text
REDO != RETRY
REDO != REEXECUTE_EFFECT
RETRY != REPLAY_WITHOUT_REQUALIFICATION
```

If an undone canonical mutation is to be applied again, that is a new admission/revert-of-revert or reexecution according to the command contract, not a UI stack pop with inherited authority.

## Finding 8 — cross-window history needs scope resolution

Candidate scopes:

```text
WINDOW_LOCAL
APPLICATION_LOCAL
DRAFT_LINEAGE
WORKSPACE_CANONICAL
WORKSPACE_EFFECT
```

The focused window supplies interaction context but does not own workspace history. `Ctrl/Cmd+Z` should resolve the nearest eligible history owner according to focus and declared scope. If focus is in a text/input editor, its local draft history may own the gesture; if no local owner applies, the application/workspace may expose an explicit canonical revert command rather than silently consuming Undo.

```text
FOCUSED_WINDOW != HISTORY_AUTHORITY
SELECTED_OBJECT != UNDO_SCOPE
LAST_COMMAND_GLOBALLY != SAFE_UNDO_TARGET
```

Cross-window command history should expose origin window/application as provenance, not as a requirement that the origin remain open.

## Finding 9 — recovery restores history evidence, not stale executability

`WorkspaceSessionEnvelope` may retain local history checkpoints and references to canonical/effect history. Recovery requalifies applicability.

Candidate recovery states:

```text
HISTORY_REFERENCE_RESTORED
 -> LINEAGE_RESOLVING
 -> CONTEXT_REQUALIFYING
 -> AVAILABLE | STALE | CONFLICTED | READ_ONLY | AUTHORITY_UNKNOWN
```

```text
UNDO_WAS_AVAILABLE_BEFORE_CRASH != UNDO_AVAILABLE_NOW
COMPENSATION_WAS_AVAILABLE != COMPENSATION_AUTHORIZED_NOW
HISTORY_RESTORED != CURRENTNESS_RESTORED
```

Unknown effects remain unknown across recovery. Recovery must not create an undo opportunity merely because the initiating surface disappeared.

## Finding 10 — Componentes impact

### Primitive / atomic
- `HistoryDomainIndicator`
- `UndoAvailabilityIndicator`
- `RevertDispositionIndicator`
- `CompensationDispositionIndicator`
- `IrreversibleEffectIndicator`
- `HistoryCurrentnessIndicator`

### Compound
- `HistoryEntryRow`
- `UndoScopeSummary`
- `RevertPreviewSummary`
- `CompensationPreviewSummary`
- `EffectLineageSummary`
- `HistoryConflictBanner`

### Tool / module component
- `HistoryScopeResolver`
- `LocalUndoManager`
- `WorkspaceCommandHistory`
- `CanonicalRevertInspector`
- `EffectCompensationInspector`
- `HistoryRecoveryCoordinator`

### Application / window / desktop / workspace
- editors/windows may own local history domains;
- Ribbon/Command Palette/menus project the same Undo/Revert/Compensate command contracts;
- Window Manager supplies focus context but not canonical history authority;
- Status/Activity retains admitted effect and compensation lineage across window closure;
- Workspace owns durable canonical/effect history references and recovery qualification;
- small-screen/list/table representations expose the same lineage without drag/spatial dependence.

Candidate metadata:

```text
historyDomain?
historyScope?
undoPolicy?
redoPolicy?
revertPolicy?
compensationPolicy?
irreversibilityClass?
lineagePolicy?
recoveryPolicy?
```

## Accessibility / interaction findings

- `Ctrl/Cmd+Z` and redo shortcuts require a deterministic, inspectable scope resolver; focus changes cannot silently target a destructive workspace-level revert.
- Disabled/unavailable Undo must expose why: no local history, stale lineage, conflict, read-only, permission/authority loss, or irreversible effect.
- Canonical revert/compensation with material consequences uses the same parameter/confirmation transaction contract as other effectful commands.
- History timelines must be navigable by keyboard and screen reader, with actor/time/target/disposition/currentness represented textually rather than by color or spatial position alone.
- Small-screen UI may replace timeline geometry with list/table while preserving causal lineage and dispositions.
- Undoing window layout must not unexpectedly move keyboard focus to a destroyed/inert surface without a defined focus successor.

## Performance findings

- Local draft history may be bounded/compacted, but compaction cannot erase the lineage required to reconcile current inverses.
- Canonical/effect history should be virtualized and paged; UI does not require all historical entries resident.
- Derived availability indexes may accelerate `canUndo/canRevert/canCompensate`, but cached availability is not authority/currentness evidence.
- Large history lists aggregate repeated presentation-only actions separately from semantic/effect history; aggregation never hides irreversible, failed, partial or unknown effects.
- Inverse derivation for expensive canonical structures may be lazy, but delayed computation yields `REQUALIFYING/UNKNOWN`, never optimistic availability.

## Adversarial scenarios / proof obligations

1. User moves/resizes a window then edits a draft: layout Undo cannot revert the draft.
2. Browser Back is invoked after an edit: navigation cannot silently undo semantic state.
3. User A edits object; User B later edits same object; User A Undo cannot erase B's work by restoring an old snapshot.
4. Draft undo entry exists but revision drift makes its inverse unsafe: disposition becomes stale/conflicted.
5. Published canonical mutation is reverted: new authority/currentness admission is required and original history remains.
6. External email/payment/deployment already occurred: generic Undo cannot claim the external world was rewound.
7. Compensation partially succeeds: original effect plus partial compensation remain visible and recoverable.
8. Compensation result is unknown after network loss: no automatic replay without requalification/idempotency/effect identity.
9. Originating window closes: workspace effect history and compensation availability remain discoverable.
10. Crash occurs with local undo stack and pending external effect: recovery restores each under separate history/effect domains.
11. Permission is revoked after original action: old inverse does not inherit old authority.
12. Redo after concurrent change: blind replay is prohibited; requalification/conflict handling is required.
13. Focus is inside a text field while workspace has a revertable canonical mutation: keyboard Undo targets the local editor, not the workspace mutation.
14. Irreversible pivot step exists: UI labels remediation/compensation explicitly and does not offer misleading Undo.
15. History list has 10,000 entries: virtualization preserves exact failed/unknown/irreversible entries and accessible filtering.
16. Small-screen projection has no desktop geometry: local draft undo, canonical revert and compensation remain fully operable.

Proof obligations:

- PO1: every undo/revert/compensation action declares its history domain and scope.
- PO2: browser/navigation history never becomes semantic edit authority.
- PO3: local undo cannot erase unrelated/concurrent canonical work.
- PO4: canonical revert is requalified as a new mutation under current authority/currentness.
- PO5: external compensation is represented as a new effect with causal linkage, never time reversal.
- PO6: irreversible effects cannot expose misleading generic Undo semantics.
- PO7: redo/retry/reexecution remain distinct and requalify where required.
- PO8: window closure does not erase workspace-scoped command/effect lineage.
- PO9: recovery restores history evidence without upgrading stale authority/currentness/applicability.
- PO10: shortcut resolution is deterministic, keyboard-accessible and non-destructive across focus changes.
- PO11: partial/failed/unknown compensation remains representable through Status/Activity and recovery.
- PO12: aggregation/virtualization cannot silently omit semantically material history entries.

## Deduplication / relationship to existing research

This artifact does not redefine Command Registry applicability/authority/currentness, bulk per-target result algebra, command parameter/confirmation semantics, or workspace recovery. It adds the missing history algebra over those contracts.

It preserves existing G4 rules: `ACK != effect`, `PENDING != EFFECTIVE`, `STALE != CURRENT`, `UNKNOWN != SUCCESS`, presentation is not semantic authority, and compensation is not rollback.

## Maturity and remaining gaps

Slice maturity: `MATERIAL_DELTA / PARTIALLY_MATURE`.

The undo/revert/compensation boundary is materially specified enough for later synthesis, but G4 remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

Highest-value next vectors:

1. nested/stacked dialogs, cross-window modal ownership and focus/inertness under detached/multi-display surfaces;
2. shell-level Application Registry lifecycle: installed/available/loaded/suspended/failed/permission-hidden and dependency loading without conflating application presence with runtime lifecycle;
3. Componentes catalog/playground conformance model proving shared component state matrices across Ribbon, Window Manager, Inspector, Status/Activity and small-screen projections.
