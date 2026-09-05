# Capítulo 17 — O que são happy paths, edge cases, failure cases e outras famílias de teste — v1.0.0

**Chapter ID:** `CHAPTER_17`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada de autoridade:** síntese didática; não substitui pesquisa, Planning, gates, findings, edge-case registers ou arquitetura alvo.

---

## 1. O problema humano: “eu testei e funcionou”

Quase todo sistema começa sendo testado da mesma maneira: alguém executa o fluxo esperado e verifica se chegou ao resultado esperado.

Uma ordem de serviço é criada. Um técnico é designado. O serviço é concluído. O sistema registra a conclusão. Tudo parece correto.

Isso é importante. Se o caminho comum não funciona, o sistema evidentemente não está pronto. O problema nasce quando a frase **“o caminho comum funcionou”** é transformada, sem perceber, em uma afirmação muito maior:

> “o sistema é robusto”.

Essas duas frases não são equivalentes.

Um sistema empresarial raramente falha porque ninguém imaginou o botão principal. Ele falha porque duas pessoas clicam ao mesmo tempo; porque um provider responde depois do timeout; porque uma revisão de regra muda enquanto um workflow antigo continua em execução; porque o valor `0` foi tratado como ausente; porque uma permissão foi revogada enquanto uma tarefa aguardava aprovação; porque um backup existe, mas não restaura; ou porque duas partes individualmente corretas formam uma sequência empresarial contraditória.

Por isso, a Generation 2 pesquisa o comportamento do System Builder de maneira adversarial antes de permitir que a arquitetura alvo seja fechada.

**DECIDIDO NA PESQUISA:** a campanha adversarial existe para reduzir o risco de projetar a G2 apenas para *happy paths*. Ela deve procurar falhas, ambiguidades, version skew, efeitos parciais, misuse, autoridade indevida e conflitos de composição antes de Planning C.

Mas este capítulo não é um relatório dessa campanha. O objetivo aqui é construir o vocabulário necessário para entender **o que estamos perguntando quando dizemos “vamos testar isso”**.

---

## 2. Um teste é uma pergunta, não um selo de qualidade

A melhor forma de pensar em teste é tratá-lo como uma pergunta estruturada.

Um teste contém, explícita ou implicitamente:

1. um estado inicial;
2. entradas;
3. condições do ambiente;
4. uma ação ou sequência de ações;
5. uma expectativa;
6. alguma evidência usada para decidir se a expectativa foi satisfeita.

Por exemplo:

```text
Dado:
  uma OS aberta
  um técnico disponível
  estoque suficiente

Quando:
  o supervisor atribui a OS ao técnico

Então:
  a OS deve ficar atribuída ao técnico
  e a atribuição deve ser observável no estado canônico
```

Esse teste responde uma pergunta específica: **o fluxo nominal de atribuição funciona nessas condições?**

Ele não responde automaticamente:

- o que ocorre se dois supervisores atribuírem ao mesmo tempo;
- o que ocorre se o técnico perder autorização entre leitura e gravação;
- o que ocorre se o estoque reservado tiver sido consumido por outra OS;
- o que ocorre se a gravação externa acontecer, mas o timeout impedir a confirmação;
- o que ocorre se a OS estiver sob uma revisão de processo antiga;
- o que ocorre se o sistema receber uma identidade externa duplicada;
- o que ocorre se nenhuma regra tratar determinada combinação possível.

Portanto:

```text
TEST PASS
    significa
A EXPECTATIVA DESTE CENÁRIO FOI SATISFEITA

TEST PASS
    não significa
TODAS AS PROPRIEDADES IMPORTANTES DO SISTEMA FORAM PROVADAS
```

Essa diferença parece óbvia quando escrita. Na prática, ela é uma das fontes mais comuns de falsa confiança em software.

---

## 3. Happy path: o caminho em que as premissas cooperam

**Happy path** é o percurso em que entradas, dependências, participantes e condições se comportam como esperado.

Exemplo empresarial:

1. cliente abre uma solicitação válida;
2. o sistema encontra um contrato ativo;
3. há técnico elegível;
4. a peça existe em estoque;
5. o técnico executa o serviço;
6. o supervisor aprova;
7. a OS é encerrada.

