# Generation 2 — Developer / Operator Experience / Self-hosting

Status: FIRST DEEP PASS — NOT SATURATED  
Run basis: external representative research + bounded comparison against fresh `main` at `0fc5bc980f98e9b7cdcb2acfdb52ad4f1cc95f60`.

## Research question

Which primitives make a generated system and the System Builder itself operable, reproducible, diagnosable, recoverable and transferable across developer/operator environments without confusing convenience UX, control-plane ownership or hosted-provider mechanics with runtime autonomy?

## Representatives

1. Backstage Software Catalog + Software Templates + TechDocs — developer portal, ownership metadata, golden paths and docs-as-code.
2. GitHub Codespaces + Dev Containers — repository-bound reproducible developer environment, lifecycle and recommended-secret setup.
3. Kubernetes administration — explicit cluster/node health, diagnostics, upgrade backups and operator-authority boundaries.
4. Coolify self-hosted — instance lifecycle, self-update, instance backup/restore, application-data boundary and server portability.
5. Nix Flakes / `devShell` — declarative reproducible environment inputs and development-shell realization.

## Evidence / source ledger

| Representative | Source of truth reviewed | Evidence used |
|---|---|---|
| Backstage | https://backstage.io/docs/features/software-catalog/ ; https://backstage.io/docs/features/software-templates/ ; https://backstage.io/docs/features/techdocs/creating-and-publishing/ | Catalog ownership is discoverability/metadata rather than runtime authorization; templates create/publish components; TechDocs keeps docs near code. |
| GitHub Codespaces | https://docs.github.com/en/codespaces/about-codespaces/what-are-codespaces ; https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/configuring-dev-containers | Repository configuration can define repeatable dev containers; creation has explicit VM/container/repository/setup lifecycle; recommended secrets are declared separately from values. |
| Kubernetes | https://kubernetes.io/docs/tasks/debug/debug-cluster/monitor-node-health/ ; https://kubernetes.io/docs/tasks/debug/debug-cluster/kubectl-node-debug/ ; https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/ | Node conditions/events and debugging are explicit; debug requires authority; upgrade writes backup material and documents manual restore if rollback fails. |
| Coolify | https://coolify.io/docs/get-started/upgrade/ ; https://next.coolify.io/docs/core/backup-and-recovery/instance-backup ; https://next.coolify.io/docs/core/backup-and-recovery/instance-restore | Self-host updates have policy/manual modes; instance backup excludes application data; restore requires backup plus encryption/SSH material and matching operational context. |
| Nix | https://wiki.nixos.org/wiki/Flakes | Flake inputs/outputs and `devShell` express reproducible environment intent; realization remains platform/tool specific. |

## Source of truth

No universal operator source of truth exists. The portable product definition should own logical requirements and handoff metadata; environment/provider configuration owns bindings; runtime state owns actual execution health; operator evidence owns diagnostics/recovery results; developer-environment manifests own reproducible tooling inputs. Hosted portals and self-hosting dashboards are projections over those authorities, not substitutes for them.

## Identity

Keep distinct identities for: generated system, release, deployment/environment, developer-environment definition, developer-environment realization, self-hosted control-plane instance, operator actor/session, support bundle, diagnostic attempt, backup artifact, restore attempt and handoff record. A portal/catalog entity or hosting project may reference these identities but must not replace them.

## Lifecycle

Canonical lifecycle is not one global state machine. Convergent bounded lifecycles are:

- developer environment: definition -> realization -> use -> refresh/rebuild -> retirement;
- self-hosted control plane: install -> configure -> validate -> operate -> update/migrate -> backup/restore -> retire;
- generated-system handoff: release/deployment -> export/document -> transfer operator authority -> independent operation -> support/evolution;
- diagnostic/support bundle: request -> collect -> redact -> package -> transfer -> inspect -> expire/delete.

## Versioning

Version independently: product release, environment/deployment configuration, dev-environment manifest and resolved inputs, operator tooling, self-hosted control-plane version, backup format/version, support-bundle schema and provider binding. Local/hosted parity is a compatibility claim requiring evidence, not identical infrastructure.

## Failure semantics

- Bootstrap failure must identify which prerequisite, resolution or initialization step failed.
- A healthy control plane does not prove managed application health, and managed application health does not prove control-plane recoverability.
- Backup success does not prove restore success; restore must produce a verified lineage/result.
- Diagnostics can fail due to missing authority, unreachable target, unavailable tooling, incomplete evidence or redaction policy.
- Offline/degraded operation must declare which operations remain available and which require external providers/control-plane connectivity.
- Update rollback may be unavailable or partial; irreversible migrations require recovery evidence rather than a generic rollback promise.

## Extensibility

Developer/operator UX may expose extension/provider management, templates, diagnostics and support actions, but extension activation and provider authority stay owned by their corresponding capabilities. UI convenience cannot silently grant installation, mutation, debug-host or recovery authority.

## Provider boundaries

Universal primitives: environment requirement, binding reference, release/deployment identity, diagnostic request/result, support bundle manifest, backup/restore evidence, operator authority reference, handoff manifest, dev-environment definition and reproducibility claim.

