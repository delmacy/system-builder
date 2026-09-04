# Capítulo 01 — O que é o System Builder e qual problema ele tenta resolver — v1.0.0

> **Identidade editorial:** `CHAPTER_01`  
> **Versão editorial:** `1.0.0`  
> **Status:** `PUBLISHED`  
> **Camada:** compreensão e síntese; não substitui pesquisa, síntese, Planning A/B nem futura arquitetura alvo.

## 1.1 O problema começa antes do software

Imagine uma empresa que recebe uma solicitação de manutenção. Alguém abre uma ordem de serviço, outra pessoa verifica disponibilidade de técnicos, uma peça precisa sair do estoque, talvez exista uma autorização, o trabalho é executado, horas são registradas, documentos são anexados e, no fim, alguém precisa saber se o serviço realmente terminou.

É tentador pensar que o problema de software consiste em criar uma tela de OS, uma tabela de estoque e alguns botões. Mas o problema real está nas relações entre essas partes.

Quem pode abrir a OS? Quem pode aprová-la? O técnico escalado continua disponível se outra atividade o reservar ao mesmo tempo? A baixa de estoque ocorreu ou apenas foi solicitada ao sistema externo? Se a integração respondeu com timeout, é seguro tentar de novo? Se a regra de cálculo de custo mudar amanhã, um relatório de três meses atrás deve ser recalculado com a fórmula nova ou preservar a fórmula histórica? Se a empresa trocar o provedor de e-mail, a ideia empresarial de “notificação enviada” muda junto com o fornecedor?

É nesse nível que nasce a Generation 2 do System Builder.

**DECIDIDO — na taxonomia de síntese:** o System Builder não é tratado como um único módulo gigantesco. A pesquisa consolidou 28 capabilities canônicas, com donos semânticos distintos e relações explícitas entre elas. Entre essas capabilities estão modelagem de processos, workflow durável, identidade, autorização, dados, storage, build, release, deployment, providers, interoperabilidade, observabilidade, segurança, billing e FinOps.

Uma **capability** é uma capacidade coerente do sistema: um conjunto de semânticas e responsabilidades que existe porque há um problema próprio a resolver. Ela não é sinônimo de tela, pacote de código ou produto externo.

## 1.2 O System Builder como tradutor de uma empresa

A visão do System Builder pode ser entendida como uma cadeia de tradução. A empresa possui intenções, processos, responsabilidades, dados, regras, exceções e recursos. O Builder ajuda a transformar esse conhecimento em uma descrição suficientemente precisa para gerar e evoluir software sem perder o significado empresarial no caminho.

Uma representação simplificada é:

```text
empresa / intenção
       |
       v
modelo semântico
       |
       v
composição de capabilities
       |
       v
artefatos + bindings + configuração
       |
       v
runtime autônomo
```

A palavra “tradutor” é uma analogia. Ela deixa de valer se imaginarmos uma tradução puramente textual ou determinística. O trabalho envolve elicitação, normalização, decisões humanas, evidência, compatibilidade, providers e evolução ao longo do tempo.

## 1.3 O significado pertence ao SB; a mecânica pode ser delegada

Uma diretriz recorrente da pesquisa é: **mature-system semantics with simple-system ergonomics; own semantics/requirements/evidence, delegate mature mechanics to providers**.

Em português: o SB deve preservar o significado, os requisitos e a evidência que precisam continuar verdadeiros mesmo quando a realização técnica muda. Ao mesmo tempo, não deve reinventar mecanismos maduros apenas para “possuir tudo”.

Um provider de e-mail pode entregar mensagens. Um engine de workflow pode persistir timers e retries. Um storage provider pode guardar bytes. Um serviço de identidade pode autenticar usuários. A existência desses providers é vantagem, não ameaça.

O problema aparece quando a semântica empresarial é acidentalmente definida pelo provider.

```text
Semântica canônica do SB     Provider
-------------------------    --------------------
"notificar responsável" --> SMTP / API / serviço
"guardar documento"      --> S3 / filesystem / etc.
"executar workflow"      --> engine A / engine B
```

Trocar a coluna da direita deveria ser possível sem redefinir silenciosamente a coluna da esquerda.

## 1.4 Capability, Provider, Binding e Semantic Owner

Quatro conceitos aparecem repetidamente na G2.

Uma **Capability** é a capacidade semanticamente coerente. Um **Provider** é um mecanismo especializado que realiza parte dela. Um **Binding** é o vínculo qualificado entre uma necessidade e uma realização admitida. Um **Semantic Owner** é quem possui o significado canônico e as invariantes daquela informação ou decisão.

Esses conceitos serão aprofundados no Capítulo 3. Por enquanto, basta perceber que eles evitam uma pergunta enganosa: “qual produto vamos usar?”. Antes dela vêm perguntas como “qual problema estamos resolvendo?”, “qual significado precisa sobreviver à troca do produto?” e “quem pode afirmar que uma condição é verdadeira?”.

## 1.5 Builder grande, runtime pequeno

A visão G2 não pressupõe que o Builder precise permanecer conectado para que cada sistema-cliente execute seu trabalho cotidiano. O Builder pode concentrar capacidades de elicitação, composição, análise, materialização, prova e evolução, enquanto o runtime recebe apenas aquilo de que necessita para operar.

Isso é **runtime autonomy**: autonomia operacional do sistema materializado dentro de seus contratos, evidências, revisões e limites de autoridade.

Autonomia não significa ausência de governança. Um runtime autônomo ainda precisa saber quais regras, identidades, bindings, artefatos e authority envelopes são aplicáveis. Também pode precisar reconciliar estado quando volta a se comunicar com outros componentes.

