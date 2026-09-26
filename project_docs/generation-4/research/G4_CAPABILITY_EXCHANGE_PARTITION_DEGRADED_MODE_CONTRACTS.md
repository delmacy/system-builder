# G4 — Partition-Policy Qualification and Degraded-Mode Capability Contracts

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-19
Parent family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Purpose

Research how a capability can declare, qualify and prove which operations remain admissible when peers, authority, currentness, capacity or dependencies become unavailable, and how those degraded-mode constraints compose across cross-capability calls without a central availability oracle or silent weakening of guarantees.

This continues `G4_CAPABILITY_EXCHANGE_SPLIT_BRAIN_AUTHORITY_REJOIN.md`. It selects no service mesh, circuit breaker, consensus system, scheduler, health system, load balancer or resilience framework and grants no implementation authority.

Core separations:

```text
Dependency reachable != operation semantically admissible
Dependency unreachable != every operation must stop
Health signal != authority/currentness proof
Circuit open != business permission denied
Failover target healthy != failover target contract-compatible
Cached/stale read available != fresh-authority decision available
Graceful degradation != guarantee weakening by surprise
Local availability != transitive dependency availability
Degraded mode entered != all downstream effects inherit that mode safely
Control plane unavailable != data plane must stop
```

## Evidence classes reviewed

Primary/mature-system evidence:

- AWS Well-Architected graceful degradation: components may preserve core function when dependencies fail, but failure paths should be explicit, simpler than primary paths and tested; static stability recommends relying on already-provisioned data-plane state rather than dynamically acquiring dependencies during failure. https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_mitigate_interaction_failure_graceful_degradation.html and https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html
- AWS cell-based architecture: data planes can continue with previously provisioned state when the control plane is impaired, demonstrating that control-plane loss need not imply data-plane stop when the dependency closure is already local. https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/control-plane-and-data-plane.html
- Google SRE cascading-failure guidance: graceful degradation/load shedding is workload-specific; overload paths need realistic testing; retries can amplify overload and degraded paths can themselves create feedback loops. https://sre.google/sre-book/addressing-cascading-failures/
- Kubernetes API Priority and Fairness: independent priority levels receive bounded concurrency and can lend/borrow within explicit limits, protecting critical control traffic from noisy flows. https://kubernetes.io/docs/concepts/cluster-administration/flow-control/
- Kubernetes PodDisruptionBudget: availability protection is application/workload-owned and constrains voluntary disruption, rather than infrastructure inferring the application's safe minimum. https://kubernetes.io/docs/concepts/workloads/pods/disruptions/
- Envoy overload manager: local overload protection is distinct from circuit breaking that protects upstream dependencies. https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/operations/overload_manager.html
- Istio locality failover/outlier detection: endpoint health can trigger routing failover, but this is traffic-health machinery rather than proof that the target has equivalent semantic profile, authority, data currentness or effect guarantees. https://istio.io/latest/docs/tasks/traffic-management/locality-load-balancing/failover/
- Azure Bulkhead/Circuit Breaker patterns: isolation can preserve unrelated functionality; circuit breaking prevents repeated pressure on a failing dependency and can trigger degradation, but it is not a universal fit for event-driven/platform-managed failure recovery. https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead and https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker
- Prior G4 offline-security-floor, negotiation-lifecycle, semantic-generation-handoff, cross-runtime DR and split-brain/rejoin research.

These are guarantee/failure benchmarks, not adoption decisions.

## 1. Degraded mode is an operation contract, not a node status

A capability should not expose one coarse `DEGRADED=true` bit and let callers infer what remains safe. Different operations of the same capability can have different requirements.

Research vocabulary:

```text
DegradedOperationContract
  capabilityRef
  operation/interactionKind
  protectedInvariantRefs
  requiredDependencyClaims
  requiredAuthority/currentness floors
  allowed degradation class
  effect/settlement restrictions
  replay/reconciliation obligations
  evidence horizon
  exit/recovery predicate
```

`Capability degraded != every operation degraded identically`.

A catalog query may tolerate bounded stale data while an approval or payment command on the same capability must stop. Degradation therefore belongs to an operation/contract/invariant scope, not merely host or service health.

## 2. Candidate degraded-operation classes

Implementation-independent candidate classes:

- **NORMAL_ONLY / STOP** — operation requires current dependencies/authority and must not proceed when they cannot be proven;
- **READ_ONLY_STALE_BOUNDED** — reads may use a declared snapshot/cache within an explicit currentness horizon and must surface that qualification;
- **LOCAL_CONVERGENT** — local updates may continue because the contract declares a lawful merge/reconciliation law for that invariant;
- **PREALLOCATED_RIGHT** — effects may continue only by consuming rights/reservations already allocated before disconnection;
- **RECONCILE_LATER** — local action may proceed but creates an explicit reconciliation obligation and cannot be represented as globally converged;
- **PARTIAL_RESULT** — optional/quality dimensions may be omitted while the core result remains contract-valid;
- **QUEUE_WITHOUT_EFFECT** — admission may be durably recorded while external effect execution waits for required authority/currentness;
- **FAIL_CLOSED** — security/authority-sensitive operation returns unavailable/indeterminate rather than weakening policy;
- **SHED / REJECT** — work may be rejected to protect a bounded resource or higher-priority invariant.

