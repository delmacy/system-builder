# Glossário comentado — Generation 2

Este glossário pertence à camada didática do livro. Definições autoritativas continuam nos artefatos de pesquisa, síntese e planejamento.

## A

**Admission / admissão** — decisão de que uma realização já qualificada pode ser usada em determinado escopo sob as políticas aplicáveis. Capacidade técnica não implica admissão.

**Anti-lock-in** — orientação para impedir que a semântica canônica do System Builder dependa desnecessariamente de um fornecedor, protocolo ou mecanismo específico. Não significa evitar providers; significa preservar a possibilidade de substituí-los sem redefinir o negócio.

**APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN** — disposições usadas para descrever o que se sabe sobre um efeito, especialmente uma mutação remota. `UNKNOWN` é importante quando não há evidência suficiente para afirmar se o efeito ocorreu.

## B

**Binding** — vínculo qualificado, revisionado e scoped entre uma necessidade/capability do SB e uma realização/provider admitido. Um binding não torna automaticamente todos os recursos do provider parte da semântica canônica e não é apenas uma connection string.

**Brownfield** — contexto em que a organização já possui sistemas, dados, integrações e processos que precisam coexistir com a evolução. Descobrir uma estrutura brownfield não significa adotá-la automaticamente como semântica canônica.

## C

**Capability** — capacidade semanticamente coerente do sistema, com problema e responsabilidades próprios. Não é sinônimo de módulo de UI, pacote de código ou produto externo.

**Capability/Support Vector** — representação multidimensional que compara requisitos de uma capability com o suporte de uma realização/provider em dimensões relevantes, como semântica, limites, falhas, ordering, locality, lifecycle, offline e evidência. Evita reduzir portabilidade a `supported=true`.

**Canonical / canônico** — aquilo que o SB reconhece como representação ou verdade normativa dentro de um domínio. Um dado externo pode ser evidência sem ser automaticamente canônico.

**Coexistência** — período ou condição em que múltiplas revisões, cohorts, providers, runtimes ou representações permanecem simultaneamente relevantes durante evolução/migração.

**ConflictInstance** — ocorrência concreta, observada ou reproduzível, de um conflito em um sistema/revisão/contexto específicos.

**ConflictPattern** — descrição reutilizável de uma composição potencialmente incompatível. Não prova, por si só, que um defeito está manifestado.

## E

**Edge case** — situação válida ou possível situada em limites, combinações incomuns ou condições difíceis do comportamento esperado. Não é necessariamente um bug; serve para testar se as premissas continuam verdadeiras fora do caminho comum.

**Evidence / evidência** — informação usada para sustentar uma afirmação. Para ser confiável arquiteturalmente, precisa ser qualificada quanto a sujeito, origem, revisão, aplicabilidade, atualidade, cobertura e incerteza quando relevantes.

## H

**Happy path** — percurso em que entradas, dependências e participantes se comportam como esperado. É necessário, mas insuficiente para demonstrar robustez.

## I

**Idempotência** — propriedade segundo a qual repetir uma operação dentro das condições qualificadas do seu contrato não produz efeitos adicionais indevidos. Não deve ser presumida universalmente nem apenas porque existe uma chave de idempotência.

**INCONCLUSIVE** — resultado explícito indicando evidência insuficiente para concluir PASS/FAIL, ALLOW/DENY ou outra afirmação forte. Evita transformar ausência de conhecimento em certeza.

## L

**Lineage / linhagem** — relação rastreável entre uma definição, dado, artefato ou evidência e suas origens, transformações, revisões, correções ou adoções. Ajuda a explicar de onde veio uma verdade e quais derivados podem ser afetados por uma mudança.

**Lossy / com perda** — transformação ou mapeamento que não preserva integralmente a semântica da origem. Uma normalização lossy precisa permanecer explícita; não deve ser apresentada como equivalência perfeita.

## P

**Provider** — sistema, serviço, engine ou mecanismo especializado que realiza parte de uma capability. O SB procura delegar mecânicas maduras sem entregar automaticamente ao provider a propriedade da semântica empresarial.

## Q

**Qualification / qualificação** — avaliação de se uma realização/provider satisfaz os requisitos relevantes sob um escopo, revisões e evidências determinados. Pode resultar em `SUPPORTED`, `PARTIAL`, `UNSUPPORTED` ou `INCONCLUSIVE`; não é sinônimo de admissão.

**Qualified evidence envelope** — estrutura conceitual que preserva contexto necessário para interpretar evidência: provenance/origem, produtor e revisão, sujeito, aplicabilidade, freshness/currentness, cobertura, incerteza e horizonte relevante.

## R

**Reconcile-before-retry** — princípio segundo o qual um efeito mutante `UNKNOWN` deve ser reconciliado antes de uma repetição potencialmente insegura, salvo quando o contrato qualificado da operação prova que a repetição é segura.

**Residual cohort / cohort residual** — população pertencente a uma realização/revisão anterior que ainda pode produzir efeitos relevantes ou autoritativos após um cutover, como sessões, workers, caches, callbacks, credenciais, filas ou clientes antigos.

**Revision / revisão** — identidade de uma evolução de definição, política, schema, fórmula, artefato ou outro elemento. Diferentes elementos podem evoluir independentemente, razão pela qual a pesquisa trabalha também com revision vectors.

**Revision vector / vetor de revisões** — conjunto das revisões relevantes de dimensões que evoluem independentemente. Evita presumir que uma única versão global descreva corretamente processo, schema, política, fórmula, runtime e provider ao mesmo tempo.

**Runtime** — parte do sistema materializado que executa trabalho em operação. A visão G2 busca autonomia de runtime sem exigir dependência permanente do Builder para toda execução.

## S

**Semantic god-object** — antipadrão no qual uma camada dita “universal” passa a decidir significados, políticas e estados pertencentes a múltiplos semantic owners. A UCA G2 deve compartilhar estruturas reutilizáveis sem assumir essa autoridade.

**Semantic owner** — capability ou domínio responsável pelo significado canônico e pelas invariantes de determinada informação/decisão. Um consumidor pode observar ou projetar esse significado sem automaticamente se tornar seu dono.

**Signal / sinal** — indício que pode justificar investigação ou avaliação. `Signal != ConfirmedConflict`: um detector não deve converter suspeita em fato sem evidência suficiente.

**Stale / obsoleto para o contexto** — informação, proposta ou evidência que pode ter sido válida em uma revisão ou instante anterior, mas não pode ser assumida como atual para a decisão presente sem requalificação.

**Station** — escopo organizacional/governado dentro da hierarquia `Enterprise → Station → Role → Person`, usado na pesquisa G2 para exposição de capabilities, administração delegada e limites de autoridade.

## U

**Universal Capability Architecture (UCA)** — owner dos menores contratos estruturais reutilizáveis necessários para capabilities independentes se comporem, como formas de identidade, revisão, evidência, effect disposition e support vector. Não é dona dos predicados de negócio carregados por essas estruturas.

## V

**Version skew** — coexistência ou interação entre componentes/revisões que não estão na mesma versão. Pode ser legítima ou perigosa dependendo das relações de compatibilidade.
