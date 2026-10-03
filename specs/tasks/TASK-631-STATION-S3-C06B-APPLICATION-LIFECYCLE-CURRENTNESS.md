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

## Objective
Materialize the smallest Station-owned C06B contract proving deterministic Application snapshot/version/currentness lifecycle semantics without acquiring persistence/storage ownership, Core/business/command authority, provider/runtime authority, UI authority, or C07 portability scope.

## Required change
Add only the declarative/in-memory Application lifecycle boundary needed to prove save→reopen round-trip, version identity/currentness, stale-version rejection and preservation of the already-proven AppManifest integrity contract. Storage adapters, durable persistence, migration, provider binding and runtime deployment are explicitly outside this tranche. If proof requires any forbidden owner, STOP/rematerialize.

## Acceptance criteria
1. Application lifecycle state has stable Application identity and explicit version/revision identity distinct from Tool, ComponentRegistry and presentation identity.
2. Save/snapshot then reopen/reconstruct is deterministic and round-trips the canonical Application manifest without silently changing Tool contributions.
3. Currentness is derived from explicit version/revision comparison; stale/unknown/malformed/ambiguous/incompatible lifecycle references fail closed before canonical mutation.
4. Reopen/version handling is idempotent for the same accepted snapshot and rejection produces zero partial canonical mutation.
5. C06A AppManifest identity/integrity and Tool-contribution isolation remain unchanged; proof inheritance is valid only under unchanged preconditions.
6. Lifecycle/currentness metadata cannot create command authorization, business result/currentness, persistence/storage authority, provider/runtime authority or Core authority.
7. Focused executable proof covers positive round-trip plus stale-version, malformed/unknown/ambiguous/incompatible and mutation-on-rejection adversarial cases.
8. Exact-head deterministic/product/architecture gates and a current distinct merge-candidate must be GREEN before closure/merge.

## Non-goals
Durable persistence/storage, database/filesystem ownership, migration, provider/runtime/deploy/secrets, command execution/authorization, business-result authority, mutation of C05 owners, UI/DOM/accessibility, C07 portability implementation, C10/Studio, AI/MCP.

## Escalation
STOP and rematerialize before mutation if work crosses a forbidden owner, exceeds six files, requires durable storage/provider/runtime behavior, introduces UI/accessibility behavior, or strengthens Core/business/command authority. Missing or stale evidence remains unproven-gap. Do not materialize C07 concurrently.

## Construction admission
Construction is NOT authorized merely by this file. First integrate this materialization against fresh main, reconcile docs/current/NEXT_WORK.md, and revalidate fresh main. Only then may the smallest bounded TASK-631 C06B delta be implemented.
