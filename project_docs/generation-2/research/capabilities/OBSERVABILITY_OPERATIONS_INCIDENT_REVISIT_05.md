# Observability / Operations / Incident — Revisit 5 / Cycle 6

## Research question
How should Generation 2 represent operational truth when instrumentation, sampling, transport, retention, query, alert policy, topology and incident administration can all evolve independently; distinguish missing/error/stale evidence from healthy state; preserve temporal/coverage uncertainty; and keep AI/AGWS diagnosis useful without amplifying incident/remediation/provider/recovery authority?

## Representatives and evidence/source ledger
1. **OpenTelemetry Sampling + Collector** — head sampling decides before full-trace knowledge; tail sampling decides later using more complete trace context; sampling policy changes with system needs and is an explicit information-selection mechanism. Collector remains a separate receive/process/export realization. Sources: https://opentelemetry.io/docs/concepts/sampling/ ; https://opentelemetry.io/docs/collector/
2. **OpenTelemetry semantic conventions/specification** — traces, metrics, logs, profiles and resources use shared semantic conventions, but convention/version and instrumentation identity are separate from the System Builder subject being observed. Sources: https://opentelemetry.io/docs/concepts/semantic-conventions/ ; https://opentelemetry.io/docs/specs/otel/
3. **Prometheus Remote Write + OTLP ingestion** — ordering is guaranteed per time series, not globally across series; retries can make senders fall behind; stale markers carry disappearance semantics; OpenTelemetry batching/multiple collectors can produce out-of-order arrival requiring an explicit acceptance window. Sources: https://prometheus.io/docs/specs/prw/remote_write_spec/ ; https://prometheus.io/docs/guides/opentelemetry/
4. **Grafana Alerting No Data / Error / state health** — query success with no points, query/evaluation error, alert-state transition and rule health are distinct; operators may map No Data/Error to Normal, Alerting or Keep Last State, and Grafana records a state reason. Sources: https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/nodata-and-error-states/ ; https://grafana.com/docs/grafana/latest/alerting/fundamentals/alert-rule-evaluation/alert-rule-state-and-health/
5. **PagerDuty incidents/escalation** — Triggered, Acknowledged and Resolved are distinct administrative states; acknowledgement claims ownership and halts escalation but is not resolution; escalation timeout and assignment policy participate in lifecycle. Sources: https://support.pagerduty.com/main/docs/incidents ; https://support.pagerduty.com/main/docs/escalation-policies
6. **Google SRE alert/SLO practice** — prior cycle evidence remains authoritative for explicit windows, burn-rate evaluation and policy-dependent operational decisions. Source: https://sre.google/workbook/alerting-on-slos/

## Typed source of truth and identity
Generation 2 should preserve a typed operational chain rather than one generic `status`:

`SemanticSubjectRevision → InstrumentationRevision → SignalEmission → SamplingDecision/PolicyRevision → CollectionReceipt → Pipeline/RetentionPosition → QueryDefinitionRevision → QueryResult → EvaluationPolicyRevision → EvaluationResult → AlertInstance → Notification/SuppressionState → IncidentDeclaration → Ownership/Acknowledgement → Resolution → RemediationAttempt → PostconditionEvidence`.

Provider trace IDs, metric labels, alert IDs and incident IDs remain realization/correlation identities. They do not replace canonical System/Station/runtime subject identity. A single subject may legitimately have multiple concurrent observations/evaluations over different cohorts, windows and providers.

## Multi-axis operational revision vector
Operational evidence is applicable only relative to a vector such as:

`subject + runtime/cohort + instrumentation + semantic-schema + sampling-policy + collector/pipeline + retention + query + evaluation-policy + topology + provider + tenant/Station scope + time basis`.

A change on any material axis can stale a prior PASS without changing the metric or alert name. This hardens the cycle-5 finding that SLI/SLO/alert evaluations are revision-bound derived artifacts.

## Sampling is a selection contract, not a transparent optimization
OpenTelemetry explicitly distinguishes head and tail sampling. Head sampling cannot know the full trace and can omit later error-bearing traces; tail sampling uses more complete trace information and can vary rates by criteria. Therefore sampling configuration is evidence-selection policy.

A sampled dataset can support qualified conclusions only if the sampling policy, population scope and known limitations are attached. Changing from 100% to 5%, changing tail criteria, or changing which Station/service receives elevated sampling can invalidate comparability with earlier observations. `sampled=false` or unsampled population is not negative evidence.

Sampling is providerizable as a mechanism; the universal primitive is revision-bound selection/coverage evidence.

