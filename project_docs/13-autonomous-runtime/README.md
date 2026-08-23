# 13 — Autonomous Runtime

**Objetivo:** executar o sistema cliente de forma autônoma, sem chamadas obrigatórias ao System Builder durante operação normal.

Documentos: [escopo](scope/README.md) · [WBS](WBS.md).

## Work Package status

M13 está decomposto em três Work Packages sob a cadência vigente:

1. `P13-PACKAGE-01` — **Autonomous Runtime Functional Execution** — WBS 13.1.1-13.1.3 — **CLOSED**;
2. `P13-PACKAGE-02` — **Autonomous Runtime Identity, Authority & Generated Experience** — WBS 13.2.1-13.2.3 — **FORECAST / ELIGIBLE FOR PLANNING AFTER P13-01 CLOSURE + FRESH-MAIN REVALIDATION**;
3. `P13-PACKAGE-03` — **Autonomous Runtime Operational Autonomy** — WBS 13.3.1-13.3.3 — **FORECAST / NOT STARTED**.

Each package follows:

`Planning & Materialization -> Construction A -> Construction B -> [optional Construction C] -> Package Integration & Review -> Documentation & Closure`.

Forecast status is not execution authority. A Planning Sprint must reconstruct fresh `main`, reconcile WBS against implementation reality and treat already-delivered capability as predecessor evidence rather than duplicate work.

## P13 Package 01 closed outcome

WBS 13.1.1-13.1.3 is satisfied by integrated evidence. The generated/deployed Runtime executes entities/APIs/actions/workflows plus jobs/events/files/integrations from external reference-only configuration without requiring Builder during ordinary operation.

Package Review passed contracts/schema, passed architecture/security with explicit carried debt, found no critical blocker and confirmed Construction C was not justified.

Carried debt remains explicit for future planning: `TD-P13-01` job operational semantics, `TD-P13-02` HTTP timeout/response bounds, `TD-P13-03` file-storage hardening and `TD-P13-04` generated-runtime maintainability.

## Remaining M13 outcome

M13 is not complete. WBS 13.2 must still make the Runtime actor-aware and generated-experience capable, and WBS 13.3 must certify full operational autonomy/telemetry/upgrade-rollback for the complete Runtime.

The domain completion criterion remains: Builder unavailability must not interrupt login, APIs, DB, workflows, jobs or integrations of the client system.
