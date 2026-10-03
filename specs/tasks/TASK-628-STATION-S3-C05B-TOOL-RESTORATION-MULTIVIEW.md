# TASK-628 — Station S3 C05B Tool Restoration / Multi-view

Status: ready
Scope: S3 / WP5 / C05B
Base truth: `main@ce0ee654ac71df796a82c4315fb26af0e1c5f197`
Predecessor: TASK-627 C05A CLOSED / PROVEN

## Objective

Close the next bounded C05 Tool obligations after C05A by adding Station-local restoration/rebind and multi-view consequence propagation without creating persistence, command execution, authorization, composition ownership, AppManifest, Core or business authority.

## Accepted behavior

- A Tool restoration descriptor references stable Tool/participant/context identities already admitted by the Tool contract; restoration rebinds only when all referenced identities/routes remain valid.
- Stale, missing, ambiguous or incompatible restoration references fail closed and do not partially mutate Tool state.
- Multiple Tool views may project the same canonical Tool context/participants; view-local presentation state must not become a second canonical Tool authority.
- A context change yields deterministic consequences for all declared views from the same Tool state, preserving participant identity and semantic command identity.
- Restoration/rebind and multi-view projection do not execute/authorize commands, persist remotely, infer retry/compensation, own composition placement, or acquire Core/business semantics.

## Invariants

Preserve C0→C10 dependency order; identity != placement != presentation != action; `ComponentRegistry != AppManifest`; semantic patterns above primitives; discrete/span composition; Station presentation/orchestration-only; C10 Studio remains DEFER/UNPROVEN.

## Allowed paths

- `packages/station-tool/**`
- `tests/product/station-s3-c05-tool-restoration-multiview.test.ts`
- `specs/tasks/TASK-628-STATION-S3-C05B-TOOL-RESTORATION-MULTIVIEW.md`
- `docs/current/NEXT_WORK.md`

## Forbidden paths

- `packages/core/**`
- `packages/station-app-runtime/**`
- `apps/station/**`
- `packages/station-shell/**`
- `packages/station-interaction/**`
- `packages/station-composition/**`
- `packages/ui-core/**`
- provider/runtime/deploy/secrets paths
- AppManifest/C06 implementation
- C10/Studio implementation
- AI/MCP scope

`max_files: 6`

## Dependencies

- TASK-627 integrated and repository memory reconciled.
- Existing `packages/station-tool` C05A contract is the owner/reuse base; lower-layer owners are read/reuse-only.

## Smallest adequate proof

Focused executable proof must establish:
1. valid restoration/rebind preserves Tool, participant and semantic command identities;
2. stale/missing/unknown/ambiguous restoration references reject before state mutation;
3. two or more declared views derive deterministic consequences from one active Tool context without independent canonical context;
4. context switching updates view consequences consistently while preserving participant identity;
5. malformed/duplicate view declarations fail closed;
6. no executable/authorization/persistence/Core/business-authority surface is introduced.

Predecessor C05A proofs are inherited only while their preconditions remain unchanged.

## Test Review / Hardening

Challenge at least: stale restoration after participant/context removal; partial-rebind false positives; duplicate/normalized view-ref ambiguity; view-local state accidentally overriding canonical active context; one view observing a different semantic command/target consequence for the same canonical context; identity regeneration during restore; persistence or retry/compensation inferred from restoration terminology. Any uncovered accepted-risk obligation remains `unproven/gap` and blocks closure when material.

Accessibility/keyboard: NOT-APPLICABLE unless this TASK introduces an interactive UI surface; it currently must not.

## QA Coverage / Evidence Review

Initial status for all C05B obligations: `unproven/gap`. Promote an obligation to `proven` only with focused executable evidence plus applicable exact-head repository gates. Record `failed`, `unproven/gap`, and `not-applicable` explicitly; do not inherit PASS beyond unchanged C05A preconditions.

## Validation

- focused C05B product test
- affected package/type/repository verification as exposed by repository scripts
- mandatory exact-head CI for the authoritative TASK commit
- current merge-candidate GREEN distinct from stale predecessor evidence

## Non-goals / DEFER

Retry/compensation, failure/recovery business semantics, remote persistence, provider/runtime/deploy, C06 AppManifest/application lifecycle, Core/business authority, C10 Studio and AI/MCP.

## Closure gate

One authoritative TASK-628 Construction commit; allowed/forbidden/max_files conformant; focused positive/negative/adversarial proof present; Test Review/Hardening reconciled; QA Coverage/Evidence Review human-auditable; mandatory exact-head and merge-candidate gates GREEN; handoff reconciled before merge/closure claim.
