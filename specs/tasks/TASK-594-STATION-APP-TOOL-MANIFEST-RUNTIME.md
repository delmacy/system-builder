---
id: TASK-594
title: Create Station AppManifest ToolManifest and utility app registry
status: blocked
priority: 594
milestone: STATION-VISUAL-M1
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-593
context_paths:
  - docs/architecture/STATION_FRONTEND_FOUNDATION.md
allowed_paths:
  - packages/station-app-runtime/**
  - tests/product/station-app-runtime.test.ts
  - specs/tasks/TASK-594-STATION-APP-TOOL-MANIFEST-RUNTIME.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - .github/workflows/**
max_files: 14
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# Objective
Define how Station apps/tools declare themselves without hardcoding window creation into the shell.

# Context
M1 needs utility windows now and reusable app/tool discovery later.

# Current behavior
No manifest runtime exists.

# Required change
Add AppManifest, ToolManifest, app registry, launch policy and mapping from app launch to WindowDefinitions. Register bounded M1 utility definitions for Welcome, Component Lab and Settings without implementing their final UI.

# Inputs / contracts
station-windowing, station-interaction, semantic IconToken.

# Outputs / contracts
Provider-neutral manifest/registry APIs.

# Acceptance criteria
Shell can discover/launch apps from registry; manifest identity is stable and distinct from display name; tool/app visibility does not grant business authority.

# Non-goals
No marketplace, install/uninstall, real domain apps, capability resolution or Core-backed app catalog.

# Evidence expected
Manifest validation, duplicate identity, singleton/multi-instance and launch tests.

# Escalation
Stop if AppManifest becomes a canonical module/deployment descriptor or starts owning business capability truth.
