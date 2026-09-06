# Apêndice A — Provas, federação e limites das alegações

**Status editorial:** complemento didático em pesquisa  
**Camada de autoridade:** síntese de compreensão; não substitui pesquisa, Planning, gates, findings ou arquitetura alvo.  
**Fonte principal:** `project_docs/generation-2/research/SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`.

## Por que este apêndice existe

À medida que o System Builder pesquisa workflows mais ricos, sistemas autônomos e continuidade entre empresas ou builds, aparece uma tentação perigosa: chamar qualquer evidência tecnicamente forte de “prova” e, a partir daí, concluir mais do que ela realmente demonstra.

Um hash pode provar integridade de um compromisso. Um trace pode mostrar por onde a execução passou. Uma análise formal pode demonstrar uma propriedade de um modelo. Um provider pode confirmar que aceitou uma mensagem. Nenhuma dessas afirmações, isoladamente, prova automaticamente que o efeito empresarial pretendido aconteceu, que era autorizado ou que continua válido no presente.

A pesquisa recente tornou essa separação material o suficiente para merecer uma explicação própria.

## 1. Cinco perguntas diferentes escondidas dentro da palavra “prova”

**EM PESQUISA:** a Generation 2 passou a distinguir explicitamente pelo menos cinco domínios de alegação:

1. **soundness da definição** — o workflow, dentro do modelo formal escolhido, consegue chegar a uma conclusão adequada sem deixar trabalho obrigatório preso;
2. **garantia de terminação** — loops ou recursões terminam sob as precondições e limites declarados;
3. **conformidade da execução** — o trace observado corresponde ao workflow, revisão e contratos esperados;
4. **integridade do journal/evidence** — o registro não foi alterado sem detecção em relação ao compromisso criptográfico adotado;
5. **evidência de efeito externo** — o efeito empresarial exigido realmente ocorreu com confiança e currentness suficientes.

Essas perguntas podem ter respostas diferentes na mesma execução.

```text
journal íntegro
    != execução semanticamente correta

workflow sound
    != efeito externo aplicado

trace conforme
    != ação autorizada

provider ACK
    != efeito empresarial no consumidor
```

### Exemplo: pagamento

Um workflow de pagamento pode terminar em um estado `COMPLETED`. Seu journal pode estar íntegro e o trace pode corresponder perfeitamente à revisão esperada. Ainda assim, se a resposta do banco foi perdida depois do envio, o efeito financeiro pode permanecer `UNKNOWN`.

Nesse caso, afirmar “o workflow terminou” e afirmar “o dinheiro foi transferido” são alegações diferentes.

A primeira pode estar demonstrada. A segunda ainda exige reconciliação.

## 2. O novo risco: proof-claim conflation

A pesquisa catalogou `G2-CONFLICT-PATTERN-PROOF-CLAIM-CONFLATION-001`.

Em português, o problema pode ser entendido como **conflar domínios de prova**: usar uma evidência válida para sustentar uma afirmação mais forte ou simplesmente diferente daquela que a evidência demonstra.

Exemplo:

```text
hash válido
  ↓
“o registro não mudou”
  ↓ salto inválido
“logo, o conteúdo está semanticamente correto”
```

Outro:

```text
workflow formalmente sound
  ↓ salto inválido
“logo, toda execução futura produzirá o efeito empresarial correto”
```

A primeira afirmação fala de integridade. A segunda fala de semântica e efeitos. São domínios diferentes.

**Importante:** isso é um `ConflictPattern`, não uma afirmação de que existe hoje um defeito concreto no produto.

## 3. Sistemas autônomos podem cooperar sem virar um único sistema distribuído

A hipótese de federação pesquisada não exige que dois sistemas compartilhem estado mutável ou transação global.

Imagine duas empresas:

```text
Empresa A                         Empresa B
Sistema A                         Sistema B
   |                                 |
OS aprovada                         recebe serviço
   |                                 |
   +---- contrato versionado ------>+
```

A continuidade pode existir por um contrato de fronteira contendo identidades qualificadas, revisão, correlação, autoridade, schema, SLA/currentness, idempotência, responsabilidade por `UNKNOWN` e regras de privacidade.

Isso não transforma os dois runtimes em uma única máquina de estado.

```text
federated continuity
    != shared mutable state
    != shared transaction
    != shared semantic ownership
```

Cada build autônomo continua dono de sua execução local e cada semantic owner continua dono de seus fatos empresariais.

## 4. Federated continuity: quando a passagem de bastão fica ambígua

`G2-CONFLICT-PATTERN-FEDERATED-CONTINUITY-001` descreve uma fronteira em que produtor e consumidor estão individualmente corretos, mas correlação, revisão, autoridade, disposição do efeito ou responsabilidade pela reconciliação estão incompletas.

