---
id: TASK-295
title: Prove migration failure cannot produce false provenance preservation success
status: ready
priority: 295
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-294]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-MIGRATION-CERTIFICATION-01.md
  - packages/deploy/migration-preflight.ts
  - tests/product/p14-provenance-migration-preflight-preservation.test.ts
allowed_paths:
  - tests/product/p14-provenance-migration-fail-closed.test.ts
  - specs/tasks/TASK-295-P14-MIGRATION-PROVENANCE-FAIL-CLOSED.md
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
Prove malformed or tampered Runtime migration material fails before any preservation success can be claimed.

# Context
Successful certification is insufficient unless migration hash/manifest failures are fail-closed. Existing Deploy migration preflight already provides explicit errors and must remain authoritative.

# Current behavior
Migration preflight rejects malformed/missing/tampered migration material, but P14 lacks a provenance-focused negative proof that prevents false migration-preservation success.

# Required change
Add product tests that derive actual Compiler migration output, tamper only test copies of migration content/hash/coverage, invoke actual preflight and assert explicit rejection. Demonstrate no downstream Release/Deploy preservation assertion is made after failed preflight.

# Inputs / contracts
Existing migration preflight errors and TASK-294 composed proof.

# Outputs / contracts
Negative evidence only. No product/public contract change.

# Acceptance criteria
- Covers hash mismatch and at least one manifest/file coverage failure.
- Uses actual Compiler-produced material before test-local tampering.
- Failure is explicit and deterministic.
- Provenance data is never used to bypass migration validation.
- No secret/provider/storage values appear in diagnostics/evidence.
- Declared validations pass.

# Non-goals
No recovery engine, database rollback, mutation of published artifacts, or authorization semantics.

# Evidence expected
Focused negative product tests plus repository verification.

# Escalation
Stop only if a required negative case cannot be expressed through the existing preflight API.
