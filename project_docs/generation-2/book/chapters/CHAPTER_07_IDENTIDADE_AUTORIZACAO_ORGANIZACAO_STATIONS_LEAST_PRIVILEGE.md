# Capítulo 07 — Identidade, autorização, organização, Stations e least privilege — v1.0.0

> **Identidade editorial:** `CHAPTER_07`  
> **Versão editorial:** `1.0.0`  
> **Status:** `PUBLISHED`  
> **Primeira publicação:** 2026-09-04  
> **Camada:** livro técnico-conceitual; não substitui pesquisa, síntese, Planning A/B ou futura arquitetura alvo.  
> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: “eu sei quem você é” não significa “você pode fazer isso”

Imagine uma empresa de manutenção. João trabalha na oficina. O sistema sabe que João é João porque ele fez login corretamente. Sua senha, chave ou outro mecanismo de autenticação foi aceito. Até aqui, o sistema respondeu a uma pergunta de **identidade e autenticação**.

Agora João tenta aprovar uma compra de R$ 80.000,00.

Saber que João é realmente João ainda não responde:

- se ele pertence à unidade responsável pela compra;
- se ocupa um papel que permite aprovações;
- qual é o limite financeiro desse papel;
- se existe uma política superior proibindo aquela aprovação;
- se a aprovação exige uma segunda pessoa;
- se João está substituindo temporariamente um gestor;
- se essa substituição ainda está válida;
- se a operação pertence à Station em que ele está atuando;
- se a política mudou desde que a tela foi aberta;
- se uma credencial antiga ou um cache ainda está carregando uma permissão já revogada.

Essa é uma distinção simples de dizer e extremamente importante de preservar tecnicamente:

```text
Identidade / autenticação
        ↓
“quem ou o que é este principal e com que evidência foi autenticado?”

Autorização
        ↓
“este principal pode executar esta ação sobre este recurso,
 neste escopo, sob estas políticas e revisões?”
```

**DECIDIDO em Planning A quanto à fronteira semântica:** autenticação não concede autorização por si só. A capability de Identity / Authentication / Federation possui o significado da identidade e das evidências de autenticação; Authorization / Policy / Organization / Multitenancy possui o significado da permissão, delegação, organização e escopo de autoridade.

Essa separação evita uma família enorme de erros empresariais. Um usuário autenticado não deve virar administrador apenas porque possui uma sessão válida. Um grupo recebido de um provedor de identidade não deve virar automaticamente um papel canônico da empresa. Uma ação mostrada na tela não deve se tornar permitida por estar visível. Uma IA que consegue formular uma operação não deve adquirir autoridade para executá-la.

---

## 2. Quatro perguntas diferentes que sistemas simples costumam misturar

Em sistemas pequenos, é comum encontrar tudo dentro de uma ideia vaga chamada “usuário”. Quando o sistema cresce, isso deixa de ser suficiente.

É mais seguro separar pelo menos quatro perguntas.

### 2.1 Quem é?

É uma pergunta de **identidade**.

Exemplos:

- esta pessoa é João Silva;
- este serviço é o robô de integração da Station A;
- esta conta externa corresponde, sob um binding qualificado, à identidade canônica X.

A identidade precisa sobreviver melhor que um username, um e-mail ou um identificador de provider. E-mail pode mudar. Username pode ser reutilizado. Um IdP pode ser trocado. Um `sub` de OpenID Connect pode ter semântica dependente do emissor e do tipo de subject identifier.

Por isso, na visão pesquisada da G2:

```text
Canonical Person Identity
    != email
    != username
    != provider account id
    != token subject
    != Role
    != Station
```

O símbolo `!=` aqui não significa que esses elementos nunca possam estar relacionados. Significa que **não são semanticamente a mesma coisa por definição**.

### 2.2 Como sabemos que é?

É uma pergunta de **autenticação**.

Autenticação é o processo pelo qual o sistema aceita evidência de que um principal corresponde à identidade apresentada, dentro de um nível de confiança e um contexto.

Uma autenticação pode depender de:

- senha;
- chave criptográfica;
- certificado;
- MFA;
- autenticação federada;
- sessão previamente estabelecida;
- reautenticação para uma operação sensível;
- fatores e evidências válidos somente durante determinado horizonte.

Uma autenticação aceita às 8h não precisa continuar suficiente para toda operação às 17h. Uma sessão pode continuar tecnicamente existente enquanto a política passa a exigir um fator adicional para uma ação crítica.

Esse problema é chamado, no vocabulário G2, de **currentness**: a evidência precisa ser suficientemente atual para o uso que está sendo feito dela.

### 2.3 O que pode fazer?

