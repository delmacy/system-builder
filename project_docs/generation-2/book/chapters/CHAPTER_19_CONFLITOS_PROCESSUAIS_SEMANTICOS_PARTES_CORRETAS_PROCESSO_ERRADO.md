# Capítulo 19 — Conflitos processuais e semânticos: quando partes corretas formam um processo errado — v1.0.0

**Chapter ID:** `CHAPTER_19`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada de autoridade:** síntese didática; não substitui pesquisa, Planning, gates, findings, edge-case registers ou arquitetura alvo.

---

## 1. O problema humano: tudo está certo isoladamente, mas a empresa faz a coisa errada

Imagine uma empresa em que quatro regras são perfeitamente razoáveis quando lidas separadamente:

1. a manutenção preventiva deve ser feita antes que um equipamento ultrapasse determinado número de horas de uso;
2. equipamentos críticos não podem ser retirados de operação durante uma janela de alta demanda;
3. uma OS preventiva precisa de um técnico com determinada certificação;
4. horas extras acima de um limite exigem aprovação adicional.

Nenhuma regra parece errada. Agora suponha que o único técnico certificado esteja no limite de horas, que a janela de alta demanda termine depois do prazo máximo da preventiva e que o equipamento não possa continuar operando sem violar a regra de manutenção.

O sistema pode chegar a uma situação em que **todas as regras locais são válidas e, ainda assim, não existe uma ação que satisfaça todas ao mesmo tempo**.

Esse é um dos problemas centrais que a Generation 2 está pesquisando.

```text
correção local
    + correção local
    + correção local
    + correção local

        !=

garantia de correção da composição
```

A empresa real é uma composição de processos, regras, pessoas, dados, recursos, providers, revisões, cálculos, políticas e objetivos. Quanto mais rico o System Builder se torna, maior é o risco de duas partes legitimamente corretas entrarem em contradição quando usadas juntas.

Este capítulo chama esse fenômeno de **conflito processual ou semântico**.

**DECIDIDO NA PESQUISA:** o objetivo não é tentar prever e proibir todo conflito futuro. O objetivo é tornar as classes de conflito explícitas o suficiente para que o SB possa reconhecer sinais, classificar situações, identificar owners e encaminhar uma correção bounded quando as condições de ativação realmente existirem.

---

## 2. Erro de componente e conflito de composição não são a mesma coisa

Um bug convencional pode estar contido em uma peça.

```text
função soma horas incorretamente
parser rejeita data válida
formulário grava campo errado
```

Um conflito de composição pode ocorrer mesmo quando cada peça cumpre seu próprio contrato.

Exemplo:

```text
Política A:
  minimizar custo de infraestrutura

Política B:
  manter capacidade de reserva para falha

FinOps escolhe:
  reduzir réplicas para cortar custo

Resilience exige:
  preservar redundância mínima
```

FinOps pode ter produzido uma recomendação economicamente correta. Security/Resilience pode ter produzido uma exigência tecnicamente correta. O conflito aparece porque **os objetivos não são simultaneamente satisfazíveis nas condições atuais sem uma prioridade ou exceção explícita**.

Isso leva a uma regra importante:

```text
component-valid
    != composition-valid
```

O System Builder precisa, portanto, estudar não apenas “esta capability funciona?”, mas também:

> “o que acontece quando esta capability, ainda correta, encontra outra capability também correta?”

---

## 3. O vocabulário que impede o livro de transformar hipótese em defeito

A pesquisa G2 separa deliberadamente cinco conceitos.

### 3.1 `ConflictPattern`

Um **padrão de conflito** (`ConflictPattern`) é uma descrição reutilizável de uma composição potencialmente contraditória ou insegura.

Exemplo:

```text
retenção exige apagar dado
legal hold exige preservar o mesmo dado
```

O padrão pode ser conhecido mesmo que nenhum sistema real esteja naquele estado.

### 3.2 `ActivationCondition`

A **condição de ativação** (`ActivationCondition`) responde:

> Em quais circunstâncias concretas este padrão se torna relevante?

No exemplo anterior:

- o registro pertence a uma população cuja retenção expirou;
- existe um legal hold válido e atual cobrindo exatamente aquele registro ou população;
- ambos os comandos são aplicáveis no mesmo momento.

Sem essas condições, o padrão continua sendo apenas uma possibilidade catalogada.

### 3.3 `ConflictSignal`

Um **sinal de conflito** (`ConflictSignal`) é evidência de que um padrão talvez esteja ativado ou de que o risco aumentou.

