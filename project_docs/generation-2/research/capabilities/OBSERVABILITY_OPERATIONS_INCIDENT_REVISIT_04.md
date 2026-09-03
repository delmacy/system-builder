# Observability / Operations / Incident — Revisit 4 / Cycle 5

## Research question
How should Generation 2 qualify operational truth when telemetry itself is delayed, partial, duplicated, sampled or failing; bind observations/incidents to exact runtime/config/schema/trust/topology/provider revisions; preserve multi-Station/tenant isolation and local/offline closure; and support AI/runbook-assisted diagnosis without letting Observability become deployment, provider-admin or recovery authority?

## Representatives and evidence/source ledger
1. **OpenTelemetry Collector internal telemetry + resiliency** — receiver refusals, queue saturation, exporter failures, retries, WAL-backed queues and explicit data-loss modes prove that the telemetry pipeline itself is a dependency whose health affects evidence quality. Sources: https://opentelemetry.io/docs/collector/internal-telemetry/ and https://opentelemetry.io/docs/collector/resiliency/
2. **OpenTelemetry Resource / semantic conventions** — `service.name`, `service.version`, `service.instance.id`, deployment attributes and resource identity provide portable correlation vocabulary, while also showing that provider/resource attributes alone do not define System Builder semantic revision identity. Sources: https://opentelemetry.io/docs/concepts/resources/, https://opentelemetry.io/docs/specs/semconv/resource/, https://opentelemetry.io/docs/specs/semconv/resource/service/
3. **Prometheus recording/alerting rules** — rule evaluation has temporal semantics; delayed input may require query offsets; missed/failed rule iterations create gaps and rule-limit failures can discard results. Source: https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/
4. **Google SRE multiwindow/multi-burn-rate SLO alerting** — SLO conclusions depend on explicit windows, thresholds and burn-rate policy; different windows can produce different operational decisions over the same underlying service behavior. Source: https://sre.google/workbook/alerting-on-slos/
5. **Grafana Mimir HA deduplication + Grafana Loki multi-tenancy** — HA telemetry deduplication is scoped to cluster/replica assumptions; tenant isolation and cross-tenant query are explicit behaviors, so provider-side dedup/query capability cannot substitute for semantic coverage or authorization. Sources: https://grafana.com/docs/mimir/latest/configure/configure-high-availability-deduplication/ and https://grafana.com/docs/loki/latest/operations/multi-tenancy/
6. **PagerDuty Incident Response / Runbook Automation / SRE Agent** — incident diagnosis, recommendations, automation actions, action logs and remediation execution are distinct concerns; automated actions retain execution output while RBAC/approval/context controls bound who may actuate. Sources: https://support.pagerduty.com/main/docs/sre-agent, https://support.pagerduty.com/main/docs/automation-actions, https://www.pagerduty.com/platform/automation/runbook/

## Source of truth, identity and lifecycle
Generation 2 should preserve at least:

`SemanticSubjectRevision → RuntimeRealization/Cohort → ObservationAttempt → TelemetryPipelinePosition → AcceptedObservationSet → OperationalEvaluationRevision → AlertInstance → Incident → Diagnosis/Proposal → RemediationAttempt → EffectivePostconditionEvidence`.

None is interchangeable. A sample being recent does not prove that it belongs to the current runtime/schema/config/trust/provider generation. An incident being resolved does not prove that domain recovery postconditions, telemetry coverage or persisted-state integrity are satisfied.

OpenTelemetry resource attributes are useful realization metadata. They must bind to the System Builder's semantic System/Station/release/deployment/runtime identities rather than become those canonical identities. `service.instance.id` can distinguish concurrent service instances, but SB still needs revision/cohort/topology identity across rebuilds, migrations and provider substitution.

## Telemetry pipeline as an evidence dependency
The telemetry path is not transparent. Collector queues can fill, exporters can fail, receivers can refuse records, retries can expire, and WAL/disk failure can still lose data. Therefore every operational conclusion must be able to qualify the evidence path that produced it.

