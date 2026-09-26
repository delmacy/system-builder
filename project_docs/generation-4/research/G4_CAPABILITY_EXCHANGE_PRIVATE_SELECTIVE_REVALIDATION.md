# G4 — Privacy-Preserving Selective Revalidation after Hidden Dependency Change

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can a runtime selectively requalify minimized assurance proofs after a hidden trust-root, provider, profile, floor, revocation or qualification dependency changes, without revealing the hidden dependency graph to consumers, without introducing a stable global revalidation handle, without O(N) disclosure/fan-out, and without making the Exchange Plane a central assurance oracle?

This document extends the existing G4 work on assurance-proof minimization, privacy-preserving evidence federation, distributed guarantee-evidence caching, revocation privacy, cross-domain floors and mixed-profile assurance composition. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature specifications and papers reviewed:

- W3C Bitstring Status List v1.0, Recommendation 15 May 2025: compact status publication, privacy-oriented group status, cacheability and local verification rather than mandatory per-subject callbacks.
- W3C Data Integrity BBS Cryptosuites v1.0, current Candidate Recommendation in September 2026: selective disclosure, unlinkable derived proofs and credential-bound pseudonyms whose linkability can be scoped by domain.
- W3C Threat Model for Decentralized Credentials, Draft Note 29 May 2026: verifiability, minimization and unlinkability interact; revocation/status checking can itself create correlation.
- IETF RFC 9576/9577/9578 Privacy Pass architecture, HTTP authentication and issuance protocols: issuance/redemption context separation, public/private verification choices, replay/timing/cross-context linkability threats and explicit observer assumptions.
- Camenisch/Lysyanskaya, *Efficient Revocation of Anonymous Group Membership* (2001): dynamic accumulators demonstrate that short membership witnesses can be updated as a set changes and that membership can be proven without revealing the accumulated value directly.
- Jaques/Lodder/Montgomery, *ALLOSAUR* (2022, revised 2024): accumulator-based anonymous-credential revocation shows that witness update cost, interaction patterns and anonymity are coupled; privacy can be lost by update mechanisms even when presentation proofs are anonymous.
- Existing G4 artifacts, especially `G4_CAPABILITY_EXCHANGE_ASSURANCE_PROOF_MINIMIZATION_PRIVACY.md`, `G4_CAPABILITY_EXCHANGE_GUARANTEE_EVIDENCE_CACHE_INVALIDATION.md`, `G4_CAPABILITY_EXCHANGE_REVOCATION_PRIVACY_UNLINKABILITY.md`, `G4_CAPABILITY_EXCHANGE_CROSS_DOMAIN_FLOOR_DELEGATED_REVOCATION.md`, `G4_CAPABILITY_EXCHANGE_MIXED_PROFILE_ASSURANCE_COMPOSITION.md` and `G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_EVIDENCE_FEDERATION.md`.

These sources are architectural evidence only. No accumulator, Bitstring Status List, BBS, Privacy Pass, anonymous-credential system, zero-knowledge proof system, status service, broker or identity provider is selected.

## 3. Material findings

### 3.1 Selective revalidation is a private dependency-membership problem before it is a cache problem

The previous round established that a minimized presentation may hide the dependencies used to justify a root predicate while the producer/runtime retains private lineage for later revalidation. When dependency D changes, the first question is not "which cache entries share D?" globally, but:

`Does proof P materially depend on changed dependency D under the named root predicate/profile?`

That membership test can be implemented in many ways, but its semantics must remain capability/runtime-owned. The Exchange Plane may distribute change evidence; it must not become the owner of the hidden proof graph.

`Selective revalidation != central reverse-index authority`.

### 3.2 A stable global revalidation handle defeats disclosure minimization

A globally stable dependency ID, proof ID or commitment reused across tenants/consumers allows observers to reconstruct relationships even if the proof body is unlinkable.

`Hidden dependency graph + globally stable invalidation key != hidden dependency graph`.

Revalidation handles therefore require declared correlation scope. Equality useful inside one runtime, tenant or qualification domain must not silently become equality across all domains.

### 3.3 Change notification and proof defeat are distinct claims

A notification can say that trust root R, provider qualification Q or floor F changed. It does not prove that every proof depending on that domain is defeated.

`Dependency changed != every dependent proof invalid`.

The runtime evaluates whether the changed dimension is material to the root predicate and whether the new state still satisfies its requirement. This preserves the mixed-profile rule that degradation propagates selectively rather than by global invalidation.

### 3.4 Revalidation can use monotonic floors without revealing subject identity

