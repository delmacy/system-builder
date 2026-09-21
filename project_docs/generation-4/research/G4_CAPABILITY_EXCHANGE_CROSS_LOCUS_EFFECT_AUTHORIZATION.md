# G4 Capability Exchange — Cross-Locus Effect Authorization Under Route Indeterminacy

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

## Scope

This research deepens the provider-semantic rollout-skew work. It asks how an autonomous runtime can authorize a protected effect when the final provider enforcement locus is selected only after admission, is hidden behind a global endpoint, or can change because of retry, health-based routing, active/active balancing, hedging, DNS caching or provider-managed failover.

It does **not** select a cloud, load balancer, IAM product, service mesh, broker, gateway or routing architecture. It does not reopen G3 and grants no implementation authority.

## Material finding

The prior model established that provider authorization semantics can differ by account, partition, region, endpoint and rollout cohort. The missing boundary is that a caller may not know which locus will commit an effect when it makes the admission decision.

The core hypothesis is:

`route indeterminacy != semantic indeterminacy permission`

and:

`admissible at preferred locus != admissible across reachable route set`.

When routing may select any member of a set after admission, authorization evidence must either cover every materially reachable commitment locus, constrain routing so that only qualified loci remain reachable, or defer/repeat the relevant gate at a target-side point that knows the actual locus.

A global endpoint is therefore not itself a semantic locus. It is often a routing surface whose reachable effect loci may vary over time.

## Evidence classes

### Provider-managed global routing and failover

AWS Global Accelerator documentation states that standard accelerators choose regional endpoints using health, client location and configured policy. If no healthy endpoint is available in the current group, failover can select another endpoint group; in a severe no-healthy-endpoint case it can route to a random endpoint in the closest group. Traffic-dial zero is not an absolute semantic exclusion during this failover behavior. Existing connections can also remain on an old region after routing policy changes.

Azure Front Door similarly selects among enabled/healthy origins using priority and latency and may retry a failed connection against another eligible origin. If all health probes fail, Front Door can distribute traffic across origins it has classified unhealthy. Thus `health routing policy` cannot be interpreted as a semantic guarantee that only a preferred or currently qualified authorization locus will receive an effect.

Google Cloud global external Application Load Balancing can distribute traffic among regional backends and can automatically divert traffic from an unhealthy region to healthy regions. Its documented global-to-regional failover/bypass patterns can also change which layer and region receives a request.

These mature systems establish a general operational fact: routing is a runtime decision and may change after the caller selected a logical endpoint.

### DNS and connection persistence

AWS Route 53 guidance notes that DNS answers are cached for their TTL and that additional OS/application caches can delay recognition of failover. Therefore a control-plane route change does not imply that every client immediately uses the new locus.

AWS Global Accelerator traffic-dial changes apply to new connections while established connections continue on their existing region. Consequently:

`routing configuration current != every in-flight connection routed under that configuration`.

### Retry and hedging

gRPC documents transparent/configured retries and request hedging. Hedging may send multiple copies of one logical request to different backends and use the first response. This demonstrates that one logical invocation can have multiple physical attempts and potentially multiple candidate effect loci.

Therefore:

`one logical request != one physical effect attempt`.

For protected non-idempotent or irreversible effects, retry/hedging semantics are part of the reachable effect-path universe and cannot be treated as a transport-only concern.

## Candidate model

### 1. EffectRouteSet

For a protected effect `E`, define a qualified `EffectRouteSet` as the set (or safely conservative superset) of loci that can receive an attempt capable of committing `E` under the current routing, retry, failover and provider behavior.

A route set is evidence, not canonical business truth. It may be:

- `EXACT` — all reachable loci are positively bounded;
- `CONSERVATIVE_SUPERSET` — extra loci may be included but no materially reachable locus is intentionally omitted;
- `PARTIAL` — known incomplete;
- `UNKNOWN` — sufficient closure cannot be established.

