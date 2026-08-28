# WBS — 18 Process Versioning

## 18.0 Process Versioning
### 18.1 Identidade e revision model — CLOSED
- **18.1.1** Definir artifact identity vs revision/version. — SATISFIED / INTEGRATED / CLOSED
- **18.1.2** Impedir sobrescrita de versões publicadas. — SATISFIED / INTEGRATED / CLOSED
- **18.1.3** Definir supersedes/deprecated/archived semantics. — SATISFIED / INTEGRATED / CLOSED

Evidence: P18-PACKAGE-01 Construction A `P18-PROCESS-VERSION-IDENTITY-CONTRACT-01`, Construction B `P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01`, post-B revalidation, Package Integration & Review and Documentation & Closure. Final closure head `98fb7e34cba846f2be8fd301eb2a4395a28e3bb4` passed Deterministic CI #1123 / Heavy Product Tests #583 and merged as `1f08c4d8b8a15099f39bcb46412a41a402a69131` with zero reviewed-head -> merge-main changed files.

### 18.2 Mudança semântica — FORECAST / NOT MATERIALIZED
- **18.2.1** Calcular/representar diff de processos/regras.
- **18.2.2** Classificar breaking/non-breaking quando aplicável.
- **18.2.3** Registrar reason/approval/evidence da mudança.
### 18.3 Linha processo→sistema — FORECAST / NOT MATERIALIZED
- **18.3.1** Ligar Recipe versions a Analysis/Definition.
- **18.3.2** Ligar Definitions a releases/deployments.
- **18.3.3** Consultar histórico completo por versão.