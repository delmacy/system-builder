# G4 — Web Desktop Modal Ownership, Focus & Multi-Surface Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment
Date: 2026-09-23

## Purpose

Bounded research into nested/stacked dialogs, modal ownership, focus/inertness, cross-window and detached/multi-display surfaces for the G4 Web Desktop. This extends the existing Command Input/Dialog Transaction, Window Lifecycle, Workspace Session Recovery and Undo/Redo/Compensation research. It does not authorize implementation, select an overlay library, freeze the Desktop Sphere taxonomy, or make 3D a navigation foundation.

The central question is: when multiple System Builder windows, applications, dialogs and browser/display surfaces coexist, what exactly is blocked, who owns the active interaction, where may focus move, and what survives close/crash/recovery without fabricating workspace-wide modality or semantic authority?

## Evidence classes

### E1 — WAI-ARIA APG modal dialog semantics

The WAI-ARIA Authoring Practices modal-dialog pattern defines a modal dialog as a window over a primary window or another dialog. Content under the active modal is inert; focus moves into the dialog, `Tab`/`Shift+Tab` remain within it, `Escape` closes it, and focus normally returns to the invoker or another logical successor. APG explicitly demonstrates multiple dialog layers and warns that `aria-modal=true` is harmful when the implementation does not actually prevent interaction outside the dialog.

Portable grammar: modality is an interaction contract, not merely elevation, backdrop or z-index.

### E2 — HTML `<dialog>` / top-layer / inertness semantics

The HTML platform places `showModal()` dialogs in the document top layer. The containing `Document` is blocked by the topmost modal dialog; nodes outside that dialog subtree become inert. MDN explicitly notes that only the containing document is blocked: a modal dialog inside an iframe does not make the outer page inert.

Portable grammar: browser-native modality has a document boundary. It does not prove workspace-wide, multi-window or cross-browsing-context modality.

### E3 — `inert` behavior

The HTML `inert` attribute removes an inert subtree from normal interaction/focus and from the accessibility tree. Modal dialogs shown with `showModal()` escape ancestor inertness unless made inert themselves.

Portable grammar: inertness is a strong interaction/accessibility disposition and must follow the active modal owner exactly; it is not a styling synonym for dimmed/background.

### E4 — existing G4 command/effect/recovery semantics

Existing G4 research already separates dialog lifecycle from command/effect lifecycle, UI close from effect cancellation, focus from selection, window lifecycle from runtime lifecycle, restored layout from restored currentness/authority, and local history from canonical/effect history. This artifact adds shell-level modal ownership without redefining those contracts.

## Finding 1 — modality requires an explicit scope

A Web Desktop cannot safely treat `MODAL` as one global boolean.

Candidate modal scopes:

```text
VIEW_MODAL
WINDOW_MODAL
APPLICATION_MODAL
DESKTOP_MODAL
WORKSPACE_MODAL
DOCUMENT_MODAL        // browser/DOM implementation boundary, not business scope
SURFACE_LOCAL_MODAL   // one detached/browser display surface
```

The semantic scope and browser implementation boundary are independent dimensions.

```text
MODAL_VISUAL_LAYER != MODAL_SCOPE
TOP_LAYER != WORKSPACE_AUTHORITY
DOCUMENT_BLOCKED != WORKSPACE_BLOCKED
SURFACE_BLOCKED != OTHER_SURFACES_BLOCKED
BACKDROP_VISIBLE != BACKGROUND_INERT
```

A confirmation owned by one editor window should not automatically freeze unrelated applications/windows. Conversely, a genuinely workspace-scoped security or destructive transition must not be represented as workspace-modal unless every relevant interaction path is actually prevented or redirected.

## Finding 2 — modal ownership is a stack/graph of interaction leases, not z-index

Candidate `ModalInteractionLease`:

```text
ModalInteractionLease {
  modalId
  modalRole
  semanticScope
  ownerApplicationRef?
  ownerWindowRef?
  ownerViewRef?
  ownerCommandInputSessionRef?
  ownerSurfaceRef
  parentModalRef?
  invokerRef?
  focusReturnRef?
  blockingReason
  dismissPolicy
  escapePolicy
  dirtyDisposition?
  pendingEffectRefs[]
  openedUnderContextRef
  recoveryDisposition
}
```

