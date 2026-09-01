# Extension / Plugin / Marketplace Architecture — Revisit 01

Status: REVISIT CYCLE 2 PASS 1 / MATERIAL NEW FINDINGS / NOT SATURATED

## Research question

What additional boundaries are required so Generation 2 can admit independently versioned extensions without confusing distribution, package integrity, publisher trust, compatibility declarations, resolved host wiring, installed state, activation authority, runtime isolation, owned-state retirement or generated-runtime autonomy?

## Representatives and evidence/source ledger

| Representative | Coverage | Evidence extracted |
|---|---|---|
| VS Code extensions / Marketplace | DEEP | Marketplace publication, package signing, publisher trust, organization allow/block controls, install/disable/uninstall, workspace trust, host placement and runtime permissions are separate mechanisms. The extension host may have the same OS-level permissions as VS Code, so host separation is not equivalent to sandbox authority containment. Sources: https://code.visualstudio.com/docs/configure/extensions/extension-marketplace ; https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security ; https://code.visualstudio.com/api/advanced-topics/extension-host ; https://code.visualstudio.com/api/extension-guides/workspace-trust |
| Backstage backend plugins/modules | DEEP | Extension points are plugin-owned contracts; modules may extend only one target plugin and communicate through its registered extension points; module initialization completes before plugin initialization. Extension-point APIs are exported separately, allowing independent evolution/deprecation. Sources: https://backstage.io/docs/backend-system/architecture/modules/ ; https://backstage.io/docs/next/backend-system/architecture/extension-points/ |
| Kubernetes CRDs/operators | DEEP | Extension API versions can coexist while one storage version remains authoritative; conversions may be externalized to webhooks; clients may incrementally migrate across served versions; storage-version migration is separate from merely serving a new version. Sources: https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/ ; https://kubernetes.io/docs/tasks/manage-kubernetes-objects/storage-version-migration/ |
| OSGi bundles/resolver | DEEP | Installed bundle instance identity survives update but changes after uninstall/reinstall; install is persistent and atomic; INSTALLED, RESOLVED and ACTIVE are distinct states; declared requirements/capabilities become actual wiring only after resolver decisions satisfy constraints. Sources: https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html ; https://docs.osgi.org/specification/osgi.core/7.0.0/framework.lifecycle.html ; https://docs.osgi.org/javadoc/osgi.core/7.0.0/org/osgi/framework/wiring/BundleWiring.html |
| WordPress plugins | DEEP | Activation, deactivation and uninstall have deliberately different state semantics. Deactivation should retain durable plugin data, while uninstall is the lifecycle point intended to remove plugin-owned settings/tables. Sources: https://developer.wordpress.org/plugins/plugin-basics/activation-deactivation-hooks/ ; https://developer.wordpress.org/plugins/plugin-basics/uninstall-methods/ |

## Source of truth and primitives

The host capability owning an extension point remains semantic source of truth. The extension artifact can declare requirements and requested capabilities, but the realized executable relationship is host-derived.

Portable primitive chain:

`ExtensionIdentity -> ArtifactRevision -> ManifestRevision -> DeclaredRequirements -> VerificationResult -> AdmissionDecision -> InstallationInstance -> Resolution/WiringResult -> GrantedAuthority -> ActivationAttempt/Result -> RuntimeExecutionEvidence -> Disable/Deactivate/Uninstall/RetirementEvidence`.

Distribution remains adjacent:

`Marketplace/RegistryPublication -> ArtifactLocator + DistributionMetadata`, never `Publication -> ExecutionAuthority`.

## Identity

- Logical extension identity is distinct from artifact revision, publisher identity, marketplace listing and host-scoped installation instance.
- OSGi provides strong evidence that installed-instance identity is a lifecycle object: update retains it, uninstall/reinstall creates a new identity.
- Activation attempt/result is distinct from installation and from resolved compatibility/wiring.
- Extension-owned durable state has lineage that can outlive activation and deactivation; uninstall/retirement must therefore identify what state is affected.

## Lifecycle

`publish -> acquire -> verify -> admit -> install -> resolve -> authorize/bind -> activate -> execute/observe -> update/migrate -> disable/deactivate -> reactivate or uninstall/retire -> retain evidence`.

Important non-equivalences:

- published != admitted;
- signature verified != publisher trusted or organization-authorized;
- installed != resolved;
- resolved != granted authority;
- activated != isolated;
- deactivated != uninstalled;
- new API/manifest version served != persisted extension-owned state migrated.

## Versioning

Version separately: logical extension; artifact; manifest schema; host extension-point contract; declared requirement ranges; resolved wiring; authority policy; provider/binding; persisted extension-owned state schema; marketplace metadata; trust root/publisher context.

OSGi shows why declarations cannot be treated as realized compatibility: the resolver creates actual wires from requirements to selected capabilities. Kubernetes shows another version boundary: served versions and storage version may intentionally differ during migration.

## Failure semantics

