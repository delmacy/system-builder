# G4 Capability Exchange — Opaque Route-Set Assurance and Structural Exclusion

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select a cloud, load balancer, mesh, gateway, broker, network topology, policy engine or implementation technology; it does not reopen G3 or authorize product work.

## 1. Research question

The cross-locus round established that a protected effect admitted before final target selection needs either qualification of every materially reachable commitment locus, a proven route constraint, or commitment-adjacent requalification. The unresolved case is harder: the provider or intermediary can route internally, fail over, retry, spill, drain or fail open without exposing a complete backend set or a stable routing decision to the caller.

The question is how to justify route-set closure when the route is partly opaque without fabricating non-reachability from silence and without forcing every protected effect through a System Builder-controlled proxy.

Core boundary:

`unobserved route != unreachable route`.

And:

`configured preference != structural exclusion`.

## 2. Evidence reviewed

Primary/current documentation used as mature failure evidence:

- AWS Global Accelerator documents that when no healthy weighted endpoint exists in an endpoint group it can ignore a traffic dial of zero during failover; after searching nearby groups it can fail open to a random endpoint in the closest group. Established connections are not moved immediately during recovery. <https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-endpoint-weights.unhealthy-endpoints.html>
- AWS Global Accelerator endpoint guidance likewise states that when no healthy endpoint is available it can route to all endpoints in the Region. <https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints.html>
- Azure Front Door documents that when health probes fail for every origin in a group, it treats all origins as unhealthy and round-robins across all of them. <https://learn.microsoft.com/en-us/azure/frontdoor/health-probes>
- Google Cloud Load Balancing health-check documentation records product-specific last-resort behavior: some load balancers drop traffic when all backends are unhealthy, while others distribute traffic among unhealthy backends; therefore `unhealthy` is not a portable exclusion semantic. <https://docs.cloud.google.com/load-balancing/docs/health-check-concepts>
- Google Cloud internal passthrough load-balancer failover exposes an explicit `dropTrafficIfUnhealthy` choice; when disabled, last-resort traffic can be distributed among primary backends. <https://docs.cloud.google.com/load-balancing/docs/internal/setting-up-failover>
- Google Cloud advanced load-balancing policy notes that failover decisions can be localized: each local proxy behaves independently, and unhealthy backends can still receive traffic unless additional draining/exclusion behavior applies. <https://docs.cloud.google.com/load-balancing/docs/service-lb-policy>
- Envoy retry host/priority selection can deliberately choose a different host or priority on a retry, demonstrating that a caller-visible logical route need not identify every physical attempt target. <https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/http/http_connection_management>

These systems are benchmarks only; none is selected.

## 3. Material finding: route closure is an assurance claim, not an inventory claim

A configured backend inventory is not necessarily the full set of effect-capable loci. Hidden failover, retries, stale connections, provider emergency behavior, service-local routing or a nested load balancer can widen the physical attempt set.

Candidate distinction:

- `ConfiguredRouteSet` — targets represented by configuration/control-plane evidence;
- `ObservedRouteSet` — loci actually observed in bounded runtime evidence;
- `StructurallyReachableRouteSet` — loci not excluded by qualified structural controls;
- `AssuredEffectRouteSet` — a conservative set justified strongly enough for the protected guarantee.

The last is the useful proof object. It need not enumerate every internal hop; it must conservatively cover every locus capable of crossing the protected effect boundary.

`backend list complete != effect route closure proven`.

## 4. Negative reachability requires positive evidence

Absence from documentation, telemetry, discovery, health status or a provider API is not a proof that a locus cannot receive an effect.

A negative reachability claim should require a positive exclusion basis, such as one or more of:

1. a provider contract whose declared semantics exclude the locus for the relevant failure modes;
2. an independently enforced network/trust boundary that the provider route cannot bypass;
3. target-side authorization/fencing that prevents commitment even if traffic arrives;
4. a provider primitive explicitly documented to drop rather than spill/fail open for the relevant condition;
5. cryptographically or otherwise strongly bound destination selection where the target identity is verified before commitment;
6. a capability-local effect gate that rejects any target/locus not in the qualified set.

Candidate rule:

`negative reachability proof = positive structural exclusion evidence`, not `no evidence of reachability`.

## 5. Preference, health and weight are not universal exclusion semantics

The benchmark systems show why routing metadata must remain product-qualified:

- AWS Global Accelerator can ignore a traffic dial of zero during failover.
- Azure Front Door can send traffic to origins classified unhealthy when all origins are unhealthy.
- Google Cloud products differ: some drop all traffic, while others use unhealthy backends as a last resort.

Therefore the following are invalid as universal G4 rules:

`weight=0 -> unreachable`

`unhealthy -> unreachable`

`disabled in preferred policy -> unreachable under every failure mode`

`control-plane omission -> unreachable`

A driver may normalize these mechanisms into evidence but cannot fabricate the semantic relation `UNREACHABLE` unless the provider-specific contract actually supports it.

## 6. Candidate RouteExclusionEvidence

A transport-independent proof vocabulary may need an explicit exclusion artifact:

```text
RouteExclusionEvidence
  protectedEffectRef
  excludedLocusOrClassRef
  exclusionMechanismKind
  enforcementBoundaryRef
  providerSemanticEvidenceRefs[]
  failureModesCovered[]
  failureModesNotCovered[]
  bypassPathsConsidered[]
  observedAt
  currentnessHorizon
  provenanceRefs[]
  counterexampleRefs[]
  resultingDisposition
```

Candidate dispositions:

- `STRUCTURALLY_EXCLUDED`
- `CONDITIONALLY_EXCLUDED`
- `PREFERENCE_ONLY`
- `OBSERVED_ABSENT`
- `UNKNOWN`
- `DEFEATED`

Only the first two can contribute directly to route-set closure, and conditional exclusion is valid only inside its declared condition/failure-mode envelope.

This is research vocabulary, not a schema commitment.

## 7. Opaque provider routing can still be safe without route omniscience

Complete internal topology knowledge is not always necessary. The proof can shift from `know every internal target` to `prove every target capable of committing E satisfies G or cannot commit E`.

Candidate closure alternatives:

### A. Universal target-side invariant

Every effect-capable target enforces the same required authority/currentness/fencing invariant before commitment. Internal routing may remain opaque because no hidden route bypasses the invariant.

### B. Structural containment

Network, identity, cryptographic destination binding or another independently enforced boundary makes unqualified targets unable to receive or commit the effect.

### C. Provider-qualified closed set

The provider contract exposes a bounded target/failover universe with semantics strong enough for the relevant failure modes and currentness horizon.

### D. Defer/queue without effect

The runtime may accept work but does not cross the protected effect boundary while route closure is unknown.

### E. Incompatibility

If hidden routing can reach an unqualified commitment locus and no commitment-adjacent gate or structural exclusion exists, the provider/topology is incompatible with that protected guarantee.

Thus:

`opaque topology != automatically unsafe`, but `opaque commitment reachability + no invariant/exclusion != proven safe`.

## 8. Emergency fallback is part of the contract surface

Failure behavior is not an operational footnote when it changes the set of loci that can commit effects. Fail-open, spillover, unhealthy-backend reuse, retry-to-another-priority, connection draining and emergency routing belong to route assurance.

Candidate rule:

`normal-path closure != failure-path closure`.

A route proof names the failure modes it covers. If a provider documents an emergency fallback that bypasses ordinary weight/health preferences, the fallback is included in the reachable set or structurally blocked.

Provider changes to fallback semantics are material dependencies capable of defeating route-exclusion evidence even when the configured backend list is unchanged.

## 9. Independent enforcement beats inferred topology

For high-risk effects, an independent commitment-adjacent invariant can be stronger than attempting to reconstruct a provider's hidden routing graph.

Examples at the principle level include:

- target verifies tenant/authority/classification/currentness before effect;
- target accepts only a qualified effect token bound to effect identity and constraints;
- effect resource is inaccessible outside a qualified trust/network boundary;
- duplicate-effect fence is shared or otherwise valid across all possible target loci;
- unsupported target generation rejects rather than approximates the contract.

This does not imply a central gateway. Enforcement can be capability-local, runtime-local, resource-local or provider-local.

`complete mediation != centralized mediation`.

## 10. Observation remains useful but cannot prove absence alone

