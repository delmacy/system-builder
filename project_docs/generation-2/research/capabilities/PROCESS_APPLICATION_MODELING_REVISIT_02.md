# Generation 2 Research — Process & Application Modeling — Revisit 2 / Cycle 3

Status: RESEARCH_ELICITATION; revisit cycle 3 pass complete; NOT SATURATED.

## Research question
How should Generation 2 distinguish canonical domain/application semantics from process definitions, UI/work-surface projections, execution instances and evidence so that models remain portable, evolvable and provider-neutral while Adaptive Governed Work Surfaces can compose useful views/actions without silently mutating canonical domain/process truth?

## Representatives and evidence ledger
| Representative | Coverage | Evidence / contribution |
|---|---|---|
| Mendix Domain Model + Microflows + Model Access API | DEEP | Each module owns a domain model of entities/attributes/associations; microflows express runtime logic separately; the Model Access API exposes model components as distinct document/unit structures. https://docs.mendix.com/refguide10/domain-model/ ; https://docs.mendix.com/refguide/microflows/ ; https://docs.mendix.com/apidocs-mxsdk/apidocs/web-extensibility-api-11/model-api/ |
| Microsoft Power Apps / Dataverse model-driven apps | DEEP | Dataverse tables/columns/relationships define the data model before forms/views; app components are metadata and solution-component dependencies are explicitly tracked. https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/define-data-model-driven-app ; https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/model-driven-app-components ; https://learn.microsoft.com/en-us/power-apps/maker/data-platform/view-component-dependencies |
| ServiceNow App Engine Studio + Workflow Studio | DEEP | Application data tables/fields are defined separately from flows; flows are stored within app scope, use triggers/actions/flow logic, and authors are expected to understand target table structure and existing business logic. https://www.servicenow.com/docs/r/application-development/define-and-build-data-model.html ; https://www.servicenow.com/docs/r/build-workflows/workflow-studio/create-flow.html |
| OMG BPMN 2.0.2 | DEEP | Process, Collaboration and Choreography are related but distinct semantic viewpoints; message exchanges and participants allow cross-view mapping without flattening everything into one execution graph. https://www.omg.org/bpmn/ |
| JSON Schema 2020-12 / prior baseline | DEEP | Stable schema-resource identity, references and vocabulary semantics support representation-independent semantic units; resolution is not equivalent to execution authority. https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01 |

## Source of truth
The strongest convergent pattern is not a single universal metamodel. It is a **layered semantic authority model**:

1. canonical domain/application model owns entities, attributes, relationships, invariants and domain-level semantic identity;
2. process/workflow definitions reference that model and own orchestration/control-flow semantics, not the canonical meaning of referenced domain objects;
3. view/form/list/grid/work-surface definitions are projections over canonical models and process/action contracts;
4. runtime executions instantiate process/action definitions and produce evidence but do not become the source of truth for the definition;
5. generated/runtime/provider realizations remain replaceable realizations of the above.

For Generation 2, the portable definition should therefore represent explicit semantic references across these layers instead of allowing a UI/process editor to create implicit domain authority merely by referencing or rendering a field.

## Identity
The revisit refines five distinct identities:

- `CanonicalModelUnitIdentity` — stable identity of a domain/application semantic unit;
- `SemanticRevision` — revision of that unit;
- `ProjectionDefinitionIdentity` — identity of a form/view/list/grid/work-surface projection;
- `ProcessDefinitionIdentity` — identity of process/orchestration semantics;
- `ExecutionInstanceIdentity` — identity of a running/completed process/action instance.

A process or projection references canonical units by semantic identity and compatible revision/profile; it does not inherit ownership of them.

## Lifecycle
Recommended conceptual lifecycle:

`canonical draft -> validate -> publish revision -> reference from process/projection -> validate reference compatibility -> materialize provider/runtime realization -> execute/observe -> produce evidence -> evolve through governed new revision`.

A projection or process can evolve without a domain revision when it only changes presentation/orchestration within existing contracts. If a requested change requires a new entity, attribute, invariant or canonical business rule, the change crosses an authority boundary and must become a canonical-domain proposal/revision rather than an implicit projection/process edit.

## Versioning
Version dimensions must remain independent:

- canonical semantic revision;
- process-definition revision;
- projection/work-surface revision;
- provider/binding realization revision;
- execution-instance revision/context snapshot;
- evidence revision/freshness.

Compatibility needs explicit evidence. A process definition that still resolves a field reference can nevertheless be incompatible because cardinality, allowed values, authority policy or semantic meaning changed.

## Failure semantics
Material failure classes:

- unresolved canonical reference;
- reference resolved but revision/profile incompatible;
- process definition valid but execution realization unavailable;
- projection valid but stale against canonical revision;
- action reference valid but actor/Station/Role lacks effective authority;
- AI materialization request exceeds projection/process authority and requires domain escalation;
- partial execution produces evidence/side effects but does not mutate the source process definition.

