# G4 — Web Desktop Operational UX, Observatory, Multi-Display, External Apps & Resource Lifecycle

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment

## Purpose

Refines operational UX for `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`. Covers Desktop Observatory, pinned monitoring/monitor-wall surfaces, multi-display browser surfaces, mature external applications, client resource lifecycle and incident/attention semantics. It does not authorize implementation, select providers or make 3D a navigation foundation. A future 3D System Map remains optional with equivalent 2D/list/table/graph access.

## Evidence reviewed

Primary evidence: MDN BroadcastChannel, SharedWorker, Window Management API and Page Visibility API; Grafana dashboard/share/embedding, alert-state history, notification policy and no-data/error documentation; n8n API authentication and Embed documentation; Portainer API access documentation; PagerDuty incident and escalation documentation. These establish browser coordination/visibility constraints, distinguish API integration from embedding/licensing, and separate alert evidence, notification routing, acknowledgement and incident resolution. They are pattern evidence, not adoption decisions.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
- https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
- https://developer.mozilla.org/en-US/docs/Web/API/Window_Management_API
- https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- https://grafana.com/docs/grafana/latest/dashboards/
- https://grafana.com/docs/grafana/latest/dashboards/share-dashboards-panels/
- https://grafana.com/docs/grafana/latest/alerting/monitor-status/view-alert-state-history/
- https://grafana.com/docs/grafana/latest/alerting/guides/connectivity-errors/
- https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/
- https://support.pagerduty.com/main/docs/incidents
- https://support.pagerduty.com/main/docs/escalation-policies
- https://docs.n8n.io/api/authentication/
- https://docs.n8n.io/embed/
- https://docs.portainer.io/api/access

## Desktop Observatory and monitor wall

Candidate distinctions: `DesktopObservatory` = compact contextual cross-application summary; `PinnedMonitoringSurface` = persistent qualified monitoring composition; `MonitorWall` = large-display/read-mostly glanceable composition; `MonitoringMosaicEditor` = authoring surface; `OperationsApplication` = deeper diagnosis/management with explicit effect authority.

Invariants: `Monitor Wall != Operations Application`; `Visible widget != current evidence`; `No alert != healthy`; `Running != Healthy != Ready != Effective`.

Every operational widget needs an inspectable `MonitoringEvidenceEnvelope`: semantic target, Client/Workspace/Environment scope, source/provider, query/measurement identity, observedAt, receivedAt, evidence window, expected cadence, currentness, completeness/coverage, desired/observed/effective refs, incident/job correlation and degraded/error reason. Candidate currentness: `UNINITIALIZED | CURRENT | REFRESHING | LAGGING | STALE | PARTIAL | SOURCE_UNAVAILABLE | OFFLINE_CACHED | UNKNOWN | CONFLICTED`.

A stale panel becomes visibly stale even when its last sample was green. Absence of alerts cannot infer health when source coverage/currentness is unknown. Monitoring must keep desired, observed, readiness/health, effective, drift/conformance and currentness separate.

### Attention, alert, incident and notification semantics

Operational UX must not collapse detection, attention routing and operational ownership into one red badge. Candidate semantic chain:

`Observation/Evidence -> Condition Evaluation -> Alert Instance -> Correlation/Grouping -> Incident Candidate/Incident -> Assignment/Escalation -> Acknowledgement -> Mitigation/Recovery -> Resolution -> Post-incident evidence`.

These are not guaranteed one-to-one. Multiple alerts may correlate to one incident; one alert may remain informational and never create an incident; an incident can remain open after its triggering alert clears when operational obligations remain. Provider terminology may differ, so SB should normalize only declared semantics.

Required distinctions:

- `Alert firing != notification delivered != responder aware`.
- `Acknowledged != resolved != healthy != effective`.
- `Silenced/muted != normal`; notification suppression must not rewrite alert/evidence history.
- `No notification != no incident`; routing/mute state and incident state are independent.
- `No alert != healthy`; missing/error/stale evaluation remains representable.
- `Resolved incident != root cause removed forever`; recurrence and conformance remain separate evidence.
- `Assigned != acknowledged`; ownership routing does not prove human attention.
- `Severity != urgency != priority`; impact classification, notification behavior and work ordering are separate axes.

