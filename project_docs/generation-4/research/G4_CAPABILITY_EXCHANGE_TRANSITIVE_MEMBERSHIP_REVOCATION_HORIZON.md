# G4 Capability Exchange — Transitive Membership-Authority Revocation Horizons

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-22
Family: Shared Semantic Kernel / Capability Exchange Plane / Inter-Capability Boundary Model

> Research candidate != implementation authority. This document does not select DNS/SVCB, Kubernetes, HTTP/2, SPIFFE/SPIRE, a service mesh, gateway, broker, provider or revocation technology. It does not reopen G3 and does not authorize product work.

## 1. Research question

The preceding membership-authority revocation round separated revocation of future membership introduction from fencing consequences already materialized in caches, connections, queues and in-flight work. The next gap is transitive: **when authority A delegates endpoint selection to B, B delegates to C, and each edge has different lease/freshness/cache/session semantics, what is the residual protected-effect horizon after an upstream revocation?**

Core finding:

`delegation root revoked != transitive consequence chain expired`.

Neither the minimum nor the maximum TTL/lease is a generally valid end-to-end revocation horizon.

`min(edge horizons) != residual effect horizon`.

`max(edge horizons) != residual effect horizon`.

The relevant quantity is the longest still-admissible path from revocation through already-materialized authority/membership/session state to a protected-effect commitment boundary, after applying any stronger downstream fence.

## 2. Evidence reviewed

Primary standards/documentation and mature-system behavior:

- RFC 9460 defines SVCB AliasMode as delegation of operational control to a target name. The target operator can independently add/remove ServiceMode records, and alias chains are explicitly possible. ServiceMode alternative endpoints need not have identical capabilities or even the same operator. This is direct evidence that discovery delegation can cross administrative boundaries and that upstream knowledge of a delegate does not enumerate downstream endpoints. <https://www.rfc-editor.org/rfc/rfc9460.html>
- RFC 8767 permits recursive DNS resolvers, under bounded refresh-failure conditions, to serve expired data. It distinguishes ordinary TTL from a configurable maximum stale timer and suggests a stale-retention horizon independent of the original TTL. Therefore DNS TTL alone is not a hard transitive revocation bound. <https://www.rfc-editor.org/rfc/rfc8767.html>
- RFC 9113 models HTTP/2 connections as persistent. GOAWAY stops creation of additional streams on that connection but streams at or below the declared last-stream identifier might already have been processed or might still complete. It also exposes a race between new stream creation and shutdown. This is evidence that session continuation and effect ambiguity can outlive discovery/delegation freshness. <https://www.rfc-editor.org/rfc/rfc9113.html>
- Kubernetes keeps terminating Pod endpoints in EndpointSlices during graceful termination; `ready` becomes false while `serving` can remain true, and service proxies may route to serving+terminating endpoints when all endpoints terminate. This is evidence that membership withdrawal and traffic/effect eligibility can intentionally overlap. <https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/> and <https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/>
- SPIFFE documents short-lived, automatically rotated SVIDs and frequently rotated trust bundles. This is useful as an identity-lifetime benchmark: short-lived credentials reduce exposure but credential expiry/rotation is a separate horizon from route discovery, established-session continuation and business-effect authority. <https://spiffe.io/docs/latest/spiffe/concepts/> and <https://spiffe.io/docs/latest/deploying/svids/>

These are benchmarks only; none is selected.

## 3. Material finding: revocation horizon is path- and effect-relative

Consider:

```text
A --delegates--> B --delegates--> C --introduces--> endpoint E
                                                -> session S
                                                -> protected effect X
```

Each stage may have a different persistence rule:

```text
A->B delegation lease
B->C delegation lease
C->E membership TTL
resolver stale-serving horizon
route-table retention
connection/session lifetime
credential lifetime
queued/retry lifetime
target effect-fence currentness
```

A root revocation at time `t0` stops whatever the A->B contract says it stops. It does not retroactively erase state already materialized downstream.

Candidate definition:

`ResidualEffectHorizon(X)` = latest time at which a consequence causally descended from the revoked authority could still commit protected effect X under the declared continuation, stale-serving, session, retry and fencing semantics.

