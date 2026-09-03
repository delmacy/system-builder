# Planning A — Governance / Compliance / Audit Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Governance / Compliance / Audit

This artifact defines semantic ownership and boundaries only. It makes no claim about current System Builder implementation and performs no Planning B archaeology, product work, Work Package, TASK, Construction, PR, or worker handoff.

## 1. Semantic owner

Governance / Compliance / Audit owns the canonical semantics required to answer **which obligation or control applies to which governed subject and scope, under which revision, what evidence qualifies the assessment, what exception or remediation state exists, and what auditable claim can be made without erasing historical truth**.

It owns:

- governance obligation and control-objective identity, revision, applicability and precedence semantics;
- compliance-profile and framework-mapping semantics without canonizing provider/regulator identifiers as SB identity by default;
- control assessment and attestation semantics, including evidence scope, coverage, currentness and producing revisions;
- governance findings, remediation commitments and closure/reopen lifecycle;
- exceptions, waivers and break-glass governance as explicit, scoped, revisioned, expiring and reviewable governance facts;
- audit-claim identity, lineage, correction, supersession and replay semantics;
- evidence requirements and evidence-reference semantics while leaving the underlying evidence source owned by its native capability;
- explicit `COMPLIANT / NON_COMPLIANT / PARTIAL / INCONCLUSIVE / NOT_APPLICABLE`-style assessment dispositions where the governed profile requires them;
- historical replay of assessments against the exact control, mapping, policy and evidence revisions that produced them;
- residual governance effects when a waiver, control revision, provider mapping or attestation is withdrawn or expires.

Governance does not own runtime authorization, canonical Person identity, telemetry storage, provenance stores, privacy-domain truth, PKI realization, provider discovery, workflow execution, security-control implementation or universal architecture normalization.

## 2. Source of truth and canonical identity

Canonical governance truth is the revisioned SB-owned set of obligations, control objectives, applicability rules, mappings, assessment records, exceptions/waivers, audit findings, remediation commitments and lineage-preserving corrections applicable to a governed scope.

Canonical identities relevant to this capability include at least:

- `GovernanceObligationIdentity` and revision;
- `ControlObjectiveIdentity` and revision;
- `ComplianceProfileIdentity` and revision;
- `FrameworkMappingIdentity` and revision;
- `AssessmentIdentity`;
- `AttestationIdentity`;
- `AuditFindingIdentity`;
- `ExceptionOrWaiverIdentity`;
- `RemediationCommitmentIdentity`;
- `EvidenceRequirementIdentity`;
- `AuditClaimIdentity`;
- explicit mappings to external framework/control/provider realization identities.

An ISO/NIST/regulator control code, cloud-provider control ID, GRC-system object ID, audit-platform record ID or evidence-provider identifier remains an external/realization identity unless an authorized adoption transition explicitly makes it canonical. Name/code equality is not semantic equivalence.

## 3. Obligation and control applicability

A governance obligation is meaningful only with explicit applicability. Applicability must be derivable from revisioned facts sufficient to explain why the obligation applies to a system, capability, Station, tenant, data class, operation, provider, environment or other governed subject.

Applicability should carry at least:

- canonical governed-subject/scope reference;
- obligation/control/profile revision;
- applicable organizational/tenant/Station context;
- jurisdiction, classification, environment or provider facts when relevant;
- mappings to external frameworks or regulator/provider controls, including mapping revision;
- validity/currentness horizon;
- explicit applicability disposition and rationale/provenance.

A previously applicable or satisfied control does not automatically remain current after a material change to the governed subject, policy, Station, provider binding, data residency, identity/authorization posture, runtime topology, trust chain, evidence source or another applicability-bearing revision.

## 4. Assessment, evidence and failure semantics

Compliance assessment is an applicability-scoped qualified claim, not a timeless boolean. An assessment must identify the governed subject, obligation/control/profile revision, evaluator/assessment method where relevant, evidence set, evidence currentness/coverage, producing revisions and assessment time.

The semantic outcome must distinguish at least:

- `COMPLIANT` — current qualified evidence satisfies the applicable control under the declared assessment profile;
- `NON_COMPLIANT` — current qualified evidence proves an applicable requirement is not satisfied;
- `PARTIAL` — only a bounded subset of the applicable scope/population/evidence requirement is qualified;
- `INCONCLUSIVE` — required evidence is missing, stale, ambiguous, conflicting, unverifiable or the evaluator/source cannot establish the claim;
- `NOT_APPLICABLE` — an explicit applicability decision establishes that the obligation does not apply to the declared governed scope/revision.

Missing, stale or partial evidence is never silently coerced into `COMPLIANT`. Failure or unavailability of an assessor/provider does not inherit an earlier PASS outside that result's evidence/currentness horizon.

A historical assessment remains replayable against its producing revisions but does not qualify a materially changed present state without re-evaluation.

## 5. Evidence ownership and lineage

Governance owns **what evidence is required, how evidence is referenced for a control/assessment, and what governance claim can be derived from it**. It does not become the owner of the evidence source itself.

Evidence may be produced by Artifact/Provenance, Observability, Authorization, Identity, Privacy, Security, PKI, Provider/Binding, Deployment, Workflow, Data or another domain owner. Governance references those authoritative facts through a qualified evidence envelope carrying source identity, producer revision, governed subject, applicability, freshness/currentness, coverage, uncertainty and replay horizon.

Audit evidence must not overwrite canonical truth of the underlying owner. A telemetry sample, signed artifact, authorization decision, certificate status or provider-native report remains owned by its source capability; Governance owns the assessment/claim that consumes it.

Corrections use lineage-preserving correction/supersession. Evidence or assessments are annotated/superseded rather than destructively rewritten when historical replay or auditability depends on the producing record.

## 6. Exceptions, waivers and break-glass governance

An exception/waiver is a first-class governance lease, not a deletion of the underlying obligation. It requires explicit:

- governed subject/scope;
- obligation/control and revision affected;
- issuing authority and authority basis;
- rationale and supporting evidence;
- effective time and expiry/review condition;
- compensating controls or restrictions where required;
- approval/review lineage;
- revocation/supersession state.

A waiver does not erase a finding, prove compliance, or grant unrelated operational permission. If an exception requires a runtime authorization change, that change must occur through the Authorization owner under an explicit authorized transition.

Break-glass governance may authorize an emergency exception process, but it does not allow AI, AGWS, a provider, a Station, or a lower organizational layer to manufacture authority outside the explicit superior envelope.

Expired/revoked waivers and exceptions require requalification. Residual caches, approvals, provider-side exemptions, automation workers or downstream evaluators that can still act as though the exception is active form a residual cohort and require drainage or bounded reconciliation.

## 7. Findings and remediation lifecycle

Governance owns the lifecycle of a compliance/audit finding as a governed claim about an observed or assessed gap. At minimum the lifecycle must preserve:

- finding identity and originating assessment/evidence lineage;
- affected obligation/control and governed subject;
- severity/priority semantics where profile-owned;
- remediation commitment, owner and target/review conditions;
- evidence of remediation attempt and validation;
- close, reopen, supersede and accept-risk/exception relations;
- producing revisions and historical replay.

Closing a finding does not rewrite the historical fact that it existed. A remediation action is not semantically complete merely because a workflow says `done`; validation must establish the required postcondition under current evidence.

## 8. Audit claims, correction and supersession

An audit claim is a revision-scoped statement supported by qualified evidence and assessment lineage. Audit history is append-preserving: corrections, reclassifications and supersessions preserve the original producing record and the authority/reason for the correction.

Provider-native audit reports may be retained as evidence, but their labels and statuses are not automatically canonical SB audit truth. A provider replacing or retracting a report triggers requalification of dependent claims rather than silent rewriting.

Historical audit replay must be able to distinguish what was known and valid under the producing revisions from what is currently qualified.

## 9. Boundary with Authorization / Policy / Organization / Multitenancy

Authorization owns runtime access/actuation policy and `ALLOW / DENY / INCONCLUSIVE` decisions for subject/action/resource context. Governance owns obligation/control applicability, assessments, exceptions/waivers, remediation and audit claims.

Therefore:

- a compliance obligation may require an authorization constraint but does not itself grant or deny runtime authority;
- a governance waiver does not implicitly create an operational permission;
- an authorization decision may be evidence for a governance assessment but does not become the assessment itself;
- organizational/Station authority used to approve a waiver is supplied by Authorization; Governance records the governed exception and its lifecycle;
- lower scopes cannot use governance customization to weaken superior mandatory authorization constraints.

## 10. Boundary with Privacy / Data Governance / Retention / Legal Hold / Residency

Privacy/Data Governance owns purpose/use limitation, data-subject obligations, retention/disposition, legal-hold precedence, residency/jurisdiction/transfer constraints and provider-qualified enforcement semantics.

Governance may express controls requiring those properties and assess evidence of their satisfaction, but it does not redefine retention eligibility, release a legal hold, move residency boundaries or authorize deletion. A `COMPLIANT` governance assessment never substitutes for the Privacy owner's current obligation resolution.

## 11. Boundary with Observability / Operations / Incident

Observability owns telemetry, freshness/coverage of operational observations, SLI/SLO, incident/remediation evidence and diagnostic semantics. Governance owns the control/assessment claim that consumes qualified operational evidence.

No monitoring dashboard, health status or absence of observed failures proves compliance by itself. Coverage/currentness must satisfy the governance evidence requirement, otherwise the assessment is `PARTIAL` or `INCONCLUSIVE`.

## 12. Boundary with Security / Resilience / Failure Recovery

Security/Resilience owns security posture realization, fencing, degraded-mode behavior, recovery qualification and failure-recovery semantics. Governance owns normative control obligations, assessment, evidence requirements, exception/waiver and audit lineage.

A security control implementation may satisfy a governance requirement, but Governance does not become the implementation owner. Conversely, a governance waiver cannot silently disable a security fence or recovery invariant unless the responsible capability receives an explicit authorized transition.

## 13. Boundary with Enterprise Trust / PKI / Certificate Lifecycle

Enterprise Trust/PKI owns trust anchors, certificate/path/revocation qualification, issuance, renewal/rotation and trust-provider substitution. Governance may require certificate assurance, rotation windows or trust properties and may assess their evidence.

A certificate/provider report is evidence, not a governance assessment. Governance cannot extend certificate validity, bypass revocation, create trust anchors or declare stale path evidence current.

## 14. Boundary with Provider / Binding / Capability Negotiation

Provider/Binding owns provider discovery, capability/support qualification, admission, binding, fallback, coexistence, cutover and withdrawal. Governance owns provider-neutral control and assessment semantics.

A provider-native GRC/control service may realize assessment or evidence collection, but provider control IDs, compliance statuses and framework mappings remain realization facts until explicitly mapped/adopted. Provider substitution must requalify at least:

- control/profile semantic coverage;
- evidence provenance, freshness and coverage;
- exception/waiver support and expiry semantics;
- assessment dispositions including partial/indeterminate behavior;
- audit/export/replay semantics;
- correction/supersession behavior;
- offline/self-hosted evidence closure where required.

Matching control names or certification labels does not prove semantic equivalence.

## 15. Boundary with Lifecycle / Versioning / Evolution / Migration

Lifecycle owns generic revision vectors, coexistence, migration readiness/currentness, withdrawal and rollback/state-recovery distinctions. Governance specializes those primitives for obligations, controls, mappings, assessments, waivers, findings and audit claims.

A control revision, framework remapping, waiver expiry or assessment-method change creates a new applicability context. Historical evidence remains replayable against the producing revision but cannot automatically qualify the new revision.

Cutover is incomplete while old evaluators, provider mappings, waiver caches or reports can still produce authoritative governance effects under withdrawn semantics.

## 16. Boundary with Architecture Reconciliation as a Capability

Architecture Reconciliation owns desired/product truth versus observed/effective truth, drift, ownership, conformance and governed normalization across architecture owners. Governance may define controls requiring architectural conformance and consume reconciliation evidence, but it does not become the universal drift/reconciliation owner.

A reconciliation result may open or close a governance finding only through the governance assessment lifecycle. Governance cannot silently normalize architecture truth to make a control appear satisfied.

## 17. Boundary with Artifact / Release / SBOM / Provenance

Artifact/Release/SBOM/Provenance owns artifact/release identity, SBOM/provenance, signatures, promotion/rollback and supply-chain lineage. Governance owns control obligations and assessments that reference those facts.

