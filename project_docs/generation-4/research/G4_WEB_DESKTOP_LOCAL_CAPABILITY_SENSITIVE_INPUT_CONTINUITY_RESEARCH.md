# G4 — Web Desktop Local Capability & Sensitive Input Continuity Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: G4 Frontend Design System & UI Foundation / Web Desktop Operating Environment

## Purpose

Deep-gap research for local/non-portable browser and native capabilities after the cross-device continuation work. This artifact does not authorize implementation, WBS, Work Packages, Sprints, TASKs, provider adoption or package changes.

Constitutional alignment:

- `Client != Workspace != Desktop != Application != Window`.
- `Window/session != runtime`.
- `SecretRef != secret value`.
- `Desired != Observed != Effective`.
- `Automatic != hidden`.
- `Adapter normalization != fabricated semantic equivalence`.
- `Capability present here != capability portable there`.
- `Permission granted != capability currently usable`.
- `Handle serialized != authority portable`.
- `Device identity != semantic resource identity`.
- `Draft portable != sensitive input portable`.
- `Source offline != source fenced`.

## Evidence reviewed

Primary browser evidence reviewed 2026-09-23:

1. MDN FileSystemFileHandle: user-visible file access is permission-dependent and permission may not persist after page refresh when no same-origin tab remains; permission must be queried again.
2. MDN Clipboard API: clipboard read/write is secure-context and permission/user-activation constrained; browser behavior differs, especially for reads and embedded contexts.
3. MDN getUserMedia/enumerateDevices: camera/microphone access requires secure context and user permission; Permissions Policy can prevent embedded contexts from even requesting access; device enumeration is filtered by permission/policy.
4. MDN MediaTrackConstraints.deviceId: device IDs are origin-scoped and can differ in private browsing; they identify a source for a browsing origin, not a portable physical-device authority.
5. MDN WebHID: HID is secure-context, permission-policy constrained, experimental/limited availability; connection/device presence is dynamic.
6. MDN Permissions API: permission status aggregates secure-context, Permissions Policy, interaction and prompt constraints, but not every API exposes queryable permission state.
7. MDN OPFS sync access: origin-private file handles have materially different semantics from user-visible filesystem handles and can be worker-local/performance-oriented.

Sources:

- https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle
- https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
- https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/deviceId
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hid
- https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API
- https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle

Provider/browser behavior is qualification evidence, not implementation authority.

## 1. Material finding — continuation transports intent, not ambient capability

The Web Desktop needs a first-class distinction between semantic task continuity and local capability continuity.

Candidate model:

```text
WorkspaceSession
  -> DeviceSession / DeviceEpoch
    -> SurfaceSession
      -> WindowSession
        -> LocalCapabilityBindings[]
```

A `WindowSession` may be semantically portable while one or more local bindings are not.

```text
SemanticTaskCheckpoint != LocalCapabilityBinding
LocalCapabilityBinding != PermissionGrant
PermissionGrant != LiveResourceHandle
LiveResourceHandle != DomainAuthority
```

Examples:

- an editor draft can restore while its source `FileSystemFileHandle` requires requalification;
- a media-capture workflow can restore while camera permission/device selection must be reacquired;
- a deployment tool can restore while a Native bridge/USB/HID/serial target is absent;
- a form can restore ordinary fields while protected credentials, private keys or transient secrets intentionally do not restore.

Therefore cross-device continuation must never promise bit-for-bit UI resurrection. It promises a truthful reconstruction of task state plus explicit reacquisition obligations.

## 2. LocalCapabilityClaim

Candidate research contract:

```text
LocalCapabilityClaim {
  capabilityRef
  capabilityKind:
    USER_FILE | DIRECTORY | OPFS | CLIPBOARD_READ | CLIPBOARD_WRITE |
    CAMERA | MICROPHONE | SCREEN_CAPTURE |
    USB | HID | SERIAL | NATIVE_BRIDGE | OTHER
  semanticPurposeRef
  deviceSessionRef
  surfaceSessionRef?
  originRef
  provider/browser qualification ref
  permissionDisposition:
    GRANTED | PROMPT | DENIED | POLICY_BLOCKED | UNSUPPORTED | UNKNOWN
  presenceDisposition:
    PRESENT | DISCONNECTED | NOT_DISCOVERED | UNKNOWN
  handleDisposition:
    LIVE | SERIALIZED_LOCAL | REOPEN_REQUIRED | REDISCOVERY_REQUIRED |
    NON_SERIALIZABLE | INVALID | UNKNOWN
  portabilityDisposition:
    SAME_SURFACE_ONLY | SAME_DEVICE_REQUALIFY | CROSS_DEVICE_REDISCOVER |
    SEMANTIC_ONLY | NON_PORTABLE | UNKNOWN
  sensitiveStateClass
  currentness/evidence
}
```

No renderer may derive these states from visual availability alone.

## 3. Capability reacquisition state machine

Candidate common state machine:

```text
REQUIREMENT_DECLARED
 -> LOCAL_CAPABILITY_DISCOVERING
 -> CANDIDATE_PRESENT
 -> PERMISSION_QUALIFYING
 -> USER_GESTURE_REQUIRED | POLICY_BLOCKED | UNSUPPORTED | DENIED | QUALIFIED
 -> HANDLE_ACQUIRING
 -> BOUND
 -> CURRENTNESS_CHECKING
 -> EFFECTIVE_FOR_DECLARED_PURPOSE
```

Recovery branches:

```text
BOUND -> DEVICE_DISCONNECTED -> REACQUISITION_REQUIRED
BOUND -> PERMISSION_REVOKED -> BLOCKED
BOUND -> SURFACE_DISCARDED -> REQUALIFICATION_REQUIRED
BOUND -> DEVICE_TRANSFER -> CROSS_DEVICE_REDISCOVERY_REQUIRED
ANY -> UNKNOWN -> NO_EFFECT_UNTIL_REQUALIFIED (when hard capability)
```

`Permission granted` is insufficient because presence, browser support, origin, policy, user activation and handle validity can still differ.

## 4. Sensitive input continuity

Sensitive input requires an independent portability classification. A generic autosave engine must not persist every field merely because it can.

Candidate classes:

```text
PUBLIC_DRAFT
BUSINESS_CONFIDENTIAL_DRAFT
LOCAL_ONLY_DRAFT
SECRET_REFERENCE
SECRET_VALUE_TRANSIENT
PRIVATE_KEY_TRANSIENT
DEVICE_BOUND_ASSERTION
EXTERNAL_SESSION_TOKEN
NON_PERSISTABLE_PROTECTED_INPUT
```

Candidate rule:

```text
Restore semantic structure != restore sensitive payload
```

A restored form may show `credential required again`, `local file must be reselected`, or `camera must be reauthorized` while preserving all safe surrounding work.

Password/secret/private-key fields should be modeled as explicit protected input classes, not ordinary form values with a visual mask.

## 5. Clipboard and drag/drop

Clipboard and drag payloads are transport inputs, not durable semantic stores.

Required distinctions:

```text
Clipboard content available != authorized domain input
Drag payload present != semantic relation admissible
Dropped file != durable file binding
Copy succeeded != downstream paste/read permitted
```

Clipboard access varies by browser and user activation. Embedded external apps may have different Permissions Policy boundaries. Therefore Application Portfolio qualification must include clipboard/drag capability realization for workflows that depend on them.

For drag/drop across SB windows, semantic object references should be preferred over opaque payload copying where the domain operation is a reference/move/link. Cross-app drag must still pass the receiving application's command/admission boundary.

## 6. Camera/microphone/screen and privacy

Capture capabilities are device/session local and privacy-significant. Restoring a window must not silently restart capture.

Candidate lifecycle:

```text
CAPTURE_INTENT_RESTORED
 != PERMISSION_RESTORED
 != DEVICE_RESELECTED
 != CAPTURE_ACTIVE
```

