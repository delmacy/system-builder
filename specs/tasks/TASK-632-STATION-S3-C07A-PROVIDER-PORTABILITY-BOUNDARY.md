---
id: TASK-632
title: STATION S3 C07A Provider Portability Boundary
status: ready
priority: 632
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-631
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
allowed_paths:
  - packages/station-provider-boundary/**
  - tests/product/station-s3-c07*.test.ts
  - specs/tasks/TASK-632-STATION-S3-C07A-PROVIDER-PORTABILITY-BOUNDARY.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-application/**
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

# TASK-632 — Station S3 C07A Provider Portability Boundary

Status: ready / materialized; Construction blocked pending materialization integration
Date: 2026-10-03
Predecessor: TASK-631 / C06B CLOSED / PROVEN / INTEGRATED
Truth base: `main@d719442a620a4a5824386e423fbc274ab54e8bc0`

## Context
C01–C06 are closed/proven under their recorded owner contracts. The authoritative next Construction slice is C07 provider-independence/portability evidence. This first rolling-wave tranche materializes only a Station-owned provider-neutral declarative boundary; it does not implement provider runtimes, deployment, secrets, storage, business execution, or Studio behavior.

## Objective
Prove that Station-owned configuration can identify a provider-neutral capability binding, substitute a compatible provider reference deterministically, and represent portability/exit intent without changing canonical Application/Tool semantics or acquiring provider/runtime authority.

## Required change
Add only the smallest declarative/in-memory provider-neutral binding/substitution boundary needed for executable portability evidence. Unknown, stale, malformed, duplicate, ambiguous, or incompatible provider references must fail closed before canonical mutation. Substitution must be deterministic/idempotent and preserve canonical semantic identity. No provider SDK/API call, deployment, secret resolution, durable storage, command execution, or Core/business result is admitted.

## Acceptance criteria
1. Provider-neutral binding identity is stable and distinct from Application, Tool, ComponentRegistry, presentation, command, and provider-runtime identity.
2. A compatible provider substitution is deterministic, order-independent where input order is semantically irrelevant, and idempotent for the same accepted binding.
3. Portability/exit representation preserves canonical Station semantics and does not silently encode a concrete provider as canonical business meaning.
4. Unknown/stale/malformed/duplicate/ambiguous/incompatible provider refs fail closed before canonical mutation with zero partial mutation.
5. C01–C06 proofs remain inherited only under unchanged owner contracts/preconditions; C07 cannot mutate those owners to manufacture portability.
6. Binding/substitution metadata cannot create provider runtime/deploy/secrets authority, durable persistence/storage, executable command authorization, business result/currentness, Core authority, UI authority, C10/Studio, or AI/MCP authority.
7. Focused executable proof covers positive substitution/round-trip plus adversarial unknown/stale/malformed/duplicate/ambiguous/incompatible and mutation-on-rejection cases.
8. Exact-head deterministic/product/architecture gates and a current distinct merge-candidate must be GREEN before closure/merge.

## Evidence expected
- Focused C07 executable proof for provider-neutral identity, deterministic compatible substitution, idempotence and portability/exit representation.
- Adversarial proof for malformed/unknown/stale/duplicate/ambiguous/incompatible refs and zero mutation on rejection.
- Shape/semantic inspection proving no provider SDK/runtime/deploy/secrets/storage/command/Core/business/UI authority is introduced.
- Regression evidence sufficient to preserve inherited C01–C06 contracts under unchanged preconditions.
- Mandatory exact-head repository verification plus distinct current merge-candidate GREEN on the final evidence identity; stale predecessor evidence is not reusable.

## Non-goals
Provider SDK/API integration; provider discovery over network; runtime execution; deployment; secrets resolution; durable persistence/storage/database/filesystem ownership; migration; command execution/authorization; business-result authority; mutation of C01–C06 owners; UI/DOM/accessibility; C10/Studio; AI/MCP.

## Escalation
STOP and rematerialize before mutation if work crosses a forbidden owner, exceeds six files, requires a concrete provider runtime/deploy/secrets/storage integration, introduces UI/accessibility behavior, or strengthens command/Core/business authority. Missing or stale evidence remains UNPROVEN-GAP.

## Construction admission
Construction is NOT authorized merely by this file. First validate this materialization against its exact fresh-main base, reconcile the live pointer, obtain current mandatory materialization gates and a distinct merge-candidate, integrate the materialization, and revalidate fresh main. Only then may the smallest bounded TASK-632 product delta be implemented.