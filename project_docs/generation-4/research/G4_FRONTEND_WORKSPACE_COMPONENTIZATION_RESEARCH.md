# G4 — Frontend Workspace & Componentization Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

> NOTE: Earlier findings remain available in Git history and sibling G4 research artifacts. This revision records the next material delta after heterogeneous multi-selection: query/filter-scoped selection whose semantic membership exceeds the materialized scene.

## Research delta — Query-scoped Selection, Unmaterialized Membership & Bulk Snapshot Semantics

### Problem

The previous delta established that selection membership, focus, primary target and command eligibility are distinct. A remaining gap appears when `Select All` means more than the objects currently loaded/rendered. In a large System View, Treegrid, filtered list, topology projection or 3D aggregate, the user may intend “all objects matching this qualified scope”, while only a bounded subset is materialized.

A frontend that expands this intent into the currently visible IDs silently changes meaning. Conversely, a frontend that stores an unqualified live query risks mutating a moving population after the user previews an operation.

Therefore:

```text
VISIBLE != MATERIALIZED != MATCHING_SCOPE != SELECTED
Select All != Select Rendered
query-scoped selection != enumerated selection
```

### Evidence reviewed

- W3C WAI-ARIA APG Listbox permits explicit Select All / Unselect All and recommends separate controls when those functions are important; this supports making selection scope explicit rather than hiding it behind modifier keys.
- MUI X Data Grid distinguishes selecting all rows from selecting only currently visible rows and uses an include/exclude row-selection model; it also documents preservation of selected rows not currently present under server-side pagination.
- TanStack Table documents that with manual pagination the materialized selected-row model only contains current-page rows even though selection state may contain IDs absent from the loaded data.

These are interaction/data-model evidence, not provider selections.

### F51 — Selection representation needs ENUMERATED and QUERY_SCOPED forms

Candidate:

```text
SelectionExpression
  ENUMERATED
    includeIds[]

  QUERY_SCOPED
    scopeRef
    queryFingerprint
    queryRevision?
    includeExceptions[]
    excludeExceptions[]
    estimatedCount?
    exactCount?
    establishedAt
```

`QUERY_SCOPED` means semantic membership is defined by a qualified scope, not by currently rendered representatives. Include/exclude exceptions support “all matching except these few” without enumerating thousands of IDs.

This mirrors a useful large-data pattern evidenced by MUI's include/exclude selection model while keeping SB semantics independent of a UI provider.

### F52 — Select All requires an explicit scope contract

Candidate scopes:

```text
VISIBLE_REPRESENTATIVES
CURRENT_PROJECTION_MATERIALIZED
CURRENT_FILTER_MATCHES
CURRENT_QUERY_MATCHES
CURRENT_GROUP
SYSTEM_SCOPE
```

The command surface must state scope when ambiguity matters, e.g.:

```text
Select 48 visible
Select all 1,842 matching current filter
Select all 6,210 modules in system scope
```

A checkbox cannot silently switch between these meanings because pagination, virtualization, clustering or LOD changed.

Accessibility peer representations must expose equivalent explicit scope controls; 3D lasso remains an enumerated/geometric selection gesture unless explicitly promoted to a semantic query scope.

### F53 — Query-scoped selection must distinguish LIVE membership from SNAPSHOT membership

A live filter can change after selection because of external updates, currentness refresh or the user's own edits. Mutation commands therefore cannot blindly execute against “whatever matches later”.

Candidate:

```text
SelectionMembershipPolicy
  LIVE_VIEW
  SNAPSHOT_FOR_COMMAND
```

`LIVE_VIEW` is suitable for navigation/exploration. A mutating bulk command creates a bounded snapshot/qualification basis:

```text
BulkTargetSnapshot
  selectionExpressionRef
  resolvedAt
  queryFingerprint
  targetSetDigest
  resolvedCount
  perTargetRevisionBasis or qualificationToken
  disclosure/authority qualification summary
```

If the population materially changes between preview and execution, the command must requalify or disclose the delta. This prevents a user previewing 1,842 targets and unintentionally mutating 1,913 because new objects entered the filter.

### F54 — Unknown total count is a first-class state

