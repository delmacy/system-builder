# Secrets / Configuration / Environment Portability — Revisit 5 (Cycle 6)

## Research question
How should Generation 2 model secret/configuration identity, revision, rotation, workload-effective consumption, provider migration and disconnected closure so that provider-current state never masquerades as consumer-effective truth, lower-scope overlays cannot weaken superior invariants, evidence never requires plaintext, and AI/AGWS cannot acquire secret/config administration authority by materializing a request?

## Representatives and evidence/source ledger
1. **HashiCorp Vault** — dynamic secrets are lease-bound; renewal changes lease validity without necessarily changing secret contents; revocation invalidates leased credentials but backend completion must be observed. Official Vault lease/database-engine documentation is the source of truth.
2. **AWS Secrets Manager** — rotation is asynchronous and stage-based (`AWSPENDING` → test → `AWSCURRENT`, retaining `AWSPREVIOUS`); incomplete/cancelled rotation can leave staging labels requiring explicit repair. Official Secrets Manager API/User Guide is the source of truth.
3. **Kubernetes Secrets** — provider/object revision and workload-visible material are separate: projected Secret updates are asynchronous and `subPath` mounts do not receive automated Secret updates. Official Kubernetes documentation is the source of truth.
4. **SPIFFE/SPIRE** — workload identity, short-lived SVID credential realization and rotating trust bundles are distinct; bundle distribution to workloads is a separate responsibility. Official SPIFFE specifications/docs are the source of truth.
5. **External Secrets Operator (ESO)** — source provider, ExternalSecret intent, refresh policy, controller sync status and target Kubernetes Secret have distinct lifecycles. `CreatedOnce`, `Periodic` and `OnChange` explicitly show that source-current and target-current are not equivalent. Official ESO documentation is the source of truth.

### Evidence observations
- Vault leases attach validity/renewability to dynamic secret realization independently of semantic reference; consumers must renew or replace credentials before lease expiry.
- AWS rotation can leave `AWSPENDING` after failed/cancelled work; a later rotation may reject while a prior one is still considered in progress. This proves that rotation intent, candidate generation, current designation and closure are distinct facts.
- AWS rotation functions are privileged deputies and must verify current/pending credentials refer to the same target resource before mutation, providing a concrete authority/confused-deputy boundary.
- Kubernetes states that mounted Secret propagation can lag API mutation, and `subPath` mounts never receive automatic Secret updates. Provider-side mutation therefore cannot prove effective workload adoption.
- SPIFFE trust bundles rotate independently of stable trust-domain identity; trust material distribution is itself a runtime realization concern.
- ESO tracks `syncedResourceVersion` and `refreshTime`, while refresh policy can intentionally prevent propagation from provider to target. Source freshness, controller observation and target realization are separate dimensions.

## Source of truth and typed identity
Generation 2 should distinguish at least:
- `SecretSemanticReferenceId/Revision`
- `ConfigurationIntentId/Revision`
- `OverlayResolutionId/Revision`
- `ProviderBindingId/Revision`
- `SecretProviderGenerationId`
- `CredentialLeaseId/Revision`
- `TrustMaterialId/Revision`
- `ProjectionOrSyncRealizationId/Revision`
- `ConsumerEffectiveGenerationId/Revision`
- `RotationAttemptId`
- `RevocationAttemptId`
- `ResidualUseDispositionId`

Provider path, AWS staging label, Kubernetes `resourceVersion`, Vault lease ID, SPIFFE SVID serial/bundle key and ESO target Secret name are realization/correlation identifiers. None should silently become canonical semantic identity.

## Lifecycle
General lifecycle:
`semantic intent/reference → expected-base validation → hierarchical overlay resolution → authority/admission → provider binding → candidate generation → provider validation → provider-current designation → projection/sync → workload reload/re-read → consumer-effective validation → prior-generation revocation/retirement → residual-in-use disposition → closure evidence`.

A rotation may stop or become ambiguous at any transition. Generation 2 must preserve the last objectively proven transition rather than collapsing the sequence into `ROTATED=true`.

## Versioning and effective revision vector
Effective secret/config qualification is a vector rather than one revision:
`semantic-reference × configuration-intent × overlay × provider-binding × provider-generation × lease/expiry × trust × projection/sync × consumer cohort × reload/read evidence × policy/authority × Station/environment`.

A material change to an axis stales only conclusions depending on that axis. A provider generation can advance while the consumer-effective generation remains old; a trust bundle can rotate while the semantic workload identity remains stable; an overlay can change without changing provider material yet still invalidate runtime-effective configuration claims.

