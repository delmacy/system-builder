# Capítulo 18 — Concorrência, retries, efeitos parciais, UNKNOWN e idempotência — v1.0.0

**Chapter ID:** `CHAPTER_18`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada de autoridade:** síntese didática; não substitui pesquisa, Planning, gates, findings, edge-case registers ou arquitetura alvo.

---

## 1. O problema humano: duas pessoas fazem a coisa certa e o resultado fica errado

Imagine uma empresa com apenas uma peça crítica em estoque.

Dois técnicos trabalham em duas ordens de serviço diferentes. Os dois consultam o sistema quase no mesmo instante. Para ambos, o estoque mostra `1 unidade disponível`. Cada um então reserva a peça para a própria OS.

Nenhum técnico fez algo absurdo. Cada operação, vista isoladamente, parece válida. O problema aparece na combinação temporal:

```text
estoque = 1

Técnico A lê: 1
Técnico B lê: 1
Técnico A reserva 1
Técnico B reserva 1

resultado pretendido: uma reserva
resultado possível sem coordenação: duas reservas
```

Esse tipo de problema é uma das razões pelas quais sistemas empresariais não podem ser entendidos apenas como uma sequência de telas e chamadas de API. O mundo real possui **concorrência**: pessoas, serviços, workers, integrações, timers e providers podem atuar ao mesmo tempo ou observar versões diferentes do estado.

Agora acrescente rede.

O sistema envia a um fornecedor externo a ordem “crie esta compra”. O fornecedor recebe e cria a compra, mas a resposta se perde. O System Builder vê apenas um timeout.

O que aconteceu?

```text
pedido enviado
   |
   +-- talvez o provider não tenha recebido
   |
   +-- talvez tenha recebido e rejeitado
   |
   +-- talvez tenha recebido e aplicado
   |
   +-- talvez tenha aplicado parcialmente
   |
   +-- talvez tenha aplicado e a resposta tenha se perdido
```

Responder automaticamente “falhou, tente de novo” pode criar uma segunda compra.

É por isso que este capítulo gira em torno de uma distinção aparentemente pequena, mas arquiteturalmente decisiva:

```text
timeout != NOT_APPLIED
```

**DECIDIDO NA PESQUISA:** quando um efeito mutante pode ou não ter ocorrido e a evidência disponível não permite determinar qual dos dois casos é verdadeiro, a disposição permanece `UNKNOWN`. Um retry potencialmente inseguro deve ser bloqueado até reconciliação, exceto quando o contrato qualificado daquela operação prova que a repetição é segura.

---

## 2. Concorrência não significa apenas “duas threads”

Em linguagem técnica, **concorrência** é a existência de múltiplas atividades cujo progresso pode se sobrepor no tempo ou cuja ordem relativa não é completamente controlada.

Para o System Builder, isso inclui muito mais do que programação multithread.

Pode haver concorrência entre:

- duas pessoas editando a mesma OS;
- dois workflows tentando reservar o mesmo recurso;
- um timer e uma aprovação humana chegando quase simultaneamente;
- uma tentativa antiga e um retry mais novo;
- um provider antigo e um provider novo durante cutover;
- um worker antigo e um runtime recém-promovido;
- uma revogação de autoridade e uma ação já em andamento;
- uma migração de schema e um workflow ainda executando sob a revisão anterior;
- uma compensação e o efeito original que ainda não sabemos se terminou;
- duas unidades organizacionais competindo pelo mesmo equipamento, orçamento ou estoque.

A questão fundamental não é apenas “o sistema aceita duas requisições ao mesmo tempo?”. A questão é:

> **quais ordens de acontecimentos são possíveis e quais invariantes empresariais precisam continuar verdadeiros em todas as ordens permitidas?**

Essa sequência concreta de acontecimentos é chamada aqui de **interleaving**, ou entrelaçamento.

### 2.1 Um exemplo de lost update

Considere um campo `horas_trabalhadas = 10`.

Dois supervisores acrescentam horas quase ao mesmo tempo:

```text
A lê 10
B lê 10
A soma 2 -> pretende gravar 12
B soma 3 -> pretende gravar 13
A grava 12
B grava 13
```

O resultado final é `13`, mas o correto seria `15`.

A atualização de A foi perdida. Esse padrão é chamado **lost update**.

O erro não está necessariamente na soma. A soma de cada participante está correta. O defeito está na hipótese implícita de que o valor lido continuaria válido até a gravação.

### 2.2 Check-then-act

Uma forma geral do mesmo problema é:

```text
1. verificar uma condição
2. algum tempo passa
3. agir supondo que a condição continua verdadeira
```

Exemplo:

```text
verificar: técnico está disponível
agir: atribuir OS
```

Entre as duas etapas, outra OS pode ter atribuído o mesmo técnico.

Esse tipo de risco está relacionado a **TOCTOU** (*time of check to time of use*): o estado verificado no instante da checagem pode não ser o estado válido no instante da atuação.

---

## 3. Race condition: quando o resultado depende da ordem

Uma **race condition** ocorre quando o resultado relevante depende de qual de duas ou mais operações “vence a corrida” ou de uma ordem de eventos não adequadamente governada.

Um exemplo empresarial:

```text
OS = AGUARDANDO_APROVACAO

Evento A: supervisor aprova
Evento B: solicitante cancela
```

