---
id: TASK-211
title: Close P12 controlled-evolution growing proof
status: ready
priority: 590
milestone: M12
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-209
  - TASK-210
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.md
  - project_docs/execution_planning/P12-PACKAGE-01.md
  - packages/support-evolution/index.ts
  - packages/contracts/process-mirror/index.ts
  - packages/contracts/business-recipe/index.ts
  - packages/release/index.ts
allowed_paths:
  - tests/product/p12-controlled-evolution-e2e.test.ts
  - project_docs/execution_planning/P12-CONTROLLED-EVOLUTION-LINKAGE-01.report.md
  - specs/tasks/TASK-211-P12-EVOLUTION-GROWING-PROOF.md
forbidden_paths:
  - packages/**
  - packages/contracts/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective
Close P12 Sprint 4 with one deterministic integrated proof spanning the real P12 predecessor chain into controlled Evolution traceability and produce the Sprint Report.

# Required change
Exercise actual public Support/Evolution APIs from human process-change intake through explicit Evolution triage and TASK-202..208 evidence/linkage. Validate the final link back to a resulting PublishedRelease identity. Regress the negative boundary that Support/Maintenance remain operational-resolution paths while Evolution cannot bypass Mirror/Recipe/release.

# Acceptance criteria
- growing proof reaches `SupportEvidenceIntake -> SupportTriageDecision(Evolution) -> EvolutionRequestEvidence -> Mirror/Recipe linkage -> PublishedRelease linkage -> original request`;
- predecessor identities remain traceable and deterministic;
- round-trip/validation and no-leak properties are exercised;
- no direct production mutation or automatic business-change execution occurs;
- Sprint Report records TASK commits, validations, deviations/discoveries and residual package review work;
- final repository verification passes before Sprint Review.

# Exit gate
Stop at Sprint Review on exact TASK-211 closure head. P13 and P12 package Integration & Technical Debt Review remain blocked until Sprint 4 merge and fresh-main reconstruction.
