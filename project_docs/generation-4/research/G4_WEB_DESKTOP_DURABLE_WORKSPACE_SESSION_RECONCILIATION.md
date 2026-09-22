# G4 Web Desktop — Durable Workspace Session Reconciliation

Status: RESEARCH / SYNTHESIS — no implementation planning

## Why this gap is material

The Web Desktop corpus already separates Client, Workspace, Desktop Sphere, Application, Window and View/Tab/Tool; establishes windows as interaction sessions rather than runtimes; and rejects a 3D navigation foundation. The remaining high-value gap is durable reconciliation when one logical WorkspaceSession is projected into several browser windows/tabs/displays and those surfaces independently freeze, crash, reconnect, restore, or lose external-app authority.

A browser surface is not a durable authority merely because it remains visible. Browser lifecycle behavior makes this especially important: background pages can be throttled/frozen/discarded; `beforeunload` is not a reliable persistence boundary; cross-context messaging is useful for coordination but does not itself create durable consensus or semantic authority. Therefore `visible peer != current peer`, `message delivered != durable state`, and `restored window != restored authority`.

## Core identity split

Preserve distinct identities:

- `WorkspaceSessionId`: durable logical interaction scope for a Client/Workspace context.
- `SurfaceSessionId`: one browser top-level surface participating in that workspace session.
- `SurfaceEpoch`: monotonically newer participation epoch after transfer/reconnect/reconstitution.
- `WindowSessionId`: durable interaction-session identity for an application window.
- `WindowProjectionId`: placement/projection of that window on a particular surface/display.
- `ApplicationInstanceRef`: application-level identity where relevant; never inferred from a window.
- `ExternalSessionRef`: opaque external-tool session/auth context, when applicable; never promoted to SB authority.

`WorkspaceSession != browser tab != display surface != window`.

## Durable state vs ephemeral projection state

Candidate durable session state:

- client/workspace identity and revision/currentness context;
- window registry identity, application identity and semantic document/task references;
- dirty/pending/unknown-effect disposition;
- command context requirements and last qualification evidence;
- recoverable editor draft/checkpoint references;
- explicit transfer/ownership epochs for exclusive interaction responsibilities;
- restore provenance and reconciliation status.

Candidate ephemeral/local projection state:

- pixel coordinates and transient animation;
- hover, pointer capture and drag-in-progress;
- local focus ring;
- transient panel resize before checkpoint;
- renderer caches and external iframe internals.

Some layout state can be persisted as preference/checkpoint, but persistence does not make it semantic authority.

## Reconciliation state machine

Candidate `WorkspaceSession` participation lifecycle:

`DETACHED -> JOINING -> QUALIFYING -> ACTIVE_CURRENT`

with branches:

- `ACTIVE_CURRENT -> BACKGROUND_SUSPECT -> FROZEN_OR_UNOBSERVED`
- `ACTIVE_CURRENT -> TRANSFER_PROPOSED -> TRANSFER_ACKNOWLEDGED -> NEW_EPOCH_QUALIFYING -> TRANSFER_EFFECTIVE`
- `ACTIVE_CURRENT -> DISCONNECTED -> RECONNECTING -> REQUALIFYING -> ACTIVE_CURRENT`
- `* -> STALE_EPOCH`
- `* -> RESTORE_CANDIDATE -> RESTORE_RECONCILING -> RESTORED_CURRENT | RESTORED_READ_ONLY | RESTORE_BLOCKED`
- `* -> CONFLICTED -> RECONCILIATION_REQUIRED`

A peer that resumes with an older `SurfaceEpoch` is stale even if its DOM is intact. Epoch comparison is not sufficient for business-effect truth; it only prevents old surfaces from silently reclaiming interaction authority.

## WindowRegistry reconciliation

`WindowRegistry` should be modeled as a semantic registry plus per-surface projections, not as a shared array of rectangles.

Each entry needs at least:

- window identity and application identity;
- semantic context (`Client`, `Workspace`, environment, task/document refs);
- lifecycle disposition;
- dirty/checkpoint state;
- pending command/effect references;
- currentness/evidence disposition;
- projection set by surface/display;
- transfer epoch where exclusive interaction applies;
- external integration mode and external-session qualification when applicable.

A close request must distinguish:

- `CLEAN_CLOSEABLE`;
- `DIRTY_RECOVERABLE`;
- `DIRTY_UNCHECKPOINTED`;
- `COMMAND_PENDING`;
- `ACKNOWLEDGED_EFFECT_UNKNOWN`;
- `EXTERNAL_SESSION_UNKNOWN`;
- `RECONCILIATION_REQUIRED`.

Closing a projection does not necessarily close the logical WindowSession. Closing the final projection does not authorize discarding a dirty draft or an unknown effect.

## Cross-surface coordination: browser primitives are transports, not authority

`BroadcastChannel`, `MessageChannel`, workers, storage events and similar browser mechanisms may transport coordination facts. Web Locks can help serialize browser-origin participants where supported. None should be treated as the canonical source of WorkspaceSession truth.

Required rule:

`coordination primitive != durable semantic authority`.

The durable layer must tolerate:

- peer never receiving a final message;
- peer freezing between ACK and checkpoint;
- duplicate delivery/retry;
- stale peer resuming after transfer;
- browser process crash;
- page restoration from history/session mechanisms;
- one display disappearing;
- external app session expiring independently.

## Transfer semantics

Moving a logical window between displays/surfaces is not ordinary drag-and-drop.

Distinguish:

- `ARRANGE_PROJECTION`: layout-only movement within a surface;
- `MIRROR_PROJECTION`: add another view of the same WindowSession where allowed;
- `TRANSFER_INTERACTION`: move exclusive interaction responsibility to another surface/epoch;
- `REOPEN_FROM_CHECKPOINT`: construct a new projection from durable recoverable state.

`Arrange != Mirror != Transfer != Restore`.

For editors or effect-bearing tools, transfer should follow a bounded protocol such as:

`TRANSFER_PROPOSED -> TARGET_READY -> SOURCE_QUIESCING -> CHECKPOINT_CAPTURED -> TARGET_REQUALIFIED -> NEW_EPOCH_EFFECTIVE -> SOURCE_STALE`.

If source disappears after target readiness but before checkpoint/effect qualification, state becomes `TRANSFER_UNCERTAIN`/`RECONCILIATION_REQUIRED`, not silently effective.

## Command context requalification

Restored or transferred UI must requalify commands against current semantic context. Persisted enabled/disabled state is presentation history, not authority.

Requalification dimensions include:

- Client/Workspace/environment identity;
- actor/session authority;
- semantic revision/currentness;
- document/task lock or concurrency disposition;
- external integration health/session/currentness;
- pending/unknown effects;
- policy/config provenance where command behavior depends on them.

`previously enabled != currently authorized`.

## External application integration consequences

Application Portfolio modes have different restore guarantees:

- **Native SB**: strongest opportunity for durable semantic checkpoint and command requalification.
- **API-backed**: restore SB window state, then reacquire API currentness/authority.
- **Hybrid**: restore native shell independently; specialist external UI may require a fresh external session.
- **Embedded**: iframe DOM/session cannot be assumed durable or introspectable; restoration may recreate the embed and show `EXTERNAL_SESSION_REQUALIFYING`.
- **Proxied**: proxy/session/cookie/WebSocket state must be independently requalified; never infer continuity from rendered pixels.
- **Deep-link**: SB can restore launch context/reference, not the external application's private interaction state.
- **Native bridge**: bridge process/device capability must be rediscovered and reauthorized; `bridge previously connected != bridge current`.

This is a material Application Portfolio delta: **session-restorability is a first-class criterion alongside security, compatibility, licensing, authority, currentness, UX, lifecycle, replaceability and lock-in.**