Se ambos forem possíveis quase ao mesmo tempo, não basta implementar os dois caminhos isoladamente.

É preciso saber quais estados finais são admissíveis:

```text
APROVADA?
CANCELADA?
APROVADA_E_CANCELADA?
PAGAMENTO_JA_DISPARADO_MAS_OS_CANCELADA?
```

**EXEMPLO DIDÁTICO:** talvez a política empresarial estabeleça que o primeiro evento canonicamente aceito vence; talvez cancelamento possa ocorrer até determinada etapa; talvez aprovação já tenha disparado uma obrigação que exige compensação. O livro não decide essa regra. O semantic owner deve defini-la.

A função da arquitetura é não fingir que a ordem é irrelevante quando ela muda o significado do processo.

---

## 4. O mito do “exatamente uma vez”

Sistemas empresariais frequentemente desejam algo que parece simples:

> “Execute esta operação uma vez e somente uma vez.”

No interior de uma única transação local, algumas garantias fortes podem ser construídas. Quando atravessamos rede, múltiplos bancos, filas, providers ou sistemas autônomos, porém, a frase “exactly once” precisa ser tratada com cuidado.

Considere:

```text
SB -> provider: criar pagamento
provider: pagamento criado
provider -> SB: resposta
```

A rede pode falhar depois que o provider aplicou o pagamento e antes que a resposta chegue.

Para o SB, a observação é:

```text
nenhuma resposta recebida
```

Mas o estado externo pode ser:

```text
pagamento criado
```

A ausência de resposta não carrega informação suficiente para distinguir:

```text
não recebeu
recebeu mas não aplicou
aplicou
aplicou parcialmente
aplicou e perdeu a resposta
```

Portanto:

```text
transport success != semantic success
transport failure != semantic failure
```

O que importa é a **disposição do efeito**.

---

## 5. APPLIED, NOT_APPLIED, PARTIAL e UNKNOWN

A pesquisa G2 usa quatro disposições fundamentais para impedir que incerteza seja transformada silenciosamente em certeza.

### 5.1 `APPLIED`

Há evidência qualificada suficiente para afirmar que o efeito pretendido foi aplicado no escopo relevante.

Isso ainda pode não significar que todo o processo terminou.

```text
APPLIED effect != converged business process
```

Uma transferência pode ter sido registrada pelo provider e ainda depender de liquidação, propagação ou validação posterior.

### 5.2 `NOT_APPLIED`

Há evidência qualificada suficiente para afirmar que o efeito não ocorreu.

Só aqui uma repetição pode ser considerada a partir da premissa “não existe efeito anterior” — e mesmo assim outras condições, como autoridade, revisão ou disponibilidade de recurso, podem precisar ser reavaliadas.

### 5.3 `PARTIAL`

Uma parte identificável do efeito ocorreu, mas a operação completa não alcançou sua postcondição.

Exemplo:

```text
pedido criado
estoque externo reservado
notificação não enviada
```

Ou:

```text
3 de 5 itens importados
2 rejeitados
```

`PARTIAL` exige semântica própria. Não deve ser achatado para sucesso total nem para “nada aconteceu”.

### 5.4 `UNKNOWN`

A evidência é insuficiente para afirmar se o efeito ocorreu ou não.

Esse é um estado de conhecimento, não necessariamente um estado do domínio externo.

```text
mundo real: efeito ocorreu OU não ocorreu
conhecimento local: não sabemos qual
```

Essa distinção é extremamente importante.

`UNKNOWN` não significa que o mundo está em um terceiro estado mágico. Significa que **o sistema que precisa decidir o próximo passo não possui evidência suficiente**.

---

## 6. Por que retry não é sinônimo de recuperação

**Retry** é repetir uma tentativa.

Parece natural:

```text
falhou -> tente novamente
```

Essa política é adequada para algumas operações, perigosa para outras e incorreta para outras ainda.

### 6.1 Operação de leitura

Uma leitura sem side effect frequentemente pode ser repetida com baixo risco.

```text
GET saldo -> timeout -> tentar novamente
```

Ainda existem questões de currentness e consistência, mas normalmente não há duplicação do efeito porque a operação pretendida era observar.

### 6.2 Mutação não idempotente

Agora considere:

```text
criar cobrança de R$ 500
```

Se a primeira tentativa foi aplicada, repetir pode produzir:

```text
cobrança 1 = R$ 500
cobrança 2 = R$ 500
```

O retry transformou uma falha de comunicação em uma falha empresarial.

### 6.3 Retry após mudança de contexto

Mesmo que a primeira tentativa certamente não tenha sido aplicada, o retry pode ocorrer em um mundo diferente.

Entre tentativa e repetição podem ter mudado:

- autorização do usuário;
- revisão da política;
- saldo disponível;
- estoque;
- provider binding;
- schema;
- fórmula;
- preço;
- status da OS;
- deadline;
- trust ou credential currentness.

Por isso:

```text
retry eligibility != original eligibility
```

Um retry governado pode precisar requalificar condições atuais antes de atuar novamente.

---

## 7. Idempotência: a propriedade é da operação qualificada, não da chave

**Idempotência** é a propriedade segundo a qual repetir uma operação dentro das condições qualificadas do contrato não produz efeitos adicionais indevidos.

