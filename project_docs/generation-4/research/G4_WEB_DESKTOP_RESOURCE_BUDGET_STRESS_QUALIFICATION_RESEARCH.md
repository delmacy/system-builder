# G4 — Web Desktop Resource Budget & Stress Qualification Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment
Parent research: `G4_WEB_DESKTOP_OPERATIONAL_OBSERVABILITY_MULTIDISPLAY_EXTERNAL_APPS_RESEARCH.md`

## Purpose

Close the empirical-method gap for Web Desktop resource qualification without selecting libraries, providers or implementation thresholds prematurely. This artifact defines provider-neutral NORMAL/STRESS fixtures, measurement dimensions, degradation order and semantic hard gates for multi-window desktops, monitor walls, high-volume operational views and multiple browser surfaces.

Constitutional boundaries remain: `Builder != Runtime`; `Installed != loaded != rendered != actively updating`; `Running != Healthy != Ready != Effective`; `No alert != healthy`; `Visible widget != current evidence`; browser lifecycle state is not remote runtime state.

## Evidence reviewed

Pattern evidence, not adoption decisions:

- MDN Page Visibility documents that hidden pages can reduce unnecessary work and that browsers commonly pause `requestAnimationFrame` and throttle timers in background tabs.
- Chrome Page Lifecycle documents browser-initiated `hidden`, `frozen` and `discarded` states. Frozen pages cannot reliably run timers/fetch callbacks; discarded pages cannot run code at all. It recommends persisting recoverable view state before loss and re-establishing connections after resume.
- Chrome 133+ Energy Saver can freeze eligible CPU-intensive background browsing-context groups, reinforcing that an Extended Desktop cannot assume every top-level surface remains continuously executing.
- Grafana guidance recommends the slowest refresh interval that satisfies operational need and, in recent performance guidance, recommends sharing query results across panels rather than rerunning equivalent queries.
- Web.dev virtualization guidance shows why rendering only a bounded visible window is preferable to accumulating thousands of DOM rows; `content-visibility` provides another browser-native candidate for deferring offscreen rendering.
- PerformanceObserver is broadly available, while Long Tasks and `measureUserAgentSpecificMemory()` have more limited support. The memory API is implementation-dependent and unsuitable for cross-browser absolute gates.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
- https://developer.chrome.com/docs/web-platform/page-lifecycle-api
- https://developer.chrome.com/blog/freezing-on-energy-saver
- https://grafana.com/docs/learning-paths/visualization-metrics/time-range-refresh/
- https://grafana.com/blog/grafana-dashboards-tips-for-optimizing-query-performance/
- https://web.dev/articles/virtualize-long-lists-react-window
- https://web.dev/blog/css-content-visibility-baseline
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver
- https://developer.mozilla.org/en-US/docs/Web/API/PerformanceLongTaskTiming
- https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory

## Core qualification model

Resource qualification is a vector, not one FPS/memory score:

`ResourceQualification = interactionLatency + frame/render pressure + mainThreadPressure + memoryTrend + network/subscriptionEconomics + evidenceCurrentness + restoreLatency + backgroundCost + accessibilityContinuity + semanticContinuity`.

Hard rule: a strategy cannot pass by being fast while losing dirty state, currentness, incident transitions, disclosure boundaries or recovery semantics.

Required distinctions:

- `Browser surface visible != SB Window visible`.
- `Browser surface hidden != Workspace inactive`.
- `Browser frozen/discarded != SB Window closed`.
- `Render throttled != evidence sampling throttled`.
- `Sampling throttled != evidence current`.
- `Memory pressure != permission to evict dirty/unknown-effect context`.
- `High event rate != permission to drop material semantic transitions`.
- `Provider refresh interval != UI render cadence`.
- `Shared query/subscription != shared disclosure`.
- `Recovered pixels != recovered qualified context`.

## Deterministic fixture families

