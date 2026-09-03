# Security / Resilience / Failure Recovery — Revisit 6 (Cycle 7)

## Research question
How should Generation 2 qualify protection and recovery when the existence of backup/failover mechanisms is weaker than tested restorability, recovery objectives are only meaningful for a particular path and population, provider actuation can be ambiguous or create split brain, and recovery may leave residual sessions, routes, replicas, credentials or controllers attached to an abandoned state?

This revisit is research-by-exception over the prior Security dossier. It does not repeat the already-established branch-aware recovery, writer fencing, restore-versus-validation, observer invalidation, commit and reprotection findings except where cycle-7 Lifecycle evidence changes the qualification model.

## Representatives and evidence/source ledger
| Representative | Source of truth / material evidence | Coverage |
|---|---|---|
| NIST SP 1339 — OT Backup Quick Start Guide (June 2026) | Effective OT backup management integrates backups with change management, creates them regularly, tests them and reviews them during recovery exercises | DEEP |
| NIST SP 800-61 Rev. 3 / CSF 2.0 incident-response profile | Incident response and recovery are integrated with broader cybersecurity risk management rather than treated as a single terminal restore action | DEEP |
| CISA StopRansomware Guide | Offline/encrypted backups must be tested; recovery prioritizes critical services and must avoid reinfecting clean systems | DEEP |
| AWS Backup Restore Testing + Well-Architected REL09-BP04 | Recovery points are selected through an explicit eligibility window/type/vault rule; restore completion and validation are separate; periodic recovery testing is required to demonstrate RTO/RPO and data usefulness | DEEP |
| etcd v3.7 Disaster Recovery | Snapshot restore forms a new logical cluster; rewind can leave clients/controllers with impossible future revisions; revision bump + compaction invalidates stale watches/caches | DEEP |
| Google Cloud SQL advanced DR / HA guidance | Replica failover can create split brain when the old primary continues accepting writes; recovery of diverged data is a separate action | DEEP |
| Azure Site Recovery | Test failover is isolated from production; failover can continue even if source shutdown fails; commit consumes recovery points; reprotection is a separate post-failover transition | DEEP |

### Source ledger
- NIST SP 1339, OT Backup Quick Start Guide: https://csrc.nist.gov/pubs/sp/1339/final
- NIST SP 800-61 Rev. 3: https://www.nist.gov/publications/incident-response-recommendations-and-considerations-cybersecurity-risk-management-csf
- CISA StopRansomware Guide: https://www.cisa.gov/stopransomware/ransomware-guide
- AWS Backup restore testing: https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing.html
- AWS Backup restore-test validation: https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing-validation.html
- AWS Well-Architected REL09-BP04: https://docs.aws.amazon.com/wellarchitected/2025-02-25/framework/rel_backing_up_data_periodic_recovery_testing_data.html
- etcd v3.7 disaster recovery: https://etcd.io/docs/v3.7/op-guide/recovery/
- Google Cloud SQL advanced disaster recovery: https://cloud.google.com/sql/docs/sqlserver/use-advanced-disaster-recovery
- Google Cloud HA terminology / split-brain guidance: https://cloud.google.com/compute/docs/instances/sql-server/architectures-high-availability-mysql-clusters-compute-engine
- Azure Site Recovery failover/failback: https://learn.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-failover-failback

## Cycle-7 primitives, source of truth and identity
Generation 2 should treat protection/recovery truth as an applicability-scoped claim rather than a scalar `protected`, `recoverable`, `failedOver` or `healthy` flag.

The minimum typed identities are:
- `ProtectedAsset` / `CriticalServicePopulation`
- `ThreatOrFailureAssumption`
- `ProtectionControl`
- `FailureOccurrence`
- `ContainmentBoundary`
- `RecoveryObjectiveProfile` (`RTO`, `RPO`, integrity/business-state objectives and applicability)
- `RecoveryPoint`
- `RecoveryPathOrPlanRevision`
- `RecoveryAttempt`
- `RecoveryAuthorityLease` / `BreakGlassLease`
- `WriterOrActuatorEpoch`
- `EffectiveRestoration`
- `ValidationRun`
- `RecoveredConsumerPopulation`
- `ResidualCohortDisposition`
- `ProtectionState`
- `RecoveryEvidenceSet`

