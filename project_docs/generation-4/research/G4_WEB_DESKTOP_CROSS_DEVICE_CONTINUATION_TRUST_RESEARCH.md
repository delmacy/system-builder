# G4 — Web Desktop Cross-Device Continuation & Trust Boundary Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Web Desktop & Application Environment — WorkspaceSession / Window Manager / external apps / Native bridges / telemetry / security

## Purpose

Deep-gap continuation of the durable WorkspaceSession and mixed-management-authority research. This round asks what may safely continue when a user moves the same logical workspace between devices whose browser state, authenticators, external sessions, native bridges, local data and trust posture are not equivalent.

This is P&D documentation only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, provider adoption or security-policy changes.

## Repository inputs reconciled

The G4 corpus already establishes:

- `Client != Workspace != Desktop != Application != Window`;
- `Display Surface != Workspace` and a WorkspaceSession may project onto multiple browser surfaces;
- `Window/session != runtime`;
- session restore restores semantic checkpoints, not authority by implication;
- external-app integration may be Native SB, API-backed, Hybrid, Embedded, Proxied, Deep-link or Native bridge;
- `ACK != effect`, `Desired != Observed != Effective`, and stale/unknown evidence remains explicit;
- telemetry sharing is disclosure-qualified and authorization/currentness-specific;
- management authority is operation/scope-dimensional;
- provider migration does not transfer authority merely because configuration/state appears equivalent.

This round therefore does not reopen generic session persistence, Application Portfolio taxonomy or provider migration. It studies the trust discontinuity introduced by a different device.

## External evidence reviewed

Pattern evidence only; no adoption decision is implied.

### WebAuthn / NIST — authentication continuity is not device continuity

WebAuthn Level 3 distinguishes single-device credentials from backup-eligible multi-device credentials and exposes backup eligibility/current backup state. NIST SP 800-63B likewise distinguishes syncable authenticators and notes that sync capability does not prove that a credential has actually been synced. NIST also distinguishes exportable/syncable authenticators from non-exportable hardware-protected authenticators and requires non-exportable keys for AAL3.

Portable lessons:

- the same account authenticated on two devices does not imply the same authenticator properties;
- a credential that can appear on another device is not evidence that every device is equally trusted;
- device-bound and syncable authentication are policy-relevant facts rather than UI implementation trivia;
- successful authentication establishes only the claims actually proven by that ceremony.

### Browser lifecycle / browser-local coordination

Browser pages may be frozen or discarded without a reliable final callback. BroadcastChannel is scoped to compatible same-origin/storage-partition browsing contexts; it is not a cross-device durable authority protocol.

Portable lessons:

- browser-local peer silence cannot prove device revocation or transfer completion;
- `BroadcastChannel delivered != durable cross-device handoff`;
- a stale/offline device can later reconnect and must be fenced/requalified rather than assumed to have observed transfer/revocation.

### Telemetry privacy

OpenTelemetry guidance treats credentials, session tokens, user behavior and other contextual data as potentially sensitive and recommends minimization. URL conventions require sensitive URL material to be scrubbed.

Portable lesson: cross-device continuation must not copy telemetry subscriptions, query material, local history or external-session details merely because restoring them is convenient.

## Core finding — Workspace continuity is semantic continuity, not trust/authority cloning

Candidate identity separation:

```text
WorkspaceSessionId
  -> DeviceSessionId
       deviceTrustClaim
       authenticationClaim
       authorizationClaim
       securityCurrentness
       localCapabilityClaims[]
       localSensitiveStateDisposition
       deviceEpoch
  -> SurfaceSessionId
  -> WindowSessionId
  -> WindowProjectionId
```

Required invariants:

- `Same WorkspaceSession != same device trust`.
- `Same user != same authenticator assurance`.
- `Authenticated here != authorized for every restored command here`.
- `Window restored != external session restored`.
- `Window restored != Native bridge available`.
- `Passkey available != device posture equivalent`.
- `Synced credential != synced local authority`.
- `Cross-device continuation != authority transfer`.
- `Device offline != device fenced`.
- `Device revoked != revocation observed by stale device`.
- `Semantic checkpoint portable != every input/state field portable`.

## Candidate continuation envelope

