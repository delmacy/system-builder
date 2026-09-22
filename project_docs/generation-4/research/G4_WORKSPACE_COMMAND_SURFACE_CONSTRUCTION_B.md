# G4 — Workspace Command Surface & Higher-Level Interaction — Construction B

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Elevate the existing primitive/state research into a coherent higher-level interaction contract for System Builder tools, workspaces and complete task pages.

This Construction B artifact does **not** authorize product code. It integrates the established frontend direction:

```text
Next.js + React + TypeScript ecosystem
FUNCTION -> STATE -> TRANSITION -> COMPOSITION -> CONSISTENCY
-> REPRESENTATION -> ACCESSIBILITY -> PERFORMANCE -> VISUAL REFINEMENT
```

with the product hypothesis:

```text
stable workspace shell + specialized work surfaces
```

and the latest interaction direction: a professional desktop-style command surface using an **Office-like collapsible tab/ribbon model**, rather than a permanently expanded toolbar or a dashboard-style page header.

## 1. Stable workspace shell

Candidate shell:

```text
Application / document context bar
Collapsible tab/ribbon command surface
------------------------------------------------------------
Tool rail | Specialized WorkSurface | Inspector / PanelDock
------------------------------------------------------------
Status / Activity bar
```

The shell remains stable while the active work surface specializes for frontend layout, workflow graph, data model/flow, architecture/capability graph, deployment topology and operations/observability.

`Same shell != same work surface`.

`Workspace consistency != one universal canvas`.

## 2. Office-like collapsible command tabs

The command surface should use top-level tabs that organize commands by intent. A tab can be expanded, temporarily opened, pinned open, or collapsed to maximize workspace area.

Candidate stable tabs:

```text
Arquivo
Início
Inserir
Editar
Organizar
Relacionar
Exibir
Revisar
Executar
Sistema
Ajuda
```

Workspace-specific/contextual tabs may appear only when relevant:

```text
Workflow
Dados
Frontend
Capability
Deployment
Infraestrutura
Observabilidade
Seleção
Formato
```

The contextual tab is not a new authority boundary. It is a command projection over current context.

### Ribbon states

```text
COLLAPSED
TEMPORARILY_EXPANDED
PINNED_EXPANDED
KEYBOARD_NAVIGATION
CONTEXT_TAB_AVAILABLE
CONTEXT_TAB_ACTIVE
COMMAND_PENDING
COMMAND_BLOCKED
PERMISSION_LIMITED
```

The collapse/expand preference may be persisted as workspace presentation state, but:

`Ribbon persistence != permission persistence`.

### Candidate tab responsibilities

`Arquivo`: system/document lifecycle, import/export, snapshots, revisions, close/switch.

`Início`: common edit/selection/navigation commands and high-frequency safe actions.

`Inserir`: elements eligible for the current work surface; insertion availability is context- and authority-qualified.

`Editar`: undo/redo, duplicate, remove, properties, edit-mode commands.

`Organizar`: group, align, distribute, arrange, layout, lock/isolate where semantically valid.

`Relacionar`: create/inspect relations, ports, dependencies, handoffs, bindings; visual connectability never implies semantic compatibility.

`Exibir`: zoom, semantic level, grid/snap, minimap, labels, lenses, layers, panel visibility, saved views.

`Revisar`: diff, findings, comments, evidence, currentness, impact and candidate-change review.

`Executar`: validation, simulation, dry-run, reconciliation and qualified execution entry points. Commands must expose `ACK != effect` semantics.

`Sistema`: revision/environment/definition context, preview/build/release configuration and system-wide qualified operations.

`Ajuda`: documentation, shortcuts, command discovery, diagnostics and accessibility help.

## 3. Command Registry contract

Menus, ribbon controls, context menus, keyboard shortcuts and command palette should project the same command definitions rather than implementing independent behavior.

Candidate research contract:

```text
CommandDefinition
  id
  label
  description
  iconRef?
  commandGroup
  eligibleWorkspaces[]
  eligibleObjectTypes[]
  modes[]
  selectionRequirements
  authorityRequirements
  currentnessRequirements
  guard
  shortcut?
  destructive?
  asyncSemantics
  effectSemantics
  recoverySemantics
  discoverability
```

Candidate command presentation state:

```text
HIDDEN_BY_CONTEXT
AVAILABLE
FOCUSED
ARMED
PENDING
BLOCKED
PERMISSION_DENIED
UNSUPPORTED
FAILED
UNKNOWN_OUTCOME
```

A disabled-looking command alone is insufficient. The UI should make the reason discoverable where useful.

One command may project into several surfaces:

```text
command.delete
  -> ribbon
  -> context menu
  -> keyboard shortcut
  -> command palette
```

This prevents semantic drift.

## 4. Left tool rail

The left edge should remain narrow and icon-oriented, closer to a professional creation tool than an administrative navigation sidebar.

Candidate categories:

```text
Select / Navigate
Systems
Layers / Lenses
Capabilities
Frontend
Workflow
Data
Integrations
Security
Deployment
Infrastructure
Observability
Insert
Search
More
```

