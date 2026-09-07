# Generation 2 — Planning C — C3.16 Observability / Operations / Incident Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Observability / Operations / Incident**
Decision: `C3.16`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by:

- `RESEARCH_PIPELINE_STATE.json` as phase/current-focus/next-action authority;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- C0 Universal Capability Architecture / Semantic Substrate;
- C1 Elicitation & System Understanding Architecture;
- C2 Physical / Peripheral Integration Boundary;
- `PLANNING_A_OBSERVABILITY_OPERATIONS_INCIDENT_BOUNDARIES.md`;
- `PLANNING_B_OBSERVABILITY_OPERATIONS_INCIDENT_SB_CURRENT_STATE.md`;
- C3.5 Workflow / Durable Execution;
- C3.6 Integration / Automation;
- C3.8 Authorization / Policy / Organization / Multitenancy;
- C3.9 Governance / Compliance / Audit;
- C3.10 Security / Resilience / Failure / Recovery;
- C3.12 Privacy / Data Governance / Retention / Legal Hold / Residency;
- C3.13 Data / Schema / Migrations;
- C3.15 Notifications / Events / Messaging;
- the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions:

- `telemetry observed != authoritative system/domain truth`;
- `signal != confirmed conflict != alert != incident`;
- `measurement != assessment != decision != actuation`;
- `metric without unit/population/window/currentness != decision evidence`;
- `dashboard displayed != current evidence`;
- `healthy aggregate != healthy component/cohort`;
- `low utilization != sustainable capacity`;
- `provider health != canonical operational truth`;
- `alert acknowledged != condition resolved`;
- `remediation requested/accepted != effective != converged != validated`;
- `correlation != causation`;
- `Fleet aggregate != local runtime truth`;
- `AI summary/hypothesis != operational authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict`.

## 2. Problem

Fresh-main archaeology found a meaningful but narrow Observe foundation: deterministic deployment observations/findings, explicit release/environment correlation, evidence provenance/lineage, severity/confidence and publication separated from deployment truth. It did not evidence a generalized owner for metric/log/trace/event identity, freshness/currentness/coverage qualification, SLI/SLO/error-budget semantics, alert/incident lifecycle, diagnostic evidence bundles, remediation coordination, post-incident correction/supersession, provider substitution, local/offline buffering or hierarchical operational authority.

Generation 2 therefore needs a provider-neutral operational evidence plane that can answer not only “what signal exists?” but “what exactly was observed, over which population and horizon, under which producing/evaluation revisions, how current is it, what does it justify, who owns the resulting action, and what remains unknown?”. It must support local autonomous runtimes and Fleet aggregation without inventing omniscient global truth; preserve units, populations, topology and uncertainty; distinguish health assessment from domain truth; and keep incident coordination separate from the actuation authority of the underlying owning capability.

## 3. Target decision

**DECISION C3.16-D1 — establish a provider-neutral, revision-qualified Operational Evidence & Incident Plane with separate semantic owners for evidence production, operational assessment, alert lifecycle, incident lifecycle and response coordination; providerize telemetry/collector/alerting/incident-tool mechanics behind qualified support contracts.**

The capability owns seven linked truth planes:

1. **Telemetry & Evidence Plane** — metric/log/trace/event/profile/synthetic/dependency evidence identity, provenance, producing revision, units, population and observation horizon.
2. **Qualification & Currentness Plane** — freshness, completeness, coverage, sampling, uncertainty, loss, stale/partial/unknown state and evidence eligibility.
3. **Operational Assessment Plane** — health, SLI/SLO/error-budget, capacity/stability and other operational assessments over explicit evidence/profile revisions.
4. **Signal & Alert Plane** — condition/signal identity, alert-rule/profile identity, grouping/deduplication/suppression/silence/inhibition semantics and actionability ownership.
5. **Incident Plane** — incident identity, declared scope, severity/impact, lifecycle, ownership/on-call/escalation, timeline and closure criteria.
6. **Response & Reconciliation Plane** — diagnostic sessions, runbook/response plan references, remediation requests, effect dispositions, reconciliation and residual-risk evidence.
7. **Projection & Fleet Plane** — dashboards, drill-down views, local-runtime projections, Fleet aggregation, currentness/coverage disclosures and control-intent boundaries.

