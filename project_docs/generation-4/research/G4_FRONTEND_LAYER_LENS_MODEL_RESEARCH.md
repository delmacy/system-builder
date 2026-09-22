# G4 — Frontend Layer / Lens / Projection Interaction Model Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-22

## Scope

This artifact researches the System Builder frontend model behind the candidate Layers/Lenses panel and its relationship to specialized work surfaces. It does not define a product schema, select a component library, authorize implementation, or change G3 architecture.

The research question is narrower than “how should a Layers panel look?”:

> Which UI concepts may safely borrow the interaction grammar of creative-tool layers, and which System Builder concepts require distinct semantics so that visibility, focus, ordering, locking, ownership, authority and canonical truth are not conflated?

The answer must remain compatible with the G4 constitutional boundaries:

- `Canvas/UI projection != canonical authority`;
- `Layer != canonical ownership`;
- `Workspace preset != permission grant`;
- `Color != proof`;
- `Focus != selected != attention`;
- `UI state != business truth`.

## Evidence classes and benchmark findings

### Photoshop — strong interaction evidence, weak semantic analogy

Primary Adobe documentation confirms that Photoshop Layers are genuinely compositional objects: users can show/hide them, select them, reorder their stacking order, group/nest them, collapse groups, apply opacity/blending and lock all or selected properties. Alt/Option visibility isolation temporarily shows only one layer/group and can restore the previous visibility state.

This is valuable interaction grammar for SB: compact rows, disclosure triangles, visibility toggles, isolate/restore, grouping, lock affordances and selection-driven contextual editing are proven patterns for dense expert tools.

But Photoshop also establishes why literal copying is unsafe: layer order and opacity have real rendering semantics in an image composite. Most SB architectural categories do **not** have a universal stacking or opacity semantic. Therefore:

`Photoshop layer interaction grammar != SB layer semantics`.

### Budibase — hierarchy and decomposability are local to composition

Budibase documentation shows a component tree representing actual UI layout/hierarchy. Components may be nested in parent containers and rearranged by drag/drop; search expands the tree to reveal matches. Blocks are convenience compositions of constituent components and can be Ejected when deeper customization is required.

This supports a separate conclusion: reorder is appropriate where a surface models an actual ordered composition (for example frontend children/layout), but that affordance must not automatically migrate to architecture, security, data, deployment or observability categories.

`Reorderable UI composition != reorderable system semantics`.

### n8n — graph grouping is a view aid, not contract proof

Existing G4 benchmark work treats n8n groups, nodes, ports, collapse/expand and execution overlays as interaction evidence for graph-oriented tools. The applicable rule remains:

`Visual connectability != semantic compatibility`.

A group/collapse operation may reduce visual complexity without changing the underlying contract, eligibility or authority semantics.

### Canva — progressive contextual editing, not universal layer authority

Existing G4 benchmark work uses Canva to support the interaction sequence:

`select -> quick actions -> contextual toolbar -> optional deep inspector`.

For the Layers/Lenses model, this means selecting a row may expose relevant controls without requiring every property to be permanently visible in the row. Progressive disclosure is preferred to a panel containing every possible control at once.

## Material finding 1 — “Layer” must not be one universal SB type

A single `Layer[]` abstraction would collapse materially different concepts. The candidate UI model should distinguish at least the following:

| Concept | Question answered | Canonical meaning? | User-orderable by default? |
| --- | --- | --- | --- |
| **System Slice** | “Which sphere of the system am I viewing?” | projection taxonomy over canonical identities | No |
| **Lens** | “Which concern is emphasized/qualified?” | projection/query semantics | No |
| **Projection** | “How is canonical state represented here?” | UI/materialization only | only where the projection itself defines order |
| **Deployment Layer** | “Where/how is a release placed?” | projection of deployment/topology facts | No arbitrary ordering |
| **Data Layer** | “Which data/relation/flow concern is in view?” | projection over data identities/relations | No arbitrary ordering |
| **Semantic Owner** | “Who owns the meaning/decision?” | canonical/business or contract metadata where defined | Never by visual reorder |
| **Frontend composition layer** | “What renders above/below or before/after here?” | may represent real layout/render order | Yes, only when the underlying model declares order |

Candidate System Slices remain useful as navigation categories, not new architecture boundaries:

- Business Core;
- Process / Workflow;
- Capabilities / Modules;
- Frontend / Views;
- Data / Data Flow;
- Integration / Exchange;
- Deployment;
- Infrastructure;
- Observability.

Candidate overlay lenses remain orthogonal concerns:

- Security;
- Authority;
- Cost;
- Capacity;
- Evidence;
- Currentness;
- Complexity;
- Change / Diff.

A slice may be active while multiple compatible lenses qualify it. Neither becomes the owner of the canonical entities it projects.

## Material finding 2 — row controls require typed semantics

A Photoshop-like row is useful only if each control has a declared meaning for that row type. Candidate control vocabulary:

```text
VISIBLE / HIDDEN
FOCUS
SOLO / ISOLATE
LOCK_EDITING
EMPHASIS
EXPAND / COLLAPSE
FILTER
REVISION / CURRENTNESS
FINDINGS
OPEN_DEDICATED_TOOL
ORDER / MOVE   [only when semantically declared]
```

### Visibility

`VISIBLE/HIDDEN` changes projection materialization or emphasis. It does not delete canonical state, revoke authority, disable runtime behavior, undeploy a service, suppress evidence, or prove absence.

A hidden slice/lens may still affect canonical behavior. Conversely, a visible item may remain read-only or unauthorized for mutation.

### Focus

`FOCUS` changes the working context and may drive contextual toolbar/inspector content. It does not imply selection ownership, permission, authority or operational attention.

### Solo / isolate

`SOLO/ISOLATE` is a reversible projection operation: temporarily suppress other eligible projection categories while preserving enough state to restore the prior view. This is the safest direct translation of Photoshop’s isolation grammar.

Isolation must remain bounded by `DisclosureEnvelope`; it cannot reveal an entity merely because it is the only requested category.

### Lock editing

`LOCK_EDITING` is especially dangerous if left ambiguous. Three different states must remain distinct:

1. **view lock** — user chooses not to accidentally manipulate a projection;
2. **model editability** — current tool/mode supports editing this identity;
3. **canonical authorization/approval** — policy permits a mutation and any required approval exists.

A lock icon in the panel should represent only a named layer of this model. It must never imply that unlocking a view grants canonical write authority.

### Emphasis / opacity

Visual emphasis may dim or accent a projection, but generic opacity is not a semantic state. If an opacity-like control is retained, it is a view preference only and must not encode confidence, evidence strength, currentness, authority, health or importance.

### Revision/currentness and findings

Revision/currentness badges and findings are qualified metadata overlays. They are not row colors and cannot be inferred from visibility, selection or animation. A row can be visible yet stale, current yet contain findings, or hidden while a critical finding remains represented elsewhere in an attention queue.

### Expand/collapse

Expand/collapse changes disclosure of children/constituents in the panel or surface. It must not mutate composition unless the underlying canonical operation explicitly does so.

### Open dedicated tool

Rows may navigate to a specialized surface while preserving canonical identity through the existing `SelectionContext / ProjectionHandoff` research model. A lens/slice panel therefore becomes navigation infrastructure across specialized surfaces rather than an attempt to make one universal Canvas edit everything.

## Material finding 3 — ordering needs an explicit semantic capability

The most important anti-pattern identified in this round is universal drag-to-reorder.

Candidate rule:

```text
ORDERING_ALLOWED
only if
underlying model declares an order relation
AND current projection exposes that relation
AND mutation is authorized
```

Examples where ordering can be real:

- frontend sibling/render/layout order when the component model defines it;
- ordered workflow branches/steps where the workflow contract explicitly defines sequence;
- ordered rule priority where priority is canonical and not merely visual;
- dashboard/grid presentation order when it is itself a saved presentation property.

Examples where arbitrary ordering should normally be prohibited:

- Business Core vs Data vs Infrastructure slices;
- Security vs Cost vs Evidence lenses;
- hosts, deployment units or network nodes when vertical list position has no topology meaning;
- semantic owners;
- currentness/evidence states;
- capability categories where list order is merely navigation.

For non-orderable rows, drag may still be used for a separately named action such as docking, pinning, grouping a saved view, or creating a relation — but the affordance must not masquerade as semantic reorder.

`Visual row order != canonical order unless explicitly declared`.

## Material finding 4 — System Layers and Lenses should be orthogonal panel modes

A single dense panel can still support the metaphor if it exposes typed sections or tabs rather than flattening everything:

```text
LAYERS / SLICES
  Business Core
  Process / Workflow
  Capabilities / Modules
  Frontend / Views
  Data / Data Flow
  Integration / Exchange
  Deployment
  Infrastructure
  Observability

LENSES
  Security
  Authority
  Cost
  Capacity
  Evidence
  Currentness
  Complexity
  Change / Diff

CONTEXT
  selected identity
  semantic owner
  revision/currentness
  findings
  dedicated tool
```

The panel may visually remain compact. Search, filtering, disclosure and saved presets can scale the catalog without rendering every dimension simultaneously.

Candidate default modes:

- `CONTEXT`: active slice plus nearby/required context;
- `ISOLATED`: one slice/tool focus with explicit contextual breadcrumbs;
- `COMPOSITE`: deliberate multi-slice/multi-lens analysis for expert use.

`COMPOSITE` should not become the default merely because the system can technically render it.

## Material finding 5 — workspace presets save view intent, not authority

Task-oriented workspaces such as APPLICATION DESIGN, PROCESS DESIGN, DATA MODELING, SYSTEM ARCHITECTURE, DEPLOYMENT/INFRA, OPERATIONS and REVIEW/AUDIT may save:

- panel arrangement;
- active surface/tool;
- preferred slice/lens set;
- filters;
- density;
- dock/collapse state;
- optionally safe view emphasis.

