---
id: TASK-213
title: Feed validated SystemDefinition runtime projection into Compiler
status: pending
priority: 213
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-212
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/compiler/index.ts
  - packages/assembly/index.ts
  - packages/contracts/system-definition/system-definition.schema.json
allowed_paths:
  - packages/compiler/**
  - tests/product/compiler*.test.ts
  - tests/product/runtime-compiler.test.ts
  - specs/tasks/TASK-213-P13-COMPILER-RUNTIME-PROJECTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/assembly/**
  - packages/runtime-core/**
max_files: 8
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Allow Compiler to consume a bounded, validated SystemDefinition runtime projection while preserving the canonical AssemblyPlan contract and its selected capability/provider/version identities.

# Context
TASK-212 adds explicit executable semantics to the canonical SystemDefinition. Construction A must move only runtime-relevant, validated data into deterministic generated output without broadening Assembly responsibilities or changing the public AssemblyPlan contract.

# Current behavior
Compiler currently consumes AssemblyPlan, ValidationEvidence, versions, environment requirements and state requirements. The AssemblyPlan intentionally carries selected capabilities/providers/versions rather than the full SystemDefinition entity/action/process model, so Compiler has no explicit input path for those runtime semantics.

# Required change
Introduce the minimum Compiler-local input/projection path necessary to bind a validated SystemDefinition identity to compilation and normalize its runtime-relevant entities/actions/processes deterministically. Preserve the existing AssemblyPlan public schema and capability/provider/version identities.

# Inputs / contracts
TASK-212 SystemDefinition semantics; canonical AssemblyPlan/ValidationEvidence linkage; current Compiler public API; Construction A manifest; deterministic serialization/hashing rules.

# Outputs / contracts
A bounded deterministic Compiler runtime projection/input used by later materialization tasks, with explicit SystemDefinition identity/reference validation and no shared-contract expansion beyond TASK-212.

# Acceptance criteria
- Compiler rejects missing/mismatched SystemDefinition identity/reference evidence;
- entity/action/process runtime-relevant data is normalized deterministically;
- AssemblyPlan public schema is unchanged;
- no permissions/views/auth scope from P13-PACKAGE-02 is pulled in;
- no environment or secret value is accepted;
- predecessor state.counter compilation remains byte/identity stable unless an explicitly necessary generated-file addition changes the artifact deterministically.

# Non-goals
Changing Assembly selection semantics; adding Runtime execution; modifying public AssemblyPlan/EnvironmentProfile contracts; auth/permissions/views; jobs/events/files/integrations; production deployment behavior.

# Evidence expected
Focused Compiler tests for valid projection, identity mismatch rejection, deterministic ordering and no-value acceptance, plus existing Compiler/runtime regression and repository-wide verification.

# Escalation
Stop if this requires changing the public AssemblyPlan contract or another shared contract beyond TASK-212 authority.
