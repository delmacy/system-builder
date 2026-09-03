# Generation 2 Research — Extension / Plugin / Marketplace Architecture — Revisit 6 / Cycle 7

## Research question
What additional universal constraints appear when extension admission, permission, update, activation and provider substitution are treated as applicability-scoped claims rather than a single installed/trusted flag, especially under mixed versions, runtime-granted permissions, active sessions and delegated Station governance?

This revisit is research-by-exception. It preserves all prior findings and targets only material gaps against cycle-7 proof themes.

## Representatives and evidence/source ledger

| Representative | Evidence | Contribution | Coverage |
|---|---|---|---|
| Chrome Extensions Manifest V3 | official permission and update-lifecycle docs | required vs optional runtime permissions; host-scoped authority; update download vs effective installation; version pinning and delayed uptake | DEEP |
| VS Code Extensions | official extension runtime security + publisher/workspace trust docs | extension host blast radius; publisher trust distinct from runtime capability; workspace trust as applicability context | DEEP |
| Kubernetes admission webhooks | official dynamic-admission + good-practice docs | fail-open/fail-closed semantics; reinvocation/idempotence; dependency loops; control-path recovery | DEEP |
| Backstage plugin architecture | official frontend/backend architecture docs | plugin identity/discovery; backend isolation and network-only communication; package discovery vs runtime wiring | DEEP |
| Prior Generation-2 extension research | authoritative revisit 5 and historical dossiers | typed lifecycle, provenance, residual use, providerization, offline closure | DEEP |

## New evidence synthesis
Chrome separates permissions requested in the manifest from optional permissions granted later at runtime; host permissions can be narrower than API permission and may change with user consent. Therefore package installation does not prove the effective capability set for a given user, host, Station or session. Chrome's update lifecycle further separates downloaded update from effective installation: a new version can wait for the extension to become idle, and enterprise policy can pin an older version. A marketplace therefore cannot infer effective deployed revision merely from latest-published metadata.

VS Code documents that extensions run with the same operating permissions as VS Code itself and can read/write files, use the network and run processes. Publisher trust helps with acquisition trust, but it is not a sandbox or least-authority grant. Workspace trust adds another applicability boundary: the same installed extension may be allowed, restricted or unsuitable depending on workspace context.

Kubernetes continues to provide the adversarial control-path model: invocation failure and explicit rejection are semantically distinct; mutating webhooks may be reinvoked and must be idempotent; broad admission hooks can create dependency loops that break their own recovery path. Backstage supplies the contrasting architecture: backend plugins are independently identified and communicate over network boundaries, while frontend feature discovery can automatically discover package dependencies. Discovery/install convenience is therefore not equivalent to execution authority or isolation guarantee.

## Primitives and typed identity
Do not collapse:

`ExtensionConceptId → PackageRevisionId → ManifestRevisionId → Publisher/ProvenanceEvidenceId → CapabilityRequestId → CapabilityGrantRevisionId → InstallAttemptId → InstalledRevisionId → ActivationAttemptId → RuntimeInstanceId → RuntimePermissionLease/ConsentId → EffectiveCapabilitySetId → UpdateCandidateId → EffectiveUpdateRevisionId → RevocationId → ResidualCohortDispositionId`.

Marketplace listing, latest-version metadata and package availability are discovery/distribution evidence only.

## Source of truth
No single source owns the whole fact. Package/provenance source owns bytes and publisher evidence; host owns compatibility/runtime realization; authorization/governance owns grants; user/Station policy may own optional consent or exposure; runtime observation owns effective instance/version; marketplace owns catalog/distribution metadata only. Effective extension state is a composed, revision-qualified claim.

## Lifecycle and versioning
A stronger lifecycle is:

`DISCOVERED → ACQUIRED → VERIFIED → COMPATIBILITY_EVALUATED → ADMISSION_DECIDED → INSTALLED → ACTIVATION_ATTEMPTED → RUNTIME_OBSERVED → CAPABILITY_EFFECTIVE → HEALTH_QUALIFIED`.

Update is separate:

`UPDATE_AVAILABLE → ACQUIRED/VERIFIED → UPDATE_ADMITTED → STAGED → EFFECTIVE_ON_COHORT | DEFERRED | PINNED | PARTIAL | OUTCOME_UNKNOWN`.

Effective qualification requires a vector over package/manifest, host/API/protocol, dependency closure, grant/consent, workspace/Station scope, trust/provenance, runtime generation, provider, marketplace/distribution source and observation horizon.

