# Capítulo 22 — O ciclo completo: da intenção humana ao sistema materializado e operado — v1.0.0

**Chapter ID:** `CHAPTER_22`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Primeira publicação:** 2026-09-05  
**Camada de autoridade:** síntese didática; não substitui pesquisa, synthesis, Planning, gates, findings, taxonomia, edge-case registers ou arquitetura alvo.

---

## 1. O problema humano: “eu só queria que o sistema fizesse isso”

Quase todo sistema empresarial começa com uma frase que parece simples.

> “Quando chegar uma OS urgente, quero que o sistema identifique o tipo de serviço, veja se há técnico disponível, reserve o material, peça as aprovações necessárias, envie uma mensagem ao cliente, acompanhe a execução e feche a cobrança.”

Para uma pessoa olhando o problema de fora, isso pode soar como uma sequência de telas e automações. Para um sistema que precisa ser confiável, explicável, substituível, versionável e operável, essa frase contém muitas perguntas diferentes.

Qual é exatamente o significado de “OS urgente”? Quem pode classificar uma OS assim? Qual revisão do processo está valendo? O estoque reservado é apenas uma previsão ou uma baixa real? Qual pessoa pode autorizar uma exceção? Qual provider enviará a mensagem? Esse provider está qualificado para receber aqueles dados? A fórmula de cobrança é a atual ou a que era válida quando o serviço começou? O sistema gerado contém todas as dependências necessárias? O artefato publicado é o mesmo que foi implantado? A implantação terminou ou apenas foi aceita pelo provider? O serviço está realmente atendendo usuários? Se houver um timeout depois de uma cobrança, é seguro repetir? Se uma revisão nova for publicada, o que acontece com as OS que começaram na versão antiga?

A Generation 2 pesquisa justamente esse espaço entre a frase humana e o efeito empresarial real.

O System Builder não pode tratar todo esse percurso como uma única operação mágica chamada “gerar sistema”. Ele precisa preservar as diferenças entre **intenção, significado, autoridade, realização, execução, evidência e evolução**.

Este capítulo junta os conceitos anteriores em uma narrativa única.

A ideia central é:

```text
intenção humana
    != modelo canônico
    != composição admitida
    != autorização
    != realização qualificada
    != build
    != release
    != deployment
    != runtime efetivo
    != evidência de sucesso
```

Esses elementos se conectam, mas não podem ser confundidos.

---

## 2. Um mapa do ciclo antes de entrar nos detalhes

De forma didática, o ciclo pode ser visualizado assim:

```text
[1] intenção humana
        ↓
[2] elicitação e interpretação
        ↓
[3] modelo semântico revisionado
        ↓
[4] composição e projeções
        ↓
[5] validação + autoridade + admissibilidade
        ↓
[6] qualification e bindings de providers
        ↓
[7] fechamento de dependências e build
        ↓
[8] artifact + release + provenance
        ↓
[9] deployment desejado
        ↓
[10] realização observada
        ↓
[11] runtime efetivo para o consumidor
        ↓
[12] operação, evidência, incidentes e reconciliação
        ↓
[13] evolução, coexistência, migração e eventual rollback
        ↺
        nova intenção / nova revisão
```

Esse desenho parece linear, mas o sistema real não é uma esteira rígida. Existem retornos, reconciliações, revisões independentes, estados intermediários, coexistência e caminhos de falha.

Uma mudança de provider pode ocorrer sem mudar o processo. Uma mudança de processo pode exigir schema novo. Uma nova release pode não exigir mudança de dados. Um incidente pode obrigar rollback do runtime sem reverter a revisão do processo. Uma pessoa pode propor uma mudança sem ter autoridade para admiti-la. Um sistema pode estar implantado e ainda não estar efetivamente servindo seus usuários.

Portanto, o ciclo é melhor entendido como uma **rede de transições governadas entre verdades diferentes**.

**DECIDIDO NOS ARTEFATOS DE PLANNING A:** as capabilities possuem semantic owners distintos, e nenhuma etapa deve absorver silenciosamente a verdade de outra.

---

## 3. Etapa 1 — intenção humana: o sistema começa antes do software

O primeiro objeto relevante não é código. É intenção.

Uma pessoa percebe uma necessidade:

- reduzir retrabalho;
- impedir que uma OS seja encerrada sem laudo;
- controlar estoque;
- distribuir trabalho;
- automatizar uma mensagem;
- cobrar corretamente;
- manter evidência de uma aprovação;
- permitir operação offline em determinada Station;
- substituir um provider caro;
- atender uma nova obrigação regulatória.

Essa intenção pode chegar por entrevista, observação do trabalho, documentos, planilhas, sistemas antigos, procedimentos, tickets, conversa com operadores ou análise de dados.

O problema é que linguagem humana é incompleta por natureza.

