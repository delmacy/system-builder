# Apêndice F — Autorização como plano de autoridade: o que C3.8 decidiu

> **Camada editorial:** compreensão e síntese.  
> **Estado da fonte:** `DECIDIDO / PASS_FOR_CAPABILITY` em Planning C C3.8.  
> **Não é autoridade superior:** em qualquer divergência, prevalecem os artefatos de Planning C e demais fontes autoritativas.  
> **Data editorial:** 2026-09-06.

## 1. O problema humano: entrar no sistema não é receber poder

Uma empresa pode saber perfeitamente quem é uma pessoa e, ainda assim, não saber se ela pode aprovar uma compra, abrir uma câmera, alterar uma política, movimentar estoque ou executar uma ordem de serviço.

Esse problema parece simples enquanto a empresa tem poucos usuários e uma única aplicação. Ele muda de natureza quando existem filiais, Stations, tenants, providers externos, trabalho offline, delegações temporárias, aprovações em cadeia, IA, automações e processos que continuam executando por horas ou dias.

A pergunta deixa de ser apenas:

```text
"o usuário tem a permissão X?"
```

Ela passa a ser:

```text
quem é o sujeito canônico?
+ qual ação canônica ele quer executar?
+ sobre qual recurso?
+ em qual Enterprise / organização / tenant / Station?
+ por qual Role, assignment ou delegação?
+ sob qual revisão de política?
+ com qual autenticação e currentness?
+ quais aprovações e restrições são aplicáveis?
+ existe evidência suficiente agora?
------------------------------------------------
= ALLOW | DENY | INCONCLUSIVE
```

**DECIDIDO:** Planning C C3.8 adota um **Canonical Authorization & Organizational Authority Plane** provider-neutral e qualificado por revisão. Em português: um plano canônico de autorização e autoridade organizacional que mantém o significado da permissão sob controle do System Builder, mesmo quando partes da realização são feitas por serviços externos.

## 2. O salto de Planning A para Planning C

O Capítulo 07 já ensinava corretamente que `authentication != authorization`, que `Enterprise → Station → Role → Person` é uma hierarquia de autoridade e que providers externos não devem virar a fonte canônica de permissão apenas porque possuem grupos ou roles próprios.

Planning C agora tornou a arquitetura mais concreta.

Antes, era pedagogicamente seguro dizer que a decisão futura teria de considerar principal, ação, recurso, escopo, política, delegação, revisão e currentness. Agora C3.8 decidiu que esses elementos precisam ser representados por identidades e ocorrências explícitas, incluindo `PolicyRef`, `PolicyRevisionRef`, `AuthorityAssignmentRef`, `DelegationEnvelopeRef`, `BreakGlassGrantRef`, `AuthorizationDecisionRef`, `AuthorizationEvaluationOccurrenceRef` e `ResidualAuthorityCohortRef`.

Isso não é apenas criar mais nomes. É impedir que fatos semanticamente diferentes sejam esmagados em um booleano `isAllowed=true`.

## 3. Autorização é verdade de autoridade, não verdade de identidade

C3.8 consome fatos canônicos de identidade e autenticação, mas possui a verdade de autoridade.

```text
Identity / Authentication
    "quem é e com que evidência foi autenticado?"
              |
              v
Authorization
    "pode fazer esta ação, neste recurso,
     neste escopo e sob estas revisões?"
```

**DECIDIDO:** não existe transição implícita `AUTHENTICATED -> ALLOW`.

Uma sessão válida pode ser necessária para uma ação e ainda ser insuficiente. Uma política pode exigir MFA recente, determinada Station, Role atual, aprovação independente e ausência de conflito de separação de funções.

Da mesma forma:

```text
external group != canonical Role
external role != canonical permission
token scope != canonical authority
visible action != authorized action
```

O provider pode fornecer evidência ou realizar uma decisão downstream. Ele não adquire semantic ownership da autoridade empresarial.

## 4. `Enterprise → Station → Role → Person` agora tem semântica arquitetural decidida

C3.8 decidiu que a hierarquia é **monotônica e não amplificadora**.

Isso não significa que cada nível simplesmente copie todas as permissões do nível anterior. A autoridade efetiva resulta da combinação entre envelope superior, exposição da capability na Station, assignments atuais, política específica, escopos organizacionais, evidência de autenticação, aprovações, separação de funções e outras restrições aplicáveis.

Uma forma didática é:

```text
Envelope superior
       ∩
Delegação explícita
       ∩
Exposição atual da capability na Station
       ∩
Role / Person / Principal assignments atuais
       ∩
Política de ação e recurso
       ∩
Escopo tenant / organização / site
       ∩
Assurance e currentness exigidos
       ∩
Aprovações / SoD / regras emergenciais
       =
Autoridade efetiva
```

