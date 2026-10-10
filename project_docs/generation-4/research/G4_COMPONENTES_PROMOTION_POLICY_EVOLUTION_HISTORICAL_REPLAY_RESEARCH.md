# G4 Componentes — Promotion Policy Evolution, Historical Replay & Counterfactual Gate Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## 1. Research question

How should the G4 Web Desktop / Componentes evidence environment preserve why a historical release or promotion decision was admissible under policy P1 while allowing the same artifact/evidence set to be evaluated under P2, without rewriting history, laundering waivers into PASS, silently applying current trust rules to historical decisions, or confusing counterfactual evaluation with actual promotion authority?

This extends:

- `G4_COMPONENTES_CATALOG_PLAYGROUND_CONFORMANCE_RESEARCH.md`;
- `G4_COMPONENTES_CONFORMANCE_EVIDENCE_INVALIDATION_RESEARCH.md`;
- `G4_COMPONENTES_CONFORMANCE_EVIDENCE_PROVENANCE_RETENTION_RESEARCH.md`;
- `G4_COMPONENTES_IMPORTED_EVIDENCE_TRUST_RELEASE_GATING_RESEARCH.md`;
- `G4_COMPONENTES_CROSS_TENANT_EVIDENCE_PORTABILITY_ISOLATION_RESEARCH.md`.

It is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or changes to G2/G3.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application, not the navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`.
- `Release != Deployment`; `Release + Environment = Deployment` remains authoritative architecture.
- `Client != Workspace != Desktop != Application != Window`.
- `Promotion gate != runtime lifecycle`.
- `Gate decision != deployment effect`.
- `Historical admissibility != current admissibility`.
- `Historical truth != current policy reinterpretation`.
- `Waiver != PASS`.
- `UNKNOWN != SUCCESS`.
- `STALE != CURRENT`.
- `PENDING != EFFECTIVE`.
- `Research candidate != implementation authority`.

## 3. External interaction grammars reviewed

External systems are evidence for interaction/audit grammar, not provider commitments.

### 3.1 Open Policy Agent decision logs and bundles

OPA decision logs bind a decision event to the query/input, result, timestamp and bundle metadata including bundle revision. OPA bundles can carry explicit revisions, while policy/data can be updated independently of application redeployment. This supports a durable separation between:

`decision occurrence -> exact policy revision -> exact input/evidence view -> result`

rather than storing only the result or evaluating history through the latest policy.

OPA also supports observing what a policy *would* have decided, which is useful grammar for SB counterfactual replay. The important boundary is that a shadow/counterfactual result does not alter the historical effect.

### 3.2 SLSA Verification Summary Attestation

SLSA VSA explicitly identifies the policy against which a subject was verified and recommends a digest for the exact policy version. It may also identify the input attestations used for verification. This supports making the policy snapshot and evidence-set identity first-class dependencies of a gate decision rather than implicit ambient configuration.

### 3.3 SLSA provenance and immutable revisions

SLSA emphasizes immutable references for source/provenance. The useful grammar for G4 is that reproducible historical evaluation requires immutable identity for subject, policy, evidence inputs and verifier semantics. Mutable aliases such as `latest` are insufficient historical identities.

### 3.4 in-toto layouts and replay risk

in-toto layouts identify authorized functionaries/steps and include expiration. Its published security audit discusses replay of an older, still-unexpired layout and recommends version/counter mechanisms to detect missing newer layouts. The G4 lesson is not to adopt in-toto, but to distinguish:

- reproducing a historical policy for audit;
- attempting to use that historical policy as current admission authority.

Historical resolvability must never become anti-rollback bypass.

Extracted grammar:

`immutable subject + immutable policy/profile + qualified evidence snapshot + verifier semantics + decision context -> historical decision record`

and independently:

`same historical inputs + chosen policy snapshot -> counterfactual evaluation -> comparison only`

Not extracted: OPA, Rego, SLSA, in-toto, a policy language, a verifier implementation or a release-provider choice.

## 4. Primary finding — gate decisions are immutable occurrences, not mutable badges

A promotion/release gate result should be represented as an occurrence with immutable lineage.

Candidate model:

```text
PromotionDecisionOccurrence
  decisionId
  subjectRef
  subjectDigest
  clientId?
  workspaceId?
  revisionRef
  environmentProfileRef?
  gateDefinitionRef
  policySnapshotRef
  policyDigest
  normativeProfileRefs[]
  trustProfileRefs[]
  verifierProfileRef
  evidenceSnapshotRef
  requirementEvaluations[]
  waiverRefs[]
  result
  decidedAt
  actorOrEngineProvenance
  effectRef?
