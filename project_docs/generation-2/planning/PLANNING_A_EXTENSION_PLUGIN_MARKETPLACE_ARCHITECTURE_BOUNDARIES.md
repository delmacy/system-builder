# Planning A — Extension / Plugin / Marketplace Architecture Boundaries

Status: PASS_FOR_CAPABILITY
Phase: PLANNING_A_TAXONOMY_BOUNDARIES
Scope: taxonomy ownership and boundaries only. No SB current-state claim, product code, WBS, Work Package, TASK, Construction or worker handoff.

## Ownership
Extension / Plugin / Marketplace Architecture owns the canonical semantics for extension identity and revision, extension package/manifest declaration, extension-point attachment, requested/granted/effective capability permissions, admission/trust qualification, install/enable/disable/update/revoke lifecycle, containment and failure-isolation expectations, extension compatibility with host/API revisions, dependency/host constraints, extension catalog/distribution relations, provider-backed extension realization, and extension migration/rollback/residual-cohort semantics.

It is the semantic owner of the fact that an extension exists as an extension of a host capability surface and of the governed relationship between that extension and its host. It does not become the owner of the extension's domain semantics, package build truth, artifact provenance, generic authorization policy, runtime deployment, provider discovery, marketplace commerce, or every API contract the extension consumes.

The source of truth for extension identity/lifecycle is therefore a canonical extension record plus revisioned declarations and qualified realization/admission evidence. Package, registry, marketplace, repository, runtime and provider IDs remain realization identities unless explicitly adopted through an authorized canonical transition.

## Canonical extension identity and revision
A canonical extension identity is stable across package rebuilds, registry moves, marketplace changes, provider substitutions and compatible runtime realizations. It is distinct from package digest, artifact ID, registry coordinate, marketplace listing ID, provider integration ID, deployment unit and runtime process identity.

An extension revision references the extension identity and the declaration/material required to realize that revision. Revision identity must preserve lineage across update, correction, supersession, withdrawal and rollback. Re-publishing materially different extension semantics under the same opaque provider/version identity cannot silently rewrite canonical history.

External or provider version strings may be retained as aliases/evidence, but compatibility/currentness decisions operate over explicit revision vectors and applicability, not lexical version equality alone.

## Package and manifest declarations
Extension package/manifest metadata describes requested host attachment points, declared dependencies, host/API compatibility constraints, requested permissions/capabilities, configuration/schema expectations, realization requirements and provenance references. A declaration is intent, not proof of admission, safety, compatibility or effective authority.

The extension owner may define a provider-neutral canonical declaration model while preserving provider-specific manifest fields behind typed realization mappings. Marketplace- or runtime-specific manifest schemas are not universal primitives merely because one ecosystem requires them.

Manifest correction or normalization preserves the original supplied evidence and producing lineage. AI or import tooling may propose mappings but cannot silently adopt ambiguous provider metadata as canonical extension truth.

## Requested → granted → effective capability authority
Extension authority has at least three distinct truths:
- **requested**: capabilities/permissions declared or requested by the extension revision;
- **granted**: capabilities/permissions authorized by the applicable policy/administrator for the declared subject, scope and revision;
- **effective**: capabilities actually reachable in the current host/runtime realization after binding, containment, runtime state and current authorization qualification.

Requested authority never implies granted authority; granted authority never proves effective realization; effective reachability must never exceed the granted set. Provider/runtime defaults, degraded mode, offline operation, AI and AGWS cannot amplify authority.

Effective extension authority remains subject to `Enterprise → Station → Role → Person` monotonic delegated authority and Station capability-exposure boundaries. A Station may permit a bounded extension surface without gaining Enterprise-level authority or exposing another Station's capabilities.

## Admission and trust qualification
Extension admission is a current qualified decision over the extension revision, artifact/provenance evidence, signer/trust state where applicable, policy revision, declared permissions, dependency closure, host compatibility, security/containment profile, provider support and other required evidence.

Artifact presence, valid syntax, package download or marketplace approval does not by itself prove current admission. Admission evidence is applicability-, revision- and currentness-scoped. Missing, stale, contradictory or insufficient evidence yields `INCONCLUSIVE` rather than implicit allow.

