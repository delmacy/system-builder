# G4 Componentes — Recommendation Model Qualification, Claim Semantics & Safe Feedback Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## 1. Research question

How should the G4 Web Desktop / Componentes environment qualify, version, evaluate, explain and retire recommendation producers — heuristic, rule-derived, statistical, ML/AI or expert-authored — while distinguishing causal from correlational claims, preventing cross-Client leakage and feedback loops, preserving historical explainability, and ensuring that confidence or acceptance never becomes semantic or mutation authority?

This extends `G4_COMPONENTES_TENANT_SAFE_EVIDENCE_ANALYTICS_RECOMMENDATIONS_RESEARCH.md`. It is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or changes to G2/G3.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application candidate, not a navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`.
- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `RECOMMENDATION != AUTHORITY`.
- `MODEL_CONFIDENCE != AUTHORITY`.
- `MODEL_SCORE != PROBABILITY_OF_CAUSAL_BENEFIT`.
- `CORRELATION != CAUSATION`.
- `PREDICTION != PRESCRIPTION`.
- `ACCEPTED != CORRECT`.
- `DISMISSED != INCORRECT`.
- `NO_RESPONSE != NEGATIVE_SIGNAL`.
- `MODEL_CURRENT != CLIENT_CONTEXT_CURRENT`.
- `OFFLINE_EVALUATION_PASS != LIVE_SUITABILITY`.
- `Research candidate != implementation authority`.

## 3. External grammars reviewed

External sources are evidence for interaction/evaluation grammar, not provider commitments.

### 3.1 NIST AI RMF / TEVV

NIST AI RMF organizes AI risk work around Govern, Map, Measure and Manage and explicitly targets design, development, deployment, use and evaluation. The NIST AI Resource Center further frames testing, evaluation, verification and validation (TEVV) as lifecycle activities rather than a one-time accuracy check.

Extracted grammar:

`intended purpose -> context/risk map -> qualified measurement -> deployment/use controls -> monitoring/reassessment`.

Not extracted: a decision that every recommendation producer must be ML, or that one generic AI score can establish trustworthiness.

### 3.2 Model Cards

Model Cards research emphasizes intended uses, evaluation procedures, performance across relevant conditions and explicit limitations. The useful G4 lesson is that a recommendation producer needs a qualified use envelope and evidence profile, not merely a model/version identifier.

Extracted grammar:

`producer identity + intended use + evaluation slices + limitations + out-of-scope conditions`.

### 3.3 Production ML monitoring and feedback loops

Google's Rules of ML explicitly separates training/serving behavior, recommends measuring training-serving skew, calls out freshness requirements, and warns that model outputs can create feedback loops that change future observations. Production guidance also recommends validating a new model against the previous model and monitoring inputs that move outside the training distribution.

Extracted grammar:

`offline qualification != serving equivalence`; `model output may alter future evidence`; `freshness/distribution shift is a first-class qualification concern`.

## 4. Primary finding — recommendation producer is a qualified, versioned evidence producer

A recommendation producer is not a magic `modelId` and not an authority object.

Candidate model:

```text
RecommendationProducerRevision
  producerId
  producerKind
  revision
  immutableArtifactDigest?
  ruleOrPromptRevision?
  featureSchemaRevision?
  trainingOrAuthoringCorpusRef?
  intendedUseProfileRef
  prohibitedUseProfileRef
  targetClaimClasses[]
  targetScopeClasses[]
  evaluationProfileRef
  privacyProfileRef
  trustProfileRef
  freshnessProfileRef
  limitations[]
  provenanceRef
  qualifiedAt?
  retiredAt?
  authorityDisposition = NONE
```

Candidate producer kinds:

```text
DETERMINISTIC_RULE
HEURISTIC
EXPERT_AUTHORED
STATISTICAL_ESTIMATOR
PREDICTIVE_MODEL
CAUSAL_ESTIMATOR
GENERATIVE_AI
HYBRID_ENSEMBLE
```

The kind is not a quality ranking. A deterministic rule may be stronger for one bounded claim than a sophisticated model, while a model may discover patterns a rule cannot.

```text
MORE_COMPLEX_MODEL != MORE_TRUSTWORTHY
AI_GENERATED != LESS_OR_MORE_AUTHORITATIVE
EXPERT_AUTHORED != CURRENTLY_CORRECT
DETERMINISTIC != SEMANTICALLY_VALID
```

## 5. Claim semantics must be explicit before evaluation

A recommendation should state what type of proposition it is making.

Candidate claim classes:

```text
DESCRIPTIVE
  "this pattern occurred in the qualified corpus"

