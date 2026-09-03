# Provider / Binding / Capability Negotiation — Revisit 05

## Research question
How should Generation 2 model provider discovery, requirement/offer negotiation, binding mutation and effective realization so that capability identity remains portable while provider selection, delegated Station exposure, ambiguous outcomes, multi-provider migration, local/offline closure and AI/AGWS use remain explicit, revision-qualified and non-amplifying?

This cycle-6 pass is research-by-exception. It does not reopen settled provider-runtime mechanics; it stress-tests identity typing, multi-axis revision qualification, consumer-effective satisfaction, conflict/fencing, grant revocation, failure-domain/evidence-profile compatibility and provider substitution.

## Representatives and evidence/source ledger
Reviewed 2026-09-03 from current official documentation.

| Representative | Coverage | Material contribution |
|---|---|---|
| Kubernetes Gateway API | DEEP | `Accepted`, `ResolvedRefs` and `Programmed` remain separate conditions; partial validity is first-class; cross-namespace references require target-side `ReferenceGrant`; grant removal must revoke access. ListenerSet conflict rules show multiple claims can coexist while only the winning realization is programmed. |
| OpenFeature specification | DEEP | Provider status is event-derived and explicitly distinguishes `READY`, `STALE`, `ERROR`, `FATAL` and `RECONCILING`; domain/provider association scopes which clients observe provider events. Provider health is therefore revision/freshness evidence, not binding authority. |
| Terraform provider model | DEEP | Provider requirement, source/version selection, lock-file material, configured instances/aliases and per-component provider maps are distinct. Multiple configured realizations of one provider may coexist; lock checksums improve package identity but do not establish organizational trust or semantic suitability. |
| Dapr component scopes | DEEP | Component type/configuration, namespace and application scopes are distinct; a configured component can exist but remain unavailable to a consumer outside its namespace/scope. |
| Prior PBCN/SCEP Generation-2 research | DEEP | Supplies expected-base binding ownership, consumer-effective secret/config generations, residual-source disposition, offline trust qualification and hierarchical Station exposure constraints. |

### Current official evidence used
- Gateway API troubleshooting/status defines `Accepted`, `Programmed` and `ResolvedRefs` as different observations; `Programmed` means configuration reached a data plane but readiness can still follow.
- Gateway API `ReferenceGrant` is target-side authorization for cross-namespace references, and implementations must revoke access when the grant is removed.
- Gateway API ListenerSet conflict semantics demonstrate deterministic ownership when multiple realizations claim the same listener; a resource may be accepted overall while only non-conflicting members are programmed.
- OpenFeature provider events require explicit `READY`, `STALE`, `ERROR`, `RECONCILING` and configuration/context-change transitions; SDK status follows those events.
- Terraform distinguishes provider requirements/source/version, lock-file selection/integrity and configured instances/aliases; mirrors can preserve package checksums without proving local trust policy.
- Dapr namespaces/scopes restrict effective component visibility independently of component existence.

## Primitives and source of truth
The semantic capability owner remains source of truth for required behavior. Provider catalogs, packages, configuration, health, routing and runtime status are realization evidence only.

Generation 2 should type at least:

`CapabilityRequirementRevision`
→ `ProviderOfferRevision`
→ `CompatibilityAssessmentRevision`
→ `AdmissionDecisionRevision`
→ `DelegatedExposureRevision`
→ `BindingIntentRevision`
→ `BindingAttempt`
→ `BindingReceipt/ObservedState`
→ `ProviderRealizationRevision`
→ `ConsumerEffectiveRealizationSet`
→ `QualifiedCapabilitySatisfactionEvidence`.

Provider package identity, configured-provider identity, runtime/provider-health identity and consumer-effective realization identity must not be collapsed into the capability identity.

## Identity and multi-axis revision qualification
A binding/effective-satisfaction proof is valid only against the relevant vector, including at minimum:

`requirement_rev × provider_offer_rev × contract/profile_rev × admission/policy_rev × delegated_exposure_rev × trust/package_rev × provider_config_rev × binding_rev × topology/routing_rev × Station/tenant_rev × consumer_population_rev × evidence_profile_rev`.

