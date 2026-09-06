# Apêndice B — Operabilidade: da feature pronta ao sistema operável

> **Status editorial:** síntese didática de material `EM PESQUISA`. Este apêndice não decide arquitetura, não cria uma 29ª capability e não substitui os artefatos autoritativos.
>
> **Fontes principais:** `project_docs/generation-2/research/OPERABILITY_ELICITATION_LENS_RESEARCH.md`, `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` e artefatos de Planning A/B já referenciados pelos capítulos do livro.

## O problema: funcionar não é o mesmo que poder ser operado

Uma empresa pode receber uma funcionalidade que, em demonstração, parece completa: a OS é aberta, o técnico recebe a tarefa, o estoque é consultado, um e-mail é enviado e o dashboard mostra o resultado. Ainda assim, perguntas muito simples podem permanecer sem resposta.

Quem percebe que a fila de OS parou de andar? Quanto atraso é aceitável? Quem recebe o alerta? O que acontece se o provedor de e-mail estiver fora? Como sabemos se um timeout significou que a mensagem não foi enviada ou apenas que a confirmação não voltou? Qual é a capacidade sustentável antes de formar backlog? Como recuperar o serviço? Como provar que a recuperação também restaurou a verdade empresarial, e não apenas que o processo voltou a responder HTTP 200?

Essa diferença é o centro da **operabilidade**: não basta especificar o que o sistema faz quando tudo está normal. É preciso explicitar como ele será observado, sustentado, diagnosticado, recuperado e evoluído quando estiver sob carga, parcialmente degradado, desatualizado ou em mudança.

A pesquisa da Generation 2 introduziu uma separação particularmente útil:

```text
feature completeness
    != production readiness
    != runtime health
    != business convergence
```

Essas quatro coisas podem se relacionar, mas não são sinônimas.

- **Feature completeness** pergunta se a função prevista foi especificada/entregue no escopo considerado.
- **Production readiness** pergunta se há semântica e evidência suficientes para operar aquela função com responsabilidade.
- **Runtime health** descreve o estado observado de uma realização em execução em determinado momento.
- **Business convergence** pergunta se, depois de falhas, atrasos, retries, restores ou reconciliações, a realidade empresarial chegou ao estado que deveria representar.

`EM PESQUISA`: a Operability Elicitation Lens é uma lente transversal de perguntas. Ela não é, por si só, uma nova capability canônica nem uma autorização para criar mecanismos automáticos de controle.

## Um exemplo: a OS está “funcionando”

Considere um fluxo simples:

```text
Solicitação
   ↓
OS criada
   ↓
Técnico designado
   ↓
Peça reservada
   ↓
Serviço executado
   ↓
OS encerrada
```

O happy path pode estar impecável. A operabilidade começa justamente onde o happy path deixa perguntas escondidas.

Se a reserva de peça demora quarenta minutos, isso é normal ou incidente? Se o estoque responder timeout, é seguro tentar de novo? Se houver 5.000 OS acumuladas depois de uma indisponibilidade, em quanto tempo o sistema consegue drenar a fila? Se o dashboard estiver verde porque não recebe eventos há duas horas, verde significa saudável ou significa ausência de informação? Se o técnico concluiu fisicamente o serviço enquanto o sistema estava offline, como ocorre a reconciliação? Se um restore reintroduzir uma OS que já havia sido encerrada, qual evidência impede dupla execução?

A mesma feature continua existindo. O que mudou foi a profundidade da pergunta.

## Produção pronta não cabe em um único número

Uma tentação comum é criar um “readiness score” como 87% e tratá-lo como resumo suficiente. A pesquisa atual evita esse colapso por padrão.

Uma capability pode ter excelente observabilidade e recuperação, mas nenhum owner operacional. Pode ter owner e alertas, mas capacidade desconhecida. Pode ter capacidade e runbook, mas não conseguir distinguir telemetria fresca de telemetria antiga. Um número único pode esconder justamente a dimensão que torna a operação insegura.

A lente em pesquisa separa dimensões como:

```text
OBSERVABILITY
OWNERSHIP
FAILURE_HANDLING
RECOVERY
CAPACITY
CURRENTNESS
SECURITY
RECONCILIATION
CHANGE_SAFETY
COST
DOCUMENTATION
```

