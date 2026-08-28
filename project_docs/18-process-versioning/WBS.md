# WBS — 18 Process Versioning

## 18.0 Process Versioning
### 18.1 Identidade e revision model — CLOSED
- **18.1.1** Definir artifact identity vs revision/version. — SATISFIED / INTEGRATED / CLOSED
- **18.1.2** Impedir sobrescrita de versões publicadas. — SATISFIED / INTEGRATED / CLOSED
- **18.1.3** Definir supersedes/deprecated/archived semantics. — SATISFIED / INTEGRATED / CLOSED

Evidence: P18-PACKAGE-01 Construction A `P18-PROCESS-VERSION-IDENTITY-CONTRACT-01`, Construction B `P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01`, post-B revalidation, Package Integration & Review and Documentation & Closure. Final canonical CLOSED-state reconciliation merged as fresh main `e205683422907edf8c27f99c01aab317cca3f66c`.

### 18.2 Mudança semântica — ACTIVE PLANNING / CONSTRUCTION A MATERIALIZED NOT EXECUTED
- **18.2.1** Calcular/representar diff de processos/regras.
- **18.2.2** Classificar breaking/non-breaking quando aplicável.
- **18.2.3** Registrar reason/approval/evidence da mudança.

Planning authority: `P18-PACKAGE-02 — Semantic Process Change Classification & Approval Evidence`. Construction A `P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01` / TASK-399..403 is materialized but may not execute before Planning exact-head gates, integration and fresh-main revalidation.

### 18.3 Linha processo→sistema — FORECAST / NOT MATERIALIZED
- **18.3.1** Ligar Recipe versions a Analysis/Definition.
- **18.3.2** Ligar Definitions a releases/deployments.
- **18.3.3** Consultar histórico completo por versão.