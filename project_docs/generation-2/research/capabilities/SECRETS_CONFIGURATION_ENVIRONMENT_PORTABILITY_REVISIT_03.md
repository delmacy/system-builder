# Secrets / Configuration / Environment Portability — Revisit 3 (Cycle 4)

## Research question
How should Generation 2 separate semantic configuration/secret intent from provider materialization, credential leases, runtime observation and environment overlays while preserving portability, rotation/revocation, offline recovery and non-amplifying Enterprise→Station→Role→Person authority?

## Representatives and evidence ledger
1. **HashiCorp Vault** — dynamic secrets carry leases, TTL, renewal and revocation; revocation can fail and become operationally unresolved; moving a secrets engine revokes old leases and requires target namespace policy/identity consideration. Source of truth: official Vault concepts/commands/validated designs.
2. **SPIFFE/SPIRE** — stable workload identity is expressed by SPIFFE ID while short-lived SVIDs are material credentials issued through the Workload API; registration entries/selectors govern which workload may receive identity material. Source of truth: official SPIFFE/SPIRE docs.
3. **Kubernetes Secrets / external secret-store integration** — Secret objects are distinct from workloads, require encryption/RBAC protections, may be projected to workloads, and external stores can be integrated through volume mechanisms; bound service-account credentials reduce long-lived secret use. Source of truth: Kubernetes security and Secret documentation.
4. **Vault Proxy persistent cache** — cached tokens/leases/static secrets can survive proxy restart, but direct revocation outside the proxy can leave stale cache entries, demonstrating that local material availability is not freshness proof. Source of truth: official Vault Proxy docs.

## Source of truth / identity
Generation 2 should distinguish `ConfigurationIntentRevision`, `SecretReferenceRevision`, `CredentialLease/MaterializationRevision`, `EnvironmentOverlayRevision`, `EffectiveRuntimeConfigurationRevision` and `ObservedConfigurationEvidence`. Provider path/name/version/lease ID is realization evidence, not the portable semantic identity.

SPIFFE strengthens a related distinction: workload identity can remain stable while concrete X.509/JWT SVID material rotates. Vault similarly separates a role/secret source from individual leased credentials.

## Lifecycle and versioning
A portable lifecycle is: intent/reference declaration → policy/authority validation → environment/Station overlay resolution → provider binding → materialization/lease issuance → workload projection → runtime observation → renewal/rotation/revocation → postcondition evidence. Rotation does not rewrite semantic identity; revocation does not erase issuance history.

## Failure semantics
- Materialization success does not prove workload consumption.
- Lease expiry/revocation intent does not prove provider-side invalidation: Vault documents irrevocable leases when backend communication prevents revocation.
- A local cache hit does not prove freshness: Vault Proxy can retain stale entries when revocation occurs outside its observation path.
- Missing provider, trust root, policy, decryption material or qualified cached revision yields explicit unavailable/stale/inconclusive state, never implicit fallback to a weaker secret/config source.

## Extensibility and provider boundaries
Secret/config providers implement realization contracts. Provider replacement must not change portable references silently and must follow governed transition evidence: `Plan → Validation → Approval → Attempt → Cutover → PostconditionEvidence`. Provider-specific lease IDs, mount paths, Kubernetes Secret names, CSI handles and SVID serials remain realization metadata.

## Governance and authority
`ConfigurationAuthoringAuthority ≠ SecretReadAuthority ≠ CredentialIssuanceAuthority ≠ RotationAuthority ≠ RevocationAuthority ≠ ProviderAdministrationAuthority`.

Enterprise→Station→Role→Person overlays are monotonic in authority: lower layers may specialize only declared configuration dimensions and cannot expose a secret, credential, endpoint or capability forbidden above. Sensitive values should normally remain references/materializations rather than copied into portable definitions, audit packages or generated UI.

## Observability and evidence qualification
Evidence should identify semantic subject/revision, provider realization, environment/Station scope, lease/material revision, observation time, freshness profile, coverage and trust. Revocation requires postcondition evidence; an API acknowledgement is insufficient when downstream revocation can fail. Audit evidence records references/status without secret plaintext.

## Portability / local and air-gapped closure
A qualified local closure may contain portable configuration definitions, provider/binding descriptors, encrypted or hardware-bound secret material where policy permits, trust roots, workload identity/bootstrap material, policy snapshots, last-qualified revision/freshness metadata, recovery procedures and validators. It must never mean exporting all central secrets. Closure qualification is profile- and authority-scoped.

Offline operation must distinguish `available locally` from `currently valid`. Expired leases, stale cached material, revoked trust, missing freshness evidence or incomplete provider closure become explicit degraded/inconclusive states.

## Lock-in
Lock-in rises when semantic definitions embed Vault paths, cloud secret IDs, Kubernetes names, provider-specific environment syntax or credential lifecycle assumptions. Portable definitions should bind to semantic secret/config references and capability contracts; realization adapters own provider identifiers.

## Product-specific mechanisms vs universal primitives
**Product-specific:** Vault leases/mounts/namespaces, SPIFFE SVID formats and Workload API, Kubernetes Secret/CSI projection.

**Universal candidates:** revision-bound semantic reference vs material realization; lease/credential lifecycle evidence; qualified freshness; governed provider migration; authority-separated rotation/revocation; qualified local closure.

## Convergent patterns
- Stable semantic/workload identity is distinct from short-lived credential material.
- Rotation and revocation are lifecycle transitions, not edits to history.
- Provider/local-cache success is weaker than qualified effective-runtime evidence.
- Secret/config portability requires references and binding abstraction rather than copying provider material.
- Offline closure must be explicitly scoped and freshness-qualified.

