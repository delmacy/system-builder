# Apêndice P — WBS Decomposition: quando a arquitetura vira trabalho sem ainda virar execução — v1.0.0

**ID editorial:** `APPENDIX_P`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não é autoridade de WBS, dependency graph, Work Package, TASK ou Construction.  
**Data:** 2026-09-07

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: uma arquitetura fechada ainda é grande demais para construir

Depois de meses de pesquisa, síntese, definição de boundaries, reconciliação do System Builder atual, pesquisa matemática, investigação adversarial, arquitetura alvo, estratégia de migração, arquitetura de prova e reconciliação arquitetural, surge uma sensação tentadora: **agora basta programar**.

Não basta.

Uma arquitetura pode estar coerente e ainda ser grande demais para ser entregue diretamente a um worker. Dizer que a Generation 2 precisa preservar semantic ownership, revisions, evidence, `PARTIAL/UNKNOWN`, provider substitution, residual cohorts e Production Readiness Coverage não informa, sozinho, quais unidades de trabalho precisam existir nem como elas se relacionam.

É nesse ponto que entra a **Work Breakdown Structure (WBS)**: uma decomposição estruturada do trabalho necessário para realizar um resultado. Nesta fase, porém, a WBS ainda é **planejamento**, não autorização de implementação.

**DECIDIDO:** a Architecture Reconciliation da Generation 2 fechou em `CLOSED / PASS` sem contradição transversal que exigisse reabrir Research ou Planning C/D/E. A etapa seguinte, WBS Decomposition, foi então executada e fechou com **26 nós de planejamento**. O pipeline autoritativo avançou para `WBS_DEPENDENCY_GRAPH`.

Essa passagem pode ser resumida assim:

```text
arquitetura reconciliada
        ↓
propriedades e boundaries que precisam sobreviver
        ↓
26 nós de decomposição WBS
        ↓
[próxima fase]
grafo de dependências entre os nós
        ↓
[futuro]
Work Package design
        ↓
[futuro]
TASKs / Construction
```

O detalhe mais importante está nos colchetes: **decompor trabalho não é autorizar trabalho executivo**.

## 2. O que significa “decompor” neste contexto

Em linguagem cotidiana, decompor é pegar algo grande e separá-lo em partes menores. Em engenharia de sistemas, isso só é útil se as partes continuarem carregando as propriedades que justificaram sua existência.

Se a arquitetura diz:

```text
provider identity != canonical identity
```

não basta criar um item chamado “providers”. A decomposição precisa preservar onde canonical identity vive, quais nós dependem dessa semântica e quais provas precisam demonstrar que uma troca de provider não reescreve a história do sistema.

Por isso os 26 nós WBS não são simplesmente 26 funcionalidades. Cada nó registra três dimensões importantes:

```text
Scope
  o que precisa ser materializado naquele domínio

Dependencies to carry
  quais decisões/pré-requisitos precisam acompanhar o trabalho

Proof obligations
  o que terá de ser demonstrado para que a realização seja aceitável
```

