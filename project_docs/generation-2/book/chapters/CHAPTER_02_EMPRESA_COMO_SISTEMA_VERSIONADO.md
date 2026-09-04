# Capítulo 02 — A ideia de modelar uma empresa como sistema versionado — v1.0.0

> **Identidade editorial:** `CHAPTER_02`  
> **Versão editorial:** `1.0.0`  
> **Status:** `PUBLISHED`  
> **Camada:** compreensão e síntese; não substitui pesquisa, síntese, Planning A/B nem futura arquitetura alvo.

## 2.1 A empresa real não cabe em um fluxograma

Imagine uma ordem de serviço de manutenção.

No papel, o processo parece simples:

```text
Solicitação -> Aprovação -> Escala -> Execução -> Encerramento
```

Esse desenho é útil, mas omite quase tudo que torna a operação empresarial difícil. Quem pode aprovar? Qual versão da regra de aprovação vale? O técnico ainda está disponível quando a escala é confirmada? A peça reservada no estoque é a mesma que foi efetivamente baixada? Um serviço executado fisicamente pode ser considerado inexistente porque faltou registrar a conclusão? O que acontece com uma OS que começou sob uma regra e termina depois de a empresa publicar outra?

Uma empresa não é apenas uma sequência de caixas. Ela combina fatos, responsabilidades, regras, estados, decisões, documentos, recursos, exceções, sistemas externos e pessoas. E todos esses elementos mudam com o tempo.

A ideia de **modelar a empresa como sistema versionado** nasce desse problema. Em vez de representar apenas “qual é o fluxo”, precisamos conseguir dizer, de forma rastreável:

- qual significado empresarial estava vigente;
- qual revisão daquele significado foi usada;
- de onde ele veio;
- quais partes foram observadas e quais foram aprovadas;
- quais realizações de software o materializaram;
- quais instâncias antigas ainda continuam em execução;
- e o que realmente convergiu depois de uma mudança.

**DECIDIDO — boundary de Planning A:** Process & Application Modeling é o dono da descrição semântica canônica de processo/aplicação antes da realização. Ele possui o significado do modelo, suas identidades, revisões, lineage e relações semânticas necessárias aos consumidores posteriores. Não possui, por isso, execução durável, schema físico, UI renderizada, provider binding ou decisões de autorização.

Essa separação é fundamental. Ela permite mudar a maneira de realizar uma atividade sem necessariamente mudar o que a atividade significa para a empresa.

## 2.2 Três perguntas diferentes: o que vimos, o que aprovamos e o que construímos

O System Builder atual já contém uma ideia especialmente importante para a G2: **observar a empresa não é o mesmo que aprovar como ela deve funcionar; aprovar o comportamento empresarial não é o mesmo que definir o software que irá realizá-lo.**

O estado atual possui uma cadeia conceitual semelhante a esta:

```text
realidade observada
       |
       v
 ProcessMirror
       |
       | aprovação / interpretação empresarial
       v
 BusinessRecipe
       |
       | análise e tradução para software
       v
 SystemDefinition
       |
       v
 montagem / build / release / runtime
```

O `ProcessMirror` é um predecessor atual para representar aquilo que foi observado: atores, atividades, decisões, exceções, responsabilidades, documentos, fluxos de informação, sistemas, evidências, incertezas e pontos pendentes. A observação carrega evidência e confiança; ela não equivale automaticamente a aprovação.

O `BusinessRecipe`, por sua vez, representa comportamento empresarial aprovado e independente de tecnologia. O estado atual já preserva a distinção constitucional `BusinessRecipe != SystemDefinition`: uma receita de negócio não é a mesma coisa que a definição do software que irá implementá-la.

**EVIDENCIADO NO SB ATUAL:** essa separação existe como contrato e arquitetura e é considerada um predecessor forte a preservar e endurecer. O Planning B, porém, também registra que o modelo atual ainda não demonstra toda a riqueza de revisionamento, compatibilidade, concorrência de edição, normalização brownfield e qualificação de convergência que a pesquisa G2 está investigando.

