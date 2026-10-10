# G4 Componentes — Tenant-Safe Evidence-Derived Analytics & Recommendations Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## 1. Research question

How may the G4 Web Desktop / Componentes environment learn reusable product patterns from conformance, policy-simulation, recovery, accessibility, performance and failure evidence across Clients/Workspaces without disclosing tenant adoption, topology, workload, rare failures or identifiable operational facts; without converting analytics into semantic authority; and without allowing recommendations to silently mutate configuration, policy, release or runtime state?

This extends the evidence provenance/retention, imported-evidence trust, cross-tenant portability and policy-simulation research. It is documentary P&D only. It does not authorize implementation, WBS, Work Packages, Sprints, TASKs, migrations, provider adoption or changes to G2/G3.

Primary hierarchy remains a research candidate:

`Builder Home/Factory -> Client -> Workspace -> Desktop Sphere -> Application -> Window -> View/Tab/Tool`.

3D remains an optional projection/application candidate, not a navigation foundation.

## 2. Repository boundaries preserved

- `Builder != Runtime`.
- `Client != Workspace != Desktop != Application != Window`.
- `Module != Capability != Application`.
- `GLOBAL_PATTERN != TENANT_TRUTH`.
- `ANALYTIC_CORRELATION != CAUSATION`.
- `RECOMMENDATION != AUTHORITY`.
- `RECOMMENDED != ADMISSIBLE`.
- `ACCEPTED_RECOMMENDATION != EFFECTIVE_CHANGE`.
- `AGGREGATED != ANONYMOUS`.
- `DE-IDENTIFIED != NON-REIDENTIFIABLE`.
- `ABSENT_FROM_ANALYTICS != ABSENT_IN_TENANT`.
- `UNKNOWN != SUCCESS`.
- `STALE != CURRENT`.
- `Research candidate != implementation authority`.

## 3. External grammars reviewed

External systems and standards are evidence for privacy/isolation grammar, not provider commitments.

### 3.1 NIST de-identification and privacy risk

NIST IR 8053 explicitly notes that de-identification can reduce privacy risk while de-identified datasets may still sometimes be re-identified. NIST SP 800-188 further treats de-identification as a governed process and discusses formal privacy approaches such as differential privacy. The useful G4 lesson is that removing Client names or hashing identifiers does not make cross-tenant analytics automatically safe.

Extracted grammar:

`source facts -> purpose/scope qualification -> privacy transformation -> disclosure-risk qualification -> bounded analytic output`

Not extracted: any mandated privacy algorithm or numeric privacy budget.

### 3.2 Differential privacy as evidence for bounded aggregate disclosure

NIST SP 800-226 describes differential privacy as a mathematical framework for quantifying privacy loss when an entity's data participates in a dataset, while warning about practical hazards in implementations. This supports a G4 research distinction between ordinary aggregation and formally bounded disclosure mechanisms.

Extracted grammar:

`aggregate query != zero privacy cost`; repeated/linked disclosures may require explicit accounting.

Not extracted: a decision that G4 must use differential privacy.

### 3.3 Multitenant telemetry/isolation

Microsoft's multitenant Application Insights guidance explicitly presents multiple telemetry isolation models, including per-tenant resources for stronger isolation and shared resources with different trade-offs. Azure multitenancy guidance also warns that shared infrastructure can create data-isolation and noisy-neighbor concerns. The useful G4 lesson is that a shared analytics plane is not automatically a shared disclosure plane.

Extracted grammar:

`shared computation/storage != shared visibility`; isolation requirements remain explicit per output and audience.

## 4. Primary finding — analytics is a derived projection with a named disclosure boundary

Candidate model:

```text
EvidenceAnalyticsOccurrence
  analyticsId
  analyticDefinitionRef
  analyticDefinitionRevision
  purposeRef
  sourcePopulationSnapshotRef
  sourceEvidenceRefs[]
  sourceClientClassRefs[]
  sourceWorkspaceClassRefs[]
  proofClasses[]
  aggregationProfileRef
  privacyProfileRef
  disclosureAudienceRef
  minimumCohortRuleRef?
  contributionBoundRef?
  privacyAccountingRef?
  producedAt
  resultSnapshotRef
  coverageVector
  unknownVector
  limitations[]
  authorityDisposition = NONE
```

