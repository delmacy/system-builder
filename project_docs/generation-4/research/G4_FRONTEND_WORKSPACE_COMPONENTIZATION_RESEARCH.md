# G4 — Frontend Workspace & Componentization Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

> NOTE: Existing findings F1–F41 and the C0–C11 complexity ladder remain authoritative research context. This revision records the next material delta after command concurrency/cancellation: heterogeneous multi-selection, bulk eligibility and aggregate-state preservation. Historical evidence and earlier detailed sections remain available in Git history and sibling research artifacts.

## Research delta — Heterogeneous Multi-selection, Bulk Eligibility & Aggregate Truth

### Problem

F41 established that selection-set commands need explicit batch semantics, but it did not yet define how a set behaves when targets differ by revision/currentness, authority, semantic compatibility, projection visibility, applicability, operation state or disclosure. This is a material gap from compound component through System View: a visual multi-selection can be valid as a selection while still being invalid, partially eligible or indeterminate for a particular command.

A bulk toolbar must therefore never derive command eligibility from `selection.count > 0` alone, and a 3D aggregate/cluster must not turn a heterogeneous set into a fictitious homogeneous object.

### Evidence reviewed

- W3C WAI-ARIA APG Tree/Treegrid/Listbox patterns: in multi-select composites, focus is independent of selection; selected state persists while focus moves, and keyboard models explicitly support toggling/range selection. This reinforces `SELECTED != FOCUSED` and makes selection-set identity independent from the currently focused representative.
- W3C APG also recommends explicit Select All/Unselect All controls when those functions matter, rather than relying exclusively on hidden modifier-key conventions.
- Carbon Data Table: selection is a distinct table variant; batch-action mode appears after rows are selected and can be exited by cancel/deselect. This is useful evidence for a contextual bulk-command projection, but not evidence that every selected target is eligible for every action.
- Fluent Toolbar: commands are logically grouped, overflow rather than wrap, and destructive/status-changing actions should be separated. This supports projecting bulk commands from the same Command Registry rather than inventing a second bulk command identity.
- Atlassian progress guidance: progress should communicate concrete subprocess state (for example, completed count), supporting per-target/aggregate operation truth rather than an undifferentiated spinner.

These are interaction evidence, not provider selections.

### F42 — Selection membership, primary target and command eligibility are three separate relations

Candidate contract:

```text
SelectionSet
  selectionSetId
  members[]
    canonicalId
    representativeId?
    revisionBasis
    currentness
    disclosureState
    projectionDisposition
  primaryId?
  focusRoute?
  anchorId?
  selectionMode
```

A target can be selected without being the primary target, focused target or eligible target for a command.

```text
SELECTED != PRIMARY
SELECTED != FOCUSED
SELECTED != COMMAND_ELIGIBLE
VISIBLE REPRESENTATIVE != SEMANTIC MEMBER
```

The primary target is useful for Inspector ordering/default context but does not grant semantic precedence over other selected targets.

### F43 — Bulk commands require an eligibility partition, not one boolean

Before execution, a command should qualify the selection into partitions:

```text
BulkEligibility
  eligible[]
  ineligible[]
    reason: INAPPLICABLE | AUTHORITY_DENIED | READ_ONLY |
            STALE | CONFLICTED | BLOCKED | INCOMPATIBLE |
            ALREADY_PENDING | DISCLOSURE_LIMITED | UNKNOWN
  requiresRefresh[]
  requiresReconciliation[]
  unknown[]
```

The command then declares what partitions it permits:

```text
ALL_OR_NOTHING
ELIGIBLE_SUBSET_WITH_PREVIEW
BEST_EFFORT_PARTIAL
SERIAL_PER_TARGET
PARALLEL_BOUNDED
PREVIEW_THEN_APPLY
```

`AUTHORITY_DENIED` must not be rendered as `DISABLED`; `STALE` must not be silently refreshed and executed; `UNKNOWN` must not be counted as eligible success.

### F44 — Heterogeneous revision/currentness must be explicit before mutation

A bulk selection can contain R5 current, R4 stale and a target whose currentness cannot be established. The set does not have one truthful `revision` field.

Candidate:

```text
SelectionRevisionBasis
  perTarget[]
    canonicalId
    revisionId
    currentness
    checkedAt
  aggregateCurrentness:
    ALL_CURRENT | MIXED | ALL_STALE | UNKNOWN
```

Mutation proof must bind each target to its own basis. If a refresh changes membership/eligibility, the UI must show the changed partition before applying a command that was previewed against the old set.

This prevents a bulk operation from laundering stale targets through one fresh primary target.

