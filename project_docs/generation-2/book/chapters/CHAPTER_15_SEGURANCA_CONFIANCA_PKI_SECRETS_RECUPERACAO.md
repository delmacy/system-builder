# Capítulo 15 — Segurança, confiança, PKI, secrets e recuperação — v1.0.0

**ID editorial:** `CHAPTER_15`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada:** compreensão e síntese; não substitui pesquisa, Planning ou arquitetura alvo.

## O problema humano: voltar a funcionar não basta

Imagine uma empresa cuja operação depende de um sistema para abrir ordens de serviço, despachar equipes, consultar estoque e registrar a execução. Durante a madrugada, o banco principal deixa de responder. A equipe restaura um snapshot, sobe novamente o runtime e a tela volta a abrir.

É tentador concluir: **“recuperamos o sistema”**.

Mas algumas perguntas ainda estão sem resposta:

- o snapshot restaurado é íntegro e compatível com o schema atual?
- havia outro escritor ainda ativo quando a restauração foi feita?
- as credenciais usadas pelo runtime continuam válidas?
- o certificado apresentado pelo banco prova a identidade esperada ou apenas fornece criptografia?
- uma chave antiga revogada continua em memória em algum worker?
- o processo restaurado carregou a nova configuração ou apenas recebeu um arquivo atualizado?
- o estado empresarial restaurado é válido, ou apenas tecnicamente legível?
- depois da recuperação existe novamente backup, replicação ou outro mecanismo de proteção?

A Generation 2 trata essas perguntas como fatos diferentes. Essa separação é decisiva porque disponibilidade, confiança, segredo, autorização, integridade e recuperação não são sinônimos.

A síntese mais curta deste capítulo é:

```text
reachable
    != trusted
    != authorized
    != intact
    != recovered
    != re-protected
```

`DECIDIDO`: Planning A separa explicitamente Enterprise Trust/PKI, Secrets/Configuration e Security/Resilience/Failure Recovery em semantic owners distintos. Nenhum deles pode declarar sozinho a verdade dos demais.

---

## 1. Segurança não é uma única coisa

No uso cotidiano, chamamos de “segurança” quase tudo: login, senha, TLS, certificado, permissão, backup, firewall, criptografia, recuperação e auditoria.

Isso é conveniente para conversa, mas perigoso para arquitetura.

Para o System Builder, é melhor perguntar **qual pergunta cada mecanismo responde**.

| Pergunta | Owner conceitual principal |
|---|---|
| Quem é este principal? | Identity / Authentication / Federation |
| O que ele pode fazer? | Authorization / Policy / Organization |
| Em quem ou em qual infraestrutura posso confiar agora? | Enterprise Trust / PKI |
| Como referencio e materializo valores sensíveis/configuração? | Secrets / Configuration |
| Qual estado operacional está acontecendo? | Observability / Operations |
| O sistema está seguro para continuar ou retornar ao serviço após falha/compromisso? | Security / Resilience / Failure Recovery |

As respostas podem depender umas das outras, mas não devem ser colapsadas.

Um certificado válido, por exemplo, pode contribuir para autenticar um servidor. Ele não concede ao servidor permissão para aprovar uma OS. Uma senha ou API key disponível em memória permite tentar uma operação, mas não prova que a credencial ainda está autorizada. Um dashboard verde fornece evidência operacional, mas não prova que um comprometimento foi erradicado.

Essa disciplina de ownership impede um erro recorrente: transformar **evidência útil** em **autoridade que ela nunca recebeu**.

---

## 2. Trust: confiança é uma afirmação qualificada

### 2.1 O que “confiar” significa tecnicamente

No contexto deste capítulo, **trust** é uma afirmação qualificada de que uma identidade, credencial, cadeia ou relação de confiança satisfaz os requisitos aplicáveis naquele momento e naquele escopo.

Não basta possuir bytes de um certificado.

```text
certificate present
    != path valid
    != status current
    != trusted for this purpose
    != business authorization
```

Planning A de Enterprise Trust/PKI define a confiança como revisionada e dependente, conforme o caso, de policy, trust material, issuer generation, credential identity, provider binding, relying population e evidence horizon.

Isso significa que uma afirmação que era verdadeira ontem pode não ser verdadeira hoje.

### 2.2 Trust domain

Um **domínio de confiança (trust domain)** delimita um espaço no qual determinadas regras, âncoras e relações de confiança são aplicáveis.

