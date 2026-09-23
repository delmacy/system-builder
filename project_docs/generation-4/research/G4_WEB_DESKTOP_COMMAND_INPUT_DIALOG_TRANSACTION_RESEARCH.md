# G4 — Web Desktop Command Input, Confirmation & Dialog Transaction Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment
Date: 2026-09-22

## Purpose

Bounded research into parameter acquisition, validation, confirmation/dialog ownership and admission for commands projected through Ribbon, Command Palette, menus, Tool Rail, Inspector and equivalent compact surfaces. This extends `G4_WEB_DESKTOP_COMMAND_REGISTRY_RESEARCH.md` and `G4_WEB_DESKTOP_BULK_COMMAND_EXECUTION_RESEARCH.md` without authorizing implementation, choosing a form/dialog library, or transferring business authority to the shell.

The central question is: when a command needs user input or explicit confirmation, what belongs to the command contract, what belongs to a presentation surface, and when does captured input become an admitted execution intent?

## Evidence classes

### E1 — WAI-ARIA APG modal-dialog interaction

The WAI-ARIA Authoring Practices modal dialog pattern requires focus to move inside a modal dialog, keyboard focus to remain contained while modal, `Escape` to close, and focus normally to return to the invoker when the dialog closes. For irreversible or difficult-to-reverse actions, APG recommends considering initial focus on the least destructive action. This is strong evidence that focus policy and destructive-action safety are dialog interaction concerns, not command authority.

### E2 — web-platform dialog lifecycle

The HTML dialog platform distinguishes a close request from an unconditional close. `requestClose()`/platform dismissal can raise a cancelable `cancel` event before closure, whereas `close()` closes without that cancelable request phase. This supports separating `DISMISS_REQUESTED`, `DISMISS_ALLOWED` and `CLOSED`, especially when local input is dirty or command admission is in progress. The platform mechanism remains representation infrastructure, not semantic transaction authority.

### E3 — existing G4 Command Registry / bulk execution boundaries

Existing research already requires `PREFLIGHT_PASS != EXECUTION_ADMISSION`, per-target qualification for bulk commands, and explicit `INPUT_REQUIRED`. This artifact materializes the missing transaction between `INPUT_REQUIRED` and an immutable admitted intent.

## Finding 1 — parameter contract is owned by command semantics; form layout is not

Candidate contract:

```text
CommandParameterContract {
  parameterSchemaId
  commandId
  fields[] {
    parameterId
    semanticType
    cardinality
    requiredness
    constraints[]
    sensitivityClass?
    defaultPolicy?
    derivationPolicy?
  }
  crossFieldConstraints[]
  validationPolicyRef
  evidenceRequirements[]
  confirmationPolicyRef?
}
```

The command owns semantic requirements. A Ribbon popup, modal dialog, Inspector form, inline editor, wizard or compact mobile sheet may project the same contract differently.

```text
PARAMETER_CONTRACT != FORM_LAYOUT
FIELD_VISIBLE != FIELD_REQUIRED
FIELD_DEFAULT_PRESENT != USER_CONSENT
FORM_VALID != COMMAND_ADMITTED
DIALOG_SUBMITTED != EFFECT_REQUESTED
```

Presentation metadata may suggest grouping/order/help/density, but cannot weaken requiredness, authority, currentness or semantic validation.

## Finding 2 — input acquisition is a local draft transaction until admission

Candidate lifecycle:

```text
NO_INPUT_SESSION
 -> INPUT_SESSION_OPEN
 -> PRISTINE | DIRTY
 -> LOCAL_VALIDATING
 -> LOCALLY_VALID | LOCALLY_INVALID | VALIDATION_UNKNOWN
 -> READY_FOR_PREFLIGHT
 -> PREFLIGHT_REQUALIFYING
 -> CONFIRMATION_REQUIRED? | READY_FOR_ADMISSION
 -> ADMISSION_REQUESTED
 -> ADMITTED | REJECTED | BLOCKED | REQUALIFICATION_REQUIRED
```

The input session owns a local parameter draft, not canonical business state.

```text
INPUT_DIRTY != WORKSPACE_DIRTY
INPUT_VALID != BUSINESS_EFFECT_VALID
LOCAL_VALIDATION_PASS != AUTHORITY_PASS
CONFIRMATION_ACCEPTED != EFFECTIVE
```

