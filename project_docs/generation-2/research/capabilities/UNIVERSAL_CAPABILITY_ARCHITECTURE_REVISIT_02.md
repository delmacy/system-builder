# G2 Capability Dossier — Universal Capability Architecture — Revisit 2

Status: MATERIAL_NEW_FINDINGS / NOT SATURATED
Research cycle: 3

## Research question
Which distinctions recur strongly enough across capability, catalog, declarative-control and observability systems to be universal SB primitives, especially semantic identity vs revision/realization/evidence, requirement/exposure/realization, authority scope, and evidence freshness; and how should Adaptive Governed Work Surfaces compose without making Station/UI semantics universal by assertion?

## Representatives and evidence/source ledger
1. **OASIS TOSCA 2.0** — typed requirements/capabilities and relationship-based fulfillment remain the strongest direct need/offer reference. Source of truth: OASIS specification, https://docs.oasis-open.org/tosca/TOSCA/v2.0/TOSCA-v2.0.html
2. **Kubernetes declarative API / observed generation** — desired spec revision and controller-observed revision are independently identifiable; observed status can lag the desired generation. Source: Kubernetes Pods/observedGeneration documentation, https://kubernetes.io/docs/concepts/workloads/pods/
3. **OpenTelemetry Resources / Entities / semantic conventions** — observed entity identity is distinct from instrumentation identity; identifying attributes should be minimally sufficient, stable for an entity lifespan, and reproducible across observers. Sources: https://opentelemetry.io/docs/specs/otel/resource/ and https://opentelemetry.io/docs/specs/semconv/how-to-write-conventions/resource-and-entities/
4. **Backstage Software Catalog** — Components/APIs/Resources/Systems/Domains and typed relations separate semantic entity identity, ownership, grouping and dependency. Catalog metadata in source control is the catalog source of truth. Sources: https://backstage.io/docs/features/software-catalog/ and https://backstage.io/docs/features/software-catalog/system-model/
5. **Crossplane** — retained from prior pass as evidence that provider implementation/configuration/managed realization are separate and binding configuration has scope. Source: https://docs.crossplane.io/latest/managed-resources/managed-resources/
6. **OpenTofu/Terraform provider requirements** — retained from prior pass as evidence for requirement/source/version resolution and provider association lineage. Source: https://opentofu.org/docs/language/providers/requirements/

Coverage judgment this pass: Kubernetes `DEEP`; OpenTelemetry `DEEP`; Backstage `DEEP`; TOSCA `DEEP`; Crossplane `DEEP`; OpenTofu/Terraform `DEEP` through cumulative dossier evidence.

## Universal primitive refinement
### Source of truth
A universal model must not nominate one record as truth for all concerns. Portable intent, scoped resolution/binding, effective realization, and observations/evidence have separate authorities. Backstage additionally demonstrates that catalog metadata can be authoritative for identity/ownership while runtime truth remains elsewhere.

### Identity and lifespan
Semantic identity is not revision, instance, realization or observation identity. OpenTelemetry explicitly recommends minimally sufficient identifying attributes that remain stable during an entity lifespan and are discoverable consistently by multiple observers. Universal SB identities therefore need declared lifespan and qualification rules, not merely globally unique strings.

### Requirement, exposure, fulfillment and realization
TOSCA supports requirement/offer separation. Crossplane and prior DRA evidence support binding/realization separation. Cycle-2 Adaptive Governed Work Surfaces adds a different relation: a capability can exist globally yet not be **exposed** to a Station/Role. Exposure is therefore neither offer nor authorization decision alone; it is a scoped availability contract over already-known capabilities.

### Desired revision, effective realization and evidence freshness
Kubernetes `metadata.generation` vs `status.observedGeneration` gives direct evidence that desired revision and observed realization revision can diverge temporarily. Universal evidence must state which revision it observed; otherwise a green observation can be stale relative to current intent.

