# G4 — Assurance-Composition Proof Minimization and Privacy-Preserving Disclosure

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-20
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

How can a runtime prove that a root assurance predicate is satisfied while revealing only the material semantic cut set required by the consuming capability, without exposing the complete dependency graph, provider/trust topology, historical profile details or unrelated assurance dimensions — while still preserving negative/contested evidence, offline verification, auditability and later selective revalidation?

This document extends the existing G4 work on mixed-profile assurance composition, privacy-preserving evidence federation, dependency commitments, revocation privacy and long-term proof-policy transition. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature specifications and papers reviewed:

- W3C Data Integrity BBS Cryptosuites v1.0 (current Candidate Recommendation): BBS-derived proofs can selectively reveal statements and generate unlinkable proof artifacts; the specification also warns that mandatory reveal, proof metadata, identifiers and other disclosed data can defeat unlinkability.
- W3C Verifiable Credentials Data Model v2.x privacy guidance: identifiers, signatures, timestamps, cryptographic metadata, credential types and extension combinations can all become correlation surfaces; unlinkable cryptography alone does not guarantee unlinkable exchange.
- W3C Verifiable Credential Data Integrity 1.0: selective disclosure and unlinkability are distinct properties; some applications intentionally require correlatable disclosed identifiers even while minimizing other disclosure.
- RFC 9901 (SD-JWT, November 2025): selective disclosure protects undisclosed claims but does not itself guarantee all forms of unlinkability; disclosed claims and stable presentation material can still enable correlation.
- Crites/Lysyanskaya, Delegatable Anonymous Credentials from Mercurial Signatures: demonstrates that even issuer identity can be privacy-sensitive and that anonymous/delegatable credentials can hide issuer identity in appropriate constructions.
- Maji/Prabhakaran/Rosulek, Attribute-Based Signatures: demonstrates the broader principle that a verifier can learn that an attribute predicate is satisfied without learning unrelated signer identity/attributes, under a specialized construction.
- Existing G4 artifacts, especially `G4_CAPABILITY_EXCHANGE_MIXED_PROFILE_ASSURANCE_COMPOSITION.md`, `G4_CAPABILITY_EXCHANGE_PRIVACY_PRESERVING_EVIDENCE_FEDERATION.md`, `G4_CAPABILITY_EXCHANGE_REVOCATION_PRIVACY_UNLINKABILITY.md`, `G4_CAPABILITY_EXCHANGE_MULTI_AUTHORITY_REVOCATION_PRIVACY.md`, and `G4_CAPABILITY_EXCHANGE_GUARANTEE_EVIDENCE_CACHE_INVALIDATION.md`.

These are architectural evidence only. No BBS, SD-JWT, anonymous-credential system, attribute-based signature, zero-knowledge system, VC stack, wallet or proof framework is selected.

## 3. Material findings

### 3.1 Proof minimization is semantic minimization, not merely field redaction

The prior round established that a root guarantee is justified by predicate-specific material premises. This creates a natural disclosure boundary: a consumer should receive the smallest qualified evidence set that proves its named root predicate, not the producer's entire evidence graph.

`Minimal proof payload != minimal semantic disclosure`.

A tiny payload containing a stable global identifier can reveal more than a larger unlinkable proof. Minimization must therefore consider claim semantics, correlation scope, topology leakage and metadata, not byte count alone.

### 3.2 Minimal semantic cut set and minimal disclosure set are related but not identical

A cut set identifies premises material to correctness. A disclosure set identifies what the verifier must actually learn to validate those premises. Specialized proof systems demonstrate that a predicate can sometimes be proven without revealing every witness value.

`Material premise != mandatory disclosure of raw premise`.

The root contract may require proof that `P1 AND P2` holds while allowing the witness values, provider identities or intermediate graph edges behind P1/P2 to remain hidden when the verification semantics support that.

### 3.3 Root predicate identity itself is part of the disclosure contract

A verifier must know which guarantee was proven. But naming an overly specific internal policy can leak topology or sensitive business facts.

`Proof of predicate G != disclosure of every internal rule implementing G`.

A stable, immutable root-predicate semantic identity can be disclosed while internal derivation details remain commitment-bound or selectively revealed, provided later audit/revalidation remains possible under the declared profile.