Exemplo:

```text
retention_job: delete candidate
legal_hold_index: possible match
```

Isso ainda não prova que o mesmo registro está realmente coberto por uma obrigação vigente.

### 3.4 `ConflictInstance`

Uma **instância de conflito** (`ConflictInstance`) é a manifestação observada e reproduzível de um conflito em um sistema, revisão ou contexto concreto.

Agora há evidência suficiente para dizer:

```text
registro X
retention rule R17 -> DELETE
legal hold H9 -> MUST_PRESERVE
ambos atuais e aplicáveis
```

### 3.5 `ConflictAssessment`

A **avaliação do conflito** (`ConflictAssessment`) acrescenta contexto para decidir como tratar a instância:

- severidade;
- confiança;
- owners envolvidos;
- blast radius;
- reversibilidade;
- currentness das evidências;
- tempo até dano;
- possibilidade de prevenção estática ou necessidade de reconciliação humana/runtime.

A separação completa é:

```text
ConflictPattern
    -> ActivationCondition
    -> ConflictSignal
    -> ConflictInstance
    -> ConflictAssessment
```

E duas desigualdades são obrigatórias:

```text
ConflictPattern != ConflictInstance
Signal != ConfirmedConflict
```

**DECIDIDO NA PESQUISA:** catalogar um padrão não autoriza abrir implementação corretiva como se o produto já estivesse defeituoso.

---

## 4. O ciclo de vida de um conflito

A classificação autoritativa propõe um ciclo explícito:

```text
ELICITED_PATTERN
       |
       v
APPLICABLE / NOT_APPLICABLE / UNKNOWN
       |
       v
SIGNALLED
       |
       v
OBSERVED
       |
       v
CONFIRMED
       |
       v
ROUTED
       |
       +--> RESOLVED
       +--> ACCEPTED_RISK
       +--> SUPERSEDED
```

A pesquisa normalmente para muito antes de `RESOLVED`.

Ela pode descobrir o padrão, registrar condições de ativação, sugerir sinais e apontar owners. Resolver uma ocorrência concreta depende de evidência concreta ou de uma fase posterior autorizada que transforme determinado padrão universal em obrigação arquitetural.

Esse cuidado evita dois erros opostos.

O primeiro é ignorar conflitos até que prejudiquem uma operação real. O segundo é tornar o sistema excessivamente restritivo tentando proibir antecipadamente toda combinação que poderia ser perigosa em algum domínio possível.

---

## 5. Conflitos estruturais: quando o grafo é possível de desenhar, mas não de executar corretamente

Processos podem ser representados como grafos de estados, atividades, condições e transições. Um grafo sintaticamente válido não é necessariamente operacionalmente coerente.

### 5.1 Estado inalcançável

```text
INÍCIO -> TRIAGEM -> EXECUÇÃO -> FIM
                     
                     APROVAÇÃO
```

Se não existe nenhuma transição para `APROVAÇÃO`, aquele estado pode estar modelado e nunca ser alcançado.

### 5.2 Ciclo não intencional

```text
ANALISAR
   -> REVISAR
      -> ANALISAR
```

Ciclos podem ser legítimos. O conflito aparece quando o ciclo não possui condição de término, limite, progresso observável ou intenção explícita.

### 5.3 Fan-in impossível

Um nó exige simultaneamente:

```text
Aprovado pelo Financeiro
E
Rejeitado pelo Financeiro
```

As duas entradas podem existir isoladamente, mas a composição criou uma pré-condição impossível.

**Como detectar:** análise estática de grafo, reachability, ciclos, deadlocks, branch overlap e postconditions.

**Limitação:** análise estrutural não entende automaticamente toda semântica empresarial. Um ciclo pode ser desejado; dois terminais podem representar alternativas legítimas.

---

## 6. Conflitos de estado e transição

Dois participantes podem acreditar, ao mesmo tempo, que têm direito de realizar transições incompatíveis.

```text
OS = AGUARDANDO

A: aprovar
B: cancelar
```

O Capítulo 18 mostrou a dimensão de concorrência. Aqui aparece a dimensão semântica: **qual combinação de estados é permitida pelo negócio?**

Possíveis problemas incluem:

- cancelar versus concluir;
- aprovar versus rejeitar;
- pagar versus estornar;
- reservar versus liberar;
- encerrar workflow enquanto um efeito dependente permanece `PARTIAL` ou `UNKNOWN`;
- duas capabilities reivindicarem a mesma transição canônica.

