# Provider / Binding / Capability Negotiation — Revisit 03

## Research question
How should Generation 2 represent a capability requirement, negotiated effective profile, provider binding revision and effective realization so that multiple providers can coexist, fallback/degradation is explicit, delegated Station authority is non-amplifying, credentials stay out of semantic identity, and provider replacement/cutover remains governed and reversible?

## Representatives and evidence/source ledger

| Representative | Coverage | Material contribution |
|---|---|---|
| Kubernetes Dynamic Resource Allocation (v1.35) | DEEP | `DeviceClass` expresses an administrator-defined class, `ResourceClaim` expresses workload demand, drivers publish `ResourceSlice`, allocation selects concrete resources, and prioritized subrequests can encode ordered alternatives. Admin-access requests are separately authorized. |
| OpenTofu provider requirements/configurations/lock file | DEEP | Provider source/version constraint, selected locked revision, root-owned configurations, aliases and per-resource binding are distinct; provider selection is graph-construction-time rather than arbitrary late expression evaluation. |
| Terraform provider requirements / lock behavior | DEEP | Compatible range and selected provider revision remain separate; lock material stabilizes realization across runs. |
| Backstage backend services / extension points | DEEP | Service implementations can be overridden while capability-owned extension points remain owned by the plugin; modules are constrained to declared extension surfaces and co-deployment boundaries. |
| SPIFFE Workload API / federation | DEEP | Trust-domain identity and federated trust bundles support provider-independent workload identity; absence of matching trust material makes a peer untrusted without merging administrative authority. |

Sources reviewed 2026-09-02: Kubernetes DRA current docs; OpenTofu provider requirements/configuration/provider meta-argument/dependency lock; Terraform provider requirements; Backstage backend architecture/modules; SPIFFE Workload API.

## Source of truth and identity
Generation 2 should distinguish at least:

`CapabilityRequirementRevision → CapabilityProfileRevision → CandidateProviderClaim → CompatibilityAssessment → AdmissionDecision → BindingRevision → NegotiatedEffectiveProfile → ProviderRealizationRevision → EffectiveObservation/Evidence`.

The semantic capability owner remains authoritative for what must be true. Provider metadata is evidence about a candidate realization. A binding records an environment/Station-scoped fulfillment decision. The negotiated effective profile records what semantics were actually admitted for this binding revision. Runtime/provider observations prove what became effective; they do not rewrite semantic requirement identity.

## Lifecycle and versioning
Provider selection is not a single event. It may progress through discovery, compatibility assessment, admission, deterministic selection, configuration, activation/allocation, effective observation and acceptance. Each stage may change independently.

Kubernetes DRA's prioritized alternatives are important: a request may admit more than one realizable alternative, but the selected alternative can differ per Pod. Therefore `acceptable alternatives` and `effective selected realization` require separate revision/evidence identity. OpenTofu likewise separates version constraints, selected locked provider revision and configured provider instances/aliases.

## Failure semantics
Explicit failure outcomes should include: `NO_CANDIDATE`, `DISCOVERY_STALE`, `INCOMPATIBLE`, `ADMISSION_DENIED`, `AUTHORITY_SCOPE_VIOLATION`, `AMBIGUOUS_SELECTION`, `CONFIGURATION_INVALID`, `CREDENTIAL_BINDING_UNAVAILABLE`, `REALIZATION_UNAVAILABLE`, `PARTIAL_PROFILE`, `DEGRADED_PROFILE`, `FALLBACK_SELECTED`, `FALLBACK_NOT_AUTHORIZED`, `OBSERVATION_STALE`, `CUTOVER_INCOMPLETE`, `ROLLBACK_INCOMPLETE`, `LOCAL_CLOSURE_INCOMPLETE`, and `UNKNOWN/INCONCLUSIVE`.

A fallback that keeps a process running but drops mandatory semantics is failure, not successful degradation.

## Extensibility and provider boundaries
Provider-specific configuration, endpoint locators, credentials and operational mechanics remain behind the binding/provider boundary. OpenTofu provider aliases demonstrate multiple configured realizations without changing the provider requirement itself. Backstage demonstrates capability-owned extension points with replaceable service implementations: the extension surface remains semantically owned by the capability, not by whichever implementation is wired.

Generation 2 should avoid one universal runtime handshake. Instead, provider adapters emit common compatibility, binding, realization and evidence contracts while domain-specific semantics remain capability-owned.

## Governance and delegated authority
Discovery does not authorize use. Compatibility does not authorize admission. Admission at Enterprise level does not necessarily expose the provider to every Station. A Station may receive a bounded set of capability profiles and providers; Role/Person/AGWS can select only within delegated alternatives.

Kubernetes DRA admin access is useful evidence that an otherwise valid resource request can require extra authority. The same principle generalizes: a provider alternative may be semantically compatible but unavailable to a lower delegation scope because its effective authority is stronger.

`Enterprise → Station → Role → Person` overlays must be intersectional/non-amplifying. Lower layers may narrow or select among admitted bindings; they cannot silently widen provider authority, reveal credentials, introduce new provider identities or lower mandatory semantic guarantees.

