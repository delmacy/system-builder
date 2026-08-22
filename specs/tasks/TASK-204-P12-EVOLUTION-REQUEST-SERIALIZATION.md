---
id: TASK-204
title: Add lossless serialization for EvolutionRequestEvidence
status: ready
priority: 520
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-203
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - packages/support-evolution/evolution-request.ts
allowed_paths:
  - packages/support-evolution/evolution-request.ts
  - tests/product/evolution-request-serialization.test.ts
  - specs/tasks/TASK-204-P12-EVOLUTION-REQUEST-SERIALIZATION.md
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
Provide deterministic lossless JSON round-trip for validated Evolution request evidence.

# Context
TASK-203 makes the new Evolution request artifact fail closed. Durable P12 evidence must remain portable and reproducible across serialization boundaries before downstream linkage.

# Current behavior
Before this TASK there is no dedicated JSON round-trip API for `EvolutionRequestEvidence`.

# Required change
Add `toJson`/`fromJson` semantics that validate before serialization/use, reject malformed JSON and preserve deterministic identity.

# Inputs / contracts
Validated TASK-203 `EvolutionRequestEvidence` and existing Support/Evolution serialization conventions.

# Outputs / contracts
Lossless serialization behavior local to the Support/Evolution module; no shared schema change.

# Acceptance criteria
- `toJson` validates before serialization;
- `fromJson` rejects malformed JSON and invalid payloads;
- equivalent inputs round-trip without identity drift;
- no new contract/schema boundary is introduced;
- verification passes.

# Non-goals
No-leak enforcement beyond predecessor validation, Mirror/Recipe linkage, release linkage or execution.

# Evidence expected
Focused round-trip and malformed-input product tests plus repository verification.

# Escalation
Stop if serialization requires a shared schema change or broadens durable fields beyond Sprint authority.
