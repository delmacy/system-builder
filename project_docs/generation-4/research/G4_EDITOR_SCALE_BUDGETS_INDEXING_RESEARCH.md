# G4 — Editor Scale Budgets, Indexing & Progressive Disclosure Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Scope

Continuation of the proprietary-editor/shared-foundation research, especially `G4_EDITOR_VERIFIER_PRIVACY_FINDINGS_UX_RESEARCH.md`. This round investigates scale behavior for impact graphs, conformance datasets, findings, correlation and editor projections across roughly `10^3–10^6` semantic records. It is P&D documentation only and creates no implementation, provider, WBS, Work Package, Sprint or TASK authority.

The current product hierarchy remains `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`. 3D remains an optional future projection/application, not the shell or an exclusive interaction path.

## Evidence reviewed

Research on interactive large-graph visualization demonstrates that million-node/million-edge exploration is feasible only by changing representation and work performed at each scale: multiscale aggregation, hierarchical clustering, level-of-detail, edge cumulation, on-demand paging and GPU-assisted rendering are recurring techniques. ZAME reported interactive exploration of more than 500k nodes and 6M links using aggregated multiscale adjacency matrices; other graph-visualization work reports interactive LOD or layouts for graphs with millions of nodes/edges. These results are feasibility evidence, not System Builder performance guarantees.

WAI-ARIA explicitly supports virtualized table/grid/treegrid projections where only a subset of rows exists in the DOM. `aria-rowcount` communicates the total population and `aria-rowindex` the true position of materialized rows; unknown total cardinality is representable as `-1`. This supports a critical product conclusion: semantic population, materialized projection and accessibility representation are distinct and must not be silently conflated.

## F105 — Scale is a contract dimension, not a renderer afterthought

Each editor/query projection should declare at least four populations independently:

```text
ScaleEnvelope
  semanticPopulation
  qualifiedPopulation
  indexedPopulation
  materializedPopulation
  visiblePopulation
  exactness = EXACT | ESTIMATED | AT_LEAST | UNKNOWN
  basisRevisionRefs[]
  generatedAt
```

`semantic population != indexed population != rendered population != visible population`.

A view showing 200 rows from 600,000 findings must not imply that only 200 findings exist. A graph drawing 500 aggregate nodes must not imply that only 500 semantic objects participate.

## F106 — Proposed scale classes are research budgets, not fixed product limits

Use provisional classes to drive experiments rather than hard-code arbitrary thresholds:

- **S0 focused:** `10^0–10^2` objects/claims — direct manipulation and rich Inspector detail are plausible.
- **S1 workspace:** `10^2–10^3` — virtualization, selective labels and incremental validation become expected.
- **S2 corpus:** `10^3–10^4` — query/index-backed lists, aggregation and bounded graph neighborhoods become the default.
- **S3 analytical:** `10^4–10^5` — summary-first UX, asynchronous qualification, incremental indexes and drill-down are required.
- **S4 large analytical:** `10^5–10^6+` — no UI contract may require full DOM/graph materialization; exact global operations need explicit cost/progress/cancellation semantics.

These bands are experiment buckets only. Future empirical work must measure actual latency, memory, update rate, browser/device class and assistive-technology behavior before product thresholds are frozen.

## F107 — Interactive latency budgets should be operation-class based

The foundation should distinguish:

```text
InteractionBudgetClass
  IMMEDIATE_LOCAL       // focus, selection, hover-equivalent disclosure
  INTERACTIVE_QUERY     // filter/sort/find/open neighborhood
  ASYNC_ANALYSIS        // impact/conformance/requalification
  LONG_RUNNING_OPERATION// corpus-wide proof/reconciliation/export
```

Do not promise one latency target for all operations. The UX contract is instead that expensive work never blocks local editor interaction, exposes progress/currentness, is cancellable where cancellation is truthful, and preserves the last valid projection while recomputation is pending.

`analysis pending != editor frozen`; `cancelled wait != cancelled remote effect`.

## F108 — Indexes accelerate questions; they do not become semantic authority

Candidate derived indexes include:

- reverse dependency/impact index;
- finding-by-root-cause and finding-by-claim indexes;
- revision/currentness index;
- workflow activity/event/case correlation index;
- evidence/verifier/trust-domain index;
- binding reference index across Workflow/View/Form/Component/Command/Permission;
- text/search index for labels and descriptions.

Every index result carries basis/currentness. Missing index entries cannot prove semantic absence unless the index's completeness for that claim and revision is itself qualified.

`index miss != semantic absence`; `index current for A != index current for B`.

## F109 — Root-cause grouping is both a cognitive and computational primitive

A schema change may invalidate 100,000 downstream claims. Persisting/rendering 100,000 independent top-level alerts is usually the wrong interaction model even when the underlying affected set remains exact.

Represent a root finding plus an affected-set expression and severity distribution:

```text
FindingGroup
  rootFindingRef
  affectedSetRef/query
  cardinality + exactness
  severityHistogram
  minorityCriticalCount
  sampleRefs[]
  qualificationBasis
```

The group may compress presentation and storage/index traversal, but never semantic truth. `99,999 informational + 1 blocking != informational`.

## F110 — Progressive disclosure must preserve minority-critical truth

At S2–S4, Canvas/Graph/Outliner/Findings projections may cluster, aggregate, suppress labels or page details. Every aggregate needs enough summary state to expose critical minorities, unknowns, stale basis and disclosure-limited members.

A cluster can say `12,408 affected; 7 blocking; 31 UNKNOWN`; it cannot simply inherit the majority state.

Drill-down must be available through non-spatial list/tree/table/Inspector routes. 3D and drag are never required to discover the exceptional member.

## F111 — Graph editors should materialize bounded semantic neighborhoods

Workflow/System/Module/Binding graphs should prefer a bounded neighborhood around the selected/focused semantic object plus aggregates for the frontier rather than attempt to lay out the entire corpus.

Candidate query:

```text
NeighborhoodProjection
  anchorRefs[]
  edgeKinds[]
  depth/budget
  qualificationFilters
  aggregationPolicy
  omittedFrontierSummary
  basisRevision
```

`not materialized != not connected`.

This is compatible with research showing that large graphs remain interactive through multiresolution aggregation/LOD rather than full-detail rendering at every zoom level.

## F112 — Conformance scale should separate event ingestion, case derivation, analysis and visualization

A `ConformanceDataset` may contain millions of events while the user inspects tens of variants or a single case. The shared foundation should not make the Workflow canvas the computational engine for conformance.

Separate conceptual stages:

```text
Event corpus
 -> privacy/correlation-qualified derived dataset
 -> indexed case/variant representation
 -> conformance computation
 -> aggregate result
 -> selected-case/variant projection
```

Workflow Designer owns designed process semantics; conformance infrastructure computes observed alignment; the editor projects results. This preserves `designed != observed` and prevents visualization scale from dictating analysis semantics.

## F113 — Correlation ambiguity needs indexed candidate sets, not eager global joins

At large scale, correlation should produce bounded candidate/ambiguity sets with coverage/currentness rather than eagerly materialize every possible cross-domain join.

For an ambiguous event, retain `0/1/N candidate` semantics and qualification basis. N candidates are not N cases and must not be counted as N deviations.

Privacy scope applies before indexability: an index must not make a prohibited cross-purpose join cheap merely because the underlying token is technically joinable.

## F114 — Live updates need backpressure and coalescing without truth loss

Thousands of findings/evidence updates can arrive faster than humans or the DOM can consume them. The editor foundation needs a projection-level coalescing contract:

```text
UpdateProjectionPolicy
  semanticEventsPreserved = true
  visualCoalescingWindow
  aggregateRecomputePolicy
  criticalBypassPolicy
  announcementPolicy
  basisWatermark
```

Coalescing may reduce renders/announcements but cannot discard semantic events required for evidence or lineage. Critical transitions can bypass ordinary visual batching. `coalesced presentation != coalesced semantic history`.

## F115 — Virtualization requires explicit accessibility cardinality and position

