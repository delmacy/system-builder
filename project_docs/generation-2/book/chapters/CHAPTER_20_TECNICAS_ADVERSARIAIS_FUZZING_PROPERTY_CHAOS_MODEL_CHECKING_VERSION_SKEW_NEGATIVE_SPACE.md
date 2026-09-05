# Capítulo 20 — Técnicas adversariais: fuzzing, property-based, chaos, model checking, version-skew e negative-space — v1.0.0

**Chapter ID:** `CHAPTER_20`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada de autoridade:** síntese didática; não substitui pesquisa, Planning, gates, findings, edge-case registers ou arquitetura alvo.

---

## 1. O problema humano: testar muito não é o mesmo que testar de maneiras diferentes

Uma equipe pode executar milhares de testes e ainda investigar repetidamente a mesma região do problema.

Imagine um workflow de compra. Há testes para criar pedido, aprovar, rejeitar, pagar, cancelar e consultar. Tudo passa. Ainda assim, ninguém perguntou o que acontece se:

- dois aprovadores atuarem ao mesmo tempo;
- o pagamento aplicar no provider e a resposta se perder;
- a policy mudar no meio da execução;
- um runtime antigo continuar ativo depois de uma nova revisão;
- uma sequência improvável de eventos formar um deadlock;
- um campo aparentemente opcional aceitar valores estruturalmente válidos, mas semanticamente impossíveis;
- a própria lista de perguntas estiver esquecendo uma categoria inteira de risco.

O problema não é apenas **quantidade de testes**. É diversidade de lentes.

```text
mais casos da mesma técnica
    !=
mais classes de falha examinadas
```

A pesquisa adversarial da Generation 2 foi estruturada justamente para rotacionar técnicas. Boundary analysis, race analysis, fault injection, version-skew, provider differential, invariant reasoning, model checking, property-based testing, chaos e negative-space procuram coisas diferentes.

**DECIDIDO NA PESQUISA:** nenhuma técnica isolada autoriza declarar robustez, ausência de conflitos ou saturação. Saturação depende de cobertura repetida das capabilities e clusters, streaks elegíveis sem material novo, ausência de categorias críticas silenciosamente abertas e negative-space final.

---

## 2. Técnica adversarial não é uma família de defeito

O Capítulo 17 separou famílias de cenário de técnicas de descoberta. Aqui essa diferença fica central.

Um **edge case** é um tipo de situação. **Fuzzing** é uma técnica para explorar entradas. Uma **race condition** é uma classe de problema. **Model checking** pode ser usado para procurar uma sequência de estados que a produza. **Version skew** pode ser tanto uma dimensão de cenário quanto uma matriz sistemática de análise.

Portanto:

```text
failure family != discovery technique
```

A mesma falha pode ser descoberta por técnicas diferentes, e a mesma técnica pode revelar falhas de várias famílias.

Exemplo: um efeito duplicado de pagamento pode aparecer por:

- fault injection, ao simular timeout depois do provider aplicar;
- property-based testing, ao gerar sequências de retry;
- model checking, ao enumerar interleavings de attempt/ack/reconcile;
- chaos, ao interromper componentes durante a operação;
- version-skew analysis, se runtimes antigos e novos usarem regras diferentes de idempotência.

A convergência entre técnicas aumenta confiança; não transforma observação em prova universal.

---

## 3. Fuzzing: deixar a entrada escapar da imaginação humana

**Fuzzing** é a geração ou mutação automatizada de entradas para encontrar comportamentos inesperados, crashes, violações de contrato, caminhos não tratados ou consumo patológico de recursos.

A intuição é simples. Humanos tendem a escrever exemplos “bonitos”:

```text
nome = "João"
quantidade = 3
preço = 125.90
```

Um fuzzer pode produzir:

```text
nome = ""
quantidade = -2147483648
preço = NaN
encoding inválido
JSON profundamente aninhado
payload repetido milhares de vezes
string Unicode incomum
campo conhecido + campo contraditório
```

### O que detecta bem

Fuzzing é especialmente forte para:

- parsers;
- serializers;
- APIs;
- schemas;
- expressões;
- importadores;
- protocolos;
- limites numéricos;
- inputs estruturalmente complexos;
- resource exhaustion causado por entradas válidas ou quase válidas.

### Exemplo no SB

Um importador de definição de processo poderia receber grafos aleatórios ou mutados. A propriedade mínima seria: nenhum input deve causar crash não controlado, consumo ilimitado ou materialização silenciosa de um grafo inválido.

### Limitação

