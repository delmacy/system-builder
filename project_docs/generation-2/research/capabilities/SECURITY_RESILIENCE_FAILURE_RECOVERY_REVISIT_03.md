# Security / Resilience / Failure Recovery — Revisit 3 (Cycle 4)

## Research question
How should Generation 2 represent resilience and recovery so failover, rollback, restore, forward-fix, degraded operation and security recovery preserve semantic correctness, authority and lineage rather than treating technical availability as proof of recovery?

## Representatives and evidence/source ledger

| Representative | Evidence class | Material mechanism / implication | Coverage |
|---|---|---|---|
| AWS Well-Architected Reliability Pillar | consolidated engineering guidance | RTO and RPO are business recovery objectives; DR must be tested; recovery automation needs an abort mechanism and post-recovery verification | DEEP |
| Microsoft Azure Well-Architected / Architecture Center | consolidated engineering guidance | retry, circuit breaker, bulkhead, graceful degradation and failover solve distinct failure classes; fallback can preserve availability while weakening freshness/semantics | DEEP |
| Linux Global File System recovery / USENIX | systems research / production architecture | split brain can corrupt shared state; recovery must fence an allegedly failed writer before journal replay; generation-qualified replay avoids blind reapplication | DEEP |
| Distributed consensus / SRE production literature | industrial/research synthesis | reliable stateful failover requires agreement on membership/leadership; ad-hoc failover creates split-brain risk | DEEP |
| Real-world MySQL failover incident / USENIX SREcon | industrial incident evidence | automatic failover can technically restore service yet create split brain/data corruption when edge cases, automation and human action interact | DEEP |

### Source ledger
- AWS Reliability Pillar: recovery objectives distinguish downtime (RTO) and recoverable data position (RPO); failures can leave data lost, inconsistent or stale; recovery procedures should be exercised and validated.
- AWS automated recovery guidance: automation improves repeatability but itself can create additional downtime/data loss; a governed abort path is required.
- Azure reliability patterns: retry addresses transient failure; circuit breaker stops calls likely to fail; bulkheads bound blast radius; failover may expose eventually consistent state.
- Preslan et al., *Scalability and Failure Recovery in a Linux Cluster File System* (USENIX/ALS): a node thought dead may still write; recovery fences it before replay because dual writers can corrupt state. Replay is generation-qualified.
- SREcon production evidence: automatic database failover combined with edge-case recovery and inadequate safeguards produced split brain and corruption, demonstrating that failover success is not semantic recovery proof.

## Source of truth, identity and lifecycle
Security/recovery source of truth is not the currently reachable replica. Generation 2 should distinguish at least:

`FailureObservation → IncidentRevision → RecoveryIntentRevision → RecoveryPlanRevision → RecoveryAttempt → Fencing/AuthorityEvidence → RestoredRealizationSet → SemanticPostconditionEvidence → RecoveryQualification`

A recovery attempt has lineage to the exact lifecycle revision vector, persisted-state position, trust/credential revision, provider binding, authority context and transition-readiness evidence used when admitted.

## Versioning and revision interaction
Recovery invalidates or requalifies prior transition-readiness evidence whenever an incident can change topology, persisted state, trust material, provider health, authority or in-flight work. A pre-incident `READY` decision is therefore not indefinitely reusable.

Mixed revisions can legitimately coexist during recovery, but roles must be explicit: authoritative writer, read-only replica, replay source, recovery target, quarantined realization, compatibility bridge and draining realization. Merely being alive does not grant writer authority.

## Failure semantics
Failover, rollback, restore and forward-fix are separate governed transitions:

- **failover** changes active realization/provider/topology;
- **rollback** restores routing/code/configuration toward a prior realization;
- **restore** reconstructs persisted state from a recovery point or journal;
- **forward-fix** advances to a new revision that repairs the fault without reverting history.

None proves the others. `ServiceReachable = true` does not prove data freshness, semantic compatibility, authorization validity, workflow consistency or business postconditions.

Split-brain prevention requires explicit fencing/lease/quorum/epoch evidence before a replacement writer becomes authoritative. If exclusive-writer safety cannot be proven, the safe result is degraded read-only, suspended actuation or `INCONCLUSIVE`, not optimistic dual writing.

## Extensibility and provider boundaries
Resilience mechanisms are provider-realized but capability semantics remain portable. A database may use fencing tokens, a workflow engine epochs/checkpoints, an object store version generations, and an orchestrator leases/quorum. SB should own portable requirements and evidence profiles, not rebuild generic consensus, storage replication or orchestration machinery.

