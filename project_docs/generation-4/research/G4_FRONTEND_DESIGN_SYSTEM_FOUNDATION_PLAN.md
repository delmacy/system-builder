# G4 — Frontend Design System & UI Foundation Research Plan

> Detailed semantic 3D composition, tower/floor/onion, hub/handoff and deployment-topology research is consolidated in `G4_MAIN_COMPOSITION_CANVAS_3D_RESEARCH.md`. This plan retains planning obligations; the dedicated artifact carries the cumulative research vocabulary, invariants, adversarials and open questions.

Status: `RESEARCH_PLAN / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-21

## Purpose

Establish the frontend/UI foundation for the System Builder suite before implementation. The goal is a reusable visual and interaction substrate that can serve both the Builder and generated client systems without forcing every system to consume the entire suite.

This plan complements `G4_PRODUCT_UX_AI_NATIVE_BUILDER.md`. That document researches high-level product interaction (Living Canvas, semantic zoom, AI-native interaction, Preview/Sandbox, modes and disclosure). This document focuses on the concrete **Design System / UI Platform foundation**: tokens, primitives, component states, layout, navigation, visual semantics, motion, icons, density, accessibility and the progressive path from generic UI elements to capability/module-specific composites.

Research only. No Next.js app, component installation, Tailwind configuration, shadcn component generation or production code is authorized by this artifact.

## Product principle

```text
Suite breadth
!= activated UI breadth
!= rendered UI complexity
```

A System Builder installation may offer hundreds of capabilities while a particular user/system may expose only a small subset.

```text
Available components
        ↓
Capability/module selection
        ↓
Context + role + mode
        ↓
UI composition
        ↓
Only the relevant interface is rendered
```

The frontend must therefore make complexity **available, not imposed**.

## Working implementation hypothesis

Initial implementation hypothesis, subject to G4 research qualification:

```text
Next.js / React
    +
Tailwind CSS v4
    +
shadcn/ui
    +
accessible primitive layer (Radix/Base UI/React Aria as selected by component)
    +
Lucide icons initially
    +
semantic CSS variables / OKLCH tokens
```

Reasons for the initial shadcn hypothesis:

- source-owned components rather than opaque runtime dependency;
- strong fit with Next.js and monorepos;
- semantic CSS-variable theming;
- composability and easy progressive customization;
- broad primitive set;
- compatible with multiple accessible primitive implementations;
- low cost to start close to the default theme and evolve incrementally.

This is a starting hypothesis, not permanent provider lock-in.

## Initial visual strategy

### Theme v0

Start deliberately close to the current shadcn neutral/default experience rather than inventing a bespoke brand theme before the interaction model is stable.

Candidate baseline:

```text
Style:       shadcn contemporary/default family (prefer current supported preset)
Base color:  neutral
Mode:        light + dark from day one
Radius:      shadcn preset default
Typography:  system/Geist-like neutral sans + mono for technical values
Icons:       Lucide
Density:     comfortable default; compact mode researched later
```

The theme must be token-driven so a later System Builder identity can replace values without rewriting component structures.

## Token architecture

### Layer 1 — raw palette

Raw values are implementation details and must not be referenced directly by product components except inside the token definition layer.

Candidate families:

```text
neutral
blue
cyan
teal
green
lime
amber
orange
red
rose
violet
indigo
```

Exact OKLCH values require contrast and light/dark research before binding.

### Layer 2 — semantic UI tokens

Core primitive theme should target approximately 12 primary semantic channels:

| Token family | Purpose |
| --- | --- |
| background / foreground | application canvas and primary text |
| surface / surface-foreground | panels, cards and contained regions |
| elevated / elevated-foreground | popovers, menus, dialogs |
| primary / primary-foreground | primary action and selected emphasis |
| secondary / secondary-foreground | secondary action |
| muted / muted-foreground | low-emphasis information |
| accent / accent-foreground | hover/contextual emphasis |
| border / input / ring | structural boundaries and focus |
| info / info-foreground | informational state |
| success / success-foreground | successful/healthy state |
| warning / warning-foreground | caution/degraded attention |
| destructive / destructive-foreground | destructive/error state |

Additional System Builder semantic states may later require dedicated tokens rather than overloading generic feedback colors:

```text
candidate
unknown
partial
stale
conflicted
blocked
effective
observed
```

These states must not be encoded by color alone.

### Layer 3 — domain/lens accents

Module/capability colors are distinct from universal status colors.

Examples to research:

```text
workflow
data
identity
documents
infrastructure
observability
security
AI/candidate
commercial
integration
```

A module accent may identify a domain but must never redefine `success`, `warning`, `error`, authority or proof semantics.

`Domain color != operational state != authority`.

### Layer 4 — component tokens

Components derive local tokens from semantic values:

```text
button.primary.background
button.primary.foreground
button.primary.hover
button.primary.active

panel.background
panel.border
panel.elevated

nav.item.hover
nav.item.selected
nav.item.focus

canvas.node.surface
canvas.node.selected
canvas.node.candidate
```

Prefer semantic composition over hardcoded colors inside component files.

## Motion and attention system

Motion is functional, not decorative by default.

Candidate attention vocabulary:

```text
STATIC
HOVER_TRANSITION
FOCUS_RING
SOFT_PULSE
BORDER_PULSE
PROGRESS_MOTION
SKELETON
LIVE_ACTIVITY
CRITICAL_ATTENTION
```

### Soft pulse

Use for bounded asynchronous/liveness states such as:

- waiting for provider response;
- background analysis running;
- synchronization/reconciliation pending;
- live observation indicator.

Never use pulse as proof of health or authority.

### Border pulse

Use sparingly when a region requires attention without replacing textual/icon state, for example:

```text
candidate change awaiting review
live execution selected for observation
unknown/reconciliation pending
critical unresolved item
```

Candidate behavior:

```text
base border
 -> semantic attention border
 -> low-amplitude opacity/ring pulse
 -> static equivalent under reduced-motion
```

### Motion constraints

- respect `prefers-reduced-motion`;
- no fast flashing attention states;
- no continuous animation merely to make the product look active;
- animation cannot be the only representation of state;
- live activity animation must stop or degrade to a static indicator when not relevant;
- mode changes and destructive operations need understandable state transitions, not theatrical motion.

## Icon system

Start with one coherent icon provider (Lucide candidate).

Candidate sizes:

```text
12  micro/meta
14  dense inline
16  normal control
20  toolbar/navigation
24  feature/empty state
32+ illustrative only
```

Rules:

```text
Icon != label
Color != meaning
Icon shape + text + accessible name carry semantics
```

Research and later document a canonical icon map for:

- navigation;
- object types;
- interaction types;
- statuses;
- modes;
- capability families;
- infrastructure;
- evidence/currentness;
- AI/candidate;
- destructive operations.

Do not let individual modules independently choose synonyms for the same semantic action.

## Primitive component foundation

The first implementation wave should remain intentionally generic and module-independent.

### Actions and input

```text
Button
IconButton
ButtonGroup
Toggle / ToggleGroup
Checkbox
RadioGroup
Switch
Input
InputGroup
Textarea
Select
Combobox
DatePicker
Calendar
Slider
FormField
Label
Kbd / ShortcutHint
```

### Feedback and state

```text
Badge
StatusBadge
Alert
InlineMessage
Progress
Spinner
Skeleton
Toast/Sonner
EmptyState
ErrorState
LoadingState
CurrentnessIndicator
```

### Overlays

```text
Tooltip
Popover
HoverCard
DropdownMenu
ContextMenu
Dialog
AlertDialog
Sheet
Drawer
CommandPalette
```

### Structure and display

```text
Card
Panel
Separator
Accordion
Collapsible
Tabs
Table
DataTable
List
Tree candidate
Avatar
Typography
Code/MonoValue
KeyValue
Metric
Pagination
ScrollArea
Resizable/SplitPane
```

## Application shell primitives

Before module screens, establish one consistent shell.

Candidate desktop shell:

```text
┌───────────────────────────────────────────────────────────┐
│ Global Top Bar / Workspace / Search / User / Notifications│
├──────────────┬──────────────────────────────┬─────────────┤
│              │ Context Bar / Breadcrumbs    │             │
│ Primary      ├──────────────────────────────┤ Inspector / │
│ Sidebar      │                              │ Context     │
│              │ Main Work Surface            │ Panel       │
│ capability  │                              │             │
│ navigation  │                              │             │
├──────────────┴──────────────────────────────┴─────────────┤
│ Optional status/activity bar                              │
└───────────────────────────────────────────────────────────┘
```

Shell primitives to research:

```text
AppShell
GlobalTopBar
PrimarySidebar
SidebarSection
WorkspaceSwitcher
SystemSwitcher
Breadcrumbs
ContextBar
PageHeader
TabBar
Toolbar
CommandPalette
InspectorPanel
BottomStatusBar
NotificationCenter
ActivityCenter
ResizableWorkspace
MobileNavigation
```

The shell must support Builder and generated-system profiles without requiring identical navigation.

## Component state matrix

Every interactive primitive should define at least:

```text
default
hover
focus-visible
pressed/active
selected
disabled
read-only
loading
invalid
success when meaningful
warning when meaningful
destructive when meaningful
```

System Builder composites may additionally expose qualified semantic state:

```text
candidate
stale
partial
unknown
conflicted
blocked
effective
superseded
```

Do not force these domain/evidence states into every primitive.

## Surface hierarchy

Research a small, consistent elevation/surface vocabulary rather than arbitrary shadows.

Candidate hierarchy:

```text
L0 app background
L1 workspace surface
L2 panel/card
L3 floating/elevated
L4 modal/critical overlay
```

Elevation may use background difference + border + shadow. Dark mode must be independently validated; simply inverting light values is insufficient.

## Borders and rings

Candidate border vocabulary:

```text
structural border
subtle separator
interactive hover border
selected border
focus ring
attention border
destructive border
drop-target border
candidate/draft border
```

`Focus ring != selected border != attention pulse`.

These states must remain visually distinguishable.

## Typography

Initial target: low-opinionated enterprise/product typography.

Candidate semantic scale:

```text
display
page-title
section-title
subsection-title
body
body-small
label
caption
overline/meta
mono-value
code
```

Avoid using font size alone to express hierarchy; weight, spacing and structure should remain consistent.

## Spacing and geometry

Use a 4px-derived spacing system.

Candidate working scale:

```text
2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48
```

Research density profiles later:

```text
COMFORTABLE
COMPACT
```

Do not implement arbitrary per-screen spacing.

## Navigation model

Initial product navigation must distinguish:

```text
GLOBAL
  suite/workspace/system/account

