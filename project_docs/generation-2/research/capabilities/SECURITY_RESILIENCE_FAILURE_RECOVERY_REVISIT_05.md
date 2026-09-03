# Security / Resilience / Failure Recovery — Revisit 5 (Cycle 6)

## Research question
How should Generation 2 model recovery when restore/failover can branch history, invalidate caches, destroy alternative recovery points, require post-restore validation, and leave the system reachable but not yet protected or semantically qualified?

## Representatives and evidence/source ledger
| Representative | Source of truth / material evidence | Coverage |
|---|---|---|
| NIST SP 800-160 Vol. 2 Rev. 1 | Cyber resilience spans anticipate, withstand, recover and adapt; recovery remains part of lifecycle risk/trust engineering | DEEP |
| CISA StopRansomware Guide | Restore from offline/encrypted backups while preventing reinfection of clean systems | DEEP |
| AWS Backup Restore Testing | Restore-test completion and optional validation are distinct; temporary test resources have a separate cleanup lifecycle | DEEP |
| etcd Disaster Recovery | Snapshot restore can require revision bump plus compaction to invalidate stale Kubernetes watches/caches | DEEP |
| PostgreSQL PITR | Recovery creates timeline branches; timeline history is required to interpret later recovery paths | DEEP |
| Azure Site Recovery | Failover, validation, commit and reprotect are separate transitions; commit can delete alternative recovery points | DEEP |

### Source ledger
- NIST SP 800-160 Vol. 2 Rev. 1: https://csrc.nist.gov/pubs/sp/800/160/v2/r1/final
- CISA StopRansomware Guide: https://www.cisa.gov/stopransomware/ransomware-guide
- AWS Backup restore testing: https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing.html
- AWS Backup restore-test validation: https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing-validation.html
- etcd disaster recovery: https://etcd.io/docs/v3.7/op-guide/recovery/
- PostgreSQL PITR/timelines: https://www.postgresql.org/docs/current/continuous-archiving.html
- Azure Site Recovery failover/failback documentation: https://learn.microsoft.com/en-us/azure/site-recovery/vmware-azure-tutorial-failover-failback-modernized

## Primitives, identity, lifecycle and source of truth
Generation 2 needs distinct identities for `ThreatOrFailure`, `RecoveryPoint`, `RecoveryBranch`, `RecoveryIntent`, `RecoveryAttempt`, `WriterEpoch`, `RecoveredRealization`, `ValidationRun`, `PromotionCommit`, `ProtectionState` and `ResidualRiskDisposition`.

Portable lifecycle:
`Observe → Contain → SelectRecoveryPoint → QualifyPoint → FenceAuthority → Restore/Failover → ObserveEffectiveState → ValidateSemantics → Commit/Promote → Reprotect → ResidualRiskDisposition → Requalify`.

The source of truth is not a provider status such as `RESTORE_COMPLETED`. It is the lineage joining threat assumptions, selected recovery point/branch, exclusive actuation authority, effective realization, semantic validation, promotion/commit and resulting protection state.

## Versioning and recovery branches
A restore may create a new history rather than merely return to an old scalar version. PostgreSQL timelines demonstrate that recovery branches must retain ancestry and branch-point lineage. Compatibility and rollback eligibility are therefore directional and branch-relative.

The effective recovery vector includes at least threat revision, recovery-point identity, branch/timeline, artifact/release, schema/data position, workflow/checkpoint state, configuration, trust/credential state, provider/binding, topology/routing, authority/writer epoch, Station/tenant scope and validation evidence revision.

## Failure semantics
- **Recovery-point existence ≠ eligibility.** Integrity, threat assumptions, branch compatibility, schema/workflow/trust closure and required evidence can invalidate an existing point.
- **Restore-test completed ≠ validated.** AWS explicitly separates restore-job completion from validation; Generation 2 must represent `RESTORED` and `SEMANTICALLY_VALIDATED` independently.
- **Failover active ≠ committed.** Azure permits validation/change of recovery point before commit; commit can remove alternatives. Commit is therefore an explicit irreversible/option-consuming transition.
- **Recovered ≠ protected.** Azure requires reprotection after failover/failback. Operational reachability cannot be interpreted as restored resilience posture.
- **State rewind can invalidate observers.** etcd documents revision bump/compaction so stale Kubernetes watches do not continue from impossible future revisions. Recovery must account for observer/cache/checkpoint invalidation after rewind.
- **Ambiguous actuation remains OUTCOME_UNKNOWN.** Lost acknowledgement around restore, route promotion, fencing or commit requires effective-state reconciliation before retry.

