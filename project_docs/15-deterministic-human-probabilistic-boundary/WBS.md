# WBS — 15 Decision Boundary

## 15.0 Deterministic / Human / Probabilistic Boundary
### 15.1 Taxonomia — SATISFIED / INTEGRATED in P15-PACKAGE-01
- **15.1.1** Definir categorias deterministic, human-decision e probabilistic — SATISFIED / INTEGRATED.
- **15.1.2** Definir metadata obrigatória por categoria — SATISFIED / INTEGRATED.
- **15.1.3** Definir critérios de risco/criticidade para classificação — SATISFIED / INTEGRATED.
### 15.2 Enforcement — SATISFIED / INTEGRATED in P15-PACKAGE-01
- **15.2.1** Impedir probabilistic output em invariantes sem gate explícito — SATISFIED / INTEGRATED.
- **15.2.2** Preservar human approval/authority boundaries — SATISFIED / INTEGRATED.
- **15.2.3** Registrar confidence/model context quando inferência for usada — SATISFIED / INTEGRATED.

`P15-PACKAGE-01-INTEGRATION-REVIEW-01` finds 15.1.1-15.2.3 complete, integrated and regression-ready for Documentation & Closure, contingent on exact-head review validation.

### 15.3 Verificação — FORECAST / OUTSIDE P15-PACKAGE-01
- **15.3.1** Criar architecture/contract checks aplicáveis.
- **15.3.2** Testar fallback e indisponibilidade do provider.
- **15.3.3** Auditar decisões críticas por categoria.
