# WBS — 10 Deploy

## 10.0 Deploy
### 10.1 Environment model
- **10.1.1** Definir infraestrutura, runtime config e secret references.
- **10.1.2** Validar compatibilidade Release ↔ Environment.
- **10.1.3** Resolver parâmetros sem alterar o artefato.
### 10.2 Execução de deployment
- **10.2.1** Preparar migrations e dependências externas.
- **10.2.2** Implantar release e aplicar configuração.
- **10.2.3** Executar health/acceptance checks e rollback quando necessário.
### 10.3 Registro operacional
- **10.3.1** Registrar release, ambiente, timestamps e executor.
- **10.3.2** Registrar resultado/versão efetivamente ativa.
- **10.3.3** Publicar DeploymentRecord para Observe/operations.