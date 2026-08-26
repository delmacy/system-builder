---
id: TASK-337
title: Define permitted model execution metadata contract
status: ready
priority: 337
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-334
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-337-P16-EXECUTION-METADATA-CONTRACT.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define a provider-neutral execution metadata contract for model/version/cost/provenance fields when explicitly permitted by governance.

# Context
WBS 16.2.3 requires execution metadata to be recorded when allowed, while central contracts must remain provider-neutral and deterministic paths must not depend on AI availability.

# Current behavior
No canonical permission-aware execution metadata shape exists in the AI Gateway contract boundary.

# Inputs / contracts
- TASK-334 governance policy descriptor;
- integrated WBS 16.1 request/response contracts.

# Outputs / contracts
- versioned execution metadata descriptor with explicit permission semantics;
- deterministic fail-closed normalization;
- product tests proving omission when not permitted.

# Required change
Represent model/version/cost/provenance metadata without credentials/secrets or implicit provider authority. Metadata must be optional-by-permission, explicit and deterministic.

# Acceptance criteria
- metadata is emitted/accepted only when explicitly permitted by the contract input;
- absent permission does not inject defaults or hidden metadata;
- cost values are finite/non-negative and provenance references are explicit;
- no secret/provider credential material is permitted;
- metadata does not imply authorization/approval;
- declared validations pass.

# Non-goals
No billing engine, secret management, remote telemetry, Runtime Audit Trail replacement, WBS 16.3 observation or provider registry.

# Evidence expected
Product tests for permitted metadata, forbidden/absent metadata, invalid costs/provenance and predecessor compatibility.

# Escalation
Stop if implementation requires secret lifecycle, remote telemetry/storage topology or architecture change.
