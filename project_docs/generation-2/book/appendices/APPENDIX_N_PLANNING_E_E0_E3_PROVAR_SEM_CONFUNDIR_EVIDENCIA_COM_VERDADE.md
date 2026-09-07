# Apêndice N — Planning E E0–E3: provar sem confundir evidência com verdade — v1.0.0

**Identidade editorial:** `APPENDIX_N`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; este texto não substitui os artefatos autoritativos de Planning E.  
**Estado autoritativo consultado:** Planning E `ACTIVE / E3 COMPLETE`; E0–E3 `DECIDED / PASS`; E4 autorizado.

## 1. O problema humano: quando “funcionou no teste” parece prova suficiente

Em projetos pequenos é comum uma frase encerrar a discussão: “testamos e funcionou”. Para uma empresa real, porém, essa frase quase sempre omite perguntas essenciais. Funcionou para qual revisão? Para qual filial? Com qual provider? Com quais permissões? Para todos os registros ou apenas para uma amostra? O efeito externo realmente aconteceu ou o serviço remoto apenas respondeu `200 OK`? O resultado continua válido depois de uma mudança de configuração? Uma Station que ficou offline também está comprovadamente correta?

A Generation 2 chegou a Planning E justamente porque pesquisa, arquitetura alvo e estratégia de migração já responderam perguntas diferentes. Pesquisa identificou problemas e restrições. Planning C decidiu como a arquitetura alvo deve se organizar. Planning D decidiu como antigo e novo podem coexistir e como a autoridade pode se mover sem criar duas verdades canônicas. Planning E pergunta algo novo:

> **Que evidência é suficiente para aceitar uma afirmação sobre o produto — e em que condições essa aceitação deixa de valer?**

Essa pergunta parece ser apenas sobre testes, mas é maior. Um teste é um mecanismo que pode produzir evidência. A evidência sustenta ou contradiz uma afirmação. A decisão de aceitação interpreta essa evidência dentro de um escopo e de uma autoridade. Confundir essas três coisas cria uma das formas mais perigosas de falsa segurança.

```text
execução de teste
      ↓
   evidência
      ↓
interpretação contra uma claim
      ↓
decisão de prova
      ↓
PASS / PARTIAL / INCONCLUSIVE / BLOCKED / FAIL / ...
```

**DECIDIDO:** `claim != evidence != proof decision`.

## 2. E0: uma constituição para provar o produto

E0 estabelece o **Product Proof System**, um sistema conceitual de provas tipadas, qualificadas por revisão, população, escopo e currentness. Isso impede que “passou uma vez” seja promovido silenciosamente para “está correto universalmente”.

Uma **Proof Obligation** é uma obrigação explícita de demonstrar uma claim. Ela precisa identificar, entre outras coisas, o sujeito da prova, semantic owner, revisões aplicáveis, população/cohort, precondições, classes de evidência exigidas, casos negativos/adversariais, regra de aceitação e condições que reabrem a prova.

Isso muda a forma de pensar testes. O teste deixa de ser a unidade semântica da garantia. Vários testes, análises estáticas, model checks, inspeções, simulações, observações operacionais e registros humanos qualificados podem contribuir para uma única obrigação. Da mesma forma, mil testes verdes podem continuar insuficientes se não cobrirem a claim correta.

### 2.1 Um exemplo simples: emissão de uma OS

Imagine uma OS que, ao ser aprovada, dispara uma solicitação a um provider externo.

Um teste automatizado pode demonstrar:

```text
POST /provider/order → 200 OK
```

Mas a claim empresarial talvez seja:

> “A ordem foi efetivamente criada uma única vez no sistema externo para a OS correta, sob autoridade válida, e seu estado foi reconciliado.”

O `200 OK` é evidência sobre a resposta do provider. Ele não prova sozinho identidade empresarial, autorização, ausência de duplicidade, efeito final ou convergência.

**DECIDIDO:** `provider ACK != semantic effect proof`.

## 3. PASS não é o único resultado intelectualmente honesto

E0 adota um vocabulário não escalar:

- `PASS`: a claim foi sustentada para o escopo declarado por evidência suficiente, atual e aplicável;
- `PARTIAL`: uma parte da população ou dimensão foi provada, outra ainda não;
- `INCONCLUSIVE`: existe evidência, mas ela é insuficiente, ambígua, conflitante ou stale;
- `BLOCKED`: falta uma precondição necessária para avaliar validamente a claim;
- `FAIL`: a evidência falsifica a claim ou viola condição obrigatória;
- `NOT_APPLICABLE`: a obrigação não se aplica, com justificativa explícita;
- `DEFERRED`: avaliação adiada de forma governada, com motivo e gatilho de retorno.

Essa taxonomia combate a tentação gerencial de transformar tudo em um percentual. Um painel com “97% verde” não pode converter uma falha crítica de autorização em aprovação geral.

**DECIDIDO:** `feature completeness != Production Readiness Coverage`.

## 4. Prova tem prazo, revisão e população

Uma prova não flutua fora do tempo. Se um provider muda sua API, uma policy é revisada, um certificado expira, uma população nova entra no rollout ou uma Station retorna depois de ficar offline, claims anteriormente aceitas podem precisar ser reabertas.

Por isso, Planning E trata **currentness** como parte da semântica da evidência. Uma evidência pode continuar historicamente verdadeira — “na revisão R, naquele momento, este teste passou” — sem continuar suficiente para a aceitação corrente.

```text
PASS(R, cohort A, provider P, horizonte H)

não implica

PASS(R+1, cohort B, provider Q, agora)
```

A consequência é importante: reabrir uma prova não apaga a história. Significa apenas que a claim corrente precisa ser qualificada novamente.

## 5. E1: provar significado, autoridade e compreensão antes de provar automação

E1 aplica a constituição de E0 a três regiões perigosas: identidade semântica, elicitação/compreensão e autoridade/trust.

### 5.1 Mesmos nomes não significam mesma identidade

Dois providers podem possuir usuários chamados `joao@empresa.com`. Dois bancos podem ter registros com chave `123`. Isso não demonstra que os objetos são semanticamente idênticos.

E1 exige prova de que a **Canonical Semantic Identity** sobrevive à troca de realização e que definition, revision, occurrence e realization continuam distintos.

**DECIDIDO:** igualdade de label, email, provider ID ou chave não é prova suficiente de identidade canônica.

### 5.2 “Respondeu às perguntas” não significa “entendemos o sistema”

Na elicitação, E1 separa estados que um wizard convencional poderia colapsar:

```text
answered
  != understood
  != evidence sufficient
  != contradiction cleared
  != implementation-ready
  != production-ready
```

Uma pessoa pode responder uma pergunta e a resposta contradizer um procedimento observado. Uma IA pode gerar uma síntese elegante e ainda haver um stakeholder crítico não consultado. Uma planilha Brownfield pode revelar uma prática real e ainda assim não ser a política aprovada.

Por isso, `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope` e `Deferred` não podem virar um único campo genérico “informação”.

### 5.3 Autenticar não é autorizar

Um token válido demonstra alguma propriedade de autenticação. Não demonstra automaticamente que a pessoa pode aprovar uma OS, visualizar dados de outra Station ou executar uma operação administrativa.

E1 exige provas negativas de **non-amplification**: IdP groups, external roles, tokens, delegações, break-glass, trust material e secrets não podem produzir autoridade canônica maior do que aquela explicitamente admitida.

**DECIDIDO:** `authentication != authorization`.

## 6. E2: provar o que acontece quando o mundo é assíncrono e ambíguo

E2 leva o sistema de provas para dados, workflows, mensagens e efeitos externos. É aqui que “deu erro, tenta de novo” deixa de ser uma regra segura.

### 6.1 Timeout não responde à pergunta principal

Suponha que o SB mande ao provider um pedido de pagamento, emissão fiscal, envio de email crítico ou criação de recurso. A conexão cai antes da resposta.

Há pelo menos quatro estados semanticamente diferentes:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

O timeout descreve o que o cliente observou; não prova qual efeito ocorreu remotamente. Se repetir a operação puder causar dano, a regra é:

**DECIDIDO:** `UNKNOWN -> reconcile-before-retry`.

### 6.2 Idempotência também precisa ser provada

A existência de uma `idempotency-key` não significa replay seguro universal. A garantia pode valer apenas para uma operação, provider, target, conjunto de parâmetros e janela de retenção específicos.

Assim:

```text
idempotency key exists
    !=
permanent global duplicate safety
```

