---
id: TASK-630
title: STATION S3 C06A Application Manifest Integrity
status: ready
priority: 630
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-629
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - packages/station-tool/**
allowed_paths:
  - packages/station-application/**
  - tests/product/station-s3-c06*.test.ts
  - specs/tasks/TASK-630-STATION-S3-C06A-APPLICATION-MANIFEST-INTEGRITY.md
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

# TASK-630 — Station S3 C06A Application Manifest Integrity

Status: ready / materialized; Construction blocked pending materialization integration
Date: 2026-10-03
Predecessor: TASK-629 / C05C CLOSED / PROVEN
Truth base: main@4f0424e9c721e7608fbe0e1f38678bce2dd4208f

## Context
C05 Tool active-context, restoration/rebind and multi-view convergence is CLOSED / PROVEN. The S3 dependency order now admits only the smallest C06/Application tranche. C01-C05 proofs may be inherited only where exact owner contracts and preconditions remain unchanged. Preserve `ComponentRegistry != AppManifest` and identity != placement != presentation != action.

## Current behavior
Station has proven Tool-level semantics through C05 but has not proven an Application-owned AppManifest integrity boundary. C06 Application identity/integrity, Tool-contribution isolation and later lifecycle obligations therefore begin as `unproven-gap`.

## Objective
Materialize only the C06A AppManifest identity/integrity and Tool-contribution-isolation contract so subsequent Construction has an explicit bounded owner, scope and proof surface without acquiring Core/business, command, persistence, provider/runtime/deploy, UI or C10 authority.

## Required change
Materialize the smallest C06/Application tranche after C05 closure: a Station-owned declarative AppManifest integrity contract that composes declared Tool contributions without turning the manifest, Station, or presentation state into command/Core/business authority. This tranche covers manifest identity/integrity and Tool-contribution isolation only. Save/reopen/version/currentness lifecycle remains a later C06 tranche; if implementation requires crossing that bound, STOP/rematerialize.

## Inputs / contracts
- `docs/DOCUMENT_AUTHORITY.md` and the Station component-grammar addendum.
- S3 Construction Materialization and QA Gates plans.
- TASK-629/C05C closure truth and unchanged Station Tool identity/context/view contracts.
- Declared Tool contribution references only; no executable command, business-result, provider, persistence or Core authority.

## Outputs / contracts
- A new Station-owned Application/AppManifest integrity contract under `packages/station-application/**`.
- Focused C06 executable proof under `tests/product/station-s3-c06*.test.ts`.
- Bounded repository memory for TASK-630.
- Initial `max_files: 6`; exceeding the bound requires rematerialization before product mutation.

## Acceptance criteria
1. AppManifest has stable Application identity distinct from Tool identity and ComponentRegistry identity.
2. Declared Tool contributions are admitted deterministically and remain isolated: one Tool contribution cannot overwrite or impersonate another Tool or Application identity.
3. Duplicate, malformed, unknown, stale, ambiguous or incompatible Tool contribution references fail closed before canonical Application mutation.
4. Admission is deterministic/idempotent and rejection produces zero partial canonical mutation.
5. Manifest composition does not create executable command authority, authorization, business result/currentness, provider/runtime authority, or persistence authority.
6. Existing C05 Tool identity/context/view semantics remain unchanged and are consumed only as declared references/projections.
7. Focused executable proof covers positive composition plus adversarial collision/rejection cases and explicitly records inherited proofs versus the C06 semantic delta.
8. Exact-head deterministic/product/architecture gates and a current distinct merge-candidate must be GREEN before closure/merge.

## Non-goals
- Core/business authority or command execution/authorization.
- Mutation of `packages/station-tool/**`, station interaction/composition/shell/ui-core, `packages/station-app-runtime/**`, or `apps/station/**`.
- Persistence/storage ownership, save/reopen/version migration/currentness lifecycle beyond manifest-integrity proof.
- Provider/runtime/deploy/secrets authority, C07 portability implementation, C10/Studio, AI/MCP.
- UI/DOM/accessibility behavior in this tranche.

## Evidence expected
Focused positive and adversarial proof must challenge identity collisions after normalization, duplicate Tool contribution refs, stale or unknown Tool refs, ambiguous/incompatible refs, contribution order dependence, accidental overwrite/impersonation, partial canonical mutation before rejection, and accidental strengthening into command/business/persistence authority. C01-C05 inherited evidence remains valid only under unchanged preconditions. Accessibility is `not-applicable` unless Construction introduces UI/DOM/focus/keyboard behavior; if it does, STOP/rematerialize. Exact-head and distinct current merge-candidate evidence must both be GREEN before closure.

## Escalation
STOP and rematerialize before mutation if work crosses a forbidden owner, exceeds six files, requires save/reopen/version/currentness lifecycle, introduces UI/accessibility behavior, or requires Core/business/command/provider/persistence authority. Missing or stale evidence remains `unproven-gap`; do not promote C06B/C07+/C10 concurrently.

## Construction admission
Construction is NOT authorized merely by this file. First integrate this materialization against fresh main, reconcile `docs/current/NEXT_WORK.md`, and revalidate fresh main. Only then may the smallest bounded TASK-630 C06A delta be implemented.
