# Generation 2 Research — Extension / Plugin / Marketplace Architecture — Revisit 5 / Cycle 6

## Research question
What must remain universally true when System Builder admits, activates, updates, revokes, replaces, distributes or locally closes over executable extensions, while extension mechanisms range from in-process plugins to isolated provider processes and admission hooks, and while `Enterprise → Station → Role → Person` authority must never be amplified by installation or AI-authored composition?

This revisit uses research-by-exception. It does not attempt another catalogue of plugin systems; it targets failure, authority, compatibility, provenance, residual-use, offline and provider-replacement cases that could falsify the current architecture.

## Representatives and evidence/source ledger

| Representative | Evidence used | Architectural contribution | Coverage |
|---|---|---|---|
| Kubernetes dynamic admission webhooks | official dynamic admission and webhook good-practice docs | extension control-path failure policy; reinvocation/idempotence; bootstrap/dependency-loop risk; explicit reject versus transport failure | DEEP |
| HashiCorp Terraform provider/plugin protocol | official provider requirements, plugin protocol, plugin discovery and compatibility docs | typed host/plugin/protocol compatibility; provider version constraints; lock file; process boundary; unsupported direct-import coupling | DEEP |
| VS Code Extension Marketplace/runtime trust | official marketplace documentation | publisher trust prompt; marketplace package signature verification; private marketplace; package-source integrity distinct from runtime authority | DEEP |
| Sigstore/Cosign | official signature, attestation and timestamp verification docs | publisher/artifact identity, signature and trust-root evidence; offline-verifiable bundle; authenticity distinct from semantic admission | DEEP |
| Prior SB Generation-2 Extension research | authoritative earlier dossiers/state history | historical extension lifecycle, portability and provider-boundary evidence | DEEP |

### Evidence notes
- Kubernetes admission webhook invocation can fail because of timeout/network/malformed response; `failurePolicy` chooses `Ignore` or `Fail`. Explicit webhook rejection is semantically distinct and denies regardless of failure policy. Mutating webhooks must tolerate reinvocation/idempotence. Kubernetes also warns about dependency loops where an admission webhook intercepts add-ons on which it itself depends.
- Terraform provider plugins are separately versioned executables selected against configuration constraints; the plugin protocol is explicitly versioned, with major protocol versions defining CLI/plugin compatibility. A dependency lock file can pin selected provider versions. HashiCorp explicitly warns that importing provider Go modules is unsupported coupling outside the plugin contract.
- VS Code verifies marketplace extension signatures at install time and prompts for trust when installing from a third-party publisher; organizations can use private marketplaces. Package signature/source trust therefore participates in admission but does not itself define runtime permissions or business authority.
- Cosign verifies artifact digest/signature and signer identity/trust parameters; attestations can be policy-validated. Offline bundles can carry signed verification material. Signature validity proves authenticity/integrity claims, not that an extension is semantically compatible, safe, authorized or suitable for a Station.

## Source of truth and typed identity
A universal extension model must not collapse these identities:

`ExtensionConceptId → PackageRevisionId → PublisherIdentity → Provenance/SignatureEvidenceId → AdmissionDecisionId → DependencyClosureId → HostContract/API/ABIRevision → Permission/CapabilityGrantId → Wiring/BindingRevision → ActivationAttemptId → EffectiveActivationId → RuntimeInstanceId → RevocationIntentId → ResidualUseDispositionId`.

Provider-specific package IDs, marketplace listing IDs, webhook configuration names, process IDs and signatures are realization/correlation identities. They must not become the semantic extension identity.

## Lifecycle
Recommended universal lifecycle:

`DISCOVERED → ACQUIRED → VERIFIED → COMPATIBILITY_EVALUATED → ADMISSION_DECIDED → STAGED → ACTIVATION_ATTEMPTED → EFFECTIVE | PARTIAL | OUTCOME_UNKNOWN | REJECTED → HEALTH_QUALIFIED → ACTIVE`.

Update/replacement and revocation are independent transitions. Revocation is not complete merely because new activation is blocked:

`REVOCATION_INTENT → NEW_USE_FENCED → ACTIVE_REFERENCES_DRAINED/QUARANTINED → RUNTIME_DEACTIVATED → RESIDUAL_STATE/EFFECTS_DISPOSITIONED → REVOKED`.

