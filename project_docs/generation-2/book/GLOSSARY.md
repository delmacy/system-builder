# Glossário comentado — Generation 2

Este glossário pertence à camada didática do livro. Definições autoritativas continuam nos artefatos de pesquisa, síntese e planejamento.

## A

**Admission / admissão** — decisão de que uma realização já qualificada pode ser usada em determinado escopo sob as políticas aplicáveis. Capacidade técnica não implica admissão.

**Alert / alerta** — transição ou avaliação operacional qualificada que requer atenção segundo regra/perfil aplicável. Alert não é sinônimo de incident, notification delivery, acknowledgement humano nem resolução da condição subjacente.

**Anti-lock-in** — orientação para impedir que a semântica canônica do System Builder dependa desnecessariamente de um fornecedor, protocolo ou mecanismo específico. Não significa evitar providers; significa preservar a possibilidade de substituí-los sem redefinir o negócio.

**APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN** — disposições usadas para descrever o que se sabe sobre um efeito, especialmente uma mutação remota. `UNKNOWN` é importante quando não há evidência suficiente para afirmar se o efeito ocorreu.

**Assurance / garantia de autenticação** — grau e contexto de confiança que acompanham uma autenticação, incluindo método, fatores, freshness/currentness e demais evidências relevantes. Não deve ser reduzido a “usuário está logado”.

**Authentication / autenticação** — processo de estabelecer, com evidência qualificada, que um principal corresponde à identidade apresentada em determinado contexto. Autenticação responde “quem/que principal é este e como isso foi comprovado?”, não “o que ele pode fazer?”.

**Authorization / autorização** — avaliação de se um principal pode executar uma ação sobre um recurso em determinado escopo, sob políticas, delegações, relações organizacionais, revisões e evidências aplicáveis. Autenticação bem-sucedida não implica autorização.

## B

**Binding** — vínculo qualificado, revisionado e scoped entre uma necessidade/capability do SB e uma realização/provider admitido. Um binding não torna automaticamente todos os recursos do provider parte da semântica canônica e não é apenas uma connection string.

**Break-glass** — mecanismo de autoridade emergencial explicitamente governado, limitado por escopo, duração, origem, evidência e revisão. Não significa “ignorar todas as políticas”; é uma forma especializada de grant temporário.

**Brownfield** — contexto em que a organização já possui sistemas, dados, integrações e processos que precisam coexistir com a evolução. Descobrir uma estrutura brownfield não significa adotá-la automaticamente como semântica canônica.

**Build closure / fechamento de build** — conjunto transitivamente fechado de materiais, dependências, recipe/toolchain e inputs declarados necessários para produzir um output sob um perfil de build. Não é a mesma coisa que retained runtime closure.

## C

**CalculationEvidence / evidência de cálculo** — evidência suficiente para interpretar como um resultado foi produzido, incluindo quando material identidade/revisão da fórmula, revisões dos inputs/contexto, políticas de rounding/temporalidade, semantic profile do provider e disposição de falha/limite.

**CalculationResult / resultado de cálculo** — resultado tipado de uma avaliação concreta. Não é sinônimo da própria fórmula nem se torna automaticamente StoredFact canônico.

**Canvas** — superfície visual de autoria/composição usada para organizar componentes, nós, relações, formulários, ações ou partes de processos. No modelo didático G2, Canvas é meio de expressão e projeção; não se torna automaticamente a fonte canônica de processo, autorização, dados ou efeito.

**Capability** — capacidade semanticamente coerente do sistema, com problema e responsabilidades próprios. Não é sinônimo de módulo de UI, pacote de código ou produto externo.

**Capability laundering / lavagem de capability** — perda ou enfraquecimento de uma garantia material ao atravessar uma cadeia de providers, fallbacks, adapters ou composições localmente aceitas, enquanto o conjunto continua sendo apresentado como se preservasse a capability original por inteiro.

**Capability/Support Vector** — representação multidimensional que compara requisitos de uma capability com o suporte de uma realização/provider em dimensões relevantes, como semântica, limites, falhas, ordering, locality, lifecycle, offline e evidência. Evita reduzir portabilidade a `supported=true`.

**Canonical / canônico** — aquilo que o SB reconhece como representação ou verdade normativa dentro de um domínio. Um dado externo pode ser evidência sem ser automaticamente canônico.

**Closure / fechamento** — conjunto que inclui um elemento e todas as dependências transitivas necessárias sob um perfil declarado. Uma closure correta precisa considerar condições, revisões e dependências que influenciam a execução ou materialização; não é apenas uma lista de imports diretos.

