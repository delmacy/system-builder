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
- Capítulo 23: explica a passagem governada `pesquisa → synthesis → boundaries → arquitetura alvo → dependency design → proof obligations → WBS → Work Packages → TASKs → Construction`, sem materializar arquitetura/WBS/trabalho executivo.
- Capítulo 24: consolida o vocabulário e apresenta o mapa mental geral das 28 capabilities, primitives transversais, owners, providers, revisions, authority, evidence, lifecycle, operação e evolução.
- Apêndice A: aprofunda provas, federação, provenance e os limites das alegações sem promover hipóteses de pesquisa a arquitetura decidida.
- Apêndice B: explica operabilidade e a separação entre feature completeness, production readiness, runtime health e business convergence.
- Apêndice C: explica Elicitation & System Understanding como disciplina de reduzir incerteza sem confundir pergunta respondida, evidência suficiente, decisão e readiness; EKB/Master Wizard permanecem hipóteses de pesquisa até o gate arquitetural competente.
- Glossário: evolutivo e didático; definições autoritativas continuam nos artefatos de pesquisa/planejamento.

A primeira sequência editorial está completa. A partir daqui, o modo normal é **manutenção editorial bounded**: revisar somente capítulos cujo entendimento realmente mudou, registrar PATCH/MINOR/MAJOR conforme impacto e criar apêndices apenas quando agregarem compreensão sem duplicar o corpo principal.

## Marco de fechamento da pesquisa adversarial — 2026-09-06

A campanha `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION` foi encerrada autoritativamente como `CLOSED / SATURATED / PASS`. Os Full Passes 1–8 foram concluídos; o Full Pass 8 cobriu 28/28 capabilities canônicas e 12/12 clusters obrigatórios, e a revisão final adversarial de negative-space não encontrou nova superfície empresarial material sem owner nem nova família de conflito. O inventário encerrou esta fase em **408 findings materiais: 284 edge scenarios + 124 ConflictPatterns**, com zero HIGH/CRITICAL sem owner, proof ou detection route.

Editorialmente, esse fechamento não significa que “o sistema está provado correto” nem que todas as hipóteses viraram decisões. Significa algo mais preciso: dentro da metodologia e das lentes aplicadas, novas revisitas elegíveis deixaram de produzir famílias materiais novas e o ataque final de espaço negativo não encontrou lacuna que justificasse manter o gate aberto. Portanto:

```text
saturação da pesquisa adversarial
    != prova absoluta de correção
    != arquitetura alvo decidida
    != implementação pronta

saturação da pesquisa adversarial
    = evidência suficiente para encerrar este gate
      e carregar seus findings/obrigações para o próximo gate
```

`PLANNING_C_TARGET_ARCHITECTURE` está agora `UNBLOCKED / NOT STARTED`. O próximo estágio autorizado deve decidir arquitetura alvo levando adiante os 408 findings e as lentes transversais acumuladas, inclusive Elicitation/System Understanding, Operability, Typed Semantic Graph/Execution, builds autônomos/Fleet, federação, matemática/analítica, workflow proof, provenance, revision/currentness, autonomia offline e as fronteiras Physical/Peripheral. O livro não toma essas decisões por antecipação.

Por isso, os capítulos publicados permanecem estáveis enquanto o simples fechamento do gate apenas confirma o arcabouço já explicado. Revisões versionadas serão feitas quando Planning C ou outro artefato autoritativo posterior **mudar ou ampliar materialmente o entendimento conceitual** de um capítulo; uma mudança de fase, isoladamente, não é motivo para reescrever conteúdo técnico.
