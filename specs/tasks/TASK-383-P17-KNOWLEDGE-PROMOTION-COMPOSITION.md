---
id: TASK-383
title: Compose promotion control with closed knowledge boundary predecessors
status: completed
priority: 383
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-379, TASK-380, TASK-381, TASK-382]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/index.ts
  - packages/contracts/decision-boundary/index.ts
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-383-P17-KNOWLEDGE-PROMOTION-COMPOSITION.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Compose WBS 17.3 contracts deterministically with the closed WBS 17.1 classification/use-policy and WBS 17.2 enforcement/eligibility truth.

# Context
The package needs one canonical fail-closed composition rather than independent consumer inference.

# Current behavior
No WBS 17.3 aggregate verifies predecessor/candidate/transformation/evidence/decision reference coherence end-to-end.

# Inputs / contracts
Closed WBS 17.1/17.2 contracts and TASK-379..382 outputs.

# Outputs / contracts
Deterministic provider-neutral promotion-control aggregate/normalizer.

# Required change
Compose the chain from canonical predecessor inputs and reject mismatched refs, ineligible/denied predecessor state, incomplete genericity evidence or non-human final authority. Do not satisfy predecessor truth by accepting independently fabricated reference strings that merely normalize; the composition proof must exercise the canonical WBS 17.1 -> 17.2 derivation path established by TASK-379 and the M15 verification path used by TASK-382.

# Pre-execution conformance constraints
- Architectural ownership: Knowledge Boundary owns WBS 17.3 composition; Decision Boundary is read-only authority truth and must not be modified.
- Authority source: only canonical M15 `human-decision` verification may satisfy final human authority; eligibility, transformation and genericity evidence are evidence only.
- Predecessor truth: WBS 17.1 classification/use-policy and WBS 17.2 enforcement/eligibility must be produced through canonical evaluators, not caller-asserted refs.
- Negative proof: include denied/ineligible predecessor state, deterministic/probabilistic authority substitution, actor/reference mismatch, and payload/content injection where applicable.
- Scope control: no consumer wiring, promotion execution, Decision Boundary change, taxonomy expansion or L4 inference.

# Acceptance criteria
- full reference chain is coherent and normalized from canonical predecessor truth;
- at least one positive test constructs the aggregate from real WBS 17.1 classification/use-policy -> WBS 17.2 enforcement/eligibility -> WBS 17.3 candidate/transformation/evidence/decision inputs rather than hand-authored predecessor refs;
- invalid/unknown/mismatched state fails closed;
- deterministic/probabilistic substitution or actor mismatch cannot satisfy final human authority;
- eligibility/transformation/testing remains non-authoritative and cannot independently produce a promotable aggregate;
- no sensitive payload or Decision Boundary contract change;
- declared validations pass.

# Non-goals
No consumer wiring or promotion execution.

# Evidence expected
End-to-end contract-level positive/negative composition tests using canonical predecessor derivation and canonical M15 human-authority verification.

# Escalation
Stop for undeclared L4, Decision Boundary public-contract change, inability to bind the required authority using the existing M15 API, or sensitive payload requirement.