- Publication succeeds but admission fails: artifact remains discoverable but must not become executable.
- Signature verifies but publisher or organization policy rejects admission: cryptographic truth remains true while authority decision is deny.
- Install succeeds but dependency resolution fails: preserve installed inventory and resolution diagnostics without activation.
- Dependency trust changes: re-evaluate admission/authority according to policy revision rather than assuming trust transitivity is permanently valid.
- Activation fails: preserve installation and resolved wiring while recording activation failure.
- Extension host/process crashes: record extension/runtime failure independently of host semantic state.
- Deactivation succeeds but uninstall cleanup fails: extension is non-active while owned-state retirement remains incomplete.
- New extension/API revision is served but state migration fails: coexistence/rollback must preserve the prior usable representation where supported.

## Extensibility and provider boundaries

Universal semantics should own extension identity, contract identity, requirements, verification result, admission intent/result, installation identity, resolved dependency/wiring evidence, requested/granted authority, activation lineage, state ownership and retirement evidence.

Provider/host mechanisms include VSIX, Marketplace, OSGi bundle packaging/resolver implementation, process/WebWorker/container topology, WordPress loader/hooks, Kubernetes webhook transport and registry UX.

## Governance

Admission is a governed host decision distinct from artifact verification and marketplace publication. VS Code provides direct evidence: Marketplace packages are signed and verified, while third-party publisher trust and organization allow/block controls are additional decisions. Trust in an extension pack/dependency can imply trust in dependent publishers in VS Code, demonstrating that trust propagation is ecosystem policy rather than a universal semantic rule.

Generation 2 should therefore represent trust/authority propagation explicitly and scope it to a policy revision and dependency graph rather than inheriting it silently from package dependency edges.

## Observability

Evidence should identify verification result, admission decision, selected dependency/wiring result, install/update lifecycle, effective authority, activation attempt/result, runtime location/provider, crashes, deactivation, uninstall and owned-state cleanup. A change in extension revision or trust policy should create a new observation/admission context rather than rewriting historical evidence.

## Portability and lock-in

Marketplace, package format, loader, resolver and isolation topology are replaceable mechanisms if the semantic extension identity, contract requirements, resolved compatibility evidence, authority decisions and state lifecycle remain portable.

Offline/self-hosted operation requires previously acquired artifacts, manifests, dependency closure, trust material and host bindings to remain sufficient for activation and restart without contacting the Builder or original marketplace.

## Product-specific mechanism vs universal primitive

Product-specific mechanisms: VSIX/Marketplace publisher workflow, VS Code extension hosts, Backstage package/module wiring, Kubernetes CRDs/conversion webhooks, OSGi bundle resolver, WordPress hooks and PHP loading.

Universal primitives: extension identity; artifact/manifest revision; extension-point contract; declared requirement; verification result; admission decision; installation instance; resolved wiring; requested/granted authority; activation lineage; runtime placement evidence; owned-state scope; retirement result.

## Convergent patterns

1. Distribution, verification, admission, installation, resolution and activation are separate stages.
2. Effective compatibility is realized by a host/resolver context, not proven by a manifest declaration alone.
3. Extension contracts remain owned by host capabilities.
4. State retirement is distinct from temporary deactivation.
5. Trust and execution authority are host-governed decisions.
6. Version coexistence requires explicit migration/representation semantics.
7. Runtime placement or process separation is not itself proof of privilege isolation.

## Divergent patterns

- VS Code extensions can execute with broad host permissions; Kubernetes operators often use separate workloads/RBAC; Backstage modules are intentionally same-backend trusted code; WordPress plugins run inside PHP application authority. Isolation guarantees are therefore provider-qualified.
- OSGi performs explicit resolver wiring; Backstage uses build/startup composition; WordPress is comparatively permissive. Dependency resolution capability differs materially by host.
- Kubernetes supports served/storage version coexistence and conversion; many plugin ecosystems instead perform application-defined migrations. State migration cannot be normalized into a single provider-neutral algorithm.

## Subcapabilities

Extension contracts; manifest schema; artifact acquisition; verification; admission policy; dependency resolution; installation inventory; activation; requested/granted authority; runtime placement/isolation; extension-owned state and migration; disable/deactivate; uninstall/retirement; trust/publisher governance; lifecycle evidence; offline distribution/autonomy.

## Fresh-main System Builder comparison

A current default-branch GitHub code search for `extension plugin marketplace capability binding` returned no matching implementation evidence during this revisit. The prior dossier's evidence-backed comparison therefore remains the only positive repository comparison for this capability: current System Builder has capability/binding separation foundations but no demonstrated general extension installation/activation/marketplace architecture. This revisit does not infer absence beyond the search evidence and defers exhaustive archaeology to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses

- KEEP — capability/binding separation and generated-runtime semantic authority.
- HARDEN — independently evidenced verification, admission, resolution, authority, activation and retirement lifecycle.
- GENERALIZE — requirement/capability matching only if synthesis confirms reuse with provider/binding negotiation.
- PROVIDERIZE — package/registry transport, dependency resolver implementation and runtime placement/isolation.
- INTEGRATE — extensions solely through capability-owned extension points and explicit host admission.
- DEFER — broad marketplace commercial/social features.
- DO_NOT_BUILD — implicit authority from install/signature; dependency-edge trust inheritance as universal rule; unrestricted canonical-definition mutation by plugins.

