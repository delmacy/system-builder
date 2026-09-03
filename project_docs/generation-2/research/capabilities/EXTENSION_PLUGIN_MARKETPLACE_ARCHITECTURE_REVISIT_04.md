# Extension / Plugin / Marketplace Architecture — Revisit 04

Status: REVISIT 4 / CYCLE 5 / MATERIAL NEW FINDINGS / NOT SATURATED

## Research question
How should Generation 2 distinguish extension semantic identity, package and dependency closure, admission/trust, installed/enabled/effective realization, runtime containment, revocation and delegated exposure so extensions can remain portable and enterprise-safe across marketplace/provider changes, offline operation and hierarchical `Enterprise → Station → Role → Person` administration without converting package presence, signature, publisher trust, AI authorship or host reachability into semantic or execution authority?

## Evidence/source ledger
| Representative | Coverage | Evidence extracted |
|---|---|---|
| VS Code Extension Marketplace + runtime security + Workspace Trust | DEEP | Marketplace signing verifies package source/integrity; publisher trust and Workspace Trust are separate contextual controls; ordinary desktop extension hosts can grant extensions the same broad host permissions as VS Code; block-listed malicious extensions can be removed from already-installed environments; web extensions run under a materially different browser sandbox. |
| Terraform provider ecosystem | DEEP | Provider source address/version constraints, dependency lock/checksums, install origin, mirror/cache and runtime provider use are distinct. Local mirrors can replace origin download paths without changing semantic source coordinates. Lock hashes are platform/package evidence, not authority. |
| OSGi Core 8 lifecycle/wiring | DEEP | Every update creates a new BundleRevision; each resolve creates a wiring; old in-use wirings may survive update/uninstall until refresh/restart. Installed/resolved/active and current/in-use/stale are distinct lifecycle facts. |
| Backstage frontend/backend plugins and modules | DEEP | Plugin identity is host-scoped; extension points are owned by plugins/host contracts; modules may extend one owning plugin and communicate through registered extension points; plugin-level predicates can gate exposure. Package layout is implementation/distribution structure, not canonical host authority. |
| Kubernetes dynamic admission + v1.36 manifest-based admission | DEEP | Extension points on a control path require explicit fail-open/fail-closed semantics and dependency-loop avoidance. Manifest-based admission closes bootstrap/self-protection gaps and retains previous good configuration on invalid reload, demonstrating local policy realization independent of centralized API state. |
| USENIX plugin/supply-chain studies | DEEP | Large-scale studies of WordPress plugins and npm ecosystems show marketplace presence and dependency popularity cannot be treated as trust; compromised or malicious dependencies can have broad transitive blast radius. Native extension research also demonstrates that extension boundaries can bypass assumptions of a safer host runtime. |

## Research synthesis

### 1. Semantic identity versus realization
The durable chain is:

`ExtensionSemanticIdentity → ManifestRevision → DeclaredCapabilitySet → DependencyRequirementSet → ArtifactRevision → DependencyClosureRevision → Trust/IntegrityEvidence → AdmissionDecision → InstallationAttempt → ProviderReceipt/Outcome → InstallationInstance → Resolution/WiringRevision → ScopedEnablement → ActivationAttempt → EffectiveRuntimeRealization → ContainmentProfile → Operational/PostconditionEvidence`.

An extension's semantic identity must not be its package filename, registry URL, publisher account, loader process ID or marketplace listing. Terraform proves install origin is replaceable; OSGi proves package update and runtime wiring are not atomic replacement; Backstage proves host plugin identity and extension-point ownership can remain stable while package realization changes.

### 2. Admission, trust, integrity and containment are separate predicates
VS Code provides decisive negative evidence: marketplace signature verification and publisher trust can coexist with a desktop extension host that gives an extension broad filesystem/network/process authority. Therefore:

- signature/checksum = artifact integrity/source evidence;
- publisher identity/trust = producer/source trust evidence;
- admission policy = contextual permission to install/enable/use a revision;
- dependency closure = compatibility/supply-chain evidence;
- containment profile = actually enforced runtime boundary;
- host capability exposure = what semantic operations the host makes available;
- effective authority = intersection of host grants, policy, Station/Role/Person delegation and realization containment.

No one predicate subsumes the others.

### 3. Dependency closure is a first-class security and compatibility subject
Terraform lock files and OSGi wiring make dependency closure revisioned and inspectable. USENIX ecosystem studies show transitive dependency structure creates systemic blast radius. Generation 2 therefore needs dependency closure identity bound to the admitted realization, including package coordinates, versions, platform, integrity evidence and compatibility constraints. Admission evidence becomes stale when a material dependency/trust/policy/host-contract revision changes.

