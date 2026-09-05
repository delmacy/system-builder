# Capítulo 08 — Dados, schema, documentos, storage, privacidade e retenção — v1.0.0

**ID editorial:** `CHAPTER_08`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não substitui pesquisa, Planning A/B ou decisões futuras de arquitetura.  
**Estado da pesquisa ao escrever:** `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`, ainda `ACTIVE / NOT_SATURATED`; Planning C permanece bloqueado.

## O problema humano: “é o mesmo dado” quase nunca significa a mesma coisa

Imagine uma ordem de serviço de manutenção. Ela registra que o equipamento `RADAR-17` apresentou uma falha, que o técnico João realizou uma intervenção às 14h32, que uma peça foi substituída e que o laudo final foi anexado em PDF.

Para uma pessoa olhando a tela, tudo isso pode parecer simplesmente “os dados da OS”. Tecnicamente, porém, há vários tipos de coisa convivendo ali:

- o **fato empresarial** de que uma intervenção ocorreu;
- o **schema** que define quais campos uma OS possui e o que cada campo significa estruturalmente;
- os **valores armazenados** em linhas, documentos estruturados ou outros suportes;
- os **bytes** do PDF e talvez das fotografias anexadas;
- os **metadados** que descrevem esses arquivos;
- a **permissão** de uma pessoa para visualizar ou alterar a OS;
- a **finalidade legítima** para a qual determinados dados podem ser usados;
- a obrigação de **reter**, **preservar**, **restringir**, **mover** ou eventualmente **eliminar** certas informações;
- as cópias que ainda podem existir em backups, caches, índices, exports, réplicas ou sistemas externos.

Misturar essas camadas parece inofensivo enquanto tudo funciona no caminho feliz. Os problemas aparecem na mudança: troca de banco, migração de schema, restauração de backup, exclusão solicitada, alteração de política, novo provider, arquivo corrompido, réplica atrasada, cliente offline ou automação tentando “corrigir” o estado.

A Generation 2 pesquisa justamente a separação desses significados para que o System Builder não confunda mecanismo com verdade.

Uma fórmula didática útil para este capítulo é:

```text
Fato empresarial
    != schema que o representa
    != representação física
    != documento que o expressa
    != autorização para agir
    != finalidade legítima de uso
    != elegibilidade para disposição
    != prova de disposição física
```

Essa desigualdade parece trabalhosa, mas é o que permite que um sistema continue correto quando suas partes evoluem independentemente.

---

## 1. Primeiro: o que chamamos de “dado”?

A palavra **dado** é perigosamente ampla. Ela pode significar desde um valor simples — `quantidade = 3` — até um fato empresarial complexo — “três unidades desta peça foram consumidas por esta OS, por este técnico, neste momento, sob esta autorização”.

No System Builder, o ponto mais importante não é escolher uma definição filosófica única de dado. É preservar **quem possui o significado**.

> **DECIDIDO na taxonomia de Planning A:** Process & Application Modeling possui a semântica canônica do negócio/processo; Data / Schema / Migrations possui a forma estrutural persistente e sua evolução. O fato de um campo estar em uma tabela não transfere ao banco de dados a propriedade semântica daquele fato.

Exemplo:

```text
Processo empresarial:
  uma OS precisa registrar a peça efetivamente instalada

Data / Schema:
  campo installed_part_id referencia uma peça

Provider físico:
  PostgreSQL materializa isso como coluna + índice + foreign key
```

A coluna não “decide” o que significa peça instalada. Ela realiza estruturalmente uma obrigação que veio de um owner superior da semântica empresarial.

Essa distinção também protege o anti-lock-in. Se amanhã o PostgreSQL for substituído por outro mecanismo, o identificador físico da coluna pode mudar; a identidade e o significado canônicos não deveriam mudar apenas por causa disso.

---

## 2. Schema: a gramática estrutural dos dados

**Schema** é, em termos simples, a declaração estrutural de quais entidades, campos, relações, tipos e constraints uma representação de dados possui.

