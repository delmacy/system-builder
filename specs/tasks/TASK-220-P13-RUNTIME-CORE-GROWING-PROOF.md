---
id: TASK-220
title: Close Construction A autonomous Runtime growing proof
status: ready
priority: 220
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-212
  - TASK-213
  - TASK-214
  - TASK-215
  - TASK-216
  - TASK-217
  - TASK-218
  - TASK-219
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/execution_planning/P13-PACKAGE-01.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - packages/assembly/index.ts
  - packages/compiler/index.ts
  - packages/runtime-core/index.ts
  - packages/deploy/**
allowed_paths:
  - tests/product/p13-runtime-core-e2e.test.ts
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.report.md
  - specs/tasks/TASK-220-P13-RUNTIME-CORE-GROWING-PROOF.md
forbidden_paths:
  - packages/**
  - packages/contracts/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Close Construction A with one real predecessor-integrated proof from SystemDefinition through deployed autonomous Runtime entity/API/action/workflow execution and produce the Sprint Report.

# Required proof
Exercise actual repository modules for `SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy -> autonomous Runtime`, then prove durable entity API behavior, one declared action effect and one valid workflow transition. Do not hand-author downstream artifacts that an executable predecessor already produces.

# Acceptance criteria
- actual factory/release/deploy chain is used;
- entity persistence and generated API positive/negative paths are exercised;
- declared action executes and unknown/unsupported action fails closed;
- valid workflow transition persists and invalid transition fails closed without mutation;
- Runtime behavior continues with Builder and Observe unavailable;
- resolved secret/config values are absent from immutable/durable evidence and asserted diagnostics;
- predecessor state.counter/autonomy regressions remain green;
- Sprint Report records TASK results/commits/validations/deviations/discoveries;
- final `npm run verify` passes before Sprint Review.

# Non-goals
Jobs/events/files/integrations, auth/permissions/views, production topology, P13 Construction B/C, package review or closure.

# Escalation
Stop if closure requires scope outside TASK-212..219, a new L4 change, another shared-contract change, or P13-PACKAGE-02/03 work.

# Exit gate
Stop at Sprint Review on exact TASK-220 closure head. Construction B remains FORECAST until Construction A is merged and fresh-main revalidation promotes it.
