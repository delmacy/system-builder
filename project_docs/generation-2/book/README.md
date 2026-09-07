# Livro técnico-conceitual — System Builder Generation 2

Este diretório transforma o conhecimento acumulado da Generation 2 em uma narrativa pedagógica em português brasileiro. Ele existe para compreensão: não substitui pesquisa, synthesis, Planning ou qualquer gate autoritativo.

## Como ler

A sequência principal está em `TABLE_OF_CONTENTS.md`. Os primeiros capítulos constroem o modelo mental; os intermediários explicam capabilities e mecanismos; os últimos tratam falhas, técnicas adversariais, IA, o ciclo ponta a ponta, a passagem da pesquisa para arquitetura/construção e, por fim, um mapa mental integrador.

Afirmações importantes podem receber marcadores editoriais:

- `DECIDIDO`: sustentado por artefato autoritativo já fechado no estágio correspondente;
- `EVIDENCIADO NO SB ATUAL`: constatado na reconciliação do repositório existente;
- `HIPÓTESE DE ARQUITETURA`: direção ainda sujeita ao gate arquitetural competente;
- `EM PESQUISA`: assunto deliberadamente aberto na campanha atual;
- `ABERTO/INCONCLUSIVO`: evidência ainda insuficiente para conclusão;
- `EXEMPLO DIDÁTICO`: cenário criado para ensinar, não afirmação sobre implementação real.

Quando uma conclusão evoluir, o livro deve explicar a evolução em vez de apagar silenciosamente a versão anterior. Cada capítulo publicado possui identidade `CHAPTER_XX` e versão editorial própria; `ChapterVersion != ArchitectureRevision != SystemRevision`. O histórico dessas versões fica em `CHANGELOG.md` e o estado editorial detalhado em `BOOK_STATE.json`.

## Estado atual da narrativa

- Capítulos 1–24: publicados em `v1.0.0`.
- Capítulos 1–22: constroem a visão, semantic owners, runtime, providers, lifecycle, operação, segurança, economia, testes adversariais, IA e o ciclo completo da intenção ao sistema operado.
- Capítulo 23: explica a passagem governada `pesquisa → synthesis → boundaries → arquitetura alvo → dependency design → proof obligations → WBS → Work Packages → TASKs → Construction`.
- Capítulo 24: consolida o vocabulário e apresenta o mapa mental geral das 28 capabilities e primitives transversais.
- Apêndice A: aprofunda provas, federação, provenance e limites das alegações.
- Apêndice B: explica operabilidade e a separação entre feature completeness, production readiness, runtime health e business convergence.
- Apêndice C: explica Elicitation & System Understanding como disciplina de reduzir incerteza sem confundir pergunta respondida, evidência suficiente, decisão e readiness.
- Apêndice D: explica a passagem de hipótese para arquitetura ocorrida em Planning C C0/C1.
- Apêndice E: acompanha a passagem da semântica constitucional para capabilities e superfícies governadas em Planning C.
- Apêndice F: explica Authorization como plano canônico de autoridade, currentness e convergência.
- Apêndice G: explica Trust/PKI como plano provider-neutral, revision-qualified, temporal, evidenciado e population-aware.
- Glossário: evolutivo e didático; definições autoritativas continuam nos artefatos de pesquisa/planejamento.

A primeira sequência editorial está completa. O modo normal é **manutenção editorial bounded**: revisar somente capítulos cujo entendimento realmente mudou e registrar PATCH/MINOR/MAJOR conforme impacto.

## Marco de fechamento da pesquisa adversarial — 2026-09-06

A campanha `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION` foi encerrada autoritativamente como `CLOSED / SATURATED / PASS`. Os Full Passes 1–8 foram concluídos; o Full Pass 8 cobriu 28/28 capabilities canônicas e 12/12 clusters obrigatórios. O inventário encerrou esta fase em **408 findings materiais: 284 edge scenarios + 124 ConflictPatterns**, com zero HIGH/CRITICAL sem owner, proof ou detection route.

```text
saturação da pesquisa adversarial
    != prova absoluta de correção
    != arquitetura alvo decidida
    != implementação pronta

saturação da pesquisa adversarial
    = evidência suficiente para encerrar este gate
      e carregar seus findings/obrigações para o próximo gate
```

## Planning C ativo — C0/C1/C2 decididos e C3 em 11/28

O estado autoritativo avançou materialmente. `PLANNING_C_TARGET_ARCHITECTURE` permanece `ACTIVE / OPEN`: **C0 — Universal Capability Architecture / Semantic Substrate**, **C1 — Elicitation & System Understanding** e **C2 — Physical / Peripheral Integration boundary** estão `DECIDED / PASS`. A arquitetura alvo capability-by-capability de C3 chegou a **11/28**, com **Enterprise Trust / PKI / Certificate Lifecycle** como decisão mais recente. O próximo alvo autorizado é **C3.12 — Privacy / Data Governance / Retention / Legal Hold / Residency**. Planning D continua bloqueado até o fechamento de Planning C.

C0 promoveu Typed Semantic Graph, `RevisionVector`, `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, `EffectDisposition`, qualified evidence/claims, proof-domain separation, provider support vectors, federation contract continuity, qualified local closure, non-amplifying authority e analytical-kind preservation. C1 decidiu EKB híbrida/versionada/auditável, `QuestionDefinition != QuestionOccurrence`, information kinds tipados, routing híbrido, contradições explícitas, coverage multidimensional, quatro gates de suficiência e Production Readiness Coverage. C2 delimitou Physical/Peripheral como plano bounded de integração/governança sem inferir uma capability genérica de atuação física direta.

C3 já tornou concretas várias consequências dessas constituições. Em especial, C3.11 decidiu um **Canonical Enterprise Trust & PKI Plane** provider-neutral e qualificado por revisão. Trust passa a distinguir domínios/relações, anchor/bundle generations, issuer generations, logical key/certificate identities, emissão, distribuição, consumer-effective adoption, validação/currentness, revogação, residual cohorts, provider substitution, offline verification e recovery trust-epoch crossing.

```text
certificate chain valid != applicable policy/currentness satisfied
issued != distributed != consumer-effective
revocation unknown != valid
signature verified != semantic truth
restored trust material != currently qualified trust material
```

O Apêndice G explica esse delta pedagogicamente enquanto o Capítulo 15 aguarda uma revisão bounded. Sua tese central continua válida, mas alguns trechos que ainda classificam contratos de trust como hipótese deverão ser promovidos a `DECIDIDO` quando a revisão versionada for aplicada.

A promoção epistemológica continua precisa:

```text
hipótese de pesquisa
    + gate arquitetural competente
    + decisão Planning C
    = arquitetura alvo no escopo decidido

arquitetura alvo decidida
    != implementação
    != package topology
    != deployment topology
    != Planning C completo
```

Editorialmente, os capítulos mais diretamente afetados pelas decisões já tomadas em Planning C devem ser revisados de forma bounded, sem bumps antecipados. A identidade de cada capítulo permanece estável e sua versão só muda quando a revisão for efetivamente aplicada.
