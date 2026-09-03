# Secrets / Configuration / Environment Portability — Revisit 6 (Cycle 7)

## Research question
How should Generation 2 qualify effective secret/configuration state across semantic references, provider generations, delivery mechanisms, consumer cohorts, caches, leases, environment overlays and disconnected Stations so that provider-current state never masquerades as consumer-effective truth, evidence remains non-disclosing, and rotation/provider migration close only after residual consumers are dispositioned?

## Representatives and evidence/source ledger
1. **HashiCorp Vault leases/revocation** — dynamic secrets are lease-bound; renewal/revocation is lifecycle state distinct from the credential value. Vault explicitly documents force-revoke as capable of removing lease bookkeeping even when backend revocation fails, which can leave Vault out of sync with the secret engine.
2. **AWS Secrets Manager rotation/version stages** — `AWSPENDING`, `AWSCURRENT` and `AWSPREVIOUS` encode staged asynchronous rotation; incomplete pending state can block later rotations. Client-side caches refresh on their own horizon and may continue returning older values until refresh.
3. **Kubernetes Secrets** — mounted Secret propagation is asynchronous; `subPath` mounts never receive automated updates. Provider/object generation therefore differs from projection and workload-effective generation.
4. **External Secrets Operator** — `CreatedOnce`, `Periodic` and `OnChange` intentionally produce different propagation semantics; source-current and target-current are distinct, policy-qualified facts.
5. **Azure App Service Key Vault references / Azure App Configuration** — versionless references can follow rotation, but App Service caches Key Vault references and may take up to 24 hours to use a newer version; App Configuration providers can have independent secret-refresh intervals even when the reference URI itself is unchanged.

### Evidence observations
- Vault lease validity has a TTL/renewal horizon independent of semantic secret identity. Force revoke demonstrates that control-plane bookkeeping closure can diverge from backend credential invalidation.
- AWS staging labels separate candidate, current and previous versions; failed/incomplete rotation can leave a pending version that changes the semantics of the next request. AWS client caches introduce a second, consumer-local currentness horizon.
- Kubernetes explicitly separates API-server mutation from projected-volume visibility, with an even stronger divergence for `subPath` consumers that never auto-refresh.
- ESO makes source-to-target propagation conditional on refresh policy, so staleness can be intentional and policy-conformant rather than an error.
- Azure demonstrates that the logical reference may remain stable while the secret value changes and the application-visible realization remains cached for a provider-defined interval; configuration refresh and secret refresh can be independent axes.

## Primitives, source of truth and typed identity
Generation 2 should distinguish at least:
- `SecretOrConfigSemanticReferenceId/Revision`
- `ConfigurationKeyOrOverlayId/Revision`
- `ProviderBindingId/Revision`
- `ProviderSourceVersionOrGenerationId`
- `MaterializationOrProjectionId/Revision`
- `LeaseOrValidityWindowId/Revision`
- `ConsumerEffectiveGenerationId/Revision`
- `ConsumerCohortId/Revision`
- `RefreshOrReloadPolicyId/Revision`
- `RotationOrRevocationAttemptId`
- `EvidenceObservationId/Revision`
- `ResidualUseDispositionId`

A secret **value** is not the same identity as its logical reference, provider version, staging label, lease, mounted file, environment realization or consumer-effective generation. Provider identifiers remain realization/correlation identifiers unless an explicit mapping contract promotes them.

## Applicability-scoped effective qualification
There is no universal `secret-current` or `config-current` fact. Effective qualification is a claim scoped over:
`semantic reference × overlay/environment applicability × provider binding × provider generation × lease/validity × projection/materialization × refresh/reload policy × consumer cohort × observation point × evidence freshness × Station/Role/Person authority`.

A claim that version X is current at the provider can be true while a Kubernetes `subPath` consumer, an AWS cache, an Azure App Service cache or a disconnected Station remains on version W. Those claims are not contradictory because their applicability sets differ.

## Lifecycle and versioning
Portable lifecycle:
`intent/reference → overlay resolution → provider binding → candidate/source generation → provider validation → provider-current designation → projection/materialization → consumer refresh/reload/read → consumer-effective observation → old-generation residual-use analysis → revoke/retire → closure evidence`.

Each transition has its own revision and evidence horizon. Rotation, revocation, refresh and rollout must preserve the last objectively proven transition rather than collapsing to a boolean.