Exact thresholds are intentionally not frozen before measurement on a declared hardware/browser matrix. Counts below define reproducible load classes.

### NORMAL-A — knowledge-work desktop

- 1 Workspace / 1 BrowserSurface;
- 8 installed applications, 4 code-resident, 3 rendered windows;
- 1 active foreground window, 2 visible-background/docked windows;
- 6 monitoring widgets, at most 3 distinct upstream semantic queries after legal deduplication;
- one virtualized table around 5k logical rows with a bounded rendered window;
- one moderate graph/timeline;
- one draft-bearing window;
- one external API-backed/deep-link integration context.

### NORMAL-B — operational dual-surface desktop

- 1 Workspace / 2 BrowserSurfaces;
- 12–20 registered windows, 6–8 rendered, 2–4 concurrently visible;
- Monitor Wall with 20–30 widgets and repeated query families that should demonstrate subscription/query sharing;
- 5–15 incident/attention items, one active maintenance context and at least one stale/partial evidence source;
- one high-volume log view with 50k+ logical records but bounded materialization;
- one external advanced UI context with auth-expiry/recovery fixture;
- detach/move-to-display plus surface-loss recovery during active monitoring.

### STRESS-A — window/resource pressure

- 40–60 WindowRefs, 15–25 code-resident applications/windows, 8–12 rendered surfaces/views before pressure policy acts;
- 2–3 BrowserSurfaces where supported/manual top-level windows otherwise;
- 50–80 monitoring widgets representing no more than a bounded number of unique semantic subscriptions after qualification;
- multiple virtualized logs/tables totaling hundreds of thousands of logical rows without render-all;
- repeated open/minimize/restore/hibernate cycles;
- one dirty draft, one pending/UNKNOWN effect and one stale external-auth context that must be protected from unsafe eviction.

### STRESS-B — operational storm

- thousands of incoming raw telemetry/event updates over the fixture interval;
- hundreds of alert instances, tens of qualified groups, one correlation split/merge candidate;
- concurrent maintenance/suppression expiry and evidence-source interruption;
- Monitor Wall plus Operations window plus background desktop windows;
- at least one secondary surface hidden/frozen/discard-recovery simulation;
- material scope/severity/currentness changes interleaved with high-rate non-material updates.

The target is `bounded operability`, not render-all and not zero degradation.

## Measurement protocol

Every run records fixture revision, browser/version, OS, logical CPU class, memory class, display count/resolution/refresh rate, power/energy-saver disposition, viewport, network profile, warm/cold state and enabled external integrations. Results across materially different environments are not silently pooled.

Candidate measurements:

1. interaction: command/input -> visible acknowledgement -> semantic state -> settled representation;
2. render: frame/render cadence only for surfaces expected to animate/update;
3. main thread: long-task/long-frame pressure where supported plus custom User Timing spans;
4. memory: trend/growth and recovery after close/hibernate cycles; implementation-specific byte metrics are diagnostic, not universal pass thresholds;
5. subscriptions: unique semantic query count, upstream request/stream count, fan-out count, dedup ratio and per-surface render cadence;
6. currentness: source-observed -> broker-qualified -> widget-visible transition latency, including stale/UNKNOWN propagation;
7. background cost: CPU/network/render activity after surface/window becomes hidden/suspended;
8. recovery: hidden/frozen/discard/surface-loss -> semantic acknowledgement -> requalification -> usable state;
9. high-volume views: logical count versus rendered/materialized count, scroll/search readiness and truncation/partial evidence;
10. accessibility: keyboard command latency, focus continuity and announcement rate under storms.

`PerformanceObserver`/User Timing are candidates for instrumentation. Long Tasks can supplement where available but cannot be the sole cross-browser gate. `measureUserAgentSpecificMemory()` may support Chromium-class regression experiments only when its security/support constraints are met; its absolute byte values must not be compared across browsers/versions.

## Resource budget policy before numeric thresholds

