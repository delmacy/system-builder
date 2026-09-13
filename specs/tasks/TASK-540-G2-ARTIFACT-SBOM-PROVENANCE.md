---
id: TASK-540
title: Define artifact SBOM and provenance evidence qualification
status: completed
priority: 540
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-539
context_paths:
  - AGENTS.md
  - packages/contracts/artifact-supply/**
allowed_paths:
  - packages/contracts/artifact-supply/**
  - tests/product/g2-artifact-provenance-proof.test.ts
  - specs/tasks/TASK-540-G2-ARTIFACT-SBOM-PROVENANCE.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define revision/currentness-qualified SBOM and provenance evidence for canonical artifacts while preserving trust/admission as separate authority.

# Context
TASK-539 is integrated by PR #743. TASK-540 is integrated by PR #745 on `main@01dc3a984340438258204ea16e6dc907a49fdd18` and extends only the artifact-supply semantic owner created there.

# Current behavior
Canonical artifact identity/adoption plus SBOM/provenance evidence qualification are integrated. G2-WBS-13 may advance only to TASK-541 release lifecycle semantics.

# Required change
Completed by PR #745: SBOM/provenance evidence qualification semantics and adversarial Product Proof after TASK-539 integration.

# Inputs / contracts
- canonical artifact identity/adoption semantics from TASK-539;
- closed evidence/revision/currentness/provider/locality semantics.

# Outputs / contracts
Revision/currentness-qualified SBOM/provenance evidence bound to canonical artifact identity without creating trust/admission authority.

# Acceptance criteria
- SBOM/provenance evidence is bound to canonical artifact identity and revision;
- signature/attestation presence != trust/admission;
- producer/provider acknowledgement != authority/currentness;
- stale, PARTIAL or UNKNOWN evidence cannot strengthen artifact qualification;
- evidence preserves source, revision, observation/currentness and locality/population qualifiers where applicable;
- adversarial proof covers mismatched artifact revisions, stale attestations, provider substitution and missing evidence.

# Evidence expected
Satisfied by exact-head Deterministic CI #1756, Heavy Product Tests #1346 and Automation Handoff #2441 on `beab587d62e102670a0c887362d4d29a360ec841`, followed by integration via PR #745.

# Escalation
Do not absorb trust policy, concrete signing services, registries, persistence, deployment or Production Readiness.

# Non-goals
Release lifecycle, deployment/runtime, concrete SBOM/signing providers, trust-policy implementation, DB or apps/UI.
