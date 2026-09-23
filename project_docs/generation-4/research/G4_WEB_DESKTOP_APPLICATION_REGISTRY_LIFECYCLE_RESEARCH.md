# G4 — Web Desktop Application Registry Lifecycle Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment

## Purpose

Bounded P&D into the Web Desktop `Application Registry`: what it means for an application to be known, visible, adopted, loadable, loaded, backgrounded, suspended, evicted, failed and recoverable without collapsing application-shell lifecycle into module/capability/deployment/runtime lifecycle.

This artifact continues the Web Desktop shell/componentization research after modal ownership/focus and reconciles Application Adoption / Management Authority Transition plus in-flight effect handoff. It does not freeze the Desktop Sphere taxonomy, select a package/runtime mechanism, authorize implementation, or make 3D a navigation foundation.

## Repository boundaries reconciled

- `Builder != Runtime`; published runtimes remain autonomous.
- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `Window lifecycle != runtime lifecycle`; close/minimize UI does not stop a service.
- `Desktop presence != app loaded`.
- Application identity and management binding are independent; `REGISTERED != MANAGED`, `OBSERVED != OWNED`, `ADOPTED != CREATED_BY_SB`.
- Management authority revision and effect identity are orthogonal; UI/window/session lifecycle cannot cancel, complete or reidentify management effects.
- Restored layout/content cannot imply restored currentness/authority.

## Evidence classes and portable lessons

### E1 — Visual Studio Code activation model

VS Code extensions declare contributions independently from activation. Activation events such as opening a view, invoking a command, restoring a webview/custom editor or requesting authentication can lazily activate code only when needed. The extension host is explicitly used to isolate extension work from startup/UI performance.

Portable lesson: discoverability/contribution metadata can be available before implementation code is resident. `REGISTERED/CONTRIBUTED != LOADED/ACTIVATED`.

### E2 — browser/page lifecycle

Web/browser contexts can become hidden, frozen, discarded or restored for resource reasons. Background state can throttle execution, and restored content/connections may require requalification.

Portable lesson: browser resource residency is an implementation/runtime hint, not System Builder application semantic state or service health.

### E3 — desktop/UWP lifecycle contrast

Windows lifecycle documentation provides a useful counterexample: different application models have different suspension semantics. UWP can suspend and later terminate under resource pressure; current Windows App SDK desktop apps do not expose the same automatic suspended state. UWP guidance also requires stale content/network/device resources to be reacquired/revalidated on resume.

Portable lesson: the SB shell must define its own application-residency contract instead of inheriting a platform-specific lifecycle vocabulary by analogy.

### E4 — existing G4 application-management research

G4 already separates application identity, registration, management binding, deployment, credential binding, authority revision and in-flight effects. The Web Desktop Application Registry must consume those distinctions rather than create a second management authority.

## Finding 1 — Application Registry is a catalog/launch/lifecycle projection, not semantic authority

Candidate registry identity:

```text
ApplicationRegistryEntry {
  applicationId
  applicationDefinitionRef
  version/ref
  displayMetadataRef
  desktopSphereHints[]
  contributionManifestRef
  activationPolicyRef
  resourcePolicyRef
  requiredContextClaims[]
  recoveryContractRef
  compatibilityEvidenceRef?
}
```

The Registry may answer what applications are known and what shell contributions they declare. It must not infer deployment, management authority, runtime health or permission merely from presence.

```text
REGISTRY_ENTRY != INSTALLED_RUNTIME
REGISTRY_ENTRY != MODULE_ACTIVATION
REGISTRY_ENTRY != DEPLOYMENT
REGISTRY_ENTRY != MANAGEMENT_BINDING
REGISTRY_ENTRY != PERMISSION
REGISTRY_ENTRY != APPLICATION_LOADED
```

## Finding 2 — one linear application state is insufficient

The candidate model is a product of independent dimensions rather than one enum.

### Availability / adoption disposition

```text
UNKNOWN_TO_REGISTRY
AVAILABLE
ADOPTED/REGISTERED
UNAVAILABLE
RETIRED
```

`AVAILABLE` means the Builder can identify an application definition/contribution candidate. `ADOPTED/REGISTERED` means a relationship exists in the relevant Client/Workspace scope; it does not imply load, runtime deployment or management authority.

