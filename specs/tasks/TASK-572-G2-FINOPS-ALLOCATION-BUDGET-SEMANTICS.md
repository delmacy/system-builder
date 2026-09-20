---
id: TASK-572
title: Define cost allocation budget forecast and commitment semantics
status: completed
priority: 572
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-571
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP12-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/finops/**
allowed_paths:
  - packages/contracts/finops/**
  - tests/product/g2-finops-economic-governance-proof.test.ts
  - specs/tasks/TASK-572-G2-FINOPS-ALLOCATION-BUDGET-SEMANTICS.md
forbidden_paths:
  - apps/**
  - .github/workflows/**
  - packages/db/**
  - project_docs/generation-2/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Add bounded allocation and planning semantics over qualified normalized cost evidence.

## Context
TASK-572 is the second Construction C step and remains dependency-blocked until TASK-571 establishes normalized technology-cost evidence.

## Current behavior
No package-owned contract yet proves conserved allocation of normalized cost or distinguishes planning evidence from qualified actual cost within G2-WBS-21.

## Required change
Define deterministic allocation with explicit dimensions/targets and rounding residual, preserving source provenance and conservation. Distinguish budget, forecast, commitment and actual qualified cost; none may silently substitute for another.

## Inputs / contracts
Qualified normalized cost evidence from TASK-571, explicit allocation dimensions/targets, scope/locality, provenance and planning evidence qualified by type and period.

## Outputs / contracts
Conserved allocation evidence with explicit rounding residual plus distinct budget, forecast, commitment and actual contracts that retain source qualification.

## Acceptance criteria
Allocated qualified cost plus explicit rounding residual conserves the qualified source cost. Budget != forecast != commitment != actual. Missing populations and PARTIAL/UNKNOWN inputs remain explicit and cannot be completed by inference. Allocation dimensions retain locality/scope and provenance.

## Non-goals
No commercial invoice mutation, provider payment, persistence/UI, optimization engine, autonomous authority, WP-13 or Production Readiness claim.

## Evidence expected
Deterministic Product Proof for allocation conservation including rounding, and negative/adversarial missing population, stale, PARTIAL/UNKNOWN and planning-vs-actual substitution cases.

## Escalation
Stop and escalate if conservation or planning semantics require widening into commercial mutation, provider payment, persistence/UI, autonomous authority, WP-13, or unmaterialized scope.
