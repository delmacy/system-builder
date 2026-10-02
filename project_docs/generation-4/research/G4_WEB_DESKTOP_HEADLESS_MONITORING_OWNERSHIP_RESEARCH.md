# G4 — Web Desktop Headless Monitoring Ownership Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend / Web Desktop Operating Environment

## Purpose

Close the remaining operational-UX gap around monitoring ownership when no Web Desktop, browser surface, or interactive user session is open. This is research only. It does not select a provider, authorize implementation, or make the Web Desktop/runtime mutually dependent.

## Core finding

`Monitoring obligation != interactive consumer lifecycle`.

A `DesktopObservatory`, `MonitorWall`, widget, or browser-local subscription broker is a projection/consumer of operational evidence. It must not become the owner of a monitoring obligation merely because it is currently visible. Closing the last browser surface must not silently stop evidence acquisition, alert evaluation, incident continuity, maintenance expiry, or recovery qualification when those obligations are declared persistent.

Conversely, not every ad-hoc Explore query or temporary diagnostic view should become permanent server-side monitoring merely because a user opened it once.

Required distinctions:

- `Widget visible != monitoring obligation exists`.
- `Widget closed != monitoring obligation cancelled`.
- `No Desktop open != no observation`.
- `Persistent monitoring != persistent UI rendering`.
- `Acquisition running != alert evaluation running`.
- `Alert evaluation running != notification delivery healthy`.
- `Collector healthy != monitored service healthy`.
- `Monitoring service healthy != evidence current for every target`.
- `Desired monitoring policy != observed evaluator state != effective coverage`.
- `Running != Healthy != Ready != Effective` remains mandatory.

## Evidence and benchmark grammar

OpenTelemetry Collector is explicitly deployable independently of an interactive UI and models telemetry as receiver -> processor -> exporter pipelines. The same receiver can feed multiple pipelines. This is useful evidence that acquisition/fan-out can be service-owned rather than browser-owned, but it does not make OpenTelemetry the selected SB implementation.

Prometheus Agent mode demonstrates the opposite decomposition: an acquisition/forwarding agent can intentionally omit local querying, recording rules and alerting, requiring those responsibilities elsewhere. Therefore `telemetry acquisition` and `alert evaluation` are separate ownership capabilities.

Grafana Alerting evaluates rules on the backend without dashboard context. This is direct interaction-architecture evidence that operational evaluation can and often must survive absence of the dashboard that visualizes it.

Kubernetes controllers provide a useful desired/observed reconciliation analogy: a persistent controller watches current state and attempts to reconcile toward desired state. SB should borrow the control-loop grammar, not Kubernetes branding or implementation.

Sources:
- https://opentelemetry.io/docs/collector/
- https://opentelemetry.io/docs/collector/architecture/
- https://prometheus.io/docs/prometheus/latest/prometheus_agent/
- https://grafana.com/docs/grafana/latest/datasources/prometheus/alerting/
- https://kubernetes.io/docs/concepts/architecture/controller/

## Candidate ownership model

Research a provider-neutral `MonitoringObligation` distinct from widgets and subscriptions.

Candidate conceptual record:

`MonitoringObligation { obligationRef, semanticTargetRef, client/workspace/environment scope, observationIntent, evidenceRequirements, expectedCadence, currentnessHorizon, evaluationIntent?, notificationIntent?, retentionIntent?, authority/disclosure policy refs, lifecycle, provenance, ownerClass, qualificationRef }`.

Candidate owner classes:

- `INTERACTIVE_EPHEMERAL`: diagnostic query exists only while an explicitly ephemeral consumer exists.
- `WORKSPACE_PERSISTENT`: obligation survives Desktop closure for a Workspace.
- `CLIENT_PERSISTENT`: obligation survives all Workspace sessions for the Client.
- `SYSTEM_POLICY`: centrally declared operational obligation independent of user sessions.
- `EXTERNAL_PROVIDER_OWNED`: provider evaluates/retains the obligation; SB observes/project its state.
- `UNKNOWN`: ownership cannot yet be proven.

`OwnerClass` does not imply effect authority. A server-side evaluator may observe and evaluate without being allowed to mutate the monitored system.

## Obligation lifecycle

Candidate lifecycle:

`DECLARED -> QUALIFYING -> ACTIVE -> DEGRADED | SUSPENDED_BY_POLICY | REQUALIFICATION_REQUIRED -> RETIRING -> RETIRED`

Exceptional dispositions: `FAILED`, `ORPHANED`, `UNKNOWN`.

`ORPHANED` means the obligation remains declared but no qualified executor currently owns it. This must be visible as a coverage failure, not as healthy silence.