Minimum qualification dimensions should include subject/revision, realization/cohort, observation interval, occurrence time, observed/ingest time, coverage/sampling, producer/collector identity, semantic-convention/schema revision, queue/backlog/export health, retention horizon, source-to-backend position where available and trust state.

`recent timestamp + unhealthy/unknown pipeline` is not fresh operational proof. Missing or partial coverage yields `PARTIAL`/`INCONCLUSIVE`, not implicit healthy.

## SLI/SLO/alert evaluation freshness
SLI/SLO/alert results are derived evidence with their own identity and revision. Their applicability depends on the exact SLI query/definition, SLO objective, alert rule, window, thresholds, aggregation, telemetry schema and covered realization set.

Prometheus exposes missed rule evaluations and input-delay offsets; Google SRE's multiwindow burn-rate approach demonstrates that evaluation-window policy materially changes when an alert should fire. Therefore a prior SLO/alert PASS must become stale when a relevant query/rule/schema/provider/topology/release cohort changes, even if metric names stay identical.

## Partial rollout, traffic and coexistence evidence
Observability consumes Deployment's rollout/cohort/traffic-placement identity. It must not infer the effective deployment from whichever revision emits the most telemetry.

For dual-running or canary states, evaluations need explicit cohort and traffic coverage. `target healthy` is insufficient when only 5% of traffic is observed; `aggregate healthy` is insufficient when a failing 5% target is averaged into a healthy 95% predecessor. Missing one region/Station/tenant may produce a scoped result but cannot silently qualify the whole fleet.

## Incident, diagnosis, remediation and recovery boundaries
Incident administration and actuation remain distinct:

`ObserveAuthority ≠ EvaluateAuthority ≠ AlertAcknowledgeAuthority ≠ IncidentAdministrationAuthority ≠ DiagnosisAuthority ≠ RemediationProposalAuthority ≠ RemediationActuationAuthority ≠ DeploymentAuthority ≠ ProviderAdminAuthority ≠ RecoveryAuthority`.

PagerDuty demonstrates that diagnosis/recommendation can be separated from automation actions, and that automation execution can retain action output. Generation 2 should generalize this: AI/AGWS may correlate evidence, propose a runbook or ask for a bounded action, but the actuation path must re-evaluate current authority and target revision immediately before execution.

A remediation response must carry attempt identity, actor/authority snapshot, exact target revision/provider, result and postcondition evidence. `command returned success` is not equivalent to `incident condition resolved` or `domain integrity restored`.

## Incident closure versus recovery postcondition
`IncidentResolved` is an incident-lifecycle decision. It can be operationally useful even while historical telemetry remains incomplete, but it must not rewrite or fabricate recovery evidence.

If telemetry coverage was lost during an outage, the incident may be administratively closed while affected claims remain explicitly `PARTIAL`/`INCONCLUSIVE`. Recovery qualification may require fresh health checks, persisted-state checks, workflow/message reconciliation or security/trust validation owned by other capabilities.

## Multi-tenant, Station and hierarchical-SB coverage
Telemetry isolation and observation coverage are separate dimensions. Loki demonstrates explicit tenant isolation and separately enabled cross-tenant querying. Generation 2 should similarly treat cross-Station/cross-tenant aggregation as an authorized read/evaluation capability, not a default side effect of a backend.

Every aggregated operational conclusion should retain the included/excluded tenant/Station/region/cohort coverage set. Missing subordinate Station evidence cannot be silently represented as enterprise-wide health.

`Enterprise → Station → Role → Person` remains non-amplifying. A lower layer can narrow presentation/diagnostics but cannot weaken mandatory incident/safety components, suppress superior evidence obligations or gain cross-tenant/provider/recovery authority.

