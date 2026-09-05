# Capítulo 11 — Deployment, runtime autônomo, workload e escalabilidade — v1.0.0

**ID editorial:** `CHAPTER_11`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não substitui pesquisa, síntese, Planning A/B nem futura arquitetura alvo.

## 1. O problema humano: ter o artefato certo não significa ter o sistema certo operando

No Capítulo 10 acompanhamos o caminho até um artefato e uma release identificáveis. Isso ainda não responde à pergunta que interessa a quem depende do sistema durante o expediente: **o serviço correto está realmente operando, no lugar correto, com as dependências corretas e atendendo os consumidores corretos?**

Imagine uma empresa com equipes de manutenção usando um sistema de ordens de serviço. Uma nova release foi aprovada e publicada. O deploy retorna sucesso. O processo aparece como “running”. Ainda assim, os técnicos podem continuar chegando à revisão antiga por uma rota não atualizada. O processo novo pode estar saudável, mas incapaz de acessar o banco. Metade dos workers pode ter recebido uma configuração e a outra metade outra. Um autoscaler pode declarar cinco replicas enquanto apenas três estão prontas para trabalho real.

Esses casos parecem variações do mesmo problema, mas carregam verdades diferentes. Por isso a Generation 2 preserva a cadeia:

```text
release admissível
    ↓
deployment desejado
    ↓
actuation no provider
    ↓
recursos observados
    ↓
rollout convergido
    ↓
readiness qualificada
    ↓
tráfego efetivo
    ↓
serviço efetivo para o consumidor
```

**DECIDIDO em Planning A:** essas etapas não devem ser colapsadas. Em particular:

```text
build result
    != released artifact
    != deployed state
    != consumer/runtime-effective state
```

A finalidade deste capítulo é explicar por que essa separação existe e como ela permite conciliar simplicidade operacional, autonomia do runtime, escalabilidade e substituição futura de infraestrutura.

---

## 2. Deployment não é apenas “subir um container”

**Deployment** é a realização intencional de uma release admissível como estado operacional de um serviço ou workload em determinado ambiente.

O termo é usado informalmente para muitas coisas: copiar arquivos, executar um script, criar um container, atualizar Kubernetes, publicar uma função serverless ou iniciar um processo. Para a G2, essas são **mecânicas de realização**. A semântica de Deployment precisa sobreviver à troca dessas mecânicas.

Planning A atribui a Deployment / Environment / Runtime a propriedade de conceitos como:

- identidade canônica do deployment;
- identidade e revisão do ambiente operacional;
- plano release-to-runtime;
- estado desejado, observado e efetivo;
- rollout e seus cohorts;
- placement;
- scaling;
- traffic transitions;
- readiness e service effectiveness;
- retained runtime closure;
- rollback de runtime;
- coexistência, cutover e drainage durante substituição.

Isso não torna Deployment dono da release, do schema, do secret, da política de autorização ou da observabilidade. Ele **consome** essas verdades para decidir se o runtime pretendido foi efetivamente realizado.

---

## 3. Identidade canônica versus identidade da infraestrutura

Suponha que o mesmo sistema possa ser executado hoje como um processo local e amanhã em outro runtime provider. Se o identificador de Deployment for simplesmente o PID, container ID, pod UID ou deployment ID da nuvem, a identidade do que a empresa pretende operar muda junto com a ferramenta.

A G2 separa:

```text
DeploymentIdentity canônica
        !=
process/container/pod/cloud resource ID
```

O primeiro representa a intenção operacional do SB. Os demais representam realizações concretas.

**EVIDENCIADO NO SB ATUAL:** Planning B encontrou `deploymentId` controlado pelo SB e `environmentRef` provider-neutral, separados de process IDs. O deployment atual é derivado de release, environment, release hash, janela temporal, checks e bindings, sem canonizar um ID externo de infraestrutura.

Esse é um exemplo de anti-lock-in sem abstração vazia: não se finge que infraestruturas são iguais; apenas não se entrega a elas a identidade canônica do domínio.

