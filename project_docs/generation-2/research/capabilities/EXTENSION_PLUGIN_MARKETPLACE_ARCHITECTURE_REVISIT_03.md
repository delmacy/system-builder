# Extension / Plugin / Marketplace Architecture — Revisit 03

Status: REVISIT CYCLE 4 / MATERIAL NEW FINDINGS / NOT SATURATED

## Research question
How should Generation 2 model extension/package identity, install/resolve/enable/activate/runtime realization, versioned capability declarations, trust/revocation, offline closure, Station exposure and AI authority so an extension ecosystem remains portable without converting discovery, signature, package presence or loader execution into semantic or execution authority?

## Representatives and evidence ledger
| Representative | Coverage | Evidence extracted |
|---|---|---|
| Terraform provider ecosystem | DEEP | Provider source address/version constraints, dependency lock/checksums, registry/mirror installation source, signed packages and versioned plugin protocol are distinct. Registry discovery is separate from runtime RPC. Mirrors support air-gapped installation. |
| VS Code extensions | DEEP | Marketplace signature verification, publisher trust, Workspace Trust/restricted operation and install/enablement remain separate controls. Restricted Mode can disable or limit extension behavior. |
| OSGi Core | DEEP | Bundle identity persists across update while each update creates a new BundleRevision; installed/resolved/starting/active/stopping/uninstalled are explicit lifecycle states. Old in-use wirings can coexist after update until refresh/restart. Lifecycle changes require explicit AdminPermission. |
| Backstage plugins/modules | DEEP | Plugin identity/extension points are explicit; plugins are package-distributed features, plugin IDs are unique within an app, extension predicates may gate a plugin, backend modules extend one owning plugin through extension points, and plugin communication stays behind declared libraries/services/network boundaries. |
| Kubernetes extensibility/admission | PARTIAL | Admission/webhook extension mechanisms demonstrate that extensibility can be loaded while host admission policy remains authoritative; recent manifest-based admission also shows locally bootstrapped policy independent of centralized API state. |

### Primary sources
- Terraform plugin protocol, provider registry/mirror, signing, lock-file and plugin-management documentation.
- VS Code Extension Marketplace and Workspace Trust documentation.
- OSGi Core lifecycle and BundleRevision documentation.
- Backstage frontend/backend plugin architecture, installation, permissions and package-structure documentation.
- Kubernetes manifest-based/webhook admission documentation.

## Stable primitives
`ExtensionSemanticIdentity → ManifestRevision → DeclaredCapabilitySet → ArtifactRevision → DependencyClosure → Integrity/ProvenanceEvidence → AdmissionDecision → InstallationInstance → Resolution/WiringRevision → ScopedEnablement → ActivationInstance → RuntimeRealization → OperationalEvidence → Revocation/Disablement/RetirementEvidence`

The cycle-4 refinement is that **resolution/wiring is first-class**. Installation is not proof that declared dependencies/capabilities resolved to a valid runtime graph, and activation is not proof that the effective wiring remains current.

## Identity, lifecycle, versioning and failure semantics
OSGi provides decisive counter-evidence to package-presence models: a bundle keeps identity across update while new `BundleRevision` objects and wirings may coexist. Therefore Generation 2 should distinguish extension semantic identity, manifest/artifact revision, dependency-resolution revision, installation instance and activation instance. `install succeeded` may still be followed by resolve failure, activation failure, stale in-use wiring or context denial.

Terraform adds a second independent pattern: source address and selected version are semantic dependency coordinates; registry/mirror is installation realization; the lock file records selected versions/checksums; plugin protocol version constrains runtime compatibility. Thus **distribution compatibility, package integrity, protocol compatibility and semantic capability compatibility are four separate predicates**.

## Trust, admission, revocation and containment
Signature/checksum answers artifact integrity/provenance, not execution trust. Publisher trust answers actor/source trust, not host authority. Workspace/organization policy answers contextual admission, not runtime containment. Runtime containment itself must be evidenced by the actual filesystem/network/secret/process/API boundaries enforced by the realization.

Revocation must be revision-aware. A marketplace removal or trust-root change can make future installation/activation inadmissible while historical running instances or already-resolved wirings may require explicit disable/stop/reconcile action. Generation 2 must therefore preserve `RevocationDecision → AffectedRealizationSet → EnforcementAttempt → PostconditionEvidence` rather than assuming catalog removal is runtime revocation.

