# G2 Capability Dossier — Universal Capability Architecture

Status: PARTIAL — revisit 1 produced material findings; not saturated
Last reviewed: 2026-09-01

## Research question

What minimal universal model can express a system's requirements, offered capabilities, candidate providers, compatibility constraints, bindings, reconciliation/lifecycle and evidence without coupling the System Builder to any one runtime or vendor?

## Representatives and evidence ledger

### First pass

1. **OASIS TOSCA 2.0** — strongest direct capability/requirement model. A requirement is fulfilled by a relationship to a matching typed capability; unresolved requirements can be resolved at deployment time against internal or external representations. Capability types carry properties/attributes and constrain valid source/relationship types. Source: https://docs.oasis-open.org/tosca/TOSCA/v2.0/TOSCA-v2.0.html
2. **Kubernetes declarative API/controllers** — strongest desired-state/reconciliation primitive. Custom resources store structured desired state; controllers independently reconcile actual state toward desired state. Source: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
3. **Terraform provider model** — strongest original provider identity/version/schema/configuration model. Requirements identify provider source and version constraints; dependency locks select reproducible provider versions; provider/resource/data-source schemas are discoverable through the provider protocol.
4. **Backstage Software Catalog** — useful catalog/identity/relationship model. Entities model components/APIs/resources; typed directional relations and extensible processors let external information enrich the graph without forcing all domain semantics into the core model.

### Revisit 1 — targeted unresolved questions

5. **Kubernetes Dynamic Resource Allocation (DRA)** — `DeviceClass` describes an available class/selection policy while `ResourceClaim` represents a workload claim and its allocation/status. Driver-published device status is explicitly trust-bounded: Kubernetes documentation warns that accuracy depends on the driver. This strengthens the distinction between offer/class, claim, allocation result and observed evidence. Sources: https://kubernetes.io/docs/concepts/resource-management/dynamic-resource-allocation/ and https://kubernetes.io/docs/concepts/resource-management/dynamic-resource-allocation/dra-observability/
6. **OpenTofu provider requirements / state replacement** — provider requirements separate source identity/version constraints from the selected dependency, while `tofu state replace-provider` mutates persisted provider association and requires a backup because the operation is destructive. This is strong evidence that provider replacement is a migration over binding/state lineage, not a fresh compatibility decision alone. Sources: https://opentofu.org/docs/v1.9/language/providers/requirements/ and https://opentofu.org/docs/cli/commands/state/replace-provider/
7. **Crossplane ProviderConfig / Managed Resources** — provider implementation, provider configuration and managed-resource binding are separate. ProviderConfig can be namespace- or cluster-scoped and individual managed resources can choose different configurations for the same provider. This adds authority/scope semantics to binding configuration. Sources: https://docs.crossplane.io/latest/managed-resources/managed-resources/ and https://docs.crossplane.io/v1.20/getting-started/introduction/
8. **CUE constraints/modules** — independent constraints can be composed by unification, and dependency/module resolution remains separate from schema validation. This is evidence that a universal requirement/compatibility layer can compose constraints without imposing a universal provider execution protocol. Sources: https://cuelang.org/docs/concept/how-cue-enables-data-validation/ and https://cuelang.org/docs/reference/modules/

## Extracted primitives

### Source of truth
A universal architecture should distinguish declarative intent from observed/runtime state. TOSCA service templates and Kubernetes desired state preserve intent independently from realization. Provider state and allocation evidence add separate realized/observed truths. Candidate split: `Requirement/DesiredDefinition` vs `Resolution/Allocation` vs `ObservedState/Evidence`.

### Identity
Provider/capability identity must be qualified, not a display name. Requirement, capability offer/class, provider implementation, provider configuration, binding/allocation result and observation/evidence require distinct identities because they can evolve independently.

### Requirement and capability
TOSCA supplies the clearest universal relation: a `Requirement` states a typed need and constraints; a `Capability` states a typed offer and properties; a relationship/binding fulfills the requirement. DRA sharpens this by showing that a class/offer is still not the concrete allocated resource.

### Compatibility and negotiation
Compatibility should be evaluated before binding. TOSCA constrains target types and supports filters; OpenTofu resolves source + version constraints before provider use; CUE demonstrates that constraints can be combined independently of execution. Candidate primitive: `CompatibilityDecision(requirement, offer, constraints) -> compatible|incompatible|inconclusive + evidence`, followed by explicit selection policy when multiple candidates match.

### Binding, allocation and realization
A binding is a durable fulfillment record, but the revisit shows one more layer may be needed: the selected offer/provider can yield a concrete allocation/realization identity. Kubernetes DRA separates DeviceClass from ResourceClaim allocation; Crossplane separates Provider from ProviderConfig and Managed Resource. A universal model should not collapse `BindingDecision` and `Realization/AllocationResult`.