```text
ContinuationEnvelope {
  workspaceSessionRef
  sourceDeviceSessionRef
  sourceDeviceEpoch
  checkpointRef
  semanticContextRefs
  portableWindowDescriptors[]
  nonPortableStateMarkers[]
  pendingCommand/effectRefs[]
  externalIntegrationRefs[]
  telemetryIntentRefs[]
  authorityRequalificationRequirements[]
  disclosureRequalificationRequirements[]
  targetDeviceCompatibilityRequirements[]
  createdAt
  evidenceCurrentness
}
```

The envelope carries semantic intent and lineage. It must not carry secret values, private authenticator material, opaque external cookies/tokens or device-local bridge handles.

## State classes — what may continue

Candidate disposition per state fragment:

- `PORTABLE_SEMANTIC`: document/view identity, selected semantic object, stable navigation context, non-sensitive layout intent.
- `PORTABLE_AFTER_REQUALIFICATION`: command context, telemetry subscription intent, external-app launch context, environment binding, privileged inspector context.
- `DEVICE_LOCAL_REDISCOVER`: Native bridge/device handles, local filesystem handles, USB/HID/serial attachment, OS integration.
- `EXTERNAL_SESSION_REAUTH`: third-party embedded/API/deep-link session whose authority belongs to the external system.
- `NON_PERSISTABLE_SECRET`: secret value, transient credential material, protected authentication ceremony state.
- `NON_PORTABLE_SENSITIVE_INPUT`: draft/input classified by policy as local-only or requiring explicit user transfer.
- `EFFECT_LINEAGE_ONLY`: pending/ACK/UNKNOWN effects whose identity and evidence travel, but which must not be resubmitted by restoration.
- `BLOCKED_UNKNOWN`: portability cannot be proven.

`UNKNOWN` defaults to non-transfer for sensitive/authority-bearing material, while preserving enough lineage to explain what could not be restored.

## Cross-device continuation protocol

Candidate sequence:

```text
TARGET_DEVICE_AUTHENTICATED
 -> TARGET_DEVICE_TRUST_QUALIFYING
 -> CONTINUATION_ENVELOPE_LOADED
 -> PORTABILITY_CLASSIFIED
 -> SEMANTIC_CHECKPOINT_RESTORED_READ_ONLY
 -> AUTHORIZATION/CURRENTNESS_REQUALIFYING
 -> EXTERNAL_INTEGRATIONS_REDISCOVERING
 -> TELEMETRY_DISCLOSURE_REQUALIFYING
 -> COMMAND_CONTEXT_REQUALIFYING
 -> INTERACTIVE_CURRENT
```

Branches include:

- `TARGET_TRUST_INSUFFICIENT`;
- `EXTERNAL_REAUTH_REQUIRED`;
- `NATIVE_BRIDGE_UNAVAILABLE`;
- `SENSITIVE_STATE_NOT_TRANSFERRED`;
- `SOURCE_DEVICE_STILL_ACTIVE`;
- `SOURCE_DEVICE_OFFLINE_UNFENCED`;
- `AUTHORIZATION_STALE/UNKNOWN`;
- `EFFECT_RECONCILIATION_REQUIRED`.

Read-only restoration may legitimately precede effectful authority when the available evidence permits disclosure but not mutation. `READ_ONLY != PERMISSION_DENIED` remains preserved.

## Source-device fencing and epochs

A continuation to device B does not require device A to be globally killed. Some workspaces legitimately support concurrent devices. Therefore the protected invariant determines whether a transfer, mirror or concurrent projection is intended.

Candidate modes:

- `CONCURRENT_QUALIFIED`: both device sessions remain independently qualified.
- `INTERACTION_TRANSFER`: one interaction authority epoch moves; old epoch becomes stale for that scope.
- `SENSITIVE_EXCLUSIVE`: policy requires old device/session fencing before target becomes effectful.
- `VIEW_ONLY_MIRROR`: target receives qualified projection without command authority.

Where exclusivity matters:

```text
TARGET_READY
 -> SOURCE_TRANSFER_INTENT_RECORDED
 -> NEW_DEVICE_EPOCH_ALLOCATED
 -> SOURCE_EPOCH_FENCE_REQUESTED
 -> SOURCE_FENCE_EFFECT_VERIFIED
 -> TARGET_COMMAND_AUTHORITY_QUALIFIED
```

If the source is offline and fencing cannot be proven, target authority depends on whether the protected command/effect surface has an independent server/target-side epoch fence. UI-local disappearance is insufficient.

`Source tab closed != source device fenced`.

## Device revocation and stale-device resurrection

A revoked or long-offline device can later reconnect with locally cached UI and checkpoints. Candidate rule:

- locally painted state may be shown only with explicit stale/offline status according to disclosure policy;
- no new privileged/effectful command becomes admissible until device/session/auth/security currentness is requalified;
- monotonic security/revocation floors cannot roll back because the device presents an older checkpoint;
- pending effects are reconciled by lineage before retry is offered;
- a stale device must not overwrite newer workspace/window registry epochs merely because its local state is newer by wall clock.

Candidate states:

`OFFLINE_LOCALLY_AVAILABLE`, `RECONNECTING`, `SECURITY_REQUALIFYING`, `REVOKED`, `EPOCH_STALE`, `CONFLICTED_CHECKPOINT`, `EFFECT_RECONCILING`, `CURRENT`.

## Authentication and passkey nuance

Cross-device UX must not equate passkey success with a universal device-trust badge.

Relevant dimensions include:

- authentication assurance/profile;
- phishing resistance;
- user verification/presence evidence;
- credential backup eligibility/state when policy-relevant;
- authenticator/device attestation where available and appropriate;
- enterprise device posture/management evidence where applicable;
- session age and security-currentness floor.

These are claim dimensions, not a single `trustedDevice=true` bit. Public/consumer contexts may deliberately avoid attestation requirements for usability/privacy reasons; enterprise/high-assurance contexts may qualify them differently. Adapter normalization must not fabricate equivalence between these policies.

## External integration consequences

### Native SB

Best semantic checkpoint portability, but command authority still requalifies on target device.

### API-backed

Restore API intent/context, not bearer/session tokens. Re-establish credentials/authorization and source currentness.

### Hybrid

Each side requalifies independently; SB-native semantic state may restore before external advanced UI/session is ready.

### Embedded

Iframe/session state is not assumed portable. Cross-origin storage/session remains external; fallback may become reauth/deep-link.

### Proxied

Proxy-side server session may survive, but target browser/device authorization and disclosure context still requalify. Do not infer equivalence from server-session continuity.

### Deep-link

Portable element is a qualified launch target/context. The external site owns its own authentication/session.

### Native bridge

Highest device-locality. Bridge identity, installed version, OS/device capability, trust and authorization must be rediscovered. A handle from device A is never a valid handle on device B by semantic identity alone.

## Application Portfolio Matrix delta

Add cross-device criteria to the existing matrix:

1. `checkpoint portability`;
2. `credential/session portability` (normally explicit/limited, never secret copying by default);
3. `device-local dependency`;
4. `target-device requalification depth`;
5. `external reauthentication behavior`;
6. `stale-device fencing capability`;
7. `sensitive-state transfer policy`;
8. `effect-lineage continuity`;
9. `telemetry disclosure requalification`;
10. `small-screen/alternate-device task equivalence`.

Indicative dispositions:

| Mode | Semantic checkpoint | Device-local dependency | Authority on target | External reauth | Replaceability concern |
|---|---|---|---|---|---|
| Native SB | high | low/declared | requalify | low | lowest when contracts remain open |
| API-backed | medium-high | low | API auth/currentness requalify | medium | API/provider contract |
| Hybrid | medium | mixed | each boundary requalifies | medium-high | split lifecycle |
| Embedded | low-medium | browser/external session | external + SB context | high/variable | framing/session coupling |
| Proxied | medium | proxy/server session | browser + proxy + external | variable | proxy/security coupling |
| Deep-link | launch-context only | external browser/session | external system | expected | low semantic coupling |
| Native bridge | low-medium | **high** | rediscover/re-authorize locally | bridge-specific | OS/device/provider coupling |

No mode is globally preferred.

## Desktop taxonomy / Observatory implications

Desktop Sphere taxonomy remains job-oriented (`DESIGN`, `OPERATIONS`, `OBSERVABILITY`, `GOVERNANCE`, `DATA`, `INFRASTRUCTURE`, `SUPPORT`, `FACTORY`, role-home candidates), not device-oriented. A phone/tablet/secondary workstation does not create a new semantic Desktop Sphere merely because layout changes.

`Desktop Observatory != Pinned Monitoring Surface != Operations Desktop` remains unchanged. Cross-device continuation adds:

- a Pinned Monitoring Surface may restore telemetry intent but must requalify disclosure/currentness;
- an Observatory may reopen read-only while privileged drill-down/commands remain blocked;
- Operations Desktop command surfaces require target-device authority/currentness requalification;
- monitor-wall device trust is distinct from operator identity and dashboard content authorization.