No provider metric name, trace ID, log index, alert fingerprint, incident ticket, dashboard panel ID, collector pipeline ID or vendor health state becomes canonical operational identity merely because it is stable in a realization.

## 4. Canonical semantic identities

The target owns or qualifies identities including:

- `OperationalEvidenceId`;
- `TelemetryStreamId` and `TelemetryStreamRevisionId`;
- `MeasurementProfileId` and `MeasurementProfileRevisionId`;
- `EvaluationProfileId` and `EvaluationProfileRevisionId`;
- `ObservedSubjectRef`;
- `EvidencePopulationRef` / `CoverageCohortRef`;
- `MetricSeriesIdentity` as canonical semantic series identity where applicable;
- `LogRecordIdentity` or immutable evidence-record identity where canonicalization is required;
- `TraceEvidenceRef` / span realization references without making provider trace IDs universal semantic identity;
- `SyntheticProbeDefinitionId` and revision;
- `DependencyHealthAssessmentId`;
- `OperationalAssessmentId`;
- `SLIId`, `SLOId`, `SLORevisionId`, `ErrorBudgetPolicyId` and revisions;
- `OperationalConditionId`;
- `OperationalSignalId`;
- `AlertDefinitionId`, `AlertDefinitionRevisionId`, `AlertOccurrenceId`;
- `IncidentId` and `IncidentRevisionId` where mutable incident metadata is revisioned;
- `DiagnosticSessionId`;
- `ResponsePlanRef` / `RunbookRef`;
- `RemediationAttemptId` as coordination identity, never actuation ownership;
- `OperationalReconciliationId`;
- `ResidualOperationalRiskId`;
- `DashboardDefinitionId` / projection revision, with panel realization IDs remaining non-canonical.

Stable semantic identity is independent of provider storage/query identity. Provider metric/trace/log/alert/ticket identities are realization references carried in provenance.

## 5. Operational evidence envelope

Every evidence item used for a material operational claim must be able to carry, where applicable:

- observed subject and semantic owner;
- subject revision/build/release/runtime/site/provider realization references;
- producer/agent/collector identity and producing revision;
- telemetry or measurement profile revision;
- schema/semantic-convention revision;
- observation time, event time, ingestion time and processing/evaluation time as distinct clocks where relevant;
- valid/evidence horizon and currentness cutoff;
- unit, dimension and normalization semantics;
- population/cohort/filter/sampling scope;
- aggregation function and time window;
- uncertainty/confidence/completeness metadata;
- provenance/predecessor/transformation lineage;
- privacy/classification/minimization references;
- tenant/Station/site/local-runtime/Fleet scope;
- provider realization identity and provider-side receipt/export evidence;
- loss/drop/backpressure/retry indicators for the evidence pipeline itself.

A freshly ingested sample can still be stale with respect to the observed subject. A recent dashboard render can display old evidence. `ingestion_time > observation_time` does not upgrade old evidence into current truth.

## 6. Telemetry kinds and semantic preservation

OpenTelemetry-style semantic conventions are useful realization/interoperability references, but Generation 2 does not collapse all telemetry into one untyped record. The target preserves semantic kind across:

- metrics;
- logs;
- traces/spans;
- domain/operational events;
- profiles;
- synthetic probes;
- dependency/provider health evidence;
- runtime/deployment observations;
- business/domain postcondition evidence referenced from owning capabilities.

Cross-kind correlation is explicit lineage or typed graph relation. A trace-to-log correlation does not make the log canonical truth of the traced operation; a metric derived from logs is a derived evidence artifact with transformation lineage.

## 7. Metric semantics: units, populations, windows and uncertainty

**DECISION C3.16-D2 — every material metric claim is scope-qualified by unit, semantic dimension, population, aggregation and time window; no scalar metric may silently erase these dimensions.**

