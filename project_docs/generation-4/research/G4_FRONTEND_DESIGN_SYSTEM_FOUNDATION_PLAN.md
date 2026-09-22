# G4 — Frontend Design System & UI Foundation Research Plan

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
