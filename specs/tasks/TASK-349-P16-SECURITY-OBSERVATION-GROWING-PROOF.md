---
id: TASK-349
title: Prove and harden Construction A security and observation contracts
status: verification
priority: 349
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-348]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-CONTRACT-01.md
  - packages/contracts/ai-gateway/**
  - tooling/agent-harness/src/architecture.ts
  - tooling/agent-harness/tests/architecture.test.ts
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - tooling/agent-harness/src/architecture.ts
  - tooling/agent-harness/tests/architecture.test.ts
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-CONTRACT-01.report.md
  - specs/tasks/TASK-349-P16-SECURITY-OBSERVATION-GROWING-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run test:unit
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Create the Construction A growing proof across data/knowledge boundary, secret-reference portability and usage observation contracts, and close the bounded governance gap exposed by conformance review before Sprint Review.

# Context
TASK-345..348 establish the bounded WBS 16.3 contract surface. Conformance review found that TASK-348 accepted caller-supplied quality/failure/cost booleans associated with a policy identifier without proving that the referenced policy itself granted those observation permissions. This TASK is authorized to correct that gap within WBS 16.3.3 and add a deterministic architecture/CI guard against recurrence.

# Current behavior
Usage observations validate local boolean permission claims but do not derive them from an explicit canonical observation policy. Existing architecture checks focus primarily on dependency/import boundaries and do not detect this semantic permission anti-pattern.

# Inputs / contracts
Outputs of TASK-345..348; integrated WBS 16.1/16.2 governance contracts; WBS 16.3 authority.

# Outputs / contracts
- usage-observation normalization derives permitted measurements from an explicit provider-neutral observation policy instead of trusting caller-supplied booleans;
- integrated positive/negative product proof;
- architecture/CI check rejects reintroduction of caller-supplied permission booleans in AI Gateway observation envelopes;
- Sprint Report with exact traceability.

# Required change
Replace caller-owned observation permission booleans with an explicit policy input carrying a policy identifier and permitted measurement set. Normalization must derive the effective permission decision from that policy and fail closed for measurements not granted by it. Add a bounded architecture gate and unit proof that catches the previous anti-pattern. Preserve provider-neutrality, Runtime Audit Trail authority and all predecessor boundaries.

# Acceptance criteria
- policy -> derived observation permission -> normalized observation is explicit and deterministic;
- caller cannot independently assert quality/failure/cost permission booleans;
- denied measurements fail closed;
- architecture check fails on a representative AI Gateway caller-permission-boolean anti-pattern and passes for policy-derived permission contracts;
- integrated positive/negative proof remains provider-neutral and secret-free;
- no Runtime/compiler/provider topology/storage/billing authority is introduced;
- declared validations pass.

# Non-goals
No Construction B implementation, invocation wiring, credential lifecycle, telemetry backend, billing engine, Runtime Audit Trail replacement, WBS outside 16.3, Knowledge Boundary taxonomy ownership or provider-specific behavior.

# Evidence expected
Growing product test, architecture unit proof and Sprint Report sufficient for exact-head Sprint Review and fresh-main Construction B decision.

# Escalation
Stop if the correction requires observability topology, billing policy semantics, Runtime Audit Trail replacement, Knowledge Boundary taxonomy ownership or architecture outside the materialized WBS 16.3 contract boundary.
