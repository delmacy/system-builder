# G4 — Web Desktop Application Contribution Registry Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23
Scope: Frontend Design System & UI Foundation / G4 Web Desktop & Application Environment

## Purpose

Bounded P&D into the shell-facing contribution layer that sits between lightweight `ApplicationRegistryEntry` metadata and application residency. This round studies contribution identity, collision/precedence, contextual projection, lazy activation, restore storms, fairness/backpressure and conformance without turning extensibility into semantic authority.

This artifact continues `G4_WEB_DESKTOP_APPLICATION_REGISTRY_LIFECYCLE_RESEARCH.md`. It does not select a plugin framework, freeze Desktop Sphere taxonomy, authorize implementation, or make contribution metadata a source of business truth.

## Repository boundaries reconciled

- `Builder != Runtime`; generated runtimes remain autonomous.
- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `Application Registry != Window Registry`.
- `REGISTRY_ENTRY != APPLICATION_LOADED`.
- `Contribution declared != application resident`.
- `Contribution visible != command applicable/authorized/current`.
- `Shell extension point != semantic ownership`.
- `UI precedence != business authority`.
- `Activation trigger != execution authority`.
- `3D projection != navigation foundation`.

## Evidence classes and portable lessons

### E1 — VS Code declarative contribution points

VS Code extensions declare commands, menus, views, keybindings, custom editors and other contribution points as metadata. Commands have global enablement while individual menu projections have contextual `when` conditions. Invoking a contributed command may trigger lazy activation.

Portable lessons:

1. lightweight contribution discovery can precede code residency;
2. one semantic command identity can have multiple presentation projections;
3. projection visibility and command enablement are different concerns;
4. contribution metadata must not become a second command authority.

### E2 — VS Code Extension Host / lazy activation

VS Code isolates extension work and lazily activates extensions to protect startup and UI responsiveness.

Portable lesson: registered breadth must not imply eager execution breadth. A shell with hundreds of applications needs a bounded activation coordinator rather than `restore everything now`.

### E3 — browser prioritized scheduling / yielding

The browser Prioritized Task Scheduling model distinguishes user-blocking, user-visible and background work, supports cancellation, and allows long tasks to yield. The API itself is not universally available and therefore is evidence for scheduling grammar, not a required provider.

Portable lesson: shell activation work should have explicit urgency, cancellation and cooperative yielding semantics. A particular browser scheduling API is not architectural authority.

### E4 — browser long-task evidence

Main-thread work at or above roughly 50 ms is classified by the Long Tasks API as long-running UI work and is associated with delayed interaction and jank.

Portable lesson: contribution resolution/activation cannot monopolize the shell thread during cold open or mass restore. Measurement is required; the 50 ms API threshold is an observability signal, not an SB SLA by itself.

## Finding 1 — Contribution Registry is an index of declared shell participation

Candidate lightweight record:

```text
ApplicationContributionManifest {
  applicationId
  applicationVersionRef
  manifestRevision
  commands[]
  ribbonContributions[]
  menuContributions[]
  inspectorContributions[]
  toolContributions[]
  objectHandlers[]
  viewFactories[]
  deepLinkHandlers[]
  statusActivityContributions[]
  desktopSphereHints[]
  activationTriggers[]
  orderingHints[]
  compatibilityEvidenceRef?
}
```

The manifest describes candidate shell participation. It does not prove permission, applicability, compatibility, currentness, runtime health or business authority.

```text
CONTRIBUTION_DECLARED != CONTRIBUTION_ADMISSIBLE
CONTRIBUTION_ADMISSIBLE != CONTRIBUTION_VISIBLE
CONTRIBUTION_VISIBLE != COMMAND_EXECUTABLE
CONTRIBUTION_SELECTED != BUSINESS_AUTHORITY_SELECTED
```

## Finding 2 — contribution identity and projection identity must be separate

A command may appear in Ribbon, Command Palette, context menu, Inspector and small-screen action surfaces while remaining one `commandId`. Conversely, two applications may declare contributions for the same shell slot without sharing command identity.

Candidate identities:

```text
ContributionIdentity = applicationId + contributionLocalId + manifestRevision
ProjectionIdentity   = contributionIdentity + projectionSurface + projectionSlot
SemanticCommandRef   = commandId
```

`ProjectionIdentity` is disposable/reconstructible UI identity. `commandId` is resolved through the Command Registry contract and cannot be redefined by a menu placement.

```text
SAME_SLOT != SAME_COMMAND
SAME_LABEL != SAME_COMMAND
SAME_SHORTCUT != SAME_COMMAND
SAME_OBJECT_KIND != SAME_HANDLER_AUTHORITY
```

## Finding 3 — collisions are typed, not one generic conflict

Candidate conflict classes:

```text
IDENTITY_COLLISION
SLOT_COLLISION
ORDERING_COLLISION
SHORTCUT_COLLISION
DEFAULT_HANDLER_COLLISION
DEEP_LINK_COLLISION
EXCLUSIVE_ROLE_COLLISION
CONTEXT_OVERLAP
DEPENDENCY_CYCLE
```

These have different safe outcomes. Multiple commands in one menu slot can often coexist; two defaults for the same semantic object/deep-link namespace may require explicit disambiguation; an exact contribution identity collision is invalid.

No generic `last registered wins` rule is acceptable for material conflicts.

```text
LAST_REGISTERED != MOST_AUTHORIZED
INSTALL_ORDER != SEMANTIC_PRECEDENCE
VISUAL_ORDER != AUTHORITY_ORDER
MOST_SPECIFIC_CONTEXT != AUTOMATICALLY_MOST_TRUSTED
```

## Finding 4 — precedence is projection-scoped and policy-qualified

Candidate resolution dimensions:

```text
ContributionResolutionContext {
  clientRef
  workspaceRef
  desktopSphereRef?
  application/window/view context
  semanticObjectRef?
  revisionRef?
  environmentRef?
  focusRef?
  selectionRef?
  permission/currentness evidence
  projectionSurface
}
```

A resolution result may be:

```text
UNIQUE
COEXIST
ORDERED
USER_CHOICE_REQUIRED
POLICY_CHOICE_REQUIRED
AMBIGUOUS
BLOCKED
UNKNOWN
STALE
```

Ordering hints may determine display order only. They cannot authorize a command, assign ownership of an object or suppress a semantically required alternative without an explicit policy.

## Finding 5 — object/deep-link handlers require explicit multiplicity semantics

Handlers need declared cardinality rather than implicit ownership:

```text
AUGMENTING       // many may participate
ALTERNATIVE      // many candidates; explicit choice/resolution
PREFERRED        // default may exist but alternatives remain representable
EXCLUSIVE        // at most one admissible handler for the declared scope
```

A handler selected for convenience does not become canonical owner of the semantic object.

```text
DEFAULT_HANDLER != OBJECT_OWNER
OPENED_BY_APP != OWNED_BY_APP
DEEP_LINK_TARGET != AUTHORITY_TRANSFER
```

## Finding 6 — activation trigger resolution is a scheduling request, not immediate load

Candidate grammar:

```text
TRIGGER_OBSERVED
 -> CONTRIBUTIONS_MATCHED
 -> CONTEXT_REQUALIFIED
 -> ACTIVATION_INTENT_CREATED
 -> SCHEDULING_CLASS_ASSIGNED
 -> QUEUED
 -> ADMITTED_TO_LOAD
 -> LOADING
 -> READY | DEGRADED | FAILED | CANCELLED
```

Candidate urgency classes:

```text
INTERACTION_BLOCKING
FOREGROUND_VISIBLE
RECOVERY_VISIBLE
BACKGROUND_REQUIRED
PREFETCH_SPECULATIVE
```

These are shell scheduling classes, not business priority or architectural criticality.

```text
UI_URGENCY != BUSINESS_CRITICALITY
QUEUED != LOADING
LOADING != READY
ACTIVATED != AUTHORIZED
```

## Finding 7 — activation storms require bounded concurrency, fairness and backpressure

Cold open or restore may produce hundreds of triggers: windows, inspectors, command providers, deep links and background contributions. Eager parallel activation can cause CPU, memory, network and main-thread contention.

Candidate coordinator obligations:

- bounded concurrent loads rather than unbounded `Promise.all`;
- prioritize the active/visible interaction path;
- preserve progress for background/recovery work through aging/fairness;
- coalesce duplicate activation intents for the same compatible application/context;
- cancel speculative work made irrelevant by Client/Workspace/revision switch;
- yield between expensive main-thread phases;
- apply per-application and global resource budgets;
- expose queue/backpressure state rather than pretending every app is loading;
- prevent one failing/slow application from blocking unrelated applications.

```text
MANY_TRIGGERS != MANY_LOADS
SAME_APP_TRIGGERED_N_TIMES != N_APP_INSTANCES
BACKGROUND != STARVABLE_FOREVER
USER_VISIBLE != UNBOUNDED_CONCURRENCY
CANCELLED_ACTIVATION != APPLICATION_FAILURE
QUEUE_DELAY != LOAD_FAILURE
```

## Finding 8 — deduplication/coalescing is context-qualified

Two triggers may share one in-flight load only if their residency/version/context requirements are compatible. A Client A restore and Client B launch cannot be merged merely because they reference the same `applicationId`.

Candidate activation key:

```text
applicationId
+ applicationVersionRef
+ residencyRealm
+ security/compatibility profile
+ context partition when application contract requires it
```

Window/view creation remains separate after residency is ready.

```text
COALESCED_LOAD != COALESCED_WINDOW
SAME_APPLICATION_ID != SAME_ACTIVATION_CONTEXT
SHARED_CODE_RESIDENCY != SHARED_CLIENT_STATE
```

## Finding 9 — restore should be demand-shaped, not geometry-shaped

A saved desktop containing 40 windows must not require all 40 application contents to become HOT before the shell is usable.

Candidate progressive restore:

```text
RESTORE REGISTRY + WINDOW IDENTITIES
 -> RENDER LIGHTWEIGHT SHELL SKELETONS
 -> ACTIVATE FOCUSED/VISIBLE PATH
 -> ACTIVATE NEAR-TERM USER-VISIBLE PATH
 -> DEFER MINIMIZED/OCCLUDED CONTENT
 -> REHYDRATE BACKGROUND/RECOVERY WORK UNDER BUDGET
```

Layout/window identity can restore ahead of application content. Dirty/recovery obligations may increase activation urgency but do not authorize semantic mutation.

```text
WINDOW_SKELETON_PRESENT != APP_READY
MINIMIZED != FORGOTTEN
OCCLUDED != SAFE_TO_DISCARD_DIRTY_STATE
RESTORE_ORDER != Z_ORDER_ONLY
```

## Finding 10 — contribution failure must degrade locally

Candidate dispositions:

```text
MANIFEST_INVALID
CONTRIBUTION_CONFLICTED
CONTRIBUTION_QUARANTINED
ACTIVATION_TIMEOUT
ACTIVATION_FAILED
PARTIAL_CONTRIBUTION_AVAILABLE
```

A broken Inspector contribution should not necessarily remove an otherwise usable application command set. Failure containment should be contribution/application scoped unless a declared hard dependency proves broader impact.

```text
ONE_CONTRIBUTION_FAILED != APPLICATION_UNAVAILABLE
ONE_APPLICATION_FAILED != DESKTOP_FAILED
CONTRIBUTION_QUARANTINED != BUSINESS_OBJECT_INVALID
```

## Finding 11 — shell contributions need provenance and explainability

Every projected contribution should be traceable to its `applicationId`, version/manifest revision, contribution identity, resolution context and relevant policy decision. This supports debugging, accessibility explanations and Componentes conformance.

For collisions/hidden/unavailable items, diagnostics should distinguish `NOT_APPLICABLE`, `NOT_ENTITLED`, `CONFLICTED`, `STALE`, `UNKNOWN`, `LOAD_FAILED` and `QUARANTINED` rather than collapse them into disabled/absent.

## Finding 12 — accessibility is part of contribution conformance

A contribution contract cannot assume pointer placement or a wide Ribbon. Every user-facing command/tool contribution needs an accessible name, keyboard reachability through an appropriate projection, focus behavior, unavailable reason where material, and a compact/small-screen projection strategy when the function remains applicable.

