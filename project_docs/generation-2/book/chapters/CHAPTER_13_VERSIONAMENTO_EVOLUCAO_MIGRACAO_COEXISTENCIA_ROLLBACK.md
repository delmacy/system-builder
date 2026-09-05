# Capítulo 13 — Versionamento, evolução, migração, coexistência e rollback — v1.0.0

**ID editorial:** `CHAPTER_13`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada:** compreensão e síntese; não substitui pesquisa, Planning A/B nem futura arquitetura alvo.

## O problema humano: a empresa não muda toda de uma vez

Imagine uma empresa de manutenção usando o System Builder. Hoje, uma Ordem de Serviço possui prioridade, técnico responsável e prazo. Amanhã, a empresa decide acrescentar criticidade, mudar a fórmula de SLA, exigir uma aprovação adicional para certas OS e trocar o provider que envia notificações.

É tentador chamar tudo isso de “versão 2 do sistema”. O problema é que a realidade não obedece a uma troca instantânea.

Enquanto a nova regra entra em vigor:

- algumas OS antigas continuam abertas sob a definição anterior;
- novos formulários já podem coletar o campo de criticidade;
- parte dos registros antigos ainda não possui esse campo;
- uma fórmula nova pode valer somente para OS criadas depois de determinada data;
- workers antigos podem continuar processando trabalho iniciado antes do cutover;
- clientes ou integrações externas podem ainda falar um contrato anterior;
- uma release anterior pode continuar armazenada e íntegra;
- o deployment novo pode estar ativo para apenas parte do tráfego;
- sessões, filas, caches ou bindings antigos podem continuar capazes de produzir efeitos.

Portanto, evolução empresarial real raramente é:

```text
v1 --------> v2
```

Ela se parece mais com isto:

```text
Processo      P7 ---------> P8
Schema        S3 -----> S4 ---------> S5
Workflow      W5 ----------------> W6
Policy        A9 -----------> A10
Fórmula       F2 ----> F3
Provider      N1 -----------------> N2
Release       R21 ------------> R22
Deployment    D44 ------------------> D45
Clientes      C-old ========> C-mixed ========> C-new
```

Cada linha possui identidade, revisão, owner, compatibilidade, evidência e ritmo próprios.

Esse é o problema que **Lifecycle / Versioning / Evolution / Migration** tenta tornar governável.

> **DECIDIDO em Planning A:** Lifecycle é o owner transversal da mudança entre capabilities: revision vectors, coexistência, migration readiness/currentness, transição/cutover, depreciação/withdrawal, rollback eligibility, correction/supersession lineage e drainage de cohorts autoritativos residuais. Ele não se torna dono da semântica dos domínios que estão mudando.

Referência autoritativa principal: `planning/PLANNING_A_LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_BOUNDARIES.md`.

---

## 1. Versão não é apenas um número

Em software comum, “versão” frequentemente lembra `1.2.3`. Esse número pode ser útil para uma release, biblioteca ou produto, mas ele não consegue representar sozinho o estado evolutivo de uma empresa inteira.

Na G2, é mais seguro começar por **Revision**: a identidade de uma evolução concreta de alguma coisa que possui história própria.

Podemos ter:

```text
ProcessDefinitionRevision = 8
SchemaRevision            = 4
AuthorizationPolicyRev    = 10
FormulaRevision           = 3
ProviderBindingRevision   = 6
ReleaseRevision           = 22
DeploymentGeneration      = 45
```

A pergunta relevante deixa de ser:

> “Qual é a versão atual do sistema?”

E passa a ser:

> “Quais revisões são aplicáveis a este sujeito, neste escopo, neste instante, para esta operação?”

Isso parece mais trabalhoso, mas evita uma mentira perigosa: fingir que todas as dimensões mudam em sincronia.

### 1.1 Revision vector

Um **vetor de revisões (revision vector)** é o conjunto das revisões relevantes para uma interpretação ou operação.

Exemplo didático:

```text
OS #4821

process       = P8
schema        = S4
workflow      = W5
policy        = A10
slaFormula    = F3
notification  = binding N2
runtime       = D45
```