Activating a category may open a temporary/pinnable drawer containing eligible elements. The drawer is an inventory/projection surface, not canonical ownership.

Tool-rail states:

```text
IDLE
HOVER
FOCUSED
ACTIVE_TOOL
DRAWER_OPEN
DRAWER_PINNED
DRAG_SOURCE
CONTEXT_UNAVAILABLE
PERMISSION_LIMITED
```

Keyboard and non-drag insertion paths are mandatory.

## 5. Inspector / PanelDock

The right side is a persistent contextual inspection/configuration area. It changes content according to semantic selection while preserving predictable panel mechanics.

Candidate common tabs:

```text
Geral
Estado
Relacionamentos
Regras
Authority
Evidence
Histórico
```

Specialized examples:

```text
Frontend component:
  Geral / Aparência / Binding / Eventos / Estados / Acessibilidade

Workflow activity:
  Geral / Inputs / Outputs / Rules / Effects / Failure / Authority / Evidence

Host/container:
  Geral / Resources / Network / Placement / Capacity / Observability / Costs / Evidence
```

Inspector state must distinguish:

```text
NO_SELECTION
SINGLE_SELECTION
MULTI_SELECTION_COMMON_PROPERTIES
MIXED_VALUE
READ_ONLY
PERMISSION_LIMITED
DIRTY
VALIDATING
SAVING
CONFLICT
STALE_SELECTION
SELECTION_SUPERSEDED
```

`Mixed value != empty value`.

## 6. Specialized WorkSurfaces

### Frontend work surface

Manipulates layout/component projections and bindings. Candidate interactions: select, place, resize, group, align, responsive breakpoint inspection, component state preview, binding and event configuration.

### Workflow work surface

Manipulates workflow nodes/edges/ports and simulation overlays. Connection gestures require valid/invalid target feedback and a keyboard-accessible relation creation alternative.

### Data work surface

Supports entity/relation modeling plus typed data-flow projections. Schema relation and runtime data flow remain distinct representations.

### Architecture / Capability work surface

Supports capability/module/system projections, dependencies, handoffs and lenses. Visual containment does not establish ownership.

### Deployment / Infrastructure work surface

Supports candidate placement/topology views. Dragging a module between hosts creates a candidate change, not an immediate production effect.

### Operations / Observability work surface

Primarily inspect/operate rather than free-form design. Observed runtime state, currentness and evidence remain explicit.

## 7. Composed state behavior

A workspace state is a composition of independent dimensions rather than one scalar status.

Candidate shape:

```text
WorkspaceState
  loadState
  mode
  selectionState
  focusState
  editState
  validationState
  asyncState
  authorityState
  currentnessState
  connectivityState
  revisionState
  panelLayoutState
  recoveryState
```

Examples:

```text
READY + DESIGN + SELECTED + DIRTY + CURRENT + ONLINE
READY + EXPLORE + READ_ONLY + STALE + ONLINE
READY + SIMULATE + PENDING + CURRENT + ONLINE
DEGRADED + DESIGN + DIRTY + OFFLINE_CACHED
READY + REVIEW + REVISION_DRIFT + MERGE_REQUIRED
```

Do not flatten these into `workspace.status`.

## 8. Complete task flows

### Create / edit

```text
cold-open
 -> loading-definition
 -> ready
 -> select/insert
 -> dirty
 -> validating
 -> autosaving/saving
 -> saved
```

Conflict path:

```text
dirty
 -> external-change-detected
 -> revision-drift
 -> merge-required
 -> reconcile
 -> saved
```

### Simulate

```text
candidate definition
 -> validate
 -> simulation pending
 -> simulation result
 -> inspect evidence/findings
```

Simulation never silently promotes to action.

### Authorize / publish / act / verify

```text
candidate
 -> review
 -> authority check
 -> authorization pending/qualified
 -> execution requested
 -> ACK
 -> verification pending
 -> EFFECTIVE | PARTIAL | FAILED | UNKNOWN
 -> reconcile when needed
```

The command surface must visually and semantically preserve these boundaries.

### Offline recovery

```text
online dirty
 -> connectivity lost
 -> offline draft
 -> reconnect
 -> compare revision/currentness
 -> reconcile or conflict
 -> saved
```

A reconnect must not overwrite dirty local state automatically.

## 9. Cross-workspace semantic navigation

Navigation should preserve semantic identity when the same object can be projected through multiple workspaces.

Example:

```text
Workflow: TicketFlow
 -> Data: entities touched by TicketFlow
 -> Deployment: runtime placement for TicketFlow
 -> Observability: observed execution for TicketFlow
```

Candidate `WorkspaceContext`:

```text
systemIdentity
revision
mode
workspace
semanticSelection[]
primarySelection?
activeLens[]
environment?
currentness
```

Rules:

- workspace switch attempts to preserve semantic selection when representable;
- if the destination cannot represent the selection, it must expose that fact rather than silently selecting another object;
- revision/currentness drift during navigation is surfaced;
- persisted layout does not persist stale authority decisions;
- search/command navigation carries identity, not merely a screen URL.

