# Project State

Date: 2026-08-26

`delmacy/system-builder` is canonical. M13 Autonomous Runtime and M14 Evidence & Provenance are CLOSED. `P14-PACKAGE-01` and `P14-PACKAGE-02` remain CLOSED; WBS 14.1.1-14.3.3 is SATISFIED / CLOSED.

## M15 Deterministic / Human / Probabilistic Boundary
`P15-PACKAGE-01 — Decision Classification & Authority Guardrails` / WBS 15.1.1-15.2.3 is CLOSED on canonical main.

`P15-PACKAGE-02 — Decision Boundary Verification & Auditability` / WBS 15.3.1-15.3.3 is CLOSED on canonical main. Construction A and B are COMPLETE / SPRINT REVIEW PASS / INTEGRATED; Construction C is NOT REQUIRED / NOT MATERIALIZED.

Package Integration & Review head `f1df8143d7c622aa0e1d4d662aaef8b5a46504c9` passed Deterministic CI #846 and Heavy Product Tests #280 and integrated as `3824357c4f0c50e35e7fdd9902ef87639c196958`.

Documentation & Closure head `27fcddbb8364e921c7a9a934eeb3d77f3032e7d6` passed Deterministic CI #847 and Heavy Product Tests #281 and integrated via PR #373 as `1fd84fc3ad912fd84218d0be152010b793910b9e`. Closure head and merge-main share exact tree `14078ff718984ea5ce299263d40ef71d7a926aab`.

## Security and architecture boundary
Decision verification/audit/availability/fallback evidence is not approval or execution authority. ADR-0010 and existing authorization semantics remain authoritative. No mandatory remote AI/provider/model execution, provider registry, secret material, storage topology, Runtime Audit Trail replacement, policy-engine replacement or undeclared L4 architecture change is authorized.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by P15-PACKAGE-02.
