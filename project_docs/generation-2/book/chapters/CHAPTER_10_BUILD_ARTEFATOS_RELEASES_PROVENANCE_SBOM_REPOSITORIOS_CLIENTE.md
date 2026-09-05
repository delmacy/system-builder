# Capítulo 10 — Build, artefatos, releases, provenance, SBOM e repositórios do cliente — v1.0.0

**ID editorial:** `CHAPTER_10`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não substitui pesquisa, síntese ou planejamento autoritativos.

## 1. O problema humano: “o build passou” não responde “o que estamos entregando?”

Imagine que uma empresa modele no System Builder um sistema de ordens de serviço. O Builder valida o modelo, resolve dependências, gera arquivos e termina sem erro. É tentador concluir: “o sistema está pronto”.

Mas várias perguntas continuam abertas. Quais entradas produziram aqueles bytes? Quais versões de dependências participaram? O resultado que foi testado é exatamente o que será entregue? Alguém poderia trocar os bytes mantendo o mesmo nome? O pacote possui evidência de origem? Sabemos quais componentes ele contém? A versão publicada é a mesma que chegou ao cliente? E, mesmo que tudo isso seja verdadeiro, ela realmente está rodando?

É por isso que a G2 preserva uma separação essencial:

```text
build result
    != released artifact
    != deployed state
    != consumer/runtime-effective state
```

**DECIDIDO nas fronteiras de Planning A:** essas verdades pertencem a etapas e semantic owners diferentes. Uma etapa pode consumir evidência da anterior, mas não deve fingir que a etapa seguinte já aconteceu.

Este capítulo acompanha o caminho entre materiais de entrada, build, artefato imutável, release, SBOM/provenance e distribuição. Deployment e runtime serão aprofundados no Capítulo 11.

---

## 2. Build: transformar um conjunto qualificado de entradas

Um **build** é uma transformação controlada de entradas em outputs. Em um sistema simples, podemos imaginar:

```text
código-fonte + dependências + configuração de build
                         |
                         v
                       BUILD
                         |
                         v
                     arquivos
```

Em um sistema empresarial, essa figura é incompleta. O resultado também pode depender de compiler, toolchain, plataforma alvo, arquivos gerados, resolução de dependências, ambiente do runner, relógio, aleatoriedade, rede e outros materiais.

Planning A chama atenção para a identidade dos **materiais de build** (`BuildInputIdentity` / `MaterialIdentity`). O ponto não é impor um formato final, mas impedir que nomes frágeis como um path, uma tag ou um ID de execução sejam confundidos com a identidade semântica daquilo que efetivamente participou da produção.

### 2.1 Closure de build

Como vimos no Capítulo 04, uma dependência direta pode depender de outras. A **build closure** é o fechamento transitivo dos materiais necessários ao build sob um perfil declarado.

```text
Sistema
├── Capability A
│   ├── dependência X
│   └── dependência Y
│       └── dependência Z
├── arquivos gerados
├── compiler/toolchain
└── recipe de build
```

Se Z altera o resultado, mas não aparece na compreensão do build, existe uma dependência escondida.

Isso importa para segurança, diagnóstico e reprodutibilidade. Se amanhã o mesmo source gerar bytes diferentes, precisamos saber se mudou o source, uma dependência transitiva, a toolchain, o ambiente ou algum input não declarado.

---

## 3. Determinismo não é sinônimo de reprodutibilidade geral

Dois conceitos parecem iguais, mas não são.

**Determinismo**, em sentido prático, significa que uma transformação produz o mesmo resultado quando recebe o mesmo estado relevante de entrada.

**Reprodutibilidade (reproducibility)** é uma afirmação mais ampla: sob um perfil declarado, conseguimos repetir a produção e obter uma equivalência definida entre outputs, com entradas, toolchain, ambiente e evidência suficientemente qualificados.

Um compilador pode ser perfeitamente determinístico sobre seus argumentos explícitos e ainda participar de um build não reproduzível se buscar silenciosamente uma dependência mutável na internet.

### 3.1 Um exemplo

Suponha:

```text
build("source-A", "dependency=latest") -> hash 123
```

Amanhã, `latest` aponta para outra revisão:

```text
build("source-A", "dependency=latest") -> hash 789
```

O código do projeto não mudou. A entrada efetiva mudou.

Por isso Planning A trata reproducibility como uma **qualified claim**, aplicável a um revision vector e a um horizonte de evidência, e não como um adesivo binário “este sistema é reproduzível”.

