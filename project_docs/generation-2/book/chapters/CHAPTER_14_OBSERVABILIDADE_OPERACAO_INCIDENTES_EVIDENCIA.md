# Capítulo 14 — Observabilidade, operação, incidentes e evidência — v1.0.0

**ID editorial:** `CHAPTER_14`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada:** compreensão e síntese editorial; não substitui pesquisa, Planning ou arquitetura alvo.

---

## O problema humano: quando o painel está verde, mas a empresa continua com problema

Imagine uma empresa que depende de um sistema para abrir e concluir ordens de serviço. Às 10h17, o painel de infraestrutura mostra tudo verde:

- servidor respondendo;
- banco acessível;
- latência abaixo do limite;
- nenhuma fila aparentemente congestionada;
- último health check com `PASS`.

Mesmo assim, os técnicos começam a ligar: as OS novas aparecem na tela, mas não chegam à equipe responsável. O sistema está “de pé”, porém o trabalho não está acontecendo corretamente.

A situação inversa também é possível. Um componente pode registrar erros, latência elevada ou uma instância reiniciada e, ainda assim, o serviço empresarial continuar cumprindo seu objetivo dentro dos limites aceitáveis.

Esses exemplos revelam uma ideia central deste capítulo:

> **telemetria é evidência sobre o sistema; não é automaticamente a verdade canônica do sistema.**

Essa distinção parece pequena, mas muda profundamente a arquitetura. Se um dashboard puder definir sozinho que “está tudo bem”, ele passa a substituir o semantic owner que deveria dizer o que significa uma OS corretamente encaminhada, um pagamento efetivado, um workflow concluído ou uma autorização válida.

Na Generation 2, **Observability / Operations / Incident** existe para produzir, qualificar, correlacionar e interpretar evidência operacional. Ela pode dizer *o que foi observado, quando, de onde veio, com qual cobertura, sob qual revisão e com qual incerteza*. Ela não pode transformar observação em verdade empresarial apenas porque possui muitos dados.

`DECIDIDO` — Planning A atribui a esta capability a semântica de evidência operacional, telemetria, freshness/currentness/coverage, correlação, SLI/SLO operacional, alerts, incidents, diagnóstico e evidência de resposta. Os semantic owners continuam donos de suas próprias invariantes e postconditions.

---

## 1. Observar não é possuir aquilo que se observa

Uma câmera de segurança pode registrar que uma porta abriu. A câmera não se torna dona da regra de quem deveria poder abrir a porta.

Um medidor elétrico pode mostrar consumo elevado. Ele não se torna dono do orçamento da empresa.

Um monitor de aplicação pode mostrar que uma requisição recebeu HTTP 200. Ele não se torna dono da regra empresarial que define se o pedido foi realmente aceito, aplicado e validado.

A analogia ajuda porque observabilidade funciona de forma parecida: ela cria **evidência** sobre outros fenômenos.

Mas a analogia deixa de valer quando sistemas digitais começam a derivar avaliações compostas, disparar alerts, criar incidents ou sugerir remediações. Nesse ponto, observabilidade não é apenas “uma câmera”; ela possui semântica própria sobre **qualidade da evidência, condição operacional, correlação e resposta**. Ainda assim, essa semântica não lhe concede autoridade universal.

Podemos representar a fronteira assim:

```text
Domain truth / desired truth
        |
        | é observado por
        v
telemetry / operational evidence
        |
        | é qualificada e correlacionada
        v
operational assessment
        |
        | pode gerar
        v
alert / incident / response coordination

Mas:

operational assessment != domain canonical truth
incident != authorization to mutate every owner
```

Uma OS marcada como `concluída` pelo semantic owner do processo não passa a ser “não concluída” porque um monitor perdeu uma amostra. Da mesma forma, uma métrica verde não pode declarar a OS corretamente concluída se o domínio mostra que faltou uma assinatura obrigatória.

---

## 2. Signal, telemetry, evidence e assessment não são a mesma coisa

Esses termos costumam aparecer misturados. Para o System Builder, separá-los evita uma grande classe de falsas certezas.

### 2.1 Signal: um indício

Um **sinal (signal)** é algo que pode merecer atenção.

Exemplos:

- aumento de latência;
- cinco erros em sequência;
- CPU em 95%;
- backlog de 3.000 itens;
- queda de mensagens processadas;
- uma divergência entre dois estados observados.

Um sinal ainda não é uma conclusão.

```text
Signal != ConfirmedCondition
Signal != ConfirmedConflict
```

