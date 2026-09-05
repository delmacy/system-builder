# Glossário comentado — Generation 2

Este glossário pertence à camada didática do livro. Definições autoritativas continuam nos artefatos de pesquisa, síntese e planejamento.

## A

**Admission / admissão** — decisão de que uma realização já qualificada pode ser usada em determinado escopo sob as políticas aplicáveis. Capacidade técnica não implica admissão.

**Anti-lock-in** — orientação para impedir que a semântica canônica do System Builder dependa desnecessariamente de um fornecedor, protocolo ou mecanismo específico. Não significa evitar providers; significa preservar a possibilidade de substituí-los sem redefinir o negócio.

**APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN** — disposições usadas para descrever o que se sabe sobre um efeito, especialmente uma mutação remota. `UNKNOWN` é importante quando não há evidência suficiente para afirmar se o efeito ocorreu.

## B

**Binding** — vínculo qualificado, revisionado e scoped entre uma necessidade/capability do SB e uma realização/provider admitido. Um binding não torna automaticamente todos os recursos do provider parte da semântica canônica e não é apenas uma connection string.

**Brownfield** — contexto em que a organização já possui sistemas, dados, integrações e processos que precisam coexistir com a evolução. Descobrir uma estrutura brownfield não significa adotá-la automaticamente como semântica canônica.

**Build closure / fechamento de build** — conjunto transitivamente fechado de materiais, dependências, recipe/toolchain e inputs declarados necessários para produzir um output sob um perfil de build. Não é a mesma coisa que retained runtime closure.

## C

**Canvas** — superfície visual de autoria/composição usada para organizar componentes, nós, relações, formulários, ações ou partes de processos. No modelo didático G2, Canvas é meio de expressão e projeção; não se torna automaticamente a fonte canônica de processo, autorização, dados ou efeito.

**Capability** — capacidade semanticamente coerente do sistema, com problema e responsabilidades próprios. Não é sinônimo de módulo de UI, pacote de código ou produto externo.

**Capability/Support Vector** — representação multidimensional que compara requisitos de uma capability com o suporte de uma realização/provider em dimensões relevantes, como semântica, limites, falhas, ordering, locality, lifecycle, offline e evidência. Evita reduzir portabilidade a `supported=true`.

**Canonical / canônico** — aquilo que o SB reconhece como representação ou verdade normativa dentro de um domínio. Um dado externo pode ser evidência sem ser automaticamente canônico.

**Closure / fechamento** — conjunto que inclui um elemento e todas as dependências transitivas necessárias sob um perfil declarado. Uma closure correta precisa considerar condições, revisões e dependências que influenciam a execução ou materialização; não é apenas uma lista de imports diretos.

**Coexistência** — período ou condição em que múltiplas revisões, cohorts, providers, runtimes ou representações permanecem simultaneamente relevantes durante evolução/migração.

**Composition admissibility / admissibilidade da composição** — avaliação de se uma combinação de primitivas, ações, regras ou nós respeita as constraints materiais aplicáveis ao conjunto. É diferente de validar cada primitiva isoladamente e também não substitui autorização no momento da atuação ou qualificação do efeito.

**ConflictInstance** — ocorrência concreta, observada ou reproduzível, de um conflito em um sistema/revisão/contexto específicos.

**ConflictPattern** — descrição reutilizável de uma composição potencialmente incompatível. Não prova, por si só, que um defeito está manifestado.

**Cumulative context / contexto acumulado** — contexto mínimo que precisa atravessar boundaries sucessivas para preservar identidade, revisão, lineage, constraints e evidência aplicáveis sem obrigar cada etapa a conhecer a implementação interna de todas as anteriores.

## D

**Durable history / histórico durável** — histórico suficiente para preservar progressão, tentativas, waits, efeitos e demais fatos necessários para retomada, reconciliação, auditoria, replay ou migração conforme o contrato aplicável. Não é sinônimo de log técnico infinito.

**Durable wait / espera durável** — espera cujo significado e identidade precisam sobreviver a restart, substituição de worker e passagem do tempo, como aguardar sinal, prazo, tarefa humana ou condição externa.

## E

