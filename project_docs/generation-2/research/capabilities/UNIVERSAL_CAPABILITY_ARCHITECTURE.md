# G2 Capability Dossier — Universal Capability Architecture

Status: PARTIAL — first deep pass
Last reviewed: 2026-08-31

## Research question

What minimal universal model can express a system's requirements, offered capabilities, candidate providers, compatibility constraints, bindings, reconciliation/lifecycle and evidence without coupling the System Builder to any one runtime or vendor?

## Representatives and evidence ledger

1. **OASIS TOSCA 2.0** — strongest direct capability/requirement model. A requirement is fulfilled by a relationship to a matching typed capability; unresolved (dangling) requirements can be resolved at deployment time against internal or external representations. Capability types carry properties/attributes and constrain valid source/relationship types. Source: https://docs.oasis-open.org/tosca/TOSCA/v2.0/TOSCA-v2.0.html
2. **Kubernetes declarative API/controllers** — strongest desired-state/reconciliation primitive. Custom resources store structured desired state; controllers independently reconcile actual state toward desired state. Source: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
3. **Terraform provider model** — strongest provider identity/version/schema/configuration model. Requirements identify provider source and version constraints; dependency lock files select reproducible provider versions; provider/resource/data-source schemas are discoverable through the provider protocol. Sources: https://developer.hashicorp.com/terraform/language/providers/requirements and https://developer.hashicorp.com/terraform/plugin/framework/handling-data/schemas
4. **Backstage Software Catalog** — useful catalog/identity/relationship model. Entities model components/APIs/resources; typed directional relations and extensible processors let external information enrich the graph without forcing all domain semantics into the core model. Sources: https://backstage.io/docs/features/software-catalog/system-model/ and https://backstage.io/docs/features/software-catalog/extending-the-model/

## Extracted primitives

### Source of truth
A universal architecture should distinguish declarative intent from observed/runtime state. TOSCA service templates and Kubernetes desired state both preserve intent independently from realization. Terraform additionally preserves selected provider/version and managed-resource state. Candidate primitive split: `Requirement/DesiredDefinition` vs `ObservedState/Evidence`.

### Identity
Provider/capability identity must be qualified, not a display name. Terraform's provider source address (`hostname/namespace/type`) plus version constraint is strong evidence for `ProviderIdentity + CompatibilityRange`; Backstage entity references similarly separate entity kind/namespace/name.

### Requirement and capability
TOSCA supplies the clearest universal relation: a `Requirement` states a typed need and constraints; a `Capability` states a typed offer and properties; a relationship/binding fulfills the requirement. This is materially stronger than a flat feature flag because fulfillment is explicit and inspectable.

### Compatibility and negotiation
Compatibility should be evaluated before binding. TOSCA constrains target capability/node/relationship types and supports filters; Terraform resolves source + version constraints before provider use. Candidate primitive: `CompatibilityDecision(requirement, offer, constraints) -> compatible|incompatible + evidence`, followed by deterministic selection/negotiation policy when multiple candidates match.

### Binding
Binding should be an explicit durable record that a requirement was fulfilled by a particular provider/capability/configuration, not merely a runtime pointer. Terraform state retaining provider-configuration references demonstrates why bindings must survive configuration evolution. Candidate fields: requirement identity, capability identity, provider identity/version, configuration/secret refs, compatibility decision, lifecycle state and provenance.

### Lifecycle / reconciliation
Kubernetes demonstrates that fulfillment is not a one-time action: desired and actual state can diverge and require reconciliation. Universal lifecycle should therefore distinguish `declared`, `resolved`, `bound`, `active`, `degraded`, `superseded`, `retired` (names provisional) and record observed health separately from desired binding.

### Versioning
Version dimensions must not collapse: requirement schema/version, capability contract version, provider implementation version and binding/configuration revision can evolve independently. Terraform's provider constraints + lock selection and schema versions support this separation.

### Failure semantics
Three failure classes recur: no compatible offer/provider; compatible provider cannot bind/configure; bound provider becomes unhealthy/drifts. They require different evidence and recovery semantics. A universal model should not encode provider-specific retry logic into the capability contract.

### Extensibility/provider boundary
Backstage processors and Terraform providers show two useful extension boundaries: enrich/catalog external facts without owning execution, or implement an execution/provider protocol behind a stable contract. The universal model should support both without treating every extension as a provider.

### Governance/evidence/provenance
Selection and reconciliation decisions should be explainable: which requirement, candidate set, compatibility rule, selected provider/version, configuration reference and observed outcome. Reproducibility requires selected versions and decision evidence, not only desired constraints.

### Portability / lock-in
Portability improves when requirement semantics are owned by the SB and provider-specific configuration is isolated behind bindings. Lock-in rises when the portable definition embeds provider resource schemas, provider-native lifecycle states or proprietary identifiers as its semantic source of truth.

## Product-specific mechanisms not to copy automatically

- TOSCA's full node/relationship type system and orchestration grammar.
- Kubernetes CRDs, API-server persistence, controller machinery and status conventions as mandatory SB internals.
- Terraform HCL, state-file semantics, provider gRPC protocol and resource CRUD model.
- Backstage's entity kinds/YAML descriptor and plugin framework.

These are implementations of useful primitives, not the primitives themselves.

## Recurring patterns

