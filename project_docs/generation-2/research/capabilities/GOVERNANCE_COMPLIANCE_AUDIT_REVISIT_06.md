# Governance / Compliance / Audit — Revisit 6 / Cycle 7

## Research question
Which additional contracts are required so Governance / Compliance / Audit can express applicability-scoped obligations, operating-effectiveness conclusions, assessment/audit lineage, exception leases, evidence horizons and provider/auditor replacement without confusing collected evidence, policy-engine results or assessor acknowledgement with canonical compliance truth?

## Representatives and evidence/source ledger
1. **NIST SP 800-53A Rev.5 / Release 5.2.0** — assessment procedures are customizable and assessment methods are explicitly `examine`, `interview` and `test`; assessment conclusions therefore depend on method, assessment object, depth/coverage and assessor context rather than a bare boolean. Source of truth: NIST CSRC.
2. **NIST OSCAL Assessment Layer / Assessment Results** — assessment results are contextual to a specific system, plan, reviewed controls and assessment subject; results separately model observations, risks, findings, attestation, assets and assessment log. Source of truth: NIST OSCAL.
3. **FedRAMP Continuous Monitoring** — authorization posture is maintained through recurring deliverables, updated POA&M/inventory, scans, deviation requests and annual assessment; risk/deviation decisions remain approval-bound and current authorization does not collapse into one immutable historic verdict. Source of truth: FedRAMP.
4. **AWS Audit Manager** — automated compliance-check evidence can be `compliant`, `non-compliant` or `inconclusive`; manual/API/CloudTrail evidence can be inconclusive rather than failed. Evidence Finder has independently bounded backfill and retention windows and delegated administrators can search across member accounts. Source of truth: AWS documentation.
5. **Open Policy Agent (OPA)** — decisions, decision IDs, policy/bundle metadata and decision-log transport are separate concerns; log upload retries can occur while buffer/rate limits or explicit drop rules can discard events. Source of truth: OPA documentation.
6. **Azure Policy exemptions** — exemptions are separately authorized, scope-bound records with `Waiver`/`Mitigated` semantics, optional expiry and resource selectors; expiry stops effectiveness but preserves the record, and exemptions remain visible in compliance reporting. Source of truth: Microsoft Learn.

## Research-by-exception result
Prior work already established typed obligation/control/evidence/assessment identities, population/sampling qualification, inherited-control dependencies, append-only correction, waiver leases and historical-verifiability closure. This revisit therefore attacks the remaining failure modes: globally stated compliance claims without applicability; design-effectiveness versus operating-effectiveness conflation; evidence availability versus evidence validity; acknowledgement versus remediation postcondition; exception expiry with residual effects; replacement of assessor/provider with unresolved cohorts; delegated/offline governance; and AI/AGWS authority amplification.

## Source of truth, identity and lifecycle
The canonical source of truth is not a provider dashboard or framework label. Governance truth is a graph of qualified claims over typed identities:

`ObligationRevision → ApplicabilityDecision → ControlObjectiveRevision → ControlImplementationRevision → AssessmentPlanRevision → AssessmentAttempt → EvidenceObservation/Population → AssessmentDecision → Finding/Risk → ExceptionLease/RemediationAttempt → PostconditionEvidence → AuditRecord/Correction`.

The following identities must remain distinct: `Obligation`, `ControlObjective`, `ControlImplementation`, `AssessmentPlan`, `AssessmentSubject`, `EvidenceObservation`, `EvidencePopulation`, `AssessmentAttempt`, `AssessmentDecision`, `Finding`, `Risk`, `ExceptionLease`, `RemediationAttempt`, `RemediationPostcondition`, `AuditRecord`, `AuditCorrection`, `AssessorIdentity`, `ProviderBinding` and `DelegatedGovernanceGrant`.

Lifecycle boundaries are correspondingly non-collapsible: `DESIGNED ≠ IMPLEMENTED ≠ OBSERVED ≠ ASSESSED_EFFECTIVE ≠ RISK_ACCEPTED ≠ REMEDIATED ≠ POSTCONDITION_VALIDATED`.