A command may use pure deterministic local validation for syntax/range/cross-field constraints while still requiring authoritative validation/admission for mutable policy, uniqueness, revision/currentness, authority or external preconditions.

## Finding 3 — defaults, derived values and remembered values require provenance

A default can originate from command policy, current selection, workspace/environment, previous user preference or server suggestion. These origins are materially different.

Candidate value provenance:

```text
EXPLICIT_USER_INPUT
COMMAND_STATIC_DEFAULT
CONTEXT_DERIVED
WORKSPACE_DERIVED
REMEMBERED_PREFERENCE
SERVER_SUGGESTED
RECOVERED_DRAFT
```

For sensitive/destructive/effectful parameters, a prefilled value MUST NOT be treated as affirmative consent merely because it validates.

```text
DEFAULTED != CONFIRMED
DERIVED != AUTHORITATIVE
REMEMBERED != CURRENT
RECOVERED != REVALIDATED
```

If context changes while the dialog remains open, context-derived values become candidates for `STALE_INPUT_CONTEXT`; explicit user values are not silently rewritten unless the contract explicitly declares safe derivation/rebinding semantics.

## Finding 4 — confirmation is an evidence-bearing decision over a frozen intent preview

Confirmation should bind to what the user is authorizing, not merely to a button label. Candidate snapshot:

```text
CommandIntentPreview {
  previewId
  commandId
  targetSetSnapshotId
  parameterSnapshotId
  clientRef
  workspaceRef
  revisionRef
  environmentRef
  materialConsequences[]
  authorityContextRef?
  generatedAt
}
```

Confirmation evidence references the preview/snapshot. Material target, parameter, revision, environment or consequence drift invalidates that confirmation and requires requalification/reconfirmation when policy says the change is material.

```text
CONFIRMED_PREVIEW_A != CONFIRMED_PREVIEW_B
CONFIRMATION != AUTHORIZATION
CONFIRMATION != ADMISSION
CONFIRMATION != EFFECT
```

For bulk commands, confirmation binds to the admitted target-set candidate and parameter snapshot. If partial preflight changes the target set from 100 selected to 80 admissible, confirmation must make that subset explicit; the UI cannot reuse a confirmation whose material scope changed invisibly.

## Finding 5 — dialog ownership is layered

Candidate ownership split:

```text
Command Registry
  owns command identity + parameter/result/effect contract

Input Session
  owns ephemeral parameter draft + local validation state

Dialog/Sheet/Popover Surface
  owns focus containment, layout, dismissal interaction, responsive projection

Workspace Context
  supplies revision/environment/currentness/authority evidence

Execution Boundary
  owns authoritative revalidation + admission

Status/Activity
  owns durable post-admission progress/effect projection
```

Therefore:

```text
DIALOG_OPEN != COMMAND_PENDING
DIALOG_CLOSE != COMMAND_CANCEL
DIALOG_OWNER != BUSINESS_AUTHORITY
MODAL != TRANSACTION LOCK
WINDOW_BLOCKED_BY_MODAL != WORKSPACE LOCKED
```

A modal only makes its containing interaction surface inert. It does not acquire a semantic lock on the selected object, workspace, module or remote runtime.

## Finding 6 — dismissal and cancellation need distinct state machines

Closing an input surface before admission can usually discard/checkpoint only the local input draft. Closing after admission cannot cancel an external effect by implication.

Candidate dismissal lifecycle:

```text
OPEN
 -> DISMISS_REQUESTED
 -> SAFE_TO_DISMISS
    | LOCAL_DRAFT_DECISION_REQUIRED
    | ADMISSION_IN_PROGRESS
    | DISMISS_BLOCKED_BY_LOCAL_POLICY
 -> CLOSED
```

If admission already produced an effect identity, the surface may close while Status/Activity retains progress.

```text
ESCAPE != CANCEL_EFFECT
CLOSE_DIALOG != CANCEL_COMMAND_EFFECT
DISCARD_INPUT_DRAFT != DISCARD_WORKSPACE_DRAFT
ADMISSION_TIMEOUT != EFFECT_FAILED
```