O happy path responde: **a função principal consegue cumprir sua finalidade quando as premissas normais são satisfeitas?**

É indispensável. Um produto que domina falhas exóticas mas não realiza sua função principal é inútil.

O erro é considerar happy path como sinônimo de cobertura suficiente.

### O que um happy path detecta bem

Ele é bom para detectar:

- conexões principais ausentes;
- fluxo nominal incorreto;
- transformações fundamentais erradas;
- contratos básicos incompatíveis;
- regressões evidentes;
- comportamento principal inexistente.

### O que ele costuma não detectar

Ele geralmente não explora:

- extremos;
- simultaneidade;
- falhas intermediárias;
- evidência ambígua;
- estados históricos;
- mudanças de revisão;
- abuso de autoridade;
- composição inesperada;
- ausência de cobertura para casos legítimos.

**EXEMPLO DIDÁTICO:** testar apenas “enviei email e chegou” não diz o que acontece quando o provider aceita a mensagem e depois falha, quando há retry, quando o destinatário é duplicado, quando a identidade do provider muda ou quando a política atual já não permite aquele envio.

---

## 4. Boundary case: testar a borda declarada

Um **boundary case** — caso de fronteira — testa valores ou estados próximos aos limites de um domínio declarado.

Se uma quantidade permitida é de `1` a `100`, exemplos naturais são:

```text
0
1
2
99
100
101
```

Não porque esses seis números sejam mágicos, mas porque muitos defeitos aparecem exatamente na transição entre regiões válidas e inválidas.

Em software empresarial, fronteiras não são apenas numéricas. Podem ser:

- primeiro e último dia de vigência;
- meia-noite e mudança de timezone;
- zero saldo;
- capacidade exatamente esgotada;
- último usuário permitido numa quota;
- tamanho máximo de documento;
- primeira revisão sem predecessor;
- último estado antes de terminal;
- expiração exata de uma delegação;
- valor exatamente igual ao threshold de uma regra.

### Boundary case não é sinônimo de edge case

Os termos são usados de maneira intercambiável em conversas informais, mas é útil diferenciá-los.

Um boundary case está deliberadamente relacionado a uma **fronteira conhecida**.

Um edge case pode surgir de uma combinação rara ou difícil sem estar numericamente colado a uma fronteira explícita.

Exemplo:

- `quantidade = 100`, sendo 100 o máximo, é um boundary case;
- uma OS válida que atravessa simultaneamente troca de provider, mudança de Station e nova revisão de policy é um edge case mesmo que nenhum número esteja em seu limite máximo.

---

## 5. Edge case: quando as premissas continuam válidas em uma situação incomum

**Edge case** é uma situação válida ou possível situada em limites, combinações incomuns ou condições difíceis do comportamento esperado.

Importante: edge case **não é necessariamente bug**.

A pergunta é:

> o contrato continua fazendo sentido quando saímos da região confortável em que quase todos os exemplos foram pensados?

Imagine uma empresa em que uma OS normalmente dura horas, mas excepcionalmente dura seis meses. Durante esse período:

- o técnico muda de equipe;
- a política de autorização evolui;
- o schema recebe nova revisão;
- o fornecedor de mensagens é substituído;
- a fórmula de SLA muda.

Nenhum desses fatos precisa ser inválido. O caso difícil nasce da coexistência temporal.

A pesquisa G2 usa edge cases para desafiar precisamente esse tipo de premissa silenciosa.

### Famílias recorrentes de edge cases na G2

O framework adversarial exige, quando aplicável, explorar:

- `null`, missing, empty e malformed;
- duplicidade, replay e dados stale;
- zero, negativos e magnitudes extremas;
- encoding, locale, timezone, unidade, moeda e precisão;
- version skew de schema/contract;
- identidades externas apresentadas como canônicas;
- populações parcialmente migradas;
- eventos atrasados ou fora de ordem;
- operações longas atravessando revisões;
- grandes grafos e fan-out patológico.

Esses itens não são “truques de tester”. Eles são maneiras de perguntar se o modelo carregou todas as premissas das quais depende.