Essa diferença evita um erro comum. Suponha que, durante uma entrevista, alguém diga: “o supervisor sempre aprova compras acima de R$ 500”. Isso pode ser uma observação verdadeira sobre a prática atual. Ainda assim, não sabemos se ela é política aprovada, hábito informal, exceção histórica ou até uma prática indevida. Se o sistema converter observação diretamente em regra canônica, ele automatiza uma interpretação antes de qualificá-la.

## 2.3 O que significa algo ser canônico

Neste livro, **canônico** significa aquilo que o System Builder reconhece como representação normativa dentro de um domínio, segundo a autoridade apropriada.

Isso não significa “o dado mais recente que encontramos”. Também não significa “o que o provider diz”. Um BPM, ERP, banco legado ou planilha pode conter informação valiosa e até representar corretamente parte da operação, mas essa informação começa como evidência ou realização externa. Torná-la canônica exige uma transição de adoção/normalização qualificada quando isso for necessário.

Considere uma empresa que já usa um software legado de manutenção. Nele existe um status chamado `FINALIZADA`. Ao importar esse processo, o SB não pode concluir apenas pelo nome que `FINALIZADA` equivale ao conceito canônico de “serviço concluído e aceito”. Talvez no legado esse status signifique apenas que o técnico encerrou o atendimento, enquanto a aprovação do cliente acontece depois.

```text
Legado: FINALIZADA
        |
        | descoberta
        v
  significado externo ?
        |
        | normalização / evidência / revisão
        v
 significado canônico
```

**DECIDIDO — boundary:** descoberta não é adoção. Definições nativas de provider, estruturas brownfield e observações de runtime são evidência ou realização até que uma transição autorizada faça sua semântica tornar-se canônica.

A pesquisa também rejeita equivalência por conveniência: mesmo nome, primeiro resultado encontrado ou ID parecido não são prova suficiente de identidade semântica.

## 2.4 Identidade semântica não é o ID do software que a realiza

Uma “Ordem de Serviço de Manutenção” pode existir como conceito empresarial estável enquanto, ao longo dos anos, é realizada por diferentes bancos, workflow engines, APIs ou aplicações.

Por isso, a identidade canônica do processo não deve ser confundida com:

```text
ID do processo no BPM
ID da tabela no banco
ID do recurso no provider
rota HTTP
ID do artefato compilado
```

Essas identidades podem ser importantes, mas pertencem às realizações. A identidade semântica responde “qual conceito empresarial é este?”. O binding responde “qual realização está atualmente ligada a essa necessidade?”. O provider responde “qual mecanismo especializado executa determinada parte?”.

Essa distinção é uma das bases do anti-lock-in. Trocar o provider não deveria obrigar a empresa a redefinir o significado de sua própria operação.

## 2.5 Revisão: a empresa muda sem deixar de ter história

Uma **revisão (revision)** identifica uma evolução de uma definição. Uma política pode mudar. Um processo pode ganhar uma etapa. Um formulário pode receber um campo. Uma fórmula pode mudar sua regra de arredondamento. Um schema pode migrar. Uma autorização pode ser revogada.

Versionar não serve apenas para guardar cópias antigas. Serve para responder perguntas de causalidade e aplicabilidade:

- qual regra produziu este valor?
- qual processo governava esta OS?
- qual schema interpretava este registro?
- qual autorização era válida quando a ação foi tentada?
- qual release materializava aquela combinação de requisitos?

Um exemplo simples:

```text
Processo OS r17
  -> exige aprovação acima de R$ 500

Processo OS r18
  -> exige aprovação acima de R$ 300
```

Se a OS 1042 nasceu sob `r17`, publicar `r18` não responde automaticamente o que fazer com ela. Existem várias políticas legítimas: terminar instâncias antigas na revisão original, migrá-las, aplicar somente algumas mudanças ou impedir coexistência. A escolha depende da semântica do domínio e de qualificação de Lifecycle/Workflow; não pode ser deduzida simplesmente porque `18 > 17`.

**DECIDIDO — boundary:** Process Modeling possui compatibilidade e invariantes específicas de suas revisões; Lifecycle possui relações genéricas de coexistência, migração, retirada e evolução entre revisões. Workflow possui a execução durável e a evolução de instâncias em voo.

## 2.6 Revision vector: não existe necessariamente “a versão do sistema”

Em sistemas simples, é confortável imaginar uma única versão global:

```text
Sistema v42
```

Uma empresa real pode estar simultaneamente assim:

```text
Processo            r18
Schema               r9
Fórmula de custo     r4
Política de acesso  r12
Workflow runtime     r7
UI                   r21
Provider binding      r3
Release              r31
```

Esse conjunto é um **vetor de revisões (revision vector)**: uma forma conceitual de reconhecer que diferentes dimensões evoluem independentemente.

Isso não significa que toda operação precise carregar uma tabela gigantesca com todas as revisões existentes. A ideia importante é outra: quando uma conclusão depende de várias dimensões, é preciso saber quais revisões são relevantes e se elas são compatíveis.

A analogia é a manutenção de um veículo: dizer “o carro é modelo 2026” não informa a revisão do firmware, o lote da peça substituída, a versão do mapa da central ou o estado atual dos pneus. A analogia deixa de valer porque software pode manter muitas revisões coexistindo e interagindo de maneiras que um veículo físico não reproduz exatamente.

## 2.7 Lineage: de onde veio esta verdade?

**Lineage**, ou linhagem, é a relação rastreável entre uma informação e aquilo que a originou ou transformou.

Imagine que o SB importe um processo de um sistema legado, normalize três estados, peça revisão humana, gere uma nova revisão canônica e depois produza uma definição de software. Um lineage útil permitiria reconstruir algo como:

```text
processo legado X / revisão 8
        |
        | transformação M / revisão 3
        v
modelo normalizado candidato
        |
        | aprovação A
        v
processo canônico / revisão 12
        |
        | análise
        v
SystemDefinition / revisão 27
```

Lineage não é apenas auditoria burocrática. Ele permite investigar erro, reproduzir uma decisão, corrigir uma transformação e saber quais derivados podem ter sido afetados.

**EVIDENCIADO NO SB ATUAL:** ProcessMirror e BusinessRecipe já possuem predecessores de identidade/versionamento e links explícitos de evolução. **ABERTO/INCONCLUSIVO para arquitetura alvo:** o Planning B não encontrou evidência de um lifecycle genérico completo com base revision, semantic diff, correção/supersession, resolução de edições concorrentes e qualificação multidimensional de downstream convergence.

## 2.8 Publicar uma revisão não faz o mundo convergir instantaneamente

Este é um dos conceitos mais importantes para compreender a G2.

Suponha que a empresa publique uma nova regra: técnicos terceirizados agora precisam de uma aprovação adicional. A definição canônica pode mudar imediatamente, mas isso não prova que todos os outros componentes mudaram junto.

```text
                nova revisão canônica
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
      Workflow        UI/Form       Runtime A
       antigo           novo           novo
          |
          v
    instâncias em voo
```

Pode existir uma janela de coexistência. Uma Station desconectada pode ainda operar sob um envelope permitido da revisão anterior. Uma instância de workflow pode estar presa a uma versão antiga por razões corretas. Um provider pode ter aceitado uma atualização enquanto outro caminho ainda serve estado anterior.

Por isso:

```text
modelo publicado != workflow migrado
modelo publicado != schema migrado
modelo publicado != UI convergida
modelo publicado != runtime convergido
```

**DECIDIDO — boundary:** tornar uma revisão de Process/Application Modeling atual não implica que Workflow, Data, UI, Integration ou Runtime tenham convergido. Cada semantic owner precisa qualificar sua própria parte da mudança.

Essa é também a razão para distinguir **verdade desejada**, **verdade observada** e **verdade efetiva** em contextos de realização. Em linguagem simples:

- **desejada:** o que deveria estar vigente;
- **observada:** o que algum mecanismo relata estar acontecendo;
- **efetiva:** o que pode ser qualificado como realmente aplicável/atuante para o sujeito e horizonte relevantes.

Essas categorias não devem ser universalizadas sem contexto. Um dashboard verde é observação; não é automaticamente prova de que toda a população runtime está semanticamente convergida ou segura.

## 2.9 Coexistência não é necessariamente erro

Se duas revisões estão ativas ao mesmo tempo, isso pode parecer bagunça. Às vezes é. Às vezes é a única maneira segura de evoluir.

Uma migração gradual pode exigir:

```text
cohort antiga -> revisão A
cohort nova   -> revisão B
```