É a pergunta de **autorização**.

Autorização avalia algo conceitualmente parecido com:

```text
Principal
+ ação
+ recurso
+ escopo organizacional
+ políticas aplicáveis
+ delegações
+ restrições herdadas
+ evidência exigida
+ revisões
+ currentness
--------------------------------
= decisão de autorização
```

A forma exata futura ainda não está decidida. O importante é compreender que a decisão é contextual.

“João pode editar OS” é muito pobre se a realidade for:

> João pode editar determinadas OS da Station Porto Alegre enquanto estiver no Role de Supervisor, exceto OS fechadas, e somente enquanto a associação e a política correspondentes continuarem atuais.

### 2.4 Em nome de qual estrutura organizacional está atuando?

É uma pergunta de **organização, tenant, Station, Role e delegação**.

A mesma pessoa pode participar de contextos diferentes. Ela pode ser:

- supervisora na Station A;
- apenas técnica na Station B;
- auditora temporária em um projeto;
- substituta de um gestor até determinada data.

A identidade da pessoa não precisa mudar quando o contexto de autoridade muda.

Esse é um dos motivos para a G2 preservar a cadeia conceitual:

```text
Enterprise → Station → Role → Person
```

Ela não representa uma árvore de identidade. Representa uma **hierarquia governada de autoridade e especialização**.

---

## 3. Identidade canônica e identidade de realização

No Capítulo 03 vimos a separação entre semântica canônica e mecanismos de providers. Identidade é um caso em que essa distinção se torna particularmente concreta.

Uma empresa pode usar hoje:

```text
Microsoft Entra ID
        ↓
conta externa 12345
        ↓
Pessoa canônica: João Silva
```

E amanhã trocar para outro provider:

```text
Outro IdP
    ↓
conta externa ABC
    ↓
Pessoa canônica: João Silva
```

Se a identidade empresarial fosse simplesmente `12345`, a troca de provider redefiniria a própria pessoa dentro do sistema.

A direção pesquisada é outra:

```text
CanonicalIdentity(Person: João)
        ↑               ↑
        |               |
 provider binding A   provider binding B
        |               |
 external id 12345    external id ABC
```

Os identificadores externos são **identidades de realização** ou evidências de mapping. Eles podem ser vinculados à identidade canônica mediante regras e evidências qualificadas.

### 3.1 Por que não usar e-mail como identidade universal?

Porque e-mail parece estável até deixar de ser.

Considere:

1. `joao@empresa.com` pertence a João;
2. João deixa a empresa;
3. a conta é desativada;
4. anos depois o endereço é reutilizado;
5. um sistema histórico ainda trata o e-mail como chave de identidade.

Sem identidade canônica e lineage, registros antigos podem parecer pertencer à pessoa nova.

Outro caso: uma pessoa altera o sobrenome e o endereço corporativo. A pessoa permaneceu a mesma; o alias mudou.

### 3.2 Merge e split de identidade são operações perigosas

Duas contas externas não devem ser automaticamente unificadas porque possuem o mesmo nome ou e-mail semelhante.

Da mesma forma, descobrir que duas identidades foram incorretamente unificadas pode exigir um **split** — separar aquilo que o sistema anteriormente considerava uma pessoa só.

**EM PESQUISA:** a G2 exige que ambiguidades de mapping permaneçam explícitas. Quando a evidência não permite afirmar com segurança que duas identidades correspondem à mesma pessoa, o resultado apropriado pode ser `INCONCLUSIVE`, em vez de uma correlação automática.

Isso é particularmente importante para IA. Um modelo pode achar “provável” que duas contas representem a mesma pessoa. Probabilidade de correlação não é autoridade para reescrever a identidade canônica.

---

## 4. Authentication is evidence, not authority

A frase em inglês aparece frequentemente em sistemas de segurança: **authentication is not authorization** — autenticação não é autorização.

No contexto do SB podemos formular de forma ainda mais precisa:

```text
AuthenticationEvidence != AuthorizationDecision
```

Autenticação produz **evidência qualificada** que pode ser consumida por uma política de autorização.

Exemplo:

```text
Pessoa: Maria
Autenticação: válida
Método: senha + MFA
Freshness: 3 minutos
Provider: IdP-A
Binding revision: 12
```

Uma política pode então dizer:

> Para assinar um contrato superior a R$ 100 mil, exigir autenticação MFA com freshness máxima de 10 minutos e autoridade de assinatura válida para a Station correspondente.

Observe que a autenticação não decide a permissão. Ela fornece fatos para que a autorização avalie a operação.

### 4.1 Assurance

**Assurance** é, simplificadamente, o grau e o contexto de confiança que acompanham uma autenticação.