Uma analogia é a ficha de cadastro em papel. O schema seria o modelo da ficha: “nome”, “matrícula”, “setor”, “data de ingresso”. O preenchimento de uma ficha concreta é o estado dos dados.

A analogia deixa de valer quando sistemas passam a ter relações, revisões simultâneas, constraints, transformações automáticas e consumidores antigos. Nessa situação, schema não é apenas “o formulário vazio”; ele participa de contratos entre produtores e consumidores.

### 2.1 Declaração não é materialização

A pesquisa G2 preserva uma separação essencial:

```text
schema declarado
    != estrutura materializada pelo provider
    != população de dados migrada
    != consumidores efetivamente compatíveis
```

Você pode declarar que o novo campo `priority` existe. A migration pode criar a coluna. Ainda assim:

- registros antigos podem não ter valor semanticamente válido;
- um backfill pode estar incompleto;
- uma versão antiga do runtime pode ignorar o campo;
- uma aplicação externa pode sobrescrever registros sem preservar a nova informação;
- uma réplica pode estar atrasada;
- a nova semântica pode depender de uma política que ainda não convergiu.

Por isso, **“DDL executou com sucesso” não significa “evolução de dados concluída”**.

### 2.2 Compatibilidade tem direção

Dizer apenas `compatible=true` é pobre demais.

Um leitor antigo pode conseguir ler dados novos e, ainda assim, um escritor antigo destruir informação nova ao salvar de volta o registro. Da mesma forma, um leitor novo pode depender de informação que registros antigos ainda não possuem.

Considere três revisões:

```text
V1 <-> V2 <-> V3
```

Mesmo que V1/V2 e V2/V3 sejam localmente compatíveis, isso não prova que V1/V3 são conjuntamente seguros para leitura **e escrita**.

O Full Pass 2 de Data / Schema / Migrations encontrou exatamente essa família: **compatibilidade par a par não implica coexistência global lossless** quando múltiplos cohorts continuam ativos. Esse resultado foi catalogado como `G2-CONFLICT-PATTERN-SCHEMA-LOSSLESSNESS-001`.

> **EM PESQUISA:** a arquitetura alvo ainda não está decidida. O livro registra a obrigação conceitual: coexistência precisa considerar vetor de revisões, direção de uso e preservação do significado necessário, não apenas compatibilidade adjacente.

---

## 3. Migração: mudar representação sem inventar verdade

Uma **migração** transforma estrutura, dados ou ambos para uma nova representação.

Ela pode parecer uma operação técnica:

```sql
ALTER TABLE work_order ADD COLUMN priority TEXT;
```

Mas uma migração real pode carregar decisão semântica.

Suponha que registros antigos não possuam `priority`. Uma migration decide preencher todos com `NORMAL`.

Há duas possibilidades muito diferentes:

1. o domínio definiu explicitamente que ausência histórica é semanticamente equivalente a `NORMAL`;
2. alguém escolheu `NORMAL` apenas porque precisava preencher a coluna.

No primeiro caso, o backfill pode ser semanticamente autorizado. No segundo, a migration transformou “não sabemos” em “sabemos que era normal”.

Isso é uma alteração epistemológica da história.

A campanha adversarial identificou essa família como `G2-CONFLICT-PATTERN-DEFAULT-MATERIALIZATION-001`: um default localmente válido como ajuda de UI/schema pode ser promovido indevidamente a fato canônico.

A regra didática é:

```text
Default de interpretação != fato observado
```

E, de forma mais geral:

```text
StoredFact != DerivedValue != PresentationDefault
```

O capítulo 09 aprofundará a diferença entre fatos armazenados e valores derivados. Aqui basta guardar que **uma migration não recebe autoridade para criar significado empresarial só porque consegue escrever no banco**.

---

## 4. O que o SB atual já evidencia em Data / Schema / Migrations

É importante separar a direção pesquisada daquilo que já existe.

> **EVIDENCIADO NO SB ATUAL:** `SystemDefinition` já declara entidades e campos de forma lógica; há metadata de migrations provider-neutral no runtime; o deploy faz preflight determinístico de migrations e verifica paths, ordem e hashes; migrations PostgreSQL são aplicadas antes da ativação do runtime e registradas em ledger por capability + migration identity + content hash.