PRIMARY
  capability/module navigation

CONTEXTUAL
  current object/workflow/system

LOCAL
  tabs/sections within the current task

COMMAND
  search and expert quick actions
```

Navigation labels, icons and ordering should be derived from a registry/configuration layer rather than duplicated in page code.

## Initial primitive pages / environments

Before real module UI, research and later implement a Design System playground with:

```text
Theme tokens
Color/state matrix
Typography
Icons
Buttons
Inputs/forms
Navigation
Panels/cards
Overlays
Tables
Feedback
Motion
Dark mode
Accessibility states
Density
Responsive behavior
```

This becomes the visual proof surface for every future component.

Potential product name: `UI Lab`, `Design System Lab` or `Component Gallery`. Name is not yet binding.

## Composition levels

Use explicit levels so the UI library does not become a random component pile.

```text
L0 TOKENS
colors, typography, spacing, radius, motion, shadows

L1 PRIMITIVES
button, input, badge, dialog, panel, menu

L2 PATTERNS
toolbar, filter bar, search box, page header,
empty state, master-detail, form section

L3 DOMAIN BUILDING BLOCKS
entity card, currentness badge, evidence panel,
actor picker, provider binding row, workflow state chip

L4 MODULE COMPONENTS
helpdesk ticket panel, asset inspector,
workforce availability view, scheduling board

L5 BUILDER / SYSTEM ENGINEERING
Living Canvas, workflow editor, topology view,
definition inspector, diff/review, preview/sandbox,
deployment/observability surfaces
```

Rules:

```text
Higher layer may compose lower layer.
Lower layer must not depend on module/business semantics above it.
```

## Module-driven growth

New complex components should be created only when a real module/task demonstrates repeated semantics.

Example:

```text
Scheduling module
  -> Calendar primitive
  -> Timeline pattern
  -> Resource lane pattern
  -> Availability block domain component
  -> Scheduling board module component
```

Do not invent all future module widgets up front.

## System Builder-specific future components

Research candidates, not first-wave primitives:

```text
SemanticEntityBadge
CapabilityBadge
AuthorityBadge
RevisionBadge
CurrentnessBadge
EvidenceBadge
QualifiedState
FindingIndicator
ProviderBindingCard
ContractInspector
ChangeDiff
ImpactPanel
ProofPanel
Timeline
ActivityFeed
Kanban
Calendar/Scheduler
Tree/Hierarchy
Graph/Canvas Node
Port/Connector
Workflow Node
Workflow Edge
Inspector
LensSwitcher
TopologyNode
DeploymentUnit
RuntimeStatus
PreviewFrame
SimulationControl
AIProposalPanel
UnresolvedQuestionsInbox
```

Each should be traced back to an actual semantic contract before implementation.

## Color/state governance

Color must have controlled semantic ownership.

Proposed separation:

```text
UI semantic colors
  -> action / feedback

domain accent colors
  -> module/lens identity

evidence colors
  -> qualified evidence states

runtime/observability colors
  -> observed operational state
```

Do not reuse one hue to mean unrelated things.

Examples of prohibited ambiguity:

```text
green = selected in one component and healthy in another
red = validation error and destructive action and security criticality without distinction
purple = AI-generated and workflow domain identity simultaneously
```

Research may choose shared hue families, but token names and context must remain distinct.

## Accessibility baseline

Treat accessibility as a primitive acceptance requirement.

At minimum research/validate:

- keyboard navigation;
- visible focus;
- focus not obscured by sticky bars/dialogs;
- target size/spacing;
- non-drag alternatives;
- screen-reader labels and state announcements;
- contrast for text and non-text UI;
- reduced-motion behavior;
- no color-only state;
- logical DOM/focus order;
- zoom/reflow;
- accessible tables/forms/dialogs;
- accessible equivalents for future Canvas/graph interactions.

## Responsive strategy

The Builder is primarily a desktop knowledge-work surface, but primitives must remain responsive.

Candidate profiles:

```text
mobile
tablet
desktop
wide desktop
```

Do not attempt to force full Living Canvas authoring onto small mobile surfaces if the task is not usable there. Mobile may provide observation, approvals, status, quick edits and focused workflows.

## Theme architecture for generated systems

Long-term hypothesis:

```text
SB Base Theme
    ↓
System Theme Profile
    ↓
Organization/Brand Theme
    ↓