A material change on any dependency axis stales dependent evidence unless the proof explicitly demonstrates invariance across that change. This is stronger than a single binding version because a binding may remain textually unchanged while trust, topology, Station authority or consumer population changes.

## Lifecycle
Discovery and negotiation should be modeled as distinct stages:

`discover → assess compatibility → admit → expose/delegate → bind intent → actuate → observe provider realization → observe consumer-effective realization → validate semantic postcondition → operate → rebind/dual-run → cut over → residual-source disposition → retire`.

No stage implies the next. Discovery does not grant authority; compatibility does not grant admission; admission does not grant Station exposure; provider readiness does not prove consumer uptake; programming does not prove semantic success.

## Versioning, ownership and fencing
Binding mutation is governed shared state. Every bind/rebind/fallback/dual-run/cutover/rollback/retire operation should carry an expected binding/base revision plus an authority scope and transition intent. A stale writer must conflict or reconcile rather than silently overwrite a newer binding.

Gateway ListenerSet conflict resolution provides adjacent evidence that competing claims require deterministic ownership semantics. Generation 2 should not import timestamp/name tie-breaking as a universal rule; the universal primitive is explicit ownership/fencing plus evidence of the currently effective winner.

## Failure semantics
Required states include:

`NO_CANDIDATE`, `DISCOVERY_STALE`, `INCOMPATIBLE`, `ADMISSION_DENIED`, `EXPOSURE_DENIED`, `STALE_EXPECTED_BASE`, `BIND_CONFLICT`, `REFERENCE_UNRESOLVED`, `PROVIDER_NOT_READY`, `PROVIDER_STALE`, `PROVIDER_ERROR`, `ACTUATION_OUTCOME_UNKNOWN`, `PROGRAMMING_PARTIAL`, `CONSUMER_UPTAKE_PARTIAL`, `SEMANTIC_POSTCONDITION_FAILED`, `FAILURE_DOMAIN_INCOMPATIBLE`, `EVIDENCE_PROFILE_INSUFFICIENT`, `CUTOVER_INCOMPLETE`, `RESIDUAL_SOURCE_IN_USE`, `ROLLBACK_INELIGIBLE`, `LOCAL_CLOSURE_INCOMPLETE`, `PARTIAL`, and `INCONCLUSIVE`.

An acknowledgement loss after an external bind/rebind effect is `OUTCOME_UNKNOWN`, not failure. Retry must be preceded by reconciliation when duplicate/conflicting effects are possible.

## Discovery versus authority
Discovery answers “what may exist”; negotiation answers “what appears compatible”; authority answers “what may be admitted, exposed, selected or mutated.” These are different planes.

A discovered provider cannot self-admit. Possession of credentials cannot confer provider administration. A compatible provider cannot automatically become a fallback. AI ranking cannot widen the admitted set.

## Effective realization versus negotiation compatibility
Negotiation output should identify a profile and proof obligations, not merely a provider name. Compatibility at negotiation time is provisional until actual realization and consumer-effective postconditions are observed.

`CompatibilityAssessment ≠ ProviderHealth ≠ ProgrammingEvidence ≠ ConsumerEffectiveEvidence ≠ SemanticPostconditionEvidence`.

Gateway API is decisive here: `Accepted=True` may coexist with reference or member-level failures, and `Programmed=True` means configuration was sent to the data plane rather than proving application-level semantic success.

## Failure-domain and evidence-profile compatibility
A provider can satisfy functional operations while violating required failure semantics or evidence obligations. Provider negotiation therefore needs dimensions beyond feature names, including:
- failure domain/isolation assumptions;
- consistency/freshness guarantees;
- ambiguity/retry semantics;
- observability/evidence profile;
- trust/provenance profile;
- offline/local closure properties;
- data residency/Station boundaries where applicable.

A provider that implements the same CRUD-like capability but cannot produce required receipt/postcondition evidence is not necessarily substitutable for a governed operation.

## Delegated Station exposure and attenuation
`Enterprise → Station → Role → Person` remains intersectional and non-amplifying.

