# WBS — 15 Decision Boundary

## 15.0 Deterministic / Human / Probabilistic Boundary
### 15.1 Taxonomia
- **15.1.1** Definir categorias deterministic, human-decision e probabilistic.
- **15.1.2** Definir metadata obrigatória por categoria.
- **15.1.3** Definir critérios de risco/criticidade para classificação.
### 15.2 Enforcement
- **15.2.1** Impedir probabilistic output em invariantes sem gate explícito.
- **15.2.2** Preservar human approval/authority boundaries.
- **15.2.3** Registrar confidence/model context quando inferência for usada.
### 15.3 Verificação
- **15.3.1** Criar architecture/contract checks aplicáveis.
- **15.3.2** Testar fallback e indisponibilidade do provider.
- **15.3.3** Auditar decisões críticas por categoria.