For domains with monotonic qualification/revocation floors, a runtime may retain a local minimum acceptable floor and compare hidden proof lineage against it without disclosing the subject or complete ancestry to the publisher.

`Floor advancement != per-subject callback requirement`.

Bitstring Status List and accumulator research provide evidence that status/revocation can be distributed in bulk or represented compactly. The implementation-independent lesson is that currentness can sometimes be refreshed independently of subject-specific online queries.

### 3.5 Bulk status distribution improves privacy only when the anonymity set is operationally real

A large list or accumulator does not guarantee privacy if each tenant/provider uses a unique endpoint, tiny cohort, distinctive refresh cadence or rare profile.

`Bulk representation != effective herd privacy`.

Privacy analysis includes endpoint identity, cohort size, timing, cache misses, transport metadata and refresh behavior.

### 3.6 Witness update channels can leak what presentations hide

ALLOSAUR and prior accumulator work make an important failure mode explicit: anonymous validity proofs can still require witness updates after revocation, and the update mechanism itself can become the correlation surface.

`Unlinkable presentation != unlinkable witness refresh`.

A G4 revalidation profile must therefore qualify both proof disclosure and update-channel disclosure. Moving correlation from verification time to refresh time is not a privacy solution.

### 3.7 Revalidation evidence should be separable from business identity

A runtime often needs to know only that a hidden premise remains in an admissible set or above a floor, not the business identity associated with that premise.

`Proof dependency membership != business-subject identity`.

Where technology permits, a scoped commitment/membership witness can support this separation. Where it does not, the privacy downgrade must be explicit rather than hidden behind a generic `verified` result.

### 3.8 Non-membership/defeat evidence is as important as membership evidence

A system that can prove only "still valid" but cannot represent revocation, conflict, below-retention or unknown state risks false strengthening.

`Unable to refresh membership != proof of revocation`.

`No defeat observed != proof no defeat exists`.

The revalidation disposition must preserve `SUPPORTED`, `DEFEATED`, `CONTESTED`, `UNKNOWN`, `CURRENTNESS_EXPIRED`, `BELOW_RETENTION` and similar qualified states when material.

### 3.9 Offline revalidation is bounded by a pre-positioned evidence horizon

A runtime can remain autonomous when it has locally sufficient status/floor/trust material. That autonomy ends when the relevant currentness horizon expires.

`Offline verification available != offline currentness infinite`.

The contract may then require read-only behavior, queue-without-effect, revalidation-before-effect or fail-closed depending on the protected invariant. Privacy does not authorize extending authority past the declared horizon merely to avoid an online callback.

### 3.10 Push invalidation is an optimization, not a correctness foundation

Broadcast invalidation can reduce stale windows but delivery cannot be assumed universal under partitions, offline runtimes or broker failure.

`Invalidation published != invalidation observed`.

Correctness therefore needs pull/bulk/floor/currentness mechanisms or another locally checkable rule at reuse/effect time. Push remains operational acceleration.

### 3.11 Revalidation should be lazy where safety permits and eager where the invariant requires it

A dependency change with millions of derived proofs should not automatically cause O(N) immediate recomputation. Proofs can be marked logically stale by a domain floor/generation and requalified when reused, except where a protected invariant requires proactive fencing or settlement.

`Logical defeat frontier != synchronous per-proof rewrite`.

This preserves the earlier G4 anti-stampede and derived-lineage findings while adding privacy: the frontier itself must not be a global identity handle.

### 3.12 Private dependency commitments need rotation and scope lifecycle

Even a pseudonymous/scoped commitment can become identifying if reused indefinitely. Revalidation therefore needs lifecycle semantics for commitment rotation, overlap and retirement.

`Scoped today != unlinkable forever`.

Rotation must preserve the ability to discover materially affected local proofs without publishing a cross-generation mapping that recreates a global graph.

### 3.13 Pairwise/domain pseudonyms provide a useful boundary, not a required mechanism

W3C BBS pseudonym work demonstrates the principle that stable linkability can be intentionally bounded to a verifier/domain while pseudonyms in different domains remain unlinkable.

The G4 generalization is:

`Correlation needed for revalidation in scope S != permission for correlation outside S`.

This may apply to revalidation handles, cache keys, provider refs and evidence commitments even if the eventual implementation uses no BBS credential.

### 3.14 Publicly verifiable and privately verifiable revalidation have different portability/privacy trade-offs

Privacy Pass distinguishes public and private verification modes. For G4, the transferable lesson is that verifier independence and privacy/trust concentration are separate dimensions.

