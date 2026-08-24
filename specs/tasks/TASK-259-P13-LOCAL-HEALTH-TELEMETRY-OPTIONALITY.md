---
id: TASK-259
title: Prove local health telemetry with Observe optional
status: ready
priority: 259
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-258]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-OFFLINE-AUTONOMY-01.md
  - specs/tasks/TASK-060-AUTONOMOUS-RUNTIME-PROOF.md
  - specs/tasks/TASK-135-P11-OBSERVE-PUBLICATION-FAILOPEN.md
allowed_paths:
  - packages/runtime-core/**
  - packages/observe/**
  - tests/product/**
  - specs/tasks/TASK-259-P13-LOCAL-HEALTH-TELEMETRY-OPTIONALITY.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/builder/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove complete-Runtime local health/telemetry remains usable without Observe, and any Observe publication remains fail-open.

# Current behavior
Bootstrap health and Observe fail-open publication exist separately; the complete Runtime autonomy proof has not yet connected them.

# Inputs / contracts
Existing health semantics, Runtime execution outcomes, existing fail-open Observe publication, ADR-0002 autonomy.

# Outputs / contracts
Deterministic local health/operational evidence and optional publication through existing boundaries only.

# Required change
Compose bounded local health/operational evidence for the complete Runtime and prove absent or failing Observe delivery does not affect Runtime availability.

# Acceptance criteria
- local health works without Observe;
- unavailable Observe does not fail Runtime operation;
- configured publication remains deterministic and provider-neutral;
- no secrets or resolved bindings are emitted;
- no Builder lookup is introduced.

# Non-goals
New metrics backend, tracing vendor, Observe redesign, public telemetry platform or deployment lifecycle.

# Evidence expected
Positive, absent-channel and failing-channel product tests plus repository verification.

# Escalation
Stop if a new canonical cross-context contract or L4 dependency is required.