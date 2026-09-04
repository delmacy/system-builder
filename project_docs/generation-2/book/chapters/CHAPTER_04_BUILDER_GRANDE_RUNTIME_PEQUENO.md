# Capítulo 04 — Builder grande, Runtime pequeno: composição modular e fechamento de dependências — v1.0.0

**Identidade editorial:** `CHAPTER_04`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** compreensão e síntese; não substitui pesquisa, synthesis, Planning A/B ou futura arquitetura alvo.

## 1. O problema humano: por que um sistema simples acaba carregando uma fábrica inteira?

Imagine uma pequena empresa de manutenção. Ela quer um sistema para receber uma solicitação, abrir uma OS, consultar o técnico disponível, registrar materiais usados, colher uma assinatura e enviar um e-mail ao final.

Para o usuário, isso parece pequeno. E deveria continuar parecendo pequeno.

Mas, para construir esse sistema com segurança, alguém precisa conhecer muito mais coisas: schemas, permissões, versões, dependências, formulários, workflows, regras, integrações, build, migrations, secrets, evidência, compatibilidade e talvez vários providers. O ambiente que **constrói** o sistema tende naturalmente a ser mais rico que o sistema que **executa** o trabalho diário.

Daí nasce uma ideia importante da Generation 2:

```text
Builder rico em conhecimento
        |
        | compõe, valida, fecha dependências,
        | produz artefatos e evidência
        v
Runtime com apenas o necessário para operar
```

“Builder grande, Runtime pequeno” não quer dizer que o Builder precise ser monolítico nem que todo runtime precise caber em um único processo. A frase descreve uma **assimetria de responsabilidade**: o Builder pode precisar conhecer muitas possibilidades; um sistema materializado precisa carregar apenas a closure exigida pelo seu workload e perfil operacional.

**HIPÓTESE DE ARQUITETURA:** a forma exata dessa composição na arquitetura alvo ainda não está decidida. Planning C permanece bloqueado enquanto a campanha adversarial estiver ativa.

## 2. Duas perguntas diferentes: o que pode existir e o que precisa existir aqui?

O catálogo do System Builder pode conhecer dezenas de capabilities e múltiplas realizações para cada uma. Uma instalação específica talvez use somente uma parte delas.

Pense em uma oficina que precisa de:

- OS;
- cadastro de técnicos;
- agenda;
- estoque básico;
- documentos;
- e-mail.

Ela não deveria precisar carregar uma engine de billing só porque o Builder conhece billing. Também não deveria precisar levar para produção o editor visual usado para desenhar o processo, se esse editor não participa da execução.

Isso separa duas perguntas:

```text
Universo conhecido pelo Builder
        ≠
Closure necessária ao workload materializado
```

A palavra **closure**, neste contexto, significa **fechamento**: o conjunto precisa incluir tudo aquilo de que a execução realmente depende, inclusive dependências transitivas.

Se A precisa de B e B precisa de C, selecionar apenas A e B não fecha o grafo. C também pertence ao fechamento necessário.

```text
OS
├── Workflow
│   ├── Persistência
│   └── Política/autorização
├── Formulário
│   └── Schema
└── Notificação
    └── Binding de e-mail
```

A árvore é apenas didática; grafos reais podem compartilhar dependências, ter condições e coexistência de revisões. O ponto é que “não uso diretamente C” não significa “C não é necessário”.

## 3. Fechamento transitivo de dependências

O termo técnico é **transitive dependency closure**, ou fechamento transitivo de dependências.

Considere:

```text
A → B
B → C
C → D
```

Se o workload requer A, sua closure inclui A, B, C e D, salvo quando algum elo for opcional/condicional sob um perfil explicitamente qualificado.

Isso parece trivial até surgirem versões e condições:

```text
OS v4
 ├─ Workflow >= 3
 │   └─ Rules Engine v2
 └─ Documentos v5
     └─ Storage API >= 4
```

Agora suponha que outro componente exija `Rules Engine v1`. Cada requisito pode ser localmente razoável, mas o conjunto pode não possuir uma solução compatível. A composição precisa detectar isso **antes de fingir que existe um runtime válido**.

