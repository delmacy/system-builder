---
id: TASK-384
title: Prove promotion control contract chain and close Construction A
status: verification
priority: 384
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-383]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-03.md
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - packages/contracts/knowledge-boundary/index.ts
  - packages/contracts/decision-boundary/index.ts
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P17-KNOWLEDGE-PROMOTION-CONTRACT-01.report.md
  - specs/tasks/TASK-384-P17-KNOWLEDGE-PROMOTION-GROWING-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Produce the integrated Construction A growing proof and Sprint Report for WBS 17.3 contracts.

# Context
Construction A must prove the full contract chain before any consumer-integration Construction B can be considered.

# Current behavior
TASK-379..383 will provide isolated contracts/composition but require one representative integrated proof.

# Inputs / contracts
Closed WBS 17.1/17.2 truth plus TASK-379..383 outputs.

# Outputs / contracts
Product-level integrated proof and `P17-KNOWLEDGE-PROMOTION-CONTRACT-01.report.md`.

# Required change
Exercise a canonical WBS 17.1 classification/use-policy -> WBS 17.2 enforcement/eligibility -> WBS 17.3 candidate -> permitted transformation -> genericity evidence -> human-authoritative promotion/rejection composition, including fail-closed negative paths and predecessor compatibility. The growing proof must demonstrate executable provenance, not merely assemble independently hand-authored records whose references happen to match.

# Pre-execution conformance constraints
- Use canonical WBS 17.1/17.2 evaluators to establish predecessor truth.
- Use the existing M15 Decision Boundary verification API as read-only authority truth; do not modify or emulate it.
- Prove that the final disposition remains attributable to canonical human authority while eligibility, transformation and genericity evidence remain non-authoritative.
- Include adversarial substitution/mismatch paths sufficient to show that fabricated refs, non-human authority categories and sensitive payload/content cannot pass the aggregate proof.
- Treat unresolved semantic inability to bind final human authority as BLOCKED rather than inventing L4 or changing Decision Boundary semantics.

# Acceptance criteria
- proves promotion and rejection recording with canonical human authority using the actual M15 verification path;
- proves the full WBS 17.1 -> 17.2 -> 17.3 chain from canonical predecessor evaluators, not only normalized reference shapes;
- proves transformation/genericity/eligibility cannot independently authorize promotion;
- proves deterministic/probabilistic authority substitution, actor/reference mismatch, unknown state and sensitive-payload attempts fail closed;
- Sprint Report records authoritative commits, exact-head validations, deviations/corrections and residual work without overstating completeness;
- repository-wide verification passes.

# Non-goals
No Construction B consumer wiring, promotion execution, WBS expansion or Decision Boundary change.

# Evidence expected
Integrated deterministic product proof plus Sprint Report demonstrating canonical predecessor derivation, canonical human-authority verification and adversarial fail-closed behavior.

# Escalation
Stop if the Package Goal requires undeclared L4, changing canonical authority semantics, or the existing Decision Boundary API cannot support the required authority proof.