## Applicability-scoped governance claims
There is no globally current `compliant=true`. An effective obligation/control/assessment claim is qualified by at least:

`subject/system × obligation/control revision × applicability/scope × implementation/inheritance revision × assessment-plan/method × expected population/coverage × evidence window/freshness/integrity × assessor/authority × exception state × provider/trust revision × Station exposure × evidence horizon`.

OSCAL reinforces that assessments are performed against a specific system, assessment plan, reviewed controls and assessment subject. NIST 800-53A makes assessment procedures customizable and evidence-gathering method-specific. Therefore moving a control conclusion to another Station, population, implementation revision, assessor profile or time window requires explicit requalification rather than semantic copying.

## Design versus operating effectiveness
A control may be well designed but not implemented, implemented but not operating over the required population/window, or operating while its evidence collector is degraded. NIST examine/interview/test methods establish that effectiveness is observed through assessment actions rather than inferred from control text.

Minimum proof chain:
`ControlDesignAccepted → ImplementationObserved → PopulationQualified → OperatingEvidenceCollected → AssessmentPerformed → EffectivenessDecision → DecisionCurrentnessValidated`.

A provider PASS is an evidence/decision input scoped to its method and population, not a universal compliance oracle.

## Evidence availability, replay and historical validity
Governance evidence has at least three independent temporal properties:
1. the time interval about which the evidence says something;
2. the freshness/currentness horizon for using it in a present assessment; and
3. the replay/retention horizon during which the evidence remains available for later verification.

AWS Audit Manager demonstrates this explicitly: Evidence Finder backfills a bounded historical period and retains evidence according to an independently configurable retention period. Losing replayability does not retroactively make a historical decision false; it can make later re-verification `HISTORICALLY_UNVERIFIABLE` or `INCONCLUSIVE`.

OPA adds a harder case: policy evaluation can succeed while decision-log events are dropped because of configured buffer/rate limits or explicit log filtering. Current decision validity and audit-evidence completeness are therefore separate claims.

## Assessment and remediation acknowledgement semantics
`assessment submitted`, `finding acknowledged`, `remediation requested` and `remediation effective` are separate postconditions. A timeout or lost acknowledgement around a remote assessor/provider cannot justify blind retry if duplicate remediation, duplicate exception creation or stale overwrite is possible.

Ambiguous mutation follows:
`attempt → observe canonical/provider state → compare expected base/current revision → reconcile → retry only if still necessary`.

FedRAMP recurring POA&M/deviation workflows reinforce that findings, remediation status and risk acceptance are managed over time; an update or acknowledgement is not itself proof that the technical or organizational postcondition now holds.

## Exception, waiver and break-glass residual effects
Azure Policy distinguishes exemption scope, category, expiry and additional exemption authority. Expiry removes effective exemption without deleting its historical object. Thus `lease expired` does not mean `effects reverted`.

Every exception/break-glass closure requires:
`lease inactive/revoked + affected actions identified + residual effect disposition + compensating control status + post-use review + canonical policy evaluation restored`.

Resource selectors also show that exception applicability can be progressively rolled out or rolled back over subsets; exception currentness must therefore be cohort-qualified.

## Append-only audit correction and supersession
Audit immutability means historical records cannot be silently rewritten. It does not prohibit correcting errors. Correction is another authorized record with lineage:
`original → correction/supersession → rationale → authority → timestamp → affected claims`.

A corrected current view must preserve the fact that a different statement was previously recorded. Evidence retention/legal hold is orthogonal to semantic supersession.

## Provider / assessor boundaries and mixed support vectors
Portability is not a boolean `supports compliance`. A provider/assessor support vector includes:
`framework mapping`, `applicability semantics`, `control implementation modeling`, `population/sampling`, `evidence acquisition`, `evidence integrity`, `continuous monitoring`, `assessment methods`, `exception/risk acceptance`, `audit correction`, `retention/replay`, `offline operation`, `delegated administration`, `export/interchange` and `historical verification`.

