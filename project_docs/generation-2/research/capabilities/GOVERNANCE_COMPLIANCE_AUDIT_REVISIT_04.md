# Governance / Compliance / Audit — Revisit 4 / Cycle 5

## Research question
What universal contracts let System Builder express governance, compliance and audit as revision-bound, evidence-qualified, non-amplifying semantics without pretending that evidence collection, automated control checks, framework mappings or AI output are themselves authoritative compliance judgments?

## Representatives and evidence ledger
1. **NIST SP 800-53A Rev.5 + IR 8011** — control assessment procedures separate selection/implementation/assessment/monitoring; IR 8011 identifies controls/test objectives suitable for automatable continuous monitoring. Source of truth: NIST CSRC.
2. **NIST OSCAL Profiles** — imported catalogs are tailored through explicit import/merge/modify operations; mappings/baselines are realizations derived from source catalogs, not timeless aliases. Source of truth: NIST OSCAL.
3. **AWS Audit Manager** — frameworks/controls drive ongoing evidence collection; evidence may be automated or manual and may be explicitly `inconclusive`; collected evidence assists audits but does not itself determine legal/compliance truth. Framework sharing snapshots are independent copies and can drift from their source. Source of truth: AWS documentation.
4. **Open Policy Agent** — centrally distributed policy/data bundles, discovery configuration, status and decision-log channels demonstrate revisioned policy distribution and separately observable evaluation. Source of truth: OPA documentation.
5. **OpenControl / compliance-as-code** — useful convergence evidence for machine-readable compliance artifacts and continuous delivery integration; not treated as universal compliance authority.

## Canonical semantic decomposition
`RequirementRevision → ControlObjectiveRevision → Applicability/ScopeRevision → FrameworkMappingRevision → ImplementationClaim → EvidenceObservation → EvidenceSelection/Package → AssessmentAttempt → AssessmentDecision → Finding/Risk → Exception/WaiverRevision → RemediationReference → Closure/PostconditionEvidence`.

No arrow implies automatic authority escalation. A provider may collect evidence without being allowed to assess; an assessor may assess without being allowed to remediate; an exception approver may accept bounded residual risk without changing the underlying requirement.

## Identity, lifecycle and versioning
Requirement/control identity must remain distinct from framework-specific identifiers and mappings. Applicability is a revisioned decision over subject, jurisdiction, Station/tenant, system profile and time. Framework mappings are many-to-many derived artifacts and become stale when either side or tailoring changes. Assessment identity binds the exact control/applicability/evidence-policy revisions and covered subject set. Waivers/exceptions require issuer, scope, rationale, compensating conditions, effective interval, expiry/revocation and residual-risk lineage.

## Failure semantics
`PASS`, `FAIL`, `PARTIAL`, `INCONCLUSIVE`, `NOT_APPLICABLE`, `EXEMPT_WITH_ACTIVE_WAIVER` and `STALE` must not collapse. Missing collector/provider coverage, stale observations, broken integrity/retention, unknown Station coverage or unresolvable mapping prevents a positive conclusion. AWS Audit Manager explicitly distinguishes inconclusive evidence from failure and requires manual evaluation where automated evaluation is unavailable.

Evidence collection can be partially successful. Report/package generation is a selection operation over evidence and does not upgrade evidence quality. Audit closure does not prove remediation or current compliance if evidence, requirement, applicability or implementation revisions have changed.

## Governance and authority
Facets remain independent: `RequirementAuthority ≠ ApplicabilityAuthority ≠ EvidenceCollectionAuthority ≠ EvidenceSelectionAuthority ≠ AssessmentAuthority ≠ ExceptionApprovalAuthority ≠ RemediationAuthority ≠ AuditClosureAuthority`.

Delegation follows `Enterprise → Station → Role → Person`. A Station may receive authority to assess or administer a bounded subset but cannot weaken enterprise invariants, enlarge its own scope, self-approve a prohibited exception or reinterpret a mandatory component as optional. Higher-level policy can delegate placement/presentation flexibility in AGWS without delegating removal of mandatory governance surfaces.

