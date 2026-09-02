# Observability / Operations / Incident — Revisit 3 / Cycle 4

## Research question
What provider-neutral evidence, incident and authority primitives let Generation 2 distinguish desired operational intent, effective runtime realization and observed evidence across partial rollouts, stale/missing telemetry, provider replacement, disconnected operation and AI/AGWS-assisted response—without turning observability into deployment authority or billing ownership?

## Representatives and evidence/source ledger
1. OpenTelemetry Logs Data Model and event semantics — occurrence `Timestamp`, `ObservedTimestamp`, resource/entity context, trace correlation and event identity are distinct fields/semantics. Sources: https://opentelemetry.io/docs/specs/otel/logs/data-model/ and https://opentelemetry.io/docs/specs/semconv/general/events/
2. OpenTelemetry Collector internal telemetry and resiliency — queue size/capacity, enqueue failures, receiver refusals, send failures, retries, WAL-backed queues and explicit data-loss conditions expose health of the telemetry transport itself. Sources: https://opentelemetry.io/docs/collector/internal-telemetry/ and https://opentelemetry.io/docs/collector/resiliency/
3. Prometheus alerting rules — rule evaluation produces active/pending/firing alert-instance state; `for` and `keep_firing_for` demonstrate that temporal qualification and loss/flapping handling are not equivalent to raw sample truth. Source: https://prometheus.io/docs/prometheus/3.5/configuration/alerting_rules/
4. Google SRE SLO/error-budget policy — SLI/SLO/error-budget calculation and resulting operational policy are explicit governed control artifacts; budget consumption drives review/action policy rather than merely displaying a metric. Source: https://sre.google/workbook/error-budget-policy/
5. PagerDuty incident lifecycle, timeline and escalation — alert severity, incident priority/urgency, triggered/acknowledged/resolved state, escalation, actor actions and incident timeline are distinct lifecycle/evidence concepts. Sources: https://support.pagerduty.com/main/docs/incidents and https://support.pagerduty.com/main/docs/escalation-policies

## Source of truth, identity and revision boundaries
Generation 2 should not collapse `DesiredOperationalCondition`, `RuntimeRealization`, `SemanticObservation`, `TelemetryRecord`, `TransportAttempt`, `ProviderIngestion`, `OperationalEvaluation`, `AlertInstance`, `Incident`, `Diagnosis`, `RemediationAttempt` or `Recovery/ReconciliationEvidence`. They are related but independently versioned/qualified identities.

A semantic subject must bind to stable entity/revision/topology identities independently of telemetry provider resource encodings. OpenTelemetry resource attributes and trace/log correlation are realizations of this principle, not the sole portable identity model. Deployment/environment labels alone are insufficient to identify a semantic release/runtime revision; evidence must bind the observation to the actual release/deployment/runtime realization being evaluated.

## Evidence qualification and INCONCLUSIVE semantics
An operational claim requires more than a value. A portable qualification tuple should be able to carry at least: semantic subject/entity, subject revision or realization reference, topology/release cohort, observation window, occurrence/observation times, freshness, coverage/sampling, producer/collector identity, schema/convention revision, pipeline-health/trust state and provider receipt/export status when relevant.

Missing, delayed, sampled, dropped or unexported telemetry is not proof of health. OpenTelemetry Collector exposes queue saturation, enqueue refusal and export-failure signals precisely because pipeline quality changes confidence in downstream conclusions. Therefore `INCONCLUSIVE`/`INSUFFICIENT_EVIDENCE` must remain a first-class result alongside healthy/unhealthy/violated states.

## Deployment/readiness/domain-postcondition handoff
Deployment completion, runtime readiness and domain postcondition qualification remain separate evidence layers. Observability should consume rollout attempt/release-cohort identity from Deployment rather than invent it. A canary may be technically ready while domain evidence is stale or insufficient. Conversely an old cohort may remain healthy while the target revision is not sufficiently observed.