## Repository-validation questions

1. Which current SystemDefinition/runtime contracts could identify an extension without embedding package-manager identity?
2. Is capability/provider negotiation already rich enough to express requirement ranges and a realized selected binding, or would extension resolution need separate semantics?
3. Is there any current persistent inventory analogous to installation identity?
4. Can artifact/provenance evidence be reused for extension verification without conflating verification with admission?
5. Which authority contracts can express requested versus granted extension effects and dependency-scope trust?
6. Where can extension-owned durable state declare scope and migration/retirement obligations?
7. Which runtime topology options can prove failure/privilege containment while remaining Builder-independent?
8. Can an acquired extension dependency closure restart fully offline after Builder/marketplace loss?

## Symbiotic Proof

Define one capability-owned extension point and two compatible implementations from different distribution sources. Acquire and verify extension A, then demonstrate a separate explicit admission decision; install it without activating; resolve its requirements to a recorded wiring; grant only bounded authority; activate it and record runtime placement. Disable it without deleting owned state, reactivate it, then replace it with B while preserving semantic contract identity. Demonstrate a rejected publisher/dependency-trust case, a failed resolution case, an activation failure, and an uninstall where retirement evidence proves affected extension-owned state. Finally restart the generated runtime with the Builder/original marketplace unavailable using retained artifacts, trust material and bindings.

## Stable findings

- **G2-FINDING-EXT-11 — Marketplace Publication, Artifact Verification and Runtime Admission Are Distinct Decisions.** A signed/published artifact can still be denied by publisher, organization, workspace or runtime policy. Value HIGH; supply-chain/security risk CRITICAL; priority P0; next question: which existing governance evidence primitive can carry admission policy revision?
- **G2-FINDING-EXT-12 — Declared Compatibility and Resolved Extension Wiring Are Distinct Evidence.** Requirements/capabilities state intent; the selected host/dependency wiring proves the realized compatibility context. Value HIGH; evolution risk HIGH; priority P0; next question: can Provider/Binding negotiation own the generic resolver primitive without absorbing extension lifecycle?
- **G2-FINDING-EXT-13 — Disable/Deactivate and Uninstall/Owned-State Retirement Are Distinct Lifecycles.** Non-execution does not prove durable extension data was deleted or migrated. Value HIGH; data/governance risk HIGH; priority P0; next question: how is affected extension-owned state scoped and evidenced?
- **G2-FINDING-EXT-14 — Dependency Trust Propagation Is Policy, Not a Universal Consequence of Dependency Edges.** Ecosystems may transit trust across packs/dependencies, but Generation 2 must make propagation explicit, revisioned and governable. Value HIGH; privilege/supply-chain risk CRITICAL; priority P0; next question: how does dependency-graph trust compose with authorization without creating a second authority plane?
- **G2-FINDING-EXT-15 — Runtime Placement/Process Separation Does Not Prove Privilege Isolation.** A separate extension host can retain broad host permissions; isolation must be evidenced as qualified capabilities and enforced boundaries. Value HIGH; security/resilience risk CRITICAL; priority P0; next question: which runtime providers can prove filesystem/network/process/secret boundaries?
- **G2-FINDING-EXT-16 — Extension API Compatibility and Extension-owned State Migration Are Separate Proof Obligations.** Serving/coexisting API revisions does not prove persisted state has migrated or can roll back. Value HIGH; migration risk HIGH; priority P1; next question: how can Data/Lifecycle proof obligations be referenced without moving ownership into Extension?

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-EXTENSION-ADMISSION-DECISION-EVIDENCE` — CROSS_CUTTING. Evidence: VS Code signature verification + publisher trust + organization allow/block + workspace trust; OSGi install/resolve separation. Candidate pending Governance/Security synthesis.
- `G2-CAPABILITY-CANDIDATE-RESOLVED-EXTENSION-WIRING-EVIDENCE` — CORE. Evidence: OSGi resolver/wiring + Backstage bounded extension-point targeting + host compatibility mechanisms. Candidate pending Provider/Binding synthesis to avoid duplication.
- `G2-CAPABILITY-CANDIDATE-EXTENSION-STATE-RETIREMENT-EVIDENCE` — CROSS_CUTTING. Evidence: WordPress deactivate/uninstall distinction + Kubernetes storage-version migration + prior Data affected-scope findings. Candidate pending Lifecycle/Data synthesis.

No candidate is promoted during this revisit.

## Saturation assessment

Principal representatives are now DEEP, but this revisit produced six material architectural findings. `consecutive_no_material_finding = 0`; capability remains NOT SATURATED. A later revisit must test the unresolved boundaries, and saturation still requires two consecutive no-material revisits or repository-dependent exhaustion according to the pipeline rule.
