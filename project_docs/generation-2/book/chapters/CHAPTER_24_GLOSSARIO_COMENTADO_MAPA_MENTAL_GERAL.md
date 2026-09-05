# Capítulo 24 — Glossário comentado e mapa mental geral — v1.0.0

**ID editorial:** `CHAPTER_24`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não substitui pesquisa, synthesis, Planning, gates ou arquitetura alvo.  
**Data:** 2026-09-05

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: depois de aprender as partes, precisamos enxergar o todo

Ao longo deste livro apareceram dezenas de termos que, isoladamente, parecem simples: capability, provider, binding, revision, evidence, runtime, release, entitlement, incident, recovery, idempotência. O problema real começa quando todos aparecem juntos.

Uma empresa não funciona em capítulos. Uma OS pode envolver identidade, autorização, workflow, dados, storage, cálculo, integração, provider externo, observabilidade, cobrança, recovery e evolução de versão na mesma jornada. Se o leitor entender cada termo isoladamente, mas não souber **quem é dono de qual verdade e como as transições se conectam**, ainda faltará o principal modelo mental da Generation 2.

Este capítulo fecha a primeira sequência editorial fazendo duas coisas:

1. organiza o vocabulário por famílias de significado;
2. oferece mapas mentais para navegar entre as 28 capabilities sem tratá-las como 28 módulos obrigatórios.

**DECIDIDO:** a síntese canônica da G2 trabalha com 28 capabilities e primitives transversais reutilizáveis. Isso é uma taxonomia de responsabilidades semânticas; não é uma topologia de software pronta.

**EM PESQUISA:** a campanha adversarial continua aberta no snapshot desta edição. Portanto, este mapa é uma fotografia editorial do entendimento atual, não uma declaração de arquitetura alvo fechada.

## 2. O primeiro mapa: cinco perguntas para não se perder

Quase qualquer assunto técnico do System Builder pode ser localizado começando por cinco perguntas.

```text
1. Qual verdade está sendo afirmada?
              ↓
2. Quem é o semantic owner dessa verdade?
              ↓
3. Em qual revisão, escopo e contexto ela vale?
              ↓
4. Qual realização/provider/runtime está produzindo ou executando isso?
              ↓
5. Que evidência prova o estado efetivo sem ampliar autoridade?
```

Essas perguntas parecem abstratas, mas são muito práticas.

**EXEMPLO DIDÁTICO:** um provider de e-mail informa “mensagem aceita”. A verdade canônica não é automaticamente “cliente recebeu o e-mail”. Messaging pode possuir delivery-attempt semantics; Provider/Binding qualifica a realização; Observability pode registrar evidência; Workflow pode estar esperando determinado efeito. `accepted != delivered != acknowledged`.

O mesmo padrão aparece em deployment, billing, storage, recovery e autorização.

## 3. O grande mapa das 28 capabilities

A síntese agrupa as 28 capabilities em seis famílias. O objetivo desta divisão é orientar ownership, não sugerir seis serviços ou seis pastas.

```text
SYSTEM BUILDER G2
│
├─ A. Semântica e modelagem
│  ├─ Universal Capability Architecture
│  ├─ Process & Application Modeling
│  ├─ UI / Generated Experience / Low-code Builder
│  ├─ Adaptive Governed Work Surfaces (AGWS)
│  ├─ Workflow & Durable Execution
│  └─ Integration & Automation
│
├─ B. Identidade, autoridade, governança e confiança
│  ├─ Identity / Authentication / Federation
│  ├─ Authorization / Policy / Organization / Multitenancy
│  ├─ Governance / Compliance / Audit
│  ├─ Security / Resilience / Failure Recovery
│  ├─ Enterprise Trust / PKI / Certificate Lifecycle
│  └─ Privacy / Data Governance / Retention / Legal Hold / Residency
│
├─ C. Dados, estado e comunicação
│  ├─ Data / Schema / Migrations
│  ├─ Storage / Documents / Media
│  ├─ Notifications / Events / Messaging
│  └─ Secrets / Configuration / Environment Portability
│
├─ D. Build, supply chain, deployment e runtime
│  ├─ Build / Dependency Graph / Reproducibility
│  ├─ Artifact / Release / SBOM / Provenance
│  ├─ Deployment / Environment / Runtime
│  └─ Developer / Operator Experience / Self-hosting
│
├─ E. Providers, interoperabilidade, lifecycle e reconciliação
│  ├─ Provider / Binding / Capability Negotiation
│  ├─ Standards / Interoperability / API Contracts
│  ├─ Lifecycle / Versioning / Evolution / Migration
│  └─ Architecture Reconciliation as a Capability
│
└─ F. Operação e economia
   ├─ Observability / Operations / Incident
   ├─ Extension / Plugin / Marketplace Architecture
   ├─ Commercial Metering / Entitlements / Rating / Billing / Payment
   └─ Technology Economic Governance / FinOps
```

