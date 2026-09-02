# Developer / Operator Experience / Self-hosting — Revisit 02

Status: REVISIT 02 / CYCLE 3 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
What evidence and portable contracts are required so that developer/operator workflows, self-hosted installations and disconnected generated runtimes remain reproducible, diagnosable, upgradeable and recoverable without depending on a vendor control plane, while still preserving explicit environment differences, secret custody, trust roots and bounded Station/operator authority?

## Representatives and evidence ledger

1. **K3s air-gap + rollback** — explicit disconnected dependency/image closure, local install, version-specific upgrade inputs and rollback verification. Sources: https://docs.k3s.io/installation/airgap and https://docs.k3s.io/upgrades/roll-back (reviewed 2026-09-02).
2. **Kubernetes / kubeadm** — desired cluster configuration versus realized node/control-plane state, image enumeration, version-skew-aware upgrades, pre-transition backups and manual recovery when automatic rollback fails. Sources: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-config/ and https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/.
3. **Nix closure transfer** — explicit dependency closure as a transportable object rather than an implicit online-install property. Source: https://nix.dev/manual/nix/2.24/command-ref/nix-copy-closure.
4. **GitHub Codespaces / Dev Containers** — repository-defined environment intent, distinct prebuild realization, branch/config revision sensitivity, recovery mode and explicit secret availability boundaries. Sources: GitHub Codespaces dev-container and prebuild documentation.
5. **Docker Compose** — declarative local service topology with configuration/secrets separated from topology and explicitly granted to services. Sources: Docker Compose secrets/configuration documentation.
6. **Coolify self-hosted restore** — control-plane database recovery depends on backup, APP_KEY, SSH material and version/host context while explicitly excluding application/database/service/volume data. Source: https://next.coolify.io/docs/core/backup-and-recovery/instance-restore.

## Evidence-derived primitives

### Source of truth and identity
Keep distinct: `OperationalContract`, `EnvironmentTopologyDefinition`, `EnvironmentTopologyRealization`, `BootstrapClosureManifest`, `BootstrapAttempt`, `SecretBindingRequirement`, `SecretBindingRealization`, `TrustRootSet`, `UpgradePlan`, `UpgradeAttempt`, `RecoveryAttempt`, `OperationalEvidenceBundle`, `EnvironmentCompatibilityClaim` and `OperationalComplexityObservation`.

The environment definition owns desired topology/requirements. Runtime/operator evidence owns what was actually realized. Secrets and trust roots remain external bindings with independent custody. A dashboard or hosted control plane is a projection over these facts, not their semantic authority.

### Lifecycle/versioning
Bootstrap and upgrade must be version/revision-bound transitions: definition -> closure resolution -> secret/trust binding -> realization -> readiness/conformance. Upgrade adds precondition evaluation, backup/recovery material, mutation and post-transition conformance. Rollback/recovery creates a new governed state transition; it does not erase the failed attempt.

### Failure semantics
- A complete topology file with missing images, packages, migration interpreters, model/tool runtimes, trust material or secret bindings is **not bootstrappable**.
- `installed` is weaker than `ready`, and `ready` is weaker than domain/product conformance.
- A desired environment revision may differ from the effective realized revision after partial upgrade, stale prebuild/cache or node-specific overrides.
- Secret requirement satisfaction is scoped to purpose and phase: a secret unavailable during build but available after startup is not equivalent to build-time availability.
- Control-plane restore can succeed while application data remains unrecovered.
- Diagnostics dependent on a hosted dashboard/control plane do not prove self-host operational autonomy.

## Product-specific mechanisms vs universal primitives

Product-specific: K3s image tar placement and install script; kubeadm ConfigMap/static manifests; Nix store/SSH closure copy; `devcontainer.json` and Codespaces prebuild machinery; Compose YAML/secrets syntax; Coolify APP_KEY/SSH directories.