Quando alguém diz “o supervisor aprova”, ainda não sabemos:

- qual supervisor;
- em qual Station;
- sobre quais tipos de OS;
- até qual valor;
- durante qual período;
- sob qual policy;
- se existe delegação;
- o que acontece na ausência dele;
- se aprovação é necessária antes ou depois de determinada ação.

Por isso, elicitação não é simples transcrição.

A intenção humana é uma fonte de significado, mas ainda não é uma definição executável.

**EXEMPLO DIDÁTICO:** “todo serviço acima de R$ 5.000 precisa de aprovação do gerente” parece uma regra completa. Mas ainda falta saber se os R$ 5.000 são orçamento, custo previsto, valor faturável ou valor já realizado; qual revisão da regra se aplica; e o que fazer se o valor subir depois do início da OS.

O papel do Builder — e eventualmente da IA como assistente — é ajudar a explicitar essas lacunas sem inventar respostas silenciosamente.

---

## 4. Etapa 2 — interpretação: transformar conversa em significado explícito

A segunda etapa é transformar intenção difusa em conceitos verificáveis.

Aqui aparecem perguntas como:

- quais são as entidades relevantes?
- quais estados existem?
- quais transições são permitidas?
- quais fatos são armazenados?
- quais valores são derivados?
- quais eventos importam?
- quais pessoas ou roles podem agir?
- quais dependências externas existem?
- quais invariantes não podem ser violados?

Esse trabalho não precisa começar com terminologia técnica diante do usuário. A conversa pode continuar empresarial.

Por exemplo:

> “Uma OS só pode ir para execução quando houver técnico, material e autorização.”

Depois, internamente, esse entendimento pode ser decomposto em condições, identidades, revisões e relações.

O ponto importante é que interpretação não deve apagar incerteza.

Se duas áreas descrevem regras incompatíveis, a ferramenta não deve escolher uma ao acaso. Se uma planilha antiga usa “cliente” com dois significados diferentes, o importador não deve inferir equivalência apenas pelo nome. Se um procedimento escrito diverge do trabalho observado, essa divergência é evidência relevante.

A Generation 2 preserva resultados como `PARTIAL` e `INCONCLUSIVE` quando a evidência não permite afirmar uma equivalência forte.

Isso pode parecer menos conveniente do que “preencher tudo automaticamente”, mas evita que uma suposição escondida vire comportamento empresarial autoritativo.

---

## 5. Etapa 3 — modelo semântico revisionado: dizer o que a empresa quer dizer

O Planning A de Process & Application Modeling define o modelo canônico como a descrição revisionada do significado empresarial antes de sua realização técnica.

Essa distinção é fundamental.

Um processo não é o arquivo de um engine BPM. Uma entidade empresarial não é uma tabela específica. Uma ação não é um botão. Uma identidade de cliente não é o ID que um provider atribuiu. Um workflow não é o nome de uma fila.

O modelo canônico deve sobreviver, dentro de seus limites semânticos, à troca de mecanismos que o realizam.

Considere:

```text
Capability semântica:
    “enviar comunicação ao cliente”

Possíveis realizações:
    provider A de e-mail
    provider B de e-mail
    SMS
    mensageria própria
```

O provider pode mudar. A intenção empresarial continua reconhecível.

Da mesma forma:

```text
ProcessIdentity
    != workflow-engine-id

CustomerIdentity
    != CRM-provider-id

DocumentIdentity
    != object-storage-key
```

O Planning A registra explicitamente que identidades de providers e runtimes são, por padrão, identidades de realização, não a fonte da verdade canônica.

### 5.1 Por que revisionar o modelo?

Porque empresas mudam.

Uma regra de aprovação hoje pode não ser a de amanhã. Um formulário pode ganhar um campo. Uma fórmula pode mudar. Um processo pode ter uma nova transição. Uma obrigação de retenção pode ser alterada.

Sem revisão explícita, torna-se difícil responder:

> “Qual regra estava válida quando este fato ocorreu?”

O modelo revisionado preserva história e permite distinguir:

```text
regra atual
    != regra historicamente aplicável
```

Essa ideia atravessa todo o livro.

---

## 6. Etapa 4 — composição: montar o sistema sem misturar os donos do significado

Depois que existem conceitos explícitos, eles precisam ser combinados.

Uma aplicação empresarial pode envolver simultaneamente:

- Process Modeling;
- Workflow;
- Data/Schema;
- UI;
- AGWS;
- Authorization;
- Notifications;
- Integration;
- Storage;
- Calculations;
- Providers;
- Observability;
- Lifecycle.

O perigo é imaginar que, porque tudo aparece na mesma tela ou no mesmo grafo, tudo pertence ao mesmo semantic owner.

Não pertence.

