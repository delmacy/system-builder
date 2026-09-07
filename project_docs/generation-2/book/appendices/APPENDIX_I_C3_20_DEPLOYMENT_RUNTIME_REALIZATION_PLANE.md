# Apêndice I — C3.20: do “deploy concluído” ao runtime efetivamente realizado

**Camada editorial:** compreensão e síntese. Este apêndice não substitui `RESEARCH_PIPELINE_STATE.json`, Planning C ou qualquer decisão arquitetural autoritativa.

## 1. O problema humano: o botão ficou verde, mas o serviço mudou de verdade?

Em uma empresa, “deploy concluído” parece uma resposta binária. O operador publica uma nova versão do sistema de ordens de serviço, a ferramenta retorna sucesso e a expectativa natural é que todos já estejam usando a nova versão.

Em sistemas reais, porém, várias coisas podem ser verdade ao mesmo tempo: o provider aceitou a mudança, alguns processos novos já existem, outros ainda executam a geração anterior, a rota continua levando parte dos usuários ao runtime antigo, uma configuração ainda não foi adotada e um worker velho continua consumindo mensagens.

Planning C3.20 transforma esse problema em arquitetura alvo explícita.

**DECIDIDO:** Deployment / Environment / Runtime passa a possuir um **Deployment & Runtime Realization Plane** provider-neutral e qualificado por revisão. Sua função não é apenas solicitar infraestrutura, mas preservar a diferença entre intenção, aceitação, observação, readiness, tráfego e efeito real para consumidores.

A cadeia didática é:

```text
release atualmente admissível
        ↓
deployment plan revisionado
        ↓
prerequisites de runtime qualificados
        ↓
desired generation comprometida
        ↓
provider actuation
        ↓
provider outcome
        ↓
runtime realization observada
        ↓
readiness qualificada
        ↓
tráfego efetivo
        ↓
efeito para consumidor/serviço validado
```

O ponto central é simples: **cada seta pode falhar, atrasar, divergir ou ficar inconclusiva sem tornar automaticamente falsas as etapas anteriores.**

## 2. Oito planos de verdade

C3.20 organiza Deployment em oito planos ligados, mas não colapsados.

1. **Deployment Intent Plane:** identifica o deployment e a geração que a organização quer realizar.
2. **Environment & Target Plane:** define em qual contexto operacional, site ou target essa intenção pode ser realizada.
3. **Plan & Admission Plane:** liga a release a config/secrets, schema/data, trust, provider, policy e demais prerequisites.
4. **Rollout & Cohort Plane:** governa a substituição progressiva entre gerações.
5. **Observed Realization Plane:** registra o que provider e runtime permitem observar.
6. **Readiness & Effective Service Plane:** decide se aquela realização está pronta, alcançável e efetiva para a população aplicável.
7. **Recovery & Transition Plane:** governa rollback, roll-forward, cutover, drainage e reconciliação.
8. **Operability Plane:** relaciona capacidade, filas, overload, currentness, operação degradada/offline e evidência local/Fleet.

Essa decomposição não significa oito microserviços. Ela descreve **oito responsabilidades semânticas**. Uma instalação pequena pode materializá-las no mesmo processo sem perder a distinção conceitual.

## 3. Ambiente deixa de ser uma etiqueta

**DECIDIDO:** `Environment` não é apenas um texto como `dev`, `staging` ou `prod`. É um contexto operacional revisionado.

Ele pode qualificar, conforme o caso:

- escopo Enterprise/Station/site;
- providers permitidos;
- placement e residency;
- dependências esperadas;
- config e trust prerequisites;
- requisitos de capacidade;
- conectividade;
- horizontes offline/degradados;
- evidência exigida.

Da mesma forma, um `RuntimeTarget` não é simplesmente “cluster X” ou “host Y”. O recurso externo é uma realização. O target canônico expressa **onde semanticamente aquela carga pode existir e sob quais constraints**.

Isso evita um tipo de lock-in silencioso: transformar a nomenclatura do provider na ontologia operacional da empresa.

## 4. Desired, accepted, observed e effective

Antes de C3.20, o livro já ensinava:

```text
desired != observed != effective
```

Planning C agora torna a separação mais precisa:

```text
desired generation
    != provider-accepted mutation
    != provider-reported realization
    != observed running generation
    != ready generation
    != traffic-serving generation
    != consumer-effective generation
```

### Exemplo

A empresa deseja `OS-G42` com quatro workloads.

O provider aceita quatro replicas. Quatro containers aparecem. Três ficam ready. A rota envia 80% do tráfego para G42 e 20% para G41. Um worker G41 ainda possui jobs em andamento.

Qual é o status?

A pergunta “deu certo?” é insuficiente. Há vários fatos simultâneos. C3.20 exige que eles permaneçam representáveis sem serem achatados em um único `DEPLOYED=true`.

## 5. Readiness é uma conclusão qualificada

**DECIDIDO:** readiness é uma `QualifiedClaim`, não sinônimo de health check.

Um processo responder HTTP 200 pode ser apenas uma evidência. Readiness pode depender de schema compatível, secret/config current, trust válido, dependências disponíveis, rota alcançável e, quando necessário, prova de serviço para consumidor.

Resultados podem precisar distinguir estados equivalentes a:

```text
READY
NOT_READY
PARTIAL
INCONCLUSIVE
STALE
```

`INCONCLUSIVE` é especialmente importante. Ausência, contradição ou envelhecimento de evidência não devem ser promovidos silenciosamente a sucesso.

## 6. Replica não é capacidade

Uma das correções conceituais mais úteis de C3.20 é:

```text
replica count != capacity != headroom != stability
```

Dez workers não significam necessariamente o dobro da capacidade de cinco. Eles podem disputar o mesmo banco, atingir quota externa, sofrer backlog crescente ou depender de um provider saturado.

Por isso scaling é melhor lido como uma cadeia:

```text
desired workload capacity
        ↓
provider target
        ↓
observed running instances
        ↓
ready instances
        ↓
effective serving capacity
        ↓
measured headroom
```

A quantidade de instâncias é uma variável de realização; capacidade é uma propriedade qualificada do trabalho que realmente pode ser sustentado.

## 7. Rollout é mudança de população

**DECIDIDO:** rollout é uma transição revisionada e consciente de **cohorts** — grupos de runtimes ou consumidores que podem estar em estados diferentes durante a mudança.

Rolling, canary e blue/green são realizações possíveis. Nenhuma delas vira a semântica universal do SB.

O modelo portátil precisa preservar:

- geração e cohorts alvo;
- critérios de promoção;
- janela de observação;
- pause/resume/abort;
- exposição de tráfego;
- disponibilidade mínima;
- falha ou `UNKNOWN`;
- população residual da geração antiga.

Assim:

```text
all desired replicas created
    != rollout converged
    != consumer-effective service proven
```

## 8. Residual runtime cohorts: o passado ainda pode produzir efeito

Após o cutover, podem permanecer workers, sessões, callbacks, rotas, subscriptions, caches ou processos antigos capazes de produzir efeitos.

C3.20 trata essa população residual explicitamente.

```text
nova geração ativa
+ geração anterior ainda capaz de agir
= transição ainda não plenamente encerrada
```

A solução não é sempre “matar tudo”. Dependendo do workload, pode ser necessário drenar, fencing, concluir jobs, reconciliar ou dar disposition explícita ao residual.

Esse ponto conecta Deployment a Lifecycle, Workflow, Authorization, Providers e aos problemas de concorrência explicados no Capítulo 18.

## 9. Rollback é uma decisão atual, não nostalgia operacional

Ter a imagem anterior armazenada não prova que voltar seja seguro.

**DECIDIDO:** Artifact/Release possui a verdade sobre a elegibilidade atual de uma release como candidata a rollback. Deployment possui a atuação e a prova da transição de runtime.

Entre a versão antiga e o estado atual podem ter mudado:

- schema e dados;
- secrets/config;
- trust e security posture;
- provider support;
- dependencies;
- residency/policy;
- disponibilidade do próprio artefato.

Logo:

```text
rollback artifact available
    != rollback currently eligible
    != rollback authorized
    != rollback actuated
    != rollback converged
```

Quando rollback deixou de ser seguro, o caminho correto pode ser roll-forward ou recovery.

## 10. UNKNOWN continua sendo um estado legítimo