Isso é uma base concreta e útil.

O ledger, por exemplo, impede que uma migration com a mesma identidade lógica reapareça silenciosamente com outro conteúdo. É uma forma de proteção contra drift.

Mas Planning B também é explícito sobre o que **não** está evidenciado hoje como modelo completo:

- revisões independentes de schema e estado de dados;
- compatibilidade direcional;
- cohorts/populações afetadas;
- backfill e dual-read/dual-write;
- CDC-assisted coexistence;
- cutover qualificado;
- consumidores antigos residuais;
- brownfield `discover → normalize → explicit adopt`;
- convergência consumer-effective;
- rollback de dados evidence-qualified.

Portanto:

```text
migration ledger APPLIED
    != G2 semantic convergence
```

O primeiro é um fato técnico real do SB atual. O segundo é uma obrigação mais ampla ainda em pesquisa.

---

## 5. Documento não é sinônimo de linha no banco

Agora considere o laudo PDF anexado à OS.

O documento tem pelo menos duas identidades possíveis:

```text
identidade canônica do documento
identidade dos bytes de uma revisão do documento
```

Um hash pode dizer que dois conjuntos de bytes são idênticos. Isso não significa que eles sejam o mesmo documento empresarial.

Exemplo:

- dois contratos diferentes podem, por acaso, ter exatamente o mesmo conteúdo inicial;
- o mesmo documento pode receber uma nova revisão de bytes;
- metadados podem mudar sem os bytes mudarem;
- uma miniatura ou versão comprimida deriva do original, mas não se torna o original.

Por isso, Storage / Documents / Media separa:

```text
canonical object/document identity
content revision
metadata revision
provider realization identity
copy/replica identity
```

Um provider pode chamar um objeto de `bucket-x/abc123.pdf`. Esse caminho é uma **identidade de realização**, não automaticamente a identidade canônica do documento.

Essa separação é o equivalente, no mundo dos arquivos, à distinção feita anteriormente entre entidade canônica e tabela/coluna físicas.

---

## 6. Storage: guardar bytes é mais difícil do que parece

**Storage** é a capacidade de persistir e recuperar conteúdo. Em sistemas reais, porém, “upload concluído” não é uma verdade binária simples.

Uma cadeia mais precisa pode ser:

```text
transfer attempted
    -> provider accepted
    -> bytes persisted
    -> integrity verified
    -> metadata converged
    -> required replicas converged
    -> consumer-effective retrieval qualified
```

Esses checkpoints não são equivalentes.

### 6.1 Exemplo: foto de inspeção

Um técnico envia uma foto de 40 MB usando uma conexão instável. O provider recebeu os primeiros chunks e retornou erro na última etapa.

O sistema pode estar em vários estados:

- nada foi persistido;
- fragmentos existem;
- o arquivo inteiro existe mas a resposta se perdeu;
- os bytes existem mas não foram verificados;
- o arquivo está íntegro mas seus metadados não convergiram;
- a cópia principal existe, mas a réplica obrigatória ainda não.

Por isso, `UNKNOWN` e `PARTIAL` não são preciosismo. Eles descrevem situações nas quais repetir cegamente pode criar cópias duplicadas, versões concorrentes ou efeitos destrutivos.

### 6.2 Integridade não é identidade de negócio

Checksums e hashes são muito úteis para provar integridade de conteúdo. Mas:

```text
content hash != canonical document identity
```

O mesmo documento pode evoluir. Os mesmos bytes podem aparecer em objetos distintos. Um ETag de provider pode sequer significar hash universal de conteúdo.

A pesquisa G2, portanto, tenta preservar integridade sem transformar um detalhe de provider na definição do documento.

---

## 7. O que o SB atual já evidencia em Storage / Documents / Media

Planning B encontrou um predecessor real e interessante: o `ArtifactStore`.

> **EVIDENCIADO NO SB ATUAL:** existem interfaces provider-neutral para ler/escrever payloads de artefato de release, identidade por `artifactHash`, snapshots imutáveis e verificações determinísticas de hash por arquivo e hash agregado. Publicação conflitante sob o mesmo hash é rejeitada.

