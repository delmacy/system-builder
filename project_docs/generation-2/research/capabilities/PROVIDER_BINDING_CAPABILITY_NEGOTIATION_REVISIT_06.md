# Provider / Binding / Capability Negotiation — Revisit 06

## Research question
What universal contract lets System Builder resolve a capability requirement to one or more provider realizations, prove effective consumer satisfaction, migrate or revoke that binding safely, and preserve delegated authority without confusing provider readiness with consumer-effective semantics?

## Representatives and evidence ledger
1. **Kubernetes Gateway API / conformance model** — capability support is profile/implementation/version dependent; status/conditions and conformance claims are scoped rather than a universal provider boolean. Source of truth: upstream specification/conformance artifacts.
2. **OpenTelemetry Collector** — a distribution is an assembly of receivers/processors/exporters/connectors/extensions with per-component stability; the Collector itself is explicitly `mixed` stability. Source of truth: upstream component registry/distribution/configuration contracts.
3. **SPIFFE Federation + Workload API** — cross-boundary trust requires an explicitly configured trust-domain association, endpoint profile and current bundle; entitlement controls what bundles/identities a workload receives. Source of truth: SPIFFE specifications.
4. **Terraform provider/plugin protocol** — provider realization is mediated through a versioned protocol/schema boundary rather than direct product coupling. Source of truth: provider/plugin protocol and schema contracts.
5. **OCI Distribution extension/referrer patterns** — provider feature support and discovery behavior may vary by registry realization; transport/API compatibility does not imply identical higher-level semantics. Source of truth: OCI Distribution specifications.
6. **Fresh-main SB evidence** — current P5 integration review records provider-neutral Catalog records/constraints, exact capability/provider/version identity across Assembly→Compiler, exact/minimum semantic versions and deterministic lexical candidate choice; richer ranges, exclusions, preference/scoring, alternatives and policy negotiation are explicitly not represented.

## Source of truth and typed identity
Keep independent identities for `CapabilityRequirement`, `CapabilityOffer`, `Provider`, `ProviderRealization`, `BindingIntent`, `BindingRevision`, `NegotiationDecision`, `ConsumerCohort`, `ConsumerEffectiveSatisfaction`, `ConsentOrReferenceGrant`, `HealthObservation`, `CutoverAttempt`, and `EvidenceSet`. A provider name, endpoint, protocol or healthy process is never the identity of the capability contract it realizes.

## Lifecycle
`requirement_declared → offers_discovered → candidates_qualified → binding_decided → provider_programmed → consumer_effect_observed → validated`.

Mutation/cutover has a separate lineage: `attempted → acknowledged? → observed → reconciled → effective → source_drained/dispositioned`. Timeout or lost acknowledgement yields `OUTCOME_UNKNOWN`; retry requires reconciliation.

## Versioning and applicability
Capability satisfaction is revision-qualified over requirement revision, offer revision, provider realization/version, protocol/profile, policy, failure/evidence profile, target Station/consumer cohort, trust/config revision and observation horizon. Compatibility is therefore relational, not a scalar `supports=true`.

## Failure semantics
- provider healthy but consumer requirement unsatisfied;
- offer advertised but not effective for target cohort;
- competing writers/bindings causing split authority;
- bind/program/cutover acknowledgement ambiguous;
- stale evidence or trust/config revision;
- partial migration with residual routes/sessions/caches/subscriptions;
- offline realization past its qualified closure horizon;
- provider replacement preserving transport but changing failure/evidence semantics.

`OUTCOME_UNKNOWN`, `PARTIAL`, `STALE`, `INCONCLUSIVE`, `CONFLICTED_BINDING` and `UNSUPPORTED_PROFILE` must remain distinguishable.

## Extensibility and provider boundaries
Provider adapters translate a universal capability contract into provider-specific realization and evidence. Extensions may add offers/profiles but cannot silently redefine the canonical capability meaning. Provider-specific knobs stay behind the provider boundary unless multi-representative evidence justifies promotion to a universal primitive.

