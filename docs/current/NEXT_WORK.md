# Next Work — P13 Package 01 Planning Review / Construction A Gate

The repository is authoritative.

## Integrated truth
P12 is CLOSED and its closure is integrated through PR #235 at main merge `7c85da5c217f645f7968e62328dd7ec1d56dc237`. Closure head `d507934c58fd1f8b2e773d5c36f07a15d9d748c6` passed Deterministic CI #541; closure-head -> merge-main has zero file differences.

## Planning result
The authorized Planning & Materialization Sprint for `P13-PACKAGE-01 — Autonomous Runtime Functional Execution` has inventoried fresh-main runtime truth against WBS 13.1.1-13.1.3.

Coverage matrix:
- entities — MISSING;
- APIs — PARTIAL;
- actions — PARTIAL;
- workflows — MISSING;
- jobs — MISSING;
- events — MISSING;
- files — MISSING;
- integrations — MISSING;
- external configuration — DELIVERED foundation / PARTIAL breadth.

TASK-060, TASK-063 and P4-P10 runtime/state/deploy/configuration capabilities are predecessor evidence and are not repeated as new work.

Planning found no new L4 boundary. The current SystemDefinition does expose entities/actions/process states, but lacks explicit executable action effects and workflow transitions. This is recorded as the bounded L3 prerequisite for Construction A rather than inferred behavior.

## Materialized next Sprint
`P13-RUNTIME-CORE-EXECUTION-01` — COMMITTED / MATERIALIZED.

TASKs: TASK-212..220.

Goal: execute actual materialized entities/APIs/actions/workflows through:
`SystemDefinition -> Catalog -> Assembly -> Validation -> Compiler -> Release -> Artifact -> Deploy + external configuration -> autonomous Runtime`.

The Sprint must preserve Builder != Runtime, PostgreSQL durability, external activation-time bindings and no-value-leakage. TASK-212 is the only authorized shared-contract change and is additive L3. Any L4 requirement stops for ADR review.

## Required next action
1. Validate and review the Planning & Materialization PR on its exact head.
2. Confirm the diff contains only repository memory, planning manifests and task specifications; no product behavior.
3. If approved and green, merge the Planning Sprint.
4. Reconstruct fresh `main`.
5. Create `sprint/P13-RUNTIME-CORE-EXECUTION-01` from that exact integrated planning truth.
6. Execute TASK-212..220 in dependency order, one authoritative commit per TASK.
7. Run repository-wide final verification, produce the Sprint Report, open one Sprint Review PR and stop.

## Explicitly not next
Do not execute Construction B/C, Package Integration & Review, Documentation & Closure, `P13-PACKAGE-02` or `P13-PACKAGE-03` before their own predecessor/revalidation gates.

## Governance boundaries
Keep `main` deliberately without GitHub branch protection/required checks during the current phase unless an explicit future maturity gate supersedes this decision. Do not add a new general validation workflow, duplicate general `push: main`, premature `merge_group` or mandatory PR-heavy gate.