E considera estados candidatos como `UNTOUCHED`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED` e `NA`.

Isso não é um modelo arquitetural decidido. É uma forma de raciocinar sobre cobertura. `RESOLVED`, nesse contexto, não significa “jamais falhará”; significa que a obrigação de elicitação possui resposta suficientemente explícita para o contexto da revisão. `NA` precisa de justificativa. `BLOCKED` não deve desaparecer dentro de uma média.

## As perguntas que uma feature precisa aprender a responder

### Intenção e sucesso

Antes de escolher métricas, é necessário saber o que significa sucesso. “Processo está vivo” é diferente de “OS está sendo concluída dentro do prazo”. CPU baixa não prova que clientes estão recebendo seus documentos. Uma fila vazia pode significar processamento excelente ou ingestão quebrada.

Por isso a pergunta operacional começa no resultado empresarial: qual condição precisa permanecer verdadeira e que evidência demonstra isso ponta a ponta?

### Carga, fluxo e capacidade

Todo sistema tem limites. A pergunta não é apenas quantas requisições ele suporta em benchmark, mas qual chegada de trabalho é esperada, qual taxa pode ser servida, que picos existem, onde filas se formam, quanto backlog é tolerável e quais quotas externas podem se tornar o gargalo primeiro.

Uma analogia útil é uma oficina. Ter cinco mecânicos não significa atender qualquer quantidade de carros. Se entram mais veículos por hora do que a oficina consegue concluir por hora durante tempo suficiente, forma-se fila. A analogia deixa de valer quando tratamos sistemas reais com prioridades, jobs de durações muito diferentes, dependências correlacionadas e tráfego em rajadas; por isso modelos matemáticos simples precisam declarar suas hipóteses.

### Timeout, retry e efeito ambíguo

O Capítulo 18 já mostrou que `timeout != NOT_APPLIED`. A lente de operabilidade transforma isso em pergunta obrigatória quando aplicável: depois de um resultado `UNKNOWN`, qual evidência permite reconciliar antes de repetir uma mutação? Qual identidade de idempotência existe? Qual é seu escopo e sua janela?

Sem isso, um mecanismo criado para aumentar disponibilidade pode duplicar cobrança, reserva, pagamento, mensagem ou ordem de trabalho.

### Dependências e providers

Um provider externo não se torna semantic owner porque está operacionalmente disponível. A operação precisa saber contrato/revisão esperados, lag aceitável, paginação, gaps de eventos, rate limits, expiração de token, comportamento offline e mecanismo de reconciliação.

```text
external provider state
    != canonical authority
    != physical truth
```

Essa separação fica ainda mais importante quando o SB observa sistemas físicos ou periféricos. Ver um dispositivo no Fleet não concede autoridade para atuá-lo.

### Observabilidade e currentness

Uma medição sem contexto pode ser pior que ausência de medição porque inspira confiança indevida. É necessário saber unidade, dimensão, população, tenant/site/build/deployment/provider, instante de origem, instante de observação e horizonte de frescor quando esses elementos forem relevantes.

O problema clássico é o **stale-green**: o painel continua verde, mas a evidência que sustentava o verde envelheceu. Nesse caso, a interface não está mostrando saúde; está mostrando uma conclusão antiga sem declarar sua idade.

### Owner, alerta e escalonamento

Um alerta sem alguém responsável por agir é ruído institucionalizado. Operabilidade pergunta quem possui responsabilidade durante a janela relevante, qual condição merece page imediato, qual pode virar ticket e qual deve apenas permanecer para análise.

Isso também impede que observabilidade seja confundida com autoridade. A pessoa ou sistema capaz de enxergar um problema não recebe automaticamente permissão para executar qualquer correção.

### Falha, degradação e blast radius

Nem toda falha deve derrubar tudo. Algumas operações podem ser enfileiradas, outras rejeitadas, outras continuar em modo degradado e outras precisam falhar fechadas. A pergunta é semântica: o que pode ser temporariamente perdido ou adiado sem produzir uma mentira empresarial?

O **blast radius** é a extensão do impacto. Uma falha de um provider de um cliente não deveria, sem razão explícita, paralisar todos os clientes. Mas isolamento também custa complexidade e recursos; ele é trade-off, não mágica.

### Recovery e reconciliação

“Servidor voltou” não é sinônimo de “empresa voltou ao estado correto”. Depois de restore, replay, resync ou compensation, podem existir efeitos já realizados, mensagens repetidas, sessões antigas, cohorts residuais, schemas mistos ou objetos ressuscitados por backup.

Por isso recovery termina em evidência de convergência empresarial, não apenas em disponibilidade técnica.

### Mudança e rollout

Uma nova versão cria uma fronteira temporal. Trabalho iniciado antes dela pode terminar depois dela. Providers, policies, schemas e builds podem coexistir por algum tempo. Rollback de código não necessariamente desfaz dados ou efeitos externos já realizados.

Operabilidade pergunta quem entra no canary, quais critérios permitem avançar, quais exigem abortar, que compatibilidades precisam coexistir e como cohorts antigos são identificados e drenados.

### Dados, segurança, custo e procedimentos humanos

Evidência operacional também tem ciclo de vida. Logs podem conter dados pessoais. Auditoria pode exigir retenção que entra em tensão com minimização ou exclusão. Certificados e tokens podem expirar. Custos e quotas podem pressionar decisões de capacidade. Runbooks podem contradizer uns aos outros.

Isso mostra por que operabilidade é transversal: ela atravessa capabilities sem assumir semantic ownership delas.

## Production readiness não é runtime health

Suponha que uma integração tenha owner, SLO, runbook, alertas, retry qualificado, reconciliation e procedimento de recovery. Ela pode estar muito bem preparada para produção e, neste instante, estar indisponível.

O inverso também é possível: um serviço sem owner, sem runbook e sem estratégia de restore pode estar saudável agora.

Portanto:

```text
readiness = qualidade da preparação/evidência para operar
health    = condição observada agora
```

Misturar os dois cria dashboards enganosos e gates frágeis.

## Production readiness também não é business convergence

Após um incidente, todos os pods podem estar saudáveis e as filas técnicas podem ter drenado, enquanto a empresa ainda possui três pagamentos duplicados, duas OS em estado incorreto e uma reserva de estoque aplicada apenas no provider externo.

A convergência empresarial exige reconciliar efeitos e estados relevantes. Ela pergunta se a representação do sistema e a realidade operacional voltaram a concordar dentro das regras aplicáveis.

Essa é uma das conexões mais importantes entre os Capítulos 14, 18 e 22.

## Fleet: observar não significa controlar

A visão de builds autônomos cria uma consequência operacional importante. O runtime local deve continuar obedecendo ao contrato qualificado mesmo quando SB, Observe ou Fleet estiverem indisponíveis, quando essa autonomia fizer parte do contrato.

Uma linhagem operacional útil pode conectar:

```text
CanonicalCapabilityRef
        ↓
