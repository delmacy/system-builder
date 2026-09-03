# Developer / Operator Experience / Self-hosting — Revisit 6 (Cycle 7)

## Research question
What architecture contracts let System Builder installations prove that install, operation, upgrade, recovery and supportability claims are effective for the exact Station/environment/cohort being acted on—especially across mixed versions, disconnected supply chains, partial upgrades and operator escape hatches—without turning local operator power, AI assistance or provider administration into canonical authority?

## Research-by-exception scope
Revisit 5 already established typed installation/update/recovery identities, path-relative upgrade compatibility, qualified air-gap material closure, reconcile-before-retry, diagnostic custody and residual-realization disposition. This revisit therefore concentrates on unresolved cycle-7 concerns: applicability-scoped operational claims, mixed support vectors, cohort-specific effective state, supply-chain closure beyond image possession, evidence replay horizons, draining residual operational dependencies, developer escape hatches, and non-amplifying delegated Station administration.

## Representatives and evidence/source ledger
1. **Kubernetes kubeadm upgrade** — https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/ — staged control-plane/worker upgrade, health/readiness checks, version-skew constraints, idempotent recovery after interrupted upgrades, and explicit distinction between upgrade and cluster reconfiguration.
2. **K3s air-gap install/upgrade** — https://docs.k3s.io/installation/airgap — version-matched binary/images, multiple local image realization strategies, conditional-import cache behavior, private/embedded registries and additional controller images required for automated air-gapped upgrades.
3. **GitLab Self-Managed upgrade paths** — https://docs.gitlab.com/update/upgrade_paths/ — required upgrade stops and background-migration completion make supportability path- and population-relative rather than endpoint-version-only.
4. **Red Hat OpenShift disconnected environments** — https://docs.redhat.com/en/documentation/openshift_container_platform/4.20/html/disconnected_environments/updating-a-cluster-in-a-disconnected-environment and 4.21 disconnected-environment guidance — disconnected updates depend on mirrored release/catalog content and graph metadata; release signatures are an independent requirement whose omission can block verified upgrades.
5. **HashiCorp Nomad upgrade** — https://developer.hashicorp.com/nomad/docs/upgrade — incremental mixed-version operation has bounded compatibility; new features may not work until all nodes are upgraded; downgrade requires drainage/reprovisioning; health and Raft replication are verified between stages.
6. **HashiCorp Nomad snapshot/key management** — https://developer.hashicorp.com/nomad/api-docs/operator/snapshot and https://developer.hashicorp.com/nomad/docs/manage/key-management — snapshot integrity and restore authority are explicit, but recovery completeness can depend on separately retained key material and the version that produced the snapshot.
7. Prior G2 AI, Lifecycle, Security/Recovery, Artifact/Provenance, Deployment, Secrets and Provider research remains cross-capability evidence; product-specific mechanics are not promoted as universal primitives.

## Applicability-scoped source of truth and typed identity
Do not alias `DistributionRevision`, `InstallationId`, `EnvironmentId`, `StationId`, `OperatorIntentId`, `ReconciliationAttemptId`, `ObservedEffectiveStateId`, `SupportProfileRevision`, `SupportBundleId`, `EvidenceSetId`, `ProviderRealizationId` or `ConsumerCohortId`.

Operational claims are applicability scoped. `SUPPORTED`, `UPGRADED`, `AIRGAP_READY`, `RECOVERABLE` or `HEALTHY` are not scalar installation properties; each claim must bind at least installation/environment/Station, distribution and effective component revisions, configuration/data/schema/trust revisions, provider realizations, consumer cohort, support profile and evidence horizon. Desired fleet intent and local observed state remain separate fact domains.

## Lifecycle and versioning
Refined lifecycle:

`operator-intent -> qualified-plan -> admitted -> staged -> attempted -> observed -> effective-for-cohort -> semantically-validated -> support-qualified -> residuals-drained/dispositioned`.

For disconnected environments add `closure-assembled -> provenance/trust-verified -> transferred -> locally-available -> consumer-resolvable`. Presence in a mirror or image directory is not the same as effective resolvability by every node/runtime/provider. Upgrade and rollback eligibility must be recalculated against the observed effective state and support profile at action time.