---

## 4. Ambiente não é apenas “prod”

Em sistemas pequenos, costuma-se escrever:

```text
ENV=production
```

Isso é útil, mas semanticamente pobre. Um **Environment** na fronteira G2 é um contexto operacional revisionado. Ele pode carregar ou referenciar requisitos como:

- runtime suportado;
- configurações;
- secret references;
- bindings externos;
- storage/database requirements;
- trust requirements;
- placement/residency constraints;
- conectividade;
- política operacional;
- horizonte de operação desconectada.

O nome `prod` pode continuar existindo como uma referência amigável. O erro seria tratá-lo como descrição suficiente de tudo isso.

**EVIDENCIADO NO SB ATUAL:** já existe `EnvironmentProfile` provider-neutral com `environmentRef`, versões de runtime suportadas e bindings simbólicos, incluindo referências de configuração e secrets. Planning B considera isso uma base real, porém estreita: ainda não é um Operational Profile geral da G2.

---

## 5. Desired, observed e effective: três verdades que não podem ser confundidas

Essa é uma das distinções mais importantes do capítulo.

### 5.1 Desired state — o que queremos

O **estado desejado (desired state)** expressa a intenção operacional canônica.

Exemplo:

```text
release: OS 4.2
replicas desejadas: 4
região elegível: BR-South
traffic: 100% para geração 42
```

### 5.2 Observed state — o que vimos

O **estado observado (observed state)** é evidência do que uma realização ou provider relata ou permite observar.

Exemplo:

```text
4 processos encontrados
4 health endpoints responderam
route object aponta para target X
```

Essa observação pode estar stale, incompleta ou até contraditória.

### 5.3 Effective state — o que está efetivamente valendo

O **estado efetivo (effective state)** é a conclusão qualificada de que a intenção está de fato sendo servida sob os critérios aplicáveis.

Exemplo:

```text
4 workloads corretos
+ dependências qualificadas
+ schema/config/trust compatíveis
+ rota atingindo a geração correta
+ consumer probe bem-sucedido
= effective generation 42
```

Assim:

```text
desired != observed != effective
```

Um provider pode dizer “update accepted”. Isso não prova nem observed convergence, nem effective service.

**HIPÓTESE DE ARQUITETURA:** a forma concreta de armazenar gerações desejadas/observadas/efetivas será decidida em fases posteriores. Planning A já decidiu apenas que as verdades precisam permanecer distinguíveis.

---

## 6. Generation: saber qual intenção uma observação está tentando provar

Se a configuração muda enquanto ainda estamos recebendo health reports da revisão anterior, a pergunta “está saudável?” fica incompleta.

Precisamos perguntar:

> saudável para qual geração desejada?

Uma **deployment generation** é uma forma de relacionar evidência operacional à revisão da intenção que ela pretende realizar.

Considere:

```text
G41: release 4.1 + config C7
G42: release 4.2 + config C8
```

Um health check de G41 pode ser verdadeiro historicamente e inútil para provar G42.

É o mesmo princípio de currentness já visto em identidade, autorização, dados e cálculo: evidência verdadeira em um contexto anterior não deve ser promovida silenciosamente a prova atual.

---

## 7. Workload: a unidade de trabalho operacional

**Workload** é uma unidade operacional que executa trabalho sob um perfil de runtime. Dependendo da realização, pode aparecer como processo, container, VM, função, job, worker ou outro mecanismo.

O importante é não definir workload como “container”. Container é uma realização popular; workload é o conceito mais geral.

Exemplos no contexto empresarial:

- runtime web da aplicação de OS;
- worker que processa notificações;
- job periódico de consolidação;
- executor de workflows;
- serviço de geração documental;
- componente de integração com um provider externo.

Uma implantação pequena pode colocar vários papéis no mesmo processo. Uma implantação maior pode separá-los.

Isso retoma a ideia do Capítulo 04:

```text
topologia física pode colapsar
sem colapsar identidades semânticas
```

