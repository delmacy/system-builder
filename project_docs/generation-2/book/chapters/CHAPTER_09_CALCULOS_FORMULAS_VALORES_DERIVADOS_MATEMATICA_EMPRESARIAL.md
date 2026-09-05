# Capítulo 09 — Cálculos, fórmulas, valores derivados e matemática empresarial — v1.0.0

**ID editorial:** `CHAPTER_09`  
**Versão editorial:** `1.0.0`  
**Status:** `PUBLISHED`  
**Camada:** livro técnico-conceitual; não substitui pesquisa, síntese, Planning ou arquitetura alvo.

## Quando a conta está certa e o resultado ainda assim está errado

Imagine uma empresa que calcula automaticamente o custo de mão de obra de uma ordem de serviço. O sistema conhece o salário do técnico, encargos, benefícios, horas produtivas e tempo efetivamente trabalhado. A fórmula executa sem erro e produz `R$ 183,42`.

É tentador concluir: “o custo da OS é R$ 183,42”.

Mas ainda faltam perguntas importantes.

- Qual fórmula estava vigente quando o trabalho ocorreu?
- Os encargos usados eram os aplicáveis àquele período?
- O valor por hora deveria usar o custo atual ou o custo histórico?
- O tempo trabalhado estava em horas decimais, horas e minutos ou duração civil?
- Houve arredondamento intermediário?
- O resultado deveria ser apenas exibido ou materializado como fato contábil?
- Quem tinha autoridade para definir aquela fórmula?
- O motor de cálculo usou a mesma semântica de decimal, datas e valores ausentes esperada pelo negócio?

A conta pode estar numericamente correta e, ainda assim, ser **semanticamente inaplicável**.

Esse é o problema humano e empresarial deste capítulo: organizações usam cálculos o tempo todo, mas um número só adquire significado quando sabemos **o que foi calculado, com quais entradas, sob quais regras, em qual revisão, para qual finalidade e com qual autoridade**.

> **DECIDIDO:** a pesquisa matemática da Generation 2 foi encerrada com `KEEP_AS_CROSS_CUTTING_SUBCAPABILITY + PROVIDERIZE_MECHANICS_WITH_PORTABLE_SEMANTICS`. O G2 não criou uma 29ª capability canônica chamada “Calculation”. A semântica portátil de cálculo é transversal; o significado de cada fórmula continua pertencendo ao seu semantic owner.

Referências autoritativas principais: `research/MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION_INCREMENT_3_FINAL_RECONCILIATION.md`, `synthesis/MATHEMATICAL_CALCULATION_BOUNDED_SYNTHESIS_BACKFILL.md` e `planning/PLANNING_A_MATHEMATICAL_CALCULATION_BOUNDED_BOUNDARY_BACKFILL.md`.

---

## 1. O primeiro corte: StoredFact não é DerivedValue

Uma das distinções mais importantes da pesquisa é:

```text
StoredFact != DerivedValue
```

Um **StoredFact** é um fato persistido que determinado semantic owner reconhece como canônico dentro de seu domínio.

Um **DerivedValue** é um valor obtido por derivação a partir de outros valores, regras e contexto.

Exemplo:

```text
salário_base = R$ 4.000,00          -> StoredFact
encargos = R$ 1.600,00              -> StoredFact
benefícios = R$ 600,00              -> StoredFact
horas_produtivas = 160 h            -> StoredFact ou parâmetro revisionado

custo_hora = (4000 + 1600 + 600) / 160
           = R$ 38,75/h             -> DerivedValue
```

O fato de `R$ 38,75/h` ter sido calculado corretamente não significa automaticamente que ele deva ser gravado como verdade histórica, usado em faturamento ou acionado como condição de aprovação.

A passagem:

```text
DerivedValue
    ↓
StoredFact
```

é uma **materialização**. E materialização é uma decisão semântica/governada, não um efeito colateral inevitável de executar uma expressão.

### Exemplo didático: campo calculado em formulário

Em um formulário de orçamento:

```text
quantidade = 3
preço_unitário = R$ 125,00
subtotal = quantidade × preço_unitário
```

`subtotal` pode ser calculado ao vivo apenas para ajudar o usuário. Nesse caso, ele pode nunca precisar existir como fato persistido independente.

Já em uma nota fiscal emitida, o valor histórico pode precisar ser preservado com a fórmula/regras e contexto aplicáveis naquele instante. O mesmo número muda de papel conforme sua finalidade.