## Extensibility and provider boundaries
Backstage reinforces that extension-point ownership belongs to the host/plugin contract, not to the extension package. Terraform reinforces that a provider process implements a versioned host protocol but owns provider-specific domain behavior. Therefore an extension may declare capabilities only through host-owned contracts; it cannot create new host authority by declaring itself capable of an operation.

Recommended boundary:
- host owns extension points, capability vocabulary, admission classes and authority semantics;
- extension owns implementation-specific realization and declared compatibility;
- provider/loader/registry owns distribution/runtime mechanics;
- policy decides whether a realization may be admitted and exposed.

## Qualified local/offline closure
Air-gapped extension autonomy requires a profile-scoped closure containing: semantic requirement; exact manifest/artifact revisions; complete dependency closure for target platform; compatibility/protocol metadata; signatures/checksums and trust roots; extension-point/capability schemas; admission-policy revision/evidence; loader/runtime prerequisites; configuration/secrets references without secret disclosure; rollback artifacts when required; and verification tools/evidence needed to reinstall, resolve, activate and diagnose locally.

A registry or marketplace is not part of semantic identity. Terraform mirrors directly prove installation origin can be replaced without changing provider source identity. Offline closure therefore strengthens the existing `QUALIFIED-LOCAL-CLOSURE-PROFILE` consolidation candidate.

## Adaptive Governed Work Surfaces / Station boundary
`Enterprise → Station → Role → Person` remains non-amplifying. A Station may expose only admitted extension-provided capabilities. Lower layers may select or arrange components over those capabilities but cannot install a package, weaken admission, switch to an untrusted realization, widen extension permissions or request a new extension point.

AI remains sole materializer for AGWS changes, but `AI materialization authority ≠ extension installation authority ≠ extension admission authority ≠ host-extension-point authority`. If a requested surface needs code/package installation, broader runtime permissions or a new canonical extension point, the result is an escalation/candidate artifact, not silent installation.

## Product-specific versus universal
Product-specific: VSIX/extension host/private marketplace; Terraform provider addresses, registry/mirror and gRPC plugin protocol; OSGi bundle/wiring runtime; Backstage NPM/plugin packages and extension blueprints; Kubernetes webhook/admission configuration.

Universal: semantic extension identity; manifest/artifact revision; declared capability set; dependency-resolution/wiring revision; integrity/provenance evidence; admission decision; installation instance; scoped enablement; activation instance; runtime realization; revocation decision; enforcement/postcondition evidence; qualified local closure.

## Convergent patterns
1. Package/artifact identity is not semantic extension identity.
2. Installation, dependency resolution, enablement and activation are distinct states.
3. Multiple revisions/wirings may coexist during evolution; update is not instantaneous semantic replacement.
4. Signature/publisher trust/admission/containment are distinct decisions.
5. Extension points and authority vocabulary remain host-owned.
6. Marketplace/registry discovery is replaceable infrastructure, not semantic authority.
7. Revocation requires enforcement evidence against actual realizations.
8. Station/AGWS/AI cannot amplify extension authority.

## Divergences
VS Code favors broad extension execution with trust overlays; Terraform favors narrow RPC provider contracts; OSGi has explicit resolver/wiring lifecycle; Backstage often composes trusted application packages; Kubernetes admission extensions can participate in host control paths. Generation 2 should not universalize any single loader/sandbox model, only the lifecycle/authority/evidence boundaries.

## Fresh-main comparison
A bounded fresh-`main` search for `extension plugin marketplace provider capability binding registry` returned no matching code-search result. This is evidence only about that query, not repository-wide absence. Prior evidence-backed capability/binding and runtime-autonomy findings remain the comparison baseline; exhaustive repository archaeology remains reserved for PLANNING_B.

## Reconciliation hypotheses
- **KEEP** portable capability/binding and runtime-autonomy principles.
- **HARDEN** resolution/wiring revision, activation evidence, revocation enforcement and containment evidence.
- **GENERALIZE** semantic-requirement→realization and unified evidence qualification if later synthesis confirms cross-capability reuse.
- **PROVIDERIZE** registry/marketplace/mirror, package format, loader, sandbox/process placement and update transport.
- **INTEGRATE** only through host-owned extension points and capability contracts.
- **DEFER** commercial/social marketplace features until trust/admission/revocation foundations exist.
- **DO_NOT_BUILD** package-as-semantic-identity, signature-as-authority, auto-install from AGWS/AI, or extension-declared permissions that self-grant authority.