**Coexistência** — período ou condição em que múltiplas revisões, cohorts, providers, runtimes ou representações permanecem simultaneamente relevantes durante evolução/migração.

**Common qualified cut / corte comum qualificado** — evidência de que múltiplos sistemas, sinks ou populações podem ser interpretados sob um estado conjunto coerente em revisões/aplicabilidades relevantes. Sinks individualmente válidos ou “recentes” não provam, por si só, que existe um estado composto verdadeiro.

**Composition admissibility / admissibilidade da composição** — avaliação de se uma combinação de primitivas, ações, regras ou nós respeita as constraints materiais aplicáveis ao conjunto. É diferente de validar cada primitiva isoladamente e também não substitui autorização no momento da atuação ou qualificação do efeito.

**ConflictInstance** — ocorrência concreta, observada ou reproduzível, de um conflito em um sistema/revisão/contexto específicos.

**ConflictPattern** — descrição reutilizável de uma composição potencialmente incompatível. Não prova, por si só, que um defeito está manifestado.

**Confused deputy** — situação em que um componente com autoridade elevada é induzido a usar essa autoridade em favor de um solicitante que não possui o mesmo poder. A prevenção exige preservar quem pediu, em nome de quem se atua e qual delegação/escopo autoriza o efeito.

**Content identity / identidade de conteúdo** — identidade usada para caracterizar uma revisão concreta de conteúdo, frequentemente por digest/hash quando byte-level equivalence importa. Não é automaticamente a identidade canônica do documento ou objeto empresarial.

**Coverage / cobertura** — qualificação de qual população, cohort, região, tenant, Station, provider, revisão, rota, dispositivo ou horizonte foi realmente observado. Evidência correta para um subconjunto não autoriza inferir automaticamente verdade global.

**Cumulative context / contexto acumulado** — contexto mínimo que precisa atravessar boundaries sucessivas para preservar identidade, revisão, lineage, constraints e evidência aplicáveis sem obrigar cada etapa a conhecer a implementação interna de todas as anteriores.

**Currentness / atualidade qualificada** — propriedade de uma evidência ou decisão permanecer suficientemente atual para o uso em questão. Uma afirmação historicamente válida pode tornar-se stale após mudança de policy, membership, binding, trust, credential ou outra revisão aplicável.

## D

**Delegation envelope / envelope de delegação** — contrato que delimita a autoridade que pode ser delegada: origem, destinatário, ações/recursos, scope, limites, validade, subdelegação e demais constraints. Delegação não é transitiva por padrão.

**Deployment generation / geração de deployment** — revisão identificável da intenção operacional que relaciona uma release e seu perfil/bindings/configuração à realização de runtime que deve ser provada. Evidência de uma geração anterior não prova automaticamente a geração desejada atual.

**DerivedValue / valor derivado** — valor obtido por cálculo a partir de outros valores, regras e contexto. Pode ser virtual, cacheado ou materializado; sua existência matemática não lhe concede automaticamente autoridade para tornar-se fato canônico.

**Desired state / estado desejado** — intenção operacional canônica que descreve o estado que um controller/runtime deve realizar. É distinta de observações do provider e do estado efetivamente qualificado para consumidores.

**Disposition / disposição governada** — transição pela qual uma população de dados alcança um estado final permitido sob obrigações aplicáveis, como destruição, preservação, arquivamento ou outra destinação qualificada. Elegibilidade para disposition e execução física da disposition são fatos distintos.

**Durable history / histórico durável** — histórico suficiente para preservar progressão, tentativas, waits, efeitos e demais fatos necessários para retomada, reconciliação, auditoria, replay ou migração conforme o contrato aplicável. Não é sinônimo de log técnico infinito.

**Durable wait / espera durável** — espera cujo significado e identidade precisam sobreviver a restart, substituição de worker e passagem do tempo, como aguardar sinal, prazo, tarefa humana ou condição externa.

## E

**Edge case** — situação válida ou possível situada em limites, combinações incomuns ou condições difíceis do comportamento esperado. Não é necessariamente um bug; serve para testar se as premissas continuam verdadeiras fora do caminho comum.

**Effective state / estado efetivo** — estado qualificado que realmente satisfaz a intenção operacional aplicável para os consumidores relevantes, considerando readiness, dependências, tráfego, currentness e demais evidências exigidas. Não é sinônimo de recurso simplesmente existente ou “running”.