A utilidade desse mapa aumenta quando percebemos que as linhas entre os grupos são deliberadamente permeáveis. Privacy atravessa Data e Storage. Trust atravessa Identity, Secrets, Deployment e Providers. Lifecycle atravessa praticamente tudo. FinOps consome medidas de Runtime e Observability, mas continua dono da interpretação econômica interna.

## 4. Semantic owner: a pergunta “quem pode afirmar isso?”

**Semantic owner** é a capability responsável pelo significado canônico de um tipo de verdade.

Ele não precisa executar todos os mecanismos usados para realizar essa verdade. Esse detalhe é central.

```text
semantic owner
     ↓ define significado e invariantes
contrato / requirement
     ↓
provider / runtime / mecanismo
     ↓ realiza
qualified evidence
     ↓
owner/consumer decide o que pode afirmar
```

Provider de pagamento pode executar cobrança, mas não se torna dono do contrato comercial da empresa. Banco de dados persiste dados, mas não decide sozinho o significado empresarial deles. IA pode sugerir um workflow, mas não ganha semantic ownership sobre o processo.

A Universal Capability Architecture (UCA) existe para fornecer estruturas reutilizáveis de identidade, revisão, evidência, authority e qualification sem virar um “god-object” que decide todos os domínios.

## 5. Capability não é módulo

Uma das confusões mais fáceis de cometer é transformar a taxonomia de pesquisa em um diagrama prematuro de componentes.

```text
Capability != Module
Capability != Package
Capability != Service
Capability != Tela
Capability != Provider
```

Uma capability é antes de tudo uma **responsabilidade semântica coerente**.

Na arquitetura futura, uma capability pode ser realizada por vários componentes. Um componente pode colaborar com várias capabilities desde que preserve os boundaries. Em instalações pequenas, componentes podem colapsar topologicamente sem que identidades semânticas sejam apagadas.

É por isso que “Builder grande, Runtime pequeno” não contradiz a riqueza da G2. O runtime pode ser pequeno em dependências retidas e ainda representar corretamente as responsabilidades necessárias ao sistema gerado.

## 6. Provider, qualification, admission e binding

Um **provider** é uma realização concreta, interna ou externa, capaz de executar parte de uma capability.

O erro comum é pular de “o provider possui uma feature” para “podemos usá-lo”. A G2 separa estágios:

```text
discover
   ↓
qualify
   ↓
admit
   ↓
bind
   ↓
actuate
   ↓
observe
   ↓
reconcile
   ↓
drain / withdraw
```

**Qualification** pergunta se a realização satisfaz as propriedades relevantes. **Admission** decide se ela pode ser usada naquele escopo. **Binding** estabelece o vínculo revisionado e qualificado. A atuação produz efeitos. A observação produz evidência. A reconciliação compara intenção e realidade. A retirada só está completa quando cohorts residuais deixam de produzir efeitos autoritativos.

Esse vocabulário é uma das bases do anti-lock-in da G2: trocar provider não deve exigir trocar a identidade ou o significado canônico do negócio.

## 7. Identidade canônica versus identidade de realização

Uma OS do cliente pode ter uma identidade canônica própria. O sistema de terceiros que executa uma integração pode usar outro ID. O storage pode usar uma chave física. O runtime pode possuir outro identificador.

Essas identidades precisam ser relacionadas, não colapsadas.

```text
CanonicalSemanticIdentity
        !=
Provider / External / Runtime RealizationIdentity
```

A distinção permite migração, coexistência e auditoria. Se o provider muda, a OS não “vira outra OS” apenas porque o ID externo mudou.

## 8. Revision: versão não é um único número universal

Empresas mudam em dimensões diferentes: processo, policy, schema, provider, fórmula, release, trust, configuração, autorização.

