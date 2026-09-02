# Provider / Binding / Capability Negotiation — Revisit 02

## Research question
How should Generation 2 resolve a semantic capability requirement into one or more qualified provider realizations while preserving deterministic selection, delegated authority, partial/degraded semantics, offline autonomy and provider replacement without leaking provider-specific locators into portable definitions?

## Representatives and evidence/source ledger
1. **Terraform provider requirements/configurations/state** — source address and version constraint identify an implementation requirement; local names are module-scoped; provider configurations are distinct and state retains the configuration reference used for managed objects. This demonstrates requirement ≠ configured realization and makes provider removal/replacement stateful.
2. **Kubernetes extended resources + Dynamic Resource Allocation (DRA)** — a workload may request the same extended resource name while realization comes from a device plugin or DRA. DeviceClass selectors and scheduler allocation show requirement satisfaction can be mediated without workload knowledge of provider mechanism.
3. **Kubernetes device plugins** — provider-specific device setup registers a vendor-qualified resource with kubelet, while consumers request the advertised resource. Registration/API compatibility, advertised capacity and health are separate from consumer requirement.
4. **SPIFFE Workload API + federation** — workloads consume entitled identities/trust bundles and can authenticate across independently administered trust domains. Missing matching trust material makes a peer untrusted; federation does not merge administrative authority.
5. **Backstage feature discovery/plugins** — packages may be discovered from app dependencies with include/exclude filters. Useful negative evidence: package discovery/installation is not equivalent to semantic provider qualification and therefore cannot be the SB negotiation primitive.

Official sources reviewed 2026-09-02: Terraform Provider Requirements and Providers Within Modules; Kubernetes Assign Extended Resources, DRA API Objects and Device Plugins; SPIFFE Workload API/Federation; Backstage Installing Plugins.

## Source of truth
Portable `CapabilityRequirement` belongs to the consumer/system semantic definition. Provider claims/manifests are candidate evidence only. `BindingResolution` records the deterministic choice under policy and constraints. `ProviderRealizationObservation` records what is actually effective. Capability-owned acceptance determines whether that realization satisfies required semantics.

## Identity
Distinguish `CapabilityRequirementRevision`, `CapabilityProfile`, `ProviderImplementation`, `ProviderRevision`, `ProviderClaim`, `ProviderConfiguration`, `BindingIntent`, `CandidateSet`, `CompatibilityAssessment`, `AdmissionDecision`, `BindingResolution`, `ProviderRealization`, `EffectiveCapabilityObservation` and `RebindAttempt`. Provider package, endpoint, registry address, runtime instance and credential are realizations/locators, never semantic capability identity.

## Lifecycle and versioning
Requirement/profile revision and provider revision evolve independently. Resolution is `requirement → candidates → compatibility assessment → admission → deterministic selection → configuration → activation → effective observation → capability acceptance`. Rebind creates new resolution/realization lineage. Provider configuration may need to remain available while provider-owned state still exists, as Terraform state semantics demonstrate.

## Failure semantics
Explicit outcomes include `NO_CANDIDATE`, `CLAIM_UNPROVEN`, `INCOMPATIBLE`, `ADMISSION_DENIED`, `AMBIGUOUS_SELECTION`, `CONFIGURATION_FAILED`, `REALIZATION_UNAVAILABLE`, `PARTIALLY_SATISFIED`, `DEGRADED`, `STALE_OBSERVATION`, `TRUST_UNAVAILABLE`, `OFFLINE_MATERIALIZATION_INCOMPLETE`, `REBIND_INCOMPLETE` and `UNKNOWN`. A healthy provider or installed package never implies semantic satisfaction.

## Extensibility and provider boundaries
Optional provider features must be modeled as profiles/features of a requirement, not accidental provider knobs. Provider-specific extensions may exist behind a namespaced escape hatch but cannot silently become portable semantics. Composite requirements may be satisfied by independent realizations—for example workload identity + secret resolution + configuration rollout—provided their compatibility and authority composition is explicitly proven.