This is a proof concept, not a required timer implementation.

## 4. Why min TTL is unsound

Suppose A->B has TTL 30s, B->C 5m, C->E 1m, but a resolver may serve stale C->E data for hours and an HTTP/2 connection established before revocation may remain alive afterward.

The 30s minimum does not fence the session or the downstream cached endpoint.

`shortest discovery lease expired != all consequences expired`.

The minimum is useful only for the particular claim governed by that edge, such as when A may next be consulted. It cannot be promoted to an end-to-end effect guarantee.

## 5. Why max TTL is also insufficient

Taking the largest configured TTL is conservative only if all relevant consequence classes are both known and bounded by those TTLs. RFC 8767 demonstrates that stale-serving policy can extend use beyond ordinary TTL. Persistent sessions and queues can have independent lifetimes. A provider may also retain a route until drain completion.

Therefore:

`max(configured discovery TTLs) != proven maximum consequence lifetime`.

If a material persistence dimension is unbounded or opaque, the residual effect horizon is `UNKNOWN` unless a stronger downstream invariant subsumes it.

## 6. Delegation-edge semantics must name dependency on the parent

A delegated authority B can relate to A in materially different ways:

- **strictly dependent** — B loses future introduction/renewal rights when A is revoked;
- **lease-bounded dependent** — B retains rights until an already-issued lease expires;
- **renewal-dependent** — existing rights continue but cannot be renewed after A revocation;
- **independently re-authorized** — B has another authority edge that survives A;
- **transitively delegable** — B may create C with its own bounded semantics;
- **opaque** — downstream delegation/revocation semantics cannot be proven.

`delegation edge exists != parent revocation semantics known`.

An adapter must not normalize all of these to a generic `delegate=true`.

## 7. Revocation propagation and consequence closure form different graphs

A useful research distinction is:

```text
AuthorityDelegationGraph
  who may introduce/renew/delegate membership

ConsequencePersistenceGraph
  which caches/routes/sessions/queues/retries/effect rights can preserve consequences
```

The first graph may be acyclic while the second contains long-lived or feedback paths. Conversely, a delegated authority may disappear while a target-side session remains.

`authority graph closed != consequence graph drained`.

This reuses prior G4 dynamic-feedback and effect-path reasoning rather than creating a network-specific authority model.

## 8. Candidate horizon composition

For each protected effect X, candidate proof composition is:

1. enumerate or conservatively bound every material delegation path capable of introducing a path to X;
2. bind each delegation edge to its revocation dependency semantics;
3. follow already-materialized consequences through caches, stale-serving, route tables, sessions, queues and retries;
4. determine whether each consequence has a finite qualified horizon, explicit settlement condition or stronger downstream fence;
5. compute the latest still-effect-capable frontier across all surviving paths;
6. if any material path is opaque/unbounded and not subsumed by a universal commitment-adjacent invariant, disposition becomes `PARTIAL/UNKNOWN/INCOMPATIBLE` rather than inventing a deadline.

Conceptually:

`H_effect(X) = sup(H_surviving_path_i(X))`,

but only after every `H_surviving_path_i` has been semantically qualified. This is not arithmetic over raw TTLs.

## 9. Strong downstream fences collapse upstream time complexity

A major portability result is that transitive expiry need not be globally synchronized.

If every effect-capable target enforces a current revocation/fence predicate immediately before commitment, then:

`stale delegated path remains reachable != stale delegated path can commit X`.

In that case the effective protected-effect horizon can be governed by target-fence currentness even while upstream DNS caches, service-discovery entries or sessions remain operationally alive.

This is distributed complete mediation, not a requirement for a central proxy or Exchange Plane oracle.

## 10. Identity credential lifetime is not route/effect lifetime

SPIFFE's short-lived SVID model is a useful benchmark for bounded credential exposure, but G4 must not infer:

`credential expired -> route removed`.

Nor:

`route removed -> established authenticated session terminated`.

Nor:

`session terminated -> ambiguous protected effect did not occur`.

