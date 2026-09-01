# Generation 2 — Representative Coverage Ledger

States: `NOT_REVIEWED`, `PARTIAL`, `DEEP`, `N_A`, `LOW_VALUE`.

Previous capability coverage remains authoritative in the corresponding dossiers and state file; this ledger is append-oriented as research advances.

## Observability / Operations / Incident coverage

| Representative | Coverage | Why this pass matters | Revisit focus |
|---|---|---|---|
| OpenTelemetry | DEEP | Portable signal/resource semantic conventions and cross-backend instrumentation/export boundary. | Collector failure evidence, sampling and protocol/provider negotiation. |
| Prometheus | DEEP | Derived indicators, rule evaluation, label-set alert identity and explicit evaluation failure/skips. | Remote-write portability, cardinality governance and long-term retention. |
| Grafana Alerting | DEEP | Separates rule/instance health, state history, suppression and notification state. | Policy export, backend replacement and audit integration. |
| Sentry | PARTIAL | Application errors/issues and distributed trace correlation contrast backend-specific grouping with portable correlation. | Issue-grouping identity, sampling, retention and provider-exit semantics. |
| PagerDuty | DEEP | Separates event, alert, incident, assignment, escalation, acknowledgement/resolution and action timeline. | Incident workflow portability, automation authority and evidence export. |
| Google SRE SLO model | DEEP | Separates SLI measurement, SLO objective and error-budget policy with measurement caveats. | Multi-window objectives, governance and release/deployment policy integration. |

Historical representative coverage for prior capabilities is preserved in `RESEARCH_PIPELINE_STATE.json` and their capability dossiers; no prior status is superseded by this compact ledger update.
