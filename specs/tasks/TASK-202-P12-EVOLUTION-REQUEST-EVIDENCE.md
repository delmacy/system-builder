---
id: TASK-202
title: Define deterministic EvolutionRequestEvidence from explicit Evolution triage
status: verification
priority: 500
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/triage.ts
  - packages/support-evolution/index.ts
allowed_paths:
  - packages/support-evolution/evolution-request.ts
  - packages/support-evolution/index.ts
  - tests/product/evolution-request-contract.test.ts
  - specs/tasks/TASK-202-P12-EVOLUTION-REQUEST-EVIDENCE.md
forbidden_paths:
  - packages/contracts/**
  - packages/release/**
  - packages/deploy/**
  - .github/**
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Create a deterministic provider-neutral `EvolutionRequestEvidence` artifact derived only from a validated `SupportTriageDecision(Evolution)` and explicit process-change evidence references.

# Context
P12 is integrated through operational Support/Maintenance resolution. Evolution is already a valid explicit triage classification but is intentionally rejected by operational case/problem constructors. WBS 12.3.1 now requires converting a process-change request into durable evolution evidence before any business-knowledge linkage.

# Current behavior
`SupportTriageDecision` can represent `Evolution`, but no Support/Evolution artifact currently records the resulting process-change evidence as its own deterministic subject.

# Required change
Add the bounded Support/Evolution API and focused contract tests. The constructor must reject Support/Maintenance triage, require explicit evidence/provenance refs, derive stable identity deterministically, and expose no execution/mutation method.

# Inputs / contracts
Validated `SupportTriageDecision`, existing deterministic hashing utility, Support/Evolution public-module conventions and WBS 12.3.1.

# Outputs / contracts
New module-local `EvolutionRequestEvidence` API exported from `packages/support-evolution`. No shared schema or cross-package public contract mutation.

# Acceptance criteria
- only explicit `Evolution` triage is accepted;
- original `intakeId`/`triageId` remain linked by identity/reference, not embedded upstream objects;
- evidence/reason/context refs are explicit and deterministic;
- no direct Mirror/Recipe execution or production mutation exists;
- product tests and repository verification pass.

# Non-goals
ProcessMirror/BusinessRecipe linkage, release linkage, automatic classification, prioritization, execution or deployment.

# Evidence expected
Focused product tests proving deterministic identity, valid Evolution construction and rejection of Support/Maintenance lineage, plus repository verification.

# Escalation
Stop if a shared contract/schema or L4 boundary must change.