Provider replacement during recovery must use the shared governed migration transition and cannot silently weaken RPO/RTO, durability, consistency, trust or authority requirements. A technically available fallback that violates the required semantic profile is not an admissible replacement.

## Governance and authority
Recovery authority is distinct from detection, diagnosis, deployment, credential administration, provider administration and canonical domain/process authority:

`Observe ≠ Diagnose ≠ AdmitRecovery ≠ FenceWriter ≠ RestoreState ≠ PromoteWriter ≠ RotateTrust ≠ ChangeDomain`

Emergency/degraded operation may use pre-authorized, scoped and expiring authority leases, but must not infer new authority from unavailability. Any break-glass path requires explicit scope, expiry, audit lineage and post-incident reconciliation.

## Observability and evidence qualification
RTO/RPO are objectives, not semantic conformance proofs. Recovery qualification needs evidence for service availability, recovered data position, consistency/freshness, trust/credential validity, exclusive-writer safety, in-flight execution disposition and domain postconditions. Missing evidence yields `INCONCLUSIVE` where the profile requires it.

## Portability and lock-in
A portable recovery profile should express objectives, recovery-point identity, required state/trust closure, fencing/exclusivity conditions, acceptable degraded modes, authority constraints, postconditions and evidence freshness independently from cloud/vendor primitives. Provider-specific failover APIs remain realizations.

## Product-specific mechanism vs universal primitive
Product-specific: AWS DR orchestration, Azure traffic/failover services, particular database promotion commands, STONITH/persistent reservations, vendor replication modes.

Universal candidates: qualified recovery evidence, writer-fencing/exclusivity proof, recovery-point lineage, degraded-authority envelope, transition-readiness invalidation/requalification and qualified local recovery closure.

## Convergent patterns
1. Availability recovery and state recovery are different.
2. Recovery objectives are scoped and business-qualified.
3. Automated recovery needs bounded authority, abortability and verification.
4. Replicated state requires prevention of concurrent conflicting writers.
5. Fallback/degradation must be explicit about semantics lost.
6. Recovery must preserve lineage to the state/revision/trust context restored.

## Divergences
Products vary in whether recovery is synchronous or asynchronous, whether failover is automatic, how consistency is traded for availability, and whether fencing is lease/quorum/epoch/device based. These are realization choices and should not become universal SB semantics.

## Subcapabilities
- failure detection and classification;
- blast-radius isolation / bulkheads;
- degraded-mode policy;
- failover and writer fencing;
- backup/restore and recovery-point lineage;
- persisted-state and in-flight execution recovery;
- trust/credential recovery and revocation;
- recovery automation with abort/approval boundaries;
- post-recovery semantic qualification;
- local/offline/air-gapped recovery closure;
- incident-triggered invalidation of readiness evidence.

