# WBS — 17 Knowledge Boundary

## 17.0 Knowledge Boundary
### 17.1 Classificação
Status: ACTIVE via `P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation`.
- **17.1.1** Definir classes de conhecimento/dados e ownership. — CONSTRUCTION A CORRECTED / INTEGRATED
- **17.1.2** Definir regras de classificação manual/assistida. — CONSTRUCTION A CORRECTED / INTEGRATED
- **17.1.3** Registrar purpose/use restrictions relevantes. — CONSTRUCTION A CORRECTED / INTEGRATED

Planning & Materialization integrated via PR #427 as `ef01f54c30ac5dabe9be54150a5e25a232211304` after exact-head Deterministic CI #978 / Heavy Product Tests #421 PASS.

Construction A `P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01` integrated via PR #428. A post-integration conformance review found that actor/reference presence could substitute for explicit human authority. TASK-362 corrected this within WBS 17.1.2 through PR #432: final classification decisions verify the existing M15 Decision Boundary with `expectedCategory: "human-decision"`, require `decisionActorRef === authorityRef`, and reject deterministic/probabilistic substitution. PR #432 passed exact-head Deterministic CI #990 / Heavy Product Tests #435 and integrated as `9a14c7bed8a45f5ff5a4fd39515aa3e9cef6581d` with zero reviewed-head-to-main file differences.

Construction B `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01` remains FORECAST / NOT MATERIALIZED pending fresh-main evidence of a bounded WBS 17.1 consumer-integration gap. Construction C remains OPTIONAL / FORECAST and evidence-gated.

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

Do not infer WBS 17.2/17.3 authority from the corrected/integrated WBS 17.1 Construction A. Forecast is not execution authority.