Planning B encontrou no SB atual uma fundação concreta nessa direção: o assembler já possui resolução determinística de dependências de capability, propagação transitiva, constraints de versão/compatibilidade, detecção de ciclos e conflitos, ordenação estável e hash canônico do `AssemblyPlan`.

**EVIDENCIADO NO SB ATUAL:** existe fechamento transitivo significativo no nível de capabilities.

**ABERTO/INCONCLUSIVO:** isso ainda não equivale a um modelo generalizado de todos os materiais de build, toolchains, bibliotecas runtime, imagens-base, inputs externos e demais dependências necessárias para uma closure portátil completa.

## 4. Dependência direta, transitiva, condicional e escondida

Nem toda dependência aparece da mesma forma.

Uma **dependência direta** é declarada pelo componente. Uma **dependência transitiva** vem por outra dependência. Uma **dependência condicional** só existe sob determinada feature, plataforma ou perfil. E uma **dependência escondida** é aquela que influencia a execução ou o build sem estar adequadamente declarada.

Exemplo: um build parece depender apenas do código e do lockfile, mas baixa silenciosamente um arquivo mutável da internet. Esse arquivo também influencia o resultado. Se não aparece no modelo, a closure declarada é incompleta.

Outro exemplo: um runtime “autônomo” depende de consultar o Builder a cada autorização. Nesse caso, o Builder faz parte da closure operacional daquele perfil, mesmo que ninguém o tenha declarado como tal.

Esse é um dos motivos pelos quais a pesquisa distingue dependência arquitetural de conveniência de implementação.

## 5. Minimal runtime closure: pequeno não significa incompleto

A pesquisa usa a ideia de **minimal runtime closure**: o fechamento mínimo de runtime necessário para executar um workload sob determinado perfil.

“Minimal” não significa remover tudo até o programa iniciar. Significa não reter dependências que pertencem apenas à autoria, compilação ou administração central quando elas não são necessárias em operação — **sem remover requisitos necessários à correção, segurança ou autoridade**.

Um runtime de OS pode precisar de:

- artefatos executáveis;
- bibliotecas runtime;
- schema e migrations aplicáveis;
- configuração materializada ou referências resolvíveis;
- trust material necessário;
- política e autoridade local dentro do horizonte permitido;
- bindings de providers necessários;
- assets e metadata de inicialização.

Ele talvez **não** precise de:

- editor Canvas;
- pesquisador de capabilities;
- compilador;
- gerador de código;
- catálogo completo de providers;
- documentação de autoria;
- toda a inteligência usada para decidir como o sistema foi construído.

A diferença é parecida com uma cozinha industrial e a marmita pronta. A cozinha precisa de equipamentos, estoque, receitas e processos que não viajam dentro de cada marmita. A analogia termina aí: software em runtime pode continuar interagindo com serviços externos, atualizar estado e receber revisões; portanto não é um objeto passivo como a marmita.

## 6. Runtime autônomo não é runtime isolado

Um erro fácil seria concluir:

```text
runtime autônomo = runtime sem dependências externas
```

Isso não é o que a pesquisa sustenta.

Planning A define autonomia como capacidade de continuar operando dentro de uma **retained closure** declarada, sem dependência viva do control plane do System Builder quando o perfil operacional permitir.

Um sistema pode ser autônomo e ainda depender de PostgreSQL, SMTP, storage, um identity provider ou outro serviço explicitamente contratado. O que importa é que essas dependências sejam conhecidas, qualificadas e não transformem o Builder em um cordão umbilical oculto.

Assim:

```text
Autonomia ≠ isolamento
Autonomia ≠ funcionamento eterno offline
Autonomia ≠ ausência de providers
```

A autonomia é **qualificada**. Uma Station desconectada, por exemplo, pode operar enquanto possuir autoridade, configuração, trust, schema, bindings e evidência dentro dos horizontes permitidos. Quando esses pré-requisitos expiram, o comportamento precisa degradar ou falhar de acordo com a política aplicável. Na reconexão, estado local stale não vira verdade empresarial atual por decreto: precisa ser reconciliado.

## 7. Builder-time, build-time e runtime

Para entender a composição, ajuda separar três momentos didáticos.

### 7.1 Builder-time

É quando intenção empresarial é interpretada, capabilities são selecionadas, processos são modelados, providers podem ser avaliados e a definição do sistema evolui.

