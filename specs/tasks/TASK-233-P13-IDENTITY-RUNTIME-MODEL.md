---
id: TASK-233
title: Materialize deterministic Runtime identity and session model
status: ready
priority: 233
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-231
  - TASK-232
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/compiler/runtime-projection.ts
  - packages/compiler/runtime-model.ts
allowed_paths:
  - packages/compiler/runtime-model.ts
  - tests/product/compiler-runtime*.test.ts
  - specs/tasks/TASK-233-P13-IDENTITY-RUNTIME-MODEL.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Carry normalized identity/authentication/session declarations into the deterministic generated RuntimeModel without resolving runtime values.

# Context
TASK-232 produces the normalized Compiler projection. Construction A requires those declarations in the generated Runtime model before activation/authentication behavior can consume them.

# Current behavior
RuntimeModel contains entities, actions, processes, environment requirements, jobs, events, files and integrations. It has no identity/auth/session model and does not project permissions/policies/views.

# Required change
Extend RuntimeModel/materialization with immutable normalized identity/auth/session data from TASK-232. Preserve deterministic hashes/generated output and backward-compatible defaults. Do not project permissions/policies/views in Construction A.

# Inputs / contracts
TASK-232 Compiler projection; existing RuntimeModel/materializer; P13-RUNTIME-IDENTITY-SESSION-01.

# Outputs / contracts
Deterministic RuntimeModel identity/auth/session fields and focused model tests. No shared-contract change.

# Acceptance criteria
- normalized identity/auth/session data is present when declared and absent/defaulted deterministically otherwise;
- generated model contains references/metadata only, never credentials/tokens/provider values;
- identical logical input produces identical model/output identity;
- existing entity/action/workflow/service model behavior is unchanged;
- permissions/policies/views remain outside this model change.

# Non-goals
Authentication-provider execution; session token issuance; authorization; generated UI; EnvironmentProfile changes.

# Evidence expected
RuntimeModel tests proving deterministic materialization, backward compatibility and value exclusion.

# Escalation
Stop if materialization requires authorization/UI scope, a second public contract change or a new runtime ownership boundary.