## Governance and authority
Binding authority is distinct from use authority and provider-admin authority. Competing binding writers require ownership/fencing. Cross-boundary references/consent are revocable grants with scope, issuer, audience, expiry/currentness and lineage. `Enterprise → Station → Role → Person` only attenuates: a Station may expose an admitted subset or delegate bounded selection/use, never mint broader provider-admin or canonical-binding authority.

## Observability
Observe requirement/offer/binding revisions, selected realization, negotiation rationale, programming attempt, provider readiness, consumer-effective probes, cohort adoption, residual source usage, evidence freshness and revocation state. Health is supporting evidence, not proof of capability satisfaction.

## Portability and lock-in
Portability is a support vector: semantic operations, limits, failure modes, consistency/delivery guarantees, evidence/observability, security/trust, lifecycle/versioning, offline behavior, migration/rollback and administration. Provider replacement is not complete until target consumer-effective satisfaction is proven and residual source cohorts are drained or explicitly dispositioned.

## Product-specific mechanism vs universal primitive
Product-specific: Terraform RPCs, SPIFFE bundle endpoints, OTel component names, Gateway API resources, registry extension mechanics.

Universal: typed requirement/offer/binding/realization identities; applicability-scoped satisfaction; support vectors; explicit negotiation decision; ownership/fencing; revocable grants; consumer-effective proof; ambiguous-actuation reconciliation; cohort drainage; evidence horizons; qualified local closure.

## Convergent and divergent patterns
Convergent: explicit contracts/profiles, versioned realization, independently changing provider capabilities, scoped trust/entitlement, observable effective state.

Divergent: negotiation richness, provider discovery, dynamic rebinding, failure guarantees, offline behavior, component stability and evidence semantics. These divergences must be represented rather than normalized away.

## Subcapabilities
- capability requirement and offer modeling;
- provider discovery and qualification;
- deterministic negotiation/selection;
- binding ownership/fencing;
- realization programming and reconciliation;
- consumer-effective satisfaction proof;
- provider support vectors;
- consent/reference grants;
- shadow/dual realization and cutover;
- residual cohort drainage;
- offline closure/requalification;
- evidence currentness/replay.

## SB comparison — evidence only
Fresh `main` evidence from `P5-PACKAGE-01.integration-debt-review.md` says Catalog owns provider-neutral records/constraints, Assembly owns transitive composition/diagnostics, Validation owns traceability/evidence, Compiler owns deterministic derived materialization, and exact capability/provider/version identity crosses Assembly→Compiler. It also states current negotiation is exact/minimum semantic version plus deterministic lexical candidate choice; rich ranges, exclusions, preference/scoring, alternatives and policy negotiation are absent. This supports **KEEP + HARDEN + GENERALIZE**, not replacement, pending full repository archaeology in Planning B.

## Reconciliation hypotheses
- **KEEP** provider-neutral Catalog/Assembly ownership and exact identity flow.
- **HARDEN** binding identity, fencing, effective-state evidence and ambiguous outcome semantics.
- **GENERALIZE** negotiation from version-only candidate choice to typed requirement/offer/support-vector qualification without prematurely building a universal scoring engine.
- **PROVIDERIZE** provider-specific programming, health probes and migration mechanics.
- **INTEGRATE** evidence/provenance, policy, lifecycle and Station exposure contracts.
- **DEFER** preference optimization/market-style scoring until product proofs require it.
- **DO_NOT_BUILD** an opaque provider broker that can silently widen authority or canonical semantics.

## Repository-validation questions
1. Where are binding revision and ownership/fencing represented today?
2. Can Validation distinguish provider readiness from consumer-effective satisfaction?
3. Are capability offers revisioned independently from provider identity/version?
4. Can a provider cutover coexist with dual realizations without duplicate mutation authority?
5. Is ambiguous provider programming reconciled before retry?
6. Can Station exposure attenuate provider capabilities without copying provider semantics into UI definitions?
7. Which current contracts encode failure/evidence profiles beyond semantic version?

