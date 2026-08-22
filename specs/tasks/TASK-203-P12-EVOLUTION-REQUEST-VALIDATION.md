---
id: TASK-203
title: Add fail-closed validation for EvolutionRequestEvidence
status: ready
priority: 510
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-202
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - packages/support-evolution/evolution-request.ts
allowed_paths:
  - packages/support-evolution/evolution-request.ts
  - tests/product/evolution-request-validation.test.ts
  - specs/tasks/TASK-203-P12-EVOLUTION-REQUEST-VALIDATION.md
forbidden_paths:
  - packages/contracts/**
  - packages/release/**
  - packages/deploy/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Make Evolution request evidence fail closed on malformed, substituted or cross-classification data.

# Context
TASK-202 introduces the bounded Evolution request artifact. P12 requires durable evidence to preserve lineage and reject silent reinterpretation before downstream Mirror/Recipe linkage is allowed.

# Current behavior
Before this TASK, the new artifact has construction semantics but no dedicated fail-closed validator covering unknown fields, identity substitution and invalid lineage.

# Required change
Add canonical validation that rejects unknown fields, missing refs, malformed identity, substituted triage linkage and non-Evolution classification lineage.

# Inputs / contracts
TASK-202 `EvolutionRequestEvidence`, existing SupportTriage validation conventions and deterministic identity semantics.

# Outputs / contracts
Validation API/behavior local to `packages/support-evolution`; no shared contract mutation.

# Acceptance criteria
- malformed and unknown-field inputs fail deterministically;
- substituted IDs fail;
- Support/Maintenance lineage cannot validate as Evolution evidence;
- valid evidence normalizes to the same deterministic value;
- verification passes.

# Non-goals
Serialization, no-leak markers, Mirror/Recipe linkage, release linkage or execution behavior.

# Evidence expected
Focused positive/negative product tests for malformed payloads, substituted identity and cross-classification lineage plus repository verification.

# Escalation
Stop if validation requires modifying a shared contract or widening scope outside the declared files.
