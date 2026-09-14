---
id: TASK-548
title: Separate generated visibility from authority and action eligibility
status: ready
priority: 548
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-547
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-547-G2-GENERATED-EXPERIENCE-PROJECTION-CURRENTNESS.md
  - packages/contracts/generated-experience/**
allowed_paths:
  - packages/contracts/generated-experience/**
  - tests/product/g2-generated-experience-authority-proof.test.ts
  - specs/tasks/TASK-548-G2-GENERATED-EXPERIENCE-VISIBILITY-AUTHORITY.md
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
Ensure generated visibility, affordance and presentation never imply authorization, domain authority or action eligibility.

# Context
TASK-547 establishes generated projection identity/currentness. This successor must bind action surfaces to pre-existing canonical authority and domain/workflow semantics without moving ownership into generated UI state.

# Current behavior
Generated presentation has no G2 contract that explicitly distinguishes what is visible from what is authorized or eligible to mutate canonical state.

# Required change
Extend the bounded generated-experience contract so an action surface references external canonical authority/effect semantics rather than manufacturing them from visibility or rendered state.

# Inputs / contracts
TASK-547 projection/currentness semantics and existing canonical authority, workflow/domain action and evidence-currentness contracts.

# Outputs / contracts
A generated-experience action-surface contract that carries referenced authority/currentness and action eligibility without becoming an authority source itself, plus deterministic Product Proof.

# Acceptance criteria
- `visibility != authority != action eligibility`;
- hidden/visible state cannot grant or revoke canonical authority by itself;
- action eligibility is qualified by referenced authority/currentness and applicable domain/workflow contract;
- stale/UNKNOWN/INCONCLUSIVE authority evidence disables strengthening and routes to non-mutating/reconciliation-safe behavior;
- generated labels/status cannot upgrade underlying source status;
- deterministic Product Proof covers visible-but-unauthorized, authorized-but-stale, conflicting authority and stale projection scenarios.

# Non-goals
New authorization model, workflow ownership, concrete UI actions, AI agents, persistence or Production Readiness.

# Evidence expected
Deterministic Product Proof covering visibility/authority/action separation and stale/conflicted authority evidence, plus exact-head repository validation.

# Escalation
If satisfying an action surface requires changing canonical authorization, workflow ownership or persistence semantics, return to Sprint Review and do not absorb that work into TASK-548.
