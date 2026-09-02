# Developer / Operator Experience / Self-hosting — Revisit 03

Status: REVISIT 03 / CYCLE 4 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
What constitutional contracts let the System Builder keep installation, diagnosis, upgrade and self-hosted operation simple for small systems while remaining dependency-complete, reproducible, secure, provider-replaceable and recoverable as topology matures into multi-node, disconnected, multi-tenant or delegated-Station operation?

This revisit intentionally deepens gaps left by Revisit 02 rather than repeating its overview: simple-path versus mature-topology semantics, declarative/immutable host realization, disconnected update history, rollback eligibility, safe operator previews, local diagnostic custody, bootstrap trust and bounded administrative authority.

## Representatives and evidence/source ledger

1. **Talos Linux** — immutable/API-driven node administration; machine configuration patches; image-based upgrades/rollback; local health/log/support collection; explicit PKI/secrets bundle and role-scoped client certificates. Official evidence reviewed 2026-09-02: Talos configuration patching, upgrades, troubleshooting, CLI/PKI and Image Factory documentation.
2. **OpenShift Container Platform disconnected environments / oc-mirror** — image-set configuration, fully disconnected mirror-to-disk/disk-to-mirror workflow, generated mirror resources, update graph/material, persistent mirror metadata and incremental mirroring. Official Red Hat 4.20 documentation reviewed 2026-09-02.
3. **NixOS / Nix** — declarative system generations, dry activation, build/test/build-vm paths, rollback to prior generations and garbage-collection interaction with retained rollback points. Official Nix/NixOS material reviewed 2026-09-02.
4. **Kubernetes kubeadm / kubectl diagnostics** — bootstrap-token discovery with CA pinning, explicit unsafe bypass, preflight behavior, node debug requiring elevated scheduling/host-filesystem permissions and version/config diagnostics. Official Kubernetes documentation reviewed 2026-09-02.
5. **Prior-cycle K3s, Dev Containers/Codespaces, Docker Compose and Coolify evidence** remains authoritative for small-path bootstrap, local topology, phase-scoped secret availability and control-plane restore boundaries; this revisit uses it only for contradiction/cross-checking, not as fresh coverage credit.

### Source URLs
- Talos configuration patches: https://www.talos.dev/v1.9/talos-guides/configuration/patching/
- Talos upgrades/rollback: https://www.talos.dev/v0.11/learn-more/upgrades/
- Talos troubleshooting/support: https://www.talos.dev/v1.6/introduction/troubleshooting/
- Talos CLI / generated secrets: https://www.talos.dev/latest/reference/cli/
- Talos PKI: https://www.talos.dev/v1.5/talos-guides/configuration/managing-pki/
- Talos boot assets/Image Factory: https://www.talos.dev/latest/talos-guides/install/boot-assets/
- OpenShift disconnected environments 4.20: https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/observability/disconnected_environments/index
- NixOS rebuild/generations: https://wiki.nixos.org/wiki/Nixos-rebuild
- Nix generation deletion/rollback: https://releases.nixos.org/nix/nix-2.24.5/manual/command-ref/nix-env/delete-generations.html
- kubeadm join: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-join/
- kubectl node debug: https://kubernetes.io/docs/tasks/debug/debug-cluster/kubectl-node-debug/

## Evidence-derived primitives

### Source of truth / semantic identity
Keep distinct:

`OperationalProfileRevision`
→ `TopologyRequirementRevision`
→ `BootstrapClosureRevision`
→ `BootstrapTrustRevision`
→ `EnvironmentRealizationRevision`
→ `OperatorTransitionAttempt`
→ `ObservedOperationalEvidenceSet`.

The operational profile says what must be possible; provider/host/orchestrator realization says how it is achieved. A CLI command, installer image, mirror registry, generated host config or dashboard is never the canonical identity of the operational requirement.

### Simple-path versus mature-topology identity
The same semantic system may legitimately realize as one grouped local runtime, one-node development environment, HA cluster, disconnected fleet or split runtime topology. The operator experience should therefore expose **progressive realization complexity without semantic rewrite**. Small installations may collapse topology decisions into defaults, but those defaults must still resolve to explicit revisioned topology/profile facts so later decomposition does not require redefining the system.