Por isso a G2 usa o conceito de **revision vector**: uma afirmação pode depender de várias revisões independentes.

```text
RevisionVector = {
  process,
  schema,
  policy,
  providerBinding,
  formula,
  trust,
  runtime,
  ...
}
```

Não significa que toda operação carregará literalmente esse objeto completo. Significa que currentness e applicability não podem ser reduzidas a “estamos na versão 7”.

`latest != applicable`.

Uma fórmula nova pode existir hoje e ainda assim um cálculo histórico precisar usar a revisão antiga que era aplicável ao fato original.

## 9. Evidence: saber não é o mesmo que observar um sinal

**Evidence** é informação usada para sustentar uma afirmação. A G2 insiste que evidência precisa ser qualificada.

Perguntas típicas:

- qual é o sujeito observado?
- quem produziu a evidência?
- em qual revisão?
- para qual escopo/população?
- com qual freshness/currentness?
- qual coverage?
- existe incerteza?
- qual é o horizonte de replay?

Por isso:

```text
telemetry != canonical truth
signal != confirmed condition
provider acceptance != semantic effectiveness
historical PASS != current PASS
```

`INCONCLUSIVE` é importante porque evita transformar ausência de evidência em uma resposta positiva ou negativa inventada.

## 10. Attempt, effect e convergence

Uma solicitação pode ter sido tentada, aceita pelo transporte e ainda não ter produzido o efeito empresarial. O efeito pode ter ocorrido sem a resposta ter chegado ao caller.

A primitive didática é:

```text
attempted
   ↓
accepted
   ↓
effective / applied
   ↓
converged
   ↓
validated
```

Nenhuma seta autoriza inferir automaticamente o estágio seguinte.

Quando uma mutação remota termina de forma ambígua, a disposition deve admitir:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

`UNKNOWN` não significa que o mundo esteja em um estado místico. Significa que o sistema ainda não possui evidência suficiente para dizer qual efeito ocorreu.

Daí a regra operacional importante:

```text
UNKNOWN -> reconcile-before-retry
```

## 11. Idempotência: repetir uma intenção sem duplicar efeitos

Idempotência não é uma chave mágica colocada em uma API. Ela depende da semântica do efeito, do escopo, da identidade da intenção e da durabilidade da deduplicação.

Uma boa separação é:

```text
BusinessIntent
   ├─ Attempt 1
   ├─ Attempt 2
   └─ Attempt N
        ↓
     Effect
```

Múltiplas attempts podem representar a mesma intenção. O desafio é impedir que uma falha de comunicação transforme uma intenção em múltiplos efeitos empresariais.

Essa ideia reaparece em cobrança, criação de OS, envio de mensagem, workflow, storage e deployment.

## 12. Authority: capacidade técnica não é permissão

A cadeia constitucional usada na G2 é:

```text
Enterprise
   ↓
Station
   ↓
Role
   ↓
Person
```

Ela estrutura escopo e delegação. Não significa que toda regra seja puramente hierárquica, mas fornece o eixo que impede superfícies, IA, providers e modos degradados de ampliarem autoridade silenciosamente.

Algumas separações essenciais:

```text
authenticated != authorized
visible in UI != allowed
entitled != authorized
tool available != delegated authority
AI suggestion != authority
provider capability != permission
```

O princípio é **non-amplifying authority**: cada camada pode restringir ou especializar uma autoridade existente, mas não inventá-la.

## 13. Process, workflow e integration

Esses termos costumam ser misturados.

**Process/Application Modeling** é dono do significado canônico do processo e da aplicação. **Workflow/Durable Execution** é dono da execução durável desse comportamento. **Integration/Automation** interage com sistemas externos e automações. **Messaging** trata eventos, entregas, subscriptions e ordering.

Uma analogia útil:

```text
Process Model = partitura
Workflow Runtime = músicos executando a partitura ao longo do tempo
Integration = interfaces com músicos/sistemas de fora
Messaging = transporte e entrega de sinais entre participantes
```

A analogia deixa de valer quando sugere que execução é passiva: workflows possuem waits, retries, efeitos, state, evolution e reconciliation que não cabem perfeitamente numa partitura musical.

## 14. Data, StoredFact, DerivedValue e materialization

Nem todo valor calculado é um fato canônico.