`Public verifiability != better privacy by definition`.

`Private verification != portable third-party auditability by definition`.

A revalidation profile must expose which verifier/trust assumptions it requires rather than hiding them behind one assurance scalar.

### 3.15 Revalidation must not silently strengthen a minimized root proof

If a hidden child changes from one qualified provider/profile to another, successful revalidation of that child does not permit the root to claim dimensions it never proved.

`Child refreshed != parent assurance expanded`.

The parent remains bounded by the original root predicate, disclosure profile and proof rule unless an explicit new admission/re-proof occurs.

### 3.16 Privacy-preserving revalidation still requires immutable semantic identity

A verifier may not learn the hidden dependency identity, but it must know what predicate/profile semantics the refreshed result satisfies.

`Hidden witness identity != ambiguous proof semantics`.

Otherwise an adapter can swap one meaning for another while claiming that privacy prevents inspection.

### 3.17 Provider substitution requires requalification of provider-specific hidden premises

Changing provider/driver/transport may preserve a business predicate while changing trust, status, revocation, timing or privacy guarantees.

`Same interface after substitution != same hidden assurance premises`.

Provider-specific hidden dependencies must be requalified; immutable independent evidence may remain reusable when justified. A driver cannot fabricate unsupported privacy/currentness semantics.

### 3.18 Revalidation routing must not reveal the dependency through topology

Sending every proof refresh to a provider-specific endpoint can disclose the hidden provider even if the request body contains no identifier.

`Opaque payload != opaque dependency topology`.

Batching, caching, relays or other mediation may reduce topology leakage, but any mediator must not become canonical authority or a permanent cross-domain correlation service.

### 3.19 Timing and negative-result behavior can deanonymize hidden dependencies

Rare revocations, immediate cache misses, distinct retry patterns or error codes can reveal which hidden dependency changed.

`Hidden identifier != hidden state transition`.

Privacy analysis therefore includes timing, result cardinality, error taxonomy and retry/backoff behavior. Normalizing mechanism must not normalize away semantically material `DEFEATED/UNKNOWN/CONTESTED` states.

### 3.20 Revalidation budgets are both operational and privacy controls

Unlimited refresh fan-out creates load amplification and a high-resolution activity side channel. Attempt/time/concurrency/cost budgets should therefore apply to revalidation, while exhaustion remains explicit evidence rather than authorization.

`Revalidation budget exhausted != proof remains current`.

The runtime may degrade according to the operation contract; it cannot extend freshness by operational convenience.

### 3.21 Audit escalation and routine revalidation may use different disclosure profiles

Routine revalidation can operate on scoped commitments/status material, while an authorized audit may reveal deeper lineage when necessary.

`Routine revalidation privacy != audit evidence deletion`.

The private witness closure must remain sufficient for the declared audit/recovery obligations or explicitly record that a later proof dimension is no longer available.

### 3.22 Revalidation results require anti-rollback semantics

A runtime that has learned a higher revocation/security/profile floor cannot accept an older bulk status snapshot merely because it verifies cryptographically.

`Older valid status material != permission to roll back local floor`.

This applies across restart, failover, snapshot restore and provider migration. Privacy-preserving status distribution cannot weaken monotonic local security observations.

### 3.23 No single revalidation mechanism fits every hidden dependency class

Trust-root rotation, provider qualification, revocation, schema/profile retirement, settlement and business-currentness have different authorities and temporal semantics.

`One privacy mechanism != one semantic revalidation mechanism`.

The Shared Semantic Kernel may carry structural currentness/floor/evidence refs, but domain-specific satisfaction rules remain owned by the capability/authority domain.

### 3.24 Exchange Plane distributes change/evidence semantics; capability owns requalification

The logical Exchange Plane may route change notices, bulk status artifacts, scoped commitments and revalidation evidence. It does not decide whether a business operation remains admissible.

`Revalidation evidence available != business operation authorized`.

This preserves `Exchange Plane owns exchange semantics; capability owns business semantics` and avoids a central assurance oracle.

## 4. Candidate research vocabulary

Research vocabulary only; no product schema is authorized.

