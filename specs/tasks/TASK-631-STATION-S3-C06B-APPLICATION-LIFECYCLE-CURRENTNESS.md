---
id: TASK-631
status: MATERIALIZED
depends_on:
  - TASK-630
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - packages/station-application/index.ts
allowed_paths:
  - packages/station-application/**
  - tests/product/station-s3-c06*.test.ts
  - specs/tasks/TASK-631-STATION-S3-C06B-APPLICATION-LIFECYCLE-CURRENTNESS.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - apps/**
  - packages/station-tool/**
  - packages/station-interaction/**
  - packages/station-composition/**
  - packages/station-shell/**
  - packages/ui-core/**
  - packages/station-app-runtime/**
  - packages/provider*/**
max_files: 6
validation:
  - npm run verify
  - focused C06 lifecycle product proof
---

# TASK-631 — Station S3 C06B Application Lifecycle Currentness

## Authority and dependency

Materialized from accepted S3 Addendum 001, the S3 Construction Materialization plan and QA Gates plan after fresh-main census at `main@88337cddfc7d87b50b0a422487974c8f9d40dd70`. TASK-630/C06A is CLOSED / PROVEN / INTEGRATED. This TASK is the smallest remaining mandatory C9/Application delta: lifecycle save/readback/reopen/version/currentness. It does not reopen C06A and does not admit C07/provider portability or C10 Studio.

## Scope

Add a bounded Station-owned Application lifecycle representation around the existing AppManifest identity/integrity boundary. The lifecycle may preserve presentation/configuration state and a version/revision reference sufficient to detect stale restore/readback. Reopen must revalidate currentness before the restored state is treated as current. Silent last-write-wins is forbidden.

Station remains presentation/orchestration-only. Lifecycle evidence must not become canonical business truth, command authorization, authoritative business result/effect, provider/runtime/deploy authority, or Core state. `ComponentRegistry != AppManifest`; identity != placement != presentation != action; C0→C10 ordering remains intact.

## Acceptance / proof obligations

All obligations begin `unproven-gap` until Construction produces executable evidence on its own exact head.

1. Save/readback preserves stable Application identity and declared presentation/configuration state without mutating AppManifest identity or Tool contribution identity.
2. Version/revision identity is explicit and deterministic; reopen against the same admitted revision reconstructs the same bounded lifecycle projection.
3. Reopen against stale, unknown, malformed, duplicate or incompatible revision/context evidence fails closed or remains explicitly stale; it must not silently become current.
4. A stale save/readback attempt cannot overwrite a newer admitted lifecycle revision; no silent last-write-wins.
5. Rejection causes zero partial mutation of the prior admitted lifecycle state and zero mutation of C06A AppManifest inputs.
6. Currentness is lifecycle/projection currentness only. Station must not strengthen business accepted/effective/current/result semantics or invent command/authorization authority.
7. Existing TASK-630 AppManifest integrity/contribution-isolation behavior remains unchanged and inherited only under unchanged preconditions.

## Test Review / Hardening

Before closure, challenge false positives with: same-revision deterministic reopen; stale-base save; unknown/malformed revision refs; mismatched Application identity; manifest/contribution identity preservation; repeated readback/idempotence; attempted mutation after returned state; rejection without partial mutation. Explicitly inspect returned shapes for authority-strengthening fields or semantics. Recovery beyond deterministic fail-closed lifecycle admission is DEFER unless already required by the accepted obligation. UI/DOM/focus/keyboard accessibility is `not-applicable` because this TASK admits no UI surface; crossing that boundary requires STOP/rematerialize.

## QA Coverage / Evidence Review

Initial coverage status for every obligation above is `unproven-gap`. C06A exact-head evidence is inherited only for unchanged AppManifest identity/integrity and contribution-isolation contracts; it is not lifecycle proof. Construction must attach the smallest focused C06 product proof plus repository deterministic verification. Missing/stale evidence remains `unproven-gap`; GREEN predecessor CI is never reused as this TASK's exact-head proof.

## STOP / rematerialize conditions

STOP before mutation if implementation requires more than six files; crosses any forbidden owner; requires storage/provider/runtime/deploy/secrets; changes Core/business/command/result authority; changes ComponentRegistry; introduces UI/accessibility behavior; or requires C07/C10/AI-MCP scope. Record adjacent findings as DEFER rather than absorbing them.

## Construction admission

This file materializes the bounded TASK only. Product Construction is NOT eligible until this materialization branch/PR has current exact-head deterministic evidence, a distinct current merge-candidate GREEN, authoritative one-TASK commit shape, integration to `main`, and fresh-main reconciliation. After integration, execute behavior plus the smallest adequate proof in the same TASK.

## Handoff

Branch: `planning/station-s3-wp6-c06b-lifecycle-materialization`. TASK: TASK-631/C06B. Base: `main@88337cddfc7d87b50b0a422487974c8f9d40dd70`. Delta: this TASK specification only; zero product mutation. Gates: UNPROVEN until workflows publish for the exact materialization head. Blocker-first next work: open/inspect the materialization PR, collect current exact-head and merge-candidate gates, correct only bounded proven failures, and integrate only when authoritative shape and evidence are GREEN. C07+, Core/business authority, provider/runtime/deploy and C10 remain ineligible.
