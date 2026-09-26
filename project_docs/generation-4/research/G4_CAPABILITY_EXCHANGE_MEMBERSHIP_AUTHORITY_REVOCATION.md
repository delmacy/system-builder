# G4 Capability Exchange — Membership-Authority Revocation and Persisted-Path Fencing

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select Kubernetes, DNS/SVCB, HTTP Alt-Svc, Envoy, a mesh, gateway, discovery system, provider or revocation technology. It does not reopen G3 and does not authorize product work.

## 1. Research question

The preceding membership-source completeness round distinguished the currently visible member set from the authorities capable of introducing, delegating, reactivating or preserving membership. The next gap is temporal: **what does it mean to revoke a membership-introducing authority when paths introduced by that authority may already exist in caches, persistent connections, queues, retries, delegated resolvers, downstream routing tables or in-flight work?**

Core boundary:

`membership authority revoked != paths previously introduced by that authority fenced`.

The proof problem is therefore two-dimensional:

1. stop the authority from introducing or refreshing new membership;
2. bound, drain, requalify or fence the already-materialized consequences of its prior authority.

No universal discovery oracle or central proxy is required by this hypothesis.

## 2. Evidence reviewed

Primary standards/documentation and mature-system behavior:

- Kubernetes documents that terminating Pod endpoints are not immediately removed from EndpointSlices. They are marked `terminating`; `ready` becomes false, while `serving` can remain true for draining. Service proxies normally ignore terminating endpoints but may route to endpoints that are both `serving` and `terminating` when all available endpoints are terminating. This is direct evidence that desired removal and effect reachability can intentionally overlap. <https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/> and <https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/>
- Envoy listener removal/update places the old listener into a draining state; existing connections may continue for a configured drain period before remaining connections are closed. Upstream cluster changes likewise stop issuing new streams to removed-cluster pools while existing streams may complete. Hot restart keeps the old process serving/draining existing connections while the new generation initializes and begins accepting traffic. <https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/operations/draining.html>, <https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/operations/hot_restart.html>, and <https://www.envoyproxy.io/docs/envoy/latest/configuration/listeners/lds>
- RFC 7838 states that Alt-Svc freshness limits establishment of new connections, but clients with existing connections do not need to stop using the alternative when freshness expires. An origin can send `Alt-Svc: clear` to invalidate cached alternatives, but cache invalidation is still distinct from already-established connection termination. <https://www.rfc-editor.org/rfc/rfc7838.html>
- RFC 8767 explicitly permits recursive resolvers, under bounded exceptional conditions, to serve DNS data after ordinary TTL expiry when authoritative refresh fails. It therefore provides a mature example where `TTL expired` does not universally imply `cached route data unusable`. <https://www.rfc-editor.org/rfc/rfc8767.html>
- RFC 5011 provides a useful trust-state analogy rather than a routing design: once a resolver observes a valid self-revocation of a DNSSEC trust anchor, that key becomes permanently invalid for trust-anchor use. The important transferable principle is monotonic local revocation knowledge: older state must not resurrect an authority after stronger revocation evidence has been observed. <https://www.rfc-editor.org/rfc/rfc5011.html>

These systems are benchmarks only; none is selected.

## 3. Material finding: source revocation and consequence fencing are separate claims

A membership authority can be disabled at its source while previously introduced consequences remain capable of producing effects.

Candidate distinction:

```text
MembershipAuthorityRevocation
  -> authority may no longer introduce/refresh/delegate membership

IntroducedPathFence
  -> membership/path/effect consequences already introduced by that authority
     can no longer produce a protected conflicting effect
```

Therefore:

`revocation ACK != consequence fence`.

`source disabled != cache purged`.

`cache purged != connection drained`.

`connection drained != queued/in-flight obligation settled`.

This reuses prior G4 effect/fencing semantics rather than inventing a topology-specific shortcut.

## 4. Candidate revocation lifecycle

A useful implementation-independent lifecycle is:

```text
ACTIVE
 -> REVOKED_FOR_NEW_INTRODUCTION
 -> REFRESH_DELEGATION_DISABLED
 -> PERSISTED_MEMBERSHIP_BOUNDED
 -> IN_FLIGHT_DRAINING_OR_REQUALIFYING
 -> EFFECT_RIGHTS_FENCED_OR_SETTLED
 -> HISTORICAL_ONLY
```

