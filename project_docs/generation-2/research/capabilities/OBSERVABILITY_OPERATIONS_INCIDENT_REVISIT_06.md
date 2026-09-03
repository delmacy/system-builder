# Observability / Operations / Incident — Revisit 6 / Cycle 7

## Research question
How should Generation 2 qualify operational health, alerts, incidents and remediation when subject generation, traffic, instrumentation, sampling, collection, expected population, query/evaluation, notification, incident policy, provider and evidence freshness evolve independently, without converting missing or stale evidence into health or allowing AGWS/AI to amplify operational authority?

## Representatives and evidence/source ledger
1. **OpenTelemetry** — sampling is an explicit selection policy; head/tail sampling changes evidence population and completeness. Source of truth: OpenTelemetry sampling/specification documentation.
2. **Prometheus** — alert instances have pending/firing lifecycle; alert state is represented by label sets and becomes stale when inactive; Alertmanager is a separate notification layer. Source of truth: Prometheus alerting rules documentation.
3. **Grafana Alerting** — `No Data`, `Error`, `MissingSeries`, alert state and rule health are distinct; policy may map No Data/Error to Normal, Alerting or Keep Last State. Source of truth: Grafana Alerting documentation.
4. **PagerDuty** — Triggered, Acknowledged and Resolved are distinct incident states; acknowledgement claims ownership and halts escalation but does not prove resolution. Source of truth: PagerDuty incident/escalation documentation.
5. **Google SRE** — prior-cycle evidence for windowed SLI/SLO and burn-rate evaluation remains authoritative; operational claims require explicit observation windows and denominators.

## Typed source of truth, identity and lifecycle
Preserve independent identities:
`ObservedSubjectRevision → InstrumentationRevision → SignalEmission → SelectionDecision → CollectionReceipt → RetentionPosition → QueryRevision → EvaluationAttempt → EvaluationResult → AlertInstance → NotificationDisposition → Incident → Acknowledgement/Assignment → RemediationAttempt → PostconditionEvidence`.

Deployment owns desired/effective runtime realization, generation and traffic. Observability consumes those facts to derive expected observation populations; it must not silently become their source of truth.

Lifecycle facts are not substitutable. `alert delivered` does not mean `incident acknowledged`; `acknowledged` does not mean `remediated`; `remediation command succeeded` does not mean `postcondition healthy`.

## Applicability-scoped operational qualification
An operational-health claim is meaningful only with an applicability vector such as:
`subject revision + runtime generation/cohort + traffic binding + expected population + instrumentation/schema + sampling/selection + collection pipeline + query + evaluation policy + provider + Station/tenant + observation window + evidence horizon`.

A green historical evaluation against an old generation, old traffic split or incomplete expected population cannot qualify a newer realization.

## Evidence freshness, coverage and failure semantics
Minimum evidence states remain distinct: `OBSERVED_HEALTHY`, `OBSERVED_UNHEALTHY`, `NO_DATA`, `EVALUATION_ERROR`, `STALE`, `PARTIAL`, `INCONCLUSIVE`.

Grafana demonstrates why presentation cannot be truth: No Data/Error can be configured to become Normal, Alerting or Keep Last State, while MissingSeries may transition a previously firing instance to `Normal (MissingSeries)`. Therefore `Normal` can describe policy disposition rather than observed recovery.

Every aggregate claim requires an expected-population denominator and observed-population numerator. Expected population is revision-bound to runtime generation/traffic/topology. Coverage itself has freshness: a 10/10 result against yesterday's cohort does not prove today's 12/12 fleet.

## Sampling, selection and replay horizon
Sampling is an evidence-selection contract. Selection policy, rate, cohort and revision must accompany conclusions. Evidence retention/replay is independent from historical validity: raw traces/logs/metrics may expire while an evaluation result remains historically true; after expiry, exact re-evaluation can become `UNAVAILABLE/INCONCLUSIVE`.

Operational evidence therefore needs separate `occurrence`, `receipt`, `evaluation`, `decision` and `retention/replay` times.

## Alert, incident and remediation ambiguity
Prometheus separates alert evaluation from notification handling. PagerDuty separates Triggered/Acknowledged/Resolved, and acknowledgement can time out and retrigger. Generation 2 must preserve these boundaries.

Provider acknowledgement loss creates ambiguous operational actuation. Before retrying acknowledge, silence, resolve or remediation operations, reconcile current incident/alert/target state and expected base. A retry must not overwrite newer ownership, re-open/close a newer incident revision or duplicate remediation.

## Provider boundaries, extensibility and mixed support vector
Provider portability is not binary. Compare at least: signal model/schema, sampling, collection guarantees, cardinality, retention/replay, query semantics, NoData/Error/Stale semantics, evaluation windows, alert identity, silencing, routing, incident lifecycle, escalation/on-call, evidence export, offline behavior and remediation integration.

