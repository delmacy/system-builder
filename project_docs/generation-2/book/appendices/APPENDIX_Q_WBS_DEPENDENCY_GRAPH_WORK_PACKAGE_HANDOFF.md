# Apêndice Q — Do grafo de dependências ao handoff: como transformar arquitetura em trabalho sem falsificar a ordem — v1.0.0

**Identidade editorial:** `APPENDIX_Q`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Data:** 2026-09-07  
**Natureza:** camada pedagógica; não substitui WBS, Work Package Design, handoff ou `RESEARCH_PIPELINE_STATE.json`.

## O problema humano: um plano grande parece pedir uma fila única

Quando um projeto cresce, surge uma tentação muito natural: colocar tudo numa lista e executar de cima para baixo. Primeiro identidade, depois dados, depois workflow, depois integrações, depois interface. Essa lista transmite segurança porque parece responder à pergunta “o que vem depois?”.

O problema é que sistemas empresariais não são uma fila. Eles são uma rede de contratos que amadurecem em ritmos diferentes. Uma equipe pode desenhar uma projeção de UI enquanto o contrato de autorização estabiliza; um provider pode ser qualificado enquanto a assimilação Brownfield continua; a arquitetura de prova pode ser desenhada antes de todas as implementações existirem. O que não pode acontecer é declarar uma parte **fechada** ignorando um pré-requisito que dá significado, autoridade, evidência, confiança ou operabilidade ao que ela afirma.

É esse problema que o WBS Dependency Graph da Generation 2 resolve.

> **DECIDIDO:** o grafo é um DAG de planejamento tipado. Uma aresta restringe fechamento para uma preocupação específica; ela não significa que todo trabalho do nó anterior precise terminar antes de qualquer trabalho no nó seguinte começar.

Essa distinção parece pequena, mas muda a maneira de organizar toda a construção.

## 1. Dependência não é sequência total

Considere uma empresa que quer implantar um workflow de Ordem de Serviço. A tela pode ser prototipada cedo. As perguntas de elicitação sobre quem abre, aprova e encerra uma OS também podem ocorrer cedo. Mas não é legítimo declarar o workflow pronto para fechamento se ainda não sabemos, por exemplo, qual identidade possui autoridade para aprovar, como os estados são persistidos, ou como um efeito externo ambíguo será reconciliado.

Uma lista simples tenderia a dizer:

```text
Identidade -> Dados -> Workflow -> UI
```

O grafo G2 diz algo mais preciso:

```text
                 [autoridade]
Identity ----------------------> Workflow

                 [dados]
Data --------------------------> Workflow

                 [semântica]
Semantic substrate ------------> Workflow

Workflow ----------------------> UI
             [semântica da ação]
```

A UI pode começar a ser pensada antes de o workflow estar implementado. O que ela não pode fazer é inventar estados, autoridade ou efeitos que o owner correspondente ainda não definiu.

**Onde a analogia deixa de valer:** o desenho acima simplifica dezenas de arestas reais. O artefato autoritativo preserva nove tipos de pré-requisito e 26 nós WBS; o diagrama serve apenas para mostrar a diferença entre ordem parcial e fila total.

## 2. Os nove tipos de pré-requisito

A Generation 2 preserva nove espécies de aresta: `SEMANTIC_PREREQUISITE`, `AUTHORITY_PREREQUISITE`, `REVISION_PREREQUISITE`, `EVIDENCE_PREREQUISITE`, `PROVIDER_PREREQUISITE`, `DATA_PREREQUISITE`, `OPERABILITY_PREREQUISITE`, `TRUST_PREREQUISITE` e `LOCALITY_PREREQUISITE`.

Em português simples, elas respondem a perguntas diferentes.

- **Semântica:** já sabemos o que a coisa significa?
- **Autoridade:** já sabemos quem pode decidir ou agir?
- **Revisão:** sabemos sob qual versão/currentness a afirmação vale?
- **Evidência:** existe base suficiente para sustentar a afirmação?
- **Provider:** a realização externa necessária foi qualificada?
- **Dados:** o estado necessário existe com identidade e regras adequadas?
- **Operabilidade:** sabemos como a parte funciona, degrada, acumula trabalho e se recupera?
- **Trust:** a relação criptográfica/de confiança necessária foi qualificada?
- **Localidade:** sabemos em qual escopo — local, Station, Fleet etc. — a verdade é válida?

Isso impede um erro comum: usar uma única palavra, “depende”, para relações tecnicamente diferentes.

### Exemplo: login e autorização

O contrato de autorização pertence ao plano de identidade/autoridade. Já certificados, secrets e outros mecanismos de confiança podem ser necessários para realizar autenticação ou federação. Há uma relação nos dois sentidos, mas ela não deve virar um ciclo de ownership.

O grafo registra que o contrato de autoridade estabiliza antes do fechamento de trust/config material relevante, enquanto a realização de autenticação não pode alegar readiness sem trust qualificado.