---

## 2. Fórmula não é resultado

Outra distinção fundamental:

```text
FormulaDefinition != FormulaEvaluation != CalculationResult
```

### FormulaDefinition

A **FormulaDefinition** descreve o que deve ser calculado.

Exemplo simplificado:

```text
custo_hora =
  (salario + encargos + beneficios + overhead_alocado)
  / horas_produtivas
```

### FormulaEvaluation

A **FormulaEvaluation** é uma execução concreta dessa definição com inputs e contexto concretos.

```text
Formula: custo_hora@rev7
salario: 4000.00
encargos: 1600.00
beneficios: 600.00
overhead: 200.00
horas_produtivas: 160
```

### CalculationResult

O **CalculationResult** é o resultado produzido por essa avaliação, junto de evidência suficiente para interpretar sua origem quando necessário.

```text
resultado: 40.00 BRL/h
formula_revision: rev7
input_revision_set: ...
rounding_policy: ...
evaluation_profile: ...
```

Um número solto como `40.00` é pobre semanticamente. Pode representar reais, dólares, horas, percentual, quantidade, índice ou apenas um intermediário.

---

## 3. O significado da fórmula pertence ao domínio, não ao motor

Suponha que a empresa tenha três fórmulas:

1. custo de mão de obra;
2. comissão de vendas;
3. custo unitário de infraestrutura de TI.

Todas podem usar operações matemáticas semelhantes. Porém seus significados pertencem a owners distintos.

```text
Custo de mão de obra  -> owner empresarial correspondente
Comissão              -> Commercial / domínio comercial
Custo unitário de TI  -> FinOps / Technology Economic Governance
```

O motor de cálculo pode saber multiplicar, dividir, trabalhar com decimal, unidades e datas. Ele não deve decidir sozinho:

- o que “comissão” significa;
- qual base deve ser usada;
- quem tem direito à comissão;
- quando o valor se torna devido;
- qual política de custo é aceita pela empresa.

Isso evita o que poderíamos chamar de **calculation god-object**: um componente genérico que, por executar fórmulas, passa a concentrar semântica de todos os domínios.

> **DECIDIDO:** a UCA pode fornecer primitivas portáteis de cálculo. Process/Application, Workflow, Data, UI/AGWS, Commercial, FinOps e owners específicos continuam responsáveis pelo significado, pelas entradas permitidas, pela aplicabilidade e pelas consequências de suas fórmulas.

---

## 4. A identidade de uma fórmula precisa sobreviver ao provider

Se uma fórmula é criada em um provider A e depois migrada para um provider B, o System Builder não pode concluir que a identidade empresarial da fórmula é o ID interno do provider.

```text
Provider A:
  expression_id = fx_9831

Provider B:
  rule_id = calc-77
```

Esses IDs identificam realizações. Não são necessariamente a identidade canônica da fórmula.

A pesquisa preserva:

```text
provider/expression-engine identity
    !=
canonical formula identity
```

Isso é essencial para anti-lock-in e para histórico.

Se uma OS histórica foi calculada com `custo_hora@rev7`, ainda precisamos saber qual revisão semântica foi usada mesmo que o engine original já não exista.

---

## 5. FormulaRevision: fórmulas também evoluem

Empresas mudam regras.

Imagine que até junho o custo-hora incluía:

```text
salário + encargos + benefícios
```

A partir de julho, a empresa decide incluir overhead administrativo rateado:

```text
salário + encargos + benefícios + overhead
```

Não existe apenas “a fórmula atual”. Existem pelo menos duas revisões:

```text
custo_hora@rev1
custo_hora@rev2
```

Daí surge outra distinção:

```text
CurrentFormula != HistoricallyApplicableFormula
```

Recalcular uma OS de maio usando automaticamente `rev2` pode reescrever a história econômica do negócio.

### HistoricalApplicability

**HistoricalApplicability** é a relação que permite saber qual revisão de fórmula e quais revisões contextuais eram aplicáveis a determinado cálculo ou registro.

Um resultado histórico relevante pode depender de um vetor como:

```text
formula_revision
input_revisions
calendar_revision
timezone_rule_revision
currency/rate_revision
rounding_policy_revision
provider_semantic_profile
```

O capítulo 2 já introduziu revision vectors. Aqui vemos por que eles importam concretamente: matemática empresarial também vive em um mundo versionado.

---

