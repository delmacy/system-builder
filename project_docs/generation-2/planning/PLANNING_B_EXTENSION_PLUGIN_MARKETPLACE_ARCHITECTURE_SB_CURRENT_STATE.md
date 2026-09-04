# Planning B — Extension / Plugin / Marketplace Architecture — SB Current-State Reconciliation

Status: PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED
Phase: PLANNING_B_SB_CURRENT_STATE_RECONCILIATION
Canonical capability: Extension / Plugin / Marketplace Architecture
Fresh-main anchor: `d8760c7f08757bb164a758ae0c3f0a4a1752464b`

This artifact reconciles current System Builder repository evidence against the already-closed Planning A boundary. It does not define target architecture, execute product code, materialize Work Packages/TASKs, enter Construction, or advance to Planning C.

## 1. Current-state question

What extension/plugin/marketplace semantics actually exist on fresh main, which narrower predecessor seams can be preserved, and which Planning A obligations remain unevidenced?

The governing distinction remains:

`package/provider registration != canonical extension identity != admission != granted authority != effective runtime capability`.

## 2. Evidence inspected

### 2.1 AI Gateway replaceable provider seam

`packages/contracts/ai-gateway/index.ts` defines versioned provider-neutral `ModelRequest` / `ModelResponse` contracts, deterministic capability/limit descriptors and a narrow `ModelProviderAdapter` with only `invoke(request)`. Provider identity is not embedded in the canonical request contract.

This is meaningful evidence for a replaceable realization seam, but it is a provider adapter boundary rather than a generalized plugin system. It does not establish extension identity, installation, activation, permissions, signing, marketplace publication or sandbox semantics.

### 2.2 Capability/provider/version materializer registry predecessor

Fresh-main history and product evidence show a bounded deterministic Compiler-local materializer registry keyed by exact capability/provider/version identity. The reference tuple `state.counter / system-builder.postgres-counter / 1.0.0` resolves through that boundary; unsupported selected providers fail deterministically rather than silently falling back.

This is a useful registration/lookup predecessor for concrete generated-runtime mechanics. Its provider/version key is not evidence that the provider tuple is a canonical extension identity, nor that registration implies admission or authorization.

### 2.3 Public contract extension mechanics

Existing public artifact-contract evidence includes bounded optional/required extension fields. Those mechanics prove that SB already has contract-level extensibility at a specific envelope boundary.

They do not prove executable extension packages, extension points, dependency installation, permissions, isolation, lifecycle, marketplace governance or runtime activation.

### 2.4 Repository-wide negative search

Fresh-main code search for marketplace/plugin and install/enable/disable-style plugin concepts did not locate a generalized Extension / Plugin / Marketplace implementation. The absence is treated as current-state non-evidence, not as a prescription to build a subsystem.

## 3. Current implemented predecessors

Fresh main evidences several bounded primitives relevant to later extension architecture reconciliation:

- provider-neutral contracts separated from concrete provider adapters;
- explicit contract revisions and fail-closed unsupported-version handling;
- deterministic capability/provider/version selection at a bounded Compiler materialization registry;
- deterministic failure for unsupported selected provider/version tuples;
- bounded public contract extension mechanics;
- provider-neutral canonical request identity in AI Gateway;
- generated-runtime materialization that does not require converting provider identifiers into canonical business identity;
- repository architecture discipline that keeps provider mechanics behind explicit seams.

These are predecessors, not a generalized plugin platform.

## 4. What fresh main does not evidence

Repository evidence does not establish a generalized Extension / Plugin / Marketplace Architecture implementing the Planning A semantics. In particular, fresh main does not evidence:

- first-class canonical extension identity and independent extension revision lineage;
- governed mapping among extension identity, package coordinates, marketplace listing IDs, provider IDs and runtime instance IDs;
- extension discovery/registration lifecycle distinct from installation and admission;
- revisioned extension-point contracts with compatibility qualification;
- explicit requested-capability, granted-capability and effective-capability states;
- install, activate/enable, deactivate/disable, update, revoke and uninstall lifecycle records;
- dependency graph resolution specifically for extension packages with cycle/conflict disposition tied to extension admission;
- extension signing/attestation/provenance qualification and current trust evidence;
- sandbox/isolation/containment boundaries for executable extensions;
- per-extension resource, network, secret, data or host-API permission enforcement;
- marketplace publisher/listing/review/distribution governance;
- explicit marketplace/provider support qualification separate from extension admission;
- generated-runtime proof that admitted extensions remain portable/autonomous independent of Builder control-plane availability;
- current evidence-qualified extension rollback eligibility;
- update/migration/cutover semantics for extension state;
- generic ambiguous activation/deactivation effect reconciliation;
- failure-domain containment preventing one extension from silently widening system blast radius;
- residual extension cohort inventory/drainage for processes, workers, sessions, jobs, subscriptions, credentials, caches or clients;
- qualified extension/provider/marketplace substitution with proof that canonical identity and authority are preserved.

Absence of these constructs is recorded only as an unevidenced current-state gap.

## 5. Identity and registration boundary

The strongest current registration predecessor is keyed by exact capability/provider/version for bounded materialization. That key is useful operational selection data but does not establish a canonical extension subject.

Likewise, `ModelProviderAdapter` makes a realization replaceable without putting provider identity in canonical model requests. This supports the Planning A requirement that provider/external IDs remain non-canonical unless explicitly adopted through a governed process.

Disposition: **KEEP + HARDEN** the existing identity separation. Do not reinterpret capability/provider/version tuples or marketplace/provider IDs as canonical extension identity.

## 6. Extension-point and compatibility semantics