## 1.6 O mundo distribuído não responde apenas “sim” ou “não”

Um dos conceitos mais importantes da pesquisa é a disposição de efeitos externos:

```text
APPLIED
NOT_APPLIED
PARTIAL
UNKNOWN
```

Imagine que o SB mande um provider criar um recurso. A conexão cai antes da resposta. O recurso pode ter sido criado, pode não ter sido criado ou pode ter sido criado parcialmente.

Responder “falhou” é perigoso, porque pode levar a uma repetição que cria um segundo efeito. Responder “funcionou” também é perigoso, porque talvez nada tenha acontecido.

`UNKNOWN` preserva honestamente o estado do conhecimento. Daí nasce o princípio **reconcile-before-retry**: quando uma mutação ficou ambígua, primeiro investigue/reconcilie o efeito; só repita quando o contrato qualificado provar que isso é seguro.

## 1.7 Evidência não é decoração

A G2 usa evidência como parte da correção arquitetural. Uma afirmação como “o deployment está saudável” precisa ser interpretada com perguntas adicionais: saudável para qual workload? Observado por quem? Em qual revisão? Em qual instante? Com qual cobertura? Essa observação ainda está atual?

Um **qualified evidence envelope** é o modelo conceitual de preservar esse contexto. Ele impede que uma observação local seja fortalecida silenciosamente para uma conclusão global.

Isso importa porque a pesquisa adversarial encontrou repetidamente a mesma família de problema: componentes podem estar localmente corretos e, ainda assim, a composição das suas afirmações ser incompatível.

## 1.8 Partes corretas podem formar um sistema errado

Imagine duas regras:

1. o solicitante de uma compra não pode aprová-la;
2. apenas o responsável local pode aprovar compras daquela Station.

As duas podem ser corretas. Mas, se o solicitante for o único responsável local elegível, o processo pode chegar a um estado em que nenhuma pessoa possui autoridade legal para avançar.

O grafo pode estar correto. A política pode estar correta. A organização pode estar correta. A composição pode estar bloqueada.

A campanha adversarial chama atenção para essa classe de problema. Um **ConflictPattern** descreve uma família reutilizável de incompatibilidade potencial. Uma **ConflictInstance** é uma ocorrência concreta. E um **Signal** é apenas um indício: `Signal != ConfirmedConflict`.

Essa prudência evita dois extremos: ignorar riscos porque cada módulo passa sozinho ou bloquear processos legítimos porque um detector encontrou apenas uma semelhança superficial.

## 1.9 Revisão e coexistência

Uma empresa muda. Processos, schemas, fórmulas, policies, providers, runtimes e artefatos podem evoluir em ritmos diferentes.

Por isso, a G2 não assume que existe uma única “versão do sistema” capaz de explicar tudo. Revisões podem coexistir e formar um **revision vector** relevante para determinada conclusão.

Publicar um processo novo não prova que workflows antigos migraram. Atualizar uma fórmula não prova que valores históricos devem ser recalculados. Fazer rollout de um runtime não prova que toda a população anterior desapareceu.

O Capítulo 2 desenvolverá essa ideia em profundidade.

## 1.10 IA é poderosa, mas não vira autoridade por ser inteligente

A IA pode ajudar a elicitar processos, propor modelos, gerar configurações, analisar conflitos e produzir candidatos de arquitetura. Isso não lhe dá autoridade canônica automática.

A pesquisa preserva a direção `Enterprise → Station → Role → Person` e a não amplificação de autoridade por AI/AGWS. Uma IA pode propor uma ação que alguém autorizado aprove; não pode transformar sua própria sugestão em permissão.

Esse limite é especialmente importante em low-code, onde montar duas operações individualmente válidas pode produzir uma composição globalmente perigosa.

## 1.11 O que a Generation 2 está fazendo agora

**EM PESQUISA:** a fase atual é adversarial. Depois da elicitação, síntese, Planning A, Planning B e pesquisa matemática, o projeto está tentando falsificar suas próprias safe assumptions com edge cases, failure cases, misuse e conflitos processuais/semânticos.

Isso significa que este livro precisa distinguir cuidadosamente aquilo que já está decidido em boundaries/taxonomia, aquilo que está evidenciado no SB atual e aquilo que ainda é hipótese ou questão aberta.

A futura Planning C deverá transformar esse conhecimento em arquitetura alvo. Este capítulo não antecipa essa decisão.

## 1.12 O que você deve guardar deste capítulo

O System Builder tenta preservar o significado empresarial enquanto transforma intenção em software materializado e operável.

Ele não quer reinventar providers maduros; quer possuir as semânticas, requisitos e evidências que precisam sobreviver à substituição desses providers.

A Generation 2 está estruturando o problema em capabilities com semantic owners explícitos, runtime autônomo, revisões e evidência qualificada. Ela também está levando a sério uma descoberta fundamental: **não basta que cada peça esteja correta isoladamente; a composição precisa continuar correta.**

Nos próximos capítulos, construiremos esse modelo mental por partes, começando pela ideia de empresa como sistema versionado.

---

## Referências internas autoritativas consultadas

- `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`;
- `project_docs/generation-2/research/POST_MATH_ADVERSARIAL_EDGE_CASE_SATURATION_RESEARCH.md`;
- `project_docs/generation-2/research/edge-cases/PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`;
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`.

Os artefatos acima permanecem autoritativos. Esta versão apenas formaliza a identidade editorial do conteúdo originalmente publicado, sem alterar seu entendimento substantivo.