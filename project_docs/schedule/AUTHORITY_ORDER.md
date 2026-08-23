# Planning Authority Order

Scheduling and Sprint materialization operate under repository authority; they do not create architecture or product authority by themselves.

## Precedence

When interpreting or promoting work, use this order:

1. accepted architecture decisions and constitutional invariants in `AGENTS.md`;
2. public/shared contracts, schemas and accepted ADRs;
3. approved Scope Baseline, WBS and Work Package authority;
4. current repository memory (`PROJECT_STATE`, `CURRENT_MILESTONE`, `NEXT_WORK`);
5. active Work Package/Sprint manifest and committed TASK specifications;
6. DAG/readiness/schedule/forecast artifacts.

A more specific active TASK may refine implementation inside authority already granted by higher layers, but it may not silently override them.

## Promotion rule

READY, FORECAST, candidate, backlog or DAG status means planning eligibility only. Execution authority exists only when repository policy promotes a Sprint/TASK to the commitment horizon after fresh-main and predecessor revalidation.

Scheduling may order and refine approved work, but it must not redefine architecture, contract semantics, Builder/Runtime boundaries, release ownership or scope. Any unresolved conflict must be reconciled before affected work is marked COMMITTED or executed. L4 changes require ADR authority; undeclared L3 changes require explicit Sprint/change authority.
