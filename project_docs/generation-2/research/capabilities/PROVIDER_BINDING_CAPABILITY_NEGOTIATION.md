# Provider / Binding / Capability Negotiation

## Research question
What universal contracts let a portable System Builder definition state *what capability it requires* while an environment independently selects, versions, configures, replaces and observes *which provider fulfills it*, without leaking provider locators or provider-specific semantics into the portable definition?

## Representatives and evidence/source ledger

| Representative | Coverage | Source of truth | Material contribution |
|---|---|---|---|
| OASIS TOSCA 2.0 | DEEP | OASIS TOSCA 2.0 normative specification | Separates typed requirement, typed capability, candidate matching and relationship created by fulfillment; mandatory dangling requirements are fulfilled at deployment. |
| Kubernetes Dynamic Resource Allocation | DEEP | Kubernetes v1.35 DRA docs/API | Separates DeviceClass, ResourceClaim/Template, driver-published ResourceSlice and concrete allocation; class expresses portable category while driver owns provider-specific parameters. |
| OpenTofu provider model | DEEP | OpenTofu provider requirements/configuration/lock docs | Separates provider source identity, module-local name, version constraint, selected locked revision and configuration instance/alias. |
| Crossplane Providers | DEEP | Crossplane v2 provider/package/managed-resource docs | Separates Provider package/revision/activation, ProviderConfig, managed-resource reference and reconciliation health. |
| SPIFFE/SPIRE | PARTIAL | SPIFFE/SPIRE workload registration/SVID docs | Useful adjacent evidence for environment-local resolution from workload selectors to issued identity and trust-domain scoped authority; not a general provider-negotiation model. |

Primary external evidence: Kubernetes DRA documents `DeviceClass`, `ResourceClaim`, `ResourceClaimTemplate` and driver-published `ResourceSlice`; TOSCA 2.0 normatively models requirements, capabilities and relationship fulfillment; OpenTofu declares provider source addresses/version constraints and locks selected provider revisions; Crossplane gives provider packages independent revision activation and ProviderConfig binding; SPIRE resolves registered selector sets to short-lived workload identities.

## Source of truth and identity
A portable capability requirement is authoritative for *needed semantics*, not for the concrete provider. A provider offer is authoritative for *what a provider revision claims to support*, not for whether it is selected. A binding is the environment-scoped decision that a particular provider/configuration fulfills a requirement. These identities must remain distinct: `requirement identity -> provider offer/revision -> binding identity/revision -> runtime resolution/allocation -> evidence`.

OpenTofu further demonstrates that provider source identity, module-local name, acceptable version range, selected version in the dependency lock, and configured provider instance/alias are not interchangeable. Crossplane similarly separates Provider package, ProviderRevision activation, ProviderConfig and the managed resource referencing it.

## Lifecycle and versioning
A requirement may exist before any provider is installed. Provider installation, compatibility selection, configuration, health, activation and removal have independent lifecycle. Binding should therefore admit states such as unresolved, candidate, bound, degraded, incompatible, replacing and retired without mutating the portable requirement.

Version negotiation is constrained selection, not implicit latest-version adoption. OpenTofu's version constraints plus lock file are strong evidence that compatibility range and selected revision need separate evidence. Crossplane's manual/automatic revision activation shows installation does not imply activation.

## Failure semantics
Failures must distinguish at least: no candidate provider, incompatible provider revision, provider unavailable/unhealthy, configuration invalid, binding unresolved, allocation/resolution failed, runtime invocation failed, and replacement/migration failed. Collapsing these into a generic provider error destroys recovery and governance information.

Kubernetes DRA reinforces the distinction between request and allocation: a ResourceClaim can exist before a concrete resource is allocated. Crossplane distinguishes provider installed from provider healthy. Runtime resolution can therefore fail after a structurally valid requirement and binding exist.

## Extensibility and provider boundaries
Provider-specific parameters belong behind the provider/binding boundary. The portable requirement may express semantic constraints and required/optional capability features; it must not embed AWS/Azure/Kubernetes locators or arbitrary driver configuration unless those semantics are themselves standardized portable primitives.

