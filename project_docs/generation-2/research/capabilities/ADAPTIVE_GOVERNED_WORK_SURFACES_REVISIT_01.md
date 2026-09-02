# Adaptive Governed Work Surfaces — Revisit 01 / Cycle 3

## Research question
How should Generation 2 resolve and materialize employee work surfaces so that useful personalization, AI assistance and bounded automation can evolve rapidly while canonical domain/process truth, Enterprise/Station/Role authority, provider portability and superior invariants remain non-weakenable?

This revisit specifically tests the first AGWS dossier against the cycle-3 primitives from Universal Capability Architecture, Process & Application Modeling and UI / Generated Experience: revision-bound semantic identity, capability exposure distinct from authorization/binding, projection-only authority, semantic component contracts, dependency freshness and projection-to-realization lineage.

## Representatives and evidence/source ledger

### 1. Microsoft Power Apps / Dataverse / model-driven apps — DEEP
Primary current sources: Microsoft Learn, 2026.

Evidence used:
- Main forms can be assigned to security roles; fallback forms exist independently of form ordering. Form order determines default presentation, while role assignment determines which forms are available.
- Microsoft 365 Copilot in model-driven apps is read-only for ordinary data exploration; changes require customization with an agent.
- AI-in-apps explicitly introduces agent supervision, activity feeds, spot-checking, intervention and exception handling.
- Power Apps Plans/Copilot maker experiences can generate an application together with a Dataverse data model from natural-language intent.

Architectural use: Power Apps provides unusually clear evidence that presentation selection, security-role availability, read assistance, supervised agent work and maker-level model generation are different authority classes even when exposed inside one product family. It is therefore a strong counterexample to treating all natural-language authoring as one undifferentiated capability.

### 2. ServiceNow UI Builder — DEEP
Primary current sources: ServiceNow Australia 2026 UI Builder documentation.

Evidence used:
- Page variants share a path but target audiences through user criteria and ordered conditions.
- Audiences can include role, group, user, company, department, location and scripts, with allow/deny semantics.
- Data resources bind pages/components to table, GraphQL and REST-backed data rather than requiring duplicated data in each page.

Architectural use: audience/variant resolution demonstrates contextual effective presentation and the need for explainable selection, but it does not by itself provide the stronger SB invariant that a lower layer cannot weaken a mandatory superior requirement.

### 3. SAP Build Work Zone — DEEP
Primary current sources: SAP Help Portal, current 2026 documentation.

Evidence used:
- Spaces contain pages and are assigned through business roles.
- Local pages can coexist with federated read-only pages from remote content providers.
- Transport of roles/spaces/pages/apps has explicit dependency rules; federated content requires compatible target content channels/IDs and role availability, otherwise import warns/fails for those items.

Architectural use: SAP provides direct evidence that portable work-surface structure and successful realization in a target environment are separate concerns. External/federated content references require target-side resolution evidence rather than being assumed valid after export/import.

### 4. Salesforce Lightning App Builder / Dynamic Forms — DEEP (control representative)
Retained from the first pass as control evidence for component/field composition over existing object metadata, assignment/activation and the distinction between visual visibility and actual data security. No new Salesforce-specific finding is promoted in this revisit.

### 5. Appsmith — DEEP for boundary/anti-pattern analysis
Primary source: current Appsmith documentation.

Evidence used:
- UI is composed from prebuilt widgets.
- Datasources include databases and APIs.
- Queries and JavaScript may be written directly in the editor for read/write logic.
- Git-backed collaboration supports branches and rollback; cloud and self-hosted operation are both supported.

Architectural use: Appsmith is a good maker/developer surface but demonstrates why a generic internal-tool editor cannot simply be exposed as the employee AGWS editor. Direct query/JavaScript authority is materially broader than bounded semantic projection/action authority. Generation 2 should preserve the useful registry/binding/version ideas without importing unrestricted maker authority into Person-level composition.

