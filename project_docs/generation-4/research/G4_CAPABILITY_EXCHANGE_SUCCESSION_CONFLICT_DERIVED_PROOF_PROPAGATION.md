# G4 — Succession-Conflict Propagation Through Derived Proofs

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should a newly discovered succession fork, recovery decision, or losing-branch fence propagate through dependent `same-subject`, `owns`, `controls`, delegation, authorization and other cached derived guarantees without O(N) synchronous fan-out, without erasing historical truth, and without making the Exchange Plane or Builder a central identity/conflict oracle?

This document extends the existing relationship-conflict, derived-evidence invalidation, revocation-storm, cross-domain floor, offline-security, split-brain and recovery/compaction research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature-system evidence reviewed:

- RFC 9162 Certificate Transparency v2: Merkle consistency proofs establish append-only extension, while split-view consistency requires comparison/gossip across observations; an audit failure yields evidence of misbehavior rather than an automatic semantic winner.
- Sigstore Rekor security/monitoring documentation: append-only transparency, independent monitoring and identity monitoring expose inconsistent or unexpected statements; transparency supports auditability and does not establish business authority.
- Kubernetes API watch/resourceVersion semantics: consumers can maintain local projections incrementally from a known resource version; `BOOKMARK` communicates progress to a frontier and `NotOlderThan` expresses a minimum freshness constraint without requiring one global application revision.
- Existing G4 artifacts on guarantee-evidence caching, revocation storms, cross-domain floors/delegation, relationship rotation, conflicting succession, semantic-generation handoff, split-brain rejoin and recovery compaction.

These are evidence and architectural benchmarks only. No transparency log, Merkle structure, Kubernetes watch model, identity system, broker, graph database or cache implementation is selected.

## 3. Material findings

### 3.1 Conflict propagates through dependency claims, not through object ownership

A derived proof is affected only when its material dependency closure intersects the contested succession/relation claim.

`Ancestor contested != every descendant object invalid`.

`Dependency intersection != ownership transfer`.

A `same-subject` proof depending on A1's uncontested continuity may become contested when `A1 -> A2` and `A1 -> A3` fork. An unrelated proof whose cut does not depend on that lineage remains independently admissible.

### 3.2 Propagation is a disposition downgrade, not immediate deletion

A newly discovered fork does not require erasing all derived evidence. It changes the admissibility/currentness disposition of proofs that depended materially on the contested claim.

Candidate research dispositions include `UNCONTESTED`, `CONTESTED_ANCESTOR`, `RECOVERY_PENDING`, `BRANCH_FENCED`, `HISTORICAL_ONLY`, `BELOW_RETENTION`, `UNRESOLVED` and `UNKNOWN`.

`Conflict discovered != historical proof never existed`.

`Derived proof retained != derived proof still admissible for new effects`.

### 3.3 Logical invalidation may be O(1) at the authority frontier

Correctness need not synchronously visit every cached descendant. A domain-qualified conflict/recovery floor or branch frontier can make older derived proofs self-disqualify at reuse when their dependency commitment is below or incompatible with the required frontier.

`One conflict != one synchronous delete per derived proof`.

`Logical defeat != physical cache deletion`.

This extends the earlier revocation-storm result from revocation to contested succession.

### 3.4 Derived evidence needs compact dependency commitments

A cached root guarantee must retain enough qualified lineage to answer whether a newly contested branch was material to its derivation. It need not embed the entire ancestry or business payload.

Candidate implementation-independent concept: `DerivedProofDependencyCommitment`, binding the derived claim to the material succession/relation domains, branch/frontier identities, semantic profile and relevant currentness/floor assumptions.

`Compact commitment != full ancestry disclosure`.

`Commitment integrity != current admissibility`.

### 3.5 Floors remain domain-qualified and partially ordered

A recovery frontier for relation domain R cannot be numerically compared with an authorization floor from domain A or a semantic-profile floor from domain P.

`Higher token in another domain != newer conflict state`.

Root admissibility is vector composition over the material dependency set, never a synthetic platform revision.

### 3.6 Conflict discovery and conflict adjudication are separate

