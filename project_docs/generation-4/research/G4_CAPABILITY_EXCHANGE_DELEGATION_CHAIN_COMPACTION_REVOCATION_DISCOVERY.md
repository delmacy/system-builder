# G4 — Delegation-Chain Compaction & Revocation Discovery

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can long-lived/offline cross-capability workflows preserve enough authority lineage to validate attenuation and discover late ancestor revocation after a delegation chain such as `A -> B -> C -> D` has been compacted, without retaining every credential indefinitely and without requiring a central authorization oracle?

This document extends `G4_CAPABILITY_EXCHANGE_CROSS_DOMAIN_FLOOR_DELEGATED_REVOCATION.md`, `G4_CAPABILITY_EXCHANGE_DERIVED_EVIDENCE_REVOCATION_STORMS.md`, and the prior offline-security/evidence-retention research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, papers, mature-system evidence and prior G4 artifacts reviewed:

- Macaroons paper (NDSS 2014 / Google Research): decentralized delegation, contextual caveats, attenuation, third-party discharge, short-lived credentials, state-based revocation, epoch/version approaches, and the distinction between credential confinement and external revocation state.
- Eclipse Biscuit specification and revocation guidance: decentralized verification, offline attenuation, unique per-block revocation identifiers, ancestry-aware revocation where revoking an ancestor invalidates derived tokens, and explicit non-goal of prescribing a revocation publication architecture.
- RFC 9470 OAuth 2.0 Step Up Authentication Challenge: resource-local requirements for authentication strength/recentness and the important observation that a stronger/newer credential does not universally supersede weaker credentials for all operations.
- Google Vanadium distributed-authorization research: authorization designed for limited connectivity using decentralized techniques rather than mandatory online authorization for every operation.
- Prior G4 research on cross-domain floors, delegated revocation, evidence minimization, offline security floors, evidence cache invalidation, revocation storms, profile negotiation, semantic-generation handoff, recovery/compaction and DR.

These are benchmarks and failure evidence, not technology selections.

## 3. Material findings

### 3.1 Delegation compaction may summarize credentials, but not erase authority ancestry

A runtime does not necessarily need every historical credential byte to decide whether a current delegated right remains admissible. It does need enough durable lineage to prove the claims that still matter:

- root/authority domain identity;
- stable delegation-lineage identity;
- parent/ancestor relation or an equivalent authenticated commitment;
- effective attenuated scope/audience/resource/tenant/classification;
- whether sub-delegation was permitted at each material transition;
- applicable revocation domains/floors and offline horizons;
- immutable semantic/profile references required to interpret the summarized evidence;
- unresolved effect/settlement obligations that still depend on the lineage.

Therefore:

`Credential bytes compacted != authority ancestry forgotten`.

`Delegation-chain compaction != minting a new root authority`.

The compacted representation is evidence about a lineage, not a replacement issuer.

### 3.2 Attenuation proof and revocation discovery are different obligations

Macaroons and Biscuit show that a holder can derive a more restricted credential offline. That property can prove confinement/attenuation without contacting the issuer. Revocation, however, generally requires some changing external state, short lifetime, epoch/floor knowledge, revocation identifiers, or equivalent currentness evidence.

Thus:

`Offline attenuation proof != proof of non-revocation`.

`Cryptographically valid descendant != currently admissible descendant`.

A compacted lineage must preserve both: evidence that the descendant could not exceed its legitimate parent constraints, and references/floors sufficient to determine whether a relevant ancestor has since been revoked.

### 3.3 Ancestor revocation is a lineage predicate, not a leaf-token property

Biscuit provides a useful mature failure model: revocation identifiers are associated with token blocks, and a verifier can reject a token when an identifier from its derivation is revoked. The transferable principle is that revoking an ancestor must invalidate descendants whose authority depends on it, even if the leaf itself was never individually named in a revocation event.

`Leaf not listed as revoked != lineage non-revoked`.

Compaction therefore needs either resolvable ancestor revocation identities or a qualified commitment/floor that subsumes them. A leaf-only identifier is insufficient when parent revocation is semantically transitive.

### 3.4 Revocation discovery horizon and credential lifetime are independent

Expiration bounds how long a credential can be exercised, but it does not prove that no revocation occurred before expiry. Conversely, a current revocation view does not prove that a credential's scope/audience/sub-delegation chain is valid.

`Not expired != not revoked` remains in force.

For long-lived/offline workflows, admissibility is bounded by at least:

- credential/effect-right lifetime;
- revocation-currentness horizon;
- semantic/profile resolvability horizon;
- any operation-specific authentication/currentness requirement;
- settlement/reconciliation obligations for already admitted effects.

