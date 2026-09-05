# Capítulo 23 — Como transformar esta pesquisa em arquitetura alvo, WBS e construção — v1.0.0

**ID editorial:** `CHAPTER_23`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não é autoridade de Planning C, WBS ou Construction.  
**Data:** 2026-09-05

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: como sair de centenas de descobertas sem construir um monstro

Uma pesquisa extensa cria um paradoxo. Quanto mais aprendemos sobre uma empresa e sobre os sistemas que podem representá-la, mais fácil fica produzir uma lista enorme de requisitos — e mais difícil fica saber **o que deve virar arquitetura, em que ordem, com quais dependências e com qual prova de que foi construído corretamente**.

Imagine que a pesquisa descobriu que uma OS precisa sobreviver a reinícios, que um pagamento pode ficar `UNKNOWN`, que providers precisam ser substituíveis, que uma Station não pode ampliar autoridade e que uma release precisa carregar provenance. A reação ingênua seria transformar cada frase em um módulo ou TASK. Isso seria perigoso. Uma descoberta de pesquisa não informa, sozinha, a forma correta do código.

A Generation 2 separa deliberadamente as etapas para evitar esse salto.

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
 arquitetura alvo
        ↓
 desenho de dependências e migração
        ↓
 critérios de prova/aceitação
        ↓
 WBS
        ↓
 Work Packages
        ↓
 TASKs
        ↓
 Construction
        ↓
 evidência de conformidade
```

**DECIDIDO:** essa sequência é governada por gates. No estado autoritativo consultado para esta edição, a pesquisa adversarial continua `ACTIVE / NOT_SATURATED` e Planning C permanece bloqueado. Portanto, este capítulo explica **como a passagem funciona em princípio**; ele não executa essa passagem nem antecipa a arquitetura alvo.

## 2. Pesquisa não é backlog

Um finding responde algo como: “existe uma classe de risco, necessidade, incompatibilidade ou oportunidade que precisa ser compreendida”. Um item de backlog responde: “há uma mudança concreta e delimitada que deve ser executada”.

Essas duas coisas não são equivalentes.

**EXEMPLO DIDÁTICO:** a pesquisa encontra que um timeout de cobrança não prova que a cobrança falhou. O finding pode levar a uma primitive transversal de `EffectDisposition`, a contratos de reconciliation, a proof obligations e só depois a mudanças concretas em determinadas capabilities. Criar imediatamente uma TASK chamada “tratar timeout de cobrança” poderia corrigir um caso local e deixar Workflow, Integration, Storage e Deployment repetindo o mesmo erro.

A função da síntese é justamente perguntar: **que conhecimento se repete, quem é dono da semântica e o que é apenas mecanismo?**

## 3. Da evidência para a capability

A síntese G2 consolidou 28 capabilities canônicas e um conjunto de primitives transversais. Isso não significa 28 pacotes de código. `Capability != module != package != service`.

Uma **capability** representa uma responsabilidade semanticamente coerente. Ela existe para que possamos dizer quem é dono de determinada verdade e quais contratos precisa manter. Por exemplo, Provider/Binding pode ser dono da qualificação e do vínculo com uma realização externa sem se tornar dono da semântica empresarial que o provider realiza.

A síntese também identifica estruturas reutilizáveis — `RevisionVector`, qualified evidence, `EffectDisposition`, non-amplifying authority, residual-cohort drainage. A Planning A de Universal Capability Architecture é explícita: essas estruturas podem ser compartilhadas sem criar um “semantic god-object”.

Essa é a primeira transformação importante:

```text
muitos fatos pesquisados
        ↓
responsabilidades semanticamente coerentes
        +
