# G4 — Multi-Authority Revocation Privacy Composition

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can an interaction whose admissibility depends on authority/evidence from multiple independently administered issuers or revocation domains prove non-defeat and sufficient currentness without inventing a synthetic global revocation oracle, exposing a stable cross-domain join key, or silently converting partial status availability into success?

This document extends `G4_CAPABILITY_EXCHANGE_REVOCATION_PRIVACY_UNLINKABILITY.md`, `G4_CAPABILITY_EXCHANGE_DELEGATION_CHAIN_COMPACTION_REVOCATION_DISCOVERY.md`, `G4_CAPABILITY_EXCHANGE_CROSS_DOMAIN_FLOOR_DELEGATED_REVOCATION.md`, and the existing multi-domain evidence-composition research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, papers and mature-system evidence reviewed:

- W3C Bitstring Status List v1.0 Recommendation (2025): group-oriented status publication, privacy/correlation limits, malicious issuer/verifier collusion cases, and the fact that unique status lists/keys can defeat group privacy.
- IETF OAuth Token Status List draft-21 (2026): bulk status for many referenced tokens, caching/offline support, reduced issuer interaction and herd-privacy rationale.
- IETF SD-JWT VC draft-19 (2026): issuer-bound credential/status processing as a contemporary interoperability benchmark, not a G4 technology selection.
- Hébant & Pointcheval, *Traceable Constant-Size Multi-Authority Credentials* (SCN 2022): multi-authority anonymous credentials under malicious issuers/adaptive corruption and issuer/user collusion assumptions.
- Mir et al., *Aggregate Signatures with Versatile Randomization and Issuer-Hiding Multi-Authority Anonymous Credentials* (ACM CCS): issuer combinations themselves can identify users; issuer-hiding multi-authority credentials demonstrate that multi-authority composition need not imply disclosure of the exact issuer set.
- Sonnino et al., *Coconut* (2018): threshold issuance, selective disclosure, rerandomization and unlinkable presentations under partially malicious/offline authorities.
- SD-BLS (2024 preprint): threshold revocation distributed among multiple revocation issuers as evidence that revocation authority itself can be threshold-composed, while remaining a mechanism candidate rather than a selected architecture.
- Prior G4 multi-domain evidence, privacy/collusion, issuer-accountability, revocation-floor, delegation and lineage-privacy artifacts.

These sources are benchmark/failure evidence only. No credential, accumulator, threshold, status-list or cryptographic construction is selected.

## 3. Material findings

### 3.1 Multi-authority admissibility is a qualified composition, not a global status bit

Suppose an operation depends on authority from domains `A`, `B`, and `C`. Each domain owns its own semantics, revocation floor, retention/currentness horizon and evidence format.

`A current + B current + C current != one global current revision`.

A root guarantee therefore retains a vector of domain-qualified revocation/currentness claims and the declared composition relation between them.

Candidate research relations remain `ALL_OF`, `ANY_QUALIFIED_OF`, `THRESHOLD_QUALIFIED`, `DELEGATED_FROM`, and domain-specific alternatives. They are vocabulary, not a DSL/schema commitment.

### 3.2 Cross-domain join keys are privacy-bearing authority metadata

A naive implementation can assign one global lineage or subject identifier so every issuer can locate the same holder. That simplifies joins but collapses privacy domains.

`Easy multi-domain join != legitimate global identity`.

`Same subject across issuers != permission to expose one stable cross-domain join key`.

Composition evidence should prove only the equality/relationship predicates required by the root contract. If subject equality is not required, the verifier must not infer it merely because multiple authorities contribute evidence.

### 3.3 Issuer-set disclosure can itself identify the holder

Multi-authority anonymous-credential research shows that the combination of issuers may be identifying even when individual presentations are otherwise unlinkable.

`Hidden subject identifier + unique issuer combination != unlinkable presentation`.

Therefore the privacy profile must include `IssuerSetDisclosure`: whether exact issuer identities, an allowed issuer class, a threshold property, or no issuer identity beyond policy satisfaction is exposed.

This is implementation-independent: a future realization may disclose exact issuers when required, but that is a declared privacy cost rather than invisible plumbing.