```text
StoredFact
   ↓ inputs
FormulaDefinition + EvaluationContext
   ↓
CalculationResult / DerivedValue
   ↓ política explícita
materialization / adoption quando cabível
```

Isso protege historical applicability. Um resultado recalculado hoje pode divergir legitimamente do resultado historicamente aplicável se fórmula, rounding, rates ou inputs mudaram.

A mesma disciplina impede transformar caches, indexes, documentos físicos ou IDs de storage em fontes de verdade sem um semantic owner.

## 15. Build, Artifact, Release, Deployment e Runtime

Um dos mapas mais importantes do livro é:

```text
source + declared materials
          ↓
        build
          ↓
immutable artifact
          ↓
        release
          ↓
      deployment
          ↓
 effective runtime
```

As etapas não são sinônimas.

- **Build** produz outputs a partir de uma closure de materiais e toolchain.
- **Artifact** é o resultado identificável e imutável.
- **Release** adiciona intenção de distribuição/promoção e provenance/SBOM aplicável.
- **Deployment** estabelece uma geração operacional desejada.
- **Runtime effective state** é o estado que realmente satisfaz readiness, dependencies, traffic, currentness e demais requisitos.

Assim:

```text
build success != release admitted
release exists != deployed
deployed != effective
running != healthy
reachable != trusted
```

## 16. Lifecycle: evolução é coexistência, não apenas troca

Uma atualização raramente é um instante mágico em que tudo passa de A para B.

Durante migração podem coexistir:

- revisões de schema;
- workers antigos e novos;
- sessões antigas;
- providers antigos e novos;
- credenciais antigas;
- consumers que ainda não migraram;
- documentos ou replicas em estados diferentes.

Por isso **residual cohort drainage** é uma primitive transversal. O cutover não está encerrado enquanto uma população antiga ainda pode produzir efeito autoritativo relevante.

Rollback também precisa ser qualificado no presente. O fato de uma release antiga existir não prova que schema, state, credentials, trust e providers ainda permitam voltar com segurança.

## 17. Observability, incident e recovery

Observability ajuda a responder “o que estamos observando?”, não redefine automaticamente “o que é verdade no domínio”.

```text
telemetry
   ↓
qualified evidence
   ↓
assessment
   ↓
alert quando política aplicável exige atenção
   ↓
incident quando há lifecycle operacional correspondente
   ↓
diagnosis / remediation / recovery evidence
```

Recovery também é mais forte que “serviço voltou a responder”.

```text
reachable
  != trusted
  != authorized
  != intact
  != recovered
  != re-protected
```

Containment limita dano. Fencing impede writers superseded. Restore recupera estado. Return-to-service exige qualificação suficiente para voltar à operação. Reprotection restaura as proteções que podem ter sido reduzidas durante a emergência.

## 18. Segurança, trust, PKI, secrets e configuração

Segurança não é uma única capability absorvendo todo o resto.

- Trust/PKI decide relações e evidências de confiança criptográfica.
- Secrets/Configuration cuida de referência, valor, currentness, rotation e realization de configuração.
- Identity estabelece principals.
- Authorization decide permissão.
- Security/Resilience cuida de postura, containment, failure e recovery.
- Deployment realiza workloads.

Essa separação evita que possuir uma credencial seja interpretado como prova de que ela ainda é válida, autorizada ou apropriada ao uso atual.

## 19. Commercial e FinOps: dinheiro tem mais de uma semântica

O livro separa duas cadeias.

A primeira é comercial:

```text
usage evidence
   ↓
metering
   ↓
entitlement context
   ↓
rating
   ↓
charge
   ↓
billing
   ↓
payment / settlement
```

A segunda é econômica interna:

```text
technology source evidence
   ↓
normalization
   ↓
allocation
   ↓
rates / cost models
   ↓
budgets / forecasts
   ↓
unit economics / showback / chargeback
```

Elas podem compartilhar evidência, mas `internal technology cost != customer price`.

## 20. Conflict: quando o erro está na composição

A G2 pesquisa não apenas componentes isolados, mas composições que podem entrar em conflito.

```text
ConflictPattern
     ↓ activation conditions
ConflictSignal
     ↓ evidence/assessment
ConflictInstance
```

`Signal != ConfirmedConflict`.

Uma regra de manutenção pode ser correta. Uma regra de disponibilidade pode ser correta. A combinação pode ser inviável quando ambas disputam o mesmo recurso no mesmo período. O conflito pertence à composição, não necessariamente a um componente defeituoso.