primitives realmente transversais
```

## 4. Boundaries: decidir quem responde pela verdade antes de decidir onde ficará o código

Planning A responde perguntas de **ownership e boundary**. Ela não deveria responder ainda “qual classe TypeScript teremos?” ou “qual microserviço armazenará isto?”.

A pergunta correta é anterior: quem pode afirmar esse fato?

Se Authorization decide se uma pessoa pode aprovar uma OS, Observability pode trazer evidência operacional sobre a decisão, mas não pode transformar um log em nova permissão. Provider/Binding pode informar que um provider suporta determinado mecanismo, mas não pode decidir que isso satisfaz uma regra empresarial se o semantic owner exige semântica diferente.

Esse cuidado evita um erro comum em grandes plataformas: transformar o componente tecnicamente central em dono de tudo que passa por ele.

## 5. Planning B: confrontar o modelo com o SB que realmente existe

Depois de estabelecer boundaries conceituais, é necessário olhar para o produto existente. Planning B tem outra pergunta: **o que o SB atual já possui, parcialmente possui, representa de outra maneira ou ainda não evidencia?**

Isso impede duas formas de desperdício:

- projetar como inexistente algo que já está corretamente implementado;
- declarar como capability madura algo que existe apenas como primitive local ou mecanismo específico.

Por isso `EVIDENCIADO NO SB ATUAL` e `DECIDIDO PARA G2` são categorias diferentes. A arquitetura alvo futura precisa partir das duas verdades sem confundi-las.

## 6. Pesquisa adversarial: tentar quebrar o entendimento antes de cristalizá-lo

Antes de Planning C, a campanha atual desafia as boundaries e hipóteses com edge cases, concorrência, version skew, providers degradados, authority misuse, efeitos parciais, recovery, conflitos processuais e negative-space.

O propósito não é acumular bugs. É descobrir se a compreensão ainda possui buracos estruturais.

Se um novo cenário material muda uma boundary, o entendimento precisa ser corrigido antes de virar arquitetura alvo. Se repetidas rodadas independentes deixam de encontrar classes materiais novas sob critérios de saturação, cresce a evidência de que o espaço foi suficientemente explorado para o próximo gate — sem afirmar perfeição universal.

No snapshot desta edição, Full Passes 1–4 estão completos e o Full Pass 5 começou; Planning C continua bloqueado. O livro não altera streaks, findings ou gates.

## 7. Planning C: onde a arquitetura alvo poderá finalmente ser decidida

**ABERTO/INCONCLUSIVO:** enquanto o gate adversarial não fechar, a arquitetura alvo da G2 ainda não deve ser tratada como decidida.

Quando Planning C estiver legitimamente aberta, ela poderá transformar semantic owners, boundaries, primitives, constraints e proof obligations em uma **estrutura arquitetural alvo**: componentes, contratos, responsabilidades, direções de dependência e formas de composição.

A pergunta muda de:

> “Quem é dono desta verdade?”

para algo próximo de:

> “Que estrutura de software preserva esse ownership e essas invariantes com o menor acoplamento necessário?”

Isso é uma mudança de nível. Planning A pode dizer que canonical identity não deve colapsar em provider identity. Planning C poderá decidir como essa separação será representada arquiteturalmente. Este capítulo não escolhe essa representação.

## 8. Dependency design: arquitetura não é apenas uma coleção de caixas

Mesmo componentes bem desenhados podem formar uma arquitetura ruim se suas dependências criarem ciclos, autoridade implícita ou dependência de runtime desnecessária.

O desenho de dependências pergunta, entre outras coisas:

- quem pode depender de quem;
- quais contratos atravessam boundaries;
- o que precisa estar no runtime gerado;
- o que pertence somente ao Builder;
- o que pode ser providerizado;
- quais closures precisam ser provadas;
- como uma migração pode ocorrer sem big bang.

Isso conecta diretamente ao princípio já explicado no Capítulo 4: **Builder grande, runtime pequeno** não significa runtime pobre; significa que cada sistema materializado deve carregar a closure necessária ao seu comportamento sem arrastar dependências de autoria e gestão que não precisa para operar autonomamente.

## 9. Planning E e proof obligations: definir o que significará “pronto”

Construir sem critério de prova transforma “feito” em opinião.

Uma **proof obligation** é uma obrigação explícita de demonstrar determinada propriedade relevante. A técnica de prova depende da propriedade: testes determinísticos, conformance tests, property-based tests, model checking, integração real com providers, análise de provenance, chaos experiments ou outras técnicas podem ser adequadas.

A ordem importa:

```text
propriedade desejada
        ↓
obrigação de prova
        ↓
técnica/evidência adequada
        ↓