Server-side/system-scale queries may initially know only a lower bound or estimate.

```text
SelectionCardinality
  EXACT(n)
  ESTIMATED(n)
  AT_LEAST(n)
  UNKNOWN
```

`UNKNOWN` must not be formatted as an exact count. Destructive/authority-sensitive operations may require exact resolution before confirmation, while non-mutating navigation may tolerate an estimate.

This preserves `UNKNOWN != SUCCESS/KNOWN` at selection level.

### F55 — Eligibility over query-scoped selections is a server/domain qualification problem, not a renderer loop

For 1,000+ objects, the renderer should not have to materialize every object merely to determine command eligibility.

Candidate aggregate qualification:

```text
QueryBulkEligibility
  scopeCount
  eligibleCount
  ineligibleCount
  staleCount
  unknownCount
  disclosureLimitedCount
  representativeReasons[]
  exactness
  qualificationRef
```

The UI can request/drill into excluded subsets without loading the entire scene. Execution still preserves per-target evidence where effects matter.

This separates semantic qualification from 3D picking/rendering and supports `3D Canvas != authority`.

### F56 — Filter changes must not silently rewrite an established semantic selection

When a QUERY_SCOPED selection exists and the user changes filters, the UI must follow an explicit policy:

```text
KEEP_ORIGINAL_SCOPE
REBASE_TO_NEW_SCOPE_WITH_CONFIRMATION
CLEAR_SELECTION
```

The default cannot be accidental mutation caused by a React re-render or a grid provider's local behavior. A preserved original scope should be visibly summarized even if many members are now filtered out.

Cross-view navigation carries the SelectionExpression itself, not merely the visible representatives.

### F57 — Cross-projection handoff needs scope disposition as well as member disposition

For enumerated sets, per-member dispositions remain useful. For query-scoped sets with thousands of members, handoff additionally needs:

```text
ProjectionSelectionDisposition
  FULLY_REPRESENTABLE
  REPRESENTABLE_AS_AGGREGATES
  PARTIALLY_REPRESENTABLE
  QUERY_ONLY
  DISCLOSURE_LIMITED
  UNSUPPORTED_SCOPE
```

Example: “all modules with deployment drift” may open from System View into Deployment as aggregates/query-backed list without instantiating every module in 3D. The semantic set survives even if geometric representation is bounded.

### F58 — Selection exceptions need stable identity and currentness handling

In `all matching except X,Y`, exclusions refer to canonical identities. If X is deleted, inaccessible or no longer matches the scope, that exception becomes non-contributing but should remain explainable until the selection is rebased/cleared.

Likewise, an explicitly included target that no longer matches the query is not silently discarded if the selection contract permits include exceptions. This avoids selection changing underneath the user without an explicit transition.

### F59 — Bulk result lineage must reference both selection intent and resolved target snapshot

Candidate:

```text
BulkOperationResult
  invocationId
  selectionExpressionRef
  targetSnapshotRef
  requestedScopeSummary
  resolvedTargetCount
  perTarget/evidence outcome
  retryOf?
  reconciliationOf?
```

A retry of four failures from an original 1,842-target operation is a new enumerated/subset invocation linked to the original snapshot, not a re-execution of the now-live filter. This preserves auditability when query membership changes later.

### F60 — Large-scene selection must not force large-scene rendering

A query-scoped selection can contain 10,000 semantic members while the WorkSurface displays clusters/representatives. Selection visualization becomes aggregate truth:

```text
cluster selected summary
  selectedMatchingCount
  selectedCriticalCount
  selectedUnknownCount
  selectionExactness
```

No requirement exists to instantiate geometry for every selected member. Inspector/List/Treegrid provide drill-down. Critical minority states remain visible under aggregation.

This directly supports:

```text
Large-scene degradation -> aggregation, not silent omission
semantic selection scale != rendered geometry scale
```

## Complete-task scenario additions

