# G4 — Frontend Workspace & Componentization Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Purpose

Qualify the System Builder frontend interaction grammar from the smallest reusable UI unit through blocks, tools, workspaces and system views. This artifact deepens `G4_FRONTEND_DESIGN_SYSTEM_FOUNDATION_PLAN.md` with primary-source comparison of Photoshop, Budibase, n8n, Canva, shadcn/ui, Base UI, Radix UI, React Aria, WCAG 2.2 and component-workshop/testing practice.

No implementation, provider adoption, Work Package, Sprint or TASK is authorized here.

## Evidence classes

Primary/current product documentation used in this round:

- Adobe Photoshop workspace, panels and Contextual Task Bar documentation (2026):
  - https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/workspace-overview.html
  - https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/boost-workflows-with-the-contextual-task-bar.html
  - https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/add-remove-panels.html
  - https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/manipulate-panel-groups.html
- Budibase documentation for Blocks, component composition, data providers, side panels and command palette:
  - https://docs.budibase.com/docs/blocks
  - https://docs.budibase.com/docs/working-with-data
  - https://docs.budibase.com/docs/side-panel
  - https://docs.budibase.com/docs/command-palette
- n8n product/community material for node discovery, Canvas Groups, focus-panel experimentation and save/publish separation:
  - https://blog.n8n.io/community-nodes-available-on-n8n-cloud/
  - https://community.n8n.io/t/announcing-canvas-groups-expand-and-collapse-node-groups/302304
  - https://community.n8n.io/t/help-us-test-some-canvas-improvements/201703
  - https://blog.n8n.io/introducing-n8n-2-0/
  - https://blog.n8n.io/announcing-autosave/
- Canva Help Center for contextual edit panel, side panel, mode switcher, grouping/layer/alignment:
  - https://www.canva.com/help/glow-up/
  - https://www.canva.com/en_au/help/layer-group-align-variantb/
- shadcn/ui current documentation/changelog:
  - https://ui.shadcn.com/docs/theming
  - https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default
  - https://ui.shadcn.com/docs/changelog/2026-07-react-aria
  - https://ui.shadcn.com/docs/changelog/2026-05-rhea
- Base UI, Radix UI and React Aria primary documentation:
  - https://base-ui.com/
  - https://www.radix-ui.com/primitives/docs/overview/introduction
  - https://react-spectrum.adobe.com/react-aria/getting-started.html
- WCAG 2.2 / WAI:
  - https://www.w3.org/TR/wcag/
  - https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- Storybook and Playwright primary documentation:
  - https://storybook.js.org/
  - https://storybook.js.org/docs/writing-tests
  - https://playwright.dev/docs/accessibility-testing

These references qualify interaction patterns and implementation candidates; none becomes product authority by citation.

## Material findings

### F1 — Stable editor shell + contextual specialization is stronger than one universal canvas

**Evidence.** Photoshop separates application bar, tools panel, document surface, options bar and panels; its Contextual Task Bar changes actions based on the current tool/selection. Panels can be added/removed, grouped, docked, collapsed and floated. Canva similarly uses a persistent side panel plus selection-dependent edit controls and explicit Editing/Commenting/Viewing modes. n8n is experimenting with a right-side focus panel so node parameters can be edited while the workflow diagram remains visible.

**Candidate decision.** Prefer one stable SB editor shell with specialized work surfaces rather than forcing every semantic domain into one universal canvas.

```text
Stable Shell
  Global/App bar
  Compact Toolbox
  Context Toolbar
  Work Surface
  Right Dock / Inspector
  Status/Activity strip
        |
        +-- Frontend surface
        +-- Workflow surface
        +-- Data surface
        +-- Architecture surface
        +-- Deployment/Topology surface
        +-- Operations surface
```

The shell provides muscle memory; the work surface changes interaction grammar according to the active task.

`Stable shell != universal canvas`.

### F2 — Contextual action density should be a first-class rule

Photoshop's Contextual Task Bar exists specifically to reduce panel/menu switching and expose relevant next actions. Canva's editor similarly reveals edit options according to the selected element.

Candidate SB interaction equation:

```text
ContextActions = f(
  activeWorkspace,
  activeTool,
  selection,
  semanticType,
  mode,
  authorization,
  currentness
)
```

The result is a bounded action set, not the entire command universe.

Required separation:

```text
available action
!= authorized action
!= currently admissible action
!= action already executed
```

A disabled/hidden UI command cannot be the security boundary; authoritative enforcement remains outside the projection.

### F3 — Budibase validates reversible convenience composition

Budibase Blocks bundle multiple lower-level components to reduce repetitive construction. The documented `Eject block` operation exposes constituent components when the block abstraction is too restrictive. Budibase also separates data provisioning from presentational children: a Data Provider can feed multiple descendants while presentation components remain comparatively data-source-agnostic.

Candidate SB composition rule:

```text
Primitive
  -> Component
  -> Pattern
  -> Block
  -> Module Building Block
  -> Tool
```

Higher-level convenience should remain inspectable. However, SB must not blindly copy arbitrary ejection when the higher-level object carries semantic invariants.

Proposed decomposition classes:

```text
VISUAL_DECOMPOSABLE
  presentation composition may be exposed/rearranged

CONTROLLED_DECOMPOSABLE
  constituents exposed, but semantic constraints remain enforced

SEMANTIC_ATOMIC
  internal implementation may be inspectable but cannot be arbitrarily broken
```

`Convenience composition != hidden irreversible abstraction`.

`Ejectable presentation != ejectable business invariant`.

### F4 — Component tree, semantic graph and workspace projection are different structures

Budibase's component tree is useful for nested UI ownership. n8n's graph is useful for connected process/data execution. Photoshop/Canva layers are useful for visual composition. These are not interchangeable.

SB should explicitly distinguish:

```text
ComponentTree
  presentation containment/ownership

SemanticGraph
  typed system relations

WorkspaceProjection
  what is currently materialized for a task

Layer/Lens Panel
  visibility/focus/overlay controls
```

Proof obligation: the UI must not imply that visual nesting, graph adjacency or panel ordering creates canonical ownership or execution order.

`Visual containment != semantic ownership`.

`Panel order != architecture order`.

### F5 — Typed System Slices are preferable to generic Photoshop layers

Photoshop/Canva layers have meaningful front/back ordering. Many SB domains do not. Therefore a literal layer stack would create false semantics.

Candidate vocabulary:

```text
SYSTEM SLICE
  a bounded projection/family of system concerns

LENS
  a cross-cutting emphasis/qualification over visible identities

WORKSPACE
  a task-oriented arrangement of tools, panels and surfaces

VIEW
  a saved projection configuration
```

Candidate System Slices:

```text
Business Core
Process / Workflow
Capabilities / Modules
Frontend / Views
Data / Data Flow
Integration / Exchange
Security / Policy
Deployment
Topology / Placement
Infrastructure
Observability / Operations
```

Candidate Lenses:

```text
Authority
Security
Evidence
Currentness
Cost
Capacity
Complexity
Change / Diff
Risk
```

A slice row may support `visible`, `focus`, `isolate`, `lock editing`, `filter`, `findings`, `currentness`, `open dedicated tool`. Arbitrary reorder is prohibited unless order is actually modeled.

### F6 — Complexity should be navigated as `primary + context`, not all-at-once

Candidate projection levels:

```text
ISOLATED
  one primary slice

CONTEXT
  one primary slice + qualified related identities/edges

COMPOSITE
  multiple explicitly selected slices
```

Default editing should favor `ISOLATED` or `CONTEXT`. `COMPOSITE` is an expert/analysis mode and still obeys bounded materialization budgets.

This aligns with the existing G4 rule `Overview != render-all`.

### F7 — Cross-workspace identity continuity is more important than preserving geometry

When a user selects an identity in one workspace and moves to another, the Builder should preserve semantic focus when possible.

Example:

```text
Workflow: EmitInvoice activity
  -> Data: Invoice / Customer / TaxData
  -> Capability: Billing
  -> Deployment: Billing runtime
  -> Topology: Container 04 / Finance host
  -> Operations: telemetry for the same lineage
```

Candidate navigation primitive:

```text
FocusContext
  canonicalIdentity
  sourceWorkspace
  relationPath?
  targetWorkspace
  targetProjection
  revision/currentness
```

`Same identity != same geometry`.

### F8 — n8n Canvas Groups validate semantic compression, but grouping needs eligibility rules

n8n Canvas Groups allow connected node sets to become named, collapsible units; collapsed groups retain error indication. This is useful evidence for large-workflow readability. The same source also documents grouping restrictions rather than allowing arbitrary scattered selections.

Candidate SB group contract:

```text
GroupCandidate
  member identities
  group kind
  eligibility predicate
  exposed ports
  hidden internal edges
  aggregate findings/status
  collapse projection
```

SB should go further: grouping must not erase authority, currentness, errors, unresolved findings or externally material relations.

`Collapsed != semantically absent`.

`Group boundary != business transaction boundary`.

### F9 — n8n's Save/Publish separation strongly supports SB mode separation

n8n 2.0 separated Save from Publish because autosaving edits into an active workflow would otherwise make incomplete work live. This is directly relevant to SB's stronger distinction among DESIGN, SIMULATE, PROPOSE, AUTHORIZE, ACT and VERIFY.

Candidate UI requirement:

- draft editing can autosave without implying publication;
- publish/deploy/effect transitions are explicit;
- candidate state has persistent visual identity;
- production/effective state is never inferred from “saved”; and
- closing/reopening the Builder cannot silently change lifecycle meaning.

`Autosaved != published != deployed != effective`.

### F10 — Toolbox discovery should combine category browsing, contextual ranking and command search