A metric definition/profile can include:

- semantic measure name/kind;
- unit and dimension;
- monotonicity/counter/gauge/distribution semantics where applicable;
- source population and eligibility rules;
- numerator/denominator definitions;
- aggregation function;
- time-window kind and boundaries;
- missing-data policy;
- sampling strategy;
- cardinality/label dimensions;
- expected precision/uncertainty;
- producer/profile revisions;
- currentness and lateness tolerances.

Examples of invalid coercions:

- CPU percent without declaring denominator/capacity basis;
- latency without percentile/distribution/window/population;
- error rate without numerator/denominator eligibility;
- queue depth without age, arrival/service context and class/cohort;
- availability without defining good/valid events and excluded populations;
- cost-adjacent usage without unit/source/currentness suitable for FinOps consumption.

Missing data is never automatically zero. It may produce `PARTIAL`, `UNKNOWN` or `INCONCLUSIVE` depending on the measurement profile.

## 8. Logs, traces and event evidence

Logs are immutable evidence records once accepted into the canonical evidence lineage; corrections use annotation/supersession rather than history rewriting.

Trace/span relationships provide causal/temporal execution context only to the extent justified by instrumentation semantics. Distributed trace linkage is not universal business causality and may be partial under sampling, exporter loss, asynchronous boundaries, cross-provider hops or offline buffering.

Operational events are distinct from C3.15 communication transport facts. C3.15 owns message/event delivery/replay semantics; C3.16 owns the operational meaning of qualified signals/evidence derived from those facts.

`message delivery failure signal != incident` and `event occurrence != operational failure` unless an explicit evaluation profile says the evidence satisfies the relevant condition.

## 9. Evidence currentness, completeness and coverage

Currentness is evaluated against the claim being made, not simply the age of the newest sample.

Evidence qualification states may include:

- `CURRENT`;
- `STALE`;
- `PARTIAL`;
- `UNKNOWN`;
- `INCONCLUSIVE`;
- `NOT_APPLICABLE`;
- provider/profile-specific additional states only when explicitly mapped.

Coverage is multidimensional and may include:

- tenant/organization;
- Station/site/region/zone;
- runtime/build/release revision;
- provider/binding;
- route/endpoint/operation class;
- client/device/edge cohort;
- queue/consumer cohort;
- time horizon;
- sampled population;
- dependency graph component.

A healthy majority cannot hide a critical unhealthy minority. Coverage aggregation must retain cohort denominators and uncovered populations.

## 10. Assessment semantics and no universal scalar health

Operational assessment is a derived claim over evidence plus an evaluation profile. It never overwrites underlying domain/runtime/provider truth.

Assessment outcomes may include:

- `HEALTHY` / `PASS`;
- `DEGRADED`;
- `UNHEALTHY` / `FAIL`;
- `PARTIAL`;
- `INCONCLUSIVE`;
- `UNKNOWN` where the external/evidence state itself is ambiguous.

A composite dashboard or executive view may project a summary, but it must preserve drill-down to contributing claims, applicability, currentness and unresolved cohorts. No universal scalar health, quality, complexity or operational readiness score is canonical.

Cross-capability operational state is better represented as a vector or typed graph of claims, for example:

`{availability, latency, correctness evidence, queue stability, dependency health, trust currentness, privacy/governance blockers, capacity headroom, recovery readiness}`

with each dimension carrying its own scope and evidence.

## 11. SLI, SLO and error-budget semantics

**DECISION C3.16-D3 — SLI/SLO/error-budget models are first-class, revision-qualified operational semantics, while the business/governance owner of the objective remains separate.**

An `SLI` defines how a service behavior is measured: qualifying population, good/valid event logic, measure/units, evidence source, aggregation and window.

An `SLO` binds one or more SLI semantics to target thresholds and evaluation windows for a declared service/cohort.

An error budget is derived from the SLO objective over an explicit period and eligible population. Error-budget policy can govern operational/change decisions, but the policy owner/authority is explicit and may be Governance, Deployment, Security or another owner; Observability does not acquire universal release-control authority merely because it evaluates the budget.