### Bootstrap trust
Bootstrap material is not just another configuration value. kubeadm demonstrates that trust discovery can be CA-pinned and that bypassing verification explicitly weakens the security model. Talos likewise separates generated secret bundles, CAs and role/TTL-scoped client certificates. Universal primitive: `BootstrapTrustRequirement` and `BootstrapTrustEvidence`, independent of general configuration and independent of later authorization.

### Safe operator preview
NixOS `dry-activate`, `test`, `build-vm`, kubeadm preflight checks and declarative Talos patch generation converge on a reusable operator primitive: `TransitionPreview/ValidationEvidence` should exist before privileged mutation whenever practical. Preview evidence does not confer actuation authority and becomes stale when the target/profile/dependencies change.

### Disconnected update history
OpenShift oc-mirror requires persistent metadata/storage history for incremental mirroring and update material. This shows that offline closure is not only “all bytes are present”: update continuity may depend on **lineaged closure history/metadata** that explains what changed and which update path is valid.

### Local diagnostics
Talos can gather logs/support bundles for offline analysis; Kubernetes node debug is possible without SSH but itself requires elevated permissions. Universal primitive: local diagnostic evidence must be exportable independently of a vendor control plane, while diagnostic capability remains explicitly authority-scoped because many debugging paths are privileged.

### Rollback eligibility
Nix generations and Talos A/B rollback show that rollback availability depends on retained generations/images and may disappear after garbage collection or data-destructive upgrade choices. Therefore `RollbackPossible` is evidence about retained material plus compatibility/postconditions, not a permanent property of “supports rollback”.

## Lifecycle / versioning
1. Resolve semantic operational profile and topology requirements.
2. Resolve required artifacts/tools/mirrors/migration interpreters/trust/secret references into a closure revision.
3. Validate bootstrap trust and operator authority.
4. Preview/preflight where applicable.
5. Actuate bootstrap/upgrade/configuration transition.
6. Observe effective topology/runtime/provider revision.
7. Qualify local diagnostics/readiness/domain conformance.
8. Retain rollback/recovery material according to declared policy.
9. Any topology/provider/trust/closure change invalidates affected readiness/preview evidence and creates a new transition lineage.

## Failure semantics
- A one-command install is **INCOMPLETE** if its required network, registry, trust, migration or diagnostic dependencies are implicit.
- A disconnected archive is **INCOMPLETE** if required mirror metadata/update-path state is absent for the claimed maintenance profile.
- `dry-run/preflight success` is not actuation authority and not postcondition proof.
- `node/service healthy` is not domain conformance.
- A rollback command is **UNAVAILABLE/INCONCLUSIVE** when the retained prior realization has been garbage-collected, overwritten, made incompatible or lacks state/trust prerequisites.
- Local diagnostics that require privileged host mounts/cluster mutations must not be automatically exposed to Station/Role/Person merely because the runtime is self-hosted.
- If bootstrap trust cannot be verified, safe behavior is fail-closed or explicit degraded/inconclusive state; convenience bypass must be separately authorized and evidenced.

## Extensibility / provider boundaries
Environment/orchestrator/host realization remains providerized. Talos, kubeadm/Kubernetes, K3s, Compose or future providers can satisfy the same topology/profile only if conformance evidence proves required semantics. Provider substitution must not change canonical System/Station/capability identity.

Image/mirror tooling, diagnostic transport, local orchestrator, PKI/bootstrap mechanism and update channel are replaceable realizations. The SB should own semantic requirements and evidence contracts, not vendor lifecycle syntax.

## Governance and bounded authority
Self-hosting is not equivalent to unrestricted administration. Maintain explicit distinctions among:

`DefinitionAuthority ≠ BootstrapAuthority ≠ Host/ClusterAdminAuthority ≠ DiagnosticAuthority ≠ Secret/TrustAuthority ≠ UpgradeAuthority ≠ RecoveryAuthority`.

A Station delegated operational administration may exercise only capabilities delegated by Enterprise and within the Station exposure envelope. `Role`/`Person` and AGWS overlays cannot acquire host debug, secret bundle, CA, mirror administration or recovery authority from mere physical proximity to a self-hosted runtime.

## Observability
Operator evidence must name exact operational-profile revision, topology realization, provider/runtime versions, bootstrap/upgrade attempt, trust revision, closure revision, time, freshness and diagnostic source. Unknown or stale observations must remain representable as `INCONCLUSIVE`.