A G2 não exige microserviços para ser modular. Ela exige que a simplicidade física não destrua as fronteiras necessárias para compreender, evoluir e qualificar o sistema.

---

## 8. Runtime autônomo: autonomia é uma propriedade qualificada

A visão do System Builder procura evitar que o sistema gerado dependa permanentemente do Builder para funcionar. Isso é **runtime autonomy**.

Uma definição ingênua seria:

> “se o Builder cair, o sistema precisa funcionar para sempre”.

Isso é forte demais e tecnicamente enganoso. Um sistema pode depender de database, secrets, trust, policies, providers e credenciais com validade limitada.

Planning A usa uma ideia mais precisa: o runtime pode continuar dentro de uma **retained runtime closure** e de um horizonte operacional declarado.

```text
Retained runtime closure
├── artefatos necessários
├── runtime dependencies
├── configuração materializada
├── secret material/reference resolvido
├── trust material/evidence
├── schema/data compatibility
├── policy/authority local necessária
├── provider bindings necessários
└── evidência operacional aplicável
```

Autonomia, portanto, significa:

```text
independência do control plane do Builder
        sob closure + horizonte qualificados
```

Não significa independência de toda infraestrutura do mundo.

### 8.1 O que fazer quando currentness expira?

Um runtime desconectado não ganha autoridade para inventar fatos ausentes. Se uma credencial, trust assertion, policy snapshot ou binding ultrapassa seu horizonte de validade, o comportamento deve degradar ou falhar de acordo com política superior.

Depois da reconexão:

```text
reconnect
  ↓
reconcile
  ↓
requalify
  ↓
só então tratar estado local como atual
```

---

## 9. O SB atual já prova uma forma importante de autonomia

Planning B encontrou evidência concreta e forte no baseline atual.

**EVIDENCIADO NO SB ATUAL:**

1. o deployment consome `PublishedRelease` e artefato verificado;
2. valida compatibilidade de runtime e bindings;
3. rejeita secrets embutidos onde só referências simbólicas são permitidas;
4. materializa os arquivos gerados em diretório isolado;
5. executa preflight e migrations verificadas;
6. inicia o `runtime-entry.mjs` gerado;
7. valida startup/health;
8. persiste deployment records;
9. mantém um active deployment canônico separado do processo efêmero;
10. consegue reconstruir um runtime ausente após restart do manager;
11. possui testes em que Builder/Observe URLs ficam indisponíveis e o runtime continua operando.

Isso é importante porque autonomia não está apenas desenhada no papel. Há um caminho bounded do produto atual que já prova a ideia.

Ao mesmo tempo, isso **não prova** operação desconectada genérica, múltiplos providers, topology/traffic/scaling distribuídos ou closure com todos os horizons possíveis.

---

## 10. Active deployment não é o mesmo que processo vivo

Um processo pode morrer sem que a empresa tenha decidido mudar qual deployment deve ser o ativo.

Planning B encontrou uma separação muito saudável:

```text
canonical active deployment
        !=
ephemeral runtime process
```

O `SingleHostRuntimeReconciler` consegue reconstruir o processo faltante a partir da verdade durável do deployment ativo.

Essa distinção reduz um erro clássico de sistemas de controle: deixar o estado transitório da infraestrutura se transformar, por acidente, em verdade canônica.

### 10.1 Um exemplo humano

Pense em uma escala de trabalho. A escala registrada diz que Maria está no turno. Se Maria perde o crachá e recebe outro, o identificador físico do crachá muda; a escala não deveria concluir que outra pessoa assumiu o turno.

A analogia deixa de valer em detalhes técnicos — processos não são pessoas —, mas ilustra por que identidade operacional e realização efêmera precisam ser separadas.

---

## 11. Concorrência de deploy: dois operadores podem tentar mudar a verdade

Suponha que A seja o deployment ativo. Dois agentes leem A e, quase simultaneamente, tentam promover B e C.

Sem proteção, pode ocorrer um last-writer-wins acidental:

```text
A → B
A → C
```

Ambos acreditando que substituíram A.

**EVIDENCIADO NO SB ATUAL:** o armazenamento de Deployment possui promoção atômica com `expectedActiveDeploymentId`. Os resultados incluem `activated`, `retained-active`, `rejected-no-active` e `stale-active`.

Isso produz uma propriedade similar a compare-and-swap:

```text
“promova B somente se A ainda for ativo”
```

Se outro agente já mudou a autoridade ativa, a segunda promoção é reconhecida como stale em vez de sobrescrever silenciosamente a decisão anterior.

Esse mecanismo é pequeno, mas contém uma ideia arquitetural profunda: **a verdade operacional precisa ser protegida contra writers concorrentes**.

---

## 12. Rollout: mudança operacional é um processo, não um instante

Quando existem múltiplas instâncias, workers, regiões ou grupos, uma nova geração raramente aparece em todos os lugares ao mesmo tempo.

Um **rollout** é a progressão governada de uma geração desejada através de stages ou cohorts até convergência ou interrupção.

Exemplos conhecidos:

- rolling update;
- canary;
- blue/green;
- substituição por lote;
- atualização por Station/filial;
- atualização progressiva por grupo de consumidores.

A G2 não canoniza nenhuma dessas técnicas como única estratégia. O conceito portátil é a existência de:

```text
RolloutIdentity
+ strategy revision
+ stages/cohorts
+ progress evidence
+ pause/resume/abort
+ convergence qualification
```

**NÃO EVIDENCIADO NO SB ATUAL COMO MODELO GERAL:** Planning B encontrou realização single-host/local-process, não um rollout distribuído first-class.

---

## 13. Readiness: “está rodando” é uma afirmação fraca

Um processo pode existir e ainda não estar pronto para atender o trabalho pretendido.

Exemplo:

```text
process running = true
DB reachable = false
schema compatible = ?
route effective = false
```

Dizer apenas `ready=true` pode esconder o que foi realmente qualificado.

Planning A trata **readiness** como uma qualified claim. Dependendo do workload, ela pode exigir:

- processo vivo;
- dependências disponíveis;
- migrations concluídas;
- configuration compatível;
- trust current;
- armazenamento acessível;
- rota correta;
- consumer probe;
- SLO/operational validation, quando aplicável.

Se a evidência é insuficiente:

```text
INCONCLUSIVE
```

é mais honesto que transformar ausência de conhecimento em PASS.

---

## 14. Traffic effectiveness: uma rota existente não prova quem está sendo atendido

Durante uma troca de versão, pode haver dois runtimes saudáveis:

```text
G41 healthy
G42 healthy
```

Mas a pergunta empresarial é: **qual geração está recebendo o tráfego dos consumidores pretendidos?**

A semântica precisa distinguir:

```text
desired route/weight
    ↓
provider accepted
    ↓
observed routing config
    ↓
effective traffic behavior
```

Um objeto de ingress ou load balancer configurado não é, sozinho, prova de que requests reais chegam ao target pretendido.

Essa diferença será importante novamente nos capítulos de observabilidade e conflitos processuais: configuração válida e efeito real são classes distintas de verdade.

---

## 15. Scaling: querer cinco replicas não significa possuir cinco unidades efetivas de capacidade

Scaling é frequentemente resumido a “aumentar replicas”. A G2 separa pelo menos:

```text
desired capacity
provider-accepted target
observed running capacity
ready capacity
effective service capacity
```

Esses números podem divergir.

### 15.1 Exemplo

Uma empresa recebe pico de chamados às 8h. O autoscaler pede 10 workers.

- target = 10;
- provider criou 10 containers;
- 8 iniciaram;
- 7 passaram readiness;
- 6 conseguem alcançar o provider de email necessário ao workload.

Qual é a capacidade?

Depende da pergunta. Para executar aquele trabalho completo, talvez seja 6.

Essa distinção impede que métricas de infraestrutura substituam silenciosamente a semântica de serviço.