Provider/product-specific mechanisms: Codespaces VM/container allocation, Kubernetes node-debug pods/etcd handling, Coolify instance lifecycle, Nix realization, portal rendering and specific backup transports.

## Governance

Operator actions must be attributable and authority-scoped. Handoff must state ownership, supported operations, required credentials/bindings, recovery responsibilities, telemetry/export choices, provider dependencies and retained SB responsibilities. Support bundles require explicit collection scope, sensitive-data redaction and retention policy. Catalog ownership is informative unless separately bound to authorization.

## Observability

Expose machine-readable health/diagnostic evidence separately for control plane, generated runtime, provider binding and environment. Prefer exportable support evidence over dashboard-only state. Telemetry opt-in/export settings must not make basic local diagnostics impossible.

## Portability and lock-in

Portability requires that a generated runtime can be operated without a live System Builder dependency and that its essential configuration, contracts, release identity, environment bindings, operational instructions and evidence can be exported. A self-hosting dashboard is not portability if backup, secrets, provider bindings, proxy/network assumptions or application data cannot be reconstructed outside it. Hosted-only developer convenience is optional and must not become a build/runtime prerequisite.

## Product-specific mechanism vs universal primitive

Do not universalize Backstage templates, `devcontainer.json`, Kubernetes administration, Coolify projects or Nix flakes. Generalize the semantics they repeatedly expose: reproducible environment definition, explicit realization, operator authority, diagnostic evidence, recovery evidence, separable control-plane/application state and portable handoff.

## Convergent patterns

1. Declarative/repository-bound setup improves repeatability but does not remove provider realization differences.
2. Ownership metadata, operational authority and credential possession are distinct.
3. Control-plane lifecycle is separate from managed workload lifecycle.
4. Backup scope must be explicit; platform backup frequently excludes workload/application data.
5. Restore/recovery is a proof-bearing operation, not an inferred property of backup existence.
6. Diagnostics require both access authority and exportable evidence.
7. Self-hosting autonomy depends on explicit external dependencies and recoverable local state.
8. Golden paths/templates improve DX but must remain replaceable projections over portable definitions.

## Divergent patterns

- Codespaces optimizes hosted developer realization; Nix emphasizes declarative reproducibility across realizations.
- Backstage optimizes discovery/scaffolding/ownership UX rather than operating the generated workload itself.
- Kubernetes exposes low-level operator primitives and explicit authority boundaries; Coolify intentionally collapses many operations into an integrated self-hosted control plane.
- Backup boundaries differ materially: platform/control-plane state and application/workload state cannot be assumed co-located.

## Subcapabilities

- developer bootstrap and reproducible environment definition;
- local/hosted compatibility evidence;
- generated-system operational handoff;
- operator identity/authority UX;
- install/update/migration/retirement UX;
- diagnostics and support-bundle export;
- backup/restore/recovery UX and evidence;
- provider/extension management projection;
- offline/degraded operation contract;
- telemetry configuration/export UX;
- self-hosted control-plane recovery;
- portability/lock-in disclosure.

## Fresh-main System Builder comparison

Evidence inspected only from fresh `main` at `0fc5bc980f98e9b7cdcb2acfdb52ad4f1cc95f60`:

- `README.md` declares an open, compatibility-first factory, local bootstrap prerequisites and bounded task/verification commands. It explicitly requires published runtimes to remain operational without the Builder and portable data/contracts/releases.
- `ARCHITECTURE.md` separates Control Plane from Execution/Data Plane and states that normal runtime operations must never require a live System Builder call. It also separates release from environment and keeps deployment secrets outside artifacts.
- `.env.example` provides explicit local/test/dev/prod database configuration and warns that real credentials are not committed.

These are strong constitutional and bootstrap foundations. This pass found no evidence sufficient to assert a universal dev-environment manifest, self-host install/update/restore subsystem, support-bundle schema, backup/restore proof contract, offline/degraded capability matrix, or generated-system operator handoff artifact. Those remain repository-validation questions rather than assumed gaps.

## Reconciliation hypotheses

- **KEEP** — Builder/Runtime separation, runtime autonomy, portable release direction, explicit environment configuration and existing local bootstrap.
- **HARDEN** — machine-readable bootstrap diagnostics, operator evidence, handoff completeness and explicit degraded-operation semantics.
- **GENERALIZE** — portable developer-environment requirement/realization evidence, support-bundle and operator-handoff primitives where multiple capabilities need them.
- **PROVIDERIZE** — hosted developer environments, self-host dashboards, backup transports, cluster management and environment realization.
- **INTEGRATE** — existing Release/Deployment/Observe/Support evidence into operator-facing views without transferring semantic ownership to DX.
- **DEFER** — polished portal/marketplace/self-host GUI until capability ownership and target planes are reconciled.
- **DO_NOT_BUILD** — a universal hosting platform, universal cluster orchestrator or proprietary runtime dependency solely to improve operator UX.

## Repo-validation questions