These are proof states, not required runtime enums. They need not progress globally or synchronously. A low-risk read path may tolerate stale membership for a declared horizon while an irreversible mutation may require immediate commitment-adjacent fencing.

## 5. AuthorityRevocationRef and ConsequenceClosureRef

Candidate structural vocabulary:

```text
MembershipAuthorityRevocationRef
  authorityRef
  governedScopeRef
  revocationEvidenceRef
  effectiveForNewIntroductionRef
  refreshDelegationCutoffRef
  localObservationRef
  currentnessRef
  monotonicFloorRef

MembershipAuthorityConsequenceClosureRef
  authorityRef
  introducedMembershipRefs[]
  delegatedAuthorityRefs[]
  cachePersistenceRefs[]
  connectionSessionRefs[]
  queuedInFlightRefs[]
  retryFailoverRefs[]
  commitmentBoundaryRefs[]
  drainFenceSettlementEvidenceRefs[]
  residualUnknownRefs[]
  disposition
```

The first proves loss of future introduction authority. The second addresses already-created consequences. Neither substitutes for the other.

## 6. Kubernetes termination: desired removal is intentionally weaker than effect exclusion

Kubernetes is a strong benchmark because endpoint termination is explicitly modeled rather than hidden. A terminating endpoint can remain `serving`; if all available endpoints terminate, proxies may still route traffic to serving+terminating endpoints to avoid dropping Service traffic.

Universal lesson:

`membership marked terminating != membership effect-ineligible`.

A G4 proof must therefore name whether revocation means:

- no new endpoint introduction;
- no new connection/admission;
- no new protected effect;
- drain existing work only;
- immediate hard fence.

Availability-oriented draining is valid only when the protected invariant permits it.

## 7. Envoy draining: configuration removal does not retroactively rewrite live connections

Envoy listener and hot-restart behavior demonstrates another mature pattern: new admission can move to a new configuration while old connections remain owned by the draining generation until completion or forced closure.

Therefore:

`configuration generation changed != all in-flight work changed generation`.

`listener removed from active config != old listener has no live connections`.

For G4 this reinforces the need to bind in-flight work to the membership/authority generation under which it was admitted and to decide explicitly whether continuation remains admissible after authority revocation.

## 8. Alt-Svc: cache invalidation and established-path invalidation differ

RFC 7838 is especially useful because it explicitly separates freshness for **new connection establishment** from continued use of an already-established alternative connection.

Hence:

`discovery freshness expired != established path terminated`.

`cached alternative cleared != existing effect channel necessarily closed`.

A source revocation proof that only invalidates discovery cache entries is insufficient when existing sessions can continue to carry protected effects.

## 9. DNS serve-stale: expiry is not a universal hard revocation primitive

RFC 8767 permits stale DNS data to be served under bounded refresh-failure conditions. This is operationally valuable but demonstrates why G4 cannot equate generic TTL expiry with hard route revocation.

`TTL expired != route knowledge unusable under every resolver policy`.

For a protected effect requiring hard exclusion, either the discovery substrate must provide stronger semantics than ordinary TTL, or a downstream invariant/fence must make stale routing harmless.

This preserves the rule:

`availability fallback cannot silently weaken a hard protected invariant`.

## 10. Revocation propagation is vector-valued

There is no useful single `revoked=true` bit for end-to-end membership consequences.

Candidate vector:

```text
MembershipRevocationCurrentnessVector
  authoritySourceCurrentness
  delegateCurrentness
  discoveryCacheCurrentness
  routeTableCurrentness
  connectionSessionCurrentness
  queueRetryCurrentness
  targetFenceCurrentness
  effectSettlementCurrentness
```

Each dimension can advance independently.

`revocation observed at source != revocation observed at every consequence locus`.

A proof can nevertheless remain safe without global propagation when a stronger commitment-adjacent fence makes stale upstream state unable to produce the protected effect.

## 11. Delegated membership authority requires transitive revocation analysis

Revoking delegator A does not automatically answer what happens to delegate B if B previously received authority to introduce endpoints.