### F45 — Authority is evaluated per target and per command, never inherited from selection or workspace

Candidate aggregate authority state:

```text
ALL_AUTHORIZED
MIXED_AUTHORITY
NONE_AUTHORIZED
AUTHORITY_UNKNOWN
```

A workspace preset, selected cluster or primary item cannot confer authority to other members. For `ELIGIBLE_SUBSET_WITH_PREVIEW`, the UI may offer the authorized subset only after explaining exclusions. For `ALL_OR_NOTHING`, one denied/unknown required target blocks invocation, but the command remains semantically `BLOCKED/INELIGIBLE`, not visually-equated to a disabled control.

### F46 — Aggregate visual state must preserve minority critical states

For clusters and large scenes, majority voting is unsafe.

Candidate aggregate summaries:

```text
AggregateSemanticState
  memberCount
  eligibleCount
  blockedCount
  staleCount
  unknownCount
  pendingCount
  failedCount
  criticalFindingCount
  mixedState: boolean
```

Rules:

```text
999 SUCCESS + 1 UNKNOWN != SUCCESS
999 CURRENT + 1 STALE != CURRENT
999 PASS + 1 skipped-required-gate != PASS
aggregate label suppression MUST NOT suppress critical minority markers
```

At LOD0/LOD1 the cluster can show a bounded critical-state summary; Inspector/List/Treegrid provides drill-down. This operationalizes `Aggregation != silent omission` for multi-selection and stress scenes.

### F47 — Selection across projections needs membership continuity without geometric continuity

A lasso selection in 3D may map to non-contiguous rows in Treegrid or multiple groups in Deployment. `ProjectionHandoff` therefore preserves canonical membership, not screen geometry.

Destination dispositions are per member:

```text
PRESENT
AGGREGATED
FILTERED_OUT
NOT_MATERIALIZED
STALE_REFERENCE
DISCLOSURE_LIMITED
NO_LONGER_ADMISSIBLE
```

The destination reports a selection summary such as `18 preserved / 3 aggregated / 2 disclosure-limited`, and never silently shrinks the semantic selection because some representatives are unavailable.

A user may explicitly normalize the set to visible/eligible members, but that is a new selection action.

### F48 — Inspector behavior for multi-selection needs common, mixed and non-applicable values

A multi-selection Inspector should not pretend that heterogeneous values are one value.

Candidate field projection:

```text
COMMON(value)
MIXED
NOT_APPLICABLE_TO_SOME
UNAVAILABLE_BY_DISCLOSURE
UNKNOWN
CONFLICTED
```

Editing a `MIXED` field is a bulk command proposal against eligible targets, not an immediate local assignment to one synthetic aggregate object. Faces themselves may be:

```text
APPLIES_TO_ALL
APPLIES_TO_SUBSET(n/N)
APPLIES_TO_NONE
DISCLOSURE_LIMITED
```

This preserves one semantic identity per module and prevents Module Workbox faces from inventing an aggregate owner.

### F49 — Bulk execution needs a durable result matrix

Candidate operation result:

```text
BulkOperationResult
  invocationId
  requestedTargets[]
  startedTargets[]
  notStarted[] + reason
  perTarget[]
    ACK?
    verificationState
    effectState
    evidenceRef?
    reconciliationRequired?
  aggregate:
    ALL_EFFECTIVE | PARTIAL | NONE_EFFECTIVE | UNKNOWN
```

A `BEST_EFFORT_PARTIAL` command can legitimately complete as PARTIAL. The Activity/Status surface must retain the result matrix; a toast may summarize but cannot be the only record.

Progress text should be semantically useful (`143/200 verified; 4 failed; 3 unknown`) rather than merely `73%` when target-level outcomes matter.

### F50 — Selection and operation lifetimes are independent

Deselecting a target after a bulk invocation starts does not cancel its operation. Likewise, switching projection or replacing the selection does not orphan invocation evidence.

```text
selection membership lifetime != invocation lifetime
focus lifetime != selection lifetime
projection representative lifetime != semantic target lifetime
```

The Operation Registry remains target-correlated and lets later selections rediscover relevant pending/unknown/reconciliation state.

## Complete-task scenario additions

