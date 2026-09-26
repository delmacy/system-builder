# G4 — Web Desktop Bulk / Multi-Target Command Execution Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment
Date: 2026-09-22

## Purpose

Bounded research into bulk/multi-target command execution for the shared Command Registry. This artifact extends `G4_WEB_DESKTOP_COMMAND_REGISTRY_RESEARCH.md`; it does not authorize implementation or define business authority.

## Evidence classes

### E1 — mature batch API semantics

Microsoft Graph JSON batching returns an individual response/status per request; an outer successful batch response does not imply every member succeeded. Responses can arrive in a different order and are correlated by explicit IDs. Dependencies are explicit (`dependsOn`), and a failed prerequisite can produce Failed Dependency for downstream work. This is strong evidence against one aggregate success boolean and against positional correlation.

### E2 — protocol-level multi-status semantics

WebDAV RFC 4918 defines `207 Multi-Status`: one operation envelope can contain resource-specific success/failure information, and the caller must inspect member results. This is portable evidence for per-target result identity rather than transport-envelope success.

### E3 — operational lifecycle evidence

Kubernetes deletion demonstrates that request/acknowledgement and effective disappearance can be separated by graceful termination/finalization. Force deletion may stop waiting for confirmation while underlying processes can still exist. This supports retaining ACK/verification/effective distinctions per target in bulk operations.

## Finding 1 — a bulk command is one user intent over an explicit target set, not one semantic effect

Candidate identity:

```text
BulkCommandIntent {
  bulkIntentId
  commandId
  targetSetSnapshotId
  targets[] { targetId, targetRevisionRef?, targetEnvironmentRef? }
  parameterSnapshotRef?
  executionPolicy
  dependencyGraphRef?
  initiatedFromContextRef
}
```

The target set is captured explicitly at admission. Selection changing afterward MUST NOT silently expand/shrink an admitted batch.

```text
BULK_INTENT != SINGLE_EFFECT
BULK_TRANSPORT_SUCCESS != ALL_TARGETS_SUCCESS
SELECTION_NOW != ADMITTED_TARGET_SET
TARGET_INDEX != TARGET_IDENTITY
```

## Finding 2 — qualification is per target before aggregate disposition

Each target receives an independent qualification vector:

```text
TargetQualification {
  applicability = APPLICABLE | NOT_APPLICABLE | UNKNOWN
  authority = AUTHORIZED | UNAUTHORIZED | UNKNOWN | STALE
  currentness = CURRENT | STALE | UNKNOWN
  readiness = READY | BLOCKED | INPUT_REQUIRED | DEPENDENCY_PENDING
}
```

Aggregate preflight is derived, never authoritative:

```text
ALL_ADMISSIBLE
PARTIALLY_ADMISSIBLE
NONE_ADMISSIBLE
QUALIFICATION_UNKNOWN
```

Policy decides whether partial admission is legal:

```text
ALL_OR_NOTHING_ADMISSION
EXECUTE_ADMISSIBLE_SUBSET
REQUIRE_EXPLICIT_SUBSET_CONFIRMATION
```

`ALL_OR_NOTHING_ADMISSION` only means admission policy. It does NOT manufacture transactional atomicity across remote effects.

## Finding 3 — per-target execution/result algebra

Candidate member lifecycle:

```text
NOT_ADMITTED
ADMITTED
REQUESTED
PENDING
ACKNOWLEDGED
VERIFYING
EFFECTIVE
REJECTED
FAILED
EFFECT_UNKNOWN
SKIPPED_DEPENDENCY
CANCEL_REQUESTED
CANCELLED_CONFIRMED
```

Candidate aggregate disposition is a fold over member truth:

```text
BulkDisposition {
  total
  admitted
  effective
  failed
  rejected
  unknown
  pending
  skipped
  cancelled
  retryableSubset[]
  unresolvedSubset[]
}
```

Aggregate labels MUST remain evidence-preserving. `PARTIAL` is not an intermediate synonym for success; it means material member dispositions differ.

