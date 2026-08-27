# WBS — 17 Knowledge Boundary

## 17.0 Knowledge Boundary
### 17.1 Classificação
Status: COMMITTED / PLANNING & MATERIALIZATION INTEGRATED via `P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation`.
- **17.1.1** Definir classes de conhecimento/dados e ownership. — MATERIALIZED IN CONSTRUCTION A
- **17.1.2** Definir regras de classificação manual/assistida. — MATERIALIZED IN CONSTRUCTION A
- **17.1.3** Registrar purpose/use restrictions relevantes. — MATERIALIZED IN CONSTRUCTION A

Planning & Materialization integrated via PR #427 as `ef01f54c30ac5dabe9be54150a5e25a232211304` after exact-head Deterministic CI #978 / Heavy Product Tests #421 PASS.

Construction A `P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01` is COMMITTED / MATERIALIZED with TASK-355..361 and is the only executable construction scope. Construction B `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01` remains FORECAST / NOT MATERIALIZED. Construction C remains OPTIONAL / FORECAST and evidence-gated.

### 17.2 Enforcement
Status: FORECAST / NOT MATERIALIZED.
- **17.2.1** Aplicar isolamento em catalogs, telemetry e AI Gateway.
- **17.2.2** Impedir promotion de conteúdo proprietário não autorizado.
- **17.2.3** Preservar referências sem expor payload sensível.

### 17.3 Promotion control
Status: FORECAST / NOT MATERIALIZED.
- **17.3.1** Anonimizar/generalizar candidatos quando permitido.
- **17.3.2** Submeter candidato a revisão e testes de genericidade.
- **17.3.3** Registrar decisão de promotion/rejection e provenance.

Do not infer WBS 17.2/17.3 authority from the integrated WBS 17.1 Planning gate. Forecast is not execution authority.
