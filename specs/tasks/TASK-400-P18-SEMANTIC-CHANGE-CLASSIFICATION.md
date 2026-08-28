---
id: TASK-400
title: Define explicit semantic change classification evidence
status: verification
priority: 400
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-399
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-change/**
  - packages/contracts/decision-boundary/index.ts
allowed_paths:
  - packages/contracts/process-change/**
  - tests/product/**
  - tsconfig.json
  - specs/tasks/TASK-400-P18-SEMANTIC-CHANGE-CLASSIFICATION.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Represent WBS 18.2.2 breaking/non-breaking classification explicitly and bind it to the canonical semantic diff without letting classification become change approval.

# Context
TASK-399 establishes deterministic semantic diff truth. WBS 18.2.2 requires classification when applicable, while Decision Boundary requires authority categories to remain explicit.

# Current behavior
No canonical process-change classification evidence exists.

# Inputs / contracts
TASK-399 canonical semantic diff descriptor plus existing Decision Boundary descriptor/metadata/verification semantics when classification provenance is supplied.

# Outputs / contracts
A versioned classification evidence record with explicit `breaking`, `non-breaking` or `not-applicable` outcome, exact diff reference, classifier decision provenance and evidence references.

# Required change
Add canonical normalization/composition for classification evidence. Classification must reference the exact diff endpoints/result and explicit evidence. Decision provenance may describe how classification was reached, but the output must carry no approval flag and must never satisfy WBS 18.2.3 approval by itself.

# Acceptance criteria
- classification outcome is explicit and closed-set;
- classification binds to one canonical TASK-399 diff and matching revision endpoints;
- decision provenance cannot be forged or category-swapped silently;
- deterministic/probabilistic/human classification provenance remains classification evidence only;
- diff/ref mismatch, malformed evidence, unexpected approval fields and payload/content injection fail closed;
- no change approval is inferred from `non-breaking` or any decision category;
- declared validations pass.

# Non-goals
No process-change approval, no automatic policy deciding what is breaking, no model provider, WBS 18.3 lineage, Decision Boundary modification or L4.

# Evidence expected
Positive classification normalization/composition and negative mismatch, category substitution, approval-field injection, malformed evidence and payload/content tests.

# Escalation
Stop if classification requires inventing an organization-specific breaking policy or altering Decision Boundary semantics.
