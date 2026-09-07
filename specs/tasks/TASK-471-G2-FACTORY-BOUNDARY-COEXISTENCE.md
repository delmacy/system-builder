---
id: TASK-471
title: Prove factory-boundary coexistence with semantic substrate
status: ready
priority: 471
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-470
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONSUMER-COEXISTENCE-01.md
  - packages/contracts/semantic-substrate/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - packages/contracts/factory-boundary/**
  - tests/product/g2-semantic-coexistence-factory-boundary.test.ts
  - specs/tasks/TASK-471-G2-FACTORY-BOUNDARY-COEXISTENCE.md
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
Prove that factory journey/boundary contracts can reference owner-qualified semantic subjects without transferring Builder/Runtime authority or rewriting existing lineage.

# Context
Construction A introduced owner-qualified semantic references while Factory/Compiler/Release/Runtime boundaries remain authoritative for their existing lifecycle semantics.

# Current behavior
Factory-boundary and semantic-substrate public surfaces coexist, but no focused proof demonstrates directional composition without authority or lineage strengthening.

# Required change
Compose real public factory-boundary exports with semantic-substrate references through the smallest additive directional seam or proof. Preserve Factory/Compiler/Release lineage ownership and published Runtime autonomy.

# Inputs / contracts
Public factory-boundary exports and integrated semantic identity, revision, relation and currentness contracts.

# Outputs / contracts
A directional consumer-side coexistence seam/proof demonstrating preserved factory lineage and Runtime autonomy.

# Acceptance criteria
- factory journey identities and lineage remain authoritative in factory-boundary/process-versioning owners;
- semantic references are additive and owner-qualified;
- equal generated/provider/runtime realization values do not collapse canonical semantic identity;
- directional semantic relations do not imply reverse Builder/Runtime dependency or execution authority;
- stale/unknown semantic currentness cannot change factory journey success/evidence semantics;
- architecture dependency gates remain green.

# Non-goals
Factory orchestration changes, compiler/release/deploy/runtime behavior, provider abstraction or lifecycle migration.

# Evidence expected
Focused public-export product proof with authority/identity/currentness negative cases plus repository-wide architecture and deterministic gates.

# Escalation
Stop if coexistence requires Runtime->Builder dependency, lifecycle authority transfer, factory orchestration changes, destructive migration or L4 topology.