Fuzzing encontra bem anomalias mecânicas, mas não conhece sozinho o significado empresarial.

Um payload pode ser perfeitamente parseável e ainda representar:

```text
aprovar a própria compra
usar USD como se fosse BRL
apagar dado sob legal hold
atribuir técnico sem certificação
```

O fuzzer precisa ser combinado com invariantes, oráculos semânticos ou propriedades.

### Como se aplica ao SB

**HIPÓTESE DE PROVA FUTURA, não implementação atual:** fuzzing pode ser candidato para schemas, DSLs, graph import, formula expressions, provider adapters e envelopes de evidência. O livro não afirma que a Generation 2 já possui um framework de fuzzing implementado.

---

## 4. Property-based testing: testar propriedades, não listas de exemplos

No teste convencional, escrevemos exemplos específicos:

```text
2 + 2 = 4
10% de 100 = 10
```

No **property-based testing** — teste baseado em propriedades — declaramos uma propriedade geral e deixamos o framework explorar muitos exemplos.

Exemplo:

```text
para todo valor monetário válido X:
  converter X para unidade compatível e voltar
  deve preservar o valor dentro da política de rounding declarada
```

Ou:

```text
para toda sequência admissível de retries:
  o mesmo BusinessIntent não pode produzir efeitos adicionais indevidos
```

### O que detecta bem

- violações de invariantes;
- combinações de inputs esquecidas;
- operações que deveriam ser reversíveis ou monotônicas;
- relações entre encode/decode;
- idempotência qualificada;
- closure properties;
- graph invariants;
- fórmulas e unidades;
- regras cujo espaço de exemplos é grande.

### Shrinking

Uma vantagem importante é o **shrinking**: quando encontra um contraexemplo enorme, o framework tenta reduzi-lo até chegar a uma forma pequena que ainda quebra a propriedade.

Em vez de investigar um grafo de 5.000 nós, podemos descobrir que a violação mínima exige apenas três nós e duas transições.

### Limitação

A técnica é tão boa quanto a propriedade declarada.

```text
propriedade errada + muitos testes
    = confiança errada em alta escala
```

Também é possível esquecer dimensões materiais como revisão, autoridade, currentness ou provider semantics.

### Como se aplica ao SB

A pesquisa já trabalha com invariantes e proof obligations. Property-based testing pode futuramente materializar parte dessas obrigações em executáveis, especialmente para composição de grafos, tipos, fórmulas, revision vectors, providers e idempotência.

---

## 5. Mutation testing: perguntar se o teste perceberia um erro deliberado

Mutation testing altera propositalmente pequenas partes da implementação ou regra:

```text
>= vira >
ALLOW vira DENY
+ vira -
AND vira OR
campo obrigatório vira opcional
```

Depois executa os testes existentes.

Se tudo continua passando, surge uma pergunta desconfortável:

> os testes realmente protegem a semântica que afirmamos proteger?

### O que detecta

Mutation testing mede sensibilidade da suíte a erros plausíveis. É útil para revelar testes que apenas executam código sem verificar consequências relevantes.

### Limitação

Mutações artificiais não representam todas as falhas reais. Uma suíte pode matar 100% das mutações escolhidas e ainda ignorar problemas de arquitetura, concorrência, versões ou autoridade.

No SB, seria uma técnica complementar para contracts, validators e regras críticas — nunca uma métrica única de qualidade.

---

## 6. Model checking: explorar sistematicamente os estados possíveis

**Model checking** é uma técnica de verificação na qual um modelo de estados/transições é explorado sistematicamente para verificar propriedades.

Considere um fluxo simplificado:

```text
PENDING
  | approve
  v
APPROVED
  | pay
  v
PAID
```

Agora acrescente cancelamento, retry, timeout, dois workers, mudança de policy e recovery. O número de interleavings cresce rapidamente.

Um model checker pode procurar automaticamente uma sequência que viole uma propriedade como:

```text
INVARIANT:
uma ordem não pode estar simultaneamente PAID e CANCELLED
```

ou:

```text
INVARIANT:
no máximo um controller possui autoridade efetiva de escrita
```

### O que detecta bem

- deadlocks;
- estados inalcançáveis;
- transições impossíveis;
- safety violations;
- liveness failures;
- ordering problemático;
- concorrência;
- protocolos de failover/fencing;
- state machines críticas.

### Safety e liveness

Uma propriedade de **safety** diz, em essência:

> algo ruim nunca acontece.

Exemplo: duas cobranças não podem ser aplicadas para a mesma intenção.