Não deve ser reduzido ingenuamente a “logado = sim”. Diferentes operações podem exigir níveis diferentes.

Um acesso de leitura ao mural interno pode aceitar uma sessão mais antiga. A emissão de um certificado, transferência financeira ou mudança de política pode exigir step-up authentication.

### 4.2 Step-up e reautenticação

**Step-up authentication** é exigir uma autenticação mais forte ou mais recente quando a sensibilidade da ação aumenta.

Exemplo:

```text
abrir dashboard
    → sessão atual suficiente

alterar telefone
    → reautenticação

aprovar pagamento elevado
    → MFA recente + autoridade específica
```

O importante para o SB é que a UI não seja dona dessa decisão. A tela pode solicitar o step-up, mas o requisito nasce da política/owner competente.

---

## 5. O que significa `Enterprise → Station → Role → Person`

Essa hierarquia é um dos conceitos centrais da Generation 2 e merece ser entendida sem analogia excessiva.

```text
Enterprise
   ↓
Station
   ↓
Role
   ↓
Person
```

### 5.1 Enterprise

O **Enterprise** representa o nível superior de invariantes e envelopes de autoridade aplicáveis à organização modelada.

Pode estabelecer, por exemplo:

- classes de ações que nunca podem ser delegadas abaixo de certo nível;
- requisitos mínimos de segurança;
- limites de aprovação;
- capabilities que podem ou não ser expostas a Stations;
- restrições obrigatórias que níveis inferiores não podem remover.

### 5.2 Station

A **Station** funciona como um escopo governado de operação, administração e exposição de capabilities.

Ela pode corresponder, dependendo do desenho empresarial, a uma unidade, operação local, centro, filial ou outro domínio governado. O termo não deve ser reduzido a “filial física”: sua definição arquitetural futura precisa preservar o papel semântico estabelecido pelos artefatos G2.

Uma Station recebe um envelope de autoridade. Ela pode especializar dentro do que recebeu, mas não criar poder que não foi delegado.

### 5.3 Role

**Role** é um papel organizacional/de autoridade.

Exemplos didáticos:

- Técnico;
- Supervisor de manutenção;
- Comprador;
- Aprovador financeiro;
- Auditor.

Role não é a pessoa. Uma pessoa ocupa ou recebe relações com roles sob determinados escopos.

### 5.4 Person

**Person** é a pessoa canônica.

A autoridade efetiva que chega a ela depende das relações e restrições aplicáveis.

Podemos representar didaticamente:

```text
Enterprise permite no máximo X
        ∩
Station delega Y
        ∩
Role permite Z
        ∩
atribuições atuais da Person
        ∩
políticas específicas da operação
        =
Autoridade efetiva
```

Não é necessário que a implementação final use literalmente operações de interseção em todos os casos. A expressão representa o princípio de **não amplificação**: uma camada inferior não deve ganhar autoridade que a camada superior não permitiu delegar.

---

## 6. Least privilege: dar apenas o poder necessário

O princípio do **menor privilégio (least privilege)** estabelece que uma pessoa, serviço, processo ou automação deve possuir apenas a autoridade necessária para realizar sua função, pelo tempo e escopo necessários.

Parece apenas uma prática de segurança, mas é também uma técnica de redução de blast radius.

Compare:

```text
Robô A
pode: criar qualquer registro, apagar qualquer registro,
      alterar usuários, executar pagamentos
```

com:

```text
Robô A
pode: criar rascunho de pedido
scope: Station X
limite: sem aprovação financeira
expira: credencial/autoridade revisionada
```

Se o primeiro robô falhar, for explorado ou receber uma instrução ruim de IA, o dano potencial é enorme.

No segundo caso, a própria autoridade disponível limita o efeito.

### 6.1 Least privilege não é “menos permissões sempre”

A aplicação cega do princípio também pode quebrar processos legítimos.

O objetivo não é retirar aleatoriamente privilégios. É alinhar a autoridade às responsabilidades reais, incluindo exceções explicitamente governadas.

Um médico de plantão, um operador de emergência ou um administrador de incidente pode precisar temporariamente de poderes amplos. O princípio continua valendo se essa ampliação for:

- explícita;
- justificada;
- limitada no tempo;
- limitada em escopo;
- auditável;
- revogável;
- sujeita às constraints superiores.

Isso nos leva a delegação e break-glass.

---

## 7. Delegação: emprestar autoridade sem transferir soberania

Delegar não significa entregar toda a autoridade de quem delegou.

Imagine que Ana possa aprovar compras até R$ 100 mil. Ela entra em férias e delega a Bruno autorização para aprovar compras até R$ 20 mil durante cinco dias.