Hard boundaries:

```text
ANALYTICS_RESULT != CANONICAL_TRUTH
ANALYTICS_RESULT != POLICY
ANALYTICS_RESULT != CLIENT_CONFIGURATION
ANALYTICS_RESULT != RELEASE_GATE
ANALYTICS_RESULT != RUNTIME_OBSERVATION
```

The result may inform a human or a separately authorized policy/design process. It cannot silently become one.

## 5. Reusable learning has levels

Cross-Client learning should be classified by what it claims, not by one generic `global insight` label.

Candidate classes:

```text
GLOBAL_COMPONENT_PATTERN
  e.g. a component state repeatedly produces a11y failures under a qualified profile

GLOBAL_INTERACTION_PATTERN
  e.g. a recovery flow is associated with high abandonment across a qualified cohort

PROFILE_SCOPED_PATTERN
  e.g. behavior is specific to browser/AT/device/environment class

APPLICATION_FAMILY_PATTERN
  e.g. evidence applies only to a declared application/component family

TENANT_LOCAL_PATTERN
  derived and visible only inside one Client

WORKSPACE_LOCAL_PATTERN
  depends on composition/configuration/environment of one Workspace

NON_EXPORTABLE_PATTERN
  source sensitivity or cohort size forbids cross-tenant projection
```

Rules:

```text
GLOBAL_PATTERN != UNIVERSAL_PATTERN
GLOBAL_PATTERN != TENANT_FACT
PROFILE_PATTERN != ALL_PROFILES
FREQUENT != IMPORTANT
RARE != SAFE_TO_IGNORE
```

## 6. Aggregation is not anonymity

A count or percentage can leak tenant facts when the cohort is small, sparse or differenced against previous outputs.

Adversarial examples:

- `1 of 1` Client uses a rare integration;
- an aggregate changes from 8 to 9 immediately after a known Client joins;
- two overlapping cohort queries reveal the excluded Client by subtraction;
- a unique application/error fingerprint identifies its tenant despite removal of the tenant ID;
- a time series exposes maintenance windows or operational incidents;
- latency distributions reveal workload scale or geography.

Hard rules:

```text
AGGREGATED != ANONYMOUS
HASHED != NON_SENSITIVE
COHORT_SIZE > 1 != SAFE_DISCLOSURE
NO_DIRECT_IDENTIFIER != NO_MEMBERSHIP_INFERENCE
ROUNDING != PRIVACY_PROOF
```

Candidate protections to research include cohort thresholds, contribution bounding, suppression, coarsening, delayed publication, purpose-limited aggregation, formal privacy mechanisms and query/accounting controls. None is frozen as implementation.

## 7. Contribution bounding precedes cross-tenant comparison

One high-volume Client must not dominate a supposedly global pattern merely because it produced more traces or test executions.

Candidate dimensions:

```text
perClientContributionCap
perWorkspaceContributionCap
perSubjectRevisionCap
perTimeWindowCap
perFailureClassCap
samplingWeight
confidence/coverage metadata
```

Therefore:

```text
MORE EVENTS != MORE TENANT VOTES
MORE ACTIVE TENANT != MORE SEMANTIC AUTHORITY
EVENT COUNT != CLIENT PREVALENCE
TRACE COUNT != USER PREVALENCE
```

Analytics should distinguish `event-weighted`, `workspace-weighted`, `client-weighted` and other estimands instead of silently mixing them.

## 8. Rare events are both high-value and high-risk

Rare failures may be the most safety-critical findings and simultaneously the easiest to attribute to one tenant.

Candidate disposition:

```text
RARE_EVENT_DETECTED
  -> qualify severity
  -> qualify disclosure risk
  -> retain tenant-local/raw evidence under source policy
  -> derive cross-tenant pattern only if disclosure policy permits
  -> otherwise publish coarse/non-attributable safety signal or no shared signal
```

Rules:

```text
RARE != IRRELEVANT
RARE != DISCLOSABLE
SUPPRESSED_FROM_GLOBAL != ERASED_FROM_TENANT
GLOBAL_SUPPRESSION != LOCAL_FAILURE_SUPPRESSION
```

## 9. Analytics currentness is multidimensional