Isso demonstra primitives importantes:

- hashing determinístico;
- snapshots verificáveis;
- separação por interfaces de repository;
- falhas explícitas de missing/conflict/integrity;
- referência lógica para conteúdo verificado.

Mas o subject atual é **artefato de release**, não documento empresarial genérico.

O único repository concreto evidenciado nessa reconciliação é in-memory. Logo, não há base para dizer que o SB atual já possui um subsistema geral de documentos, mídia, multipart upload, streaming/ranges, lifecycle, replicas, tiering, legal hold ou provider migration.

> **ABERTO/INCONCLUSIVO para arquitetura alvo:** quais dessas primitives de integridade serão generalizadas e quais permanecerão estritamente no domínio Artifact/Release só pode ser decidido em planning posterior autorizado.

---

## 8. Privacidade e Data Governance: poder acessar não significa poder usar

Chegamos a uma das separações mais importantes do livro.

No Capítulo 07 vimos **Authorization**. Ela responde algo como:

> “Este principal pode executar esta ação sobre este recurso neste escopo?”

Privacidade/Data Governance faz perguntas diferentes:

> “Para qual finalidade este dado pode ser processado?”  
> “Existe obrigação de preservá-lo?”  
> “É elegível para eliminação?”  
> “Pode ser transferido para este local/jurisdição?”  
> “Quais populações ainda estão sujeitas à obrigação?”

Logo:

```text
Authorization ALLOW != Privacy/Data-Governance eligibility
```

Um administrador pode tecnicamente ter permissão para clicar em **Excluir** e, mesmo assim, existir um legal hold que exige preservação.

Outro exemplo: uma pessoa pode estar autorizada a consultar uma ficha funcional para executar uma tarefa de RH. Isso não significa que aqueles dados possam ser reutilizados para qualquer finalidade apenas porque a pessoa consegue lê-los.

A separação é entre **autoridade de ação** e **legitimidade/obrigação sobre o uso e ciclo de vida do dado**.

---

## 9. Retention, disposition e legal hold

**Retention** é a obrigação ou política de manter determinada informação por um período ou condição.

**Disposition** é o processo governado pelo qual uma população de dados alcança um estado final permitido — por exemplo, destruição, anonimização, arquivamento ou outra destinação qualificada, conforme o owner aplicável.

**Legal hold** é uma obrigação de preservação que pode bloquear uma disposição que, em outras condições, seria elegível.

Isso produz outra desigualdade importante:

```text
Retention expired != Delete allowed
```

Por quê? Porque podem existir outros blockers:

- legal hold;
- investigação;
- outra obrigação de preservação;
- dependência processual;
- jurisdiction/residency constraint;
- evidência desatualizada;
- population coverage incompleta.

A expiração de uma regra é apenas uma parte do estado aplicável.

### 9.1 Elegibilidade não é execução

Mesmo quando uma eliminação é permitida:

```text
lawful/qualified disposition eligibility
    != delete command accepted
    != logical invisibility
    != physical disposition closure
```

Um registro pode desaparecer da interface e ainda existir em:

- réplica;
- backup;
- cache;
- índice de busca;
- export;
- arquivo gerado;
- sistema downstream;
- provider antigo após migração.

Essas cópias formam uma **governed population**.

A questão não é exigir magicamente que todo backup seja reescrito instantaneamente. A questão é **não afirmar uma closure mais forte do que a evidência suporta**.

---

## 10. Governed population: o dado existe em mais lugares do que o usuário vê

Uma **governed population** é o conjunto identificado de representações/cópias que permanecem sujeitas a determinada obrigação de privacidade, preservação, retenção, residency ou disposition.

Exemplo:

```text
Cliente X
  ├─ registro primário
  ├─ réplica operacional
  ├─ índice de busca
  ├─ backup
  ├─ export mensal
  └─ CRM externo
```

