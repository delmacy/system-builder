---
id: TASK-631
title: STATION S3 C06B Application Lifecycle Currentness
status: ready
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

Status: ready / materialized; Construction blocked pending materialization integration
Date: 2026-10-03
Predecessor: TASK-630 / C06A CLOSED / PROVEN / INTEGRATED
Truth base: main@88337cddfc7d87b50b0a422487974c8f9d40dd70

## Context
C06A AppManifest identity/integrity and Tool-contribution isolation are CLOSED / PROVEN. The authoritative C06/C9 obligation still requires save/reopen/version/currentness evidence. This rolling-wave tranche materializes only that residual Application-owned lifecycle/currentness boundary. C01-C06A proofs may be inherited only where owner contracts and preconditions remain unchanged.

## Current behavior
C06A currently provides the Station-owned AppManifest identity/integrity boundary and deterministic Tool-contribution isolation. It does not yet provide an Application lifecycle snapshot/reopen contract, explicit lifecycle version/revision currentness, or stale lifecycle admission semantics. Durable storage and business currentness remain outside Station authority.

## Objective
Materialize the smallest Station-owned C06B contract proving deterministic Application snapshot/version/currentness lifecycle semantics without acquiring persistence/storage ownership, Core/business/command authority, provider/runtime authority, UI authority, or C07 portability scope.

## Required change
Add only the declarative/in-memory Application lifecycle boundary needed to prove save→reopen round-trip, version identity/currentness, stale-version rejection and preservation of the already-proven AppManifest integrity contract. Storage adapters, durable persistence, migration, provider binding and runtime deployment are explicitly outside this tranche. If proof requires any forbidden owner, STOP/rematerialize.

## Inputs / contracts
- Existing C06A AppManifest identity/integrity and normalized Tool-contribution declarations under unchanged preconditions.
- Explicit Application identity plus lifecycle version/revision references supplied to the bounded Station-owned lifecycle boundary.
- Accepted S3 Addendum, Construction Materialization plan, QA Gates plan, and the C0→C10 dependency order.
- No Core/business result, command authorization, provider/runtime/deploy, durable storage, UI, or C07 authority is an input to this TASK.

## Outputs / contracts
- A deterministic in-memory Application lifecycle snapshot/reopen projection that preserves canonical AppManifest and Tool-contribution identity.
- Explicit lifecycle version/revision currentness semantics sufficient to distinguish current from stale lifecycle projections without claiming business currentness.
- Fail-closed rejection for stale/unknown/malformed/ambiguous/incompatible lifecycle references before canonical mutation, with zero partial mutation.
- No durable persistence adapter, command/business authority, provider/runtime authority, Core authority, or UI authority.

## Acceptance criteria
1. Application lifecycle state has stable Application identity and explicit version/revision identity distinct from Tool, ComponentRegistry and presentation identity.
2. Save/snapshot then reopen/reconstruct is deterministic and round-trips the canonical Application manifest without silently changing Tool contributions.
3. Currentness is derived from explicit version/revision comparison; stale/unknown/malformed/ambiguous/incompatible lifecycle references fail closed before canonical mutation.
4. Reopen/version handling is idempotent for the same accepted snapshot and rejection produces zero partial canonical mutation.
5. C06A AppManifest identity/integrity and Tool-contribution isolation remain unchanged; proof inheritance is valid only under unchanged preconditions.
6. Lifecycle/currentness metadata cannot create command authorization, business result/currentness, persistence/storage authority, provider/runtime authority or Core authority.
7. Focused executable proof covers positive round-trip plus stale-version, malformed/unknown/ambiguous/incompatible and mutation-on-rejection adversarial cases.
8. Exact-head deterministic/product/architecture gates and a current distinct merge-candidate must be GREEN before closure/merge.

## Evidence expected
- Focused executable C06 lifecycle proof for deterministic same-revision round-trip/reopen and explicit lifecycle currentness.
- Adversarial proof for stale-version, unknown/malformed/ambiguous/incompatible refs, identity mismatch, repeated reopen/idempotence, and zero mutation on rejection.
- Regression evidence that C06A AppManifest identity/integrity and Tool-contribution isolation remain unchanged.
- Shape/semantic inspection proving lifecycle currentness does not strengthen into business accepted/effective/current/result, command/authorization, persistence/storage, provider/runtime, Core, or UI authority.
- Mandatory exact-head repository verification and product/architecture gates plus a distinct current merge-candidate GREEN on the final evidence identity; stale predecessor evidence is not reusable.

## Test Review / Hardening
Challenge false positives with same-revision deterministic reopen, stale-base save, unknown/malformed revision refs, mismatched Application identity, manifest/contribution identity preservation, repeated readback/idempotence, attempted mutation after returned state, and rejection without partial mutation. Recovery beyond deterministic fail-closed lifecycle admission remains DEFER unless already required by accepted obligations. Accessibility is not-applicable because this TASK admits no UI/DOM/focus/keyboard surface.

## QA Coverage / Evidence Review
Every C06B lifecycle obligation begins UNPROVEN-GAP. C06A evidence may be inherited only for unchanged AppManifest identity/integrity and contribution-isolation contracts; it is not lifecycle proof. Construction must attach the smallest focused C06 proof plus current exact-head and distinct merge-candidate evidence. Missing or stale evidence remains UNPROVEN-GAP.

## Non-goals
Durable persistence/storage, database/filesystem ownership, migration, provider/runtime/deploy/secrets, command execution/authorization, business-result authority, mutation of C05 owners, UI/DOM/accessibility, C07 portability implementation, C10/Studio, AI/MCP.

## Escalation
STOP and rematerialize before mutation if work crosses a forbidden owner, exceeds six files, requires durable storage/provider/runtime behavior, introduces UI/accessibility behavior, or strengthens Core/business/command authority. Missing or stale evidence remains unproven-gap. Do not materialize C07 concurrently.

## Construction admission
Construction is NOT authorized merely by this file. First integrate this materialization against fresh main, reconcile docs/current/NEXT_WORK.md, and revalidate fresh main. Only then may the smallest bounded TASK-631 C06B delta be implemented.