A nested dialog opened from another dialog creates a parent/child ownership relation. The topmost active child owns the local focus trap; its parent remains blocked but retains lineage and focus-return context.

```text
Z_ORDER != MODAL_OWNERSHIP
FOCUSED_DIALOG != SEMANTIC_AUTHORITY
PARENT_DIALOG_BLOCKED != PARENT_DIALOG_CLOSED
CHILD_DIALOG_CLOSED != PARENT_TRANSACTION_COMMITTED
```

The modal stack is interaction state only. It cannot become command, authorization, revision or effect authority.

## Finding 3 — nested dialogs require deterministic focus lineage

Candidate focus transition:

```text
INVOKER_FOCUSED
 -> CHILD_MODAL_OPENING
 -> INITIAL_FOCUS_RESOLVED
 -> CHILD_MODAL_ACTIVE
 -> CHILD_MODAL_CLOSING
 -> RETURN_TARGET_REQUALIFYING
 -> INVOKER | LOGICAL_SUCCESSOR | PARENT_MODAL_SAFE_TARGET
```

If the original invoker disappeared, became inert, lost permission, moved to another workspace, or is no longer in the active modal lineage, focus must not be blindly restored to it.

```text
INVOKER_REFERENCE_PRESENT != INVOKER_FOCUSABLE_NOW
FOCUS_RETURN_TARGET != SELECTION_TARGET
FOCUS_RESTORED != CONTEXT_CURRENT
```

For destructive/irreversible confirmation, initial focus may deliberately prefer the least destructive action. Large semantic content may initially focus a static heading/paragraph to preserve comprehension rather than jumping to the first action.

## Finding 4 — only the active modal layer may be interactable within its declared local scope

For a nested stack:

```text
DIALOG_A
  -> opens DIALOG_B
      -> opens DIALOG_C
```

candidate local dispositions are:

```text
DIALOG_C = ACTIVE_MODAL
DIALOG_B = BLOCKED_BY_CHILD
DIALOG_A = BLOCKED_BY_DESCENDANT
BACKGROUND = INERT_WITHIN_EFFECTIVE_SCOPE
```

Closing `C` restores `B` only after requalifying the parent dialog/session. A parent may have become stale, read-only or invalid while the child was active.

```text
CHILD_CLOSE != PARENT_READY
PARENT_STILL_MOUNTED != PARENT_CONTEXT_CURRENT
```

Nested dialogs therefore need state requalification just like restored windows and recovered command input sessions.

## Finding 5 — cross-surface global modality cannot be assumed

A detached SB surface, browser window, iframe or separate browsing context is not automatically made inert by a modal dialog in another document. Browser-native `showModal()` blocks only its containing document.

Therefore candidate cross-surface dispositions are:

```text
LOCAL_MODAL_ACTIVE
REMOTE_SURFACE_UNAFFECTED
REMOTE_SURFACE_NOTICE_REQUIRED
REMOTE_SURFACE_INTERACTION_GUARD_REQUIRED
WORKSPACE_OPERATION_GUARD_REQUIRED
```

A workspace-wide business invariant must be enforced by command/admission guards, not by assuming every display surface shares a focus trap.

```text
CROSS_SURFACE_MODAL_REQUEST != CROSS_SURFACE_INERTNESS_PROVEN
REMOTE_SURFACE_ACK != REMOTE_SURFACE_BLOCKED
FOCUS_TRAP != DISTRIBUTED_LOCK
MODAL_LEASE != BUSINESS_LEASE
```

If another surface cannot be reached, the safe behavior is to preserve authoritative command guards and expose degraded/unknown UI coordination rather than claiming global modality.

## Finding 6 — modal ownership must survive owner-window lifecycle changes without orphaning work

Adversarial cases include owner window minimize, suspend, eviction, close and crash while a child modal or command input session exists.

Candidate modal recovery states:

```text
ACTIVE
 -> OWNER_HIDDEN
 -> OWNER_SUSPENDED
 -> OWNER_LOST
 -> RECOVERY_REQUIRED
 -> REATTACHED | PROMOTED_TO_RECOVERY_SURFACE | DISMISSED_SAFE | BLOCKED
```

