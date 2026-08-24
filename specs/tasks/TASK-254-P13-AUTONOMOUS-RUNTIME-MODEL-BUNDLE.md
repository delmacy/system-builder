---
id: TASK-254
title: Materialize the complete RuntimeModel into the autonomous compiled bundle
status: ready
priority: 254
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-OFFLINE-AUTONOMY-01.md
  - project_docs/execution_planning/P13-PACKAGE-03.md
  - specs/tasks/TASK-060-AUTONOMOUS-RUNTIME-PROOF.md
  - packages/compiler/index.ts
  - packages/compiler/runtime-model.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
allowed_paths:
  - packages/compiler/**
  - tests/product/**
  - specs/tasks/TASK-254-P13-AUTONOMOUS-RUNTIME-MODEL-BUNDLE.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/builder/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Extend existing Compiler output so the already-defined complete RuntimeModel can be materialized deterministically into the autonomous runtime bundle, without resolved configuration, secrets or Builder lookup.

# Context
TASK-060 proves autonomous Compiler-generated startup/health for the earlier runtime bundle. P13-PACKAGE-01/02 subsequently completed functional execution, identity/session, explicit fail-closed authority and generated experience. Construction A now needs only the additive bundle materialization required to carry that already-integrated RuntimeModel into the autonomous artifact; it must not redesign public contracts or autonomy boundaries.

# Current behavior
TASK-060 proves Compiler-generated startup/health, but current Compiler output does not carry the complete P13 RuntimeModel needed to certify actor-aware functional autonomy.

# Inputs / contracts
Integrated RuntimeModel semantics from P13-PACKAGE-01/02, existing ReleaseArtifact file materialization, ADR-0002 autonomy, external EnvironmentProfile binding.

# Outputs / contracts
Backward-compatible Compiler/runtime bundle materialization of RuntimeModel data only; no new public SystemDefinition semantics.

# Required change
Add the minimum additive compiler materialization needed to emit canonical RuntimeModel data in generated output and reference it from bundle metadata where necessary.

# Acceptance criteria
- identical RuntimeModel input yields byte-identical generated content/hash;
- generated output contains no resolved secret/config value;
- historical compile inputs without RuntimeModel remain compatible;
- no Builder/Observe endpoint is embedded or required;
- no public contracts package change.

# Non-goals
Runtime execution wiring, health semantics, provider topology, deployment mutation or authorization redesign.

# Evidence expected
Focused product tests plus repository verification prove deterministic additive materialization and compatibility.

# Escalation
Stop if this requires L4 boundary change or a canonical public contract change not already authorized.