### 4. Partial and ambiguous external effects
Extension installation, update, enablement, activation, revocation and removal can cross provider/host boundaries. A lost acknowledgement after an install or uninstall request cannot safely be represented as failed or retried blindly. Required states include `ATTEMPTED`, `RECEIPT_CONFIRMED`, `OUTCOME_UNKNOWN`, `PARTIAL`, `EFFECTIVE`, `POSTCONDITION_VERIFIED`, with correlation to concrete installation/runtime identity.

Before retrying an ambiguous install/remove/revoke, the system must reconcile actual host state. This reuses the universal ambiguous-outcome pattern while Extension owns the concrete subject semantics.

### 5. Revocation is not catalog removal
VS Code's block-list behavior shows a strong implementation of post-publication enforcement: a malicious installed extension can be removed locally. OSGi shows the harder case: uninstall/update may leave old in-use wirings effective until refresh/restart. Hence revocation requires:

`RevocationDecision → AffectedClosure/RealizationSet → EnforcementAttempt → EffectiveDisable/Stop/Unload/Removal State → ResidualInUseSet → PostconditionEvidence`.

If residual in-use code remains, revocation is not fully closed. Evidence must expose residual scope rather than claiming success from catalog or package-manager state.

### 6. Failure semantics for control-path extensions
Kubernetes admission webhooks demonstrate that extension failure policy is part of host semantics, not plugin implementation detail. An extension on a control path must declare whether failure produces deny, allow-with-degraded-evidence, bypass, quarantine or service unavailability. Dependency loops are a distinct architecture risk: an extension must not become the only mechanism needed to restore the dependency on which that extension itself relies.

Manifest-based admission further demonstrates a universal primitive: a local immutable/bootstrap policy realization can be necessary to preserve governance during centralized control-plane loss or restoration.

### 7. Provider and runtime coexistence
Provider replacement is not `copy package and switch`. A safe migration may require old and new loader/runtime/provider realizations to coexist while the host proves:

- semantic capability equivalence or explicitly bounded divergence;
- dependency/protocol compatibility;
- trust/admission validity;
- containment equivalence or deliberate hardening;
- effective binding and traffic/invocation routing;
- in-use old wiring drainage;
- rollback/recovery eligibility;
- postcondition evidence.

OSGi old-wiring coexistence is direct evidence that old runtime realization can outlive an apparent update.

### 8. Enterprise / Station / Role / Person authority
Adaptive Governed Work Surfaces remains a separate promoted capability. A Station may expose an admitted extension capability, but exposure does not confer installation, publisher-trust, trust-root, policy-edit, host-admin or provider-admin authority. Role/Person overlays may only attenuate the Station's admitted set. Enterprise invariants remain non-weakenable.

Delegated extension administration should therefore be facet-based: `discover`, `request-install`, `admit`, `install`, `enable`, `configure`, `bind`, `expose-to-Station`, `update`, `revoke`, `remove`, `trust-root-admin`, `marketplace-admin`, `containment-policy-admin`. Lower scopes cannot synthesize a stronger facet.

### 9. AI-authored extensions and AGWS boundary
AI authorship is provenance, never authority. AI may generate a candidate extension artifact or propose a dependency update, but the artifact must traverse deterministic validation, dependency closure, integrity/provenance, policy admission and authorized install/bind/exposure. AGWS may compose already-admitted semantic components; when fulfilling a surface request requires new executable code, a new host extension point, wider runtime permission or a new canonical capability, the request must escalate.

### 10. Qualified local/offline extension closure
A local/offline closure must include exact semantic requirement, artifact/manifests, transitive dependency closure for target platform, hashes/signatures and trust material, protocol/host compatibility metadata, admission-policy revision, capability/extension-point schemas, loader/runtime prerequisites, retained rollback material where required, and verification/reconciliation tools. Missing trust/dependency/compatibility/containment evidence yields `PARTIAL` or `INCONCLUSIVE`, not silent online fallback or broadened authority.

## Product-specific mechanisms versus universal primitives
Product-specific: VSIX/Marketplace/block list/extension hosts; Terraform Registry/provider source protocol and lock-file syntax; OSGi bundles/resolver/wiring; Backstage NPM plugin/module conventions; Kubernetes webhook/CEL/static-manifest mechanisms.

Universal: semantic extension identity; manifest/artifact/dependency-closure revisions; trust/integrity/admission separation; installation/effective-realization distinction; runtime containment profile; host-owned extension-point/capability vocabulary; ambiguous external-effect reconciliation; residual-in-use revocation evidence; provider coexistence/cutover; qualified local closure; non-amplifying delegated authority.