critério de aceitação
```

Não o contrário. Ter muitos testes existentes não define sozinho o que precisa ser verdadeiro.

**EXEMPLO DIDÁTICO:** se a propriedade é “trocar provider preserva identidade canônica”, testar apenas que ambos respondem HTTP 200 é insuficiente. A prova precisa observar a semântica que deve permanecer invariável durante a substituição.

## 10. WBS: decompor o objetivo sem perder a razão dele existir

A **Work Breakdown Structure (WBS)** é uma decomposição hierárquica do trabalho necessário para alcançar um resultado. Ela não é simplesmente uma lista longa de tarefas.

Uma boa WBS preserva rastreabilidade:

```text
objetivo arquitetural
    ↓
capability / boundary / invariant relevante
    ↓
entregável verificável
    ↓
trabalho necessário
    ↓
evidência de aceitação
```

Se a decomposição perde essa linhagem, surge o “trabalho órfão”: código que alguém implementa porque parecia necessário, mas cuja relação com uma decisão arquitetural e uma prova não é clara.

O inverso também é perigoso: uma decisão arquitetural sem descendentes na WBS torna-se “arquitetura de documento”, correta no papel e ausente no produto.

## 11. Grafo de dependências da WBS: ordem lógica antes de calendário

Dois itens podem ser importantes e ainda assim não poderem começar juntos.

Uma WBS madura precisa revelar dependências. Se B exige um contrato produzido por A, executar B primeiro força mocks prematuros, duplicação ou decisões locais que depois precisarão ser desfeitas.

Por isso o dependency graph é diferente de uma simples numeração:

```text
A ──► B ──► D
 \         ▲
  └──► C ──┘
```

A ordem de construção deveria respeitar prerequisites sem transformar toda a iniciativa em uma cadeia serial. Ramos realmente independentes podem avançar em paralelo; relações semanticamente dependentes precisam de gates claros.

## 12. Work Package: uma unidade de mudança coerente

Um **Work Package** agrupa trabalho que faz sentido construir, revisar e integrar como unidade governada. Ele deve ser grande o bastante para entregar uma mudança coerente e pequeno o bastante para manter escopo, risco e prova compreensíveis.

Não existe uma fórmula universal “um package = uma capability”. Uma capability pode atravessar muitos packages; um package pode precisar tocar mais de uma capability para realizar uma integração legítima. O importante é que ownership e boundaries não desapareçam dentro do pacote.

**EXEMPLO DIDÁTICO:** introduzir uma primitive de qualified evidence pode exigir contrato compartilhado e adoção bounded por dois owners. Isso não autoriza criar um package genérico que reimplemente a semântica de ambos.

## 13. TASK: a menor unidade executiva não deve carregar decisões arquiteturais escondidas

Quando chegamos a TASKs, as grandes perguntas de ownership e direção arquitetural deveriam estar suficientemente resolvidas. A TASK materializa uma mudança delimitada e verificável.

Uma TASK saudável sabe:

- o que muda;
- por que muda;
- quais arquivos/superfícies pode afetar;
- quais contratos precisa preservar;
- de que depende;
- qual prova deve produzir;
- o que está explicitamente fora do escopo.

Se uma TASK precisa decidir sozinha quem é semantic owner, se uma capability deve existir ou qual arquitetura alvo adotar, a decomposição provavelmente ocorreu cedo demais.

## 14. Construction: executar não é reinterpretar livremente

Construction é o momento de transformar trabalho autorizado em mudanças reais no produto. O worker executivo não deveria usar a liberdade de implementação para reabrir silenciosamente decisões de pesquisa ou arquitetura.

Isso não significa programação mecânica. Durante a implementação podem aparecer fatos novos. Quando um fato invalida uma premissa superior, o comportamento correto não é escondê-lo dentro do código; é escalá-lo ao nível de autoridade capaz de revisar a decisão.

```text
surpresa local
   ├─ cabe no contrato → resolver bounded
   └─ invalida boundary/arquitetura → devolver ao gate competente
```

Essa disciplina reduz **architecture drift**: a distância crescente entre o sistema que foi aprovado e o sistema que acabou emergindo de milhares de decisões locais.

## 15. Rastreabilidade nos dois sentidos

Uma esteira madura permite navegar em duas direções.

De cima para baixo:

```text
pesquisa → decisão → arquitetura → WBS → package → TASK → código/prova
```

De baixo para cima:

```text
linha/contrato/comportamento
        ↑
      TASK
        ↑
  Work Package
        ↑
      WBS
        ↑
 decisão arquitetural
        ↑
 evidência que a motivou