1. **Intent precedes realization**: portable requirement/desired state is independent of provider execution.
2. **Need and offer are separate**: requirement != capability.
3. **Compatibility precedes selection**: candidate filtering/version/type constraints are first-class.
4. **Binding is evidence-bearing**: the selected implementation/configuration must be identifiable and reproducible.
5. **Desired and observed state differ**: lifecycle requires reconciliation and health evidence.
6. **Provider identity is qualified and versioned**.
7. **Extensions are not automatically providers**: catalog enrichment, policy and execution have different authority.
8. **External resources must be bindable without becoming owned by the portable definition**.

## Conceptual comparison with System Builder

No repository-truth conclusion is made in this first pass. Prior research indicates provider/binding concepts may already exist, but this dossier deliberately defers current-state claims until `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`, where fresh `main` is authoritative.

## Reconciliation hypotheses (not implementation authority)

- `Capability` / `Requirement`: **GENERALIZE** if existing SB concepts are domain-specific; otherwise **KEEP/HARDEN**.
- Provider identity + compatibility range: **HARDEN/GENERALIZE** candidate.
- Compatibility decision before binding: **GENERALIZE** candidate.
- Binding as durable evidence-bearing fulfillment: **HARDEN/GENERALIZE** candidate.
- Desired vs observed state and reconciliation evidence: **HARDEN** candidate where lifecycle exists.
- TOSCA/Kubernetes/Terraform internal models: **DO_NOT_BUILD** as wholesale replicas; use them as evidence and integrate only where product needs justify it.

## Repository-validation questions

1. Is there one universal `Capability` identity/type or multiple unrelated capability vocabularies?
2. Are requirements represented independently from capabilities/offers?
3. Does provider identity include source, contract/version compatibility and implementation version?
4. Is compatibility evaluated explicitly before binding, with explainable evidence?
5. Does a binding persist the exact provider/capability/configuration selected?
6. Can a requirement bind an external/pre-existing resource without transferring ownership?
7. Are desired binding state, observed health and lifecycle state separated?
8. Can bindings be replaced while the portable `SystemDefinition` remains semantically stable?
9. Are secret/config references isolated from portable semantics?
10. Is provenance sufficient to reproduce why a provider was selected?

## Symbiotic Proof candidate

Define one portable requirement and prove: (1) native capability satisfies it; (2) external provider satisfies the same requirement; (3) incompatible provider is rejected before activation with evidence; (4) native ↔ external replacement leaves portable requirement semantics unchanged; (5) selected provider/version/configuration are reproducible; (6) provider degradation changes observed evidence, not desired definition; (7) generated runtime remains autonomous from Builder control-plane availability.

## Findings

- **G2-FINDING-UCA-01 — Requirement/Capability Duality:** model typed needs separately from typed offers; fulfillment is an explicit relationship.
- **G2-FINDING-UCA-02 — Compatibility Before Binding:** compatibility/constraints are a distinct decision stage, not implicit provider activation.
- **G2-FINDING-UCA-03 — Qualified Provider Identity:** provider source/namespace/type and implementation version must be distinguishable from a local alias.
- **G2-FINDING-UCA-04 — Evidence-Bearing Binding:** binding should preserve what fulfilled which requirement, under which provider/version/configuration and decision evidence.
- **G2-FINDING-UCA-05 — Desired/Observed Separation:** declared fulfillment and observed runtime health/drift are separate truths.
- **G2-FINDING-UCA-06 — Reconciliation Is Lifecycle:** capability fulfillment can drift and must support reconcile/supersede/retire semantics without mutating portable intent opportunistically.
- **G2-FINDING-UCA-07 — Multidimensional Versioning:** requirement contract, capability contract, provider implementation and binding revision evolve independently.
- **G2-FINDING-UCA-08 — External Fulfillment Without Ownership:** a portable requirement may be fulfilled by an external/pre-existing resource without importing that resource into SB ownership.
- **G2-FINDING-UCA-09 — Extension Authority Classes:** catalog enrichment, policy/validation and execution providers should not share an undifferentiated extension contract.
- **G2-FINDING-UCA-10 — Portable Semantics / Provider Isolation:** provider-native resource schemas and lifecycle mechanics belong behind bindings unless they are genuinely universal semantics.

## Capability candidates

- **G2-CAPABILITY-CANDIDATE-COMPATIBILITY-NEGOTIATION** — CROSS_CUTTING. Evidence: TOSCA target/filter compatibility + Terraform source/version resolution. Candidate for promotion after Provider/Binding and Integration research.
- **G2-CAPABILITY-CANDIDATE-RECONCILIATION-CONTROL** — CROSS_CUTTING. Evidence: Kubernetes desired/actual reconciliation plus provider lifecycle needs. Candidate for promotion after Lifecycle and Architecture Reconciliation research.
- **G2-CAPABILITY-CANDIDATE-BINDING-PROVENANCE** — CROSS_CUTTING. Evidence: Terraform provider selection/state and reproducibility requirements. Candidate for promotion after Artifact/Provenance research.

## Synthesis

**Value for SB:** very high; this is a foundational vocabulary that can prevent each domain from inventing incompatible provider/binding semantics.

**Adoption risk:** high if a representative's full orchestration/resource model is copied; moderate if only cross-representative primitives are adopted after repository reconciliation.

**Investigation priority:** critical.

**Next research question:** can compatibility/negotiation and binding provenance be proven as cross-cutting capabilities across integration, identity, storage, workflow and deployment without forcing those domains into a common provider execution protocol?
