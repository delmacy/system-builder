---
id: TASK-221
title: Add bounded Runtime service execution descriptors to SystemDefinition
status: ready
priority: 221
milestone: M13
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-PACKAGE-01.md
  - project_docs/execution_planning/P13-PACKAGE-01.construction-b-l3-change-control.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - docs/adr/ADR-0002-autonomous-runtime.md
allowed_paths:
  - packages/contracts/system-definition/**
  - tests/product/system-definition*.test.ts
  - specs/tasks/TASK-221-P13-RUNTIME-SERVICE-DESCRIPTORS.md
forbidden_paths:
  - .github/**
  - packages/contracts/environment-profile/**
  - packages/compiler/**
  - packages/runtime-core/**
  - packages/deploy/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Add only the accepted additive/backward-compatible SystemDefinition semantics required to explicitly describe Construction B jobs, events, files/storage and integration invocation.

# Context
The integrated bounded L3 change control authorizes only optional declarative execution descriptors inside the existing SystemDefinition family for WBS 13.1.2/13.1.3. Construction A already proves explicit action execution and Runtime autonomy; Construction B must reuse those boundaries without inferred behavior or a new L4 decision.

# Current behavior
SystemDefinition currently exposes entities, processes, actions, integrations and environmentRequirements, but has no public job/event/file execution structures and integration entries have no executable invocation semantics.

# Required change
Add optional `jobs`, `events` and `files` collections and additive optional integration invocation fields. Concrete semantics are exactly those recorded in the Sprint manifest: interval jobs with explicit action target and recordId; runtime-http events with explicit actionRef; file descriptors with explicit put/get/delete operations and storage `bindingRef`; integration descriptors with explicit HTTP method/relative path and external-service `bindingRef`.

References must be explicit and values remain descriptive/reference-only. Historical valid fixtures without these fields remain valid.

# Inputs / contracts
Canonical SystemDefinition schema and fixtures; accepted Construction B L3 change-control record; Construction B Sprint manifest; ADR-0002 autonomous Runtime boundary.

# Outputs / contracts
Backward-compatible additive SystemDefinition schema semantics and product tests/fixtures for jobs, events, files/storage and integration invocation. No other shared-contract family changes.

# Acceptance criteria
- positive fixtures cover each new descriptor;
- malformed trigger/source/operation/invocation descriptors fail validation;
- no credential, endpoint value, storage root value or resolved configuration field is introduced;
- old fixtures remain valid;
- no other shared-contract family changes;
- no L4 boundary is introduced.

# Non-goals
Compiler/runtime/deploy implementation; EnvironmentProfile changes; provider selection; broker/object-store topology; auth/views/permissions.

# Evidence expected
Updated schema plus positive/negative product tests proving backward compatibility, explicit references, malformed declaration rejection and no-value-leak constraints; declared validations green.

# Escalation
Stop if faithful declaration requires semantics outside the accepted Construction B L3 envelope or any L4 decision.