Se a regra diz que a informação precisa ser preservada, todas as populações relevantes precisam ser consideradas dentro do scope daquela obrigação. Se a regra permite disposição, o sistema precisa distinguir o que foi efetivamente resolvido do que permanece residual.

Daí surge o conceito de **residual governed copy/population**: uma cópia que continua existindo ou acessível depois de uma mudança, cutover ou tentativa de disposition.

Isto conecta diretamente este capítulo ao conceito de residual cohort apresentado anteriormente.

---

## 11. Residency não é apenas escolher uma região

**Data residency** trata de restrições sobre onde dados e suas realizações relevantes podem residir ou ser processados, sob determinado contexto/jurisdição.

A simplificação perigosa seria:

```text
provider.region == "BR" => residency compliant
```

A realidade é multidimensional. Um serviço pode criar o objeto na região escolhida e ainda possuir:

- backups com comportamento diferente;
- metadata global;
- replicas em outra localidade;
- restore com outra semântica;
- serviços derivados com placement diferente;
- suporte parcial por tipo de recurso.

Por isso, Planning A trata residency como um **support vector qualificado**, não como igualdade de label.

Trocar provider também exige nova qualificação. Dois providers podem usar nomes regionais parecidos e oferecer garantias materialmente distintas.

---

## 12. O que o SB atual já evidencia em Privacy / Data Governance

Aqui o contraste entre visão e produto atual é grande.

> **EVIDENCIADO NO SB ATUAL:** existem decomposições e hooks adjacentes úteis — intenção provider-neutral para storage, hooks de retention/privacy em policy/compliance e audit, além de conceitos de migration/reconciliation.

Porém Planning B não encontrou um owner portable first-class já materializado para:

- purpose/use;
- governed populations;
- retention schedules revisionados;
- legal holds;
- residency/jurisdiction vectors;
- disposition eligibility;
- physical disposition closure;
- requalification após restore/provider substitution;
- outcomes `INCONCLUSIVE/PARTIAL/NON_CONFORMING` específicos desse domínio.

Portanto, o livro não deve induzir a ideia de que esse subsistema já existe. Ele é uma **capability G2 semanticamente delimitada e ainda gap no SB atual**.

---

## 13. O conflito clássico: Data, Storage e Privacy estão todos corretos localmente

Agora podemos montar um caso em que nenhuma parte está “quebrada” isoladamente.

Imagine uma migração de provider:

1. Data/Schema confirma que os registros no sink A são válidos.
2. Storage confirma que os objetos no sink B são íntegros.
3. Privacy aplica um legal hold em determinado instante.
4. CDC e replicação têm atrasos diferentes.
5. O sistema decide fazer cutover porque ambos os sinks estão “healthy”.

Cada observação local pode estar correta. Mas talvez não exista um instante comum no qual **o conjunto inteiro** represente simultaneamente o mesmo estado empresarial + a mesma revisão de obrigação de privacy.

O Full Pass 2 registrou essa família como um conflito de **common qualified cut**: dois sinks podem ser individualmente válidos e, ainda assim, não haver evidência de uma revisão temporal/causal comum que suporte a afirmação composta.

Isso reaparece em muitos lugares do System Builder:

```text
LocalValid(A) && LocalValid(B)
    != JointlyValid(A,B)
```

É um exemplo direto do princípio estudado no Capítulo 05: validade local não implica admissibilidade da composição.

---

## 14. O problema da restauração: backup não desfaz o mundo

Storage e Privacy também se encontram em recovery.

Suponha que ontem um registro foi legitimamente eliminado do sistema principal. Hoje ocorre uma falha e o banco é restaurado para um backup anterior à eliminação.

O backup funcionou tecnicamente. O dado reapareceu.

Isso mostra:

```text
restore succeeded != restored state is semantically admissible
```

A restauração pode precisar de:

- requalificação de privacy/residency;
- reconciliação com disposition events posteriores ao recovery point;
- reanexação de metadata/holds;
- current authorization/trust qualification;
- identificação de efeitos externos que sobreviveram ao rewind.