## Multi-display model

A `DisplaySurface` is a projection target, not a Workspace. Multiple displays may host projections of one WorkspaceSession, and one physical display may later host a different session.

Required dispositions include:

- `DISPLAY_AVAILABLE` / `DISPLAY_GONE`;
- `SURFACE_CURRENT` / `SURFACE_STALE` / `SURFACE_UNKNOWN`;
- `WINDOW_PROJECTED` / `WINDOW_UNPROJECTED`;
- `TRANSFER_PENDING` / `TRANSFER_EFFECTIVE` / `TRANSFER_UNCERTAIN`.

Display disappearance must not destroy durable window/session identity. Windows are rehomed/recovered according to policy and dirty/effect disposition.

## Resource pressure and lifecycle

Browser background throttling/freezing/discarding contradicts any design that assumes all open windows are continuously executing. The desktop therefore needs a resource model that can suspend presentation without falsifying semantic state.

Candidate tiers:

1. `VISIBLE_ACTIVE`: full interactive budget.
2. `VISIBLE_PASSIVE`: rendering/subscriptions reduced where semantics permit.
3. `HIDDEN_CHECKPOINTED`: UI suspended; durable checkpoint/currentness metadata retained.
4. `DISCARDED_RECOVERABLE`: renderer/application projection destroyed; semantic session recoverable.
5. `NON_RECOVERABLE_DIRTY` or `UNKNOWN_EFFECT`: cannot be silently discarded.

External dashboards/telemetry subscriptions should be brokered/aggregated where possible rather than multiplied per hidden window. Resource pressure may reduce freshness, but the UI must expose resulting currentness degradation.

## Observatory / pinned surface / Operations Desktop

The existing distinction remains valid under multi-display:

- `DesktopObservatory`: exploratory/diagnostic application or workspace capability; query/navigation rich.
- `PinnedMonitoringSurface`: persistent glanceable projection optimized for bounded monitoring and low interaction.
- `OperationsDesktop`: action-bearing sphere with qualified authority, incident/operation context and command workflows.

A pinned monitor can survive as a low-resource projection while the richer Observatory window is discarded/recovered. It must not inherit Operations authority because it shows the same telemetry.

## Accessibility and small-screen equivalence

Multi-window spatial layout cannot be required to complete a task. Every window must have a non-spatial route through application/window lists, switcher/search, semantic headings and command surfaces. Transfer/move actions require non-drag commands. Focus restoration is local to a surface and must not be conflated with semantic selection.

Small screens may collapse the Desktop into a single-active-window/task-stack projection while preserving WindowSession identity, dirty state, pending effects and restore semantics. `small-screen equivalence != pixel-equivalent desktop`.

## Performance/resource budget research targets

Do not set arbitrary final numeric budgets without traces. Measure separately:

- shell/window-manager interaction latency;
- active vs hidden DOM/render cost;
- subscription count/fan-out by integration mode;
- checkpoint serialization size/time;
- restore time to semantic shell and to requalified interactivity;
- memory per native/editor/embed window;
- CPU/network under multiple monitoring surfaces;
- stale-currentness propagation latency after freeze/reconnect;
- reconciliation time with N surfaces and M windows.

Budget policy should favor checkpoint/suspend/recreate over keeping every app live. `open window != permanently resident runtime`.

## Componentization complexity map

### C0/C1 — atomic contracts/primitives
`WorkspaceSessionRef`, `SurfaceSessionRef`, `SurfaceEpochRef`, `WindowSessionRef`, `WindowProjectionRef`, `RestoreProvenanceRef`, `CurrentnessRef`, `DirtyDispositionRef`, `EffectDispositionRef`.

### C2 — compounds
`SurfacePresenceIndicator`, `TransferStateIndicator`, `RestoreDispositionBadge`, `WindowRecoveryCard`, `CommandQualificationSummary`, `ExternalSessionStatus`.

