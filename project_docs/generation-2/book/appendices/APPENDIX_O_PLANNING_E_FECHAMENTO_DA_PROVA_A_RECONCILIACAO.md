# Apêndice O — Planning E fecha: da prova de partes à reconciliação da arquitetura — v1.0.0

> **Identidade editorial:** APPENDIX_O  
> **Versão editorial:** 1.0.0  
> **Status:** PUBLISHED  
> **Data:** 2026-09-07  
> **Natureza:** camada didática; não substitui artefatos autoritativos de Planning E nem decide Architecture Reconciliation.

## O problema humano: quando “temos provas” ainda não significa “temos uma arquitetura coerente”

Imagine uma empresa que está implantando um novo sistema. Cada equipe apresenta seu relatório: autenticação funciona, o workflow executa, o banco persiste, o provider externo responde, o deploy sobe, o dashboard mostra métricas e a cobrança calcula corretamente. É tentador somar todos esses resultados e concluir: “o sistema está provado”.

Essa conclusão é perigosa.

As partes podem estar individualmente demonstradas e, ainda assim, o conjunto pode conter contradições. Uma autorização pode ter sido provada sob uma revisão de política enquanto o workflow usa outra. Um provider pode passar seus testes de conformance, mas a aplicação pode depender de uma extensão que impede substituição real. Um deployment pode estar saudável enquanto parte da população ainda executa uma geração anterior. Um dashboard pode estar correto sobre aquilo que observa, mas incompleto para a claim empresarial que alguém tenta aceitar.

É por isso que o fechamento de Planning E não deve ser lido como “o produto já foi executado e aprovado em produção”. **DECIDIDO:** Planning E define e reconcilia a arquitetura de prova e aceitação. Sua conclusão autoriza a fase seguinte, Architecture Reconciliation; não executa Construction nem transforma proof obligations em resultados de produto que ainda não foram materializados.

A mudança de fase pode ser resumida assim:

```text
Planning C
como a arquitetura alvo deve ser
        ↓
Planning D
como o estado atual pode migrar até ela
        ↓
Planning E
como alegações sobre o produto devem ser provadas e aceitas
        ↓
Architecture Reconciliation
as três respostas continuam coerentes quando vistas juntas?
```

## 1. O que Planning E acrescentou ao raciocínio

Antes de Planning E, o projeto já possuía decisões de arquitetura e uma estratégia de migração. Faltava, porém, uma disciplina explícita para responder a perguntas como:

- qual é exatamente a alegação que queremos demonstrar;
- que evidência é aplicável a essa alegação;
- quão atual precisa ser essa evidência;
- qual população ela cobre;
- quem possui autoridade para aceitar a claim;
- o que fazer quando a evidência é parcial, conflitante ou inconclusiva;
- como impedir que um teste local seja promovido indevidamente a prova global.

O conceito técnico importante é **proof architecture**, ou arquitetura de prova: a estrutura que relaciona claims, proof obligations, evidências, qualificações e decisões de aceitação.

Ela não é a mesma coisa que uma suíte de testes.

```text
teste executado
    ↓ produz
Evidence
    ↓ qualificada para
Proof Obligation
    ↓ sustenta ou não
Claim
    ↓ avaliada por autoridade competente
Acceptance Decision
```

Um teste pode produzir evidência excelente e ainda ser insuficiente para determinada claim. Da mesma forma, uma evidência antiga pode continuar historicamente verdadeira, mas não possuir currentness suficiente para provar o estado atual.

## 2. Claim, evidência e decisão continuam separados

**DECIDIDO:** o fechamento de Planning E preserva a desigualdade:

```text
Claim != Evidence != Proof Decision
```

Uma **claim** é uma alegação verificável sobre o produto. “Este runtime opera autonomamente sem o Builder” é uma claim. “Este provider pode ser substituído sem perda da semântica declarada” é outra.

**Evidence** é material observável usado para sustentar ou refutar a claim: resultados de testes, traces, artefatos assinados, manifests, estados observados, registros de reconciliação, medições ou outras provas admissíveis.

A **proof decision** é o julgamento qualificado sobre se a obrigação foi satisfeita no escopo declarado. Ela não deve ser inferida simplesmente porque existe algum resultado verde.

Essa separação protege o System Builder de uma forma comum de autoengano de engenharia: confundir “eu medi algo” com “provei aquilo que pretendia provar”.

## 3. PASS não é a única resposta intelectualmente honesta

Planning E utiliza estados de prova capazes de representar realidade incompleta. Entre eles estão `PASS`, `PARTIAL`, `INCONCLUSIVE`, `BLOCKED`, `FAIL`, `NOT_APPLICABLE` e `DEFERRED`.

