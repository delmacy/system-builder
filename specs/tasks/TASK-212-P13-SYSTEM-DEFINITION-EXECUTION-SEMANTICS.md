---
id: TASK-212
title: Add bounded executable action and workflow semantics to SystemDefinition
status: ready
priority: 212
milestone: M13
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-PACKAGE-01.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - docs/adr/ADR-0002-autonomous-runtime.md
allowed_paths:
  - packages/contracts/system-definition/**
  - tests/product/system-definition*.test.ts
  - specs/tasks/TASK-212-P13-SYSTEM-DEFINITION-EXECUTION-SEMANTICS.md
forbidden_paths:
  - .github/**
  - packages/contracts/environment-profile/**
  - packages/contracts/factory-boundary/**
  - packages/compiler/**
  - packages/runtime-core/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Add only the minimum backward-compatible L3 SystemDefinition semantics required to declare executable action effects and workflow transitions instead of inferring behavior from action names or state lists.

# Required change
Extend the existing contract additively so an action can explicitly describe the bounded runtime operation it performs and a process can explicitly describe allowed transitions. Preserve existing identity/requirementRefs fields and valid historical fixtures. Do not encode implementation-provider ownership, Builder calls, credentials, resolved configuration values or authoring behavior.

# Acceptance criteria
- old valid SystemDefinition fixtures remain valid;
- new fixtures prove explicit action effect and workflow transition declarations;
- malformed/ambiguous executable declarations fail schema validation;
- secret/config values cannot be embedded through the new fields;
- change is L3 only and requires no new Builder/Runtime boundary or ADR;
- no unrelated contract is changed.

# Escalation
Stop if faithful executable semantics require an L4 ownership/boundary decision or a second shared-contract family change.
