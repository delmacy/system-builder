---
id: TASK-294
title: Certify successful migration preflight preserves evidence provenance
status: ready
priority: 294
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-293]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-MIGRATION-CERTIFICATION-01.md
  - packages/deploy/migration-preflight.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/deploy/index.ts
  - tests/product/p14-provenance-migration-compiled-boundary.test.ts
allowed_paths:
  - tests/product/p14-provenance-migration-preflight-preservation.test.ts
  - specs/tasks/TASK-294-P14-MIGRATION-PROVENANCE-PREFLIGHT-PRESERVATION.md
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
Certify provenance preservation across the actual existing Deploy migration-preflight boundary and downstream Release/Deploy propagation.

# Context
TASK-293 proves coexistence in Compiler output. This TASK must invoke `preflightVerifiedMigrations` on those real generated files and then continue through the real Release -> Deploy chain without hand-authoring a migration result.

# Current behavior
Migration preflight verifies manifest/file identity and hashes, while P14 provenance propagation separately reaches Release and Deploy; their composed preservation is unproven.

# Required change
Add a product test that compiles a real migration-bearing artifact with provenance, runs actual migration preflight successfully, publishes the release and performs dry-run deploy, asserting canonical provenance identity/integrity data remains equivalent at every boundary.

# Inputs / contracts
TASK-293 proof pattern, `preflightVerifiedMigrations`, `ReleaseRegistry`, `dryRunDeploy`, evidence provenance contract.

# Outputs / contracts
Evidence-only product proof; no new public API or persistence topology.

# Acceptance criteria
- Uses actual Compiler migration files and manifest.
- Actual migration preflight returns deterministic verified migration descriptors.
- Compiler, Release and Deployment provenance remain canonically equivalent.
- Migration descriptors contain only symbolic secret-reference binding names, never values.
- Equivalent repeated execution is deterministic.
- Declared validations pass.

# Non-goals
No migration execution against a database, no provider SDK, no new migration engine, no production mutation.

# Evidence expected
Focused composed product test plus repository verification.

# Escalation
Stop if the proof cannot use the current Compiler/Deploy migration boundary without changing architecture.