**Environment / Operational Profile** — contexto operacional revisionado que reúne requisitos portáveis de runtime, configuração, bindings, trust, placement/residency, conectividade e outros constraints aplicáveis. O SB atual evidencia um `EnvironmentProfile` mais estreito; um Operational Profile geral permanece direção G2, não implementação já presumida.

**EvaluationContext / contexto de avaliação** — conjunto explicitamente admitido de inputs, revisões, unidades/moedas, contexto temporal e funções disponíveis a uma avaliação. Não equivale a acesso irrestrito ao sistema.

**EvaluationPolicy / política de avaliação** — limites e regras operacionais da avaliação, incluindo quando relevante tamanho/profundidade de expressão, cardinalidade de inputs, custo, tempo, memória, DAG, bulk cardinality e comportamento de cancelamento/falha.

**Evidence / evidência** — informação usada para sustentar uma afirmação. Para ser confiável arquiteturalmente, precisa ser qualificada quanto a sujeito, origem, revisão, aplicabilidade, atualidade, cobertura e incerteza quando relevantes.

**Executable graph / grafo executável** — representação em nós e relações cuja estrutura participa da execução de comportamento, em vez de servir apenas como diagrama explicativo. Sua validade depende não só de conectividade, mas também de estados, guards, tipos, revisões, constraints, autoridade e efeitos aplicáveis.

## F

**Fallback qualification / qualificação de fallback** — verificação de que um provider ou caminho alternativo continua satisfazendo os requisitos semânticos, de autoridade, policy, estado e evidência aplicáveis no momento da troca. Fallback configurado não implica fallback qualificado.

**FormulaDefinition / definição de fórmula** — definição canônica/revisionável do que deve ser calculado sob determinado semantic owner. É distinta de uma execução concreta e de IDs/ASTs internos de provider.

**FormulaDependencyGraph / grafo de dependências de fórmulas** — grafo que relaciona fórmulas e seus inputs/derivados para ordenar recomputação, detectar ciclos e estimar o blast radius de mudanças.

**FormulaRevision / revisão de fórmula** — identidade imutável/revisionada de uma evolução de uma FormulaDefinition. A revisão atual não substitui silenciosamente a revisão historicamente aplicável.

## G

**Governed population / população governada** — conjunto identificado de dados, cópias, replicas, backups, indexes, exports, caches, derivados ou downstream consumers que permanecem sujeitos a uma obrigação de privacy, retenção, hold, residency ou disposition.

**Guard / guarda** — condição que torna uma transição, caminho ou ação elegível dentro de um processo/grafo. Uma guarda precisa preservar a semântica dos valores, regras e revisões que utiliza; expressão sintaticamente válida não garante decisão semanticamente válida.

## H

**Happy path** — percurso em que entradas, dependências e participantes se comportam como esperado. É necessário, mas insuficiente para demonstrar robustez.

**HistoricalApplicability / aplicabilidade histórica** — vínculo que determina quais revisões de fórmula, inputs e contexto eram aplicáveis a um cálculo/registro histórico. Evita usar implicitamente `latest` como regra de replay.

**Human task / tarefa humana** — unidade durável de trabalho em que uma execução aguarda ação ou julgamento humano. Workflow possui seu lifecycle dentro da execução; quem pode vê-la, reivindicá-la ou concluí-la continua sujeito ao owner de autorização/policy.

## I

**Idempotência** — propriedade segundo a qual repetir uma operação dentro das condições qualificadas do seu contrato não produz efeitos adicionais indevidos. Não deve ser presumida universalmente nem apenas porque existe uma chave de idempotência.

**Incident / incidente** — registro operacional governado para uma condição material de serviço/operação que exige resposta coordenada. Sua identidade/lifecycle são distintos de provider ticket IDs, alert state, notification delivery e da própria condição subjacente.

**INCONCLUSIVE** — resultado explícito indicando evidência insuficiente para concluir PASS/FAIL, ALLOW/DENY ou outra afirmação forte. Evita transformar ausência de conhecimento em certeza.

**Interaction intent / intento de interação** — intenção expressa por uma interação de UI, como clicar, arrastar, submeter ou selecionar. Não é equivalente, por si só, a autorização, transição canônica ou efeito aplicado; deve atravessar os boundaries responsáveis por essas decisões.

## L

**Least privilege / menor privilégio** — princípio segundo o qual pessoa, serviço, processo ou automação deve receber apenas a autoridade necessária ao trabalho, no scope e horizonte necessários. Seu objetivo é limitar blast radius sem inviabilizar responsabilidades legítimas.

