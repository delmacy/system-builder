---
id: TASK-397
title: Integrate canonical process revision lifecycle and lineage validation into representative catalog consumer
status: blocked
priority: 397
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-396
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/catalog/**
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/catalog/**
  - tests/product/**
  - specs/tasks/TASK-397-P18-CATALOG-PROCESS-REVISION-LINEAGE.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Integrate canonical lifecycle and same-artifact lineage proof into the representative WBS 18.1 catalog consumer seam.

# Context
TASK-395/396 provide canonical admission and immutable-publication behavior. WBS 18.1.3 requires explicit supersedes/deprecated/archived semantics and same-artifact revision lineage without semantic-change inference.

# Current behavior
The canonical contract can validate process revision lineage, but the representative catalog seam does not yet require that canonical proof before projecting revision/lifecycle references.

# Inputs / contracts
- TASK-395/396 representative consumer seam;
- `validateProcessRevisionLineage` and canonical publication/lifecycle descriptors;
- WBS 18.1.3 and Package boundaries.

# Outputs / contracts
A deterministic catalog-facing projection of canonical same-artifact revision references and lifecycle states whose predecessor/supersession truth has passed `validateProcessRevisionLineage`.

# Required change
Extend the bounded consumer so revision lineage is validated by `validateProcessRevisionLineage`, with deterministic projection of canonical revision references and lifecycle state only. Do not classify semantic change or create process-to-system lineage.

# Acceptance criteria
- same-artifact contiguous lineage is validated by the canonical contract;
- cross-artifact, duplicate revisionRef, forged/non-contiguous predecessor and contradictory supersession fail closed;
- active/deprecated/archived state is projected without inventing breaking/non-breaking meaning;
- results remain payload-minimal and stable;
- existing catalog SemVer behavior remains unchanged;
- declared validations pass.

# Non-goals
No WBS 18.2 semantic classification/change approval, WBS 18.3 process-to-system lineage, migration logic, Git authority or L4.

# Evidence expected
Positive ordered/out-of-input-order lineage cases plus cross-artifact, duplicate, predecessor and supersession negatives; exact-head Deterministic CI and Heavy Product Tests before TASK-398.

# Escalation
Stop if proof requires semantic-diff policy, lineage beyond process revisions, storage redesign or public authority changes.