## Divergent patterns
Vault actively manages dynamic credential leases; Kubernetes Secrets are general confidential objects with different lifecycle guarantees; SPIFFE attempts to eliminate many static credentials through workload identity. Generation 2 should preserve these as interchangeable realization strategies where semantics permit, not force a single credential model.

## Subcapabilities
Semantic configuration references; sensitive-value references; environment/Station overlays; workload identity bootstrap; credential issuance/lease lifecycle; rotation/revocation; provider binding; runtime materialization/projection; freshness/observation; encrypted local closure/recovery; secret-safe audit evidence.

## Adaptive Governed Work Surfaces boundary
AGWS remains distinct. Effective surfaces resolve `Enterprise → Station → Role → Person`; a Person overlay may choose only configuration options delegated by higher layers. AI may materialize a permitted reference/binding change, but a request requiring new secret access, credential issuance, provider administration, endpoint exposure or weaker policy must produce escalation. Components never receive secret plaintext merely because their renderer/action provider can technically request it.

## SB comparison
No repository-wide absence claim is made in this revisit. Fresh-main comparison is deferred to targeted repository archaeology when a precise contract/file question is required; research-branch artifacts are not treated as product truth.

## Reconciliation hypotheses
- **GENERALIZE:** semantic config/secret references independent of provider realization.
- **HARDEN:** freshness-qualified runtime observation and explicit stale/inconclusive semantics.
- **PROVIDERIZE:** Vault/Kubernetes/cloud secret stores/SPIFFE-style identity realization behind capability bindings.
- **INTEGRATE:** workload identity as preferred credential-elimination strategy where supported.
- **HARDEN:** governed rotation/revocation/provider-transition evidence.
- **DEFER:** commercial pricing/rating ownership; this capability only emits measurable operational factors.
- **DO_NOT_BUILD:** generic plaintext secret replication into portable definitions or AGWS.

## Repo-validation questions
1. Does main already distinguish semantic secret/config references from provider identifiers and material values?
2. Can bindings rotate provider/credential realization without mutating canonical application semantics?
3. Is effective runtime configuration revision observable and evidence-qualified?
4. Are revocation/rotation attempts and postconditions represented separately?
5. Can generated runtimes bootstrap self-hosted/offline without Builder availability while preserving secret policy?
6. Can Station/Role overlays specialize configuration without acquiring secret/provider authority?

## Symbiotic Proof
A generated system moves from Vault-backed dynamic credentials to SPIFFE workload identity plus an external secret store without changing portable business/application semantics. During coexistence, old leased credentials and new workload identity realizations are revision-bound; cutover is validated and approved; revocation failures remain visible; a disconnected Station can run only with its qualified local closure; AGWS can consume the capability without seeing provider identifiers or secret plaintext.

## Stable findings
- **G2-FINDING-SCEP-23 — Semantic Secret/Configuration Identity Must Be Separate from Credential and Provider Realization.** Portable references survive provider path, lease, SVID and Kubernetes Secret realization changes.
- **G2-FINDING-SCEP-24 — Workload Identity Can Eliminate Stored Credentials Without Becoming Authorization Semantics.** SPIFFE-style identity proves/realizes workload identity; permission remains separately governed.
- **G2-FINDING-SCEP-25 — Rotation/Revocation Intent Requires Postcondition Evidence; Acknowledgement or TTL Alone Is Insufficient.** Backend failures and irrevocable leases make revocation a governed transition with observable completion/failure.
- **G2-FINDING-SCEP-26 — Local Secret Availability Is Not Freshness or Validity Proof.** Persistent caches can contain stale material; offline/local execution needs revision/freshness/trust qualification and explicit degraded states.
- **G2-FINDING-SCEP-27 — Environment and Station Configuration Overlays Must Be Non-Amplifying and Revision-Bound.** Lower overlays specialize delegated dimensions but cannot reveal secrets, endpoints or capabilities prohibited above.
- **G2-FINDING-SCEP-28 — Secret/Configuration Provider Replacement Must Use a Governed Transition Rather Than Identifier Substitution.** Migration needs validation, approval, coexistence/cutover semantics and postcondition evidence.
- **G2-FINDING-SCEP-29 — Qualified Local Configuration/Secret Closure Is Selective, Encrypted, Authority-Scoped and Recoverable.** Air-gapped closure contains only material necessary and permitted for the profile, with trust/freshness/recovery metadata.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-SECRET-CONFIG-SEMANTIC-REALIZATION-REVISION-EVIDENCE` — CROSS_CUTTING / MERGE_TARGET into unified revision-bound realization evidence.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-CREDENTIAL-ROTATION-REVOCATION-EVIDENCE` — CROSS_CUTTING / CANDIDATE; Security/Lifecycle should determine consolidation with shared governed transition.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-SECRET-CONFIG-RECOVERY-CLOSURE` — CROSS_CUTTING / MERGE_TARGET into qualified local closure.
- `G2-CAPABILITY-CANDIDATE-NON-AMPLIFYING-ENVIRONMENT-STATION-CONFIG-OVERLAY` — CROSS_CUTTING / CANDIDATE; Provider/Authorization/AGWS should confirm ownership.

## Value / risk / priority / next question
**Value:** very high for provider-neutrality, self-hosting and runtime autonomy. **Risk:** critical if semantic definitions leak provider credentials or if stale/revoked material is treated as valid. **Priority:** high. **Next question:** Provider / Binding / Capability Negotiation should test whether secret/config realization, workload identity and Station exposure can be negotiated without allowing discovery or binding to grant authority.
