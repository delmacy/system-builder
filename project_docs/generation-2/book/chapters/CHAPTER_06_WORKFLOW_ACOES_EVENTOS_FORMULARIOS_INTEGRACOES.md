# Capítulo 06 — Workflow, ações, eventos, formulários e integrações — v1.0.0

**ID editorial:** `CHAPTER_06`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não substitui pesquisa, Planning A/B nem decisões futuras de arquitetura.

## 1. O problema humano: o trabalho não acontece em uma única tela

Imagine uma ordem de serviço de manutenção.

Um operador abre a OS. Um supervisor analisa. O sistema reserva material. Um técnico recebe a tarefa. Talvez seja preciso esperar uma peça chegar amanhã. Depois da execução, alguém registra horas, outro confirma o serviço e um sistema externo recebe uma atualização.

Nenhuma dessas etapas, isoladamente, é particularmente misteriosa. O problema aparece porque o trabalho atravessa **tempo, pessoas, sistemas, falhas e revisões**.

Se o servidor reiniciar durante a madrugada, a OS não pode esquecer que aguardava uma peça. Se um e-mail for entregue duas vezes, a aprovação não pode acontecer duas vezes por acidente. Se uma API externa responder com timeout, não podemos concluir automaticamente que nada aconteceu. Se uma pessoa tinha autoridade ontem, um processo que ficou parado por quinze dias não pode presumir que essa autoridade continua válida hoje.

É nesse ponto que entram workflow, ações, eventos, formulários e integrações. Eles se relacionam, mas não significam a mesma coisa.

> **DECIDIDO na taxonomia G2:** Process & Application Modeling possui o significado canônico do processo; Workflow & Durable Execution possui a progressão durável de uma realização executável admitida; Integration & Automation possui a travessia intencional para sistemas externos e a qualificação dos efeitos resultantes; Notifications / Events / Messaging possui semânticas de comunicação e entrega. Nenhum desses owners deve absorver silenciosamente os demais.

## 2. Do processo desenhado ao trabalho que precisa sobreviver ao tempo

No capítulo anterior vimos um grafo executável. Ele pode dizer, por exemplo:

```text
ABERTA -> EM_ANALISE -> APROVADA -> EM_EXECUCAO -> CONCLUIDA
```

Isso descreve caminhos possíveis. Mas uma empresa precisa de algo a mais: uma instância concreta precisa continuar existindo enquanto o trabalho acontece.

Considere a OS `OS-1042`:

```text
Definição do processo
        |
        v
Instância OS-1042
        |
        +-- estado atual: AGUARDANDO_PECA
        +-- revisão executável: R17
        +-- tarefa humana pendente: confirmar recebimento
        +-- timer: reavaliar em 24h
        +-- efeito externo: pedido ao fornecedor ainda UNKNOWN
        +-- histórico: preservado
```

Essa persistência do progresso é o núcleo de **durable execution**, ou execução durável.

### 2.1 Workflow não é simplesmente uma sequência de funções

Uma sequência comum em código pode desaparecer quando o processo termina ou falha. Um workflow durável precisa representar o trabalho como algo que pode ser retomado, observado e reconciliado.

**Workflow instance**, ou instância de workflow, é a identidade de uma execução concreta de uma definição executável. Ela não deve ser confundida com o ID de um worker, container, fila ou engine externa.

**Durable history**, ou histórico durável, é o registro suficiente para preservar a progressão e as evidências relevantes da execução. Não significa necessariamente guardar para sempre cada detalhe técnico. Significa não apagar aquilo que ainda é necessário para compreender, retomar, reconciliar, auditar ou migrar a execução.

> **EVIDENCIADO NO SB ATUAL:** existe uma base provider-neutral com processos, estados, transições lógicas, `initialState`, `instanceId` e persistência SQL do estado corrente. A validação de transição é determinística e o runtime gerado continua autônomo do Builder.
>
> **NÃO EVIDENCIADO COMO CONTRATO COMPLETO:** histórico durável revision-qualified, timers, waits, human tasks, attempt/effect lineage, retries/redrive, replay histórico, coexistência explícita de revisões em voo e recuperação/compensação de workflow.

Essa distinção é importante: o livro não deve transformar uma direção pesquisada em descrição fictícia do produto atual.

## 3. Ação, interação e efeito não são sinônimos

Uma das confusões mais perigosas em sistemas empresariais é chamar tudo de “ação”.