The shortest material safety horizon constrains new effects; historical interpretation can outlive it.

### 3.5 `ancestor unresolved`, `below-retention`, `revoked`, and `admissible` must remain distinct

After compaction or long disconnection, an ancestor reference may no longer be directly resolvable. That is not equivalent to either revocation or validity.

Candidate research dispositions:

- `ADMISSIBLE_AT_OBSERVED_FLOORS`;
- `REVOKED_BY_ANCESTOR`;
- `ANCESTOR_UNRESOLVED`;
- `BELOW_REVOCATION_RETENTION_FLOOR`;
- `CURRENTNESS_HORIZON_EXPIRED`;
- `ATTENUATION_UNPROVEN`;
- `SEMANTICS_UNRESOLVED`.

These are research vocabulary, not enums.

`Cannot resolve ancestor != ancestor valid`.

`Cannot resolve ancestor != ancestor revoked`.

The safe response depends on the operation contract: revalidation, fail-closed, bounded read-only continuation, queue-without-effect, or explicit `UNKNOWN`/reconciliation.

### 3.6 Negative revocation evidence needs an explicit validity basis

A statement equivalent to “no ancestor revocation observed” is negative evidence. It is meaningful only relative to a named revocation authority/domain, observed floor/snapshot, retention coverage and time/currentness horizon.

`No revocation observed != proof that no revocation exists`.

A compacted chain must not turn a stale absence into permanent non-revocation. If a revocation authority has advanced beyond the snapshot used by the compacted proof, the proof requires requalification before a new sensitive effect.

### 3.7 Revocation-retention floors must prevent false resurrection

If revocation records can be garbage-collected, a verifier must distinguish “not present in current retained set” from “known never revoked”. The earlier G4 compaction law therefore applies directly:

`Below retention != not found`.

Before an ancestor revocation record disappears, either every descendant that could still be exercised must have expired/become unusable, or a stronger durable floor/fence must subsume the removed record. Otherwise a compacted descendant can resurrect stale authority after the negative evidence is forgotten.

### 3.8 Compact lineage may use commitments, but commitments prove integrity rather than currentness

Authenticated chains/sets, hashes, Merkle-style summaries, chained MACs/signatures or other commitments may reduce storage and transfer cost. No mechanism is selected.

The invariant is:

`Lineage commitment intact != lineage currently admissible`.

A commitment can show that a descendant was derived from a particular ancestry and constraints. It cannot by itself show that no authority in that ancestry was subsequently revoked or superseded.

### 3.9 Compaction must preserve attenuation across audience/scope changes

A compacted leaf that merely stores its current effective permissions can lose the proof that intermediate delegators were allowed to narrow/rebind the audience or sub-delegate at all.

At minimum, the retained evidence must permit verification that every material transformation was either:

- monotonic attenuation under already delegated authority;
- an explicitly permitted sub-delegation; or
- a new target-domain re-authorization with its own authority lineage.

`Final scope is narrow != derivation was authorized`.

A malicious B cannot repair an unauthorized B->C delegation merely by giving C a narrow scope.

### 3.10 Resource-local requirements can invalidate an otherwise valid compacted lineage

RFC 9470 is a useful precedent: a resource server may require authentication that is stronger or more recent for one request while older credentials remain appropriate for routine operations. This reinforces that a compacted delegation proof is not universally reusable.

`Lineage valid for operation X != lineage sufficient for operation Y`.

`Newer/stronger credential != universal replacement credential`.

The consuming capability owns the business/security requirement for its operation; the Exchange Plane may transport the challenge/evidence but cannot decide that one credential universally supersedes another.

### 3.11 Offline autonomy requires pre-positioned revocation semantics, not perpetual online checks

Vanadium and capability-style credentials demonstrate that distributed authorization can support limited connectivity. G4 therefore should not require a central online revocation oracle for every effect.

Instead, a topology promising autonomous operation must pre-position enough information to decide locally within bounded horizons: trust roots, immutable semantics, observed revocation/security floors, compact lineage/attenuation evidence, operation policy and expiry/offline limits.

`No online oracle != no revocation semantics`.

Once the relevant offline/currentness horizon expires, local possession of a compacted credential cannot manufacture continued authority.

### 3.12 Reconnection must reconcile floors before reopening sensitive effect paths

A runtime returning from a partition may hold a valid compacted lineage under floor F2 while peers have advanced to F5 and revoked an ancestor at F4. Sensitive new effects must not race ahead of revocation-floor reconciliation.