A analogia de interseção ajuda a compreender a não amplificação, mas deixa de valer se for interpretada como exigência de uma implementação literal por conjuntos. O ponto arquitetural é outro: um nível inferior não pode fabricar poder que o envelope superior não delegou.

Isso também limita IA, UI, AGWS, Fleet, caches offline e providers. Nenhum deles pode aumentar autoridade apenas porque consegue apresentar, sugerir ou tecnicamente realizar uma operação.

## 5. Política não é um texto mutável

Em muitas empresas, “a política” é um PDF, uma página de wiki ou uma regra escondida em código. Isso cria um problema quando precisamos explicar por que uma ação foi permitida ontem e negada hoje.

**DECIDIDO:** uma política canônica possui identidade estável, revisões imutáveis e regras explícitas de aplicabilidade.

Assim:

```text
Policy P
  ├─ Revision R1
  ├─ Revision R2
  └─ Revision R3
```

Uma decisão histórica pode ter sido correta sob `R1` e não ser autorização válida sob `R3`.

```text
historic ALLOW under R != current ALLOW under R+1
```

Isso é especialmente importante para filas e workflows duráveis. Uma OS admitida às 8h não ganha autorização eterna. Dependendo da classe da política, o trabalho pode continuar sob a revisão de origem, precisar ser reavaliado antes de um novo efeito protegido, ser suspenso, cancelado ou compensado.

Não existe uma regra universal; a escolha precisa ser explícita na política/owner competente.

## 6. Por que existe `INCONCLUSIVE`

Sistemas simples gostam de reduzir autorização a `true/false`. Em sistemas distribuídos, às vezes a evidência necessária não está disponível ou não é atual o bastante.

Exemplo: uma Station está desconectada e possui uma cópia local da política. Ela sabe que Maria podia autorizar determinado serviço há duas horas, mas perdeu contato com a fonte que informaria uma revogação crítica.

Responder `ALLOW` apenas porque o cache dizia sim pode ampliar autoridade indevidamente. Responder `DENY` pode interromper uma operação local que a empresa explicitamente desenhou para funcionar offline.

Por isso C3.8 exige pelo menos:

```text
ALLOW
DENY
INCONCLUSIVE
```

`INCONCLUSIVE` significa: **não é possível estabelecer autoridade com segurança a partir da evidência qualificada atual**. Não significa “talvez sim, então deixe passar”. Para operações de alto risco ou expansoras de autoridade, a regra é fail-closed salvo alternativa bounded explicitamente definida por política superior.

## 7. Delegação, autoridade temporária e break-glass são objetos, não comentários

Imagine que Ana saia de férias e Bruno precise aprovar compras durante cinco dias. Uma implementação frágil adicionaria Bruno permanentemente ao grupo `managers` e alguém lembraria de removê-lo depois.

C3.8 rejeita essa informalidade como modelo canônico.

**DECIDIDO:** autoridade temporária e emergencial possui identidade explícita, emissor, beneficiário, escopo, início, expiração, condição de revogação, envelope superior, regras de subdelegação, aprovações, justificativa, provenance e contexto de revisão.

**Break-glass** é o acesso emergencial excepcional. Ele pode ampliar a autoridade efetiva somente dentro de um envelope emergencial previamente permitido pela política superior. Precisa permanecer separadamente observável e revisável.

Um ponto decisivo é:

```text
grant expired != authority eliminated everywhere
revoke accepted != authority eliminated everywhere
```

Tokens, sessões, caches, workers, providers e sites offline podem continuar carregando autoridade antiga. É por isso que C3.8 introduz a ideia de **residual authority cohorts**: populações residuais que ainda precisam convergir após revogação ou supersessão.

## 8. Revogar é um processo de convergência

Em um sistema distribuído, clicar em “revogar” não prova que a revogação já produziu efeito em todos os lugares.

A arquitetura decidida separa etapas semelhantes a:

```text
revogação canônica
      ↓
propagação solicitada
      ↓
provider / evaluator / cache / session atualizado
      ↓
enforcement efetivo observado
      ↓
coortes residuais drenadas ou reconciliadas
```

Se a resposta remota for ambígua, o estado pode ser `UNKNOWN` ou `PARTIAL`. Quando repetir a mutação puder duplicar ou piorar efeitos, aplica-se a disciplina já estudada no Capítulo 18:

```text
UNKNOWN -> reconcile-before-retry
```

Autorização, portanto, conecta segurança a distributed systems. A verdade canônica de “esta autoridade foi revogada” e a verdade operacional de “nenhum consumidor ainda a honra” são fatos diferentes.

## 9. Separação de funções e aprovações não cabem apenas em Roles

