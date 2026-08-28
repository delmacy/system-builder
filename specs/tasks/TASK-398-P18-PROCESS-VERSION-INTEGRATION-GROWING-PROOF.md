---
id: TASK-398
title: Prove representative process version consumer integration and bypass resistance
status: completed
priority: 398
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-397
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-01.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - packages/catalog/**
  - packages/contracts/process-versioning/**
  - tests/product/**
allowed_paths:
  - packages/catalog/**
  - tests/product/**
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01.report.md
  - specs/tasks/TASK-398-P18-PROCESS-VERSION-INTEGRATION-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/contracts/decision-boundary/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction B with an integrated growing proof that the representative consumer cannot bypass canonical WBS 18.1 identity, immutability or lifecycle/lineage rules.

# Context
TASK-395..397 materialize the only authorized representative consumer seam for Construction B. Construction B closes only when canonical WBS 18.1 truth is exercised through that public seam, not merely by direct contract tests.

# Current behavior
Construction A has direct contract growing proof, while representative-consumer proof is absent until TASK-395..397 execute.

# Inputs / contracts
- TASK-395 catalog process-revision admission;
- TASK-396 immutable published-revision enforcement;
- TASK-397 canonical lifecycle/lineage validation;
- public WBS 18.1 process-versioning contracts and existing catalog backward-compatibility behavior.

# Outputs / contracts
An integrated product-level growing proof and Construction B Sprint Report showing positive multi-revision behavior, bypass resistance, backward compatibility and preserved P18 boundaries.

# Required change
Add a focused product proof that composes TASK-395..397 through the public catalog seam and exercises positive multi-revision behavior plus malformed, cross-artifact, conflicting overwrite, duplicate, forged predecessor, contradictory supersession and payload/content-injection negatives. Produce the bounded Sprint Report.

# Acceptance criteria
- all canonical WBS 18.1 contracts are exercised through the representative consumer, not only directly in contract tests;
- process business revision identity remains distinct from software catalog SemVer and Git identity;
- no caller-injected validation can bypass canonical functions;
- malformed/cross-artifact/conflicting/duplicate/forged/payload-injected inputs fail closed;
- earlier catalog behavior remains backward-compatible;
- Sprint Report records validations and preserved boundaries;
- no WBS 18.2/18.3 semantics are introduced;
- declared validations pass.

# Non-goals
No semantic diff, change approval, process-to-system/release lineage, storage redesign, Decision Boundary change, findings/TD absorption or L4.

# Evidence expected
Growing product proof plus Sprint Report and exact-head Deterministic CI + Heavy Product Tests on implementation and lifecycle/report heads before Sprint Review/integration.

# Escalation
Stop if proving the seam requires semantic-diff policy, process-to-system lineage, storage redesign, Decision Boundary change or undeclared L4.
