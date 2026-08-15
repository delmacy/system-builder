# P1-SPRINT-05 — Catalog Minimal Registry

## Goal
Deliver the first testable SB-05 Catalog slice: a provider-neutral software capability/component registry with deterministic lookup and explicit Business ↔ Software separation.

## Primary task
To be materialized from the Catalog WBS after P1-SPRINT-04 integration.

## Module
SB-05 Catalog.

## Dependency
P1-SPRINT-04 downstream contract spine integrated.

## Branch
`sprint/P1-SPRINT-05`

## Scope target
- versioned capability/component entries;
- contract/dependency metadata;
- deterministic lookup;
- duplicate/identity validation;
- provider-neutral query surface;
- no proprietary business data coupling.

## Test target
- register/query valid entries;
- reject duplicate/conflicting identity;
- preserve version/dependency metadata;
- resolve a capability candidate referenced by a SystemAnalysis fixture;
- final `npm run verify`.

## Exit proof
The synthetic SystemAnalysis chain can discover at least one eligible software capability from Catalog without depending on implementation internals.

## Closure
Produce `P1-SPRINT-05.report.md`, open one PR to `main`, and stop for Sprint Review.