O capítulo 15 tratará recovery em profundidade. Aqui o ponto é que **Storage possui fatos sobre bytes e restore; Privacy possui obrigações sobre uso/preservação/disposition; Security/Resilience possui qualificação de recovery e return-to-service**. Um owner não deve absorver os outros.

---

## 15. Provider portability: mesmos recursos, semânticas diferentes

É tentador criar uma interface como:

```text
StorageProvider.put()
StorageProvider.get()
StorageProvider.delete()
```

Isso é útil, mas não prova portabilidade completa.

Providers podem divergir em:

- consistency;
- conditional writes;
- multipart/resumable upload;
- checksum guarantees;
- object lock;
- retention enforcement;
- delete semantics;
- archive restore latency;
- versioning;
- replication;
- metadata limits;
- range requests;
- residency behavior.

A mesma palavra de API pode esconder contratos diferentes.

O anti-lock-in do SB não exige fingir que todos são iguais. Exige o contrário: **manter explícita a diferença que importa para a semântica portátil**.

Daí a ligação com o Capítulo 03:

```text
Capability requer semântica
Provider anuncia mecanismos
Qualification mede suporte
Binding liga uma realização admitida
Evidence prova o estado efetivo
```

Se um provider não consegue satisfazer determinada obrigação, o resultado deve poder ser `PARTIAL`, `UNSUPPORTED` ou `INCONCLUSIVE` em vez de uma emulação silenciosa que muda o significado.

---

## 16. Brownfield: descobrir não é adotar

Empresas reais já possuem tabelas, planilhas, buckets, diretórios, ERPs e arquivos antigos.

O SB pode querer inspecionar esses materiais para acelerar a modelagem. Mas:

```text
discovered external structure != canonical SB truth
```

O padrão conceitual é:

```text
discover -> normalize -> explicit adopt
```

**Discover** coleta evidência.  
**Normalize** traduz para uma forma comparável, preservando ambiguidades e perdas.  
**Explicit adopt** é o momento governado em que determinada identidade/significado é aceito como canônico.

Isso evita que o nome de uma coluna antiga, o caminho de um arquivo ou um ID de provider passe a comandar o novo sistema apenas porque foi encontrado primeiro.

---

## 17. IA e low-code: o perigo de “arrumar” os dados

Uma IA pode olhar um dataset e perceber:

- valores ausentes;
- nomes inconsistentes;
- formatos diferentes;
- registros duplicados;
- arquivos sem metadata;
- campos “óbvios” que poderiam ser preenchidos.

Isso é extremamente útil para **propor** normalização.

Mas o fato de a IA conseguir inferir um valor não lhe dá autoridade para torná-lo fato histórico.

Exemplo:

```text
Campo: turno_do_atendimento
Ausente em registros de 2024
IA infere: "noturno" porque o timestamp é 23:10
```

Talvez isso esteja correto. Talvez o conceito empresarial de “turno” dependa da escala oficial, não do relógio civil. Talvez uma equipe tenha expediente especial naquele dia.

Portanto:

```text
AI inference != canonical StoredFact
```

A IA pode gerar proposta, evidência, confidence ou uma DerivedValue. A adoção como fato precisa respeitar semantic owner, authority e lineage.

Do mesmo modo, uma ferramenta low-code pode oferecer “default = NORMAL”. Isso não autoriza reescrever o passado.

Esse é um exemplo concreto de **AI/low-code non-amplification** aplicado ao domínio de dados.

---

## 18. Quando “delete” vira um problema distribuído

Exclusão é um bom exercício porque reúne quase todos os conceitos deste capítulo.

Considere a solicitação:

> “Apague todos os anexos temporários dessa OS.”

Antes de executar, o sistema pode precisar responder:

1. **Identity:** quais objetos canônicos são esses?
2. **Authorization:** quem solicitou pode ordenar a ação?
3. **Privacy/Data Governance:** eles são elegíveis para disposition agora?
4. **Legal hold:** existe preservação superior?
5. **Storage:** onde estão os bytes e cópias?
6. **Provider/Binding:** o provider oferece semantics suficientes?
7. **Currentness:** a evidência ainda é válida?
8. **Effect:** a deleção realmente ocorreu?
9. **Residual population:** caches/backups/replicas permanecem?
10. **Evidence:** o que pode ser afirmado com segurança depois?

