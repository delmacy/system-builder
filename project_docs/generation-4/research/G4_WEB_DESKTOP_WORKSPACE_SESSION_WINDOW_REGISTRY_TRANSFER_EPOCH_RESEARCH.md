# G4 — Web Desktop WorkspaceSession, WindowRegistry & Transfer-Epoch Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment
Parent research: `G4_WEB_DESKTOP_OPERATIONAL_OBSERVABILITY_MULTIDISPLAY_EXTERNAL_APPS_RESEARCH.md`

## Purpose

Close the durability/ownership gap for Extended Desktop: one logical Workspace/Desktop projected through multiple browser top-level surfaces while preserving one semantic Window identity, dirty/unknown-effect obligations, context continuity and deterministic recovery across detach, reattach, move-to-display, browser freeze/discard, crash and reconnect.

This is provider-neutral research. It does not select BroadcastChannel, SharedWorker, server sessions, storage, Window Management API or any implementation stack as authority. It does not authorize product implementation.

Constitutional invariants remain: `BrowserSurface != SB Window`; `Display placement != semantic context`; `Move to display != re-identify Window`; `Browser frozen/discarded != SB Window closed`; `Installed != loaded != rendered != actively updating`; `Running != Healthy != Ready != Effective`.

## Evidence reviewed

Pattern evidence, not adoption decisions:

- MDN Broadcast Channel: same-origin/storage-partition browsing contexts can exchange structured-cloned messages, but the API defines no application protocol, negotiation, durability or semantic authority.
- MDN SharedWorker: one worker can be reached from multiple same-origin browsing contexts. It is a browser-local coordination candidate, not durable Workspace truth.
- MDN Window Management API: multi-screen discovery/placement is permission-gated and not universally available; screen topology can change dynamically. Extended Desktop therefore cannot depend on it.
- MDN browsing-context guidance: communication/resource sharing is constrained by origin and browsing-context-group boundaries; COOP/cross-origin isolation can change those relationships.
- Browser lifecycle/discard evidence already captured in the resource-budget research: a top-level surface may freeze or disappear independently of SB intent.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
- https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker
- https://developer.mozilla.org/en-US/docs/Web/API/Window_Management_API
- https://developer.mozilla.org/en-US/docs/Web/API/ScreenDetails
- https://developer.mozilla.org/en-US/docs/Glossary/Browsing_context
- https://developer.chrome.com/docs/web-platform/page-lifecycle-api

## Core model: durable semantic session, ephemeral presentations

Candidate identities:

`WorkspaceSessionRef` — logical durable working session for one qualified Workspace context.

`DesktopSessionRef` — desktop arrangement/preferences within the WorkspaceSession; never an authorization boundary.

`WindowRef` — stable semantic identity of an opened Application context.

`PresentationRef` — one materialized presentation of a WindowRef on one BrowserSurface.

`BrowserSurfaceRef` — one top-level browser browsing context participating in the session.

`TransferRef` + monotonic `TransferEpoch` — identifies one ownership-transfer attempt for one WindowRef.

`WindowCheckpointRef` — recoverable semantic context: Client/Workspace/Environment, Application/View, revision/currentness qualifiers, selection, dirty state references, pending/UNKNOWN effect obligations, external-auth disposition and reconstructable local view hints.

Hard rule: `PresentationRef != WindowRef`. A BrowserSurface can disappear while the WindowRef and its obligations remain.

## Authority and durability tiers

Candidate tiering:

1. **Durable semantic session** — WindowRegistry identity, transfer disposition, dirty/pending-effect obligations and recovery metadata that must survive loss of one surface.
2. **Browser-local coordination** — low-latency fan-out/heartbeats/subscription sharing; reconstructable and never sole authority.
3. **Surface-local presentation** — DOM/render tree, focus, zoom, panel sizes, viewport and display placement hints.
4. **Remote runtime/effect state** — separately observed/verified; never inferred from desktop lifecycle.

BroadcastChannel is suitable only for tier 2 fan-out because it supplies messaging but no protocol/durability. SharedWorker can centralize tier 2 while alive, but same-origin/browser-lifecycle constraints prevent treating it as tier 1. Window Management can improve placement only; denial/unavailability cannot break the semantic session.