A continuation can restore constraints/purpose but must require explicit requalification before capture. Indicators of active capture belong to actual observed capture state, not merely stored intent.

Screen capture is even less portable: the selected source is a local user choice and should be treated as non-portable unless future platform evidence proves otherwise.

## 7. USB/HID/serial/native bridge

These are high-friction but important for industrial/admin use cases.

Research rule:

```text
SemanticTargetRef != BrowserDeviceHandle != NativeBridgeHandle
```

A semantic target may survive device changes; the local binding must be rediscovered and proven to correspond to that target. Vendor/product IDs or labels alone are insufficient identity proof when effects matter.

Limited browser availability makes these tasks strong candidates for `Hybrid` or `Native bridge`, with graceful API/deep-link/manual alternatives where possible rather than making the entire Web Desktop depend on one browser capability.

## 8. Application Portfolio Matrix delta

All seven integration modes remain valid: `Native SB / API-backed / Hybrid / Embedded / Proxied / Deep-link / Native bridge`.

Add qualification dimensions:

| Dimension | Question |
|---|---|
| local-capability dependency | Does the task require local files, capture, clipboard, device or bridge access? |
| permission realization | Who prompts/enforces permission and can SB observe currentness? |
| handle portability | Can state move across surface/device, or only semantic intent? |
| reacquisition UX | Can the task resume without losing safe work? |
| sensitive-input persistence | Which values are forbidden or constrained from checkpoints? |
| browser support | Is the capability baseline, limited, experimental or provider-specific? |
| alternate-path equivalence | Is there a non-local API/deep-link/manual path for the complete task? |
| effect authority | Does the local capability merely supply input or directly reach an effect surface? |
| revocation/disconnect evidence | Can loss of permission/device be observed without fabricating currentness? |

Portfolio implications:

- file/document editing: Native/Hybrid, semantic draft portable; local file handle requalified;
- camera/mic evidence capture: Native/Hybrid, explicit reacquisition; no silent restart;
- infrastructure hardware console: Native bridge/Hybrid, device-bound and effect-authority qualified;
- mature admin console: API-backed/Hybrid/Deep-link generally preferable to forcing local device access;
- Embedded external app: local capabilities are separately governed by iframe/origin/Permissions Policy and cannot be inferred from parent capability;
- Proxied app: proxying network traffic does not proxy browser-local permissions;
- Deep-link: carries launch context, not local handles or external private session state.

## 9. Desktop Sphere synthesis

Desktop taxonomy remains job-oriented rather than module-oriented. This finding does not create a new Desktop Sphere.

- `DESIGN`: file import/export and local assets may require re-selection without losing semantic draft.
- `OPERATIONS`: local hardware/native bridges require effect-authority qualification and stronger fencing/reacquisition.
- `OBSERVABILITY`: capture/local files are usually ancillary; telemetry disclosure/currentness remains independent.
- `GOVERNANCE`: protected evidence/signature material may be intentionally non-portable.
- `DATA`: bulk file import/export requires explicit file-handle and partial-transfer recovery semantics.
- `INFRASTRUCTURE`: strongest Native bridge/USB/HID/serial pressure.
- `SUPPORT`: remote support must distinguish remote-session authority from local-device capability.
- `FACTORY`: application/provider tooling may use local artifacts but cannot make local filesystem identity canonical.

`DesktopObservatory != PinnedMonitoringSurface != OperationsDesktop` remains unchanged.

## 10. Window Manager / multi-display implications

Moving a window between displays on the same DeviceSession is not equivalent to moving it to another DeviceSession.

```text
ARRANGE_PROJECTION != TRANSFER_INTERACTION != TRANSFER_LOCAL_CAPABILITY
```

Same-device projection transfer may retain a valid local binding if the browser/platform contract permits it. Cross-device transfer never assumes that. A `WindowRegistry` should record capability requirements and dispositions, not serialize opaque live handles into generic session state.

## 11. Proprietary editor foundation delta

Shared editor foundations should own:

- checkpoint classification hooks;
- protected-field policy hooks;
- local-capability requirement declarations;
- reacquisition affordance slots;
- import/export intent and recovery envelope;
- permission/currentness indicators;
- failure-preserving-draft behavior.

Specific editors own domain grammar, typed bindings and which capabilities are semantically required.

Workflow/View/Form/Component bridge rules:

- `Form field != local capability`;
- `File picker button != domain command`;
- `Capture button != workflow state`;
- `View can request capability != workflow owns device permission`;
- domain command admission occurs after required local inputs/capabilities are qualified.

## 12. Declarative + opinionated UX

Declarative requirement example:

```text
InputRequirement {
  purpose: "attach evidence"
  acceptedKinds: [FILE, CAMERA_CAPTURE]
  requiredGuarantees
  sensitivity
  persistencePolicy
  fallbackPolicy
}
```

The semantic definition says what input is needed and with what guarantees. Browser picker APIs, native bridge commands and provider artifacts are realizations. This preserves `declarative != provider artifact` and allows opinionated UX to choose the simplest currently admissible realization without hiding alternatives or authority.

## 13. Componentization complexity map

### C0/C1 — primitive/atomic

`LocalCapabilityRef`, `PermissionDisposition`, `PresenceDisposition`, `HandleDisposition`, `PortabilityDisposition`, `SensitiveStateClass`, `DeviceBindingRef`, `ReacquisitionReasonRef`.

### C2 — compound

`CapabilityStatusIndicator`, `PermissionPromptAffordance`, `ReacquisitionCard`, `ProtectedInputField`, `LocalBindingSummary`, `AlternatePathChooser`.

### C3 — shared foundations

- `LocalCapabilityRequirementBoundary`
- `LocalCapabilityQualifierBoundary`
- `SensitiveCheckpointClassifierBoundary`
- `LocalHandleRegistryBoundary`
- `CapabilityReacquisitionBoundary`
- `DeviceBindingResolverBoundary`
- `PermissionCurrentnessBoundary`
- `LocalEffectAuthorityQualifierBoundary`
- `AlternateTaskPathBoundary`

These are high-leverage foundations and should prevent every proprietary application from inventing local-device/session semantics.

### C4 — tools/inspectors

`LocalCapabilityInspector`, `SessionPortabilityInspector`, `ProtectedStateInspector`, `DeviceBindingInspector`.

### C5 — applications

Editors, Data tools, Infrastructure/Operations apps, Support apps and Application Manager consume the shared foundations but retain domain-specific requirements.

### C6/C7 — workspace/system views

Desktop Sphere and Workspace aggregate capability blockers without converting them into global authority. Builder Home may summarize affected sessions/tasks but must not imply that a device permission is globally grantable.

## 14. Accessibility and small-screen equivalence

Local capability UX must not make drag, hover or spatial desktop interaction mandatory.

Required equivalents:

- file attach has keyboard/single-pointer chooser alternative;
- drag/drop has explicit `Attach`, `Move`, `Link`, `Import` commands;
- camera/capture controls expose programmatic names, state and stop controls;
- permission/reacquisition blockers are represented in DOM/status/inspector, not color alone;
- small screens may serialize window layout but preserve complete task access;
- unsupported local capability exposes alternate path or truthful blocker, never a hidden disabled control.

## 15. Performance/resource implications

Local capabilities introduce resource budgets distinct from rendering:

- live media tracks;
- open file/device handles;
- native bridge connections;
- buffered import/export bytes;
- worker/OPFS activity;
- device event subscriptions.

Candidate lifecycle:

```text
VISIBLE_ACTIVE -> VISIBLE_PASSIVE -> HIDDEN_CHECKPOINTED
```

Resource release may occur after checkpoint, but semantic state must retain reacquisition requirements. Unknown/pending external effects can block discard even when the local handle itself is releasable.

No numeric budget is selected here; empirical fixture work remains required.

## 16. Failure/recovery and adversarial proof matrix

