# P1-SPRINT-06 — Assembly Minimal Resolver

## Goal
Deliver the first testable SB-06 Assembly slice: deterministic resolution from SystemDefinition + Catalog into an AssemblyPlan or reproducible diagnostic.

## Primary task
To be materialized from the Assembly WBS after P1-SPRINT-05 integration.

## Module
SB-06 Assembly.

## Dependency
P1-SPRINT-05 Catalog slice integrated.

## Branch
`sprint/P1-SPRINT-06`

## Scope target
- required capability/provider selection;
- direct dependency/version constraints;
- deterministic conflict/gap diagnostics;
- BOM/source references;
- no broad optimizer.

## Test target
- successful resolution;
- missing capability;
- incompatible version;
- deterministic repeated output;
- conflict/cycle rejection for the bounded slice;
- final `npm run verify`.

## Exit proof
SystemDefinition + Catalog fixtures deterministically produce a valid AssemblyPlan or an explicit reproducible failure.

## Closure
Produce `P1-SPRINT-06.report.md`, open one PR to `main`, and stop for Sprint Review.
