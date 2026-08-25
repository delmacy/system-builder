---
id: TASK-274
title: Propagate evidence provenance through Compiler release output
status: ready
priority: 274
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-PROPAGATION-01.md
  - project_docs/execution_planning/P14-PACKAGE-01.post-construction-a-revalidation.md
  - packages/contracts/evidence-provenance/index.ts
  - packages/compiler/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/compiler/**
  - tests/product/**
  - specs/tasks/TASK-274-P14-COMPILER-PROVENANCE-PROPAGATION.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/contracts/artifact-envelope/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Make the actual Compiler transformation preserve an optional normalized evidence-provenance extension into its ReleaseArtifact output without changing ADR-0009 core envelope meaning.

# Context
Construction A integrated deterministic evidence-provenance normalization but real product producers do not yet propagate it. Compiler is the first representative producer in the committed multi-stage chain.

# Current behavior
`compileSyntheticRelease` produces deterministic ReleaseArtifact data but carries no evidence-provenance extension.

# Inputs / contracts
Existing Compiler inputs/output, integrated `@system-builder/contracts/evidence-provenance`, ADR-0009 compatibility rules.

# Outputs / contracts
Optional additive ReleaseArtifact provenance metadata normalized by the integrated contract. Historical calls without provenance preserve existing behavior and identity semantics unless an existing deterministic identity contract explicitly requires additive metadata participation.

# Required change
Add the smallest provider-neutral Compiler input/output surface needed to accept and propagate normalized evidence provenance. Reject malformed supplied provenance explicitly. Do not derive secrets/provider/storage data or infer provenance from ambient state.

# Acceptance criteria
- actual `compileSyntheticRelease` accepts explicit optional provenance and emits its normalized form;
- malformed provenance fails explicitly;
- absence preserves historical behavior;
- deterministic equivalent input produces equivalent output;
- no credential, secret value, mandatory provider resource ID or storage locator is introduced;
- provenance remains evidence only;
- declared validations pass.

# Non-goals
No core ArtifactEnvelope redesign, new provider, WBS 14.3 query/navigation, Runtime Audit Trail, Release/Deploy/Observe propagation.

# Evidence expected
Focused product tests around actual Compiler output plus repository verification.

# Escalation
Stop for any required L4 boundary/topology change or reinterpretation of ADR-0009 core fields.