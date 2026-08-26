# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. M13 Autonomous Runtime and M14 Evidence & Provenance are CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## M15 Deterministic / Human / Probabilistic Boundary — ACTIVE
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` covers WBS 15.1.1-15.2.3.

Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` / TASK-298..304 is COMPLETE / INTEGRATED as `8d0ea6035ef9470b640c096d06d9409a6c7fc137`. Construction B `P15-DECISION-BOUNDARY-ENFORCEMENT-01` / TASK-305..308 is COMPLETE / INTEGRATED as `09eea027142d071349dce5523905768fbebce548`; reviewed head `421be2fdf65f21bbd6fc5f534a3d520f13cae342` passed Deterministic CI #813 and Heavy Product Tests #243 and has the same tree `52e81cce0b6fe24512ac982bc7ca2e8ea8d9efb2` as merge-main.

Fresh-main post-Construction-B evidence finds no residual Package Goal gap. The canonical decision taxonomy/metadata/guards are integrated and the representative real governance paths identified by the post-Construction-A revalidation now expose the boundary without manufacturing approval or execution authority. Construction C is therefore NOT REQUIRED / NOT MATERIALIZED.

The next eligible stage is `P15-PACKAGE-01` Package Integration & Review after this revalidation is integrated. It must be a review/regression stage only; it may not absorb delayed product scope. `P15-PACKAGE-02` / WBS 15.3.1-15.3.3 remains outside this Package and forecast-only.

## Security and architecture boundary
Decision classification is not execution authority. Probabilistic output cannot silently satisfy deterministic invariants or human-reserved decisions. ADR-0010 durable human approval and existing authorization semantics remain authoritative. Evidence/provenance remains traceability, not authorization. No remote provider/model invocation, provider registry, secret material, mandatory AI, storage topology, Runtime Audit Trail replacement, policy-engine replacement or undeclared L4 architecture change is authorized.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by P15 work.
