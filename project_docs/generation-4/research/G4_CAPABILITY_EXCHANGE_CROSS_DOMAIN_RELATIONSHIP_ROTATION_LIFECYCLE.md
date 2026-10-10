# G4 — Cross-Domain Equality / Relationship Proof Lifecycle Under Rotation and Revocation

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

When a root capability contract genuinely requires evidence that independently issued claims concern the same subject/account/asset, or a qualified relationship between them, how can that relation survive identifier/key rotation, revocation, offline operation and provider/topology substitution without becoming a permanent cross-domain correlation handle, transferring ownership, or creating a central identity oracle?

This document extends the multi-authority revocation/privacy, revocation unlinkability, delegation/revocation and multi-domain evidence-composition research. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards and mature-system/paper evidence reviewed:

- OpenID Connect Core 1.0 / ITU-T X.1285 (2025): pairwise pseudonymous subject identifiers are sector-scoped, deterministic within the sector, distinct across sectors and non-reversible outside the OP; a sector can intentionally preserve continuity across redirect-domain changes.
- OpenID Connect Dynamic Client Registration: `sector_identifier_uri` governs pairwise-subject scope; `jwks_uri` supports key rotation independently of the subject identifier.
- W3C Controlled Identifiers v1.0 Recommendation (2025): verification-method rotation and revocation are lifecycle operations; historical verification may require time/version-aware resolution; revocation cannot retroactively rewrite previous identifier-document versions.
- W3C DID Core: `alsoKnownAs` is an assertion, not proof of equivalence; reciprocal assertions still do not imply that all information from two identifiers should be merged.
- W3C Verifiable Credentials Data Model v2.0: long-lived subject identifiers create correlation risk; privacy-preserving presentations can combine credentials from multiple issuers without revealing stable subject/credential identifiers when the securing mechanism supports it.
- TNO Binding Type Implementations (2023): same-subject/equality conclusions have mechanism-specific confidence; equality can in some cases be proven over hidden values, while possession/binding evidence does not universally prove identity equivalence.
- Anonymous-credential literature: common hidden attributes can be equality-proven without disclosing the attribute, demonstrating that a relationship predicate need not expose a reusable join key.
- Prior G4 multi-authority revocation privacy, revocation unlinkability, cross-domain floors/delegation, proof/evidence lifecycle and provider-substitution research.

These are evidence/benchmarks only. No OIDC, DID, VC, BBS, ZK, wallet, identity provider or relationship registry is selected.

## 3. Material findings

### 3.1 Equality is a qualified proposition, not identity collapse

A root contract can require `same account`, `same legal subject`, `same device controller`, `asset owned-by subject`, or another relation. These predicates are not interchangeable.

`Equality proof for predicate P != global identity equivalence`.

`Same subject for operation X != permission to merge domain records`.

A relationship proof therefore binds the exact predicate, participating domains, purpose and admissibility context.

### 3.2 A reusable join key is not required to prove equality

Privacy-preserving credential work demonstrates that common hidden values can support equality proofs without disclosure. Therefore G4 must not assume that cross-domain equality requires a stable visible identifier.

`Proof of equality != disclosure of equality witness`.

`Proof of relation != reusable relation handle`.

The verifier may learn only the contract-required relation outcome while the underlying witness remains undisclosed or purpose-scoped.

### 3.3 Pairwise identity continuity is scope-governed

OIDC pairwise subject identifiers deliberately preserve stable recognition inside a sector while producing different identifiers across sectors. The sector itself is therefore privacy-bearing governance, not plumbing.

`Stable within sector != stable across domains`.

`Sector continuity != universal subject continuity`.

A future System Builder realization may use another mechanism, but any pairwise-equivalent primitive needs an explicit correlation scope and authority for widening that scope.

### 3.4 Key rotation and subject/relationship continuity are separate lifecycles

OIDC can rotate signing keys while retaining the same pairwise subject. W3C Controlled Identifiers likewise treats verification-method rotation as replacement of cryptographic material, not automatic replacement of the subject.

`Key rotated != subject changed`.

`Subject continuity != old key remains valid`.

