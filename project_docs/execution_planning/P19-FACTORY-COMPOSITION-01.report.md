# P19-FACTORY-COMPOSITION-01 — Sprint Report

Status: CONSTRUCTED / SPRINT REVIEW

Base fresh main at Sprint start: `e975af0f229118f2a080098f12654123d198787f`.
Current fresh main revalidated during Sprint Review: `4b28ad632dddfe75f1c762b21dced147e3fc1a0d` (intervening conformance-state hotfix only).

## Scope executed

Construction 2 only for `P19-PACKAGE-01`, WBS 19.1.2: bounded L2/L3 deterministic composition over the already integrated WBS 19.1.1 factory-journey identity/provenance contract and existing public catalog, assembly, validation, compiler, release and deploy surfaces. The increment propagates canonical process/analysis/SystemDefinition lineage through capability resolution, assembly, validation, compilation, release-compatible preview evidence and deployment-record dry-run evidence without hand-authored successor identity authority.

No WBS 19.1.3 command/API entrypoint, runtime launch, persistence/storage redesign, publication/deployment execution side effect, Decision Boundary change, new bounded context, Builder/Runtime topology change, unrelated TD/findings absorption or inferred L4 was introduced.

## TASK evidence

- TASK-424 — `3b6c37c7b9b10536060a6a81fbbe2a9f5fa74378`: establish the bounded factory composition seam; focused proof followed in `a6c1fe9e36d8877f181b7408c6f3de428cefe746`.
- TASK-425 — `577b2939c25899da12bc569c912161ccb8ef5ebc`: bind capability resolution to exact canonical process/analysis/SystemDefinition lineage.
- TASK-426 — `3236917a7e09b07766211dfa3b763bd273fd8435`: compose AssemblyPlan and ValidationEvidence from canonical definition lineage.
- TASK-427 — `a2d2de893ca536e52ca5580358697326d8c481f3`: compose compiler/release/deployment evidence through existing deterministic downstream surfaces.
- TASK-428 — `d32c856c37cf4640b6a3930d44e766ad4048f598`: prove the complete WBS 19.1.2 composition chain with positive, repeatability and adversarial predecessor-integration product evidence.

Bounded follow-up commits remained inside the materialized Sprint scope: `ab62bf144d361d2e9218878bf954d1333d17947b` and `f0ff8953bc4503224776fe188a6e368cec495132` exposed/reused existing public package boundaries for TASK-424; `bdab7176e0d324efda42f6891e6f25c3e8c33983` completed the canonical process-revision test fixture; `0d8642c13af8c2647496399988bf7dc60ba6b908` preserved TypeScript narrowing in the TASK-428 proof without weakening assertions or gates.

## Verification evidence

The exact pre-report product head `0d8642c13af8c2647496399988bf7dc60ba6b908` passed:

- Deterministic CI #1254 — PASS.
- Heavy Product Tests #723 — PASS.

TASK-428 product proof exercises the real composed path from the WBS 19.1.1 journey binding through catalog, assembly, validation, compiler, release preview and deployment dry-run evidence. It proves deterministic repeated output and fail-closed behavior for stale approved process identity, missing capability provider, lineage-broken capability predecessor, cross-system assembly substitution, substituted validation evidence and incompatible deployment environment.

This report is documentation-only. Its resulting head must retain exact-head Deterministic CI and Heavy Product Tests green before Sprint Review integration.

## Preserved authority and boundaries

Canonical M15 `human-decision` remains business authority. Existing bounded contexts remain sources of truth for their artifacts and APIs. The composition seam carries predecessor identity/provenance but does not become a new business authority or runtime orchestrator. Release work is preview/evidence composition only; deployment work uses the existing dry-run path and performs no deployment execution or external environment mutation.

WBS 19.1.3+ remains forecast/non-executable unless separately materialized by fresh-main rolling-wave authority.

## Repository-memory observation

Fresh `main` contains the merged Planning PR #515 materializing this Sprint, while `docs/current/PROJECT_STATE.md`, `CURRENT_MILESTONE.md` and `NEXT_WORK.md` still describe WBS 19.1.2 as not materialized. That drift predates this Construction branch and does not change the explicit authority in the merged Sprint manifest/TASK specs. It should be reconciled at the appropriate Sprint integration/repository-memory gate rather than by altering TASK scope.