Um Canvas pode mostrar uma ação de “Aprovar pagamento”. Isso não torna o Canvas dono da autorização de pagamentos. Uma IA pode inserir um nó de workflow. Isso não torna a IA dona das regras de workflow. Um formulário pode capturar um campo. Isso não torna UI dona da semântica do dado.

A composição deve preservar as fronteiras.

Uma forma de pensar é:

```text
Process Modeling diz:
    “existe esta atividade e este significado”

Workflow diz:
    “esta instância está neste estado e esta transição é durável”

Data diz:
    “este fato possui esta identidade e este schema”

Authorization diz:
    “este principal pode ou não executar esta ação neste escopo”

UI diz:
    “este significado é projetado para interação desta forma”

Provider/Binding diz:
    “esta realização externa está qualificada e vinculada”
```

O Builder pode coordenar todos eles sem transformá-los em um único god-object.

---

## 7. Etapa 5 — validação, autoridade e admissibilidade: algo coerente ainda pode ser proibido

Um modelo pode ser tecnicamente consistente e ainda não poder ser materializado ou executado.

Exemplo: uma pessoa desenha um fluxo no qual técnicos de uma Station podem aprovar seus próprios reembolsos.

O grafo pode ser perfeitamente válido. Os estados podem estar corretos. O formulário pode funcionar. O workflow pode executar.

Ainda assim, uma policy de separation of duties pode proibir essa composição.

Outro exemplo: uma Station descobre que determinado provider suporta uma feature desejada. Isso não significa que a Station esteja autorizada a utilizá-lo.

O Planning A de Authorization estabelece a cadeia:

```text
Enterprise
   ↓
Station
   ↓
Role
   ↓
Person
```

com autoridade não amplificante.

A autoridade efetiva é limitada pelas restrições superiores, delegações e policies aplicáveis.

Isso produz uma separação importante:

```text
tecnicamente possível
    != semanticamente válido
    != permitido
```

### 7.1 IA também passa por essa fronteira

Como explicado no Capítulo 21, a IA pode sugerir, analisar, compor e até atuar quando houver delegação explícita.

Mas:

```text
AI output != canonical truth
proposal != decision
materialization != admission
```

A mesma regra vale para humanos. Um humano apertar “aprovar” não cria autoridade universal. A própria aprovação precisa estar dentro da autoridade daquele humano.

---

## 8. Etapa 6 — providers: escolher uma realização sem vender a semântica para o fornecedor

Muitas capabilities precisam de mecanismos externos.

Pode haver provider para:

- banco de dados;
- armazenamento;
- e-mail;
- autenticação;
- workflow;
- observabilidade;
- IA;
- build;
- runtime;
- pagamentos;
- certificados.

A sequência conceitual estabelecida em Provider/Binding é:

```text
discovered
    != advertised
    != qualified
    != admitted
    != bound
    != effective
```

Um provider aparecer em um catálogo não prova que funciona. Ele declarar suporte a “workflow” não prova que satisfaz as semânticas requeridas. Ser tecnicamente compatível não significa que esteja autorizado para uso naquela empresa. Estar admitido não significa que exista binding efetivo. Binding configurado não prova que o efeito empresarial desejado aconteceu.

### 8.1 Qualification é multidimensional

Uma empresa pode exigir que o provider suporte:

- determinada consistência;
- operação offline;
- região específica;
- retenção;
- evidência de auditoria;
- determinado volume;
- idempotência;
- exportação de dados;
- substituição sem perda semântica;
- política de trust específica.

Por isso, “compatível = true” é insuficiente em muitos casos.

A Generation 2 pesquisa support vectors e resultados como:

```text
SUPPORTED
PARTIAL
UNSUPPORTED
INCONCLUSIVE
```

Isso torna o anti-lock-in mais realista. O objetivo não é fingir que todos os providers são iguais; é saber **onde eles são equivalentes e onde deixam de ser**.

---

## 9. Etapa 7 — fechar dependências: transformar intenção executável em algo construível

Até aqui, possuímos semântica, composição, autoridade e realizações qualificadas.

Ainda não temos necessariamente um software que possa ser executado autonomamente.

O Build entra para fechar o conjunto de materiais e dependências necessários para produzir os outputs.

O Planning A de Build separa:

- identidade dos inputs;
- dependency graph;
- revisões resolvidas;
- toolchain;
- recipe;
- runner;
- ambiente;
- outputs;
- evidência de reproducibility.

O Builder pode ser grande — conter ferramentas de autoria, análise, Canvas, IA, pesquisa, geração, validação e administração — enquanto o runtime produzido retém apenas o fechamento necessário para executar seu perfil.

Essa é a ideia discutida no Capítulo 04:

```text
Builder amplo
    ↓ compõe / gera / valida
Retained runtime closure
    ↓
Sistema executável
```