Historical SLO results remain tied to the SLI/SLO revisions that produced them. Changing the target or population does not rewrite prior compliance history.

Burn-rate or similar derived assessments must preserve window definitions, baseline objective and source evidence lineage.

## 12. Dependency and synthetic health

Synthetic probes and dependency checks are evidence sources, not universal truth.

A synthetic check can prove that a particular path worked from a particular vantage point under a declared probe revision and time horizon. It cannot prove all users, sites or dependency paths are healthy.

Dependency health is graph-qualified:

`consumer -> dependency -> binding/provider/runtime realization -> observed evidence`

The system may compute propagated-risk or degraded-path views, but one dependency's health status cannot be naively copied to every consumer. Required versus optional dependencies, fallback paths, circuit breakers, cached/offline modes and cohort routing matter.

## 13. Signal, condition, alert and incident separation

**DECISION C3.16-D4 — represent signal, evaluated condition, alert occurrence and incident as separate identities/lifecycles.**

- A **signal** is raw or derived operational evidence relevant to a possible condition.
- A **condition** is an evaluation result over a profile and evidence horizon.
- An **alert** is a governed actionability projection/occurrence created when a condition meets alert criteria.
- An **incident** is a separately declared operational coordination object for material impact or risk requiring response.

Multiple signals can contribute to one condition; multiple conditions can group into one alert or incident; one alert can remain non-incident; one incident can exist even if notification delivery fails.

Prometheus Alertmanager-like grouping, inhibition and silencing are valid realization patterns, but the canonical model keeps them explicit:

- grouping changes notification/action presentation, not underlying condition identity;
- inhibition/silence suppresses routing/notification, not the condition itself;
- acknowledgement indicates ownership/receipt, not resolution;
- deduplication does not erase distinct contributing evidence.

## 14. Alert actionability and ownership

Every page-worthy/high-severity alert requires, directly or through an applicable policy:

- explicit owner/on-call route;
- severity/priority semantics;
- expected acknowledgement time;
- escalation path;
- diagnostic context/drill-down;
- response/runbook reference where known;
- suppression/inhibition eligibility and audit trail;
- evidence currentness and scope;
- closure/resolve semantics distinct from notification delivery.

`alert != action owner` unless routing/ownership is explicitly resolved. An alert without a responsible owner is an operability gap, not “complete monitoring”.

Alert storms are an operational capacity problem. Grouping/suppression may protect humans and notification systems, but suppression must remain visible in evidence so a quiet paging channel cannot be mistaken for system health.

## 15. Incident lifecycle

The canonical incident lifecycle may include:

`DETECTED -> DECLARED -> OWNED/ACKNOWLEDGED -> INVESTIGATING -> CONTAINED/MITIGATED -> RECOVERING -> SERVICE_RESTORED_CANDIDATE -> VALIDATED -> RESOLVED -> CLOSED`

not every incident must traverse every state, but transitions are explicit and evidence-backed.

An incident record carries, where applicable:

- subject/service/cohort scope;
- impact/severity;
- detection evidence;
- commander/owner/on-call/escalation;
- affected tenants/sites/runtime/provider cohorts;
- timeline and evidence references;
- hypotheses and confidence without causal promotion;
- response/remediation requests and effect evidence;
- declared recovery/validation criteria;
- residual risk/debt;
- post-incident artifacts and follow-up obligations.

Incident closure requires current evidence appropriate to the incident's declared scope. Silence, elapsed time or provider acknowledgement are insufficient.

## 16. Diagnostic sessions and causal restraint

Diagnostic work is represented as a bounded evidence session with explicit hypotheses, queries, selected evidence, timestamps and analyst/AI provenance.

AI may correlate signals, summarize evidence and propose likely causes. Such outputs remain `InferredCandidate`/hypothesis until authoritative evidence and human/system rules establish a stronger status.

