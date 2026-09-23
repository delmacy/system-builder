---
id: TASK-583
title: Establish transport-agnostic Station/Core protocol contract
status: ready
priority: 583
milestone: STATION-WP-01
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0016-station-core-gateway-boundary.md
  - project_docs/execution_planning/STATION-WP-01-FOUNDATION.md
  - packages/contracts/identity-authorization/**
  - packages/contracts/generated-experience/**
  - packages/contracts/semantic-substrate/**
allowed_paths:
  - packages/contracts/station-core/**
  - tests/product/station-core-protocol.test.ts
  - tsconfig.json
  - specs/tasks/TASK-583-STATION-CORE-PROTOCOL-CONTRACT.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - apps/**
  - .github/workflows/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Define the stable Station/Core semantic protocol without selecting HTTP, WebSocket, SSE or IPC.

# Context
ADR-0016 separates Station, Station Gateway and Core/domain ownership. Existing identity/authorization and generated-experience contracts already encode actor, currentness, projection and authority invariants that the Station protocol must carry by reference without weakening.

# Current behavior
The repository has domain-specific public contracts but no shared Station handshake, session/context, query, command, event or compatibility envelope. No Station-specific TypeScript path alias exists.

# Required change
Add a versioned `station-core` contract family covering handshake/compatibility, Station session/context references, query/projection envelopes, command/receipt envelopes, event/subscription/replay envelopes and deterministic diagnostics.

# Inputs / contracts
ADR-0016; `identity-authorization`; `generated-experience`; `semantic-substrate`. Reuse their identity/revision/currentness/authority concepts by reference rather than redefining semantic ownership.

# Outputs / contracts
`packages/contracts/station-core/**`, its public TypeScript alias, and deterministic product tests for normalization/validation and compatibility behavior.

# Acceptance criteria
Contracts are immutable/provider-neutral; unsupported protocol versions fail deterministically; projection identity/revision/currentness is preserved without becoming canonical truth; commands carry actor/context/target/expected-revision information by reference; events have monotonic replay position within a subscription stream.

# Non-goals
No network server/client, authentication provider, domain command implementation, persistence, Station UI or Core implementation changes.

# Evidence expected
Positive and negative deterministic tests for compatible/incompatible handshakes, malformed context, stale/mismatched projection metadata, command revision references and monotonic event replay positions.

# Escalation
Stop if the protocol requires new canonical domain authority, a mandatory physical transport, Builder/Runtime ownership changes or edits to existing domain contracts outside the declared paths.