## Failure semantics
- Provider write/rotation acknowledgement loss yields `OUTCOME_UNKNOWN`; observe provider version/stage before retry.
- Vault force-revoke success does **not** prove backend credential invalidation if secret-engine revocation failed; closure remains `PARTIAL/INCONCLUSIVE` until postcondition evidence exists.
- `AWSCURRENT` movement does not prove every consumer refreshed its cache or connection/session.
- Kubernetes API mutation does not prove projected visibility, and `subPath` explicitly prevents automated update.
- ESO `CreatedOnce`/`OnChange` can intentionally leave target material older than source; this is policy-qualified divergence, not necessarily provider failure.
- Azure/App Configuration can retain a stable reference while underlying secret value rotates; refresh interval/cache determines consumer-effective generation.
- Missing consumer-population evidence must not be mapped to PASS.

## Extensibility and provider boundaries
Providers own storage/encryption, version labels, KMS/HSM/wrapping, leases, rotation APIs, refresh/cache mechanisms and concrete delivery adapters. Generation 2 owns portable semantic references, capability requirements, overlay/applicability rules, binding contracts, typed lifecycle, evidence qualification, consumer-effective convergence, residual drainage and provider-substitution closure.

Provider adapters may expose stage labels, leases, watch/poll semantics, mounted files, sidecars, workload identity, cache refresh, version pinning or key-wrap mechanics without making those mechanisms canonical business semantics.

## Governance and authority
Authority remains facet-specific:
`ConfigEdit ≠ SecretReferenceEdit ≠ SecretRead ≠ SecretWrite ≠ Rotate ≠ Revoke ≠ ProviderAdmin ≠ KMS/TrustAdmin ≠ ProjectionAdmin ≠ EnvironmentAdmin ≠ WorkloadReload ≠ Recovery`.

`Enterprise → Station → Role → Person` overlays are attenuation-only. Lower scopes may specialize delegated endpoints, references or refresh policy but cannot weaken superior requirements such as minimum freshness, required trust roots, forbidden providers, non-disclosure, mandatory rotation or environment isolation.

Adaptive Governed Work Surfaces remains a distinct promoted capability. AI may materialize an already-authorized semantic choice but cannot acquire SecretRead, ProviderAdmin, EnvironmentAdmin, KMS/TrustAdmin, Rotate/Revoke or canonical configuration authority through the act of materialization.

## Observability and non-disclosing evidence
Evidence should prove reference/version identity, provider generation, lease/expiry, projection/materialization revision, refresh/reload policy, consumer cohort, observation point, freshness, authority and postcondition without plaintext. Low-entropy values must not be exposed through naive hashes that permit offline guessing.

Evidence has at least two independent horizons:
1. **currentness horizon** — how long an observation can qualify present effective state;
2. **replay/retention horizon** — how long the evidence remains available to verify what was historically true.

Lease TTL, cache TTL, sync interval, rotation stage, audit retention and disconnected duration can all bound these horizons differently.

## Portability, support vectors and lock-in
Portability is a mixed support vector across semantic reference, versioning, lease, KMS/wrapping, rotation, projection, reload, cache invalidation, offline operation, audit evidence, provider migration and residual-revocation semantics. A provider may satisfy secret storage while failing dynamic lease or bounded-refresh requirements.

Lock-in rises when canonical semantics depend directly on Vault lease IDs, AWS staging labels, Kubernetes Secret/mount details, ESO refresh syntax or Azure Key Vault reference/cache behavior. These should remain provider realization facts behind portable contracts.

## Dual-material transition and residual cohort drainage
Provider or generation cutover should follow:
`source effective → target candidate → target provider-valid → target projected → target observed by qualified consumer cohorts → dependency/session acceptance → source residual-use disposition → source revoke/retire`.

Drainage must account for process caches, SDK caches, open DB sessions, mounted files, environment variables, sidecars, disconnected Stations, replicas and any cohort intentionally pinned by policy. Retaining `AWSPREVIOUS` or an old Vault lease can be useful transition support, but neither proves consumer adoption nor closure.

## Qualified offline/local closure
A disconnected Station may retain a bounded closure package containing semantic references, permitted encrypted local material or workload-identity bootstrap, trust revision, binding revision, last-qualified consumer generation, expiry/freshness limits, validators and recovery procedure. It must never become a generic plaintext export.

Reconnect compares superior overlay, trust/KMS, provider binding, rotation/revocation and authority epochs before privileged actuation resumes.

## Product-specific mechanism versus universal primitive
**Product-specific:** Vault lease/force-revoke mechanics; AWS staging labels and SDK cache intervals; Kubernetes watch/cache/poll propagation and `subPath`; ESO refresh policies; Azure Key Vault/App Service cache and App Configuration secret-refresh intervals.

**Universal:** typed semantic/provider/materialization/consumer identities; applicability-scoped qualification; independent currentness/replay horizons; non-disclosing evidence; ambiguous-actuation reconciliation; mixed support vectors; residual consumer drainage; non-amplifying hierarchy; qualified local closure/reconnect requalification.