### Visibility / entitlement disposition

```text
VISIBLE
HIDDEN_BY_POLICY
NOT_ENTITLED
PERMISSION_UNKNOWN
PERMISSION_STALE
```

`HIDDEN_BY_POLICY` is not equivalent to unauthorized execution; shell discoverability and command admission remain separate policy surfaces.

### Compatibility / loadability disposition

```text
LOADABLE
INCOMPATIBLE
DEPENDENCY_UNAVAILABLE
LOADABILITY_UNKNOWN
LOADABILITY_STALE
```

Loadability evidence is version/environment/context qualified. A previously loadable application is not indefinitely loadable.

### Residency disposition

```text
NOT_RESIDENT
LOADING
HOT
WARM/BACKGROUND
SUSPENDED
EVICTED
RESTORING
LOAD_FAILED
```

These are shell resource-residency candidates. They say nothing about external service/runtime state.

### Window presence disposition

```text
NO_WINDOWS
WINDOWS_PRESENT
WINDOWS_HIDDEN/MINIMIZED
```

An application may be resident without a visible window, and windows may exist while content is still restoring.

### Recovery disposition

```text
NO_RECOVERY_NEEDED
CHECKPOINT_AVAILABLE
REQUALIFICATION_REQUIRED
RECOVERING
RECOVERY_DEGRADED
RECOVERY_BLOCKED
```

These dimensions intentionally compose. Example: `ADOPTED + VISIBLE + LOADABLE + EVICTED + NO_WINDOWS + CHECKPOINT_AVAILABLE` is valid.

## Finding 3 — registration/contribution must precede code residency where possible

Shell startup should be able to render launchers, Command Registry metadata, Desktop Sphere membership hints and restore candidates from lightweight declarative registry data without loading every application implementation.

Candidate grammar:

```text
DISCOVER REGISTRY METADATA
 -> QUALIFY CLIENT/WORKSPACE VISIBILITY
 -> PROJECT LAUNCH/CONTRIBUTIONS
 -> ACTIVATION TRIGGER
 -> REQUALIFY LOADABILITY/PERMISSION/CONTEXT
 -> LOAD
 -> INITIALIZE
 -> READY | DEGRADED | LOAD_FAILED
```

Activation triggers may include explicit launch, restore of a prior window, command invocation, deep link, opening a supported semantic object/view, or an explicitly declared background need.

```text
DESKTOP PRESENCE != APP LOADED
COMMAND DISCOVERABLE != APP RESIDENT
RESTORE CANDIDATE != APP ACTIVATED
ACTIVATION TRIGGER != EXECUTION AUTHORITY
```

Avoid a universal eager-start event analogous to `*` activation unless a specific application contract proves it necessary; startup breadth should remain bounded.

## Finding 4 — activation is scoped and requalified

Candidate `ApplicationActivationContext`:

```text
clientRef
workspaceRef
desktopSphereRef?
applicationId
requestedWindowRole/viewRef?
semanticObjectRef?
revisionRef?
environmentRef?
invokingCommandRef?
permissionEvidenceRef
currentnessEvidenceRef
recoveryRef?
```

An activation captured in Client A cannot silently complete after the user has switched to Client B. The resulting window either remains explicitly bound to A, is cancelled/requalified, or becomes a safe degraded/recovery surface.

```text
ACTIVATION_STARTED != ACTIVATION_STILL_ADMISSIBLE
LOAD_COMPLETE != CONTEXT_CURRENT
CODE_LOADED != WINDOW_SAFE_TO_RESTORE
```

## Finding 5 — suspend/hibernate/evict are resource policies, not business lifecycle

Candidate meanings:

- `WARM/BACKGROUND`: code/state resident, no foreground interaction required; expensive rendering/refresh may be reduced.
- `SUSPENDED`: application-owned active UI work is quiesced and reconstructible resources may be released; shell keeps identity/checkpoint.
- `EVICTED`: implementation residency is released; durable/recoverable state needed for reconstruction remains referenced.
- `RESTORING`: residency is being rebuilt and semantic context is being requalified.

Hard guards against suspension/eviction include unresolved local state that lacks a durable checkpoint, non-reconstructible resource ownership, admission-critical local interaction, or an application-declared bounded residency requirement. Pending/unknown external effects do not require the originating application to stay loaded if their durable effect lineage has been transferred to Status/Activity / effect tracking.

