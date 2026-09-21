---
id: TASK-580
title: Preserve critical Production Readiness failures without aggregate masking
status: completed
priority: 580
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-579
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP13-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/production-readiness/**
  - tests/product/**
allowed_paths:
  - packages/contracts/production-readiness/**
  - tests/product/g2-production-readiness-coverage-proof.test.ts
  - specs/tasks/TASK-580-G2-PRODUCTION-READINESS-CRITICAL-GATES.md
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
Define critical-dimension gate semantics so no aggregate or favorable sibling dimension can mask a failed or unresolved critical readiness dimension.

## Context
G2-WBS-25 exit proof explicitly forbids aggregate percentages from masking failed critical dimensions.

## Current behavior
TASK-579 establishes independent dimensions but does not yet define critical blocking semantics across a readiness assessment.

## Required change
Add criticality and gate evaluation that preserves FAIL/BLOCKED/UNKNOWN/PARTIAL/INCONCLUSIVE without averaging or strengthening them, while retaining producer ownership and qualification.

## Inputs / contracts
TASK-579 readiness dimensions and qualification contracts.

## Outputs / contracts
Critical readiness gate semantics and adversarial deterministic tests.

## Acceptance criteria
Any unresolved critical dimension remains visible and blocks a positive readiness conclusion. Noncritical PASS states cannot compensate for a critical failure. UNKNOWN and PARTIAL never strengthen. No percentage or scalar score becomes authority.

## Non-goals
No deployment decision engine, SLA policy, UI, persistence, architecture remediation or G2-WBS-26 work.

## Evidence expected
Negative/adversarial tests showing critical FAIL/BLOCKED/UNKNOWN cannot be masked by otherwise successful dimensions.

## Escalation
Policy-specific deployment thresholds or cross-owner remediation remain outside this TASK.
