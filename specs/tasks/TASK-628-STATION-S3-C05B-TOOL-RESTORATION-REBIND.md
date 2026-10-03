---
id: TASK-628
title: STATION S3 C05B Tool Restoration and Rebind
status: planned
priority: 628
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-627
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - packages/station-tool/**
allowed_paths:
  - packages/station-tool/**
  - tests/product/station-s3-c05*.test.ts
  - specs/tasks/TASK-628-STATION-S3-C05B-TOOL-RESTORATION-REBIND.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
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

# TASK-628 — STATION S3 C05B Tool Restoration / Rebind

## Objective
Materialize only the next dependency-safe C05 tranche after proven TASK-627: deterministic restoration/rebind of Station Tool presentation/orchestration state without acquiring persistence storage, command, composition, AppManifest, Core, or business authority.

## Predecessor truth
TASK-627/C05A is CLOSED/PROVEN. Its stable Tool identity, participant-role admission, active-context selection and deterministic route qualification are inherited only under unchanged preconditions. This tranche does not reopen those owners.

## Required change
1. Define a bounded restorable Tool snapshot containing only Station-owned Tool identity/context references needed to rebind already-declared participants/routes.
2. Rebind by stable identity against the current declared Tool contract; never recreate semantic participant/view/component identity from presentation or placement.
3. Fail closed before Tool-state mutation when snapshot identity, participant refs, context refs, or route refs are unknown, stale, ambiguous, duplicated, or incompatible with the current declaration.
4. Make restoration deterministic and idempotent for the same valid snapshot + declaration.
5. Preserve C05A authority boundary: restoration may select/rebind context but may not execute/authorize commands or mutate interaction/composition/business owners.
6. Treat serialization/storage transport, multi-view consequence propagation, retry/compensation, failure/recovery presentation and extension seams as deferred unless strictly required to prove this invariant.

## Acceptance criteria
- Valid snapshot rebind restores the same Tool identity and declared active-context references deterministically.
- Reapplying the same valid snapshot is idempotent and does not regenerate participant/view/component identity.
- Unknown/stale/ambiguous/duplicate/incompatible refs fail closed with zero canonical Tool-state mutation.
- Restoration never converts visible/focused/enabled/current state into command or business authority.
- No persistence backend, AppManifest, provider/runtime/deploy, Core/business, shell, interaction, composition, ui-core or app owner is introduced or mutated.

## Evidence expected
Focused product proof for deterministic valid rebind, idempotence, identity preservation, stale/unknown/ambiguous/duplicate fail-closed behavior, zero mutation on rejection, and absence of authority strengthening. TASK-627/C01-C04 proofs are inherited only where their owner contracts and preconditions remain unchanged. New C05B obligations begin `unproven-gap` until final exact-head evidence is GREEN.

## Non-goals
Persistence backend/serialization transport; multi-view consequence propagation; retry/compensation; failure/recovery presentation; extension/plugin seams; AppManifest/C06; provider/runtime/deploy; C10/Studio; AI/MCP; Core/business authority.

## Escalation
Stop and rematerialize if implementation needs more than 6 files, any forbidden path, storage/persistence ownership, executable command authority, lower-owner mutation, AppManifest/Core/business authority, or scope beyond restoration/rebind. Construction may begin only after this materialization is exact-head GREEN and integrated into fresh main.
