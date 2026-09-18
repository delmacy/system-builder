# G4 — Engineering Lifecycle, Product Change & Continuous Improvement

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Execution authority: NONE
Last evidence consolidation: 2026-09-18

## Goal

Develop a shared lifecycle grammar that can govern both the System Builder itself and generated/client systems without collapsing their authorities or artifacts.

```text
Shared lifecycle semantics != shared authority
BuilderLifecycle != ClientSystemLifecycle
```

## Common semantic candidates

Research a minimal, composable model around Finding, WorkItem, Issue/Defect/Bug, Feature/Improvement, TechnicalDebt, Incident, Problem, Risk, ChangeRequest, Decision, Change, Review, Verification, Evidence, Release, Deployment, Observation, Resolution, Lesson and ImprovementCandidate.

Do not force all of these to become primitives; apply the G3 Minimal Primitive Basis.

## Generic flow

```text
Signal / Request / Observation
          |
        Finding
          |
        Triage
          |
        Work Item
          |
   classify / prioritize
          |
        Planning
          |
        Change
          |
        Review
          |
     Verification
          |
        Release
          |
      Deployment
          |
      Observation
          |
 Resolution / Learning
          |
 Continuous Improvement
          +-------------------> new candidate
```

## Existing G2 semantics to generalize

G2 already distinguishes Support, Maintenance and Evolution and has rolling-wave planning, Sprint Review, Package Integration & Review, Documentation & Closure, bounded correction and backlog/successor routing. G4 should generalize these lessons rather than invent a parallel process.

## N:N traceability

One incident may generate multiple downstream work items, and one change may resolve multiple findings. Avoid reducing the digital thread to `issue -> commit`.

```text
Incident I
 |- Problem P
 |- Fix F
 |- Debt D
 \- Feature E

Change C
 |- resolves Bug B
 |- mitigates Risk R
 \- implements Feature F
```

## Lifecycle definition vs occurrence

```text
LifecycleDefinition
  states
  transitions
  guards
  authority
  evidenceRequirements
  entry/exit criteria
  supersession
  recovery

LifecycleOccurrence
  actual trajectory + evidence
```

Do not impose one universal status enum. Feature, Incident, Release, InfrastructureResource and BusinessProcess may share lifecycle structure while using different states.

## Evidence consolidation — learning, work graphs and effectiveness

This consolidation compares mature incident-learning practice, empirical software-delivery measurement and modern issue/work hierarchy. These are evidence sources, not product bindings.

### Incident, postmortem and action item are different lifecycle objects

Google SRE treats the postmortem as a durable record of an incident, impact, mitigation/resolution, causes and follow-up actions. Its operational guidance also emphasizes explicit ownership of follow-up action items and tracking those actions in a separate bug/work system.

Generalizable implication:

```text
IncidentOccurrence
   -> Postmortem / ReviewEvidence
   -> Findings[]
   -> ActionCandidates[]
   -> governed WorkItems[]
```

The review is not the incident, and an action item is not automatically an authorized change. A postmortem may discover multiple causes and improvement opportunities; each may have a different owner, priority, authority and eventual disposition.

New invariants:

- `Incident != Postmortem`.
- `Postmortem != Action authorization`.
- `Action item closed != recurrence risk reduced`.
- `Root-cause narrative != complete causal model`.

For SB/client systems, postmortem metadata should remain queryable and linked to downstream work so learning does not disappear into prose.

### Work hierarchy is a view, not the semantic model

GitHub Issues supports typed issues and parent/sub-issue hierarchies. This is useful evidence that practical work systems need classification and decomposition, but a tree cannot represent all lifecycle causality: one change can resolve many findings and one incident can produce many unrelated work streams.

Therefore research should preserve a graph beneath hierarchical planning views:

```text
Initiative -> Feature -> WorkItem          planning/decomposition view

Incident --reveals--> Problem
Incident --motivates--> Improvement
Change   --resolves--> Defect
Change   --mitigates--> Risk
Review   --produces--> Finding
Finding  --justifies--> WorkItem           semantic/digital-thread graph
```

`Parent/child != cause/effect`.

`Work hierarchy != lifecycle graph`.

A hierarchy may be projected for planning UX, while canonical relationships retain typed N:N edges.

### Continuous improvement requires outcome measurement

DORA currently separates software-delivery throughput from instability and measures deployment frequency, change lead time, failed-deployment recovery time, change fail rate and deployment rework rate. A particularly useful methodological lesson is that DORA narrowed recovery measurement to failures caused by software deployment rather than conflating unrelated outages.

The product-independent lesson is not to hard-code DORA metrics for every client system. It is to require **metric attribution and denominators** when claiming improvement.

Candidate improvement lifecycle:

```text
ObservedProblem
 -> ImprovementHypothesis
 -> baseline window + metric definition
 -> ChangeCandidate
 -> governed execution
 -> observation window
 -> compare baseline / treatment
 -> EFFECTIVE | INCONCLUSIVE | REGRESSED | SUPERSEDED
```

Candidate evidence envelope:

```text
ImprovementEffectEvidence
  hypothesisRef
  targetOutcome
  metricDefinitionRef
  population/scope
  baselineWindow
  observationWindow
  confounders/knownChanges
  beforeMeasurement
  afterMeasurement
  uncertainty/qualification
  conclusion
```

New invariants:

- `Change deployed != improvement achieved`.
- `Metric moved != change caused movement`.
- `Activity completed != outcome improved`.
- `Average improved != every population improved`.
- `Throughput != stability`.

For business-process client systems the metric may be lead time, rework, queue age, defect escape, SLA attainment, cost, safety or user outcome rather than deployment frequency. The lifecycle grammar should support domain-defined outcome evidence.

### Closure should be multidimensional

A single `CLOSED` state loses important truth. Research should distinguish at least:

```text
WorkCompletion       implementation/task finished
ResolutionStatus     triggering problem addressed
EffectivenessStatus  expected outcome observed
LearningStatus       review/lesson captured
```

A work item may be complete while effectiveness remains `UNKNOWN`; an incident may be resolved while prevention work remains open; an improvement may be implemented but later judged ineffective.

`Closed != Effective Resolution` is therefore strengthened into a multidimensional closure requirement rather than merely a naming rule.

### Learning itself needs lineage

A lesson should retain what evidence justified it and where it was applied:

```text
Observation/Incident
 -> Review
 -> Finding
 -> Lesson
 -> ImprovementCandidate
 -> Decision
 -> Change
 -> EffectEvidence
 -> Lesson revision / confirmation / rejection
```

This allows a lesson to be superseded when later evidence contradicts it instead of becoming permanent folklore.

`Lesson learned != timeless truth`.

## Continuous improvement loop

```text
Plan -> Execute -> Observe -> Review -> Learn
-> Improvement Candidate -> Decide -> Change
-> Measure Effect -> repeat
```

This applies to product behavior, business process, development process, infrastructure policy and operational procedures.

## Invariants

- `Issue != Change`.
- `Change != Release`.
- `Release != Deployment`.
- `Deployment != Effective State`.
- `Incident != Root Cause`.
- `Fix != Resolution Evidence`.
- `Closed != Effective Resolution`.
- `Finding != Confirmed Problem`.
- `Incident != Postmortem`.
- `Postmortem != Action authorization`.
- `Parent/child != cause/effect`.
- `Work hierarchy != lifecycle graph`.
- `Change deployed != improvement achieved`.
- `Metric moved != change caused movement`.
- `Activity completed != outcome improved`.
- `Lesson learned != timeless truth`.
- retrospective/lesson does not automatically authorize process change.

## Proof obligations

1. The same lifecycle grammar can model Builder and client-system evolution without sharing their authority.
2. Work decomposition can be projected hierarchically without losing typed N:N causal/traceability relationships.
3. Incident review produces evidence/findings but cannot silently authorize downstream change.
4. Completion, resolution and effectiveness can disagree without being collapsed into one status.
5. An improvement claim identifies its outcome, metric definition, population/scope, baseline and observation windows.
6. Measurement uncertainty/confounders can produce `INCONCLUSIVE` rather than forced success/failure.
7. Lessons remain traceable to evidence and can be revised/superseded.
8. AI-assisted triage or retrospective synthesis cannot become authority merely by producing a classification or recommendation.

## Dogfooding proof

A major G4 proof should be that the System Builder can model and govern its own development/evolution lifecycle using the same reusable lifecycle grammar available to client systems, while keeping Builder-specific authority and repository rules explicit.

A useful dogfooding test is to connect a real SB incident/finding through review, work decomposition, change, release and post-change effect measurement without introducing Builder-only semantic primitives.

## Research gaps after this consolidation

Highest-value remaining questions:

1. Unified work-item taxonomy and semantic ownership: which candidates are true primitives versus typed views/projections.
2. Causal reasoning boundaries: represent contributing factors without claiming unjustified single root cause.
3. Prioritization and portfolio decisions without opaque scalar ranking.
4. Cross-system/client lifecycle federation and identity/authority boundaries.
5. Lifecycle-definition version migration for in-flight occurrences.
6. Integration with G3 evidence, decision, authority and graph semantics.
7. Statistical/operational rules for improvement effectiveness without pretending causal certainty from simple before/after comparison.
8. Lifecycle visualization in Living Canvas and progressive disclosure of N:N relationships.
9. AI-assisted triage/planning with human/governed authority and auditable disagreement.

## Sources / evidence class

Primary/mature sources consulted in this consolidation:

- Google SRE Workbook — Postmortem Culture: https://sre.google/workbook/postmortem-culture/
- Google SRE Book — Postmortem Culture: https://sre.google/sre-book/postmortem-culture/
- DORA — software delivery performance metrics: https://dora.dev/guides/dora-metrics/
- DORA — history/evolution of delivery metrics: https://dora.dev/insights/dora-metrics-history/
- GitHub Docs — issue types: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/managing-issue-types-in-an-organization
- GitHub Docs — sub-issues: https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/adding-sub-issues

These sources inform lifecycle boundaries and evidence requirements; none defines the canonical SB taxonomy or authorizes a provider/tool binding.
