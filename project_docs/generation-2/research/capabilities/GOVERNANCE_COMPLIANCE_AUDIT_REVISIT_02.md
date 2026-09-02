# Governance / Compliance / Audit — Revisit 02

## Research question
How should Generation 2 represent governance intent, enforceable controls, control effectiveness, exceptions, audit evidence and delegated governance so that compliance remains evidence-qualified, provider-neutral, non-amplifying and portable across Enterprise → Station → Role → Person?

## Representatives
1. NIST OSCAL Assessment Layer / Assessment Results.
2. Azure Policy scope, assignments and exemptions.
3. AWS Audit Manager assessments and control evidence collection.
4. Open Policy Agent management APIs / decision logs / status.
5. HashiCorp Sentinel enforcement and override semantics.
6. AWS CloudTrail integrity validation.

## Evidence / source ledger
| Representative | Evidence | Architectural use |
|---|---|---|
| NIST OSCAL | https://pages.nist.gov/OSCAL/learn/concepts/layer/assessment/assessment-results/ ; https://pages.nist.gov/OSCAL/learn/concepts/layer/ | Assessment results are contextual to a plan/system, with observations, evidence, findings, risks and continuous or snapshot assessment. |
| Azure Policy | https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope ; https://learn.microsoft.com/en-us/azure/governance/policy/concepts/exemption-structure | Definition location, assignment scope, exclusions and exemptions are distinct. Exemptions remain tracked, can expire, require dedicated authority and can represent waiver or mitigation. |
| AWS Audit Manager | https://docs.aws.amazon.com/audit-manager/latest/userguide/create-assessments.html ; https://docs.aws.amazon.com/audit-manager/latest/userguide/setup-recommendations.html ; https://docs.aws.amazon.com/audit-manager/latest/userguide/review-controls.html | Evidence collection is ongoing, source-dependent and may collect nothing when dependencies are misconfigured. Review state is separate from ongoing collection. |
| Open Policy Agent | https://www.openpolicyagent.org/docs/management-decision-logs ; https://www.openpolicyagent.org/docs/management-status ; https://www.openpolicyagent.org/docs/management-introduction | Distributed policy evaluation has explicit decision identity, bundle revision, input/result, decision-log delivery and runtime/bundle status. Logging may mask/drop fields and delivery can fail or be rate-limited. |
| HashiCorp Sentinel | https://developer.hashicorp.com/sentinel/docs/concepts/enforcement-levels ; https://developer.hashicorp.com/terraform/tutorials/policy/policy-quickstart | Policy logic and enforcement level are separate; advisory/overridable/mandatory effects differ; overrides require privilege and are logged by integrations such as HCP Terraform. |
| AWS CloudTrail | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-validation-cli.html | Integrity validation detects mutation/deletion only for log files covered by digest files and has explicit prerequisites, proving integrity coverage is qualified rather than universal. |

## Source of truth, identity and lifecycle
Generation 2 should separate at least: `GovernanceIntent`, `ControlDefinition`, `ControlAssignment`, `EnforcementRealization`, `ControlEvaluation`, `EvidenceObservation`, `ControlEffectivenessAssessment`, `Exception/Waiver`, `AuditOccurrence`, `EvidencePackage`, `IntegrityVerification` and `RemediationDecision`.

A governance intent says what outcome is required. A control definition says what should be checked/prevented/detected/corrected. An assignment binds a control revision to a subject/scope. Enforcement realization records where/how a provider enforces it. Evaluation is a bounded result. Effectiveness is a claim over evidence, scope and time. None of these identities should be collapsed.

Exceptions/waivers require independent lifecycle: request → authority evaluation → grant/deny → active interval → expiry/revocation → revalidation. Expiry must end the authority effect without erasing the historical record.

## Versioning
Independent axes include governance-intent revision, control revision, framework/control mapping revision, assignment revision, enforcement realization revision, evidence schema revision, exception revision, trust-root/verifier revision and assessment/effectiveness revision. A later control revision cannot retroactively reinterpret old decision evidence without preserving which revision actually governed the operation.

## Failure semantics
`NON_COMPLIANT`, `COMPLIANT`, `EXEMPT`, `NOT_APPLICABLE`, `UNKNOWN`, `STALE_EVIDENCE`, `COLLECTION_FAILED`, `ENFORCEMENT_UNAVAILABLE`, `INTEGRITY_UNVERIFIED` and `REMEDIATION_FAILED` must remain distinguishable where relevant. Missing evidence is not compliance. A configured collector with broken upstream dependencies is not proof of control execution. A control that passed once is not continuously effective without an explicit freshness/coverage claim.

## Extensibility and provider boundaries
External policy engines, cloud governance systems, auditors, evidence collectors and transparency stores may realize governance capabilities, but provider vocabulary remains outside the canonical semantics. Universal objects should preserve subject/scope, intent/control identity, revision, applicability, decision/evaluation, evidence references, freshness/coverage, authority, exception lineage, integrity claims and verification results.

