# Capítulo 1 — O que é o System Builder e qual problema ele tenta resolver

> **Status editorial:** primeira edição didática. Este capítulo explica a visão consolidada pela pesquisa até a fase adversarial atual. O livro não substitui os artefatos autoritativos de pesquisa, síntese ou planejamento.

## 1.1 O problema começa antes do software

Imagine uma empresa que recebe uma solicitação de manutenção. Alguém abre uma ordem de serviço, outra pessoa verifica disponibilidade de técnicos, uma peça precisa sair do estoque, talvez exista uma autorização, o trabalho é executado, horas são registradas, documentos são anexados e, no fim, alguém precisa saber se o serviço realmente terminou.

É tentador pensar que o problema de software consiste em criar uma tela de OS, uma tabela de estoque e alguns botões. Mas o problema real está nas relações entre essas partes.

Quem pode abrir a OS? Quem pode aprová-la? O técnico escalado continua disponível se outra atividade o reservar ao mesmo tempo? A baixa de estoque ocorreu ou apenas foi solicitada ao sistema externo? Se a integração respondeu com timeout, é seguro tentar de novo? Se a regra de cálculo de custo mudar amanhã, um relatório de três meses atrás deve ser recalculado com a fórmula nova ou preservar a fórmula histórica? Se a empresa trocar o provedor de e-mail, a ideia empresarial de “notificação enviada” muda junto com o fornecedor?

É nesse nível que nasce a Generation 2 do System Builder.

**DECIDIDO — na taxonomia de síntese:** o System Builder não é tratado como um único módulo gigantesco. A pesquisa consolidou 28 capabilities canônicas, com donos semânticos distintos e relações explícitas entre elas. Entre essas capabilities estão modelagem de processos, workflow durável, identidade, autorização, dados, storage, build, release, deployment, providers, interoperabilidade, observabilidade, segurança, billing e FinOps.

Uma **capability** é uma capacidade coerente do sistema: um conjunto de semânticas e responsabilidades que existe porque há um problema próprio a resolver. Ela não é sinônimo de tela, pacote de código ou produto externo.

## 1.2 O System Builder como tradutor de uma empresa

Uma maneira simples de entender a visão é imaginar três mundos.

```text
MUNDO DA EMPRESA
intenções, pessoas, regras, processos, recursos, responsabilidades
        |
        v
SYSTEM BUILDER
modela -> qualifica -> compõe -> verifica -> materializa
        |
        v
SISTEMA REALIZADO
UI, workflow, dados, integrações, runtime, providers, evidência operacional
```

A seta do meio é a parte difícil.

Uma empresa não fala naturalmente em schemas, filas, artefatos assinados, revision vectors ou idempotência. Ela fala em “ninguém pode aprovar o próprio pedido”, “essa equipe atende esta região”, “a peça só pode ser baixada quando usada” ou “se o fornecedor não responder, alguém precisa verificar antes de repetir a cobrança”.

O System Builder precisa preservar o significado empresarial ao traduzi-lo para mecanismos técnicos.

Isso leva a uma distinção que aparecerá durante todo o livro:

- **semântica** é o que uma coisa significa para o sistema e para a empresa;
- **realização** é o mecanismo concreto usado para fazê-la acontecer.

Uma notificação pode significar “avisar o responsável pela OS”. A realização pode ser e-mail hoje, outro provider amanhã, ou até uma combinação de canais. O provider ajuda a executar a capability, mas não deve redefinir sozinho o significado empresarial.

**DECIDIDO — na síntese:** identidade semântica e identidade de realização são conceitos distintos. IDs de providers, runtimes ou sistemas externos não se tornam automaticamente a identidade canônica do negócio.

## 1.3 “Own semantics, delegate mechanics”

Uma das ideias mais importantes da pesquisa pode ser traduzida assim:

> O System Builder deve possuir os significados, requisitos e evidências que precisam permanecer estáveis; mecanismos maduros podem ser delegados a providers.

Isso não significa reimplementar Kubernetes, bancos, motores de workflow, PKI, observabilidade ou sistemas de cobrança. Significa exatamente o contrário: aproveitar mecanismos maduros sem deixar que o formato particular de um fornecedor se transforme na arquitetura conceitual inteira do SB.