---

## 6. Invalid-input case: o sistema sabe rejeitar o que não deve existir?

Uma categoria simples, mas importante, é o teste de entrada inválida.

Exemplos:

- email malformado;
- quantidade negativa onde o domínio não admite negativo;
- moeda desconhecida;
- transition inexistente;
- referência a uma revisão que não existe;
- provider-native ID usado onde se exige identidade canônica;
- role inexistente;
- documento acima do limite admitido.

A pergunta não é apenas “deu erro?”.

É também:

- o erro aconteceu **antes** de efeitos indevidos?
- a resposta distingue invalid input de falha interna?
- algum estado parcial foi criado?
- a evidência permite diagnosticar o motivo?
- retry automático seria seguro ou absurdo?

Um sistema pode rejeitar a requisição e, ao mesmo tempo, ter causado um efeito lateral antes da rejeição. Por isso “retornou 400” não é prova suficiente de ausência de efeito.

---

## 7. Failure case: quando algo de que dependíamos falha

Um **failure case** introduz ou observa falha em algum componente, dependência ou etapa.

Exemplos:

- banco indisponível;
- provider de email fora do ar;
- disco cheio;
- conexão interrompida;
- worker morre no meio da execução;
- certificado expirado;
- secret indisponível;
- restore falha;
- quota externa é excedida.

O objetivo não é apenas verificar se aparece uma mensagem de erro. A pergunta mais relevante é:

> **em que estado o sistema ficou depois da falha?**

Considere uma integração de pagamento:

```text
SB envia cobrança
        |
        v
provider processa
        |
        X resposta se perde
```

O SB observa timeout.

Há pelo menos duas possibilidades:

```text
A) cobrança não ocorreu
B) cobrança ocorreu, mas a confirmação se perdeu
```

Se o software converter automaticamente timeout em `NOT_APPLIED`, um retry pode cobrar duas vezes.

Por isso a pesquisa G2 trata explicitamente disposições como:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

O Capítulo 18 aprofundará essa matéria. Aqui basta guardar que failure testing precisa observar **efeito e evidência**, não somente a presença de uma exceção.

---

## 8. Partial-failure case: quando metade funciona

Falhas totais às vezes são mais fáceis do que falhas parciais.

Se tudo está indisponível, o sistema pode simplesmente recusar operação. O problema mais perigoso aparece quando parte da ação ocorre e parte não.

Exemplo:

Uma ordem de manutenção exige:

1. reservar peça;
2. criar tarefa do técnico;
3. notificar supervisor.

A reserva é feita. A tarefa é criada. A notificação falha.

O que significa “a operação falhou”?

Não há uma resposta universal.

Talvez a notificação seja auxiliar e possa ser reenviada. Talvez ela seja requisito obrigatório para que o supervisor assuma responsabilidade. Talvez a reserva de peça precise expirar caso a tarefa não seja efetivamente assumida.

O teste precisa verificar não apenas retorno técnico, mas **semântica empresarial da parcialidade**.

Essa é uma razão para a G2 insistir em semantic owners: somente o componente que possui o significado empresarial correto pode dizer se determinado resultado parcial ainda satisfaz o contrato ou exige compensação/reconciliação.

---

## 9. Concurrency e race case: quando a ordem deixa de ser confortável

Um sistema sequencial é fácil de imaginar:

```text
ler → decidir → gravar
```

Na realidade empresarial, muitas ações concorrem:

```text
Supervisor A: ler → decidir ─────→ gravar
Supervisor B:   ler → decidir ─────→ gravar
```

Um **race condition** ocorre quando o resultado depende de uma ordem/interleaving que não foi adequadamente controlada.

Exemplos:

- duas pessoas reservam a última peça;
- dois approvers aprovam e cancelam quase ao mesmo tempo;
- retry concorre com o callback atrasado da primeira tentativa;
- failover sobe um novo writer antes de o antigo ser cercado;
- pagamento e cancelamento cruzam em trânsito.

Não basta testar “A e depois B” e “B e depois A”. Sistemas distribuídos podem produzir interleavings mais sutis.