O runtime autônomo não precisa carregar o ambiente inteiro que o construiu.

### 9.1 Build não é release

Uma execução de build terminar com sucesso significa apenas que determinados outputs foram produzidos e validados segundo aquele perfil.

Não significa que esses outputs foram oficialmente adotados para distribuição.

A separação preservada é:

```text
build result != released artifact
```

Esse detalhe é crucial para provenance e governança.

---

## 10. Etapa 8 — artifact e release: transformar output em unidade distribuível governada

Artifact/Release recebe outputs validados e, por uma transição explícita, os transforma em artefatos imutáveis e releases identificáveis.

Aqui entram conceitos como:

- `ArtifactIdentity`;
- content digest;
- `ReleaseIdentity`;
- provenance;
- SBOM;
- assinatura/attestation;
- promotion;
- distribution;
- admission;
- withdrawal.

Uma release não é simplesmente “o arquivo gerado”.

Ela possui identidade, lineage e evidências próprias.

O fluxo pode ser lido assim:

```text
build result validado
    ↓
proposta de adoção
    ↓
autoridade de release
    ↓
artifact imutável
    ↓
SBOM / provenance / attestations
    ↓
qualification
    ↓
promotion / distribution
```

O Planning A de Artifact/Release mantém outra separação constitucional:

```text
build result
    != released artifact
    != deployed state
    != consumer/runtime-effective state
```

### 10.1 Por que isso importa ao cliente?

Porque uma das promessas conceituais do System Builder é reduzir lock-in.

Se o cliente possui artefatos identificáveis, lineage, repositório e informações suficientes sobre aquilo que recebeu, existe uma base muito mais saudável para independência operacional do que uma plataforma na qual “o sistema” só existe enquanto o Builder está conectado.

Anti-lock-in, porém, não significa independência mágica de todas as dependências. Um runtime pode continuar consumindo banco de dados, e-mail ou storage externos. A diferença é que essas dependências devem ser explícitas e qualificadas.

---

## 11. Etapa 9 — deployment: declarar o que deve estar rodando

Uma release existir não a coloca em produção.

Deployment começa quando uma release admissível é intencionalmente ligada a um ambiente e a um plano de realização.

Isso envolve:

- ambiente;
- release;
- configuração;
- secrets;
- trust;
- schema prerequisites;
- providers;
- placement;
- scaling;
- rollout;
- traffic.

Uma representação simplificada é:

```text
Release R17
   +
Environment PROD
   +
Config C8
   +
Binding DB3
   +
Binding Mail5
   +
Trust T4
   ↓
Deployment desired generation D42
```

A identidade do deployment não precisa ser a identidade que Kubernetes, uma VM, um serviço serverless ou outro provider criou.

Esses identificadores continuam sendo realizações.

---

## 12. Etapa 10 — desired, observed e effective: três verdades que parecem uma só

Um dos pontos mais importantes de toda a Generation 2 aparece aqui.

Suponha que o System Builder declare:

> “Quero a release R17 com três réplicas.”

Isso é **desired state**.

O provider responde:

> “Pedido aceito.”

Isso é evidence de aceitação.

Depois, duas réplicas aparecem.

Isso é **observed state** parcial.

Depois, três aparecem como running.

Ainda falta saber se estão prontas, se receberam configuração correta, se conseguem acessar dependências e se o tráfego realmente chega até elas.

Somente depois de qualificação suficiente pode existir uma afirmação sobre **effective state**.

Portanto:

```text
requested
    != accepted
    != observed
    != converged
    != ready
    != consumer-effective
```

O Planning A de Deployment preserva desired, observed e effective generations como fatos distintos.

Essa separação impede que o sistema declare sucesso apenas porque uma API respondeu `200 OK`.

---

## 13. Etapa 11 — runtime efetivo: o sistema finalmente existe para quem trabalha nele

Do ponto de vista humano, o sistema “existe” quando alguém consegue usá-lo para realizar trabalho.

Mas mesmo essa frase precisa de cuidado.

Um processo pode estar rodando e ainda estar inacessível devido ao roteamento. A interface pode carregar, mas uma integração necessária pode estar quebrada. O runtime pode estar healthy segundo o provider e ainda estar usando uma configuração antiga. O workflow pode executar enquanto o provider de notificações está parcialmente indisponível.

Por isso, readiness e efetividade são qualified claims.

O runtime efetivo depende do perfil.

Para um sistema local pequeno, efetividade pode significar:

- processo ativo;
- banco acessível;
- UI carregando;
- ações essenciais funcionando.

Para um ambiente crítico distribuído, podem existir requisitos adicionais:

- múltiplos consumidores;
- SLO;
- redundância;
- trust currentness;
- regionalidade;
- recovery posture;
- evidence coverage.

Não existe um booleano universal de “saúde” capaz de resumir toda semântica operacional.

