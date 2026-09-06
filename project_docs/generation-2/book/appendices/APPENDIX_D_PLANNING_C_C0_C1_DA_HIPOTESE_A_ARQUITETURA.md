# Apêndice D — Quando a hipótese vira arquitetura: o que C0 e C1 decidiram

**Camada:** compreensão e síntese; este apêndice não substitui Planning C.  
**Estado editorial:** publicado como apêndice didático.  
**Data:** 2026-09-06

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: em que momento uma boa ideia deixa de ser apenas uma boa ideia?

Durante a pesquisa da Generation 2 apareceram ideias fortes: representar relações empresariais como um grafo semântico tipado, preservar semantic owners, tratar evidência e currentness como conceitos de primeira classe, manter `UNKNOWN` quando um efeito externo não pode ser confirmado, estruturar elicitação como conhecimento auditável e usar IA sem transformá-la em autoridade.

Enquanto essas ideias estavam em pesquisa, o livro precisava tratá-las como hipóteses. Isso é importante porque uma explicação convincente não possui, por si só, autoridade arquitetural.

Planning C mudou esse estado para uma parte dessas ideias. C0 e C1 foram concluídos como decisões de arquitetura alvo. Este apêndice explica **o que mudou epistemologicamente** e por que isso importa, sem decidir C2, C3, packages, código ou tecnologia de persistência.

```text
ideia promissora
    ↓
pesquisa + adversarial testing
    ↓
boundaries + reconciliação do SB atual
    ↓
Planning C decide
    ↓
contrato arquitetural alvo
```

A passagem não quer dizer que a ideia se tornou implementação. Quer dizer que, dentro do escopo decidido, ela deixou de ser apenas candidata e passou a ser uma restrição arquitetural a ser respeitada pelas etapas seguintes.

## 2. C0: uma constituição semântica antes dos componentes

**DECIDIDO:** C0 adotou um **substrato semântico tipado e preservador de ownership**. A intenção não é criar um modelo universal de todas as empresas nem um grande objeto central que saiba tudo. A arquitetura define estruturas comuns para que capabilities diferentes possam se relacionar sem perder identidade, owner, revisão, evidência ou limites de autoridade.

O modelo de composição universal passa a ser um **Typed Semantic Graph** — grafo semântico tipado. “Grafo” significa que conceitos podem ser representados como nós e relações; “tipado” significa que essas relações não são arestas genéricas sem significado; “semântico” significa que identidade, tipo e owner precisam sobreviver à composição.

Isso **não decide GraphDB**. O grafo é um modelo arquitetural/IR semântico. Sua persistência ou implementação física continua sendo questão posterior.

Um exemplo didático:

```text
[Pessoa]
   │ exerce
   ▼
[Role]
   │ pode participar de
   ▼
[Etapa de aprovação da OS]
   │ realiza efeito por
   ▼
[Provider externo]
```

Uma representação ingênua poderia tratar tudo como IDs e atributos JSON. C0 exige mais disciplina: a identidade canônica da pessoa não vira a identidade do usuário no provider; a Role não vira automaticamente permissão; a etapa não transfere seu significado ao adapter; e a relação com o provider precisa continuar qualificada.

## 3. Oito planos lógicos, não oito microserviços

C0 organiza responsabilidades transversais em oito planos lógicos: definição semântica; execução e efeitos; evidência/provenance/currentness; provider/binding/realization; authority/trust constraints; federation/locality/Fleet; analytical/temporal/transformation; verification/proof-claim.

**DECIDIDO:** esses planos são responsabilidades semânticas. Eles **não são uma decisão de package, banco, processo, microserviço ou deployment**.

Essa distinção evita um erro frequente: ler um diagrama conceitual e imediatamente convertê-lo em topologia de software. Primeiro se decide que separações precisam existir. Só depois se decide como materializá-las.

## 4. Identidade canônica e identidade de realização deixam de ser apenas uma cautela

C0 torna arquitetural a separação entre `CanonicalSemanticIdentityRef` e `RealizationIdentityRef`, ligadas explicitamente por um `TypedIdentityBinding` quando necessário.

Isso é fundamental para anti-lock-in. Imagine uma empresa usando um provider de e-mail. O usuário `joao.silva@provider-x` pode ser uma realização externa de uma pessoa/identidade canônica do sistema, mas não deve se tornar a definição daquela pessoa.

```text
Pessoa canônica
     │
     ├── binding qualificado ──► conta no Provider X
     │
     └── binding qualificado ──► conta no Provider Y
```

Trocar o provider altera a realização; não deveria exigir trocar a identidade semântica da empresa.

## 5. Revisão deixa de ser um único número

