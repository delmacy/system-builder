# Security / Resilience / Failure Recovery — Generation 2 Research Dossier

Status: FIRST DEEP PASS — NOT SATURATED

## Research question
What universal primitives should Generation 2 own so security risk, runtime resilience, containment and recovery can be expressed, evidenced and governed without pretending that provider-specific retry, backup, failover or disaster-recovery mechanisms share one execution model?

## Representatives
| Representative | Coverage | Contribution |
|---|---|---|
| NIST Cybersecurity Framework 2.0 | DEEP | Separates Govern, Identify, Protect, Detect, Respond and Recover as lifecycle outcomes rather than one security control plane. |
| NIST SSDF / SP 800-218 family | DEEP | Secure-development practices and vulnerability-risk reduction are lifecycle practices, not runtime recovery semantics. |
| AWS Well-Architected Reliability | DEEP | RTO/RPO, DR strategy, recovery testing, drift management, automation and failure-management evidence. |
| Kubernetes disruption semantics | DEEP | Distinguishes voluntary/involuntary disruption, disruption budgets and graceful termination; budgets constrain some disruptions but do not prevent all failures. |
| AWS retry/circuit-breaker guidance | DEEP | Retry is suitable for transient failure and needs idempotency/backoff; circuit breaking bounds repeated downstream failure and differs from retry. |
| PostgreSQL 18 PITR | DEEP | Base backup + WAL continuity, restore target, recovery timelines, archive failure semantics and concrete restore prerequisites. |

## Evidence/source ledger
1. NIST CSF 2.0, published 2024-02-26: high-level outcomes across Govern/Identify/Protect/Detect/Respond/Recover; intentionally non-prescriptive about implementation.
2. NIST SSDF family: secure development reduces released vulnerabilities, impact and recurrence; it is not a runtime recovery protocol.
3. AWS Well-Architected REL13: RTO and RPO are workload objectives; strategy must be selected and tested against them; backups/redundancy alone are only the start of DR.
4. Kubernetes Disruptions: PodDisruptionBudget bounds voluntary disruption but cannot prevent involuntary disruption; graceful termination and workload-specific update failure behavior remain distinct.
5. AWS Retry with Backoff / Circuit Breaker: retry targets transient error, must consider idempotency and amplification; circuit breaker fails fast after repeated failures and probes recovery separately.
6. PostgreSQL 18 continuous archiving/PITR: recovery depends on base backup plus continuous WAL history; archive failures retry, missing/corrupt recovery input changes recovery outcome, and successful restore creates explicit timeline lineage.

## Source of truth
Universal SB truth should be declarative policy/requirement plus immutable execution/evidence records. Provider/runtime mechanisms remain authoritative for concrete retry, failover, backup, restore or containment execution. A framework mapping such as NIST CSF is governance/reference evidence, never runtime authority.

## Identity
Keep distinct identities for: security requirement/control revision; resilience requirement/revision; failure occurrence; retry/circuit decision; recovery objective; recovery plan revision; backup/recovery-point artifact; recovery attempt; restored runtime/data lineage; fault-injection experiment; recovery verification evidence.

## Lifecycle
Normal -> degraded/failing -> containment decision -> recovery decision -> recovery attempt -> verification -> restored/degraded/failed outcome. Prevention and secure-development controls can reduce probability/impact but do not erase runtime recovery lifecycle. Recovery plans evolve independently from deployment revision and must be bound explicitly when exercised.

## Versioning
Security/resilience policy revisions, provider mechanism revisions and recovery-plan revisions must be pin-able. A successful historical recovery proof does not automatically prove a later deployment/configuration revision. Recovery evidence therefore needs subject revision/environment/provider bindings.

## Failure semantics
- transient failure can justify bounded retry only when operation semantics allow it;
- permanent/non-transient failure should fail fast or route to containment/recovery;
- retry amplification is itself a failure mode;
- circuit open, degraded service and unavailable service are distinct states;
- backup creation success does not imply restore success;
- archive/replication lag changes achievable RPO;
- recovery may be restartable, rollback-capable, restore-only or roll-forward-only;
- unavailable/corrupt recovery evidence must fail closed for claims of recoverability.

## Extensibility
Providers may implement retry, circuit breaking, failover, replication, snapshot, backup, restore, chaos/fault injection and security controls. Extension points must declare supported semantics and evidence, not merely a capability boolean.

## Provider boundaries
Portable requirements include failure classes, retry/idempotency constraints, recovery objectives, retention requirements, protection requirements and proof obligations. Provider bindings own locators, topology, mechanism-specific knobs and credentials. Provider replacement requires new compatibility/recovery evidence when semantics materially change.

## Governance
Recovery authority is distinct from detection/observation evidence. Destructive restore/failover/failback operations require explicit actor/policy authority and audit provenance. RTO/RPO derive from product/business criticality; providers implement strategies but do not define business tolerance. Security framework mappings inform governance but do not authorize mutation.

## Observability
Evidence should correlate failure, deployment/release/environment, affected capability/provider, timestamps, retry/circuit decisions, recovery point, recovery attempt, resulting lineage, RTO/RPO measurement and verification result. Missing telemetry is UNKNOWN, never healthy/recovered by default.

## Portability and lock-in
A portable definition should retain objectives and semantic constraints while provider bindings choose mechanism. Encoding AWS regions, Kubernetes PDBs or PostgreSQL WAL locations into the universal IR would create lock-in. Conversely, abstracting away provider-specific recovery prerequisites would create false portability.

