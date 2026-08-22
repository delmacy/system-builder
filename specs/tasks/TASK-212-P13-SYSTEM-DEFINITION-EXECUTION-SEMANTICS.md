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

# Context
P13-PACKAGE-01 covers WBS 13.1.1-13.1.3. Planning found that the canonical SystemDefinition already declares entities, actions and processes, but actions lack explicit executable effects and processes expose states without explicit transitions. Runtime execution must consume explicit durable semantics rather than guess behavior. ADR-0002 remains the controlling Builder/Runtime boundary and no L4 change was identified.

# Current behavior
The SystemDefinition contract records action identity/name/requirementRefs and process identity/name/requirementRefs/states. Those shapes are sufficient for declarative intent but not for faithful Runtime execution of an action effect or workflow transition. Existing valid fixtures and downstream consumers depend on the current contract and must remain compatible.

# Required change
Extend the existing contract additively so an action can explicitly describe the bounded runtime operation it performs and a process can explicitly describe allowed transitions. Preserve existing identity/requirementRefs fields and valid historical fixtures. Do not encode implementation-provider ownership, Builder calls, credentials, resolved configuration values or authoring behavior.

# Inputs / contracts
Canonical SystemDefinition 1.0.0 schema and fixtures; P13-PACKAGE-01 and Construction A manifest; WBS 13.1.1; ADR-0002 Builder/Runtime separation; repository task/contract compatibility rules.

# Outputs / contracts
Backward-compatible additive SystemDefinition schema semantics and fixtures/tests proving explicit action effects and workflow transitions. No change to AssemblyPlan, EnvironmentProfile, ReleaseArtifact or other shared contract families.

# Acceptance criteria
- old valid SystemDefinition fixtures remain valid;
- new fixtures prove explicit action effect and workflow transition declarations;
- malformed/ambiguous executable declarations fail schema validation;
- secret/config values cannot be embedded through the new fields;
- change is L3 only and requires no new Builder/Runtime boundary or ADR;
- no unrelated contract is changed.

# Non-goals
Implementing Compiler or Runtime behavior; changing AssemblyPlan or EnvironmentProfile; auth/roles/permissions/views; jobs/events/files/integrations; Mirror/Recipe authoring; Release/Deploy topology; any L4 architecture change.

# Evidence expected
Updated schema and bounded fixtures/tests showing backward compatibility, positive explicit declarations, negative malformed declarations and no-value-leak constraints; `npm run test:product`, `npm run check:tasks` and repository-wide verification green.

# Escalation
Stop if faithful executable semantics require an L4 ownership/boundary decision or a second shared-contract family change.