For high-risk effects, `PARTIAL/UNKNOWN` cannot be silently interpreted as the preferred locus only.

### 2. Semantic equivalence class

A subset of loci may form an `EffectLocusEquivalenceClass` only relative to a named protected guarantee. Equality of provider, API, role, schema or credential is insufficient.

For protected guarantee `G`, loci `L1..Ln` are interchangeable only if the evidence supports at least:

1. the same contract/profile semantics relevant to `G`;
2. equivalent effective authority containment for the protected effect/resource/context universe;
3. compatible currentness/security floors and provider-semantic generations;
4. compatible fencing/idempotency/dedup/settlement behavior where attempts can move between loci;
5. preservation of tenant/classification/provenance/authority context;
6. no locus-specific adapter/gateway/provider behavior that weakens `G`;
7. route changes do not bypass required mediation or structural exclusion.

Equivalence is guarantee-scoped and directional when necessary:

`L1 equivalent for read-currentness != L1 equivalent for payment.commit`.

### 3. Admission modes under route indeterminacy

Candidate implementation-independent dispositions:

- `ROUTE_SET_QUALIFIED`: every materially reachable locus satisfies the required guarantee.
- `ROUTE_CONSTRAINED`: routing is bounded to a qualified subset and that constraint itself is proven/current.
- `TARGET_SIDE_REQUALIFICATION`: a mediation/fencing point at or immediately before the actual commitment locus requalifies current authority and semantics.
- `DEFER_EFFECT`: work may be accepted/queued but the protected effect is not committed until a locus is qualified.
- `PARTIAL/UNKNOWN`: evidence is insufficient; availability policy may degrade non-protected work but cannot invent authority.
- `INCOMPATIBLE`: at least one unavoidable reachable locus cannot satisfy the guarantee.

These are research vocabulary, not APIs.

## Why target-side mediation can be necessary

If the final locus is chosen after caller-side admission, a caller-only gate cannot know that the effect will execute under the semantic state it evaluated. For effects whose guarantee depends materially on locus-specific authorization/currentness, a target-side or commitment-adjacent gate can be the only place with enough information.

But:

`target-side gate != central gateway requirement`.

The gate may be capability-local, provider-local, runtime-local or otherwise distributed. The Exchange Plane may carry evidence/routing context but must not become the business-semantic authority.

Likewise:

`service mesh / load balancer knows target != service mesh / load balancer owns business authorization`.

A routing layer can expose or constrain topology without knowing whether the selected target is semantically authorized for the business effect.

## Provider-managed failover and hidden loci

Some routing systems deliberately hide the selected region/origin from the client. Others expose a global endpoint whose DNS/anycast/backend selection can vary. In these cases, the proof must not fabricate a single target identity.

Candidate rules:

- If all reachable loci are qualified for `G`, hidden selection is acceptable for `G`.
- If only some loci are qualified, the route must be constrained or the effect must be gated after target selection.
- If provider-managed failover can override a nominal exclusion, that exclusion cannot be used as structural non-reachability evidence unless independently enforced.
- A health check proves operational reachability/health only to its declared scope; it does not prove authorization-semantic equivalence.
- A route-control ACK does not prove every existing DNS cache, connection, retry policy or provider edge now uses the new route.

## Retry, hedging and attempt identity

A logical obligation can produce multiple physical attempts. Therefore route-set qualification composes with existing G4 idempotency/fencing/effect-identity rules.

Candidate invariant:

`retry/hedge route change != new business authority`.

Every attempt must retain the stable obligation/effect lineage required by the contract. If two loci can concurrently receive attempts, the protected guarantee must explicitly tolerate this through target-side idempotency/dedup/fencing/reservation/settlement or forbid concurrent multi-locus attempts.

For a non-fenceable effect:

`multiple semantically authorized loci != safe concurrent execution`.

Authorization equivalence does not prove duplicate-effect safety.

## Route-set currentness and change detection