### 7.2 Build-time

É quando entradas revisionadas são fechadas sobre dependências e transformadas em outputs por receita/toolchain/runner qualificados. Build precisa saber **o que entrou** e **o que foi produzido**.

### 7.3 Runtime

É quando o workload materializado executa trabalho empresarial real.

```text
Intenção / modelo
      |
      v
Builder-time
      |
      | definição + requisitos
      v
Build-time
      |
      | outputs + closure + evidência
      v
Release / Deployment
      |
      v
Runtime
```

Essas fronteiras não devem ser confundidas. Planning A preserva explicitamente:

```text
build result ≠ released artifact ≠ deployed state ≠ consumer/runtime-effective state
```

Um build terminar não prova que foi publicado. Publicação não prova deployment. Deployment aceito pelo provider não prova que consumidores estejam efetivamente usando a geração correta.

## 8. Cumulative context: cada etapa precisa carregar contexto suficiente

Composição executável não é apenas juntar arquivos. Cada etapa precisa receber contexto suficiente para interpretar corretamente o que recebeu.

Chamaremos didaticamente isso de **cumulative context**: contexto acumulado necessário para que uma decisão posterior não perca identidade, revisão, lineage, constraints e evidência relevantes produzidas antes.

Exemplo simplificado:

```text
Processo aprovado r7
   ↓
AssemblyPlan p12
   ↓
Build b31
   ↓
Artifact a31
   ↓
Deployment d9
```

Se `d9` conhece apenas “imagem X”, mas perdeu a informação de que ela veio de `a31`, produzido de `p12`, derivado do processo `r7`, a cadeia fica semanticamente fraca. Por outro lado, copiar todo o histórico bruto para cada etapa também seria ruim.

O objetivo não é carregar “todo o Builder” no runtime. É preservar **referências e evidência suficientes** para responder perguntas importantes:

- qual revisão estou executando?
- de qual definição ela veio?
- quais bindings e requisitos são aplicáveis?
- quais dependências foram retidas?
- quais claims continuam atuais?
- qual predecessor é válido em rollback?

Isso é diferente de um contexto global gigante. Cumulative context deve ser mínimo, tipado e orientado à necessidade da próxima boundary.

## 9. Composição modular não é copiar módulos para uma pasta

Um sistema modular de verdade precisa preservar mais que separação física de código.

Imagine três módulos:

```text
Estoque
OS
Faturamento
```

A OS consome peças do estoque. O faturamento cobra certos serviços da OS. Colocar os três pacotes no mesmo executável não explica:

- quem é dono do estado de estoque;
- qual evento significa “peça consumida”;
- qual revisão de preço vale;
- se faturamento pode alterar a OS;
- como uma falha parcial é reconciliada;
- quais capabilities podem ser removidas sem quebrar outras.

Por isso, composição modular depende das fronteiras explicadas no capítulo anterior. Capability continua sendo unidade semântica; provider continua sendo realização; binding continua qualificando a realização; semantic owner continua dizendo quem possui o significado.

O runtime pode fisicamente reunir várias coisas sem apagar essas identidades.

## 10. Topologia física pode colapsar; semântica não precisa colapsar

Este é um dos conceitos mais úteis para conciliar “sistema simples” com “semântica madura”.

Em uma pequena empresa, podemos imaginar:

```text
[ Aplicação ]
  ├─ workflow
  ├─ documentos
  ├─ autorização
  ├─ notificações
  └─ jobs

[ PostgreSQL ]
```

Fisicamente, muitas capabilities podem coexistir no mesmo processo, host e banco. Isso é **colapso de topologia física**.

Mas não precisamos concluir:

```text
mesmo processo = mesmo semantic owner
mesmo banco = mesmo lifecycle
mesma tabela = mesma autoridade
mesmo host = mesma identidade
```

Se amanhã a empresa crescer, notificações podem migrar para outro provider, jobs para workers separados e documentos para object storage sem redefinir o que uma OS significa.

A direção pedagógica é:

> **semânticas de sistema maduro com ergonomia de sistema simples.**

Uma instalação pequena não deveria pagar antecipadamente todo o custo operacional de uma arquitetura distribuída. Ao mesmo tempo, simplicidade física não deve tornar impossível separar responsabilidades depois.

