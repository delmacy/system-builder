# Observability / Operations / Incident — Generation 2 dossier

Status: FIRST DEEP PASS / NOT SATURATED

## Research question

Which portable primitives let a generated system emit and correlate operational evidence, evaluate service objectives, derive alerts, manage incidents and record operator action without making a telemetry backend or incident SaaS the semantic authority of the application?

## Representatives and evidence/source ledger

| Representative | Coverage | Evidence extracted |
|---|---|---|
| OpenTelemetry | DEEP | Semantic conventions normalize resource, trace, metric, log and profile concepts independently of a specific backend; correlation context can cross signal types. Official: https://opentelemetry.io/docs/concepts/semantic-conventions/ |
| Prometheus | DEEP | Recording/alerting rules derive time series and alert instances from expressions; label sets distinguish instances; pending/firing timing and failed/skipped evaluation are explicit semantics. Official: https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ and https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/ |
| Grafana Alerting | DEEP | Alert rule, alert instance, rule health, notification state and state-history events are separate; silencing/muting notification does not erase alert-state evidence. Official: https://grafana.com/docs/grafana/latest/alerting/monitor-status/view-alert-state/ and https://grafana.com/docs/grafana/latest/alerting/monitor-status/view-alert-state-history/ |
| Sentry | PARTIAL | Error/event/issue and distributed-trace correlation provide useful application-observability contrast, but backend-specific grouping and retention need deeper validation before extracting additional universal semantics. Official: https://docs.sentry.io/ |
| PagerDuty | DEEP | Incoming events become alerts and incidents through service/escalation policy; triggered, acknowledged and resolved are explicit incident states; assignment, escalation, notifications and timeline actions are durable operational lifecycle evidence. Official: https://support.pagerduty.com/main/docs/incidents and https://support.pagerduty.com/main/docs/alerts |
| Google SRE SLO model | DEEP | SLI measurement, SLO objective and error budget/policy are distinct; measurement location and caveats are part of the meaning of the objective. Official: https://sre.google/workbook/slo-document/ |

## Source of truth and universal primitive decomposition

A convergent portable chain is:

`Runtime/Operation Identity -> Telemetry Signal/Event -> Correlation Context -> Derived Indicator -> Objective/Policy -> Alert Instance -> Notification/Escalation -> Incident -> Operator Action -> Operational Evidence`

No single object in this chain should become universal authority for the others. Raw telemetry is evidence, not desired state. An alert is a policy evaluation result, not an incident. An incident is governed operational coordination, not proof that the underlying service is unhealthy. A notification is a delivery attempt, not the alert itself.

The portable source of truth should therefore be split between: semantic telemetry contracts and correlation identities; SLI/SLO/policy definitions; alert/incident lifecycle definitions; and immutable evidence of evaluations/actions. Provider backends own storage/query/execution mechanics only through bindings.

## Identity

- Service/runtime/resource identity must survive telemetry-backend replacement.
- Trace/span, metric series/point, log record and operational event have signal-specific identity/cardinality semantics.
- Alert rule, alert instance and alert evaluation are distinct identities.
- Incident identity is distinct from the alerts grouped into it.
- Operator action identity must bind actor, target, authority/policy context, time and outcome when durable governance is required.

## Lifecycle

`emit -> collect/export -> ingest -> retain/query -> derive indicator -> evaluate objective/rule -> alert pending/firing/resolved -> route/suppress/notify -> incident triggered/acknowledged/resolved -> learn/promote evidence`.

Grafana demonstrates that notification suppression and alert-state history are separate lifecycles. PagerDuty demonstrates that acknowledgement claims operational ownership and changes escalation behavior without resolving the incident.

## Versioning

Version separately: telemetry semantic convention/schema; instrumentation/runtime version; SLI query/measurement definition; SLO target/window; alert rule/policy revision; routing/escalation policy revision; incident workflow/playbook revision; backend/export protocol. Historical evidence must retain the revisions used for each derived decision.

## Failure semantics

- Telemetry loss, sampling and delayed ingestion produce incomplete evidence, not automatically healthy state.
- High-cardinality or invalid labels can cause cost/availability failures independent of application health.
- Rule evaluation can fail or be skipped; this must not silently become a false healthy result.
- `NoData`, evaluation error and firing condition are different states.
- Notification delivery failure is not alert resolution.
- Missing on-call coverage can prevent incident creation/assignment even when an alert exists.
- Operator action failure and incident recovery failure require durable evidence separate from the triggering signal.