Quando uma pessoa clica em **Aprovar**, pelo menos quatro coisas diferentes podem existir:

1. a UI capturou uma intenção de interação;
2. o sistema recebeu uma solicitação de aprovação;
3. a política autorizou ou negou a operação;
4. uma transição ou efeito realmente ocorreu.

Podemos representar isso assim:

```text
Clique
  |
  v
InteractionIntent
  |
  v
pedido de atuação
  |
  +--> autorização atual
  |
  v
attempt
  |
  v
efeito / transição
  |
  v
evidência qualificada
```

O clique não é a aprovação. A presença do botão não é autorização. Um HTTP 200 não é necessariamente o efeito empresarial. Uma mensagem “enviada” não prova que o destinatário processou o conteúdo.

Essa separação parece burocrática até o primeiro incidente em que o sistema registra “concluído” e o mundo real continua inalterado.

## 4. A cadeia que evita o falso sucesso

A pesquisa G2 usa repetidamente uma cadeia conceitual:

```text
attempted
   -> accepted
      -> applied/effective
         -> converged
            -> validated
```

Ela não obriga toda operação a implementar cinco tabelas ou cinco estados. É uma forma de impedir que evidências mais fracas sejam promovidas automaticamente a afirmações mais fortes.

### 4.1 Attempted — tentado

O sistema criou uma tentativa de realizar algo.

Exemplo: tentou reservar dez unidades de um item.

Isso prova que houve uma tentativa. Não prova que o estoque foi alterado.

### 4.2 Accepted — aceito

Algum boundary aceitou a solicitação.

Exemplo: uma API retornou que o pedido foi recebido, ou uma fila aceitou uma mensagem.

Isso ainda pode significar apenas “vou tentar processar”.

### 4.3 Applied / effective — aplicado ou efetivo

O efeito pretendido ocorreu no owner relevante.

Exemplo: as dez unidades foram efetivamente reservadas.

Em alguns domínios, “aplicado” e “efetivo” podem exigir distinções próprias. O ponto é não confundi-los com mera aceitação.

### 4.4 Converged — convergido

Os estados dependentes alcançaram a condição esperada.

Exemplo: reserva, saldo disponível, projeção de estoque e leitura usada pelo processo passaram a refletir uma situação compatível.

Convergência é especialmente importante quando diferentes componentes atualizam em tempos diferentes.

### 4.5 Validated — validado

A pós-condição semântica esperada foi verificada.

Exemplo: não basta “a API disse sucesso”; a regra do negócio exige que o estoque reservado seja dez unidades e esteja associado à OS correta.

Essa última etapa responde à pergunta mais importante: **o que precisávamos que fosse verdade realmente se tornou verdade?**

## 5. Quando não sabemos: `UNKNOWN`

Agora imagine uma integração com um fornecedor:

```text
SB -------- pedido de compra --------> fornecedor
SB <------- conexão cai --------------- X
```

A conexão caiu depois que o pedido saiu. O fornecedor pode ter criado o pedido. Ou pode não ter criado.

O sistema local sabe que tentou. Não sabe o resultado.

Esse é o caso clássico de `UNKNOWN`.

```text
UNKNOWN != NOT_APPLIED
```

Transformar timeout em “não aconteceu” é perigoso porque um retry pode criar um segundo pedido.

Por isso aparece o princípio **reconcile-before-retry**: quando uma mutação pode ter acontecido e o resultado é desconhecido, primeiro procure evidência do estado real; só depois repita, a menos que exista um contrato de idempotência explicitamente qualificado que torne a repetição segura.

> **EVIDENCIADO NO SB ATUAL:** Planning B encontrou uma exposição concreta dessa classe no workflow atual: a mutação de entidade pode ocorrer antes da persistência do novo estado de workflow, em operações separadas. Se a primeira tiver sucesso e a segunda falhar, o efeito pode existir enquanto o workflow aparenta não ter avançado. O baseline atual ainda não possui uma disposition `UNKNOWN` de primeira classe para reconciliar esse split failure.

Isso é um exemplo valioso porque mostra que `UNKNOWN` não é teoria para grandes sistemas distribuídos. Ele pode surgir entre duas operações de banco ou entre uma mutação e o registro do progresso.

## 6. Retry, redrive e idempotência: repetir não é apagar o passado

