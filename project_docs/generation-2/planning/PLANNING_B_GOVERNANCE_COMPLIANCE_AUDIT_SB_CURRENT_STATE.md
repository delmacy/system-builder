# Planning B — Governance / Compliance / Audit — SB Current State

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Capability: Governance / Compliance / Audit
Fresh main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact is repository archaeology only. It does not design target architecture, execute product code, materialize TASKs or Work Packages, start Construction, open a PR, or perform worker handoff.

## Current implementation evidence

Fresh main evidences **two bounded governance/audit foundations**, but not a complete product-level Governance / Compliance / Audit capability.

First, the repository execution-governance layer has deterministic gate and waiver semantics. `tooling/agent-harness/src/execution-contracts.ts` defines dependency-gate states `UNSATISFIED | SATISFIED | WAIVED`, requires evidence for `SATISFIED`, and requires an explicit waiver carrying `authority`, `rationale`, `risk_acceptance` and `evidence_ref`. It rejects waiver payloads on non-waived gates. `project_docs/execution_governance/GOVERNANCE_GATES.md` independently documents mandatory architecture/contract/data/security/scope/release/evaluator gates and states that missing evidence is not an implicit waiver. This is meaningful evidence that SB development governance already treats exceptions as explicit evidenced facts rather than silent bypasses.

Second, `packages/contracts/decision-boundary/critical-decision-audit.ts` provides a narrow product-facing audit projection for critical decisions. It accepts only verification results established by the canonical decision-boundary verifier, validates correspondence between normalized decision identity/category/risk/criticality/reference and the verification result, and projects bounded audit evidence. The projection deliberately does **not** create approval, authorization, provider, credential or arbitrary payload semantics. `tests/product/p15-critical-decision-audit-projection.test.ts` proves deterministic, human-decision and probabilistic critical evidence projections and rejects non-critical, invalid and mismatched verification evidence.

Fresh main also contains an explicit future `project_docs/43-policy-compliance-plane/` scope/WBS. Its declared scope includes policy/control requirements, applicability, evidence, compliance status and exceptions/waivers; its WBS calls for policy/control/requirement/applicability models, jurisdiction/organization/effective-period context, versioned policy/control mappings, evidence/control status, nonconformance/missing-evidence detection, exception/waiver/compensating-control management, compliance packages and re-evaluation when policy/jurisdiction changes. These documents are planning evidence only. They are **not evidence that the product models or runtime currently implement those semantics**.

## Evidenced strengths and dispositions

- **KEEP** explicit evidence-bearing gate semantics where a satisfied state requires evidence rather than assumption.
- **KEEP** explicit waiver semantics requiring authority, rationale, risk acceptance and evidence in the execution-governance substrate.
- **KEEP** the critical-decision audit projection's refusal to manufacture approval, authorization, provider identity, credentials or arbitrary payload truth.
- **KEEP** canonical-verification provenance checks before projecting critical audit evidence.
- **HARDEN** audit evidence identity, revision, applicability, currentness, coverage and correction/supersession semantics; current critical-decision projection is deliberately narrow and largely timeless.
- **GENERALIZE** reusable evidence/waiver/audit primitives only where Generation 2 owner boundaries require them; the execution-governance model is not itself the canonical product GRC model.
- **INTEGRATE** Governance with Authorization, Privacy/Data Governance, Observability, Security/Resilience, Enterprise Trust/PKI, Provider/Binding, Lifecycle and UCA rather than duplicating those owners.
- **DEFER** implementation claims for the documented Policy & Compliance Plane: the WBS establishes intent, not current product truth.

No fresh-main evidence supports `REPLACE`, providerizing canonical governance semantics, or treating repository-development governance as a completed enterprise compliance product.

## Gaps against Planning A boundaries

Current main does **not evidence** a product-level implementation of:

1. canonical revisioned `GovernanceObligationIdentity`, `ControlObjectiveIdentity`, `ComplianceProfileIdentity`, `FrameworkMappingIdentity` or applicability truth;
2. explicit obligation/control applicability resolution over system, capability, Station, tenant, data class, provider, environment, jurisdiction or other governed scopes;
3. `COMPLIANT / NON_COMPLIANT / PARTIAL / INCONCLUSIVE / NOT_APPLICABLE` assessment semantics with evidence coverage/currentness and producing revisions;
4. first-class `AssessmentIdentity`, `AttestationIdentity`, evidence requirement identity, assessment method/evaluator provenance or historical assessment replay;
5. provider-neutral external framework/control mappings with explicit adoption/revision semantics;
6. product governance exceptions/waivers as revisioned, expiring, reviewable leases carrying governed scope, affected obligation/control revision, compensating controls, approval lineage and revocation/supersession;
7. break-glass governance distinct from operational authorization, including proof that an exception cannot amplify runtime authority;
8. audit finding identity and lifecycle covering open/close/reopen/supersede, accept-risk/exception relation, remediation owner/commitment and current validation evidence;
9. remediation closure semantics proving a current postcondition rather than accepting workflow completion as proof;
10. audit-claim identity, append-preserving correction/supersession, historical replay and explicit distinction between producing truth and current qualification;
11. stale/partial/conflicting/unverifiable evidence flowing to `PARTIAL` or `INCONCLUSIVE` rather than an inferred PASS;
12. residual-governance cohort drainage after waiver expiry/revocation, control revision, provider mapping withdrawal or evaluator substitution;
13. qualified provider substitution for GRC/evidence services, including semantic coverage, evidence provenance/currentness, exception lifecycle, replay/export and correction semantics;
14. offline/self-hosted governance evidence closure with bounded currentness/requalification;
15. Generation 2 `Enterprise → Station → Role → Person` governance delegation/non-amplification proofs, including Station-scoped administration of only delegated governance capabilities;
16. AI/AGWS proof preventing self-issued waivers, hidden mandatory controls/evidence, fabricated compliance evidence or coercion of `INCONCLUSIVE` into `COMPLIANT`.

