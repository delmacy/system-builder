---
id: TASK-634
title: STATION S3 C3 Collection Proof Gap
status: completed
priority: 634
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-633
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - project_docs/execution_planning/STATION-S3-TASK-633-GATE-B-COVERAGE-REVIEW-01.md
allowed_paths:
  - packages/station-composition/**
  - tests/product/station-s3-c03*.test.ts
  - specs/tasks/TASK-634-STATION-S3-C3-COLLECTION-PROOF-GAP.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-application/**
  - packages/station-tool/**
  - packages/station-provider-boundary/**
  - apps/station/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 6
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-634 — Station S3 C3 Collection Proof Gap

Status: COMPLETED / PROVEN / INTEGRATED
Date: 2026-10-04
Predecessor: TASK-633 Gate B integrated with C3 Collection / Ticketing `unproven-gap`
Construction base: `main@c759a762e5b90945c4e896f0a58597f5641f01df`
Exact-head evidence: `bff9df643d67ebdeb0ba3971c0254c40e03397bd`
Merge: PR #1006 / `438a272475a73bf9eff78958446e7dc1b09352d9`

## Objective
Close only the C3 Collection proof gap identified by Gate B: prove keyed membership/topology/order and the distinction `visual order != semantic order` with the smallest executable Station-owned evidence.

## Context
Gate B found no representative executable proof for the C3 Collection obligation required by the S3 QA plan. Existing C04 responsive semantic-order preservation did not prove keyed Collection reorder semantics. TASK-634 remained proof-driven and did not authorize a Ticketing product or a generic drag/drop/reparent system.

## Current behavior
Integrated TASK-634 now provides a bounded in-memory Station-owned Collection contract with stable keyed membership/topology/canonical semantic order, visual-order projection separated from semantic order, deterministic revisioned semantic reorder, and focused adversarial fail-closed proof.

## Required change
Completed by PR #1006. No further product change is authorized by TASK-634. Any additional gap discovered by closure census must be separately admitted/materialized.

## Inputs / contracts
- Accepted S3 identity/composition boundaries and C02 currentness under unchanged preconditions.
- Stable collection/member keys that do not encode placement or presentation.
- Canonical semantic membership/topology/order plus a distinct visual projection/order.
- Adversarial malformed/unknown/duplicate/stale/ambiguous references for fail-closed proof.

## Outputs / contracts
- Deterministic in-memory Collection state with stable keyed membership and canonical semantic order.
- Visual-order projection demonstrably distinct from canonical semantic order unless explicit semantic reorder is invoked.
- Deterministic rejection before canonical mutation with zero partial mutation for admitted invalid/stale cases.
- No business/Core/command authority, generic DnD/reparent engine, UI/DOM ownership, persistence, provider/runtime/deploy/secrets, Tool/Application mutation, C10/Studio or AI/MCP authority.

## Acceptance criteria
1. Stable member identity is independent of placement, presentation and action — PROVEN by focused executable proof.
2. Keyed membership/topology/order is deterministic and rejects duplicate or unknown members fail-closed — PROVEN.
3. Visual projection can differ from canonical semantic order without silently mutating semantic order — PROVEN.
4. Explicit semantic reorder is deterministic/revisioned and preserves keyed membership/topology — PROVEN.
5. Malformed, stale or duplicate/unknown reorder/reference input fails before canonical mutation with zero partial mutation — PROVEN for the bounded contract.
6. No C02 authority strengthening was introduced — REVIEWED.
7. Focused executable positive/adversarial evidence exists in `tests/product/station-s3-c03-collection.test.ts` — PROVEN.
8. Hardening found no rendered-order-only false positive or authority expansion — REVIEWED.
9. Gate-B C3/Ticketing representative obligation is eligible for re-accounting; no Ticketing product is claimed — PENDING closure census only.
10. Exact-head repository verification and current Merge Candidate CI were GREEN before merge; exact head `bff9df643d67ebdeb0ba3971c0254c40e03397bd`; merge commit `438a272475a73bf9eff78958446e7dc1b09352d9` — PROVEN.

## Non-goals
Ticketing product construction; generic drag/drop/reparent engine; arbitrary tree editing; UI/DOM/accessibility changes; durable persistence/storage; provider/runtime/deploy/secrets; command/business/Core authority; Tool/Application mutation; C07B/C08; C10/Studio; AI/MCP.

## Evidence expected
Satisfied by `packages/station-composition/collection.ts`, `tests/product/station-s3-c03-collection.test.ts`, exact-head `bff9df643d67ebdeb0ba3971c0254c40e03397bd`, and PR #1006 merge `438a272475a73bf9eff78958446e7dc1b09352d9`.

## Test Review / Hardening
Reviewed the focused proof for accidental identity/index coupling, rendered-order-only assertions, silent semantic mutation through visual projection, duplicate-key acceptance, stale/unknown reorder references and partial mutation. The bounded contract preserves immutable keyed topology and canonical state on rejected operations. Accessibility is N/A because no UI/DOM/focus/keyboard surface was introduced.

## QA Coverage / Evidence Review
TASK-634 supplies the previously missing representative executable C3 evidence. Final S3/Gate-B closure is not asserted by this task alone: a fresh closure census must map this evidence back to C3/Ticketing and confirm no remaining material `unproven-gap` across promoted C0→C9 obligations. C10 remains deferred/unproven by design.

## Escalation
Any successor requiring more scope, a forbidden owner, UI/DnD/reparent behavior, public shared-contract expansion, or Core/business/command/provider/runtime/persistence authority must STOP and be separately admitted/materialized.
