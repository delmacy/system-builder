---
id: TASK-510
title: Define multidimensional provider and binding qualification
status: planned
priority: 510
milestone: G2
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

# Non-goals
Concrete vendor adapters, credentials, deployment, physical actuation or Production Readiness.