### 3.4 Selective disclosure and unlinkability are separate assurance dimensions

W3C Data Integrity explicitly notes that selective disclosure can be useful even when a disclosed shipment/lot identifier intentionally preserves correlation. RFC 9901 likewise distinguishes disclosure minimization from unlinkability limitations.

`Selective disclosure != unlinkability`.

`Unlinkable proof artifact != unlinkable presentation`.

A G4 disclosure profile must therefore qualify both what is hidden and against which observer/collusion set presentations are expected to remain unlinkable.

### 3.5 Stable proof metadata can defeat otherwise unlinkable evidence

W3C BBS/VC privacy guidance identifies proof options, timestamps, verification material, globally unambiguous identifiers and mandatory reveals as correlation surfaces. G4 already treats envelope metadata as semantically material; this round extends that discipline to assurance proofs.

`Unlinkable child proof + stable correlationId/providerRef/profile fingerprint != unlinkable root proof`.

Proof minimization must cover envelope and observability metadata as well as claim payload.

### 3.6 Provider identity is not universally material to consumer assurance

Some guarantees require a named authority/provider; others require only membership in a qualified authority class or satisfaction of a threshold/policy.

`Provider participated != provider identity must always be disclosed`.

Research on anonymous/delegatable credentials provides evidence that issuer identity can itself be hidden in specialized systems. The implementation-independent principle is that provider identity should be disclosed only when material to the consumer's predicate, audit obligation or later revalidation.

### 3.7 Hiding provider identity cannot hide provider qualification requirements

If the root contract requires `provider in QualifiedSet S`, a privacy-preserving proof may hide which member acted, but cannot erase the set semantics, qualification epoch, threshold/failure-domain assumptions or relevant revocation/currentness constraints.

`Provider identity hidden != provider qualification omitted`.

Otherwise privacy becomes false strengthening.

### 3.8 Negative and contested evidence cannot be omitted merely because it is privacy-sensitive

The previous round established that material `CONTESTED`, `UNKNOWN`, `BELOW_RETENTION` or negative evidence cannot be outvoted. Proof minimization adds:

`Privacy minimization != permission to suppress a material defeat condition`.

A presentation can hide unnecessary details of the negative witness, but if that witness changes the root disposition, the root result must preserve that fact.

### 3.9 Minimal disclosure is operation- and audience-specific

An auditor, an effect executor and a UI inspector can legitimately require different disclosure sets for the same underlying evidence closure.

`One evidence closure != one universal presentation`.

The consuming capability owns the disclosure requirement for its operation, subject to the producer's privacy/classification constraints and the immutable proof semantics.

### 3.10 Audience minimization must not become semantic ambiguity

A verifier-specific proof may hide details, but the verifier must still be able to determine exactly what was proven and under which normative profile.

`Less disclosure != weaker claim identity`.

The proof must remain bound to root predicate semantics, relevant profile generations and any audience/domain restrictions required to prevent replay or context substitution.

### 3.11 Domain/audience binding is both a replay control and a correlation trade-off

Binding a presentation to an audience or domain can prevent reuse in another context, but stable domain-bound values can create intended or unintended linkability within that scope.

`Audience binding != global identity binding`.

`Replay resistance != unlinkability`.

The disclosure profile must state the correlation scope introduced by any binding mechanism.

### 3.12 Proof freshness/currentness can leak activity patterns

Fetching or generating fresh evidence for each effect can expose timing, issuer/provider and workflow activity even when the proof body is selectively disclosed.

`Minimal proof content != minimal validation-channel leakage`.

Pre-positioned/bulk status material and offline verification can reduce this leakage, but only within declared currentness horizons. Privacy cannot extend authority past expiry.

### 3.13 Dependency commitments need privacy-scoped identifiers

A compact `AssuranceDependencyCommitment` is useful for selective invalidation, but a stable commitment reused across consumers can become a cross-domain tracking handle.

`Compact dependency commitment != privacy-neutral dependency commitment`.

Commitments should be purpose/correlation-scoped or otherwise presented through qualified proofs when global equality is not material.

### 3.14 Proof minimization must preserve future revalidation capability

