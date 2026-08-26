---
id: TASK-318
title: Prove SystemDefinition schema publication equivalence
status: ready
priority: 318
milestone: PRE-M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-317
context_paths:
  - project_docs/execution_planning/PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01.md
  - specs/tasks/TASK-317-SYSTEM-DEFINITION-SCHEMA-IDENTITY.md
  - packages/contracts/system-definition/**
allowed_paths:
  - packages/contracts/system-definition/**
  - tests/product/**
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-318-SYSTEM-DEFINITION-SCHEMA-PUBLICATION-PROOF.md
forbidden_paths:
  - project_docs/16-ai-gateway/**
  - packages/runtime/**
  - packages/compiler/**
max_files: 7
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide deterministic evidence that the SystemDefinition schema exposed by canonical identity/publication is equivalent to the schema imported by internal consumers.

# Context
TASK-317 unifies the schema identity. This follow-up must prove that publication/dereference and direct imports remain semantically equivalent for the complete contract.

# Current behavior
Before TASK-317, extension fields could remain available to internal consumers while disappearing from the publishable schema surface; no deterministic equivalence proof prevented that regression.

# Required change
Add focused deterministic tests for canonical publication/import equivalence across representative base, identity/session and authority/generated-interaction fields without introducing a registry or service.

# Inputs / contracts
The canonical SystemDefinition identity/export produced by TASK-317, existing SystemDefinition schemas and representative valid/invalid fixtures.

# Outputs / contracts
A regression-proof test boundary demonstrating that canonical publication and imported schema semantics remain equivalent for the supported SystemDefinition contract.

# Acceptance criteria
- tests validate representative base, identity/session and authority/generated-interaction fields through both publication and imported paths;
- a regression that drops an extension from the publishable schema fails;
- schema identity remains stable unless existing repository policy explicitly requires otherwise;
- no production Runtime/Compiler behavior is modified;
- declared validations pass.

# Non-goals
No new schema registry, network publication service, provider integration or broad contract redesign.

# Evidence expected
Focused equivalence tests plus successful unit, product, task, architecture and repository verification gates.