## Distinguishing repository governance from product governance

The current agent/execution-governance contracts are strong evidence for useful **mechanisms**: evidence-required gates, explicit waivers, bounded authority references and auditable execution state. They are not evidence that the generated enterprise systems have a canonical compliance ontology or assessment runtime.

Likewise, the critical-decision audit projection proves a narrow auditability primitive around verified critical decisions. It does not establish universal audit-log storage, compliance applicability, control assessment, finding/remediation lifecycle, exception expiry, regulatory mappings or enterprise attestation.

Planning B therefore treats those elements as reusable existing truth to **KEEP/HARDEN/GENERALIZE**, while treating `project_docs/43-policy-compliance-plane/**` as forecast/planning evidence that remains unimplemented until future fresh-main archaeology proves otherwise.

## Boundary preservation

Authorization / Policy / Organization / Multitenancy remains owner of runtime permission decisions and delegated operational authority. A governance waiver may document an exception but cannot itself grant runtime access; the existing execution-governance waiver contract is positive conceptual precedent because it records waiver evidence separately from executor routing/authority semantics.

Privacy / Data Governance remains owner of purpose/use, retention, legal hold, residency and transfer constraints. Governance may eventually assess those facts but current main provides no evidence that compliance status overrides them.

Observability remains owner of telemetry and operational evidence freshness/coverage. Governance consumes qualified evidence; it must not infer compliance from mere signal presence or absence.

Security / Resilience remains owner of security-control realization, fencing, degraded behavior and recovery. The repository explicitly documents that compliance checklists are not sufficient proof of security in the security-plane scope; Governance must not absorb security implementation truth.

Enterprise Trust / PKI remains owner of certificate/path/revocation/trust semantics. Provider-native certificate or attestation reports would be evidence inputs, not canonical governance truth.

Provider / Binding remains owner of provider discovery/admission/binding/substitution. The current critical-decision audit projection is intentionally provider-free, which is positive evidence against accidental provider identity canonization.

Lifecycle owns generic revision/coexistence/migration/withdrawal primitives; Governance must specialize them for obligations, mappings, assessments, waivers, findings and audit claims.

UCA remains the reusable source for qualified claims/evidence, revision vectors, `INCONCLUSIVE`, currentness, correction/supersession and residual-cohort patterns. It must not become a semantic compliance god-object.

## Enterprise → Station → Role → Person assessment

Fresh main does not evidence first-class Station-scoped governance applicability, delegated governance administration, mandatory inherited controls, lower-layer review/exception envelopes or monotonic governance specialization across `Enterprise → Station → Role → Person`.

The existing execution-governance rule that waivers require explicit authority/rationale/risk acceptance/evidence is compatible with non-amplification, but it is a development-pipeline mechanism and cannot be promoted into an enterprise hierarchy implementation claim.

AGWS therefore remains presentation/composition only for this capability. No evidence supports AGWS creating obligations, widening waiver eligibility, hiding mandatory evidence, self-attesting compliance or generating operational authority.

## Maturity / portability / providerability assessment

**Auditability primitives: implemented and product-tested in a narrow bounded slice.** Canonical verification provenance, mismatch rejection and bounded critical-decision audit projection are concrete product evidence.

**Execution governance primitives: implemented for the repository/agent pipeline.** Evidence-required gates and explicit waivers are real operational mechanisms but are not generated-system GRC capability.

**Enterprise Governance / Compliance / Audit product capability: planned / structurally anticipated, not implemented as a complete semantic owner.** The dedicated Policy & Compliance Plane WBS is explicit about intended models and workflows, but fresh main does not evidence corresponding canonical product contracts/runtime/tests.

Portability is favorable for the existing critical-audit primitive because its projection contains canonical references rather than provider IDs. Providerability for compliance assessment/evidence collection is not qualified: no support-vector, external-control mapping, cutover, historical export/replay or residual-provider drainage semantics are evidenced.

## Planning B result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.** Fresh main contains valuable foundations — deterministic evidence-bearing development gates and waivers plus a product-tested canonical critical-decision audit projection — while the broader Policy & Compliance Plane remains documented future work rather than implemented product truth. The material Generation 2 gaps are revisioned obligations/controls/applicability, qualified assessment outcomes including `PARTIAL/INCONCLUSIVE`, evidence lineage/currentness/coverage, product-level exception/waiver and break-glass lifecycle, finding/remediation semantics, append-preserving audit claims/corrections, residual-governance drainage, provider qualification/substitution, offline closure, and `Enterprise → Station → Role → Person` non-amplifying governance delegation. The evidenced direction is predominantly **KEEP + HARDEN + GENERALIZE + INTEGRATE**, with **DEFER** only for implementation claims that the repository currently documents but does not realize. No replacement decision is supported in Planning B.
