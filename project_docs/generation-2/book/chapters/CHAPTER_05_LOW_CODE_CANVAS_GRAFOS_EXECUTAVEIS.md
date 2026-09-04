# Capítulo 05 — Low-code, Canvas e processos como grafos executáveis — v1.0.0

- **ID editorial:** `CHAPTER_05`
- **Versão editorial:** `1.0.0`
- **Status:** `PUBLISHED`
- **Camada:** compreensão e síntese; não substitui pesquisa, síntese, Planning ou arquitetura autoritativa
- **Escopo conceitual:** UI / Generated Experience / Low-code Builder, Process & Application Modeling, Workflow & Durable Execution e conflitos de composição

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: desenhar um processo parece mais simples do que realmente é

Imagine que uma empresa queira digitalizar a abertura de uma ordem de serviço.

Num quadro branco, o processo pode parecer assim:

```text
[Abrir OS]
    |
    v
[Verificar estoque]
    |
    v
[Agendar técnico]
    |
    v
[Executar serviço]
    |
    v
[Encerrar OS]
```

É intuitivo olhar para esse desenho e pensar: “se eu conseguir arrastar essas caixas numa tela e ligá-las com setas, tenho um construtor de sistemas”. Essa intuição é parcialmente correta — e é justamente por isso que low-code é atraente. A pessoa consegue trabalhar com conceitos próximos da operação real em vez de escrever código para cada detalhe.

O problema aparece quando o desenho deixa de ser apenas uma explicação e passa a **produzir comportamento executável**.

“Verificar estoque” pode significar consultar uma quantidade atual. “Reservar peça” já é uma mutação. “Agendar técnico” depende de horário, competência, jornada, Station, autoridade, disponibilidade e talvez acordo de nível de serviço. “Encerrar OS” pode exigir evidência, assinatura, medição, cálculo, emissão de documento ou atualização de outro sistema. Uma seta que visualmente diz “depois” talvez esconda uma regra temporal; uma caixa que diz “aprovar” talvez dependa de quem pediu; uma condição “valor > 10.000” depende da revisão da fórmula, da moeda e do dado usado.

Por isso, o desafio do System Builder não é apenas construir um Canvas bonito. É permitir que uma pessoa **expresse uma intenção empresarial visualmente sem que a ergonomia visual apague a semântica necessária para executá-la com segurança**.

**DECIDIDO na taxonomia atual:** Process & Application Modeling é o owner da semântica canônica do processo; UI / Generated Experience / Low-code Builder projeta essa semântica para experiências interativas; Workflow & Durable Execution possui a progressão durável de uma execução admitida. Isso impede que o Canvas, o renderer ou o workflow engine se tornem, por acidente, donos de tudo.

---

## 2. Low-code não significa “sem semântica”

**Low-code** é uma forma de autoria em que grande parte da estrutura do sistema é expressa por modelos, componentes, configurações e relações de alto nível, reduzindo a necessidade de escrever código manual para cada comportamento.

No uso cotidiano, low-code costuma ser associado a:

- arrastar componentes;
- configurar formulários;
- ligar gatilhos a ações;
- criar condições;
- montar automações;
- escolher integrações;
- publicar telas ou fluxos.

Isso descreve a **interface de autoria**, mas não define o modelo semântico por baixo dela.

Um bom editor visual pode esconder complexidade **operacional** sem eliminar complexidade **semântica**. Essa distinção é essencial.

Considere dois campos iguais na tela:

```text
Valor estimado:  R$ 1.200,00
Valor faturado:  R$ 1.200,00
```

Visualmente, ambos são caixas contendo dinheiro. Semanticamente, podem ser coisas completamente diferentes. O primeiro pode ser um valor derivado de uma fórmula; o segundo pode ser um fato econômico adotado depois de um processo de faturamento. Permitir que o Canvas trate ambos como um mesmo “campo decimal monetário” apenas porque renderizam igual seria perder informação essencial.

Da mesma forma, dois botões podem parecer iguais:

```text
[Salvar rascunho]      [Autorizar pagamento]
```

Os dois são “botões” para a camada de apresentação. Mas não possuem o mesmo efeito, risco, owner, autoridade, reversibilidade ou obrigação de evidência.

A regra didática é:

```text
igualdade visual != igualdade semântica
```

Low-code de qualidade não é aquele que elimina essas diferenças. É aquele que consegue **preservá-las sem obrigar o usuário a pensar o tempo todo em toda a maquinaria técnica**.

---

## 3. O Canvas é uma superfície de autoria, não a realidade empresarial

Neste livro, usaremos **Canvas** para a superfície visual em que uma pessoa organiza componentes, nós, relações, formulários, ações ou partes de um processo.