**Retry** é uma nova tentativa motivada por falha ou ausência de conclusão. **Redrive** é a recolocação governada de trabalho anteriormente falho, pendente ou desviado para nova tentativa de processamento.

Os dois precisam preservar lineage.

```text
Intent I-77
  |
  +-- Attempt A1 -> UNKNOWN
  |
  +-- reconciliation -> efeito encontrado
  |
  `-- NÃO criar A2 apenas porque A1 não retornou sucesso local
```

Se for realmente necessário criar `A2`, ele continua relacionado a `A1`. O sistema não deve reescrever a história fingindo que a tentativa anterior nunca existiu.

### 6.1 O que idempotência realmente significa

Idempotência é a propriedade de uma operação poder ser repetida, **dentro das condições qualificadas de seu contrato**, sem produzir efeitos adicionais indevidos.

Ela pode depender de:

- uma chave;
- um escopo;
- uma janela de deduplicação;
- uma revisão de API;
- um tipo específico de operação;
- uma identidade de recurso;
- um provider particular.

Por isso, “tem idempotency key” não equivale a “pode repetir para sempre”.

O Capítulo 18 aprofundará retries, efeitos parciais, concorrência e idempotência. Aqui basta guardar que workflow precisa saber **quando** tentar novamente, enquanto Integration fornece os fatos específicos do alvo que dizem **se** repetir aquela operação é seguro.

## 7. Waits, timers e trabalho que dorme

Muitos processos empresariais passam mais tempo esperando do que executando.

Uma OS pode aguardar:

- chegada de material;
- autorização de uma pessoa;
- resposta de fornecedor;
- fim de prazo;
- confirmação de pagamento;
- janela de manutenção;
- evento emitido por outro sistema.

Um **durable wait**, ou espera durável, é uma espera cujo significado precisa sobreviver a restart, substituição de worker ou passagem do tempo.

Um **timer durável** não é apenas um `sleep(86400)`. Ele possui identidade e intenção temporal preserváveis.

```text
AGUARDANDO_PECA
      |
      +-- sinal: PECA_RECEBIDA ------> RETOMAR
      |
      `-- deadline: 72h -------------> ESCALAR
```

Se o worker reiniciar na hora 40, a deadline continua sendo a original. Se o relógio estiver incerto, o sistema não deve inventar que o timer certamente disparou ou certamente não disparou.

## 8. Human task: quando o workflow espera julgamento humano

Uma **human task**, ou tarefa humana, é uma unidade durável de trabalho que espera ação ou julgamento de uma pessoa dentro da execução.

Exemplo:

```text
Workflow: OS-1042
  |
  `-- HumanTask: aprovar compra emergencial
          |
          +-- candidatos: papel competente
          +-- prazo: 2h
          +-- estado: claimed / completed / cancelled ...
          `-- autoridade: avaliada pelo owner de Authorization/Policy
```

Workflow possui a vida da tarefa dentro da execução: sua identidade, vínculo, estado, deadline e conclusão. Mas ele não deve inventar quem tem autoridade para executá-la.

Essa divisão evita três erros:

```text
ver a tarefa      != poder executá-la
receber lembrete  != ter autoridade
clicar concluir   != conclusão válida
```

O Capítulo 07 aprofundará identidade, organização e autorização.

## 9. Formulário: superfície de captura, não dono do processo

Um formulário é extremamente importante para a experiência humana, mas seu papel precisa ser compreendido.

Considere um formulário de encerramento de OS:

```text
Horas trabalhadas:  4,5
Material utilizado: cabo X
Resultado do teste: aprovado
Observação:          ...
[Concluir OS]
```

O formulário pode validar tipos, obrigatoriedade e formato. Pode apresentar campos de acordo com o contexto. Pode ajudar o usuário a produzir uma intenção bem formada.

Mas ele não deve, sozinho, possuir:

- o significado canônico de “OS concluída”;
- a política de quem pode concluir;
- a verdade de estoque;
- a fórmula de custo;
- a garantia de que uma integração externa ocorreu;
- a decisão de que todos os pós-requisitos foram satisfeitos.

O formulário é uma superfície de interação. Os semantic owners continuam existindo atrás dele.

Essa separação é justamente o que permite que amanhã a mesma ação seja apresentada em desktop, celular, AGWS ou outra UI sem redefinir o processo.

## 10. Evento e mensagem: “algo aconteceu” versus “algo foi transportado”

