---
id: TASK-479
title: Define gap-context adaptive follow-up planning
status: ready
priority: 479
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
  - packages/contracts/elicitation-knowledge-base/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-479-G2-EKB-ADAPTIVE-FOLLOWUP.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define deterministic adaptive follow-up planning driven only by explicit unresolved gaps, contradiction state, context and stage obligations.

# Acceptance criteria
- follow-up identity preserves triggering gap/occurrence/revision/context;
- no scalar completion/confidence/repetition may generate or suppress mandatory follow-up;
- HIGH/CRITICAL unresolved obligations remain actionable and cannot be auto-closed;
- absence of sufficient routing context yields explicit INCONCLUSIVE/UNRESOLVED rather than fabricated question selection;
- historical producing revisions remain addressable;
- no AI/provider execution or persistence is introduced.

# Negative cases
Current-definition substitution; scalar masking; confidence-driven closure; stale evidence treated as resolved; missing context coerced to a default owner/question.

# Non-goals
Lens ownership, stakeholder coverage, derived traceability, UI/Wizard, AI execution, persistence, WP-03+ semantics.