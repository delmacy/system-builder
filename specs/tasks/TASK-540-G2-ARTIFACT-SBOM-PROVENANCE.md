---
id: TASK-540
title: Define artifact SBOM and provenance evidence qualification
status: blocked
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

# Acceptance criteria
- SBOM/provenance evidence is bound to canonical artifact identity and revision;
- signature/attestation presence != trust/admission;
- producer/provider acknowledgement != authority/currentness;
- stale, PARTIAL or UNKNOWN evidence cannot strengthen artifact qualification;
- evidence preserves source, revision, observation/currentness and locality/population qualifiers where applicable;
- adversarial proof covers mismatched artifact revisions, stale attestations, provider substitution and missing evidence.

# Escalation
Do not absorb trust policy, concrete signing services, registries, persistence, deployment or Production Readiness.

# Non-goals
Release lifecycle, deployment/runtime, concrete SBOM/signing providers, trust-policy implementation, DB or apps/UI.
