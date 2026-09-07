# Capítulo 23 — Como transformar esta pesquisa em arquitetura alvo, WBS e construção — v1.1.0

**ID editorial:** `CHAPTER_23`  
**Versão editorial:** `1.1.0`  
**Status:** `REVISED`  
**Camada:** compreensão e síntese; não é autoridade de Planning C/D/E, WBS, Work Package ou Construction.  
**Primeira publicação:** 2026-09-05  
**Última revisão:** 2026-09-07

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: como sair de centenas de descobertas sem construir um monstro

Uma pesquisa extensa cria um paradoxo. Quanto mais aprendemos sobre uma empresa e sobre os sistemas que podem representá-la, mais fácil fica produzir uma lista enorme de requisitos — e mais difícil fica saber **o que deve virar arquitetura, em que ordem, com quais dependências e com qual prova de que foi construído corretamente**.

Imagine que a pesquisa descubra que uma OS precisa sobreviver a reinícios, que um pagamento pode ficar `UNKNOWN`, que providers precisam ser substituíveis, que uma Station não pode ampliar autoridade e que uma release precisa carregar provenance. A reação ingênua seria transformar cada frase em módulo ou TASK. Isso seria perigoso. Uma descoberta de pesquisa não informa, sozinha, a forma correta do código.

A Generation 2 separou deliberadamente as etapas para evitar esse salto. Na primeira edição deste capítulo, parte da cadeia abaixo ainda era prospectiva. Nesta revisão, o estado autoritativo já registra pesquisa adversarial saturada, Planning C/D/E fechados, Architecture Reconciliation fechada, WBS e grafo de dependências fechados, Work Package Design concluído e handoff preparado.

```text
observação / evidência
        ↓
     finding
        ↓
 síntese de capabilities
        ↓
 boundaries e semantic owners
        ↓
 pesquisa adversarial
        ↓
 Planning C — arquitetura alvo
        ↓
 Planning D — dependências e migração
        ↓
 Planning E — prova e aceitação
        ↓
 Architecture Reconciliation
        ↓
 WBS Decomposition
        ↓
 WBS Dependency Graph
        ↓
 Work Package Design
        ↓
 Ready for Worker Handoff
        ↓
 autorização executiva separada
        ↓
 TASKs / Construction / prova executada
```

**DECIDIDO:** a cadeia é governada por gates. **DECIDIDO:** `READY_FOR_WORKER_HANDOFF != AUTHORIZED_FOR_EXECUTION`. O handoff atual prepara memória e escopo para um futuro worker, mas não autoriza Work Packages, TASKs executivas, Construction, migrações, deployment ou mudanças de produto.

## 2. Pesquisa não é backlog

Um finding responde algo como: “existe uma classe de risco, necessidade, incompatibilidade ou oportunidade que precisa ser compreendida”. Um item executivo responde: “há uma mudança concreta e delimitada que deve ser executada”.

Essas duas coisas não são equivalentes.

**EXEMPLO DIDÁTICO:** a pesquisa encontra que um timeout de cobrança não prova que a cobrança falhou. O finding pode levar a uma primitive transversal de `EffectDisposition`, a contratos de reconciliation, a proof obligations e só depois a trabalho concreto em determinadas capabilities. Criar imediatamente uma TASK chamada “tratar timeout de cobrança” poderia corrigir um caso local e deixar Workflow, Integration, Storage e Deployment repetindo o mesmo erro.

A função da síntese é perguntar: **que conhecimento se repete, quem é dono da semântica e o que é apenas mecanismo?**

## 3. Da evidência para a capability

A síntese G2 consolidou 28 capabilities canônicas e primitives transversais. Isso não significa 28 pacotes de código. `Capability != module != package != service`.

Uma **capability** representa uma responsabilidade semanticamente coerente. Ela permite dizer quem é dono de determinada verdade e quais contratos precisa manter. Provider/Binding, por exemplo, pode ser dono da qualificação e do vínculo com uma realização externa sem se tornar dono da semântica empresarial realizada pelo provider.

A síntese também identifica estruturas reutilizáveis — `RevisionVector`, qualified evidence, `EffectDisposition`, non-amplifying authority e residual-cohort drainage. Essas estruturas podem ser compartilhadas sem criar um “semantic god-object”.

```text
muitos fatos pesquisados
        ↓
responsabilidades semanticamente coerentes
        +
primitives realmente transversais
```

## 4. Boundaries: decidir quem responde pela verdade antes de decidir onde ficará o código

