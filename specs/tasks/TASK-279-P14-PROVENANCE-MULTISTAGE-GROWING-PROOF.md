---
id: TASK-279
title: Prove full provenance lineage through Compiler Release Deploy and Observe
status: ready
priority: 279
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-277, TASK-278]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-PROPAGATION-01.md
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/deploy/index.ts
  - packages/observe/index.ts
  - packages/contracts/evidence-provenance/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - tests/product/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/observe/**
  - specs/tasks/TASK-279-P14-PROVENANCE-MULTISTAGE-GROWING-PROOF.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/contracts/artifact-envelope/**
max_files: 16
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction B with a real multi-stage Compiler -> Release -> Deploy -> Observe provenance proof, including compatibility, deterministic preservation and security/no-leak evidence.

# Context
TASK-274..278 establish actual propagation through the representative product chain. The Sprint exit requires one end-to-end proof that the package goal is now exercised across bounded-context artifacts.

# Current behavior
Construction A provides contract semantics; predecessor TASKs provide bounded module propagation and partial integration. No single proof yet spans all four actual transformations.

# Inputs / contracts
Actual Compiler, ReleaseRegistry, Deploy and DeploymentObservation APIs plus the integrated evidence-provenance contract and ADR-0009 boundaries.

# Outputs / contracts
Growing package evidence only. No additional public contract semantics beyond committed predecessors.

# Required change
Add an end-to-end product proof that originates explicit provenance, invokes each real module API in order, and verifies preservation into Observe. Include no-provenance compatibility, malformed-input rejection where applicable, unknown-compatible preservation and no-leak assertions.

# Acceptance criteria
- Compiler -> Release -> Deploy -> Observe uses actual module APIs throughout;
- evidence identity, source references, transformation descriptors and lineage survive each stage deterministically;
- historical no-provenance path remains valid;
- free optional provenance never becomes authorization or runtime availability dependency;
- serialized/diagnostic outputs contain no credential/secret/resolved binding/provider resource/storage locator values;
- Package Goal propagation requirement has objective executable evidence;
- declared validations pass.

# Non-goals
No WBS 14.3 navigation/query API, no Runtime Audit Trail, no optional Construction C work, no debt absorption.

# Evidence expected
Repository-wide verification plus one full multi-stage product proof suitable for Sprint Review.

# Escalation
Stop if completion requires new L4 architecture, core ArtifactEnvelope reinterpretation or scope outside P14-PACKAGE-01.