If a root proof hides internal dependencies, a later trust-root compromise or provider revocation must still allow affected cached proofs to be discovered/requalified without revealing the full graph to every original consumer.

`Consumer-minimized presentation != producer-forgotten dependency lineage`.

The producer/runtime may retain a private dependency closure or scoped commitment sufficient for selective revalidation while presenting a smaller proof externally.

### 3.15 Private dependency retention is not permission for a central identity/evidence graph

Retaining revalidation lineage does not justify centralizing all evidence or business identities in the Exchange Plane.

`Private verification closure != shared canonical business graph`.

Ownership remains with capabilities/runtimes; the Exchange Plane can transport refs/commitments without becoming the semantic owner.

### 3.16 Auditability can use progressive disclosure rather than default full disclosure

A normal verifier may receive only the minimal proof. An authorized audit path may reveal additional evidence or verify commitments under stronger authority/classification rules.

`Auditable != fully disclosed to every verifier`.

However, an audit escalation path must be defined before relying on hidden evidence; a promise that details can be revealed later is not proof if the necessary closure may be erased or inaccessible.

### 3.17 Designated/audience-specific verification changes portability assumptions

Some privacy techniques can produce evidence verifiable only by a designated verifier or within a specific context. That can improve privacy but reduce third-party auditability and long-term portability.

`More private verification != universally more portable verification`.

This is another reason assurance remains a partial order rather than a scalar.

### 3.18 Proof aggregation can hide graph size but can also hide correlated failure

A compact aggregate proof may show that a root predicate is satisfied without enumerating all children. But aggregation must not erase material assumptions such as all children depending on one trust root/operator.

`Aggregate proof compactness != independence proof`.

Failure-domain and threshold semantics remain part of the assurance claim even when identities are hidden.

### 3.19 Predicate privacy can itself be material

Sometimes revealing which predicate was checked discloses sensitive business context. For example, a proof profile unique to fraud investigation, military classification or a rare workflow can identify the subject or activity even if all values are hidden.

`Hidden attributes != hidden business context`.

Where predicate privacy is required, the system may need coarser public claim classes plus privately auditable refinements; this is a research option, not an implementation selection.

### 3.20 No proof system can repair over-disclosure in business semantics

W3C privacy guidance repeatedly notes that disclosed attributes can directly identify a subject regardless of cryptographic unlinkability.

`Privacy-preserving cryptography != privacy-preserving business contract`.

If a consumer contract unnecessarily requires global subject ID, exact provider identity and complete provenance, the Exchange Plane cannot restore privacy through transport or proof technology.

### 3.21 Disclosure negotiation is constrained by the root contract

A consumer may request fewer or more details, but negotiation cannot drop material premises or silently substitute a weaker proof profile.

`Consumer asks for less != producer may omit required defeat evidence`.

`Consumer asks for more != consumer automatically authorized to receive more`.

Privacy/classification policy and root semantics jointly bound the admissible presentation.

### 3.22 Cache keys must not force global linkability

Caching minimized proofs by a global subject/evidence identifier would undo presentation privacy.

`Cache efficiency != authority to create global correlation key`.

Caches should be scoped to the declared correlation/audience domain or use non-linking derivations where the semantics permit.

### 3.23 Local/offline verification remains compatible with minimized disclosure

A runtime can verify a minimized root proof offline when it has the immutable predicate/profile semantics, required trust material, currentness/floor closure and proof-verification inputs within their horizons.

`Minimal disclosure != mandatory online oracle`.

This preserves runtime autonomy while making unresolved dependencies explicit when local closure is insufficient.

### 3.24 Exchange Plane transports disclosure semantics; it does not choose business sufficiency

The Exchange Plane can carry root predicate identity, disclosure profile, audience/correlation scope, proof artifacts, currentness and revalidation refs. It must not decide that a minimized proof is sufficient for a business operation.

`Proof verifies != operation authorized`.

The consuming capability still owns business sufficiency and effect authority.

## 4. Candidate research vocabulary

Research vocabulary only; no product schema is authorized.

