---
id: TASK-363
title: Integrate manual classification references through representative evidence path
status: ready
priority: 363
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-362
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-363-P17-MANUAL-KNOWLEDGE-EVIDENCE-INTEGRATION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/ai-gateway/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove and expose a representative evidence-facing integration for manual knowledge classification references.

# Context
TASK-362 supplies the payload-minimal projection boundary. The Package requires a real representative consumer integration proof rather than contract-only tests.

# Current behavior
Manual classification can be normalized but has no explicit representative evidence-consumer projection path.

# Inputs / contracts
- TASK-362 projection;
- manual KnowledgeClassificationDecision;
- Evidence & Provenance stable reference semantics.

# Outputs / contracts
A deterministic helper/projection path for manual classification evidence references, without modifying Evidence & Provenance public authority semantics.

# Required change
Compose existing exported contracts so a manual classification decision can be projected for representative evidence-facing consumption with class/owner/purpose/use and stable decision/evidence references.

# Acceptance criteria
- manual decisionActorRef/decisionRef remain explicit and authoritative only as already defined by Construction A;
- projection carries no sensitive payload/provider/secret material;
- mismatched class/owner/reference state fails closed;
- no reuse/promotion permission is inferred from absent restrictions;
- predecessor Evidence & Provenance behavior remains compatible;
- declared validations pass.

# Non-goals
No WBS 17.2 enforcement, WBS 17.3 promotion, new human-authority semantics, or Evidence & Provenance redesign.

# Evidence expected
Product test exercising manual classification -> normalized reference projection -> representative evidence-facing consumption.

# Escalation
Stop if integration requires changing Evidence & Provenance public semantics or another undeclared L4 boundary.
