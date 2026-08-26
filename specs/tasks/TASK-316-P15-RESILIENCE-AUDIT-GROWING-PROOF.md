---
id: TASK-316
title: Close Construction B with integrated resilience and audit proof
status: completed
priority: 316
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-315
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01.md
  - project_docs/execution_planning/P15-PACKAGE-02.md
  - project_docs/15-deterministic-human-probabilistic-boundary/WBS.md
  - specs/tasks/TASK-313-P15-PROVIDER-UNAVAILABILITY-RESULT.md
  - specs/tasks/TASK-314-P15-BOUNDED-FALLBACK-GUARD.md
  - specs/tasks/TASK-315-P15-REAL-PATH-RESILIENCE-AUDIT.md
  - packages/contracts/decision-boundary/index.ts
  - packages/contracts/decision-boundary/critical-decision-audit.ts
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - tooling/agent-harness/tests/**
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01.report.md
  - specs/tasks/TASK-316-P15-RESILIENCE-AUDIT-GROWING-PROOF.md
forbidden_paths:
  - docs/adr/**
  - project_docs/16-ai-gateway/**
  - tooling/agent-harness/policies/**
max_files: 9
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Complete Construction B with an integrated growing proof and durable Sprint Report covering WBS 15.3.2 and the residual real-path portion of WBS 15.3.3.

# Context
TASK-313..315 establish provider-neutral availability evidence, explicit bounded fallback behavior and representative resilience auditability. The Sprint must close with one integrated proof before Sprint Review.

# Current behavior
The predecessor TASKs provide bounded components/proofs, but Construction B is not complete until the full resilience matrix is exercised together and its residual disposition is recorded.

# Required change
Add the integrated product proof that exercises available probabilistic evidence, unavailable evidence, explicit deterministic fallback, human-reserved fallback, mismatch/fail-closed behavior and critical audit projection through actual exported APIs. Produce the Construction B Sprint Report with authoritative TASK commits, validation evidence, deviations and residual Package disposition.

# Inputs / contracts
All integrated outputs of TASK-313..315, existing decision-boundary verification/audit APIs, P15-PACKAGE-02 goal and WBS 15.3.

# Outputs / contracts
Growing product proof plus `P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01.report.md`; no new authority, provider infrastructure or storage topology.

# Acceptance criteria
- one integrated proof covers available/unavailable/fallback behavior and all canonical decision categories relevant to the Package Goal;
- implicit or malformed fallback remains fail-closed;
- human-decision evidence never becomes approval by resilience/fallback handling;
- deterministic fallback cannot be satisfied by probabilistic output without explicit compatible evidence;
- critical audit evidence preserves category/risk/criticality/reference/context and excludes provider payloads/secrets;
- Sprint Report records TASK-313..316 commits/gates, bounded corrections and explicit residual disposition for WBS 15.3.2/15.3.3;
- no Construction C scope is implemented here;
- declared validations pass.

# Non-goals
No provider implementation, AI Gateway, retry scheduler, Runtime Audit Trail replacement, persistent audit store, policy engine, successor Package work, TD-P13 absorption or L4 architecture change.

# Evidence expected
Integrated product proof, repository-wide verification and a Sprint Report suitable for exact-head CI/Sprint Review.

# Escalation
Stop if the integrated proof exposes a genuine missing Package capability that cannot be fixed within TASK-313..316 bounds, or if satisfying it requires L4/forbidden/successor scope. Record that as the post-Construction-B evidence gate instead of expanding this Sprint.
