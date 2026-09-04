# Capítulo 03 — Capability, Provider, Binding e Semantic Owner — v1.0.0

> **Identidade editorial:** `CHAPTER_03`  
> **Versão editorial:** `1.0.0`  
> **Status:** `PUBLISHED`  
> **Camada:** compreensão e síntese; não substitui pesquisa, synthesis, Planning A/B nem futura arquitetura alvo.

## 3.1 O problema começa quando uma necessidade empresarial encontra uma ferramenta

Imagine uma empresa que precisa enviar um aviso quando uma ordem de serviço é aprovada.

A necessidade empresarial parece simples: **avisar a pessoa certa, no momento certo, com rastreabilidade suficiente para saber o que aconteceu**.

É tentador traduzir isso imediatamente para uma ferramenta: “vamos usar e-mail”, “vamos usar WhatsApp”, “vamos usar o serviço X”. Mas essa tradução precoce mistura perguntas diferentes:

1. O que o sistema precisa ser capaz de fazer?
2. Quem define o significado correto dessa capacidade?
3. Qual mecanismo realizará o trabalho?
4. Em quais condições esse mecanismo é adequado?
5. O que acontece quando ele precisar ser substituído?

A Generation 2 separa essas perguntas porque sistemas empresariais vivem muito mais tempo do que integrações específicas.

**EVIDENCIADO NA SÍNTESE G2:** a taxonomia consolidada possui 28 capabilities canônicas, agrupadas por responsabilidades semânticas. Isso não significa 28 pacotes de código nem 28 telas. Significa que a pesquisa encontrou 28 áreas nas quais é importante saber quem possui determinado significado.

## 3.2 Capability: capacidade com responsabilidade semântica

Uma **capability** é uma capacidade coerente do sistema com responsabilidades próprias. Ela responde principalmente a uma pergunta do tipo:

> “Que problema precisa ser resolvido e quais verdades precisam continuar corretas enquanto o resolvemos?”

Por exemplo, `Storage / Documents / Media` não significa “usar S3”. Significa possuir as semânticas necessárias para objetos, documentos e mídias: identidade lógica, versões, integridade, persistência e evolução entre realizações.

`Workflow & Durable Execution` não significa “usar Temporal” ou qualquer engine específica. Significa possuir a semântica da execução durável: estado do processo, timers, retries, tarefas humanas, redrive e evolução de execuções em andamento.

Essa distinção parece filosófica até o primeiro fornecedor ser trocado. Se “documento” for definido como “objeto S3”, trocar de storage passa a significar redefinir o negócio. Se “workflow” for definido como “workflow ID da engine”, substituir a engine ameaça a identidade do processo.

A capability existe justamente para impedir essa inversão.

## 3.3 Semantic Owner: quem tem autoridade sobre o significado

O **semantic owner** — proprietário semântico — é a capability ou domínio responsável pelo significado canônico e pelas invariantes de uma informação ou decisão.

Considere uma OS:

```text
OS-1042
estado canônico: APROVADA
```

Uma tela pode mostrar `APROVADA`. Um índice de busca pode armazenar uma projeção dessa informação. Um sistema de mensagens pode enviar “OS aprovada”. Uma ferramenta de observabilidade pode registrar que a transição ocorreu.

Nenhum desses consumidores se torna automaticamente dono do estado da OS.

```text
                observa / projeta / transporta
                          |
                          v
Tela <------- [ Semantic Owner ] -------> Evento
                          |
                          v
                     Observabilidade
```

O owner define o que `APROVADA` significa, quais transições são válidas e quais postconditions precisam existir. Outros componentes podem consumir essa verdade, mas não devem reescrevê-la silenciosamente.

Esse princípio aparece repetidamente na G2 como **source-of-truth ownership**.

**HIPÓTESE DE ARQUITETURA ainda sujeita às fases posteriores:** a forma exata em código pela qual esses owners serão materializados ainda não está decidida. Planning A definiu fronteiras semânticas; Planning C continua bloqueado enquanto a campanha adversarial não saturar.

