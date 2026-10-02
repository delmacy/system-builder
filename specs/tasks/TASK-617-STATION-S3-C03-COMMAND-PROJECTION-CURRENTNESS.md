---
id: TASK-617
title: STATION S3 C03 Command Projection Currentness
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
  - packages/station-interaction/types.ts
  - packages/station-interaction/registry.ts
  - packages/station-shell/command-surface.tsx
  - tests/product/station-interaction.test.ts
allowed_paths:
  - packages/station-interaction/**
  - tests/product/station-interaction.test.ts
  - tests/product/station-command-projection-currentness.test.ts
  - specs/tasks/TASK-617-STATION-S3-C03-COMMAND-PROJECTION-CURRENTNESS.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/station-app-runtime/**
  - packages/ui-core/**
  - apps/station/**
  - packages/station-shell/**
max_files: 6
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-617 — STATION S3 C03 Command Projection Currentness

## Objective

Materialize the smallest dependency-safe C03 delta: preserve stable presentation-command identity and invocation-time currentness when the same command is projected across Station surfaces, without creating business authority, universal result semantics, retry, compensation, or executable Core intents.

## Context

TASK-615/C01 and TASK-616/C02 are CLOSED / PROVEN. Fresh-main census at `main@6d82e1f2f9394ac019d07d91ab56db76a1281815` confirms `PresentationCommandRegistry` already owns semantic presentation-command identity and invocation; `StationInteractionContext` owns focus/selection/surface qualifiers; availability is re-evaluated at invocation; and `CoreCommandIntent` is intentionally non-executable with authority retained by Core/domain owners. Existing shell command surfaces are consumers, not owners, so this lot does not mutate them.

Research evidence also requires owner result/currentness semantics to remain unstrengthened: accepted/ack is not effect; partial/unknown/stale/reconcile-required must not become success; retry/compensation may only be exposed when an authoritative owner declares them. Those broader owner-result semantics are not yet represented by a bounded Station-local executable owner in this census, so they remain UNPROVEN-GAP and are explicitly not invented here.

## Current behavior

Presentation commands have unique semantic IDs, optional context-dependent availability, and registry invocation revalidates availability immediately before execute. Projection surfaces can list commands, but C03 lacks a bounded immutable projection descriptor that explicitly carries semantic command identity plus the interaction-context qualifier from which availability was derived and can distinguish rendered availability from invocation authority.

## Required change

1. Add a bounded immutable presentation-command projection descriptor in `packages/station-interaction` only.
2. Preserve the registered semantic command ID unchanged across multiple projections.
3. Snapshot only Station presentation qualifiers needed to identify the projection context; do not encode business authorization or effect semantics.
4. Expose projected/rendered availability as advisory evidence only; registry invocation remains authoritative for presentation executability and must revalidate current context before execute.
5. Do not make `CoreCommandIntent` executable and do not add result/retry/compensation semantics without an existing authoritative owner contract.

## Inputs / contracts

Existing `PresentationCommandRegistry`, `PresentationCommandDefinition`, `StationInteractionContext`, command availability helpers, and inherited C01/C02 proofs where preconditions are unchanged.

## Outputs / contracts

A Station-local immutable presentation-command projection/currentness descriptor that preserves semantic command identity and explicit presentation context while leaving invocation authority in `PresentationCommandRegistry`.

## Acceptance criteria

- The same registered command projected more than once retains exactly the same semantic command ID.
- Projection captures explicit Station interaction qualifiers without feature-name hardcoding.
- Rendered/projected availability is not treated as dispatch authority.
- A command projected as available cannot execute from stale rendered evidence when invocation-time context now makes it unavailable; registry revalidation rejects before execute.
- Projection does not make `CoreCommandIntent` executable or infer Core/business authorization.
- No owner result state is strengthened; no accepted==effective, retry, compensation, partial/unknown/stale success mapping is introduced.
- No forbidden path, C04+, AppManifest/runtime/deploy/provider, Core/business authority, C10/Studio or AI/MCP scope is introduced.

## Evidence expected

Focused product evidence proves stable command identity across two projections, explicit context qualification, and stale rendered availability rejection through invocation-time revalidation. Existing registry identity/availability tests are inherited when preconditions are unchanged rather than duplicated.

## Test Review / Hardening gate

Before closure inspect duplicate/rewritten semantic IDs, mutable projection aliases, stale rendered availability escaping invocation revalidation, accidental authorization inference, and accidental result/retry/compensation invention. Classify findings `proven | failed | unproven-gap | not-applicable`.

## QA Coverage / Evidence gate

Closure requires SHA-scoped focused evidence plus declared repository gates. Stable identity/currentness obligations must be PROVEN; owner-result semantics not implemented by this bounded lot remain explicitly UNPROVEN-GAP rather than being inferred. Human acceptance remains separate from machine conformance.

## Non-goals

Core command execution; business authorization; accepted/effective result engines; partial/unknown/stale reconciliation engines; retry/compensation; shell/UI rewiring; C04+; AppManifest/runtime/deploy/provider; C10/Studio; AI/MCP.

## Escalation

Stop/rematerialize if implementation requires more than 6 changed files, a forbidden path, shell/UI mutation, Core/business authority, executable Core intents, or invention of owner result/retry/compensation semantics.
