# Capítulo 21 — IA como arquiteta/assistente sem se tornar autoridade — v1.0.0

**Chapter ID:** `CHAPTER_21`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada de autoridade:** síntese didática; não substitui pesquisa, Planning, gates, findings, taxonomia, edge-case registers ou arquitetura alvo.

---

## 1. O problema humano: a ferramenta que parece entender tudo

A inteligência artificial muda radicalmente a velocidade com que uma pessoa consegue explorar um sistema complexo. Ela pode ler requisitos, sugerir processos, comparar alternativas, produzir código, propor formulários, explicar falhas, montar grafos, identificar inconsistências e até operar ferramentas externas.

Isso cria uma tentação perigosa: confundir **capacidade de produzir uma resposta plausível** com **autoridade para declarar o que é verdade ou para agir no mundo**.

Imagine uma empresa de manutenção. O idealizador pede:

> “Monte um processo para atendimento de uma OS urgente que reserve material, escale o técnico, avise o cliente e feche a cobrança.”

Uma IA pode produzir, em segundos, um fluxo visualmente coerente. Pode até gerar os formulários e as integrações necessárias. Mas várias perguntas continuam existindo:

- esse processo respeita a política real da empresa?
- a pessoa que solicitou a mudança tinha autoridade para alterar o processo?
- o estoque pode ser reservado antes da aprovação técnica?
- o cálculo de cobrança usa a revisão correta da fórmula?
- o provider de e-mail está admitido para aquela Station?
- o workflow produzido preserva idempotência e efeitos ambíguos?
- o sistema pode publicar essa revisão agora?
- quem está autorizado a colocar a nova revisão em produção?

A IA pode ajudar a responder essas perguntas. Ela não ganha, por isso, o direito de eliminá-las.

A separação central deste capítulo é:

```text
capacidade de sugerir
    != capacidade de decidir
    != autoridade para admitir
    != autoridade para atuar
```

Essa distinção é especialmente importante no System Builder porque seu propósito não é apenas gerar software. É materializar sistemas empresariais cujas decisões, dados, processos, autoridades, providers e efeitos precisam continuar explicáveis e governáveis.

---

## 2. Antes de falar em IA: o que significa autoridade aqui?

Neste livro, **autoridade** não significa prestígio intelectual nem capacidade técnica. Significa a legitimidade qualificada para tomar determinada decisão ou produzir determinado efeito em certo escopo.

Uma pessoa pode saber programar um sistema inteiro e ainda não ter autorização para aprovar um pagamento. Um provider pode ser tecnicamente capaz de enviar mensagens e ainda não estar admitido para receber dados de determinada empresa. Um workflow pode possuir credenciais válidas e ainda assim não ter autoridade para executar uma operação fora de sua delegação.

O Planning A de Authorization estabelece uma hierarquia não amplificante:

```text
Enterprise
   ↓
Station
   ↓
Role
   ↓
Person
```

A autoridade efetiva é limitada pelas restrições superiores, delegações, assignments, exposição de capabilities e políticas aplicáveis. O mesmo artefato registra explicitamente que **nenhuma IA, superfície governada, provider, modo degradado ou customização local pode ampliar essa interseção**.

**DECIDIDO NO PLANNING A:** IA não é uma exceção ao modelo de autoridade. Ela participa de operações dentro de envelopes definidos pelos semantic owners e pela autorização aplicável.

Isso já evita um erro conceitual comum: “a IA sabe fazer” não equivale a “a IA pode fazer”.

---

## 3. IA não é semantic owner

O Capítulo 03 apresentou o **semantic owner** como o responsável pelo significado canônico de determinado domínio.

Data/Schema decide a semântica canônica de dados e migrations. Workflow/Durable Execution decide a semântica de execução durável. Authorization decide o que um principal pode fazer. Provider/Binding decide qual realização externa está qualificada, admitida e vinculada. UI/Generated Experience decide a semântica de projeção de experiências, sem possuir o processo ou a autorização subjacentes.

A IA não passa a possuir esses significados porque consegue descrevê-los.

Considere uma fórmula de preço:

```text
preço = horas * valor_hora + materiais
```

Uma IA pode sugerir que seja acrescentado um multiplicador de urgência. Essa sugestão pode ser excelente. Mas a nova fórmula não se torna verdade empresarial no instante em que o modelo a escreve.

