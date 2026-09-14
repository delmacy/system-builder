---
id: TASK-551
title: Establish AI workspace and provenance contracts
status: completed
priority: 551
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-550
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-10-GENERATED-EXPERIENCE-AI-MEDIATED-ASSISTANCE.md
  - packages/contracts/generated-experience/**
allowed_paths:
  - packages/contracts/ai-mediated-assistance/**
  - tests/product/g2-ai-mediated-assistance-product-proof.test.ts
  - specs/tasks/TASK-551-G2-AI-WORKSPACE-PROVENANCE.md
forbidden_paths:
  - packages/db/**
  - packages/runtime-core/**
  - apps/**
  - .github/workflows/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Establish the bounded G2-WBS-16 AI gateway/workspace contract surface with explicit prompt, context and evidence provenance while keeping model inference non-authoritative.

# Context
Construction A established generated-experience identity, currentness, non-strengthening states and lineage. Construction B may now add only the AI-mediated-assistance slice already owned by G2-WP-10.

# Current behavior
G2 has generated-experience projection and lineage contracts, but no dedicated AI-mediated workspace contract that records workspace/gateway identity, prompt/context/evidence provenance and candidate-output lineage while preserving canonical owners and currentness independently.

# Required change
Add deterministic contracts for AI workspace/gateway identity and revision, input context references, prompt/context/evidence provenance and candidate-output lineage. Preserve source identity/currentness independently from any AI projection or candidate.

# Inputs / contracts
Use the existing generated-experience, semantic, evidence/currentness, identity and Local/Station/Fleet qualification contracts only as referenced authoritative inputs; AI-mediated assistance may preserve their identity/revision/currentness but must not replace or strengthen them.

# Outputs / contracts
A provider-neutral AI workspace/gateway and provenance contract surface plus deterministic Product Proof for identity/revision/currentness separation, prompt/context/evidence lineage and non-authoritative candidate semantics.

# Acceptance criteria
- workspace/gateway identity and revision are explicit and deterministic;
- prompt, context and evidence references remain inspectable and revision-aware;
- stale/PARTIAL/UNKNOWN/INCONCLUSIVE/CONFLICTED inputs remain representable and cannot be strengthened by inference;
- AI output is a candidate artifact, never canonical authority;
- Local/Station/Fleet qualification is preserved where applicable;
- Product Proof is deterministic and distinct from Production Readiness.

# Non-goals
Concrete model/vendor SDKs, autonomous-agent authority, persistence/DB, runtime-core, apps/UI redesign, provider implementation, WP-11+ or Production Readiness.

# Evidence expected
Deterministic Product Proof covering provenance, identity/revision/currentness separation and non-authoritative candidate semantics.

# Escalation
Return to Sprint Review for any missing canonical owner or requirement outside the materialized G2-WBS-16 boundary.
