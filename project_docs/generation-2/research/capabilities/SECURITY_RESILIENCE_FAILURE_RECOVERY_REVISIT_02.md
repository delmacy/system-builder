# Security / Resilience / Failure Recovery — Revisit 02

Status: REVISIT CYCLE 3 — MATERIAL NEW FINDINGS — NOT SATURATED

## Research question
How should Generation 2 prove recoverability and resilience when recovery depends on chains of artifacts, branching lineage, scoped disruption controls and provider-specific retry/DR mechanisms, without converting mechanism success into a false semantic recovery claim?

## Representatives and evidence ledger

1. **PostgreSQL 18 PITR / incremental backup** — current documentation shows recovery depends on a base backup plus required WAL/history; incremental backups add explicit ancestor dependencies and can fail when required summary/history material is missing. PITR creates a new timeline rather than overwriting prior history.
2. **Kubernetes disruption semantics** — PodDisruptionBudgets constrain selected voluntary eviction but do not prevent involuntary failures and do not govern every voluntary disruption. This is evidence that a resilience control has an applicability domain, not a global availability guarantee.
3. **AWS Well-Architected Reliability / DR** — RTO/RPO are business objectives; backups/redundancy are only the start of a DR strategy; strategy must be implemented and tested. Multiple strategies trade cost/complexity against recovery characteristics.
4. **AWS retry with backoff / circuit breaker** — retry is appropriate for transient failures and needs idempotency/backoff; non-transient failures should fail fast or use other containment. Excessive retry can worsen degradation.
5. **NIST CSF 2.0** — Govern, Identify, Protect, Detect, Respond and Recover remain distinct outcome families, reinforcing that recovery authority/evidence should not collapse into prevention/detection controls.

## Architectural extraction

### Recovery material is a dependency closure, not a single artifact
A backup or recovery point is usable only if all required predecessor artifacts, logs, manifests, keys/trust material and provider prerequisites needed to reconstruct the target are present and valid. PostgreSQL incremental backup/PITR makes this concrete: an apparently valid child backup can still be unrecoverable if ancestor/WAL dependencies are missing.

### Recovery creates lineage; it does not erase history
PITR timeline branching demonstrates that restored state should receive explicit new lineage with a pointer to the recovery source/target. Recovery evidence must preserve the abandoned/original history rather than mutating it into the restored state.

### Resilience controls have applicability boundaries
A Kubernetes PDB is not an availability guarantee: it constrains a defined class of voluntary disruptions and cannot prevent involuntary failure or every controller-driven transition. Generation 2 resilience requirements therefore need `applicability_scope` and `uncovered_failure_classes`, not only `enabled=true`.

### Objective, strategy, mechanism and achieved result are different identities
AWS DR guidance separates RTO/RPO objectives from strategy and recommends testing the implementation. Generation 2 should model objective revision, selected strategy class, provider realization and measured achievement separately.

### Retry qualification is evidence-bearing
Retry policy must name eligible failure classes, idempotency/side-effect constraints, backoff/budget and exhaustion disposition. Retry completion is not recovery proof; it is one attempt path whose outcome feeds broader resilience evidence.

## Failure semantics

Distinguish at least:
- recovery material missing/incomplete;
- recovery material corrupt/untrusted;
- recovery chain dependency missing;
- recovery attempt failed before mutation;
- partial restore/replay;
- restore completed but postconditions failed;
- objective missed despite technically successful restore;
- containment policy not applicable to the observed failure class;
- retry unsafe because side-effect/idempotency requirements are unmet;
- provider mechanism unavailable while portable objective remains valid.

`UNKNOWN` is required when evidence cannot establish chain completeness or achieved recovery; absence of proof must not become `RECOVERABLE`.

## Universal primitives

- RecoveryObjectiveRevision
- RecoveryStrategyRequirement
- RecoveryMaterialNode
- RecoveryMaterialDependencyEdge
- RecoveryClosureAssessment
- RecoveryAttempt
- RecoverySourceLineage
- RestoredLineage
- RecoveryPostconditionSet
- RecoveryObjectiveAchievementEvidence
- ResilienceControlApplicability
- FailureClassCoverage
- RetryEligibilityEvidence
- RetryAttempt/Budget/ExhaustionEvidence

## Provider boundaries

Portable System Builder contracts own recovery objectives, semantic postconditions, failure-class coverage requirements, retry eligibility constraints and proof obligations. Provider bindings own WAL/archive mechanics, snapshot APIs, region topology, PDB fields, circuit breaker thresholds, retry implementation and concrete restore/failover commands.

Provider replacement must re-prove closure, applicability and achieved objectives if the realization changes materially.

## Governance / authority

- Detection evidence cannot self-authorize destructive restore/failover.
- Automated recovery is valid only inside pre-delegated scope and explicit blast-radius constraints.
- Station/Role boundaries may narrow which recovery/operational actions can be invoked but cannot weaken Enterprise recovery/security requirements.
- A personal/AGWS automation can request or surface recovery status but must not gain restore/failover authority unless explicitly delegated.

## Observability / provenance

Evidence should bind: subject identity/revision, environment/provider revision, failure occurrence, applicability scope, recovery objective, recovery closure digest, source recovery material graph, attempt/result, restored lineage, measured RTO/RPO or capability-specific objective, and postcondition/conformance result.

## Product-specific mechanism vs universal primitive

