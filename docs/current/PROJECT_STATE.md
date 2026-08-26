# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. M13 Autonomous Runtime and M14 Evidence & Provenance are CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## M15 Deterministic / Human / Probabilistic Boundary
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` / WBS 15.1.1-15.2.3 is CLOSED on canonical main.

`P15-PACKAGE-02 — Decision Boundary Verification & Auditability` covers WBS 15.3.1-15.3.3 and is in PLANNING / MATERIALIZATION. Fresh-main planning base is `21c20f8cde5b63c296e96819ec246b4ba4e66607` after canonical Package 01 closure.

Construction A `P15-DECISION-BOUNDARY-VERIFICATION-01` is COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-309..312. It establishes deterministic decision-boundary verification/architecture checks and the critical-decision audit projection foundation. Construction B `P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01` remains FORECAST and may be promoted only after Construction A integration plus fresh-main revalidation. Construction C remains optional/evidence-gated.

## Security and architecture boundary
Decision verification/audit evidence is not approval or execution authority. ADR-0010 and existing authorization semantics remain authoritative. No mandatory remote AI/provider/model execution, provider registry, secret material, storage topology, Runtime Audit Trail replacement, policy-engine replacement or undeclared L4 architecture change is authorized. Provider unavailability/fallback work must use existing provider-neutral seams and fail closed rather than fabricate deterministic/human authority.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by P15-PACKAGE-02.

## Current gate
Planning & Materialization must pass exact-head repository gates and integrate before Construction A TASK-309 may execute.