### 6. Retool — PARTIAL
Current Retool documentation confirms apps, AppGen, Agents, Workflows, organization/spaces/permissions and self-hosting as first-class platform concepts. This pass did not obtain sufficiently specific primary evidence for the exact inheritance/version/reset semantics required by AGWS, so Retool remains PARTIAL rather than promoting unsupported claims.

## Source of truth and identity
AGWS does not own canonical entities, schemas, domain rules or team process definitions. Its portable source of truth is a revisioned semantic `WorkSurfaceDefinition` plus optional bounded overlays. Distinct identities are required for:

- `SurfaceDefinitionIdentity`
- `SurfaceRevision`
- `OverlayIdentity` and `OverlayRevision`
- `EffectiveSurfaceResolution`
- `MaterializationProposal`
- `MaterializationAttempt/Result`
- `RuntimeSurfaceInstance`
- `ActionIntent/Attempt/Result`
- `PromotionEvidence` and `PromotionDecision`

The effective resolved surface must carry the exact revisions/scopes that participated in resolution so later validation can determine whether a saved personalization is still admissible.

## Enterprise → Station → Role → Person
The model remains:

`Enterprise invariants ⊕ Station exposure/policy ⊕ Role overlay ⊕ Person overlay → EffectiveSurfaceResolution`

Resolution is monotonic with respect to superior invariants and authority. A lower layer can specialize only declared extension points. It cannot:
- remove a mandatory superior semantic component;
- reveal a capability not exposed by Station;
- grant itself an action forbidden by Role/Station policy;
- convert presentation visibility into authorization;
- convert a projection request into canonical model authority.

`Station` remains first-class. It is the boundary that states which suite capabilities, inherited capabilities, external capability offers and delegated administrative surfaces exist in a bounded operating environment. A Station can expose a partial suite and can consume an inherited/federated capability without taking ownership of its canonical truth.

## Constrained layout and mandatory components
Layout is semantic and deliberately constrained: registered slots, grid tracks, sections, breakpoints and placement classes. Person-level intent may select/add/reorder permitted components but cannot submit arbitrary HTML/CSS/DOM or executable frontend code.

Mandatory-component policy is separate from coordinates. A mandatory item may be `PINNED`, `MOVABLE_WITHIN_PRIMARY`, `MOVABLE_TO_SECONDARY` or equivalent. Responsive materialization may change concrete coordinates without changing the semantic invariant that the component remains reachable in an allowed placement class.

## AI authoring and canonical-change escalation
The evidence exposes two materially different AI modes:

1. **surface materializer** — translates authorized intent into semantic projections/components/bindings over already-valid contracts;
2. **solution/domain author** — may propose or create new tables/model/process assets and therefore requires canonical change authority.

Generation 2 must classify requested mutation class before materialization. A Person asking “add customer risk score to this grid” can be satisfied only if a valid field/derived projection already exists. If satisfying the request requires a new canonical field/entity/rule/process, the result is an escalation/proposal carrying the requested intent and required authority class, not an opportunistic schema mutation.

Power Apps provides important negative evidence here: natural-language maker tooling can intentionally generate a data model, while ordinary in-app Copilot is read-only unless extended with an agent. Generation 2 therefore must not infer authority from the presence of AI itself.

## Safe data/action binding and provider boundary
A surface component references semantic data/action requirements, not credentials, raw provider URLs or unrestricted query text. Resolution follows:

`component semantic requirement → Station-exposed capability → authority/policy evaluation → provider/binding resolution → action attempt/result evidence`

Appsmith's direct query/JavaScript model remains useful for privileged maker tooling, but it is explicitly outside Person-level AGWS authority. Generation 2 may support privileged development surfaces elsewhere; AGWS must not silently collapse into them.

Provider replacement is valid when the semantic capability/action contract remains compatible and a new binding passes required conformance. A page definition should not change merely because a provider implementation changes.

## View personalization → action → automation authority ladder
The ladder is refined into distinct authorization classes:

1. `VIEW_PERSONALIZATION` — semantic arrangement/projection only.
2. `PERSONAL_ACTION` — one user-authorized action against an exposed semantic contract.
3. `SUPERVISED_AUTOMATION` — bounded automation with declared checkpoints, review/approval and exception handling.
4. `TEAM_WORKFLOW` — shared durable process authority owned outside Person overlay.
5. `CANONICAL_DOMAIN_PROCESS_CHANGE` — domain/process architecture authority, always escalated from AGWS.