## Extensibility and provider boundaries

Portable semantics should expose signal/correlation contracts, objective/rule intent, alert/incident lifecycle and evidence envelopes. OTLP, PromQL, Loki, Sentry grouping, PagerDuty routing, vendor retention and query languages are provider/tool projections. Extensions must be namespaced and must not leak provider locators into logical service, alert or incident identity.

## Governance

Operational authority must be explicit. Silencing, acknowledgement, escalation, rollback/remediation, suppression, objective changes and incident resolution are authority-bearing actions. Observability evidence may recommend or trigger a governed action, but does not itself grant permission to mutate runtime or business state.

## Observability of observability

The telemetry pipeline itself needs health evidence: exporter/collector failures, dropped signals, queue pressure, sampling, ingestion delay, rule-evaluation errors and notification delivery. Evidence completeness/quality must be qualified rather than inferred from the absence of alerts.

## Portability and lock-in

OpenTelemetry semantic conventions and portable export reduce instrumentation lock-in, but backend query languages, aggregation/grouping, retention, cardinality limits, alert engines and incident workflows remain provider-specific. A generated runtime should be able to redirect telemetry through bindings without rewriting business semantics, and retain enough exported evidence for post-handoff operation.

## Product-specific mechanisms vs universal primitives

Product-specific: PromQL, Grafana rule storage/history backend, Sentry issue grouping, PagerDuty escalation implementation, vendor dashboards and proprietary retention/query features.

Universal candidates: signal type; resource/runtime identity; correlation context; telemetry evidence envelope; indicator definition; objective; alert rule/revision; alert instance/evaluation; incident; operator action; evidence provenance/completeness; backend/export binding.

## Convergent patterns

1. Signal generation and signal storage/query are separable.
2. Correlation identity is more portable than a backend URL/dashboard ID.
3. Derived health is qualified evidence, not raw truth.
4. Alert lifecycle and notification lifecycle are distinct.
5. Incident lifecycle adds assignment/ownership/escalation above alerts.
6. Operational mutations require authority beyond observation.
7. Evidence quality/completeness must be observable.

## Divergent patterns

- Metrics systems often identify series through label sets; trace/log systems use event/span identities.
- Alert grouping and incident grouping are intentionally policy/provider-specific.
- SLO/error-budget semantics are organizational policy and not universally enforced by telemetry systems.
- Backend retention, sampling and cardinality controls materially affect available evidence.

## Subcapabilities

Telemetry semantics; signal collection/export; correlation; metrics/logs/traces/events/profiles; telemetry-pipeline health; SLI/SLO/error budgets; alert evaluation; routing/suppression/notification; incident lifecycle; operator action/audit; evidence retention/completeness; privacy/cardinality governance; backend/provider replacement.

## Fresh-main System Builder comparison

Fresh `main` inspected at commit `38af853b78670ff0ea3bc347633299d4aed68a20`.

Concrete evidence exists in `packages/observe/index.ts`: `DeploymentObservation` is content-addressed with deterministic `observationId`, preserves deployment/release/environment correlation, health checks and evidence provenance, and supports enriched operation metadata. `packages/observe/findings.ts` and publish surfaces also exist. `packages/deploy/index.ts` persists deployment health-check evidence.

This supports **KEEP + HARDEN + GENERALIZE** for the existing evidence-first Observe boundary. It does **not** prove a general metrics/logs/traces telemetry plane, SLI/SLO engine, alert lifecycle, incident lifecycle, telemetry backend negotiation or autonomous exporter configuration. Those remain repository-validation questions rather than assumed gaps requiring implementation.

## Hypotheses

- KEEP — deterministic deployment observations and provenance-bearing evidence.
- HARDEN — distinguish evidence completeness/quality and observation health from service/runtime health.
- GENERALIZE — correlation/evidence primitives beyond deployment-only observation where later archaeology proves structural need.
- PROVIDERIZE — telemetry exporters/backends, query engines, alert notification and incident-management integrations.
- INTEGRATE — SLI/SLO and incident concepts only if product proof requires governed operations beyond existing findings/evidence.
- DEFER — vendor-specific dashboards, proprietary query DSLs and full incident SaaS reproduction.
- DO_NOT_BUILD — a bespoke metrics/logs/traces storage backend merely to avoid using established providers.

