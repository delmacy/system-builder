# Generation 2 — Developer / Operator Experience / Self-hosting — Full Pass 7 Revisit

Status: ELIGIBLE NO-NEW-MATERIAL REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Full pass: 7
Disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`

## Scope and authority

This revisit follows `RESEARCH_PIPELINE_STATE.json`, `POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`, `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`, `ADVERSARIAL_SATURATION_STATE.json`, the prior Full-Pass-6 Developer/Operator revisit, `OPERABILITY_ELICITATION_LENS_RESEARCH.md`, `ELICITATION_SYSTEM_UNDERSTANDING_METHODOLOGY_RESEARCH.md`, and the standing edge/conflict inventory.

Research only. No product code, Work Package, TASK, Construction, remediation, target-architecture materialization, or preventive guard is authorized.

Preserved distinctions:

- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `feature completeness != production readiness != runtime health != business convergence`;
- `install success != operable system != recoverable system != supportable system`;
- `backup exists != restore eligible != restore executed != restored service != business convergence`;
- `runbook exists != runbook current != runbook applicable to target revision != action authorized`;
- `operator-visible health != runtime/effect truth`;
- `semantic topology != build topology != deployment topology != runtime truth`;
- `local journal/evidence != exported telemetry != Fleet aggregate != control authority`;
- `external provider state != canonical authority != physical truth`;
- `observed low utilization != current queue health != sustainable capacity != headroom != transient burst tolerance != stability margin`;
- `multidimensional facts != scalar score`;
- historical observed fact != forecast/simulation/counterfactual;
- correlation/Fleet co-movement != causal proof != authority;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` remain distinct;
- autonomous client correctness must not depend on SB/Observe/Fleet availability.

## Full-Pass-7 techniques

This revisit intentionally differs from Full Pass 6.

1. **Operability-evidence closure mutation** — remove or stale one readiness dimension while leaving feature/install checks green.
2. **Upgrade compatibility-matrix permutation** — vary client/tool/control/dependency versions and ordering while preserving individually supported components.
3. **Restore eligibility decomposition** — independently vary backup bytes, software version, secrets/config, object/external stores, topology and post-restore proof.
4. **Offline dependency closure challenge** — remove internet/cloud reachability and test whether package/image/schema/trust/provider dependencies remain explicit and transportable.
5. **Runbook provenance/currentness mutation** — replay a once-valid human/AI procedure against a newer build/provider/policy topology.
6. **Support-bundle epistemic boundary** — distinguish diagnostic capture completeness, freshness, privacy minimization and semantic sufficiency.
7. **Readiness-coverage false-complete challenge** — mark one operational dimension `NA`, `RESOLVED` or omitted without evidence and test whether aggregate publish/readiness remains green.
8. **Operator ownership substitution** — preserve alerts and tooling but remove an action owner/escalation path or create conflicting human responsibility.
9. **Physical/provider integration-plane boundary challenge** — expose external-system diagnostics without silently granting remote control or treating provider state as physical truth.
10. **Queue/capacity support-plane pressure** — stress upgrade/download/restore/reindex/reconcile/support queues against autonomous workload without using a scalar health shortcut.
11. **Causal non-strengthening** — vary operator change and Fleet co-movement while withholding confounder/intervention evidence.
12. **Sixteen-family conflict screen** — structural, state, semantic ownership, rule/formula, temporal, resource, authority/SoD, policy, data, provider, version/coexistence, recovery, human procedure, cross-process, objective and AI/low-code.

## Fresh external evidence differential

### Version skew is a qualified compatibility relation, not `latest wins`

Kubernetes' current Version Skew Policy defines different supported skew envelopes for API server, kubelet, kube-proxy, control-plane components and clients, and derives upgrade ordering from those relations. Portable consequence: operator tooling must qualify a concrete revision vector and dependency topology; a component being individually supported does not prove the composed upgrade path is supported.

Source: Kubernetes, `Version Skew Policy`, https://kubernetes.io/releases/version-skew-policy/ (accessed 2026-09-06).

### Backup existence is weaker than restore eligibility and convergence