**Separation of Duties (SoD)**, ou separação de funções, impede combinações perigosas de autoridade.

Exemplo empresarial:

```text
Pessoa A cria fornecedor
Pessoa A cria pagamento
Pessoa A aprova pagamento
Pessoa A liquida pagamento
```

Mesmo que cada ação isoladamente seja legítima, permitir que a mesma pessoa controle toda a cadeia pode eliminar controles internos importantes.

C3.8 decide que SoD pode atravessar roles, autoria e aprovação, propriedade de recurso, mudança e ativação de política, criação e aprovação de release, rating/billing e settlement, ou criação/aprovação de exceções de segurança.

Aprovação também é uma **ocorrência**, não um checkbox eterno. Ela carrega ator, autoridade, escopo, decisão, revisão, tempo/currentness e evidência.

```text
approval recorded != operation authorized forever
```

IA pode preparar evidência ou recomendação. Ela não satisfaz automaticamente um requisito de aprovação humana ou de autoridade.

## 10. Station capability exposure não é UI

Uma Station pode ter autorização para expor uma capability sem que toda pessoa da Station possa executar todas as suas ações.

E uma UI pode mostrar um botão sem que o usuário tenha autoridade para acioná-lo.

C3.8 preserva três fatos distintos:

```text
capability disponível
        !=
capability autorizada para a Station
        !=
ação autorizada para a Person/Principal
```

AGWS e UI cuidam da composição e realização da superfície de trabalho. Authorization possui a verdade sobre exposição e ação permitidas.

Portanto:

```text
visibility != authority
```

Esconder um botão pode melhorar a experiência e reduzir erro acidental, mas não é um controle de autorização suficiente.

## 11. Multitenancy é uma fronteira semântica

É tentador pensar que tenant é apenas `tenant_id` em uma tabela. C3.8 decide algo mais forte: tenant é um escopo canônico de autoridade.

Uma infraestrutura compartilhada pode hospedar vários tenants. Um provider pode usar um namespace único. Isso não autoriza o colapso das identidades e permissões empresariais.

Cross-tenant e cross-Station access precisam ser explícitos, bounded, atribuíveis e revisáveis.

```text
shared database != shared authority
shared provider account != shared canonical tenant
```

Essa separação importa para suporte, administração Enterprise, incidentes, providers multi-tenant e operações federadas/offline.

## 12. Providers externos: evidência e realização sem promoção automática

Um diretório pode dizer que uma pessoa pertence ao grupo `admin`. Um SaaS pode dizer que ela possui o role `owner`. Um sistema físico pode dizer que ela é `operator`.

Nenhuma dessas strings possui significado canônico automático.

Para adotar um mapping, é necessário conhecer namespace, provider/binding revision, política de mapping, compatibilidade de tenant/site/recurso/ação, currentness e autoridade de adoção.

Isso preserva anti-lock-in e evita um erro mais grave: importar silenciosamente a política de autoridade de um fornecedor como se fosse a política da empresa.

## 13. Offline não pode aumentar poder

O System Builder pretende permitir sistemas autônomos. Autonomia, porém, não pode significar que perder conexão com a fonte superior aumente autoridade.

C3.8 especializa o conceito C0 de **Qualified Local Closure** para autorização offline. O fechamento local precisa declarar, entre outras coisas:

- quais sujeitos, ações e recursos são elegíveis;
- quais revisões de política e assignments foram retidas;
- por quanto tempo a evidência permanece aceitável;
- quais operações de alto risco são excluídas;
- quais dependências locais precisam permanecer saudáveis;
- como auditoria local será preservada;
- como reconciliação ocorrerá no reconnect.

Quando a evidência ultrapassa seu horizonte, a decisão passa a `INCONCLUSIVE` ou fail-closed conforme a política.

```text
disconnected != unrestricted
```

## 14. Fleet observa e orquestra; não fabrica autoridade

Fleet pode agregar estado de adoção de políticas, decisões stale, coortes residuais, latência, backlog, sites offline e propagação de grants/revokes.

Mas uma visão global não cria uma verdade local mais forte.

```text
Fleet desired policy
    != local applied policy
    != local current decision
```

Uma ordem vinda de Fleet também precisa estar autorizada. O site precisa registrar se a aplicou e com qual efeito/currentness.

Essa distinção evita que uma console central se torne, por acidente, uma autoridade irrestrita acima do próprio modelo empresarial.

## 15. Autorização também tem capacidade, filas e overload

Uma decisão de autorização não é um booleano sem custo. Em produção existem taxa de avaliações, latência, cache, dependências, quotas de providers, filas, fairness entre tenants e throughput de reconciliação.

Sob overload, duas tentações são perigosas:

1. prolongar silenciosamente a validade de decisões cached;
2. fail-open para “não parar o negócio”.