These are research categories, not enums or product APIs.

`Graceful degradation != universally return something`.

Sometimes the correct degraded behavior is explicit refusal.

## 3. Availability claims are multidimensional

A dependency may be reachable but semantically unusable, or unreachable while enough local evidence exists to continue safely. At minimum distinguish:

- **transport reachability**;
- **provider health/capacity**;
- **contract/profile compatibility**;
- **data/currentness sufficiency**;
- **identity/authority/security sufficiency**;
- **effect-right availability**;
- **settlement/reconciliation capability**;
- **resource-budget availability**.

`Health check green != operation admissible`.

Istio/Envoy-style outlier detection can answer whether an endpoint appears healthy enough for traffic. It cannot establish that a failover endpoint supports the required semantic generation, security floor, tenant/classification context or effect guarantee.

Likewise:

`Circuit open != business authority revoked`.

Circuit state is resilience evidence about a dependency path, not canonical business/security truth.

## 4. Dependency degradation must compose as guarantee constraints

Suppose capability A calls B, and B calls C. If C is unavailable, B may legally degrade for one operation but not another. A cannot infer from `B returned 200` that its own end-to-end guarantee is unchanged.

Candidate composition rule:

```text
Admissible(A.operation)
  requires local A contract
  AND qualified dependency outcomes
  AND end-to-end invariant preservation
  AND explicit treatment of omitted/stale/queued effects
```

This is conceptual, not literal Boolean implementation.

A dependency result should preserve the dimensions material to the caller: currentness, completeness, authority, settlement/effect status, degradation class and provenance. An adapter may normalize representation but cannot erase a weaker guarantee.

`Dependency fallback succeeded != caller's original contract satisfied`.

## 5. No central availability oracle

A logical Exchange Plane may propagate health/degradation evidence and apply exchange policy, but it should not become a platform-wide oracle declaring every capability `UP`, `DOWN` or `SAFE`.

Reasons:

- reachability depends on observer and path;
- semantic admissibility depends on operation/invariant;
- security/currentness floors can differ by tenant or effect;
- independent runtimes may retain locally sufficient dependency closure;
- a central oracle becomes both a blast-radius amplifier and hidden runtime dependency.

`Shared health telemetry != shared semantic authority`.

Each boundary evaluates declared claims against its own contract and locally available evidence. Central observability can improve diagnosis without owning admission truth.

## 6. Control-plane loss and static stability

AWS static-stability/cell guidance provides a useful boundary: an already provisioned data plane can continue using durable configuration while its control plane is unavailable.

G4 consequence:

`Control plane unavailable != data plane unavailable`.

But also:

`Cached control-plane state != indefinitely current authority`.

Continuation is bounded by the operation's declared security/currentness horizon. Runtime autonomy therefore favors locally durable dependency closure and pre-provisioned policy/profile material, not unlimited stale operation.

A degraded path that suddenly requires creating a new remote resource, consulting Builder or fetching a central policy that normal operation did not require violates the static-stability goal and can worsen failure precisely when dependencies are impaired.

## 7. Resource pressure and semantic degradation are separate

Envoy explicitly distinguishes overload management of its own CPU/memory/file descriptors from circuit breaking aimed at upstream dependencies. Kubernetes APF likewise partitions request concurrency so critical flows are not starved by noisy ones.

G4 should preserve that distinction:

`Resource overload != semantic incompatibility`.

A capability may reject low-priority optional work to protect a critical operation without changing the critical operation's semantics. Conversely, a semantically inadmissible operation remains inadmissible even when ample capacity exists.

Candidate dimensions:

```text
capacity pressure
rate/quota budget
priority/criticality
semantic admissibility
security/currentness
external-effect authority
```

No one dimension substitutes for another.

## 8. Borrowing spare capacity must not borrow semantic rights

Kubernetes APF permits bounded concurrency lending/borrowing among priority levels. The useful principle is resource utilization with explicit bounds.

For G4:

`Borrowable execution capacity != borrowable authority/quota/effect rights`.

A low-utilization capability/tenant may lend compute or queue capacity if policy permits, but this cannot silently transfer business quotas, security authority, privacy budgets, inventory reservations or effect rights. Resource scheduling and semantic conservation remain separate contracts.

## 9. Failover is not semantic fallback