**DECIDIDO:** C0 adota `RevisionVector` porque uma execução empresarial pode depender simultaneamente de revisões independentes: processo, schema, policy, fórmula, provider profile, trust material, artifact/build, deployment e outras dimensões aplicáveis.

Uma OS iniciada ontem pode estar vinculada ao workflow 7, policy 12 e fórmula 4, enquanto uma OS nova usa workflow 8, policy 13 e a mesma fórmula 4. Dizer apenas “sistema v8” perde informação necessária para replay, auditoria, migração e coexistência.

```text
RevisionVector da execução A
  workflow = 7
  policy   = 12
  formula  = 4

RevisionVector da execução B
  workflow = 8
  policy   = 13
  formula  = 4
```

Histórico não deve ser reescrito para parecer que sempre usou a revisão atual. Supersession cria lineage; não apaga a verdade de produção anterior.

## 6. Tempo também é plural

Um timestamp sozinho não responde todas as perguntas temporais. C0 distingue, quando material, tempo de ocorrência, observação/ingestão, decisão, validade, registro, tentativa de execução, acknowledgement do provider e observação de convergência.

**EXEMPLO DIDÁTICO:** um sensor pode registrar uma leitura às 10:00, o gateway recebê-la às 10:07 e o sistema reconciliá-la às 10:12. Tratar 10:07 como “o momento do fato” altera a semântica. Da mesma forma, uma regra pode ter sido registrada hoje com validade retroativa a ontem.

A analogia com “carimbo de data” deixa de valer quando precisamos distinguir **quando algo aconteceu**, **quando soubemos**, **quando registramos** e **para qual intervalo aquilo é válido**.

## 7. Execução: contexto, estado atual, história e efeito não são a mesma coisa

C0 separa quatro ideias que sistemas frequentemente misturam:

- `ExecutionEnvelope`: contexto qualificado/pinado necessário para interpretar a invocação;
- `ExecutionState`: projeção mutável do estado atual da execução;
- `ExecutionJournal`: histórico durável e orientado a append de tentativas, transições e evidências;
- `EffectDisposition`: disposição conhecida do efeito externo.

Para efeitos ambíguos, a arquitetura preserva ao menos `NOT_APPLIED`, `APPLIED`, `PARTIAL` e `UNKNOWN`.

```text
timeout
  └─► não autoriza concluir NOT_APPLIED

UNKNOWN
  └─► reconcile-before-retry, quando repetição puder causar dano
```

O journal pode provar que determinada tentativa foi registrada. Isso não prova, sozinho, que o banco externo, o e-mail, o pagamento ou o equipamento físico atingiu o estado empresarial esperado.

## 8. Provas possuem domínios diferentes

**DECIDIDO:** C0 separa definition soundness, termination/boundedness, execution conformance, journal integrity, external-effect evidence e business/domain postcondition validation.

Isso impede uma classe perigosa de exagero de prova.

Um hash pode ajudar a provar integridade de conteúdo. Uma assinatura pode ajudar a provar origem/autenticidade sob determinado trust context. Um trace pode mostrar uma sequência observada. Um provider ACK pode mostrar que o provider aceitou uma solicitação. Nenhum desses fatos, isoladamente, prova automaticamente que a finalidade empresarial foi alcançada.

```text
prova de integridade
    != prova de autorização
    != prova de efeito externo
    != prova de pós-condição empresarial
```

`ProcessProofBundle` é, portanto, um conjunto qualificado de evidências e alegações verificadas, não um “certificado mágico de verdade”.

## 9. Evidência deixa de ser binária

C0 adota `QualifiedClaim` e `QualifiedEvidenceEnvelope`. Evidência precisa carregar, quando aplicável, sujeito, tipo de claim, owner, fonte/observador, revision vector, tempo, população coberta, currentness, limitações, incerteza e obrigações ainda não satisfeitas.

Isso permite um resultado `INCONCLUSIVE` quando a evidência não sustenta nem `PASS` nem `FAIL`.

**EXEMPLO DIDÁTICO:** verificar 100 de 10.000 documentos e encontrar todos íntegros não autoriza declarar automaticamente os 10.000 como comprovados. A cobertura da evidência precisa acompanhar a alegação.

Da mesma forma:

```text
PASS anterior + revisão relevante nova
    != PASS atual automaticamente
```

## 10. Provenance é linhagem, não verdade

C0 torna explícito algo que a pesquisa adversarial já vinha pressionando: provenance informa de onde algo veio e como foi derivado, mas não concede verdade, currentness, causalidade ou autoridade.

`wasRevisionOf != currently valid`; `correlatedWith != causedBy`; `signedBy != authorizedBy`.

Isso importa especialmente para IA e analytics. Saber que uma recomendação foi produzida por determinado modelo e derivada de determinados dados é essencial para auditoria, mas não torna a recomendação uma decisão empresarial autorizada.