## 6. Recalcular ao vivo e preservar um snapshot são decisões diferentes

Há dois comportamentos legítimos e muito diferentes.

### Live recomputation

O valor é recalculado sempre que inputs ou contexto mudam.

Exemplo:

```text
estoque_disponivel = estoque_total - estoque_reservado
```

Pode ser útil mostrar o valor atual continuamente.

### Historical snapshot

O resultado é preservado como evidência histórica do que foi calculado sob determinado contexto.

Exemplo:

```text
custo_mao_de_obra_da_OS_no_fechamento
```

Se salários e políticas mudarem depois, o resultado histórico não deve necessariamente mudar.

Portanto:

```text
live recomputation != historical snapshot
```

E também:

```text
latest formula != historical replay rule
```

Um replay histórico precisa reconstituir o contexto aplicável, não simplesmente executar a lógica mais nova.

---

## 7. Números não são apenas números

Computadores oferecem vários modelos numéricos. Eles não são semanticamente equivalentes.

Uma diferença especialmente importante é entre **aritmética decimal exata** e aproximações binárias de ponto flutuante.

Para ciência gráfica ou certos cálculos numéricos, pequenas aproximações podem ser aceitáveis. Para dinheiro e regras empresariais, podem não ser.

Exemplo conceitual:

```text
R$ 0,10 + R$ 0,20
```

Humanamente esperamos `R$ 0,30`. Um engine cuja representação interna não preserve exatamente certos decimais pode produzir uma aproximação binária que precisa ser tratada adequadamente.

> **DECIDIDO:** semântica de dinheiro/decimal não deve ser herdada silenciosamente do provider.

A pesquisa analisou motores com modelos distintos e concluiu que portabilidade exige contrato semântico explícito, não apenas compatibilidade de sintaxe.

---

## 8. Money não é apenas Decimal

Um valor monetário precisa preservar moeda.

```text
100.00 BRL
100.00 USD
```

Têm a mesma magnitude decimal, mas não o mesmo significado.

Uma representação útil conceitualmente é:

```text
CurrencyAmount {
  amount
  currency
}
```

Isso evita operações semanticamente absurdas como:

```text
100 BRL + 100 USD = 200 ???
```

Se houver conversão cambial, entram novas dependências:

```text
taxa
fonte da taxa
momento de referência
par de moedas
política de arredondamento
revisão aplicável
```

Novamente, cálculo correto exige contexto.

---

## 9. Percentage, Rate e Ratio também carregam significado

Os valores `10%`, `0,10` e `10` podem representar coisas completamente diferentes.

Uma comissão de 10% pode ser aplicada sobre:

- receita bruta;
- receita líquida;
- margem;
- parcela recebida;
- valor do contrato sem impostos.

O cálculo:

```text
base × 0,10
```

não define o que é `base`.

Esse significado pertence ao semantic owner da regra comercial.

O cálculo portátil precisa garantir que tipos, escala, precisão e operações sejam previsíveis; não deve inventar política de negócio.

---

## 10. Unidades de medida impedem erros silenciosos

Considere:

```text
comprimento = 12
```

Doze o quê?

- metros?
- centímetros?
- quilômetros?
- polegadas?

Em sistemas empresariais, unidade faz parte da semântica do valor.

```text
12 m != 12 cm
```

Uma **UnitOfMeasure** ajuda a tornar dimensionalidade explícita.

Exemplo de estoque:

```text
cabo_em_estoque = 800 m
consumo_da_OS = 250 m
saldo = 550 m
```

Já isto deveria exigir conversão qualificada ou rejeição:

```text
800 m - 250 kg
```

A validação de unidade reduz uma classe inteira de erros em estoque, manutenção, logística, energia e engenharia.

---

## 11. Tempo é uma das matemáticas mais traiçoeiras do negócio

A frase “somar um dia” parece simples. Tecnicamente, pode significar coisas distintas.

### Duração baseada em tempo

```text
24 horas exatas
```

### Período baseado em calendário

```text
mesmo horário local no dia seguinte
```

Esses significados podem divergir em mudanças de horário civil, especialmente em zonas com regras de daylight saving time (DST).

A pesquisa concluiu que cálculo temporal portátil precisa poder distinguir, quando material:

- instant;
- data/hora local;
- timezone identity;
- offset;
- período baseado em data;
- duração baseada em tempo;
- revisão de calendário empresarial;
- inclusão/exclusão de prazo;
- resolução de gaps/overlaps de DST;
- versão/currentness da base de regras de timezone quando exigida para reprodução histórica.

