# TASK-629 — Station S3 C05C Tool Multi-view Propagation

Status: ready
Program: Station S3 / WP5 / C05 Tool
Predecessor: TASK-628 CLOSED / PROVEN
Materialization base: `main@2bdd95b5c1e0812a64b17f63fc79b259ba38fb12`
Max files: 6

## Objective
Materialize only the smallest remaining C05 tranche: deterministic Station-owned propagation of one Tool context consequence across multiple declared participant views while preserving stable identity and the C05A/C05B authority boundary.

## Allowed
- `packages/station-tool/**`
- focused `tests/product/station-s3-c05*.test.ts`
- this TASK spec and bounded `docs/current/NEXT_WORK.md` reconciliation

## Forbidden
- persistence/storage ownership
- mutation of `packages/station-interaction/**`, `packages/station-composition/**`, `packages/station-shell/**`, `packages/ui-core/**`, `apps/station/**`, `packages/core/**`
- command execution/authorization or Core/business authority
- AppManifest/C06+
- provider/runtime/deploy
- retry/compensation and failure/recovery presentation
- extension seams
- C10/Studio
- AI/MCP

## Acceptance / proof obligations
1. A declared context consequence propagates deterministically only to compatible declared participant views.
2. Tool, participant, view and component identities remain stable across propagation.
3. Unknown, stale, duplicate, ambiguous or incompatible participant/view references fail closed before canonical Tool-state mutation.
4. Rejection produces zero partial mutation; repeated equivalent propagation is idempotent.
5. Focus, visibility, enabled/current/active state and propagation membership never create command execution, authorization or business authority.
6. C01-C04, C05A and C05B proofs are inherited only where owners and preconditions remain unchanged; new C05C obligations begin UNPROVEN-GAP until focused executable and exact-head evidence is GREEN.

## Stop / rematerialize
STOP if implementation requires a forbidden owner, interactive UI/accessibility surface, persistence, retry/compensation, C06+, or more than 6 files. Do not widen this TASK silently.
