---
id: TASK-503
title: Constrain degraded recovery and fencing semantics without strengthening
status: ready
priority: 503
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-502
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-TRUST-SECRETS-RECOVERY-QUALIFICATION-01.md
  - packages/contracts/identity-authorization/**
allowed_paths:
  - packages/contracts/identity-authorization/**
  - tests/product/g2-trust-secrets-recovery*.test.ts
  - specs/tasks/TASK-503-G2-RECOVERY-NON-STRENGTHENING.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/db/**
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
Define bounded degraded-mode, fencing/recovery-cut and post-recovery requalification semantics that cannot expand authority or resurrect stale revoked trust/config/credential state.

# Context
TASK-500..502 establish trust qualification, secret/config lineage and cohort-aware rotation/drainage. Recovery must preserve those state boundaries and Construction A authority ceilings.

# Current behavior
The package lacks a portable Construction B representation of degraded authority ceilings, recovery source cuts, fencing epochs and post-recovery requalification that prevents stale-state resurrection.

# Inputs / contracts
Consume Construction A authorization/delegation/revocation contracts plus TASK-500..502 trust, secret/config, generation, cohort and currentness semantics.

# Outputs / contracts
Produce additive degraded-mode, recovery-cut, fencing/supersession and requalification evidence structures only; no runtime recovery execution or new authorization ownership.

# Required change
Add deterministic structural contracts for degraded authority ceiling, recovery cut/source revision, fencing epoch/supersession, restored-versus-current state and re-protection/reconciliation evidence.

# Acceptance criteria
- degraded mode declares allowed/prohibited scope, authority ceiling, locality/currentness horizon and expiry/review condition;
- disconnection/failure cannot mint broader authority or make stale trust/config current;
- restore completion != current authority/trust/config != verified recovery;
- recovery preserves source cut/revision and explicitly compares current post-cut revocations/rotations/config revisions;
- fencing proves the admitted actor/epoch without assuming old actor quiescence from new-leader acknowledgement alone;
- ambiguous external effects remain UNKNOWN and route to reconcile-before-retry unless duplicate safety is independently proven;
- residual old-path/security cohorts remain visible until dispositioned.

# Negative/adversarial proof
Reject failover authority expansion, stale restored credential/trust/config resurrection, recovery ACK=>verified promotion, superseded fencing epoch reuse, Fleet=>Station authority substitution and UNKNOWN effect=>safe retry strengthening.

# Evidence expected
Focused positive/adversarial/recovery Product Proof and all declared exact-head validations.

# Non-goals
Backup/restore execution, leader election/runtime fencing, incident workflow, provider failover, trust-store/secret restoration, physical recovery actions or Production Readiness.

# Escalation
Stop if the proof requires runtime recovery execution or ownership from Governance/Observability/provider packages.
