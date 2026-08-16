# P1-VERTICAL-03 — Release and Deploy

Status: COMMITTED

## Sprint Goal

Register an immutable PublishedRelease, bind it to an Environment profile without mutating the artifact, execute a deterministic local/dry-run deployment proof and emit DeploymentRecord.

## Base and branch

- base: `2404a3b6b6ea7bd02166e840d45a7e4140005bbc`
- branch: `sprint/P1-VERTICAL-03`

## Predecessor gate

P1-VERTICAL-02 is merged into `main`. The integrated predecessor chain reaches a deterministic ReleaseArtifact through actual Catalog, Assembly, Validation and Compiler APIs.

The existing PublishedRelease and DeploymentRecord contracts, WBS 09/10, ADR-0007 and accepted Master Blueprint are sufficient for this bounded Sprint. No public-contract or architecture change is authorized or required.

## Committed TASK order

1. TASK-052 — immutable Release registry/lifecycle.
2. TASK-053 — deterministic Deploy dry-run/environment binding.
3. TASK-054 — first full deploy vertical proof.

Dependency chain:

`TASK-051 -> TASK-052 -> TASK-053 -> TASK-054`

## Required growing proof

Extend the vertical chain to:

`ProcessMirror -> BusinessRecipe -> SystemAnalysis -> SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> DeploymentRecord`

Required failure proofs include duplicate published identity rejection, invalid lifecycle transition, Release/Environment incompatibility, failed acceptance check and proof that secret values never enter immutable ReleaseArtifact/PublishedRelease metadata.

## Final validation

`npm run verify`

GitHub Actions is the objective connected execution evidence. Do not claim local execution.

## Stop / escalation

Stop for human review before implementation completion if:

- PublishedRelease or DeploymentRecord cannot express the bounded output without a public-contract change;
- Release/Environment/Deployment separation or autonomous-runtime boundaries would change;
- a required edit falls outside a TASK's allowed paths or into forbidden paths;
- scope must expand beyond TASK-052..054;
- immutable release metadata would need secret values.

## Sprint review boundary

After TASK-054, run final CI, commit a Sprint Report, open one PR to `main`, and stop. Do not start another construction Sprint or the package Integration & Technical Debt Review without new authorization.
