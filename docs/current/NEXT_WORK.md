# Next Work — after P1-VERTICAL-01 review

The repository is authoritative. Do not use chat history as technical authority.

## Current gate

P1-VERTICAL-01 has implemented TASK-045..048 and passed objective GitHub CI on the implementation head. Complete Sprint Review/merge before committing the next forecast Sprint.

## After P1-VERTICAL-01 merges

1. Re-read `AGENTS.md`, current state/milestone, Sprint Generation Policy, Sprint Mode and `P1-PACKAGE-01.md`.
2. Inspect the actual integrated outputs of TASK-048 and the existing ValidationEvidence/ReleaseArtifact contracts.
3. Revalidate `P1-VERTICAL-02.md` and TASK-049..051 against those outputs.
4. If still valid, promote TASK-049, TASK-050 and TASK-051 from `draft` to `ready` in dependency order and record the committed Sprint manifest before product code edits.
5. Create `sprint/P1-VERTICAL-02` from synchronized `main`.
6. Execute TASK-049 — ValidationEvidence traceability engine; tests; commit.
7. Execute TASK-050 — deterministic synthetic Compiler; tests; commit.
8. Execute TASK-051 — integrated factory E2E through ReleaseArtifact; tests; commit.
9. Run final `npm run verify` through GitHub CI, produce Sprint Report and stop for Sprint Review.

## Growing proof target

Extend:

`SystemDefinition -> Catalog -> AssemblyPlan`

to:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact`

Use actual module APIs. Do not hand-author downstream artifacts that have an executable producer.

## Later forecast

P1-VERTICAL-03 remains forecast and must be revalidated only after P1-VERTICAL-02 merges.

## AgentFactory track

AgentFactory Supervisor/runtime remains frozen and non-blocking.
