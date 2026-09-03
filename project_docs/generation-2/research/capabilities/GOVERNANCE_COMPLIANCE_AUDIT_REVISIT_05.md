# Governance / Compliance / Audit — Revisit 5 / Cycle 6

## Research question
Which additional contracts are required so Governance / Compliance / Audit can distinguish obligation, control design, implementation, operating effectiveness, evidence population, assessment, exception and historical audit truth while remaining portable across policy/compliance providers, delegated Stations and offline operation?

## Representatives and evidence/source ledger
1. **NIST SP 800-53A Rev.5 (Release 5.2.0 noted 2025-08-27)** — assessment procedures remain customizable and use explicit assessment methods; NIST defines examine/interview/test as evidence-gathering actions. Source of truth: NIST CSRC.
2. **NIST OSCAL Assessment Results + SSP models** — assessment results separate observations, risks and findings; SSP distinguishes organization/system-specific/customer-configured/customer-provided/inherited control origination. Source of truth: NIST OSCAL.
3. **AWS Audit Manager** — evidence collection can be automated or manual; evidence becomes `inconclusive` when automated evaluation is unavailable; one compliance-check evidence item may cover multiple resources; evidence retention and evidence-finder backfill have independent availability windows; AWS explicitly states Audit Manager assists evidence collection but does not itself assess legal/compliance truth. Source of truth: AWS documentation.
4. **Open Policy Agent (OPA)** — policy decision and enforcement are decoupled; decision logs bind decision IDs to bundle revisions but log upload can fail/drop events; discovery bundles have a bootstrap trust boundary and can persist for recovery. Source of truth: OPA documentation.
5. **Azure Policy exemptions** — exemptions are scope-bound resources, require distinct exemption permission, may expire while the record remains for archival tracking, and can be gradually scoped by resource selectors. Source of truth: Microsoft Learn.

## Research-by-exception result
Cycle 5 already established that evidence collection is not compliance judgment, mapping is revision-bound, waivers are lifecycle objects and provider replacement requires requalification. Cycle 6 therefore tested the harder exceptions: inherited controls, sampled/partial populations, policy/log loss, immutable-versus-correctable audit records, expired exemptions that remain archived, historical re-verification after provider/trust change, and delegated/offline governance.

## Universal primitives and semantic ownership
`ObligationRevision`, `ControlObjectiveRevision`, `ControlDesignRevision`, `ControlImplementationRevision`, `ControlOperatingState`, `ApplicabilityRevision`, `ControlInheritanceClaim`, `FrameworkMappingRevision`, `EvidenceObservation`, `EvidencePopulationDescriptor`, `SamplingPlanRevision`, `AssessmentAttempt`, `AssessmentDecision`, `Finding/Risk`, `ExceptionLeaseRevision`, `AuditRecord`, `AuditCorrection/Supersession`, `Retention/HoldDisposition`, `HistoricalVerificationResult`.

Semantic ownership is not transferred by correlation: regulation IDs, provider control IDs, policy bundle revisions, cloud resource IDs and audit-log IDs are provider/framework identities unless explicitly mapped to canonical subjects.

## Identity, lifecycle and effective qualification
The capability must not collapse `obligation == control == implementation == evidence == assessment == audit-record`. OSCAL demonstrates that implementation origin can be organization, system-specific, customer-configured, customer-provided or inherited; inherited implementation therefore needs its own identity and responsibility lineage.

A positive governance conclusion is qualified by at least:
`obligation/control revision × applicability/scope revision × design revision × implementation revision × inherited-control dependency revision × evidence policy × population/coverage × sampling plan × evidence freshness/integrity × assessor/authority revision × exception state × trust/provider revision × Station exposure`.

Material change on any required axis stales prior effectiveness evidence for the affected scope. A policy definition can remain textually unchanged while implementation, inheritance source, covered population or evidence collector changes.

## Control design, implementation and operating effectiveness
Design adequacy, implementation presence and operating effectiveness are independent facts. NIST assessment methods explicitly gather evidence through examine/interview/test rather than treating a declared control as proof. Therefore SB must represent at minimum `DESIGN_ACCEPTED → IMPLEMENTATION_CLAIMED/OBSERVED → OPERATING_EVIDENCE_COLLECTED → EFFECTIVENESS_ASSESSED`.

A well-designed control may be absent; an implemented control may be ineffective; a provider check may show a current pass while historical operating coverage is incomplete.

## Population, coverage, sampling and inheritance
Evidence quality requires an explicit expected population or justified sampling frame. AWS notes that one compliance-check evidence item may contain results for multiple resources, so evidence-item count is not population coverage. Sampling needs population identity, selection rule, sample size, window and known exclusions. Missing population membership or collector loss yields `PARTIAL/INCONCLUSIVE`, not implicit PASS.