Rules:

```text
OWNER_WINDOW_CLOSED != COMMAND_CANCELLED
OWNER_WINDOW_CRASHED != DRAFT_DISCARDED
MODAL_ORPHANED != EFFECT_CANCELLED
MODAL_RECOVERED != AUTHORITY_RESTORED
```

If the dialog owns only presentation, it may safely disappear. If it contains recoverable input, dirty local draft, an admitted command reference or unresolved effect, recovery must preserve that lineage according to existing WorkspaceSession rules.

## Finding 7 — modal role is distinct from window role

Candidate dialog roles:

```text
INFORMATIONAL_DIALOG
INPUT_DIALOG
CONFIRMATION_DIALOG
ALERT_DIALOG
RECOVERY_DIALOG
CONFLICT_DIALOG
AUTHORIZATION_DIALOG
PROGRESS_DIALOG
```

Candidate window roles remain independent:

```text
DOCUMENT_WINDOW
TOOL_WINDOW
INSPECTOR_WINDOW
ACTIVITY_WINDOW
PALETTE_WINDOW
UTILITY_WINDOW
```

An application window may host multiple dialog roles over time. A dialog role does not redefine the window's semantic identity.

```text
ALERT_DIALOG != ERROR_STATE
PROGRESS_DIALOG != EFFECT_PROGRESS_AUTHORITY
AUTHORIZATION_DIALOG != AUTHORIZATION_AUTHORITY
RECOVERY_DIALOG != RECOVERY_TRUTH
```

The UI projects evidence and decisions; it does not become their authority.

## Finding 8 — dismissal needs a policy matrix, especially under stacked dialogs

Candidate dismiss policies:

```text
ESCAPE_ALLOWED
EXPLICIT_ACTION_ONLY
BACKDROP_DISMISS_ALLOWED
BACKDROP_DISMISS_FORBIDDEN
DIRTY_DECISION_REQUIRED
EFFECT_REQUALIFICATION_REQUIRED
NON_DISMISSABLE_UNTIL_LOCAL_TRANSITION_SETTLES
```

`Escape` targets the topmost active modal in the current surface, not every ancestor. Dismissing a child must not cascade-close parents unless the workflow contract explicitly declares replacement/cascade semantics.

```text
ESCAPE != CANCEL_EFFECT
ESCAPE_CHILD != CLOSE_MODAL_STACK
BACKDROP_CLICK != SAFE_DISCARD
DIALOG_DISMISSED != COMMAND_REJECTED
```

A truly non-dismissable modal must still provide an accessible path to resolution; trapping users because of a failed network call is not a valid recovery strategy.

## Finding 9 — modality must not be used as concurrency control

A modal can reduce accidental duplicate interaction on one surface, but cannot fence other surfaces, browser contexts, collaborators, automations or already-admitted effects.

```text
MODAL_OPEN != TARGET_LOCKED
UI_INERT != RESOURCE_LOCKED
BUTTON_DISABLED != DUPLICATE_EFFECT_FENCED
ONE_ACTIVE_DIALOG != ONE_ACTIVE_COMMAND_GLOBALLY
```

Concurrency/idempotency/fencing remain Command Registry / effect-domain responsibilities.

## Finding 10 — responsive behavior may change presentation, never semantic scope

On narrow screens, a window-modal dialog may become a full-screen sheet/page-like surface. This is a representation change only.

```text
DIALOG_DESKTOP -> FULLSCREEN_DIALOG_MOBILE
```

The same modal owner, command input session, dirty state, dismissal policy, focus semantics and effect lineage survive.

A full-screen mobile dialog must not be mistaken for a new Workspace, Application or Window merely because it occupies the whole viewport.

## Finding 11 — Componentes impact

### Primitive / atomic

- `ModalScopeIndicator`
- `ModalRoleIndicator`
- `InertnessDispositionIndicator`
- `FocusReturnDispositionIndicator`
- `DismissPolicyIndicator`
- `ModalRecoveryIndicator`

### Compound