```

A primeira direção responde “como construiremos?”. A segunda responde “por que isto existe?”.

Para o System Builder, essa segunda pergunta é especialmente importante porque a plataforma pretende gerar e governar sistemas empresariais por muitos anos. Sem lineage, uma regra antiga pode parecer mero detalhe técnico quando, na verdade, protege uma invariável de autoridade, segurança, dados ou negócio.

## 16. Como evitar dois extremos: burocracia e improvisação

Gates demais podem produzir documentação sem fluxo; gates de menos produzem código sem memória arquitetural.

A finalidade da governança não é aumentar o número de arquivos. É colocar cada decisão no nível em que ela pode ser tomada com evidência suficiente e impedir que uma camada inferior ganhe autoridade acidental.

Uma heurística didática é:

```text
pesquisa descobre
síntese organiza
boundary atribui ownership
arquitetura estrutura
WBS decompõe
package agrupa
TASK delimita
Construction materializa
proof verifica
reconciliation compara
```

Quando uma etapa começa a executar a função da seguinte ou da anterior, surge risco de confusão de autoridade.

## 17. O livro dentro dessa cadeia

Este livro ocupa uma posição deliberadamente lateral.

Ele lê pesquisa, synthesis e planning para **explicar**. Ele pode mostrar conexões que tornam os artefatos mais compreensíveis. Pode registrar que um entendimento mudou e elevar sua própria versão editorial. Mas não pode transformar uma explicação elegante em decisão arquitetural.

```text
artefatos autoritativos ─────► gates e construção
          │
          └────► livro didático
                    │
                    └─► compreensão humana
```

A seta não volta automaticamente do livro para a autoridade. Uma ideia surgida aqui pode inspirar uma pergunta futura, mas precisará passar pelo processo autoritativo adequado.

## 18. Um exemplo completo: de um problema de OS até uma futura TASK

**EXEMPLO DIDÁTICO:** suponha que uma OS possa disparar compra de material em provider externo.

A pesquisa descobre que timeout pode deixar o efeito `UNKNOWN`. A síntese reconhece `EffectDisposition` como primitive transversal. Planning A preserva que Integration/Workflow e o owner empresarial continuam responsáveis pelas semânticas específicas; UCA fornece apenas a estrutura reutilizável. A campanha adversarial desafia retry, concorrência, provider substitution e partial effects.

Somente depois do fechamento dos gates competentes a arquitetura alvo poderá decidir onde ficam contratos e mecanismos de reconciliation. A WBS poderá então decompor o resultado. Um Work Package poderá agrupar uma fatia coerente. TASKs poderão implementar contratos, persistência, adapters e provas.

O ponto crucial é que a TASK final não nasce diretamente da frase “timeout é perigoso”. Ela nasce de uma cadeia de entendimento e decisões qualificadas.

## 19. O que ainda está aberto

**EM PESQUISA:** a campanha adversarial ainda não saturou.

**ABERTO/INCONCLUSIVO:** a arquitetura alvo de Planning C, sua decomposição concreta, dependency/migration strategy, Product Proof final, WBS, Work Packages e TASKs futuras não são decididas por este capítulo.

**DECIDIDO:** a Generation 2 já possui uma síntese de 28 capabilities, boundaries de Planning A e reconciliação de Planning B completas; possui também pesquisa matemática fechada e uma campanha adversarial ativa. Esses artefatos são entradas para os gates seguintes quando eles forem legitimamente abertos.

## 20. O que você deve guardar deste capítulo

Pesquisa não deve virar TASK por atalho. Entre descobrir um problema e alterar o produto existe uma cadeia de transformação que protege significado, ownership, dependências e verificabilidade.

Capability não é módulo. Boundary não é package. Arquitetura não é WBS. WBS não é lista de TASKs. TASK não é autorização para reinterpretar arquitetura. Teste não é automaticamente proof obligation satisfeita.

A disciplina pode ser resumida assim:

```text
entender antes de estruturar
estruturar antes de decompor
decompor antes de executar
provar antes de declarar concluído
reconciliar antes de assumir convergência
```

É essa cadeia que permite que um projeto grande permaneça explicável enquanto cresce.

## Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`
- `project_docs/generation-2/planning/PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

Estas referências sustentam o entendimento explicado aqui; o capítulo não as substitui.