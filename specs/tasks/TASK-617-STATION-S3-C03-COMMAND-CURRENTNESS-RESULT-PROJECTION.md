---
id: TASK-617
title: STATION S3 C03 Command Currentness and Result Projection
status: ready
priority: 617
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-616
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md
  - project_docs/research/STATION-S3-R3-C4-EXIT-PROOF-MATRIX-01.md
  - packages/station-interaction/types.ts
  - packages/station-interaction/registry.ts
  - packages/station-shell/command-surface.tsx
  - packages/contracts/station-core/index.ts
  - tests/product/station-interaction.test.ts
  - tests/product/station-core-e2e.test.ts
allowed_paths:
  - packages/station-interaction/**
  - packages/station-shell/command-surface.tsx
  - tests/product/station-interaction.test.ts
  - tests/product/station-command-surface.test.tsx
  - specs/tasks/TASK-617-STATION-S3-C03-COMMAND-CURRENTNESS-RESULT-PROJECTION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/contracts/station-core/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/station-app-runtime/**
  - apps/station/**
max_files: 6
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-617 — STATION S3 C03 Command Currentness & Result Projection

## Objective

Materialize the smallest Station-local C03 delta that preserves stable presentation-command identity across projections, revalidates presentation availability at invocation, and projects owner-qualified currentness/result semantics without turning Station availability into business authorization or strengthening owner results.

## Context

TASK-616/C02 is CLOSED/PROVEN. C03 follows the fresh-main owner/reuse census and must reuse existing Station presentation-command and Station/Core boundary contracts rather than invent duplicate authority.

## Current behavior

Fresh `main@6d82e1f2f9394ac019d07d91ab56db76a1281815` already owns semantic presentation command identity and invocation-time availability revalidation in `PresentationCommandRegistry`; `StationInteractionContext` keeps focus, selection and surface explicit; `CoreCommandIntent` is deliberately non-executable by the presentation registry. Existing Station/Core contracts own target + expected revision and authoritative stale rejection. Research evidence records `accepted/ack != effective`, `partial/unknown != success`, and retry/compensation as owner-qualified semantics.

Therefore this TASK must adapt/project existing ownership rather than create a universal command/result/retry engine or modify Core contracts.

## Required change

1. Preserve one semantic presentation command id across admitted command projections; responsive/surface relocation must not mint a new action identity.
2. Preserve invocation-time availability revalidation as the dispatch gate for presentation commands; stale rendered availability must not authorize execution.
3. Add only the smallest Station projection vocabulary needed to carry an owner-provided target/currentness qualifier and owner-provided result classification without mutation or authority.
4. Projection must preserve indeterminate/non-success owner states. It must not infer `accepted == effective`, `partial/unknown/stale == success`, or business authorization from presentation availability.
5. Retry/compensation affordance may be projected only when explicitly supplied by the authoritative owner; Station must not derive it.
6. Keep `CoreCommandIntent` non-executable by `PresentationCommandRegistry`; no Core/business authority moves into Station.

## Inputs / contracts

Existing `PresentationCommandRegistry`, `StationInteractionContext`, non-executable `CoreCommandIntent`, Station/Core target plus expected-revision/currentness contracts, and owner-qualified result/retry/compensation semantics are inputs. Their authority boundaries are preserved.

## Outputs / contracts

The output is only a Station-local projection/adaptation contract for stable semantic command identity, invocation-time presentation availability, owner-qualified target/currentness and non-strengthened owner result/affordance data. It creates no Core/business authority and no universal command/result/retry/compensation engine.

## Acceptance criteria

- Same semantic command remains the same id across multiple presentation projections.
- A projection rendered available cannot dispatch after context changes to unavailable; invocation revalidation fails closed.
- Target/currentness information is carried as owner-qualified projection data, not recomputed into universal Station authority.
- Owner result distinctions remain distinct in Station projection; accepted/partial/unknown/stale are never silently promoted to effective success.
- Retry/compensation is absent unless the owner explicitly declares the affordance.
- Presentation availability is never represented as business authorization.
- Existing CoreCommandIntent separation remains intact.
- No C04+, AppManifest, provider/runtime/deploy, Core contract mutation, universal result engine, or C10/Studio scope is introduced.

## Evidence expected

Focused product proof for stable command identity across projections, stale-render availability rejection at invocation, non-strengthening result projection, owner-qualified target/currentness preservation, absent-by-default retry/compensation, and predecessor integration with the existing registry. Reuse existing Station/Core stale-revision evidence only where its preconditions remain unchanged; do not duplicate Core authority tests merely to claim Station coverage.

## Test Review / Hardening

Before closure challenge: duplicate command identity hidden by relocation; time-of-check/time-of-use availability; focus/selection accidentally treated as authoritative target; accepted/partial/unknown/stale collapsed to success; retry/compensation inferred from UI state; CoreCommandIntent accidentally becoming executable. Classify each obligation `proven | failed | unproven-gap | not-applicable`.

## QA Coverage / Evidence Review

Closure requires exact-head focused evidence plus declared repository gates. Inherited proof is valid only with unchanged preconditions. Missing target/result owner semantics remain `unproven-gap`, never PASS. Human product acceptance remains separate from machine conformance.

## Non-goals

Core/business authorization; Core contract changes; universal command/result/retry/compensation engine; semantic reparent/order/DnD/undo; C04 responsive structural work; C05 Tool lifecycle; C06 AppManifest; provider/runtime/deploy; C10/Studio.

## Escalation

Stop/rematerialize if implementation needs more than 6 files, a forbidden path, new Core/business authority, owner-result strengthening, or scope beyond the bounded C03 projection delta.
