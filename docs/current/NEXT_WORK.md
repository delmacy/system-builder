# Next Work — close P1-PACKAGE-01 review

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

P1-VERTICAL-01, P1-VERTICAL-02 and P1-VERTICAL-03 are merged. P1-PACKAGE-01 is now in its mandatory Integration & Technical Debt Review.

Review artifact:

`project_docs/execution_planning/P1-PACKAGE-01.integration-debt-review.md`

## Required review closure

1. Run repository-wide `npm run verify` through GitHub Deterministic CI on the review PR head.
2. Confirm the existing full-vertical regression still executes the successful actual-module chain twice and compares deterministic identities.
3. Keep controlled failure and secret-separation proofs green.
4. Finalize debt priorities and package disposition in the review artifact.
5. Merge the review PR before successor planning becomes repository truth.

## After review merge

Successor planning may be explicitly authorized. It must derive the next Sprint Package from the integrated evidence and debt register, not from chat history.

Highest-priority candidate prerequisites recorded by the review are:

- contract/schema conformance tests for executable boundary outputs;
- a canonical EnvironmentProfile boundary before real Deploy adapters;
- Catalog/Assembly resolution maturation before production-grade dependency graphs.

Runtime-bearing Compiler/Deploy work, persistence and real local execution are product gaps to be scheduled by the successor package rather than silently added to this review.

## Do not start yet

Do not create or execute a successor Sprint Package as part of this review unless explicit authorization is given after review closure.

## AgentFactory track

AgentFactory Supervisor/runtime remains frozen and non-blocking.
