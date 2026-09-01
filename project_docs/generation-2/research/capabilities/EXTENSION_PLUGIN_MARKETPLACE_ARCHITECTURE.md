# Extension / Plugin / Marketplace Architecture — Generation 2 dossier

Status: FIRST DEEP PASS / NOT SATURATED

## Research question

Which portable primitives let a generated system accept independently versioned extensions, resolve compatibility, activate them safely, govern their authority and replace distribution/runtime providers without allowing the plugin mechanism or marketplace to become a second semantic source of truth?

## Representatives and evidence/source ledger

| Representative | Coverage | Evidence extracted |
|---|---|---|
| Backstage backend plugins/modules | DEEP | Plugins own typed extension points; modules extend a single target plugin through those points and initialize before the plugin. Extension-point contracts are exported separately to evolve independently. Official: https://backstage.io/docs/backend-system/architecture/modules/ and https://backstage.io/docs/next/backend-system/architecture/extension-points/ |
| VS Code extensions | DEEP | Manifest separates publisher/name/version, host compatibility (`engines.vscode`), contributions, activation events, extension dependencies, runtime location and restricted-workspace capabilities. Marketplace signing and publisher trust are install-time controls distinct from runtime behavior. Official: https://code.visualstudio.com/api/references/extension-manifest , https://code.visualstudio.com/api/advanced-topics/extension-host , https://code.visualstudio.com/docs/configure/extensions/extension-marketplace |
| Kubernetes CRDs/operators | DEEP | CRDs add typed/versioned APIs without modifying Kubernetes core; served/storage versions and conversions are explicit; operators/controllers add behavior against custom resources while RBAC/audit remain separate host authorities. Official: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/ , https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definition-versioning/ , https://kubernetes.io/docs/concepts/extend-kubernetes/operator/ |
| OSGi | DEEP | Bundles have explicit installed-instance identity/lifecycle; capabilities advertise versions while requirements use ranges; package/service boundaries support independent evolution and resolution. Official: https://docs.osgi.org/specification/osgi.enterprise/7.0.0/service.namespaces.html and https://docs.osgi.org/javadoc/r4v43/core/org/osgi/framework/Bundle.html |
| WordPress plugins/hooks | PARTIAL | Hooks are explicit extension points; activation, deactivation and uninstall have different lifecycle semantics; plugin requirements are validated before activation. Useful contrast, but sandbox/trust/dependency-resolution semantics are weaker than the other representatives. Official: https://developer.wordpress.org/apis/hooks/ and https://developer.wordpress.org/plugins/plugin-basics/activation-deactivation-hooks/ |

## Source of truth and universal primitive decomposition

A convergent portable chain is:

`Extension Contract/Point -> Extension Manifest/Artifact -> Compatibility Requirements -> Resolution -> Installation Instance -> Trust/Authority Decision -> Activation Instance -> Extension Execution -> Lifecycle/Evidence`

Distribution is adjacent, not authoritative:

`Registry/Marketplace -> Artifact locator + metadata + provenance`.

The host/core remains source of truth for canonical semantics and extension-point contracts. An extension implementation may contribute behavior through bounded contracts; a marketplace only discovers/distributes artifacts; an installed extension does not become active merely because its package is present; and self-declared permissions never grant authority without host enforcement.

## Identity

- Extension logical identity is distinct from artifact revision/digest, publisher identity, marketplace listing and installation instance.
- Installation identity is host/environment scoped; OSGi explicitly preserves an installed bundle identity across update but creates a new identity after uninstall/reinstall.
- Activation/execution identity is distinct from installation and should bind extension revision, resolved host contract and authority context.
- Extension point identity belongs to the host capability that owns the semantic boundary, not to a marketplace package.

## Lifecycle

`publish/discover -> fetch/verify -> resolve compatibility/dependencies -> install -> configure/bind -> authorize/trust -> activate -> execute/observe -> update/migrate -> deactivate -> rollback/uninstall -> retain evidence`.

VS Code demonstrates lazy activation after installation. WordPress distinguishes deactivation from uninstall. Kubernetes shows version coexistence and explicit conversion during API evolution. OSGi separates INSTALLED, RESOLVED, STARTING, ACTIVE, STOPPING and UNINSTALLED.

## Versioning and compatibility

Version separately: extension contract/point; extension manifest schema; extension artifact; host API/capability; dependency requirements; provider/binding contract; persisted extension-owned data; marketplace metadata/provenance. Compatibility should be evaluated from explicit requirements/capabilities and version ranges rather than inferred from package names or a single product version. Kubernetes further demonstrates that served representation and storage version may differ safely during migration.

## Failure semantics