## Failure semantics and ambiguous actuation
Kubernetes documents an idempotent retry path for its own kubeadm upgrade workflow, but that mechanism-specific property cannot be generalized to arbitrary package, migration, registry, credential or provider actions. Universal semantics remain: ambiguous actuation creates `OUTCOME_UNKNOWN`; observe/reconcile the exact target before retry unless the provider contract proves idempotency for that action and revision.

A supportability failure can be partial even when the main process is healthy: missing mirrored signatures, stale image caches, unfinished background migrations, obsolete clients, absent recovery keys or unsupported mixed-version features can make the installation operational but not qualified for a requested action.

## Mixed support vector
Self-hosting portability is a vector, not a binary property. At minimum qualify independently:
- distribution/package availability;
- architecture/OS/runtime compatibility;
- configuration/schema/data compatibility;
- upgrade-path and rollback/recovery eligibility;
- registry/mirror/trust/provenance closure;
- mixed-version control-plane/worker/client support;
- backup/restore/key-material compatibility;
- diagnostic/support evidence availability;
- disconnected/local-operation horizon;
- provider/feature support and residual-cohort state.

A single unsupported axis must not be hidden by an overall `healthy` or `installed` flag.

## Residual cohort drainage
Provider or version substitution is not closed at package replacement. Residual cohorts include old server/client processes, node images, package/image caches, config fragments, credentials/certificates, update controllers, sessions, subscriptions, recovery material and consumers that still resolve the former provider/version. Nomad explicitly shows that new features may remain unusable until all relevant agents are upgraded; K3s conditional image import shows cached material can diverge from actual image availability. Completion therefore needs typed drainage or a bounded exception for each relevant cohort.

## Air-gap and supply-chain closure
Disconnected closure is a proof set, not a tarball. OpenShift evidence shows image payload and release signature availability are separable; K3s automated air-gap upgrades additionally require controller and kubectl images. A qualified closure must therefore include the required content graph, provenance/signature/trust material, compatibility metadata, runtime/package dependencies, configuration prerequisites and recovery material for the exact requested action.

Closure also has a horizon: local evidence may remain sufficient for continued bounded operation while becoming insufficient for a new privileged mutation after policy, trust, support or distribution revisions advance elsewhere. Reconnection must requalify before privileged mutation; it must not rewrite historically valid local facts.

## Diagnostics, support bundles and evidence replay horizon
Support bundles are privileged derived evidence. Collection must bind collector, scope, time window, installation/environment revisions, redaction policy, included manifests/hashes and recipient authority. Historical evidence validity is distinct from present replayability: a past bundle may validly prove what was observed then while no longer being sufficient to re-run or requalify a current support claim because logs, keys, mirrored artifacts or provider metadata aged out.

## Developer escape hatches versus governed contracts
Shell access, custom package injection, force flags, manual config edits and provider-native administration can be necessary for self-hosting, but they are escape mechanisms rather than semantic authority. An escape hatch must either:
1. operate inside a declared bounded contract and emit evidence; or
2. mark affected claims `UNQUALIFIED/DRIFTED` until reconciliation re-establishes conformance.

A successful manual repair cannot silently rewrite canonical desired state or promote provider-admin authority into Enterprise/Station semantic ownership.

## Governance and authority
Preserve `Enterprise -> Station -> Role -> Person`. Separate `Observe`, `Diagnose`, `Stage`, `Apply`, `Rollback`, `Restore`, `Reprotect`, `SupportBundleCollect`, `SupportBundleDisclose`, `TrustAdmin`, `ProviderAdmin`, `FleetTarget` and canonical configuration/domain authority. Station delegation may administer only its bounded installation/provider realization. AI/AGWS may propose, explain, prepare evidence or materialize an already-authorized operation; neither may mint install/update/recovery/provider-admin/canonical-change authority.

Approval freshness from AI research applies here only as a generic boundary: an approved operator plan is exact-candidate/revision scoped and must be requalified after material target, effective-state, authority, policy, provider, trust or support-profile change. AI retains ownership of agent-specific approval/replay semantics.

## Extensibility and provider boundaries
Package manager, image registry/mirror, orchestrator, runtime, backup engine, diagnostic collector and support transport are provider boundaries. Universal contracts are typed identities, applicability, observed/effective state, compatibility/support vectors, action-specific idempotency evidence, qualified closure, drainage, evidence horizons and authority attenuation—not vendor commands or archive formats.