Considere autenticação. Um provider pode autenticar uma pessoa. Isso não significa que ele deva decidir toda a estrutura empresarial de autoridade. Da mesma forma, um storage pode confirmar que recebeu bytes; isso não significa, sem qualificação adicional, que todos os significados empresariais de “documento correto, atual e disponível” estejam provados.

Esse princípio sustenta o objetivo de **anti-lock-in**: trocar uma realização não deveria obrigar a empresa a redefinir o próprio negócio.

**HIPÓTESE/ORIENTAÇÃO DE ARQUITETURA CONSOLIDADA:** a Generation 2 busca *mature-system semantics with simple-system ergonomics*: semânticas capazes de sobreviver a cenários maduros e complexos, mas sem obrigar uma pequena instalação a operar uma infraestrutura desnecessariamente sofisticada.

## 1.4 Simples não significa semanticamente pobre

Uma barbearia, uma oficina ou uma pequena equipe técnica talvez rode tudo em uma topologia pequena. Uma organização grande pode distribuir serviços, providers e Stations. Seria ruim manter dois modelos mentais incompatíveis: um “modelo simples” que depois precisa ser descartado e outro “modelo enterprise”.

A pesquisa segue outra direção: a topologia pode colapsar, mas as distinções importantes continuam existindo.

Por exemplo, mesmo que uma aplicação pequena use um único servidor:

```text
Pessoa != Papel (Role)
Papel != Station
Regra empresarial != botão da interface
Documento lógico != objeto do storage
Efeito solicitado != efeito confirmado
Capability != provider
```

No sistema pequeno, várias dessas coisas podem morar no mesmo processo ou banco. Isso não as torna semanticamente idênticas.

A analogia é a de uma casa: cozinha e sala podem compartilhar o mesmo ambiente físico, mas continuam tendo funções diferentes. A analogia deixa de valer quando entramos em propriedades formais: software precisa registrar explicitamente certas identidades, revisões e relações que uma casa não precisa representar.

## 1.5 Da configuração para um sistema versionado

Um construtor convencional de aplicações pode ser imaginado como um editor que produz telas e automações. A ambição do SB é maior: representar uma empresa como um sistema que evolui.

Isso introduz o conceito de **revisão (revision)**. Processos, schemas, políticas, fórmulas, providers, artefatos e runtimes podem mudar em momentos diferentes. Por isso, a pesquisa rejeita a ideia de que uma única versão global explique sempre o estado do sistema.

Um processo iniciado ontem pode estar usando uma definição anterior enquanto novos processos usam a definição atual. Um relatório histórico pode depender da fórmula que era válida quando o fato foi produzido. Um runtime antigo pode ainda estar drenando trabalho durante uma migração.

A Generation 2 chama atenção repetidamente para **coexistência**: mudar o desejado não faz desaparecer instantaneamente tudo o que realizava a versão anterior.

Esse tema será aprofundado nos capítulos sobre versionamento, deployment, providers e migração.

## 1.6 O sistema precisa saber o que sabe — e o que não sabe

Outro problema humano aparece quando alguém pergunta: “deu certo?”.

Em software distribuído, às vezes a resposta correta é: “ainda não sabemos”.

Imagine que o SB mande um provider cobrar R$ 100 e a conexão caia antes da resposta. Existem pelo menos duas possibilidades:

1. o provider não aplicou a cobrança;
2. o provider aplicou a cobrança, mas a resposta se perdeu.

Repetir cegamente pode cobrar duas vezes. Assumir sucesso pode deixar uma cobrança inexistente como paga.

Por isso a pesquisa trabalha com disposições explícitas de efeito, como `APPLIED`, `NOT_APPLIED`, `PARTIAL` e `UNKNOWN`. Quando um efeito mutante permanece `UNKNOWN`, a regra conceitual é reconciliar antes de uma repetição potencialmente insegura.

**DECIDIDO — primitive de síntese:** `INCONCLUSIVE` também é resultado de primeira classe. Evidência ausente, parcial, velha ou insuficiente não deve ser convertida silenciosamente em `PASS`, `ALLOW` ou “saudável”.

Isso parece conservador, mas é uma forma de honestidade computacional: o sistema não deve inventar certeza.

## 1.7 Evidence: por que “aconteceu” precisa de qualificação

**Evidência (evidence)** é informação usada para sustentar uma afirmação. Um log pode ser evidência. Uma resposta de provider pode ser evidência. Uma assinatura, uma medição, um resultado de teste ou uma observação de runtime também.

