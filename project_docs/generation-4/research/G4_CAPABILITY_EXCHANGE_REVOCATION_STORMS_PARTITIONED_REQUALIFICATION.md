# G4 Capability Exchange — Revocation Storms and Partitioned Requalification

Date: 2026-09-21
Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Scope: Generation 4 product R&D only
Implementation authority: NONE

## 1. Research question

This consolidation continues `G4_CAPABILITY_EXCHANGE_EVIDENCE_COMPACTION_REQUALIFICATION.md` and asks:

> When one revoked/superseded dependency can defeat very large numbers of derived roots, how can a capability preserve safe requalification under revocation storms, partitions, missed notifications and compacted history without requiring synchronous O(N) fan-out, a globally available dependency graph, or a central Exchange Plane authority?

The problem is semantic safety under bounded work, not selection of a cache, broker, database, PKI, transparency log or controller implementation.

Constitutional boundaries remain unchanged:

- `G3 semantic decision != G4 technology binding`;
- `Research candidate != implementation authority`;
- `Shared primitives != shared business ownership`;
- `Logical Exchange Plane != single broker`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`;
- `Builder != Runtime`;
- `notification delivery != effective invalidation`;
- `revocation observed != all dependent effects converged`.

## 2. Evidence base

Primary standards and mature architectures reviewed:

1. **Kubernetes API watch/resourceVersion**: clients can list current state and watch subsequent changes; watch bookmarks mark progress, but servers need not retain all historical resource versions and can return `410 Gone` for versions outside the retained history. This demonstrates a mature recovery rule: a missed/compacted incremental history requires re-establishing a qualified current baseline rather than pretending the event stream remained complete. <https://kubernetes.io/docs/reference/using-api/api-concepts/>
2. **etcd MVCC/watch/compaction**: watches track changes from revisions; compacted revisions become inaccessible, a watcher that cannot catch up can be canceled with the minimum available compact revision, and progress notifications can reveal lag. Importantly, a progress revision from a partitioned local node can lag a quorum read. This separates local stream progress from globally sufficient currentness. <https://etcd.io/docs/v3.6/learning/api/> and <https://etcd.io/docs/v3.7/dev-guide/interacting_v3/> and <https://etcd.io/docs/v3.8/op-guide/maintenance/>
3. **The Update Framework (TUF)**: trusted metadata is persisted locally; version checks prevent rollback; expirations detect freeze; root transitions require continuity between old and new trust; metadata rotation can invalidate previously cached dependent metadata. This is strong precedent for durable monotonic local floors and fail-closed refresh semantics rather than dependence on receiving every invalidation event. <https://theupdateframework.github.io/specification/draft/>
4. **SPIFFE Federation**: foreign trust bundles are associated with explicit trust domains; key introduction/removal requires overlap and refresh planning; consumers use the latest available bundle for subsequent authenticated retrieval. This demonstrates domain-qualified trust generations rather than one platform-wide trust epoch, and shows that rotation/federation outages can cause transient authentication failure without transferring trust-domain ownership. <https://spiffe.io/docs/latest/spiffe-specs/spiffe_federation/>
5. **RFC 6960 OCSP**: current certificate status is a separate online status question; clients can suspend acceptance pending a status response. This reinforces that possession of previously valid evidence is not equivalent to current admissibility when revocation semantics require a fresher status assertion. <https://www.rfc-editor.org/rfc/rfc6960.html>
6. **Sigstore Rekor transparency/sharding**: append-only log consistency can be independently monitored; log sharding can freeze old trees and rotate keys while retaining lookup continuity. This is evidence that operational partitioning/sharding need not change semantic identity, but monitoring/consistency evidence remains separate from statement truth. <https://docs.sigstore.dev/logging/overview/> and <https://docs.sigstore.dev/logging/sharding/>
7. Existing G4 research on distributed guarantee-evidence caching, opaque/compositional non-dependency evidence and evidence compaction/requalification.

These are benchmarks, not technology selections. No Kubernetes, etcd, TUF, SPIFFE/SPIRE, OCSP/CRL, Rekor, Merkle log, broker, database, cache or PKI mechanism is adopted by this research.

## 3. Material delta

Previous work allowed lazy requalification and domain-qualified floors but did not define the safety condition when invalidations arrive faster than dependent roots can be enumerated or when the invalidation stream itself is incomplete.

This round proposes:

> Safe revocation propagation is not the act of touching every dependent root. It is the preservation of an admission barrier that prevents any root derived under a defeated dependency generation from being reused for a protected effect until that root has been requalified against a sufficiently current local closure.

Therefore:

`revocation propagation != synchronous descendant mutation`.

and:

`notification fan-out != safety barrier`.

The important state is a durable **domain-qualified invalidation floor** (or an equivalent monotonic defeat predicate) consulted at reuse/admission boundaries. Reverse indexes and event streams improve convergence and cleanup, but cannot be the sole safety mechanism when they may lag, partition or lose compacted history.

## 4. Three planes must remain distinct

Candidate distinction:

1. **Defeat/floor plane** — durable facts that make older evidence inadmissible: trust-key retirement, semantic-profile floor, provider derivation generation, policy generation, fencing epoch, classification-policy generation, etc.
2. **Discovery/convergence plane** — indexes, watches, queues or scans used to find affected derived roots and eagerly requalify/evict them.
3. **Admission plane** — the point before a protected reuse/effect where the root's dependency closure is checked against locally sufficient defeat/currentness state.

A system may optimize plane 2 aggressively. It must not make plane 3's safety depend solely on plane 2 being complete.

`eager convergence failure != permission to bypass admission requalification`.

## 5. Domain-qualified invalidation vectors

One global epoch is too coarse and semantically dangerous. Independent trust, policy, provider, profile and authority domains can advance separately.

Candidate abstraction:

`InvalidationVector = { domainRef -> observedMonotonicFloor }`

A derived root carries only the material dependency domains/generations needed by its `RequalificationClosure`, not a platform-global vector.

Reuse is admissible only if every material dependency is compatible with the local floor/currentness policy for that domain.

Properties:

- floors are monotonic within their declared domain semantics;
- domains are explicit and cannot be merged merely because counters happen to match;
- coarse grouping may intentionally over-invalidate;
- grouping must never under-invalidate;
- restoring an older cache cannot lower a persisted floor;
- a floor can say `generation < N is inadmissible` without enumerating every root derived below N.

This converts a storm from mandatory O(number-of-descendants) synchronous work into bounded admission checks plus asynchronous convergence work.

## 6. Invalidation events are hints/evidence, not the sole source of truth

Events remain valuable for low-latency convergence. But a consumer can disconnect, a broker can partition, retention can expire, or history can be compacted.

Kubernetes and etcd provide the key mature pattern: incremental observation has a history horizon. Once a client falls behind that horizon, it must re-establish a qualified baseline rather than assume no missing changes.

Candidate rule:

`incremental continuity lost -> baseline requalification required`.

A consumer needs an explicit continuity state such as:

- `CONTIGUOUS_THROUGH(generation/revision)`;
- `GAP_DETECTED`;
- `BASELINE_REQUIRED`;
- `BASELINE_AT(floor)`;
- `UNKNOWN`.

No particular wire representation is implied.

## 7. Partition semantics and bounded offline autonomy

Partition tolerance cannot mean indefinite trust in stale currentness-sensitive evidence.

Each dependency class needs a declared partition policy, for example:

- **monotonic-local-safe** — locally persisted floor is sufficient for the promised offline horizon because older generations can never regain authority;
- **lease/currentness-bounded** — evidence remains admissible only until an expiry/lease/currentness bound;
- **online-status-required** — protected effect must wait for a sufficiently current authority/status source;
- **degraded-read-only** — historical/explanatory reads remain possible but new protected effects are blocked;
- **rebuild-on-rejoin** — local result may be inspected but cannot support protected reuse until a baseline is rebuilt.

Thus:

`offline autonomous != indefinitely current`.

and:

`partition policy is part of the guarantee contract, not an implementation accident`.

## 8. Revocation storms and bounded work

A revocation storm may be caused by trust-root compromise, provider-generation retirement, semantic-profile withdrawal, mass tenant-policy change or discovery that a derivation family was unsound.

Candidate bounded-work strategy, implementation-independent:

1. durably advance the affected domain floor/defeat predicate;
2. make that advancement visible to admission checks before claiming protected convergence;
3. enqueue/index/scan affected roots for eager cleanup according to budgets;
4. coalesce repeated invalidations when a stronger later floor subsumes earlier ones;
5. rate-limit non-safety cleanup rather than weakening admission;
6. expose convergence progress separately from safety/currentness;
7. preserve an explicit backlog/unknown state when affected roots cannot yet be enumerated.

The safety-critical work can therefore be proportional to changed domains/partitions rather than immediately proportional to every descendant root.

`bounded synchronous safety work + deferred convergence != stale-success permission`.

## 9. Coalescing and subsumption

Storm handling benefits from monotonic subsumption. If provider generation 14, then 15, then 16 are revoked before cleanup reaches a root built at generation 12, a durable floor `>=17 required` can subsume three individual invalidation notifications for admission purposes.

But coalescing is valid only when the domain semantics are truly monotonic and the stronger floor covers the same defeat dimension.

Invalid examples:

- replacing independent tenant-policy revocations with one unrelated provider epoch;
- treating a newer schema revision as automatically stricter authorization;
- collapsing trust-domain A and B key rotations into a shared counter;
- using latest timestamp as proof that every semantic profile is superseded.

`higher counter != stronger semantic defeat unless the domain contract says so`.

## 10. Reverse indexes remain optimization state

A reverse dependency index can accelerate `dependency -> affected roots`, but it is a projection of material dependency closure, not canonical business truth and not the authority that makes a revocation valid.

If an index is stale or unavailable:

- safety is preserved by admission-floor checks;
- eager cleanup/convergence may slow;
- observability must show degraded convergence;
- the index can be rebuilt from locally retained closure/materialized roots where the topology promises this capability;
- inability to rebuild lowers the declared operational/requalification capability explicitly.

`reverse index unavailable != dependency no longer exists`.

## 11. Currentness watermarks are scoped, not global

Watch bookmarks/progress notifications suggest a useful but bounded primitive: a consumer can know that it has observed a source through a qualified point.

Candidate `CurrentnessWatermark` needs at least source/domain identity, generation/revision semantics, observation/appraisal basis and limitations.

A watermark from a partitioned replica or stale source cannot be silently promoted to quorum/global currentness. etcd explicitly documents that local watch progress can lag a quorum read under partition.

Therefore:

`stream progress != authoritative currentness`.

and:

`watermark comparability requires shared revision semantics`.

## 12. Recovery after history compaction

If incremental invalidation history before revision R has been compacted, consumers cannot infer that absence of events means absence of revocations.

Recovery requires one of:

- a current authoritative baseline/floor snapshot;
- a qualified consistency/continuity proof spanning the gap;
- reconstruction from another retained source with equivalent declared semantics;
- explicit downgrade to `UNKNOWN`/`BASELINE_REQUIRED` until requalification completes.

The Exchange Plane may transport the baseline, but does not become the semantic authority for the underlying trust/policy/provider domain.

## 13. Federation and revocation domains

SPIFFE federation reinforces that foreign trust material remains associated with a named trust domain. G4 should preserve the same conceptual boundary for defeat state:

`federated invalidation evidence != merged revocation authority`.

A local relying capability decides whether a foreign domain's updated/revoked evidence defeats a local guarantee under its contract. Federation can propagate signed/qualified state; it cannot silently expand the foreign authority's semantic jurisdiction.

Cross-domain invalidation therefore needs both:

- the foreign domain's qualified change/currentness evidence; and
- the local contract/appraisal rule explaining its materiality.

## 14. Candidate vocabulary

Research vocabulary only:

- `InvalidationDomainRef` — identity of the domain within which a defeat generation/floor has defined semantics.
- `InvalidationFloorRef` — durable monotonic minimum generation/condition required for admission in one domain.
- `InvalidationVectorRef` — sparse set of domain-qualified floors relevant to a root/runtime.
- `CurrentnessWatermarkRef` — qualified statement of observation progress for one source/domain.
- `ContinuityDisposition` — e.g. `CONTIGUOUS`, `GAP_DETECTED`, `BASELINE_REQUIRED`, `UNKNOWN`.
- `BaselineEvidenceRef` — qualified current snapshot/floor used to recover after history loss.
- `ConvergenceBacklogRef` — non-authoritative operational evidence that affected materialized roots remain to be eagerly requalified/evicted.
- `PartitionPolicyRef` — immutable semantics for what may continue during loss of a required currentness source.

None is a shared business entity or implementation commitment.

## 15. Candidate proof obligations

1. **PO-RSP-01 — Admission barrier:** no protected reuse/effect may rely on a root whose material dependency generation is below a locally applicable invalidation floor.
2. **PO-RSP-02 — Notification independence:** missing an invalidation event cannot make stale evidence indefinitely admissible.
3. **PO-RSP-03 — Monotonic floor durability:** restart, restore and cache rollback cannot lower a persisted defeat floor.
4. **PO-RSP-04 — Domain qualification:** generations/floors from independent semantic domains are never compared or merged without an explicit mapping contract.
5. **PO-RSP-05 — Sparse dependency binding:** a root is checked against all and only its materially declared defeat domains, with conservative over-invalidation permitted but under-invalidation forbidden.
6. **PO-RSP-06 — Gap honesty:** lost/compacted incremental history yields explicit gap/baseline-required state, never implicit continuity.
7. **PO-RSP-07 — Baseline recovery:** reuse after a continuity gap requires a sufficiently current qualified baseline or equivalent continuity evidence.
8. **PO-RSP-08 — Currentness scope:** a local/partitioned progress watermark cannot be promoted to stronger source/quorum currentness than its evidence supports.
9. **PO-RSP-09 — Storm boundedness:** correctness does not require synchronous mutation/enumeration of every affected descendant before the defeat fact becomes enforceable.
10. **PO-RSP-10 — Coalescing soundness:** invalidations may be coalesced only when a stronger monotonic predicate semantically subsumes the earlier defeat predicates.
11. **PO-RSP-11 — Cleanup separation:** backlog completion/eviction progress is not confused with safety admission state.
12. **PO-RSP-12 — Reverse-index non-authority:** a reverse dependency index may accelerate convergence but cannot become canonical business truth or revocation authority.
13. **PO-RSP-13 — Rebuildability declaration:** if an optimization index/projection is required after failure, its rebuild source and degraded behavior are declared.
14. **PO-RSP-14 — Partition contract:** each currentness-sensitive dependency class declares what is allowed when its status source is unavailable.
15. **PO-RSP-15 — Offline boundedness:** autonomous runtime operation never silently extends a currentness/lease horizon beyond the contract.
16. **PO-RSP-16 — Foreign authority containment:** federated revocation/currentness evidence affects local guarantees only through explicit local appraisal/contract rules.
17. **PO-RSP-17 — Exchange-plane non-authority:** routing/binding/invalidation transport does not make the Exchange Plane semantic owner of the underlying defeat fact.
18. **PO-RSP-18 — ACK separation:** acceptance of a revocation message does not imply all materialized roots/effects have converged.
19. **PO-RSP-19 — Recovery fail-closed:** if required baseline/currentness cannot be established, protected admission lowers to an explicit non-success disposition.
20. **PO-RSP-20 — Topology substitution:** changing direct call/RPC/broker/stream/file transport cannot weaken the declared invalidation/currentness semantics.
21. **PO-RSP-21 — Tenant/classification preservation:** invalidation state remains correctly scoped across tenant/classification boundaries and cannot leak or cross-apply by identifier collision.
22. **PO-RSP-22 — Time semantics:** expiry/lease-based partition policies identify the clock/time authority and uncertainty assumptions on which they depend.
23. **PO-RSP-23 — No false convergence:** observability distinguishes `defeat enforceable`, `affected roots discovered`, `roots requalified`, and `downstream effects converged`.
24. **PO-RSP-24 — Client-runtime autonomy:** declared local invalidation closure is sufficient for the promised autonomy horizon without Builder availability.

## 16. Mandatory adversarial cases

1. One compromised verifier invalidates ten million derived roots; synchronous descendant updates overload the platform before the revocation becomes enforceable.
2. A broker drops one revocation event and consumers keep stale `PASS` roots forever because the event stream was the only invalidation mechanism.
3. A consumer reconnects after event retention/compaction and treats the first new event as proof of continuity.
4. A restored database contains a lower trust floor than the one durably observed before backup.
5. A global epoch increments for an unrelated tenant and causes platform-wide cache invalidation/availability collapse.
6. A coarse epoch does the opposite: two independent domains accidentally share a counter and one domain's revocation fails to invalidate dependent roots.
7. Reverse index is corrupted and absence of an edge is interpreted as proof of non-dependency.
8. Admission checks are skipped for in-process calls but enforced for RPC, breaking semantic equivalence across topology changes.
9. A local watch progress marker from a partitioned replica is treated as globally current.
10. Provider generation advances but an adapter keeps reporting the old interface as compatible and suppresses requalification.
11. Multiple revocations are coalesced into a higher number even though the later event concerns a different defeat dimension.
12. Cleanup queue backlog is zero because jobs were lost, and monitoring reports `converged`.
13. Revocation ACK from gateway is treated as proof that downstream business effects were undone.
14. Tenant A's floor key collides with tenant B's compact identifier and invalidates or admits the wrong roots.
15. Foreign trust-domain key removal is treated as global authority to revoke local identities outside the federation contract.
16. Partition lasts longer than a currentness lease but runtime continues write effects because it is labelled `self-hosted`.
17. Clock rollback extends an expiry-based offline horizon.
18. Builder/central Exchange Plane outage prevents a client runtime from consulting locally promised monotonic floors.
19. History is compacted and consumer silently reconstructs from a stale cache instead of obtaining a qualified baseline.
20. Rebuilt reverse index omits private/opaque dependency refs and falsely marks all roots current.
21. A revocation storm causes rate limiting to be applied to admission checks rather than only to deferred cleanup.
22. One broker outage blocks invalidation across the whole platform even though affected capabilities otherwise have local closure.
23. Service mesh retry duplicates invalidation notifications and non-idempotent cleanup corrupts convergence state.
24. Artifact/evidence archive is unavailable and runtime converts inability to inspect required defeat evidence into `PASS`.
25. A transparency-log shard rotates; clients mistake new shard index/reset for semantic rollback or, conversely, ignore required continuity evidence.
26. A revoked dependency is later reintroduced under the same human-readable name but different semantic identity and stale roots escape invalidation.

## 17. Transport and topology implications

The same invalidation contract can be realized through local calls, IPC, RPC, brokered events, streams or file/bundle exchange only when operational differences remain explicit.

- **Direct/local call:** low latency but still must consult the same durable floor/currentness semantics when the protected guarantee requires them.
- **RPC/status query:** appropriate when freshness must be established synchronously; partition policy must be explicit.
- **Broker/event:** useful for eager convergence; never sufficient alone for indefinite safety because delivery/history can be incomplete.
- **Stream/watch:** useful for ordered incremental observation within declared revision semantics; compaction/gap recovery is mandatory.
- **File/bundle exchange:** useful for disconnected/federated baseline transfer; freshness, authenticity and rollback protection become first-class.
- **Gateway/adapter:** may normalize transport/protocol and enforce boundary policy but cannot fabricate a stronger revocation/currentness guarantee than the source contract provides.

`transport substitution preserves promised meaning only if gap, freshness, ordering and recovery semantics remain qualified`.

## 18. Portability and exit path

A future implementation remains portable if:

- invalidation domains/floors are semantic contracts rather than broker/database offsets;
- root closures bind to qualified domain generations, not vendor-specific event IDs alone;
- loss of an event transport can be recovered from a baseline/currentness source;
- reverse indexes are rebuildable projections where promised;
- partition/offline behavior is contract-visible;
- no central broker, cache, Exchange Plane service or Builder instance is required to own business revocation semantics;
- client runtimes retain enough local closure for their declared autonomy horizon.

A product-specific mechanism is replaceable when another realization can satisfy the same proof obligations and recovery/currentness semantics.

## 19. Deduplication against existing G4 research

This round does **not** reopen:

- general event delivery/idempotency taxonomy;
- basic evidence caching/lease semantics;
- evidence compaction structure;
- compositional non-dependency proof structure;
- self-hosting bootstrap/root trust;
- general SRE/backpressure/capacity research.

The material delta is specifically the composition of **mass defeat propagation + bounded synchronous work + history-gap recovery + partition semantics + local autonomous admission**.

## 20. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and is not saturated.

This round materially closes the immediate question of whether safety requires synchronous O(N) descendant invalidation: the research hypothesis is **no**, provided a durable domain-qualified admission barrier makes stale descendants unusable before protected effects and continuity gaps force baseline requalification.

The next highest-value gap is narrower:

> **multi-domain invalidation algebra and policy conflicts** — when one root depends on several independently versioned trust/policy/provider/currentness domains, determine how floors, leases, revocations, exemptions and recovery baselines compose without inventing a total global order; how conflicting/unknown states affect admission; and what proof obligations are needed for safe delegation of requalification across capability boundaries.

No architecture, schema, provider, broker, storage engine, controller or implementation is authorized by this document.