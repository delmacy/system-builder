# G4 — Qualified Non-Dependency Evidence Across Opaque and Privacy-Redacted Boundaries

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-21
Scope: Generation 4 product R&D only. No implementation authority.

## 1. Research question

When a protected downstream guarantee crosses a proprietary plugin/provider, generated artifact, trust-domain boundary, or privacy-redacted lineage boundary, under what conditions may System Builder accept evidence that an upstream semantic correction **cannot** affect that guarantee without requiring disclosure of the opaque component's internal dependency graph, source code, business data, or intellectual property?

This continues `G4_CAPABILITY_EXCHANGE_DEPENDENCY_LINEAGE_SOUNDNESS.md`. It does not create a new macro-family and does not reopen G3.

## 2. Evidence base

Primary standards, mature mechanisms and research reviewed:

- IETF RFC 9334, RATS Architecture: separates Attester Evidence, Verifier appraisal, Attestation Results, Endorsements and Relying Party policy. Evidence can remain vendor-specific/opaque while a Verifier emits vendor-neutral Attestation Results; relying parties still need to understand verifier policy and trust scope.
- IETF RFC 9711, Entity Attestation Token: attestation results may summarize, transform or privacy-filter evidence; freshness is mandatory for EAT use; claims not understood by a receiver and profile-specific requirements remain explicit. This is precedent for exporting a qualified predicate result without exporting raw internal evidence.
- SLSA provenance requirements: authenticity/accuracy and completeness are separate properties; current SLSA explicitly treats completeness of resolved dependencies as best effort. A signed provenance statement therefore does not automatically establish exhaustive dependency absence.
- Nix `allowedReferences` / `allowedRequisites`: negative closure constraints can prove absence of runtime references/requisites for the mechanism inspected, including recursive closure, but do not establish absence of environment/network/control/data dependencies outside that mechanism.
- W3C Verifiable Credentials Data Model: data minimization and selective disclosure support proving/revealing only what is necessary for a transaction rather than exposing a full credential. This is a privacy precedent, not a dependency-proof mechanism.
- VeriSBOM (2026 preprint): demonstrates a concrete research direction in which commitments and zero-knowledge proofs can validate selected SBOM predicates without disclosing the full SBOM. It is promising evidence that proprietary dependency sets can support privacy-preserving predicates, but it is not treated as a mature standard or automatic System Builder technology choice.
- Noninterference literature: absence of influence is stronger than absence of observed access. Information-flow/noninterference proofs can establish scoped independence properties, but only relative to the modeled semantics, inputs, declassification rules and proof assumptions.

No RATS/EAT profile, VC format, ZK system, SBOM scheme, Nix mechanism, TEE, attestation service, proof system or verifier is selected.

## 3. Material findings

### 3.1 Non-dependency is a proposition, not an omitted edge

If an opaque component does not reveal dependency `D`, that omission says nothing by itself.

`D not disclosed != component independent of D`.

A reusable negative claim must identify the protected output/guarantee, the candidate influence set, dependency classes covered, semantic/profile identity, context, assumptions, verifier/issuer authority and currentness horizon.

### 3.2 Raw evidence and appraisal result are distinct trust objects

RATS provides a useful implementation-independent split:

`opaque evidence -> qualified verifier/appraisal policy -> attestation result -> relying-party policy`.

The relying party can consume a narrower result without receiving vendor-specific evidence. However:

`attestation result != underlying fact by definition`.

Its meaning is bounded by verifier identity, appraisal policy/profile, evidence freshness and the verifier's own qualification. A verifier is an evidence authority for its declared claim, not business-semantic authority for the consuming capability.

### 3.3 Privacy reduction may preserve a predicate while reducing diagnosability

A provider can disclose `correction C cannot affect guarantee G under profile P` without revealing its entire dependency graph. This may be sufficient for admission but insufficient for debugging, independent recomputation or future policy changes.

`predicate sufficiency != forensic transparency`.

Assurance level and diagnosability therefore remain separate dimensions.

### 3.4 Negative evidence needs a closed or conservatively bounded influence universe

To establish that D cannot affect G, the proof must state what counts as an influence path. Examples include source/material references, environment, network resolution, configuration, plugin dispatch, runtime data/control flow, trust material and generated-code provenance.

`proof of absence inside universe U != proof of absence outside U`.

If the universe is open or partially opaque, the result must remain `PARTIAL/OPAQUE/UNKNOWN` or use a conservative superset.

### 3.5 Confinement can make negative claims stronger without exposing internals

A provider may avoid revealing its internal graph while proving that execution was constrained to a declared input/egress set. Nix-style closure checks and hermetic execution are examples of mechanism-scoped negative evidence.