## Failure semantics
- `provider current` does not imply `projected`, `loaded`, `accepted by dependency` or `old generation no longer in use`.
- Rotation cancellation/failure may leave a candidate/staging state that requires reconciliation before retry.
- Acknowledgement loss after a provider write or rotation yields `OUTCOME_UNKNOWN`; observe version/stage/lease state before another mutation.
- Provider revocation/expiry does not prove process memory, mounted files, caches or disconnected Stations ceased using old material.
- ESO/Kubernetes-style refresh lag or intentionally non-refreshing policy can leave target/workload state stale by design; that state must be explicit, not treated as controller failure.
- Missing cohort/reload evidence yields `PARTIAL/INCONCLUSIVE` rather than success.
- A missing required trust anchor, decryption/bootstrap key or superior overlay invariant fails closed for protected operations.

## Extensibility and provider boundaries
Providers own storage/encryption, secret generation, leases, provider versioning, rotation APIs, KMS/HSM mechanics and delivery adapters. Generation 2 owns portable semantic references, capability requirements, binding negotiation, expected-base mutation, hierarchical overlay rules, authority facets, evidence qualification, cutover semantics and residual-source disposition.

A provider adapter may expose staged rotation, lease renewal, immutable projection, polling, watch, sync or workload-identity mechanisms without forcing those product-specific mechanics into the portable definition.

## Governance, authority, ownership and fencing
Authority facets remain distinct:
`ConfigEdit ≠ SecretReferenceEdit ≠ SecretRead ≠ SecretWrite ≠ Rotate ≠ Revoke ≠ TrustAdmin ≠ ProviderAdmin ≠ ProjectionAdmin ≠ WorkloadReload ≠ Recovery`.

Mutation of semantic config/reference, provider binding, staging alias/current designation, overlay or rotation policy requires expected-base/ownership/fencing evidence appropriate to that subject. A stale writer may still be authenticated and broadly authorized but must not overwrite a newer binding, overlay or current-generation decision.

AWS's privileged rotation deputy is a useful adversarial pattern: authorization to rotate one secret does not authorize substitution of a different target resource. Generation 2 should bind actuation to the reviewed subject/resource tuple and expected revision vector.

## Hierarchical overlays and Adaptive Governed Work Surfaces
The effective surface/config hierarchy remains `Enterprise → Station → Role → Person`. Lower layers can specialize only delegated dimensions and cannot weaken superior invariants such as mandatory trust anchors, forbidden endpoint classes, non-disclosure, minimum credential freshness or prohibited providers.

Adaptive Governed Work Surfaces remains a distinct capability. AI is the only surface materializer, but materialization authority is not secret/config administration authority. An AGWS request may select an already-authorized semantic binding or config option; it cannot read plaintext, rotate/revoke credentials, change provider administration, weaken an Enterprise invariant, or turn a personal automation into Station-level secret authority.

## Observability and value-safe evidence
Evidence should record identifiers and qualified metadata rather than plaintext: semantic reference/revision, binding revision, provider generation/lease, projection/sync revision, consumer/cohort, observation point, freshness/expiry, trust revision, Station/environment, transition, coverage and postcondition.

A proof can establish `provider-current`, `target-synced`, `workload-loaded`, `dependency-authenticated` or `prior-generation-not-observed-in-qualified-cohort`. These are different claims. Hashes may be used only when safe for the secret type; low-entropy secret material must not be exposed to offline guessing through naive fingerprints.

## Portability, dual realization and provider substitution
Provider migration should support a bounded dual-realization transition when policy permits:
`source effective → target candidate → target provider-valid → target projected → target consumer-effective → routing/reference cutover → source residual-use disposition → source revoke/retire`.

Dual realization does not authorize broad dual-read or plaintext export. If target and source generations cannot be proven equivalent semantically, the transition must be treated as credential replacement, not byte migration.

## Offline / air-gapped qualified closure
A local closure can include portable config/reference definitions, permitted encrypted material or local workload identity bootstrap, trust bundle revision, binding descriptor, last-qualified consumer generation, expiry/freshness constraints, validators and recovery procedure. It must not become a generic plaintext secrets dump.

Disconnected validity is conjunctive: local availability, decryption, trust validity, provider/lease validity where knowable, overlay applicability, Station authority and consumer-effective evidence. Reconnection requires comparison against superior trust/revocation/config/binding epochs before stale local material can regain privileged actuation.

## Lock-in
Lock-in rises when canonical semantics depend on Vault paths/lease IDs, AWS staging labels, Kubernetes Secret names/mount behavior, SPIFFE-specific SVID formats or ESO refresh-policy syntax. Portable contracts should capture semantic reference, required secret/config capabilities, freshness/rotation profile, exposure rules and proof obligations; provider adapters own mechanism-specific realization.