Exemplo:

```text
Sistema A: “enviei e o provider aceitou”
Sistema B: “não observei aplicação”

A: considera concluído
B: considera inexistente
```

O problema não precisa ser perda de mensagem. Pode ser ausência de semântica explícita sobre **quando a responsabilidade muda de lado**.

Por isso:

```text
producer intent
    != provider acceptance
    != consumer-effective effect
```

Essa separação conecta diretamente federação aos conceitos de `UNKNOWN`, retries, idempotência, evidence e semantic ownership discutidos nos Capítulos 18 e 19.

## 5. Provas de filhos não se somam automaticamente em uma prova do pai

Considere um workflow principal que chama um subworkflow:

```text
PROCESSAR_OS
   |
   +--> RESERVAR_PECA
   |
   +--> EXECUTAR_SERVICO
   |
   +--> ENCERRAR
```

Suponha que `RESERVAR_PECA` devolva um certificado dizendo `COMPLETED`.

O pai não pode simplesmente concluir:

```text
child COMPLETED
    => obrigação do pai satisfeita
```

Ele precisa saber, entre outras coisas:

- qual revisão do subworkflow foi executada;
- qual contrato de entrada/saída estava vigente;
- se o resultado corresponde àquilo que o pai exigia;
- se efeitos externos necessários estão comprovados;
- se existe algum `UNKNOWN` ainda aberto;
- qual perfil de evidência o certificado realmente sustenta.

Esse é o núcleo de `G2-CONFLICT-PATTERN-CERTIFICATE-COMPOSITION-001`.

A regra didática é:

```text
valid child proof
    + missing qualification
    != valid parent proof
```

## 6. Nem todo resultado calculado é o mesmo tipo de conhecimento

A pesquisa também separou resultados analíticos em classes diferentes:

```text
DETERMINISTIC_DERIVATION
STATISTICAL_ESTIMATE
OPTIMIZATION_RESULT
AI_INFERENCE
HUMAN_DECISION
```

Isso parece detalhe técnico, mas tem impacto empresarial direto.

### Exemplo de estoque

Uma fórmula determinística pode calcular:

```text
saldo = entradas - saídas
```

Um modelo estatístico pode estimar:

```text
probabilidade de faltar peça nos próximos 7 dias = 18%
```

Um otimizador pode recomendar:

```text
comprar 12 unidades minimiza custo sob as restrições X, Y e Z
```

Uma IA pode sugerir:

```text
“considere antecipar a compra por causa do padrão observado”
```

E um gerente pode decidir:

```text
“compraremos 20 porque haverá uma operação extraordinária ainda não modelada”
```

Todos são resultados úteis. Eles não possuem a mesma semântica epistemológica.

`G2-CONFLICT-PATTERN-ANALYTICAL-KIND-CONFLATION-001` aparece quando um tipo é consumido como outro sem conversão ou qualificação explícita.

```text
estimate != fact
optimization result != policy
AI inference != deterministic derivation
human decision != mathematical proof
```

## 7. Typed Semantic Graph é hipótese, não arquitetura decidida

**HIPÓTESE DE ARQUITETURA / EM PESQUISA:** relações entre capability, workflow, dados, autoridade, policy, fórmula, provider, revisão e sistemas federados podem ser estudadas como um grafo semântico tipado.

Isso pode ajudar a enxergar dependências e executar análises sobre composição.

Mas duas cautelas são obrigatórias.

Primeiro, **grafo conceitual não implica GraphDB**. A própria pesquisa mantém PostgreSQL relacional como baseline plausível e GraphDB apenas como provider/projeção opcional caso evidência futura justifique.

Segundo, representar uma relação em um grafo não cria autoridade nem verdade.

```text
edge exists
    != relation authorized
    != evidence current
    != business effect proven
```

O grafo pode tornar uma dependência visível. A validade da dependência continua pertencendo aos semantic owners, policies, revisões e evidências apropriados.

## 8. Provenance: observar os mesmos limites não prova todas as derivações

**EM PESQUISA:** o Full Pass 6 acrescentou um refinamento importante ao tema de provas e grafos. Quando uma execução possui vários inputs e vários outputs, observar que todos apareceram na mesma fronteira não autoriza concluir que cada input produziu cada output.

Imagine um processo de estoque que recebe três informações:

```text
entrada A = quantidade recebida
entrada B = nome do fornecedor
entrada C = observação do operador
```

E produz dois resultados:

```text
saída X = novo saldo
saída Y = registro de auditoria
```

Uma representação ingênua poderia fazer isto:

```text
A ─┬─> X
B ─┼─> X
C ─┘
A ─┬─> Y
B ─┼─> Y
C ─┘
```

Só porque A, B e C eram inputs e X e Y eram outputs do mesmo processamento. Essa expansão é um **produto cartesiano de lineage**: todas as entradas são tratadas como origem exata de todas as saídas.

