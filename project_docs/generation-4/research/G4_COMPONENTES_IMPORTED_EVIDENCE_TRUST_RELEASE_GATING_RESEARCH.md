# G4 Componentes — Imported Evidence, Trust-Domain Qualification & Promotion Gating Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-23
Scope: Generation 4 documentary P&D only. No implementation authority, WBS, Work Package, Sprint, TASK, migration, provider adoption or G2/G3 change.

## 1. Research question

How may the G4 `Componentes` catalog/playground consume evidence produced outside the immediate SB qualification boundary without confusing provenance, trust, semantic applicability, currentness or release/promotion admission?

This extends the existing conformance evidence work. Imported evidence is a candidate input to a local claim decision; it is not automatically a local proof and never becomes business/runtime authority merely by being signed, certified, recent or third-party.

## 2. External interaction grammars reviewed

The research uses external systems as interaction/evidence grammars, not provider commitments:

- NIST distinguishes first-party, second-party and independent third-party attestations and treats artifacts as evidence supporting belief/proof. Assurance rigor should be commensurate with criticality.
- SLSA provenance binds a subject to a builder, build type/invocation and resolved dependencies; its model explicitly requires trust in the builder and treats external parameters as untrusted inputs to be checked downstream.
- in-toto layouts identify intended steps and authorized functionaries; link metadata records what actors did. Verification checks layout signature/expiry, authorized functionaries, materials/products and inspections.
- Sigstore policy-controller demonstrates that signature/attestation verification can be policy-scoped and authority-scoped, including issuer/subject identity and alternate trust roots. Sigstore's threat model explicitly separates proof that an identity signed something from the consumer's decision to trust that identity.

Extracted grammar:

`producer identity -> attestation provenance -> subject binding -> predicate/profile binding -> local trust qualification -> local applicability -> currentness -> local claim disposition -> gate consumption`

Not extracted: any requirement to adopt SLSA, in-toto, Sigstore, Kubernetes or a particular signature format.

## 3. Primary finding — imported evidence is not local truth

An external result needs at least four distinct questions:

1. **Authenticity/provenance** — who/what produced it and can that origin be verified?
2. **Trust qualification** — is that producer/trust root acceptable for this proof class and scope?
3. **Semantic applicability** — does the evidence actually test/prove the same subject, contract, fixture semantics and claim required locally?
4. **Currentness/admissibility** — is the evidence still admissible under current revisions, profiles, security floors and policy?

Therefore:

```text
SIGNED != TRUSTED
TRUSTED_PRODUCER != APPLICABLE_EVIDENCE
APPLICABLE != CURRENT
CURRENT != SUFFICIENT
THIRD_PARTY != INDEPENDENT_ENOUGH
CERTIFIED != UNIVERSALLY_ADMISSIBLE
```

A valid signature may prove origin while the claim remains `UNTRUSTED`, `OUT_OF_SCOPE`, `PROFILE_MISMATCH`, `STALE`, `INSUFFICIENT` or `UNKNOWN`.

## 4. Evidence origin classes

Candidate origin taxonomy:

```text
LOCAL_FIRST_PARTY
EXTERNAL_FIRST_PARTY
SECOND_PARTY
INDEPENDENT_THIRD_PARTY
DEPENDENCY_SUPPLIER
CUSTOMER_PROVIDED
REGULATORY_OR_CERTIFICATION_BODY
UNKNOWN_ORIGIN
```

Origin class is descriptive, not an assurance score. A highly qualified supplier laboratory may be acceptable for one performance proof while an independent certification may still be semantically irrelevant to a specific recovery contract.

## 5. ImportedEvidenceEnvelope

Candidate documentary model:

```text
ImportedEvidenceEnvelope
  evidenceId
  producerIdentity
  producerOrganization?
  originClass
  trustDomainId
  trustRootRefs[]
  attestationFormat
  signatureOrIntegrityRefs[]
  subjectRefs[]
  subjectDigests[]
  claimType
  proofClass
  predicateProfile
  fixtureOrProcedureRef?
  environmentProfile?
  browserAtProfile?
  normativeProfileRefs[]
  producedAt
  validFrom?
  validUntil?
  dependencyRefs[]
  rawArtifactRefs[]
  provenanceRefs[]
  declaredLimitations[]
```

The envelope describes what was received. Local qualification remains separate.

## 6. Trust qualification is scoped

Candidate local trust record:

```text
EvidenceProducerQualification
  producerIdentity
  trustDomainId
  acceptedProofClasses[]
  acceptedSubjectScopes[]
  acceptedPredicateProfiles[]
  independenceClass
  assuranceConstraints[]
  securityFloor
  validFrom
  validUntil?
  revocationState
  qualificationEvidenceRefs[]
```

Important boundaries:

```text
PRODUCER_QUALIFIED_FOR_A11Y != PRODUCER_QUALIFIED_FOR_SECURITY
PRODUCER_QUALIFIED_FOR_COMPONENT != PRODUCER_QUALIFIED_FOR_WORKSPACE
TRUST_ROOT_VALID != PRODUCER_SCOPE_VALID
IDENTITY_CONTINUITY != QUALIFICATION_CONTINUITY
```

Trust must be proof-class-, subject-, profile- and horizon-scoped.

## 7. Local qualification dispositions

Imported evidence should not collapse immediately to PASS/FAIL. Candidate pipeline dispositions:

```text
RECEIVED
PROVENANCE_VERIFIED
PROVENANCE_FAILED
TRUST_QUALIFIED
TRUST_UNQUALIFIED
SCOPE_MATCHED
SCOPE_MISMATCH
PROFILE_MATCHED
PROFILE_MISMATCH
CURRENT
STALE
REVOKED
INSUFFICIENT
CONFLICTING
LOCALLY_ACCEPTED
LOCALLY_REJECTED
REQUIRES_LOCAL_CORROBORATION
```

The final conformance dimension may consume `LOCALLY_ACCEPTED` evidence, but the imported artifact retains its own lineage and origin.

## 8. Independence is multidimensional

`THIRD_PARTY` is not enough. Candidate independence axes:

- organizational independence;
- identity/trust-root independence;
- implementation/toolchain independence;
- infrastructure/execution-environment independence;
- methodology/procedure independence;
- data/fixture independence;
- reviewer/operator independence.

Two laboratories using the same compromised scanner and shared execution service do not provide two fully independent semantic observations.

```text
TWO_ATTESTATIONS != TWO_INDEPENDENT_PROOFS
DIFFERENT_ORGANIZATIONS != DIFFERENT_TCB
DIFFERENT_TOOLS != DIFFERENT_NORMATIVE_SEMANTICS
AGREEMENT != TRUTH
DISAGREEMENT != MAJORITY_VOTE
```

Conflicting evidence is itself evidence requiring reconciliation.

## 9. Subject and profile binding

Evidence reuse requires exact or explicitly qualified correspondence among:

- subject identity and digest/revision;
- contract revision;
- component/application/workspace scope;
- fixture/procedure semantics;
- normative profile;
- browser/AT/device/input profile where relevant;
- performance environment where relevant;
- dependency evidence/currentness.

A supplier's `Button PASS` cannot automatically prove a composed Ribbon or modal. A package digest match cannot prove that the surrounding Workspace composition is equivalent.

```text
SAME_PACKAGE_DIGEST != SAME_COMPOSITION
SAME_COMPONENT_VERSION != SAME_DEPENDENCY_CONTEXT
SAME_TEST_NAME != SAME_PROCEDURE_SEMANTICS
SAME_STANDARD_LABEL != SAME_NORMATIVE_PROFILE
```

## 10. Revocation and compromise propagation

Producer/trust compromise is not ordinary source change. Candidate dispositions:

```text
TRUST_CURRENT
TRUST_SUSPECT
TRUST_REVOKED
TRUST_COMPROMISED_AFTER_EVIDENCE
TRUST_COMPROMISED_AT_OR_BEFORE_EVIDENCE
TRUST_STATUS_UNKNOWN
```

A compromise timestamp matters. Evidence produced before a later compromise may remain historically authentic if the trust framework can support that claim, while still becoming locally inadmissible under a stricter security policy.

```text
HISTORICALLY_AUTHENTIC != CURRENTLY_ADMISSIBLE
PRODUCER_REVOKED != CLAIM_AUTOMATICALLY_FALSE
CLAIM_NOT_PROVEN_CURRENTLY != CLAIM_FALSE
```

Propagation should target proof dimensions and dependents that consumed the affected evidence, preserving causal paths through `usedBy/composedOf` without treating those graph edges as business authority.

## 11. Release/promotion gating consumes vectors, not scores

A release/promotion gate should request a named evidence requirement vector rather than a single quality percentage:

```text
PromotionEvidenceRequirement
  targetStage
  subjectScope
  requiredDimensions[]
  minimumDispositionsByDimension
  allowedOriginClassesByDimension
  requiredIndependenceByDimension
  freshnessPolicyRefs[]
  securityFloorRefs[]
  corroborationRules[]
  unknownHandling
  exceptionPolicyRef?
```

Example dimensions remain independent:

```text
structural
interaction
semanticProjection
accessibility
responsiveDensity
performance
failureRecovery
composition
crossSurfaceContinuity
securityRelevantEvidence?
```

Rules:

```text
AVERAGE_SCORE >= X != GATE_SATISFIED
NINE_PASS + ONE_UNKNOWN != TEN_PASS
OPTIONAL_DIMENSION_FAIL != AUTOMATIC_HARD_BLOCK
HARD_REQUIRED_UNKNOWN != SUCCESS
WAIVER != PASS
GATE_PASS != RUNTIME_EFFECTIVE
```

A gate may be `SATISFIED`, `BLOCKED`, `CONDITIONALLY_SATISFIED`, `WAIVER_REQUIRED`, or `EVIDENCE_UNKNOWN`. These are admission dispositions, not product/runtime lifecycle states.

## 12. Waivers/exceptions

A waiver must preserve the unmet requirement rather than relabel it:

```text
EvidenceWaiver
  waiverId
  requirementRef
  subjectScope
  reason
  riskOwner
  authorizedBy
  validFrom
  expiresAt
  compensatingControls[]
  evidenceRefs[]
```

Invariants:

```text
WAIVED_FAIL != PASS
WAIVED_UNKNOWN != KNOWN
WAIVER_GRANTED != EVIDENCE_CURRENT
WAIVER_EXPIRED != HISTORICAL_GATE_REWRITTEN
```

Historical promotion records preserve which waiver/policy/revision admitted the artifact at that time.

## 13. State/lifecycle findings

Imported evidence lifecycle candidate:

```text
DISCOVERED
→ INGESTED
→ INTEGRITY_CHECKED
→ TRUST_QUALIFIED
→ SCOPE_PROFILE_QUALIFIED
→ CURRENTNESS_EVALUATED
→ LOCALLY_ACCEPTED | REJECTED | CORROBORATION_REQUIRED
→ CONSUMED_BY_CLAIM/GATE
→ STALE | REVOKED | SUPERSEDED | ARCHIVED
```

Trust qualification and evidence currentness are independently reevaluated. Reopening a catalog, restoring a Workspace or loading a previously accepted app must not silently reinterpret historical evidence under today's trust policy.

## 14. Componentization impact

### primitive / atomic

- `EvidenceOriginIndicator`
- `TrustQualificationIndicator`
- `EvidenceScopeMatchIndicator`
- `EvidenceCurrentnessIndicator`
- `GateRequirementIndicator`
- `WaiverIndicator`

### compound

- `ImportedEvidenceSummary`
- `ProducerTrustSummary`
- `EvidenceConflictSummary`
- `PromotionRequirementSummary`
- `GateDispositionSummary`

### module component

- `EvidenceQualificationPanel`
- `TrustDomainPolicyPanel`
- `PromotionEvidenceMatrix`
- `EvidenceConflictPanel`

### tool

- `ImportedEvidenceInspector`
- `ProducerQualificationInspector`
- `TrustRevocationImpactExplorer`
- `PromotionGateInspector`
- `EvidenceConflictReconciler`

### application/window/desktop/workspace/system view

Higher levels consume the same claim/evidence lineage but require their own composition proofs. A system view may aggregate qualification/gate status but cannot fabricate proof from aggregation.

Shared behavior: evidence lineage, scope/profile matching, trust/currentness disposition, keyboard-accessible inspection, causal invalidation.

Specialized behavior: proof-class-specific procedure semantics, accessibility AT profiles, performance environments, security trust floors, release-stage policy.

## 15. Accessibility

Trust and gate state must never rely on color or icons alone. Every imported evidence row needs textual origin, scope, currentness and disposition. Conflict/revocation relationships need keyboard-operable navigation and non-graph/tabular representation. Tooltips alone are insufficient for why evidence was rejected or why a gate is blocked.

Screen-reader order should expose requirement -> evidence -> qualification -> disposition -> remediation, rather than visual placement order.

## 16. Performance and scale

The active catalog should index qualification by subject/proof class/trust domain/currentness rather than re-verify every raw artifact on every render. Cached verification is itself evidence with dependency horizons:

```text
VERIFICATION_CACHE_HIT != TRUST_CURRENT
SIGNATURE_PREVIOUSLY_VALID != PRODUCER_CURRENTLY_QUALIFIED
```

Revocation impact should propagate through evidence-consumption indexes and typed `usedBy/composedOf` edges. High fanout may be virtualized/aggregated but counts, affected hard gates and unknowns must remain discoverable.

No silent cap may turn unprocessed evidence into PASS.

## 17. Failure/recovery

Failure classes include:

- unavailable external transparency/trust service;
- missing raw artifact but retained claim/provenance;
- signature/integrity mismatch;
- unknown producer;
- expired producer qualification;
- trust-root rotation/revocation;
- predicate/profile unsupported;
- subject digest mismatch;
- conflicting accepted evidence;
- gate evaluation interrupted mid-run.

Recovery must resume from durable evidence/gate lineage. It must not default interrupted or unverifiable checks to success.

```text
VERIFIER_UNAVAILABLE != EVIDENCE_INVALID
EVIDENCE_UNVERIFIABLE_NOW != EVIDENCE_VALID_NOW
GATE_EVALUATION_INTERRUPTED != GATE_PASSED
```

## 18. Adversarial scenarios

1. Signed third-party accessibility report references the wrong component revision.
2. Two independent-looking reports share the same scanner and execution backend.
3. Producer identity is valid but not qualified for performance claims.
4. Trust root is revoked after evidence production.
5. Producer compromise is known to predate evidence production.
6. Imported PASS conflicts with current local FAIL.
7. Imported FAIL conflicts with current local PASS.
8. Certification label matches by name but references a different normative profile revision.
9. Dependency supplier evidence is current, but parent composition evidence is stale.
10. Gate has nine required PASS dimensions and one `UNKNOWN` hard requirement.
11. A waiver exists but expired before promotion evaluation.
12. Browser/AT profile changed while source and imported report remained unchanged.
13. Signature verification service is offline during promotion.
14. Raw artifact was pruned but retained provenance/claim exists.
15. 10,000 imported evidence records are affected by producer revocation.
16. Client/workspace switch occurs while evidence conflict inspector is open.
17. Small-screen view hides matrix columns but must retain all gate requirements.
18. Evidence is copied from another tenant/client trust domain with identical component digest.

## 19. Proof obligations

1. Prove origin verification never implies local semantic acceptance.
2. Prove producer qualification is proof-class/scope/profile bounded.
3. Prove subject revision mismatch cannot yield local PASS.
4. Prove `UNKNOWN` hard requirements cannot be averaged away.
5. Prove waiver state remains distinct from PASS.
6. Prove trust revocation propagates to every consuming current claim/gate that materially depended on it.
7. Prove historical gate records remain interpretable after trust-policy evolution.
8. Prove conflicting evidence remains visible until qualified reconciliation.
9. Prove same producer/toolchain cannot accidentally satisfy a declared independence quorum.
10. Prove accessibility of evidence/gate inspection without graph or drag interaction.
11. Prove high-fanout revocation aggregation preserves affected counts and drill-down.
12. Prove verification cache reuse checks its own trust/currentness dependencies.
13. Prove cross-client evidence reuse requires explicit trust-domain qualification.
14. Prove imported child-component PASS does not auto-qualify parent composition.
15. Prove interrupted gate evaluation cannot become PASS after recovery.
16. Prove release/promotion gate consumes named requirement vectors, not an unqualified aggregate score.

## 20. Maturity and saturation

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

This slice materially closes the gap around imported/third-party evidence and promotion consumption, but does not freeze implementation, provider, cryptographic format, release workflow or policy language.

## 21. Remaining gaps / next vector

Highest-value next vector:

**cross-client/workspace trust-domain evidence portability and tenant isolation** — when identical component/application artifacts may reuse evidence across Client/Workspace boundaries, what must remain tenant-local, how delegated client access affects visibility versus trust, how confidential fixtures/results are redacted, and how shared catalog evidence avoids becoming a cross-tenant information side channel.

Secondary vector: promotion-policy evolution and historical replay — how a historical gate decision remains explainable under a later policy without pretending the old release was evaluated under the new policy.

## 22. Research-only conclusion

Imported evidence can reduce duplicate qualification work, but only when origin, trust, scope, semantics, currentness and local policy are separately qualified. The durable design principle is:

> external evidence contributes to a local decision; it does not outsource local authority.

`Research candidate != implementation authority` remains in force.