## Failure semantics
First-class states include `REJECTED`, `FAILED`, `PARTIAL`, `DEFERRED`, `PINNED`, `OUTCOME_UNKNOWN`, `INCOMPATIBLE`, `QUARANTINED`, `DRAINING`, `RESIDUAL_USE`, `STALE_EVIDENCE` and `INCONCLUSIVE`.

A downloaded update that is not yet activated is not a successful update. A permission request that was once granted but has since been revoked or is host/workspace-inapplicable is not an effective capability. Ambiguous install/update/activation acknowledgement requires reconcile-before-retry against observed installed/runtime revision and expected base.

## Extensibility, sandbox and provider boundaries
Sandbox/isolation is a support axis, not an assumption. VS Code demonstrates a high-authority in-process-style extension host boundary; Backstage backend plugins demonstrate network-isolated plugin communication. SB must therefore describe containment capability explicitly rather than label all mechanisms `plugin`.

Providerize marketplace/catalog, package transport, signature service, host runtime, sandbox/process/WASM mechanism and discovery implementation. Keep universal: typed manifest/capability requests, admission, effective grants, compatibility, activation/update/revocation lineage, residual-cohort closure and proof requirements.

## Governance and authority
`installed`, `signed`, `publisher trusted`, `workspace trusted`, `marketplace approved` and `capability granted` are different claims. None may mint another by implication.

`Enterprise → Station → Role → Person` remains attenuating. Station exposure can select among Enterprise-admitted capabilities but cannot become publisher-trust admin, marketplace admin, provider admin, deployment/recovery authority or canonical process/domain authority. AGWS/AI can propose or compose only within already-delegated extension capabilities.

## Observability
Expected-population evidence must include intended extension revision/cohort, actually running revision, runtime instance identity, effective grants/consent, workspace/Station applicability, update state and residual old-version sessions/hooks/caches. A provider dashboard showing package installed is insufficient proof of effective activation or complete cutover.

## Portability / lock-in
Portability is a mixed support vector: package format, host contract, capability model, isolation, runtime lifecycle, state migration, update semantics, offline verification, catalog/distribution and observability may each be supported differently. Provider/runtime substitution closes only after old runtime instances, sessions, caches, hooks, granted leases and consumers are drained or explicitly dispositioned.

## Product-specific mechanism vs universal primitive
Product-specific: Chrome manifest keys and idle update trigger; VS Code extension host/workspace trust UX; Kubernetes `failurePolicy`/`reinvocationPolicy`; Backstage feature discovery and backend plugin packaging.

Universal: applicability-scoped effective extension claim; typed requested/granted/effective capability lineage; effective update/cohort state; containment profile; evidence replay horizon; mixed-support vector; residual-cohort drainage; reconcile-before-retry.

## Convergent and divergent patterns
Convergent: package metadata differs from effective runtime state; permissions/trust are multi-stage; runtime revision can lag publication; compatibility and authority are independent; residual old cohorts matter during update/cutover.

Divergent: authority ranges from host-equivalent to network-isolated; update activation can be immediate, idle-gated or admin-pinned; permissions may be static, runtime-consented or policy-derived; marketplaces may be central, private or absent.

## Subcapabilities
- typed extension/package/manifest/runtime identity
- capability request/grant/effective-set lineage
- applicability-scoped admission and activation
- update cohort/currentness management
- containment/sandbox support profile
- provenance/review replay horizon
- marketplace/catalog governance boundary
- provider/runtime substitution and residual drainage
- offline/air-gapped closure and reconnect requalification

## Reconciliation hypotheses
- **GENERALIZE** applicability-scoped extension qualification and revision/evidence horizons with UCA.
- **HARDEN** requested→granted→effective capability lineage and update-cohort evidence.
- **PROVIDERIZE** catalog, package transport, host runtime, sandbox and discovery mechanisms.
- **INTEGRATE** Authorization, Artifact/Provenance, Deployment, Observability, Security and Lifecycle proofs without transferring semantic ownership.
- **DO_NOT_BUILD** a universal arbitrary-code extension path that assumes publisher trust equals execution authority.
- **DEFER** marketplace ranking/reputation algorithms.

