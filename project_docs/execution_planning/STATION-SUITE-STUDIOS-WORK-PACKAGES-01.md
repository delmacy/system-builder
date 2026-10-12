# Work Packages e dependências — Studios da suíte
Fase STATION-SUITE-STUDIOS-PHASE-01; base5f14c94314e15cebb6484b8498bc30ded626439c; Addendum018. Data2026-10-12 UTC.
22 pacotes: WP01 bounded CLOSED effective on validated TASK733 integration;21 candidatos FORECAST/PLANNED. Não são WPs anteriores WP1–WP16 renumerados. Alias amigável STUDIOS-WPnn; identificador formal por parent WBS e sequência conforme WBS_DICTIONARY.

## Mapa e DAG de capabilities
| Alias | Identificador formal | Entrega | Predecessores de capability/artifact | Prova de saída |
|---|---|---|---|---|
| STUDIOS-WP01 | WP-21.1.1-STUDIOS-A | Fundação compartilhada dos Studios | WP16 fechado + baseline Station/SDK; inputs/dono ready | Abrir duas áreas de domínio mantendo referências/seleção, alternar contexto sem misturar autoridade; owner indisponível preserva draft |
| STUDIOS-WP02 | WP-05.3.3-STUDIOS-A | Catalog Studio | STUDIOS-WP01; inputs/dono ready | Registrar/consultar uma entrada de cada catálogo; reutilizar versão explícita; duplicata/incompatível/acesso negado rejeitados |
| STUDIOS-WP03 | WP-01.3.3-STUDIOS-A | Mirror Studio | STUDIOS-WP01; inputs/dono ready | Mapear processo com fonte auditável, corrigir/reabrir revisão e expor lacuna; observação nunca vira aprovação normativa |
| STUDIOS-WP04 | WP-02.3.3-STUDIOS-A | Recipe Studio | STUDIOS-WP02, STUDIOS-WP03; inputs/dono ready | Propor/revisar/aprovar pelo dono elegível e reabrir mesma versão; pendências e aprovação negada não produzem Recipe aprovada |
| STUDIOS-WP05 | WP-03.3.3-STUDIOS-A | Analysis Studio | STUDIOS-WP02, STUDIOS-WP04; inputs/dono ready | Cada necessidade relevante classificada e ligada à Recipe; gap/incerteza explícitos; versão de origem stale impede conclusão indevida |
| STUDIOS-WP06 | WP-04.1.1-STUDIOS-A | Design — Data Studio | STUDIOS-WP01, STUDIOS-WP05; inputs/dono ready | Editar entidade/relação real por contrato, validar referências e reabrir sem perder comportamento/layout não editado |
| STUDIOS-WP07 | WP-04.1.2-STUDIOS-A | Design — Workflow Studio ampliado | STUDIOS-WP05, STUDIOS-WP06; inputs/dono ready | Evoluir fluxo atual com regra contratada, validar/refazer/reabrir e rejeitar referência/transição inválida; layout não muda negócio |
| STUDIOS-WP08 | WP-04.1.2-STUDIOS-B | Design — Actions, Jobs & Events Studio | STUDIOS-WP05, STUDIOS-WP06, STUDIOS-WP07; inputs/dono ready | Configurar ação e vínculo evento/job real sem script solto; schema/efeito/permissão/duplicação inválidos rejeitados pelo dono |
| STUDIOS-WP09 | WP-04.2.1-STUDIOS-A | Design — Interface Studio | STUDIOS-WP02, STUDIOS-WP06, STUDIOS-WP08; inputs/dono ready | Compor tela/formulário vinculado a entidade/ação real, validar campos e round-trip; componente/layout não altera regra de processo |
| STUDIOS-WP10 | WP-04.2.2-STUDIOS-A | Design — Roles, Rules & Policies Studio | STUDIOS-WP04, STUDIOS-WP05, STUDIOS-WP06, STUDIOS-WP08; inputs/dono ready | Configurar política e observar avaliação real permitida/negada; editar UI ou actorRef nunca concede autorização |
| STUDIOS-WP11 | WP-04.2.3-STUDIOS-A | Design — Integration Studio | STUDIOS-WP02, STUDIOS-WP05, STUDIOS-WP06, STUDIOS-WP08, STUDIOS-WP10; inputs/dono ready | Configurar/validar vínculo real compatível, tratar falha/retry sem efeito duplicado e exportar sem credenciais |
| STUDIOS-WP12 | WP-04.3.1-STUDIOS-A | Design — Capabilities & Environment Requirements | STUDIOS-WP02, STUDIOS-WP05, STUDIOS-WP06, STUDIOS-WP08, STUDIOS-WP10, STUDIOS-WP11; inputs/dono ready | Declarar requisitos e rejeitar incompatibilidade; referência de secret permanece referência, sem resolver/embutir segredo na definição |
| STUDIOS-WP13 | WP-04.3.3-STUDIOS-A | Design Studio integrado e publicação de definição | STUDIOS-WP06, STUDIOS-WP07, STUDIOS-WP08, STUDIOS-WP09, STUDIOS-WP10, STUDIOS-WP11, STUDIOS-WP12; inputs/dono ready | Views complementares convergem na mesma definição; referências resolvidas, gate válido e publicação real; retenção técnica isolada não basta |
| STUDIOS-WP14 | WP-06.3.3-STUDIOS-A | Assembly Studio | STUDIOS-WP02, STUDIOS-WP13; inputs/dono ready | Mesmos inputs produzem mesma composição/hash; conflito/ciclo/gap retorna diagnóstico real sem montagem fictícia |
| STUDIOS-WP15 | WP-07.3.3-STUDIOS-A | Validation Studio | STUDIOS-WP04, STUDIOS-WP05, STUDIOS-WP13, STUDIOS-WP14; inputs/dono ready | Executar/consultar gates reais e rastrear requisito à prova; falha/stale/inconclusivo bloqueia avanço, botão aprovar não substitui evidência |
| STUDIOS-WP16 | WP-08.3.3-STUDIOS-A | Compiler Studio | STUDIOS-WP14, STUDIOS-WP15; inputs/dono ready | Solicitar build real autorizado, recuperar resultado após desconexão e verificar integridade/reprodução; sem secrets no pacote |
| STUDIOS-WP17 | WP-09.3.3-STUDIOS-A | Release Studio | STUDIOS-WP15, STUDIOS-WP16; inputs/dono ready | Publicar/promover versão elegível e auditar origem; estado negado ou artefato adulterado não avança; revisão publicada não é sobrescrita |
| STUDIOS-WP18 | WP-10.3.3-STUDIOS-A | Deploy Studio | STUDIOS-WP12, STUDIOS-WP17; inputs/dono ready | Implantar em alvo isolado qualificado, verificar saúde/versão ativa e rollback; release não muda e credenciais ficam externas |
| STUDIOS-WP19 | WP-11.3.3-STUDIOS-A | Observe Studio | STUDIOS-WP18; inputs/dono ready | Exibir dado real com fonte/tempo/contexto e encaminhar finding; Observe/Builder indisponível não interrompe runtime |
| STUDIOS-WP20 | WP-12.3.3-STUDIOS-A | Support & Evolution Studio | STUDIOS-WP03, STUDIOS-WP04, STUDIOS-WP17, STUDIOS-WP18, STUDIOS-WP19; inputs/dono ready | Classificar/resolver caso real e abrir evolução vinculada à origem; mudança de negócio retorna a Mirror/Recipe, sem patch direto fora da pipeline |
| STUDIOS-WP21 | WP-07.3.1-STUDIOS-A | Jornada integrada da fábrica com todos os Studios | STUDIOS-WP02, STUDIOS-WP03, STUDIOS-WP04, STUDIOS-WP05, STUDIOS-WP13, STUDIOS-WP14, STUDIOS-WP15, STUDIOS-WP16, STUDIOS-WP17, STUDIOS-WP18, STUDIOS-WP19, STUDIOS-WP20; inputs/dono ready | Processo observado→Recipe aprovada→Analysis→Design→Assembly→Validation→Compiler→Release→Deploy→Observe→Support→nova revisão; cliente funciona com Builder desligado |
| STUDIOS-WP22 | WP-21.3.2-STUDIOS-B | Qualificação, portabilidade e operação da fase | STUDIOS-WP21; inputs/dono ready | Executar matriz aprovada com medidas/boundaries, recuperar/importar dados e trocar implementação por contrato quando qualificado; limites residuais explícitos |