## Provider replacement and coexistence
Telemetry-stack replacement requires more than destination reachability. A safe transition should preserve or re-establish semantic subject mapping, schema/convention compatibility, observation windows, retention/history requirements, SLI/SLO query equivalence, alert state, incident correlation/timeline where required, tenant isolation and continuity/coverage evidence.

HA deduplication or provider ingestion dedup semantics are scoped mechanisms. Mimir's deduplication depends on cluster/replica labels and leader election assumptions; it should not be generalized into universal exactly-once observation semantics.

A provider cutover should support overlap/dual-observation checkpoints where continuity matters and surface divergence rather than selecting one backend as true by convention.

## Qualified local/offline observability and incident closure
A local Station can remain operationally useful while disconnected if its declared closure contains sufficient identity mappings, collector/evaluator configuration, trust material, retention/buffering capacity, alert/incident ledger, authority material, runbooks and reconciliation metadata.

Offline closure must expose telemetry loss budget, queue/backlog state, retention horizon and export/reconciliation position. Exhausted storage or expired retention degrades the evidence claim; reconnection does not recreate observations that were never retained.

Local incident response may diagnose and perform explicitly delegated local actions. It must not acquire provider-admin, deployment, secret, writer-promotion or recovery authority merely because central control is unavailable.

## AGWS and AI boundary
Adaptive Governed Work Surfaces remains distinct from generic UI. Operational components may expose scoped health, incidents, evidence and approved actions, but mandatory institutional/safety components remain inherited. Personal layout or automation cannot suppress required alerts, broaden tenant/Station visibility or bypass an actuation gate.

AI remains a diagnosis/proposal materializer, not an authoritative health oracle or recovery principal. A model-generated explanation is evidence/proposal only until deterministic/provider/domain checks establish the required postconditions.

## Product-specific mechanism vs universal primitive
**Product-specific:** PromQL/LogQL, OpenTelemetry exporter/queue configuration, Mimir HA labels/election, Loki tenant headers, PagerDuty escalation/grouping/runbook mechanics, vendor-specific incident correlation and storage/retention.

**Universal:** revision-bound semantic observation subject; telemetry-path qualification; evidence coverage/freshness; derived-evaluation revision; first-class PARTIAL/INCONCLUSIVE; explicit cohort/tenant/Station coverage; incident/remediation/postcondition lineage; faceted authority; governed telemetry-provider transition; qualified local closure.

## Convergent and divergent patterns
Convergent: observation transport can fail independently of service health; derived evaluation has its own temporal policy; operational identity requires subject/context; incident state differs from remediation result; automation needs permission/audit boundaries; multi-tenant observability requires explicit isolation/aggregation rules.

Divergent/provider-specific: query language, dedup keys, alert grouping, correlation algorithms, retention, sampling, incident lifecycle labels, runner technology and backend HA topology.

## Subcapabilities
Semantic observation identity; telemetry-pipeline health and loss accounting; evidence freshness/coverage; SLI/SLO/alert evaluation; rollout/cohort/traffic observation; tenant/Station aggregation; incident/timeline; diagnosis/proposal; remediation actuation evidence; provider migration/coexistence; qualified local/offline observability; operational evidence for dependent recovery/security/governance capabilities.

## SB comparison — evidence bounded
A fresh-main bounded GitHub code search for `observability incident health telemetry SLO alert remediation` returned no matches during this revisit. This is **not** repository-wide absence evidence and is recorded only as a Planning-B question generator. Repository archaeology remains deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **GENERALIZE** revision-bound semantic observation identity independent of telemetry provider labels.
- **HARDEN** evidence qualification with telemetry-pipeline health/loss/backlog/coverage and explicit PARTIAL/INCONCLUSIVE semantics.
- **GENERALIZE** derived SLI/SLO/alert evaluation identity and dependency-qualified freshness.
- **INTEGRATE** Deployment cohort/traffic/topology identities without letting Observability own desired/effective deployment state.
- **GENERALIZE** incident/remediation/postcondition lineage while **PROVIDERIZE** grouping, query, storage, paging and runner mechanics.
- **HARDEN** current-target/current-authority checks for all remediation actions exposed through AGWS/AI.
- **GENERALIZE** explicit multi-tenant/Station coverage and qualified local/offline closure.
- **DEFER** implementation disposition to Planning B and Architecture Reconciliation.