## Comparison with SB — bounded repo validation only
This revisit does not claim repository-wide absence or presence. Fresh `main` remains the only implementation truth; full archaeology is reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`. Questions below are intentionally deferred unless bounded evidence is required.

## Reconciliation hypotheses
- **GENERALIZE** recovery as a governed transition with revision-bound lineage and qualified postconditions.
- **HARDEN** provider/runtime transitions with fencing/exclusive-writer evidence where state can be mutated.
- **INTEGRATE** recovery with Lifecycle revision vectors and invalidation of transition-readiness evidence.
- **PROVIDERIZE** consensus, replication, backup engines, orchestrator failover and storage-specific restore mechanics.
- **HARDEN** degraded operation so fallback never amplifies authority or silently weakens mandatory semantics.
- **DEFER** concrete implementation choices until fresh-main archaeology and target-architecture planning.

## Repo-validation questions
1. Does current SB distinguish rollback of realization from restoration/reconciliation of persisted semantic state?
2. Are recovery points/checkpoints first-class and lineage-bound to schema/workflow/provider revisions?
3. Can provider/runtime failover prove single-writer/exclusive authority before actuation?
4. Can readiness evidence be invalidated after incident/topology/trust changes?
5. Are degraded/offline modes explicit, authority-bounded and auditable?
6. Can in-flight workflow/automation executions be classified as replayable, compensatable, quarantined or irrecoverable?
7. Are credential/trust rotations during recovery represented separately from provider rebinding?

## Adaptive Governed Work Surfaces cross-check
AGWS remains distinct from generic UI. Under degraded operation, the effective surface is re-resolved through `Enterprise → Station → Role → Person` against currently admissible capabilities and evidence. A lower layer cannot recover a removed capability by selecting a stale provider or cached action. Mandatory superior components remain mandatory; unavailable components may render an explicit degraded/unavailable state rather than disappear silently.

AI remains sole materializer but gains no emergency authority. A request that requires provider failover, credential rotation, writer promotion, schema repair or canonical process change escalates. Personal automation is suspended or degraded when Station/Role authority or required evidence cannot be requalified.

## Qualified local/offline recovery closure
A local/offline closure is profile-specific and may include: immutable artifact/release material, persisted-state recovery points/checkpoints, schemas/migrations, workflow histories, provider/runtime definitions, trust roots and revocation material, secrets/config references, fencing/epoch metadata, conformance fixtures, recovery procedures, and local evidence verifiers. Closure availability alone does not prove freshness; stale trust/recovery material can require `INCONCLUSIVE` or read-only operation.

## Symbiotic Proof
A generated system loses its primary provider and network connectivity while a local recovery target exists. The system must: (1) identify the exact recoverable state/revision vector; (2) prevent the old writer from continuing or refuse new writes when exclusivity cannot be proven; (3) restore/replay only qualified state; (4) preserve Station/Role authority without emergency amplification; (5) expose AGWS in an explicit degraded mode; (6) requalify trust, persisted state, in-flight workflows and domain postconditions; and (7) produce lineage showing whether the result was failover, rollback, restore or forward-fix. Passing RTO/RPO alone is insufficient.

## Stable findings
- **G2-FINDING-SRFR-23 — Recovery Availability Is Not Semantic Recovery.** Restored reachability or successful failover does not prove data freshness, state consistency, authorization validity, workflow disposition or domain postconditions.
- **G2-FINDING-SRFR-24 — Failover, Rollback, Restore and Forward-Fix Are Distinct Governed Transitions.** They can compose but cannot be treated as synonyms or as one generic rollback operation.
- **G2-FINDING-SRFR-25 — Writer Promotion Requires Fencing/Exclusivity Evidence.** A replacement writer must not become authoritative while a prior writer may still mutate shared state; inability to prove exclusivity requires a safer degraded state.
- **G2-FINDING-SRFR-26 — Recovery Invalidates Transition Readiness Until Requalified.** Incident-driven changes to topology, state position, trust, provider health or in-flight work can stale a prior readiness decision.
- **G2-FINDING-SRFR-27 — RTO/RPO Bound Time and Data-Loss Objectives but Do Not Prove Semantic Conformance.** Recovery qualification needs additional state/trust/authority/domain evidence.
- **G2-FINDING-SRFR-28 — Degraded and Offline Recovery Must Be Authority-Non-Amplifying.** Loss of connectivity or provider availability cannot grant capabilities, credentials or canonical mutation rights that were not previously authorized.
- **G2-FINDING-SRFR-29 — Recovery Must Reconcile Persisted State and In-Flight Executions Separately.** Restoring storage does not by itself decide whether workflows/messages/automations should resume, replay, compensate, quarantine or terminate.
- **G2-FINDING-SRFR-30 — Qualified Local Recovery Closure Is Revision/Freshness/Trust Scoped.** Possessing local artifacts and backups is insufficient when trust, schema, provider, checkpoint or authority evidence is stale or incomplete.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-RECOVERY-SEMANTIC-POSTCONDITION-EVIDENCE` — **CROSS_CUTTING / CONSOLIDATION_CANDIDATE**; likely specialization/merge into unified evidence qualification.
- `G2-CAPABILITY-CANDIDATE-WRITER-FENCING-EXCLUSIVITY-EVIDENCE` — **CROSS_CUTTING / CANDIDATE**; test generality across Data, Workflow, Integration and provider transitions.
- `G2-CAPABILITY-CANDIDATE-INCIDENT-INVALIDATED-TRANSITION-READINESS` — **CROSS_CUTTING / MERGE_TARGET**; strengthens qualified transition-readiness freshness/invalidation.
- `G2-CAPABILITY-CANDIDATE-NON-AMPLIFYING-DEGRADED-AUTHORITY-ENVELOPE` — **CROSS_CUTTING / CANDIDATE**; reconcile with AuthorityLease and Station exposure.
- `G2-CAPABILITY-CANDIDATE-QUALIFIED-LOCAL-RECOVERY-CLOSURE` — **CROSS_CUTTING / MERGE_TARGET**; likely specialization of qualified local closure profile.

No candidate is promoted in this revisit.

## Value / risk / priority / next question
**Value:** prevents technically successful recovery from corrupting semantic state or authority. **Risk:** high; split brain, stale trust and replay errors can convert an outage into irreversible corruption. **Priority:** critical cross-cutting architecture concern. **Next question:** whether AI-native engineering can plan/approve/execute recovery assistance without collapsing recommendation, approval, actuation and emergency authority boundaries, while preserving evidence qualification and human override.