## Observability, health, freshness and degradation
Provider health, binding health, negotiated-profile satisfaction and downstream operation success are separate evidence dimensions. Effective evidence should bind:

- requirement/profile revision;
- candidate set and compatibility assessment revision;
- admission/authority scope;
- selected binding revision;
- provider realization revision;
- negotiated effective profile;
- observation timestamp/freshness;
- degradation/fallback state;
- local/offline closure profile when applicable.

`INCONCLUSIVE` must be representable when evidence is stale or incomplete rather than treating absence of proof as healthy.

## Fallback without semantic weakening
Kubernetes prioritized subrequests demonstrate explicit alternative selection. Generation 2 should generalize the *pattern*, not the API: alternatives can be ordered or policy-ranked, but every fallback candidate must independently satisfy the mandatory semantic profile and authority constraints. Optional semantics may degrade only when the requirement explicitly permits a degraded profile.

The effective profile after fallback is a new evidence-bound realization state, not an invisible continuation of the prior binding.

## Provider replacement, coexistence and cutover
Replacement should be represented as a governed transition:

`old binding/realization → coexistence window (optional) → candidate new binding → compatibility/admission → state/trust/credential readiness → cutover attempt → effective observation → acceptance → retire old binding`.

Rollback keeps the old binding lineage and produces a new transition outcome; it does not erase the failed cutover. Provider coexistence is valid when policy and capability semantics permit it, but must define routing/selection authority and evidence.

## Credentials, secret references and workload identity
Credential material must not become provider semantic identity. Bindings may refer to secret/config/workload-identity contracts by stable semantic reference. SPIFFE reinforces that workload identity/trust material can be independently provisioned and federated; trust-domain interoperability does not imply provider authority merger.

A provider binding therefore references credential/trust realization rather than embedding secret material. Rotation/revocation changes credential realization and evidence without changing capability requirement identity.

## Local/offline binding closure
A runtime can claim offline/autonomous provider use only if a qualified local closure exists for the admitted binding. The closure may include provider implementation/artifact, configuration, trust roots/bundles, credential acquisition mechanism or renewable identity path, compatibility/admission evidence, binding revision, effective-profile contract, rollback material and evidence-export capability.

A locally cached endpoint or credential alone is not sufficient closure. Freshness and authority limits remain explicit.

## Adaptive Governed Work Surfaces boundary
AGWS may compose components/actions against semantic capability bindings already exposed by its Station. The page/component references a stable semantic binding or capability contract, not a provider endpoint/credential. AI can select among delegated provider alternatives only when policy allows; otherwise provider addition, authority widening, mandatory-profile weakening or credential changes require escalation.

A page remains portable when Provider A is replaced by Provider B and the component continues through the same semantic capability binding, subject to revalidation of the new negotiated effective profile.

## Product-specific mechanism vs universal primitive
**Product-specific mechanisms:** Kubernetes DeviceClass/ResourceClaim/ResourceSlice/prioritized lists/adminAccess; OpenTofu `required_providers`, lock file, provider aliases and `provider` meta-argument; Terraform provider lock semantics; Backstage services/extension points/modules; SPIFFE federated bundles.

**Universal primitives:** CapabilityRequirementRevision, CapabilityProfileRevision, CandidateProviderClaim, CompatibilityAssessment, AdmissionDecision, BindingRevision, NegotiatedEffectiveProfile, ProviderRealizationRevision, qualified effective observation, governed fallback/degradation state, governed provider transition, qualified local binding closure, non-amplifying delegated exposure.

## Convergent patterns
- Requirement/profile identity is independent from provider realization.
- Constraints/acceptable alternatives are independent from selected effective realization.
- Discovery/claim is weaker than compatibility; compatibility is weaker than admission; admission is weaker than effective satisfaction.
- Provider configuration/credentials are realization concerns, not semantic identity.
- Multiple provider instances/alternatives can coexist behind a stable semantic requirement.
- Fallback must be explicit and policy/semantic-profile constrained.
- Extension/provider mechanisms should not own business capability semantics.
- Cross-boundary interoperability does not merge administrative authority.

## Divergent patterns
Kubernetes performs scheduler-time allocation and can choose alternatives per Pod; OpenTofu resolves provider plugin versions and provider configurations around graph construction; Backstage wires implementations/extensions at backend startup; SPIFFE supplies identity/trust material rather than business-capability providers. The common layer must therefore be evidence/identity/governance, not a single execution protocol.

## Reconciliation hypotheses
- **GENERALIZE** existing requirement/binding seams into explicit requirement/profile/binding/effective-profile evidence only where repository archaeology confirms benefit.
- **HARDEN** binding revisions with compatibility, admission, authority and freshness evidence.
- **PROVIDERIZE** implementation locators, configuration, credentials, health probes and provider-specific fallback mechanics.
- **INTEGRATE** shared governed transition, unified revision-bound realization evidence, unified evidence qualification and qualified local closure.
- **KEEP** semantic capability ownership outside the provider plane.
- **DO_NOT_BUILD** fallback that silently weakens mandatory semantics; provider discovery that self-authorizes; one universal provider runtime handshake.

