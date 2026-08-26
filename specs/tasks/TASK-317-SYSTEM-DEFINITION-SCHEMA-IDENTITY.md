---
id: TASK-317
title: Unify canonical SystemDefinition schema identity
status: ready
priority: 317
milestone: PRE-M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01.md
  - packages/contracts/system-definition/**
  - docs/adr/**
allowed_paths:
  - packages/contracts/system-definition/**
  - tests/product/**
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-317-SYSTEM-DEFINITION-SCHEMA-IDENTITY.md
forbidden_paths:
  - project_docs/16-ai-gateway/**
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Ensure that the canonical SystemDefinition schema identity resolves to the complete contract actually imported and consumed by the repository, including integrated identity/session and authority/generated-interaction extensions.

# Required change
Implement the minimum additive/backward-compatible L3 hardening so `SYSTEM_DEFINITION_SCHEMA_ID`, the publishable/dereferenceable schema representation, and the canonical imported schema no longer describe materially different contracts.

# Acceptance criteria
- one canonical identity maps to one semantically complete SystemDefinition contract;
- identity/session and authority/generated-interaction fields remain represented;
- existing valid fixtures and consumers remain valid;
- malformed/unsupported shapes still fail as before or more strictly where already required;
- no new schema-versioning policy is invented;
- no Builder/Runtime architecture change occurs;
- declared validations pass.

# Non-goals
No M16 provider work, Runtime behavior change, Compiler behavior change, storage topology, migrations, productization work or unrelated schema redesign.

# Escalation
Stop if the only valid solution requires a new versioning policy, breaking public compatibility or an L4 architecture decision.