### 15.2 Autoscaling como provider mechanic

Um provider pode oferecer autoscaling sofisticado. Outro pode usar scripts simples. O semantic owner de Deployment precisa preservar os requisitos e a evidência de capacidade, sem transformar a implementação de um provider em contrato universal.

---

## 16. Placement: “onde” também pode ter semântica

Placement decide locais/topologias elegíveis para workloads.

Isso pode envolver:

- região;
- site;
- zona/failure domain;
- host class;
- proximidade de dados;
- residency;
- trust boundaries;
- capacidade disponível;
- requisitos de hardware.

Um scheduler dizer “scheduled” não prova que o placement é semanticamente elegível. Por exemplo, Privacy/Data Governance pode proibir que certos dados sejam processados em determinada jurisdição.

Deployment consome essa constraint; não redefine a regra de privacidade.

---

## 17. Provider acknowledgement não é consumer-effective truth

Esse padrão aparece repetidamente no livro porque é uma das fontes mais comuns de erro em sistemas distribuídos.

```text
API 200
!=
provider effect confirmed
!=
rollout converged
!=
traffic effective
!=
consumer success
```

Ao atualizar um runtime remoto, a conexão pode cair depois de o provider ter aplicado a mudança. Nesse ponto, repetir cegamente pode produzir efeitos indesejados.

Planning A exige que mutações ambíguas possam representar:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

Para `UNKNOWN`:

```text
reconcile-before-retry
```

**NÃO EVIDENCIADO NO SB ATUAL COMO CONTRATO REMOTO GERAL:** o deploy local possui falhas explícitas e fail-closed, mas Planning B não encontrou uma camada genérica de remote deployment effects com essa álgebra completa.

---

## 18. Cutover não termina enquanto a geração velha ainda puder produzir efeito

Trocar o ponteiro principal não garante que tudo antigo parou de agir.

Podem permanecer:

- replicas antigas;
- workers com jobs em andamento;
- sessions;
- caches;
- filas/subscriptions;
- callbacks;
- load-balancer targets;
- background jobs;
- credenciais antigas ainda válidas.

Esses elementos formam **residual runtime cohorts**.

```text
new generation active
        +
old cohort still authoritative
        =
cutover incompleto
```

O antigo pode precisar ser drenado, fenced, requalificado ou explicitamente dispositioned.

Isso conecta Deployment ao Capítulo 13 sobre coexistência e ao Capítulo 18 sobre concorrência/efeitos parciais.

---

## 19. Rollback de runtime não é simplesmente “voltar a imagem anterior”

O Capítulo 10 mostrou que existir historicamente não significa continuar elegível para rollback.

Artifact/Release responde se um release anterior é **atualmente elegível** como alvo. Deployment responde pela **actuation** desse alvo e pela prova de que a operação convergiu.

Além disso:

```text
runtime rollback != data restore
```

Se uma migration transformou dados de maneira incompatível com a versão antiga, iniciar o binário anterior pode deixar o sistema ainda mais quebrado.

Rollback pode depender de:

- schema/data compatibility;
- configuration;
- trust;
- secrets;
- providers;
- integrações;
- traffic state;
- security/recovery qualification.

Logo, “temos a imagem antiga” é apenas uma peça da resposta.

---

## 20. Escalabilidade sem destruir a simplicidade inicial

A visão do System Builder precisa atender dois extremos sem exigir que todo cliente comece com a arquitetura do maior cliente.

### Cenário pequeno

```text
1 host
1 processo runtime
1 banco
bindings locais/externos simples
```

### Cenário maior

```text
múltiplos workloads
múltiplas replicas
workers especializados
traffic policy
múltiplos failure domains
providers separados
rollout por cohort
```

A chave não é obrigar o primeiro cenário a simular fisicamente o segundo. É preservar identidades e contratos suficientes para que crescer não exija reinterpretar toda a semântica.

```text
small topology
    ≠
small semantic model
```

Mas também:

```text
rich semantic model
    ≠
mandatory distributed topology
```

Esse equilíbrio é uma das justificativas do lema “Builder grande, Runtime pequeno”: o Builder pode conhecer possibilidades amplas, enquanto cada runtime materializado retém apenas a closure necessária ao workload e ao operational profile escolhido.

---

## 21. Relação com Capability, Provider e Binding

Deployment exige mecânicas que providers maduros sabem realizar muito bem: scheduling, containers, functions, load balancing, health checks, scaling e deployment APIs.

O SB não precisa reinventar isso.

A composição desejada é:

```text
Deployment semantic requirements
           ↓
Provider/Binding qualification
           ↓
realization mechanics
           ↓
qualified evidence
           ↓
Deployment decide convergence/effectiveness
```

Um provider não se torna semantic owner apenas porque possui a API que executa a ação.

No Capítulo 12 veremos esse mecanismo em profundidade: substituição não é provar que duas APIs têm os mesmos verbos, mas que suportam suficientemente as dimensões semânticas necessárias ao workload.

---

## 22. IA e low-code não ganham autoridade de infraestrutura por conveniência

Uma superfície adaptativa pode mostrar:

> “há três replicas degradadas; deseja escalar de 4 para 6?”

Uma IA pode até produzir uma proposta útil.

O que ela não deve fazer é transformar conveniência em autoridade implícita.

Planning A preserva a regra de **non-amplification**:

- IA não fabrica readiness;
- UI não transforma acknowledgement em effective truth;
- AGWS não aumenta o horizonte de operação offline;
- uma proposta não ganha provider-admin privilege por ter sido gerada automaticamente;
- placement/residency/security constraints superiores continuam válidas;
- rollback não se torna elegível porque a IA o recomenda.

A IA pode ajudar a decidir. Ela não vira semantic owner nem fonte mágica de evidência.

---

## 23. O que já existe e o que ainda está em pesquisa

### EVIDENCIADO NO SB ATUAL

Planning B encontrou uma baseline substancial:

- `deploymentId` canônico controlado pelo SB;
- `environmentRef` e bindings provider-neutral;
- admission de release/artifact verificados;
- compatibilidade de runtime;
- symbolic secret references;
- migrations verificadas antes do start;
- realização local em processo Node;
- startup/health validation;
- deployment records duráveis;
- active-runtime authority;
- promoção atômica com stale-writer protection;
- retenção do deployment anterior em falha de candidato;
- manager-restart reconciliation;
- runtime operável com Builder/Observe indisponíveis nos testes cobertos.

### ABERTO / NÃO EVIDENCIADO COMO IMPLEMENTAÇÃO GERAL

- desired deployment generation first-class;
- Operational Profile geral;
- replicas e workload topology;
- placement/site/zone constraints;
- scaling policy geral;
- canary/blue-green/traffic split;
- rollout/cutover distribuído;
- readiness/effective-service multidimensional geral;
- remote effect disposition com `UNKNOWN`;
- generalized disconnected-operation contracts;
- runtime provider support vectors/substitution;
- residual runtime cohort drainage;
- deployment-specific hierarchical authority.

### EM PESQUISA

A campanha adversarial continua ativa. Portanto, este capítulo ensina as fronteiras atuais de Planning A/B e os mecanismos necessários para compreender o problema; ele **não declara que a arquitetura alvo já foi escolhida**.

---

## 24. Um exemplo integrado: atualização do sistema de OS

Considere a release `OS-4.2`.

### Passo 1 — release disponível

A release foi publicada e passou sua qualificação. Isso ainda não muda produção.

### Passo 2 — intenção de deployment

É criada uma intenção operacional para `OS-4.2` no ambiente de produção.

### Passo 3 — autoridade e prerequisites

São qualificados bindings, config, secrets, trust, schema e demais requisitos.

### Passo 4 — desired generation

A geração G42 torna-se a intenção operacional.

### Passo 5 — actuation

O runtime provider recebe operações para realizar G42.

### Passo 6 — observation