Cancellation is explicit. Last-consumer disconnect is not cancellation for persistent obligations.

## Execution lease versus semantic ownership

To avoid duplicate evaluators while preserving failover, distinguish semantic ownership from an execution lease.

`MonitoringObligationRef` is durable semantic identity. A concrete evaluator may hold an `ExecutionLease` with generation/epoch. Lease loss permits another qualified executor to take over, but does not retire the obligation.

Candidate execution states:

`UNASSIGNED | LEASED | LEASE_RENEWING | TAKEOVER_PENDING | ACTIVE_EXECUTOR | EXECUTOR_SUSPECT | EXECUTOR_LOST | RECOVERING | UNKNOWN`.

Late results from an old executor epoch cannot silently overwrite newer evidence/currentness. Duplicate acquisition may be tolerable during bounded handover where provider semantics permit; duplicate effects/notifications require stronger idempotency/deduplication.

This mirrors the Extended Desktop finding `presentation identity != browser surface`: here, `monitoring obligation != evaluator process`.

## Acquisition, evaluation, incident and notification separation

A persistent operational path should be modeled as separable stages:

`Acquisition -> Evidence qualification/currentness -> Condition evaluation -> Alert state -> Correlation/incident projection -> Notification routing -> Desktop projection`.

Each stage has independent health/currentness. Example: acquisition may be current while notification delivery is broken; alert evaluation may be healthy while the Desktop is closed; the Desktop may reconnect successfully while evidence remains stale.

No stage may infer another stage healthy solely from its own health.

## Desktop Observatory behavior

When a Desktop opens, it attaches to durable operational state rather than starting history at page load. Candidate hydration order:

1. qualify Client/Workspace/Environment and disclosure;
2. load declared monitoring obligations and their ownership/executor disposition;
3. load evidence/currentness envelope and evaluation state;
4. load active incidents/jobs/maintenance/suppression state;
5. attach to admissible live fan-out;
6. only then mark a widget `LIVE/CURRENT`.

A newly opened green widget is not current merely because its first cached snapshot is green.

When the last Desktop closes, only interactive-ephemeral obligations are eligible to stop automatically. Persistent obligations continue according to policy.

## Server-side versus browser-side subscription economics

Browser-local BroadcastChannel/SharedWorker may deduplicate presentation subscriptions across local surfaces, but they cannot own persistent monitoring because browser processes can freeze, discard or disappear.

Server-side/shared acquisition is a candidate when an obligation must survive zero interactive consumers. It must still obey the existing disclosure-safe subscription research: shared acquisition is permitted only inside proven authority-equivalence boundaries; result fan-out remains disclosure-qualified.

A persistent acquisition must not be created from a privileged superset query merely to improve deduplication.

## Cost and fairness boundary

Persistent monitoring introduces a cost owner even with zero viewers. Therefore the system needs explicit attribution rather than charging work to whichever widget happens to be open.

Candidate attribution dimensions: `Client`, `Workspace`, `MonitoringObligationRef`, provider/source, acquisition identity, evaluator cost class, retention volume and fan-out consumers.

`No viewers != zero cost`; `many viewers != proportionally many upstream queries`.

Shared work may be amortized, but accounting/fairness is separate from authorization. A high-cost Client must not starve another Client merely because their acquisitions share infrastructure.

Research later: quotas/admission/fair scheduling. Do not invent numeric budgets in documentary research.

## External provider ownership

External systems may already own alert evaluation or collection. SB should record this rather than duplicate it by default.

Candidate dispositions:

- `SB_ACQUISITION_SB_EVALUATION`
- `EXTERNAL_ACQUISITION_SB_EVALUATION`
- `EXTERNAL_ACQUISITION_EXTERNAL_EVALUATION`
- `SB_PROJECTION_ONLY`
- `HYBRID_WITH_DECLARED_BOUNDARY`
- `UNKNOWN`

Provider-owned evaluation still requires currentness/provenance qualification. `Provider says Normal != SB has current evidence` when connectivity or authorization is stale.

External auth expiry may break SB projection while provider-side monitoring continues. The UI must distinguish `provider monitoring may still be active` from `SB can currently verify it`.

## Recovery and continuity

Adversarial recovery sequence when the Desktop was absent:

`DESKTOP_ABSENT -> obligation continues -> evaluator/source gap occurs -> evidence becomes stale/unknown -> evaluator recovers -> fresh evidence requalifies -> Desktop later opens`.

The Desktop must display the gap in evidence history rather than reconstructing an uninterrupted green timeline.