GitLab Self-Managed restore documentation requires a working destination installation and exact source version/edition compatibility, warns that some externally stored data/configuration requires separate handling, and recommends testing the complete restore process before production use. Its rollback guidance also requires version-qualified database/full backups because schema changes must be reverted together with software. Portable consequence: backup age/size/success cannot be promoted to recovery proof without version/config/external-store eligibility and post-restore convergence evidence.

Sources: GitLab, `Restore GitLab`, https://docs.gitlab.com/administration/backup_restore/restore_gitlab/; `Back up GitLab`, https://docs.gitlab.com/administration/backup_restore/backup_gitlab/; `Roll back to earlier GitLab versions`, https://docs.gitlab.com/update/package/downgrade/ (accessed 2026-09-06).

Kubernetes/etcd operational guidance likewise treats snapshots as recovery inputs and separates snapshot creation/status/restore operations; restore validity remains topology/version/procedure qualified. Source: Kubernetes, `Operating etcd clusters for Kubernetes`, https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/ and etcd 3.6 release guidance (accessed 2026-09-06).

### Offline/self-hosted operation requires dependency closure

GitLab documents a fully offline installation path that requires transferring the application package and all required dependencies from a connected machine, and its offline security/agent guidance similarly requires internal availability of otherwise external artifacts. Portable consequence: `self-hosted` does not imply `air-gap operable`; elicitation must discover package/image/model/schema/trust/provider dependencies, update channels, ownership and evidence for disconnected operation.

Sources: GitLab, `Install an offline GitLab Self-Managed instance`, https://docs.gitlab.com/topics/offline/quick_start_guide/; `Offline environments`, https://docs.gitlab.com/user/application_security/offline_deployments/ (accessed 2026-09-06).

### Diagnostic surfaces are qualified evidence, not semantic truth

OpenTelemetry Collector troubleshooting exposes local diagnostics such as internal telemetry, pprof and zPages; zPages can expose information not otherwise emitted by the Collector. Portable consequence: support bundles and diagnostic endpoints are evidence sources with their own scope, privacy/access, freshness and completeness semantics. Their presence does not prove business convergence or Fleet completeness.

Source: OpenTelemetry, `Troubleshooting`, https://opentelemetry.io/docs/collector/troubleshooting/ (accessed 2026-09-06).

## Candidate findings — duplicate-screened

### Candidate A — installation/publish readiness is green while one Production Readiness dimension is unsupported

**Activation conditions:** bootstrap/install and functional smoke checks pass, while `OWNERSHIP`, `RECOVERY`, `CURRENTNESS`, `RECONCILIATION`, `CHANGE_SAFETY`, `CAPACITY`, `SECURITY`, `COST` or `DOCUMENTATION` is omitted, stale, unsupported, or marked `NA` without rationale.

**Incompatible claims/actions/states:** feature/install success versus a stronger operability/readiness claim.

**Detection candidates:** dimensioned Production Readiness Coverage; evidence/currentness and `NA` rationale; required owner/source; downstream artifact blockers; revision-aware invalidation.

**Owners:** Developer/Operator Experience + Operability Elicitation + affected semantic/operational owner.

**Assessment:** severity MEDIUM→HIGH; confidence strongly supported; detectability design/pre-production; blast radius deployment/system; reversibility easy before release, migration/recovery after; time-to-harm delayed; misuse accidental/plausible; evidence currentness variable; false-positive risk MEDIUM because some dimensions may be legitimately `NA` with evidence.

**Duplicate-screen:** proof-claim conflation, presence semantics, evidence/currentness, ownership/responsibility and analytical-kind families. No new `G2-CONFLICT-PATTERN-*`.

**Future route:** Planning C/D/E readiness metadata/proof-boundary candidate; no remediation now.

### Candidate B — valid runbook becomes unsafe after revision/topology change

**Activation conditions:** operator/AI follows a once-valid install/upgrade/recovery procedure after build, provider, schema, policy, external-system or dependency topology changed.

**Incompatible claims/actions/states:** instruction validity at authored/tested revision versus applicability/authority at execution revision.