Power Apps agent supervision provides current product evidence for keeping autonomous work observable and reviewable rather than equating “agent can act” with unrestricted authority.

Effective automation authority is the intersection of actor authority, Enterprise policy, Station exposure/policy, Role authority, delegated grant, semantic action contract, provider binding constraints and any approval policy. No component, AI agent or reachable provider can increase that set.

## Lifecycle, version, diff, reset and rollback
Lifecycle:

`intent → semantic proposal → authority classification → validation → AI materialization → revision → activation → observation → revalidation → reset/rollback or governed promotion`

A semantic diff compares surface/overlay intent and bindings. A realization diff compares renderer/materializer output. These are not interchangeable.

Reset means discard/rebase a lower overlay against the current superior baseline. Rollback activates an earlier admissible overlay/surface revision; it must still be revalidated against current Station/Role/capability/policy state. Restoring bytes is not proof that an old personalization is currently authorized.

## Dependency freshness and revalidation
A saved personalization carries a dependency set such as:
- Enterprise policy revision;
- Station capability-exposure revision;
- Role/permission revision;
- canonical projection/model revision references;
- component-registry revision;
- semantic action contract revision;
- provider/binding compatibility evidence revision;
- mandatory-component policy revision.

Any material change invalidates freshness until a new `EffectiveSurfaceResolution` is evaluated. Revalidation can preserve, repair/rebase, quarantine or reject affected overlay fragments. It must fail closed for authority removed since the previous resolution.

## Delegated administration, hierarchy and partial-suite portability
A superior SB/Enterprise may govern invariants and publish capability exposure contracts while a subordinate Station delegates bounded administration over local composition. Delegation cannot transfer canonical ownership accidentally.

SAP federation/transport evidence supports the need to distinguish portable semantic references from target-environment realization. An imported Station/surface cannot be considered operational until referenced capability channels/providers/roles are resolved and validated in the target environment.

## Governance, observability and provenance
Every effective resolution and materialization should be explainable. Evidence should answer:
- which layer required, allowed, denied or supplied each component;
- why a component is mandatory/non-removable;
- which capability exposure and action policy allowed a binding;
- which AI/materializer revision produced the result;
- which dependency revisions were validated;
- what was changed semantically versus only in rendering;
- which actor/agent attempted an action and with what effective authority;
- what usage/quality evidence supports a promotion proposal.

Usage is promotion evidence, not promotion authority. Personal → Team/Role/System promotion creates a new governed revision after review; it never mutates the personal source into organizational truth.

## Accessibility and responsive conformance
Semantic component contracts must carry accessibility and responsive expectations inherited from generic Generated Experience. AGWS adds governance: a Person may not hide/remove mandatory accessible affordances or place a required component into a layout class forbidden by superior policy. Renderer-specific coordinates may vary across breakpoints without changing mandatory semantic reachability.

## Portability and lock-in
Portable truth consists of semantic surface/overlay intent, stable component types, constrained layout grammar, semantic capability/action references and revision-bound provenance. DOM/CSS, Retool/Appsmith editor ASTs, proprietary page IDs and provider credentials are realization details. Target realization requires capability/binding resolution and conformance evidence.

## Product-specific mechanism vs universal primitive
Product-specific:
- Power Apps form security-role assignment/fallback forms, Copilot/Plans/Dataverse generation;
- ServiceNow audience criteria and ordered page variants;
- SAP spaces/pages/role/federated content transport rules;
- Salesforce Lightning/Dynamic Forms;
- Appsmith widget/query/JavaScript/Git editor;
- Retool AppGen/Agents/Workflows/spaces.