Shortcut collisions must never make the command keyboard-inaccessible: Command Palette/menu/list alternatives remain necessary. Drag-only ordering or docking is not sufficient.

## Finding 13 — performance bounds are measured at shell boundaries

Research target scenarios:

- NORMAL: 50–200 registered applications/contribution manifests with a modest visible subset;
- STRESS: ~1000 registered contribution manifests and high contribution counts, while only a bounded working set is resident;
- restore: tens of saved windows across several applications without requiring eager full-content activation;
- conflict-heavy: hundreds of contextual contributions resolving against one selection without blocking interaction.

Candidate proof metrics include registry parse/index time, contextual resolution latency, activation queue delay by urgency class, time-to-focused-window-interactive, main-thread long tasks, memory per resident app, cancelled speculative work and starvation age. Exact budgets remain empirical research outputs, not frozen values.

Large registries degrade through indexing, filtering, virtualization and bounded activation — never silent omission of contributions.

## Componentization impact

### Primitive / atomic

- `ContributionProvenanceIndicator`
- `ContributionConflictIndicator`
- `ActivationQueueIndicator`
- `ActivationUrgencyIndicator`
- `ContributionAvailabilityIndicator`

Shared semantics; no authority ownership.

### Compound

- `ContributionConflictSummary`
- `ContributionCandidateList`
- `ActivationQueueItem`
- `ApplicationContributionSummary`
- `HandlerChoiceSurface`
- `ContributionFailureBanner`

### Module component / tool

- `ApplicationContributionRegistry`
- `ContributionContextResolver`
- `ContributionConflictResolver`
- `ContributionProvenanceInspector`
- `ActivationCoordinator`
- `ActivationBudgetController`
- `ActivationDiagnostics`
- `ContributionConformanceInspector`

### Application/window/desktop/workspace/system view

- Applications declare manifests but do not own the global registry.
- Windows consume resolved projections for their current context.
- Desktop shell projects shared Ribbon/Tool Rail/Status/Activity contributions.
- Workspace scopes policy/currentness and recovery context.
- System views may aggregate contribution health/provenance without becoming semantic authority.

## State ownership

```text
Application definition -> declares contribution intent
ApplicationContributionRegistry -> indexes manifests/provenance
ContributionContextResolver -> derives contextual candidate set
Policy/Command authorities -> own authorization/currentness/applicability facts
ContributionConflictResolver -> derives projection disposition
ActivationCoordinator -> owns shell scheduling/queue disposition
Application residency manager -> owns shell residency disposition
Window Manager -> owns window identities/layout/presentation
```

No one of these owners may silently absorb the others.

## Failure/recovery findings

1. Manifest parse failure preserves application identity and surfaces diagnostics.
2. Conflict resolution failure yields `AMBIGUOUS/UNKNOWN`, not arbitrary winner.
3. Activation queue survives window churn only for still-relevant intents.
4. Client/Workspace/revision switch invalidates or requalifies queued intents.
5. Crash recovery reconstructs queue from durable recovery obligations, not from stale transient scheduling order.
6. Pending/unknown external effects remain in effect tracking even if their originating contribution/app is evicted.
7. Activation failure does not convert permission/currentness to failure; those dimensions remain distinct.

## Adversarial scenarios

1. Two apps register the same human label and shortcut for different commands.
2. Two apps both claim preferred handler for one semantic object kind.
3. A deep link matches two handlers with overlapping context predicates.
4. A contribution becomes unauthorized while its menu is open.
5. 40 saved windows restore after crash across 15 apps.
6. 200 activation triggers fire during cold open.
7. One app takes seconds to initialize while another is interaction-blocking.
8. Background activation is repeatedly preempted by foreground work.
9. Client switch occurs while ten activations are queued.
10. Same app receives launch, restore and command triggers concurrently.
11. One Inspector contribution fails while the app's commands remain valid.
12. Contribution manifest is current but app binary/version becomes incompatible.
13. Shortcut collision exists but user navigates entirely by keyboard.
14. Small-screen mode has no Ribbon yet every applicable command remains reachable.
15. A speculative prefetch is cancelled and must not appear as app failure.
16. 1000 manifests exist but only a small working set is resident.
17. Ordering hint attempts to hide a semantically required alternative.
18. A stale conflict-resolution cache would choose a handler no longer authorized.