Locality failover and outlier detection can reroute requests from an unhealthy endpoint to another locality. This is valuable transport behavior, but only transparent when the target is already qualified for the same required contract/profile and authority context.

`Healthy failover endpoint != compatible failover endpoint`.

If the target supports a weaker profile or older data/security floor, routing there is a semantic downgrade unless explicit mediation/revalidation says otherwise. A mesh/gateway must not convert infrastructure health into semantic equivalence.

This preserves prior G4 rules that service mesh is not semantic governance and topology substitution must preserve negotiated semantic identity.

## 10. Degradation must be monotone with respect to hard invariants

A degraded mode may reduce availability, quality, freshness or optional completeness. It must not silently relax a hard invariant merely to keep success rates high.

Examples:

- omit optional recommendation enrichment: potentially safe when contract declares partial result;
- use a 30-second-old catalog snapshot: potentially safe when freshness budget allows;
- approve with stale revocation state: unsafe when current security evidence is required;
- spend unallocated inventory because quota service is unreachable: unsafe under strict conservation;
- queue a payment command without executing it: potentially safe when admission and effect are distinct;
- report payment as successful because the provider is unreachable: false success.

Candidate rule:

`Degraded guarantee <= declared quality/availability dimensions, never below hard safety/security/ownership invariants`.

Here `<=` is conceptual partial ordering, not a chosen formalism.

## 11. Degraded-mode transitions need evidence and hysteresis

Google SRE warns that degradation/load-shedding paths can themselves create feedback loops and that rarely exercised failure code is risky. Circuit breakers similarly use state/history rather than flipping on a single arbitrary observation.

G4 consequence:

`One failed probe != universal degraded-mode transition`.

A transition should identify:

- triggering evidence and observer scope;
- entry threshold/horizon where relevant;
- affected operations/invariants;
- resulting guarantee profile;
- recheck/recovery evidence;
- anti-flap/hysteresis behavior where operationally necessary;
- audit/provenance sufficient to explain why an effect was admitted or refused.

This does not require a universal state machine.

## 12. Recovery from degraded mode is a requalification, not a flag reset

When a dependency returns, queued work, stale reads, preallocated rights and locally divergent updates may still exist.

`Dependency healthy again != degraded obligations settled`.

Normal-mode resumption may require:

- current security/authority evidence;
- reconciliation of local divergent work;
- settlement of queued/unknown external effects;
- refresh/invalidation of stale projections;
- restoration of resource budgets;
- fencing of obsolete local rights;
- requalification of semantic profile/version skew.

Independent invariants may recover independently; no global recovery barrier is implied.

## 13. Candidate proof obligations

1. Each degraded behavior is declared per operation/interaction and protected invariant, not inferred from coarse service health.
2. A capability exposes enough qualification for callers to distinguish normal, stale-bounded, partial, queued, reconcile-later and refused outcomes where material.
3. Hard safety/security/ownership invariants are never silently weakened to improve availability.
4. `FAIL_CLOSED` remains available for operations whose authority/currentness cannot be safely established.
5. Read-only stale operation names an explicit freshness/currentness horizon and never masquerades as current truth.
6. Preallocated-right operation proves the right was allocated before disconnection and cannot be double-spent by another partition.
7. Locally convergent operation names the merge/reconciliation law and does not imply convergence of associated external side effects.
8. Reconcile-later operation creates durable lineage/obligation evidence and does not report global convergence prematurely.
9. Queue-without-effect keeps admission distinct from business-effect completion and requalifies before later execution when required.
10. Dependency health/reachability evidence cannot substitute for semantic profile, authority, currentness or effect-right evidence.
11. Failover/rerouting preserves the required contract/profile or exposes explicit mediation/downgrade/incompatibility.
12. Degradation qualification composes across dependency chains; an upstream caller cannot erase downstream lossiness/staleness.
13. No central health/availability service becomes mandatory semantic authority for autonomous runtimes.
14. Locally durable control-plane state may support bounded static-stable operation, but its security/currentness horizon remains explicit.
15. Capacity shedding/priority decisions cannot manufacture business authority or alter conserved semantic budgets.
16. Borrowed compute/concurrency does not imply borrowed tenant quota, privacy budget, inventory right or approval authority.
17. Entry to degraded mode records sufficient evidence/scope to explain subsequent admissions/refusals without treating telemetry as canonical business truth.
18. Exit from degraded mode requalifies unresolved queued/divergent/unknown obligations rather than merely clearing a health flag.
19. Retry behavior in degraded mode is bounded to avoid amplification/cascading failure and preserves stable obligation/effect identity.
20. Degraded paths are testable against dependency loss, stale evidence, overload, partial recovery and oscillation; nominal-path success is insufficient proof.
21. Gateway/adapter/service mesh may implement routing/resilience mechanics but cannot own capability business semantics or fabricate guarantee equivalence.
22. Direct call, RPC, broker, stream and file exchange may realize the same degraded-operation contract only when material operational differences remain visible.

