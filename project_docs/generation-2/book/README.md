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
- Apêndice D: explica a passagem de hipótese para arquitetura ocorrida em Planning C C0/C1: Typed Semantic Graph, revision vectors, execução/effects, qualified evidence, provider/federation/locality, EKB, coverage e Production Readiness Coverage agora possuem decisões arquiteturais autoritativas no escopo decidido.
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

## Planning C agora está ativo — C0 e C1 decididos

O estado autoritativo avançou materialmente desde o fechamento da pesquisa adversarial. `PLANNING_C_TARGET_ARCHITECTURE` está `ACTIVE / OPEN`: **C0 — Universal Capability Architecture / Semantic Substrate** e **C1 — Elicitation & System Understanding** estão `DECIDED / PASS`; C2 — Physical / Peripheral Integration boundary — é o próximo estágio. C3 e as 28 decisões alvo por capability ainda permanecem pendentes.

Isso muda a leitura editorial de algumas ideias que antes eram apenas hipóteses. No escopo de C0, Typed Semantic Graph, `RevisionVector`, `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, `EffectDisposition`, qualified evidence/claims, proof-domain separation, provider support vectors, federation contract continuity, qualified local closure, non-amplifying authority e analytical-kind preservation passaram a compor a arquitetura alvo. No escopo de C1, EKB híbrida/versionada/auditável, `QuestionDefinition != QuestionOccurrence`, information kinds tipados, routing híbrido, contradições explícitas, coverage multidimensional, quatro gates de suficiência e Production Readiness Coverage também foram decididos.

A promoção é precisa:

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

O Apêndice D registra essa transição de forma pedagógica enquanto os capítulos afetados aguardam revisão bounded. A incorporação aos capítulos deve preservar suas identidades e elevar versão apenas quando a revisão for efetivamente aplicada; não se deve fazer bump apenas porque a revisão foi identificada.

Editorialmente, os candidatos mais diretamente afetados por C0/C1 são os Capítulos 02, 03, 05, 06, 07, 12, 13, 14, 18, 21, 22 e 23, além dos Apêndices A–C. Até a aplicação de cada revisão, suas versões publicadas continuam válidas como registro histórico de `v1.0.0`, mas trechos que chamam C0/C1 de hipótese devem ser lidos à luz das decisões autoritativas posteriores e serão reconciliados boundedmente.