Operational evaluation therefore needs explicit subject revision/cohort and coverage. Provider dashboards that aggregate across revisions cannot be treated as proof for a specific rollout unless the aggregation preserves required cohort identity and qualification.

## Alert, diagnosis, incident and remediation authority
Prometheus demonstrates that alert rule definition, evaluation and alert instance lifecycle are distinct; PagerDuty demonstrates that alert, incident, acknowledgement, resolution, escalation and timeline are distinct operational objects/actions. Generation 2 should preserve these boundaries.

`Alert/DetectionAuthority`, `DiagnosisAuthority`, `IncidentAdministrationAuthority`, `RemediationAuthority`, `DeploymentAuthority` and `RecoveryAuthority` must not be conflated. Observation or acknowledgement authority never implies the right to mutate canonical configuration, deploy, rollback, restore state or change policy. AI and AGWS may propose/diagnose under bounded capability exposure, but every actuating operation must re-evaluate the effective authority at the actual target boundary.

## Incident identity, timeline, correlation and recovery lineage
Provider event grouping/correlation may create or merge incident realizations, but portable incident identity and evidence should preserve semantic causes/subjects, alert/evaluation references, actor/timeline entries, remediation attempts, checkpoints and recovery/reconciliation outcomes.

A recovery or rollback that changes realization is a new governed transition and evidence branch; it must not erase the failed rollout/incident lineage. Incident closure is not proof that the underlying domain postcondition, recovery integrity or telemetry coverage is valid; those proofs need explicit references.

## SLI/SLO/error-budget evidence
`SLIDefinitionRevision → SLOObjectiveRevision → ErrorBudgetPolicyRevision → EvaluationWindow → EvaluationEvidence` should remain explicit. The operational decision produced by an error-budget policy is not the same object as the metric series used to calculate it.

Evidence quality applies to SLO evaluation too: missing/biased telemetry, changed SLI implementation, rollout cohort mismatch or insufficient window coverage can make an evaluation inconclusive. Policy may define how to respond, but absence of valid evidence must not silently restore or consume budget.

## Provider replacement and telemetry continuity
Provider replacement should preserve semantic observation identity, subject/revision bindings, evidence qualification and incident lineage where required, while allowing provider-specific query languages, storage schemas, grouping, retention and notification mechanisms to change.

Migration should be a governed transition with overlap/checkpoint evidence when continuity matters: `plan → qualification/compatibility validation → approval → transition/dual-observation attempt → continuity checkpoint → postcondition evidence`. A new backend becoming reachable is not by itself proof that required historical/operational evidence survived migration.

## Qualified local/offline observability and incident closure
A Station/runtime may need operational autonomy while central SB or an external observability backend is unavailable. A qualified local closure profile can include: semantic convention/resource identity material; collector/runtime configuration; trust material; bounded local buffering/retention; local query/evaluation; alert rules; incident/evidence ledger; authorized responder identities/authority snapshots; runbook/remediation references; recovery checkpoints; and export/reconciliation metadata.

Local closure is profile-scoped, not a claim that every SaaS feature is reproduced offline. External export failure may degrade federation/global visibility while local safety/incident evidence remains valid if the declared closure and freshness requirements are satisfied.

## Station / AGWS operational visibility and non-amplification
`Enterprise → Station → Role → Person` determines operational visibility and action exposure. A Station may receive only a subset of topology, SLO, alert or incident capabilities. Personal/role surfaces may specialize presentation, but superior mandatory incident/safety components and policy cannot be weakened.

AGWS/AI can summarize, correlate, diagnose and propose actions using authorized evidence. Any acknowledgement, suppression, config mutation, remediation, rollback or recovery action must be separately authorized at execution time. Stale surface context or cached authority cannot amplify privileges after Station/Role/policy changes.

## Operational-complexity evidence for later metering/rating
Observability may produce measurable facts useful to the pending relative-operational-complexity research without owning billing: telemetry volume/cardinality, retained history/window, number of environments/regions/cohorts, SLO/alert-rule count, incident frequency/severity, response effort, provider diversity, offline-retention requirements and remediation/recovery activity. These are evidence inputs only. Rating, pricing, entitlement and billing remain outside this capability.

