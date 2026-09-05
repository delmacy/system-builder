# Livro técnico-conceitual — System Builder Generation 2

Este diretório transforma o conhecimento acumulado da Generation 2 em uma narrativa pedagógica em português brasileiro. Ele existe para compreensão: não substitui pesquisa, synthesis, Planning ou qualquer gate autoritativo.

## Como ler

A sequência principal está em `TABLE_OF_CONTENTS.md`. Os primeiros capítulos constroem o modelo mental; os intermediários explicam capabilities e mecanismos; os últimos tratam falhas, técnicas adversariais, IA e a passagem da pesquisa para arquitetura/construção.

Afirmações importantes podem receber marcadores editoriais:

- `DECIDIDO`: sustentado por artefato autoritativo já fechado no estágio correspondente;
- `EVIDENCIADO NO SB ATUAL`: constatado na reconciliação do repositório existente;
- `HIPÓTESE DE ARQUITETURA`: direção ainda sujeita ao gate arquitetural competente;
- `EM PESQUISA`: assunto deliberadamente aberto na campanha atual;
- `ABERTO/INCONCLUSIVO`: evidência ainda insuficiente para conclusão;
- `EXEMPLO DIDÁTICO`: cenário criado para ensinar, não afirmação sobre implementação real.

Quando uma conclusão evoluir, o livro deve explicar a evolução em vez de apagar silenciosamente a versão anterior. Cada capítulo publicado possui identidade `CHAPTER_XX` e versão editorial própria; `ChapterVersion != ArchitectureRevision != SystemRevision`. O histórico dessas versões fica em `CHANGELOG.md` e o estado editorial detalhado em `BOOK_STATE.json`.

## Estado atual da narrativa

- Capítulos 1–9: publicados em `v1.0.0`.
- Capítulo 1: visão do System Builder e o problema que ele tenta resolver.
- Capítulo 2: empresa como sistema versionado e semântica revisionada.
- Capítulo 3: Capability, Provider, Binding e Semantic Owner.
- Capítulo 4: composição modular, fechamento de dependências e runtime autônomo.
- Capítulo 5: low-code, Canvas, grafos executáveis e admissibilidade de composição.
- Capítulo 6: workflow durável, ações, eventos, formulários, integrações e efeitos ambíguos.
- Capítulo 7: identidade, autenticação, autorização, Stations, least privilege e não amplificação de autoridade.
- Capítulo 8: dados, schema, documentos/storage, privacidade, retenção, legal hold, residency e governed populations.
- Capítulo 9: cálculos, fórmulas, valores derivados, revisões, units/money/time, failure algebra, dependency graphs, materialização e semântica provider-neutral.
- Capítulo 10: próximo — build, artefatos, releases, provenance, SBOM e repositórios do cliente.
- Glossário: evolutivo e didático; definições autoritativas continuam nos artefatos de pesquisa/planejamento.

A pesquisa adversarial continua ativa; no snapshot editorial revalidado em 2026-09-05, Full Passes 1 e 2 estão completos e o Full Pass 3 está em 2/28 capabilities e 2/12 mandatory clusters, com 2/8 full passes mínimos completos. Planning C permanece bloqueado. Por isso, capítulos publicados podem receber revisões limitadas quando novos resultados alterarem materialmente o entendimento explicado.