Runtime tokens
```

Generated systems may retain the same primitive contracts while using different branding.

Theme override must not change semantic state meaning or accessibility guarantees.

## Research questions for recurring G4 work

The recurring research must investigate before implementation:

1. shadcn/ui current architecture, registry model, theme/preset ownership and upgrade strategy.
2. Radix UI vs Base UI vs React Aria trade-offs by primitive category; no global provider assumption without evidence.
3. design-token architecture and whether W3C Design Tokens Community Group format or similar should inform portability.
4. Tailwind v4/OKLCH color strategy, dark mode, high contrast and theme generation.
5. semantic palette design for 6–16 core channels with accessibility proof.
6. status/domain/evidence/lens color collision avoidance.
7. focus/selection/attention/pulse visual grammar.
8. reduced-motion and animation budgets.
9. icon provider, canonical icon registry and accessibility.
10. component API conventions, variants, slots, data attributes and composition.
11. responsive and density strategy for enterprise applications.
12. application shell/navigation/command patterns.
13. complex data tables, filters, forms, master-detail and inspectors.
14. form architecture and schema-driven rendering without turning schema into UI authority.
15. virtualization and performance for large tables/lists/trees.
16. charts/data visualization and color accessibility.
17. component testing: visual regression, interaction, accessibility and cross-browser.
18. Storybook vs alternative component-lab/documentation approaches.
19. generated-system theming and brand overrides without forking primitives.
20. how Builder-specific semantic states map into visual tokens without becoming source of truth.
21. how module/capability metadata drives navigation, icons, labels and UI composition.
22. how to support future Canvas/workflow/topology components without contaminating L0–L2 primitives.
23. migration/versioning strategy for source-owned shadcn components as upstream evolves.
24. localization/RTL/internationalization implications before APIs freeze.

## Comparative references to research

Compare, without automatic adoption:

```text
shadcn/ui
Radix UI
Base UI
React Aria
Tailwind CSS
Material UI
Ant Design
Mantine
Chakra UI
Fluent UI
Carbon
Primer
Atlassian Design System
Polaris
Storybook
Chromatic
Playwright
axe
Lucide / Tabler / Phosphor
React Flow / XYFlow
Cytoscape
AG Grid / TanStack Table
```

The comparison is not “which library has more components”; it must evaluate source ownership, theming, accessibility, upgrade/migration, bundle/runtime cost, composability, virtualization, SSR/RSC compatibility, testability, licensing/lock-in and fit with generated autonomous runtimes.

## Proof obligations before implementation planning

1. Base theme can change via tokens without rewriting primitive component structures.
2. Light and dark modes preserve semantic meaning and contrast.
3. Semantic status is never encoded only by color or motion.
4. Reduced-motion users receive complete static state.
5. Primitive focus/selected/active/attention states remain distinguishable.
6. Module accent colors cannot overwrite universal status meaning.
7. A generated system can consume only the UI primitives/components it requires.
8. Source-owned shadcn customization has a deliberate upstream-update strategy.
9. Primitive component APIs do not import System Builder business-domain ownership.
10. Layout/navigation can be configured by capability/role/context without hardcoded module coupling.
11. Complex future Canvas/workflow components can compose the same token foundation.
12. Theme/brand override cannot silently weaken accessibility.
13. Component library remains usable without the Builder online.
14. UI projection remains rebuildable from canonical system state.
15. UI state such as selected/open/expanded does not become business truth.
16. Currentness/evidence/authority states remain qualified and traceable when visually represented.
17. Responsive collapse does not silently hide required actions without an alternative path.
18. Component version changes have visual/interaction regression evidence.

## Proposed research-to-build progression

```text
R0 Inventory / benchmark
        ↓
R1 Theme + token research
        ↓
R2 Primitive component research
        ↓
R3 Shell/navigation research
        ↓
R4 Data/form/pattern research
        ↓
R5 UI Lab prototype
        ↓
R6 Module-driven composites
        ↓
R7 Builder-specific engineering components
        ↓
R8 Canvas / workflow / topology product surfaces
```

No stage is automatically promoted by this document.

## First implementation scope candidate

When explicit implementation authority is later granted, the first bounded scope should be only the UI foundation:

```text
Next.js application shell
+ shadcn setup
+ semantic tokens
+ light/dark
+ icons
+ typography/spacing/radius
+ primitive components
+ sidebar/topbar/context bar
+ command/search shell
+ panel/resizable layout
+ feedback/status primitives
+ UI Lab
+ accessibility/visual tests
```

Explicitly exclude from the first implementation scope:

```text
Living Canvas
workflow editor
topology editor
module-specific screens
business logic
provider integration
production data
AI execution
deployment control
```

## Working conclusion

The System Builder frontend should be treated as a **UI Platform**, not a collection of pages.

```text
Stable token language
       +
accessible primitives
       +
repeatable patterns
       +
module-driven composites
       +
Builder-specific engineering surfaces
```

The desired result is a suite with very broad available capability while each system/user sees only the interface required by the active task and context.


## Reference-product synthesis — Photoshop, Budibase, n8n and Canva

This section captures an initial UX/componentization synthesis from four mature visual builders/editors. The goal is not visual imitation; it is extraction of reusable interaction structures for the System Builder.

### Photoshop — workspace, tools, panels and layers

Photoshop provides a strong reference for the **editor workspace** itself:

```text
Application bar
+ tool palette
+ contextual options bar
+ central document/work surface
+ dockable panels
+ layer stack
+ saved workspaces
```

Research takeaways:

- tools are compact, persistent and grouped by function;
- selecting a tool changes the contextual options surface rather than permanently expanding the main UI;
- panels can be docked, grouped, collapsed, reordered or floated;
- layers make independently controllable elements visible, reorderable and hideable;
- saved workspace layouts let different jobs expose different tool/panel combinations.

Candidate SB translation:

```text
TOOL PALETTE
  Select / Pan / Connect / Add / Inspect / Simulate / Measure / Comment

CONTEXT TOOLBAR
  options for the selected tool/object/mode

CENTRAL WORKSPACE
  system composition / view / preview

RIGHT DOCK
  properties / evidence / history / dependencies / layers

LAYER STACK
  architecture/business/system views and editable overlays

WORKSPACE PRESETS
  Frontend / Workflow / Data / Infrastructure / Operations / Audit
```

Important boundary:

`Layer != canonical ownership`.

A Photoshop-like layer metaphor is useful for visibility, composition, ordering and focus, but SB layers may represent **lenses/projections/planes** rather than literal z-order.

### Budibase — component tree, blocks and ejectability

Budibase is a strong reference for **component-to-block composition**:

```text
Primitive Component
      ↓
nested component tree
      ↓
Block (prebuilt composition)
      ↓
Screen
      ↓
Application
```

The notable pattern is that a Block can encapsulate multiple components for speed while still allowing an advanced user to "eject" or expose the constituent components for finer control.

Candidate SB translation:

```text
Primitive
  Button / Input / Card / Grid / Text / Select

Block
  SearchBar / DataTable / LoginForm / EntityEditor

Module block
  TicketBoard / AssetPanel / AvailabilityBoard

Tool surface
  Frontend Builder / Workflow Builder / Data Modeler
```

Candidate invariant:

`Convenience composition != hidden irreversible abstraction`.

Where practical, higher-level visual blocks should remain inspectable/decomposable into their owned lower-level UI composition, while preserving semantic constraints that cannot be safely edited as arbitrary presentation.

### n8n — nodes, connectors, groups and contextual node catalog

n8n is a strong reference for **graph composition**:

```text
Node catalog
   ↓
Node
   ↓
Ports/connectors
   ↓
Connected chain / graph
   ↓
Canvas Group
   ↓
Workflow
```

Research takeaways:

- the next component can be discovered directly from the current connection point;
- the node catalog changes contextually;
- nodes expose compact hover actions instead of permanently visible controls;
- related connected nodes can be grouped and collapsed;
- groups improve readability without replacing constituent nodes;
- direct canvas editing and focused parameter editing can coexist.

Candidate SB translation:

```text
Component/Capability catalog
        ↓
drag/click to place
        ↓
ports declare eligible relations
        ↓
connect
        ↓
group into block/module/process boundary
        ↓
collapse/semantic zoom
```

Potential examples:

```text
FormSubmit
   -> Validation
   -> WorkflowAction
   -> DatabaseWrite
   -> Notification

or

UserView
   -> Query
   -> DataProjection
   -> TableComponent
```

The SB must be stricter than n8n where a connection carries domain/authority/contract semantics:

`Visual connectability != semantic compatibility`.

### Canva — contextual simplicity and progressive disclosure

Canva is a strong reference for making a powerful editor approachable:

```text
persistent side tools
+ central design surface
+ selection
+ contextual quick toolbar
+ deeper edit panel only when requested
+ layers/grouping when needed
```

Research takeaways:

- selecting an element exposes only the actions that matter for that element;
- a compact contextual toolbar provides common edits;
- deeper configuration opens in a dedicated side panel;
- tools/content libraries remain searchable and category-based;
- grouping and layers are available without forcing layer management into every simple task;
- modes such as Edit / Comment / View separate interaction intent.

Candidate SB translation:

```text
Select object
   ↓
Quick actions
   ↓
Context toolbar
   ↓
Optional deep inspector
```

A novice should be able to place a form, table or workflow block without seeing every provider, contract, evidence and deployment property. An expert can open progressively deeper inspectors.

## Proposed SB creative-workspace model

The four references suggest a common product structure:

```text
                    SYSTEM BUILDER WORKSPACE

┌─────────────────────────────────────────────────────────────┐
│ App/System │ Mode │ Revision │ Search │ Run/Preview │ User  │
├──────┬───────────────────────────────────────────┬──────────┤
│      │ Contextual tool/options bar               │          │
│ TOOL ├───────────────────────────────────────────┤ PANEL    │
│ BOX  │                                           │ DOCK     │
│      │                                           │          │
│ UI   │              WORKSPACE / CANVAS           │ Props    │
│ WF   │                                           │ Layers   │
│ DB   │                                           │ Data     │
│ ...  │                                           │ Evidence │
│      │                                           │ History  │
├──────┴───────────────────────────────────────────┴──────────┤
│ status / validation / currentness / background activity    │
└─────────────────────────────────────────────────────────────┘
```

### Toolbox categories

The left-side toolbox is not one flat component list. Candidate top-level tools:

```text
SELECT / NAVIGATE

