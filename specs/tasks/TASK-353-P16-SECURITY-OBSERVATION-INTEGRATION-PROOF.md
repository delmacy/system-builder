---
id: TASK-353
title: Prove integrated AI security and usage observation path
status: ready
priority: 353
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-352
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-INTEGRATION-01.md
  - project_docs/16-ai-gateway/WBS.md
  - packages/contracts/ai-gateway/index.ts
allowed_paths:
  - tests/product/**
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-INTEGRATION-01.report.md
  - specs/tasks/TASK-353-P16-SECURITY-OBSERVATION-INTEGRATION-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Complete the Construction B growing proof across the real governed invocation path and record the Sprint Report.

# Context
TASK-350..352 integrate the already-defined WBS 16.3 contracts into governed invocation. This proof must demonstrate the Package Goal without adding new behavior.

# Current behavior
Focused proofs exist for the individual contracts and predecessor governance seam; no single Construction B proof yet composes pre-send boundary, reference-only secret input and policy-derived usage observation.

# Inputs / contracts
- integrated governed invocation from TASK-350..352;
- WBS 16.1/16.2 predecessor contracts;
- WBS 16.3 boundary, secret-reference and usage-observation contracts.

# Outputs / contracts
- one integrated product proof covering positive and fail-closed paths;
- Sprint Report recording evidence and Construction C disposition gate.

# Required change
Add proof-only coverage exercising the representative governed invocation path end-to-end. Record results in the Sprint report; do not introduce new product semantics.

# Acceptance criteria
- undeclared outbound data cannot reach the adapter;
- portable invocation input contains reference-only secret information and rejects secret material/malformed references;
- usage observation is provider-neutral, policy-derived and non-authoritative;
- predecessor WBS 16.1/16.2 behavior remains compatible;
- failure paths are explicit and do not fabricate fallback/authority/usage facts;
- Sprint Report records evidence for post-merge Construction C decision;
- declared validations pass.

# Non-goals
No new product capability, provider registry/topology, credential lifecycle, telemetry/billing authority, Runtime Audit Trail replacement or WBS beyond 16.3.

# Evidence expected
Integrated product test plus Sprint Report referencing deterministic repository evidence.

# Escalation
Stop if the proof exposes a residual capability gap that cannot be fixed within the already materialized Construction B scope.