```text
S-MS-01 — mixed revision bulk edit
select A@R5 CURRENT, B@R4 STALE, C@UNKNOWN
-> edit common configuration
=> preview partitions A eligible, B reconcile/refresh, C unknown;
   no command reports all three ready

S-MS-02 — mixed authority
select 20 modules, authorize operation
=> 17 authorized, 2 denied, 1 unknown;
   ALL_OR_NOTHING blocks with reasons;
   eligible-subset mode requires explicit preview/confirmation

S-MS-03 — aggregate minority failure
cluster represents 1000 modules; one required gate failed
=> cluster remains visibly mixed/critical; drill-down locates failure;
   LOD cannot report PASS

S-MS-04 — cross-projection set
lasso 23 modules in 3D -> Open in Deployment
=> canonical 23-member selection preserved;
   destination reports present/aggregated/disclosure-limited dispositions

S-MS-05 — mixed Inspector value
select modules with timeout 30s, 30s, 60s
=> field is MIXED; entering 45s creates qualified bulk proposal,
   not mutation of a synthetic aggregate object

S-MS-06 — partial effect
200-target operation -> 193 effective, 4 failed, 3 unknown
=> aggregate outcome PARTIAL; per-target matrix persists;
   retry/reconcile can target subsets without losing original evidence

S-MS-07 — deselect while running
start bulk publish -> select unrelated module
=> operation continues in Operation Registry; new selection does not inherit pending state,
   but selecting an affected target later reveals correlation

S-MS-08 — keyboard peer representation
multi-select in Tree/Treegrid using explicit keyboard selection model
=> focus moves independently; selection persists; bulk command surface reflects same canonical set as 3D
```

## Componentes impact

Add candidates for selection-capable C2+ components:

```text
selectionMode
primaryTargetPolicy
focusSelectionIndependence
rangeSelectionPolicy
selectAllScope
selectionPersistence
bulkEligibilityProjection
mixedValueProjection
aggregateCriticalStatePolicy
crossProjectionSelectionPolicy
```

For command-capable C5+ components additionally:

```text
bulkExecutionPolicy
perTargetRevisionBasis
perTargetAuthorityQualification
partialOutcomeModel
resultMatrixProjection
retrySubsetPolicy
```

Proof depth:

```text
C2
  keyboard multi-selection; focus != selection; explicit clear/select-all where applicable
C3/C4
  canonical membership survives projection/aggregation
C5
  Module Workbox common/mixed/subset-applicable faces
C6
  contextual bulk command surface from same Command Registry
C7
  3D/graph/list peer selection equivalence
C8
  workspace selection summary + Operation Registry continuity
C9
  preview/partial/retry/reconcile complete-task behavior
C10
  cross-workspace per-member disposition and disclosure safety
C11
  1000-member aggregate truth + bounded command execution
```

## Complexity impact

No new C-class. Multi-selection is a cross-cutting dependency that begins at C2 but becomes semantically expensive at C5+:

```text
C2 selection grammar
 -> C3 canonical SelectionSet + per-member currentness
 -> C4 aggregate/critical markers
 -> C5 mixed-value Module Workbox
 -> C6 bulk Command Registry projection
 -> C8 workspace selection/operation orchestration
 -> C9 bulk task outcome/retry/reconcile
 -> C10 cross-workspace membership continuity
 -> C11 stress/aggregation proof
```

Planning implication: do not estimate multi-select as an atomic checkbox feature. Its UI primitive is low complexity; its semantic orchestration is HIGH/VERY HIGH once revision, authority, partial outcomes and cross-projection continuity are included.

## Adversarial additions

1. Primary selected module's authority is applied to all members.
2. One current primary target makes a mixed stale set look current.
3. Bulk action silently excludes ineligible targets.
4. `999 success + 1 unknown` renders as success.
5. LOD cluster drops the only failed required gate.
6. Cross-view handoff shrinks selection to visible representatives without notice.
7. Inspector writes a MIXED field as though an aggregate object owned the value.
8. Deselecting targets is treated as cancelling their in-flight operations.
9. Select All means only currently rendered/virtualized rows without stating scope.
10. Permission denied is represented as ordinary disabled batch action.
11. Retry of failed subset loses evidence linking it to the original bulk invocation.
12. Keyboard focus movement destroys multi-selection unexpectedly.

## Maturity / next vector

Material delta: **YES**.

The research now distinguishes selection membership, primary/focus, per-command eligibility, per-target revision/currentness and authority, aggregate critical truth, cross-projection membership continuity and durable partial-result matrices. This materially closes F41's open boundary and raises the expected complexity of multi-selection from a component feature to a workspace/task orchestration concern.

Highest-value remaining vectors: long-lived operation history/reconciliation UX (including retries/compensation lineage), empirical picking/LOD/label budgets for 50–200 versus ~1000 modules, and selection semantics when query/filter-based `Select All` represents an unmaterialized set larger than the currently loaded scene.