### Context and authority
Backstage relations show hierarchy/grouping/dependency can be represented without embedding all semantics into each entity. Crossplane shows configuration scope can differ from provider identity. For SB, authority and exposure should be explicit contextual relations. `Enterprise → Station → Role → Person` is therefore a required AGWS composition, but only the generic primitives `Scope`, `Exposure`, `AuthorityConstraint` and `EffectiveResolution` are candidates for universalization.

### Provider-neutral contracts
Universal contracts describe semantic requirement/capability/exposure/binding evidence. Provider-native configuration and execution remain behind provider boundaries. Semantic conventions and catalog relations show that common vocabulary can span implementations without requiring one execution protocol.

### Lifecycle / migration / recovery lineage
Requirement, binding and realization revisions can advance independently. Replacement or recovery creates a new transition/attempt/result lineage; it must not rewrite semantic identity history. Evidence should point to the exact desired/binding/realization revisions it validates.

### Architecture obligations / conformance evidence
Cycle-2 reconciliation findings compose naturally: universal primitives need invariant/obligation references and conformance evidence, but the architecture-rule engine itself is not a universal capability execution protocol. Conformance is revision/scope/evidence-bound.

## Product-specific mechanism vs universal primitive
Do not copy TOSCA orchestration grammar, Kubernetes API machinery, OpenTelemetry attribute taxonomy, Backstage entity kinds, Crossplane CRDs or OpenTofu state format. Candidate universal primitives are narrower: `SemanticIdentity`, `Revision`, `Scope`, `Requirement`, `CapabilityOffer`, `CapabilityExposure`, `CompatibilityDecision`, `BindingDecision`, `Realization`, `Observation/Evidence`, `AuthorityConstraint`, `TransitionLineage`, and `ArchitectureObligationRef`.

## Convergent patterns
- identity and revision differ;
- desired and observed revisions differ;
- semantic entity and concrete realization/instance differ;
- need, offer, exposure, selection/binding and realization are distinct stages;
- evidence must identify producer/context/revision/freshness;
- scoped configuration/authority does not redefine capability identity;
- shared semantic vocabulary does not require shared execution protocol.

## Divergent patterns
TOSCA is topology/orchestration oriented; Kubernetes is controller/reconciliation oriented; OpenTelemetry is observation oriented; Backstage is catalog/ownership oriented; Crossplane/OpenTofu are provider/resource oriented. Their disagreement on mechanics is positive evidence against a universal execution engine masquerading as a universal capability model.

## Subcapabilities
Semantic identity & lifespan; revision lineage; capability requirement/offer; scoped exposure; compatibility/selection; binding; realization; evidence qualification; authority constraints; transition lineage; architecture obligation references.

## Adaptive Governed Work Surfaces composition
AGWS remains a distinct capability. Its `Enterprise → Station → Role → Person` hierarchy is not generalized wholesale. Universal architecture only supplies generic scoped exposure, authority constraints, effective resolution and revision-bound evidence. A Station can expose a subset of capabilities or provider-neutral bindings; Role/Person overlays can specialize only within inherited authority. AI-only materialization remains an AGWS/AI governance rule expressed through universal `AuthorityConstraint` + `ArchitectureObligationRef`, not a universal rule that all capability changes require AI.

This supports the nine mandatory AGWS proofs without transferring ownership: constrained layout and mandatory components remain AGWS semantics; provider-neutral action uses universal requirement/binding; revalidation uses scope/revision/evidence; personal automation uses authority intersection; promotion creates governed revision lineage.

