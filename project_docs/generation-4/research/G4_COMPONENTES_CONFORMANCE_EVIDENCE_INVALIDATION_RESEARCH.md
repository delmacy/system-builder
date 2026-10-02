# G4 — Componentes Conformance Evidence Invalidation & Dependency Propagation Research

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Date: 2026-09-23

## Purpose

Extend the G4 `Componentes` catalog/playground conformance model with an implementation-independent model for evidence invalidation, dependency propagation, selective requalification and bounded blast radius across:

`primitive/atomic -> compound -> module component -> tool -> application -> window -> desktop -> workspace -> system view`.

This is research only. It does not select Storybook, Nx, Bazel or any provider; it does not authorize implementation, WBS, Work Packages, Sprints or TASKs.

## Repository constraints preserved

- `Builder != Runtime`.
- `Research candidate != implementation authority`.
- `composedOf/usedBy != semantic ownership`.
- `PASS != permanent truth`.
- `STALE_EVIDENCE != FAIL`.
- `NOT_EVALUATED != NOT_APPLICABLE`.
- `Projection/index/cache/test graph != canonical business authority`.

The existing catalog research already binds evidence to component contract revision, implementation revision, fixture revision and execution profile. This round asks when those bindings cease to justify a current conformance claim.

## External interaction-grammar evidence

1. Nx `affected` computes changed projects and traverses the project graph to select dependent projects rather than rerunning every project unconditionally. This is evidence for dependency-directed requalification, not Nx adoption.
2. Storybook tags can include/exclude/skip subsets of stories/tests. This is evidence that qualification corpora can be partitioned and selectively scheduled, not proof that tags alone establish semantic impact.
3. W3C accessibility guidance evolves independently of application code. WCAG-EM 2.0 now explicitly addresses apps/digital products. This is evidence that an external normative/profile change can stale accessibility evidence even when component source is unchanged.

## Finding 1 — Evidence currentness is a relation, not a badge

Candidate envelope:

```text
EvidenceBinding
  evidenceId
  proofClass
  subjectId
  subjectContractRevision
  implementationRevision?
  fixtureRevision
  dependencyEvidenceRefs[]
  normativeProfileRefs[]
  executionProfile
  environmentFingerprint
  producedAt
  disposition
```

`QUALIFIED` is therefore shorthand for a set of current evidence relations, not an intrinsic permanent property of a component.

Invariants:

- `PREVIOUS_PASS != CURRENT_PASS`
- `SOURCE_UNCHANGED != EVIDENCE_CURRENT`
- `DEPENDENCY_CHANGED != SUBJECT_FAILED`
- `DEPENDENCY_CHANGED -> REQUALIFICATION_DECISION_REQUIRED`
- `STALE_EVIDENCE != FAIL`
- `STALE_EVIDENCE != UNKNOWN_COMPONENT_BEHAVIOR` unless no surviving evidence supports the queried claim.

## Finding 2 — Change classification must precede propagation

A changed artifact receives a typed `ChangeImpactDescriptor` rather than a universal dirty bit.

Candidate dimensions:

```text
STRUCTURAL_API
INTERACTION_CONTRACT
SEMANTIC_PROJECTION
ACCESSIBILITY
VISUAL_ONLY
RESPONSIVE_DENSITY
PERFORMANCE
FAILURE_RECOVERY
LIFECYCLE
COMPOSITION
CROSS_SURFACE_CONTINUITY
NORMATIVE_PROFILE
FIXTURE_ONLY
EVIDENCE_METADATA_ONLY
```

A change may carry multiple dimensions.

Examples:

- icon color token change: potentially `VISUAL_ONLY + ACCESSIBILITY` if contrast changes;
- focus-ring geometry: `INTERACTION_CONTRACT + ACCESSIBILITY`;
- Button label rendering refactor with unchanged accessible-name contract: may be `VISUAL_ONLY` after qualified diff evidence;
- command state mapping change: `SEMANTIC_PROJECTION + INTERACTION_CONTRACT`;
- suspend/restore behavior change: `LIFECYCLE + FAILURE_RECOVERY`;
- WCAG/AT target-profile revision: `NORMATIVE_PROFILE + ACCESSIBILITY` even with no source change.