---

## 14. Etapa 12 — observabilidade: produzir evidência sem reescrever a realidade

Quando o sistema entra em operação, começam a surgir sinais:

- logs;
- métricas;
- traces;
- eventos;
- probes;
- provider statuses;
- alarmes;
- feedback humano.

Esses sinais são extremamente importantes, mas não são automaticamente verdade canônica.

Um log dizendo “pedido enviado” não prova que o cliente recebeu. Uma métrica zerada pode significar ausência de eventos ou falha de coleta. Um provider pode reportar “healthy” enquanto uma rota específica está quebrada.

O Capítulo 14 resumiu essa fronteira:

```text
telemetry != canonical domain truth
```

Observability produz e qualifica evidência. Os semantic owners usam essa evidência para formar assessments sobre suas próprias verdades.

### 14.1 Currentness e coverage

Evidência também envelhece.

Um health check de cinco minutos atrás pode ter sido válido quando produzido e não ser suficiente para afirmar o estado atual.

Da mesma forma, observar 20% das instâncias pode não permitir concluir algo sobre 100% da população.

Por isso, freshness/currentness e coverage fazem parte da interpretação.

Quando a evidência é insuficiente, `INCONCLUSIVE` pode ser mais correto que PASS ou FAIL.

---

## 15. Incidente: quando o ciclo precisa explicar o que deu errado

Considere agora uma falha real.

Uma OS foi concluída. O workflow pediu cobrança ao provider. Houve timeout.

A pergunta operacional é:

> “A cobrança aconteceu?”

O timeout sozinho não responde.

Ele não significa necessariamente `NOT_APPLIED`.

O efeito pode ser:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

Se estiver `UNKNOWN`, repetir automaticamente pode cobrar duas vezes.

Por isso:

```text
UNKNOWN -> reconcile-before-retry
```

Reconciliation procura evidência suficiente para descobrir o efeito real antes de tentar novamente uma mutação perigosa.

Esse princípio aparece em providers, workflows, deployments, publicação de artifacts, migrações e várias outras capabilities.

### 15.1 Incident management não muda a verdade por decreto

Abrir um incidente não transforma um signal em diagnóstico confirmado. Fechar um ticket também não prova recuperação.

É preciso distinguir:

```text
alert
    != incident
    != diagnosis
    != remediation attempted
    != recovered
    != revalidated
```

Isso reduz “falsos verdes”: situações nas quais o dashboard voltou a parecer normal, mas o estado empresarial continua inconsistente.

---

## 16. Recovery: voltar a responder não basta

Depois de uma falha grave, existe forte pressão para colocar o sistema “de volta no ar”.

Mas availability não é a única condição.

O Capítulo 15 apresentou a cadeia:

```text
reachable
    != trusted
    != authorized
    != intact
    != recovered
    != re-protected
```

Um servidor restaurado pode estar acessível e ainda possuir:

- credenciais comprometidas;
- dados inconsistentes;
- certificados revogados;
- policies antigas;
- configuração desatualizada;
- bindings incorretos;
- mensagens ainda sendo processadas pelo antigo ambiente.

Recovery exige qualificação do estado recuperado, contenção dos efeitos residuais e eventual reprotection.

### 16.1 Residual cohorts

Essa ideia reaparece constantemente na G2.

Quando mudamos algo, a versão antiga não desaparece necessariamente.

Podem restar:

- sessões;
- workers;
- filas;
- caches;
- clients;
- replicas;
- credenciais;
- artifacts distribuídos;
- workflow instances;
- providers antigos.

Enquanto esses elementos ainda puderem produzir efeitos autoritativos, o cutover não está necessariamente encerrado.

É o problema dos **residual authoritative cohorts**.

---

## 17. Etapa 13 — evolução: o fim do ciclo cria o próximo ciclo

Nenhum sistema empresarial fica parado.

Depois de operar durante algum tempo, surgem novas intenções:

- alterar uma regra;
- adicionar uma capability;
- mudar um provider;
- melhorar uma interface;
- corrigir uma fórmula;
- atender um novo requisito;
- reduzir custo;
- escalar o workload;
- corrigir um incidente recorrente.

O ciclo então recomeça.

Mas ele não recomeça do zero.

Há história.

Processos já iniciados podem continuar em revisões antigas. Dados já existem. Providers possuem recursos reais. Releases estão distribuídas. Usuários têm sessões. Policies e credenciais podem coexistir durante uma transição.

Por isso, evolução não é:

```text
v1 → v2
```

como se um botão substituísse todo o universo instantaneamente.

Na prática, pode existir um revision vector:

```text
Process      P7
Workflow     W5
Schema       S9
Formula      F4
Policy       A12
Provider     B6
Release      R17
Deployment   D42
```

Cada dimensão pode evoluir em ritmo diferente.

