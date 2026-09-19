---
id: TASK-567
title: Define commercial catalog pricing and contract revision semantics
status: ready
priority: 567
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-566
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP12-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/governance/**
allowed_paths:
  - packages/contracts/commercial/**
  - tests/product/g2-commercial-entitlement-proof.test.ts
  - specs/tasks/TASK-567-G2-COMMERCIAL-CATALOG-PRICING-CONTRACT.md
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
Establish the bounded G2-WBS-20 commercial catalog and agreement boundary while preserving product, offer, plan, price and customer contract as distinct revision-qualified concepts.

## Context
Construction A is integrated through TASK-566. G2-WBS-20 owns bounded commercial semantics only and consumes governance/currentness facts without converting evidence or AI inference into commercial authority.

## Current behavior
The repository has governance/currentness contracts from Construction A but no G2-WBS-20 commercial catalog contract that explicitly separates product, offer, plan, price and customer contract revisions across effective time.

## Required change
Define deterministic contracts for product/offer/plan/price/contract identity, scope, revision and effective time. Price selection must be explicit and effective-dated; a catalog revision must not silently rewrite an already-qualified customer contract.

## Inputs / contracts
Consume revision-, scope-, provenance- and effective-time-qualified governance/currentness facts from existing contracts. Treat missing, stale, conflicting, PARTIAL or UNKNOWN inputs conservatively.

## Outputs / contracts
Produce bounded commercial contract types and deterministic selection semantics for product, offer, plan, price and customer contract revisions, with explicit attribution to the effective revision and provenance used.

## Acceptance criteria
Product != offer != plan != price != contract. Historical/effective-dated price and contract revisions remain attributable. Missing, stale, conflicting or not-yet-effective commercial facts remain non-strengthening and are represented conservatively rather than inferred. Governance evidence and AI inference do not become commercial authority.

## Non-goals
No subscription lifecycle engine, entitlement enforcement, usage rating, invoice/payment provider integration, FinOps, persistence/UI, WP-13 or Production Readiness claim.

## Evidence expected
Deterministic Product Proof for revision/effective-time selection and negative/adversarial stale, missing and conflicting catalog/contract cases, plus declared validations.

## Escalation
Escalate rather than infer if implementation would require operational authorization ownership, persistence/UI, provider SDKs, FinOps/G2-WBS-21, WP-13, or any unmaterialized DEFER/DO_NOT_BUILD scope.