`VISUAL_DIFF != VISUAL_ONLY` and `NO_DOM_DIFF != NO_SEMANTIC_IMPACT`.

## Finding 3 — Dependency edges are typed

`composedOf/usedBy` alone is too coarse for selective invalidation. Candidate evidence edges:

```text
STRUCTURAL_COMPOSITION
INTERACTION_DEPENDENCY
SEMANTIC_PROJECTION_DEPENDENCY
ACCESSIBILITY_DEPENDENCY
STYLE_TOKEN_DEPENDENCY
LAYOUT_DEPENDENCY
PERFORMANCE_DEPENDENCY
RECOVERY_DEPENDENCY
LIFECYCLE_DEPENDENCY
CROSS_SURFACE_DEPENDENCY
FIXTURE_DEPENDENCY
NORMATIVE_PROFILE_DEPENDENCY
```

One pair of artifacts may have several edges.

Example: `WindowTitleBar -> Window` can be a structural, interaction and accessibility dependency without being semantic ownership of the Window's business content.

Invariants:

- `DEPENDENCY_EDGE != AUTHORITY_EDGE`
- `USED_BY != ALL_PROOFS_DEPEND_ON`
- `COMPOSED_OF != ALL_CHANGE_DIMENSIONS_PROPAGATE`
- `GRAPH_REACHABILITY != MATERIAL_IMPACT`

## Finding 4 — Propagation is proof-class-sensitive

Candidate rule:

```text
ChangedSubject
 + ChangeImpactDescriptor
 + TypedDependencyEdge
 + DownstreamProofDependency
 -> EvidenceDispositionTransition
```

Possible transitions:

```text
PASS -> STALE_EVIDENCE
PASS -> CURRENT_UNAFFECTED
PARTIAL -> STALE_EVIDENCE
NOT_APPLICABLE -> REASSESS_APPLICABILITY
NOT_EVALUATED -> NOT_EVALUATED
FAIL -> FAIL_STILL_RELEVANT | STALE_FAILURE
```

A primitive accessibility change may stale accessibility/composition evidence of consumers without staling unrelated performance evidence. A visual-only change may stale visual evidence while preserving command lifecycle proof.

`ONE_STALE_DIMENSION != WHOLE_COMPONENT_UNQUALIFIED`.

However, a release/promotion policy may require all mandatory dimensions current before presenting an aggregate `QUALIFIED` disposition.

## Finding 5 — Evidence invalidation has roots and reasons

Every stale transition should retain a machine-readable lineage:

```text
InvalidationCause
  causeId
  rootSubject
  rootRevisionBefore
  rootRevisionAfter
  changeDimensions[]
  propagationPath[]
  affectedProofClasses[]
  rationale
  observedAt
```

This enables a user to answer: “Why is this Workspace accessibility proof stale?” without treating a large dependency graph as authority.

`STALE_WITHOUT_CAUSE != AUDITABLE_CURRENTNESS`.

## Finding 6 — Selective requalification is a cut problem

The goal is not “rerun every fixture” nor “rerun only the changed component”. The candidate process is:

```text
CHANGE DETECTED
 -> CLASSIFY IMPACT
 -> IDENTIFY DIRECT PROOF BINDINGS
 -> PROPAGATE THROUGH COMPATIBLE EDGE TYPES
 -> COMPUTE AFFECTED PROOF SET
 -> APPLY SAFETY EXPANSION RULES
 -> SCHEDULE REQUALIFICATION
 -> MERGE NEW EVIDENCE
 -> RETIRE/ARCHIVE SUPERSEDED EVIDENCE
```