## No Data, Error, stale and healthy are not aliases
Grafana demonstrates that rule query outcome and alert state are separate: a successful query can return No Data; evaluation can Error; policy can map either condition to Normal, Alerting or Keep Last State. A state reason can reveal that an apparently Normal result was caused by No Data, Error, pause, rule update or missing series.

Generation 2 must not collapse these into one green/red status. Minimum result classes should preserve `OBSERVED_HEALTHY`, `OBSERVED_UNHEALTHY`, `NO_DATA`, `EVALUATION_ERROR`, `STALE`, `PARTIAL`, `INCONCLUSIVE` and policy-derived alert disposition separately. Mapping No Data to a quiet notification state must not become health proof.

## Expected observation population and denominator
Coverage cannot be inferred only from the series that arrived. Dynamic fleets, canaries and tenant/Station hierarchies require an expected observation population derived from Deployment/topology/registry evidence.

For every aggregate health/SLO claim, evidence should bind `expected subjects/cohorts`, `observed subjects/cohorts`, exclusions and reason. If 9/10 expected Stations report healthy, the result may be scoped healthy for the nine but cannot silently become enterprise-wide healthy. This consumes Deployment realization/routing evidence without making Observability owner of desired/effective deployment state.

## Temporal, ordering and correlation uncertainty
Prometheus Remote Write requires timestamp order for a given series while allowing parallel delivery across different series. Multiple collectors/batching can yield out-of-order arrival. Therefore cross-signal chronology is a partial order unless stronger correlation evidence exists.

Operational records should retain occurrence time, producer clock/source, ingest/receipt time, evaluation time and any correlation identity. Cross-provider joins must expose clock/skew/order uncertainty rather than fabricating a total sequence. Incident timelines may be administrative orderings even when causal event order remains uncertain.

## Alert state, notification disposition and incident administration
Alert evaluation, alert instance state, notification routing/suppression and incident state are distinct. Silencing, deduplication, suppression or maintenance windows can legitimately reduce notification noise while preserving the underlying evaluation/evidence.

PagerDuty acknowledgement means a responder owns/work is underway and escalation pauses; it does not prove the condition cleared. Resolution closes the incident lifecycle, but cycle-5 evidence remains authoritative that recovery/postcondition proof is separate.

Generation 2 should retain actor, assignment/escalation-policy revision, acknowledgement/reassignment/resolve timestamps and reasons. Editing an alert rule or changing incident policy must not silently reuse prior lifecycle evidence as if semantically identical.

## Governance, delegated operations and authority
Authority remains facet-separated:

`Observe ≠ Query ≠ Evaluate ≠ Silence/Suppress ≠ Acknowledge ≠ IncidentAdmin ≠ Diagnose ≠ RemediationPropose ≠ RemediationActuate ≠ Deployment ≠ ProviderAdmin ≠ Recovery`.

`Enterprise → Station → Role → Person` is non-amplifying. A Station operator may acknowledge a local incident or apply a delegated silence without gaining cross-Station read, provider-admin, deployment or recovery authority. AGWS may expose these facets but cannot merge them into a generic "fix" permission.

AI may correlate, summarize, recommend and materialize a proposed runbook. Immediately before actuation, target revision, current authority, current evidence quality and expected-base ownership must be revalidated. Successful command execution remains attempt evidence, not incident resolution or recovery proof.

## Provider boundaries, portability and lock-in
OpenTelemetry supplies portable signal vocabulary/transport patterns, while Prometheus/Grafana/PagerDuty expose provider-specific query, alert, incident and routing mechanisms. Universal identity should stop before provider-specific grouping/dedup/query syntax.

Provider replacement must re-establish semantic subject mapping, expected-population coverage, sampling semantics, schema/convention compatibility, retention/history, query/evaluation equivalence, alert state and incident linkage. Dual-write alone is insufficient if consumer queries/alerts have not moved or if sampling/retention semantics diverge.

## Qualified local/offline closure
Cycle-5 qualified local closure remains valid and is hardened with selection/time semantics. Offline closure should declare expected local population, instrumentation/sampling/query/evaluation revisions, retention/buffering horizon, time-source assumptions, authority material, alert/incident ledger and reconciliation position.

When disconnected, local conclusions are bounded to this closure. On reconnection, changed central sampling/policy/topology/provider revisions require requalification; late telemetry must retain original occurrence/selection lineage and must not be rewritten as contemporaneous evidence.

## Product-specific mechanism vs universal primitive
**Product-specific:** PromQL/LogQL, Grafana NoData mapping UI, PagerDuty escalation/suppression semantics, OpenTelemetry sampler processor configuration, provider retention/dedup/correlation algorithms.

