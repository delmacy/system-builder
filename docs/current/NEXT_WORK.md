# Next Work — Execute P5 Integration & Technical Debt Review when authorized

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

`P5-PACKAGE-01` Integration & Technical Debt Review is MATERIALIZED / NOT_STARTED on:

`review/P5-PACKAGE-01-integration-debt`

Base:

`ca1e161d4c48454efcee1b8d1c63b32d3c6278bf` (PR #176 merged)

Manifest:

`project_docs/execution_planning/P5-PACKAGE-01.integration-debt-review.md`

Do not execute the review until explicitly instructed.

## Execution scope when later authorized

The review must:

1. reconstruct repository authority from `AGENTS.md` and the review branch;
2. run repository-wide deterministic regression with actual PostgreSQL CI;
3. reclassify P4 debt against integrated P5 evidence and identify new P5 debt;
4. revalidate contracts/architecture including ADR-0002 and ADR-0007;
5. revalidate WBS 05/06/08/09/10/13 and the current DAG/baseline relation;
6. update risks and rank successor directions by structural leverage;
7. produce one review PR and stop at the human Review Gate.

## Successor boundary

The review may recommend that a successor Sprint Package is READY_TO_BE_PLANNED after the review merges. It must not create, materialize or execute that package.

No product feature work, durable provider implementation, production deployment work or new Runtime capability is authorized by the review materialization.