Transparency/gossip/monitoring can reveal incompatible views. Detection changes the relevant disposition to contested but does not choose the legitimate successor.

`Fork evidence != recovery authority`.

`Monitor observed conflict != monitor owns resolution`.

This preserves capability-local business authority and prevents the Exchange Plane from becoming a court of identity.

### 3.7 Recovery propagation is selective and proof-carrying

When a qualified recovery establishes A2 and fences A3, derived proofs are not blindly restored. A proof depending on A2 may be requalified if its other assumptions remain valid; a proof depending on A3 may become `HISTORICAL_ONLY` or require recomputation; a proof independent of the fork remains unaffected.

`Recovery completed for ancestor != all descendants automatically current`.

`Branch fenced != all historical branch statements false`.

### 3.8 Fencing evidence is distinct from winner selection

A recovery decision naming A2 is insufficient for effects if A3 can still exercise external rights. Derived authorization/effect proofs requiring exclusivity remain unsafe until the relevant effect-side fence is proven.

`Recovery winner selected != losing branch effect rights fenced`.

Therefore conflict propagation must carry both succession disposition and, where material, fencing/effect-settlement evidence.

### 3.9 Historical interpretation and new-effect admission diverge

A proof produced while A3 was locally admissible may remain necessary to explain a historical event after A3 is defeated. It must not be relabeled as proof under A2.

`Historical validity/evidence != current continuation authority`.

`Recovery != proof laundering`.

Retention/compaction must preserve enough branch identity to audit historical effects while allowing active caches to drop no-longer-needed payload.

### 3.10 Offline runtimes require bounded conflict-currentness horizons

An autonomous runtime cannot know instantly that a remote fork was discovered. It may continue only according to the predeclared conflict/revocation horizon and degraded-mode policy for the protected operation.

`Locally uncontested != globally uncontested`.

`Offline autonomy != indefinite conflict ignorance`.

On reconnect, queued/new irreversible effects are requalified before execution when the relevant frontier advanced.

### 3.11 A frontier progress marker is not semantic authority

Kubernetes watch/bookmark semantics provide a useful operational precedent: a consumer can know it has processed changes through a particular resource version without that marker becoming business truth. Likewise, a conflict feed may state that a runtime has observed conflict-domain changes through frontier F.

`Observed-through frontier != semantic winner`.

`Watch caught up != protected effect admissible`.

The capability still evaluates its contract and proof cut.

### 3.12 Below-retention must remain explicit

If a runtime presents a derived proof whose dependency frontier predates retained conflict history and no stronger checkpoint/fence subsumes the missing evidence, the result is not `uncontested`.

`Conflict history compacted != conflict never existed`.

`Below retention != safe by absence`.

The disposition becomes `BELOW_RETENTION/UNRESOLVED` or another explicitly contracted outcome.

### 3.13 Negative evidence requires coverage and currentness

A statement such as “no fork observed” is meaningful only relative to a named conflict domain, observation frontier and currentness horizon.

`No conflict observed != proof no conflict exists`.

This is especially important for offline caches and partial monitoring topologies.

### 3.14 Fan-out invalidation must resist storms

A high-fan-out identity/relation may feed thousands of derived guarantees. Conflict discovery must not trigger synchronous recomputation of all of them. Candidate operational containment includes floor/frontier advancement, lazy self-disqualification, bounded background refresh, coalescing and priority by protected invariant.

`Invalidation storm containment != freshness extension`.

Security/authority-sensitive operations still fail/requalify when their evidence no longer meets the required frontier.

### 3.15 Revalidation priority follows effect risk, not graph degree

A high-degree ancestor is not automatically the most urgent proof to recompute. Priority should reflect whether dependent operations can create irreversible, security-sensitive or conserved-right effects.

`Graph centrality != semantic criticality`.

This prevents infrastructure topology from silently defining business risk.

### 3.16 Provider migration preserves contested dependency state

Moving cached proofs or relationship data to another provider cannot collapse `CONTESTED_ANCESTOR` into a single target identifier because the target schema lacks conflict representation.