Signed provenance or a passing release gate is qualified evidence, not universal compliance. Governance must preserve the artifact/release/evidence revision that supported the claim.

## 18. Boundary with Identity / Authentication / Federation

Identity/Auth/Federation owns canonical subject identity, authentication assurance, sessions/credentials and federation relationships. Governance may require identity/authentication assurance and consume corresponding evidence.

Successful authentication never proves governance compliance by itself, and a governance exception does not create a new identity or authentication assurance level.

## 19. Boundary with Standards / Interoperability / API Contracts

Standards/API Contracts owns protocol, syntactic, structural, behavioral and semantic conformance contracts. Governance may map obligations to those conformance requirements and consume standards-conformance evidence.

A standards conformance result is not automatically a governance PASS outside the exact governed scope, revision and evidence horizon.

## 20. Boundary with AI-native Engineering / Agents / Approvals

AI-native Engineering owns AI/agent execution, model/prompt/tool qualification and approval mechanics assigned to that capability. Governance owns the control/obligation/assessment semantics that may constrain or assess AI use.

AI may assist evidence collection, classification or draft an assessment only inside explicit delegated authority. AI cannot create canonical policy/control truth, self-issue a waiver, self-attest beyond evaluator authority, broaden evidence validity or convert `INCONCLUSIVE` into `COMPLIANT`.

## 21. Boundary with Adaptive Governed Work Surfaces

AGWS remains a distinct CORE capability. It may render governance obligations, findings, review queues, evidence status and approval actions, but it does not own their canonical semantics.

`Enterprise → Station → Role → Person` remains monotonic and non-amplifying:

- Enterprise may impose mandatory controls and review/exception envelopes;
- Station may expose/administer only governance capabilities explicitly delegated to it;
- Role may operate within Station-delegated review/approval authority;
- Person receives only authority explicitly available through superior constraints and assignments.

A lower layer may specialize presentation or further restrict governance behavior but cannot remove a superior mandatory obligation, widen waiver eligibility, hide required evidence, enlarge expiry, redefine audit truth or grant itself compliance authority. Mandatory institutional components on governed surfaces remain non-removable where superior policy requires them, subject only to explicitly permitted placement treatment.

## 22. Boundary with Universal Capability Architecture

UCA supplies reusable structures such as qualified claims/evidence, semantic-vs-realization identity, revision vectors, `INCONCLUSIVE`, currentness horizons, lineage-preserving supersession, residual cohort drainage and non-amplifying authority. Governance specializes those structures for controls, assessments, exceptions and audit claims.

UCA cannot become a universal governance registry, global compliance truth table or normalizer that silently overrides owner-specific obligations.

## 23. Lifecycle and versioning

Material governance transitions include obligation/control creation/revision/withdrawal, framework/profile remapping, applicability-rule change, assessment issue/supersession, exception/waiver grant/revoke/expire, finding open/close/reopen, remediation validation, audit correction/supersession and provider/evaluator substitution.

Every transition preserves producing revisions and authority lineage. Historical claims remain replayable against their producing context. Current qualification requires re-assessment whenever applicability-bearing revisions change unless equivalence is explicitly proven.

## 24. Governance and observability requirements

Governance transitions and assessments require lineage sufficient to answer:

- which governed subject/scope was evaluated;
- which obligation/control/profile/mapping revisions applied;
- which actor/evaluator/provider participated and under what authority;
- which evidence sources/revisions/currentness/coverage were used;
- what assessment disposition and rationale were produced;
- what exception/waiver or remediation state affected the result;
- whether evidence was partial, stale, offline or otherwise bounded;
- what correction/supersession history exists;
- what residual governance cohorts remain after withdrawal or expiry.

Operational telemetry may report assessment latency, stale evidence, failed collection, expiring waivers, open findings or residual provider mappings; such observations do not silently mutate governance truth.

## 25. Portability and lock-in

The portable contract is provider-neutral obligation/control/applicability/assessment/exception/remediation/audit semantics plus explicit external mappings and evidence lineage.

Provider replacement must qualify support for control semantics, mapping fidelity, evidence provenance/currentness/coverage, assessment outcomes, exception/waiver expiry and review, historical export/replay, correction/supersession, self-hosted/offline closure and residual-provider drainage.

