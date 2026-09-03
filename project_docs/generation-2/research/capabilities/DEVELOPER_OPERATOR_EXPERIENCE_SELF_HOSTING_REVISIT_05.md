# Developer / Operator Experience / Self-hosting — Revisit 5 (Cycle 6)

## Research question
What universal contracts let a System Builder installation remain operable, updateable, diagnosable and recoverable across connected, disconnected and air-gapped environments without confusing installation identity, runtime identity, fleet membership, update material, recovery state or operator authority?

## Representatives and evidence ledger
- Kubernetes kubeadm upgrade: explicit upgrade planning, version-skew constraints, staged control-plane/worker progression, health checks, backups, idempotent recovery and manual fallback restore.
- K3s air-gap install/upgrade/rollback: locally transferred binaries/images, private-registry closure, version-matched upgrade material, rollback plus application-level verification.
- GitLab Self-Managed: required upgrade stops/background-migration completion; backups must include secrets/configuration coupled to persisted data.
- HashiCorp Nomad: incremental server/client upgrade with health checks; backward-compatibility window; downgrade is not generally supported; snapshots are atomic Raft-state recovery material and restore is privileged/dangerous.
- Prior Generation-2 Security, Deployment, Secrets, Build/Artifact and Provider research supplies cross-capability evidence; no product-specific mechanism is promoted as universal.

## Source of truth and typed identity
Do not alias: `InstallationId`, `InstanceId`, `FleetMemberId`, `OperatorPrincipal`, `UpdateIntentId`, `UpdateMaterialId`, `UpdateAttemptId`, `RecoveryPointId`, `DiagnosticBundleId`, `ProviderRealizationId`. A self-hosted local runtime is authoritative for its observed local realization; a management/control plane may be authoritative for desired fleet intent. Neither may silently overwrite the other's fact domain.

## Lifecycle and versioning
Universal lifecycle: `qualified-source -> planned -> admitted -> staged -> attempted -> locally-realized -> semantically-validated -> fleet-qualified -> old-realization-dispositioned`. Rollback/restore is a distinct branch with recovery-point eligibility, semantic validation and reprotection obligations. Required intermediate upgrade stops and background migrations show that version evolution is path-relative rather than merely source-version/target-version compatible.

## Failure semantics
A lost acknowledgement or interrupted upgrade yields `OUTCOME_UNKNOWN` until the actual installation is observed; retry is not automatically safe. Local binary success does not prove configuration/data/schema compatibility, application functionality, fleet convergence or restored protection. Snapshot restore success likewise does not prove semantic correctness.

## Extensibility and provider boundaries
Install/update transport, package registry, artifact mirror, backup engine, diagnostic transport and orchestration mechanism are providers. Portable semantics are qualified update material, compatibility path, expected-base/ownership, health/validation evidence, residual-old-realization disposition and local closure—not a specific package manager or orchestrator.

## Governance and authority
Separate `Observe`, `Diagnose`, `StageUpdate`, `ApplyUpdate`, `Rollback`, `Restore`, `Reprotect`, `FleetTarget`, `TrustAdmin`, `SecretRead` and `ProviderAdmin`. Fleet targeting authority is not install authority. Diagnostic collection authority is not permission to disclose secrets. Enterprise -> Station -> Role -> Person remains attenuating.

## Observability and diagnostics
Diagnostics require typed custody and redaction evidence: collector identity, scope, time window, configuration revision, redaction policy revision, hashes/manifests and recipient authority. A support bundle is privileged derived data and must not become an ambient secret-exfiltration path.

## Portability, disconnected operation and lock-in
Air-gapped operation requires a qualified local closure of executable/update material, dependency images/packages, trust roots, compatibility metadata, configuration/schema prerequisites and recovery material. A disconnected Station may continue only within that closure. Reconnection requires requalification against newer policy/trust/update/fleet revisions before privileged mutation. Product-specific archives, installers and cluster commands are mechanisms, not the portable contract.

## Product-specific mechanisms vs universal primitives
Kubeadm version-skew/upgrade-plan, K3s air-gap tarballs, GitLab required stops, Nomad Raft snapshots and vendor rollback commands are product-specific. Universal primitives are typed installation/update/recovery identity, path-relative compatibility, qualified material closure, expected-base fencing, staged mutation, semantic postcondition validation, residual-realization disposition, diagnostics custody and authority attenuation.

## Convergent / divergent patterns
Convergent: staged/incremental update; health checks between stages; backups before destructive evolution; compatibility constraints; privileged recovery; separate verification after mutation. Divergent: downgrade support, packaging format, fleet orchestration, migration engine, snapshot semantics and whether rollback is native or restore/reprovision based. SB must therefore model capability profiles rather than promise universal downgrade/rollback.

