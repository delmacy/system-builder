# Extension / Plugin / Marketplace Architecture — Revisit 02

Status: REVISIT CYCLE 3 / MATERIAL NEW FINDINGS / NOT SATURATED

## Research question

Which boundaries let Generation 2 keep extension semantics portable while allowing package/provider realization, enterprise admission, offline distribution, runtime placement and revocation to vary without letting an extension, marketplace, Station or Adaptive Governed Work Surface acquire authority implicitly?

## Representatives and evidence ledger

| Representative | Coverage | Evidence extracted |
|---|---|---|
| VS Code extensions / enterprise management | DEEP | Extension identity is `publisher.name`; install, enable/disable, workspace trust, publisher trust, signature verification, allowed-extension policy, runtime host placement and remote/local installation are distinct controls. The extension host improves stability but can still have broad host permissions. Enterprise policy can restrict publisher/extension/version/platform; private marketplace can rehost extensions for restricted and air-gapped environments. Sources: https://code.visualstudio.com/docs/configure/extensions/extension-marketplace ; https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security ; https://code.visualstudio.com/docs/enterprise/extensions ; https://code.visualstudio.com/api/advanced-topics/extension-host ; https://code.visualstudio.com/api/advanced-topics/remote-extensions ; https://code.visualstudio.com/api/extension-guides/workspace-trust |
| Terraform providers / plugin protocol | DEEP | Provider source address, local name, selected version/checksums, installation source, provider configuration and runtime plugin protocol are distinct. Lock files preserve selected provider revisions/checksums; filesystem/network mirrors support restricted or air-gapped installation; the versioned gRPC plugin protocol separates Core from provider implementation. Cryptographic signing/checksums prove package provenance/integrity but do not automatically prove organizational trust. Sources: https://developer.hashicorp.com/terraform/language/providers/requirements ; https://developer.hashicorp.com/terraform/language/files/dependency-lock ; https://developer.hashicorp.com/terraform/cli/commands/providers/lock ; https://developer.hashicorp.com/terraform/cli/commands/providers/mirror ; https://developer.hashicorp.com/terraform/plugin/terraform-plugin-protocol ; https://developer.hashicorp.com/terraform/plugin/how-terraform-works |
| Backstage plugins/modules/feature loaders | DEEP | Extension points remain plugin-owned; modules may extend only their target plugin; feature loaders can select features dynamically while root/service ownership stays explicit. Dynamic loading is an installation/realization mechanism rather than semantic authority. Sources: https://backstage.io/docs/backend-system/architecture/extension-points/ ; https://backstage.io/docs/backend-system/architecture/modules/ ; https://backstage.io/docs/backend-system/architecture/feature-loaders/ ; https://backstage.io/docs/backend-system/architecture/plugins/ |
| Kubernetes CRDs/operators | DEEP | Typed extension APIs, version coexistence/conversion and external controllers show semantic API identity separated from controller workload realization. Conversion has constrained mutation boundaries; RBAC/admission remain host authorities. Source: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/ |
| OSGi | DEEP | Prior passes remain authoritative for install/resolution/activation identity, capability/requirement resolution, bundle lifecycle and security scoping. OSGi continues to provide the strongest explicit resolver/lifecycle contrast to package-presence models. Sources retained in prior dossier/revisit. |

## Primitive decomposition

The stronger portable model is:

`ExtensionSemanticIdentity -> ExtensionPoint/ContractIdentity -> ManifestRevision -> RequestedCapabilities/Authority -> ArtifactRevision -> Provenance/IntegrityEvidence -> DependencyClosure -> AdmissionDecision -> InstallationInstance -> RealizationBinding -> EnablementContext -> ActivationInstance -> RuntimePlacement -> Execution/HealthEvidence -> Revocation/Disablement -> Rollback/RetirementEvidence`.

The important new boundary is **RealizationBinding**. A semantic extension requirement should not have to equal a package manager coordinate, registry source address, VSIX identifier, provider binary or runtime process location. Those are realizations selected under host/environment policy.

## Identity and lifecycle

- Semantic extension identity belongs to the portable capability contract; package/source address and artifact digest identify realizations.
- Installation is inventory state. Enablement can be global, environment-, workspace-, Station- or tenant-scoped. Activation is an execution event. Runtime placement identifies where the active code executes.
- A provider/plugin may be installed but disabled; enabled but incompatible with a context; compatible but denied by policy; admitted but not activated; activated but unhealthy; revoked while retaining rollback evidence.
- Remote/local placement in VS Code demonstrates that the same logical extension may have context-sensitive realization. Terraform demonstrates that source address/local alias/selected revision/runtime provider process are separate identities.

## Trust, signing and admission

Four decisions must not collapse:

1. **Integrity/provenance** — is this the expected artifact from the claimed source/revision?
2. **Publisher/signer trust** — is the signer/publisher trusted under current trust roots?
3. **Dependency closure trust** — are all realized dependencies acceptable, verified and policy-compatible?
4. **Host admission/authority** — may this extension execute here, with these requested capabilities, in this Station/tenant/environment?

