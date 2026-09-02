# Developer / Operator Experience / Self-hosting — Revisit 01

## Research question
What provider-neutral developer/operator contract lets a System Builder installation be reproducible, diagnosable, recoverable, upgradeable and genuinely self-hostable while keeping generated runtimes operationally autonomous and preventing convenience/admin paths from bypassing canonical authority, Governance, Station/Role boundaries or domain contracts?

## Representatives and evidence ledger
1. **GitLab Self-Managed** — strongest integrated reference for offline installation, backup/restore, exact-version restore preconditions, separately preserved secrets/configuration, and installation-method-specific realization. Source of truth: GitLab Self-Managed documentation.
2. **Kubernetes / kubeadm** — strongest operational reference for staged upgrade, version-skew constraints, pre-upgrade backups, automatic/manual rollback boundaries and explicit plan/diff before mutation. Source of truth: kubernetes.io documentation.
3. **Backstage** — portable developer-portal contract with deployment-method freedom, externalized PostgreSQL/configuration, explicit frontend/backend plugin installation and provider-specific integration isolated behind plugins/config. Source of truth: backstage.io documentation.
4. **Nix Flakes / devShell** — reproducible development-environment reference: declared inputs and system-specific outputs produce reproducible shells/builds rather than relying on undocumented workstation state. Source of truth: Nix/NixOS documentation.
5. **GitLab offline installation** — treated as a distinct operational realization of GitLab Self-Managed because it directly exercises dependency closure and disconnected bootstrap: dependencies/packages are collected in a connected environment and transported into the offline environment.

Evidence consulted 2026-09-02: GitLab backup/restore and offline-install docs; Kubernetes kubeadm upgrade docs; Backstage deployment, Kubernetes integration, plugin installation and configuration docs; Nix Flakes/devShell documentation.

## Identity / source of truth
Universal identities should be separated: `OperatorContract` (semantic operational requirements), `InstallationRealization` (method/environment-specific realization), `EnvironmentRevision`, `DependencyClosure`, `UpgradePlan`, `UpgradeAttempt`, `BackupArtifact`, `RestoreAttempt`, `DiagnosticBundle`, and `OperationalConformanceResult`. A hosted control plane, self-hosted control plane and generated runtime may realize different subsets while conforming to the same semantic contract.

## Lifecycle and versioning
Bootstrap → configured installation → validated readiness → operation → upgrade plan → upgrade attempt → post-upgrade conformance, with backup/restore and recovery as independent transitions. GitLab demonstrates that restore compatibility may be exact-version-bound and that application data, secrets and environment configuration have distinct custody requirements. kubeadm demonstrates staged component upgrades and version-skew constraints rather than arbitrary in-place replacement.

## Failure semantics
Installation success is not operational conformance. Backup existence is not restoreability. Restore completion is not post-restore conformance. Upgrade failure may require automatic or manual rollback, but rollback capability depends on retained pre-transition state. Offline dependency omission is a bootstrap failure, not a runtime-domain failure. Provider/model/Builder unavailability must not invalidate already-generated runtime authority or silently elevate operator authority.

## Extensibility and provider boundaries
Backstage demonstrates plugins as explicit integration boundaries: frontend presentation and backend provider mechanics can be separated, with provider configuration externalized. Extension/provider installation must therefore be modeled as an operator-controlled realization change with compatibility/admission evidence, not as authority to mutate canonical business semantics.

## Governance / observability
Operator convenience paths must remain subject to Governance and Authorization. Diagnostics/support bundles require explicit scope, redaction and provenance. Operational health/readiness, backup creation, restore attempt and post-restore conformance are separate evidence classes. Delegated administration is bounded by the Station/capability exposure contract; super-admin ergonomics must not imply business-domain authority.

## Portability / lock-in
Self-hosting is insufficient if installation depends on opaque hosted services. Portability requires dependency closure, explicit configuration/secrets/provider bindings, reproducible environment inputs, exportable state and documented recovery. Hosted and self-hosted offerings may differ in realization but material semantic capability differences must be explicit rather than hidden lock-in.

## Product-specific mechanism vs universal primitive
Product-specific: GitLab package/Helm/Docker backup utilities, kubeadm directories/commands, Backstage app-config/plugin packaging, Nix flake syntax. Universal: declared dependency closure; installation realization; environment revision; upgrade plan/attempt/result; backup/restore lineage; diagnostic evidence; operational conformance; provider-neutral binding; delegated operator authority.

## Convergent patterns
- Installation realization is separate from semantic operational contract.
- Configuration/secrets/state have different custody and restore semantics.
- Upgrade is staged and constrained by compatibility/version-skew evidence.
- Backup is only useful when restoreability and post-restore conformance are proven.
- Provider/plugin integrations should sit behind explicit configuration/binding boundaries.
- Reproducibility requires declared dependency/environment inputs, not workstation folklore.

## Divergent patterns
GitLab provides a vertically integrated application/operator experience; Kubernetes exposes composable infrastructure primitives and staged control-plane operations; Backstage deliberately delegates deployment style to the organization; Nix moves reproducibility deeper into declarative environment/build inputs. Generation 2 should preserve these as alternative realizations rather than canonize one deployment stack.