## Symbiotic Proof
Given one canonical capability requirement and two providers A/B: prove A and B can each satisfy the same admitted semantic requirement through independent bindings; prove B can run shadow/read-only while A retains mutation authority; perform cutover with a deliberately ambiguous acknowledgement and show reconciliation before retry; prove consumer-effective satisfaction for the target Station/cohort; drain/disposition A routes/sessions/caches/subscriptions before source revocation; then reconnect an offline Station and requalify its binding without granting broader authority. AGWS may invoke the admitted capability by binding reference but cannot select privileged providers, mutate canonical bindings or gain provider-admin authority.

## Stable findings
- **G2-FINDING-PBCN-45** — Capability satisfaction is an applicability-scoped claim over requirement, offer, binding revision, provider realization, protocol/profile, policy, failure/evidence profile, target Station/consumer cohort, trust/config revision and observation horizon; provider `healthy` or `supports` alone is insufficient.
- **G2-FINDING-PBCN-46** — Requirement, offer, binding, provider realization and consumer-effective satisfaction need separate typed identities; collapsing them makes provider replacement and historical evidence ambiguous.
- **G2-FINDING-PBCN-47** — Provider readiness is supporting evidence, not consumer-effective satisfaction. Effective proof must observe the qualified target population through the bound semantic contract.
- **G2-FINDING-PBCN-48** — Binding mutation requires single-writer ownership/fencing or an equivalent conflict rule; shadow/dual realization must not duplicate mutation authority merely because two providers are simultaneously reachable.
- **G2-FINDING-PBCN-49** — Cross-boundary consent/reference is a revocable, scoped grant with independent lineage/currentness; possession of an endpoint/reference does not grant canonical binding or provider-admin authority.
- **G2-FINDING-PBCN-50** — Bind/program/cutover timeout or lost acknowledgement yields an ambiguous actuation outcome and requires reconcile-before-retry; retrying blindly can create competing bindings or duplicate effects.
- **G2-FINDING-PBCN-51** — Provider portability is a mixed support vector spanning semantics, limits, failure/consistency guarantees, evidence, trust/security, lifecycle, offline behavior and administration; protocol/version compatibility is only one axis.
- **G2-FINDING-PBCN-52** — Provider migration closes only after target consumer-effective satisfaction plus residual route/session/cache/subscription/consumer-cohort drainage or explicit disposition; qualified offline closure is horizon-bounded and `Enterprise → Station → Role → Person` plus AGWS/AI cannot amplify binding/provider authority.

## Candidates
- `G2-CAPABILITY-CANDIDATE-PBCN-APPLICABILITY-SCOPED-CAPABILITY-SATISFACTION-CLAIM` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-PBCN-BINDING-OWNERSHIP-FENCING-AND-AMBIGUOUS-ACTUATION` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.
- `G2-CAPABILITY-CANDIDATE-PBCN-MIXED-PROVIDER-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-PBCN-CONSUMER-EFFECTIVE-COHORT-DRAINAGE` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.

No candidate is promoted in this revisit.

## Value / risk / priority / next question
Value: makes heterogeneous native/external providers replaceable without lying about semantic equivalence. Risk: over-general negotiation can become an opaque policy engine or accidentally centralize provider authority. Priority: high because Generation 2 target architecture explicitly contains a Capability & Provider Plane. Next question: how Standards / Interoperability / API Contracts qualifies protocol/schema compatibility without confusing syntactic interoperability with semantic capability satisfaction.

## Saturation
Material findings: 8. `consecutive_no_material_finding = 0`. Principal representatives are DEEP for this revisit, but capability remains **NOT SATURATED**.