A platform `cancel` event is only a UI dismissal request; it must never be mapped directly to a business cancellation without an explicit command/effect cancellation contract.

## Finding 7 — async validation needs identity, freshness and race handling

Validation that depends on server/workspace state must be correlated to an input snapshot. Candidate:

```text
ValidationAttempt {
  validationAttemptId
  parameterSnapshotId
  contextSnapshotId
  startedAt
  result = VALID | INVALID | UNKNOWN | STALE
  evidenceRefs[]
}
```

If the user edits parameters while validation is in flight, a late result for the old snapshot cannot upgrade the new snapshot.

```text
LATE_VALIDATION_RESULT != CURRENT_VALIDATION_RESULT
VALIDATION_RESPONSE_RECEIVED != INPUT_STILL_SAME
ASYNC_VALID != ADMISSION_CURRENT
```

Debouncing/coalescing are performance mechanisms only; they cannot become semantic validation authority.

## Finding 8 — parameter sensitivity changes persistence/recovery behavior

Not every input draft may be safely persisted in a `WorkspaceSessionEnvelope`. Candidate persistence classes:

```text
RECOVERABLE_PLAINTEXT
RECOVERABLE_PROTECTED
SESSION_ONLY
NON_PERSISTABLE
REENTER_REQUIRED
```

Credentials/secrets or short-lived proof material may require `NON_PERSISTABLE`/`REENTER_REQUIRED`. Recovery may restore the dialog structure and non-sensitive fields while explicitly marking missing sensitive parameters.

```text
DRAFT_RECOVERABLE != EVERY_FIELD_RECOVERABLE
SECRET_PRESENT_BEFORE_CRASH != SECRET_RESTORED
MISSING_RECOVERED_SECRET != ORIGINAL_INPUT_INVALID
```

## Finding 9 — focus and accessibility are contractually testable interaction behavior

For modal confirmation/input surfaces:

- focus moves into the dialog and remains contained while modal;
- `Escape` requests dismissal, subject to local dirty/admission guards;
- focus returns to the invoker or a logical successor when the invoker disappeared;
- destructive/irreversible confirmation should not automatically place focus on the destructive action when a safer initial focus is appropriate;
- errors are associated with fields and a summary/focus path exists for cross-field failures;
- requiredness, invalidity, stale context and permission/authority failures are not conveyed by color alone;
- keyboard-only users can complete, review, confirm, cancel and recover the transaction;
- small-screen projection may become a full-screen sheet/page while preserving the same input/confirmation contract.

`aria-modal` or visual dimming is valid only when interaction outside is actually inert; semantic locks are not inferred from modal presentation.

## Finding 10 — command-input state belongs in Componentes as reusable behavior

### Primitive / atomic
- `ParameterStateIndicator`
- `ValidationStateIndicator`
- `InputProvenanceIndicator`
- `StaleInputContextIndicator`
- `SensitiveInputDispositionIndicator`

### Compound
- `CommandField`
- `CommandFieldGroup`
- `ValidationSummary`
- `IntentPreviewSummary`
- `ConfirmationDisposition`
- `DismissalGuardPrompt`

### Tool / module component
- `CommandInputSession`
- `CommandParameterForm`
- `CommandConfirmationSurface`
- `CommandIntentPreview`
- `AsyncValidationCoordinator`
- `CommandInputRecoveryPanel`

### Application/window/desktop/workspace
- Ribbon/Palette/Menu/Inspector initiate the same command identity;
- Window Manager supplies dialog/sheet ownership and focus-return anchor;
- Workspace supplies qualified context, not form-owned authority;
- Status/Activity receives admitted effect references and outlives the dialog;
- recovery may restore local input sessions subject to sensitivity and context requalification.

Candidate Componentes metadata:

```text
parameterContractRef?
inputSessionPolicy?
confirmationPolicy?
dismissalPolicy?
validationPolicy?
sensitivityPolicy?
recoveryPolicy?
focusPolicy?
smallScreenProjection?
```

## Performance findings

