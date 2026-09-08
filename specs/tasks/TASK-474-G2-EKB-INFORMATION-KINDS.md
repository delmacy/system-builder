---
id: TASK-474
title: Define typed EKB information records and governed promotion lineage
status: ready
priority: 474
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-473
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
  - packages/contracts/elicitation-knowledge-base/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-474-G2-EKB-INFORMATION-KINDS.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/decision-boundary/**
  - packages/contracts/semantic-substrate/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Represent C1 information kinds as distinct portable EKB records and make kind promotion/correction lineage explicit without creating a new decision authority.

# Required change
Add deterministic structural support for `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope`, and `Deferred`, plus explicit transition/correction/supersession references sufficient to prove that kind changes are governed and provenance-bearing.

# Acceptance criteria
- all 12 information kinds remain distinct after normalization/round trip;
- `Unknown` is explicit and cannot be represented by empty/null/false/zero when material;
- `Deferred != Resolved` and `OutOfScope != NotApplicable`;
- AI-originated material remains `InferredCandidate` absent an explicit owner-governed qualification transition;
- repetition, confidence or source count cannot implicitly promote kind;
- correction/supersession preserves prior record history;
- existing M15/decision-boundary and knowledge-boundary authority remain external references, not reimplemented authority.

# Negative/adversarial proof
Reject implicit `InferredCandidate -> Requirement`, `Assumption -> Fact`, `Unknown -> false/zero`, destructive latest-wins replacement and kind substitution with equal prose.

# Non-goals
Evidence/currentness qualification, contradiction routing, sufficiency evaluation, AI generation, persistence, domain decision execution.

# Escalation
Stop if implementation needs business promotion authority, destructive predecessor changes or a universal epistemic truth evaluator.