Isso importa porque sistemas distribuídos, providers externos, Stations offline, migrações e efeitos empresariais frequentemente produzem conhecimento imperfeito.

Considere uma OS enviada a um provider externo. O request saiu, ocorreu timeout e a resposta não chegou. A ausência da resposta não prova ausência do efeito. Se a claim for “nenhuma OS foi criada externamente”, o estado correto pode ser `INCONCLUSIVE` até reconciliation, não `PASS` nem `FAIL` por conveniência.

Essa lógica preserva um princípio já recorrente na Generation 2:

```text
UNKNOWN → reconcile-before-retry
```

A prova deve respeitar a mesma incerteza que a operação real respeita.

## 4. Provar uma capability não é provar o produto inteiro

**DECIDIDO:** Planning E fecha uma arquitetura integrada de proof obligations sem permitir que provas locais sejam somadas mecanicamente.

Suponha quatro resultados:

```text
Identity proof      PASS
Authorization proof PASS
Workflow proof      PASS
Provider proof      PASS
```

Ainda falta perguntar se todos foram avaliados sob revisões compatíveis, semantic owners coerentes, bindings aplicáveis e populações correspondentes.

Um exemplo simples: o teste de autorização usa PolicyRevision 12, mas o runtime que executou o workflow ainda estava efetivamente em PolicyRevision 11. Ambos os testes podem ter passado separadamente. O conjunto, porém, não prova a claim “o workflow executou sob a política 12”.

Esse é o ponto em que a prova deixa de ser apenas verificação local e passa a depender de **reconciliação arquitetural**.

## 5. Feature correctness continua diferente de Production Readiness

Um dos ganhos pedagógicos mais importantes de Planning E é impedir a frase “funciona, portanto está pronto”.

Uma feature pode produzir o resultado funcional esperado e ainda não possuir condições aceitáveis de produção. A arquitetura de prova mantém lentes como observabilidade, ownership, failure handling, recovery, capacity, currentness, security, reconciliation, change safety, cost e documentation.

**EXEMPLO DIDÁTICO:** um envio de e-mail pode estar funcionalmente correto. Mas, para produção, ainda precisamos saber como detectar atraso, quem responde pelo incidente, como retries evitam duplicidade, como secrets são rotacionados, como o provider é substituído, quais limites de throughput existem e como reconciliar um timeout ambíguo.

Portanto:

```text
FeatureCorrectness != ProductionReadiness
```

A desigualdade não diminui o valor do teste funcional. Apenas impede que ele receba autoridade maior do que possui.

## 6. O fechamento de Planning E não executou as provas

Esta distinção merece destaque porque o verbo “provar” pode confundir.

**DECIDIDO:** Planning E está fechado como etapa de planejamento de Product Proof & Acceptance. Isso significa que a arquitetura das claims, proof obligations, evidências e critérios de aceitação foi decidida e reconciliada para permitir avanço do pipeline.

Isso não significa que todos os futuros testes de Construction já rodaram, que todos os providers futuros já foram experimentados ou que todos os workloads reais já demonstraram Production Readiness.

Uma analogia útil é a engenharia civil: definir quais ensaios o concreto deverá passar, em quais condições, com quais limites e quem assina o laudo é diferente de fabricar o concreto e executar os ensaios em cada lote.

A analogia deixa de valer onde software possui coexistência de revisões, comportamento distribuído e estados `UNKNOWN`; nesses pontos, a prova precisa também carregar identidade, revisão, população, currentness e lineage.

## 7. Por que Architecture Reconciliation vem agora

O pipeline entrou em `ARCHITECTURE_RECONCILIATION`. Isso não é uma repetição de Planning C.

Planning C reconciliou decisões da arquitetura alvo naquele estágio. Depois disso, Planning D acrescentou a estratégia de migração e Planning E acrescentou a arquitetura de prova. Esses novos planos introduzem dependências e restrições que precisam ser confrontadas novamente com o todo.

A pergunta muda para:

> A arquitetura alvo, a estratégia de migração e a arquitetura de prova formam, juntas, um sistema coerente, implementável e rastreável?

Um desenho pode ser semanticamente elegante, mas impossível de migrar sem dual-writer perigoso. Uma migração pode ser operacionalmente plausível, mas impossível de provar porque não preserva evidence lineage. Uma proof obligation pode ser rigorosa, mas exigir evidência que a arquitetura alvo nunca produz.

Architecture Reconciliation existe para encontrar exatamente esse tipo de incompatibilidade transversal antes da decomposição em WBS.