Grafana alert-state history preserves alert events even when silences/mute timings suppress notifications, which is useful evidence for separating state from notification. Grafana also makes no-data/query-error behavior configurable; therefore SB must never infer `Normal` merely because a provider policy chooses to keep last state or suppress error-derived notifications. PagerDuty distinguishes Triggered, Acknowledged and Resolved incidents; acknowledgement stops/escalation-pauses notifications but does not resolve the incident. These are benchmark patterns, not provider adoption.

Candidate SB incident-attention envelope:

`OperationalAttentionEnvelope { targetRef, environmentRef, evidenceRefs[], alertRefs[], correlationRef?, incidentRef?, severity, urgency, priority, incidentState, assignment, acknowledgement, escalationDisposition, suppressionDisposition, observedAt, lastTransitionAt, currentness, effect/health/readinessRefs }`.

Candidate incident state is intentionally small: `CANDIDATE | TRIGGERED | ACKNOWLEDGED | MITIGATING | RECOVERING | RESOLVED | REOPENED | UNKNOWN`. Provider-specific states remain provenance rather than being silently flattened. `MITIGATING`/`RECOVERING` require actual evidence or explicit operator declaration; acknowledgement alone cannot imply them.

### Alarm-fatigue and monitor-wall information hierarchy

Monitor walls should optimize operator attention, not maximize visible metrics. Candidate hierarchy:

1. coverage/currentness failure and critical UNKNOWNs that invalidate confidence;
2. active unacknowledged incidents requiring ownership;
3. acknowledged incidents whose escalation/ack horizon is approaching;
4. materially worsening drift/readiness/effectiveness;
5. active jobs/recoveries with bounded progress/evidence;
6. stable context/trends;
7. historical/informational detail on demand.

A large count of repeated child alerts should aggregate under a qualified incident/correlation group when semantics permit, while preserving cardinality, affected scope and ability to inspect members. Aggregation cannot hide a newly affected environment/tenant, higher severity, lost evidence coverage or changed authority/currentness.

Candidate anti-fatigue controls: semantic grouping, deduplication, rate-bounded notification presentation, stable ordering, explicit `suppressed/muted/snoozed` badges, maintenance context, acknowledgement ownership, escalation horizon and progressive disclosure. Suppression always has scope, actor/policy provenance, reason and expiry/currentness. There is no generic `hide alert` operation that erases evidence.

Monitor-wall animation is attention-expensive: motion should be reserved for new/material state transitions, not perpetual healthy-state decoration; reduced-motion removes animation without removing transition semantics.

## Monitoring mosaic and subscription economics

A mosaic composes shared evidence/subscriptions; widgets should not independently poll equivalent sources. Research a provider-neutral subscription broker: normalize semantic query identity -> deduplicate/share upstream subscription where legal -> bounded aggregate/cache -> fan out disclosure-qualified snapshots/streams -> render at per-surface cadence.

`upstream sampling cadence != UI render cadence`; `window hidden != subscription cancelled`; `subscription alive != evidence current`; `shared subscription != shared disclosure`.

High-volume logs/tables/graphs require bounded windows, virtualization/downsampling/aggregation and explicit truncation/partial indicators. Background surfaces should normally reduce rendering before changing semantic sampling obligations.

Alert/incident views should also share evidence streams where admissible rather than creating a second poller per widget. Correlation/grouping is computed against qualified evidence; presentation aggregation cannot become the canonical incident owner by convenience.

## Extended Desktop

Extended Desktop is one logical Workspace/Desktop session distributed across browser top-level surfaces/displays. `BrowserSurface != SB Window`; `Display placement != semantic context`; `Move to display != re-identify Window`.

Candidate identities: `WorkspaceSessionRef`, `DesktopSessionRef`, `BrowserSurfaceRef`, `DisplayPlacementHint`, `WindowRef`, `WindowPlacementRef`, local view state and optional explicit shared selection context.

All qualified surfaces project one logical WindowRegistry/taskbar. Detach/reattach/move-to-display is a protocol, not assumed native cross-window drag:

`REQUEST_MOVE -> TARGET_SURFACE_QUALIFIED -> CHECKPOINT_CONTEXT -> TARGET_MATERIALIZING -> TARGET_ACK -> SOURCE_RELEASE -> SETTLED`.

Failure before target ACK leaves source presentation intact. Failure after ACK before release requires idempotent reconciliation using WindowRef/transfer epoch. Dirty state and unknown effects must survive or block transfer.

Coordination candidates only: BroadcastChannel for same-origin event fan-out; SharedWorker for browser-local coordination/subscription sharing where supported; server-backed WorkspaceSession for durable registry/recovery; opener/postMessage for narrow parent/child cases; Window Management API as optional permission-gated placement enhancement. None becomes semantic authority merely by coordinating surfaces.

Shared/local default: semantic identity and explicit collaborative selection may be shared; keyboard focus is local; zoom/scroll/panel layout local by default; dual-monitor preset is preference, never permission; moving a Window preserves Client/Workspace/Environment/revision context. Secondary display loss yields `SURFACE_LOST -> RECOVERY_PENDING -> REATTACHABLE/RESTORED/BLOCKED`, not inferred `CLOSED`.

Operational attention should be workspace-session aware without duplicating urgency across every display. One logical incident may project on taskbar, Observatory and Monitor Wall, but notification/acknowledgement state remains shared semantic state while visual emphasis/focus is local. Closing a secondary monitor must not acknowledge, resolve or silence an incident.

## External application integration matrix

Candidate modes:

| Mode | Strength | Main obligations/risks |
|---|---|---|
| Native SB surface | coherent semantics/a11y/currentness | API coverage and feature lag |
| API-backed native | strong default for common tasks | token scope, API/version drift, semantic mapping |
| Hybrid | progressive disclosure + advanced escape hatch | context handoff, duplicate authority/currentness cues |
| Embedded iframe | low navigation friction when supported | CSP/frame policy, cookies/SSO, focus/a11y, authority mismatch, licensing |
| Reverse-proxied UI | possible path/origin integration | WebSockets/SSE, URLs, cookies, CSRF/origin, CSP, upgrade drift; high maintenance |
| Deep link | robust separation and original UI | tenant/environment/revision continuity and return path |
| Native bridge/agent | local privileged capability | install/trust/update/OS scope and strongest security/lock-in burden |

Candidate preference where evidence supports it: `native common path + typed API provider + qualified original advanced UI`. Embedding/proxying is not automatically superior.

Grafana is a candidate for API-backed/deep-link/qualified embedding depending deployment policy; SB still owns its evidence/currentness qualification. n8n supports API-backed summaries/deep links, while Embed is separately productized/licensed and cannot be assumed. Portainer's documented API supports API-backed SB surfaces plus deep-link to advanced UI. Cockpit/NetworkManager-class and DB/storage/admin consoles should prefer typed API or deep link unless frame/origin support is explicitly qualified.

External integration needs independent axes: reachability; external auth `VALID/EXPIRING/EXPIRED/REAUTH_REQUIRED`; contract compatibility; external-UI currentness; SB-projection currentness; effect authority. `SSO success != authorization equivalence`; `Embedded UI visible != external auth valid`; `External UI says success != SB effect verified`.

CSP/frame restrictions are security contracts. If embedding is unsupported, use qualified API/deep-link/hybrid fallback rather than weaken CSP merely for iframe convenience. Reverse proxy remains high-cost because WebSockets/SSE, cookies, CSRF/origin assumptions, redirects, absolute URLs, CSP, service workers and version drift can break continuity.

External alert/incident integrations add another axis: `provider alert state != SB evidence state != notification state != incident ownership`. SB may surface/mediate provider incidents only with provenance and capability qualification; it must not acknowledge/resolve an external incident merely because a local SB card was dismissed. Provider acknowledgement/resolve actions require explicit effect authority and post-effect verification.

## Resource lifecycle

Separate axes:

`Installation = NOT_INSTALLED | INSTALLED | UPDATE_AVAILABLE | INCOMPATIBLE`

`CodeResidency = NOT_LOADED | LOADING | LOADED`