Outro par frequentemente colapsado é evento e mensagem.

Um **evento** pode representar uma ocorrência semanticamente relevante:

```text
PECA_RECEBIDA
OS_APROVADA
PAGAMENTO_CONFIRMADO
```

Uma **mensagem** é uma unidade de comunicação usada para transportar informação entre produtor e consumidor.

Um evento pode produzir várias mensagens. Uma mensagem pode transportar referência a um evento. O broker pode criar IDs próprios. Esses IDs não precisam ser a identidade canônica do evento empresarial.

### 10.1 A cadeia de comunicação também possui estágios

```text
publication attempted
        |
        v
broker accepted
        |
        v
delivered
        |
        v
consumer processed
        |
        v
semantic effect validated
```

Um broker aceitar a mensagem não prova entrega. Entrega não prova processamento. Processamento não prova necessariamente o efeito de negócio pretendido.

### 10.2 Exactly-once não é uma palavra mágica

Mesmo quando um transporte oferece uma garantia chamada “exactly once”, a aplicabilidade precisa ser qualificada: para qual operação, consumidor, escopo, mecanismo e horizonte?

E, principalmente:

```text
exactly-once transport
        !=
exactly-once business effect
```

Se um consumidor processa uma mensagem uma vez e chama uma API externa duas vezes por erro próprio, a garantia do broker não salva a semântica do negócio.

## 11. Integração: atravessando a fronteira do SB

**Integration & Automation** começa onde o SB precisa interagir intencionalmente com uma realização externa.

Exemplos:

- criar ticket em outro sistema;
- enviar uma ordem a um fornecedor;
- consultar um equipamento;
- sincronizar cadastro;
- acionar uma API financeira;
- receber webhook;
- iniciar uma automação externa.

A integração não é apenas “fazer HTTP”. Um connector/adapter maduro precisa saber o suficiente sobre a operação para que o SB possa interpretar o resultado com segurança.

Entre os aspectos pesquisados estão:

- identidade da operação externa;
- shapes de entrada e saída;
- credenciais e binding necessários;
- classe de side effect;
- idempotência/deduplicação;
- comportamento sob timeout;
- receipts disponíveis;
- possibilidade de readback/reconciliation;
- taxonomia de erros;
- limites e compatibilidade de revisão.

### 11.1 Connector não é semantic owner

Suponha que um ERP externo chame um campo de `closed=true`.

O connector pode mapear esse campo. Mas ele não pode concluir sozinho que isso equivale à definição canônica de “OS concluída” do processo do SB.

```text
ERP: closed=true
      |
      v
Integration observa/mapeia
      |
      v
owner do domínio avalia adoção
      |
      v
verdade canônica, se qualificada
```

Isso preserva anti-lock-in e evita adaptar a empresa silenciosamente à semântica acidental de cada provider.

## 12. Workflow e Integration: orquestração versus efeito externo

A fronteira pode ser resumida assim:

```text
Workflow
  "quando e em qual progressão durável fazer?"
          |
          v
Integration
  "como atravessar o boundary externo e qualificar o efeito?"
          |
          v
Provider / sistema externo
```

Workflow pode decidir que chegou a hora de criar um pedido externo. Integration conhece a operação, mapping, receipts, idempotência e reconciliation daquele alvo.

Se a Integration retorna “accepted”, Workflow não deve automaticamente escrever “pedido efetivado” se a pós-condição exigida for mais forte.

O inverso também vale: Integration não passa a possuir toda a instância de workflow apenas porque realizou um side effect.

## 13. Workflow e Messaging: sinal não é progresso automático

Uma mensagem pode acordar um workflow:

```text
Fornecedor
   |
   v
mensagem: MATERIAL_ENTREGUE
   |
   v
correlation
   |
   v
workflow OS-1042
```

Mas a entrega da mensagem não precisa equivaler à transição final.

O workflow pode precisar verificar:

- se a mensagem pertence à instância correta;
- se a revisão do payload é compatível;
- se já foi processada;
- se chegou fora de ordem;
- se a condição ainda é aplicável;
- se uma política atual permite a transição;
- se o estado de domínio confirma a pós-condição.

Por isso, message identity e workflow correlation identity são relacionadas, mas não devem ser colapsadas.

## 14. Automação simples versus workflow durável

Nem toda automação precisa virar um workflow durável.

Exemplo simples:

```text
quando sensor informar temperatura > limite
-> enviar observação para sistema externo
```