Provider replacement requires shadow/dual telemetry where useful, semantic comparison and explicit drainage/disposition of residual signal buffers, rules, notification queues, open incidents, acknowledgement/escalation state, on-call cohorts and consumers. Dual ingestion alone is insufficient.

## Governance and delegated Station authority
Authority facets remain separate:
`Observe ≠ Query ≠ Evaluate ≠ Silence ≠ Acknowledge ≠ IncidentAdmin ≠ Diagnose ≠ RemediationPropose ≠ RemediationActuate ≠ Deployment ≠ Recovery ≠ ProviderAdmin`.

`Enterprise → Station → Role → Person` is attenuating. A Station may receive local acknowledge/silence/remediation authority only when explicitly delegated; lower layers cannot weaken enterprise evidence requirements or mint provider/deployment/recovery authority.

## Adaptive Governed Work Surfaces boundary
AGWS remains distinct from generic UI. It may compose governed health, incident, approval and remediation components over admitted capabilities. AI may summarize evidence, diagnose, propose a runbook and materialize an allowed surface configuration, but cannot turn page context or user intent into incident-command, provider-admin, deployment, recovery or canonical-domain authority. Any canonical process/domain change is escalated.

## Qualified local/offline closure
An offline Station closure must bind subject/runtime generation, expected local population, instrumentation/sampling/query/evaluation revisions, retention/buffer horizon, local authority lease/material, incident ledger and reconciliation position. Local health is scoped to that closure. Reconnect requalifies superior policy/trust/runtime/traffic/provider state and preserves late telemetry occurrence lineage.

## Product-specific mechanism vs universal primitive
**Product-specific:** PromQL/LogQL, Grafana state mapping, PagerDuty escalation mechanics, OpenTelemetry sampler/processor configuration, vendor retention and deduplication.

**Universal:** typed operational identity; applicability-scoped qualification; expected/observed coverage; explicit NoData/Error/Stale/PARTIAL/INCONCLUSIVE; selection-policy lineage; evidence replay horizon; alert/notification/incident/remediation separation; reconcile-before-retry; mixed support vectors; residual cohort drainage; delegated non-amplifying authority.

## Convergent/divergent patterns
**Convergent:** missing telemetry is not health; acknowledgement is not resolution; selection/retention constrain conclusions; notification is separate from evaluation; operational truth is window/cohort/revision scoped.

**Divergent:** query language, sampling algorithms, retention, stale handling, alert grouping, incident escalation, notification routing, remediation integration and offline support.

## Subcapabilities
Signal/instrumentation lineage; selection/sampling; collection/retention; expected-population coverage; query/evaluation; alert state; notification disposition; incident ownership/escalation; remediation evidence; evidence freshness/replay; provider coexistence/cutover; local/offline operations.

## SB comparison — evidence bounded
No new repository-wide archaeology was required in this research pass. Prior bounded comparisons remain questions for Planning B, not absence claims. Fresh `main` remains the only product truth when repository reconciliation begins.

## Reconciliation hypotheses
- **GENERALIZE** applicability-scoped operational qualification and typed lifecycle identities.
- **HARDEN** expected-population denominators with runtime generation/traffic freshness.
- **HARDEN** NoData/Error/Stale/PARTIAL/INCONCLUSIVE independent of provider presentation.
- **GENERALIZE** evidence replay horizon and selection-policy lineage.
- **GENERALIZE** reconcile-before-retry for ambiguous operational mutations.
- **PROVIDERIZE** query, sampler, routing, incident/escalation and remediation mechanisms.
- **INTEGRATE** deployment generation/traffic as dependencies without ownership collapse.
- **INTEGRATE** AGWS/AI as governed diagnosis/proposal surfaces without authority amplification.
- **DEFER** implementation disposition to Planning B and Architecture Reconciliation.

## Repo-validation questions
1. Can SB bind health to exact runtime generation, traffic binding and expected cohort?
2. Is expected population represented independently from received telemetry?
3. Can Normal/green preserve an underlying NoData/Error/MissingSeries reason?
4. Are sampling and retention revisions attached to operational evidence?
5. Are alert, notification, incident, acknowledgement, remediation and postcondition separate records?
6. Are ambiguous acknowledge/resolve/remediation outcomes reconciled before retry?
7. Can provider migration prove rule/notification/incident/on-call consumer uptake and residual drainage?
8. Can Station authority permit local acknowledgement without provider-admin/deployment/recovery rights?
9. Does offline closure declare evidence and authority horizons and requalify on reconnect?
10. Can AGWS/AI propose operations while canonical/domain/provider authority remains separately checked?