## Subcapabilities
1. Installation/instance/fleet identity and inventory.
2. Qualified update-source and air-gap closure.
3. Path-relative upgrade/migration planning.
4. Staged fleet mutation and ownership fencing.
5. Semantic validation and residual-realization disposition.
6. Backup/restore/reprotect operational UX.
7. Diagnostics custody/redaction/support evidence.
8. Delegated Station operations and reconnect requalification.

## SB comparison
No product implementation claim is made in this revisit. Fresh `main` archaeology is deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; current research artifacts are not treated as product truth.

## Reconciliation hypotheses
- GENERALIZE typed installation/update/recovery/diagnostic identities.
- HARDEN update mutation with expected-base, attempt lineage and reconcile-before-retry.
- GENERALIZE path-relative compatibility and qualified local closure.
- PROVIDERIZE update transport, artifact mirror, backup and diagnostic transport.
- INTEGRATE semantic validation with Security/Recovery, Lifecycle and Deployment evidence.
- DO_NOT_BUILD a universal promise of in-place downgrade or vendor-neutral snapshot format.

## Repository-validation questions
- Does `main` distinguish desired fleet intent from local observed realization?
- Are install/update attempts typed and idempotency/ambiguity explicit?
- Are version-path and data/config/schema prerequisites represented?
- Is there a local/offline material closure contract with trust evidence?
- Are diagnostic bundles redacted and custody-governed?
- Are rollback/restore/reprotect distinct authorities and postconditions?
- Can Station administration target only its delegated fleet/capabilities?

## Symbiotic Proof obligations
1. Positive: connected instance upgrades through a qualified path and proves semantic postconditions.
2. Negative: skipped mandatory upgrade stop is rejected before mutation.
3. Failure: interrupted/lost-ack update is observed before retry.
4. Authority: fleet targeter without ApplyUpdate cannot mutate a Station.
5. Version: update proof binds install/config/data/schema/trust/provider revisions.
6. Provider: switch from public registry to qualified mirror preserves semantic update intent.
7. Offline: air-gapped Station updates only from complete qualified local closure.
8. Recovery: restore completion alone cannot promote until semantic validation and reprotection obligations pass.
9. Diagnostics: bundle proves scope/redaction/custody without disclosing secret values.
10. AGWS/AI: assistant may propose/prepare an operation but cannot acquire update/recovery/provider-admin authority.
11. Residual: fleet success requires disposition of stale old realizations or explicit bounded exception.
12. Reconnect: locally valid offline state is requalified before privileged post-reconnect mutation.

## Stable findings
- **G2-FINDING-DOESH-39** — Self-hosting requires typed installation, instance, fleet-member, update-intent/material/attempt, recovery-point and diagnostic identities; a scalar deployment/version identity is insufficient.
- **G2-FINDING-DOESH-40** — Desired fleet intent and observed local realization are separate sources of truth; disconnected/local success cannot be overwritten by control-plane assumption, nor can local state silently redefine fleet intent.
- **G2-FINDING-DOESH-41** — Upgrade compatibility is path-relative and may require ordered intermediate stops plus migration completion; endpoint version compatibility alone is insufficient.
- **G2-FINDING-DOESH-42** — Air-gapped updateability requires a qualified local material-and-trust closure; possession of a binary/image alone does not establish an admissible update source.
- **G2-FINDING-DOESH-43** — Update/recovery mutation requires expected-base ownership and reconcile-before-retry semantics; interrupted or acknowledgement-lost operations are `OUTCOME_UNKNOWN`, not automatically retryable.
- **G2-FINDING-DOESH-44** — Update/restore mechanism success and semantic operational validity are distinct postconditions spanning configuration, secrets, data/schema, application behavior and protection posture.
- **G2-FINDING-DOESH-45** — Diagnostic/support evidence is privileged derived data with explicit collection scope, redaction, custody and recipient authority; diagnostic access must not imply secret/provider-admin access.
- **G2-FINDING-DOESH-46** — Fleet completion requires residual-realization disposition and reconnect requalification; stale/offline members cannot be silently counted as converged or allowed privileged mutation under obsolete trust/policy.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-DOESH-TYPED-INSTALLATION-UPDATE-RECOVERY-IDENTITY` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-DOESH-PATH-RELATIVE-UPGRADE-COMPATIBILITY` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.
- `G2-CAPABILITY-CANDIDATE-DOESH-QUALIFIED-AIRGAP-MATERIAL-TRUST-CLOSURE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-DOESH-DIAGNOSTIC-CUSTODY-REDACTION-EVIDENCE` — CORE_SUBCAPABILITY / PENDING_SYNTHESIS.

## Value / risk / priority / next question
Value: makes SB-generated systems genuinely operable under customer-owned/self-hosted and disconnected constraints. Risk: conflating deployment success with operability or central desired state with local truth can strand installations or create privileged unsafe retries. Priority: HIGH. Next question: can Architecture Reconciliation be made an executable evidence discipline rather than a documentation-only comparison while preserving the boundary between research findings and fresh-main product truth?
