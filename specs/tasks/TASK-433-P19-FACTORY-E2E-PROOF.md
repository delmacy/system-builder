---
id: TASK-433
title: Prove complete clean reproducible factory E2E journey
status: blocked
priority: 433
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-432
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-FACTORY-E2E-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - package.json
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - project_docs/execution_planning/P19-FACTORY-E2E-01.md
  - specs/tasks/TASK-433-P19-FACTORY-E2E-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 12
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide the final WBS 19.1.3 growing/product proof that the repository-supported command/API reproduces the complete integrated factory journey from clean deterministic prerequisites with auditable lineage and fail-closed negative paths.

# Context
TASK-429..432 establish the complete-journey primitive, supported command, clean reproducibility and command-level adversarial failure propagation. This TASK closes only the evidence gap for WBS 19.1.3.

# Current behavior
The Sprint increments prove the required pieces individually, but there is not yet one final growing proof tying clean invocation, complete canonical lineage, deterministic equivalence and adversarial failures together at the supported entrypoint.

# Required change
Extend the growing product proof to execute the real supported command/API from clean canonical inputs through the existing integrated composition chain, capture auditable stage/result identities, repeat the clean run for equivalence, and exercise the declared invalid predecessor classes. Do not add alternate fixtures/paths merely to make the proof pass.

# Inputs / contracts
TASK-429..432 outputs, canonical clean fixture/input, integrated WBS 19.1.1/19.1.2 factory boundaries and existing module-owned public APIs.

# Outputs / contracts
One complete WBS 19.1.3 proof showing supported clean invocation, deterministic canonical lineage/result equivalence, explicit failure propagation and absence of external side effects.

# Acceptance criteria
- proof invokes the repository-supported entrypoint rather than directly stitching internal stages;
- complete canonical process -> analysis/definition -> capability -> assembly -> validation -> compiler -> release-preview -> deployment dry-run lineage is auditable;
- repeated equivalent clean runs produce equivalent deterministic result/evidence;
- missing, stale, incompatible, substituted and lineage-broken predecessors fail closed through the supported entrypoint;
- existing core and applicable heavy product proofs regress successfully;
- no runtime launch, publication/deployment execution, persistence or external service is introduced;
- declared validations pass.

# Non-goals
WBS 19.2.1 operator bootstrap, runtime materialization/handoff, autonomous continuity, dogfood, production UX, new deployment topology, unrelated findings/TD or inferred L4.

# Evidence expected
Focused growing/product tests plus exact-head repository verification/Heavy evidence demonstrating the supported clean E2E journey and all declared negative paths without parallel implementations.

# Escalation
Stop if satisfying the WBS requires runtime launch, new bounded-context ownership, Builder/Runtime topology change, release/deployment execution-model change or any other undeclared L4.