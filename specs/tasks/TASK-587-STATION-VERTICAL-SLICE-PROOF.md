---
id: TASK-587
title: Prove Station to Gateway to Core-port vertical slice
status: blocked
priority: 587
milestone: STATION-WP-01
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-584
  - TASK-585
  - TASK-586
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - project_docs/execution_planning/STATION-CONSTRUCTION-A-01.md
  - packages/contracts/station-core/**
  - packages/station-sdk/**
  - apps/station-gateway/**
  - apps/station/**
allowed_paths:
  - packages/contracts/station-core/**
  - packages/station-sdk/**
  - apps/station-gateway/**
  - apps/station/**
  - tests/product/station-core-e2e.test.ts
  - specs/tasks/TASK-587-STATION-VERTICAL-SLICE-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Close Construction A with one deterministic end-to-end Station protocol proof.

# Context
TASK-583..586 establish the protocol and thin application/client/gateway boundaries. The Sprint requires a growing proof that these boundaries compose without relocating canonical authority.

# Current behavior
Before this task, components are tested independently but there is no cumulative Station -> SDK -> Gateway -> Core-port proof including reconnect/replay.

# Required change
Compose Station -> Station SDK -> Station Gateway -> injected in-memory Core port and prove handshake, context, query/projection, command/receipt, event delivery, replay after reconnect and version/diagnostic failure paths.

# Inputs / contracts
Integrated outputs of TASK-583, TASK-584, TASK-585 and TASK-586 plus ADR-0016 invariants.

# Outputs / contracts
A deterministic cumulative product test and only the bounded glue corrections necessary to make the already-declared Construction-A boundaries compose.

# Acceptance criteria
The in-memory Core port remains the only canonical-test-state owner; Station/Gateway/SDK do not manufacture authority; unsupported protocol version fails closed; replay resumes from an explicit sequence without duplicate strengthening; Station disconnect has no effect on Core-port state.

# Non-goals
No real Core adapter, network transport, provider effects, production auth/session store, desktop shell, federation or persistence.

# Evidence expected
One full positive journey plus negative incompatible-version, malformed-context, rejected-command and reconnect/replay cases executed through the actual Construction-A APIs.

# Escalation
Stop if the proof requires domain ownership changes, forbidden package imports, a real provider effect, a production transport decision or runtime dependence on Station/Gateway.
