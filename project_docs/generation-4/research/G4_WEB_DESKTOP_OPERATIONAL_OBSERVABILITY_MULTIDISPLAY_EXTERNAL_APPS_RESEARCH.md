# G4 — Web Desktop Operational UX, Observatory, Multi-Display, External Apps & Resource Lifecycle

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment

## Purpose

Refines operational UX for `Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`. Covers Desktop Observatory, pinned monitoring/monitor-wall surfaces, multi-display browser surfaces, mature external applications and client resource lifecycle. It does not authorize implementation, select providers or make 3D a navigation foundation. A future 3D System Map remains optional with equivalent 2D/list/table/graph access.

## Evidence reviewed

Primary evidence: MDN BroadcastChannel, SharedWorker, Window Management API and Page Visibility API; Grafana dashboard/share/embedding documentation; n8n API authentication and Embed documentation; Portainer API access documentation. These establish browser coordination/visibility constraints and distinguish API integration from embedding/licensing. They are pattern evidence, not adoption decisions.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
- https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
- https://developer.mozilla.org/en-US/docs/Web/API/Window_Management_API
- https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- https://grafana.com/docs/grafana/latest/dashboards/
- https://grafana.com/docs/grafana/latest/dashboards/share-dashboards-panels/
- https://docs.n8n.io/api/authentication/
- https://docs.n8n.io/embed/
- https://docs.portainer.io/api/access

## Desktop Observatory and monitor wall

Candidate distinctions: `DesktopObservatory` = compact contextual cross-application summary; `PinnedMonitoringSurface` = persistent qualified monitoring composition; `MonitorWall` = large-display/read-mostly glanceable composition; `MonitoringMosaicEditor` = authoring surface; `OperationsApplication` = deeper diagnosis/management with explicit effect authority.

Invariants: `Monitor Wall != Operations Application`; `Visible widget != current evidence`; `No alert != healthy`; `Running != Healthy != Ready != Effective`.

Every operational widget needs an inspectable `MonitoringEvidenceEnvelope`: semantic target, Client/Workspace/Environment scope, source/provider, query/measurement identity, observedAt, receivedAt, evidence window, expected cadence, currentness, completeness/coverage, desired/observed/effective refs, incident/job correlation and degraded/error reason. Candidate currentness: `UNINITIALIZED | CURRENT | REFRESHING | LAGGING | STALE | PARTIAL | SOURCE_UNAVAILABLE | OFFLINE_CACHED | UNKNOWN | CONFLICTED`.

A stale panel becomes visibly stale even when its last sample was green. Absence of alerts cannot infer health when source coverage/currentness is unknown. Monitoring must keep desired, observed, readiness/health, effective, drift/conformance and currentness separate.

## Monitoring mosaic and subscription economics

A mosaic composes shared evidence/subscriptions; widgets should not independently poll equivalent sources. Research a provider-neutral subscription broker: normalize semantic query identity -> deduplicate/share upstream subscription where legal -> bounded aggregate/cache -> fan out disclosure-qualified snapshots/streams -> render at per-surface cadence.

`upstream sampling cadence != UI render cadence`; `window hidden != subscription cancelled`; `subscription alive != evidence current`; `shared subscription != shared disclosure`.

High-volume logs/tables/graphs require bounded windows, virtualization/downsampling/aggregation and explicit truncation/partial indicators. Background surfaces should normally reduce rendering before changing semantic sampling obligations.

## Extended Desktop

Extended Desktop is one logical Workspace/Desktop session distributed across browser top-level surfaces/displays. `BrowserSurface != SB Window`; `Display placement != semantic context`; `Move to display != re-identify Window`.

Candidate identities: `WorkspaceSessionRef`, `DesktopSessionRef`, `BrowserSurfaceRef`, `DisplayPlacementHint`, `WindowRef`, `WindowPlacementRef`, local view state and optional explicit shared selection context.

