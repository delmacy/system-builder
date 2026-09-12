---
id: TASK-536
title: Define build runner, toolchain and input-boundary qualification semantics
status: blocked
priority: 536
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-535
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-09-REPRODUCIBLE-BUILD-ARTIFACT-SUPPLY-AUTONOMOUS-DEPLOYMENT.md
  - packages/contracts/build-reproducibility/**
allowed_paths:
  - packages/contracts/build-reproducibility/**
  - tests/product/g2-build-runner-toolchain*.test.ts
  - specs/tasks/TASK-536-G2-BUILD-RUNNER-TOOLCHAIN-INPUT-BOUNDARY.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define explicit runner/toolchain/environment/input-boundary qualification and controlled-impurity semantics for builds.

# Context
TASK-536 consumes TASK-535 canonical dependency/material lineage. Reproducibility cannot be reasoned about unless the build environment, runner/toolchain revision, qualified inputs and allowed external impurities are explicit.

# Current behavior
No bounded G2 build contract qualifies runner/toolchain/currentness and controlled impurities without treating provider acknowledgement or environment labels as semantic authority.

# Inputs / contracts
- TASK-535 dependency/material identity and lineage;
- WP-04 trust/currentness boundaries;
- WP-06 provider qualification/locality;
- WP-07 operability/finite-flow evidence constraints.

# Outputs / contracts
Provider-neutral build execution-context qualification with toolchain/runner revision, environment/input boundary, controlled impurity declarations and currentness evidence.

# Required change
Represent runner/toolchain identity and revision, input boundary and declared external impurities separately; qualify provider/locality/currentness evidence without granting provider ACK semantic authority.

# Acceptance criteria
- runner != toolchain != environment != input boundary;
- controlled impurity is explicit, scoped and evidence-qualified;
- provider support/ACK does not imply trust, admission or currentness;
- locality/currentness remain explicit for runner populations;
- PARTIAL/UNKNOWN cannot strengthen build-environment qualification.

# Negative/adversarial proof
Reject provider ACK=>qualified runner, same environment label=>same effective inputs, stale toolchain evidence=>current and undeclared impurity=>hermetic claim.

# Evidence expected
Deterministic Product Proof covers qualification/currentness plus stale/UNKNOWN/provider/locality adversarial cases.

# Escalation
Return to Sprint Review rather than introducing concrete runner/provider adapters, runtime realization or artifact/deployment semantics.

# Non-goals
Reproducibility verdicts/cache drainage, release/artifact lifecycle, deployment/runtime, concrete CI providers or Production Readiness.