## 21. Testes e técnicas adversariais: cada lente vê uma coisa

Famílias de cenário e técnicas de descoberta não são a mesma coisa.

```text
Happy path / edge / failure / concurrency / misuse / recovery / scale
                     ↑
         podem ser explorados por
                     ↓
fuzzing / property-based / model checking / chaos /
version-skew / differential / pairwise / negative-space
```

Fuzzing encontra inputs inesperados. Property-based testa invariantes. Model checking explora estados/interleavings dentro do modelo. Chaos injeta falhas operacionais. Version-skew exercita coexistência. Differential compara realizações. Negative-space pergunta o que a própria lista de testes esqueceu de imaginar.

Nenhuma técnica isolada prova robustez universal.

## 22. IA: amplificar raciocínio sem amplificar autoridade

A IA pode participar de várias etapas:

```text
intenção
  ↓
sugestão
  ↓
análise
  ↓
composição
  ↓
materialização
  ↓
validação
  ↓
admissão
  ↓
autorização
  ↓
atuação
```

O ponto é não colapsar as setas.

`model output != canonical truth`.

Uma IA pode gerar uma definição de processo, mas a materialização precisa ser validada e admitida segundo owners e policies. Uma IA pode possuir tool access e ainda não ter authority para qualquer ação possível pela ferramenta.

## 23. O mapa ponta a ponta do System Builder

Agora podemos combinar tudo em um ciclo maior.

```text
REALIDADE DA EMPRESA
        │
        ▼
intenção humana / problema
        │
        ▼
elicitação e modelagem semântica
        │
        ▼
process/application revision
        │
        ▼
composição + authority + policy
        │
        ▼
provider qualification / binding
        │
        ▼
build closure
        │
        ▼
artifact + provenance + SBOM
        │
        ▼
release
        │
        ▼
deployment generation
        │
        ▼
effective runtime
        │
        ▼
workflow / data / integrations / effects
        │
        ▼
qualified evidence
        │
        ├──► operations / incident / recovery
        │
        ├──► governance / audit / privacy
        │
        ├──► commercial / FinOps
        │
        └──► architecture reconciliation
                 │
                 ▼
         aprendizado / drift / necessidade
                 │
                 └────────► nova evolução
```

Esse diagrama é propositalmente um ciclo. O System Builder não deveria ser imaginado apenas como “uma fábrica que gera código”. A visão mais completa é de uma plataforma que ajuda a **compreender, materializar, operar, observar e evoluir sistemas empresariais preservando lineage e ownership**.

## 24. Um exemplo final: uma OS atravessando o mapa

**EXEMPLO DIDÁTICO:** uma empresa quer que toda OS corretiva acima de determinado custo seja aprovada por um responsável da Station antes de contratar um fornecedor.

A intenção vira semântica de processo. Process Modeling define a revisão aplicável. Authorization qualifica quem pode aprovar. AGWS/UI projeta a tarefa para o usuário sem conceder poder adicional. Workflow mantém a execução durável. Uma fórmula pode calcular o custo estimado. Provider/Binding qualifica o meio externo usado para contratar ou notificar. Integration executa a interação. Messaging acompanha entregas. Data/Storage preservam fatos e documentos. Observability coleta evidência operacional. Governance pode exigir audit lineage. Commercial ou FinOps podem consumir fatos econômicos em semânticas distintas.

Se a integração externa der timeout após enviar a contratação, Workflow não deveria concluir automaticamente que nada aconteceu. O efeito pode estar `UNKNOWN`; reconciliation precede retry. Se uma policy mudar enquanto a OS aguarda aprovação, currentness e revision applicability precisam ser reavaliadas conforme as regras do owner. Se o provider for substituído, a identidade canônica da OS continua a mesma.

Um único processo empresarial percorre muitas capabilities. Isso não é sinal de arquitetura excessivamente fragmentada; é consequência de distinguir corretamente **tipos diferentes de verdade**.

## 25. O mapa da governança do conhecimento

Há ainda um segundo sistema acontecendo: a própria transformação da pesquisa em produto.