## Convergent and divergent patterns
Convergence: logical reference differs from value/materialization; provider-current differs from consumer-effective; propagation and caches create independent horizons; rotation has intermediate states; residual consumers survive provider-side changes; value-safe evidence is mandatory.

Divergence: Vault centers lease validity; AWS centers staged versions and application caches; Kubernetes centers projection semantics; ESO centers controller refresh policy; Azure centers reference resolution/caching and independently refreshable secret/config channels. Generation 2 should normalize the boundaries and proof obligations rather than forcing one lifecycle.

## Subcapabilities
Semantic reference and overlay resolution; provider/KMS binding; source-version and lease lifecycle; rotation/revocation; projection/materialization; refresh/reload policy; consumer-effective qualification; non-disclosing evidence; residual-use drainage; provider migration; offline closure/reconnect; authority partitioning.

## SB comparison using evidence only
No new product-code inference is made in this research round. Prior bounded repository searches remain insufficient to prove implementation presence or absence. Concrete SB comparison remains a repository-validation obligation for the later reconciliation phase.

## Reconciliation hypotheses
- **GENERALIZE:** applicability-scoped secret/config qualification and typed semantic/provider/materialization/consumer identities.
- **HARDEN:** provider-current versus consumer-effective evidence, non-disclosing observations and explicit evidence horizons.
- **HARDEN:** reconcile-before-retry for ambiguous rotation/revocation/materialization outcomes.
- **HARDEN:** residual consumer/session/cache/mount/environment cohort drainage before retirement closure.
- **PROVIDERIZE:** lease, stage-label, projection, cache, refresh and KMS/wrapping mechanics.
- **INTEGRATE:** workload identity where it removes stored secret material without changing authority boundaries.
- **DEFER:** provider-specific convenience UX and optimization schedules.
- **DO_NOT_BUILD:** plaintext portability packages, secret values in AI context/AGWS state, or generic `current=true` without applicability/evidence qualification.

## Repo-validation questions
1. Can SB represent semantic reference, provider source version, materialization and consumer-effective generation separately?
2. Are secret/config claims scoped to Station/environment/cohort and observation point, or collapsed to provider-current state?
3. Can evidence prove currentness and rotation without revealing plaintext or guessable fingerprints?
4. Are currentness horizon and historical replay/retention horizon represented independently?
5. Can a provider revocation acknowledgement remain PARTIAL when backend invalidation is unproven?
6. Are refresh/reload policies first-class enough to represent `subPath`, CreatedOnce, application caches and explicit refresh?
7. Can provider migration express mixed support vectors and key-wrap/trust differences?
8. Can dual-secret transition drain sessions, caches, mounts, env realizations and disconnected Stations before source retirement?
9. Are SecretRead, Rotate, Revoke, ProviderAdmin, EnvironmentAdmin, KMS/TrustAdmin and Reload authorities separable?
10. Does reconnect requalify local secret/config closure against superior trust/binding/revocation/overlay epochs?

## Symbiotic Proof
A semantic database credential is rotated in AWS Secrets Manager and `AWSCURRENT` advances. Connected workloads include an SDK cache, a Kubernetes projected volume and a `subPath` mount; one Station is disconnected. Generation 2 records provider-current success but reports consumer-effective qualification as `PARTIAL`: the SDK cache has not crossed its refresh horizon, the ordinary projected volume has updated, the `subPath` workload remains old by mechanism, and the disconnected Station is outside current observation coverage. No plaintext enters evidence. The old generation is retained only as policy permits while sessions/caches/mounts are drained. Later the binding migrates to Vault; a force-revoke response is not accepted as backend invalidation proof unless postcondition evidence confirms the credential is unusable. Reconnect requalifies trust/binding/revocation state before privileged use. AGWS can materialize a permitted binding choice but cannot read, rotate, revoke or administer the provider.