## Product-specific mechanisms versus universal primitives
**Product-specific:** Vault lease IDs/dynamic-engine revocation; AWS `AWSPENDING/AWSCURRENT/AWSPREVIOUS`; Kubernetes Secret projection and `subPath`; SPIFFE SVID/bundle formats; ESO `refreshPolicy`, `syncedResourceVersion`, SecretStore and reconciliation loop.

**Universal primitives:** typed semantic/reference/provider/projection/consumer identities; multi-axis effective revision vector; expected-base/fenced mutation; candidate→provider-current→consumer-effective transition lineage; residual-in-use disposition; value-safe evidence; hierarchical non-weakenable overlays; governed dual-realization cutover; qualified local closure and reconnection requalification.

## Convergent and divergent patterns
Convergence: semantic reference differs from concrete credential/config realization; provider-side truth differs from consumer-visible state; rotation/sync has intermediate states; stale/partial evidence must be explicit; authority for actuation is narrower than read/discovery.

Divergence: Vault emphasizes leases/dynamic revocation; AWS staged asynchronous rotation; Kubernetes eventual projection; SPIFFE short-lived workload identity and trust bundles; ESO controller-mediated refresh policy. Generation 2 should normalize boundaries/evidence, not force one secret lifecycle.

## Subcapabilities
Semantic secret/config references; hierarchical overlays; expected-base/fenced mutation; provider binding; generation/lease lifecycle; trust/bootstrap material; rotation/revocation; projection/sync/reload; consumer-effective qualification; residual-use tracking; value-safe evidence; provider migration/dual realization; local/offline closure; reconnection requalification.

## SB comparison using evidence only
A bounded fresh-main GitHub code search for `secret configuration provider binding environment portability` returned no matches. This is not repository-wide proof of absence. Precise implementation comparison remains deferred to repository archaeology/targeted validation; the research branch is not treated as product truth.

## Reconciliation hypotheses
- **GENERALIZE:** typed semantic/reference/provider/projection/consumer identities and multi-axis effective revision vectors.
- **HARDEN:** expected-base/fencing for config, overlay, provider-binding and current-generation mutation.
- **HARDEN:** explicit provider-current versus consumer-effective convergence lineage and residual-use disposition.
- **PROVIDERIZE:** lease/version/rotation/projection/sync mechanics.
- **INTEGRATE:** workload identity as a provider-neutral option where it removes stored secrets.
- **HARDEN:** non-disclosure/value-safe evidence and Station/offline requalification.
- **DEFER:** provider-specific optimization schedules and commercial secret-management features.
- **DO_NOT_BUILD:** plaintext secret replication into portable definitions, research artifacts, AI context, AGWS state or generic telemetry.

## Repo-validation questions
1. Does fresh `main` separate semantic reference/config intent, provider generation, projection/sync and consumer-effective generation?
2. Which config/reference/binding mutations already have expected-base or equivalent concurrency/fencing semantics?
3. Can Enterprise→Station→Role→Person overlays express non-weakenable superior invariants?
4. Is there any proof today that a provider rotation became workload-effective rather than merely provider-current?
5. Can residual consumers of an old generation be represented after revocation/rotation?
6. Can evidence prove identity/revision/freshness/coverage without plaintext or unsafe fingerprints?
7. Can provider migration run bounded dual realization while preserving semantic identity and authority?
8. Can disconnected Stations operate from qualified closure and requalify after superior trust/revocation/binding changes?
9. Are SecretRead, Rotate, Revoke, ProviderAdmin, TrustAdmin and WorkloadReload authorities separable?

## Symbiotic Proof
A database credential semantic reference is bound to AWS Secrets Manager. Rotation creates and tests `AWSPENDING`, promotes it to `AWSCURRENT`, then ESO/Kubernetes projects the new realization to connected workloads. One workload uses a `subPath` mount and therefore remains on the prior generation; one Station is disconnected. Generation 2 reports provider-current success but overall consumer-effective state as `PARTIAL`, does not expose the secret value in evidence, and does not revoke/retire the old generation until residual use is dispositioned according to policy. The Station reconnects after trust and binding revisions advanced and must requalify before privileged use. Later the binding migrates to Vault or SPIFFE-backed workload identity through bounded dual realization without changing the portable business reference. An AGWS user can select the admitted capability but cannot obtain plaintext, rotate credentials or weaken superior policy.