```text
research evidence
      ↓
findings
      ↓
capability synthesis
      ↓
Planning A boundaries
      ↓
Planning B current-state reconciliation
      ↓
mathematical research/backfill
      ↓
adversarial edge-case saturation
      ↓
[Planning C — somente após gate]
      ↓
target architecture
      ↓
dependency/migration design
      ↓
proof/acceptance
      ↓
WBS / Work Packages / TASKs
      ↓
Construction
```

**DECIDIDO:** no snapshot usado por este capítulo, a pesquisa adversarial ainda está `ACTIVE / NOT_SATURATED` e Planning C continua bloqueado. Portanto, o livro não transforma este mapa mental em target architecture.

Essa disciplina existe para impedir que uma boa explicação didática seja confundida com uma autorização executiva.

## 26. Pequeno glossário de separações que vale memorizar

Em vez de decorar todas as definições, vale guardar estas desigualdades:

```text
Capability != Module
Provider != Semantic Owner
Provider ID != Canonical ID
Authentication != Authorization
Entitlement != Authorization
Suggestion != Decision
Materialization != Admission
Admission != Authorization
Attempt != Effect
Accepted != Applied
Timeout != NOT_APPLIED
UNKNOWN -> Reconcile-before-retry
Telemetry != Canonical Truth
Signal != ConfirmedConflict
Build != Release
Release != Deployment
Deployment != Effective Runtime
Running != Healthy
Reachable != Trusted
Restore != Return-to-service
Latest != Applicable
Current provider != Permanent lock-in
Internal technology cost != Customer price
Local validity != Composition validity
Test pass != Universal robustness proof
```

Essas linhas resumem grande parte da razão pela qual a G2 está sendo pesquisada com tanto cuidado: muitos defeitos graves surgem quando duas categorias diferentes são tratadas como se fossem a mesma.

## 27. Como usar o glossário principal do livro

`GLOSSARY.md` deve ser lido como referência didática rápida. Ele não substitui a definição autoritativa nos artefatos de pesquisa e Planning.

Ao encontrar um termo desconhecido:

1. leia a definição curta no glossário;
2. volte ao capítulo que apresenta o problema humano correspondente;
3. consulte o artefato autoritativo somente quando precisar da definição formal ou do status de decisão;
4. verifique a versão do capítulo se a pesquisa tiver evoluído desde a publicação.

Essa ordem evita dois extremos: aprender apenas por documentos formais difíceis de ler ou aprender apenas por simplificações que perderam constraints importantes.

## 28. O que ainda não está encerrado

O encerramento desta primeira sequência de 24 capítulos **não significa encerramento da Generation 2**.

**EM PESQUISA:** a campanha adversarial continua buscando novas classes materiais de edge case e conflito.

**ABERTO/INCONCLUSIVO:** Planning C ainda não pode ser tratado como arquitetura alvo decidida enquanto seu gate continuar bloqueado.

**DECIDIDO:** as fases anteriores já fechadas continuam autoritativas nos limites de seus gates, incluindo a taxonomia de 28 capabilities, boundaries de Planning A e reconciliação de Planning B.

O livro passa agora de uma fase de **expansão sequencial** para uma fase de **manutenção editorial bounded**: novos resultados de pesquisa devem provocar PATCH, MINOR ou MAJOR somente nos capítulos cujo entendimento realmente mudou.

## 29. O que você deve guardar deste capítulo

Se você guardar apenas um modelo mental, guarde este:

```text
A empresa possui verdades diferentes.
Cada verdade precisa de um owner.
Owners podem usar providers sem entregar a eles a semântica.
Toda afirmação importante depende de identidade, revisão, escopo e evidência.
Toda atuação depende de autoridade explícita.
Todo efeito ambíguo precisa de reconciliação antes de repetição insegura.
Toda evolução precisa preservar coexistência, lineage e currentness.
Toda materialização precisa distinguir build, release, deployment e runtime efetivo.
Toda observação precisa respeitar que evidência não é automaticamente verdade canônica.
Toda composição precisa ser testada também pelas interações entre partes corretas.
```

O System Builder Generation 2 pode então ser compreendido não como um conjunto de features, mas como uma tentativa de construir uma **linguagem operacional e arquitetural para transformar empresas em sistemas versionados, materializáveis, substituíveis, governáveis e evolutivos sem perder o significado que os originou**.

## Referências autoritativas principais consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`
- `project_docs/generation-2/planning/PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
- capítulos 01–23 deste livro, como camada editorial de ligação entre os conceitos acima.
