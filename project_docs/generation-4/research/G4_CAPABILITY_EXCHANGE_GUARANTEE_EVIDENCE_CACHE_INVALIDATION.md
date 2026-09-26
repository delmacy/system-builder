# G4 — Distributed Guarantee Evidence Caching & Invalidation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-19
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can autonomous runtimes reuse dependency qualification, minimal-cut-set and guarantee evidence under high fan-out without synchronously consulting every capability for every operation, while preventing stale authority/currentness/profile/security claims from fabricating admissibility and without introducing a central guarantee oracle?

This document extends the degraded-mode dependency-claim graph and guarantee-synthesis research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary/standards/mature-system evidence reviewed:

- RFC 9111 HTTP Caching: freshness, validation and invalidation; importantly, unsafe requests invalidate only caches they traverse and do not guarantee global invalidation.
- RFC 5861: bounded `stale-while-revalidate` and `stale-if-error`; stale use remains explicitly stale and bounded rather than silently current.
- RFC 2308 DNS negative caching: negative evidence has a scope/key and TTL; expiry means the negative answer must no longer be reused.
- Google Zanzibar (USENIX ATC 2019): authorization at very large scale while preserving causal/external-consistency constraints, demonstrating that low-latency reuse cannot be treated independently from consistency/currentness semantics.
- SPIFFE Federation and Trust Domain/Bundle specifications: trust bundles are refreshed, ordered by sequence where present, have refresh hints affecting rotation/redaction propagation, and foreign trust-domain bundles must remain distinct rather than merged into one synthetic trust set.
- Open Policy Agent bundle management: immutable/revision-aware policy bundle distribution can use ETag/If-None-Match and polling/long polling; transport-efficient revalidation is distinct from policy authority.
- AWS IAM distributed consistency guidance: authorization/configuration changes can remain invisible until propagation/cache expiry; production workflows must account for that delay rather than assuming a cache hit is current.

These are benchmarks, not adoption decisions.

## 3. Material findings

### 3.1 Cacheable object is a qualified claim, not a generic service-health boolean

A reusable evidence entry must be scoped to the proposition it supports. A useful implementation-independent identity is conceptually:

`EvidenceKey = subject/dependency + contract/profile + operation/claim + tenant/trust/classification context + authority/security scope + relevant revision/floor + provenance domain`

Exact fields remain future architecture work. The invariant is:

`Same dependency != same cache key`.

A catalog-currentness claim cannot authorize a payment; an authorization decision for tenant A cannot be reused for tenant B; provider health cannot stand in for profile compatibility; an S2 qualification cannot silently satisfy S3.

### 3.2 Freshness is multidimensional

One TTL cannot safely represent all guarantee dimensions. Evidence may have distinct horizons for:

- semantic/profile compatibility;
- identity/trust material;
- authorization/revocation/security floor;
- business-data currentness;
- provider/capacity health;
- effect-right ownership/fencing;
- settlement/reconciliation;
- negative evidence.

Therefore:

`Cache entry fresh for dimension X != fresh for dimension Y`.

The effective reuse horizon for a root guarantee is bounded by every material claim on its minimal semantic cut set, not by the most convenient cache TTL.

### 3.3 Invalidation is evidence, not omniscience

RFC 9111 is a useful failure precedent: a state-changing request can invalidate caches it traverses, but this does not guarantee all relevant caches globally observe the change. G4 therefore cannot make correctness depend on a broadcast invalidation being received everywhere.

`Invalidation sent != invalidation observed everywhere`.

Correctness needs one or more bounded mechanisms such as immutable revision/floor identities, expiries, leases/horizons, monotonic sequence/fence evidence, causal/currentness tokens, or mandatory revalidation for sensitive claims. Invalidation can shorten staleness; it must not be the sole proof that stale evidence is impossible.

### 3.4 Security-negative evidence and business-positive evidence have different failure costs

Negative caching is legitimate, but scope and horizon matter. RFC 2308 demonstrates that negative knowledge is cacheable only against a qualified query tuple and expires explicitly. G4 generalizes this without equating DNS semantics with business semantics.

Examples:

- `provider P unavailable` may be safely short-lived operational evidence;
- `principal U is not revoked` is not equivalent negative evidence and can become dangerous immediately after revocation;
- `no compatible S3 provider discovered` must not be cached so broadly that a newly deployed compatible provider remains invisible beyond the allowed horizon;
- `effect not settled` must not become `effect absent` through negative caching.

`Cached absence != proof of non-occurrence`.

### 3.5 Stale use must remain visible in the guarantee vector

RFC 5861 provides a useful universal principle: stale content can sometimes improve availability, but it remains visibly stale and bounded. For G4:

`stale-but-allowed != current`.

If a contract permits bounded stale catalog data, the synthesized guarantee records that currentness class. An adapter, gateway or caller cannot erase the staleness marker simply because the fallback succeeded.

Security/authority claims may choose `stale forbidden` even when ordinary informational claims permit stale-while-revalidate behavior.

### 3.6 Causal/currentness tokens are scoped proof, not global revisions