## 3.4 Provider: especialista em realizar mecânicas

Um **provider** é um sistema, serviço, engine ou mecanismo especializado capaz de realizar parte de uma capability.

Exemplos didáticos:

| Necessidade | Possível provider |
|---|---|
| persistir arquivos | storage local, object storage, serviço cloud |
| enviar e-mail | servidor SMTP, serviço transacional |
| executar workflow durável | engine própria ou engine especializada |
| autenticar usuários | identidade local ou IdP federado |
| executar modelo de IA | diferentes model providers |

A ideia não é evitar providers. Pelo contrário: providers maduros podem resolver problemas difíceis melhor do que reinventá-los no System Builder.

A diretriz é:

> **possuir a semântica; delegar a mecânica madura.**

Isso é parte central do anti-lock-in da G2. Anti-lock-in não significa que todos os providers sejam equivalentes. Significa que a semântica empresarial não deve ser entregue gratuitamente ao fornecedor.

### Onde a analogia do terceirizado ajuda — e onde falha

Podemos comparar um provider a uma empresa terceirizada de transporte. A organização define que uma peça precisa chegar ao destino sob determinadas condições; a transportadora realiza a logística.

A analogia ajuda a separar necessidade de realização. Mas ela deixa de valer tecnicamente porque software introduz identidade digital, consistência, retries, callbacks, caches, versões, estados parcialmente aplicados e efeitos cujo resultado pode ficar desconhecido. Por isso a relação com um provider precisa ser muito mais qualificada do que um simples “contrato com fornecedor”.

## 3.5 Provider não é Semantic Owner

Esta é uma das fronteiras constitucionais mais importantes da pesquisa:

```text
Capability / Semantic Owner
          |
          | define requisitos e significado
          v
      Binding
          |
          | seleciona uma realização qualificada
          v
      Provider
```

Um storage provider pode informar que gravou um objeto. Ele não decide sozinho se o documento empresarial está semanticamente válido.

Um IdP pode autenticar uma pessoa. Ele não decide sozinho se essa pessoa pode aprovar uma compra.

Uma engine de workflow pode registrar que uma atividade terminou. Ela não decide sozinha se a postcondition empresarial foi satisfeita.

Um serviço de IA pode produzir uma resposta. Ele não ganha autoridade para transformar essa resposta em decisão empresarial canônica.

**DECIDIDO no nível de fronteira de Planning A:** Provider/Binding possui a relação de realização, qualificação, admissão, binding e reconciliação do provider; o domínio continua dono do sucesso semântico.

## 3.6 Binding: não é apenas uma connection string

Se capability é “o que significa” e provider é “quem pode realizar”, precisamos representar a relação entre ambos.

Essa relação é o **binding**.

Em linguagem simples, um binding diz:

> “Para este escopo, sob estes requisitos, nesta revisão e enquanto estas condições forem válidas, esta realização está qualificada para atender esta necessidade.”

Isso é muito mais rico que:

```text
STORAGE_URL=https://...
```

A URL pode ser um parâmetro de realização. O binding precisa preservar contexto suficiente para explicar **qual provider**, **qual revisão**, **qual escopo**, **qual qualificação**, **quais restrições** e **qual estado de lifecycle** tornam aquela realização utilizável.

Planning A descreve o binding como relação canônica revisionada entre capability consumidora e provider. A revisão do binding é diferente da revisão do objeto de negócio e também pode ser diferente da revisão do recurso no provider.

### Exemplo: documentos de uma Station

Imagine que a Enterprise permita dois storages, mas uma Station específica esteja autorizada a usar apenas um deles por requisito de residência de dados.

```text
Enterprise
  |-- Provider A: admitido para BR
  |-- Provider B: admitido para outro perfil

Station Canoas
  `-- Binding documentos -> Provider A
```

A existência do Provider B no catálogo não o torna automaticamente utilizável pela Station. Descoberta, capacidade técnica e autoridade são coisas diferentes.

## 3.7 A escada que evita o “está disponível, então pode usar”

A pesquisa separa estados que sistemas simples frequentemente comprimem em um booleano:

```text
discovered
   -> advertised
      -> qualified
         -> admitted
            -> bound
               -> effective