Candidate policies are explicit rather than assumed:

- **dependent delegation** — B loses future introduction authority when A is revoked;
- **bounded delegated lease** — B may continue until a declared independent horizon;
- **independent re-authorization** — B has a separate authority edge and is not revoked merely because A is revoked;
- **unknown/opaque** — the system cannot prove the downstream consequence.

Thus:

`delegator revoked != delegate revoked` unless the delegation contract proves that relation.

This mirrors prior G4 authority-delegation reasoning while keeping network/discovery authority separate from business authority.

## 12. New-admission revocation and continuation revocation are distinct

A safe system may intentionally allow an already-admitted read stream to finish while forbidding new streams. An irreversible mutation may require the opposite policy: continuation itself becomes inadmissible once authority is revoked.

Candidate decision dimensions:

```text
newMembershipIntroduction
newConnectionAdmission
existingConnectionContinuation
queuedWorkContinuation
retryContinuation
newProtectedEffect
alreadyCommittedEffectSettlement
```

No dimension is inferred from another.

`new admission denied != existing continuation denied`.

`existing continuation allowed != new protected effects allowed`.

## 13. Monotonic revocation floors

RFC 5011 supplies a useful security analogy: after a resolver has validated a trust-anchor revocation, the revoked key must not return to trust-anchor use. G4 can reuse the principle without adopting DNSSEC mechanics.

Candidate rule:

`stronger observed revocation evidence != rollbackable by older cached membership state`.

A runtime that has observed a qualified membership-authority revocation must not restore that authority merely because it restarts from an older snapshot, loses connectivity to the revocation source, or receives stale discovery data.

The floor is authority/scope/guarantee-qualified; it is not a global topology revision.

## 14. Draining is not fencing

Graceful drain protects availability and completion; it does not inherently prove exclusion of conflicting protected effects.

`drain started != no new effect can occur`.

`GOAWAY/connection close initiated != target-side effect fenced`.

For effects requiring exclusivity, conservation or non-duplication, draining must be paired with an effect-side fence, idempotency/dedup/settlement mechanism, or proof that continuation cannot violate the protected invariant.

## 15. Hard revocation can be local without central mediation

The strongest portability result is unchanged: if every effect-capable target enforces a current authority/fence predicate immediately before commitment, upstream discovery caches and old connections may remain operationally present while being semantically unable to commit the protected effect.

`stale path exists != stale path can commit protected effect`.

This permits distributed complete mediation and preserves runtime autonomy. The Exchange Plane may carry revocation/fence evidence; it need not proxy every request or own business authorization.

## 16. Emergency and break-glass paths

Emergency routing can defeat revocation if it reintroduces a path through an authority that normal control has revoked.

Candidate rule:

`emergency availability authority != permission to resurrect revoked protected-effect authority`.

Break-glass may create a new, independently qualified authority edge with its own scope, evidence, horizon and audit obligations. It must not silently erase the revocation lineage of the prior authority.

## 17. Cached state and stale-serving policy are part of the contract

A cache's ordinary TTL is insufficient evidence unless the consumer's stale-serving behavior is known. RFC 8767 demonstrates that standards-compliant resilient behavior may intentionally exceed ordinary TTL under failure.

Therefore a membership proof should qualify:

- ordinary freshness horizon;
- serve-stale/fallback behavior;
- maximum stale horizon when knowable;
- refresh-failure behavior;
- negative-cache behavior where material;
- connection/session persistence beyond cache freshness;
- whether target-side fencing subsumes these dimensions.

`cache implementation detail != semantically irrelevant when it controls route persistence`.

## 18. Revocation evidence and effect evidence remain separate

A valid authority-revocation event proves that authority should no longer introduce membership according to its scope. It does not prove that no protected effect occurred after the revocation time.

Conversely, observing no later effects does not prove all paths were fenced.

`revocation evidence != no-effect evidence`.

`no observed effect != universal fence`.

Historical effects remain facts and require settlement/remediation if they occurred during an ambiguous interval.

## 19. Candidate dispositions

