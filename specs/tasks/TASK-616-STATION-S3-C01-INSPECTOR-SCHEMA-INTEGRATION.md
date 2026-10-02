---
id: TASK-616
title: Station S3 C01 Inspector Schema Integration
status: ready
change_level: L2
max_files: 8
depends_on:
  - TASK-615
allowed_paths:
  - packages/station-composition/**
  - packages/ui-core/**
  - tests/product/station-composition.test.ts
  - tests/product/ui-core.test.ts
  - specs/tasks/TASK-616-STATION-S3-C01-INSPECTOR-SCHEMA-INTEGRATION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/station/**
  - packages/core/**
  - packages/station-app-runtime/**
  - packages/deploy/**
  - packages/compiler/**
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-616 — Station S3 C01 Inspector Schema Integration

## Context

TASK-615 is merged in main through PR #973 at `5ed671270e1e2dcd02b528673e7487e1e6b8f933` and established the fail-closed C01 admission/schema contract plus `resolveInspectorFields`. WP1 Construction B is the next explicitly planned tranche in `STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`.

## Current behavior

`packages/station-composition/admission.ts` resolves Inspector field definitions from a component admission schema. `packages/ui-core/property-inspector.tsx` renders generic `PropertyInspector`/`PropertyGroup`/`PropertyRow` definitions supplied by callers. There is not yet a bounded adapter proving that an admitted C01 schema drives the Inspector row surface without domain hard-coding or authority transfer.

## Required change

Add the thinnest Station-owned adapter needed to project admitted schema fields into the existing generic Property Inspector definition contract. Keep field identity/label/read-only metadata schema-driven. Values may only be supplied explicitly by the caller; the adapter must not infer business truth, mutate canonical composition, or encode semantic actions as presentation variants.

Preserve placement/span separately from identity and presentation. Do not change ComponentRegistry or AppManifest semantics. Do not add Tool/Application/Studio specialization. C10 remains DEFER/UNPROVEN.

## Inputs / contracts

- accepted Addendum 001;
- merged TASK-615 C01 admission/schema contract;
- `ComponentAdmissionSchema`, `InspectorFieldSchema`, `resolveInspectorFields`;
- generic `PropertyInspector`, `PropertyGroupDefinition`, and `PropertyRowDefinition` presentation contracts;
- WP1 Construction B milestone obligations.

## Outputs / contracts

A deterministic presentation-only Inspector projection/adapter and focused executable proof that:
- rows originate from schema-declared field IDs;
- unknown field IDs fail closed through the existing schema resolver;
- caller values do not become schema or canonical authority;
- read-only metadata is preserved;
- no placement/span, action, AppManifest, Core/business or Studio semantics are introduced.

## Acceptance criteria

1. Inspector row selection is schema-driven and deterministic.
2. Unknown requested fields are rejected rather than synthesized.
3. Schema labels/read-only metadata survive projection unchanged.
4. Explicit caller values are presentation inputs only and cannot add undeclared rows.
5. Identity/placement/presentation/action boundaries remain intact.
6. Existing generic Property Inspector remains domain-neutral.
7. Focused positive, negative and predecessor-integration proof accompanies behavior.
8. Intermediate Test Review/Hardening records any adversarial or missing obligation; absence of evidence is not PASS.
9. QA Coverage/Evidence Review classifies obligations as PROVEN / FAILED / UNPROVEN-GAP / NOT-APPLICABLE before closure.
10. Declared validations and exact-head CI gates pass before merge.

## Evidence expected

- focused product tests for schema-driven row projection, unknown-field rejection, read-only preservation, undeclared-value exclusion and deterministic ordering;
- predecessor integration proof using TASK-615 schema resolution;
- `npm run lint`, `npm run typecheck`, `npm run test:product`, `npm run check:architecture`, `npm run verify`;
- exact-head Deterministic CI, Merge Candidate CI, Heavy Product Tests and applicable Station quality/doc gates;
- explicit Test Review/Hardening and QA Coverage/Evidence classification in the live handoff.