Uma empresa pode confiar em uma autoridade certificadora para emitir certificados de workloads internos e em outra para conexões públicas. O simples fato de ambas produzirem certificados X.509 não torna seus significados equivalentes.

`EXEMPLO DIDÁTICO`: um certificado emitido para `estoque.interno` pode ser tecnicamente válido e ainda assim não ser aceito para assinar releases. O formato criptográfico é o mesmo; a finalidade e a política não são.

---

## 3. PKI em linguagem simples

**PKI (Public Key Infrastructure, infraestrutura de chaves públicas)** é o conjunto de identidades, chaves, certificados, emissores, âncoras, políticas e mecanismos usados para estabelecer relações de confiança baseadas em criptografia assimétrica.

Uma forma didática de visualizar:

```text
Trust Anchor
    ↓
Issuer / CA
    ↓
Certificate
    ↓
Presented by workload/provider
    ↓
Path + identity + currentness validation
    ↓
Qualified trust evidence
```

A analogia com um cartório ajuda até certo ponto: alguém reconhecido emite uma credencial que outros sabem verificar. A analogia deixa de valer porque PKI envolve criptografia, cadeias automáticas, validade temporal, revogação, rotação, múltiplos relying parties e decisões computacionais de policy.

### 3.1 Criptografia de transporte não é identidade verificada

Uma conexão TLS pode estar criptografada sem que a identidade do outro lado esteja positivamente verificada segundo os requisitos desejados.

`EVIDENCIADO NO SB ATUAL`: o slice PostgreSQL distingue modos como `verify-ca` e `verify-full`. O primeiro verifica a cadeia; o segundo também vincula o certificado ao hostname esperado. Modos positivos falham fechados quando a CA necessária não está disponível ou a verificação falha.

Essa distinção é pequena na superfície, mas conceitualmente enorme:

```text
encrypted channel != positively verified peer identity
```

O comportamento também foi levado ao runtime autônomo, de modo que essa verificação bounded não exige o Builder online durante a operação.

### 3.2 Emissão não é uso efetivo

Uma rotação de certificado não termina quando o novo certificado é emitido.

A cadeia mais correta é:

```text
request/authorize
→ issue
→ distribute/materialize
→ consumer observe/use
→ qualify
→ drain old generation
→ retire
```

Um novo certificado pode existir no vault enquanto processos antigos continuam usando a credencial anterior.

Portanto:

```text
new credential exists != rotation complete
```

Essa é a mesma ideia de cohorts residuais que apareceu em providers, authorization, deployment e lifecycle.

---

## 4. Revogação, expiração e currentness

Certificados e credenciais não são eternos. Eles podem expirar, ser revogados, deixar de corresponder à policy atual ou ter evidência de status indisponível.

A G2 evita a regra simplista “certificado presente = confiável”.

Uma avaliação de trust pode precisar distinguir:

- válido e atualmente qualificado;
- expirado;
- revogado;
- cadeia/path inválido;
- hostname/identity incompatível;
- evidência de revogação stale;
- evidência indisponível;
- consumer adoption ainda não comprovada.

Quando o conhecimento necessário falta, a resposta pode ser `INCONCLUSIVE`, `DEGRADE` ou `DENY` conforme a policy superior. O sistema não deve converter automaticamente ausência de evidência em confiança.

---

## 5. Secrets: referência não é valor

O segundo grande domínio deste capítulo é **Secrets / Configuration / Environment Portability**.

Uma boa arquitetura evita espalhar valores secretos dentro da definição canônica do sistema.

Em vez disso, preserva uma identidade/referência lógica:

```text
SystemDefinition / EnvironmentProfile
        |
        | secret reference
        v
SecretResolver
        |
        | resolved value
        v
Runtime materialization
```

`EVIDENCIADO NO SB ATUAL`: o SB já possui `EnvironmentProfile`, bindings do tipo `secret-reference` e uma interface provider-neutral `SecretResolver`. Existem realizações por environment e arquivo, e os valores resolvidos são injetados no runtime sem serem persistidos como conteúdo de Release/Deployment evidence.

Esse é um predecessor importante da arquitetura G2.

### 5.1 Por que referência e valor devem ser diferentes

Considere:

```text
DATABASE_PASSWORD -> secret://runtime-db
```

A referência `secret://runtime-db` pode permanecer estável enquanto o valor real muda diversas vezes.