Trust/material rotation, policy changes, revocation, host revision changes or provider substitution may invalidate prior qualification and require re-admission. Historical admission remains replayable against the revisions that produced it but cannot automatically authorize changed current state.

## Lifecycle
The canonical lifecycle distinguishes at least declared/discovered, qualified/admitted, installed, enabled, disabled, updating/migrating, revoked/withdrawn and removed states where applicable. Ecosystems may realize fewer or additional provider-specific states, but those states must map without collapsing semantic distinctions.

Installation proves material realization, not enablement or effective authority. Enablement proves intended activation, not consumer-effective execution or validated health. Disablement/revocation must define whether running executions, cached code, sessions, workers, subscriptions, credentials or generated artifacts remain capable of authoritative effects.

Revocation is stronger than ordinary disablement when policy/trust requires the extension to lose eligibility. A revoked extension cannot regain effective authority merely because stale local state, offline caches or a provider runtime still reports it installed.

## Extension points and compatibility
Extension points are typed host contracts with identity and revision. Compatibility may depend on host revision, API/protocol revision, semantic contract revision, dependency revisions, runtime/runtime-profile constraints, security/containment requirements and the extension revision itself.

Syntactic loadability does not prove semantic compatibility. Standards / Interoperability / API Contracts owns generic contract/conformance semantics; Extension Architecture owns the applicability of those contracts to extension attachment and lifecycle.

A compatibility result is qualified for its declared revision vector and scope. Host or dependency change can make a previously admitted extension `INCONCLUSIVE` or ineligible until requalified.

## Dependency and host-version constraints
Extension dependency closure may include other extensions, libraries, host capabilities, schemas, API contracts, provider capabilities and runtime features. Build / Dependency Graph / Reproducibility owns deterministic build/material closure; Extension Architecture owns the extension-specific declared dependency/compatibility relation and whether the current host composition satisfies it.

Dependency success in one environment or cohort does not prove global eligibility. Coexisting host generations may require explicit extension compatibility cohorts, migration plans or temporary pinning.

Cycles, conflicting requirements or unresolved dependency identity must remain explicit rather than being silently resolved by provider ordering or last-writer behavior.

## Containment and failure isolation
Extension Architecture owns the extension-specific containment contract: what resource/capability boundaries the extension must remain within, what failure propagation is permitted, what host state must remain protected, and what isolation expectations apply to execution and data access.

Security / Resilience / Failure Recovery owns enterprise security posture, containment eligibility and recovery qualification. Authorization owns permission evaluation. Deployment/Runtime owns realization topology and process/container/runtime actuation. Extension Architecture composes those qualified facts into extension eligibility without absorbing their semantics.

Extension failure may be isolated, degrade the host surface, or force disablement depending on the declared contract. Failure isolation cannot be inferred solely from process/container separation; effective capability reachability and shared-state coupling also matter.

## Marketplace/catalog/distribution boundaries
A marketplace or catalog may publish discoverable extension metadata, compatibility/support claims, provenance references, publisher identity, commercial metadata and distribution locations. Listing/discovery is not canonical installation, admission, authorization or effective enablement.

Artifact / Release / SBOM / Provenance owns released artifact identity, signatures, SBOM/provenance and distribution trust. Commercial Metering / Entitlements / Rating / Billing / Payment owns customer-commercial entitlement/rating/billing/payment semantics. Extension Architecture owns how a listed/distributed extension revision relates to the host extension model.

Marketplace-specific moderation, ranking, review, purchase and listing APIs are provider/domain mechanisms and are not canonized as universal extension semantics unless another owning capability explicitly adopts them.

## Provider-backed extensions
An extension may be realized wholly or partly by an external provider rather than local package execution. Provider / Binding / Capability Negotiation owns provider discovery, support vectors, admission/binding, coexistence and provider cutover. Extension Architecture owns the canonical extension identity and host attachment semantics that survive provider substitution.

Provider substitution must not change canonical extension identity merely because external IDs change. New provider support must be requalified against the extension's current requirements, permissions, trust and host compatibility. Unsupported or ambiguous mappings remain `INCONCLUSIVE/PARTIAL` rather than being normalized into equivalent support.

## Update, migration and rollback
An extension update is an evolution from one extension revision to another and may require package replacement, schema/configuration change, permission re-consent, trust requalification, dependency migration, host/API migration and provider rebinding.

