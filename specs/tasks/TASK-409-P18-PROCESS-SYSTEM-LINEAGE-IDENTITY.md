---
id: TASK-409
title: Define process-to-system lineage identity and hop descriptors
status: verification
priority: 409
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-03.md
  - project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - project_docs/18-process-versioning/scope/README.md
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/**
  - specs/tasks/TASK-409-P18-PROCESS-SYSTEM-LINEAGE-IDENTITY.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define WBS 18.3 provider-neutral lineage identity/hop descriptors anchored to canonical WBS 18.1 process artifact/revision identity.

# Context
P18 Package 03 begins the process-to-system lineage layer after WBS 18.1 identity/revision semantics and WBS 18.2 semantic-change evidence are already CLOSED. This task establishes only additive lineage identity primitives inside the existing process-versioning contract boundary.

# Current behavior
Canonical process artifact/revision identity exists, but there is no committed WBS 18.3 contract for normalized process-to-system lineage endpoints and hops. TASK-410..413 depend on this foundation.

# Inputs / contracts
- `project_docs/execution_planning/P18-PACKAGE-03.md` package scope and boundaries;
- `project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-CONTRACT-01.md` Construction A contract;
- WBS 18.3 and process-versioning scope authority;
- canonical WBS 18.1 process artifact/revision identity contract.

# Outputs / contracts
Additive deterministic process-versioning lineage endpoint/hop descriptors for process revision, analysis, system definition, release and deployment identities, without payload ownership or execution authority.

# Required change
Add an additive deterministic contract able to represent explicit lineage endpoints/hops for process revision, analysis, system definition, release and deployment identities without carrying payloads or inferring authority from Git metadata.

# Acceptance criteria
- process artifact/revision identity reuses canonical process-versioning truth;
- hop kinds and endpoint identities are explicit and normalized deterministically;
- unknown/extra state and invalid/self/ambiguous hops fail closed;
- Git SHA is not accepted as sole/canonical business lineage identity;
- declared validations pass.

# Non-goals
No full-chain composition, historical query, consumer integration, release/deploy mutation or Decision Boundary change.

# Evidence expected
Positive/negative product tests for endpoint and hop normalization.

# Escalation
Stop for topology/boundary change, destructive release/deployment semantics, storage redesign or undeclared L4.