Budibase exposes a global command palette for screens, datasources, automations, preview and publish. n8n exposes node discovery from the canvas and its Nodes panel. Photoshop groups tools by related functions.

Candidate SB discovery stack:

```text
Compact Toolbox
  -> category
  -> searchable catalog
  -> context-ranked eligible items

Command Palette
  -> exact navigation
  -> action search
  -> identity search
  -> recent/frequent actions

Insertion Point / Port
  -> only contextually eligible additions
```

Do not make one catalog carry all three jobs.

Candidate top-level toolbox categories remain:

```text
FRONTEND
WORKFLOW / PROCESS
BUSINESS CORE
DATA
CAPABILITIES / MODULES
INTEGRATION
SECURITY / POLICY
DEPLOYMENT / TOPOLOGY
INFRASTRUCTURE
OBSERVABILITY / OPERATIONS
DOCUMENTATION / EVIDENCE
```

### F11 — Current shadcn evidence changes the primitive-base hypothesis

As of July 2026, shadcn/ui made **Base UI the default for new projects**, while continuing full Radix support. In the same month it added **React Aria as a first-class base**. shadcn's theming documentation continues to recommend semantic CSS variables, and current presets use OKLCH-compatible theme tokens.

Therefore the earlier hypothesis `Radix/Base UI/React Aria as selected by component` needs qualification.

**Candidate default for a future greenfield SB UI foundation:**

```text
shadcn/ui source-owned components
  + Base UI default baseline
  + explicit exception process for React Aria or Radix
```

Why only candidate:

- Base UI is now shadcn's default and explicitly targets WCAG 2.2/accessibility;
- Radix remains mature and supported;
- React Aria offers especially strong internationalization, state attributes, collection/date semantics and a lower-level hooks escape hatch;
- mixing primitive bases component-by-component can increase behavioral inconsistency, bundle duplication and maintenance/test matrix.

Thus prefer **one default primitive base plus evidence-backed exceptions**, not unconstrained per-component mixing.

`Provider optionality != provider randomness`.

### F12 — Source ownership requires an upstream-diff policy, not “copy and forget”

shadcn explicitly treats generated components as owned source. Its 2026 migration guidance acknowledges that customized source cannot be safely handled by a blind codemod and recommends progressive, component-by-component migration with build/type checks and behavior-change review.

Candidate SB component provenance metadata:

```text
ComponentProvenance
  upstream family
  upstream component/style
  imported version/date
  local semantic wrapper version
  local modifications class
  last upstream review
  migration notes
```

Candidate local modification classes:

```text
THEME_ONLY
VARIANT_EXTENSION
BEHAVIOR_EXTENSION
ACCESSIBILITY_OVERRIDE
STRUCTURAL_FORK
```

`Source-owned != upstream-forgotten`.

### F13 — Density should be a component contract, not a global spacing multiplier

shadcn's Rhea style is explicitly a denser product-interface style, but its rationale rejects changing Tailwind's global spacing multiplier because doing so changes the meaning of familiar utilities everywhere. This is strong evidence for density profiles implemented at component/surface level rather than redefining the global spacing scale.

Candidate profiles:

```text
COMFORTABLE
COMPACT
```

Future `DENSE` should require evidence from high-information engineering surfaces.

Density changes must preserve target-size/spacing accessibility requirements and keyboard/focus clarity.

### F14 — Accessibility changes the design of canvas/toolbox primitives, not only their QA

WCAG 2.2 requires a non-dragging alternative when drag is not essential and defines minimum target-size/spacing rules. For SB this directly affects canvas, topology placement, layer/slice reordering where meaningful, panel docking and block composition.

Required interaction alternatives:

```text
drag component to canvas
  + keyboard/command “Add to…”

drag node connection
  + accessible connection picker

drag deployment placement
  + Move/Place command with destination chooser

drag group selection
  + multi-select list/command alternative
```

Candidate default: visually compact controls may be smaller than 24px only when WCAG spacing/equivalent-control exceptions are deliberately satisfied; do not assume dense engineering UI exempts pointer ergonomics.

### F15 — UI Lab should be a real component workshop, not a static gallery

Storybook's current model treats stories as reproducible component states usable for development, interaction, accessibility and visual tests. Playwright + axe can detect common accessibility defects but explicitly does not replace manual/inclusive testing.

Candidate future proof surface:

```text
UI Lab / Component Workshop
  token states
  primitive variants
  interaction states
  light/dark/high contrast
  comfortable/compact
  locale/RTL/long strings
  reduced motion
  responsive viewports
  keyboard paths
  accessibility checks
  visual regression
```

Storybook is a strong candidate because it already provides isolated state modeling and current Next.js integration, but it is not selected by this research artifact.

`Story exists != accessibility proven`.

`axe pass != accessible product`.

## Componentization contract candidate

The prior L0–L5 layering remains valid but needs an explicit dependency law:

```text
L0 TOKENS
  no business semantics

L1 PRIMITIVES
  generic interaction/accessibility behavior

L2 PATTERNS
  generic compositions and layout/task patterns

L3 DOMAIN BUILDING BLOCKS
  qualified semantic projections

L4 MODULE COMPONENTS
  capability/module-specific compositions

L5 BUILDER ENGINEERING SURFACES
  specialized editors, canvases, topology, preview, operations
```

Dependency law:

```text
Ln may depend on L0..Ln-1.
Ln must not make lower layers depend on Ln semantics.
```

Cross-cutting semantic status should enter lower layers through generic contracts (`status`, `tone`, `aria-*`, state slots), not imports from capability business models.

## Workspace state candidate

A future UI state model should distinguish transient interaction from durable saved projection and canonical product state:

```text
EphemeralInteractionState
  hover
  pointer position
  open tooltip
  drag preview

SessionWorkspaceState
  active tool
  selection
  panel widths
  temporary filters

SavedViewState
  workspace preset
  visible slices
  active lenses
  saved filters
  layout preference

CanonicalSystemState
  business/system/deployment/runtime semantics
```

Rules:

- ephemeral/session state never becomes business truth;
- saved views are projections and must re-evaluate authorization/currentness when reopened;
- panel layout does not alter system architecture;
- visibility/isolation does not alter ownership or lifecycle state.

## Candidate interaction grammar

A small reusable grammar should span specialized surfaces:

```text
SELECT
INSPECT
ADD
CONNECT
GROUP
FOCUS / ISOLATE
FILTER
COMPARE
PROPOSE CHANGE
SIMULATE
REVIEW
AUTHORIZE
ACT
VERIFY
```

Not every surface supports every verb. Eligibility is semantic and mode-qualified.

Example:

```text
Frontend surface
  SELECT / ADD / GROUP / INSPECT / PREVIEW

Workflow surface
  SELECT / ADD / CONNECT / GROUP / SIMULATE

Deployment surface
  SELECT / PLACE(candidate) / COMPARE / PROPOSE CHANGE

Operations surface
  SELECT / INSPECT / FILTER / VERIFY
```

## Risks / anti-patterns

1. **Universal-canvas trap** — using graph interaction for forms, data modeling, topology and operations merely because a graph renderer exists.
2. **Photoshop-layer literalism** — implying z-order/ownership where SB has typed relations instead.
3. **Panel explosion** — copying desktop creative software's flexibility until every user has an unrecoverable custom layout.
4. **Context-bar churn** — changing controls so aggressively that users cannot build spatial memory. Stable action ordering and progressive disclosure require testing.
5. **Eject-everything trap** — allowing visual decomposition to destroy semantic invariants.
6. **Primitive-provider soup** — mixing Base UI, Radix and React Aria ad hoc and multiplying behavior/test burden.
7. **Dense-control accessibility debt** — shrinking targets because the product is “for experts”.
8. **Drag-only builder** — making critical composition impossible with keyboard/single-pointer alternatives.
9. **Visual state as authority** — treating color, position, panel visibility or collapsed groups as proof/currentness/permission.
10. **Saved == live ambiguity** — autosave or draft persistence appearing equivalent to publication/deployment/effective state.
11. **Inventory overload** — a large toolbox without category/context/search separation becomes another giant menu.
12. **Custom-workspace entropy** — unconstrained floating/docking can make support, screenshots and training difficult; presets/reset-to-default must be researched.

## Proof obligations added by this round

1. The same canonical identity can be navigated across at least three specialized work surfaces without identity loss or false relation creation.
2. A primary System Slice can be isolated while cross-slice relations remain discoverable on demand.
3. Composite views cannot imply ownership/order from panel or drawing position.
4. Contextual actions are stable enough to learn and never become the authorization boundary.
5. A complex Block can expose constituents without weakening semantic constraints.
6. Collapsed groups retain externally material errors/findings/currentness indicators.
7. Every essential drag interaction has a non-drag alternative unless dragging is genuinely essential under WCAG 2.2.
8. Compact density remains usable with target-size/spacing, focus and keyboard requirements.
9. One default primitive base can cover the first-wave primitive set without unjustified provider mixing.
10. Upstream shadcn changes can be diffed/migrated without blind overwrite of local semantics/customization.
11. Draft/autosaved/published/deployed/effective states remain visually and semantically distinguishable.
12. UI Lab captures variants across theme, density, locale, motion, responsive and accessibility states.

## Candidate decisions after this round

These are research candidates, not implementation commitments:

- **CANDIDATE:** stable creative-tool-style shell + specialized work surfaces.
- **CANDIDATE:** typed `System Slice / Lens / Workspace / View` vocabulary instead of generic layer terminology.
- **CANDIDATE:** default editing projection is `ISOLATED` or `CONTEXT`; `COMPOSITE` is deliberate.
- **CANDIDATE:** cross-workspace navigation preserves canonical identity rather than canvas coordinates.
- **CANDIDATE:** contextual toolbar is derived from tool + selection + mode + admissibility context.
- **CANDIDATE:** blocks use explicit decomposition classes rather than universal ejectability.
- **CANDIDATE:** shadcn remains the source-owned component approach; Base UI becomes the leading default primitive-base hypothesis for a greenfield implementation, with Radix/React Aria retained as qualified alternatives/exceptions.
- **CANDIDATE:** component-level density profiles rather than global spacing-scale mutation.
- **CANDIDATE:** Storybook-like component workshop is the preferred shape for `UI Lab`, pending tool qualification.

## Maturity state

`FRONTEND_WORKSPACE_COMPONENTIZATION = EMERGING / MATERIAL_DELTA`

Why not mature yet:

- no empirical SB prototype has tested whether the proposed shell/panel model supports both novice and expert workflows;
- typed System Slice semantics need reconciliation with existing G4 `LensDefinition`, semantic zoom and disclosure envelopes;
- topology/deployment interaction needs deeper research because placement gestures can express high-impact candidate changes;
- component primitive-base choice needs a bounded coverage matrix rather than ecosystem popularity;
- dock/floating/preset behavior needs browser, multi-monitor and responsive constraints;
- generated-system UI reuse still needs a concrete dependency-closure and theme portability model.

## Next highest-value gaps

1. Build a **primitive-base qualification matrix** for Base UI vs Radix vs React Aria over the actual first-wave SB primitives, including accessibility, i18n/RTL, state APIs, RSC/SSR, bundle/dependency cost and known behavioral gaps.
2. Formalize `System Slice / Lens / Workspace / View` against existing `LensDefinition`, `ViewportContext` and `DisclosureEnvelope` so UI vocabulary cannot drift into architecture semantics.
3. Research **inventory-style navigation** for very large capability/tool catalogs: category tabs, slot/card density, quick actions, search, recent/favorites, context eligibility and progressive detail, borrowing interaction ideas from high-item-count inventory UIs without game-like semantic distortion.
4. Research docking/panel-layout constraints and reset/preset behavior for web, small screens and supportability.
5. Define the UI Lab state matrix and minimum proof set before any component implementation is authorized.


---

## Deep-research continuation — complete workspace composition and complexity plan (2026-09-22)

This continuation deliberately does **not** wait for a Construction-A packet. It is research/planning material, not promotion of executable contracts. Its purpose is to map the whole frontend problem so later bounded packets can be cut from an explicit dependency graph instead of discovering the upper levels piecemeal.

Additional primary-source evidence reviewed in this continuation:

- Microsoft Fluent 2 Toolbar/Layout/Accessibility guidance and Windows Ribbon contextual-tab guidance;
- W3C WAI-ARIA APG Treegrid and Dialog patterns;
- React Flow accessibility guidance for keyboard-operable nodes/edges and focus-driven viewport movement;
- React Aria accessible interaction/collection patterns;
- Figma component-properties, selection/layers and Dev Mode inspection guidance;
- Blender workspace model (3D Viewport + Outliner + Properties + Timeline);
- Three.js InstancedMesh guidance for reducing draw calls for repeated geometry;
- Cytoscape.js large-graph performance guidance;
- Storybook interaction/visual/accessibility testing and Playwright accessibility testing.

These sources strengthen the existing hypothesis rather than selecting a provider.

### F16 — Main Composition is a workspace composition, not a monolithic Canvas component

The useful unit is:

```text
MainCompositionWorkspace
  App/Document context
  Collapsible Ribbon
  Tool Rail
  WorkSurface host
    Semantic3DProjection
    2DProjection
    GraphProjection
    List/Table fallback
  Inspector / PanelDock
  Status / Activity bar
```

Blender's default workspace similarly combines distinct editors around a 3D viewport, while Fluent emphasizes stable toolbar grouping/overflow and contextual commands. Therefore shell, command system, projection host and semantic projection renderer should have separate contracts.

`Workspace != WorkSurface != renderer`.

### F17 — Command identity must be independent of command placement

Windows Ribbon contextual tabs show commands according to selected object/context. Fluent requires logical toolbar grouping and overflow without losing commands. The SB therefore needs one semantic command identity projected into Ribbon, context menu, shortcut, Command Palette and Inspector.

Candidate:

```text
CommandDefinition
  commandId
  semanticIntent
  applicableTo
  eligibility
  authorityRequirement
  modeRequirement
  effectClass
  confirmationPolicy
  async/effectVerificationPolicy
  alternatePresentation[]
```

A command disappearing because of responsive overflow must remain reachable by another declared presentation. A command being visible does not grant authority.

### F18 — Module Workbox is a conditional face host, not fifteen permanently rendered tabs

Figma consolidates intended component properties in the right panel while still preserving deeper layer inspection. Translate this to the Module Workbox as progressive semantic disclosure.