Uma boa analogia é uma planta arquitetônica. A planta permite raciocinar sobre paredes, portas e circulação. Mas o desenho da porta não é a porta física, e o símbolo elétrico não produz eletricidade sozinho.

No System Builder, o Canvas pode representar algo como:

```text
┌──────────────────┐
│ Solicitação      │
│ de manutenção   │
└────────┬─────────┘
         |
         v
┌──────────────────┐
│ Classificar      │
│ criticidade      │
└────────┬─────────┘
         |
     ┌───┴───┐
     |       |
   alta    normal
     |       |
     v       v
[Escalar] [Planejar]
```

A representação ajuda o ser humano a compreender e editar. Entretanto, os elementos que aparecem nela deveriam continuar referenciando significados canônicos que pertencem aos seus respectivos owners.

Por isso:

```text
Canvas != processo canônico
Canvas != workflow runtime
Canvas != banco de dados
Canvas != autorização
Canvas != provider
Canvas != evidência de efeito concluído
```

**HIPÓTESE DE ARQUITETURA ainda não decidida:** a forma exata pela qual o futuro Canvas armazenará e trocará essas referências só pertence a Planning C e fases posteriores. Este capítulo explica a necessidade conceitual; não escolhe schema, framework, DSL, engine ou componente concreto.

A pesquisa de UI atualmente define a experiência canônica como uma projeção revisionada de referências semânticas estáveis, e não como DOM, árvore React, CSS, ID de ferramenta de design ou página nativa de provider. Um renderer pode realizar a experiência, mas não se torna automaticamente seu semantic owner.

---

## 4. Quando um processo vira grafo

Um processo visual pode ser modelado como um **grafo**: um conjunto de elementos conectados por relações.

A terminologia mínima é:

- **nó (node):** um ponto do grafo que representa uma atividade, estado, decisão, espera, evento, ação ou outro elemento semanticamente definido;
- **aresta (edge):** uma relação entre nós, frequentemente representando possibilidade de progressão, dependência ou fluxo;
- **guarda (guard):** condição que precisa ser satisfeita para uma transição ou caminho tornar-se elegível;
- **estado (state):** informação sobre a situação atual relevante para a progressão;
- **efeito (effect):** mudança produzida no domínio, em outro sistema ou no mundo externo;
- **entrada/saída:** dados ou referências que uma operação consome e produz;
- **constraint (restrição):** regra que limita quais composições, transições ou atuações são admissíveis.

Um exemplo um pouco mais realista:

```text
                     +----------------------+
                     | peça em estoque?     |
                     +----------+-----------+
                                |
                    +-----------+-----------+
                    |                       |
                  SIM                      NÃO
                    |                       |
                    v                       v
          +-------------------+     +-------------------+
          | reservar peça     |     | solicitar compra  |
          +---------+---------+     +---------+---------+
                    |                       |
                    +-----------+-----------+
                                |
                                v
                     +----------------------+
                     | agendar técnico      |
                     +----------+-----------+
                                |
                                v
                     +----------------------+
                     | executar serviço     |
                     +----------------------+
```

Esse desenho já permite fazer perguntas que não aparecem num formulário simples:

- A reserva de peça pode ocorrer duas vezes?
- A compra precisa terminar antes do agendamento?
- “Peça em estoque” usa quantidade física, quantidade disponível ou quantidade depois das reservas concorrentes?
- Se o estoque mudar depois da decisão, o caminho continua válido?
- Quem pode solicitar compra?
- Quem pode aprová-la?
- Pode ser a mesma pessoa?
- Se o provider de compras responder com timeout, devemos tentar de novo?
- Se a OS for cancelada enquanto a compra está em andamento, qual processo possui a compensação?

É aqui que um grafo deixa de ser um diagrama decorativo e passa a carregar obrigações executáveis.

---

## 5. Um grafo executável precisa de mais do que conectividade

É possível validar um diagrama em vários níveis.

O primeiro é puramente estrutural:

```text
A -> B -> C
```

As referências existem? Há nós órfãos? A aresta aponta para um destino válido? O tipo de saída de A pode alimentar a entrada de B?

Esse tipo de validação é útil, mas insuficiente.

Considere:

```text
[Solicitar despesa] -> [Aprovar despesa]
```

Os dois nós existem. As entradas e saídas podem ser compatíveis. O usuário pode inclusive possuir, separadamente, permissão para solicitar despesas e aprovar despesas em outros contextos.

Ainda assim, uma política de **separação de funções (separation of duty, SoD)** pode proibir que a mesma pessoa solicite **e** aprove a mesma despesa.

Então temos quatro perguntas diferentes:

```text
PrimitiveValid
      !=
CompositionAdmissible
      !=
InvocationAuthorized
      !=
EffectQualified
```

Em português:

1. **A primitiva é válida?** O nó, campo, ação ou regra faz sentido isoladamente?
2. **A composição é admissível?** A combinação desses elementos respeita as restrições que só aparecem entre eles?
3. **A invocação está autorizada agora?** O sujeito atual pode realizar aquela ação naquele recurso e contexto?
4. **O efeito foi qualificado?** Há evidência suficiente de que o resultado esperado realmente ocorreu?

O deep research de composição low-code falsificou explicitamente a suposição `cada primitiva permitida => composição permitida`. Sistemas empresariais maduros encontram restrições que só aparecem entre ações, tarefas, owners, fluxos de dados ou histórico de execução.

**EM PESQUISA:** a forma final da relação de qualificação de composição ainda não foi escolhida. A pesquisa recomenda preservar a pergunta de admissibilidade sem criar um “teorema universal do negócio” que tente compreender todos os domínios numa única engine.

---

## 6. O que pode dar errado mesmo quando cada bloco parece correto

### 6.1 Duas permissões corretas formam uma combinação proibida

Uma pessoa pode ter autoridade para:

- criar uma solicitação de compra;
- aprovar solicitações de compra.

Isso não significa que possa aprovar a própria solicitação.

A restrição só aparece quando relacionamos **ator + instância + histórico + duas operações**.

### 6.2 Uma leitura permitida e uma escrita permitida formam vazamento de dados

Um fluxo pode ter acesso legítimo a uma lista interna de salários e, separadamente, permissão para enviar e-mail externo.

```text
[Ler folha salarial] -> [Enviar arquivo por e-mail]
```

Cada ação pode ser válida em algum contexto. A combinação, entretanto, cria um fluxo de informação que pode ser proibido.

### 6.3 Uma fórmula válida e um formulário válido criam um fato que ninguém autorizou

Suponha que o sistema calcule automaticamente:

```text
custo_estimado = horas_previstas * valor_hora
```

Mostrar esse resultado é uma coisa. Persisti-lo como “custo efetivamente realizado” é outra.

```text
DerivedValue -> [Salvar] -> StoredFact
```

A composição pode atravessar uma fronteira semântica: de valor derivado para fato canônico. A existência de um componente “Salvar” não autoriza essa adoção.

### 6.4 Dois gatilhos válidos criam um ciclo destrutivo

```text
Sistema A: mudança -> chama B
Sistema B: mudança -> chama A
```

Cada automação é localmente legítima. Juntas, podem gerar recursão, duplicação, custo e efeitos externos sem limite.

Isso não significa que todo ciclo seja inválido. Processos empresariais podem ser ciclícos por natureza: reavaliação periódica, replenishment, monitoramento, revisão de SLA, reconciliação. A pergunta correta não é simplesmente “o grafo possui ciclo?”, mas “o ciclo possui semântica de progresso, limite, condição de parada ou estabilidade compatível com seu owner?”.

### 6.5 Uma experiência visualmente correta omite informação material

Uma tela responsiva pode esconder um aviso para caber num dispositivo menor. Um fallback de componente pode omitir um campo. Uma versão acessível pode possuir uma relação de rótulos diferente. Uma IA pode resumir instruções.

Se o elemento omitido era meramente cosmético, tudo bem. Se era uma condição material para a decisão humana, a experiência ficou semanticamente mais fraca embora continue renderizando sem erros.

A adversarial research de UI encontrou exatamente esse tipo de cenário: uma superfície pode permanecer localmente renderizável e submetível enquanto perde um qualificador que outro owner considera necessário para aquela ação.

---

## 7. O problema da validade “por pedaços”

Um dos resultados mais instrutivos do Full Pass 2 de UI aparece em formulários longos ou assistentes de várias etapas.

Imagine um fluxo de contratação:

```text
Etapa 1 — dados do serviço       validada em T1
Etapa 2 — preço e desconto       validada em T2
Etapa 3 — aprovação              validada em T3
Etapa 4 — confirmação final      enviada em T4
```

Entre T1 e T4, podem mudar:

- schema;
- regra de cálculo;
- política de desconto;
- autoridade do aprovador;
- condição do fornecedor;
- disponibilidade;
- revisão do processo.

É possível que **cada etapa tenha sido válida quando foi preenchida**, mas a combinação final nunca tenha existido sob uma única configuração compatível.

A ideia pode ser visualizada assim:

```text
T1: Schema A + Formula 1 + Policy X
        ^ etapa 1

T2: Schema A + Formula 2 + Policy X
                    ^ etapa 2

T3: Schema B + Formula 2 + Policy Y
                                ^ etapa 3

Resultado montado:
  pedaço de T1 + pedaço de T2 + pedaço de T3
```

A interface pode mostrar três sinais verdes. Isso prova apenas três validações locais, não necessariamente uma **qualificação conjunta**.