A solução não é necessariamente “colocar um lock”. Lock coordena acesso; ele não decide qual transição tem precedência empresarial.

---

## 7. Conflitos de semantic ownership

Este é um dos conflitos mais importantes para o System Builder.

Considere um provider de RH que retorna:

```text
employee.status = active
```

O módulo organizacional do SB possui um fato canônico diferente:

```text
PersonAssignment = suspended
```

Se uma integração tratar o `active` do provider como verdade canônica de autorização, ela atravessa uma fronteira semântica.

O problema não é necessariamente dado incorreto. Os dois valores podem significar coisas diferentes:

- `active` no provider = cadastro ativo;
- `suspended` no owner = pessoa temporariamente sem autoridade naquele Station.

Um conflito semântico aparece quando sistemas ou capabilities diferentes tratam representações distintas como se fossem o **mesmo fato com o mesmo significado**.

Por isso:

```text
provider evidence != canonical enterprise truth
UI affordance != authorization
workflow state != domain truth inteira
telemetry != semantic owner state
```

A função de `semantic owner` é tornar explícito quem possui autoridade sobre qual significado.

---

## 8. Regras, fórmulas e condições individualmente válidas podem ser conjuntamente impossíveis

Considere duas regras:

```text
R1: desconto >= 20% exige gerente
R2: gerente não pode aprovar pedidos próprios
```

Agora uma terceira:

```text
R3: naquela Station, somente o gerente pode criar compras acima de R$ 50 mil
```

Se o gerente cria um pedido próprio de R$ 60 mil com desconto de 25% e não existe outro papel autorizado, nenhuma regra está necessariamente errada isoladamente. A composição criou uma rota sem ator elegível.

O mesmo pode acontecer com fórmulas:

```text
Fórmula A usa custo em BRL
Threshold B foi definido em USD
```

ou:

```text
workflow longo nasceu sob fórmula v3
relatório histórico recalcula com fórmula v5
```

A aritmética pode estar correta e a semântica histórica errada.

Técnicas úteis incluem análise de overlap/gaps, tipos/unidades, revisão historicamente aplicável, satisfiability e propriedades/invariantes.

---

## 9. Conflitos temporais e de ordering

Um sistema distribuído não possui uma única linha do tempo simples.

Podem existir:

- eventos atrasados;
- relógios divergentes;
- timers concorrentes;
- retries antigos chegando depois de eventos mais novos;
- workflows longos atravessando revisões;
- dependências circulares de precedência.

Exemplo:

```text
A só pode executar depois de B
B só pode executar depois de A
```

Cada pré-condição pode parecer razoável quando examinada dentro de seu módulo. Juntas, formam deadlock semântico.

Outro exemplo:

```text
prazo SLA = 30 min
aprovação obrigatória = até 2 h
```

O processo pode ser estruturalmente correto e matematicamente impossível de satisfazer em todas as execuções.

---

## 10. Conflitos de recurso e capacidade

Dois processos podem ser corretos e competir pelo mesmo recurso indivisível.

```text
OS-A precisa do único gerador reserva
OS-B precisa do mesmo gerador reserva
```

Isso vale para:

- técnicos;
- equipamentos;
- estoque;
- salas;
- veículos;
- quota de provider;
- orçamento;
- capacidade computacional.

Há ainda um caso mais sutil: cada departamento pode respeitar seu orçamento local, mas a soma ultrapassar uma restrição empresarial compartilhada.

```text
local-valid allocations
    != enterprise-capacity-valid allocation set
```

É por isso que resource qualification pode precisar ocorrer novamente imediatamente antes da atuação, e não apenas no planejamento inicial.

---

## 11. Autoridade, responsabilidade e separation of duties

Uma automação pode ser funcionalmente correta e ainda produzir uma violação de responsabilidade.

Exemplos:

- mesma pessoa solicita e aprova uma operação restrita;
- workflow atribui tarefa a quem não possui autoridade;
- autoridade é revogada enquanto trabalho permanece in flight;
- regra local tenta enfraquecer restrição herdada do Enterprise;
- delegações sobrepostas criam dois decisores concorrentes;
- UI oferece botão que a policy authoritative nega.

Aqui aparece novamente uma separação importante:

```text
responsibility != authority
visibility != authority
authentication != authorization
```

A existência de uma rota técnica não prova legitimidade organizacional para executá-la.

---

## 12. Policy e compliance: quando duas obrigações legítimas colidem

Algumas contradições não têm uma solução universal automática.