## Governance
Selection policy constrains eligible providers, versions, provenance/trust, environment/Station scope and delegated administration. Provider claims do not self-authorize admission. `Enterprise → Station → Role → Person` delegation is non-amplifying: a Station may expose a subset of admitted capabilities/providers; Role/Person may select only within delegated alternatives and cannot broaden provider authority.

## Observability
Evidence should bind requirement/profile revision, candidate set, compatibility assessment, admission decision, selected provider revision/configuration, effective realization observation, freshness and degradation. Portable evidence references semantic/provider identities, not secrets or raw provider locators.

## Portability, offline/self-hosting and lock-in
Runtime autonomy requires the resolved provider closure, trust material and configuration needed for permitted operation to exist locally when the SB/control plane is unavailable. Public marketplace/registry reachability is not required after a qualified realization is materialized. Provider replacement requires semantic/state/trust continuity evidence, not endpoint substitution.

## Product-specific mechanism vs universal primitive
Product-specific: Terraform source addresses/aliases/state references; Kubernetes ResourceName/DeviceClass/device-plugin sockets; SPIFFE trust-domain/bundle transport; Backstage package discovery. Universal primitives: semantic requirement/profile; candidate claim; compatibility assessment; admission; deterministic resolution; scoped binding; effective observation; partial/degraded satisfaction; composite realization; rebind continuity evidence.

## Convergent patterns
- Requirement identity is independent from provider package/configuration/runtime instance.
- Provider declaration/advertisement is weaker than proven compatibility and effective satisfaction.
- Selection, admission, activation and observation are separate decisions/states.
- Provider realization may be replaceable behind a stable semantic request.
- Administrative/trust boundaries can interoperate without merging authority.
- Resolution must preserve enough lineage for replacement, rollback and offline verification.

## Divergent patterns
Terraform emphasizes globally resolved software provider versions and durable state references. Kubernetes DRA negotiates resource realization at scheduling/allocation time. SPIFFE negotiates trust/identity material across trust domains rather than software packages. Backstage primarily discovers application plugins. Generation 2 therefore needs a common evidence model, not one universal runtime negotiation protocol.

## Subcapabilities
Requirement/profile declaration; provider claim/discovery; compatibility assessment; admission/trust; deterministic selection; binding/configuration; composite realization; effective observation; degradation/partial satisfaction; Station-scoped exposure; runtime-autonomous materialization; replacement/rebind; rollback; evidence/provenance.

## SB comparison with fresh-main evidence
A bounded fresh-main GitHub code search for `CapabilityRequirement provider binding ProviderBinding capability provider` returned no sufficiently specific result. This is negative evidence for that query only, not repository-wide absence. Full archaeology remains reserved for PLANNING_B.

## Reconciliation hypotheses
- **GENERALIZE** provider negotiation around requirement/profile → compatibility → admission → resolution → realization evidence.
- **HARDEN** any provider claim with independently evaluated compatibility and freshness-scoped effective observation.
- **PROVIDERIZE** locators, credentials, package/runtime mechanics and provider-specific optional knobs.
- **INTEGRATE** workload identity, secret/config rollout and offline materialization as composable provider realizations rather than one monolithic provider.
- **KEEP** portable semantic capability ownership outside the provider plane.
- **DO_NOT_BUILD** a single universal provider handshake protocol; adapters should emit common evidence.

## Repo-validation questions
Does fresh main have first-class semantic capability requirements? Are provider claim, compatibility, admission and resolution distinct? Is selection deterministic/persisted? Can one semantic requirement be realized by multiple provider mechanisms? Can composite providers satisfy one capability without authority amplification? Can a Station expose only an admitted subset? Does runtime continue with locally materialized provider closure? Is rebind state/trust continuity explicit?