Inherited controls add another coverage dimension: the inheriting system must prove that the upstream control and inheritance relationship apply to the current subject and window. A PASS in the provider system is not transitively inherited without dependency and scope evidence.

## Audit immutability, correction and supersession
Immutability must mean prior records cannot be silently rewritten, not that mistakes can never be corrected. Corrections require append-only lineage: `original_record → correction/supersession record → reason/authority/time`; retention/legal hold independently governs eventual disposition. An expired Azure Policy exemption remains as a record even after it stops being effective, illustrating effective-state versus historical-record separation.

Historical audit truth therefore has two dimensions: what was believed/decided at time T, and whether that decision remains verifiable under retained evidence/trust today.

## Failure semantics and observability
Required states remain distinct: `PASS`, `FAIL`, `PARTIAL`, `INCONCLUSIVE`, `NOT_APPLICABLE`, `EXEMPT_WITH_ACTIVE_LEASE`, `STALE`, `HISTORICALLY_UNVERIFIABLE`.

OPA exposes a material negative-space case: decision logs can fail to upload or be dropped under configured limits even while policy evaluation continues. Audit/logging health is therefore part of compliance evidence coverage, not a side-channel metric.

## Exception, waiver and break-glass lease
An exception is not permission mutation. The effective object is a bounded lease with subject/scope, issuer, reason, compensating conditions, start, expiry, revocation, approval authority and residual-risk owner. Azure Policy requires separate exemption permission and retains expired exemptions as records. Break-glass additionally requires emergency-use identity, post-use review and residual elevated-effect disposition; expiry alone does not prove emergency actions were reverted.

## Governance and Adaptive Governed Work Surfaces
Authority remains faceted: `ObligationAuthority ≠ ControlDesignAuthority ≠ ImplementationAuthority ≠ EvidenceAuthority ≠ AssessmentAuthority ≠ ExceptionAuthority ≠ AuditCorrectionAuthority ≠ RemediationAuthority`.

`Enterprise → Station → Role → Person` attenuates grants. Station delegation may administer bounded evidence/review work but cannot weaken enterprise mandatory controls or self-expand exception power. **Adaptive Governed Work Surfaces remains a distinct promoted capability**: AGWS may present/filter/compose governed work, but may not hide mandatory institutional controls, alter canonical policy, self-approve exceptions or gain remediation/audit-admin authority through personalization.

## Provider boundaries, portability and lock-in
Universal primitives are obligation/control semantics, applicability, implementation/inheritance lineage, qualified evidence/population, assessment, finding/risk, exception lease, audit lineage/correction and historical verification. Provider-specific mechanisms include AWS evidence folders/frameworks, OPA bundles/log transport, Azure Policy assignments/exemption resources and framework-native OSCAL identifiers.

Provider substitution requires semantic mapping plus historical-verification continuity. A new policy/evidence provider can prove current state without automatically proving prior periods. Migration must disposition old-provider evidence, trust anchors, retention windows, unresolved findings and inherited-control dependencies.

## Offline / air-gapped closure
Local governance closure requires a bounded package of canonical obligation/control revisions, applicability, delegated authority, policy/evaluation artifacts, trust material, expected population, retained evidence, exception leases, audit lineage and synchronization/reconciliation position. Reconnection requires requalification against changed enterprise policy, trust/provider revision, population, expired/revoked exceptions and newly available evidence. Local closure never grants authority absent from delegated scope.

## AI-native boundary
AI may map frameworks, classify evidence, propose control relationships, identify gaps, draft assessment rationale and assemble candidate packages. It cannot convert sample evidence into population-wide PASS, infer missing inherited-control validity, create/extend exception leases, rewrite audit history, suppress failed log coverage, or actuate remediation absent explicit authority and deterministic admission.

## Convergent/divergent patterns and hypotheses
Convergent: assessment evidence gathering is distinct from compliance judgment; implementation/inheritance responsibility is explicit; evidence coverage depends on population/freshness/collector health; historical records can outlive effective exemptions; policy evaluation and audit persistence can fail independently; provider migration does not transfer historical verifiability automatically.

Divergent/product-specific: NIST OSCAL interchange structures, AWS managed evidence, OPA policy/log/discovery mechanics and Azure assignment/exemption resources. **GENERALIZE** typed governance identities/population-qualified evidence/historical verification; **HARDEN** design/implementation/effectiveness and inheritance/log coverage; **PROVIDERIZE** catalogs/policy engines/collectors/evidence stores/log transports/report formats; **INTEGRATE** remediation references without transferring governance ownership; **KEEP** append-only correction/supersession; **DO_NOT_BUILD** a legal-compliance oracle or authority-amplifying AI assessor.