**Detection candidates:** runbook revision/provenance; target revision vector; effective intervals; precondition requalification; authority and rollback eligibility; residual cohort detection.

**Owners:** Developer/Operator Experience + Lifecycle + Provider/Binding + relevant authority/semantic owner.

**Assessment:** severity HIGH; confidence strongly supported; detectability pre-execution/runtime; blast radius deployment/system/external dependency; reversibility bounded to potentially migration-required; time-to-harm immediate; misuse accidental plausible; evidence currentness stale by construction; false-positive risk MEDIUM because intentionally broad procedures can remain compatible if qualified.

**Duplicate-screen:** version/coexistence, human-procedure conflict, compatibility-direction, currentness and authority non-amplification families. No new pattern.

**Future route:** revision-qualified procedure/product-proof input to Planning C/E.

### Candidate C — backup marked healthy although restore is not eligible or complete

**Activation conditions:** backup job succeeded but target version/edition, secrets/config, object/external stores, topology, restore capacity or post-restore convergence evidence is absent/incompatible.

**Incompatible claims/actions/states:** stored backup artifact versus recoverability/business-convergence claim.

**Detection candidates:** restore compatibility matrix; backup manifest/coverage; external-store/config/secrets dependencies; periodic restore proof; post-restore business invariants and reconciliation.

**Owners:** Developer/Operator Experience + Security/Recovery + Storage/Data + relevant provider owners.

**Assessment:** severity HIGH/CRITICAL; confidence strongly supported; detectability pre-disaster if tested, otherwise post-failure; blast radius system/client; reversibility potentially irreversible after primary loss; time-to-harm latent; misuse accidental likely; evidence currentness may be stale; false-positive risk LOW-MEDIUM when restore obligations are explicit.

**Duplicate-screen:** recovery false-safety, proof-claim conflation, provider/external coverage, compatibility and evidence-currentness families. No new pattern.

**Future route:** executable restore/recovery proof obligation for Planning E; no implementation now.

### Candidate D — `self-hosted` is interpreted as `offline/air-gap operable`

**Activation conditions:** installation can run on client infrastructure but depends on external package/image/license/schema/trust/model/provider endpoints for install, upgrade, security data or recovery; elicitation never asked for disconnected-operation closure.

**Incompatible claims/actions/states:** deployment ownership/location claim versus operational dependency-closure claim.

**Detection candidates:** dependency inventory with source/currentness/license/trust/update path; offline materialization/recovery drill; unsupported external dependency classification; degraded-mode expectations.

**Owners:** Developer/Operator Experience + Build/Artifact + Provider/Binding + Security/Trust where applicable.

**Assessment:** severity MEDIUM→HIGH; confidence strongly supported; detectability design/install; blast radius deployment/site; reversibility bounded by acquiring/mirroring dependencies; time-to-harm immediate at install/update/outage; misuse accidental plausible; currentness revision-dependent; false-positive risk LOW if offline is explicitly out-of-scope.

**Duplicate-screen:** provider lock-in/dependency closure, environment portability, presence/negative-space, currentness and recovery families. No new pattern.

**Future route:** elicitation question/proof domain; no architectural materialization.

### Candidate E — operator diagnostics are complete enough to mislead but incomplete for the claim

**Activation conditions:** support bundle/diagnostic endpoint captures healthy process/resource evidence but omits downstream queues, external provider effects, stale currentness, tenant/site context or privacy-redacted causal dimensions needed for the question.

**Incompatible claims/actions/states:** diagnostic capture success versus semantic/effect/completeness claim.

**Detection candidates:** evidence-profile declaration; required dimensions/units/source/currentness; explicit missing/redacted fields; `PARTIAL/UNKNOWN`; local journal cross-check.

**Owners:** Developer/Operator Experience + Observability + Privacy + affected domain owner.

**Assessment:** severity MEDIUM→HIGH; confidence strongly supported; detectability analysis/audit; blast radius diagnosis→operational decision; reversibility easy before action; time-to-harm delayed; misuse likely accidental; evidence currentness current but semantically incomplete possible; false-positive risk MEDIUM because bundles are intentionally scoped.

