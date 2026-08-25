---
id: TASK-293
title: Prove compiled Runtime migration bundle coexists with canonical evidence provenance
status: ready
priority: 293
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-MIGRATION-CERTIFICATION-01.md
  - packages/compiler/index.ts
  - packages/runtime-core/state-migrations.ts
  - packages/contracts/evidence-provenance/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - tests/product/p14-provenance-migration-compiled-boundary.test.ts
  - specs/tasks/TASK-293-P14-MIGRATION-PROVENANCE-COMPILED-BOUNDARY.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove from actual Compiler output that canonical evidence provenance and the existing Runtime migration bundle coexist deterministically without changing either contract.

# Context
Construction A/B already provide integrity and navigation. The remaining WBS 14.3.3 proof must bind to the existing RuntimeStateRequirement -> Compiler migration-manifest/migration-files boundary instead of inventing a provenance migration framework.

# Current behavior
Compiler can materialize Runtime migrations and independently carry evidence provenance, but no focused proof exercises both in one compiled artifact.

# Required change
Add a product test that calls the real Compiler with explicit stateRequirements, required external secret-reference binding metadata and evidenceProvenance. Assert migration files/manifest are emitted and provenance is canonical/preserved on the ReleaseArtifact.

# Inputs / contracts
Existing `compileSyntheticRelease`, `RuntimeStateRequirement`, evidence-provenance normalization and ADR-0009.

# Outputs / contracts
Evidence-only product proof. No product/public contract change.

# Acceptance criteria
- Uses actual Compiler output, not hand-authored downstream artifacts.
- Produces at least one verified migration descriptor/file and canonical provenance in the same compilation.
- Equivalent input is deterministic.
- Historical compilation without provenance remains valid.
- No secret value, provider resource identifier or storage locator is introduced.
- Declared validations pass.

# Non-goals
No migration execution, database mutation, new migration framework, provider topology, Runtime Audit Trail or authorization semantics.

# Evidence expected
Focused product test plus repository verification.

# Escalation
Stop only if the proof requires product/contract changes or undeclared L4 architecture.