PREDICTIVE
  "under the named profile, outcome Y is estimated for context X"

CORRELATIONAL
  "X and Y co-vary in the qualified evidence"

CAUSAL
  "intervening on X is estimated to change Y under declared assumptions"

RULE_DERIVED
  "policy/rule R maps facts F to recommendation Q"

EXPERT_NORMATIVE
  "a named expert/governance source recommends Q"

GENERATIVE_SYNTHESIS
  "a model synthesized Q from declared sources/context"
```

Hard boundaries:

```text
CORRELATIONAL_CLAIM != CAUSAL_CLAIM
PREDICTIVE_ACCURACY != INTERVENTION_EFFECT
RULE_MATCH != CAUSAL_BENEFIT
EXPERT_OPINION != EMPIRICAL_EFFECT
GENERATIVE_EXPLANATION != PROVENANCE_OF_FACT
```

A UI phrase such as `this will reduce failures by 20%` requires materially stronger evidence than `workspaces with this configuration showed 20% fewer failures in this cohort`.

## 6. Confidence is multidimensional

One scalar confidence number is insufficient and can be actively misleading.

Candidate qualification vector:

```text
producerQualification
sourceEvidenceQuality
populationCoverage
contextApplicability
calibrationEvidence
stabilityEvidence
causalIdentificationStrength?
privacyQualification
freshness
explanationCompleteness
unknownVector
```

Rules:

```text
HIGH_MODEL_SCORE != HIGH_EVIDENCE_QUALITY
HIGH_ACCURACY != CALIBRATED_CONFIDENCE
HIGH_CONFIDENCE != LOCAL_APPLICABILITY
LOCAL_APPLICABILITY != AUTHORITY
```

If the producer emits a probability, the UI must distinguish model probability from system confidence in the recommendation's applicability and from any causal-effect estimate.

## 7. Qualification is producer-revision and use-case scoped

Candidate qualification lifecycle:

```text
DRAFT
 -> STRUCTURALLY_VALIDATED
 -> OFFLINE_EVALUATED
 -> SLICE_EVALUATED
 -> PRIVACY_QUALIFIED
 -> SHADOW_QUALIFIED?
 -> QUALIFIED_FOR_NAMED_USE
 -> MONITORED
 -> DEGRADED | SUSPENDED | RETIRED
```

There is intentionally no transition from `QUALIFIED_FOR_NAMED_USE` to mutation authority.

A producer may be qualified for accessibility triage but not infrastructure remediation; for one application family but not another; for desktop contexts but not small-screen; for suggestion generation but not ranking.

```text
QUALIFIED_ONCE != QUALIFIED_FOR_ALL_USES
QUALIFIED_FOR_A != QUALIFIED_FOR_B
MODEL_REVISION_SAME != EVALUATION_PROFILE_SAME
MODEL_CURRENT != EVALUATION_CURRENT
```

## 8. Evaluation must resist cross-Client leakage

Offline evaluation can itself leak information if train/test partitions mix near-duplicate Client/Workspace evidence or if the same tenant appears in both sides through related revisions.

Candidate partition dimensions:

```text
byClient
byWorkspace
bySystemFamily
byRevisionLineage
byTime
byEnvironmentProfile
byRareFailureFamily
```

Research rule: evaluation split strategy follows the generalization claim. A claim about unseen Clients requires Client-held-out evidence; a temporal claim requires forward-time evidence; a revision-generalization claim must avoid revision-family leakage.

```text
RANDOM_ROW_SPLIT != TENANT_GENERALIZATION_PROOF
SAME_WORKSPACE_DIFFERENT_REVISION != INDEPENDENT_SAMPLE
TRAINING_CORPUS_DEIDENTIFIED != EVALUATION_LEAK_FREE
```

Cross-Client evaluation outputs remain subject to the tenant-safe disclosure rules already researched.

## 9. Distribution shift and applicability

Recommendation applicability needs an explicit comparison between the target context and the producer's qualified envelope.

Candidate dispositions:

```text
IN_PROFILE
NEAR_PROFILE
OUT_OF_PROFILE
PROFILE_UNKNOWN
PROFILE_STALE
```

Possible dimensions include application/component family, revision, browser/AT/device, Workspace composition, environment, workload class, policy/trust profile, locale and interaction mode.

```text
MODEL_AVAILABLE != TARGET_IN_PROFILE
SIMILAR_FEATURE_VECTOR != SEMANTICALLY_EQUIVALENT_CONTEXT
NO_DRIFT_ALERT != PROOF_OF_NO_DRIFT
```

Out-of-profile may still permit a clearly marked exploratory suggestion, but cannot silently inherit the qualification claim of in-profile recommendations.

## 10. Historical explainability binds exact producer and context

Every emitted recommendation occurrence should retain enough lineage to reconstruct what generated it without requiring that the old producer remain active forever.

Candidate occurrence:

```text
RecommendationOccurrence
  recommendationId
  producerRevisionRef
  claimClass
  sourceAnalyticsRefs[]
  sourceEvidenceSnapshotRefs[]
  targetContextSnapshotRef
  applicabilityAssessmentRef
  outputSnapshotRef
  explanationSnapshotRef
  confidenceVector
  limitations[]
  generatedAt
  authorityDisposition = NONE
