---
id: TASK-584
title: Create Station Gateway application scaffold and Core port
status: completed
priority: 584
milestone: STATION-WP-01
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-583
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - project_docs/execution_planning/STATION-CONSTRUCTION-A-01.md
  - packages/contracts/station-core/**
allowed_paths:
  - apps/station-gateway/**
  - tests/product/station-gateway-boundary.test.ts
  - tsconfig.json
  - tsconfig.build.json
  - specs/tasks/TASK-584-STATION-GATEWAY-SCAFFOLD.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 9
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Create the executable Station Gateway boundary without giving it canonical business authority.

# Context
The Gateway is a dedicated Station protocol/BFF boundary. It may negotiate, route and compose but must delegate canonical reads/effects to Core/domain owners through an injected port.

# Current behavior
There is no `apps/` application boundary and no Station Gateway. Existing domain packages are callable only as repository modules and must not be imported ad hoc by future Station code.

# Required change
Add `apps/station-gateway/**` with a public handler/service surface that consumes Station protocol envelopes and delegates canonical reads/effects to an injected `StationCorePort`. Add application paths to TypeScript build configuration.

# Inputs / contracts
TASK-583 `station-core` contract and ADR-0016. The injected port is a Gateway-side dependency abstraction, not a new semantic owner.

# Outputs / contracts
A compileable Station Gateway application boundary, `StationCorePort` interface and deterministic boundary tests.

# Acceptance criteria
Gateway negotiates protocol and routes query/command/subscription calls through the injected Core port; it stores no canonical domain state; deterministic diagnostics are returned for unsupported/invalid requests; no private domain/Core implementation is imported.

# Non-goals
No real network listener, database, auth provider, federation, provider-specific logic, business rules or production session store.

# Evidence expected
Tests prove delegation to the injected port, fail-closed diagnostics, absence of canonical mutation inside the Gateway and build inclusion of the new application path.

# Escalation
Stop if implementation requires direct imports from forbidden Core/domain internals, a business-rule decision in the Gateway, persistent canonical state or a mandatory transport choice.
