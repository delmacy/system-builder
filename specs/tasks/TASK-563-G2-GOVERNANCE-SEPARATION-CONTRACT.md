---
id: TASK-563
title: Establish governance policy decision enforcement evidence assessment contract
status: ready
priority: 563
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
work_package: G2-WP-12
wbs: G2-WBS-19
sprint: G2-WP12-CONSTRUCTION-A-01
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP12-PLANNING-MATERIALIZATION-01.report.md
  - project_docs/generation-2/wbs/GENERATION_2_WBS_DECOMPOSITION.md
  - packages/contracts/decision-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/governance/**
  - tests/product/g2-governance-proof.test.ts
  - specs/tasks/TASK-563-G2-GOVERNANCE-SEPARATION-CONTRACT.md
forbidden_paths:
  - apps/**
  - .github/workflows/**
  - packages/db/**
  - packages/contracts/commercial/**
  - packages/contracts/finops/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---

# Objective
Establish the bounded G2-WBS-19 governance contract that keeps policy, decision, enforcement, evidence and assessment semantically distinct while preserving authority, provenance, revision and currentness qualification.

## Context
G2-WP-12 Construction A is committed by the integrated Planning & Materialization report. G2-WBS-19 owns governance/compliance/audit/privacy semantics and depends on canonical provenance/revision, authority, storage-population and observability evidence semantics. This TASK establishes only the first governance boundary; effective-dated policy/waiver semantics and privacy population lifecycle remain successor TASKs.

## Current behavior
The repository has predecessor authority and evidence contracts, but no G2-WBS-19 governance contract proving `policy != decision != enforcement != evidence != assessment` as an explicit bounded product contract.

## Required change
Add a minimal governance contract under `packages/contracts/governance/**` plus focused Product Proof demonstrating that each governance semantic has explicit identity/revision/authority/evidence coordinates and cannot silently strengthen another semantic. Absence, stale, PARTIAL, UNKNOWN or inferred evidence must not become compliance, enforcement or authoritative decision.

## Inputs / contracts
Consume existing decision-boundary and evidence-provenance semantics without duplicating their ownership. Preserve actor/authority, source/revision/currentness, evidence provenance and non-strengthening semantics. `AI inference != authority` remains mandatory.

## Outputs / contracts
A bounded governance semantic contract and positive/negative Product Proof for policy/decision/enforcement/evidence/assessment separation. The output must remain suitable for TASK-564 effective-dated policy/waiver semantics without implementing TASK-564 behavior early.

## Acceptance criteria
- Policy, decision, enforcement, evidence and assessment are separately representable and traceable.
- No conversion or projection implicitly promotes evidence or assessment into policy/decision/enforcement authority.
- Missing, stale, PARTIAL, UNKNOWN or inferred evidence cannot prove compliance or successful enforcement.
- Authority, source, revision and currentness qualifications survive projections and derived records.
- Existing decision-boundary/evidence-provenance ownership is consumed rather than duplicated.
- Positive and negative Product Proof covers predecessor integration and non-strengthening behavior.
- Product Proof remains distinct from Production Readiness.

## Non-goals
No effective-dated waiver/exception implementation, privacy/retention/legal-hold/residency/disposition behavior, commercial/entitlement semantics, FinOps, UI, persistence, provider SDK, workflow changes, WP-13 or Production Readiness claim.

## Evidence expected
Focused Product Proof plus all declared validations on the exact TASK commit. Sprint-wide exact-head and merge-candidate evidence are required before integration under repository policy.

## Escalation
Stop and fail closed if implementation requires changing public ownership outside G2-WBS-19, inventing generic authorization/actuation authority, treating inference/evidence as authority, absorbing TASK-564..566 behavior, or crossing the declared allowed paths.
