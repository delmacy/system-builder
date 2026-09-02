# Adaptive Governed Work Surfaces — Research 01

## Research question
How can Generation 2 let employees compose useful personal work surfaces and bounded digital-work automation without granting arbitrary frontend/model authority, while preserving Enterprise → Station → Role → Person invariants, provider portability, provenance and governed promotion?

## Representatives and evidence ledger
1. **ServiceNow UI Builder** — page templates, component/content tree, data resources, application scope, responsive pages, audience-targeted page variants. Source of truth: ServiceNow Australia 2026 UI Builder docs (`/docs/r/application-development/ui-builder/work-pages.html`, `/create-variant.html`).
2. **SAP Build Work Zone** — spaces/pages, sections/columns/grid, tiles/cards, role assignment, local versus federated read-only content, workspace/area/company delegated administration. Source of truth: SAP Help Portal Build Work Zone docs for Spaces/Pages, New Experience and Administrators.
3. **Salesforce Lightning App Builder / Dynamic Forms** — component/field composition over existing object metadata, page activation/assignment, component visibility distinct from field security, record forms over existing fields. Source of truth: Salesforce Developers/Trailhead current Lightning/Dynamic Forms docs.
4. **Microsoft Power Apps** — retained as a principal adjacent representative for subsequent deepening of responsive containers, connectors, environment/security and Copilot authoring. Current pass: PARTIAL; no unsupported claims promoted.
5. **Retool** — retained as a principal adjacent representative for subsequent deepening of component/query/action bindings, permissions and AI authoring. Current pass: PARTIAL; no unsupported claims promoted.
6. **Appsmith** — retained as a principal adjacent representative for subsequent deepening of widgets, bindings, workflows and self-hosting. Current pass: PARTIAL; no unsupported claims promoted.

Evidence anchors used in this pass: ServiceNow documents page templates, a content tree of layouts/components, dynamic binding to data resources, application scope, and variants targeted by audience/user criteria. SAP documents role-assigned spaces/pages, grid-based sections/columns, role-filtered cards/apps, federated read-only content alongside local customizable content, and differentiated company/area/page/workspace administrators. Salesforce documents forms composed over existing object fields/layouts, Dynamic Forms field/section placement, org activation/assignment, and explicitly warns that visual hiding does not remove field-level access.

## Source of truth and identity
The universal primitive is not an HTML page. A **Work Surface Definition** is semantic composition over registered components, valid capability/data/action contracts and governed layout primitives. Distinguish `surface identity`, `surface revision`, `overlay identity`, `resolved effective surface`, `materialization attempt/result`, and runtime instance. Provider-specific page IDs/layout JSON remain realization details.

## Enterprise → Station → Role → Person
Resolve effective surface monotonically:

`Enterprise invariants ⊕ Station exposure/policy ⊕ Role overlay ⊕ Person overlay → validated effective surface`

Lower layers may specialize only declared extension points. They cannot remove/relax superior invariants or acquire capabilities/authority not exposed above. A mandatory component carries placement policy: `PINNED`, `MOVABLE_WITHIN_PRIMARY`, `MOVABLE_TO_SECONDARY`, or equivalent; non-removability is independent from prominence.

**Station** is first-class: a bounded operational environment exposing a subset of suite capabilities/contracts/providers, optionally consuming capabilities from a superior SB and allowing delegated administration. SAP's role-assigned spaces, federated read-only content and scoped administrator types are useful adjacent evidence for exposure/delegation, but do not by themselves prove the full SB hierarchy hypothesis.

## Lifecycle and versioning
Draft intent → semantic validation → AI materialization proposal → authority/policy validation → revision → activation → observation → reset/rollback or governed promotion. Personalization is re-resolved whenever Station/Role/capability/permission/contracts change. Promotion creates a new governed overlay/revision; it never mutates the source personal revision into organizational truth.

## Failure semantics
Reject or quarantine a surface revision when component contract, binding, permission, Station exposure, superior invariant or responsive/accessibility constraint is unsatisfied. A failed provider action is an action-attempt failure, not corruption of the surface definition. Stale personalizations must fail closed for newly unavailable authority while preserving diagnosable lineage and a reset path.

## Extensibility and provider boundaries
Components are registered semantic types with required/optional capability contracts, input/output schemas, action classes, accessibility metadata, allowed layout slots and provider-neutral binding requirements. External systems are reached through capability/provider bindings; the surface references the semantic binding, not provider credentials/endpoints. Component extension admission is governed separately from personal composition authority.

## Governance, observability and provenance
Every materialization records requester/intent, base and overlay revisions, effective Enterprise/Station/Role policy revisions, component registry revision, binding resolution, validation result, AI/materializer identity and resulting diff. Observe usage, failures, abandonment, resets and accessibility/conformance outcomes. Usage evidence may support promotion but never grants promotion authority automatically.

## Portability and lock-in
Portable truth is the semantic surface/overlay plus contract references and constrained layout intent. Provider/editor AST, DOM/CSS and proprietary page IDs are non-portable realizations. Symbiotic portability requires re-binding and re-materialization without changing canonical domain truth.

## Product-specific mechanisms vs universal primitives
Product-specific: ServiceNow page variants/application scope; SAP spaces/pages/cards/federation; Salesforce Lightning pages/Dynamic Forms; Power Apps/Retool/Appsmith editor formats.

Universal candidates: semantic component registry; constrained layout grammar; layered overlay resolver; mandatory-component invariant; Station capability exposure; authority-bounded action/automation binding; AI materialization boundary; effective-surface validation evidence; promotion evidence/decision lineage.

## Work-automation authority ladder
1. `view personalization` — composition/read only.
2. `personal action` — user-authorized bounded action.
3. `supervised automation` — bounded multi-step execution requiring review/approval at declared points.
4. `team workflow` — shared process authority owned outside the personal surface.
5. `canonical domain/process change` — architecture/domain authority; never silently materialized from surface editing.