- `AUTHORITY_REVOKED_NEW_ONLY` — future introduction/refresh is blocked; persisted/in-flight consequences remain explicitly live.
- `AUTHORITY_REVOKED_DRAINING` — future introduction is blocked and prior consequences are in bounded drain/requalification.
- `AUTHORITY_REVOKED_FENCED` — future introduction is blocked and every material protected-effect path is independently fenced or settled.
- `AUTHORITY_REVOKED_TARGET_GATED` — stale upstream paths may remain but universal commitment-adjacent enforcement prevents unauthorized effects.
- `AUTHORITY_REVOCATION_PARTIAL` — some consequence dimensions are proven while others remain live/unknown.
- `AUTHORITY_REVOCATION_UNKNOWN` — effective consequence closure cannot currently be established.
- `AUTHORITY_REVOCATION_CONTESTED` — observations contradict the asserted revocation/fence state.
- `AUTHORITY_REVOCATION_INCOMPATIBLE` — required revocation semantics cannot be provided for the protected guarantee.

These are research vocabulary, not approved schemas.

## 20. Proof obligations

1. Membership-authority revocation and introduced-path fencing are represented as separate claims.
2. A source ACK or configuration deletion never proves that prior membership consequences are fenced.
3. Revocation semantics name their scope: new introduction, refresh/delegation, new connection, continuation, retry, queued work, new effect and settlement are not conflated.
4. Persisted discovery/cache state is included when it can continue to influence protected effects.
5. Established connections/sessions are included when they can outlive discovery freshness or source revocation.
6. Queued/retry/failover work retains the authority/membership lineage under which it was admitted unless explicitly re-admitted.
7. Terminating/draining state is not normalized to effect-ineligible without a stronger guarantee.
8. TTL expiry is not treated as hard revocation when the substrate may serve stale data.
9. Cache clearing is not treated as connection termination.
10. Connection termination is not treated as settlement of effects already committed or ambiguously in flight.
11. Delegated membership authorities have explicit revocation dependency semantics.
12. Revoking a delegator does not silently revoke or preserve delegates without contract evidence.
13. Independent target re-authorization creates a new authority edge rather than pretending the old delegation remains valid.
14. Revocation currentness is qualified per material consequence locus/dimension rather than synthesized into a false global revision.
15. A runtime that observes stronger qualified revocation evidence does not roll back below that local floor after restart/cache restore.
16. Older discovery data cannot resurrect an authority already below the local revocation floor.
17. Graceful drain does not substitute for effect-side fencing when exclusivity/conservation/non-duplication is protected.
18. Hard protected-effect revocation either reaches every material commitment path or is subsumed by a universal commitment-adjacent invariant.
19. Emergency/break-glass routing cannot silently reactivate revoked protected-effect authority.
20. A break-glass authority, when permitted, is separately scoped/evidenced/audited and does not erase prior revocation history.
21. Revocation evidence is not promoted to proof that no later effect occurred.
22. Finite absence of post-revocation effects is not promoted to proof of universal fencing.
23. Counterexample evidence from a stale path producing a protected effect defeats incompatible `FENCED` claims.
24. Historical effects during an ambiguity window remain representable and require settlement/remediation where applicable.
25. Exchange Plane transport of revocation/fence evidence does not make it the membership authority or business-policy owner.
26. Client runtime autonomy is preserved with locally durable revocation floors and bounded currentness; Builder availability is not required for every decision.
27. Provider/transport substitution requalifies revocation/drain semantics when persistence or stale-serving behavior differs.
28. Local/in-process optimization cannot bypass a revocation/fence predicate required by the distributed contract.
29. Shared Semantic Kernel primitives remain structural refs/evidence/currentness/floor vocabulary, not provider-specific membership entities.
30. Unsupported revocation semantics yield `PARTIAL/UNKNOWN/INCOMPATIBLE`, never fabricated equivalence.

## 21. Adversarial cases