## Comparison with SB
No new fresh-main archaeology was necessary for this pass: the research question concerns cross-representative universality. Existing SB comparisons remain hypotheses until `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; absence was not inferred from search.

## Reconciliation hypotheses
- GENERALIZE semantic identity/revision/lifespan distinction if repository concepts collapse them.
- GENERALIZE `CapabilityExposure` only if repository archaeology confirms Station/environment surfaces need a provider-neutral scoped exposure primitive.
- HARDEN evidence with observed revision, producer/trust and freshness.
- GENERALIZE authority constraints as references/intersections rather than domain-specific permission duplication.
- INTEGRATE architecture obligations with conformance evidence, without merging architecture reconciliation into provider execution.
- DO_NOT_BUILD a universal orchestration/execution protocol.

## Repository-validation questions
1. Which current identifiers represent semantic identity versus revision versus runtime instance?
2. Can evidence name the exact definition/binding/realization revision it observed?
3. Is capability availability/exposure scoped independently from provider offer and actor authorization?
4. Can one capability be exposed to one Station/environment and withheld from another without redefining it?
5. Are provider configuration and realization identities separated from portable capability identity?
6. Can authority constraints be intersected across organization/environment/role/person/binding/action contexts?
7. Can architecture obligations reference portable semantics without embedding CI/tool-specific mechanics?
8. Is transition lineage preserved across provider replacement, migration and recovery?

## Symbiotic Proof
Define one stable semantic capability requirement. Prove that two implementations satisfy it without changing requirement identity; a Station exposes only one permitted subset; Role/Person cannot widen exposure; a binding resolves to a concrete realization; observation names the exact realization and desired revision; stale evidence is detectable after revision; provider replacement creates transition lineage while semantic requirement remains stable; AGWS consumes the binding without provider coupling; AI materialization cannot exceed effective authority; generated runtime remains autonomous from Builder availability.

## Findings — revisit 2
- **G2-FINDING-UCA-17 — Semantic Identity Requires Explicit Lifespan Semantics:** a universal identifier is insufficient unless the model defines what persists across revisions, realizations and observers; identifying attributes must remain stable for the semantic entity lifespan.
- **G2-FINDING-UCA-18 — Evidence Must Bind to the Revision It Observed:** desired revision and observed/effective revision can diverge; evidence without an observed revision/freshness relation can falsely validate superseded intent.
- **G2-FINDING-UCA-19 — Capability Exposure Is Distinct from Offer, Authorization and Binding:** a capability may exist and be offered yet be intentionally unavailable in a Station/environment; scoped exposure is a separate semantic relation before actor authorization and concrete binding.
- **G2-FINDING-UCA-20 — Universal Context Should Be Relational, Not Embedded Domain Hierarchy:** scope, ownership, dependency, exposure and authority are reusable relations; `Enterprise → Station → Role → Person` remains an AGWS/organization specialization rather than a hard-coded universal hierarchy.
- **G2-FINDING-UCA-21 — Semantic Vocabulary and Execution Protocol Must Remain Orthogonal:** multi-representative convergence supports common identities/relations/evidence, while divergent orchestration/controller/catalog/telemetry mechanics argue against a universal execution protocol.
- **G2-FINDING-UCA-22 — Effective Resolution Requires Revision-Bound Inputs and Evidence:** resolving requirement + exposure + authority + binding must preserve the revisions/scopes used so later revalidation can detect changed Station/Role/provider/contract context rather than silently reusing an obsolete result.

## Capability candidates
- **G2-CAPABILITY-CANDIDATE-SEMANTIC-IDENTITY-LIFESPAN-CONTRACT** — CROSS_CUTTING. Promote only if synthesis confirms shared need across domain objects, providers, runtime instances and evidence.
- **G2-CAPABILITY-CANDIDATE-SCOPED-CAPABILITY-EXPOSURE** — CORE. Evidence now spans AGWS Station semantics plus catalog/scope/provider models; promote only after synthesis distinguishes exposure from authorization and deployment/environment ownership.
- **G2-CAPABILITY-CANDIDATE-REVISION-BOUND-EFFECTIVE-RESOLUTION-EVIDENCE** — CROSS_CUTTING. Promote if synthesis confirms the same proof shape across provider binding, AGWS overlay resolution, migration and architecture conformance.

## Saturation
Revisits completed: 2. Consecutive revisits with no material architectural finding: **0**. Result: **NOT SATURATED** because six material findings (`UCA-17..22`) were produced.

## Value / risk / priority / next question
Value: critical foundational vocabulary. Risk: high if scope/exposure/authority become an over-generalized meta-model. Priority: critical. Next question after this cycle: test these primitives against process/application modeling and generated UI domains, especially whether semantic identity/lifespan and scoped exposure remain useful without importing infrastructure assumptions.