Dependendo do significado, isso pode ser uma automação bounded sem estado empresarial durável complexo.

Agora compare:

```text
abrir incidente
-> aguardar técnico
-> escalar após 30 min
-> coletar aprovação
-> executar mudança
-> reconciliar efeito externo
-> aguardar validação
-> compensar se necessário
```

Aqui existe progressão durável, waits, human tasks, efeitos e recovery. Workflow passa a ser semanticamente relevante.

A fronteira não é “quantas caixinhas existem”. É **se o trabalho exige estado de execução durável e suas invariantes próprias**.

## 15. Long-running workflows e o problema do mundo que muda

Um workflow pode durar segundos, meses ou anos. Enquanto ele espera, o resto do sistema evolui.

Podem mudar:

- processo;
- schema;
- política;
- pessoas e papéis;
- fórmula;
- provider;
- credenciais;
- runtime;
- configuração;
- trust material.

Por isso, “foi autorizado no início” não significa “continua autorizado para sempre”. Da mesma forma, um workflow iniciado sob uma revisão não pode simplesmente ser reinterpretado pela revisão nova sem qualificação.

As opções possíveis — continuar pinned, migrar, intervir, concluir ou terminar — dependem de contratos que ainda serão aprofundados no Capítulo 13.

O ponto importante agora é:

```text
long-running execution
        +
mutable world
        =
currentness problem
```

## 16. Replay não é “rodar tudo de novo”

Em alguns modelos de execução durável, o estado pode ser reconstruído a partir de histórico. Isso introduz o conceito de **replay**.

Replay seguro exige que aquilo que deveria ser determinístico continue produzindo a mesma interpretação histórica. Leituras de relógio, números aleatórios, chamadas externas e código alterado podem quebrar essa propriedade se forem usados sem isolamento ou registro apropriado.

E existe uma regra ainda mais importante: **replay de lógica não deve repetir side effects externos como se fossem cálculos puros**.

```text
replay histórico
   |
   +-- reconstruir decisão interna: possivelmente seguro sob contrato
   |
   `-- reenviar pagamento: NÃO inferir segurança
```

Planning A trata side effects externos como boundaries explícitos justamente para que effect identity, attempt lineage e reconciliation possam sobreviver à reconstrução do estado.

## 17. Um exemplo integrado: OS com compra de material

Vamos juntar os conceitos.

### Etapa A — intenção humana

Um técnico informa pelo formulário que faltam duas unidades de uma peça.

```text
Form -> InteractionIntent
```

O formulário valida que quantidade é número positivo. Isso ainda não compra nada.

### Etapa B — processo e autorização

O processo determina que compras acima de certo valor precisam de aprovação. Authorization verifica a autoridade atual do aprovador.

```text
Intent -> Process rule -> Authority evaluation
```

### Etapa C — workflow

A instância entra em `AGUARDANDO_APROVACAO`. A tarefa humana precisa sobreviver a restart.

```text
OS-1042 -> HumanTask HT-9
```

### Etapa D — integração

Após aprovação, Workflow invoca Integration para criar o pedido no fornecedor.

```text
Workflow Attempt W4
        |
        v
Integration Intent I8
        |
        v
External Attempt A1
```

### Etapa E — timeout

A conexão cai. O resultado fica `UNKNOWN`.

```text
A1 -> UNKNOWN
```

Workflow não avança cegamente para “pedido criado” e não manda outro pedido apenas porque recebeu timeout.

### Etapa F — reconciliation

Integration consulta o fornecedor usando os identificadores e evidências aplicáveis. Encontra o pedido `F-8831`.

```text
A1 UNKNOWN
   -> reconcile
   -> APPLIED
