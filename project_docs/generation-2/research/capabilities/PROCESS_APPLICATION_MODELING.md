# Generation 2 Research — Process & Application Modeling

Status: revisit cycle 2 pass 1 complete; NOT SATURATED.

## Research question
Which primitives let System Builder model business structure, process, interfaces and composition as durable semantic assets while keeping semantic identity independent from representation, generated implementation and provider/runtime realization?

## Prior representative baseline
First pass covered Mendix, ServiceNow App Engine, Microsoft Power Apps/Dataverse and Salesforce. Findings `G2-FINDING-PAM-01..10` remain authoritative: inspectable model artifacts; stable semantic identity; explicit model-unit ownership; typed reference graphs; external references without ownership transfer; publication lifecycle; model-to-runtime lineage; governed composition; metadata-driven != portable; semantic model/provider orthogonality.

## Revisit representatives and evidence ledger
| Representative | Coverage | Evidence / contribution |
|---|---|---|
| Backstage Software Catalog | DEEP | Source-controlled entity descriptors, stable entity references, typed directional relations, explicit Component/API/Resource/System/Domain separation and ownership. https://backstage.io/docs/features/software-catalog/system-model/ |
| JSON Schema 2020-12 | DEEP | Schema resources/references, vocabularies, assertions vs annotations, `$ref`/`$dynamicRef`; URI identity is not necessarily a network locator. https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01 |
| CUE | DEEP | Constraint composition/unification and explicit closed/open structural semantics show validation/composition can remain independent of execution. https://cuelang.org/docs/reference/spec/ |
| OMG BPMN 2.0/2.0.2 | DEEP | Process, Collaboration and Choreography are related but distinct semantic views; participant/message mappings demonstrate projection between viewpoints rather than one flattened graph. https://www.omg.org/bpmn/ |

## Source of truth, identity and lifecycle
The revisit strengthens a distinction absent from many low-code products: **semantic source of truth is not necessarily one physical document**. Backstage permits multiple source-controlled descriptors while preserving entity references; JSON Schema permits referenced schema resources and explicitly says a URI identifier need not be a network locator. A portable SB definition therefore needs stable semantic identity plus independently resolvable representation/location metadata.

Lifecycle remains `author/edit -> validate -> publish/revision -> bind/realize -> observe`, but the revisit adds **projection lifecycle**: a semantic model may have several derived views (process, collaboration, API/catalog, UI/runtime) whose freshness and lineage must be independently provable.

## Versioning and failure semantics
Schema/model dialect version, semantic model revision and generated projection revision are distinct. Failures separate into unresolved reference, incompatible referenced revision, constraint violation, projection failure, publication failure and runtime realization failure. A model reference resolving successfully does not prove semantic compatibility.

## Extensibility, provider boundaries and governance
JSON Schema vocabularies and CUE composition support bounded semantic extension without requiring a universal runtime plugin protocol. Backstage shows catalog kinds/relations can be extended while ownership and references remain explicit. BPMN shows that multiple views may map shared participants/messages without collapsing their authority.

Governance implication: extensions need namespace/owner/version/compatibility authority; derived views need lineage and freshness evidence; external references need trust/resolution policy rather than implicit network fetch.

## Observability, portability and lock-in
Model observability is the ability to inspect exact semantic units, references, validation/projection results and lineage. Runtime telemetry remains separate. Portability requires exportable semantic identity/reference graphs and deterministic or evidence-bearing projections. A YAML/JSON/XML representation alone is not portability if identities, semantics or resolution depend on one hosted control plane.

## Product-specific mechanisms vs universal primitives
Do not copy Backstage entity kinds, JSON Schema keywords, CUE syntax or BPMN notation as the SB IR. Reusable primitives are: `SemanticUnitIdentity`, `SemanticRevision`, `SemanticReference`, `ReferenceResolutionEvidence`, `SemanticView/Projection`, `ProjectionRevision`, `ProjectionLineage`, `ConstraintSet`, `OwnershipBoundary`, and `PublicationRevision`.