```text
SOME_EFFECTIVE + SOME_FAILED = PARTIAL
SOME_EFFECTIVE + SOME_UNKNOWN = PARTIAL_WITH_UNKNOWN
ALL_ACKNOWLEDGED != ALL_EFFECTIVE
OUTER_200 != BULK_SUCCESS
```

## Finding 4 — dependency graphs make skipped/failed-dependency first-class

Independent targets may execute in parallel. Dependent targets require an explicit DAG/ordering contract. A prerequisite failure cannot be flattened into the same semantic class as direct target rejection.

```text
DIRECT_FAILURE != SKIPPED_DEPENDENCY
DEPENDENCY_FAILED != TARGET_INAPPLICABLE
RESPONSE_ORDER != EXECUTION_ORDER
```

The UI needs inspectable causal edges for dependent batches, but those edges are command-execution dependencies, not architectural semantic relations.

## Finding 5 — retry is a new bounded intent over a subset

Retry MUST NOT replay the original target set blindly. Candidate retry eligibility is computed per member from effect identity, idempotency/concurrency policy, currentness, authority and failure class.

```text
RetrySubset = {
  failedRetryable
  rejectedAfterRequalification?
  unknownOnlyIfEffectIdentityCanBeSafelyReconciled
}
```

Before retry:

```text
CAPTURE_RETRY_SUBSET
 -> REQUALIFY_TARGETS
 -> RECONCILE_UNKNOWN_EFFECTS
 -> ADMIT_RETRY_INTENT
```

```text
RETRY_FAILED != REPLAY_ALL
UNKNOWN != SAFE_TO_RETRY
PREVIOUSLY_AUTHORIZED != AUTHORIZED_NOW
PREVIOUSLY_CURRENT != CURRENT_NOW
```

A retry receives its own intent/effect correlation while retaining lineage to the original bulk intent.

## Finding 6 — bulk cancellation is also per-target and non-atomic unless proven otherwise

`Cancel` may mean cancel pending admission, request cancellation of an admitted effect, or close presentation. These remain distinct.

```text
CLOSE_PROGRESS_VIEW != CANCEL_BULK
CANCEL_REQUESTED != CANCELLED_CONFIRMED
CANCEL_SOME != ROLLBACK_EFFECTIVE_MEMBERS
```

Already-effective external effects require explicit compensation semantics if reversible; UI undo cannot imply rollback.

## Finding 7 — Status/Activity owns durable bulk progress projection

Ribbon/menu/palette initiates the command but does not own long-running truth. After admission, `BulkExecutionTracker` projects durable member results into Status/Activity and can be reopened from any window/surface with sufficient authority.

Closing/minimizing/suspending the initiating window does not cancel or complete the batch. Recovery stores effect references and requalifies member state.

## Componentization impact

### Primitive / atomic
- `BulkDispositionIndicator`
- `TargetDispositionIndicator`
- `RetryEligibilityIndicator`
- `DependencySkipIndicator`
- `UnknownEffectIndicator`

### Compound
- `BulkCommandSummary`
- `BulkTargetResultRow`
- `BulkPreflightSummary`
- `RetrySubsetSummary`
- `BulkProgressMeter` (counts, never color-only)

### Module component / tool
- `BulkCommandPreflight`
- `BulkExecutionTracker`
- `BulkResultInspector`
- `RetrySubsetBuilder`
- `DependencyResultInspector`
- `BulkActivityItem`

### Application/window/desktop/workspace
- command surfaces contribute initiation only;
- Status/Activity projects durable progress and unresolved effects;
- workspace supplies revision/environment/authority/currentness evidence per target;
- recovery rehydrates target/effect references without upgrading their dispositions.

Candidate Componentes metadata:

```text
bulkCapable?
bulkAdmissionPolicy?
bulkDependencyContract?
bulkRetryContract?
bulkCancellationContract?
perTargetResultContract?
aggregateDispositionContract?
```

## Accessibility / responsive findings

