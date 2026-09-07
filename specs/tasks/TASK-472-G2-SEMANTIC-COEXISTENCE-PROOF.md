---
id: TASK-472
title: Prove integrated G1/G2 semantic coexistence
status: ready
priority: 472
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-471
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONSUMER-COEXISTENCE-01.md
  - specs/tasks/TASK-469-G2-PROCESS-VERSION-COEXISTENCE.md
  - specs/tasks/TASK-470-G2-EVIDENCE-PROVENANCE-COEXISTENCE.md
  - specs/tasks/TASK-471-G2-FACTORY-BOUNDARY-COEXISTENCE.md
  - packages/contracts/semantic-substrate/**
  - packages/contracts/process-versioning/**
  - packages/contracts/evidence-provenance/**
  - packages/contracts/factory-boundary/**
allowed_paths:
  - packages/contracts/process-versioning/**
  - packages/contracts/evidence-provenance/**
  - packages/contracts/factory-boundary/**
  - tests/product/g2-semantic-coexistence*.test.ts
  - specs/tasks/TASK-472-G2-SEMANTIC-COEXISTENCE-PROOF.md
  - project_docs/execution_planning/G2-SEMANTIC-CONSUMER-COEXISTENCE-01.md
forbidden_paths:
  - packages/contracts/semantic-substrate/**
  - packages/runtime-core/**
  - apps/**
  - packages/deploy/**
  - packages/observe/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction B with one integrated deterministic proof that multiple existing G1 owners coexist directionally with the G2 semantic substrate without semantic or authority strengthening.

# Context
TASK-469..471 establish focused coexistence evidence for process-versioning, evidence-provenance and factory-boundary. The Sprint exit requires one coherent proof across those real public owner surfaces.

# Current behavior
No single integrated proof currently demonstrates all three G1 owners alongside the G2 substrate while preserving historical interpretability and non-strengthening semantics.

# Required change
Compose process-versioning, evidence-provenance and factory-boundary through their real public exports together with the integrated semantic-substrate surface. Add adversarial cases for owner/revision substitution, equal external/provider identity, stale/unknown currentness, relation reversal and accidental truth/authority promotion.

# Inputs / contracts
Outputs from TASK-469..471, public G1 owner exports and the integrated semantic-substrate public surface.

# Outputs / contracts
One deterministic multi-owner coexistence product proof suitable as Construction B closure evidence without changing canonical G1 contract meaning.

# Acceptance criteria
- at least three existing G1 owner surfaces are exercised in one coherent proof;
- G1 historical identities/revisions/evidence remain interpretable without G2;
- semantic references add qualification but never replace G1 canonical keys;
- provenance != truth != currentness != authority is demonstrated across boundaries;
- stale/unknown currentness and remote/fleet qualification cannot promote local/domain truth;
- typed directional edges cannot imply reverse authority;
- no existing G1 contract version is destructively changed;
- repository-wide deterministic and heavy gates remain green.

# Non-goals
Construction C hardening, package review, migration, runtime effects, persistence, provider support-vector implementation or universal semantic normalization.

# Evidence expected
One integrated happy/negative/adversarial product proof plus repository-wide deterministic and Heavy Product Tests on the exact final head.

# Escalation
Stop if the proof requires rewriting G1 canonical keys/evidence semantics, reverse authority, weakening currentness, destructive migration, universal normalization or L4 topology.