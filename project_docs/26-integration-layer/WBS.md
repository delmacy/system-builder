# WBS — 26 Integration Layer

## 26.0 Integration Layer
### 26.1 Contract e adapters
- **26.1.1** Definir connector/provider-neutral contracts.
- **26.1.2** Implementar adapters para API/webhook/queue/file/DB.
- **26.1.3** Modelar mappings/version compatibility.
### 26.2 Execution semantics
- **26.2.1** Implementar auth/secret references e connection lifecycle.
- **26.2.2** Implementar retry, timeout, idempotency e DLQ/error paths.
- **26.2.3** Preservar correlation IDs e observability.
### 26.3 Legacy coexistence
- **26.3.1** Suportar sync/read-through/write-through quando aprovado.
- **26.3.2** Definir ownership/source-of-truth durante transição.
- **26.3.3** Provar integração antes de exigir cutover.