Enterprise may admit provider classes/profiles and define mandatory constraints. Station receives only explicitly exposed capabilities/providers and may administer only delegated binding facets. Role narrows invocable operations/profile. Person/AGWS can select among already-authorized realizations only when such selection is delegated.

Gateway `ReferenceGrant` strengthens the target-consent principle: a cross-boundary reference requires permission from the owner of the referenced boundary, and grant removal must revoke the relationship. This maps to a universal rule of revocable target-side consent, not to Kubernetes namespace mechanics.

## Provider substitution, shadow/dual realization and residual-source disposition
Replacement should preserve one lineage:

`source-effective set`
→ `target candidate + compatibility/admission`
→ `target shadow/dual realization`
→ `cohort-qualified target uptake`
→ `semantic/evidence validation`
→ `cutover decision`
→ `source residual-use disposition`
→ `retirement`.

Dual availability is not dual-use authority. Shadow realization must not receive mutating traffic unless explicitly authorized. Cutover is incomplete while any required cohort remains on the source or while source residual use is unknown. Rollback is eligible only if the source remains semantically, operationally and authoritatively qualified.

## Local/offline provider closure and reconnection
Qualified local closure must carry enough material to satisfy the exact capability/profile without central reachability: provider artifact/implementation or local endpoint, package/provenance qualification, config/trust dependencies, delegated scope, binding revision, routing selection, consumer-effective evidence and exportable reconciliation evidence.

Terraform mirrors illustrate that local package availability and checksum coverage are not equivalent to organizational trust; Dapr shows locally available components still remain namespace/application-scoped.

On reconnect, local success is not automatically globally current. Policy/admission, revocation, provider/trust generation, Station exposure, topology and consumer-population changes must requalify the prior local proof.

## Extensibility and provider boundaries
Provider-specific endpoints, auth handshakes, package installation, health APIs and operational tuning remain providerized. Universal architecture should standardize requirement/offer identity, compatibility dimensions, admission/exposure, binding ownership, transition outcomes and evidence contracts—not one provider protocol.

## Governance and observability
Every provider transition should expose actor/authority, expected base, selected profile, provider/config realization, transition intent, receipt/outcome, observed effective state, affected consumer population and evidence freshness. Operational dashboards must not map `provider READY` to `capability healthy` without the additional evidence planes.

## Portability and lock-in
Portability is strongest when semantic capability/profile identity survives provider replacement while realization-specific identifiers stay mapped at the boundary. Lock-in increases when provider package/config IDs, health enums, retry semantics or endpoint concepts leak into domain/work-surface identity.

A portable profile may still declare minimum failure/evidence semantics. Portability must not mean lowest-common-denominator semantics.

## Product-specific mechanism versus universal primitive
**Product-specific:** Gateway `Accepted/ResolvedRefs/Programmed`, `ReferenceGrant`, ListenerSet conflict rules; OpenFeature provider events/domain; Terraform source addresses, aliases, lock files/mirrors; Dapr component namespaces/scopes.

**Universal:** typed requirement/offer/binding/realization/effective identities; multi-axis revision-qualified evidence; explicit admission/exposure; expected-base/fencing; target-side revocable cross-boundary consent; failure/evidence compatibility profile; ambiguous-outcome reconciliation; governed shadow/dual-run/cutover; consumer-effective and residual-source closure; qualified offline/reconnect proof.

## Convergent patterns
1. Provider existence/readiness is weaker than authorized effective use.
2. Provider and consumer identities are scoped and mapped, not canonical business identity.
3. Multiple provider/config instances can coexist.
4. Cross-boundary use requires explicit scope/consent.
5. Provider state can become stale independently of binding text.
6. Package integrity/trust and functional compatibility are separate.
7. Effective state requires observation after actuation.

## Divergent patterns
Gateway API emphasizes reconciliation/data-plane attachment and partial validity; OpenFeature emphasizes provider lifecycle and client association; Terraform emphasizes dependency/package/configuration selection and reproducibility; Dapr emphasizes runtime component realization and application scope. Their shared layer is qualification, authority, binding identity and evidence—not runtime mechanics.