Safety expansion is required when impact cannot be proven narrow. Conservative expansion is preferable to false currentness.

`UNKNOWN_IMPACT != SAFE_TO_REUSE_EVIDENCE`.

Nx-style affected-graph selection is useful interaction grammar: source changes plus dependency graph can identify a smaller affected set. The SB research adds typed proof dependencies because project-level graph reachability alone is insufficient for semantic/UI conformance.

## Finding 7 — Semantic compatibility can preserve evidence only with explicit proof

A new revision may be evidence-compatible with an old proof only when the relevant observable contract is proven unchanged for that proof scope.

Candidate relation:

```text
EvidenceCompatibilityClaim
  oldSubjectRevision
  newSubjectRevision
  proofClass
  preservedObservables[]
  excludedObservables[]
  justificationEvidence
  disposition
```

Invariants:

- `API_COMPATIBLE != INTERACTION_COMPATIBLE`
- `INTERACTION_COMPATIBLE != ACCESSIBILITY_COMPATIBLE`
- `PIXEL_EQUIVALENT != SEMANTICALLY_EQUIVALENT`
- `SAME_PUBLIC_PROPS != SAME_RECOVERY_BEHAVIOR`
- `COMPATIBILITY_CLAIM != SELF_PROVING`

A compatibility claim itself is evidence and can become stale.

## Finding 8 — Normative/profile changes can invalidate from outside the component graph

Evidence depends on browser/AT/runtime profiles and normative expectations. Therefore invalidation roots are not limited to repository artifacts.

Candidate external roots:

```text
BROWSER_PROFILE_CHANGE
ASSISTIVE_TECH_PROFILE_CHANGE
ACCESSIBILITY_NORMATIVE_PROFILE_CHANGE
DEVICE_INPUT_PROFILE_CHANGE
PERFORMANCE_BUDGET_PROFILE_CHANGE
SECURITY/PERMISSION_PROJECTION_RULE_CHANGE
```

This is particularly important for accessibility: a previously passing browser/AT matrix is historical evidence, not proof of every future profile.

## Finding 9 — Failure evidence also has currentness

A previous `FAIL` cannot remain indefinitely authoritative after the underlying component/dependency changes.

```text
FAIL
 -> FAIL_STILL_RELEVANT
 | STALE_FAILURE
 -> REQUALIFY
 -> PASS | FAIL | PARTIAL | NOT_APPLICABLE
```

Likewise, a previously known accessibility incompatibility can become stale after browser/AT changes and must not be silently reported as current fact.

`OLD_FAILURE != CURRENT_FAILURE`.

## Finding 10 — Cross-level propagation requires integration proofs

Lower-level requalification does not automatically repair higher-level evidence.

Example:

```text
Button PASS(new)
Toolbar PASS(new)
!=
Ribbon composition proof current
```

because focus order, overflow, responsive projection and command-state coordination exist only at the composed level.

Required principle:

`CHILDREN_REQUALIFIED != PARENT_INTEGRATION_REQUALIFIED`.

Conversely, a parent proof may remain current if its proof contract does not depend on the changed child dimension and that independence is explicit.

## Finding 11 — Blast radius must be observable and bounded

Candidate impact view:

```text
ImpactSummary
  rootChanges[]
  directlyStaleEvidence
  transitivelyStaleEvidence
  unaffectedEvidenceRetained
  applicabilityRechecks
  safetyExpandedEvidence
  requalificationQueue
  blockedByUnknownImpact
```

At scale, the graph UI may aggregate by classification/application/workspace, but counts and drill-down remain available.

`AGGREGATED_IMPACT != HIDDEN_IMPACT`.

For a widely used primitive, large blast radius is legitimate evidence about coupling. The system must not silently cap propagation to preserve CI speed.

## Finding 12 — Requalification scheduling is not semantic authority

The scheduler may prioritize foreground/high-risk/high-fanout evidence, but priority cannot turn stale evidence current.

Candidate scheduling inputs:

```text
proof criticality
fanout
user-visible surface
change risk
historical failure rate
execution cost
profile urgency
```

Invariants:

- `QUEUED != REQUALIFIED`
- `HIGH_PRIORITY != MORE_AUTHORITATIVE`
- `CACHE_HIT != CURRENT_EVIDENCE`
- `SKIPPED_FOR_COST != NOT_APPLICABLE`

Story/test tagging can partition workloads, but tag selection is scheduling metadata, not proof of impact completeness.

## Componentization impact

### primitive/atomic

Expose typed change dimensions and direct evidence bindings. Primitive changes frequently have high fanout; accessibility/focus/token changes require especially careful propagation.

### compound

Own composition proofs for child coordination. Child evidence reuse is allowed only per proof class.

### module component

Add domain projection compatibility claims without acquiring canonical business ownership.

### tool

Requalify context resolution, command projection, focus/selection handoff and failure recovery when dependencies change.

### application

Requalify contribution/activation/residency integration when shared shell contracts change.

### window

Requalify focus, docking, modal ownership, recovery and lifecycle compositions independently.

### desktop

Requalify taskbar/window registry, high-window-count, activation budgeting and accessible arrangement when relevant lower layers change.

### workspace

Requalify Client/Workspace/revision/environment/currentness continuity; lower-level green evidence cannot prove workspace switching semantics.

### system view

Retain end-to-end task evidence only when every material proof dependency remains current or is explicitly evidence-compatible.

## State/lifecycle findings

Candidate evidence lifecycle:

```text
NOT_EVALUATED
 -> EVALUATING
 -> PASS | FAIL | PARTIAL | NOT_APPLICABLE
 -> STALE_EVIDENCE
 -> REQUALIFICATION_QUEUED
 -> EVALUATING
 -> PASS | FAIL | PARTIAL | NOT_APPLICABLE
```

`STALE_EVIDENCE` is not an error state; it is a currentness state about a historical result.

For evidence invalidated while a qualification run is active:

```text
RUN_STARTED(revision=A)
CHANGE_TO_B
RUN_COMPLETES_FOR_A
=> HISTORICAL_RESULT_FOR_A, not CURRENT_RESULT_FOR_B
```

`TEST_COMPLETED_LATEST != TESTED_LATEST_REVISION`.

## Accessibility findings

Accessibility evidence should propagate on semantic markup, focus behavior, accessible-name/description, disabled/read-only behavior, keyboard model, contrast/token, motion, reflow/density and modal/inertness changes as applicable.

A pure internal refactor may preserve accessibility evidence only if its relevant observable contract is qualified unchanged. Browser/AT profile evolution can independently stale evidence.

Keyboard/focus and manual AT evidence are typically more expensive than static checks; selective requalification is therefore valuable, but never at the cost of falsely retaining currentness.

## Performance findings

Selective invalidation prevents every primitive edit from forcing the entire catalog corpus to rerun. However:

- fanout must not be silently truncated;
- dependency traversal should be indexed and incremental;
- evidence graph rendering should virtualize/aggregate rather than omit;
- requalification should support bounded concurrency/backpressure;
- cached results require exact binding to revision/profile/proof scope;
- high-fanout roots should be visible as architectural coupling signals.

Performance optimization applies to scheduling and representation, not truth semantics.

## Mandatory adversarial scenarios

