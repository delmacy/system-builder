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

# Context
Construction A already provides revision-pinned elicitation occurrences, typed information states, provenance/currentness/locality, contradiction routing and multidimensional sufficiency. This task adds only the bounded planning contract that turns explicit unresolved state into follow-up candidates without creating a new semantic or decision authority.

# Current behavior
The EKB foundation can represent gaps and unresolved obligations but does not yet expose a dedicated deterministic follow-up-planning contract that preserves the triggering occurrence/revision/context and fails closed when routing inputs are insufficient.

# Required change
Add only the EKB-owned structural contract and focused proof needed to derive follow-up candidates from explicit unresolved gap, contradiction, context and stage-obligation inputs while preserving triggering occurrence/revision/locality/population identity and returning an explicit inconclusive or unresolved outcome when routing context is insufficient.

# Inputs / contracts
- existing `packages/contracts/elicitation-knowledge-base/**` Construction A contracts;
- explicit unresolved gap/contradiction state and stage obligations;
- producing occurrence/revision identity and locality/population/context references;
- read-only predecessor semantics from semantic-substrate, knowledge-boundary and evidence-provenance through their existing public references.

# Outputs / contracts
- additive EKB follow-up planning contract(s) under `packages/contracts/elicitation-knowledge-base/**`;
- focused product proof under `tests/product/g2-elicitation-knowledge-base*.test.ts`;
- no persistence, provider execution, runtime topology or foreign semantic ownership.

# Evidence expected
Focused deterministic proof must exercise happy, negative and adversarial cases for gap-driven follow-up identity, historical revision preservation, missing-context fail-closed behavior, scalar/confidence/repetition non-authority, stale evidence non-resolution and HIGH/CRITICAL unresolved obligations remaining actionable.

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

# Escalation
Any need to invent a new semantic/decision owner, invoke AI/provider behavior, add persistence/runtime topology, or weaken unresolved/currentness/locality semantics must stop this TASK and return to change-control rather than being absorbed.