- Parameter schemas/contracts can be cached by immutable identity, but mutable validation/currentness evidence cannot inherit schema lifetime.
- Async field validation should use snapshot IDs and cancellation/coalescing to avoid stale-result churn.
- Expensive dependent pickers/searches should virtualize result presentation and lazy-load data without changing parameter semantics.
- Opening a dialog must not eagerly load unrelated application/window content.
- Bulk target previews should aggregate/virtualize large target sets while retaining exact counts, exceptions and drill-down; `aggregation != silent omission`.
- Re-rendering validation hints must not re-evaluate authoritative guards across every command surface.

## Adversarial scenarios / proof obligations

1. User opens `Publish`, edits parameters, then revision changes remotely before confirmation: confirmation cannot admit stale revision silently.
2. User confirms 100-target bulk intent; preflight admits only 80: changed scope requires explicit subset visibility and policy-qualified reconfirmation.
3. Async uniqueness validation for value A returns after user changed field to B: A result cannot validate B.
4. Dialog is dismissed with dirty local parameters: workspace draft remains untouched unless explicitly linked.
5. `Escape` while remote effect is already admitted: dialog may close, but effect is not cancelled by UI dismissal.
6. Permission is revoked while confirmation dialog is open: admission revalidation rejects/requalifies despite earlier visible enabled state.
7. Environment changes while dialog is open: context-derived defaults become stale; explicit input is not silently rebound.
8. Browser crashes with a recoverable non-sensitive input draft: recovery restores draft lineage but requalifies context/authority/currentness.
9. Browser crashes with a secret field populated: recovery marks re-entry required rather than persisting the secret by convenience.
10. Destructive command dialog opens: keyboard focus policy does not make accidental destructive confirmation the default path.
11. Modal visually dims background but pointer/keyboard can still mutate it: accessibility/conformance failure; `aria-modal` cannot paper over non-modal behavior.
12. Dialog closes after `ADMISSION_REQUESTED` but before response: recovery/Status Activity preserves `UNKNOWN/PENDING` rather than guessing failure.
13. Command invoked from keyboard shortcut and from Ribbon: both use identical parameter/confirmation/admission contract.
14. Small-screen full-page projection replaces modal geometry: semantic input snapshot, validation, confirmation and focus obligations remain equivalent.
15. Local validation says valid while authoritative uniqueness/policy check is unavailable: result is not upgraded to admitted/success.

Proof obligations:

- PO1: no presentation surface can weaken `CommandParameterContract`.
- PO2: every effectful admission binds an immutable target + parameter + context snapshot or equivalent qualified identity.
- PO3: confirmation is invalidated/requalified when its material intent snapshot changes.
- PO4: local validation never substitutes for mutable authority/currentness/business admission.
- PO5: late async validation cannot mutate a newer input snapshot.
- PO6: dismissal never implies external-effect cancellation.
- PO7: modal UI never implies semantic lock/transaction ownership.
- PO8: sensitive parameter persistence follows declared recovery class.
- PO9: keyboard/screen-reader users can complete and abandon the transaction without drag/pointer dependence.
- PO10: focus returns predictably after dismissal/commit, including when the original invoker disappeared.
- PO11: bulk subset changes remain explicit before confirmation/admission.
- PO12: post-admission progress survives closure of the input surface.

## Deduplication / relationship to existing research

This artifact does not redefine command applicability/authority/currentness (`G4_WEB_DESKTOP_COMMAND_REGISTRY_RESEARCH.md`) or bulk per-target result algebra (`G4_WEB_DESKTOP_BULK_COMMAND_EXECUTION_RESEARCH.md`). It fills the bounded gap between `INPUT_REQUIRED` and execution admission: parameter draft, validation, confirmation, dismissal and dialog ownership.

It also preserves the workspace recovery rule that restored UI state cannot upgrade currentness/authority, and the general G4 rule that presentation is never canonical semantic authority.

## Maturity and remaining gaps

Slice maturity: `MATERIAL_DELTA / PARTIALLY_MATURE`.

The command-input/dialog boundary is now materially specified enough for later synthesis, but G4 remains `RESEARCH_ACTIVE / NON_EXECUTABLE`.

Highest-value next vector:

1. formal separation of `undo/redo` for presentation/layout/local draft/canonical mutation from compensation/cancellation of admitted external effects;
2. command history lineage across windows/surfaces and workspace recovery;
3. nested/stacked dialogs and cross-window ownership only if evidence shows they remain material after undo/compensation research.
