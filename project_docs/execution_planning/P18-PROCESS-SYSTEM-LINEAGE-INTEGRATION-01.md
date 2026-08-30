# P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01 — Construction B

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P18-PACKAGE-03 — Process-to-System Version Lineage & Historical Traceability`
Base: `294c348271f3efc416c71ecef7e2329c63128d97`
WBS: 18.3.1–18.3.3

## Goal
Integrate the canonical process-to-system lineage truth produced by Construction A with representative existing `packages/release/**` and `packages/deploy/**` consumer paths, using public process-versioning contracts without duplicating lineage semantics or creating new release/deployment authority.

## Fresh-main evidence
Construction A TASK-409..413 is integrated in fresh `main` by PR #497 / merge `294c348271f3efc416c71ecef7e2329c63128d97`. Its public contract layer already provides deterministic process revision -> analysis -> definition -> release -> deployment lineage and historical query semantics. Existing release and deploy modules remain the representative software materialization consumers selected by the Package forecast.

## TASK chain
`TASK-414 -> TASK-415 -> TASK-416 -> TASK-417 -> TASK-418`

- TASK-414 — add an additive Release-side lineage admission/composition seam that consumes canonical process-versioning public APIs and binds a real Release identity to a validated SystemDefinition lineage hop.
- TASK-415 — add an additive Deploy-side lineage admission/composition seam that binds an existing deployment identity to the validated canonical Release lineage without changing deployment execution semantics.
- TASK-416 — expose a representative historical trace/query composition through the real Release/Deploy consumer seams using the canonical process-versioning query rather than reimplementing lineage truth.
- TASK-417 — prove compatibility and fail-closed behavior across the real consumer seams, including forged, missing, cross-artifact, duplicate/conflicting and Git/PR/model authority substitutions.
- TASK-418 — close Construction B with an integrated growing proof and Sprint Report using actual predecessor module APIs and the real Release/Deploy consumer seams.

## Boundaries
This Construction may modify `packages/release/**`, `packages/deploy/**`, focused product tests, this manifest/report and TASK specs. It consumes `packages/contracts/process-versioning/**`, BusinessRecipe/SystemAnalysis/SystemDefinition contracts and existing release/deploy public surfaces through public exports. It must not modify canonical process-versioning semantics, Decision Boundary, Runtime, Compiler, Builder/Runtime topology, deployment execution authority, persistence topology or storage architecture.

All integration is additive/backward-compatible. Existing release/deploy callers remain valid. Git commits, PRs, model/classifier output and ADR evidence remain non-authoritative metadata and cannot substitute business version, release or deployment lineage identifiers.

## Exit proof
TASK-414..418 complete serially with declared validations. Product proof demonstrates at least one real repository path that emits/consumes the canonical full lineage and historical query through actual Release/Deploy APIs, preserves existing behavior, and fails closed on forged or substituted lineage. Exact-head Deterministic CI + Heavy Product Tests must pass before Sprint Review/integration.