## Stable findings
- **G2-FINDING-SCEP-46 — Effective Secret/Configuration Truth Is an Applicability-scoped Qualification Claim.** `current` is meaningful only over semantic reference, overlay/environment, provider binding/generation, lease, materialization, refresh policy, consumer cohort, observation point, evidence freshness and delegated scope.
- **G2-FINDING-SCEP-47 — Secret Value, Logical Reference, Provider Version, Materialization and Consumer-effective Generation Require Separate Typed Identity.** Stable references can outlive many values and consumer realizations; provider IDs do not become canonical semantic IDs implicitly.
- **G2-FINDING-SCEP-48 — Consumer-effective Currentness Depends on Delivery/Refresh Mechanism and Qualified Population.** Kubernetes `subPath`, ESO refresh policies, AWS caches and Azure reference caches prove that provider-current cannot establish consumer-current without mechanism/cohort evidence.
- **G2-FINDING-SCEP-49 — Secret/Configuration Evidence Has Independent Currentness and Historical Replay Horizons.** Lease/cache/sync intervals bound present qualification while audit/evidence retention bounds later replay; neither horizon substitutes for the other.
- **G2-FINDING-SCEP-50 — Rotation/Revocation Control-plane Closure Does Not Prove Backend or Consumer Postconditions.** Vault force-revoke can remove lease bookkeeping despite backend revocation failure; ambiguous provider acknowledgement requires observation and reconcile-before-retry.
- **G2-FINDING-SCEP-51 — Secret/Configuration Portability Is a Mixed Provider/KMS/Delivery/Runtime Support Vector.** Storage compatibility alone cannot prove lease, rotation, refresh, wrapping, offline, evidence or residual-revocation equivalence.
- **G2-FINDING-SCEP-52 — Rotation and Provider Cutover Close Only After Residual Consumer/Session/Cache/Mount/Environment Cohorts Are Drained or Dispositioned.** Previous-version retention or provider revocation is not consumer-adoption proof.
- **G2-FINDING-SCEP-53 — Qualified Local Secret/Configuration Closure and AGWS/AI Materialization Are Non-amplifying.** Local validity is horizon-bounded and reconnect-qualified; `Enterprise → Station → Role → Person` plus AI materialization cannot mint secret-read, provider/environment/KMS admin, rotation/revocation or canonical authority.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-SCEP-APPLICABILITY-SCOPED-EFFECTIVE-SECRET-CONFIG-QUALIFICATION-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability claims while Secrets retains materialization/refresh/consumer semantics.
- `G2-CAPABILITY-CANDIDATE-SCEP-SECRET-CONFIG-EVIDENCE-CURRENTNESS-REPLAY-HORIZON` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with universal evidence horizons while preserving lease/cache/sync/non-disclosure constraints.
- `G2-CAPABILITY-CANDIDATE-SCEP-MIXED-PROVIDER-KMS-DELIVERY-RUNTIME-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; preserve independent provider, KMS/wrapping, lease, rotation, projection, refresh, offline and evidence axes.
- `G2-CAPABILITY-CANDIDATE-SCEP-SECRET-CONFIG-CONSUMER-SESSION-CACHE-MOUNT-ENV-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Secrets owns residual material-consumption closure across generations/provider migration.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces remains promoted and distinct from generic UI.

## Architecture proof-backfill obligations
1. Provider-current with stale cache or `subPath` consumer must remain PARTIAL.
2. Stable semantic reference with changed provider value must preserve separate provider/materialization/consumer generations.
3. Expired currentness evidence with retained historical evidence must not qualify present state but must remain replayable historically.
4. Missing historical evidence must make replay unavailable without rewriting the earlier qualified result.
5. Vault force-revoke without backend invalidation proof must not satisfy revocation closure.
6. Lost rotation/materialization acknowledgement must reconcile observed stage/generation before retry.
7. ESO CreatedOnce/OnChange divergence must be represented as policy-qualified, not flattened to stale/error.
8. Provider migration must reject unsupported KMS/lease/refresh/evidence axes even if simple secret storage is available.
9. Cutover must prove target consumer-effectiveness before source retirement and disposition residual sessions/caches/mounts/env consumers.
10. Lower Station/Role/Person configuration must not weaken Enterprise non-disclosure, freshness, trust or provider constraints.
11. Offline Station beyond expiry/trust/revocation horizon must degrade/fail according to profile.
12. Reconnect must requalify superior overlay/trust/binding/revocation state before privileged actuation.
13. AGWS/AI materialization must not expose plaintext or acquire SecretRead/Rotate/Revoke/ProviderAdmin/EnvironmentAdmin/KMSAdmin/Reload authority.

## Value / risk / priority / next question
**Value:** critical for autonomous/self-hosted runtime, safe provider substitution, hierarchical Station operation and zero-plaintext governance.
**Risk:** very high; collapsing provider-current to workload-current or accepting control-plane revocation as postcondition can leave stale credentials active while the platform reports success.
**Priority:** P0 cross-cutting.
**Next question:** how should Provider / Binding / Capability Negotiation express applicability-scoped requirement→offer→binding→realization qualification, mixed support vectors, trust/consent and residual consumer drainage without treating provider acceptance as effective satisfaction?

**Revisit result:** MATERIAL_NEW_FINDINGS. Consecutive eligible revisits without material finding = 0. **NOT SATURATED**.