Esse vetor não precisa ser literalmente armazenado desse modo em uma futura arquitetura. O ponto conceitual é outro: **não reduzir várias dimensões independentes a uma versão escalar falsa**.

> **DECIDIDO:** Lifecycle não é um “serviço global de número de versão”. Planning A proíbe esse colapso.

---

## 2. “Latest” não é uma verdade universal

Uma palavra aparentemente inocente causa muitos problemas em sistemas evolutivos: `latest`.

Considere uma OS criada em janeiro sob a fórmula de SLA F2. Em março, F3 entra em vigor.

Se em setembro alguém recalcular o histórico usando simplesmente “a fórmula mais recente”, pode alterar retroativamente o significado de um fato empresarial.

O mesmo vale para:

- policy atual versus policy aplicável quando a ação ocorreu;
- schema atual versus schema sob o qual um registro histórico foi produzido;
- processo atual versus processo de uma instância ainda em andamento;
- provider atual versus provider que produziu uma evidência antiga;
- contrato atual versus contrato suportado por um consumidor legado.

Por isso:

```text
latest revision
    != historically applicable revision
    != revision currently effective for every cohort
```

O Capítulo 09 já mostrou isso para fórmulas. Aqui a ideia é generalizada: **evolução precisa preservar aplicabilidade e lineage**.

---

## 3. Publicar uma revisão não significa migrar o mundo

Uma nova definição pode ser publicada e tornar-se canônica para novas decisões sem que tudo o que já existe tenha convergido para ela.

Planning A de Process & Application Modeling estabelece explicitamente:

```text
model revision becomes current
    != workflows migrated
    != schemas migrated
    != UIs converged
    != integrations converged
    != runtimes converged
```

Essa separação é essencial.

### Exemplo: nova criticidade de OS

A empresa acrescenta:

```text
criticidade = BAIXA | MEDIA | ALTA | CRITICA
```

A definição P8 passa a exigir o conceito. Isso não responde automaticamente:

1. Como registros antigos serão interpretados?
2. Eles receberão backfill?
3. Qual valor pode ser inferido legitimamente?
4. O formulário antigo continuará aceito?
5. APIs antigas podem omitir o campo?
6. Workflows já iniciados precisam dele?
7. Uma OS histórica sem criticidade é inválida ou apenas pertence a outro regime?

O erro seria transformar “P8 publicada” em “tudo é P8”.

---

## 4. Compatibilidade é uma relação, não um adjetivo

Dizer que duas versões são “compatíveis” sem contexto é quase sempre informação insuficiente.

Compatibilidade pode ser direcional.

Por exemplo:

```text
novo consumidor lê dado antigo?       talvez SIM
consumidor antigo lê dado novo?       talvez NÃO
novo produtor atende cliente antigo?  depende
cliente novo entende resposta antiga? depende
```

Uma forma didática de pensar é:

```text
Compatible(A, B, operation, scope, assumptions, evidence)
```

Em vez de:

```text
A.compatibleWith(B) = true
```

### 4.1 Compatibilidade local não prova compatibilidade global

Este ponto já apareceu no Capítulo 08: relações par a par podem parecer válidas sem que exista um estado global coerente para todas as partes simultaneamente.

Exemplo:

```text
Schema S3 <-> API A4      OK
API A4    <-> Worker W5   OK
Worker W5 <-> Policy P7   OK
```

Isso não prova que:

```text
S3 + A4 + W5 + P7
```

formam um conjunto conjuntamente admissível para a operação concreta.

A G2 pesquisa exatamente esse tipo de composição porque muitos defeitos empresariais aparecem **entre partes individualmente corretas**.

---

## 5. Coexistência não é necessariamente erro

Quando duas revisões existem ao mesmo tempo, a reação intuitiva pode ser: “o sistema está inconsistente”. Nem sempre.

**Coexistência** pode ser deliberada e necessária.

Exemplos:

- workflows iniciados em W5 terminam em W5, enquanto novos começam em W6;
- clientes antigos continuam em API v1 durante uma janela de migração;
- registros antigos permanecem em S3 enquanto uma população é migrada gradualmente para S4;
- duas versões de runtime recebem cohorts diferentes durante um canary;
- um provider antigo continua atendendo operações já iniciadas enquanto novas operações usam o provider novo.

