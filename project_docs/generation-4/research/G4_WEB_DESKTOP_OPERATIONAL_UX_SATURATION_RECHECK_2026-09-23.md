# G4 — Web Desktop Operational UX Saturation Recheck — 2026-09-23

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Disposition: `NO_MATERIAL_DELTA`
Scope: Web Desktop / Operating Environment — operational UX, observability, multi-display, external apps, performance and accessibility

## Purpose

Recheck the saturated :40 research surface against current primary documentation without creating a parallel taxonomy. This note records whether fresh evidence falsifies or materially refines the existing G4 Web Desktop corpus.

No product implementation, WBS, Work Package, Sprint, TASK, provider adoption or frontend package choice is authorized by this note.

## Sources rechecked

- Grafana Alerting — No Data and Error states: https://grafana.com/docs/grafana-cloud/observe-and-act/alert-and-measure-reliability/alerting/fundamentals/alert-rule-evaluation/nodata-and-error-states/
- Grafana Alerting — stale alert instances: https://grafana.com/docs/grafana-cloud/observe-and-act/alert-and-measure-reliability/alerting/fundamentals/alert-rule-evaluation/stale-alert-instances/
- Grafana Alerting — connectivity errors: https://grafana.com/docs/grafana/latest/alerting/guides/connectivity-errors/
- Grafana Alerting — alert state history: https://grafana.com/docs/grafana/latest/alerting/monitor-status/view-alert-state-history/
- Grafana Loki alerting — no data versus zero results: https://grafana.com/docs/grafana/latest/datasources/loki/alerting/
- Prometheus — recording rules, missed evaluations and rule limits: https://prometheus.io/docs/prometheus/3.14/configuration/recording_rules/
- Prometheus / Alertmanager — Alerts API and delivery guidance: https://prometheus.io/docs/alerting/0.34/alerts_api/
- OpenTelemetry — semantic conventions: https://opentelemetry.io/docs/concepts/semantic-conventions/

## Recheck findings

Fresh primary evidence reinforces, but does not materially extend, the existing corpus:

- Grafana explicitly distinguishes `No Data`, evaluation `Error`, stale/missing series and the configured resulting alert state. `Keep Last State` can intentionally retain the previous alert state during missing/error evidence, and Grafana warns that this alone is insufficient for strict monitoring. This directly reinforces existing G4 invariants `No alert != healthy`, `Visible widget != current evidence`, and the separation of target health from evidence/evaluator health.
- Grafana can transition a missing series to `Normal(MissingSeries)` after configured consecutive evaluations. Therefore a visually normal alert state is not, by itself, proof of fresh positive health evidence. This is already represented by G4 currentness/evidence semantics and does not justify another state machine.
- Loki documents that "no matching logs" may produce no series rather than numeric zero. Thus `No Data != zero events` and query semantics matter. This is already covered by the G4 distinction between absence, negative evidence and `UNKNOWN`.
- Prometheus documents skipped rule evaluations when a prior evaluation overruns its interval and exposes missed-iteration evidence. This reinforces existing evaluator-health, observation-gap, headless-monitoring and bounded-admission research; it does not add a new ownership layer.
- Prometheus rule limits can clear rule outputs on limit breach while recording evaluation error. This reinforces the requirement that capacity/admission failure must not be rendered as healthy silence.
- Alert state history and notification history remain distinct in Grafana. This was already incorporated into external-provider monitoring/notification continuity research.
- OpenTelemetry semantic conventions reinforce normalized naming/interoperability but do not supply operational truth, currentness, authorization or effect semantics; no new semantic-owner role is inferred.

## Adversarial recheck

The requested adversarials remain covered by existing proof obligations:

- stale green monitoring wall -> currentness/evidence boundary already covers it;
- one poller per widget -> shared-subscription/resource-lifecycle research already covers it;
- background desktop resource burn -> lifecycle/admission research already covers it;
- secondary display loss with dirty context -> WindowRegistry/transfer-epoch research already covers it;
- external app authority exceeding SB user -> external authority-realization research already covers it;
- CSP weakened for iframe -> external integration qualification already forbids this shortcut;
- external auth expiry with stale rendered UI -> external-session currentness/requalification already covers it;
- deep link losing tenant/environment/revision -> qualified context-transfer/deep-link obligations already cover it;
- many windows causing memory explosion -> NORMAL/STRESS resource qualification already covers bounded operability;
- display transfer changing semantic context -> presentation/window separation and transfer epochs already cover it.

No adversarial required a new invariant or component family in this recheck.

## UX / monitoring / multi-display / external-app / performance delta

`NO_MATERIAL_DELTA`.

The new source evidence is confirmatory. It strengthens confidence in existing separations:

`Running != Healthy != Ready != Effective`

`No alert != healthy`

`Visible widget != current evidence`

`No Data != zero`

`Normal alert state != fresh positive health evidence`

`Evaluator/capacity failure != target healthy`

`Alert-state history != notification history`

`Installed != loaded != rendered != actively updating`

No new external-app matrix axis is warranted. No new multi-display protocol is warranted. No new resource lifecycle state is warranted. No new accessibility primitive is warranted.

## Accessibility

No new documentary delta. Existing requirements remain: operational status must remain textually/non-color represented; stale/unknown/coverage loss cannot be hidden by visual normality; multi-display announcement deduplication remains WorkspaceSession-scoped; and large recovered histories must be summarized rather than replayed as unbounded live-region chatter.

## Proof obligations

No new proof-obligation family was added. Existing fixtures should explicitly include these already-implied cases when executable validation becomes authorized:

1. last known state green + data source error + `Keep Last State` -> UI still exposes evidence/evaluator degradation;
2. missing series resolves to provider `Normal(MissingSeries)` -> SB does not reinterpret that as fresh positive health evidence;
3. Loki no-match/no-series -> distinguish zero, absence and unknown according to qualified query semantics;
4. missed Prometheus rule evaluation due to overrun -> observation/evaluation gap remains visible;
5. rule output cleared by provider capacity limit -> no healthy-silence inference.

These are refinements of existing fixtures, not new architecture.

## Saturation / next gap

Disposition: `NO_MATERIAL_DELTA / DOCUMENTARY_SATURATION_CONFIRMED`.

The broad :40 scope is documentarily saturated. Remaining high-value work is empirical and should not be simulated by additional abstract taxonomies: NORMAL/STRESS execution, leakage/revocation/failover timing, currentness and memory budgets, browser/screen-reader behavior, provider-version fixtures and human interruption/usability validation.

Until executable/prototype research is explicitly authorized, a future :40 round should only create a material delta if new evidence falsifies or materially narrows an existing model; otherwise it should continue to record `NO_MATERIAL_DELTA` without expanding architecture.