### Exemplo: SLA empresarial

Uma OS aberta sexta-feira às 16h tem SLA de “8 horas úteis”.

Isso não equivale necessariamente a:

```text
timestamp + 8h
```

Pode depender de:

```text
calendário da Station
feriados
expediente
fuso horário
intervalos de trabalho
regra de inclusividade
revisão do calendário
```

O motor calcula. O domínio define o significado do prazo.

---

## 12. RoundingPolicy: arredondamento é política, não detalhe cosmético

Considere:

```text
10 / 3 = 3,333333...
```

Se o resultado for dinheiro, precisamos decidir:

- quantas casas?
- em que ponto arredondar?
- qual modo de arredondamento?
- arredondar cada item ou somente o total?

Exemplo:

```text
3 itens × R$ 0,335
```

Pode haver diferença entre:

```text
round(0,335) × 3
```

e

```text
round(0,335 × 3)
```

Uma diferença de centavos pode parecer pequena, mas em milhões de operações ela se torna material; além disso, certas políticas fiscais ou contratuais exigem regras específicas.

Por isso a pesquisa inclui **RoundingPolicy** como primitiva candidata do contrato portátil.

---

## 13. Missing, Null, Unknown e Error não são a mesma coisa

Um dos resultados importantes da pesquisa foi a constatação de que motores maduros divergem muito no tratamento de ausência e falha.

A G2 preserva conceitualmente:

```text
Missing != Null != Unknown != Error
```

### Missing

O valor esperado não foi fornecido ou não existe no contexto.

### Null

O valor existe conceitualmente, mas está explicitamente sem conteúdo conforme o contrato.

### Unknown

Não há evidência suficiente para determinar o valor naquele momento.

### Error

A avaliação encontrou uma falha definida: tipo incompatível, divisão inválida, overflow, função proibida, limite de recurso etc.

### Por que isso importa

Imagine uma regra de aprovação:

```text
if valor_total > 10000 then exigir_aprovacao_superior
```

Se `valor_total` estiver `Unknown`, convertê-lo silenciosamente para `0` pode eliminar uma aprovação obrigatória.

Portanto:

```text
Unknown -> 0
```

não é uma conversão inocente. É uma decisão semântica e potencialmente uma vulnerabilidade de governança.

> **DECIDIDO:** Missing, Null, Unknown e Error permanecem distintos, salvo política explícita, revisionada e pertencente ao semantic owner que autorize uma coerção específica.

---

## 14. EvaluationContext: fórmula não deve enxergar tudo

Uma expressão precisa receber valores. Isso não significa que deva ganhar acesso irrestrito ao sistema.

O **EvaluationContext** representa o conjunto de inputs e contexto explicitamente admitidos para uma avaliação.

```text
EvaluationContext
  ├─ valores de entrada autorizados
  ├─ contexto temporal
  ├─ unidades/moedas
  ├─ revisions aplicáveis
  └─ funções admitidas
```

A fronteira de segurança da pesquisa é clara: um avaliador genérico não deve, por padrão,

- consultar qualquer tabela;
- acessar secrets;
- chamar rede;
- escrever arquivos;
- executar código arbitrário;
- disparar workflow;
- aprovar trabalho;
- criar entitlement;
- alterar estado empresarial.

Em outras palavras:

```text
Calculation success != Authorization
```

E também:

```text
Formula evaluation != Generic action engine
```

---

## 15. Pure evaluation e side effects

Uma expressão como:

```text
subtotal = quantidade * preco
```

é conceitualmente pura: recebe inputs e produz output.

Uma expressão que faz:

```text
se total > 10000:
    aprovar_pagamento()
```

já mistura avaliação com side effect.

A pesquisa deliberadamente evita transformar cálculo em escape hatch para scripts mutantes.

O padrão mental preferido é:

```text
calcular condição
      ↓
retornar TypedValue / condição qualificada
      ↓
outro semantic owner decide consequência
      ↓
autorização é verificada
      ↓
efeito é executado e qualificado
```

Isso conecta este capítulo aos capítulos 6 e 7: Workflow pode consumir uma condição; Authorization continua decidindo autoridade; Integration pode executar efeito externo; nenhum desses owners é substituído pelo avaliador matemático.

---

## 16. FormulaDependencyGraph: fórmulas formam grafos

Valores derivados frequentemente dependem de outros valores derivados.

