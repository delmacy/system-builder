---
id: TASK-403
title: Prove semantic change contract composition and bypass resistance
status: verification
priority: 403
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-402
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/contracts/process-versioning/**
  - packages/contracts/process-change/**
  - packages/contracts/decision-boundary/**
  - tests/product/**
allowed_paths:
  - packages/contracts/process-change/**
  - tests/product/**
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01.report.md
  - specs/tasks/TASK-403-P18-SEMANTIC-CHANGE-GROWING-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction A with an integrated growing proof for WBS 18.2.1–18.2.3 contracts, preserving exact WBS 18.1 predecessor truth and human-only approval authority.

# Context
TASK-399..402 establish diff, classification, reason/evidence and human-authoritative approve/reject contracts. Construction A requires one composition proof showing the boundaries cannot be bypassed.

# Current behavior
No integrated WBS 18.2 proof exists before TASK-399..402 execute.

# Inputs / contracts
Canonical WBS 18.1 revision/publication truth, TASK-399 semantic diff, TASK-400 classification evidence, TASK-401 rationale/evidence and TASK-402 human process-change decision.

# Outputs / contracts
An integrated product-level growing proof and Construction A Sprint Report recording positive/negative behavior, exact-head validations and preserved boundaries.

# Required change
Add focused product proof composing TASK-399..402 through public process-change exports. Cover a valid same-artifact revision change through approved and rejected human decisions plus negative cross-artifact/reversed/forged predecessor, duplicate/mismatched semantic refs, classification/ref mismatch, deterministic/probabilistic approval substitution, authority mismatch, PR-approval substitution and payload/content/Git injection.

# Acceptance criteria
- all WBS 18.2 Construction A contracts are exercised together;
- WBS 18.1 predecessor truth is consumed canonically;
- diff and classification remain non-authoritative for approval;
- only canonical human-decision can back approve/reject outcome;
- rejected outcome cannot be converted into approved by caller composition;
- ADR-0010 engineering approval is not a business approval input;
- no WBS 18.3 semantics are introduced;
- Sprint Report records validations and boundaries;
- declared validations pass.

# Non-goals
No representative consumer integration beyond contract proof, no WBS 18.3 lineage, migration execution, Decision Boundary change, findings/TD absorption or L4.

# Evidence expected
Growing product proof, Sprint Report and exact-head Deterministic CI + Heavy Product Tests on implementation and lifecycle/report heads before Sprint Review/integration.

# Escalation
Stop if composition requires changing Decision Boundary semantics, WBS 18.1 identity semantics, or creating an external authority system.
