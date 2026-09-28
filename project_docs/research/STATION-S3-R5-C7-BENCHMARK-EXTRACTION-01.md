# Station S3 R5 — C7 Template/View Benchmark Extraction 01

Date: 2026-09-28
Status: research evidence only; non-authoritative
Base: `main@19c87172c19e9bae5bf39848a0db9d09798705ce`

## Question

When does a composition of C5 regions and C6 patterns deserve promotion to C7 Template/View instead of remaining placement/configuration, and what must future Construction prove?

## Station current state

Repository planning already expects a declarative `ViewDefinition/ComponentTree` boundary before a Window/View Editor and explicitly rejects arbitrary HTML/CSS and premature application-sized construction. The current R5 live pointer carries forward one canonical artifact with Inspector/Layers/Graph/source projections and R3/R4 proof gaps.

## Independent benchmark extraction

### Webflow

Evidence studied: Components overview, Component properties, Page building, Component Canvas.

Extracted grammar, not catalog:
- a reusable definition is distinct from an instance;
- slots declare bounded substitution points;
- properties/variants vary instances while preserving shared structure;
- page slots constrain where components may be inserted;
- visual editing can occur in context or on a dedicated canvas without creating a second definition authority.

Station implication: C7 should expose named/typed composition roles and bounded variation points. Domain content or a visibility/layout variant alone is insufficient for a new Template/View identity.

Classification: `adopt-pattern`, provider schema deferred.

### Framer

Evidence studied: component variants and breakpoint variants.

Extracted grammar:
- variants preserve a shared component source/structure while overriding selected differences;
- breakpoint variants adapt arrangement at discrete responsive thresholds;
- instance controls expose bounded variability rather than cloning a new component per use.

Station implication: preserve span/discrete authoring. Responsive execution may select an admitted arrangement while semantic roles, canonical node identity, commands and authority remain stable. A breakpoint is presentation/configuration unless it introduces a separately reusable semantic contract with its own proof delta.

Classification: `adopt-pattern`; do not adopt Framer breakpoint/provider metadata.

### VS Code workbench

Evidence studied: Workbench extension model and custom layout.

Extracted grammar:
- stable workbench roles exist independently of their current placement;
- views/view containers can be moved among admitted regions;
- workbench contribution points constrain extension placement rather than treating arbitrary layout as semantic identity.

Station implication: Template/View identity must not equal pane side, width, window geometry, or current placement. Named roles and compatibility are stronger candidates than coordinates.

Classification: `adopt-pattern`; arbitrary docking remains deferred/not-applicable to the foundation.

## Convergence / divergence

Independent convergence:
1. reusable identity survives bounded instance/layout variation;
2. insertion/substitution occurs through declared roles/slots rather than arbitrary structure mutation;
3. responsive/layout changes can preserve semantic identity;
4. authoring surface is distinct from runtime/canonical authority;
5. reuse is achieved by definition + bounded overrides, not domain-named clones.

Divergence:
- Webflow exposes page/component slots and marketer/designer constraints;
- Framer emphasizes variants/breakpoints;
- VS Code emphasizes stable workbench roles with movable views.

Station should own a smaller provider-independent contract rather than merge all three feature sets.

## Candidate C7 promotion rule

Promote a composition to C7 Template/View only when all are true:
1. it has stable semantic identity independent of placement/presentation/action bindings;
2. it declares reusable named/typed roles or slots and compatibility constraints;
3. it recurs across materially different domains with participants substituted through those roles;
4. admitted variation points are explicit and bounded (properties, role occupancy, variants, discrete responsive arrangements);
5. changing domain data, labels, icons, command bindings, pane side/width or admitted spans does not require a new definition;
6. it introduces at least one C7 invariant not already owned by C0-C6;
7. that invariant has a smallest delta proof and a clear owner;
8. it does not acquire Core/business authority.

Otherwise classify as configuration, instance, variant/profile, or lower-level composition.

## Candidate minimal contract

Research-only shape:

`TemplateViewDefinition = identity + revision + semanticRoles + roleCompatibility + admittedVariants + discreteResponsiveArrangements + projectionMetadata`

Instance/configuration binds participants and presentation choices without changing definition identity.