## Proprietary editor / Workflow-View-Form-Component implications

Shared editor foundations should classify state fragments rather than blindly serialize editor memory:

- semantic document state and stable selections can be portable;
- IME/composition buffers, clipboard material, local file handles and protected inputs can be device-local/non-portable;
- autosave checkpoints preserve revision lineage;
- command palette history must not leak sensitive command arguments across devices;
- `View != Workflow Activity`, `Form != Workflow State`, `Button != Domain Command` continue to hold after restore;
- restoring a form draft never implies restoring the workflow authority that could submit it.

This is a shared editor/session foundation concern, not logic each proprietary editor should reinvent.

## Accessibility and small-screen equivalence

Cross-device continuation makes `responsive` insufficient as a closure criterion. Required research property:

`same complete task semantics != same spatial arrangement`.

A small-screen target may linearize windows into task stacks, drawers or full-screen views while preserving:

- semantic identity;
- dirty/pending/unknown state;
- command labels and impact previews;
- focus/selection distinction;
- non-drag alternatives;
- authority/currentness disclosure;
- recovery and reconciliation paths.

A task that can only be completed through multi-window drag on a large monitor is not small-screen equivalent.

## Performance/resource implications

Cross-device continuation should reduce, not multiply, hidden resource use:

- restored hidden windows need not immediately instantiate resident runtimes;
- telemetry subscriptions reattach only after disclosure/currentness qualification;
- external embeds should lazy-rehydrate;
- Native bridges are rediscovered on demand;
- `open semantic window != resident external integration`;
- target-device resource budget may choose different residency/LOD without changing semantic state.

Performance remains empirically under-qualified until representative traces/fixtures exist; this research does not invent thresholds.

## Componentization complexity delta

### C0/C1 — semantic refs/tokens

`DeviceSessionRef`, `DeviceEpochRef`, `DeviceTrustClaimRef`, `AuthenticatorAssuranceRef`, `PortabilityDispositionRef`, `SourceFenceEvidenceRef`, `ExternalSessionRef`, `LocalCapabilityRef`, `SensitiveStateClassRef`.

### C2 — compounds

`DeviceTrustIndicator`, `ContinuationStateIndicator`, `PortabilityDispositionRow`, `ExternalReauthCard`, `NativeBridgeRediscoveryCard`, `StaleDeviceWarning`, `SensitiveStateTransferNotice`.

### C3 — shared foundations

- `ContinuationEnvelopeBoundary`;
- `DeviceTrustQualificationBoundary`;
- `CrossDeviceCheckpointClassifierBoundary`;
- `DeviceEpochFenceBoundary`;
- `ExternalSessionRequalificationBoundary`;
- `NativeBridgeRediscoveryBoundary`;
- `TelemetryDisclosureRequalificationBoundary`;
- `SensitiveStateTransferPolicyBoundary`;
- `CrossDeviceEffectReconciliationBoundary`.

These reduce repeated security/session logic across proprietary apps.

### C4 — tools/inspectors

`ContinuationInspector`, `DeviceSessionInspector`, `PortabilityInspector`, `StaleDeviceReconciliationInspector`.

### C5 — specialized applications

Application Manager, Control Center, Operations, Observatory and proprietary editors consume the shared boundaries but retain domain-specific semantics.

### C6/C7 — composition

Desktop Sphere / Workspace / Builder Home compose qualified device sessions and windows; they do not manufacture device trust.

No WBS decomposition is authorized by this map.

## Adversarial proof matrix

Future proofs should cover at least:

1. Same user authenticates on device B with lower assurance than device A; privileged window restores read-only, not effectful.
2. Syncable passkey succeeds on B; policy still requires managed-device posture for a high-risk command.
3. Device A goes offline before exclusive transfer; B cannot infer A is fenced.
4. Server-side command epoch fencing allows B to become effective even while A remains physically offline; A is rejected when it reconnects.
5. Device A reconnects with an older checkpoint after revocation and cannot roll back the security floor.
6. Pending ACK/UNKNOWN effect on A appears on B as lineage/reconciliation state and is not automatically retried.
7. Embedded external app restored on B has no valid external session; SB shell must not display it as current.
8. Deep-link context restores but target external authorization denies access; denial is preserved, not normalized to SB authority.
9. Native bridge existed on A but not B; window becomes rediscovery/unavailable state without fabricated capability.
10. Native bridge on B has incompatible version/contract; semantic window remains but bridge command path is blocked/qualified.
11. Telemetry widget from A restores on B after role revocation; old cached data is not silently re-exposed.
12. Two devices concurrently view the same Observatory with different disclosure envelopes; subscription sharing does not merge authority.
13. Sensitive draft field is marked non-portable; B shows an explicit omitted-state marker rather than empty-as-if-never-entered.
14. Small-screen continuation preserves a dirty editor and pending command state without requiring drag/window geometry.
15. Browser discard on A occurs without final callback; durable state and target-side epochs still prevent false transfer completion.
16. Source device clock is ahead; wall-clock recency cannot overwrite newer semantic/device epochs.
17. Sign-out/revocation on B does not imply A has observed it; server/currentness gates enforce subsequent effects.
18. Monitoring wall device is physically shared; operator change forces disclosure/authorization requalification before old material is reused.
19. External API session survives server-side but target browser identity changed; API session continuity does not bypass user/device qualification.
20. Target device resource pressure discards hidden windows; semantic checkpoints survive without treating discarded integrations as current.

## Proof obligations

A future implementation must prove:

- cross-device restore cannot copy secret/authenticator material by default;
- effect lineage survives continuation without duplicate submission;
- device/session epoch checks protect exclusive effectful surfaces where required;
- offline source silence is never used as fencing evidence;
- security/currentness floors are monotonic across stale-device resurrection where the policy requires monotonicity;
- external app/session/bridge currentness is independently represented;
- telemetry disclosure is requalified before consumer-visible restoration;
- non-portable sensitive state is explicit rather than silently lost;
- small-screen/alternate-device paths preserve complete task semantics without mandatory drag/multi-window geometry;
- accessibility semantics survive layout transformation;
- renderer/window shell never computes authority from device identity or visual presence;
- resource-pressure degradation does not erase dirty/pending/unknown/effect-lineage state.

## Synthesis against required Web Desktop closure targets

- Web Desktop ADR: unchanged; this research adds a device-trust boundary requirement.
- Desktop taxonomy: unchanged semantically; device class is not a Desktop Sphere.
- Window Manager: gains device/session epoch and portability qualification inputs.
- Multi-display/session: extended from same-device surfaces to cross-device continuation without conflating them.
- Application Portfolio Matrix: gains cross-device portability/trust dimensions.
- External-app security matrix: gains external-session reauth and device-local capability handling.
- Application Manager lifecycle: installation/adoption state may be visible cross-device, but management commands requalify.
- Control Center: configuration/provenance remains semantic; privileged mutation requalifies per target device/session.
- Declarative deployment/auto-binding: semantic intent is portable; secret values and local handles are not.
- Vault/environment auto-binding: SecretRef may restore; secret value/materialization does not.
- Monitoring/telemetry: subscription intent may restore; disclosure/currentness requalifies.
- Proprietary editor foundation: adds state-fragment portability classification.
- Workflow/View/Form/Component bridge: semantic bindings survive; submission authority does not transfer by form restoration.
- Accessibility/small-screen: strengthened from responsive rendering to complete-task semantic equivalence.
- Performance/resource budgets: continuation is lazy/qualified; empirical thresholds remain open.
- Failure/recovery/session restore: cross-device stale-device fencing and effect reconciliation now explicit.
- Adversarial proof matrix: expanded above.
- Componentization map: shared C3 trust/continuation foundations identified without WBS materialization.

## Saturation / remaining gaps

- Workspace/window semantic identity and same-device restore: **high conceptual maturity**.
- Cross-device continuation semantics: **medium-high after this round**.
- Device trust/authenticator qualification: **medium-high conceptually; product policy profiles remain open**.
- External-session / Native bridge portability: **medium**.
- Telemetry disclosure continuation: **medium-high**, building on disclosure-safe subscription research.
- Accessibility/small-screen equivalence: **medium-high contractually**.
- Performance/resource budgets: **medium-low empirically**.

Material gaps remain. Do not declare Web Desktop research complete.

## Next highest-value vector

Research **non-portable/local capability and sensitive-input continuity across proprietary editors and external integrations**: browser File System Access / clipboard / drag payloads / camera-mic-screen permissions / USB-HID-serial/native bridge handles, protected fields, local-only drafts, permission revocation and how the shared editor/session foundation represents `capability present here != capability portable there` without making complete tasks impossible on alternate devices.