Ela precisa atravessar o boundary do semantic owner competente, adquirir identidade/revisão, ser validada segundo as regras aplicáveis e somente então participar de uma decisão admitida.

Portanto:

```text
model output != canonical truth
```

**DECIDIDO COMO BOUNDARY:** uma saída de IA pode ser input, hipótese, proposta, explicação, draft ou evidência auxiliar. Ela não recebe automaticamente o status de verdade canônica do domínio que descreve.

---

## 4. Uma cadeia útil: sugerir, analisar, compor, materializar, admitir e atuar

Para entender onde IA pode participar, é útil separar seis verbos que sistemas tradicionais frequentemente misturam.

### 4.1 Sugerir

A IA produz uma possibilidade: um processo, uma tela, uma fórmula, um provider, uma correção, uma policy ou um plano.

Ainda não existe obrigação de aceitar nada.

### 4.2 Analisar

A IA compara evidências, procura inconsistências, explica trade-offs, identifica riscos ou testa mentalmente uma composição.

Uma análise pode ser sofisticada sem ser uma decisão autoritativa.

### 4.3 Compor

A IA combina primitivas já conhecidas: nós de workflow, componentes de UI, actions, bindings, schemas ou regras.

Aqui aparece um risco importante: cada peça pode ser válida isoladamente enquanto a composição é inválida. Os Capítulos 19 e 20 explicaram exatamente esse problema.

### 4.4 Materializar

Uma proposta pode ser convertida em um artefato concreto: uma definição revisionada, arquivo, grafo, formulário, migration draft ou release candidate.

Materializar não significa admitir.

### 4.5 Admitir

A admissão declara que aquele artefato, provider ou realização satisfaz os critérios aplicáveis para um uso específico.

Esta etapa pertence aos semantic owners, políticas e gates competentes. Não nasce da autoconfiança do modelo nem da mera existência do artefato.

### 4.6 Atuar

Atuar significa produzir um efeito: publicar uma revisão, modificar dado, enviar mensagem, provisionar recurso, cobrar cliente, executar pagamento, realizar deployment ou alterar uma policy.

Essa etapa exige autoridade própria.

A cadeia pode ser resumida assim:

```text
intenção/contexto
      ↓
   sugestão
      ↓
    análise
      ↓
   composição
      ↓
 materialização
      ↓
   validação
      ↓
    admissão
      ↓
 autorização
      ↓
    atuação
      ↓
 evidência/reconciliação
```

A IA pode participar intensamente de quase toda a cadeia. O erro é permitir que sua participação em uma etapa seja convertida silenciosamente em autoridade sobre as seguintes.

---

## 5. “Humano no loop” não resolve tudo sozinho

Uma resposta superficial para o problema seria: “basta exigir que um humano clique em aprovar”.

Isso é insuficiente.

O ser humano também possui autoridade limitada. Um funcionário do estoque não ganha autoridade para alterar uma regra tributária apenas porque uma IA apresentou um botão “Aprovar”. Um gerente de uma Station não pode remover uma proibição obrigatória definida no nível Enterprise se sua delegação não permite isso.

Logo:

```text
human approval != universal authority
```

O clique humano precisa ser interpretado dentro de contexto:

- quem é o principal?
- sob qual Role e Station ele atua?
- qual operação está aprovando?
- qual revisão está sendo aprovada?
- qual delegation envelope se aplica?
- quais restrições superiores continuam obrigatórias?
- a evidência usada ainda está current?

A IA não pode transformar uma aprovação humana fora de escopo em autoridade válida. O mesmo vale no sentido inverso: uma operação já legitimamente automatizada não precisa necessariamente pedir aprovação humana a cada passo apenas para “parecer segura”. O desenho correto depende da autoridade e dos invariantes do processo, não de uma cerimônia genérica.

---

## 6. Non-amplification: a IA só pode usar a autoridade que realmente recebeu

Um dos princípios mais importantes para IA agente é **não amplificação de autoridade** (non-amplification).

Em termos simples:

```text
autoridade efetiva da IA/agente
    <= autoridade explicitamente delegada
```