A pergunta correta não é:

> “Há duas versões?”

Mas:

> “A coexistência é explicitamente qualificada, limitada, observável e possui condição de encerramento?”

### 5.1 Cohort

Um **cohort** é uma população que compartilha uma condição relevante de evolução.

Pode ser:

- OS criadas antes de uma data;
- workflow instances iniciadas sob W5;
- clientes ainda no contrato v1;
- replicas ainda executando D44;
- sessões autenticadas antes da mudança de policy;
- registros ainda não migrados;
- callbacks registrados no provider anterior.

Coexistência sem cohort explícito tende a virar ambiguidade.

---

## 6. Migração não é uma operação única

A palavra “migração” frequentemente é usada para descrever apenas um script de banco. Na G2, o conceito é mais amplo.

Uma transição pode envolver:

```text
proposed/prepared
        ↓
qualified
        ↓
coexistence / staged
        ↓
cutover-requested
        ↓
effective / converged
        ↓
validated
        ↓
drained / closed
```

Essa cadeia é conceitual; Planning C ainda não definiu a arquitetura alvo que materializará esses estados.

O valor dela é impedir que eventos diferentes sejam colapsados em “migrou”.

### 6.1 Migration readiness

**Migration readiness** responde se há evidência atual suficiente para iniciar ou avançar uma transição.

Ela pode depender de:

- compatibilidade de schema;
- artifacts disponíveis;
- bindings qualificados;
- trust e credentials atuais;
- consumers conhecidos;
- capacidade de rollback;
- backups ou recovery points;
- policy/governance;
- privacy/residency;
- ausência ou tratamento de cohorts bloqueadores.

E há uma palavra decisiva: **atual**.

```text
ready yesterday != ready now
```

Uma credencial pode expirar. Uma policy pode mudar. Um provider pode retirar suporte. Uma nova instância antiga pode aparecer por reconexão offline. Uma evidência histórica de readiness não deve ser eternizada.

Isso é **currentness** aplicada à evolução.

---

## 7. Cutover: mudar a autoridade efetiva

**Cutover** é o ponto ou processo em que a realização/revisão nova passa a assumir a autoridade operacional pretendida para determinado escopo.

Exemplo simples:

```text
antes:
novas notificações -> Provider A

depois:
novas notificações -> Provider B
```

Mas trocar a rota não prova que A deixou de produzir efeitos.

Podem existir:

- callbacks pendentes;
- mensagens em filas;
- workers antigos;
- jobs agendados;
- sessões;
- operações in-flight;
- retries;
- caches;
- clientes desconectados que retornarão depois.

Portanto:

```text
cutover routing changed
    != old authority drained
    != transition closed
```

Essa é a ponte direta com o Capítulo 12.

---

## 8. Residual authoritative cohorts

Um **cohort autoritativo residual** é uma população antiga que ainda pode produzir efeitos que contam como verdade ou efeito válido depois da transição principal.

Exemplo de workflow:

```text
W5 -> 2.000 instâncias antigas
W6 -> novas instâncias
```

A publicação de W6 não elimina as 2.000 instâncias W5.

Há várias estratégias possíveis:

1. deixar W5 terminar naturalmente;
2. migrar algumas instâncias para W6;
3. cancelar explicitamente determinadas instâncias;
4. congelar uma população para tratamento manual;
5. manter execução dual por uma janela governada.

O Lifecycle não decide sozinho qual estratégia é semanticamente correta. Workflow é o owner da evolução de suas instâncias e de seu histórico; Lifecycle coordena a relação transversal entre revisões e cohorts.

### 8.1 Drainage

**Drainage** é o encerramento governado da capacidade residual de uma revisão/cohort antigo produzir efeitos autoritativos no escopo relevante.

Não significa necessariamente apagar tudo.

História e evidência podem permanecer preservadas.

```text
old revision no longer authoritative for new effects
    != old history deleted
```

Essa distinção protege auditabilidade e replay histórico.

---

## 9. Supersession, correction e história

Quando uma revisão nova corrige ou substitui uma anterior, há uma tentação de “editar o passado”. Isso destrói explicabilidade.

A G2 preserva **supersession/correction lineage**.

Exemplo:

```text
P7 --superseded-by--> P8
```

