# G4 — Degraded-Mode Dependency Graph & End-to-End Guarantee Synthesis

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research how a multi-capability operation derives its effective guarantee when dependencies independently enter different degraded classes, how hard/minimal-cut dependencies differ from optional enrichment, and how fallback/retry/circuit-breaker behavior avoids cascading amplification without turning the Exchange Plane into a central orchestrator or availability authority.

This continues `G4_CAPABILITY_EXCHANGE_PARTITION_DEGRADED_MODE_CONTRACTS.md`. It selects no graph engine, workflow engine, circuit-breaker library, service mesh, retry library, scheduler, gateway, broker or provider and grants no implementation authority.

Core separations:

```text
Dependency graph != orchestration ownership
Reachability path != semantic dependency path
All dependencies returned != end-to-end guarantee satisfied
One dependency degraded != whole operation has one degradation class
Optional enrichment missing != hard invariant violated
Fallback available != fallback contract-equivalent
Retryable locally != safe to retry end-to-end
Circuit breaker state != semantic admission authority
Critical path != minimal semantic cut set
Graph acyclic structurally != no retry/fallback feedback cycle
```

## Evidence classes reviewed

Primary/mature-system evidence:

- AWS Builders' Library, timeouts/retries/backoff/jitter: retries are selfish load multipliers; side-effecting operations need idempotency qualification; retries at multiple layers can amplify load; bounded retry/token-bucket behavior and jitter reduce synchronized amplification. https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
- AWS Well-Architected retry guidance: retry count, backoff, idempotency and observability are workload-specific and should be bounded/tested rather than recursively assumed safe. https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_limit_retries.html
- Azure Bulkhead pattern: isolate resources per dependency/consumer so failure/resource exhaustion in one path does not starve unrelated paths; boundaries should reflect business and technical requirements. https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead
- Azure Circuit Breaker pattern: circuit breaking and retry solve different operational problems; breakers prevent repeated calls to likely-failing dependencies but do not replace business exception/admission semantics. https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
- Azure Retry Storm antipattern: repeated retries can impede recovery and produce cascading failure after the initiating fault. https://learn.microsoft.com/en-us/azure/architecture/antipatterns/retry-storm/
- Azure Gateway Aggregation pattern: fan-out aggregation can return partial data when explicitly acceptable, but the gateway can become a bottleneck/SPoF and should not create backend coupling. https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-aggregation
- Google Aequitas (SIGCOMM 2022): fan-out/fan-in latency-sensitive RPC workloads under overload benefit from distributed admission control rather than a single global coordinator; resource/SLO admission is a separate problem from business-semantic admissibility. https://research.google/pubs/aequitas-admission-control-for-latency-critical-rpcs-in-datacenters/
- Google CAPA (2023): a thin regulation layer can contain risky management operations and reduce correlated operational failures without requiring every component/operator to implement the full policy perfectly; useful as a containment benchmark, not as business authority. https://research.google/pubs/capa-an-architecture-for-operating-cluster-networks-with-high-availability/
- Prior G4 effect-composition, causal-workflow, contract-compatibility, negotiation, generation-handoff, DR, split-brain and degraded-mode research.

These sources constrain boundaries and proof obligations only.

## 1. The dependency graph is a proof graph, not an orchestration graph

A multi-capability operation may depend on data, authority, effects, currentness, settlement and optional enrichment from different capabilities. The graph relevant to correctness is therefore not merely a call graph.

Candidate research vocabulary:

```text
OperationDependencyGraph
  rootOperationRef
  protectedInvariantRefs[]
  nodes: DependencyClaim[]
  edges: RequirementRelation[]
  alternativeSets[]
  optionalEnrichmentSets[]
  effect/settlement joins[]
  currentness/security floors[]
  resource/retry budgets[]
```

A node describes a claim required from another boundary, not ownership of that boundary. An edge means that one guarantee depends on another qualified claim; it does not authorize the caller or Exchange Plane to execute the dependency's business workflow.

```text
Dependency graph != distributed transaction graph
Dependency graph != call graph
Dependency graph != ownership graph
```

The Exchange Plane may carry claim/evidence metadata and apply exchange policy. Capability cores remain owners of their business semantics and effects.

## 2. End-to-end guarantee is synthesized as a vector

A single `healthy/degraded` result loses material information. Candidate guarantee dimensions include:

