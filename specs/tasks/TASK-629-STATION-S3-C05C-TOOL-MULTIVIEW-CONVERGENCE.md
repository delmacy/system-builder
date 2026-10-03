---
id: TASK-629
title: STATION S3 C05C Tool Multi-view Convergence
status: completed
priority: 629
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-628
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
  - specs/tasks/TASK-629-STATION-S3-C05C-TOOL-MULTIVIEW-CONVERGENCE.md
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

# TASK-629 — STATION S3 C05C Tool Multi-view Convergence

## Objective
Materialize only the remaining dependency-safe C05 Tool obligation after proven TASK-628: deterministic multi-view projection/convergence over one canonical Station-owned Tool context, without introducing a second authority or acquiring composition, command, AppManifest, Core, or business authority.

## Context
TASK-627/C05A and TASK-628/C05B are CLOSED/PROVEN. C05A established stable Tool identity, participant-role admission, active-context routing and deterministic command qualification. C05B established restoration/rebind by stable declared references. The remaining C8 Tool pressure-case obligation named by the S3 QA plan is multi-view convergence. C05 precedes C06, so this is the smallest dependency-safe successor before any AppManifest work.

## Current behavior
A Tool has one canonical activeContextRef and deterministic route qualification/restoration. There is no bounded contract proving that multiple declared Tool views remain projections of that same canonical context, that a context switch propagates deterministically to every view projection, or that malformed/stale/duplicate view declarations fail closed without creating competing state.

## Inputs / contracts
- Current ToolState and stable Tool/context/participant identities from C05A/C05B.
- Bounded Station-owned view declarations identified by stable refs and bound to already-declared Tool contexts/participants.
- Existing C01-C04/C05A/C05B owner contracts only under unchanged preconditions.

## Outputs / contracts
- Deterministic view projections derived from one canonical Tool active context.
- Context switch consequence visible consistently across every declared view projection without per-view semantic authority.
- Fail-closed rejection for unknown, stale, duplicate or incompatible view refs/bindings before canonical Tool-state mutation.
- No command execution/authorization, persistence/storage, lower-owner mutation, AppManifest/C06, Core/business authority, provider/runtime/deploy or C10 authority.

## Required change
1. Define the smallest Tool-local multi-view declaration/projection contract using stable Station-owned view refs; view identity must not be derived from placement/presentation.
2. Derive all view projections from the single canonical ToolState/activeContextRef; a view must not own an independent active context or command authority.
3. Make active-context changes propagate deterministically to all projections whose declared bindings are affected.
4. Fail closed before canonical mutation for unknown/stale/duplicate/incompatible view refs or context bindings.
5. Preserve C05A/C05B authority boundaries and restoration identity semantics.
6. Keep retry/compensation, failure/recovery presentation, extension/plugin seams and C06+ deferred unless strictly required to prove this invariant.

## Acceptance criteria
- Two or more declared views project the same canonical Tool active context without creating independent semantic state.
- Switching active context produces deterministic, mutually consistent projections across all declared views.
- Re-projecting unchanged Tool state is deterministic/idempotent and preserves Tool/participant/context/view identities.
- Unknown/stale/duplicate/incompatible view declarations fail closed with zero canonical Tool-state mutation.
- View visibility/placement/presentation never becomes command/business authority and no accepted/acknowledged state is promoted to effective/current semantics.
- No AppManifest, persistence backend, provider/runtime/deploy, Core/business, shell, interaction, composition, ui-core or app owner is introduced or mutated.

## Evidence expected
Focused product proof for one-authority/many-view convergence, deterministic context-switch propagation, projection idempotence/identity preservation, malformed/stale/duplicate/incompatible view fail-closed behavior, zero mutation on rejection, and absence of authority strengthening. TASK-628/C05A/C01-C04 proofs are inherited only where owner contracts and preconditions remain unchanged. New C05C obligations begin `unproven-gap` until exact-head evidence is GREEN.

## Test Review / Hardening
Challenge false positives where views merely echo labels while carrying divergent semantic context; stale view bindings after context changes; duplicate normalized view refs; missing/unknown contexts; projection order dependence; accidental per-view active state; and accidental command/effect authority. Accessibility is `not-applicable` unless Construction introduces UI/DOM/focus/keyboard behavior; if it does, stop and rematerialize rather than silently inheriting proof.

## QA Coverage / Evidence Review
Initial status is `unproven-gap` for multi-view convergence, context-switch propagation, malformed/stale/duplicate/incompatible rejection, zero mutation and authority-boundary preservation. Inherited C05A/C05B proofs remain `proven` only under unchanged preconditions. Retry/compensation, failure/recovery presentation, extension seams and C06+ remain explicit `unproven-gap`/deferred and are not closure obligations for this tranche.

## Non-goals
Per-view persistence; independent per-view semantic state; UI layout/composition changes; retry/compensation; failure/recovery presentation; extension/plugin seams; AppManifest/C06; provider/runtime/deploy; C10/Studio; AI/MCP; Core/business authority.

## Escalation
Stop and rematerialize if implementation needs more than 6 files, any forbidden path, UI/composition ownership, persistence/storage, executable command authority, AppManifest/Core/business authority, or scope beyond Tool multi-view convergence. Construction may begin only after this materialization is exact-head GREEN and integrated into fresh main.