Budgets should be hierarchical and adaptive rather than one global number:

`Device/Browser Envelope -> Workspace Budget -> BrowserSurface Budget -> Window/Application Budget -> expensive-view Budget`.

Candidate pressure order:

1. stop decorative/redundant animation;
2. lower render cadence for non-focused visible surfaces;
3. stop offscreen rendering and use bounded virtualization/materialization;
4. coalesce superseded low-priority telemetry presentation;
5. share/deduplicate equivalent qualified subscriptions/queries;
6. reduce presentation refresh where evidence contract allows it, while marking cadence/currentness honestly;
7. suspend reconstructable background trees;
8. hibernate checkpointable windows;
9. evict only contexts with no dirty/pending/UNKNOWN-effect/recovery obligation;
10. offer explicit operator recovery/reopen path rather than silently losing context.

Pressure policy never converts stale evidence to healthy, drops critical incident/currentness transitions, weakens disclosure or cancels remote runtime obligations merely because UI is cold.

## Background/freeze/discard semantics

Extended Desktop must assume browser intervention. Page Visibility is an optimization signal, not durable lifecycle authority. Browser freezing/discard may occur independently of SB intent.

Candidate local lifecycle evidence:

`VISIBLE_ACTIVE | VISIBLE_PASSIVE | HIDDEN | FREEZE_OBSERVED | RESUMING | DISCARD_RECOVERED | LIFECYCLE_UNKNOWN`.

On hidden/freeze preparation, persist reconstructable view/session checkpoint and release browser-local resources that can be safely recreated. Durable WorkspaceSession/WindowRegistry and dirty/pending-effect obligations must not rely on one surface remaining alive.

On resume/discard recovery:

`LOCAL_SURFACE_RECOVERING -> WORKSPACE_SESSION_RESOLVED -> WINDOW_CONTEXT_RESOLVED -> AUTH/DISCLOSURE/REVISION REQUALIFIED -> SUBSCRIPTIONS_REESTABLISHED -> EVIDENCE CURRENTNESS REQUALIFIED -> USABLE`.

Cached green cards remain stale/unknown until new evidence satisfies their currentness envelope.

## Subscription/query economics

A `TelemetrySubscriptionBroker` candidate should deduplicate only when semantic query identity and disclosure/tenant constraints permit. Candidate key dimensions include target, environment, measurement/query definition, time/window semantics, aggregation, provider/version contract and security/disclosure scope.

Two visually identical widgets are not automatically shareable; two differently rendered widgets may be able to share one upstream result.

Required measurements: `widgets : semanticQueries : upstreamSubscriptions : renderedConsumers`. A stress result with 80 widgets and 80 equivalent pollers is a failure of resource architecture even if the browser remains responsive.

Grafana's guidance to reuse query results and choose the slowest acceptable refresh interval is useful benchmark evidence for this principle, not a provider binding.

## High-volume logs/tables/graphs

Virtualization/materialization must preserve semantic evidence:

- total/logical count is distinct from rendered count;
- truncation/downsampling/aggregation is explicit;
- current selection remains addressable even if outside the rendered window;
- search/filter result completeness is qualified;
- keyboard navigation does not require materializing all rows;
- assistive-technology equivalents expose bounded, navigable chunks and summary semantics rather than an inaccessible canvas-only view.

`Not rendered != absent`; `Aggregated != complete raw evidence`; `Downsampled != exact`.

## External application resource boundary

Embedded/proxied third-party UIs may consume resources outside SB's direct component lifecycle. Qualification therefore records whether the integration can be suspended/recreated, whether hidden iframe/network activity continues, auth/session restoration behavior, WebSocket/SSE reconnection behavior and whether dirty state is externally owned.

If SB cannot safely checkpoint or observe an external UI's dirty state, automatic hibernation/eviction of that integration is not assumed safe. Deep-link/API-backed/native surfaces remain useful lower-coupling fallbacks.