Se uma pessoa pode consultar OSs, mas não cancelá-las, um agente atuando em nome dela não deve conseguir cancelar uma OS apenas porque possui tecnicamente acesso a uma ferramenta que oferece essa operação.

Se uma Station pode usar determinado provider de e-mail, mas não administrar credenciais globais do provider, a IA dessa Station não pode transformar “consigo alcançar a API” em “posso administrar a conta inteira”.

O Planning A de Authorization é explícito: discovery ou disponibilidade técnica de uma capability/provider não cria autoridade; automações também não fabricam autoridade pelo simples fato de possuírem uma credencial.

Esse princípio protege contra uma classe conhecida de problema chamada **confused deputy**: um componente com poder elevado é induzido a utilizar esse poder em nome de alguém que não possui a mesma autoridade.

Para evitá-lo, é necessário preservar ao longo da cadeia:

```text
quem pediu
+ em nome de quem se atua
+ qual escopo se aplica
+ qual delegação permite a operação
+ qual revisão de policy foi usada
```

A IA não deve apagar esse contexto ao atravessar ferramentas.

---

## 7. Tool use: ter uma ferramenta disponível não equivale a poder usá-la

Modelos modernos podem selecionar e invocar ferramentas. No SB, isso pode futuramente incluir operações sobre dados, workflows, providers, deployments ou outras capabilities.

Tecnicamente, uma ferramenta pode estar registrada e acessível. Semanticamente, isso não significa que toda chamada seja permitida.

```text
tool available != operation authorized
```

A autorização deve ser verificada no boundary apropriado, usando o principal e o contexto efetivos. Isso reduz a dependência de instruções como “não faça X” dentro do prompt, porque uma restrição empresarial relevante não deveria existir apenas como conselho textual ao modelo.

**HIPÓTESE DE ARQUITETURA, NÃO DECISÃO DESTE LIVRO:** uma implementação futura pode usar tokens scoped, capability handles, delegation envelopes ou outras formas de limitar tools. O mecanismo concreto pertence à arquitetura alvo futura. O princípio já estabelecido é que a IA não deve ampliar autoridade.

---

## 8. AI/low-code: composição visualmente plausível ainda pode estar errada

O Planning A de UI / Generated Experience / Low-code Builder contém um boundary particularmente importante para este capítulo: IA e low-code podem propor layouts, components, bindings e experience revisions, mas são **mecanismos de proposta/geração, não autoridade canônica**.

Isso resolve uma confusão frequente.

Uma IA pode criar um formulário perfeito para encerrar uma OS. O botão pode estar bonito, os campos podem validar e a action binding pode existir. Ainda assim:

- o usuário pode não estar autorizado a encerrar a OS;
- a OS pode não estar em estado que permita fechamento;
- pode faltar uma medição obrigatória;
- pode existir material ainda reservado;
- um approval pode estar pendente;
- a regra de faturamento pode exigir outro passo.

Portanto:

```text
renderable != semantically valid
```

O Planning A também registra:

```text
successful click/submit
    != authorized effect
    != applied effect
    != converged effect
```

A IA pode desenhar a superfície. A superfície não adquire, com isso, domínio sobre a verdade que está projetando.

---

## 9. Um exemplo completo: a IA desenha um fluxo de manutenção

**EXEMPLO DIDÁTICO.** Suponha que uma empresa queira automatizar o atendimento de ar-condicionado:

```text
Chamado
  ↓
Diagnóstico
  ↓
Reservar peça
  ↓
Executar serviço
  ↓
Enviar laudo
  ↓
Cobrar
```

A IA recebe dezenas de documentos e propõe esse processo. Ele parece coerente.

Depois aparece uma regra empresarial: peças acima de R$ 2.000 precisam de aprovação antes da reserva. A IA modifica o grafo:

```text
Diagnóstico
  ↓
[peça > 2.000?]
  ├─ sim → Aprovação → Reserva
  └─ não ───────────→ Reserva
```

Até aqui, a IA está fazendo um excelente trabalho de composição.

Mas observe as fronteiras:

1. A definição de `peça > 2.000` precisa usar uma semântica de valor/moeda correta.
2. A regra de aprovação pertence ao owner/policy competente.
3. Quem pode aprovar depende de Authorization/Organization.
4. A reserva depende da semântica do estoque.
5. O envio do laudo depende de provider/binding admitido e de privacy/policy aplicáveis.
6. A cobrança depende de rating/billing e da revisão comercial adequada.
7. O workflow precisa preservar efeitos parciais e retries seguros.