Universal AGWS primitives:
- revisioned WorkSurfaceDefinition and overlay;
- monotonic effective-surface resolver;
- Station capability-exposure contract;
- constrained semantic layout grammar;
- mandatory-component invariant and placement policy;
- AI mutation-class/authority classifier;
- semantic component/data/action binding;
- bounded work-automation authority;
- dependency-freshness/revalidation evidence;
- semantic versus realization diff/lineage;
- evidence-governed promotion.

## Convergent and divergent patterns
Convergence: component registries, role/audience-targeted experiences, composition over existing data resources, explicit deployment/publish lifecycle, external connectors/providers and increasing AI assistance.

Divergence is architecturally more important: maker tools frequently allow model generation, arbitrary query/JavaScript or broad application mutation; employee-facing assistants can be read-only or supervised; federated content may be read-only and target-dependent; role selection may choose presentation but not encode superior non-weakenable invariants. Generation 2 must compose the safe subset rather than clone one editor.

## Subcapabilities
Semantic Component Registry; Constrained Layout Grammar; Surface/Overlay Identity; Effective Surface Resolver; Station Capability Exposure; Mandatory Component Policy; AI Mutation-Class Classification; AI Intent-to-Surface Materialization; Canonical-Change Escalation; Safe Projection Binding; Provider-Neutral Action Binding; Authority-Bounded Personal Action; Supervised Automation; Dependency Freshness/Revalidation; Semantic/Realization Diff; Reset/Rollback; Evidence-Governed Promotion; Accessibility/Responsive Conformance; Delegated/Hierarchical Administration; Partial-Suite/Federated Capability Realization.

## SB comparison — evidence only
A limited fresh-main code search using generic terms for `SystemDefinition`, UI/page/view/form/list/grid/binding/role/permission/generated did not produce a positive result in this run. That is recorded only as **no evidence obtained by this bounded search**, not as proof that the repository lacks such contracts. Repository-wide archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP:** existing provider-neutral/domain-authority separations if later repository archaeology confirms them.
- **GENERALIZE:** generated views into revisioned semantic WorkSurfaceDefinition/Projection primitives.
- **HARDEN:** effective authority, dependency-freshness, mandatory-component and revalidation evidence.
- **PROVIDERIZE:** concrete rendering/editor/provider realizations.
- **INTEGRATE:** Station capability exposure with provider/binding and authorization planes.
- **REPLACE:** any future employee personalization path that relies on arbitrary query/JS/HTML/CSS instead of bounded semantic contracts.
- **DEFER:** automatic promotion based solely on usage telemetry.
- **DO_NOT_BUILD:** silent AI schema/entity/domain/process mutation from Person/Role work-surface intent.

## Repository-validation questions
1. Which existing main contracts represent generated forms/lists/grids and do they reference canonical entities by stable semantic identity/revision?
2. Is there already a capability-exposure primitive separable from provider offer, authorization and binding that can represent Station?
3. Where are generated actions authorized at runtime and can UI metadata accidentally amplify authority?
4. Are component/action bindings semantic or provider-specific?
5. Is there current projection-to-realization lineage and dependency-freshness evidence?
6. Can a generated UI request trigger schema/domain mutation today, and through which authority gate?
7. Do existing identity/organization contracts support delegated/hierarchical scope without hard-coding AGWS hierarchy into universal primitives?
8. What current build/runtime contracts allow an already-materialized surface to remain autonomous if Builder/model provider is unavailable?