Terraform lock/signature evidence is particularly useful: checksums and signatures improve repeatability and provenance, but HashiCorp explicitly warns that signing does not decide whether the provider is trustworthy or compliant with local policy. VS Code likewise separates signature verification, publisher trust, Workspace Trust and organization allowlists.

## Offline, self-hosted and air-gapped operation

A generated system that claims autonomous extension support must retain enough material to reinstall/restart without the Builder or public marketplace:

- semantic extension requirement;
- selected realization and artifact revision/digest;
- full dependency closure for the target platform;
- manifests/contracts;
- trust roots or previously established provenance evidence;
- policy/admission decision and revision;
- provider/runtime binding and target platform constraints;
- rollback artifact(s) where required.

Terraform filesystem/network mirrors and `providers mirror` prove that discovery origin and installation source can be decoupled. VS Code private marketplace/rehosting shows the same enterprise need at catalog level. A mirror is distribution infrastructure, not new semantic identity or automatic trust authority.

## Runtime isolation and failure containment

Process/worker/container placement is a **qualified containment mechanism**, not a universal security primitive. VS Code documents that extension hosts prevent many UI/startup impacts but extensions can still possess broad host permissions. Terraform provider binaries run as separate RPC processes, but protocol/process separation alone does not define filesystem/network/secret authority. Backstage modules can intentionally share host services.

Generation 2 therefore needs evidence for the *actual enforced boundaries* (filesystem, network, secret, process, API surface, tenant/Station scope) and separate extension health from host/system health. Revocation should prevent future activation/effects according to policy while preserving historical evidence and rollback/retirement state.

## Station, multitenancy and AGWS boundary

Extension exposure must be capability-scoped and non-amplifying across `Enterprise -> Station -> Role -> Person`.

- A Station may expose only an allowed subset of installed/admitted extensions or extension-provided capabilities.
- Lower layers may specialize visibility/configuration only within inherited authority; they cannot convert a hidden/denied extension into an executable one.
- AGWS component composition can reference already admitted semantic capabilities/bindings, but cannot inject arbitrary frontend bundles/packages, install extensions, choose a less-trusted realization, grant provider authority or bypass extension admission.
- If an AI-authored request requires a new extension implementation, package, executable code, new extension point or broader authority, the request must be reclassified/escalated to the governed extension/build/admission path rather than materialized as ordinary page personalization.

## Marketplace/catalog versus execution trust

Catalog/marketplace functions are discovery and distribution: search, metadata, versions, publisher information, artifact locations and update availability. Execution trust belongs to host policy and evidence. Removal/blocklisting in a marketplace may become an input to revocation policy, but the marketplace itself must not silently rewrite portable semantics or erase historical evidence.

## Product-specific mechanisms vs universal primitives

Product-specific: VSIX and VS Code extension host/private marketplace; Terraform source-address syntax, `.terraform.lock.hcl`, registry/mirror protocols and provider gRPC implementation; Backstage npm/module-federation/feature loaders; Kubernetes CRD/controller machinery; OSGi resolver/bundle runtime.

Universal candidates: semantic extension identity; extension point/contract identity; requested capability/authority; artifact realization; dependency closure; integrity/provenance evidence; admission policy/decision; installation instance; realization binding; scoped enablement; activation instance; runtime placement; containment capabilities; revocation decision; rollback/retirement evidence.

## Convergent patterns

1. Semantic contract identity can remain stable while package/distribution/runtime realization changes.
2. Installation source and origin identity can be decoupled for enterprise/offline operation.
3. Integrity/signature evidence is necessary but insufficient for execution admission.
4. Dependency closure is part of the trusted realization, not just build convenience.
5. Enablement/activation is contextual and distinct from installation.
6. Runtime separation does not prove least privilege; containment must be explicitly evidenced.
7. Enterprise policy may narrow extension availability by environment/organization/version/platform without changing extension semantics.
8. Extension exposure must not amplify authority through lower-level customization surfaces.

## Divergences

- VS Code supports broad extension capabilities with policy/trust overlays; Terraform exposes a narrow versioned provider RPC contract; Backstage often assumes trusted in-process modules; Kubernetes commonly separates API semantics from controller workloads. No single sandbox/loader model is universal.
- Terraform has strong deterministic dependency selection and mirror mechanics; VS Code emphasizes marketplace/update UX; Backstage dynamic feature loading is host composition. Distribution and resolution maturity varies materially.
- Revocation semantics differ: marketplace blocklists, organization policy, package removal, disabling and controller/RBAC changes are different mechanisms. Generation 2 should model revocation outcome/evidence rather than copy one mechanism.

## Fresh-main System Builder comparison

The prior extension dossiers established evidence-backed System Builder foundations in provider-neutral capability declarations/bindings and generated-runtime autonomy, while explicitly finding no demonstrated general extension installation/activation/marketplace architecture. This revisit does not broaden that repository claim. It contributes external evidence that any future extension mechanism should reuse portable capability/binding authority rather than embedding package/registry identities into canonical SystemDefinition semantics. Exhaustive repository archaeology remains deferred to PLANNING_B.

## Reconciliation hypotheses