Uma IA não elimina essas fronteiras ao produzir um grafo que “faz sentido”. Ela ajuda a atravessá-las explicitamente.

Esse é o tipo de IA que interessa ao System Builder: uma inteligência capaz de **conectar os owners sem se tornar dona de todos eles**.

---

## 10. IA como arquiteta: arquitetar não é legislar sozinha

A palavra “arquiteta” pode gerar outra confusão. Em projetos de software, arquitetura envolve decompor problemas, identificar boundaries, comparar soluções, analisar dependências e preservar propriedades do sistema.

Uma IA pode ser extraordinariamente útil nisso. Pode, por exemplo:

- detectar que uma função está acumulando semantic ownership de domínios diferentes;
- sugerir a separação entre capability e provider;
- encontrar uma dependência que quebra autonomia de runtime;
- identificar que um retry pode duplicar um efeito;
- comparar uma proposta com invariants já registrados;
- apontar que a evidência disponível é insuficiente.

Nada disso exige transformar a IA em autoridade final.

No contexto da pesquisa G2, inclusive, a distinção é essencial:

```text
AI-generated hypothesis
    != research finding
    != architectural decision
```

Uma hipótese torna-se material de pesquisa quando é confrontada com evidência e com os mecanismos autoritativos da campanha. Um finding continua distinto de Planning. Planning continua distinto de arquitetura alvo. E o livro continua distinto de todos eles.

A IA pode acelerar o raciocínio; não deve colapsar a cadeia de autoridade que torna o raciocínio verificável.

---

## 11. IA também é consumidora de evidence, e evidence pode estar stale

Modelos respondem com base no contexto que recebem. Se esse contexto estiver incompleto, stale, contraditório ou fora de escopo, uma resposta linguisticamente convincente pode estar errada.

Por isso, o problema não é apenas “alucinação” no sentido popular. Há um problema arquitetural mais geral: **qual era a evidência aplicável quando a sugestão foi produzida?**

Se a IA recomendar um provider porque leu uma qualification antiga, a recomendação pode não ser válida depois de uma mudança de binding, policy, privacy requirement ou provider capability.

Se recomendar rollback com base em telemetry antiga, pode estar ignorando uma migration já aplicada.

Assim:

```text
confidence of answer != currentness of evidence
```

Uma camada de IA robusta precisa preservar referências suficientes para que decisões posteriores possam requalificar a evidência no momento correto. O modelo pode ajudar a interpretar evidências; não deve transformar evidence stale em verdade atual apenas porque sua resposta é fluente.

---

## 12. Provenance de geração: saber de onde veio uma proposta

Quando IA produz um artefato relevante, sua origem pode ser material para compreensão e revisão.

Uma definição gerada pode depender de:

- revisão dos inputs fornecidos;
- instruções/template usados;
- modelo/provider selecionado;
- versão do gerador/orquestrador;
- tools consultadas;
- base revision sobre a qual a mudança foi proposta.

Isso é **lineage/provenance de geração**. Ele ajuda a explicar como a proposta apareceu.

Mas provenance não é aprovação:

```text
traceable generation != admitted semantics
```

Saber que “o modelo X gerou esta revisão usando os documentos A e B” é útil. Não prova que a revisão respeita todas as regras empresariais.

Da mesma forma, assinatura, hash ou imutabilidade de um artefato podem provar integridade/procedência sem provar sua correção semântica.

---

## 13. Generated artifact não é admitted artifact

Esta separação merece ser explícita:

```text
generated artifact != admitted artifact
```

Uma IA pode gerar um schema, workflow, tela ou migration que seja sintaticamente perfeito e ainda assim seja inadmissível.

A admissão pode depender de:

- invariants estruturais;
- compatibilidade de revisions;
- authorization;
- privacy/compliance;
- provider qualification;
- tests/proofs;
- governance approvals;
- lifecycle/currentness;
- ausência de conflitos materiais.

Os mecanismos concretos variam por capability. O princípio não: a geração cria um candidato; o semantic owner e os gates competentes determinam se esse candidato pode tornar-se parte do sistema.