Failure recovery must preserve lineage between definition revision, execution attempt and resulting evidence.

## Extensibility
Extensibility should occur through named/owned semantic units, process/action types, projection component contracts and provider adapters. Extending a view or process vocabulary must not implicitly create new domain types or execution authority. Product-specific visual/modeling syntax can remain provider/tool-specific as long as the exported semantic contract is stable and inspectable.

## Provider boundaries
Provider-neutral process/action references should bind through capability/action contracts. A process definition may say “invoke capability X action Y with contract Z” while provider selection/binding remains in the provider plane. Likewise a form/list/grid references canonical data/query/action contracts rather than provider-specific query language.

This preserves replacement: changing a workflow engine, datastore, UI renderer or external service provider should not require changing canonical domain identity when the semantic contract remains satisfied.

## Governance
Governance must distinguish authorities to:

- revise canonical domain/process semantics;
- create or revise projections;
- bind providers;
- execute actions;
- automate actions;
- promote personal/team/role work-surface patterns.

Adaptive Governed Work Surfaces compose only within delegated projection/action authority. They may request escalation but cannot silently widen canonical semantics or authority.

## Observability
Required evidence should connect:

`canonical revision -> process/projection revision -> reference-resolution/compatibility result -> binding realization -> execution attempt -> result/effect -> post-execution evidence`.

The observability goal is not merely runtime telemetry; it is proof that the executing projection/process corresponded to the intended semantic revisions and effective authority context.

## Portability and lock-in
Metadata-driven products demonstrate that declarative/model-driven design can still be deeply platform-bound. Portability requires exportable semantic identities, typed references, explicit process/projection contracts, compatibility rules and provider-neutral action bindings. Copying proprietary page definitions, workflow notation or database metadata is not a universal IR strategy.

## Product-specific mechanism vs universal primitive
Do not copy Mendix microflow syntax, Dataverse solution-component IDs, ServiceNow flow records or BPMN notation into the universal IR.

Reusable primitives strengthened by this revisit:

- `CanonicalModelUnitIdentity`
- `SemanticRevision`
- `TypedSemanticReference`
- `ProjectionDefinitionIdentity`
- `ProcessDefinitionIdentity`
- `ExecutionInstanceIdentity`
- `ReferenceCompatibilityEvidence`
- `ProviderNeutralActionReference`
- `AuthorityBoundMaterializationDecision`
- `DefinitionExecutionEvidenceLineage`

## Convergent and divergent patterns
### Convergent
- data/domain semantics are distinguishable from UI projections;
- process/logic artifacts reference application data rather than collapsing into it;
- application components have explicit dependency graphs;
- model artifacts have stable identities/containers/scopes;
- publication/deployment is distinct from editing;
- runtime execution is downstream of definitions.

### Divergent
- Mendix couples modeling tightly to its runtime while exposing a rich metamodel;
- Power Apps centers Dataverse as the mandatory model-driven data substrate;
- ServiceNow centers tables/records and platform-scoped flows;
- BPMN standardizes process notation/semantics but does not define a universal enterprise domain model.

Generation 2 should reuse the separations, not the platform lock-in.

## Subcapabilities
- Canonical Domain/Application Semantic Model
- Typed Semantic Reference Graph
- Process Definition and Process Revision
- Projection/View/Form/List/Grid Definition
- Definition-to-Execution Lineage
- Reference Compatibility and Freshness Evidence
- Provider-Neutral Action Reference
- Canonical Change Escalation
- Application/Module Dependency Graph
- Governed Projection Promotion

