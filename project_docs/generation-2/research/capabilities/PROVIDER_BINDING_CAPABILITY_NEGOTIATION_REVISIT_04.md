# Provider / Binding / Capability Negotiation — Revisit 04

## Research question
How should Generation 2 distinguish capability discovery, compatibility, admission, delegated exposure, binding, provider actuation and consumer-effective satisfaction so provider replacement, multi-provider coexistence, local/offline operation and `Enterprise → Station → Role → Person` delegation remain explicit, non-amplifying and evidence-qualified?

This revisit specifically stress-tests expected-base ownership, partial/ambiguous admission and actuation, provider status freshness, governed dual-run/cutover, secret/config consumer-effective generations, residual-source evidence, trust/bootstrap separation and AGWS/AI boundaries.

## Representatives and evidence/source ledger

| Representative | Coverage | Material contribution |
|---|---|---|
| Kubernetes Gateway API | DEEP | Separates `Accepted`, `ResolvedRefs`, `Programmed` and implementation readiness. Partial validity is first-class: a Route may be accepted while references are unresolved, and cross-namespace references require explicit `ReferenceGrant`. |
| OpenFeature specification | DEEP | Provider state is explicit (`NOT_READY`, `READY`, `STALE`, `ERROR`, `FATAL`, optionally `RECONCILING`) and transitions are provider-emitted events rather than inferred from lifecycle return values. |
| Crossplane v2 provider configuration | DEEP | Provider configuration is separately scoped from managed-resource semantics and may be cluster-wide or namespaced; credentials are referenced through provider configuration and remain provider-specific realization concerns. |
| Dapr component model/scopes | DEEP | Components have semantic building-block type plus named configured realization; namespaces and application scopes restrict exposure, showing that provider/component availability is not equivalent to universal application access. |
| OpenTofu provider configuration and dependency locking | DEEP | Requirements, selected/locked provider package, configured provider instance, aliases/`for_each`, per-resource binding and mirror trust/checksum provenance are distinct concerns. |

### Source ledger
Reviewed 2026-09-02 from official documentation:
- Kubernetes Gateway API troubleshooting/status, API reference and GEP-1364 status/conditions.
- OpenFeature provider, event, status and flag-evaluation specification sections.
- Crossplane v2.x provider configuration / managed-resource documentation.
- Dapr component scopes, bindings and pluggable-component documentation.
- OpenTofu provider configuration, dependency lock and provider-lock documentation.

## Source of truth and identity
The semantic capability owner remains source of truth for required behavior. Provider declarations, runtime readiness and configuration are evidence about realizations, not semantic capability identity.

Generation 2 should distinguish at least:

`CapabilityRequirementRevision`
→ `CapabilityProfileRevision`
→ `CandidateProviderClaimRevision`
→ `CompatibilityAssessmentRevision`
→ `AdmissionDecisionRevision`
→ `DelegatedExposureRevision`
→ `BindingRevision`
→ `NegotiatedEffectiveProfileRevision`
→ `ProviderActuationAttempt`
→ `ProviderRealizationRevision`
→ `ConsumerEffectiveRealizationSet`
→ `QualifiedSatisfactionEvidence`.

The critical new refinement is that provider realization and consumer-effective realization are not interchangeable. A provider can be `READY`, configured and even programmed while some consumers remain on a prior secret/config/provider generation or while some references are unresolved.

## Lifecycle and versioning
A binding lifecycle is not a single `selected` flag. It may move through discovery, compatibility, admission, delegated exposure, configuration, actuation, reference resolution, programming, consumer uptake, qualified satisfaction, coexistence, cutover, retirement and rollback.

Every mutable transition must identify the expected/base binding revision or equivalent semantic owner. A stale writer attempting to rebind, change provider configuration, alter exposure or cut over traffic must conflict/revalidate rather than silently overwrite a newer binding decision.

OpenTofu reinforces the distinction between requirement constraints, locked provider package and configured instances. Gateway API reinforces the distinction between semantic acceptance and whether references/programming are actually resolved/effective. OpenFeature reinforces that provider health itself has a lifecycle and can become `STALE` or `RECONCILING` independently of binding identity.

## Failure semantics
Required explicit states include:

`NO_CANDIDATE`, `DISCOVERY_STALE`, `INCOMPATIBLE`, `ADMISSION_DENIED`, `DELEGATED_EXPOSURE_DENIED`, `STALE_EXPECTED_BASE`, `AMBIGUOUS_SELECTION`, `REFERENCE_UNRESOLVED`, `CONFIGURATION_INVALID`, `CREDENTIAL_OR_TRUST_UNAVAILABLE`, `PROVIDER_NOT_READY`, `PROVIDER_STALE`, `PROVIDER_ERROR`, `ACTUATION_OUTCOME_UNKNOWN`, `PROGRAMMING_PARTIAL`, `CONSUMER_UPTAKE_PARTIAL`, `PARTIAL_PROFILE`, `DEGRADED_PROFILE`, `FALLBACK_NOT_AUTHORIZED`, `CUTOVER_INCOMPLETE`, `RESIDUAL_SOURCE_IN_USE`, `ROLLBACK_INCOMPLETE`, `LOCAL_CLOSURE_INCOMPLETE`, and `INCONCLUSIVE`.

A particularly important case is partial validity. Gateway API demonstrates that `Accepted=True` may coexist with `ResolvedRefs=False`; therefore Generation 2 must never map admission/acceptance directly to effective satisfaction.

## Extensibility and provider boundaries
Provider-specific endpoints, credentials, package formats, lifecycle calls, retry behavior and operational details remain behind provider adapters. The common architecture should standardize identities, claims, admission, binding, evidence and governed transitions—not one universal provider runtime protocol.

Dapr shows that a reusable building-block contract can have named component realizations and scoped exposure. OpenTofu shows multiple configured instances for the same provider package. Crossplane shows provider configuration scoped independently of managed-resource semantic intent. These mechanisms converge on a stable semantic/provider boundary while differing strongly in runtime mechanics.

## Governance and delegated authority
Discovery does not confer authority. Compatibility does not confer admission. Admission does not confer delegated exposure. Exposure does not confer provider administration.

`Enterprise → Station → Role → Person` must remain intersectional and non-amplifying:
- Enterprise may admit providers/profiles and define non-weakenable constraints.
- Station receives only an explicitly exposed subset and may administer only delegated provider/binding facets.
- Role narrows usable operations/profiles.
- Person/AGWS may select or invoke only what Role/Station authority already exposes.

Gateway API `ReferenceGrant` is strong adjacent evidence: a reference across an administrative boundary requires authorization by the owner of the target namespace. Dapr component scopes similarly show that a configured component may exist but remain unavailable to an application outside its declared scope.

## Binding ownership and expected-base semantics
Provider binding is mutable governance state and therefore requires concurrency semantics. A mutation should carry at least:
- binding identity and expected revision/generation;
- semantic capability/profile revision;
- authority scope and actor;
- provider/configuration identity;
- trust/credential references, never secret plaintext;
- intended transition (`bind`, `rebind`, `fallback`, `dual-run`, `cutover`, `rollback`, `retire`);
- postcondition/evidence obligations.

A stale mutation must fail or be explicitly reconciled. Last-write-wins is unsafe because it can silently restore an obsolete provider, profile or authority scope.

## Partial/ambiguous admission and actuation
`AdmissionDecision` and `ProviderActuationAttempt` need separate outcome semantics.

Possible cases:
1. admission succeeds but one or more references are unresolved;
2. provider initialization succeeds but provider state becomes stale before use;
3. actuation request acknowledgement is lost after external effect occurred;
4. provider is programmed but only part of consumer fleet has adopted the new configuration/secret/binding;
5. dual-run exists but routing/selection evidence is incomplete.

These states must become `PARTIAL`, `OUTCOME_UNKNOWN` or `INCONCLUSIVE`, not implicit success. Before retrying an ambiguous provider actuation that may have external effects, the system should reconcile externally observable identity/state where possible.

## Provider health versus capability satisfaction
OpenFeature makes provider status explicit and supports stale/error/fatal/reconciling states. Generation 2 should use that pattern but not collapse provider health into business capability satisfaction.

At minimum:

`ProviderHealthEvidence ≠ ReferenceResolutionEvidence ≠ ProgrammingEvidence ≠ ConsumerEffectiveEvidence ≠ SemanticPostconditionEvidence`.