Isso é particularmente valioso para o System Builder porque permite usar modelos muito produtivos sem exigir que sejam infalíveis.

---

## 14. O provider de IA continua sendo provider

Há ainda uma camada que pode passar despercebida: o próprio modelo de IA normalmente é realizado por algum provider.

O Planning B de Provider / Binding encontrou no SB atual um caso concreto positivo: o AI Gateway possui contrato versionado provider-neutral de request/response, adapter estreito substituível, capability/limit descriptors, normalização fail-closed, correlação request/response, regras explícitas de routing/fallback e testes de substituição entre dois adapters.

**EVIDENCIADO NO SB ATUAL:** existe uma seam real em que a identidade/implementação do provider de modelo não precisa contaminar o envelope canônico de request/response.

Mas Planning B é igualmente cuidadoso: isso prova substituição **na seam testada**, não um Provider/Binding lifecycle universal.

O SB atual não evidencia nessa superfície, de forma generalizada:

- qualification multidimensional completa;
- admission/binding lifecycle universal;
- currentness de support evidence;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` para mutações arbitrárias;
- residual cohort drainage;
- Station-scoped provider administration completa.

Portanto, nem mesmo a infraestrutura de IA deve ganhar uma exceção conceitual. O modelo é uma realização substituível sob contratos e políticas; sua marca ou provider não se torna semantic owner.

---

## 15. Fallback de modelo não pode significar fallback de semântica

Suponha que o modelo principal fique indisponível e exista outro provider configurado.

É tentador dizer: “chame o segundo e continue”.

Isso só é seguro se o fallback continuar qualificado para aquilo que a operação realmente exige.

Um modelo alternativo pode ter diferenças de:

- tamanho de contexto;
- suporte a tools;
- structured output;
- limites;
- comportamento de segurança;
- latência;
- residency;
- custos;
- características relevantes à tarefa.

O SB atual já evidencia regras explícitas de fallback no AI Gateway, mas Planning B deixa claro que isso ainda não equivale a uma qualification semântica multidimensional universal.

Assim:

```text
fallback configured != fallback qualified for every task
```

A lição é a mesma do Capítulo 12: provider portability precisa preservar requisitos, não apenas trocar endpoints.

---

## 16. A IA pode recomendar uma ação perigosa sem poder executá-la

**EXEMPLO DIDÁTICO.** Imagine um incidente operacional. A IA analisa logs e sugere:

> “Faça rollback para a release anterior.”

A sugestão pode ser correta como hipótese operacional. Ainda assim, o Capítulo 13 mostrou que:

```text
historical availability != rollback eligibility
```

Talvez o schema já tenha migrado. Talvez uma credential antiga tenha sido revogada. Talvez a release anterior não esteja qualificada para o environment atual.

Portanto, o caminho correto é algo como:

```text
IA propõe rollback
      ↓
owners verificam eligibility/currentness
      ↓
authorization verifica quem pode atuar
      ↓
deployment/recovery realizam a transição
      ↓
observability produz evidence
      ↓
estado efetivo é requalificado
```

A IA continua extremamente útil: reduz o espaço de investigação e explica opções. O que ela não faz é converter uma recomendação em fato operacional consumado por mera força linguística.

---

## 17. IA e UNKNOWN: não preencher lacunas com uma história plausível

O Capítulo 18 mostrou que `UNKNOWN` é um estado legítimo de conhecimento sobre um efeito.

Uma IA pode ser tentada — ou induzida pelo design do produto — a “resolver” ambiguidade inferindo o resultado mais provável.

Isso seria perigoso.

Se um provider recebeu um pedido de pagamento e a conexão caiu antes da resposta, existem várias narrativas plausíveis. O pagamento pode ter ocorrido ou não. Nenhuma delas deve substituir reconciliação.

```text
plausible explanation != effect evidence
```

A IA pode sugerir como reconciliar: consultar o provider, correlacionar IDs, comparar ledger, verificar callbacks. Mas, enquanto a evidência continuar insuficiente, a disposição deve permanecer `UNKNOWN` segundo o owner aplicável.

Esse princípio impede que capacidade narrativa seja convertida em fabricação de certeza.

---

## 18. Prompt não deve ser a única parede de segurança

Prompts e system instructions são importantes para orientar comportamento. Mas constraints empresariais críticas não deveriam depender exclusivamente de o modelo “lembrar” uma frase em contexto.

**HIPÓTESE DE ARQUITETURA:** uma implementação futura pode combinar prompts com enforcement externo, typed tools, capability contracts, authorization checks, admission gates e evidence validation. Este capítulo não escolhe a arquitetura concreta.

O boundary conceitual, porém, é claro:

```text
instruction to behave safely
    != enforcement of authority
