# Secrets / Configuration / Environment Portability — Revisit 4 (Cycle 5)

## Research question
How should Generation 2 prove that semantic configuration and secret references remain portable while concrete secret generations, leases, trust/bootstrap material and environment/Station overlays rotate, fail, coexist or migrate — without equating provider-side rotation with workload-effective consumption or allowing lower-scope overlays, AI or work surfaces to amplify authority?

## Representatives and evidence ledger
1. **HashiCorp Vault** — dynamic secrets are lease-bound; lease renewal can change TTL without changing secret contents; revocation may fail and become irrevocable; moving a secrets engine revokes prior leases and has namespace/policy/identity post-move consequences. Official Vault docs are the evidence authority.
2. **AWS Secrets Manager** — rotation explicitly stages `AWSPENDING`, tests the candidate, then moves `AWSCURRENT`, retaining `AWSPREVIOUS`; secret versions and staging labels are separate concepts. Official AWS Secrets Manager docs are the evidence authority.
3. **Kubernetes Secrets / projected credentials** — Secret objects may be immutable; mounted Secret updates have delivery caveats such as `subPath`; projected ServiceAccount tokens are short-lived and automatically rotated, illustrating that object revision and workload-visible material are distinct. Official Kubernetes docs are the evidence authority.
4. **SPIFFE/SPIRE (carried forward)** — stable workload identity is distinct from short-lived SVID credential material and trust bundle state. Official SPIFFE/SPIRE material remains authoritative from prior coverage.

## Primitives / source of truth / identity
The portable semantic subjects are `ConfigurationIntentRevision` and `SecretReferenceRevision`. Realization subjects are separate: `SecretGenerationRevision`, `CredentialLeaseRevision`, `TrustBundleRevision`, `ProviderBindingRevision`, `EnvironmentOverlayRevision`, `WorkloadConsumptionEvidence`, and `EffectiveRuntimeConfigurationEvidence`.

Provider path, version id, staging label, Kubernetes resourceVersion/name, lease ID, SVID serial, encryption key identifier and local cache slot are realization metadata, not canonical semantic identity.

## Lifecycle and versioning
A generalized lifecycle is:
`semantic intent/reference → expected-base validation → overlay resolution → authority/admission → provider binding → candidate generation/materialization → provider-side validation → publish/current designation → workload projection/reload → workload-effective validation → retirement/revocation of prior generation → residual-in-use reconciliation → closure evidence`.

AWS Secrets Manager makes candidate/current/previous stages explicit. Kubernetes demonstrates that provider/object mutation does not guarantee immediate workload adoption. Vault demonstrates that revoke/expiry intent and actual external invalidation can diverge.

## Failure semantics
- Provider rotation success does **not** prove all workloads consume the new generation.
- Provider-side `current` designation does **not** prove old material is absent from processes, files, caches or disconnected Stations.
- Revocation acknowledgement, expiry or delete intent does not prove residual consumers stopped using the old credential.
- A Secret/config object revision can be newer than workload-visible state; unavailable refresh/reload evidence yields `PARTIAL` or `INCONCLUSIVE`.
- Ambiguous provider write/rotation outcomes require reconciliation against version/generation state before retry.
- Missing trust root, decryption key, identity bootstrap, provider binding, expected-base revision or required higher-scope overlay must fail closed for protected dimensions rather than silently falling back.

## Extensibility / provider boundaries
Providers own encryption, storage, generation, lease/version identifiers, rotation mechanics and retrieval APIs. Generation 2 owns portable references, binding requirements, qualified evidence, authority boundaries and migration semantics.

Provider replacement should support explicit dual-read/dual-realization where policy permits, but dual-read is not automatic authorization to expose both secret values. Cutover is complete only after effective consumers are qualified on the target realization and residual-in-use state for the source is dispositioned.

## Governance / concurrency / ownership
Mutable config/secret definitions require expected-base or equivalent ownership/precondition semantics. `ConfigurationEditAuthority ≠ SecretReadAuthority ≠ SecretWriteAuthority ≠ RotationAuthority ≠ RevocationAuthority ≠ TrustAdministrationAuthority ≠ ProviderAdministrationAuthority ≠ WorkloadReloadAuthority`.

Enterprise→Station→Role→Person overlays may specialize only delegated dimensions. Higher invariants such as forbidden endpoint classes, mandatory trust anchors, minimum rotation policy and secret non-disclosure cannot be weakened by lower overlays.