A healthy provider can still be bound incorrectly; a programmed realization can still have stale consumers; a consumer can receive a new binding while semantic postconditions fail.

## Governed dual-run, cutover and rollback
Provider replacement should preserve one transition lineage:

`old binding/effective set`
→ `new candidate + compatibility/admission`
→ `dual realization readiness`
→ `consumer/routing cohort migration`
→ `qualified convergence`
→ `cutover acceptance`
→ `residual-source disposition`
→ `retirement`.

Rollback is a new governed transition and requires retained old-provider eligibility. It cannot be inferred merely because the old provider still exists.

This revisit integrates the Secrets / Configuration / Environment Portability result: cutover is incomplete while consumer-effective secret/config generations remain mixed without explicit policy or while residual old-source consumers remain unresolved. Provider-current and consumer-effective generation evidence therefore feed Provider/Binding qualification but remain semantically owned by Secrets/Configuration.

## Trust, credentials and bootstrap separation
Provider identity, provider trust, provider credentials and workload identity are distinct.

OpenTofu mirror/checksum behavior demonstrates that provider-package provenance can differ depending on origin versus mirror. Crossplane shows credentials are provider-configuration inputs. None of these facts should be embedded in semantic capability identity.

A provider may be semantically compatible but unusable because trust, credential or bootstrap evidence is missing/stale. Conversely, possessing credentials must never authorize provider admission or administration.

## Local/offline binding closure and reconnection
A qualified local/offline binding closure must include the exact provider implementation/artifact or reachable local provider, configuration realization, trust roots/bundles, credential acquisition/renewal path, admitted profile, binding revision, delegated scope, consumer-effective realization evidence and evidence-export/reconciliation capability.

OpenTofu provider mirrors demonstrate that local provider availability can be qualified by platform/checksum coverage, but mirror-derived checksums do not necessarily carry the same origin-signature semantics. Therefore offline closure must preserve provenance/trust qualification, not just local bytes.

On reconnection, prior local qualification must be revalidated against current admission, revocation, provider/configuration generation, secret/config generations and Enterprise/Station exposure policy before expanding authority or declaring global convergence.

## Adaptive Governed Work Surfaces boundary
AGWS remains explicitly distinct from generic UI/low-code.

An AGWS component/action may bind to a semantic capability exposed by its Station. It must not embed provider endpoint, credentials or provider-admin configuration. The effective resolution path is:

`Enterprise admitted capability/provider set → Station exposure → Role permitted profile/actions → Person personalization/invocation`.

AI is the sole AGWS materializer, but that does not grant provider admission, rebind, credential, cutover or canonical-domain authority. AI may propose a binding change; if it exceeds delegated scope or changes mandatory semantics, it must escalate.

Required AGWS implications remain:
- a page survives Provider A→B replacement by stable semantic binding plus revalidation;
- personal automation cannot widen provider or Station authority;
- mandatory inherited components remain unaffected by provider choice;
- personalization is revalidated when Station/Role/provider/profile generation changes;
- lineage/version/diff/reset/rollback remain provider-neutral.

## Product-specific mechanisms vs universal primitives
**Product-specific mechanisms:** Gateway API `Accepted`/`ResolvedRefs`/`Programmed`, `ReferenceGrant`; OpenFeature provider events/status; Crossplane `ProviderConfig`/`ClusterProviderConfig`; Dapr component namespaces/scopes and binding component types; OpenTofu aliases/`for_each`, provider lock file and mirrors.

**Universal primitives:** requirement/profile revision, provider claim, compatibility assessment, admission decision, delegated exposure, binding revision with expected-base, negotiated effective profile, provider actuation attempt, provider realization, consumer-effective realization set, qualified satisfaction evidence, partial/ambiguous outcome, governed dual-run/cutover/rollback, residual-source disposition, qualified local binding closure.

## Convergent patterns
- semantic requirement/profile is independent from provider realization;
- provider availability/health is independent from authorization/exposure;
- accepted/admitted is weaker than references-resolved/programmed/effective;
- provider configuration and credentials remain realization concerns;
- multiple provider instances can coexist with explicit selection/routing scope;
- cross-administrative references require explicit authorization;
- stale/error/reconciling provider state must be observable;
- fallback/cutover must preserve mandatory semantics or fail explicitly;
- local/offline provider availability requires trust/provenance qualification.

