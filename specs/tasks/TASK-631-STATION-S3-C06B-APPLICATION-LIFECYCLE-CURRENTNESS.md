---
id: TASK-631
title: STATION S3 C06B Application Lifecycle Currentness
status: closed
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

## Proof inheritance
C01–C05 and C06A proofs remain inherited only where their owner contracts and preconditions are unchanged. C06B adds only the Application-owned in-memory lifecycle/currentness delta above. No evidence from this TASK may be reused to claim C07 provider-independence/portability or C10 Studio behavior.

## Exit
TASK-631 is CLOSED / PROVEN / INTEGRATED. Any successor must start from fresh main, perform the C06 census, preserve C0→C10 ordering, and materialize only the smallest dependency-safe next tranche. Missing successor evidence begins UNPROVEN-GAP.