- `DialogTitleRegion`
- `DialogActionRegion`
- `ModalContextSummary`
- `BlockedParentIndicator`
- `OrphanedModalBanner`
- `CrossSurfaceModalNotice`
- `ModalRecoverySummary`

### Module component / tool

- `ModalOwnershipRegistry`
- `ModalStackController`
- `FocusLineageResolver`
- `InertnessCoordinator`
- `DialogDismissalController`
- `CrossSurfaceModalCoordinator`
- `OrphanedModalRecoveryController`

### Application / window

- application/window supplies semantic owner and context;
- dialog surfaces project command/input/recovery contracts;
- Window Manager exposes owner-window lifecycle changes to modal coordination;
- owner window does not inherit business authority from a dialog;
- child dialog does not own the parent application's canonical state.

### Desktop / workspace / system view

- Desktop coordinates visible modal lineage per surface;
- Workspace retains recoverable command/draft/effect references independent of modal presence;
- cross-surface modality is represented as coordination state, never presumed global inertness;
- Status/Activity remains accessible even when an originating modal/window disappears where policy permits;
- system views may show blocked/recovery states but do not become modal authority.

Candidate `Componentes` metadata:

```text
modalRole?
modalScope?
ownerScope?
parentModalPolicy?
initialFocusPolicy?
focusReturnPolicy?
dismissPolicy?
backdropPolicy?
inertnessPolicy?
recoveryPolicy?
smallScreenProjection?
```

## Finding 12 — accessibility proof obligations are structural

- Modal focus must enter the active dialog and remain within its effective local modal scope.
- Background content declared modal must actually be non-interactive; `aria-modal=true` cannot be used as decoration.
- `Escape` and explicit close/cancel semantics target the correct topmost dialog and do not fabricate effect cancellation.
- Focus return is deterministic and requalified if the invoker disappeared or became invalid.
- Nested dialogs preserve point-of-regard when returning to a parent.
- Dialogs expose an accessible name; descriptions are used only when they improve comprehension.
- Large structured content should preserve semantic reading order rather than flattening everything into one description.
- Small-screen/full-screen projection preserves the same semantic dialog and provides a visible close/resolution path.
- Cross-surface coordination cannot rely on visual dimming or color alone.
- Keyboard-only operation must open, traverse, resolve, dismiss and recover dialogs without drag/pointer dependence.

## Finding 13 — performance/lifecycle bounds

Modal state is small, but content behind or inside dialogs may be expensive.

Candidate rules:

- opening a modal may pause nonessential rendering/animation in its blocked local surface but cannot fabricate suspension of application/runtime lifecycle;
- blocked background windows may reduce rendering work, yet semantic subscriptions/effect tracking follow their own lifecycle policy;
- nested dialogs should not duplicate entire owner-window state snapshots; retain stable references plus bounded recovery payloads;
- expensive dialog content may lazy-load, but focus cannot be moved into an unready phantom surface;
- if modal content loading fails, expose recoverable failure with a deterministic exit/retry path rather than permanent inertness;
- high dialog depth should be bounded by interaction design/conformance, not by silently dropping ancestors;
- multi-surface coordination messages are hints/projections unless backed by authoritative workspace/effect guards.

```text
BACKGROUND_RENDER_THROTTLED != APPLICATION_SUSPENDED
DIALOG_CONTENT_LOADING != DIALOG_READY_FOR_FOCUS
MODAL_VISIBLE != MODAL_OPERABLE
```

## Adversarial scenarios

