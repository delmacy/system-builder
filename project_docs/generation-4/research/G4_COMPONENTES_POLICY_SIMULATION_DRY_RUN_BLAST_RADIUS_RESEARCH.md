# G4 Componentes — Policy Simulation, Dry-Run Blast Radius & Promotion Preview Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## 1. Research question

How should the G4 Web Desktop / Componentes environment evaluate a candidate promotion policy P3 against current and historical evidence, representative Clients/Workspaces and release populations before activation, while preserving tenant isolation, exposing UNKNOWN/coverage, preventing simulation from acquiring admission authority, and avoiding the false conclusion that a sampled dry run proves fleet-wide safety?

This extends `G4_COMPONENTES_PROMOTION_POLICY_EVOLUTION_HISTORICAL_REPLAY_RESEARCH.md` and the prior Componentes evidence/trust/portability research. It is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or changes to G2/G3.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains optional projection/application research, not navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`.
- `Release != Deployment`; `Release + Environment = Deployment` remains authoritative architecture.
- `Client != Workspace != Desktop != Application != Window`.
- `SIMULATION != ADMISSION`.
- `SIMULATED_PASS != POLICY_ACTIVE`.
- `POLICY_ACTIVE != PROMOTION_AUTHORIZED`.
- `SAMPLED_PASS != FLEET_PASS`.
- `NO_OBSERVED_REGRESSION != PROOF_OF_NO_REGRESSION`.
- `UNKNOWN != SUCCESS`.
- `STALE != CURRENT`.
- `PENDING != EFFECTIVE`.
- `Research candidate != implementation authority`.

## 3. External interaction grammars reviewed

External systems are evidence for interaction/audit grammar, not provider commitments.

### 3.1 Kubernetes validation actions and dry-run

Kubernetes ValidatingAdmissionPolicy separates `Deny`, `Warn` and `Audit` actions. The useful grammar is that the same validation logic can be projected in non-blocking observation modes before it becomes blocking authority. Kubernetes documentation also recommends dry-run when evaluating changes to Pod Security policy so checks execute without applying the policy update.

Extracted grammar:

`candidate rule -> evaluate -> warn/audit/report -> inspect impact -> separately activate blocking behavior`

Not extracted: Kubernetes, CEL, admission webhooks or any deployment/provider choice.

### 3.2 Kyverno Audit and background scans

Kyverno policy reports can evaluate existing resources and report violations in `Audit` mode without blocking them; background scanning can assess resources that predate a policy. This is strong evidence for a shadow-evaluation interaction grammar. Its reports represent current cluster state rather than immutable history, which reinforces the SB requirement that simulation occurrences and historical gate occurrences remain separately retained when auditability requires it.

Extracted grammar:

`candidate policy + existing population -> background evaluation -> report current impact -> human/policy review -> possible later enforcement`

Not extracted: Kyverno or Kubernetes CRDs.

### 3.3 OPA policy testing and decision lineage

OPA separates policy testing from production decisions, while decision logs can preserve queried policy/input/result metadata. The G4 lesson is that simulation should be reproducible against an immutable candidate policy snapshot and immutable input snapshot, rather than a mutable `latest` alias.

### 3.4 Cedar validation

Cedar validation is a separate operation from authorization evaluation and depends on a schema. Cedar explicitly warns that schema changes may invalidate previously validated policies. The useful grammar is that a candidate policy first needs structural/semantic qualification against its declared model before large-scale behavioral simulation is meaningful.

Not extracted: Cedar as policy language or authorization engine.

## 4. Primary finding — simulation is an evidence-producing occurrence, never an authority transition

Candidate model:

```text
PolicySimulationOccurrence
  simulationId
  candidatePolicySnapshotRef
  candidatePolicyDigest
  baselinePolicySnapshotRef?
  simulationMode
  populationDefinitionRef
  populationSnapshotRef
  samplingPlanRef?
  clientScopeRefs[]
  workspaceScopeRefs[]
  evidenceSnapshotRefs[]
  trustProfileRefs[]
  normativeProfileRefs[]
  securityFloorRefs[]
  evaluatorProfileRef
  startedAt
  completedAt?
  resultVector
  coverageVector
  unknownVector
  limitations[]
  authorityDisposition = NONE