O problema não é a coexistência em si. O problema é não saber **quem está em qual revisão, por quê, por quanto tempo e sob quais relações de compatibilidade**.

Isso vale para processos, schemas, providers, runtimes e até regras de cálculo. O Chapter 13 aprofundará migração, coexistência e rollback; aqui basta guardar que “mais novo” e “correto” não são sinônimos e que rollback não significa simplesmente escolher um arquivo antigo.

## 2.10 Quando cada parte está certa e o processo inteiro está errado

A campanha adversarial atual encontrou um exemplo excelente de por que modelar a empresa exige mais do que validar diagramas.

Imagine um processo cuja próxima atividade precisa ser executada por alguém com determinado papel. O grafo é estruturalmente correto: existe uma transição de A para B. A política de autorização também é correta. A regra de separação de funções também é correta. Porém, quando todas essas regras são combinadas, pode não existir nenhuma pessoa legalmente elegível para executar B.

```text
Grafo:          há caminho para B          -> válido
Autorização:    regra de acesso correta    -> válida
SoD:            separação de funções       -> válida
Organização:    papéis atuais corretos     -> válida

Composição:     ninguém pode executar B    -> processo sem progresso legal
```

Isso é um **conflito semântico/processual de composição**. As partes passam na validação local; a conjunção delas cria um estado incompatível.

A pesquisa Full Pass 2 também encontrou outro caso: uma etapa pode exigir duas evidências simultaneamente válidas, mas as janelas de validade nunca se sobrepõem. Cada evidência é verdadeira isoladamente; a condição composta nunca é qualificável.

E há um terceiro caso ainda mais empresarial: o Processo A produz um efeito `E`; o Processo B observa `E`, adota-o corretamente e produz `F`; depois A tenta compensar `E`. A compensação pode ser localmente válida para A e, ainda assim, entrar em conflito com a realidade que B já construiu sobre aquele efeito.

**EM PESQUISA:** esses casos estão sendo catalogados na campanha adversarial; eles são evidência de famílias de risco e proof obligations, não uma decisão sobre o mecanismo final de implementação.

Esse ponto prepara o Capítulo 19: um sistema empresarial não pode ser validado apenas componente por componente.

## 2.11 Concorrência editorial e concorrência empresarial

Dois analistas podem partir da mesma revisão `r10` e propor mudanças diferentes:

```text
             r10
            /   \
     proposta A  proposta B
```

Se A for aceita e gerar `r11`, aplicar B depois por simples “última gravação vence” pode apagar ou contradizer A sem que ninguém perceba.

Por isso, a pesquisa exige que edições concorrentes tenham base revision explícita, detecção de conflito e resolução que preserve lineage. Uma proposta sintaticamente válida, mas baseada em revisão stale (obsoleta), não ganha autoridade para sobrescrever a verdade atual.

**HIPÓTESE/OBRIGAÇÃO PRESERVADA:** o mecanismo concreto será decidido em fase posterior; o boundary já exige que conflito semântico material seja reconciliado ou permaneça `INCONCLUSIVE`, em vez de ser resolvido silenciosamente por last-write-wins.

## 2.12 Brownfield: modelar sem fingir que a empresa começa do zero

**Brownfield** é o contexto em que já existem sistemas, dados, processos, planilhas, integrações e hábitos operacionais. É o oposto prático da fantasia de projetar tudo em terreno vazio.

O SB precisa conseguir aprender com esse ambiente sem deixar que ele determine silenciosamente a arquitetura futura.

O fluxo conceitual é:

```text
descobrir -> interpretar -> normalizar -> qualificar -> adotar
```

Nem toda descoberta precisa chegar à adoção. Uma peculiaridade do provider pode continuar como extensão/binding. Uma tradução pode ser lossy, isto é, perder parte do significado. Uma equivalência pode permanecer inconclusiva. O importante é não transformar incerteza em certeza apenas para completar o import.

**EVIDENCIADO NO SB ATUAL:** existe política de modernização strangler-first, coexistência e limites explícitos de ownership. **GAP registrado em Planning B:** não foi evidenciado um contrato genérico implementado de `discover -> normalize -> explicit adopt` com estados explícitos de mapping faithful/lossy/unresolved.