- `AssuranceDisclosureProfileRef` — immutable semantics describing what a presentation reveals, hides and binds.
- `RootPredicateRef` — immutable identity of the assurance predicate being proven.
- `DisclosureCutSet` — minimum verifier-visible information required to validate a named root predicate under a profile.
- `PrivateWitnessClosureRef` — retained non-public lineage/evidence needed for revalidation/audit without default disclosure.
- `CorrelationScopeRef` — scope within which stable presentation/linkage is intentionally permitted.
- `ObserverModelRef` — declared verifier/issuer/gateway/collusion assumptions under which privacy claims hold.
- `AudienceBindingRef` — qualified binding preventing context substitution/replay without implying global identity.
- `HiddenDependencyCommitment` — commitment to material dependencies that can support later qualification without exposing the full graph in the normal presentation.
- `DisclosureDisposition` — qualified result such as `SUFFICIENT_MINIMIZED`, `MORE_EVIDENCE_REQUIRED`, `DISCLOSURE_NOT_AUTHORIZED`, `PRIVACY_PROFILE_UNSUPPORTED`, `UNRESOLVED`.
- `AuditEscalationRef` — governed path by which additional hidden evidence can be inspected when authorized.

## 5. Candidate proof obligations

1. A presentation reveals no more semantic information than required by the named root predicate, audit obligations and authorized audience.
2. Byte-size minimization is never treated as proof of semantic/privacy minimization.
3. Material premises may be proven without raw disclosure only when the proof semantics actually support that inference.
4. The verifier can identify exactly which root predicate/profile was proven without needing the full internal dependency graph.
5. Selective disclosure and unlinkability remain separate qualified properties.
6. Proof/envelope metadata is included in correlation analysis; privacy is not evaluated on claim payload alone.
7. Provider identity is disclosed only when material, while provider qualification/authority semantics remain provable.
8. Material negative, contested, unknown or below-retention conditions cannot be hidden in a way that strengthens the root disposition.
9. Disclosure requirements are operation/audience scoped rather than universal to an evidence closure.
10. Audience/domain binding cannot be reused as an undeclared global identity or correlation handle.
11. Currentness/validation-channel behavior is included in privacy analysis; online callbacks are not treated as semantically free.
12. Dependency commitments cannot become global cross-domain tracking identifiers by convenience.
13. Minimized external presentations preserve enough private/scoped dependency lineage for later selective invalidation and revalidation.
14. Revalidation lineage does not transfer canonical business ownership to Exchange Plane, gateway, verifier or archive.
15. Auditability can use governed progressive disclosure; normal verification need not reveal the full evidence graph.
16. If later audit requires hidden evidence, the retention/availability obligations for that evidence are explicit before relying on the minimized proof.
17. Designated/audience-specific verification explicitly records any portability/auditability downgrade.
18. Aggregation cannot erase material correlated-failure, threshold, authority or currentness assumptions.
19. Predicate/profile identifiers themselves are evaluated for business-context and rarity leakage.
20. Cryptographic privacy cannot compensate for an over-broad consumer business contract.
21. Disclosure negotiation cannot remove required premises, suppress defeat evidence or bypass classification/authorization policy.
22. Proof caches respect correlation scope and do not introduce global subject/evidence join keys.
23. Offline verification remains possible when sufficient qualified closure is pre-positioned; otherwise unresolved state is explicit.
24. Exchange Plane transports proof/disclosure semantics without becoming assurance-sufficiency or business-authorization authority.

## 6. Adversarial cases