Portability is a support vector. Matching a framework logo, certification name or provider control identifier is insufficient.

## 26. Required cross-cutting contracts

Planning A preserves the following semantic contracts for later target-architecture work:

1. `GovernanceObligationAndRevision`
2. `ControlObjectiveAndRevision`
3. `ComplianceProfileAndMapping`
4. `GovernanceApplicabilityDecision`
5. `EvidenceRequirement`
6. `GovernanceEvidenceReference`
7. `ComplianceAssessment`
8. `AssessmentCurrentnessHorizon`
9. `Attestation`
10. `AuditFinding`
11. `RemediationCommitment`
12. `ExceptionOrWaiverLease`
13. `AuditClaim`
14. `GovernanceCorrectionOrSupersession`
15. `GovernanceProviderBinding`
16. `ResidualGovernanceCohort`

These are contracts, not implementation/module declarations.

## 27. Non-goals

This capability does not own:

- runtime permission/authorization decisions;
- canonical Person identity or authentication ceremonies;
- privacy retention, legal-hold, residency or purpose/use truth;
- raw telemetry/incident stores;
- security-control implementation or recovery mechanics;
- PKI/trust-anchor/certificate lifecycle;
- provider discovery/admission/cutover mechanics;
- artifact/SBOM/provenance source truth;
- workflow/integration execution mechanics;
- generic architecture drift normalization;
- a provider-specific GRC product, framework catalog or control ID namespace as canonical SB truth.

## 28. Planning B repository-validation questions

Later Planning B must inspect fresh `main` and answer, without assuming from research/planning artifacts:

1. What current SB contracts represent governance obligations, controls, compliance profiles, assessments, findings, waivers/exceptions and audit records?
2. Is governance/compliance semantically separate from runtime Authorization policy and decisions?
3. Can assessments express applicability, `PARTIAL`, `INCONCLUSIVE`, evidence coverage/currentness and producing revisions?
4. Are evidence requirements/references explicit while source evidence remains owned by native capabilities?
5. Are external framework/provider control IDs kept distinct from canonical governance identity and mapped explicitly?
6. Are exceptions/waivers explicit scoped leases with authority, rationale, expiry/review, compensating constraints and revocation lineage?
7. Does an exception/waiver require a separate Authorization transition before operational authority changes?
8. Are findings/remediation close/reopen/validation states lineage-preserving rather than destructive status overwrites?
9. Can audit corrections/supersessions preserve original historical claims and producing revisions?
10. Can historical assessments be replayed against their original control/mapping/evidence revisions?
11. How are stale evidence, provider/evaluator outage and partial coverage represented today?
12. How are residual provider mappings, waiver caches, evaluators or automation consumers drained after withdrawal/expiry?
13. Do current contracts prevent AI/AGWS/lower Station scopes from manufacturing policy, waivers or compliance authority?
14. Which current tests/evidence prove or contradict these boundaries?

These questions are deferred; this Planning A execution does not inspect `main` or infer answers.

## 29. Symbiotic boundary proof

The boundary is coherent if an Enterprise control applies to a governed Station under a known revision; evidence from Authorization, Observability, PKI or Artifact/Provenance can be referenced without transferring source ownership; stale or incomplete evidence yields `INCONCLUSIVE` rather than PASS; a scoped waiver can temporarily alter governance disposition without creating runtime authority; a provider-native control/evaluator can be replaced while canonical control and audit identities remain stable; historical assessments remain replayable after corrections or control revisions; and AGWS/AI can present or assist governance work only inside inherited authority without creating policy, exception or audit truth.

## 30. Planning A decision

**PASS_FOR_CAPABILITY.** Governance / Compliance / Audit has an explicit semantic owner, canonical source of truth, obligation/control applicability, assessment/evidence semantics, first-class uncertainty, exception/waiver lifecycle, remediation/audit lineage, correction/supersession rules, provider-neutral portability, neighboring-owner boundaries, AGWS/Station constraints and deferred repository-validation questions. No top-level split or merge is required by this Planning A pass.

This pass introduces no new research finding or capability candidate. It preserves the closed research/synthesis authority and advances Planning A for exactly this capability.