Zanzibar demonstrates the value of carrying consistency information so authorization can respect causal ordering at scale. The G4 abstraction is narrower:

- an operation may carry a minimum acceptable revision/currentness/floor witness for a material dependency;
- a cache entry below that witness cannot satisfy the claim even if its TTL has not expired;
- satisfying one domain's token does not create a synthetic global revision across independent capabilities.

`Meets dependency floor != globally latest`.

### 3.7 Trust/profile caches require monotonic supersession awareness

SPIFFE bundle sequence and refresh semantics show that trust material is explicitly expected to evolve and that refresh cadence affects revocation/redaction latency. Foreign bundles must remain separated by trust domain. Generalized G4 boundary:

`Trust-domain cache union != federation`.

A cache must not merge authority roots merely to improve hit rate. Where a domain exposes monotonic sequence/floor information, older entries cannot overwrite newer locally observed security state.

`Older fetched evidence != permission to roll back local floor`.

### 3.8 Revalidation can be cheap without becoming semantic authority

OPA's ETag/If-None-Match pattern demonstrates that checking whether a revision changed can be substantially cheaper than downloading/recomputing all content. The G4 principle is:

`Cheap revalidation != central guarantee oracle`.

A capability may expose revision/currentness evidence that lets a runtime validate cached qualification efficiently. The capability still owns its business semantics; the Exchange Plane may carry revision evidence but does not become the canonical owner of the underlying policy or business state.

### 3.9 High fan-out requires request coalescing and bounded refresh authority

If N concurrent operations discover the same evidence expired and all synchronously refresh it, caching can create a stampede precisely during dependency degradation. Candidate implementation-independent controls include:

- single-flight/request coalescing per qualified evidence key;
- jittered refresh windows;
- bounded background refresh;
- admission/budget limits on refresh traffic;
- stale-while-revalidate only for claim classes whose contract permits stale use;
- negative-cache TTLs scoped to failure class;
- circuit/load containment that never upgrades stale semantic evidence.

`Cache stampede control != permission to extend semantic freshness`.

### 3.10 Offline autonomy needs an evidence dependency closure

Autonomous runtimes may retain locally sufficient qualification evidence, but each claim class needs an offline horizon. If a root guarantee depends on a revocation/currentness floor whose offline horizon expired, a cache hit cannot restore admissibility.

`Locally cached != locally sufficient forever`.

This preserves `Builder != Runtime`: the Builder is not required online, but the runtime must possess the evidence closure required by the declared offline topology and must degrade/fail closed when a hard claim can no longer be qualified.

### 3.11 Provider/transport substitution changes cache applicability, not business identity

A transport migration, provider failover or topology change may leave some cached evidence reusable and invalidate other dimensions. For example, an immutable business contract/profile proof may remain valid while provider-specific delivery semantics, identity binding, locality, rate budget or health evidence must be requalified.

`Provider changed != invalidate everything` and `Provider changed != reuse everything`.

Cache applicability follows claim dependencies.

### 3.12 Dependency invalidation should propagate by claim lineage, not global flush

A root guarantee cache can depend on multiple child evidence entries. A change in one dependency should invalidate or lower only root claims whose proof lineage materially used that dependency/revision.

This suggests a research-level dependency relation:

`DerivedEvidence -> [QualifiedInputEvidenceRef...]`

without requiring a central graph engine. Local runtimes may retain bounded proof lineage sufficient to decide whether a derived entry is still usable.

`Dependency changed != global cache flush`.

Conversely, a root entry whose proof depended on changed evidence cannot remain valid merely because its own TTL has not expired.

## 4. Candidate cache dispositions

Research vocabulary only:

- `FRESH_QUALIFIED` — reusable for the named claim/scope.
- `STALE_ALLOWED` — reusable only when the root contract explicitly tolerates the represented staleness.
- `REVALIDATION_REQUIRED` — content may be retained but cannot currently satisfy the claim.
- `BELOW_REQUIRED_FLOOR` — cached revision/security/currentness is older than the operation requires.
- `NEGATIVE_QUALIFIED` — bounded negative evidence for a precise claim/scope.
- `UNKNOWN` — absence/invalidation/revalidation failure cannot justify either positive or negative claim.
- `REVOKED/SUPERSEDED` — known unusable for new admission, while historical evidence may remain resolvable.

No schema or enum is authorized.

## 5. Candidate proof obligations