Dependências apontam aos artifacts/capabilities nos dicionários abaixo, não apenas números. Ordens01–22 são proposta serial; DAG permite algum trabalho sem dependência direta, mas não autoriza execução paralela. Só NEXT_WORK materializa sprint ativa.
Cada WP acrescenta O1–O4/O5 do seu dono antes de integração. Package de owner service necessário é explicitamente separado, com seu próprio scope/ADR/contrato/construção/prova; IDs/quantidade não inventados aqui.

## Cadência / evidence comum
Planning: freshmain, scope/dono/contratos/DAG/riscos, acceptance/limites e só primeiraConstruction elegível.
A: incremento integrado publicport/codec/controller/domainbinding conformeowner ready, provas positivas/negativas/predecessor.
B: UX e roundtrip operacional browser→API→dados→resposta, recuperação e matriz admitida.
C: somente gap indispensável comprovado por freshmain; não obrigação nem slot livre para nova feature.
Review: regressão independente/arquitetura/trust/compatibilidade/dívida/GOClosure. Closure: docs/ops/WBS/contratos/riscos/scheduler.
Uma branch/sprint, um commit/TASK, umPR/sprint; exacthead/currentbase/alltriggered verify/build/heavy/browser/handoff gates antes de merge. Não enfraquecer CI ou certificar mock como owner real.
110 sprints padrão/até132 comCem todos, fora esforço desconhecido de readiness de donos; sem calendário. Planning pode dividir/reordenar candidato por evidência.

## Dicionários dos22 WPs
### STUDIOS-WP01 — Fundação compartilhada dos Studios

