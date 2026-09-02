# Provider / Binding / Capability Negotiation — Revisit 01

## Research question
What provider-plane primitives let Generation 2 express a portable capability requirement, deterministically select/admit/configure a provider, prove the effective realization, degrade or fail explicitly, and later replace/rebind that provider without transferring ownership of the business capability into the provider plane?

## Representatives and evidence/source ledger
1. **OpenTofu / Terraform provider model** — requirement source address + version constraint are distinct from provider configuration; one compatible version is selected across modules; lock files persist selected provider versions; aliases permit multiple configured instances; state retains provider-configuration references needed for later operations. Official docs: OpenTofu Provider Requirements, Provider Configuration, Dependency Lock File, registry protocol; Terraform Providers Within Modules.
2. **Crossplane Providers / ProviderRevisions** — package identity/version, installed state, health state and active revision are distinct; activation can be Automatic or Manual; providers install APIs representing supported managed resources; private/offline registries are supported with explicit constraints.
3. **Kubernetes Discovery API** — a live cluster advertises served groups/versions/resources, scope and verbs; discovery can differ across mixed-version servers and can be peer-aggregated. This is observed/effective capability evidence rather than merely a declared client requirement.
4. **Kubernetes Device Plugin / DRA family** — vendor-independent discovery/advertisement/allocation shows that provider-specific mechanisms can realize portable resource requests while runtime metadata remains allocation-scoped.
5. **gRPC Reflection + name resolution** — reflection advertises exported API descriptors but is optional and can be withheld for security; name resolution is separately pluggable (DNS, Unix socket, xDS). Discovery of interface and resolution of endpoint are therefore distinct concerns.
6. **Backstage backend services/extension points** — service implementations can be overridden while extension points remain capability-owned by the plugin exposing them; useful boundary evidence against provider ownership of the capability contract.

## Source of truth
No single source is sufficient. Portable requirement truth belongs to the consumer/system definition; provider implementation/version/configuration has provider-plane identity; deterministic selection/lock is resolution evidence; runtime discovery/probe is effective-capability evidence; provider health is operational evidence; business-capability acceptance remains owned by the capability using the provider.

## Identity
Distinguish: `CapabilityRequirement`, `ProviderImplementation`, `ProviderRevision`, `ProviderConfiguration`, `BindingIntent`, `BindingResolution`, `EffectiveCapabilityObservation`, `ProviderRealization`, and `Replacement/RebindAttempt`. A provider name or locator must not become the semantic identity of the required capability.

## Lifecycle and versioning
Requirement revision and provider revision evolve independently. Selection may move requirement → candidate set → admitted provider revision → configured binding → effective realization. Upgrade/replacement creates new resolution/realization lineage. Crossplane proves installed, active and healthy are separable states; OpenTofu proves version constraint and selected/locked version are separable.

## Failure semantics
Failures include no compatible provider, ambiguous/non-deterministic selection, install/admission failure, configuration failure, advertised capability missing at probe time, provider healthy but required capability unsatisfied, degraded semantic realization, stale discovery, failover without semantic continuity, and replacement whose data/state/trust migration is incomplete. These outcomes must not collapse into generic `provider unavailable`.

## Extensibility and provider boundaries
Providers implement capability contracts; they do not define ownership of business semantics. Backstage extension points reinforce capability-owned extension surfaces. Provider-specific APIs, credentials, endpoints, regions and operational knobs remain behind binding/configuration boundaries unless explicitly promoted to portable semantics.

## Governance and trust
Provider admission is distinct from provider selection. Trust may include source/registry policy, artifact verification, allowed versions, tenant/environment scope and delegated authority. Crossplane manual revision activation demonstrates that install and activation authority can be separate. gRPC reflection demonstrates that discoverability itself can be policy-controlled.

## Observability
Record selected provider revision/configuration identity, selection rationale, discovery/probe timestamp, observed capability set, degradation, health and effective realization. Health alone is not proof that a requirement is satisfied.

## Portability, offline/self-hosting and lock-in
OpenTofu supports filesystem mirrors/private registries and Crossplane supports private/local registries for package distribution, showing that provider discovery/distribution need not require a public SaaS control plane. Portability requires portable requirement identity plus replaceable provider locator/configuration and explicit continuity proof; merely supporting two provider names is insufficient.

## Product-specific mechanism vs universal primitive
Product-specific: Terraform/OpenTofu HCL provider blocks and `.terraform.lock.hcl`; Crossplane Provider/ProviderRevision CRDs; Kubernetes Discovery API/DRA; gRPC reflection/xDS; Backstage service factories. Universal candidates: requirement identity; provider implementation/revision identity; admission decision; deterministic binding resolution; effective-capability observation; semantic degradation declaration; realization evidence; replacement/rebind continuity proof.

## Convergent patterns
- requirement/constraint differs from selected implementation;
- selected implementation differs from configured instance;
- declared capability differs from observed/effective capability;
- install/admission/activation/health are independent states;
- deterministic selection benefits from a persisted lock/resolution record;
- replacement is a migration/reconciliation event, not locator substitution;
- provider health is weaker than capability satisfaction.

