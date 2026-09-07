# Apêndice L — Planning D D2–D5: migrar sem criar duas verdades — v1.0.0

**ID editorial:** `APPENDIX_L`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não é autoridade de Planning D, Planning E, WBS ou Construction.  
**Data:** 2026-09-07

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: uma empresa não para para trocar de sistema

Projetar a arquitetura desejada é difícil. Substituir uma realidade em funcionamento por essa arquitetura é, em muitos casos, ainda mais difícil.

Uma empresa possui usuários autenticados, permissões antigas, planilhas, bancos de dados, workflows em andamento, integrações aguardando callbacks, certificados distribuídos, secrets em caches, artefatos publicados, runtimes ainda atendendo requisições e procedimentos manuais que talvez nem tenham sido completamente inventariados. Não existe um instante mágico em que tudo isso desaparece e a Generation 2 passa a existir integralmente.

Por isso Planning D trata migração como **coexistência governada entre populações de realidade**.

A ideia simples é:

```text
estado antigo ainda capaz de agir
          +
estado novo sendo qualificado
          +
populações em transição
          ↓
coexistência explicitamente governada
          ↓
transferência de autoridade
          ↓
fencing / revoke / drain
          ↓
reconciliação
          ↓
fechamento comprovado
```

**DECIDIDO:** Planning C já fechou a arquitetura alvo. Planning D está ativa e D0–D5 estão `DECIDED / PASS`; D6 é a próxima decisão. Este apêndice não decide D6 nem antecipa Planning E.

## 2. A regra que organiza D2–D5: migrar mecanismo não basta

Uma migração tradicional costuma ser descrita por objetos técnicos: mover banco, trocar IdP, publicar imagem nova, apontar DNS, trocar provider. Para o SB isso é insuficiente, porque a pergunta relevante é também semântica:

> Quem ainda pode produzir um efeito válido, sob qual revisão, autoridade e evidência?

Se a nova política de autorização foi publicada, mas sessões antigas ainda carregam grants válidos, a autoridade não convergiu. Se o novo banco recebeu o backfill, mas um script legado ainda escreve no banco antigo, a fonte de verdade não convergiu. Se a nova release está `READY`, mas parte do tráfego ainda chega à geração anterior, o runtime não convergiu.

Assim, D2–D5 repetem uma mesma forma:

```text
qualificar
   ↓
observar/shadow
   ↓
coexistir de forma bounded
   ↓
transferir autoridade ou efeito explicitamente
   ↓
fence/revoke o caminho antigo
   ↓
drenar população residual
   ↓
reconciliar
   ↓
fechar
```

A palavra **bounded** significa delimitado: sabemos qual população, escopo, revisão e horizonte estão autorizados a coexistir. Coexistência indefinida e invisível é dívida de migração, não estratégia.

## 3. D2: primeiro migram identidade, autoridade, trust e secrets

Antes de permitir que uma nova superfície execute trabalho real, o SB precisa saber **quem está agindo, em qual escopo, com qual autoridade e sob qual confiança atual**.

### 3.1 Identidade externa não vira identidade canônica por semelhança

Um e-mail, username, subject de IdP, grupo de diretório ou subject de certificado pode ser evidência útil. Não é automaticamente a identidade canônica da pessoa, serviço ou recurso.

**EXEMPLO DIDÁTICO:** o diretório legado contém o grupo `supervisores`. O novo modelo possui a Role `Supervisor`. O nome parecido não autoriza copiar todos os membros e grants. Pode haver escopos diferentes por empresa ou Station, membros históricos, contas de serviço ou permissões implícitas que não existem no modelo alvo.

D2 exige mapping revisionado e autoridade explícita para a adoção. Ambiguidade permanece `PARTIAL` ou `UNKNOWN`; não é resolvida por `latest match`.

### 3.2 Autenticar não é autorizar

`authentication != authorization`.

Autenticação produz evidência de quem apresentou determinada credencial sob certo contexto. Autorização responde se aquele sujeito pode executar uma ação sobre um recurso em um escopo e revisão de política.

Um token pode conter claims antigos. Portanto:

```text
token ainda válido
      !=
permissão ainda válida agora
```

Isso é especialmente importante durante migração, porque a política alvo pode estar correta enquanto sessões, caches ou grupos legados continuam oferecendo caminhos de autoridade antigos.

### 3.3 Migração de autoridade deve ser non-amplifying

**DECIDIDO:** quando equivalência entre autoridade antiga e alvo não pode ser provada, a transição deve preferir a autoridade admitida mais estreita ou permanecer bloqueada/parcial até disposição do owner.