## Repository validation questions

1. Does Observe already define a stable runtime/service correlation identity beyond deployment correlation?
2. Can generated runtimes export operational evidence without a live Builder/control-plane dependency?
3. Are provenance/completeness semantics sufficient to represent dropped/sampled/delayed telemetry?
4. Where is authority for remediation, rollback or knowledge promotion enforced relative to Observe findings?
5. Are provider bindings already capable of carrying telemetry endpoints/credentials without durable secret leakage?
6. Is health evidence used only as deployment acceptance, or also as continuous runtime health?
7. What retention/export guarantees survive handoff of a generated system?

## Symbiotic Proof

A convincing Generation 2 proof should run one generated runtime with portable correlation semantics against telemetry backend A, preserve the same runtime/service identity while replacing it with backend B, demonstrate trace/log/metric or equivalent correlated evidence, distinguish telemetry loss from healthy state, derive an alert from a versioned rule, create/associate an incident without conflating identities, record an authorized operator action, and verify that exported evidence remains inspectable after the Builder is unavailable.

## Stable findings

- **G2-FINDING-OBS-01 — Telemetry Signal, Derived Health, Alert and Incident Are Distinct Semantic Objects.** Value HIGH; risk of conflation HIGH; priority P0.
- **G2-FINDING-OBS-02 — Correlation Identity Must Survive Telemetry Backend Replacement.** Value HIGH; lock-in risk HIGH; priority P0.
- **G2-FINDING-OBS-03 — Health Is Qualified Evidence, Not a Universal Success Boolean.** Value HIGH; false-positive/negative risk HIGH; priority P0.
- **G2-FINDING-OBS-04 — Alert Rule, Alert Instance and Evaluation Attempt Require Separate Identity/Revision Context.** Value HIGH; audit risk HIGH; priority P1.
- **G2-FINDING-OBS-05 — Alert State, Notification Delivery and Incident Lifecycle Must Remain Separate.** Value HIGH; operational ambiguity risk HIGH; priority P0.
- **G2-FINDING-OBS-06 — SLI Measurement, SLO Objective and Error-Budget Policy Are Distinct Authorities.** Value MEDIUM-HIGH; governance risk MEDIUM; priority P1.
- **G2-FINDING-OBS-07 — Absence of Telemetry Is Not Evidence of Health; Evidence Completeness Must Be Qualified.** Value HIGH; silent-failure risk HIGH; priority P0.
- **G2-FINDING-OBS-08 — Observability Evidence Does Not Grant Operational Mutation Authority.** Value HIGH; safety/governance risk HIGH; priority P0.
- **G2-FINDING-OBS-09 — Telemetry Storage, Query, Alerting and Incident Backends Are Replaceable Provider Boundaries.** Value HIGH; portability risk HIGH; priority P1.
- **G2-FINDING-OBS-10 — Runtime Autonomy Includes Exportable Operational Evidence and Backend-Rebindable Telemetry.** Value HIGH; handoff risk HIGH; priority P0.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-TELEMETRY-EVIDENCE-QUALITY` — CROSS_CUTTING. Multi-representative evidence: OpenTelemetry pipeline semantics + Prometheus evaluation failure + Grafana NoData/error/history. Promotion requires recurrence in Governance/Security/Reconciliation.
- `G2-CAPABILITY-CANDIDATE-OPERATOR-ACTION-AUTHORITY-EVIDENCE` — CROSS_CUTTING. Multi-representative evidence: PagerDuty incident actions + Grafana operational actions + SB Observe findings boundary. Promotion requires recurrence in Governance/Authorization/Architecture Reconciliation.
- `G2-CAPABILITY-CANDIDATE-SERVICE-OBJECTIVE-POLICY` — CROSS_CUTTING. Evidence: Google SRE SLI/SLO/error budget + Prometheus-derived indicators. Promotion requires structural SB product proof rather than observability feature parity.

## Next question

How should extension/plugin/marketplace capability identity, compatibility, trust, installation/activation, sandboxing, lifecycle, provider boundaries and portable extension points be represented without allowing extension mechanisms to become a second uncontrolled semantic authority?