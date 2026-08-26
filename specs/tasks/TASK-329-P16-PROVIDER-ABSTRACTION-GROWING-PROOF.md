---
id: TASK-329
title: Close Construction A with provider abstraction growing proof
status: ready
priority: 329
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-328
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-CONTRACT-01.report.md
  - specs/tasks/TASK-329-P16-PROVIDER-ABSTRACTION-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Produce the Construction A growing proof and Sprint Report for the complete TASK-324..328 provider-abstraction increment.

# Context
Construction A must finish with integrated evidence, not only isolated contract tests, and must provide fresh evidence for deciding Construction B scope.

# Current behavior
TASK-324..328 establish the provider-neutral contract foundation and focused replaceability evidence. The Sprint still requires a growing integrated proof and durable report.

# Inputs / contracts
- all TASK-324..328 outputs;
- P16-PACKAGE-01 Package Goal and WBS 16.1.1–16.1.3;
- Sprint Mode closure/report requirements.

# Outputs / contracts
- integrated product proof spanning request/response, capabilities/limits, normalization and adapter replaceability;
- P16-PROVIDER-ABSTRACTION-CONTRACT-01.report.md with commits, validations, deviations, findings and Construction B disposition.

# Required change
Add or extend one integrated product proof using real AI Gateway contract APIs and produce the Sprint Report. The report must identify bounded residual work for Construction B without materializing it.

# Acceptance criteria
- integrated proof covers all three WBS 16.1 items reached by Construction A;
- deterministic/human/probabilistic authority semantics remain unchanged;
- provider/network/secret absence is explicit;
- Sprint Report records TASK commit SHAs, validation evidence and residual gaps/risks;
- Construction B remains forecast until post-merge fresh-main revalidation;
- declared validations pass.

# Non-goals
No new production capability beyond TASK-324..327, no real provider adapter, no routing/budget/fallback governance, no WBS 16.2/16.3 implementation.

# Evidence expected
Growing product proof plus Sprint Report and repository-wide verification.

# Escalation
Stop if Sprint closure reveals a missing capability that cannot be completed inside the committed Construction A scope without expanding WBS 16.1 authority.
