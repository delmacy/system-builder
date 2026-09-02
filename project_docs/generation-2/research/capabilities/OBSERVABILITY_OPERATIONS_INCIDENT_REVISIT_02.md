# Observability / Operations / Incident — Revisit 2 / Cycle 3

## Research question
What provider-neutral primitives let Generation 2 correlate observations, telemetry, objectives, alerts, incidents and remediation while preserving timestamp/freshness semantics, provider portability, disconnected operation, authority boundaries and evidence across partial rollouts?

## Representatives and evidence/source ledger
1. OpenTelemetry semantic conventions — spans, metrics, logs and events share semantic conventions; events distinguish occurrence Timestamp from ObservedTimestamp. Source of truth: upstream OTel specifications.
2. Prometheus alerting — alert rule definitions produce distinct pending/firing alert instances; Alertmanager owns downstream notification concerns. Source of truth: Prometheus documentation.
3. Google SRE SLO/error-budget model — SLI implementation, SLO objective and error-budget policy are explicit governed artifacts; measurement-point caveats matter. Source of truth: Google SRE Workbook.
4. PagerDuty Incident Management — alerts, incidents, acknowledgement/resolution, escalation, timeline and notification actions are distinct identities/lifecycles; incident visibility/actions are permission-scoped. Source of truth: PagerDuty documentation.
5. Grafana Alloy / OpenTelemetry collector pattern — collection credentials, queues, retries, timeouts and backend forwarding are operational realization concerns; least privilege remains necessary. Source of truth: Grafana Alloy documentation plus OTel model.

## Identity and universal primitives
`SemanticObservation → TelemetryRecord → ExportAttempt → IngestionReceipt` must not collapse. Correlation requires typed resource/service/runtime/deployment identities plus schema/convention revision. `observedAt` and `ingestedAt` are separate evidence. `SLI Definition → SLO Objective → ErrorBudgetPolicy → Evaluation` is separate from product/business acceptance. `AlertRule → AlertEvaluation → AlertInstance → NotificationDelivery` is separate from `Incident → IncidentTimelineEntry → RemediationAction/Attempt`.

## Lifecycle, versioning and failure semantics
Telemetry schema/convention revision, SLI implementation revision, alert-rule revision and incident policy revision require lineage. Missing/stale/dropped/sampled telemetry must support `UNKNOWN/INSUFFICIENT_EVIDENCE`, not silently become healthy. Partial rollout needs observations correlated to release/deployment realization, region/traffic cohort and time window. Collector queues/retries are delivery mechanics, not proof that a semantic observation was durably accepted downstream.

## Extensibility, provider boundaries and portability
Provider-neutral contracts should express signal semantics, resource/topology correlation, freshness, evidence quality, objectives, alert/incident state and authorized remediation. PromQL, PagerDuty service/escalation objects, proprietary dashboard queries and backend credentials are provider realizations. Provider replacement must preserve required semantics or explicitly declare degraded conformance.

## Governance and observability-of-observability
SLO authors/reviewers/approvers and error-budget policy are governance evidence. Incident actions need actor/authority lineage. Telemetry pipeline health itself must be observable: queue pressure, dropped data, sampling, exporter failure and freshness lag affect confidence in operational claims.

## Disconnected/self-hosted/air-gapped operation
Runtime autonomy requires an observability dependency matrix: local collection, local retention/query, alert evaluation, incident evidence and remediation may remain available even when external backends/control planes are disconnected. External export failure must not erase locally retained evidence where policy requires continuity.

## Product-specific mechanism vs universal primitive
OpenTelemetry semantic conventions, Prometheus pending/firing, PagerDuty escalation and Google error-budget policy are representative mechanisms. Universal primitives are semantic observation identity, temporal/freshness evidence, topology correlation, objective/evaluation identity, alert-instance identity, incident/timeline identity, evidence quality and remediation authority.

## Convergent/divergent patterns
Convergent: definitions differ from instances/evaluations; telemetry and notification are separate; timestamps/freshness matter; operational actions require scoped authority. Divergent: provider-specific query languages, retention, sampling, incident grouping, SLO calculation and delivery guarantees. Therefore these belong in provider conformance rather than portable semantic truth.

