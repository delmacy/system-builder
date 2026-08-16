# Next Work — P3 Integration & Technical Debt Review

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

P3 construction Sprints are merged through PR #165. Execute only the mandatory `P3-PACKAGE-01` Integration & Technical Debt Review.

## Review checklist

1. run `npm run verify` through Deterministic CI on the review head;
2. verify the integrated package chain using actual producer evidence already in the repository;
3. revalidate ADR-0002 and ADR-0007 boundaries;
4. classify inherited P2 debt as closed/carried;
5. register residual/new P3 debt with priorities and dispositions;
6. revalidate WBS/DAG readiness;
7. update current-state docs and package status;
8. run final review-head CI and stop at the review PR.

## Successor rule

Do not create a successor Sprint Package during this review. After the review PR merges, await a new explicit instruction and re-read repository authority before selecting the next package.
