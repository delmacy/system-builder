# G4 — Derived Evidence DAG Invalidation Under Revocation Storms

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-19
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can autonomous runtimes invalidate or requalify deeply derived guarantee evidence when revocation/security floors advance rapidly and control-plane connectivity is correlated or partitioned, without O(N) synchronous fan-out, without silently accepting stale derived proofs, and without turning the Capability Exchange Plane into a central authority/oracle?

This document extends `G4_CAPABILITY_EXCHANGE_GUARANTEE_EVIDENCE_CACHE_INVALIDATION.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature-system evidence reviewed:

- RFC 9162 Certificate Transparency v2: Merkle inclusion/consistency proofs, signed tree heads, append-only consistency, auditing, and the distinction between a promise to include and later proof of inclusion. Consistency proofs are logarithmic in tree size rather than requiring clients to replay the full history.
- Kubernetes API consistency/watch semantics: opaque `resourceVersion`, `Exact` and `NotOlderThan` reads, watch progress, arbitrarily stale `Any` reads, and explicit `410 Gone` when a requested historical version has fallen below retained history.
- SPIFFE Trust Domain/Bundle and Federation specifications: monotonically increasing bundle sequence numbers when present, refresh hints, redaction/rotation propagation, latest-known bundle handling, and strict separation between trust domains.
- Google Service Control admission API: explicit warning that policy/configuration propagation can lag and that cached admission decisions improve availability but cannot be assumed to reflect the latest policy.
- AWS AppConfig data plane/agent: local cached configuration, asynchronous polling, one-use continuation tokens, version-aware rollout, and temporary version skew between independently polling agents during gradual deployment.
- Prior G4 research on offline security floors, evidence minimization, policy lifecycle, profile negotiation, guarantee synthesis, distributed evidence caching, DR, split-brain reconciliation and semantic-generation handoff.

These are benchmarks and failure evidence, not technology selections.

## 3. Material findings

### 3.1 Revocation propagation is a monotonic-floor problem before it is a cache-delete problem

Deleting every stale cache entry synchronously is neither necessary nor sufficient. During a revocation storm, some runtimes will be unreachable, some invalidation messages will be delayed, and derived proofs may exist in multiple local caches.

The safety-relevant primitive is a monotonic minimum acceptable floor for the claim domain:

`Local admissibility requires evidence >= required floor`.

A runtime that has observed floor F3 must never accept F2-derived evidence merely because the F2 cache entry still exists. Conversely, a runtime that has not yet observed F3 cannot claim currentness beyond its locally justified horizon.

Therefore:

`Cache deletion != revocation proof`.

`Observed higher floor != permission to roll back after restart/partition`.

### 3.2 Derived evidence needs a compact dependency commitment, not necessarily every transitive input inline

A root guarantee may derive from hundreds or thousands of child claims. Retaining every transitive input on every root proof can become operationally prohibitive, but retaining no lineage makes selective invalidation impossible.

The implementation-independent hypothesis is a qualified dependency commitment that can summarize the material proof inputs while preserving the ability to answer:

- which authority/profile/currentness domains constrained this result;
- what minimum floors/revisions were assumed;
- whether a newly observed supersession intersects those assumptions;
- whether detailed evidence is still resolvable when audit/reconciliation requires it.

Possible realizations include explicit input refs, hierarchical summaries, authenticated sets/trees, version vectors scoped to named domains, or other compact commitments. No representation is selected.

`Compact dependency commitment != global revision`.

`Commitment verifies dependency set/history != dependencies are currently admissible`.

RFC 9162 is useful here because consistency between two append-only states can be proven compactly without transferring all prior entries. G4 does not infer that every evidence DAG should be a Merkle tree.

### 3.3 Invalidation can be lazy for lookup, but not lazy for security admission

A revocation event does not require walking every cached derived node immediately if each future admission can cheaply test whether its dependency commitment is below a locally known floor.

This separates:

- eager physical eviction;
- logical invalidation by floor advancement;
- later garbage collection;
- historical resolvability.

A root proof may remain on disk after becoming inadmissible. It must simply fail the current-admission predicate.

`Physically present != currently admissible`.

This is the main path away from O(N) synchronous fan-out.

### 3.4 Revocation storms require coalescing by semantic domain/floor, not one invalidation per cached object

If one trust key, policy generation or capability profile supersession invalidates one million derived entries, emitting one million correctness-critical invalidation messages is itself a failure amplifier.

A stronger pattern is to advance a qualified floor/epoch for the affected semantic domain and let cached evidence self-disqualify on next use. Event delivery can accelerate eviction but is not the safety mechanism.

`One revocation fact != one invalidation message per derived object`.

The scope must remain qualified: tenant, trust domain, classification, profile/policy family, authority/effect domain or other material boundary. A platform-wide epoch is unsafe and operationally expensive when the change is narrower.

### 3.5 Correlated control-plane partition requires explicit offline dispositions

A runtime may lose the same control-plane paths that normally deliver both revocation notices and revalidation evidence. This correlated failure is more dangerous than a single cache miss.

For each claim class, the runtime therefore needs a declared offline rule such as:

- continue until a bounded horizon using locally durable floor/evidence;
- continue only non-effectful/read-only operations;
- continue only with preallocated rights whose validity is locally provable;
- queue without effect;
- require fresh revalidation;
- fail closed.

`Control-plane unreachable != old evidence becomes indefinitely valid`.

`Control-plane unreachable != every capability must stop`.

The result composes with G4 degraded-mode contracts rather than creating a separate availability authority.

### 3.6 Currentness tokens must be monotonic within their domain but opaque across domains

Kubernetes `resourceVersion` is a useful boundary: clients can demand `Exact` or `NotOlderThan`, but resource versions are opaque and cannot be numerically compared by clients. This reinforces that G4 should not manufacture a universal comparable revision from independent capabilities.

A dependency can expose a token/floor with domain-defined comparison or satisfaction semantics. The caller only needs to know whether the evidence satisfies the declared requirement.

`Token equality/order semantics are domain-owned`.

`Cross-domain token aggregation != total order`.

### 3.7 Below-retention evidence must fail explicitly, not be silently reconstructed from latest state

Kubernetes returns `410 Gone` when a requested version has fallen below retained history. This is a strong precedent for G4 derived evidence: if a root proof references a dependency state that can no longer be resolved, the system must expose a below-floor/revalidation/unknown disposition rather than pretend the current state proves the historical derivation.

`Historical dependency unavailable != dependency never existed`.

`Latest state available != historical proof reconstructed`.

This extends the earlier handoff-compaction boundary into cached guarantee evidence.

### 3.8 Append-only consistency evidence helps detect rollback/equivocation but does not solve currentness alone

RFC 9162 consistency proofs can show that a newer log state extends an older one without rewriting history. That is valuable for detecting rollback or inconsistent views of revocation/floor history.

However:

`Append-only consistency != latest view`.

A partitioned runtime may possess a perfectly consistent but old tree head. Currentness still requires a horizon, witness, gossip/peer comparison, revalidation policy or other qualified mechanism.

Similarly:

`Signed floor/head != globally observed floor/head`.

### 3.9 Sequence/floor propagation needs anti-rollback persistence across restart and restore

SPIFFE bundle sequence numbers are monotonically increasing when present and are intended to help ordering/supersession. G4 generalizes this as a requirement that security-sensitive local floors survive ordinary restart and must not be silently rewound by VM/snapshot restore.

If rollback-resistant local storage is unavailable, the runtime must represent the uncertainty and requalify before effectful admission according to the contract.

`Recovered cache snapshot != recovered monotonic security observation`.

This aligns with prior G4 DR/recovery research: operational rollback is not security-floor rollback.

### 3.10 Revocation storms and refresh storms are coupled failure modes

A large floor advance can invalidate many entries simultaneously. If every request immediately performs synchronous revalidation, logical invalidation becomes a dependency stampede.

Candidate containment, still implementation-independent:

- coalesce revalidation per qualified claim/floor;
- jitter background refresh before hard expiry;
- prioritize security-floor material over optional enrichment;
- bound revalidation attempt/concurrency/rate/cost budgets;
- preserve explicit `UNKNOWN`/`REVALIDATION_REQUIRED` rather than converting timeout to stale success;
- prefetch or stage successor trust/profile material when the authority protocol permits it.

`Revocation safety != synchronous global refresh`.

`Refresh success rate != semantic currentness proof`.

### 3.11 Rollout skew is admissible only when the root contract can represent it

AWS AppConfig documents that independently polling agents may briefly serve different versions during gradual rollout. This is operationally normal, but G4 cannot generalize that all policy/security changes may tolerate such skew.

A change must declare whether overlap is:

- behaviorally compatible;
- security-non-downgrading;
- historical-only;
- mutually exclusive for new effects;
- requiring cutover/fencing.

`Gradual rollout support != semantic overlap permission`.

This reuses G4 composition-policy lifecycle and semantic-generation handoff rather than inventing a new rollout model.

### 3.12 Admission caches cannot promise more currentness than their source system provides

Google Service Control explicitly warns callers about policy propagation delay while recommending short-lived cache reuse for availability. The general lesson is that a cache cannot strengthen the currentness guarantee of its upstream authority.

`Cached decision TTL <= source semantics` is necessary but not sufficient; if the source itself has a propagation lag, the guarantee must expose that lag or require a stronger path for operations that cannot tolerate it.

`Freshly fetched != globally current`.

### 3.13 The Exchange Plane may carry invalidation/floor evidence but cannot own the floor

The logical Exchange Plane can transport qualified supersession, currentness, floor, dependency-commitment and reconciliation evidence. It may route or coalesce refresh work.

It must not become the semantic owner of business authorization, trust roots, policy generations or capability profiles. A central invalidation service can be an optimization/provider, not a constitutional dependency for topologies promising autonomous runtime operation.

`Invalidation transport != invalidation authority`.

`Central cache coordinator unavailable != locally sufficient evidence invalid`.

### 3.14 Recovery after a correlated partition requires floor reconciliation before stale derived proofs regain effect authority

When connectivity returns, the runtime may hold derived evidence based on F1 while the authority advanced through F2/F3. Reconnection alone cannot reactivate the old cache.

Recovery should conceptually:

1. establish the minimum current/admissible floor for each material domain;
2. compare locally persisted floors and dependency commitments;
3. classify cached derived evidence as still qualified, superseded, below-retention, revalidation-required or unknown;
4. reconcile queued/effectful obligations under their original lineage;
5. only then resume new effects that depend on those claims.

`Connectivity restored != cached authority restored`.

This is invariant/domain scoped; independent capabilities need not wait on a global barrier.

## 4. Candidate research vocabulary

Research vocabulary only; no schema or enum is authorized.

- `EvidenceDomainRef` — names the authority/currentness/profile domain whose supersession rules apply.
- `ObservedFloorRef` — locally durable minimum floor already observed for a domain.
- `RequiredFloorRef` — minimum floor required by an operation/claim.
- `DependencyCommitmentRef` — compact commitment to the material evidence/floors used to derive a proof.
- `SupersessionEvidence` — evidence that a prior floor/revision/profile is no longer admissible for a declared scope.
- `BelowRetention` — historical dependency cannot be resolved from the active retention domain.
- `RevalidationRequired` — cached bytes remain but cannot currently satisfy admission.
- `OfflineHorizon` — bounded period/condition under which locally held evidence remains sufficient.

## 5. Candidate proof obligations

1. A runtime never admits evidence below a locally observed monotonic security/profile floor for the same qualified domain.
2. Restart, VM rollback, cache restore or DR restore cannot silently lower an observed floor.
3. Every derived guarantee retains enough dependency commitment to detect supersession of every material claim.
4. Compact commitments never imply that omitted detailed evidence is semantically irrelevant unless the derivation proves that irrelevance.
5. Revocation correctness does not require synchronous deletion of every derived cache object.
6. A domain/floor advance can logically invalidate all dependent evidence without one correctness-critical message per cache entry.
7. Invalidation/floor scope cannot broaden across tenant, trust domain, classification, policy/profile family or authority domain without explicit proof.
8. Missing an invalidation event cannot make evidence newer than the runtime's locally justified horizon.
9. A partitioned runtime cannot extend offline authority merely because cached proof bytes remain present.
10. Offline continuation is claim/operation/invariant-specific and preserves hard security/ownership invariants.
11. Revalidation timeout/failure remains `UNKNOWN`/`REVALIDATION_REQUIRED` where appropriate and cannot become stale success by default.
12. Refresh coalescing and jitter cannot extend the semantic horizon of the underlying evidence.
13. Currentness/floor tokens remain domain-qualified; no synthetic global total order is inferred across independent capabilities.
14. Below-retention historical evidence is explicit and cannot be reconstructed from latest state without a qualified mediation/proof.
15. Append-only/consistency evidence cannot be presented as proof of latest/current state.
16. Signed/verified floor evidence cannot be presented as proof that every runtime observed that floor.
17. Derived evidence invalidation does not require a central oracle when locally sufficient floor and dependency evidence exists.
18. Exchange Plane/gateway/cache providers do not become semantic owners of the underlying revocation/policy/trust state.
19. Provider/transport substitution preserves the same invalidation/floor semantics or is explicitly requalified.
20. A gradual rollout permits mixed versions only where the relevant contract proves overlap/non-downgrade safety.
21. New-effect admission after partition recovery requalifies all material floors before stale derived proofs regain effect authority.
22. Historical interpretation remains possible when required even if new admission is blocked by a higher floor.
23. Root guarantee evidence never claims stronger currentness than the authoritative source semantics actually provide.
24. Revocation storms have bounded refresh/revalidation attempt, concurrency, rate and cost budgets so safety mechanisms do not cause cascading failure.

## 6. Adversarial cases

1. One key revocation triggers one million synchronous cache-delete RPCs and collapses the control plane.
2. Runtime misses the delete broadcast but keeps accepting a still-present derived proof indefinitely.
3. Runtime observes floor F3, restarts from disk snapshot at F1, and accepts F1 evidence.
4. VM restore resurrects an old trust bundle and an old derived authorization proof together.
5. A global epoch invalidates unrelated tenants and causes platform-wide refresh storm.
6. A tenant-scoped revocation is accidentally applied platform-wide because the floor key omits tenant/trust scope.
7. Root proof stores only its own TTL and cannot identify that one deep child authority claim was revoked.
8. Root proof stores every transitive child inline and becomes operationally unbounded at high fan-out.
9. Compact dependency commitment verifies integrity but caller mistakes that for current admissibility.
10. Append-only consistency proof verifies an old head and caller mistakes it for latest state.
11. Partitioned runtime remains within business-data TTL but has exceeded the shorter security offline horizon.
12. Revalidation failure is converted to `allow` because stale-while-error is an infrastructure default.
13. All expired proofs revalidate simultaneously when a partition heals, preventing the authority service from recovering.
14. Single-flight refresh leader stalls and followers reuse superseded evidence rather than receiving explicit uncertainty.
15. Kubernetes-like version falls below retention; adapter converts `Gone` into `not found` and loses historical meaning.
16. Domain A token is numerically greater than domain B token and gateway invents a cross-domain ordering.
17. SPIFFE-like bundle sequence advances but an older response overwrites local state due to last-response-wins caching.
18. Trust bundles from different domains are merged so one revocation/floor accidentally governs or authenticates another domain.
19. App rollout allows mixed versions operationally but the change removed a permission; old agents continue granting it as if overlap were safe.
20. Control-plane partition blocks both invalidation and revalidation; runtime continues effectful work with no declared offline horizon.
21. Central invalidation service outage stops runtimes even though they possess locally sufficient immutable evidence and valid floors.
22. Central invalidation service compromise invents a business revocation it does not own and downstreams treat it as canonical authority.
23. Provider failover changes floor-token semantics but cached dependency commitments are reused unchanged.
24. Reconnection restores transport and health checks before floor reconciliation, allowing one stale effect before the revocation is observed.

## 7. Portability / exit path

The hypothesis is implementation-independent. It does not require Merkle trees, Certificate Transparency, Kubernetes, SPIFFE/SPIRE, Google Service Control, AWS AppConfig, Redis, CDN, service mesh, broker, shared database, global epoch service or central invalidation graph.

Any future realization must preserve:

- domain-qualified monotonic floor/currentness semantics;
- explicit scope and offline horizons;
- proof/dependency lineage or an equivalent compact commitment sufficient for supersession checks;
- explicit below-retention/revalidation/unknown dispositions;
- anti-rollback persistence or explicit uncertainty after restore;
- bounded refresh/revalidation budgets;
- distinction between consistency/integrity proof and currentness/admissibility proof;
- runtime-local sufficiency where autonomous operation is promised.

Changing invalidation/cache technology must not change the guarantee vector.

## 8. Deduplication against existing G4 research

This round does not reopen:

- the basic claim-scoped cache key/freshness model;
- degraded-mode classes;
- dependency-claim graphs/minimal semantic cut sets;
- offline security-floor semantics;
- policy anti-rollback/anti-downgrade semantics;
- profile negotiation;
- semantic-generation handoff;
- DR/split-brain authority reconciliation;
- proof-verifier trust or normative proof semantics.

Material delta is specifically **scalable invalidation of deeply derived evidence during revocation storms and correlated control-plane partitions**, adding domain-scoped monotonic floors, compact dependency commitments, logical invalidation independent from physical eviction, below-retention semantics for derived proofs, anti-rollback persistence, and bounded recovery/revalidation without a central invalidation authority.

## 9. Maturity and next gap

This topic now has an implementation-independent first consolidation but is not saturated. The highest-value remaining gap is **cross-domain floor composition and delegated revocation authority**: determine how a root guarantee composes multiple independent monotonic floors when no global ordering exists; how delegation/revocation chains are represented without turning the Shared Semantic Kernel into a business-policy owner; and how to prove that an intermediary may carry or narrow a floor but cannot invent, broaden or suppress revocation authority.

No implementation, provider or technology is selected.