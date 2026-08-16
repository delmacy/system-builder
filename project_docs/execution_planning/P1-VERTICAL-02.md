# P1-VERTICAL-02 — Validation and Compiler

Status: COMMITTED

## Sprint Goal

Turn a deterministic AssemblyPlan into reproducible validation evidence and a synthetic ReleaseArtifact without introducing free-form AI into deterministic factory steps.

## Base and branch

- base: `c7359fbd3f89e70f8418a47abf59c2a1fd88574b`
- branch: `sprint/P1-VERTICAL-02`

## Predecessor gate

P1-VERTICAL-01 is merged into `main`. The integrated predecessor chain is:

`SystemDefinition -> Software Catalog -> deterministic resolution -> AssemblyPlan`

TASK-048 emits the existing AssemblyPlan contract shape with deterministic component ordering, source references and content hash. The current ValidationEvidence and ReleaseArtifact contracts are sufficient for the bounded Sprint scope; no public-contract change is required.

## Committed TASK order

1. TASK-049 — traceability ValidationEvidence engine.
2. TASK-050 — deterministic synthetic Compiler.
3. TASK-051 — integrated factory proof through ReleaseArtifact.

Dependency chain:

`TASK-048 -> TASK-049 -> TASK-050 -> TASK-051`

## Required growing proof

Extend the vertical chain to:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact`

Required failure proofs include broken traceability, failed declared checks, invalid/failing validation input and controlled capability/traceability failure before artifact emission.

## Final validation

`npm run verify`

GitHub Actions is the objective connected execution evidence. Do not claim local execution.

## Stop / escalation

Stop for human review before implementation completion if:

- ValidationEvidence or ReleaseArtifact cannot express the bounded output without changing a public contract;
- a new L3/L4 contract/architecture decision is required;
- a required edit falls outside a TASK's allowed paths or into forbidden paths;
- scope must expand beyond TASK-049..051;
- deterministic behavior would require secret values in immutable artifacts.

## Sprint review boundary

After TASK-051, run final CI, commit a Sprint Report, open one PR to `main`, and stop. Do not start P1-VERTICAL-03.