O grafo pode continuar perfeitamente válido do ponto de vista estrutural. Os identificadores existem, os tipos podem estar corretos e não há necessariamente uma aresta quebrada. O erro está na **alegação semântica contida na aresta**: uma derivação foi inventada sem evidência suficiente.

A pesquisa catalogou esse risco como `G2-CONFLICT-PATTERN-PROVENANCE-EDGE-OVERATTRIBUTION-001`.

A separação didática é:

```text
observado na mesma execução
    != derivação exata

coarse dependency
    != exact lineage

inferred edge
    != asserted edge
    != observed edge
```

Isso importa porque lineage não serve apenas para desenhar diagramas. Uma aresta falsa pode contaminar análise de impacto, privacidade, retenção e exclusão de dados, billing, auditoria e até alegações causais. Um sistema pode então tomar uma decisão correta sobre um grafo que contém uma relação que nunca foi realmente demonstrada.

### Exemplo empresarial: exclusão de dados

Suponha que um relatório receba `CPF`, `valor da OS` e `código da filial`, mas apenas o código da filial e o valor sejam usados para produzir uma estatística agregada. Se uma projeção inventar lineage exato de `CPF -> estatística`, uma futura análise de privacidade pode concluir que aquela estatística necessariamente deriva de dado pessoal identificável. O erro pode provocar retenção, exclusão ou bloqueio indevidos.

O inverso também é perigoso: omitir uma derivação real pode esconder uma dependência que deveria participar de uma análise de impacto.

Por isso, uma projeção ou IA deve preservar a **base epistemológica da relação**: ela foi declarada pelo produtor? observada diretamente? inferida? é apenas dependência grosseira da execução? está `UNKNOWN/INCONCLUSIVE`?

### Provenance não vira causalidade nem autoridade

Mesmo uma aresta de lineage exata não demonstra automaticamente que A foi a causa empresarial de B, nem que o ator que produziu B tinha autoridade para fazê-lo.

```text
provenance != authority
provenance != causal proof
exact lineage != semantic correctness
```

Esse refinamento conecta o apêndice diretamente aos Capítulos 14, 19, 20, 21 e 22: evidence precisa carregar o tipo da alegação; detectores não devem fortalecer evidência fraca; IA/low-code não devem fabricar lineage; e uma visão em Canvas ou Fleet continua sendo projeção, não nova fonte de verdade.

**ABERTO/INCONCLUSIVO:** a pesquisa não decidiu aqui uma estrutura universal de armazenamento de lineage, um GraphDB, um verifier único ou uma arquitetura alvo. O finding apenas demonstra que qualquer solução futura precisa evitar transformar coocorrência em derivação exata.

## 9. O que estas descobertas mudam — e o que não mudam

Elas **ampliam** a compreensão dos Capítulos 14, 19, 20, 21 e 22 ao mostrar que não basta preservar “uma evidência”: é necessário preservar também **qual relação a evidência sustenta e com que força epistemológica**. Elas também aprofundam a distinção entre um grafo estruturalmente válido e um grafo semanticamente justificável.

Elas **não** autorizam concluir que:

- a arquitetura alvo usará Typed Semantic Graph;
- haverá GraphDB;
- existirá um `WorkflowCompletionCertificate` com esse nome ou formato;
- Planning C já decidiu um verifier universal;
- todo workflow será formalmente provado;
- sistemas federados compartilharão runtime ou estado;
- toda fronteira precisará de lineage em nível de campo;
- toda dependência grosseira é incorreta;
- um `ConflictPattern` representa um bug observado.

Os nomes de estruturas de prova continuam provisórios enquanto a pesquisa está ativa.

## O que você deve guardar deste apêndice

A palavra “prova” só é segura quando dizemos **o que exatamente foi provado, sob quais hipóteses, em qual revisão e com qual evidência**.

A continuidade entre sistemas autônomos exige contratos e responsabilidade explícitos, não uma falsa transação global. Uma prova de um subworkflow não pode ser promovida automaticamente para uma prova mais forte do workflow pai. Resultados determinísticos, estatísticos, de otimização, de IA e humanos precisam manter seus tipos semânticos distintos. E observar inputs e outputs na mesma execução não autoriza fabricar todas as relações possíveis de derivação entre eles.

Em forma compacta:

```text
proof of X != proof of Y
federation != shared state
child proof != parent proof
analysis result kind != another result kind
co-occurrence != exact lineage
provenance != authority != causal proof
hypothesis != architecture decision
```

Essas distinções não resolvem antecipadamente os conflitos. Elas tornam os conflitos mais reconhecíveis, classificáveis e futuramente verificáveis — exatamente o papel da pesquisa G2 neste estágio.
