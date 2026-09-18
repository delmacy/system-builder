# G4 — Engineering Lifecycle, Product Change & Continuous Improvement

Status: `RESEARCH_BACKLOG_ONLY`
Execution authority: NONE

## Goal

Develop a shared lifecycle grammar that can govern both the System Builder itself and generated/client systems without collapsing their authorities or artifacts.

```text
Shared lifecycle semantics != shared authority
BuilderLifecycle != ClientSystemLifecycle
```

## Common semantic candidates

Research a minimal, composable model around:

- Finding;
- WorkItem;
- Issue/Defect/Bug;
- Feature/Improvement;
- TechnicalDebt;
- Incident;
- Problem;
- Risk;
- ChangeRequest;
- Decision;
- Change;
- Review;
- Verification;
- Evidence;
- Release;
- Deployment;
- Observation;
- Resolution;
- Lesson;
- ImprovementCandidate.

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

One incident may generate multiple downstream work items, and one change may resolve multiple findings.

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

Avoid reducing the digital thread to `issue -> commit`.

## Lifecycle definition vs occurrence

Research:

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
- retrospective/lesson does not automatically authorize process change.

## Dogfooding proof

A major G4 proof should be that the System Builder can model and govern its own development/evolution lifecycle using the same reusable lifecycle grammar available to client systems, while keeping Builder-specific authority and repository rules explicit.

## Research gaps

- unified work-item taxonomy and semantic ownership;
- roadmap/initiative/feature/debt relationships;
- prioritization without opaque scalar ranking;
- retrospective/postmortem/lesson lifecycle;
- improvement effectiveness measurement;
- cross-system/client lifecycle federation;
- lifecycle version migration;
- integration with evidence, decision and authority graphs;
- lifecycle visualization in Living Canvas;
- AI-assisted triage/planning with human/governed authority.