- Artifact verified but host-incompatible: reject resolution/activation without corrupting the installed set.
- Dependency unavailable/incompatible: unresolved, not partially active.
- Activation failure: retain installation and diagnostic evidence; do not infer successful execution.
- Extension crash or misbehavior: isolate failure as far as the host model permits; host health and extension health remain distinct.
- Migration/update failure: activation of the new revision and rollback capability depend on extension data/schema semantics and must be explicit.
- Marketplace unavailable after artifact acquisition: must not automatically stop an autonomous runtime.
- Signature valid but publisher/policy untrusted: verification succeeds cryptographically while authorization still fails.

## Extensibility and provider boundaries

Portable semantics should own extension identity, manifest requirements, extension-point contract identity, declared capabilities/permissions, lifecycle intent, bindings and evidence. Package format, process/WebWorker/container isolation, registry protocol, signature service, dependency resolver implementation and marketplace UX are provider/host mechanisms.

Backstage is especially strong on bounded ownership: modules can extend only their target plugin through exported extension points. Kubernetes similarly keeps CRD schema/API authority distinct from controller implementation. These patterns argue against arbitrary mutation of the Generation 2 portable definition by plugin code.

## Governance and trust

Trust is multidimensional: artifact integrity/provenance, publisher identity, compatibility, requested permissions/capabilities, workspace/environment trust, administrative approval and runtime policy. VS Code explicitly verifies marketplace signatures while separately asking users to trust third-party publishers and restricting extensions in untrusted workspaces. Kubernetes CRDs inherit host authentication/authorization/audit, while operators require explicit RBAC. Marketplace presence therefore must never equal execution authority.

## Observability

Evidence should cover resolution, selected dependency revisions, verification result, install/update/uninstall, activation/deactivation, granted authority, bindings, crashes/health and extension-originated governed actions. Extension evidence must correlate to the generated runtime and extension artifact without leaking provider locators into logical identity.

## Portability and lock-in

Portable manifests and explicit extension contracts reduce lock-in, but host APIs, package formats, sandbox models, marketplace metadata, proprietary contribution points and persistence models remain strong coupling points. Generated-system autonomy requires extension artifacts and trust evidence to remain resolvable after Builder handoff and runtime bindings to be reconfigurable independently of business semantics.

## Product-specific mechanisms vs universal primitives

Product-specific: VSIX/Visual Studio Marketplace, Backstage package conventions, Kubernetes CRD storage/API machinery, OSGi bundle format/resolver, WordPress PHP hook loading.

Universal candidates: extension logical identity; extension artifact revision; extension-point/contract identity; requirement/capability compatibility; dependency set; installation instance; activation instance; permission/capability request; trust decision; provider binding; lifecycle evidence; distribution reference.

## Convergent patterns

1. Extension contract ownership stays with the host/core capability.
2. Package installation, compatibility resolution and activation are distinct lifecycle stages.
3. Compatibility is multidimensional and version-aware.
4. Extension execution authority is host-enforced, not self-declared.
5. Distribution/marketplace and runtime execution are separate planes.
6. Extension/version migration needs explicit coexistence or rollback semantics.
7. Isolation reduces blast radius but is not equivalent to trust.

## Divergent patterns

- Backstage favors trusted in-process modules; VS Code uses extension hosts; Kubernetes operators commonly run as separate workloads; OSGi resolves modules inside a framework. Isolation is therefore provider-specific.
- Kubernetes extends a typed resource/API model, while WordPress hooks expose procedural callbacks; both are extension mechanisms but with very different semantic guarantees.
- Marketplace signing/trust varies substantially; some ecosystems rely mostly on repository/administrator trust.

## Subcapabilities

Extension contracts/points; manifests; compatibility negotiation; dependency resolution; artifact acquisition/provenance; installation inventory; activation; capabilities/permissions; isolation/sandboxing; configuration/provider bindings; extension-owned state/migrations; upgrade/rollback/uninstall; health/evidence; registry/marketplace discovery; publisher/trust governance; runtime autonomy.

## Fresh-main System Builder comparison

Fresh `main` inspected at `38af853b78670ff0ea3bc347633299d4aed68a20`.

Concrete evidence exists for provider-neutral declarations and bindings: `SystemDefinition` product tests contain declared `capabilities`; authentication providers require `id` + `bindingRef`; P13 runtime-services evidence demonstrates activation-time resolution of external-service bindings while the generated runtime executes only declared integrations and does not import provider-specific infrastructure. The P13 report explicitly says files remain local-filesystem bound and integrations are bounded HTTP rather than a general provider SDK/connector framework.

This supports **KEEP + HARDEN + GENERALIZE** for capability/binding separation as a possible foundation. It does **not** prove extension manifests, extension points, plugin installation/activation, dependency resolution, marketplace, sandbox, plugin trust policy or extension lifecycle implementation. Those remain future repository-validation questions rather than inferred product gaps.

## Hypotheses