Um provider responder `200 OK` resolve apenas uma parte.

Se a resposta se perde, o efeito pode ficar `UNKNOWN`. Se uma réplica permanece, disposition closure pode ser `PARTIAL`. Se um hold apareceu entre qualificação e actuation, a decisão pode ter ficado stale.

Essa é a razão de o projeto insistir tanto em evidência, currentness, revision vectors e reconcile-before-retry.

---

## 19. Trade-offs: por que não simplificar tudo em uma só camada?

Separar owners tem custo.

Há mais conceitos, mais revisões, mais evidências e mais estados intermediários. Um sistema trivial poderia simplesmente ter:

```text
User can delete? -> DELETE FROM table
```

Para usos simples, isso parece suficiente.

O problema é que o System Builder pretende gerar sistemas que possam crescer de uma estação pequena a estruturas empresariais, operar com providers externos, preservar autonomia e sobreviver a evolução. Se o significado já nasce colado ao mecanismo, cada crescimento exige desmontar decisões anteriores.

A estratégia pesquisada é diferente:

- **semântica explícita**, para crescer sem redefinir o negócio;
- **topologia física flexível**, para não obrigar complexidade operacional prematura.

Uma pequena instalação pode manter várias dessas concerns no mesmo processo ou banco. Isso é **topology collapse**, explicado no Capítulo 04. O que não deve colapsar silenciosamente é a identidade semântica.

A mesma aplicação pode executar Data, Storage e Privacy no mesmo host sem fingir que são a mesma decisão.

---

## 20. Técnicas de pesquisa que ajudam a falsificar suposições neste domínio

Este capítulo já encontrou algumas técnicas que reaparecerão no Capítulo 20.

### 20.1 Compatibility matrix

**O que é:** testar pares e conjuntos de revisões de schema/produtores/consumidores.

**Detecta:** versões que parecem compatíveis isoladamente mas perdem informação quando combinadas.

**Exemplo:** V1 lê V2, V2 lê V3, mas V1 escreve sobre um registro V3 e apaga um campo que não conhece.

**Limitação:** a matriz só é útil se representar os cohorts realmente ativos e a direção real de leitura/escrita.

**Aplicação ao SB:** qualificar coexistência e cutover sem presumir transitivity universal.

### 20.2 Round-trip property test

**O que é:** transformar um valor de A para B e novamente para A, verificando se propriedades necessárias sobrevivem.

**Detecta:** transformações lossy escondidas.

**Exemplo:** schema novo → cliente antigo → schema novo perde semântica.

**Limitação:** nem toda transformação precisa ser lossless; o owner precisa declarar quais invariantes são obrigatórias.

### 20.3 Fault injection em migration/storage

**O que é:** introduzir falhas em pontos específicos — depois do commit, antes do ACK, entre chunks, durante cutover.

**Detecta:** estados `UNKNOWN`, split failures e retries perigosos.

**Limitação:** não prova todas as falhas possíveis; precisa ser guiado pelo modelo de efeitos.

### 20.4 Residual-population audit

**O que é:** procurar sistematicamente cópias e consumidores que sobrevivem a cutover/deletion.

**Detecta:** falsa closure baseada apenas no primary store.

**Limitação:** descoberta incompleta de topologia pode gerar falso sentimento de completude.

### 20.5 Temporal/common-cut analysis

**O que é:** verificar se múltiplos sinks possuem evidência de um estado conjunto aplicável, não apenas timestamps locais recentes.

**Detecta:** sinks individualmente válidos mas conjuntamente incompatíveis.

**Limitação:** clocks e offsets não substituem causalidade/revision lineage; “maior timestamp” pode ser uma heurística inválida.

---

## 21. Um mapa mental para não misturar os owners

Use este quadro como referência:

```text
Process / Domain owner
    "o que este fato significa para o negócio?"

Data / Schema / Migrations
    "como a estrutura persistente representa e evolui esse significado?"

Storage / Documents / Media
    "qual objeto/conteúdo existe, com quais bytes, revisões,
     cópias, integridade e retrievability?"

Authorization
    "quem pode tentar esta ação neste escopo?"

Privacy / Data Governance
    "para que finalidade, sob quais obrigações de retenção,
     hold, residency e disposition esta população pode ser usada/movida/eliminada?"

Provider / Binding
    "qual realização consegue cumprir as propriedades requeridas?"

Observability / Evidence
    "o que foi observado e quão atual/completo é o conhecimento?"

Lifecycle / Security / Recovery
    "como essas revisões e estados coexistem, migram, recuperam
     e retornam ao serviço sem violar as demais obligations?"
```

O valor desse mapa não é criar burocracia. É impedir que uma camada responda uma pergunta que pertence a outra apenas porque ela possui acesso técnico aos bytes ou à API.

---

## 22. Estado da compreensão: o que está decidido, evidenciado e aberto

### DECIDIDO na camada autoritativa já concluída

- Data / Schema / Migrations, Storage / Documents / Media e Privacy / Data Governance / Retention / Legal Hold / Residency possuem semantic owners distintos em Planning A.
- Authorization não substitui privacy/data-governance eligibility.
- Provider-native identities não são canônicas por padrão.
- Provider acknowledgement não equivale automaticamente a convergência semântica.
- `Enterprise → Station → Role → Person` e AI/AGWS non-amplification continuam constraints preservadas.

### EVIDENCIADO NO SB ATUAL

- logical entity/field declaration e migrations determinísticas com preflight/hash/ledger para PostgreSQL;
- ArtifactStore release-scoped com hashing e verificação determinística;
- hooks/decomposições adjacentes para storage, compliance, audit e migration.

### EM PESQUISA

- como a arquitetura alvo materializará revision vectors, governed populations, support vectors, common-cut evidence, residual-copy drainage, data coexistence e privacy requalification;
- quais primitives atuais serão generalizadas ou permanecerão bounded a seus owners atuais.

### ABERTO/INCONCLUSIVO

- representação física e APIs definitivas;
- mecanismos concretos de provider substitution e multi-provider storage;
- formato final de privacy/governance decisions;
- estratégia alvo de online migrations, CDC e rollback;
- qualquer claim de saturação da campanha adversarial, que continua ativa.

---

## Referências internas autoritativas consultadas

A explicação deste capítulo foi sintetizada principalmente a partir de:

- `project_docs/generation-2/planning/PLANNING_A_DATA_SCHEMA_MIGRATIONS_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_DATA_SCHEMA_MIGRATIONS_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/planning/PLANNING_A_STORAGE_DOCUMENTS_MEDIA_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_STORAGE_DOCUMENTS_MEDIA_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/planning/PLANNING_A_PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_PRIVACY_DATA_GOVERNANCE_RETENTION_LEGAL_HOLD_RESIDENCY_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/research/edge-cases/DATA_SCHEMA_MIGRATIONS_FULL_PASS_2_REVISIT.md`;
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`.

Esses arquivos permanecem superiores ao livro em caso de divergência.

---

## O que você deve guardar deste capítulo

O ponto principal não é decorar nomes de capabilities. É aprender a fazer as perguntas certas.

**Um fato não é seu schema. Um schema não é o banco. Um documento não é seu caminho no provider. Um hash não é a identidade empresarial. Poder clicar em excluir não significa que a eliminação seja elegível. Uma eliminação elegível não significa que todas as cópias foram efetivamente dispostas. Um provider dizer “sucesso” não prova convergência do sistema inteiro.**

Quando essas diferenças permanecem explícitas, o System Builder consegue trocar providers, migrar schemas, recuperar dados, operar com revisões simultâneas e aplicar governança sem transformar cada mudança técnica em mudança de significado empresarial.

Essa base prepara o próximo capítulo: **cálculos, fórmulas, valores derivados e matemática empresarial**. A pergunta muda de “onde e sob quais obrigações o dado existe?” para “quando um valor calculado pode ser usado apenas como derivação e quando, se algum dia, ele pode adquirir autoridade de fato armazenado?”.