1. Button visual token changes without interaction change: visual evidence stales; unrelated command-effect evidence remains current.
2. Focus-ring contract changes: Button, Toolbar/Ribbon and modal accessibility evidence is affected through typed edges.
3. Primitive implementation refactor claims no observable change: compatibility claim must itself be justified before retaining evidence.
4. Command state mapping changes: semantic-projection evidence stales through Ribbon, Palette and context menu consumers.
5. Window suspend/restore behavior changes: lifecycle/recovery proofs stale without invalidating unrelated typography evidence.
6. WCAG/browser/AT target profile changes with zero repository diff: relevant accessibility evidence becomes stale.
7. A widely used primitive changes: impact graph contains thousands of consumers; no silent fanout cap.
8. Parent and all children individually pass after change, but parent composition fixture has not rerun: parent composition remains stale.
9. Previous failure's dependency is fixed: old failure becomes `STALE_FAILURE`, not current FAIL.
10. Requalification run starts on revision A and revision B lands mid-run: A result is historical only.
11. Workspace end-to-end proof depends on one stale cross-surface proof: aggregate qualification must disclose the stale dimension.
12. Fixture-only edit: only evidence depending on that fixture revision stales unless fixture semantics alter broader scenario coverage.
13. Performance budget profile tightens: performance evidence can stale without semantic-projection evidence staling.
14. Dependency edge was missing and later discovered: impact calculation must expand and mark previously retained evidence suspect/stale as appropriate.
15. Small-screen accessibility fixture changes while desktop fixture is unchanged: scope-specific evidence invalidation remains separate.
16. Unknown change classification: conservative safety expansion prevents reuse from being presented as current.

## Proof obligations

PO-INV-01 — Every current proof can identify the exact subject/fixture/profile revisions it qualifies.

PO-INV-02 — Every stale transition records a root cause and propagation rationale.

PO-INV-03 — Dependency edges used for invalidation are typed and do not imply semantic ownership/authority.

PO-INV-04 — A change invalidates only materially dependent proof dimensions when that narrowness is itself justified; unknown impact expands conservatively.

PO-INV-05 — `STALE_EVIDENCE`, `FAIL`, `PARTIAL`, `NOT_EVALUATED` and `NOT_APPLICABLE` remain distinct in data and presentation.

PO-INV-06 — Requalification of children cannot silently promote parent composition evidence to current.

PO-INV-07 — External normative/browser/AT/profile changes can invalidate evidence without a repository source change.

PO-INV-08 — A compatibility claim preserving old evidence is proof-scoped, explicit and itself revision/currentness bound.

PO-INV-09 — Qualification finishing against an obsolete revision is retained as historical evidence and never relabeled current.

PO-INV-10 — Failure evidence is revision/profile bound and can become stale after material changes.

PO-INV-11 — Impact traversal has no silent fanout cap; aggregation preserves counts and drill-down.

PO-INV-12 — Selective scheduling, tags, caching or prioritization cannot manufacture `PASS`/`NOT_APPLICABLE`.

PO-INV-13 — Accessibility invalidation covers focus/keyboard/AT/reflow/contrast/motion dimensions independently where material.

PO-INV-14 — Performance evidence and semantic evidence can invalidate independently.

PO-INV-15 — Workspace/system-view qualification exposes stale mandatory dependencies instead of collapsing them into an old green aggregate.

PO-INV-16 — The dependency/evidence graph remains a qualification instrument, not canonical business truth or runtime authority.

## Deduplication

This artifact does not redefine the catalog entry schema, UI state vocabulary, Command Registry, Application Registry, Window lifecycle or canonical business authority. It adds the missing currentness/invalidation layer over the conformance evidence model.

## Maturity / saturation

Slice maturity: `MATERIAL_DELTA / PARTIALLY_MATURE / NON_EXECUTABLE`.

Material gap closed: evidence invalidation and dependency-directed requalification now have a candidate grammar.

Remaining gaps:

1. provenance/retention/compaction of large historical evidence sets;
2. formal change-classification confidence and reviewer override semantics;
3. cross-repository/provider component evidence when replaceable third-party implementations participate;
4. aggregate qualification policy when mandatory proof dimensions have different freshness horizons;
5. quantitative validation of impact-graph scale and scheduling budgets.

## Next vector

Research **conformance evidence provenance, retention/compaction and freshness horizons**, especially how historical proof remains auditable without making the active catalog retain every raw artifact forever, while preserving `STALE != CURRENT`, reproducibility and cross-profile qualification.