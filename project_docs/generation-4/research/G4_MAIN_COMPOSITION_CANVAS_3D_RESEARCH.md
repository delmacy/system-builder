# G4 — Main Composition Canvas 3D, Towers, Floors, Hubs & Deployment Topology Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Authority: research only; no product implementation authority
Branch: `research/g4-product-rnd-foundations`

## Purpose

This artifact consolidates the current Generation 4 research direction for the System Builder main composition interface. It is a semantic engineering workspace hypothesis, not decorative 3D and not canonical authority.

The shell remains accessible React/DOM around a specialized WorkSurface. 2D Composition, semantic 3D Building/Onion, Floor, Capability, Relation Graph, Workflow, Corridor/Handoff, Deployment/Topology, Infrastructure, Observability and Evidence/Audit are peer projections of the same semantic substrate.

## Stable invariants

- `3D semantic != 3D decorative`.
- `Canvas / View / Map != Canonical Model`.
- `Semantic identity survives projection changes`.
- `Module Identity != Deployment Placement != Runtime Instance != Render Instance`.
- `Capability participation != semantic ownership`.
- `Horizontal composition != vertical manifestation`.
- `Visual connectability != semantic compatibility`.
- `Visual proximity != deployment merge`.
- `Visual similarity != semantic equivalence`.
- `Arrange != Group != Deploy`.
- `Desired != Observed != Effective`.
- `Transport != Contract`.
- `Aggregation != silent omission`.
- `ACK != effect`.
- `3D mode != mandatory interaction mode`.

## Spatial and semantic grammar

The 3D hypothesis uses X for horizontal module/context composition, Y for typed floors/spheres and Z/radial depth for module-internal semantic depth. Global floors remain distinct from module-internal onion layers. Capability shafts express cross-cutting participation, not ownership. Hubs are structural interconnections; flows are movement; corridors project expected/allowed progression.

A module may appear as a flexible-height tower across floors. Each module-floor intersection is a manifestation, not a duplicate module. A manifestation may expose a partial internal onion containing core/domain state, services/use cases/orchestration, contracts/ports/input-output and provider/binding/adapter/gateway realization where applicable.

`+ horizontal` proposes a qualified relation/composition. `+ vertical` proposes or exposes another floor manifestation only when cardinality and eligibility permit it. Geometry never proves cardinality or compatibility.

## Access and circulation grammar

```text
Capability = what must be possible
Contract = guarantees/requirements
Port / Door = where a contract is exposed/admitted
Counter = operation/service/action entry surface
Input/Output = what crosses the boundary
Provider/Binding = selected realization source
Adapter/Driver/Gateway = concrete translation/realization
```

`Contract != physical access point`.

Designed and observed progression remain separate. Downstream state never proves an upstream required gate passed. Bypass requires explicit authority/evidence. Acceptance, ACK, execution and effective outcome remain separately representable.

## Module Workbox

Selecting a module can reveal a contextual Module Workbox with applicable faces such as Overview, Capabilities/Services, Entry Points/Counters, Contracts/Ports, Dependencies/Relations, Providers/Bindings, Adapters/Drivers, Plugins/Extensions, Configuration, Data, Events/Workflow, Security/Authority, Runtime/Deployment, Observability and Evidence/History. Face applicability is semantic and contextual; permission-limited is not the same as non-applicable.

## Deployment basements and towers

Servers/hosts may be projected as deployment foundations/basements from which deployment towers emerge. A basement split/reveal may show CPU, memory, runtime, network, storage, region/zone, deployment unit, health/capacity and placement evidence. These are infrastructure/deployment facts, not ownership of the logical module.

The same logical module/service can have multiple deployment manifestations and runtime instances. A runtime restart can replace instance identity while preserving logical module/service identity and possibly deployment-manifestation lineage.

## Availability and stateful grouping

Availability grouping is policy-relative, not visual-symmetry-relative. Stateless replicas, stateful members, quorum groups and shard groups remain distinct. Stateful members may carry stable member/storage identity, role, epoch/generation, voting eligibility, quorum evidence, write authority, read admissibility, replication progress, shard ownership, fencing evidence, revision/profile and health as separate dimensions.

Hard rules include:

```text
READY != VOTING
HEALTHY != LEADER
LEADER_LABEL != CURRENT_WRITE_AUTHORITY
REPLICA_PRESENT != QUORUM
QUORUM != ALL_MEMBERS_CURRENT
SHARD_MEMBERSHIP != SHARD_OWNERSHIP
FAILOVER != SAFE_PROMOTION
```

## Authority transfer, leases and fencing evidence

External distributed-systems evidence adds a stronger contract than the earlier generic promotion sequence. Kubernetes Lease records distinguish holder identity, acquisition/renewal time, lease duration and transition count; leader acquisition is concurrency-qualified rather than inferred from liveness. etcd election ownership is tied to an election key/revision and lease, and its failure documentation shows an election interval in which writes cannot proceed even though a replacement leader may soon emerge.

Portable UI consequence: **authority is an evidence-bearing temporal claim**, not a role label.

Candidate authority evidence vector:

```text
AuthorityEvidence {
  subjectOrPartition
  holderIdentity
  authorityKind
  epochTermGeneration
  leaseOrOwnershipToken
  acquiredAt
  renewedAt
  validUntilOrExpiryBasis
  transitionCounter
  source
  observedAt
  currentness
  fencingDisposition
}
```

The exact fields are provider-dependent; absence is represented as UNKNOWN/NOT_APPLICABLE rather than fabricated.

Candidate authority states:

- `NO_AUTHORITY_OBSERVED`;
- `AUTHORITY_CANDIDATE`;
- `AUTHORITY_ACQUIRING`;
- `AUTHORITY_OBSERVED_UNVERIFIED`;
- `AUTHORITY_EFFECTIVE`;
- `AUTHORITY_EXPIRING`;
- `AUTHORITY_EXPIRED`;
- `AUTHORITY_TRANSFER_PENDING`;
- `AUTHORITY_TRANSFER_GAP`;
- `AUTHORITY_CONFLICT`;
- `AUTHORITY_UNKNOWN`;
- `FENCING_REQUIRED`;
- `FENCING_VERIFIED`.