**Duplicate-screen:** source-population completeness, analytical-kind, proof-claim conflation, currentness and cumulative-privacy families. No new pattern.

**Future route:** support-evidence contract and privacy-aware proof candidate for Planning C/E.

### Candidate F — maintenance/restore queues consume headroom needed for autonomous workload

**Activation conditions:** upgrade download, migration, backup/restore, reindex, support capture or reconciliation introduces bursty I/O/CPU/network/provider demand while business workload remains active.

**Incompatible claims/actions/states:** locally valid maintenance objective versus sustainable service capacity/stability margin.

**Detection candidates:** dimensioned `ResourcePressureVector`; workload-class queues/backlog age; maintenance admission window; provider quotas; before/during/after distributions; abort/recovery evidence.

**Owners:** Developer/Operator Experience + Runtime/Capacity + Storage/Data + Provider/Binding.

**Assessment:** severity HIGH; confidence strongly supported; detectability pre-execution/runtime; blast radius deployment/site; reversibility bounded; time-to-harm immediate/burst; misuse accidental plausible; evidence currentness must be short-window; false-positive risk MEDIUM because spare capacity may be intentionally reserved.

**Duplicate-screen:** resource/capacity, objective conflict, queue amplification, provider quota and temporal/currentness families. No new pattern.

**Future route:** workload-admission/capacity proof domain for Planning C/E.

### Candidate G — alert exists but has no actionable owner or contradictory human owners

**Activation conditions:** monitoring identifies a failure/degradation but no owner/on-call/escalation exists, or multiple procedures assign incompatible responsibility/actions.

**Incompatible claims/actions/states:** observable/actionable condition versus missing/conflicting responsibility and authority.

**Detection candidates:** alert→owner→runbook→authority linkage; escalation graph; contradictory instruction detection; current owner availability; maintenance suppression rationale.

**Owners:** Developer/Operator Experience + Governance/Organization + capability owner.

**Assessment:** severity MEDIUM→HIGH; confidence strongly supported; detectability design/runtime; blast radius incident/workflow/system; reversibility easy before harmful manual action; time-to-harm delayed; misuse accidental likely; evidence currentness organizationally volatile; false-positive risk MEDIUM where alerts are intentionally informational.

**Duplicate-screen:** authority/responsibility, human-procedure, ownership and evidence/currentness families. No new pattern.

**Future route:** operational ownership/escalation proof candidate; no remediation now.

### Candidate H — integration-plane visibility is mistaken for remote control authority

**Activation conditions:** operator can observe external VMS/BMS/access/PDV/device/provider state and an interface/AI guidance implies central actuation or treats provider state as canonical/physical truth.

**Incompatible claims/actions/states:** read/reconciliation evidence versus mutation/control authority; external state versus canonical authority/physical truth.

**Detection candidates:** explicit plane/action classification; client/site/provider/resource context; authority/approval; source/currentness/uncertainty; unsupported actuation denied/not inferred.

**Owners:** Developer/Operator Experience + Integration/Provider + Authorization/Governance + external specialized system owner.

**Assessment:** severity HIGH/CRITICAL for physical/security actuation; confidence strongly supported; detectability design/pre-execution; blast radius site/external parties; reversibility potentially irreversible; time-to-harm immediate; misuse accidental/adversarial plausible; evidence currentness variable; false-positive risk LOW if control boundary is explicit.

**Duplicate-screen:** authority amplification, semantic ownership/provider-state conflation, cross-site/tenant boundary and physical-truth/currentness families. No new pattern.

**Future route:** preserve explicit no-central-control boundary for Planning C/D/E.

## Operability Elicitation Lens — Developer/Operator specialization

For self-hosted/operator-facing capabilities, the portable elicitation set should ask, when applicable:

- How do we know installation succeeded end-to-end rather than only that processes started?
- Which build/release/deployment/config/provider revision vector is the runbook valid for?
- Which upgrades/skews are supported, and what order/preconditions are required?
- What maintenance windows, capacity reservations and rollback/abort evidence are required?
- What can remain `PARTIAL` or `UNKNOWN`, for how long, and who reconciles it?
- Which local diagnostics/journal evidence exists when Fleet/Observe is unavailable?
- What support bundle is required, what may be missing/redacted, who may access it, and how current must it be?
- What external packages/images/schemas/licenses/trust roots/providers are required for offline install, upgrade and recovery?
- Does a backup include all required data/config/secrets/external stores, and what exact restore compatibility relation applies?
- How often is the complete restore/recovery path proven, and what evidence demonstrates post-restore business convergence?
- Which alerts are actionable, who owns them, which runbook applies, and what escalation occurs if the owner is unavailable?
- Which operator actions are observation, control or configuration change, and what authority/approval/site/client context applies?
- Which external-system diagnostics remain integration-plane only and must not be promoted to remote actuation authority?
- Which Production Readiness Coverage dimension is `UNTOUCHED/PARTIAL/RESOLVED/CONFLICTED/BLOCKED/NA`, with what evidence and revision?

This specialization does not create a new capability. It extends the cross-cutting Operability Elicitation hypothesis and remains subject to Planning C/D/E disposition.

## Autonomous Builds × Fleet / queue-capacity / temporal-causal carry-forward

Candidate operational lineage remains:

`CanonicalCapabilityRef -> CapabilityUse -> BuildRevision/Release -> RuntimeRealization -> Deployment -> NodeInvocation/Attempt`.

Operator/support evidence must preserve enough lineage to avoid comparing or diagnosing incompatible builds/providers/instrumentation profiles as one homogeneous Fleet. Local-first evidence remains the autonomy boundary: exporter/Fleet failure is an observability gap, never a workflow prerequisite.

Queue/capacity analysis must preserve distributions, burst windows, queue age, provider quota, maintenance workload and uncertainty. Little's Law or M/M/1-like models remain conditional analytical profiles, not runtime truth. Maintenance/recovery traffic can alter the queueing regime itself.

Historical observed facts, forecasts, simulations and counterfactuals remain distinct. An operator action followed by latency/error/cost movement is not a causal conclusion without an explicit causal model, intervention, confounders, compatible cohorts, missingness/currentness and uncertainty. Even valid causal analysis does not grant operational authority.

## Conflict-classification completeness

All sixteen conflict families were explicitly challenged. The eight strongest candidates duplicate-screen into the existing 124 reusable ConflictPatterns. No distinct 125th pattern was justified.

No `ConflictInstance` is claimed. No signal is promoted to `ConfirmedConflict`. No remediation or preventive invariant is materialized.

## Saturation disposition

- new material edge findings: **0**;
- new cross-capability findings: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances: **0**;
- preventive invariants materialized: **0**;
- existing material inventory: **284 edges + 124 ConflictPatterns = 408**;
- HIGH/CRITICAL without owner/proof/detection route: **0**;
- Developer / Operator Experience / Self-hosting local streak: remains **2 capped**; do not inflate;
- all 12 mandatory cluster streaks remain satisfied/capped; this capability revisit does not create a new mandatory cluster.

Full Pass 7 may advance to the next canonical capability. Planning C remains blocked until the entire adversarial phase is `CLOSED / SATURATED / PASS`.

## Planning C / D / E carry-forward

Research-only candidates:

- revision-qualified bootstrap/install/upgrade/runbook semantics;
- Production Readiness Coverage separate from feature completeness and installation success;
- operator/support/provider ownership and escalation metadata;
- offline/self-hosted dependency-closure elicitation;
- restore eligibility/coverage/currentness and executable post-restore convergence proofs;
- support-bundle evidence profile/currentness/privacy semantics;
- maintenance workload admission and multidimensional resource/capacity proof domains;
- explicit `observe != control != change` authority boundary;
- local-first diagnostics/evidence for autonomous builds;
- physical/peripheral external systems remain integration-observability/reconciliation plane by default;
- causal-analysis boundary remains analysis-only and non-authoritative;
- readiness/runbook evidence invalidation after material revision/topology/provider change.

No architecture is selected by this artifact.