## WindowRegistry candidate record

A provider-neutral registry entry should be able to express:

`WindowRegistryEntry { windowRef, applicationRef, semanticContextRef, lifecycleDisposition, activePresentationRef?, presentationEpoch, transferRef?, transferEpoch, checkpointRef, dirtyDisposition, effectObligations[], externalAuthDisposition?, revision/currentness qualifiers, lastQualifiedAt, recoveryDisposition }`.

Candidate lifecycle dispositions:

`REGISTERED | PRESENTED | TRANSFER_PREPARING | TRANSFER_TARGET_READY | TRANSFER_COMMITTING | PRESENTATION_LOST | RECOVERY_PENDING | REATTACHABLE | HIBERNATED | CLOSED | UNKNOWN`.

`CLOSED` is an explicit semantic disposition, not the result of a missing heartbeat alone.

## Single-presentation authority

Default candidate invariant for ordinary SB windows:

`one WindowRef -> at most one authoritative editable PresentationRef at a time`.

Read-only mirrors may exist only when explicitly qualified and visibly marked; they do not gain effect authority by sharing WindowRef. Collaborative applications may define their own multi-presentation semantics, but cannot inherit them accidentally from Extended Desktop.

A presentation lease/epoch is a fencing mechanism candidate, not proof of remote effect authority. Every mutating local presentation action must be qualified against the current Window presentation epoch plus the normal domain/revision/effect preconditions.

## Transfer protocol

Refine the parent sequence into a two-sided epoch protocol:

`REQUESTED -> SOURCE_CHECKPOINTED -> TARGET_QUALIFIED -> TARGET_MATERIALIZED_READONLY -> TARGET_READY_ACK -> REGISTRY_COMMIT(epoch+1) -> TARGET_AUTHORITATIVE -> SOURCE_RELEASED -> SETTLED`.

Rules:

- before registry commit, source remains authoritative;
- target materializes non-authoritatively before commit and must not emit effects;
- registry commit fences the previous presentation epoch;
- target becomes authoritative only after observing the committed epoch;
- source release is idempotent and may occur after target authority is established;
- late messages from an older epoch are ignored/reconciled, never allowed to reclaim authority;
- transfer timeout produces an inspectable recovery disposition, not silent duplication.

This is intentionally analogous to a fencing-token pattern without selecting a distributed-systems implementation.

## Failure matrix

### Failure before TARGET_READY_ACK

Disposition: abort transfer; source stays authoritative; target partial presentation is discarded/recoverable.

### Target ACK received, commit not confirmed

Disposition: `TRANSFER_OUTCOME_UNKNOWN`. Neither surface may infer ownership from local memory. Reconcile against durable WindowRegistry before enabling effects.

### Commit succeeds, source freezes before release

Target may become authoritative after reading committed epoch. When source resumes, its older epoch is fenced and it must downgrade to stale/recovery UI before any effect.

### Commit succeeds, target crashes immediately

WindowRef becomes `PRESENTATION_LOST/RECOVERY_PENDING`; source must not silently resume old authority. Recovery creates a new epoch/presentation or explicitly rolls forward via registry reconciliation.

### Both surfaces reconnect after network partition

Both re-read the registry. Only current epoch can be authoritative. Older presentation becomes non-authoritative even if it contains newer local pixels.

### Browser discards the only presentation

Window remains registered. Reopen/restore reconstructs from checkpoint, then requalifies auth/disclosure/revision/currentness/effect obligations before becoming usable.

## Dirty state and UNKNOWN effects

Dirty state and effects are separate obligations.

`Dirty != pending effect`; `submitted != accepted != effective`; `local checkpoint saved != remote mutation persisted`.

Candidate dirty dispositions: `CLEAN | DIRTY_CHECKPOINTABLE | DIRTY_CHECKPOINTED | DIRTY_UNSAFE_TO_TRANSFER | CONFLICTED | UNKNOWN`.

Candidate effect obligation dispositions: `NONE | PROPOSED | SUBMITTED | ACCEPTED_UNVERIFIED | EFFECTIVE_VERIFIED | FAILED | UNKNOWN`.