| Product mechanism | Universal primitive |
|---|---|
| PostgreSQL base/incremental backup + WAL/history | recovery material dependency graph + closure assessment |
| PostgreSQL timeline after PITR | restored lineage branch |
| Kubernetes PDB | scoped resilience-control realization |
| AWS backup/restore, pilot light, warm standby, active-active | recovery strategy realization class |
| AWS retry/backoff | retry eligibility + bounded attempt policy |
| AWS circuit breaker | containment realization with probe/recovery state |

## Convergent patterns

1. Recovery requires complete prerequisite material and configuration, not merely a backup label.
2. Restored state needs explicit lineage distinct from the failed/original runtime.
3. Resilience controls cover specific failure/disruption classes and have blind spots.
4. Recovery objective, strategy, mechanism and achieved evidence are distinct.
5. Retry is qualified containment/recovery behavior, not a universal retry-on-error rule.
6. Recovery must be tested against semantic postconditions and objectives.

## SB comparison

The earlier fresh-main evidence remains authoritative: deployment activation and deployment observation already separate candidate deployment outcome from activation/retention decisions. This revisit adds no new repository-wide claims. It strengthens a future **GENERALIZE + PROVIDERIZE** hypothesis for recovery closure, lineage and applicability evidence while preserving full implementation archaeology for PLANNING_B.

## Reconciliation hypotheses

- **KEEP** existing separation between deployment result, observation and activation decision where fresh-main archaeology confirms it.
- **HARDEN** resilience claims with applicability/failure-class coverage and explicit UNKNOWN semantics.
- **GENERALIZE** recovery material closure, restored lineage and objective-achievement evidence.
- **PROVIDERIZE** concrete backup/PITR/failover/retry/circuit/disruption mechanisms.
- **INTEGRATE** closure/evidence with Artifact, Data, Secrets, Deployment, Observability and Governance planes.
- **DO_NOT_BUILD** a `backup_exists => recoverable` shortcut or universal availability/recovery boolean.

## Symbiotic Proof

One portable system should bind to two materially different recovery providers. For each realization it must: enumerate a recovery-material closure; detect a deliberately missing dependency as NOT_RECOVERABLE/UNKNOWN rather than success; perform a recovery that creates new lineage; measure objective achievement; validate semantic postconditions; expose uncovered failure classes for each resilience control; and continue to inspect/recover with deployment-local closure when the Builder is unavailable.

## Stable findings

### G2-FINDING-SRFR-17 — Recoverability Depends on Recovery-Material Dependency Closure, Not Backup Artifact Existence
A recovery point is admissible only when every required predecessor/log/manifest/trust dependency is available and valid.

### G2-FINDING-SRFR-18 — Recovery Produces a New Explicit Lineage Branch and Must Preserve the Source History
PITR-style recovery demonstrates that restored state is not a mutation that erases predecessor lineage.

### G2-FINDING-SRFR-19 — Resilience Controls Require Applicability Scope and Uncovered Failure-Class Evidence
A control such as a disruption budget can constrain one failure class while offering no protection against others; `enabled` is not an availability guarantee.

### G2-FINDING-SRFR-20 — Recovery Objective, Strategy, Provider Mechanism and Achieved Objective Are Distinct Identities and Evidence
RTO/RPO or capability-specific objectives belong to business/product requirements; provider strategy and measured result remain separate.

### G2-FINDING-SRFR-21 — Retry Eligibility Must Bind Failure Class, Idempotency/Side-Effect Semantics and Budget Before an Attempt Is Authorized
Blind retry can amplify failure or duplicate effects and therefore requires qualified evidence.

### G2-FINDING-SRFR-22 — Recovery Completion Without Semantic Postcondition Validation Is Not Recovery Proof
Infrastructure start/restore success can coexist with violated data, security, authorization or business invariants.

## Capability candidates

### G2-CAPABILITY-CANDIDATE-RECOVERY-MATERIAL-DEPENDENCY-CLOSURE — CROSS_CUTTING / CANDIDATE
Evidence: PostgreSQL full/incremental backup + WAL/history chain and existing artifact/dependency-closure findings. Promotion condition: Data/Artifact/Secrets synthesis confirms a shared closure primitive reusable across recovery providers.

### G2-CAPABILITY-CANDIDATE-RESILIENCE-CONTROL-APPLICABILITY-EVIDENCE — CROSS_CUTTING / CANDIDATE
Evidence: Kubernetes disruption semantics plus provider-specific retry/circuit/DR scope. Promotion condition: Governance/Product Proof confirms a reusable applicability + uncovered-failure-class evidence model.

### G2-CAPABILITY-CANDIDATE-RESTORED-LINEAGE-BRANCH-EVIDENCE — CROSS_CUTTING / CANDIDATE
Evidence: PostgreSQL recovery timelines and prior migration/recovery lineage findings. Promotion condition: Data/Lifecycle/Deployment reconciliation confirms one reusable branch-lineage primitive.

## Saturation
Material new findings produced; `consecutive_no_material_finding=0`. Capability remains **NOT SATURATED**.

## Value / risk / priority / next question
Value: VERY HIGH for credible anti-lock-in and self-hosted autonomy. Risk: VERY HIGH if recovery is inferred from provider completion or backup existence. Priority: foundational. Next research question after rotation: AI-native Engineering / Agents / Approvals or Developer/Operator surfaces should consume recovery authority/evidence without widening delegated authority.