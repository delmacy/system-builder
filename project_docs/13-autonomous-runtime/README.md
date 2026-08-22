# 13 — Autonomous Runtime

**Objetivo:** executar o sistema cliente de forma autônoma, sem chamadas obrigatórias ao System Builder durante operação normal.

Documentos: [escopo](scope/README.md) · [WBS](WBS.md).

## Forecast de Work Packages

Após P12 ser fechado, M13 está decomposto em três Work Packages concretos de forecast sob a cadência vigente:

1. `P13-PACKAGE-01` — **Autonomous Runtime Functional Execution** — WBS 13.1.1-13.1.3;
2. `P13-PACKAGE-02` — **Autonomous Runtime Identity, Authority & Generated Experience** — WBS 13.2.1-13.2.3;
3. `P13-PACKAGE-03` — **Autonomous Runtime Operational Autonomy** — WBS 13.3.1-13.3.3.

Cada pacote segue:

`Planning & Materialization -> Construction A -> Construction B -> [optional Construction C] -> Package Integration & Review -> Documentation & Closure`.

Os três documentos são forecast, não autorização de execução. A Planning Sprint de cada pacote deve reconstruir `main`, confrontar a WBS com a implementação real e tratar capacidades já entregues em fases anteriores como predecessor evidence, evitando duplicação de trabalho.

## Existing autonomy evidence

M13 não começa do zero. Entregas anteriores já provam partes importantes de startup autônomo, deploy local, estado durável, health e release/deploy lifecycle. Os novos pacotes devem fechar apenas os gaps restantes até o critério de conclusão do domínio: desligar o Builder não interrompe login, APIs, DB, workflows, jobs ou integrações do cliente.
