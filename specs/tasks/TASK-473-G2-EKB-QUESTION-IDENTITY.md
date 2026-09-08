---
id: TASK-473
title: Define revisioned EKB question definition and occurrence identities
status: ready
priority: 473
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-473-G2-EKB-QUESTION-IDENTITY.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
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
Introduce additive reusable `QuestionDefinition` revision and context-bound `QuestionOccurrence` identity contracts without turning questions, answers or EKB metadata into canonical domain truth.

# Required change
Create the minimum deterministic EKB contract version and structural types/constructors/validators needed to distinguish stable question definition identity, immutable definition revision, occurrence identity and concrete occurrence context. Historical occurrences must remain pinned to the producing question revision; current wording cannot silently rewrite historical elicitation.

# Acceptance criteria
- `QuestionDefinition != QuestionOccurrence` structurally and semantically;
- a definition revision is immutable/historically addressable and owner-qualified through the semantic substrate;
- an occurrence references the exact producing definition revision and explicit context/scope;
- equal labels/text/IDs cannot collapse definition and occurrence identity;
- blank/ambiguous owner, identity, revision or required context fails closed;
- deterministic normalization does not mutate predecessor contracts;
- existing knowledge-boundary remains unchanged and authoritative for its historical promotion/transform proof domain.

# Negative/adversarial proof
Reject current-definition substitution for a historical occurrence, revision/owner mismatch, identity-kind collapse and omitted material context.

# Non-goals
Information kinds, evidence binding, contradiction routing, coverage/sufficiency, persistence, UI/Wizard, AI behavior, domain adoption.

# Escalation
Stop if this requires changing semantic-substrate ownership, destructive knowledge-boundary edits, persistence or a new runtime/service topology.