- `HiddenDependencyRef` — private/scoped reference to a premise used by a minimized proof.
- `RevalidationScopeRef` — correlation domain within which equality/linkability is intentionally permitted.
- `DependencyChangeRef` — immutable identity of a qualified dependency-state change without implying global subject identity.
- `RevalidationFloor` — domain-qualified minimum status/security/profile state required for reuse.
- `RevalidationWitness` — evidence that a hidden premise satisfies or fails the named requirement at a declared frontier/horizon.
- `PrivateDependencyIndex` — runtime/capability-local derived structure for locating materially dependent proofs; never canonical business ownership.
- `RevalidationDisposition` — qualified result such as `SUPPORTED`, `DEFEATED`, `CONTESTED`, `UNKNOWN`, `CURRENTNESS_EXPIRED`, `BELOW_RETENTION`.
- `WitnessRefreshProfileRef` — immutable semantics for how status/witness material may be refreshed and what privacy/currentness guarantees apply.
- `CorrelationEpoch` — bounded generation for scoped handles/commitments so linkability is not silently perpetual.
- `RevalidationBudget` — attempt/time/concurrency/cost bounds for refresh/requalification work.

## 5. Candidate proof obligations

1. Hidden proof dependencies remain discoverable for local revalidation without requiring disclosure of the full dependency graph to consumers.
2. Revalidation handles/commitments have explicit correlation scope and do not become global subject/evidence identifiers by convenience.
3. A dependency change invalidates or lowers only proofs whose material cut sets depend on the changed dimension.
4. Change notification is never treated as proof that every dependent guarantee is defeated.
5. Domain-qualified floors remain independent; no global revision is fabricated for revalidation convenience.
6. Bulk/status distribution privacy is evaluated using effective cohort, endpoint, timing and cache behavior, not theoretical list capacity alone.
7. Presentation unlinkability and witness-refresh unlinkability are separately qualified.
8. Revalidation can prove admissible membership/non-defeat without disclosing business identity when the selected mechanism supports that property; otherwise the privacy downgrade is explicit.
9. Missing refresh evidence remains `UNKNOWN/CURRENTNESS_EXPIRED` as appropriate and is never relabeled as revoked or valid.
10. Material defeat/non-membership/conflict evidence cannot be suppressed by privacy minimization.
11. Offline revalidation is bounded by locally available evidence and declared currentness horizons.
12. Push invalidation is an optimization; correctness does not depend on every runtime receiving every notification.
13. O(N) eager revalidation is not required when a qualified logical floor/frontier can safely defer work until reuse.
14. Proactive fencing/revalidation remains required where the protected invariant cannot tolerate lazy qualification.
15. Scoped commitments/pseudonyms have rotation/retirement semantics and do not become indefinitely stable tracking handles.
16. Public/private verifier modes explicitly expose portability, trust concentration and auditability differences.
17. Refreshing one child premise cannot strengthen unrelated parent assurance dimensions.
18. Hidden witness identity never permits ambiguity about the immutable predicate/profile semantics being revalidated.
19. Provider substitution requalifies provider-specific hidden premises without forcing revalidation of demonstrably independent evidence.
20. Routing/topology, timing, error behavior and retry patterns are included in revalidation privacy analysis.
21. Revalidation attempt/time/concurrency/cost budgets cannot extend evidence freshness when exhausted.
22. Routine private revalidation and authorized audit escalation can use different disclosure profiles while preserving declared future auditability.
23. Locally observed monotonic floors survive restart/failover/restore/provider migration and reject older-but-valid status material where the domain requires monotonicity.
24. Exchange Plane may distribute revalidation evidence but never becomes the canonical assurance, identity, revocation or business-authorization oracle.

## 6. Adversarial cases

1. Every minimized proof contains the same global `dependencyId`, making the hidden graph trivially joinable.
2. A hash of the global dependency ID is called anonymous although equality remains globally visible.
3. Revocation publisher receives one subject-specific callback per protected effect and reconstructs workflow activity.
4. BBS/ZK-like presentation is unlinkable but witness refresh uses a stable account identifier.
5. A theoretically huge status list contains only one tenant's 12 credentials and is called herd-private.
6. Each tenant receives a unique status-list URL, defeating cross-tenant anonymity.
7. Push invalidation is lost during partition; runtime treats lack of notification as proof of currentness.
8. Revalidation endpoint is unreachable; middleware converts `UNKNOWN` to `not revoked`.
9. Revalidation endpoint is unreachable; middleware converts `UNKNOWN` to `revoked`, destroying availability and history semantics.
10. Trust-root change causes a global cache flush although only a small material lineage depended on that root.
11. Lazy revalidation is used for a non-fenceable irreversible effect whose invariant requires proactive exclusion.
12. A global conflict/revalidation epoch becomes a synthetic platform revision and central oracle.
13. Pairwise/scoped handle is reused forever and becomes a durable tracking identifier.
14. Handle rotation publishes an explicit old->new map globally, recreating permanent correlation.
15. Provider migration keeps the same interface but loses anonymous/bulk status semantics; adapter still claims equivalent privacy.
16. A child proof is refreshed and the parent is relabeled with stronger settlement/origin dimensions that were never re-proven.
17. Privacy layer hides the dependency profile so thoroughly that verifier cannot know which semantic predicate was checked.
18. Provider-specific routing reveals hidden provider identity despite an opaque request body.
19. Rare negative result timing identifies the hidden dependency even though no identifier is disclosed.
20. Unlimited revalidation retries create a load storm and a high-resolution side channel.
21. Revalidation budget expires and cache silently extends TTL to preserve availability.
22. Snapshot restore reintroduces an older status floor and resurrects a previously defeated proof.
23. Exchange Plane stores every private dependency reverse mapping to optimize refresh and becomes a global identity/evidence graph.
24. One generic accumulator/status mechanism is used for settlement, trust-root qualification, business currentness and revocation, fabricating semantic equivalence across domains.