`Connectivity restored != delegated authority revalidated`.

This reuses the existing G4 rule that reconnection is not authority reconciliation. Non-sensitive operations may have different degraded-mode rules, but the difference must be explicit.

### 3.13 Historical effects retain their original lineage after ancestor revocation

Revoking A->B today does not make a legitimately completed B->C->D effect from yesterday disappear. Compaction must preserve enough historical lineage/provenance to explain why the effect was admissible at its effect time, while current admission evaluates the newer revocation floor.

`Ancestor revoked now != historical effect unauthorized retroactively` unless the governing domain explicitly defines retroactive invalidation semantics.

Historical interpretation and new-effect authority remain separate dimensions.

### 3.14 Revocation discovery should scale by domain/floor, not descendant enumeration

A large delegation tree may contain millions of descendants. Requiring an issuer to enumerate every leaf on parent revocation is both operationally expensive and unsafe under partitions.

The implementation-independent hypothesis is that descendants carry/commit to ancestor lineage, while revocation propagates as stable lineage identifiers, authority-domain floors/epochs, revocation-set summaries or equivalent evidence. Consumers test whether their lineage is defeated by the current qualified revocation state.

`Ancestor revocation != enumerate every descendant synchronously`.

This extends the earlier revocation-storm result from derived guarantee caches to delegated authority trees.

### 3.15 Revocation discovery and semantic interpretation need separate retention plans

An old delegation may no longer be admissible for new effects but may still be required to interpret audit evidence, explain an incident, reconcile an external effect, or prove that a historical action was within scope.

Therefore:

`Revocation-check retention != historical semantic-evidence retention`.

A system may compact active revocation state aggressively after all descendants are dead while retaining a privacy-minimized historical lineage witness for audit/reconciliation. That witness must not be accepted as fresh authority.

## 4. Candidate research vocabulary

Research vocabulary only; no schema/enum/implementation is authorized.

- `DelegationLineageRef` — stable identity for an authority derivation independent of transport/topology.
- `AncestorCommitment` — compact authenticated evidence binding a descendant to material ancestors/transformations.
- `EffectiveAttenuationSummary` — qualified summary of scope/audience/resource/tenant/classification restrictions.
- `RevocationDomainRef` — authority domain whose revocation semantics govern a lineage segment.
- `ObservedRevocationFloor` — highest locally justified monotonic revocation/currentness floor for that domain.
- `RevocationCoverage` — evidence describing which lineage/epoch/retention interval a revocation view covers.
- `LineageResolutionDisposition` — qualified outcome such as admissible, revoked, unresolved or below-retention.
- `HistoricalAuthorityWitness` — minimized evidence sufficient to interpret/audit a historical effect without granting current authority.

## 5. Candidate proof obligations

1. Compaction never converts a descendant into a new root authority.
2. Every current delegated effect retains a stable lineage to the authority from which it derives.
3. Effective descendant scope/audience/resource/tenant/classification never exceeds legitimately delegable ancestor authority.
4. A compacted lineage preserves evidence that material sub-delegations were authorized, not merely that the final scope is narrow.
5. Offline attenuation proof remains distinct from current non-revocation proof.
6. Revoking a material ancestor defeats every descendant that still depends on that ancestor according to the governing contract.
7. Leaf absence from a revocation list cannot prove lineage non-revocation when ancestor revocation is transitive.
8. Revocation/currentness horizon and credential expiration are independently evaluated.
9. `ANCESTOR_UNRESOLVED`, `BELOW_RETENTION`, `REVOKED` and `ADMISSIBLE` remain distinct outcomes.
10. Negative revocation evidence is bound to a named authority/domain, coverage/floor and horizon.
11. Revocation records are not garbage-collected while a surviving descendant could be falsely resurrected, unless a stronger durable fence/floor subsumes them.
12. Compaction below a revocation-retention floor yields explicit below-floor/revalidation behavior rather than fabricated absence.
13. A lineage commitment proves only the properties it commits to; integrity/ancestry cannot imply currentness.
14. Current admission can reject historically valid compacted evidence without erasing its historical provenance.
15. Resource/operation-local security requirements can demand requalification even when the delegation lineage remains structurally valid.
16. No gateway/adapter/Exchange Plane component becomes revocation authority merely by carrying compacted lineage or revocation evidence.
17. Offline runtimes can evaluate within declared horizons from locally sufficient evidence when the topology promises autonomy.
18. Expiry of an offline/revocation horizon prevents sensitive new effects unless the contract explicitly defines another safe degraded mode.
19. Reconnection reconciles relevant revocation/security floors before reopening effect paths that require them.
20. Transport/provider migration preserves lineage identity and does not reset revocation history.
21. Ancestor revocation scales without requiring synchronous enumeration/invalidation of every descendant.
22. Historical authority witnesses are not reusable as current credentials.
23. Revocation-check retention and historical semantic/audit retention are independently justified and privacy-minimized.
24. Unknown/unresolvable lineage never becomes permission to guess, mint replacement authority or silently widen a guarantee.