```text
SUSPENDED != CLOSED
EVICTED != UNREGISTERED
EVICTED != FORGOTTEN
APP EVICTED != SERVICE STOPPED
APP RESUMED != SERVICE CURRENT
PENDING EFFECT != KEEP WINDOW ALIVE FOREVER
```

## Finding 6 — recovery rehydrates identity before expensive content

Candidate restore sequence:

```text
REGISTRY_ENTRY_RESOLVED
 -> APPLICATION_VERSION_QUALIFIED
 -> CLIENT/WORKSPACE_REQUALIFIED
 -> PERMISSION/CURRENTNESS_REQUALIFIED
 -> SHELL/WINDOW_SKELETON_RESTORED
 -> APP_RESIDENCY_RESTORED
 -> VIEW/DRAFT CONTENT REHYDRATED
 -> EFFECT REFERENCES REATTACHED
 -> READY | DEGRADED | RECOVERY_BLOCKED
```

This allows fast structural recovery without lying about semantic readiness. If the application is no longer available/compatible/authorized, the shell should retain a recovery representation for drafts/effect references where safe instead of silently deleting the window/session evidence.

```text
LAYOUT RESTORED != APP READY
APP READY != DATA CURRENT
CHECKPOINT FOUND != CHECKPOINT ADMISSIBLE
OLD APP VERSION AVAILABLE != OLD VERSION SECURITY-ADMISSIBLE
```

## Finding 7 — Application Registry and taskbar/window registry are different indexes

The Application Registry indexes application definitions/contributions. The Window Registry indexes live/recoverable window identities. Taskbar/open-window UI is a projection over the latter plus application metadata.

```text
APPLICATION REGISTRY != WINDOW REGISTRY
ONE APPLICATION != ONE WINDOW
NO WINDOW != APPLICATION UNAVAILABLE
WINDOW COUNT != RUNTIME INSTANCE COUNT
TASKBAR ITEM != PROCESS
```

This preserves multi-window applications and prevents taskbar semantics from becoming lifecycle authority.

## Finding 8 — Desktop Sphere classification is many-to-many and non-authoritative

An application may participate in multiple Desktop Spheres, and a sphere may project many applications. Classification can be role/context dependent. Therefore the current candidate spheres remain navigation/discovery hypotheses rather than ownership boundaries.

```text
DESKTOP SPHERE MEMBERSHIP != APPLICATION OWNERSHIP
SPHERE SWITCH != APP SUSPEND
SPHERE SWITCH != WORKSPACE SWITCH
APP IN MULTIPLE SPHERES != DUPLICATE APP IDENTITY
```

The shell may deprioritize rendering/background work for applications not visible in the active sphere, but may not infer runtime/service stop or permission changes.

## Finding 9 — failure taxonomy must distinguish registry, load, initialization and semantic context

Candidate failure dispositions:

```text
REGISTRY_RESOLUTION_FAILED
VERSION_UNAVAILABLE
INCOMPATIBLE
DEPENDENCY_UNAVAILABLE
LOAD_FAILED
INITIALIZATION_FAILED
CONTEXT_REQUALIFICATION_FAILED
PERMISSION_DENIED
PERMISSION_UNKNOWN
RECOVERY_FAILED
CONTENT_FAILED
```

A generic `APP_FAILED` badge loses remediation information and can falsely imply runtime failure. Retry semantics depend on the failed boundary; retrying a code chunk load is not the same as retrying a canonical command or external effect.

```text
APP LOAD FAILED != RUNTIME FAILED
RETRY LOAD != RETRY EFFECT
PERMISSION DENIED != LOAD ERROR
DEPENDENCY UNAVAILABLE != INCOMPATIBLE
```

## Finding 10 — componentization impact

### primitive / atomic — shared

- `ApplicationIdentityRef`
- `ApplicationResidencyIndicator`
- `ApplicationLoadabilityIndicator`
- `ApplicationVisibilityIndicator`
- `ApplicationRecoveryIndicator`
- `ApplicationFailureReason`
- `ActivationTriggerRef`

### compound — shared