## System Builder comparison — fresh main only
A limited fresh-main search in this run did not yield sufficiently precise repository matches to make a new implementation claim. This is recorded as **insufficient evidence**, not as repository-wide absence. Existing research hypotheses remain non-authoritative until dedicated fresh-main archaeology in `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP/HARDEN** portable declarative model structures if archaeology confirms stable semantic identity and deterministic references.
- **GENERALIZE** explicit canonical-unit, process-definition, projection-definition and execution-instance identities if current structures conflate them.
- **GENERALIZE** revision-bound compatibility/freshness evidence across projections and process references.
- **PROVIDERIZE** workflow/runtime/UI/data realization while retaining provider-neutral semantic/action contracts.
- **INTEGRATE** external models/processes through typed references and explicit binding/trust/compatibility evidence.
- **REPLACE** any implicit mechanism where page/process authoring silently mutates canonical schema/business semantics without a governed canonical revision.
- **DEFER** exact metamodel/IR schema until synthesis and fresh-main reconciliation establish ownership boundaries.
- **DO_NOT_BUILD** one universal executable modeling language spanning domain, UI, workflow and provider runtime semantics.

## Repository-validation questions
1. Which current `SystemDefinition` units own canonical domain semantics, and are identities independent from rendering/storage/provider mechanisms?
2. Are process/workflow definitions separately revisioned from domain/application models?
3. Are forms/views/lists/grids projections over existing semantic references, or can they implicitly define new schema?
4. Can a process/action reference a provider-neutral capability/action contract rather than a concrete provider implementation?
5. Is compatibility checked when referenced domain revisions change, beyond successful reference resolution?
6. Can execution evidence identify exact definition, projection, binding and authority revisions?
7. Can AI-assisted authoring distinguish projection/process changes from canonical-domain changes and require escalation for the latter?
8. Can a Station expose a strict subset of canonical capabilities/models without duplicating or redefining their identities?

## Adaptive Governed Work Surfaces composition
The mandatory AGWS proofs are reinforced rather than absorbed into generic modeling:

- list/form/grid must be expressible as `ProjectionDefinition` over canonical entities/contracts without creating columns/entities;
- constrained layout is a projection concern, not canonical-model authority;
- mandatory superior components are overlay/invariant policy, not model mutation;
- Station/Role changes trigger revalidation of semantic references and effective authority;
- AI requests that require canonical model/process changes yield an escalation/proposal, not silent materialization;
- actions use provider-neutral action references resolved by binding;
- personal automation remains bounded by effective Station/Role/action authority;
- projection revisions preserve lineage/diff/reset/rollback;
- promotion creates a governed higher-scope projection revision backed by evidence, without mutating canonical domain semantics.

## Symbiotic Proof
Given a published canonical `Customer`/`Order` model and a process/action contract:

1. create a personal Station work surface containing a customer list, order form and approval action without adding an entity/column;
2. prove each projection references the canonical model revision and valid action contract;
3. replace the UI renderer or external action provider without changing canonical identities;
4. revise the canonical model compatibly and revalidate projections/processes with explicit compatibility evidence;
5. attempt an AI request to add a new canonical `creditLimit` field from editor mode and prove it is escalated as a canonical-domain change proposal rather than materialized into the page/model;
6. execute an approval and prove lineage from definition/process/projection/binding/authority revisions to execution evidence;
7. change Station/Role and prove the same personal projection is revalidated or rejected without weakening superior invariants.

## Stable findings
`G2-FINDING-PAM-01..16` remain authoritative from prior passes.

### Revisit 2 findings
- **G2-FINDING-PAM-17 — Canonical Model, Process Definition, Projection and Execution Instance Require Distinct Identities.** A rendered form or running process must never become the source of truth for the domain/application definition it references.
- **G2-FINDING-PAM-18 — Projection Authority Must Not Imply Canonical Model Authority.** Creating or changing a view/list/form/grid over valid semantic references must be possible without acquiring authority to add entities, columns, invariants or canonical business rules.
- **G2-FINDING-PAM-19 — Process References Need Revision-Bound Semantic Compatibility Evidence.** Resolving a referenced entity/action is insufficient; execution requires evidence that the referenced semantic revision/profile remains compatible.
- **G2-FINDING-PAM-20 — Provider-Neutral Action References Belong in Process/Application Semantics; Provider Selection Does Not.** Process definitions may own semantic action requirements, while concrete provider selection/binding remains a separate plane.
- **G2-FINDING-PAM-21 — AI Authoring Must Classify Requested Change Authority Before Materialization.** Requests crossing from projection/process customization into canonical domain/process semantics require escalation/proposal and cannot be silently materialized.
- **G2-FINDING-PAM-22 — Definition-to-Execution Evidence Must Preserve the Full Semantic Context Snapshot.** Execution evidence should identify canonical, process, projection, binding and effective-authority revisions sufficient for later conformance/replay analysis.

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-CANONICAL-PROJECTION-AUTHORITY-SEPARATION` — CROSS_CUTTING; candidate. Promote only if synthesis confirms the same separation across AGWS, reporting, notifications/documents and generated experiences.
- `G2-CAPABILITY-CANDIDATE-REVISION-BOUND-SEMANTIC-REFERENCE-COMPATIBILITY-EVIDENCE` — CROSS_CUTTING; candidate. Promote only if synthesis confirms a shared evidence primitive across process, schema, provider and migration references.
- `G2-CAPABILITY-CANDIDATE-DEFINITION-EXECUTION-SEMANTIC-CONTEXT-LINEAGE` — CROSS_CUTTING; candidate. Promote only if workflow, AI, deployment and observability findings converge on one lineage primitive.

## Value / risk / priority / next question
Value: critical. Risk: high if projection/process authoring is allowed to become an accidental domain metamodel or if execution evidence cannot identify the semantic revision actually executed. Priority: critical.

This revisit produced six material findings, so `consecutive_no_material_finding = 0`; Process & Application Modeling remains NOT SATURATED. Next rotation should proceed to UI / Generated Experience / Low-code Builder and test projection/component semantics against the strengthened canonical-model and AGWS authority boundary without absorbing AGWS into generic UI.