## Divergent patterns
Gateway API is routing/data-plane oriented; OpenFeature is evaluation-provider oriented; Crossplane is reconciliation/control-plane oriented; Dapr supplies runtime building blocks; OpenTofu resolves provider packages/configurations around infrastructure graph execution. Their shared architectural layer is identity, qualification, authority and transition evidence—not execution mechanics.

## Subcapabilities
1. Capability requirement/profile ownership.
2. Provider discovery and claim registration.
3. Compatibility/conformance assessment.
4. Admission and delegated exposure.
5. Binding revision/concurrency ownership.
6. Negotiated effective profile.
7. Provider health/reference/programming qualification.
8. Consumer-effective satisfaction.
9. Multi-provider coexistence and routing/selection.
10. Governed fallback, cutover, rollback and retirement.
11. Trust/credential/bootstrap dependency qualification.
12. Qualified local/offline binding closure and reconnection.

## Comparison with System Builder — bounded repository evidence only
A bounded search of fresh `main` for `ProviderBinding`, `CapabilityRequirement` and negotiated-profile vocabulary returned no matches in this run. This is **not** evidence of repository-wide absence. Repository archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; no research-branch document is treated as product truth.

## Reconciliation hypotheses
- **KEEP** semantic capability ownership outside the provider plane.
- **HARDEN** bindings with expected-base, authority, exposure, provider-health, consumer-effective and postcondition evidence.
- **GENERALIZE** requirement/profile/binding/effective-realization lineage only where Planning B confirms current seams.
- **PROVIDERIZE** endpoints, credentials, package/install mechanics, health probes and provider-specific configuration.
- **INTEGRATE** governed migration, ambiguous-outcome disposition, evidence qualification, qualified local closure and SCEP consumer-effective generation evidence.
- **REPLACE** any implicit last-write-wins binding mutation if repository archaeology finds it.
- **DEFER** provider-specific optimization/routing policies to provider/capability owners.
- **DO_NOT_BUILD** discovery-as-authorization, lowest-common-denominator fallback, credential-derived authority, or one universal runtime handshake.

## Repo-validation questions
1. Does fresh `main` already have a semantic capability requirement/profile distinct from provider/configuration identity?
2. Is a provider binding revisioned and protected by expected-base/concurrency semantics?
3. Are admission, delegated Station exposure and runtime/provider readiness distinct facts?
4. Can current provider state express `STALE`, partial reference/programming or `INCONCLUSIVE`?
5. Can two providers coexist behind one semantic capability with explicit routing/selection authority?
6. Can secret/config provider-current and consumer-effective generations be attached to binding/cutover evidence without leaking material?
7. Is ambiguous provider actuation reconciled before retry?
8. Can a local generated runtime carry a qualified provider closure and later requalify on reconnection?
9. Can AGWS bind semantically without endpoint/credential coupling and without provider-admin authority?

## Symbiotic Proof
Define one portable capability profile and Providers A/B. Admit A Enterprise-wide but expose it only to Station X; prove Station Y cannot use it. Bind A and demonstrate provider-ready but unresolved-reference evidence does not produce semantic satisfaction. Introduce B, require a stale expected-base rebinding attempt to fail, then admit B and enter dual-run. Rotate provider credentials/configuration so only part of the consumer cohort adopts the new generation; cutover must remain `PARTIAL` until consumer-effective and residual-source evidence converge. Lose acknowledgement of one actuation and require reconciliation instead of blind retry. Complete cutover, preserve stable capability identity and rollback lineage, then disconnect control-plane reachability and prove Station X continues only within its qualified local closure. Reconnect after policy/revocation changes and require requalification before declaring global readiness. From AGWS, prove a Person can invoke the Station-exposed semantic capability but cannot admit providers, widen exposure, obtain credentials or force cutover.