## Product-specific mechanism vs universal primitive
- Product-specific: PromQL expressions, Prometheus `for`/`keep_firing_for`, PagerDuty service/escalation objects, proprietary grouping/query/storage, backend retention, collector exporter configuration.
- Universal: semantic subject/revision identity, occurrence/observation/freshness evidence, pipeline-health qualification, operational evaluation identity, alert/incident lifecycles, incident timeline/actor lineage, authority separation, governed remediation/recovery transition, provider-continuity evidence and qualified local operational closure.

## Convergent and divergent patterns
Convergent across representatives: definition differs from evaluation/instance; event occurrence differs from observation/transport; evidence has temporal/coverage quality; operational actions have scoped authority; incident lifecycle retains action history; local/transport failures can reduce evidence confidence without proving service health.

Divergent/provider-specific: query language, resource naming, grouping/correlation algorithm, retention/sampling, alert deduplication, SLO computation implementation, notification/escalation mechanics and storage topology. These belong in provider conformance/realization contracts.

## Subcapabilities
Semantic operational evidence; telemetry pipeline integrity; topology/revision correlation; evidence qualification/INCONCLUSIVE; SLI/SLO/error budget; alert evaluation; incident identity/timeline/correlation; diagnosis/remediation authority; provider continuity/migration; local/offline observability and incident evidence; operational-complexity evidence production.

## SB comparison — evidence bounded
No fresh-main repository-wide implementation judgment was performed in this revisit because repository archaeology belongs to PLANNING_B. Existing directed negative evidence from revisit 2 remains only a question-generator, not an absence claim. Planning B must inspect how current SB release/runtime identities, generated-system evidence, health, incidents, actions and authority are actually represented.

## Reconciliation hypotheses
- GENERALIZE revision-bound operational subject/evidence identity independently of observability vendors.
- HARDEN evidence qualification with occurrence/observation/freshness/coverage/pipeline-health/trust and first-class INCONCLUSIVE semantics.
- GENERALIZE incident/timeline/remediation lineage while PROVIDERIZE grouping, paging and backend-specific lifecycle mechanics.
- INTEGRATE Deployment rollout/revision/cohort references without letting Observability own deployment state.
- HARDEN AI/AGWS authority attenuation across diagnosis, acknowledgement, remediation, rollback and recovery.
- GENERALIZE qualified local/offline observability/incident closure profiles.
- INTEGRATE measurable complexity evidence with later metering/rating research, but DO_NOT_BUILD billing semantics inside Observability.
- DEFER implementation disposition to PLANNING_B/Architecture Reconciliation.

## Repo-validation questions
1. What exact identities today represent release, deployment attempt, runtime instance/cohort and generated-system revision, and can telemetry bind to them without parsing provider labels?
2. Is evidence freshness/coverage/pipeline health represented explicitly, including INCONCLUSIVE when telemetry is insufficient?
3. Are alert/evaluation/incident/timeline/remediation/recovery identities distinct and lineage-preserving?
4. Where is authority checked for operational actions exposed through generated UI/AGWS/AI?
5. Can a generated runtime retain enough local evidence and incident state to operate safely while external telemetry/control planes are unavailable?
6. Can provider replacement preserve semantic observation/incident lineage and continuity proofs?
7. Are SLI/SLO/error-budget definitions/versioning separate from metric implementation/provider queries?
8. Which operational facts are already measurable for future relative-complexity rating without coupling runtime behavior to commercial billing?

## Symbiotic Proof
A Station runs a 10/90 rollout across two regions while the external telemetry backend becomes unavailable. The generated runtime continues local collection and incident evidence under a declared closure profile. A new release cohort is technically ready, but queue saturation and missing regional coverage make the domain operational evaluation `INCONCLUSIVE`; the system does not mark it healthy. A responder surface shows the mandatory incident component, can acknowledge under current authority, and can ask AI for diagnosis, but cannot rollback because deployment authority is absent. After connectivity returns, buffered/exported evidence reconciles with occurrence/observation lineage. Later the telemetry backend is replaced through an overlap migration that proves continuity of required semantic observations and incident history without changing canonical subject identities.

