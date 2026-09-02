# Adaptive Governed Work Surfaces — Revisit 03 / Cycle 5

## Research question
How should Generation 2 resolve, personalize, promote and recover `Enterprise → Station → Role → Person` work surfaces so that convenience may increase while authority never amplifies, generic UI evolution remains reusable, and effective behavior stays explainable under concurrent edits, provider changes, accessibility constraints and partial/offline evidence?

AGWS remains distinct from generic UI. UI owns renderer-neutral projection/component/layout semantics; AGWS owns hierarchical capability exposure, non-weakenable inherited obligations, delegated administration, bounded personalization/automation and evidence-governed promotion.

## Representatives and evidence/source ledger

### Microsoft Power Platform solution layering — DEEP
Official Power Platform ALM documentation describes a component as a stack of solution layers in which base/publisher and managed properties remain identifiable while the current top layer determines runtime behavior. This is useful evidence that effective behavior can differ from any one underlying authored layer and that ownership/managed constraints remain independent of what is currently effective.

Source: https://learn.microsoft.com/en-us/power-platform/alm/solution-layers-alm

### ServiceNow UI Builder variants — DEEP
Australia-release documentation updated March 12, 2026 states that page variants share a page path but are selected by audiences, conditions and order. Editing variant settings requires privileged roles (`admin`/`ui_builder_admin`). Multiple matching variants are resolved by explicit priority.

Sources:
- https://www.servicenow.com/docs/r/application-development/ui-builder/edit-variant-settings.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/learn-by-example-define-conditions.html
- https://www.servicenow.com/docs/r/application-development/ui-builder/work-pages.html

Architectural use: effective surface selection is a contextual, explainable resolution result. A matching audience/condition is not itself authorization to underlying data/actions, nor permission to mutate superior variants.

### SAP Build Work Zone — DEEP
SAP documents spaces/pages assigned through business roles, federated content that can remain read-only, and transport rules in which target-side content channels/roles must exist. Missing target dependencies produce warnings/non-import rather than silently valid activation. SAP also documents environments where local page/space changes are disallowed while role assignment can remain administratively mutable.

Sources:
- https://help.sap.com/docs/build-work-zone-standard-edition/sap-build-work-zone-standard-edition/before-transporting-content-important-rules-and-guidelines
- https://help.sap.com/docs/build-work-zone-advanced-edition/sap-build-work-zone-advanced-edition/manual-configuration-of-spaces-and-pages
- https://help.sap.com/docs/btp/user-interface-configurations/assigning-spaces

Architectural use: surface content ownership, target activation, role assignment and provider/federation availability are separate authorities and lifecycle facts.

### Salesforce Lightning App Builder — DEEP
Lightning record pages can be activated at organization, application, application+record-type+profile and form-factor scopes. This is a practical multi-dimensional specialization model whose effective result depends on context rather than one mutable page identity.

Source: https://trailhead.salesforce.com/content/learn/modules/lightning_app_builder/lightning_app_builder_recordpage

### CHI 2026 reflexive personalization study — DEEP literature challenge
Alves et al., CHI 2026, report that users can identify personalization opportunities but prefer system support through visible suggestions and interaction-data transparency. The useful architectural lesson is not to automate promotion from observed usage: interaction evidence is decision support whose value depends on transparency and user agency.

Source/DOI: https://doi.org/10.1145/3772318.3791022

### Adaptive-access-control literature — SUPPORTING
MRAAC (ACM TOPS 2024) shows that independently adapting policies without structured stages can create contradictory/insecure outcomes and that adaptation should remain constrained by context/resource sensitivity. This is not an AGWS implementation model; it is negative-space evidence that adaptive presentation must never be allowed to mutate or infer broader access authority implicitly.

Source/DOI: https://doi.org/10.1145/3648372

## Cycle-5 primitive refinement

### 1. Effective surface resolution is distinct from generic projection identity
AGWS resolution is now modeled as:

`resolve(Enterprise@e, StationExposure@s, RoleOverlay@r, PersonOverlay@p, Projection@u, Policy@a, ProviderBindings@b, AccessibilityProfile@x) -> EffectiveSurfaceResolution@q + ResolutionEvidence`

