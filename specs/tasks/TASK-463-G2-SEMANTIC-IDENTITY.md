---
id: TASK-463
title: Define owner-qualified semantic identity primitives
status: ready
priority: 463
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/execution_planning/G2-WP-01-SEMANTIC-CONSTITUTION.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
  - packages/contracts/process-versioning/**
  - packages/contracts/evidence-provenance/**
  - specs/contracts/artifact-envelope/artifact-envelope.schema.json
allowed_paths:
  - packages/contracts/semantic-substrate/**
  - tests/product/g2-semantic-substrate*.test.ts
  - specs/tasks/TASK-463-G2-SEMANTIC-IDENTITY.md
  - project_docs/execution_planning/G2-SEMANTIC-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/decision-boundary/**
  - packages/catalog/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Introduce the additive portable identity foundation for the G2 semantic substrate without absorbing domain identity ownership.

# Context
Current main has strong domain-scoped artifact/process/factory identities but no reusable owner-qualified semantic reference. G2 C0 requires canonical identity to remain distinct from provider/external/runtime realization identity.

# Current behavior
Existing contracts use domain-specific IDs and refs. Equal provider/external values are not a universal canonical identity and no cross-capability semantic-owner ref exists.

# Required change
Create a small `semantic-substrate` contract surface with an explicit contract version and deterministic structural primitives for `CanonicalSemanticIdentityRef`, `DefinitionRef`, `OccurrenceRef`, `RealizationIdentityRef` and the minimum owner/kind qualification needed to validate them. Keep canonical and realization identity structurally distinct and fail closed on blank/ambiguous owner/kind/identity.

# Inputs / contracts
Existing provider-neutral artifact identity/provenance and process-versioning identity patterns are precedent only; they remain domain-owned and unchanged.

# Outputs / contracts
Additive reusable semantic identity types/constructors/validators plus focused deterministic product tests.

# Acceptance criteria
- canonical semantic identity explicitly carries semantic owner and semantic kind;
- definition, occurrence and realization identities are distinct types/shapes;
- equal string values cannot silently convert realization/external identity into canonical identity;
- invalid/blank owner, kind or identity fails closed;
- normalization is deterministic and immutable from the consumer perspective;
- no existing domain contract, authority owner or runtime dependency changes;
- declared validations pass.

# Non-goals
Revision vectors, temporal/currentness, graph relations, federation, domain consumer migration, authorization, providers, workflow or storage.

# Evidence expected
Focused product tests proving deterministic identity construction, distinct identity classes and rejection of ambiguous/substituted realization identity, plus repository gates.

# Escalation
Stop if implementation requires a new service/module boundary, universal domain identity registry, destructive existing-contract change or any L4 topology change.