## Subcapabilities
1. Requirement/profile ownership.
2. Provider offer/discovery registry.
3. Compatibility and failure/evidence-profile negotiation.
4. Admission and target-side consent.
5. Delegated Station exposure.
6. Binding ownership/fencing.
7. Provider realization/health observation.
8. Consumer-effective satisfaction.
9. Multi-provider shadow/dual-run/cutover.
10. Residual-source/rollback eligibility.
11. Offline closure and reconnect requalification.
12. Provider-neutral AGWS/AI use.

## Comparison with System Builder — bounded evidence only
No new repository-wide claim is made in this research pass. Revisit 04 recorded a bounded fresh-main vocabulary search with no matching `ProviderBinding`/`CapabilityRequirement` vocabulary and explicitly treated that as non-exhaustive. Repository archaeology remains for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; research evidence is not promoted to product truth.

## Reconciliation hypotheses
- **KEEP** semantic capability identity outside provider realization.
- **HARDEN** binding/effective proofs with revision vectors, expected-base/fencing, consumer population and failure/evidence profile qualification.
- **GENERALIZE** typed requirement/offer/binding/realization/effective identity and target-side revocable consent.
- **PROVIDERIZE** installation, endpoint, credential, lifecycle/event API and provider-specific health mechanics.
- **INTEGRATE** SCEP consumer-effective generations and residual-use evidence into binding cutover qualification without transferring semantic ownership.
- **REPLACE** implicit ready==effective or last-write-wins provider selection if Planning B finds them.
- **DEFER** provider-specific optimization/routing heuristics.
- **DO_NOT_BUILD** discovery-as-authority, auto-fallback to weaker semantics, credential-derived authority or a universal lowest-common-denominator provider handshake.

## Repo-validation questions
1. Does fresh main distinguish semantic capability/profile from provider package/config/runtime identities?
2. Does binding mutation have expected-base or equivalent fencing?
3. Are admission, Station exposure, provider readiness and consumer-effective satisfaction separate?
4. Can evidence express partial/conflicted provider realizations and ambiguous outcomes?
5. Are failure semantics and evidence obligations represented in provider compatibility?
6. Can provider cutover be cohort-qualified and prove residual-source disposition?
7. Can cross-Station references/exposure be revoked without reconstructing semantic identity?
8. Can local runtimes prove provider closure and requalify on reconnect?
9. Can AGWS use stable semantic bindings through A→B replacement without provider-admin authority?

## Symbiotic Proof
Define one semantic capability profile requiring explicit ambiguity disposition, evidence freshness and offline closure. Register Providers A/B: both satisfy functional operations, but B initially lacks the required evidence profile. Prove B is discoverable yet negotiation rejects it as an effective substitute. Admit A Enterprise-wide but expose it only to Station X; Station Y must be unable to bind it. Bind A with expected-base revision and demonstrate provider `READY` plus partial reference/consumer uptake does not produce semantic satisfaction. Introduce a stale concurrent rebind and prove it conflicts. Upgrade B to satisfy the evidence profile, admit it, create shadow realization without mutation authority, then migrate only an authorized cohort. Revoke one cross-boundary target consent and prove the dependent realization becomes non-effective even if provider health stays `READY`. Lose acknowledgement of one cutover actuation and require reconciliation before retry. Finish cohort convergence, prove source residual-use disposition, then retire A. Disconnect control-plane reachability and prove Station X operates only within the recorded local closure; reconnect after an Enterprise policy/provider-trust revision and require requalification. From AGWS, allow Person selection only among Role/Station-authorized profiles and prove AI cannot admit providers, widen exposure or grant itself cutover authority.

