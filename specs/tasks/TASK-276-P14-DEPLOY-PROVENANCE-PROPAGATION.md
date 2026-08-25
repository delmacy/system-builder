---
id: TASK-276
title: Preserve evidence provenance through Deploy transformation
status: ready
priority: 276
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-275]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-PROPAGATION-01.md
  - packages/contracts/evidence-provenance/index.ts
  - packages/release/index.ts
  - packages/deploy/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/deploy/**
  - tests/product/**
  - specs/tasks/TASK-276-P14-DEPLOY-PROVENANCE-PROPAGATION.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/contracts/artifact-envelope/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Preserve evidence provenance from PublishedRelease through the actual Deploy transformation into DeploymentRecord.

# Context
TASK-275 makes PublishedRelease provenance-aware. Deploy is the next real bounded-context transformation in the committed chain.

# Current behavior
`dryRunDeploy` creates deterministic DeploymentRecord data from PublishedRelease, ReleaseArtifact and EnvironmentProfile but drops provenance metadata.

# Inputs / contracts
TASK-275 PublishedRelease output, integrated evidence-provenance contract, existing Deploy deterministic identity/security behavior, ADR-0009.

# Outputs / contracts
Optional additive normalized provenance on DeploymentRecord propagated from PublishedRelease while existing deploy validation and activation semantics remain unchanged.

# Required change
Carry explicit provenance into successful DeploymentRecord creation and preserve it through DeploymentRegistry record/get/list/activation operations. Do not include resolved binding values or infer provenance from environment/provider state.

# Acceptance criteria
- actual `dryRunDeploy` preserves PublishedRelease provenance on successful records;
- registry storage/retrieval/activation preserves it immutably;
- failed deploy diagnostics do not leak provenance-sensitive or secret values;
- no-provenance historical behavior remains valid;
- deterministic deployment identity behavior remains explicitly tested;
- declared validations pass.

# Non-goals
No Observe propagation, no provider/topology change, no Runtime Audit Trail, no WBS 14.3.

# Evidence expected
Focused Deploy tests covering positive, absence, deterministic and no-leak paths.

# Escalation
Stop if implementation would require resolved secrets/provider identifiers in provenance or an L4 Deploy boundary change.