FRONTEND
  components
  blocks
  forms
  views
  layouts

WORKFLOW / PROCESS
  triggers
  activities
  decisions
  waits
  events
  effects

BUSINESS CORE
  entities
  rules
  calculations
  actors
  authority

DATA
  entities/tables
  relations
  queries
  projections
  transformations
  data flows

CAPABILITIES / MODULES
  capability instances
  providers/bindings
  module blocks

INFRASTRUCTURE
  host/server
  container
  runtime
  storage
  network
  gateway
  external provider

DEPLOYMENT
  release
  deployment unit
  placement
  environment

OBSERVABILITY / OPERATIONS
  metrics
  logs
  traces
  health
  incidents

DOCUMENTATION / EVIDENCE
  notes
  evidence
  requirements
  decisions
```

Each category can expose a searchable component palette. The toolbox remains small; the catalog may be large.

### Component-to-tool hierarchy

The editor should preserve a coherent compositional ascent:

```text
TOKEN
  ↓
PRIMITIVE
  ↓
COMPONENT
  ↓
BLOCK
  ↓
MODULE BUILDING BLOCK
  ↓
TOOL
  ↓
WORKSPACE
  ↓
SYSTEM VIEW
```

Example:

```text
Button + Input + Label
        ↓
FormField
        ↓
FormSection
        ↓
EntityForm Block
        ↓
Frontend/Form Tool
        ↓
View Workspace
```

Another:

```text
Port + NodeCard + StatusBadge
        ↓
WorkflowNode
        ↓
Decision Block
        ↓
Workflow Tool
        ↓
Process Workspace
```

### Layer model hypothesis

The user-facing metaphor may use a Photoshop-like Layers panel, but SB needs typed layer semantics.

Candidate families:

```text
SYSTEM LAYERS
  Business Core
  Process / Workflow
  Capabilities / Modules
  Frontend / Views
  Data / Data Flow
  Integration / Exchange
  Deployment
  Infrastructure
  Observability

OVERLAY LENSES
  Security
  Authority
  Cost
  Capacity
  Evidence
  Currentness
  Complexity
  Change/Diff
```

Critical distinction:

```text
System Layer
!= visual z-index
!= database layer
!= deployment layer
!= semantic owner
```

The Layers panel may control visibility/focus/navigation and potentially scoped editing modes, but it must not invent a false universal hierarchy between concepts whose real relation is graph-like.

### Layer interaction candidates

Each layer/lens row may eventually support:

```text
visible / hidden
focus
lock editing
solo/isolate
opacity/emphasis (visual only)
current revision
findings count
currentness/status
expand/collapse
filter
open in dedicated tool
```

Avoid Photoshop-style arbitrary reordering where order has no semantic meaning. Reordering should only exist for collections where order is genuinely modeled.

### Tool selection and context

Borrowing the Photoshop/Canva pattern:

```text
Selected tool
    +
Selected object(s)
    +
Active system layer
    +
Current mode
    ↓
Contextual toolbar
    +
Inspector schema
```

Example:

```text
Tool: Form
Selected: CustomerForm
Layer: Frontend
Mode: Design

Context toolbar:
  Layout | Fields | Validation | Data Binding | Preview
```

Example:

```text
Tool: Container
Selected: Runtime A
Layer: Deployment
Mode: Inspect

Context toolbar:
  Definition | Placement | Resources | Health | Logs
```

This reduces permanent UI noise while retaining deep capability.

## Workspace presets hypothesis

Photoshop's task-oriented workspaces suggest presets rather than one immutable layout.

Candidate SB presets:

```text
APPLICATION DESIGN
  Components + Views + Forms + Data Binding

PROCESS DESIGN
  Workflow nodes + process layers + execution inspector

DATA MODELING
  Entities + relations + queries + data flow

SYSTEM ARCHITECTURE
  Capabilities + modules + providers + contracts

DEPLOYMENT / INFRA
  Releases + deployment units + hosts + network

OPERATIONS
  Runtime + observability + incidents + currentness

REVIEW / AUDIT
  Diff + evidence + authority + history

FULL ENGINEERING
  user-customized advanced workspace
```

Presets change the visible tool/panel arrangement, not canonical content.

`Workspace preset != permission grant`.

## Research directions derived from these references

Recurring frontend research should now explicitly test:

1. Photoshop-like persistent toolbox vs searchable command palette vs hybrid.
2. Dockable/collapsible panels and whether floating panels are valuable or produce layout chaos in a web product.
3. Typed SB Layers model vs generic Photoshop-style layer list.
4. Workspace presets and user-saved workspace layouts.
5. Budibase-like component tree and whether blocks should support controlled eject/decompose.
6. n8n-like contextual add-node/add-component interaction directly from ports or insertion points.
7. n8n-style collapsible connected groups for workflows/modules, including semantic-boundary constraints.
8. Canva-style quick contextual toolbar + deeper inspector pattern.
9. Multi-selection, grouping and alignment across frontend composition.
10. The relationship between component tree, graph/canvas and typed Layers panel so they do not become three contradictory sources of structure.
11. Searchable component/tool catalog with contextual ranking.
12. Whether one central canvas can switch between Frontend/Workflow/Data/Infra layers or whether some layers require specialized work surfaces sharing the same shell.
13. Semantic zoom from System -> layer -> module/block -> component.
14. Keyboard/tool shortcuts inspired by creative software without making discoverability dependent on shortcuts.
15. Inspect/Edit/Simulate/Preview/Operate/Audit workspace modes and safe transitions.
16. User-role-specific workspace presets without confusing role visibility with authorization.

## Initial synthesis

The strongest candidate is **not** one universal free-form canvas.

It is a Photoshop-like **stable editor shell** containing multiple specialized but interoperable tools:

```text
Stable Workspace Shell
       +
Toolbox
       +
Context Toolbar
       +
Dockable Panels
       +
Typed Layers/Lenses
       +
Specialized Work Surface
       +
Component/Block Catalog
```

The central work surface can behave differently depending on the active tool:

```text
Frontend      -> layout/component canvas
Workflow      -> graph canvas
Data          -> entity/relation/data-flow surface
Architecture  -> capability/module graph
Deployment    -> topology/placement surface
Operations    -> observability/runtime surface
```

This preserves one learnable product workspace while avoiding the false assumption that every System Builder concern should use the same interaction grammar.

## Research delta — projection navigation and high-cardinality collections (2026-09-22)

Dedicated artifact: `G4_FRONTEND_PROJECTION_NAVIGATION_CONTRACT_RESEARCH.md`.

Material refinements:

- `Inventory / Catalog -> Map / System Slice -> Graph / Relations -> Inspector` is now a candidate **shared navigation protocol**, not four independent selection models.
- Existing `ViewportContext` remains the bounded semantic materialization concept; a candidate navigation context expresses user focus/navigation intent and composes into materialization rather than replacing it.
- `System Slice` is explicitly a UI projection taxonomy and must not become a new Master Blueprint plane, bounded context, deployment boundary or semantic owner.
- `Lens != filter != authorization != slice membership`.
- `Workspace` is a task-oriented tool/panel/surface arrangement; `Saved View` is a persisted projection preference. Both re-evaluate authorization/disclosure/currentness when reopened.
- collection surfaces must distinguish `focus`, `selection`, `primary semantic focus`, `activation` and `hover`.
- Grid/List/Inspector are candidate projections over one catalog collection identity model; changing browse mode cannot change canonical status/eligibility/currentness truth.
- stable taxonomy/pins must remain separate from adaptive suggestions/recent/context ranking so recommendation updates do not destroy spatial memory or steal focus.
- contextual eligibility should research `ELIGIBLE / INELIGIBLE(reason) / UNKNOWN` rather than binary hide/show where disclosure permits.
- large catalogs should use collection navigation and bounded/incremental materialization rather than one page tab stop per item.
- n8n Canvas Groups provide useful evidence for separating durable/shared grouping from user-local collapsed/expanded projection state.

Candidate scale scenarios to prototype, not fixed thresholds:

```text
~20 items
  labeled grid/cards