```

Hard boundaries:

```text
SIMULATION_RESULT != GATE_DECISION
SIMULATION_COMPLETE != POLICY_QUALIFIED
POLICY_QUALIFIED != POLICY_ACTIVE
POLICY_ACTIVE != RELEASE_PROMOTED
SIMULATION_WINDOW_FOCUSED != SIMULATION_AUTHORITATIVE
```

Simulation may inform a later policy-qualification or activation decision. It cannot itself perform that decision.

## 5. Simulation modes are distinct

`Dry run` is too ambiguous to be one operation. Candidate modes:

```text
STATIC_POLICY_VALIDATION
  candidate policy is checked against schema/normative constraints

HISTORICAL_CORPUS_REPLAY
  P3 is evaluated against retained historical input/evidence snapshots

CURRENT_POPULATION_SHADOW_EVALUATION
  P3 is evaluated against current qualified population state without blocking

REPRESENTATIVE_SAMPLE_SIMULATION
  P3 is evaluated against a declared sample/cohort

POLICY_DIFF_IMPACT_SIMULATION
  P2 and P3 are compared over the same immutable input population

SYNTHETIC_ADVERSARIAL_SIMULATION
  P3 is evaluated against generated/curated boundary and failure cases

PROMOTION_PREVIEW
  a named release/target is evaluated as though P3 applied, without creating admission authority or effect
```

These outputs must not share a generic green/red badge.

## 6. Population identity and coverage are first-class

A simulation result is meaningless without knowing what population it covered.

Candidate population model:

```text
SimulationPopulation
  populationId
  populationKind
  queryOrSelectionDefinition
  immutableSnapshotRef
  eligibleCount
  evaluatedCount
  excludedCount
  unavailableCount
  staleInputCount
  unknownCount
  clientCountAuthorizedForAggregate
  workspaceCountAuthorizedForAggregate
  coverageDimensions[]
