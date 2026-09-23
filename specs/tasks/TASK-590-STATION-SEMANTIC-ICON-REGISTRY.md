---
id: TASK-590
title: Add semantic Station icon registry
status: blocked
priority: 590
milestone: STATION-VISUAL-M1
model_tier: standard
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-589
context_paths:
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
  - packages/ui-icons/**
  - tests/product/station-icon-registry.test.ts
  - specs/tasks/TASK-590-STATION-SEMANTIC-ICON-REGISTRY.md
max_files: 10
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run verify
---

# Objective
Prevent shell/apps from binding product semantics directly to Lucide component names.

# Context
Icons are replaceable visual providers. Semantic action/resource/status identity must survive provider changes.

# Current behavior
No icon system exists.

# Required change
Define initial IconToken vocabulary and Lucide adapter for M1 navigation, window, settings, command and status semantics.

# Inputs / contracts
ADR-0017 and ui-core.

# Outputs / contracts
Provider-neutral icon registry/component API.

# Acceptance criteria
M1 consumers can request semantic tokens without importing Lucide directly; unknown tokens fail visibly/deterministically in development; accessible names remain available.

# Non-goals
No exhaustive domain icon catalog or custom illustration set.

# Evidence expected
Registry completeness/unknown-token tests and render smoke proof.

# Escalation
Stop if icon provider choice leaks into AppManifest/WindowDefinition public semantics.
