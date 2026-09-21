---
id: TASK-575
title: Establish producer-owned Product Proof obligation and evidence-route contracts
status: completed
priority: 575
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP13-PLANNING-MATERIALIZATION-01.report.md
  - project_docs/generation-2/**
  - tests/product/**
allowed_paths:
  - packages/contracts/product-proof/**
  - tests/product/g2-product-proof-architecture-proof.test.ts
  - specs/tasks/TASK-575-G2-PRODUCT-PROOF-REGISTRY.md
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
Establish the G2-WBS-24 Product Proof obligation registry and producer-owned evidence-route contract without centralizing semantic authority.

## Context
G2-WP-13 Construction A requires a stable contract for referring to producer-owned proof obligations and evidence while preserving the producer as semantic owner.

## Current behavior
The repository has distributed Product Proof evidence, but G2-WBS-24 does not yet expose a bounded registry/evidence-route contract that preserves producer ownership and missing-evidence semantics.

## Required change
Model proof obligations, producer/owner references, acceptance targets, proof classes and evidence routes so that proof orchestration can reference owner-produced evidence without becoming its semantic owner.

## Inputs / contracts
Existing producer-owned Product Proof evidence and G2-WP-13 planning authority, referenced by stable identity/revision without re-owning source semantics.

## Outputs / contracts
A provider-neutral Product Proof obligation and evidence-route contract under `packages/contracts/product-proof/**`, plus deterministic Product Proof for its boundaries.

## Acceptance criteria
Proof obligations retain stable identity/revision and explicit producer/owner. Positive, negative, adversarial and recovery proof classes remain distinguishable. Product Proof design is not executed proof. Missing evidence remains missing/UNKNOWN rather than PASS. Acceptance criteria do not silently become full Product Proof.

## Non-goals
No Production Readiness aggregation, architecture remediation, deployment, provider SDK, persistence/UI, autonomous authority or new semantic owner.

## Evidence expected
Deterministic Product Proof covering obligation identity, producer ownership, evidence-route references and missing-evidence non-promotion.

## Escalation
Any requirement that needs Production Readiness, a new semantic owner, persistence/UI, deployment, provider SDK, architecture remediation or another WBS/WP must remain an explicit finding for separate materialization.