Conversely, a subject identifier can rotate while the signing key remains unchanged. A relationship proof must not bind continuity accidentally to whichever technical identifier happened to be current at issuance.

### 3.5 Rotation requires continuity evidence, not identifier guessing

When identifier `A1` becomes `A2`, a verifier cannot infer continuity merely because metadata is similar. DID Core explicitly warns that `alsoKnownAs` is an assertion and needs independent validation.

`alsoKnownAs asserted != equivalence proven`.

`Similar attributes != same subject proof`.

Candidate continuity evidence may be issuer-governed succession, mutually authorized transition, historical registry evidence, hidden stable witness continuity, or another qualified proof. The mechanism remains open.

### 3.6 Rotation can be privacy-preserving only if the bridge is purpose-scoped

Publishing a permanent public `A1 -> A2` mapping preserves continuity but also preserves correlation forever. A privacy-preserving lifecycle may instead require a bridge visible only to authorized verifiers/purposes or a proof that the new identifier satisfies the required relation without revealing the old identifier.

`Continuity bridge != permission for global correlation`.

`Rotation history available for verification != rotation history public to every observer`.

### 3.7 Revocation of a key, identifier or relation are distinct events

A compromised verification key may be revoked while the subject remains valid. A pairwise identifier may be retired while the underlying account remains active. A relationship such as `controls`, `member-of` or `owns` may end while both subjects remain valid.

`Key revoked != subject revoked != relationship revoked`.

A relationship proof lifecycle therefore needs independent authority/currentness semantics for its endpoints and for the relation itself.

### 3.8 Historical validity and current admissibility remain separate

W3C Controlled Identifiers notes that historical verification after rotation/revocation can require version/time-aware information. A proof valid when produced can remain historically authentic while no longer authorizing a new effect.

`Historically valid relationship proof != currently admissible relationship`.

This aligns with G4's existing distinction between semantic resolvability, continuation authority and new-effect admissibility.

### 3.9 Rotation is not retroactive semantic rewriting

A later key or identifier rotation cannot silently reinterpret an old proof as if it had been issued under the new identity material.

`Rotation successor != historical proof rewrite`.

Historical evidence retains its original identifiers/keys/profile lineage plus qualified succession evidence when continuity must be established.

### 3.10 Offline autonomy requires bounded relationship-currentness closure

An autonomous runtime may locally verify a previously established relation while disconnected if the root contract permits it and locally durable evidence covers all required endpoint/relation/security horizons.

`Locally resolvable relation != indefinitely current relation`.

When the relationship-currentness horizon expires, possession of the old proof does not extend authority. The disposition remains explicit: revalidate, read-only, queue-without-effect, fail-closed or `UNKNOWN`, as the operation contract declares.

### 3.11 Endpoint rotation can create asymmetric knowledge

Domain A may know `A1 -> A2` while B still references A1. During propagation, both identifiers can appear legitimate but have different currentness/authority.

`Both identifiers resolve != both are concurrently admissible`.

The relation proof must preserve the rotation frontier/floor relevant to the interaction rather than rely on eventual metadata convergence.

### 3.12 Relationship rotation can be independent at each endpoint

For relation `R(A,B)`, A can rotate independently of B; B can rotate independently of A; and R itself can be superseded or revoked.

A useful implementation-independent mental model is a vector:

`EndpointA continuity/currentness + EndpointB continuity/currentness + Relation currentness + Proof profile`.

No scalar global revision is implied.

### 3.13 Cross-domain equality must not become ownership transfer

Proving that `A.accountRef` and `B.subjectRef` concern the same real-world subject does not give A authority over B's record or vice versa.

`Cross-domain equality != shared canonical entity`.

`Relationship proof != ownership transfer`.

Each capability continues to own its business semantics and local identifiers.

### 3.14 Provider substitution requalifies relationship semantics

A provider migration can preserve API shape while changing pairwise scope, identifier stability, rotation history, privacy leakage or revocation/currentness semantics.

`Same identifier field != same relationship guarantee`.

Adapters may translate representation only when the required relation semantics remain provable; otherwise they expose qualified lossiness/incompatibility.

### 3.15 A central identity-resolution service is not required