## Product-specific mechanism vs universal primitive
- kubeadm's idempotent retry is product-specific; `observe/reconcile-before-retry unless idempotency is proved` is universal.
- K3s conditional image import and embedded registry mirror are mechanisms; `consumer-resolvable local material closure` is universal.
- GitLab required stops are mechanism-specific instances of path/population-relative supportability.
- OpenShift oc-mirror and release signatures are mechanisms/evidence types; `content + provenance/trust closure` is universal.
- Nomad's two-point-release compatibility and Raft snapshot format are provider rules; `mixed support vector` and `recovery compatibility evidence` are universal.

## Convergent and divergent patterns
**Convergent:** staged mutation; observed health between stages; bounded version skew; prerequisite material/trust; explicit recovery authority; residual-node/client handling; separate semantic validation after mutation.

**Divergent:** downgrade support, package/image distribution, cache semantics, recovery material, mixed-version feature behavior, air-gap metadata, idempotent retry guarantees and support windows. Therefore SB should negotiate support vectors rather than imply one universal self-hosting profile.

## Subcapabilities
1. Applicability-scoped operational/support qualification.
2. Distribution/install/environment/effective-state identity and inventory.
3. Desired-versus-observed reconciliation attempts.
4. Mixed deployment/package/runtime/provider support vectors.
5. Qualified disconnected supply-chain/update closure.
6. Residual operational cohort drainage.
7. Evidence-retention/replay horizon and diagnostics custody.
8. Governed escape-hatch/drift reconciliation.
9. Delegated Station operations with non-amplifying provider administration.

## SB comparison
No fresh-main product claim is made. Product truth remains deferred to `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`; research artifacts are evidence/hypotheses, not proof that current SB implements these contracts.

## Reconciliation hypotheses
- **GENERALIZE** applicability-scoped operational/support qualification and typed effective-state identity.
- **HARDEN** upgrade/restore/provider actions with observed-base fencing and action-specific idempotency evidence.
- **GENERALIZE** mixed support vectors and residual operational cohort drainage.
- **GENERALIZE** disconnected content+trust+provenance closure with an evidence horizon.
- **PROVIDERIZE** package/image transport, runtime, backup, diagnostic and support transports.
- **HARDEN** escape hatches by explicit drift/unqualification and reconciliation.
- **INTEGRATE** approval freshness only at the generic operation-plan boundary; keep AI-specific semantics in AI-native capability.
- **DO_NOT_BUILD** a universal downgrade guarantee, universal snapshot format or assumption that provider-admin/root access equals semantic authority.

## Repository-validation questions
- Does fresh `main` represent operational qualification as applicability-scoped evidence or only scalar deployment/health status?
- Are desired intent, reconciliation attempt and observed/effective local state separately identifiable?
- Can supportability express independent runtime/package/provider/version/recovery axes?
- Can a disconnected Station prove content, signature/trust and consumer resolvability for an update?
- Are residual processes/nodes/caches/config/credentials/consumers enumerated before cutover closure?
- Does a manual/force escape hatch mark affected guarantees drifted/unqualified until reconciliation?
- Are support bundles redaction/custody/evidence horizons represented without exposing secret values?
- Is delegated Station administration bounded away from provider-admin and canonical semantic authority?

## Symbiotic Proof / architecture-proof backfill obligations
1. **Applicability positive:** a support claim proves exact Station/environment/distribution/effective revisions and consumer cohort.
2. **Applicability negative:** a healthy installation with an unsupported runtime/provider axis cannot be promoted `SUPPORTED` for the requested action.
3. **Observed-state:** desired fleet version does not count an offline/stale node as effectively upgraded.
4. **Ambiguous actuation:** lost acknowledgement produces observation/reconciliation before retry unless the exact action contract proves idempotency.
5. **Air-gap provenance:** mirrored payload without required signature/trust material fails qualification.
6. **Consumer resolvability:** locally present image/package that a node/runtime cannot resolve fails closure.
7. **Mixed support:** feature enablement is rejected while relevant server/client cohort remains outside the provider support window.
8. **Drainage:** provider/version cutover remains partial while old process/node/cache/config/credential/consumer cohorts are live or undispositioned.
9. **Recovery compatibility:** snapshot/backup evidence proves required version and separately retained key material before restore admission.
10. **Evidence horizon:** historical support evidence remains historical fact but cannot authorize present mutation after required evidence/trust expires.
11. **Escape hatch:** provider-native force/manual repair marks affected claims drifted until reconciliation proves current conformance.
12. **Offline/reconnect:** disconnected Station continues bounded operation inside qualified closure; privileged post-reconnect mutation requires current requalification.
13. **Authority:** Station operator can act only within delegated installation capability; provider root does not grant canonical Enterprise/domain authority.
14. **AI/AGWS:** assistant can prepare an operation and evidence but cannot mint approval, provider-admin, recovery or canonical-change authority.