The source of truth is the joined lineage proving that a declared asset/population under a particular threat/failure assumption has an eligible recovery path, an authorized and fenced actuation, an observed effective restoration, current validation evidence, residual-cohort disposition and an explicit resulting protection posture. Provider success states are evidence inputs, not canonical truth.

## Lifecycle and state semantics
Security owns the correctness of containment and recovery guarantees while Lifecycle owns generic transition machinery. The security-specific lifecycle is therefore expressed as qualified facts over the shared transition model:

`Protected → FailureDetected → ContainmentAttempted → Contained/ContainmentInconclusive → RecoveryPointQualified → RecoveryActuationAttempted → OutcomeKnown/OutcomeUnknown → EffectiveRestorationObserved → BusinessStateValidated → ResidualCohortsDrained/Dispositioned → ProtectionReestablished → RecoveryQualified`.

Important separations:
- prevention is not detection;
- detection is not containment;
- containment is not eradication;
- restore/failover is not semantic recovery;
- semantic recovery is not consumer-population convergence;
- availability is not restored protection;
- a configured RTO/RPO is not evidence that those objectives are achievable now.

## Applicability-scoped qualification and revision vector
A protection/recovery claim is valid only for the applicability tuple under which it was demonstrated. At minimum this includes asset/service population, threat/failure class, recovery-objective profile, recovery-path revision, recovery-point class, data/schema/workflow position, release/artifact, configuration, trust/credential set, provider/runtime/topology, writer/actuator epoch, Station/tenant scope, consumer population and evidence horizon.

Any material change to those dimensions can make previous recovery evidence stale without retroactively falsifying the historical test. This is particularly important for backup/change-management coupling: NIST SP 1339 explicitly connects backups with change management and recovery exercises, so a backup test before a material system change cannot automatically qualify the changed system.

## Recovery objectives as evidence-backed claims
RTO and RPO are business objectives, but an architectural claim that a system satisfies them requires a tested path, workload/population and observation window. AWS Well-Architected explicitly recommends periodic restore testing to demonstrate RTO/RPO, and AWS Backup separates the recovery-point selection algorithm/window from restore execution and optional validation.

Generation 2 should therefore distinguish:
- `DeclaredRecoveryObjectiveProfile` — desired target;
- `ObservedRecoveryTestResult` — what a specific path achieved;
- `CurrentRecoveryQualification` — whether the evidence still applies to the current asset/path/population vector.

A provider setting, replication mode or retained snapshot count must never be upgraded into proof that business RTO/RPO are satisfied.

## Backup existence versus restorability versus validated business-state recovery
The evidence ladder is:

`BackupMaterialExists → IntegrityEvidenceAvailable → RecoveryPointEligible → RestoreAttemptAccepted → EffectiveRestorationObserved → DataAccessible → Domain/BusinessStateValidated → ConsumerPopulationConverged → ProtectionReestablished`.

AWS restore testing makes the restore-job and validation workflow separate. CISA requires regular testing of backup availability/integrity and warns that recovery can reintroduce compromise. etcd demonstrates that a byte-valid snapshot may still require observer invalidation and new-cluster identity. Therefore backup existence is only the first evidence class in a much longer recovery proof.

## Ambiguous recovery/failover actuation
Mutating recovery commands have high duplicate-effect risk. If acknowledgement is lost after a promotion/failover/fencing action, the correct state is `OUTCOME_UNKNOWN`, not `FAILED` and not implicit retry eligibility.

Google Cloud documents a concrete split-brain path: a replica may be promoted while the old primary continues accepting writes. Azure documents failover flows in which source shutdown is attempted but failover can proceed if shutdown fails. Together these show why retrying or promoting again on transport uncertainty can multiply writers or branches.