Provider or assessor replacement requires semantic comparison and residual-cohort closure. Cutover is incomplete while old-provider evidence, unresolved findings, exception leases, assessment jobs, audit records, trust anchors or consumers remain authoritative without explicit disposition.

## Governance, delegated Stations and Adaptive Governed Work Surfaces
Authority remains faceted:
`PolicyAuthority ≠ ControlDesignAuthority ≠ EvidenceAuthority ≠ AssessmentAuthority ≠ ExceptionAuthority ≠ RiskAcceptanceAuthority ≠ AuditCorrectionAuthority ≠ RemediationAuthority`.

`Enterprise → Station → Role → Person` is strictly attenuating. A Station may receive bounded authority to collect evidence, operate local assessments or administer assigned findings, but it cannot weaken enterprise mandatory obligations, expand its own exception/risk-acceptance scope or reinterpret superior invariants.

**Adaptive Governed Work Surfaces remains distinct from generic UI/low-code.** AGWS may surface mandatory controls, evidence queues, review work and provider-backed actions, but personalization cannot hide non-removable institutional components or mint governance authority. AI is the sole materializer of AGWS changes, yet AI intent/provenance does not grant policy, exception, audit, remediation or canonical-domain authority.

## Offline / air-gapped closure
A qualified offline Station requires a bounded local governance closure containing canonical obligation/control/applicability revisions, delegated authority, current policy/evaluator material, trust roots, expected populations, retained evidence, active exception leases, unresolved findings and synchronization position. Local assessments are valid only for the closed applicability set and evidence horizon.

Reconnect requires requalification against superior policy/control revisions, revoked or expired delegations/exceptions, changed trust/provider state, newly discovered population, central findings and evidence gaps. Conflict cannot be resolved by silently preferring local or central timestamp.

## Observability and failure semantics
Required semantic states include `PASS`, `FAIL`, `PARTIAL`, `INCONCLUSIVE`, `NOT_APPLICABLE`, `EXEMPT_ACTIVE`, `STALE`, `SUPERSEDED`, `HISTORICALLY_UNVERIFIABLE`, `OUTCOME_UNKNOWN` and `POSTCONDITION_UNVERIFIED`.

Operational observability must expose assessment method/coverage, evidence freshness, collector/log health, exception expiry, remediation ambiguity, residual cohorts and provider migration status. A green dashboard built from incomplete evidence remains incomplete.

## Portability, extensibility and lock-in
Universal primitives: typed obligation/control/implementation/assessment/evidence/finding/exception/audit lineage; applicability; coverage/population; evidence horizons; authority facets; correction/supersession; provider support vectors and residual drainage.

Provider-specific mechanisms: AWS evidence folders/finder, OPA bundles/log transport, Azure assignment/exemption resources, FedRAMP package/deviation workflow and OSCAL serialization shapes. These should be adapter/provider concerns unless their semantics are promoted independently.

Extension points may add frameworks, collectors, evaluators, assessors, evidence stores, report generators and remediation connectors, but extensions cannot redefine canonical obligation identity or bypass authority/admission.

## Product-specific mechanism versus universal primitive
Product-specific mechanisms are useful evidence sources, not constitutional contracts. The SB should generalize applicability-scoped governance claims, typed lifecycle and evidence horizons; harden population/operating-effectiveness and residual-effect proofs; providerize policy engines/evidence collectors/assessment services/report formats; integrate remediation without transferring governance ownership; and avoid building a universal legal-compliance oracle.

## Convergent and divergent patterns
Convergent across NIST/OSCAL/FedRAMP/AWS/OPA/Azure:
- assessment is contextual and method/subject scoped;
- collected evidence is not automatically a compliance verdict;
- evidence/currentness/retention can diverge;
- continuous governance requires recurring observation rather than a permanent PASS;
- exceptions are explicit scoped objects, not silent policy mutation;
- audit persistence can fail independently from policy execution;
- risk acceptance/remediation/assessment are separate authorities and lifecycle facts.