```

### Etapa G — convergência e validação

O processo valida que o pedido corresponde à OS, material, quantidade e condições esperadas. Só então a pós-condição relevante pode ser adotada.

### Etapa H — mensagem posterior

Dias depois chega um evento de entrega. Messaging prova a entrega da comunicação conforme seu contrato; Workflow correlaciona a mensagem à OS; o domínio valida o recebimento real; a execução continua.

Nenhuma dessas capacidades precisa fingir ser todas as outras.

## 18. Onde a pesquisa procura quebrar esse modelo

A campanha adversarial atual não pergunta apenas se o happy path funciona. Ela tenta encontrar composições em que partes corretas produzam uma conclusão errada.

Para este capítulo, algumas perguntas típicas são:

- o efeito ocorreu, mas o workflow não registrou o avanço?
- a mensagem foi duplicada depois que a janela de deduplicação expirou?
- o provider aceitou o request, mas o efeito ficou parcial?
- um callback antigo chega depois de uma migração de provider?
- um timer dispara sob revisão incompatível?
- uma human task continua visível depois da autoridade expirar?
- replay reexecuta um side effect?
- uma automação gera um evento que aciona a própria automação em loop?
- uma UI interpreta “delivered” como “business completed”? 

Essas perguntas não são implementação. São formas de testar se as fronteiras conceituais continuam válidas sob falha, concorrência, tempo e coexistência.

> **EM PESQUISA:** a campanha adversarial continua ativa e ainda não autoriza Planning C. No snapshot consultado para esta versão editorial, Full Pass 1 estava completo e Full Pass 2 havia coberto 17/28 capabilities; somente 1 dos 8 full passes mínimos estava concluído.

## 19. Trade-offs: por que não transformar tudo em um único motor

Separar semânticas aumenta o número de conceitos. Isso tem custo cognitivo.

Seria tentador criar um grande “motor universal” no qual evento, workflow, integração, autorização, formulário e estado de domínio fossem apenas tipos de nós.

O problema é que essa simplificação pode esconder diferenças essenciais:

- entrega não é efeito;
- execução não é autorização;
- provider ID não é identidade canônica;
- formulário não é verdade de domínio;
- workflow history não é process model;
- retry de cálculo não é retry de pagamento;
- current state não é histórico suficiente para recovery.

A direção pesquisada busca outro equilíbrio: **primitives compartilhadas onde a estrutura é realmente comum, semantic owners separados onde o significado diverge e composição explícita entre eles**.

A analogia é uma cidade: ruas, energia, água e edifícios se conectam, mas transformar todos em “infraestrutura genérica” não elimina as propriedades específicas de cada rede. A analogia deixa de valer tecnicamente porque software permite composições, revisões e identidades muito mais flexíveis; ela serve apenas para mostrar que compartilhamento de infraestrutura não implica compartilhamento de significado.

## 20. Como este capítulo se conecta aos próximos

Este capítulo introduziu vários problemas que ainda merecem tratamento próprio:

- **Capítulo 07:** quem pode atuar, em qual Station, papel e contexto;
- **Capítulo 08:** quais dados, schemas e documentos sustentam as transições;
- **Capítulo 13:** como workflows em voo sobrevivem à evolução;
- **Capítulo 14:** como observamos progresso sem confundir telemetria com verdade;
- **Capítulo 18:** retries, concorrência, `UNKNOWN`, efeitos parciais e idempotência;
- **Capítulo 19:** conflitos em que owners localmente corretos se tornam conjuntamente incompatíveis;
- **Capítulo 20:** técnicas usadas para tentar falsificar essas premissas.

## O que você deve guardar deste capítulo

Um processo empresarial real atravessa tempo, falhas, pessoas e sistemas. Por isso, desenhar o caminho não basta: a execução precisa preservar identidade, estado, história e evidência suficientes para continuar com segurança.

Guarde principalmente estas distinções:

```text
UI intent        != authorization
attempt          != effect
accepted         != applied
applied          != converged
converged        != validated
message delivery != workflow completion
provider ID      != canonical identity
UNKNOWN          != NOT_APPLIED
retry            != erase history
workflow         != integration
integration      != domain truth
```

Workflow possui a progressão durável. Integration possui a travessia para o sistema externo e a qualificação de seu efeito. Messaging possui comunicação e entrega. Formulários capturam interação. Authorization decide autoridade. O processo canônico continua com seu semantic owner.

A força do System Builder não virá de apagar essas diferenças, mas de permitir que elas se componham sem obrigar o idealizador da empresa a administrar manualmente toda essa complexidade.

---

## Referências internas autoritativas consultadas

Este capítulo sintetiza, sem substituir, principalmente:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/planning/PLANNING_A_WORKFLOW_DURABLE_EXECUTION_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_WORKFLOW_DURABLE_EXECUTION_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/planning/PLANNING_A_INTEGRATION_AUTOMATION_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_NOTIFICATIONS_EVENTS_MESSAGING_BOUNDARIES.md`;
- conceitos já introduzidos nos Capítulos 02–05.