O Capítulo 18 aprofundará concorrência, retries, idempotência e efeitos `UNKNOWN`. Neste capítulo, a ideia importante é que **concurrency case é uma família própria de perguntas**, não simplesmente um happy path executado mais rápido.

---

## 10. Version-skew case: quando cada parte vive em um tempo diferente

**Version skew** é a coexistência de revisões diferentes entre componentes, dados, processos ou providers que ainda precisam interagir.

Exemplos:

```text
workflow v3 + schema v4
runtime v5  + provider binding v6
formula v2  + policy v3
UI v8       + API contract v7
```

Em empresas reais, rollout instantâneo de tudo raramente é uma premissa segura.

O teste de version skew pergunta:

- quais combinações são compatíveis?
- compatibilidade é direcional?
- um workflow antigo pode escrever no schema novo?
- um runtime novo consegue interpretar registros antigos?
- `latest` é realmente aplicável a fatos históricos?
- rollback do código continua elegível após migração dos dados?

Essa família conecta diretamente o Capítulo 13 a técnicas que serão aprofundadas no Capítulo 20.

---

## 11. Misuse e abuse case: quando alguém usa corretamente as peças para produzir algo errado

Nem todo perigo exige um atacante sofisticado.

Um usuário pode montar um fluxo tecnicamente permitido e ainda produzir uma composição empresarial perigosa.

Exemplos:

- a mesma pessoa solicita e aprova uma despesa restrita;
- um workflow visual executa uma ação privilegiada fora do envelope de autoridade do autor;
- uma automação pessoal é promovida a semântica de equipe;
- uma integração usa credencial privilegiada como atalho para contornar autorização canônica;
- duas ações seguras são encadeadas numa ordem semanticamente proibida.

Um **misuse case** pergunta como o sistema se comporta quando uma funcionalidade é usada de maneira inadequada, acidental ou intencional.

Um **abuse case** tende a enfatizar uso deliberadamente hostil ou exploratório.

Na pesquisa da G2, essas famílias são especialmente importantes para low-code e IA. Uma ferramenta de composição aumenta a liberdade do usuário; logo, o teste precisa verificar não apenas se os blocos funcionam, mas se a composição preserva constraints, autoridade e ownership.

---

## 12. Adversarial case: tentar quebrar a hipótese, não confirmar a implementação

Um **adversarial case** muda a atitude do teste.

Em vez de perguntar:

> “isso funciona?”

pergunta-se:

> “que suposição estamos fazendo e como poderíamos torná-la falsa?”

Exemplo: um binding de provider foi qualificado.

Um teste convencional verifica que uma chamada funciona.

Uma análise adversarial pergunta:

- a qualificação ainda está atual?
- o provider mudou de semântica?
- fallback preserva as mesmas garantias?
- o provider antigo ainda possui cohorts capazes de produzir efeitos?
- IDs nativos estão vazando para a identidade canônica?
- uma resposta “success” prova resultado empresarial efetivo?
- que ocorre se a resposta chegar depois do cutover?

A campanha adversarial da G2 usa repetidos passes justamente para evitar que as mesmas perguntas sejam feitas de maneira mecânica. As técnicas precisam variar.

**EM PESQUISA:** a fase atual não pretende provar “ausência de bugs”. Seu objetivo é transformar classes conhecidas de falha e misuse em condições explícitas, ownered, bounded e testáveis.

---

## 13. Property-based thinking: testar uma propriedade, não uma lista fechada de exemplos

Às vezes o mais importante não é escolher manualmente dez exemplos, mas definir uma propriedade que deveria ser verdadeira para uma família inteira de inputs.

Isso é a base do **property-based testing**.

Exemplo simples de estoque:

> para toda operação válida de reserva, o estoque disponível nunca pode ficar negativo.

Em vez de escrever apenas:

```text
estoque=10, reserva=3 → disponível=7
```

podemos expressar uma propriedade:

```text
0 <= reservado <= disponível_inicial
=>
disponível_final >= 0
```

Outro exemplo:

> repetir uma operação declaradamente idempotente com a mesma identidade de operação não deve produzir efeito empresarial adicional.

Ou:

> uma pessoa nunca deve adquirir por composição mais autoridade do que a permitida pelo conjunto de grants e delegações aplicáveis.

### Property não significa verdade universal automaticamente

Uma propriedade mal especificada pode produzir falsa confiança.

Se escrevermos:

> “todo retry produz o mesmo resultado”

estaremos implicitamente declarando idempotência universal, algo que a G2 explicitamente evita.

Por isso, propriedades precisam carregar condições de aplicabilidade e semantic owner.

---

## 14. Invariant: aquilo que deve permanecer verdadeiro

Um **invariant** é uma propriedade que deve permanecer verdadeira ao longo de estados/transições dentro do escopo em que se aplica.

Exemplos didáticos:

- uma OS encerrada não pode simultaneamente estar “aguardando primeira aprovação” sob a mesma revisão sem uma semântica explícita que permita isso;
- uma reserva confirmada de recurso indivisível não pode pertencer autoritativamente a duas ordens incompatíveis;
- uma delegação não pode ampliar autoridade além do envelope que permite delegação;
- um `UNKNOWN` de mutação não pode ser silenciosamente convertido em `NOT_APPLIED` sem evidência suficiente.

Invariants são extremamente úteis porque mudam a pergunta de:

> “testamos os exemplos que lembramos?”

para:

> “a propriedade foi preservada através dos estados que o sistema consegue alcançar?”

No Capítulo 20 veremos como model checking e property-based testing podem explorar esse tipo de afirmação de maneira sistemática.

---

## 15. Negative test e negative permission test

Um **negative test** verifica que algo que não deve acontecer realmente não acontece.

Exemplos:

- usuário sem permissão não consegue aprovar;
- workflow inválido não é publicado;
- artefato com digest incorreto não é admitido;
- provider que não satisfaz uma dimensão obrigatória não é qualificado;
- rollback inelegível não é executado.

No domínio de autoridade, negative tests são especialmente importantes. Testar apenas o usuário autorizado demonstra que o caminho permitido existe; não demonstra que os caminhos proibidos foram fechados.

```text
ALLOW funciona
    não prova
DENY funciona
```

E mesmo um `DENY` correto precisa ser observado no nível certo: esconder um botão não prova que a ação está proibida no semantic owner.

---

## 16. Negative-space: procurar o que nem entrou na lista

**Negative-space review** é uma técnica diferente de testar cenários conhecidos.

Em vez de perguntar:

> “esses casos que catalogamos estão cobertos?”

pergunta-se:

> “que categoria importante ainda não estamos sequer procurando?”

É uma pergunta sobre o espaço ausente do modelo mental.

Imagine que uma equipe tenha excelente cobertura para:

- dados inválidos;
- concorrência;
- failures;
- retries;
- security.

Mas ninguém perguntou o que acontece quando **duas instruções humanas válidas são contraditórias**.

A cobertura pode parecer sofisticada e ainda possuir um buraco inteiro de categoria.

Na G2, negative-space é importante porque o System Builder pretende modelar trabalho empresarial, e isso inclui:

- software;
- pessoas;
- regras;
- providers;
- dados;
- recursos;
- responsabilidades;
- objetivos;
- exceções;
- evolução histórica.

Um catálogo de bugs tradicionais de software não basta para esse universo.

---

## 17. Conflict case: quando nenhuma peça está “quebrada”, mas o conjunto está errado

Essa família merece atenção especial porque será o tema do Capítulo 19.

Considere duas regras:

```text
Regra A:
  toda compra acima de R$ 10.000 exige aprovação do gerente.

Regra B:
  o gerente que solicitou uma compra deve aprová-la por ser responsável pelo centro de custo.
```

Cada regra pode ser válida isoladamente.

Juntas, elas podem violar separation of duty.

Não há necessariamente um bug em um `if`, um timeout ou uma exceção. O problema está na **composição semântica**.

Por isso a pesquisa distingue:

```text
ConflictPattern
    != ConflictSignal
    != ConflictInstance
```

Um `ConflictPattern` descreve uma composição potencialmente perigosa.

Um `ConflictSignal` é evidência sugerindo que as condições de ativação podem estar presentes.