## Convergent patterns
1. Package presence is not effective extension realization.
2. Integrity/publisher trust/admission/containment/effective authority are distinct.
3. Dependency closure is revisioned evidence and part of security blast radius.
4. Update and uninstall can coexist with old in-use runtime wiring.
5. Revocation requires effective postcondition evidence, not catalog mutation.
6. Host extension points and capability vocabulary remain host-owned.
7. Marketplace/registry/loader are provider mechanics and replaceable.
8. Control-path extension failure semantics must be explicit and recovery-safe.
9. Station/Role/Person exposure cannot amplify install/admin/runtime authority.
10. AI authorship cannot bypass admission or create host authority.

## Divergences
VS Code desktop intentionally favors broad extension power while browser-hosted web extensions gain stronger sandboxing; Terraform providers use a narrow host/provider protocol; OSGi emphasizes resolver/wiring lifecycle; Backstage generally composes trusted application packages; Kubernetes extensions can sit directly on security-critical request paths. Generation 2 should therefore providerize loader/sandbox/process-placement mechanics while making containment strength and control-path criticality explicit evidence.

## SB comparison and repository-validation questions
No exhaustive repository archaeology is performed in RESEARCH_ELICITATION. Prior capability/binding/runtime-autonomy evidence remains the comparison baseline. PLANNING_B owns complete current-state reconciliation.

Questions:
1. Can current capability/binding contracts identify extension-provided semantics independently from package/provider coordinates?
2. Is there a reusable external-effect attempt/receipt/outcome/postcondition primitive suitable for install/revoke/remove?
3. Can dependency closure and platform-specific integrity evidence be retained per effective realization?
4. Where can Station exposure reference an extension capability without gaining install/admission/provider authority?
5. Can containment strength be represented and requalified when loader/runtime changes?
6. Can the runtime represent residual old/in-use extension realizations after update/revoke?
7. Can offline closure prove trust/admission/compatibility without network registry lookup?
8. Can AI-generated executable extensions be prevented from becoming effective before deterministic validation and explicit authority gates?

## Reconciliation hypotheses
- **KEEP** provider-neutral capability identity, anti-lock-in and autonomous runtime principles.
- **HARDEN** dependency-closure identity, trust/admission freshness, containment evidence, residual-in-use revocation and ambiguous outcomes.
- **GENERALIZE** revision-bound effective realization, evidence qualification, ambiguous-effect reconciliation and faceted authority during synthesis.
- **PROVIDERIZE** registry/marketplace, package format, loader, sandbox/process placement, distribution/update transport and runtime protocol.
- **INTEGRATE** extensions only through host-owned capability vocabulary and extension points.
- **REPLACE** any package-presence or signature-only notion of activation/trust with qualified effective realization.
- **DEFER** commercial marketplace economics/recommendation/social ranking until semantic/security foundations are proven.
- **DO_NOT_BUILD** extension-declared self-granting permissions, AI auto-install, implicit trust from marketplace presence, or silent fail-open for critical extension paths.

## Symbiotic Proof
Declare semantic capability `C` with extension realization A1. Resolve a complete dependency closure, verify artifact/provenance, admit it for Enterprise/Station S1, install and prove `installed != enabled != active != postcondition-valid`. Expose only `C` to S1 while denying install/trust-root/provider-admin to Role/Person. Introduce A2 with one changed dependency and prove prior admission evidence becomes stale. Keep A1 in-use while A2 is admitted, prove coexistence explicitly, then drain/cut over. Lose provider acknowledgement during removal and require `OUTCOME_UNKNOWN` plus reconciliation rather than blind retry. Revoke A2 and prove residual in-use sets prevent false closure. Rehost the exact closure through an offline mirror and prove semantic identity remains stable. Finally ask AI/AGWS to satisfy a surface request by adding a new executable extension with broader host permissions; require proposal/escalation and deterministic admission rather than automatic installation.