```

The decision record is append-only historical evidence. A later policy does not mutate it.

Hard invariants:

```text
HISTORICAL_PASS_UNDER_P1 != PASS_UNDER_P2
P2_EXISTS != P1_DECISION_REWRITTEN
CURRENT_POLICY != HISTORICAL_POLICY
DECISION_RECORD != CURRENT_GATE_STATUS
DECISION_REPLAY != DECISION_OCCURRENCE
```

## 5. Policy snapshots need immutable semantic identity

A gate policy is not adequately identified by a human label such as `production`, `strict`, `v2` or `latest`.

Candidate identity:

```text
PromotionPolicySnapshot
  policyId
  immutableRevision
  digest
  schemaVersion
  normativeSemanticsRef
  requirementSet[]
  evidenceOriginRules[]
  independenceRules[]
  freshnessRules[]
  trustRules[]
  unknownHandling
  waiverRules
  securityFloorRefs[]
  effectiveFrom?
  retiredAt?
  supersedesRefs[]
```

Distinctions:

```text
POLICY_NAME_EQUAL != POLICY_SEMANTICS_EQUAL
TEXT_EQUAL != DEPENDENCY_SEMANTICS_EQUAL
POLICY_DIGEST_EQUAL != TRUST_PROFILE_EQUAL
POLICY_RESOLVABLE != POLICY_CURRENTLY_ADMISSIBLE
POLICY_RETIRED != HISTORICAL_POLICY_DELETED
```

If a normative dependency changes without changing policy text, a new qualified policy snapshot/evaluation context is still required where that dependency is material.

## 6. Historical replay has modes

`Replay` is too ambiguous to be one operation. Candidate modes:

```text
FORENSIC_RECONSTRUCTION
  reconstruct what was known/evaluated at decision time

DETERMINISTIC_REEVALUATION
  execute the historical policy snapshot against the historical evidence snapshot

CURRENT_POLICY_COUNTERFACTUAL
  evaluate historical subject/evidence under current policy

POLICY_DIFF_COUNTERFACTUAL
  compare P1 and P2 over the same qualified input snapshot

CURRENT_EVIDENCE_REASSESSMENT
  evaluate the same subject under current policy/current evidence
```

These must not share one result label.

```text
RECONSTRUCTED != REEXECUTED
REEXECUTED != REPRODUCIBLE
COUNTERFACTUAL_PASS != HISTORICAL_PASS
COUNTERFACTUAL_FAIL != HISTORICAL_DECISION_INVALID
CURRENT_REASSESSMENT != HISTORICAL_REPLAY
```

A replay may degrade to `PARTIAL` or `CLAIM_ONLY` when raw evidence/toolchain has been pruned, while the historical decision occurrence remains intact.

## 7. Evaluation time is explicit

Historical replay needs at least three time concepts:

```text
OCCURRENCE_TIME
  when the original decision occurred

AS_OF_TIME
  the time horizon whose trust/revocation/currentness facts are being reconstructed

EVALUATION_TIME
  when replay/counterfactual analysis is performed
```

This prevents the current world from silently contaminating historical reconstruction.

Examples:

- a certificate trusted at occurrence time may be revoked today;
- a producer may have been compromised after the decision;
- a browser/AT profile may be retired today but historically valid;
- a security floor may have risen after release.

```text
REVOKED_TODAY != PROVEN_REVOKED_AT_OCCURRENCE
TRUSTED_AT_OCCURRENCE != TRUSTED_TODAY
CURRENT_SECURITY_FLOOR != HISTORICAL_SECURITY_FLOOR
```

For current admission, current floors win. For historical explanation, the historical floor must remain resolvable.

## 8. Waiver lineage is first-class and never converted into PASS

Candidate waiver record:

```text
GateWaiverOccurrence
  waiverId
  requirementId
  decisionScope
  subjectScope
  policySnapshotRef
  rationale
  riskClassification
  approverAuthorityRef
  issuedAt
  validFrom
  expiresAt?
  supersedesRef?
  revokedAt?
  compensatingControls[]
