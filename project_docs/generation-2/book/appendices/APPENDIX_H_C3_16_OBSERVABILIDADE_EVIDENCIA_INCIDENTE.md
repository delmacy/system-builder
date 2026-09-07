# Apêndice H — C3.16: quando observabilidade vira um plano de evidência operacional

**Status editorial:** síntese didática de decisão autoritativa já tomada; este apêndice não cria arquitetura.  
**Data:** 2026-09-06  
**Fonte principal:** `project_docs/generation-2/planning/PLANNING_C_C3_16_OBSERVABILITY_OPERATIONS_INCIDENT_TARGET.md`.

## O problema humano: o painel pode estar certo e a conclusão ainda estar errada

Uma operação empresarial pode exibir CPU normal, API disponível e workers em execução enquanto uma classe de ordens de serviço permanece sem atribuição. Nenhum desses sinais precisa estar falso. O erro nasce quando observações verdadeiras são promovidas para uma conclusão maior do que conseguem provar.

C3.16 transforma essa preocupação, antes estudada como boundary e hipótese, em arquitetura alvo decidida para **Observability / Operations / Incident**.

`DECIDIDO` — a Generation 2 passa a ter um **Operational Evidence & Incident Plane** provider-neutral e qualificado por revisão. Sua função não é declarar a verdade universal do sistema, mas preservar o que foi observado, sobre qual população, em qual horizonte, sob quais revisões, com qual cobertura e incerteza, e então permitir avaliações e coordenação operacional sem roubar autoridade dos semantic owners observados.

A desigualdade central continua simples:

```text
telemetry observed != authoritative system/domain truth
```

A novidade de C3.16 é tornar essa desigualdade estrutural.

## Sete planos de verdade que não devem ser esmagados em um status

A decisão separa sete planos ligados, porém semanticamente distintos:

```text
1. Telemetry & Evidence
2. Qualification & Currentness
3. Operational Assessment
4. Signal & Alert
5. Incident
6. Response & Reconciliation
7. Projection & Fleet
```

Essa separação impede o atalho mental “o dashboard está verde, então está tudo bem”. Um dashboard é uma projeção. A evidência pode estar stale ou parcial. A avaliação pode ser inconclusiva. Um alerta pode ter sido silenciado. Um incidente pode continuar aberto. Uma remediação pode ter sido aceita por um provider sem ter convergido em todos os cohorts.

Portanto:

```text
dashboard displayed != current evidence
signal != condition != alert != incident
remediation accepted != effective != converged != validated
```

## Evidência operacional agora possui identidade e qualificadores explícitos

`DECIDIDO` — C3.16 estabelece identidades canônicas como `OperationalEvidenceId`, `MeasurementProfileId`, `OperationalAssessmentId`, `AlertOccurrenceId`, `IncidentId`, `DiagnosticSessionId` e `OperationalReconciliationId`, entre outras.

Isso não significa que toda instalação precise materializar todos esses objetos da mesma forma. Significa que o modelo alvo precisa conseguir preservar as diferenças semânticas que eles representam.

Um `trace_id` de vendor, um ID de ticket de incidente ou o nome de uma série de métricas continuam sendo **realization identities**. Eles podem aparecer na provenance, mas não se tornam identidade canônica apenas por serem estáveis no provider.

Para uma evidência sustentar uma decisão material, C3.16 exige que seja possível qualificá-la, conforme aplicável, por elementos como sujeito observado, revisão/build/release/runtime, produtor, measurement profile, tempos distintos de ocorrência/observação/ingestão/avaliação, unidade, população, sampling, cobertura, incerteza, provenance, escopo de tenant/Station/site/Fleet e indicadores de perda ou backpressure do próprio pipeline de evidência.

A consequência prática é forte:

```text
metric without unit/population/window/currentness
    != decision evidence
```

## Currentness é relativa à afirmação

Freshness responde se um dado é recente. **Currentness** pergunta se ele ainda é adequado para sustentar a afirmação que queremos fazer.

Uma amostra coletada há cinco segundos pode estar semanticamente velha se, há dois segundos, houve troca de release, mudança de binding, alteração do measurement profile ou entrada de um novo cohort.