## Product-specific mechanisms vs universal primitives
Universal: failure classification; resilience/security requirement; recovery objective; retry/idempotency constraint; recovery-plan reference; recovery attempt/evidence; recovery-point reference; lineage; proof status; provider capability descriptor.
Provider/product-specific: PDB; multi-region topology; circuit-breaker implementation; WAL/base backup/PITR; snapshot APIs; cloud DR orchestration; concrete chaos tooling.

## Convergent patterns
- prevention, detection, containment and recovery are separate lifecycle authorities;
- recovery objectives are requirements, not mechanisms;
- recovery must be exercised and measured;
- evidence is bound to concrete subject/environment/revision;
- idempotency is a prerequisite for safe retries, not an automatic property;
- backup existence is weaker than verified restore capability;
- degradation and bounded containment are valid outcomes, not only success/failure.

## Divergent patterns
Kubernetes constrains availability during selected disruptions; retry/circuit breakers protect call paths; PostgreSQL reconstructs persisted state from ordered recovery material; NIST frameworks describe outcomes and governance; AWS DR composes workload-wide strategies. These must not be collapsed into one universal recovery executor.

## Subcapabilities
Threat/control requirements; failure classification; retry/idempotency policy; circuit/containment policy; graceful degradation; redundancy/failover requirement; backup/recovery-point management; restore/PITR; RTO/RPO objectives; disaster-recovery planning; recovery verification; fault/chaos experiment evidence; recovery authority/audit; restored-lineage tracking.

## Fresh-main comparison
Evidence inspected in fresh `main`:
- `packages/deploy/index.ts` models immutable `DeploymentRecord`, explicit succeeded/failed status, health checks and activation decisions that can retain the previously active deployment when a candidate fails.
- `packages/observe/index.ts` creates content-addressed `DeploymentObservation` correlated to deployment/release/environment with health checks and provenance.
This is meaningful evidence for deployment failure/activation and observation boundaries. It does not evidence a universal retry/circuit-breaker model, backup/restore/PITR contract, RTO/RPO policy, fault-injection model or recovery orchestrator.

## Reconciliation hypotheses
- KEEP deployment activation/retention and observation evidence separation.
- HARDEN failure classification and evidence quality/unknown semantics.
- GENERALIZE resilience requirements, recovery objectives, recovery attempt/evidence and restored lineage as provider-neutral contracts.
- PROVIDERIZE concrete retries, circuit breakers, backup, restore, failover and chaos mechanisms.
- INTEGRATE security governance and recovery proof with provenance/audit/observability planes.
- DO_NOT_BUILD a universal recovery executor that hides incompatible provider/data semantics.

## Repo-validation questions
1. Where does main currently own retry/idempotency semantics, if anywhere?
2. Are deployment acceptance failures distinct from post-activation runtime failures across contracts/tests?
3. Is there any persisted recovery-point or restore evidence contract outside deploy/observe?
4. Can environment/provider bindings declare resilience capabilities and limitations?
5. Are destructive operator actions independently authorized/audited?
6. Is there any place where failed/missing health evidence is accidentally interpreted as success?

## Symbiotic Proof
Generation 2 is symbiotically complete for this capability only if one portable system definition can declare recovery/security requirements, bind to at least two materially different provider mechanisms, replace one provider without changing logical requirements, export independent recovery evidence, prove a tested recovery objective, preserve runtime autonomy during Builder unavailability, and accurately report unsupported semantics rather than emulate them falsely.

## Stable findings
- G2-FINDING-SRFR-01 — Prevention, Detection, Containment and Recovery Are Distinct Authorities and Evidence Domains.
- G2-FINDING-SRFR-02 — Recovery Objective, Recovery Strategy and Recovery Mechanism Are Distinct Contracts.
- G2-FINDING-SRFR-03 — Backup/Replica Existence Does Not Prove Restorability or Achievement of RPO/RTO.
- G2-FINDING-SRFR-04 — Retry Requires Qualified Failure Semantics and Idempotency; Retry Is Not Universal Recovery.
- G2-FINDING-SRFR-05 — Circuit Breaking, Degradation and Failover Are Distinct Containment/Continuity Semantics.
- G2-FINDING-SRFR-06 — Recovery Attempt and Restored-Lineage Identity Must Be Preserved as First-Class Evidence.
- G2-FINDING-SRFR-07 — Recovery Authority Must Be Separate from Observation Evidence and Provider Mechanism Authority.
- G2-FINDING-SRFR-08 — Resilience Claims Must Be Revision-, Environment- and Provider-Bound and Re-Proved After Material Change.
- G2-FINDING-SRFR-09 — Fault/Chaos Testing Is Evidence Generation, Not Production Mutation Authority or Proof by Itself.
- G2-FINDING-SRFR-10 — Runtime Autonomy Requires Deployment-Local Recovery Capability and Exportable Recovery Evidence Without Builder Dependence.

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-RECOVERY-OBJECTIVE-PROOF` — CROSS_CUTTING — common RTO/RPO/recovery-verification evidence across deployment, data and operations.
- `G2-CAPABILITY-CANDIDATE-RECOVERY-POINT-LINEAGE` — CROSS_CUTTING — backup/snapshot/WAL/replica recovery-point identity and resulting restored lineage.
- `G2-CAPABILITY-CANDIDATE-RESILIENCE-POLICY-NEGOTIATION` — CORE — matching portable resilience requirements against provider-offered semantics without false emulation.

## Value / risk / priority / next question
Value: VERY HIGH. Risk: VERY HIGH if universalization hides mechanism-specific failure semantics. Priority: foundational cross-cutting contract before target architecture. Next question for revisit: which resilience primitives are already implicit in SB runtime/action execution and which belong exclusively to provider bindings after repository archaeology?
