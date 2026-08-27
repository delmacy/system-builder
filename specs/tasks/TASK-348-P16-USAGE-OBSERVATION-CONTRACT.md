---
id: TASK-348
title: Define provider-neutral AI usage observation contract
status: ready
priority: 348
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-347]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/16-ai-gateway/WBS.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-348-P16-USAGE-OBSERVATION-CONTRACT.md
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
Define a provider-neutral usage observation contract for quality, failure and cost-per-use evidence.
# Context
WBS 16.3.3 requires measurement while Runtime Audit Trail remains the existing audit authority and must not be replaced.
# Current behavior
Execution metadata exists, but no canonical WBS 16.3 observation envelope covers quality/failure/cost measurement with explicit permission boundaries.
# Inputs / contracts
Integrated execution metadata/governance contracts and WBS 16.3.3 authority.
# Outputs / contracts
Versioned usage observation envelope with deterministic validation and permission-aware optional measurements.
# Required change
Add an observation contract that can record quality/failure/cost evidence without provider payloads, secrets, business authority or storage/backend assumptions.
# Acceptance criteria
Provider-neutral; permission-aware; invalid measurements fail closed; no secrets/provider payloads; no audit-authority replacement; validations pass.
# Non-goals
No telemetry backend, dashboards, billing engine, Runtime Audit Trail replacement or provider registry.
# Evidence expected
Product tests for quality/failure/cost observations, denied metadata and malformed inputs.
# Escalation
Stop if implementation requires observability topology, billing policy or audit architecture changes.