```text
salario
   ├─> custo_hora
   │      └─> custo_OS
   └─> custo_mensal_equipe
```

A pesquisa chama essa estrutura de **FormulaDependencyGraph**.

Esse grafo serve para responder:

- o que precisa ser recalculado quando uma entrada muda?
- em qual ordem?
- quais resultados dependem de uma fórmula alterada?
- existe ciclo?
- qual blast radius de uma revisão?

### Exemplo

```text
A = B + 1
B = C * 2
C = 10
```

A ordem natural é:

```text
C -> B -> A
```

Se `C` muda, `B` e `A` podem precisar ser reavaliados conforme a materialization policy.

---

## 17. Circularidade: nem todo grafo de fórmulas converge

Considere:

```text
A = B + 1
B = A + 1
```

Temos um ciclo.

Para cálculo empresarial genérico, a pesquisa adota **aciclicidade por padrão**. Ciclos acidentais devem falhar validação.

Isso não significa que matemática iterativa, otimização ou fixed-point computation sejam impossíveis em computação. Significa apenas que são semânticas especializadas demais para serem assumidas silenciosamente por um contrato genérico.

Se algum domínio realmente precisar de iteração, ele deve explicitar:

- owner;
- regra de convergência;
- tolerância;
- número máximo de iterações;
- comportamento quando não converge;
- limites de recurso.

A analogia com um fluxograma deixa de valer aqui: em um workflow, um ciclo pode representar repetir uma atividade empresarial legítima. Num grafo de dependência de fórmulas, um ciclo pode tornar a própria definição do valor indeterminada ou exigir semântica matemática especializada.

---

## 18. MaterializationPolicy: quando o derivado vira persistência

Nem todo DerivedValue deve ser armazenado.

A **MaterializationPolicy** responde questões como:

- resultado é apenas virtual?
- deve ser persistido?
- quando?
- sob qual owner?
- pode ser recalculado?
- é snapshot histórico?
- mudança de input invalida o resultado antigo?
- mudança de fórmula afeta registros existentes?

Exemplos:

### Campo puramente derivado

```text
nome_completo = nome + sobrenome
```

Pode ser calculado sob demanda.

### Resultado histórico

```text
valor_final_faturado
```

Pode precisar ser preservado com lineage.

### Cache materializado

```text
saldo_agregado_para_dashboard
```

Pode ser persistido por desempenho, mas continuar sendo um derivado reconstruível.

Esses três casos não deveriam ser confundidos só porque todos aparecem como “colunas” em um banco.

---

## 19. CalculationEvidence: por que um resultado precisa explicar sua origem

Para certos usos, guardar apenas o resultado é insuficiente.

Uma **CalculationEvidence** pode precisar preservar, conforme materialidade:

```text
formula_identity
formula_revision
input identities/revisions
context revisions
rounding policy
temporal/calendar policy
provider semantic profile
result disposition
resource-limit/error disposition
```

Isso ajuda auditoria, replay, explicabilidade e comparação entre providers.

### Exemplo de auditoria

Um gerente pergunta:

> “Por que essa OS custou R$ 1.842,37 em março se hoje a mesma quantidade de horas resulta em R$ 2.014,10?”

Uma resposta confiável não deveria ser “porque a fórmula deu isso”.

Ela deveria conseguir explicar que março usou, por exemplo:

```text
custo_hora@rev4
salário@rev12
encargos@rev8
calendário@rev3
rounding_policy@rev2
```

Enquanto o cálculo atual usa revisões posteriores.

---

## 20. Provider-neutral não significa que todos os engines são equivalentes

A G2 quer evitar lock-in, mas isso não autoriza fingir que todos os motores de expressão têm a mesma semântica.

A pesquisa comparou famílias como DMN/FEEL, CEL, Power Fx, PostgreSQL, JSONata e outras referências. Elas divergem em pontos como:

- tipos numéricos;
- decimal versus floating point;
- null/error/unknown;
- funções;
- temporalidade;
- recursos permitidos;
- avaliação parcial;
- dependências;
- evidência;
- sandboxing.

Portanto:

```text
Parser compatibility != Semantic compatibility
```

E:

```text
same formula text != same business result semantics
```

---

## 21. ProviderSemanticProfile e corpus de conformidade

Para substituir um engine de cálculo, a pesquisa propõe que a realização seja qualificada contra um perfil semântico declarado.