Planning A responde perguntas de **ownership e boundary**. Ela não responde primeiro “qual classe TypeScript teremos?” ou “qual microserviço armazenará isto?”. A pergunta anterior é: **quem pode afirmar esse fato?**

Se Authorization decide se uma pessoa pode aprovar uma OS, Observability pode trazer evidência operacional sobre a decisão, mas não pode transformar um log em nova permissão. Provider/Binding pode informar que um provider suporta determinado mecanismo, mas não pode decidir que isso satisfaz uma regra empresarial se o semantic owner exige semântica diferente.

Esse cuidado evita transformar o componente tecnicamente central em dono de tudo que passa por ele.

## 5. Planning B: confrontar o modelo com o SB que realmente existe

Depois das boundaries conceituais, Planning B pergunta: **o que o SB atual já possui, parcialmente possui, representa de outra maneira ou ainda não evidencia?**

Isso evita projetar como inexistente algo que já funciona e evita declarar como capability madura algo que existe apenas como primitive local. Por isso `EVIDENCIADO NO SB ATUAL` e `DECIDIDO PARA G2` são categorias diferentes.

## 6. Pesquisa adversarial: tentar quebrar o entendimento antes de cristalizá-lo

A campanha adversarial desafiou boundaries e hipóteses com edge cases, concorrência, version skew, providers degradados, authority misuse, efeitos parciais, recovery, conflitos processuais e negative-space.

**DECIDIDO:** no estado atual, essa fase está `CLOSED / SATURATED / PASS`, após 8 full passes, 28/28 capabilities e 12/12 clusters obrigatórios. O fechamento carregou 408 achados adversariais materiais — 284 edge scenarios e 124 ConflictPatterns — como constraints e rotas de prova; não como 408 TASKs.

Saturação aqui não significa perfeição universal. Significa que o gate definido para essa campanha foi satisfeito sem encontrar uma classe material nova que exigisse manter Planning C bloqueada.

## 7. Planning C: arquitetura alvo deixa de ser hipótese editorial

Na v1.0.0 deste capítulo, Planning C ainda era futuro e o texto corretamente evitava antecipá-la. Esse estado histórico não deve ser apagado: ele explica por que a primeira edição falava no condicional.

**DECIDIDO:** Planning C agora está `CLOSED / PASS`, com C0/C1/C2 e C3.1–C3.28 reconciliados. Isso não torna o livro fonte arquitetural; significa apenas que o livro pode explicar decisões já tomadas pelos artefatos competentes.

A pergunta de Planning C foi, em essência:

> “Que estrutura arquitetural preserva semantic ownership, autoridade, revisão, evidência, providers, dados, operabilidade, trust e localidade sem colapsar essas verdades?”

Arquitetura alvo continua diferente de migração. Saber como o sistema deve ser não diz automaticamente como sair do Brownfield e chegar lá.

## 8. Planning D: arquitetura alvo não é estratégia de migração

Planning D fechou D0–D8 para explicar a travessia entre estado atual e estado alvo. Ela formaliza prerequisites tipados e estados de migração, incluindo coexistência, shadowing, cutover parcial, residual drain e reconciliation.

A distinção humana é simples: **trocar a placa da loja não significa que todos os processos internos já migraram**. Tecnicamente, a analogia deixa de valer porque software distribuído pode manter simultaneamente sessões, writers, callbacks, caches, runtimes, secrets e providers de revisões diferentes.

Por isso residual cohorts são importantes. Uma migração não termina apenas porque o novo caminho existe; termina quando caminhos antigos capazes de produzir efeitos foram fenced, drenados e reconciliados conforme a autoridade competente.

## 9. Planning E: prova não é sinônimo de teste

Construir sem critério de prova transforma “feito” em opinião. Planning E fechou a arquitetura de Product Proof & Acceptance preservando:

`Claim != Evidence != Proof Decision`

Uma **proof obligation** é uma obrigação explícita de demonstrar uma propriedade. Testes determinísticos, conformance tests, property-based tests, model checking, integração real com providers, provenance e chaos podem produzir evidência; nenhuma técnica, isoladamente, ganha autoridade para declarar a claim verdadeira.

Também permanece separada a Production Readiness. `Feature completeness != Product Proof != Production Readiness`.

**EXEMPLO DIDÁTICO:** se a claim é “trocar provider preserva identidade canônica”, dois HTTP 200 não provam equivalência semântica. A evidência precisa ser aplicável à revisão, população e binding relevantes e precisa sustentar a propriedade que o semantic owner realmente exige.

## 10. Architecture Reconciliation: fechar decisões locais não basta

Depois de C, D e E, existe um risco sutil: cada plano pode ser internamente correto e o conjunto ainda conter incompatibilidades.

