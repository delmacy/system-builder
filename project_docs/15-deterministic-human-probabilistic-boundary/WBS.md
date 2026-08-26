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

### 15.3 Verificação — ACTIVE PLANNING / P15-PACKAGE-02
- **15.3.1** Criar architecture/contract checks aplicáveis — COMMITTED via Construction A `P15-DECISION-BOUNDARY-VERIFICATION-01` / TASK-309..312.
- **15.3.2** Testar fallback e indisponibilidade do provider — FORECAST for Construction B after Construction A integration plus fresh-main revalidation.
- **15.3.3** Auditar decisões críticas por categoria — PARTIALLY COMMITTED foundation in Construction A; full real-path proof forecast for Construction B.

`P15-PACKAGE-02 — Decision Boundary Verification & Auditability` is authorized by the user as the bounded WBS 15.3 delivery Package. Construction A is the only committed/materialized Construction Sprint at this planning gate; Construction B remains forecast and Construction C optional/evidence-gated. TD-P13-01..04 remain carried and unabsorbed.