**Universal:** typed operational identity chain; revision-bound sampling/selection evidence; expected-population coverage denominator; explicit NoData/Error/Stale/PARTIAL/INCONCLUSIVE semantics; partial-order temporal evidence; alert-notification-incident separation; facet authority; provider migration qualification; local closure/reconnection requalification.

## Convergent/divergent patterns
**Convergent:** missing telemetry is operationally meaningful but not equivalent to health; sampling changes what can be concluded; evaluation policy is separate from raw signals; incident acknowledgement differs from resolution; provider pipelines impose ordering/retention limits; aggregate claims require scope/coverage.

**Divergent:** query language, sampling algorithms, alert-state vocabulary, dedup/grouping, escalation mechanics, retention, clock handling and provider-specific incident correlation.

## Subcapabilities
Typed signal/observation identity; instrumentation/schema lineage; sampling/selection policy; collection/retention position; query/evaluation revision; expected-population coverage; temporal/correlation uncertainty; alert state and notification disposition; incident ownership/timeline; remediation proposal/actuation evidence; provider coexistence; qualified local/offline operations.

## SB comparison — evidence bounded
No new repository archaeology is performed in this research pass. The cycle-5 bounded search result and repo-validation questions remain evidence generators for Planning B, not absence claims.

## Reconciliation hypotheses
- **GENERALIZE** typed operational evidence identity independent of vendor IDs.
- **HARDEN** operational revision vectors with instrumentation, sampling, query/evaluation and topology dimensions.
- **GENERALIZE** sampling/selection policy as evidence qualification, not a provider implementation detail.
- **HARDEN** NoData/Error/Stale/PARTIAL/INCONCLUSIVE separation from alert disposition and healthy state.
- **GENERALIZE** expected-observation population/denominator evidence using Deployment/topology subjects without moving ownership.
- **GENERALIZE** partial-order temporal/correlation evidence instead of assuming a total incident chronology.
- **PROVIDERIZE** query language, sampler algorithm, grouping/dedup, notification and escalation mechanics.
- **INTEGRATE** AGWS/AI as non-amplifying observation/diagnosis/proposal surfaces.
- **DEFER** implementation disposition and repository mapping to Planning B/Architecture Reconciliation.

## Repo-validation questions
1. Can current SB telemetry bind signals to exact System/Station/release/runtime cohort plus instrumentation/sampling/query/evaluation revisions?
2. Is expected observation population represented independently from received telemetry?
3. Can a provider return No Data/Error while UI remains green or KeepLast, and would SB preserve the underlying reason?
4. Is sampling configuration/version retained with evidence, including head/tail decisions and per-cohort rates?
5. Are occurrence, ingest and evaluation timestamps distinct, and are cross-source clock/order assumptions explicit?
6. Are alert state, silence/suppression, notification state, incident status and recovery state separate records?
7. Does acknowledgement/reassignment preserve actor, policy revision and ownership lineage?
8. Can a Station silence/acknowledge locally without acquiring cross-Station/provider/remediation authority?
9. During provider migration, can the system prove consumer query/alert uptake and semantic sampling/coverage equivalence rather than only dual ingestion?
10. Does reconnect requalify old local evidence against changed policy/topology/provider revisions?

## Symbiotic Proof
An enterprise has ten expected Stations during a canary. Nine report healthy; the tenth loses telemetry. The alert provider is configured to Keep Last State, so its visual state stays Normal, but Generation 2 records `NO_DATA` for the missing Station and enterprise health is `PARTIAL/INCONCLUSIVE` because expected population is 10 and observed population is 9. A tail-sampling policy is simultaneously changed to capture all traces from the canary cohort; prior 5% sampled traces remain comparable only under their old selection contract. A PagerDuty incident is acknowledged by a delegated Station operator, proving ownership and halting escalation without claiming resolution. AI proposes a runbook, but actuation is denied until current target/authority/evidence are revalidated. Late samples arrive out of order through a second collector; their occurrence/ingest times and provider position are retained rather than rewriting the incident timeline. During provider replacement, dual ingestion continues until equivalent subject mapping, sampling semantics, expected-population coverage and consumer alert/query uptake are proven. Adaptive Governed Work Surfaces displays these facts without granting remediation, provider-admin or recovery authority.