**EXEMPLO DIDÁTICO:** o nó de Workflow/Durable Execution não diz apenas “implementar workflow”. Ele carrega semânticas como `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, pinning de revisão para trabalho em voo, identidade de efeito, retry, compensation, reconciliation e resultados parciais. Entre suas obrigações está preservar que um workflow em execução não seja silenciosamente reinterpretado pela revisão mais recente.

A WBS, portanto, começa a responder **“que trabalho precisa existir?”**, mas ainda não responde **“qual worker fará, em qual commit, em qual Sprint?”**.

## 3. Capability não virou automaticamente nó WBS

A síntese da G2 possui 28 capabilities canônicas. A WBS decomposta possui 26 nós. Isso já demonstra uma separação conceitual importante:

```text
Capability != WBS node
```

Uma capability é uma responsabilidade semanticamente coerente. Um nó WBS é uma unidade de decomposição de trabalho planejado. As duas estruturas têm finalidades diferentes.

Alguns assuntos são deliberadamente transversais. A Elicitation Knowledge Base, por exemplo, continua sendo infraestrutura cross-cutting e **não uma 29ª capability**. Matemática, regras, vetores, unidades, temporalidade e incerteza também aparecem como substrato transversal sem alterar artificialmente a taxonomia canônica.

Isso evita uma armadilha frequente: confundir o organograma conceitual da arquitetura com o plano de construção.

Uma arquitetura pode dizer que dois semantic owners são distintos, mas sua materialização pode exigir um trabalho transversal de contratos. Inversamente, uma capability grande pode precisar de vários Work Packages futuros. Não há obrigação de cardinalidade `1 capability = 1 WBS node = 1 package`.

## 4. Os 26 nós como mapa de realização

A decomposição distribui a arquitetura em famílias de trabalho que atravessam o ciclo inteiro do produto. Entre elas aparecem substrato semântico e revisão; EKB e elicitação adaptativa; identidade/autenticação/autorização; trust/PKI/secrets/recovery; dados/schema/migração; workflow; messaging e integrações; storage/documentos; providers e interoperabilidade; Physical/Peripheral; queue/capacity; build; artifact/release; deployment/runtime; UI/low-code; IA mediada; observabilidade/incidentes; superfícies de developer/operator/self-hosting; governance/privacy; Commercial; FinOps; matemática/analytics; Brownfield assimilation; Product Proof; Production Readiness; e reconciliação/closure.

O ponto pedagógico não é decorar a lista. É perceber que a WBS tenta manter **a cadeia de verdade inteira**.

Considere uma OS que dispara uma integração externa:

```text
semântica da OS
   ↓
autoridade de quem pode agir
   ↓
workflow durável
   ↓
identidade do efeito
   ↓
binding/provider qualificado
   ↓
mensagem/callback
   ↓
evidência observada
   ↓
reconciliation
   ↓
prova de resultado
```

Se a decomposição criasse apenas “Workflow” e “Integrações”, várias responsabilidades desapareceriam entre as caixas. Os nós transversais existem para impedir justamente esse desaparecimento.

## 5. As invariantes viajam junto com o trabalho

A WBS herdou restrições constitucionais da arquitetura reconciliada. Isso é importante porque decomposição costuma criar perda de contexto.

Imagine uma frase arquitetural sofisticada sendo transformada sucessivamente:

```text
Research finding
    ↓
Architecture decision
    ↓
WBS node
    ↓
Work Package
    ↓
TASK
    ↓
