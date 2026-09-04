# Generation 2 — Data / Schema / Migrations Adversarial Edge-Case Register

Status: FULL PASS 1 — MATERIAL FINDINGS / LOCAL STREAK 0 / CLUSTER STREAK 0
Capability: Data / Schema / Migrations
Paired cluster: Data/Schema × Privacy × Storage × Lifecycle
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`

Research posture: catalogue/classify/proof obligations only. No target architecture, implementation task, Work Package or remediation is authorized here. `ConflictPattern != ConflictInstance`; `Signal != ConfirmedConflict`; `StoredFact != DerivedValue`.

## Evidence anchors

- The adversarial framework requires explicit handling of null/missing/malformed inputs, concurrent mutation, partial migration, residual cohorts, rollback false safety and `UNKNOWN → reconcile-before-retry`.
- The processual/semantic conflict directive treats data consistency, policy precedence, version coexistence and competing semantic ownership as composition risks even when each local rule is individually valid.
- PostgreSQL documents that concurrent serializable transactions can fail with serialization errors and require transaction-level retry; lower isolation can expose distinct snapshots. This supports explicit concurrency/conflict semantics rather than assuming local validation remains current at commit.
- GDPR Article 17 establishes erasure rights while Article 17(3) preserves processing where required by legal obligation/public-interest grounds. This is direct evidence that deletion and retention claims can both be locally valid and require policy/authority resolution rather than arbitrary rule ordering.
- Amazon S3 replication documentation shows deletion semantics can diverge across replicas: delete-marker replication is configurable, lifecycle-created delete markers are not replicated, and deleting a specific source version does not delete the destination replica. Replication therefore cannot be treated as proof that canonical deletion converged across storage realizations.

Sources:
- https://www.postgresql.org/docs/14/transaction-iso.html
- https://eur-lex.europa.eu/legal-content/EN-PT/TXT/?uri=CELEX%3A32016R0679
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-status.html

## Local material scenarios

### G2-EDGE-DATA-001 — stale read drives incompatible canonical write
- Preconditions / activation: two actors/processes read the same canonical subject; one commits a mutation before the other commits based on stale premises.
- Incompatible claims/actions/states: each mutation is locally valid against its read snapshot but the second write violates the first write's resulting invariant or silently overwrites it.
- Expected safe behavior: mutation admission is qualified against current revision/preconditions; stale/conflicting writes become explicit rejected/conflict outcomes or require owner-defined merge semantics.
- Forbidden behavior: last-writer-wins becomes implicit semantic precedence; successful database write is treated as proof that domain invariants remained valid.
- Owner(s): Data semantic owner + owning domain/process; storage/database realization only supplies concurrency evidence.
- Effect/failure disposition: known stale conflict → rejected/conflict; uncertain external mutation → `UNKNOWN` until reconciled.
- Evidence/currentness: canonical subject revision, mutation base revision/preconditions, transaction/commit evidence and owner invariant revision.
- Recovery/reconciliation: reload authoritative state, classify competing changes, merge/retry only under current owner semantics.
- Blast radius: record → aggregate/process. Severity: CRITICAL. Misuse likelihood: likely under concurrency. Detectability: pre-commit/runtime.
- Reversibility: merge/migration dependent. Time-to-harm: immediate.
- Proof obligation: `DATA-ADV-PROOF-001` — concurrent locally valid writes cannot silently create an invalid canonical postcondition.

### G2-EDGE-DATA-002 — duplicate/imported identity collision creates two canonical subjects for one real entity
- Preconditions / activation: brownfield import, federation, bulk load or provider mapping supplies duplicate identifiers or semantically equivalent records under different source identities.
- Incompatible claims/actions/states: both imported records are individually well-formed but claim canonical identity for the same real-world subject, or one source identifier is reused for different semantic subjects.
- Expected safe behavior: provider/source IDs remain non-canonical evidence; identity adoption/dedup requires semantic-owner evidence and preserves source lineage.
- Forbidden behavior: provider-native ID uniqueness is promoted to universal identity; heuristic merge destroys distinct subjects without evidence.
- Owner(s): Data/master/reference owner + applicable domain identity owner; Integration maps source evidence.
- Effect/failure disposition: suspected collision → `INCONCLUSIVE` pending owner resolution; confirmed collision → controlled merge/supersession lineage.
- Evidence/currentness: source lineage, canonical identity rules, matching attributes and conflict assessment.
- Recovery/reconciliation: quarantine ambiguous import, reconcile identities, preserve aliases/lineage and dependent references.
- Blast radius: record → enterprise/cross-system. Severity: HIGH–CRITICAL. Misuse likelihood: likely in brownfield migration. Detectability: import/pre-execution/audit.
- Reversibility: migration required; destructive merge may be hard. Time-to-harm: cumulative.
- Proof obligation: `DATA-ADV-PROOF-002` — source/provider identity cannot silently become canonical identity or collapse ambiguous subjects.

### G2-EDGE-DATA-003 — partial migration/backfill produces split semantic population
- Preconditions / activation: schema/representation migration is applied incrementally, fails partway, or old and new writers coexist.
- Incompatible claims/actions/states: records satisfying old and new semantics coexist while readers/processes assume one homogeneous population.
- Expected safe behavior: migration acknowledgement is distinct from convergence; cohort identity/currentness and compatibility are explicit until all residual records/writers are dispositioned.
- Forbidden behavior: schema migration command success or majority completion implies all data is semantically migrated; old writers continue untracked.
- Owner(s): Data/Schema + Lifecycle; affected process/workflow/domain owners.
- Effect/failure disposition: `PARTIAL/INCONCLUSIVE` until migration coverage and residual cohorts are proven.
- Evidence/currentness: schema revision, record cohort counts, writer/reader revision inventory, backfill checkpoints and validation evidence.
- Recovery/reconciliation: resume/reconcile bounded cohorts, fence incompatible writers, validate semantic postconditions before convergence claim.
- Blast radius: dataset/process/system. Severity: CRITICAL. Misuse likelihood: likely during large migrations. Detectability: runtime/audit.
- Reversibility: migration-dependent. Time-to-harm: latent/immediate when old/new consumers interact.
- Proof obligation: `DATA-ADV-PROOF-003` — partial migration cannot be represented as converged canonical data state.

### G2-EDGE-DATA-004 — irreversible data evolution makes code/schema rollback falsely safe
- Preconditions / activation: deployment or schema revision is rolled back after destructive transform, lossy normalization, irreversible external write, or new records use semantics unavailable to the older version.
- Incompatible claims/actions/states: historical executable/schema artifact exists, but current data no longer satisfies its assumptions.
- Expected safe behavior: rollback eligibility is qualified independently from artifact availability and includes current data/schema/provider compatibility evidence.
- Forbidden behavior: retained code/schema revision automatically means safe rollback; old reader silently truncates or misinterprets new data.
- Owner(s): Lifecycle + Data/Schema + affected semantic owners.
- Effect/failure disposition: insufficient eligibility evidence → `INCONCLUSIVE`/blocked; known incompatible rollback → not eligible.
- Evidence/currentness: transform reversibility, current schema/data revision vector, residual writer cohorts and compatibility proofs.
- Recovery/reconciliation: forward correction or explicit reverse migration only when semantically supported; preserve lineage.
- Blast radius: dataset/system. Severity: CRITICAL. Misuse likelihood: plausible operational recovery mistake. Detectability: pre-recovery.
- Reversibility: potentially irreversible. Time-to-harm: immediate after rollback.
- Proof obligation: `DATA-ADV-PROOF-004` — historical version availability cannot be confused with current rollback eligibility.

### G2-EDGE-DATA-005 — StoredFact and DerivedValue are silently interchanged
- Preconditions / activation: calculation/UI/import materializes a derived value into canonical storage without declared derivation/revision semantics, or a stored fact is recomputed as if derivable.
- Incompatible claims/actions/states: one consumer treats value as authoritative observed fact while another treats it as recomputable output.
- Expected safe behavior: provenance distinguishes stored fact, derived result, producing formula revision, snapshot/live semantics and owner authority.
- Forbidden behavior: recompute historical stored truth with current formula; promote derived UI/display value into canonical fact through low-code/AI composition.
- Owner(s): Data semantic owner + mathematical calculation subcapability + owning domain/process.
- Effect/failure disposition: provenance/ownership missing → `INCONCLUSIVE`, not silently canonical.
- Evidence/currentness: value kind, formula/result revision, input snapshot and semantic-owner declaration.
- Recovery/reconciliation: restore producing lineage; require explicit owner adoption to convert derived output into stored fact.
- Blast radius: record → financial/operational reporting. Severity: CRITICAL. Misuse likelihood: plausible/likely. Detectability: static/pre-execution/audit.
- Reversibility: correction/supersession required. Time-to-harm: delayed/cumulative.
- Proof obligation: `DATA-ADV-PROOF-005` — derived values cannot silently acquire stored-fact authority or rewrite historical truth.

### G2-EDGE-DATA-006 — large valid backfill exhausts capacity and creates unsafe mixed-state fallback
- Preconditions / activation: high-volume migration/backfill is semantically valid but exceeds database, storage, queue, replication or economic capacity.
- Incompatible claims/actions/states: migration logic is locally correct yet aggregate pressure causes lag, stale replicas, timeouts or fallback readers/writers to observe incompatible cohorts.
- Expected safe behavior: resource/capacity evidence constrains progress; degraded/partial state is explicit; readers/writers cannot silently fall back to semantically incompatible paths.
- Forbidden behavior: throughput pressure causes correctness checks to be skipped; backlog success is inferred from enqueue/acknowledgement; unbounded AI/low-code bulk action amplifies writes.
- Owner(s): Data/Schema + Deployment/Operations + Storage/Provider + FinOps where cost limits apply.
- Effect/failure disposition: `PARTIAL/INCONCLUSIVE` until backlog/replication/backfill converges.
- Evidence/currentness: cohort progress, replication lag, error/retry lineage, capacity/quota and validation samples.
- Recovery/reconciliation: throttle/pause, reconcile failed/unknown cohorts, resume from explicit checkpoints.
- Blast radius: dataset/system/provider. Severity: HIGH. Misuse likelihood: likely accidental. Detectability: pre-execution/runtime.
- Reversibility: bounded operationally but data effects may require correction. Time-to-harm: cumulative.
- Proof obligation: `DATA-ADV-PROOF-006` — valid migration scale cannot silently trade semantic convergence for throughput.

## Cross-capability material scenarios — Data/Schema × Privacy × Storage × Lifecycle

### G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-001 — erasure request conflicts with legal hold/mandatory retention
- Activation: privacy/data-subject erasure obligation applies while legal/regulatory/business-record retention or litigation hold also claims the same data.
- Incompatible claims: Privacy says erase/minimize; Governance/records lifecycle says retain/protect from deletion.
- Safe behavior: precedence/applicability is resolved by qualified policy/authority evidence; retained data is purpose/access bounded and the unresolved conflict is explicit.
- Forbidden behavior: arbitrary rule order, latest policy timestamp or lower-scope preference silently deletes legally held data or retains data after the applicable basis ended.
- Owners: Privacy/Governance + Records/Lifecycle + Data semantic owner; Storage realizes the disposition.
- Disposition: unresolved applicability → `INCONCLUSIVE`; applicable hold can constrain deletion without converting retention into unrestricted processing authority.
- Evidence/currentness: legal basis/hold scope and expiry, data subject/record scope, policy revisions, authority chain and retention evidence.
- Recovery: human/legal-owner reconciliation where needed; execute deletion/retention only after current applicability decision; retain audit lineage.
- Blast radius: record → enterprise/regulatory. Severity: CRITICAL. Misuse: plausible. False-positive risk: high without jurisdiction/context qualification.
- Proof: `XDATA-ADV-PROOF-001`.

### G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-002 — canonical deletion/tombstone diverges from residual replicas/versions
- Activation: canonical deletion is accepted while object/database replicas, versioned objects, caches, backups or provider destinations retain accessible copies.
- Incompatible claims: Data/Lifecycle says deleted; Storage realization still serves or can restore old content.
- Safe behavior: canonical deletion disposition remains separate from physical realization convergence; residual copies are inventoried, access constrained and drained/expired according to qualified policy.
- Forbidden behavior: source delete acknowledgement proves enterprise-wide erasure; restore/recovery reintroduces deleted data without reapplying current deletion/retention state.
- Owners: Storage + Data/Lifecycle + Privacy/Governance.
- Disposition: `PARTIAL/INCONCLUSIVE` while residual copies remain authoritative/accessibly undispositioned.
- Evidence/currentness: replica/version inventory, delete markers, backup generations, provider replication status, current retention/privacy policy.
- Recovery: propagate/fence deletion where required, record allowed retained cohorts, validate restore pipelines against current deletion ledger.
- Blast radius: dataset/system/regulatory. Severity: CRITICAL. Misuse: likely with replicated/versioned storage. False-positive risk: medium because some retained copies may be lawfully inaccessible archives.
- Proof: `XDATA-ADV-PROOF-002`.

### G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-003 — provider/storage substitution leaves stale authoritative replica
- Activation: storage/database provider is replaced while asynchronous replicas, CDC, caches or restore sources from the old provider remain active.
- Incompatible claims: new provider is treated as canonical while old realization can still emit, restore or accept writes with stale schema/privacy state.
- Safe behavior: provider identity remains non-canonical; cutover is incomplete until residual writer/read/replication cohorts are fenced, drained or explicitly dispositioned and semantic currentness is validated.
- Forbidden behavior: cutover timestamp alone proves data convergence; stale provider copy overwrites newer canonical state during recovery.
- Owners: Provider/Binding + Storage + Data/Lifecycle + Privacy where scopes differ.
- Disposition: `PARTIAL/INCONCLUSIVE` until residual cohort evidence closes.
- Evidence/currentness: provider generation, replication/CDC checkpoints, write fencing, schema/policy revision and restoration inventory.
- Recovery: reconcile diffs, fence obsolete provider, replay only semantically qualified changes, validate post-cutover state.
- Blast radius: dataset/system. Severity: CRITICAL. Misuse: plausible during migration. False-positive risk: low when residual inventory is complete.
- Proof: `XDATA-ADV-PROOF-003`.

### G2-XEDGE-DATA-PRIVACY-STORAGE-LIFECYCLE-004 — individually valid lifecycle policies compose into impossible canonical state
- Activation: retention, archival, deletion, residency, minimization, legal hold and application lifecycle rules are each valid in isolation but apply concurrently to the same subject/revision.
- Incompatible claims: one policy requires movement/retention, another prohibits destination/processing, another requires deletion or preservation.
- Safe behavior: policy owner/precedence/applicability is explicit; unsatisfied obligations surface as conflict signals and cannot be resolved by storage convenience or execution order.
- Forbidden behavior: provider lifecycle rule or job completion becomes canonical policy truth; one successful action masks an unsatisfied conflicting obligation.
- Owners: Governance/Privacy/Records owners + Data semantic owner; Storage/Lifecycle realizes only admitted disposition.
- Disposition: unresolved composition → `INCONCLUSIVE` and route for owner reconciliation; no silent auto-resolution.
- Evidence/currentness: all applicable policies/revisions, subject classification/location, authority precedence and realization status.
- Recovery: reconcile owner claims, supersede/correct disposition, validate all required postconditions.
- Blast radius: record → system/enterprise/regulatory. Severity: HIGH–CRITICAL. Misuse: likely in complex enterprises. False-positive risk: medium/high without full policy applicability context.
- Proof: `XDATA-ADV-PROOF-004`.

## Reusable processual / semantic conflict patterns

### G2-CONFLICT-PATTERN-DATA-001 — competing canonical writes are locally valid but jointly violate owner invariants
- Family: data/consistency + state-transition.
- Activation conditions: concurrent/stale-base mutations, overlapping process paths or imported corrections targeting the same canonical subject.
- Incompatible claims/actions/states: multiple locally admissible postconditions cannot all hold under the semantic owner's invariant.
- Why local validation may miss it: each mutation validates against a different snapshot or only its own field/aggregate scope.
- Detection candidates: optimistic revision/precondition conflict, invariant re-evaluation at commit, mutation dependency/postcondition comparison; runtime conflict signal.
- Owners: canonical Data/domain semantic owner + Process/Workflow mutation initiators.
- Severity: HIGH–CRITICAL; confidence: strongly supported; detectability: pre-commit/runtime; blast radius: record→process; reversibility: merge/migration dependent; time-to-harm: immediate; misuse likelihood: likely accidental; evidence currentness: current subject/invariant revision required.
- False-positive risk: medium because some mutations are intentionally commutative or mergeable.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; on observed conflict, owner-defined reject/merge/serialize/reconcile.
- Proof candidate: `DATA-CONFLICT-PROOF-001`.

### G2-CONFLICT-PATTERN-POLICY-001 — valid privacy/retention/residency obligations produce incompatible dispositions
- Family: policy/compliance + data + lifecycle.
- Activation conditions: multiple applicable policy bases govern the same data subject/content with different required actions or prohibitions.
- Incompatible claims/actions/states: erase vs retain; move/archive vs residency prohibition; minimize access vs operational requirement.
- Why local validation may miss it: each policy engine/owner can correctly evaluate its own rule without evaluating cross-owner applicability/precedence.
- Detection candidates: policy obligation-set intersection, precedence/authority evidence check, unsatisfied-obligation analysis, pre-execution disposition assessment.
- Owners: Governance/Privacy/Records authority owners + Data owner.
- Severity: HIGH–CRITICAL; confidence: strongly supported; detectability: static/pre-execution; blast radius: record→enterprise/regulatory; reversibility: potentially irreversible; time-to-harm: immediate/delayed; misuse likelihood: plausible; evidence currentness: current jurisdiction/policy/hold evidence required.
- False-positive risk: high if legal scope/context is incomplete; detector signal must not be treated as legal conclusion.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; route concrete instances to qualified policy owner/human reconciliation where needed.
- Proof candidate: `DATA-CONFLICT-PROOF-002`.

### G2-CONFLICT-PATTERN-REPLICA-001 — canonical lifecycle state conflicts with residual physical realizations
- Family: provider/integration + data/consistency + recovery.
- Activation conditions: replication/versioning/backup/caching or provider substitution leaves copies whose lifecycle lags canonical intent.
- Incompatible claims/actions/states: canonical subject says deleted/migrated/current while a residual realization remains readable, writable or restorable under stale semantics.
- Why local validation may miss it: source operation succeeds without proving all asynchronous/residual realization states.
- Detection candidates: replica/cohort inventory, replication currentness, delete/tombstone propagation assessment, restore-source conformance check.
- Owners: Storage + Lifecycle + Data/Privacy owner; Provider/Binding for realization generation.
- Severity: CRITICAL; confidence: strongly supported; detectability: runtime/post-effect/audit; blast radius: dataset/system/regulatory; reversibility: bounded to hard; time-to-harm: latent/recovery-triggered; misuse likelihood: likely operationally; evidence currentness: current replication/backup inventory required.
- False-positive risk: medium where residual copies are cryptographically/access-wise quarantined and explicitly policy-approved.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; observed conflict requires fence/drain/delete/quarantine/reconcile according to policy.
- Proof candidate: `DATA-CONFLICT-PROOF-003`.

### G2-CONFLICT-PATTERN-MIGRATION-001 — old/new cohorts are individually valid but composition-incompatible
- Family: version/migration/coexistence + data.
- Activation conditions: phased migration/backfill, rollback, mixed readers/writers or schema/provider replacement.
- Incompatible claims/actions/states: old and new cohorts each satisfy their own revision but shared processes assume one canonical interpretation.
- Why local validation may miss it: per-record/per-service validation passes while cross-cohort interactions violate semantics.
- Detection candidates: revision-vector/cohort compatibility matrix, residual writer/reader inventory, migration coverage/currentness and cross-version conformance checks.
- Owners: Data/Schema + Lifecycle + affected semantic/process owners.
- Severity: CRITICAL; confidence: strongly supported; detectability: pre-execution/runtime/audit; blast radius: dataset/process/system; reversibility: migration-dependent; time-to-harm: latent/immediate at interaction; misuse likelihood: likely; evidence currentness: live cohort inventory required.
- False-positive risk: medium because some dual-write/read coexistence is intentionally compatible.
- Future remediation disposition: `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE`; concrete instance routes to pin/migrate/fence/reconcile or documented compatible coexistence.
- Proof candidate: `DATA-CONFLICT-PROOF-004`.

## Saturation disposition

This first visit produced material findings. Local no-material streak for Data / Schema / Migrations = `0`; paired-cluster streak for Data/Schema × Privacy × Storage × Lifecycle = `0`. No finding here asserts a current concrete defect. All reusable conflicts remain elicited patterns with detection/remediation candidates. Full Pass 1 remains incomplete.