---
id: TASK-615
title: STATION S3 C01 Admission and Schema Contracts
status: ready
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

## Exact-head authority

Reconciled/rematerialized for WP1 from `station-s3-synthesis-decision-graph@269d9a2da0ece1f5a6d4305e931871bd4183abe0` over fresh `main@d2cd9b404501781de90564b2029277efdfcb023f`. This exact-head reconciliation incorporates `STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`; no product mutation occurred during rematerialization.

If either authority head changes before Construction begins, revalidate the diff and this bound before mutation. Do not silently widen paths or proof scope.

## WP1 / Construction A bound

This TASK is the materialized execution record for **WP1 — C01 Admission & Schema Contracts / Construction A**. Its milestone is the WP1 end-state in `STATION-S3-SCOPE-WBS-WP1-PLAN-01.md`; TASK completion alone cannot close WP1.

Construction A is limited to the admission/schema contract surface plus focused executable proofs. Schema-driven Inspector integration is permitted only where it is the smallest adapter necessary to prove C01; broader Inspector integration belongs to Construction B after evidence review. If the delta requires a forbidden path, more than 12 changed files, C02+ semantics, or a new owner/Core contract, stop and rematerialize rather than widening this TASK.

## Objective

Implement the smallest Station-owned C01 delta that makes component/slot/variant/schema admission explicit and fail-closed before canonical composition mutation, while keeping Inspector field availability contract/schema-driven and preserving identity != placement != presentation != action.

## Current behavior / census

Existing Station composition already provides normalized component descriptors, named slots, discrete span constraints, registry identity, graph validation, fail-closed editor mutations, and presentation-only Property Inspector primitives. Existing proofs cover duplicate IDs/slots, family/layout/parent compatibility, discrete span rejection, nested-layout ownership, invalid editor mutations preserving state, and invalid graph targets preserving draft/selection.

C01 MUST reuse those proofs when their preconditions remain unchanged. It MUST NOT re-test primitive keyboard/focus behavior merely because a higher composition uses a primitive.

The remaining C01 gap is an explicit reusable admission/schema contract joining:
- component + slot compatibility;
- constrained presentation variants;
- schema-declared Inspector fields;
- admission-before-mutation semantics.

## Required behavior delta

1. Define a bounded, domain-neutral admission/schema representation in `packages/station-composition`.
2. Admit a component/slot/variant/schema tuple only when all referenced contract parts are declared and compatible.
3. Reject malformed, unknown or unsupported variants/schema fields deterministically.
4. Rejection occurs before canonical composition/editor mutation; rejected admission leaves prior state/revision/draft unchanged.
5. Placement/span metadata remains independent from stable component/node identity and presentation variant.
6. Semantic action/intent MUST NOT be encoded as a visual variant. No `ApproveDocumentButton`, `DeployButton` or equivalent domain primitive is admitted.
7. Provide a bounded adapter/resolver that derives Property Inspector field definitions from the selected component/capability schema. The Inspector remains a projection; it does not infer business truth or become canonical authority.
8. Preserve `ComponentRegistry != AppManifest`, `WindowGeometry != composition grid`, span/discrete authoring, provider independence and Station presentation/composition authority only.

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

A lower-level proof may be inherited only when its preconditions are unchanged. If C01 changes those preconditions, the affected obligation returns to `unproven-gap` until a delta proof exists.

## Required focused evidence

Construction must add the smallest adequate executable evidence for:
- one valid admission path;
- unknown slot/component/variant/schema-field rejection;
- incompatible family/layout/span rejection through the admission boundary;
- repeated rejection determinism;
- rejected admission preserving draft/state;
- identity unchanged by placement/span/presentation edits;
- schema selection changing Inspector field availability from declared contract data;
- absence of domain-specific action variants in the C01 contract surface.

Use contract/unit or composition tests where sufficient. Add browser/visual proof only if the implementation introduces a user-visible behavior that those lower-cost proofs cannot establish.

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

Before any C01 closure claim, perform an intermediate review asking what invalid/adversarial admission can still mutate state or escape existing evidence. Explicitly inspect false-positive tests, unsupported schema/variant paths, stale assumptions in inherited proofs, and Inspector hardcoding. Findings are `proven | failed | unproven-gap | not-applicable`; absence of evidence is never PASS.

## QA Coverage / Evidence gate

C01 may close only after exact-head validation and a human-auditable obligation/evidence map. Critical unresolved C01 gaps block closure. Non-critical intentional gaps remain visible as `unproven-gap`; human acceptance remains separately recorded.

## Escalation

Stop and rematerialize rather than broadening scope if implementation requires more than 12 changed files, a forbidden path, a new Core/business contract, AppManifest changes, provider coupling, C10/Studio, or a new semantic abstraction not justified by the S3 Decision Graph and Sufficiency Matrix.