For virtualized list/table/grid projections, accessibility must communicate the full known population and true positions even when only a window is mounted. Where total cardinality is unknown, expose that uncertainty rather than inventing a total.

Keyboard navigation, Find/Go-to, selection and review cannot be defined solely in terms of mounted DOM nodes. Focus restoration after virtualization/filtering targets semantic identity and then rematerializes the appropriate projection.

`focused semantic object != currently mounted DOM row`.

## F116 — Query-backed selection and bulk actions become mandatory at S3/S4

Large populations cannot require enumerating every selected ID client-side. Reuse the established `SelectionExpression`/query-scoped selection model and freeze a qualified execution snapshot for destructive or effectful operations.

Bulk qualification should return aggregate eligibility plus drill-down sets (`eligible`, `denied`, `stale`, `unknown`, `requiresReconciliation`) without requiring all objects to be drawn.

`query selection != live execution target`; `aggregate eligibility != universal eligibility`.

## F117 — Diff/Revision needs summary-first semantic deltas

A revision changing 500,000 derived claims should first expose root semantic changes, affected-set cardinality/exactness, changed proof classes and critical exceptions. Raw member-level diff remains available by query/drill-down.

This extends `Artifact Diff | Impact Diff | Effect Lineage | Designed vs Observed` with scalable result projections without creating new ownership.

## F118 — Performance proof obligations must cover correctness under optimization

Future implementation proof should not stop at FPS/latency. It must establish at least:

1. aggregation preserves critical/UNKNOWN/stale minorities;
2. virtualization preserves semantic selection/focus/cardinality;
3. stale indexes cannot manufacture CURRENT or absence;
4. incremental impact equals full recomputation for qualified fixtures;
5. update coalescing does not lose durable evidence transitions;
6. graph neighborhood/frontier summaries account for omitted members;
7. cancellation cannot fabricate cancellation of already-accepted effects;
8. accessibility fallbacks can reach every action/finding available spatially;
9. query-backed bulk execution binds a frozen qualified target snapshot;
10. degradation under resource pressure remains explicit rather than silently reducing semantic guarantees.

## Editor-specific implications

### Workflow Designer

Use focused graph neighborhoods, variant/case summaries and indexed conformance results. Unreachable-state checks may be incremental, but a partial/incomplete graph basis cannot prove global reachability.

### Component Editor / Componentes

State-matrix search/filter should be virtualizable. Evidence/test references are indexed by semantic state/variant, while the editor loads only the selected state fixture. Large matrices should expose coverage summaries rather than render Cartesian products blindly.

### View/Page Builder and Form Builder

Outliner and binding browser virtualize independently from the visual surface. A schema change may show one root finding with a query-backed affected set of fields/components/forms. Responsive previews render selected breakpoints/states, not every permutation simultaneously.

### Rules/Decision Editor

Rule-table/list projections need virtualization and summary validation. Rule evaluation semantics remain independent of row materialization. Missing/overlapping rule findings can be indexed and grouped by root condition/domain.

### System/Module Designer

Large dependency/topology views use bounded neighborhoods, clustering and semantic zoom. The full dependency graph remains queryable even when not drawable.

### Elicitation/Requirements

Large requirement/evidence corpora require search/index-backed navigation and root-cause grouping. AI/search retrieval remains advisory; absence from retrieval is not absence from the corpus.

### Preview/Sandbox

Preview loads a bounded revision bundle and selected scenarios. Sampling scenarios for responsiveness does not prove unexecuted scenarios; coverage is explicit.

### Revision/Diff

Summary-first semantic impact with query-backed member drill-down. Historical revision basis remains pinned while indexes may be rebuilt independently.

## Shared primitive -> infrastructure -> proprietary app -> cross-app integration

- **P0 LOW/MEDIUM — shared primitives:** exactness/cardinality badges, progress/currentness indicators, aggregate severity summaries, virtual-row position metadata.
- **P1 MEDIUM/HIGH — editor infrastructure:** virtualized Outliner/Binding Browser/Findings, query-backed SelectionExpression, bounded NeighborhoodProjection, incremental search/index interfaces, update coalescing/backpressure, semantic focus restoration.
- **P2 HIGH/VERY HIGH — proprietary apps:** Workflow conformance projection, Component state-matrix coverage, Form/View affected-binding projection, Rule-table validation, System dependency neighborhoods, Preview coverage.
- **P3 EXTREME — cross-app semantic integration:** revision-qualified incremental impact, cross-artifact index completeness, privacy-safe correlation at scale, bulk qualification, currentness propagation and equivalence proof between incremental and full recomputation.

