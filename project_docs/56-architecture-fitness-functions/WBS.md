# WBS — 56 Architecture Fitness Functions

## 56.0 Architecture Fitness Functions
### 56.1 Rule inventory
- **56.1.1** Classificar invariantes document-only vs enforceable.
- **56.1.2** Priorizar Builder/Runtime, contract e dependency boundaries.
- **56.1.3** Ligar cada fitness function a ADR/architecture source.
### 56.2 Automated enforcement
- **56.2.1** Implementar import/dependency/package graph checks.
- **56.2.2** Implementar contract/schema/determinism/autonomy checks.
- **56.2.3** Integrar gates em local verify/CI sem false green.
### 56.3 Evolution
- **56.3.1** Versionar tests junto com architecture decisions.
- **56.3.2** Exigir ADR para alteração de L4 invariant.
- **56.3.3** Medir violations/drift e scanner blind spots.