### 3.2 Hermeticidade e impureza controlada

Um build **hermético (hermetic build)** procura cercar seus inputs de modo que rede, filesystem externo, environment, clock, randomness ou registries mutáveis não alterem silenciosamente o resultado.

Nem todo build empresarial precisa ou consegue ser totalmente hermético. A alternativa não deve ser fingir que a dependência externa não existe. Planning A admite a ideia de **controlled impurity**: a influência externa é declarada, identificada e reduz a força da afirmação de reproducibilidade de maneira explícita.

**HIPÓTESE/FRONTEIRA DE ARQUITETURA, não implementação decidida:** a forma final desses perfis será responsabilidade de fases posteriores. O livro apenas preserva o problema e a semântica já delimitada.

---

## 4. O output do build ainda não é uma release

Uma fábrica ajuda como analogia. A peça que saiu da máquina não é automaticamente um lote aprovado para distribuição. Pode precisar de inspeção, identificação, adoção e liberação.

A analogia deixa de valer quando pensamos em software como bytes copiáveis, assinaturas, dependências e múltiplas plataformas, mas ela ajuda a enxergar a fronteira.

Planning A define uma transição conceitual:

```text
validated build output
        |
        | adoção explícita
        v
immutable release artifact
```

O **artefato (artifact)** é uma unidade distributável cuja identidade e integridade precisam ser preservadas. A **release** é uma identidade lógica revisionada que pode agrupar um ou mais artefatos e atravessar lifecycle, qualificação, promoção, distribuição, withdrawal e supersession.

Portanto:

```text
ArtifactIdentity != ReleaseIdentity
```

Uma release para `v5.2` pode, por exemplo, conter artefatos diferentes para targets distintos sem que cada conjunto de bytes deixe de pertencer à mesma release lógica.

---

## 5. Imutabilidade e content addressing

Se o arquivo chamado `sistema-v5.zip` puder mudar de conteúdo sem mudar de identidade, auditoria e rollback ficam frágeis.

Uma técnica importante é **content addressing**: usar um digest criptográfico do conteúdo como parte da identidade ou verificação. Se os bytes mudam, o digest muda.

Mas há uma distinção importante:

```text
content digest != business/release identity
```

O digest responde muito bem à pergunta “estes bytes são estes bytes?”. Ele não responde sozinho “qual release lógica é esta?”, “ela foi aprovada?”, “é admissível hoje?” ou “está rodando?”.

**EVIDENCIADO NO SB ATUAL:** Planning B encontrou artefatos content-addressed por SHA-256, hashes por arquivo, verificação agregada, reconciliação exata entre manifest e payload e rejeição de overwrite conflitante. O SB também possui identidade lógica de release `releaseId@version`, separada do digest do artefato.

Essa é uma fundação significativa, mas não prova a arquitetura G2 completa.

---

## 6. Provenance: explicar de onde veio

**Provenance**, ou proveniência, é evidência sobre origem e transformação.

Para um artefato de software, queremos ser capazes de responder perguntas como:

- quais materiais participaram?
- qual build os transformou?
- qual perfil/toolchain estava em uso?
- qual artefato é o sujeito dessa afirmação?
- quem produziu ou atestou a evidência?
- sob qual revisão do formato/predicate ela deve ser interpretada?

Provenance não é apenas “um log do CI”. Um log pode ser evidência útil, mas uma afirmação de provenance precisa preservar sujeito e aplicabilidade.

Planning A também separa a verdade do Build da embalagem de release: Build continua dono da verdade sobre materiais e execução; Artifact/Release pode carregar e qualificar referências a essa evidência sem reescrevê-la.

### 6.1 Evidência não é autoridade

Uma provenance pode dizer que o artefato veio de determinado build. Isso não significa automaticamente que a release está aprovada.

Do mesmo modo:

```text
signature present != signature qualified
```

Uma assinatura precisa ser verificada contra sujeito, trust root, policy e currentness aplicáveis. O Capítulo 15 aprofundará trust e PKI.

---

## 7. SBOM: saber o que existe dentro do que entregamos

**SBOM (Software Bill of Materials)** é uma declaração estruturada dos componentes e relações que compõem ou participam de um artefato de software, conforme o perfil aplicável.

A analogia mais próxima é uma lista de materiais de fabricação. Ela é útil, mas incompleta: software pode ter dependências transitivas, componentes gerados, relações de build/runtime e diferentes critérios de cobertura.

