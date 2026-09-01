# Generation 2 Research — Process & Application Modeling

Status: first deep pass; not saturated.

## Research question

Which primitives let an application platform model business data, behavior, process, presentation and policy as durable semantic assets without making the model inseparable from one runtime, database or UI implementation?

## Representatives

1. **Mendix** — unusually explicit metamodel and SDK; useful for examining model-as-data, module boundaries, domain semantics and generated persistence.
2. **ServiceNow App Engine / Flow Designer** — strong scoped-application, record model, process composition and governed reuse model.
3. **Microsoft Power Apps / Dataverse** — strong model-driven application pattern, solution lifecycle/layering and metadata-to-UI generation.
4. **Salesforce Platform** — mature multitenant metadata-driven architecture, metadata APIs, object relationships, flows and deployable metadata packages.

OutSystems remains an intended representative for a later revisit; current authoritative evidence gathered in this pass was materially stronger for the four representatives above.

## Evidence/source ledger

- Mendix Domain Model documentation (updated 2026-04-03): each module owns a domain model; entities may be persistable, non-persistable, external or view entities; deployment maps the abstract model to database structures. https://docs.mendix.com/refguide10/domain-model/
- Mendix Metamodel / Model Access API: app models are structured as units/elements and can be programmatically inspected; domain models, pages and other model components are exposed as model assets. https://docs.mendix.com/apidocs-mxsdk/mxsdk/mendix-metamodel/ and https://docs.mendix.com/apidocs-mxsdk/apidocs/web-extensibility-api-11/model-api/
- ServiceNow Flow Designer (Australia release, updated 2026-03-12): flows are single-purpose compositions of reusable subflows/actions with typed inputs and application-scope ownership; IntegrationHub extends external actions. https://www.servicenow.com/docs/r/application-development/flow-designer.html
- ServiceNow data-model guidance (updated 2026-03-12): applications define tables/fields and access controls; application scope and table internal names become durable identities. https://www.servicenow.com/docs/r/application-development/define-and-build-data-model.html
- Power Apps model-driven app guidance (updated 2026-02-12): model-driven apps start from Dataverse tables, columns and relationships, then derive forms/views/business rules/process flows. https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/define-data-model-driven-app
- Power Apps solution guidance: solutions provide ALM and movement of customizations between environments; solution layers expose composition/override semantics. https://learn.microsoft.com/en-us/power-apps/developer/data-platform/introduction-solutions
- Salesforce Architecture Basics: Salesforce is explicitly multitenant and metadata-driven, with metadata/data separation and platform APIs as architectural concerns. https://architect.salesforce.com/docs/architect/fundamentals/guide/architecture-basics
- Salesforce Metadata API/CLI evidence: flows and other application components are retrievable/deployable metadata selected through manifests; metadata can be source-controlled independently of business records. https://developer.salesforce.com/docs/marketing/marketing-cloud-growth/guide/mc-manage-flows-get.html
- Salesforce metadata visualization: objects, fields, relationships and Flexipages are inspectable metadata structures rather than opaque runtime state. https://developer.salesforce.com/docs/platform/md-visualizer/guide/mdv-overview.html

## Primitive extraction

### Source of truth

A recurring pattern is **application definition as metadata/model**, distinct from business records and from generated runtime structures. Mendix exposes a metamodel; Salesforce explicitly separates metadata from data; Power Apps makes Dataverse metadata the basis of model-driven apps; ServiceNow scopes application artifacts and record/process definitions.

Candidate primitive: `ApplicationDefinition` composed from independently identifiable model units rather than a single undifferentiated document.

### Identity

Stable technical identity differs from display labels. ServiceNow explicitly makes application scope/table internal names durable while labels may change. Salesforce uses API names/metadata identities. Mendix units/elements and module-local definitions have model identity.

Candidate principle: **semantic identity must survive presentation renaming**.

### Lifecycle and versioning

Application modeling is not only authoring. The representatives expose a lifecycle from model/edit → validate → publish/deploy → runtime, with environment/package/solution semantics. Power Apps solution layering and Salesforce deployable metadata show that model evolution requires explicit composition and promotion semantics.

### Failure semantics

Failures divide into at least: invalid model, invalid dependency/reference, policy/access violation, deployment/publish failure and runtime business failure. These should not collapse into one generic validation error.

### Extensibility and provider boundaries

Mendix external entities distinguish data owned elsewhere from locally persisted entities. ServiceNow IntegrationHub/actions separate reusable process actions and external integration. Salesforce/Power Apps allow metadata composition while retaining platform-managed runtime semantics.

Strong primitive: **external semantic reference without ownership transfer**. An application model should be able to refer to external data/action/capability while recording that persistence/execution authority remains external.

### Governance

Scope/module/solution boundaries recur. Reuse is governed, not merely technically possible: ServiceNow actions have scope/access/protection; Power Apps solutions and layers govern customization transport; Salesforce metadata/package mechanisms govern deployable components.

### Observability

The application model itself is inspectable in all four systems, but runtime observability is a separate concern. A useful universal principle is model-to-runtime traceability rather than embedding runtime telemetry into authoring primitives.

### Portability and lock-in

The strongest lock-in appears when semantic model, persistence, UI generation and runtime are inseparable. Mendix external entities and exposed metamodel improve inspectability but its runtime remains platform-specific. Power Apps model-driven apps require Dataverse. ServiceNow applications depend heavily on Now Platform record/scope semantics. Salesforce metadata is highly inspectable/exportable but executes against Salesforce platform semantics.

