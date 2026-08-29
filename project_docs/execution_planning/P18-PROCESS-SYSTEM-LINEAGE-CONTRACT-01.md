# P18-PROCESS-SYSTEM-LINEAGE-CONTRACT-01 — Construction A

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: `P18-PACKAGE-03 — Process-to-System Version Lineage & Historical Traceability`
Base: `5a3612d20f30307ac2c0a2e70ca70dff034476d8`
WBS: 18.3.1–18.3.3

## Goal
Establish the minimum additive public lineage contract and deterministic proof needed to connect canonical process/Recipe revisions to System Analysis/SystemDefinition and onward to Release/Deployment identities, including complete fail-closed historical traceability by process revision.

## TASK chain
`TASK-409 -> TASK-410 -> TASK-411 -> TASK-412 -> TASK-413`

- TASK-409 — define provider-neutral lineage identity/hop descriptors anchored to canonical process revision identity.
- TASK-410 — validate Recipe/process revision -> System Analysis -> SystemDefinition lineage with exact artifact/revision binding.
- TASK-411 — validate SystemDefinition -> Release -> Deployment lineage using explicit software materialization identities without Git authority substitution.
- TASK-412 — compose/query complete process-to-system history deterministically with duplicate/conflict/missing-hop rejection.
- TASK-413 — growing product proof across WBS 18.1 -> 18.2 -> 18.3 with positive and bypass-resistant negative scenarios.

## Allowed architectural movement
Construction A may extend `packages/contracts/process-versioning/**` additively/backward-compatibly as explicit L3 work and may add a TypeScript alias only if required by real imports. Existing Business Recipe, System Analysis, System Definition, Release, Deploy and Decision Boundary surfaces are context/read-only authorities in this Sprint unless a TASK explicitly lists a narrower allowed path.

## Boundaries
- Consume WBS 18.1 canonical process artifact/revision identity; do not duplicate its identity model.
- WBS 18.2 approved-change evidence may be referenced in the growing proof but classification is not approval authority.
- No change to Decision Boundary, release/deployment execution semantics, Builder/Runtime topology, persistence/storage topology or deployment side effects.
- Git SHA may be evidence metadata where existing contracts already allow it, but cannot be the sole/canonical business process, definition, release or deployment lineage identity.
- No inferred L4; stop if the required linkage cannot be represented additively within existing boundaries.

## Exit proof
TASK-409..413 complete serially with declared validations. Product evidence demonstrates canonical full-chain composition and historical lookup, while forged cross-artifact links, reversed/missing hops, conflicting duplicates, unknown fields and Git/model/PR authority substitution fail closed. Repository-wide verification and exact-head CI/Heavy gates pass before Sprint Review/integration.