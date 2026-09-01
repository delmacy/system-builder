---
id: TASK-441
title: Prove immutable artifact and external configuration boundaries
status: blocked
priority: 441
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-440
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - scripts/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/contracts/environment-profile/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - docs/operations/**
  - specs/tasks/TASK-441-P19-RUNTIME-CONFIG-IMMUTABILITY.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/contracts/decision-boundary/**
  - apps/**
max_files: 10
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove that runtime materialization preserves immutable published artifacts while EnvironmentProfile/configuration and secrets remain external to Release content and protected from diagnostic/output leakage.

# Context
ADR-0007 requires strict Release/Environment separation; ADR-0002 requires autonomous Runtime without Builder dependency. The existing local-process Deploy already injects EnvironmentProfile and resolved secrets through the child-process environment and snapshots immutable inputs.

# Current behavior
The lower-level adapter has focused protections, but the new WBS 19.2.2 supported handoff path must prove those guarantees still hold end-to-end when driven from canonical bootstrap/factory outputs.

# Required change
Extend product/heavy proofs and only minimal helper/documentation code as necessary to demonstrate immutable release/generated inputs, external environment/config injection, secret redaction/non-embedding, cleanup of temporary materialization and absence of hidden cross-run mutable state. Reuse existing secret-resolution and Deploy safeguards.

# Inputs / contracts
TASK-440 supported invocation; canonical PublishedRelease/ReleaseArtifact; verified generated-file payload; EnvironmentProfile; existing SecretResolver and local-process Deploy semantics.

# Outputs / contracts
Evidence that the exact release/artifact snapshots are unchanged after launch and protected values are absent from release/generated artifacts, bounded diagnostics and persisted repository fixtures.

# Acceptance criteria
- canonical PublishedRelease, ReleaseArtifact and generated payload are byte-for-byte unchanged after invocation;
- EnvironmentProfile is external to immutable release content;
- secrets are resolved only through existing external resolver/environment mechanisms and never serialized into release/generated artifacts or diagnostics;
- temporary runtime materialization is cleaned after completion;
- repeated clean invocations do not depend on hidden mutable prior state;
- negative secret-resolution/migration failures redact protected values;
- declared validations pass.

# Negative/adversarial cases
Secret value appearing in error/migration evidence, mutation of release/artifact/generated file inputs, environment injected into immutable artifact content, leftover temp materialization or cross-run state dependence must fail proof.

# Non-goals
Secret-store productization, production credential management, persistent supervisor, new environment schema, runtime continuity, upgrade/rollback or new deployment topology.

# Evidence expected
Core/heavy proofs over the real supported invocation and existing Deploy adapter, including before/after snapshots and secret-leak assertions.

# Escalation
Stop if proof requires changing ADR-0002/0007 semantics or adding a new secret/config authority.