**Legal hold / retenção legal ou investigativa** — obrigação governada de preservação que pode impedir destruição ou outra disposition mesmo quando uma regra de retenção comum tenha expirado. Sua liberação não implica automaticamente elegibilidade de delete; exige nova qualificação das obrigações restantes.

**Lineage / linhagem** — relação rastreável entre uma definição, dado, artefato ou evidência e suas origens, transformações, revisões, correções ou adoções. Ajuda a explicar de onde veio uma verdade e quais derivados podem ser afetados por uma mudança.

**Lossy / com perda** — transformação ou mapeamento que não preserva integralmente a semântica da origem. Uma normalização lossy precisa permanecer explícita; não deve ser apresentada como equivalência perfeita.

**Lowest-common-denominator abstraction / abstração do menor denominador comum** — abstração que tenta uniformizar providers expondo apenas o subconjunto mínimo comum e, com isso, pode esconder garantias ou diferenças semanticamente materiais. Portabilidade não deve ser obtida fingindo que capacidades ausentes são equivalentes.

**Low-code** — abordagem de autoria que usa modelos, componentes, configurações e relações de alto nível para reduzir código manual. No contexto G2, low-code não elimina semantic owners, autoridade, revisionamento ou constraints; a interface pode simplificar sua exposição sem apagá-los.

## M

**MaterializationPolicy / política de materialização** — política que define se, quando e sob quais condições um DerivedValue é apenas virtual, cacheado, persistido ou preservado como snapshot histórico. Materialização não transfere automaticamente semantic ownership.

**Minimal runtime closure** — fechamento mínimo de dependências que um workload precisa reter para executar corretamente sob determinado perfil operacional. “Mínimo” não autoriza remover policy, trust, configuração, schema ou outros requisitos necessários apenas para reduzir tamanho.

**Money / CurrencyAmount** — valor monetário tipado que preserva magnitude e identidade de moeda. Um decimal sem currency não é semanticamente equivalente a dinheiro.

## O

**Observed state / estado observado** — evidência disponível sobre a realização atualmente percebida, como recursos, processos, replicas ou routing vistos pelo sistema/provider. Pode estar stale ou incompleta e não deve ser confundida com desired state nem effective state.

**Offline authorization closure** — conjunto qualificado de políticas, relações, evidências e limites que um runtime pode reter para continuar decidindo certas operações durante desconexão/degradação. Não autoriza ampliar privilégio quando currentness necessária deixa de existir.

## P

**Provider** — sistema, serviço, engine ou mecanismo especializado que realiza parte de uma capability. O SB procura delegar mecânicas maduras sem entregar automaticamente ao provider a propriedade da semântica empresarial.

**Provider portability / portabilidade de provider** — capacidade qualificada de substituir, coexistir ou migrar entre realizações preservando as semânticas requeridas. É dependente de support vectors, estado, identidade, evidência, lifecycle e obrigações; não equivale a hot swap universal.

**Provider withdrawal / retirada de provider** — estado governado em que uma realização antiga deixa de poder produzir novos efeitos autoritativos para o escopo aplicável após cutover, reconciliação e drainage dos cohorts relevantes, preservando lineage histórica necessária.

**ProviderSemanticProfile / perfil semântico de provider** — declaração qualificada das semânticas que um evaluator/provider suporta em dimensões como números, falhas, money/rates, units, temporalidade, dependências, histórico, segurança, resource bounds, evidência e runtime mode.

## Q

**Qualification / qualificação** — avaliação de se uma realização/provider satisfaz os requisitos relevantes sob um escopo, revisões e evidências determinados. Pode resultar em `SUPPORTED`, `PARTIAL`, `UNSUPPORTED` ou `INCONCLUSIVE`; não é sinônimo de admissão.

**Qualified evidence envelope** — estrutura conceitual que preserva contexto necessário para interpretar evidência: provenance/origem, produtor e revisão, sujeito, aplicabilidade, freshness/currentness, cobertura, incerteza e horizonte relevante.

## R

**Readiness / prontidão** — afirmação qualificada de que um workload está apto a assumir o trabalho pretendido sob critérios aplicáveis. Processo vivo ou provider readiness isolados podem ser evidências, mas não provam necessariamente dependências, tráfego e consumer-effective service.

**Reconcile-before-retry** — princípio segundo o qual um efeito mutante `UNKNOWN` deve ser reconciliado antes de uma repetição potencialmente insegura, salvo quando o contrato qualificado da operação prova que a repetição é segura.