`Projection@u` remains generic UI identity. `EffectiveSurfaceResolution@q` is AGWS-owned evidence explaining which hierarchical inputs were applicable, rejected, shadowed, constrained or stale.

### 2. Lower-layer edits require expected-base and ownership preconditions
A Person or Role overlay is an edit against exact superior dependency generations. Concurrent mutation cannot be last-write-wins over semantic units. Each mutation carries expected base revisions and ownership of the component/slot/binding being changed. A stale lower overlay yields `REBASE_REQUIRED`, `CONFLICT`, `AUTHORITY_REMOVED` or `INCONCLUSIVE`, not silent overwrite.

### 3. Monotonic authority is evaluated after resolution, not inferred from layer order
The hierarchy is not simply CSS-style precedence. `Person` may override permitted presentation choices but cannot override a non-weakenable Enterprise invariant, expand Station exposure, exceed Role action authority or acquire provider-admin capability. The resolver therefore computes effective convenience and effective authority separately and proves the latter is a subset/intersection of superior grants.

### 4. Mandatory components need obligation identity
A mandatory component is represented by stable semantic obligation identity plus allowed placement/profile constraints. Lower layers can specialize permitted presentation but cannot satisfy the obligation by deleting it, substituting an unapproved semantic component or hiding it outside accessibility/navigation requirements.

### 5. Station exposure and delegated administration are separate facets
Station administrators may have authority to expose/withdraw locally allowed capabilities or assign bounded surfaces without receiving canonical-domain, provider-admin, secret, promotion or Enterprise-policy authority. Provider capability support is also separate from Station authority to expose it.

### 6. AI materialization is proposal/attempt authority only
Employee intent is materialized by AI into a deterministic semantic candidate. The candidate must pass schema, superior-obligation, authority, accessibility and binding validation. If intent requires a new canonical field/process/provider privilege, the result is an escalation/proposal artifact. Human approval cannot convert an invalid candidate into valid semantics without the corresponding authoritative transition.

### 7. Personal automation is an attenuated execution principal
A surface-triggered personal automation executes under the intersection of actor, Station exposure, Role/Person delegated grant, semantic action contract, current binding profile and approval policy. Materialization or possession of a button/action reference never grants execution authority.

### 8. Promotion is evidence-informed but authority-bearing
Interaction/usage evidence may nominate a Personal pattern for Team/Role/System promotion, but promotion remains `proposal -> validation -> approval -> attempt -> target revision -> postcondition evidence`. CHI 2026 supports preserving transparency/user agency around data-derived personalization suggestions; observed popularity is not organizational authority.

## Failure semantics
Important states now include `STALE_EXPECTED_BASE`, `SEMANTIC_OWNERSHIP_CONFLICT`, `SUPERIOR_OBLIGATION_VIOLATION`, `STATION_EXPOSURE_WITHDRAWN`, `ROLE_AUTHORITY_STALE`, `PROVIDER_BINDING_UNRESOLVED`, `ACCESSIBILITY_NONCONFORMANT`, `DEPENDENCY_INCONCLUSIVE`, `AI_ESCALATION_REQUIRED`, `PROMOTION_NOT_AUTHORIZED` and `LOCAL_CLOSURE_INCOMPLETE`.

A surface may remain partially usable only where quarantining a failing optional component preserves mandatory obligations and authority. Missing evidence never authorizes omission of a mandatory component or broadens access.

## Observability, versioning and rollback
Resolution evidence records exact input generations, winner/rejection explanations per semantic unit, ownership/precondition decisions, authority intersection, provider binding status, accessibility profile and freshness. `diff/reset/rollback` operate over overlay lineage, not raw rendered bytes. Rollback is eligible only if current superior obligations, authority, component contracts and required local/provider dependencies remain compatible.

## Portability and provider boundaries
Portable truth contains semantic components/actions, constrained slots/grid, obligation identities, overlay intent, hierarchical dependencies, expected-base/ownership metadata and validation lineage. Renderer ASTs, DOM/CSS, provider credentials and provider-native permission identifiers remain realizations/bindings. Provider replacement reissues binding/realization evidence without changing canonical surface intent when semantic capability requirements are still satisfied.