Um **ProviderSemanticProfile** descreve o conjunto de semânticas relevantes que o provider consegue realizar.

A qualificação não deve ser binária. Ela pode resultar em:

```text
SUPPORTED
PARTIAL
UNSUPPORTED
INCONCLUSIVE
```

O corpus mínimo pesquisado cobre famílias como:

```text
Numeric
Failure algebra
Money/rates
Units
Temporal
Dependency/recomputation
Revision/history
Security
Resource bounds
Evidence
Runtime mode
```

Isso conecta diretamente ao Capítulo 3: Provider/Binding possui qualificação, admissão, binding, substituição e withdrawal da realização; não absorve o significado empresarial da fórmula.

---

## 22. Limites de recurso fazem parte da semântica operacional

Uma fórmula pode ser pura e ainda consumir recursos demais.

Considere uma expressão criada por low-code ou IA que percorra coleções enormes, componha milhares de dependências ou gere output gigantesco.

Por isso uma **EvaluationPolicy** precisa poder limitar, conforme perfil:

- tamanho/profundidade da expressão;
- cardinalidade de inputs;
- custo de iteração/comprehension;
- nós/arestas/profundidade do DAG;
- tempo/custo de avaliação;
- memória;
- tamanho de output;
- cardinalidade de batch.

Quando um limite é ultrapassado, o resultado deve ser uma falha tipada.

Um cálculo interrompido pela metade não pode ser silenciosamente promovido a verdade completa.

```text
partial computation != authoritative CalculationResult
```

Em bulk evaluation, resultados individuais podem ter disposições próprias, mas ausência de resultado não deve virar zero ou sucesso por conveniência.

---

## 23. Exemplo integrado: custo horário de mão de obra

Vamos montar um exemplo mais completo.

### Inputs

```text
salario_base = 4.500,00 BRL/mês
encargos = 1.800,00 BRL/mês
beneficios = 700,00 BRL/mês
overhead_alocado = 500,00 BRL/mês
horas_produtivas = 160 h/mês
```

### Fórmula

```text
custo_hora =
  (salario_base + encargos + beneficios + overhead_alocado)
  / horas_produtivas
```

### Resultado

```text
7.500 / 160 = 46,875 BRL/h
```

Agora começam as decisões empresariais:

- armazenar `46,875` ou arredondar para `46,88`?
- arredondar custo-hora antes de multiplicar pelas horas da OS?
- usar horas produtivas fixas ou calendário real?
- usar salário do mês atual ou do período executado?
- recalcular OS antigas se encargos forem corrigidos retroativamente?
- qual owner define a política?

A fórmula aritmética é a parte fácil. O significado histórico e governado é a parte difícil.

---

## 24. Exemplo integrado: custo de mão de obra de uma OS

Suponha uma OS executada durante `3 h 40 min`.

Primeiro precisamos decidir como representar duração.

```text
3 h 40 min = 3 + 40/60
           = 3,666666... h
```

Com custo-hora de `46,875 BRL/h`:

```text
3,666666... × 46,875 = 171,875 BRL
```

Dependendo da política:

```text
R$ 171,88
```

Mas um histórico confiável precisa vincular:

```text
OS revision
worked-duration evidence
hourly-cost formula revision
salary/charge revisions
rounding policy
materialization policy
```

Se o custo-hora mudou uma semana depois, isso não deveria apagar a razão pela qual aquela OS teve determinado custo na data de fechamento.

---

## 25. Exemplo: estoque e avaliação

Estoque introduz outro tipo de dificuldade.

Quantidade física:

```text
100 unidades
```

Valor do estoque:

```text
?
```

Pode depender de uma política de avaliação, como média ponderada ou outra regra empresarial/contábil admitida.

A pesquisa não transformou o cálculo em owner da política contábil.

O avaliador pode fornecer matemática tipada; quem define **qual método representa a verdade empresarial** é o domínio competente.

Isso preserva:

```text
Calculation mechanics != Accounting policy
```

---

## 26. Exemplo: aprovação por valor calculado

Workflow pode possuir uma transição:

```text
se valor_total > R$ 50.000
    exigir aprovação adicional
```

A condição usa cálculo, mas o owner da transição continua Workflow/Process conforme a fronteira aplicável.

Além disso:

```text
Condition true != Approval granted
```

A condição apenas determina elegibilidade de caminho. A pessoa ainda precisa possuir autoridade para aprovar.

Isso conecta matemática, workflow e autorização sem fundi-los.