## Subcapabilities
Bootstrap & dependency closure; reproducible developer environment; installation realization; configuration/secrets/provider discovery; upgrade/version-skew planning; backup/restore/DR operator UX; diagnostics/support bundle/redaction; extension/provider lifecycle; delegated/multi-Station administration; hosted/self-hosted equivalence; generated-runtime autonomy; offline/disconnected operation; post-transition conformance.

## Limited fresh-main comparison
A bounded default-branch search for self-host/bootstrap/install/upgrade/backup/restore/operator/runtime-autonomy terms returned no specific implementation evidence in this pass. This is **not evidence of repository-wide absence**; authoritative archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP** any existing separation between generated runtime and Builder/control-plane lifecycle when repo archaeology proves it.
- **HARDEN** operational transitions with explicit plan/attempt/result and conformance evidence.
- **GENERALIZE** installation/dependency/configuration contracts away from one hosting realization.
- **PROVIDERIZE** replaceable infrastructure, model, storage and integration dependencies behind bindings where semantics permit.
- **INTEGRATE** diagnostics, governance, secrets, provenance and recovery evidence rather than duplicating their ownership.
- **DEFER** product-specific installer UX until universal operator contracts and target deployment planes are reconciled.
- **DO_NOT_BUILD** privileged operator escape hatches that silently bypass Station/Role, Governance or canonical-domain authority.

## Repo-validation questions
1. Which current packages own Builder bootstrap, generated-runtime bootstrap and deployment activation separately?
2. Which artifacts enumerate runtime dependency closure and provider bindings?
3. Can generated runtime continue serving bounded business behavior when Builder/model provider is unavailable?
4. What state/config/secrets are required to reconstruct a control plane and a generated runtime?
5. Are upgrade and rollback decisions represented separately from attempts/results?
6. Is there an existing support/diagnostic bundle with redaction/provenance?
7. Can operator/admin paths mutate domain definitions without normal authorization/governance gates?
8. How are provider/extension versions pinned and checked for skew?
9. How will `Station` delegated administration be represented without granting enterprise-global authority?

## Adaptive Governed Work Surfaces + AI-native composition
Adaptive surfaces must remain usable from their generated runtime when the Builder or model provider is unavailable to the extent their already-materialized bindings/actions permit. Editing that requires AI may become unavailable/degraded, but runtime use must not silently acquire a fallback path that edits HTML/schema/domain rules. Model/provider replacement must preserve the same materialization authority envelope. Station administrators may manage only exposed capabilities and delegated policies. A disconnected/self-hosted Station can consume local or reachable provider bindings without coupling its surface definition to a vendor endpoint.

## Symbiotic Proof
A valid Generation-2 proof should deploy the same portable definition into at least two operational realizations (for example hosted and self-hosted/offline-capable), prove generated-runtime operation during Builder/model-provider outage, replace one external provider without rewriting the work surface, restore from a declared backup set including required secret/config custody, and demonstrate that operator recovery/diagnostic paths cannot bypass Station/Role or canonical-domain authority.

## Stable findings
- **G2-FINDING-DOESH-11 — Operational Contract and Installation Realization Are Distinct Identities.** Self-hosting portability requires a semantic operator contract independent of package/container/orchestrator realization.
- **G2-FINDING-DOESH-12 — Dependency Closure Is a First-Class Bootstrap Evidence Object.** Offline/reproducible installation requires evidence that all required artifacts and dependencies are available for the target environment; successful online installation is not that proof.
- **G2-FINDING-DOESH-13 — Backup Artifact, Restore Attempt and Post-Restore Conformance Are Distinct Evidence.** A backup cannot establish recoverability until restoration and semantic conformance are separately demonstrated.
- **G2-FINDING-DOESH-14 — Upgrade Planning Must Bind Version-Skew Preconditions to the Attempt.** Compatibility constraints and a pre-transition plan/diff are inputs to a governed upgrade, not documentation-only advice.
- **G2-FINDING-DOESH-15 — Generated Runtime Operational Autonomy Must Be Stronger Than Builder/Model Availability.** Already-materialized runtime behavior must not require Builder/model availability unless the portable contract explicitly declares that dependency; authoring degradation must not become authority escalation.
- **G2-FINDING-DOESH-16 — Operator Convenience Authority Must Not Collapse Into Canonical Business Authority.** Installation, recovery, diagnostics, provider management and delegated Station administration require explicit authority scopes and cannot become a superuser bypass around domain/process governance.

## Candidate concepts
- `G2-CAPABILITY-CANDIDATE-OPERATIONAL-REALIZATION-CONFORMANCE-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-OFFLINE-DEPENDENCY-CLOSURE-EVIDENCE` — CROSS_CUTTING.
- `G2-CAPABILITY-CANDIDATE-RESTORE-POST-CONFORMANCE-LINEAGE` — CROSS_CUTTING.

## Value / risk / priority / next question
Value: very high for anti-lock-in and runtime autonomy. Risk: high if operator ergonomics become an implicit privileged architecture or if hosted-only dependencies leak into portable definitions. Priority: high. Next external-research question after rotation: Architecture Reconciliation as a Capability; then cycle accounting must be recomputed without prematurely entering synthesis.