Se o valor secreto fosse embutido na definição da aplicação, uma rotação poderia obrigar reconstrução, republicação e distribuição de artefatos apenas para substituir um segredo. Pior: aumentaria a quantidade de lugares em que esse valor poderia vazar.

A separação permite preservar intenção sem preservar o segredo em todo lugar.

### 5.2 Possuir um segredo não prova autoridade

Uma das regras mais importantes é:

```text
secret possession != authorization
```

Um processo pode ainda possuir uma API key revogada em memória. Um arquivo pode continuar existindo em disco após a rotação. Um token pode estar presente em cache depois que a policy mudou.

Por isso, valor resolvido, materialização e consumer-effective currentness são fatos diferentes.

```text
declared reference
→ resolution attempted
→ value resolved
→ materialized
→ consumer-effective
→ currentness validated
```

`HIPÓTESE DE ARQUITETURA`: a forma concreta desses contratos ainda pertence a fases posteriores. O livro explica a necessidade sem decidir sua implementação.

---

## 6. Rotação não é trocar um valor em um cofre

Imagine uma credencial usada por cinco workers.

Às 10h00, o provider gera `credential-v2`. Às 10h01, o vault passa a retornar a versão nova. Dois workers reiniciam; três continuam executando com `credential-v1` em memória.

Dizer “a rotação terminou às 10h01” seria falso para a população efetiva.

O conceito importante é **consumer-effective adoption**: quais consumidores realmente passaram a usar a geração nova?

Enquanto a geração antiga puder produzir efeito, existe um **residual credential cohort**.

Exemplos:

- processo ainda vivo;
- cache de sidecar;
- arquivo temporário;
- variável de CI/CD;
- bootstrap bundle;
- worker offline;
- sessão que carrega credencial derivada antiga.

A rotação só pode ser considerada fechada quando a disposição desses cohorts satisfaz a policy: drenados, expirados, revogados, fenced ou explicitamente tolerados.

---

## 7. Bootstrap: quem resolve o resolvedor?

Todo sistema de configuração possui um problema inicial: para acessar um vault, talvez seja preciso uma credencial; mas essa credencial também precisa vir de algum lugar.

Esse é o problema de **bootstrap**.

A retained runtime closure precisa declarar quais dependências mínimas devem existir antes de o runtime conseguir resolver as demais.

Exemplos possíveis:

- identidade de workload;
- trust anchor local;
- credencial inicial curta;
- arquivo provisionado no host;
- hardware/root-of-trust;
- configuração mínima do resolver.

Não existe “zero bootstrap”. Existe bootstrap explícito ou implícito. A G2 prefere torná-lo visível, porque dependência escondida destrói a prova de autonomia.

---

## 8. Segurança e resiliência: o owner da recuperação segura

Enterprise Trust responde perguntas sobre confiança. Secrets/Configuration responde sobre referências, valores e sua materialização. **Security / Resilience / Failure Recovery** responde outra pergunta:

> diante de falha ou comprometimento, quais invariantes precisam permanecer verdadeiros, qual recovery path ainda é seguro e quando podemos declarar retorno ao serviço?

Planning A define esse owner em torno de protected scopes, invariants, failure/compromise states, containment, fencing, degraded mode, recovery objectives, recovery paths, restore/failover/rebuild effects, validation, reprotection e closure.

### 8.1 Failure não é necessariamente compromise

Uma falha pode ser acidental: disco cheio, processo morto, rede indisponível.

Um **compromise** implica suspeita ou confirmação de que integridade, confidencialidade, autoridade ou confiança foram violadas por ação adversarial ou estado não confiável.

As respostas podem ser diferentes.

Reiniciar um processo morto pode ser suficiente para uma falha simples. Reiniciar um processo comprometido a partir da mesma imagem e com as mesmas credenciais pode apenas restaurar o atacante junto com o serviço.

---

## 9. Containment e fencing

Antes de recuperar, muitas vezes é preciso impedir o caminho antigo de continuar produzindo efeitos.

**Containment** limita a propagação ou capacidade de um componente suspeito/comprometido.

**Fencing** impede que uma instância ou escritor antigo continue exercendo autoridade concorrente.

O exemplo clássico é split-brain:

```text
writer A --- falha de rede --- controller
    |
    | ainda consegue escrever
    v
 database

controller promove writer B

A + B agora podem escrever
```