A frase “temos idempotency key” é insuficiente.

Uma chave só ajuda se houver um contrato que responda perguntas como:

- qual é o escopo da chave?
- por quanto tempo ela é lembrada?
- o mesmo payload é obrigatório?
- payload diferente com a mesma chave é rejeitado?
- qual resposta é devolvida em replay?
- a deduplicação sobrevive a failover?
- a chave é compartilhada entre regiões/providers?
- o provider garante deduplicação antes ou depois da mutação?
- a garantia vale durante migration/cutover?
- a chave identifica uma tentativa, uma intenção ou um efeito empresarial?

### 7.1 Exemplo

Suponha:

```text
idempotencyKey = compra-OS-123
```

Primeira chamada:

```text
criar compra de 10 filtros
```

Segunda chamada, por bug:

```text
mesma chave
criar compra de 20 filtros
```

O que deve acontecer?

Se o provider apenas “deduplica a chave”, pode devolver a primeira compra. Se aceitar o segundo payload, pode alterar significado. Se a chave expirou, pode criar outra compra.

Portanto:

```text
idempotency key != idempotency proof
```

A chave é um mecanismo possível dentro de um contrato maior.

---

## 8. Attempt identity, effect identity e business identity não são a mesma coisa

É útil separar três identidades.

```text
BusinessIntent
    “comprar filtros para OS-123”

Attempt
    tentativa 1
    tentativa 2
    redrive 1

Effect
    compra externa EXT-987
```

Um retry normalmente cria uma **nova tentativa**, mas não deveria necessariamente criar uma nova intenção empresarial.

Um redrive também precisa preservar a linhagem da tentativa anterior.

Essa separação ajuda a responder:

- estamos repetindo a mesma intenção?
- estamos criando um novo efeito?
- o efeito anterior já existe?
- qual tentativa o produziu?
- qual provider o realizou?
- qual revisão/policy autorizou a atuação?

Sem essa linhagem, investigar duplicidades vira arqueologia manual de logs.

---

## 9. Reconciliation: descobrir o que realmente aconteceu

Quando o resultado é `UNKNOWN`, a próxima ação segura muitas vezes não é retry. É **reconciliation**, ou reconciliação.

Reconciliar significa obter evidência suficiente para determinar o estado relevante antes de escolher a próxima mutação.

Exemplo:

```text
1. SB envia criação de compra com correlation/business key
2. ocorre timeout
3. disposição local = UNKNOWN
4. SB consulta provider / callback / ledger / webhook / estado canônico
5. encontra a compra já criada
6. adota/relaciona a evidência conforme o contrato
7. não cria uma segunda compra
```

Ou:

```text
5. nenhuma compra existe e a evidência qualificada prova NOT_APPLIED
6. condições atuais são requalificadas
7. nova tentativa torna-se elegível
```

A regra resumida é:

```text
UNKNOWN
   |
   v
RECONCILE
   |
   +--> APPLIED ------> continue a partir do efeito existente
   |
   +--> NOT_APPLIED --> requalifique e, se elegível, tente novamente
   |
   +--> PARTIAL ------> trate/compense o subconjunto conhecido
   |
   +--> UNKNOWN ------> permaneça bloqueado/escalone conforme policy
```

**DECIDIDO NA PESQUISA:** `UNKNOWN → reconcile-before-retry` é uma obrigação recorrente quando há mutação ambígua, salvo idempotência explicitamente qualificada para a operação.

---

## 10. Reconciliation não é simplesmente “consultar o provider”

Consultar o provider pode ser parte da reconciliação, mas não é automaticamente suficiente.

A resposta pode ser:

- stale;
- eventual;
- incompleta;
- ligada a outro identifier;
- proveniente de uma réplica atrasada;
- limitada a uma região;
- semanticamente diferente do efeito canônico que o SB precisa confirmar.

Por isso, reconciliação depende de **evidência qualificada**.

O semantic owner precisa saber que evidência basta para adotar determinada conclusão.

Exemplo:

```text
provider diz: accepted
```

Isso pode provar apenas aceitação.

Não necessariamente prova:

```text
applied
converged
validated
```

O capítulo sobre Workflow já introduziu esta cadeia:

```text
attempted
    -> accepted
    -> applied/effective
    -> converged
    -> validated
```

O erro clássico é saltar da segunda etapa diretamente para a última.

---

## 11. Efeitos parciais: quando “rollback” não apaga o mundo

Imagine uma automação:

```text
1. criar pedido no fornecedor
2. reservar orçamento
3. enviar email ao cliente
```

A etapa 1 ocorre. A etapa 2 falha. A etapa 3 não inicia.

O resultado não é simplesmente “falhou”.

O sistema terminou com um efeito externo já produzido.

Pode haver uma **compensação**, por exemplo cancelar o pedido. Mas compensação não é o mesmo que desfazer uma transação local.

Entre criação e cancelamento, o fornecedor pode ter:

- separado estoque;
- emitido documento;
- cobrado taxa;
- iniciado transporte;
- disparado outro processo.

Assim:

```text
compensated != never happened
```

A história precisa preservar que o efeito ocorreu e foi posteriormente compensado, quando esse for o caso.

### 11.1 Compensation race

Há ainda uma corrida perigosa:

```text
operação original parece falhar
compensação é enviada
operação original termina tarde
```

Ou o inverso:

```text
retry é disparado
resposta tardia da tentativa anterior chega depois
```

Esses interleavings tornam a identidade de tentativa e de efeito indispensável.

---

## 12. Mensagens duplicadas e eventos fora de ordem

Sistemas distribuídos frequentemente trabalham com delivery que pode repetir ou reordenar mensagens.

Exemplo:

```text
Evento 1: OS aprovada
Evento 2: OS cancelada
```

O consumidor pode observar:

```text
cancelada
aprovada
```

ou receber o primeiro evento duas vezes.

O correto não é necessariamente “ordenar tudo globalmente”. Isso pode ser caro, impossível ou desnecessário.

O semantic owner precisa definir o ordering que realmente importa.

Perguntas úteis:

- existe uma ordem por entidade?
- existe revision/sequence number?
- eventos antigos devem ser ignorados ou reconciliados?
- duplicatas são benignas?
- consumir duas vezes repete um side effect?
- existe causalidade que precisa ser preservada?

A solução adequada depende do domínio.

O princípio reutilizável é:

```text
transport delivery semantics != business transition semantics
```

---

## 13. Concorrência e recursos empresariais

A concorrência é particularmente importante quando há recursos escassos.

### Estoque

Duas OS tentam consumir a última peça.

### Mão de obra

Dois coordenadores escalam a mesma pessoa para horários incompatíveis.

### Equipamentos

Dois processos reservam o mesmo equipamento indivisível.

### Orçamento

Duas aprovações usam o mesmo saldo disponível.

### Quota de provider

Dois workflows individualmente válidos ultrapassam juntos um limite externo.

### Capacidade operacional

Várias automações seguras isoladamente causam fan-out e congestionam a empresa.

O conflito pode não estar em nenhuma operação local. Ele surge na composição.

Isso antecipa o tema do Capítulo 19:

> partes corretas podem formar um processo incorreto.

---

## 14. Lost update, double spend, duplicate work e split-brain

Alguns padrões merecem nomes porque reaparecem em vários domínios.

### 14.1 Lost update

Uma atualização sobrescreve silenciosamente outra baseada em estado anterior.

### 14.2 Double spend / dupla utilização

O mesmo recurso limitado é prometido ou consumido duas vezes.

O nome vem de finanças, mas o padrão também aparece em estoque, horas, vagas, orçamento e quotas.

### 14.3 Duplicate work

A mesma intenção empresarial cria múltiplas execuções ou efeitos independentes.

Exemplo:

```text
um clique
+ timeout
+ retry automático
= duas OS externas
```

### 14.4 Split-brain

Dois participantes acreditam simultaneamente possuir autoridade para atuar como o “ativo”.

Isso pode ocorrer em failover, deployment, recovery ou provider substitution.

O problema não é simplesmente ter duas instâncias. O problema é **duas instâncias capazes de produzir efeitos autoritativos incompatíveis**.

Por isso o Capítulo 15 introduziu **fencing**: impedir que o writer superseded continue atuando.

---

## 15. Locks são úteis, mas não são uma resposta universal

Ao ouvir “concorrência”, a primeira resposta costuma ser “coloque um lock”.

Locks podem ser adequados. Mas eles possuem custo e escopo.

É preciso perguntar:

- lock de quê?
- quem é o owner do lock?
- por quanto tempo?
- o que acontece se o holder morrer?
- o lock funciona entre processos?
- entre hosts?
- entre sistemas externos?
- existe fencing token?
- o lock protege o mesmo fato que o semantic owner considera indivisível?

Um mutex local não protege dois serviços em máquinas diferentes.

Um lock no banco do SB não impede um provider externo de aplicar uma operação duplicada.

Um lock distribuído pode evitar concorrência, mas também introduzir indisponibilidade, deadlocks, leases expirados e false ownership se usado sem modelo claro.

Portanto:

```text
“usar lock” != “resolver concorrência”
```

É uma técnica possível para um invariant específico.

---

## 16. Optimistic concurrency: agir somente sobre a revisão esperada

Outra técnica comum é **concorrência otimista**.

Em vez de bloquear antecipadamente, a mutação declara a revisão que espera encontrar.

Exemplo:

```text
OS revision = 7

A tenta:
  update OS
  only if revision == 7

B tenta:
  update OS
  only if revision == 7
```

Se A vencer:

```text
revision -> 8
```

B já não pode aplicar silenciosamente sua atualização sobre uma base stale.

Ele precisa:

- reler;
- reconciliar;
- refazer intenção sobre a nova revisão;
- ou apresentar conflito ao usuário.

Isso preserva uma diferença importante:

```text
stale proposal != current admissible mutation
```

O padrão reaparece em process revisions, bindings, policies, deployments e outras partes do System Builder.

---

## 17. CAS, revision checks e fencing

**Compare-and-swap (CAS)** é uma forma de dizer:

```text
mude de A para B somente se o valor atual ainda for A
```

É útil para transições em que apenas um contender deve vencer.

Exemplo conceitual:

```text
activeDeployment = DEPLOY-A

promover DEPLOY-B
somente se activeDeployment ainda for DEPLOY-A
```

Se outro ator já promoveu `DEPLOY-C`, a proposta baseada em A está stale.

