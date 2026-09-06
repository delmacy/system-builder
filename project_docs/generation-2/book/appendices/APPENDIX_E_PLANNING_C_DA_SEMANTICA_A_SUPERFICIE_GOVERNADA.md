# Apêndice E — Planning C em movimento: da semântica à superfície governada

**Camada:** compreensão e síntese; não é autoridade arquitetural.  
**Data editorial:** 2026-09-06  
**Estado da fonte:** Planning C `ACTIVE`; C0, C1 e C2 decididos; C3 em 4/28 capabilities decididas no snapshot consultado.

> Este apêndice registra o entendimento do estado autoritativo consultado. Ele não cria decisões, não fecha Planning C e não substitui os artefatos de Planning C.

## 1. O problema humano: depois de pesquisar muito, como começar a escolher sem perder as separações que a pesquisa descobriu?

Durante a pesquisa, é relativamente fácil dizer que duas coisas **não devem ser confundidas**. É mais difícil transformar essa separação em arquitetura concreta sem criar um grande componente central que passe a ser dono de tudo.

Esse é o problema que Planning C começou a enfrentar. A pesquisa adversarial fechou com 408 findings materiais — 284 edge scenarios e 124 `ConflictPattern`s reutilizáveis — e deixou de ser o gate bloqueador. A partir daí, a pergunta deixou de ser apenas “quais riscos e separações existem?” e passou a incluir “qual arquitetura alvo preserva essas separações?”.

No snapshot consultado, Planning C já decidiu C0, C1, C2 e as quatro primeiras capabilities de C3. O próximo estágio autorizado é C3.5 — Workflow & Durable Execution.

A mudança de fase pode ser resumida assim:

```text
pesquisa
  pergunta: o que pode dar errado e que verdades não podem colapsar?

Planning A
  pergunta: quem é semantic owner e onde estão as boundaries?

Planning B
  pergunta: o que o SB atual realmente evidencia?

Planning C
  pergunta: que arquitetura alvo preserva owners, boundaries,
            invariantes, provas e evolução?
```

Isso não significa que “a pesquisa acabou e agora basta codificar”. Planning C ainda é planejamento arquitetural. Planning D, Planning E, Architecture Reconciliation, WBS, Work Packages, TASKs e Construction continuam etapas posteriores.

## 2. C2: integrar o mundo físico sem transformar o System Builder em controlador universal

**DECIDIDO:** C2 adotou um **Physical / Peripheral Integration and Governance Plane bounded**.

Em linguagem simples, o System Builder pode conhecer, integrar, governar e reconciliar sistemas físicos especializados sem precisar se tornar o software que executa internamente toda a mecânica física desses sistemas.

Considere uma empresa com:

- câmeras e VMS;
- controle de acesso;
- catracas e leitores;
- HVAC/BMS;
- terminais fiscais e de pagamento;
- dispositivos industriais;
- biometria.

Seria tentador dizer: “se o SB integra tudo, então ele deve possuir uma capability genérica de atuar fisicamente sobre qualquer equipamento”. C2 rejeita esse salto.

O desenho decidido preserva, por padrão, os sistemas especializados como **control/media planes externos**. O SB fica com semântica portátil de integração, governança, lifecycle, evidência e reconciliation. Mecânicas especializadas — streaming de vídeo, controle de baixo nível, loops de HVAC, matching biométrico, funções de firmware, movimento industrial — continuam pertencendo aos sistemas especializados salvo decisão futura explícita.

A separação é importante:

```text
conhecer um dispositivo
        !=
ter binding com seu sistema
        !=
observar seu estado
        !=
provisionar algo nele
        !=
ter autoridade genérica para atuar fisicamente
```

### 2.1 Por que não admitir actuation genérico por conveniência?

Porque atuação física adiciona riscos que uma integração de software comum não resolve automaticamente: segurança humana, hazard, locality, currentness, autoridade local, falha de comunicação e diferença entre “o provider disse que executou” e “o mundo físico realmente está naquele estado”.

