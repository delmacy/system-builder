# WBS — 37 Dependency & Impact Graph

## 37.0 Dependency & Impact Graph
### 37.1 Graph model
- **37.1.1** Definir node identities/types e edge semantics.
- **37.1.2** Diferenciar depends-on, implements, tests, derives-from e deployed-as.
- **37.1.3** Versionar graph observations/references.
### 37.2 Graph population
- **37.2.1** Ingerir trace links de Recipe→Analysis→Definition→Assembly.
- **37.2.2** Ingerir test/release/deployment relationships.
- **37.2.3** Detectar dangling/missing/ambiguous links.
### 37.3 Impact analysis
- **37.3.1** Traversal downstream/upstream com edge-aware rules.
- **37.3.2** Classificar direct/indirect/uncertain impact.
- **37.3.3** Emitir impact report para Change Governance/Validation.