Mas evidência só é útil se soubermos a que ela se aplica.

A síntese consolidou a ideia de **qualified evidence envelope**: a evidência precisa carregar contexto suficiente para que o consumidor saiba seu sujeito, origem, revisão produtora, aplicabilidade, atualidade, cobertura, incerteza e horizonte relevante.

Exemplo: “todos os workloads observados estão saudáveis” não é automaticamente equivalente a “toda a população autoritativa do sistema convergiu”. Pode existir uma Station desconectada ou um cohort antigo fora do conjunto observado.

Esse detalhe explica por que observabilidade não é apenas fazer dashboards. Ela participa da disciplina de saber quais conclusões os sinais realmente autorizam.

## 1.8 O perigo das partes corretas formando um todo errado

A fase atual da pesquisa é adversarial porque uma arquitetura pode funcionar perfeitamente no happy path e ainda falhar quando partes corretas são compostas.

Considere duas regras:

- regra A: o supervisor pode aprovar compras até determinado valor;
- regra B: quem abriu a solicitação pode atuar como supervisor de sua Station.

Cada regra pode parecer válida isoladamente. Juntas, em determinado contexto, talvez permitam autoaprovação indevida.

A pesquisa chama a descrição reutilizável desse risco de **ConflictPattern**. Um padrão de conflito não significa que o defeito existe agora. Ele descreve condições sob as quais componentes localmente válidos podem se tornar incompatíveis.

```text
ConflictPattern
      |
      v
ActivationCondition presente?
   /        \
 não        talvez/sim
 |             |
sem caso     Signal
              |
        evidência suficiente?
          /          \
        não          sim
        |             |
   inconclusivo   ConflictInstance confirmado
```

**EM PESQUISA:** a campanha adversarial ainda está ativa. No estado consultado para esta edição, o primeiro full pass havia desafiado 25 das 28 capabilities, e nenhum dos oito full passes mínimos estava completo. Portanto, este livro não deve narrar a arquitetura alvo como encerrada.

## 1.9 O que o System Builder não deve virar

A pesquisa também define a visão por negativas importantes.

O SB não deve virar um **semantic god-object**: uma camada universal que tenta possuir todos os significados de todos os domínios. A Universal Capability Architecture pode oferecer primitives compartilhadas, mas cada capability conserva seu **semantic owner**, isto é, o responsável canônico pelo significado e pelas invariantes daquele domínio.

Também não deve confundir:

- UI visível com autorização;
- resposta do provider com efeito empresarial concluído;
- health check com convergência total;
- rollback disponível com rollback seguro;
- dado histórico com evidência ainda atual;
- feature de fornecedor com capability portátil equivalente;
- recomendação de IA com autoridade para agir.

Essas separações podem parecer excessivas no início. Na prática, são o que permite que o sistema cresça sem transformar conveniências locais em dependências arquiteturais invisíveis.

## 1.10 A visão em uma frase

Podemos resumir a Generation 2 assim:

> **O System Builder procura transformar a intenção e a operação de uma organização em sistemas versionados, governados e executáveis, preservando significado, autoridade, evidência e autonomia enquanto delega mecanismos especializados a providers substituíveis.**

Essa frase é uma síntese editorial, não uma nova decisão arquitetural.

O próximo capítulo começa pela primeira metade dela: o que significa, concretamente, tratar uma empresa como um sistema versionado — e por que um processo não é apenas um fluxograma.

## O que você deve guardar deste capítulo

O System Builder não começa nas telas; começa no significado do trabalho da empresa. Capabilities separam responsabilidades sem obrigar topologias pesadas. Providers realizam mecanismos, mas não devem possuir automaticamente a verdade do negócio. Revisões e coexistência existem porque empresas mudam enquanto continuam operando. Evidência precisa ser qualificada porque sinais não são sinônimo de verdade. E a arquitetura precisa sobreviver não apenas a componentes defeituosos, mas também ao caso mais traiçoeiro: componentes individualmente corretos que, quando combinados, produzem um processo errado.

## Referências internas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` — fase e gates atuais.
- `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md` — taxonomia de 28 capabilities e primitives consolidadas.
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md` — propósito e famílias da campanha adversarial.
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md` — distinção entre padrão, sinal e conflito manifestado.