## 10. Status / Activity bar

The bottom bar exposes ambient workspace facts rather than primary actions.

Candidate fields:

```text
mode
selection summary
revision
currentness
validation/findings
background jobs
connectivity
zoom / semantic level
coordinates where relevant
```

Ambient status must not replace detailed evidence or authority explanation.

## 11. Componentes impact

The `Componentes` inventory should add higher-level artifacts and scenarios:

```text
CommandTabBar
RibbonPanel
RibbonGroup
RibbonCommand
ContextualTab
ToolRail
ToolDrawer
InspectorPanel
PanelDock
StatusBar
WorkspaceShell
FrontendWorkSurface
WorkflowWorkSurface
DataWorkSurface
ArchitectureWorkSurface
TopologyWorkSurface
OperationsWorkSurface
CompleteTaskPage scenarios
```

For `WorkspaceShell`, Componentes should reproduce at least:

```text
ribbon collapsed
ribbon temporary expanded
ribbon pinned
contextual tab appears/disappears
single selection
multi-selection mixed values
read-only
permission limited
dirty/autosave
revision drift
conflict
simulation running
offline draft
fatal child-surface error with recoverable shell
```

## 12. Accessibility and responsive proof obligations

- top tabs/ribbon are keyboard navigable and expose active/expanded state;
- collapsing ribbon does not remove command reachability;
- command palette provides expert discovery but is not the only path for required operations;
- tool rail has accessible names and non-drag insertion alternatives;
- panel open/close restores focus predictably;
- docked/floating panels preserve logical focus order;
- responsive reduction moves commands into discoverable overflow rather than deleting them;
- destructive/authority-sensitive commands require understandable qualification;
- canvas/graph relations have non-pointer alternatives;
- reduced motion does not remove pending/currentness meaning.

## 13. Adversarial scenarios

1. Ribbon collapses while a command is pending: pending state remains observable.
2. Contextual tab disappears because selection changes while keyboard focus is inside it: focus returns predictably.
3. Multi-selection has mixed property values: inspector never renders them as empty/default.
4. Live update arrives while inspector is dirty: local edit is preserved and revision drift exposed.
5. Workspace switch during dirty state: semantic selection and unsaved-work boundary are explicit.
6. Dragging appears to permit an invalid semantic relation: drop is rejected with reason and alternative relation path.
7. Deployment drag creates candidate placement but UI accidentally displays production success: prohibited.
8. Execute receives ACK then loses observation: state becomes verification-pending/unknown, never effective.
9. Responsive collapse hides the only authorization action: prohibited.
10. Fatal work-surface renderer failure: shell retains recoverable draft/context and offers recovery/export evidence path.
11. Offline reconnect sees a newer revision: reconcile before overwrite.
12. Command available from shortcut but blocked in ribbon: prohibited semantic drift; all projections consume the same guard/state.

## 14. Regression scenario candidates

```text
cold-open -> load -> select -> edit -> dirty -> autosave -> saved

dirty -> external update -> revision drift -> conflict -> reconcile -> saved

insert -> drag -> invalid target -> explain -> valid target -> candidate relation

simulate -> pending -> result -> findings -> return to design

publish -> authority check -> request -> ACK -> verify -> effective

publish -> ACK -> observation lost -> unknown -> reconcile -> effective

offline -> local draft -> reconnect -> newer revision -> merge -> saved

multi-select -> mixed inspector -> bulk edit -> partial success -> inspect failures

workspace A selection -> workspace B same identity -> stale revision detected -> refresh/reconcile
```

## 15. Construction B conclusion

The higher-level UI should behave like one professional creation/engineering application, not a collection of unrelated dashboards.

The strongest current candidate is:

```text
stable shell
+ Office-like collapsible command tabs/ribbon
+ narrow left tool rail and drawers
+ specialized work surfaces
+ contextual right inspector/panel dock
+ ambient status/activity bar
+ shared command registry
+ semantic cross-workspace identity
```

This remains a research contract. Exact visual styling, tab density, command grouping and pixel layout require human-guided refinement and later implementation authority.

## Handoff to Documentation

Documentation should next:

1. reconcile this command-surface model with `G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md` application-shell terminology;
2. replace any implication of a permanently expanded generic toolbar with the collapsible tab/ribbon candidate;
3. normalize `Toolbox`, `ToolRail`, `ContextBar`, `Ribbon`, `InspectorPanel`, `PanelDock`, `WorkSurface` and `StatusBar` vocabulary;
4. ensure `G4_UI_INTERACTION_STATE_MATRIX_RESEARCH.md` gains ribbon/context-tab/command-registry state scenarios without duplicating primitive state definitions;
5. register the higher-level artifacts in the future `Componentes` inventory model;
6. preserve `Explore != Design != Simulate != Propose != Authorize != Act != Verify` and `ACK != effect` throughout command semantics;
7. keep exact visual refinement explicitly human-guided and non-binding at this research stage.
