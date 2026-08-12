# WBS — 16 AI Gateway

## 16.0 AI Gateway
### 16.1 Abstração de providers
- **16.1.1** Definir interface comum de model request/response.
- **16.1.2** Implementar adapters sem vazar IDs de provider nos contracts core.
- **16.1.3** Declarar capabilities/limits dos modelos.
### 16.2 Governança de execução
- **16.2.1** Definir routing, budget/quota e fallback policies.
- **16.2.2** Validar structured outputs contra schemas.
- **16.2.3** Registrar model/version/cost/provenance quando permitido.
### 16.3 Segurança e observação
- **16.3.1** Aplicar data/knowledge boundary antes do envio.
- **16.3.2** Controlar secrets/provider credentials fora de artifacts.
- **16.3.3** Medir qualidade, falhas e custo por uso.