- `ApplicationLauncherItem`
- `ApplicationStatusSummary`
- `ApplicationRecoverySummary`
- `ApplicationLoadFailureBanner`
- `ApplicationWindowCountSummary`
- `ApplicationContributionSummary`

### module component / tool — shared shell infrastructure

- `ApplicationRegistry`
- `ApplicationContributionIndex`
- `ApplicationActivationCoordinator`
- `ApplicationResidencyManager`
- `ApplicationRecoveryCoordinator`
- `ApplicationCompatibilityInspector`
- `ApplicationResourcePressureInspector`

### application/window

- launcher/catalog application view;
- application-specific windows remain specialized projections consuming shared shell contracts;
- a recovery window may exist even when the original application cannot currently load.

### desktop/workspace/system view

- Desktop Sphere launcher projections;
- Taskbar/Open Window Registry;
- workspace recovery overview;
- system-wide application/resource pressure overview.

`composedOf/usedBy` direction:

```text
ApplicationLauncherItem
  composedOf identity + visibility + loadability + recovery indicators
  usedBy Builder Home / Desktop Sphere launcher / search

ApplicationActivationCoordinator
  uses ApplicationRegistry + Command/Permission/Currentness qualification
  usedBy launcher / deep link / restore / command activation

ApplicationResidencyManager
  uses WindowRegistry + checkpoint/recovery + resource policy
  usedBy Web Desktop shell; does not own runtime/service lifecycle
```

## State ownership boundaries

- Registry owns shell registration/contribution metadata only.
- Permission/authorization subsystem owns permission evidence.
- Workspace/session recovery owns checkpoint lineage.
- Window Manager owns window presentation/lifecycle.
- Application Residency Manager owns shell resource-residency decisions.
- Command Registry owns command projection/admission semantics at its declared boundary.
- Application management/control-plane domains own management authority/effects.
- Runtime/service observation owns observed/effective service state.

No component may infer another owner's state from visual presence.

## Accessibility obligations

1. Every launcher/status state has textual semantics; color/icon alone is insufficient.
2. Lazy activation cannot steal focus before the requested window/view is ready; loading state has an accessible name/status.
3. A failed activation returns focus to a safe invoker/logical successor and exposes remediation.
4. Keyboard/search/launcher/deep-link activation must converge on the same activation contract.
5. Small-screen projection may serialize windows/app surfaces but must preserve application/window identity and recovery access.
6. Suspended/evicted applications remain discoverable where policy permits; resource state is not represented as permission denial.
7. High app/window counts require searchable/filterable list/table alternatives to spatial/taskbar-only navigation.

## Performance / resource bounds

Research target: registry/catalog metadata should scale substantially beyond the number of simultaneously resident applications. The shell must not instantiate every registered application to answer launcher/search/status questions.

For high app/window count:

- index lightweight contribution metadata;
- lazy-load application code/content on qualified activation;
- keep taskbar/window summaries independent of app residency;
- virtualize launcher/window/recovery lists;
- suspend/evict based on measured resource pressure and reconstructibility, not simply elapsed time;
- coalesce background refresh where semantics allow;
- revalidate stale connections/content on resume;
- preserve semantic ledgers/effect refs outside evictable presentation code.

`RESOURCE PRESSURE -> DEGRADE RESIDENCY/REPRESENTATION, NOT SILENTLY DROP SEMANTIC STATE`.

## Mandatory scenarios / adversarials

1. Cold open with 200 registered applications but only shell/launcher metadata resident.
2. User launches an app; Client/Workspace changes before load completes.
3. App has three windows; closing all windows does not unregister or stop its external service.
4. App is suspended with a recoverable dirty draft; resume requalifies revision/environment before edit continues.
5. App is evicted while an external effect remains `PENDING`; Status/Activity retains effect lineage.
6. App code load fails while runtime/service remains healthy.
7. Permission is revoked while app is suspended; resume yields read-only/denied/recovery path rather than restored mutation authority.
8. Registry metadata says app exists but its compatible implementation version is unavailable.
9. Browser refresh/crash restores a window skeleton before expensive app code and then requalifies content.
10. Desktop Sphere switch changes projection but does not suspend/stop apps by semantic implication.
11. 100 open/recoverable windows across many apps remain searchable and keyboard navigable.
12. Small screen serializes surfaces without converting SB Window into browser tab semantics.
13. A background app receives stale network/content state; resume explicitly refreshes/requalifies it.
14. A recovery checkpoint references an application version retired for security; content remains recoverable where safe without silently loading the retired implementation.
15. An app is `HIDDEN_BY_POLICY` in launcher but an existing recoverable window remains visible as a policy-qualified recovery surface.
16. Application management authority transfers while its UI is evicted; effect/authority lineage remains intact outside presentation residency.

