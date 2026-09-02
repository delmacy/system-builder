# Security / Resilience / Failure Recovery — Revisit 01

Status: REVISIT CYCLE 2 PASS 1 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
How should Generation 2 distinguish failure occurrence, retry/containment actions, recovery objectives, recovery transitions and post-recovery proof so that runtime resilience is portable and governable without hiding provider-specific semantics or incorrectly treating health, failover, restore or retry completion as recovery proof?

## Representatives
| Representative | Coverage | Contribution |
|---|---|---|
| Envoy retry/circuit breaking/outlier detection | DEEP | Distinguishes transaction/local-origin failures, passive/active health, ejection, circuit limits and retry budgets; containment can reject work without implying recovery. |
| Temporal durable Activity execution | DEEP | Retry attempts are distinct executions; timeouts/cancellation do not prove a prior attempt stopped; idempotency and heartbeat/checkpoint semantics are essential around external side effects. |
| Kubernetes disruption semantics | DEEP | PDBs constrain selected voluntary disruptions, do not prevent involuntary failures, and graceful termination is distinct from availability/recovery. |
| PostgreSQL PITR/timelines | DEEP | Recovery depends on admissible base/WAL material; corruption can halt recovery; successful PITR creates a new timeline lineage rather than erasing prior history. |
| AWS Well-Architected Reliability / DR | DEEP | RTO/RPO are business objectives; failover/failback strategies and tests are separate operational transitions and must be measured against objectives. |
| LitmusChaos | DEEP | Fault injection, steady-state probes and experiment results generate resilience evidence; experiments do not themselves authorize production recovery. |

## Evidence/source ledger
1. Envoy outlier detection: https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/outlier — passive outlier detection can distinguish external transaction errors from local-origin errors and eject hosts; active health checks are a separate signal.
2. Envoy circuit breaking: https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/circuit_breaking — retry concurrency is bounded to avoid retry amplification/cascading failure; circuit breaking is protective containment, not proof that the dependency recovered.
3. Temporal documentation and platform semantics: https://docs.temporal.io/ — durable execution resumes across infrastructure failure; Activity retries are separate attempts. Temporal support guidance additionally documents the key ambiguity that a timed-out Activity may still be running, so retries around non-idempotent external side effects require explicit safeguards.
4. Kubernetes disruptions: https://kubernetes.io/docs/concepts/workloads/pods/disruptions/ — PDBs constrain voluntary eviction but cannot prevent involuntary disruption; rolling-update failure semantics are owned by the workload controller; eviction honors graceful termination.
5. PostgreSQL continuous archiving/PITR: https://www.postgresql.org/docs/18/continuous-archiving.html — recovery requires base backup plus required WAL/history material; corrupted WAL can halt recovery; recovery creates timeline lineage and incremental backups introduce explicit dependency chains.
6. AWS Well-Architected Reliability: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/wellarchitected-reliability-pillar.pdf — RTO/RPO are objectives derived from business impact; recovery strategy, failover/failback playbooks and regular recovery testing are separate concerns.
7. LitmusChaos: https://litmuschaos.io/ — declarative experiments, probes and result/metrics generation test steady-state hypotheses and produce evidence about resilience.

## Source of truth
Generation 2 should own portable resilience/security requirements, governed recovery authority and evidence lineage. Concrete retry, ejection, circuit-breaking, failover, backup/PITR, checkpoint, restore and chaos mechanisms remain provider/runtime authorities. A provider reporting completion is not sufficient to assert semantic recovery; the SB evidence plane must preserve the independent postconditions that establish recovery for the subject revision/environment.

## Identity
Keep distinct identities for:
- failure occurrence/event;
- affected failure domain and blast-radius observation;
- retry/continuation attempt;
- containment/ejection/load-shed decision and realization;
- recovery objective revision (RTO/RPO or capability-specific objective);
- governed recovery decision;
- recovery attempt;
- recovery-point/material set;
- failover realization;
- failback realization;
- restored runtime/data lineage;
- post-recovery conformance result;
- chaos/fault experiment and experiment result.

A failure-domain observation may aggregate many occurrences, and one occurrence may cause multiple retry/recovery attempts. These identities must not collapse.

## Lifecycle
A portable lifecycle is: observation/detection -> classify scope/failure semantics -> optional bounded retry -> optional containment/degradation -> governed recovery decision -> recovery attempt -> provider realization -> post-recovery conformance -> recovered/degraded/failed disposition. Failover and failback are independent transitions. Restore/PITR may branch state lineage. A new failure during recovery creates a new occurrence and must not mutate historical attempt evidence.

## Versioning
Resilience requirements, retry/containment policies, recovery plans, recovery material, provider configuration and conformance suites each have independent revisions. Historical recovery success must remain bound to the exact subject/environment/provider/trust/configuration revisions. Changing a recovery plan, provider, dependency topology, schema or security trust context invalidates automatic reuse of earlier proof unless an explicit compatibility rule allows it.