1. Every reused evidence item is keyed by all dimensions material to the claim it proves.
2. Tenant/trust/classification/authority scope cannot be broadened by cache reuse.
3. A cache hit cannot strengthen a guarantee beyond the evidence's represented currentness/profile/authority/settlement state.
4. Root guarantee reuse remains bounded by all material minimal-cut-set claims.
5. Invalidation delivery is not the sole correctness mechanism for revocation/security-sensitive claims.
6. A locally observed newer security/profile floor cannot be rolled back by an older cache fill.
7. Cached negative evidence has explicit query/claim scope and bounded lifetime.
8. `not found`, `not settled`, `not observed`, `revoked`, `incompatible`, `unreachable` and `UNKNOWN` remain distinct.
9. Stale use is explicit in synthesized guarantee evidence.
10. Claim classes that forbid stale use cannot inherit stale-while-revalidate behavior from infrastructure defaults.
11. A required minimum revision/currentness/floor defeats a cache entry below that floor regardless of TTL.
12. No dependency-local revision is represented as a global platform revision.
13. Trust material from independent domains remains domain-qualified and cannot be merged into a synthetic authority root.
14. Derived/root evidence retains sufficient input lineage to detect material dependency supersession.
15. Dependency invalidation does not require a global cache flush when unaffected proof lineage remains valid.
16. Provider/transport substitution requalifies provider-specific claims while preserving independently immutable evidence where justified.
17. Refresh/revalidation traffic has bounded attempt/concurrency/rate/cost budgets and cannot create unbounded fan-out amplification.
18. Single-flight/coalescing does not extend semantic freshness beyond the underlying evidence horizon.
19. Offline reuse is bounded by declared claim-specific horizons and locally available security/currentness material.
20. Builder/central services are not mandatory cache-validation authorities for topologies promising autonomous runtime operation.
21. Cache persistence/recovery cannot resurrect revoked/superseded evidence after restart or rollback.
22. Historical evidence resolvability remains distinct from current admissibility.
23. A cache miss or expired negative entry does not imply the opposite proposition.
24. Observability of cache age/hit/revalidation is telemetry, not canonical truth or business authority.

## 6. Adversarial cases

1. Authorization cached for tenant A reused for tenant B because subject IDs collide.
2. S2 compatibility cache reused after the root operation requires S3.
3. Revocation broadcast is lost; runtime continues granting until an unbounded local TTL expires.
4. Newer security floor observed, then stale replica response overwrites cache with an older floor.
5. `provider unavailable` negative cache suppresses a newly healthy provider far beyond its allowed horizon.
6. `effect not observed` negative cache is interpreted as `effect did not happen`, causing duplicate external effect.
7. Catalog permits ten-minute stale data; same cache policy is accidentally reused for revocation decisions.
8. Root guarantee cache remains `COMPLETE` after a material child authority entry is superseded.
9. Global cache flush on one provider health change causes platform-wide stampede.
10. Thousands of concurrent requests all revalidate the same expired trust/profile entry.
11. Background refresh loops continue during dependency outage and consume recovery capacity.
12. Single-flight leader hangs; followers treat timeout as fresh success.
13. Gateway strips stale/currentness metadata from a cached downstream response.
14. Service mesh retry reaches another provider whose contract/profile differs but reuses provider-specific cache evidence.
15. Runtime restart restores disk cache from before a revocation/security-floor advancement.
16. VM rollback restores both cache and monotonic sequence, resurrecting superseded trust evidence.
17. Cache key omits classification level and leaks qualification across trust zones.
18. Foreign trust-domain bundles are merged to increase hit rate, enabling cross-domain identity confusion.
19. Derived cut-set evidence has a long TTL and outlives all child evidence from which it was proven.
20. Cache miss is interpreted as `not authorized` where the correct state is `UNKNOWN`, or vice versa.
21. Negative incompatibility evidence is cached across a rolling deployment and prevents newly compatible instances from being selected.
22. Offline runtime continues effectful work after authority/currentness horizon expires because bytes remain locally cached.
23. Transport migration changes delivery guarantees but cached end-to-end qualification is reused unchanged.
24. Central cache/validation service outage stops autonomous runtimes despite locally sufficient immutable evidence.

## 7. Portability / exit path

The hypothesis is implementation-independent. It does not require Redis, CDN/HTTP caches, Zanzibar, OPA, SPIFFE/SPIRE, service mesh, shared broker, shared database or central graph/cache service.

Portable semantics require that any future cache implementation can expose or preserve:

- qualified evidence identity and scope;
- source/provenance and immutable revision/floor references where material;
- freshness/currentness/security horizons;
- negative/unknown/revoked distinctions;
- dependency/proof lineage sufficient for invalidation;
- explicit stale disposition;
- bounded refresh/revalidation behavior;
- restart/rollback anti-resurrection behavior.

Changing cache technology must not change the promised guarantee vector.

## 8. Deduplication against existing G4 research

This round does not reopen:

- degraded-mode classes themselves;
- dependency-claim graph or minimal semantic cut-set definitions;
- profile negotiation/downgrade resistance;
- offline security-floor semantics;
- handoff/recovery/compaction;
- split-brain/DR authority reconciliation;
- privacy evidence federation.

Material delta is specifically **reuse and invalidation of already-qualified guarantee evidence under high fan-out**, including multidimensional freshness, negative evidence, causal/floor-aware validation, stampede containment and offline cache horizons.

## 9. Maturity and next gap

This topic now has an implementation-independent first consolidation but is not saturated. The highest-value remaining gap is **cache invalidation across derived evidence DAGs under revocation storms and correlated control-plane partitions**: determine how invalidation/floor advancement propagates through deeply derived guarantee evidence without O(N) synchronous fan-out, while preventing stale derived proofs, preserving bounded offline autonomy and avoiding a central invalidation authority.

No implementation, provider or technology is selected.