## Repository-validation questions
1. Can capability/binding contracts represent extension-provided capabilities independently of package coordinates?
2. Is there a reusable current primitive for install/resolve/enable/activate/revoke evidence?
3. Can dependency closure and artifact/provenance evidence be preserved per target platform offline?
4. Where can Station exposure reference extension capabilities without obtaining installation/admission authority?
5. Can runtime boundaries prove actual filesystem/network/secret/API containment?
6. Can provider/extension revisions coexist without silently rebinding existing executions?
7. Can revocation enumerate and reconcile all affected active realizations?
8. Where must AI requests requiring executable code/package introduction escalate?

## Symbiotic Proof
Declare one semantic extension capability with realizations A and B. Resolve A from an online registry, pin artifact/dependency/protocol evidence, admit and install it, prove `installed` before `resolved` and `resolved` before `active`, then expose only the bounded capability to one Station. Rehost the same closure through an offline mirror and reinstall without changing semantic identity. Upgrade to A2 while preserving evidence for an old in-use execution, then prove coexistence/reconciliation is explicit. Revoke A/A2, enumerate affected realizations and prove future activation is blocked with postcondition evidence. Switch to compatible B without changing the semantic requirement. Finally request through AGWS/AI an extension requiring a new package and broader host authority and prove escalation rather than installation.

## Stable findings
- **G2-FINDING-EXT-23 — Extension Installation, Dependency Resolution/Wiring, Scoped Enablement and Activation Require Separate Revisioned Evidence.** Value HIGH; lifecycle/compatibility risk CRITICAL; priority P0.
- **G2-FINDING-EXT-24 — Extension Update Can Create Coexisting Revisions/Wiring; New Package Revision Does Not Atomically Replace Effective Runtime Semantics.** Value HIGH; migration/runtime risk HIGH; priority P0.
- **G2-FINDING-EXT-25 — Distribution Compatibility, Integrity, Protocol Compatibility and Semantic Capability Compatibility Are Distinct Admission Predicates.** Value HIGH; portability/security risk CRITICAL; priority P0.
- **G2-FINDING-EXT-26 — Revocation Is a Governed Transition Over Concrete Realizations and Requires Enforcement/Postcondition Evidence; Marketplace Removal Is Not Runtime Revocation.** Value HIGH; security/governance risk CRITICAL; priority P0.
- **G2-FINDING-EXT-27 — Extension Points and Authority Vocabulary Must Remain Host-Owned; Declared Extension Capabilities Cannot Self-Grant Authority.** Value HIGH; constitutional risk CRITICAL; priority P0.
- **G2-FINDING-EXT-28 — Qualified Local Extension Closure Must Preserve Resolution, Trust, Compatibility and Runtime Inputs, Not Merely Package Artifacts.** Value HIGH; self-hosting/air-gap risk HIGH; priority P0.
- **G2-FINDING-EXT-29 — Station/AGWS/AI Extension Composition Must Remain Non-Amplifying Across Install, Admission, Runtime and Host-Contract Authorities.** Value HIGH; authority risk CRITICAL; priority P0.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-EXTENSION-RESOLUTION-WIRING-REVISION-EVIDENCE` — CROSS_CUTTING / MERGE_TARGET. Test against unified revision-bound realization/evidence lineage.
- `G2-CAPABILITY-CANDIDATE-GOVERNED-EXTENSION-REVOCATION-ENFORCEMENT-TRANSITION` — CROSS_CUTTING / MERGE_TARGET. Test against shared governed migration/transition and non-actuating authority separation.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-EXTENSION-RESOLUTION-EXECUTION-CLOSURE` — CROSS_CUTTING / MERGE_TARGET. Test against qualified local closure profile.
- `G2-CAPABILITY-CANDIDATE-EXTENSION-OPERATIONAL-COMPLEXITY-EVIDENCE-FACTORS` — CROSS_CUTTING / FEEDS_PENDING_RESEARCH. Dependency fan-out, runtime isolation strength, platform matrix, external providers, offline closure burden, update/revocation complexity and privileged authority are measurable evidence inputs; Extension must not own pricing/billing.

No capability candidate is promoted.

## Saturation
Principal representatives are strongly covered but this revisit produced seven material findings. `consecutive_no_material_finding = 0`; **NOT SATURATED**. Governance, Provider/Binding, Lifecycle, Security and Self-hosting revisits remain necessary consolidation checks.
