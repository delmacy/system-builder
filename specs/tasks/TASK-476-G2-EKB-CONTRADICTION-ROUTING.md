---
id: TASK-476
title: Define EKB contradiction unresolved and deterministic routing records
status: ready
priority: 476
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-475
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
  - packages/contracts/elicitation-knowledge-base/**
  - packages/contracts/semantic-substrate/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-476-G2-EKB-CONTRADICTION-ROUTING.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/ai-gateway/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Preserve competing elicitation records and explicit unresolved state while defining deterministic owner/applicability/routing metadata that cannot silently manufacture resolution.

# Context
G2-WP-02 needs contradiction and routing records after EKB identity, information kinds and qualification are established, while foreign-domain truth and resolution authority remain external.

# Current behavior
The repository can represent predecessor semantic relationships, but EKB has no dedicated contradiction/unresolved record or deterministic applicability/routing outcome contract for elicitation state.

# Inputs / contracts
Consume TASK-475 qualified EKB records and public semantic-substrate references. Existing domain owners and research conflict concepts remain external and must not be cloned into EKB authority.

# Outputs / contracts
Add EKB contradiction/unresolved and routing/applicability record structures under the declared EKB contract surface, with focused deterministic proof.

# Evidence expected
Proof must preserve competing records, prevent recency/confidence/repetition winner selection, require rationale for `NOT_APPLICABLE`, preserve unresolved/inconclusive outcomes, and demonstrate cross-owner routing without ownership cloning.

# Required change
Add structural contradiction/unresolved records referencing competing information/evidence, subject/context, semantic owner or resolution authority reference, severity, affected gates/artifacts, route/disposition and supersession lineage. Add deterministic routing/applicability outcome types sufficient to represent routed, not-applicable-with-rationale, unresolved, blocked and inconclusive outcomes without AI authority.

# Acceptance criteria
- competing records remain separately addressable; contradiction is a separate record, not a synthetic winner;
- recency, confidence, summarization or repetition cannot silently resolve contradiction;
- HIGH/CRITICAL contradiction can carry explicit owner/evidence/decision route and blocked downstream gates;
- `NOT_APPLICABLE` requires rationale and context; absence of applicability evidence cannot default to N/A;
- unresolved/inconclusive routing is first-class and deterministic;
- a question discovered under capability A can route to owner B without cloning B's predicate into A/EKB ownership;
- research `ConflictPattern` remains distinct from runtime/project conflict records.

# Negative/adversarial proof
Reject silent winner selection, missing critical owner route, N/A without rationale, cross-owner cloning, AI/confidence closure and unresolved-to-resolved coercion.

# Non-goals
AI model invocation, UI inbox, business conflict resolution, authority policy implementation, persistence, notification/workflow execution.

# Escalation
Stop if this requires EKB to decide foreign domain truth, introduce AI authority or create a new runtime orchestration boundary.