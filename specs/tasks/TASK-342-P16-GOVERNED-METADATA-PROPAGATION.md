---
id: TASK-342
title: Propagate permitted execution metadata through governed invocation
status: completed
priority: 342
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-341
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-INTEGRATION-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-342-P16-GOVERNED-METADATA-PROPAGATION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Carry the existing permission-aware execution metadata contract through the governed invocation result without introducing provider identity or hidden collection.

# Context
Construction A established `ModelExecutionMetadataEnvelope`; Construction B must prove metadata propagation at the real invocation seam when explicitly permitted.

# Current behavior
Metadata normalization exists independently from invocation.

# Inputs / contracts
- governed invocation result from TASK-341;
- existing execution metadata envelope/composition contract.

# Outputs / contracts
Governed invocation result exposes normalized execution metadata only according to the explicit metadata permission envelope.

# Required change
Compose the existing metadata envelope into the governed result. When metadata is not permitted, no model/version/cost/provenance payload may be returned or fabricated. Do not inspect adapter/provider internals to synthesize metadata.

A bounded conformance correction discovered after the initial TASK-342 commit requires metadata permission evidence to be canonically linked to the governance policy actually evaluated by the invocation path. The envelope therefore carries `permissionPolicyId`, and governed invocation/composition must fail closed when it does not match the evaluated governance `policyId`. A caller-supplied boolean alone is not sufficient evidence of permission.

# Acceptance criteria
- permitted metadata is normalized and propagated deterministically;
- metadata permission carries an explicit non-empty `permissionPolicyId`;
- `permissionPolicyId` must match the policy used by governance evaluation/composition or fail closed before provider invocation;
- forbidden metadata remains absent/null according to the existing contract;
- no provider ID, credential, endpoint or hidden cost lookup is introduced;
- metadata does not imply approval or authority;
- structured-output/governance result from TASK-341 is preserved;
- declared validations pass.

# Non-goals
No telemetry backend, persistence, quality observation, provider pricing lookup, secret lifecycle, WBS 16.3 or Runtime Audit Trail replacement.

# Evidence expected
Product tests proving permitted propagation, policy-reference mismatch failure before adapter invocation, forbidden metadata behavior, malformed metadata failure and absence of synthesized provider data.

# Escalation
Stop if propagation requires provider-specific introspection or storage/topology changes.