Required rule: `attempt → observe effective writer/route/topology/epoch → reconcile → only then decide retry, compensate, quarantine or continue`.

## Fencing, stale-controller rejection and observer invalidation
Security/Resilience owns the guarantee that no unqualified competing writer/controller can continue influencing the recovered state. The implementation is provider-specific, but the universal proof needs:
- unique writer/actuator epoch or equivalent fencing evidence;
- stale-controller rejection;
- route/session revocation or quarantine where needed;
- watcher/cache/checkpoint invalidation after rewind;
- explicit disposition of the old primary/branch.

etcd v3.7 shows both sides: restore starts a new logical cluster identity, and revision bump plus compaction can terminate watches based on abandoned future revisions. A restored datastore that leaves stale authoritative controllers alive is not recovered.

## Mixed provider/runtime recovery support vector
Recovery portability cannot be represented by a single capability boolean. The support vector should separately qualify:
- snapshot/continuous recovery-point semantics;
- consistency guarantees;
- point/timeline ancestry;
- writer fencing/split-brain resistance;
- restore/failover actuation semantics;
- validation hooks;
- observer/cache invalidation;
- test-isolation ability;
- rollback/failback/reprotect behavior;
- evidence retention/exportability;
- offline/air-gapped operation;
- delegated emergency administration.

A provider can satisfy backup export while failing safe failover, or support fast failover without independently testable business-state validation. Provider substitution must preserve the required vector, not just a nominal `backup`/`DR` feature.

## Dual-site coexistence and residual cohort drainage
Recovery closure must cover more than storage replicas. During failover/restore, old and new realizations can coexist across sessions, caches, routes, DNS/service discovery, queue subscriptions, replication links, credentials/tokens, controllers, agents and user endpoints.

The target may be healthy while residual cohorts still point at or authorize the abandoned realization. Closure therefore requires target-effective proof plus a denominator of expected consumers and explicit status for every relevant residual cohort: `DRAINED`, `REBOUND`, `REVOKED`, `QUARANTINED`, `EXPIRED`, `MIGRATED` or `EXPLICITLY_ACCEPTED_RESIDUAL_RISK`.

This reconciles Lifecycle residual-cohort findings without transferring lifecycle ownership: Lifecycle owns the generic drainage transition; Security owns whether residual influence makes recovery unsafe.

## Evidence replay/retention horizons
Historical recovery evidence and current recovery qualification are separate. A recovery drill can remain a valid historical fact while becoming unusable as current assurance because:
- the application/configuration changed;
- threat assumptions changed;
- provider/runtime/topology changed;
- trust/credential material rotated;
- the tested recovery point class expired;
- validation artifacts/logs are no longer retained;
- the consumer population changed materially.

`EvidenceUnavailable` or `EvidenceExpired` therefore yields current `INCONCLUSIVE`/retest-required status where proof is mandatory; it must not erase the historical event nor silently preserve a green current claim.

## Qualified offline / air-gapped recovery
CISA and NIST support offline backup/recovery practices, but disconnected operation does not imply broader authority. A Station may recover only within a declared local closure containing the required artifacts, schema/data compatibility, trust material, recovery-point integrity evidence, fencing mechanism, validation logic and delegated emergency authority.

Reconnect requires requalification against current Enterprise policy/trust/configuration/provider state before privileged merge, writer promotion, synchronization or canonical adoption. Conflicts with a newer Enterprise recovery epoch must be fenced, not resolved by “last writer wins.”

## Delegated Station emergency authority and break-glass
`Enterprise → Station → Role → Person` remains attenuation-only during incidents. Break-glass is an explicit, scoped, time-bounded lease with audience/resource/action restrictions, reason, issuer, expiry, use evidence and post-use revocation/requalification.

Break-glass may authorize an otherwise unavailable recovery action, but it cannot waive recovery-point eligibility, writer fencing, semantic validation, residual-cohort drainage or evidence capture. AI/AGWS may collect evidence, simulate/propose a recovery path and expose already-delegated controls; they cannot self-grant break-glass, provider-admin, secret, writer-promotion, routing or canonical-state authority.