Lifecycle / Versioning / Evolution / Migration owns generic coexistence, migration-readiness/currentness, cutover and rollback-eligibility semantics. Extension Architecture owns extension-specific postconditions and cohort identity. Deployment/Runtime or other realization owners perform authorized actuation.

Rollback eligibility is current and qualified, not a historical flag. It depends on retained compatible artifacts, host/API revisions, configuration/schema state, trust/admission, provider support and residual effects. A prior extension revision being available does not prove it can safely become effective again.

## Residual extension cohorts and revocation drainage
Extension cutover, disablement, revocation or provider substitution is incomplete while residual authoritative cohorts can still act under the old revision or authority. Residual cohorts may include running processes, in-flight workflows, sessions, cached modules, browser/client bundles, workers, scheduled jobs, subscriptions, callbacks, credentials/tokens, provider bindings, generated projections or persisted extension-owned state.

Drainage must identify cohort, revision, authority scope, remaining effect capability and evidence of convergence. Revoking catalog visibility or deleting a package does not prove residual runtime authority has ended.

When mutating teardown/update effects are ambiguous, disposition remains `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`; `UNKNOWN` requires reconcile-before-retry unless idempotency is explicitly qualified.

## Boundary with Artifact / Release / SBOM / Provenance
Artifact/Release owns build-output adoption into released artifacts, artifact/release identity, SBOM/provenance, signatures/attestations, distribution/promotion and release withdrawal. Extension Architecture references qualified extension artifacts but does not redefine artifact provenance.

An artifact may be trustworthy yet incompatible or unauthorized as an extension. Conversely, an extension declaration may be semantically admissible while its current artifact lacks sufficient provenance/trust evidence. These are separate qualification axes.

## Boundary with Build / Dependency Graph / Reproducibility
Build owns deterministic material/dependency closure, build inputs, caches, toolchain/runner identity and reproducibility evidence. Extension Architecture owns extension-specific declared dependencies, host constraints and the mapping from released package/material to an extension revision.

A reproducible build does not prove extension admission, compatibility or authority.

## Boundary with Standards / Interoperability / API Contracts
Standards/API Contracts owns generic contract identity/revision, conformance, compatibility, negotiation and protocol semantics. Extension Architecture owns which extension points/contracts a revision requires and whether the current host composition satisfies those requirements.

Conformance to an API contract does not prove provider support, extension admission, authorization or domain semantic equivalence.

## Boundary with Provider / Binding / Capability Negotiation
Provider/Binding owns provider discovery, support qualification, admission, binding, fallback/coexistence, cutover and withdrawal. Extension Architecture owns the provider-neutral extension identity, requirements and extension-host relation that provider realizations satisfy.

Provider IDs and provider-native extension/listing identities remain non-canonical by default.

## Boundary with Authorization / Policy / Organization / Multitenancy
Authorization owns policy evaluation and the actual grant/deny decision for subjects/scopes/operations. Extension Architecture owns the requested capability set and extension-specific representation of granted/effective permissions.

Extension installation, marketplace purchase or trusted publisher status cannot bypass tenant/Station policy. Requested/granted/effective authority remains explicit and monotonic.

## Boundary with Security / Resilience / Failure Recovery
Security/Resilience owns security posture, isolation/recovery qualification, degraded-mode safety and return-to-service criteria. Extension Architecture owns extension-specific containment requirements and lifecycle reactions to failed qualification.

A sandbox label or isolated process does not by itself prove containment. Current evidence must support the applicable security profile.

## Boundary with Governance / Compliance / Audit
Governance owns obligations, control applicability, exceptions, evidence and audit lineage. Extension Architecture supplies extension identity/revision/lifecycle/permission/admission evidence and consumes applicable governance decisions.

Marketplace approval or publisher reputation does not waive enterprise controls. Governance findings may force disablement/revocation through authorized lifecycle transitions, while preserving audit and producing lineage.

## Boundary with Lifecycle / Versioning / Evolution / Migration
Lifecycle owns reusable revision/coexistence/migration/cutover/rollback semantics. Extension Architecture applies them to extension revisions, permissions, host/API dependencies and residual extension cohorts while retaining extension-specific postconditions.

