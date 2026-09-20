---
id: TASK-573
title: Define unit economics and multidimensional operational complexity evidence
status: blocked
priority: 573
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-572
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP12-PLANNING-MATERIALIZATION-01.report.md
  - packages/contracts/finops/**
  - packages/contracts/commercial/**
allowed_paths:
  - packages/contracts/finops/**
  - tests/product/g2-finops-economic-governance-proof.test.ts
  - specs/tasks/TASK-573-G2-FINOPS-UNIT-ECONOMICS-COMPLEXITY.md
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
Define bounded unit-economics derivations and auditable multidimensional operational-complexity evidence without collapsing quality, risk, complexity or commercial price into one scalar truth.

## Context
TASK-573 follows the normalized-cost and allocation/planning contracts from TASK-571..572 and realizes the remaining bounded analytical derivations of G2-WBS-21.

## Current behavior
The package has commercial evidence and, after its predecessors, qualified cost/allocation evidence, but no package-owned unit-economics or multidimensional operational-complexity contract.

## Required change
Define revision/scope/time/provenance-qualified unit-economics derivations from qualified cost and compatible commercial evidence. Define operational-complexity profiles as named dimensions backed by auditable architectural/operational facts, preserving UNKNOWN/PARTIAL dimensions and source ancestry.

## Inputs / contracts
Qualified cost/allocation evidence, compatible commercial evidence, explicit numerator/denominator identities, period/scope/revision/provenance, and auditable architectural or operational facts for named complexity dimensions.

## Outputs / contracts
Qualified unit-economics derivations and multidimensional operational-complexity evidence that preserve source ancestry and conservative UNKNOWN/PARTIAL dimensions.

## Acceptance criteria
Unit economics retain numerator/denominator identity, period, scope and provenance. Operational complexity is multidimensional and fact-derived; no universal scalar quality/risk/complexity score is introduced. Commercial price/entitlement remains distinct from technology cost and complexity evidence. Missing or incompatible evidence yields conservative UNKNOWN/PARTIAL rather than inferred values.

## Non-goals
No pricing optimizer, automated commercial decision, customer entitlement enforcement, persistence/UI, WP-13 or Production Readiness claim.

## Evidence expected
Deterministic Product Proof for compatible derivation, scope/period mismatch rejection, provenance preservation and non-strengthening multidimensional UNKNOWN/PARTIAL cases.

## Escalation
Stop and escalate rather than inventing a universal score or widening into pricing optimization, commercial authority, persistence/UI, WP-13, or Production Readiness.