P8 pode assumir autoridade corrente, mas P7 continua sendo a revisão que produziu determinados fatos históricos.

Isso permite responder:

- qual regra existia quando a decisão ocorreu?
- qual revisão produziu o artefato?
- por que um workflow seguiu aquele caminho?
- quando a correção passou a valer?
- quais cohorts continuaram sob a revisão anterior?

A correção deve acrescentar história, não apagar causalidade.

---

## 10. Rollback: três coisas que parecem iguais e não são

Rollback é um dos termos mais perigosamente sobrecarregados.

Precisamos separar pelo menos:

```text
historical availability
        !=
rollback eligibility
        !=
rollback actuation
        !=
state recovery
```

### 10.1 Historical availability

Significa apenas que uma revisão, release, artifact ou estado anterior ainda existe e pode ser identificado.

Isso é necessário para vários rollbacks, mas não prova segurança.

### 10.2 Rollback eligibility

É a afirmação **atual e qualificada** de que retornar a uma revisão anterior é admissível sob as condições presentes.

Pode exigir verificar:

- schema/data atuais ainda são compreendidos pelo runtime antigo?
- houve dados novos que o código antigo destruiria ou interpretaria errado?
- workflows iniciados pela revisão nova podem voltar?
- o provider antigo ainda existe e está admitido?
- certificados e credentials ainda são válidos?
- a policy antiga ainda pode legalmente ser usada?
- privacy/residency permite o retorno?
- contratos externos ainda aceitam aquela revisão?
- a release anterior continua íntegra e confiável?

Logo:

```text
artifact antigo existe
    != rollback elegível
```

### 10.3 Rollback actuation

É a execução mecânica do retorno.

Planning A separa os owners:

- Deployment/Runtime atua rollback de deployment;
- Data/Schema atua suas transições de dados/schema;
- Workflow governa instâncias em andamento;
- Provider/Binding atua cutover de providers;
- Artifact/Release governa promoção/distribuição/withdrawal;
- Security/Resilience governa recovery qualification e return-to-service.

Lifecycle coordena a **elegibilidade transversal**; ele não sequestra a atuação de todos esses owners.

### 10.4 State recovery

Recuperar estado significa restaurar/reconstruir dados ou serviço após falha. Pode ser parte de um rollback, mas não é sinônimo.

Um restore pode ser tecnicamente bem-sucedido e ainda produzir um estado incompatível com as revisões atualmente autorizadas.

```text
restore succeeded
    != lifecycle-valid rollback
    != validated return-to-service
```

---

## 11. O paradoxo do banco que já avançou

Considere:

```text
Release R21 usa Schema S3
Release R22 migra para Schema S4
```

R22 entra em produção e grava durante duas semanas campos/estruturas que R21 desconhece.

Então aparece um defeito em R22.

O operador ainda possui R21 perfeitamente armazenada. Pode simplesmente redeployá-la?

Talvez não.

Há pelo menos quatro possibilidades:

1. S4 é backward-compatible com R21;
2. S4 pode ser transformado de volta para S3 sem perda material;
3. R21 pode operar parcialmente, mas não com todos os dados novos;
4. retornar R21 destruiria ou interpretaria incorretamente fatos produzidos sob S4.

A existência do binário antigo resolve apenas uma dimensão.

Esse exemplo mostra por que rollback é uma relação entre **estado atual + revisões retidas + compatibilidade + evidência**, e não um botão “voltar versão”.

---

## 12. Roll-forward pode ser mais seguro que rollback

Em alguns cenários, corrigir para frente é mais seguro do que retornar.

Exemplo:

```text
R21 -> R22 com schema irreversível -> defeito funcional
```

Se R21 não compreende os fatos já produzidos, pode ser melhor:

```text
R22 -> R23 corrigida
```

em vez de:

```text
R22 -> R21
```

Isso não significa que rollback seja ruim. Significa que **reversibilidade precisa ser provada para a situação concreta**.

A arquitetura futura poderá oferecer automação, mas o livro não deve ensinar uma ficção de reversibilidade universal.

---

## 13. Efeitos ambíguos durante migração

Migrações também sofrem falhas distribuídas.

Imagine que o SB envia a um provider:

```text
migrate cohort C7 from binding A to B
```

A conexão cai antes da resposta.

O resultado pode ser:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

Se o estado for `UNKNOWN`, repetir cegamente pode duplicar ou corromper efeitos.

A regra reaparece:

```text
UNKNOWN mutating effect
    -> reconcile-before-retry
```

Lifecycle precisa preservar a disposição do efeito e consumir evidência dos owners envolvidos. Ele não pode declarar sucesso porque “a chamada foi enviada”.

---

## 14. Migração de dados e migração de significado

Uma transformação física não prova que o significado foi preservado.

Exemplo:

```text
campo antigo: prioridade = 1,2,3
campo novo: criticidade = BAIXA,MEDIA,ALTA,CRITICA
```

Um script pode mapear:

```text
1 -> BAIXA
2 -> MEDIA
3 -> ALTA
```

Mas de onde surgiu `CRITICA`? E “prioridade” realmente significava “criticidade”?

Se os conceitos não forem semanticamente equivalentes, o script pode executar sem erro e ainda fabricar uma interpretação falsa.

Por isso:

```text
migration mechanically successful
    != semantic migration proven
```

Data/Schema possui a correção da transição de dados; o semantic owner do domínio possui o significado; Lifecycle coordena a evolução entre revisões.

---

## 15. Workflow em andamento: o navio já saiu do porto

Alterar uma definição de workflow não muda automaticamente instâncias que já estão em execução.

Considere uma compra empresarial:

```text
W5: solicitar -> aprovar gerente -> comprar
W6: solicitar -> aprovar gerente -> aprovar financeiro -> comprar
```

Uma instância W5 já aprovada pelo gerente está aguardando compra quando W6 entra em vigor.

Perguntas legítimas:

- ela termina sob W5?
- deve ganhar a nova aprovação financeira?
- pode ser migrada sem reescrever a história?
- a mudança é regulatória e obrigatória para casos ainda não concluídos?

Não existe resposta universal.

Workflow é owner do histórico e da evolução in-flight; Governance/Authorization podem impor obrigações; Lifecycle coordena a transição.

A lição é:

```text
new definition current
    != old instance silently rewritten
```

---

## 16. Consumidores antigos também fazem parte da evolução

É fácil pensar somente em componentes controlados pelo SB. Mas consumidores podem evoluir mais lentamente:

- aplicativo mobile offline;
- integração de cliente;
- terminal industrial;
- planilha automatizada;
- webhook registrado há meses;
- parceiro B2B;
- serviço interno de outra equipe.

Uma transição pode parecer completa no control plane enquanto clientes antigos continuam produzindo tráfego.

Isso é **version skew**: componentes de revisões diferentes coexistindo/interagindo.

Version skew não é automaticamente defeito. Ele precisa de relações de compatibilidade e horizonte de suporte explícitos.

---

## 17. Deprecation não é withdrawal

**Deprecation** comunica que uma revisão está deixando de ser preferida/suportada e deve caminhar para retirada.

**Withdrawal** significa que ela já não pode mais ser usada no escopo governado aplicável.

Entre os dois pode existir uma janela:

```text
active
  ↓
deprecated
  ↓
coexistence window
  ↓
withdrawal eligible
  ↓
withdrawn / drained
```

Uma release marcada `deprecated` não prova que consumidores deixaram de usá-la. Um provider marcado “old” não prova que callbacks antigos foram encerrados.

Lifecycle precisa distinguir declaração de lifecycle de efetividade da retirada.

---

## 18. Evidência: como saber que a transição terminou?

Uma transição não deveria ser fechada apenas por um evento administrativo como:

```text
"migration job finished"
```

Dependendo do caso, a prova pode precisar incluir:

- população migrada e reconciliada;
- consumers antigos drenados;
- tráfego convergido;
- workflows residuais concluídos ou tratados;
- provider antigo sem novos efeitos autoritativos;
- schema/postconditions validados;
- policy/governance satisfeitas;
- privacy/residency preservadas;
- artifacts e provenance qualificadas;
- observabilidade sem sinais incompatíveis;
- rollback/recovery posture reavaliada.

Por isso Planning A separa:

```text
accepted
effective
converged
validated
drained/closed
```