## Extensibility and provider boundaries
**Provider-specific mechanisms:** snapshots, WAL/PITR, cloud replication, quorum/witness algorithms, hypervisor failover, restore-test orchestration, network fencing, DNS/traffic switching, vault/immutability APIs, revision-bump details.

**Universal primitives:** applicability-scoped recovery qualification; typed asset/threat/objective/point/path/attempt/restoration/evidence identities; tested-objective evidence; ambiguous-actuation reconciliation; effective-writer fencing; residual-cohort drainage; currentness/replay horizons; protection-state closure; attenuation-only emergency authority.

## Convergent / divergent patterns
### Convergent
- periodic recovery testing is stronger than backup existence;
- restore completion is weaker than validation;
- recovery evidence becomes stale after relevant change;
- safe failover needs exclusive writer/control authority;
- disaster recovery is staged and has post-failover cleanup/reprotection work;
- isolated drills are preferable where available;
- historical evidence must retain enough lineage to interpret what was actually tested.

### Divergent
- providers expose different RPO/RTO measurement, consistency, failover, fencing and recovery-point selection semantics;
- some products provide test isolation or validation hooks, others only restore primitives;
- rollback/failback/reprotect semantics differ materially;
- observer/cache invalidation can be explicit (etcd) or external/application-owned;
- evidence export and offline operation vary substantially.

These divergences belong in provider capability profiles and qualification evidence, not in the canonical security semantics.

## Subcapabilities
Protection qualification; threat/failure assumption registry; recovery-objective profiles; recovery-point catalog/eligibility; restore/failover drills; containment; writer/actuator fencing; split-brain detection; stale-controller rejection; observer/cache/checkpoint invalidation; semantic recovery validation; consumer/residual-cohort drainage; reprotection; recovery evidence retention/replay; break-glass; qualified offline recovery; residual-risk disposition.

## Comparison with SB — bounded evidence only
No new implementation claim is made about `main`. Fresh repository archaeology remains reserved for Planning B. Later repository validation must determine whether SB currently distinguishes declared recovery objectives from tested current qualification, whether recovery attempts can enter `OUTCOME_UNKNOWN`, whether residual consumer cohorts are enumerable, and whether Station emergency authority is expiring and fenced.

## Reconciliation hypotheses
- **GENERALIZE** protection/recovery status into applicability-scoped, evidence-backed qualification.
- **HARDEN** RTO/RPO from configuration metadata into declared-objective plus observed-test plus current-qualification lineage.
- **HARDEN** restore/failover with reconcile-before-retry and effective-writer/route fencing.
- **HARDEN** recovery closure with expected-consumer population and residual-cohort disposition.
- **INTEGRATE** generic attempted→accepted→applied→converged→validated→drained transition mechanics from Lifecycle while retaining Security ownership over containment/recovery correctness.
- **INTEGRATE** evidence currentness/replay horizons with Governance/Observability.
- **PROVIDERIZE** snapshot/PITR/replication/failover/witness/test-drill mechanics and provider-specific RTO/RPO observations.
- **DEFER** exact quantitative objective calculators until Product Proof unless required by a canonical acceptance claim.
- **DO_NOT_BUILD** database replication, distributed consensus, cloud DR engines or provider-native backup engines inside SB.