## Versioning and effective qualification
Effective extension qualification is a vector, not a scalar package version:

`Qext = <package, publisher/provenance, host-contract/API/ABI, dependency-closure, permission/policy, binding/provider, runtime/topology, trust-root, Station/exposure, admission-policy>`.

A prior PASS becomes stale when a material axis changes. A signed package can become incompatible with a newer host; an unchanged package can become unauthorized after Station policy changes; a compatible binary can become inadmissible after trust-root or publisher-policy change.

## Failure semantics
First-class states include `REJECTED`, `FAILED`, `PARTIAL`, `OUTCOME_UNKNOWN`, `INCOMPATIBLE`, `QUARANTINED`, `DEGRADED`, `DRAINING`, `RESIDUAL_USE`, `INCONCLUSIVE` and `UNAVAILABLE`.

A transport timeout during extension admission is not equivalent to an explicit semantic reject. Kubernetes provides a concrete adversarial example: failure policy governs callout errors, whereas explicit webhook rejection remains a rejection. System Builder therefore needs typed failure disposition rather than a single install/activate boolean.

If activation acknowledgement is lost after an external extension runtime may have started, retry must be preceded by observation/correlation. Blind activation retry can create duplicate workers, hooks, subscriptions or side effects.

## Extensibility and dependency closure
An extension is usable only against an explicit dependency closure: host contract/protocol, required capabilities, package dependencies, provider bindings and execution/runtime prerequisites. Closure is evidence, not merely a dependency list: each dependency must be resolved to an admitted compatible realization.

Terraform demonstrates that provider package version and protocol compatibility are separate axes. Its lock file stabilizes selected versions, but does not remove host/protocol/platform compatibility requirements.

## Provider boundaries
Universal primitives should define extension identity, manifest/requirements, compatibility constraints, permission requests, admission evidence, activation/revocation lifecycle, dependency closure and residual-use disposition. Marketplace catalogs, package formats, process protocols, WASM components, admission webhooks and in-process modules are provider mechanisms.

Direct host-language imports across a provider boundary should not be treated as portable extension contracts. Terraform explicitly documents provider Go-module imports as unsupported and exposes a versioned plugin protocol instead.

## Governance and authority
Admission authority is facet-specific:

`discover/read metadata ≠ acquire ≠ verify ≠ admit ≠ grant capabilities ≠ activate ≠ update ≠ revoke ≠ administer provider/marketplace ≠ recover control path`.

Publisher reputation, signature validity and marketplace presence are evidence inputs, never authority grants. An extension cannot gain powers merely because its publisher is trusted.

`Enterprise → Station → Role → Person` remains attenuating. A Station administrator may be delegated authority to expose or activate a pre-admitted extension for that Station without receiving Enterprise publisher-trust administration, canonical policy, provider administration, secret access, deployment/recovery or cross-Station authority.

## Observability
Extension health evidence requires an expected extension population: admitted/required/active extension identities joined to observed runtime instances and control-path health. Observing only extensions that emitted telemetry can silently hide a missing required extension. Observability supplies evidence; it does not own extension admission semantics.

Required operational evidence includes activation attempt/effective state, host/protocol compatibility, dependency closure, permission grant revision, control-path availability, runtime health, residual references during revocation and provider/Station population coverage.

## Portability and lock-in
Portability is staged:

`PRESERVE semantic extension requirements → INTERPRET provider package/manifest → VALIDATE compatibility/admission → REALIZE provider/runtime wiring → ACTUATE within authority`.

Package export alone is not portability. A provider replacement must prove representability of required extension semantics, compatibility, permission equivalence, activation health and residual-use disposition on the old provider.

Qualified local/offline operation requires a closed set of package bytes/digests, signatures/trust material, host contracts, dependency closure, admission policy snapshot, permission grants, bindings and recovery material. Reconnection after policy/trust/package/host/provider advancement requires requalification before privileged actuation.

## Product-specific mechanisms vs universal primitives
Provider/product mechanisms: Kubernetes webhook configuration and `failurePolicy`; Terraform Registry and plugin protocol; VS Code Marketplace publisher/signature UX; Cosign/Rekor/Fulcio/TSA bundles.

