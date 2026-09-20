# G4 — Revocation-Evidence Privacy & Unlinkability

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can cross-capability delegation/revocation preserve enough lineage to discover ancestor revocation and prove current admissibility while preventing revocation identifiers, lineage commitments, status lookups, verifier behavior or Exchange Plane metadata from becoming global correlation handles across tenants, trust domains, capabilities or unrelated occurrences?

This document extends `G4_CAPABILITY_EXCHANGE_DELEGATION_CHAIN_COMPACTION_REVOCATION_DISCOVERY.md`, `G4_CAPABILITY_EXCHANGE_CROSS_DOMAIN_FLOOR_DELEGATED_REVOCATION.md`, and `G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_EVIDENCE_FEDERATION.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, papers and mature-system evidence reviewed:

- W3C Bitstring Status List v1.0 Recommendation (2025): privacy-preserving group status publication, large lists for herd privacy, verifier caching/distribution, and privacy risks from status structure and access patterns.
- RFC 9576 Privacy Pass Architecture and RFC 9577/9578: unlinkability is explicitly scoped across issuance, attestation and redemption contexts; tokens avoid stable per-client information, while replay/side-effect concerns remain separate.
- IBM Research, *Accumulators with Applications to Anonymity-Preserving Revocation* (EuroSys 2017): dynamic accumulators plus zero-knowledge proofs as a mechanism class for revocation without exposing a stable identity to the verifier.
- IBM Research, *Scalable revocation scheme for anonymous credentials based on n-times unlinkable proofs* (WPES 2016): verifier-local revocation with unlinkable proofs and offline constrained provers.
- Prior G4 privacy-preserving evidence federation, correlation-scope, offline-security-floor, revocation-storm, cross-domain delegation and delegation-compaction research.

These are benchmarks and failure evidence, not technology selections.

## 3. Material findings

### 3.1 Revocation continuity and global identity continuity are different requirements

Ancestor revocation needs enough continuity to answer whether a descendant depends on revoked authority. It does not imply that every verifier needs the same stable ancestor or descendant identifier.

`Revocation continuity != global subject continuity`.

`Ancestor discoverable for revocation != ancestor globally correlatable`.

A future realization may use pairwise, trust-group, lineage-segment, epoch, accumulator-membership or other qualified evidence. The implementation-independent requirement is that the correlation scope be no broader than the revocation proof requires.

### 3.2 Stable raw revocation identifiers are privacy-bearing metadata

A globally stable revocation ID carried through unrelated capabilities can become a tracking handle even when business payload and subject identity are hidden.

Therefore:

`Opaque identifier != privacy-neutral identifier`.

`Hashed global identifier != unlinkable identifier`.

Hashing or encoding a stable identifier preserves equality unless the derivation is purpose/domain scoped. Revocation identifiers and ancestor commitments are therefore subject to the same correlation governance as other evidence references.

### 3.3 Revocation status should be a predicate proof where possible, not identity disclosure

The verifier normally needs a proposition such as:

`lineage L is not defeated by revocation state R at floor F for purpose P`.

It does not automatically need the complete lineage, global credential identity, issuance history or subject identity.

This extends the existing rule:

`Proof of predicate != disclosure of source record`.

Anonymous-credential accumulator research demonstrates that membership/non-revocation can, in some designs, be proven without revealing the long-term identity used by the revocation authority. G4 adopts only the principle that revocation proof and subject disclosure are separable obligations.

### 3.4 Status-query privacy is part of revocation privacy

Even if the credential presentation is unlinkable, an online lookup such as `GET status/<unique-id>` can reveal when, where and how often a particular lineage is exercised.

`Unlinkable presentation + unique online status lookup != unlinkable revocation check`.

W3C Bitstring Status List provides a mature example of group-oriented status material and verifier caching reducing issuer-visible per-credential lookups. The transferable principle is that revocation distribution can be bulk/group based while verification remains local.

### 3.5 Herd privacy is a workload property, not a file-format property

Large status structures improve privacy only when many credentials actually share the same observable status set and access pattern. Tiny tenant-specific lists, unique list URLs, unique refresh cadence, geographic request metadata or verifier collusion can partition the anonymity set.

`Large theoretical status capacity != large effective anonymity set`.

`Shared format != shared privacy set`.

Privacy proof obligations must name observer and collusion assumptions, consistent with earlier G4 privacy research.

### 3.6 Purpose-scoped linkability is preferable to universal unlinkability claims

Revocation, deduplication, abuse control, settlement and audit sometimes require recognizing sameness. The coherent goal is bounded linkability:

`required correlation within purpose/scope + disassociability outside it`.

Candidate scopes remain research vocabulary: `PRESENTATION_EPHEMERAL`, `VERIFIER_PAIRWISE`, `TRUST_GROUP_SCOPED`, `LINEAGE_SEGMENT_SCOPED`, `OCCURRENCE_SCOPED`, `TENANT_SCOPED`, and exceptional `GLOBAL`.

`RevocationScope <= permitted CorrelationScope` must be justified per contract; neither scope is inferred from transport topology.

### 3.7 Ancestor transitivity does not require exposing the ancestor graph

A verifier may need assurance that no material ancestor is revoked. It does not necessarily need the explicit graph `A -> B -> C -> D`.

Candidate mechanism classes include authenticated summaries, accumulators, zero-knowledge membership/non-membership proofs, pairwise commitments, batched status sets or qualified witnesses. No mechanism is selected.

The invariant is:

`Transitive revocation check != mandatory full ancestry disclosure`.

If a realization cannot preserve this property, the privacy loss must be explicit in its guarantee vector rather than silently normalized by an adapter.

### 3.8 Pairwise revocation references require a legitimate mapping authority

A source-local lineage may expose different verifier-specific references. However, an Exchange Plane or gateway must not invent pairwise mappings unless it is explicitly authorized to mediate that evidence.

`Pairwise reference translation != authority translation`.

The mediator must not become a universal reverse directory merely because it routes exchanges. Compromise of one verifier's mapping should not automatically reveal mappings for unrelated verifiers unless the declared threat model permits it.

### 3.9 Revocation floors can be public without making subjects globally linkable

A domain-wide monotonic floor/epoch is generally less correlating than a per-subject stable identifier because many subjects share it. But a floor alone may be too coarse to express selective revocation.

Thus a useful separation is:

`domain floor/currentness` + `purpose-scoped lineage defeat evidence`.

The floor proves the freshness/coverage basis; the lineage-specific proof establishes whether the presented authority survives within that basis.

`Common floor != common subject identity`.

### 3.10 Offline autonomy can improve privacy but widens the currentness trade-off

Locally cached group status material or locally verifiable revocation proofs avoid per-effect issuer callbacks and therefore reduce access-pattern leakage. The cost is a bounded stale window.

`Fewer online lookups -> potentially better privacy` does not imply `stale revocation state -> safe authority`.

The operation contract still names the maximum revocation-currentness horizon. Once expired, privacy does not justify continued sensitive effects.

### 3.11 Refresh cadence can itself fingerprint a tenant, capability or workflow

A runtime that refreshes revocation material exactly when a sensitive workflow executes can leak activity even if the status payload is shared. Candidate mitigations include bounded periodic refresh, jitter, shared distribution caches and coarse status partitions.

`Cached status material != privacy solved`.

Timing, endpoint choice, list partition, cache miss and retry pattern remain metadata channels.

### 3.12 Privacy Pass demonstrates context unlinkability, not universal anonymity

RFC 9576 explicitly defines unlinkability relative to issuance, attestation and redemption contexts and states deployment/collusion assumptions. RFC 9577 also notes that reusing the same token can itself make transactions linkable.

G4 therefore rejects blanket claims such as `revocation is anonymous`.

`Unlinkable under observer set O and contexts C != unlinkable globally`.

Every privacy guarantee names the relevant contexts, observers, collusion assumptions and equality scope.

### 3.13 One-time or unlinkable presentation does not remove replay/effect semantics

Privacy Pass separates unlinkability from anti-replay and side-effect concerns. G4 preserves the same separation:

`Presentation unlinkability != effect idempotency/fencing`.

A privacy-preserving revocation proof cannot replace stable effect identity where retries or external effects require it. Effect identity may remain capability-local or occurrence-scoped rather than becoming a global subject identifier.

### 3.14 Revocation privacy and accountability are separate dimensions

A system may need to investigate abuse, prove issuer misbehavior or explain historical authorization without making every normal presentation linkable. Earlier G4 issuer-accountability research already separates preventive privacy from retrospective evidence.

`Accountable under qualified escalation != globally traceable by default`.

Any exceptional de-anonymization/correlation capability is itself an authority with governance, evidence and audit obligations; it cannot be silently embedded in a gateway or status service.

### 3.15 Privacy-preserving revocation does not justify hiding uncertainty

If status evidence is stale, below retention, partitioned or otherwise insufficient, the privacy layer cannot convert that into `not revoked` merely to avoid a live query.

`Privacy-preserving unavailable status != non-revoked`.

The existing dispositions `ANCESTOR_UNRESOLVED`, `BELOW_REVOCATION_RETENTION_FLOOR`, `CURRENTNESS_HORIZON_EXPIRED` and explicit `UNKNOWN` remain representable.

### 3.16 Exchange metadata must not silently widen correlation scope

Even when the payload uses unlinkable proofs, envelopes may carry stable `correlationId`, tenant IDs, lineage refs, trace IDs, routing keys or artifact refs that restore global linkability.

`Privacy-preserving credential != privacy-preserving exchange`.

The Exchange Plane owns exchange semantics but must propagate only metadata justified for that crossing. Trace/correlation remains distinct from identity proof and authority.

## 4. Candidate research vocabulary

Research vocabulary only; no schema or implementation is authorized.

- `RevocationCorrelationScope` — scope in which equality/linkability of revocation evidence is intentionally permitted.
- `RevocationPrivacyProfile` — declared observer/collusion/currentness assumptions for a revocation proof path.
- `PurposeScopedRevocationRef` — reference usable for a named verifier/trust-group/purpose without implying a global subject identifier.
- `GroupStatusWitness` — bulk/group status evidence from which a verifier can derive a bounded revocation disposition locally.
- `LineageDefeatProof` — evidence that a lineage is or is not defeated under a named revocation state/floor without necessarily disclosing full ancestry.
- `StatusAccessPatternClass` — declared metadata exposure class for online, cached, mirrored or bulk status acquisition.
- `ExceptionalCorrelationAuthority` — explicitly governed authority, if any, permitted to correlate otherwise separated presentations for a declared purpose.

## 5. Candidate proof obligations

1. Revocation continuity does not require a globally stable subject identifier unless explicitly justified.
2. Raw stable revocation identifiers are treated as correlatable metadata, not privacy-neutral plumbing.
3. Hashing/encoding a global identifier cannot be claimed as unlinkability without scoped derivation semantics.
4. A verifier receives no more lineage/subject information than required by the revocation predicate and declared evidence profile.
5. Ancestor-revocation transitivity remains provable even when full ancestry is not disclosed.
6. Pairwise/purpose-scoped references preserve the authority and revocation semantics of the source lineage without minting new authority.
7. Mapping authorities are explicit; gateways/Exchange Plane do not become universal reverse directories by routing traffic.
8. Revocation-currentness floors remain domain-qualified and do not create a global subject identity.
9. Group/bulk status structures do not claim herd privacy without a qualified effective anonymity set.
10. Status lookup endpoint, timing, partition and refresh behavior are included in the privacy threat model where observable.
11. Cached/offline status evidence remains bounded by explicit revocation-currentness horizons.
12. Expired or unavailable privacy-preserving status evidence yields explicit unresolved/unknown/revalidation behavior, never fabricated non-revocation.
13. Privacy guarantees name observer sets, collusion assumptions, contexts and correlation scope.
14. Dedup/effect identity requirements remain separate from subject/revocation identity and use the narrowest justified scope.
15. One-time/unlinkable presentation does not weaken retry, replay, idempotency or fencing obligations for effects.
16. Exchange envelope metadata cannot silently re-link presentations that the credential/evidence layer intentionally separates.
17. Trace/correlation IDs are not reused as authority or revocation identity unless explicitly contracted.
18. Cross-tenant/trust-domain status aggregation cannot merge authority domains or leak membership merely for cache efficiency.
19. Privacy-preserving revocation remains compatible with autonomous runtime operation within declared local evidence closure.
20. Offline autonomy cannot extend revocation authority beyond the declared currentness horizon.
21. Historical audit witnesses remain privacy-minimized and cannot be reused as live credentials.
22. Exceptional correlation/de-anonymization authority, if present, is separately governed, auditable and purpose-bounded.
23. Transport/provider substitution preserves declared correlation scope or exposes a qualified privacy downgrade.
24. Unsupported privacy semantics result in explicit incompatibility/lossiness, never fabricated unlinkability.

## 6. Adversarial cases

1. Every credential uses a globally stable revocation UUID that follows it across capabilities.
2. The UUID is SHA-256 hashed and incorrectly marketed as unlinkable.
3. Credential proof is unlinkable, but verifier performs a unique per-credential issuer callback on every use.
4. Tenant receives its own tiny status list, making list identity a tenant fingerprint.
5. Shared list is large, but a unique refresh cadence reveals the workflow execution time.
6. Gateway logs pairwise refs plus a universal source ref and becomes a global reverse directory.
7. Exchange envelope carries a stable correlation ID that defeats credential unlinkability.
8. Trace ID is treated as identity proof during revocation reconciliation.
9. Adapter cannot express a purpose-scoped ref and replaces it with a global lineage ID.
10. Full ancestor chain is sent to every verifier although only a non-revocation predicate was required.
11. Accumulator/status commitment verifies integrity but stale currentness is mislabeled as non-revoked.
12. Runtime remains effectful after offline revocation horizon expires to avoid privacy-leaking refresh.
13. Cache miss triggers synchronous issuer lookup exactly at sensitive business action time.
14. Two colluding verifiers combine stable status indices to correlate a holder across contexts.
15. Cross-tenant list optimization exposes that two tenants share the same rare credential population.
16. Pairwise mapping mediator is compromised and all verifier mappings are recoverable from one global table.
17. Revocation floor is globally monotonic, so implementation incorrectly treats it as global subject revision.
18. One-time presentation is replayed into a side-effecting endpoint without effect anti-replay controls.
19. Privacy layer suppresses `ANCESTOR_UNRESOLVED` and returns `not revoked` because it cannot query privately.
20. Historical audit witness includes unnecessary business payload and becomes a permanent tracking record.
21. Exceptional abuse-investigation capability is silently available to routine gateways.
22. Provider migration changes from bulk cached status to per-subject online checks without declaring privacy downgrade.
23. Status service outage is converted to allow because fail-closed would reduce availability.
24. Builder/central privacy service becomes mandatory for every runtime check, violating published-runtime autonomy.

## 7. Portability / exit path

The hypothesis is implementation-independent. It does not require Bitstring Status List, Privacy Pass, anonymous credentials, accumulators, zero-knowledge proofs, BBS, Idemix, a centralized revocation service, a broker, service mesh, shared database or global identity provider.

Any future realization must preserve:

- purpose-bounded correlation rather than accidental global identity continuity;
- ancestor-revocation transitivity without mandatory full ancestry disclosure where the selected mechanism claims privacy;
- explicit currentness/retention semantics independent of unlinkability;
- offline/autonomous verification only within declared evidence horizons;
- privacy-qualified envelope metadata and transport/provider portability;
- explicit lossiness/incompatibility when a provider cannot preserve the declared privacy profile.

## 8. Deduplication against existing G4 research

This round does not reopen general evidence privacy, anonymous budget conservation, issuer accountability, offline security floors or delegation compaction. It adds the missing intersection: **revocation lineage itself can become a correlation surface**. The material delta is the requirement to preserve ancestor-revocation semantics while bounding equality/linkability of revocation evidence and its access patterns.

## 9. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next high-value gap is **privacy-preserving revocation under multi-issuer / multi-authority lineage composition**: how a descendant whose authority depends on multiple independently administered revocation domains proves non-defeat/currentness without revealing a stable cross-domain join key, how partial status availability is represented, and how colluding issuers/verifiers affect the privacy and authority guarantees without introducing a synthetic global revocation oracle.

No implementation, provider, cryptographic construction or architecture binding is authorized by this research.