Uma propriedade de **liveness** diz:

> algo bom eventualmente consegue acontecer sob condições declaradas.

Exemplo: uma OS válida não pode ficar eternamente presa em um ciclo interno quando todas as dependências necessárias permanecem disponíveis.

### A explosão do espaço de estados

A principal limitação é a **state-space explosion**: cada variável, ator, revisão e evento multiplica o número de combinações.

Por isso, model checking normalmente exige abstrações. E a abstração pode esconder exatamente o detalhe que produziria a falha.

### Como se aplica ao SB

A pesquisa lista explicitamente model-checking candidates para state machines críticas. Isso não significa modelar o System Builder inteiro em uma única máquina formal. Candidatos naturais incluem lifecycle de release, deployment/cutover, durable execution, recovery/fencing, entitlement/payment states e conflitos de authority.

---

## 7. Fault injection e chaos: quebrar deliberadamente as dependências

**Fault injection** introduz falhas controladas para observar comportamento:

- timeout;
- conexão interrompida;
- resposta atrasada;
- disco cheio;
- provider indisponível;
- mensagem duplicada;
- relógio deslocado;
- worker morto em ponto específico.

**Chaos testing/engineering** amplia essa ideia para condições operacionais realistas, frequentemente envolvendo múltiplos componentes e recovery contínuo.

### O que detectam bem

- suposições de disponibilidade;
- falsa equivalência entre timeout e `NOT_APPLIED`;
- retries inseguros;
- recuperação incompleta;
- dependências ocultas;
- false readiness;
- residual cohorts;
- split-brain;
- falhas em observabilidade e runbooks.

### Exemplo no SB

Durante uma mutação externa:

```text
1. provider aplica efeito
2. resposta é perdida
3. runtime recebe timeout
4. operador tenta novamente
```

A pergunta não é “houve erro?”. A pergunta correta é:

```text
qual é a disposition do efeito?
qual evidência existe?
retry é elegível?
reconciliation consegue determinar o estado real?
```

### Limitação

Chaos demonstra comportamento nos experimentos executados, não em todos os cenários possíveis. Também pode ser perigoso quando usado sem escopo, observabilidade e mecanismos de contenção.

O objetivo não é “derrubar produção para ver o que acontece”. É criar experimentos bounded que desafiem hipóteses materiais.

---

## 8. Version-skew matrix: parar de fingir que tudo evolui junto

O Capítulo 13 mostrou que a empresa possui revision vectors. A análise de **version skew** transforma essa realidade em matriz explícita.

Exemplo:

```text
Workflow   Schema   Policy   Runtime   Provider
   v3        v5       v8        v3        A2
   v3        v6       v8        v3        A2
   v4        v6       v9        v3        A2
   v4        v6       v9        v4        B1
```

A técnica pergunta quais combinações são:

- compatíveis;
- toleradas temporariamente;
- proibidas;
- desconhecidas;
- dependentes de migração;
- dependentes de requalification.

### O que detecta bem

- consumidores antigos com schemas novos;
- workflows longos atravessando mudança de policy;
- formula revision inadequada para histórico;
- provider replacement com operações in flight;
- runtimes antigos após cutover;
- rollback aparentemente possível, mas semanticamente inelegível.

### Limitação

A matriz cresce combinatoriamente. Não é viável testar todo produto cartesiano de revisões. Precisamos priorizar combinações materialmente possíveis, boundary transitions, cohorts reais e relações declaradas de compatibilidade.

---

## 9. Provider-differential analysis: dois providers com o mesmo nome de feature podem discordar

A análise diferencial executa operações equivalentes em realizações diferentes e compara resultados.

Exemplo:

```text
Provider A: rounding half-even
Provider B: rounding half-up
```

Ambos podem anunciar “decimal calculation”. A divergência revela que o nome da feature não prova equivalência semântica.

Outro exemplo:

```text
Provider A: create timeout -> request não aplicada
Provider B: create timeout -> operação pode ter aplicado
```

O contrato de retry precisa refletir essa diferença.

### O que detecta

- capability laundering;
- lowest-common-denominator abstractions;
- divergência de failure semantics;
- ordering diferente;
- limites e quotas incompatíveis;
- diferenças de evidence/provenance.

### Limitação

Se dois providers concordarem, ambos ainda podem estar errados em relação ao contrato canônico. Differential testing produz sinal de divergência; o semantic owner continua definindo o significado correto.

---

## 10. Pairwise e N-wise: explorar combinações sem testar o universo inteiro

