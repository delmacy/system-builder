# Current Execution Milestone — M15 Deterministic / Human / Probabilistic Boundary

M13 Autonomous Runtime and M14 Evidence & Provenance remain CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## Active Planning Gate
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails`
Primary WBS: 15.1.1-15.2.3.
Status: PLANNING / CONSTRUCTION A MATERIALIZED.
Planning base: `6222cc42af1db9fed0b20666ff9057644b9b5f30`.

Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` is COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-298..304. It establishes the bounded category/metadata/risk/guard foundation only; no product execution may begin until this planning head passes required exact-head CI/Heavy gates and is integrated.

Construction B `P15-DECISION-BOUNDARY-ENFORCEMENT-01` remains FORECAST / NOT MATERIALIZED. Construction C is optional and evidence-gated. WBS 15.3.1-15.3.3 remains outside this package and forecast-only.

## Milestone intent
Make decision nature explicit and auditable: deterministic guarantees remain deterministic, human-reserved authority cannot be impersonated by inference, and probabilistic decisions carry explicit confidence/model context and cannot silently control deterministic invariants.

## Current gate
Complete Planning & Materialization exact-head validation and merge. After fresh-main reconstruction, execute only the committed Construction A TASK-298..304 in dependency order.

## Boundaries
ADR-0010 remains authoritative for durable human approval; existing authorization semantics remain separate. Decision classification/provenance is not authorization. No mandatory AI/provider, provider registry, secret material, model invocation, storage topology, Runtime Audit Trail replacement or undeclared L4 change is authorized. TD-P13-01..04 remain carried and unabsorbed.
