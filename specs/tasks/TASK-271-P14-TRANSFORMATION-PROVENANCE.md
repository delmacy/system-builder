---
id: TASK-271
title: Add transformation provenance descriptor semantics
status: ready
priority: 271
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-270]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-271-P14-TRANSFORMATION-PROVENANCE.md
forbidden_paths:
  - .github/**
  - packages/runtime-core/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Represent how evidence/artifacts were transformed without coupling the core contract to a tool or provider.

# Context
WBS 14.2.2 requires transformation/tool/provider provenance while ADR-0009 forbids mandatory provider resource identifiers in core provenance.

# Required change
Define a deterministic optional transformation descriptor carrying stable operation identity/version and optional tool/provider-neutral producer details; provider-specific data remains namespaced optional metadata.

# Acceptance criteria
- transformation identity/version is explicit when descriptor is present;
- tool/provider details are optional and do not become required core identity;
- no credentials, account IDs or mandatory hosted-service locators;
- deterministic validation and normalization;
- provenance remains evidence only.

# Non-goals
Executing transformations, tool selection, provider routing or workflow orchestration.

# Evidence expected
Contract tests for portable, provider-extension and invalid/leaky cases.

# Escalation
Stop if provider-specific topology would become mandatory contract meaning.