### 3.4 Revocation-domain composition and issuer composition are not necessarily identical

An issuer may delegate status publication to a separate provider; multiple issuers may share a status infrastructure without sharing authority semantics; threshold issuers may jointly issue while revocation follows another governance rule.

`Credential issuer set != revocation authority set != status distribution topology`.

The Exchange Plane must not infer revocation ownership from endpoint/broker/list co-location.

### 3.5 Partial status availability must remain a vector, not collapse to boolean success

For three required domains, a runtime may know:

- A: `CURRENT / NOT_DEFEATED`;
- B: `CURRENTNESS_HORIZON_EXPIRED`;
- C: `STATUS_SOURCE_UNREACHABLE` with still-valid bounded local evidence.

The correct root disposition depends on the composition policy and operation. It is not automatically allow or deny.

`Some domains current != all required authority current`.

`Status unavailable != revoked != not revoked`.

Candidate dispositions include `SATISFIED`, `PARTIALLY_QUALIFIED`, `DOMAIN_UNRESOLVED`, `BELOW_RETENTION`, `CURRENTNESS_EXPIRED`, `DEFEATED`, and explicit `UNKNOWN`.

### 3.6 `ALL_OF`, alternatives and thresholds have different privacy leakage

An `ALL_OF(A,B,C)` policy may require evidence from every domain. `ANY_QUALIFIED_OF(A,B,C)` may reveal which issuer satisfied the request unless the proof mechanism hides that choice. A threshold policy can leak the selected subset even when it hides subject identity.

`Threshold satisfied != threshold membership private`.

`Alternative issuer accepted != selected issuer must be disclosed`.

Privacy guarantees therefore name both authority semantics and witness/issuer-set disclosure semantics.

### 3.7 Threshold revocation is not equivalent to independent-domain revocation

A threshold revocation authority means several parties jointly decide or attest one revocation proposition. Independent domains mean several distinct propositions constrain one root operation.

`k-of-n revocation authority != k-of-n independent business authorities`.

This prevents a future adapter from translating one model into the other merely because both contain a numeric threshold.

### 3.8 Bulk status publication improves access-pattern privacy but does not compose domains automatically

W3C/IETF status-list mechanisms demonstrate that many token statuses can be distributed together and cached/offline, reducing per-token issuer callbacks. But combining lists from multiple issuers into one cache or mirror does not merge their authority domains.

`Shared status distributor != shared revocation authority`.

`Bulk cache union != semantic floor union`.

Each status artifact retains issuer/revocation-domain provenance, currentness and policy identity.

### 3.9 A composite verifier can become a correlation oracle

A service that receives stable references from A, B and C can reconstruct the very cross-domain join that the underlying credentials attempted to hide.

`Privacy-preserving component proofs != privacy-preserving composition service`.

The Exchange Plane may transport qualified evidence but must not become a universal reverse directory. A composite verifier/gateway needs purpose-bounded correlation authority and data minimization just like any other boundary.

### 3.10 Collusion assumptions must be explicit and combinatorial

W3C status-list guidance explicitly notes malicious issuer/verifier collusion as a privacy threat. Multi-authority research likewise models malicious/corrupt issuers.

For G4, a privacy claim must state which coalitions it tolerates, for example:

- verifier alone;
- one issuer + verifier;
- up to `t` of `n` authorities;
- status provider + gateway;
- Exchange Plane observer + one authority.

`Unlinkable against each party independently != unlinkable against their coalition`.

A provider cannot advertise generic `unlinkable=true` without naming the observer/collusion model.

### 3.11 Independent floors remain a partial vector through offline operation

An autonomous runtime may hold current A status, older-but-admissible B status and no fresh C status. It must not fabricate a synthetic floor such as `min(A,B,C)` because tokens are not necessarily comparable.

`Cross-domain minimum != meaningful unless a contract defines comparability`.

Offline continuation is allowed only if the root operation's policy permits the exact vector of local evidence horizons.

### 3.12 Domain-local monotonicity survives composition

If the runtime has observed A floor `A5`, receiving A3 later cannot roll A backward even when B advanced from B2 to B9.