Identity, discovery membership, session continuation and effect settlement remain separate horizons. A provider/driver can expose their relationships only when the underlying mechanism actually guarantees them.

## 11. SVCB delegation demonstrates administrative transitivity

RFC 9460 AliasMode explicitly delegates operational control to the target name, whose operator can independently publish ServiceMode endpoints. Alias chains may continue subject to implementation limits.

Universal lesson:

`known delegator != known terminal membership set`.

Revoking the original owner therefore requires proof of what happens to cached downstream alias/service records and already-open connections; deleting or changing the root record does not itself establish consequence closure.

Legacy/fallback A/AAAA behavior is also material where clients can bypass SVCB, because a revocation proof covering only the SVCB chain may leave a fallback route alive.

## 12. Serve-stale turns freshness into a policy vector

RFC 8767 explicitly separates ordinary TTL from maximum stale retention and permits stale answers under refresh failure.

Candidate evidence must therefore distinguish:

```text
ordinaryFreshness
maximumStalePolicy
refreshFailureBehavior
negativeCacheBehavior
localResolverObservation
connectionPersistenceAfterResolution
```

`TTL=30s` is not equivalent to `unreachable after 30s`.

A hard protected-effect revocation must either qualify these dimensions or rely on a downstream fence that makes them irrelevant.

## 13. HTTP/2 demonstrates a session-level residual frontier

RFC 9113 GOAWAY provides a more precise session shutdown boundary than simply closing discovery. Streams above the last-stream identifier are known not to have been processed and can be retried; streams at or below it might have been processed or might still complete.

This suggests a general G4 principle:

`session shutdown signal != uniform disposition for all in-flight work`.

Residual-effect analysis must retain per-attempt/stream lineage when the transport exposes it. Where it does not, ambiguous work remains `UNKNOWN` and must use the capability's idempotency/fencing/settlement contract.

## 14. Monotonic revocation floors across delegation chains

The prior round established that stronger locally observed revocation evidence cannot be rolled back by older cached membership state. Transitive chains extend this rule:

`ancestor revocation floor observed -> descendant state derived solely from that ancestor cannot regain authority from an older snapshot`.

This does not revoke descendants that have independent re-authorization. It requires preserving authority lineage so the runtime can distinguish dependent descendant state from a separately authorized edge.

A local floor remains authority/scope/effect-qualified; it is not a synthetic global topology revision.

## 15. Re-authorization breaks the original revocation lineage

If C was originally reachable only through A->B->C but later receives independent authority D->C, then revoking A cannot truthfully be described as revoking C globally.

Candidate rule:

`same endpoint identity != same authority lineage`.

Consequences must be classified by the authority edge under which they remain admissible. Independent re-authorization creates a new currentness/revocation domain and must not be hidden as continuation of the revoked chain.

## 16. Revocation races and in-flight ambiguity

A root revocation may race with:

- downstream lease renewal already accepted;
- DNS response already cached;
- endpoint already selected;
- TLS/mTLS session already established;
- HTTP/2 stream already opened;
- command already queued;
- retry already scheduled;
- provider effect already committed but not acknowledged.

There is no universal instant at which all dimensions become revoked.

`revocation timestamp != global effect linearization point`.

Proofs must retain the relevant admission/attempt/effect lineage and represent partial/unknown states.

## 17. Candidate structural vocabulary

```text
MembershipDelegationEdgeRef
  parentAuthorityRef
  childAuthorityRef
  scopeRef
  dependencySemanticsRef
  leaseFreshnessRef
  renewalRuleRef
  transitiveDelegationRuleRef
  revocationRuleRef
  evidenceRef

MembershipRevocationHorizonRef
  rootRevocationRef
  protectedEffectRef
  delegationPathRefs[]
  consequencePathRefs[]
  staleServingRefs[]
  sessionContinuationRefs[]
  queueRetryRefs[]
  targetFenceRefs[]
  residualFrontierRef
  unknownUnboundedRefs[]
  currentnessRef
  disposition

AuthorityLineageRef
  originatingAuthorityRef
  delegationEdges[]
  independentReauthorizationRefs[]
  localRevocationFloorRefs[]
```

