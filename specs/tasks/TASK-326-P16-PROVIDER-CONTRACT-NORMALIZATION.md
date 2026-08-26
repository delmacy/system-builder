---
id: TASK-326
title: Add deterministic AI Gateway contract validation and normalization
status: completed
priority: 326
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-325
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-326-P16-PROVIDER-CONTRACT-NORMALIZATION.md
forbidden_paths:
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
Complete deterministic fail-closed validation/normalization for the provider-neutral request/response and capability/limit contracts from TASK-324/325, without duplicating predecessor helpers already integrated on the Sprint branch.

# Context
Provider replaceability requires canonical data handling independent of adapter/provider implementation details. TASK-324/325 already introduced the structural validators/normalizers needed by their own acceptance criteria; this TASK owns the residual canonicalization proof rather than recreating those helpers.

# Current behavior
The predecessor contracts already reject malformed/extra fields, unsupported versions, duplicate capabilities and invalid limits. The remaining gap is canonical equivalence: semantically equivalent capability descriptors with different capability or limit-key ordering must converge to one deterministic representation.

# Inputs / contracts
- TASK-324 request/response contracts and existing normalizers;
- TASK-325 capability/limit descriptors and existing fail-closed validation.

# Outputs / contracts
- minimum additive canonicalization in `packages/contracts/ai-gateway/**`;
- focused tests for valid, invalid and canonical-equivalent inputs;
- no duplicate validator/normalizer abstraction.

# Required change
Preserve predecessor validation behavior and add only the missing deterministic canonicalization needed for semantically equivalent provider-neutral descriptors. Canonicalize ordering where ordering has no contract meaning; do not inject provider/network/secret lookups, hidden defaults, routing decisions or authority inference.

# Acceptance criteria
- existing structurally invalid inputs continue to fail explicitly;
- equivalent capability descriptors normalize to identical deterministic capability and limit-key ordering;
- request/response normalization remains backward-compatible and fail-closed;
- no hidden provider defaults are injected;
- no network, secrets, storage or authorization dependency exists;
- no duplicate validation helper is introduced;
- declared validations pass.

# Non-goals
No adapter invocation, provider registry, routing/fallback policy, pricing/budget logic or WBS 16.2/16.3 behavior.

# Evidence expected
Product tests proving canonical-equivalent descriptors converge, while predecessor fail-closed request/response and capability validation remains intact.

# Escalation
Stop if canonicalization requires external provider state, changes provider-neutral semantic meaning, or changes architecture outside the materialized contract boundary.
