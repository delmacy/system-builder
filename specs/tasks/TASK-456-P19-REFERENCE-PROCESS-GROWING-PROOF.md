---
id: TASK-456
title: Prove complete reference product journey end-to-end
status: blocked
priority: 456
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-455
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - project_docs/execution_planning/P19-AUTONOMOUS-RUNTIME-CONTINUITY-01.report.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/operations/**
  - scripts/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/runtime-core/**
  - packages/observe/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - docs/operations/**
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - specs/tasks/TASK-456-P19-REFERENCE-PROCESS-GROWING-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - apps/**
max_files: 14
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close WBS 19.3.1 with one auditable growing proof of the complete representative product journey and same-host update/rollback continuity.

# Required change
Compose TASK-450..455 through supported APIs: representative payload/process -> generated project -> publish -> deploy -> actual runtime state/health -> Observe correlation -> compatible B -> exact A rollback. Prefer actual owners and persistence paths over mocks/fixtures that bypass the product boundary. Add only bounded operator documentation for behavior proven by the journey.

# Acceptance criteria
- one supported path covers the complete WBS 19.3.1 journey with exact process/project/release/artifact/deployment/runtime/environment correlation;
- Builder is unavailable in steady-state proof without affecting ordinary Runtime behavior;
- optional Observe publication remains non-authoritative/fail-open;
- compatible same-host update and exact predecessor rollback use existing Release/Deploy ownership and preserve last-known-good;
- representative stale/substituted/hash/runtime/environment/secret/migration/startup/health/observe/update/rollback failures remain fail-closed at their canonical boundary with no partial-success evidence;
- deterministic ordering/idempotency and protected-value non-disclosure are regressed;
- no parallel lifecycle/update/rollback owner, new public contract, identity scheme or Decision Boundary is introduced;
- exact-head Deterministic CI and Heavy Product Tests pass before Sprint Review.

# Non-goals
WBS 19.3.2+ unified CLI/smoke-hardening, production/fleet orchestration, customer dogfood semantics, secret backend, new topology or inferred L4.

# Escalation
Stop if the end-to-end journey exposes a missing capability that cannot be corrected boundedly inside an already authoritative owner without public-contract/topology expansion.
