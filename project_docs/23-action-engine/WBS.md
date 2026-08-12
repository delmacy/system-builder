# WBS — 23 Action Engine

## 23.0 Action Engine
### 23.1 Contract model
- **23.1.1** Definir identity/version/input/output/error schemas.
- **23.1.2** Declarar side effects, permissions e dependencies.
- **23.1.3** Definir idempotency/transaction expectations.
### 23.2 Execution runtime
- **23.2.1** Resolver handler/provider e validar contexto.
- **23.2.2** Executar ação com retry/timeout policies.
- **23.2.3** Emitir domain/technical events e resultado tipado.
### 23.3 Quality and reuse
- **23.3.1** Criar test contract e fixtures por action.
- **23.3.2** Expor metadata ao Software Catalog.
- **23.3.3** Medir failures/latency/usage sem acoplar business logic.