```

Hard boundaries:

```text
LATEST_MODEL != HISTORICAL_MODEL
REGENERATED_EXPLANATION != HISTORICAL_EXPLANATION
MODEL_RETIRED != HISTORY_ERASED
HISTORICALLY_EXPLAINABLE != CURRENTLY_ADMISSIBLE
```

A rollback from producer M2 to M1 creates a new serving/currentness occurrence; it does not rewrite recommendations previously generated by M2.

## 11. Feedback is observational evidence, not labels by default

Recommendation interaction events are confounded by presentation, position, wording, user role, workload, timing and authority constraints.

Candidate feedback classes:

```text
PRESENTED
OPENED
DISMISSED
DEFERRED
ACCEPTED_FOR_REVIEW
AUTHORIZED_AS_CHANGE
APPLIED
EFFECT_VERIFIED
BENEFIT_MEASURED
HARM_OR_REGRESSION_OBSERVED
ROLLED_BACK
```

They are not synonyms.

```text
CLICK != ACCEPTANCE
ACCEPTANCE != AUTHORIZATION
AUTHORIZATION != EFFECT
EFFECT != BENEFIT
DISMISSAL != NEGATIVE_LABEL
NO_CLICK != NEGATIVE_LABEL
```

The strongest product-learning signal may occur only after separately verified effect and outcome observation, and even then causal attribution remains a separate question.

## 12. Feedback loops require explicit containment

Showing a recommendation changes what users see and therefore changes future evidence. Ranking recommendations by prior acceptance can create self-reinforcing popularity loops.

Candidate lineage:

```text
producerRevision
 -> recommendationOccurrence
 -> presentationPolicyRevision
 -> userInteractionEvidence
 -> separatelyAuthorizedChange?
 -> effectEvidence?
 -> outcomeEvidence?
 -> feedbackQualification
 -> eligibleTrainingEvidence?
```

Rules:

```text
MODEL_INFLUENCED_DATA != NATURAL_BASELINE
POSITION_EFFECT != RECOMMENDATION_QUALITY
POPULAR != BENEFICIAL
SELF_REINFORCING_ACCEPTANCE != INDEPENDENT_VALIDATION
```

Future learning research should preserve exposure/presentation provenance so model-caused observations are not mistaken for independent evidence.

## 13. Safe feedback reuse

Feedback reuse needs purpose and consent/governance qualification independent from visibility of the recommendation itself.

Candidate dispositions:

```text
LOCAL_ONLY
AGGREGATE_ELIGIBLE
EVALUATION_ELIGIBLE
TRAINING_ELIGIBLE
NON_EXPORTABLE
RETENTION_EXPIRED
PURPOSE_MISMATCH
UNKNOWN
```

A Client-local acceptance event cannot become global training data merely because identifiers were removed.

```text
FEEDBACK_VISIBLE_TO_BUILDER != TRAINING_ELIGIBLE
AGGREGATE_ELIGIBLE != RAW_EXPORTABLE
TRAINING_ELIGIBLE_FOR_M1 != ELIGIBLE_FOR_NEW_PURPOSE
```

Contribution bounding and rare-event disclosure protections remain applicable.

## 14. Recommendation ensembles and disagreement

Multiple producers may emit recommendations for the same target. Agreement is useful evidence but not majority truth.

Candidate comparison dimensions:

```text
claimClass
scope/applicability
sourceIndependence
producerIndependence
sharedTrainingData
sharedRules/prompts
confidenceVector
contraindications
expectedBenefitClaim
riskClaim
```

```text
TWO_MODELS_AGREE != TWO_INDEPENDENT_PROOFS
MODEL_DISAGREEMENT != MAJORITY_VOTE
ENSEMBLE_SCORE != SEMANTIC_AUTHORITY
```

A deterministic policy-derived recommendation may conflict with a statistical optimization suggestion; the conflict should remain visible rather than averaged into a synthetic answer.

## 15. Componentization impact

Candidate `primitive/atomic` elements:

- `ProducerKindIndicator`
- `ProducerRevisionIndicator`
- `ClaimClassIndicator`
- `QualificationDispositionIndicator`
- `ApplicabilityProfileIndicator`
- `DriftIndicator`
- `FeedbackEligibilityIndicator`
- `RecommendationAuthorityIndicator`

Candidate compounds:

- `ProducerQualificationSummary`
- `ClaimSemanticsSummary`
- `ConfidenceVectorSummary`
- `ApplicabilityAndDriftSummary`
- `FeedbackLineageSummary`
- `ProducerDisagreementSummary`

Candidate tools:

- `RecommendationProducerRegistry`
- `ProducerQualificationInspector`
- `ClaimSemanticsInspector`
- `RecommendationEvaluationInspector`
- `ApplicabilityDriftInspector`
- `FeedbackLineageInspector`
- `FeedbackReuseInspector`
- `ProducerComparisonInspector`

Higher composition:

```text
primitive
 -> compound
 -> module component
 -> recommendation/evaluation tool
 -> Componentes application/window
 -> Desktop Sphere projection
 -> Workspace-qualified recommendation
 -> system-view aggregate