Architecture Reconciliation confronta arquitetura alvo, estratégia de migração e arquitetura de prova sem criar uma “quarta arquitetura”. Seu papel é verificar coerência transversal e encaminhar divergências aos owners competentes.

**DECIDIDO:** essa reconciliação está `CLOSED / PASS` no estado atual. Isso autorizou a passagem para decomposição de trabalho, não Construction.

## 11. WBS: decompor o objetivo sem perder a razão dele existir

A **Work Breakdown Structure (WBS)** decompõe o trabalho necessário para alcançar resultados verificáveis. Ela não é simplesmente uma lista longa de tarefas.

A decomposição G2 atual possui **26 nós WBS não executivos**. Isso é uma demonstração concreta de que `28 capabilities != 28 WBS nodes`. Capability organiza responsabilidade semântica; WBS organiza trabalho planejado.

```text
objetivo arquitetural
    ↓
capability / boundary / invariant
    ↓
WBS node verificável
    ↓
proof obligations
    ↓
trabalho futuro autorizado separadamente
```

Se essa linhagem se perde, surge trabalho órfão. O inverso também é perigoso: decisão arquitetural sem descendente na WBS vira arquitetura de documento.

## 12. WBS Dependency Graph: ordem parcial, não fila total

O grafo atual usa nove tipos de prerequisite:

`SEMANTIC_PREREQUISITE`, `AUTHORITY_PREREQUISITE`, `REVISION_PREREQUISITE`, `EVIDENCE_PREREQUISITE`, `PROVIDER_PREREQUISITE`, `DATA_PREREQUISITE`, `OPERABILITY_PREREQUISITE`, `TRUST_PREREQUISITE` e `LOCALITY_PREREQUISITE`.

Uma aresta `A → B` não significa necessariamente “termine toda implementação de A antes de tocar B”. Ela significa que B não pode fechar determinada preocupação sem receber de A o prerequisite correspondente.

```text
A ──► B ──► D
 \         ▲
  └──► C ──┘
```

Isso é uma **ordem parcial**. Ramos independentes podem avançar em paralelo quando seus closures permanecem válidos. E uma dependência nunca transfere semantic ownership: depender de Authorization não torna o consumidor dono da política de autorização.

## 13. Work Package Design: agrupar sem fundir owners

O Work Package Design atual agrupa os 26 nós em **13 Work Packages não executivos**, cobrindo cada nó exatamente uma vez. O agrupamento é uma conveniência de planejamento; não redefine capabilities nem seus semantic owners.

Essa distinção é essencial:

`Capability != WBS node != Work Package != TASK`

Um Work Package deve ser grande o suficiente para entregar uma mudança coerente e pequeno o suficiente para manter escopo, risco, dependências e prova compreensíveis.

## 14. Ready for Worker Handoff: pronto para receber um worker não significa pronto para executar

O estado atual do pipeline é `READY_FOR_WORKER_HANDOFF / PREPARED / PASS`.

O handoff carrega 28 capabilities, os 408 achados adversariais materiais, 26 nós WBS, o DAG tipado e 13 Work Packages. Ele também registra explicitamente:

`G2-WP-01..G2-WP-13 = DESIGNED / NOT EXECUTED / NOT AUTHORIZED FOR EXECUTION`

Isso é um limite de autoridade, não uma formalidade. O worker futuro deve reler a memória atual, verificar se não existe gate mais novo e receber autorização separada para um escopo nomeado antes de materializar trabalho executivo.

## 15. TASK: a menor unidade executiva não deve carregar decisões arquiteturais escondidas

Quando TASKs executivas forem legitimamente materializadas, as grandes perguntas de ownership e direção arquitetural devem estar suficientemente resolvidas. Uma TASK saudável precisa saber o que muda, por que muda, de que depende, quais contratos preserva, qual prova deve produzir e o que está fora de escopo.

Se uma TASK precisar decidir sozinha quem é semantic owner, se uma capability deve existir ou qual arquitetura alvo adotar, a decomposição provavelmente falhou ou um fato novo precisa subir de volta ao gate competente.

## 16. Construction: executar não é reinterpretar livremente

Construction transforma trabalho autorizado em mudanças reais. Liberdade de implementação não é licença para reabrir silenciosamente decisões superiores.

```text
surpresa local
   ├─ cabe no contrato → resolver bounded
   └─ invalida boundary/arquitetura → devolver ao gate competente
```

Essa disciplina reduz **architecture drift**: a distância entre o sistema aprovado e o sistema que emerge de milhares de decisões locais.

## 17. Rastreabilidade nos dois sentidos