Universal primitives: typed extension identity; dependency closure; compatibility profile; admission decision; requested/effective capability grants; activation attempt/effective lineage; ambiguous-outcome reconciliation; revocation/drain/residual-use lifecycle; publisher/provenance evidence; control-path bootstrap/recovery; expected extension population; offline closure; provider replacement qualification.

## Convergent patterns
1. Extension package identity and runtime realization are distinct.
2. Compatibility is multi-axis and version-bound.
3. Admission and execution require separate policy/authority decisions.
4. Trust/signature evidence is necessary in some ecosystems but insufficient for semantic admission.
5. Control-path extensions can create circular failure dependencies and require bootstrap-safe recovery.
6. Revocation must account for already-running/in-use realizations.
7. Provider mechanisms vary, but dependency closure and effective activation evidence recur.

## Divergent patterns
- In-process extensions, out-of-process provider plugins and request-path admission hooks have radically different blast radius and failure semantics.
- Some ecosystems centrally sign packages; others rely on external provenance/trust infrastructure.
- Failure can be fail-open or fail-closed depending on control-path policy; no universal default is safe for every extension class.
- Compatibility may be host API, wire protocol, schema, platform, capability or provider specific.

## Subcapabilities
- Extension/package semantic identity and manifest
- Dependency and capability closure
- Compatibility negotiation: host/API/ABI/schema/protocol/platform
- Publisher/provenance/signature evidence
- Admission policy and capability grants
- Activation/wiring/runtime realization
- Containment/sandbox and blast-radius boundary
- Update/replacement/coexistence
- Revocation/drain/residual-use disposition
- Marketplace/catalog/distribution provider
- Extension health/expected-population evidence
- Control-path bootstrap/recovery
- Qualified offline/local extension closure

## Comparison with fresh `main`
A bounded default-branch GitHub code search for `extension plugin marketplace admission sandbox provider` returned no matches. This is not evidence of repository-wide absence and is deliberately recorded only as a repo-validation question. The research branch is not treated as product truth.

## Reconciliation hypotheses
- **GENERALIZE** extension identity, dependency closure, compatibility and activation/revocation lineage into provider-neutral contracts.
- **HARDEN** admission with revision-qualified publisher/provenance, compatibility, permission and Station evidence.
- **PROVIDERIZE** marketplace/catalog, package transport, sandbox/runtime mechanism and host-specific plugin protocols.
- **INTEGRATE** Artifact/Provenance, Authorization, Provider/Binding, Lifecycle, Security/Recovery, Deployment and Observability proofs without transferring semantic ownership.
- **DEFER** marketplace ranking/reputation algorithms until product evidence proves they are core rather than provider-specific.
- **DO_NOT_BUILD** a universal in-process arbitrary-code plugin model or any extension path that bypasses admission/capability boundaries.

## Repository-validation questions
1. Does fresh `main` already define any extension/plugin/provider semantic identity distinct from runtime/provider identity?
2. Are provider bindings currently able to express host/protocol/schema compatibility and dependency closure?
3. Is there an admission/evidence contract that separates signature/provenance from semantic authorization?
4. Can current runtime state represent activation `OUTCOME_UNKNOWN`, partial activation, drain and residual-use disposition?
5. Are extension permissions capability-scoped and Station-attenuated, or would plugin installation inherit host authority?
6. Is there a bootstrap/recovery path that remains available if an extension on the control path fails?
7. Can generated runtimes operate with a qualified offline extension closure without System Builder online?
8. Does any current extension/provider path couple directly to host implementation internals rather than a versioned contract?