**HIPÓTESE DE ARQUITETURA:** quais seams concretos serão mantidos no target runtime é assunto de Planning C; o livro não decide isso antecipadamente.

## 11. Um único processo pode conter vários owners

Suponha um sistema pequeno com uma única aplicação Node e um único PostgreSQL. Dentro dele existem:

- autorização;
- workflow;
- estoque;
- documentos.

A topologia é simples. Ainda assim:

```text
Authorization owns decisão de autorização
Workflow owns estado/transição do processo
Inventory owns saldo/movimentação
Documents owns identidade/lifecycle documental
```

Essa separação é conceitual antes de ser física.

Ela permite que testes perguntem se um módulo está “roubando” a verdade de outro, mesmo antes de existir microserviço algum. Também evita usar microserviços como substituto de arquitetura: distribuir componentes não cria automaticamente bons boundaries.

## 12. O outro extremo: distribuir cedo demais

Se colapsar semântica é perigoso, distribuir tudo desde o primeiro cliente também é.

Uma pequena instalação com dezenas de serviços independentes pode impor:

- mais deploys;
- mais networking;
- mais failure modes;
- mais observabilidade;
- mais certificados e secrets;
- mais version skew;
- mais custo operacional.

A pesquisa G2 não trata complexidade distribuída como sinal de maturidade. Maturidade está em preservar invariantes, identidades, lifecycle e evidência corretos sob o perfil necessário.

Um monólito modular bem delimitado pode ser mais apropriado que uma frota de microserviços mal delimitados.

## 13. Closure de build e retained closure de runtime não são a mesma coisa

Há duas closures próximas, mas diferentes.

### Build closure

Inclui materiais necessários para produzir o output: source, dependências, toolchain, recipe, inputs externos declarados etc.

### Retained runtime closure

Inclui aquilo que precisa continuar disponível para operar o workload materializado sob determinado perfil.

Exemplo:

```text
Build closure
├─ TypeScript compiler
├─ code generator
├─ source templates
├─ dependency resolver
└─ runtime libraries

Retained runtime closure
├─ generated application
├─ runtime libraries
├─ schema/migrations aplicáveis
├─ config/trust material necessário
└─ provider bindings necessários
```

O compilador pode ser essencial para construir e irrelevante para executar. Essa é uma das fontes da ideia “Builder grande, Runtime pequeno”.

Planning A atribui ao domínio de Build a declaração/evidência do workload closure produzido ou requerido; Deployment/Runtime é quem consome essa declaração e qualifica a operação efetiva. Nenhum dos dois deve absorver o outro.

## 14. O que o SB atual já demonstra — e o que ainda não demonstra

É importante separar visão de evidência.

**EVIDENCIADO NO SB ATUAL:** Planning B encontrou um assembler determinístico com resolução transitiva de dependências de capabilities, conflitos/ciclos explícitos, `AssemblyPlan` canônico e um compiler que normaliza entradas, produz arquivos com hashes, registra versões de compiler/runtime e materializa entrypoint, manifest, environment schema e migrations. Há testes de determinismo sobre o contrato sintético atual.

Isso é uma fundação relevante.

**ABERTO/INCONCLUSIVO:** o SB atual não demonstra ainda uma arquitetura geral de material identities, build recipe revision, hermeticity, cache qualification, runner/toolchain substitution ou uma prova generalizada de closure mínima distinguindo toda dependência authoring-only de toda dependência runtime-retained.

A distinção importa porque uma função determinística sobre inputs explícitos não prova, sozinha, que todo build futuro será reproduzível em qualquer máquina, provider ou horizonte temporal.

## 15. Reprodutibilidade ajuda a confiar na composição

Se o Builder afirma que determinada definição e closure produzem um artefato, queremos conseguir avaliar essa afirmação.

A pesquisa trata **reproducibilidade** como claim qualificada, não como adjetivo mágico. Dependendo do perfil, pode significar bytes idênticos ou equivalência semanticamente definida.

Para isso, precisamos conhecer mais que o código-fonte:

```text
source revision
+ dependency closure
+ build recipe
+ toolchain
+ target/platform
+ inputs externos declarados
+ constraints relevantes
→ output
```