O sinal pode ser verdadeiro e a interpretação estar errada. Pode ser ruído. Pode refletir apenas um cohort. Pode estar atrasado. Pode ser consequência, e não causa.

### 2.2 Telemetry: dados produzidos para observar operação

**Telemetria (telemetry)** é o conjunto de dados coletados para entender o comportamento operacional de sistemas e serviços.

As famílias mais conhecidas são:

- **métricas (metrics):** valores agregados ou séries temporais, como latência, contagem, erro, CPU e throughput;
- **logs:** registros discretos de acontecimentos produzidos por aplicações, runtimes ou infraestrutura;
- **traces:** encadeamentos que ajudam a acompanhar uma operação através de múltiplos componentes;
- **events:** ocorrências estruturadas que descrevem fatos operacionais relevantes.

A lista não é uma constituição universal. Novos mecanismos podem existir. O ponto é que esses dados são **realizações de evidência operacional**, não identidades canônicas do negócio.

### 2.3 Evidence: telemetria interpretável e qualificada

Um número isolado como `latency = 73` é pouco útil sem contexto.

Setenta e três o quê? Milissegundos? Média? p95? Qual endpoint? Qual região? Qual runtime? Qual revisão? Em qual período? Quantas requisições foram observadas? Houve sampling? O collector estava atualizado?

Por isso, a G2 trata evidência como algo que precisa carregar qualificadores.

Uma forma didática de pensar em um **qualified evidence envelope** é:

```text
Evidence = {
  subject,
  producer,
  producerRevision,
  measurementProfileRevision,
  time/horizon,
  scope,
  coverage,
  provenance,
  uncertainty/completeness,
  providerRealizationRefs?
}
```

Não significa que a arquitetura alvo terá exatamente essa estrutura. Significa que uma evidência não pode ser interpretada corretamente se os qualificadores materialmente necessários desaparecerem.

### 2.4 Assessment: uma afirmação feita a partir da evidência

Uma **avaliação operacional (operational assessment)** transforma evidência em uma afirmação qualificada.

Por exemplo:

```text
Evidence:
  99,95% das requisições elegíveis
  em 30 minutos
  tiveram latência < 300 ms
  sob profile revision R7

Assessment:
  SLO X = PASS para aquela janela/população
```

O assessment não substitui a evidência que o sustenta. Ele precisa ser explicável e, quando material, reavaliável contra o profile e as revisões que o produziram.

---

## 3. Identidade canônica da evidência versus IDs do provider

Considere que a empresa usa um provider externo de observabilidade. Ele atribui:

- `metric_series_id = 98431`;
- `trace_id = abcd...`;
- `alert_rule_id = 772`;
- `incident_id = INC-991`.

Esses identificadores são úteis. Mas eles pertencem à realização do provider.

Se o SB transformar `INC-991` na identidade canônica do incidente, uma migração para outro provider passa a exigir redefinir a identidade histórica da ocorrência.

A fronteira correta é:

```text
CanonicalOperationalEvidenceId
        != ProviderMetricId
        != ProviderLogStreamId
        != ProviderTraceId

CanonicalIncidentId
        != Pager/VendorIncidentId
```

`DECIDIDO` — Planning A mantém IDs de backend, host, pod, trace, metric series, alerting platform e incident tool como **realization identities**, exceto quando algum semantic owner explicitamente adota uma identidade através de transição autorizada.

Isso conecta diretamente este capítulo ao Capítulo 12. Anti-lock-in não exige que o SB ignore IDs externos; exige que não confunda conveniência de realização com identidade semântica.

---

## 4. Freshness, currentness e coverage: “tenho dados” é insuficiente

Um dos erros mais perigosos em observabilidade é transformar existência de dados em certeza.

### 4.1 Freshness

**Freshness** responde algo próximo de: quão recente é esta evidência?

Um dashboard aberto há quatro horas pode continuar mostrando verde. A interface está funcionando; a informação não necessariamente está atual.

### 4.2 Currentness

**Currentness** é mais forte. Pergunta se a evidência ainda é suficientemente atual **para a decisão pretendida**.

Uma métrica coletada há trinta segundos pode mesmo assim não ser current se, dez segundos atrás:

- mudou a release;
- houve provider cutover;
- mudou o routing;
- entrou um novo cohort;
- a policy do SLO foi revisada.

Ou seja:

```text
Fresh != necessarily Current
```

### 4.3 Coverage

**Coverage** descreve qual parte da população relevante realmente foi observada.

Pode envolver:

- tenant;
- Station;
- região;
- provider;
- runtime cohort;
- revision cohort;
- rota;
- dispositivo;
- período;
- população de requests;
- outros eixos relevantes.