## Stable findings
- **G2-FINDING-SCEP-38 — Secret/Configuration Identity Is Typed Across Semantic Reference, Overlay, Provider Generation, Lease/Trust Material, Projection and Consumer-effective Realization.** Provider-specific IDs are correlation/realization identities unless explicitly mapped.
- **G2-FINDING-SCEP-39 — Effective Secret/Configuration Qualification Is a Multi-axis Revision Vector.** Semantic reference, overlay, binding, provider generation, lease/expiry, trust, projection, consumer cohort, authority and Station/environment can advance independently; affected evidence becomes stale when a relevant axis changes.
- **G2-FINDING-SCEP-40 — Provider-current, Projected/Synced and Consumer-effective Are Distinct Convergence States.** AWS staged rotation, Kubernetes propagation and ESO refresh policies demonstrate that provider success cannot prove workload uptake.
- **G2-FINDING-SCEP-41 — Secret/Config Mutation and Current-generation Promotion Require Expected-base or Ownership/Fencing Evidence.** Broad authentication/authorization is insufficient to protect against stale writers or confused-deputy target substitution.
- **G2-FINDING-SCEP-42 — Residual-in-use Is a First-class Postcondition for Rotation, Revocation and Provider Cutover.** Provider revocation/expiry/current-label movement cannot prove old material disappeared from workloads, caches or disconnected Stations.
- **G2-FINDING-SCEP-43 — Secret Evidence Must Be Value-safe and Claim-specific.** Lineage, generation, freshness, coverage and postconditions must be provable without plaintext; unsafe fingerprints of low-entropy material are also prohibited.
- **G2-FINDING-SCEP-44 — Dual-realization Provider Migration Requires Target Consumer-effectiveness Before Source Disposition.** Dual availability is not dual-read authority, and semantically non-equivalent target material is credential replacement rather than byte migration.
- **G2-FINDING-SCEP-45 — Offline Secret/Config Closure Is Revision-qualified and Reconnection Requires Superior-state Requalification.** Local availability does not imply current global trust, revocation, overlay, binding or authority validity.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-SCEP-TYPED-SECRET-CONFIG-PROJECTION-CONSUMER-IDENTITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with universal typed identity while Secrets retains consumer/material semantics.
- `G2-CAPABILITY-CANDIDATE-SCEP-MULTI-AXIS-EFFECTIVE-SECRET-CONFIG-REVISION-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge with universal revision-qualified evidence primitive.
- `G2-CAPABILITY-CANDIDATE-SCEP-SECRET-CONFIG-MUTATION-OWNERSHIP-FENCING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with concurrency/ownership primitive while preserving provider-current promotion specifics.
- `G2-CAPABILITY-CANDIDATE-SCEP-CONSUMER-EFFECTIVE-RESIDUAL-USE-DISPOSITION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Secrets owns the material-consumption and old-generation disposition semantics.

No candidate is promoted in this revisit.

## Architecture proof-backfill obligations
1. Provider-current with stale Kubernetes `subPath` consumer must remain PARTIAL, not PASS.
2. ESO `CreatedOnce`/`OnChange` target stale relative to provider must be represented as intentional policy-qualified divergence.
3. Lost acknowledgement after rotation/write must reconcile provider state before retry.
4. Stale expected-base actor must not move current-generation/binding/overlay state over a newer decision.
5. Rotation deputy must be unable to substitute a different target resource outside the reviewed subject tuple.
6. Missing consumer cohort/reload evidence must produce PARTIAL/INCONCLUSIVE.
7. Revocation/current-label movement with a residual old consumer must not satisfy retirement closure.
8. Evidence path must prove generation/freshness/coverage without plaintext or unsafe fingerprint leakage.
9. Provider migration must prove target consumer effectiveness before source retirement and preserve semantic reference identity.
10. Lower Role/Person/Station overlay must fail if it weakens an Enterprise trust/non-disclosure/freshness invariant.
11. Offline Station whose trust/binding/revocation epoch is stale must degrade/fail according to profile.
12. Reconnection must requalify local closure before privileged actuation.
13. AGWS/AI request must not gain SecretRead/Rotate/Revoke/ProviderAdmin/TrustAdmin/Reload authority through materialization.

## Value / risk / priority / next question
**Value:** critical to provider-neutral runtime autonomy, self-hosting, hierarchical Stations and safe operational continuity. **Risk:** critical because false rotation completion, stale consumer generations, confused-deputy mutation and evidence leakage directly create security failures. **Priority:** highest cross-cutting tier. **Next question:** Provider / Binding / Capability Negotiation must determine how bindings expose capability/evidence requirements, target/provider generations and dual-realization cutover without discovery granting authority or provider-current state being confused with effective consumer satisfaction.