Um `ConflictInstance` é uma ocorrência concreta observada ou reproduzível em um contexto específico.

E a regra editorial e de pesquisa é importante:

```text
Signal != ConfirmedConflict
```

Um detector pode alertar sem possuir evidência suficiente para condenar o processo.

Essa distinção evita dois erros opostos:

1. ignorar conflitos porque ainda não causaram incidente;
2. transformar toda hipótese pesquisada em defeito real e abrir correções desnecessárias.

---

## 18. Regression case: algo que funcionava deixou de funcionar

Um **regression test** existe para detectar perda de comportamento anteriormente aceito.

Depois que um bug é corrigido, é comum transformar o cenário em regression test:

```text
antes: falhava
correção aplicada
agora: passa
futuro: não deve voltar a falhar
```

Mas regression não significa apenas repetir testes antigos. Em sistemas versionados, a expectativa também precisa carregar aplicabilidade.

Um comportamento correto na revisão `v1` pode ter sido deliberadamente alterado na `v2`.

Portanto:

```text
mudança de resultado != regressão automaticamente
```

É regressão quando uma propriedade ou contrato que deveria continuar válido deixa de ser satisfeito.

---

## 19. Conformance case: duas realizações prometem a mesma semântica?

Na G2, providers podem ser substituíveis desde que preservem as dimensões qualificadas necessárias.

Um **conformance test** verifica se uma implementação/realização satisfaz um contrato ou perfil semântico definido.

Exemplo: duas engines de cálculo aceitam a mesma FormulaDefinition.

Não basta ambas parsearem a expressão. Precisamos verificar, quando relevante:

- decimal precision;
- rounding;
- money/currency;
- null/missing/error;
- timezone;
- overflow;
- limites de recurso;
- comportamento de falha.

Se divergem numa dimensão material, não são simplesmente “equivalentes”.

Conformance testing é uma das ferramentas que torna anti-lock-in sério: o objetivo não é dizer que providers são iguais, mas provar **em que sentido e sob quais limites** uma substituição é admissível.

---

## 20. Differential case: comparar realizações para encontrar divergência

Um **differential test** executa o mesmo conjunto relevante de inputs em duas ou mais realizações e compara os resultados.

Pode ser útil para:

- engines de cálculo;
- serializers;
- databases;
- providers de integração;
- versões de runtime;
- parsers;
- implementations de um mesmo adapter contract.

A divergência é um **sinal**, não necessariamente prova de qual lado está errado.

Talvez:

- A esteja errada;
- B esteja errada;
- ambas estejam corretas sob contratos diferentes;
- o contrato portátil esteja subespecificado.

Esse último resultado é particularmente valioso para pesquisa arquitetural.

---

## 21. Recovery case: voltar a responder não é suficiente

Um recovery test precisa ir além de “reiniciei e voltou”.

Como vimos no Capítulo 15:

```text
reachable
    != trusted
    != intact
    != recovered
    != re-protected
```

Um teste de recovery pode verificar:

- restore realmente utilizável;
- RPO observado;
- RTO observado;
- fencing do writer antigo;
- reconciliação de efeitos `UNKNOWN`;
- integridade dos dados restaurados;
- currentness de trust/secrets;
- reprotection;
- eligibility para retorno ao serviço.

Um health check verde é apenas uma peça da evidência.

---

## 22. Scale e resource-exhaustion case: válido não significa barato nem finito

Uma entrada pode ser totalmente válida e ainda ser patologicamente cara.

Exemplos:

- workflow com 100 mil nós;
- fan-out que cria milhões de tarefas;
- fórmula com cadeia enorme de dependências;
- documento gigantesco;
- cardinalidade de telemetry explosiva;
- retries sem limite;
- composição low-code que multiplica chamadas externas;
- processo correto cujo custo excede capacidade empresarial.

Esses testes perguntam:

- os limites estão explícitos?
- a falha é bounded?
- há backpressure?
- o custo é observável?
- uma composição válida consegue produzir DoS acidental?
- quotas e limits preservam semântica ou apenas interrompem arbitrariamente?