After evaluator failover, evidence should carry executor generation/provenance sufficient to identify overlap/gaps. A takeover must not silently reset alert duration, maintenance expiry, acknowledgement or incident ownership when those semantics are externally/durably owned.

## Local client health

Local client health remains a projection concern. A browser disconnect does not make the remote monitoring executor unhealthy. Conversely, a healthy browser does not prove persistent monitoring is running.

Candidate independent badges/statuses:

- local Desktop connectivity;
- monitoring-obligation ownership/executor health;
- provider/source reachability;
- evidence currentness/coverage;
- alert evaluator health;
- notification path health where observable.

## Accessibility

Persistent operational state must be understandable without a live animated dashboard. On reconnect, textual summaries expose evidence gaps, stale intervals, active incidents, executor/coverage degradation and recovery timestamps. Screen-reader/live-region behavior should announce material current transitions, not replay the entire history accumulated while the Desktop was closed.

`Monitoring not currently verifiable` and `Monitoring stopped by policy` require different textual semantics. Status never relies on color.

## Componentes impact

Candidate catalogue additions/refinements:

- `MonitoringObligationBadge`
- `MonitoringOwnershipInspector`
- `MonitoringExecutorHealth`
- `EvidenceCoverageTimeline`
- `ObservationGapMarker`
- `PersistentMonitoringDisposition`
- `HeadlessMonitoringStatus`
- `ExecutorFailoverBoundary`
- `DesktopHydrationCurrentnessBoundary`
- `ExternalMonitoringOwnershipBadge`

Each requires normal/loading/partial/stale/error/degraded/offline/recovering/unknown scenarios plus keyboard, screen-reader, reduced-motion and non-color semantics.

## Proof obligations / adversarials

1. Close the last Desktop while a persistent obligation is active -> acquisition/evaluation continues or coverage becomes explicitly degraded; never silently stops.
2. Close the last Desktop with an ephemeral Explore query -> prove it can terminate without retiring persistent monitoring.
3. Browser process is discarded -> persistent monitoring survives independently.
4. SharedWorker dies -> only local fan-out is affected; persistent obligation ownership remains elsewhere or explicitly degrades.
5. Active executor dies -> bounded takeover without retiring obligation.
6. Old executor resumes after takeover -> stale epoch results cannot overwrite newer evidence.
7. Duplicate evaluators overlap -> no duplicate incident/notification side effects beyond declared idempotency semantics.
8. Source is healthy but evaluator is dead -> wall shows coverage/evaluation failure, not healthy.
9. Evaluator healthy but source stale -> evidence remains stale/unknown.
10. Notification route fails while alert remains firing -> alert state and notification health remain separate.
11. Desktop opens after a two-hour observation gap -> gap remains visible; no reconstructed green continuity.
12. External auth expires while provider-side alerting continues -> SB shows unverifiable projection, not provider monitoring stopped.
13. Provider-side evaluator is upgraded/config changed -> qualification invalidation applies before trusting normalized semantics.
14. Persistent monitoring has zero viewers for days -> cost remains attributable and bounded.
15. Fifty viewers open same qualified obligation -> upstream work remains shared where authority permits.
16. Two tenants request textually identical monitoring -> no unsafe cross-tenant result sharing.
17. Maintenance expires while no Desktop is open -> durable evaluator/incident semantics continue; opening later shows actual history.
18. Incident acknowledged externally while no Desktop is open -> reconnect hydrates current ownership/ack state with provenance.
19. Local browser is healthy while server-side monitoring executor is orphaned -> Observatory exposes orphaned coverage.
20. Optional 3D System Map closed -> no operational monitoring obligation depends on 3D/render lifecycle.

## Maturity and next gaps

`HEADLESS_MONITORING_OWNERSHIP = PARTIALLY_MATURE / MATERIAL_DELTA`.

This closes the conceptual question of who owns operational monitoring when there are no interactive consumers: durable monitoring obligations belong to a qualified service/provider ownership plane, while Desktop surfaces are projections and interactive consumers. Exact executor technology, persistence store, lease mechanism and numeric failover/currentness budgets remain implementation/fixture questions.

Remaining narrow research gaps for this :40 program:

1. cost/fairness/admission semantics for shared acquisitions across Clients/Workspaces without coupling authorization to billing;
2. concrete external-provider qualification examples for persistent monitoring ownership and notification continuity;
3. executable NORMAL/STRESS/leakage/revocation/failover fixtures, which are beyond documentary-only research;
4. empirical accessibility/performance validation under long offline/reconnect histories.

If future documentary rounds cannot materially refine these without implementation evidence, record `NO_MATERIAL_DELTA` rather than creating parallel taxonomies.