Se algum input capaz de mudar o resultado estiver escondido, a claim enfraquece.

Esse assunto será aprofundado no Capítulo 10. Aqui basta entender sua relação com a composição: **não basta selecionar módulos; precisamos conseguir explicar o que entrou na materialização e por quê.**

## 16. Runtime autonomy e anti-lock-in se reforçam

Um runtime que depende continuamente do Builder para tarefas que poderiam estar fechadas localmente cria um tipo de lock-in operacional. Um runtime que embute semântica de um provider como se fosse verdade empresarial cria outro.

A direção G2 procura evitar ambos:

```text
Builder
  conhece possibilidades
  qualifica composição
  produz/materializa
       |
       v
Runtime
  preserva identidade/revisão
  retém closure necessária
  usa providers por bindings explícitos
  continua dentro do horizonte autorizado
```

Isso não elimina o relacionamento futuro com o Builder. O Builder ainda pode gerar novas revisões, apoiar evolução, observabilidade, suporte e migração. A diferença é entre **gerenciar a evolução** e **ser requisito oculto para cada execução empresarial**.

## 17. O perigo da falsa minimalidade

O runtime menor possível não é necessariamente o runtime correto.

Considere remover localmente uma policy engine para economizar recursos e confiar que a UI já esconde botões proibidos. O executável ficou menor, mas a closure de autorização foi destruída.

Ou remover trust material porque “a API normalmente responde”. O sistema pode iniciar e ainda assim não possuir condições para verificar a contraparte corretamente.

Por isso:

```text
minimalidade válida
= remover o que é desnecessário
  sem remover invariantes necessárias
```

Uma closure é definida pelo workload **e pelo perfil operacional**, não apenas pelo conjunto de imports que o programa executou num happy path.

## 18. O perigo oposto: closure inflada

Também existe risco em carregar tudo “por segurança”.

Uma closure inflada pode:

- aumentar superfície de ataque;
- ampliar atualização e patching;
- reter secrets ou permissões desnecessárias;
- aumentar tamanho e custo;
- criar dependências acidentais no Builder;
- dificultar provar o que é realmente necessário.

Least privilege vale também como intuição para dependências: reter somente capabilities, autoridade, dados e mecanismos necessários ao perfil ajuda a reduzir blast radius. Isso não significa que toda dependência opcional seja ruim; significa que sua presença deve ser justificável.

## 19. Cumulative context sem cumulative coupling

Há uma tensão importante.

Precisamos preservar contexto acumulado para não perder lineage. Mas não queremos que toda etapa conheça internamente todas as etapas anteriores.

O objetivo é:

```text
contexto suficiente
sem
acoplamento estrutural desnecessário
```

Um deployment não precisa conhecer o algoritmo interno do compiler. Precisa conhecer identidade/revisão do artefato, requisitos runtime, evidência aplicável e demais contratos necessários à sua decisão.

Essa diferença permite evolução independente. O compiler pode mudar internamente sem obrigar o runtime a incorporar sua implementação.

## 20. Como provar que a closure é boa?

Não existe uma única prova suficiente. Diferentes técnicas atacam falhas diferentes.

### Teste de remoção

**O que é:** retirar uma dependência alegadamente desnecessária e verificar se o workload continua satisfazendo o perfil.

**Detecta:** dependências realmente necessárias.

**Limitação:** um teste incompleto pode não percorrer o cenário que usa a dependência removida.

### Análise do grafo

**O que é:** verificar closure transitiva, ciclos, versões e constraints.

**Detecta:** dependência ausente, conflito de versão, ciclos incompatíveis e caminhos inesperados.

**Limitação:** só vê o que está representado no grafo; dependência escondida pode escapar.

### Rebuild/replay

**O que é:** reconstruir a partir da mesma identidade de inputs sob perfil controlado.

**Detecta:** inputs não controlados e claims de reprodutibilidade frágeis.

**Limitação:** uma repetição bem-sucedida não prova universalmente todos os ambientes futuros.

### Teste desconectado

**O que é:** retirar acesso ao Builder/control plane e verificar o comportamento permitido.

**Detecta:** cordão umbilical oculto.

**Limitação:** precisa respeitar o horizonte e o perfil; autonomia não significa operação offline infinita.