Lifecycle coordena coexistência e migração sem assumir a semântica específica de cada domínio.

---

## 18. Coexistência: duas versões podem estar corretas ao mesmo tempo

Imagine que a regra de cálculo de hora técnica mudou em 1º de setembro.

Uma OS aberta em agosto pode precisar continuar usando a fórmula antiga. Outra aberta em setembro usa a nova.

Isso significa que duas revisões podem estar ativas em populações diferentes sem que uma delas seja “errada”.

A pergunta correta deixa de ser:

> “Qual é a versão mais nova?”

E passa a ser:

> “Qual revisão é aplicável a este sujeito, população, operação e momento?”

Essa é uma mudança profunda de mentalidade.

```text
latest != applicable
```

O mesmo vale para schemas, workflows, providers, policies e releases.

---

## 19. Rollback: voltar não é simplesmente apontar para o artefato antigo

O sistema implantou R17 e começou a falhar. R16 ainda existe.

É tentador pensar:

> “Então volta para R16.”

Mas talvez o schema já tenha migrado. Talvez alguns dados tenham sido escritos em formato novo. Talvez o certificado de R16 tenha expirado. Talvez o provider antigo tenha sido retirado. Talvez workflows novos estejam em andamento.

Por isso:

```text
historical availability
    != rollback eligibility
    != rollback actuation
    != state recovery
```

Lifecycle qualifica se uma volta ainda é elegível. Artifact/Release preserva o artefato e sua evidência. Deployment atua sobre o runtime. Data/Schema qualifica o estado dos dados. Security/Recovery verifica segurança e recuperação.

Ninguém pode declarar rollback seguro sozinho quando múltiplos owners participam da condição.

---

## 20. Onde entra o “System Mirroring” nessa história?

A visão de System Mirroring pode ser entendida como algo maior do que copiar telas de uma empresa.

Espelhar uma organização significa capturar, de forma progressivamente explícita:

- processos;
- responsabilidades;
- autoridades;
- dados;
- regras;
- cálculos;
- recursos;
- eventos;
- dependências;
- exceções;
- providers;
- evidência;
- evolução.

Uma empresa real nunca está completamente descrita. Muito conhecimento está implícito nas pessoas, em hábitos e em exceções.

O mirroring é, portanto, um processo de transformação:

```text
realidade empresarial observada
        ↓
conhecimento explicitado
        ↓
semântica modelada
        ↓
composição governada
        ↓
sistema materializado
        ↓
evidência operacional
        ↓
comparação com a realidade
        ↺
novo aprendizado
```

Essa última seta é importante.

A operação do sistema produz nova evidência sobre a própria empresa. O modelo pode ser corrigido. O processo pode ser melhorado. Novos conflitos podem ser descobertos.

O System Builder, nessa visão, não é apenas um gerador inicial de software. Ele participa de um ciclo de compreensão, materialização e evolução.

**HIPÓTESE DE ARQUITETURA:** a forma exata como essa relação será materializada em módulos, serviços e dependências pertence aos estágios arquiteturais posteriores. Este capítulo apenas sintetiza as responsabilidades já sustentadas pelos artefatos autoritativos existentes.

---

## 21. Um exemplo completo: da OS verbal ao sistema em produção

Vamos acompanhar um cenário didático.

### 21.1 A intenção

Um gerente diz:

> “Quero impedir que uma corretiva cara comece sem verificar material, disponibilidade do técnico e autorização.”

### 21.2 A elicitação

Descobre-se que “cara” significa orçamento previsto acima de um limite revisionado por Station. Técnicos podem ser de expediente, 24h ou sobreaviso. Certos materiais exigem autorização adicional.

### 21.3 A modelagem

O modelo passa a conter conceitos como:

```text
WorkOrder
Technician
MaterialReservation
AuthorizationRequirement
EstimatedCost
ExecutionEligibility
```

com identidades e revisões explícitas.

### 21.4 A composição

Um fluxo é proposto:

```text
OS criada
   ↓
classificação técnica
   ↓
estimativa de custo
   ↓
consulta de disponibilidade
   ↓
reserva de material
   ↓
aprovação quando aplicável
   ↓
execução
   ↓
registro do resultado
   ↓
fechamento
```

UI projeta as atividades; Workflow executa estados; Data persiste fatos; Authorization decide quem pode aprovar.

### 21.5 A autoridade

A policy informa que o supervisor da Station pode aprovar até certo valor. Acima disso, é necessária autoridade superior.

A pessoa que desenhou o processo não pode simplesmente remover esse requisito.

### 21.6 Providers

O sistema precisa enviar e-mail e armazenar anexos.

Providers candidatos são descobertos. Suporte, residência de dados, limites, evidência e outras dimensões são qualificadas. Um provider é admitido e vinculado.