## Failure semantics
- timeout means the observer no longer accepts/awaits completion within a deadline; it does not universally prove the underlying operation stopped;
- retry is a new attempt and can overlap with a timed-out predecessor unless the mechanism proves termination;
- idempotency key/side-effect identity belongs to the semantic operation, not to each transport retry;
- outlier ejection/circuit-open/load shedding intentionally reject or reroute work and therefore represent containment/degradation, not recovery;
- corruption and unavailability are distinct: retry/failover may solve unavailability while propagating corrupted state;
- a recovery point can exist yet be inadmissible or incomplete for the requested target;
- partial recovery can meet infrastructure health while failing data, security, authorization, workflow or business invariants;
- failback can fail independently after successful failover and needs its own authority/evidence.

## Extensibility
Providers may expose typed resilience semantics such as retry classes, idempotency support, cancellation guarantees, circuit/ejection controls, backpressure/load shedding, replica/failover models, recovery-point formats, PITR, restore, chaos injection and validation hooks. Provider descriptors must state guarantees/limitations and emitted evidence rather than a generic `resilient=true` capability.

## Provider boundaries
Portable SB requirements own semantic constraints: retry eligibility, side-effect/idempotency requirements, maximum acceptable degradation, RTO/RPO, recovery authority, required postconditions and proof obligations. Provider bindings own topology, mechanism-specific thresholds, archive/replica locators, concrete timeouts, cloud regions and recovery tooling. Replacement requires evidence that the new binding satisfies the semantic requirement, including recovery/failback and post-recovery conformance.

## Governance
Detection never authorizes destructive recovery automatically. Restore, failover, failback, data rewind, quorum changes and trust/security recovery require explicit policy/actor authority appropriate to subject and blast radius. Automated recovery is allowed only when delegated authority is already bounded and auditable. Chaos/fault injection has separate experiment authority and must not inherit production mutation authority merely because it is a resilience tool.

## Observability
Evidence should correlate failure occurrence, failure-domain observation, subject/deployment/environment/provider, retry and containment attempts, recovery decision, recovery point/material set, failover/failback attempts, achieved RTO/RPO, resulting lineage and post-recovery conformance. Missing evidence is UNKNOWN. Infrastructure readiness alone cannot establish security/trust restoration, data correctness or business acceptance.

## Portability and lock-in
Portable definitions should preserve objectives and semantic constraints while provider adapters own mechanism. Envoy cluster thresholds, Kubernetes PDB fields, AWS Region strategy and PostgreSQL WAL/timeline details must not leak into universal IR. Conversely, provider-specific prerequisites such as WAL continuity, cancellation guarantees or failback procedures must remain visible as declared limitations/evidence requirements; hiding them would create false portability.

## Product-specific mechanisms vs universal primitives
Universal primitives: failure occurrence; failure-domain observation; semantic operation/side-effect identity; retry attempt lineage; containment/degradation decision; recovery objective; recovery decision; recovery attempt; recovery-point reference; restored lineage; achieved-objective measurement; post-recovery conformance evidence; provider resilience descriptor.

Provider/product-specific mechanisms: Envoy outlier/circuit/retry-budget configuration; Temporal Activity retry/heartbeat internals; Kubernetes PDB/eviction; PostgreSQL WAL/base/incremental backup/timeline mechanics; AWS DR topology/playbooks; Litmus fault implementation.

## Convergent patterns
1. Detection, containment and recovery are separate authorities.
2. Retry is a new attempt, not continuation proof, unless the mechanism explicitly provides continuation/checkpoint semantics.
3. Recovery goals and achieved recovery are distinct evidence classes.
4. Recovery can create a new lineage branch and must preserve predecessor history.
5. Provider health is weaker than semantic recovery/conformance.
6. Failover and failback require separate validation.
7. Fault injection generates evidence; it does not confer recovery authority.

## Divergent patterns
Envoy protects call paths using ejection/circuit/load controls; Temporal durably re-schedules application work; Kubernetes constrains disruption under controller semantics; PostgreSQL reconstructs persisted state from ordered recovery material and branches timelines; AWS composes workload-level DR strategies; Litmus introduces controlled faults. Generation 2 must unify their evidence/authority boundaries, not their execution mechanisms.

## Subcapabilities
Failure-domain/blast-radius modeling; failure classification; deadlines/cancellation; retry/idempotency lineage; backpressure/load shedding; circuit/outlier containment; degraded-mode policy; recovery objectives; recovery decision authority; recovery-point admissibility; restore/PITR; failover; failback; checkpoint/restart; corruption handling; disaster recovery; recovery proof; fault-injection evidence; restored-lineage tracking; post-recovery security/data/business conformance.

## Fresh-main comparison
Fresh `main` evidence inspected:
- `packages/deploy/index.ts` has immutable `DeploymentRecord`, explicit succeeded/failed status, health checks and a distinct `DeploymentActivationDecision` with outcomes including `retained-active`, `rejected-no-active` and `stale-active`.
- `DeploymentRegistry.activateCandidate*` preserves the previous active deployment when a candidate fails and separates activation decision identity from deployment identity.
- Repository search for generic `retry`, `idempotency`, `recovery`, `RTO`, `RPO`, `failover`, `restore` and `circuit breaker` contracts returned no direct match in the searched surface. This is not evidence of repository-wide absence; detailed archaeology remains for PLANNING_B.

