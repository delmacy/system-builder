---
id: TASK-277
title: Preserve evidence provenance through Observe transformation
status: ready
priority: 277
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-276]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-PROPAGATION-01.md
  - packages/contracts/evidence-provenance/index.ts
  - packages/deploy/index.ts
  - packages/observe/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/observe/**
  - tests/product/**
  - specs/tasks/TASK-277-P14-OBSERVE-PROVENANCE-PROPAGATION.md
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
Preserve evidence provenance from DeploymentRecord through the actual Observe transformation and compatible serialization path.

# Context
TASK-276 propagates provenance into DeploymentRecord. Observe is the final representative bounded-context transformer in the committed chain and must preserve optional compatible evidence without becoming a Runtime dependency.

# Current behavior
`DeploymentObservation.fromDeploymentRecord` validates a strict record shape and derives deterministic observation identity, but currently rejects/drops any provenance extension.

# Inputs / contracts
TASK-276 DeploymentRecord output, integrated evidence-provenance contract, existing Observe transformation/serialization semantics, ADR-0009 and Runtime autonomy invariants.

# Outputs / contracts
Optional additive normalized provenance preserved in DeploymentObservation and round-trip serialization without changing fail-open publication or deployment-correlation meaning.

# Required change
Accept and preserve the integrated provenance namespace on DeploymentRecord-like input, include it deterministically in the observation representation where compatible, and preserve it through toJson/fromJson. Absence remains backward compatible.

# Acceptance criteria
- actual Observe transformation preserves normalized DeploymentRecord provenance;
- toJson/fromJson round trip preserves it losslessly;
- malformed provenance fails explicitly at the Observe boundary;
- historical records without provenance remain accepted;
- Observe availability remains optional and provenance does not become execution authority;
- declared validations pass.

# Non-goals
No publication provider SDK, no Runtime dependency on Observe, no new finding semantics, no WBS 14.3.

# Evidence expected
Focused Observe tests covering positive, malformed, absence and round-trip behavior.

# Escalation
Stop if change would make Observe mandatory to Runtime operation or require L4 topology change.