TOSCA demonstrates typed capability matching plus node filters; Kubernetes DRA demonstrates an in-tree portable claim/class API while driver-specific configuration remains interpreted by the driver. These converge on a host-owned semantic contract with provider-owned implementation detail.

## Governance
Provider selection and replacement are authority-bearing operations. Governance must be able to constrain allowed provider identities, revisions, trust/provenance, environments, compatibility ranges and configuration classes. Automatic selection must be a declared policy, not an invisible side effect.

A provider being installed or technically compatible does not authorize it to satisfy every requirement. Crossplane manual revision activation and OpenTofu lock-file review both support explicit governance over selection/change.

## Observability
Evidence should correlate requirement identity, candidate/selected provider revision, binding revision, environment, resolution attempt, health/compatibility result and resulting runtime operation/allocation. Provider health is not equivalent to binding health, and binding health is not equivalent to downstream operation success.

## Portability and lock-in
Portability requires the portable definition to survive provider replacement unchanged when replacement offers equivalent semantics. Environment bindings may differ by deployment. Provider source addresses, credentials, regions, endpoints and concrete resource IDs are environment/provider data, not universal definition identity.

Lock-in appears when provider-specific fields escape into portable capability contracts or when provider lifecycle/health becomes the semantic owner of the capability itself.

## Product-specific mechanism vs universal primitive
Universal primitives: capability requirement, provider offer, compatibility constraint, provider revision, environment-scoped binding, binding revision, resolution/negotiation result, health evidence and replacement lineage.

Product/provider mechanisms: Kubernetes DeviceClass/ResourceClaim, OpenTofu `required_providers`/aliases/lock file, Crossplane ProviderConfig, SPIRE selectors/SVID issuance. Generation 2 should learn from these mechanisms without canonizing their schemas.

## Convergent and divergent patterns
Convergent: requirement/offer separation; typed compatibility; selection occurs later than requirement declaration; provider revision/configuration are explicit; runtime/environment context participates in resolution; health/evidence remain distinct from semantic requirement.

Divergent: TOSCA emphasizes topology relationship fulfillment; Kubernetes DRA allocates concrete resources; OpenTofu resolves executable plugins and configurations; Crossplane installs reconciling controllers; SPIRE issues identity material. Therefore the universal contract must not assume every provider creates a resource, runs a plugin, or returns a credential.

## Subcapabilities
- Capability requirement declaration and optional/mandatory features.
- Provider offer/descriptor and provider revision identity.
- Compatibility/constraint negotiation.
- Environment-scoped binding and binding revision.
- Provider configuration/reference without secret disclosure.
- Resolution/allocation/invocation evidence.
- Provider and binding health.
- Replacement/migration/coexistence and rollback.
- Provider trust/provenance/governance.

## Comparison with fresh `main`
Fresh `main` inspected during this pass already has a bounded `EnvironmentProfile` contract with `EnvironmentBinding {name, kind, reference, requirementKind}` and requirement kinds `config`, `secret-reference`, `external-service`, `storage`, and `database`. Deploy validates environment bindings against release requirements. Runtime integration execution resolves an `external-service` binding by `bindingRef` and currently accepts only a `config` binding whose reference is `env://...`; unresolved/invalid bindings produce explicit runtime diagnostics.

This is concrete evidence for an existing requirement/binding seam and runtime-late resolution. It is **not** evidence of a universal provider registry, provider offer descriptor, compatibility negotiation, provider revision/health contract, or replacement lineage. Current HTTP integration binding is deliberately narrower than the Generation 2 universal model.

Hypothesis: **KEEP + HARDEN + GENERALIZE + PROVIDERIZE** the environment requirement/binding seam; do not replace working bounded contracts merely to imitate external systems.

## Hypotheses / dispositions for later reconciliation
- KEEP — environment-scoped binding and late runtime resolution.
- HARDEN — explicit binding identity/revision, diagnostics and evidence.
- GENERALIZE — requirement/offer/compatibility semantics across capability families.
- PROVIDERIZE — provider-specific configuration and execution behind capability-owned contracts.
- INTEGRATE — provenance, governance, secrets, observability and lifecycle evidence.
- REPLACE — none established by external research alone.
- DEFER — generic automatic marketplace/provider discovery until product need is proven.
- DO_NOT_BUILD — a universal lowest-common-denominator provider API that erases domain semantics.