```text
completeness
currentness
semantic/profile compatibility
identity/tenant/classification preservation
authority/security sufficiency
effect-right sufficiency
delivery/ordering guarantees
settlement/effect disposition
resource/SLO budget
reconciliation obligations
lossiness/provenance
```

Conceptually:

```text
EffectiveGuarantee(root)
  = root-local guarantees
    constrained by every hard dependency claim
    combined with explicitly permitted alternatives
    qualified by omitted optional dimensions
    bounded by unresolved UNKNOWN/partial effects
```

This is not a chosen lattice or algorithm. It establishes the information that any future synthesis mechanism must preserve.

`All calls succeeded != effective guarantee satisfied`.

A response can be transport-successful while stale, partial, semantically incompatible or insufficiently authorized.

## 3. Hard dependencies, optional enrichment and alternatives are different relations

Candidate relation classes:

- **HARD** — absence/insufficiency invalidates the root operation for a named invariant;
- **OPTIONAL_ENRICHMENT** — omission weakens a declared quality/completeness dimension but preserves the root contract;
- **ALTERNATIVE** — one of a qualified set may satisfy the same named requirement under explicit compatibility rules;
- **CONDITIONAL** — required only when a predicate/branch becomes active;
- **EFFECT_SETTLEMENT** — root completion depends on a downstream effect disposition rather than mere response delivery;
- **CURRENTNESS/AUTHORITY** — root admission depends on evidence meeting a floor/horizon;
- **RESOURCE_GUARD** — protects capacity/SLO without becoming business authority.

`Optional for UI quality != optional for a downstream business decision`.

Optionality is therefore scoped to a caller/operation/guarantee, not globally attached to a service.

## 4. Minimal semantic cut sets are not network critical paths

A useful implementation-independent concept is a **minimal semantic cut set**: the smallest set of unsatisfied dependency claims whose absence makes a named root guarantee impossible.

Examples:

- recommendations may be outside the cut set for checkout correctness;
- current revocation evidence may be inside the cut set for a privileged approval;
- one of two qualified price sources may be sufficient, so neither source alone is a cut when the other remains admissible;
- payment provider reachability may not be a cut for durable command admission when `QUEUE_WITHOUT_EFFECT` is explicitly allowed, but it is a cut for `payment settled now`.

```text
Slowest dependency != semantic cut dependency
Most connected node != semantic owner
Minimal cut for guarantee G1 != minimal cut for G2
```

Cut-set reasoning can guide degradation and testing without requiring centralized runtime graph evaluation.

## 5. Fallback is contract substitution, not merely routing substitution

A fallback path is transparent only when it satisfies the same required guarantee vector. Otherwise it is qualified mediation/degradation.

Candidate rule:

```text
Primary P unavailable
Fallback F may satisfy requirement R only if
  ContractGuarantees(F, context) >= RequiredGuarantees(R)
  and identity/authority/currentness/effect semantics remain qualified
```

`Fallback returned data != fallback satisfied the requirement`.

A cached catalog result may substitute for a live catalog read under a bounded freshness contract. It cannot automatically substitute for a live revocation/authorization check. A secondary provider with weaker delivery semantics cannot silently replace a stronger one because the interface/schema matches.

## 6. Guarantee synthesis is monotone with respect to hard invariants

A downstream degradation may remove optional quality, reduce freshness within an allowed bound, defer an effect or reject work. It cannot make the root claim stronger than the evidence it received.

```text
Downstream PARTIAL -> upstream COMPLETE   // forbidden unless missing dimension is explicitly irrelevant
Downstream UNKNOWN effect -> upstream SETTLED // forbidden
Downstream stale authority -> upstream current authority // forbidden
```

Adapters/gateways may translate representation but must preserve or explicitly qualify weakened dimensions.

This extends `Driver may normalize mechanism but must not fabricate semantic equivalence` to composed dependency paths.

## 7. Retry ownership belongs at a qualified layer

AWS operational evidence shows why retries at every layer are dangerous: a dependency tree can multiply load dramatically. G4 therefore needs an explicit retry-ownership concept per interaction/effect path.

Candidate rule:

`One logical obligation may have multiple transport attempts, but retry authority is bounded and non-duplicative across layers`.

Qualification includes:

- which layer owns retry for the obligation;
- idempotency/dedup/effect identity;
- maximum attempt/time/resource budget;
- backoff/jitter policy class where operationally relevant;
- whether failures are transient, semantic, authority, currentness or effect-ambiguous;
- whether retry can still satisfy the caller's deadline/currentness horizon;
- stop conditions and escalation/reconciliation behavior.