- KEEP — canonical semantic authority in SystemDefinition/runtime contracts and activation-time provider binding.
- HARDEN — make compatibility, trust/authority and lifecycle evidence explicit if extension architecture is later admitted.
- GENERALIZE — requirement/capability negotiation for extension contracts only where later synthesis shows reuse with providers/build/runtime.
- PROVIDERIZE — registry/marketplace, artifact transport, signature verification implementation, isolation runtime and package-specific loaders.
- INTEGRATE — extension mechanism only through explicit capability-owned extension points and generated-runtime proof.
- DEFER — broad public marketplace economics/discovery/reviews until extension contracts and governance are mature.
- DO_NOT_BUILD — an unrestricted plugin model that can mutate canonical portable semantics or gain authority from installation alone.

## Repository validation questions

1. Do any current packages expose stable extension points or only internal TypeScript APIs?
2. Can SystemDefinition represent an extension requirement without leaking package/provider identity into portable semantics?
3. Where would extension compatibility be evaluated relative to existing capability/provider bindings?
4. Is there any durable installation/activation inventory today, or only build-time dependency inclusion?
5. Which generated-runtime process boundaries could isolate extensions without reintroducing Builder dependency?
6. How would extension-owned schema/data migration compose with the existing migration ledger?
7. Can artifact/provenance mechanisms already verify extension revisions independently of a marketplace?
8. Which authority plane would approve extension capabilities, secrets and runtime effects?

## Symbiotic Proof

A convincing Generation 2 proof should define one capability-owned extension point, install extension A from a verified artifact, reject an incompatible revision before activation, activate A only after explicit authority/binding resolution, preserve business semantic authority in the portable definition, replace A with compatible extension B from a different distribution source, migrate or preserve extension state safely, demonstrate bounded failure/isolation, and continue operating after the Builder/marketplace is unavailable while retaining install/activation/trust evidence.

## Stable findings

- **G2-FINDING-EXT-01 — Extension Logical Identity, Artifact Revision, Installation and Activation Are Distinct Identities.** Value HIGH; lifecycle/audit risk HIGH; priority P0.
- **G2-FINDING-EXT-02 — Extension Points Are Capability-Owned Contracts, Not Extension-Owned Semantic Authority.** Value HIGH; architecture risk CRITICAL; priority P0.
- **G2-FINDING-EXT-03 — Installation Does Not Imply Compatibility, Trust, Authorization or Activation.** Value HIGH; security risk CRITICAL; priority P0.
- **G2-FINDING-EXT-04 — Compatibility Must Resolve Explicit Requirements/Capabilities and Version Context.** Value HIGH; evolution risk HIGH; priority P0.
- **G2-FINDING-EXT-05 — Distribution/Marketplace Is Separate from Artifact Trust and Runtime Authority.** Value HIGH; supply-chain/lock-in risk HIGH; priority P0.
- **G2-FINDING-EXT-06 — Declared Extension Permissions Require Host-Enforced Authority.** Value HIGH; privilege risk CRITICAL; priority P0.
- **G2-FINDING-EXT-07 — Isolation Is a Qualified Provider Capability, Not a Universal Sandbox Boolean.** Value HIGH; resilience/security risk HIGH; priority P1.
- **G2-FINDING-EXT-08 — Extension Update/Rollback Must Include Contract and Owned-State Compatibility.** Value HIGH; migration risk HIGH; priority P1.
- **G2-FINDING-EXT-09 — Extension Lifecycle and Trust Decisions Require Durable Evidence.** Value HIGH; governance risk HIGH; priority P1.
- **G2-FINDING-EXT-10 — Runtime Autonomy Requires Extension Artifacts, Bindings and Trust Evidence Independent of the Builder/Marketplace.** Value HIGH; handoff/availability risk HIGH; priority P0.

## Capability candidates

- `G2-CAPABILITY-CANDIDATE-EXTENSION-CONTRACT-RESOLUTION` — CORE. Evidence: Backstage extension points + OSGi requirement/capability resolution + VS Code host compatibility. Promotion requires synthesis proving it is materially distinct from Provider/Binding/Capability Negotiation.
- `G2-CAPABILITY-CANDIDATE-EXTENSION-TRUST-AUTHORITY` — CROSS_CUTTING. Evidence: VS Code signatures/publisher/workspace trust + Kubernetes RBAC/audit + extension permissions. Promotion requires recurrence in Governance/Security/Authorization reconciliation.
- `G2-CAPABILITY-CANDIDATE-EXTENSION-LIFECYCLE-EVIDENCE` — CROSS_CUTTING. Evidence: OSGi lifecycle + WordPress activation/deactivation/uninstall + Kubernetes version migration. Promotion requires recurrence in Lifecycle/Provenance rather than remaining an Extension subcapability.

## Next question

How should Generation 2 represent governance, compliance and audit as cross-cutting policy/evidence without turning governance metadata into runtime business authority or coupling generated systems to a central compliance provider?