```

A waiver changes the gate disposition under a named policy; it does not change the underlying evidence result.

```text
WAIVED_FAIL != PASS
WAIVED_UNKNOWN != KNOWN
WAIVER_VALID_THEN != WAIVER_VALID_NOW
NEW_POLICY != OLD_WAIVER_AUTO_PORTABLE
WAIVER_EXPIRED != HISTORICAL_DECISION_REWRITTEN
```

P2 may require re-approval, prohibit the old waiver class or introduce a mandatory dimension that P1 did not know.

## 9. Policy evolution is a semantic diff, not only a textual diff

Candidate change classes:

```text
REQUIREMENT_ADDED
REQUIREMENT_REMOVED
REQUIREMENT_STRENGTHENED
REQUIREMENT_WEAKENED
UNKNOWN_HANDLING_CHANGED
EVIDENCE_ORIGIN_RULE_CHANGED
INDEPENDENCE_RULE_CHANGED
FRESHNESS_HORIZON_CHANGED
TRUST_ROOT_CHANGED
NORMATIVE_PROFILE_CHANGED
SECURITY_FLOOR_CHANGED
WAIVER_RULE_CHANGED
SCOPE_CHANGED
VERIFIER_SEMANTICS_CHANGED
```

Policy comparison should report affected proof dimensions and historical populations without declaring one policy globally "better" merely because it is newer.

```text
NEWER_POLICY != STRICTER_IN_ALL_DIMENSIONS
MORE_REQUIREMENTS != STRONGER_FOR_EVERY_CLAIM
TEXT_DIFF != SEMANTIC_GATE_DIFF
SAME_PASS_RATE != SAME_POLICY
```

## 10. Changed mandatory dimensions

A common evolution case is P1 requiring dimensions `{A,B,C}` and P2 requiring `{A,B,C,D}`.

Historical P1 PASS remains historically PASS if validly decided. Under P2, missing D is not automatically FAIL; it is typically `NOT_EVALUATED`/`UNKNOWN` until evidence exists, according to P2's rule.

```text
NOT_REQUIRED_UNDER_P1 != PASSED_UNDER_P1
MISSING_P2_EVIDENCE != HISTORICAL_P1_FAILURE
NOT_EVALUATED != FAIL
UNKNOWN != PASS
```

The UI must make this distinction visible instead of painting the old release red as though it violated a requirement that did not yet exist.

## 11. Trust changes and imported evidence

Imported evidence may have been admissible under P1 and inadmissible under P2 because:

- producer trust changed;
- independence requirement increased;
- a trust root was retired;
- provenance requirements strengthened;
- destination Client/Workspace policy changed;
- portability/disclosure qualification changed.

Historical record keeps the original trust qualification and its as-of context. Current re-evaluation uses current trust policy.

```text
IMPORTED_EVIDENCE_ACCEPTED_THEN != ACCEPTED_NOW
PRODUCER_COMPROMISED_LATER != HISTORICAL_CLAIM_AUTOMATICALLY_FALSE
HISTORICAL_AUTHENTICITY != CURRENT_ADMISSIBILITY
```

A known compromise with evidence proving the historical artifact itself was forged/corrupted is a separate finding and may trigger remediation; it still does not justify silently editing the old decision record.

## 12. Promotion effect is independent of gate evaluation

A gate PASS may authorize an attempted promotion, but promotion/deployment has its own lifecycle.

```text
GATE_PASS != PROMOTION_REQUESTED
PROMOTION_REQUESTED != PROMOTION_EFFECTIVE
PROMOTION_EFFECTIVE != RUNTIME_HEALTHY
HISTORICAL_GATE_REPLAY != REDEPLOY
COUNTERFACTUAL_PASS != PROMOTION_AUTHORITY
```

Candidate effect linkage:

```text
PromotionDecisionOccurrence
  -> AdmissionIntent?
  -> PromotionEffectOccurrence?
  -> Deployment/Release lineage
```

This preserves the existing architecture where release and deployment are distinct.

## 13. Historical explanation versus current status

The Componentes / release UI needs at least two independent projections:

```text
Historical decision:
  PASSED under P1 at T1 with waiver W1

Current assessment:
  BLOCKED under P2 at T2 because requirement D is UNKNOWN