`Retryable transport failure != retryable business effect`.

A timeout can leave a side effect `UNKNOWN`; retrying without stable effect identity can duplicate it.

## 8. Retry and fallback budgets are end-to-end resources

Per-hop limits alone do not prevent amplification. If A retries B three times and each B attempt retries C three times, C can see nine attempts for one root intent before other layers are considered.

Candidate `ResilienceBudget` dimensions:

```text
root obligation/occurrence scope
attempt budget
time/deadline budget
concurrency budget
cost/rate budget
queue budget
semantic/currentness horizon
effect ambiguity budget/stop condition
```

Budgets may be partitioned/delegated, but child layers cannot mint new end-to-end budget silently.

`Local retry budget available != root retry budget available`.

This mirrors prior rights-conservation research without equating compute/retry budgets with business rights.

## 9. Feedback cycles are broader than graph cycles

A static dependency DAG can still produce a dynamic feedback loop:

```text
A -> B timeout
A retries B
B fallback -> C
C calls A for enrichment/validation
A is overloaded -> more timeout
```

Likewise, independent clients can synchronize retries after recovery. Therefore qualification must consider dynamic retry/fallback/queue/resource feedback edges, not only nominal calls.

Candidate cycle classes:

- retry amplification cycle;
- fallback recursion cycle;
- queue/replay cycle;
- resource-starvation cycle;
- health-probe/routing flap cycle;
- authority-renewal starvation cycle.

Jitter/backoff, bulkheads and breakers can mitigate operational cycles, but none proves semantic admissibility.

## 10. Bulkheads protect failure domains, not semantic ownership

Azure's bulkhead pattern demonstrates that separate pools can prevent one failed dependency from exhausting resources needed by others. For G4:

`Resource isolation boundary != bounded-context boundary by definition`.

A capability can use separate pools for optional enrichment and authority-critical work. Conversely, two bounded contexts may share infrastructure without sharing business ownership when contracts remain explicit.

Bulkheads are candidates for blast-radius control, not a reason to put business entities in `shared` or to centralize workflow in a gateway.

## 11. Partial fan-out/fan-in requires explicit join semantics

Gateway aggregation documentation acknowledges that partial results can sometimes be acceptable. G4 needs the stronger semantic condition: the join knows which branches are mandatory for which guarantee.

Candidate join evidence:

```text
branchRef
requirementRef
outcome/disposition
currentness
completeness
profile/contractRef
authority/evidence refs
settlement/effect status
omission reason
```

`N of M responses arrived != join satisfied`.

A threshold is meaningful only when the contract says those branches are substitutable or quorum-composable for the named property. This reuses prior multi-domain evidence rules and does not invent a universal quorum.

## 12. Distributed admission does not require a central availability oracle

Aequitas demonstrates that admission control can be distributed and sender-driven under overload. G4 should preserve a similar structural separation: each boundary can evaluate locally available, contract-scoped evidence and propagate qualified outcomes.

A thin policy/regulation layer, as illustrated by CAPA for management operations, can enforce cross-cutting constraints without becoming the owner of every underlying operation. The G4 analogue remains narrower: shared exchange policy may reject or qualify passage, but capability cores own business admission/effect semantics.

`Distributed admission != inconsistent semantics` when all participants evaluate the same immutable contract/profile and locally sufficient evidence.

`Central coordinator absent != evidence absent`.

## 13. Failure containment and semantic propagation are complementary

Operational containment should stop resource/failure propagation; semantic propagation should preserve material degradation information.

```text
Bulkhead: contain resource blast radius
Breaker: suppress futile calls
Retry budget: bound amplification
Timeout/deadline: bound waiting
Qualified outcome: preserve semantic loss/currentness/effect status
Capability contract: decide admissibility
```

No single mechanism substitutes for the others.

A breaker returning fast failure can improve system health while making the root business operation inadmissible. Conversely, a semantically valid stale-bounded result can allow useful progress even when the live path is unhealthy.

## 14. Recovery requires obligation-aware requalification

When dependencies recover, queued work and retries from the degraded interval may compete with new work. Recovery should not simply reopen every circuit and release every queue simultaneously.

Candidate obligations:

