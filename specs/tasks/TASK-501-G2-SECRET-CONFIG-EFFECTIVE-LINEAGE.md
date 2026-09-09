---
id: TASK-501
title: Define secret and configuration effective-state lineage
status: ready
priority: 501
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-500
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-TRUST-SECRETS-RECOVERY-QUALIFICATION-01.md
  - packages/contracts/identity-authorization/**
allowed_paths:
  - packages/contracts/identity-authorization/**
  - tests/product/g2-trust-secrets-recovery*.test.ts
  - specs/tasks/TASK-501-G2-SECRET-CONFIG-EFFECTIVE-LINEAGE.md
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
Define portable secret/config reference and revision semantics that distinguish desired, resolved/materialized and consumer-effective state without persisting secret values.

# Context
TASK-500 establishes the trust qualification boundary. This successor adds only reference and effective-state lineage for secrets/configuration while preserving provider and storage mechanics outside the package.

# Current behavior
The package does not yet expose a Construction B contract that distinguishes canonical secret/config references and desired revisions from materialized/resolved generations and consumer-effective adoption.

# Inputs / contracts
Consume TASK-500 trust qualification plus WP-01 revision/locality and WP-02 evidence/currentness semantics. Secret/config inputs are references and revision evidence only; no raw secret value is an admissible durable input.

# Outputs / contracts
Produce additive secret/config reference, presence, desired/materialized/effective lineage and currentness structures under the authorized contract boundary, plus focused Product Proof.

# Required change
Add stable reference/definition/generation/currentness structures with explicit scope/locality and presence semantics. Preserve lineage from desired revision through realized generation/materialization evidence to consumer-effective adoption.

# Acceptance criteria
- `secret reference != secret value`; durable structures contain no raw secret/private-key material;
- canonical references remain distinct from provider path/object/version IDs;
- `ABSENT`, explicit null, DEFAULT and DELETE/reset intent remain distinguishable;
- desired config != resolved/distributed/materialized config != consumer-effective config;
- adoption/currentness may remain PARTIAL/UNKNOWN and cannot be defaulted to success;
- local/Station/Fleet effective state remains population/locality qualified;
- historical producing revisions are not rewritten by a newer desired revision.

# Negative/adversarial proof
Reject embedded secret values, provider-ID canonicalization, presence collapse, acknowledgement=>effective promotion, unknown-consumer=>converged promotion, locality strengthening and revision substitution.

# Evidence expected
Focused Product Proof and all declared exact-head validations.

# Non-goals
Vault/KMS/secret-store implementation, resolution runtime, material injection, persistence, provider qualification/cutover, UI/deployment or Production Readiness.

# Escalation
Stop if the contract would require secret material persistence, provider mechanics or ownership outside WBS-04.