```text
S-QS-01 — visible vs all matching
48 representatives visible; filter matches 1,842 modules
-> Select All
=> UI distinguishes “48 visible” from “1,842 matching”; no ambiguous checkbox semantics

S-QS-02 — snapshot before mutation
select all 1,842 matching -> preview bulk configuration
-> 71 new modules enter filter before Apply
=> execution does not silently expand to 1,913; requalification/delta disclosure required

S-QS-03 — unknown cardinality
server-side scope count unavailable
=> selection reports UNKNOWN/AT_LEAST, never an invented exact count;
   destructive operation can require exact resolution

S-QS-04 — filter change
query-scoped selection established -> user changes filter
=> original selection is kept, rebased with explicit confirmation, or cleared by declared policy;
   never silently rewritten

S-QS-05 — cross-view query set
“All modules with deployment drift” -> Open in Deployment
=> semantic SelectionExpression preserved; destination may aggregate/query-list targets;
   geometric non-materialization does not shrink membership

S-QS-06 — exception model
select all matching -> exclude 3 modules -> include one exceptional target
=> selection remains compact and auditable without enumerating entire population

S-QS-07 — partial retry lineage
1,842-target publish -> 4 failed
-> retry failed
=> retry resolves exactly the failed subset and links to original target snapshot;
   it does not rerun current live filter

S-QS-08 — stress representation
10,000 semantic members selected while 120 clusters are rendered
=> no forced geometry explosion; aggregate selected/critical/unknown truth remains visible
```

## Componentes impact

Add to selection-capable C2+ entries:

```text
selectionRepresentation: ENUMERATED | QUERY_SCOPED
selectAllScopes[]
selectionCardinalityModel
filterChangeSelectionPolicy
selectionExceptionPolicy
```

For C6+ command surfaces:

```text
bulkSnapshotPolicy
queryEligibilityProjection
populationDeltaDisclosure
exactCountRequirement
```

For C7–C10 projections/workspaces:

```text
querySelectionRepresentation
scopeDisposition
aggregateSelectionTruth
crossProjectionScopeHandoff
```

Proof obligations:

```text
C2  explicit visible/all-matching semantics + keyboard-accessible controls
C3  SelectionExpression canonicalization and exceptions
C6  command preview against qualified scope, not rendered IDs
C7  query-backed selection without geometry explosion
C8  filter/pagination/workspace transitions preserve declared scope
C9  preview -> snapshot -> execute -> partial -> retry lineage
C10 cross-workspace scope continuity
C11 10k semantic selection / bounded rendered representatives stress proof
```

## Complexity impact

No new complexity class. Query-scoped selection strengthens the existing cross-cutting dependency:

```text
C2 explicit Select All scope
 -> C3 SelectionExpression
 -> C6 query-aware command eligibility
 -> C7 bounded projection/aggregation
 -> C8 workspace/filter persistence
 -> C9 target snapshot + operation lineage
 -> C10 cross-workspace scope handoff
 -> C11 semantic-selection scale independent of render scale
```

The visual checkbox remains LOW complexity; safe query-backed bulk orchestration is VERY HIGH/EXTREME because it couples scope identity, currentness, authority, snapshotting, partial effects and evidence lineage.

## Adversarial additions

1. “Select all” selects only virtualized/rendered rows without saying so.
2. Changing page/filter silently clears or rewrites a semantic selection.
3. A live query gains targets between preview and execution and they are mutated without disclosure.
4. Estimated cardinality is displayed as exact.
5. 3D renderer materializes every selected member and collapses under query-scale selection.
6. Cross-view handoff keeps only visible representatives.
7. Excluded exceptions lose canonical identity after filtering.
8. Retry uses the current live filter rather than the failed target snapshot.
9. Eligibility requires loading every object into the browser/renderer.
10. Query selection is treated as authority over all matching targets.

## Maturity / next vector

Material delta: **YES**.

This closes the previously identified `Select All` / unmaterialized-set gap. Selection now has a research path from explicit IDs through query-scoped intent, cardinality exactness, command snapshots, per-scope eligibility and cross-projection preservation without forcing render materialization.

Highest-value remaining vectors are now: (1) long-lived operation lineage/compensation/reconciliation UX beyond retry, especially when observed effects diverge after the originating workspace closes; (2) empirical performance budgets and benchmark methodology for picking/labels/relations/LOD at 50–200 and ~1000 modules; and (3) disclosure-safe query selection where the system can know aggregate counts but cannot reveal member identities.