Transfer/hibernate/close policy must inspect both axes. A dirty context that cannot be checkpointed blocks automatic transfer/eviction. An UNKNOWN external effect can move only if its verification obligation is durably attached to WindowRef/WorkspaceSession rather than one surface timer.

## Heartbeats, liveness and false death

Surface heartbeats are hints, not closure authority. Browser throttling/freeze, laptop sleep and network interruption can all create missed heartbeats while the surface still exists.

Candidate surface dispositions:

`CONNECTED | SUSPECTED_UNREACHABLE | FROZEN_OR_THROTTLED_POSSIBLE | DISCONNECTED | RECOVERING | RETIRED_EXPLICITLY | UNKNOWN`.

A missing heartbeat may trigger `SUSPECTED_UNREACHABLE` and recovery affordances, but not semantic `CLOSED`, effect cancellation or ownership transfer without the transfer/recovery protocol.

## Display topology and presets

Display identity is an environmental hint, not durable semantic identity. Screen labels/coordinates/resolution/order may change across docking, OS settings, browser permission or device changes.

Dual-monitor presets should persist intent such as `PRIMARY_WORK + SECONDARY_MONITORING`, preferred relative role and window groups. Restore qualifies current available surfaces and maps intent to them. Failure to map produces a single-surface arrangement plus `Preset partially restored`, never missing windows.

Window Management API may improve mapping when permitted. Manual ordinary browser windows remain a valid fallback.

## Local versus shared state

Shared by default when semantically meaningful: WindowRef existence, Application/context identity, dirty/effect obligations, incident/currentness context, transfer disposition.

Local by default: keyboard focus, pointer hover, scroll, zoom, panel width, browser geometry and monitor placement.

Selection is application-specific: local unless explicitly collaborative/shared. Moving a Window to another display preserves semantic selection where admissible but does not force another independent Window to adopt it.

## Operational UX and observability

Extended Desktop needs its own inspectable local-client evidence:

- BrowserSurface membership and last-qualified liveness;
- active Window presentation epochs;
- transfers pending/unknown/recovering;
- checkpoint age/currentness;
- surface freeze/discard recovery;
- subscription-broker attachment;
- external-auth requalification;
- dirty/UNKNOWN-effect recovery obligations.

`Local surface lost != remote service degraded`. Observatory may explain reduced evidence coverage caused by surface/session degradation without rewriting remote health.

Monitor Wall windows transferred between displays preserve widget evidence envelopes and subscription identity. Transfer never resets stale/current/partial evidence to healthy.

## External applications

External mature UIs require a stricter transfer qualification. API-backed/native SB views can checkpoint semantic context. Embedded/proxied/deep-linked UIs may own unobservable dirty state/session history.

Candidate qualification:

`TRANSFER_SAFE | TRANSFER_SAFE_AFTER_CHECKPOINT | REOPEN_ONLY | USER_CONFIRM_REQUIRED | TRANSFER_UNSUPPORTED | UNKNOWN`.

If SB cannot prove external dirty-state continuity, it must not promise seamless move-to-display. A qualified deep-link/reopen path with tenant/environment/revision context is preferable to pretending iframe state migrated.

External auth is requalified on target before effects. `External UI painted != external auth current`.

## Resource/performance implications

WindowRegistry/session coordination should scale with semantic transitions, not rendered frame rate. Camera/scroll/pointer telemetry stays surface-local unless an application explicitly needs collaboration.

Candidate measurements:

- registry operations per semantic window transition;
- transfer command -> target visible acknowledgement -> target ready -> registry commit -> settled;
- duplicate-authority interval: target zero under correct qualification;
- checkpoint bytes/trend and checkpoint latency;
- surface reconnect -> registry reconciliation -> usable window;
- number of browser-local coordination messages versus durable registry writes;
- recovery cost after 1, 10 and 50 WindowRefs;
- multi-display loss recovery under NORMAL-B and STRESS-A fixtures.

Do not persist high-frequency layout/scroll events durably merely because multiple surfaces exist. Coalesce reconstructable placement hints and persist semantic/dirty/effect transitions.

## Accessibility