## Subcapabilities
Semantic telemetry; topology/resource correlation; telemetry pipeline integrity; SLI/SLO/error budgets; alert evaluation; incident/evidence timeline; remediation authority; disconnected observability; provider conformance.

## SB comparison — evidence bounded
Directed fresh-main code search for `OpenTelemetry observability incident SLO alert telemetry` returned no results. This is only negative evidence for that directed search and is not a repository-wide absence claim. Repository archaeology remains deferred to PLANNING_B.

## Reconciliation hypotheses
- GENERALIZE semantic observations and topology identities independently of telemetry vendors.
- HARDEN freshness/unknown-state semantics and observability-of-observability.
- PROVIDERIZE collectors, query languages, alert transports and incident-management backends.
- INTEGRATE deployment partial-rollout evidence with topology-correlated observations.
- DO_NOT_BUILD a proprietary telemetry backend merely to satisfy the portable capability.
- DEFER repository-wide implementation judgment to PLANNING_B.

## Repo-validation questions
Where are runtime/deployment/service identities emitted today? Are timestamps/freshness and unknown-state represented? Are alert definitions separated from notifications? Is there incident/remediation evidence with actor authority? Can generated runtimes retain/query operational evidence disconnected from SB? Are provider credentials exposed above adapters?

## Adaptive Governed Work Surfaces / Station boundary
AGWS dashboards consume semantic observability capabilities under `Enterprise → Station → Role → Person`; they do not receive raw telemetry/incident-provider credentials. A personal dashboard may narrow presentation but cannot hide mandatory institutional safety/incident components where superior policy requires them. Incident actions exposed in a surface must re-evaluate effective authority. Surface automation cannot transform read/acknowledge authority into remediation/deployment authority.

## Symbiotic Proof
A Station runs two release realizations during a 10/90 canary while its external telemetry backend is temporarily unreachable. Local observations preserve occurrence time, topology/release cohort and evidence-quality state; the surface shows telemetry freshness as degraded rather than healthy, keeps a mandatory incident component visible, and permits an authorized responder to acknowledge but not deploy/rollback. After reconnection, export retries preserve lineage; provider replacement can reproduce required correlation without changing semantic identities.

## Stable findings
- `G2-FINDING-OOI-17` — Semantic Observation Identity Must Be Distinct From Telemetry Record, Export Attempt and Provider Ingestion.
- `G2-FINDING-OOI-18` — Operational Time Requires Occurrence, Observation/Ingestion and Freshness Evidence; Missing Telemetry Is Not Health.
- `G2-FINDING-OOI-19` — SLI, SLO, Error-Budget Policy and Evaluation Are Governed Identities Distinct From Business Acceptance.
- `G2-FINDING-OOI-20` — Alert Rule, Alert Instance, Notification Delivery and Incident Are Separate Lifecycles.
- `G2-FINDING-OOI-21` — Partial-Rollout Observability Requires Topology/Release-Cohort Correlation and Evidence-Quality Semantics.
- `G2-FINDING-OOI-22` — Incident Remediation Authority Must Be Non-amplifying Across Providers, Station and AGWS; Observation Does Not Confer Control.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-OBSERVABILITY-EVIDENCE-QUALITY-FRESHNESS` — CROSS_CUTTING / CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-TOPOLOGY-CORRELATED-PARTIAL-ROLLOUT-OBSERVATION` — CROSS_CUTTING / CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-INCIDENT-REMEDIATION-AUTHORITY-LINEAGE` — CROSS_CUTTING / CANDIDATE.

## Value / risk / priority / next question
Value: makes operational evidence portable and trustworthy across native/external providers and autonomous runtimes. Risk: false health from stale/missing telemetry or privilege amplification through incident tooling. Priority: high. Next question belongs to Extension / Plugin / Marketplace Architecture: how extension identity, installation, capability declaration, trust, sandboxing, lifecycle and provider replacement preserve these boundaries without arbitrary code gaining platform authority.

## Saturation
Material architectural findings were produced; `consecutive_no_material_finding=0`. NOT SATURATED.