```

**Discovered**: sabemos que o provider existe.

**Advertised**: ele declara certas capacidades.

**Qualified**: evidências indicam que satisfaz os requisitos relevantes.

**Admitted**: além de tecnicamente adequado, seu uso é permitido pelas políticas aplicáveis.

**Bound**: existe uma relação explícita e revisionada ligando-o ao escopo consumidor.

**Effective**: a realização está de fato produzindo o efeito aplicável esperado.

Esses estados não são sinônimos.

Um provider pode anunciar armazenamento e não cumprir a consistência necessária. Pode ser tecnicamente qualificado, mas proibido por residência de dados. Pode estar admitido, porém ainda não ter sido ligado à Station. Pode estar bound, mas temporariamente indisponível.

Essa separação é um exemplo da diretriz **mature-system semantics with simple-system ergonomics**: a interface pode ser simples para o usuário, mas o modelo não deve mentir sobre diferenças importantes.

## 3.8 Por que `supported=true` é perigoso

Suponha dois providers de mensageria:

```text
Provider A: supported = true
Provider B: supported = true
```

Parece que são intercambiáveis. Mas “suporta mensagens” não responde:

- preserva ordering?
- qual é o modelo de redelivery?
- existe deduplicação e qual seu horizonte?
- funciona offline?
- quais limites de tamanho e throughput?
- há garantias de residência?
- que evidência existe para confirmar entrega?
- como se comporta em falha parcial?

Por isso a G2 trabalha com **capability/support vector**: um vetor multidimensional de requisitos e suporte.

```text
RequirementVector
  semantics: ...
  ordering: ...
  failure_behavior: ...
  locality: ...
  offline: ...
  lifecycle: ...
  evidence: ...

             compara com

SupportVector(provider, revision, scope)
```

O resultado pode ser `SUPPORTED`, `PARTIAL`, `UNSUPPORTED` ou `INCONCLUSIVE`.

`INCONCLUSIVE` é particularmente importante: significa que não existe evidência suficiente para afirmar equivalência. Isso é mais seguro do que transformar desconhecimento em `true`.

## 3.9 O provider pode dizer a verdade e ainda assim o sistema concluir algo errado

Considere uma chamada remota:

```text
SB -> provider: criar recurso
provider -> SB: 202 Accepted
```

O `202` pode estar perfeitamente correto. Ainda assim, ele não prova necessariamente que o recurso empresarial já está efetivo, convergido e validado.

A G2 preserva uma linhagem conceitual:

```text
requested
 -> authorized
 -> attempted
 -> provider-accepted
 -> applied/effective
 -> converged
 -> validated
```

Cada etapa responde a uma pergunta diferente.

Essa distinção reaparecerá nos capítulos sobre workflow, deployment, observabilidade e concorrência. Ela também explica por que um timeout remoto pode produzir `UNKNOWN`: talvez o provider tenha aplicado a mutação e apenas a resposta tenha se perdido.

Nesse caso, repetir imediatamente pode duplicar o efeito. Daí o princípio `UNKNOWN -> reconcile-before-retry`.

## 3.10 Substituir provider é um processo, não trocar uma variável

Um dos objetivos do System Builder é evitar lock-in desnecessário. Mas trocar provider com segurança raramente equivale a alterar uma configuração.

Planning A descreve uma sequência conceitual parecida com:

```text
descobrir candidato
 -> qualificar
 -> admitir
 -> preparar binding
 -> coexistir, se necessário
 -> validar novo caminho
 -> cortar autoridade/tráfego/efeitos
 -> reconciliar estado
 -> drenar cohorts residuais
 -> retirar binding antigo