The principal complexity hotspot is not rendering one million rows. It is preserving semantic truth/currentness/authority/evidence while only a tiny fraction of the corpus is materialized.

## Adversarial/proof scenarios

1. One blocking finding exists among 500,000 informational findings: aggregate must expose it without scanning/rendering all rows client-side.
2. Reverse-impact index is stale after schema change: index miss cannot certify unaffected.
3. Grid materializes rows 20,001–20,100 of 600,000: assistive technology receives total/true positions and keyboard navigation does not treat row 20,100 as dataset end.
4. User selects all 400,000 matching findings, changes filter, then executes remediation: execution uses frozen qualified snapshot, not mutated live query.
5. Conformance dataset has 5M events but only 80% safely correlated: UI cannot present the 20% unresolved as deviations or absence.
6. Graph projection shows a 2-hop neighborhood and hides a blocking dependency at depth 4: frontier aggregate signals unresolved/critical downstream state.
7. 20,000 live updates arrive during inspection: UI coalesces rendering but evidence lineage retains semantically material transitions.
8. Incremental impact algorithm says 9,999 claims unaffected while full recomputation finds one changed claim: incremental qualification fails its equivalence obligation and cannot remain authoritative.
9. User tabs through a virtualized findings grid while rows recycle: focus follows semantic finding identity, not reused DOM position.
10. Preview samples 50 scenarios from 20,000: result says sampled coverage, never `all scenarios passed`.
11. Correlation index can technically join two purpose-scoped tokens: unauthorized join remains blocked despite computational availability.
12. Resource pressure causes analysis to downgrade from exact to estimated cardinality: UI marks `ESTIMATED`; it does not preserve an old exact-looking number.

## Componentes metadata candidates — delta

```text
scaleEnvelope?
projectionBudgetClass?
virtualizationPolicyRef?
aggregationPolicyRef?
indexDependencyRefs[]
indexCompletenessClaimRefs[]
updateProjectionPolicyRef?
accessibilityPopulationContractRef?
performanceProofRefs[]
```

These metadata describe projection/quality obligations and must not duplicate semantic identity per view.

## Research maturity / saturation

`EDITOR_SCALE_BUDGETS_INDEXING = ADVANCED_EMERGING / MATERIAL_DELTA`.

High-confidence conclusions:

- million-scale semantic corpora are plausible only with progressive disclosure, aggregation, virtualization and query/index-backed interaction;
- external million-node graph results demonstrate feasibility of multiresolution techniques, not a ready-made System Builder budget;
- exact semantic population and rendered population must remain separate;
- large-scale correctness depends on index completeness/currentness and incremental-vs-full equivalence, not merely renderer throughput;
- accessibility semantics must survive virtualization and unknown cardinality;
- query-backed selection, bounded neighborhoods and summary-first findings/diff are shared editor infrastructure rather than app-specific reinventions.

Remaining gaps:

1. empirical benchmarks on representative SB-shaped graphs/corpora to convert S0–S4 experiment bands into measured budgets;
2. memory/update-rate budgets for browser-local indexes versus server/worker-backed derived indexes without prematurely choosing architecture;
3. incremental conformance/impact algorithms and equivalence fixtures;
4. trust-anchor rollover/split-brain recovery and cryptographic proof-envelope longevity from the previous round;
5. assistive-technology testing of virtualized tree/grid focus restoration and announcement coalescing;
6. quantitative privacy/linkability thresholds for large correlation datasets.

Next vector: **trust-anchor rollover/split-brain recovery + digest/tombstone longevity under cryptographic agility**, while retaining empirical editor-scale benchmarking as an explicit future measurement program rather than inventing unsupported hard limits.