`correlation != causation` remains constitutional. Causal/counterfactual models stay research/analytical semantics unless separately governed; incident diagnostics cannot silently promote a statistical association into root-cause truth.

Post-incident reviews distinguish:

- observed facts;
- claims;
- assumptions;
- inferred candidates;
- decisions;
- contributing factors;
- causal conclusions with stated evidence standard;
- unresolved questions.

## 17. Response coordination and actuation boundaries

Observability / Operations / Incident may coordinate a remediation but does not own arbitrary domain actuation.

A response can reference operations such as:

- deployment rollback;
- provider failover;
- workflow redrive;
- queue pause/drain;
- credential/certificate rotation;
- data restore/recovery;
- configuration rollback;
- circuit-breaker or degraded-mode changes;
- manual operational steps.

The owning capability evaluates authority, safety, eligibility and effect semantics.

Response checkpoints preserve:

`remediation proposed -> authorized -> requested -> accepted/acknowledged -> APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN -> reconciled -> converged -> service condition re-evaluated -> validated`.

`UNKNOWN -> reconcile-before-retry` unless the same operation identity and idempotency/effect contract prove replay safety.

Operational urgency never creates new authority.

## 18. Queueing, capacity, overload and stability evidence

**DECISION C3.16-D5 — capacity/overload claims are multidimensional and queue-aware, with explicit units/populations/windows; utilization alone is insufficient.**

The operational model can qualify:

- arrival rate `λ` by class;
- service rate `μ` by resource/path;
- utilization `ρ = λ/μ` only under declared assumptions;
- queue depth;
- queue age / oldest-item age;
- wait/service/sojourn distributions;
- concurrency and in-flight work;
- burst size/duration;
- retry/redelivery amplification;
- fan-out;
- provider quotas/rate limits;
- backpressure and rejection/shed rates;
- dependency saturation;
- worker/thread/connection/CPU/memory/storage constraints;
- recovery/reconciliation throughput;
- offline buffer accumulation/reconnect burst;
- headroom/stability margin;
- uncertainty/confidence of estimates.

`low mean utilization != sustainable capacity`.

A system can be unstable while average utilization looks acceptable because one cohort, dependency, queue class or burst window is overloaded. Capacity claims therefore remain vector-valued and topology-aware.

## 19. Telemetry pipeline observability and loss

The evidence pipeline observes itself. Provider/collector/exporter success cannot be assumed.

Pipeline evidence includes, where applicable:

- collection success/failure;
- local queue depth/age;
- dropped records;
- sampling decisions;
- retry exhaustion;
- exporter/receiver backpressure;
- batch delay;
- storage/indexing lag;
- schema/convention mismatch;
- cardinality limiting;
- retention expiry;
- clock skew;
- offline buffer status;
- destination acknowledgement;
- reconciliation status.

A green dashboard built on a lossy exporter is not reliable health evidence unless the loss/currentness is itself qualified.

## 20. Provider / collector / exporter qualification and substitution

Provider/Binding remains owner of discovery, qualification, admission and binding. Observability declares a required support vector including:

- telemetry kinds supported;
- semantic-convention/schema fidelity;
- timestamp preservation;
- sampling semantics;
- loss/drop behavior and evidence;
- buffering/retry/backpressure semantics;
- retention/query horizon;
- cardinality/volume limits;
- regional/residency behavior;
- encryption/trust/secret requirements;
- tenancy/isolation;
- offline/local collector behavior;
- alerting/grouping/silence/inhibition support;
- SLO/evaluation support where used;
- incident-tool integration/export;
- audit/provenance quality;
- cost/usage dimensions.

Provider substitution lifecycle:

`qualify target -> establish parallel/shadow telemetry where safe -> compare semantic equivalence/coverage -> cut over producer/exporter/query cohorts -> reconcile gaps/cursors/time ranges -> fence old writes -> retain/migrate historical evidence as governed -> drain buffers/residual alerts/incidents -> verify currentness/closure`.

Matching metric names or dashboard screenshots do not prove semantic equivalence.

## 21. Local runtime, offline operation and Fleet

