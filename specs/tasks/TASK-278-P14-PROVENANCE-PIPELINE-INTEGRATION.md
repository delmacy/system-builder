---
id: TASK-278
title: Prove provenance propagation through Compiler Release and Deploy APIs
status: ready
priority: 278
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-274, TASK-275, TASK-276]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-PROPAGATION-01.md
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/deploy/index.ts
  - packages/contracts/evidence-provenance/index.ts
allowed_paths:
  - tests/product/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - specs/tasks/TASK-278-P14-PROVENANCE-PIPELINE-INTEGRATION.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/contracts/artifact-envelope/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove the integrated evidence-provenance namespace survives the real Compiler -> Release -> Deploy chain using actual product APIs rather than hand-authored downstream records.

# Context
TASK-274..276 add bounded propagation surfaces to three existing transformers. This TASK turns those isolated changes into growing integration proof.

# Current behavior
Construction A proves contract semantics and TASK-274..276 will prove local propagation, but package-level evidence still needs an actual multi-stage artifact chain.

# Inputs / contracts
Actual `compileSyntheticRelease`, `ReleaseRegistry.publish`, `dryRunDeploy`, integrated provenance normalizer and existing product fixtures.

# Outputs / contracts
Integration evidence only; no new public semantics beyond TASK-274..276.

# Required change
Add product proof that starts with explicit evidence provenance at the actual Compiler boundary, obtains real Compiler output, publishes it through Release, deploys the real PublishedRelease, and checks equivalent normalized provenance at every stage.

# Acceptance criteria
- no downstream artifact in the chain is hand-authored when an actual producer API exists;
- normalized evidenceId/source/transformation/lineage data is preserved across Compiler -> Release -> Deploy;
- historical no-provenance path remains green;
- deterministic repetition produces equivalent provenance and stable existing identities according to each module's contract;
- negative malformed/no-leak cases remain covered;
- declared validations pass.

# Non-goals
No Observe work beyond predecessor contract assumptions, no provider/storage topology, no WBS 14.3.

# Evidence expected
One focused growing product proof backed by actual module APIs plus repository verification.

# Escalation
Stop if proof exposes a missing capability that requires new architecture rather than the committed propagation surfaces.