CapabilityUse
        ↓
BuildRevision / Release
        ↓
RuntimeRealization
        ↓
Deployment
        ↓
NodeInvocation / Attempt
```

Mas agregar esses dados em Fleet não cria automaticamente comparabilidade semântica entre builds/providers, nem autoridade remota de mutação. Export failure é uma lacuna de observabilidade; não deve ser transformado automaticamente em bloqueio do workflow local.

## Como essa lente conversa com os capítulos do livro

O novo material não invalida a estrutura já publicada. Ele amplia várias leituras:

- **Capítulo 11:** deployment/runtime precisa ser entendido também por capacidade, currentness, rollout e autonomia operacional.
- **Capítulo 14:** observabilidade passa a ser explicitamente conectada a ownership, ação, frescor e recovery, e não apenas coleta de telemetria.
- **Capítulo 15:** trust e secrets precisam de expiry/revocation/currentness, recovery e reprotection operáveis.
- **Capítulo 18:** retry/UNKNOWN/idempotência tornam-se obrigações de elicitação operacional, não apenas failure mechanics.
- **Capítulo 22:** o ciclo completo não termina em “runtime está no ar”; ele precisa produzir evidência suficiente para operar, reconciliar e evoluir.
- **Capítulo 23:** futuramente, readiness pode gerar proof obligations, mas este apêndice não decide como Planning C/WBS deverão materializá-las.

Enquanto a pesquisa estiver ativa, essas ampliações devem permanecer bounded. O apêndice serve para compreensão sem converter uma hipótese de pesquisa em decisão arquitetural.

## O que você deve guardar deste apêndice

Uma feature pronta responde **o que o sistema faz**. Um sistema operável também precisa responder **como sabemos que está funcionando, quem responde quando não está, quanto trabalho suporta, como falha, como degrada, como recupera, como reconcilia e como muda com segurança**.

A Generation 2 está pesquisando operabilidade como um problema multidimensional de semântica e evidência. O ponto não é produzir um checklist infinito nem um score bonito. É impedir que “funciona no happy path” seja confundido com “está suficientemente compreendido para ser colocado e mantido em produção”.

A desigualdade que resume a ideia é:

```text
feature completeness != production readiness != runtime health != business convergence
```

E, assim como em outras partes do System Builder, a disciplina principal continua sendo não colapsar conceitos diferentes apenas porque seria conveniente representá-los com um único campo, uma única cor ou um único número.