OPA demonstrates a useful provider boundary: distributed agents can evaluate locally while a management plane distributes bundles and receives status/decision logs. This supports a universal distinction between semantic control/evaluation and provider realization/telemetry.

## Governance, observability and audit
Governance consumes Observability evidence but must not equate telemetry presence with control effectiveness. Evidence quality needs explicit coverage and freshness. OPA decision logs can be masked, erased, dropped or rate-limited; AWS Audit Manager can collect no evidence when required sources are absent or misconfigured. Therefore a governance assessment must know not only what evidence exists but whether expected evidence was collectible and complete enough for the claim.

Audit occurrence, audit record retention, export, custody, integrity coverage and later verification remain separate. CloudTrail validation further demonstrates that tamper evidence applies only to digest-covered files and under explicit validation prerequisites.

## Delegated governance — Enterprise → Station → Role → Person
Governance inheritance is non-amplifying. Enterprise may establish mandatory controls and minimum evidence requirements. Station can specialize only delegated aspects within its capability exposure. Role and Person may add stricter constraints or request exceptions where authority permits, but cannot weaken superior invariants.

A Station managed by a superior SB must be able to consume governance assignments and evidence contracts without requiring the superior SB to own its runtime. Delegated administration requires explicit grant scope and should be independently auditable.

Adaptive Governed Work Surfaces may display control posture, required approvals, exceptions and remediation tasks. They do not gain authority to alter control definitions, canonical domain rules, provider credentials or remediation/deployment authority merely by rendering those controls. AI authoring must escalate requests that cross those boundaries.

## Commercial metering / relative complexity interaction
A newly stated product requirement is that future SB commercial support pricing may depend on measurable relative operational complexity per capability, combined with service bundles and usage-based billing. This run does not research or promote that concern as a new active capability because the authoritative rotation is Governance. However, Governance establishes an important requirement: any complexity/rating/billing claim used commercially should be based on versioned, inspectable evidence and policy, with separate authority for measurement, rating and payment. A candidate is registered for dedicated multi-representative research/negative-space treatment rather than being absorbed into Governance.

## Product-specific mechanisms vs universal primitives
**Universal:** governance intent; control definition; assignment; applicability; enforcement realization reference; evaluation; effectiveness assessment; evidence-quality/freshness/coverage claim; exception/waiver lifecycle; approval authority; audit occurrence; evidence package/custody; integrity verification; remediation decision; delegated governance grant.

**Provider-specific:** Azure assignment/exemption resource shapes; Sentinel enforcement-level vocabulary; Audit Manager assessment/control UI/state names; OPA bundle/decision-log wire format; CloudTrail digest/S3 validation mechanics; regulatory-framework-specific control catalogs.

## Convergent patterns
- Policy/control definition is separate from deployed enforcement and concrete evaluation.
- Evidence is contextual to subject, scope and time.
- Exceptions require distinct authority and lifecycle.
- Control effectiveness requires more than configuration presence.
- Missing/failed evidence collection must not silently become compliant.
- Auditability improves when decision evidence carries policy/control revision and execution context.

## Divergent patterns
- Providers disagree on enforcement modes, applicability and exemption vocabulary.
- Continuous assessment ranges from structured assessment models to provider dashboards.
- Audit integrity ranges from ordinary retention to cryptographic digest/transparency mechanisms.
- Some products centralize governance strongly; OPA demonstrates distributed enforcement with centralized management interfaces.

## Subcapabilities
Governance intent registry; control registry/mapping; assignment/applicability; preventive/detective/corrective enforcement; control evaluation; control-effectiveness assessment; evidence quality/freshness/coverage; exception/waiver governance; delegated governance; audit occurrence and decision evidence; evidence packaging/custody/integrity; continuous controls monitoring; remediation governance; provider/adaptor conformance.

## System Builder comparison — evidence bounded
Fresh-main GitHub searches for broad `governance compliance audit policy evidence approval exception waiver attestation`, plus targeted `AuditRecord` and `approval exception waiver policy decision evidence`, returned no sufficiently specific implementation contract. This is search evidence only and **not evidence of repository-wide absence**. Detailed repository archaeology remains deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE:** separate governance intent, control, assignment, enforcement realization, evaluation and effectiveness assessment.
- **HARDEN:** require compliance/effectiveness claims to carry applicability, evidence-quality, coverage, freshness and explicit unknown/failure states.
- **GENERALIZE:** model exception/waiver as durable, scoped, expiring authority with mitigation/reference and post-expiry revalidation.
- **PROVIDERIZE:** policy engines, compliance collectors, audit stores and integrity mechanisms remain provider realizations behind portable governance/evidence contracts.
- **INTEGRATE:** consume Authorization for authority decisions, Observability for evidence quality, Extension/Provider for admission evidence, AI Agents for supervised remediation and Lifecycle for revision/evolution semantics.
- **DO_NOT_BUILD:** do not let governance metadata become business-domain truth or automatically confer remediation/deployment authority.