## Qualified local/offline closure
Local interpretation/materialization requires the exact surface/overlay revisions, semantic component registry, projection contracts, Station exposure snapshot, applicable role/policy evidence, accessibility rules, binding capability descriptors, validators and trust material. Offline closure can prove `interpret/materialize/validate locally`; it cannot claim external action reachability or acquire absent authority.

## Product-specific mechanism vs universal primitive
Power Platform layer stacks, ServiceNow variant order/audiences, SAP spaces/roles/federated transport and Salesforce activation scopes are product mechanisms. Reusable Generation-2 primitives are expected-base/ownership concurrency evidence, revision-qualified validation, attempt/effective/postcondition lineage, INCONCLUSIVE dependency propagation and provider-neutral binding. AGWS-specific primitives remain monotonic hierarchical resolution, Station exposure/delegated administration, superior obligation identity, attenuated personal automation and governed personalization promotion.

## Convergent/divergent patterns
Convergence: mature systems resolve experiences through contextual roles/audiences/scopes; retain explicit administrative boundaries; and require target-side dependencies. Divergence: products vary on inheritance, editable layers, maker power and promotion. Generation 2 therefore preserves the stricter invariant that presentation specialization cannot manufacture domain or execution authority.

## Reconciliation hypotheses
- **KEEP:** runtime-autonomous effective surfaces and provider-neutral semantic actions if repo evidence confirms them.
- **HARDEN:** expected-base/ownership conflicts, monotonic authority proof, superior obligation identity, accessibility and dependency-INCONCLUSIVE semantics.
- **GENERALIZE:** shared concurrency/evidence/transition contracts while AGWS keeps hierarchical semantics.
- **PROVIDERIZE:** renderer/editor/provider realizations and external action bindings.
- **INTEGRATE:** Station exposure with Authorization, Provider/Binding, Lifecycle and Observability.
- **REPLACE:** implicit last-write-wins overlays or page metadata treated as authorization.
- **DEFER:** automatic organizational promotion from usage/AI recommendation.
- **DO_NOT_BUILD:** any personalization path that expands authority, silently mutates canonical domain/process truth, or bypasses mandatory inherited obligations.

## Repository-validation questions
1. Can current contracts represent semantic overlay expected-base and field/component ownership without adopting a UI-framework AST?
2. Is Station already represented as a first-class capability exposure/delegation boundary or only as tenancy/organization metadata?
3. Can authorization express an effective intersection across Enterprise/Station/Role/Person and action/binding scopes?
4. Is there reusable revision-qualified evidence for projection, provider binding and accessibility validation?
5. Can local runtime retain an effective surface while Builder/AI is absent without retaining unauthorized mutation authority?
6. Are generated actions bound semantically enough for provider substitution without page rewrites?
7. Can promotion create a new organizational revision while preserving immutable Personal source lineage?
8. Which existing provenance envelopes can represent expected-base conflict, resolution explanation and rollback eligibility?

## Symbiotic Proof — explicit cycle-5 backfill
1. **Monotonic authority adversarial proof:** Person overlay requests an action not exposed by Station or Role; layout may otherwise validate, but action remains denied and no grant is synthesized.
2. **Mandatory-obligation proof:** attempt to delete/hide/substitute a mandatory inherited component; validation rejects the candidate while permitted placement specialization still succeeds.
3. **Concurrent-overlay proof:** two Person/Role edits share one expected base and mutate the same semantic unit; stale commit conflicts/rebases rather than overwrites.
4. **Station revalidation proof:** withdraw/replace Station capability or delegated admin grant; unchanged lower overlays become stale and are re-resolved before use.
5. **AI canonical-boundary proof:** ask AI for a surface requiring a nonexistent field/process mutation; candidate becomes escalation/proposal and canonical truth remains unchanged.
6. **Provider substitution proof:** replace an external action provider while preserving semantic action identity; effective surface remains portable only after new binding/conformance evidence.
7. **Personal automation attenuation proof:** surface automation attempts provider-admin/secret/canonical mutation beyond effective user authority; independent enforcement denies it.
8. **Accessibility/dependency proof:** render succeeds while mandatory accessibility semantics fail, then remove a required validator/binding descriptor; results distinguish `NONCONFORMANT` from `INCONCLUSIVE`.
9. **Promotion proof:** usage evidence nominates a Personal pattern, but no Role/System revision exists until separate validation/approval/attempt/postcondition completes.
10. **Rollback/local-closure proof:** rollback from retained overlay locally, then remove one required superior revision/component/trust dependency; rollback becomes unavailable/INCONCLUSIVE rather than falsely safe.