## 14. Adversarial cases

- health check is green but target replica is on an older semantic profile and receives a sensitive command;
- circuit breaker opens and application treats that as authorization to use stale credentials indefinitely;
- catalog read correctly degrades to cache, but approval logic reuses the same stale-cache policy for revocations;
- A calls B, B returns a partial result after C fails, and A labels the aggregate result complete;
- gateway strips `stale/currentness` metadata while normalizing a response;
- service mesh fails over to a healthy region whose security floor is behind the negotiated one;
- central health oracle is partitioned and marks all capabilities down although runtimes have locally sufficient dependency closure;
- central health oracle is stale and marks a dependency safe after its authority was revoked;
- retry storm against an impaired dependency consumes capacity needed for unrelated critical work;
- optional enrichment and payment execution share one connection pool and enrichment failure starves payment;
- low-priority tenant borrows spare concurrency and implementation accidentally interprets it as additional business quota;
- inventory service is unreachable and client invents local capacity instead of consuming preallocated rights;
- locally convergent metadata merge is used to justify duplicate non-commutative external effects;
- queued command admitted during partition executes after recovery without rechecking a security floor that advanced meanwhile;
- stale read is presented without age/currentness qualification and downstream treats it as current truth;
- dependency returns healthy but old queued retries execute alongside newly admitted work and duplicate effects;
- degradation mode flaps on every failed probe, producing inconsistent effect policy within one occurrence;
- fallback path dynamically provisions a new dependency from an unavailable control plane, causing cascading failure;
- Builder outage blocks a client runtime even though its declared degraded mode should be locally self-sufficient;
- Exchange Plane stores fallback business values and becomes accidental canonical owner;
- load shedding rejects authority-maintenance/lease-renewal traffic before optional work, causing avoidable split-brain;
- DR/failover test verifies endpoint reachability but never checks semantic profile/currentness/authority equivalence.

## 15. Decision criteria by interaction realization

**Direct/local call:** process-local reachability is almost always true; degraded semantics still need explicit stale/currentness/authority rules because dependency state can be logically unavailable even in-process.

**RPC:** circuit breaking, timeout, retry and failover are operational mechanisms; response metadata/disposition must preserve whether the semantic contract was fully satisfied, partially satisfied or refused.

**Queue/broker:** queueing can preserve admission while delaying effect, but backlog growth, expiry, security-floor changes and replay identity must be governed explicitly.

**Replayable stream:** local consumption may continue from a durable log during producer/control-plane loss when profile/currentness rules allow; lag is not automatically semantic staleness for every operation.

**Gateway/service mesh:** useful for health-based routing, load shedding and isolation, but cannot determine capability-local business admissibility solely from endpoint health.

**Adapter:** may translate fallback/degraded representations only when lossiness and guarantee changes remain explicit.

**File/artifact exchange:** offline use can be highly statically stable when immutable artifact/profile identity and freshness/security horizons are sufficient; file availability alone is not current authority.

## 16. Deduplication against existing G4 findings

This round does not reopen generic circuit-breaker design, infrastructure HA, split-brain reconciliation, offline security floors, rate limiting, service mesh architecture or DR.

Material delta is the **capability contract for safe degraded operation**: it makes degradation operation/invariant-scoped; decomposes availability into transport, capacity, semantic, currentness, authority and effect dimensions; defines composition rules for degraded dependency outcomes; separates resource shedding from semantic permission; prevents infrastructure failover from becoming semantic downgrade; and derives a decentralized qualification model compatible with runtime autonomy.

## 17. Portability and exit path

No AWS cell pattern, Kubernetes APF/PDB, Envoy overload manager, Istio failover, Azure Bulkhead/Circuit Breaker implementation or Google SRE mechanism is required. A replacement resilience mechanism is acceptable only if it preserves or explicitly requalifies:

- operation/invariant-scoped degraded-mode policy;
- currentness/security/authority floors;
- semantic profile/contract identity across failover;
- stable obligation/effect identity across retries/queueing;
- preallocated-right/conservation semantics where used;
- explicit partial/stale/queued/reconcile-later dispositions;
- resource isolation without semantic-right transfer;
- degraded dependency metadata through cross-capability composition;
- autonomous runtime dependency closure;
- recovery/reconciliation obligations and capability-local business ownership.

If a mechanism preserves uptime by silently weakening these guarantees, it is not a transparent resilience substitution.

## 18. Maturity and next gap

Material delta: **YES**.

The family remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Highest-value next gap: **degraded-mode dependency graph and end-to-end guarantee synthesis** — determine how a multi-capability operation derives its effective guarantee when several dependencies independently enter different degraded classes, how to prevent cyclic fallback/retry amplification, and how to represent minimal-cut dependencies versus optional enrichment without building a central orchestration/availability authority.