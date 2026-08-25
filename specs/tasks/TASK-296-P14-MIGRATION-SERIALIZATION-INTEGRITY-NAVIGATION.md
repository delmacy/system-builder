---
id: TASK-296
title: Certify migration plus serialization preserves provenance integrity and navigation
status: ready
priority: 296
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-294]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-MIGRATION-CERTIFICATION-01.md
  - packages/contracts/evidence-provenance/**
  - packages/deploy/migration-preflight.ts
  - tests/product/evidence-provenance-integrity-serialization.test.ts
  - tests/product/p14-provenance-navigation-growing-proof.test.ts
allowed_paths:
  - tests/product/p14-provenance-migration-serialization-integrity-navigation.test.ts
  - specs/tasks/TASK-296-P14-MIGRATION-SERIALIZATION-INTEGRITY-NAVIGATION.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Certify the combined WBS 14.3.3 boundary: successful existing migration preflight plus canonical serialization preserves Construction A integrity and Construction B navigation semantics.

# Context
TASK-285 already proves JSON serialization alone. TASK-294 proves successful migration preflight with provenance propagation. This TASK composes those existing proofs and must reuse the actual integrity/navigation APIs.

# Current behavior
Integrity, navigation, serialization and migration preflight are each available, but their combined preservation has not been certified.

# Required change
Add a deterministic product test that compiles migration-bearing provenance, successfully preflights actual generated migrations, performs canonical JSON round-trip of the provenance-bearing public data, then verifies integrity and rebuilds/queries navigation using existing APIs.

# Inputs / contracts
Construction A integrity helpers, Construction B navigation helpers, actual Compiler/Deploy migration boundary and TASK-285 serialization semantics.

# Outputs / contracts
Composed evidence-only proof. No public contract or architecture change.

# Acceptance criteria
- Successful migration preflight is a prerequisite to the preservation assertion.
- Canonical serialization/deserialization retains evidenceId, sources, lineage and integrity semantics.
- Existing integrity verification passes after round-trip.
- Existing source→evidence and evidence→source navigation returns the same canonical relations after round-trip.
- Repeated equivalent runs are deterministic.
- No secret/provider/storage material is introduced.
- Declared validations pass.

# Non-goals
No schema/database migration engine, no provider topology, no graph store, no authorization semantics.

# Evidence expected
Focused composed product test plus repository verification.

# Escalation
Stop if composition requires changing existing integrity/navigation or migration contracts rather than testing them.