## Stable findings
- **G2-FINDING-PBCN-31 — Admission, Reference Resolution, Programming, Consumer Uptake and Semantic Satisfaction Are Independent Evidence Planes.** Gateway API partial validity proves that acceptance can coexist with unresolved references; provider-ready/programmed state must not be collapsed into effective semantic satisfaction.
- **G2-FINDING-PBCN-32 — Provider Binding Mutation Requires Expected-base or Equivalent Ownership Preconditions.** Rebind, fallback, exposure, cutover and retirement decisions are governed mutable state; stale writers must conflict/revalidate rather than silently restore obsolete provider/profile/authority state.
- **G2-FINDING-PBCN-33 — Provider Health Is Revision/Freshness Evidence, Not Capability Authority or Satisfaction.** `READY/STALE/ERROR/FATAL/RECONCILING`-style status can qualify a realization but cannot grant admission, exposure or prove business postconditions.
- **G2-FINDING-PBCN-34 — Cross-boundary Provider Exposure Requires Explicit Target-side or Higher-authority Consent.** Gateway `ReferenceGrant` and Dapr scopes converge on the principle that discoverable/configured capability does not imply access across Station/tenant/application boundaries.
- **G2-FINDING-PBCN-35 — Provider Cutover Completeness Depends on Consumer-effective and Residual-source Evidence, Not Provider-current State Alone.** Mixed secret/config/binding generations require cohort-qualified disposition before retirement or full convergence can be claimed.
- **G2-FINDING-PBCN-36 — Ambiguous Provider Actuation Must Be Reconciled Before Blind Retry When External Effects May Already Exist.** Lost acknowledgement creates `OUTCOME_UNKNOWN`; external identity/state reconciliation or explicit disposition is required to avoid duplicate or conflicting realizations.
- **G2-FINDING-PBCN-37 — Qualified Local Binding Closure Must Carry Provider Provenance/Trust Qualification, Not Merely Cached Provider Bytes or Endpoints.** Mirror/local availability can have different trust/checksum coverage and must remain operation/profile/platform scoped.
- **G2-FINDING-PBCN-38 — AI/AGWS Semantic Binding Use Does Not Confer Provider Admission, Administration, Credential or Cutover Authority.** Provider-neutral composition remains bounded by `Enterprise → Station → Role → Person` exposure and requires escalation for authority/profile changes.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-PBCN-CONSUMER-EFFECTIVE-BINDING-SATISFACTION-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with unified effective-realization evidence while retaining Provider/Binding ownership of binding satisfaction and SCEP ownership of secret/config consumption.
- `G2-CAPABILITY-CANDIDATE-PBCN-EXPECTED-BASE-BINDING-OWNERSHIP` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with universal concurrency/ownership preconditions; binding-specific conflict semantics remain here.
- `G2-CAPABILITY-CANDIDATE-PBCN-PARTIAL-AMBIGUOUS-ACTUATION-DISPOSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Merge with universal ambiguous-outcome disposition and Architecture Reconciliation quarantine/reconciliation semantics.
- `G2-CAPABILITY-CANDIDATE-PBCN-DELEGATED-CROSS-BOUNDARY-PROVIDER-EXPOSURE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Authorization/AGWS hierarchical capability exposure; do not promote separately unless synthesis finds an ownerless semantic gap.

No candidate promoted in this revisit.

## Architecture proof-backfill obligations
1. Accepted-but-unresolved-reference proof.
2. Provider-ready-but-semantic-postcondition-failing proof.
3. Stale expected-base rebinding conflict proof.
4. Cross-Station exposure denial/target-consent proof.
5. Partial consumer-effective cutover proof.
6. Ambiguous provider-actuation acknowledgement-loss proof.
7. Dual-run convergence and residual-source retirement proof.
8. Offline mirror/provider trust-qualification proof.
9. Reconnection requalification proof.
10. AGWS/AI non-amplification proof.

## Value / risk / priority / next question
Value: foundational to anti-lock-in, hierarchical Stations, provider replacement, external-system integration and generated-runtime autonomy. Risk: extremely high if `provider ready`, `admitted`, `bound` and `effective` collapse into one boolean or if fallback/cutover silently weakens semantics. Priority: foundational.

Next question: Standards / Interoperability / API Contracts should stress-test semantic contract identity versus protocol/schema/transport realization, conformance evidence, compatibility windows, downgrade/extension behavior and provider substitution without transferring capability-selection ownership to API-description mechanisms.

## Saturation result
Eight material architectural findings were produced. `revisits_completed=4`, `consecutive_no_material_finding=0`, `last_revisit_result=MATERIAL_NEW_FINDINGS`; therefore **NOT SATURATED**.