## Re-run of the nine mandatory Symbiotic Proofs
1. **List/form/grid without canonical model creation — PASS AS TARGET PROOF SHAPE.** Materializer receives only projection authority and existing semantic entity/field contracts; any missing canonical primitive causes escalation, not creation.
2. **Constrained layout — PASS AS TARGET PROOF SHAPE.** Surface IR accepts only registered component types and permitted semantic slots/grid rules; HTML/CSS/JS/query payloads are rejected at Person authority.
3. **Mandatory component non-removal — PASS AS TARGET PROOF SHAPE.** Effective resolver rejects deletion; placement may change only within declared placement policy and responsive semantic reachability.
4. **Revalidation after Station/Role change — PASS AS TARGET PROOF SHAPE.** Saved overlay dependency set becomes stale and must resolve again; removed exposure/authority fails closed while repair/reset remains available.
5. **AI canonical-change escalation — PASS AS TARGET PROOF SHAPE.** Mutation-class classifier distinguishes projection materialization from canonical model/process change and emits a governed escalation/proposal.
6. **Provider-bound action without page coupling — PASS AS TARGET PROOF SHAPE.** Surface references semantic action requirement; Station/provider plane resolves binding; compatible provider replacement leaves surface semantics unchanged.
7. **Personal automation respects authority — PASS AS TARGET PROOF SHAPE.** Effective authority is intersection, and supervised automation retains checkpoints/exception evidence.
8. **Lineage/version/diff/reset/rollback — PASS AS TARGET PROOF SHAPE.** Surface/overlay revision lineage and semantic diff are separate from renderer realization; rollback requires current revalidation.
9. **Evidence-governed promotion — PASS AS TARGET PROOF SHAPE.** Usage/quality evidence creates a promotion proposal; authorized reviewer creates a new Team/Role/System revision preserving source lineage.

These are research-level proof obligations, not claims that current System Builder implementation passes them.

## Stable findings
- **G2-FINDING-AGWS-10 — AI Authoring Authority Must Be Classified by Mutation Class Before Materialization.** Natural-language authoring can range from read assistance through surface projection to model generation; AI presence itself grants no authority.
- **G2-FINDING-AGWS-11 — Employee Work-Surface Authoring Must Exclude Privileged Query/Script/Frontend Escape Hatches.** Generic low-code maker mechanisms such as arbitrary queries/JavaScript are broader than Person-level semantic composition and belong behind a higher authority boundary.
- **G2-FINDING-AGWS-12 — Effective Surface Resolution Requires Explainable Layer Contribution and Conflict Evidence.** Multi-role/audience/overlay selection is insufficient if the system cannot explain which superior layer required/denied/supplied a component or capability.
- **G2-FINDING-AGWS-13 — Personalization Validity Requires a Revision-Bound Dependency Set, Not Merely a Saved Layout Revision.** Station exposure, Role authority, component registry, projection and action-contract changes can invalidate an otherwise unchanged overlay.
- **G2-FINDING-AGWS-14 — Portable Surface Definition and Target Station Realization Are Separate Proofs.** Federated/external capability references must be resolved and conformance-checked in the target Station after import/migration.
- **G2-FINDING-AGWS-15 — Read Assistance, Suggested Mutation, Supervised Automation and Canonical Change Require Distinct Authority Classes.** A product may safely expose read-only AI and supervised agents while reserving write/model authoring for stronger authority; AGWS must encode this separation explicitly.

## Capability candidates discovered
- `G2-CAPABILITY-CANDIDATE-AI-MUTATION-CLASS-AUTHORITY-CLASSIFIER` — CROSS_CUTTING. Promotion condition: AI-native/Process/AGWS synthesis confirms one reusable pre-materialization authority classifier.
- `G2-CAPABILITY-CANDIDATE-EFFECTIVE-SURFACE-DEPENDENCY-FRESHNESS-PROOF` — CROSS_CUTTING. Promotion condition: lifecycle/provider/UI synthesis confirms shared revision-freshness semantics.
- `G2-CAPABILITY-CANDIDATE-STATION-REALIZATION-CONFORMANCE-EVIDENCE` — CROSS_CUTTING. Promotion condition: deployment/provider/portability synthesis confirms a reusable source-definition-versus-target-realization proof.

## Value / risk / priority / next question
Value remains very high: AGWS can remove large amounts of repetitive digital work while preserving a governed enterprise operating model. Primary risk is authority collapse—mistaking a convenient AI/low-code editor for permission to mutate canonical truth or execute arbitrary code/actions. Priority remains CORE and NOT SATURATED because this revisit produced six material findings.

Next research question follows pipeline rotation, not local preference: continue with Workflow & Durable Execution and test whether personal/supervised automation can preserve semantic operation identity, durable attempt/result lineage, cancellation/retry/idempotency, approval checkpoints and Station/Role effective authority without turning AGWS into the owner of team workflow semantics.