Candidate face registry:

```text
Overview
Capabilities / Services
Entry Points / Counters
Contracts / Ports
Dependencies / Relations
Providers / Bindings
Adapters / Drivers
Plugins / Extensions
Configuration
Data
Events / Workflow
Security / Authority
Runtime / Deployment
Observability
Evidence / History
```

Each face declares `applicability(identity, mode, revision, disclosure)`. Non-applicable faces are absent for semantic reasons; permission-limited faces must not be misrepresented as non-applicable. The Workbox owns navigation/composition only; face-specific semantics remain in their domain contracts.

### F19 — Door/Counter should project one operation contract to many consumer modalities

A Door/Counter is a semantic entry-point projection, not a duplicated endpoint per UI/API/AI/workflow consumer.

```text
EntryPointIdentity
  operation/request contract
  requirements
  authority/policy
  input/output/effect qualification
  evidence obligations
  consumer modalities[]
    HUMAN_VIEW
    API
    WORKFLOW
    AI_AUTOMATION
    CAPABILITY
```

Selecting the Door/Counter should move the Inspector to the same contract identity. Consumer-specific adapters may differ without cloning the operation contract.

### F20 — Corridor/Handoff is a conformance surface, not merely an edge animation

A corridor needs two distinguishable projections:

```text
DESIGNED PATH
OBSERVED PATH
```

with qualified stages for queue/waiting, acceptance, rejection, needs-information, timeout, escalation, authorized bypass, missing evidence, skipped required stage, partial effect, unknown effect and reconciliation.

Downstream progress is not proof that an upstream gate passed. A skipped gate remains a finding even when later stages exist.

### F21 — semantic zoom must change representation, not semantic truth

For 50–200 modules / 5–10 floors, the normal workspace may retain module-level geometry and selected labels while progressively suppressing nonessential labels/details. Near ~1000 modules, the default strategy should be aggregation/clustering and details-on-demand rather than render-all.

Candidate LOD:

```text
LOD0 SYSTEM
  domains/groups + critical markers + selected identity

LOD1 NEIGHBORHOOD
  modules + qualified external relations

LOD2 MODULE
  module geometry + applicable faces/ports summaries

LOD3 CONTRACT
  selected doors/ports/contracts + relation qualification

LOD4 DETAIL
  Inspector-driven full detail/evidence
```

Three.js instancing can reduce draw calls for repeated geometry; Cytoscape.js documents that large graph cost rises with element count, rich styles and especially edges. These are implementation evidence only. The semantic contract is:

`Large-scene degradation -> aggregation, not silent omission`.

Critical gates, BLOCKED/UNKNOWN/MISSING_EVIDENCE, selected identity and currentness cannot disappear merely to meet frame budgets.

### F22 — 3D camera state is navigational state, never architecture state

Candidate guided modes:

```text
OVERVIEW
FOCUS_SELECTION
FLOOR
CAPABILITY_SHAFT
RELATION_NEIGHBORHOOD
CORRIDOR_TRACE
CORE_TO_BOUNDARY
COMPARE
```

Transitions preserve `SelectionContext` and provide a return anchor. Camera coordinates may be persisted as convenience but are not shareable semantic identity. A user must be able to reach the same semantic target through 2D/list/table/graph navigation.

### F23 — cross-view navigation is one ProjectionHandoff family

Commands such as:

```text
Open in Workflow
Open in Data
Open in Capability
Open in Deployment
Open in Infra
Open Evidence
```

should not each invent navigation semantics. They specialize one `ProjectionHandoff` carrying canonical object/relation identity, selection context, capability context, revision/currentness, environment, lenses, disclosure context and return anchor.

A destination can answer `PRESENT`, `NOT_MATERIALIZED`, `FILTERED_OUT`, `COLLAPSED`, `STALE_REFERENCE`, `NO_LONGER_ADMISSIBLE` or a disclosure-safe unresolved disposition. It must never fabricate deletion because an object cannot be represented in that projection.

### F24 — 3D accessibility requires a peer semantic representation

React Flow demonstrates keyboard-focusable/selectable/movable nodes and edges, but the SB cannot assume a 3D renderer exposes an adequate accessibility tree. WAI-ARIA patterns distinguish focus from selection, and Fluent requires responsive reflow without losing information.

Therefore every decision-relevant 3D identity/relation requires a peer non-spatial representation such as Tree/Treegrid/RelationTable/List. Pointer drag operations require command/picker equivalents. Closing a dialog/Inspector transition must restore meaningful focus. Reduced motion may remove camera animation but not semantic transition feedback.

### F25 — Inspector is a semantic projection boundary, not a second source of truth

The Inspector may edit a qualified draft/proposal but must bind to the same identity/revision/eligibility contracts as the Canvas. It cannot maintain an independent shadow model that diverges from the selected Canvas object.

Required conflict sequence:

```text
select -> inspect -> edit -> dirty
  -> external revision arrives
  -> external-change-detected
  -> reconcile/compare
  -> save candidate
  -> verify currentness
```

A live update cannot silently overwrite dirty local state.

### F26 — complete task pages need orchestration contracts above component state

Minimum end-to-end scenario family:

```text
CREATE MODULE
  insert -> qualify defaults -> place -> inspect -> save

CONNECT
  select source -> choose relation -> target candidate
  -> semantic qualification -> valid/invalid/unknown
  -> commit candidate -> verify

DEFINE ENTRY POINT
  select module -> entry face -> define operation contract
  -> requirements -> consumers/adapters -> validate

REQUEST/HANDOFF
  submit -> ACK -> queued/waiting -> accepted/rejected/needs-info
  -> gate -> downstream -> effect verification

OBSERVED DEVIATION
  designed path != observed path
  -> finding -> inspect evidence -> reconcile/escalate

PROJECTION SWITCH
  select identity -> handoff -> materialize equivalent/aggregate
  -> restore focus -> preserve revision/environment

FAILURE RECOVERY
  dirty draft -> fatal surface failure
  -> preserve recoverable state
  -> reopen -> requalify authority/currentness
  -> reconcile -> continue
```

### F27 — UI proof should scale with componentization complexity

Storybook supports isolated state stories and interaction tests; Playwright/axe catches only a subset of accessibility problems. Therefore proof depth should rise with semantic composition depth rather than applying one test recipe to everything.

```text
primitive -> state/keyboard/a11y/visual
pattern -> composition + transition
domain block -> semantic eligibility + negative states
module component -> cross-contract scenarios
tool -> multi-panel orchestration + recovery
workspace -> identity/currentness/authority continuity
task page -> end-to-end task outcome + partial/failure
system view -> cross-workspace consistency + scale + disclosure
```

## Complexity-oriented componentization plan

This is a research decomposition plan, not an implementation WBS. Complexity is architectural/interaction complexity, not estimated coding hours.

### C0 — Semantic design tokens — VERY LOW

Examples: spacing/density tokens, typography, elevation, focus ring, status tone, selected/focused/blocked/stale/unknown markers, motion/reduced-motion tokens.

Exit proof: semantic meaning never depends on hue alone; density does not redefine global spacing semantics.

### C1 — Atomic interaction primitives — LOW

Examples: Button, IconButton, Toggle, Checkbox, Input, Select, Tabs, Tooltip, Popover, Dialog, Menu, Separator, Badge, Progress, Skeleton.

State burden: focus, hover, pressed, disabled, read-only where applicable, pending/loading, validation, destructive, permission/policy explanation hooks.

Exit proof: keyboard/focus/a11y contract stable; `BLOCKED != DISABLED`.

### C2 — Composite navigation/input patterns — LOW–MEDIUM

Examples: Toolbar, CommandGroup, CommandPalette, Search/Filter, Breadcrumb, Tree, Treegrid, DataTable, SplitPane, DockPanel, ResizablePanel, ActionBar, contextual toolbar.

Exit proof: selection/focus/multi-selection, overflow, responsive reachability, focus restoration, virtualization and permission-limited states.

### C3 — Semantic projection primitives — MEDIUM

Examples: `ProjectionIdentityRef`, `SelectionBridge`, `CriticalStateMarker`, `QualifiedRelationPort`, `FloorManifestationPort`, `ReturnAnchor`, `ProjectionHandoff`.

Exit proof: same identity survives renderer substitution, LOD, filtering, stale/currentness changes and accessible alternate projection.

### C4 — Domain-semantic building blocks — MEDIUM–HIGH

Examples: ModuleProjectionTile, RelationCard/Row, EntryPoint/Door, ContractPort, FloorManifestation, CapabilityShaftMarker, GateMarker, EvidenceMarker, CorridorStage, HandoffState, AggregateCluster.

Exit proof: visual connectability never implies semantic compatibility; critical state survives collapse/aggregation.

### C5 — Module Components — HIGH

Examples: ModuleNode, ModuleWorkbox, face registry, relation composer, entry-point editor, dependency view, provider/binding view, security/authority face, runtime/deployment face, evidence/history face.

Exit proof: face applicability is qualified; one module identity is not duplicated per face; multi-face edits share revision/currentness.

### C6 — Tool components — HIGH

Examples: Toolbox/Inventory, contextual Ribbon projection, Inspector, Layer/Lens panel, Relation explorer, Evidence explorer, Activity/Status surface, semantic camera controls.

Exit proof: one Command Registry identity across Ribbon/context menu/shortcut/palette/Inspector; persisted tool layout does not grant permission.

### C7 — Specialized WorkSurfaces — VERY HIGH

Separate components/contracts for:
- Main semantic 3D composition;
- Workflow graph;
- Data entity/relation/data-flow;
- Architecture capability/module graph;
- Deployment topology/placement;
- Operations runtime/observability;
- Frontend layout/component canvas.

