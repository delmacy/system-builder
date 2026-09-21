---
id: TASK-581
title: Compose producer-owned readiness evidence without Product Proof substitution
status: blocked
priority: 581
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-580
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP13-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/product-proof/**
  - packages/contracts/production-readiness/**
  - tests/product/**
allowed_paths:
  - packages/contracts/production-readiness/**
  - tests/product/g2-production-readiness-coverage-proof.test.ts
  - specs/tasks/TASK-581-G2-PRODUCTION-READINESS-EVIDENCE-COMPOSITION.md
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
Compose producer-owned readiness evidence across dimensions while preserving Product Proof as a distinct evidence domain.

## Context
Construction B may consume Product Proof references, but functional/Product Proof success cannot substitute for operability/readiness proof.

## Current behavior
TASK-579..580 establish dimensions and critical gates; cross-evidence composition still needs explicit non-substitution and qualification behavior.

## Required change
Model readiness evidence references with producer/revision/population/environment/currentness/provenance qualification and explicit relationship to Product Proof references, without re-owning or promoting source evidence.

## Inputs / contracts
TASK-579..580 readiness contracts and integrated Product Proof contracts from G2-WBS-24.

## Outputs / contracts
Bounded readiness evidence-composition semantics plus positive, negative and adversarial tests.

## Acceptance criteria
Readiness evidence remains producer-owned and qualified. Product Proof references remain distinguishable and cannot alone satisfy a readiness dimension. Stale, mismatched, PARTIAL or UNKNOWN evidence remains non-strengthened and visible.

## Non-goals
No generic evidence lake, semantic god-object, deployment, provider SDK, persistence/UI, architecture remediation or autonomous authority.

## Evidence expected
Tests proving qualified composition, Product Proof non-substitution and stale/mismatched evidence behavior.

## Escalation
Any need to canonicalize producer evidence or repair another owner's state is routed outside this TASK.