---
id: TASK-460
title: Activate successor revision through canonical deployment
status: blocked
priority: 460
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-459
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-SUCCESSOR-PROCESS-EVOLUTION-01.md
  - packages/release/**
  - packages/deploy/**
  - packages/observe/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/release/**
  - packages/deploy/**
  - packages/observe/**
  - project_docs/execution_planning/P19-SUCCESSOR-PROCESS-EVOLUTION-01.md
  - specs/tasks/TASK-460-P19-SUCCESSOR-DEPLOYMENT.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - apps/**
max_files: 12
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Activate system B generated from successor process revision B through existing same-host Deploy authority while preserving the full revision-to-runtime lineage and last-known-good A.

# Required change
Use retained A as expected active predecessor and existing Release/Deploy orchestration to activate B. Correlate canonical process revision, definition, release/artifact, deployment/runtime/environment and optional Observe evidence.

# Acceptance criteria
- B activation consumes the exact PublishedRelease generated from approved successor revision B;
- expected-active predecessor and immutable A/B identities are exact;
- successful B becomes healthy with canonical revision->runtime correlation and external config/secrets;
- stale/substituted predecessor, environment mismatch, migration/secret/startup/health/state failure stop before unsafe promotion;
- rejected candidates preserve exact last-known-good A;
- optional Observe remains non-authoritative/fail-open;
- no second deploy/update/runtime owner is introduced.

# Non-goals
Fleet rollout, remote orchestration, Runtime-core changes, WBS 19.3.3+ or new control plane.

# Evidence expected
Focused product/heavy proof of exact successor-revision deployment, health/correlation and adversarial last-known-good preservation plus declared gates.

# Escalation
Stop if activation requires new lifecycle authority, topology or public contract beyond existing Release/Deploy owners.