~100 items
  grid/list + search/filter + stable categories

~500 items
  list/search dominant + virtualization/incremental materialization

~2,000 items
  search/command/context insertion dominant + bounded query-backed results
```

Primitive-base qualification must now score **simple primitives**, **collection primitives** and **engineering surfaces** separately. Current shadcn evidence (July 2026) makes Base UI the leading new-project default candidate; React Aria is first-class and has especially explicit collection semantics; Radix remains supported and mature. The design-system direction remains one default base plus evidence-backed exceptions, not provider-by-widget mixing.

Additional proof obligations:

1. Cross-surface navigation preserves canonical identity while re-evaluating disclosure/currentness.
2. Saved Views cannot preserve stale authorization as visibility.
3. Focus and selection remain visually/programmatically distinct in grid/list/tree/graph surfaces.
4. High-cardinality catalogs remain keyboard navigable without tab-stop explosion.
5. Adaptive ranking cannot silently reorder stable user landmarks or move focus.
6. Essential graph relations have a non-spatial inspection/navigation path.
7. Primitive-base exceptions require documented coverage evidence.


## Mandatory Component Inventory Page

The future System Builder frontend must maintain a first-class page named **Componentes**.

This is not only documentation. It is the canonical **UI inventory / component catalog surface** for every reusable visual element already created in the product, from the smallest primitive to complete composed work surfaces.

Candidate route/name:

```text
Componentes
```

Possible technical route later:

```text
/components
```

The route is not binding yet; the product-facing name **Componentes** is.

### Purpose

```text
Discover
Inspect
Compare
Test
Reuse
Compose
Verify
Document
```

The page should answer:

- What UI elements already exist?
- At what composition level?
- Which variants/states exist?
- Which modules/workspaces use them?
- What can be composed from them?
- What is stable, experimental, deprecated or superseded?
- What are the accessibility and interaction expectations?
- What theme/motion/icon tokens does the element consume?

### Inventory hierarchy

The page must preserve the UI composition ladder:

```text
L0 TOKENS
L1 PRIMITIVES
L2 COMPONENTS / PATTERNS
L3 DOMAIN BUILDING BLOCKS
L4 MODULE COMPONENTS
L5 TOOLS / WORKSPACES / CANVASES
```

Examples:

```text
Badge
StatusBadge
Button
Input
Card
Panel
FormField
FormSection
EntityForm
DataTable
Inspector
Toolbox
WorkflowNode
WorkflowCanvas
TopologyWorkspace
SystemMap
```

A complete Canvas/Workspace is still a component in the broad inventory sense and must remain inspectable from the same catalog, even if it is rendered through a dedicated preview surface.

### Component record

Every reusable UI element should eventually expose metadata similar to:

```text
ComponentRecord
  id
  name
  category
  compositionLevel
  status
  description
  visualPreview
  variants[]
  states[]
  dependencies[]
  tokenRefs[]
  iconRefs[]
  accessibilityNotes[]
  usedBy[]
  composedOf[]
  relatedComponents[]
  version/revision
  sourceLocation
  testEvidence[]
```

This metadata is a UI/documentation registry and does not become business-domain canonical truth.

### Page interaction

Candidate layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ Componentes | Search | Level | Category | Status | Theme   │
├──────────────┬──────────────────────────────┬───────────────┤
│ Inventory    │ Preview / Gallery            │ Inspector     │
│              │                              │               │
│ Tokens       │ selected component rendered  │ metadata      │
│ Primitives   │ all states/variants          │ usage         │
│ Patterns     │ interaction demo             │ composition   │
│ Blocks       │ responsive/dark/light        │ a11y/tests    │
│ Modules      │                              │ source refs   │
│ Workspaces   │                              │               │
└──────────────┴──────────────────────────────┴───────────────┘
```

The user should be able to:

```text
search
filter
group
preview
toggle light/dark
toggle density
toggle reduced motion
inspect all states
inspect responsive behavior
see composed-of / used-by
open source/registry metadata
copy/use the element in an eligible composition context
```

### Component lineage

The inventory should make composition lineage visible:

```text
Button
 + Input
 + Label
    ↓
FormField
    ↓
FormSection
    ↓
EntityForm
    ↓
Frontend Form Tool
    ↓
Application Workspace
```

And in graph tooling:

```text
Port
 + NodeCard
 + StatusBadge
    ↓
WorkflowNode
    ↓
DecisionBlock
    ↓
WorkflowCanvas
```

This enables developers and users to understand how complex tools are built from smaller reusable units.

### UI Lab relationship

The previously proposed `UI Lab` should not become a separate competing concept.

Candidate resolution:

```text
Componentes
  ├ Catalog
  ├ Gallery
  ├ Playground
  ├ States
  ├ Accessibility
  ├ Responsive
  ├ Theme
  └ Composition lineage
```

In other words, **Componentes becomes the permanent product-facing evolution of the UI Lab idea**.

### Governance

Rules:

```text
New reusable UI element
  -> register in Componentes inventory

New variant/state
  -> visible in Componentes

New composed block
  -> composedOf lineage visible

New module component
  -> usedBy/owner metadata visible

Deprecated component
  -> never silently disappears from inventory history
```

Candidate lifecycle:

```text
EXPERIMENTAL
CANDIDATE
STABLE
DEPRECATED
SUPERSEDED
```

Component lifecycle status is about the UI artifact, not business-system runtime status.

### Generated systems

Research whether generated client systems should optionally expose a **Componentes** page in development/admin mode.

Possible model:

```text
System Builder
  -> complete component inventory

Generated runtime (development/admin)
  -> only component dependency closure used by that system
```

This would preserve the suite principle:

`Available Component Set != Runtime Component Set`.

### Proof obligations

1. Every reusable component can be discovered from the Componentes inventory.
2. The inventory spans primitive -> component -> block -> module -> workspace/canvas.
3. Component previews do not become separate production implementations.
4. Previewed state matches the actual component implementation/revision being cataloged.
5. Deprecated/superseded UI elements remain traceable.
6. Theme, density, responsive and reduced-motion behaviors are testable from the inventory.
7. Composition lineage remains inspectable.
8. Generated systems need only carry inventory/runtime material for their dependency closure unless explicitly configured otherwise.
9. Component catalog metadata does not become canonical business truth.
10. The Componentes page can serve as a regression and design-review surface for future UI development.


## Frontend stack decision — Next.js ecosystem

Decision status: `DECIDED FOR G4 FRONTEND DIRECTION`

The frontend/UI platform will remain in the **Next.js / React / TypeScript ecosystem**.

Primary implementation direction:

```text
Next.js
+ React
+ TypeScript
+ Tailwind CSS
+ shadcn/ui or equivalent source-owned React components
+ accessible React primitives
+ JS/TS-native graph/canvas/rendering libraries as qualified
```

WebAssembly is **not** part of the frontend architecture target.

If future benchmark evidence reveals a computational hotspot, the preferred escalation order is:

```text
React/TypeScript
  -> algorithm/data-structure improvement
  -> virtualization / bounded rendering
  -> Web Worker / off-main-thread JS
  -> renderer specialization (SVG/Canvas/WebGL)
  -> only then consider isolated non-UI computational specialization
```

Such specialization must remain behind a contract and must not redefine the frontend stack or component model.

`Rendering technology != computation technology`.

`Complex UI != justification for WASM`.

## Product-development priority order

The primary goal of frontend engineering is not visual polish. It is to produce correct, consistent and composable interaction behavior.

Priority order:

```text
1. FUNCTION
2. STATE
3. TRANSITION
4. COMPOSITION
5. CONSISTENCY
6. REPRESENTATION
7. ACCESSIBILITY
8. PERFORMANCE
9. VISUAL REFINEMENT
```

Visual refinement remains important, but it is deliberately treated as a human-guided iterative layer after functional and semantic behavior is stable enough to evaluate.

### Functional-first rule

For every UI element, define before visual refinement:

```text
what it does
what inputs it accepts
what outputs/effects it produces
what states it can enter
what transitions are valid
what transitions are invalid
how it fails
how it recovers
what authority is required
what data/currentness it represents
how it composes with other elements
what accessibility behavior is required
```

Only then refine:

```text
spacing
colors
shadows
radius
animation amplitude
icon treatment
visual hierarchy
brand personality
micro-interaction polish
```

### State-first component contract

Every reusable component should eventually have an explicit interaction contract:

```text
ComponentContract
  purpose
  inputs
  outputs
  events
  states
  transitions
  guards
  invalidTransitions
  asyncSemantics
  failureSemantics
  recoverySemantics
  authorityRequirements
  accessibilityBehavior
  compositionRules
  representationRules
```

This is a UI/product contract, not business-domain canonical authority.

### Representation consistency

A semantic state should not be represented differently without reason across modules.

Examples:

```text
STALE
  -> same semantic meaning everywhere

UNKNOWN
  -> never rendered as ordinary success

BLOCKED
  -> distinct from DISABLED

PENDING
  -> distinct from EFFECTIVE

SELECTED
  -> distinct from FOCUSED

READ_ONLY
  -> distinct from PERMISSION_DENIED
```

Components may vary visually by context, but the semantic meaning must remain stable.

### Composition consistency

A composed element may add states and transitions, but it must not silently redefine the state contracts of its primitives.

```text
Primitive semantics
  -> preserved inside Pattern
  -> preserved inside Block
  -> preserved inside Module Component
  -> preserved inside Tool
  -> preserved inside Workspace
```

Higher-level composition may constrain or specialize behavior, but must do so explicitly.

### Human visual refinement loop

The intended workflow is:

```text
functional component
  -> state/transition validation
  -> composition validation
  -> interaction review
  -> accessibility review
  -> visual review with human
  -> refinement
  -> regression evidence
```

The user/designer may iteratively tune the visual system after the behavior is concrete.

This preserves the rule:

`Visual preference may change without invalidating interaction semantics`.

## Consequence for Componentes

The mandatory **Componentes** page becomes the primary validation surface for this functional-first approach.

Every item should emphasize, in this order:

```text
Purpose
Behavior
States
Transitions
Failure/Recovery
Composition
Accessibility
Representation
Variants
Visual styling
```

The page should make it possible to inspect a component before visual polish is final.

Candidate maturity model:

```text
FUNCTIONALLY_DEFINED
STATE_DEFINED
COMPOSITION_VALIDATED
ACCESSIBILITY_VALIDATED
VISUALLY_REFINED
STABLE
```

This maturity model is separate from business/system runtime state.

## Frontend invariants added by this decision

- `Frontend platform = Next.js/React/TypeScript ecosystem`.
- `WASM != frontend requirement`.
- `Functionality before ornament`.
- `State semantics before visual treatment`.
- `Composition must preserve lower-level interaction contracts`.
- `Visual inconsistency must not imply semantic inconsistency`.
- `Semantic consistency may survive visual redesign`.
- `Human visual refinement != architecture rewrite`.
- `Component complete != visually polished`.

## Shell command surface decision — collapsible Office-style ribbon

Decision status: `DECIDED FOR G4 FRONTEND DIRECTION`

The System Builder shell should use a **compact, collapsible Office-style ribbon** rather than a permanently expanded wall of commands.

### Structure

```text
Application Bar
  System / Revision / Environment / Global Search / User

Ribbon Tabs
  Arquivo
  Início
  Inserir
  Organizar
  Relacionar
  Ferramentas
  Sistema
  Executar
  Revisar
  Exibir
  Janela
  Ajuda

Contextual Tabs
  appear only when the current selection/tool/workspace requires them

Ribbon Content
  grouped commands for the active tab

Tool Rail
  compact vertical icon rail on the left

Work Surface
  center

Inspector / Properties
  right

Status Bar
  bottom
```

### Ribbon behavior

Required states/behaviors:

```text
EXPANDED
COLLAPSED
AUTO_OPEN_ON_TAB
PINNED
CONTEXTUAL_TAB_ACTIVE
KEYBOARD_NAVIGATION
COMMAND_SEARCH
```

Working hypothesis:

- the tab row remains visible;
- ribbon command content may collapse to maximize canvas area;
- clicking a tab temporarily opens its command groups;
- the user may pin the ribbon open;
- contextual tabs appear only when relevant;
- a command may also be reachable from context menu, shortcut or command palette through the same command registry;
- keyboard navigation and visible focus are mandatory.

### Candidate tabs and groups

**Arquivo** — novo, abrir/trocar sistema, duplicar, importar, exportar, snapshots, documentação, configurações do sistema.

**Início** — clipboard, undo/redo, selection, quick insert, group/ungroup, delete, common validation and common view controls.

**Inserir** — components, blocks, capabilities, workflow nodes, entities, relations, APIs, providers, infrastructure elements, notes and groups.

**Organizar** — align, distribute, group, semantic order where meaningful, lock, isolate, snap/grid and auto-layout.

**Relacionar** — connect, relation, handoff, data binding, dependency, dependents and dependencies.

**Ferramentas** — select, pan, connect, inspect, measure, comment, validate, simulate and compare.

**Sistema** — SystemDefinition, revision, environment, diff, validation, preview, build configuration, capability resolution and provider/binding views.

**Executar** — validate, dry-run, simulate, run selected, reconcile, cancel, build candidate and publish candidate.

**Revisar** — findings, candidate changes, evidence, comments, diff, approvals, conflicts and currentness.

**Exibir** — zoom, grid, snap, labels, minimap, layers, lenses, connection types, density and full screen.

**Janela** — Properties, Layers/Lenses, History, Evidence, Dependencies, Activity, Notifications, diagnostics and saved workspace layouts.

**Ajuda** — documentation, shortcuts, command reference, diagnostics and about.

`Arquivo` may later use a Backstage-like full surface if project-level operations prove too dense for an ordinary ribbon dropdown.

### Contextual tabs

Contextual tabs are a core rule.

```text
Selected: Form
  -> Formulário
     Fields | Layout | Binding | Validation | Events | Permissions | Preview

Selected: Workflow node
  -> Workflow
     Inputs | Outputs | Conditions | Retry | Failure | Effects | Simulation

Selected: Entity
  -> Dados
     Fields | Relations | Constraints | Queries | Lineage | Quality

Selected: Container/Host
  -> Deployment / Infra
     Placement | Resources | Network | Secrets | Health | Cost | Logs
```

### Command registry requirement

Ribbon items must not own behavior independently.

```text
Command Registry
  -> Ribbon
  -> Context Menu
  -> Shortcut
  -> Command Palette
  -> Inspector Action
```

One command identity may appear in multiple surfaces but must preserve one guard/state/execution contract.

Candidate command states:

```text
ENABLED
DISABLED
BLOCKED
PENDING
HIDDEN_BY_CONTEXT
```

A blocked command should provide a discoverable reason when possible.

### UX invariants

- `Ribbon tab != permission grant`.
- `Collapsed ribbon != action removal`.
- `Contextual tab != semantic ownership`.
- `Same command identity != duplicated behavior implementation`.
- `Hidden by context != unauthorized`.
- `Disabled != blocked`.
- `Toolbar presence != action eligibility`.
- `Visual grouping != business-domain ownership`.

### Componentes inventory impact

The **Componentes** page must catalog and test:

```text
Ribbon
RibbonTab
RibbonGroup
RibbonCommand
RibbonDropdown
RibbonSplitButton
RibbonContextTab
RibbonCollapseControl
CommandPalette
ContextMenu
ShortcutHint
CommandStateIndicator
```

Required states include:

```text
default
hover
focus-visible
active-tab
expanded
collapsed
pinned
temporary-open
disabled
blocked
pending
hidden-by-context
overflowed
keyboard-navigation
reduced-motion
responsive
```

The ribbon is a compositional tool surface built from lower-level primitives, not a one-off shell implementation.

## Main Composition Canvas — semantic 3D direction

Decision status: `PLANNED G4 FRONTEND DIRECTION`

The future main composition canvas should support a **semantic, guided and performance-bounded 3D mode**.

The goal is architectural comprehension, not visual spectacle.

`3D semantic != 3D decorative`.

### Architectural split

```text
Next.js / React / TypeScript shell
  ├─ Application Bar / Ribbon / Tool Rail / Inspector / Status Bar -> DOM
  └─ Main Work Surface -> specialized 2D or 3D projection
```

The surrounding UI remains ordinary accessible React UI. The 3D renderer is limited to the work surface.

### 3D semantic mapping

Candidate geometric semantics:

```text
X axis
  = module/context composition and horizontal relationships

Y axis
  = system floors/spheres
    Business/Core
    Workflow/Process
    Data
    Security/Governance
    Deployment/Runtime
    Infrastructure
    Observability/Operations

Z axis / radial depth
  = semantic distance from the core
    Core
    Contracts/Ports
    Providers/Bindings
    Adapters/Drivers
    Gateways/Views/External Providers
```

Cross-cutting capabilities may be represented as vertical shafts/elevators traversing several floors.

Work progression and handoffs may be represented as corridors connecting valid doors/counters/gates.

### Module representation

A module remains one semantic identity.

Candidate module interaction:

```text
Module Node
  -> click
Expanded Module Workbox
  -> faces such as
     Overview
     Capabilities/Services
     Entry Points/Counters
     Contracts/Ports
     Dependencies/Relations
     Providers/Bindings
     Adapters/Drivers
     Plugins/Extensions
     Configuration
     Data
     Events/Workflow
     Security/Authority
     Runtime/Deployment
     Observability
     Evidence/History
```

Horizontal `+` ports represent qualified composition/relationship opportunities with other modules.

Vertical `+` ports represent additional manifestations of the same module across floors/spheres.

`Horizontal composition != vertical manifestation`.

### Doors, counters, corridors and gates

```text
Door
  = admissible boundary / contract entry

Counter
  = service/action request surface exposed by the capability/module

Corridor
  = allowed or expected work progression

Handoff
  = explicit transfer of responsibility/control/context

Gate
  = prerequisite verification before progression

Evidence
  = proof that a required passage, acceptance or effect occurred
```

The 3D mode should be capable of showing these semantics without requiring all details to be rendered simultaneously.

### Guided navigation

The default 3D interaction should be guided rather than unrestricted CAD/game navigation.

Candidate camera/view modes:

```text
ISOMETRIC
TOP
FRONT
FLOOR
MODULE
CAPABILITY
CORRIDOR
```

Orbit/free navigation may exist as an advanced mode, but should not be required for normal use.

Selection and semantic identity must survive view changes.

### Projection parity

3D does not replace other maps.

```text
2D Composition
3D Building/Onion
Relation Graph
Capability Map
Corridor/Handoff Map
Workflow Canvas
Topology Map
Floor View
```

All should remain projections of the same canonical model.

`3D Canvas != canonical authority`.

### Performance strategy

Performance should be designed from the start around a bounded engineering visualization workload.

Preferred escalation order:

```text
simple geometry
-> selective labels/details
-> semantic zoom / progressive disclosure
-> instancing for repeated geometry
-> level of detail
-> clustering/aggregation
-> viewport/frustum culling
-> render-on-demand / minimal animation
-> Web Worker for heavy layout/analysis
-> renderer specialization only when measured
```

Explicitly avoid as default:

```text
realistic reflections
volumetric lighting
heavy particles
depth of field
motion blur
complex PBR materials
dynamic shadows everywhere
continuous decorative animation
```

### Progressive disclosure

Candidate detail levels:

```text
DISTANT
  module/context silhouette and high-level status

MID
  module identity, capability participation, principal relations

NEAR
  doors, counters, ports, contracts, handoffs, gates, labels and state detail

SELECTED
  full inspector-backed semantic detail
```

Do not force all detail into the 3D surface. Deep configuration remains in the React inspector/right panel.

### Candidate implementation research direction

Stay inside the frontend decision:

```text
Next.js
+ React
+ TypeScript
+ specialized React-compatible 3D renderer
```

Candidate technologies may include Three.js / React Three Fiber, subject to benchmark and accessibility/maintainability review.

This does not authorize package adoption or implementation.

### Initial benchmark scenarios

Research and prototype planning should include at least:

```text
NORMAL SCENE
  50-200 modules
  5-10 floors
  hundreds of relations
  hundreds of ports/handoffs
  thousands of simple visible primitives

STRESS SCENE
  ~1000 modules
  several thousand relations
  forced aggregation/clustering
```

Desired UX properties:

- navigation remains smooth enough for engineering work;
- selection response feels immediate;
- inspector response is immediate after selection;
- hidden/reduced detail does not change semantics;
- large scenes degrade through aggregation rather than interaction failure.

### Accessibility and alternate representations

Every meaningful 3D relationship must have a non-3D equivalent representation where practical.

Provide:

- keyboard-reachable selection;
- textual/list representation of selected relations;
- non-color semantic indicators;
- alternate 2D/graph/table views;
- meaningful focus behavior in the surrounding DOM UI;
- no requirement for free-form camera control to complete a core task.

### New planning invariants

- `3D semantic != 3D decorative`.
- `3D Canvas != canonical authority`.
- `Rendering technology != computation technology`.
- `3D mode != mandatory interaction mode`.
- `Semantic identity survives projection changes`.
- `Horizontal composition != vertical manifestation`.
- `Capability shaft != ownership hierarchy`.
- `Corridor != generic edge`.
- `Door/Counter != arbitrary connection point`.
- `Detail level may change; semantic meaning may not`.
- `Large-scene degradation -> aggregation, not silent omission`.

### Planning consequence

Future frontend research packets should explicitly evaluate:

1. 3D scene graph semantics for module/floor/radial depth representation.
2. How module Workboxes expand without visual overload.
3. Horizontal module ports vs vertical floor-manifestation ports.
4. Doors/counters/corridors/gates/handoffs in 3D.
5. Capability shafts across floors.
6. Cross-projection identity preservation.
7. Guided camera/navigation modes.
8. LOD, instancing, clustering, culling and render-on-demand strategy.
9. Accessibility and 2D/list fallbacks.
10. Normal/stress performance benchmark definitions.

## Deployment Topology Extension — Basement Split, Twin Towers & Placement Grouping

Decision status: `PLANNED G4 FRONTEND DIRECTION`

The 3D Main Composition Canvas should support a deployment/topology projection in which **server/host foundations act as basements** and module/runtime manifestations rise from them as towers.

### Semantic distinction

```text
Module Identity
!= Deployment Placement
!= Runtime Instance
!= Visual Grouping
```

A module remains one semantic identity even when materialized on multiple hosts.

### Server / basement representation

A server/host may be represented as the physical/logical foundation from which deployed module manifestations emerge.

```text
SERVER / HOST
  = deployment foundation / basement

TOWER
  = deployed manifestation of a module/capability on that host

FLOOR MANIFESTATION
  = sphere-specific face of that deployed manifestation
```

The basement may be visually split/revealed to expose relevant infrastructure/runtime data such as CPU, memory, runtime, network, storage, placement, region/zone and deployment-unit identity.

### Twin towers / availability grouping

When the same logical module/capability is deployed on multiple hosts for availability or scale, the canvas may visually approximate/group those towers.

Candidate semantic group types:

```text
AVAILABILITY_PAIR
ACTIVE_ACTIVE
ACTIVE_PASSIVE
REPLICA_SET
WORKER_POOL
SHARD_GROUP
REGIONAL_REPLICA_GROUP
VISUAL_GROUP_ONLY
```

`Visual proximity != deployment merge`.

`Visual similarity != semantic equivalence`.

Grouping two towers must never silently imply they are equivalent, synchronized, failover-compatible or authoritative peers.

### Compatibility before semantic grouping

Before offering an availability/twin grouping, research whether the following must be compatible or explicitly qualified:

```text
semantic module identity
contract set / contract revision
authority model
configuration class
tenant / classification scope
deployment role
provider/binding compatibility
state synchronization expectations
failover semantics
data/currentness guarantees
```

If two towers look alike but differ semantically, the canvas should represent the drift rather than flatten it.

Candidate drift states:

```text
CONTRACT_DRIFT
REVISION_DRIFT
CONFIGURATION_DRIFT
AUTHORITY_DRIFT
PLACEMENT_DRIFT
HEALTH_DRIFT
STATE_SYNC_UNKNOWN
INCOMPATIBLE_FOR_TWIN_GROUP
```

### Shared logical crown / service identity

Research a compact representation where multiple runtime towers can share one logical module/service identity above them.

```text
Logical Module / Service Identity
          |
      +---+---+
      |       |
 Instance A  Instance B
      |       |
 Server A   Server B
```

This is a projection only. The visual crown must not become canonical ownership.

### Shared contract surface

When multiple instances genuinely expose the same qualified contract surface, the UI may aggregate that contract surface visually above the instances.

```text
Shared Contract Surface
        |
   +----+----+
   |         |
Instance A Instance B
```

If contract revisions/guarantees differ, aggregation must break or become explicitly qualified.

