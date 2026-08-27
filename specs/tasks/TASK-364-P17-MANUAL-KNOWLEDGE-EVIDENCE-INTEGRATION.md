---
id: TASK-364
title: Integrate manual classification references through representative evidence path
status: completed
priority: 364
milestone: M17
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-363
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01.md
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - specs/tasks/TASK-364-P17-MANUAL-KNOWLEDGE-EVIDENCE-INTEGRATION.md
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
Expose and prove a representative evidence-facing path for manual knowledge classification references.

# Context
TASK-363 supplies the payload-minimal projection; manual decisions must retain corrected M15 human authority.

# Current behavior
Manual classification is normalized but not consumed by a representative evidence-facing path.

# Inputs / contracts
- TASK-363 projection;
- corrected manual KnowledgeClassificationDecision;
- Evidence & Provenance stable reference semantics.

# Outputs / contracts
A deterministic manual-classification evidence projection/consumption helper.

# Required change
Compose exported contracts so manual classifications carry class/owner/purpose/use plus stable decision/evidence references without changing Evidence & Provenance authority semantics.

# Acceptance criteria
- verified human authority remains explicit;
- mismatched class/owner/reference state fails closed;
- no sensitive payload/provider/secret material;
- no reuse/promotion permission inferred;
- declared validations pass.

# Non-goals
No WBS 17.2/17.3, new human-authority semantics or Evidence & Provenance redesign.

# Evidence expected
Product proof of manual classification -> projection -> representative evidence consumption.

# Escalation
Stop if public Evidence & Provenance semantics must change.