```

Hard rules:

```text
EVALUATED_COUNT != ELIGIBLE_COUNT
SAMPLE_SIZE != COVERAGE
HIGH_COVERAGE != REPRESENTATIVE_COVERAGE
REPRESENTATIVE_SAMPLE != COMPLETE_POPULATION
EXCLUDED != PASS
UNAVAILABLE != PASS
STALE_INPUT != CURRENT_INPUT
```

A simulation UI must show denominator and exclusion/UNKNOWN reasons, not only pass percentage.

## 7. Sampling requires an explicit claim boundary

Sampling may be necessary for cost, privacy or scale, but it cannot silently strengthen the claim.

Candidate sampling dimensions include:

- Client/workspace class;
- artifact/application family;
- release age;
- environment/profile;
- trust/evidence origin;
- accessibility/browser-AT profile;
- risk/criticality;
- prior FAIL/UNKNOWN/waiver distribution;
- configuration/composition diversity;
- scale/load envelope.

Rules:

```text
SAMPLED_PASS != UNSAMPLED_PASS
RANDOM_SAMPLE != RISK_REPRESENTATIVE_SAMPLE
NO_FAILURE_IN_SAMPLE != ZERO_FAILURE_RATE
SAMPLING_PLAN_CHANGED != SAME_SIMULATION CLAIM
```

The system should expose what the sample can support, not infer fleet-wide safety from convenience sampling.

## 8. Blast radius is multidimensional

A candidate policy can affect different populations in different ways. A single `affected = N` count is insufficient.

Candidate impact dimensions:

```text
NEWLY_BLOCKED
NEWLY_ALLOWED
UNCHANGED_PASS
UNCHANGED_BLOCKED
PASS_TO_UNKNOWN
UNKNOWN_TO_BLOCKED
UNKNOWN_TO_PASS
WAIVER_NOW_REQUIRED
WAIVER_NO_LONGER_ALLOWED
EVIDENCE_REQUALIFICATION_REQUIRED
TRUST_REQUALIFICATION_REQUIRED
NEW_DIMENSION_NOT_EVALUATED
SECURITY_FLOOR_CONFLICT
PROFILE_INCOMPATIBLE
```

Also track affected `primitive -> compound -> module component -> tool -> application -> window -> desktop -> workspace -> system view` projections without interpreting graph reachability as semantic authority.

```text
REACHABLE_IN_DEPENDENCY_GRAPH != POLICY_MATERIALLY_AFFECTED
AFFECTED_UI_PROJECTION != AFFECTED_RUNTIME
BLAST_RADIUS_COUNT != BLAST_RADIUS_SEVERITY
```

## 9. Baseline comparison is explicit

When comparing P2 to P3, both policies must evaluate the same qualified input snapshot for a direct behavioral delta claim.

```text
P2@INPUT_A vs P3@INPUT_A -> POLICY_DELTA
P2@INPUT_A vs P3@INPUT_B -> POLICY_PLUS_INPUT_DELTA
```

Therefore:

```text
DIFFERENT_RESULT != POLICY_CAUSED_DIFFERENCE
SAME_PASS_RATE != SAME_AFFECTED_SUBJECTS
SAME_PASS_RATE != SAME_GUARANTEE_VECTOR
```

The UI should provide transition matrices and subject-level drill-down rather than only aggregate rates.

## 10. UNKNOWN coverage is a primary output

A candidate policy may add requirements for which existing evidence does not exist. This is not a simulation failure and not a pass.

Candidate UNKNOWN reasons:

```text
EVIDENCE_ABSENT
EVIDENCE_STALE
EVIDENCE_SCOPE_MISMATCH
TRUST_UNRESOLVED
PROFILE_UNRESOLVED
RAW_ARTIFACT_PRUNED
CLIENT_SCOPE_NOT_AUTHORIZED
WORKSPACE_CONTEXT_UNAVAILABLE
EVALUATOR_UNAVAILABLE
DEPENDENCY_CHANGED_MID_RUN
NOT_REPRESENTABLE_BY_HISTORICAL_CORPUS
```

Rules:

```text
UNKNOWN_COVERAGE != POLICY_FAILURE
UNKNOWN_COVERAGE != POLICY_SAFETY
NOT_EVALUATED != PASS
NOT_AUTHORIZED_TO_INSPECT != NO_IMPACT
```

Promotion preview must surface UNKNOWN prominently because a policy that appears stricter may simply be unprovable over the retained corpus.

## 11. Tenant isolation constrains simulation analytics

Cross-Client simulation must preserve the prior cross-tenant evidence rules.

Candidate aggregate outputs may include authorized cohort-level counts, but only when policy permits disclosure and minimum cohort/privacy constraints are met. Subject identities, rare categories, raw fixtures, timing, digests and exact failure fingerprints may themselves leak tenant information.

```text
CAN_EVALUATE_TENANT_LOCALLY != CAN_EXPORT_TENANT_RESULT
CAN_INCLUDE_IN_AGGREGATE != CAN_DRILL_DOWN_CROSS_TENANT
GLOBAL_COUNT != SAFE_TO_DISCLOSE
ZERO_VISIBLE_RESULTS != ZERO_AFFECTED_RESULTS
REDACTED_ROWS != SAFE_DENOMINATOR_DISCLOSURE
```

A fleet operator may receive `authorized visible impact + undisclosable/unknown remainder` rather than a fabricated complete total.

## 12. Delegated access and simulation

Delegated Client access controls what can be inspected and what evidence can be reused; it does not grant policy activation authority.

```text
DELEGATED_VIEW != SIMULATION_ADMIN
SIMULATION_ADMIN != POLICY_ACTIVATOR
POLICY_ACTIVATOR != RELEASE_PROMOTER
CAN_PREVIEW_CLIENT_A != CAN_PREVIEW_CLIENT_B
```

If delegation expires during a long run, already produced internal evidence remains provenance-bound, but subsequent disclosure and drill-down must requalify authorization.

## 13. Simulation snapshot and race semantics

Long-running simulation binds immutable inputs:

```text
SimulationInputSnapshot
  candidatePolicySnapshotRef
  baselinePolicySnapshotRef?
  populationSnapshotRef
  evidenceSnapshotRefs[]
  trustAsOf
  normativeProfileRefs[]
  securityFloorRefs[]
  evaluatorProfileRef
