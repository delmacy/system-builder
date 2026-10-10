---
id: TASK-652
title: Station S4 WP3 Portable Composition Codec Readiness
status: draft
priority: 652
milestone: STATION-S4-WP3-LOCAL-ARTIFACT
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-651
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/CONTRACT_INDEX.md
  - project_docs/execution_planning/STATION-S4-WP3-LOCAL-ARTIFACT-PLANNING-01.md
  - apps/station/web/app/station-editor-catalog.ts
allowed_paths:
  - specs/tasks/TASK-652-STATION-S4-WP3-ARTIFACT-CODEC-READINESS.md
forbidden_paths:
  - apps/**
  - packages/**
  - tests/**
  - .github/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 1
validation:
  - npm run verify
---

# TASK-652 — Station S4 WP3: Portable Composition Codec Readiness

State: PLANNED (not implemented)
Predecessor: WP2 closed at main@9768c06e; WP3 planning merged at main@864692c4.
Scope: proposed Construction A, bounded preparation only.

## Goal
Define and then implement a safe, versioned, portable **composition artifact** codec using existing Station composition graph/descriptor contracts, without writing to Station window preferences or Core. WP3's broader local persistence phase is not covered by this task.

## Readiness gate
- Inventory repository-wide resource/file extension, composition graph and serialization contracts before selecting extension or format.
- Distinguish source-defined catalog descriptors from user-supplied serialized graphs; never trust an imported descriptor or arbitrary executable component.
- State explicit file size/node count bounds, schema version migration policy, app/composition identity and revision policy.
- Record immutable validation and recovery rules, without replacing the current session on failure.
- Approve an Addendum governing external input and local storage before product code. Any change to shared contracts requires separate architecture review.

## Construction A test targets
- Valid deterministic round trip of existing admitted example and ButtonGroup graphs.
- Reject unknown schema versions, malformed/truncated JSON, oversized files, duplicate/unknown node references, illegal slots/span bounds, forged application identity, unexpected fields and unsafe object keys.
- Reject stale incompatible revision without overwriting a valid editor session.
- Test that the exported artifact does not contain UI preferences, session focus or provider secrets.
- Maintain WP2 browser regression and exact-head/current merge candidate CI.

## Delivery gates
Planning approval -> separately bounded codec implementation commit -> unit tests -> Chromium proof where relevant -> review/merge. Do not advertise durable Save/Open until an independent WP3 Construction B explicitly implements and proves it.

## Objective
Prepare a versioned portable composition codec under an explicitly reviewed future contract; this task changes documentation only.

## Context
WP2 and WP3 planning are integrated, but the editor Save remains session-only and accepts source-owned catalog entries.

## Current behavior
Graph editing uses admitted composition descriptors and does not import external files. Window settings intentionally exclude editor data.

## Required change
Inventory resource/file contracts and define validation, migration and security gates before implementation in a separate bounded construction task.

## Inputs / contracts
WP3 planning baseline, Station composition graph and editor session APIs, existing resource/file format contracts, and document authority.

## Outputs / contracts
A readiness checkpoint and test requirements, not a new accepted schema, importer, or persistence API.

## Acceptance criteria
- Existing resource and composition contracts are inventoried before implementation.
- Strict schema, bounded size, identities, revision, versioning and fail-closed recovery are specified.
- Exact-head and current merge-candidate checks succeed before integration.

## Non-goals
Product code, durable storage, Core changes, app deployments, external execution, unrelated window preferences or complete Studio functionality.

## Evidence expected
Reviewed TASK commit, deterministic CI and browser regression, PR integration trace.

## Escalation
Stop for forbidden-file changes, shared contract drift, worker collision, or insufficiently specified import trust boundary.
