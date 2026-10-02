# G4 — Web Desktop External Monitoring & Notification Continuity Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend / Web Desktop Operating Environment

## Purpose

Close the remaining documentary gap around persistent monitoring and notification continuity when mature external providers own part or all of acquisition, evaluation, alert state, notification routing or history. This extends the headless-monitoring, incident-attention, external-authority and qualification-invalidation research. It does not select a provider, authorize implementation, or materialize WBS/Work Packages/Sprints/TASKs.

## Core finding

`External provider owns evaluation != SB owns notification delivery != Desktop owns monitoring continuity`.

A mature external system may continue evaluating and notifying while every SB Desktop is closed, disconnected, frozen or unauthorized. Conversely, an external UI that still renders does not prove its evaluator or notification path is healthy.

Required distinctions:

- `Rule evaluated != alert firing != notification attempted != notification delivered != responder aware`.
- `Provider alert history != provider notification history`.
- `Provider HA duplicate evaluation != duplicate semantic incident`.
- `Duplicate notification != duplicate external effect`.
- `Silenced notification != alert normal`.
- `Provider-side continuity != SB can currently verify continuity`.
- `SB projection unavailable != provider monitoring stopped`.
- `Provider UI reachable != provider evaluator healthy`.
- `Provider evaluator healthy != notification route healthy`.
- `Provider notification accepted != human acknowledgement`.
- `Running != Healthy != Ready != Effective` remains mandatory.

## Benchmark evidence

### Grafana Alerting

Grafana Alerting explicitly separates rule evaluation from notification delivery: the Scheduler evaluates alert rules and Alertmanager handles notifications. In HA mode, multiple Grafana instances may evaluate the same rules while Alertmanager performs best-effort notification deduplication. Grafana documents that availability is preferred over consistency, so duplicate or out-of-order notifications can occur rather than risk missing notifications.

Grafana also exposes alert-state history separately from notification history. Alert-state history records alert transitions even when silences or mute timings prevent notification, while notification history records notification attempts/contact points/outcomes. This is strong evidence that `alert continuity` and `notification continuity` require separate evidence planes.

Sources:
- https://grafana.com/docs/grafana/latest/alerting/set-up/configure-high-availability/
- https://grafana.com/docs/grafana/latest/alerting/monitor-status/view-alert-state-history/
- https://grafana.com/docs/grafana/latest/alerting/monitor-status/view-notification-history/
- https://grafana.com/docs/grafana/latest/alerting/monitor-status/view-active-notifications/

### Prometheus Alertmanager

Alertmanager groups, routes, inhibits and silences notifications independently of the underlying alert evaluation. In HA deployments, notification state/silences are replicated and the design intentionally fails open: a partition may cause duplicate notifications because avoiding missed critical notifications is preferred over strict exactly-once delivery.

This is useful benchmark grammar for SB: notification deduplication is not proof that only one evaluator existed, and duplicate delivery under failover is not automatically a duplicate incident.

Sources:
- https://prometheus.io/docs/alerting/latest/alertmanager/
- https://prometheus.io/docs/alerting/latest/high_availability/

### Cockpit / PCP

Cockpit itself is intentionally on-demand and does not run continuously when unused. Persistent/historical metrics depend on Performance Co-Pilot logging (`pmlogger`); Cockpit can consume PCP archives, and PCP metrics can be exported for external visualization such as Grafana. Cockpit's own project documentation explicitly described the old multi-server dashboard as session-bound and unsuitable for fleet monitoring, recommending exported PCP metrics plus Grafana for that role.

Therefore `Cockpit page closed != PCP monitoring stopped` only when PCP/export/logging has actually been qualified. Without PCP/history, a Cockpit metrics view is closer to an interactive observation surface than a durable monitoring owner.

Sources:
- https://cockpit-project.org/
- https://docs.cockpit-project.org/cockpit-guide/latest/guide/feature-pcp.html
- https://cockpit-project.org/blog/pcp-grafana.html

### n8n

n8n exposes execution history scoped to workflows/projects a user can access and supports separate hosting/logging/monitoring facilities. Its workflow-sharing semantics also show that execution authority and credential disclosure are not identical: editors can run workflows that use credentials they cannot edit. Consequently, an n8n execution failure/success stream must not be normalized into SB monitoring/notification authority without qualifying project scope, execution visibility, retention, provider-side alerting/logging configuration and credential/effect boundaries.

n8n security-audit API is owner-authorized, demonstrating that administrative monitoring surfaces may require authority beyond ordinary workflow visibility.

Sources:
- https://docs.n8n.io/workflows/executions/all-executions/
- https://docs.n8n.io/workflows/sharing/
- https://docs.n8n.io/hosting/securing/security-audit/

## Provider continuity contract

Research a provider-neutral `ExternalMonitoringContinuityQualification` rather than assuming that an integration named `Grafana`, `Cockpit`, `n8n` or `Portainer` has one fixed monitoring model.

Candidate dimensions:

`ExternalMonitoringContinuityQualification { providerRealizationRef, acquisitionOwner, evaluationOwner, alertStateOwner, notificationOwner, incidentOwner?, historyOwner, retentionDisposition, HA/failoverDisposition, dedupDisposition, notificationDeliveryEvidence, acknowledgementEvidence, currentnessEvidence, auth/disclosureQualificationRef, version/configQualificationRef, recoveryDisposition, provenance }`.

Each dimension can independently be `SB`, `EXTERNAL_PROVIDER`, `HYBRID_DECLARED`, `NONE`, or `UNKNOWN` where meaningful.

Do not infer one owner from another. Example: external provider may own evaluation and alert history while SB owns a separate notification route; or provider may own all alerting while SB is projection-only.

## Continuity states

Candidate normalized dispositions:

- `VERIFIED_CONTINUOUS`: current evidence proves the declared provider-owned stage is operating within its qualified horizon.
- `VERIFIED_DEGRADED`: provider stage operates but with known degradation such as delayed notifications or reduced history.
- `PROVIDER_REPORTS_ACTIVE`: provider reports active but SB lacks sufficient independent/current qualification to claim verified continuity.
- `PROJECTION_UNAVAILABLE`: SB cannot currently observe the provider; provider continuity may still exist.
- `NOTIFICATION_PATH_DEGRADED`: alert evaluation may continue but notification route is impaired.
- `HISTORY_GAP`: continuity cannot be reconstructed for an interval.
- `REQUALIFICATION_REQUIRED`: provider/version/config/auth change invalidates prior qualification.
- `STOPPED_BY_POLICY`: monitoring/notification was explicitly disabled by qualified policy.
- `UNKNOWN`: evidence is insufficient.

`PROJECTION_UNAVAILABLE` is deliberately not `STOPPED`. `UNKNOWN` is not healthy.

## Notification continuity versus incident continuity

A provider notification is a delivery artifact, not the incident itself. Candidate chain:

`Provider condition -> provider alert instance -> provider grouping -> notification attempt -> contact point delivery -> responder acknowledgement? -> provider/SB incident mapping`.

SB should preserve provider identifiers/provenance and avoid manufacturing one-to-one mappings. In HA, duplicate notifications can legitimately refer to one alert/incident. Conversely, one alert may produce repeated notifications over time.

Notification history and alert-state history must remain independently inspectable when the provider exposes them.

## Fail-open versus fail-closed semantics

Provider HA policies differ. Alertmanager/Grafana HA intentionally tolerate occasional duplicate notifications to reduce the chance of missed alerts. SB must not silently impose an exactly-once fiction over a provider with at-least-once/fail-open behavior.

Candidate provider delivery semantics:

`BEST_EFFORT | AT_LEAST_ONCE_OR_DUPLICATES_POSSIBLE | DEDUP_BEST_EFFORT | PROVIDER_SPECIFIC | UNKNOWN`.

These semantics are evidence/provenance, not an implementation selection. If SB adds its own notification route on top of a provider-owned route, duplicate-channel policy must be explicit.

## Desktop Observatory behavior

The Observatory should expose separate qualified signals for:

1. source/acquisition currentness;
2. evaluation continuity;
3. alert-state continuity/history;
4. notification route health/history;
5. incident/acknowledgement ownership;
6. SB projection connectivity/currentness.

A monitor wall must never show `healthy` merely because no new notification arrived. A provider can be evaluating normally while notifications are muted, failing or deduplicated; alternatively, a notification channel can appear idle because evaluation is broken.

Candidate operator-facing examples:

- `Alert evaluation current; notification route degraded`;
- `Provider monitoring may still be active; SB projection unavailable`;
- `State history current; notification history unavailable`;
- `Duplicate delivery possible during provider HA partition`;
- `Observation/history gap — continuity unverified`.

## Extended Desktop and reconnect

External monitoring continuity is Workspace-semantic, not BrowserSurface-semantic. Closing, freezing or losing a secondary display cannot alter provider silences, notification routing or acknowledgement state.

On reconnect, hydrate provider alert/history/notification state before declaring current continuity. A secondary display that slept through a provider failover must not replay cached green state as current. `Presentation epoch current != provider continuity qualification current`.

## External application matrix delta

| Provider/class | Qualified documentary pattern | SB default posture |
|---|---|---|
| Grafana Alerting | backend evaluation + Alertmanager notification; alert-state and notification history separable; HA may duplicate evaluation/delivery | API-backed projection/hybrid; preserve provider HA/dedup semantics |
| Prometheus + Alertmanager | Prometheus evaluates; Alertmanager groups/routes/silences/notifies; HA notification dedup is best-effort/fail-open | treat evaluation and notification ownership separately |
| Cockpit + PCP | Cockpit UI is on-demand; PCP/pmlogger provides persistent history/export when enabled | Cockpit UI is not durable fleet-monitoring owner; qualify PCP/export separately |
| n8n | workflow/execution history and hosting monitoring exist under distinct authority/configuration scopes | treat workflow execution evidence separately from instance monitoring/notification ownership |
| Portainer/Docker/admin consoles | no universal provider-owned alert/notification continuity assumed from UI/API availability alone | `UNKNOWN` until edition/version/config-specific evidence qualifies ownership |