## Stable findings
- **G2-FINDING-EXT-30 — Extension Integrity, Producer Trust, Policy Admission, Dependency Compatibility, Runtime Containment and Effective Authority Are Independent Qualified Predicates.** Value HIGH; security/authority risk CRITICAL; priority P0.
- **G2-FINDING-EXT-31 — Extension Dependency Closure Is a Revision-bound Security and Compatibility Subject; Material Dependency/Trust/Host-contract Change Invalidates Prior Admission Evidence.** Value HIGH; supply-chain risk CRITICAL; priority P0.
- **G2-FINDING-EXT-32 — Install/Update/Enable/Activate/Revoke/Remove External Effects Require Attempt, Receipt, Effective Realization and Postcondition States, Including PARTIAL/OUTCOME_UNKNOWN Reconciliation.** Value HIGH; lifecycle risk CRITICAL; priority P0.
- **G2-FINDING-EXT-33 — Runtime Revocation Requires Residual-in-use Realization Evidence; Marketplace Removal, Package Uninstall or Policy Change Alone Does Not Prove Code Is No Longer Effective.** Value HIGH; security/recovery risk CRITICAL; priority P0.
- **G2-FINDING-EXT-34 — Extension Containment Strength Is a Realization-qualified Property and Must Be Re-proven Across Loader/Runtime/Provider Changes.** Value HIGH; isolation risk CRITICAL; priority P0.
- **G2-FINDING-EXT-35 — Control-path Extensions Require Explicit Failure/Bypass Semantics and Recovery Paths That Avoid Self-dependency and Bootstrap Governance Gaps.** Value HIGH; resilience/governance risk CRITICAL; priority P0.
- **G2-FINDING-EXT-36 — Extension Administration Must Be Faceted and Non-amplifying Across Enterprise→Station→Role→Person; Capability Exposure Does Not Confer Installation, Trust, Policy or Provider Authority.** Value HIGH; constitutional risk CRITICAL; priority P0.
- **G2-FINDING-EXT-37 — AI-authored Extension Material and AGWS Composition Remain Proposals/Consumers of Host-owned Contracts; Executable Introduction Requires Deterministic Validation, Admission and Explicit Authority.** Value HIGH; AI/extension-boundary risk CRITICAL; priority P0.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-EXT-QUALIFIED-ADMISSION-TRUST-CONTAINMENT-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Test merge with unified evidence qualification while Extension retains dependency/containment subject semantics.
- `G2-CAPABILITY-CANDIDATE-EXT-DEPENDENCY-CLOSURE-REVISION-AND-BLAST-RADIUS` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Build/Artifact dependency/provenance graphs; runtime extension closure remains a distinct effective subject.
- `G2-CAPABILITY-CANDIDATE-EXT-RESIDUAL-IN-USE-REVOCATION-POSTCONDITION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Lifecycle/Security governed retirement and recovery evidence.
- `G2-CAPABILITY-CANDIDATE-EXT-CONTROL-PATH-FAILURE-AND-BOOTSTRAP-GOVERNANCE` — **CROSS_CUTTING / FEEDS_PENDING_RESEARCH**. Test with Security/Recovery, Governance and Self-hosting before any promotion.

No candidate is promoted.

## Architecture proof-backfill obligations
1. **Signature-not-authority negative proof:** validly signed/trusted publisher artifact requests an undelegated host capability; installation/admission may pass relevant checks but actuation remains denied.
2. **Dependency-staleness proof:** change a transitive dependency/trust/host-contract revision after admission; prior effective-admission evidence becomes stale until requalified.
3. **Ambiguous-install proof:** external install succeeds but acknowledgement is lost; state becomes `OUTCOME_UNKNOWN`, reconciliation discovers concrete realization and blind duplicate install is denied.
4. **Residual-revocation proof:** revoke/uninstall while an old runtime wiring remains in use; closure remains PARTIAL until residual set is drained/stopped or explicitly dispositioned.
5. **Containment-substitution proof:** run same semantic extension under broad desktop host and sandboxed/web/provider-isolated host; semantic identity is stable while containment evidence differs.
6. **Control-path failure proof:** make an admission extension unavailable and prove configured fail-open/fail-closed behavior is explicit; no hidden bypass or deadlock is accepted.
7. **Station delegation proof:** expose admitted capability to one Station/Role but deny install, trust-root, marketplace and provider-admin facets; lower layers cannot amplify them.
8. **AI extension proof:** AI produces executable extension satisfying a UI intent; artifact remains candidate until deterministic validation, provenance, dependency closure, admission and authorized install complete.
9. **Provider migration proof:** old/new loaders coexist; effective binding and old in-use drainage are explicit before cutover/rollback closure.
10. **Qualified local closure proof:** reinstall/validate offline from retained closure; remove one trust/dependency/compatibility verifier and require PARTIAL/INCONCLUSIVE rather than online fallback or broadened authority.

## Saturation
Principal representatives are deeply covered, but this revisit produced eight material architectural findings. `consecutive_no_material_finding = 0`; **NOT SATURATED**. Governance, Provider/Binding, Lifecycle, Security/Recovery and Self-hosting remain necessary cross-capability consolidation checks.