A recommendation based on old evidence can remain historically explainable while becoming unsuitable for current use.

Candidate horizons:

```text
sourceEvidenceCurrentness
componentRevisionCurrentness
profileCurrentness
policyCurrentness
populationRepresentativenessCurrentness
privacyProfileCurrentness
recommendationModelRevisionCurrentness
```

Hard boundaries:

```text
ANALYTIC_SNAPSHOT_CURRENT != SOURCE_EVIDENCE_CURRENT
SOURCE_EVIDENCE_CURRENT != RECOMMENDATION_CURRENT
MODEL_CURRENT != CLIENT_CONTEXT_CURRENT
```

A source evidence revocation or trust/profile change may invalidate only affected analytic dimensions rather than rewriting history.

## 10. Recommendations are proposals with provenance, never authority

Candidate model:

```text
EvidenceDerivedRecommendation
  recommendationId
  recommendationDefinitionRevision
  sourceAnalyticsRefs[]
  targetScope
  targetClientRef?
  targetWorkspaceRef?
  targetComponent/ApplicationRefs[]
  applicabilityPredicates[]
  expectedBenefitClaims[]
  riskClaims[]
  confidence/coverage
  unknowns[]
  contraindications[]
  evidenceFreshnessSummary
  generatedAt
  authorityDisposition = NONE
```

State candidate:

```text
GENERATED
 -> APPLICABILITY_CHECK
 -> PRESENTED | SUPPRESSED_NOT_APPLICABLE | BLOCKED_INSUFFICIENT_EVIDENCE
 -> DISMISSED | ACCEPTED_FOR_REVIEW
 -> AUTHORIZED_AS_SEPARATE_CHANGE? 
```

There is intentionally no direct transition to `EFFECTIVE`.

```text
RECOMMENDED != APPLICABLE
APPLICABLE != AUTHORIZED
AUTHORIZED != APPLIED
APPLIED != EFFECTIVE
EFFECTIVE != BENEFICIAL
```

Any actual mutation remains a separately authorized command/effect lineage under the existing shell/command research.

## 11. Personalization remains Client/Workspace-local unless explicitly portable

A global pattern may suggest a candidate, but applicability must be requalified against destination Client/Workspace revision, environment, permissions, policy, component composition and current evidence.

```text
GLOBAL_BEST_PRACTICE != LOCAL_ADMISSIBILITY
SIMILAR_WORKSPACE != SAME_WORKSPACE
SAME_APPLICATION != SAME_CONFIGURATION
POPULAR_CHOICE != SAFE_DEFAULT
```

Delegated client access affects who may inspect/act on a recommendation; it does not change the recommendation's trust or make source evidence visible.

## 12. Recommendation feedback must not create hidden tenant leakage

Accept/dismiss/ignore outcomes are themselves tenant-sensitive evidence. A shared recommender must not expose statements such as `most clients like you accepted this` unless the underlying aggregate passes the same disclosure qualification.

```text
FEEDBACK_EVENT != GLOBAL_TRAINING_PERMISSION
ACCEPTED != CORRECT
DISMISSED != INCORRECT
NO_RESPONSE != NEGATIVE_SIGNAL
```

Feedback reuse requires purpose, retention, contribution and disclosure qualification.

## 13. Componentization impact

Candidate `primitive/atomic` elements:

- `AnalyticsScopeIndicator`
- `AnalyticsFreshnessIndicator`
- `CoverageIndicator`
- `DisclosureDispositionIndicator`
- `RecommendationAuthorityIndicator`
- `RecommendationApplicabilityIndicator`
- `PrivacyLimitationIndicator`

Candidate compounds:

- `AnalyticsSummary`
- `CoverageAndUnknownSummary`
- `RecommendationEvidenceSummary`
- `DisclosureLimitationSummary`
- `RecommendationApplicabilitySummary`

Candidate tools:

- `EvidenceAnalyticsInspector`
- `CrossTenantDisclosureInspector`
- `ContributionBalanceInspector`
- `RareEventDisclosureInspector`
- `RecommendationInspector`
- `RecommendationApplicabilityInspector`
- `AnalyticsLineageExplorer`

Candidate higher compositions:

```text
primitive
 -> compound
 -> module component
 -> analytics/recommendation tool
 -> Componentes application/window
 -> Desktop Sphere projection
 -> Workspace-qualified insight
 -> system-view aggregate
```

`usedBy` and `composedOf` edges remain dependency/projection edges, never semantic authority edges.

## 14. Shell interaction/state findings

- Builder Home may show fleet-level research/quality patterns only at an audience-qualified aggregate level.
- Client context may show Client-local analytics with stronger detail than fleet/global views.
- Workspace context may show composition-specific recommendations without implying Client-wide applicability.
- Inspector should expose lineage, coverage, UNKNOWN, freshness and privacy limitations for a selected recommendation.
- Status/Activity should distinguish analytics computation from product/runtime effects.
- A recommendation notification is not a command result.
- Client/Workspace switch must clear or requalify recommendation detail, cached drill-down and local feedback state.
- Browser tab/window/display-surface continuity must not preserve unauthorized Client-local analytics after context changes.

```text
ANALYTICS_WINDOW_OPEN != ANALYTICS_CURRENT
RECOMMENDATION_SELECTED != TARGET_SELECTED
RECOMMENDATION_FOCUSED != CHANGE_AUTHORIZED
```

## 15. Accessibility and small-screen obligations

Analytics and recommendation UI must expose in text:

- analytic/recommendation scope;
- Client/Workspace qualification;
- coverage and denominator;
- UNKNOWN/excluded populations;
- freshness;
- disclosure/coarsening limitations;
- recommendation authority=`NONE`;
- applicability/contraindications;
- source lineage at the level the viewer is authorized to inspect.

Charts, heatmaps and graphs require equivalent table/tree summaries. Color alone cannot encode safe/unsafe, local/global or current/stale. Keyboard-only interaction must permit inspect, compare, dismiss and route-to-review without drag. Small-screen projection may progressively disclose detail but must not hide denominator, UNKNOWN, scope or authority.

## 16. Performance and scale findings

Candidate research envelopes include:

- thousands of Clients/Workspaces;
- millions of evidence events;
- high-cardinality component/revision/profile dimensions;
- rare-event cohorts;
- repeated policy simulations and recommendation refreshes.

Admissible operational techniques may include incremental aggregation, precomputed qualified cubes, streaming summaries, bounded caches, virtualization and background recomputation, provided semantic/disclosure boundaries remain intact.

```text
CACHE_HIT != DISCLOSURE_CURRENT
PRECOMPUTED_AGGREGATE != CURRENT_SOURCE_POPULATION
APPROXIMATE_QUERY != EXACT_CLAIM
DROPPED_CARDINALITY != ABSENT_CATEGORY
PERFORMANCE_COARSENING != PRIVACY_PROOF
```

No silent truncation may make UNKNOWN, rare failures or excluded populations disappear.

## 17. Failure/recovery findings

Candidate dispositions:

```text
ANALYTICS_INPUT_PARTIAL
ANALYTICS_STALE
DISCLOSURE_BLOCKED
PRIVACY_ACCOUNTING_UNAVAILABLE
SOURCE_TRUST_REVOKED
RECOMMENDATION_STALE
RECOMMENDATION_CONTEXT_MISMATCH
RECOMMENDATION_WITHDRAWN
```

A failed analytics job must not reuse an older result as current without explicit stale disposition. If privacy/disclosure qualification cannot be resolved, cross-tenant publication is blocked/UNKNOWN rather than permissive.

```text
PRIVACY_CHECK_UNAVAILABLE != SAFE_TO_PUBLISH
ANALYTICS_FAILED != PREVIOUS_RESULT_CURRENT
RECOMMENDER_FAILED != NO_RECOMMENDATIONS_EXIST
```

## 18. Adversarial scenarios