All qualified surfaces project one logical WindowRegistry/taskbar. Detach/reattach/move-to-display is a protocol, not assumed native cross-window drag:

`REQUEST_MOVE -> TARGET_SURFACE_QUALIFIED -> CHECKPOINT_CONTEXT -> TARGET_MATERIALIZING -> TARGET_ACK -> SOURCE_RELEASE -> SETTLED`.

Failure before target ACK leaves source presentation intact. Failure after ACK before release requires idempotent reconciliation using WindowRef/transfer epoch. Dirty state and unknown effects must survive or block transfer.

Coordination candidates only: BroadcastChannel for same-origin event fan-out; SharedWorker for browser-local coordination/subscription sharing where supported; server-backed WorkspaceSession for durable registry/recovery; opener/postMessage for narrow parent/child cases; Window Management API as optional permission-gated placement enhancement. None becomes semantic authority merely by coordinating surfaces.

Shared/local default: semantic identity and explicit collaborative selection may be shared; keyboard focus is local; zoom/scroll/panel layout local by default; dual-monitor preset is preference, never permission; moving a Window preserves Client/Workspace/Environment/revision context. Secondary display loss yields `SURFACE_LOST -> RECOVERY_PENDING -> REATTACHABLE/RESTORED/BLOCKED`, not inferred `CLOSED`.

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

## Local client health

Desktop-specific observability must distinguish local degradation from remote-system degradation. Candidate local evidence: connectivity quality, document visibility/throttling, subscription broker reconnect/backpressure, render/long-task pressure, eviction activity, external auth/session disposition, secondary-surface heartbeat/recovery and cached evidence age. `Local client degraded != remote service degraded`.

## Accessibility

Every monitoring widget exposes text semantics, source/currentness and keyboard reachability. Status never relies on color/motion/spatial position alone. Mosaic rearrange/resize has non-drag commands. Window registry can locate another-display windows and offer keyboard `Bring here`/`Move to display`. Display loss announces recovery and deterministic focus destination. Per-display zoom/layout cannot change semantic identity. Embedded external UI cannot be the sole path for an essential SB task unless its keyboard/screen-reader contract is qualified; otherwise native/API/deep-link equivalent is required. High-volume data announces truncation/partial/stale state. Optional 3D preserves equivalent non-3D access.

## Componentes impact

Candidate records: `DesktopObservatory`, `MonitoringWidget`, `MonitoringEvidenceBadge`, `CurrentnessEnvelopeInspector`, `PinnedMonitoringSurface`, `MonitorWall`, `MonitoringMosaicEditor`, `TelemetrySubscriptionBrokerStatus`, `ExtendedDesktopRegistry`, `DisplaySurfaceIndicator`, `MoveToDisplayAction`, `BringWindowHereAction`, `SurfaceLostRecoveryBanner`, `ExternalApplicationFrame`, `ExternalAuthStateIndicator`, `ExternalIntegrationBoundary`, `OpenAdvancedExternalUIAction`, `ResourceResidencyIndicator`, `HibernationRecoveryBoundary`, `LocalClientHealthPanel`.

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

## Maturity and gaps

Disposition: `MATERIAL_DELTA / EMERGING_TO_PARTIALLY_MATURE`.

Material delta: explicit widget evidence/currentness envelope; shared subscription economics; Extended Desktop transfer/recovery protocol and local-vs-shared context split; browser coordination classified as transport/coordinator rather than authority; qualified external-app integration matrix; lifecycle split across installation/code/render/activity/resource/data-update axes; local-client health separated from remote-system health.

Highest-value gaps: formal WorkspaceSession/WindowRegistry persistence and transfer epochs; empirical NORMAL/STRESS resource budgets; semantic query deduplication under per-user disclosure; provider-neutral external-integration qualification/fallback record; accessibility qualification for third-party embeds/focus handoff; monitor-wall information hierarchy/alarm-fatigue/escalation and incident acknowledgement semantics.

Do not advance this slice to implementation planning until reconciled with the broader G4 frontend corpus.