`WindowResidency = NOT_RENDERED | RENDERED`

`Activity = FOREGROUND | VISIBLE_BACKGROUND | HIDDEN_BACKGROUND`

`ResourceResidency = HOT | WARM | SUSPENDED | HIBERNATED | EVICTED`

`DataUpdate = UNSUBSCRIBED | SNAPSHOT | LIVE | THROTTLED | PAUSED | RECONNECTING`

`Content = UNINITIALIZED | LOADING | READY | PARTIAL | STALE | ERROR`

Invariant: `Installed != loaded != rendered != actively updating`.

Candidate pressure order: reduce animation/render cadence -> stop offscreen expensive rendering -> coalesce telemetry/lower presentation cadence -> virtualize/bound logs/tables/graphs -> suspend reconstructable inactive trees -> hibernate checkpointable windows -> evict only when draft/pending-effect/recovery obligations are satisfied. `Pinned != infinite resource entitlement`.

Restored hibernated contexts revalidate Client/Workspace/Environment, authority, revision, currentness, external auth and pending/unknown effects before showing editable/effective state.

Operational attention introduces resource priority without unlimited entitlement. A hidden window containing an active critical incident can retain a lightweight semantic subscription while its heavy graphs/render trees suspend. `Incident active != full UI must stay HOT`; `UI suspended != incident monitoring suspended`.

## Local client health

Desktop-specific observability must distinguish local degradation from remote-system degradation. Candidate local evidence: connectivity quality, document visibility/throttling, subscription broker reconnect/backpressure, render/long-task pressure, eviction activity, external auth/session disposition, secondary-surface heartbeat/recovery and cached evidence age. `Local client degraded != remote service degraded`.

The Observatory must expose when local degradation reduces confidence in alert/currentness coverage. If the browser slept or broker disconnected, restored green cards remain stale/unknown until evidence requalifies; incident notification history can be shown without pretending continuous local observation.

## Accessibility

Every monitoring widget exposes text semantics, source/currentness and keyboard reachability. Status never relies on color/motion/spatial position alone. Mosaic rearrange/resize has non-drag commands. Window registry can locate another-display windows and offer keyboard `Bring here`/`Move to display`. Display loss announces recovery and deterministic focus destination. Per-display zoom/layout cannot change semantic identity. Embedded external UI cannot be the sole path for an essential SB task unless its keyboard/screen-reader contract is qualified; otherwise native/API/deep-link equivalent is required. High-volume data announces truncation/partial/stale state. Optional 3D preserves equivalent non-3D access.

Incident UX adds explicit textual status and ownership: `Triggered`, `Acknowledged by …`, `Escalates in …`, `Suppressed until …`, `Evidence stale`, `Resolved`. New incident/ownership/currentness transitions use programmatic status messaging where appropriate, but live announcements must be rate-bounded/grouped to avoid turning alert storms into assistive-technology storms. Acknowledgement, snooze/suppress, reassign/escalate and resolve actions are keyboard reachable and never color-only. Focus is not forcibly moved to every incoming alert; critical interruption policy must be explicit and rare.

## Componentes impact

Candidate records: `DesktopObservatory`, `MonitoringWidget`, `MonitoringEvidenceBadge`, `CurrentnessEnvelopeInspector`, `PinnedMonitoringSurface`, `MonitorWall`, `MonitoringMosaicEditor`, `TelemetrySubscriptionBrokerStatus`, `OperationalAttentionBadge`, `IncidentCard`, `IncidentGroup`, `IncidentOwnershipIndicator`, `AcknowledgementAction`, `EscalationHorizonIndicator`, `SuppressionDispositionBadge`, `IncidentTimeline`, `ExtendedDesktopRegistry`, `DisplaySurfaceIndicator`, `MoveToDisplayAction`, `BringWindowHereAction`, `SurfaceLostRecoveryBanner`, `ExternalApplicationFrame`, `ExternalAuthStateIndicator`, `ExternalIntegrationBoundary`, `OpenAdvancedExternalUIAction`, `ResourceResidencyIndicator`, `HibernationRecoveryBoundary`, `LocalClientHealthPanel`.