São afirmações diferentes.

---

## 19. Quem manda em quê durante a evolução

Lifecycle é transversal, mas não é um semantic god-object.

Um mapa simplificado:

```text
Process owner
  -> significado e compatibilidade do processo

Data/Schema
  -> schema, população, backfill, postconditions

Workflow
  -> instâncias, histórico, evolução in-flight

Provider/Binding
  -> provider coexistence/cutover/withdrawal

Artifact/Release
  -> artifact/release lifecycle e distribuição

Deployment/Runtime
  -> rollout, readiness, traffic, rollback actuation

Security/Resilience
  -> recovery e return-to-service qualification

Governance/Privacy
  -> obrigações que podem bloquear/qualificar mudança

Lifecycle
  -> coordena revision vectors, readiness, coexistência,
     cutover, withdrawal, rollback eligibility e drainage
```

Essa separação evita dois extremos ruins:

1. cada capability evolui isoladamente e ninguém enxerga o produto de revisões;
2. um “Lifecycle Manager” central passa a decidir semântica de todos os domínios.

A G2 procura coordenação sem usurpação de ownership.

---

## 20. O que o SB atual já evidencia

> **EVIDENCIADO NO SB ATUAL:** Planning B encontrou uma base de lifecycle mais forte do que um simples campo `version`.

Há evidência de:

- `ProcessArtifactIdentity` e `ProcessRevisionIdentity` provider-neutral;
- `artifactRef`, `revisionRef`, `revisionNumber` e `previousRevisionRef` explícitos;
- primeira revisão sem predecessor e sucessoras com predecessor obrigatório;
- publicação imutável com rejeição de overwrite drift;
- estados `active | deprecated | archived`;
- `supersedesRevisionRef`;
- validação determinística de lineage, gaps, duplicatas, predecessor e supersession;
- correlação process revision → analysis → SystemDefinition → release → deployment;
- release lifecycle explícito;
- successor activation com proteção `stale-active`;
- prova de retenção de A, ativação de B e posterior re-promoção do A exato sem regeneração.

Isso é significativo porque demonstra identidade e história concretas, não apenas intenção arquitetural.

Referência: `planning/PLANNING_B_LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_SB_CURRENT_STATE.md`.

### 20.1 O que essa prova NÃO significa

Planning B também é explícito sobre os limites.

> **NÃO EVIDENCIADO COMO CAPABILITY GENERALIZADA:** ainda não há prova de um modelo transversal completo de lifecycle para revision vectors independentes de schema, workflow, provider, contract, runtime, trust, policy e outros owners.

Também não há evidência generalizada de:

- compatibility/coexistence claims applicability-scoped;
- migration readiness/currentness transversal;
- staged transition record genérico;
- `PARTIAL/INCONCLUSIVE` lifecycle assessment geral;
- inventário/drainage de cohorts autoritativos residuais;
- consumer-effective adoption generalizada;
- rollback eligibility recalculada com schema, workflow, provider, trust, privacy, contracts e recovery;
- migration effects genéricos com `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN`.

A prova atual de rollback demonstra que um realization anterior retido pode ser re-promovido **nas condições testadas**. Ela não autoriza afirmar que todo rollback futuro é seguro.

---

## 21. Stale-active e concorrência de evolução

Há outro problema prático: duas pessoas ou automações podem tentar evoluir o sistema ao mesmo tempo.

Exemplo:

```text
ativo = A

Operador 1 prepara B esperando predecessor A
Operador 2 prepara C esperando predecessor A
```

Se B vence e torna-se ativo, C não deveria ser promovido como se A ainda fosse o predecessor atual.

O SB atual já possui evidência de compare-and-promote com rejeição `stale-active` em deployment.

Didaticamente, isso representa uma regra maior:

```text
proposal valid against old base
    != proposal valid against current authority
```

Esse padrão também aparece em edição de processos, policy, bindings e outras revisões.

---

## 22. IA e low-code não ganham autoridade para “resolver” evolução

Uma IA pode ser excelente em:

- sugerir migration plan;
- identificar dependências;
- propor mapeamentos;
- estimar cohorts;
- detectar incompatibilidades;
- gerar scripts candidatos;
- explicar rollback posture.