These are research primitives, not approved schemas.

## 18. Candidate dispositions

- `TRANSITIVE_REVOKED_FENCED` — no descendant consequence can commit the protected effect, either by closure or stronger target fence.
- `TRANSITIVE_REVOKED_BOUNDED` — residual consequences remain but a qualified finite protected-effect horizon exists.
- `TRANSITIVE_REVOKED_DRAINING` — descendant consequences remain under explicit drain/continuation semantics.
- `TRANSITIVE_REVOKED_REAUTHORIZED` — a descendant remains admissible through an independent authority edge; the original lineage is revoked.
- `TRANSITIVE_REVOCATION_PARTIAL` — only some delegation/consequence dimensions are closed.
- `TRANSITIVE_REVOCATION_UNKNOWN` — a material residual path/horizon cannot be established.
- `TRANSITIVE_REVOCATION_CONTESTED` — observations contradict asserted closure/fencing.
- `TRANSITIVE_REVOCATION_INCOMPATIBLE` — the required revocation guarantee cannot be provided by the declared topology/contracts.

## 19. Proof obligations

1. Root authority revocation and transitive consequence closure remain separate claims.
2. Every material delegation edge declares whether child authority is dependent, lease-bounded, renewal-dependent, independently re-authorized or opaque.
3. Transitive delegation capability is explicit; a delegate cannot silently mint a stronger or longer-lived descendant authority than the parent contract permits.
4. Parent revocation does not automatically imply descendant revocation without dependency evidence.
5. Independent descendant re-authorization is represented as a new authority edge/currentness domain.
6. Residual protected-effect horizon is effect- and path-relative, not a global topology timer.
7. Minimum edge TTL/lease is never promoted automatically to end-to-end revocation horizon.
8. Maximum configured TTL/lease is not promoted to end-to-end horizon unless all material persistence dimensions are proven bounded by it.
9. DNS stale-serving behavior is included when it can preserve endpoint reachability after ordinary TTL expiry.
10. Cached delegation and cached terminal membership are distinguished where their horizons differ.
11. Route-table/local-discovery persistence is included when independent of source freshness.
12. Established session lifetime is included when it can outlive discovery/credential freshness.
13. Credential expiry is not normalized to session/effect fencing without mechanism-specific proof.
14. Queued/retry/failover work retains authority lineage and admission generation unless explicitly re-admitted.
15. HTTP/2-like shutdown evidence distinguishes definitely unprocessed work from possibly processed/in-flight work when available.
16. Ambiguous in-flight effects remain representable and are not converted to `failed` merely because the route/authority was revoked.
17. Terminating/draining endpoints are not normalized to effect-ineligible without a stronger guarantee.
18. Revocation floor observations are monotonic for descendant state whose authority derives solely from the revoked ancestor.
19. Older snapshots/caches cannot resurrect descendant authority below a qualified local revocation floor.
20. A target-side universal commitment fence may subsume upstream stale/delegation horizons only when every effect-capable path crosses it.
21. Bypass/emergency/fallback routes are included before claiming universal target-side mediation.
22. SVCB/HTTPS fallback or legacy discovery paths are included when they can bypass the delegated path.
23. Revocation timestamp is not treated as a global linearization point across caches/sessions/effects.
24. Source/control-plane ACK is not treated as descendant consequence closure.
25. Finite non-observation of a descendant path does not prove it expired.
26. A positive post-revocation protected effect is defeating evidence for incompatible fenced claims.
27. Residual horizon becomes `UNKNOWN` when any material path is opaque/unbounded and no stronger invariant subsumes it.
28. Exchange Plane may carry authority lineage/revocation/horizon evidence but does not become discovery authority or business owner.
29. Runtime autonomy is preserved with locally durable lineage/floors/horizons; Builder availability is not required for every decision.
30. Provider/transport substitution requalifies stale-serving/session/retry semantics when they materially affect the residual horizon.
31. Shared Semantic Kernel candidates remain structural refs/time/currentness/provenance/authority-lineage primitives, not provider-specific discovery entities.
32. Unsupported transitive revocation semantics yield explicit partial/unknown/incompatible dispositions rather than fabricated equivalence.