## Evidence integrity, retention and freshness
Evidence qualification depends on subject identity, observation time/window, collector/provider identity, collection policy, integrity/provenance, retention availability and coverage. Retention is not merely storage configuration: AWS Audit Manager documents finite evidence retention and permanent deletion modes, so historical auditability can disappear even while framework objects remain. Local/offline closure must therefore prove retained evidence, policy/control revisions, trust material and synchronization/reconciliation position.

## Continuous controls and provider boundaries
Automatable tests are evidence-producing/evaluating mechanisms, not universal compliance semantics. Continuous-control evaluation must report coverage and collector health. Provider replacement requires overlap or requalification of mappings, collector semantics, evidence identity/integrity, retention, decision semantics and scope. A healthy replacement provider does not inherit prior assessment validity automatically.

## Cross-framework mapping drift
A mapping `Control A ↔ Requirement X` is a revision-bound assertion with provenance and confidence/rationale. OSCAL profile import/merge/modify semantics demonstrate that tailored baselines can materially differ from source catalogs. Shared framework snapshots in AWS Audit Manager can independently drift. Therefore cross-framework reuse must not silently propagate a prior PASS across changed mappings or tailoring.

## AI-native boundary
AI may classify, summarize, propose mappings, draft assessment rationale or assemble candidate evidence packages. It must not silently convert incomplete evidence to PASS, self-approve waivers, widen applicability, mutate canonical requirements, fabricate provenance or actuate remediation. Deterministic validators and authorized human/system decision points own admission of AI-produced governance artifacts.

## AGWS boundary
AGWS remains distinct from generic UI. It may project control status, findings, approvals and evidence references through governed components. Personal overlays cannot hide mandatory institutional components when policy forbids it; personal automation cannot waive controls, alter retention, broaden evidence visibility or actuate remediation beyond effective Station/Role authority. Revalidation is required after Station/Role/policy/applicability/provider revision changes.

## Portability and lock-in
Universal primitives: requirement/control identity, applicability, mapping, evidence qualification, assessment decision, finding/risk, waiver/exception, remediation reference, retention/coverage and audit lineage. Product-specific mechanisms include AWS framework libraries/evidence folders, OPA bundles/log sinks and specific NIST catalog/profile structures. Preserve portable semantic artifacts above provider-native IDs and report formats.

## Convergent patterns
- evidence collection and compliance judgment are separate;
- automated checks cover only explicitly testable objectives;
- tailoring/mapping changes invalidate inherited conclusions;
- evidence quality includes coverage/freshness/integrity, not mere existence;
- delegation is bounded and role-specific;
- exceptions are lifecycle objects, not booleans;
- audit/report closure is not remediation/postcondition proof.

## Divergences
Products differ on framework ownership, automated evaluation, retention defaults, organization delegation and mapping vocabulary. These are provider/policy realizations, not reasons to collapse universal semantics into one compliance engine.

## SB comparison — bounded evidence only
A fresh-main bounded GitHub code search for `AuditEvidence Governance compliance waiver assessment control` returned no matches. This is not evidence of repository-wide absence and creates only repository-validation questions; the research branch is not treated as product truth.

## Reconciliation hypotheses
- **GENERALIZE** revision-bound governance subjects, applicability, mapping and evidence qualification.
- **HARDEN** coverage/freshness/integrity and `PARTIAL/INCONCLUSIVE` semantics.
- **PROVIDERIZE** framework catalogs, collectors, policy engines, report stores and regulatory feeds.
- **INTEGRATE** remediation references with Workflow/Integration/Deployment without transferring governance ownership.
- **KEEP** audit/assessment authority separate from remediation/actuation authority.
- **DO_NOT_BUILD** a universal legal-compliance oracle or universal framework-specific rule engine.

## Repo-validation questions
1. Does fresh main already distinguish requirement/control identity from provider/framework IDs?
2. Are applicability, evidence and assessment revisions first-class or embedded in generic audit records?
3. Can evidence express coverage, freshness, integrity and inconclusive outcomes?
4. Is exception/waiver expiry/revocation modeled separately from policy mutation?
5. Can Station-scoped delegated administration be represented without weakening enterprise invariants?
6. Do existing provider/binding contracts support collector replacement without inheriting stale assessment state?