`Provider canonicalization != conflict reconciliation`.

If the target cannot represent required conflict/floor/lineage semantics, migration is explicitly lossy/incompatible.

### 3.17 Transport replay does not reset proof qualification

A message admitted under a proof later marked contested retains its original lineage on retry/redelivery. Replaying through a new broker or RPC path does not create a fresh uncontested admission.

`Redelivery != proof rebirth`.

New-effect execution may require requalification according to the current frontier.

### 3.18 Conflict metadata is purpose-scoped

Stable branch/conflict identifiers can become correlation handles. Derived-proof commitments should carry only the lineage needed for the verifier's purpose and correlation scope.

`Conflict propagation != global identity graph permission`.

Trace/correlation identifiers remain distinct from succession/authority evidence.

### 3.19 Multi-ancestor proofs preserve partial conflict

A root guarantee may depend on A, B and C where only B is contested. The result should preserve the vector rather than flattening every dependency to invalid or, conversely, hiding B behind two healthy dependencies.

`Two uncontested dependencies + one contested dependency != uncontested root`.

Whether the root can degrade depends on its declared composition policy and protected invariant.

### 3.20 The Exchange Plane carries propagation evidence but does not own the graph

The logical Exchange Plane may transport dependency commitments, conflict/frontier observations, recovery/fencing evidence and qualified dispositions. It does not become the canonical relationship graph, invalidation oracle or business adjudicator.

`Exchange Plane transports conflict semantics != Exchange Plane owns relationship truth`.

Autonomous runtimes can evaluate locally sufficient evidence closure without Builder availability.

## 4. Candidate research vocabulary

Research vocabulary only; no schema is authorized.

- `ConflictDomainRef` — domain-qualified namespace in which succession conflicts/frontiers are meaningful.
- `ConflictFrontierRef` — observed conflict/recovery frontier for one domain; not a global revision.
- `DerivedProofDependencyCommitment` — compact commitment to material dependency claims/frontiers used by a derived proof.
- `ConflictDisposition` — qualified uncontested/contested/recovery/fenced/historical/unresolved state.
- `RecoveryPropagationEvidenceRef` — evidence that a qualified recovery/fence is applicable to a dependency commitment.
- `ConflictCurrentnessHorizon` — bounded period/condition in which locally held non-conflict evidence remains usable.
- `HistoricalBranchEvidenceRef` — retained evidence needed to interpret historical effects without granting current authority.

## 5. Candidate proof obligations

1. A conflict affects only derived proofs whose material dependency closure intersects the contested claim.
2. Conflict discovery downgrades admissibility without deleting historical evidence.
3. Correctness does not require O(N) synchronous cache deletion/recomputation.
4. Derived proofs retain sufficient compact dependency commitments to detect material ancestor conflict.
5. Dependency commitments do not create a global subject identifier or global revision.
6. Conflict/recovery floors remain domain-qualified and are never numerically compared across independent domains.
7. Conflict detection is separate from recovery/adjudication authority.
8. Transparency/monitoring evidence cannot choose a business successor by itself.
9. Recovery requalifies descendants selectively; it does not automatically restore every derived proof.
10. Losing-branch fencing is proven separately where future protected effects require exclusion.
11. Historical proofs preserve original branch/provenance after recovery.
12. New-effect admissibility remains distinct from historical interpretation.
13. Offline runtimes obey declared conflict-currentness horizons.
14. Reconnect requalifies queued/new irreversible effects against advanced conflict/recovery frontiers.
15. Observation progress/bookmarks do not become semantic authority.
16. Below-retention dependency evidence yields explicit unresolved behavior absent a stronger subsuming checkpoint/fence.
17. Negative “no conflict observed” evidence names coverage/frontier/currentness and is not universal proof of absence.
18. Invalidation/revalidation storms are bounded without extending semantic freshness.
19. Revalidation priority follows protected invariant/effect risk rather than graph degree alone.
20. Provider migration preserves contested/fenced/historical dispositions or declares lossiness/incompatibility.
21. Retry/redelivery preserves original proof lineage and does not fabricate fresh admission.
22. Conflict metadata remains purpose/correlation scoped.
23. Multi-ancestor root guarantees preserve partial conflict vectors and composition semantics.
24. Exchange Plane transports conflict/recovery evidence without becoming canonical relationship graph or adjudicator.