## Observability and evidence qualification
Evidence should include semantic subject/revision, provider/binding revision, generated version or lease, environment/Station, observation point, workload/cohort identity, observation time, freshness window, trust revision and coverage. Positive evidence must state what was actually observed: provider accepted, provider current, mounted/projected, process reloaded, dependency authenticated, or previous generation no longer observed.

Non-disclosure evidence must prove metadata/provenance without recording secret plaintext. Missing workload coverage or unknown residual consumers must produce `PARTIAL/INCONCLUSIVE`, not implicit success.

## Portability / local / offline / air-gapped closure
A qualified closure is operation-scoped. It may include portable references/config definitions, encrypted permitted material, trust/bootstrap state, provider/binding descriptors, last-qualified effective generation, freshness/expiry metadata, reload/recovery procedures and validators. It must not be a bulk export of central plaintext secrets.

Disconnected operation must distinguish locally available, cryptographically decryptable, provider-valid, policy-valid and workload-effective. These can diverge. Reconnection requires requalification against current trust, revocation, overlay and generation state before stale local material is accepted as current.

## Lock-in
Lock-in rises when portable semantics depend on provider path syntax, staging-label names, Kubernetes Secret names, cloud KMS identifiers, environment-variable conventions or provider-specific rotation assumptions. Portable contracts should express semantic references, required capabilities and evidence profiles while adapters own realization details.

## Product-specific mechanism versus universal primitive
**Product-specific:** Vault lease IDs/remounts, AWS staging labels, Kubernetes Secret projection/update behavior, SPIFFE SVID formats.

**Universal:** generation identity distinct from semantic reference; expected-base mutation; candidate/current/retired generation lifecycle; workload-effective consumption evidence; residual-in-use disposition; qualified non-disclosure evidence; governed provider dual-read/cutover; qualified local closure.

## Convergent / divergent patterns
Convergence: provider version/generation state is distinct from semantic identity; credential material has a lifecycle independent from the reference; rotation requires validation; effective runtime state is weaker/stronger depending on observation point; stale/partial state must be explicit.

Divergence: Vault emphasizes leased dynamic credentials, AWS Secrets Manager staged secret versions, Kubernetes object projection and workload delivery, and SPIFFE workload identity with short-lived credentials. Generation 2 should not force one lifecycle but should normalize their evidence and transition boundaries.

## Subcapabilities
Semantic config/secret references; immutable/mutable config policy; overlay resolution; expected-base ownership; secret generation/version lifecycle; workload projection/reload; residual-in-use tracking; trust/bootstrap/key dependencies; rotation/revocation; provider binding/migration; non-disclosure audit evidence; local/offline closure and requalification.

## SB comparison
No repository-wide product claim is made without targeted main-branch archaeology. Repo validation remains a later evidence task for precise questions about existing semantic references, binding abstractions, runtime-effective config evidence and rotation/reload semantics.

## Reconciliation hypotheses
- **GENERALIZE:** secret/config semantic identity independent of provider generation/material.
- **HARDEN:** expected-base ownership and revision-bound overlays.
- **HARDEN:** provider-current versus workload-effective consumption and residual-in-use evidence.
- **PROVIDERIZE:** provider version/lease/rotation/encryption mechanics.
- **INTEGRATE:** workload identity where it reduces stored credential exposure.
- **HARDEN:** dual-read/cutover/revocation transitions with qualified postconditions.
- **DEFER:** provider-commercial optimizations and provider-specific operational tuning.
- **DO_NOT_BUILD:** plaintext secret replication into portable definitions, findings, AGWS state or AI context.

## Repo-validation questions
1. Does current SB model separate semantic secret/config reference, provider version/generation and workload-effective consumption?
2. Are mutations guarded by expected-base revision or equivalent ownership/preconditions?
3. Can environment/Station overlays be resolved without lower scopes weakening higher invariants?
4. Can rotation distinguish provider-current from workload-reloaded/effective and residual-in-use old generations?
5. Can provider replacement coexist temporarily without leaking both secret realizations or changing canonical semantics?
6. Are secret-safe audit records capable of proving version/freshness/coverage without plaintext?
7. Can local/offline runtime requalify cached material after reconnection against trust, revocation and overlay changes?

