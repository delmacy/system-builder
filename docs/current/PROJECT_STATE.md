# Project State

Date: 2026-08-26

`delmacy/system-builder` is canonical. M13 Autonomous Runtime and M14 Evidence & Provenance are CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## M15 Deterministic / Human / Probabilistic Boundary
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` / WBS 15.1.1-15.2.3 is CLOSED on canonical main.

`P15-PACKAGE-02 — Decision Boundary Verification & Auditability` covers WBS 15.3.1-15.3.3 and is ACTIVE. Construction A `P15-DECISION-BOUNDARY-VERIFICATION-01` is COMPLETE / SPRINT REVIEW PASS / INTEGRATED as `67241892a545f4a7cdbf607aa4538bc7515228cf`. Post-Construction-A fresh-main revalidation integrated as `403c7e201a5a4fdf72807538697a4c3dbe63892a` and proves a bounded residual gap in WBS 15.3.2 plus representative real-path WBS 15.3.3 auditability.

Construction B `P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01` is now COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-313..316. It is limited to provider-neutral availability/unavailability evidence, explicit bounded fallback guarding, representative resilience audit proof and the integrated growing proof/Sprint report. Construction C remains OPTIONAL / FORECAST / NOT MATERIALIZED and may be promoted only after Construction B integration plus fresh-main evidence.

## Security and architecture boundary
Decision verification/audit/availability/fallback evidence is not approval or execution authority. ADR-0010 and existing authorization semantics remain authoritative. No mandatory remote AI/provider/model execution, provider registry, secret material, storage topology, Runtime Audit Trail replacement, policy-engine replacement or undeclared L4 architecture change is authorized. Provider unavailability/fallback work must remain provider-neutral and fail closed rather than fabricate deterministic/human authority.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by P15-PACKAGE-02.

## Current gate
Integrate Construction B Planning & Materialization only after exact-head Deterministic CI + Heavy Product Tests and no blocking review/head drift. After merge, reconstruct fresh `main`, verify tree equivalence, create `sprint/P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01`, and execute TASK-313 first in dependency order.