`qualified confinement -> stronger absence evidence for constrained channels`.

But confinement does not prove that the internal program used the permitted inputs correctly or that semantic guarantees are correct.

### 3.6 Noninterference is the stronger semantic form of non-dependency

For protected semantics, the strongest conceptual statement is not “D was not read” but “varying D within the declared model cannot alter G.”

`no observed access < constrained non-access < qualified noninterference`,

where each relation is scoped to a model and evidence basis rather than a universal total order.

Noninterference may be proven statically, formally, by typed information-flow systems or other qualified mechanisms; dynamic traces alone cannot establish it for unexecuted paths.

### 3.7 Commitments/selective proofs can hide the graph while preserving selected predicates

A commitment to a dependency set/closure can permit later proofs such as membership, non-membership or policy compliance without publishing the full set. VeriSBOM is evidence that this direction is technically plausible for SBOM predicates.

However:

`cryptographic proof of predicate over committed set != proof that committed set is complete`.

Completeness/coverage must come from a separate qualified basis such as constrained generation, trusted measurement, independently qualified producer or another proof obligation.

### 3.8 Selective disclosure can itself create stable correlation handles

A stable commitment, opaque component identifier, verifier token, proof key or attestation subject can become a cross-context correlator even if payload details are hidden.

`payload hidden != relationship unlinkable`.

Purpose/tenant/trust-domain scoping and pairwise/rotatable handles may therefore be necessary where privacy requirements prohibit global correlation. This reuses prior G4 privacy boundaries rather than opening a new privacy macrofront.

### 3.9 Freshness is independent from proof validity

RFC 9711 requires freshness for EAT use. The same principle generalizes:

`proof mathematically valid != claim currently admissible`.

A non-dependency proof may become stale after plugin/provider/config/generator/profile change. Challenge/nonce, immutable revision binding, validity interval, monotonic floor or equivalent currentness evidence can prevent replay according to the chosen profile; no single mechanism is mandated here.

### 3.10 Privacy-redacted lineage must expose its coverage shape

A consumer need not know hidden node names, but it must know whether the claim covers source, configuration, environment, network, generated artifacts, runtime branch/data and provider dependencies relevant to G.

`redacted lineage != unqualified COMPLETE`.

A useful redaction can expose dependency classes, proof scope, closure boundary, version/currentness and unresolved opaque regions while withholding sensitive topology and identities.

### 3.11 Attestation authority and semantic authority remain separate

A trusted verifier can attest that an opaque provider satisfied predicate Q under appraisal policy P. It cannot thereby redefine Q's business meaning or declare the downstream capability's guarantee satisfied.

`attested predicate -> evidence input`, not `business decision authority`.

The capability/contract owner remains responsible for mapping Q into its guarantee vector and admission/requalification decision.

### 3.12 Third-party verifier centralization is not required by the abstraction

RATS shows one verifier/relying-party decomposition, but G4 should not bind the Exchange Plane to a central verifier. Verification may be local, delegated, federated, embedded, offline-capable or multi-verifier according to contract.

`logical evidence corridor != mandatory central attestation oracle`.

Autonomous client runtimes must retain locally sufficient verification/evidence closure for the topology and offline horizon they declare.

### 3.13 Confidential proof systems do not remove trust in statement construction

A zero-knowledge proof can hide witnesses while proving a formal statement, but it does not establish that the formal statement faithfully represents the business guarantee or that omitted dependency classes were impossible.

`ZK proof valid != semantic translation complete`.

This mirrors existing G4 proof-boundary rules: proof verification, model translation, completeness and currentness remain separate obligations.

### 3.14 Negative claims should be monotone only within their declared closure/profile

A statement that D cannot affect G under profile P must not silently survive expansion of P's allowed inputs, a new plugin, new network access, generator replacement or provider rebinding.

`scope expansion -> requalification`, unless the prior proof explicitly covered the expanded scope.

### 3.15 Unknown is safer than privacy-driven fabrication

If confidentiality policy prevents enough disclosure to qualify non-dependency, the system must represent the unresolved state.

`cannot disclose enough to prove != safe to assume independent`.

Possible dispositions include `QUALIFIED_NONDEPENDENT`, `QUALIFIED_FOR_CLASSES`, `PARTIAL`, `OPAQUE`, `CONTESTED`, `UNKNOWN`, `REQUALIFY_REQUIRED`, `REBUILD_REQUIRED`.

### 3.16 The Exchange Plane may carry proofs but must not learn hidden business topology by necessity