### 6.3 Workflow concluído não prova que o negócio terminou

Um workflow pode chegar ao estado `DONE` porque o motor concluiu suas transições internas. Isso não prova, por si só, que uma cobrança foi liquidada, um documento foi aceito externamente ou uma ação física aconteceu.

E2 exige que terminalidade do workflow e postcondição empresarial permaneçam claims distintas.

### 6.4 DLQ não é cemitério semântico

Mover uma mensagem para uma dead-letter queue (DLQ) resolve um problema operacional de processamento, mas não decide o destino empresarial da intenção original. A mensagem continua representando trabalho não resolvido até haver replay, reconciliação, compensação, disposição manual ou outra conclusão governada.

## 7. E3: provar providers sem entregar a eles o significado do SB

E3 aborda Provider, Binding e a fronteira Physical/Peripheral. A dificuldade é que providers externos conhecem muito sobre sua própria infraestrutura, mas isso não os torna semantic owners do negócio do cliente.

### 7.1 Suporte é vetor, não booleano

Um provider não deveria ser qualificado simplesmente com:

```text
supports_email = true
```

A pergunta real envolve um vetor: operações suportadas, limites, ordering, paginação, quotas, callbacks, idempotência, segurança, privacidade, currentness, comportamento sob falha e extensões proprietárias.

Dois providers que anunciam a mesma feature podem ter semânticas materialmente diferentes.

**DECIDIDO:** `provider feature name != portable semantic support`.

### 7.2 Descobrir não é admitir; admitir não é bindar; bindar não é provar efeito

E3 preserva uma sequência de estados que um integrador ingênuo poderia reduzir a “integrado”:

```text
discovered
 → profile identified
 → support qualified
 → authority/trust/locality qualified
 → binding candidate
 → shadow/observe
 → admission
 → bounded coexistence
 → cutover
 → old writer/effector fencing
 → residual drain
 → reconciliation
 → validated convergence
 → closure
```

Nenhuma seta é automática.

Isso é particularmente importante para anti-lock-in. Trocar um provider não é apenas apontar uma URL nova. É provar que a nova realização satisfaz as semânticas necessárias, que o antigo caminho deixou de produzir efeitos quando deveria, e que callbacks, tokens, jobs, subscriptions, resources e sessões residuais foram drenados ou receberam disposição explícita.

## 8. O limite físico: saber que um comando foi aceito não é saber que o mundo mudou

C2 já havia limitado a relação do SB com sistemas físicos especializados. E3 transforma esse limite em obrigações de prova.

Imagine uma integração com controle de acesso. O provider pode responder que o comando para liberar uma porta foi aceito. Isso ainda não é prova universal de que:

1. o comando era autorizado;
2. os interlocks aplicáveis estavam satisfeitos;
3. o controlador recebeu a instrução;
4. o atuador respondeu;
5. a porta fisicamente abriu;
6. o resultado permaneceu verdadeiro alguns segundos depois.

Cada claim precisa de evidência compatível com aquilo que afirma.

**DECIDIDO:** `provider reported state != physical truth` e `operation reachable != operation authorized != physical effect proven`.

O SB não ganha, por repetição de integrações bem-sucedidas, uma capability genérica de atuação física. Operações especializadas permanecem provider/domain-qualified enquanto a arquitetura autoritativa mantiver esse limite.

## 9. Local, Station e Fleet: o agregado não apaga o membro

E0–E3 repetem uma preocupação que aparece em várias capabilities: a diferença entre estado local e projeção agregada.

Se 99 Stations reportam saúde e uma está offline, um dashboard Fleet pode mostrar 99%. Isso não autoriza concluir que a centésima está saudável. Ela pode estar funcionando localmente, parada, divergente ou simplesmente desconhecida.

**DECIDIDO:** `Fleet aggregate != Station/local truth`.

No livro, essa desigualdade é importante porque mostra um padrão geral: **agregação é uma transformação de evidência, não uma promoção automática de autoridade**.

Quando a Station reconecta, ocorre uma fronteira de reconciliação: eventos atrasados, efeitos duplicados, grants, credentials, config, trust, provider callbacks e filas locais precisam ser tratados sem um `latest wins` silencioso.

## 10. Production Readiness é uma prova diferente de feature correctness

