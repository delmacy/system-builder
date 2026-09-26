# TASK-626 — Component Editor cumulative integration + closure

Status: completed
Depends on: TASK-625

## Allowed
- `apps/station/web/**`
- `packages/station-composition/**`
- associated tests
- `docs/current/**`
- this TASK spec

## Forbidden
Launcher/AppManifest registration unless separately materialized; Window/View Editor implementation; remote persistence/publish/deploy/provider runtime; Template Manager implementation; File Manager; Workflow Studio; Core/business authority; arbitrary pixel geometry.

## max_files
10

## Acceptance
- cumulative Component Editor specialization is visibly testable in Station from component selection through contract/slot/variant edit, validation, draft/dirty state, discard/reset and preview;
- accessibility/keyboard/focus and adversarial invalid-input regressions remain green;
- architectural invariants are explicitly reverified;
- Construction E documentation is reconciled against fresh main;
- lint, typecheck, product/architecture verification, Station Next.js CI and applicable exact-head gates pass;
- no successor scope is implemented before Construction E closure.

## Closure evidence
- Product integration: PR #947, merge `510b47aa53ea0f0b64db2dd31bd0d34377af5595`.
- Exact product head `c4a7b3627175986cd28f291859ffe125f4aaabb1` passed Deterministic CI #2620, Merge Candidate CI #850, Station Next.js CI #77, Heavy Product Tests #2324 and Automation Handoff #6255.
- The cumulative Station proof exposes component selection, contract/slot/variant mutation, validation, graph/contract dirty state, graph discard, whole-component reset and preview while preserving ComponentRegistry != AppManifest and composition grid != WindowGeometry.
