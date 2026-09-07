# Apêndice J — C3.23: contratos interoperáveis sem terceirizar o significado

Status editorial: **SÍNTESE DIDÁTICA DE DECISÃO AUTORITATIVA**  
Data: 2026-09-07  
Escopo: camada de compreensão; este apêndice não substitui Planning C nem decide arquitetura.

## 1. O problema humano: duas máquinas podem conversar e ainda assim não se entender

Imagine que o System Builder envia a um sistema de estoque a ordem de reservar dez unidades de uma peça. A requisição está em JSON válido, o endpoint existe, o servidor responde HTTP 200 e os dois lados usam exatamente a mesma versão publicada da API. Ainda assim, a operação pode estar errada.

O fornecedor pode interpretar `quantidade = 10` como dez caixas, enquanto o processo empresarial queria dez unidades. Pode aceitar a requisição e processá-la depois. Pode devolver sucesso porque recebeu a mensagem, não porque a reserva ocorreu. Pode ter atualizado apenas parte de um lote. Pode existir um cliente antigo que continua usando uma semântica anterior mesmo depois da publicação da versão nova.

Esse é o problema que C3.23 torna explícito: **interoperabilidade não é apenas conseguir trocar bytes; é conseguir preservar significado, comportamento, limites e evidência suficientes durante a troca**.

`DECIDIDO`: Planning C C3.23 estabelece um **Standards / Interoperability / API Contract Plane** revision-qualified. Ele possui identidade e revisão de contratos, perfis, realizações de protocolo/schema, conformance em camadas, compatibilidade direcional, negociação, semântica de operações, evidência/currentness e evolução/coexistência. Ele não recebe, por isso, ownership sobre o significado empresarial transportado.

## 2. Contrato não é o domínio

Um contrato de interoperabilidade descreve como duas partes podem se comunicar de forma qualificada. O domínio continua pertencendo ao seu **semantic owner**.

```text
significado empresarial
        ↓
contrato de interoperabilidade
        ↓
realização de protocolo/schema
        ↓
provider / transporte / SDK
```

Essas camadas se relacionam, mas não são equivalentes.

Um `operationId` de OpenAPI, uma URL, um tópico, um método de SDK ou um identificador protobuf pode ser estável e globalmente único sem se tornar a identidade canônica do conceito empresarial. O mesmo vale para um JSON Schema: ele pode provar que um documento possui determinada estrutura sem provar que seu conteúdo significa a coisa certa.

Por isso C3.23 preserva:

```text
schema valid != semantic correct
protocol conformance != business postcondition
same endpoint/feature name != semantic equivalence
external identifier != canonical semantic identity
```

A analogia com um formulário de papel ajuda: duas empresas podem usar formulários com campos de mesmo nome e formato, mas atribuir sentidos diferentes a “cliente ativo”. A analogia deixa de valer quando entramos em propriedades de sistemas distribuídos — retries, currentness, cohorts, efeitos ambíguos — que um formulário estático não representa.

## 3. Quatro perguntas diferentes sobre conformance

`DECIDIDO`: C3.23 rejeita a ideia de `conformant = true` como resposta suficiente. Conformance é vetorial.

Uma integração pode ser avaliada, pelo menos, em quatro dimensões centrais:

1. **Sintaxe (syntax):** os bytes, framing e encoding podem ser lidos?
2. **Estrutura (structure):** campos, tipos, cardinalidades e restrições obedecem ao contrato?
3. **Comportamento (behavior):** sequências, retries, erros e transições obedecem ao protocolo esperado?
4. **Semântica (semantics):** unidades, invariantes, populações de referência e significado dos efeitos são os esperados?

C3.23 ainda qualifica perfis de segurança/trust e obrigações operacionais quando forem materialmente parte do contrato.

Um resultado pode ser `CONFORMANT`, `PARTIAL`, `NON_CONFORMANT`, `INCONCLUSIVE` ou, quando justificável, `NOT_APPLICABLE`. Uma tela pode resumir isso, mas não pode transformar uma dimensão obrigatória `NON_CONFORMANT` em um verde global porque as outras passaram.

### Exemplo: temperatura

Dois sistemas aceitam:

```text
{ "temperature": 20 }
```

Sintaticamente e estruturalmente, tudo pode estar perfeito. Se um lado usa Celsius e outro Fahrenheit, a integração é semanticamente incompatível. Mais validação de JSON não corrige esse problema.

## 4. Compatibilidade tem direção

É comum dizer que “v1 e v2 são compatíveis”. C3.23 exige uma pergunta mais precisa: **quem produz qual revisão para quem consome qual revisão, em quais operações, sob quais extensões, restrições e evidências?**

`DECIDIDO`: compatibilidade é uma relação direcional e explicitamente avaliada.

```text
Compatible(produtor_r,
           consumidor_s,
           perfil,
           operações,
           extensões,
           restrições,
           evidência)
    -> vetor de compatibilidade
```

Logo:

```text
Compatible(A, B) não implica Compatible(B, A)
Compatible(A, B) + Compatible(B, C) não prova Compatible(A, C)
```

Isso impede que um grafo de integrações transforme caminhos parciais em equivalência semântica por transitividade acidental.

## 5. Uma versão não descreve todo o estado efetivo

Uma API pode anunciar “v3” enquanto um consumidor ainda executa cliente gerado para v2, usa schema em cache, adapter antigo ou rota de provider diferente. Por isso C3.23 aplica o `RevisionVector` da constituição C0.

O vetor pode qualificar, entre outros elementos, revisão do contrato, perfil, realização, produtor, consumidor, binding do provider, perfil de trust/security, extensão, ambiente e evidência de conformance.

```text
advertised version == expected version
        !=
effective contract == expected contract
```

`DECIDIDO`: currentness pode ser population-aware. Diferentes consumidores podem estar em revisões efetivas distintas. Portanto publicação, adoção e drainage são fatos separados.

```text
contract published
    != consumer adopted
    != consumer effective
    != residual cohort drained
```

## 6. Negociação escolhe entre significados já admissíveis

Negociação de conteúdo, versão ou capability é útil. Um consumidor pode aceitar JSON ou protobuf, v2 ou v3, compressão diferente ou subconjuntos opcionais. Mas negociar não cria semântica que não existe.

`DECIDIDO`: negociação seleciona uma realização/perfil já definido e compatível. Ela não pode enfraquecer invariantes superiores para obter uma resposta “suportada”.

Um downgrade para uma versão antiga só é válido se ela ainda satisfizer requisitos obrigatórios de semântica, autoridade, trust, segurança, privacidade, auditoria e recovery aplicáveis ao caso.

Assim:

```text
remote accepted downgrade != safe downgrade
```

Provider qualification também continua distinta. O plano de Provider/Binding decide se determinada realização pode ser admitida e ligada; o plano de contratos decide se a realização concreta é interoperável para o escopo solicitado.

## 7. HTTP 200 não significa que a empresa conseguiu o que queria

Esta é uma das separações mais importantes do apêndice.

Considere uma ordem de serviço que, ao ser concluída, deve solicitar faturamento a um provider externo. A API responde `202 Accepted`. Isso pode provar apenas que recebeu a solicitação.

C3.23 preserva a cadeia:

```text
intenção da requisição
    ↓
aceitação/rejeição pelo protocolo
    ↓
estado de processamento, se exposto
    ↓
EffectDisposition
    ↓
evidência de reconciliação
    ↓
validação pelo semantic owner do domínio
```

`EffectDisposition` continua distinguindo `APPLIED`, `NOT_APPLIED`, `PARTIAL` e `UNKNOWN`.

Um `200`, `202`, ACK de broker ou retorno bem-sucedido de SDK só pode ser interpretado como `APPLIED` quando o contrato qualificado atual disser que aquela resposta prova exatamente o efeito necessário.

```text
2xx/ACK != downstream effect
```

Isso protege o SB contra um erro clássico: transformar sucesso de transporte em sucesso empresarial.

## 8. Retry e idempotência pertencem ao contrato da operação

Idempotência não é uma propriedade mágica de HTTP, do SDK ou de uma chave aleatória.

`DECIDIDO`: ela é qualificada por operação, escopo de identidade, relação de equivalência, horizonte temporal e população/provider relevante.

O contrato pode definir namespace da chave, duração, campos que tornam duas requisições equivalentes, identidade do resultado, rota de leitura/reconciliação, classes de erro retryable e comportamento após troca de adapter/provider.

O princípio continua:

```text
UNKNOWN mutating effect
    -> reconcile-before-retry
```

salvo quando o contrato atual e a realização atual provarem duplicate safety para aquele escopo.

Isso conecta C3.23 diretamente aos capítulos de workflow, concorrência e providers.

## 9. Coleções: “recebi uma página vazia” não prova “não há dados”

Paginação parece detalhe de API até que uma decisão empresarial dependa de completude.

Uma consulta de estoque pode retornar uma página sem itens porque o cursor expirou, um provider truncou a busca, houve mudança concorrente na população ou a página recebida não era terminal. Por isso C3.23 exige semântica suficiente para distinguir vazio, parcial, truncado, stale e unknown.

Filtros também precisam de significado explícito: timezone, case sensitivity, unidade, operadores suportados e comportamento diante de predicados desconhecidos. Um adapter não pode simplesmente descartar um filtro que não entende e devolver “sucesso”.

Em batch, sucesso agregado não apaga membros `PARTIAL` ou `UNKNOWN`.

## 10. Eventos: envelope correto não prova entrega nem efeito

Um evento pode estar perfeitamente conforme ao schema e ainda ser duplicado, atrasado, fora de ordem ou nunca produzir o efeito esperado no consumidor.

`DECIDIDO`: contratos podem expressar envelope, tipo, source, correlation, chave de ordenação, sequence domain, replay/cursor e expectativas de backpressure. Porém a verdade de delivery continua com a capability de Messaging/Integration.