1. Which existing contracts already encode deployment/operator handoff beyond release/environment identity?
2. Can generated releases reconstruct required environment bindings and runtime prerequisites without Builder access?
3. Is there existing structured diagnostic/support evidence beyond Observe findings?
4. What state is Builder-only versus required for autonomous generated-system recovery?
5. Are backup/restore responsibilities represented anywhere in current contracts/tests?
6. Do current CLIs/scripts expose stable machine-readable diagnostics or only human command flows?
7. Which provider/extension lifecycle operations already have bounded operator authority?
8. What telemetry or support evidence can a self-hosted client export without central connectivity?
9. Which local bootstrap assumptions are currently implicit in Node/npm/PostgreSQL versions or CI services?
10. Is any generated runtime operation still accidentally coupled to Builder-hosted infrastructure despite constitutional intent?

## Symbiotic Proof

A convincing Generation 2 proof should demonstrate the same portable system definition/release being: (a) developed from a reproducible local environment; (b) deployed with native/local bindings; (c) deployed with at least one replaceable external provider; (d) handed to a separate operator with explicit prerequisites, authority and recovery responsibilities; (e) kept operational while Builder is unavailable; (f) diagnosed using exportable evidence; (g) backed up/restored where applicable with verified lineage; and (h) brought back to the Builder later for support/evolution without making the runtime dependent on the Builder in between.

## Stable findings

- **G2-FINDING-DOESH-01 — Developer Environment Definition and Realization Are Distinct.** A repository manifest can define intent/reproducibility inputs; the actual machine/container/provider realization has separate identity and evidence.
- **G2-FINDING-DOESH-02 — Developer Convenience Is Not Runtime Authority or Runtime Dependency.** Portal, Codespace, template and dashboard UX may project capabilities but must not become mandatory runtime control paths.
- **G2-FINDING-DOESH-03 — Catalog Ownership Metadata Is Not Operator Authorization.** Discoverability/responsibility metadata cannot silently grant production mutation, debugging or recovery rights.
- **G2-FINDING-DOESH-04 — Control-plane Health and Managed-runtime Health Are Independent Evidence.** Each needs separate diagnostics, failure semantics and recovery responsibility.
- **G2-FINDING-DOESH-05 — Platform Backup Scope Must Be Explicitly Separated From Application/Data Backup Scope.** A self-host control-plane backup can be valid while managed workload data remains unprotected.
- **G2-FINDING-DOESH-06 — Backup Existence Does Not Prove Recoverability.** Restore attempt, resulting lineage and verification evidence are required for a recovery claim.
- **G2-FINDING-DOESH-07 — Operator Diagnostics Require Bounded Authority and Exportable Evidence.** Debug access, evidence collection, redaction and support transfer are separate governed steps.
- **G2-FINDING-DOESH-08 — Local-vs-hosted Parity Is a Compatibility Claim, Not Infrastructure Identity.** Equivalent project capabilities may be realized through materially different providers and must be proven at contract/acceptance level.
- **G2-FINDING-DOESH-09 — Generated-system Handoff Is a First-class Portability Boundary.** A handoff must carry release identity, prerequisites, bindings, operational responsibilities, evidence/export paths and recovery expectations without transferring semantic ownership to a hosting product.
- **G2-FINDING-DOESH-10 — Self-hosting Autonomy Requires Explicit Degraded/Offline Semantics and Recoverable Local State.** “Self-hosted” is insufficient if ordinary operation, diagnostics or restoration silently require a central Builder/service.

## Capability candidates

| Candidate | Class | Why material | Promotion condition |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-GENERATED-SYSTEM-OPERATOR-HANDOFF` | CROSS_CUTTING | Release/deploy/support/portability all need an explicit transfer boundary between builder and independent operator. | Promote if repository reconciliation shows no existing artifact owns prerequisites, bindings, responsibilities and evidence/export paths. |
| `G2-CAPABILITY-CANDIDATE-SUPPORT-BUNDLE-EVIDENCE` | CROSS_CUTTING | Kubernetes diagnostics plus self-host support practice converge on portable diagnostic evidence with authority/redaction concerns. | Promote if Observe/Support lacks a reusable exportable diagnostic-evidence contract. |
| `G2-CAPABILITY-CANDIDATE-DEVELOPER-ENVIRONMENT-REALIZATION-EVIDENCE` | CORE | Codespaces/dev containers and Nix converge on definition-vs-realization identity and reproducibility evidence. | Promote if Generation 2 acceptance requires reproducible bootstrap across local/hosted providers rather than documentation-only guidance. |

No candidate is promoted in this pass.

## Value / risk / priority / next question

- **Value:** High — directly determines whether “open, portable, autonomous” is operable rather than merely architectural intent.
- **Risk:** High if collapsed into a dashboard capability; that would recreate lock-in and duplicate authority owned by deployment, observe, secrets, providers and recovery.
- **Priority:** High cross-cutting, but downstream of canonical capability ownership.
- **Next question:** complete the only remaining first-pass macro-capability, **Architecture Reconciliation as a Capability**, then use revisits to test whether handoff/support/reproducibility candidates recur strongly enough for promotion before synthesis.