Universal: desired topology vs effective realization; qualified offline closure; explicit secret/trust binding; phase-scoped bootstrap prerequisites; transition-bound recovery material; post-transition conformance; exportable operator evidence; environment compatibility claims; replaceable realization providers.

## Convergent patterns

1. **Offline is a closure property, not a network-mode flag.** K3s requires exact local images/binaries/install material; Nix explicitly computes dependency closure.
2. **Definition and realization diverge legitimately.** kubeadm persists cluster-wide config yet node-specific realization/overrides can differ; Codespaces prebuilds are branch/config-specific realizations of dev-container intent.
3. **Secrets/trust are dependencies with separate custody.** Compose grants secrets explicitly; Codespaces distinguishes build-time and post-creation secret availability; Coolify restore requires encryption/SSH material outside the database dump.
4. **Upgrade/recovery is evidence-bearing.** Kubernetes and K3s require version-aware sequencing, retained recovery material and post-operation verification.
5. **Self-host autonomy requires local diagnostics/evidence export.** A locally running service that needs the vendor control plane to explain, recover or verify itself remains operationally coupled.
6. **Environment parity must be semantic, not literal.** local/dev/test/prod can use different realizations if a declared compatibility/conformance profile proves the required behavior.

## Cross-capability constraints

- `AIN-17..22`: self-hosted/offline agent execution requires local model/tool/policy/trust/approval interpretation closure; replacing model/tool realization cannot change semantic task identity or approval scope.
- `LVEM-17..22`: desired environment revision, effective realization and observed availability must remain separate; compatibility is profile/operation/direction/window scoped; recovery can branch lineage.
- Security/Resilience findings: recovery material needs dependency closure, retries require qualified failure/idempotency semantics, and restored state needs post-restore semantic validation.
- AGWS: Station administration may operate only delegated capabilities/bindings; self-hosting must not manufacture enterprise-global authority.

## Subcapabilities deepened

- declarative local topology and effective-realization evidence;
- qualified air-gap dependency/artifact/tool/model/migration/trust closure;
- phase-scoped configuration/secrets bootstrap;
- upgrade/rollback/recovery lineage;
- local diagnostics and evidence export;
- provider/model/tool replacement conformance;
- semantic dev/test/prod parity profiles;
- portable backup/state/evidence custody;
- delegated Station operational administration;
- operational-complexity observation without billing ownership.

## Reconciliation hypotheses

- **HARDEN** offline/self-host claims into qualified closure + conformance evidence rather than boolean labels.
- **GENERALIZE** desired topology/effective realization and environment compatibility primitives for reuse across Build, Deploy, Runtime, AI and Operator capabilities.
- **PROVIDERIZE** environment realization, hosted development environment, local orchestrator, model/tool runtime and diagnostic transport.
- **INTEGRATE** Secrets, Artifact/Provenance, Lifecycle, Security/Recovery and Observe evidence instead of duplicating ownership in DX/Ops.
- **KEEP** runtime-autonomy requirement and external-secret direction where repository archaeology proves them.
- **DEFER** unified operator portal UX until these portable semantics are reconciled.
- **DO_NOT_BUILD** a self-hosting mode whose restore, diagnosis, migration interpretation or ordinary runtime behavior requires an opaque central service.

## Repo-validation questions

1. Is there one machine-readable artifact that states all required local runtime/build/migration/provider/tool dependencies for a generated system?
2. Can desired environment revision be compared to effective realized revision today?
3. Are secrets represented as phase/purpose-scoped requirements rather than only environment-variable names?
4. Can diagnostics, conformance and recovery evidence be exported when Builder/provider control planes are unavailable?
5. Are migration interpreters and trust roots included in any offline/autonomy closure?
6. Can a provider/model/tool realization be replaced while proving equivalent semantic/operator behavior?
7. Does any current bootstrap assume network access or hosted package/model/tool resolution without declaring it?
8. Can backup/state/evidence be moved to a new operator environment with required decryption/trust/binding material identified explicitly?
9. Are local/dev/test/prod differences represented as explicit profiles/compatibility claims rather than undocumented drift?
10. Can Station administrators perform operational changes only within delegated capability exposure?