Novos workloads aparecem. Alguns estão running; um ainda não está ready.

### Passo 7 — rollout

A geração progride pelo cohort definido. Não se promove apenas porque uma API retornou 200.

### Passo 8 — traffic

A rota é movida progressivamente para G42.

### Passo 9 — consumer-effective validation

Uma operação real de consulta/criação de OS confirma que consumers autorizados chegam à geração correta com dependências corretas.

### Passo 10 — drainage

Workers, sessions, rotas ou caches associados a G41 são drenados ou requalificados.

Só então a troca pode ser considerada convergida sob o perfil aplicável.

Esse modelo parece mais trabalhoso que “deploy succeeded”. A vantagem é que ele descreve **o que realmente pode dar errado** sem obrigar toda instalação a possuir infraestrutura complexa.

---

## 25. Riscos e trade-offs

### Mais semântica operacional custa mais modelagem

Desired/observed/effective, generations, cohorts e qualification aumentam o vocabulário. Em sistemas muito pequenos, isso pode parecer excesso.

A resposta G2 não deve ser expor toda essa complexidade ao usuário o tempo inteiro. O Builder pode oferecer defaults e topologias colapsadas, preservando internamente as distinções que se tornam necessárias quando há falha, evolução ou escala.

### Abstração excessiva pode produzir o “lowest common denominator”

Se o modelo portátil aceitar somente o que todos os providers fazem igual, perde capacidades importantes. Support vectors e profiles ajudam a representar diferenças sem transformar uma implementação em semântica universal.

### Autonomia excessiva sem currentness cria risco

Copiar policies, secrets e trust para o runtime melhora resiliência, mas cria horizontes de stale authority e revogação. Retained closure precisa ser qualificada e limitada.

### Centralização excessiva recria lock-in do Builder

Obrigar cada decisão operacional a consultar continuamente o control plane simplifica algumas políticas, mas destrói parte da autonomia que a visão do SB procura preservar.

O objetivo é um equilíbrio governado, não um extremo ideológico.

---

## 26. Relação com os próximos capítulos

Este capítulo deixa quatro pontes abertas.

O **Capítulo 12** aprofundará providers externos, binding, support vectors, substituição, coexistência e anti-lock-in.

O **Capítulo 13** tratará revision vectors, evolução, migrations, coexistência, cutover e rollback de forma transversal.

O **Capítulo 14** explicará como telemetry e evidence permitem observar sem confundir observação com verdade canônica.

O **Capítulo 18** retomará os casos em que actuation ou cutover produz `PARTIAL/UNKNOWN`, exigindo reconciliação e idempotência qualificada.

---

## O que você deve guardar deste capítulo

Deployment não é “rodar um container”; é realizar uma intenção operacional e provar que ela se tornou serviço efetivo.

Guarde especialmente estas separações:

```text
release != deployment != runtime-effective service

desired != observed != effective

running != ready != reachable != consumer-effective

provider acknowledgement != convergence

active deployment != ephemeral process

runtime autonomy != independência absoluta

rollback actuation != release eligibility != data recovery
```

A visão G2 procura permitir que um sistema pequeno rode de maneira simples e autônoma, mas sem destruir as identidades e evidências necessárias para crescer, substituir providers, sobreviver a falhas e explicar o que realmente está operando.

---

## Referências internas autoritativas consultadas

Este capítulo sintetiza principalmente:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/planning/PLANNING_A_DEPLOYMENT_ENVIRONMENT_RUNTIME_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_DEPLOYMENT_ENVIRONMENT_RUNTIME_SB_CURRENT_STATE.md`;
- conceitos de `CAPABILITY_SYNTHESIS.md` e das fronteiras de Provider/Binding, Build, Artifact/Release, Lifecycle, Observability, Secrets/Configuration, Trust e Security/Resilience, quando necessários para estabelecer boundaries.

A pesquisa adversarial permanece ativa. Eventuais findings materiais posteriores podem exigir revisão editorial bounded deste capítulo.