**Redrive** — nova tentativa governada de processamento de trabalho previamente falho, pendente ou desviado, preservando vínculo com as tentativas e disposições anteriores em vez de apagar a história.

**Replay** — reconstrução ou reexecução controlada a partir de histórico/inputs registrados sob um contrato de determinismo e revisão. Replay de lógica não autoriza repetir automaticamente side effects externos.

**Residual authority cohort / cohort residual de autoridade** — sessões, tokens, caches, workers, replicas, grants ou outros consumidores de autoridade antiga que ainda podem produzir efeitos após revogação, expiração ou mudança de policy. Precisam ser drenados, expirados, revogados ou requalificados para que a mudança seja efetivamente convergente.

**Residual cohort / cohort residual** — população pertencente a uma realização/revisão anterior que ainda pode produzir efeitos relevantes ou autoritativos após um cutover, como sessões, workers, caches, callbacks, credenciais, filas ou clientes antigos.

**Residual governed copy / cópia governada residual** — cópia de dado ou conteúdo que permanece materialmente existente, acessível ou sujeita a obrigação após cutover, logical deletion, migration ou disposition parcial. Não deixa de ser governada só porque a referência principal foi removida.

**Residual provider cohort / cohort residual de provider** — subconjunto de sessões, workers, callbacks, subscriptions, credentials, jobs, queues, mappings, in-flight operations ou clientes ligados a um provider anterior que ainda pode produzir efeitos depois do cutover. Trocar routing não prova drainage completo desse cohort.

**Residency / residência de dados** — conjunto de restrições qualificadas sobre onde dados e realizações relevantes podem residir ou ser processados. Não deve ser reduzido a comparar nomes de regiões de provider; backup, metadata, restore, replicas e derivados podem ter semantics diferentes.

**Retention / retenção** — obrigação ou política de preservar determinada informação por período, condição ou escopo aplicável. Expiração de retention não implica automaticamente autorização ou elegibilidade para deletion.

**Retained runtime closure / closure retida de runtime** — conjunto de artefatos, dependências runtime, configuração, trust, autoridade/policy local, schema/data compatibility, bindings e demais requisitos que precisam permanecer disponíveis para a operação permitida de um runtime, inclusive durante um horizonte desconectado quando esse perfil for suportado.

**Revision / revisão** — identidade de uma evolução de definição, política, schema, fórmula, artefato ou outro elemento. Diferentes elementos podem evoluir independentemente, razão pela qual a pesquisa trabalha também com revision vectors.

**Revision vector / vetor de revisões** — conjunto das revisões relevantes de dimensões que evoluem independentemente. Evita presumir que uma única versão global descreva corretamente processo, schema, política, fórmula, runtime e provider ao mesmo tempo.

**Rollout** — progressão governada de uma deployment generation por stages/cohorts até convergência, pausa, aborto ou outra disposição. Estratégias como rolling, canary e blue/green são realizações possíveis, não a definição universal do conceito.

**RoundingPolicy / política de arredondamento** — regra explícita de escala, ponto e modo de arredondamento aplicável a um cálculo. Não deve ser herdada silenciosamente do provider quando material para o negócio.

**Runtime** — parte do sistema materializado que executa trabalho em operação. A visão G2 busca autonomia de runtime sem exigir dependência permanente do Builder para toda execução.

**Runtime autonomy / autonomia de runtime** — capacidade de um runtime continuar operando dentro de uma retained closure e horizonte explicitamente qualificados sem depender continuamente do control plane do Builder. Não significa isolamento, operação offline eterna nem licença para inventar autoridade/currentness ausentes.

## S

**Schema** — contrato estrutural que descreve entidades, campos, relações, tipos e constraints de uma representação de dados. Schema declarado, estrutura materializada pelo provider, população migrada e compatibilidade efetiva dos consumidores são fatos distintos.

**Semantic god-object** — antipadrão no qual uma camada dita “universal” passa a decidir significados, políticas e estados pertencentes a múltiplos semantic owners. A UCA G2 deve compartilhar estruturas reutilizáveis sem assumir essa autoridade.

**Semantic owner** — capability ou domínio responsável pelo significado canônico e pelas invariantes de determinada informação/decisão. Um consumidor pode observar ou projetar esse significado sem automaticamente se tornar seu dono.