C3.16 também formaliza estados como `CURRENT`, `STALE`, `PARTIAL`, `UNKNOWN`, `INCONCLUSIVE` e `NOT_APPLICABLE` para qualificação de evidência. Isso evita dois erros opostos: transformar falta de dados em saúde e transformar falta de dados automaticamente em falha.

`DECIDIDO` — missing data não é automaticamente zero. O resultado depende da semântica do profile e da afirmação pedida.

## Não existe um “health” escalar universal

É tentador resumir toda uma empresa em um número: 93% saudável, score 8,7, semáforo verde. C3.16 rejeita esse número como verdade canônica universal.

Uma visão executiva pode existir, mas precisa manter acesso às dimensões que a compõem. Um sistema pode ter boa disponibilidade e baixa capacidade de recuperação; baixa utilização e nenhuma margem para burst; SLO técnico em PASS e um blocker de compliance; maioria saudável e um pequeno cohort crítico quebrado.

Uma representação mais honesta é vetorial ou em grafo tipado:

```text
{
  availability,
  latency,
  correctness evidence,
  queue stability,
  dependency health,
  trust currentness,
  governance/privacy blockers,
  capacity headroom,
  recovery readiness
}
```

Cada dimensão conserva seu próprio escopo, owner e evidência.

## SLI, SLO e error budget são semântica revisionada

`DECIDIDO` — SLI, SLO e error budget passam a ser first-class e revision-qualified no plano operacional.

Um SLI não é apenas “uma métrica”. Ele define população elegível, eventos bons/válidos, fonte de evidência, agregação e janela. Um SLO associa essa semântica a um objetivo. O error budget é derivado desse objetivo sob período e população explícitos.

Mas Observability não adquire, por isso, a autoridade empresarial que criou o objetivo. Governance, Deployment, Security ou outro owner pode possuir a política que reage ao budget.

```text
Observability owns measurement/evaluation semantics
!=
Observability owns every business objective or release authority
```

## Signal, condition, alert e incident agora são objetos diferentes por decisão

C3.16 formaliza uma separação que o livro já ensinava pedagogicamente:

- **signal:** evidência relevante para uma possível condição;
- **condition:** resultado de avaliação sobre evidência e profile;
- **alert:** ocorrência governada de actionability quando critérios são satisfeitos;
- **incident:** objeto separado de coordenação operacional para impacto ou risco material.

Silence, inhibition, grouping e acknowledgement também não alteram automaticamente a condição subjacente. Um canal silencioso pode significar supressão, falha de transporte ou ausência de evidência — não saúde.

Para alertas materialmente acionáveis, a arquitetura alvo passa a exigir ownership, severidade/prioridade, expectativa de acknowledgement, escalonamento, contexto diagnóstico, currentness e semântica de fechamento.

Um alerta sem responsável não é monitoramento completo; é um gap de operabilidade.

## Incidente não cria superautoridade

O plano de incidentes coordena diagnóstico e resposta, mas não absorve a autoridade das capabilities que realizam efeitos.

```text
Incident coordination
   -> pode solicitar rollback
   -> pode solicitar rotação
   -> pode solicitar failover
   -> pode solicitar redrive

mas

request != authority to actuate
```

A linhagem de resposta preserva, quando aplicável:

```text
proposed
 -> authorized
 -> requested
 -> accepted
 -> effect
 -> reconciled
 -> converged
 -> validated
```

Se o efeito externo fica `UNKNOWN`, continua valendo `reconcile-before-retry`. Urgência operacional não muda as propriedades de um sistema distribuído.

## Queue, backlog e capacidade: profundidade sozinha engana

C3.16 também torna capacidade e overload multidimensionais. Uma fila com apenas cem itens pode ser crítica se o item mais antigo está parado há horas; uma fila com dez mil pode ser normal durante um burst conhecido com service rate suficiente.

Assim, queue evidence precisa considerar, conforme o caso, arrival rate, service rate, age, class/cohort, retry/redrive/dead-letter, saturação e headroom.

```text
low utilization != sustainable capacity
queue depth alone != queue health
```

Isso importa para o SB porque um sistema empresarial precisa distinguir “está pouco ocupado agora” de “consegue suportar a demanda que está chegando”.

