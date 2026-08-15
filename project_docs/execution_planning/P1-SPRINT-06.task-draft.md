# P1-SPRINT-06 task draft — Assembly minimal resolver

Materialize this draft as the Sprint primary TASK only after P1-SPRINT-05 integrates, so the exact Catalog interfaces are known.

## Objective
Implement the smallest deterministic resolver that maps SystemDefinition requirements plus Catalog candidates into an AssemblyPlan or reproducible diagnostic.

## Outputs
- bounded resolver package/API;
- BOM/source references;
- deterministic diagnostics;
- synthetic fixtures and focused tests.

## Acceptance
- successful candidate resolution is deterministic;
- missing capability and incompatible version fail explicitly;
- direct dependencies are represented;
- repeated identical inputs produce equivalent AssemblyPlan identity/content;
- unsupported conflict/cycle cases fail closed rather than guessing;
- `npm run verify` passes.

## Non-goals
Global optimization, marketplace ranking, full migration planning or production code generation.
