---
id: TASK-213
title: Feed validated SystemDefinition runtime projection into Compiler
status: pending
priority: 213
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
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

# Acceptance criteria
- Compiler rejects missing/mismatched SystemDefinition identity/reference evidence;
- entity/action/process runtime-relevant data is normalized deterministically;
- AssemblyPlan public schema is unchanged;
- no permissions/views/auth scope from P13-PACKAGE-02 is pulled in;
- no environment or secret value is accepted;
- predecessor state.counter compilation remains byte/identity stable unless an explicitly necessary generated-file addition changes the artifact deterministically.

# Escalation
Stop if this requires changing the public AssemblyPlan contract or another shared contract beyond TASK-212 authority.