`Advance in domain B != permission to regress domain A`.

Composite cache/restore state therefore preserves anti-rollback independently per authority domain.

### 3.13 Multi-authority proof integrity does not imply current revocation state

Aggregate, threshold or anonymous credentials may prove valid issuance and policy satisfaction while revocation/status evidence is stale.

`Multi-authority credential proof valid != every authority currently admissible`.

Issuance proof, issuer-set/privacy proof, revocation currentness and root business authority remain separate evidence dimensions.

### 3.14 Issuer hiding cannot hide authority requirements from the capability contract

A verifier may not learn which issuer supplied a credential, but the capability still needs a normative policy describing the acceptable issuer class/set and required guarantees.

`Issuer hidden from verifier presentation != issuer policy undefined`.

The contract may bind to an immutable issuer-policy profile rather than a revealed issuer identity.

### 3.15 Revocation privacy must survive provider/topology substitution

Moving from cached bulk lists to per-token online queries can materially weaken privacy even if the boolean status result is identical. Moving from issuer-local status to a shared distributor can alter collusion and metadata exposure assumptions.

`Same revocation result != same privacy guarantee`.

Provider/transport substitution therefore requalifies privacy/access-pattern/collusion dimensions as well as currentness and availability.

### 3.16 No synthetic global revocation oracle is required

The root runtime can synthesize admissibility from immutable composition policy plus locally sufficient, domain-qualified evidence. It may fetch or cache evidence through different paths.

`Distributed evidence composition != central authorization/revocation service`.

The Exchange Plane can carry evidence and qualification metadata but does not become canonical owner of issuer relationships, business authority or revocation truth.

## 4. Candidate research vocabulary

Research vocabulary only; no schema is authorized.

- `RevocationDomainRef` — identity of an independently governed revocation semantics/floor domain.
- `AuthorityCompositionPolicyRef` — immutable reference to how multiple authority domains constrain one root guarantee.
- `IssuerDisclosureProfile` — what exact issuer/set/class/threshold information may be exposed.
- `CompositeRevocationEvidence` — qualified vector of per-domain status/currentness evidence plus composition proof/outcome.
- `DomainRevocationDisposition` — domain-local result such as current/not-defeated, defeated, unresolved, below-retention or expired.
- `CoalitionPrivacyProfile` — observer/collusion sets under which unlinkability/correlation claims are made.
- `CrossDomainEqualityProof` — evidence for a required relation across domains without implying a reusable global join key.
- `StatusDistributionRef` — provenance of a status artifact/distributor, explicitly distinct from revocation authority ownership.

## 5. Candidate proof obligations

1. Each revocation/currentness token is interpreted only within its declared revocation domain.
2. Composite admissibility never invents a global revision/floor from incomparable domain-local tokens.
3. Cross-domain subject equality is proven only when required by the root contract.
4. No stable global join key is introduced solely to simplify multi-authority composition.
5. Exact issuer-set disclosure is minimized according to the declared privacy profile.
6. A unique issuer combination is treated as potentially identifying metadata.
7. Credential issuer, revocation authority and status distributor roles remain explicitly distinct.
8. Partial status availability preserves per-domain dispositions; unresolved is not converted to non-revoked or revoked.
9. `ALL_OF`, alternatives and threshold composition preserve their distinct authority semantics.
10. Threshold authority governance is not silently translated into threshold over independent business domains.
11. Bulk/shared status distribution preserves per-domain provenance, floor and currentness semantics.
12. A composite verifier/gateway does not become an ungoverned cross-domain reverse directory.
13. Privacy claims name tolerated issuer/verifier/status-provider/gateway coalitions.
14. A claim proven against isolated observers is not relabeled as collusion-resistant without evidence.
15. Offline operation evaluates the exact vector of locally available domain evidence against the root policy.
16. Domain-local anti-rollback floors survive cache restore, restart and progress in unrelated domains.
17. Valid multi-authority issuance proof does not substitute for current revocation evidence.
18. Issuer hiding preserves an immutable policy identifying what issuer classes/sets are admissible.
19. Provider/transport/status-distribution substitution requalifies privacy, access-pattern and collusion guarantees.
20. Exchange Plane metadata does not expose a cross-domain join that component proofs intentionally hide.
21. Status cache aggregation cannot merge authority ownership for convenience.
22. Revocation checks remain compatible with autonomous runtimes within declared per-domain horizons.
23. Unsupported multi-domain privacy semantics yield explicit lossiness/incompatibility, never fabricated unlinkability.
24. No Builder or central revocation oracle becomes a mandatory runtime dependency unless a topology explicitly declares that dependency and therefore does not claim autonomous operation for that path.