Uma capability pode executar corretamente sua função e ainda não estar pronta para produção. Planning E mantém dimensões independentes de readiness:

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

Exemplo: uma integração pode enviar 100% dos emails de um teste funcional, mas não ter métrica de fila, owner de incidentes, estratégia de recovery, conhecimento do limite do provider ou evidência de finite drainability após outage. Ela pode estar **feature-correct** e ainda não ser **production-ready**.

Essa separação é uma defesa contra o conhecido salto organizacional:

```text
“funciona” → “podemos operar com segurança”
```

O salto só é válido quando as obrigações intermediárias também foram provadas.

## 11. Capacidade e finite drainability: a fila também é uma claim

Quando retries, callbacks, reconciliações, migrações ou reconnects acumulam trabalho, não basta observar queue depth pequena em um instante. É preciso considerar taxa de chegada, taxa efetiva de serviço, oldest age, burst, retry amplification, quotas e blocked-owner age.

A intuição é simples. Se chegam 100 itens por minuto e o sistema consegue drenar 80, a fila pode parecer pequena agora e ainda assim divergir indefinidamente.

Modelos como `ρ = λ/μ` podem ajudar, mas apenas quando suas hipóteses são declaradas. A matemática não cria certeza fora do modelo que a justifica.

## 12. O que E0–E3 mudam na maneira de ler o System Builder

Até Planning D, a narrativa poderia ser resumida assim:

```text
entender → decidir arquitetura → planejar coexistência/migração
```

Planning E acrescenta:

```text
→ formular claims → exigir evidência adequada
→ tentar falsificar as claims
→ aceitar, limitar, bloquear, rejeitar ou adiar
→ reabrir quando revisão/currentness/população mudar
```

O objetivo não é criar uma máquina burocrática de testes. É impedir que a complexidade distribuída seja escondida por palavras excessivamente fortes como “integrado”, “migrado”, “seguro”, “saudável”, “compatível” ou “pronto”.

Uma boa prova diz exatamente **o que** foi demonstrado, **para quem**, **onde**, **em qual revisão**, **com qual evidência**, **até quando** e **o que faria a conclusão deixar de valer**.

## 13. Estado editorial e limites desta síntese

**DECIDIDO:** no estado autoritativo consultado, E0, E1, E2 e E3 estão `PASS` e E4 está autorizado. Planning E ainda está aberto.

**ABERTO/INCONCLUSIVO:** este apêndice não antecipa a decisão de E4 nem transforma os proof matrices já definidos em testes executados. `proof architecture decided != proof executed != product accepted`.

Nenhuma claim deste apêndice deve ser lida como evidência de implementação. Ele explica o sistema de prova que a arquitetura exige.

## O que você deve guardar deste apêndice

A ideia principal é esta: **o System Builder não deve provar que “algo funcionou”; deve provar claims específicas sem fortalecer a evidência além do que ela realmente demonstra**.

Guarde especialmente estas separações:

```text
claim != evidence != proof decision
PASS histórico != PASS corrente
feature completeness != production readiness
provider ACK != semantic effect proof
timeout != NOT_APPLIED
UNKNOWN → reconcile-before-retry
provider support != portable semantic equivalence
Fleet aggregate != Station/local truth
proof architecture decided != proof executed != product accepted
```

Planning E é, portanto, a camada que transforma as promessas arquiteturais da Generation 2 em obrigações falsificáveis e reabríveis. É o ponto em que “parece correto” precisa se tornar “sabemos exatamente qual claim aceitamos — e por quê”.

## Referências autoritativas principais

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_E_PRODUCT_PROOF_ACCEPTANCE_ENTRY_FRAMEWORK.md` — E0
- `project_docs/generation-2/planning/PLANNING_E_E1_SEMANTIC_AUTHORITY_REVISION_ELICITATION_PROOFS.md`
- `project_docs/generation-2/planning/PLANNING_E_E2_DATA_WORKFLOW_EXTERNAL_EFFECT_MESSAGING_PROOFS.md`
- `project_docs/generation-2/planning/PLANNING_E_E3_PROVIDER_BINDING_PHYSICAL_PERIPHERAL_REALIZATION_PROOFS.md`
- Planning C e Planning D citados por esses artefatos permanecem autoridades de arquitetura e migração, respectivamente.