## 2.13 IA pode ajudar a escrever o mapa, mas não vira dona do território

Uma IA pode entrevistar usuários, detectar padrões, propor um processo, sugerir normalização de um legado ou produzir uma candidate revision. Isso é extremamente útil para o System Builder.

Mas capacidade de propor não é autoridade para tornar algo verdadeiro.

Uma proposta de IA precisa permanecer vinculada, quando relevante, a:

- revisão-base;
- evidência/provenance;
- escopo de autoridade;
- ambiguidades encontradas;
- aprovação ou transição de adoção apropriada.

**DECIDIDO — boundary:** AI pode propor; não pode silenciosamente adotar uma identidade externa como canônica, ampliar autoridade, alterar invariantes de outro semantic owner ou transformar mapping ambíguo em equivalência afirmada.

Isso é uma aplicação direta do princípio de não amplificação que aparecerá com mais profundidade no Capítulo 21.

## 2.14 O que versionamento não resolve sozinho

É fácil cair em outra simplificação: “se tudo tem versão, então o problema está resolvido”. Não está.

Versionamento informa identidade histórica. Ele não prova automaticamente:

- compatibilidade;
- segurança de migração;
- convergência;
- autoridade;
- correção da fórmula;
- integridade do dado;
- disponibilidade do provider;
- que um efeito externo aconteceu ou não aconteceu;
- que uma compensação continua admissível.

É por isso que a G2 combina revisionamento com semantic ownership, qualified evidence, effect disposition, lifecycle, authorization e proof obligations.

Um número de versão sem significado é apenas um rótulo.

## 2.15 Como este capítulo se conecta ao restante do livro

A ideia de empresa versionada será reutilizada em quase todos os capítulos seguintes.

O Capítulo 3 separará Capability, Provider, Binding e Semantic Owner. O Capítulo 5 mostrará por que um processo low-code é um grafo executável, mas não apenas um grafo. O Capítulo 9 aplicará lineage e revisão a fórmulas e valores derivados. O Capítulo 13 tratará explicitamente de evolução, migração, coexistência e rollback. Os Capítulos 17 a 20 mostrarão como testar as situações em que revisões e partes individualmente válidas entram em conflito.

O modelo mental pode ser resumido assim:

```text
INTENÇÃO / REALIDADE EMPRESARIAL
            |
            v
  modelo semântico canônico
     [identidade + revisão]
            |
            | lineage + authority + evidence
            v
     realizações derivadas
  / workflow / data / UI /
 / providers / artifacts /
            |
            v
     runtime observado
            |
            | qualificação
            v
      estado efetivo
```

As setas não significam que tudo seja síncrono ou centralizado. Elas representam relações de significado e prova. Em operação real, partes podem evoluir e funcionar de maneira distribuída e autônoma.

## 2.16 O que você deve guardar deste capítulo

Uma empresa não é um fluxograma: é um conjunto mutável de significados, fatos, regras, responsabilidades, estados e realizações.

Modelar esse conjunto como sistema versionado permite preservar identidade e história enquanto a operação evolui. Mas versão não é verdade, e publicação não é convergência.

A distinção essencial é:

```text
observar != aprovar != modelar software != materializar != executar != provar convergência
```

Process & Application Modeling possui o significado canônico do processo/aplicação antes da realização. Outros owners continuam responsáveis por execução, dados, UI, providers, autorização e lifecycle. Essa divisão impede que um detalhe técnico vire verdade empresarial por acidente.

E, talvez mais importante, a campanha adversarial está mostrando que **partes individualmente corretas podem formar um processo globalmente incompatível**. Por isso a Generation 2 não quer apenas guardar versões: ela quer preservar as relações que permitem saber o que uma revisão significa, de onde veio, a quem se aplica e se suas realizações continuam compatíveis.

---

## Referências internas autoritativas consultadas

Este capítulo sintetiza principalmente:

- `project_docs/generation-2/planning/PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_PROCESS_APPLICATION_MODELING_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/research/edge-cases/PROCESS_APPLICATION_MODELING_FULL_PASS_2_REVISIT.md`;
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`.

Os artefatos acima permanecem autoritativos sobre o estado da pesquisa e do planejamento. Este capítulo é interpretação pedagógica.