Future conformance fixtures should prove at least:

1. File handle serialized locally but permission lost after restart -> `REQUALIFICATION_REQUIRED`, not usable.
2. Same semantic file name exists on another device -> no fabricated identity equivalence.
3. Camera permission granted but device disconnected -> not `EFFECTIVE`.
4. Camera intent restored -> capture does not silently restart.
5. Embedded app lacks iframe Permissions Policy -> parent permission does not leak through.
6. Clipboard read works in one browser but requires different activation/prompt in another -> capability qualification is browser/profile scoped.
7. Dragged file accepted visually but semantic command invalid -> domain mutation rejected while draft/input remains recoverable.
8. USB/HID device reconnects with similar metadata -> effect authority remains unproven until identity/binding qualification.
9. Native bridge unavailable on target device -> task checkpoint survives and alternate path is offered where contracted.
10. Secret value entered then crash/restore -> surrounding form restores but secret value does not unless an explicit secure persistence contract exists.
11. SecretRef restores -> secret value is not inferred.
12. Permission revoked while hidden -> return to foreground requalifies before effect.
13. Device transfer during local file upload -> partial transfer/effect lineage preserved; no blind restart.
14. Source device goes offline -> no claim that local capability or effect authority was fenced.
15. Private browsing changes device identity behavior -> stored deviceId does not become global hardware identity.
16. Browser unsupported for WebHID -> truthful unsupported disposition, not disabled-without-reason.
17. OPFS-local draft survives but user-visible export target is gone -> local draft and export binding remain distinct.
18. Monitoring wall restored under another operator -> local capture/clipboard permissions and telemetry disclosure are independently requalified.
19. Small-screen continuation cannot expose spatial drag -> command-equivalent path remains available.
20. Resource pressure closes a hidden device connection -> semantic checkpoint records reacquisition instead of pretending continuity.

## 17. Contradictions and trade-offs

### Persist more for seamless restore vs persist less for safety

Resolution: classify state. Persist semantic structure aggressively; persist sensitive/local capability state only under explicit class-specific contracts.

### Browser-native capability vs Native bridge

Browser-native reduces installation/lock-in but can have limited support and constrained identity/permission semantics. Native bridge increases reach and stability for hardware integration but raises lifecycle, security and replaceability costs. Portfolio selection remains per task.

### Exact UI restoration vs truthful task restoration

Exact restoration is attractive but unsafe when local resources/permissions changed. Prefer truthful task restoration with explicit reacquisition.

### Automatic reacquisition vs user agency

Automatic rediscovery may identify candidates, but permission, identity and effect-authority transitions remain visible and qualified. `Automatic != hidden`.

## 18. Saturation / remaining gaps

- Web Desktop architecture: high conceptual maturity.
- Desktop Sphere taxonomy: medium-high.
- Window/session identity and same-device restore: high.
- Cross-device continuation: medium-high.
- Local capability portability: medium-high after this round.
- Sensitive-input checkpoint semantics: medium-high conceptually; secure persistence mechanisms remain intentionally unselected.
- Application Portfolio: medium-high.
- Proprietary editor foundation: medium-high.
- Accessibility/small-screen equivalence: medium-high contractually.
- Performance/resource budgets: medium-low empirically.

Research is **not complete**. Material gaps remain.

## 19. Next vector

Highest-value next vector: **large local transfer/import/export continuity under partial success and browser lifecycle pressure**.

Questions:

- chunk/checkpoint identity for multi-GB local imports/exports;
- user file handle vs OPFS staging vs server-side upload session;
- partial success and effect lineage across tab discard/device disconnect;
- content hashing/dedup without confusing same bytes with same semantic artifact;
- resumability across reselected files without fabricating identity;
- storage quota/eviction/currentness;
- accessibility and small-screen equivalents for long-running transfer management;
- resource budgets and telemetry that do not leak local filenames/content.

This vector can materially affect Data tools, editors, Window lifecycle, session restore, Application Portfolio and performance foundations without requiring product implementation.