Uma representação conceitual adequada precisa preservar algo como:

```text
Delegador: Ana
Delegado: Bruno
Escopo: compras / Station A
Limite: <= R$ 20.000
Início: data X
Fim: data Y
Subdelegação: não permitida
Origem da autoridade: envelope de Ana
```

Bruno não deve poder transformar essa delegação em:

- aprovação de R$ 100 mil;
- autoridade sobre outra Station;
- direito de criar novos administradores;
- delegação perpétua;
- subdelegação se ela não foi permitida.

### 7.1 Delegação não é transitiva por padrão

Se Ana delegou a Bruno, não significa que Bruno pode automaticamente delegar a Carlos.

A subdelegação precisa estar dentro do envelope original.

Esse princípio evita cadeias de autoridade que crescem silenciosamente:

```text
A → B → C → D → ...
```

em que cada participante acredita estar apenas repassando uma permissão legítima, mas o conjunto termina produzindo autoridade que ninguém concedeu explicitamente.

---

## 8. Break-glass: emergência não significa ausência de regra

**Break-glass** é o nome dado a mecanismos de acesso emergencial — a ideia de “quebrar o vidro” quando uma situação crítica exige uma exceção operacional.

Por exemplo:

- todos os administradores normais estão indisponíveis;
- uma credencial principal falhou;
- um incidente crítico exige bloquear rapidamente um provider;
- uma operação de recuperação precisa de poderes excepcionais.

O erro seria modelar break-glass como:

```text
emergency = true
→ ignore todas as regras
```

Na direção pesquisada da G2, break-glass continua sendo **autoridade governada**.

Ele pode exigir:

- quem pode ativá-lo;
- quais recursos cobre;
- quais ações habilita;
- quanto tempo dura;
- motivo obrigatório;
- evidence/provenance;
- revisão posterior;
- revogação e drenagem de cohorts residuais.

### 8.1 O problema do privilégio que “fica para trás”

Suponha que um acesso emergencial expire às 15h.

Mas existem:

- uma sessão emitida às 14h50;
- um cache de decisão válido por uma hora;
- um worker offline;
- um token delegado ainda aceito por outro serviço.

No papel, o grant acabou. Na prática, ainda existem consumidores capazes de produzir efeitos.

Esses consumidores são exemplos de **residual authority cohorts** — cohorts residuais de autoridade.

O cutover de autoridade só converge quando essas populações antigas são expiradas, drenadas, revogadas ou requalificadas de acordo com o contrato aplicável.

---

## 9. Currentness: uma permissão correta ontem pode estar errada agora

Autorização é especialmente sensível a tempo.

Considere uma OS aberta às 10h. O sistema verifica:

```text
Carlos = Supervisor
→ ALLOW editar OS
```

Às 10h05, Carlos é removido do Role.

A tela continua aberta até 10h30 e o usuário clica “Aprovar”.

Qual decisão vale?

A resposta não deve vir de uma regra universal simplista como “a autorização do início da sessão vale até logout”. A política do efeito precisa definir a currentness necessária.

Para operações consequenciais, é comum que a autoridade precise ser reavaliada no **effect boundary** — perto do momento em que a operação realmente produzirá seu efeito.

Isso é particularmente importante em workflows longos.

```text
segunda-feira: tarefa atribuída
terça-feira: Role revogado
quarta-feira: usuário tenta concluir tarefa
```

O fato de a tarefa ter sido atribuída legalmente na segunda não prova que a pessoa continua autorizada na quarta.

### 9.1 Revision vectors de autorização

Uma decisão pode depender de várias dimensões que mudam de forma independente:

```text
policyRevision
membershipRevision
roleRevision
delegationRevision
stationRevision
authenticationAssuranceRevision
providerBindingRevision
```

Se apenas uma dessas dimensões for pinada e as outras forem presumidas como “atuais”, pode surgir um decision skew.

A pesquisa G2 usa **revision vectors** para evitar a ilusão de que uma versão global única explica todo o contexto.

---

## 10. `ALLOW`, `DENY` e `INCONCLUSIVE`

Sistemas simples frequentemente representam autorização como booleano:

```text
true = permitido
false = negado
```

Esse modelo funciona apenas enquanto o sistema consegue determinar tudo de forma confiável.

Em um ambiente distribuído, pode existir uma terceira situação:

> Não temos evidência suficiente para afirmar se a operação está permitida sob a política atual.

Por isso Planning A preserva conceitualmente:

- `ALLOW` — existe autoridade positiva qualificada;
- `DENY` — uma restrição aplicável proíbe a operação ou falta autoridade necessária;
- `INCONCLUSIVE` — a evidência necessária está ausente, stale, ambígua, parcialmente coberta ou não verificável.