- preserve original obligation/effect identity;
- recheck current security/profile/currentness floors where required;
- settle or quarantine `UNKNOWN` effects before conflicting retries;
- respect remaining root deadline/budget;
- phase backlog drain so it does not recreate overload;
- keep optional enrichment from starving hard-invariant recovery traffic;
- expose when the original guarantee can no longer be met and a new admission is required.

`Dependency recovered != old obligation still admissible`.

## 15. Candidate proof obligations

1. Every dependency edge names the guarantee/claim it contributes; call adjacency alone is insufficient.
2. Hard, optional, alternative, conditional, settlement, currentness/authority and resource-guard dependencies remain distinguishable.
3. Optionality is scoped to a root operation/guarantee and cannot be generalized globally from one caller.
4. Effective root guarantees never exceed the weakest material qualified dependency evidence unless an explicit alternative/composition proof justifies it.
5. Missing optional enrichment is represented as qualified incompleteness when material and never silently converted to full completeness.
6. A fallback is transparent only when it satisfies the same required guarantee vector; otherwise degradation/mediation is explicit.
7. Interface/schema compatibility cannot prove fallback contract compatibility.
8. Minimal semantic cut sets are defined per protected guarantee/invariant and are not inferred from latency, topology or node centrality.
9. `QUEUE_WITHOUT_EFFECT` may remove provider reachability from the admission cut set only while effect completion remains explicitly pending.
10. Join completion depends on declared branch requirements and dispositions, not response count alone.
11. Retry ownership is explicit enough to prevent independent layers from multiplying attempts without a bounded end-to-end policy.
12. Retries preserve stable obligation/effect identity and respect idempotency/dedup/fencing requirements.
13. Side-effect timeout/transport ambiguity remains `UNKNOWN` until reconciled; retry cannot assume non-execution.
14. Child retry/fallback layers cannot mint additional end-to-end attempt/time/cost/concurrency budget silently.
15. Retry/fallback cycles are analyzed dynamically, including fallback recursion and recovery storms, not merely by checking a nominal DAG for cycles.
16. Bulkhead/resource isolation protects unrelated work but does not create or transfer business authority.
17. Circuit-breaker/health/load-shed state cannot substitute for semantic/currentness/authority admission evidence.
18. Qualified degradation metadata survives adapters/gateways and cross-capability joins when material to caller guarantees.
19. No Exchange Plane/gateway becomes canonical owner of dependency business values merely to synthesize guarantees.
20. Distributed/local admission remains possible from immutable contracts and locally sufficient evidence; Builder/central availability services are not mandatory runtime dependencies.
21. Recovery requalifies old queued/retry obligations against current profile/security/currentness/effect evidence before releasing conflicting effects.
22. Backlog draining and retry recovery are resource-bounded so dependency restoration does not trigger a second cascading failure.
23. Direct call, RPC, broker, stream and file exchange may realize the same dependency claim only when transport-specific failure/ordering/retry differences remain explicit.
24. The synthesis model remains portable: provider-specific health codes, breaker states and retry metadata map into qualified evidence without becoming canonical semantics.

## 16. Adversarial cases

- A calls B and C; C is optional for display but mandatory for fraud approval, and a global `optional=true` silently bypasses fraud evidence;
- all HTTP calls return 200, but one result is stale beyond the root currentness floor;
- fallback provider has the same schema but weaker delivery/effect semantics;
- cache fallback valid for product description is reused for authorization revocation;
- A retries B three times while B independently retries C three times, creating multiplicative load;
- gateway retries a timed-out payment whose first effect is `UNKNOWN`, duplicating the charge;
- each hop obeys its own retry limit but the root cost/deadline budget is exceeded;
- circuit breaker opens and caller interprets it as business denial rather than path-health evidence;
- breaker closes and releases a synchronized backlog that immediately re-overloads the dependency;
- optional enrichment shares a pool with authority-critical calls and exhausts all connections;
- bulkhead is interpreted as bounded-context ownership and shared business state is moved into infrastructure glue;
- fallback B -> C -> A creates recursion although the nominal primary dependency graph is acyclic;
- health-probe flap causes alternating failovers between semantically different profiles;
- aggregator treats `2 of 3 responses` as quorum although the three sources are not substitutable witnesses;
- partial branch is stripped by an adapter and root result is labeled complete;
- `QUEUE_WITHOUT_EFFECT` result is presented as completed business effect;
- dependency recovers after security floor advanced, but old queued command executes before requalification;
- every client retries immediately after recovery and consumes capacity needed for settlement/reconciliation traffic;
- central graph service is unavailable and autonomous runtime stops despite possessing sufficient local contract/evidence closure;
- Exchange Plane stores fallback values and becomes accidental canonical business owner;
- transport migration changes default retry behavior and silently changes effective delivery/effect guarantee;
- one branch's retry budget is borrowed as if it were business quota/authority;
- stale dependency telemetry is used to synthesize a stronger guarantee than the actual response evidence;
- root operation has no common deadline/currentness budget, so a late fallback technically succeeds after its business guarantee expired.