**DECIDIDO:** `provider reported state != physical truth`.

Se um provider informa “porta destravada”, isso é evidência qualificada produzida por uma fonte. Não é uma licença para o restante da arquitetura tratar a informação como verdade física absoluta e atual indefinidamente.

A analogia é uma central telefônica recebendo a informação de que uma equipe chegou ao local. A mensagem é relevante, mas não transforma a central em sensor físico onisciente. A analogia deixa de valer tecnicamente porque sistemas digitais podem carregar timestamps, provenance, currentness, revisão de binding e outras qualificações formais que uma conversa humana normalmente não carrega de forma estruturada.

## 3. DeviceClass não é DeviceInstance

C2 também decidiu separar identidades que sistemas mais simples costumam misturar.

Um `DeviceClass` descreve semanticamente um tipo de recurso externo. Um `DeviceInstance` é uma realização concreta, qualificada por provider/site/contexto.

Por exemplo:

```text
DeviceClass
  leitor biométrico de acesso

DeviceInstance
  leitor #AC-773 do Provider X
  instalado na Station Canoas
  binding/profile revision R17
```

O identificador `AC-773` não vira identidade canônica do SB só porque o provider o utiliza. Nomes, aliases, e-mails, usernames e IDs numéricos externos também não se tornam equivalência canônica automaticamente.

Isso prolonga uma ideia recorrente no livro:

```text
provider identity != canonical identity
```

O mesmo princípio vale para contas, subjects, grupos, grants, resources, tenants e sites externos. O mapeamento precisa ser explícito, escopado, revisionado e acompanhado de provenance suficiente.

## 4. Adapter e edge gateway são realizadores, não semantic owners

Um adapter traduz semântica portátil para a linguagem de um provider. Um edge gateway pode executar transporte local, protocol conversion, buffering, store-and-forward, isolamento de credenciais, descoberta local e retenção de evidência offline.

Nada disso, por si só, torna adapter ou gateway dono da semântica empresarial.

**DECIDIDO:** provider adapter, protocol bridge e edge/site gateway são realization layers, não semantic owners.

Esse ponto é importante para a visão anti-lock-in. Se a semântica “quem pode acessar esta área?” ficar escondida dentro do adapter do fabricante da catraca, trocar o fabricante exige reconstruir significado empresarial. Se o adapter realiza um contrato semanticamente externo a ele, a substituição continua difícil, mas o significado não precisa ser reinventado do zero.

## 5. C3 começou a aplicar a constituição capability por capability

Depois de C0, C1 e C2, C3 passou a decidir a arquitetura alvo das 28 capabilities canônicas. No snapshot desta edição, quatro estão decididas:

1. Universal Capability Architecture;
2. Process & Application Modeling;
3. UI / Generated Experience / Low-code Builder;
4. Adaptive Governed Work Surfaces (AGWS).

Isso é importante porque C0 não pretendia decidir todos os detalhes de cada capability. Ele estabelece substrato e invariantes constitucionais. C3 precisa mostrar como cada owner usa esse substrato sem absorver responsabilidades vizinhas.

A imagem mental é:

```text
             constituição transversal
                    C0
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   capability A  capability B  capability C
      C3.x          C3.y          C3.z
        │            │            │
        └──── contratos tipados ──┘
```

A analogia com uma constituição ajuda a entender limites e poderes, mas deixa de valer porque componentes de software não são instituições políticas: dependências, schemas, runtime behavior e provas precisam ser especificados tecnicamente.

## 6. AGWS: a interface de trabalho também precisa de governança sem virar autorização

Uma das decisões mais interessantes até aqui é **Adaptive Governed Work Surfaces (AGWS)**.

O problema empresarial é simples de reconhecer. Uma organização não quer necessariamente a mesma tela para todo mundo. A direção pode querer indicadores globais; uma Station pode precisar de operações locais; um técnico pode precisar de OS e equipamentos; um supervisor pode precisar de aprovação; uma pessoa pode preferir uma organização visual própria.

Isso sugere uma hierarquia:

```text
Enterprise
   ↓
Station
   ↓
Role
   ↓
Person
```

Mas personalizar uma tela pode criar um problema grave se “o que aparece na tela” virar sinônimo de “o que a pessoa pode fazer”.

Por isso AGWS preserva uma desigualdade constitucional:

```text
governed surface != authorization truth
```

A superfície pode **expor** uma ação para determinado contexto, mas Authorization continua sendo o owner da decisão de autoridade. Esconder um botão não revoga permissão. Mostrar um botão não concede permissão.

## 7. Personalização não é delegação

**DECIDIDO:** `personalization != delegation`.

Se uma pessoa move o card “Minhas OS” para o topo da página, isso é personalização. Se uma Station decide quais capabilities podem ser expostas em determinada superfície, existe governança de exposição. Se alguém recebe poder para modificar uma superfície de equipe, existe uma forma de administração delegada que precisa referenciar autoridade emitida pelo owner competente.

Essas coisas não podem ser colapsadas em um único conceito chamado “editar dashboard”.

**EXEMPLO DIDÁTICO:**

```text
Pessoa:
  mover widget de posição              -> personalização

Supervisor autorizado:
  configurar superfície da equipe      -> administração delegada bounded

Station:
  admitir exposição de capability      -> governança de superfície

Authorization:
  decidir se o ator pode aprovar OS    -> autoridade
```

A UI não se torna dona de nenhuma dessas verdades apenas porque as renderiza.

## 8. Herança monotônica: a camada inferior não pode apagar a proteção superior

AGWS decide overlays revisionados para Enterprise, Station, Role e Person com herança monotônica.

Em termos simples, uma camada inferior pode especializar somente aquilo que as camadas superiores permitiram especializar. Ela não pode enfraquecer uma invariável obrigatória herdada.

Imagine que Enterprise determina que toda superfície de aprovação deve mostrar `valor`, `centro de custo` e `responsável`. A Station pode talvez escolher a posição desses componentes se isso estiver delegado. A pessoa pode talvez escolher densidade ou ordenação. Mas uma preferência pessoal não pode remover silenciosamente um controle obrigatório imposto acima.

```text
superior define invariável obrigatória
             ↓
inferior recebe dimensões delegadas
             ↓
especialização bounded
             ↓
nenhuma ampliação de autoridade
nenhuma remoção de proteção superior
```

Essa é uma aplicação concreta do princípio de non-amplification já discutido em outras partes do livro.

## 9. Surface truth, rendering truth e domain truth são coisas diferentes

AGWS não é um editor universal de DOM, CSS, schema, workflow e negócio.

Ele possui a semântica de composição governada da superfície. A realização visual pertence à capability de UI/Generated Experience. Dados e processos continuam com seus semantic owners. Workflow continua sendo Workflow. Authorization continua decidindo autoridade.

Portanto:

```text
surface composition truth
      != rendered UI implementation
      != domain/data truth
      != workflow truth
      != authorization truth
```

Essa separação impede que um low-code builder se transforme em “god tool” no qual qualquer mudança visual possa alterar silenciosamente schema, processo, autoridade e efeitos externos.

## 10. IA pode propor uma superfície; não pode promovê-la por existir

AGWS preserva outro princípio transversal:

```text
AI proposal = candidate
```

Imagine que a IA perceba que um supervisor abre todos os dias as mesmas três telas e proponha uma superfície melhor. A proposta pode ser excelente. Ainda assim, qualidade estatística não é autoridade de promoção.

A proposta precisa respeitar lineage, invariantes herdadas, dimensões delegadas e o processo de promoção competente. Isso também vale para Wizards e outras ferramentas de autoria.

O ponto não é “desconfiar da IA”. É impedir que capacidade de sugerir seja confundida com capacidade de alterar a verdade canônica.

## 11. Planning C está produzindo decisões, mas ainda não produziu a arquitetura completa

Este é um ponto editorial importante.

