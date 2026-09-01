---
id: TASK-443
title: Prove complete runtime materialization handoff
status: completed
priority: 443
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-442
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/operations/OPERATOR_BOOTSTRAP.md
  - scripts/**
  - packages/contracts/factory-boundary/**
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - packages/runtime-core/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - docs/operations/**
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - specs/tasks/TASK-443-P19-RUNTIME-HANDOFF-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - apps/**
max_files: 12
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Provide the final growing/product proof and maintainer documentation for WBS 19.2.2: canonical operator bootstrap/factory outputs -> verified immutable artifact payload -> existing local-process Deploy -> actual generated-runtime startup/health in the existing topology.

# Context
TASK-439..442 establish the preflight seam, supported real invocation, immutable/external-config guarantees and fail-closed lifecycle behavior. TASK-443 is the Sprint proof/closure increment, not a new feature owner.

# Current behavior
The required pieces exist across canonical bootstrap/factory, Compiler/Release and local-process Deploy, but the Sprint needs one auditable proof that they are connected through the supported path with exact lineage and no bypass.

# Required change
Add/extend the growing product proof and maintainer-facing operations documentation. Exercise the supported runtime-materialization invocation from a clean deterministic fixture/input, launch the actual generated runtime, assert startup/health and exact release/artifact/deployment lineage, prove external environment/secret boundaries, and repeat representative adversarial failures without partial success. Document only proven supported behavior and limitations.

# Inputs / contracts
Integrated WBS 19.2.1 operator bootstrap, TASK-439..442 supported handoff path, existing Compiler/Release/Deploy/Runtime contracts and ADR-0002/0007.

# Outputs / contracts
Auditable tests and documentation proving the WBS 19.2.2 handoff in the existing topology. No new public contract.

# Acceptance criteria
- one supported invocation connects the integrated operator bootstrap result to the real existing local-process Deploy path without hand-authored downstream identity stitching;
- the actual generated runtime starts and reports valid health from the exact verified published artifact;
- releaseId/version, artifact hash/ref, deployment predecessor and runtime/environment identity are mutually consistent and traceable;
- release/generated inputs remain immutable and environment/secrets remain external/protected;
- equivalent clean invocations are repeatable within the deterministic portions of the evidence;
- representative stale/substituted/unverifiable/incompatible/secret/migration/startup failures remain fail-closed with no partial success;
- documentation states this is the existing initial local-process topology, not production supervision or autonomous-continuity proof;
- all declared validations and exact-head Sprint gates pass.

# Negative/adversarial cases
Cross-system/version substitution, artifact/payload mismatch, incompatible runtime/environment, protected-value leakage and failed startup must be proven through the supported invocation, not only lower-level mocks.

# Non-goals
WBS 19.2.3 Builder-off continuity/restoration, successor upgrade/rollback, dogfood, additional deployment topology, production SLA/supervision, Decision Boundary changes, unrelated TD/findings or inferred L4.

# Evidence expected
Growing core/heavy product proof plus updated operations documentation and exact-head Deterministic CI/Heavy Product Tests at Sprint Review.

# Completion evidence
TASK-441 provides the supported real-process proof for actual generated-runtime startup/health, immutable release/artifact/generated inputs, external EnvironmentProfile/secret resolution, repeatable clean invocation and cleanup. TASK-442 hardens the same supported handoff with exact Deploy-owned failure propagation, stale/substituted/incompatible rejection, no partial success evidence and repeatable fail-closed behavior. TASK-443 deliberately reuses those growing proofs rather than creating a parallel fixture or orchestration path, and records the supported lineage, limitations and operational boundary in `docs/operations/OPERATOR_BOOTSTRAP.md`.

# Escalation
Stop if final proof exposes missing product capability that cannot be corrected boundedly inside the declared existing topology, or any L4/authority change is required.
