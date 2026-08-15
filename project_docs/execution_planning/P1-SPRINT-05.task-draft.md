# P1-SPRINT-05 task draft — Catalog minimal registry

This draft is intentionally not assigned a TASK-NNN identifier yet. Materialize it as the Sprint's primary TASK only after P1-SPRINT-04 is integrated and actual contract outputs are available.

## Objective
Implement the smallest provider-neutral software capability/component registry required by the first vertical slice.

## Inputs
- SystemAnalysis/SystemDefinition public contracts;
- downstream boundary contracts from P1-SPRINT-04;
- Catalog WBS 5.2 and 5.3 identity/compatibility rules.

## Outputs
- versioned registry entry model;
- deterministic register/query API or package surface;
- synthetic fixtures;
- focused tests.

## Acceptance
- capability/component entries retain version, contract and dependency metadata;
- duplicate/conflicting identity is rejected;
- lookup is provider-neutral and deterministic;
- Business Catalog and Software Catalog semantics are not collapsed;
- the SystemAnalysis fixture can discover at least one eligible capability candidate;
- `npm run verify` passes.

## Non-goals
Full search engine, UI, remote registry, proprietary data ingestion or ranking intelligence.
