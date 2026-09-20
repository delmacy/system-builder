---
id: TASK-571
title: Define normalized technology cost evidence semantics
status: ready
priority: 571
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-570
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP12-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/commercial/**
allowed_paths:
  - packages/contracts/finops/**
  - tests/product/g2-finops-economic-governance-proof.test.ts
  - specs/tasks/TASK-571-G2-FINOPS-NORMALIZED-COST-EVIDENCE.md
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
Establish the bounded G2-WBS-21 normalized technology-cost evidence boundary without turning provider invoices, analytical derivations or commercial facts into one another.

## Context
Construction A and B are integrated through TASK-570. G2-WBS-21 is the promoted package-owned FinOps derivation slice and TASK-571 is its first dependency-safe task.

## Current behavior
The integrated product proof preserves commercial and governance boundaries but does not yet define normalized technology-cost evidence contracts for provider cost inputs.

## Required change
Define deterministic contracts for provider cost evidence and normalized cost evidence with explicit source identity, scope, currency, rate/conversion revision where applicable, effective time, provenance, currentness and population qualification. Normalization must preserve ancestry to the source evidence and fail closed for missing, stale, conflicting, PARTIAL or UNKNOWN inputs.

## Inputs / contracts
Qualified provider cost/invoice evidence, explicit source identity and scope, currency and conversion/rate revision when applicable, effective-time/currentness and provenance/population qualification.

## Outputs / contracts
Normalized technology-cost evidence retaining source ancestry and all qualification dimensions, with conservative UNKNOWN/PARTIAL outcomes when qualification is insufficient.

## Acceptance criteria
Provider invoice != normalized cost evidence != customer-commercial truth. Currency, conversion/rate revision, effective time and provenance are explicit and attributable. Normalization cannot silently strengthen PARTIAL/UNKNOWN or stale evidence and cannot infer missing cost as zero.

## Non-goals
No provider SDK, money movement, customer billing mutation, persistence/UI, WP-13, universal scalar score or Production Readiness claim.

## Evidence expected
Deterministic positive and adversarial Product Proof for source ancestry, effective-time/currency qualification and non-strengthening missing/stale/PARTIAL/UNKNOWN cases.

## Escalation
Stop and escalate rather than widening scope if the proof requires provider SDK/money movement, persistence/UI, customer-commercial mutation, WP-13, or any unmaterialized authority.