**Edge case** — situação válida ou possível situada em limites, combinações incomuns ou condições difíceis do comportamento esperado. Não é necessariamente um bug; serve para testar se as premissas continuam verdadeiras fora do caminho comum.

**Evidence / evidência** — informação usada para sustentar uma afirmação. Para ser confiável arquiteturalmente, precisa ser qualificada quanto a sujeito, origem, revisão, aplicabilidade, atualidade, cobertura e incerteza quando relevantes.

**Executable graph / grafo executável** — representação em nós e relações cuja estrutura participa da execução de comportamento, em vez de servir apenas como diagrama explicativo. Sua validade depende não só de conectividade, mas também de estados, guards, tipos, revisões, constraints, autoridade e efeitos aplicáveis.

## G

**Guard / guarda** — condição que torna uma transição, caminho ou ação elegível dentro de um processo/grafo. Uma guarda precisa preservar a semântica dos valores, regras e revisões que utiliza; expressão sintaticamente válida não garante decisão semanticamente válida.

## H

**Happy path** — percurso em que entradas, dependências e participantes se comportam como esperado. É necessário, mas insuficiente para demonstrar robustez.

**Human task / tarefa humana** — unidade durável de trabalho em que uma execução aguarda ação ou julgamento humano. Workflow possui seu lifecycle dentro da execução; quem pode vê-la, reivindicá-la ou concluí-la continua sujeito ao owner de autorização/policy.

## I

**Idempotência** — propriedade segundo a qual repetir uma operação dentro das condições qualificadas do seu contrato não produz efeitos adicionais indevidos. Não deve ser presumida universalmente nem apenas porque existe uma chave de idempotência.

**INCONCLUSIVE** — resultado explícito indicando evidência insuficiente para concluir PASS/FAIL, ALLOW/DENY ou outra afirmação forte. Evita transformar ausência de conhecimento em certeza.

**Interaction intent / intento de interação** — intenção expressa por uma interação de UI, como clicar, arrastar, submeter ou selecionar. Não é equivalente, por si só, a autorização, transição canônica ou efeito aplicado; deve atravessar os boundaries responsáveis por essas decisões.

## L

**Lineage / linhagem** — relação rastreável entre uma definição, dado, artefato ou evidência e suas origens, transformações, revisões, correções ou adoções. Ajuda a explicar de onde veio uma verdade e quais derivados podem ser afetados por uma mudança.

**Lossy / com perda** — transformação ou mapeamento que não preserva integralmente a semântica da origem. Uma normalização lossy precisa permanecer explícita; não deve ser apresentada como equivalência perfeita.

**Low-code** — abordagem de autoria que usa modelos, componentes, configurações e relações de alto nível para reduzir código manual. No contexto G2, low-code não elimina semantic owners, autoridade, revisionamento ou constraints; a interface pode simplificar sua exposição sem apagá-los.

## M

**Minimal runtime closure** — fechamento mínimo de dependências que um workload precisa reter para executar corretamente sob determinado perfil operacional. “Mínimo” não autoriza remover policy, trust, configuração, schema ou outros requisitos necessários apenas para reduzir tamanho.

## P

**Provider** — sistema, serviço, engine ou mecanismo especializado que realiza parte de uma capability. O SB procura delegar mecânicas maduras sem entregar automaticamente ao provider a propriedade da semântica empresarial.

## Q

**Qualification / qualificação** — avaliação de se uma realização/provider satisfaz os requisitos relevantes sob um escopo, revisões e evidências determinados. Pode resultar em `SUPPORTED`, `PARTIAL`, `UNSUPPORTED` ou `INCONCLUSIVE`; não é sinônimo de admissão.

**Qualified evidence envelope** — estrutura conceitual que preserva contexto necessário para interpretar evidência: provenance/origem, produtor e revisão, sujeito, aplicabilidade, freshness/currentness, cobertura, incerteza e horizonte relevante.

## R

**Reconcile-before-retry** — princípio segundo o qual um efeito mutante `UNKNOWN` deve ser reconciliado antes de uma repetição potencialmente insegura, salvo quando o contrato qualificado da operação prova que a repetição é segura.