```

Quando uma restrição precisa sobreviver a provider substitution, prompt variation, retries, model upgrades ou tool chains, ela deve existir onde o semantic owner e a política competente conseguem aplicá-la de forma verificável.

---

## 19. O risco oposto: prender tanto a IA que ela deixa de ajudar

Governança não significa reduzir IA a autocomplete sem contexto.

Se toda análise exigir intervenção manual, se a IA não puder acessar evidência relevante ou se qualquer materialização for proibida, perde-se grande parte do ganho que justificou incorporá-la.

O objetivo não é retirar capacidade. É separar **capacidade cognitiva** de **autoridade canônica**.

Uma IA pode, por exemplo:

- explorar dezenas de alternativas;
- gerar drafts completos;
- executar validações não destrutivas;
- produzir simulations;
- preparar artifacts candidatos;
- comparar providers;
- montar planos de migração;
- diagnosticar incidents;
- apontar conflicts;
- explicar o porquê de uma recomendação.

E, quando recebeu uma delegação explícita e o sistema consegue fazer enforcement, pode até executar operações autorizadas automaticamente.

O princípio não é “IA nunca atua”. É:

```text
AI actuation requires explicit bounded authority
```

Autonomia e autoridade não são sinônimos. Um agente pode trabalhar autonomamente dentro de um envelope rigorosamente limitado.

---

## 20. IA como tradutora entre intenção humana e contratos técnicos

Talvez o papel mais interessante para o System Builder esteja entre dois mundos.

De um lado existe a linguagem humana:

> “Quando faltar uma peça, quero que compras seja avisado, mas serviços urgentes não podem ficar parados sem alguém responsável.”

Do outro existem conceitos formais:

- states;
- transitions;
- guards;
- roles;
- escalation;
- timers;
- inventory reservation;
- event delivery;
- authorization;
- evidence;
- failure semantics.

A IA pode funcionar como **tradutora processual**: decompor uma intenção em perguntas, revelar ambiguidades e preparar representações que os semantic owners consigam validar.

Isso é diferente de inventar silenciosamente a resposta.

Um bom assistente diria, em essência:

```text
“Esta parte da intenção está clara.
Esta outra depende de uma regra ainda ausente.
Estas duas constraints entram em conflito.
Este provider não tem evidência suficiente.
Posso propor três alternativas.”
```

Esse comportamento aumenta a capacidade do idealizador sem esconder a incerteza.

---

## 21. IA e pesquisa: sugerir novos problemas sem promovê-los a finding

A própria pesquisa da Generation 2 é um bom exemplo de uso disciplinado.

Uma IA pode levantar centenas de cenários adversariais. Isso é valioso. Mas a campanha separa:

```text
scenario candidate
    ↓
duplicate screening
    ↓
evidence / analysis
    ↓