---

## 27. Exemplo: comissão

Suponha:

```text
comissao = receita_liquida * taxa_comissao
```

`taxa_comissao = 5%`.

Ainda precisamos saber:

- receita líquida de quê?
- em qual período?
- após quais descontos?
- venda cancelada reduz comissão?
- pagamento parcelado materializa tudo imediatamente?
- taxa depende da Role, produto ou faixa?

Essas perguntas são comerciais, não do engine matemático.

O motor precisa apenas executar a semântica matemática qualificada que o owner declarou.

---

## 28. Fórmulas geradas por IA: ajuda sem autoridade

Uma IA pode sugerir:

```text
custo_hora = (salario + encargos + beneficios) / horas_produtivas
```

Isso pode ser útil. Mas a IA pode omitir overhead, usar horas erradas ou interpretar `encargos` de forma diferente da empresa.

Portanto:

```text
AI-generated formula != Adopted formula revision
```

A pesquisa exige que autoria por IA/low-code continue submetida a:

- type checking;
- validação de dependências/ciclos;
- validação de semantic profile;
- autoridade de autoria/materialização;
- provenance revisionada.

Além disso, `Enterprise → Station → Role → Person` pode restringir quais fórmulas, funções e dados ficam disponíveis. Camadas inferiores não podem ampliar autoridade definida acima.

---

## 29. O que o cálculo portátil deliberadamente não deve virar

A decisão de tornar a matemática uma subcapability transversal possui limites importantes.

Ela não significa criar um motor universal para:

- scripts arbitrários;
- ações mutantes;
- autorização;
- workflows;
- otimização;
- machine learning;
- simulação;
- criptografia;
- regras contábeis globais;
- política comercial global;
- analytics como owner semântico.

Essas áreas podem consumir primitivas matemáticas, mas mantêm seus próprios owners ou providers especializados.

---

## 30. Como esta parte se conecta aos outros capítulos

### Capítulo 2 — empresa versionada

Fórmulas, inputs e contexto evoluem de forma independente. Histórico confiável exige revision vectors e applicability.

### Capítulo 3 — Capability, Provider, Binding e Semantic Owner

O semantic owner define significado; provider realiza avaliação; binding qualifica a realização.

### Capítulo 5 — Low-code e Canvas

Um editor pode facilitar autoria de fórmulas, mas sintaxe válida não garante semântica, aplicabilidade ou autoridade.

### Capítulo 6 — Workflow

Workflow pode usar condições calculadas, mas o cálculo não possui a progressão durável nem a autoridade de efeitos.

### Capítulo 7 — Identidade e autorização

Quem pode criar, alterar, publicar ou materializar uma fórmula é uma questão de autoridade.

### Capítulo 8 — Dados e schema

StoredFacts alimentam DerivedValues; materialização de derivados precisa preservar owner, schema, lineage e governança.

### Capítulos futuros

Build e releases precisarão carregar definições/revisões e provenance; lifecycle precisará tratar coexistência; observabilidade precisará explicar resultados; segurança limitará evaluation contexts; Commercial e FinOps usarão matemática sem entregar a ela sua semântica.

---

## 31. Técnicas de prova para cálculos empresariais

A pesquisa não se limita a “testar alguns exemplos”. Existem classes específicas de prova.

### 31.1 Golden examples

**O que é:** casos conhecidos com resultado esperado.

**Detecta:** erro básico de expressão, arredondamento ou tipos.

**Limitação:** cobre apenas os exemplos escolhidos.

**Aplicação ao SB:** custos, comissão, SLA, estoque, percentuais e derivados de formulário.

### 31.2 Property-based testing

**O que é:** testar propriedades gerais sobre muitos inputs gerados.

Exemplo:

```text
para quantidade >= 0 e preço >= 0:
subtotal >= 0
```

**Detecta:** combinações não antecipadas manualmente.

**Limitação:** a propriedade pode estar errada ou incompleta.

### 31.3 Differential/provider conformance

**O que é:** executar um corpus semanticamente definido em providers diferentes.

**Detecta:** divergências de decimal, null, datas, funções, rounding e limites.

**Limitação:** dois providers concordarem não prova que ambos implementam a política empresarial correta.

### 31.4 Dependency/cycle analysis

**O que é:** analisar o grafo de dependências das fórmulas.

**Detecta:** ciclos, dependências ausentes e blast radius de mudança.

