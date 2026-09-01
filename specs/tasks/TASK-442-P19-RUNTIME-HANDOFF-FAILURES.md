---
id: TASK-442
title: Harden runtime handoff failure and lifecycle propagation
status: blocked
priority: 442
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-441
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - scripts/**
  - packages/deploy/**
  - packages/release/**
  - packages/compiler/**
  - packages/contracts/environment-profile/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - specs/tasks/TASK-442-P19-RUNTIME-HANDOFF-FAILURES.md
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
Harden the supported runtime-handoff path so canonical predecessor, payload, environment, migration, secret, startup, health and state failures propagate deterministically without partial-success evidence or unintended successor side effects.

# Context
TASK-439..441 establish exact predecessor binding, one real local-process invocation and immutable/external-config boundaries. WBS 19.2.2 must fail closed at the correct lifecycle boundary and preserve existing Deploy diagnostics rather than inventing a parallel error model.

# Current behavior
The lower-level Deploy adapter has explicit diagnostics, but the composed WBS 19.2.2 path requires proof that failures are neither swallowed nor remapped into misleading bootstrap/deployment success.

# Required change
Add adversarial integration proofs and only bounded glue corrections needed so every failure remains owned by its existing source boundary, no completed runtime/deployment evidence is emitted after rejection, and downstream work is not invoked after an earlier invalid predecessor or side-effectful failure point.

# Inputs / contracts
TASK-441 supported path and existing local-process Deploy result/diagnostic semantics.

# Outputs / contracts
Deterministic bounded failure/result evidence preserving the existing diagnostic source and canonical lineage references where safe. No new public error authority.

# Acceptance criteria
- stale/substituted release/artifact and invalid payload fail before process activation;
- incompatible runtime/environment and invalid generated path/migration preflight fail before launch;
- secret resolution/migration application failures prevent process activation and do not leak values;
- process startup/health/state failure or timeout does not produce success/completed handoff evidence;
- retries/independent invocations are safe and do not reuse stale mutable state;
- existing Deploy diagnostic codes/details remain source of truth rather than message-parsed replacements;
- no unexpected publication/deployment mutation or Builder callback occurs;
- declared validations pass.

# Negative/adversarial cases
All existing local-process diagnostic classes relevant to the supported path, plus stale predecessor substitution and repeated invocation after failure, must be covered at the highest practical real integration level.

# Non-goals
General retry scheduler, production supervision, continuity/rollback, new error schema, new deployment topology or public-contract redesign.

# Evidence expected
Focused adversarial core/heavy product proofs exercising the composed path and asserting exact side-effect boundaries and absence of partial success.

# Escalation
Stop if a new lifecycle authority, retry/control plane or public diagnostic contract is required.