Telemetry, traces, access logs and probes can discover previously unknown routes and defeat a closure proof. They are asymmetric evidence:

- seeing traffic at unexpected locus B is strong evidence that B is reachable;
- never seeing traffic at B over a finite sample is not universal evidence that B is unreachable.

`positive counterexample can defeat closure; finite non-observation cannot establish closure by itself`.

This is especially important for rare disaster/fail-open paths that may never appear in ordinary production traces.

## 11. Retry and nested intermediaries

A logical request can cross multiple independently routing layers: client discovery, gateway, mesh, provider edge, service-local balancer and target-internal retry. Route assurance composes across them.

Candidate rule:

`closure of layer N != closure of end-to-end effect path`.

Each intermediary either preserves the existing target constraint, narrows it, or widens it. Widening after an earlier gate is material. A gateway that validates target A before a downstream intermediary can retry to B has not proven target B.

An adapter/driver may expose this widening as evidence; it cannot hide it under a common interface.

## 12. Currentness and monotonic defeating evidence

Route exclusion is mutable. A provider can add emergency behavior, a new failover tier, a new retry path or a new backend class without local application changes.

Candidate currentness rule:

`exclusion proof currentness = structural-control currentness + provider-routing semantic currentness + target-gate currentness`.

If a runtime observes an unexpected locus that defeats a previous exclusion claim, older route configuration or cached documentation cannot erase that observation without explicit successor/reconciliation evidence.

`observed bypass establishes a local floor against stale exclusion evidence`.

## 13. Exchange Plane boundary

The Exchange Plane may carry route constraints, target evidence, attempt lineage, exclusion references and reconciliation state. It does not become a global topology oracle or business authority.

`Exchange Plane carries route assurance evidence != Exchange Plane owns provider topology`.

`route assurance != mandatory central proxy`.

The capability remains owner of the business effect and its acceptance criteria; provider/transport-specific drivers and adapters surface mechanism evidence; gateways govern passages within their declared boundary; controllers may reconcile desired/observed route constraints where authorized.

## 14. Proof obligations

1. Every negative reachability claim has positive, scoped exclusion evidence.
2. Absence from configuration, documentation, discovery, logs or probes never alone proves non-reachability.
3. Provider preference/weight/health semantics are not normalized into `UNREACHABLE` without an explicit provider contract.
4. Failure-path routing is included in route closure for protected effects.
5. Emergency fail-open/spillover behavior is either included, structurally excluded or makes the guarantee incompatible.
6. Provider-specific `drop when unhealthy` semantics are distinguished from products that reuse unhealthy backends.
7. Route exclusion evidence declares failure modes covered and not covered.
8. A hidden internal topology is acceptable only when commitment safety is invariant across hidden targets or unqualified targets are structurally unable to commit.
9. Target-side enforcement occurs before the protected commitment boundary.
10. Complete mediation does not require a central gateway/proxy.
11. An upstream gate does not prove a downstream target if later intermediaries can widen the route set.
12. Retry/hedging/service-local rerouting remain part of end-to-end route closure.
13. Positive observation of an unexpected target defeats incompatible exclusion claims.
14. Finite non-observation does not establish universal negative reachability.
15. Health evidence remains operational evidence, not business-authorization equivalence.
16. Structural network/trust exclusion is qualified against bypass and provider-managed alternate paths.
17. Cryptographic/identity destination binding proves only the identity/scope actually bound, not unrelated business semantics.
18. Provider routing semantic changes selectively defeat dependent route proofs.
19. Stale route configuration cannot erase a newer observed bypass floor.
20. Opaque route state remains `UNKNOWN/PARTIAL` rather than preferred-target fiction.
21. Route closure is guarantee/effect scoped; a topology safe for reads is not automatically safe for irreversible writes.
22. Duplicate-effect safety is separately proven from authorization-safe reachability.
23. Client runtime autonomy is preserved; Builder/central Exchange Plane is not required online when local proof closure is sufficient.
24. No driver/adapter/gateway may manufacture route closure from unsupported provider semantics.
25. Historical effect evidence records the route/exclusion assurance that was current when the effect committed.
26. Provider outage or degraded mode cannot convert `UNKNOWN` route closure into false success.