## Repo-validation questions
1. Which current SB identities can bind telemetry to System, Station, release, deployment attempt, runtime cohort and provider realization without parsing free-form labels?
2. Does current evidence represent telemetry pipeline health, sampling/coverage, backlog/data loss and freshness, or only observed values/statuses?
3. Are health, SLI/SLO evaluation, alert, incident, remediation attempt and recovery postcondition distinct records with lineage?
4. Can a change to config/schema/trust/topology/provider invalidate prior operational readiness/SLO evidence?
5. Where are acknowledge/remediation/deployment/recovery/provider-admin authorities checked, especially through generated UI or AI?
6. Can cross-tenant/cross-Station operational queries prove both authorization and exact coverage?
7. What local evidence/incident state survives disconnected operation, and how is backlog/loss/reconciliation represented after reconnection?
8. Can two observability providers dual-run with continuity/divergence evidence before cutover?
9. Is incident resolution ever used today as a proxy for recovered runtime/domain state?
10. Can telemetry schemas/conventions or SLI queries evolve without silently reusing prior PASS evidence?

## Symbiotic Proof
A hierarchical enterprise runs two Stations across three regions during a 10/90 deployment. The target cohort is ready, but one Station's collector WAL fills while its external backend is unreachable. The platform records queue saturation and missing coverage, so enterprise rollout health becomes `PARTIAL/INCONCLUSIVE` rather than healthy despite recent samples from the other regions. AI proposes a diagnostic runbook and an operator acknowledges the incident, but neither gains deployment/recovery authority. A separately authorized remediation executes against an exact runtime/provider generation and emits action/postcondition evidence. The incident can be administratively resolved while a lost-observation interval remains explicitly incomplete. During later telemetry-provider replacement, both stacks dual-observe the same semantic subject/cohort with tenant isolation and continuity checkpoints; divergence is exposed before cutover. The Station can continue bounded local incident operation offline, including explicit retention/backlog/loss evidence, without widening authority.

## Architecture proof-backfill obligations
1. **Telemetry-pipeline failure proof:** saturate queue/export retries or exhaust WAL and prove downstream operational claims become coverage-degraded/INCONCLUSIVE, never healthy by absence.
2. **Wrong-generation proof:** feed fresh telemetry from revision A while revision B is effective; B must not inherit A's health.
3. **Derived-evaluation staleness proof:** change SLI query/rule/schema/provider/topology revision after PASS and require re-evaluation.
4. **Partial-rollout proof:** observe predecessor 95% and target 5% separately; aggregate health must not hide a failing target or missing cohort.
5. **Multi-Station/tenant proof:** remove one Station/tenant feed; enterprise aggregate explicitly reports missing coverage and unauthorized cross-tenant query remains impossible.
6. **Diagnosis-vs-actuation proof:** AI/operator may diagnose/propose under read authority but remediation/deployment/recovery/provider-admin action is denied without explicit authority.
7. **Remediation postcondition proof:** make a runbook command return success while domain health remains violated; action success must not resolve recovery qualification.
8. **Incident-closure negative proof:** close an incident with a telemetry gap and prove lost interval remains PARTIAL/INCONCLUSIVE rather than retroactively healthy.
9. **Provider replacement proof:** dual-run two telemetry stacks, inject dedup/query/retention divergence and require explicit continuity/divergence disposition before cutover.
10. **Qualified-local-closure proof:** operate disconnected within declared local retention/buffering; then exceed capacity and prove evidence quality degrades without authority broadening or fabricated reconciliation.

