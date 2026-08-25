# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. M13 Autonomous Runtime and M14 Evidence & Provenance are CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## M15 Deterministic / Human / Probabilistic Boundary — ACTIVE
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` covers WBS 15.1.1-15.2.3.

Construction A `P15-DECISION-BOUNDARY-CONTRACT-01` / TASK-298..304 is COMPLETE / SPRINT REVIEW PASS / INTEGRATED. Reviewed head `5ba62ace798bf7cd17db181889db9af8e6b20592` passed Deterministic CI #799 and Heavy Product Tests #229 and integrated as `8d0ea6035ef9470b640c096d06d9409a6c7fc137`. Reviewed-head and merge-main tree are both `0740bc2145a1b66e713dda16ac3b70c89d8cc5fe`.

Fresh-main revalidation confirmed a real propagation gap on existing decision-bearing governance paths: durable human approval, package authorization and authority closure do not yet expose the integrated canonical decision boundary. Construction B `P15-DECISION-BOUNDARY-ENFORCEMENT-01` is therefore COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-305..308. It may execute only after its materialization PR passes exact-head gates and integrates to main.

Construction C remains OPTIONAL / NOT MATERIALIZED and may be promoted only after Construction B fresh-main evidence proves a bounded Package Goal gap. `P15-PACKAGE-02` / WBS 15.3.1-15.3.3 remains outside this Package and forecast-only.

## Security and architecture boundary
Decision classification is not execution authority. Probabilistic output cannot silently satisfy deterministic invariants or human-reserved decisions. ADR-0010 durable human approval and existing authorization semantics remain authoritative. Evidence/provenance remains traceability, not authorization. No remote provider/model invocation, provider registry, secret material, mandatory AI, storage topology, Runtime Audit Trail replacement, policy-engine replacement or undeclared L4 architecture change is authorized.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by P15 work.
