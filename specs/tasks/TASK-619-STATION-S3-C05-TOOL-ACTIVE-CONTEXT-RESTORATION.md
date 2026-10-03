---
id: TASK-619
title: STATION S3 C05 Tool Active Context and Restoration
status: ready
priority: 619
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-618
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - project_docs/research/STATION-S3-R6-C8-REPOSITORY-EVIDENCE-AND-PROOF-MATRIX-01.md
  - packages/ui-core/editor-shell.tsx
  - packages/station-interaction/**
  - packages/station-composition/**
allowed_paths:
  - packages/station-tool/**
  - tests/product/station-tool*.test.ts
  - tests/product/station-s3*.test.ts
  - specs/tasks/TASK-619-STATION-S3-C05-TOOL-ACTIVE-CONTEXT-RESTORATION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-app-runtime/**
  - apps/station/**
  - packages/ui-core/**
  - packages/station-interaction/**
  - packages/station-composition/**
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

# TASK-619 — STATION S3 C05 Tool Active Context / Restoration / Multi-view

## Objective

Materialize the smallest Station-local C8 Tool orchestration contract that coordinates declared participant roles and active presentation context without acquiring component, command, persistence, AppManifest, Core or business authority.

## Context

Materialized from fresh `main@d885e4a16d524f97ad465a73b5780f59bda9232e` after TASK-618/C04 closure. The R6 C8 census found reusable lower-layer owners but no canonical C8 Tool abstraction. `EditorShell` is layout-only chrome; composition owns graph/placement; interaction owns command identity/currentness. C05 must therefore coordinate references to those owners rather than duplicate them.

## Required change

1. Introduce a small `packages/station-tool` contract/projection for stable Tool identity plus declared participant references and semantic roles.
2. Resolve an active participant/context deterministically from admitted Tool state; active context is routing/presentation context, never authorization.
3. Preserve Tool identity when compatible participants are hidden/rearranged or active context changes.
4. Represent restoration as presentation/orchestration state that rebinds only to currently admitted participant references; stale/unknown participant references fail closed and cannot resurrect canonical/business state.
5. Support multi-view consequence routing as invalidation/refresh intent over participant references only; do not duplicate canonical data or strengthen command/result evidence.
6. Reuse lower-layer command identity/currentness/result semantics by reference. Do not branch on domain feature names or infer target/authority from focus, visibility, enabled state or active context.
7. Keep `ComponentRegistry != AppManifest`; do not introduce Application lifecycle, provider/runtime/deploy, persistence format, plugin system, Core/business authority or C10/Studio behavior.

## Acceptance criteria

- Stable Tool identity survives active-context and presentation/restoration changes.
- Duplicate participant identity/role ambiguity and unknown restoration references reject before Tool-state mutation.
- Active-context resolution is deterministic and does not encode authorization, command target or business truth.
- Restoration rebinds only to current admitted participants and cannot restore stale canonical/business state.
- Multi-view consequence projection identifies affected participant refs without becoming a second canonical state owner.
- Failure/result semantics are not strengthened; retry/compensation remain owner-qualified and outside Tool authority.
- No domain subclasses or feature-name branching are required for the bounded contract.
- No C06 AppManifest, provider/runtime/deploy, Core/business authority or C10/Studio scope is introduced.

## Evidence expected

Focused product proof for stable Tool identity, deterministic active-context routing, fail-closed participant/role admission, stale restoration rejection, restoration rebinding to current participant refs, and multi-view invalidation without duplicated state authority. Inherit C03 command/currentness and C04 identity/presentation proofs only where owners and preconditions remain unchanged. Required exact-head repository/product gates must be fresh on the final SHA.

## Test Review / Hardening

Before closure challenge: active context accidentally becoming authorization/target; focus/visibility becoming semantic identity; restoration resurrecting stale canonical/business state; unknown or duplicate participant refs silently accepted; role ambiguity resolved by array order; multi-view refresh becoming duplicated state ownership; failure/partial/unknown/stale results strengthened to success; retry/compensation inferred by Tool; and domain-specific branching hidden inside the generic contract. Classify every obligation `proven | failed | unproven-gap | not-applicable`; uncovered obligations remain `unproven-gap`.

## QA Coverage / Evidence Review

At materialization all C05 delta obligations are `unproven-gap`. Construction must record inherited proof references with unchanged preconditions, focused C05 delta proof, exact-head evidence freshness and every explicit gap. Human acceptance remains distinct from machine conformance. No absent evidence is PASS.

## Non-goals

Concrete Tool UI; EditorShell changes; ComponentRegistry changes; composition/interaction owner changes; persistence/workspace serialization; AppManifest/Application lifecycle; provider/runtime/deploy; Core/business authority; plugins; C10/Studio.

## Escalation

Stop and rematerialize if implementation needs more than 6 files, any forbidden path, mutation of lower-layer owners, AppManifest/Application lifecycle, persistence authority, domain-specific Tool subclasses, Core/business authority, or scope beyond bounded C05 Tool orchestration. Construction may begin only after this materialization is integrated into fresh main.
