---
id: TASK-230
title: Close Construction B autonomous Runtime services growing proof
status: ready
priority: 230
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-221
  - TASK-222
  - TASK-223
  - TASK-224
  - TASK-225
  - TASK-226
  - TASK-227
  - TASK-228
  - TASK-229
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/execution_planning/P13-PACKAGE-01.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - project_docs/execution_planning/P13-RUNTIME-CORE-EXECUTION-01.report.md
  - docs/adr/ADR-0002-autonomous-runtime.md
allowed_paths:
  - tests/product/p13-runtime-services-e2e.test.ts
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.report.md
  - specs/tasks/TASK-230-P13-RUNTIME-SERVICES-GROWING-PROOF.md
forbidden_paths:
  - packages/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run verify
---

# Objective
Close Construction B with one real predecessor-integrated proof through representative job, event, file/storage and integration execution, then produce the Sprint Report.

# Context
TASK-221..229 are the committed Construction B increment. Sprint Mode requires the final task to exercise the real integrated chain, extend Construction A rather than replace it, record validation/deviations/discoveries and stop at Sprint Review.

# Current behavior
Before this closure task, Construction B has focused contract/compiler/runtime/binding tests but no single authoritative E2E proof for all new service classes through the actual Compiler/Release/Artifact/Deploy/autonomous Runtime path.

# Required change
Extend the actual Construction A chain rather than hand-authoring downstream artifacts. Prove one declared interval job, one runtime-http event, file put/get/delete and one HTTP integration after real Compiler/Release/Artifact/Deploy activation. Exercise missing/incompatible bindings and assert Builder/Observe unavailable plus no resolved-value leakage.

# Inputs / contracts
Integrated TASK-221..229 outputs; actual Catalog/Assembly/Validation/Compiler/Release/Artifact/Deploy APIs; Construction A growing proof; ADR-0002; accepted Construction B L3 change control.

# Outputs / contracts
One Construction B integrated product E2E proof plus `P13-RUNTIME-SERVICES-BINDINGS-01.report.md`. No product implementation or public-contract change is allowed in this closure task.

# Acceptance criteria
- actual SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy chain is used;
- Construction A entity/action/workflow proof remains functional;
- job/event/file/integration positive paths execute from declared semantics;
- unknown/invalid operations and missing/incompatible bindings fail closed;
- storage traversal is rejected;
- resolved endpoint/storage/config/secret values never enter durable evidence or asserted diagnostics;
- Sprint Report records TASK commits, validations, deviations, discoveries and residual work;
- repository-wide verification passes on the final Sprint head.

# Non-goals
Construction C, auth/views/permissions, production topology, package review/closure, or product fixes inside this closure task.

# Evidence expected
`tests/product/p13-runtime-services-e2e.test.ts`, the Construction B Sprint Report, predecessor regression results and exact-head deterministic CI after repository-wide verification.

# Escalation
Stop if closure requires product correction outside TASK-221..229, a new L4 decision, broader contract changes, or P13-PACKAGE-02/03 work.

# Exit gate
Stop at Construction B Sprint Review. Do not promote Construction C or package review until B is merged and fresh-main revalidation is complete.