## Repo-validation questions
1. Which current SB contracts distinguish semantic requirement/profile from environment/provider binding?
2. Can a current binding carry explicit revision and effective-profile identity?
3. Is binding replacement/cutover lineage represented anywhere today?
4. Can multiple bindings/providers coexist for one semantic capability and how is routing authority expressed?
5. Are secret/config/workload identity references reusable across provider replacement without provider-specific leakage?
6. Can generated runtimes carry a qualified local provider closure without Builder/control-plane reachability?
7. Can Station/Role/Person narrow provider exposure without mutating global semantic contracts?
8. Can AGWS components bind by semantic capability rather than provider endpoint?

## Symbiotic Proof
Use one portable capability requirement/profile and two materially different providers. Prove candidate discovery, compatibility, admission and deterministic binding separately. Run with Provider A, then admit Provider B in coexistence, cut over through a governed transition and preserve requirement identity. Demonstrate rollback with lineage. Remove control-plane reachability and show the admitted local closure continues within declared freshness/authority bounds. Trigger a fallback and prove mandatory semantics remain satisfied or the system fails explicitly. In AGWS, prove a Person can consume the Station-exposed semantic binding but cannot install a provider, weaken profile requirements, widen scope or access credentials.

## Stable findings
- **G2-FINDING-PBCN-23 — Negotiated Effective Profile Is a First-Class Revision-Bound Realization Fact.** Required/acceptable semantics, selected provider and the profile actually admitted/effective must not be collapsed into one provider claim or binding name.
- **G2-FINDING-PBCN-24 — Discovery, Compatibility, Admission, Delegated Exposure and Effective Satisfaction Are Distinct Gates.** A discovered compatible provider still may be unauthorized for an Enterprise/Station/Role/Person scope or fail to realize required semantics.
- **G2-FINDING-PBCN-25 — Fallback Is a Governed Rebinding Decision and Must Not Silently Weaken Mandatory Semantics.** Alternatives require independent semantic/profile and authority qualification; degraded optional semantics must be explicit evidence.
- **G2-FINDING-PBCN-26 — Provider Cutover Requires Transition Evidence Across Binding, State, Trust/Credentials, Effective Profile and Rollback Lineage.** Replacement is not endpoint/provider-name substitution and coexistence requires explicit routing/selection authority.
- **G2-FINDING-PBCN-27 — Credential/Secret/Workload-Identity Realization Is Referenced by Binding but Does Not Define Provider or Capability Identity.** Credential rotation/revocation and trust-material changes evolve independently from semantic requirement identity.
- **G2-FINDING-PBCN-28 — Qualified Local Binding Closure Must Include Semantic, Authority, Trust, Configuration and Evidence Context.** Cached endpoint/configuration alone cannot prove autonomous or safe provider realization.
- **G2-FINDING-PBCN-29 — Binding Alternatives and Provider Instances Can Coexist Behind Stable Semantic Identity Only with Explicit Selection Scope.** OpenTofu aliases and Kubernetes alternative/allocation patterns show that multiplicity is valid, but selection cannot be implicit across scopes.
- **G2-FINDING-PBCN-30 — Capability-Owned Extension Surfaces Must Remain Stable Across Provider Implementation Replacement.** Backstage-style extension ownership supports replaceable implementation without transferring semantic ownership into the provider plane.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-NEGOTIATED-EFFECTIVE-CAPABILITY-PROFILE-EVIDENCE` — **CORE / CONSOLIDATION_CANDIDATE**. Merge target with capability-profile partial-satisfaction and unified revision-bound realization evidence if Standards/Lifecycle confirm.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-PROVIDER-FALLBACK-CUTOVER-TRANSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Strong merge target for shared governed migration transition while retaining provider-specific compatibility/authority postconditions.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-BINDING-REALIZATION-CLOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge target for qualified local closure profile; must retain provider implementation/config/trust/effective-profile context.
- `G2-CAPABILITY-CANDIDATE-NON-AMPLIFYING-DELEGATED-PROVIDER-EXPOSURE` — **CROSS_CUTTING / CANDIDATE**. Authorization/AGWS/Station planning should determine whether this is a reusable policy primitive or part of hierarchical capability exposure.

No candidate promoted in this revisit.

## Value / risk / priority / next question
Value: foundational for anti-lock-in, Station hierarchy, external integrations and runtime autonomy. Risk: very high if negotiation becomes a lowest-common-denominator provider abstraction or if fallback hides semantic loss. Priority: foundational.

Next question: Standards / Interoperability / API Contracts should test whether negotiated effective profiles, compatibility windows, protocol/schema revisions and conformance evidence can be represented without making API description or transport the owner of semantic capability selection.

## Saturation result
Eight material architectural findings were produced. `revisits_completed=3`, `consecutive_no_material_finding=0`, `last_revisit_result=MATERIAL_NEW_FINDINGS`; therefore **NOT SATURATED**.