Fresh main has versioned public contracts and narrow adapter interfaces. These prove that explicit contract boundaries can exist and that unsupported versions can fail closed.

No inspected evidence establishes a generalized extension-point registry, host-extension compatibility matrix, dependency compatibility qualification or admission based on host/API revision evidence.

Disposition: **KEEP** bounded versioned contracts; **GENERALIZE / INTEGRATE** only if later target-architecture evidence establishes a reusable owner. Generalized extension compatibility remains **DEFER** at Planning B.

## 7. Admission, authority and permissions

No fresh-main evidence was found for generalized extension permission manifests or the Planning A three-stage authority distinction:

`requested -> granted -> effective`.

Provider capability advertisement and provider selection are not equivalent to an extension permission grant. Installation or presence would likewise not imply authority.

Preserve the monotonic authority hierarchy:

`Enterprise -> Station -> Role -> Person`.

AI and Adaptive Governed Work Surfaces have no evidenced authority to install, admit, grant, activate or widen extension permissions, nor to infer a grant from package/provider metadata.

Disposition: **DO_NOT_BUILD authority amplification**; generalized permission/admission machinery is **DEFER** because it is not present on fresh main.

## 8. Lifecycle, upgrade and rollback

Current repository evidence contains lifecycle/versioning foundations in other bounded owners, but no extension-specific install/enable/disable/update/revoke/uninstall lifecycle was found. Likewise, no current extension rollback eligibility or extension-state migration semantics are evidenced.

A package being replaceable or a prior deployment being restorable cannot be promoted to proof that an arbitrary extension revision is rollback-safe.

Disposition: **INTEGRATE** with Lifecycle/Versioning, Deployment/Runtime and Security boundaries later without absorbing their semantics; current generalized extension lifecycle claims remain **DEFER**.

## 9. Containment, failure and ambiguous effects

The AI provider seam can propagate provider failure and preserve canonical request/response boundaries, but that is not evidence of generalized plugin sandboxing or host failure containment.

Fresh main does not establish generic `APPLIED | NOT_APPLIED | PARTIAL | UNKNOWN` extension activation/deactivation effects or reconcile-before-retry semantics. Therefore a timeout/ambiguous host/provider result cannot be treated as proof that an extension was or was not activated.

Disposition: **HARDEN** the distinction between adapter failure handling and extension containment. Generic ambiguous mutation semantics remain **DEFER / INTEGRATE** with UCA, Integration and Security.

## 10. Marketplace/provider boundary and portability

No generalized marketplace catalog, publisher trust, listing identity, distribution entitlement or marketplace-specific lifecycle was found. Existing provider seams are intentionally narrow and should not be upgraded into marketplace architecture by inference.

Concrete provider or marketplace mechanics, if later required, belong behind providerized boundaries; canonical extension identity, authority and lifecycle semantics must remain provider-neutral according to the closed Planning A boundary.

Disposition: **PROVIDERIZE** only concrete external mechanics; **DO_NOT_BUILD** canonical dependence on marketplace/provider identity.

## 11. Generated-runtime autonomy and residual cohorts

Existing runtime autonomy proofs elsewhere in Planning B establish that generated Runtime can continue operating without Builder/Observe control-plane availability. They do not prove extension-specific autonomy, portability or upgrade behavior.

No fresh-main evidence establishes residual extension cohort inventory/drainage after disable, revoke, update or provider substitution. A future/current operation cannot be called converged merely because the control-plane record changed while old workers/sessions/jobs/subscriptions/credentials/caches/clients could remain effective.

Disposition: retain autonomy as adjacent evidence only; extension-specific autonomy/drainage remains **DEFER**.

## 12. Planning B dispositions

- **KEEP** provider-neutral adapter seams and versioned contracts already present.
- **KEEP** deterministic capability/provider/version materializer lookup as a bounded realization predecessor.
- **KEEP** bounded public-contract extension mechanics where they already apply.
- **HARDEN** provider/package/registry identifiers as non-canonical extension identity by default.
- **HARDEN** the distinction between provider registration/selection and extension admission/authority.
- **GENERALIZE** only evidence-backed reusable registration/compatibility concepts in later architecture work; Planning B does not choose the target shape.
- **PROVIDERIZE** concrete marketplace/provider transport, lookup or distribution mechanics if later needed; do not providerize canonical extension semantics.
- **INTEGRATE** with Authorization, Trust/PKI, Security, Lifecycle, Build/Dependency, Deployment/Runtime, Provider/Binding, Standards and UCA without absorbing those owners.
- **DEFER** generalized extension identity, manifests, admission, permission grants, sandboxing, lifecycle, marketplace governance, rollback, ambiguous-effect reconciliation and residual-cohort drainage because they are not implemented on fresh main.
- **DO_NOT_BUILD** any inference that installed/registered/provider-supported means admitted, authorized or effective.
- **DO_NOT_BUILD** AI/AGWS self-installation or authority amplification.
- **REPLACE:** no repository evidence supports replacement of the existing provider-neutral seams or bounded registry foundations.

## 13. Planning B result

**PASS_FOR_CAPABILITY / CURRENT_STATE_RECONCILED.**

Fresh main contains useful but narrower extension-adjacent foundations: provider-neutral replaceable adapters, explicit versioned contracts, deterministic capability/provider/version materializer registration/lookup and bounded public contract extension fields. It does not evidence a generalized executable Extension / Plugin / Marketplace architecture with canonical extension identity, admission/authority, sandboxing, lifecycle, trust, marketplace governance, rollback or residual-cohort convergence.

No target architecture was invented. No product code, Work Package, executive TASK, Construction, PR or worker handoff was executed.