```

Um **residual cohort** é qualquer população antiga que ainda pode produzir efeitos autoritativos: sessões, workers, caches, filas, callbacks, credenciais, replicas, clientes antigos, jobs agendados etc.

Imagine migrar o serviço de e-mail. O novo provider já recebe todos os envios novos, mas o antigo ainda possui uma fila com 800 mensagens pendentes. Declarar a migração concluída apenas porque a configuração aponta para o novo provider pode causar duplicidade, mensagens fora de ordem ou efeitos tardios.

Anti-lock-in, portanto, não é somente “ter interface”. É conseguir explicar identidade, estado, compatibilidade, efeitos e cohorts durante a substituição.

## 3.11 Universal Capability Architecture: compartilhar estrutura sem roubar significado

Várias capabilities precisam das mesmas formas estruturais: identidade, revisão, evidência, currentness, efeito `UNKNOWN`, autoridade não amplificante e binding lifecycle.

Duplicar essas estruturas em cada domínio produziria inconsistência. A G2 por isso mantém a **Universal Capability Architecture (UCA)** como owner de pequenos contratos reutilizáveis.

Mas existe um perigo: transformar “universal” em “dono de tudo”.

Planning A é explícito: UCA deve ser o **menor vocabulário estrutural compartilhado**, nunca um *semantic god-object*.

Ela pode definir a forma de uma evidência qualificada. Não decide se uma OS está aprovada.

Pode definir a estrutura de um revision vector. Não decide se duas versões de schema são compatíveis.

Pode definir a forma de uma claim `ALLOW`. Não decide quem tem permissão.

Pode definir a estrutura de um support vector. Não decide se ordering de uma fila é suficiente para determinado processo.

```text
             UCA
     estruturas reutilizáveis
       /      |       \
      /       |        \
 Workflow  Storage  Authorization
    |          |          |
 significado significado significado
   próprio     próprio     próprio
```

O critério útil é:

> Se a estrutura pode ser reutilizada sem que a UCA precise decidir o predicado de negócio, ela pode ser universal. Se precisa entender o significado específico para decidir, o semantic owner continua sendo o domínio.

## 3.12 O que o System Builder já evidencia hoje — e o que ainda não evidencia

É importante separar visão pesquisada de implementação atual.

**EVIDENCIADO NO SB ATUAL:** Planning B encontrou no AI Gateway uma seam provider-neutral versionada, um `ModelProviderAdapter` substituível, descriptors de capabilities/limits, normalização fail-closed, correlação request/response, políticas explícitas de fallback e testes de substituição entre dois adapters preservando a semântica canônica testada.

Isso é uma evidência concreta de que a ideia de provider-neutrality não é apenas teórica.

Mas Planning B também registra uma lista extensa de lacunas.

**ABERTO / NÃO EVIDENCIADO COMO CAPACIDADE GENERALIZADA NO SB ATUAL:** não há prova de um lifecycle universal completo de discovery/qualification/admission/binding, support vectors multidimensionais generalizados, binding identity/revision/scope para todas as capabilities, effect dispositions generalizadas, residual-cohort drainage ou substituição segura de providers arbitrários.

A conclusão correta não é “o SB já possui Provider/Binding completo” nem “não existe nada”. A conclusão é mais precisa:

> existe uma seam real e testada no caminho de IA; a generalização arquitetural pesquisada ainda é trabalho posterior.

## 3.13 Um exemplo integrado: envio de aviso de OS

Voltemos ao exemplo inicial.

A empresa quer enviar aviso quando uma OS crítica é aprovada.

### Sem separação

```text
if os.aprovada:
    fornecedorX.send(...)
```

O código mistura evento empresarial, autorização, provider, credenciais, semântica de entrega e política de fallback.

### Como modelo conceitual G2

```text
OS aprovada
   |
   | semantic owner do processo confirma a transição
   v
necessidade: emitir notificação qualificada
   |
   | Notification/Messaging define semântica necessária
   v
requirement vector
   |
   v
binding atual e admitido
   |
   v
provider realiza tentativa
   |
   v
receipt / evidence / effect disposition
   |
   v