## 6. Adversarial cases

1. A->B->C is compacted to C's final scope; B was never allowed to sub-delegate, but that fact disappears.
2. Parent A is revoked; leaf C is not individually listed and continues executing.
3. Revocation list garbage-collects A before C expires, resurrecting C.
4. Runtime treats an expired revocation snapshot as proof that no revocation exists.
5. Credential has not expired, so runtime ignores a newer ancestor-revocation floor.
6. Revocation view is current, but C's audience was illegally widened during B->C delegation.
7. `ancestor not found` after compaction is interpreted as `ancestor valid`.
8. `ancestor not found` is interpreted as `revoked`, destroying safe historical interpretation without evidence.
9. A compact hash proves ancestry integrity and is mislabeled as current authorization.
10. VM rollback restores a pre-revocation floor and accepts a compacted descendant again.
11. Gateway reissues a compacted chain under its own identity and accidentally becomes the new authority root.
12. Transport migration assigns a new leaf identifier and loses ancestor-revocation linkage.
13. Offline runtime remains effectful indefinitely because token expiry is long even though revocation-currentness horizon is short.
14. Runtime reconnects and executes one queued sensitive effect before learning the newer revocation floor.
15. Parent revocation triggers synchronous enumeration of millions of descendants and causes the revocation service itself to fail.
16. Negative cache `not revoked` survives beyond the retention coverage from which it was derived.
17. Resource requiring fresh/high-assurance authentication accepts a structurally valid but insufficient compacted delegation.
18. New stronger credential is treated as universally replacing an older credential even for operations whose constraints differ.
19. Historical audit witness is accidentally accepted as a live credential after active revocation state was compacted.
20. Revocation evidence is retained forever with unnecessary business payload, turning safety retention into a privacy exemption.
21. Exchange Plane suppresses `BELOW_RETENTION` and returns generic success because the leaf signature verifies.
22. Adapter cannot represent an ancestor constraint and silently emits only the final scope.
23. Revocation authority for domain X is reused to revoke unrelated domain Y because both use the same numeric epoch format.
24. Offline runtime cannot contact Builder and stops despite possessing all locally sufficient, still-current evidence promised by its autonomous topology.

## 7. Portability / exit path

The hypothesis is implementation-independent. It does not require Macaroons, Biscuit, OAuth, JWT, UCAN, Vanadium, Zanzibar/OpenFGA, a centralized revocation service, a shared database, Merkle trees, a broker, a service mesh or a particular credential format.

Any future realization must preserve:

- stable authority lineage independent of transport/topology;
- attenuation/sub-delegation proof sufficient for the protected operation;
- independently current revocation evidence/floors;
- explicit unresolved/below-retention behavior;
- bounded offline autonomy rather than perpetual stale authority;
- ancestor-revocation transitivity where the governing contract requires it;
- privacy-minimized historical evidence without regranting live authority;
- no central authorization oracle requirement unless a future topology explicitly chooses one.

## 8. Deduplication against existing G4 research

This round does not reopen:

- cross-domain floor/delegated revocation research: it takes its authority-lineage and attenuation laws as inputs and studies what survives compaction/long disconnection;
- derived-evidence revocation storms: it reuses monotonic-floor and lazy-invalidation principles, applying them specifically to delegation ancestry;
- handoff recovery/compaction: it reuses `compaction != semantic forgetting`, specializing the retained questions to authority lineage/revocation;
- offline security floors: it reuses bounded-autonomy rules rather than defining a new offline-security model;
- degraded-mode contracts: it relies on operation-specific behavior after horizon expiry instead of introducing a universal fail-open/fail-closed policy.

## 9. Maturity and next gap

Material delta exists. This round changes proof obligations and retention/currentness boundaries rather than merely adding examples.

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

Next high-value gap: **revocation evidence privacy and unlinkability under lineage-preserving compaction** — determine how much stable lineage can be exposed across capabilities without turning revocation identifiers/ancestor commitments into global correlation handles; how privacy-preserving or purpose-scoped revocation checks interact with offline autonomy; and how to retain revocation transitivity without collapsing tenant/trust-domain privacy boundaries.