## 6. Adversarial cases

1. A fork at A1 synchronously invalidates/recomputes one million derived proofs and causes control-plane collapse.
2. Cache deletion fails on one runtime, which therefore treats stale proof as current forever.
3. Derived proof stores no dependency lineage and cannot discover it depended on A3.
4. One global conflict epoch invalidates unrelated tenants/capabilities and becomes a platform oracle.
5. A monitor detects A2/A3 and silently selects A2 despite lacking recovery authority.
6. Recovery selects A2 but A3 still holds external effect credentials; derived authorization is restored prematurely.
7. Historical A3 proof is rewritten as A2 after recovery.
8. Runtime remains offline beyond conflict horizon and continues irreversible effects because local TTL is fresh.
9. Reconnect drains queued effects before conflict-frontier reconciliation.
10. `BOOKMARK`/observed-through marker is interpreted as proof that the selected branch is legitimate.
11. Compaction drops old conflict evidence and absence is interpreted as `UNCONTESTED`.
12. “No conflict seen” cache entry lacks coverage/currentness and is reused after monitoring partition.
13. Background revalidation storm overloads recovery authority and delays fencing.
14. High-degree low-risk relation consumes refresh budget before low-degree payment authority.
15. Provider migration to a single-subject schema silently drops the contested branch.
16. Broker redelivery after recovery is treated as a fresh admission under the winning branch.
17. Stable conflict ID becomes a cross-tenant identity join key.
18. Root proof depends on A/B/C; B is contested but aggregator returns success because A and C are healthy.
19. Adapter converts `CONTESTED_ANCESTOR` to generic timeout and caller retries until duplicate effects occur.
20. Gateway materializes a canonical dependency graph to simplify invalidation and becomes business owner by accident.
21. Builder availability becomes mandatory for every conflict check, violating published-runtime autonomy.
22. Conflict frontier from domain X is numerically compared to authorization floor from domain Y.
23. Recovery evidence is current but semantic profile/authority evidence is stale; root is incorrectly restored.
24. Losing branch is fenced for one provider but derived proof assumes universal fencing across all effect targets.

## 7. Portability / exit path

This hypothesis does not require Certificate Transparency, Rekor, Kubernetes watch semantics, Merkle trees, a graph database, broker, cache product, service mesh, identity provider or centralized invalidation service.

Any future realization must preserve:

- selective dependency-based conflict propagation;
- logical invalidation independent of physical cache deletion;
- domain-qualified frontiers rather than one global revision;
- separation of detection, adjudication, recovery and effect-side fencing;
- historical branch provenance and current-admission separation;
- bounded offline autonomy and reconnect requalification;
- explicit below-retention and negative-evidence semantics;
- bounded fan-out refresh/revalidation;
- provider/transport substitution without fabricated reconciliation;
- purpose-scoped conflict metadata;
- runtime-local evaluation from sufficient evidence closure without Builder dependency.

## 8. Deduplication against existing G4 research

This round does not reopen generic cache invalidation, revocation storms, split-brain reconciliation, relationship succession, transparency, provider migration or offline security. The material delta is their intersection at the **derived-proof propagation boundary**: a newly discovered contested ancestor must selectively downgrade dependent guarantees, and later recovery/fencing must selectively requalify them, without synchronous graph-wide mutation or a central conflict oracle.

## 9. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next high-value gap is **conflict-aware proof compaction and historical effect settlement after branch recovery**: determine when contested dependency commitments may be compacted after a branch is fenced; which historical branch/effect facts must survive for audit, compensation and non-repudiation; how to prove that no resurrection path remains before dropping negative/fencing evidence; and how provider migration or long-term archival preserves those guarantees without retaining a permanent global identity graph.

No implementation, provider, graph model, cache mechanism, identity system, transparency system or architecture binding is authorized by this research.