## Proof obligations

PO-AR-01. Registry presence never proves load, deployment, runtime health, management authority or permission.

PO-AR-02. Every activation binds Client/Workspace and requalifies material context before exposing mutable readiness.

PO-AR-03. Application, window and runtime/service lifecycle remain independently representable in every projection.

PO-AR-04. Suspend/evict cannot destroy unreconciled dirty state or the only durable reference to pending/unknown effects.

PO-AR-05. Restoring a checkpoint cannot restore authorization/currentness by implication.

PO-AR-06. App code load failure cannot be rendered as runtime/service failure without independent runtime evidence.

PO-AR-07. Application contributions can be indexed/discovered without eagerly loading every application implementation.

PO-AR-08. A Desktop Sphere switch cannot create management/runtime lifecycle transitions by visual implication.

PO-AR-09. Taskbar/window registry state cannot be used as process/runtime-instance truth.

PO-AR-10. Resume/recovery revalidates stale connections, content, revision/environment and permission evidence where material.

PO-AR-11. Resource-pressure degradation preserves semantic state/effect lineage and reports eviction/suspension rather than silent disappearance.

PO-AR-12. Recovery remains possible when the original application implementation cannot be loaded, to the extent that drafts/evidence are independently serializable and policy-admissible.

PO-AR-13. Keyboard/search/small-screen activation and recovery provide functional equivalence to pointer/taskbar interaction.

PO-AR-14. Failure reasons preserve boundary identity (`load`, `permission`, `context`, `recovery`, `dependency`) and do not collapse to generic `APP_FAILED`.

PO-AR-15. Application identity remains stable across multiple simultaneous windows and Desktop Sphere projections.

PO-AR-16. Management/effect authority survives application UI suspension/eviction without being relabeled, cancelled or completed.

## Deduplication notes

This artifact does not redefine:

- management adoption/authority transition; it consumes `G4_APPLICATION_ADOPTION_AUTHORITY_TRANSITION_RESEARCH.md`;
- in-flight effect settlement; it consumes `G4_APPLICATION_MANAGEMENT_INFLIGHT_EFFECT_HANDOFF_RESEARCH.md`;
- window HOT/WARM/SUSPENDED/EVICTED research; it lifts the resource-residency distinction to application scope while keeping Window Registry independent;
- workspace-session recovery; it adds application-version/loadability qualification only;
- Command Registry; activation triggers are not command admission authority;
- modal/focus ownership; activation/recovery must obey those existing focus rules.

## Maturity / saturation

`WEB_DESKTOP_APPLICATION_REGISTRY_LIFECYCLE = ADVANCED_EMERGING / MATERIAL_DELTA / NON_EXECUTABLE`.

Materially mature principles:

- application registry, application residency, window registry and runtime/service lifecycle are distinct;
- contribution/discovery metadata should be usable without eager application load;
- residency is a resource policy, not business/runtime lifecycle;
- restore is progressive and requalifies context/currentness/permission;
- Desktop Sphere membership is navigation/discovery, not ownership;
- failure taxonomy must preserve the failed boundary.

Open material gaps:

1. application contribution conflicts and precedence across multiple applications (commands, Ribbon groups, inspectors, file/object handlers, deep links);
2. activation storms / thundering-herd containment during workspace restore with many windows/apps;
3. resource budgeting/fairness across applications and surfaces, including foreground/background priority without semantic starvation;
4. lifecycle of application upgrades while old windows/checkpoints remain open;
5. Componentes catalog/playground conformance model for lifecycle, accessibility, recovery and density states.

## Next research vector

Highest-value next vector: **Application Contribution Registry conflict/precedence and activation-storm containment**. Research deterministic contribution identity, collisions, contextual precedence, lazy activation fan-out, restore batching, fairness/backpressure and proof that shell extensibility cannot become hidden semantic authority.