## Symbiotic Proof obligations
1. A signed extension with incompatible host protocol is rejected despite valid provenance.
2. An unsigned/untrusted package cannot become admitted merely because it is present in a marketplace/cache.
3. A Station admin can activate an Enterprise-admitted extension only within delegated Station exposure and grants.
4. Extension activation timeout after possible external start yields `OUTCOME_UNKNOWN`, is observed/correlated, and is not blindly retried.
5. Revocation blocks new use and does not report complete until running references are drained/quarantined and residual state/effects are dispositioned.
6. A required extension missing from telemetry causes population coverage `PARTIAL/INCONCLUSIVE`, not false healthy status.
7. Host/API/protocol upgrade stales previous compatibility evidence and forces requalification.
8. Provider/runtime replacement proves semantic representability, equivalent effective grants and old-provider residual disposition before cutover closure.
9. Control-path extension failure cannot permanently prevent the mechanism required to disable/recover that extension.
10. Offline Station activation succeeds only from qualified local package/trust/dependency/policy closure; reconnect with newer superior state forces requalification.
11. AI/AGWS request to install or rewire an extension outside delegated authority is escalated, not materialized.
12. Publisher trust/signature verification cannot grant secrets, provider-admin, deployment or recovery authority.

## Stable findings
- **G2-FINDING-EPM-37** — Extension identity is typed across semantic extension, package revision, publisher/provenance evidence, admission decision, dependency closure, host/API/ABI/protocol compatibility, capability grant, wiring, activation attempt/effective realization and revocation/residual-use disposition; marketplace/provider/runtime IDs are correlation identities only.
- **G2-FINDING-EPM-38** — Effective extension qualification is a multi-axis revision vector over package, provenance/trust, host contract/API/ABI/protocol, dependency closure, permission policy, binding/provider, runtime/topology, Station exposure and admission policy; material change on any axis stales prior admission/health evidence.
- **G2-FINDING-EPM-39** — Extension admission is a lineage, not a boolean: authenticity/provenance verification, compatibility evaluation, policy admission, capability grant, activation attempt, effective realization and health qualification are independent facts and can fail or become stale separately.
- **G2-FINDING-EPM-40** — Activation with lost acknowledgement is `OUTCOME_UNKNOWN`; reconciliation/observation must precede retry because duplicate runtime hooks, workers, subscriptions or external effects may already exist.
- **G2-FINDING-EPM-41** — Revocation completion requires residual-use postconditions: fencing new use does not prove running instances, references, subscriptions, persisted state or effects are drained/dispositioned.
- **G2-FINDING-EPM-42** — Extension control-path dependencies require bootstrap/recovery isolation: an extension must not be able to make its own disable/recovery path unavailable through circular admission, networking, storage or identity dependencies.
- **G2-FINDING-EPM-43** — Publisher reputation, marketplace presence, package signature and provenance are admission evidence but never executable authority; effective permissions remain explicit, revision-qualified and attenuated by Enterprise→Station→Role→Person.
- **G2-FINDING-EPM-44** — Qualified local/offline extension operation requires a closed package/trust/host-contract/dependency/policy/grant/binding set and reconnection requalification; provider replacement additionally requires semantic/grant equivalence plus old-provider residual disposition.

## Capability Discovery Register candidates
- `G2-CAPABILITY-CANDIDATE-EPM-TYPED-EXTENSION-ADMISSION-ACTIVATION-REVOCATION-IDENTITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with UCA typed identity while Extension retains admission/activation/revocation semantics.
- `G2-CAPABILITY-CANDIDATE-EPM-MULTI-AXIS-EFFECTIVE-EXTENSION-QUALIFICATION-VECTOR` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with universal revision-vector primitive.
- `G2-CAPABILITY-CANDIDATE-EPM-RESIDUAL-USE-REVOCATION-POSTCONDITION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**. Extension-specific ownership of drain/residual-use closure.
- `G2-CAPABILITY-CANDIDATE-EPM-CONTROL-PATH-BOOTSTRAP-RECOVERY-ISOLATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**. Reconcile with Security/Recovery and Architecture Reconciliation while preserving extension control-path proof.

No candidate is promoted in this revisit.

## Value / risk / priority / next question
**Value:** high — extensions are a primary portability and ecosystem boundary.

**Risk:** critical if admission, authority or revocation are collapsed; arbitrary executable extension authority would undermine providerization and Station governance.

**Priority:** high before synthesis.

**Next question for this capability:** on a later eligible revisit, try to falsify whether residual-use closure and control-path recovery need dedicated universal primitives or remain Extension-owned proof obligations; do not reopen routinely until rotation/state selects it.