## 11. Provider portability vira comparação multidimensional

**DECIDIDO:** provider não recebe um simples booleano “suporta capability”. C0 usa `CapabilityRequirement`, `CapabilitySupportVector` e binding qualificado.

Dois providers podem ambos “enviar e-mail”, mas diferir em limites, idempotência, ordenação, evidência, isolamento, comportamento offline, versionamento, residência de dados ou semântica de erro. Uma abstração que esconda essas diferenças pode criar falsa portabilidade.

O lifecycle também é explícito:

```text
discover
  → qualify/admit
  → bind
  → use/observe
  → reconcile
  → drain/withdraw
```

Trocar provider não significa que todos os efeitos, filas e cohorts antigos desapareceram no instante do cutover.

## 12. Federação não é banco distribuído mágico

C0 define federação como continuidade por contratos versionados entre sistemas autônomos. Isso não implica shared mutable state, transação global, autoridade global ou currentness sincronizada.

Uma entrega entre sistemas precisa preservar a diferença:

```text
producer handed off
    != consumer applied
    != consumer business postcondition
```

Esse princípio é particularmente importante para Fleet e sistemas locais. Uma visão global pode observar e emitir control intent quando autorizada, mas não vira automaticamente verdade omnisciente sobre cada runtime local.

## 13. Autonomia local é qualificada, não liberdade irrestrita

C0 admite execução local/autônoma sob uma `QualifiedLocalClosure`: o runtime precisa saber quais dependências locais possui e até quando elas permanecem qualificadas — artifact, schema, policy, trust, secret, authority, provider e evidence, conforme aplicável.

Desconexão não amplia autoridade. Se uma dependência crítica expira, o comportamento deve seguir a regra do owner: negar, degradar de modo bounded ou ficar `INCONCLUSIVE`.

Ao reconectar, assumptions que podem ter envelhecido precisam ser requalificadas/reconciliadas.

## 14. C1: elicitação deixa de ser formulário e vira infraestrutura de conhecimento

C1 decide uma **Elicitation Knowledge Base (EKB) híbrida, versionada e auditável** sobre as primitives de C0.

**DECIDIDO:** EKB não é uma 29ª capability. Ela é infraestrutura transversal de autoria, cobertura, rastreabilidade e conhecimento consumida pelas 28 capabilities.

Ela também não é um questionário monolítico. Master Wizard, sub-wizards, modo expert-direct e interação assistida por IA são superfícies diferentes sobre o **mesmo modelo semântico**, não bancos de verdade independentes.

## 15. Pergunta reutilizável e pergunta feita são identidades diferentes

C1 formaliza:

```text
QuestionDefinition != QuestionOccurrence
```

Uma `QuestionDefinition` representa conhecimento reutilizável: por que perguntar, quando se aplica, que evidência esperamos, que follow-ups podem surgir e para qual owner o conhecimento deve ser roteado.

Uma `QuestionOccurrence` representa aquela pergunta em um contexto concreto: empresa, site, capability, provider, stakeholder ou revisão específica.

Se a pergunta reutilizável muda materialmente, nasce nova revisão. Ocorrências históricas preservam a revisão que as produziu; cobertura antiga pode precisar de requalificação.

## 16. Informação deixa de ser “texto respondido”

C1 adota tipos explícitos como `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope` e `Deferred`.

Esses tipos impedem que frases parecidas recebam autoridade equivalente.

**EXEMPLO DIDÁTICO:**

```text
“o gerente sempre aprova compras acima de R$ 5 mil”
```

Pode ser uma alegação de um entrevistado, um comportamento observado no legado, uma regra documentada ou uma decisão aprovada para o futuro. O texto superficial pode ser igual; a natureza epistemológica é diferente.

AI output começa como `InferredCandidate`, salvo se passar por um caminho independente e owner-governed de qualificação.

## 17. Contradição não deve ser resolvida por silêncio

C1 preserva claims/evidências concorrentes e cria estado de contradição governado. Recência, confidence score ou resumo de IA não podem escolher silenciosamente um vencedor.

Isso é importante em brownfield. O manual pode dizer A, os logs mostrarem B e o gerente desejar C. O objetivo da elicitação não é esconder essa diferença; é torná-la explícita para o semantic owner competente decidir.

O `Unresolved Questions Inbox` é uma projeção governada desses débitos e bloqueios, não um novo truth store.

## 18. Cobertura não é porcentagem de perguntas respondidas

C1 torna a cobertura multidimensional, relativa ao objeto/capability/revisão e ao gate. Uma área pode estar `RESOLVED` enquanto outra permanece `CONFLICTED` ou `BLOCKED`.

Por isso 95% de respostas não pode compensar uma lacuna crítica de autoridade, privacy ou recovery.

C1 adota quatro gates de suficiência:

1. `SUFFICIENT_FOR_ABSTRACTION`;
2. `SUFFICIENT_FOR_CANDIDATE_ARCHITECTURE`;
3. `SUFFICIENT_FOR_IMPLEMENTATION`;
4. `SUFFICIENT_FOR_PUBLISH_OPERATION`.

Cada gate pergunta se existe entendimento/evidência suficiente **para aquela finalidade**, não se “sabemos tudo para sempre”.

## 19. Production Readiness Coverage vira arquitetura alvo

A Operability Elicitation Lens, antes hipótese de pesquisa, foi promovida por C1 a modelo transversal de readiness — ainda sem criar uma 29ª capability.

As dimensões decididas incluem observability, ownership, failure handling, recovery, capacity, currentness, security, reconciliation, change safety, cost e documentation.

A separação permanece essencial:

```text
feature completeness
    != Production Readiness Coverage
    != runtime health
    != business convergence
```

Uma capability pode estar bem especificada para operar e estar indisponível agora; ou pode responder agora e ainda carecer de recovery, ownership ou capacity suficientemente definidos para publicação.

## 20. Brownfield e greenfield convergem na mesma disciplina de verdade

C1 decide ordens de descoberta diferentes:

```text
greenfield:
AI-first + Wizard-validated + Expert-direct

brownfield:
Mirroring-first + AI-assisted + Human-mapped + Wizard-completed
```

Mas a disciplina é a mesma. Comportamento observado no legado entra como evidência/candidato com provenance e currentness. Não vira automaticamente processo desejado.

Esse ponto protege a visão de System Mirroring: espelhar uma empresa não significa canonizar todos os seus acidentes históricos.

## 21. O que mudou para o livro

A mudança mais importante não é textual, mas epistemológica.

Antes de C0/C1, o livro precisava dizer, em vários pontos: “esta é uma hipótese forte em pesquisa”. Agora, para o escopo efetivamente decidido, pode dizer: **“Planning C adotou isto como arquitetura alvo.”**

Isso não autoriza atualizar todos os capítulos indiscriminadamente. Uma revisão editorial deve ser bounded. Os capítulos mais afetados são candidatos naturais a revisão porque algumas de suas hipóteses foram promovidas a decisões: especialmente os capítulos 02, 03, 05, 06, 07, 12, 13, 14, 18, 21, 22 e 23, além dos Apêndices A–C.

Enquanto a incorporação ainda não foi aplicada a cada capítulo, o estado correto é `REVIEW_REQUIRED`, sem bump antecipado.

## 22. O que continua aberto

**ABERTO/INCONCLUSIVO:** C2 — Physical / Peripheral Integration boundary — é o próximo estágio de Planning C. C3, as 28 decisões alvo por capability, Planning D/E, Architecture Reconciliation, WBS, Work Packages, TASKs e Construction continuam fora do escopo deste apêndice.

C0 também não decidiu GraphDB, package topology ou deployment topology. C1 não decidiu que IA é autoridade, nem que EKB possui a verdade das capabilities.

O livro deve resistir a duas tentações simétricas:

```text
“Planning C começou, então nada mudou”       ← errado
“C0/C1 decidiram, então tudo está decidido”  ← errado
```

A formulação correta é: **algumas hipóteses transversais agora são decisões arquiteturais; o restante continua sujeito aos gates competentes.**

## 23. O que você deve guardar deste apêndice

C0 decidiu a gramática comum pela qual capabilities podem compor sem perder owner, identidade, revisão, evidência, autoridade e limites de prova. C1 decidiu como a compreensão humana da empresa pode ser capturada, versionada, contradita, qualificada e transformada em artefatos rastreáveis sem tornar IA ou wizard donos da verdade.

O princípio unificador é simples:

```text
compor sem apagar significado
inferir sem fabricar autoridade
observar sem fingir verdade absoluta
versionar sem reescrever história
operar sem confundir readiness com health
elicitar sem confundir resposta com compreensão
```

Essas decisões são arquitetura alvo, não implementação. O próximo trabalho do livro é incorporar boundedmente essa promoção de hipótese para decisão nos capítulos afetados, preservando seu histórico editorial.

## Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`
- `project_docs/generation-2/planning/PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`
- `project_docs/generation-2/planning/PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`
- `project_docs/generation-2/research/SEMANTIC_GRAPH_FEDERATION_SOUNDNESS_EXECUTION_PROOF_RESEARCH.md`
- `project_docs/generation-2/research/OPERABILITY_ELICITATION_LENS_RESEARCH.md`
- `project_docs/generation-2/research/ELICITATION_SYSTEM_UNDERSTANDING_METHODOLOGY_RESEARCH.md`

Estas referências são autoridade para as decisões descritas; este apêndice apenas as explica.