A safe transfer is therefore not simply `old -> new`:

```text
TRANSFER_DESIRED
-> TRANSFER_ACKNOWLEDGED
-> OLD_AUTHORITY_RELINQUISHING / EXPIRING
-> OLD_AUTHORITY_FENCED_OR_EXPIRED ?
-> NEW_AUTHORITY_ACQUIRED
-> NEW_AUTHORITY_VERIFIED
-> EFFECTIVE_AUTHORITY
```

Depending on protocol, acquisition and old-holder expiry/fencing can be coordinated differently; the UI must preserve the provider evidence rather than force one universal ordering. What is universal is that `ACK`, candidate status, liveness and a displayed leader role are insufficient to prove effective exclusive authority.

### Authority gap is not failure equivalence

etcd documents a leader-election interval during which writes cannot be processed while a new leader is being elected. This motivates a first-class `AUTHORITY_TRANSFER_GAP` / `WRITE_UNAVAILABLE_DURING_ELECTION` representation rather than immediately classifying the system as split brain or generic failure.

```text
no current writer
!= conflicting writers
!= healthy effective writer
```

Read behavior may remain separately admissible according to the declared consistency profile; the UI must not generalize write unavailability to all operations without evidence.

### Fencing is a proof obligation

When a single-writer/owner invariant applies, promotion is not safely effective merely because a new candidate reports leader/owner. The UI needs a fencing disposition for the displaced authority. Candidate dispositions:

- `NOT_REQUIRED_BY_PROTOCOL`;
- `REQUIRED_UNVERIFIED`;
- `VERIFIED_EXPIRED`;
- `VERIFIED_REVOKED`;
- `VERIFIED_TOKEN_SUPERSEDED`;
- `CONFLICTING_EVIDENCE`;
- `UNKNOWN`.

This is intentionally abstract: lease expiry, revision/token supersession, storage fencing or provider-specific mechanisms are realizations, not the semantic contract itself.

### Partition/shard ownership transfer

Shard/partition movement needs two independent axes: **data movement/readiness** and **authority ownership**.

Candidate transfer state machine:

```text
OWNERSHIP_STABLE_OLD
-> TARGET_PREPARING
-> DATA_SYNCING / CATCHING_UP
-> TARGET_READY_FOR_TRANSFER
-> TRANSFER_DESIRED
-> TRANSFER_ACKNOWLEDGED
-> OLD_OWNER_FENCED_OR_OWNERSHIP_REVOKED ?
-> NEW_OWNER_OBSERVED
-> NEW_OWNER_AUTHORITY_VERIFIED
-> OWNERSHIP_EFFECTIVE_NEW
-> OLD_COPY_RETIRABLE
```

Recovery branches include `SYNC_STALLED`, `TARGET_NOT_READY`, `TRANSFER_BLOCKED`, `AUTHORITY_GAP`, `CONFLICTING_OWNERSHIP`, `ROLLBACK_TO_OLD_OWNER`, `RECONCILIATION_REQUIRED` and `UNKNOWN_EFFECT`.

Hard rules:

```text
DATA_COPIED != OWNERSHIP_TRANSFERRED
TARGET_READY != TARGET_AUTHORIZED
TRANSFER_ACK != OWNERSHIP_EFFECTIVE
OLD_COPY_PRESENT != OLD_COPY_AUTHORIZED
NEW_OWNER_LABEL != EXCLUSIVE_OWNERSHIP_PROOF
PARTIAL_REBALANCE != WHOLE_GROUP_SUCCESS
```

For multi-partition rebalance, each partition/shard retains its own transfer disposition. Aggregate success is derived only when the declared batch policy is satisfied; partial completion remains explicit and actionable.

## Rolling coexistence and SharedContractSurface

Mixed revisions can intentionally coexist inside one logical group. A LogicalServiceCrown may remain unified while SharedContractSurface only aggregates the declared common admissible guarantee/profile intersection. Latest member revision is not automatically the group's effective contract. Contract-profile drift must facet/split the surface or produce UNKNOWN/PARTIAL.

## Desired, observed and effective topology

Placement truth remains a vector: desired, observed and effective placement are separate, with evidence/currentness per dimension. Scheduler/provider ACK is not effect evidence; host observation is not necessarily effective business readiness; healthy runtime is not necessarily semantically admissible.

## Drag, accessibility and peer representations

Typed intent precedes semantic action: arrange, group and deploy are distinct. Pointer proximity never chooses intent. Every decision-relevant 3D identity/relation requires a peer non-spatial representation. Focus and selection remain distinct. Drag operations require non-drag pointer and keyboard alternatives. Compatibility, drift, authority and currentness are never color-only.

Authority and ownership transfer peer representations must expose holder/owner identity, partition/shard scope, authority state, currentness, fencing disposition, target readiness and recovery actions without requiring tower position, animation or free-camera control.

## Arrangement, LOD and performance

Topology arrangement changes representation, not identity. Aggregation must preserve selected/focused identity and critical drift/UNKNOWN state. Stateful aggregate LOD must preserve conflicting/unknown authority, quorum loss/unknown, mixed revision/profile, material lag/unknown, shard ownership conflict and fencing-required status. A green aggregate cannot be computed from majority health when a protected invariant is violated.

Preferred rendering research remains simple geometry, selective labels, semantic zoom, instancing, LOD, clustering/aggregation, culling, render-on-demand, label virtualization and workers for heavy layout/analysis before renderer specialization.

## Componentization map and Componentes impact

Existing topology primitives remain, with these additions:

- C3 primitive/semantic records: `AuthorityEvidenceRef`, `FencingDisposition`, `OwnershipTransferState`, `PartitionTransferRef`;
- C4 domain building blocks: `AuthorityBadge`, `AuthorityGapIndicator`, `FencingIndicator`, `PartitionOwnershipIndicator`, `TransferProgressIndicator`;
- C5/C6 module/tool components: `AuthorityEvidenceInspector`, `OwnershipTransferInspector`, `RebalanceBatchInspector`, `FencingProofPanel`;
- C7 Topology WorkSurface overlays: per-partition transfer path and aggregate rebalance disclosure;
- C8+ workspace/task orchestration: transfer review/authorize/operate/audit/recover flows with preserved evidence/currentness.

Componentes scenarios must include: old authority expires before replacement; candidate alive but authority unknown; new authority acquired while old fencing unknown; conflicting holders; transfer ACK without effect; data synced but ownership unchanged; partial rebalance success; rollback to old owner; stale authority evidence; authority gap during election; aggregate LOD containing one conflicting partition; projection switch preserving partition identity and authority evidence.

## Proof obligations

Before these patterns can be considered mature, research/prototype evidence must prove:

1. no role/liveness badge can strengthen UNKNOWN authority into effective authority;
2. authority gap and authority conflict remain visually/semantically distinct in every projection;
3. fencing evidence survives 3D/2D/list/table/topology projection switches;
4. per-partition partial rebalance cannot collapse to whole-group success;
5. LOD aggregation preserves any conflicting/unknown authority or fencing-required member;
6. ACK, observed holder and effective authority remain separately inspectable;
7. recovery/rollback does not erase evidence of the failed transfer attempt;
8. non-spatial users can review and authorize/recover transfers without 3D interaction;
9. stale lease/ownership evidence cannot appear current solely because the runtime is healthy;
10. provider-specific fencing mechanisms map to the common semantic dispositions without the UI pretending all protocols have identical ordering.

## Maturity

This front remains `RESEARCH_ACTIVE / NON_EXECUTABLE`. The authority-transfer and partition-ownership model materially reduces the previous gap around shard rebalance/fencing, but exact SharedContractSurface compatibility algebra and complete cross-workspace recovery orchestration remain open research vectors.

## OS-style Screen & Window Composition Scope