Se B sobe e responde HTTP 200, isso não significa recuperação bem-sucedida. Pode significar que agora existem **dois escritores autoritativos concorrentes**.

A recuperação segura pode exigir fencing/epoch/lease ou outro mecanismo que prove que o antigo escritor perdeu a capacidade de atuar.

`EVIDENCIADO NO SB ATUAL`: existe um predecessor bounded no deployment: activation usa expected-active/CAS para rejeitar contenders stale. Isso protege a autoridade de ativação naquele slice. Planning B é explícito, porém, em não generalizar essa prova para bancos, providers ou qualquer writer arbitrário.

---

## 10. Backup presente não significa recovery pronta

Uma sequência didática útil é:

```text
backup exists
    != backup integrity verified
    != restore possible
    != restore compatible
    != business state valid
    != system re-protected
```

Um backup pode estar corrompido. Pode restaurar corretamente, mas conter schema incompatível com a release. Pode restaurar aplicação e banco, mas perder ordens de serviço que já haviam sido faturadas em outro sistema. Pode trazer de volta uma credencial revogada.

Por isso Recovery Point Objective (RPO) e Recovery Time Objective (RTO) são **objetivos qualificados**, não garantias mágicas criadas por preencher dois campos de configuração.

### 10.1 RPO

**RPO (Recovery Point Objective)** descreve quanto de perda temporal de estado é aceitável para determinada população/serviço.

Se o último recovery point qualificado é das 10h e a falha ocorreu às 10h15, existe potencialmente uma lacuna de 15 minutos.

### 10.2 RTO

**RTO (Recovery Time Objective)** descreve o tempo-alvo para restabelecer determinada capacidade segundo o escopo definido.

Não deve ser confundido com “tempo até o processo iniciar”. Se o processo inicia em três minutos mas a validação empresarial leva quarenta, o significado precisa ser explícito.

---

## 11. O lifecycle de recovery

Uma recuperação material pode ser entendida como:

```text
objective/plan qualified
→ failure/compromise detected
→ contain/fence
→ select recovery point/path
→ authorize
→ attempt
→ accepted
→ applied/effective
→ converged
→ validated
→ re-protected
→ residual cohorts drained
→ return-to-service closed
```

Observe quantas etapas existem depois de “o comando de restore foi aceito”.

Essa separação reutiliza um padrão que aparece em outros capítulos:

```text
attempted != accepted != applied != effective != validated
```

### 11.1 UNKNOWN também existe em recovery

Imagine que um comando de failover é enviado a um provider. A conexão cai antes da resposta.

Não sabemos se o failover aconteceu.

Repetir imediatamente pode ser perigoso.

O estado correto pode ser `UNKNOWN`, seguido de **reconcile-before-retry**.

Isso evita duplicar restores, promover múltiplos writers ou executar uma ação destrutiva duas vezes.

---

## 12. Restoration é diferente de return-to-service

**Restoration** significa que um estado foi reconstruído ou reativado segundo um recovery path.

**Return-to-service** é a qualificação de que o sistema pode voltar a servir trabalho real com segurança.

Para isso, podem ser necessárias provas de:

- integridade do runtime;
- compatibilidade de schema/dados;
- trust atual;
- secrets/config atuais;
- fencing do predecessor;
- validade do estado empresarial;
- observability coverage suficiente;
- lacunas de replay conhecidas;
- reprotection restabelecida.

Uma página carregando não prova nenhuma dessas propriedades por si só.

---

## 13. Reprotection: recuperar sem voltar a proteger é recuperação incompleta

Suponha que a empresa restaure o único banco válido a partir do último backup. O sistema volta a operar, mas o mecanismo de backup continua quebrado.

Tecnicamente, o serviço está disponível.

Operacionalmente, ele pode estar em condição mais frágil do que antes.

**Reprotection** é a qualificação de que as proteções necessárias ao estado recuperado voltaram a existir.

Pode incluir, conforme o caso:

- backup funcional;
- replicação restabelecida;
- trust/credential rotation concluída;
- monitoramento suficiente;
- redundancy retomada;
- controles de integridade ativos;
- recovery path futuro novamente qualificado.

A regra didática é:

```text
restored != re-protected
```

---

## 14. O que o SB atual já prova

É importante não projetar a visão G2 retroativamente sobre o produto existente.

`EVIDENCIADO NO SB ATUAL`:

- deployment records imutáveis e decisões determinísticas de ativação;
- last-known-good retention quando um candidato falha;
- expected-active/CAS contra stale activation contenders;
- histórico durável de deployment;
- continuidade A → B → A sob o slice de runtime/deployment já testado;
- falhas explícitas de admission/health/startup/secret resolution;
- `EnvironmentProfile` com referências simbólicas de secrets;
- `SecretResolver` provider-neutral com realizações substituíveis;
- secret values mantidos fora da evidência durável de Release/Deployment;
- PostgreSQL TLS com positive verification em modos bounded e parity no runtime autônomo.

Esses são fundamentos reais e valiosos.

---

## 15. O que ainda não deve ser apresentado como pronto

`ABERTO/INCONCLUSIVO` como capability generalizada no produto atual:

- trust-domain identity e anchor/bundle revisions generalizados;
- issuance/status/revocation/rotation lifecycle completo;
- consumer-effective PKI adoption e trust-cohort drainage;
- secret version/lease/currentness e rotation/revocation lifecycle geral;
- residual secret/config cohorts inventariados;
- protected-scope security posture canônico;
- compromise lifecycle completo;
- fencing geral de writers/controllers;
- recovery point/path qualification generalizada;
- RPO/RTO evidence framework;
- generic backup/restore/failover semantics;
- `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` generalizado para recovery providers;
- reprotection e return-to-service qualification first-class;
- provider-neutral DR substitution;
- offline recovery/trust horizons completos;
- hierarquia completa de recovery authority `Enterprise → Station → Role → Person`.

Esses itens são necessidades e gaps pesquisados. Não são uma afirmação de implementação.

---

## 16. Offline e degraded mode não criam autoridade

Uma empresa pode precisar continuar operando durante isolamento de rede. Isso não significa que o runtime possa inventar confiança, estender validade de certificados ou criar privilégios de emergência.

O princípio permanece:

```text
disconnection != authority expansion
```

Uma retained closure pode carregar evidência suficiente para operar por um horizonte explicitamente permitido. Quando esse horizonte expira, o sistema precisa degradar, tornar a decisão `INCONCLUSIVE` ou falhar fechado conforme a policy.

Na reconexão, claims cujo currentness possa ter mudado precisam ser requalificados.

---

## 17. Break-glass e recuperação emergencial

Recuperação frequentemente exige poderes perigosos: restaurar banco, revogar credenciais, isolar rede, promover primário, trocar trust anchor.

Isso não justifica uma conta “admin de emergência” ilimitada.

**Break-glass** deve ser entendido como autoridade emergencial governada: escopo, origem, duração, revisão, evidência e ações permitidas continuam explícitos.

A existência de uma emergência não transforma segurança em ausência de governança.

`DECIDIDO`: AI/AGWS pode ajudar a diagnosticar, resumir evidências e propor recovery plans, mas não recebe por isso autoridade autônoma para failover destrutivo, trust override, break-glass ou return-to-service closure.

---

## 18. Exemplo integrado: recuperação de uma operação de manutenção

`EXEMPLO DIDÁTICO`:

Uma empresa usa o SB para OS de manutenção. O banco primário apresenta corrupção e o runtime perde conectividade.

1. **Observability** fornece sinais e evidence coverage sobre a falha.
2. **Security/Resilience** qualifica o protected scope e declara que o caminho antigo precisa ser fenced.
3. **Authorization** determina quem pode autorizar restore/failover.
4. **Trust/PKI** verifica a confiança atual das conexões e workloads usados na recuperação.
5. **Secrets/Configuration** resolve as credenciais/referências necessárias sem transformar esses bytes em verdade durável.
6. **Data/Schema** determina compatibilidade do recovery point com a estrutura atual.
7. **Storage** fornece evidência de integridade do objeto/snapshot.
8. **Provider/Binding** qualifica a realização externa usada no restore.
9. **Deployment/Runtime** materializa o runtime restaurado.
10. **Workflow/Process** ajuda a determinar quais OS/in-flight effects precisam reconciliação.
11. **Security/Resilience** valida o conjunto, confirma fencing, business-state checks e reprotection.
12. Só então ocorre **return-to-service closure**.

Nenhum componente precisou virar um “super owner”. A segurança vem justamente da composição de owners com responsabilidades claras.

---

## 19. Trade-offs

### Segurança versus disponibilidade

Fail-closed reduz o risco de agir sem confiança suficiente, mas pode indisponibilizar operações durante falhas de evidence/currentness. Operação degradada bounded existe para tratar esse trade-off explicitamente, não para escondê-lo.

