---
id: TASK-553
title: Govern AI candidate generation and owner disposition
status: completed
priority: 553
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-552
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-551-G2-AI-WORKSPACE-PROVENANCE.md
  - specs/tasks/TASK-552-G2-AI-PROVIDER-BINDING-QUALIFICATION.md
  - packages/contracts/ai-mediated-assistance/**
allowed_paths:
  - packages/contracts/ai-mediated-assistance/**
  - tests/product/g2-ai-mediated-assistance-product-proof.test.ts
  - specs/tasks/TASK-553-G2-AI-CANDIDATE-DISPOSITION.md
forbidden_paths:
  - packages/db/**
  - packages/runtime-core/**
  - apps/**
  - .github/workflows/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Represent AI-produced candidates and governed human/canonical-owner disposition without allowing inference to become authority by itself.

# Context
The authoritative G2-WBS-16 boundary permits candidate generation and governed disposition only. Existing semantic, authorization, workflow, data and provider owners remain canonical. TASK-551 and TASK-552 are integrated and provide the provenance plus replaceable provider-binding qualification predecessors.

# Current behavior
Workspace provenance and provider-binding qualification establish traceable inputs, but there is no dedicated G2-WBS-16 contract for candidate identity/revision and governed disposition that keeps model inference separate from canonical authority and side-effect eligibility.

# Required change
Add deterministic candidate/disposition contracts that preserve candidate identity/revision/provenance, explicit uncertainty/conflict, and the identity of the governing human or canonical owner disposition. UNKNOWN/conflict must remain reconcile-before-retry where applicable.

# Inputs / contracts
Consume TASK-551 provenance and TASK-552 provider-binding qualification by reference together with existing semantic, authorization, workflow and data owners. Those canonical owners determine authority and action eligibility; the model only supplies candidate evidence.

# Outputs / contracts
Candidate identity/revision/provenance and governed disposition contracts plus deterministic Product Proof covering owner attribution, non-strengthening uncertainty/conflict and coexistence with non-AI/manual paths.

# Acceptance criteria
- generated candidate identity/revision is distinct from canonical artifact identity/revision;
- candidate evidence preserves prompt/context/evidence/provider-binding lineage;
- accept/reject/revise or equivalent disposition is attributed to the governing owner, not to the model;
- inference cannot elevate authority, action eligibility, currentness or support status;
- UNKNOWN/conflict remains explicit and non-strengthening, with reconciliation required before strengthening/retry where applicable;
- coexistence with non-AI/manual paths remains possible at the contract boundary.

# Non-goals
Autonomous-agent authority, direct side-effect execution, workflow ownership transfer, concrete UI, persistence, runtime-core, vendor SDKs or Production Readiness.

# Evidence expected
Deterministic Product Proof for non-authoritative generation, governed disposition, conflict handling and provenance continuity.

# Escalation
Any request for autonomous approval/action or new canonical ownership is outside this TASK and must return to package review.
