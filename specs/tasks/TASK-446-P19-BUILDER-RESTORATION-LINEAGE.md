---
id: TASK-446
title: Prove Builder restoration from immutable runtime lineage
status: completed
priority: 446
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-445
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-AUTONOMOUS-RUNTIME-CONTINUITY-01.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - project_docs/execution_planning/P13-RUNTIME-UPGRADE-ROLLBACK-CONTINUITY-01.md
  - packages/release/**
  - packages/deploy/**
  - packages/observe/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - docs/operations/**
  - specs/tasks/TASK-446-P19-BUILDER-RESTORATION-LINEAGE.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/contracts/decision-boundary/**
  - apps/**
max_files: 9
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove Builder restoration from immutable runtime lineage without disturbing or rebinding the autonomous runtime.

# Context
TASK-444/445 establish exact runtime startup/health/behavior through the supported local-process Deploy lifecycle while Builder-side capability is unavailable, plus deterministic local observation that remains non-authoritative when remote publication is absent or unavailable. Existing Release/Deploy evidence is the canonical reconstruction source.

The supported local-process topology intentionally owns startup, health/behavior probing, termination and cleanup before returning. TASK-446 therefore must not invent a second launcher, supervisor, registration callback or persistent-process seam merely to manufacture an observation window after Deploy has completed. Restoration is proven against the immutable runtime/release evidence produced by that supported lifecycle, and that evidence must remain unchanged while Builder-side context is reconstructed.

# Current behavior
P19 has not yet proven that Builder-side capability can return and re-establish predecessor context from canonical evidence without runtime registration/rebinding or hidden reverse dependency.

# Required change
Restore the supported Builder-side factory/bootstrap context and validate/reconstruct predecessor lineage solely from canonical immutable release/artifact/deployment evidence. Prove that Builder progress/diagnostic envelope data is non-authoritative, stale/substituted lineage fails before successor preparation, and previously established runtime health/behavior evidence is not mutated or rebound during restoration.

# Inputs / contracts
TASK-444/445 runtime evidence, existing ReleaseArtifact/PublishedRelease/DeploymentRecord evidence, EnvironmentProfile and existing factory/bootstrap validation paths.

# Outputs / contracts
Validated restored predecessor context for successor preparation; no new public contract.

# Acceptance criteria
- restoration resolves the exact immutable release/artifact/deployment evidence already validated by the supported handoff;
- previously established runtime behavior/health evidence remains byte-for-byte/structurally unchanged by restoration;
- stale/substituted/mismatched release, artifact, deployment or environment lineage is rejected before successor preparation;
- Builder progress/diagnostics are not predecessor authority and cannot override canonical evidence;
- no Runtime->Builder dependency, registration handshake, second launcher or lifecycle owner is introduced;
- external EnvironmentProfile/secrets remain outside release artifacts;
- declared validations pass.

# Negative/adversarial cases
- substituted DeploymentRecord predecessor ref;
- mismatched EnvironmentProfile identity;
- non-authoritative Builder progress/diagnostic envelope noise with unchanged canonical evidence;
- protected secret remains external and absent from restored canonical evidence.

# Non-goals
Preparing release B, activating a successor, rollback, dogfood, new persistence/control plane, topology changes or persistent process supervision.

# Evidence expected
Focused reconstruction/restoration proof using the existing handoff preflight plus unchanged supported runtime health evidence and repository verification.

# Escalation
Stop if restoration requires a new canonical contract, control plane, runtime registration authority or second runtime lifecycle owner.