linha de código
```

A cada descida existe risco de compressão semântica. Uma TASK futura poderia acabar dizendo apenas “retry em caso de timeout”, esquecendo que a arquitetura decidiu:

```text
timeout != NOT_APPLIED
UNKNOWN → reconcile-before-retry
```

A função das invariantes herdadas é impedir essa erosão. Entre as preservadas na WBS estão:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `answered != understood`;
- `PARTIAL/UNKNOWN` não pode ser convertido silenciosamente em sucesso;
- provider feature-name parity não prova equivalência semântica;
- Fleet aggregate não substitui verdade local/Station;
- Physical/Peripheral não cria autoridade genérica de atuação física;
- Product Proof design não equivale a prova executada;
- Production Readiness continua multidimensional;
- causality continua research-only.

Essas desigualdades são mais do que frases de documentação. Elas funcionam como **guardrails de decomposição**.

## 6. Scope, dependência e prova são três perguntas diferentes

Uma característica valiosa da decomposição atual é não reduzir cada item a uma descrição funcional.

### 6.1 Scope: o que pertence ao trabalho?

O scope delimita a matéria que precisa ser realizada. No nó de Build, por exemplo, entram build definition, dependências declaradas/resolvidas/fetched, identidade de material, toolchain/runner, input boundary, hermeticidade ou impureza controlada, cache lineage e claims de reprodutibilidade.

### 6.2 Dependency: o que precisa existir ou ser conhecido antes?

Dependência não é apenas “biblioteca A importa biblioteca B”. Ela pode ser semântica, de autoridade, revisão, evidência, provider, dados, operabilidade, trust ou localidade.

**EXEMPLO DIDÁTICO:** autorização pode depender de identidade e trust. Isso não significa que Authorization deva possuir Identity ou PKI. Significa que uma decisão de autorização só pode ser interpretada corretamente quando os pré-requisitos relevantes estão qualificados.

### 6.3 Proof obligation: o que precisará ser demonstrado?

Proof obligation evita que “implementado” se transforme em sinônimo de “aceito”.

No nó de Artifact/Release, por exemplo:

```text
build output != release != deployed/effective runtime
signature validity != release authorization
```

Portanto, uma pipeline verde que produziu um arquivo assinado não demonstra, sozinha, que existe uma release autorizada, nem que ela está efetivamente servindo tráfego.

## 7. Por que o dependency graph é uma fase separada

A decomposição responde **quais unidades de trabalho existem**. Ela não deveria decidir silenciosamente **em que ordem elas podem ser construídas**.

Esse é o problema do `WBS_DEPENDENCY_GRAPH`, fase atualmente autorizada no estado consultado.

Suponha quatro nós:

```text
A — semantic substrate
B — authorization
C — provider qualification
D — workflow external effects
```

Uma lista poderia mostrá-los como `A, B, C, D`, mas isso não prova uma ordem total. Talvez B e C possam avançar parcialmente em paralelo; talvez D precise de contratos estáveis de A, B e C; talvez apenas uma subparte de C seja prerequisite de D.

Um grafo permite expressar isso sem inventar serialização desnecessária:

```text
A ─────► B ──┐
│            ├──► D
└──────► C ──┘
```

Mas mesmo esse desenho simples ainda é insuficiente para a G2 se a aresta não disser **que tipo de dependência existe**.

Planning D já consolidou tipos como:

```text
SEMANTIC_PREREQUISITE
AUTHORITY_PREREQUISITE
REVISION_PREREQUISITE
EVIDENCE_PREREQUISITE
PROVIDER_PREREQUISITE
DATA_PREREQUISITE
OPERABILITY_PREREQUISITE
TRUST_PREREQUISITE
LOCALITY_PREREQUISITE
```

**EM PESQUISA/PLANEJAMENTO:** o livro não antecipa quais arestas concretas o próximo artefato autoritativo decidirá. Ele apenas explica por que a etapa existe.

## 8. Dependência não significa ownership

Este ponto merece cuidado porque grafos de dependência podem criar uma ilusão de hierarquia semântica.

Se Workflow depende de Authorization para verificar autoridade, isso não transforma Authorization em dono da semântica de Workflow. Se UI depende de Data para projetar uma OS, UI não se torna dona da OS. Se Observability depende de vários owners para interpretar sinais, Observability não ganha autoridade sobre os fatos observados.

Formalmente, a leitura correta é:

```text
A depende de uma afirmação/contrato de B
            !=
B possui a semântica inteira de A
```

Essa separação protege a arquitetura contra o surgimento de um **semantic god-object**: um componente central que, por estar conectado a todos, acaba tratado como dono de todas as verdades.

## 9. Ordem lógica não é calendário

Outra distinção importante:

```text
dependency order != delivery calendar
```

Um grafo pode afirmar que um contrato precisa preceder uma integração. Isso não significa necessariamente que uma equipe precise terminar 100% do nó predecessor antes de qualquer trabalho no sucessor.

É possível existir trabalho preparatório paralelo, protótipos bounded, materialização de testes, documentação ou interfaces provisórias — desde que isso não burle o prerequisite que realmente protege a semântica.

O dependency graph serve para revelar **o que não pode ser legitimamente assumido antes de existir**, não para fabricar uma fila burocrática de 26 passos estritamente seriais.

## 10. WBS node ainda não é Work Package

Após o dependency graph, a fase futura de Work Package Design terá outro problema: encontrar unidades coerentes de mudança executável.

Um nó WBS pode ser grande demais para um único package. Um package pode atravessar mais de um nó quando uma integração legítima exige mudança coordenada. O critério não é simetria visual; é preservar escopo, dependencies, proof obligations e reviewability.

```text
WBS node
   ↓
