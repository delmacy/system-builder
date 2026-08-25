# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. M13 Autonomous Runtime and M14 Evidence & Provenance are CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## M15 Deterministic / Human / Probabilistic Boundary — PLANNING & MATERIALIZATION
Fresh-main planning base: `6222cc42af1db9fed0b20666ff9057644b9b5f30`.

The user explicitly authorized the next fresh-main Planning & Materialization cycle and all required approvals within the resulting bounded cycle. Baseline authority identifies WBS 15 as the unique immediate successor foundation: make deterministic, human-reserved and probabilistic decision nature explicit and prevent probabilistic output from silently governing deterministic guarantees or human-reserved authority.

`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` is PLANNING / CONSTRUCTION A MATERIALIZED and covers WBS 15.1.1-15.2.3.

Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` is COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-298..304. It may execute only after the Planning & Materialization PR passes exact-head gates and is integrated into `main`.

Construction B `P15-DECISION-BOUNDARY-ENFORCEMENT-01` remains FORECAST / NOT MATERIALIZED. Construction C remains OPTIONAL / NOT MATERIALIZED. `P15-PACKAGE-02` for WBS 15.3.1-15.3.3 is forecast-only and requires a separate fresh-main successor planning cycle after P15-PACKAGE-01 closure.

## Security and architecture boundary
Decision classification is not execution authority. Probabilistic output cannot silently satisfy deterministic invariants or human-reserved decisions. ADR-0010 durable human approval and existing authorization semantics remain authoritative and are not weakened/replaced. Evidence/provenance remains traceability, not authorization. No remote provider/model invocation, provider registry, secret material, mandatory AI, storage topology, Runtime Audit Trail replacement or undeclared L4 architecture change is authorized by planning.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by P15 planning.