Essa é uma forma concreta de entender por que o System Builder pesquisa revision vectors e qualified evidence. Não se trata de “versionar tudo por burocracia”; trata-se de conseguir responder se as premissas que sustentam uma decisão ainda formam um conjunto coerente.

**ABERTO/INCONCLUSIVO:** a arquitetura final ainda não definiu como essa prova será representada, quais dependências exigirão requalificação ou como equilibrar segurança e ergonomia. O finding apenas demonstra que “todas as etapas estavam verdes” não basta universalmente.

---

## 8. O Canvas deve esconder detalhes, mas não apagar obrigações

Um usuário de negócio não deveria precisar ver algo assim em cada nó:

```text
semantic_owner=inventory
schema_revision=17
policy_revision=42
support_profile=...
effect_identity=...
currentness_horizon=...
```

Se o editor exigir essa carga mental para toda ligação, ele terá falhado como low-code.

Ao mesmo tempo, o sistema pode precisar preservar parte dessas informações nos contratos e evidências internos.

Portanto, existe uma tensão saudável:

```text
           ergonomia do autor
                  ↑
                  |
Canvas simples ---+--- semântica preservada
                  |
                  ↓
       qualificações internas
```

Uma boa experiência pode mostrar ao usuário apenas o que é material naquele momento. Por exemplo:

```text
[Enviar ordem ao fornecedor]

✓ fornecedor compatível
✓ autorização atual
! esta ação gera efeito externo
! repetição automática não garantida
```

O usuário não precisa dominar distributed systems para compreender que aquela operação possui consequências diferentes de “Salvar rascunho”.

A analogia com um painel de automóvel ajuda. O motorista não vê os sinais elétricos de cada sensor, mas recebe temperatura, combustível, falha de motor e alertas quando são relevantes. A analogia deixa de valer porque um sistema empresarial possui owners e políticas muito mais heterogêneos que um automóvel; não existe necessariamente um único fabricante controlando todas as semânticas.

---

## 9. Componentes precisam de contratos, não apenas aparência

No modelo pesquisado para UI, um componente low-code não é simplesmente “um pedaço de tela”. Ele pode possuir contrato sobre:

- propósito semântico;
- tipos de entrada aceitos;
- intentos de interação emitidos;
- obrigações de acessibilidade;
- restrições de composição;
- variantes de apresentação;
- requisitos de realização/provider.

Compare dois componentes que visualmente exibem uma seleção de pessoa:

```text
[ Técnico responsável: João ]
[ Aprovador financeiro: Maria ]
```

A camada gráfica pode usar o mesmo widget. Os contratos semânticos não são necessariamente os mesmos. “Técnico responsável” pode exigir competência e disponibilidade; “aprovador financeiro” pode exigir Role, limite de alçada e separação de funções.

Assim, reuso de componente não deve produzir reuso automático de semântica.

O mesmo princípio vale para ações:

```text
UI component
    |
    v
Interaction Intent
    |
    v
Authoritative boundary
    |
    v
Workflow / domain / integration operation
    |
    v
Qualified effect evidence
```

O clique é um **intento de interação (interaction intent)**. Ele não é, por si só, autorização nem prova de efeito.

---

## 10. “O botão está escondido” não é segurança

Um erro comum em aplicações é tratar apresentação como enforcement:

```text
se não pode -> esconder botão
```

Esconder o botão pode ser ótimo para experiência do usuário. Não deve ser a única barreira de segurança.

Uma pessoa pode usar outra versão da tela, uma sessão antiga, uma chamada direta, um cliente offline ou uma integração. Além disso, sua autoridade pode ter mudado desde que a UI foi carregada.

Por isso, a pesquisa preserva a distinção:

```text
visibilidade != autoridade
habilitação visual != permissão
renderização != enforcement
```

**EVIDENCIADO NO SB ATUAL:** o baseline atual de generated views já separa renderização de autorização para a interação representativa examinada. A view contém referências explícitas a ações, mas a interação passa por um gate de autoridade fail-closed separado. Esse é um predecessor importante; não é, entretanto, prova de que todo o futuro low-code já esteja implementado.

Também está evidenciado hoje um modelo declarativo de views com tipos limitados — `list`, `detail`, `form`, `dashboard`, `timeline`, `kanban`, `calendar`, `custom` — e bindings determinísticos para entidades, campos e ações. O runtime produz um documento gerado independente de React/DOM/provider específico. Isso é uma boa base provider-neutral.

**NÃO EVIDENCIADO NO SB ATUAL:** um component registry revisionado de propósito semântico, uma árvore low-code completa, constraints de composição generalizadas, semântica de acessibilidade/responsividade como contrato canônico, lineage completo de geração, qualification vectors de renderer e uma governança genérica de propostas AI/low-code.