## Provider substitution pode quebrar continuidade epistemológica

Trocar collector, backend de métricas, alert manager ou ferramenta de incidentes não é somente trocar uma API.

Sampling, semantic conventions, timestamps, aggregation, grouping e retenção podem mudar. C3.16 exige qualification, coexistence, gap/loss reconciliation e drainage de buffers, alerts e incidents residuais.

Durante cutover:

```text
Provider A evidence semantics
        != automaticamente
Provider B evidence semantics
```

Uma série visualmente contínua pode ser epistemologicamente descontínua. O sistema precisa preservar essa diferença em vez de fabricar comparabilidade.

## Local/offline e Fleet: agregação não produz onisciência

Runtimes locais podem continuar produzindo evidência durante desconexão. Quando reconectam, essa evidência mantém provenance e horizonte originais; o momento de sincronização não rejuvenesce a observação.

Fleet pode agregar, comparar e projetar controle, mas:

```text
Fleet aggregate != local runtime truth
```

Uma visão central precisa mostrar partialidade, currentness e cohorts desconhecidos. A ausência de dados de uma Station desconectada não pode ser convertida silenciosamente em “sem incidentes”.

## Brownfield: dashboard existente é evidência, não constituição

Um cliente pode chegar ao SB com Grafana, alertas, planilhas, runbooks e procedimentos manuais já em uso. C3.16 não manda descartá-los, mas também não os canoniza automaticamente.

`DECIDIDO` — artefatos Brownfield são evidência e candidatos até adoção explícita. A elicitação deve descobrir não só quais dashboards existem, mas quais decisões dependem deles, quem responde aos alertas, como se reconhece stale data, quais partes são manuais e qual evidência comprova fechamento.

## O que muda em relação ao Capítulo 14 v1.0.0

O Capítulo 14 já ensinava corretamente a separação entre telemetria, evidência, assessment, alert, incident e domain truth. O que mudou é o **grau epistemológico** dessas afirmações.

Na v1.0.0, parte delas era explicada a partir de Planning A/B e pesquisa adversarial ainda em andamento. C3.16 agora decidiu a arquitetura alvo da capability e formalizou sete planos, identidades canônicas, qualification/currentness, SLI/SLO/error-budget revisionados, lifecycle de signal/condition/alert/incident, response lineage, provider substitution, local/offline evidence, Fleet projections, Brownfield adoption, Elicitation Lens e Production Readiness Coverage.

Por isso, `CHAPTER_14` deve receber uma revisão editorial MINOR bounded. Este apêndice não realiza silenciosamente esse bump: ele registra a ponte enquanto a revisão coordenada de capítulo, `BOOK_STATE`, `TABLE_OF_CONTENTS`, `GLOSSARY` e `CHANGELOG` é preparada.

## O que você deve guardar deste apêndice

C3.16 não decidiu “usar métricas, logs e traces”. Decidiu algo mais profundo: **como o System Builder pode saber o que sabe sobre a operação sem confundir observação com verdade, silêncio com saúde, agregação com completude ou coordenação com autoridade**.

A cadeia essencial é:

```text
observation
 -> qualified evidence
 -> operational assessment
 -> condition
 -> alert
 -> incident
 -> authorized response request
 -> effect evidence
 -> reconciliation
 -> convergence/validation
```

Cada seta preserva identidade, revisão, provenance, currentness, coverage e owner suficientes para que o sistema possa explicar não apenas *o que acredita*, mas *por que essa crença é justificável*.

## Referências autoritativas principais

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_C_C3_16_OBSERVABILITY_OPERATIONS_INCIDENT_TARGET.md`
- `project_docs/generation-2/planning/PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`
- `project_docs/generation-2/planning/PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`
- `project_docs/generation-2/planning/PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`
- `project_docs/generation-2/planning/PLANNING_A_OBSERVABILITY_OPERATIONS_INCIDENT_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_OBSERVABILITY_OPERATIONS_INCIDENT_SB_CURRENT_STATE.md`

Referências editoriais internas: `CHAPTER_14`, `CHAPTER_18`, `CHAPTER_12` e os apêndices que acompanham decisões anteriores de Planning C.