---
id: TASK-615
title: STATION S3 C01 Admission and Schema Contracts
status: completed
priority: 615
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-614
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - docs/adr/ADR-0017-station-visual-shell-foundation.md
  - project_docs/execution_planning/STATION-S3-COMPONENT-GRAMMAR-PLAN-01.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md
  - packages/station-composition/types.ts
  - packages/station-composition/validation.ts
  - packages/station-composition/registry.ts
  - packages/station-composition/component-editor.ts
  - packages/ui-core/property-inspector.tsx
allowed_paths:
  - packages/station-composition/admission.ts
  - packages/station-composition/index.ts
  - tests/product/station-composition.test.ts
  - specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/station/**
  - apps/core/**
  - packages/station-app-runtime/**
  - packages/core/**
  - packages/workflow-engine/**
  - packages/actions/**
  - infra/**
  - deploy/**
  - scripts/**
max_files: 12
required_tests:
  - npm run test:product
  - npm run typecheck
  - npm run lint
  - npm run build:station
  - npm run test:station:e2e
  - npm run test:station:a11y
  - npm run test:station:visual
  - npm run test:heavy
required_docs:
  - docs/current/NEXT_WORK.md
  - specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
acceptance:
  - one Station-local admission path validates component identity, parent/slot placement, discrete span, presentation variant, and Inspector schema before returning an admitted C01 composition value
  - unknown component, slot, presentation variant, or Inspector schema field fails closed without mutating caller-owned input
  - identity remains distinct from placement and presentation; no action/effect semantics are introduced
  - Inspector field definitions are derived from the admitted component schema rather than a second handwritten field authority
  - ComponentRegistry remains distinct from AppManifest and no runtime/deploy/Core authority is introduced
  - focused product proof covers valid admission plus negative paths for unknown identity/slot/variant/schema and incompatible span/family
  - exact-head required gates pass before closure
stop_conditions:
  - any required change outside allowed_paths
  - any need for Core/business authority, AppManifest/runtime/deploy behavior, C02+ semantics, or C10/Studio behavior
  - any ambiguity that would require inventing a second schema or registry authority
---

# TASK-615 — STATION S3 C01 Admission and Schema Contracts

## Context
S3 Construction A needs the smallest dependency-safe C01 product increment after the construction materialization gate. The repository already owns primitive types, registry validation, component-editor validation, and the generic PropertyInspector renderer, but lacked one explicit Station-local admission contract that proves those authorities converge before a composition value is admitted.

## Current behavior
The component registry and component-editor contracts can validate their respective surfaces independently. Before this TASK there was no single bounded admission function proving component identity, parent/slot placement, discrete span, presentation variant, and Inspector schema fields together as one C01 composition admission decision.

## Required change
Introduce one Station-local C01 admission/schema contract that composes the existing registry/editor authorities without creating a new business/runtime authority. The admitted result must remain presentation/composition data only, fail closed on invalid references or incompatible family/span, and derive Inspector field definitions from the admitted component schema.

## Inputs / contracts
- `ComponentRegistry` / component definitions from `packages/station-composition/registry.ts`.
- placement/span/presentation validation from `packages/station-composition/component-editor.ts`.
- C01 identity/placement/presentation types from `packages/station-composition/types.ts`.
- generic Inspector rendering remains downstream in `packages/ui-core/property-inspector.tsx`; this TASK does not change that renderer.

## Outputs / contracts
- one exported C01 admission API under `packages/station-composition/`;
- admitted values keep identity, placement and presentation structurally distinct;
- Inspector field definitions come from the admitted component schema;
- no action/effect, runtime, deploy, Core, AppManifest or C02+ semantics.

## Acceptance criteria
- valid C01 tuples are admitted deterministically;
- unknown component/slot/variant/schema references reject deterministically;
- incompatible family/span rejects deterministically;
- rejection does not mutate caller-owned input;
- focused product proof demonstrates the contract and separation invariants;
- all required exact-head gates are green before closure.

## Evidence expected
- focused assertions in `tests/product/station-composition.test.ts` for valid and negative admission paths;
- `npm run test:product`, `typecheck`, `lint`, Station build/browser gates and heavy tests as required by this TASK;
- `docs/current/NEXT_WORK.md` records exact branch/PR/head, gate state, blockers, files changed, proof classification and next eligible work.

## Stop condition
Stop rather than widen the TASK if any required behavior crosses the declared allowed paths or needs runtime/Core/AppManifest/C02+/C10 authority.