```

If policy, evidence, trust, Client context or security floor changes mid-run, the run does not silently mutate inputs.

```text
WORLD_CHANGED_MID_RUN != SILENT_RESTART
RESULT_FOR_OLD_SNAPSHOT != CURRENT_RESULT
CURRENT_POLICY_CHANGED != SIMULATION_CORRUPTED
```

The result may complete correctly for its snapshot and immediately be `STALE_FOR_CURRENT_DECISION`.

## 14. Candidate simulation lifecycle

```text
DRAFT
→ INPUTS_RESOLVING
→ STRUCTURAL_VALIDATION
→ READY_TO_RUN | BLOCKED_INPUTS
→ QUEUED
→ RUNNING
→ PARTIAL_RESULTS
→ COMPLETED | COMPLETED_WITH_UNKNOWN | FAILED | CANCELLED
→ CURRENT_FOR_SNAPSHOT
→ STALE_FOR_CURRENT_DECISION | ARCHIVED
```

No state transitions to `ACTIVE_POLICY`, `ADMITTED`, `PROMOTED` or `EFFECTIVE`.

Promotion preview lifecycle is separate:

```text
PREVIEW_REQUESTED
→ TARGET_REQUALIFYING
→ SIMULATING
→ PREVIEW_AVAILABLE | PREVIEW_PARTIAL | PREVIEW_UNKNOWN | PREVIEW_FAILED
```

Again, preview has no effect edge.

## 15. Activation requires a separate authority-bearing occurrence

A future policy activation model, if researched/authorized elsewhere, must reference simulation evidence but remain a separate occurrence.

```text
PolicySimulationOccurrence
  -> may inform -> PolicyQualificationDecision
  -> may inform -> PolicyActivationDecision
  -> may affect -> future GateDecisionOccurrences