Por isso uma SBOM não deve ser tratada como “um JSON que existe”. Importam:

```text
SBOM statement
├── identidade da declaração
├── sujeito: qual artefato/release?
├── componentes/materiais
├── relações
├── profile/revision do gerador
├── cobertura/completude alegada
└── evidência de aplicabilidade/currentness
```

Uma SBOM sintaticamente válida pode estar incompleta para a pergunta que queremos responder.

**EVIDENCIADO NO SB ATUAL:** existe provenance tipada e versionada de evidência de release, com sources, transformações e predecessor lineage.

**NÃO EVIDENCIADO COMO CAPABILITY COMPLETA:** Planning B não encontrou uma SBOM canônica completa com component/material graph, coverage/completeness e qualificação de aplicabilidade. Também não encontrou a cadeia completa de assinatura/attestation/admission prevista na fronteira G2.

---

## 8. Release: publicar não é só copiar bytes

Uma release possui lifecycle e governança.

Uma sequência conceitual pode ser:

```text
build output validated
       ↓
release adoption proposed
       ↓
authority evaluated
       ↓
artifact adopted
       ↓
SBOM / provenance / attestations
       ↓
release qualified
       ↓
promotion / publication
       ↓
distribution
       ↓
consumer admission
       ↓
runtime use
```

Cada seta pode falhar independentemente.

Um registry pode aceitar o upload, mas um mirror pode não convergir. Uma assinatura pode existir, mas ser inaceitável sob a trust policy atual. Um artefato pode ter sido distribuído, mas um consumer pode não conseguir admiti-lo. Uma release pode ser admissível e ainda nunca ser implantada.

Essa separação evita o erro operacional clássico de transformar acknowledgement técnico em verdade empresarial ou operacional.

---

## 9. `latest`, `stable` e outros aliases não são identidade imutável

Nomes como:

```text
latest
stable
production
candidate
```

são úteis para pessoas e automações, mas normalmente funcionam como aliases ou relações de canal. O alvo pode mudar.

Por isso Planning A não reduz ReleaseIdentity a uma tag mutável. O modelo conceitual é:

```text
stable ──resolve──> ReleaseRevision R42
```

Mais tarde:

```text
stable ──resolve──> ReleaseRevision R43
```

R42 não se transformou em R43. O alias mudou de alvo.

Esse detalhe parece pequeno, mas é decisivo para rollback, auditoria e coexistência.

---

## 10. Withdrawal e rollback: o passado pode continuar existindo sem continuar elegível

Retirar uma release não exige apagar sua história.

Uma release pode ficar:

- historicamente auditável;
- fisicamente presente em registries ou caches;
- ainda executando em cohorts residuais;
- proibida para novas admissões.

Logo:

```text
historically exists != currently eligible
```

Rollback também não deve ser entendido como uma propriedade eterna do tipo “essa versão sempre pode voltar”. A elegibilidade atual pode depender de schema, dados, config, secrets, trust, security posture, providers e disponibilidade do artefato.

O Capítulo 13 aprofundará coexistência e rollback; aqui basta preservar que **rollback eligibility é uma afirmação atual e qualificada**, não um atributo histórico permanente.

---

## 11. Repositórios do cliente e anti-lock-in

A visão do System Builder busca produzir sistemas autônomos e evitar dependência artificial do próprio Builder. Isso tem uma consequência conceitual importante para source e artefatos: o cliente precisa poder preservar sua continuidade operacional e seu histórico sem depender de uma identidade proprietária do fornecedor para interpretar o que possui.

Isso não significa que “qualquer Git repository é a verdade canônica de tudo”. Um repositório pode armazenar source, manifests, receitas, lockfiles, documentação e evidências, mas os semantic owners continuam distintos.

Também não significa que o SB precise construir seu próprio Git, registry, package manager ou CI. Planning A é explicitamente anti-reinvenção nesses pontos.

A orientação didática é:

```text
cliente possui/retém seus materiais e outputs
            +
SB preserva identidades e contratos portáveis
            +
providers realizam mecânicas substituíveis
            ≠
SB precisa reinventar todo o ecossistema de supply chain
```

**HIPÓTESE DE ARQUITETURA:** a topologia exata de repositories, registries, mirrors e ownership será definida somente em arquitetura alvo. Este capítulo não a decide.

---

## 12. O que já existe no System Builder