A route-set proof depends on more than load-balancer configuration. Material dependencies can include:

- DNS policy and effective cache horizon;
- global/anycast endpoint behavior;
- endpoint-group membership;
- health/failover policy;
- traffic weights/dials/priority;
- retry and hedging policy;
- connection reuse/draining behavior;
- service discovery and client-side load balancing;
- provider-managed emergency/fail-open behavior;
- regional/account/partition availability;
- callback/reverse-path routing;
- provider semantic rollout state per locus.

Thus:

`route config unchanged != reachable route set unchanged`

when health, provider failover state, discovery, DNS cache state or retry policy changes.

A `RouteSetQualificationRef` should bind its material dependencies and horizon rather than pretend to be timeless.

## Autonomous runtime / offline behavior

The runtime must not require Builder or a central routing oracle for every effect. Candidate safe modes include:

1. locally durable proof that all reachable loci form a qualified equivalence class;
2. locally enforced route pinning to a qualified locus/subset;
3. commitment-adjacent target gate that can validate local evidence;
4. queue-without-effect until route/evidence currentness is restored;
5. operation-specific stale horizon where the protected guarantee explicitly permits it.

A runtime that loses current route-set evidence may continue operations whose guarantees are route-insensitive while suspending only effects whose semantic safety depends on unresolved locus selection.

`route evidence unavailable != runtime globally unavailable`.

## Proof obligations

1. Every protected effect declares whether authorization semantics are locus-sensitive.
2. A route-sensitive effect identifies a qualified reachable route set or an equivalent target-side requalification boundary.
3. Route-set evidence does not omit provider-managed failover paths known to be materially reachable.
4. Nominal weight/priority/traffic-dial exclusion is not treated as structural exclusion when provider failover can override it.
5. Equivalence is scoped to a named guarantee/effect/resource/context universe.
6. Same provider/API/credential does not substitute for locus-equivalence proof.
7. Provider semantic rollout/currentness is qualified per materially reachable locus.
8. Control-plane route ACK is not treated as proof that all in-flight connections/caches use the new route.
9. DNS/cache horizons remain represented where they can preserve stale routing.
10. Retry/hedging policies are included in the effect-path and route-set closure.
11. Logical effect identity survives retries, failover and hedging where the contract requires duplicate protection.
12. Authorization equivalence is not confused with idempotency/fencing/settlement equivalence.
13. Target-side mediation, when required, occurs before the effect commitment boundary.
14. Routing/service-mesh components do not become canonical business-semantic owners.
15. Hidden provider routing yields `UNKNOWN/PARTIAL` rather than invented target identity when closure cannot be proven.
16. Route pinning is itself qualified/current and cannot rely only on advisory routing preference.
17. Fail-open provider routing is explicitly included or structurally blocked for protected effects.
18. A health check is not promoted from operational evidence to semantic authorization evidence.
19. Route-set changes selectively requalify only proofs materially dependent on changed loci/policies.
20. Offline autonomy remains operation-scoped and bounded by route/provider semantic horizons.
21. Recovery/rejoin does not rewrite historical effects produced at a previously selected locus.
22. Callback/reverse-path loci preserve tenant/classification/authority/provenance context when material.
23. Equivalence-class membership can be defeated by newer provider-semantic or routing evidence.
24. Builder/central Exchange Plane availability is not a mandatory dependency for effects whose runtime-local proof closure is sufficient.

## Adversarial cases