## Repo-validation questions
1. Does SB distinguish declared RTO/RPO from observed recovery-test results and current qualification?
2. Can a protection/recovery claim be applicability-scoped to asset/population, threat/failure class, path revision, provider/runtime/topology and evidence horizon?
3. Are asset, failure, recovery point, path/plan, attempt, effective restoration, validation run and evidence identities distinct?
4. Can restore/failover actuation enter `OUTCOME_UNKNOWN` and force effective-state reconciliation before retry?
5. Are competing writer/controller epochs fenced across Enterprise/Station recovery actors?
6. Can SB enumerate expected recovery consumers and prove residual session/cache/route/replica/subscription/credential drainage?
7. Does recovery qualification become stale after material release/schema/config/trust/provider/topology change?
8. Can a disconnected Station recover only from a declared local closure and be forced to requalify on reconnect?
9. Is break-glass explicitly scoped, expiring and non-amplifying, with post-use revocation evidence?
10. Can provider substitution expose a mixed recovery-support vector instead of a single `backup`/`DR` capability flag?
11. Can historical recovery-test evidence remain valid history after it expires as current assurance?
12. Can the system represent `RecoveredButNotProtected` / `RecoveredButResidualCohortsRemain` without collapsing these states into healthy?

## Adaptive Governed Work Surfaces cross-check
Adaptive Governed Work Surfaces remains a promoted CORE capability distinct from generic UI. It may present current protection claims, missing evidence, residual-cohort maps, recovery proposals, drills and already-authorized emergency controls. It must preserve mandatory Enterprise/Station governance surfaces and cannot let personalization, AI materialization or local convenience remove required evidence or broaden recovery authority.

## Symbiotic Proof
A Station loses its primary database and external authority connectivity. It has an offline recovery point and a previously successful recovery drill that met RTO/RPO before a recent schema/configuration change. An operator triggers promotion, loses acknowledgement, and a network partition leaves the old primary potentially writable. Meanwhile sessions, service discovery, caches and a queue consumer still reference the old realization.

The proof must: mark the old drill as historically valid but current qualification stale; recompute recovery-point/path eligibility against the new revision vector; use only delegated, expiring Station emergency authority; record the promotion attempt as `OUTCOME_UNKNOWN`; observe the effective writer/route epoch before any retry; reject or fence the old writer/controller; restore and validate business state; enumerate the expected consumer population; drain/revoke/rebind residual sessions/routes/caches/subscriptions/credentials; record whether RTO/RPO were actually achieved for this run; distinguish recovered service from reprotected state; and on reconnect requalify against Enterprise trust/policy/provider state. AI/AGWS may propose and display every step but may not self-authorize promotion or provider administration.

A green backup status, successful VM boot or prior RTO/RPO drill alone must fail the proof.

## Stable findings
- **G2-FINDING-SRFR-47 — Protection and Recovery Qualification Is Applicability-Scoped.** `Protected`, `Recoverable`, `RTOMet` and `Recovered` are claims over an asset/population, threat/failure class, recovery-objective profile, recovery path, provider/runtime/topology, revision vector and evidence horizon; no scalar global status is sufficient.
- **G2-FINDING-SRFR-48 — Recovery Requires Separate Asset, Threat, Objective, Point, Path, Attempt, Effective-Restoration, Population and Evidence Identities.** Collapsing these identities prevents currentness checks, ambiguous-actuation reconciliation and deterministic audit of what was actually recovered.
- **G2-FINDING-SRFR-49 — Prevention, Detection, Containment, Recovery and Reprotection Are Independent Security States.** Service reachability after restore/failover does not prove that compromise is contained, residual influence is removed or protection posture is reestablished.
- **G2-FINDING-SRFR-50 — RTO/RPO Satisfaction Is an Evidence-Backed Path-and-Population Claim, Not Configuration Metadata.** Recovery objectives become qualified only through relevant observed tests/runs whose evidence still applies to the current asset/path/population vector.
- **G2-FINDING-SRFR-51 — Backup Existence, Restorability and Validated Business-State Recovery Form Separate Evidence Layers.** A retained or integrity-valid backup cannot stand in for an eligible recovery point, observed restoration, semantic validation, population convergence or reprotection.
- **G2-FINDING-SRFR-52 — Ambiguous Recovery/Failover Actuation Requires Reconcile-Before-Retry Because Duplicate Promotion Can Create Split Brain.** Lost acknowledgement around fencing, promotion, failover or routing must enter `OUTCOME_UNKNOWN`; effective writer/route/epoch evidence is required before another mutating attempt.
- **G2-FINDING-SRFR-53 — Recovery Closure Requires Residual-Cohort Drainage Against an Expected Consumer Population.** Sessions, caches, routes, replicas, subscriptions, credentials, controllers and endpoints tied to the abandoned realization must be drained, rebound, revoked, quarantined or explicitly risk-accepted before recovery is fully qualified.
- **G2-FINDING-SRFR-54 — Recovery Portability and Offline Autonomy Are Mixed Support Vectors Governed by Evidence Horizons and Non-Amplifying Emergency Authority.** Historical drills may expire as current assurance; disconnected Stations must operate from a qualified closure and requalify on reconnect; break-glass/AGWS/AI cannot create new security, writer or provider authority.

