# G4 — Distributed Requalification Anti-Entropy and Unequal Security Knowledge

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How should autonomous, intermittently connected runtimes converge after a retroactive compromise/requalification finding when different runtimes learn that finding at different times, without creating a central security oracle, erasing observation-time provenance, leaking hidden dependency graphs, resurrecting weaker trust after rollback, or conflating transport convergence with business/effect settlement?

This is a focused continuation of `G4_CAPABILITY_EXCHANGE_RETROACTIVE_CRYPTO_COMPROMISE_RESEARCH.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary/mature references reviewed:

- The Update Framework (TUF) specification: clients persist trusted metadata, reject rollback/freeze/mix-and-match attacks, advance root metadata sequentially, and do not accept older metadata merely because a mirror serves it. This is strong precedent for runtime-local monotonic trust floors rather than `latest response wins`.
- Sigstore threat model and Policy Controller documentation: compromised material can carry a compromise time; freshness is independently relevant; custom/TUF trust roots and serialized repositories can be provisioned out-of-band for air-gapped environments. This supports portable security knowledge without mandatory online central authority.
- Kubernetes API watch/resourceVersion semantics: clients can resume from an observed resource version, but retained history is bounded; after history compaction (`410 Gone`) a client must re-list/rebase rather than fabricate missing events. `BOOKMARK` establishes progress through a version, not semantic truth. This is useful precedent for frontier-based anti-entropy and explicit below-retention recovery.
- Apache Cassandra anti-entropy repair: best-effort hints do not guarantee delivery of all missed writes; Merkle-tree comparison identifies divergent ranges and repair streams only differences. This is evidence for periodic state/frontier reconciliation in addition to push notifications, and for selective repair rather than mandatory full replay.
- RFC 6962 Certificate Transparency: individually valid signed tree heads can represent conflicting views; gossip/comparison exposes inconsistency, and consistency proofs permit compact comparison without replaying the whole log. This demonstrates that exchanging authenticated frontiers is not equivalent to trusting a central latest value.
- RFC 9943 SCITT architecture: receipts/transparency can prove registration/inclusion in an append-only structure while remaining distinct from the semantic truth of the signed statement. This reinforces that anti-entropy evidence transport must not become business/security authority by itself.

No TUF client, Sigstore stack, Kubernetes watch API, Cassandra repair mechanism, Merkle tree, CT/SCITT service, gossip protocol, broker or provider is selected.

## 3. Material findings

### 3.1 Requalification convergence is not ordinary state replication

A compromise finding can lower admissibility of previously accepted evidence. That is structurally different from replicating a mutable business row.

`security knowledge convergence != business-state convergence`.

A runtime may learn that evidence `E` is no longer admissible for a claim while the historical business occurrence supported by `E` remains a fact. Anti-entropy therefore exchanges qualified security/evidence knowledge, not ownership of the underlying business entity.

### 3.2 Effective compromise time and local observation time must both survive propagation

If runtime A learns at `T_A` that key K may have been compromised since `T_C`, and runtime B learns the same finding at `T_B`, convergence must not collapse those into one timestamp.

`compromise/effective time != observation time`.

Observation time is needed to explain why A admitted an effect that B, already informed, rejected. The propagated finding may converge; historical decision provenance remains runtime-local and immutable.

### 3.3 Security/requalification floors are monotonic locally, but not one global scalar

TUF's persisted rollback protection is strong precedent for remembering security progress. G4 generalizes this as claim/domain/profile-qualified floors.

`learn stronger defeat/floor -> old snapshot cannot silently restore weaker admissibility`.

But independent trust domains and claim classes cannot be flattened into one global `securityVersion`. Candidate floors are partial/frontier-valued and scope-qualified.

### 3.4 Push invalidation accelerates convergence but cannot establish correctness

A broker event, webhook or watch notification can reduce reaction time, but offline runtimes may miss it. Cassandra's best-effort hints and Kubernetes bounded watch history demonstrate the operational reason.

`invalidation published != invalidation observed`.

Correctness for sensitive claims therefore requires locally enforceable horizons/floors and eventual reconciliation, not faith in universal notification delivery.

### 3.5 Anti-entropy needs frontier comparison plus a recovery path when deltas are no longer retained

Kubernetes explicitly returns `410 Gone` when a requested historical resourceVersion has fallen outside retained history; the client re-lists and establishes a new baseline. This yields a useful G4 principle:

`delta unavailable != no change occurred`.

A runtime whose requalification frontier is below retained detail needs a qualified snapshot/closure/re-bootstrap path. The system must not infer `no compromise` from an empty delta response.

### 3.6 Frontier equality is evidence of compared state, not proof of global completeness

Two peers can report the same frontier while both are isolated from a third domain holding a stronger finding.

`peer agreement != global latest/security truth`.

Frontiers must declare scope, source/trust domain, coverage and currentness. No Exchange Plane component may promote `highest observed frontier` into universal security authority.

### 3.7 Anti-entropy should be selective over material lineage

Cassandra's Merkle repair illustrates comparing summaries and streaming mismatched ranges rather than replaying all data. For G4, the analogous unit is not arbitrary key ranges but material evidence lineage/claim domains.

`dependency changed != global proof replay`.

A runtime should requalify only derived proofs whose minimal semantic cut set materially depends on the changed trust/evidence premise.

### 3.8 Digest/Merkle equality cannot prove semantic admissibility by itself

A digest can prove equality of committed bytes under its assumptions. It cannot prove that both peers use the same immutable normative semantics, trust profile, compromise-window interpretation or security floor.

`same digest != same semantic disposition unless the digest commits the material semantics/context`.

Adapters/drivers must not fabricate equivalence from matching transport/storage hashes.

### 3.9 Conflicting requalification evidence must remain representable

Runtime A may receive evidence that K was compromised in `[T0,T1]`; runtime B may receive independently qualified evidence narrowing or disputing that interval. Anti-entropy cannot resolve this by last-write-wins, wall-clock recency or majority count.

`conflicting security evidence -> CONTESTED`, not `latest wins`.

A successor assessment may narrow/qualify the conflict only under explicit evidence/authority rules.

### 3.10 Requalification anti-entropy is join-like only for monotonic facts, not arbitrary dispositions

Some facts are monotonic: `retirement floor F observed`, `conflict C observed`, `evidence E exists`. Other dispositions can be requalified by stronger evidence.

Therefore a generic set-union CRDT mental model is insufficient.

`monotonic evidence accumulation != monotonic business/security conclusion`.

The model needs immutable observations plus explicit supersession/requalification relations.

### 3.11 A runtime can be converged on compromise knowledge and still diverged on business effects

A and B may eventually agree that K was compromised, yet A may have emitted an irreversible payment while B did not.

`security-frontier convergence != effect convergence`.

Effect remediation remains capability-owned and follows existing split-brain/effect-settlement rules.

### 3.12 Anti-entropy transport is replaceable

Direct peer exchange, RPC, broker, stream, file bundle, OOB media or gateway-mediated transfer can all carry the same qualified requalification contract if guarantees are preserved.

`transport topology != requalification semantic identity`.

A broker ACK, file copy or HTTP 200 proves transfer progress only, never effective local activation.

### 3.13 Receipt/ACK must be separated from durable floor activation

A runtime can receive a compromise package but crash before persisting the floor, or reject it because the verifier/profile is unsupported.

`requalification received != verified != durably activated`.

Candidate evidence should distinguish delivery, verification, persistence, activation and effect-admission consequences.

### 3.14 Privacy requires scoped reconciliation handles

A global stable dependency ID, compromise subject ID or Merkle leaf key reused across tenants/capabilities can reconstruct hidden dependency relationships.

`efficient anti-entropy handle != privacy-neutral handle`.

Frontier/digest/reconciliation identities need declared correlation scope. Minimal disclosure may exchange domain commitments or bounded summaries while keeping subject-level lineage local until material mismatch requires qualified disclosure.

### 3.15 Minimal disclosure cannot suppress a material defeat condition

Privacy does not permit a runtime to keep using evidence after learning that a hidden material premise is contested/revoked.

`hidden dependency != hidden defeat`.

A consumer may learn only `material premise defeated/contested` rather than the sensitive premise identity, if that is sufficient for its contract.

### 3.16 Anti-entropy scheduling is an operational policy, not semantic currentness

Hourly repair, watch resync or peer gossip frequency changes expected detection latency. It does not redefine the maximum admissible stale-security horizon.

`repair cadence != security horizon`.

A runtime must stop or degrade according to the claim's currentness policy even if the next scheduled reconciliation has not run.

### 3.17 Resource pressure cannot justify dropping monotonic defeat/floor evidence

Anti-entropy queues can be bounded and prioritized, but eviction of a learned retirement/compromise floor can resurrect unsafe evidence.

`backpressure != permission to forget security floor`.

Operational summaries/compaction may replace detail only when all live revalidation and anti-resurrection questions remain answerable.

### 3.18 Reconciliation storms are a first-class failure mode

A widely distributed compromise can cause every runtime to refresh trust roots, proof lineages and dependent caches simultaneously. Existing G4 retry/budget rules apply.

`security event != unlimited refresh authority`.

Jitter, coalescing, scoped summaries, staged repair and bounded concurrency may contain load, but cannot extend security freshness merely to reduce pressure.

### 3.19 Long-offline rejoin may require snapshot closure rather than replay

If a runtime missed years of requalification deltas, replaying every intermediate event is unnecessary when a compact qualified closure preserves all live floors, conflict evidence and historical interpretation requirements.

`full event replay != required for safe rejoin`.

But `compaction != semantic forgetting`: below-floor references need explicit treatment, and historical effects retain provenance.

### 3.20 No central anti-entropy coordinator becomes semantic authority

A service may schedule peers, distribute summaries, cache packages or coordinate repair. It remains an exchange/control component.

`repair coordinator != compromise oracle != business owner`.

Autonomous runtimes must be able to validate portable requalification evidence from locally durable trust state/qualified re-bootstrap paths.

## 4. Candidate vocabulary

Research vocabulary only:

- `RequalificationFrontierRef` — scope-qualified summary of requalification/security knowledge durably activated by a runtime/domain.
- `RequalificationDeltaRef` — immutable evidence package advancing or contesting a prior frontier.
- `RequalificationSnapshotRef` — compact qualified closure used when incremental history is unavailable or inefficient.
- `RequalificationObservationRef` — runtime-local record of when a delta/snapshot was observed, verified and activated.
- `ActivationFloorRef` — monotonic local floor preventing resurrection of evidence already known inadmissible for named claims.
- `FrontierCoverageRef` — declares trust domain, claim classes, proof/profile semantics and retention/currentness coverage of a frontier.
- `ReconciliationHandleRef` — correlation-scoped handle for comparing relevant state without requiring a global subject identifier.
- `BelowRetentionDisposition` — explicit result when the requester is older than retained delta history and must consume a snapshot/closure/re-bootstrap.
- `RequalificationConflictRef` — durable relation recording incompatible qualified findings without selecting a winner by transport order.
- `RequalificationActivationEvidenceRef` — distinguishes package receipt from successful verification, durable persistence and effective admission-policy activation.

These are candidate structural refs/roles, not shared business entities or concrete components.

## 5. Candidate proof obligations

1. Effective compromise/revocation time and each runtime's observation/activation time remain separately representable.
2. A learned stronger retirement/requalification/security floor survives restart, snapshot restore, cache restore and application rollback.
3. Floors remain scope-qualified; no synthetic global security revision is created across independent trust domains.
4. Push/watch/broker invalidation is acceleration only; correctness remains possible after missed notifications.
5. Missing retained delta history produces explicit below-retention recovery, never `no changes`.
6. Frontier comparison declares scope/coverage/currentness and cannot claim global completeness from peer equality.
7. Selective reconciliation requalifies every materially dependent proof and need not invalidate unrelated claims.
8. Digest/hash equality proves only the committed material and never silently implies semantic/profile/authority equivalence.
9. Conflicting qualified findings remain representable as conflict; last-write-wins, wall-clock recency and majority count do not decide truth.
10. Immutable observations and their supersession/requalification relations remain distinguishable from mutable derived dispositions.
11. Security-knowledge convergence never erases or automatically settles divergent historical business effects.
12. Requalification contracts survive transport substitution; direct call, RPC, broker, stream, file/OOB and gateway mediation cannot alter promised semantics.
13. Delivery/ACK, verification, durable persistence, activation and business-effect consequences remain distinct states.
14. Reconciliation handles/digests have declared correlation scope and do not create a global hidden-dependency index by convenience.
15. Privacy/minimal disclosure never suppresses a material defeat/contested condition required by the consumer's contract.
16. Reconciliation cadence and security/currentness horizon remain independent.
17. Backpressure/compaction cannot discard a floor/conflict witness while any supported path could resurrect defeated evidence.
18. Repair/revalidation storms obey bounded attempt/time/concurrency/cost budgets without extending semantic freshness.
19. Long-offline runtimes can rejoin through qualified snapshots/closures when deltas are unavailable, without mandatory full replay.
20. Snapshot/closure application preserves historical observation/effect provenance rather than relabeling old decisions as if the runtime knew the future finding.
21. Provider/transport migration preserves frontier and compromise-window semantics or exposes explicit incompatibility/requalification.
22. A repair coordinator, Exchange Plane, broker, gateway or cache never becomes canonical compromise/business authority by coordinating convergence.
23. Autonomous runtimes can verify portable requalification evidence from locally durable trust/recovery state without Builder availability.
24. If evidence remains insufficient or conflicting after anti-entropy, the result stays `UNKNOWN/CONTESTED` rather than being promoted for availability.

## 6. Adversarial cases

1. Broker publishes compromise event; offline runtime misses it and is assumed updated anyway.
2. Runtime requests deltas below retention; empty result is interpreted as `no compromise`.
3. Highest numeric frontier across unrelated trust domains is treated as global security truth.
4. Two peers agree because both missed the same stronger finding and call that global convergence.
5. Matching Merkle roots over payload bytes are treated as proof that verifier semantics/security floors match.
6. Last-write-wins chooses the most recently received compromise interval over conflicting qualified evidence.
7. Majority of peers chooses compromise truth despite correlated trust paths.
8. Runtime receives package, ACKs transport, crashes before persisting floor, and is reported as protected.
9. Runtime verifies package but unsupported profile prevents activation; control plane reports success from download completion.
10. Snapshot restore resurrects evidence below a previously learned compromise floor.
11. Application downgrade silently drops the data structure holding requalification floors.
12. Global dependency ID used for anti-entropy correlates the same hidden subject across tenants.
13. Tenant-specific digest endpoint reveals which sensitive provider/dependency is in use.
14. Privacy filter removes `CONTESTED` because exposing the underlying dependency would be sensitive.
15. Hourly repair cadence is treated as permission to use 59-minute-stale security evidence despite a 5-minute horizon.
16. Requalification storm causes unlimited retries/fan-out and takes down otherwise independent runtimes.
17. Load shedding discards retirement/conflict evidence while retaining positive cache entries.
18. Full global cache flush destroys unrelated availability although only one trust path changed.
19. Long-offline runtime is forced to replay every historical delta even though a qualified closure could safely subsume them.
20. Compact snapshot says only `current=R5` and omits retirement/conflict evidence needed to prevent R3 resurrection.
21. Security-frontier convergence is reported as business-effect convergence although one side emitted an irreversible effect.
22. Gateway translates a qualified interval compromise into boolean `revoked=true`, losing uncertainty semantics.
23. Repair coordinator chooses the `winning` root/finding because it sees more peers than individual runtimes.
24. No surviving evidence resolves a conflict, but system promotes `most likely current` to preserve availability.

## 7. Interaction with Shared Semantic Kernel / Capability Exchange Plane

The candidate Shared Semantic Kernel may contain only minimal structural refs/envelopes needed to carry frontier, observation, coverage, currentness, provenance, classification, tenant/authority context and qualified relations. It must not contain provider-specific trust databases, business entities, global dependency graphs or a canonical compromise ledger.

The Capability Exchange Plane may route/bind/mediate requalification deltas and snapshots, enforce exchange policy/budgets, preserve envelope metadata and expose reconciliation outcomes. It does not decide the business meaning of the affected capability, select a truth winner among conflicting qualified findings, or own canonical historical effects.

Candidate boundary remains:

`Capability Core -> Inbound/Outbound Ports -> Contracts -> Exchange Policies -> Exchange Plane -> target boundary`.

For this research slice, the contract must preserve at least:

`scope + claim/profile identity + prior frontier + resulting frontier/relationship + effective/compromise bounds + provenance + currentness + observation/activation evidence + conflict/below-retention disposition + correlation scope`.

## 8. Transport / topology criteria

- **Direct/in-process:** useful when producer/consumer share a process, but must persist the same floor/observation semantics required remotely; function return is not durable activation.
- **RPC/HTTP/gRPC:** useful for on-demand delta/snapshot retrieval; timeout is `UNKNOWN`, never proof of no compromise.
- **Broker/event bus:** useful for fast push fan-out; cannot be the only correctness path because offline consumers miss notifications and ACK is not activation.
- **Stream:** useful for ordered domain-local deltas when the contract actually provides that order; offset is not a global security revision.
- **File/OOB exchange:** valuable for air-gapped/long-offline rejoin; trust derives from qualified evidence/anchors, not from removable media itself.
- **Gateway/adapter:** appropriate for trust-zone/protocol mediation only when interval/conflict/currentness semantics survive; lossy booleanization must be explicit incompatibility or qualified degradation.
- **Anti-entropy summary/snapshot:** useful after missed deltas or at scale; compactness is valid only if all live anti-resurrection/requalification questions remain answerable.

## 9. Portability / exit path

A provider-neutral implementation must be able to export enough durable evidence for another implementation to reconstruct:

- locally activated requalification floors and their scopes;
- compromise/effective-time bounds and local observation/activation times;
- unresolved conflicts and explicit supersession/requalification relations;
- frontier coverage/currentness semantics;
- lineage needed for material derived-proof requalification;
- below-retention snapshot/closure transition evidence;
- historical effect provenance unaffected by later security reclassification;
- normative profile/encoding identifiers needed to interpret the evidence.

Provider migration that can only export `revoked=true/false`, latest cursor, or current trust root is semantically lossy and must not be called equivalent.

## 10. Deduplication

This document does not reopen generic cache invalidation, ordinary revocation, archival crypto durability, compromise-window derivation, witness governance, split-brain business settlement, root recovery, generic CRDT design or generic DR. The material delta is specifically:

`retroactive compromise knowledge -> unequal runtime observation -> scoped monotonic floors/frontiers -> missed-notification-safe anti-entropy -> selective requalification -> privacy-preserving long-offline convergence without a central security oracle`.

## 11. Maturity and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`; not saturated.

Materially changed boundaries/proof obligations in this round:

- security knowledge propagation is distinct from business-state replication;
- effective compromise time and local observation/activation time both survive convergence;
- security floors are monotonic locally but scope-qualified rather than one global scalar;
- push invalidation is acceleration, not correctness;
- delta-history compaction requires explicit below-retention snapshot/closure recovery;
- frontier equality is coverage-qualified and not proof of global latest state;
- conflict survives anti-entropy rather than being resolved by arrival order/majority;
- receipt, verification, persistence and activation are separate states;
- reconciliation handles need privacy/correlation scope;
- repair cadence cannot redefine semantic currentness;
- convergence storms require bounded budgets without freshness extension.

Next highest-value gap: **proof-preserving compaction of distributed requalification frontiers across independently evolving trust domains** — determine when multiple per-domain compromise/floor histories can be compacted into portable summaries without inventing a global revision, losing unresolved conflict/observation-time evidence, breaking selective lineage invalidation, or creating stable cross-domain correlation handles.