Divergent/product-specific:
- framework models and serialization;
- provider compliance-check semantics;
- continuous-monitoring cadence;
- policy evaluation/log transport;
- exemption resource model;
- managed evidence retention/query architecture.

## Reconciliation hypotheses
- **KEEP** explicit evidence-versus-decision separation and non-amplifying authority.
- **HARDEN** applicability vectors, operating-effectiveness/population proof, exception residual-effect closure, ambiguous mutation reconciliation and audit-evidence health.
- **GENERALIZE** typed governance identities, evidence replay horizons, mixed support vectors and residual cohort drainage.
- **PROVIDERIZE** framework catalogs, policy engines, collectors, assessor services, evidence stores, reporting and regulator-specific formats.
- **INTEGRATE** remediation/workflow/provider actions through capability bindings without transferring canonical governance ownership.
- **DEFER** regulator/domain-specific control content until domain packages/providers require it.
- **DO_NOT_BUILD** legal advice, automatic risk acceptance, self-authorizing AI assessor or mutable audit history.

## Repo-validation questions
1. Does fresh `main` contain any canonical governance contract that distinguishes obligation, implementation, assessment, exception and audit identities?
2. Can current evidence contracts express applicability, expected population, assessment method and replay horizon?
3. Can a policy/control conclusion become stale when implementation, population, assessor, provider or Station scope changes even if control text is unchanged?
4. Are exception and break-glass authorities separate from policy/evidence/remediation authority, with expiry plus residual-effect closure?
5. Can audit correction preserve the original record through append-only supersession?
6. Can ambiguous external assessment/remediation acknowledgement be reconciled before retry?
7. Can provider/auditor replacement express mixed support vectors and residual evidence/finding/exception cohorts?
8. Can offline Stations requalify governance state on reconnect without timestamp-wins semantics?
9. Can AGWS expose governance work while preserving non-removable enterprise requirements and preventing AI/self-service authority amplification?

A bounded directed GitHub search on fresh `main` for governance/compliance/audit/control/evidence/assessment/exception/waiver/break-glass/Station vocabulary returned no matches. This is not repository-wide proof of absence; the questions remain for the later mandatory repository-archaeology phase.

## Symbiotic Proof
An enterprise delegates evidence review and bounded assessment to three Stations. The same control revision applies differently to each Station because their populations, implementation revisions and providers differ. One Station receives a scoped Azure-style waiver that expires; another runs OPA successfully but loses part of its decision-log stream; the third migrates from one assessor/evidence provider to another while offline. An AI-assisted AGWS proposes remediation and a role-level reviewer approves evidence categorization.

A correct proof must: keep applicability/assessment identities separate; refuse to project a sampled or stale PASS across Stations; mark missing log/evidence coverage `PARTIAL/INCONCLUSIVE`; stop honoring the waiver at expiry while retaining history and checking residual effects; preserve append-only audit correction; reconcile ambiguous remediation before retry; maintain historical-verifiability limits after provider replacement; drain/disposition old evidence/findings/exceptions/consumers; requalify offline state at reconnect; and prove that reviewer/AI/AGWS activity never mints policy, exception, risk-acceptance, remediation, audit-admin or canonical-domain authority.