Extended Desktop must be operable without physical dragging between screens. Required commands include `Move to display`, `Bring here`, `Reattach`, `Recover lost window` and `Return to primary surface`, all keyboard reachable.

Taskbar/WindowRegistry exposes where a Window is presented in text, not only spatially. Surface loss produces a bounded status announcement and deterministic recovery focus; it does not generate repeated live-region noise. Per-display zoom remains local. If a target display disappears during transfer, focus remains on/reverts to a surviving qualified control.

A user who cannot perceive multiple displays spatially can still enumerate WindowRefs, current surface role, dirty/currentness status and transfer disposition from one accessible registry/list.

## Componentes impact

Add/refine research records:

`WorkspaceSessionStatus`, `UnifiedWindowRegistry`, `WindowRegistryEntry`, `WindowPresentationBadge`, `PresentationEpochBadge`, `MoveToDisplayAction`, `BringHereAction`, `DetachWindowAction`, `ReattachWindowAction`, `TransferProgressBoundary`, `TransferOutcomeUnknownNotice`, `SurfaceMembershipPanel`, `SurfaceLostRecoveryBanner`, `WindowCheckpointStatus`, `DirtyTransferBlocker`, `UnknownEffectRecoveryNotice`, `DualDisplayPresetEditor`, `PresetPartialRestoreNotice`, `ExternalAppTransferQualificationBadge`.

State matrices must include requested/preparing/ready/committing/settled, aborted, outcome-unknown, source-frozen, target-lost, both-reconnected, stale epoch, dirty blocked, external-auth expired, display removed and reduced-resource recovery.

## Proof obligations / adversarials

1. Source freezes after target ACK but before source release -> one current presentation epoch; source cannot resume authority.
2. Target crashes after registry commit -> WindowRef survives as recovery-pending; source old epoch stays fenced.
3. Commit response is lost -> UI enters outcome-unknown and reconciles registry before effects.
4. Duplicate/late BroadcastChannel message from old transfer -> idempotent/no authority rollback.
5. SharedWorker dies/restarts -> durable registry remains sufficient for recovery.
6. Multi-screen permission denied -> manual top-level surface + unified registry still works.
7. Secondary display physically disconnects -> no WindowRef disappears; preset degrades visibly.
8. Browser freezes secondary surface -> missed heartbeat does not imply close.
9. Browser discards only presentation -> reload restores checkpoint then requalifies context/currentness.
10. Dirty draft cannot checkpoint -> automatic move/hibernate blocked or requires explicit safe disposition.
11. External effect is UNKNOWN during move -> verification obligation follows WindowRef and remains UNKNOWN.
12. External iframe has unobservable dirty state -> no false seamless-transfer claim.
13. External auth expires between checkpoint and target readiness -> target effects blocked pending reauth.
14. Tenant/environment/revision changes during transfer -> target requalification fails/degrades; source remains/recovery path explicit.
15. Two surfaces reconnect after partition -> only durable current epoch can become authoritative.
16. Display coordinates/order change after docking -> semantic context remains; preset remaps by role/intention rather than stale coordinates.
17. Keyboard-only user moves and recovers a Window without drag.
18. Screen-reader user can enumerate windows on another display and bring one locally.
19. Monitor Wall transferred while evidence is stale -> remains stale; transfer cannot reset evidence currentness.
20. STRESS-A with 50 WindowRefs -> registry/recovery work remains bounded and independent of per-frame rendering.

## Maturity and next gaps

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE`.

This closes the conceptual ownership/durability gap for WindowRef presentation transfer without choosing an implementation provider. The key result is that browser messaging coordinates; a durable semantic registry arbitrates presentation epochs and recovery obligations.

Remaining high-value gaps:

1. disclosure-safe telemetry subscription identity/cache sharing across users and browser surfaces;
2. external-app dirty-state/residency qualification fixtures by integration mode;
3. empirical transfer/recovery budgets under NORMAL-B/STRESS-A once executable benchmark authority exists;
4. persistence/retention policy for WindowCheckpoint history and privacy-sensitive local layout metadata;
5. cross-device continuation versus same-device Extended Desktop — explicitly out of scope until same-device semantics saturate.

Do not advance to implementation planning until reconciled with the broader G4 frontend corpus.