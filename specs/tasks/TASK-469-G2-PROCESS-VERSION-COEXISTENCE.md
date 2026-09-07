---
id: TASK-469
title: Prove process-versioning coexistence with semantic substrate
status: ready
priority: 469
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONSUMER-COEXISTENCE-01.md
  - packages/contracts/semantic-substrate/**
  - packages/contracts/process-versioning/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - tests/product/g2-semantic-coexistence-process-version.test.ts
  - specs/tasks/TASK-469-G2-PROCESS-VERSION-COEXISTENCE.md
  - project_docs/execution_planning/G2-SEMANTIC-CONSUMER-COEXISTENCE-01.md
forbidden_paths:
  - packages/contracts/semantic-substrate/**
  - packages/runtime-core/**
  - apps/**
  - packages/deploy/**
  - packages/observe/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Add the minimum directional process-versioning -> semantic-substrate coexistence seam/proof without changing canonical process revision meaning or historical lineage.

# Context
Construction A integrated the additive G2 semantic substrate. Process-versioning remains the historical owner of process identity, revisions and lineage.

# Current behavior
The two public contract families coexist in the repository but no focused consumer-side proof demonstrates exact owner/revision preservation across their boundary.

# Required change
Use existing public process-versioning identities/revisions with owner-qualified semantic references. Prefer an additive adapter/reference helper only if needed; otherwise prove coexistence directly through public exports. Preserve immutable producing revisions and explicit currentness qualification.

# Inputs / contracts
Public process-versioning exports and the integrated public semantic-substrate identity, revision and currentness contracts.

# Outputs / contracts
A directional consumer-side coexistence seam or focused product proof that leaves process-versioning canonical keys and lineage authoritative.

# Acceptance criteria
- canonical process identity/revision remains owned by process-versioning;
- semantic identity is an additive qualified reference, never a replacement key;
- revision substitution and owner mismatch fail closed;
- stale/unknown semantic currentness cannot rewrite or strengthen historical process revision truth;
- no semantic-substrate -> process-versioning dependency is introduced;
- existing process-versioning tests remain unchanged/green unless additive proof requires a focused extension.

# Non-goals
Process migration, approval-policy changes, runtime behavior, persistence, provider semantics or universal normalization.

# Evidence expected
Focused happy and negative product proof plus repository-wide task, architecture, type and deterministic gates.

# Escalation
Stop if coexistence requires changing canonical process revision meaning, reverse dependency, destructive migration, new lifecycle authority or L4 topology.