De cima para baixo:

```text
pesquisa → síntese → boundaries → C → D → E
        → reconciliation → WBS → DAG → WP → autorização → TASK → código/prova
```

De baixo para cima:

```text
linha / contrato / comportamento
        ↑
      TASK
        ↑
  Work Package
        ↑
    WBS node
        ↑
 decisão arquitetural / migração / proof obligation
        ↑
 evidência e finding que motivaram a decisão
```

A primeira direção responde “como construiremos?”. A segunda responde “por que isto existe?”. Para o System Builder, essa segunda pergunta é crucial porque uma regra antiga pode parecer detalhe técnico quando, na verdade, protege uma invariável de autoridade, segurança, dados ou negócio.

## 18. Um exemplo completo: de um problema de OS até um futuro trabalho executivo

**EXEMPLO DIDÁTICO:** suponha que uma OS possa disparar compra de material em provider externo.

A pesquisa encontra que timeout pode deixar o efeito `UNKNOWN`. A síntese reconhece `EffectDisposition` como primitive transversal. Planning A preserva ownership. Planning B verifica o SB existente. A pesquisa adversarial desafia retry, concorrência, provider substitution e partial effects. Planning C estrutura a arquitetura alvo; Planning D define coexistência e migração; Planning E define claims e evidências; Architecture Reconciliation verifica coerência transversal; WBS decompõe; o DAG registra prerequisites; Work Package Design agrupa a mudança.

Mesmo nesse ponto, o trabalho ainda não está autorizado. Somente uma autorização executiva posterior pode permitir materializar TASKs e Construction.

O ponto crucial permanece o mesmo da primeira edição: a TASK não nasce diretamente da frase “timeout é perigoso”. Ela nasce de uma cadeia de entendimento, decisão, decomposição e autoridade.

## 19. O que está decidido e o que continua aberto

**DECIDIDO:** pesquisa adversarial, Planning C, Planning D, Planning E, Architecture Reconciliation, WBS Decomposition, WBS Dependency Graph e Work Package Design estão fechados/pass no estado autoritativo atual.

**DECIDIDO:** o pipeline está preparado para worker handoff.

**ABERTO/INCONCLUSIVO:** Work Packages continuam não executados e não autorizados para execução. Executive TASK materialization, Construction, product-code changes, migrations, executable product tests, deployment, remediation e provider cutover não são autorizados pelo handoff.

Essa separação é uma das lições mais importantes da Generation 2: **planejamento suficientemente maduro para execução futura ainda não é execução, e readiness de handoff ainda não é autoridade de mudança**.

## 20. O livro dentro dessa cadeia

Este livro ocupa uma posição deliberadamente lateral. Ele lê pesquisa, synthesis, planning, reconciliation, WBS e package design para explicar. Pode registrar que um entendimento mudou e elevar sua própria versão editorial. Não pode transformar uma explicação elegante em decisão arquitetural nem autorização executiva.

```text
artefatos autoritativos ─────► gates / handoff / futura construção
          │
          └────► livro didático ─────► compreensão humana
```

A seta do livro não retorna automaticamente para a autoridade.

## 21. O que você deve guardar deste capítulo

Pesquisa não deve virar TASK por atalho. Entre descobrir um problema e alterar o produto existe uma cadeia que protege significado, ownership, dependências, migração, verificabilidade e autoridade.

Capability não é módulo. Capability não é WBS node. WBS node não é Work Package. Work Package não é TASK. Handoff não é autorização. Teste não é automaticamente prova aceita. E arquitetura alvo não é estratégia de migração.

```text
entender antes de estruturar
estruturar antes de planejar a migração
planejar a prova antes de declarar pronto
reconciliar antes de decompor
decompor antes de executar
autorizar antes de construir
provar antes de declarar concluído
```

É essa cadeia que permite que um projeto grande permaneça explicável enquanto cresce.

## Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`
- `project_docs/generation-2/planning/PLANNING_C_TARGET_ARCHITECTURE_CLOSURE_RECONCILIATION.md`
- artefatos `PLANNING_D_D0...D8`
- artefatos `PLANNING_E_E0...E7`
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DECOMPOSITION.md`
- `project_docs/generation-2/wbs/GENERATION_2_WBS_DEPENDENCY_GRAPH.md`
- `project_docs/generation-2/packages/GENERATION_2_WORK_PACKAGE_DESIGN.md`
- `project_docs/generation-2/packages/GENERATION_2_READY_FOR_WORKER_HANDOFF.md`

Estas referências sustentam o entendimento explicado aqui; o capítulo não as substitui.