Each requires state matrix, transitions, keyboard/touch, responsive/density, dark/light/reduced-motion, composition lineage, usedBy, failure/recovery and evidence scenarios.

## Proof obligations / adversarials

1. Last green sample exceeds evidence horizon -> `STALE/UNKNOWN`, never healthy-by-cache.
2. Alert source disconnects -> wall exposes source/currentness failure, not healthy.
3. Twenty equivalent widgets -> prove bounded/deduplicated upstream subscription where legal.
4. Background desktop -> render work falls while evidence semantics remain explicit.
5. Secondary display closes with dirty window -> draft/WindowRef survives or transition is blocked.
6. Move-to-display preserves Client/Workspace/Environment/revision/selection.
7. Coordinator peer disappears mid-transfer -> reconcile without duplicate presentation authority/lost dirty state.
8. Multi-screen permission denied/unavailable -> ordinary top-level windows/manual placement still work.
9. Embedded tool has broader rights -> block/read-only/mediate; visibility cannot expand authority.
10. CSP rejects embed -> qualified API/deep-link fallback, no policy weakening.
11. External auth expires while stale UI remains painted -> explicit stale/reauth state; effects blocked.
12. Deep link has wrong tenant/environment/revision -> requalify; no silent fallback.
13. Proxy upgrade breaks WebSocket/session -> degraded/incompatible with recovery/deep-link escape hatch.
14. Many windows cause memory pressure -> bounded suspension/hibernation protecting active/dirty/pending-effect contexts.
15. Log volume exceeds budget -> bounded/virtualized partial representation, not frozen UI.
16. Client loses telemetry while remote service is healthy -> distinguish client observability failure.
17. Resume from sleep with cached green wall -> requalify currentness before green returns.
18. 3D renderer unavailable -> equivalent 2D/list/table/graph access remains usable.
19. Alert is silenced/muted -> alert/evidence history remains visible and explicitly suppressed, never relabeled normal.
20. Incident acknowledged -> escalation/notification behavior changes as contracted, but incident does not become resolved/healthy/effective.
21. Alert query returns no data/error -> wall represents policy + evidence uncertainty; provider `Keep Last State` cannot masquerade as fresh health.
22. One root failure creates 500 child alerts -> qualified grouping reduces attention load while preserving affected scope/count/new severity/currentness changes.
23. Suppression expires while incident remains active -> notification eligibility resumes according to policy without fabricating a new incident identity.
24. External provider incident is visible in embedded/native SB surface -> dismissing local card does not acknowledge provider incident.
25. Provider ACK returns but refreshed provider state is UNKNOWN -> action remains submitted/unknown, not acknowledged-by-assumption.
26. Monitor wall is on a secondary display that closes -> incident/ack state survives in WorkspaceSession and becomes discoverable on surviving surface.
27. Screen reader receives an alert storm -> grouped/rate-bounded announcements preserve critical state without unbounded live-region spam.
28. Active critical incident window is backgrounded -> heavy rendering can suspend while lightweight qualified incident/evidence subscription remains active.

## Maturity and gaps

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE`.

Material delta this round: explicit separation of evidence/alert/notification/incident/acknowledgement/resolution; provider-neutral operational-attention envelope; alarm-fatigue hierarchy; suppression provenance and expiry; incident-aware resource prioritization; cross-display incident continuity; accessibility behavior for alert storms; external-provider incident authority boundary.

Saturation assessment: the broad operational shell, multi-display, external-app and lifecycle topology is now partially mature. Alert/incident attention semantics moved materially toward saturation at the UX/state level, but provider qualification and empirical budgets remain open.

Highest-value gaps: formal WorkspaceSession/WindowRegistry persistence and transfer epochs; empirical NORMAL/STRESS resource budgets including monitor wall + incident storm; semantic query deduplication under per-user disclosure; provider-neutral external-integration qualification/fallback record; accessibility qualification for third-party embeds/focus handoff; incident correlation/causality boundaries and maintenance/suppression policy governance without turning the desktop into a canonical incident-management owner.

Do not advance this slice to implementation planning until reconciled with the broader G4 frontend corpus.