```

Neither projection replaces the other.

Candidate labels:

```text
HISTORICAL_DECISION
CURRENT_REASSESSMENT
COUNTERFACTUAL_RESULT
POLICY_DIFF_IMPACT
```

Avoid one generic `Status` badge.

## 14. Counterfactual evaluation contract

A counterfactual must declare exactly what is held constant and what changes.

Candidate model:

```text
CounterfactualEvaluation
  evaluationId
  subjectRef
  baseDecisionRef?
  policySnapshotRef
  evidenceSnapshotRef
  trustAsOf
  normativeProfiles[]
  verifierProfileRef
  fixedDimensions[]
  substitutedDimensions[]
  unavailableInputs[]
  resultVector
  limitations[]
  evaluatedAt
```

Examples:

- same subject + same historical evidence + P2;
- same subject + current evidence + P2;
- same subject + historical policy + corrected verifier semantics;
- same evidence + changed trust-as-of horizon.

`COUNTERFACTUAL_WITH_CHANGED_INPUTS` must never be presented as deterministic replay of the original occurrence.

## 15. Reproducibility levels

Candidate replay disposition:

```text
FULLY_REPRODUCIBLE
SEMANTICALLY_REPRODUCIBLE
PARTIALLY_REPRODUCIBLE
CLAIM_RECONSTRUCTABLE_ONLY
NON_REPRODUCIBLE
```

Reasons for degradation include pruned raw artifacts, retired verifier/toolchain, unavailable external dependency snapshots, incomplete environment fingerprint or historical secret erasure.

```text
HISTORICAL_DECISION_RETAINED != FULL_REPLAY_AVAILABLE
DIGEST_RETAINED != EXECUTION_REPRODUCIBLE
TOOLCHAIN_UNAVAILABLE != DECISION_NEVER_HAPPENED
```

Retention/compaction must preserve enough lineage to state the replay limitation honestly.

## 16. Policy rollback and anti-rollback

Historical replay requires retaining P1, but retaining P1 must not make P1 admissible for new decisions after P2 raises a security floor.

```text
POLICY_ARCHIVED != POLICY_SELECTABLE_FOR_NEW_ADMISSION
HISTORICAL_REPLAY_PERMISSION != NEW_ADMISSION_PERMISSION
ROLLBACK_FOR_DEBUG != ROLLBACK_FOR_AUTHORITY
POLICY_RESOLVABLE != POLICY_ACTIVE
```

This is the most important security boundary of the slice: auditability must not become downgrade capability.

## 17. Componentization impact

### primitive / atomic

- `PolicySnapshotIndicator`
- `HistoricalDecisionIndicator`
- `CurrentAssessmentIndicator`
- `ReplayDispositionIndicator`
- `CounterfactualIndicator`
- `WaiverLineageIndicator`
- `PolicyDiffImpactIndicator`

### compound

- `HistoricalGateSummary`
- `CurrentGateAssessmentSummary`
- `PolicyComparisonSummary`
- `WaiverLineageSummary`
- `ReplayLimitationSummary`
- `CounterfactualResultSummary`

### module component

- `GateDecisionHistoryPanel`
- `PolicyEvolutionPanel`
- `HistoricalReplayPanel`
- `WaiverHistoryPanel`
- `CounterfactualComparisonPanel`

### tool

- `PromotionDecisionInspector`
- `PolicySnapshotInspector`
- `PolicySemanticDiffInspector`
- `HistoricalReplayInspector`
- `CounterfactualGateEvaluator`
- `WaiverLineageInspector`
- `GateImpactExplorer`

### application -> window -> desktop -> workspace -> system view

Applications/windows may project historical/current/counterfactual state, but policy authority remains with the named gate/policy domain. Desktop/workspace restore must preserve which evaluation mode was open; restoring a historical replay window must not silently switch it to current policy.

Shared behavior: immutable subject/evidence/policy references, currentness, typed result vectors, provenance, keyboard inspection, replay limitations.

Specialized behavior: release policy, environment policy, Client/Workspace trust, waiver authority, regulatory profile, security floor and deployment-effect ownership.

## 18. State/lifecycle findings

Decision occurrence lifecycle:

```text
EVALUATING
→ DECIDED_PASS | DECIDED_BLOCKED | DECIDED_FAIL | DECIDED_UNKNOWN
→ HISTORICAL
```

The historical occurrence is immutable except for appended annotations/corrections that do not rewrite original fields.

Policy lifecycle:

```text
DRAFT
→ QUALIFIED
→ ACTIVE
→ SUPERSEDED
→ RETIRED
→ ARCHIVED_RESOLVABLE
```

Replay lifecycle:

```text
REQUESTED
→ DEPENDENCIES_RESOLVING
→ REPLAYABLE | PARTIALLY_REPLAYABLE | NON_REPLAYABLE
→ EVALUATING
→ RESULT_AVAILABLE
```

Counterfactual lifecycle is independent and never transitions a historical decision.

## 19. Focus/selection, windows and recovery

The shell invariants remain applicable:

- `SELECTED != FOCUSED`;
- focused replay window does not become gate authority;
- closing/minimizing replay UI does not cancel a remote/background evaluation unless explicitly cancelable;
- browser tab is not an SB tab;
- restoring a window after refresh/crash must restore its `evaluationMode`, policy snapshot and subject context before showing a result as current.

```text
WINDOW_RESTORED != REPLAY_RESULT_CURRENT
FOCUSED_POLICY != ACTIVE_POLICY
SELECTED_HISTORICAL_RELEASE != PROMOTION_TARGET
```

If policy/evidence dependencies changed while the window was suspended, the UI marks the projection stale and offers explicit re-evaluation rather than silently substituting P2.

## 20. Accessibility and responsive/small-screen behavior

Historical/current/counterfactual distinctions must not rely on color, position or timeline graphics alone.

Minimum accessible representation includes:

- subject/release identity;
- policy identity/revision;
- decision time and evaluation mode;
- result vector;
- waiver presence and underlying unmet requirement;
- evidence/trust currentness;
- replay limitations;
- whether the result has any admission authority.

Policy diff graphs/timelines require table/tree alternatives. Keyboard users must be able to inspect each changed requirement, old/new rule and impacted evidence without drag. Small-screen projection may stack comparison cards but must retain P1/P2 identity and never collapse `historical PASS` and `current BLOCKED` into one badge.

## 21. Performance and scale

Expected stress shapes:

- thousands of historical decisions across many releases;
- P2 semantic diff evaluated against tens of thousands of prior decision records;
- trust-root retirement affecting high-fanout imported evidence;
- one policy change adding a mandatory dimension across many components/apps/workspaces;
- multiple Clients with distinct current policies evaluating the same global artifact.

Use immutable indexes, precomputed typed impact edges, batching, virtualization and incremental comparison. Never mutate old records for query convenience.

```text
INDEXED_HISTORY != REWRITTEN_HISTORY
CACHED_COUNTERFACTUAL != CURRENT_POLICY_AUTHORITY
BATCH_REPLAY != BATCH_PROMOTION
HIGH_FANOUT != SILENT_TRUNCATION
```

Impact views preserve exact authorized counts and drill-down; cross-tenant isolation rules from the previous slice remain in force.

## 22. Failure/recovery

Failure classes:

- historical policy snapshot missing;
- policy digest mismatch;
- evidence snapshot partially compacted;
- verifier semantics/toolchain retired;
- trust-as-of data unavailable;
- waiver authority record missing;
- current policy changes during a long counterfactual run;
- Client/Workspace switch during evaluation;
- imported evidence becomes revoked mid-run;
- security floor rises during current reassessment;
- replay service crashes after partial result generation.

Rules:

```text
MISSING_REPLAY_INPUT != HISTORICAL_FAIL
REPLAY_ERROR != ORIGINAL_DECISION_ERROR
CURRENT_POLICY_CHANGED_MID_RUN != SILENTLY_RESTART_UNDER_NEW_POLICY
PARTIAL_COUNTERFACTUAL != FULL_RESULT
```

Long evaluations bind an input snapshot; if dependencies change, the produced result identifies that snapshot and may immediately be `STALE_FOR_CURRENT_USE` without becoming historically false.

## 23. Adversarial scenarios

1. Release R passed P1; P2 adds a new mandatory accessibility dimension with no historical evidence.
2. P1 allowed a waiver for UNKNOWN; P2 prohibits waiving that requirement.
3. Imported evidence producer was trusted at T1 and revoked at T2.
4. Policy label remains `production`, but its semantic dependency changed.
5. P1 raw evidence was pruned while claim ledger and digests remain.
6. Current evaluator accidentally loads `latest` policy while UI says historical replay P1.
7. Counterfactual P2 PASS is mistaken for authorization to promote.
8. Historical P1 FAIL is fixed later; UI rewrites old decision to PASS.
9. Historical PASS used a waiver; compact UI hides the waiver and displays green PASS only.
10. Security floor rises; operator attempts to select archived P1 for a new release.
11. P2 changes only UNKNOWN handling; pass-rate remains similar but semantic outcome differs for one critical case.
12. Waiver approver authority was valid at T1 but is revoked today.
13. Same artifact is evaluated under different Client policies.
14. Counterfactual run starts under P2 revision A and P2 revision B becomes active before completion.
15. Historical trust snapshot cannot be reconstructed because an external trust feed was not retained.
16. Replay is semantically reproducible but not byte-for-byte because old toolchain is unavailable.
17. Small-screen UI merges historical and current status into one unlabeled icon.
18. Policy-diff impact over 100,000 decisions silently truncates affected results.
19. Browser refresh restores replay window but substitutes current evidence without disclosure.
20. A current FAIL caused by P2 is incorrectly interpreted as proof that deployment under P1 was unauthorized at T1.

## 24. Proof obligations

1. Prove every historical gate decision binds an immutable policy snapshot, subject and evidence snapshot identity.
2. Prove P2 cannot mutate the stored P1 decision occurrence.
3. Prove historical replay never grants new promotion/deployment authority.
4. Prove archived/retired policy remains resolvable for audit while being unavailable for unauthorized new admission.
5. Prove waiver lineage preserves the underlying FAIL/UNKNOWN/NOT_EVALUATED state rather than converting it to PASS.
6. Prove added P2 requirements distinguish `not required under P1` from `passed under P1`.
7. Prove current trust revocation does not silently rewrite historical trust-as-of facts.
8. Prove current admission uses current trust/security floors even when historical evidence remains resolvable.
9. Prove deterministic replay uses the exact historical policy/evidence/verifier semantic identities or reports degraded reproducibility.
10. Prove counterfactual evaluation declares every substituted/fixed dimension.
11. Prove counterfactual PASS/FAIL cannot be mistaken for the historical decision occurrence.
12. Prove policy semantic diff covers dependency/trust/normative/waiver changes, not only text diff.
13. Prove long-running evaluation remains bound to one immutable input snapshot and exposes staleness if the world changes.
14. Prove release/promotion effect lifecycle remains separate from gate-decision lifecycle.
15. Prove accessibility exposes historical/current/counterfactual mode, policy revision, waiver and authority without color-only cues.
16. Prove small-screen views retain policy identity and do not collapse distinct result domains.
17. Prove high-fanout impact analysis preserves exact authorized counts/drill-down without cross-tenant leakage.
18. Prove replay failure or missing historical dependency becomes a replay limitation/UNKNOWN, not fabricated historical FAIL.
19. Prove historical corrections append provenance rather than overwrite original decision fields.
20. Prove `policy resolvable` and `policy admissible for new decision` remain independently testable states.

## 25. Maturity and saturation

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

This slice materially closes the immediate gap around promotion-policy evolution, historical gate explanation, waiver lineage and counterfactual replay. It does not freeze a policy language, decision engine, attestation provider, release implementation, database, retention provider or UI framework.

Saturation is not yet sufficient for implementation planning. The shell/componentization program still has material gaps around policy simulation safety, large-scale impact navigation, tenant-safe derived analytics and final cross-artifact synthesis.

## 26. Remaining gaps / next vector

Highest-value next vector:

**policy simulation / dry-run blast-radius and promotion preview** — determine how a candidate P3 can be evaluated against historical/current evidence and representative Workspaces without gaining admission authority, how affected releases/Clients are summarized without cross-tenant leakage, how UNKNOWN coverage is surfaced, and how simulation results remain distinct from actual policy activation.

Secondary vector:

**tenant-safe evidence-derived analytics/recommendations** — determine when aggregate catalog learnings can improve component guidance without leaking adoption, failure, topology or workload information across Clients, including minimum cohort/privacy thresholds and explicit opt-in/contractual boundaries.

## 27. Research-only conclusion

Historical auditability and current safety require opposite-looking but compatible properties: old policy semantics must remain resolvable enough to explain what happened, while old policy authority must not remain reusable for new admissions after policy/security evolution.

The durable rule is:

> preserve historical decisions as immutable occurrences; evaluate new policy as a new qualified view; never rewrite history and never let replay become rollback authority.

`Research candidate != implementation authority` remains in force.