1. Admission proves region A, but global routing commits in region B.
2. A failover policy routes to a region with an older provider authorization generation.
3. A traffic dial/weight of zero is assumed to mean unreachable, but emergency failover still selects it.
4. DNS is updated, but an application keeps the old address beyond the intended TTL.
5. Existing long-lived connection remains on old locus after route-control change.
6. Retry changes backend after the first attempt has already crossed an effect boundary.
7. Hedging sends two attempts to different regions and both effects commit.
8. All loci are authorization-equivalent but do not share duplicate-effect fencing.
9. Health check is green while authorization policy at that locus is stale.
10. Health check is red everywhere and routing fails open to unqualified endpoints.
11. Control-plane route API says B is disabled while provider data plane still accepts traffic there.
12. Client-side service discovery contains a stale endpoint not present in the central route view.
13. Global endpoint hides the region and the caller records the preferred region as if it were observed fact.
14. Provider changes failover behavior without local artifact/configuration change.
15. Callback originates from a secondary locus whose tenant/classification mapping differs.
16. Load balancer retries an idempotent-looking HTTP operation whose business effect is not idempotent.
17. Route pinning is advisory only and provider routing overrides it during impairment.
18. Simulator/catalog says loci are equivalent while live effect-plane behavior differs.
19. Region B is qualified for reads and incorrectly inherits equivalence for writes.
20. Account-specific rollout makes B equivalent in one tenant but not another.
21. Route-set scanner sees configured endpoints but omits provider emergency fallback behavior.
22. Failback starts new connections on A while old connections continue effects on B.
23. Recovery restores a route-set snapshot below a locally observed semantic floor.
24. Network partition prevents route evidence refresh and runtime treats stale route set as indefinitely current.
25. One broker/edge outage redirects all work through an unqualified locus.
26. Gateway validates locus before a provider-internal retry moves the request after the gateway.
27. Service mesh target identity is mistaken for proof of target business authority.
28. Route-set equivalence becomes a de facto global semantic authority owned by the Exchange Plane.

## Portability and exit path

The hypothesis deliberately avoids binding to DNS, anycast, service mesh, cloud load balancer, RPC library or broker. A future implementation may use direct calls, client-side discovery, HTTP/gRPC, brokers, streams, regional endpoints, global endpoints or provider-managed routing if it can satisfy the same proof obligations.

Portability resides in stable concepts such as:

- protected effect identity;
- effect commitment boundary;
- route-set evidence and currentness;
- enforcement-locus identity/evidence;
- guarantee-scoped equivalence relation;
- retry/attempt lineage;
- target-side mediation evidence;
- partial/unknown/incompatible dispositions.

A provider-specific route or authorization representation remains behind an adapter/driver boundary and cannot be promoted to shared business semantics.

## Deduplication against existing G4 work

This does not reopen generic provider semantic drift, rollout skew, complete mediation, effect-path discovery, degraded-mode routing, split-brain, retry/idempotency or cross-runtime DR. The material delta is narrower:

`locus-qualified provider semantics -> route selected after admission -> reachable route-set closure -> guarantee-scoped locus equivalence -> route constraint or target-side requalification -> retry/hedge/failover-aware effect safety without a global routing oracle`.

## Maturity

`RESEARCH_ACTIVE / NON_EXECUTABLE`.

This gap is materially advanced but not saturated. The next highest-value question is **route-set proof under opaque provider-internal routing and unverifiable emergency fallback**: how to establish useful structural exclusion or bounded assurance when the provider exposes neither the complete backend set nor a stable route-selection proof, without treating absence of documentation as non-reachability and without forcing all protected effects through a user-controlled proxy.

## Sources

Primary/standards-oriented evidence used in this round:

- AWS Global Accelerator Developer Guide — endpoint selection, health checks, endpoint-group failover, traffic dials, fail-open behavior and connection persistence.
- AWS Prescriptive Guidance — Route 53 and Global Accelerator multi-region request routing; DNS TTL/cache and region-selection implications.
- Microsoft Azure Front Door documentation — origin selection, priority/latency routing, health probes and best-effort retry to another eligible origin.
- Google Cloud Load Balancing / Cloud Run documentation — global-to-regional failover, active-active bypass and health-based regional diversion.
- gRPC documentation — transparent/configured retries and request hedging across backends.

These systems are benchmarks and failure evidence only; none is selected for System Builder.