material finding ou no-new-material
```

Nos Capítulos 17–20 vimos que `Signal != ConfirmedConflict` e que volume de testes não prova saturação. A mesma disciplina se aplica a insights gerados por IA.

Um modelo pode produzir uma pergunta excelente e ainda assim ela ser duplicata de uma família já conhecida. Pode apontar um risco que não existe no SB atual. Pode encontrar uma lacuna real. O processo autoritativo decide qual dessas situações ocorreu.

O livro, por sua vez, apenas explica esse mecanismo; não promove a sugestão da IA a finding nem altera streaks ou gates.

---

## 22. Relação com o restante do System Builder

A IA toca quase todo o mapa do livro sem substituir nenhum owner:

- **Process/Application Modeling:** ajuda a elicitar e propor modelos, sem possuir a verdade do processo.
- **UI/Low-code:** gera experiências e composições, sem conceder permissões nem redefinir dados.
- **Workflow/Integration:** sugere automações e pode acionar tools quando autorizada, sem reescrever effect semantics.
- **Authorization:** consome decisões e delegações; não cria autoridade porque precisa dela.
- **Provider/Binding:** o próprio modelo é uma realização e pode ser substituído sob contratos qualificados.
- **Data/Privacy:** usa dados apenas dentro de finalidade, scope e política aplicáveis; acesso técnico não elimina obrigações.
- **Lifecycle:** propostas e artifacts têm revisions e coexistência; “última resposta” não é automaticamente a revisão correta.
- **Observability:** IA pode diagnosticar evidence sem transformar telemetry em domain truth.
- **Security/Recovery:** pode sugerir containment ou recovery, mas não substitui trust/currentness/eligibility.
- **Commercial/FinOps:** pode explicar custos e cenários, sem transformar cálculo estimado em charge ou invoice.

Essa transversalidade explica por que seria perigoso tratá-la como um god-object semântico.

---

## 23. Um modelo mental prático

Quando uma IA estiver envolvida em qualquer futura feature do System Builder, vale fazer seis perguntas:

```text
1. O que ela sabe?
2. De qual evidence/revision isso veio?
3. O que ela está propondo ou tentando fazer?
4. Qual semantic owner decide se isso é válido?
5. Qual principal/delegação autoriza eventual atuação?
6. Que evidence provará o efeito real depois?
```

Se essas perguntas tiverem respostas explícitas, a IA pode ser muito poderosa sem destruir rastreabilidade.

Se não tiverem, o sistema corre o risco de substituir engenharia de autoridade por confiança informal em uma resposta plausível.

---

## 24. O que já existe no SB atual e o que ainda é direção G2

**EVIDENCIADO NO SB ATUAL:** segundo Planning B de Provider/Binding, o AI Gateway possui request/response contract versionado e provider-neutral, normalização fail-closed, `ModelProviderAdapter` estreito, capability/limit descriptors, request/response correlation, explicit routing/fallback governance e prova de replaceability entre dois adapters na seam testada.

Isso é uma base concreta importante: mostra que IA já pode ser tratada como realização substituível atrás de um contrato, em vez de contaminar o domínio com identidade de provider.

**NÃO EVIDENCIADO COMO MECANISMO GERAL:** um framework universal em que toda proposta de IA possua lineage/admission próprios; tool authority universalmente scoped; non-amplification provada em toda capability; AI-generated artifacts submetidos a um pipeline único de admission; qualification multidimensional completa de modelos; ou uma arquitetura agente universal capaz de atuar em todos os semantic owners.

Esses itens não devem ser inventados pelo livro. São possíveis temas de arquitetura futura sujeitos aos gates competentes.

---

## 25. O que você deve guardar deste capítulo

A IA é especialmente valiosa para o System Builder porque pode reduzir drasticamente a distância entre intenção humana e representação técnica. Ela pode pesquisar, analisar, traduzir, sugerir, compor, gerar, diagnosticar e — quando explicitamente delegada — até atuar.

Mas quatro separações precisam permanecer visíveis:

```text
model output != canonical truth
proposal != decision
materialization != admission
tool capability != delegated authority
```

Um modelo pode ser inteligente sem ser semantic owner. Pode ser autônomo sem possuir autoridade ilimitada. Pode utilizar providers e tools sem transformar disponibilidade técnica em permissão. Pode gerar artifacts sem publicá-los como verdade. Pode recomendar uma ação sem declarar o efeito como ocorrido.

Esse desenho não diminui a IA. Ele permite usá-la com muito mais amplitude, porque o sistema deixa de depender da hipótese de que o modelo precisa estar sempre certo.

A meta da Generation 2, nessa leitura, não é construir uma IA que mande na empresa. É construir uma arquitetura em que a IA consiga **entender, explicar e operar capacidades complexas sem apagar quem possui o significado, quem possui a autoridade e qual evidência prova o que realmente aconteceu**.

---

## Referências autoritativas consultadas

Este capítulo sintetiza principalmente:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/planning/PLANNING_A_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_UI_GENERATED_EXPERIENCE_LOW_CODE_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`;
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`.

Essas fontes permanecem superiores ao texto editorial. Onde o capítulo extrapola para exemplos de implementação futura, a afirmação é tratada como hipótese ou exemplo didático, não como decisão arquitetural.