## Repo-validation questions
1. Can current SB contracts distinguish control design, implementation and operating effectiveness revisions?
2. Is evidence tied to expected population/coverage or only individual observations/artifacts?
3. Can inherited controls express provider/source responsibility and dependency freshness?
4. Are audit records append-only with explicit correction/supersession rather than mutable replacement?
5. Can break-glass/waiver expiry coexist with retained history and post-use residual-effect review?
6. Is historical re-verification representable when evidence/trust/provider retention has expired?
7. Can Station-scoped evidence/assessment administration be delegated without exception/remediation authority amplification?

## Symbiotic Proof
An enterprise control is partially inherited from a shared platform and locally implemented in three Stations. One Station uses a time-bounded exemption, another samples only part of its resource population, and a third evaluates through OPA while decision-log upload drops events. The platform provider is then replaced while the system operates offline. A correct proof must preserve typed control/implementation/inheritance identities; mark incomplete population/log coverage `PARTIAL/INCONCLUSIVE`; stop honoring the exemption after expiry while retaining its audit record; prevent inherited PASS from propagating without dependency evidence; preserve append-only corrections; refuse unsupported historical verification after trust/evidence loss; requalify on reconnect/provider change; and permit AGWS/AI assistance without policy, exception, audit-admin or remediation authority amplification.

## Stable findings
- **G2-FINDING-GCA-38** — Governance identity is typed across obligation, control objective/design, implementation, inherited-control dependency, evidence observation/population, assessment, exception lease and audit record; framework/provider IDs remain correlation identities unless explicitly mapped.
- **G2-FINDING-GCA-39** — Effective governance qualification is a multi-axis revision vector over policy/control, applicability, design, implementation/inheritance, evidence policy, population/sampling, freshness/integrity, authority, exception, trust/provider and Station exposure; material axis change stales affected conclusions.
- **G2-FINDING-GCA-40** — Control design adequacy, implementation presence and operating effectiveness are independent lifecycle facts; declaration or provider PASS cannot collapse them into one compliance state.
- **G2-FINDING-GCA-41** — Evidence qualification requires expected population or explicit sampling semantics; evidence-item count and sampled PASS do not prove full-scope coverage, and inherited controls require dependency/scope evidence before conclusions propagate.
- **G2-FINDING-GCA-42** — Immutable audit means non-destructive history, not uncorrectable history: correction/supersession is append-only, authority-bound lineage, while retention/legal hold independently governs disposition.
- **G2-FINDING-GCA-43** — Exception/waiver/break-glass is an expiring/revocable authority-bounded lease whose historical record can outlive effectiveness; expiry does not prove emergency effects were reverted, so residual-effect disposition is required.
- **G2-FINDING-GCA-44** — Policy/evidence execution and audit observability fail independently; collector gaps, dropped decision logs or incomplete backfill make historical/effectiveness proof PARTIAL/INCONCLUSIVE even when current policy evaluation succeeds.
- **G2-FINDING-GCA-45** — Provider replacement and offline governance require historical-verifiability closure over retained evidence, trust, inheritance, population and audit lineage; current-state equivalence cannot silently inherit historical compliance proof.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-GCA-TYPED-CONTROL-IMPLEMENTATION-ASSESSMENT-AUDIT-IDENTITY` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-GCA-POPULATION-SAMPLING-INHERITANCE-EVIDENCE-QUALIFICATION` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.
- `G2-CAPABILITY-CANDIDATE-GCA-APPEND-ONLY-AUDIT-CORRECTION-SUPERSESSION-LINEAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-GCA-HISTORICAL-VERIFIABILITY-CLOSURE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

No candidate is promoted this run. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations
1. Complete fresh population evidence yields authorized effectiveness assessment bound to exact revisions.
2. Sampled PASS presented as whole-population PASS is rejected or remains PARTIAL.
3. Upstream PASS with stale/missing inheritance dependency does not propagate.
4. Policy decision succeeds while decision-log upload drops events: current decision may stand, audit coverage becomes PARTIAL/INCONCLUSIVE.
5. Applicability/control/implementation/population/trust change stales prior evidence for affected scope.
6. Erroneous audit record cannot be rewritten; append authorized correction/supersession preserving original lineage.
7. Expired waiver remains historically visible but no longer suppresses evaluation; break-glass closure requires residual-effect disposition.
8. Replacement proves current equivalence but lacks old-period evidence/trust: historical verification remains explicitly unavailable.
9. Station reviewer and AI assistant cannot self-grant exception/remediation/audit-admin authority or hide mandatory controls.
10. Local assessment uses a closed revision/evidence/authority set; reconnect forces requalification against enterprise/policy/trust/exception changes.

## Value / risk / priority / next question
**Value:** very high. **Risk:** severe if current provider state is mistaken for historical compliance or sampled/inherited evidence is overgeneralized. **Priority:** structural cross-cutting. **Next question:** Secrets / Configuration / Environment Portability — typed secret/config identities, consumer-effective generations, non-disclosing evidence, overlay authority and provider/offline cutover closure.