## 6. Adversarial cases

1. A global subject UUID is required by every issuer merely to join revocation status.
2. The UUID is hashed identically across domains and marketed as privacy-preserving.
3. Credentials hide subject identity but expose a rare three-issuer combination that uniquely identifies the holder.
4. Verifier learns which one of several alternative issuers satisfied a policy although that disclosure was unnecessary.
5. `2-of-3` threshold revocation is confused with two independent business authorities both being required.
6. A shared status CDN is treated as the semantic revocation owner for all issuers.
7. Status artifact loses issuer/domain provenance after cache normalization.
8. Domain A status is current, B expired, and middleware reports composite `not revoked`.
9. Status source unreachable is converted to revoked for convenience, destroying availability semantics.
10. Status source unreachable is converted to not-revoked, destroying security semantics.
11. Composite gateway logs A/B/C pairwise refs and reconstructs a global identity graph.
12. Exchange trace ID links otherwise issuer-hidden presentations.
13. Issuer A and verifier collude and recover cross-domain presentation linkage that the advertised privacy profile did not model.
14. Two individually honest-looking status providers collude through shared telemetry identifiers.
15. Runtime restores A3 after observing A5 because B's floor is newer numerically.
16. Implementation computes `min(A5,B9,C2)` despite incomparable domain semantics.
17. Aggregate credential verifies but one issuer's revocation evidence is below retention.
18. Issuer-hidden proof accepts an issuer outside the immutable admissible issuer policy.
19. Provider migration replaces bulk cached status with per-token callbacks and silently leaks usage timing.
20. One tenant's rare issuer set becomes a stable tenant fingerprint.
21. Adapter translates threshold issuer proof into `ALL_OF` without preserving threshold semantics.
22. Status mirror outage forces every runtime to contact all issuers synchronously, causing a privacy and availability storm.
23. Builder/central privacy service becomes necessary to resolve every multi-domain join.
24. Historical audit stores full issuer/subject join material although only a qualified composition outcome was needed.

## 7. Portability / exit path

This hypothesis does not require W3C Bitstring Status List, IETF Token Status List, SD-JWT VC, Coconut, BBS/BLS, aggregate signatures, accumulators, zero-knowledge proofs, a centralized status provider, a broker, service mesh or shared identity database.

Any future realization must preserve:

- independent revocation-domain ownership and domain-local monotonic floors;
- explicit composition semantics for all/alternative/threshold/delegated authority;
- partial/unresolved status as representable evidence;
- no accidental stable cross-domain join key;
- declared issuer-set disclosure and coalition privacy assumptions;
- autonomous/offline verification only within each required domain's currentness horizon;
- provider/transport portability with explicit privacy/currentness downgrade when equivalence cannot be preserved.

## 8. Deduplication against existing G4 research

This round does not reopen generic multi-domain evidence composition, generic privacy federation, issuer accountability, revocation lineage compaction or single-lineage unlinkability. The material delta is the intersection of **multiple independently governed revocation domains + composition semantics + issuer-set privacy + partial status availability + collusion**. It establishes that multi-authority revocation is a vector/composition problem and that the join itself is a privacy boundary.

## 9. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next high-value gap is **privacy-preserving cross-domain equality/relationship proof lifecycle under rotation and revocation**: when a root contract genuinely requires proving that independently issued evidence refers to the same subject/account/asset or a qualified relationship, determine how that proof survives key/identifier rotation, revocation, offline periods and provider substitution without becoming a permanent cross-domain correlation handle or central identity oracle.

No implementation, provider, cryptographic construction or architecture binding is authorized by this research.