## Questions for repository validation
1. Which current contracts besides `EnvironmentProfile` declare capability requirements or binding references?
2. Is any provider identity/revision already persisted outside Generation 2 research?
3. Which deployment checks currently distinguish missing binding, incompatible runtime and provider health?
4. Can a generated runtime replace an external-service/storage/database binding without recompilation?
5. Which evidence envelopes can carry binding-resolution and provider-replacement lineage without new constitutional identity?

## Symbiotic Proof
A generated system declares a provider-neutral required capability. Environment A binds it to provider P1 revision R1; the system operates and emits binding/resolution evidence. Environment B binds the same portable definition to semantically compatible P2/R7 without definition mutation. P1 then becomes unavailable or is intentionally retired; governance admits P2, replacement preserves logical requirement identity, runtime resumes using the new binding, and evidence proves both the old and new fulfillment paths. Builder unavailability does not prevent an already-deployed runtime from resolving its deployment-local binding.

## Stable findings
- **G2-FINDING-PBCN-01 — Capability Requirement, Provider Offer and Binding Are Distinct Identities.** A portable requirement states needed semantics; an offer states provider support; a binding records environment-scoped fulfillment.
- **G2-FINDING-PBCN-02 — Provider Source Identity, Provider Revision and Provider Configuration Are Distinct.** OpenTofu and Crossplane independently demonstrate these lifecycle layers.
- **G2-FINDING-PBCN-03 — Compatibility Constraint and Selected Revision Must Be Separate Evidence.** A version range or feature constraint is not the chosen provider revision.
- **G2-FINDING-PBCN-04 — Installation Does Not Imply Activation, Authorization or Binding.** Installed providers may be inactive, unhealthy, unauthorized or unused.
- **G2-FINDING-PBCN-05 — Binding Resolution Is Environment-Scoped and May Occur After Portable Definition Publication.** TOSCA fulfillment and runtime/provider models converge on late resolution.
- **G2-FINDING-PBCN-06 — Optional and Mandatory Capability Requirements Need Explicit Cardinality/Failure Semantics.** Absence of an optional capability must not be confused with failure to satisfy a mandatory one.
- **G2-FINDING-PBCN-07 — Provider-Specific Configuration Must Not Become Portable Capability Semantics by Accident.** Driver/provider parameters remain behind the binding boundary unless standardized as universal primitives.
- **G2-FINDING-PBCN-08 — Provider Health, Binding Health and Operation Success Are Different Evidence.** Each can fail independently and requires distinct diagnostics/recovery.
- **G2-FINDING-PBCN-09 — Provider Replacement Must Preserve Requirement Identity and Record Binding Lineage.** Replaceability is demonstrated by changing fulfillment, not by mutating the portable requirement.
- **G2-FINDING-PBCN-10 — Runtime Autonomy Requires Deployment-Local Provider Resolution Independent of Builder Availability.** A generated runtime must not require the Builder control plane for ordinary provider use after deployment.

## Capability discovery candidates
- `G2-CAPABILITY-CANDIDATE-PROVIDER-OFFER-DESCRIPTOR` — CORE; promote if multiple capability families require a common offer/revision envelope.
- `G2-CAPABILITY-CANDIDATE-BINDING-REPLACEMENT-LINEAGE` — CROSS_CUTTING; promote if migration, provenance and observability converge on the same replacement evidence primitive.
- `G2-CAPABILITY-CANDIDATE-CAPABILITY-NEGOTIATION-RESULT` — CORE; promote if Standards/API and Lifecycle research confirm a reusable negotiated-result identity rather than domain-specific validation only.

## Value / risk / priority / next question
Value: very high because this capability is the architectural hinge between portable definitions and external/native implementations. Risk: very high if over-generalized; a universal provider layer can become a lowest-common-denominator abstraction or a new lock-in surface. Priority: foundational for target architecture and migration planning.

Next question: how should Standards / Interoperability / API Contracts express portable semantic contracts and compatibility without conflating wire format, protocol binding, API version and provider implementation?