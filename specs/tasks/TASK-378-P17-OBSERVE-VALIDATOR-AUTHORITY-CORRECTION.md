---
id: TASK-378
title: Remove caller authority over observe knowledge enforcement validation
status: verification
priority: 378
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-374
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-02.md
  - project_docs/execution_planning/P17-KNOWLEDGE-ENFORCEMENT-INTEGRATION-01.md
  - packages/observe/**
  - packages/contracts/knowledge-boundary/**
  - tooling/agent-harness/src/architecture.ts
  - tooling/agent-harness/tests/architecture.test.ts
allowed_paths:
  - packages/observe/**
  - tests/product/**
  - tooling/agent-harness/src/architecture.ts
  - tooling/agent-harness/tests/architecture.test.ts
  - specs/tasks/TASK-378-P17-OBSERVE-VALIDATOR-AUTHORITY-CORRECTION.md
  - specs/tasks/TASK-375-P17-AI-GATEWAY-KNOWLEDGE-ENFORCEMENT-INTEGRATION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run test:unit
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close the bounded TASK-374 conformance gap in which the observe-facing knowledge-enforcement seam delegated canonical validation to a caller-supplied normalizer.

# Context
TASK-374 requires payload/content injection to fail closed and human authority/reference identity not to be weakened. The initial implementation accepted a `KnowledgeEnforcementEnvelopeNormalizer` argument from the caller, allowing a permissive caller implementation to discard forbidden fields or alter validation semantics before projection.

# Current behavior
The Construction B branch contains an observe projection that receives both the untrusted envelope and the function used to validate that envelope. Product tests pass only because they supply the canonical normalizer; they do not prove the exported API remains fail-closed when a consumer supplies a permissive normalizer.

# Inputs / contracts
- WBS 17.2 knowledge isolation/enforcement requirements;
- TASK-369 payload-minimal enforcement reference envelope semantics;
- TASK-374 observe-facing integration acceptance criteria;
- existing architecture gates against caller-fabricated authority.

# Outputs / contracts
An observe-facing projection that owns fail-closed structural/reference validation internally, negative product proof for malformed/forbidden inputs, and an architecture gate preventing reintroduction of caller-injected knowledge-enforcement validators.

# Required change
Remove the caller-supplied normalizer parameter from `projectKnowledgeEnforcementForObservation`. Validate the versioned payload-minimal enforcement envelope inside the observe boundary, preserving exact-field rejection, stable non-empty references, supported outcomes and canonical unique evidence/reason lists. Add a semantic architecture rule rejecting an observe knowledge-enforcement projection that delegates validation to a caller-provided normalizer.

# Acceptance criteria
- callers cannot replace/bypass the observe knowledge-enforcement validator;
- payload/content injection fails closed through the exported observe API without supplying a validator;
- malformed references, unsupported outcomes and duplicate evidence fail closed;
- allow/deny/isolate and payload-minimal reference propagation remain compatible;
- CI contains a fixture that reproduces and rejects the caller-injected-validator anti-pattern;
- TASK-375 remains blocked until this correction passes exact-head gates and is completed.

# Non-goals
No WBS 17.3, telemetry backend redesign, Decision Boundary public-contract change, provider topology, Runtime/compiler work or promotion authority change.

# Evidence expected
Focused product tests for the observe seam plus architecture-unit fixtures for bad caller-injected validation and good internally-owned validation.

# Escalation
Stop if eliminating caller validation authority requires destructive public API migration outside the still-unmerged Construction B Sprint or cross-package architecture changes beyond the bounded observe seam.