### 10.1 `INCONCLUSIVE` não significa “deixe passar”

Essa distinção é crucial:

```text
INCONCLUSIVE != ALLOW
```

A política aplicável decide o comportamento.

Para uma leitura pouco sensível, talvez exista um degraded path explicitamente permitido.

Para criar administrador, mudar política, realizar pagamento ou expandir autoridade, o comportamento esperado tende a ser fail-closed.

A regra geral de segurança é: indisponibilidade do mecanismo de autorização não deve aumentar privilégio.

---

## 11. Policy composition: várias regras corretas podem produzir uma decisão errada

Uma empresa madura raramente possui uma única política.

Pode haver simultaneamente:

- política Enterprise;
- política da Station;
- policy de Role;
- permissions boundary;
- restrição do recurso;
- regra temporária;
- session policy;
- regra de privacy;
- obrigação de governance.

O perigo aparece quando cada regra é localmente válida, mas sua composição é mal interpretada.

### Exemplo

A Station permite:

```text
Role Comprador → criar pedido
```

A Enterprise determina:

```text
pedidos acima de R$ 50 mil exigem dupla aprovação
```

Uma implementação ingênua encontra a primeira regra positiva e retorna `ALLOW`.

Localmente, a regra da Station está correta. O erro está na composição.

A pesquisa adversarial classifica esse tipo de problema na família de **policy precedence** e conflitos de composição de autoridade.

### 11.1 Providers podem ter semânticas diferentes

Dois engines podem anunciar “RBAC” ou “policy engine” e ainda assim tratar de maneiras diferentes:

- deny explícito;
- conflito entre allow e deny;
- erro durante avaliação;
- política inexistente;
- relações herdadas;
- cache e consistência;
- decisão indeterminada.

Logo:

```text
“supports RBAC”
    !=
“possui semântica equivalente de autorização”
```

Isso conecta este capítulo ao Capítulo 03: providerabilidade exige qualificação semântica, não comparação de labels.

---

## 12. Separation of Duty: algumas operações precisam de pessoas diferentes

**Separação de funções (Separation of Duty, SoD)** é uma técnica de controle em que uma única pessoa não deve acumular certas responsabilidades incompatíveis.

Exemplo clássico:

```text
Pessoa A solicita pagamento
Pessoa B aprova pagamento
Pessoa C executa ou reconcilia
```

O objetivo é reduzir fraude, erro e abuso unilateral.

### 12.1 O conflito pode aparecer entre processos distintos

Imagine três workflows separados:

1. workflow de solicitação;
2. workflow de aprovação;
3. workflow de pagamento.

Cada workflow individualmente verifica seu Role corretamente.

Mas a mesma pessoa possui todos os Roles naquele contexto.

Cada processo é localmente válido. A composição empresarial viola SoD.

Esse é exatamente o tipo de caso que a campanha adversarial G2 procura: **partes corretas formando um processo incorreto**.

### 12.2 SoD dinâmica

Não basta verificar nomes de Roles estáticos.

Pode ser necessário avaliar fatos como:

- quem realmente iniciou esta instância;
- quem aprovou este item;
- quem recebeu delegação temporária;
- se duas identidades externas convergem para a mesma Person canônica;
- se uma IA está atuando em nome do mesmo principal em etapas diferentes.

Assim, SoD é frequentemente uma propriedade do histórico e da composição, não apenas de uma tabela `role -> permission`.

---

## 13. Station isolation: compartilhar infraestrutura não significa compartilhar autoridade

O Capítulo 04 mostrou que topologia física pode colapsar sem que as identidades semânticas colapsem.

Esse princípio é vital para multitenancy e Stations.

Duas Stations podem compartilhar:

- banco;
- runtime;
- provider de e-mail;
- cache;
- engine de policy;
- cluster de containers.

Isso não significa que autoridade possa atravessar de uma para outra.

```text
shared provider
      ↓
Station A     Station B
   |             |
authority A   authority B
```

Um provider pode enxergar os dois contextos. O contrato canônico ainda precisa preservar isolamento.

### 13.1 O risco de cache sem scope suficiente

Suponha que o sistema cacheie:

```text
user=123 + action=approve → ALLOW
```

mas omita do cache key:

- Station;
- resource;
- policy revision;
- Role;
- tenant;
- delegation context.

Uma decisão válida na Station A pode ser reutilizada indevidamente na Station B.

O erro não está necessariamente no engine de autorização. Pode estar no boundary que perdeu parte do contexto acumulado.