### Rotação rápida versus estabilidade operacional

Rotacionar agressivamente reduz exposição de credenciais antigas, mas aumenta pressão sobre consumer adoption, caches e disponibilidade. A arquitetura precisa provar convergência, não apenas emitir material novo.

### Recovery rápida versus validação profunda

Quanto maior a urgência, maior a tentação de declarar sucesso quando o endpoint responde. A G2 tenta preservar uma diferença explícita entre restauração técnica e retorno seguro ao serviço.

### Provider convenience versus semântica portátil

Vaults, PKIs e DR providers oferecem capacidades poderosas, mas seus IDs e estados não devem virar automaticamente identidade ou verdade canônica do SB.

---

## 20. Técnicas que detectam problemas neste domínio

### Failure injection / chaos

**O que é:** provocar falhas controladas em dependências, rede, processos ou providers.

**Detecta:** assumptions escondidas de disponibilidade e recuperação.

**Exemplo:** derrubar a resposta após envio de um failover e verificar se o sistema preserva `UNKNOWN` em vez de repetir cegamente.

**Limitação:** um experimento cobre os faults escolhidos; não prova todas as interleavings possíveis.

**No SB:** ajuda a testar recovery, secret resolution, provider ambiguity e retained runtime closure.

### Version-skew testing

**O que é:** operar intencionalmente com revisões diferentes coexistindo.

**Detecta:** confiança, configuração ou recovery claims que pressupõem uma versão global inexistente.

**Exemplo:** runtime antigo usando credential generation antiga durante rotação.

**Limitação:** o espaço combinatório cresce rápido.

### Negative testing de trust

**O que é:** testar certificados, chains, hostnames, status e evidência inválidos ou ausentes.

**Detecta:** sistemas que confundem criptografia, presença de material e confiança qualificada.

**No SB atual:** hostname mismatch e untrusted certificate já aparecem como casos negativos do slice PostgreSQL.

---

## 21. Relação com os outros capítulos

O Capítulo 07 explicou que identidade e autorização são diferentes; agora podemos acrescentar que **trust também é diferente de ambas**.

O Capítulo 10 explicou provenance de build/release; recovery pode depender dessa provenance para saber se o artefato restaurado ainda é admissível.

O Capítulo 11 separou desired, observed e effective runtime state; recovery precisa validar mais do que runtime effectiveness.

O Capítulo 13 mostrou que histórico disponível não significa rollback elegível; este capítulo explica a parte de segurança/resiliência dessa requalificação.

O Capítulo 14 mostrou que telemetry é evidência, não verdade canônica; aqui ela passa a alimentar failure detection e restoration qualification sem receber autoridade para declarar recovery closure.

O Capítulo 18 aprofundará `UNKNOWN`, retries e idempotência. O Capítulo 20 mostrará como fuzzing, chaos, model checking e outras técnicas atacam sistematicamente as premissas descritas aqui.

---

## O que você deve guardar deste capítulo

Segurança, confiança, secrets e recovery se conectam, mas não são a mesma capability.

Um certificado existente não prova trust atual. Um segredo disponível não prova autorização. Um backup existente não prova restauro válido. Um restore aceito não prova recuperação. Um runtime respondendo não prova retorno seguro ao serviço. E um sistema restaurado sem reprotection ainda não fechou sua recuperação.

A Generation 2 procura preservar explicitamente essas fronteiras para que o System Builder possa usar providers externos, operar de forma autônoma e suportar falhas sem fabricar certezas onde a evidência não permite.

A ideia central é simples, embora sua implementação seja sofisticada:

```text
Security is not “something is running”.
Security is being able to explain, with qualified evidence,
why the right thing may safely continue running now.
```

## Referências autoritativas principais consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_A_ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_ENTERPRISE_TRUST_PKI_CERTIFICATE_LIFECYCLE_SB_CURRENT_STATE.md`
- `project_docs/generation-2/planning/PLANNING_A_SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_SB_CURRENT_STATE.md`
- `project_docs/generation-2/planning/PLANNING_A_SECURITY_RESILIENCE_FAILURE_RECOVERY_BOUNDARIES.md`
- `project_docs/generation-2/planning/PLANNING_B_SECURITY_RESILIENCE_FAILURE_RECOVERY_SB_CURRENT_STATE.md`