> **DECIDIDO:** uma aresta não transfere semantic ownership. `authentication != authorization`, mesmo quando uma depende tecnicamente da outra.

## 3. Camadas são níveis de fechamento, não departamentos

O WBS Dependency Graph organiza os 26 nós em camadas L0 a L10. Isso ajuda a enxergar o fluxo geral sem impor serialização falsa.

A base constitucional L0 contém o substrato semântico. Em seguida aparecem elicitação, identidade/trust e primitivas analíticas; depois dados/providers/Brownfield; execução/storage/capacidade; integração/build; artefatos; deployment/experiência/IA; operações/governança; economia; prova/readiness; e finalmente reconciliação transversal.

Essa disposição não significa “dez fases de implementação”. Ela significa que uma alegação de fechamento numa camada posterior carrega obrigações produzidas anteriormente.

Um exemplo concreto é capacidade. Queueing/capacity/backpressure é tratado como plano transversal. Um produtor de fila pode ser desenhado em paralelo, mas não pode declarar operabilidade fechada sem demonstrar unidades, população, janela temporal, oldest age, amplificação por retry/replay/fan-out, quotas e **drainability finita** sob premissas declaradas.

Assim, `queue depth = 20` isoladamente não prova que o sistema está saudável. Vinte itens podem ser irrelevantes numa fila que drena mil por segundo, ou catastróficos se o item mais antigo está preso há três dias.

## 4. O caso especial dos planos transversais

Alguns nós aparecem em muitos lugares: matemática/analítica, capacidade, Product Proof e Production Readiness. Isso poderia sugerir que eles são “chefes” dos demais. Não são.

> **DECIDIDO:** cross-cutting não significa semantic owner universal.

O plano matemático fornece semântica portátil para unidades, precisão, rounding, tempo, vetores e incerteza. Ele não passa a ser dono da política comercial que usa uma fórmula. Product Proof consome evidência de vários owners, mas não passa a decidir o significado das claims que prova. Production Readiness avalia dimensões operacionais, mas não substitui feature correctness.

Esse princípio evita o nascimento de um “god-object arquitetural”: um componente central que, por enxergar tudo, começa silenciosamente a mandar em tudo.

## 5. De 26 nós WBS para 13 Work Packages

Depois de fechar o dependency graph, a Generation 2 agrupou os 26 nós em **13 Work Packages de design**. O agrupamento é operacional: aproxima trabalhos que compartilham contexto, pré-requisitos e obrigações de fechamento. Ele não funde capabilities nem semantic owners.

Por exemplo, `G2-WP-04 — Identity, Authorization, Trust, Secrets & Recovery` agrupa WBS-03 e WBS-04 porque os dois precisam ser construídos de maneira mutuamente qualificada. Ainda assim, autoridade continua pertencendo ao contrato de identidade/autorização, enquanto trust/PKI/secrets/config/recovery mantém seu próprio domínio.

Outro exemplo é `G2-WP-09 — Reproducible Build, Artifact Supply & Autonomous Deployment`. Build, artifact/release e deployment formam uma cadeia útil de trabalho, mas continuam semanticamente distintos:

```text
build terminou
    != build reproduzível
    != output adotado como artifact canônico
    != release admitida
    != deployment aceito pelo provider
    != runtime observado
    != runtime efetivo/convergido
```

O pacote torna essa cadeia administrável sem apagar suas fronteiras.

## 6. Por que 13 pacotes não significam 13 sprints sequenciais

O Work Package Design preserva explicitamente uma **ordem parcial**. Depois que os contratos constitucionais do WP-01 estabilizam, partes de elicitação, matemática e autoridade podem avançar concorrentemente. Provider qualification pode avançar ao lado de Brownfield discovery. Interfaces de build podem amadurecer enquanto outras realizações ainda estão sendo qualificadas.

O critério é sempre o mesmo: concorrência é legítima quando não falsifica os pré-requisitos necessários ao fechamento.

Isso é diferente de “fazer tudo ao mesmo tempo”. Paralelismo sem contrato estável cria retrabalho; serialização excessiva desperdiça independências reais. O grafo procura o meio-termo: **paralelismo governado por dependências tipadas**.

## 7. Handoff não é autorização

O pipeline chegou ao estado `READY_FOR_WORKER_HANDOFF`. Essa frase pode parecer, à primeira vista, “agora pode construir”. Não é isso que significa.

O handoff é um pacote de memória suficiente para que um futuro worker saiba de onde retomar: 28 capabilities, pesquisa adversarial saturada, Planning C/D/E fechados, reconciliação arquitetural, 26 nós WBS, dependency DAG e 13 Work Packages desenhados.

Mas o documento de handoff é explícito:

```text
DESIGNED != EXECUTED
HANDOFF_READY != AUTHORIZED
planning closure != implementation closure
```

> **DECIDIDO:** `G2-WP-01..G2-WP-13 = DESIGNED / NOT EXECUTED / NOT AUTHORIZED FOR EXECUTION` no handoff consultado.