## 17. Decision criteria by interaction realization

**Direct/local call** — lowest transport overhead, but must still propagate qualified outcomes, deadline/budget and stable obligation identity; in-process exceptions must not bypass the same semantic contract used remotely.

**RPC/HTTP/gRPC** — appropriate when the caller needs immediate qualified response and deadlines/cancellation can bound fan-out; retry ownership and side-effect ambiguity must be explicit.

**Broker/queue** — appropriate when admission can be decoupled from effect completion and backpressure/durable buffering is useful; queue acceptance is not effect settlement, and delayed execution must requalify when required.

**Stream** — appropriate for ongoing qualified observations/dataflow where partial order and backpressure are first-class; a stream's health does not prove currentness/authority of every item.

**Gateway/aggregator** — appropriate for boundary policy or presentation aggregation when it preserves per-branch guarantee evidence; inappropriate when it becomes business workflow owner or invents quorum/optionality.

**Adapter** — appropriate for declared protocol/semantic mediation; lossy fallback must be explicit and cannot upgrade a weaker guarantee.

No realization is universally preferred.

## 18. Portability / exit path

The hypothesis deliberately avoids binding guarantee synthesis to a service mesh, graph database, tracing vendor, circuit-breaker library, workflow engine or broker.

Portable durable meaning should be expressible as contracts/evidence such as:

- immutable capability/operation/contract refs;
- requirement/dependency relation and invariant scope;
- qualified outcome/degradation/currentness/effect disposition;
- stable obligation/effect identity;
- retry/deadline/resource budget evidence;
- alternative/fallback qualification;
- provenance and reconciliation obligations.

Provider-native health/retry/breaker telemetry remains operational evidence that can be replaced without rewriting business ownership.

## 19. Deduplication against existing G4 research

This document does **not** reopen:

- effect-domain coordination/reservation/fencing laws from effect-composition research;
- workflow causation versus transport correlation from causal-workflow research;
- multidimensional contract compatibility from compatibility research;
- profile negotiation/downgrade resistance;
- generation handoff, recovery/compaction, DR or split-brain authority reconciliation;
- operation-scoped degraded classes from the immediately preceding degraded-mode document.

Material delta is specifically the **composition layer**: dependency-claim graph, hard/optional/alternative relations, minimal semantic cut sets, end-to-end guarantee vector synthesis, retry/fallback budget conservation, dynamic feedback-cycle analysis and obligation-aware recovery.

## 20. Maturity and next gap

This subfront is **materially advanced but not saturated**. New evidence changed the boundary from isolated degraded-operation contracts to composed end-to-end guarantees and bounded resilience behavior.

Highest-value remaining gap: **distributed guarantee evidence caching and invalidation under high fan-out** — determine how runtimes can cache dependency qualification/cut-set evidence without re-consulting every capability on every operation, while preventing stale authority/currentness/profile claims from creating false admissibility; define cache-key scope, dependency invalidation, negative evidence, stampede control and offline behavior without a central guarantee oracle.

## 21. Research-only conclusion

A safe multi-capability degraded path is not synthesized by asking whether every service is up. It is synthesized from explicit dependency claims, operation-scoped hard/optional/alternative relations, qualified evidence and invariant-specific joins. Resilience mechanisms then protect execution resources around that semantic contract: bulkheads contain blast radius, breakers suppress futile calls, retry/deadline budgets bound amplification, and backoff/jitter reduce correlated recovery storms. None of them owns business truth.

The implementation-independent hypothesis is therefore:

```text
Capability operation contract
  -> dependency claims + alternatives
  -> locally/transport-observed qualified evidence
  -> invariant-scoped guarantee synthesis
  -> admissible / qualified-degraded / queued / refused
  -> bounded retries/fallbacks/resource isolation
  -> obligation-aware recovery/reconciliation
```

The graph is evidence for deciding whether the root guarantee can still be promised. It is not permission for the Exchange Plane to become a distributed workflow engine.