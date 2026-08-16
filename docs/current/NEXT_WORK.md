# Next Work — Review P4 Integration & Technical Debt

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

Execute only the mandatory `P4-PACKAGE-01` Integration & Technical Debt Review on `review/P4-PACKAGE-01-integration-debt`.

Review document:
`project_docs/execution_planning/P4-PACKAGE-01.integration-debt-review.md`

## Required review actions

1. run the repository-wide deterministic regression with the actual PostgreSQL CI service;
2. classify P3 debt closed/carried by P4 and new P4 debt;
3. revalidate ADR-0002, ADR-0007, canonical contracts, WBS and dependency/readiness conclusions;
4. reconcile stale post-merge state from P4-CAPABILITY-RUNTIME-01;
5. produce successor readiness recommendations only;
6. require final Deterministic CI PASS and stop at the package Review Gate.

## Successor boundary

Do not create a next Sprint Package, Sprint manifest, TASK or construction branch during this review.

After the review PR merges, await a new explicit instruction, then reconstruct `main` from `AGENTS.md` and derive the next package from merged review findings and then-current WBS/contracts/ADRs.
