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
  - packages/station-composition/**
  - packages/ui-core/property-inspector.tsx
  - packages/ui-core/index.ts
  - tests/product/station-composition.test.ts
  - tests/product/station-composition-editor-hardening.test.ts
  - specs/tasks/TASK-615-STATION-S3-C01-ADMISSION-SCHEMA-CONTRACTS.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/station-app-runtime/**
  - apps/station/**
max_files: 12
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-615 — STATION S3 C01 Admission & Schema Contracts

## Closure disposition — 2026-10-02

TASK-615 is **DONE / PROVEN** after post-merge conformance reconciliation.

The merged PR #973 contained 16 files relative to its old base `main@d2cd9b404501781de90564b2029277efdfcb023f`, but that comparison included research/planning lineage already present on the materialization branch before TASK-615 execution. The TASK exact-head authority was `station-s3-synthesis-decision-graph@269d9a2da0ece1f5a6d4305e931871bd4183abe0`; comparing that task predecessor to merged PR head `9a058fa170e09b01012e330645e62d4645acba98` yields **5 changed files**, so the declared `max_files: 12` bound is satisfied. No retroactive weakening of the bound is required.

Exact PR-head required workflows were green before merge. PR #973 merged as `main@5ed671270e1e2dcd02b528673e7487e1e6b8f933`. The subsequent post-merge blocker record was documentation-only and did not alter C01 product semantics. C01 evidence may be inherited by the next lot; C02+ must prove only its own delta.

## Context

This is the materialized WP1 / Construction A execution record for C01. It is governed by the S3 component-grammar addendum, the live `NEXT_WORK`, the S3 Construction Materialization plan and the WP1 scope/WBS baseline. It remains Station-local and presentation/composition-only: `ComponentRegistry != AppManifest`, identity != placement != presentation != action, semantic patterns stay above primitives, span/discrete composition remains distinct from WindowGeometry, and no Core/business authority is admitted.

## Exact-head authority

Reconciled/rematerialized for WP1 from `station-s3-synthesis-decision-graph@269d9a2da0ece1f5a6d4305e931871bd4183abe0` over fresh `main@d2cd9b404501781de90564b2029277efdfcb023f`. If either authority head changes before Construction begins, revalidate the diff and this bound before mutation. Do not silently widen paths or proof scope.

## WP1 / Construction A bound

Construction A is limited to the admission/schema contract surface plus focused executable proofs. Schema-driven Inspector integration is permitted only where it is the smallest adapter necessary to prove C01; broader Inspector integration belongs to Construction B after evidence review. If the delta requires a forbidden path, more than 12 changed files, C02+ semantics, or a new owner/Core contract, stop and rematerialize rather than widening this TASK.

## Objective

Implement the smallest Station-owned C01 delta that makes component/slot/variant/schema admission explicit and fail-closed before canonical composition mutation, while keeping Inspector field availability contract/schema-driven and preserving identity != placement != presentation != action.

## Current behavior

Existing Station composition already provides normalized component descriptors, named slots, discrete span constraints, registry identity, graph validation, fail-closed editor mutations, and presentation-only Property Inspector primitives. Existing proofs cover duplicate IDs/slots, family/layout/parent compatibility, discrete span rejection, nested-layout ownership, invalid editor mutations preserving state, and invalid graph targets preserving draft/selection.

The remaining C01 gap is an explicit reusable admission/schema contract joining component + slot compatibility, constrained presentation variants, schema-declared Inspector fields, and admission-before-mutation semantics.

## Required change

1. Define a bounded, domain-neutral admission/schema representation in `packages/station-composition`.
2. Admit a component/slot/variant/schema tuple only when all referenced contract parts are declared and compatible.
3. Reject malformed, unknown or unsupported variants/schema fields deterministically.
4. Reject before canonical composition/editor mutation and preserve prior state/revision/draft.
5. Keep placement/span metadata independent from stable component/node identity and presentation variant.
6. Do not encode semantic action/intent as a visual variant.
7. Provide a bounded resolver deriving Property Inspector field definitions from selected component/capability schema; Inspector remains a projection.
8. Preserve provider independence and Station presentation/composition authority only.

## Inputs / contracts

Inputs are the existing Station component registry descriptors, parent/slot declarations, discrete span constraints, constrained presentation variants, schema-declared Inspector fields, and existing composition validation/editor contracts cited in `context_paths`. No AppManifest, Core/runtime/provider/deploy contract is an input authority for C01.

## Outputs / contracts

The output is a deterministic Station-owned admission result representing only a fully declared compatible component/parent/slot/span/variant/schema tuple, plus a bounded schema-driven Inspector-field projection. Invalid or unsupported input produces deterministic rejection and no admitted value or caller-state mutation.

## Acceptance criteria

- One valid declared tuple is admitted deterministically.
- Unknown component, slot, variant or schema field is rejected.
- Incompatible family/layout/span is rejected through the admission boundary.
- Repeated rejection is deterministic and preserves caller draft/state.
- Stable identity does not change when placement/span/presentation changes.
- Inspector field availability derives from declared schema data rather than feature hardcode.
- The C01 contract surface contains no domain-specific semantic action variants.
- No forbidden path, C02+ semantic, AppManifest, provider/runtime/deploy, Core/business authority or C10/Studio scope is introduced.

## Evidence expected

Use the smallest adequate contract/composition proof: valid admission; unknown component/slot/variant/schema-field rejection; incompatible family/layout/span rejection; repeated rejection determinism; zero caller mutation; identity independence; schema-driven Inspector field availability; and action-vs-presentation separation. Browser/visual proof is required only if C01 introduces user-visible behavior that lower-cost proofs cannot establish. Final evidence is SHA-scoped and must include the declared validation commands plus required repository/merge-candidate gates.

## Proof obligations and coverage start state

Every obligation below starts `unproven-gap` for this C01 delta until exact-head evidence exists:

| Obligation | Inherited proof | C01 delta proof |
| --- | --- | --- |
| valid slot/schema admission | existing slot/family/layout/span compatibility | valid declared tuple is admitted deterministically |
| invalid tuple rejection | graph/placement rejection | unknown/incompatible tuple rejects before mutation |
| variant admission | existing constrained component-editor variant normalization | malformed/unknown/unsupported variant rejects; declared variant admits |
| zero mutation on rejection | existing editor hardening preserves state on invalid target | C01 rejection preserves canonical draft/state by identity and value |
| identity/placement/presentation separation | existing semantic refs + discrete placement | changing admitted placement/presentation never changes stable identity |
| action != presentation | ADR-0017 commands precede controls; S3 addendum | admission schema contains no semantic action encoded as visual variant |
| schema-driven Inspector | existing caller-supplied presentation-only Property Inspector | selected contract/schema deterministically resolves available fields without feature hardcode |

## Human acceptance

Human review may validate that the schema/Inspector expectation is the intended authoring UX. It is separate from machine conformance and cannot turn missing executable evidence into `proven`.

## Non-goals

- C02 canonical revision / multi-projection convergence.
- C03 command currentness, effects, retry, compensation or rollback.
- semantic reparent/order/cycle/reachability beyond already admitted contracts.
- AppManifest/application lifecycle.
- provider/runtime/secrets/deployment implementation.
- Studio/C10 construction.
- AI/MCP.
- arbitrary HTML/CSS or pixel authoring.
- Core/business authority or new business semantics.

## Test Review / Hardening gate

Before any C01 closure claim, inspect invalid/adversarial admission that could still mutate state or escape evidence, false-positive tests, unsupported schema/variant paths, stale assumptions in inherited proofs, and Inspector hardcoding. Findings are `proven | failed | unproven-gap | not-applicable`; absence of evidence is never PASS.

## QA Coverage / Evidence gate

C01 may close only after exact-head validation and a human-auditable obligation/evidence map. Critical unresolved C01 gaps block closure. Non-critical intentional gaps remain visible as `unproven-gap`; human acceptance remains separately recorded.

## Escalation

Stop and rematerialize rather than broadening scope if implementation requires more than 12 changed files, a forbidden path, a new Core/business contract, AppManifest changes, provider coupling, C10/Studio, or a new semantic abstraction not justified by the S3 Decision Graph and Sufficiency Matrix.