**Redrive** — nova tentativa governada de processamento de trabalho previamente falho, pendente ou desviado, preservando vínculo com as tentativas e disposições anteriores em vez de apagar a história.

**Replay** — reconstrução ou reexecução controlada a partir de histórico/inputs registrados sob um contrato de determinismo e revisão. Replay de lógica não autoriza repetir automaticamente side effects externos.

**Residual cohort / cohort residual** — população pertencente a uma realização/revisão anterior que ainda pode produzir efeitos relevantes ou autoritativos após um cutover, como sessões, workers, caches, callbacks, credenciais, filas ou clientes antigos.

**Retained runtime closure / closure retida de runtime** — conjunto de artefatos, dependências runtime, configuração, trust, autoridade/policy local, schema/data compatibility, bindings e demais requisitos que precisam permanecer disponíveis para a operação permitida de um runtime, inclusive durante um horizonte desconectado quando esse perfil for suportado.

**Revision / revisão** — identidade de uma evolução de definição, política, schema, fórmula, artefato ou outro elemento. Diferentes elementos podem evoluir independentemente, razão pela qual a pesquisa trabalha também com revision vectors.

**Revision vector / vetor de revisões** — conjunto das revisões relevantes de dimensões que evoluem independentemente. Evita presumir que uma única versão global descreva corretamente processo, schema, política, fórmula, runtime e provider ao mesmo tempo.

**Runtime** — parte do sistema materializado que executa trabalho em operação. A visão G2 busca autonomia de runtime sem exigir dependência permanente do Builder para toda execução.

**Runtime autonomy / autonomia de runtime** — capacidade de um runtime continuar operando dentro de uma retained closure e horizonte explicitamente qualificados sem depender continuamente do control plane do Builder. Não significa isolamento, operação offline eterna nem licença para inventar autoridade/currentness ausentes.

## S

**Semantic god-object** — antipadrão no qual uma camada dita “universal” passa a decidir significados, políticas e estados pertencentes a múltiplos semantic owners. A UCA G2 deve compartilhar estruturas reutilizáveis sem assumir essa autoridade.

**Semantic owner** — capability ou domínio responsável pelo significado canônico e pelas invariantes de determinada informação/decisão. Um consumidor pode observar ou projetar esse significado sem automaticamente se tornar seu dono.

**Signal / sinal** — indício que pode justificar investigação ou avaliação. `Signal != ConfirmedConflict`: um detector não deve converter suspeita em fato sem evidência suficiente.

**Stale / obsoleto para o contexto** — informação, proposta ou evidência que pode ter sido válida em uma revisão ou instante anterior, mas não pode ser assumida como atual para a decisão presente sem requalificação.

**Station** — escopo organizacional/governado dentro da hierarquia `Enterprise → Station → Role → Person`, usado na pesquisa G2 para exposição de capabilities, administração delegada e limites de autoridade.

## T

**Timer durável** — intenção temporal persistente cuja identidade e semântica sobrevivem a restart/substituição de worker; não é simplesmente manter uma thread dormindo.

**Topology collapse / colapso de topologia** — realização em que múltiplas capabilities ou owners compartilham processo, host, banco ou outro substrato físico para reduzir complexidade operacional. Não implica colapso de identidade semântica, lifecycle ou autoridade.

**Transitive dependency closure / fechamento transitivo de dependências** — operação de incluir recursivamente as dependências necessárias das dependências até que o conjunto esteja fechado para o perfil considerado, respeitando versões, condições e constraints aplicáveis.

## U

**Universal Capability Architecture (UCA)** — owner dos menores contratos estruturais reutilizáveis necessários para capabilities independentes se comporem, como formas de identidade, revisão, evidência, effect disposition e support vector. Não é dona dos predicados de negócio carregados por essas estruturas.

## V

**Version skew** — coexistência ou interação entre componentes/revisões que não estão na mesma versão. Pode ser legítima ou perigosa dependendo das relações de compatibilidade.

## W

**Workflow instance / instância de workflow** — identidade de uma execução concreta de uma definição executável admitida. É distinta de worker ID, container ID, provider run ID e da própria definição do processo.
