---
id: TASK-440
title: Invoke existing local-process Deploy from canonical handoff
status: blocked
priority: 440
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-439
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - specs/tasks/TASK-439-P19-RUNTIME-HANDOFF-PREFLIGHT.md
  - scripts/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/release/**
  - packages/contracts/environment-profile/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - package.json
  - specs/tasks/TASK-440-P19-RUNTIME-MATERIALIZATION-INVOKE.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/contracts/decision-boundary/**
  - apps/**
  - tooling/agent-harness/**
max_files: 10
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:architecture
  - npm run verify
---
# Objective
Add one supported maintainer invocation that takes the TASK-439 launch-ready binding and delegates exactly once to the existing `runLocalProcessDeployment` adapter using verified Compiler artifact payload and an external EnvironmentProfile.

# Context
The existing local-process Deploy adapter already owns real generated-runtime materialization and launch. This TASK must compose it; it must not duplicate its lifecycle, startup, migration, secret or cleanup logic.

# Current behavior
The supported operator bootstrap terminates at canonical factory E2E/dry-run output. Real local-process deployment exists only as a lower-level Deploy primitive and tests.

# Required change
Add the thinnest repository-supported command/helper needed to materialize the verified artifact payload from existing Compiler/repository primitives, bind explicit external environment/secret dependencies, and invoke `runLocalProcessDeployment` exactly once after TASK-439 preflight. Preserve the existing bootstrap/factory path as source of release identity and the existing Deploy adapter as source of launch behavior.

# Inputs / contracts
TASK-439 launch-ready binding, existing verified artifact-payload reader/repository primitive, existing EnvironmentProfile, optional SecretResolver/migration dependencies, and existing local-process Deploy API.

# Outputs / contracts
A bounded invocation result that carries the existing Deploy result plus canonical release/deployment lineage references. No parallel runtime lifecycle model.

# Acceptance criteria
- supported invocation delegates to the existing local-process Deploy exactly once;
- generated files come from verified artifact payload matching the canonical ReleaseArtifact hash;
- EnvironmentProfile and optional secret resolution are supplied externally, never embedded into release inputs;
- actual generated `runtime-entry.mjs` is launched through the existing adapter on the positive path;
- preflight/payload failure rejects before process activation;
- no Builder callback/control dependency is introduced into generated Runtime;
- focused positive/negative integration tests use real existing Compiler/Deploy primitives rather than hand-authored runtime mocks;
- declared validations pass.

# Negative/adversarial cases
Unverified payload, substituted payload hash, missing runtime entrypoint, incompatible environment, missing secret resolver dependency where required and any attempt to bypass TASK-439 preflight or call a second launch path must fail deterministically.

# Non-goals
New process supervisor, Docker/Vercel adapter, persistence redesign, runtime continuity, traffic switching, dogfood, upgrade/rollback or new public contracts.

# Evidence expected
Focused real-process/product proof plus Heavy Product Tests where process execution is exercised, and repository-wide verification.

# Escalation
Stop if a second deployment topology, persistent control plane or Builder-owned runtime dependency appears necessary.