```json
{
  "work_package": "WP-21.1.1-STUDIOS-A",
  "parent_wbs": "21.1.1",
  "name": "Fundação compartilhada dos Studios",
  "status": "CLOSED",
  "objective": "Abrir duas áreas de domínio mantendo referências/seleção, alternar contexto sem misturar autoridade; owner indisponível preserva draft",
  "in_scope": [
    "Registro de Studios/ferramentas, contexto, seleção, draft/revisões, contratos SDK e qualificação de acesso"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Station/SDK/gramática existentes; WP16 fechado",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Shell e ferramentas compartilhadas qualificadas",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STATION-S4-WP16",
      "capability_or_artifact": "Studio local integrado, SDK/Gateway/Design ready e contrato/gramática Station existentes"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP02",
    "STUDIOS-WP03",
    "STUDIOS-WP06"
  ],
  "acceptance_criteria": [
    "Abrir duas áreas de domínio mantendo referências/seleção, alternar contexto sem misturar autoridade; owner indisponível preserva draft",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP01; EAP SS.1.1",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP02 — Catalog Studio

```json
{
  "work_package": "WP-05.3.3-STUDIOS-A",
  "parent_wbs": "5.3.3",
  "name": "Catalog Studio",
  "status": "PLANNED",
  "objective": "Registrar/consultar uma entrada de cada catálogo; reutilizar versão explícita; duplicata/incompatível/acesso negado rejeitados",
  "in_scope": [
    "Business e Software Catalog separados: busca, versões, compatibilidade, publicação/depreciação elegível"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Entradas/capabilities públicas e decisões do Catalog",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Entradas catalogadas versionadas e consulta real",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP01",
      "capability_or_artifact": "Shell e ferramentas compartilhadas qualificadas"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP04",
    "STUDIOS-WP05",
    "STUDIOS-WP09",
    "STUDIOS-WP11",
    "STUDIOS-WP12",
    "STUDIOS-WP14",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Registrar/consultar uma entrada de cada catálogo; reutilizar versão explícita; duplicata/incompatível/acesso negado rejeitados",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP02; EAP SS.1.2",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP03 — Mirror Studio

```json
{
  "work_package": "WP-01.3.3-STUDIOS-A",
  "parent_wbs": "1.3.3",
  "name": "Mirror Studio",
  "status": "PLANNED",
  "objective": "Mapear processo com fonte auditável, corrigir/reabrir revisão e expor lacuna; observação nunca vira aprovação normativa",
  "in_scope": [
    "Evidências, atores/atividades/objetos, decisões/exceções/handoffs, incerteza e revisão do observado"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Fontes fornecidas/autorizadas e referências de evidência",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "ProcessMirror versionado e rastreável",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP01",
      "capability_or_artifact": "Shell e ferramentas compartilhadas qualificadas"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP04",
    "STUDIOS-WP20",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Mapear processo com fonte auditável, corrigir/reabrir revisão e expor lacuna; observação nunca vira aprovação normativa",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP03; EAP SS.2.1",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP04 — Recipe Studio

```json
{
  "work_package": "WP-02.3.3-STUDIOS-A",
  "parent_wbs": "2.3.3",
  "name": "Recipe Studio",
  "status": "PLANNED",
  "objective": "Propor/revisar/aprovar pelo dono elegível e reabrir mesma versão; pendências e aprovação negada não produzem Recipe aprovada",
  "in_scope": [
    "Modelo operacional, regras/exceções/políticas/decisões humanas, fragments/modules e publicação autorizada"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "ProcessMirror, evidências e autoridade de negócio",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "BusinessRecipe aprovada/versionada e fragments/modules",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP02",
      "capability_or_artifact": "Entradas catalogadas versionadas e consulta real"
    },
    {
      "work_package": "STUDIOS-WP03",
      "capability_or_artifact": "ProcessMirror versionado e rastreável"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP05",
    "STUDIOS-WP10",
    "STUDIOS-WP15",
    "STUDIOS-WP20",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Propor/revisar/aprovar pelo dono elegível e reabrir mesma versão; pendências e aprovação negada não produzem Recipe aprovada",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP04; EAP SS.2.2",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP05 — Analysis Studio

```json
{
  "work_package": "WP-03.3.3-STUDIOS-A",
  "parent_wbs": "3.3.3",
  "name": "Analysis Studio",
  "status": "PLANNED",
  "objective": "Cada necessidade relevante classificada e ligada à Recipe; gap/incerteza explícitos; versão de origem stale impede conclusão indevida",
  "in_scope": [
    "Requisitos, trace links, matches/gaps/adaptações, segurança/sizing/alternativas"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Recipe aprovada e snapshots dos catálogos",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "SystemAnalysis versionado, requisitos e gaps",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP02",
      "capability_or_artifact": "Entradas catalogadas versionadas e consulta real"
    },
    {
      "work_package": "STUDIOS-WP04",
      "capability_or_artifact": "BusinessRecipe aprovada/versionada e fragments/modules"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP06",
    "STUDIOS-WP07",
    "STUDIOS-WP08",
    "STUDIOS-WP10",
    "STUDIOS-WP11",
    "STUDIOS-WP12",
    "STUDIOS-WP15",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Cada necessidade relevante classificada e ligada à Recipe; gap/incerteza explícitos; versão de origem stale impede conclusão indevida",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP05; EAP SS.2.3",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP06 — Design — Data Studio

```json
{
  "work_package": "WP-04.1.1-STUDIOS-A",
  "parent_wbs": "4.1.1",
  "name": "Design — Data Studio",
  "status": "PLANNED",
  "objective": "Editar entidade/relação real por contrato, validar referências e reabrir sem perder comportamento/layout não editado",
  "in_scope": [
    "Entidades, campos/tipos/relações/constraints/lifecycle e vínculo a requisitos"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "SystemAnalysis e contrato lógico de dados",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Trecho de informação validado em SystemDefinition",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP01",
      "capability_or_artifact": "Shell e ferramentas compartilhadas qualificadas"
    },
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP07",
    "STUDIOS-WP08",
    "STUDIOS-WP09",
    "STUDIOS-WP10",
    "STUDIOS-WP11",
    "STUDIOS-WP12",
    "STUDIOS-WP13"
  ],
  "acceptance_criteria": [
    "Editar entidade/relação real por contrato, validar referências e reabrir sem perder comportamento/layout não editado",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP06; EAP SS.3.1",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP07 — Design — Workflow Studio ampliado

```json
{
  "work_package": "WP-04.1.2-STUDIOS-A",
  "parent_wbs": "4.1.2",
  "name": "Design — Workflow Studio ampliado",
  "status": "PLANNED",
  "objective": "Evoluir fluxo atual com regra contratada, validar/refazer/reabrir e rejeitar referência/transição inválida; layout não muda negócio",
  "in_scope": [
    "Fluxos/estados/transições e condições/gatilhos admitidos por contratos",
    "projeção gráfica separada"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Workflow Studio WP16 e requisitos/modelo de dados",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Comportamento lógico versionado e rastreável",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    },
    {
      "work_package": "STUDIOS-WP06",
      "capability_or_artifact": "Trecho de informação validado em SystemDefinition"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP08",
    "STUDIOS-WP13"
  ],
  "acceptance_criteria": [
    "Evoluir fluxo atual com regra contratada, validar/refazer/reabrir e rejeitar referência/transição inválida; layout não muda negócio",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP07; EAP SS.3.2",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP08 — Design — Actions, Jobs & Events Studio

```json
{
  "work_package": "WP-04.1.2-STUDIOS-B",
  "parent_wbs": "4.1.2",
  "name": "Design — Actions, Jobs & Events Studio",
  "status": "PLANNED",
  "objective": "Configurar ação e vínculo evento/job real sem script solto; schema/efeito/permissão/duplicação inválidos rejeitados pelo dono",
  "in_scope": [
    "Ações, inputs/outputs/erros, side effects/permissions/dependências, jobs/events/idempotência"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Requisitos, dados, fluxos e contratos de actions/workflow/time",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Definições lógicas de ações/jobs/eventos",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    },
    {
      "work_package": "STUDIOS-WP06",
      "capability_or_artifact": "Trecho de informação validado em SystemDefinition"
    },
    {
      "work_package": "STUDIOS-WP07",
      "capability_or_artifact": "Comportamento lógico versionado e rastreável"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP09",
    "STUDIOS-WP10",
    "STUDIOS-WP11",
    "STUDIOS-WP12",
    "STUDIOS-WP13"
  ],
  "acceptance_criteria": [
    "Configurar ação e vínculo evento/job real sem script solto; schema/efeito/permissão/duplicação inválidos rejeitados pelo dono",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP08; EAP SS.3.3",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP09 — Design — Interface Studio

```json
{
  "work_package": "WP-04.2.1-STUDIOS-A",
  "parent_wbs": "4.2.1",
  "name": "Design — Interface Studio",
  "status": "PLANNED",
  "objective": "Compor tela/formulário vinculado a entidade/ação real, validar campos e round-trip; componente/layout não altera regra de processo",
  "in_scope": [
    "Views/forms/interação, dados/ações vinculados, composições/templates e grade tipada"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Editor/catálogo instalado, modelos de dados e ações",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Views/forms lógicos e projeções de layout separadas",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP02",
      "capability_or_artifact": "Entradas catalogadas versionadas e consulta real"
    },
    {
      "work_package": "STUDIOS-WP06",
      "capability_or_artifact": "Trecho de informação validado em SystemDefinition"
    },
    {
      "work_package": "STUDIOS-WP08",
      "capability_or_artifact": "Definições lógicas de ações/jobs/eventos"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP13"
  ],
  "acceptance_criteria": [
    "Compor tela/formulário vinculado a entidade/ação real, validar campos e round-trip; componente/layout não altera regra de processo",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP09; EAP SS.3.4",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP10 — Design — Roles, Rules & Policies Studio

```json
{
  "work_package": "WP-04.2.2-STUDIOS-A",
  "parent_wbs": "4.2.2",
  "name": "Design — Roles, Rules & Policies Studio",
  "status": "PLANNED",
  "objective": "Configurar política e observar avaliação real permitida/negada; editar UI ou actorRef nunca concede autorização",
  "in_scope": [
    "Papéis/permissões/políticas/regras, distinção entre auth e autorização, impacto/simulações contratadas"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Recipe/requisitos, action/resource scopes e autoridade elegível",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Modelo lógico de autoridade/política versionado",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP04",
      "capability_or_artifact": "BusinessRecipe aprovada/versionada e fragments/modules"
    },
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    },
    {
      "work_package": "STUDIOS-WP06",
      "capability_or_artifact": "Trecho de informação validado em SystemDefinition"
    },
    {
      "work_package": "STUDIOS-WP08",
      "capability_or_artifact": "Definições lógicas de ações/jobs/eventos"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP11",
    "STUDIOS-WP12",
    "STUDIOS-WP13"
  ],
  "acceptance_criteria": [
    "Configurar política e observar avaliação real permitida/negada; editar UI ou actorRef nunca concede autorização",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP10; EAP SS.3.5",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP11 — Design — Integration Studio

```json
{
  "work_package": "WP-04.2.3-STUDIOS-A",
  "parent_wbs": "4.2.3",
  "name": "Design — Integration Studio",
  "status": "PLANNED",
  "objective": "Configurar/validar vínculo real compatível, tratar falha/retry sem efeito duplicado e exportar sem credenciais",
  "in_scope": [
    "Contratos externos, connector/provider refs, mapping/version/erro/retry/idempotência"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Catálogo de conectores, requisitos e contratos externos autorizados",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Integrações lógicas e referências seguras",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP02",
      "capability_or_artifact": "Entradas catalogadas versionadas e consulta real"
    },
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    },
    {
      "work_package": "STUDIOS-WP06",
      "capability_or_artifact": "Trecho de informação validado em SystemDefinition"
    },
    {
      "work_package": "STUDIOS-WP08",
      "capability_or_artifact": "Definições lógicas de ações/jobs/eventos"
    },
    {
      "work_package": "STUDIOS-WP10",
      "capability_or_artifact": "Modelo lógico de autoridade/política versionado"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP12",
    "STUDIOS-WP13"
  ],
  "acceptance_criteria": [
    "Configurar/validar vínculo real compatível, tratar falha/retry sem efeito duplicado e exportar sem credenciais",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP11; EAP SS.3.6",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP12 — Design — Capabilities & Environment Requirements

```json
{
  "work_package": "WP-04.3.1-STUDIOS-A",
  "parent_wbs": "4.3.1",
  "name": "Design — Capabilities & Environment Requirements",
  "status": "PLANNED",
  "objective": "Declarar requisitos e rejeitar incompatibilidade; referência de secret permanece referência, sem resolver/embutir segredo na definição",
  "in_scope": [
    "Capabilities, sizing/config/secret references e requisitos de ambiente/deploy"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "SystemAnalysis e capacidades/contratos qualificados",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Requisitos lógicos de ambiente/capabilities",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP02",
      "capability_or_artifact": "Entradas catalogadas versionadas e consulta real"
    },
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    },
    {
      "work_package": "STUDIOS-WP06",
      "capability_or_artifact": "Trecho de informação validado em SystemDefinition"
    },
    {
      "work_package": "STUDIOS-WP08",
      "capability_or_artifact": "Definições lógicas de ações/jobs/eventos"
    },
    {
      "work_package": "STUDIOS-WP10",
      "capability_or_artifact": "Modelo lógico de autoridade/política versionado"
    },
    {
      "work_package": "STUDIOS-WP11",
      "capability_or_artifact": "Integrações lógicas e referências seguras"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP13",
    "STUDIOS-WP18"
  ],
  "acceptance_criteria": [
    "Declarar requisitos e rejeitar incompatibilidade; referência de secret permanece referência, sem resolver/embutir segredo na definição",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP12; EAP SS.3.7",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP13 — Design Studio integrado e publicação de definição

```json
{
  "work_package": "WP-04.3.3-STUDIOS-A",
  "parent_wbs": "4.3.3",
  "name": "Design Studio integrado e publicação de definição",
  "status": "PLANNED",
  "objective": "Views complementares convergem na mesma definição; referências resolvidas, gate válido e publicação real; retenção técnica isolada não basta",
  "in_scope": [
    "Convergência dos sete grupos de ferramentas, consistência/completude/traceability e publicação autorizada"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Analysis e todos os trechos de Design versionados",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "SystemDefinition publicável/publicada pelo dono elegível",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP06",
      "capability_or_artifact": "Trecho de informação validado em SystemDefinition"
    },
    {
      "work_package": "STUDIOS-WP07",
      "capability_or_artifact": "Comportamento lógico versionado e rastreável"
    },
    {
      "work_package": "STUDIOS-WP08",
      "capability_or_artifact": "Definições lógicas de ações/jobs/eventos"
    },
    {
      "work_package": "STUDIOS-WP09",
      "capability_or_artifact": "Views/forms lógicos e projeções de layout separadas"
    },
    {
      "work_package": "STUDIOS-WP10",
      "capability_or_artifact": "Modelo lógico de autoridade/política versionado"
    },
    {
      "work_package": "STUDIOS-WP11",
      "capability_or_artifact": "Integrações lógicas e referências seguras"
    },
    {
      "work_package": "STUDIOS-WP12",
      "capability_or_artifact": "Requisitos lógicos de ambiente/capabilities"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP14",
    "STUDIOS-WP15",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Views complementares convergem na mesma definição; referências resolvidas, gate válido e publicação real; retenção técnica isolada não basta",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP13; EAP SS.3.8",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP14 — Assembly Studio

```json
{
  "work_package": "WP-06.3.3-STUDIOS-A",
  "parent_wbs": "6.3.3",
  "name": "Assembly Studio",
  "status": "PLANNED",
  "objective": "Mesmos inputs produzem mesma composição/hash; conflito/ciclo/gap retorna diagnóstico real sem montagem fictícia",
  "in_scope": [
    "Resolução de capacidades/providers/versões/dependências, BOM, conflitos/ciclos e diagnóstico"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "SystemDefinition publicada, Catalog snapshot e políticas",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "AssemblyPlan reproduzível",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP02",
      "capability_or_artifact": "Entradas catalogadas versionadas e consulta real"
    },
    {
      "work_package": "STUDIOS-WP13",
      "capability_or_artifact": "SystemDefinition publicável/publicada pelo dono elegível"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP15",
    "STUDIOS-WP16",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Mesmos inputs produzem mesma composição/hash; conflito/ciclo/gap retorna diagnóstico real sem montagem fictícia",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP14; EAP SS.4.1",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP15 — Validation Studio

```json
{
  "work_package": "WP-07.3.3-STUDIOS-A",
  "parent_wbs": "7.3.3",
  "name": "Validation Studio",
  "status": "PLANNED",
  "objective": "Executar/consultar gates reais e rastrear requisito à prova; falha/stale/inconclusivo bloqueia avanço, botão aprovar não substitui evidência",
  "in_scope": [
    "Schemas/boundaries/qualidade/segurança e matriz Recipe→Analysis→Definition→Assembly→testes"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Artefatos e evidências reais de montagem/testes",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "ValidationEvidence e decisão de gate",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP04",
      "capability_or_artifact": "BusinessRecipe aprovada/versionada e fragments/modules"
    },
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    },
    {
      "work_package": "STUDIOS-WP13",
      "capability_or_artifact": "SystemDefinition publicável/publicada pelo dono elegível"
    },
    {
      "work_package": "STUDIOS-WP14",
      "capability_or_artifact": "AssemblyPlan reproduzível"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP16",
    "STUDIOS-WP17",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Executar/consultar gates reais e rastrear requisito à prova; falha/stale/inconclusivo bloqueia avanço, botão aprovar não substitui evidência",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP15; EAP SS.4.2",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP16 — Compiler Studio

```json
{
  "work_package": "WP-08.3.3-STUDIOS-A",
  "parent_wbs": "8.3.3",
  "name": "Compiler Studio",
  "status": "PLANNED",
  "objective": "Solicitar build real autorizado, recuperar resultado após desconexão e verificar integridade/reprodução; sem secrets no pacote",
  "in_scope": [
    "Build job/materialização/package, toolchain, progresso/diagnósticos, conteúdo/hashes e reprodutibilidade"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Assembly validado, versões de toolchain/runtime/capabilities",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "ReleaseArtifact e evidência de compilação",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP14",
      "capability_or_artifact": "AssemblyPlan reproduzível"
    },
    {
      "work_package": "STUDIOS-WP15",
      "capability_or_artifact": "ValidationEvidence e decisão de gate"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP17",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Solicitar build real autorizado, recuperar resultado após desconexão e verificar integridade/reprodução; sem secrets no pacote",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP16; EAP SS.4.3",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP17 — Release Studio

```json
{
  "work_package": "WP-09.3.3-STUDIOS-A",
  "parent_wbs": "9.3.3",
  "name": "Release Studio",
  "status": "PLANNED",
  "objective": "Publicar/promover versão elegível e auditar origem; estado negado ou artefato adulterado não avança; revisão publicada não é sobrescrita",
  "in_scope": [
    "Registro/versionamento/proveniência, lifecycle/promotion/depreciação/arquivamento/distribuição"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "ReleaseArtifact e ValidationEvidence",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "PublishedRelease imutável e auditável",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP15",
      "capability_or_artifact": "ValidationEvidence e decisão de gate"
    },
    {
      "work_package": "STUDIOS-WP16",
      "capability_or_artifact": "ReleaseArtifact e evidência de compilação"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP18",
    "STUDIOS-WP20",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Publicar/promover versão elegível e auditar origem; estado negado ou artefato adulterado não avança; revisão publicada não é sobrescrita",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP17; EAP SS.4.4",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP18 — Deploy Studio

```json
{
  "work_package": "WP-10.3.3-STUDIOS-A",
  "parent_wbs": "10.3.3",
  "name": "Deploy Studio",
  "status": "PLANNED",
  "objective": "Implantar em alvo isolado qualificado, verificar saúde/versão ativa e rollback; release não muda e credenciais ficam externas",
  "in_scope": [
    "Environment Profiles, binding/configrefs, migrations/health/rollback e registro operacional"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "PublishedRelease e ambiente alvo explicitamente autorizado",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "DeploymentRecord e versão ativa comprovada",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP12",
      "capability_or_artifact": "Requisitos lógicos de ambiente/capabilities"
    },
    {
      "work_package": "STUDIOS-WP17",
      "capability_or_artifact": "PublishedRelease imutável e auditável"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP19",
    "STUDIOS-WP20",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Implantar em alvo isolado qualificado, verificar saúde/versão ativa e rollback; release não muda e credenciais ficam externas",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP18; EAP SS.4.5",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP19 — Observe Studio

```json
{
  "work_package": "WP-11.3.3-STUDIOS-A",
  "parent_wbs": "11.3.3",
  "name": "Observe Studio",
  "status": "PLANNED",
  "objective": "Exibir dado real com fonte/tempo/contexto e encaminhar finding; Observe/Builder indisponível não interrompe runtime",
  "in_scope": [
    "Telemetria técnica/negócio, correlação release/deploy, métricas/findings e confiança"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Eventos/logs/métricas autorizados de runtime real",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Observations/findings e indicadores rastreáveis",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP18",
      "capability_or_artifact": "DeploymentRecord e versão ativa comprovada"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP20",
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Exibir dado real com fonte/tempo/contexto e encaminhar finding; Observe/Builder indisponível não interrompe runtime",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP19; EAP SS.5.1",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP20 — Support & Evolution Studio

```json
{
  "work_package": "WP-12.3.3-STUDIOS-A",
  "parent_wbs": "12.3.3",
  "name": "Support & Evolution Studio",
  "status": "PLANNED",
  "objective": "Classificar/resolver caso real e abrir evolução vinculada à origem; mudança de negócio retorna a Mirror/Recipe, sem patch direto fora da pipeline",
  "in_scope": [
    "Intake/triagem Support/Maintenance/Evolution, caso/causa/resolução e retorno ao conhecimento"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Solicitações, findings e evidências com contexto",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Support/Evolution records e mudança rastreável",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP03",
      "capability_or_artifact": "ProcessMirror versionado e rastreável"
    },
    {
      "work_package": "STUDIOS-WP04",
      "capability_or_artifact": "BusinessRecipe aprovada/versionada e fragments/modules"
    },
    {
      "work_package": "STUDIOS-WP17",
      "capability_or_artifact": "PublishedRelease imutável e auditável"
    },
    {
      "work_package": "STUDIOS-WP18",
      "capability_or_artifact": "DeploymentRecord e versão ativa comprovada"
    },
    {
      "work_package": "STUDIOS-WP19",
      "capability_or_artifact": "Observations/findings e indicadores rastreáveis"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP21"
  ],
  "acceptance_criteria": [
    "Classificar/resolver caso real e abrir evolução vinculada à origem; mudança de negócio retorna a Mirror/Recipe, sem patch direto fora da pipeline",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP20; EAP SS.5.2",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP21 — Jornada integrada da fábrica com todos os Studios

```json
{
  "work_package": "WP-07.3.1-STUDIOS-A",
  "parent_wbs": "7.3.1",
  "name": "Jornada integrada da fábrica com todos os Studios",
  "status": "PLANNED",
  "objective": "Processo observado→Recipe aprovada→Analysis→Design→Assembly→Validation→Compiler→Release→Deploy→Observe→Support→nova revisão; cliente funciona com Builder desligado",
  "in_scope": [
    "Construção de prova crescente de ponta a ponta e tratamento dos gaps de integração em construção"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Todos os Studios e donos com readiness/gates qualificados",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Sistema cliente de referência e trilha completa de evidências",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP02",
      "capability_or_artifact": "Entradas catalogadas versionadas e consulta real"
    },
    {
      "work_package": "STUDIOS-WP03",
      "capability_or_artifact": "ProcessMirror versionado e rastreável"
    },
    {
      "work_package": "STUDIOS-WP04",
      "capability_or_artifact": "BusinessRecipe aprovada/versionada e fragments/modules"
    },
    {
      "work_package": "STUDIOS-WP05",
      "capability_or_artifact": "SystemAnalysis versionado, requisitos e gaps"
    },
    {
      "work_package": "STUDIOS-WP13",
      "capability_or_artifact": "SystemDefinition publicável/publicada pelo dono elegível"
    },
    {
      "work_package": "STUDIOS-WP14",
      "capability_or_artifact": "AssemblyPlan reproduzível"
    },
    {
      "work_package": "STUDIOS-WP15",
      "capability_or_artifact": "ValidationEvidence e decisão de gate"
    },
    {
      "work_package": "STUDIOS-WP16",
      "capability_or_artifact": "ReleaseArtifact e evidência de compilação"
    },
    {
      "work_package": "STUDIOS-WP17",
      "capability_or_artifact": "PublishedRelease imutável e auditável"
    },
    {
      "work_package": "STUDIOS-WP18",
      "capability_or_artifact": "DeploymentRecord e versão ativa comprovada"
    },
    {
      "work_package": "STUDIOS-WP19",
      "capability_or_artifact": "Observations/findings e indicadores rastreáveis"
    },
    {
      "work_package": "STUDIOS-WP20",
      "capability_or_artifact": "Support/Evolution records e mudança rastreável"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [
    "STUDIOS-WP22"
  ],
  "acceptance_criteria": [
    "Processo observado→Recipe aprovada→Analysis→Design→Assembly→Validation→Compiler→Release→Deploy→Observe→Support→nova revisão; cliente funciona com Builder desligado",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP21; EAP SS.6.1",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

### STUDIOS-WP22 — Qualificação, portabilidade e operação da fase

```json
{
  "work_package": "WP-21.3.2-STUDIOS-B",
  "parent_wbs": "21.3.2",
  "name": "Qualificação, portabilidade e operação da fase",
  "status": "PLANNED",
  "objective": "Executar matriz aprovada com medidas/boundaries, recuperar/importar dados e trocar implementação por contrato quando qualificado; limites residuais explícitos",
  "in_scope": [
    "Matriz de browsers/a11y/performance/limites/recuperação/segurança, export/import e operação/manutenção"
  ],
  "out_of_scope": [
    "Autoridade/regra canônica dentro da Station",
    "Reimplementar dono por private import/fixture",
    "Produção/escala/semântica não admitidas na Planning",
    "Implementation em Review/Closure"
  ],
  "inputs": [
    "Prova integrada e dívida medida dos pacotes",
    "Contratos públicos e readiness/eligibilidade do dono"
  ],
  "outputs": [
    "Matriz de qualificação, kit de operação/export/restore e fechamento rastreável",
    "Prova crescente e operação/dívida documentada"
  ],
  "predecessors": [
    {
      "work_package": "STUDIOS-WP21",
      "capability_or_artifact": "Sistema cliente de referência e trilha completa de evidências"
    }
  ],
  "interfaces": [
    "Station SDK/Gateway/protocolo vigente",
    "Contrato público do dono do artifact/action/query",
    "ArtifactEnvelope/identidade/revisões/proveniência/currentness/eligibilidade"
  ],
  "downstream_consumers": [],
  "acceptance_criteria": [
    "Executar matriz aprovada com medidas/boundaries, recuperar/importar dados e trocar implementação por contrato quando qualificado; limites residuais explícitos",
    "Preservar informação não editada e contexto/autoridade; falhas negativas e reabertura/restart qualificados"
  ],
  "required_evidence": [
    "Actual predecessor/domain/browser/API/data proof, never success fixture",
    "Negativos denied/stale/unknown/invalid/correlation/context e compatibilidade aplicáveis",
    "Owner durability/restart/result recovery para efeitos persistentes",
    "Full own verification/gates e limites/matriz medidos"
  ],
  "risks": [
    "Owner/API/schema/auth/provider readiness ainda requer census individual",
    "Escopo pode exigir divisão de pacote e contract increment/ADR",
    "Dados/contexto/revisões errados ou autorização só visual",
    "Perda de draft/metadados, fallback silencioso, escala/browsers não medidos"
  ],
  "notes": [
    "Alias STUDIOS-WP22; EAP SS.6.2",
    "WP16 e donos anteriores são baseline, não conclusão desteWP",
    "Planning materializa campos/actions/paths/limites exatos; nenhum TASK futuro executável",
    "Sem backend ausente oculto no pacote Station; criar prerequisite do dono"
  ]
}
```

## Primeira wave — disposition after WP01
WP01sharedfoundation delivered with existingProcessContext/Workflow, scopedselection/context/readonlyInspector andactualDesignownerproof; closureeffectiveonlyonvalidatedTASK733integration. NexteligibleCatalogWP02Planningrevalidatesbusiness/softwarepubliccontracts/service/query/actions/auth/durable/elegibility/upstreamreadiness; no constructionmaterialized. Alllaterpackagesforecast, no inventedowner/backend.

## WP01 bounded closure disposition
STUDIOS-WP01 actual Planning#1123/A#1124/B#1125/Review#1126, ClosureTASK733 effective only on ownvalidatedintegration.107actualChromium/111heavy0skip/4foundationtests; CNOT_NEEDED. ExistingProcessContext+technicalWorkflowareasininstalledsharedworkbench/scopedreadonlyInspector/draftselectionpreservation/actualOwnerproof. No additionalsemanticStudio/backenddelivered. WP01-L1–L3/D1/inheritedlimits retained; docs/operations/STATION-STUDIOS-WP01.md. RemainingWP02–22 stillforecast; nexteligibleCatalogPlanningneedsfreshpublicownerreadiness.