O SB atual já possui um predecessor relevante desse tipo no domínio de deployment, onde expected-active/CAS ajuda a impedir que um contender stale substitua silenciosamente o ativo atual.

**EVIDENCIADO NO SB ATUAL:** esse padrão existe em deployment; ele não significa que toda a G2 já possua concorrência universalmente resolvida.

---

## 18. O caso concreto do workflow atual do System Builder

Planning B encontrou uma exposição muito didática no runtime de workflow atual.

De forma simplificada, a sequência é:

```text
1. validar transição
2. executar a action de domínio
3. action retorna ok
4. persistir novo estado do workflow
```

A mutação de domínio e a gravação do estado do workflow são operações separadas.

Considere:

```text
1. entidade é alterada com sucesso
2. banco falha antes de persistir novo estado do workflow
```

O handler pode retornar erro, mas a mutação já ocorreu.

Externamente, alguém pode concluir:

```text
“a transição falhou”
```

Entretanto o estado empresarial pode ser:

```text
“o efeito da action ocorreu, mas o workflow não registrou o avanço”
```

Isso é uma forma de **split failure**.

**EVIDENCIADO NO SB ATUAL:** Planning B registra explicitamente que o produto hoje não possui attempt/effect disposition de primeira classe nem reconciliation record capaz de distinguir genericamente `APPLIED` de `UNKNOWN` nesse caso. Também não evidencia retry/backoff/redrive/idempotency semantics generalizadas.

Essa constatação não é uma condenação da fundação atual. Ela mostra exatamente por que a G2 está pesquisando uma semântica mais explícita antes de definir arquitetura alvo.

---

## 19. Idempotência local não prova idempotência ponta a ponta

Suponha que o SB deduplique perfeitamente uma chamada recebida.

Depois dessa fronteira ele chama:

```text
SB -> Integration Adapter -> Provider -> downstream provider
```

A deduplicação local pode impedir que o mesmo handler seja iniciado duas vezes no SB. Mas ela não prova que:

- o adapter não repetiu a chamada;
- o provider não produziu dois efeitos;
- um callback duplicado não desencadeará nova atuação;
- a operação não foi reenviada durante failover;
- a chave sobreviveu à migração;
- dois providers em coexistência compartilham o mesmo domínio de deduplicação.

Assim:

```text
local idempotency != end-to-end idempotency
```

Qualquer claim ponta a ponta precisa demonstrar o caminho inteiro que pode produzir o efeito.

---

## 20. Idempotência também pode ser semântica

Nem toda idempotência precisa depender de deduplicar requests idênticos.

Algumas operações possuem semântica naturalmente idempotente.

Exemplo simplificado:

```text
“definir status = ARQUIVADO”
```

Executar novamente pode terminar no mesmo estado.

Mas até isso possui limites.

Se cada execução também:

- envia email;
- gera cobrança;
- adiciona linha de auditoria com significado empresarial;
- incrementa contador;
- dispara outro workflow;

então o comando composto deixa de ser trivialmente idempotente.

É necessário avaliar o **efeito completo**, não apenas o valor final de uma coluna.

---

## 21. Repetição de leitura também pode ser semanticamente perigosa

Leituras parecem seguras porque não mutam o sistema consultado. Ainda assim, uma leitura repetida pode produzir decisões diferentes.

Exemplo:

```text
08:00 saldo = 1000
08:01 saldo = 200
```

Se um cálculo ou workflow pressupunha snapshot consistente, reler durante replay pode alterar resultado histórico.

Por isso o Capítulo 09 separou:

```text
live recomputation != historical snapshot
```

E o Capítulo 06 separou replay de side-effect reexecution.

A segurança de retry depende não apenas de “muta/não muta”, mas do papel semântico daquela operação no processo.

---

## 22. Backoff e jitter: retry também é um problema de escala

Mesmo quando retry é seguro, repetir imediatamente pode piorar uma falha.

Imagine mil workers recebendo `503` e todos repetindo a cada segundo.

O provider tenta se recuperar, mas recebe novamente mil requisições sincronizadas.

Isso pode criar uma **retry storm**.

Duas técnicas comuns são:

- **backoff:** aumentar o intervalo entre tentativas;
- **jitter:** adicionar variação para evitar que todos repitam no mesmo instante.

Essas técnicas ajudam a reduzir pressão, mas não resolvem semântica.

```text
backoff makes retry gentler
backoff does not make unsafe retry safe
```

Primeiro é preciso saber se a repetição é elegível. Depois decide-se quando repeti-la.

---

## 23. Retry budget e limites

Retry infinito transforma falha temporária em consumo infinito.

Pode produzir:

- fila crescente;
- custos de provider;
- saturação de workers;
- duplicidades;
- ruído de observabilidade;
- bloqueio de trabalho novo;
- incidentes em cascata.

Por isso políticas de retry precisam de limites, como:

```text
max attempts
elapsed time
resource budget
business deadline
provider quota
manual escalation threshold
```

Esses limites não são necessariamente universais. Uma tentativa de enviar email e uma tentativa de executar pagamento possuem riscos e horizontes diferentes.

---

## 24. Cancellation também concorre com o trabalho

Cancelar não significa que uma operação parou exatamente no instante em que o botão foi clicado.

Considere:

```text
worker inicia efeito externo
usuário solicita cancelamento
provider aplica efeito
worker recebe cancelamento
```

O resultado pode ser:

```text
workflow local = cancelled
external effect = applied
```

Se o sistema simplesmente marcar “cancelado” sem reconciliar outstanding effects, produz falsa segurança.

Cancellation precisa definir:

- o que ainda pode ser impedido;
- o que já ocorreu;
- o que está `UNKNOWN`;
- o que exige compensação;
- qual postcondition define “cancelamento concluído”.

---

## 25. Autoridade também possui corridas

Concorrência não é apenas estado de dados.

Exemplo:

```text
10:00 usuário possui autoridade para aprovar
10:01 workflow começa
10:05 autoridade é revogada
10:06 workflow chega à etapa sensível
```

A autorização do início não precisa, por definição, valer eternamente.

Planning A de Workflow preserva a possibilidade de reavaliar autoridade em etapas protegidas conforme currentness e contrato do semantic owner.

Outro caso:

```text
check: provider binding está admitido
act: realizar efeito
```

Entre check e actuation o binding pode ter sido revogado.

Isso é novamente TOCTOU.

---

## 26. Version skew cria concorrência entre passados diferentes

Duas operações podem ocorrer no mesmo instante e ainda assim operar sob revisões diferentes.

```text
workflow A -> schema v3 -> policy v5
workflow B -> schema v4 -> policy v6
```

Isso não é necessariamente erro. Coexistência pode ser intencional.

O risco surge quando uma revisão assume que todos os participantes já migraram.

Exemplo:

```text
novo runtime grava novo estado
workflow antigo ainda interpreta o mesmo campo com semântica anterior
```

Por isso os Capítulos 10–13 insistem em revision vectors, coexistência, residual cohorts e withdrawal qualification.

A concorrência pode ser temporal, física e **revisionada**.

---

## 27. Eventual consistency não significa “dados errados”

Em alguns sistemas distribuídos, diferentes replicas ou serviços convergem ao longo do tempo em vez de compartilhar uma atualização instantaneamente.

Isso é **eventual consistency**.

Ela não significa automaticamente defeito. Pode ser uma escolha legítima.

O risco surge quando um consumidor exige uma garantia mais forte e lê uma observação stale como se fosse current.

Exemplo:

```text
provider aceita alteração
replica de leitura ainda mostra estado antigo
SB consulta replica
conclui incorretamente NOT_APPLIED
faz retry
```

O problema é transformar evidência ainda não convergida em uma conclusão mais forte do que ela suporta.

---

## 28. Quando serializar e quando permitir concorrência

Uma solução ingênua seria executar tudo em fila única.

Isso reduziria várias races, mas destruiria paralelismo, disponibilidade e escala.

A arquitetura precisa localizar **onde a serialização é semanticamente necessária**.

Exemplos possíveis:

- operações sobre a mesma identidade canônica;
- reserva de um recurso indivisível;
- transição exclusiva de um workflow;
- promoção de active deployment;
- aplicação ordenada de revisions de uma entidade.

Outras operações independentes podem ocorrer em paralelo.

O objetivo não é “eliminar concorrência”. É:

> permitir concorrência onde ela é legítima e coordená-la onde pode violar invariantes.

---

## 29. Invariantes ajudam mais do que tentar imaginar toda corrida

É impossível listar manualmente todos os interleavings de um sistema grande.

Por isso é útil declarar invariantes.

Exemplo de estoque:

```text
available >= 0
```

Exemplo de deployment:

```text
no máximo uma geração pode possuir autoridade efetiva de writer para o mesmo scope
```

Exemplo de cobrança:

```text
uma BusinessIntent não pode gerar duas charges canônicas independentes sem lineage explícita que justifique a multiplicidade
```

As técnicas do Capítulo 20 — property-based testing, model checking e outras — podem então explorar muitas ordens possíveis procurando violação do invariant.

---

## 30. Por que transação local não resolve todo processo empresarial

Uma transação de banco pode garantir atomicidade dentro de um boundary controlado.

Exemplo:

```text
UPDATE estoque
INSERT reserva
COMMIT
```

Isso é poderoso.

Mas um workflow empresarial pode atravessar:

```text
PostgreSQL local
email
ERP do cliente
gateway de pagamento
storage externo
pessoa aprovadora
provider logístico
```

Não existe necessariamente uma transação ACID única capaz de abraçar todos esses participantes.

Por isso sistemas distribuídos precisam trabalhar com:

- identidade de intenção/tentativa/efeito;
- disposições explícitas;
- reconciliation;
- idempotency qualification;
- compensation quando aplicável;
- durable history;
- observability/evidence;
- currentness;
- residual cohorts;
- invariants empresariais.

O objetivo não é imitar uma transação global inexistente. É preservar verdade suficiente para agir com segurança quando os boundaries não podem ser atomicamente unidos.

---

## 31. Saga e compensação: uma técnica, não uma verdade universal

Em processos distribuídos, uma abordagem conhecida é coordenar uma sequência de transações locais e definir ações compensatórias para determinadas falhas. Esse padrão costuma ser chamado **Saga**.

Exemplo didático:

```text
reservar estoque
  -> reservar orçamento
     -> solicitar transporte
```

Se transporte falhar:

```text
liberar orçamento
liberar estoque
```