```

Never:

```text
PolicySimulationOccurrence -> automatic ACTIVE
```

Rules:

```text
SIMULATION_APPROVED_BY_HUMAN != POLICY_ACTIVE
SIMULATION_PASS != ACTIVATION_REQUEST
ACTIVATION_REQUEST != ACTIVATION_EFFECTIVE
```

## 16. Promotion preview is not a hidden deploy plan

Promotion preview may project which requirements would pass/block/unknown for a release and target environment. It must not reserve resources, mutate configuration, deploy artifacts, rotate secrets, or trigger provider effects unless a separately named non-simulation operation is invoked.

```text
PREVIEW != PLAN_APPLY
PREVIEW != RESOURCE_RESERVATION
PREVIEW != SECRET_ROTATION
PREVIEW != PROVIDER_VALIDATION_WITH_SIDE_EFFECTS
```

Any external check with possible side effects must be classified separately and excluded from pure simulation unless explicitly sandboxed and proven effect-free.

## 17. Componentization impact

### primitive / atomic

- `SimulationModeIndicator`
- `SimulationAuthorityIndicator`
- `CoverageIndicator`
- `UnknownCoverageIndicator`
- `BlastRadiusIndicator`
- `SnapshotCurrentnessIndicator`
- `SampleRepresentativenessIndicator`
- `SimulationLimitationIndicator`

### compound

- `SimulationSummary`
- `CoverageVectorSummary`
- `BlastRadiusSummary`
- `PolicyTransitionMatrix`
- `UnknownReasonSummary`
- `SampleDefinitionSummary`
- `PromotionPreviewSummary`

### module component

- `PolicySimulationPanel`
- `BlastRadiusPanel`
- `CoveragePanel`
- `PolicyComparisonPanel`
- `PromotionPreviewPanel`
- `SimulationLimitationsPanel`

### tool

- `PolicySimulationInspector`
- `BlastRadiusExplorer`
- `CoverageInspector`
- `SampleInspector`
- `UnknownCoverageExplorer`
- `PromotionPreviewInspector`
- `SimulationSnapshotInspector`

### application -> window -> desktop -> workspace -> system view

Simulation may be projected through policy/governance/release applications and windows. Window focus, Desktop placement, Workspace restore or fleet-level visibility do not grant activation authority. Restored windows must retain simulation mode, candidate policy identity, population snapshot and authority disposition.

Shared behavior: immutable snapshot identity, typed results, coverage/UNKNOWN, provenance, currentness, keyboard inspection, cancellation and failure disclosure.

Specialized behavior: policy-domain semantics, Client/Workspace disclosure rules, release target, security floor, trust profile and activation authority.

## 18. Focus/selection, restore and recovery

```text
SELECTED_CANDIDATE_POLICY != ACTIVE_POLICY
FOCUSED_SIMULATION_WINDOW != POLICY_AUTHORITY
WINDOW_RESTORED != SIMULATION_CURRENT
SIMULATION_RESTORED != RUN_RESUMED
CANCEL_UI != CANCEL_REMOTE_RUN
```

After refresh/crash, recovery first restores the immutable run identity and snapshot refs. A partial result is labeled partial; missing chunks are not inferred. If the remote run disposition is unknown, display `UNKNOWN`, not failed/success.

## 19. Accessibility and small-screen

The UI must expose textually:

- simulation versus active-policy mode;
- candidate and baseline policy identities;
- population denominator and evaluated/excluded/unknown counts;
- sample definition and representativeness limitations;
- transition categories such as newly blocked/newly allowed;
- authority disposition `NONE`;
- currentness/staleness;
- tenant-scope/redaction limitations.

Charts/heatmaps require table/tree alternatives. Keyboard users must be able to inspect impact groups and drill-down without drag. Small-screen views may stack summaries but cannot hide denominators, UNKNOWN or the fact that the result is non-authoritative.

## 20. Performance and scale

Representative stress shapes:

- 100,000 historical/current subject evaluations;
- 10,000 Workspaces across many Clients with isolation boundaries;
- policy diff adding a new requirement with sparse historical evidence;
- high-fanout primitive/component evidence dependency changes;
- concurrent simulations of multiple candidate policies;
- simulation results with large `UNKNOWN` populations.

Candidate operational techniques: immutable snapshot indexes, incremental/differential evaluation, bounded concurrency, batching, memoization keyed by exact policy/input/trust/profile identity, virtualization and aggregate-first drill-down.

Rules:

```text
CACHE_HIT != CURRENT_INPUT
MEMOIZED_RESULT != AUTHORITY
BATCH_EVALUATION != BATCH_ADMISSION
PARTIAL_STREAM != FINAL_RESULT
HIGH_FANOUT != SILENT_TRUNCATION
PERFORMANCE_DEGRADATION != SEMANTIC_OMISSION
```

A user-visible progress percentage must distinguish processed population from semantically qualified coverage.

## 21. Failure and recovery

Failure classes include:

- candidate policy structurally invalid;
- schema/normative profile mismatch;
- population snapshot unavailable;
- evidence snapshot partially pruned;
- evaluator crash;
- trust service unavailable;
- Client authorization changes mid-run;
- candidate policy superseded mid-run;
- security floor rises mid-run;
- cache corruption/digest mismatch;
- aggregate privacy threshold no longer satisfied;
- simulation worker returns conflicting results for same immutable input.

Rules:

```text
SIMULATION_ERROR != POLICY_FAIL
INPUT_UNAVAILABLE != SUBJECT_PASS
WORKER_DISAGREEMENT != MAJORITY_TRUTH
PARTIAL_RESULT != COMPLETE_RESULT
CANCELLED != FAILED
```

Conflicting evaluator results become qualified disagreement evidence and require reconciliation; they are not majority-voted into truth.

## 22. Adversarial scenarios

1. P3 adds a mandatory requirement absent from 70% of historical evidence; dashboard shows 95% PASS among evaluated subjects while hiding denominator.
2. A random sample misses the only high-criticality Client class affected by P3.
3. P3 simulation PASS button is accidentally wired to policy activation.
4. P2 and P3 are compared against different population snapshots and difference is attributed solely to policy.
5. Client A failure fingerprint appears in a fleet aggregate with cohort size one.
6. Delegated access expires while a cross-Client drill-down is open.
7. Candidate policy changes from revision A to B during a long simulation.
8. Current security floor rises during a simulation bound to the previous floor.
9. Historical raw evidence was pruned; simulation silently treats missing evidence as PASS.
10. A cached P3 result is reused after trust-root revocation.
11. Simulation worker crashes after 60% and UI labels partial pass-rate as final.
12. Two evaluator implementations disagree for the same immutable input.
13. Promotion preview invokes an external provider endpoint that creates a resource as part of validation.
14. Small-screen view hides UNKNOWN and denominator to save space.
15. Browser refresh restores the simulation window under `latest` policy rather than the pinned candidate snapshot.
16. High-fanout impact query truncates after 10,000 subjects without disclosure.
17. Policy appears to have no effect because unauthorized tenant results are omitted and omission is displayed as zero.
18. A sample is representative by Client count but not by configuration/profile diversity.
19. P3 changes UNKNOWN handling only; aggregate pass rate barely changes but a critical population moves from BLOCKED to PASS.
20. Simulation result is current for its snapshot but stale for current admission because evidence changed immediately after completion.

## 23. Proof obligations

1. Prove simulation occurrences have no admission/promotion/deployment authority edge.
2. Prove candidate policy identity is immutable for one simulation run.
3. Prove baseline comparison uses the same qualified input snapshot or labels mixed-input comparison explicitly.
4. Prove every result exposes eligible/evaluated/excluded/unavailable/UNKNOWN denominators.
5. Prove sampled results cannot be presented as full-population results.
6. Prove sample definition and representativeness limitations remain inspectable.
7. Prove missing/stale evidence remains UNKNOWN/NOT_EVALUATED rather than PASS.
8. Prove tenant-local raw evidence/failure identity cannot leak through aggregate/drill-down/timing metadata.
9. Prove delegated visibility cannot become policy activation authority.
10. Prove world changes during a run do not silently mutate the run's input snapshot.
11. Prove completed old-snapshot results can be marked stale without being rewritten.
12. Prove simulation error/failure remains separate from policy subject FAIL.
13. Prove conflicting evaluator results remain disagreement evidence rather than majority truth.
14. Prove promotion preview is side-effect free or explicitly refuses checks whose effect-free behavior cannot be established.
15. Prove policy activation, if later modeled, is a separate authority-bearing occurrence.
16. Prove accessibility exposes simulation mode, denominator, UNKNOWN, limitations and authority without color-only cues.
17. Prove small-screen equivalent operation retains all critical coverage/authority information.
18. Prove high-fanout impact analysis does not silently truncate affected populations.
19. Prove memoization/cache keys bind exact policy, input, trust, profile and floor identities.
20. Prove restore/recovery pins the original simulation identity instead of substituting `latest`.
21. Prove transition matrices preserve subject-level identity for authorized drill-down while preventing cross-tenant disclosure.
22. Prove policy-diff analytics do not infer causal policy impact when input populations differ.

## 24. Maturity and saturation

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

This slice materially closes the immediate gap around safe candidate-policy simulation, dry-run blast-radius analysis, UNKNOWN/coverage semantics and promotion preview. It does not freeze a policy language, evaluator, scheduler, database, analytics engine, privacy mechanism, deployment provider or UI framework.

Saturation is still insufficient for implementation planning. The broader shell/componentization program retains material gaps around tenant-safe derived analytics/recommendations, cross-artifact synthesis, quantitative frontend resource budgets and final Desktop/Application/Window contract consolidation.

## 25. Remaining gaps / next vector

Highest-value next vector:

**tenant-safe evidence-derived analytics/recommendations** — determine when catalog/conformance/policy outcomes may produce reusable guidance across Clients without leaking adoption, failure, topology, workload or rare-event information; research cohort thresholds, provenance, opt-in/contractual scope, differential/privacy-preserving aggregation candidates, recommendation confidence and `GLOBAL_PATTERN != TENANT_TRUTH`.

Secondary vector:

**simulation representativeness and coverage adequacy criteria** — deepen quantitative/structural criteria for deciding when a simulation corpus is adequate for a named claim, especially rare high-risk configurations and new policy dimensions, without inventing statistical certainty from sparse evidence.

## 26. Research-only conclusion

A safe policy preview is useful precisely because it is powerless. It can reveal likely blast radius, missing evidence and changed outcomes before activation, but it must not become a hidden admission path.

Durable rule:

> evaluate candidate policy against immutable, explicitly scoped populations; expose denominator, UNKNOWN and limitations; keep simulation evidence separate from activation authority and operational effect.

`Research candidate != implementation authority` remains in force.