## Convergent/divergent patterns
Convergent: stable identity separate from labels/location; typed references; compositional validation; explicit ownership; multiple semantic units; derived views; inspectable lineage. Divergent: Backstage catalogs software ecosystems, JSON Schema validates instance structure, CUE composes constraints/data, BPMN models process/collaboration/choreography. Their execution semantics must remain domain/provider-specific.

## Subcapabilities
- Semantic Model Unit & Ownership
- Model Dependency/Reference Graph
- External Semantic Reference
- Reference Resolution & Compatibility Evidence
- Model Validation & Publication
- Semantic View / Projection Lifecycle
- Model-to-Generated-Artifact Traceability
- Layered Customization / Override Semantics

## System Builder comparison
No new SB implementation claim is made in this revisit. Repository-specific questions remain deferred to fresh-main archaeology in `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; research evidence is not product truth.

## Reconciliation hypotheses
- **KEEP/HARDEN** declarative portable definition if repository archaeology confirms deterministic authority and lineage.
- **GENERALIZE** semantic-unit/reference/projection identities if current constructs are monolithic or representation-bound.
- **PROVIDERIZE** runtime/persistence/UI realization rather than encoding provider semantics into portable model units.
- **INTEGRATE** external semantic resources by reference plus compatibility/trust evidence.
- **DO_NOT_BUILD** a universal executable metamodel or automatic network-resolution semantics merely because standards support references.

## Repository-validation questions
1. Does `SystemDefinition` distinguish semantic identity from file/path/URI representation?
2. Are semantic references revision-bound and can resolution/compatibility be evidenced?
3. Can one semantic unit have multiple generated projections with independent revision/freshness lineage?
4. Are model, schema/dialect and generated artifact versions independently represented?
5. Can external references remain unresolved/offline until an explicit resolution phase?
6. Are ownership and extension namespaces explicit?
7. Can process/collaboration/runtime views coexist without one view becoming the authority for all others?

## Symbiotic Proof
Given one portable application definition: preserve semantic-unit identities while changing representation/location; resolve one external semantic dependency under explicit trust/compatibility policy; produce at least two derived projections; prove each projection's lineage/freshness; replace a provider without changing domain identity; reject incompatible reference/override; regenerate autonomous runtime without Builder availability.

## Stable findings
`G2-FINDING-PAM-01..10` remain authoritative from the first pass.

### Revisit findings
- **G2-FINDING-PAM-11 — Semantic Identity Is Independent From Representation Location.** A model unit's identity must not be its repository path, URL or serialization location.
- **G2-FINDING-PAM-12 — Reference Resolution and Semantic Compatibility Are Separate Evidence.** Successfully locating a referenced model does not prove that its revision is compatible with the referring model.
- **G2-FINDING-PAM-13 — Semantic Views Are Projections, Not Competing Sources of Truth.** Process, collaboration, API/catalog, UI and runtime views may derive from shared semantics while retaining distinct projection identity and lineage.
- **G2-FINDING-PAM-14 — Projection Freshness Is a First-class Claim.** A derived model/view can be valid yet stale relative to the semantic revision from which it was generated.
- **G2-FINDING-PAM-15 — Extension Vocabulary Does Not Grant Execution Authority.** Extensible modeling syntax/vocabulary must not implicitly authorize provider/runtime behavior.
- **G2-FINDING-PAM-16 — Portable References Need Explicit Resolution Policy.** A URI/reference can be an identifier without being a fetch instruction; resolution authority, trust and offline behavior must be explicit.

## Value / risk / priority / next question
Value: critical. Risk: high if representation, projection or provider mechanisms leak into semantic authority. Priority: critical. This revisit produced six material architectural findings, so `consecutive_no_material_finding = 0` and the capability remains NOT SATURATED. Next revisit should test these distinctions against model-driven engineering / package-module systems and determine whether projection lifecycle or reference-resolution evidence merits cross-cutting promotion.