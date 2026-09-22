# G4 — Workspace Command Surface & Higher-Level Interaction — Construction B

Status: `BLOCKED_BY_CONSTRUCTION_A / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Construction B integrates Construction A contracts upward through:

```text
MODULE COMPONENT -> TOOL -> WORKSPACE -> COMPLETE TASK PAGE -> SYSTEM VIEW
```

It must not invent lower-level semantics when the required Planning/Construction A predecessor chain is absent, stale or contradictory.

## Predecessor reconciliation

Repository truth was revalidated against:

- `AGENTS.md`;
- `docs/architecture/MASTER_BLUEPRINT.md`;
- `project_docs/generation-4/README.md`;
- `project_docs/generation-4/G4_RESEARCH_STATE.md`;
- `research/G4_PRODUCT_UX_AI_NATIVE_BUILDER.md`;
- `research/G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md`;
- `research/G4_UI_INTERACTION_STATE_MATRIX_RESEARCH.md`;
- `research/G4_FRONTEND_CONSTRUCTION_A_RECONCILIATION_2026-09-22.md`.

Construction A is explicitly `BLOCKED_BY_MISSING_PLANNING_PACKET / NON_EXECUTABLE` and records `BLOCKER-G4-FE-CA-001`: no latest materialized `G4 Frontend Planning :50` packet was found. It also explicitly instructs Construction B not to infer a component slice from the reconciliation artifact.

Therefore this Construction B round is bounded reconciliation only.

## Correction to the earlier Construction B draft

An earlier revision of this artifact described candidate higher-level shell/workspace contracts despite the missing predecessor packet. Those ideas remain useful **research candidates already represented elsewhere in the frontend research corpus**, but they are not accepted Construction B output for this predecessor chain.

This revision withdraws any implication that Construction B promoted, accepted or integrated those candidates from Construction A.

No lower-level primitive, component, pattern, block, state or transition is redefined here.

## Durable higher-level hypotheses preserved, not promoted

The following remain pre-existing research hypotheses and must be reconsidered only after a valid predecessor handoff:

```text
stable workspace shell + specialized work surfaces
```

Candidate surfaces remain research-only:

```text
Frontend layout/component canvas
Workflow graph
Data entity/relation/data-flow
Architecture capability/module graph
Deployment topology/placement
Operations runtime/observability
```

The current frontend research corpus also contains candidate shell ideas such as collapsible command/ribbon surfaces, tool rails, inspectors/panel docks and status/activity surfaces. This blocked round does not promote their exact composition, naming or state contracts.

## Semantic invariants preserved

No delta is introduced to these established invariants:

- `STALE` retains its qualified currentness meaning;
- `UNKNOWN` is never visually or semantically strengthened;
- `BLOCKED != DISABLED`;
- `PENDING != EFFECTIVE`;
- `SELECTED != FOCUSED`;
- `READ_ONLY != PERMISSION_DENIED`;
- `Workspace preset != permission grant`;
- `Visual connectability != semantic compatibility`;
- `ACK != effect`;
- `Canvas/graph/system view != canonical truth`;
- `System Layers/Lenses` remain typed projections rather than a universal z-order.

## Requested composed-state integration — deferred

The requested Construction B work includes composition across:

```text
load
selection
focus
editing/dirty
validation
async execution
authority
currentness/revision
connectivity
degraded/offline
panel/layout persistence
recovery
```

Construction B cannot bind those dimensions into new Module Component/Tool/Workspace contracts until Construction A supplies the bounded lower/middle-level contracts selected by Planning.

This avoids silently deciding, for example, whether a specific lower-level element owns `BLOCKED`, merely projects it, derives it, or receives it from a parent composition.

## Tools / workspaces / task pages — coverage status

Requested targets are acknowledged but not materialized in this blocked round:

```text
Toolbox / ToolRail
Context Toolbar / contextual command surface
WorkSurface
Inspector / PanelDock
Status / Activity bar
Frontend editor
Workflow graph
Data model/data-flow
Architecture capability/module graph
Deployment topology
Operations/observability
Complete create/edit/review/simulate/authorize/publish/operate/audit/recover pages
System-level views
```

No complete-page happy-path contract is fabricated without predecessor state/transition contracts.

## Cross-workspace findings preserved for successor integration

Successor Construction B must test, not assume:

1. semantic identity continuity when switching specialized workspaces;
2. explicit inability to represent a selected identity in a destination workspace;
3. revision/currentness drift during workspace switch;
4. preservation of dirty/recoverable state across navigation;
5. persisted layout without persisted authority grants;
6. focus restoration after modal/panel/context-surface transitions;
7. responsive overflow without removal of critical/authority-sensitive actions;
8. visual relation affordance without semantic-edge fabrication.

These are proof obligations, not accepted contracts in this round.

## Complete-task scenario obligations preserved

When predecessor materialization exists, Construction B must derive at minimum:

```text
cold-open -> load -> select -> edit -> dirty -> autosave -> conflict -> reconcile -> saved

drag -> invalid target -> explain/recover -> valid target

publish -> authority qualification -> request -> ACK -> verification pending -> EFFECTIVE|PARTIAL|FAILED|UNKNOWN

offline -> local draft -> reconnect -> revision/currentness compare -> reconcile

bulk action -> mixed outcomes -> partial success -> inspect/retry/reconcile

review -> live revision drift -> preserve local review context -> requalify/reconcile

fatal child-surface failure -> preserve recoverable draft/context -> restore/export recovery evidence
```

Regression proof must preserve the fixed distinctions above and must include keyboard/non-drag alternatives where direct manipulation exists.

## Componentes impact

No new inventory artifact is promoted in this blocked round.

Once unblocked, Construction B should integrate Construction A outputs upward and then determine which higher-level entries are justified, potentially including tool/workspace/page scenarios. Exact candidates must be derived from the predecessor packet rather than inferred here.

Required Componentes proof categories for the future handoff remain:

```text
composed state reproduction
selection vs focus
multi-selection mixed values
read-only vs permission-limited
pending vs effective
stale / partial / unknown
revision drift/conflict
offline/reconnect/recovery
partial bulk result
fatal recoverable failure
responsive command reachability
keyboard/direct-manipulation equivalence
```

## Blocker

`BLOCKER-G4-FE-CB-001`: Construction A has no executable/materialized lower/middle-level slice because `BLOCKER-G4-FE-CA-001` remains unresolved.

Construction B cannot legitimately consume and elevate a predecessor contract that does not exist.

## Exact handoff

```text
G4 Frontend Planning :50
  -> materialize bounded packet with named lower/middle-level slice

G4 Frontend Construction A :00
  -> execute that packet
  -> materialize state / transition / composition / evidence contracts
  -> explicitly hand off named contracts to Construction B

G4 Frontend Construction B :10
  -> consume only that handoff
  -> elevate MODULE COMPONENT -> TOOL -> WORKSPACE -> COMPLETE TASK PAGE -> SYSTEM VIEW
  -> derive composed-state and complete-task regression obligations
  -> reconcile Componentes higher-level inventory impact

Documentation
  -> only after successful B integration, normalize terminology and durable research memory without promoting research to implementation authority
```

## Documentation handoff for this blocked round

Documentation should record only the blocker chain and the correction that the earlier Construction B draft was premature. It should **not** normalize the withdrawn draft as accepted higher-level contract material.

No product code, package metadata, G2/G3 material, WBS, Work Package, Sprint, TASK, provider or migration was changed.