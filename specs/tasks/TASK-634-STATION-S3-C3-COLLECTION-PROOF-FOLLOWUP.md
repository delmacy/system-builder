---
id: TASK-634
title: STATION S3 C3 Collection Proof Follow-up
status: ready
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
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - project_docs/execution_planning/STATION-S3-TASK-633-GATE-B-COVERAGE-REVIEW-01.md
  - specs/tasks/TASK-611-STATION-GENERIC-SELECTION-COLLECTION-CONTRACTS.md
  - packages/station-interaction/selection.ts
allowed_paths:
  - packages/station-interaction/selection.ts
  - tests/product/**
  - specs/tasks/TASK-634-STATION-S3-C3-COLLECTION-PROOF-FOLLOWUP.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - apps/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 4
validation:
  - npm run verify
---

# TASK-634 — Station S3 C3 Collection Proof Follow-up

Status: ready / materialized; Construction blocked pending materialization admission
Date: 2026-10-04
Predecessor: TASK-633 Gate B executed/integrated; closure blocked only by bounded C3 Collection `unproven-gap`
Truth base: `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`

## Objective
Close only the demonstrated C3 Collection proof gap from Gate B: executable evidence for keyed membership/topology/order and explicit visual-order != semantic-order/reorder distinction, without creating a Ticketing product or broadening Station authority.

## Current behavior
TASK-611 already owns generic stable collection identity and deterministic selection in `station-interaction`. Gate B found no representative executable evidence proving the stronger C3 keyed Collection membership/topology/order and reorder distinction required by the Ticketing pressure case. C04 responsive semantic-order preservation is not a substitute for this proof.

## Required change
Produce the smallest focused executable proof for C3 Collection invariants. Prefer proof against existing collection contracts. Change `packages/station-interaction/selection.ts` only if the focused proof demonstrates a bounded missing domain-neutral contract that cannot otherwise be expressed. Do not implement Ticketing UI/domain behavior, generic drag/drop/reparenting, persistence, or business authority.

## Inputs / contracts
- TASK-611 stable semantic collection identity and safe unknown-reference behavior.
- C02 currentness may be inherited only where its recorded preconditions remain unchanged.
- Gate B C3/Ticketing obligation: keyed membership/topology/order plus visual-order != semantic-order/reorder distinction.
- C0→C10 sequencing, owner boundaries, identity/placement/presentation/action separation, and no Core/business authority remain invariant.

## Outputs / contracts
- Focused executable evidence demonstrating stable keyed membership and deterministic collection topology/order.
- Explicit evidence that visual presentation order does not silently redefine canonical semantic order.
- Explicit reorder semantics: a semantic reorder is represented intentionally and deterministically rather than inferred from visual/DOM position.
- Duplicate/unknown/malformed references fail safely before canonical mutation; no partial mutation.
- No Ticketing product, DnD/reparent engine, UI/DOM behavior, persistence, provider/runtime, Core/business/command authority, C10/Studio, or AI/MCP.

## Acceptance criteria
1. Executable product evidence covers keyed membership, topology and canonical semantic order with stable refs.
2. Executable evidence distinguishes visual-order changes from semantic reorder.
3. Semantic reorder, if represented by the existing bounded contract, is explicit, deterministic and idempotent; otherwise the test proves the existing contract does not infer semantic reorder from presentation order and records the remaining bounded gap rather than inventing behavior.
4. Duplicate/unknown/malformed references have explicit fail-safe behavior with zero partial canonical mutation.
5. Existing TASK-611 and inherited C02 preconditions remain unchanged; proof inheritance is explicit and bounded.
6. Exact-head repository verification and a distinct current merge-candidate are GREEN before integration.
7. After integration, Gate B is rerun/reconciled only for the C3/Ticketing gap; no unrelated S3 work is promoted.

## Non-goals
Ticketing application/domain implementation; generic DnD/reparenting; UI/DOM/accessibility surface; persistence/storage; Core/business/command authority; provider/runtime/deploy/secrets; C07B/C08; C10/Studio; AI/MCP.

## Escalation
STOP rather than broaden scope if closing the proof requires a new product owner, UI behavior, domain semantics, persistence, or Core/business authority. Report the smallest remaining gap instead.