C3.8 rejeita a ideia de que pressão operacional possa fabricar autoridade. Prioridade de fila também não cria permissão.

Isso conecta Authorization à lente de Operability: uma arquitetura semanticamente correta ainda precisa demonstrar que consegue operar sob carga, degradação e reconciliação.

## 16. Brownfield: observar autoridade existente não é canonizá-la

Ao modelar uma empresa existente, o SB pode encontrar grupos de diretório, ACLs, roles locais, planilhas, grants de cloud, bypasses de suporte, permissões de banco e práticas emergenciais informais.

C1 + C3.8 exigem preservar a diferença epistemológica:

```text
observado != desejado
claim != canonical fact
existing grant != approved canonical policy
```

Esses elementos entram como fatos, claims, candidatos inferidos, unknowns, conflitos ou outras categorias epistemológicas com provenance/currentness. Práticas tácitas não devem ser apagadas, mas também não devem ser promovidas automaticamente.

## 17. O que muda na compreensão do System Builder

A visão anterior podia sugerir que autorização seria uma camada tradicional de RBAC enriquecida com Stations. C3.8 deixa claro que o problema é mais amplo.

O SB precisa preservar uma **cadeia de autoridade revisionada e demonstrável** que atravesse pessoas, automações, providers, sites, filas, execução durável e períodos de desconexão sem permitir amplificação silenciosa.

Isso explica por que capability, provider, binding, semantic owner, evidence, revision e runtime não podem ser misturados:

- **capability** diz qual responsabilidade semântica existe;
- **semantic owner** possui o significado canônico daquela responsabilidade;
- **provider** pode realizar parte da mecânica;
- **binding** liga uma realização qualificada à necessidade canônica;
- **evidence** sustenta uma afirmação sem virar automaticamente a verdade que observa;
- **revision** diz sob qual versão de política/assignment a afirmação foi produzida;
- **runtime** executa e precisa preservar os limites de autoridade recebidos.

A autorização é, portanto, um excelente exemplo da tese central da G2: **realização pode ser distribuída; significado e autoridade precisam continuar explicitamente governados**.

## 18. Riscos e trade-offs

Essa arquitetura é mais expressiva que um RBAC simples, mas também custa mais para implementar e operar. Existem mais identidades, revisões, evidências, reconciliação e estados intermediários.

O trade-off é deliberado. Simplificar demais produz facilidade local às custas de ambiguidades sistêmicas: revogação sem convergência, provider lock-in semântico, autorização stale, escalada por cache, cross-tenant acidental, IA com autoridade implícita e workflows que continuam usando permissões antigas.

Por outro lado, modelar toda decisão trivial com complexidade máxima também seria desperdício. A arquitetura precisa permitir políticas simples onde o risco é simples, preservando os primitives necessários quando o processo exige maior rigor.

## 19. O que você deve guardar deste apêndice

1. **Autenticação continua diferente de autorização.** Saber quem é não decide o que pode fazer.
2. **C3.8 tornou a autoridade canônica, revisionada e provider-neutral uma decisão de arquitetura alvo.**
3. **`Enterprise → Station → Role → Person` é monotônico e não amplificador.** Escopos inferiores não fabricam poder.
4. **`ALLOW`, `DENY` e `INCONCLUSIVE` são semanticamente diferentes.** Falta de evidência não é permissão.
5. **Políticas, delegações, approvals e break-glass possuem identidade e revisão.** Não são comentários ou flags eternos.
6. **Revogação é convergência.** `revoke accepted != authority eliminated everywhere`.
7. **Providers, UI, AGWS, Fleet e IA não se tornam fontes canônicas de autoridade.**
8. **Offline não pode aumentar autoridade.** Local closure é bounded e qualificada.
9. **Autorização é também um problema operacional.** Filas, overload, cache e reconciliação não podem enfraquecer os invariantes.
10. **Brownfield evidence não é política desejada automaticamente.** O SB precisa preservar provenance, currentness e incerteza.

## Referências autoritativas principais

- `project_docs/generation-2/planning/PLANNING_C_C3_08_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_TARGET.md`
- `project_docs/generation-2/planning/PLANNING_C_C3_07_IDENTITY_AUTHENTICATION_FEDERATION_TARGET.md`
- `project_docs/generation-2/planning/PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`
- `project_docs/generation-2/planning/PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`
- `project_docs/generation-2/planning/PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`
- `project_docs/generation-2/planning/PLANNING_A_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_SB_CURRENT_STATE.md`
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`

---

> **Nota editorial:** este apêndice registra a compreensão de uma decisão já tomada em Planning C C3.8. Ele não decide implementação, estrutura de código, migração, WBS, Work Packages ou Construction.