## 8. A reconciliação não deve inventar uma quarta arquitetura

**ABERTO/INCONCLUSIVO:** a execução da fase de Architecture Reconciliation ainda deve seguir seus artefatos autoritativos próprios. O livro não antecipa suas disposições.

O princípio editorial, porém, pode ser explicado: reconciliar não é aproveitar a oportunidade para redesenhar livremente o produto. É confrontar decisões, evidências e dependências e registrar disposições governadas quando existirem gaps materiais.

O pipeline já define uma linguagem de disposição para essa fase, incluindo categorias como `KEEP`, `HARDEN`, `GENERALIZE`, `PROVIDERIZE`, `INTEGRATE`, `REPLACE`, `DEFER` e `DO_NOT_BUILD`. O significado concreto de cada aplicação pertence ao artefato autoritativo de reconciliação, não a este apêndice.

Isso preserva a ordem epistemológica:

```text
pesquisa encontra
planning decide
proof architecture define como demonstrar
reconciliation confronta o conjunto
WBS decompõe trabalho autorizado
Construction implementa
```

## 9. Um exemplo completo: uma OS com provider externo

**EXEMPLO DIDÁTICO:** imagine uma empresa em que uma OS de manutenção pode gerar uma notificação por e-mail e uma ordem em um sistema externo.

A arquitetura alvo pode decidir que o semantic owner da OS continua no domínio do System Builder, enquanto o sistema externo é provider de determinada capability. A estratégia de migração pode exigir shadowing antes do cutover e drainage de callbacks antigos. A arquitetura de prova pode exigir evidência de que uma OS não produz efeito duplicado sob timeout/retry e de que substituir o provider preserva as semânticas declaradas.

Agora surge a reconciliação transversal:

```text
Semântica:
quem é owner da identidade da OS?

Migração:
quando o writer antigo perde autoridade?

Provider:
qual binding está efetivo para esta população?

Efeito:
qual EffectIdentity impede duplicidade?

Prova:
qual evidência demonstra exatamente-once business intent
sem fingir exactly-once transport?

Operação:
como UNKNOWN é reconciliado?

Lifecycle:
qual revisão estava aplicável no momento do efeito?
```

Se qualquer resposta depender de uma suposição incompatível com outra, a arquitetura ainda precisa de reconciliação antes de virar WBS.

## 10. O que muda para a leitura dos capítulos anteriores

O fechamento de Planning E não invalida a primeira edição do livro, mas muda o estado epistemológico de várias passagens.

O Capítulo 17 pode futuramente ganhar uma revisão MINOR para separar com maior formalidade família de teste, produtor de evidência, proof obligation e acceptance decision. O Capítulo 20 pode explicar melhor que fuzzing, chaos ou model checking são técnicas de produção de evidência e descoberta, não autoridades universais de aceitação. O Capítulo 22 pode incorporar a proof architecture ao ciclo ponta a ponta. E o Capítulo 23 possui o maior delta: sua narrativa foi escrita antes do fechamento de Planning C, D e E e agora pode descrever essas três etapas como decisões históricas concluídas, não como trabalho futuro hipotético.

Nenhuma dessas revisões deve ser feita silenciosamente. Cada uma exige seu próprio bump editorial e changelog.

## 11. O que você deve guardar deste apêndice

Planning E responde **como saberemos que uma alegação sobre o produto está suficientemente demonstrada**, sem confundir teste, evidência e decisão.

Seu fechamento não significa que Construction ocorreu nem que o produto futuro já passou pelos ensaios. Significa que a arquitetura de prova e aceitação está decidida o suficiente para o pipeline avançar.

A fase seguinte existe porque:

```text
arquitetura alvo coerente isoladamente
+
estratégia de migração coerente isoladamente
+
arquitetura de prova coerente isoladamente

não implica automaticamente

arquitetura global coerente
```

É essa última implicação que Architecture Reconciliation precisa examinar antes que o conhecimento seja transformado em WBS e trabalho executivo.

## Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_E_PRODUCT_PROOF_ACCEPTANCE_ENTRY_FRAMEWORK.md`
- artefatos `PLANNING_E_E1_*` a `PLANNING_E_E7_*` registrados pelo estado autoritativo de Planning E
- `project_docs/generation-2/planning/PLANNING_C_TARGET_ARCHITECTURE_CLOSURE_RECONCILIATION.md`
- artefatos `PLANNING_D_D0_*` a `PLANNING_D_D8_*`

Este apêndice é explicativo. Em caso de divergência, os artefatos autoritativos prevalecem.