- Bulk preflight and results require a textual/table/list representation; spatial selection is never mandatory.
- Mixed results need counts plus labels; color alone cannot convey success/failure/unknown.
- Keyboard users can inspect failed/unresolved targets, select a retry subset and invoke retry without drag/marquee interaction.
- Virtualization may remove offscreen rows from rendering but MUST preserve counts, search/filter semantics, target identity and retry selection.
- Small-screen surfaces may collapse details into grouped counts with drill-down, but cannot collapse `UNKNOWN` into failed/success.
- Progress announcements should summarize meaningful count/status changes rather than announce every high-frequency member event.

## Performance findings

For high target counts, per-target truth is retained while presentation is aggregated/virtualized. Candidate strategy:

```text
semantic member ledger (complete)
 -> incremental aggregate counters/indexes
 -> virtualized/filterable result projection
```

Do not recompute every predicate/result across every visible command surface on each member event. Target correlation uses stable IDs, not response order. Large result sets may stream/merge incrementally; `aggregation != silent omission` remains mandatory.

## Adversarial scenarios

1. 100 selected targets: 80 authorized/current, 10 unauthorized, 5 stale, 5 unknown.
2. Partial-admission policy executes only 80; UI must not report 100 attempted/succeeded.
3. Outer batch request succeeds while individual members fail.
4. Member responses arrive out of request order; target IDs preserve correlation.
5. Dependency A fails; B is skipped due to dependency, not mislabeled direct failure.
6. 70 targets become effective, 20 fail, 10 remain effect-unknown after network loss.
7. User clicks retry failed: unknown members are not blindly replayed.
8. Permission is revoked for part of retry subset between first run and retry admission.
9. Revision changes for one target while bulk confirmation dialog is open.
10. Initiating window crashes while batch continues; Status/Activity restores progress from effect refs.
11. User closes progress UI; remote batch continues unchanged.
12. Cancel request succeeds for pending members but already-effective members remain effective.
13. Virtualized list hides 900 of 1000 rows; aggregate counts and unresolved subset remain exact.
14. Small-screen user filters to failed/unknown targets and builds retry subset without drag.

## Proof obligations

1. Every admitted target has stable correlation identity independent of order/rendering.
2. Aggregate success can be proven only from member dispositions required by policy.
3. `ACK` cannot become `EFFECTIVE` merely because the batch envelope completed.
4. Partial admission is explicit and target counts distinguish selected/admitted/attempted/effective.
5. `UNKNOWN` members are never automatically classified retryable.
6. Retry requalifies authority/currentness/applicability for its exact subset.
7. Dependency skips remain distinguishable from direct failures.
8. Closing/minimizing/suspending a command surface cannot mutate effect state.
9. Recovery cannot erase unresolved member effect identity.
10. Virtualization/aggregation cannot omit material failure/unknown/rejected categories.
11. Keyboard/non-spatial operation can inspect and retry subsets equivalently.
12. `ALL_OR_NOTHING_ADMISSION` cannot be presented as transactional atomicity unless the underlying effect contract proves atomic commit/rollback.
13. Cancellation cannot imply rollback of already-effective members.
14. Response order cannot be used as target correlation.

## Deduplication

This artifact does not redefine command identity, business authorization, effect authority, Status/Activity ownership or recovery envelopes. It specializes the existing Command Registry contract for cardinality > 1 and consumes existing `ACK != effect`, `STALE != CURRENT`, `UNKNOWN != SUCCESS`, and recovery invariants.

## Maturity / remaining gaps

This slice is `MATERIAL_DELTA / PARTIALLY_MATURE`.

Material gaps before implementation planning:

1. command parameter/input transaction model for multi-step dialogs and inspectors;
2. undo/redo/compensation boundaries across local draft, canonical mutation and external effects;
3. Status/Activity retention, privacy and delegated-client visibility for bulk histories;
4. empirical scale budgets for 1k+ target result ledgers and predicate invalidation;
5. command contribution namespacing/versioning across replaceable applications;
6. cross-window ownership of confirmation/preflight dialogs;
7. security of per-target rejection/unavailability reasons.

Next recommended vector: command parameter/input transaction model and confirmation ownership, followed by undo/redo versus compensation semantics.