The logical plane can route a purpose-scoped `NonDependencyEvidenceRef`, verifier/profile identity, coverage shape, currentness and result without requiring the raw proprietary graph.

`exchange of evidence != disclosure of internal ownership graph`.

This preserves `Exchange Plane owns exchange semantics, capability owns business semantics` and reduces pressure toward an ESB/shared semantic database.

### 3.17 Portability requires predicate semantics independent of the proof technology

A durable contract should say what must be established — e.g. “correction family C cannot influence guarantee G for dependency classes K under profile P through revision R” — rather than encode “verified by ZK scheme X” as the semantic meaning.

`predicate/guarantee != proof-provider binding`.

Different providers may satisfy the same proof obligation with different assurance/operational trade-offs; unsupported equivalence remains explicit.

## 4. Candidate vocabulary

Research vocabulary only:

- `NonDependencyClaimRef` — scoped proposition that a named influence cannot materially affect a protected claim/guarantee.
- `InfluenceUniverseRef` — declared classes/channels considered by the non-dependency argument.
- `OpaqueClosureRef` — hidden dependency closure with externally visible scope/profile/currentness semantics.
- `CoverageShapeRef` — non-sensitive description of which dependency classes and boundaries are covered.
- `NonInterferenceEvidenceRef` — qualified evidence that variation in a source cannot influence a target within a declared model.
- `ConfinementEvidenceRef` — evidence bounding channels/inputs available to a derivation/execution.
- `SelectiveDependencyProofRef` — purpose-scoped proof over hidden/committed lineage.
- `DependencyCommitmentRef` — commitment to hidden dependency material; never itself proof of completeness.
- `AppraisalPolicyRef` — immutable identity of rules used to transform opaque evidence into a result.
- `EvidenceVerifierRef` — verifier identity/qualification reference, distinct from business authority.
- `RedactionProfileRef` — what lineage information may be disclosed and what coverage metadata must remain visible.
- `NonDependencyDisposition` — `QUALIFIED_NONDEPENDENT`, `QUALIFIED_FOR_CLASSES`, `PARTIAL`, `OPAQUE`, `CONTESTED`, `UNKNOWN`.

These are candidate structural/evidence primitives, not shared business entities or implementation components.

## 5. Candidate proof obligations

1. Omission/non-disclosure of a dependency never proves non-dependency.
2. Every protected non-dependency claim names target guarantee, influence universe, dependency classes, context/profile and currentness basis.
3. Raw evidence, appraisal result and relying-party decision remain distinct trust/authority objects.
4. A verifier's attestation cannot become downstream business-semantic authority.
5. Privacy minimization may reduce disclosure but cannot silently strengthen evidence coverage.
6. Negative evidence is valid only over a closed or conservatively bounded influence universe.
7. Confinement evidence establishes absence only for channels actually constrained/inspected.
8. Dynamic non-observation cannot substitute for noninterference or another completeness argument.
9. A selective/ZK proof over a committed dependency set does not establish completeness of that set without separate coverage evidence.
10. Stable commitments/proof handles are assessed for cross-context correlation risk.
11. Proof validity, verifier qualification and current admissibility/freshness remain separate dimensions.
12. Privacy-redacted lineage exports enough coverage shape to prevent `OPAQUE/PARTIAL -> COMPLETE` promotion.
13. Provider/plugin/generator/config/profile changes that can expand influence closure trigger requalification.
14. Confidentiality constraints that prevent sufficient proof yield explicit `UNKNOWN/OPAQUE/REQUALIFY_REQUIRED`, not fabricated independence.
15. Exchange Plane transport of non-dependency evidence does not transfer authorship, semantic ownership or canonical business state.
16. Client runtimes retain topology-appropriate local verification/evidence closure and do not require Builder availability for declared autonomous operation.
17. Proof predicate semantics remain implementation-independent from attestation/ZK/TEE/SBOM providers.
18. Proof/model translation is separately qualified from cryptographic verification.
19. Redaction never removes tenant/trust/classification/currentness dimensions needed to interpret the claim safely.
20. Reuse of a non-dependency proof is bounded by immutable subject/profile/revision and declared currentness/floor rules.

## 6. Adversarial cases

