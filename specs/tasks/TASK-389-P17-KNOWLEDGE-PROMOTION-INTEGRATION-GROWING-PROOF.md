---
id: TASK-389
title: Close knowledge promotion integration with growing proof
status: completed
priority: 389
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-388
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-INTEGRATION-01.md
  - specs/tasks/TASK-379-P17-KNOWLEDGE-PROMOTION-CANDIDATE.md
  - specs/tasks/TASK-384-P17-KNOWLEDGE-PROMOTION-GROWING-PROOF.md
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-INTEGRATION-01.report.md
  - specs/tasks/TASK-389-P17-KNOWLEDGE-PROMOTION-INTEGRATION-GROWING-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
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
Close Construction B with an integrated WBS 17.1 -> 17.2 -> 17.3 consumer proof and Sprint Report.

# Context
The Package Goal requires both canonical promotion-control contracts and representative consumption that preserves final human authority and provenance.

# Current behavior
TASK-385..388 are materialized to supply consumer integration and bypass proof, but Construction B requires one final integrated evidence set before Sprint Review.

# Inputs / contracts
- TASK-379..384 Construction A canonical promotion contracts/proofs;
- TASK-385..388 representative consumer integration and bypass evidence;
- closed WBS 17.1/17.2 predecessor truth and M15 human-decision authority.

# Outputs / contracts
A growing product proof and `P17-KNOWLEDGE-PROMOTION-INTEGRATION-01.report.md` documenting exact TASK commits/gates, conformance corrections, evidence and Construction C recommendation.

# Required change
Extend the growing proof to trace real canonical predecessor decisions through promotion review, final human-authoritative promote/reject truth, catalog admission and Observe provenance. Include negative proof for denied/ineligible, deterministic/probabilistic substitution, actor/ref mismatch, forged predecessor state, malformed provenance and payload/content injection.

# Acceptance criteria
- the full representative consumer chain is proven from canonical WBS 17.1 -> 17.2 -> 17.3 inputs;
- final promotion authority is always real M15 `human-decision` truth;
- promotion/rejection provenance is payload-minimal and stable;
- Sprint Report records exact evidence and does not pre-authorize Construction C;
- declared validations pass.

# Non-goals
No new authority model, Decision Boundary change, unrelated findings/TD absorption or Package closure in this TASK.

# Evidence expected
Integrated product proof and Sprint Report suitable for Sprint Review/fresh-main post-B revalidation.

# Escalation
Stop and mark the Sprint blocked if the integrated proof requires a public Decision Boundary change or cannot prove canonical human authority.