## Symbiotic Proof

Demonstrate one portable system definition across two materially different environment realizations. Produce a closure manifest containing every artifact/tool/migration interpreter/model/tool/trust dependency required for an offline-qualified profile; bootstrap without external control-plane/network resolution; inject secrets through declared bindings without embedding values; compare desired versus effective realization; intentionally fail a partial upgrade and recover through retained material with branched lineage; export diagnostics locally; replace one provider/model/tool realization; and prove the same acceptance profile while Enterprise → Station → Role → Person authority remains non-amplifying.

## Stable findings

- **G2-FINDING-DOESH-17 — Offline/Self-host Autonomy Requires a Qualified Execution Closure, Not Merely Local Hosting.** The closure must cover required artifacts, dependency graphs, migration interpreters, model/tool realizations, contracts and trust material for the claimed operation profile.
- **G2-FINDING-DOESH-18 — Desired Environment Topology and Effective Realized Topology Are Distinct Revision-Bound Evidence.** Declarative configuration expresses intent; actual nodes/services/images/config overrides and readiness must be observed and compared explicitly.
- **G2-FINDING-DOESH-19 — Bootstrap Secrets and Trust Material Are Phase- and Purpose-Scoped Bindings With Independent Custody.** Presence after startup does not prove build/migration/recovery availability, and portable definitions must reference rather than absorb secret values.
- **G2-FINDING-DOESH-20 — Upgrade/Rollback/Recovery Must Preserve Transition Lineage and Bind Recovery Material to the Attempt.** Pre-transition backups, effective versions/config and post-recovery conformance belong to the governed transition; rollback is not history erasure.
- **G2-FINDING-DOESH-21 — Environment Parity Is a Profile-Based Conformance Claim Across Legitimately Different Realizations.** Reproducibility should prove semantic/tooling/runtime obligations across local/dev/test/prod, not require identical infrastructure.
- **G2-FINDING-DOESH-22 — Operational Autonomy Requires Exportable Local Diagnostics and Evidence Independent of Provider Control Planes.** Hosted dashboards may improve UX but cannot be the sole path to diagnose, verify or recover a self-hosted/generated runtime.

## Capability candidates

| Candidate | Class | Status | Promotion condition |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-QUALIFIED-OFFLINE-OPERATION-CLOSURE` | CROSS_CUTTING | CANDIDATE | Artifact/AI/Lifecycle/Security synthesis confirms one reusable operation-profile closure across runtime, migration, model/tool and trust dependencies. |
| `G2-CAPABILITY-CANDIDATE-DESIRED-EFFECTIVE-ENVIRONMENT-REALIZATION-EVIDENCE` | CORE | CANDIDATE | Deployment/Observe/Provider synthesis confirms reusable desired-vs-effective realization evidence beyond environment-specific tooling. |
| `G2-CAPABILITY-CANDIDATE-PHASE-SCOPED-BOOTSTRAP-SECRET-TRUST-BINDING` | CROSS_CUTTING | CANDIDATE | Secrets/Build/Migration/Recovery synthesis confirms phase/purpose-scoped binding semantics as a common primitive. |

No candidate is promoted in this pass.

## Value / risk / priority / next question

- **Value:** very high; turns anti-lock-in and runtime autonomy into operable, testable properties.
- **Risk:** very high if “self-hosted” is treated as a packaging checkbox while diagnostics, migration interpretation, model/tool execution or recovery remain centrally coupled.
- **Priority:** high cross-cutting input to synthesis and later Product Proof.
- **Next question:** Architecture Reconciliation as a Capability — revisit cycle 3, then close cycle-3 accounting without entering synthesis because the minimum seven full cycles are not yet complete.