### Configuration scope and authority
Crossplane shows provider configuration can have namespace versus cluster scope and multiple configurations can coexist for one provider. Provider configuration therefore belongs to a scoped binding/environment authority, not to universal capability identity. Secret/auth material must remain referenced rather than embedded in portable semantics.

### Lifecycle / reconciliation
Kubernetes demonstrates fulfillment can drift; OpenTofu demonstrates provider replacement can require state migration; Crossplane continuously enforces managed-resource desired state. Universal lifecycle should distinguish declared, resolved, bound, realized/active, degraded, superseded and retired, while provider-specific mechanics stay behind the boundary.

### Versioning
Requirement schema/version, capability contract version, provider implementation version, provider configuration revision, binding revision, allocation/realization revision and evidence revision can evolve independently.

### Failure semantics
Failure classes now include: no compatible offer; compatibility inconclusive; compatible provider cannot bind/configure; binding succeeds but realization/allocation fails; realized resource becomes unhealthy; replacement/migration fails. These classes require different evidence and recovery semantics.

### Extensibility/provider boundary
Catalog enrichment, policy/validation, compatibility evaluation, provider execution and reconciliation are distinct authority classes. CUE reinforces that validation/constraint composition can be universal without defining provider execution.

### Governance/evidence/provenance
Selection and reconciliation decisions should be explainable, but observed status must carry evidence-authority/trust metadata. Kubernetes DRA explicitly states driver-reported status accuracy depends on the driver, so observed evidence cannot be treated as intrinsically authoritative merely because it is attached to a control-plane object.

### Portability / lock-in
Portability improves when requirement semantics are owned by SB; provider-specific configuration, allocation mechanics, state migration and health reporting stay behind bindings. Provider replacement must preserve lineage and prove migration rather than silently rewriting provider identity.

## Product-specific mechanisms not to copy automatically

- TOSCA's full node/relationship type system and orchestration grammar.
- Kubernetes CRDs, DRA API shapes, API-server persistence and scheduler/controller machinery as mandatory SB internals.
- OpenTofu HCL/state-file semantics, provider plugin protocol and CRUD resource model.
- Crossplane's Kubernetes CRD/provider package model.
- CUE syntax/module system as the mandatory portable IR.
- Backstage's entity kinds/YAML descriptor and plugin framework.

These products implement useful primitives; they do not define the SB universal primitive set by themselves.

## Recurring patterns

1. Intent precedes realization.
2. Need and offer are separate.
3. Offer/class and concrete realization/allocation are separate.
4. Compatibility precedes selection/binding.
5. Binding is evidence-bearing and configuration-scoped.
6. Desired, realized and observed state differ.
7. Provider identity, configuration and implementation revision differ.
8. Provider replacement is migration with lineage, not alias substitution.
9. Evidence has producer/trust boundaries and can be inconclusive.
10. Constraint composition need not imply one universal execution protocol.
11. Extensions are not automatically providers.
12. External resources can satisfy requirements without becoming SB-owned.

## Conceptual comparison with System Builder