## Portability / lock-in
Portable self-hosting requires exportable definitions, artifacts/closure manifests, trust references, state/backup requirements, diagnostics and migration/recovery interpreters. A system is still operationally locked in if ordinary diagnosis, update-path calculation, rollback qualification or recovery requires an opaque vendor control plane.

OpenShift demonstrates a useful counterpoint: disconnected autonomy can intentionally include a locally operated mirror/update service. That is acceptable when its required metadata and realization are explicit/profiled rather than hidden control-plane dependency.

## Product-specific mechanism vs universal primitive

| Product-specific mechanism | Universal primitive |
|---|---|
| Talos machine config/API/A-B image | revisioned host realization + governed transition + retained rollback material |
| Talos `talosctl support` | locally exportable diagnostic evidence bundle |
| Talos secrets bundle / role certificate | bootstrap trust requirement + scoped trust/credential realization |
| OpenShift ImageSetConfiguration / oc-mirror metadata | disconnected dependency/update closure + history-qualified maintenance evidence |
| Nix generations / dry-activate / build-vm | retained realization generations + preview/validation before mutation |
| kubeadm CA hash / unsafe skip | bootstrap trust pinning + explicit weakened-trust exception |
| `kubectl debug node` | privileged diagnostic capability under explicit authority |

## Convergent / divergent patterns

### Convergent
1. Declarative desired state and actual realization are distinct.
2. Bootstrap requires explicit trust anchors/credentials, not only package bytes.
3. Offline maintenance needs closure/history, not simply initial-install media.
4. Safe systems offer preview/preflight/test paths before mutation.
5. Rollback relies on retained material and is therefore stateful/conditional.
6. Local diagnostics are part of autonomy but may themselves require powerful authority.
7. Simple operator UX can sit above explicit underlying topology/profile semantics.

### Divergent
- Talos minimizes host mutation/SSH surface; kubeadm assumes a conventional host and supports debug paths with elevated host access. The SB should not universalize either host model.
- Nix favors generational declarative realization and broad rebuild semantics; Kubernetes/OpenShift emphasize orchestration/update graphs. The common primitive is versioned realization plus governed transition, not one deployment mechanism.
- OpenShift's disconnected model can require a persistent local mirror/update service; K3s can be materially simpler. Therefore “air-gapped” must be profile-specific and cannot mandate a heavyweight infrastructure floor.

## Subcapabilities deepened
- progressive simple-to-mature operational realization;
- bootstrap trust/pinning and exception evidence;
- declarative host/environment realization;
- preflight/preview/dry-run validation;
- disconnected install + update-history closure;
- conditional rollback eligibility and retained-material policy;
- local/exportable diagnostics with bounded authority;
- provider/host/orchestrator substitution;
- delegated Station operations without authority amplification;
- operator-error containment through safe defaults and explicit weakened-safety exceptions.

## Comparison with fresh `main` — evidence bounded
A bounded fresh-main code search for `self-hosted offline runtime autonomy environment topology diagnostics` and for `runtime autonomy provider binding deployment environment` returned no matches during this revisit. This is recorded only as negative evidence for those exact searches. It is **not** repository archaeology and does not establish repository-wide absence. Full SB current-state reconciliation remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **HARDEN** “simple install” into a simple UI/workflow over explicit topology/profile/closure/trust facts rather than hidden defaults.
- **GENERALIZE** `TransitionPreview/ValidationEvidence`, `RollbackEligibilityEvidence`, `BootstrapTrustEvidence` and local diagnostic bundles across Build/Runtime/Lifecycle/Security.
- **INTEGRATE** qualified local closure with Artifact, Build, Secrets, Deployment, Security/Recovery and AI local closure; DX/Ops should project these facts rather than duplicate ownership.
- **PROVIDERIZE** host/orchestrator/mirror/update/diagnostic realizations.
- **KEEP** strict separation between desired and effective environment realization and between secret references and secret values.
- **DEFER** rich unified operator portal and automatic topology recommendation until target architecture/reconciliation identifies canonical owners.
- **DO_NOT_BUILD** a “self-hosted” mode that can start locally but cannot diagnose, upgrade, verify trust, restore or qualify rollback without hidden vendor infrastructure.

