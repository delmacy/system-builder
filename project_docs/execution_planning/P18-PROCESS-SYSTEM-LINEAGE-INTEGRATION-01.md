# P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01 — Construction B

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P18-PACKAGE-03 — Process-to-System Version Lineage & Historical Traceability`
Base: `294c348271f3efc416c71ecef7e2329c63128d97`
WBS: 18.3.1–18.3.3

## Goal
Integrate the canonical process→system lineage truth delivered by Construction A through representative existing System Definition, Release and Deploy consumer seams, proving one real repository path can emit/consume the full historical lineage without duplicating identity semantics or granting Git/PR/model metadata business authority.

## Representative seams
Construction B may use existing public APIs under `packages/release/**`, `packages/deploy/**` and the existing SystemDefinition/analysis contract surfaces as consumers/context. `packages/contracts/process-versioning/**` remains the canonical lineage owner and is read-only unless a bounded compatibility defect is proven and separately authorized by an existing TASK path.

## TASK chain
`TASK-414 -> TASK-415 -> TASK-416 -> TASK-417 -> TASK-418`.

- TASK-414 — add an additive Release-side lineage admission/composition seam consuming canonical definition→release lineage identities.
- TASK-415 — add an additive Deploy-side lineage admission/composition seam consuming canonical release→deployment lineage identities.
- TASK-416 — compose a representative process revision→analysis→definition→release→deployment path using actual public predecessor APIs and reject mismatched identities.
- TASK-417 — expose deterministic historical lookup/verification through the representative consumer path while preserving existing Release/Deploy behavior.
- TASK-418 — extend the growing product proof across WBS 18.1→18.2→18.3 and produce the Sprint Report with bypass-resistant negatives.

## Boundaries
- Additive/backward-compatible integration only; existing Release/Deploy callers and serialized data remain valid.
- No change to release/deployment execution authority, side effects, storage topology, Builder/Runtime topology or Decision Boundary semantics.
- Canonical M15 `human-decision` remains business authority; Git SHA, PR, model/classifier or ADR metadata cannot substitute for process/release/deployment identity or approval.
- No WBS 18.1/18.2 reopening and no unrelated finding/TD absorption.
- Any L4 requirement stops for ADR/change control.

## Exit proof
TASK-414..418 complete serially with declared validations. Product evidence must demonstrate at least one real existing consumer path using canonical lineage end-to-end, complete historical lookup by process revision, preservation of existing Release/Deploy behavior, and fail-closed rejection of forged/mismatched/missing lineage identities and metadata-authority substitution. Repository-wide verification and exact-head Deterministic CI + Heavy Product Tests must pass before Sprint Review/integration.