Isso retoma o conceito de **cumulative context** do Capítulo 04: informação relevante precisa atravessar boundaries sem obrigar todas as camadas a compartilhar implementação.

---

## 14. Offline e degraded mode: autonomia não pode fabricar autoridade

Um runtime autônomo pode precisar continuar funcionando mesmo quando está temporariamente desconectado do Builder ou de um provider central.

Isso cria uma tensão legítima:

```text
Disponibilidade
vs.
Currentness da autoridade
```

A solução não é escolher sempre um lado.

A direção pesquisada é trabalhar com uma **offline authorization closure**: um conjunto explicitamente retido de políticas, relações e evidências que pode continuar qualificando certas operações por determinado horizonte.

Exemplo:

```text
Station desconectada

permitido:
- consultar OS locais
- registrar horas
- criar rascunhos

não permitido sem currentness central:
- criar administrador
- ampliar limite financeiro
- delegar novas capabilities
```

Esses exemplos são didáticos; a policy final dependerá da arquitetura e domínio concretos.

O princípio, porém, é importante:

```text
offline != authority expansion
```

Quando a evidência necessária expira, a operação pode precisar se tornar `INCONCLUSIVE` ou falhar fechada.

---

## 15. AGWS e IA: assistência sem amplificação de autoridade

Adaptive Governed Work Surfaces (AGWS) e IA podem adaptar superfícies, sugerir ações, organizar tarefas e gerar composições.

Mas nenhuma dessas capacidades deve criar autoridade apenas por conseguir expressar uma ação.

Considere uma IA que recebe:

> “Resolva todas as pendências desta Station.”

Ela encontra uma ação administrativa que tecnicamente resolveria várias pendências de uma vez.

A IA pode ser capaz de:

- descobrir a ação;
- explicar o efeito;
- montar os parâmetros;
- sugerir sua execução.

Nada disso responde se ela **pode atuar**.

A regra de não amplificação pode ser representada assim:

```text
Authority(AI acting for Person P)
    ⊆
Authority explicitly delegated to that actuation context
```

A IA não recebe automaticamente toda autoridade da pessoa, do Role ou do sistema.

### 15.1 O risco do “confused deputy”

Um **confused deputy** ocorre quando um componente com autoridade elevada é induzido a usá-la em benefício de quem não possui essa autoridade.

Exemplo:

1. um serviço interno possui credencial de administrador;
2. um usuário comum consegue enviar uma instrução ao serviço;
3. o serviço executa a instrução usando sua própria credencial;
4. o sistema verifica apenas “o serviço é administrador”.

A autoridade do serviço foi usada para amplificar a autoridade do usuário.

Por isso, o contexto causal e de delegação precisa sobreviver até o effect boundary.

---

## 16. O que o SB atual já evidencia

É importante separar claramente a pesquisa G2 do que existe hoje.

### 16.1 Identidade e sessão

**EVIDENCIADO NO SB ATUAL:** Planning B encontrou um slice explícito de identidade/sessão no runtime gerado:

- identidades lógicas com `id`, `kind`, `subjectRef`, `active` e referência ao authentication provider;
- providers de autenticação como referências lógicas vinculadas a secret references;
- tokens de sessão opacos emitidos localmente;
- expiração explícita;
- fail-closed para sessão ausente, desconhecida, expirada ou identidade desativada;
- ausência do token emitido nos artefatos compilados;
- ator autenticado separado de role grants, permission grants e policy decisions.

Isso é uma base concreta importante.

### 16.2 Authorization

**EVIDENCIADO NO SB ATUAL:** Planning B também encontrou:

- `roleBindings` explícitos;
- permissions baseadas em `role + resource + actions`;
- políticas estruturadas `allow|deny`;
- validação de referências pelo compiler;
- rejeição de bindings ambíguos;
- resolução determinística de roles;
- default deny;
- evidence/reason codes em decisões;
- separação entre texto livre de política e política executável.

Isso significa que a separação entre autenticação e autorização já possui evidência concreta no produto atual.

### 16.3 O que ainda não está evidenciado como capacidade completa

**EM PESQUISA / GAP G2:** o SB atual não evidencia como modelo completo e generalizado:

- identidade canônica com mappings externos revisionados e ambiguity handling;
- federation/assurance/currentness completos;
- `AUTHENTICATED / NOT_AUTHENTICATED / INCONCLUSIVE` generalizado;
- Enterprise, Station e Person como cadeia completa de autoridade;
- delegation envelopes;
- mandatory inherited constraints;
- temporary grants e break-glass first-class;
- `ALLOW / DENY / INCONCLUSIVE` como contrato geral;
- policy/model/currentness revision vectors completos;
- residual authority cohort drainage;
- offline authorization closure generalizada;
- semantic provider substitution de authorization engines;
- prova estrutural completa de non-amplification por AGWS/IA.