Therefore **metadata-driven is not equivalent to portable**.

## Product-specific mechanisms not to copy automatically

- Mendix Microflow/Nanoflow syntax, entity storage implementation and Studio Pro unit hierarchy.
- ServiceNow `sys_*` record conventions, spokes, Script Includes and platform-specific table inheritance.
- Dataverse solution-layer implementation, mandatory Dataverse dependency for model-driven apps and specific form/view component model.
- Salesforce sObject/API-name conventions, governor limits, org/package mechanics and XML Metadata API representation.

The reusable lesson is semantic separation and lifecycle, not reproduction of proprietary metamodels.

## Recurring patterns

1. **Model-as-data / metadata-first authoring** — definitions are inspectable artifacts.
2. **Stable technical identity / mutable presentation** — labels are not authoritative identity.
3. **Module/scope ownership** — every model unit has an ownership boundary.
4. **Typed relations** — entities, associations, process actions and UI references form a graph.
5. **Generated implementation** — persistence/UI/runtime artifacts can be derived from semantic models.
6. **External reference without ownership** — externally owned data/actions can participate in the model.
7. **Publish/deploy is a lifecycle transition** — editable model and executable model are distinct states.
8. **Governed composition** — reuse and overrides require scope/layer/access rules.
9. **Metadata-driven does not guarantee portability** — portability requires an explicit provider-independent semantic boundary.

## Subcapabilities discovered

- Semantic Model Unit & Ownership
- Model Dependency/Reference Graph
- External Semantic Reference
- Model Validation & Publication
- Model-to-Runtime Traceability
- Layered Customization / Override Semantics

## System Builder comparison

No new repository-truth claim is made in this pass. Existing Generation 2 research indicates the SB already values portable semantics/provider isolation, but whether current `SystemDefinition`, module boundaries and generated artifacts provide the model-unit identity, external-reference ownership and publication lifecycle described here must be established later from fresh `main` during `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses

- **KEEP/HARDEN** — declarative system definition if repository archaeology confirms it is authoritative and deterministic.
- **GENERALIZE** — model-unit identity, typed dependency/reference graph and lifecycle states if current constructs are domain-local.
- **PROVIDERIZE** — persistence/runtime/UI implementation where semantic model currently implies one implementation.
- **INTEGRATE** — external semantic references rather than copying external schemas/resources into SB ownership.
- **DO_NOT_BUILD** — proprietary-clone metamodels or platform-specific visual syntax without an independent SB semantic need.

These are hypotheses only.

## Repository-validation questions

1. Is `SystemDefinition` monolithic or composed from independently versionable/identifiable semantic units?
2. Can a model distinguish locally owned entities/actions from externally owned ones?
3. Are display labels separated from stable semantic identity?
4. Is there an explicit model dependency/reference graph?
5. Are authoring, validated, published and runtime states distinct?
6. Can generated UI/persistence/runtime be traced back to exact semantic model identities?
7. Are overrides/extensions governed by explicit scope/authority?
8. Does persistence choice leak into the portable model?

## Symbiotic Proof candidate

Given one business application definition:

1. execute a native SB path;
2. bind one data/process dependency to an external provider without changing domain semantics;
3. replace that provider and prove semantic identity/dependency graph remain stable;
4. regenerate runtime from the same portable model;
5. prove policy/governance rejects an unauthorized override;
6. trace runtime artifacts back to exact model-unit identities and version;
7. prove generated runtime remains autonomous from the Builder control plane.

## Findings

- **G2-FINDING-PAM-01 — Model Is an Inspectable Artifact.** Mature platforms represent application structure as metadata/metamodel rather than only runtime code.
- **G2-FINDING-PAM-02 — Stable Semantic Identity Must Outlive Labels.** Technical identity and presentation naming are separate concerns.
- **G2-FINDING-PAM-03 — Model Units Need Explicit Ownership.** Module/scope boundaries recur as the basis for composition and governance.
- **G2-FINDING-PAM-04 — Typed Reference Graph Is Foundational.** Application models are graphs of typed entities, relations, actions, views and dependencies, not flat feature lists.
- **G2-FINDING-PAM-05 — External Reference Must Not Imply Ownership.** External entities/actions should participate without being copied into local authority.
- **G2-FINDING-PAM-06 — Publication Is a Lifecycle Boundary.** Editable model, validated/published definition and executable runtime are distinct states.
- **G2-FINDING-PAM-07 — Generated Implementation Must Remain Traceable.** Persistence/UI/runtime generation needs lineage back to semantic model identity/version.
- **G2-FINDING-PAM-08 — Governed Composition Beats Unbounded Extension.** Scope, access, layering and override rules are architectural primitives.
- **G2-FINDING-PAM-09 — Metadata-Driven Does Not Mean Portable.** Portability requires semantics independent of platform runtime/storage assumptions.
- **G2-FINDING-PAM-10 — Semantic Model and Provider Choice Should Be Orthogonal.** Provider-specific storage/runtime choices should be bindings where feasible, not implicit model meaning.

## Synthesis

**Value for SB:** critical. Application modeling is the semantic source from which generation, validation, provider binding and evidence ultimately derive.

**Adoption risk:** high if proprietary platform metamodels are copied; moderate if only recurring primitives are extracted.

**Investigation priority:** critical.

**Next research question for this capability:** after broader first-pass coverage, compare OutSystems plus one more portable/schema-oriented representative and test whether model-unit ownership, publication lifecycle and external semantic reference recur strongly enough to promote any new cross-cutting capability.