## 7. Portability / exit path

The hypothesis is implementation-independent. It does not require accumulators, Bitstring Status List, BBS, Privacy Pass, SD-JWT, a VC stack, a broker, a service mesh, a central status server or a particular cryptographic primitive.

Any future realization must preserve:

- capability-local ownership of hidden dependency lineage;
- correlation-scoped rather than globally stable revalidation identity;
- domain-qualified floors/currentness and explicit negative/unknown states;
- selective rather than universal degradation after dependency change;
- bounded offline autonomy without perpetual stale authority;
- transport/provider replaceability without fabricated privacy/currentness equivalence;
- no mandatory central assurance/revocation oracle for autonomous runtimes.

A future provider/technology qualification must compare at least privacy leakage, update complexity, witness/status size, verifier cost, offline capability, currentness semantics, revocation latency, correlated-failure assumptions, deployment/debug burden and exit/migration behavior.

## 8. Deduplication against existing G4 research

This round does not reopen generic selective disclosure, distributed cache invalidation, revocation semantics, cross-domain floors, assurance composition or provider substitution.

Material delta is specifically the intersection:

`hidden dependency lineage x selective revalidation x privacy-preserving change detection x bounded offline currentness x non-centralized ownership`.

Previously established rules remain authoritative, including:

- `Invalidation sent != invalidation observed everywhere`;
- `Cache hit != current/admissible evidence`;
- `Consumer-minimized presentation != producer-forgotten dependency lineage`;
- `Selective disclosure != unlinkability`;
- `Cross-domain floor composition != global revision`;
- `Dependency changed != global cache flush`;
- `Exchange Plane owns exchange semantics; capability owns business semantics`.

## 9. Maturity / remaining gaps

Maturity: `RESEARCH_ACTIVE / MATERIAL_DELTA / NOT_SATURATED`.

This round materially clarifies how minimized proofs can remain selectively revalidatable without exposing the hidden graph or introducing a central oracle. The boundary between privacy-preserving presentation and privacy-preserving witness refresh is now explicit, as are scoped revalidation identity, logical invalidation frontiers and bounded offline requalification.

Highest-value remaining gap:

**private revalidation conflict and equivocation across independently cached status views** — research how two autonomous runtimes detect/reconcile inconsistent but individually valid bulk-status/floor views, how non-equivocation/transparency/witness mechanisms interact with privacy and offline operation, and how to avoid turning a status log, witness quorum or Exchange Plane into global business authority.

## 10. Source notes

Primary references consulted in this round:

- W3C Bitstring Status List v1.0: https://www.w3.org/TR/vc-bitstring-status-list/
- W3C Data Integrity BBS Cryptosuites v1.0: https://www.w3.org/TR/vc-di-bbs/
- W3C Threat Model for Decentralized Credentials: https://www.w3.org/TR/2026/DNOTE-threat-model-decentralized-credentials-20260529/
- RFC 9576 Privacy Pass Architecture: https://www.rfc-editor.org/rfc/rfc9576.html
- RFC 9577 Privacy Pass HTTP Authentication Scheme: https://www.rfc-editor.org/rfc/rfc9577.html
- RFC 9578 Privacy Pass Issuance Protocols: https://www.rfc-editor.org/rfc/rfc9578.html
- Camenisch/Lysyanskaya, Efficient Revocation of Anonymous Group Membership: https://eprint.iacr.org/2001/113
- Jaques/Lodder/Montgomery, ALLOSAUR: https://eprint.iacr.org/2022/1362