## Divergent patterns
OpenTofu resolves one provider version globally per provider address while Crossplane maintains package revisions and explicit activation state. Kubernetes discovery is runtime-observed and may aggregate heterogeneous servers; gRPC reflection is optional. Backstage emphasizes compile/startup wiring rather than runtime negotiation. Therefore Generation 2 must not impose one negotiation mechanism across all provider classes.

## Subcapabilities
Requirement declaration; candidate discovery; provider admission/trust; compatibility evaluation; deterministic selection; configuration/binding; runtime probing; effective capability observation; semantic degradation; health/readiness; failover; replacement/rebind; multi-provider composition; tenant/environment scoping; offline discovery/distribution; evidence/provenance.

## SB comparison with evidence
A limited fresh-main GitHub code search for provider/capability/binding terms returned no sufficiently specific contract to support a defensible comparison. This is **not evidence of absence**. Repository archaeology remains a question for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; no research-branch artifact is treated as product truth.

## Reconciliation hypotheses
- **KEEP** any existing portable capability intent that is provider-neutral once repository evidence confirms it.
- **HARDEN** provider selection with explicit resolution/admission/effective-observation evidence.
- **GENERALIZE** rebind continuity across secrets, storage, deployment, integrations and other providerized capabilities.
- **PROVIDERIZE** product-specific locators/configuration/operational mechanisms, not business semantics.
- **INTEGRATE** provider artifact trust with Governance/Artifact evidence and runtime-effective freshness with Observability.
- **DO_NOT_BUILD** a universal provider-specific capability probe protocol; adapters may translate provider-native discovery into a common evidence model.

## Repo-validation questions
Where is portable capability intent represented? Are provider identities/revisions/configurations separate? Is selection deterministic and persisted? Can multiple providers coexist by tenant/environment? Are provider health and capability satisfaction separate? Is replacement lineage explicit? Do generated runtimes require the SB control plane for discovery/binding? Are secrets and trust roots portable across rebinding? Are provider-specific options leaking into portable definitions?

## Symbiotic Proof
A valid proof should demonstrate the same portable capability requirement realized by at least two provider implementations, deterministic evidence of each binding, a provider replacement that preserves the semantic requirement while producing new realization lineage, explicit handling of semantic degradation, and an offline/self-hosted resolution path where applicable. The proof fails if application semantics must be rewritten merely to change provider.

## Stable findings
- **G2-FINDING-PBCN-11 — Capability Requirement, Provider Selection and Effective Realization Are Distinct Identities.** A requirement can remain stable while selection/configuration/realization changes.
- **G2-FINDING-PBCN-12 — Declared Provider Capability and Observed Effective Capability Are Distinct Evidence.** Registry/schema claims require freshness-scoped runtime observation where capability availability can vary.
- **G2-FINDING-PBCN-13 — Provider Admission, Selection, Activation and Health Are Independent Decisions/States.** Crossplane and policy-controlled discovery make collapsing these states unsafe.
- **G2-FINDING-PBCN-14 — Deterministic Binding Requires a Persisted Resolution Record, Not Only Compatibility Constraints.** OpenTofu/Terraform lock behavior demonstrates constraints alone do not identify the chosen realization.
- **G2-FINDING-PBCN-15 — Provider Health Does Not Prove Capability Satisfaction or Semantic Equivalence.** A healthy provider can lack, disable or degrade the specific semantics required by a consumer.
- **G2-FINDING-PBCN-16 — Provider Replacement Is a Continuity Proof Across Semantic Requirement, State, Trust and Effective Realization.** Locator substitution is insufficient; rebind must create new lineage and prove required invariants.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-EFFECTIVE-CAPABILITY-OBSERVATION-EVIDENCE` — **CROSS_CUTTING**; promote only if Standards/Observability/Lifecycle confirm a reusable freshness-scoped observation primitive.
- `G2-CAPABILITY-CANDIDATE-DETERMINISTIC-PROVIDER-RESOLUTION-RECORD` — **CORE**; promote only if synthesis shows provider selection must be first-class across multiple capability families.
- `G2-CAPABILITY-CANDIDATE-PROVIDER-REBIND-CONTINUITY-PROOF` — **CROSS_CUTTING**; subsumes/relates to the Secrets-specific rebind candidate only if later synthesis proves a generic semantic/state/trust continuity model.

## Value / risk / priority / next question
Value: very high because provider replaceability is central to symbiosis and anti-lock-in. Risk: very high if provider-specific mechanisms leak into portable definition or if health is mistaken for semantic satisfaction. Priority: foundational for synthesis and target architecture. Next question: how Standards / Interoperability / API Contracts represent compatibility, semantic profiles, negotiated versions and conformance without making transport/API description the owner of provider selection.

## Saturation result
Material findings were produced. `revisits_completed=1`, `consecutive_no_material_finding=0`, `last_revisit_result=MATERIAL_NEW_FINDINGS`; therefore **NOT SATURATED**.