1. A 32-byte global evidence UUID is called privacy-minimal because it is smaller than the original proof graph.
2. Root proof hides ten child values but exposes a globally stable dependency commitment linking every presentation.
3. BBS/ZK-like unlinkable proof is wrapped in a stable correlation ID and becomes trivially linkable.
4. Selective disclosure is advertised as unlinkability although the same signature/identifier remains visible.
5. Provider identity is hidden but a unique provider-specific profile ID reveals the provider anyway.
6. Provider identity is hidden and the adapter also drops the provider qualification epoch, falsely strengthening the proof.
7. `CONTESTED` child is omitted from a minimized presentation, causing root `SUPPORTED`.
8. Negative revocation evidence is withheld as private even though it defeats the operation.
9. Consumer receives the entire ancestry graph although it only needs proof of one root predicate.
10. Consumer asks for complete provenance and receives classified provider identities without authorization.
11. Audience binding uses the same stable global value across all tenants and becomes a tracking identifier.
12. Per-effect issuer callback reveals workflow timing despite a minimally disclosed proof body.
13. Cache uses global subject ID as key and reconstructs a cross-capability identity graph.
14. Minimized proof is issued, then producer deletes all private lineage and cannot selectively revalidate after trust-root compromise.
15. Exchange Plane stores every hidden dependency centrally to support audit and becomes canonical evidence/identity graph.
16. Aggregate proof hides that all threshold participants depend on one compromised trust operator.
17. Predicate name `high-risk-fraud-investigation` reveals sensitive business context although attributes are hidden.
18. Rare cryptosuite/profile combination fingerprints a tenant or workflow.
19. Proof is verifier-designated but later presented as independently auditable by arbitrary third parties.
20. Audit escalation is promised but the underlying evidence was erased before any retention obligation was declared.
21. Consumer negotiates a weaker disclosure profile that silently omits required currentness evidence.
22. Producer treats consumer request for more evidence as authorization to disclose tenant/classification metadata.
23. Offline runtime accepts an old minimized proof beyond its currentness horizon to avoid a privacy-sensitive callback.
24. Gateway verifies a minimized proof and converts that result directly into business authorization, bypassing the capability contract.

## 7. Technology-independent hypothesis

The current hypothesis is that G4 should distinguish the **private evidence closure** from the **verifier-visible assurance presentation**.

Conceptually:

`Private Evidence Closure -> Root Predicate + Composition Rule -> Disclosure Policy -> Minimized Presentation -> Consumer Verification -> Consumer Business Sufficiency Decision`

The presentation should carry only the information necessary to establish the named root predicate for the authorized audience, while preserving qualified privacy, correlation, currentness and portability semantics. The private closure retains enough dependency lineage for later audit/revalidation but remains capability/runtime-owned rather than becoming a central Exchange Plane graph.

A useful boundary is:

`Minimal disclosure proves sufficiency; it does not redefine sufficiency`.

The consuming capability owns the root business predicate. Proof technology can reduce witness disclosure but cannot remove a material premise, hide a defeating condition, invent authority, or turn a privacy property into business authorization.

## 8. Portability / exit-path implications

A portable assurance contract should not require one selective-disclosure technology. A provider/transport can be substituted when it can preserve:

- root predicate identity and immutable semantics;
- required material-premise inference;
- disclosure and observer/correlation profile;
- negative/contested/currentness semantics;
- audience/context binding where required;
- later audit/revalidation closure;
- declared portability/auditability properties.

If a target mechanism supports only ordinary signatures/full disclosure, migration can be explicitly lossy or incompatible. An adapter must not claim privacy equivalence merely because both mechanisms return `verified=true`.

## 9. Deduplication against existing G4 research

This round does not reopen generic evidence federation, anonymous credentials, revocation privacy, proof caching, mixed-profile composition or privacy architecture. The material delta is their intersection:

**predicate-specific assurance composition × minimal semantic disclosure × metadata/correlation leakage × preserved defeat evidence × future selective revalidation**.

Existing rules remain intact:

- `AI inference != authority`.
- `Shared primitives != shared business ownership`.
- `Exchange Plane owns exchange semantics, capability owns business semantics`.
- `Interface compatibility != contract compatibility`.
- `Unsupported semantics -> explicit incompatibility or qualified mediation`.
- `Builder != Runtime`.

## 10. Maturity state and next gap

State: `RESEARCH_ACTIVE / NON_EXECUTABLE`.

Material boundaries changed in this round, so this is not `NO_MATERIAL_DELTA`.

The highest-value remaining gap is **privacy-preserving selective revalidation after hidden dependency change**: when a trust root/provider/profile/floor changes, determine how a runtime can prove that a previously minimized root proof is still valid — or selectively degraded — without revealing which hidden dependency changed, creating a stable revalidation handle, forcing O(N) disclosure, or requiring a central assurance oracle. Research should compare accumulator/status-proof patterns, private set membership/non-membership, scoped commitments, offline revalidation windows and adversarial correlation across repeated revalidation events without selecting a cryptographic implementation.