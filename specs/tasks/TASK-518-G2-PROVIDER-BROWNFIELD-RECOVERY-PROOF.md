---
id: TASK-518
title: Prove integrated recovery across provider Brownfield locality and bounded peripheral boundaries
status: verification
priority: 518
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-517
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/**
allowed_paths:
  - tests/product/g2-provider-recovery*.test.ts
  - tests/product/g2-brownfield-recovery*.test.ts
  - tests/product/g2-locality-recovery*.test.ts
  - tests/product/g2-physical-peripheral*.test.ts
  - specs/tasks/TASK-518-G2-PROVIDER-BROWNFIELD-RECOVERY-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction B with integrated adversarial/recovery Product Proof across TASK-516..517 and the Construction A contracts, without new semantic ownership.

# Context
Construction B hardens degradation, reconciliation, rebinding/reconnection fencing and residual drainage while preserving the Construction A provider/Brownfield/locality/physical-peripheral boundaries.

# Current behavior
TASK-516 and TASK-517 are the only materialized functional hardening steps for Construction B; this final task is the proof gate and must not create a new contract or semantic owner merely to satisfy integration coverage.

# Inputs / contracts
The exact integrated Construction A contracts and Product Proof from TASK-510..515 plus the authoritative integrated outputs of TASK-516 and TASK-517, under the pinned G2-WP-06 planning authority.

# Outputs / contracts
Integrated positive, negative, adversarial and recovery Product Proof only, demonstrating Construction A+B semantics without claiming Production Readiness or adding runtime/provider/device ownership.

# Required change
Prove recovery after currentness degradation, provider/Brownfield conflict, rebinding/fencing, residual drainage and Local/Station/Fleet reconnection while retaining the bounded Physical/Peripheral distinction between observation, requested intent, owning-domain authorization and confirmed effect.

# Acceptance criteria
- degraded/UNKNOWN authority remains conservative until reconciliation;
- retry succeeds only after current authoritative evidence;
- stale/reused external identity cannot resurrect authority;
- residual cohorts stay visible until explicit drainage;
- recovery preserves one canonical truth per scope/epoch;
- local/Station/Fleet recovery does not silently become global truth;
- connectivity/reconnection does not grant actuation authority or manufacture confirmed physical effect;
- Product Proof remains explicitly separate from Production Readiness.

# Negative/adversarial proof
Exercise retry-before-reconcile, inferred reconciliation, stale rebinding, hidden residuals, dual truth after recovery, local=>global on reconnect, connected=>authorized and command=>effect after recovery.

# Evidence expected
Integrated core/heavy Product Proof and task/architecture/typecheck/verify gates pass on the exact head.

# Escalation
Escalate any finding that requires new semantic ownership, concrete adapters/devices, persistence/runtime/deployment behavior, safety certification or Production Readiness rather than absorbing it into this proof task.

# Non-goals
New contracts not needed by TASK-516..517, concrete adapters/devices, DB/runtime/deployment work, safety certification or Production Readiness.