Exemplo clássico:

```text
retention policy -> DELETE
legal hold -> PRESERVE
```

Outro:

```text
SLA -> enviar dados ao provider mais rápido
residency policy -> destino não permitido
```

Ou:

```text
cost policy -> provider A
security policy -> provider A não qualificado
```

O System Builder não deve resolver essas situações por uma ordem arbitrária como “a última regra cadastrada vence”.

A resolução exige evidência de precedência, autoridade, escopo e aplicabilidade.

Alguns conflitos podem ser prevenidos estaticamente; outros precisam ser apresentados a um owner competente; outros podem exigir exceção formal e risco aceito.

---

## 13. Dados e consistência

Conflitos de dados surgem quando representações ou mutações são localmente aceitáveis e globalmente incompatíveis.

Exemplos:

- duas rotas gravam o mesmo fato com postconditions diferentes;
- um valor derivado é tratado como fato armazenado sem política de materialização;
- uma leitura stale autoriza mutação destrutiva;
- schema novo é incompatível com workflow antigo ainda ativo;
- dois IDs representam a mesma pessoa real;
- importação brownfield traz significado diferente para um campo aparentemente equivalente.

O problema é especialmente perigoso quando o sistema consegue persistir os dados sem erro técnico.

```text
write succeeded
    != semantic consistency preserved
```

---

## 14. Providers e integrações

Dois providers podem anunciar a mesma feature e oferecer semânticas diferentes.

```text
Provider A: "cancel" garante que nenhum efeito posterior ocorrerá
Provider B: "cancel" apenas solicita cancelamento e pode haver efeitos residuais
```

Uma abstração que chama ambos simplesmente de `cancel()` pode esconder uma diferença crítica.

Conflitos comuns incluem:

- provider acceptance versus downstream effective state;
- IDs externos colidindo ou mudando;
- retry/idempotency incompatíveis;
- old/new providers coexistindo após cutover;
- provider-native state promovido a verdade canônica;
- fallback semanticamente mais fraco que a operação original.

Anti-lock-in não elimina essas diferenças. Ele exige que elas sejam qualificadas e visíveis.

---

## 15. Versionamento, migração e coexistência

O Capítulo 13 mostrou que uma empresa não muda como um único `v1 -> v2`. Esse fato cria um espaço enorme para conflitos.

```text
workflow v1 + schema v2
formula v3 + policy v4
runtime antigo + binding novo
consumer antigo + canonical state novo
```

Cada revisão pode ser válida no seu próprio contexto e incompatível com outra revisão também válida.

Um rollout concluído no control plane também não prova que cohorts residuais deixaram de produzir efeitos.

Por isso a pesquisa procura:

- compatibility direction;
- migration readiness/currentness;
- residual cohorts;
- rollback eligibility atual;
- correction/supersession lineage;
- version skew explícito.

---

## 16. Recovery e compensação podem criar novos conflitos

Recuperar não significa simplesmente restaurar um backup ou reiniciar um processo.

Imagine:

```text
processo A reserva equipamento
processo B passa a tratá-lo como ocupado
falha ocorre
recovery de A restaura snapshot antigo = equipamento livre
```

A restauração local pode ressuscitar um estado incompatível com os efeitos posteriores de B.

Outro exemplo:

```text
pagamento ocorreu
workflow ficou UNKNOWN
operador compensa manualmente
callback atrasado confirma pagamento
retry automático cria novo pagamento
```

Cada mecanismo — callback, compensação, retry — pode ser legítimo isoladamente. A ordem produz um estado empresarial incorreto.

Por isso recovery precisa considerar lineage, currentness, fencing, residual cohorts e estado externo, não apenas arquivos restaurados.

---

## 17. Procedimentos humanos também fazem parte do sistema

O System Builder modela empresas, não apenas software.

Duas instruções humanas podem entrar em conflito:

```text
Manual A: em falha, desligue o equipamento imediatamente.
Manual B: antes de desligar, aguarde autorização do centro de controle.
```

Se ambas se aplicam ao mesmo incidente, o operador precisa de precedência clara.

Outros conflitos incluem:

- responsabilidade duplicada;
- ninguém claramente responsável;
- escalations circulares;
- workaround manual alterando estado fora do workflow;
- instrução em ordem incompatível com pré-condição real.

Uma UI perfeitamente implementada não resolve uma instrução organizacional contraditória.

---

## 18. Cross-process e objective conflicts

Uma empresa possui muitos processos simultâneos.