This matrix deliberately preserves `UNKNOWN` rather than filling gaps by analogy.

## Resource/performance findings

Provider-owned persistent monitoring can reduce browser polling, but it does not make provider work free. Desktop fan-out should attach to durable state/history where qualified instead of creating one polling loop per widget.

When a provider exposes both state history and notification history, SB should avoid N×widget history fetches. Candidate path: shared qualified acquisition -> bounded normalization/cache -> disclosure-qualified projections -> per-surface rendering.

History hydration must be bounded by time/range/cardinality and use pagination/virtualization. A long offline interval must not cause unbounded DOM/event replay. Material transitions can be summarized while preserving drill-down provenance.

`Historical events retained != render all events`.

## Accessibility

On reconnect, assistive technology should receive a concise continuity summary rather than a replay storm. Distinguish textually:

- monitoring verified continuous;
- provider reports active but SB cannot verify;
- notification path degraded;
- history gap;
- silence/mute active;
- provider projection unavailable.

Alert history and notification history require keyboard-accessible inspection and non-color semantics. Duplicate-notification provenance should be understandable without requiring a visual topology graph.

## Componentes impact

Candidate additions/refinements:

- `ExternalMonitoringContinuityBadge`
- `ExternalEvaluationOwnerBadge`
- `NotificationRouteHealthBadge`
- `AlertStateHistoryBoundary`
- `NotificationHistoryBoundary`
- `ProviderProjectionUnavailableNotice`
- `ExternalContinuityGapMarker`
- `ProviderHADeliverySemanticsInspector`
- `ProviderMonitoringOwnershipInspector`
- `ReconnectContinuitySummary`

These are catalogue research candidates only.

## Proof obligations / adversarials

1. All SB Desktops close while Grafana-managed alerting remains active -> provider evaluation/notification continuity survives independently.
2. Grafana evaluator remains healthy while contact point fails -> alert state current; notification path degraded.
3. Silence/mute active -> alert-state history still records transitions; no notification does not become healthy evidence.
4. Grafana HA duplicates rule evaluation -> SB does not create duplicate semantic incidents solely from duplicate evaluation records.
5. Provider partition produces duplicate notifications -> SB preserves delivery provenance and does not infer two incidents.
6. Notification history unavailable while alert-state history is current -> continuity dimensions remain separate.
7. SB auth expires while provider alerting continues -> `PROJECTION_UNAVAILABLE/UNKNOWN`, not `STOPPED`.
8. Provider version/config changes HA or history semantics -> prior continuity qualification becomes `REQUALIFICATION_REQUIRED`.
9. Cockpit browser closes while PCP/pmlogger is enabled -> historical metrics can continue independently of Cockpit UI.
10. Cockpit browser closes without PCP/history -> SB does not invent durable monitoring continuity.
11. n8n user can view workflow executions but lacks instance-admin monitoring authority -> workflow evidence does not expand instance-monitoring authority.
12. n8n workflow uses hidden credential -> execution visibility does not disclose credential or imply credential-edit authority.
13. External provider retains only bounded history -> reconnect beyond retention horizon exposes `HISTORY_GAP`.
14. Secondary display sleeps through provider failover -> restored widget requalifies provider continuity before `CURRENT`.
15. Fifty widgets show the same provider alert history -> bounded shared acquisition rather than fifty independent history pollers.
16. Long offline history contains 100k transitions -> bounded hydration/virtualization and summary; no render-all requirement.
17. Alert state is normal but notification route is broken -> do not label overall operational path `Effective` without declared notification requirement evaluation.
18. Notification route healthy but evaluator stopped -> absence of notifications is not health evidence.
19. Provider-owned alert acknowledged externally while SB absent -> reconnect hydrates acknowledgement with provider provenance; no duplicate local ACK.
20. Optional 3D System Map is closed -> external monitoring/notification continuity remains unaffected and equivalent list/table/history access exists.

## Maturity and saturation

`EXTERNAL_MONITORING_NOTIFICATION_CONTINUITY = PARTIALLY_MATURE / MATERIAL_DELTA`.

This closes the remaining broad documentary gap around concrete external-provider ownership and notification continuity. The program now has documentary coverage for operational evidence/currentness, incident attention/correlation/maintenance, Extended Desktop recovery, external authority/invalidation, resource lifecycle, disclosure-safe telemetry sharing, headless monitoring, cost/fairness/admission and provider-owned continuity.

Remaining gaps are predominantly empirical or implementation-dependent: executable NORMAL/STRESS/leakage/revocation/failover fixtures; numeric currentness/revocation/queue/failover budgets; edition/version-specific provider matrices where documentation changes; and accessibility/performance validation under long reconnect histories and capacity pressure.

Future documentary rounds should first attempt to falsify or materially refine existing invariants. If no new evidence changes the model, record `NO_MATERIAL_DELTA` rather than creating another parallel taxonomy.