Se 2% dos dispositivos enviaram telemetria, “100% dos dispositivos estão saudáveis” é uma conclusão injustificada, mesmo que todos os 2% observados estejam saudáveis.

### 4.4 A importância de INCONCLUSIVE

Por isso a G2 preserva um estado explícito de **`INCONCLUSIVE`** quando a evidência não sustenta uma afirmação forte.

Um exemplo:

```text
50 de 50 workers observados: HEALTHY
Workers esperados: 80
30 sem evidência current

Resultado correto:
  não é automaticamente HEALTHY global
  não é automaticamente UNHEALTHY global
  pode ser INCONCLUSIVE para a afirmação pedida
```

A ausência de telemetria não significa necessariamente zero, saúde ou falha. O significado depende do measurement profile.

---

## 5. Sampling, cardinality e truncation: como dados verdadeiros produzem conclusão falsa

Observabilidade quase sempre trabalha sob restrições de custo e capacidade. Coletar tudo para sempre pode ser inviável.

É comum usar:

- **sampling:** registrar apenas parte das ocorrências;
- agregação;
- limites de cardinalidade;
- retenção parcial;
- truncation de payloads ou logs;
- filtros.

Essas técnicas não são defeitos. O risco aparece quando a limitação desaparece da interpretação.

### Exemplo: erro raro e crítico

Suponha 1.000.000 de operações e apenas 20 falhas que causam duplicação de pagamento.

Se o trace sampling observa 1% das operações, é possível que nenhuma das 20 falhas apareça na amostra.

O dado observado pode ser verdadeiro:

> “Não encontramos duplicações na amostra.”

A conclusão abaixo pode ser falsa:

> “Não houve duplicações.”

A diferença é **coverage**.

O Full Pass 2 de pesquisa adversarial atacou exatamente esse tipo de problema, incluindo sampling, missingness, cardinality overflow, truncation e offline evidence horizons. As variações revisitadas mapearam para famílias de conflito já catalogadas, sem gerar nova família material naquele pass.

`EM PESQUISA` — isso é evidência de cobertura adversarial, não prova de que a campanha esteja saturada. O pipeline continua explicitamente `ACTIVE / NOT_SATURATED`.

---

## 6. Métricas, logs e traces podem discordar — e isso é informação

Considere uma operação de envio de e-mail:

- métrica: `emails_sent_total +1`;
- log: “provider request accepted”;
- trace: timeout após o request;
- provider receipt: desconhecido;
- domínio: nenhum comprovante de entrega disponível.

Um sistema de observabilidade ruim tenta transformar tudo em um único status verde ou vermelho.

Um sistema melhor preserva a discordância:

```text
request attempted = yes
provider accepted = maybe / evidence partial
external effect = UNKNOWN
business delivery = not proven
```

A correlação ajuda a reunir evidências relacionadas. Ela não autoriza inventar causalidade.

### Correlação não é causalidade

Se CPU sobe e a latência sobe logo depois, isso pode indicar relação causal. Mas também pode existir um terceiro fator: burst de requests aumentando os dois.

Por isso:

```text
correlated signals != canonical cause
```

Diagnóstico pode produzir **hipóteses causais**, acompanhadas das evidências que as sustentam. Transformar hipótese em fato requer a qualificação apropriada ao contexto.

---

## 7. SLI e SLO: medir um objetivo sem virar dono do objetivo empresarial

Dois termos aparecem frequentemente em engenharia de confiabilidade.

### SLI — Service Level Indicator

Um **indicador de nível de serviço (Service Level Indicator, SLI)** é uma medida usada para caracterizar determinado aspecto operacional.

Exemplos:

- percentual de requests válidos que terminam com sucesso;
- latência p95;
- disponibilidade observada;
- tempo de processamento de determinada fila.

### SLO — Service Level Objective

Um **objetivo de nível de serviço (Service Level Objective, SLO)** declara um alvo para um indicador sob escopo e janela definidos.

Exemplo didático:

```text
SLI:
  proporção de criação de OS concluída em < 500 ms

SLO:
  >= 99,5% em janela móvel de 30 dias
```

Aqui existe uma fronteira importante.

Observabilidade pode possuir:

- identidade do indicador;
- measurement profile;
- janela;
- população qualificada;
- exclusions;
- evidência de medição;
- avaliação de cumprimento.

Mas o motivo empresarial ou de governança para exigir 99,5% pode pertencer a outro semantic owner.

Assim:

```text
Observability owns measurement semantics
!=
Observability owns every business objective
```

Mudar a definição do SLI ou do SLO também não deve reescrever silenciosamente o passado. A avaliação histórica precisa permanecer ligada à revisão do profile que a produziu.

---

## 8. Alert não é incidente; acknowledgement não é resolução

### 8.1 Alert

Um **alerta (alert)** representa uma transição ou avaliação operacional que requer atenção sob determinada regra.

Exemplo:

```text
latency p95 > threshold por 10 minutos
```

O alert pode possuir:

- identidade;
- severity;
- profile revision;
- dedup/correlation lineage;
- acknowledgement;
- suppression/silence;
- currentness.

Mas:

```text
Alert != Incident
AlertAcknowledged != ConditionResolved
AlertDelivered != HumanAcknowledged
```

O transporte da notificação pertence à capability de Notifications / Events / Messaging. Observabilidade possui **por que o alert existe**; Messaging possui **como sua notificação foi transportada**.

### 8.2 Incident

Um **incidente (incident)** é um registro operacional governado para uma condição material que exige resposta coordenada.

Um lifecycle didático possível é:

```text
detected
   -> declared
   -> acknowledged/owned
   -> contained/mitigated
   -> recovering
   -> resolved
   -> validated
   -> closed
```

Isso não prescreve a arquitetura alvo nem um único lifecycle universal. O ponto é preservar estágios semanticamente diferentes.

### 8.3 “Silêncio” não prova resolução

Imagine que um alert desapareça porque o collector morreu.

O sistema ficou silencioso exatamente quando perdeu a capacidade de observar.

Se “ausência de alerts = resolvido”, a falha do monitor produz uma falsa recuperação.

Por isso:

```text
incident silence != service recovery
provider acknowledgement != remediation effectiveness
reachable != safely recovered
```

O fechamento de um incidente exige evidência suficiente para seus critérios de resolução e validação.

---

## 9. Remediação: observar uma falha não concede autoridade para consertar tudo

Durante um incidente, pode ser necessário:

- rollback de deployment;
- failover de provider;
- redrive de workflow;
- rotação de credencial;
- restauração de dados;
- alteração de routing;
- isolamento de workload.

Observabilidade pode coordenar a resposta e registrar tentativa, evidência e resultado. Mas não se torna dona dessas ações.

```text
Incident detects/coordinates
        |
        +--> Deployment owner: rollback eligibility + actuation
        +--> Provider owner: failover/cutover eligibility
        +--> Workflow owner: redrive semantics
        +--> Secrets/Trust owner: credential rotation
        +--> Recovery owner: restore/failover safety
```

Isso impede que “modo incidente” se transforme em uma superautoridade.

`DECIDIDO` — Planning A preserva explicitamente essa fronteira. Observabilidade pode solicitar ou coordenar uma ação, mas a actuation continua pertencendo ao owner autorizado.

### Operação urgente também pode resultar em UNKNOWN

Suponha que o operador pressione “failover” e a chamada ao provider dê timeout.

O efeito pode ser:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Urgência não muda a física do sistema distribuído.

Se `UNKNOWN`, continua valendo:

```text
UNKNOWN -> reconcile-before-retry
```

Repetir cegamente uma remediação pode piorar o incidente.

---

## 10. Incident timeline e post-incident evidence: preservar história, não reescrevê-la

Depois de um incidente, é comum surgir uma narrativa melhor do que a disponível durante a crise.

Às 14h, a equipe acreditava que o banco era a causa.

Às 16h, novas evidências mostram que o problema começou em um provider de autenticação.

A correção saudável não é apagar a hipótese das 14h e fingir que ninguém a adotou. Aquela hipótese pode ter influenciado decisões reais.

Uma abordagem revision-aware preserva:

```text
Assessment A
  produced at 14:00
  based on EvidenceSet E1

Assessment B
  supersedes A at 16:00
  based on E1 + E2 + E3
  explanation: new evidence changed causal assessment
```

Isso conecta Observabilidade ao conceito de lineage estudado desde os primeiros capítulos.

**Correção não é apagamento.**

Um post-incident record pode incluir:

- timeline;
- evidências;
- impacto;
- hipóteses causais;
- remediações;
- residual risks;
- follow-up obligations.

Ele pode gerar propostas de mudança. Não pode silenciosamente alterar policy, arquitetura, workflow ou domínio em nome dessas propostas.

---

## 11. Observabilidade e os três estados do deployment

No Capítulo 11 vimos:

```text
desired state
!= observed state
!= effective state
```