- **KEEP** — portable capability/binding authority and autonomous generated-runtime principle.
- **HARDEN** — evidence for realization selection, dependency closure, admission policy revision, scoped enablement, activation, revocation and containment.
- **GENERALIZE** — a reusable semantic-requirement -> realization-binding boundary if Provider/Binding synthesis confirms cross-capability reuse.
- **PROVIDERIZE** — marketplace/registry/mirror transport, package format, loader, runtime placement and containment implementation.
- **INTEGRATE** — extension realizations only through capability-owned extension points and admitted bindings.
- **DEFER** — social/commercial marketplace features and unconstrained third-party ecosystem until admission/revocation foundations exist.
- **DO_NOT_BUILD** — package coordinate as canonical semantic identity; signature as authority; AGWS package injection; installation or dependency edges that automatically amplify permissions.

## Repository-validation questions

1. Can current capability/binding contracts express `semantic requirement -> selected realization` without package/provider leakage?
2. Can artifact/provenance evidence represent a complete extension dependency closure and target-platform availability?
3. Which existing authority/policy primitives can express requested versus granted extension effects at Enterprise/Station/Role scope?
4. Is there an existing lifecycle/evidence primitive appropriate for install, enable, activate, revoke and rollback identities?
5. Which runtime provider boundaries can prove filesystem/network/secret/process/API containment rather than merely process separation?
6. Can generated systems retain extension artifacts/trust material for fully offline restart and rollback?
7. Can Station capability exposure reference extension-provided capabilities without becoming an extension installation authority?
8. Where should AI-generated extension requests be reclassified so AGWS remains constrained composition rather than arbitrary code/package introduction?

## Symbiotic Proof

Define a semantic extension contract with two realizations from different distribution mechanisms. Resolve realization A from an online registry, verify it, record its dependency closure, admit it under Enterprise policy, expose only its bounded capability to Station X, install but keep it disabled in Station Y, then activate it with explicit runtime-placement/containment evidence. Mirror the same artifact closure into an air-gapped environment and prove restart without the Builder/origin marketplace. Revoke A, prove future activation/effects are blocked while evidence remains, then switch to compatible realization B without changing the semantic extension requirement. Finally attempt an AGWS/AI request to inject an arbitrary package or gain broader extension/provider authority and prove it is rejected/escalated rather than materialized.

## Stable findings

- **G2-FINDING-EXT-17 — Semantic Extension Identity Must Be Distinct From Package, Distribution Source and Runtime Realization.** Value HIGH; portability/lock-in risk CRITICAL; priority P0.
- **G2-FINDING-EXT-18 — Installation, Scoped Enablement, Activation and Runtime Placement Are Separate Identities/Lifecycles.** Value HIGH; governance/operations risk HIGH; priority P0.
- **G2-FINDING-EXT-19 — Integrity, Publisher Trust, Dependency-Closure Trust and Host Admission Are Distinct Decisions.** Value HIGH; supply-chain/security risk CRITICAL; priority P0.
- **G2-FINDING-EXT-20 — Offline Extension Autonomy Requires a Verified Dependency Closure and Portable Realization Evidence, Not Marketplace Reachability.** Value HIGH; autonomy/availability risk HIGH; priority P0.
- **G2-FINDING-EXT-21 — Extension Containment and Revocation Must Be Qualified, Enforced and Evidenced; Process Separation Alone Is Insufficient.** Value HIGH; security/resilience risk CRITICAL; priority P0.
- **G2-FINDING-EXT-22 — Station/AGWS Extension Exposure Must Be Non-amplifying; AI Composition Cannot Introduce Code, Packages or Provider Authority Without Escalation.** Value HIGH; architecture/authority risk CRITICAL; priority P0.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-SEMANTIC-EXTENSION-REALIZATION-BINDING` — CROSS_CUTTING. Evidence: Terraform semantic/local/source/runtime separations + VS Code logical identity/host placement + Backstage contract/module realization. Promote only if Provider/Binding synthesis confirms a reusable requirement-to-realization primitive rather than an Extension-local subcapability.
- `G2-CAPABILITY-CANDIDATE-EXTENSION-ADMISSION-DEPENDENCY-CLOSURE` — CROSS_CUTTING. Evidence: Terraform lock/signature/mirror closure + VS Code signature/publisher/workspace/organization policy. Promote only if Security/Governance synthesis shows reusable supply-chain admission semantics.
- `G2-CAPABILITY-CANDIDATE-EXTENSION-REVOCATION-CONTAINMENT-EVIDENCE` — CROSS_CUTTING. Evidence: VS Code disable/block controls + qualified extension-host boundaries + Terraform process protocol + Station non-amplification requirement. Promote only if Lifecycle/Security/Observability converge.

No capability candidate is promoted in this revisit.

## Saturation assessment

Principal representatives are DEEP, but this cycle produced six material findings. `consecutive_no_material_finding = 0`; the capability remains **NOT SATURATED**. Later revisits must test whether semantic-realization binding, admission/dependency closure and revocation/containment are truly extension-local or cross-cutting primitives after Provider/Binding, Governance, Security and Lifecycle research converge.
