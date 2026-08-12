# WBS — 36 Schema & Contract Evolution

## 36.0 Schema & Contract Evolution
### 36.1 Compatibility model
- **36.1.1** Definir backward/forward/support range semantics.
- **36.1.2** Classificar schema changes por impacto/version bump.
- **36.1.3** Definir tratamento de unknown optional/required extensions.
### 36.2 Migration engine
- **36.2.1** Registrar migration transforms version-to-version.
- **36.2.2** Criar nova artifact revision sem sobrescrever published input.
- **36.2.3** Preservar unknown compatible data losslessly.
### 36.3 Validation e lifecycle
- **36.3.1** Gerar compatibility matrix/tests/fixtures.
- **36.3.2** Aplicar deprecation/end-of-support policies.
- **36.3.3** Emitir evidence de migration/compatibility decision.