1. Window A opens dialog A; A opens dialog B. `Escape` closes B and returns focus into A, not to the desktop.
2. Dialog B closes after A's underlying revision became stale. A is restored as stale/requalification-required, not silently ready.
3. Invoker button is removed while dialog is open. Focus returns to a declared logical successor.
4. Destructive confirmation opens. Initial focus favors a safe action rather than the destructive default.
5. Dialog is visually modal but background remains keyboard-clickable. Conformance fails; `aria-modal=true` is not permitted as a cosmetic patch.
6. Modal dialog exists in an iframe/application document. Outer shell remains interactive unless shell-level policy separately coordinates it.
7. Detached surface S1 opens a workspace-sensitive modal while S2 remains reachable. S2 command admission still enforces workspace invariants independently of S1's UI state.
8. S2 does not receive a coordination message. No global-lock claim is fabricated.
9. Owner window is minimized while a recoverable command-input dialog is open. Input lineage remains recoverable; minimize does not cancel it.
10. Owner window crashes with an admitted effect pending. Dialog disappears, effect remains pending/unknown in Status/Activity and recovery.
11. Dirty child dialog receives backdrop click. Dismissal follows dirty-decision policy rather than implicit discard.
12. Network fails while a nominally non-dismissable progress dialog is open. User retains an accessible recovery/exit path; UI does not become a dead-end.
13. Mobile projection turns a dialog into a full-screen surface. It remains the same dialog scope/session.
14. Focused window changes because another browser surface gains OS focus. This does not silently transfer modal ownership or semantic selection.
15. Three nested dialogs exist and middle owner becomes invalid. Recovery resolves lineage explicitly rather than restoring focus into an invalid ancestor.
16. Background rendering is throttled while modal is active. Runtime/effect health is not inferred from rendering cadence.

## Proof obligations

- PO1: every modal declares semantic scope and owner; z-index/backdrop cannot infer either.
- PO2: browser document modality is never promoted to workspace-wide modality without separate proof/coordination.
- PO3: the active nested modal has deterministic focus containment and parent lineage.
- PO4: closing a child requalifies the parent before restoring active interaction.
- PO5: focus return handles missing/inert/stale invokers with a logical successor.
- PO6: `aria-modal=true` is emitted only when effective interaction behavior is actually modal for that scope.
- PO7: cross-surface command safety relies on authoritative admission guards, not focus traps or coordination heartbeats.
- PO8: owner-window close/crash cannot silently discard recoverable drafts or relabel pending/unknown effects.
- PO9: dismissal semantics distinguish dialog close, input discard, command cancel and effect cancellation.
- PO10: modal UI never acts as concurrency/fencing authority.
- PO11: small-screen representation preserves modal scope, lineage, dismissal and recovery semantics.
- PO12: blocked/background rendering optimizations do not alter application/runtime/effect lifecycle truth.
- PO13: loading/failure inside a modal preserves an accessible exit/retry path and cannot strand the workspace inert.
- PO14: all modal interactions remain keyboard/screen-reader operable without drag or pointer dependence.

## Deduplication / relationship to existing research

This artifact does not redefine:

- Command Registry applicability/authority/currentness;
- Command Input parameter/confirmation transactions;
- bulk per-target execution;
- WorkspaceSession recovery envelope;
- Window lifecycle residency/suspension;
- Undo/Revert/Compensation history semantics;
- semantic Canvas or 3D navigation.

It adds the missing interaction-ownership layer between Window Manager, dialogs, focus/inertness and multiple display/browsing surfaces.

Preserved invariants include:

```text
Client != Workspace != Desktop != Application != Window
Window lifecycle != runtime lifecycle
Browser tab != SB tab
Display Surface != Workspace
SELECTED != FOCUSED
STALE != CURRENT
UNKNOWN != SUCCESS
BLOCKED != DISABLED
PENDING != EFFECTIVE
3D projection != navigation foundation
```

New bounded invariants:

```text
Modal visual layer != modal scope
Top layer != workspace authority
Document blocked != workspace blocked
Focus trap != distributed lock
Modal lease != business lease
UI inert != resource locked
Child dialog closed != parent transaction committed
Owner window crashed != effect cancelled
```

## Maturity and remaining gaps

Slice maturity: `MATERIAL_DELTA / PARTIALLY_MATURE`.

The nested/cross-window modal boundary is materially specified enough for later synthesis, but G4 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and no overlay/dialog/window provider is selected.

Highest-value next vectors:

1. shell-level Application Registry lifecycle: `available/installed/permission-visible/loaded/suspended/failed/recovering` without conflating application presence with runtime/deployment lifecycle;
2. delegated Client/Workspace access transitions and what must close/requalify when the effective principal/context changes while windows remain open;
3. Componentes catalog/playground conformance model proving shared component state matrices across Ribbon, Window Manager, Inspector, Status/Activity, dialogs and small-screen projections.