## Stable findings
- **G2-FINDING-AGWS-22 — Effective AGWS Resolution and Generic UI Projection Identity Are Separate Subjects.** The same projection may resolve differently across Station/Role/Person contexts without changing its generic UI identity.
- **G2-FINDING-AGWS-23 — Hierarchical Personalization Requires Expected-Base and Semantic Ownership Preconditions.** Lower-layer convenience cannot use last-write-wins when superior or concurrent semantic units changed.
- **G2-FINDING-AGWS-24 — Enterprise→Station→Role→Person Is a Monotonic Authority Constraint, Not Merely a Precedence Stack.** Effective authority must be proven as a non-amplifying subset/intersection after resolution.
- **G2-FINDING-AGWS-25 — Mandatory Inherited UI Elements Need Stable Obligation Identity Separate From Renderer Placement.** Presence and semantic duty survive layout/provider changes while permitted presentation may vary.
- **G2-FINDING-AGWS-26 — Station Exposure and Delegated Administration Are Action-Faceted Authorities Separate From Provider Capability and Canonical Ownership.** Provider support never implies Station exposure or administrative permission.
- **G2-FINDING-AGWS-27 — Personal Automation Executes Under Attenuated Effective Authority; Surface Materialization Never Grants Execution Authority.** Action references and AI-generated controls remain non-authorizing presentation artifacts.
- **G2-FINDING-AGWS-28 — Accessibility and Dependency Qualification Are Part of Governed Effective-Surface Evidence.** Visual/render success can coexist with accessibility failure, while missing validators/bindings must produce explicit INCONCLUSIVE results.
- **G2-FINDING-AGWS-29 — Personalization Promotion Is Evidence-Informed but Remains a Separate Authority-Bearing Organizational Transition.** Usage/interaction data and AI recommendations can nominate patterns but cannot self-promote them.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-AGWS-MONOTONIC-EFFECTIVE-AUTHORITY-PROOF` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with universal faceted/non-amplifying authority while preserving AGWS hierarchy semantics.
- `G2-CAPABILITY-CANDIDATE-AGWS-SEMANTIC-OVERLAY-OWNERSHIP-PRECONDITIONS` — **CROSS_CUTTING / MERGE_TARGET**. Merge with UCA/PAM/UI expected-base and ownership evidence if the common contract survives Workflow/Data revisits.
- `G2-CAPABILITY-CANDIDATE-AGWS-SUPERIOR-OBLIGATION-IDENTITY` — **CORE / CANDIDATE**. Keep AGWS-owned unless negative-space research shows reusable mandatory-obligation semantics across other adaptive surfaces.
- `G2-CAPABILITY-CANDIDATE-AGWS-EVIDENCE-GOVERNED-PERSONALIZATION-PROMOTION` — **CROSS_CUTTING / MERGE_TARGET**. Reconcile with shared governed transition while retaining Personal→Team/Role/System source/target authority semantics.

No candidate is promoted. `Adaptive Governed Work Surfaces` remains the already-promoted mandatory capability and remains distinct from generic UI.

## Value / risk / priority / next question
**Value:** preserves enterprise invariants while allowing high-value employee personalization and AI-assisted materialization. **Risk:** a precedence-only implementation could silently turn UX adaptation into authority amplification or produce opaque stale overlays. **Priority:** HIGH. **Next question:** whether Workflow & Durable Execution confirms the same attempt/effective/postcondition, ownership, attenuated-authority and INCONCLUSIVE evidence contracts for long-lived executions without collapsing domain ownership.