Observabilidade é fundamental para a segunda e a terceira partes, mas não é dona da intenção de deployment.

### Exemplo

Deployment deseja 4 replicas.

Provider informa 4 running.

Observabilidade mede:

- 4 processes vivos;
- 4 health checks respondendo;
- somente 2 recebendo tráfego;
- 1 com erro de conexão ao banco;
- 1 com telemetry gap.

Nesse cenário, “4 replicas running” é uma observação útil, mas não prova serviço efetivo.

A evidence layer permite ao Deployment/Runtime e, quando necessário, Architecture Reconciliation comparar intenção e realidade sem entregar a Observabilidade o poder de redefinir a intenção.

---

## 12. Observabilidade e Architecture Reconciliation

As duas capabilities são próximas, mas diferentes.

**Observabilidade** pergunta:

> O que conseguimos observar e qualificar sobre o sistema?

**Architecture Reconciliation** pergunta:

> O que essas observações significam quando comparadas ao estado desejado/canônico e quais divergências precisam de owner e fechamento?

Uma forma resumida:

```text
Desired / canonical truth
       |                         
       |                         
       v                         
Architecture Reconciliation <--- Qualified operational evidence
                                      ^
                                      |
                                 Observability
```

Observabilidade não deve fabricar um estado desejado ausente. Reconciliation não deve fabricar uma evidência operacional ausente.

Se a evidência não permite comparação segura, `INCONCLUSIVE` continua sendo um resultado legítimo.

---

## 13. Observabilidade não prova segurança, compliance ou recuperação sozinha

### 13.1 Segurança

“Porta 443 responde” não prova que a identidade do servidor é confiável.

“Não há alerts de ataque” não prova ausência de comprometimento.

Observabilidade fornece sinais e evidências; Security/Trust/PKI possuem outras qualificações que serão aprofundadas no próximo capítulo.

### 13.2 Compliance

Um dashboard pode demonstrar 99,99% de disponibilidade e, ainda assim, o sistema violar uma obrigação de retenção ou segregação de funções.

```text
SLO PASS != Compliance PASS
```

Governance decide quais evidências satisfazem um controle.

### 13.3 Recuperação

Um serviço pode voltar a responder antes de estar seguro para retorno.

Dados podem estar inconsistentes. Credenciais podem ainda estar comprometidas. Um restore pode ter recuperado apenas parte da população.

Logo:

```text
reachable != recovered
recovered != validated safe return-to-service
```

Observabilidade ajuda a fornecer a evidência. Security/Resilience/Recovery mantêm a qualificação própria do retorno seguro.

---

## 14. Provider substitution em observabilidade: a troca pode destruir continuidade epistemológica

Trocar um backend de métricas parece simples até percebermos que cada provider pode possuir:

- regras de sampling diferentes;
- agregações diferentes;
- timestamps diferentes;
- semantic conventions diferentes;
- retention diferente;
- alert grouping diferente;
- deduplication diferente.

Durante coexistência, é possível ter:

```text
Provider A -> cohort histórico
Provider B -> cohort novo
```

Um dashboard que soma ambos sem preservar lineage pode criar uma série aparentemente contínua que nunca existiu sob a mesma semântica.

A pergunta não é apenas “os dados chegaram ao novo provider?”. Também precisamos perguntar:

- o measurement profile é comparável?
- os scopes são equivalentes?
- a população observada mudou?
- existe overlap?
- existem residual dashboards/caches/alerts ainda ligados ao provider antigo?
- a revisão dos thresholds é a mesma?

Essa é uma aplicação direta da coexistência e dos revision vectors do Capítulo 13.

---

## 15. Clock skew, atraso e ordem causal

Em sistemas distribuídos, timestamps não são uma verdade perfeita sobre causalidade.

Imagine:

```text
Servidor A: 10:00:01 -> envia request
Servidor B: 09:59:59 -> recebe request
```

Os relógios estão desalinhados.

Se o incidente for ordenado apenas pelos timestamps crus, parece que a resposta aconteceu antes da requisição.

Além disso, um evento produzido primeiro pode chegar depois por causa de:

- filas;
- retries;
- buffering offline;
- rede;
- batch ingestion.

Por isso, observabilidade precisa distinguir quando possível:

- event time;
- ingestion time;
- observation time;
- causal/correlation relationships;
- uncertainty.

Isso não significa que todo sistema precise implementar relógios lógicos complexos. Significa que a narrativa operacional não pode tratar timestamps como causalidade absoluta quando a própria infraestrutura não oferece essa garantia.

---

## 16. Privacy e security leakage: observar também pode vazar conhecimento