Generated systems may continue collecting and using bounded local operational evidence while disconnected when the relevant contract supports it.

Local runtime evidence preserves:

- local observation time and clock qualification;
- local build/release/runtime/site identity;
- local collector/profile revision;
- offline buffer identity/horizon;
- local alert/incident occurrences;
- local response decisions within delegated authority.

When connectivity returns, evidence is reconciled/exported with original timestamps and provenance. Fleet does not overwrite local history.

Required boundary:

`local evidence -> exported evidence -> Fleet aggregation -> operator interpretation/control intent -> local authorized actuation -> local effect evidence`.

Fleet can say “last known”, `PARTIAL`, `STALE`, `UNKNOWN` or cohort-specific health. It cannot silently project an absent site as healthy.

## 22. Dashboard and drill-down semantics

Dashboards are governed projections, not truth stores.

A dashboard/view revision records:

- intended audience/Station/role scope;
- source assessment/evidence references;
- query/profile revisions;
- refresh/currentness policy;
- aggregation and filtering;
- hidden/excluded cohorts;
- units and display transformations;
- drill-down links;
- stale/partial/unknown rendering rules;
- privacy/security redaction rules.

A dashboard must surface data age/currentness for material operational claims. Cached view success does not imply source evidence success.

AGWS can present dashboards, incidents, queues and authorized response controls but cannot convert visibility into authority or suppress mandatory higher-level evidence.

## 23. Privacy, security, trust and governance boundaries

Operational telemetry can contain governed personal, secret, security-sensitive or commercially sensitive data. C3.12 Privacy/Data Governance therefore applies to telemetry populations, traces, logs, incident timelines, packet-like payload excerpts, user/device identifiers and retained diagnostic bundles.

Required controls include:

- data minimization;
- redaction/tokenization/pseudonymization where applicable;
- purpose/use qualification;
- retention/disposition/legal-hold rules;
- residency/transfer qualification;
- access authorization;
- secret avoidance/reference-only practices;
- trust-qualified ingestion/export;
- tamper/integrity evidence for audit-critical records;
- audit lineage for incident/response changes.

Security/Resilience retains containment, restore/failover and return-to-service qualification. Governance retains obligation/control/waiver authority. Observability provides qualified evidence to both without absorbing their authority.

## 24. Physical / Peripheral Integration boundary

Physical/peripheral telemetry remains inside the C2 integration/governance plane.

VMS/BMS/access-control/PDV/industrial/device platforms may supply telemetry, alarms or status evidence through qualified adapters/gateways. Observability can assess the received evidence and operational behavior, but:

- `provider-reported physical state != physical truth`;
- connector health != physical effect correctness;
- camera stream availability != scene correctness;
- access-controller event receipt != door state truth;
- BMS sensor telemetry != safe control-loop authority.

No generic direct physical actuation is inferred from monitoring or incident response.

## 25. Brownfield monitoring and runbook assimilation

Brownfield discovery can ingest existing:

- dashboards;
- metrics/log queries;
- alert rules;
- silences/inhibitions;
- on-call rotations;
- incident tickets;
- runbooks;
- scripts/manual procedures;
- provider-native health pages;
- spreadsheet/checklist monitoring;
- operator tacit knowledge.

All are classified as `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope` or `Deferred` as appropriate.

Observed alerting behavior or a legacy runbook is evidence/candidate, not automatically canonical desired operation. Hidden manual monitoring is explicit elicitation debt until mapped/adopted.

## 26. Operability Elicitation Lens

The capability-specific lens must adaptively discover at least:

- what “working”, “degraded”, “unavailable”, “restored” and “validated” mean per capability/service;
- canonical subjects and semantic owners;
- required telemetry kinds and evidence sources;
- expected/peak load and traffic classes;
- latency, throughput, error, correctness and business-postcondition evidence;
- SLI/SLO/error-budget definitions and owners;
- queue/backlog/retry/fan-out/headroom/stability limits;
- dependency health and synthetic vantage points;
- timestamps/currentness/late-data tolerances;
- sampling/coverage/population requirements;
- alert conditions, severity and owner/on-call/escalation;
- suppression/silence/inhibition rules and risks;
- incident declaration/closure criteria;
- failure modes and `PARTIAL/UNKNOWN` states;
- recovery/reconciliation/rollback validation;
- offline/local operation and Fleet expectations;
- provider quotas and telemetry pipeline limits;
- privacy/security/retention constraints;
- dashboards/drill-down needs;
- change/deploy validation and residual cohorts;
- evidence required to prove restoration.

High-value adaptive questions include:

- `Como sabemos que funciona?`
- `Como detectamos degradação antes da indisponibilidade?`
- `Qual população/site/coorte esta evidência realmente cobre?`
- `Quão velha pode ser a evidência antes de virar stale?`
- `Que estado pode permanecer UNKNOWN?`
- `Quem responde e em quanto tempo?`
- `Qual sinal deve acionar alguém e qual apenas informar?`
- `Que evidência prova recuperação, não apenas silêncio?`
- `Que filas/backlogs podem crescer sem aparecer no dashboard atual?`
- `Como sabemos que o próprio pipeline de observabilidade não está perdendo dados?`

An answer containing text is not sufficient. Critical dimensions require evidence/currentness and contradiction disposition before `RESOLVED`.

## 27. Production Readiness Coverage

Production readiness is separate from feature completeness. Coverage is multidimensional and can use `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED` with evidence/currentness.

For Observability / Operations / Incident, critical dimensions include:

- telemetry/evidence coverage;
- SLI/SLO definition and ownership;
- alert actionability;
- incident ownership/on-call/escalation;
- failure and UNKNOWN handling;
- dependency visibility;
- queue/capacity/headroom evidence;
- telemetry-pipeline self-observability;
- recovery validation;
- privacy/security treatment;
- offline/Fleet currentness;
- provider substitution/reconciliation;
- post-change/deploy validation.

No aggregate score may hide a HIGH/CRITICAL unresolved gap. A feature-complete system with no incident owner or no recovery evidence remains not production-ready.

## 28. Planning D migration constraints

Planning D must later sequence migration without treating this target decision as implementation. Constraints include:

1. preserve existing deterministic `DeploymentObservation`, finding and evidence-provenance identities as compatibility inputs unless a deliberate supersession mapping is established;
2. add generalized evidence/currentness/coverage semantics incrementally rather than invalidating historical deployment evidence;
3. allow free-form logs/runbooks/dashboards and structured canonical evidence to coexist during migration;
4. backfill provenance only when source evidence supports it; do not invent historical timestamps/populations/revisions;
5. separate provider-native metric/alert/incident IDs from canonical identities before provider substitution;
6. migrate evaluation profiles and dashboards with explicit revision/coexistence rather than in-place semantic mutation;
7. preserve historical alert/incident evidence while introducing canonical lifecycles;
8. support dual telemetry pipelines during provider cutover where semantically safe and explicitly reconcile gaps/loss;
9. treat offline/local evidence migration as a first-class cohort, not an afterthought;
10. introduce privacy/minimization/retention governance over historical telemetry without pretending past data was collected under new policy;
11. preserve source owner boundaries so observations do not become canonical domain truth;
12. route AGWS/Fleet projections only after currentness/authority semantics are established.

Planning D is not executed by this artifact.

## 29. Planning E product-proof candidates

Planning E should later require proofs including:

- telemetry observed cannot overwrite domain/runtime canonical truth;
- evidence identity/provenance survives provider substitution;
- stale/partial/lossy telemetry yields `PARTIAL/INCONCLUSIVE/UNKNOWN` rather than false healthy;
- metric claims preserve unit/population/window/currentness;
- healthy aggregate cannot mask an explicitly critical unhealthy cohort without disclosure;
- SLI/SLO revisions preserve historical evaluation lineage;
- error-budget calculations are reproducible for the declared population/window;
- signal/condition/alert/incident identities remain distinct;
- silence/inhibition/acknowledgement cannot resolve the underlying condition;
- alert without action owner is detected as readiness debt;
- incident closure requires scope-appropriate current evidence;
- remediation ACK cannot close an incident without effective/converged/validated evidence;
- `UNKNOWN` remediation effect triggers reconcile-before-retry;
- correlation/AI hypothesis cannot become authoritative root cause without required evidence/decision;
- dashboards visibly expose stale/partial/unknown state;
- collector/exporter loss is observable and can invalidate downstream health claims;
- local offline evidence retains original provenance/currentness when reconciled to Fleet;
- Fleet aggregate cannot claim local health beyond evidence coverage;
- low utilization cannot prove sustainable capacity where queues/headroom contradict it;
- queue/backlog/age/retry amplification and overload remain visible under incident stress;
- Brownfield alert/runbook discovery remains candidate evidence until adopted;
- privacy-sensitive telemetry obeys minimization/access/retention/residency rules;
- Physical/Peripheral telemetry does not infer direct physical actuation authority;
- AI/low-code cannot fabricate evidence, hide contradictions, convert `INCONCLUSIVE` to PASS or acquire incident-remediation authority.

Planning E is not executed by this artifact.

## 30. Alternatives considered

### Alternative A — provider/dashboard-first observability
Rejected as canonical architecture. It couples semantic truth to vendor metric names, alert fingerprints, dashboards and incident tools; weakens portability and currentness/provenance.

### Alternative B — one universal health score
Rejected. It hides critical cohort failures, units, populations, uncertainty, governance/security blockers and queue/capacity dimensions.

### Alternative C — treat every signal as an alert and every critical alert as an incident
Rejected. This collapses evidence, evaluation, actionability and coordination lifecycles, producing noise and false incident semantics.

### Alternative D — Fleet as central operational source of truth
Rejected. Offline/local autonomous systems and lossy telemetry make Fleet necessarily a qualified aggregation/coordination plane.

### Alternative E — fully autonomous AI incident authority
Rejected. AI may summarize/correlate/propose; it may act only through separately authorized operations and never promotes inferred cause or expands authority.

### Chosen model
**Provider-neutral operational evidence + revision-qualified assessments + distinct alert/incident lifecycles + local/Fleet qualified aggregation + owner-bounded response coordination.**

## 31. Invariants and non-goals

Invariants:

- `telemetry observed != system truth`;
- `signal != confirmed conflict/incident`;
- `measurement != assessment != authority`;
- `healthy aggregate != healthy cohort/component`;
- `missing/stale evidence != healthy`;
- `metric without unit/population/window/currentness != decision evidence`;
- `alert delivery != alert acknowledgement != condition resolution`;
- `incident silence != incident closure`;
- `remediation requested/accepted != effective/converged/validated`;
- `correlation != causation`;
- `Fleet aggregate != local runtime truth`;
- `dashboard displayed != current`;
- `provider health != canonical operational truth`;
- `AI summary != operational authority`.

Non-goals:

- canonical business/domain truth ownership;
- deployment/runtime actuation ownership;
- workflow redrive ownership;
- notification transport ownership;
- governance/compliance authority;
- security/recovery qualification ownership;
- FinOps/economic interpretation ownership;
- direct physical control;
- universal health/quality/complexity scalar;
- vendor-specific metric/query language as canonical IR.

## 32. Decision result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Observability / Operations / Incident is established as a provider-neutral, revision-qualified operational evidence and incident plane. It owns telemetry/evidence identity and provenance/currentness/coverage, operational assessments, SLI/SLO/error-budget semantics, signal/alert/incident lifecycle, diagnostic and response-coordination evidence, local/Fleet operational projections and reconciliation. It does not own the canonical truth or actuation authority of the systems it observes.

The existing SB deployment Observe/evidence primitives are **KEEP + HARDEN + GENERALIZE + INTEGRATE** inputs, not proof that the target already exists.

No architecture-level contradiction requiring taxonomy rewrite was found. No adversarial research is reopened. No ConflictInstance or remediation is created.
