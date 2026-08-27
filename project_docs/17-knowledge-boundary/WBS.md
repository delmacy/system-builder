# WBS — 17 Knowledge Boundary

## 17.0 Knowledge Boundary
### 17.1 Classificação
Status: ACTIVE via `P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation`.
- **17.1.1** Definir classes de conhecimento/dados e ownership. — CONSTRUCTION A CORRECTED / INTEGRATED
- **17.1.2** Definir regras de classificação manual/assistida. — CONSTRUCTION A CORRECTED / INTEGRATED + CONSTRUCTION B CONSUMER INTEGRATION
- **17.1.3** Registrar purpose/use restrictions relevantes. — CONSTRUCTION A CORRECTED / INTEGRATED + CONSTRUCTION B CONSUMER INTEGRATION

Planning & Materialization integrated via PR #427 as `ef01f54c30ac5dabe9be54150a5e25a232211304` after exact-head Deterministic CI #978 / Heavy Product Tests #421 PASS.

Construction A `P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01` integrated via PR #428. TASK-362 corrected the post-integration human-authority gap through PR #432: final classification decisions verify the existing M15 Decision Boundary with `expectedCategory: "human-decision"`, require `decisionActorRef === authorityRef`, and reject deterministic/probabilistic substitution.

Construction B `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01` integrated via PR #435 as main `ed8f394114711793b170f18bd9ddda7abf9cb11e` after exact-head Deterministic CI #1000 PASS / Heavy Product Tests #446 PASS. Its pre-TASK-364 conformance correction preserves canonical `humanAuthority` in payload-minimal projections and requires standalone normalization to re-verify the corrected M15-backed classification decision. Representative manual and assisted evidence-facing consumers are integrated; assisted proposal metadata remains non-authoritative.

Construction C remains OPTIONAL / EVIDENCE-GATED / NOT MATERIALIZED pending fresh-main post-Construction-B revalidation. Do not infer Construction C authority without a demonstrated residual bounded WBS 17.1 gap.

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

Do not infer WBS 17.2/17.3 authority from corrected/integrated WBS 17.1 work. Forecast is not execution authority.