## Repo-validation questions
1. Can one simple-system operational profile collapse topology choices while retaining explicit revisioned topology facts for later scale-out?
2. Does any bootstrap path currently support/require trust pinning, and can weakened verification be represented as an explicit exception rather than a flag with no governance evidence?
3. Can current environment/config mutations be previewed or preflighted without actuation?
4. Is there a machine-readable local closure that covers updates as well as first install, including mirror/update-path history where needed?
5. Can rollback eligibility be computed from retained artifacts/state/trust and compatibility rather than assumed from provider feature support?
6. Are diagnostics exportable locally, and are privileged debug operations separately authorized from ordinary operation?
7. Are host/orchestrator/provider identities kept out of canonical System/Station/capability identity?
8. Can Station administrators perform bounded operational acts without gaining Enterprise-global cluster, trust, secret or recovery authority?
9. Can the same semantic system move from grouped/local topology to split/HA topology without semantic application rewrite?
10. Can an offline/self-hosted AI/operator path report `INCONCLUSIVE` when closure, trust or diagnostic evidence is stale/incomplete?

## Adaptive Governed Work Surfaces cross-check
AGWS remains an independent capability. Operator/self-hosting mechanics must expose only semantic components/actions already admitted by `Enterprise → Station → Role → Person`. AI is still the sole AGWS materializer, but neither local hosting nor agent access grants host debug, CA/secrets, mirror/provider admin, topology mutation, upgrade or recovery authority. A request requiring those powers becomes an escalation artifact.

A Station change that alters runtime/provider/topology/operational profile must trigger surface/action revalidation when the work surface depends on those capabilities. Personal layout lineage remains separate from environment/operator transition lineage.

## Symbiotic Proof
Run one semantic system through two profiles:

**Profile S — simple/local:** a single grouped realization with one-command guided bootstrap. Prove the UI hides unnecessary topology ceremony while emitting explicit topology/profile/closure/trust revisions, supporting preview and locally exportable diagnostics.

**Profile M — mature/disconnected:** split/HA realization using a materially different orchestrator/provider and an offline mirror/update closure. Preserve the same System/Station/capability semantic identities. Perform a provider/runtime upgrade, intentionally remove one closure-history or trust prerequisite, and require fail-closed/`INCONCLUSIVE`; restore the prerequisite and complete the governed transition. Retain a previous realization and prove rollback eligibility; then deliberately remove retained rollback material and prove rollback becomes unavailable rather than falsely advertised.

Across both profiles, attempt privileged diagnostics and a Station-level topology/provider mutation from AGWS/AI without delegated authority; both must be denied/escalated. The final evidence set must distinguish desired, effective and observed topology plus exact trust/closure/transition revisions.

## Stable findings
- **G2-FINDING-DOESH-23 — Simple Operator Experience Must Be a Progressive Projection Over Explicit Topology Semantics, Not Hidden Architectural Defaults.** A small system may collapse deployment choices, but the resolved topology/profile remains explicit and can later split/scale without semantic system rewrite.
- **G2-FINDING-DOESH-24 — Bootstrap Trust Is a First-Class Revisioned Requirement Separate From General Configuration and Later Authorization.** CA pinning, trust roots, bootstrap tokens/certificates and weakened-trust exceptions need explicit evidence and authority.
- **G2-FINDING-DOESH-25 — Operator Preview/Preflight Evidence Must Be Non-Actuating and Revision/Freshness Bound.** Dry-run, test, build-vm and preflight can reduce operator error but cannot confer mutation authority or survive material target/dependency changes unchanged.
- **G2-FINDING-DOESH-26 — Disconnected Operational Closure Includes Maintenance/Update History Where the Provider Requires It.** Initial-install bytes alone are insufficient when safe incremental updates, valid paths or mirror state depend on retained metadata/history.
- **G2-FINDING-DOESH-27 — Rollback Support Is Conditional Eligibility Evidence Over Retained Realizations, State, Trust and Compatibility.** Garbage collection, destructive choices or missing recovery prerequisites can make rollback unavailable even if the provider exposes a rollback command.
- **G2-FINDING-DOESH-28 — Local Diagnostic Autonomy Must Preserve Privilege Boundaries.** Exportable logs/support evidence improves self-host autonomy, but host/node debug, secret inspection and recovery tooling remain separately authorized capabilities.
- **G2-FINDING-DOESH-29 — Self-hosting Does Not Collapse Definition, Bootstrap, Diagnostic, Upgrade, Secret/Trust and Recovery Authorities Into One Administrator Power.** Delegated Station operation remains non-amplifying.
- **G2-FINDING-DOESH-30 — Provider/Topology Substitution Must Preserve Semantic System Identity While Producing New Realization and Conformance Evidence.** Moving from local/grouped to split/HA/disconnected realization must not redefine business/capability identity.