Essa distinção é importante para o livro: o capítulo explica a direção conceitual pesquisada sem fingir que o produto já possui todos esses mecanismos.

---

## 11. Canvas, processo e workflow são três coisas diferentes

É útil manter três camadas mentais separadas.

### 11.1 Processo canônico

Diz **o que o processo empresarial significa**.

Exemplo:

```text
Uma OS crítica precisa ser escalada antes do atendimento normal.
```

Essa regra pertence ao modelo do processo/domínio, não ao renderer.

### 11.2 Experiência/Canvas

Diz **como o humano visualiza, configura ou interage com aquela semântica**.

Exemplo:

```text
uma faixa vermelha destaca criticidade;
um botão “Escalar” aparece na tarefa;
um formulário coleta justificativa.
```

### 11.3 Workflow durável

Diz **como uma instância admitida progride com estado durável ao longo do tempo**.

Exemplo:

```text
OS #842 está aguardando aprovação desde 14:32;
há um timer de escalonamento;
a primeira tentativa de integração ficou UNKNOWN;
o worker pode reiniciar sem perder a posição.
```

Em forma resumida:

```text
Process Model
    |  significado
    v
Executable realization
    |  execução durável
    v
Workflow Instance

Process Model
    |  projeção
    v
Experience / Canvas
    |  interação
    v
Human Intent
```

As setas representam relações, não transferência automática de ownership.

Se o usuário arrasta uma caixa no Canvas e essa alteração muda o significado do processo, a operação precisa atravessar explicitamente a fronteira do owner do processo. A UI não deveria “smuggl​ar” uma alteração de regra de negócio apenas porque a edição parecia uma mudança visual.

---

## 12. Regras, guards e condições também têm semântica

Uma guarda parece simples:

```text
SE valor > 10.000
ENTÃO exigir aprovação do gerente
```

Mas surgem perguntas:

- Qual `valor`?
- Em qual moeda?
- É valor bruto ou líquido?
- A fórmula foi alterada?
- O limiar de 10.000 pertence a uma política revisionada?
- A comparação usa o valor no momento da solicitação ou da aprovação?
- Se o valor mudar enquanto a tarefa estiver aberta, o caminho precisa ser reavaliado?

Por isso, um editor que mostra apenas:

```text
[ valor ] [ > ] [ 10000 ]
```

pode ser ergonomicamente correto, mas a realização executável precisa preservar as referências e a interpretação necessárias.

O tema matemático será aprofundado no Capítulo 09. Aqui basta guardar que **uma expressão sintaticamente válida pode ser semanticamente incompatível com o dado, revisão ou contexto que a composição lhe fornece**.

---

## 13. Estado visual não é estado do processo

Considere um Kanban:

```text
ABERTA | EM EXECUÇÃO | CONCLUÍDA
```

Arrastar um cartão de uma coluna para outra pode representar um pedido para transicionar a OS. Porém, existem duas maneiras muito diferentes de interpretar esse gesto.

Modelo perigoso:

```text
arrastou cartão -> mudar campo status = CONCLUÍDA
```

Modelo semanticamente mais cuidadoso:

```text
arrastou cartão
    -> emitiu intent "solicitar conclusão"
    -> verificar transição permitida
    -> verificar autoridade
    -> verificar precondições/postcondições
    -> executar operação
    -> qualificar resultado
    -> projetar novo estado observado/efetivo
```

Não significa que a UI precise parecer lenta ou burocrática. Grande parte disso pode ocorrer automaticamente. O ponto é que o gesto visual não deve possuir mais autoridade que a operação canônica que ele representa.

---

## 14. Concorrência: duas pessoas podem estar corretas e ainda colidir

Low-code também enfrenta concorrência na própria autoria.

Imagine dois analistas trabalhando a partir da revisão 7 de um processo.

```text
Analista A: rev7 -> adiciona aprovação -> publica rev8
Analista B: rev7 -> altera regra de desconto -> tenta publicar
```

A alteração de B pode ser válida isoladamente. Mas ela foi criada sobre uma base antiga.

O problema não se resolve com “último salvamento vence” quando as mudanças podem produzir semântica incompatível.

O edge-case register de UI já classifica concorrência de drafts e generated edits como uma situação em que fragments sintaticamente válidos podem formar postconditions incompatíveis. Isso reforça o papel de base revision, lineage e reconciliação.

No Canvas, a ergonomia pode continuar familiar:

```text
Seu fluxo foi alterado por outra revisão.
[Comparar alterações] [Rebasear] [Cancelar]
```

Por baixo dessa mensagem simples existe um problema semântico real: decidir se as alterações são independentes, compatíveis ou conflitantes.

---

## 15. Offline: uma intenção antiga pode voltar do passado

