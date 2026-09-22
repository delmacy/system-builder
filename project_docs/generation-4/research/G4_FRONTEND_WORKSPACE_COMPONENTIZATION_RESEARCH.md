# G4 — Frontend Workspace & Componentization Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

> NOTE: Existing findings F1–F33 and the C0–C11 complexity ladder remain authoritative research context. This revision records the next material delta after focus routing: command concurrency/cancellation and accessible announcement ownership. Historical evidence and earlier detailed sections remain available in Git history and sibling research artifacts.

## Research delta — Command Concurrency, Cancellation & Announcement Ownership

### Problem

The stable shell permits the same semantic command to be invoked from Ribbon, context menu, shortcut, Command Palette or Inspector while async work, live updates, projection handoffs and effect verification may still be active. Existing research establishes command identity and `ACK != effect`, but not who owns an in-flight invocation, what a second invocation means, how cancellation differs from rollback, or how status changes are announced without notification overload.

This is material at Tool/Workspace/Task Page level: without an invocation contract, two UI regions can race the same operation, stale completions can overwrite newer state, and accessibility feedback can become either silent or excessively interruptive.

### Evidence reviewed

- DOM/MDN `AbortController`/`AbortSignal`: cancellation is a signal to an underlying asynchronous operation; Promise itself has no first-class cancellation. An abort can carry a reason, and combined cancellation sources are possible. This supports separating invocation cancellation from semantic rollback/effect compensation.
- Fluent 2 Toast guidance: assertive live announcements interrupt screen-reader output and should not be overloaded; similar concurrent processes should be summarized rather than producing many repetitive toasts.
- Fluent 2 Skeleton guidance: live regions can become disruptive when overused; `aria-busy` can defer announcement until a larger region reaches a coherent state, and loading transitions should not disrupt keyboard focus.
- React Spectrum Toast: notifications form a navigable region, actionable notifications should not auto-dismiss, and focus restoration is explicit. This supports persistent/reviewable notification surfaces for consequential states rather than ephemeral-only feedback.

These are interaction evidence, not provider selections.

### F34 — Semantic command identity and invocation identity are distinct

Candidate research contract:

```text
CommandInvocation
  invocationId
  commandId
  semanticTargets[]
  sourceSurface
  sourceFocusReturnAnchor?
  revision/currentnessBasis
  environment/mode
  authoritySnapshot
  idempotencyClass
  concurrencyPolicy
  cancellationPolicy
  effectVerificationPolicy
  startedAt
  status
```

`commandId` remains identical across Ribbon/context menu/shortcut/palette/Inspector, but every execution receives a distinct `invocationId`.

Rules:

```text
same command presentation != same invocation
same target + same command MAY deduplicate only when contract declares it safe
second invocation MUST NOT implicitly cancel first
cancel request != rollback
transport abort != proof that server-side/effect work did not occur
late completion MUST be correlated to its invocation/revision basis
```

### F35 — Concurrency must be policy-qualified, not inferred from disabled UI

Candidate policies:

```text
SINGLE_FLIGHT_PER_TARGET
DEDUPE_EQUIVALENT
SUPERSEDE_OLDER_LOCAL_READ
QUEUE_ORDERED
ALLOW_PARALLEL
REJECT_WHILE_PENDING
SERIALIZE_BY_SCOPE
```

A command may remain visually enabled while policy decides that a second invocation is queued, deduplicated or rejected with explanation. Conversely, disabling every command during any pending work is unacceptable because `BLOCKED != DISABLED` and unrelated operations may remain valid.

For mutation commands, superseding a request is particularly dangerous once ACK may already have occurred. `SUPERSEDE` therefore cannot mean “pretend the earlier effect never happened”.

### F36 — Cancellation has four semantically different outcomes

```text
CANCEL_REQUESTED
LOCAL_WAIT_ABORTED
REMOTE_STATUS_UNKNOWN
EFFECT_CONFIRMED_NOT_APPLIED
```

and, where supported separately:

```text
COMPENSATION_REQUESTED
COMPENSATED
COMPENSATION_FAILED
```

The UI must not collapse these into `CANCELLED` unless the effect contract actually proves non-application. If the client stops waiting after a remote ACK, the honest state may be `UNKNOWN / verification required`.

This directly reinforces `ACK != effect`, `UNKNOWN != SUCCESS` and `PENDING != EFFECTIVE`.

### F37 — Shell regions need an Operation Registry, not independent spinners

Candidate workspace-level projection:

```text
OperationRegistry
  activeInvocations[]
  recentlyCompleted[]
  failedOrUnknown[]
  targetLocks/serializationScopes[]
  verificationPending[]
  recoveryActions[]
```

Ribbon, Inspector, Status/Activity and WorkSurface project the same invocation state. They do not each own separate loading truth.

Consequences:

- Inspector save and Ribbon save cannot create unrelated pending states for the same invocation.
- Status/Activity becomes the durable location for background/long-running/unknown operations.
- WorkSurface may show local progress overlays without becoming effect authority.
- projection/workspace switch does not orphan an operation; its semantic target and invocation remain discoverable.

### F38 — Async announcements need semantic priority and aggregation

Candidate announcement classes:

```text
SILENT_VISUAL
POLITE_STATUS
ASSERTIVE_FAILURE
PERSISTENT_REVIEW_REQUIRED
```

Suggested qualification:

```text
routine loading/progress -> usually visual or bounded polite status
successful autosave -> avoid repetitive assertive announcement
user-requested command completion -> polite when useful
validation/rejection needing immediate correction -> contextual + qualified assertive
UNKNOWN effect / authority-sensitive failure / reconciliation required -> persistent review surface; announcement according to urgency
many similar operations -> aggregate summary, not N announcements
```