## Findings
- **G2-FINDING-PBCN-39 — Provider Binding and Satisfaction Require Typed Identity Across Requirement, Offer, Binding, Realization and Consumer-effective Planes.** Provider/package/config/runtime IDs are mapped realization identities, not canonical capability identity.
- **G2-FINDING-PBCN-40 — Effective Provider Satisfaction Is a Multi-axis Revision-qualified Proof.** Requirement, contract/profile, admission/policy, trust, config, binding, topology, Station, consumer population and evidence-profile changes can stale satisfaction independently.
- **G2-FINDING-PBCN-41 — Negotiated Functional Compatibility Is Insufficient Without Failure-domain and Evidence-profile Compatibility.** A provider that implements the same operations may still be non-substitutable when ambiguity, isolation, freshness or proof obligations differ.
- **G2-FINDING-PBCN-42 — Competing Binding/Attachment Claims Require Explicit Ownership/Fencing and Effective-winner Evidence.** Deterministic product tie-breaking is not the universal primitive; stale or concurrent writers must not silently alter the effective provider.
- **G2-FINDING-PBCN-43 — Cross-boundary Provider Consent Is Revocable Runtime Authority, Not Static Configuration.** Target-side consent removal must invalidate dependent effective realizations even when provider health/configuration remains unchanged.
- **G2-FINDING-PBCN-44 — Shadow/Dual Realization Must Separate Availability From Mutation Authority.** Target readiness for validation does not authorize dual writes or mutating traffic; cohort routing authority is an independent governed decision.
- **G2-FINDING-PBCN-45 — Provider Cutover Closure Requires Consumer-population Convergence and Residual-source Disposition.** Provider-current state or target health cannot close migration while required consumers or residual source use remain unresolved.
- **G2-FINDING-PBCN-46 — Local Provider Closure Is Revision-bounded and Must Be Requalified on Reconnect.** Cached provider bytes/endpoints plus local success cannot establish current global admission, trust, exposure or policy validity.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-PBCN-TYPED-REQUIREMENT-OFFER-BINDING-REALIZATION-IDENTITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with universal typed identity while Provider/Binding retains semantic-to-realization mapping.
- `G2-CAPABILITY-CANDIDATE-PBCN-MULTI-AXIS-EFFECTIVE-SATISFACTION-REVISION-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with universal revision-qualified evidence.
- `G2-CAPABILITY-CANDIDATE-PBCN-FAILURE-EVIDENCE-PROFILE-NEGOTIATION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Provider substitutability must include failure and evidence semantics, not feature labels only.
- `G2-CAPABILITY-CANDIDATE-PBCN-REVOCABLE-CROSS-BOUNDARY-PROVIDER-CONSENT` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Authorization/AGWS target-side consent and hierarchical exposure.

No candidate promoted. Adaptive Governed Work Surfaces remains explicitly promoted and distinct from generic UI.

## Architecture proof-backfill obligations
1. Typed capability versus provider/package/config/runtime identity mapping proof.
2. Multi-axis evidence-staleness proof after topology/policy/trust change with unchanged binding text.
3. Functional-compatible but failure/evidence-incompatible provider rejection proof.
4. Concurrent stale rebind fencing proof.
5. Target-side consent revocation invalidates effective realization proof.
6. Shadow provider available but mutation-disallowed proof.
7. Partial cohort cutover and residual-source non-closure proof.
8. Ambiguous cutover acknowledgement-loss reconciliation proof.
9. Offline local closure plus reconnect requalification proof.
10. Enterprise→Station→Role→Person and AI/AGWS non-amplification proof.

## Value / risk / priority / next question
**Value:** foundational to anti-lock-in, external-system symbiosis, Station delegation, runtime autonomy and safe provider replacement. **Risk:** very high if negotiation, readiness, binding and satisfaction collapse into one state or if functional equivalence hides weaker failure/evidence semantics. **Priority:** foundational.

**Next question:** Standards / Interoperability / API Contracts should test typed semantic-contract/protocol/schema/transport/binding identities, consumer-population compatibility, executable conformance, contract/evidence revision vectors, cross-boundary references, deprecation→sunset→withdrawal→drainage, ambiguous external effects, provider substitution and qualified offline conformance closure.

## Saturation result
Eight material architectural findings were produced. `revisits_completed=5`, `consecutive_no_material_finding=0`, `last_revisit_result=MATERIAL_NEW_FINDINGS`; therefore **NOT SATURATED**.
