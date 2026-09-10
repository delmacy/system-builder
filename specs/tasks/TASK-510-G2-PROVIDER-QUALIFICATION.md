---
id: TASK-510
title: Define multidimensional provider and binding qualification
status: ready
priority: 510
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/provider/**
  - tests/product/g2-provider*.test.ts
  - specs/tasks/TASK-510-G2-PROVIDER-QUALIFICATION.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define portable provider/binding qualification as an explicit multidimensional evidence-backed contract rather than boolean API/feature parity.

# Context
G2-WP-06 consumes canonical semantic identity, evidence/currentness, authority/trust and data coexistence semantics from canonically closed G2-WP-01..05. This TASK establishes only the provider qualification contract required by Construction A.

# Current behavior
The repository has provider abstraction foundations but no G2 contract proving that support is a revision/currentness-qualified vector rather than endpoint or feature parity.

# Inputs / contracts
Pinned G2 research authority, existing public contracts, provider/binding identity, qualification evidence, evidence provenance/currentness and conservative uncertainty states.

# Outputs / contracts
A provider-neutral qualification contract plus Product Proof that preserves binding revision/identity and SUPPORT/PARTIAL/UNSUPPORTED/UNKNOWN without manufacturing support authority.

# Required change
Represent qualification dimensions, binding revision/identity, evidence/currentness and conservative SUPPORT/PARTIAL/UNSUPPORTED/UNKNOWN outcomes. AI inference may propose evidence but cannot establish authority or support.

# Acceptance criteria
- support cannot be inferred from endpoint/feature presence alone;
- qualification is revision/currentness aware;
- PARTIAL/UNKNOWN/INCONCLUSIVE cannot strengthen to supported;
- stale/UNKNOWN authority-sensitive evidence requires reconciliation before retry;
- provider-specific IDs do not become canonical semantic identity.

# Negative/adversarial proof
Reject parity=>support, stale evidence=>support, UNKNOWN=>supported and provider-ID=>canonical-identity strengthening.

# Evidence expected
Product tests exercise positive qualification plus negative/adversarial stale, partial, unknown and identity-strengthening cases; all declared validation commands pass on the exact TASK head.

# Escalation
Escalate only if satisfying these invariants requires scope outside allowed_paths or contradicts pinned G2 authority. Do not absorb vendor adapters, credentials, deployment, physical actuation, WP-07+ or DEFER/DO_NOT_BUILD findings.

# Non-goals
Concrete vendor adapters, credentials, deployment, physical actuation or Production Readiness.