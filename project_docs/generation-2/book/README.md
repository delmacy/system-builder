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
- Capítulo 23: explica a passagem governada `pesquisa → synthesis → boundaries → arquitetura alvo → dependency design → proof obligations → WBS → Work Packages → TASKs → Construction`, sem entrar em Planning C nem materializar arquitetura/WBS/trabalho executivo.
- Capítulo 24: consolida o vocabulário e apresenta o mapa mental geral das 28 capabilities, primitives transversais, owners, providers, revisions, authority, evidence, lifecycle, operação e evolução.
- Apêndice A: aprofunda provas, federação, provenance e os limites das alegações sem promover hipóteses de pesquisa a arquitetura decidida.
- Apêndice B: explica operabilidade e a separação entre feature completeness, production readiness, runtime health e business convergence.
- Apêndice C: explica Elicitation & System Understanding como disciplina de reduzir incerteza sem confundir pergunta respondida, evidência suficiente, decisão e readiness; EKB/Master Wizard permanecem hipóteses de pesquisa.
- Glossário: evolutivo e didático; definições autoritativas continuam nos artefatos de pesquisa/planejamento.

A primeira sequência editorial está completa. A partir daqui, o modo normal é **manutenção editorial bounded**: revisar somente capítulos cujo entendimento realmente mudou, registrar PATCH/MINOR/MAJOR conforme impacto e criar apêndices apenas quando agregarem compreensão sem duplicar o corpo principal.

A pesquisa adversarial continua `ACTIVE / NOT_SATURATED`; no snapshot editorial revalidado em 2026-09-06, Full Passes 1–7 estão completos e o Full Pass 8 está em 17/28 capabilities e 12/12 mandatory clusters, com 7/8 full passes mínimos completos e 408 findings materiais (284 edge scenarios + 124 ConflictPatterns). O avanço continua elegível como `NO-NEW-MATERIAL`: os revisits recentes reconfirmam famílias já explicadas, agora também sob Authorization / Policy / Organization / Multitenancy. Entre as separações reafirmadas estão `decision under revision M != authority/effect under M+1`, `provider role/group != canonical authorization semantics` e `external grant state != actual physical/media access success`. Isso reforça que autoridade precisa permanecer revision-qualified e não pode ser ampliada por tradução de provider, delegação, operação offline ou integração física; porém **não constitui entendimento materialmente novo e não equivale ainda a saturação**. Elicitation & System Understanding e Operability Elicitation permanecem lentes transversais em pesquisa. A negative-space final ainda não começou e Planning C continua bloqueado. Por isso, capítulos publicados devem permanecer estáveis enquanto novos resultados apenas reconfirmarem padrões existentes; revisão de versão continua reservada a mudança material de compreensão.