## Recovery ownership, fencing and authority
`Observe ≠ Contain ≠ SelectPoint ≠ AccessRecoveryMaterial ≠ Restore ≠ PromoteWriter ≠ Commit ≠ Reprotect ≠ BreakGlass ≠ QualifyRecovery`.

Mutating recovery operations require expected-base plus ownership/writer-epoch fencing. A stale but authenticated actor must not be able to promote an older branch, restore again over a newer recovery, or re-enable a fenced writer.

Break-glass remains a scoped, expiring, auditable lease. It does not erase the requirement for recovery-point eligibility, writer fencing, semantic validation or post-use revocation/requalification.

## Extensibility and provider boundaries
Provider-specific: snapshots, WAL/PITR, vault locks, cloud failover, replication, restore testing, revision bump, quorum/fencing implementations.

Universal: typed recovery identity; branch ancestry; recovery-point eligibility; actuation fencing; effective-state reconciliation; restore-versus-validation separation; commit/promote semantics; reprotection closure; residual-risk disposition.

Provider replacement during recovery remains incomplete until prior routes/writers, recovery material, credentials, replication and threat assumptions are explicitly dispositioned.

## Governance, observability and portability
Evidence must retain threat revision, selected point and ancestry, writer epoch, actuation attempt/result, effective state, validation freshness/coverage, commit/promotion decision, reprotection status, Station/tenant coverage and residual-risk disposition. Missing mandatory evidence yields `PARTIAL`/`INCONCLUSIVE`.

Portable recovery requires interpretable lineage and qualification without the original provider control plane. Exported bytes alone are insufficient.

## Product-specific mechanism versus universal primitive
**Product-specific:** PostgreSQL timeline files, etcd `--bump-revision --mark-compacted`, AWS restore-testing plans, Azure failover commit/reprotect, vendor snapshot/vault APIs.

**Universal:** recovery branch identity/ancestry; point eligibility; exclusive writer epoch; post-restore semantic validation; option-consuming commit; post-recovery protection state; stale-observer invalidation; residual-risk closure.

## Convergent / divergent patterns
Convergent: recovery is staged; effective state must be observed; validation follows realization; authority is narrower than generic administration; recovery material and observers have freshness horizons; post-recovery protection must be restored.

Divergent: products vary in timeline mechanics, consistency class, automatic validation, retention, failover commit semantics, replication and fencing. These are provider profiles, not canonical SB semantics.

## Subcapabilities
Recovery-point catalog and eligibility; branch/timeline lineage; containment; writer fencing; restore/failover; observer/cache invalidation; semantic validation; promotion/commit; reprotection; break-glass; residual-risk/source disposition; qualified local/offline recovery.

## Comparison with SB — bounded evidence only
No repository-wide implementation claim is made. Fresh `main` archaeology remains reserved for Planning B. Current questions for later validation are whether SB models recovery branches, exclusive writer epochs, restore-versus-validation, commit option consumption, observer invalidation and reprotection as distinct facts.

## Reconciliation hypotheses
- **GENERALIZE** recovery as branch-aware typed transition lineage.
- **HARDEN** recovery-point admission with threat/path-relative eligibility.
- **HARDEN** mutating recovery operations with expected-base/writer-epoch fencing.
- **HARDEN** restore completion versus semantic validation and promotion.
- **INTEGRATE** directional rollback eligibility with Lifecycle and recovery-branch ancestry.
- **INTEGRATE** cache/checkpoint invalidation with Data, Workflow, Integration and Observability.
- **PROVIDERIZE** PITR, snapshots, restore-test engines, cloud failover and provider-specific fencing.
- **DO_NOT_BUILD** database replication, cloud DR engines or consensus inside SB.

## Repo-validation questions
1. Can current SB represent a recovery branch/timeline distinct from a revision number?
2. Is recovery-point eligibility recomputed against threat, trust, schema, provider and branch state?
3. Are restore completion and semantic validation separate evidence states?
4. Do recovery writes/promotion require expected-base and exclusive writer epoch?
5. Can a commit consume/delete alternative rollback/recovery options and record that consequence?
6. Is post-recovery reprotection/resilience state distinct from service availability?
7. Can state rewind invalidate watchers/caches/checkpoints before authoritative promotion?
8. Can a stale Station or break-glass actor be fenced after a newer recovery epoch?
9. Is residual compromised-source/recovery-material risk disposition explicit?

## Adaptive Governed Work Surfaces cross-check
Adaptive Governed Work Surfaces remains distinct from generic UI. `Enterprise → Station → Role → Person` is non-amplifying during recovery. AGWS may display evidence, propose recovery and expose already-authorized controls, but AI/personalization does not gain recovery-material access, writer promotion, commit, routing, provider-admin, break-glass or canonical-change authority. A disconnected Station may only recover inside a qualified local closure and must requalify on reconnect before privileged synchronization/promotion.