## Symbiotic Proof
A generated system rotates an AWS-backed database credential while one Station is disconnected and another workload uses a Kubernetes-mounted realization. The new generation is staged/tested/current at the provider, but the system does not declare completion until connected workloads show effective consumption, stale cohorts are explicit, the disconnected Station remains bounded by its qualified closure, and the retired generation's residual-in-use state is reconciled. A later migration to Vault or workload identity changes provider realization without changing portable business semantics. AGWS and AI may propose/materialize permitted binding or overlay changes but cannot read secret plaintext, weaken higher invariants or grant themselves rotation/provider-admin authority.

## Stable findings
- **G2-FINDING-SCEP-30 — Secret/Configuration Rotation Has Separate Candidate, Provider-current, Workload-effective and Retired-generation States.** Provider-side completion is not runtime-effective completion.
- **G2-FINDING-SCEP-31 — Old Secret Material Requires Residual-in-use Disposition; Revocation/Expiry Alone Cannot Prove Consumer Cessation.** Processes, mounts, caches and disconnected Stations can outlive provider transitions.
- **G2-FINDING-SCEP-32 — Effective Secret/Configuration Evidence Must Be Qualified by Consumer/Cohort, Generation, Trust, Freshness and Coverage.** Missing consumers or reload evidence yield PARTIAL/INCONCLUSIVE.
- **G2-FINDING-SCEP-33 — Mutable Configuration and Secret-reference Changes Require Expected-base or Equivalent Ownership Preconditions.** Concurrent/stale mutation must not silently overwrite a newer semantic or overlay revision.
- **G2-FINDING-SCEP-34 — Environment/Station Overlay Resolution Must Preserve Higher Non-weakenable Invariants Across Revision Changes.** Lower scopes can specialize delegated values, not weaken trust, disclosure, endpoint or rotation policy.
- **G2-FINDING-SCEP-35 — Secret Non-disclosure Is Itself an Evidence Constraint: Audit, AI and AGWS May Prove Metadata/Lineage Without Receiving Plaintext.** Observability cannot become a secret-exfiltration path.
- **G2-FINDING-SCEP-36 — Provider Replacement Needs Governed Dual-realization/Cutover Plus Consumer-effective and Residual-source Evidence.** Provider reachability or target-current state alone is insufficient.
- **G2-FINDING-SCEP-37 — Local/Offline Secret Closure Is Operation-scoped and Must Requalify on Reconnection Against Trust, Revocation, Overlay and Generation State.** Local availability is never equivalent to globally current validity.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-SCEP-WORKLOAD-EFFECTIVE-SECRET-GENERATION-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; merge with unified effective-realization evidence while retaining Secrets ownership of material-consumption semantics.
- `G2-CAPABILITY-CANDIDATE-SCEP-RESIDUAL-IN-USE-GENERATION-DISPOSITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Lifecycle/Security governed retirement and ambiguous-outcome disposition.
- `G2-CAPABILITY-CANDIDATE-SCEP-SECRET-SAFE-NONDISCLOSURE-EVIDENCE-PROFILE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; Governance/Observability/AI must consume without secret plaintext.
- `G2-CAPABILITY-CANDIDATE-SCEP-GOVERNED-DUAL-REALIZATION-CUTOVER` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Provider Binding and universal migration transition.

No candidate is promoted in this revisit.

## Architecture proof-backfill obligations
1. Rotation provider-success while one workload still consumes old generation must not PASS effective state.
2. Missing cohort/reload telemetry must yield PARTIAL/INCONCLUSIVE.
3. Stale expected-base overlay mutation must be rejected or explicitly reconciled.
4. Person/Role/Station overlay must fail if it weakens an Enterprise non-disclosure/trust invariant.
5. Audit/AI/AGWS evidence path must prove lineage without exposing secret plaintext.
6. Dual-provider cutover must retain semantic identity and show target-effective consumers before source retirement.
7. Revocation failure or residual old consumer must remain visible after provider current changes.
8. Offline Station with expired/revoked/stale trust material must degrade/fail according to profile.
9. Reconnection must trigger requalification before stale local generation is promoted current.
10. Provider/API success without workload-effective evidence must remain non-authoritative for completion.

## Value / risk / priority / next question
**Value:** critical for runtime autonomy, self-hosting, provider neutrality and safe Station operation. **Risk:** critical because false rotation completion, stale generations or plaintext leakage can become direct security failures. **Priority:** highest cross-cutting tier. **Next question:** Provider / Binding / Capability Negotiation must determine how multiple secret/config realizations are discovered, negotiated and cut over without discovery granting authority, without weakening required evidence profiles and without confusing provider-current with effective consumer satisfaction.