Isso pode ser útil, mas não significa que toda ação seja perfeitamente reversível.

Cancelar uma compra pode ter custo. Retirar email enviado é impossível. Revogar acesso concedido não apaga o fato de que alguém já visualizou o dado. Estornar pagamento não significa que o pagamento nunca existiu.

Portanto:

```text
compensation != erase history
```

A validade da compensação pertence aos semantic owners envolvidos.

---

## 32. Redrive não apaga a tentativa anterior

**Redrive** é uma nova tentativa governada de processar trabalho previamente falho, pendente ou desviado.

É importante preservar:

```text
original attempt
    -> failure/UNKNOWN/PARTIAL disposition
    -> reconciliation or operator decision
    -> redrive attempt
```

Se o sistema simplesmente sobrescreve “tentativa 1” com “tentativa 2”, perde exatamente a evidência necessária para explicar duplicidade ou efeito tardio.

Durable execution exige lineage, não apenas um contador.

---

## 33. O papel do semantic owner

A infraestrutura pode oferecer primitivas como:

- CAS;
- transactions;
- locks;
- queues;
- deduplication;
- sequence numbers;
- idempotency keys;
- leases;
- fencing tokens;
- retry/backoff;
- reconciliation hooks.

Mas a infraestrutura não sabe, sozinha, o que “duplicado” significa para a empresa.

Exemplo:

```text
Duas notas fiscais iguais são sempre duplicadas?
```

Talvez não.

```text
Duas reservas do mesmo item são sempre inválidas?
```

Talvez não, se houver quantidade suficiente.

```text
Duas aprovações são sempre redundantes?
```

Talvez o processo exija duas pessoas distintas.

Por isso a UCA pode fornecer estruturas reutilizáveis de identity, revision, effect disposition e evidence sem se tornar um semantic god-object.

---

## 34. Provider semantics importam

Dois providers podem afirmar que suportam:

```text
idempotency
retry
transactions
ordering
```

mas significar coisas diferentes.

Um provider pode lembrar chaves por 24 horas; outro, indefinidamente. Um pode garantir ordering por partition; outro, apenas best effort. Um pode retornar uma criação original em replay; outro, responder erro de duplicate. Um pode oferecer conditional writes; outro não.

Assim:

```text
same feature label != same concurrency/effect semantics
```

A substituição segura precisa qualificar essas dimensões.

Esse ponto conecta diretamente este capítulo ao Capítulo 12.

---

## 35. `UNKNOWN` deve permanecer visível para humanos também

Há uma tentação de esconder estados difíceis da UI.

Por exemplo, trocar:

```text
PAGAMENTO_UNKNOWN
```

por:

```text
ERRO
```

porque “fica mais simples”.

Mas esses estados conduzem a ações diferentes.

`ERRO / NOT_APPLIED` pode permitir nova tentativa.

`UNKNOWN` pode exigir:

- consultar provider;
- aguardar callback;
- solicitar reconciliação humana;
- bloquear novo pagamento;
- marcar a OS como pendente de confirmação.

Uma UI simples pode traduzir o termo para linguagem operacional, mas não deve apagar a distinção semântica.

Exemplo:

```text
“Não foi possível confirmar se o pagamento foi concluído.
Não tente novamente até a verificação.”
```

Isso é mais seguro e mais útil do que um genérico “Falha”.

---

## 36. IA não pode converter incerteza em certeza

A IA pode ajudar a:

- sugerir causas de uma race;
- correlacionar tentativas;
- propor uma estratégia de reconciliação;
- explicar ao operador por que o retry está bloqueado;
- identificar padrões de duplicação;
- gerar testes de interleaving.

Mas ela não pode decidir:

```text
“provavelmente não aplicou, então vou tentar novamente”
```

quando a evidência autoritativa permanece `UNKNOWN`.

Nem pode transformar:

```text
provider accepted
```

em:

```text
business effect validated
```

sem o contrato e a evidência necessários.

**DECIDIDO COMO PRINCÍPIO TRANSVERSAL:** IA/AGWS/low-code não ampliam autoridade nem força epistemológica da evidência. Uma hipótese probabilística não substitui uma conclusão qualificada exigida para mutação perigosa.

---

## 37. Técnicas de teste para concorrência e retry

O Capítulo 20 aprofundará as técnicas, mas é útil entender o problema que cada uma tenta revelar.

### Concurrency/race analysis

**O que é:** explorar ordens diferentes entre operações concorrentes.  
**Detecta:** lost update, double allocation, cancel/approve race, stale writes.  
**Limitação:** o número de interleavings cresce rapidamente.  
**No SB:** útil para workflow, deployment, policies, resource allocation e provider cutover.

### Fault injection

**O que é:** introduzir falhas deliberadas em pontos específicos.  
**Detecta:** split failures e hipóteses de atomicidade inexistentes.  
**Exemplo:** falhar a persistência do workflow depois de a action de domínio ser aplicada.  
**Limitação:** provar que alguns pontos foram testados não cobre todos os failure boundaries.

### Retry/idempotency analysis

**O que é:** repetir operações em diferentes disposições e momentos.  
**Detecta:** duplicate effects, chaves mal escopadas, TTL insuficiente, retry após mudança de revisão.  
**Limitação:** exige conhecer o contrato real do efeito, não apenas o endpoint.

