---
id: TASK-210
title: Prove Evolution cannot bypass operational or production boundaries
status: verification
priority: 580
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-208
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - packages/support-evolution/index.ts
  - packages/release/index.ts
allowed_paths:
  - tests/product/evolution-boundary-negative.test.ts
  - specs/tasks/TASK-210-P12-EVOLUTION-BOUNDARY-NEGATIVE.md
forbidden_paths:
  - packages/**
  - .github/**
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Lock the negative boundary for controlled evolution: evidence/linkage must not become an operational-resolution or production-control API.

# Context
The positive WBS 12.3 path adds traceability but must preserve the existing separation between Evolution, operational Support/Maintenance resolution and Release/Deploy authority.

# Current behavior
Existing Sprint 3 tests reject Evolution through SupportCaseRecord/ProblemRecord, while TASK-202..208 introduce new evidence/linkage APIs. No integrated negative proof yet verifies that the new APIs preserve all operational and production boundaries.

# Required change
Add a test-only negative proof over the public APIs that rejects operational-path reuse, missing lineage, resolved secret values and any newly exposed execution/deployment methods.

# Inputs / contracts
Existing SupportCaseRecord/ProblemRecord boundaries, TASK-202..208 Support/Evolution APIs and public ReleaseRegistry behavior.

# Outputs / contracts
Executable negative evidence only. No product/public contract change.

# Acceptance criteria
- Evolution still fails through SupportCaseRecord and ProblemRecord constructors;
- evolution APIs expose no execute/apply/deploy/remediate/mutateProduction operation;
- ReleaseRegistry publication/transition remains external to Support/Evolution;
- missing Mirror/Recipe/release lineage fails closed;
- no resolved secret/credential values are accepted in durable linkage refs;
- verification passes.

# Non-goals
Product implementation changes, release/deploy mutation, schema changes or new policy engines.

# Evidence expected
One negative product test proving the complete controlled-evolution boundary plus repository verification.

# Escalation
Stop if proving the boundary requires modifying product code, release/deploy modules, shared schemas or architecture.