Decision status: \`IN_SCOPE_FOR_G4_RESEARCH / NON_EXECUTABLE\`

The G4 frontend scope now explicitly includes the design of a **screen/window composition environment inspired by desktop operating systems**.

This is not merely a visual metaphor. It is a product-interaction capability to be researched and planned.

### Scope

Research the composition of module UIs as independent but coordinated application-like windows inside the System Builder Operating Environment.

The composition system must cover:

- creating/opening module windows;
- multiple windows from the same module;
- moving, resizing and arranging windows;
- minimize, maximize, restore and close;
- floating, docking, snapping and split layouts;
- tabbed/docked window groups where useful;
- z-order and focused-window management;
- persistent workspace/window layouts;
- restore after reload/session recovery;
- saved workspace presets;
- module launcher / application catalog;
- taskbar/open-window indicators;
- background/suspended windows;
- window-to-window comparison;
- cross-window drag/copy/reference where semantically valid;
- multi-window revision/currentness handling;
- integration with Ribbon, Command Registry, Tool Rail, Inspector and Status/Activity;
- integration between ModuleWindow and System Map / 3D Canvas;
- responsive degradation on smaller displays;
- keyboard and non-drag alternatives;
- lifecycle/performance management for inactive windows.

### Screen composition

Research a **Screen Composer / Workspace Composer** able to assemble complete working screens from reusable primitives and module windows.

Candidate hierarchy:

~~~
Token / Primitive
-> Component
-> Module Component
-> Tool
-> Module Window
-> Window Group / Dock
-> Workspace
-> Complete Screen
-> Saved Workspace Layout
-> System Desktop
~~~

A complete screen may therefore be a composition of several module windows rather than one monolithic route/page.

Example:

~~~
OPERATIONS WORKSPACE

+-------------------------+-------------------------+
| Helpdesk                | Workflow                |
| Ticket / Queue          | Flow / Gates            |
+-------------------------+-------------------------+
| Observability           | Evidence / History      |
| Metrics / Alerts        | Audit / Currentness     |
+-------------------------+-------------------------+
~~~

The composition is a UI arrangement, not a new semantic owner.

~~~
Screen composition
!= semantic aggregation
!= module ownership merge
~~~

### Window state model

Candidate state vocabulary:

~~~
CLOSED
OPENING
OPEN
FOCUSED
UNFOCUSED
MINIMIZED
MAXIMIZED
FLOATING
DOCKED
SNAPPED
SPLIT
BACKGROUND
SUSPENDED
HIBERNATED
RESTORING
RECOVERING
DIRTY
STALE_CONTEXT
READ_ONLY
BLOCKED
~~~

These states must be decomposed where necessary rather than forced into one scalar enum.

### Performance lifecycle

Research explicit resource lifecycle:

~~~
UNLOADED
-> LOADING
-> ACTIVE
-> BACKGROUND
-> SUSPENDED
-> HIBERNATED
-> RESTORING
~~~

Hard rules:

- \`Module installed != Module loaded\`.
- \`Module loaded != Module rendered\`.
- \`Module rendered != actively updating\`.
- \`Window open != full processing active\`.
- \`Inactive workspace -> suspend / aggregate / unload where safe\`.
- \`Installed complexity != runtime UI cost\`.
- \`Visible complexity != active computation cost\`.

The shell should own shared infrastructure such as commands, notifications, selection/context, layout persistence, jobs and window management so that each module does not become an independent SPA inside the Builder.

### Window manager boundaries

~~~
Window layout
!= system topology

Dock/Snap
!= semantic relation

Focused Window
!= selected semantic object

Window Z-order
!= architectural priority

Close Window
!= disable module
!= uninstall module
!= undeploy runtime
~~~

### Cross-window synchronization

Research must define how windows coordinate:

- same semantic object in different projections;
- shared vs local selection;
- focused-window context;
- revision binding;
- environment binding;
- dirty edits;
- autosave;
- conflict detection;
- stale-window detection;
- live update;
- explicit reconciliation;
- safe close with unsaved/unknown state;
- restoration after crash/reload.

A window restored from a saved workspace must not silently attach to a newer revision/environment without qualification.

### Module-window contracts

Candidate ModuleWindow contract must declare:

- module identity;
- supported window/workspace kinds;
- initial projection;
- commands contributed;
- contextual Ribbon tabs;
- inspector sections;
- selection contract;
- local/transient state;
- canonical/editable state boundaries;
- persistence/restore contract;
- suspend/resume behavior;
- live-subscription policy;
- failure/recovery states;
- performance budget;
- accessibility equivalents.

### Componentes additions

The permanent Componentes inventory must include at least:

- SystemDesktop;
- ScreenComposer;
- WorkspaceComposer;
- WindowManager;
- ModuleLauncher;
- ModuleAppTile;
- ModuleWindow;
- ModuleWindowFrame;
- ModuleWindowTitleBar;
- WindowResizeHandle;
- WindowDockTarget;
- WindowSnapZone;
- WindowSplitLayout;
- WindowTabGroup;
- Taskbar;
- OpenWindowIndicator;
- BackgroundWindowIndicator;
- WorkspaceSwitcher;
- SavedWorkspaceLayout;
- WindowComparisonLayout;
- WindowRestoreState;
- WindowSuspensionIndicator;
- WindowContextDriftIndicator;
- LocateInSystemMapAction;
- ModuleContextualRibbon.

### Adversarial/proof obligations

Research must test at least:

1. ten or more installed modules with only two active windows;
2. many open windows with inactive ones suspended;
3. two windows editing the same module/revision;
4. two windows bound to different revisions;
5. restored workspace after revision/environment changed;
6. dirty window closed accidentally;
7. minimized window containing a critical finding;
8. dock/snap mistaken for semantic relationship;
9. module window closed while runtime remains healthy/effective;
10. module installed but never loaded;
11. background module generates notification/job result without foreground window;
12. 3D System Map and ModuleWindow disagree on selection/currentness;
13. crash/reload restores layout but not stale authority as current;
14. mobile/small-screen fallback cannot support arbitrary floating windows;
15. resource pressure suspends windows without losing dirty work;
16. window explosion recreates cognitive overload;
17. each module attempts to create its own command/store/polling/window infrastructure instead of using shell services.

### Scope conclusion

The target is not merely a collection of web pages. The G4 UI should research a **composable operating environment** in which modules can be installed like applications and their working surfaces assembled as windows/screens/workspaces, while all architectural truth remains outside the window-manager metaphor.


## Factory Module — Fleet Operations, Dense Control & Root-Service Administration

Decision status: \`IN_SCOPE_FOR_G4_RESEARCH / NON_EXECUTABLE\`

The **Factory Module** should intentionally differ from design-oriented workspaces.

Its primary workload is not visual composition of one system. It is **high-density supervision and bounded operational control across many client systems, environments, modules, hosts and root services**.

### Interaction profile

The Factory Module should optimize for:

- many rows/entities visible at once;
- fast filtering/search;
- grouping by client, environment, module, region, host, version and health state;
- exception-first triage;
- bulk selection;
- compact status/state visualization;
- operational commands;
- auditability;
- blast-radius awareness;
- low navigation cost between fleet -> client -> system -> module -> instance -> evidence.

Therefore:

~~~
Factory Module
!= Design Canvas

Factory Module
= Fleet Console
+ Operations Console
+ Factory Governance Surface
~~~

The semantic 3D/System Map may still be reachable for drill-down, but should not be the default representation for fleet-scale operations.

### Candidate Factory windows/views

- Factory Overview
- Client Fleet
- Client System Detail
- Module Fleet
- Host / Server Fleet
- Deployment Fleet
- Root Services
- Root Service Detail
- Incident / Finding Queue
- Jobs / Operations Queue
- Version / Drift Matrix
- Capacity / Resource View
- Provider / Binding Fleet
- Secrets Metadata / Credential Governance
- Audit / Evidence
- Maintenance / Change Windows

### Dense representations

Candidate default representations include:

- sortable/filterable tables;
- tree grids;
- compact cards;
- status matrices;
- heatmaps;
- sparklines;
- grouped counters;
- drill-down side panels;
- batch-selection toolbars;
- exception queues.

~~~
Fleet density
> decorative representation
~~~

The goal is to inspect a large estate without opening one graphical workspace per client.

### Fleet hierarchy

Candidate hierarchy:

~~~
Factory
-> Client
-> Client System
-> Environment
-> Module / Capability
-> Deployment Manifestation
-> Runtime Instance
-> Host / Server
-> Provider / Root Service
-> Evidence / Currentness
~~~

The user must be able to move both top-down and bottom-up.

Examples:

~~~
Client -> all systems -> all unhealthy modules

Module -> all clients using it -> versions/drift

Host -> all client workloads placed on it

Root Service -> all dependent client systems
~~~

### Operational control surface

The Factory Module is not observation-only.

Research and planning must include bounded operational actions such as:

- start / stop / restart service;
- restart module runtime;
- stop / restart host/server where supported;
- cordon / drain host where topology allows;
- disable / enable module;
- pause/resume worker or queue consumer;
- scale up/down;
- redeploy;
- rollback to qualified release;
- reconcile;
- failover / promote where contracts permit;
- enter/exit maintenance mode;
- isolate/quarantine;
- acknowledge/assign incident or finding;
- rotate/revoke credentials through qualified root-service workflows;
- cancel/retry bounded background jobs.

These are candidate action classes, not universal guarantees; provider/runtime capability determines actual support.

### Control safety

Operational control must distinguish:

~~~
Observe
!= Control
!= Change
!= Deploy
!= Destructive Action
~~~

Every action should carry qualified scope and authority.

Candidate command envelope:

~~~
FactoryOperation {
  action
  targetType
  targetIds[]
  environment
  requestedBy
  authorityContext
  desiredState
  preconditions
  blastRadius
  dependencyImpact
  confirmationPolicy
  executionMode
  timeout
  rollbackOrRecovery
  evidenceRequirements
}
~~~

### Desired / acknowledged / observed / effective control

A command being accepted is not proof of effect.

Example restart:

~~~
RESTART_REQUESTED
-> COMMAND_ACCEPTED
-> STOP_OBSERVED
-> START_REQUESTED
-> PROCESS_OBSERVED
-> HEALTH_CHECK_PASSED
-> SEMANTIC_READINESS_QUALIFIED
-> RESTART_EFFECTIVE
~~~

Hard invariant:

~~~
Operation ACK
!= Operational Effect
!= Business Readiness
~~~

### Bulk actions

Fleet-scale operation requires bulk actions, but bulk must not hide partial outcomes.

Candidate states:

- BULK_PENDING
- BULK_RUNNING
- PARTIAL_SUCCESS
- PARTIAL_FAILURE
- MIXED_EFFECT
- UNKNOWN_EFFECT
- RECONCILIATION_REQUIRED
- COMPLETE

~~~
100 selected targets
!= one atomic operation
~~~

The UI must preserve per-target disposition/evidence.

### Blast radius and dependency impact

Before high-impact control, the Factory Module should research an impact preview.

Candidate questions:

- how many clients are affected?
- which environments?
- which dependent modules?
- which active workflows?
- which root services depend on the target?
- is there redundancy/failover?
- is there unsaved/in-flight work?
- what authority/security floor is required?
- what rollback/recovery exists?
- what evidence will prove success?

Candidate UI: \`FactoryOperationImpactPreview\`.

### Client fleet / capability matrix

A dense matrix may be useful:

~~~
                 Auth   Workflow   Data   Obs   Deploy
Client A          OK      OK       OK    WARN    OK
Client B          OK     DEG       OK     OK      OK
Client C         DRIFT    OK      UNK     OK     PEND
Client D          OK      OK       OK     OK      OK
~~~

But color/status aggregation must never erase:

- UNKNOWN;
- stale evidence;
- authority drift;
- contract/revision drift;
- partial rollout;
- placement drift;
- unresolved effect.

### Module fleet view

A module-first view should answer:

- which clients use this module?
- which versions?
- which contract profiles?
- where deployed?
- health/currentness?
- incompatible versions?
- rollout/update candidates?
- dependent systems?
- operational incidents?

This supports fleet maintenance as the customer count grows.

### Root services

Root services remain builder/factory-only or otherwise highly privileged.

Examples include deployment secrets, signing, artifact registry, provisioning, global observability/control, provider credentials and factory orchestration.

The Factory Module may expose:

- metadata;
- health;
- dependency fan-out;
- rotation/currentness;
- access policy;
- provider binding;
- incidents;
- maintenance state;
- operational commands.

It should not imply that privileged secret values are routinely viewable.

~~~
Secret metadata
!= Secret value

Can operate dependent service
!= can read root credential
~~~

### Client isolation

Factory operators may see/manage multiple clients, but multi-client visibility must preserve tenant boundaries.

Candidate rules:

- cross-client aggregation uses only fields allowed for factory scope;
- drill-down requires qualified authority;
- one client's data must not leak into another client's context;
- bulk actions must show target tenants explicitly;
- filtering/grouping does not weaken tenant isolation;
- root-service access remains separately authorized.

### Factory window profile

Candidate window layout:

~~~
┌ Factory Toolbar / Filters / Search / Bulk Actions ──────┐
│ Client | Env | Module | Version | Health | Region | ... │
├───────────────────────┬──────────────────────────────────┤
│ Dense Fleet Grid      │ Context / Impact / Evidence     │
│                       │ Inspector                        │
│                       │                                  │
├───────────────────────┴──────────────────────────────────┤
│ Jobs / Incidents / Background Operations / Audit        │
└──────────────────────────────────────────────────────────┘
~~~

The Ribbon remains available, but the dominant interaction is fleet filtering, selection, drill-down and bounded operational command execution.

### Componentes additions

Research/catalog:

- FactoryModuleWindow
- FactoryOverview
- ClientFleetGrid
- ClientSystemRow
- ModuleFleetGrid
- HostFleetGrid
- DeploymentFleetGrid
- RootServiceFleetGrid
- FleetFilterBar
- FleetGroupByControl
- FleetStatusMatrix
- FleetHeatmap
- FleetBulkSelection
- FleetBulkActionBar
- FactoryOperationCommand
- FactoryOperationImpactPreview
- FactoryOperationProgress
- PerTargetOperationResult
- MaintenanceModeIndicator
- CordonDrainControl
- RestartControl
- StopStartControl
- ReconcileControl
- RollbackControl
- IncidentQueue
- DriftMatrix
- RootServiceDependencyView
- SecretMetadataRecord

### Factory invariants

- \`Factory Module != Design Canvas\`.
- \`Fleet density > decorative representation\`.
- \`Observe != Control != Change != Deploy\`.
- \`Operation ACK != Operational Effect != Business Readiness\`.
- \`Bulk request != atomic fleet transaction\`.
- \`Aggregate health != every member healthy/current\`.
- \`Cross-client visibility != cross-client authority\`.
- \`Secret metadata != secret value\`.
- \`Can operate != can read credential\`.
- \`Stop window != stop module != stop runtime\`.
- \`Factory grouping/filtering != tenant merge\`.
- \`Root Service != Client Module\`.
- \`Factory control plane != client semantic owner\`.

### Performance / scale hypothesis

Factory UI should scale primarily through virtualization and aggregation rather than rich per-row rendering.

Research:

- virtualized tables/treegrids;
- incremental/paginated data loading;
- server-side filtering/sorting where needed;
- cached aggregate counters with currentness;
- selective subscriptions;
- event-driven refresh;
- priority updates for visible/critical rows;
- lazy drill-down;
- background reconciliation;
- bounded live telemetry.

The Factory Module should remain usable as the estate grows from tens to hundreds or thousands of client systems without requiring all detailed telemetry to be mounted simultaneously.


## Priority benchmarks — Puter, OS.js and daedalOS

Decision status: \`PRIORITY_RESEARCH_BENCHMARKS / NOT TECHNOLOGY SELECTION\`

The OS-like frontend research should explicitly benchmark **Puter**, **OS.js** and **daedalOS**.

These references are used to extract portable interaction/architecture patterns. They do not authorize copying trade dress, adopting their architecture wholesale, or selecting their code/frameworks.

### Puter — modern web-desktop experience benchmark

Research role:

- modern browser-desktop interaction;
- window creation and management;
- resizable windows;
- minimize/maximize/title/taskbar behavior;
- desktop integration;
- app-like launch model;
- notifications/dialogs;
- multi-window experience;
- perceived responsiveness and progressive loading.

Primary evidence indicates Puter exposes UI APIs for creating windows with title/head, resize, positioning and taskbar representation, making it a useful benchmark for the System Builder ModuleWindow/WindowManager interaction contract.

SB research questions:

- what interaction grammar makes windows feel native without becoming a fake OS?
- how does taskbar/window discoverability scale?
- how should multi-window state be persisted/restored?
- which window controls belong to the global shell vs module?
- how should background apps/windows expose notifications and jobs?
- what can be learned without coupling SB to Puter runtime semantics?

### OS.js — architecture/window-manager benchmark

Research role:

- open-source web-desktop platform architecture;
- window manager;
- application APIs;
- GUI toolkit;
- application lifecycle;
- service/provider structure;
- session/application restoration;
- window containers hosting arbitrary DOM/framework content;
- React integration patterns;
- shared shell services.

OS.js documentation explicitly describes a web desktop platform with window manager, application APIs, GUI toolkit and filesystem abstractions; its application/window APIs and React examples make it a priority architectural benchmark.

SB research questions:

- how should ModuleWindow be separated from ModuleDefinition/ModuleInstallation?
- which services belong to the shell rather than every module?
- how should process/application lifecycle differ from window lifecycle?
- how should session restore bind revision/environment/currentness?
- how should module packages register commands/windows/components?
- which OS.js concepts are too OS-specific for SB and must not be imported?

### daedalOS — interaction richness / desktop-behavior benchmark

Research role:

- browser desktop behavior;
- task/window interaction;
- context menus;
- file/app association analogies;
- drag/drop;
- multiple application windows;
- desktop navigation;
- visual density;
- realistic end-user desktop feel.

The project identifies itself as a desktop environment in the browser and provides rich desktop/app interaction patterns.

SB research questions:

- which behaviors improve discoverability and spatial memory?
- which behaviors create novelty but not engineering value?
- how should context menus/window chrome remain consistent?
- how should desktop freedom degrade on small screens?
- what interaction patterns become cognitive overload in a professional engineering environment?

### Comparative benchmark matrix

The research should maintain a comparison across at least:

| Dimension | Puter | OS.js | daedalOS | SB implication |
| --- | --- | --- | --- | --- |
| Window manager behavior | research | research | research | ModuleWindow contract |
| App/module launcher | research | research | research | ModuleLauncher |
| Taskbar/open windows | research | research | research | Taskbar |
| Multiple windows/app | research | research | research | same module, multiple projections |
| Session/layout restore | research | research | research | revision-safe restore |
| Background app behavior | research | research | research | suspend/jobs/notifications |
| React/framework integration | inspect | strong benchmark | inspect | shell/module integration |
| Desktop navigation | strong benchmark | architectural | strong benchmark | SystemDesktop |
| Performance/lazy loading | inspect | inspect | inspect | lifecycle budgets |
| Accessibility | inspect critically | inspect critically | inspect critically | SB must exceed benchmark where needed |
| Small-screen fallback | inspect | inspect | inspect | tabs/stacks instead of free windows |
| Extensibility/app registration | inspect | strong benchmark | inspect | module installation model |

### Benchmark rules

- \`Benchmark != adoption\`.
- \`Similar interaction != copied visual identity\`.
- \`Web desktop behavior != semantic authority\`.
- \`App lifecycle != module lifecycle != deployment lifecycle\`.
- \`Window manager convenience != permission model\`.
- \`Desktop freedom != mandatory free-form layout\`.
- \`External framework limitation != SB architectural limitation\`.

Research should extract principles, state machines, lifecycle patterns, failure cases, performance strategies and accessibility gaps, then reconcile them with the existing System Builder invariants.


## React/Next base vs external web-desktop shell — architecture research

Decision status: \`RESEARCH_REQUIRED / CURRENT_BASE_REMAINS_NEXT_REACT_TS\`

The OS-like shell research must explicitly compare three architectural strategies without treating the benchmarks as automatic dependencies.

### Strategy A — System Builder-owned windowing on React/Next

~~~
Next.js + React + TypeScript
  -> System Builder Shell
     -> WindowManager
     -> WorkspaceManager
     -> Dock/Snap/Taskbar/Launcher
     -> ModuleWindow
        -> React module content
~~~

Research whether the System Builder should own its windowing primitives/contracts directly while borrowing only interaction patterns from Puter, OS.js and daedalOS.

Candidate benefits:
- maximum semantic control;
- no external desktop runtime as product authority;
- easier alignment with Command Registry, Ribbon, Inspector, Componentes and SB lifecycle semantics;
- direct control over performance/suspension/currentness behavior;
- lower conceptual coupling to another platform.

Candidate risks:
- more custom engineering;
- window manager edge cases;
- focus/z-order/docking/restore/accessibility complexity;
- risk of rebuilding mature interaction machinery poorly.

### Strategy B — external desktop/window manager as bounded infrastructure

~~~
Next.js + React + TypeScript
  -> SB semantic shell/services
  -> Desktop/Windowing Adapter
     -> external window manager/runtime
  -> ModuleWindow content remains React
~~~

Research whether an external windowing implementation can be treated as a bounded infrastructure/provider behind System Builder contracts.

Requirements:
- SB retains semantic ownership of ModuleWindow identity, revision/currentness, authority, commands and persistence contracts;
- external library owns only presentation/window mechanics;
- replaceability must be realistic;
- window lifecycle events must be normalized without inventing semantic equivalence;
- no provider may become canonical module/runtime/deployment authority.

### Strategy C — external desktop framework owns the shell

~~~
External Desktop Framework Core
  -> Window Manager
  -> Session/Application Runtime
  -> System Builder module windows
       -> React content
~~~

Research this only as a comparison baseline. It changes architectural ownership materially and must be justified by evidence.

Questions:
- does it force its own process/application model over SB modules?
- does it constrain routing, SSR, authentication, accessibility or deployment?
- does it introduce lock-in in session/window persistence?
- can SB preserve autonomous module/window contracts?
- does it complicate Factory View density and specialized 3D WorkSurface integration?
- does it improve enough lifecycle/windowing behavior to offset ownership cost?

### Key separation

~~~
React / Next.js
= component/rendering/application framework layer

Window Manager
= interaction/orchestration infrastructure

Module semantics
= System Builder canonical product semantics
~~~

Therefore:

- \`Desktop metaphor != desktop framework dependency\`.
- \`Window Manager != UI framework\`.
- \`React renderer != window lifecycle authority\`.
- \`External window library != module semantic owner\`.
- \`Framework adoption != benchmark learning\`.

### Research obligations

Benchmark/prototype comparison should evaluate:

- bundle/startup cost;
- memory use;
- lazy-loading behavior;
- suspended/background windows;
- many-window behavior;
- window creation/destruction cost;
- docking/snapping/splitting;
- z-order/focus;
- persistence/session restore;
- crash/reload recovery;
- keyboard/accessibility;
- small-screen fallback;
- React integration friction;
- Next.js integration friction;
- routing implications;
- SSR/client-boundary implications;
- module/plugin registration;
- Command Registry integration;
- Ribbon contextual integration;
- Inspector synchronization;
- 3D WorkSurface embedding;
- Factory Module dense-table compatibility;
- theming/design-system control;
- testability;
- replaceability;
- lock-in surface;
- maintenance/community maturity;
- security boundary implications.

### Candidate architecture if React remains base

Research a dedicated windowing package family such as:

~~~
packages/windowing
  WindowManager
  WindowRegistry
  WorkspaceManager
  DockManager
  SnapManager
  WindowLifecycle
  WindowPersistence
  WindowFocusManager
  WindowResourceController
  DesktopAdapter?
~~~

Names are provisional and do not authorize implementation.

### Decision gate

No external desktop framework/library should be selected before comparative evidence shows it improves the System Builder against the custom/bounded-adapter alternatives.

Current direction remains:

~~~
Next.js + React + TypeScript
= frontend base

OS-like windowing
= researchable infrastructure layer
~~~

A future decision may retain, adapt or replace windowing mechanics without redefining module semantics.


## Application Composition — native apps, wrapped tools and proven external consoles

Decision status: IN_SCOPE_FOR_G4_RESEARCH / NON_EXECUTABLE

The OS-like System Builder should not treat every capability as one giant screen. It should research an **Application Catalog / Application Composition Model** similar in spirit to professional suites with many specialized applications.

Preferred principle:

~~~
Reuse proven operational semantics where possible.
Adapt the surface.
Do not casually reimplement mature behavior.
~~~

This does not mean copying proprietary UI or source. Prefer official APIs, supported embedding, official components/plugins or deep-link integration over recreating mature operational machinery.

### Application integration classes

~~~
NATIVE_SB_APP
API_BACKED_SB_APP
EMBEDDED_EXTERNAL_APP
PROXIED_EXTERNAL_APP
DEEPLINK_EXTERNAL_APP
NATIVE_BRIDGE_APP
HYBRID_APP
~~~

Meaning:

- NATIVE_SB_APP: System Builder-owned UI and behavior.
- API_BACKED_SB_APP: SB-owned UI using an official/versioned external API.
- EMBEDDED_EXTERNAL_APP: original external web UI/component embedded when officially supported.
- PROXIED_EXTERNAL_APP: external UI served through a controlled same-origin/reverse-proxy boundary when supported and secure.
- DEEPLINK_EXTERNAL_APP: SB window acts as launcher/context holder while the canonical external UI opens separately.
- NATIVE_BRIDGE_APP: SB window controls a native/local tool through a qualified bridge/agent.
- HYBRID_APP: lightweight SB-native overview/control plus deep link/embed to the original advanced surface.

No class is universally preferred.

### Core distinctions

~~~
Module != Application
Capability != Application
Application != Window
Application can open multiple windows
Window can project one bounded task/context of an application
~~~

Also:

~~~
Application window != capability ownership
External application != semantic owner
Original tool UI != System Builder canonical truth
~~~

The System Builder owns orchestration/context/authority contracts of its window. The external product may remain owner of its own operational state.

### Candidate application catalog

Research which concerns deserve dedicated applications:

- System Map / Architecture Designer
- Workflow Designer
- Data Modeler
- API / Contract Explorer
- Identity & Access
- Secrets / Credentials Governance
- Network Configurator
- Container / Docker Manager
- Task / Process Manager
- Host / Server Manager
- Storage Manager
- Database Administration
- Terminal
- Logs / Journal
- Observability
- Incident / Findings
- Deployment / Release Manager
- Build / Artifact Manager
- Factory / Fleet
- Template Catalog
- Root Services
- Documentation / Knowledge
- Git / Repository Workspace
- Settings / Policy Administration

Final split follows task cohesion, authority boundaries, performance, mature-tool availability and cognitive load rather than arbitrary module count.

### Docker / container management strategy

Prefer research in this order:

1. official Docker Engine API/SDK as compatibility boundary for SB-native or hybrid control;
2. Portainer API as a higher-level management provider where Portainer is installed;
3. original Portainer UI only through a supported and secure integration mode;
4. deep-link to Portainer when embedding would require weakening security.

Docker Engine exposes a versioned REST API and version negotiation. This is a strong candidate for a provider/adapter boundary because compatibility can be qualified explicitly.

Portainer exposes a REST API and can proxy Docker/Kubernetes API operations. Portainer API permissions follow its user/token permissions.

Important constraint: Portainer defaults to a CSP that blocks iframe embedding. Disabling CSP solely to fit Portainer inside an SB window must not become the normal integration pattern.

~~~
Portainer available
!= Portainer UI safely embeddable

Portainer API available
!= Portainer semantic owner

Docker API compatible
!= every Portainer feature available
~~~

Candidate hybrid:

~~~
Docker Manager
├─ SB-native fleet/summary/control
├─ Docker Engine provider
├─ optional Portainer provider
└─ Open advanced manager -> original Portainer UI
~~~

### Network Configurator / host administration

Cockpit is a priority benchmark/provider candidate for host administration because it intentionally works with Linux system APIs/commands and supports modular applications including networking and storage.

Cockpit networking uses NetworkManager/DBus and permission enforcement through PolicyKit. Its developer documentation supports embedding the whole interface or documented components subject to same-origin/frame-security requirements, commonly via a reverse proxy.

Candidate hybrid:

~~~
Network Configurator
├─ SB host/context/evidence shell
├─ documented Cockpit component when qualified
├─ NetworkManager-native provider where appropriate
└─ deep-link fallback
~~~

Possible companion applications:

- Server Manager
- Network Configurator
- Storage Manager
- Logs
- Terminal
- Services / systemd
- Task / Process Manager

Undocumented Cockpit internals must not be treated as stable APIs.

### Compatibility-first reuse

Research rule:

~~~
Official API / supported component
> replicated private behavior
~~~

when authority, security, UX and lifecycle requirements are satisfied.

But:

~~~
Mature external tool
!= automatic dependency
~~~

Compare compatibility, feature coverage, API/version stability, authentication, authorization mapping, CSP/frame restrictions, same-origin/reverse-proxy requirements, WebSockets, latency, offline behavior, licensing, upgrade coupling, visual consistency, accessibility, failure/recovery, audit/evidence and replaceability.

### Candidate application manifest

~~~
BuilderApplicationManifest {
  id
  name
  category
  integrationClass
  semanticScope
  authorityScope
  supportedProviders[]
  requiredCapabilities[]
  supportedTargets[]
  versionCompatibility
  windowKinds[]
  defaultWindow
  commands[]
  contextualRibbonTabs[]
  inspectorContributions[]
  embedPolicy
  authBinding
  permissionMapping
  lifecycle
  suspendPolicy
  healthProbe
  currentnessPolicy
  evidencePolicy
  deepLinks[]
  fallbacks[]
}
~~~

Candidate only; not implementation authority.

### Suite analogy boundary

The useful suite analogy is many specialized applications sharing identity, design language, context and services.

SB applications may share System Builder identity/context/commands while keeping bounded task purposes. Applications can pass semantic references without silently taking ownership of one another's domain state. Shared shell services should prevent every app from becoming its own independent SPA.

### External UI embedding safety

Qualify each external product:

~~~
EMBED_ALLOWED
EMBED_REQUIRES_SAME_ORIGIN
EMBED_REQUIRES_REVERSE_PROXY
EMBED_UNSUPPORTED
DEEPLINK_ONLY
API_ONLY
NATIVE_BRIDGE_ONLY
~~~

Never disable a mature product's security headers by default merely to satisfy the desktop metaphor.

### Componentes additions

- ApplicationCatalog
- ApplicationLauncher
- BuilderApplicationManifestView
- NativeAppWindow
- ExternalAppWindow
- HybridAppWindow
- EmbeddedToolFrame
- ExternalToolDeepLink
- ProviderBadge
- CompatibilityBadge
- VersionNegotiationState
- IntegrationModeIndicator
- ExternalAuthBinding
- ExternalPermissionMapping
- AppHealthIndicator
- AppUpgradeDriftIndicator
- AppFallbackAction

### New invariants

- Module != Application != Window.
- Capability != Application.
- External tool != System Builder semantic owner.
- Original UI reuse != permission bypass.
- Embed capability != integration correctness.
- Official API compatibility != full feature equivalence.
- Deep link != failed integration; it may be the safest supported mode.
- Reverse proxy != permission authority.
- External auth != SB authority equivalence.
- Adapter normalization != fabricated semantic equivalence.
- Reuse proven behavior != copy proprietary implementation.

### Adversarial cases

1. Portainer iframe is enabled by disabling CSP globally just for visual convenience.
2. Docker daemon API is exposed insecurely to the browser.
3. SB user has lower authority than an embedded external session and gains unintended control.
4. external UI and SB show different target environment/tenant.
5. external tool upgrade breaks private/undocumented integration.
6. API version mismatch silently drops a capability.
7. embedded app loses authentication and displays misleading stale state.
8. deep-linked app loses semantic context/revision/target.
9. one external tool becomes mandatory for all deployments and creates lock-in.
10. native replacement drifts from the underlying official API.
11. multiple apps issue conflicting operations against the same target.
12. reverse proxy weakens CSP, cookie or origin boundaries.
13. external UI reports provider ACK while SB marks business effect effective.
14. application proliferation creates dozens of tiny apps with no coherent task boundary.

### Research outcome

G4 should produce an **Application Portfolio Matrix** describing which System Builder tasks become native applications, API-backed native applications, hybrid applications, supported embedded external applications, deep-linked external applications or native-bridge applications.