Telemetria é dado.

Logs podem conter:

- nomes;
- e-mails;
- payloads;
- IDs empresariais;
- secrets por erro de instrumentação;
- informações sobre comportamento de usuários.

Mesmo quando cada evento isolado parece inofensivo, a agregação pode revelar algo sensível.

Exemplo:

```text
log A -> pessoa acessou sistema X
trace B -> serviço Y foi chamado
metric label C -> Station Z
alert D -> volume incomum em horário específico
```

A composição pode permitir inferir atividade empresarial ou pessoal que nenhuma peça isolada revelava claramente.

O pipeline adversarial atual explicitamente reconhece o risco de **cumulative inference** através de telemetry, logs, traces, alerts e incident history.

Portanto:

```text
Operational usefulness != unrestricted visibility
```

Enterprise → Station → Role → Person continua limitando exposição e autoridade. Observabilidade não é uma exceção ao least privilege.

---

## 17. IA em observabilidade: excelente assistente, péssima fonte automática de verdade

Observabilidade é um terreno muito atraente para IA porque contém grandes volumes de evidência e correlações.

Uma IA pode ajudar a:

- resumir incidentes;
- agrupar sinais relacionados;
- sugerir hipóteses;
- comparar timelines;
- recomendar runbooks;
- apontar gaps de evidência;
- explicar dashboards.

Mas há riscos específicos.

### 17.1 Hallucinated evidence

A IA não pode inventar uma métrica ausente para completar uma narrativa.

### 17.2 False certainty

Ela não pode transformar `INCONCLUSIVE` em “provavelmente saudável” e apresentar isso como PASS.

### 17.3 Alert/action loops

Considere:

```text
AI detects high latency
 -> scales service
 -> scaling temporarily increases latency
 -> AI sees higher latency
 -> scales again
 -> resource exhaustion
```

Cada ação isolada pode parecer racional. A composição forma um loop perigoso.

### 17.4 Authority amplification

Uma IA pode sugerir “faça rollback”. Isso não lhe dá autoridade para realizar rollback.

A regra permanece:

```text
AI recommendation != actuation authority
```

`DECIDIDO` — Planning A estabelece que IA/AGWS podem resumir, correlacionar, formular hipóteses e sugerir runbooks, mas não fabricar evidência, converter `INCONCLUSIVE` em PASS, ocultar evidência obrigatória ou ampliar autoridade.

---

## 18. O que já existe no System Builder atual

Até aqui falamos predominantemente da compreensão G2. É importante separar isso do produto existente.

`EVIDENCIADO NO SB ATUAL` — Planning B encontrou uma base significativa no pacote `observe`.

### 18.1 DeploymentObservation determinístico

O SB possui `DeploymentObservation` derivado de `DeploymentRecord`, preservando identidades de deployment, release e environment, timestamps, status e health checks. O `observationId` é calculado de forma determinística e validado novamente na desserialização.

Isso é mais forte do que simplesmente imprimir logs.

### 18.2 Evidence provenance

Existe uma extensão versionada de provenance de evidência com:

- `evidenceId` canônico;
- sources tipados;
- capture time/author/correlation/location opcionais;
- classification/confidence opcionais;
- transformations com referências de tool/provider;
- predecessor evidence lineage.

A normalização é fail-closed e determinística.

Esse é um ponto particularmente alinhado à direção conceitual deste capítulo: **provider identity permanece metadata de provenance, não identidade canônica da evidência**.

### 18.3 Findings correlacionados

Também existem `DeploymentFinding` determinísticos com:

- severity;
- confidence;
- code/message;
- correlação obrigatória com deployment observation;
- referências opcionais a operation/runtime/process/session.

O sistema atual consegue derivar findings para falha de deployment e health-check failures.

### 18.4 Publication separada da verdade de deployment

A publicação de findings é separada da derivação e do resultado autoritativo de deployment. Uma falha no canal de publicação não reescreve o outcome do deployment.

Essa boundary é importante porque evita transformar “não consegui reportar” em “o deployment não aconteceu”.

---

## 19. O que o SB atual ainda não evidencia como capability generalizada

Planning B também é explícito sobre as lacunas.

`ABERTO/INCONCLUSIVO quanto à implementação G2 completa` — fresh main não evidencia ainda, de forma generalizada:

- modelo canônico amplo para logs, metrics e traces;
- governance de signal schema/semantic conventions;
- freshness/currentness/coverage explícitos para toda evidência;
- SLI/SLO objective/budget/burn semantics;
- lifecycle geral de alert;
- lifecycle geral de incident;
- diagnostic sessions/evidence bundles;
- response/remediation coordination com effect qualification;
- post-incident correction/supersession generalizada;
- provider qualification/substitution para telemetry/alerting/incident backends;
- offline buffering/replay geral;
- autoridade operacional completa por `Enterprise → Station → Role → Person`.

O `DeploymentHealthCheck` atual é binário `PASS|FAIL`. Isso **não equivale** ao modelo G2 mais rico com `PARTIAL`, `INCONCLUSIVE`, coverage e applicability.

Da mesma forma, confidence em um finding não substitui currentness da evidência.

---

## 20. Como a pesquisa tenta quebrar esta capability

Uma pesquisa séria de observabilidade não pergunta apenas “o dashboard mostra dados?”. Ela tenta produzir cenários em que dados aparentemente válidos sustentam conclusões inválidas.

O Full Pass 2 usou, entre outras técnicas:

- análise de lineage de telemetria;
- diferencial de missingness/coverage;
- reconstrução causal sob clock skew e delayed ingestion;
- provider-substitution cohort analysis;
- stale-view/cache divergence;
- incident-state concurrency interleavings;
- propagação de `PARTIAL/UNKNOWN`;
- offline evidence horizons;
- recovery-safety counterfactuals;
- resource-exhaustion pressure;
- mutações de composição AI/low-code.

O objetivo de cada técnica é diferente.

### Missingness/coverage differential

**O que é:** variar quais partes da população deixam de produzir evidência.  
**Detecta:** falsas conclusões globais a partir de subconjuntos.  
**Exemplo:** somente runtimes saudáveis continuam enviando heartbeat.  
**Limitação:** não prova sozinho por que a evidência sumiu.  
**No SB:** testa se ausência parcial pode ser promovida indevidamente a HEALTHY.

### Causal-order reconstruction

**O que é:** embaralhar relógios, ingestão e chegada de eventos.  
**Detecta:** timelines e diagnósticos que confundem ordem de chegada com causalidade.  
**Exemplo:** resposta aparenta anteceder requisição por clock skew.  
**Limitação:** causalidade empresarial pode exigir evidência de outros owners.  
**No SB:** testa se correlação operacional mantém incerteza suficiente.

### Provider-substitution cohort analysis

**O que é:** observar old/new providers coexistindo.  
**Detecta:** séries, alerts e dashboards que misturam semânticas incompatíveis.  
**Exemplo:** threshold novo aplicado retroativamente à série antiga.  
**Limitação:** exige conhecer as revisões e support differences relevantes.  
**No SB:** conecta observabilidade a provider binding e lifecycle.

### Recovery-safety counterfactual

**O que é:** perguntar “qual evidência pareceria saudável mesmo se a recuperação ainda fosse insegura?”.  
**Detecta:** false recovery.  
**Exemplo:** endpoint responde enquanto dataset restaurado está incompleto.  
**Limitação:** retorno seguro continua pertencendo ao owner de Recovery/Security.  
**No SB:** impede que health genérico substitua recovery qualification.

O revisit do Full Pass 2 não encontrou nova família material após duplicate screening; os casos se reduziram a padrões já catalogados de coverage, alert/condition separation, revision skew, operational authority e famílias transversais de currentness, residual cohorts, ACK/effect, UNKNOWN, privacy e resource boundedness.

Isso não fecha a pesquisa. O state autoritativo consultado antes desta publicação mantém a campanha `ACTIVE / NOT_SATURATED`, com o Full Pass 3 ainda em andamento e Observability como próximo foco adversarial.

---

## 21. Um exemplo integrado: a OS “presa” que o dashboard não entende sozinho

`EXEMPLO DIDÁTICO`

Uma empresa possui o seguinte processo:

```text
Cliente abre OS
   -> triagem
   -> atribuição à Station
   -> técnico executa
   -> supervisor valida
   -> OS encerrada
```

Às 08h, uma nova release entra em produção.

Às 08h30, os dashboards mostram:

- API availability: 100%;
- DB health: PASS;
- CPU: normal;
- workflow worker: running;
- HTTP latency: dentro do SLO.

Às 09h, alguém percebe que nenhuma OS criada após 08h05 foi atribuída aos técnicos.

A investigação encontra:

1. requests de criação foram aceitos;
2. registros foram persistidos;
3. evento de atribuição foi publicado;
4. novo consumer estava running;
5. o consumer usava um binding de Station incompatível com a revisão atual;
6. os eventos foram rejeitados semanticamente;
7. a métrica de infraestrutura continuou verde.