No new repository-truth conclusion is made in this revisit. Fresh `main` remains reserved for evidence-backed current-state comparison; detailed archaeology belongs to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`. Existing hypotheses remain hypotheses until that phase.

## Reconciliation hypotheses (not implementation authority)

- `Capability` / `Requirement`: GENERALIZE if existing SB concepts are domain-specific; otherwise KEEP/HARDEN.
- Provider identity + compatibility range: HARDEN/GENERALIZE candidate.
- Compatibility decision before binding: GENERALIZE candidate.
- Binding as durable evidence-bearing fulfillment: HARDEN/GENERALIZE candidate.
- Concrete allocation/realization identity separate from offer/binding: GENERALIZE candidate when runtime/provider domains require it.
- Scoped provider configuration/authority: PROVIDERIZE/HARDEN candidate.
- Provider replacement lineage: HARDEN/INTEGRATE with lifecycle/migration evidence.
- Evidence trust/provenance: HARDEN/INTEGRATE with Evidence & Provenance plane.
- TOSCA/Kubernetes/OpenTofu/Crossplane/CUE internal models: DO_NOT_BUILD as wholesale replicas.

## Repository-validation questions

1. Is there one universal Capability identity/type or multiple unrelated capability vocabularies?
2. Are requirements represented independently from capabilities/offers?
3. Does provider identity include source, contract/version compatibility and implementation version?
4. Is compatibility evaluated explicitly before binding, with explainable evidence?
5. Does a binding persist the exact provider/capability/configuration selected?
6. Is a concrete provider allocation/realization identity distinct from the offer and binding decision where needed?
7. Can provider configuration authority be scoped per environment/tenant/binding without changing portable capability semantics?
8. Can a requirement bind an external/pre-existing resource without transferring ownership?
9. Are desired binding state, realized allocation and observed health separated?
10. Can bindings/providers be replaced with migration lineage while portable SystemDefinition semantics remain stable?
11. Is evidence producer/trust/freshness explicit enough to treat provider-reported health as qualified rather than absolute truth?
12. Are secret/config references isolated from portable semantics?
13. Is provenance sufficient to reproduce why a provider was selected and how a replacement occurred?

## Symbiotic Proof candidate

Define one portable requirement and prove: (1) native capability satisfies it; (2) external provider satisfies the same requirement; (3) incompatible provider is rejected before activation with evidence; (4) native ↔ external replacement leaves requirement semantics unchanged while creating explicit migration lineage; (5) selected provider/version/scoped configuration and concrete realization are reproducible; (6) provider degradation changes qualified observed evidence, not desired definition; (7) evidence producer/trust is visible; (8) generated runtime remains autonomous from Builder control-plane availability.

## Findings

### First pass

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

### Revisit 1 — material new findings

- **G2-FINDING-UCA-11 — Offer/Binding/Realization Separation:** selecting a compatible provider/capability does not identify the concrete allocated or realized resource; realization identity and evidence are distinct from offer and binding decision.
- **G2-FINDING-UCA-12 — Provider Configuration Is Scoped Binding Context:** provider configuration/credentials/defaults can vary by environment, namespace, tenant or resource while provider capability identity remains unchanged.
- **G2-FINDING-UCA-13 — Provider Replacement Is a Migration:** changing provider association for persisted/realized state requires explicit migration lineage, concurrency/authority controls and recovery evidence; it is not equivalent to rebinding an unrealized requirement.
- **G2-FINDING-UCA-14 — Observed Evidence Has a Trust Boundary:** provider/driver-reported status is qualified evidence whose reliability derives from producer, authority, freshness and verification, not from attachment to the desired-state record.
- **G2-FINDING-UCA-15 — Constraint Composition Does Not Require Execution Unification:** portable requirement/compatibility constraints can be composed and evaluated universally while execution protocols remain capability/provider-specific.
- **G2-FINDING-UCA-16 — Fulfillment Failure Has a Realization Stage:** compatibility, binding/configuration, realization/allocation and post-realization health are separate failure stages and must not collapse into one provider error.

## Capability candidates

Existing first-pass candidates remain active:
- **G2-CAPABILITY-CANDIDATE-COMPATIBILITY-NEGOTIATION** — CROSS_CUTTING.
- **G2-CAPABILITY-CANDIDATE-RECONCILIATION-CONTROL** — CROSS_CUTTING.
- **G2-CAPABILITY-CANDIDATE-BINDING-PROVENANCE** — CROSS_CUTTING.

Revisit 1 adds:
- **G2-CAPABILITY-CANDIDATE-ALLOCATION-REALIZATION-IDENTITY** — CROSS_CUTTING. Evidence: Kubernetes DRA claim/allocation separation + Crossplane managed-resource/external-resource identity. Promote only if synthesis shows the distinction recurs across storage, deployment, integration and other provider domains.
- **G2-CAPABILITY-CANDIDATE-BINDING-CONFIGURATION-SCOPE** — CROSS_CUTTING. Evidence: Crossplane ProviderConfig scope + provider-specific configuration separation. Promote only if multiple domains require one portable scope/authority contract rather than capability-specific binding metadata.
- **G2-CAPABILITY-CANDIDATE-EVIDENCE-TRUST-QUALIFICATION** — CROSS_CUTTING. Evidence: Kubernetes DRA's explicit warning about driver status accuracy plus prior provenance/governance findings. Promote if synthesis confirms producer/trust/freshness qualification is shared across health, conformance and governance evidence.

## Saturation evidence

Revisit count: 1.
Consecutive revisits with no material architectural finding: **0**.
Result: **NOT SATURATED**. This revisit produced six material findings (`UCA-11..16`), so the saturation counter resets/remains zero. A future revisit must target remaining contradictions rather than repeat these conclusions.

## Synthesis

**Value for SB:** very high; foundational vocabulary can prevent domains from inventing incompatible requirement/provider/binding semantics.

**Adoption risk:** high if a representative's orchestration/resource model is copied; moderate if only cross-representative primitives survive synthesis and repository reconciliation.

**Investigation priority:** critical.

**Next research question for this capability:** do allocation/realization identity, scoped binding configuration and evidence trust qualification recur strongly enough across non-infrastructure domains (integration, identity, storage, workflow) to become universal primitives, or should they remain cross-cutting/domain-qualified concepts?