A migração não pode aumentar poder apenas porque um grupo legado é amplo, porque um operador está em break-glass ou porque uma IA sugeriu um mapeamento.

### 3.4 Rotação é convergência populacional

Trocar um secret, certificado, trust bundle ou signing key não termina quando o provider cria a nova versão.

```text
nova geração admitida
      ↓
distribuição
      ↓
adoção pelos consumidores
      ↓
versão antiga fenced/revogada
      ↓
consumidores/sessões residuais drenados
      ↓
reconciliação
```

Esse é um padrão que reaparecerá em D3, D4 e D5: **substituir o objeto central não prova que a população dependente convergiu**.

## 4. D3: dados, workflows e efeitos externos precisam preservar história

Depois das prerequisites de autoridade e trust, D3 enfrenta um problema mais perigoso: dados e processos podem produzir consequências empresariais irreversíveis.

### 4.1 Dois bancos não significam duas verdades

Backfill, CDC, replicação e dual-write são mecanismos de migração. Eles não criam dois semantic owners.

Durante uma migração é necessário saber, para cada estado:

- qual origem é autoritativa;
- qual cursor/high-watermark delimita a observação;
- como duplicatas e ordering são tratados;
- qual revisão transforma os dados;
- como deletes/tombstones funcionam;
- qual é o lag aceitável;
- quando o catch-up termina.

**EXEMPLO DIDÁTICO:** estoque legado informa 10 unidades e o novo store informa 9. A diferença não pode ser resolvida escolhendo o timestamp mais novo sem saber quem tinha writer authority e se havia uma atualização atrasada em trânsito.

### 4.2 Mover source of truth exige fencing do writer antigo

O target pode receber shadow reads e backfill antes de governar. A transferência de writer authority é outro evento.

Uma migração não fecha enquanto planilhas, scripts, imports, edições manuais, workers antigos ou Stations offline ainda puderem produzir mutações autoritativas fora do envelope declarado.

Isso explica o termo **residual cohort**: uma população residual é qualquer conjunto remanescente capaz de observar, decidir, escrever ou produzir efeitos sob a realidade anterior.

### 4.3 Workflow em andamento pertence à revisão que o produziu

Uma nova definição de workflow não reescreve semanticamente execuções já iniciadas.

D3 preserva:

```text
WorkflowDefinitionRevision
          !=
WorkflowExecution
```

Uma execução em andamento precisa manter o `RevisionVector` necessário para interpretar transições, timers, retries, compensações e efeitos. Dependendo do caso, ela pode terminar na revisão antiga, passar por transformação qualificada, ser quiescida, abortada com roll-forward/reconciliation ou exigir intervenção manual.

`latest workflow revision != current execution semantics`.

### 4.4 Journal não é autorização para repetir efeitos

`ExecutionJournal` preserva o que ocorreu; replay do journal ajuda a reconstruir/interpreter estado sob revisões declaradas. Isso não significa que uma cobrança, e-mail, ordem de compra ou comando externo possa ser executado novamente.

D3 separa identidade de mensagem, delivery attempt, workflow invocation e **business-effect identity**.

Quando o resultado de uma mutação externa é ambíguo:

```text
NOT_APPLIED | APPLIED | PARTIAL | UNKNOWN
```

`UNKNOWN -> reconcile-before-retry` quando uma duplicação pode ser danosa e a segurança específica da repetição não foi provada.

## 5. D4: trocar provider é migrar uma realização, não o significado

Com identidade, autoridade, dados e efeitos delimitados, D4 trata provider/binding e integração física/periférica.

### 5.1 Support é vetor, não booleano

Um provider pode suportar envio de mensagens, mas ter semântica diferente de ordering, deduplicação, timeout, paginação, quotas, callback lifecycle ou currentness.

Por isso:

```text
supports(capability) = true
```

é fraco demais para decidir substituição.

A qualificação precisa declarar dimensões de suporte e exclusões. Um provider pode ser `QUALIFIED` para uma operação e `PARTIAL` para outra.

### 5.2 Discovery não é admission

Descobrir um recurso externo não autoriza adotá-lo, operá-lo ou considerá-lo completo.

Isso vale para contas, endpoints, devices, roles, grants e sistemas especializados. Em particular:

`provider reported state != physical truth`.

Uma câmera, impressora, gateway ou equipamento pode estar reportado como online e ainda não estar fisicamente disponível para a finalidade empresarial esperada.

### 5.3 Substituição usa coexistência e drain

