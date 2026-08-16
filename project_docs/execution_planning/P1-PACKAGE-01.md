# P1-PACKAGE-01 — First Executable Vertical Slice

Status: ACTIVE PACKAGE

## Package Goal

Move from the completed public contract spine into the first deterministic executable System Builder slice, ending with a dry-run DeploymentRecord that can be reproduced from repository fixtures.

The package follows `project_docs/schedule/SPRINT_GENERATION_POLICY.md` and contains three construction Sprints followed by one integration/technical-debt review.

## Baseline

- base after contract consolidation: `main` at/after PR #151;
- contract spine available: ProcessMirror -> BusinessRecipe -> SystemAnalysis -> SystemDefinition -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> DeploymentRecord;
- AgentFactory Supervisor/runtime remains frozen and is not a package gate.

## Sprint sequence

### P1-VERTICAL-01 — Catalog and Assembly

Committed when started.

TASKs:
- TASK-045 — Product test harness baseline;
- TASK-046 — Software Catalog registry;
- TASK-047 — provider-neutral deterministic Catalog resolution;
- TASK-048 — minimal deterministic Assembly resolver.

Exit proof: a SystemDefinition capability set resolves against a synthetic Software Catalog and produces a deterministic AssemblyPlan or an explicit reproducible diagnostic.

### P1-VERTICAL-02 — Validation and Compiler

Forecast until P1-VERTICAL-01 is merged.

TASKs:
- TASK-049 — traceability ValidationEvidence engine;
- TASK-050 — deterministic synthetic Compiler;
- TASK-051 — integrated factory proof through ReleaseArtifact.

Exit proof: a resolved AssemblyPlan receives deterministic validation evidence and compiles to a reproducible ReleaseArtifact.

### P1-VERTICAL-03 — Release and Deploy

Forecast until P1-VERTICAL-02 is merged.

TASKs:
- TASK-052 — immutable Release registry/lifecycle;
- TASK-053 — deterministic Deploy dry-run/environment binding;
- TASK-054 — first full deploy vertical proof.

Exit proof: the synthetic chain reaches PublishedRelease and DeploymentRecord without secret values entering immutable artifacts.

## Integration & Technical Debt Review

After P1-VERTICAL-03:

- run full repository regression;
- run the complete synthetic chain at least twice and compare deterministic identities;
- classify technical debt;
- revalidate contracts, WBS/DAG and module boundaries;
- record missing persistence/UI/runtime work;
- decide the next package from actual integrated evidence.

## Package rules

- only the active Sprint is committed; later Sprints remain forecast;
- each TASK has its own commit inside its Sprint branch;
- each implementation TASK includes positive, negative and predecessor-integration tests where applicable;
- every Sprint extends the growing E2E proof;
- `main` is the only published truth after merge;
- Sprint reports distinguish `IMPLEMENTED_ON_SPRINT_BRANCH`, `CI_PASS` and `MERGED`.