### Model checking candidate

**O que é:** representar uma máquina de estados pequena e explorar sistematicamente estados/interleavings.  
**Detecta:** sequências raras que violam invariants.  
**Limitação:** o modelo é uma abstração; um modelo incompleto pode “provar” apenas a própria simplificação.

---

## 38. O que não devemos fazer

Alguns atalhos são perigosos:

```text
timeout -> marcar NOT_APPLIED
```

```text
qualquer erro -> retry automático
```

```text
existe idempotency key -> operação é idempotente
```

```text
provider accepted -> efeito empresarial concluído
```

```text
compensação executada -> o efeito nunca aconteceu
```

```text
status local voltou -> sistema inteiro foi recuperado
```

```text
lock local -> concorrência distribuída resolvida
```

```text
latest revision -> todos os participantes já convergiram
```

```text
uma tentativa venceu -> contenders antigos perderam capacidade de atuar
```

A pesquisa G2 insiste em qualificadores justamente porque esses atalhos parecem funcionar em demonstrações e falham sob condições reais.

---

## 39. Como este capítulo se conecta às outras partes

Este tema atravessa quase todo o livro.

**Workflow:** tentativas, timers, waits, retries, durable history e efeito ambíguo.

**Integration/Providers:** reconciliation, acknowledgement, idempotency contract e provider semantics.

**Data:** optimistic concurrency, revision compatibility e stale reads.

**Authorization:** authority currentness entre check e actuation.

**Lifecycle:** coexistência de revisões e residual cohorts.

**Deployment/Recovery:** contenders, CAS, fencing e split-brain.

**Commercial/Payment:** retry de mutação financeira pode duplicar cobrança ou pagamento.

**Observability:** evidência precisa permitir distinguir tentativas, efeitos e convergência.

**AI/Low-code:** composição automática não pode apagar `UNKNOWN`, duplicar effects ou inventar retry safety.

Essa transversalidade explica por que idempotência e effect disposition aparecem como primitives reutilizáveis, sem que a UCA passe a decidir a semântica empresarial de cada efeito.

---

## 40. Estado da pesquisa versus arquitetura alvo

É importante não ler este capítulo como uma especificação final da G2.

**DECIDIDO / PRESERVADO PELA PESQUISA:** efeitos ambíguos precisam permanecer explícitos; timeout não implica `NOT_APPLIED`; `UNKNOWN` mutante requer reconcile-before-retry salvo contrato idempotente qualificado; attempted/accepted/applied/effective/converged/validated são fatos distintos; retries e redrives precisam preservar lineage relevante.

**EVIDENCIADO NO SB ATUAL:** workflow possui state transitions determinísticas, current state persistido em SQL e execução autônoma gerada. Planning B identificou, porém, action e workflow-state persistence como operações separadas, criando uma exposição concreta em que o domain effect pode ocorrer antes de a persistência do novo estado falhar. Não há generic attempt/effect lineage, `UNKNOWN` reconciliation, retry/backoff/redrive ou idempotency contract generalizados nessa superfície.

**EM PESQUISA:** como essas obrigações serão transformadas em arquitetura alvo universal, quais primitives serão concretizadas e como serão distribuídas entre capabilities/providers ainda depende da conclusão da campanha adversarial e de Planning C.

**ABERTO/INCONCLUSIVO:** não existe autorização editorial para escolher engine, banco, queue, transaction coordinator ou mecanismo universal de exactly-once. O livro explica o problema e os invariants pesquisados; não decide implementação.

---

## 41. O que você deve guardar deste capítulo

Se apenas algumas ideias permanecerem, guarde estas:

1. **Concorrência é sobre ordens possíveis de acontecimentos e invariants empresariais, não apenas sobre threads.**
2. **Timeout não significa que o efeito não ocorreu.**
3. **`UNKNOWN` é uma conclusão legítima e necessária quando falta evidência.**
4. **Retry é uma nova atuação; ele precisa ser semanticamente seguro e, muitas vezes, requalificado.**
5. **Idempotência é propriedade de uma operação sob um contrato e escopo, não magia produzida por uma chave.**
6. **`UNKNOWN → reconcile-before-retry` evita transformar incerteza em duplicidade.**
7. **`APPLIED`, `NOT_APPLIED`, `PARTIAL` e `UNKNOWN` não devem ser achatados em “sucesso/erro”.**
8. **Attempt identity, business intent e effect identity precisam permanecer distinguíveis quando a segurança depende disso.**
9. **Compensar não significa apagar a história.**
10. **Locks, CAS, retries, deduplication e transactions são mecanismos; o semantic owner continua definindo o invariant empresarial que deve ser preservado.**

No próximo capítulo, essas ideias serão usadas para tratar um problema ainda mais amplo: **como componentes, regras e processos que parecem corretos isoladamente podem formar, quando combinados, uma operação empresarial semanticamente impossível ou contraditória.**

---

## Referências internas principais

Este capítulo sintetiza principalmente os seguintes artefatos autoritativos, sem substituí-los:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`;
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`;
- `project_docs/generation-2/planning/PLANNING_A_WORKFLOW_DURABLE_EXECUTION_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_WORKFLOW_DURABLE_EXECUTION_SB_CURRENT_STATE.md`.