planejamento de realização

Work Package
   ↓
unidade governada de mudança

TASK
   ↓
menor unidade executiva delimitada
```

**DECIDIDO:** a WBS atual não autoriza Work Packages, TASKs, Construction, código de produto ou testes executáveis. Essa separação é explícita no artefato autoritativo.

## 11. O exemplo da troca de provider

Considere um sistema de notificações que hoje usa Provider A e futuramente precisa aceitar Provider B.

Uma decomposição ingênua poderia criar:

```text
TASK: adicionar Provider B
```

A decomposição G2 revela que a mudança real atravessa várias perguntas:

```text
Qual é a identidade canônica da intenção de notificar?
        ↓
Qual revisão do contrato está aplicável?
        ↓
Provider B foi apenas descoberto ou foi qualificado/admitido?
        ↓
O binding efetivo foi estabelecido?
        ↓
Como coexistem A e B durante cutover?
        ↓
Mensagens antigas ainda podem chegar por A?
        ↓
Callbacks antigos ainda podem produzir efeitos?
        ↓
Como residual cohorts serão drenados?
        ↓
Que evidência prova equivalência suficiente?
        ↓
Qual Production Readiness Coverage é necessária?
```

Isso toca semantic substrate, messaging, provider/binding, capacity, observability, Product Proof e readiness. A WBS não diz que tudo deve virar um package gigantesco. Ela garante que o futuro desenho de packages **não esqueça essas dimensões**.

## 12. O exemplo de uma fórmula empresarial

Agora imagine uma fórmula de custo de uma OS:

```text
custo = horas × valor_hora + materiais
```

Parece uma funcionalidade local. Mas a decomposição exige perguntas adicionais:

- quais unidades estão sendo multiplicadas e somadas?;
- qual revisão da fórmula produziu o resultado histórico?;
- o valor/hora é fato armazenado, preço comercial ou custo econômico?;
- como incerteza ou dado ausente é representado?;
- qual população e janela temporal o cálculo cobre?;
- o resultado derivado preserva provenance?;
- uma mudança de fórmula recalcula história ou apenas novos eventos?;

Por isso existe um nó transversal de matemática, regras, analytics, temporalidade, vetores e incerteza. Ele não “rouba” a semântica de Commercial ou FinOps; fornece obrigações compartilhadas que esses owners precisam preservar ao calcular.

## 13. O exemplo Brownfield: decompor sem canonizar o legado

Em uma empresa real, talvez o processo de OS exista simultaneamente em sistema legado, planilha, WhatsApp, papel e prática verbal.

O nó de Legacy Mirroring/Brownfield Assimilation carrega uma desigualdade fundamental:

```text
observed behavior != intended/canonical process
```

A WBS precisa permitir descobrir, importar, comparar e coexistir com essas fontes sem declarar que “o que existe há dez anos” é automaticamente a regra correta.

Isso conecta diretamente ao EKB: evidências Brownfield entram com source, revision, provenance, uncertainty e disposition. Contradições não devem desaparecer durante a decomposição para implementação.

## 14. Product Proof e Production Readiness continuam separados

A decomposição reserva trabalho para **Product Proof architecture and traceability** e para **Production Readiness Coverage**. Essa separação é deliberada.

Uma feature pode estar semanticamente correta e ainda ser imprópria para produção.

```text
feature correctness
        !=
production readiness
```

Um workflow pode produzir o efeito correto em testes, mas ainda não ter observabilidade adequada, recovery demonstrado, capacidade conhecida, segurança operacional, documentação ou reconciliation suficiente.

A readiness continua multidimensional em áreas como observability, ownership, failure handling, recovery, capacity, currentness, security, reconciliation, change safety, cost e documentation. Não existe autorização para transformar tudo isso em uma média verde que esconda uma dimensão crítica vermelha.

## 15. O nó de reconciliação existe para fechar sem governar tudo

A WBS inclui Architecture Reconciliation, conflict assessment and closure como trabalho transversal. Isso pode parecer contraditório: se a arquitetura já foi reconciliada, por que haverá reconciliação na realização?

Porque implementação, migração e operação produzem **evidência nova**.

A reconciliação futura precisa comparar intenção e realização sem virar dona das semânticas comparadas:

```text
observation != canonical truth
reconciliation != remediation
Signal != ConfirmedConflict
```

Ela pode detectar drift, rotear avaliação e registrar closure. Não pode decidir silenciosamente que uma divergência observada é a nova verdade empresarial.

## 16. A mudança de estado desta rodada

O estado autoritativo consultado registra uma transição concreta:

```text
ARCHITECTURE_RECONCILIATION
        CLOSED / PASS
              ↓