1. One Client is the only user of an integration; a global count reveals adoption.
2. Two overlapping cohort queries identify the excluded Client by subtraction.
3. A hashed error fingerprint uniquely identifies a known tenant deployment.
4. One high-volume Client contributes 90% of traces and dominates the `global` recommendation.
5. A rare severe accessibility failure is globally suppressed but must remain visible locally.
6. A Client switch leaves recommendation drill-down from the previous Client cached in Inspector.
7. A recommendation generated for revision A is shown after component revision B.
8. A global pattern from desktop usage is applied to a small-screen Workspace with incompatible interaction grammar.
9. Delegated support access expires while a Client-local recommendation is open.
10. A stale analytic is silently reused after source trust revocation.
11. A recommendation is accepted and UI incorrectly labels the change effective before command verification.
12. `Most clients accepted` is displayed from a cohort of two Clients.
13. Repeated aggregate queries reconstruct a hidden tenant's failure distribution.
14. Analytics excludes unavailable evidence and reports 100% pass without denominator/UNKNOWN.
15. A model update changes recommendations while retaining the same recommendation identity.
16. Client-local feedback is reused for global training despite purpose restriction.
17. Approximate aggregation drops a rare failure category and UI treats it as absent.
18. Background analytics crosses a Client-context switch and writes result into the wrong scoped cache.
19. Privacy accounting service is unavailable and publisher defaults open.
20. A recommendation based on correlation is presented as causal remediation.

## 19. Proof obligations

Before any future implementation planning, research/conformance must be able to prove at least:

1. every analytic output has named purpose, source population, audience and privacy/disclosure profile;
2. aggregation alone never qualifies an output as anonymous;
3. unauthorized viewers cannot infer hidden tenant membership through counts, drill-down or identifiers;
4. contribution weighting is explicit and cannot silently turn event volume into tenant authority;
5. rare-event suppression in global views does not suppress source-tenant failure truth;
6. Client/Workspace switch clears or requalifies tenant-sensitive analytics/recommendation state;
7. recommendation lineage names source analytics/evidence revisions and limitations;
8. stale/revoked source evidence can invalidate affected analytics/recommendations without rewriting history;
9. recommendation state has no direct transition to product/runtime effect;
10. acceptance of a recommendation is not represented as application/effect success;
11. local applicability is requalified against destination Client/Workspace context;
12. delegated access changes visibility/operation rights but not trust or evidence portability;
13. feedback reuse has explicit purpose/retention/disclosure qualification;
14. analytics failure or privacy-check failure cannot default to publish/open;
15. coverage/UNKNOWN/exclusion denominators remain visible in desktop and small-screen projections;
16. charts have keyboard-accessible non-visual equivalents;
17. approximate/coarsened analytics cannot silently strengthen the claim;
18. cached aggregates are invalidated/requalified across source/trust/profile/privacy changes;
19. model/recommender revision is visible and identity-safe;
20. correlation-derived recommendations cannot be labeled as proven causal remediation;
21. high-volume Clients cannot dominate a client-prevalence estimand beyond declared contribution rules;
22. cross-tenant result publication remains separate from computation permission.

## 20. Maturity and unresolved gaps

Slice disposition: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

Material findings:

- analytics is a projection with an explicit disclosure boundary;
- reusable learning needs scope classes rather than a generic global insight;
- aggregation/de-identification do not imply anonymity;
- contribution bounding and estimand identity are necessary for cross-tenant meaning;
- rare events require separate severity and disclosure treatment;
- recommendations require provenance/currentness/applicability and authority=`NONE`;
- recommendation feedback is itself tenant-sensitive evidence;
- cross-tenant computation permission and publication permission are independent.

Open gaps:

- formal taxonomy for analytic estimands and confidence/uncertainty representation;
- privacy/disclosure accounting lifecycle across repeated analytics queries;
- recommendation model/version qualification and rollback without historical reinterpretation;
- causal evidence standards versus correlation-only recommendation language;
- opt-in/contract/purpose governance for cross-client learning;
- whether some safety patterns require a non-statistical escalation path that preserves tenant confidentiality;
- interaction design for explaining privacy-limited aggregates without implying missing data is zero.

Do not advance to implementation planning while these gaps remain material.

## 21. Next research vector

Highest-value next vector:

**recommendation-model qualification + causal/correlation claim semantics and safe feedback learning**.

Research how heuristic/statistical/AI recommendation producers are versioned, qualified and compared; how a recommendation states whether it is causal, correlational, rule-derived or expert-authored; how offline/online evaluation avoids cross-tenant leakage; how feedback is purpose-bounded; how rollback preserves historical explainability; and how the shell prevents `MODEL_CONFIDENCE` from becoming `AUTHORITY`.