## Accessibility under pressure

Resource degradation cannot remove the only accessible interaction path. Keyboard/focus state is checkpointed semantically, not by fragile DOM coordinates. Storm coalescing applies to live-region announcements. Reduced-motion remains independent from resource pressure. A virtualized table/list exposes item position/count semantics where feasible and deterministic navigation/recovery.

A secondary surface being frozen/discarded must not strand keyboard focus conceptually; on recovery or `Bring here`, focus resolves to a qualified surviving semantic target.

## Componentes impact

Add/refine research records:

`ResourceBudgetInspector`, `WorkspacePressureIndicator`, `WindowResidencyBadge`, `BackgroundActivityIndicator`, `SubscriptionEconomicsPanel`, `VirtualizedEvidenceView`, `HighVolumeDataBoundary`, `SurfaceLifecycleBadge`, `DiscardRecoveryBoundary`, `StaleAfterResumeNotice`, `ResourcePressureRecoveryAction`, `ExternalAppResidencyQualification`.

State matrices cover normal/pressure/suspended/hibernated/evicted, hidden/frozen/discard recovery, stale/current requalification, dirty/pending-effect protection, keyboard/focus recovery and partial/aggregated evidence.

## Proof obligations / adversarials

1. 30 visually repeated widgets -> demonstrate bounded upstream queries/subscriptions when semantics/disclosure permit.
2. Same query across different tenant/disclosure contexts -> do not deduplicate across forbidden boundary.
3. Hidden monitor wall -> rendering drops; evidence cadence changes only by declared policy and remains honestly current/stale.
4. Browser freezes a secondary surface -> Workspace/incident truth does not depend on its timers continuing.
5. Browser discards a surface -> reload restores WindowRef/context or explicit recovery without cached-green health claims.
6. Dirty window is candidate for eviction -> eviction blocked or durable checkpoint proven.
7. Pending/UNKNOWN external effect -> hibernation/restore preserves uncertainty and verification obligation.
8. 50k logical log rows -> rendered DOM remains bounded and keyboard/search semantics remain usable.
9. Hundreds of alerts arrive during memory pressure -> material scope/severity/currentness transitions survive coalescing.
10. Monitoring source disconnects while UI render is throttled -> stale/source-unavailable reaches operator within qualified evidence horizon.
11. External iframe continues network activity while hidden -> resource qualification detects/records inability to fully suspend; no false `HIBERNATED` label.
12. External auth expires during suspension -> restore reauthenticates/requalifies before effects.
13. Dual display B closes during high load -> dirty/pending context remains recoverable on A.
14. Device enters Energy Saver/background freeze -> local client health explains observation gap without labeling remote service degraded.
15. Memory diagnostic API unavailable -> qualification continues with portable metrics; no unsupported API becomes a hard dependency.
16. Browser/version changes memory accounting -> historical regression data remains environment-qualified, not directly compared as absolute truth.
17. Resource pressure removes a visual graph -> equivalent table/list/summary path remains available.
18. 3D System Map is open during pressure -> it may reduce LOD/suspend/fallback to 2D/list/table/graph without changing semantic identity.

## Maturity and next gaps

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE`.

This closes the methodological gap around what NORMAL/STRESS means and how Web Desktop resource behavior should be qualified without inventing premature universal numeric thresholds. It does not supply empirical numbers; those require later executable benchmark fixtures under implementation authority.

Highest-value remaining research gaps:

1. formal WorkspaceSession/WindowRegistry durability, ownership and transfer-epoch protocol;
2. disclosure-safe subscription/query identity and cache sharing across users/surfaces;
3. external application residency/dirty-state qualification fixtures;
4. hardware/browser matrix policy for later empirical calibration;
5. historical performance evidence schema and regression comparison without making browser-specific diagnostics normative.

Do not advance this slice to implementation planning until reconciled with the broader G4 frontend corpus.