### Drag semantics

Drag-and-drop in deployment/topology views must distinguish at least three intentions:

```text
DRAG_TO_ARRANGE
  = changes visual layout only

DRAG_TO_GROUP
  = proposes/creates an explicit semantic or visual grouping

DRAG_TO_DEPLOY
  = changes desired placement/topology
```

`Arrange != Group != Deploy`.

`Drag proximity must not mutate topology`.

Deployment mutation requires explicit action/confirmation and impact review.

### Desired / observed / effective placement

Placement views should preserve:

```text
DESIRED_PLACEMENT
OBSERVED_PLACEMENT
EFFECTIVE_PLACEMENT
```

A desired move/group must not be rendered as effective before verification/reconciliation.

Candidate states include:

```text
PLACEMENT_PENDING
PLACEMENT_EFFECTIVE
PLACEMENT_DRIFT
RECONCILIATION_REQUIRED
UNKNOWN_EFFECT
PARTIAL_PLACEMENT
```

### Hub locality

Research hub classification by topology:

```text
INTRA_HOST_HUB
INTER_HOST_HUB
EXTERNAL_PROVIDER_HUB
CROSS_SYSTEM_HUB
```

Transport may vary by placement, but:

`Transport != Contract`.

The same logical contract may be realized through in-process call, IPC, HTTP/gRPC, broker, stream or other qualified transport without changing semantic identity, while still exposing operational differences that matter.

### Layout projections

The same deployment truth may be arranged by:

```text
Server / Host
Module
Capability
Availability Group
Environment
Region / Zone
System
Deployment Unit
```

Changing arrangement changes projection, not semantic identity.

### Progressive disclosure / LOD

At distance, replica groups may collapse into aggregate towers/cards such as:

```text
AUTH
x4 instances
3 healthy / 1 degraded
availability group
```

Near/selected views may explode the group into individual towers and basement placement.

`Aggregation != silent omission`.

### Componentes impact

Plan inventory/state coverage for at least:

```text
ServerBasement
ServerBasementSplit
DeploymentTower
TowerReplica
TwinTowerGroup
AvailabilityGroup
LogicalServiceCrown
SharedContractSurface
PlacementLink
DesiredPlacementIndicator
ObservedPlacementIndicator
EffectivePlacementIndicator
PlacementDriftIndicator
GroupingCandidate
GroupingCompatibilityInspector
DeploymentImpactPreview
```

### New invariants

- `Module Identity != Deployment Placement != Runtime Instance`.
- `Visual proximity != deployment merge`.
- `Visual similarity != semantic equivalence`.
- `Arrange != Group != Deploy`.
- `Drag proximity must not mutate topology`.
- `Desired placement != observed placement != effective placement`.
- `Shared contract surface requires qualified compatibility`.
- `Availability grouping != ownership merge`.
- `Transport != Contract`.
- `Aggregation != silent omission`.

### Planning obligations

Future planning/research packets involving topology/deployment must evaluate:

1. basement/server split grammar;
2. module tower placement on hosts;
3. twin/replica grouping compatibility;
4. availability/HA semantics;
5. desired/observed/effective placement visualization;
6. drag-to-arrange vs drag-to-group vs drag-to-deploy;
7. contract/config/authority/version drift between replicas;
8. shared service/crown and contract-surface aggregation rules;
9. inter-host/intra-host/external/cross-system hubs;
10. LOD/aggregation behavior for large replica groups.


## Explicit scope — OS-style screen/window composition

The frontend planning scope includes a dedicated **Window & Screen Composition System**.

Future research/planning must decompose and qualify:

- SystemDesktop and ModuleLauncher;
- WindowManager;
- ModuleWindow contract;
- open/close/minimize/maximize/restore;
- move/resize;
- dock/snap/split/tab groups;
- multiple windows per module;
- taskbar/open-window/background indicators;
- ScreenComposer and WorkspaceComposer;
- saved/restorable workspace layouts;
- cross-window revision/currentness/dirty-state rules;
- Ribbon/Inspector/Command Registry integration;
- System Map / 3D Canvas synchronization;
- suspend/hibernate/lazy-load lifecycle;
- responsive/small-screen fallback;
- accessibility and non-drag equivalents;
- performance budgets and resource-pressure behavior.

Planning must preserve:

\`Module installed != Module loaded != Module rendered != actively updating\`.

\`Window layout != semantic topology\`.

\`UI lifecycle != module lifecycle != deployment lifecycle\`.

A complete task surface may be composed from multiple module windows instead of one monolithic route/page.


## Priority external benchmarks for OS-like shell

Frontend research/planning must explicitly benchmark:

- **Puter** for modern web-desktop UX, window/taskbar/app-launch behavior and desktop integration;
- **OS.js** for window-manager/application architecture, application APIs, session restore, shared services and React-capable application/window integration;
- **daedalOS** for rich browser-desktop interaction, context menus, drag/drop, multi-window behavior and desktop spatial navigation.

These are benchmarks only.

Planning must extract portable primitives/contracts/states and reject incompatible assumptions. No benchmark is an implementation authority or automatic dependency choice.


## Research obligation — React/Next base vs desktop/windowing frameworks

Planning must compare three strategies before implementation:

1. System Builder-owned WindowManager on \`Next.js + React + TypeScript\`;
2. external web-desktop/windowing engine behind an SB-owned adapter/contract;
3. external desktop framework owning the shell, used only as a comparison baseline unless evidence strongly justifies the ownership shift.

The current frontend base remains \`Next.js + React + TypeScript\`.

Required comparison dimensions: startup/bundle/memory, lazy loading, background/suspended windows, focus/z-order, docking/snap/split, session restore, crash recovery, accessibility, small screens, React/Next integration, routing/SSR boundaries, Command Registry/Ribbon/Inspector integration, 3D WorkSurface embedding, Factory Module compatibility, theming, testing, replaceability, lock-in and security boundaries.

Preserve:

\`Desktop metaphor != desktop framework dependency\`.

\`Window Manager != UI framework\`.

\`React renderer != module/window semantic authority\`.

\`External window library != System Builder semantic owner\`.


## Research obligation — application portfolio and mature-tool reuse

Frontend planning must produce an **Application Portfolio Matrix** instead of assuming every capability becomes a page or every module becomes exactly one application.

Required distinctions:

~~~
Module != Capability != Application != Window
~~~

Classify candidates as NATIVE_SB_APP, API_BACKED_SB_APP, EMBEDDED_EXTERNAL_APP, PROXIED_EXTERNAL_APP, DEEPLINK_EXTERNAL_APP, NATIVE_BRIDGE_APP or HYBRID_APP.

Priority candidate applications include System Map, Workflow Designer, Data Modeler, API/Contract Explorer, Identity & Access, Secrets, Network Configurator, Docker/Container Manager, Task/Process Manager, Server Manager, Storage Manager, Database Administration, Terminal, Logs, Observability, Deployment/Release Manager, Build/Artifacts, Factory/Fleet, Templates and Root Services.

Research mature-tool reuse explicitly:
- Docker Engine API/SDK and version negotiation;
- Portainer API/provider and safe UI/deep-link integration;
- Cockpit/NetworkManager/system administration components and supported embedding;
- analogous mature tools for observability, databases, storage and other infrastructure domains where appropriate.

Never weaken CSP/origin/auth boundaries merely to force an external UI into a window. Prefer official APIs/documented integration surfaces and deep-link fallbacks over private/fragile UI reuse.


## Primary navigation candidate — Client -> Workspace -> Desktop Sphere

Near-term G4 frontend planning should prioritize:

~~~
Client -> Workspace -> Desktop Sphere -> Application -> Window
~~~

over a mandatory global 3D navigation surface.

Desktop Spheres are stable functional areas with lazy-loaded application catalogs. Candidate spheres: System Design; Infrastructure & Runtime; Security/Identity/Governance; Data & Information; Process & Automation; Experience/Views/Forms/Reporting; Integrations & Exchange; Operations & Observability; Delivery & Lifecycle.

Planning must support desktop-level lazy loading; desktop close/suspend/hibernate; application code loaded on demand; selective live subscriptions; cross-desktop preservation of client/system/revision/environment/organizational scope; multiple saved workspaces; permission/provider/applicability states; and desktop-specific responsive behavior.

3D is retained as an optional later application/projection inside an appropriate desktop, not required as the first navigation foundation.