### C3 — shared foundations
`WindowRegistry`, `WorkspaceSessionCoordinator`, `CheckpointStoreBoundary`, `CommandContextQualifier`, `ExternalSessionQualifier`, `SubscriptionBroker`, `ResourcePressureController`, `Focus/Selection Bridge`.

### C4 — tools
`WindowSwitcher`, `SessionRecoveryInspector`, `TransferInspector`, `ResourceInspector`, `ExternalIntegrationInspector`, `Conflict/Reconciliation Inspector`.

### C5 — specialized applications
Editors, Observatory, Operations, Application Manager, Control Center, deployment/infra/data applications consume the foundations above; they own domain semantics but not generic multi-surface reconciliation.

### C6/C7 — composition
Desktop Sphere / WorkspaceSession / Builder Home compose the lower layers. They do not recompute dirty/effect/currentness semantics.

This decomposition reduces proprietary-app cost by centralizing window identity, restore, currentness, command qualification, checkpoints, subscription/resource control and external-session boundaries. App-specific work remains semantic document models, domain commands, typed bindings, specialized validation/simulation and domain evidence.

## Adversarial proof matrix

1. Source tab freezes during transfer after target ready but before checkpoint: target must not claim clean effective transfer.
2. Stale source resumes after a newer epoch: it cannot issue exclusive commands until requalified.
3. Final projection closes while command is ACKed but effect unknown: logical session/effect record survives.
4. Browser restores a page from history with old permissions: commands requalify before use.
5. Embedded external tool still paints cached UI after external auth expiry: SB marks external authority/currentness unknown/stale.
6. Display disappears with dirty editor: window identity and draft checkpoint survive; no silent discard.
7. Deep-link app is restored: only launch/context reference is restored, never fabricated external session state.
8. Resource pressure discards hidden native window: recoverable checkpoint remains and restore provenance is visible.
9. Resource pressure cannot discard `UNKNOWN_EFFECT` evidence needed for reconciliation.
10. Two monitoring displays subscribe to same stream: broker may share transport, but each projection retains its own currentness/disclosure state.
11. Small-screen projection exposes same task/commands without requiring spatial drag or multi-window geometry.
12. Network reconnect delivers duplicate coordination facts: state transition is idempotent or detects conflict.
13. Client/Workspace context changed while peer slept: resumed peer is stale until context requalification.
14. External native bridge reconnects to a different device/instance: identity mismatch is surfaced, not silently rebound.
15. Mirror projection is mistaken for transfer: proof must show no exclusive-authority mutation occurred.

## Closure / saturation

This closes the conceptual gap that a shared WorkspaceSession could be implemented as synchronized browser geometry. It cannot: durable semantic session state, surface epochs, window identity, checkpoints, effect/currentness evidence and command requalification must survive browser lifecycle discontinuities.

Saturation by domain:

- Window identity/lifecycle: high conceptual maturity.
- Multi-display identity/transfer: medium-high after this synthesis.
- Session restore/reconciliation: medium-high conceptually; empirical browser traces remain.
- Application Portfolio: medium-high; add `session-restorability` as a qualification dimension.
- External integration security/currentness: medium-high.
- Resource/performance budgets: medium-low until representative traces exist.
- Accessibility/small-screen equivalence: medium-high contractually; prototype/usability evidence remains.
- Application Manager / Control Center / declarative deployment / Vault auto-binding: medium; cross-app authority and provenance interactions still need synthesis.

## Next high-value research vector

Research `Application Manager + Control Center + declarative deployment/service-definition + Vault/environment auto-binding` as one authority/provenance chain. The key unresolved question is how `Install -> Adopt -> Register -> Configure -> Bind -> Deploy -> Observe -> Reconcile` composes without collapsing semantic definition into provider artifacts or turning automatic binding into hidden authority. Include inheritance/provenance, SecretRef handling, environment qualification, discovered-vs-verified resources, rollback and external-tool adoption.