Uma aplicação capaz de operar de forma desconectada cria outra classe de problema.

Exemplo:

1. um técnico abre uma OS offline;
2. marca “executar substituição da peça”;
3. a ação fica numa fila local;
4. em outro dispositivo, um supervisor cancela a OS;
5. horas depois, o técnico reconecta;
6. o cliente tenta reenviar automaticamente a ação antiga.

A fila local pode estar perfeitamente íntegra. A ação foi válida quando criada. Ainda assim, o replay pode ressuscitar uma intenção já superseded.

Esse cenário apareceu materialmente no Full Pass 2 de UI.

O aprendizado para low-code é que um grafo ou action queue não deveria interpretar:

```text
“era válido quando enfileirado”
```

como equivalente a:

```text
“continua aplicável agora”.
```

Essa distinção será retomada nos capítulos de versionamento, runtime e idempotência.

---

## 16. Nem todo conflito pode — ou deve — ser decidido pelo Canvas

É tentador imaginar um editor que detecte todos os conflitos possíveis e impeça qualquer processo perigoso antes da publicação.

Isso seria excelente se fosse universalmente possível. Não é.

Alguns conflitos são estruturais e detectáveis antecipadamente:

```text
- referência inexistente;
- tipo incompatível;
- ciclo proibido por contrato;
- ausência de saída obrigatória;
- violação explícita de constraint declarada.
```

Outros dependem de estado runtime:

```text
- quem está executando agora;
- qual é a revisão atual da policy;
- saldo/estoque atual;
- provider disponível;
- efeito remoto ainda UNKNOWN;
- recurso já reservado por outra execução.
```

Outros ainda são semânticos e pertencem a um owner específico:

```text
- estas duas funções devem ser separadas?
- esta fórmula pode ser materializada como fato?
- esta exceção pode ultrapassar o limite normal?
- este fluxo de dados foi autorizado?
```

Por isso, a pesquisa rejeita dois extremos:

**Extremo permissivo:** “se cada bloco é válido, publique o grafo”.

**Extremo centralizador:** “o Canvas/UCA possui uma lógica universal capaz de decidir todos os significados empresariais”.

O modelo de pesquisa mais forte até agora é intermediário: **owners declaram as constraints materiais; mecanismos de composição analisam aquilo que pode ser analisado; autorização é reavaliada onde necessário; e incerteza material permanece explícita em vez de virar aprovação silenciosa**.

---

## 17. Sinal de conflito não é conflito confirmado

Um detector pode encontrar:

```text
A -> B -> A
```

Isso é um **sinal** de ciclo. Não prova que existe problema.

Talvez A e B formem um processo de reconciliação que converge depois de duas passagens. Talvez exista uma condição de parada. Talvez o ciclo seja deliberado e limitado.

Da mesma forma, duas instruções diferentes podem ser mutuamente exclusivas por condição, e portanto não estar ativas ao mesmo tempo.

É por isso que a campanha adversarial preserva:

```text
Signal != ConfirmedConflict
ConflictPattern != ConflictInstance
```

Para o Canvas, isso significa que UX de diagnóstico precisa evitar dois tipos de arrogância:

- deixar passar uma composição perigosa porque “não houve erro sintático”;
- declarar que todo padrão suspeito é defeito real.

Uma interface futura pode dizer, por exemplo:

```text
⚠ Possível ciclo de efeitos externos.
  Não foi possível provar boundedness com as informações atuais.
  Estado: INCONCLUSIVE.
```

Isso é mais útil que simplesmente “ERRO: ciclo” quando ciclos legítimos são permitidos pelo domínio.

---

## 18. Técnicas que ajudam a analisar grafos low-code

Este capítulo não entra na profundidade do Capítulo 20, mas vale apresentar as ferramentas mentais principais.

### 18.1 Validação estrutural de grafo

**O que é:** verifica nós, arestas, referências, conectividade, tipos e constraints estruturais conhecidas.

**Detecta:** links quebrados, referências ausentes, alguns ciclos ou caminhos impossíveis, incompatibilidades de input/output.

**Limitação:** não conhece automaticamente toda a semântica empresarial ou estado runtime.

**No SB:** é candidata natural para feedback rápido durante autoria e materialização.

### 18.2 Contract/type checking

**O que é:** compara aquilo que um componente/operação exige com aquilo que outro fornece.

**Detecta:** ligar uma saída monetária onde se esperava uma data; chamar uma operação sem argumento obrigatório; usar uma capability sem suporte qualificado para uma propriedade necessária.

**Limitação:** dois valores podem ter o mesmo tipo técnico e significados econômicos diferentes.

**No SB:** precisa trabalhar com referências semânticas, não apenas tipos primitivos.

### 18.3 Análise de constraints de composição