This supports KEEP for deployment/activation separation and HARDEN/GENERALIZE hypotheses for recovery lineage, retry attempt semantics and post-recovery proof. It does not justify claiming that main lacks capability-specific resilience implementations elsewhere.

## Reconciliation hypotheses
- KEEP distinct deployment record and activation-decision identities.
- HARDEN health/acceptance evidence so `succeeded` cannot be generalized into semantic recovery proof.
- GENERALIZE failure occurrence, retry-attempt lineage, recovery decision/attempt, restored lineage, achieved-objective evidence and post-recovery conformance.
- PROVIDERIZE concrete retries, cancellation, ejection/circuit breaking, load shedding, failover/failback, backup/restore/PITR and chaos mechanisms.
- INTEGRATE recovery authority/evidence with Governance, Observability, Lifecycle, Data, Deployment and Provider planes.
- DO_NOT_BUILD a universal recovery executor or universal exactly-once claim across provider boundaries.

## Repo-validation questions
1. Does any main runtime/action contract persist a semantic operation identity or idempotency key independent from execution attempt identity?
2. Can a timeout/retry path prove predecessor termination, or must overlapping attempts be assumed possible?
3. Where are degraded-mode, load-shed or containment decisions represented, if at all?
4. Are health checks ever reused as business/security/data recovery proof?
5. Is there any persisted recovery-point/admissibility/restored-lineage evidence outside deployment observation?
6. Can environment/provider descriptors declare cancellation, failover/failback and recovery-point limitations?
7. Are destructive recovery and chaos actions separately authorized and audited?
8. Can a provider replacement be proven against the same recovery objectives without changing domain requirements?

## Symbiotic Proof
Generation 2 is symbiotically complete for Security / Resilience / Failure Recovery only if a portable definition can: express resilience/recovery requirements without provider mechanics; bind to two materially different mechanisms; preserve semantic operation identity across retry attempts; demonstrate that timeout does not silently imply predecessor termination; perform governed failover and separately governed failback; restore from a declared recovery point while preserving lineage; measure achieved RTO/RPO against objectives; prove post-recovery data/security/business conformance; replace a provider and re-prove equivalent semantics; execute a controlled fault experiment without gaining production recovery authority; and preserve/export sufficient recovery evidence while the Builder control plane is unavailable.

## Stable findings
- **G2-FINDING-SRFR-11 — Failure Occurrence, Failure-Domain Observation and Blast-Radius Disposition Are Distinct Evidence.** One domain observation may aggregate many occurrences and its scope can evolve; the occurrence must remain immutable while scope/disposition evidence changes.
- **G2-FINDING-SRFR-12 — Retry Attempt Identity Must Be Separate from Semantic Operation Identity, and Timeout Does Not Prove Predecessor Termination.** Temporal-style failure ambiguity makes idempotency/side-effect identity and attempt lineage mandatory around external effects.
- **G2-FINDING-SRFR-13 — Containment, Ejection, Circuit Breaking and Load Shedding Are Protective Realizations, Not Recovery Proof.** Envoy demonstrates that intentionally rejecting/ejecting work can improve system stability while the dependency remains unhealthy.
- **G2-FINDING-SRFR-14 — Recovery-Point Existence Is Separate from Admissibility, Completeness and Restored-Lineage Identity.** PostgreSQL recovery requires a valid dependency/material chain, corruption can halt replay, and successful recovery branches a new timeline.
- **G2-FINDING-SRFR-15 — Failover and Failback Are Independent Governed Transitions with Separate Attempt, Result and Validation Evidence.** A successful failover does not prove safe failback or erase the failed primary lineage.
- **G2-FINDING-SRFR-16 — Recovery Mechanism Completion and Infrastructure Health Do Not Prove Recovery Objectives or Post-Recovery Conformance.** Achieved RTO/RPO and data/security/business invariants require independent measurements and conformance evidence.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-SEMANTIC-OPERATION-RETRY-ATTEMPT-LINEAGE` — CROSS_CUTTING — reusable side-effect identity, predecessor attempt, deadline/cancellation and retry lineage across Workflow, Integration, AI actions and provider calls.
- `G2-CAPABILITY-CANDIDATE-RECOVERY-TRANSITION-DECISION-ATTEMPT-EVIDENCE` — CROSS_CUTTING — generic governed failover/failback/restore decision-attempt-result lineage without owning provider mechanisms.
- `G2-CAPABILITY-CANDIDATE-RECOVERY-OBJECTIVE-ACHIEVEMENT-EVIDENCE` — CROSS_CUTTING — objective revision plus observed RTO/RPO/steady-state/postcondition evidence, reusable across Data, Deployment and Operations.

## Value / risk / priority / next question
Value: VERY HIGH. Risk: VERY HIGH if retry/recovery abstractions imply exactly-once execution, predecessor termination, universal rollback or semantic recovery from infrastructure health alone. Priority: foundational cross-cutting evidence/authority model before target architecture. Next research question: how AI-native delegated actions and operator/self-hosted experiences consume these recovery authorities without silently widening actor/provider authority.