Lifecycle does not own extension domain semantics or install/runtime actuation.

## Boundary with Deployment / Environment / Runtime
Deployment/Runtime owns desired/effective/observed runtime realization, placement, rollout, process/container/serverless execution, traffic, readiness and deployment rollback actuation. Extension Architecture owns whether an extension revision is admitted/enabled and which realization requirements it declares.

Installed or running does not equal admitted, authorized, healthy or consumer-effective. Runtime observation cannot silently rewrite canonical extension lifecycle or grant state.

## Boundary with domain semantic owners
An extension may add behavior to Process, UI, Workflow, Integration, Storage, Notifications or other owners. Those capabilities retain canonical domain semantics and postconditions. Extension Architecture owns the attachment/admission/lifecycle relationship, not the meaning of every domain object implemented by the extension.

Extension removal cannot silently orphan or reinterpret domain state. Domain owners and Lifecycle must define migration, retention or unsupported-state handling where extension-created state persists.

## Failure semantics
Qualification outcomes may include PASS/ELIGIBLE, FAIL/INELIGIBLE and `INCONCLUSIVE`; support may additionally be PARTIAL for explicit capability vectors. Installation/update/revocation effects use `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` where remote or distributed mutation is possible.

Missing provider support, stale trust evidence, unresolved dependency identity, ambiguous host compatibility or partial cohort drainage must remain explicit. `UNKNOWN` mutating effects require reconciliation before unsafe retry.

## Authority, Station, AGWS and AI
`Enterprise → Station → Role → Person` remains monotonic. Extension catalogs, installation controls, permission grants, enablement and operational views are exposed only within inherited Station capability boundaries and explicit delegated authority.

Adaptive Governed Work Surfaces may present extension discovery, compatibility evidence, permission diffs, admission state, lifecycle controls and residual-cohort evidence. AI may summarize manifests, propose mappings, identify permission deltas or suggest compatibility remediation. Neither AI nor AGWS may grant extension authority, fabricate trust/provenance/conformance evidence, convert `INCONCLUSIVE` into PASS, silently adopt provider IDs, bypass required re-consent, or widen Station/Role/Person authority.

## Non-goals
Extension / Plugin / Marketplace Architecture is not a universal package manager, artifact registry, build system, general authorization engine, policy language, security sandbox implementation, deployment orchestrator, provider broker, marketplace billing engine, generic API-contract owner, domain semantic owner or universal module system.

It must not equate package presence with installation, installation with enablement, enablement with effective authority, marketplace listing with admission, trusted publisher with unrestricted permission, or process isolation with proven containment.

## Planning B repository-validation questions
Later repository archaeology from fresh main must determine: whether extension/plugin identity is distinct from package/registry/provider identity; how extension revisions and manifests are represented; whether requested, granted and effective permissions are separate; whether admission references current trust/provenance/policy/compatibility evidence; whether stale or insufficient evidence yields `INCONCLUSIVE`; where install/enable/disable/update/revoke lifecycle resides; whether host/API/dependency constraints are revision-aware; how containment/failure-isolation expectations are represented and qualified; whether extension-point/API compatibility is explicit; how marketplace/catalog listings map to canonical extensions without adopting provider IDs; how provider-backed extensions preserve canonical identity across substitution; how update/migration and rollback eligibility are qualified; whether residual sessions/workers/jobs/subscriptions/credentials/caches/clients are drained before cutover/revocation closure; whether `UNKNOWN` effects trigger reconcile-before-retry; how Station-scoped extension exposure and delegated administration are bounded; and whether AI/AGWS can only propose/act within inherited authority. These are questions only; this artifact makes no current-SB implementation claim.

## Planning A decision
PASS_FOR_CAPABILITY. Extension / Plugin / Marketplace Architecture owns canonical extension identity/revision, extension declarations and attachment, requested/granted/effective capability relations, current admission/trust qualification, extension lifecycle, containment expectations, host/API/dependency compatibility, catalog/distribution relations, provider-backed realization mapping and extension-specific migration/rollback/residual-cohort semantics. It does not absorb artifact/build truth, generic authorization/security/governance/lifecycle/deployment/provider/API-contract semantics, marketplace commerce or domain semantic ownership. No Planning B work is authorized by this artifact.
