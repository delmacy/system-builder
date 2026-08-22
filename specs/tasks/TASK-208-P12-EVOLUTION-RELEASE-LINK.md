---
id: TASK-208
title: Link resulting PublishedRelease to originating Evolution request
status: ready
priority: 560
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-207
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - packages/support-evolution/evolution-link.ts
  - packages/release/index.ts
allowed_paths:
  - packages/support-evolution/evolution-link.ts
  - packages/support-evolution/index.ts
  - tests/product/evolution-release-link.test.ts
  - specs/tasks/TASK-208-P12-EVOLUTION-RELEASE-LINK.md
forbidden_paths:
  - packages/contracts/**
  - packages/release/**
  - packages/deploy/**
  - .github/**
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Close WBS 12.3.3 with deterministic traceability from a resulting `PublishedRelease` identity/version/artifact reference back to the originating Evolution request and its Mirror/Recipe linkage.

# Required change
Add an `EvolutionReleaseLink` that accepts validated prior linkage plus the public PublishedRelease shape (or its validated public identity fields) and records only traceability evidence. It must not publish, deploy or transition the release.

# Acceptance criteria
- original Evolution request identity remains traceable;
- releaseId/version/artifactRef are explicit;
- linkage rejects malformed/incomplete release evidence;
- no ReleaseRegistry mutation is performed by Support/Evolution;
- deterministic identity and validation are provided;
- verification passes.
