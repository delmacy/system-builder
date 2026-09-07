---
id: TASK-470
title: Prove evidence-provenance coexistence with semantic substrate
status: ready
priority: 470
milestone: G2
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-469
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONSUMER-COEXISTENCE-01.md
  - packages/contracts/semantic-substrate/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - tests/product/g2-semantic-coexistence-evidence-provenance.test.ts
  - specs/tasks/TASK-470-G2-EVIDENCE-PROVENANCE-COEXISTENCE.md
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
Prove that existing evidence/provenance contracts can carry or reference semantic identity qualification additively without converting provenance into truth, currentness or authority.

# Required change
Exercise real public evidence-provenance exports beside semantic-substrate references. Add only the smallest directional compatibility helper if direct composition is insufficient. Preserve existing binary/bounded evidence semantics exactly.

# Acceptance criteria
- provenance remains distinct from semantic truth/currentness/authority;
- evidence identity and semantic identity cannot collapse by equal external/provider values;
- unknown/stale semantic qualification remains explicit and cannot upgrade evidence status;
- historical evidence payload interpretation remains backward-compatible;
- no reverse dependency from semantic-substrate into evidence-provenance is introduced;
- adversarial owner/revision substitution fails closed.

# Non-goals
Evidence storage, new attestation authority, policy evaluation, migration or runtime effects.