O padrão D4 é:

```text
provider atual
    ↓
candidato qualificado
    ↓
shadow / observe
    ↓
coexistência controlada
    ↓
cutover explícito
    ↓
fencing do antigo
    ↓
callbacks, sessões, filas e recursos residuais drenados
    ↓
reconciliação
```

Trocar a configuração principal sem drenar webhooks, callbacks ou filas antigas pode fazer o provider anterior continuar produzindo efeitos depois do suposto cutover.

## 6. D5: a supply path inteira vira um grafo de identidades

D5 leva a mesma disciplina ao caminho source → build → artifact → release → deployment → runtime.

A primeira correção conceitual é abandonar a ideia de que um único `version`, tag de imagem ou ID de CI representa tudo.

D5 separa, entre outros:

```text
source/model revision
        ↓
build definition
        ↓
material closure
        ↓
build attempt
        ↓
build output set
        ↓
canonical artifact revision
        ↓
release revision
        ↓
distribution realization
        ↓
deployment plan / desired generation
        ↓
observed runtime
        ↓
readiness
        ↓
traffic / consumer effectiveness
```

Cada seta representa uma relação que precisa de evidência adequada; não uma igualdade.

### 6.1 Build success não prova reproducibility

Um build pode concluir duas vezes e ainda depender de inputs ambientais invisíveis. D5 exige que material closure, toolchain, target profile, runner/environment e controlled impurities sejam qualificados antes de uma claim forte de reprodutibilidade.

Lockfile é evidência valiosa, mas não necessariamente verdade completa de materiais.

### 6.2 Build output não é artifact canônico automaticamente

O output precisa ser validado e adotado sob uma fronteira explícita de autoridade. Upload em registry ou existência de arquivo não constitui adoção.

Da mesma forma:

`signature valid != signer currently trusted != release admitted`.

Criptografia, trust e autoridade de promoção permanecem fatos distintos.

### 6.3 Release publicada não é runtime efetivo

A cadeia de deployment preserva:

```text
release admitted
  != desired generation
  != provider accepted
  != observed generation
  != ready
  != traffic serving
  != consumer effective
```

Uma UI que colapsa tudo em `DEPLOYED` esconderia exatamente os estados necessários para migrar com segurança.

### 6.4 Runtime local autônomo continua sendo requisito

D5 preserva a autonomia do sistema gerado: o runtime pode continuar dentro de uma `QualifiedLocalRuntimeClosure` sem depender de conexão viva com o Builder.

Mas offline não cria autoridade. Trust expirado, policy stale, credential revogada ou evidência obrigatória ausente podem reduzir o modo permitido para degraded/read-only/blocked conforme a política do owner.

Reconnect é reconciliação; nunca `latest wins` automático.

## 7. A primitive que une D2–D5: residual cohort

O conceito de população residual é uma das chaves para entender Planning D.

Considere uma troca de fechadura em uma empresa. Instalar a fechadura nova não resolve o problema se dez cópias da chave antiga ainda abrem uma porta lateral. A analogia ajuda a perceber o risco, mas deixa de valer tecnicamente porque software possui múltiplas formas simultâneas de autoridade, cache, sessão, fila, callback e execução offline.

No SB, residual cohorts podem ser:

- sessões com grants antigos;
- consumers com secret antigo;
- writers legados;
- workflows em revisão anterior;
- callbacks e subscriptions de provider antigo;
- build runners e caches antigos;
- registry references antigas;
- runtime generations anteriores;
- Stations offline;
- procedimentos manuais ainda ativos.

Fechamento exige saber quem é o owner, qual revisão produziu a população, se ela ainda consegue causar efeitos, seu tamanho/coverage, idade, currentness objective e sua rota de fence/drain/reconcile.

## 8. Migração correta é também um problema de capacidade

D2–D5 não podem assumir que reconciliação e drain são instantâneos.

Se chegam 100 divergências por minuto e a reconciliação resolve 80, o backlog cresce 20 por minuto. Mesmo que a arquitetura seja correta, a migração não converge.

**EXEMPLO DIDÁTICO:** após cutover de provider, callbacks antigos chegam a 500/minuto. O reconciler processa 300/minuto. A fila residual cresce. Declarar o provider antigo encerrado porque o endpoint principal mudou seria falso.

Por isso queue depth, oldest age, arrival rate, service/drain rate, quotas, retry amplification e headroom fazem parte da correção de migração.

## 9. O padrão profundo: currentness acompanha toda claim

Uma evidência pode ter sido verdadeira quando produzida e não ser suficiente agora.

