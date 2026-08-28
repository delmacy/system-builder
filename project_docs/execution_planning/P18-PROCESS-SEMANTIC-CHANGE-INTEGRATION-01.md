# P18-PROCESS-SEMANTIC-CHANGE-INTEGRATION-01 — Construction B

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P18-PACKAGE-02 — Semantic Process Change Classification & Approval Evidence`
Base: `db48bda8c2451cdfb054b4b506cb1b1851f597db`
WBS: 18.2.1–18.2.3

## Goal
Integrate the canonical process semantic-change chain through the existing `packages/support-evolution/**` consumer seam without changing its existing evidence semantics, proving callers cannot substitute forged predecessor/diff/classification/rationale/human-approval truth.

## Representative consumer
`packages/support-evolution/evolution-request.ts` already carries `changeEvidenceRef` and `reasonRef` as reference-only evolution evidence. Construction B adds an additive validation/composition seam around that existing evidence rather than redefining `EvolutionRequestEvidence` or making Support/Evolution the owner of process-versioning semantics.

## TASK chain
`TASK-404 -> TASK-405 -> TASK-406 -> TASK-407 -> TASK-408`

- TASK-404 — add an additive support-evolution process-change admission seam that consumes public WBS 18.1/18.2 contracts and preserves existing EvolutionRequest behavior.
- TASK-405 — bind canonical predecessor/diff/classification/rationale evidence to the evolution request and reject mismatched/forged semantic-change references.
- TASK-406 — require canonical human process-change approve/reject decision and authorityRef consistency; keep classification/model/PR/Git non-authoritative.
- TASK-407 — prove deterministic accepted/rejected consumer outcomes and backward-compatible coexistence with existing evolution evidence/linkage behavior.
- TASK-408 — close Construction B with an integrated growing proof and Sprint Report covering bypass resistance across WBS 18.2 and the representative consumer seam.

## Boundaries
This Construction may modify `packages/support-evolution/**`, focused product tests, this manifest/report and TASK specs. It consumes `packages/contracts/process-versioning/**`, `packages/contracts/process-change/**` and `packages/contracts/decision-boundary/**` only through public exports. It must not modify Decision Boundary, process-versioning identity semantics, Release/Compiler/Runtime, or introduce WBS 18.3 process→system lineage/migration semantics.

`EvolutionRequestEvidence` compatibility is preserved: existing callers and serialized evidence remain valid. New integration is additive and fail-closed when invoked.

## Exit proof
TASK-404..408 complete serially with declared validations. Product proof demonstrates valid approved and rejected same-artifact change composition, canonical predecessor/diff/classification/rationale binding, human-only approval authority, preservation of existing evolution request behavior, and rejection of forged/mismatched/caller-supplied/Git/PR/model authority substitutions. Exact-head Deterministic CI + Heavy Product Tests must pass before Sprint Review/integration.