Exit proof: each surface declares its interaction grammar and alternate representation; no one-canvas-fits-all assumption.

### C8 — Stable Workspace Shell — VERY HIGH

```text
MainCompositionWorkspace
  Ribbon
  Tool Rail
  WorkSurfaceHost
  Inspector/PanelDock
  Status/Activity
  navigation/history
  persisted layout
  responsive/density behavior
```

Exit proof: workspace switching preserves semantic identity; responsive collapse never removes a critical action; read-only and permission-denied remain distinct; fatal WorkSurface failure does not destroy recoverable draft state.

### C9 — Complete Task Pages — EXTREME

Task pages for `create/edit/review/simulate/authorize/publish/operate/audit/recover`.

Exit proof: complete scenarios include async orchestration, partial success, live updates, revision drift, offline/degraded/recovery and effect verification. `ACK != effect`, `PENDING != EFFECTIVE`.

### C10 — System Views / Cross-workspace orchestration — EXTREME

System overview, typed System Slices/Lenses, cross-workspace navigation, designed-vs-observed overlays, global evidence/currentness and projection history.

Exit proof: system view remains a projection rather than canonical truth; capability participation does not become ownership; cross-view handoff preserves object/selection/capability/revision/environment context.

### C11 — Scale/conformance hardening — EXTREME / CROSS-CUTTING

Normal scene: 50–200 modules / 5–10 floors.
Stress research target: ~1000 modules.

Required behavior:
- semantic zoom and clustering;
- bounded relation materialization;
- label suppression by priority;
- details-on-demand in Inspector;
- instancing/render-on-demand candidates;
- selected/critical/currentness markers survive degradation;
- 2D/list/table/graph fallback remains available;
- no silent omission of gates/findings because of performance.

## Recommended dependency order for future bounded packets

```text
C0/C1
  -> C2
  -> C3 identity/projection contracts
  -> C4 relation/floor/gate/corridor building blocks
  -> C5 ModuleNode + ModuleWorkbox
  -> C6 command/inspector/tool family
  -> C7 one specialized WorkSurface at a time
  -> C8 workspace orchestration
  -> C9 complete task pages
  -> C10 cross-workspace/system views
  -> C11 scale/conformance hardening continuously, with final stress proof
```

Parallelizable research after C3:
- Ribbon/Command Registry;
- Module Workbox face taxonomy;
- Corridor/Gate conformance;
- semantic camera/LOD;
- accessibility alternate projections;
- performance benchmark harness;
- UI Lab scenario taxonomy.

Non-parallelizable semantic gates:
- do not freeze ModuleWorkbox before identity/revision/selection contracts;
- do not freeze relation gestures before relation qualification;
- do not freeze 3D aggregation before critical-state preservation;
- do not freeze complete task pages before async/effect/currentness orchestration;
- do not freeze System View before cross-workspace handoff/disclosure behavior.

## Componentes inventory impact

Componentes should ultimately index all C0–C10 artifacts with:

```text
complexity class
composition lineage
canonical identity ownership
variants
interaction states
semantic states
async states
failure/recovery states
responsive/density
accessibility alternate
performance/LOD behavior
commands exposed
used by
scenario fixtures
proof evidence
known invalid combinations
```

For C5+ entries, static stories are insufficient; Componentes should expose complete scenario playback and cross-surface handoff fixtures.

## Adversarial regression set

1. Visually connectable relation is semantically invalid.
2. Gate is skipped but downstream state exists.
3. Timeout occurs and flow continues silently.
4. ACK is shown as effect.
5. UNKNOWN/PARTIAL becomes success under aggregation.
6. Critical gate disappears at stress LOD.
7. Workspace switch loses canonical selection.
8. Camera transition loses orientation/return anchor.
9. Inspector edits a stale revision while Canvas shows current.
10. Live update overwrites dirty edit.
11. Responsive collapse removes authorize/recover action.
12. Read-only is rendered as permission denied or vice versa.
13. Hidden-by-disclosure is rendered as deleted.
14. Module face creates a second module identity.
15. Drag-only connection has no keyboard/picker path.
16. 3D renderer failure destroys recoverable draft.
17. Persisted workspace preset reopens as if it granted authority.
18. Designed corridor is displayed as observed execution.
19. Capability shaft implies ownership instead of participation.
20. Optimization silently drops evidence/findings.

## Research maturity after continuation

`FRONTEND_WORKSPACE_COMPONENTIZATION = ADVANCED_EMERGING / MATERIAL_DELTA`.

The research now has a complete componentization ladder from tokens through System Views and a dependency-oriented plan. Remaining uncertainty is concentrated in empirical prototype validation, exact provider qualification, performance budgets, camera/LOD thresholds, docking constraints and detailed semantic contracts for corridor/gate/effect reconciliation.

This continuation does not supersede bounded Construction packets; it gives Planning a complete map from which to cut them.