Isso é governança, não burocracia decorativa. Sem essa fronteira, um artefato de planejamento poderia acidentalmente se transformar em autorização de modificar produto.

## 8. O que um worker futuro precisa carregar consigo

Um worker que receba autorização separada não recebe apenas uma lista de tarefas. Ele herda invariantes.

Se implementar retry, precisa preservar `UNKNOWN -> reconcile-before-retry` quando repetir pode duplicar efeito. Se integrar um provider, não pode transformar paridade de API em equivalência semântica. Se criar uma tela, não pode transformar visibilidade em autoridade. Se trabalhar com Brownfield, não pode promover comportamento observado a processo canônico. Se construir métricas, não pode transformar ausência de sinal em prova de saúde. Se mexer com IA, proposta continua candidata até disposição governada.

É por isso que a passagem de planejamento para execução é mais parecida com transmitir uma **constituição de trabalho** do que entregar um backlog comum.

## 9. Exemplo completo: trocar o provider de envio de e-mail

**EXEMPLO DIDÁTICO.** Imagine que o sistema usa Provider A para e-mail e deseja migrar para Provider B.

Uma leitura superficial produziria a TASK “trocar API A pela API B”. A leitura pelo grafo pergunta antes:

1. O significado de “enviado” é o mesmo nos dois providers?
2. Quem está autorizado a mudar o binding?
3. Quais secrets/trust precisam ser rotacionados?
4. Há mensagens, callbacks ou retries residuais no Provider A?
5. ACK do Provider B significa aceitação técnica ou efeito empresarial?
6. Qual é a identidade de efeito para impedir duplicidade durante coexistência?
7. Como observamos `PARTIAL` ou `UNKNOWN`?
8. Qual evidência permite declarar cutover?
9. Como drenar o cohort residual do Provider A?
10. Qual prova demonstra substituição sem perda semântica?

Perceba a diferença: o grafo não torna a troca “mais complicada”; ele revela complexidade que já existia e que uma TASK curta esconderia.

## 10. O que mudou na compreensão do projeto

Até a WBS Decomposition, sabíamos **quais blocos de trabalho** precisavam existir. O Dependency Graph acrescenta **como os contratos desses blocos condicionam uns aos outros**. O Work Package Design acrescenta **como agrupá-los em unidades manejáveis sem destruir ownership**. O handoff acrescenta **como transmitir essa memória para execução futura sem conceder autorização por acidente**.

Podemos resumir assim:

```text
Capability
  define o domínio de significado
       |
       v
WBS node
  define um bloco de planejamento
       |
       v
Typed dependency graph
  define pré-requisitos de fechamento
       |
       v
Work Package
  agrupa trabalho de forma governável
       |
       v
Worker handoff
  transmite memória e invariantes
       |
       v
[autorização separada]
       |
       v
materialização executiva / Construction
```

O último salto não ocorreu automaticamente.

## 11. Riscos e trade-offs

Um grafo muito pobre esconderia dependências e permitiria falso fechamento. Um grafo que duplicasse toda dependência transitiva ficaria ilegível. Por isso o artefato registra arestas diretas e evita repetir transitividade.

Tipos de aresta também custam disciplina: é mais fácil escrever “A depende de B” do que dizer **em que sentido**. Em troca, a arquitetura ganha explicabilidade e paralelismo mais seguro.

Work Packages maiores reduzem overhead de coordenação, mas podem esconder owners distintos. Pacotes menores preservam isolamento, porém aumentam interfaces e handoffs. A solução adotada agrupa por conveniência de planejamento e declara explicitamente que WBS/capability ownership continua intacto.

Por fim, um handoff rigoroso pode parecer conservador porque não autoriza execução. Essa separação, porém, impede que “planejado” seja interpretado como “aprovado para mudar produto”.

## O que você deve guardar deste apêndice

A Generation 2 não virou uma fila de 26 blocos nem uma fila de 13 pacotes. Ela virou uma **ordem parcial tipada**. Dependência significa que determinada preocupação precisa estar qualificada para o fechamento de outra; não significa necessariamente esperar toda implementação anterior.

As nove espécies de pré-requisito preservam diferenças entre significado, autoridade, revisão, evidência, provider, dados, operabilidade, trust e localidade. Work Packages agrupam trabalho sem fundir semantic owners. E `READY_FOR_WORKER_HANDOFF` transmite memória de construção, mas não concede autorização executiva.

A ideia central é simples: **o planejamento precisa dizer não apenas o que construir, mas quais verdades precisam existir antes que cada parte possa honestamente declarar-se fechada.**

## Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DECOMPOSITION.md`
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DEPENDENCY_GRAPH.md`
- `project_docs/generation-2/packages/GENERATION_2_WORK_PACKAGE_DESIGN.md`
- `project_docs/generation-2/packages/GENERATION_2_READY_FOR_WORKER_HANDOFF.md`

Este apêndice explica essas fontes; não as substitui.