# P1-SPRINT-04 — Downstream Contract Spine

## Goal
Establish the linked public boundaries required to test factory execution from SystemDefinition through DeploymentRecord before implementing the engines.

## Primary task
`TASK-008 — Assembly and Release Boundary Contracts`

## Primary area
Cross-module contract enabler for Assembly, Validation, Compiler, Release and Deploy.

## Dependency
P1-SPRINT-03 / TASK-007 integrated.

## Branch
`sprint/P1-SPRINT-04`

## Test target
- linked AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord fixtures;
- provenance/hash preservation;
- release/environment/deployment separation;
- secret exclusion;
- end-to-end contract-chain test;
- TASK-declared validation and final `npm run verify`.

## Exit proof
A single synthetic artifact chain validates from ProcessMirror through DeploymentRecord.

## Closure
Produce `P1-SPRINT-04.report.md`, open one PR to `main`, and stop for Sprint Review.