## Stable findings
- `G2-FINDING-OOI-31` — Telemetry Pipeline Health, Loss/Backlog and Coverage Are Dependencies of Operational Evidence; Recent Samples Alone Do Not Prove Fresh or Complete Observation.
- `G2-FINDING-OOI-32` — Operational Observations Must Bind to Semantic Subject + Effective Realization/Cohort Revision; Provider Resource Labels Are Correlation Metadata, Not Canonical Runtime Identity.
- `G2-FINDING-OOI-33` — SLI/SLO/Alert Evaluation Is a Revision-bound Derived Artifact Whose Freshness Is Invalidated by Material Rule, Query, Schema, Provider, Topology or Cohort Changes.
- `G2-FINDING-OOI-34` — Incident Resolution Is Not Recovery/Postcondition Proof; Missing Historical Coverage and Dependent Recovery Claims May Remain PARTIAL or INCONCLUSIVE After Administrative Closure.
- `G2-FINDING-OOI-35` — Diagnosis, Remediation Proposal, Remediation Actuation, Deployment, Provider Administration and Recovery Are Non-amplifying Authority Facets With Independent Evidence.
- `G2-FINDING-OOI-36` — Telemetry-provider Replacement Requires Governed Overlap/Continuity Evidence Across Semantic Identity, Coverage, Retention, Evaluation and Tenant Isolation; Backend Reachability or Provider Dedup Is Insufficient.
- `G2-FINDING-OOI-37` — Multi-tenant/Station Operational Aggregation Requires Explicit Authorized Scope and Coverage; Missing Subordinate Evidence Cannot Become Enterprise-wide Health.
- `G2-FINDING-OOI-38` — Qualified Local/Offline Observability Must Expose Retention, Backlog, Loss Budget and Reconciliation Position; Reconnection Cannot Reconstruct Unretained Evidence.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-OOI-TELEMETRY-PIPELINE-QUALIFICATION-DEPENDENCY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with unified evidence qualification while retaining Observability ownership of telemetry loss/backlog/coverage semantics.
- `G2-CAPABILITY-CANDIDATE-OOI-REVISION-BOUND-OBSERVATION-SUBJECT` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with universal realization/evidence lineage; observation subject/cohort binding remains Observability-specific.
- `G2-CAPABILITY-CANDIDATE-OOI-INCIDENT-CLOSURE-POSTCONDITION-SEPARATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Security/Recovery and Architecture Reconciliation; incident administrative lifecycle remains separately owned.
- `G2-CAPABILITY-CANDIDATE-OOI-GOVERNED-REMEDIATION-ACTUATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with faceted authority/governed transition primitives while retaining incident/remediation lineage.

No candidate is promoted in this revisit.

## Value / risk / priority / next question
Value: prevents false operational certainty and unsafe automated response while keeping runtime/provider observability replaceable. Risk: dashboards or AI summaries becoming canonical truth; telemetry gaps interpreted as health; incident resolution conflated with recovery; provider replacement silently changing SLO semantics; local outage broadening authority. Priority: high.

Next capability by authoritative cycle rotation: **Extension / Plugin / Marketplace Architecture — revisit 4 / cycle 5**. Stress-test extension semantic/package identity versus installed/enabled/effective runtime realization; admission/trust/signature/SBOM/provenance; dependency/compatibility closure; install/update/revoke/remove attempt versus postcondition; sandbox/isolation/host capability exposure; extension/provider coexistence and migration; tenant/Station scope and delegated administration; stale trust/policy/evidence invalidation; local/offline extension closure; AI-authored extension authority; AGWS component/extension boundary; and architecture proof-backfill.

## Saturation
Eight material architectural findings were produced. `consecutive_no_material_finding=0`; principal representatives are strong, but material evidence still changes the architecture. **NOT SATURATED**.