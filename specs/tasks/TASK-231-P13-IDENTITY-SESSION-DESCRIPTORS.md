---
id: TASK-231
title: Add bounded identity authentication and session descriptors to SystemDefinition
status: ready
priority: 231
milestone: M13
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-PACKAGE-02.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - project_docs/27-identity-organization-authorization/WBS.md
  - project_docs/27-identity-organization-authorization/scope/README.md
  - packages/contracts/system-definition/system-definition.schema.json
  - packages/contracts/environment-profile/environment-profile.schema.json
  - docs/adr/ADR-0002-autonomous-runtime.md
allowed_paths:
  - packages/contracts/system-definition/**
  - tests/product/system-definition*.test.ts
  - specs/tasks/TASK-231-P13-IDENTITY-SESSION-DESCRIPTORS.md
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
Add only the minimum backward-compatible L3 SystemDefinition semantics required to declare autonomous Runtime identity, replaceable authentication-provider binding and bounded session policy without embedding credentials or implying authorization.

# Context
P13-PACKAGE-02 WBS 13.2.1 requires auth/session/identity bindings. WBS 27 already establishes separation between Person/Actor/User-ServiceIdentity and replaceable auth-provider binding. The canonical SystemDefinition already declares permissions/policies/views, but those are outside Construction A execution scope.

# Current behavior
SystemDefinition declares entities, processes, actions, jobs, events, files, capabilities, views, permissions, policies, integrations and environment requirements, but it has no subject/technical-identity, authentication-provider or session declaration. Runtime therefore cannot derive WBS 13.2.1 behavior from the canonical contract without guessing.

# Required change
Extend the existing SystemDefinition family additively with explicit reference-oriented semantics sufficient to represent subject/technical identity mapping, active/disabled identity state, explicit authentication-provider binding/reference and bounded session lifetime/validity policy. Historical fixtures must remain valid. Do not encode provider credentials, passwords, bearer tokens, signing keys, resolved endpoints or other runtime values. Authentication success must not imply permission/role authorization.

# Inputs / contracts
Canonical SystemDefinition 1.0.0; existing EnvironmentProfile binding kinds as reference targets; WBS 13.2.1; WBS 27 identity authority; ADR-0002; P13-RUNTIME-IDENTITY-SESSION-01.

# Outputs / contracts
Additive SystemDefinition identity/auth/session declarations plus positive, negative and backward-compatibility tests. No second shared-contract family change.

# Acceptance criteria
- old valid SystemDefinition fixtures remain valid;
- person-backed user identity and service identity are explicitly representable without conflation;
- disabled identity state is explicit;
- authentication provider/binding reference is explicit and unresolved;
- session lifetime/validity metadata is explicit and bounded;
- malformed declarations fail validation where schema-level validation can prove them;
- no credential/token/key/resolved endpoint value field is introduced;
- permissions/policies/views executable semantics are unchanged;
- no L4 boundary is introduced.

# Non-goals
Compiler/Runtime implementation; authorization evaluation; role assignment; organization/delegation completeness; UI rendering; provider-specific IAM/SSO; EnvironmentProfile schema changes; P13-PACKAGE-03; TD-P13-01..04.

# Evidence expected
Updated SystemDefinition schema/fixtures/tests proving additive compatibility, explicit identity/auth/session references, disabled-state representation and secret/value exclusion.

# Escalation
Stop if faithful WBS 13.2.1 semantics require a new bounded context, another shared-contract family change, Builder runtime lookup or any L4 architecture decision.