## Symbiotic Proof
A deployment changes from generation G17 to G18 and shifts 20% traffic to G18. Ten Stations are expected; nine emit healthy telemetry and one disappears. Grafana is configured to Keep Last State, so its UI remains green for the missing series, but Generation 2 records `STALE/NO_DATA` and qualifies only 9/10 observed coverage for the applicable generation/traffic cohort. PagerDuty triggers an incident; a delegated Station operator acknowledges it, proving ownership but not recovery. AI proposes a remediation; the command response is lost, so the system reconciles current target/incident state before retry. During telemetry-provider replacement, dual collection remains active until rule equivalence, notification routing, open incidents, on-call cohorts and residual buffers are drained/dispositioned. AGWS displays and coordinates these facts without gaining provider-admin, deployment, recovery or canonical-change authority.

## Architecture proof-backfill obligations
1. Generation-currentness proof: old green evidence cannot qualify a newer runtime generation/traffic binding.
2. Coverage proof: 9/10 healthy cannot become enterprise healthy.
3. NoData presentation proof: provider Normal/KeepLast must retain underlying NO_DATA/STALE evidence.
4. Sampling proof: changing selection policy scopes/stales comparability.
5. Replay-horizon proof: expire raw evidence and return INCONCLUSIVE/UNAVAILABLE for exact re-evaluation without rewriting historical result.
6. Incident lifecycle proof: acknowledgement changes ownership/escalation but not recovery qualification.
7. Ambiguous remediation proof: lost acknowledgement requires reconcile-before-retry.
8. Provider-cutover proof: dual telemetry alone cannot close migration while rules/notifications/incidents/on-call consumers remain source-bound.
9. Station authority proof: local acknowledge/silence does not grant cross-Station/provider/deployment/recovery authority.
10. Offline reconnect proof: late local telemetry retains occurrence lineage and is requalified against changed superior state.

## Stable findings
- `G2-FINDING-OOI-47` — Effective operational health is an applicability-scoped claim across subject/runtime generation, traffic/cohort, expected population, instrumentation, selection, pipeline, query/evaluation, provider, policy and observation/evidence horizon; no globally current `healthy` fact exists.
- `G2-FINDING-OOI-48` — Signal, selection decision, collection receipt, query/evaluation, alert, notification, incident, acknowledgement, remediation attempt and postcondition are distinct typed identities; success at one boundary cannot prove another.
- `G2-FINDING-OOI-49` — Operational conformance/currentness is revision- and observation-qualified: old green evidence cannot qualify a newer runtime generation, traffic binding, expected population, rule or observation window.
- `G2-FINDING-OOI-50` — NoData, Error, MissingSeries/Stale, PARTIAL and INCONCLUSIVE are evidence states independent of provider presentation; mapping them to Normal/KeepLast/Resolved cannot manufacture observed health or recovery.
- `G2-FINDING-OOI-51` — Operational evidence has independent selection and replay horizons; sampling/retention changes what can be concluded or re-evaluated, and expiry can make later proof unavailable without invalidating historical facts.
- `G2-FINDING-OOI-52` — Alert/incident/remediation mutations with ambiguous acknowledgement require reconcile-before-retry against current incident, ownership, target and expected-base state; blind retry can overwrite newer state or duplicate actuation.
- `G2-FINDING-OOI-53` — Observability/incident provider portability is a mixed support vector, and cutover closes only after semantic comparison plus drainage/disposition of residual signal buffers, rules, notification queues, incidents, escalation/on-call state and consumer cohorts.
- `G2-FINDING-OOI-54` — Qualified local/offline operations and AGWS/AI are non-amplifying: local conclusions/acts remain bounded by delegated closure, reconnect requalifies superior state, and diagnosis/proposal cannot mint incident-command/provider-admin/deployment/recovery/canonical authority.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-OOI-APPLICABILITY-SCOPED-OPERATIONAL-QUALIFICATION-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA applicability graphs while Observability retains generation/traffic/coverage/signal/evaluation/incident dimensions.
- `G2-CAPABILITY-CANDIDATE-OOI-OPERATIONAL-EVIDENCE-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA/Governance evidence horizons while preserving sampling/retention/query/incident semantics.
- `G2-CAPABILITY-CANDIDATE-OOI-MIXED-TELEMETRY-ALERT-INCIDENT-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Preserve independent signal, sampling, retention, query, alert, notification, incident, escalation, offline and evidence axes.
- `G2-CAPABILITY-CANDIDATE-OOI-SIGNAL-RULE-INCIDENT-ONCALL-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Observability/Operations owns residual telemetry/rule/notification/incident/on-call closure during provider migration.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted, distinct and non-amplifying.

## Saturation disposition
Principal representatives are `DEEP`, but eight material architectural findings were produced. `consecutive_no_material_finding = 0`; **NOT SATURATED**.

## Value / risk / priority / next question
**Value:** prevents false-green operations and unsafe automated remediation. **Risk if omitted:** stale/incomplete telemetry can masquerade as health, and provider/admin authority can leak through operational surfaces. **Priority:** high, cross-cutting. **Next question:** after cycle 7, test whether enterprise negative-space scenarios require a distinct operational capability for edge/offline physical systems or are fully owned by this capability plus Deployment/Integration/Security.