Suponha cinco dimensões:

```text
policy revision: 3 valores
provider: 4
runtime: 3
Station: 5
network condition: 4
```

O produto cartesiano já produz 720 combinações antes de incluir dados, identidade e estado.

Técnicas **pairwise** selecionam casos para cobrir todos os pares de valores. Técnicas **N-wise** ampliam para combinações de três ou mais dimensões quando o risco justifica.

### O que detectam bem

São úteis quando bugs surgem de interações entre configurações e fatores, mas testar todas as combinações é inviável.

### Limitação

Um defeito que exija exatamente quatro condições simultâneas pode escapar de pairwise e 3-wise. A técnica reduz espaço; não prova completude.

No SB, a matriz cross-capability usa uma ideia relacionada: desafiar combinações de capabilities que concentram risco em vez de assumir que correção local compõe automaticamente.

---

## 11. Negative permission e misuse/abuse cases: testar aquilo que não deveria ser permitido

Muitas suítes verificam apenas:

```text
usuário autorizado consegue executar
```

A análise de permissão negativa pergunta:

```text
quem NÃO deve conseguir?
em qual escopo?
após qual revogação?
com qual cache antigo?
através de qual provider?
por meio de qual automação ou AI?
```

Misuse/abuse cases acrescentam comportamento malicioso, negligente ou simplesmente inesperado.

Exemplo:

- pessoa vê botão sem autoridade;
- delegação expira enquanto workflow está in flight;
- external group claim é tratado como grant canônico;
- automação pessoal tenta promover efeito para escopo Enterprise;
- IA combina duas actions válidas e produz autoaprovação.

### Limitação

Não existe catálogo final de abuso. Mudanças de produto e contexto criam novas formas de uso indevido. Isso torna essa técnica especialmente dependente de revisitas periódicas.

---

## 12. Negative-space review: investigar o que não entrou na lista

A **negative-space review** é diferente de procurar mais exemplos dentro das categorias conhecidas.

Ela pergunta:

> Qual categoria importante talvez não esteja sendo perguntada por ninguém?

É uma técnica contra o viés do próprio modelo mental.

Se a lista de testes contém apenas:

```text
input
failure
retry
provider
```

negative-space pode perguntar:

```text
E responsabilidade humana?
E conflito de objetivos?
E custos patológicos?
E dados residuais?
E offline operation?
E legal hold?
E autoridade herdada?
E versões simultâneas?
```

A Generation 2 já utilizou negative-space como gate de completude empresarial e exige nova revisão negativa antes de declarar saturação adversarial.

### Limitação

Negative-space não possui um oráculo perfeito porque sua função é justamente procurar o que o modelo ainda não representa. Sua força vem de diversidade de fontes, perspectivas e técnicas, não de uma garantia matemática de completude.

---

## 13. Papers, padrões, sistemas maduros e incidentes têm papéis diferentes

A pesquisa G2 permite explicitamente usar:

- papers acadêmicos;
- standards e specifications;
- sistemas maduros;
- documentação de providers;
- incident reports e postmortems;
- material industrial de engenharia.

Eles não têm a mesma função.

Papers podem fornecer modelos, provas e técnicas ainda não amplamente operacionalizadas. Sistemas maduros mostram mecanismos sobreviventes ao uso real. Standards ajudam a encontrar contratos interoperáveis. Postmortems revelam onde premissas razoáveis falharam em produção. Provider documentation mostra semantics e limites concretos.

O livro deve preservar uma cautela:

```text
mecanismo usado por produto famoso
    != princípio universal do SB
```

A pesquisa extrai princípios portáveis; não copia produto específico como arquitetura automática.

---

## 14. Como as técnicas se complementam

Uma forma útil de visualizar é:

```text
Fuzzing
  -> explora inputs inesperados

Property-based
  -> procura contraexemplos a propriedades

Model checking
  -> explora estados/interleavings de um modelo

Fault injection / Chaos
  -> desafia dependências e recovery em execução

Version-skew
  -> desafia coexistência entre revisões

Differential
  -> compara realizações/providers

Pairwise / N-wise
  -> reduz combinatória preservando cobertura de interações

Misuse / negative permission
  -> desafia autoridade e comportamento indevido

Negative-space
  -> desafia a própria lista de perguntas
```

Nenhuma substitui as demais.

Uma campanha adversarial madura alterna lentes porque cada uma possui **pontos cegos diferentes**.

---

## 15. O que significa “prova” em cada técnica

É perigoso usar a palavra prova de maneira uniforme.