The root capability can evaluate immutable relationship policy plus locally sufficient proofs/currentness evidence. The Exchange Plane may transport relation evidence and succession metadata but does not become canonical identity owner.

`Distributed relationship verification != central identity oracle`.

A topology may deliberately depend on an online identity service, but then that dependency is explicit and cannot be advertised as autonomous for that path.

### 3.16 Equality proof privacy has an observer/collusion model

A proof that hides the witness from one verifier can still be linkable through issuer callbacks, shared trace IDs, timing, rare relationship types or a common bridge service.

`Hidden witness != unlinkable exchange`.

Privacy qualification therefore includes verifier, issuer, bridge/resolver, gateway/Exchange Plane and collusion assumptions, consistent with prior G4 privacy research.

### 3.17 Stable effect identity and relationship privacy are separate

A payment or approval may need stable occurrence/effect identity for deduplication while the subject relationship is purpose-scoped and unlinkable elsewhere.

`Stable effect identity != stable global subject identity`.

This prevents retries/idempotency from becoming a justification for permanent cross-domain identity handles.

### 3.18 Relationship proof compaction must preserve live lifecycle questions

Historical details may be compacted, but the retained evidence must still answer every live question: which predicate was proven, under which profile, which endpoint generations/floors were used, whether succession is qualified, and whether revocation/currentness can still be determined.

`Compacted relationship proof != forgotten rotation lineage`.

If the necessary history falls below retention, the result is `BELOW_RETENTION/UNRESOLVED`, never fabricated continuity.

## 4. Candidate research vocabulary

Research vocabulary only; no schema is authorized.

- `QualifiedRelationshipPredicate` — exact equality/relationship proposition required by a contract.
- `RelationshipProofRef` — purpose-scoped evidence reference for a qualified relationship, not a global identity handle.
- `CorrelationScopeRef` — scope within which stable recognition/linkability is intentionally permitted.
- `EndpointGenerationRef` — domain-local identifier/key generation relevant to one endpoint of a relationship.
- `ContinuityEvidenceRef` — qualified evidence that one endpoint generation legitimately succeeds another.
- `RelationshipCurrentnessRef` — evidence/floor/horizon governing whether the relation itself remains admissible.
- `RelationshipDisposition` — `CURRENT`, `HISTORICAL_ONLY`, `UNRESOLVED`, `BELOW_RETENTION`, `REVOKED/DEFEATED`, `UNKNOWN`, or another contract-qualified outcome.
- `RelationshipPrivacyProfile` — witness/endpoint/issuer disclosure and observer/collusion assumptions.

## 5. Candidate proof obligations

1. Cross-domain equality is evaluated only for the exact predicate required by the root contract.
2. Equality evidence does not create a shared canonical entity or transfer business ownership.
3. A stable global subject/join identifier is not introduced merely to simplify proof composition.
4. The equality/relationship witness need not be disclosed when the contract only requires the predicate outcome.
5. Correlation scope is explicit; stable recognition inside one scope does not authorize linkage outside it.
6. Key rotation is distinguished from subject/identifier rotation and relationship rotation.
7. Rotation continuity is supported by qualified evidence, not similarity or naming convention.
8. `alsoKnownAs`-like assertions are not accepted as equivalence without the required independent validation.
9. Continuity evidence exposes no more old/new identifier linkage than the declared purpose/privacy profile requires.
10. Key revocation, subject retirement and relationship revocation remain independently representable.
11. Historical proof validity is not relabeled as current relationship admissibility.
12. Rotation/succession never rewrites the identity/profile lineage of historical evidence.
13. Offline reuse is bounded by endpoint, relation, profile and security/currentness horizons.
14. Expired/unresolvable relationship evidence remains explicit and cannot become allow/deny by convenience.
15. Endpoint A and B maintain independent generation/floor semantics; no synthetic global revision is fabricated.
16. Provider/transport substitution requalifies pairwise scope, continuity, privacy, revocation and currentness guarantees.
17. An adapter does not fabricate equality when the target mechanism cannot preserve the source relationship semantics.
18. Exchange Plane/gateway/resolver metadata does not create a reusable cross-domain reverse directory.
19. Stable effect/idempotency identity is scoped independently from subject/relationship identity.
20. Relationship-proof compaction retains enough lineage to answer every live rotation/revocation/currentness question.
21. Below-retention history yields explicit unresolved/below-floor behavior rather than guessed continuity.
22. Collusion/observer assumptions are declared for relationship privacy claims.
23. Runtime autonomy does not require Builder or a central identity oracle when locally sufficient evidence closure exists.
24. A topology that does require online identity resolution declares that dependency and does not claim equivalent offline autonomy.