**Separation of Duty (SoD) / separação de funções** — controle que impede uma única pessoa ou principal efetivo de acumular responsabilidades incompatíveis, como solicitar e aprovar o mesmo pagamento. Pode depender do histórico e da composição entre processos, não apenas de Roles estáticos.

**Signal / sinal** — indício que pode justificar investigação ou avaliação. `Signal != ConfirmedConflict`: um detector não deve converter suspeita em fato sem evidência suficiente.

**SLI (Service Level Indicator) / indicador de nível de serviço** — medida operacional revisionada usada para avaliar um aspecto de serviço sob população, janela, exclusions e measurement profile explícitos. O valor do indicador não é automaticamente uma verdade empresarial universal.

**SLO (Service Level Objective) / objetivo de nível de serviço** — alvo definido sobre um SLI para determinado scope e horizonte. Observability pode possuir a semântica de medição/avaliação do SLO sem se tornar dona da obrigação empresarial ou governança que motivou o objetivo.

**Stale / obsoleto para o contexto** — informação, proposta ou evidência que pode ter sido válida em uma revisão ou instante anterior, mas não pode ser assumida como atual para a decisão presente sem requalificação.

**Station** — escopo organizacional/governado dentro da hierarquia `Enterprise → Station → Role → Person`, usado na pesquisa G2 para exposição de capabilities, administração delegada e limites de autoridade.

**StoredFact / fato armazenado canônico** — fato persistido reconhecido por seu semantic owner como verdade canônica dentro de determinado escopo. Não é sinônimo de qualquer valor gravado em banco; um DerivedValue só se torna StoredFact por materialização governada.

**Support qualification / qualificação de suporte** — comparação evidence-backed entre requirements e support vector de uma realização sob escopo, revisão e currentness definidos. Nome de feature, reachability ou compatibilidade de protocolo não bastam para provar suporte semântico.

## T

**Telemetry / telemetria** — dados produzidos/coletados para observar comportamento operacional, incluindo realizações como metrics, logs, traces e events. Telemetria torna-se evidência útil quando preserva qualificadores suficientes de identidade, provenance, revisão, scope, tempo, coverage e incerteza.

**Timer durável** — intenção temporal persistente cuja identidade e semântica sobrevivem a restart/substituição de worker; não é simplesmente manter uma thread dormindo.

**TOCTOU (time of check to time of use)** — classe de problema em que uma condição é verificada em um instante e muda antes do uso. Em Provider/Binding, qualificação, admission, policy, quota, binding ou currentness podem mudar entre check e actuation.

**Topology collapse / colapso de topologia** — realização em que múltiplas capabilities ou owners compartilham processo, host, banco ou outro substrato físico para reduzir complexidade operacional. Não implica colapso de identidade semântica, lifecycle ou autoridade.

**Traffic effectiveness / efetividade de tráfego** — evidência de que os consumidores pretendidos estão efetivamente sendo encaminhados para a geração/target corretos. Uma configuração de rota aceita ou observada não prova, sozinha, comportamento de tráfego real.

**Transitive dependency closure / fechamento transitivo de dependências** — operação de incluir recursivamente as dependências necessárias das dependências até que o conjunto esteja fechado para o perfil considerado, respeitando versões, condições e constraints aplicáveis.

**TypedValue / valor tipado** — valor cujo tipo semântico relevante acompanha a magnitude/conteúdo, permitindo distinguir, por exemplo, money, unit, duration, percentage, null/unknown/error e outros casos que um escalar cru não expressa adequadamente.

## U

**UnitOfMeasure / unidade de medida** — identidade da unidade associada a uma quantidade, permitindo validar compatibilidade dimensional e conversões qualificadas em vez de tratar todos os números como escalares intercambiáveis.

**Universal Capability Architecture (UCA)** — owner dos menores contratos estruturais reutilizáveis necessários para capabilities independentes se comporem, como formas de identidade, revisão, evidência, effect disposition e support vector. Não é dona dos predicados de negócio carregados por essas estruturas.

## V

**Version skew** — coexistência ou interação entre componentes/revisões que não estão na mesma versão. Pode ser legítima ou perigosa dependendo das relações de compatibilidade.

## W

**Workflow instance / instância de workflow** — identidade de uma execução concreta de uma definição executável admitida. É distinta de worker ID, container ID, provider run ID e da própria definição do processo.

**Workload** — unidade operacional que executa trabalho sob um perfil de runtime. Pode ser realizada como processo, container, VM, função, job, worker ou outro mecanismo; a realização concreta não deve ser confundida com a identidade semântica do workload.