## Symbiotic Proof
A system maps one enterprise control to two external frameworks, delegates evidence review for one Station, collects automated and manual evidence, loses one collector during the assessment window, and receives an AI-proposed mapping update. The effective result must remain `INCONCLUSIVE/PARTIAL` for uncovered scope; the AI mapping remains a proposal until deterministically validated/authorized; an expiring waiver does not mutate the requirement; replacing the collector requalifies evidence rather than inheriting PASS; and AGWS can display/organize the work without hiding mandatory controls or granting remediation authority.

## Stable findings
- **G2-FINDING-GCA-30** — Requirement/Control Identity, Applicability, Framework Mapping, Evidence, Assessment, Finding, Waiver and Remediation Closure Are Distinct Revision-bound Subjects.
- **G2-FINDING-GCA-31** — Evidence Existence or Collection Success Is Not Compliance; Positive Assessment Requires Qualified Coverage, Freshness, Integrity, Applicability and Authorized Decision Evidence.
- **G2-FINDING-GCA-32** — Continuous-control Automation Must Expose Testable-objective and Coverage Boundaries; Missing or Unevaluable Scope Produces PARTIAL/INCONCLUSIVE Rather Than Implicit PASS.
- **G2-FINDING-GCA-33** — Cross-framework Mapping and Tailoring Are Revision-bound Derived Artifacts; Mapping Drift Invalidates Reused Assessment Conclusions.
- **G2-FINDING-GCA-34** — Exception/Waiver Is a Governed, Expiring and Revocable Risk-acceptance Lifecycle; It Does Not Mutate the Underlying Requirement or Prove Remediation.
- **G2-FINDING-GCA-35** — Assessment, Exception Approval, Remediation Actuation and Audit Closure Are Non-amplifying Authority Facets Across Enterprise→Station→Role→Person.
- **G2-FINDING-GCA-36** — Auditability Depends on Retention and Evidence Availability; Framework Persistence or Report Closure Cannot Substitute for Retained Qualified Evidence.
- **G2-FINDING-GCA-37** — Governance-provider Replacement and Local/Offline Operation Require Requalified Mapping, Collector, Evidence, Retention and Decision Closure; Provider Reachability Alone Is Insufficient.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-GCA-QUALIFIED-COMPLIANCE-ASSESSMENT-EVIDENCE-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-GCA-REVISION-BOUND-CROSS-FRAMEWORK-MAPPING` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-GCA-GOVERNED-EXCEPTION-WAIVER-LIFECYCLE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-GCA-QUALIFIED-LOCAL-AUDIT-RETENTION-CLOSURE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

No candidate is promoted this run; all converge with existing evidence qualification, revision lineage, faceted authority and qualified-local-closure primitives.

## Architecture proof-backfill obligations
1. Positive: complete fresh evidence across required scope yields an authorized assessment bound to exact revisions.
2. Negative: evidence exists but a required Station/collector is missing → no PASS.
3. Failure: collector/report provider partially fails → PARTIAL/INCONCLUSIVE with preserved lineage.
4. Version: framework mapping or applicability changes after PASS → prior assessment becomes stale for the changed subject.
5. Authority: delegated reviewer cannot approve own prohibited waiver or actuate remediation outside grant.
6. Waiver: expiry/revocation restores noncompliance visibility without mutating requirement identity.
7. Retention: deleted/expired evidence prevents unsupported historical re-verification.
8. Provider: collector/framework-provider replacement requires overlap/requalification before inherited conclusions.
9. AI/AGWS: AI proposal and personalized surface cannot bypass deterministic validation, mandatory components or authority.
10. Local/offline: audit closure reports retained evidence and reconciliation position; unavailable evidence remains explicit.

## Value / risk / priority / next question
**Value:** high — supplies constitutional semantics for every regulated or policy-governed capability. **Risk:** high if evidence, judgment and remediation are collapsed. **Priority:** structural cross-cutting. **Next question:** how Secrets / Configuration / Environment Portability binds secret/config revisions, trust, environment overlays and portability without leaking values or allowing lower scopes to weaken higher invariants.