A direção atual identificada em Planning B é predominantemente:

```text
KEEP + HARDEN + GENERALIZE + INTEGRATE
```

Não existe evidência que justifique simplesmente substituir toda a base existente.

---

## 17. O que a pesquisa adversarial tentou quebrar

A campanha adversarial não testa apenas “usuário sem permissão recebe 403?”. Ela tenta falsificar premissas mais profundas.

No segundo full pass, Identity e Authorization foram revisitadas com técnicas diferentes das usadas inicialmente.

### 17.1 Identidade

Foram desafiados, entre outros:

- reassignment de e-mail/username;
- `sub` público versus pairwise;
- multi-issuer/client mix-up;
- logout e revogação com sessões residuais;
- rotação de metadata/JWKS;
- troca de IdP com semânticas diferentes;
- recovery/reset alterando assurance;
- autenticação offline além do horizonte válido;
- correlação cross-tenant;
- IA promovendo claims externos a identidade/Role.

O revisit não encontrou nova família material após duplicate screening. Isso **não significa que os problemas são seguros**. Significa que eles já estavam cobertos pelos patterns e edge cases existentes.

### 17.2 Authorization

Foram desafiados:

- conflito entre allow local e restrição superior;
- caches stale após grant/revoke;
- mudança de authorization model sem mudança das relações;
- external group claims promovidos a grants locais;
- contaminação de cache entre tenant/Station;
- break-glass expirando enquanto ação está em voo;
- self-dealing entre workflows separados;
- divergência de semântica entre policy engines;
- `PARTIAL/UNKNOWN` em revogação distribuída;
- policy graph explosion;
- IA compondo grants válidos em autoridade maior.

Novamente, nenhum novo pattern material sobreviveu ao duplicate screening no revisit. O resultado é evidência de cobertura crescente, não encerramento da campanha.

**EM PESQUISA:** no estado consultado para esta edição, a fase adversarial continua `ACTIVE / NOT_SATURATED`; apenas 1 dos 8 full passes mínimos foi concluído. Planning C continua bloqueado.

---

## 18. Um exemplo completo: aprovação de compra em duas Stations

Vamos reunir os conceitos.

### Situação

A empresa possui:

```text
Enterprise: Grupo Manutenção

Station A: Porto Alegre
Station B: Canoas

Role: Supervisor
Person: Fernanda
```

Fernanda é Supervisor na Station A, mas apenas Técnica na Station B.

A política Enterprise determina:

- Supervisor pode aprovar até R$ 25 mil;
- acima disso exige dupla aprovação;
- break-glass não pode ser usado para autoaprovação;
- aprovação exige MFA recente.

### Passo 1 — login

Fernanda autentica pelo IdP.

O sistema qualifica:

```text
Canonical Person: Fernanda
Authentication: AUTHENTICATED
Assurance: MFA
Freshness: dentro do horizonte
```

Isso ainda não autoriza a compra.

### Passo 2 — seleção da Station

Fernanda opera na Station A.

A identidade continua Fernanda. O que muda é o contexto de autoridade.

```text
Person = Fernanda
Station = A
Role relation = Supervisor
```

### Passo 3 — compra de R$ 10 mil

A autorização avalia:

```text
principal = Fernanda
action = approve_purchase
resource = pedido-123
Station = A
Role = Supervisor
amount = 10.000
policy revisions = atuais
MFA = atual
```

Resultado: `ALLOW`.

### Passo 4 — mudança para Station B

Fernanda abre outro pedido na Station B.

A identidade é a mesma.

Mas o contexto agora é:

```text
Station = B
Role = Técnica
```

O cache de autorização da Station A não pode ser reutilizado como se fosse universal.

Resultado esperado para aprovação: `DENY`.

### Passo 5 — delegação temporária

O gestor da Station B delega a Fernanda autoridade de aprovação até R$ 5 mil por quatro horas.

A autorização passa a depender também do delegation envelope.

### Passo 6 — expiração durante workflow

Fernanda inicia uma aprovação às 16h58. A delegação expira às 17h. O workflow aguarda um dado externo e retorna às 17h03.

A autorização histórica das 16h58 explica por que a etapa começou. Ela não prova automaticamente que o efeito final ainda pode ocorrer.

A policy pode exigir uma nova avaliação no effect boundary.

### Passo 7 — provider indisponível

O policy engine externo está indisponível.

Se as evidências necessárias não puderem ser qualificadas dentro da offline closure admitida, a operação pode tornar-se `INCONCLUSIVE`.