They must not save or grant:

- permissions;
- approvals;
- business authority;
- stale authorization assumptions;
- bypasses around disclosure/currentness qualification.

On restoration, every identity, lens and relation is requalified against current authorization/currentness. Therefore:

`Workspace preset != permission grant`.

## Specialized surfaces remain the preferred hypothesis

This round strengthens rather than weakens the hypothesis of a stable shell with specialized work surfaces:

| Work surface | Primary composition semantics |
| --- | --- |
| Frontend | layout/component composition; some real order |
| Workflow | graph/process relations; sequence only where contract-defined |
| Data | entity/relation/data-flow projection |
| Architecture | capability/module relations and slices |
| Deployment | topology/placement relations |
| Operations | runtime/telemetry/currentness projection |

The Layers/Lenses panel supplies a shared grammar for visibility, focus, isolation, context and navigation. It does not force all surfaces into one graph renderer or one universal layer stack.

## Accessibility obligations

A Layers/Lenses panel is an interactive collection, not a visual-only legend. Future qualification must cover:

- keyboard traversal and typeahead/search appropriate to the selected primitive;
- explicit distinction between focus and selection;
- non-drag alternatives for any ordering/grouping action;
- visible focus not obscured by docked/contextual UI;
- text/icon redundancy for visibility, currentness, findings and lock state;
- announced expanded/collapsed state;
- announced reasons when an action is unavailable;
- stable DOM/focus order independent of purely visual emphasis;
- zoom/reflow and compact-density behavior;
- restoration of focus after opening/closing a dedicated inspector/tool;
- reduced-motion equivalents for attention indicators.

If a row exposes several inline actions, the component model must avoid creating an excessive global Tab sequence; collection/composite keyboard patterns should be evaluated against the collection contracts already researched in G4.

## Failure cases / adversarials

1. **False z-order** — user drags Infrastructure above Security and assumes architecture changed.
2. **False authority** — user unlocks a row and assumes mutation is now permitted.
3. **Hidden means off** — user hides Observability and assumes telemetry stopped.
4. **Opacity means confidence** — dimming a stale/evidence-poor object accidentally becomes an undocumented confidence score.
5. **Saved preset bypass** — restoring an old workspace reveals identities no longer disclosable.
6. **Composite overload** — every slice/lens is enabled and the canvas becomes the raw enterprise graph.
7. **Layer-as-owner** — UI grouping silently becomes canonical bounded-context ownership.
8. **Collapse-as-delete** — hidden descendants are treated as absent by actions/counts.
9. **Color-as-proof** — domain accent/status/currentness/evidence colors collapse into one channel.
10. **Drag-only manipulation** — a user cannot perform the equivalent action without pointer drag.

## Candidate decision state

### Evidence-backed candidates

- stable creative-tool shell with compact typed Layers/Lenses panel;
- visibility/focus/isolate/collapse as projection operations;
- contextual inspector/tool actions driven by selection;
- specialized surfaces sharing one interaction grammar;
- explicit semantic qualification before enabling reorder;
- workspace presets as view intent only.

### Not selected / unresolved

- exact panel primitive (`Tree`, `TreeGrid`, grouped List, custom collection);
- exact persistence boundary for personal vs shared view state;
- exact lens-composition compatibility matrix;
- exact semantic-zoom transition rules for every surface;
- exact representation of aggregate findings/currentness without leaking protected counts;
- Base UI vs Radix vs React Aria implementation for the panel;
- whether some slices are user-customizable aliases or only system-defined taxonomy.

No library, provider or implementation is selected by this research.

## Effect on the frontend foundation plan

Material refinement:

1. replace any implicit “universal Layers stack” assumption with typed `System Slice / Lens / Projection / semantic-order capability` concepts;
2. preserve Photoshop-like interaction grammar only where its semantics survive translation;
3. prohibit arbitrary reorder unless the underlying model explicitly declares order;
4. make `LOCK_EDITING` a named view/editability affordance rather than authorization;
5. use the Layers/Lenses panel as cross-surface navigation/context infrastructure;
6. keep specialized work surfaces as the preferred architecture hypothesis;
7. require workspace preset restoration to requalify disclosure/currentness/authorization.

## Maturity

`FRONTEND_LAYER_LENS_MODEL = EMERGING / MATERIAL_DELTA`

This round materially changes the panel contract and removes a dangerous universal-layer-stack interpretation. It is not saturated.

## Next highest-value gaps

1. qualify the panel interaction primitive: Tree vs TreeGrid vs grouped collection, including inline actions and large hierarchies;
2. formalize lens-composition compatibility and conflict semantics (`compatible`, `qualified`, `ambiguous`, `incompatible`);
3. define personal/shared persistence boundaries for visibility, isolation, panel arrangement, saved workspaces and collaborative views;
4. test currentness/evidence/finding aggregation against disclosure leakage;
5. reconcile semantic zoom with slice/lens transitions and `SelectionContext / ProjectionHandoff` so identity survives surface changes without preserving meaningless coordinates.