Mas ela não pode fabricar evidência de compatibilidade.

Da mesma forma, um Canvas pode apresentar:

```text
[ Migrar para v2 ]
```

sem que esse botão possua autoridade para:

- ignorar legal hold;
- migrar dado semanticamente ambíguo;
- reviver revision withdrawn;
- ampliar support window;
- apagar cohort residual;
- declarar rollback seguro sem evidência;
- transformar `UNKNOWN` em `APPLIED`.

> **DECIDIDO:** `Enterprise → Station → Role → Person` continua monotônico também sobre escolhas de lifecycle. Lower scopes não podem ampliar autoridade de evolução recebida.

---

## 23. Trade-offs: evolução explícita custa complexidade

Toda essa modelagem possui custo.

Se cada pequena mudança exigir um vetor gigantesco e dezenas de estados expostos ao usuário, o System Builder se torna impraticável.

A resposta, porém, não é apagar as distinções. É **esconder complexidade acidental sem destruir complexidade essencial**.

Uma instalação pequena pode ter:

```text
process P8
schema S4
runtime D45
```

quase sempre evoluindo juntos. A interface pode oferecer um fluxo simples.

Mas o modelo precisa sobreviver quando aparecer:

- migração longa;
- mobile offline;
- provider substituído;
- workflow de meses;
- rollback parcial;
- cliente legado;
- exigência regulatória;
- coexistência de filiais;
- mudança de policy no meio da transição.

Essa é a mesma filosofia dos Capítulos 04 e 11:

```text
simple operation
    does not require
semantically impoverished model
```

---

## 24. Um exemplo completo: evolução de OS

Vamos reunir os conceitos.

### Estado inicial

```text
Process   P7
Schema    S3
Workflow  W5
Formula   F2
Policy    A9
Provider  N1
Release   R21
Deploy    D44
```

### Mudança desejada

A empresa quer:

1. adicionar criticidade;
2. usar SLA F3;
3. exigir aprovação adicional para `CRITICA`;
4. trocar notificações N1 por N2.

### Preparação

São produzidas revisões candidatas:

```text
P8, S4, W6, F3, A10, N2, R22, D45
```

Cada owner precisa qualificar sua parte.

### Coexistência

Após início do rollout:

```text
OS novas          -> P8/S4/W6/F3/A10/N2
OS antigas abertas -> P7/S3/W5/F2/A9/N1 ou transição qualificada
```

Essa frase “ou transição qualificada” é importante: não se pode inventar uma regra universal para os casos antigos.

### Cutover

Novas operações passam ao conjunto novo. Mas ainda existem:

```text
17 workflow instances W5
3 callbacks N1
2 clientes API antiga
1 worker D44 drenando fila antiga
```

Logo, o cutover principal ocorreu, mas a transição não está fechada.

### Drainage

Os cohorts residuais são encerrados ou explicitamente tratados. Só então há evidência suficiente para retirar certas revisões do caminho autoritativo.

### Incidente

Descobre-se um bug em R22.

A pergunta não é:

> “Tem R21 guardada?”

A pergunta é:

> “R21 é atualmente elegível diante de S4, W6, A10, F3, N2 e dos fatos já produzidos?”

Se a resposta for `INCONCLUSIVE`, a decisão segura não é fingir `YES`.

Pode ser necessário corrigir para R23.

Esse é o tipo de raciocínio que transforma versionamento de um detalhe técnico em **governança da mudança empresarial**.

---

## 25. Riscos que este modelo tenta evitar

### 25.1 Scalar-version illusion

Tratar o sistema inteiro como se uma versão única descrevesse todas as dimensões.

### 25.2 Latest poisoning

Reinterpretar história usando automaticamente a revisão mais recente.

### 25.3 Migration-by-acknowledgement

Declarar migração concluída porque um job ou provider respondeu sucesso.

### 25.4 Rollback-by-availability

Declarar rollback seguro apenas porque artifact/release antiga existe.

### 25.5 Silent cohort resurrection

Um cliente, sessão, worker ou dispositivo antigo reaparece depois do cutover e volta a produzir efeitos sem requalificação.

### 25.6 Semantic backfill fabrication

