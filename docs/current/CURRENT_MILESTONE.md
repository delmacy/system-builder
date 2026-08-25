# Current Execution Milestone — M15 Deterministic / Human / Probabilistic Boundary

M13 Autonomous Runtime and M14 Evidence & Provenance remain CLOSED. WBS 14.1.1-14.3.3 remains SATISFIED / CLOSED.

## Active Work Package
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails`
Primary WBS: 15.1.1-15.2.3.
Status: ACTIVE / CONSTRUCTION A INTEGRATED / CONSTRUCTION B MATERIALIZED.

Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` / TASK-298..304 integrated as `8d0ea6035ef9470b640c096d06d9409a6c7fc137` after exact-head Deterministic CI #799 and Heavy Product Tests #229 passed. Reviewed-head and merge-main tree are identical at `0740bc2145a1b66e713dda16ac3b70c89d8cc5fe`.

Fresh-main revalidation proved the forecast real-path enforcement gap. Construction B `P15-DECISION-BOUNDARY-ENFORCEMENT-01` / TASK-305..308 is COMMITTED / MATERIALIZED / NOT EXECUTED and targets only additive projection/proof across durable human approval, package authorization and authority closure.

Construction C remains OPTIONAL / NOT MATERIALIZED. WBS 15.3.1-15.3.3 / P15-PACKAGE-02 remains outside this Package and forecast-only.

## Current gate
Finish Construction B materialization exact-head CI/Heavy validation and integrate it. Then reconstruct fresh main and execute TASK-305..308 in dependency order, one authoritative commit per TASK.

## Boundaries
ADR-0010 and existing authorization semantics remain authoritative; decision classification/provenance is not authorization. No mandatory AI/provider/model invocation, provider registry, secrets, storage topology, Runtime Audit Trail replacement, policy-engine replacement, WBS 15.3 or undeclared L4 change. TD-P13-01..04 remain carried and unabsorbed.