## Symbiotic Proof
A primary system is compromised after valid writes continued beyond the last clean recovery point. Operators restore to an earlier point, creating a new branch. A stale Station still holds watches/checkpoints from the abandoned future while a second operator times out during writer promotion. The proof must: qualify the point against the threat; create explicit branch ancestry; fence old/new writers by epoch; reconcile ambiguous promotion; invalidate stale observer state; validate domain semantics separately from restore completion; require explicit promotion/commit; record any consumed alternatives; reprotect the recovered system; disposition the compromised branch/provider/material; and requalify Stations on reconnect. A green provider restore status alone must fail the proof.

## Stable findings
- **G2-FINDING-SRFR-39 — Recovery Requires Typed Point, Branch, Attempt, Writer-Epoch, Validation and Protection Identities.** A scalar recovery/version status cannot safely alias recovery source, branched history, actuation authority, realized state and post-recovery protection.
- **G2-FINDING-SRFR-40 — Recovery-Point Eligibility Is Threat-, Path- and Branch-Relative.** An existing clean-looking point can become ineligible when threat assumptions, ancestry, schema/workflow/trust closure or the intended recovery path changes.
- **G2-FINDING-SRFR-41 — Restore Realization and Semantic Recovery Validation Are Separate States.** Provider restore completion establishes realization, not domain correctness, integrity acceptance or production eligibility.
- **G2-FINDING-SRFR-42 — Recovery Mutation Requires Expected-Base and Exclusive Writer-Epoch Fencing.** Authentication or generic admin rights alone cannot protect against stale concurrent restore/promotion actors.
- **G2-FINDING-SRFR-43 — Recovery Commit Is an Option-Consuming Transition Requiring Explicit Evidence.** Commit/promotion can destroy alternative recovery points or make reversal materially harder; it must not be inferred from reachability.
- **G2-FINDING-SRFR-44 — Reachability After Recovery Does Not Establish Restored Protection.** Replication/reprotection/resilience posture has a separate lifecycle and must be proven after failover/restore.
- **G2-FINDING-SRFR-45 — State Rewind Requires Observer/Cache/Checkpoint Invalidation Evidence.** Consumers retaining observations from an abandoned future can corrupt recovered authority unless their state is invalidated or requalified.
- **G2-FINDING-SRFR-46 — Recovery Closure Includes Residual Compromise and Abandoned-Branch Disposition.** Clean promotion is incomplete while stale writers/routes, compromised sources, recovery material or abandoned-branch consumers can still influence effective state.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SRFR-TYPED-RECOVERY-BRANCH-IDENTITY` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with Lifecycle typed transition identity while Security retains recovery/threat semantics.
- `G2-CAPABILITY-CANDIDATE-SRFR-RECOVERY-WRITER-EPOCH-FENCING` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile expected-base/fencing primitive across Data, Workflow, Deployment and Provider mutation.
- `G2-CAPABILITY-CANDIDATE-SRFR-POST-RESTORE-SEMANTIC-VALIDATION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; Security owns recovery qualification while executable conformance mechanics remain shared.
- `G2-CAPABILITY-CANDIDATE-SRFR-POST-RECOVERY-REPROTECTION-CLOSURE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; preserve distinction between service recovery and restored resilience posture.

No candidate is promoted.

## Architecture proof-backfill obligations
1. Restore completes but domain validator fails: promotion denied.
2. Two recovery actors race: stale writer epoch rejected.
3. PITR creates a new branch: ancestry remains queryable and directional rollback recomputed.
4. State rewind with stale watcher/checkpoint: observer invalidated before privileged actuation.
5. Failover is reachable but not committed: canonical state remains provisional.
6. Commit consumes alternative recovery points: evidence records the irreversible consequence.
7. Failover succeeds but reprotection is absent: resilience posture remains degraded.
8. Recovered system reconnects to stale Station: Station cannot replay abandoned-future authority.
9. Break-glass expires after recovery: residual exceptional authority is revoked and post-use evidence retained.
10. Provider/source replacement leaves compromised branch reachable: closure remains INCONCLUSIVE.

## Value / risk / priority / next question
**Value:** very high; prevents technically successful but semantically unsafe recovery. **Risk:** critical because recovery actions are destructive, exceptional and commonly exercised under degraded observability/authority. **Priority:** high for synthesis and later acceptance design. **Next question:** whether Security owns post-recovery reprotection as a subcapability or shares a formal cross-cutting `ProtectionState` primitive with Deployment/Provider/Lifecycle.