## 6. Adversarial cases

1. Two capabilities share one global customer UUID solely to prove same-subject relationships.
2. The UUID is hashed identically and presented as unlinkable.
3. A verifier stores every equality-proof reference as a permanent reverse identity index.
4. Key K1 rotates to K2 and middleware concludes the subject itself changed.
5. Subject identifier A1 rotates to A2 and middleware accepts continuity because profile attributes look similar.
6. Public `A1 -> A2` mapping preserves continuity but destroys the intended pairwise privacy boundary.
7. `alsoKnownAs` is treated as authoritative equivalence without validation.
8. A compromised key is revoked and the system incorrectly revokes the business subject/account.
9. A relationship is revoked but endpoint credentials remain valid, so stale relation evidence continues authorizing effects.
10. Historical signature verifies under K1 and is used as current authority after K1's revocation horizon.
11. A and B rotate independently and a join engine compares generation numbers across domains.
12. Both old and new identifiers resolve during propagation and middleware treats both as simultaneously admissible.
13. Provider migration preserves `subject` JSON shape but changes from pairwise to public identifiers.
14. Provider migration changes sector/correlation scope without a privacy downgrade declaration.
15. Adapter maps a weak account-match heuristic into `same legal subject`.
16. Offline runtime continues high-risk effects after relationship-currentness horizon expiry.
17. Reconnect accepts queued work before endpoint/relation floors are reconciled.
18. Compaction deletes the only evidence proving A1 legitimately succeeded to A2.
19. Retention loss is translated into `not related` rather than `BELOW_RETENTION/UNKNOWN`.
20. Gateway logs trace ID plus pairwise endpoint refs and reconstructs a global identity graph.
21. Rare relationship type and timing deanonymize otherwise hidden equality proofs.
22. Stable payment idempotency key is reused as the user's global identity key.
23. Central relationship resolver becomes mandatory for every client-runtime effect despite an autonomy claim.
24. Relationship proof valid under old profile is silently reinterpreted after provider/profile substitution.

## 7. Portability / exit path

This hypothesis does not require OpenID Connect pairwise subjects, DID/Controlled Identifiers, Verifiable Credentials, BBS/zero-knowledge proofs, a wallet, a global identifier registry, a central identity graph, a broker, gateway or identity provider.

Any future realization must preserve:

- qualified relationship predicates rather than global identity collapse;
- explicit correlation scope and privacy/collusion assumptions;
- independent key, subject-identifier and relationship lifecycles;
- qualified rotation/succession evidence and historical/current separation;
- endpoint-local floors/generations without a synthetic global revision;
- explicit unresolved/below-retention/currentness dispositions;
- autonomous verification when locally sufficient evidence exists;
- provider/transport substitution only with preserved guarantees or declared lossiness.

## 8. Deduplication against existing G4 research

This round does not reopen generic identity federation, revocation privacy, multi-authority composition, evidence caching or provider substitution. The material delta is the lifecycle of a **genuinely required cross-domain equality/relationship predicate** across independent endpoint/key/identifier rotation, revocation, offline horizons and provider changes while preserving purpose-scoped correlation.

## 9. Maturity and next gap

Maturity: `RESEARCH_ACTIVE / NON_EXECUTABLE`, not saturated.

The next high-value gap is **relationship-proof concurrency and conflicting succession claims**: determine how autonomous domains reconcile concurrent identifier rotations, competing `A1 -> A2` / `A1 -> A3` succession assertions, controller compromise, relationship revocation racing with offline effects, and provider migration without treating wall-clock latest, resolver availability or a central identity graph as semantic authority.

No implementation, provider, identity model, cryptographic construction or architecture binding is authorized by this research.