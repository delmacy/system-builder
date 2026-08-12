# WBS — 31 Audit Trail

## 31.0 Audit Trail
### 31.1 Audit event model
- **31.1.1** Definir actor/action/target/context/correlation.
- **31.1.2** Definir before/after ou references sem expor segredo desnecessário.
- **31.1.3** Definir timestamp, reason e provenance/integrity metadata.
### 31.2 Capture e persistence
- **31.2.1** Integrar hooks em actions/workflows/auth/admin paths.
- **31.2.2** Garantir append-only/tamper-evident semantics adequadas.
- **31.2.3** Aplicar retention/access policies.
### 31.3 Consulta e prova
- **31.3.1** Consultar por actor/target/process/time/correlation.
- **31.3.2** Exportar evidência de auditoria de modo controlado.
- **31.3.3** Testar completude em operações críticas.