```

`composedOf` / `usedBy` remain dependency/projection edges, not authority edges.

## 16. Shell, state and lifecycle findings

- Builder Home may show fleet-level producer health only through tenant-safe aggregates.
- Client context may show Client-local applicability, feedback and outcome evidence.
- Workspace context may show recommendation-specific context mismatch/drift without making the recommendation globally invalid.
- Inspector should expose producer revision, claim class, applicability, confidence vector, limitations and authority=`NONE`.
- Status/Activity must distinguish producer evaluation, recommendation generation and actual product/runtime effects.
- Client/Workspace switch must clear or requalify target context, explanations, feedback controls and cached recommendations.
- A producer can be suspended while historical recommendations remain inspectable.

```text
PRODUCER_SUSPENDED != HISTORICAL_RECOMMENDATION_DELETED
RECOMMENDATION_WINDOW_OPEN != RECOMMENDATION_CURRENT
RECOMMENDATION_FOCUSED != TARGET_AUTHORIZED
```

## 17. Accessibility and small-screen obligations

Recommendation UI must expose textually:

- producer kind/revision;
- claim class (`correlational`, `causal`, `rule-derived`, etc.);
- intended use and applicability disposition;
- confidence/coverage/UNKNOWN without relying on color;
- limitations and contraindications;
- whether feedback may be reused and for what purpose;
- authority=`NONE`;
- historical/current distinction.

Graphs comparing models, slices or drift require table/tree equivalents. Keyboard-only users must be able to inspect lineage, compare producers, dismiss/defer and route a recommendation to review without drag. Small-screen projection may collapse detail but cannot hide claim class, applicability, UNKNOWN or authority.

## 18. Performance and scale findings

Candidate envelopes include thousands of producer revisions, millions of recommendation occurrences, high-cardinality evaluation slices and large feedback streams.

Admissible techniques include incremental metrics, precomputed slice summaries, bounded caches, background evaluation and virtualization, provided that:

```text
CACHED_QUALIFICATION != CURRENT_QUALIFICATION
AGGREGATED_METRIC != ALL_SLICES_PASS
DROPPED_SLICE != NO_FAILURE
APPROXIMATE_DRIFT != EXACT_EQUIVALENCE
```

Rare critical slices and UNKNOWN populations cannot disappear to meet UI or compute budgets.

## 19. Failure/recovery findings

Candidate dispositions:

```text
PRODUCER_UNAVAILABLE
PRODUCER_QUALIFICATION_STALE
EVALUATION_INCOMPLETE
APPLICABILITY_UNKNOWN
DRIFT_DETECTED
FEEDBACK_PIPELINE_PARTIAL
FEEDBACK_PURPOSE_BLOCKED
HISTORICAL_PRODUCER_UNRESOLVABLE
EXPLANATION_UNAVAILABLE
```

If the producer fails, absence of new recommendations is not evidence that no recommendation applies. If qualification or applicability cannot be resolved, the UI must expose UNKNOWN/BLOCKED rather than silently reuse a previous recommendation as current.

## 20. Adversarial scenarios

1. A model with high aggregate accuracy fails on the one application family targeted by a recommendation.
2. Random row split leaks the same Client into train and test and exaggerates generalization.
3. Revisions A and B of the same Workspace appear on opposite sides of an evaluation split.
4. A correlational finding is rendered as `this change will reduce failures`.
5. A causal estimator is applied outside the population/assumptions under which it was identified.
6. A high model score is displayed as `95% chance this recommendation is beneficial` without calibration evidence.
7. Producer M2 replaces M1 while an old M1 recommendation remains open.
8. M2 is rolled back; the UI regenerates an old M2 explanation using M1.
9. A recommendation is accepted because it was placed first; acceptance becomes a positive training label.
10. Dismissal caused by lack of user authority is treated as a negative quality label.
11. No-response during an incident is treated as rejection.
12. A recommendation changes configuration, then outcome improvement is attributed causally without counterfactual evidence.
13. One Client supplies most feedback and dominates global retraining.
14. Rare harmful outcome is dropped by aggregation while acceptance rate rises.
15. Client switch leaves previous Client feedback controls attached to a recommendation.
16. Delegated access expires while feedback lineage is open.
17. Producer A and B agree because both were trained on the same corpus; UI calls them independent corroboration.
18. Rule-derived safety recommendation conflicts with optimization model; ensemble averages them away.
19. Drift detector is unavailable and system labels target `IN_PROFILE`.
20. Feedback purpose changes from product evaluation to model training without requalification.
21. A producer remains byte-identical while normative/evaluation profile changes.
22. Small-screen UI hides `correlational` label and shows only the recommendation action.

## 21. Proof obligations

Before future implementation planning, research/conformance must be able to prove at least:

1. every recommendation occurrence binds an exact producer revision and target-context snapshot;
2. producer kind is explicit and never implies authority;
3. every recommendation declares a claim class;
4. correlational claims cannot be silently rendered as causal claims;
5. causal claims name assumptions/scope and degrade when applicability cannot be established;
6. scalar model score cannot substitute for qualification/applicability/confidence vectors;
7. evaluation partition strategy matches the claimed generalization boundary;
8. Client/Workspace/revision leakage is detectable in evaluation design;
9. historical explanations remain bound to historical producer/output rather than regenerated by latest;
10. producer rollback/retirement does not rewrite historical recommendation lineage;
11. presentation/exposure provenance is retained where feedback may influence future learning;
12. accept/dismiss/no-response are not automatically converted to correctness labels;
13. training eligibility is independently qualified from collection/visibility;
14. contribution bounding prevents one Client from silently dominating cross-Client learning;
15. rare harmful outcomes remain discoverable locally even when global disclosure is suppressed;
16. producer disagreement remains representable without majority-vote authority;
17. qualification currentness and target applicability currentness remain separate;
18. Client/Workspace switch requalifies recommendation and feedback state;
19. producer/evaluation failure results in explicit UNKNOWN/BLOCKED/STALE dispositions;
20. accessibility exposes claim class, applicability, limitations, UNKNOWN and authority textually;
21. small-screen mode preserves the same semantic safety labels;
22. no recommendation/feedback lifecycle transition directly mutates product/runtime state;
23. `MODEL_CONFIDENCE != AUTHORITY` is preserved through all higher compositions;
24. component catalog fixtures can exercise model revision, drift, feedback-loop and disagreement scenarios deterministically.

## 22. Maturity / saturation

Disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

This slice materially closes the gap between tenant-safe recommendation presentation and qualification of the recommendation producer itself. It does not close the broader Web Desktop program. In particular, model/heuristic lifecycle now exposes a next-order shell problem: how recommendation attention is scheduled among competing windows/tools without ranking becoming semantic priority or producing manipulative feedback loops.

## 23. Next research vector

Highest-value next vector:

**attention/notification orchestration for recommendations and shell activity** — research priority/urgency/severity/interruptibility, deduplication, snooze, acknowledgement, cross-window routing, taskbar/status/activity integration, accessibility and quiet-mode behavior while preserving:

```text
RANKED_HIGH != SEMANTIC_PRIORITY
URGENT_UI != BUSINESS_AUTHORITY
NOTIFIED != ACKNOWLEDGED
ACKNOWLEDGED != RESOLVED
SNOOZED != DISMISSED
HIDDEN != ABSENT
MODEL_SCORE != INTERRUPTION_RIGHT
```

This remains research-only and must not advance into implementation planning while material shell/componentization gaps remain.