### 21.7 Build

As definições, código gerado, dependências e materiais são fechados sob um build profile. Outputs são produzidos e validados.

### 21.8 Release

Os outputs são adotados como artifacts imutáveis. A release recebe identidade, provenance e evidência de supply chain.

### 21.9 Deployment

A release é ligada ao ambiente de produção com suas configurações e bindings.

O desired generation é registrado.

### 21.10 Realização

O provider aceita a implantação.

Isso ainda não prova sucesso.

Os recursos são observados, ficam ready e depois o tráfego é validado com o comportamento esperado.

### 21.11 Operação

Uma OS real passa pelo processo.

A observabilidade coleta evidência. O workflow mantém execução durável. As decisões de autorização registram lineage.

### 21.12 Falha

O provider de e-mail retorna timeout.

O efeito fica `UNKNOWN`. O sistema reconcilia antes de repetir para evitar envio duplicado quando isso for relevante.

### 21.13 Evolução

Meses depois, a empresa altera o limite de aprovação e troca o provider de storage.

O processo recebe nova revisão. O provider é substituído mediante qualification e cutover. OS antigas continuam qualificadas segundo suas revisões aplicáveis até a transição definida.

O ciclo reinicia sem apagar a história.

---

## 22. O que o Builder faz e o que ele não deve fazer

Vendo o ciclo completo, fica mais fácil entender a posição do System Builder.

O Builder pode funcionar como um grande ambiente de coordenação:

```text
elicitar
modelar
analisar
compor
propor
validar
qualificar
materializar
construir
publicar
orquestrar transições autorizadas
observar
reconciliar
explicar
```

Mas o Builder não deve virar uma fonte arbitrária de verdade para tudo.

Ele não deve dizer:

> “O provider respondeu sucesso, então o processo deu certo.”

nem:

> “A IA sugeriu, então é uma decisão válida.”

nem:

> “O artifact existe, então está rodando.”

nem:

> “A versão é mais nova, então deve ser usada.”

nem:

> “O usuário tem a tela, então tem permissão.”

A Generation 2 tenta justamente impedir esses colapsos semânticos.

---

## 23. O runtime pequeno e autônomo no ciclo completo

Quando o sistema é finalmente construído, o runtime não precisa preservar todos os mecanismos usados para criá-lo.

Isso permite o princípio:

```text
Builder grande
Runtime pequeno
```

O Builder pode ter:

- Canvas;
- IA;
- analyzers;
- importadores;
- generators;
- qualification tooling;
- research/proof tooling;
- administração de providers;
- mecanismos de composição.

Já o runtime deve reter aquilo que seu perfil operacional realmente necessita.

Essa retained closure pode incluir:

- artifacts executáveis;
- schemas;
- configuração;
- trust material;
- policies locais necessárias;
- bindings;
- workflows;
- componentes de UI;
- dependências externas explicitamente declaradas.

Autonomia não significa ausência de dependências. Significa que a dependência do próprio Builder em tempo de execução pode ser eliminada quando o perfil permitir, enquanto as demais dependências permanecem explícitas.

Esse princípio é central para a visão anti-lock-in.

---

## 24. Por que tanta separação não torna o sistema excessivamente complexo?

A primeira reação a esse modelo pode ser:

> “Não estamos complicando demais?”

Existe um trade-off real.

Se cada distinção virar um serviço, uma tabela, uma tela e um processo burocrático, o sistema se tornará impraticável.

Mas esse não é o objetivo.

As distinções são **semânticas antes de serem topológicas**.

Duas responsabilidades diferentes podem ser implementadas no mesmo processo, pacote ou banco quando isso for adequado, desde que suas verdades não sejam confundidas.

Uma instalação pequena pode colapsar topologia:

```text
1 servidor
1 banco
1 processo
```

sem precisar colapsar conceitos como:

```text
release != deployment
identity != authorization
provider id != canonical id
observed != desired
```

Essa é a ideia de uma plataforma que pode servir do pequeno ao complexo sem exigir complexidade operacional máxima desde o início.

A arquitetura alvo concreta ainda não foi decidida neste estágio.

---

## 25. As separações que sustentam o ciclo inteiro

Ao longo dos capítulos anteriores, algumas relações apareceram repetidamente. Juntas, elas formam uma espécie de gramática conceitual da Generation 2.

### Verdade e evidência

```text
observation != canonical truth
```

### Providers

```text
discovered != qualified != admitted != bound != effective
```

### Build e operação

```text
build != release != deployment != runtime-effective
```

### Autoridade

```text
capability availability != authority
```

### IA

```text
proposal != decision
```

### Sistemas distribuídos

```text
timeout != NOT_APPLIED
UNKNOWN -> reconcile-before-retry
```

### Evolução

```text
latest != applicable
historical availability != rollback eligibility
```