Preencher dados antigos com defaults/inferências que parecem convenientes, mas fabricam fatos que nunca existiram.

### 25.7 Lifecycle god-object

Centralizar evolução de modo que Lifecycle passe a decidir significado de processo, dados, policy, workflow, provider e recovery.

A pesquisa G2 preserva boundaries justamente para evitar esse último risco.

---

## 26. Como este capítulo se conecta aos anteriores

O Capítulo 02 introduziu a empresa como sistema versionado. Este capítulo mostra a consequência operacional dessa ideia: **versionar não basta; é preciso governar coexistência e mudança**.

O Capítulo 03 separou semantic owner, provider e binding. Aqui vemos que cada um pode evoluir em ritmos diferentes.

O Capítulo 06 mostrou workflows duráveis. Aqui fica claro por que instâncias antigas não desaparecem quando uma definição nova é publicada.

O Capítulo 08 mostrou schema, dados e retenção. Aqui essas dimensões entram como constraints de migration e rollback.

O Capítulo 09 mostrou historical applicability de fórmulas. Aqui o princípio é ampliado para revision vectors.

Os Capítulos 10 e 11 separaram artifact/release de deployment/runtime. Aqui isso impede confundir “release antiga retida” com “rollback atualmente seguro”.

O Capítulo 12 mostrou provider substitution e residual cohorts. Aqui esse mecanismo aparece como uma espécie particular de evolução coordenada.

Os próximos capítulos acrescentarão observabilidade/evidência e segurança/recovery, duas dimensões fundamentais para provar que uma transição realmente convergiu e permanece segura.

---

## 27. Estado epistemológico deste capítulo

### DECIDIDO

- Lifecycle / Versioning / Evolution / Migration é capability canônica transversal.
- Não possui a semântica dos domínios que coordena.
- Revision vectors preservam dimensões independentes; Lifecycle não é global scalar version service.
- Migration readiness/currentness, coexistência, cutover, withdrawal, rollback eligibility e residual authoritative cohort drainage pertencem ao seu boundary transversal.
- Rollback eligibility é distinta de rollback actuation e de state recovery.
- Histórico retido não prova rollback eligibility.
- Uma transição não está necessariamente fechada enquanto cohorts antigos ainda podem produzir efeitos autoritativos.

### EVIDENCIADO NO SB ATUAL

- process revision identity e predecessor lineage explícitos;
- immutable publication guard;
- lifecycle `active/deprecated/archived` e supersession;
- cross-stage process → definition → release → deployment lineage;
- stale-active fencing;
- retained-history deployment proof para A → B → A nas condições testadas.

### EM PESQUISA / NÃO GENERALIZADO NO SB ATUAL

- revision-vector lifecycle transversal completo;
- compatibility/coexistence claims genéricas;
- migration readiness/currentness generalizada;
- staged transition record comum;
- residual cohort inventory/drainage transversal;
- rollback eligibility requalificada entre todos os owners;
- generic migration effect dispositions.

### ABERTO/INCONCLUSIVO

A forma concreta dos contratos, stores, APIs, state machines e boundaries físicos da arquitetura alvo continua reservada às fases autorizadas posteriores. Este livro não entra em Planning C.

---

## O que você deve guardar deste capítulo

A ideia mais importante é simples:

> **Uma empresa não troca de versão; ela atravessa uma transição entre conjuntos de revisões.**

Por isso:

```text
current != latest everywhere
published != migrated
compatible pairwise != globally admissible
cutover != drained
retained != rollback-eligible
rollback-eligible != rollback-actuated
restore succeeded != validated return-to-service
```

Evolução segura exige preservar identidade, revisão, lineage, compatibilidade, cohorts, currentness e evidência sem permitir que um coordenador transversal roube o significado dos semantic owners.

É isso que transforma versionamento de “número de release” em uma disciplina para mudar sistemas empresariais sem perder a capacidade de explicar **o que mudou, para quem mudou, quando passou a valer, o que ainda ficou para trás e se realmente é possível voltar**.

---

## Referências internas principais

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_A_LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_SB_CURRENT_STATE.md`
- `project_docs/generation-2/planning/PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`
- Capítulos 02, 06, 08, 09, 10, 11 e 12 como dependências editoriais.