O aprendizado não é “precisamos de mais dashboards”.

É que cada afirmação precisava do owner correto:

```text
API reachable                 -> evidência operacional
DB reachable                  -> evidência operacional
consumer running              -> evidência operacional
message accepted              -> Messaging evidence
assignment transition valid   -> Process/Workflow semantics
Station binding current       -> Authorization/Organization semantics
OS effectively assigned       -> domain/process postcondition
```

Observabilidade ajuda a conectar essas evidências e criar um incident. Ela não deve substituir os owners que definem o significado de “OS atribuída corretamente”.

Esse é o papel de uma boa arquitetura de evidência: permitir enxergar o sistema sem transformar o observador em dono de tudo.

---

## 22. Trade-offs: quanto observar?

Mais observabilidade não é gratuitamente melhor.

### Custo

Mais métricas, traces e retenção consomem storage, processamento, rede e dinheiro.

### Cardinalidade

Labels excessivamente detalhadas podem explodir o número de séries.

### Performance

Instrumentation pode afetar o próprio sistema observado.

### Privacy

Logs e traces podem carregar dados sensíveis.

### Cognitive overload

Milhares de alerts reduzem a capacidade humana de identificar o que realmente importa.

### False confidence

Um sistema extremamente instrumentado ainda pode observar a coisa errada.

Portanto o problema é de **qualificação**, não de maximização de volume.

Uma boa pergunta não é:

> “Quantos dados operacionais temos?”

É:

> “Temos a evidência correta, com lineage, coverage e currentness suficientes para sustentar esta decisão?”

---

## 23. Relação com os próximos capítulos

Este capítulo prepara diretamente três assuntos seguintes.

### Capítulo 15 — Segurança, confiança, PKI, secrets e recuperação

Observabilidade fornece parte da evidência necessária para detectar falhas e provar recuperação. Mas trust e retorno seguro exigem semânticas próprias.

### Capítulo 17 — Famílias de teste

Muitos testes adversariais mencionados aqui serão formalizados: happy path, edge case, failure case, negative-space e outros.

### Capítulo 18 — Concorrência, retries, efeitos parciais e UNKNOWN

Incident response acontece sob pressão e concorrência. É exatamente onde retries cegos, stale state e efeitos ambíguos se tornam perigosos.

Também prepara o Capítulo 20, onde técnicas como chaos, property-based testing, version-skew e model checking serão tratadas de forma mais sistemática.

---

## 24. O que você deve guardar deste capítulo

1. **Observabilidade é uma capability de evidência operacional, não um substituto para a verdade canônica dos outros domínios.**
2. `Signal != confirmed condition`; correlação não é automaticamente causalidade.
3. Métricas, logs, traces e events só ganham significado seguro com identidade, provenance, revisão, scope, tempo, coverage e incerteza suficientes.
4. Freshness, currentness e coverage são diferentes. Dados recentes podem ser inaplicáveis; dados parciais não sustentam automaticamente conclusão global.
5. `INCONCLUSIVE` é um resultado necessário quando a evidência não permite afirmar HEALTHY ou UNHEALTHY com segurança.
6. SLI/SLO medem objetivos operacionais; Observabilidade não vira dona de toda regra empresarial que motivou esses objetivos.
7. Alert, incident, notification delivery, acknowledgement, remediation e condition resolution são estados distintos.
8. Incident urgency não concede superautoridade. Remediações continuam pertencendo aos semantic owners que podem atuá-las com segurança.
9. `UNKNOWN -> reconcile-before-retry` continua valendo durante incidentes.
10. Provider IDs de métricas, traces, alerts e tickets são realization identities; não devem substituir silenciosamente identidades canônicas.
11. O SB atual já possui fundações reais de deployment observations, evidence provenance, deterministic findings e publication separation, mas ainda não evidencia todo o modelo enterprise-wide da G2.
12. O objetivo não é coletar o máximo possível. É produzir **evidência suficientemente qualificada para a afirmação e decisão corretas**.

---

## Referências autoritativas principais consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_A_OBSERVABILITY_OPERATIONS_INCIDENT_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_OBSERVABILITY_OPERATIONS_INCIDENT_SB_CURRENT_STATE.md`
- `project_docs/generation-2/research/edge-cases/OBSERVABILITY_OPERATIONS_INCIDENT_FULL_PASS_2_REVISIT.md`

Referências conceituais internas relevantes: Capítulos 03, 06, 07, 11, 12 e 13. O texto acima é uma síntese didática e não cria decisão arquitetural nova.