## 20. Adversarial cases

1. A revokes B after B already issued C a longer lease.
2. B loses renewal authority but C interprets its lease as independently valid.
3. Root SVCB AliasMode changes while recursive resolver still serves stale downstream records.
4. Alias chain is revoked but fallback A/AAAA remains usable.
5. C endpoint is removed from discovery but existing HTTP/2 connection remains alive.
6. GOAWAY is sent while a protected mutation stream is within the possibly-processed frontier.
7. Credential expires while an authenticated session continues to carry requests.
8. Credential rotation is mistaken for revocation of established effect authority.
9. Endpoint is terminating but remains `serving` during drain.
10. Queue contains commands admitted under the revoked chain and releases them after revocation.
11. Retry scheduled before revocation selects a descendant endpoint afterward.
12. Provider failover retains an endpoint not present in current discovery.
13. Minimum TTL is used as hard revocation deadline despite serve-stale policy.
14. Maximum TTL is used as deadline while session lifetime is longer/unbounded.
15. Descendant obtains independent re-authorization but system incorrectly reports global revocation.
16. Descendant lacks independent re-authorization but stale snapshot falsely restores it.
17. Runtime restarts from snapshot predating the ancestor revocation floor.
18. One resolver honors revocation while another serves stale data.
19. Client caches terminal endpoint beyond alias freshness.
20. Delegation path contains an opaque SaaS resolver with undocumented stale policy.
21. Emergency route bypasses the target-side revocation fence.
22. Target fence covers normal endpoint but not legacy endpoint.
23. Target fence is current but callback path can commit the same effect elsewhere.
24. Revocation propagates to discovery but not to a provider-side connection pool.
25. Driver reports `revoked` based only on root config ACK.
26. Adapter chooses the shortest TTL as a generic residual horizon.
27. Adapter chooses the longest known TTL while omitting an unknown persistence dimension.
28. Trace shows no descendant traffic and is treated as proof of expiry.
29. Positive post-revocation effect is dismissed as telemetry anomaly instead of defeating evidence.
30. Exchange Plane is turned into mandatory central revocation oracle to compensate for missing lineage.
31. Local/in-process optimization bypasses the commitment-adjacent fence used by distributed paths.
32. Provider substitution changes session/stale semantics but reuses the old residual-horizon proof.

## 21. Portability / exit path

The hypothesis is intentionally independent of DNS, Kubernetes, HTTP/2, SPIFFE, mesh or cloud-provider mechanics.

Portable concepts are:

- authority lineage;
- delegation dependency semantics;
- revocation evidence/currentness;
- consequence persistence classes;
- residual protected-effect frontier;
- target-side fence evidence;
- explicit partial/unknown/contested/incompatible outcomes.

Provider-specific TTLs, leases, stream IDs, endpoint states and credentials remain evidence behind adapters/drivers. A replacement provider is acceptable only after its semantics are requalified; the driver must not fabricate an equivalent horizon from superficially similar timers.

## 22. Deduplication against existing G4 research

This round does not reopen generic delegation, membership-source completeness, membership revocation, effect fencing, stale cache policy, retries, offline security floors, semantic-generation handoff or split-brain recovery.

Material delta:

`membership-authority revocation -> transitive delegation chain -> heterogeneous lease/freshness/session persistence -> residual effect frontier -> authority-lineage-aware reauthorization -> target-fence collapse of upstream timing complexity without global synchronized expiry`.

## 23. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

This gap produced material boundary/proof changes and is therefore not `NO_MATERIAL_DELTA`.

The next highest-value gap is **revocation lineage through authority re-parenting and graph mutation**: when a descendant membership authority survives by acquiring a new parent while old caches/sessions still carry the prior lineage, determine how to prove which effects belong to the revoked lineage versus the new authority edge, prevent laundering of stale authority through re-parenting, and preserve stable endpoint identity without conflating identity continuity with authority continuity.