1. Proprietary provider omits D from a redacted graph; consumer interprets omission as proof of absence.
2. Signed attestation says `PASS` but the verifier policy identity is absent or mutable.
3. Verifier policy checks only source packages while consumer assumes environment/network/runtime coverage.
4. ZK proof proves D is absent from an SBOM whose own completeness was never qualified.
5. Stable dependency commitment becomes a global cross-tenant correlation identifier.
6. Privacy redaction removes tenant/classification context and a proof is reused in another trust domain.
7. Runtime trace did not observe D; provider emits `NONDEPENDENT` despite unexecuted branches.
8. Sandbox blocks filesystem access but allows network resolution; result is promoted to total hermeticity.
9. Plugin update adds an external lookup but reuses old non-dependency attestation because interface/schema is unchanged.
10. Generated artifact changes generator profile while keeping the same output schema and old proof is replayed.
11. Valid old proof is accepted after a security/currentness floor requires a newer verifier/profile.
12. Central verifier outage blocks every autonomous runtime even though local proof material would have been sufficient.
13. Exchange Plane starts storing hidden dependency graphs “for convenience” and becomes a cross-capability topology oracle.
14. Gateway translates an opaque provider claim into `COMPLETE` because downstream vocabulary lacks `OPAQUE`.
15. Proof provider verifies cryptography correctly but formal predicate omits a material business guarantee dimension.
16. Two proof systems produce different dispositions and majority vote is treated as semantic truth.
17. Nondependency proof is cached beyond provider rebinding/configuration change.
18. Proprietary component refuses disclosure; operator manually marks it independent to avoid rebuild cost.
19. Selective disclosure reveals only dependency class but hides an unresolved opaque subclosure; aggregator drops the unresolved marker.
20. Artifact bytes/proprietary graph are copied through the Exchange Plane even though a purpose-scoped evidence reference would suffice.

## 7. Technology-independent hypothesis

For opaque/privacy-sensitive boundaries, the durable abstraction should support:

```text
Protected Guarantee G
  -> candidate influence/correction C
  -> InfluenceUniverse + CoverageShape
  -> opaque/internal evidence
  -> qualified appraisal/proof/confinement/noninterference mechanism
  -> NonDependencyEvidenceRef
  -> capability-local relying policy
  -> REUSE / REQUALIFY / REBUILD / UNKNOWN
```

The externally portable contract is the proposition, coverage, assumptions, authority and currentness — not the internal graph or proof technology.

## 8. Portability / exit path

- Raw dependency graphs remain capability/provider-local unless disclosure is explicitly required.
- Evidence references carry stable semantic fields independent of one attestation or proof vendor.
- A future provider must state which dependency classes, influence channels, freshness and completeness guarantees it can establish.
- Unsupported semantics yield explicit incompatibility/partial/opaque dispositions.
- Replacing a verifier/proof provider requalifies verifier-specific assurance without changing business ownership.
- Builder/central services are not mandatory online verifiers for autonomous client runtimes unless a future explicit topology contract says so.

## 9. Deduplication against existing G4

This round does **not** reopen generic privacy federation, proof-profile portability, verifier diversity, dependency-lineage completeness, correction authority, revocation privacy, cache invalidation or supply-chain provider selection. The material delta is narrower:

`opaque/privacy-redacted boundary -> qualified negative/non-dependency proposition -> coverage-shaped evidence -> privacy-preserving appraisal/proof -> capability-local decision without invented transparency`.

## 10. Maturity and next gap

Family 8 remains `RESEARCH_ACTIVE / NON_EXECUTABLE` and not saturated.

This gap is materially advanced but not saturated. The next highest-value gap is **compositional negative-evidence algebra across multiple opaque boundaries**: determine when A can safely conclude `C cannot influence G` if A depends on B and C through independently redacted/attested closures, including conflicting coverage shapes, verifier trust domains, proof freshness, alternative derivations and privacy-preserving aggregation, without turning one verifier or Exchange Plane into a global semantic oracle.

## 11. Sources

- RFC 9334 — Remote ATtestation procedureS (RATS) Architecture: https://www.rfc-editor.org/rfc/rfc9334.html
- RFC 9711 — Entity Attestation Token (EAT): https://www.rfc-editor.org/rfc/rfc9711.html
- SLSA v1.0 requirements: https://slsa.dev/spec/v1.0/requirements
- Nix advanced derivation attributes (`allowedReferences`, `allowedRequisites`): https://releases.nixos.org/nix/nix-2.24.0/manual/language/advanced-attributes.html
- W3C Verifiable Credentials Data Model 2.x, data minimization/selective disclosure: https://www.w3.org/TR/vc-data-model-2.0/
- Castiglione, Ebrahimi, Khakpour, “VeriSBOM: Secure and Verifiable SBOM Sharing Via Zero-Knowledge Proofs”, 2026 preprint: https://arxiv.org/abs/2602.13682
- Barthe, Pichardie, Rezk, “A certified lightweight non-interference Java bytecode verifier”, Mathematical Structures in Computer Science, 2013: https://doi.org/10.1017/S0960129511000284