1. Controller is revoked but an endpoint it created remains in a consumer cache.
2. Endpoint object is deleted while an existing HTTP/2 connection continues carrying protected mutations.
3. DNS record expires but a recursive resolver serves stale data during authoritative outage.
4. Alt-Svc cache is cleared but an established alternative connection continues to be used.
5. Endpoint is `terminating` yet remains `serving` and receives traffic during an all-terminating interval.
6. Listener is removed from active Envoy config while old connections drain through the previous listener generation.
7. New configuration generation is active while queued work admitted under the old membership authority retries later.
8. Delegator A is revoked but delegate B retains an independently valid lease.
9. Delegator A is revoked and B should be dependent, but a stale verifier still accepts B's introductions.
10. Revocation event reaches discovery control plane but not a provider-internal route cache.
11. Cache purge succeeds but connection pool retains a live channel.
12. Connection pool closes but downstream queue already accepted the effect attempt.
13. Queue item retries through a newly selected route after its original authority was revoked.
14. Emergency failover reintroduces an endpoint controlled by the revoked authority.
15. Break-glass route is treated as revival of old authority instead of a new qualified authority edge.
16. Runtime restart restores a snapshot predating a revocation it had previously observed.
17. Builder/scanner outage is interpreted as permission to forget a local revocation floor.
18. Drain begins but new requests are still accepted during a graceful-drain interval.
19. Drain completes at network layer while an irreversible downstream effect remains `UNKNOWN`.
20. Target fence is updated but one bypass endpoint does not enforce it.
21. Provider reports revocation ACK while an old regional/effect-plane generation still accepts the path.
22. Negative cache suppresses discovery refresh and hides reconfiguration needed for fencing.
23. Long-lived stream multiplexes new protected operations after membership authority revocation.
24. Existing connection is allowed to finish but protocol permits creation of new logical streams on it.
25. Source authority is revoked while delegated service-binding data remains fresh in an intermediate cache.
26. Source and target clocks disagree and timestamp comparison is incorrectly used as the sole revocation ordering proof.
27. Telemetry shows no post-revocation effect and is incorrectly promoted to universal non-reachability evidence.
28. Exchange Plane becomes a mandatory online revocation oracle, violating autonomous runtime operation.
29. Driver maps provider `disable` to hard `fenced` despite documented drain/stale behavior.
30. Local direct call bypasses the distributed target gate because it is assumed topology-equivalent.

## 22. Portability and exit path

The research deliberately avoids binding correctness to a specific discovery/control technology.

A provider/transport is replaceable when the protected guarantee can be re-expressed through:

- authority-revocation evidence;
- consequence persistence/drain semantics;
- delegated-authority revocation rules;
- currentness/floor behavior;
- target-side fence or structural exclusion when required;
- residual `PARTIAL/UNKNOWN` representation.

Migration between technologies must requalify stale-serving, connection persistence, retry and drain behavior; schema/API compatibility alone is insufficient.

## 23. Shared Semantic Kernel / Capability Exchange Plane boundary

Candidate Shared Semantic Kernel primitives remain minimal:

- qualified authority/evidence/currentness refs;
- revocation/floor refs;
- consequence-lineage refs;
- qualified relation/delegation refs;
- disposition refs.

The Capability Exchange Plane may carry:

- authority-revocation evidence;
- cache/connection/drain/fence evidence refs;
- delegation-revocation lineage;
- currentness vectors;
- counterexample/settlement refs.

It does not own:

- DNS/controller/provider authority;
- cache eviction policy;
- connection draining;
- business authorization;
- target commitment;
- a global revocation oracle.

`Exchange Plane carries revocation evidence != Exchange Plane owns revocation authority`.

## 24. Deduplication against existing G4 research

This round does **not** reopen:

- generic security-token revocation;
- offline delegation attenuation/revocation;
- distributed evidence-cache invalidation;
- mutable composition membership generally;
- membership-source completeness generally;
- provider rollout skew;
- generic effect fencing/settlement;
- split-brain or DR.

The material delta is narrower:

`membership-source closure -> authority revoked -> prior introduced membership persists -> cache/session/queue/in-flight consequence closure -> new-admission vs continuation semantics -> monotonic revocation floor -> target-side fencing without central discovery oracle`.

## 25. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This gap produced material new boundaries and is not saturated globally. The highest-value next gap is **revocation closure under transitive delegated discovery authorities with mixed lease/freshness models**: when A delegates endpoint-selection authority to B, B delegates to C, and caches/leases/established sessions at each layer expire or revoke independently, determine how to prove the transitive authority closure and maximum residual effect horizon without requiring synchronized global expiry or treating the shortest/longest TTL as a universal answer.