### Exemplo-based tests
Provam apenas que os exemplos executados satisfizeram as expectativas sob aquele ambiente.

### Property-based tests
Aumentam a exploração do espaço de inputs, mas normalmente amostram esse espaço. Não equivalem automaticamente a prova formal.

### Fuzzing
Demonstra contraexemplos quando encontra falhas; ausência de crash após milhões de inputs não prova ausência de falhas.

### Model checking
Pode fornecer garantia forte **sobre o modelo e limites explorados**, mas a relação entre modelo e implementação continua sendo uma obrigação separada.

### Chaos
Produz evidência operacional sobre falhas realmente injetadas; não enumera todo o espaço de falha.

### Negative-space
Aumenta a chance de descobrir categorias omitidas, mas não pode demonstrar logicamente que nenhuma categoria desconhecida existe.

Por isso a G2 trabalha com **proof obligations** e evidência qualificada em vez de frases absolutas como “está provado que nunca falha”.

---

## 16. Saturação não é contagem de testes, findings ou ciclos

No snapshot autoritativo usado por este capítulo, a pesquisa geral já registra sete ciclos completos de elicitação/revisita acumulada, enquanto a fase adversarial possui três full passes completos e o Full Pass 4 está em andamento. A regra adversarial exige no mínimo oito full passes, dois revisits elegíveis consecutivos sem material novo por capability e cluster de alto risco, além de outras condições de fechamento.

Isso ilustra uma distinção importante:

```text
quantidade de pesquisa
    != saturação
```

Saturação é uma condição sobre **novidade material, cobertura, ownership, proof obligations e espaço negativo**, não uma comemoração por atingir determinado número.

Um finding novo material reinicia o streak afetado. Uma técnica repetida sem ampliar cobertura não deve artificialmente aumentar confiança. Um full pass só conta quando cobre todas as capabilities atuais e o conjunto obrigatório de interações.

**EM PESQUISA:** a campanha atual permanece `ACTIVE / NOT_SATURATED`; Planning C continua bloqueado. Este capítulo descreve o método, não antecipa o fechamento.

---

## 17. Como isso pode virar documentação e testes no futuro

O livro não decide a arquitetura alvo, mas a pesquisa já aponta uma tradução possível das evidências para artefatos posteriores:

```text
finding
  -> invariant / constraint candidate
  -> proof obligation
  -> acceptance criterion
  -> test/model/experiment adequado
  -> evidence
```

Nem toda obrigação vira teste unitário.

Exemplos:

- parser safety -> fuzzing;
- idempotency invariant -> property-based + fault injection;
- deployment fencing -> model checking + chaos;
- provider portability -> differential + version-skew;
- authorization non-amplification -> negative permission + abuse cases;
- cross-capability omissions -> N-wise + negative-space.

Essa diversidade evita tentar resolver todo problema com o mesmo martelo.

---

## 18. O que você deve guardar deste capítulo

1. **Testar mais não significa necessariamente testar melhor.** Repetir a mesma lente deixa os mesmos pontos cegos.
2. **Fuzzing explora inputs; property-based explora propriedades; model checking explora estados; chaos explora falhas operacionais; version-skew explora coexistência; negative-space explora omissões do próprio modelo mental.**
3. **Nenhuma técnica isolada prova robustez, completude ou saturação.**
4. **A ausência de falha observada é evidência limitada; um contraexemplo material é informação forte.**
5. **Model checking prova propriedades do modelo, não automaticamente da implementação real.**
6. **Provider differential revela divergência, mas o semantic owner continua definindo a semântica correta.**
7. **A pesquisa G2 rotaciona técnicas porque classes de falha diferentes exigem instrumentos diferentes.**
8. **Saturação é uma condição de cobertura e ausência repetida de novidade material sob critérios explícitos, não uma contagem de testes ou ciclos.**

A ideia final é simples:

```text
robustez não nasce de uma técnica perfeita

robustez cresce quando
múltiplas técnicas independentes
atacam premissas diferentes
sob invariantes e evidência explícitas
```

---

## Referências internas principais

Este capítulo foi sintetizado principalmente a partir de:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`;
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`;
- `project_docs/generation-2/research/edge-cases/EDGE_CASE_INDEX.md`;
- `project_docs/generation-2/research/edge-cases/CROSS_CAPABILITY_EDGE_CASE_MATRIX.md`;
- Capítulos 17, 18 e 19 desta camada editorial.

As fontes acima continuam autoritativas onde aplicável; este capítulo apenas reorganiza seus princípios em forma didática.