Uma mutação remota pode ser aplicada e a conexão cair antes da confirmação. Repetir a operação pode duplicar ou ampliar efeitos.

C3.20 herda e concretiza a álgebra:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

Quando idempotência exata não está qualificada:

```text
UNKNOWN → reconcile-before-retry
```

Essa regra vale para deployment porque “não recebi confirmação” descreve conhecimento do observador, não necessariamente o estado do mundo.

## 11. Autonomia local ganha uma forma mais precisa

O livro já defendia que runtime autônomo não significa independência absoluta. C3.20 torna isso mais concreto com `QualifiedLocalRuntimeClosure`.

**DECIDIDO:** operação local/offline pode continuar apenas dentro de uma closure qualificada e de horizontes explícitos de currentness e autoridade.

Isso significa que o runtime pode sobreviver à indisponibilidade do control plane sem inventar fatos que deveriam ter sido renovados externamente.

```text
control plane indisponível
        ↓
closure local ainda válida?
   sim / não / inconclusivo
        ↓
continua bounded ou degrada/falha
        ↓
reconexão
        ↓
reconcile + requalify
```

E permanece a desigualdade:

```text
Fleet aggregate != Station/local runtime truth
```

Um painel central não prova sozinho o que um runtime local está efetivamente executando.

## 12. Provider substitution é uma transição, não uma troca de URL

Trocar Kubernetes por outro orchestrator, um runtime local por cloud ou um load balancer por outro não é apenas remapear chamadas.

C3.20 exige qualificação, coexistência, cutover, fencing e drainage de recursos, rotas, sessões, workers e outras populações residuais.

O provider pode oferecer mecânicas excelentes. O SB preserva a semântica que precisa sobreviver à troca.

```text
provider API support
    != semantic equivalence
```

## 13. O que mudou editorialmente

Este apêndice registra uma evolução histórica importante.

No `CHAPTER_11 v1.0.0`, várias estruturas eram corretamente apresentadas como fronteiras decididas em Planning A, evidências do SB atual ou hipóteses cuja forma concreta seria definida posteriormente.

Agora C3.20 está **DECIDIDO / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**. Portanto, conceitos como o Deployment & Runtime Realization Plane, os oito truth planes, identidades/revisões canônicas, desired/provider-accepted/observed/effective separation, rollout por cohorts, readiness como QualifiedClaim, QualifiedLocalRuntimeClosure e provider-substitution convergence já não devem ser descritos apenas como hipótese arquitetural.

Isso **não significa que estejam implementados**. A sequência correta continua sendo:

```text
arquitetura alvo decidida
    != migração planejada
    != Work Package materializado
    != código construído
    != comportamento provado em produto
```

## O que você deve guardar deste apêndice

C3.20 muda a pergunta de Deployment.

A pergunta deixa de ser:

> “o provider aceitou o deploy?”

E passa a ser:

> “qual intenção revisionada foi autorizada, o que foi aceito, o que foi observado, qual população está pronta, quem recebe tráfego, qual geração é efetiva para o consumidor e quais resíduos ainda podem produzir efeito?”

Guarde estas separações:

```text
release admitted != runtime admitted

desired != accepted != observed != ready != serving != consumer-effective

replica count != capacity

health != readiness

rollout complete != business/service effectiveness proven

rollback available != rollback eligible != rollback converged

Fleet aggregate != local runtime truth

UNKNOWN -> reconcile-before-retry
```

Elas permitem que o System Builder continue simples em instalações pequenas sem perder a semântica necessária para crescer, operar offline de forma bounded, substituir providers e explicar com precisão o que realmente está em produção.

## Referências internas autoritativas consultadas

Este apêndice sintetiza principalmente:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/planning/PLANNING_C_C3_20_DEPLOYMENT_ENVIRONMENT_RUNTIME_TARGET.md`;
- `project_docs/generation-2/book/chapters/CHAPTER_11_DEPLOYMENT_RUNTIME_AUTONOMO_WORKLOAD_ESCALABILIDADE.md` como versão editorial histórica a ser posteriormente revisada de forma bounded;
- decisões C0/C1/C2 e C3 anteriores apenas quando C3.20 as herda explicitamente.
