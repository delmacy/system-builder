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