Isso vale para:

- membership de grupo;
- trust bundle;
- secret adoption;
- schema compatibility;
- provider support;
- SBOM/provenance admission;
- readiness;
- rollback eligibility.

Planning D não apaga história quando a currentness expira. Ele distingue **historicamente verdadeiro** de **atualmente admissível**.

Essa separação é essencial para auditoria e recovery. Um certificado pode ter sido válido no momento da assinatura e não ser confiável para uma nova promoção hoje; as duas afirmações podem coexistir sem contradição.

## 10. Rollback não é uma máquina do tempo

D5 torna explícita uma confusão frequente: manter o artefato antigo não garante que voltar seja seguro.

Depois do cutover podem ter ocorrido:

- migrações de schema irreversíveis;
- external effects;
- novas revisões de secrets/trust;
- mudanças de policy;
- consumers incompatíveis;
- dados produzidos sob semântica nova.

Portanto existem estratégias distintas:

```text
deployment rollback
roll-forward
provider/routing reversal
business compensation
data/state restore
manual reconciliation
```

`rollback converged` não significa que efeitos empresariais anteriores foram desfeitos.

## 11. Como D2–D5 se conectam

O encadeamento pode ser lido assim:

```text
D2 — quem pode agir e sob qual confiança?
 │
 ▼
D3 — sobre quais dados/processos e com qual identidade de efeito?
 │
 ▼
D4 — por qual realização/provider isso pode acontecer?
 │
 ▼
D5 — como o software que realiza isso é produzido, admitido,
     distribuído, implantado e efetivamente colocado em serviço?
```

As dependências não significam que toda execução real será serial. Significam que uma claim downstream não pode ser mais forte que suas prerequisites.

Se D2 não prova autoridade, D4 não pode transformar um binding em caminho autorizado. Se D3 não preserva effect identity, D4 não pode declarar retry seguro apenas porque o provider oferece uma idempotency key. Se D5 não prova qual release está efetivamente servindo, a operação não pode inferir que uma correção já alcançou toda a população.

## 12. O que muda na compreensão do livro

A primeira edição do Capítulo 23 descreveu corretamente a cadeia conceitual pesquisa → arquitetura → dependency/migration design → proof → WBS → Construction, mas foi publicada quando a pesquisa adversarial ainda estava ativa e Planning C bloqueada.

Hoje a situação autoritativa é diferente:

- pesquisa adversarial: `CLOSED / SATURATED / PASS`;
- Planning C: `CLOSED / PASS`;
- Planning D: `ACTIVE / OPEN`;
- D0–D5: `DECIDED / PASS`;
- D6: próximo estágio;
- Planning E: ainda bloqueado.

Isso não invalida a tese do Capítulo 23. Muda o status de várias afirmações de hipótese/futuro para decisão observável no pipeline. Portanto ele permanece candidato a revisão editorial MINOR bounded quando a revisão for aplicada de forma coordenada com `BOOK_STATE`, `TABLE_OF_CONTENTS` e `CHANGELOG`.

## 13. O que você deve guardar deste apêndice

Migração G2 não significa copiar dados e trocar infraestrutura. Significa transferir, de forma observável e reversível quando possível, **identidade, autoridade, trust, writers, processos, efeitos, providers, artefatos, releases e runtimes** sem permitir que a coexistência produza duas verdades canônicas invisíveis.

A regra prática é:

> o caminho novo não está plenamente adotado enquanto o caminho antigo ainda puder produzir efeitos relevantes sem estar explicitamente governado.

Por isso `cutover != closure`. O intervalo entre ambos é ocupado por residual cohorts, currentness, fencing, drain e reconciliation.

### Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_D_D2_AUTHORITY_IDENTITY_TRUST_SECRETS_PREREQUISITES.md`
- `project_docs/generation-2/planning/PLANNING_D_D3_DATA_WORKFLOW_EXTERNAL_EFFECT_SEMANTICS.md`
- `project_docs/generation-2/planning/PLANNING_D_D4_PROVIDER_BINDING_PHYSICAL_PERIPHERAL_REALIZATION.md`
- `project_docs/generation-2/planning/PLANNING_D_D5_BUILD_ARTIFACT_DEPLOYMENT_LIFECYCLE_SUPPLY_PATH.md`
- `project_docs/generation-2/book/chapters/CHAPTER_23_COMO_TRANSFORMAR_PESQUISA_EM_ARQUITETURA_WBS_CONSTRUCAO.md`

Estas referências são autoridades superiores ao texto editorial deste apêndice.