The surface may request higher authority but must escalate. Automation effective authority is intersection of actor, Role, Station, provider binding and action policy; never union.

## Convergent/divergent patterns
Convergence: registry-based composition, existing semantic/data resources, role/audience targeting, templates/structured layouts and separation of visibility from actual authorization. Divergence: products differ on personal versus admin authoring, portability, AI authority, hierarchy, version semantics and whether external/federated content is editable. No reviewed representative establishes the complete SB model; Generation 2 must compose these primitives explicitly rather than clone one product.

## Subcapabilities
Semantic Component Registry; Constrained Layout Grammar; Surface/Overlay Identity & Resolution; Station Capability Exposure; Mandatory Organizational Components; AI Intent-to-Surface Materialization; Safe Data/Action Binding; Authority-Bounded Work Automation; Surface Validation/Revalidation; Personalization Lineage/Reset/Rollback; Evidence-Governed Promotion; Accessibility/Responsive Conformance; Delegated/Hierarchical Administration.

## SB comparison
Deferred to repository archaeology except for explicit research questions below. This pass does not infer product absence from research-branch documents.

## Reconciliation hypotheses
- **GENERALIZE:** generated experience into provider-neutral semantic surface composition rather than arbitrary frontend editing.
- **HARDEN:** authorization with effective-surface and automation-authority proofs.
- **INTEGRATE:** provider/binding plane for external actions/data.
- **PROVIDERIZE:** editor/materializer/rendering implementation details.
- **DO_NOT_BUILD:** arbitrary HTML/CSS/query/schema editing as employee personalization authority.
- **DEFER:** automatic promotion; collect evidence first, require governed decision.

## Repository-validation questions
Does main already model page/component registries, generated view/list/form metadata, role/person customization, immutable domain bindings, provider-neutral actions, station-like capability exposure, personalization revisions, mandatory components, or AI materialization approval? Which contracts currently allow generated UI to imply schema/domain mutation? Where is runtime authority checked relative to generated actions?

## Mandatory Symbiotic Proof
1. Compose useful list/form/grid exclusively over existing canonical entities/contracts; assert zero schema/entity mutation.
2. Reject placement outside allowed grid/slots and arbitrary frontend payloads.
3. Reject removal of superior mandatory component; permit only policy-authorized repositioning.
4. Re-resolve same personal overlay after Station/Role change; reject/repair now-invalid bindings/components.
5. Detect AI intent requiring domain/schema/process change and emit escalation/proposal, not silent mutation.
6. Execute component action through semantic capability binding and replace provider without changing surface definition.
7. Prove personal automation effective authority never exceeds Station/Role/action policy.
8. Demonstrate revision lineage, semantic diff, reset and rollback of personalization.
9. Promote Personal → Team/Role/System only through explicit evidence + governed decision, preserving source lineage.

## Stable findings
- **G2-FINDING-AGWS-01 — Surface Definition, Overlay and Effective Resolved Surface Are Distinct Identities.** Personalization must not overwrite organizational truth.
- **G2-FINDING-AGWS-02 — Visual Composition Authority Must Be Strictly Smaller Than Canonical Domain Authority.** Useful list/form/grid composition can reference existing semantics without granting schema/entity/rule creation.
- **G2-FINDING-AGWS-03 — Station Is a First-Class Capability-Exposure and Delegated-Administration Boundary.** Role/person authority is evaluated inside what the Station exposes; hierarchy may federate read-only/inherited capabilities without transferring ownership.
- **G2-FINDING-AGWS-04 — Superior Invariants Require Monotonic Overlay Resolution and Explicit Mandatory-Component Placement Policy.** Lower layers cannot weaken requirements; non-removable does not necessarily mean permanently prominent.
- **G2-FINDING-AGWS-05 — AI Materialization Is an Authority Boundary, Not Merely an Authoring Convenience.** Intent that crosses from composition into canonical domain/process change must escalate before materialization.
- **G2-FINDING-AGWS-06 — Work-Surface Automation Authority Is the Intersection of Actor, Role, Station, Binding and Action Policy.** Provider reachability or component availability cannot amplify authority.
- **G2-FINDING-AGWS-07 — Provider-Neutral Semantic Binding Is Required for Replaceable Work Surfaces.** Pages bind capabilities/contracts; provider realization is resolved separately.
- **G2-FINDING-AGWS-08 — Personalization Requires Revalidation Against Changing Authority and Capability Context.** A previously valid overlay can become invalid after Station/Role/policy/provider-contract change.
- **G2-FINDING-AGWS-09 — Promotion Is a Governed New Revision Backed by Evidence, Not Automatic Copying of Popular Personalization.** Usage is evidence, not authority.

## Capability candidates discovered
- `G2-CAPABILITY-CANDIDATE-EFFECTIVE-WORK-SURFACE-RESOLUTION-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-STATION-CAPABILITY-EXPOSURE-CONTRACT` — CORE.
- `G2-CAPABILITY-CANDIDATE-AUTHORITY-BOUNDED-WORK-AUTOMATION` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-EVIDENCE-GOVERNED-SURFACE-PROMOTION` — CROSS_CUTTING.

## Value / risk / priority / next question
Value: very high — directly reduces repetitive digital work while preserving enterprise governance. Risk: very high if editor convenience leaks into domain/schema/authorization authority. Priority: CORE candidate is now supported by multi-representative evidence plus explicit SB structural need and should be **PROMOTED into the active research taxonomy**, while remaining NOT SATURATED. Next question: deepen AI authoring, personal/team overlays, version/diff/reset and provider-bound action semantics in the next eligible revisit; repository truth remains a later planning gate.