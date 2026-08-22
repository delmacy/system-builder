---
id: TASK-211
title: Close P12 controlled-evolution growing proof
status: verification
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

# Context
TASK-209 proves the positive human Evolution path and TASK-210 proves the negative operational/production boundary. Sprint Mode requires the final construction TASK to extend the package growing proof and record durable closure evidence before Sprint Review.

# Current behavior
Before this TASK, the Sprint has component-level and focused E2E evidence but no single closure proof/report that regresses the complete controlled-Evolution chain and records residual package-review work.

# Required change
Exercise actual public Support/Evolution APIs from human process-change intake through explicit Evolution triage and TASK-202..208 evidence/linkage. Validate the final link back to a resulting PublishedRelease identity. Regress the negative boundary that Support/Maintenance remain operational-resolution paths while Evolution cannot bypass Mirror/Recipe/release. Produce the Sprint Report.

# Inputs / contracts
Integrated P12 predecessor APIs, TASK-202..210 outputs, canonical ProcessMirror/BusinessRecipe contract identities, public PublishedRelease evidence, Sprint Mode/report requirements and `P12-PACKAGE-01` boundaries.

# Outputs / contracts
One integrated product proof and the Sprint Report. No product/public contract or implementation change in this TASK.

# Acceptance criteria
- growing proof reaches `SupportEvidenceIntake -> SupportTriageDecision(Evolution) -> EvolutionRequestEvidence -> Mirror/Recipe linkage -> PublishedRelease linkage -> original request`;
- predecessor identities remain traceable and deterministic;
- round-trip/validation and no-leak properties are exercised;
- no direct production mutation or automatic business-change execution occurs;
- Sprint Report records TASK commits, validations, deviations/discoveries and residual package review work;
- final repository verification passes before Sprint Review.

# Non-goals
Changing product code, shared contracts, Mirror/Recipe execution, Release/Deploy behavior, package review execution or P13 materialization.

# Evidence expected
One complete P12 controlled-Evolution E2E test, a durable Sprint Report and exact-head Deterministic CI after repository-wide verification.

# Escalation
Stop if closure requires product changes beyond TASK-202..208 outputs, shared-schema/L4 changes, direct production authority or work belonging to the package review/P13.

# Exit gate
Stop at Sprint Review on exact TASK-211 closure head. P13 and P12 package Integration & Technical Debt Review remain blocked until Sprint 4 merge and fresh-main reconstruction.