## Architecture proof-backfill obligations
1. **No-data negative proof:** remove one expected Station feed while alert UI maps NoData to Normal/KeepLast; enterprise evidence must remain PARTIAL/INCONCLUSIVE and expose the reason.
2. **Sampling-policy staleness proof:** change head/tail sampling rate/criteria after a baseline PASS and prove old representativeness/comparability evidence becomes scoped/stale.
3. **Expected-population proof:** declare ten subjects, deliver nine healthy feeds and prove 9/10 cannot become 100% healthy coverage.
4. **Ordering ambiguity proof:** deliver two correlated signals in opposite ingest order from distinct series/providers and require partial-order/uncertainty rather than fabricated causality.
5. **Alert-vs-notification proof:** silence/suppress a firing alert; evaluation remains firing while notification disposition changes.
6. **Acknowledgement ownership proof:** acknowledge an incident and prove escalation/ownership changes while recovery qualification remains unchanged.
7. **Rule-revision proof:** materially edit query/evaluation policy while old alert state exists and require new evaluation lineage rather than silent inheritance.
8. **Provider consumer-uptake proof:** dual-write to two providers but leave alerts/queries on the old provider; cutover must remain incomplete until consumer uptake/equivalence is disposed.
9. **Station authority proof:** delegate local acknowledge/silence while denying cross-Station query, remediation, provider-admin and recovery actions.
10. **Offline/reconnection proof:** accumulate late local telemetry under old sampling/policy revision, reconnect after central revision changes and require explicit requalification with original occurrence lineage.

## Stable findings
- `G2-FINDING-OOI-39` — Operational identity is typed across subject, instrumentation, emission, sampling decision, collection/retention position, query/evaluation, alert, notification, incident, acknowledgement/resolution, remediation attempt and postcondition; provider IDs are realization/correlation identities only.
- `G2-FINDING-OOI-40` — Effective operational evidence is a multi-axis revision vector spanning instrumentation/schema, sampling, pipeline/retention, query/evaluation policy, topology/provider, subject/cohort and time basis; any material axis can stale prior PASS evidence.
- `G2-FINDING-OOI-41` — No Data, evaluation Error, Stale, PARTIAL and INCONCLUSIVE are first-class evidence states independent of healthy/unhealthy and independent of provider policy that maps them to Normal, Alerting or Keep Last State.
- `G2-FINDING-OOI-42` — Sampling is a revision-bound evidence-selection contract; changing head/tail policy, rate or population invalidates representativeness/comparability assumptions and unsampled observations are not negative evidence.
- `G2-FINDING-OOI-43` — Distributed telemetry chronology is generally a partial order: per-series ordering, batching, retries, multiple collectors and clock/ingest skew prevent provider arrival order from serving as universal causal order.
- `G2-FINDING-OOI-44` — Alert evaluation state, notification/suppression disposition and incident lifecycle are independent; silence, suppression or acknowledgement may change routing/escalation without changing the underlying operational condition.
- `G2-FINDING-OOI-45` — Incident acknowledgement is ownership/escalation evidence bound to actor and escalation-policy revision, not resolution or recovery proof; reassignment/retrigger/resolve require explicit lifecycle lineage.
- `G2-FINDING-OOI-46` — Aggregate operational qualification requires an explicit expected-observation population/denominator joined from topology/runtime subjects; received-series-only aggregation can silently convert missing cohorts/Stations into false healthy coverage.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-OOI-TYPED-OPERATIONAL-EVIDENCE-LIFECYCLE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA typed identity/evidence while Observability retains alert/incident semantics.
- `G2-CAPABILITY-CANDIDATE-OOI-SAMPLING-SELECTION-POLICY-REVISION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Evidence-selection primitive with Observability-specific sampling realization.
- `G2-CAPABILITY-CANDIDATE-OOI-NO-DATA-ERROR-EVALUATION-SEMANTICS` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Preserve explicit operational evidence states independent of provider alert presentation.
- `G2-CAPABILITY-CANDIDATE-OOI-EXPECTED-OBSERVATION-POPULATION-COVERAGE-DENOMINATOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with fleet/topology coverage primitives while Observability owns received/expected telemetry qualification.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces remains promoted, distinct from generic UI and non-amplifying.

## Saturation disposition
Representative coverage is DEEP across OpenTelemetry Sampling/Collector, Prometheus Remote Write/OTLP ingestion, Grafana Alerting, PagerDuty incidents/escalation and Google SRE SLO alerting. Eight material findings were produced, so `consecutive_no_material_finding=0`; capability remains **NOT SATURATED**.

## Value / risk / priority / next question
**Value:** eliminates false green operational state caused by missing data, sampling drift and incomplete fleets; improves incident lineage and provider portability. **Risk if omitted:** silent healthy-by-absence, incomparable SLO evidence, false total ordering and authority leakage from operations UI/AI. **Priority:** HIGH/CROSS-CUTTING. **Next question:** whether Extension/Plugin admission/revocation can reuse typed evidence/expected-population/INCONCLUSIVE primitives without letting observability or provider state become extension authority.