Um processo de manutenção pode precisar parar uma máquina exatamente quando um processo de produção precisa maximizar throughput.

Um processo de custo pode querer reduzir estoque enquanto um processo de disponibilidade quer preservar peças críticas.

Um algoritmo pode tentar:

```text
minimizar custo
maximizar velocidade
maximizar disponibilidade
minimizar estoque
maximizar segurança
```

Esses objetivos não são universalmente compatíveis.

A arquitetura não deve esconder a escolha dentro de um score opaco.

```text
optimization score != enterprise policy
```

Prioridade, trade-off e exceção precisam permanecer ligados a authority e semantic ownership apropriados.

---

## 19. IA e low-code: a composição torna esse problema ainda mais importante

IA e low-code aumentam drasticamente a velocidade de composição.

Isso é uma vantagem, mas também produz um novo risco: componentes conhecidos como seguros podem ser montados em sequências perigosas.

Exemplo:

```text
Ação 1: criar usuário
Ação 2: conceder papel
Ação 3: liberar pagamento
```

Cada ação pode exigir autorização correta isoladamente. Uma automação gerada que execute as três em sequência sob um contexto indevido pode criar amplificação de autoridade.

Outro caso:

```text
AI gera condição válida
AI gera fórmula válida
AI gera workflow válido
```

A combinação pode violar uma policy, criar deadlock ou contradizer um semantic owner.

Por isso:

```text
valid generated fragments
    != valid generated composition
```

**DECIDIDO NA PESQUISA:** IA/low-code não se tornam autoridade por conseguirem compor. A composição precisa permanecer dentro dos owners, invariantes e envelopes de autoridade aplicáveis.

---

## 20. Como detectar conflitos sem fingir que todo sinal é certeza

A pesquisa organiza candidatos de detecção em quatro momentos.

### 20.1 Design-time / estático

Pode detectar:

- ciclos e unreachable states;
- sobreposição ou lacuna de regras;
- dependência circular de fórmulas;
- incompatibilidade de tipos/unidades;
- separation-of-duty impossível;
- version compatibility conhecida;
- provider support mismatch;
- combinações pairwise/N-wise de constraints.

### 20.2 Pre-execution

Pode requalificar:

- autoridade atual;
- recurso ainda disponível;
- provider ainda qualificado;
- revisão de fórmula/schema/policy;
- evidence freshness;
- rollback/recovery eligibility.

### 20.3 Runtime

Pode observar:

- mutações concorrentes incompatíveis;
- transição inesperada;
- dois efeitos autoritativos concorrentes;
- deadlock/starvation/backlog;
- old cohorts ainda produzindo efeito;
- divergência entre comportamento e invariant declarado.

### 20.4 Post-effect / audit

Pode encontrar:

- acknowledgement de sucesso sem postcondition;
- resultado histórico incompatível com revisão produtora;
- execução sem authority/policy path compatível;
- side effect de um processo violando invariant de outro.

Nenhuma dessas técnicas elimina false positives.

Por isso:

```text
detector output
    -> evidence
    -> assessment
    -> possible confirmation
```

não:

```text
detector output -> automatic truth
```

---

## 21. Nem todo conflito deve ser proibido

Este é um ponto importante para evitar que o System Builder vire um engine rígido demais.

Alguns padrões justificam invariantes universais fortes. Outros são dependentes do domínio.

Exemplo universal plausível:

```text
não tratar UNKNOWN mutation como NOT_APPLIED silenciosamente
```

Exemplo dependente de empresa:

```text
supervisor pode ou não aprovar própria solicitação em determinado processo
```

Uma empresa pode proibir sempre. Outra pode permitir abaixo de certo valor. Outra pode exigir segundo aprovador.

A pesquisa, portanto, distingue futuros tratamentos possíveis:

- rejeitar composição inválida;
- avisar e pedir acknowledgement;
- exigir evidência adicional;
- exigir reconciliação humana;
- selecionar semantic owner;
- serializar efeitos;
- requalificar authority/policy/resource;
- pin/migrate revision;
- reconcile UNKNOWN antes de retry;
- compensar efeito bounded;
- isolar provider/process path;
- abrir evolução controlada;
- aceitar risco por exceção autorizada.

O livro não escolhe esses tratamentos para casos ainda hipotéticos.

---

## 22. Como classificar um conflito concreto

Quando um conflito real existir, um único score é insuficiente.

É útil registrar dimensões como:

```text
scope
  local | cross-capability | cross-process | enterprise

type
  structural | semantic | state | temporal | data | resource
  authority | policy | formula | provider | version | recovery
  human | objective | AI/low-code

activation
  static | runtime | temporal | concurrent | provider
  revision | human

severity
confidence
detectability
blast radius
reversibility
time to harm
misuse likelihood
evidence currentness
owner set
```

Dois conflitos de mesma “severidade” podem exigir tratamentos muito diferentes se um é facilmente reversível e o outro produz efeitos externos irreversíveis.

---

## 23. Onde a analogia do trânsito ajuda — e onde ela falha

Uma analogia útil é um cruzamento.

Cada rua pode estar corretamente construída. Cada motorista pode obedecer à própria faixa. Ainda assim, sem regras de prioridade, duas trajetórias corretas podem colidir.

O System Builder precisa conhecer:

- as trajetórias;
- os recursos compartilhados;
- as regras de prioridade;
- os sinais de conflito;
- quem tem autoridade para resolver exceções.

A analogia deixa de valer tecnicamente porque processos empresariais podem ter estado histórico, efeitos irreversíveis, providers remotos, eventual consistency, revisões coexistentes e incerteza `UNKNOWN`; um cruzamento físico comum não representa toda essa semântica.

---

## 24. Por que isso importa para o System Builder

A proposta do SB é representar e materializar processos empresariais reais. Isso significa que, conforme a plataforma ganhar breadth e depth, ela precisará conviver com interações que nenhum módulo isolado consegue avaliar por completo.

A pesquisa de conflitos existe para impedir quatro ilusões:

```text
“cada módulo passou nos testes, então o processo está correto”

“cada regra é válida, então todas juntas são válidas”

“o detector alertou, então existe defeito confirmado”

“conhecemos o padrão, então devemos proibi-lo universalmente”
```

Nenhuma dessas conclusões é segura.

O objetivo mais maduro é:

```text
compreender padrões
    -> observar activation conditions
    -> coletar evidence
    -> classificar
    -> identificar owners
    -> escolher tratamento bounded
```

Isso torna o sistema mais capaz de explicar e governar complexidade sem fingir que toda complexidade pode ser removida antecipadamente.

---

## 25. Relação com os outros capítulos

Este capítulo conecta praticamente todo o livro.

- **Capítulo 03:** conflitos de semantic ownership e provider realization.
- **Capítulos 05–06:** composição low-code, workflow, ações e integrações.
- **Capítulo 07:** autoridade, responsabilidade e separation of duties.
- **Capítulos 08–09:** dados, schema, privacidade, fórmulas e aplicabilidade histórica.
- **Capítulos 10–13:** artefatos, deployment, providers, version skew, coexistência e rollback.
- **Capítulos 14–15:** evidência, incidentes, trust, recovery e false safety.
- **Capítulo 16:** objetivos comerciais/econômicos potencialmente conflitantes.
- **Capítulos 17–18:** famílias de teste, concorrência, UNKNOWN, retry e idempotência.
- **Capítulo 20:** técnicas sistemáticas para procurar essas combinações perigosas.

---

## 26. O que você deve guardar deste capítulo

1. **Partes corretas podem formar uma composição incorreta.** Correção local não prova correção empresarial global.
2. **`ConflictPattern != ConflictInstance`.** Conhecer uma classe de risco não significa que o produto ou um cliente possua o defeito.
3. **`Signal != ConfirmedConflict`.** Detectores produzem evidência; confirmação depende de activation conditions e assessment.
4. **Conflitos podem ser estruturais, semânticos, temporais, de estado, fórmula, recurso, authority, policy, dados, provider, versão, recovery, procedimento humano, objetivo ou composição IA/low-code.**
5. **Nem todo conflito deve ser proibido estaticamente.** Alguns precisam de warning, requalification, human reconciliation ou regras específicas do domínio.
6. **Semantic owners continuam essenciais.** Um resolvedor genérico não deve escolher arbitrariamente entre verdades empresariais concorrentes.
7. **A pesquisa G2 cataloga e classifica antes de corrigir.** Remediação concreta exige evidência concreta ou obrigação posterior autorizada.
8. **O System Builder precisa ser capaz de reconhecer complexidade sem se transformar em um semantic god-object.**

---

## Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
- artefatos Planning A/B e edge-case registers já sintetizados nos capítulos anteriores, usados apenas como contexto editorial para exemplos cross-capability.

A autoridade sobre pesquisa, findings, classificação, gates e arquitetura permanece nesses artefatos, não neste capítulo.