**Limitação:** não prova por si só que a fórmula possui significado correto.

### 31.5 Historical replay

**O que é:** reconstruir um cálculo com revisão e contexto históricos.

**Detecta:** perda de lineage, adoção indevida de `latest` e dependências temporais não capturadas.

**Limitação:** depende de evidência histórica suficiente.

### 31.6 Resource-bound testing

**O que é:** testar tamanhos, profundidades e workloads próximos dos limites.

**Detecta:** exaustão, explosão de DAG, batches parciais e comportamento de cancelamento.

**Limitação:** limites operacionais podem mudar por perfil e provider.

---

## 32. O que está decidido, o que está em pesquisa e o que não deve ser confundido

### DECIDIDO

- não haverá 29ª capability canônica de cálculo decorrente da pesquisa matemática fechada;
- a matemática é uma subcapability transversal de semântica portátil sob a UCA;
- evaluator mechanics podem ser providerizadas;
- semantic owners mantêm o significado das fórmulas;
- `StoredFact != DerivedValue`;
- `FormulaDefinition != FormulaEvaluation`;
- `FormulaRevision != CalculationResult`;
- live recomputation e snapshot histórico são distintos;
- identidade do provider não é identidade canônica da fórmula;
- Missing, Null, Unknown e Error não devem ser colapsados silenciosamente;
- avaliação genérica não deve virar ação mutante ou amplificação de autoridade.

### EM PESQUISA

A campanha adversarial geral da Generation 2 continua ativa. Isso significa que conflitos de composição envolvendo fórmulas, workflow, schema, policy, providers, lifecycle, IA e efeitos ainda podem produzir novas revisões editoriais deste capítulo.

### ABERTO/INCONCLUSIVO

A arquitetura alvo concreta de runtime, armazenamento, APIs, componentes e contracts finais ainda pertence às fases posteriores. Este capítulo explica conhecimento consolidado e fronteiras; não materializa Planning C.

---

## 33. Um mapa mental compacto

```text
                    SEMANTIC OWNER
                         │
                         │ define significado,
                         │ inputs, aplicabilidade,
                         │ consequência
                         ▼
                 FormulaDefinition
                         │
                  FormulaRevision
                         │
                         ▼
                EvaluationContext
                 /      |       \
          TypedValue  Units   Time/Money
                 \      |       /
                  \     |      /
                   ▼    ▼     ▼
                   EVALUATOR
                   PROVIDER
                      │
              ProviderSemanticProfile
                      │
                      ▼
               CalculationResult
                      │
             CalculationEvidence
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   Live DerivedValue       Historical Snapshot
                                  │
                         MaterializationPolicy
                                  │
                                  ▼
                   possível StoredFact canônico
                   sob owner/autoridade aplicáveis
```

O diagrama mostra por que “ter um motor de fórmula” resolve apenas uma parte do problema.

---

## O que você deve guardar deste capítulo

1. **Um cálculo correto não é automaticamente uma verdade empresarial.** Significado, aplicabilidade, revisão e autoridade importam tanto quanto a aritmética.
2. **`StoredFact != DerivedValue`.** Transformar um derivado em fato persistido é uma decisão governada de materialização.
3. **Fórmula, avaliação e resultado são identidades diferentes.** Resultados históricos precisam de lineage suficiente para explicar como foram produzidos.
4. **A fórmula atual não deve reescrever silenciosamente a história.** Historical applicability exige a revisão que realmente se aplicava ao registro e ao contexto.
5. **Dinheiro, unidades, percentuais e tempo carregam tipos e políticas.** Eles não devem ser reduzidos a números sem contexto.
6. **Missing, Null, Unknown e Error são diferentes.** Coerções silenciosas podem alterar aprovações, billing e controles.
7. **Grafo de dependências, ciclos e limites de recurso fazem parte da segurança operacional do cálculo.**
8. **Provider-neutral não significa provider-equivalent.** Substituição exige qualificação semântica, não apenas parser compatível.
9. **O motor não possui a semântica de todos os domínios.** Commercial, FinOps, Workflow, Data e outros owners continuam responsáveis pelo que suas fórmulas significam.
10. **IA e low-code podem propor matemática; não recebem autoridade para transformar proposta em verdade.**

A Generation 2 trata matemática empresarial não como uma calculadora escondida dentro de cada módulo, mas como um vocabulário portátil de avaliação que diferentes semantic owners podem reutilizar sem perder seu significado, histórico ou autoridade.