owner qualifica o resultado relevante
```

Se o provider mudar, a OS continua sendo a mesma OS. A semântica da notificação continua pertencendo ao mesmo owner. O binding e a identidade de realização podem mudar.

Essa é a diferença entre **substituir a mecânica** e **redefinir o negócio**.

## 3.14 Trade-offs: por que não fazer tudo isso em qualquer sistema pequeno?

Toda separação possui custo. Descriptors, bindings, support vectors, evidência e lifecycle podem adicionar conceitos, dados e validações.

Um sistema pequeno com um único banco e um único SMTP pode não precisar expor toda essa complexidade operacional ao usuário.

Mas “não expor” é diferente de “não possuir a distinção”.

O objetivo G2 é permitir que uma instalação simples colapse a topologia sem colapsar as identidades semânticas. Um provider local pode ser o único candidato e o binding pode ser trivial, mas o documento não precisa se tornar “o arquivo daquele provider”.

Essa abordagem permite crescer sem reescrever o significado do sistema a cada mudança de infraestrutura.

O trade-off real é entre:

- simplicidade imediata obtida apagando diferenças; e
- simplicidade de uso construída sobre diferenças preservadas corretamente.

A pesquisa G2 prefere a segunda.

## 3.15 Relação com os próximos capítulos

Este capítulo fornece quatro peças que reaparecerão em todo o livro:

- **Capability**: quem possui uma responsabilidade coerente.
- **Semantic Owner**: quem decide o significado canônico e as invariantes.
- **Provider**: quem realiza mecânicas especializadas.
- **Binding**: a relação qualificada e revisionada entre necessidade e realização.

No Capítulo 4, veremos como essas capabilities podem ser compostas para gerar runtimes pequenos sem carregar o Builder inteiro.

Nos capítulos 6, 8, 11 e 12, veremos como workflow, storage, deployment e integrações pressionam a fronteira provider/owner de maneiras diferentes.

No Capítulo 18, `UNKNOWN` e reconcile-before-retry serão aprofundados. No Capítulo 19, veremos uma consequência mais sutil: duas partes podem estar localmente corretas e ainda formar uma composição semanticamente inválida.

## Referências internas autoritativas consultadas

Este capítulo sintetiza principalmente:

- `synthesis/CAPABILITY_SYNTHESIS.md`;
- `planning/PLANNING_A_UNIVERSAL_CAPABILITY_ARCHITECTURE_BOUNDARIES.md`;
- `planning/PLANNING_A_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_BOUNDARIES.md`;
- `planning/PLANNING_B_PROVIDER_BINDING_CAPABILITY_NEGOTIATION_SB_CURRENT_STATE.md`;
- `RESEARCH_PIPELINE_STATE.json` para o estágio atual da campanha.

Esses artefatos permanecem superiores ao livro em caso de divergência.

## O que você deve guardar deste capítulo

1. **Capability não é provider.** Capability expressa responsabilidade e semântica; provider realiza mecânicas.
2. **Semantic owner é quem possui o significado canônico.** Consumir, observar ou transportar uma verdade não transfere sua propriedade.
3. **Binding é uma relação qualificada, revisionada e scoped**, não apenas uma connection string.
4. **Descoberto, anunciado, qualificado, admitido, bound e efetivo são estados diferentes.**
5. **`supported=true` é insuficiente** quando consistência, falha, autoridade, locality, lifecycle ou evidência importam.
6. **Provider acknowledgement não é sucesso empresarial universal.** Requested, attempted, accepted, applied, converged e validated precisam permanecer distinguíveis.
7. **Anti-lock-in não é evitar fornecedores.** É preservar identidade e significado canônicos enquanto mecânicas podem ser substituídas.
8. **UCA compartilha estrutura, não significado.** Ela deve impedir duplicação de primitives sem se tornar o dono universal do sistema.
9. **O SB atual já possui uma seam provider-neutral real no AI Gateway**, mas isso não prova que o lifecycle generalizado pesquisado já esteja implementado.
10. A promessa mais importante pode ser resumida assim: **own semantics, delegate mature mechanics to qualified providers**.