Planning B encontrou uma base concreta que merece ser entendida sem superestimá-la.

### 12.1 Build/assembly atual

**EVIDENCIADO NO SB ATUAL:**

- resolução determinística e transitiva de dependências de capabilities;
- detecção de ciclos e conflitos;
- `AssemblyPlan` normalizado e com hash canônico;
- compiler determinístico sobre seus inputs explícitos;
- ordenação canônica e SHA-256 por arquivos;
- hash agregado de artefato;
- versões explícitas de compiler/runtime;
- validation-evidence gating;
- referências simbólicas para secrets em vez de valores secretos no contrato de environment;
- materialização de entrypoint, manifest, environment schema e migrations.

Isso sustenta um **bounded deterministic compiler contract**.

**ABERTO/INCONCLUSIVO para a G2 completa:** não há evidência de material graph geral, build recipe revision completa, hermeticity profile, controlled-impurity ledger, BuildAttempt lifecycle, cache provenance/currentness, runner qualification ou reproducibility claim generalizada entre máquinas/providers/toolchains.

### 12.2 Artifact/release atual

**EVIDENCIADO NO SB ATUAL:**

- `releaseId@version` como identidade lógica;
- artefato SHA-256 content-addressed;
- integridade por arquivo e agregada;
- publicação explícita;
- lifecycle `published → deprecated → archived`;
- provenance tipada de evidência;
- storage in-memory e PostgreSQL sob interfaces delimitadas;
- continuidade do artifact hash para caminhos downstream de deployment/runtime.

**ABERTO/INCONCLUSIVO para a G2 completa:** SBOM completa, signing/attestation qualification, promotion/distribution convergence, consumer admission generalizada, `UNKNOWN` para mutações remotas de registry, current rollback eligibility e substituição/drainage de registries não estão evidenciados como capability completa.

Uma sutileza atual é que o compiler já chama seu output de `ReleaseArtifact`. Operationalmente existe uma etapa posterior explícita de publicação. Portanto o nome do tipo não deve apagar a fronteira semântica:

```text
compiler output --publish/adopt--> canonical published release
```

---

## 13. Cache: aceleração não é verdade canônica

Caches podem reduzir drasticamente o custo de builds. Mas um cache hit não prova sozinho que o resultado continua válido.

Uma entrada de cache pode ter sido produzida sob:

- dependências agora revogadas;
- toolchain antiga;
- policy antiga;
- target diferente;
- provenance insuficiente;
- provider antigo;
- configuração incompatível.

Por isso Planning A trata cache como uma realização de otimização sujeita a identity, provenance, applicability e currentness.

```text
cache key match != authoritative reusable result
```

Essa distinção aparecerá novamente em lifecycle, segurança e recovery.

---

## 14. Ambiguidade remota e reconcile-before-retry

Imagine a publicação de um artefato em um registry externo. O upload termina, mas a conexão cai antes da resposta.

O cliente não sabe se o provider aplicou a publicação.

Isso não é necessariamente `NOT_APPLIED`. Pode ser:

```text
UNKNOWN
```

Repetir cegamente pode gerar conflito, duplicidade ou uma sequência de promoção/revogação incorreta, dependendo do provider.

Por isso mutações remotas ambíguas preservam o princípio já apresentado no Capítulo 06:

```text
UNKNOWN -> reconcile-before-retry
```

**NÃO EVIDENCIADO NO SB ATUAL para Artifact/Release:** os caminhos examinados são locais/in-process ou persistência PostgreSQL; Planning B não inventa um registry remoto para alegar que essa semântica já existe.

---

## 15. Provider-neutral não significa que todos os registries são iguais

Dois registries podem aceitar a mesma API e divergir em:

- immutability;
- retention;
- replication;
- signing/attestation support;
- deletion/revocation;
- consistency;
- offline behavior;
- failure semantics;
- evidence quality.

Assim, “suporta OCI” ou “aceita upload” não prova equivalência semântica completa.

A substituição segue a lógica apresentada no Capítulo 03:

```text
discover
  → qualify/admit
  → bind
  → replicate/publish
  → verify
  → cut over
  → observe
  → drain/withdraw
```

Enquanto um registry antigo ainda puder distribuir autoritativamente uma release proibida pela policy atual, a substituição não terminou semanticamente.

---

## 16. IA e superfícies low-code não recebem autoridade de release

Uma IA pode ajudar a explicar um erro de build, propor atualização de dependência, gerar release notes ou sugerir promoção.