## Stable findings
- `G2-FINDING-OOI-23` — Desired Operational Condition, Effective Runtime Realization, Semantic Observation, Telemetry Transport and Operational Evaluation Are Distinct Identities.
- `G2-FINDING-OOI-24` — Operational Evidence Must Be Revision/Topology/Window/Freshness/Coverage/Pipeline-Health Qualified, With INCONCLUSIVE as a First-Class Result.
- `G2-FINDING-OOI-25` — Deployment Success, Runtime Readiness and Domain Operational Postcondition Require an Explicit Revision/Cohort Evidence Handoff; Aggregate Health Is Not Sufficient Proof.
- `G2-FINDING-OOI-26` — Alert Evaluation, Alert Instance, Incident, Diagnosis, Remediation Attempt and Recovery/Reconciliation Evidence Require Separate Lifecycles and Preserved Lineage.
- `G2-FINDING-OOI-27` — Detection, Diagnosis, Incident Administration, Remediation, Deployment and Recovery Authorities Must Remain Non-Amplifying Across Providers, Station, AGWS and AI.
- `G2-FINDING-OOI-28` — SLI/SLO/Error-Budget Evaluation Is Governed Revision-Bound Evidence; Invalid or Insufficient Measurement Must Not Silently Become a Policy Conclusion.
- `G2-FINDING-OOI-29` — Qualified Local/Offline Observability and Incident Operation Requires Profile-Scoped Closure of Identity, Collection, Retention/Evaluation, Trust, Authority, Incident Ledger and Reconciliation Inputs.
- `G2-FINDING-OOI-30` — Operational Complexity Metrics Are Evidence Inputs for Later Rating/FinOps Decisions, Not Billing Authority Owned by Observability.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-OPERATIONAL-EVIDENCE-SET` — CROSS_CUTTING / CANDIDATE / MERGE_TARGET. Candidate merge into the unified evidence-qualification/realization lineage while preserving topology/window/pipeline-health/INCONCLUSIVE semantics.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-INCIDENT-REMEDIATION-RECOVERY-TRANSITION` — CROSS_CUTTING / CANDIDATE / MERGE_TARGET. Candidate convergence with shared governed migration/transition and non-actuating reconciliation authority separation; must preserve incident/remediation/recovery lineage.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-OBSERVABILITY-INCIDENT-CLOSURE` — CROSS_CUTTING / CANDIDATE / MERGE_TARGET. Candidate merge into qualified local closure profile with operational collection/evaluation/incident specifics.
- `G2-CAPABILITY-CANDIDATE-OPERATIONAL-COMPLEXITY-EVIDENCE-FACTORS` — CROSS_CUTTING / CANDIDATE / FEEDS_PENDING_RESEARCH. Supplies measurable operational facts to the existing relative-operational-complexity metering/rating candidate without promoting billing into Observability.

No candidate is promoted in this revisit.

## Value / risk / priority / next question
Value: trustworthy operational claims, safe autonomous operation and portable incident evidence across native/external providers. Risk: stale or lossy telemetry falsely interpreted as health; provider grouping treated as canonical truth; AI/AGWS operational views amplifying authority; commercial concerns contaminating runtime semantics. Priority: high.

Next capability by canonical cycle order: Extension / Plugin / Marketplace Architecture — revisit cycle 4. Stress-test extension package/semantic identity versus installed/runtime realization, trust and admission, dependency closure, lifecycle/revocation, sandbox/containment evidence, provider replacement, local/offline extension closure, Station capability exposure and AI-authored extension authority, while testing convergence with unified revision-bound realization evidence, evidence qualification, qualified local closure, non-actuating authority separation and shared governed transition.

## Saturation
Eight material architectural findings were produced. `consecutive_no_material_finding=0`; principal representatives are strong but the capability remains NOT SATURATED.