A relação com FinOps é direta: comportamento computacional correto pode continuar economicamente inviável.

---

## 23. Fuzzing, property-based, chaos e model checking não são “tipos de bug”

É útil separar **família de cenário** de **técnica usada para descobri-lo**.

Por exemplo:

- edge case é uma família de condição;
- concurrency case é uma família de condição;
- failure case é uma família de condição.

Já:

- fuzzing;
- property-based testing;
- chaos engineering;
- model checking;
- pairwise/N-wise analysis;
- mutation testing;

são técnicas para explorar espaços de comportamento.

Uma mesma técnica pode encontrar diferentes famílias de problemas.

Fuzzing pode revelar malformed input, resource exhaustion ou parser divergence. Model checking pode revelar race, deadlock ou invariant violation. Chaos pode revelar false recovery, residual cohorts ou ambiguous effects.

O Capítulo 20 será dedicado a essas técnicas.

---

## 24. Uma matriz mental melhor do que “teste fácil / teste difícil”

Em vez de imaginar uma escala linear, pense em dimensões independentes:

```text
                    PERGUNTA PRINCIPAL

Happy path          finalidade nominal funciona?
Boundary            comportamento muda corretamente na fronteira?
Edge                 premissas sobrevivem a condição incomum válida?
Invalid input        o impossível/proibido é rejeitado com segurança?
Failure              o que acontece quando uma dependência falha?
Partial failure      que efeitos realmente ocorreram?
Concurrency          interleavings preservam invariants?
Version skew         revisões coexistentes continuam compatíveis?
Misuse/abuse         funcionalidade pode ser usada para violar intenção?
Adversarial          qual hipótese podemos tentar falsificar?
Property/invariant   uma regra permanece verdadeira em ampla classe?
Negative             comportamento proibido está realmente bloqueado?
Negative-space       que categoria sequer incluímos no modelo?
Conflict             partes válidas formam conjunto incompatível?
Conformance          realização satisfaz perfil/contrato prometido?
Differential         realizações divergem onde não deveriam?
Recovery             retorno é efetivamente seguro e qualificado?
Scale/resource       comportamento permanece bounded sob extremos?
Regression           contrato previamente aceito foi perdido?
```

Nenhuma linha substitui todas as outras.

---

## 25. “Cobertura” também precisa dizer cobertura de quê

Dizer “temos 90% de cobertura” pode esconder mais do que esclarecer.

Cobertura pode significar:

- linhas executadas;
- branches executados;
- requisitos cobertos;
- states/transitions exercitados;
- capabilities revisitadas;
- famílias adversariais exploradas;
- providers comparados;
- revision combinations testadas;
- high-risk clusters exercitados.

Essas medidas respondem perguntas diferentes.

A pesquisa adversarial da G2 usa passes por capability e clusters porque line coverage de código não conseguiria responder se, por exemplo, **Data + Privacy + Storage + Lifecycle** formam uma interação insegura.

Da mesma forma, ter executado todas as linhas de um authorization evaluator não prova que AI + Station + delegation + long-running workflow não conseguem produzir amplificação indevida de autoridade.

**DECIDIDO NA PESQUISA:** saturação adversarial não é definida por um contador simples de casos. Ela exige revisitas sem material novo por capability e por clusters de alto risco, entre outras condições, e um novo finding material reseta os streaks afetados.

Isso não transforma saturação em certeza absoluta. Significa apenas que o processo de busca deixou de encontrar novas classes materiais sob critérios explícitos.

---

## 26. Teste, evidência e afirmação precisam permanecer separados

Considere o resultado:

```text
Teste X passou em 2026-09-05
```

A afirmação correta pode ser:

> sob o ambiente, revisão, inputs e condições daquele teste, a propriedade observada foi satisfeita.

Seria imprudente ampliar automaticamente para:

> o sistema é seguro em qualquer provider, revisão, escala e topology.

A evidência de teste possui contexto.

Isso conecta este capítulo ao conceito de **currentness**: uma qualificação pode envelhecer.

Um provider pode mudar. Um certificado pode expirar. Uma policy pode ser revisada. Um schema pode evoluir. Uma versão anteriormente compatível pode deixar de ser elegível.

