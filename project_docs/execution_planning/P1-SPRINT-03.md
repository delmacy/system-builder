# P1-SPRINT-03 — SystemDefinition Contract

## Goal
Deliver the first independently testable SB-04 Design slice: a public SystemDefinition contract that remains separate from BusinessRecipe and excludes environment secrets/Builder internals.

## Primary task
`TASK-007 — Specify the SystemDefinition contract`

## Module
SB-04 Design.

## Dependency
P1-SPRINT-02 / TASK-006 integrated.

## Branch
`sprint/P1-SPRINT-03`

## Test target
- boundary tests for Recipe/Analysis/Definition separation;
- secret exclusion;
- traceability from SystemAnalysis;
- versioned valid/invalid fixtures;
- TASK-declared validation;
- final Sprint `npm run verify`.

## Exit proof
ProcessMirror → BusinessRecipe → SystemAnalysis → SystemDefinition validates as one linked synthetic chain.

## Closure
Produce `P1-SPRINT-03.report.md`, open one PR to `main`, and stop for Sprint Review.
