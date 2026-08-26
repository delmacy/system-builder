# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. M13 Autonomous Runtime and M14 Evidence & Provenance are CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## M15 Deterministic / Human / Probabilistic Boundary — ACTIVE / PACKAGE 01 CLOSED
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` covers WBS 15.1.1-15.2.3 and is CLOSED.

Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` / TASK-298..304 is COMPLETE / INTEGRATED as `8d0ea6035ef9470b640c096d06d9409a6c7fc137`. Construction B `P15-DECISION-BOUNDARY-ENFORCEMENT-01` / TASK-305..308 is COMPLETE / INTEGRATED as `09eea027142d071349dce5523905768fbebce548`; reviewed head `421be2fdf65f21bbd6fc5f534a3d520f13cae342` passed Deterministic CI #813 and Heavy Product Tests #243 and shares tree `52e81cce0b6fe24512ac982bc7ca2e8ea8d9efb2` with merge-main.

Post-Construction-B fresh-main revalidation integrated as `bdfc55135505aa4746513643e459652f4e0b3f31` after Deterministic CI #814 and Heavy Product Tests #245, confirming no residual Package Goal gap. Construction C is NOT REQUIRED / NOT MATERIALIZED.

Package Integration & Review head `c95880732f6cc1d66e31038237ff6d6c832a2f73` passed Deterministic CI #815 and Heavy Product Tests #246 with no blocking reviews/threads and integrated as `3f899ef5120bc1ee39b1793becec32aaa53ba0bd`; reviewed-head -> merge-main has zero file differences.

Documentation & Closure head `831da3cb2b77bc5677bf20ca58d0b13336daaa0a` passed Deterministic CI #816 and Heavy Product Tests #247 with no blocking reviews/threads and integrated as `77bff057465bb537dda296ed80c084ee88007c9f`. Closure-head -> merge-main has zero file differences. WBS 15.1.1-15.2.3 is SATISFIED / CLOSED and `P15-PACKAGE-01` is canonically CLOSED.

## Security and architecture boundary
Decision classification is not execution authority. ADR-0010 durable human approval and existing authorization semantics remain authoritative. Evidence/provenance remains traceability, not authorization. No remote provider/model invocation, provider registry, secret material, mandatory AI, storage topology, Runtime Audit Trail replacement, policy-engine replacement or undeclared L4 architecture change is authorized.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by P15 work.

## Successor boundary
`P15-PACKAGE-02` / WBS 15.3.1-15.3.3 remains forecast-only and outside the authority of the closed Package. A separate fresh-main Planning & Materialization authority/gate is required before successor execution.
