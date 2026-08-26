---
id: TASK-333
title: Close Construction B with provider integration growing proof
status: completed
priority: 333
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-332
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-INTEGRATION-01.md
  - packages/contracts/ai-gateway/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-INTEGRATION-01.report.md
  - specs/tasks/TASK-333-P16-PROVIDER-INTEGRATION-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Produce the Construction B growing proof and Sprint Report for TASK-330..332 and determine, from integrated evidence only, whether optional Construction C is necessary.

# Context
The Package requires WBS 16.1 provider abstraction to work through a representative real invocation seam while preserving provider-neutrality, fail-closed failure behavior and existing authority semantics.

# Current behavior
TASK-330..332 are intended to establish the invocation seam, validation/failure behavior and replaceability evidence. Sprint closure must consolidate those proofs and leave a durable successor disposition.

# Inputs / contracts
- all TASK-330..332 outputs;
- Construction A outputs TASK-324..329;
- P16-PACKAGE-01 growing proof and WBS 16.1.1–16.1.3;
- Sprint Mode closure/report requirements.

# Outputs / contracts
- integrated product proof spanning contract foundation plus real seam invocation and replaceability;
- `P16-PROVIDER-ABSTRACTION-INTEGRATION-01.report.md` with commits, validations, deviations, findings and Construction C disposition.

# Required change
Add or extend one integrated product proof that exercises the complete WBS 16.1 chain reached by Constructions A+B and produce the Sprint Report. Do not materialize Construction C inside this TASK.

# Acceptance criteria
- integrated proof covers provider-neutral request/response, capabilities/limits, invocation seam, response validation and adapter replaceability;
- provider unavailability remains explicit and does not fabricate routing/fallback or authority;
- provider/network/secret absence is explicit;
- Sprint Report records TASK commit SHAs, validation evidence, deviations and residual gaps/risks;
- Construction C remains forecast until post-merge fresh-main revalidation;
- declared validations pass.

# Non-goals
No new production capability beyond TASK-330/331, no external provider, no WBS 16.2/16.3 work and no Package closure.

# Evidence expected
Growing product proof plus Sprint Report and repository-wide verification.

# Escalation
Stop if Sprint closure reveals a residual Package Goal capability that requires WBS 16.2/16.3, an undeclared L4 decision or scope outside P16-PACKAGE-01.