## 15. Adversarial cases

1. A backend has weight zero but provider emergency failover still routes to it.
2. All origins are unhealthy and a provider round-robins across them.
3. One load-balancer product drops on total failure while another fails open; a generic driver treats both as identical.
4. Configured endpoint inventory omits a provider-internal fallback tier.
5. Gateway admits for A; downstream mesh retry sends to B.
6. Client observes only A for months and infers B is impossible; disaster routing later selects B.
7. Health probe says B unhealthy but last-resort routing still sends effects there.
8. Provider adds a new failover class without application configuration change.
9. Route API omits a target that remains reachable through an established connection.
10. Service-local retry crosses region/account boundary after caller admission.
11. Target B accepts the same protocol but lacks the required authority/currentness gate.
12. Network rule appears to pin A but a provider-managed private path bypasses the assumed boundary.
13. Target identity is cryptographically verified but business effect semantics differ by generation.
14. Every target is authorization-safe but duplicate fencing is absent across targets.
15. A trace collector misses the rare emergency path and reports the route set as complete.
16. Provider documentation is silent on all-unhealthy behavior and the driver assumes drop.
17. Provider documentation changes fail-open semantics but cached route proof remains current indefinitely.
18. A callback/reverse path uses a different hidden routing layer and loses tenant/classification context.
19. Control plane removes B but draining connections continue committing at B.
20. Local route pinning is advisory and a lower provider layer can override it.
21. Structural exclusion applies to normal traffic but not provider control/emergency traffic.
22. Target-side gate checks principal but not semantic generation/currentness.
23. An opaque route is declared incompatible globally even though every possible target independently enforces the protected invariant, causing unnecessary centralization.
24. Exchange Plane is promoted into mandatory topology oracle/proxy, violating runtime autonomy.
25. Adapter reports `unreachable` because it cannot enumerate a route, conflating epistemic absence with structural exclusion.
26. Provider outage causes routing evidence lookup failure and the caller records the preferred target as the effective target.

## 16. Decision criteria

For a protected effect with partly opaque routing:

1. identify the commitment boundary and whether target/locus semantics matter;
2. enumerate configured/observed routes without claiming completeness;
3. identify every routing layer that can widen target selection after admission;
4. seek positive structural exclusion for unqualified target classes;
5. include documented emergency/fail-open/failover/retry behavior;
6. if route closure remains opaque, determine whether every possible commitment target independently enforces the required invariant;
7. if yes, preserve opaque routing as an operational concern with qualified evidence;
8. if no, constrain routing, move/repeat the gate adjacent to commitment, defer the effect, or mark the topology incompatible;
9. keep duplicate-effect safety, authority, currentness and routing closure as separate proof dimensions;
10. reconcile only affected route proofs when new provider/observed evidence arrives.

## 17. Portability / exit path

The hypothesis is intentionally independent of AWS, Azure, Google Cloud, Envoy, DNS, anycast, HTTP/gRPC, broker or service mesh. Portable concepts are:

- protected effect and commitment boundary;
- route widening/narrowing relation;
- assured route set;
- positive structural exclusion evidence;
- failure-mode coverage;
- target-side invariant;
- defeating route observation;
- route-assurance currentness;
- partial/unknown/incompatible dispositions.

Changing transport/provider should require reacquiring mechanism-specific evidence, not changing the semantic obligation.

## 18. Deduplication and maturity

This round does not reopen generic routing, rollout skew, retries, complete mediation, service-mesh governance, effect identity, provider drift or degraded-mode research. It adds one missing boundary:

`route-set qualification -> opaque internal routing -> negative reachability needs positive exclusion -> failure-path closure -> target invariant can replace topology omniscience -> no mandatory central proxy`.

Material delta: **YES**.

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`; this subproblem is materially bounded but the broader exchange-plane family is not saturated.

Next high-value gap: **composition of route-assurance evidence across independently administered intermediaries/trust domains** — especially how exclusion and target-side guarantees compose when client discovery, enterprise gateway, mesh/provider edge and external SaaS each expose different evidence scopes, without allowing the weakest intermediary to silently widen the effect route or turning the Exchange Plane into a global topology authority.