Eight material findings reset `consecutive_no_material_finding` to 0; Security / Resilience / Failure Recovery remains NOT SATURATED.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SRFR-APPLICABILITY-SCOPED-PROTECTION-RECOVERY-QUALIFICATION` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; reconcile with UCA applicability claims while Security retains threat/failure/recovery correctness semantics.
- `G2-CAPABILITY-CANDIDATE-SRFR-RECOVERY-OBJECTIVE-OBSERVED-QUALIFICATION-EVIDENCE` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; preserve declared RTO/RPO versus observed achievement versus current applicability.
- `G2-CAPABILITY-CANDIDATE-SRFR-AMBIGUOUS-RECOVERY-ACTUATION-RECONCILIATION` — **CORE_SUBCAPABILITY / PENDING_SYNTHESIS**; reconcile with Lifecycle/SIAC generic ambiguous-effect handling while Security retains split-brain/fencing consequences.
- `G2-CAPABILITY-CANDIDATE-SRFR-RESIDUAL-RECOVERY-CONSUMER-COHORT-DRAINAGE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; Lifecycle owns generic drainage mechanics while Security owns recovery-safety qualification.

No candidate is promoted. Adaptive Governed Work Surfaces remains promoted and distinct.

## Architecture proof-backfill obligations
1. Declare RTO/RPO but never run a qualifying restore test: current objective status remains unproven/INCONCLUSIVE.
2. Pass a restore drill, then materially change schema/config/trust/provider: historical result remains retained but current qualification becomes stale.
3. Lose acknowledgement after failover/promotion while old primary may still accept writes: reconcile effective writer/route/epoch before retry.
4. Restore a valid backup while domain validator fails: recovery remains unqualified.
5. Recover target while stale sessions/routes/caches/subscriptions/credentials still reference abandoned realization: closure remains PARTIAL/INCONCLUSIVE.
6. Recover data but fail to restore replication/reprotection: service may be available while protection state remains degraded.
7. Restore etcd-like state rewind while stale watchers/controllers survive: privileged promotion denied until observer state is invalidated/requalified.
8. Exercise provider substitution where both support backup export but only one supports fencing/test isolation: mixed support vector exposes the incompatibility.
9. Execute air-gapped Station recovery from a complete local closure, then remove trust/fencing/validator material: privileged recovery fails closed or reports INCONCLUSIVE.
10. Grant expiring Station break-glass and complete recovery after lease expiry: no further privileged actuation is accepted and post-use revocation evidence is retained.
11. Reconnect a locally recovered Station to a newer Enterprise recovery epoch: stale local promotion is fenced and requalification is mandatory.
12. Use AGWS/AI to request self-granted recovery/provider-admin authority: proposal/escalation allowed, authoritative mutation denied.

## Value / risk / priority / next question
**Value:** critical; converts disaster recovery from provider feature presence into auditable, current, business-effective assurance. **Risk:** critical because ambiguous failover and stale recovery evidence can create simultaneous writers or certify an unrecoverable workload as protected. **Priority:** highest for synthesis/acceptance boundaries. **Next question:** whether current recovery evidence should be represented as a reusable cross-capability `QualificationClaim` instance with Security-owned objective/threat semantics, rather than creating a separate security-only status model.