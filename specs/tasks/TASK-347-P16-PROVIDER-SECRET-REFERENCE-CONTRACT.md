---
id: TASK-347
title: Define portable provider secret reference contract
status: completed
priority: 347
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-346]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/16-ai-gateway/WBS.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-347-P16-PROVIDER-SECRET-REFERENCE-CONTRACT.md
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
Define a portable reference-only contract ensuring provider credentials/secrets are never embedded in AI Gateway artifacts.
# Context
WBS 16.3.2 requires secrets/provider credentials outside artifacts; credential lifecycle remains explicitly out of scope.
# Current behavior
No WBS 16.3 canonical reference-only contract proves that portable AI Gateway configuration excludes secret material.
# Inputs / contracts
Integrated provider-neutral contracts and WBS 16.3.2 authority.
# Outputs / contracts
Versioned secret reference descriptor, fail-closed normalization and leakage-focused tests.
# Required change
Represent only opaque external secret references and reject credential-like value fields or malformed references.
# Acceptance criteria
No secret value field exists; suspicious/malformed value-bearing inputs fail closed; provider-neutral; no lookup/rotation/storage semantics; validations pass.
# Non-goals
No secret store, issuance, rotation, revocation, provider registry or remote topology.
# Evidence expected
Product tests proving reference-only portability and rejection of embedded secret material.
# Escalation
Stop if implementation requires credential lifecycle or changes artifact/release architecture.