### Teste de substituição

**O que é:** trocar uma realização/provider por outra qualificada.

**Detecta:** semântica que vazou para uma implementação específica.

**Limitação:** dois providers não provam substituibilidade universal.

Essas técnicas serão aprofundadas nos capítulos de testes adversariais.

## 21. Um exemplo completo: sistema de manutenção

Vamos juntar as ideias.

A empresa modela:

```text
Solicitação
   ↓
Triagem
   ↓
OS
   ↓
Execução
   ├─ consumo de material
   ├─ horas do técnico
   └─ fotos/documentos
   ↓
Aceite
   ↓
Notificação
```

O Builder conhece muitas capabilities, mas a composição selecionada exige apenas o subconjunto aplicável. O resolver fecha dependências transitivas. Build produz os outputs e declara a closure runtime. Release e Deployment preservam suas próprias verdades. O runtime recebe apenas o que precisa para operar sob seu perfil.

Se a instalação for pequena, workflow, autorização e documentos podem morar no mesmo processo e banco. Se crescer, storage e jobs podem ser separados. O significado de OS, autorização e documento não deveria mudar só porque a topologia mudou.

Se o Builder ficar indisponível por algumas horas, a empresa continua trabalhando dentro da retained closure autorizada. Quando o Builder volta, reconcilia-se o que precisa ser reconciliado. Se uma policy ou trust material expirar durante a desconexão, autonomia não autoriza inventar validade nova.

Essa é a diferença entre **autonomia governada** e simplesmente “copiar o sistema e torcer para funcionar”.

## 22. Como este capítulo se conecta aos próximos

O Capítulo 05 poderá agora tratar Canvas e low-code como formas de compor um grafo sem precisar explicar do zero o que significa fechar dependências.

O Capítulo 06 aprofundará a execução: workflow, ações, eventos, formulários e integrações.

O Capítulo 10 voltará ao lado de build, artefatos, provenance e reprodutibilidade.

O Capítulo 11 aprofundará deployment, runtime autonomy, workload, readiness, scaling e topologia.

O Capítulo 12 retomará providers e substituição.

E os capítulos 17–20 mostrarão por que uma composição aparentemente válida pode falhar quando entram concorrência, partial effects, conflitos semânticos e técnicas adversariais.

## 23. O que você deve guardar deste capítulo

1. **O Builder pode conhecer muito mais do que cada runtime precisa carregar.** Essa assimetria é desejável quando preserva rastreabilidade e correção.
2. **Closure é fechamento de dependências.** Selecionar uma capability exige incluir as dependências transitivas e condicionais necessárias ao perfil.
3. **Minimal runtime closure não significa runtime incompleto.** O objetivo é remover dependências de autoria/build desnecessárias sem remover invariantes, autoridade, trust ou mecanismos necessários.
4. **Autonomia não é isolamento.** Um runtime autônomo pode usar providers externos; o importante é não depender ocultamente do Builder e operar dentro de uma retained closure qualificada.
5. **Topologia física e identidade semântica são dimensões diferentes.** Um sistema pequeno pode colapsar processos/hosts/bancos sem transformar todos os domínios em um único semantic owner.
6. **Build, release, deployment e runtime-effective truth são verdades diferentes.** Sucesso em uma etapa não prova automaticamente a próxima.
7. **Cumulative context preserva identidade, revisão, lineage e evidência necessárias sem exigir cumulative coupling.**
8. **O SB atual já possui uma base determinística relevante de assembly/compiler, mas a closure mínima generalizada continua uma fronteira de pesquisa/arquitetura futura.**

## Referências internas principais

Este capítulo sintetiza principalmente:

- `project_docs/generation-2/planning/PLANNING_A_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_BOUNDARIES.md`;
- `project_docs/generation-2/planning/PLANNING_B_BUILD_DEPENDENCY_GRAPH_REPRODUCIBILITY_SB_CURRENT_STATE.md`;
- `project_docs/generation-2/planning/PLANNING_A_DEPLOYMENT_ENVIRONMENT_RUNTIME_BOUNDARIES.md`;
- `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`;
- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`.

As referências acima são fontes de pesquisa/planejamento; este capítulo continua sendo apenas a camada editorial de compreensão.