**O que é:** verifica relações que só surgem entre múltiplas operações, owners ou passos.

**Detecta:** SoD, fluxo de dados proibido, DerivedValue materializado sem autoridade, combinações incompatíveis, fan-out além de um limite declarado.

**Limitação:** depende de constraints terem sido declaradas ou deriváveis com evidência suficiente.

**No SB:** a pesquisa recomenda manter a constraint com seu semantic owner, em vez de transferir todo o significado para uma engine universal.

### 18.4 Model checking

**O que é:** técnica formal que explora estados e transições de um modelo para verificar propriedades dentro de um espaço definido.

**Detecta:** deadlocks, estados inalcançáveis, violações de invariants, certas condições de liveness/safety e interações difíceis de perceber manualmente.

**Limitação:** sofre com explosão de estados e depende da fidelidade/escopo do modelo. Não transforma automaticamente todas as regras humanas em matemática.

**No SB:** pode ser provider/mechanism especializado para classes adequadas, não necessariamente o semantic owner universal.

### 18.5 Testes adversariais de composição

**O que são:** constroem cenários deliberadamente incômodos — concorrência, revisão mudando entre etapas, provider divergente, offline replay, efeitos parciais, ciclos e autoridade stale.

**Detectam:** premissas que permanecem invisíveis no happy path.

**Limitação:** encontrar muitos casos não prova exaustividade.

**No SB:** é exatamente uma das funções da fase adversarial atual antes de Planning C.

---

## 19. O papel da IA no Canvas

Uma IA pode ser excelente para:

- transformar uma descrição em proposta de processo;
- sugerir componentes;
- organizar layout;
- propor guards;
- encontrar referências;
- explicar conflitos;
- gerar variações responsivas;
- sugerir automações;
- detectar inconsistências candidatas.

Mas existe uma fronteira fundamental:

```text
AI Proposal != Canonical Adoption
```

Uma IA capaz de montar blocos não recebe, por isso, autoridade para:

- criar um novo fato canônico;
- conceder permissão;
- ampliar `Enterprise → Station → Role → Person`;
- transformar valor derivado em StoredFact;
- decidir que um mapping ambíguo é equivalente;
- assumir que provider support significa permissão;
- ocultar qualifier obrigatório para “simplificar” a tela;
- atuar com credencial ambiente mais poderosa que a autoridade causal delegada.

Isso não reduz a IA a um autocomplete decorativo. Ao contrário: permite dar a ela um papel amplo de **arquiteta/assistente/propositora**, enquanto a autoridade permanece explícita e auditável.

O tema será aprofundado no Capítulo 21.

---

## 20. Onde entra o AGWS

O Adaptive Governed Work Surfaces (AGWS) acrescenta outra dimensão: a experiência efetiva pode variar por:

```text
Enterprise -> Station -> Role -> Person
```

Um processo pode ser o mesmo enquanto a superfície de trabalho muda conforme estação, função e pessoa.

O Canvas genérico de UI não deve decidir sozinho quais capacidades uma Station pode expor, quais componentes são obrigatórios, nem qual personalização pode promover-se para um nível superior.

Exemplo:

```text
Enterprise exige: [Alerta de segurança]
Station acrescenta: [Fila manutenção local]
Role acrescenta: [Aprovações técnicas]
Person reorganiza: [ordem dos painéis]
```

Uma personalização pessoal pode rearranjar painéis se isso estiver permitido. Não deveria conseguir remover silenciosamente um controle obrigatório do Enterprise ou criar uma capability que a Station nunca recebeu.

Isso mostra novamente a diferença entre **compor apresentação** e **possuir autoridade sobre o significado/escopo**.

---

## 21. O trade-off central: liberdade versus admissibilidade

Um Canvas excessivamente rígido produz um sistema frustrante. Se cada pequena ideia exigir desenvolvimento manual ou aprovação arquitetural, a promessa do System Builder de reduzir custo de construção se perde.

Um Canvas excessivamente permissivo produz o problema inverso: usuários montam processos que parecem funcionar, mas contêm conflitos semânticos, amplificação de autoridade, loops, efeitos duplicados ou dependências invisíveis.

Podemos resumir o trade-off:

```text
liberdade sem contratos
    -> composição fácil, segurança fraca

contratos universais excessivos
    -> segurança aparente, expressividade baixa,
       semantic god-object

constraints owner-qualified + feedback progressivo
    -> direção pesquisada
```

“Feedback progressivo” significa tentar detectar cedo aquilo que pode ser detectado cedo, sem fingir que toda decisão pode ser resolvida no editor.

Por exemplo:

- erro de tipo: design-time;
- referência inexistente: design-time;
- constraint SoD declarada: design/publish-time quando possível;
- autoridade do usuário: actuation-time;
- provider effect após timeout: runtime/reconciliation;
- conflito descoberto somente depois do efeito: audit/recovery.

