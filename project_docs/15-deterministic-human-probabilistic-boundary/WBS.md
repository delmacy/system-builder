# WBS — 15 Decision Boundary

## 15.0 Deterministic / Human / Probabilistic Boundary
### 15.1 Taxonomia — SATISFIED / CLOSED in P15-PACKAGE-01
- **15.1.1** Definir categorias deterministic, human-decision e probabilistic — SATISFIED / CLOSED.
- **15.1.2** Definir metadata obrigatória por categoria — SATISFIED / CLOSED.
- **15.1.3** Definir critérios de risco/criticidade para classificação — SATISFIED / CLOSED.
### 15.2 Enforcement — SATISFIED / CLOSED in P15-PACKAGE-01
- **15.2.1** Impedir probabilistic output em invariantes sem gate explícito — SATISFIED / CLOSED.
- **15.2.2** Preservar human approval/authority boundaries — SATISFIED / CLOSED.
- **15.2.3** Registrar confidence/model context quando inferência for usada — SATISFIED / CLOSED.

P15-PACKAGE-01 is canonically CLOSED on main.

### 15.3 Verificação — ACTIVE / P15-PACKAGE-02
- **15.3.1** Criar architecture/contract checks aplicáveis — SATISFIED / INTEGRATED via Construction A `P15-DECISION-BOUNDARY-VERIFICATION-01` / TASK-309..312; final Package closure remains subject to package-level gates.
- **15.3.2** Testar fallback e indisponibilidade do provider — COMMITTED / MATERIALIZED via Construction B `P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01` / TASK-313..316; not yet executed.
- **15.3.3** Auditar decisões críticas por categoria — Construction A foundation SATISFIED / INTEGRATED; residual real-path/resilience audit proof COMMITTED / MATERIALIZED in Construction B TASK-315..316; not yet executed.

`P15-PACKAGE-02 — Decision Boundary Verification & Auditability` is the bounded WBS 15.3 delivery Package. Construction A is integrated. Construction B is the active committed/materialized Construction Sprint after fresh-main evidence proved the residual gap. Construction C remains optional/forecast/evidence-gated and is not execution authority. TD-P13-01..04 remain carried and unabsorbed.
