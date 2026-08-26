---
id: TASK-314
title: Guard explicit bounded fallback for unavailable probabilistic decisions
status: ready
priority: 314
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-313
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01.md
  - specs/tasks/TASK-313-P15-PROVIDER-UNAVAILABILITY-RESULT.md
  - packages/contracts/decision-boundary/index.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - specs/tasks/TASK-314-P15-BOUNDED-FALLBACK-GUARD.md
forbidden_paths:
  - docs/adr/**
  - project_docs/16-ai-gateway/**
  - tooling/agent-harness/policies/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add a deterministic fail-closed guard for fallback when probabilistic evidence is unavailable, permitting only explicit bounded fallback to already-valid deterministic or human-decision evidence.

# Context
TASK-313 makes unavailability explicit. WBS 15.3.2 additionally requires fallback behavior to be proven bounded rather than silently reclassifying unavailable probabilistic output as deterministic or human authority.

# Current behavior
The canonical boundary prevents probabilistic substitution for deterministic/human authority, but there is no dedicated fallback evaluation linking explicit unavailability to an explicitly declared alternative decision category/reference.

# Required change
Add the minimum additive fallback evaluator that consumes explicit unavailability plus an explicit candidate fallback decision and returns deterministic accepted/rejected/invalid evidence. Acceptance must depend on the existing verification/authority semantics of the candidate; the fallback guard itself must never create authority.

# Inputs / contracts
TASK-313 provider-neutral availability result, existing decision-boundary verification result, category metadata, risk/criticality and ADR-0010 human authority reservation semantics.

# Outputs / contracts
Explicit fallback evaluation with bounded status/diagnostic/reference fields. No generated approval/authorization, no implicit category conversion and no provider-specific state.

# Acceptance criteria
- unavailable probabilistic evidence never silently becomes a deterministic or human-decision result;
- explicit fallback to a valid deterministic candidate may be accepted only as that candidate's existing deterministic evidence;
- explicit fallback to a human-decision candidate preserves human authority reservation and cannot manufacture approval;
- malformed, implicit, mismatched-category or unverifiable fallback candidates fail closed;
- available probabilistic evidence does not trigger fallback implicitly;
- no provider/network/secret/storage behavior is introduced;
- declared validations pass.

# Non-goals
No retry policy, provider selection, provider registry, approval workflow redesign, authorization semantics change, AI Gateway implementation, Runtime Audit Trail replacement or L4 change.

# Evidence expected
Product tests covering deterministic fallback, human-reserved fallback, available-no-fallback, malformed/mismatched and authority-confusion cases plus repository verification.

# Escalation
Stop if the implementation would need to manufacture authority, alter ADR-0010 semantics, choose a concrete provider, or change architecture outside the declared scope.