Esse modelo distribui a segurança ao longo do ciclo de vida em vez de exigir que o Canvas seja onisciente.

---

## 22. Como o Capítulo 05 se conecta ao restante do livro

O conceito de grafo executável é uma ponte.

Do Capítulo 02, herdamos que a empresa é modelada como semântica revisionada, não como conjunto de telas.

Do Capítulo 03, herdamos Capability, Provider, Binding e Semantic Owner — essenciais para entender que um nó pode delegar realização sem entregar significado ao provider.

Do Capítulo 04, herdamos fechamento de dependências: ao materializar um grafo, dependências transitivas e condicionais passam a importar.

O Capítulo 06 aprofundará Workflow, ações, eventos, formulários e integrações — isto é, os mecanismos que fazem esse grafo viver no tempo e tocar outros sistemas.

O Capítulo 09 aprofundará fórmulas e valores derivados.

O Capítulo 18 explicará retries, `UNKNOWN`, efeitos parciais e idempotência.

O Capítulo 19 tratará diretamente dos conflitos processuais e semânticos, incluindo casos em que partes individualmente corretas formam um processo globalmente errado.

O Capítulo 20 aprofundará model checking, property-based testing, fuzzing, chaos e outras técnicas de falsificação.

O Capítulo 21 voltará à IA e explicará por que assistência poderosa não deve virar autoridade implícita.

---

## 23. Estado atual da pesquisa: o que já sabemos e o que ainda não sabemos

**DECIDIDO:** há owners separados para processo, UI e workflow; UI é projeção/interação e não possui automaticamente processo, schema, autorização ou durable execution.

**EVIDENCIADO NO SB ATUAL:** existem views declarativas provider-neutral, bindings determinísticos para entidade/campo/ação, um generated-view document renderer-agnostic e separação entre renderização e o gate de autoridade na interação analisada.

**EM PESQUISA:** a campanha adversarial continua falsificando composições. O Full Pass 2 de UI encontrou, entre outros, três casos materiais: etapas individualmente válidas sem um corte conjunto compatível; replay offline ressuscitando intenção superseded; e superfície adaptada removendo qualifier material sem deixar de renderizar/submeter.

**HIPÓTESE DE ARQUITETURA:** component contracts mais ricos, qualificação de composição, lineage agregado e mecanismos de análise podem fazer parte da arquitetura alvo. A forma exata não está decidida.

**ABERTO/INCONCLUSIVO:** quais classes serão provadas em design-time, quais serão requalificadas em publish/pre-execution/runtime, quais engines ou representações serão usadas e qual será a UX final do Canvas. Planning C permanece bloqueado até a campanha adversarial atingir o gate de saturação.

Essa classificação evita transformar um livro explicativo em uma decisão prematura de implementação.

---

## 24. O que você deve guardar deste capítulo

O Canvas é a linguagem visual do usuário, não a fonte universal da verdade empresarial.

Um processo executável pode ser representado como grafo, mas nós e arestas carregam mais do que geometria: referências semânticas, estado, guards, autoridade, revisões, constraints, efeitos e relações com outros owners.

A ideia mais importante é:

```text
partes válidas não garantem uma composição válida
```

Por isso, o System Builder precisa distinguir validade de primitiva, admissibilidade de composição, autorização de invocação e qualificação do efeito. Essa distinção permite que low-code permaneça poderoso sem tornar o Canvas uma autoridade onisciente.

A meta não é expor toda a complexidade ao usuário. É **absorver complexidade técnica sem apagar significado empresarial**.

Esse é o ponto em que “arrastar caixinhas” deixa de ser apenas uma interface agradável e passa a se tornar uma disciplina de composição de sistemas.

---

## Referências internas principais

Este capítulo sintetiza principalmente:

- `project_docs/generation-2/planning/PLANNING_A_UI_GENERATED_EXPERIENCE_LOW_CODE_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_UI_GENERATED_EXPERIENCE_LOW_CODE_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/planning/PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_WORKFLOW_DURABLE_EXECUTION_BOUNDARIES.md`;
- `project_docs/generation-2/research/edge-cases/UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_EDGE_CASE_REGISTER.md`;
- `project_docs/generation-2/research/edge-cases/UI_GENERATED_EXPERIENCE_LOW_CODE_BUILDER_FULL_PASS_2_REVISIT.md`;
- `project_docs/generation-2/research/deep-research/DEEP_RESEARCH_LOW_CODE_COMPOSITION_AUTHORITY_SEMANTIC_EFFECT_01.md`;
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`.

Esses artefatos permanecem autoritativos em seus respectivos escopos. O capítulo é uma síntese didática e não os substitui.
