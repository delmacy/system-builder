---
id: TASK-627
title: STATION S3 C05A Tool Identity Participant Roles and Active Context
status: ready
priority: 627
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
  - packages/station-interaction/**
  - packages/station-composition/**
allowed_paths:
  - packages/station-tool/**
  - tests/product/station-s3-c05*.test.ts
  - specs/tasks/TASK-627-STATION-S3-C05A-TOOL-ACTIVE-CONTEXT.md
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

# TASK-627 — STATION S3 C05A Tool Identity / Participant Roles / Active Context

## Objective

Materialize the smallest first C05 tranche: a pure Station Tool contract that introduces stable Tool identity, declared participant-role compatibility, and deterministic active-context routing without acquiring command, composition, persistence, shell, AppManifest, Core, or business authority.

## Context

Materialized from fresh `main@d885e4a16d524f97ad465a73b5780f59bda9232e` after TASK-618/C04 closure. Historical `project_docs/tasks/TASK-619..626` already exist from M2, so the next collision-free S3 task id is TASK-627. Research establishes that EditorShell is layout-only and that no existing concrete editor/domain surface is authoritative as the C8/C05 Tool abstraction. C05 must therefore own only the reusable Tool invariant and inherit lower-layer proofs where preconditions remain unchanged.

## Current behavior

C01-C04 provide component identity, composition/currentness, interaction command qualification, and responsive structural projection, but the repository has no authoritative reusable Tool abstraction that owns stable Tool identity, semantic participant-role compatibility, or active-context routing. Existing EditorShell is layout-only chrome and concrete editor/domain surfaces are not grammar authority. Construction is blocked until this bounded C05A contract is integrated.

## Required change

1. Define stable Tool identity independent of participant placement/presentation.
2. Admit participants only through explicit semantic role declarations; incompatible/duplicate required-role bindings fail closed before Tool-state mutation.
3. Represent active context as presentation/orchestration state that selects among already-declared compatible participants; active context is never authorization.
4. Route a command identity/target qualifier deterministically from declared active context without feature-name/domain branching, while leaving invocation/currentness/authority with the existing command owner.
5. Keep participant/component/view identities unchanged when active context changes.
6. Do not mutate or duplicate Station composition, interaction, shell, EditorShell, registry, or business state.
7. Keep restoration, multi-view consequence propagation, retry/compensation, failure/recovery presentation and extension seams explicitly deferred to later C05 tranche(s) unless needed to prove this bounded invariant.

## Inputs / contracts

- Stable participant/component/view identities supplied by existing Station owners; placement or presentation is not identity.
- Existing interaction command identity/target/currentness contracts remain authoritative for command semantics and execution eligibility.
- Existing composition and responsive projection contracts remain authoritative for placement/span and visual structure.
- C01-C04 proof may be inherited only where owner contracts and preconditions remain unchanged.
- Declared Tool participant roles and active-context selection are Station presentation/orchestration inputs only and carry no Core/business authority.

## Outputs / contracts

- A stable Tool identity that does not regenerate when active context changes.
- Deterministic admission/rejection of declared participant-role bindings, failing closed before canonical Tool-state mutation on incompatible or ambiguous bindings.
- Deterministic active-context qualification of an already-declared command identity/target contract without executing the command or strengthening authority.
- Stable participant/view/component identity across active-context changes.
- No mutation or duplication of composition, interaction, shell, EditorShell, AppManifest, persistence, runtime/deploy/provider, Core, or business owners.

## Acceptance criteria

- Tool identity remains stable while active participant/context changes.
- Compatible participant roles admit deterministically; incompatible or ambiguous bindings fail closed with zero canonical Tool-state mutation.
- Active-context routing returns only declared identity/target qualification and does not execute commands or infer authority from visible/enabled/focused state.
- Same command identity can resolve deterministically through different declared active contexts without domain-name branching.
- Participant/view/component identity is preserved; no placement/presentation change becomes semantic identity.
- No Core/business, AppManifest, runtime/deploy/provider, shell, composition, interaction, persistence or EditorShell authority is introduced.

## Non-goals

Restoration serialization/rebind; multi-view consequence propagation; retry/compensation; failure/recovery semantics; extension/plugin seams; AppManifest/C06; provider/runtime/deploy; C10/Studio; AI/MCP; Core/business authority.

## Evidence expected

Focused product proof for stable Tool identity, participant-role compatibility/fail-closed admission, deterministic active-context routing, same-command identity convergence, identity preservation, and absence of authority strengthening. Challenge active context accidentally becoming authorization; visible/focused participant becoming command owner; duplicate/ambiguous role admission; feature-name branching; identity regeneration on context switch; mutation of lower-layer composition/interaction state; and hidden reliance on concrete EditorShell/domain applications. Classify each obligation `proven | failed | unproven-gap | not-applicable`. C01-C04 and lower-layer interaction/composition proofs are inherited only where owners/contracts and preconditions remain unchanged. All new C05A obligations begin `unproven-gap` until observed on the final exact head.

## Escalation

Stop and rematerialize if implementation needs more than 6 files, any forbidden path, mutation of existing lower-layer owners, executable command authority, persistence/restoration semantics, AppManifest/Core/business authority, or scope beyond this first bounded C05 tranche. Construction may begin only after this materialization is integrated into fresh main.