```text
source-local sequence != global order != causality
event envelope conformant != consumer effect complete
```

Esse limite evita que Standards/API Contracts absorva semantic ownership de tudo que passa por um protocolo.

## 11. Extensões de fornecedor sem lock-in semântico silencioso

Providers frequentemente acrescentam campos e comportamentos próprios. Proibir qualquer extensão levaria ao “lowest common denominator”; aceitar tudo como semântica canônica produziria lock-in.

C3.23 escolhe um meio governado: extensões são namespaced, revisionadas e classificadas quanto à portabilidade. Devem declarar comportamento diante de consumidores que não as conhecem e não podem redefinir silenciosamente o contrato base.

Um campo específico de provider continua específico de provider até que o semantic owner competente adote explicitamente o conceito como parte do modelo canônico.

`AI` pode sugerir essa generalização. Não pode promovê-la por autoridade própria.

## 12. Evidência de conformance envelhece

Passar em uma suíte de testes hoje não significa permanecer interoperável para sempre. Mudam contrato, provider, adapter, trust profile, configuração, consumidor, extensões e ambiente.

`DECIDIDO`: conformance é uma `QualifiedClaim` com lineage, aplicabilidade e condições de invalidação/expiração.

Isso muda a pergunta de:

> “este provider é compatível?”

para:

> “qual evidência sustenta esta compatibilidade, para quais revisões/populações/operações, e ela ainda é current?”

Essa mudança parece burocrática apenas até uma substituição de provider ou coexistência de revisões produzir comportamento divergente.

## 13. Por que isso importa para o System Builder

O SB pretende compor sistemas a partir de capabilities e providers substituíveis. Sem um plano de contratos como este, três erros aparecem rapidamente:

- o provider começa a definir a semântica do produto;
- validação estrutural é confundida com correção empresarial;
- versões e respostas de protocolo são usadas como atalhos para afirmar currentness ou efeito.

C3.23 cria a linguagem arquitetural para impedir esses colapsos sem exigir que toda integração use a mesma tecnologia.

O resultado é compatível com anti-lock-in qualificado: OpenAPI, JSON Schema, protobuf, eventos, SDKs e outros mecanismos podem ser realizações. Nenhum deles, sozinho, vira o significado canônico do negócio.

## 14. O que C3.23 não decidiu

É importante preservar os limites.

`DECIDIDO`: C3.23 decide a arquitetura alvo da capability Standards / Interoperability / API Contracts no escopo de Planning C.

Ele **não** significa:

- que Planning C está completo;
- que a topologia de packages ou serviços está definida;
- que os contratos já foram implementados;
- que um provider concreto foi aprovado;
- que toda compatibilidade futura está provada;
- que o livro virou fonte arquitetural;
- que Planning D/E, WBS ou Construction podem ser antecipados.

O estado autoritativo consultado nesta rodada registra C3 em 23/28 e aponta C3.24 — Lifecycle / Versioning / Evolution / Migration como próxima decisão.

## 15. Relações com os capítulos do livro

Este apêndice adiciona precisão futura principalmente a:

- **Capítulo 03:** provider/binding não podem inferir equivalência por nomes de features ou versões anunciadas;
- **Capítulo 06:** protocolo/ACK não substitui efeito de workflow ou integration;
- **Capítulo 12:** provider qualification e contract conformance são planos diferentes;
- **Capítulo 13:** publicação, adoção, coexistência e residual cohorts se conectam ao lifecycle;
- **Capítulo 18:** retry/idempotência dependem do contrato qualificado da operação;
- **Capítulo 22:** a cadeia ponta a ponta precisa preservar contrato, efeito e semantic owner como fatos distintos;
- **Capítulo 24:** o mapa mental deverá incorporar a diferença entre conformance estrutural e semântica quando houver revisão coordenada.

Nenhum desses capítulos é alterado automaticamente por este apêndice. Revisões devem permanecer bounded e versionadas.

## O que você deve guardar deste apêndice

Um contrato de API não é apenas um formato de mensagem. Para o System Builder, interoperabilidade segura exige saber **qual contrato**, **qual revisão**, **qual perfil**, **qual realização**, **quem produz**, **quem consome**, **quais operações**, **qual compatibilidade**, **qual evidência** e **se essa evidência ainda vale**.

As separações mais importantes são:

```text
schema valid != semantic correct
compatible parse != compatible meaning
2xx/ACK != business effect
published != adopted != effective != drained
provider support != contract conformance
UNKNOWN -> reconcile-before-retry
```

A ideia central é simples: **tecnologias podem transportar o significado; não devem adquiri-lo silenciosamente**.

## Fontes autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/planning/PLANNING_C_C3_23_STANDARDS_INTEROPERABILITY_API_CONTRACTS_TARGET.md`;
- decisões constitucionais C0/C1/C2 e decisões C3 anteriores herdadas por C3.23;
- Planning A/B e inventário adversarial referenciados pelo próprio artefato C3.23.