This is intentionally not an AppManifest, WindowGeometry schema, provider page schema, or business workflow definition.

## Proof Grammar — inherited proofs

C7 may inherit lower proofs only when preconditions remain unchanged:
- C1 activation/focus semantics;
- C2/C3 slot/group/collection compatibility and selection;
- C4 command identity, target/currentness, availability != authority, result non-strengthening;
- C5 region identity vs placement and presentation-only hide/show where proven;
- C6 cross-participant contextual binding where proven;
- projection/source identity, revision/currentness separation from the existing owner contexts.

Do not rerun primitive Button behavior merely because it appears inside a Template/View.

## C7 delta proof obligations

All remain `unproven-gap` until focused evidence exists.

1. **definition identity stability** — admitted placement/layout/responsive changes preserve the same Template/View definition identity;
2. **role compatibility** — incompatible participant insertion is rejected deterministically and does not partially mutate canonical state;
3. **domain-independent reuse** — at least two materially different domains instantiate the same definition without feature-name branching;
4. **responsive semantic preservation** — discrete arrangement transitions preserve semantic roles, canonical node refs, focus/keyboard expectations and command bindings unless the contract explicitly declares a transition;
5. **single-authority projection** — Inspector/Layers/Graph/preview/source resolve the same canonical artifact/node identities;
6. **projection edit atomicity** — an accepted edit from any authoring projection crosses one owning mutation/command boundary and produces one canonical revision before projections refresh;
7. **stale protection** — a stale projection/source revision cannot overwrite a newer canonical revision merely because its local presentation is newer;
8. **round-trip fidelity** — canonical -> source/YAML -> accepted edit -> canonical preserves identity, declared roles and semantics; unsupported/unknown fields fail safely rather than disappearing silently;
9. **undo/history ownership** — undo reverses an admitted canonical edit through its owner and cannot masquerade as business compensation/rollback;
10. **manual deterministic UX** — insertion, selection, Layers, contextual Inspector, preview, validation and consequence navigation expose understandable deterministic outcomes without AI.

Human acceptance remains separate: it validates that the resulting Template/View meets intended UX, not machine conformance or authority.

## Failure/recovery semantics

- invalid role/slot insertion: reject before canonical mutation;
- stale source/projection: block or reconcile explicitly; never last-write-wins silently;
- accepted != effective remains visible where the owning command has asynchronous effects;
- partial/unknown/reconcile-required evidence cannot be strengthened by the Template/View;
- retry/compensation/rollback exist only when exposed by the owning capability/command;
- closing/rearranging a View is presentation unless an owner contract says otherwise.

## Dedup pressure

Reject by default as distinct C7 definitions:
- `ApprovalTemplate`;
- `TicketView`;
- `CrudTemplate`;
- `DashboardTemplate`;
- `DeploymentView`.

They become new definitions only if the common C7 contract cannot express them without ad-hoc escape hatches and the difference introduces a reusable semantic invariant with its own proof delta. Domain naming alone is not promotion evidence.

## Grammar Sufficiency Test — R5 candidate

Exercise one small C7 grammar against:
- document approval;
- ticketing;
- CRUD;
- operational dashboard;
- deployment configuration.

Record coverage per obligation as `proven | failed | unproven-gap | not-applicable`; never collapse to a magic score.

Current result: **candidate sufficiency, not PASS**. Benchmark convergence suggests definition + roles/slots + bounded variants + discrete responsive arrangements can cover the five classes. Repository evidence has not yet proven source/YAML round-trip, schema-driven Inspector, graph-derived Layers, broad projection synchronization, semantic reparent/cycle/reachability/order, or C7 cross-domain instantiation.

## Research exit implications

R5 should not close until:
- repository census identifies existing full-view/workspace/page artifacts and executable evidence;
- source/YAML round-trip/currentness direction is explicit;
- representative C7 journeys and coverage matrix exist;
- carried R3/R4 gaps are mapped rather than hidden;
- Test Review/Hardening and QA Coverage/Evidence Review requirements are carried into synthesis/Construction planning.

No Construction, Tool/Application/Studio promotion, or AI/MCP foundation is authorized by this document.
