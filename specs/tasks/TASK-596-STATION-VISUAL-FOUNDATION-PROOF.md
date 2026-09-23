---
id: TASK-596
title: Integrate Station visual foundation and prove empty desktop host
status: blocked
priority: 596
milestone: STATION-VISUAL-M1
model_tier: strong
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-595
context_paths:
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
  - project_docs/execution_planning/STATION-VISUAL-CONSTRUCTION-A-01.md
allowed_paths:
  - apps/station/**
  - packages/ui-core/**
  - packages/ui-icons/**
  - packages/station-interaction/**
  - packages/station-windowing/**
  - packages/station-app-runtime/**
  - packages/station-settings/**
  - tests/product/station-visual-foundation.test.ts
  - specs/tasks/TASK-596-STATION-VISUAL-FOUNDATION-PROOF.md
max_files: 20
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# Objective
Close Construction A with the real frontend packages composed through the Station host.

# Context
TASK-588..595 establish each reusable visual foundation independently.

# Current behavior
Before this task, individual packages exist but the Station host has no cumulative foundation proof.

# Required change
Compose the actual packages so Station boots disconnected, renders the empty desktop surface, loads utility manifests, opens at least one manifest-driven WindowFrame and applies presentation settings through the real settings provider.

# Inputs / contracts
Integrated outputs TASK-588..595.

# Outputs / contracts
Cumulative visual-foundation product test/smoke proof and only bounded integration glue.

# Acceptance criteria
No fake Core state; no direct domain/Core imports in visual packages; window comes from AppManifest -> WindowDefinition -> WindowFrame; semantic icon registry and ui-core are used; settings round-trip without canonical state.

# Non-goals
No Navbar/Toolbar/Taskbar completion, multi-window milestone journey, Settings panel UI or Playwright M1 completion; those are Construction B.

# Evidence expected
Build + deterministic integration proof and runnable empty desktop.

# Escalation
Stop if composition requires collapsing package boundaries, inventing Core data or importing forbidden domain internals.