Logo, alguns testes provam fatos históricos; outros sustentam qualificações que precisam ser renovadas.

---

## 27. O papel dos testes no System Builder

O System Builder não pretende ser apenas um programa com uma suíte própria de testes. Ele pretende gerar, compor e operar sistemas empresariais.

Isso cria três níveis de pergunta:

### 27.1 O próprio SB está correto?

Exemplos:

- assembler produz closure correta?
- compiler é determinístico sob os inputs declarados?
- autorização é fail-closed?
- artifact integrity é verificada?

### 27.2 A definição produzida pelo cliente é admissível?

Exemplos:

- o workflow tem states inalcançáveis?
- duas regras se contradizem?
- fórmula mistura unidades?
- Station local tenta enfraquecer policy superior?
- uma automação causa ciclo?

### 27.3 A realização concreta permanece válida no ambiente real?

Exemplos:

- provider continua qualificado?
- deployment está realmente ready?
- binding atual é o esperado?
- migração convergiu?
- residual cohorts foram drenados?
- recovery point continua elegível?

Essa divisão é crucial porque teste de código não substitui validação de processo e validação de processo não substitui evidência operacional.

---

## 28. IA pode propor testes; não pode declarar verdade por autoridade própria

IA é excelente para ampliar o espaço de perguntas:

- sugerir edge cases;
- gerar combinações;
- produzir candidatos de property;
- procurar contradictions;
- criar payloads extremos;
- resumir traces;
- propor cenários de failure injection.

Mas uma IA afirmar “parece correto” não converte hipótese em evidência suficiente.

Na G2, a IA deve permanecer dentro do princípio de não amplificação de autoridade.

Ela pode ajudar a descobrir um `ConflictSignal`.

Não deve, sem evidência e owner adequado, promover automaticamente isso a `ConflictInstance`, alterar policy, executar remediation perigosa ou declarar uma capability qualificada.

---

## 29. Como ler os próximos três capítulos

Este capítulo construiu o mapa geral.

Os próximos capítulos aprofundarão três áreas que merecem tratamento próprio:

- **Capítulo 18:** concorrência, retry, idempotência e efeitos `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`;
- **Capítulo 19:** conflitos processuais e semânticos, especialmente quando componentes localmente corretos se tornam globalmente incompatíveis;
- **Capítulo 20:** técnicas adversariais para explorar espaços de comportamento — fuzzing, property-based, chaos, model checking, version-skew matrices e negative-space.

Esses três capítulos não substituem este vocabulário; eles o usam.

---

## 30. O que você deve guardar deste capítulo

1. **Um teste que passa prova somente a afirmação que seu cenário e sua evidência realmente sustentam.**
2. Happy path é obrigatório, mas não demonstra robustez sozinho.
3. Boundary, edge, failure, partial failure, concurrency, version-skew, misuse, adversarial, negative, recovery e scale cases fazem perguntas diferentes.
4. Property e invariant permitem testar classes de comportamento em vez de depender apenas de exemplos enumerados.
5. Negative-space procura categorias ausentes do próprio modelo mental.
6. `ConflictPattern != ConflictSignal != ConflictInstance`; em particular, **`Signal != ConfirmedConflict`**.
7. Técnicas como fuzzing, property-based testing, chaos e model checking são maneiras de explorar cenários, não categorias equivalentes de problema.
8. Cobertura precisa sempre responder “cobertura de quê?”.
9. Evidência de teste possui contexto, revisão, ambiente, aplicabilidade e às vezes currentness.
10. Para o System Builder, testar significa verificar o próprio mecanismo, a admissibilidade da composição empresarial e a realização concreta no ambiente — três níveis que não podem ser colapsados.

---

## Referências internas principais

Este capítulo sintetiza, em linguagem didática, principalmente:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`;
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`;
- `project_docs/generation-2/research/edge-cases/EDGE_CASE_INDEX.md` e os registers/revisits por capability como exemplos de aplicação do método.

Esses artefatos permanecem autoritativos. Este capítulo é uma camada de compreensão e não altera findings, streaks, gates, taxonomia ou decisões de arquitetura.