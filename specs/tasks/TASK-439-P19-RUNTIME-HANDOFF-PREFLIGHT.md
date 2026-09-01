---
id: TASK-439
title: Bind canonical factory outputs to runtime handoff preflight
status: ready
priority: 439
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - scripts/factory-operator-bootstrap-command.ts
  - scripts/factory-e2e-command.ts
  - packages/contracts/factory-boundary/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/release/**
  - packages/contracts/environment-profile/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - specs/tasks/TASK-439-P19-RUNTIME-HANDOFF-PREFLIGHT.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/contracts/decision-boundary/**
  - apps/**
  - tooling/agent-harness/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the smallest internal runtime-handoff preflight that binds the successful canonical operator-bootstrap/factory result to the already existing local-process Deploy inputs without introducing a new public contract or orchestration owner.

# Context
WBS 19.2.1 is integrated and returns the canonical factory result containing ReleaseArtifact, PublishedRelease and dry-run DeploymentRecord. Existing Deploy already owns real local-process activation. WBS 19.2.2 needs a fail-closed seam between those existing boundaries before any process activation.

# Current behavior
The bootstrap path stops after canonical factory E2E/dry-run evidence. The local-process Deploy adapter can launch verified generated artifacts, but there is no WBS 19.2.2-specific binding proving that the release/artifact/environment handed to it are exactly the canonical bootstrap predecessors.

# Required change
Add only an internal preflight/binding helper and focused tests that consume the canonical bootstrap result plus explicit external EnvironmentProfile/materialization dependencies. Reuse existing Deploy/ReleaseArtifact/PublishedRelease types and identity fields. Validate exact artifact hash/ref, release identity/version, runtime compatibility and canonical deployment predecessor linkage before returning launch-ready inputs. Do not perform launch in this TASK.

# Inputs / contracts
Successful `executeFactoryOperatorBootstrap` result, existing factory E2E output binding, existing ReleaseArtifact/PublishedRelease/DeploymentRecord shapes, existing EnvironmentProfile and local-process Deploy input types.

# Outputs / contracts
An internal launch-ready binding referencing the exact canonical published release/artifact/environment and verified-payload dependency. No new public contract and no stateful orchestration object.

# Acceptance criteria
- exact canonical PublishedRelease and ReleaseArtifact identity/provenance are preserved;
- deployment predecessor/reference must match the canonical published release identity/version;
- EnvironmentProfile runtime compatibility is checked before activation;
- stale/substituted release, artifact hash/ref mismatch, incompatible environment/runtime and malformed canonical output fail closed before any deploy invocation;
- bootstrap progress/diagnostics cannot be used as release/deployment identity authority;
- inputs are not mutated and protected external values are not serialized into binding evidence;
- focused positive, negative, substitution and deterministic-repeatability proofs exist;
- declared validations pass.

# Negative/adversarial cases
Cross-system release substitution, version substitution, artifact hash mismatch, stale dry-run deployment predecessor, incompatible runtime version, malformed bootstrap result and injected bootstrap progress identity must fail deterministically before activation.

# Non-goals
Process launch, artifact payload persistence, new public schemas, new deployment topology, runtime continuity, Builder-off proof, dogfood, upgrade/rollback or inferred L4.

# Evidence expected
Focused product tests proving exact predecessor binding and rejection before any local-process Deploy call, plus repository-wide verification.

# Escalation
Stop if satisfying the binding requires changing public Release/Deploy/Runtime contracts or introducing a new topology/authority boundary.