Isso não lhe concede autoridade para:

- trocar silenciosamente dependências canônicas;
- declarar um build reproduzível sem evidência;
- transformar output em release canônica;
- fabricar provenance, SBOM ou assinatura;
- promover uma release;
- revogar outra;
- escolher `latest` como verdade histórica;
- transformar `INCONCLUSIVE` em PASS.

A regra geral permanece:

```text
assistência != autoridade
```

E, quando uma proposta altera semântica pertencente a outro owner, ela precisa atravessar o boundary daquele owner.

---

## 17. Como provar essas propriedades

Algumas técnicas aparecem repetidamente na pesquisa G2.

### 17.1 Rebuild diferencial

**O que é:** executar builds equivalentes sob condições qualificadas e comparar outputs.

**Detecta:** nondeterminism, dependências escondidas e divergência de toolchain/provider.

**Limitação:** dois resultados iguais não provam universalmente que todo rebuild futuro será igual.

**No SB:** ajuda a transformar “parece determinístico” em evidência applicability-scoped.

### 17.2 Dependency-closure inspection

**O que é:** reconstruir e inspecionar o grafo transitivo de materiais.

**Detecta:** dependências ocultas, revisions inesperadas e closure incompleta.

**Limitação:** só encontra o que a instrumentação consegue observar/modelar; side channels podem permanecer fora.

### 17.3 Artifact integrity verification

**O que é:** recalcular digests e conferir manifest/payload.

**Detecta:** corrupção e substituição de bytes.

**Limitação:** bytes íntegros podem ser semanticamente errados ou atualmente proibidos.

### 17.4 Provenance/SBOM subject validation

**O que é:** conferir se a evidência se refere exatamente ao artefato e profile em avaliação.

**Detecta:** evidence mix-up, statement stale ou cobertura inadequada.

**Limitação:** evidência bem vinculada pode continuar incompleta ou proveniente de fonte não confiável.

---

## 18. O mapa mental do capítulo

```text
              SOURCE / MODEL / MATERIALS
                         |
                 dependency closure
                         |
                         v
                       BUILD
                  /      |       \
             recipe   toolchain   runner
                         |
                         v
                  VALIDATED OUTPUT
                         |
                   explicit adoption
                         |
                         v
                 IMMUTABLE ARTIFACT
                    /          \
                  SBOM       provenance
                    \          /
                     RELEASE
                        |
              promotion/distribution
                        |
                 consumer admission
                        |
                   DEPLOYMENT
                        |
                RUNTIME EFFECTIVE
```

As linhas representam relações de evidência e transição. Elas não significam que um único componente precisa possuir tudo.

---

## 19. O que você deve guardar deste capítulo

1. **Build success não é release, deployment nem runtime effectiveness.** Essas verdades precisam permanecer separadas.
2. **Um build é definido por mais que source code.** Dependency closure, recipe, toolchain, target e ambiente podem mudar o resultado.
3. **Determinismo bounded não prova reprodutibilidade geral.** Reproducibility é uma afirmação qualificada por inputs, perfil e evidência.
4. **ArtifactIdentity e ReleaseIdentity são diferentes.** Digest protege identidade/integridade de conteúdo; release representa lifecycle lógico governado.
5. **Provenance explica origem; SBOM descreve composição.** A mera presença de qualquer uma não prova confiança, completude ou admissão.
6. **Aliases como `latest` e `stable` não são revisões imutáveis.** Eles resolvem para revisões.
7. **Rollback eligibility é atual.** Um artefato historicamente válido pode deixar de ser elegível.
8. **Caches e providers são realizações, não verdade canônica.** Reuso e substituição exigem qualificação.
9. **O cliente deve poder preservar continuidade e portabilidade sem obrigar o SB a reinventar Git, CI ou registries.** Anti-lock-in é separação semântica e ownership, não isolamento do ecossistema.
10. **A G2 ainda está em pesquisa adversarial.** Este capítulo ensina fronteiras e evidências atuais; não declara a arquitetura alvo fechada.

---

## Referências internas autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_A_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_SB_CURRENT_STATE.md`
- `project_docs/generation-2/planning/PLANNING_A_ARTIFACT_RELEASE_SBOM_PROVENANCE_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_ARTIFACT_RELEASE_SBOM_PROVENANCE_SB_CURRENT_STATE.md`

Esses documentos continuam superiores ao livro em caso de divergência.