No important state may exist only in a transient toast. Toast/announcement is a projection of operation state, not its storage.

### F39 — Announcement ownership follows semantic change, not rendering frequency

Large-scene Canvas updates, live telemetry and observed-path movement can render many times per second. Assistive announcements must be generated from qualified semantic transitions rather than frame/render events.

Examples:

```text
rendered position changed -> no announcement by default
selection changed by user -> contextual announcement where useful
Gate PENDING -> PASS -> one qualified transition announcement
100 work items progress -> aggregate progress/status, not 100 live-region events
current revision becomes STALE -> announce once and expose persistent reconciliation state
observed deviation appears -> persistent finding + bounded announcement
```

This prevents performance rendering cadence from becoming accessibility notification cadence.

### F40 — Cross-workspace handoff must preserve operation observability

`ProjectionHandoff` should not carry ownership of operations, but destination workspaces need enough correlation to surface operations affecting the handed-off identity.

Candidate relation:

```text
ProjectionHandoff.semanticTarget
  -> query OperationRegistry by canonical target/scope
  -> destination renders relevant pending/unknown/reconciliation markers
```

A user who starts publish in one projection and opens Deployment before verification completes must see `verification pending`, not infer success from navigation or from the existence of a downstream deployment object.

### F41 — Multi-selection needs scope-qualified command semantics before UI batching

A remaining adjacency to concurrency is multi-selection. Research candidate:

```text
SelectionSet
  canonicalIds[]
  primaryId?
  aggregateRepresentative?
  revisionBasisPerTarget
```

A command over a selection set must declare:

```text
ALL_OR_NOTHING
BEST_EFFORT_PARTIAL
SERIAL_PER_TARGET
PARALLEL_BOUNDED
PREVIEW_THEN_APPLY
```

Partial success is therefore an operation outcome, not a generic success toast. Aggregated Canvas representation cannot erase per-target failure/unknown states; Inspector/Activity must permit drill-down.

## Complete-task scenario additions

```text
S-CC-01 — duplicate save surfaces
Inspector Save starts invocation X
-> Ribbon Save invoked before X completes
=> policy deduplicates/queues/rejects explicitly; no second hidden mutation

S-CC-02 — publish after ACK
Publish -> ACK -> verification pending
-> user requests cancel
=> local waiting may abort, but UI does not claim unpublished until effect is verified

S-CC-03 — stale late completion
edit revision R1 -> save X
-> external R2 arrives -> reconcile to R3
-> late completion for X arrives
=> X cannot overwrite R3; completion remains correlated to R1 basis

S-CC-04 — cross-workspace pending effect
publish from Main Composition
-> Open in Deployment before verification
=> destination shows same operation/effect status; downstream object is not proof of effectiveness

S-CC-05 — 200 similar operations
bulk action on 200 modules
=> bounded concurrency; aggregate progress; partial/unknown targets remain inspectable; no 200 assertive announcements

S-CC-06 — live conformance burst
many observed path events arrive
=> renderer updates may batch; semantic gate/deviation transitions remain durable and announcements are aggregated by priority

S-CC-07 — fatal surface failure during operation
3D WorkSurface fails while mutation is pending
=> OperationRegistry survives; accessible peer projection exposes pending/unknown state and recovery action
```

## Componentes impact

Add research metadata candidates for C3+ command-capable components:

```text
commandIds[]
invocationOwnership
concurrencyPolicy
idempotencyClass
cancellationPolicy
effectVerificationPolicy
operationRegistryProjection?
announcementPolicy
aggregationPolicy
lateCompletionPolicy
multiSelectionPolicy?
```

Proof depth:

```text
C1/C2
  pending presentation + focus stability
C3/C4
  semantic target/revision correlation
C5/C6
  same command identity across faces/tools; duplicate invocation tests
C7
  renderer failure/live-update independence from operation ownership
C8
  workspace OperationRegistry + cross-region consistency
C9
  end-to-end ACK/verify/cancel/partial/reconcile/recover
C10
  cross-workspace operation observability and late-result safety
C11
  bounded bulk concurrency + announcement aggregation under stress
```

## Complexity impact

No new C-class is required, but command concurrency becomes a dependency before C6/C8 can be considered mature:

```text
C3 identity/currentness
 -> CommandInvocation qualification
 -> C5 semantic target operations
 -> C6 command surfaces
 -> OperationRegistry
 -> C8 workspace orchestration
 -> C9 complete-task effects/recovery
 -> C10 cross-workspace observability
 -> C11 bulk/stress proof
```

Planning implication: do not freeze Ribbon/Inspector command behavior merely from visual Command Registry identity. Invocation/concurrency/effect semantics must be defined first.

## Adversarial additions

1. Ribbon and Inspector launch duplicate mutation because each owns its own spinner.
2. User aborts HTTP wait after ACK and UI reports semantic cancellation.
3. Late R1 completion overwrites reconciled R3 state.
4. Workspace switch hides an UNKNOWN effect and destination appears successful.
5. Bulk partial success is summarized as green success.
6. Every telemetry/render event becomes a live-region announcement.
7. Assertive toast storm interrupts task completion.
8. Important UNKNOWN/reconciliation state disappears when toast auto-dismisses.
9. Disabling the whole Ribbon is used as a substitute for concurrency policy.
10. Aggregate cluster hides one failed target in a successful majority.

## Maturity / next vector

Material delta: **YES**.

The research now distinguishes command definition, invocation, cancellation, effect verification and announcement ownership. This closes a major orchestration gap between Tool/Workspace and Complete Task Page levels.

Highest-value remaining vectors: multi-selection semantics under heterogeneous revisions/authority (F41 is only an initial boundary), notification history/reconciliation UX for long-lived operations, and empirical performance budgets for 3D picking/LOD/labels at 200 vs ~1000 modules.