**DECIDIDO:** C0, C1, C2 e C3.1–C3.4 possuem decisões autoritativas no snapshot consultado.

**EM PLANEJAMENTO:** C3 ainda está em 4/28 capabilities. Vinte e quatro decisões de capability permanecem. O próximo alvo é Workflow & Durable Execution.

**ABERTO/INCONCLUSIVO:** Planning D, Planning E, Architecture Reconciliation, WBS, Work Packages, TASKs e Construction não podem ser inferidos a partir das quatro primeiras decisões.

Portanto, não devemos fazer o raciocínio:

```text
C3 começou
   ↓
“já sabemos a arquitetura inteira”
   ↓
“já podemos quebrar em TASKs”
```

O raciocínio correto permanece:

```text
C3 decide capability por capability
        ↓
Planning C fecha quando o gate competente fechar
        ↓
estágios posteriores recebem a arquitetura decidida
        ↓
só então a decomposição executiva avança pelos gates próprios
```

## 12. O que muda na leitura dos capítulos anteriores

Os capítulos iniciais do livro foram escritos quando várias estruturas ainda estavam em pesquisa ou antes de Planning C estar aberta. Eles continuam úteis como explicação histórica e conceitual, mas algumas frases de estado e algumas classificações epistemológicas precisarão de revisão bounded.

Por exemplo:

- Physical/Peripheral deixou de ser apenas uma hipótese de boundary e agora possui decisão C2;
- AGWS agora possui responsabilidade e não-responsabilidade arquitetural explícitas;
- a hierarquia `Enterprise -> Station -> Role -> Person` ganhou uso arquitetural concreto em governed surfaces;
- separações como `visibility != authority`, `personalization != delegation` e `AI proposal != promotion authority` aparecem agora como invariantes constitucionais de uma capability decidida;
- Planning C não é mais uma etapa futura abstrata: ela está ativa e produzindo decisões capability por capability.

Isso não significa apagar o texto anterior. Significa aplicar o versionamento editorial: quando um capítulo for revisado, sua identidade `CHAPTER_XX` permanece e sua versão aumenta conforme o impacto.

## 13. O que você deve guardar deste apêndice

Planning C é a ponte entre conhecimento acumulado e arquitetura alvo, não um atalho entre pesquisa e código.

C2 mostra uma escolha arquitetural importante: **integrar e governar o mundo físico não exige que o System Builder se torne controlador físico universal**. Estado reportado por provider continua sendo evidência qualificada, não verdade física absoluta.

C3 mostra como a constituição transversal começa a ganhar forma capability por capability. AGWS é um exemplo particularmente didático: uma superfície de trabalho pode ser adaptativa, hierárquica e governada sem se tornar dona da autorização, do workflow, dos dados ou da renderização.

As separações mais úteis desta rodada são:

```text
integration != generic physical actuation
provider-reported state != physical truth
adapter/gateway != semantic owner
device class != device instance
governed surface != authorization truth
personalization != delegation
rendered UI != canonical surface truth
AI proposal != promotion authority
Planning C active != architecture complete
architecture decision != WBS != TASK != Construction
```

O livro deve agora acompanhar Planning C sem correr na frente dela.

## Referências autoritativas consultadas

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`
- `project_docs/generation-2/planning/PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`
- `project_docs/generation-2/planning/PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`
- `project_docs/generation-2/planning/PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`
- `project_docs/generation-2/planning/PLANNING_C_C3_01_UNIVERSAL_CAPABILITY_ARCHITECTURE_TARGET.md`
- `project_docs/generation-2/planning/PLANNING_C_C3_02_PROCESS_APPLICATION_MODELING_TARGET.md`
- `project_docs/generation-2/planning/PLANNING_C_C3_03_UI_GENERATED_EXPERIENCE_LOW_CODE_TARGET.md`
- `project_docs/generation-2/planning/PLANNING_C_C3_04_ADAPTIVE_GOVERNED_WORK_SURFACES_TARGET.md`

Esses artefatos são autoridades do planejamento; este apêndice apenas os traduz pedagogicamente.