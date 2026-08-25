# Next Work — M14 Planning & Materialization Gate

Fresh-main authority selects M14 Evidence & Provenance as the successor planning horizon after M13 closure.

## Required next action
1. Validate the exact Planning & Materialization head for `P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` with Deterministic CI + Heavy Product Tests and no blocking review finding.
2. If unchanged and PASS, merge the planning PR with expected-head protection.
3. Reconstruct fresh `main` and verify planning-head -> merge-main tree equivalence.
4. Create `sprint/P14-EVIDENCE-PROVENANCE-CONTRACT-01` from the integrated planning main.
5. Execute committed TASK-267..273 in dependency order, beginning with TASK-267 only.
6. Do not promote Construction B until Construction A is integrated and fresh-main revalidation confirms the remaining propagation gap.

## Authority and boundaries
P14-PACKAGE-01 covers WBS 14.1.1-14.2.3 only. ADR-0009/artifact-envelope 1.0.0 predecessor semantics are preserved. WBS 14.3.1-14.3.3 remains forecast for successor P14 planning and is not execution authority.

Do not execute product work before planning integration, redesign core artifact-envelope semantics, replace Runtime Audit Trail, make provenance an authorization mechanism, require secret/provider/storage identifiers, absorb TD-P13-01..04, or execute Construction B/C merely because forecast.
