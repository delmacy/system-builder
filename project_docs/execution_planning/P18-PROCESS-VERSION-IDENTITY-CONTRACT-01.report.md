# P18-PROCESS-VERSION-IDENTITY-CONTRACT-01 — Sprint Report

Status: VERIFICATION
Date: 2026-08-28
Package: `P18-PACKAGE-01 — Process Version Identity & Immutable Revision Foundation`
WBS: 18.1.1–18.1.3
Branch: `sprint/P18-PROCESS-VERSION-IDENTITY-CONTRACT-01`

## Delivered evidence

- TASK-390 established stable business artifact identity distinct from immutable revision identity.
- TASK-391 added deterministic immutable-publication evidence and rejects conflicting overwrite while accepting identical republication as idempotent.
- TASK-392 added explicit `active | deprecated | archived` lifecycle descriptors and bounded supersession semantics.
- TASK-393 composed same-artifact revision lineage deterministically and fails closed for cross-artifact, forged predecessor, conflicting immutable evidence, cyclic/contradictory supersession, and injected payload/classification state.
- TASK-394 adds the integrated product-level growing proof exercising the complete bounded path: stable artifact identity → multiple immutable revisions → idempotent publication/conflicting overwrite rejection → explicit deprecated/archived/active lineage validation.

## Integrated proof

`tests/product/p18-process-version-identity-growing-proof.test.ts` proves that one stable artifact may own multiple distinct immutable revisions, publication replay is idempotent only when immutable evidence is identical, overwrite conflicts fail closed, and explicit lifecycle/supersession lineage remains deterministic. Negative proof covers malformed cross-artifact composition, cyclic/forged supersession, contradictory active-predecessor supersession and semantic-classification injection.

## Validation evidence

Predecessor TASK-393 passed exact-head Deterministic CI #1102 and Heavy Product Tests #556 on `87eadaf5607b78fc1fb74de407b2266af64832a4` before TASK-394 execution.

TASK-394 requires exact-head verification of:

- `npm run test:product`
- `npm run check:tasks`
- `npm run check:architecture`
- `npm run verify`
- repository Deterministic CI
- Heavy Product Tests

TASK-394 remains in verification until the exact implementation head passes both repository gates without drift.

## Preserved boundaries

No WBS 18.2 semantic diff, breaking classification or change approval was introduced. No WBS 18.3 process-to-system/release lineage was introduced. Git metadata is not business-version authority. No runtime/compiler or Decision Boundary changes were made. No storage/topology redesign, inferred L4, unrelated findings or technical-debt absorption occurred.
