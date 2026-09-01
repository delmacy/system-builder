---
id: TASK-459
title: Regenerate and publish successor from approved revision
status: blocked
priority: 459
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-458
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-SUCCESSOR-PROCESS-EVOLUTION-01.md
  - packages/compiler/**
  - packages/release/**
  - scripts/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - packages/compiler/**
  - packages/release/**
  - project_docs/execution_planning/P19-SUCCESSOR-PROCESS-EVOLUTION-01.md
  - specs/tasks/TASK-459-P19-SUCCESSOR-REGENERATION-PUBLISH.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - apps/**
max_files: 12
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Regenerate and publish canonical successor system B from the approved successor process revision through existing factory/Compiler/Release owners.

# Required change
Feed the exact approved B process revision through the supported generation path and require its SystemDefinition, artifact payload and immutable Release identities to preserve revision provenance rather than deriving B from test-local release edits.

# Acceptance criteria
- B generation starts from the exact approved successor process revision;
- process revision -> definition -> artifact -> PublishedRelease refs/hashes remain canonical and auditable;
- repeated identical generation/publication is deterministic/idempotent where existing APIs promise it;
- stale/substituted/unapproved revision, broken lineage, unverifiable payload and hash/ref mismatch fail closed before publication side effects;
- A remains immutable and reconstructible;
- no new factory, release owner, public contract or identity scheme is introduced.

# Non-goals
Deploying B, Runtime changes, customer/domain semantics, WBS 19.3.3+ or generalized migration authority.

# Evidence expected
Focused product/heavy proof for approved-revision regeneration/publication and negative lineage/hash/publication paths plus declared gates.

# Escalation
Stop if successor generation requires a new public process/system contract or parallel publication authority.