## Proof obligations

- **PO-ACR-01 Identity:** contribution/projection/command identities cannot alias accidentally.
- **PO-ACR-02 No arbitrary winner:** material collisions never resolve by registration/install timing alone.
- **PO-ACR-03 Authority separation:** projection precedence cannot grant command/business authority.
- **PO-ACR-04 Lazy breadth:** registered contribution breadth does not force eager code residency.
- **PO-ACR-05 Context safety:** queued activation cannot complete into a silently changed Client/Workspace/revision/environment context.
- **PO-ACR-06 Bounded concurrency:** activation storms have an explicit global/per-app concurrency bound.
- **PO-ACR-07 Fairness:** background/recovery work cannot starve indefinitely absent explicit policy.
- **PO-ACR-08 Coalescing safety:** only context-compatible activation intents share a load.
- **PO-ACR-09 Local failure containment:** one failed contribution/app does not falsely fail unrelated shell/application state.
- **PO-ACR-10 Progressive restore:** shell/focused path can become interactive without loading every restored window.
- **PO-ACR-11 Accessibility:** every applicable user-facing contribution has a non-drag, keyboard-operable projection and collision-safe discovery path.
- **PO-ACR-12 Small screen:** functional reachability survives Ribbon removal/compaction.
- **PO-ACR-13 Provenance:** every resolved contribution can explain source manifest/version/context/policy disposition.
- **PO-ACR-14 No silent omission:** registry scaling may aggregate/filter/virtualize but material contributions/conflicts remain discoverable.
- **PO-ACR-15 Scheduling observability:** queue delay, activation duration, cancellation and long-task evidence are measurable without turning telemetry into authority.
- **PO-ACR-16 Recovery:** crash/refresh does not restore stale transient scheduling decisions as current semantic decisions.

## Componentes catalog/playground implications

The catalog/state lab should be able to exercise at least:

- one contribution across Ribbon/Palette/context menu/small-screen projections;
- visibility versus applicability/authorization/currentness independently;
- every collision class and resolution disposition;
- keyboard shortcut conflict and alternate discovery;
- activation queued/loading/cancelled/failed/ready states;
- slow/failing contribution isolation;
- 200-trigger activation storm with bounded visible progress;
- 1000-manifest registry indexing/virtualization;
- Client/Workspace switch while activation is queued;
- stale/unknown policy evidence;
- progressive restore with many window skeletons and few resident apps.

The playground is qualification evidence only: `CATALOG_PASS != PRODUCT_CONFORMANCE_PROVEN`.

## Deduplication notes

- Reuses the Application Registry lifecycle's separation of registry, residency, windows and recovery; does not redefine those states.
- Reuses Command Registry semantics for applicability/authority/currentness/execution; contribution metadata only points to command identity/projections.
- Reuses Window/Workspace recovery semantics; this artifact only adds activation scheduling implications.
- Reuses modal/focus and undo/effect boundaries; contribution failure cannot rewrite those lifecycles.
- Adds material detail specifically for contribution collisions/precedence, activation-storm containment, coalescing, fairness/backpressure and contribution conformance.

## Maturity and remaining gaps

Maturity: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

Material gaps remain before implementation planning:

1. formal Componentes catalog/playground conformance model: fixture/state matrix, interaction contracts, accessibility/performance qualification and proof-evidence retention;
2. delegated Client access / tenant-context transition grammar at Builder Home and Workspace boundaries;
3. Desktop Sphere evidence: whether the candidate taxonomy improves task locality without becoming an ownership hierarchy;
4. high-window-count Window Registry/taskbar search/grouping/virtualization and accessible switching;
5. empirical performance budgets for contribution resolution and activation under NORMAL/STRESS loads.

## Next research vector

Highest-value next vector: **Componentes catalog/playground conformance model** — define reusable component contract fixtures, state/transition coverage, accessibility and performance evidence, shared-vs-specialized composition rules, failure injection and proof obligations across primitive -> compound -> module component -> tool -> application -> window -> desktop -> workspace -> system view.
