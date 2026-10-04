---
id: TASK-631
title: STATION S3 C06B Application Lifecycle Currentness
status: completed
priority: 631
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-630
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - packages/station-application/**
allowed_paths:
  - packages/station-application/**
  - tests/product/station-s3-c06*.test.ts
  - specs/tasks/TASK-631-STATION-S3-C06B-APPLICATION-LIFECYCLE-CURRENTNESS.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-tool/**
  - packages/station-app-runtime/**
  - apps/station/**
  - packages/station-shell/**
  - packages/station-interaction/**
  - packages/station-composition/**
  - packages/ui-core/**
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

# TASK-631 — Station S3 C06B Application Lifecycle Currentness

Status: CLOSED / PROVEN / INTEGRATED
Date: 2026-10-03
Predecessor: TASK-630 / C06A CLOSED / PROVEN / INTEGRATED
Construction exact-head: `2118f59d6d5ffeb966e418d8dc9d7d1fedda9865`
Merge commit: `af9ac043a541f4a8dc72b404f53d62ef640f4dfb`
Closure reconciliation base: `main@3cf0773ead562ea10a7788cbfbe2ad9a63bf080b`

## Objective
Preserve the already-integrated C06B Application lifecycle/currentness truth in task-catalog-conformant form without changing product behavior, proof scope, owner boundaries, or authority.

## Context
TASK-631 was the bounded C06B successor to C06A. Its authority was limited to Station-owned in-memory Application lifecycle/currentness while preserving the established C0→C10 owner boundaries, including identity distinct from placement, presentation, and action.

## Current behavior
The integrated C06B behavior provides stable Application/version/revision lifecycle identity, deterministic/idempotent same-version/revision snapshot→reopen, explicit lifecycle currentness comparison, fail-closed stale/malformed/ambiguous/mismatched identity admission, frozen returned state, and zero mutation on rejection.

## Required change
No further product change is required by this completed TASK. This closure record only normalizes repository/task-catalog conformance and records the already-proven bounded behavior; it does not create new authority or new product proof.

## Inputs / contracts
Inputs are the C06A AppManifest integrity and Tool-contribution isolation contracts plus Station-owned Application identity/version/revision snapshots. C01–C05 and C06A proofs are inherited only under unchanged owner contracts and preconditions.

## Outputs / contracts
Outputs are deterministic in-memory lifecycle/currentness results and fail-closed rejection for stale, malformed, ambiguous, or mismatched identity. No durable persistence/storage, command/authorization, Core/business-result currentness, provider/runtime/deploy/secrets, UI, C07 portability, C10/Studio, or AI/MCP authority is emitted.

## Acceptance criteria
1. Stable Application plus explicit version/revision identity remains recorded as PROVEN.
2. Deterministic snapshot/reopen round-trip preserving canonical AppManifest/Tool contributions remains recorded as PROVEN.
3. Explicit lifecycle currentness and fail-closed stale/malformed/ambiguous/mismatched admission remains recorded as PROVEN.
4. Same-snapshot idempotence and zero partial mutation on rejection remain recorded as PROVEN.
5. C06A AppManifest integrity and Tool-contribution isolation remain INHERITED/PROVEN only under unchanged preconditions.
6. No strengthening into command/business/persistence/provider/Core authority is introduced by this repair.
7. This documentation-only conformance repair obtains fresh exact-head and distinct merge-candidate evidence before merge.

## Non-goals
No product implementation; no durable persistence/storage/database/filesystem ownership; no command/authorization or Core/business-result currentness; no provider runtime/deploy/secrets; no UI/DOM/focus/keyboard; no C07 portability implementation; no C10/Studio or AI/MCP authority; no absorption of recovery beyond deterministic fail-closed admission.

## Closure
C06B is closed. Construction remained bounded to Station-owned in-memory Application lifecycle/currentness and was merged to main. Exact-head mandatory evidence was GREEN on the producing identity, with a distinct merge-candidate preserved by the producing handoff/workflow; post-merge component/browser/handoff evidence was GREEN. This status reconciliation is repository memory only and does not create new product proof.

Proven delta: stable Application/version/revision lifecycle identity; deterministic/idempotent same-version/revision snapshot→reopen; explicit lifecycle currentness comparison; fail-closed stale/malformed/ambiguous/mismatched identity admission; frozen returned state and zero mutation on rejection; preservation of C06A AppManifest integrity and Tool-contribution isolation under unchanged preconditions.

Explicit non-authority: no durable persistence/storage/database/filesystem ownership; no command/authorization or Core/business-result currentness; no provider/runtime/deploy/secrets; no UI/DOM/focus/keyboard; no C07 portability implementation; no C10/Studio or AI/MCP authority. Recovery beyond deterministic fail-closed admission remains DEFER/UNPROVEN.

## Acceptance disposition
1. Stable Application plus explicit version/revision identity: PROVEN.
2. Deterministic snapshot/reopen round-trip preserving canonical AppManifest/Tool contributions: PROVEN.
3. Explicit lifecycle currentness and fail-closed stale/malformed/ambiguous/mismatched admission: PROVEN.
4. Same-snapshot idempotence and zero partial mutation on rejection: PROVEN.
5. C06A AppManifest integrity and Tool-contribution isolation: INHERITED/PROVEN under unchanged preconditions.
6. No strengthening into command/business/persistence/provider/Core authority: PROVEN by bounded shape/semantic review plus repository gates.
7. Focused adversarial lifecycle proof: PROVEN.
8. Exact-head mandatory evidence plus distinct current merge-candidate before merge: PROVEN by producing workflow/handoff; merge integrated at `af9ac043...`.

## Test Review / Hardening
Focused C06B proof covers same-version/revision reopen, stale/malformed/ambiguous/mismatched rejection, idempotence, frozen return state, and zero partial mutation. Regression evidence preserves C06A and predecessor owner contracts. Recovery beyond deterministic fail-closed admission remains explicitly DEFER/UNPROVEN.

## QA Coverage / Evidence Review
Construction exact-head `2118f59d6d5ffeb966e418d8dc9d7d1fedda9865` carried the producing mandatory evidence and a distinct merge-candidate identity before integration. The merge commit is `af9ac043a541f4a8dc72b404f53d62ef640f4dfb`. This documentation-only conformance repair must itself obtain fresh exact-head and merge-candidate gates before merge; prior evidence cannot be reused for its changed HEAD.

## Evidence expected
For this conformance repair: deterministic repository verification, task-catalog verification, heavy product tests, handoff-state validation, and a distinct merge-candidate must be GREEN on the current repair identity. No new product proof is claimed by these repository-memory gates.

## Escalation
If fresh verification reports any requirement beyond task-catalog/document conformance, stop this repair and classify that requirement separately rather than expanding TASK-631 or modifying product. Any request that would change C06 behavior, owner boundaries, DEFER items, or authorize C07 must return to the authoritative planning/materialization flow.

## Proof inheritance
C01–C05 and C06A proofs remain inherited only where their owner contracts and preconditions are unchanged. C06B adds only the Application-owned in-memory lifecycle/currentness delta above. No evidence from this TASK may be reused to claim C07 provider-independence/portability or C10 Studio behavior.

## Exit
TASK-631 is CLOSED / PROVEN / INTEGRATED. Any successor must start from fresh main, perform the C06 census, preserve C0→C10 ordering, and materialize only the smallest dependency-safe next tranche. Missing successor evidence begins UNPROVEN-GAP.