## Repository-validation questions
1. Can fresh main distinguish requested, granted and runtime-effective extension capabilities?
2. Can it distinguish installed revision from actually running/effective revision by cohort?
3. Is extension containment/isolation represented as an explicit support axis?
4. Can update state be DEFERRED/PINNED/PARTIAL/OUTCOME_UNKNOWN?
5. Are provider/runtime substitution proofs able to enumerate residual sessions/hooks/caches/grants?
6. Does any current extension mechanism infer authority from marketplace/publisher metadata?
7. Can local Station operation prove package/trust/grant/runtime closure and requalify after reconnect?
8. Can AGWS/AI compose extension-backed surfaces without obtaining install/provider-admin/canonical authority?

## Symbiotic Proof obligations
1. An installed package with optional permission not granted cannot exercise that capability.
2. A previously granted permission that is revoked makes prior effective-capability evidence stale.
3. A downloaded newer package does not qualify a cohort still executing the old revision.
4. A pinned/deferred cohort remains explicitly non-current rather than falsely reported upgraded.
5. Publisher trust/signature cannot grant host/provider/deployment/recovery authority.
6. High-authority and isolated plugin runtimes expose distinct containment support profiles.
7. Ambiguous update/activation reconciles observed runtime revision before retry.
8. Provider cutover remains PARTIAL until old sessions/hooks/caches/grant leases/consumers are drained or dispositioned.
9. Offline Station activation uses only qualified package/trust/grant/runtime closure; reconnect forces requalification where superior revisions changed.
10. AGWS/AI extension composition cannot amplify delegated Station/Role/Person authority.

## Material findings
- **G2-FINDING-EPM-45** — Effective extension qualification is applicability-scoped: package installation, publisher trust, workspace/Station context, requested permissions, granted permissions and runtime-effective capabilities are independent revision-qualified claims.
- **G2-FINDING-EPM-46** — Extension requested capability, granted capability and effective runtime capability require separate typed lineage; runtime consent/revocation or host/workspace scope can make an installed extension less privileged than its manifest request.
- **G2-FINDING-EPM-47** — Published/downloaded/installed/running extension revision are distinct states; update currentness must be cohort-qualified because idle gating, active sessions or administrative pinning can leave consumers on older effective revisions.
- **G2-FINDING-EPM-48** — Containment is an explicit support vector, not an inherent property of `plugin`: ecosystems range from host-equivalent extension authority to network/process isolation, so semantic admission cannot infer blast radius from package type.
- **G2-FINDING-EPM-49** — Extension trust and compatibility evidence has an independent replay/currentness horizon; publisher/signature/workspace/admission evidence may remain historically replayable while no longer qualifying the current grant, host or runtime revision.
- **G2-FINDING-EPM-50** — Ambiguous install/update/activation must use expected-base plus observed installed/runtime revision and reconcile-before-retry; retry without observation can duplicate hooks/processes or overwrite newer effective state.
- **G2-FINDING-EPM-51** — Extension portability is a mixed support vector across package, compatibility, permission model, containment, lifecycle/update, state, offline verification, marketplace and observability; provider substitution closes only after residual version/session/cache/hook/grant/consumer cohorts are drained or dispositioned.
- **G2-FINDING-EPM-52** — Qualified local/offline extension closure and AGWS/AI composition are non-amplifying: locally cached trust/grants have bounded horizons, reconnect requalifies superior state, and composition cannot mint install, marketplace/provider-admin, deployment/recovery or canonical-change authority.

## Capability Discovery Register candidates
- `G2-CAPABILITY-CANDIDATE-EPM-APPLICABILITY-SCOPED-EFFECTIVE-EXTENSION-QUALIFICATION-CLAIM` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**.
- `G2-CAPABILITY-CANDIDATE-EPM-REQUESTED-GRANTED-EFFECTIVE-CAPABILITY-LINEAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**.
- `G2-CAPABILITY-CANDIDATE-EPM-MIXED-EXTENSION-CONTAINMENT-RUNTIME-SUPPORT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**.
- `G2-CAPABILITY-CANDIDATE-EPM-EXTENSION-VERSION-SESSION-HOOK-GRANT-CONSUMER-COHORT-DRAINAGE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**.

No candidate is promoted. Adaptive Governed Work Surfaces remains CORE/promoted and distinct from generic UI, preserving `Enterprise → Station → Role → Person` and AI-only bounded materialization.

## Value / risk / priority / next question
**Value:** high. **Risk:** critical if installed/trusted/current are collapsed. **Priority:** high before synthesis.

**Saturation:** NOT SATURATED; this revisit produced material findings, so consecutive-no-material remains 0.

**Next question:** on the next eligible revisit, test whether requested→granted→effective capability lineage belongs universally in Authorization/UCA or remains Extension-owned, and whether containment support requires a universal cross-capability profile.