## Stable findings
- **G2-FINDING-DOESH-47** — Install/operate/upgrade/recovery/supportability are applicability-scoped claims over Station/environment, distribution/effective revisions, configuration/data/schema/trust, provider realization, consumer cohort, support profile and evidence horizon; scalar `installed/healthy/supported` flags are insufficient.
- **G2-FINDING-DOESH-48** — Distribution, installation, operator intent, reconciliation attempt and observed effective state are distinct typed facts. Desired fleet state cannot substitute for observed local realization, especially for offline or partially upgraded members.
- **G2-FINDING-DOESH-49** — Self-hosting portability is a mixed support vector across package/runtime/architecture/config/schema/data/upgrade/recovery/trust/provider/diagnostic axes; a nominally supported product version does not prove a requested operation is supported for a mixed population.
- **G2-FINDING-DOESH-50** — Disconnected update closure requires content plus provenance/signature/trust, compatibility metadata, dependencies and consumer resolvability for the exact action. Mirror/tarball presence alone is insufficient.
- **G2-FINDING-DOESH-51** — Provider/version substitution closes only after residual process/node/cache/config/credential/controller/session/consumer cohorts are drained or explicitly dispositioned; package replacement alone is not convergence.
- **G2-FINDING-DOESH-52** — Operational/support evidence has a replay/retention horizon independent of historical validity. Evidence loss or trust/support evolution can make present requalification inconclusive without rewriting a previously valid observation.
- **G2-FINDING-DOESH-53** — Developer/operator escape hatches are not semantic authority. Manual/force/provider-native mutation outside governed contracts must emit bounded evidence or mark affected guarantees drifted/unqualified until reconciliation.
- **G2-FINDING-DOESH-54** — Delegated self-hosting remains non-amplifying across `Enterprise -> Station -> Role -> Person`; provider-admin/root, AI or AGWS context cannot mint canonical configuration/domain, update, recovery or broader platform authority, and material target/revision changes invalidate stale operational approval.

## Candidate register additions
- `G2-CAPABILITY-CANDIDATE-DOESH-APPLICABILITY-SCOPED-OPERATIONAL-SUPPORT-QUALIFICATION` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-DOESH-MIXED-SELFHOSTING-SUPPORT-VECTOR` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-DOESH-DISCONNECTED-SUPPLYCHAIN-EVIDENCE-HORIZON` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.
- `G2-CAPABILITY-CANDIDATE-DOESH-RESIDUAL-OPERATIONAL-COHORT-DRAINAGE` — CROSS_CUTTING / CONSOLIDATION_CANDIDATE.

No candidate is promoted in this revisit. Adaptive Governed Work Surfaces remains **CORE / PROMOTED_TO_ACTIVE_RESEARCH_TAXONOMY / NOT SATURATED**, distinct from generic UI, with `Enterprise -> Station -> Role -> Person` and AI-only materialization without authority amplification.

## Saturation assessment
**NOT SATURATED.** Eight material architectural findings were produced, so `consecutive_no_material_finding = 0`. Principal representatives are sufficiently deep for this pass, but saturation cannot be claimed while material external architecture continues to emerge and repository-validation obligations remain outstanding.

## Value / risk / priority / next question
**Value:** makes generated systems supportable and genuinely customer-operable across connected, self-hosted and disconnected topologies without hiding mixed-version/provider risk. **Risk:** scalar health/support claims, incomplete mirrors, stale residual cohorts or root/provider escape hatches can create unsafe mutation and false convergence. **Priority:** HIGH. **Next question:** can Architecture Reconciliation treat research evidence, product truth, drift, technical ownership and semantic authority as separately revision-qualified facts with executable contradiction/conformance proofs, so cycle 7 can close without collapsing research into documentation authority?