## Capability candidates
| Candidate | Class | Status | Promotion / merge condition |
|---|---|---|---|
| `G2-CAPABILITY-CANDIDATE-PROGRESSIVE-OPERATIONAL-REALIZATION-PROFILE` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Reconcile with Topology/Build/Runtime hypothesis; likely profile semantics rather than standalone capability. |
| `G2-CAPABILITY-CANDIDATE-BOOTSTRAP-TRUST-QUALIFICATION-EVIDENCE` | CROSS_CUTTING | CANDIDATE | Identity/Secrets/Security synthesis must confirm common bootstrap-trust ownership and exception semantics. |
| `G2-CAPABILITY-CANDIDATE-NON-ACTUATING-OPERATOR-TRANSITION-PREVIEW-EVIDENCE` | CROSS_CUTTING | MERGE_TARGET | Merge with revision-bound readiness/validation evidence if operator-specific preview adds no independent ownership. |
| `G2-CAPABILITY-CANDIDATE-ROLLBACK-ELIGIBILITY-RETAINED-MATERIAL-EVIDENCE` | CROSS_CUTTING | CONSOLIDATION_CANDIDATE | Lifecycle/Security/Artifact reconciliation should determine whether one shared eligibility contract covers runtime/config/build rollback. |
| `G2-CAPABILITY-CANDIDATE-BOUNDED-LOCAL-DIAGNOSTIC-AUTHORITY-EVIDENCE` | CROSS_CUTTING | CANDIDATE | Observability/Security/Authorization must confirm common distinction between evidence read/export and privileged diagnostic actuation. |

No candidate is promoted in this revisit.

## Proof Obligations / Quality Tests
1. **Simple→mature topology proof:** instantiate one semantic system under a collapsed local profile and then a split/HA profile; semantic System/Station/capability identities remain unchanged while realization evidence changes.
2. **Bootstrap-trust adversarial proof:** alter the presented bootstrap CA/trust material. Join/bootstrap must fail unless an explicit separately authorized weakened-trust exception is present and evidenced.
3. **Preview non-actuation proof:** run preview/preflight against a privileged topology/config change; prove no mutation occurs. Change target/dependency revision afterwards and show prior preview evidence becomes stale.
4. **Disconnected-maintenance closure proof:** bootstrap from offline closure, then perform an allowed update with retained history/metadata. Remove required mirror/update metadata and require explicit incomplete/`INCONCLUSIVE` result rather than silent online fallback.
5. **Rollback-eligibility proof:** perform upgrade with retained prior realization, validate rollback; remove/expire one required retained artifact/state/trust prerequisite and prove rollback becomes unavailable or requires recovery, not falsely READY.
6. **Local-diagnostics authority proof:** ordinary Station operator can export permitted diagnostic evidence but cannot invoke privileged node/host debug, secret inspection or recovery without delegated authority.
7. **Provider-substitution proof:** realize the same operational profile with two materially different host/orchestrator providers; provider identifiers remain non-canonical and acceptance profile is re-proven on the replacement.
8. **AGWS/AI non-amplification proof:** from a local/self-hosted AGWS ask AI to alter topology/provider, expose secret/CA or run recovery without authority. Candidate may be proposed, but authoritative actuation must be denied/escalated.

Proof-backfill status advances from `BACKFILL_REQUIRED` to `PARTIAL`; executable acceptance translation remains future work for Planning E.

## Value / risk / priority / next question
- **Value:** very high; makes “self-hosted”, “simple to run” and “grows with you” objectively architectural instead of marketing labels.
- **Risk:** very high if simple UX is achieved by hiding irreversible defaults, implicit online dependencies or global admin powers.
- **Priority:** high input to Topology/Build/Runtime, Security/Recovery, qualified local closure and eventual product-proof design.
- **Next question:** `Architecture Reconciliation as a Capability` — revisit cycle 4, unless the authoritative state changes before the next execution.