### Composição

```text
component-valid != composition-valid
```

### Pesquisa e testes

```text
Signal != ConfirmedConflict
absence of observed failure != proof of absence
```

Essas separações reduzem um tipo específico de erro: **promover uma evidência fraca ou um estado intermediário a uma conclusão mais forte do que ela suporta**.

---

## 26. Onde está a verdade em cada parte do ciclo?

Uma forma prática de memorizar o modelo é perguntar quem possui cada significado.

| Pergunta | Owner conceitual predominante |
|---|---|
| O que este processo significa? | Process & Application Modeling |
| Em qual estado esta execução durável está? | Workflow & Durable Execution |
| Qual é o fato/schema canônico? | Data / Schema / Migrations |
| Quem pode fazer esta ação? | Authorization / Policy / Organization |
| Como a experiência é projetada? | UI / Generated Experience |
| Como a Station expõe trabalho governado? | AGWS |
| Qual provider está qualificado/vinculado? | Provider / Binding / Capability Negotiation |
| Quais materiais produziram este output? | Build / Dependency Graph / Reproducibility |
| Qual artifact/release foi publicado? | Artifact / Release / SBOM / Provenance |
| O que deveria estar rodando e o que está efetivamente servindo? | Deployment / Environment / Runtime |
| Que evidência operacional existe? | Observability / Operations / Incident |
| A mudança/coexistência/rollback ainda é elegível? | Lifecycle / Versioning / Evolution / Migration |
| A recuperação é segura e qualificada? | Security / Resilience / Failure Recovery |

Essa tabela não significa isolamento.

Os owners consomem evidências uns dos outros constantemente. O que se evita é **ownership por conveniência**: o componente que tem acesso ao dado não se torna automaticamente dono do significado daquele dado.

---

## 27. A Generation 2 ainda está em pesquisa adversarial

Este capítulo fecha uma narrativa conceitual, não a arquitetura da Generation 2.

No snapshot autoritativo consultado para esta publicação, a campanha `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION` permanece `ACTIVE / NOT_SATURATED`. Full Passes 1, 2 e 3 estão completos; o Full Pass 4 está em andamento. Planning C continua bloqueado.

Isso importa porque muitas relações aqui são **fronteiras já decididas em Planning A**, enquanto a forma concreta da arquitetura alvo ainda não deve ser inferida.

**DECIDIDO:** semantic ownership, truth separation, non-amplification, qualified evidence, provider qualification, effect dispositions e outras boundaries já fechadas nos artefatos correspondentes.

**EM PESQUISA:** suficiência adversarial dessas fronteiras diante das combinações, falhas, version-skew e negative-space ainda sendo explorados.

**ABERTO/INCONCLUSIVO:** desenho final de módulos, dependências, packages, deployment topology e outras decisões que pertencem a Planning C ou etapas posteriores.

O livro não deve atravessar esse gate por conta própria.

---

## 28. Referências internas principais

Este capítulo sintetiza principalmente os seguintes artefatos autoritativos e capítulos anteriores:

- `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`;
- `project_docs/generation-2/planning/PLANNING_A_PROCESS_APPLICATION_MODELING_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_ARTIFACT_RELEASE_SBOM_PROVENANCE_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_DEPLOYMENT_ENVIRONMENT_RUNTIME_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_A_LIFECYCLE_VERSIONING_EVOLUTION_MIGRATION_BOUNDARIES.md`;
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- Capítulos 02–21 deste livro, como camada didática anterior.

As referências acima sustentam a síntese. Em caso de divergência, prevalecem os artefatos autoritativos da pesquisa/Planning, não este capítulo.

---

## 29. O que você deve guardar deste capítulo

Se você lembrar apenas de uma ideia, lembre desta:

**o System Builder não transforma intenção humana diretamente em “software pronto”; ele coordena uma cadeia de transformações nas quais cada etapa precisa preservar significado, autoridade, identidade, evidência e história.**

A frase humana vira modelo. O modelo vira composição. A composição precisa ser válida e autorizada. Providers precisam ser qualificados. Dependências precisam ser fechadas. Outputs precisam virar artifacts e releases. Releases precisam ser implantadas. Deployment precisa convergir para runtime efetivo. Operação precisa produzir evidência. Falhas precisam ser reconciliadas e recuperadas. Mudanças precisam coexistir e evoluir sem apagar história.

Em forma compacta:

```text
intenção
  ↓
semântica
  ↓
composição
  ↓
autoridade
  ↓
realização qualificada
  ↓
build
  ↓
release
  ↓
deployment
  ↓
runtime efetivo
  ↓
evidência
  ↓
evolução
  ↺
```

E, durante todo esse ciclo:

```text
não confunda
uma evidência
com uma verdade
mais forte do que ela realmente prova.
```