## Stable findings
- **G2-FINDING-GCA-46** — Governance/compliance truth is an applicability-scoped qualified claim over subject/system, obligation/control revision, implementation/inheritance, assessment plan/method, population/coverage, evidence window, assessor/authority, exception, provider/trust, Station exposure and evidence horizon; no global `compliant` fact exists.
- **G2-FINDING-GCA-47** — Obligation, control objective, implementation, assessment plan/attempt/decision, evidence observation/population, finding/risk, exception lease, remediation attempt/postcondition and audit record/correction require separate typed identities and lineage; lifecycle success at one boundary cannot prove another.
- **G2-FINDING-GCA-48** — Control design adequacy and operating effectiveness are revision-, method-, population- and window-qualified; provider PASS or control presence cannot prove sustained effectiveness outside the assessed applicability set.
- **G2-FINDING-GCA-49** — Governance evidence has independent subject-time, freshness/currentness and replay/retention horizons; evidence expiry can make later verification unavailable without retroactively invalidating a historical decision, while collector/log loss can make coverage PARTIAL/INCONCLUSIVE despite successful policy execution.
- **G2-FINDING-GCA-50** — Assessment, finding acknowledgement, exception/remediation mutation and postcondition are distinct facts; ambiguous provider acknowledgement requires expected-base observation and reconcile-before-retry rather than blind replay.
- **G2-FINDING-GCA-51** — Exception/waiver/break-glass expiry terminates delegated bypass effectiveness but does not prove residual effects were reverted; closure requires residual-effect disposition, compensating-control status, post-use review and restored canonical evaluation while preserving historical records.
- **G2-FINDING-GCA-52** — Governance provider/auditor portability is a mixed support vector; migration closes only after semantic comparison plus drainage/disposition of residual evidence, assessment jobs, findings, exceptions, audit/trust material and consumer cohorts, with explicit historical-verifiability limits.
- **G2-FINDING-GCA-53** — Qualified offline/local governance and `Enterprise → Station → Role → Person` delegation are non-amplifying: local closure is bounded by delegated applicability/evidence/trust horizons, reconnect requalifies superior state, and AGWS/AI proposal/assessment cannot mint policy, exception, risk-acceptance, audit, remediation or canonical authority.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-GCA-APPLICABILITY-SCOPED-GOVERNANCE-QUALIFICATION-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability graph while Governance retains obligation/control/assessment/population/exception semantics.
- `G2-CAPABILITY-CANDIDATE-GCA-GOVERNANCE-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA/Observability evidence horizons while preserving assessment/audit retention and historical-verifiability semantics.
- `G2-CAPABILITY-CANDIDATE-GCA-MIXED-ASSESSOR-EVIDENCE-AUDIT-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; preserve independent framework, applicability, assessment-method, evidence, exception, audit, retention, offline and delegated-admin axes.
- `G2-CAPABILITY-CANDIDATE-GCA-EVIDENCE-FINDING-EXCEPTION-AUDIT-CONSUMER-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Governance owns residual closure for old assessor/provider evidence, findings, exceptions, audit/trust artifacts and dependent consumers.

No candidate is promoted this revisit. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations
1. Same control revision applied to two populations yields separate qualification claims; PASS for one cannot qualify the other.
2. Design accepted but operating evidence missing/stale yields no effectiveness PASS.
3. Automated policy decision succeeds while evidence/log collection drops events; decision may stand but audit coverage is PARTIAL/INCONCLUSIVE.
4. Evidence retained past its currentness window remains historical evidence but cannot qualify current state without re-assessment.
5. Ambiguous remediation/exception mutation is observed and reconciled before retry; duplicate/stale actuation is prevented.
6. Expired waiver stops suppressing evaluation, remains historically visible and requires residual-effect disposition.
7. Erroneous audit record is corrected by append-only supersession while the original remains inspectable.
8. Replacement assessor matches current semantics but cannot verify old periods after source evidence/trust loss; historical status remains explicit.
9. Cutover is blocked until old evidence/jobs/findings/exceptions/trust/consumers are drained or dispositioned.
10. Offline Station requalifies against superior policy, delegation, exception, trust and evidence state on reconnect.
11. AGWS/AI can assemble evidence and propose remediation but cannot self-approve exception/risk acceptance or gain policy/audit/remediation authority.

## Value / risk / priority / next question
**Value:** very high. **Risk:** severe if a provider PASS, current dashboard, expired waiver or completed workflow is mistaken for canonical/historical compliance truth. **Priority:** structural cross-cutting. **Next question:** Secrets / Configuration / Environment Portability — revisit 6 / cycle 7, focusing applicability-scoped effective secret/config qualification, typed source/version/materialization/consumer identities, non-disclosing proof, overlay authority, mixed provider support vectors, ambiguous rotation/rollout reconciliation, residual consumer drainage, qualified offline closure and AGWS/AI non-amplification.