## Repository-validation questions
1. Are there existing contracts that distinguish intent/control/assignment/evaluation/effectiveness?
2. Can evidence explicitly represent expected coverage, missing data, freshness and collection failure?
3. Do existing approvals/exceptions carry durable identity, scope, authority, expiry and revalidation semantics?
4. Can audit/decision evidence bind the exact policy/control revision and enforcement realization used?
5. Is provider audit export/custody/integrity separable from semantic occurrence?
6. Can governance be delegated across hierarchical SB/Station boundaries without runtime ownership transfer?
7. Can generated runtimes continue enforcing required controls and emitting evidence when disconnected from the SB control plane?
8. Can AGWS expose remediation actions without obtaining the underlying provider or deployment authority?
9. Where future commercial complexity/metering evidence lives must be determined without turning Governance into billing ownership.

## Symbiotic Proof
Configure the same semantic control requirement for a native SB realization and an external policy/compliance provider. Apply it to a Station, demonstrate one compliant evaluation, one non-compliant evaluation, one temporary authorized waiver, one evidence-collection failure producing `UNKNOWN` rather than compliant, and one remediation attempt whose authority is separately evaluated. Export the evidence package, replace the provider, verify historical decision/control revisions and exception lineage, and prove that a Person/AGWS surface cannot weaken the Enterprise/Station control or acquire remediation authority.

## Stable findings
- **G2-FINDING-GCA-17 — Governance Intent, Control Assignment, Enforcement Realization, Evaluation and Effectiveness Are Distinct Identities.** A configured or deployed control is not evidence that its intended outcome is currently effective.
- **G2-FINDING-GCA-18 — Compliance and Control-Effectiveness Claims Require Applicability, Coverage, Evidence Quality and Freshness; Missing Evidence Produces Unknown, Not Compliant.** Continuous governance must preserve uncertainty and collection failure explicitly.
- **G2-FINDING-GCA-19 — Exception/Waiver Authority Must Be Scoped, Delegated, Expiring and Historically Preserved, With Post-Expiry Revalidation.** Bypass is an independently governed decision rather than mutation or deletion of the superior policy.
- **G2-FINDING-GCA-20 — Audit Decision Evidence Must Bind the Governing Revision and Preserve Transformation/Delivery Gaps.** Decision identity, policy/bundle revision, masking/redaction, dropped evidence and export/custody must remain distinguishable.
- **G2-FINDING-GCA-21 — Continuous Controls Monitoring Is a Qualified Coverage Claim, Not a Boolean Capability.** Collector topology, expected sources, runtime status, observation window and integrity/freshness determine what may legitimately be asserted.
- **G2-FINDING-GCA-22 — Delegated Governance Is Non-amplifying Across Enterprise → Station → Role → Person; Governance Metadata or Observation Does Not Confer Canonical or Remediation Authority.** AGWS and AI may surface or request governed actions but must escalate authority-changing mutations.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-CONTROL-EFFECTIVENESS-EVIDENCE-QUALITY` — CROSS_CUTTING; promotion requires convergence with Observability, Security/Resilience and Product Proof acceptance.
- `G2-CAPABILITY-CANDIDATE-DELEGATED-GOVERNANCE-INHERITANCE-CONFORMANCE` — CROSS_CUTTING; promotion requires convergence with Authorization, Provider/Binding and hierarchical Station research.
- `G2-CAPABILITY-CANDIDATE-CONTINUOUS-CONTROL-COVERAGE-UNKNOWN-STATE` — CROSS_CUTTING; promotion requires convergence with Observability and runtime-autonomy evidence semantics.
- `G2-CAPABILITY-CANDIDATE-RELATIVE-OPERATIONAL-COMPLEXITY-METERING-RATING` — CROSS_CUTTING / PENDING_RESEARCH; user-stated structural product need for support pricing by measurable capability complexity, bundles and usage. Must be researched separately with commercial metering/rating/billing/payment representatives before promotion; Governance owns only evidentiary/audit constraints, not billing semantics.

## Value / risk / priority / next question
**Value:** very high — governance becomes trustworthy only if control effectiveness, exceptions and evidence gaps are explicit rather than inferred. **Risk:** high if Governance absorbs Authorization, Observability, commercial billing, business rules or provider semantics. **Priority:** foundational cross-cutting input to synthesis and the later Enterprise Completeness review. **Next question:** how Secrets / Configuration / Environment Portability separates secret semantic identity, secret material, configuration intent, environment realization, rotation and disclosure evidence across disconnected/provider-replacement scenarios.

## Saturation assessment
Revisit 2 produced six material architectural findings. Principal representatives are deeply covered, but `consecutive_no_material_finding = 0`; therefore Governance / Compliance / Audit remains **NOT SATURATED**.