O sistema não deve transformar indisponibilidade em autoridade extra.

Esse exemplo mostra por que identidade, autenticação, organização, workflow, provider e autorização precisam cooperar sem perder seus semantic owners.

---

## 19. Trade-offs reais

Uma arquitetura segura não é gratuita.

### 19.1 Mais currentness pode aumentar latência

Consultar sempre a autoridade mais atual pode exigir acesso a stores, providers ou replicas mais consistentes.

Caches diminuem latência, mas criam stale windows.

O desenho precisa qualificar onde freshness é crítica e onde cache bounded é aceitável.

### 19.2 Mais granularidade aumenta complexidade administrativa

Permissões excessivamente detalhadas podem gerar policy sprawl.

```text
10 usuários × 500 recursos × 30 ações
```

não significa que 150 mil grants individuais sejam uma boa modelagem.

Roles, relações, policy abstractions e delegation envelopes ajudam a controlar essa complexidade, mas também precisam de governança.

### 19.3 Fail-closed pode reduzir disponibilidade

Se qualquer dúvida sempre bloquear toda operação, uma falha de provider pode parar a empresa.

Por outro lado, fail-open em operações privilegiadas transforma indisponibilidade em escalada de privilégio.

A resposta pesquisada é **qualificação por escopo e risco**, não uma regra global única.

### 19.4 SoD pode reduzir velocidade operacional

Exigir duas pessoas torna uma operação mais lenta. Mas em ações financeiras ou de segurança, essa lentidão pode ser deliberadamente valiosa.

A arquitetura não deve otimizar apenas throughput; precisa preservar o objetivo empresarial do controle.

---

## 20. Como este capítulo se conecta aos próximos

Este capítulo estabelece um contexto que aparecerá repetidamente.

No Capítulo 08, veremos que autorização não substitui privacy. Um usuário pode possuir `ALLOW` técnico e ainda assim o uso dos dados estar proibido por finalidade, retenção ou obrigação legal.

No Capítulo 10, identidade e autoridade participarão da provenance de build e release.

No Capítulo 12, provider substitution precisará preservar semânticas de identidade e authorization, não apenas protocolos.

No Capítulo 13, veremos como grants, policies, sessions e mappings coexistem durante migrações.

No Capítulo 14, observabilidade fornecerá sinais sobre denies, stale policy e anomalias — mas `Signal != AuthorizationTruth`.

No Capítulo 15, PKI, trust e secrets fornecerão mecanismos para autenticação e service identity sem se tornarem donos da autorização.

No Capítulo 19, policy precedence, SoD, currentness e self-dealing aparecerão como famílias de conflitos processuais e semânticos.

No Capítulo 21, a regra de **AI non-amplification** será aprofundada.

---

## 21. Referências internas principais

Este capítulo sintetiza principalmente os seguintes artefatos autoritativos da Generation 2:

- `project_docs/generation-2/planning/PLANNING_A_IDENTITY_AUTHENTICATION_FEDERATION_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_IDENTITY_AUTHENTICATION_FEDERATION_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/planning/PLANNING_A_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/research/edge-cases/IDENTITY_AUTHENTICATION_FEDERATION_FULL_PASS_2_REVISIT.md`;
- `project_docs/generation-2/research/edge-cases/AUTHORIZATION_POLICY_ORGANIZATION_MULTITENANCY_FULL_PASS_2_REVISIT.md`;
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json` para o estágio atual da campanha.

Essas referências sustentam a explicação, mas permanecem superiores ao livro quando houver diferença de detalhe ou evolução posterior.

---

## O que você deve guardar deste capítulo

Identidade, autenticação e autorização são problemas diferentes. **Saber quem alguém é não concede poder.** A identidade canônica também não deve ser confundida com e-mail, username, Role, Station ou identificador de provider.

A cadeia `Enterprise → Station → Role → Person` modela delegação governada e não amplificante: níveis inferiores especializam autoridade dentro do envelope recebido. Least privilege limita o blast radius; delegação e break-glass devem ser explícitos, scoped, temporais e auditáveis; SoD impede que responsabilidades incompatíveis se concentrem silenciosamente na mesma pessoa.

Autorização precisa ser interpretada com contexto e currentness. Um `ALLOW` antigo, um grupo externo, uma sessão válida, uma ação visível na UI ou uma credencial possuída por uma automação não são provas universais de autoridade atual. Quando a evidência necessária não pode ser qualificada, `INCONCLUSIVE` deve permanecer diferente de `ALLOW`.

E, acima de tudo, **IA, AGWS, providers, caches, offline mode e workflows podem transportar ou consumir autoridade; não podem inventá-la.**