WBS_DECOMPOSITION
        CLOSED / PASS
        26 planning nodes
              ↓
WBS_DEPENDENCY_GRAPH
        AUTHORIZED / NOT STARTED
```

**DECIDIDO:** a arquitetura reconciliada foi decomposta em 26 nós não executivos.

**ABERTO/INCONCLUSIVO:** o dependency graph ainda não estava iniciado no snapshot autoritativo desta edição. Portanto, este apêndice não inventa arestas, critical path, waves, packages ou ordem executiva.

Essa disciplina é importante: um livro explicativo não deve “ajudar” a arquitetura preenchendo a próxima decisão antes do artefato competente.

## 17. O que isso muda na compreensão do Capítulo 23

O Capítulo 23 v1.0.0 foi escrito quando pesquisa adversarial ainda estava ativa e Planning C permanecia bloqueada. Sua estrutura conceitual continua correta, mas seu estado histórico está desatualizado.

Hoje já podemos afirmar, com autoridade dos artefatos posteriores, que:

```text
Research/Synthesis/A/B/Math/Adversarial
        ↓
Planning C — target architecture CLOSED/PASS
        ↓
Planning D — migration strategy CLOSED/PASS
        ↓
Planning E — proof architecture CLOSED/PASS
        ↓
Architecture Reconciliation CLOSED/PASS
        ↓
WBS Decomposition CLOSED/PASS
        ↓
WBS Dependency Graph autorizado
```

Isso não exige uma reinterpretação MAJOR da tese do capítulo. Exige uma futura revisão **MINOR bounded**, porque novas seções e exemplos podem substituir linguagem prospectiva por uma explicação baseada em etapas efetivamente decididas, sem invalidar a estrutura anterior.

## 18. O que você deve guardar deste apêndice

A WBS é a primeira tradução explícita da arquitetura fechada para **unidades de trabalho planejável**, mas ainda não é execução.

Os 26 nós não são 26 capabilities, 26 módulos nem 26 packages. São pontos de decomposição que carregam scope, dependências e proof obligations sem apagar semantic owners ou invariantes transversais.

O dependency graph existe como fase separada porque **saber quais trabalhos existem não é o mesmo que saber quais pré-requisitos existem entre eles**. E prerequisite não significa ownership, assim como ordem lógica não significa calendário totalmente serial.

A cadeia correta continua preservando níveis de autoridade:

```text
arquitetura diz o que deve ser preservado
WBS diz que trabalho precisa existir
WBS dependency graph diz o que depende de quê
Work Package design dirá como agrupar mudança executável
TASK delimitará execução
Construction materializará
Product Proof e Readiness fornecerão evidência de aceitação
reconciliation comparará realização e intenção
```

O valor dessa disciplina é impedir que, na passagem do conhecimento para o código, o System Builder perca justamente as razões pelas quais sua Generation 2 foi pesquisada com tanta profundidade.

---

## Referências autoritativas internas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/ARCHITECTURE_RECONCILIATION_GENERATION_2_CLOSURE.md`
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DECOMPOSITION.md`
- Planning C/D/E já reconciliados, conforme estado autoritativo do pipeline.
- `project_docs/generation-2/book/chapters/CHAPTER_23_COMO_TRANSFORMAR_PESQUISA_EM_ARQUITETURA_WBS_CONSTRUCAO.md` como antecedente editorial, sem autoridade sobre os artefatos acima.