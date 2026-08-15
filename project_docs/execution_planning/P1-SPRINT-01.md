# P1-SPRINT-01 — BusinessRecipe Contract

## Goal

Deliver the first independently testable SB-02 Recipe slice: the technology-independent BusinessRecipe public contract with deterministic traceability to ProcessMirror evidence.

## Primary task

`TASK-005 — Specify the BusinessRecipe contract`

## Module

SB-02 Recipe.

## Dependency

TASK-004 / ProcessMirror contract is completed and integrated.

## Branch

`sprint/P1-SPRINT-01`

## Test target

- valid and invalid BusinessRecipe fixtures;
- traceable evidence references to ProcessMirror artifacts;
- technology-independent recipe semantics;
- version/extension compatibility behavior;
- TASK-declared `npm run verify`;
- final Sprint `npm run verify`.

## Exit proof

A synthetic approved recipe validates deterministically against the public contract and can be consumed by the next SystemAnalysis Sprint without importing technical SystemDefinition concerns.

## Stop conditions

Stop before review if implementation requires an undeclared architecture/public-contract decision beyond TASK-005/accepted ADR authority, forbidden paths, destructive changes, scope expansion or security/governance weakening.

## Closure

Produce `project_docs/execution_planning/P1-SPRINT-01.report.md`, open one PR to `main`, and stop for Sprint Review.