## Symbiotic Proof
Define one portable capability requirement/profile and satisfy it through two materially different providers without editing application semantics. Persist candidate/compatibility/admission/resolution evidence. Demonstrate one optional feature becoming `PARTIALLY_SATISFIED` without falsely satisfying a mandatory profile. Rebind providers with preserved semantic identity and explicit state/trust continuity. Repeat with control-plane connectivity removed after qualified local materialization. For AGWS, prove a Person can invoke an already exposed provider-bound capability but cannot add a provider, widen its scope or acquire credentials.

## Stable findings
- **G2-FINDING-PBCN-17 — Provider Claims Are Candidate Evidence, Not Compatibility or Admission Proof.** Manifest/schema/advertised features must be independently evaluated against the required semantic profile and governing trust policy.
- **G2-FINDING-PBCN-18 — Capability Negotiation Requires Explicit Mandatory/Optional Profiles and Partial-Satisfaction Semantics.** Optional provider features cannot silently redefine the portable requirement; missing mandatory semantics fail qualification while optional gaps may produce evidenced degradation.
- **G2-FINDING-PBCN-19 — One Semantic Requirement May Be Realized by Different Mechanisms Without Consumer Rewriting.** Kubernetes extended resources can preserve a stable request while device-plugin or DRA mechanisms satisfy it, demonstrating mechanism-independent requirement identity.
- **G2-FINDING-PBCN-20 — Composite Provider Realization Requires Compatibility and Authority Proof Across Independent Bindings.** Workload identity, secret resolution, configuration rollout or other realizations may compose, but successful components do not prove the composite requirement or broaden delegated authority.
- **G2-FINDING-PBCN-21 — Runtime-Autonomous Provider Use Requires a Qualified Local Realization Closure, Not Registry or Control-Plane Reachability.** Required implementation/config/trust material and effective binding evidence must be locally sufficient for the autonomy level claimed.
- **G2-FINDING-PBCN-22 — Station-Scoped Capability Exposure Is a Delegated Binding Boundary and Must Be Non-Amplifying.** Enterprise admission can delegate a bounded provider/capability set to Station; Role/Person/AGWS may consume or specialize only that set and cannot introduce providers, credentials or broader authority without escalation.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-CAPABILITY-PROFILE-PARTIAL-SATISFACTION-EVIDENCE` — **CORE / CANDIDATE**; promote if Standards and Product Proof converge on reusable mandatory/optional profile semantics.
- `G2-CAPABILITY-CANDIDATE-COMPOSITE-PROVIDER-REALIZATION-CONFORMANCE` — **CROSS_CUTTING / CANDIDATE**; promote if Identity/Secrets/Deployment and synthesis confirm multi-binding composition needs reusable compatibility/authority evidence.
- `G2-CAPABILITY-CANDIDATE-RUNTIME-AUTONOMOUS-PROVIDER-REALIZATION-CLOSURE` — **CROSS_CUTTING / CANDIDATE**; promote if Runtime/Security/Developer-Operator research converges on a reusable local implementation+configuration+trust closure.

## Adaptive Governed Work Surfaces boundary
AGWS consumes semantic capability bindings already admitted/exposed to its Station. AI may select among delegated alternatives only when policy grants that choice. It cannot install provider packages, reveal credentials, widen provider scope or turn a personal composition into provider admission. Any such intent is classified as authority escalation. This preserves the nine mandatory AGWS proofs and the `Enterprise → Station → Role → Person` boundary.

## Value / risk / priority / next question
Value: foundational to provider replaceability, hierarchical Stations and anti-lock-in. Risk: very high if provider claims become semantic truth or if partial support is treated as full compatibility. Priority: foundational. Next question: how Standards / Interoperability / API Contracts should represent semantic profiles, wire/API versions, compatibility windows and conformance evidence without owning provider selection.

## Saturation result
Six material findings were produced. `revisits_completed=2`, `consecutive_no_material_finding=0`, `last_revisit_result=MATERIAL_NEW_FINDINGS`; therefore **NOT SATURATED**.