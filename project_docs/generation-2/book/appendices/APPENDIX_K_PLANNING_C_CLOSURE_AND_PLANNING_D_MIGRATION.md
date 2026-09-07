# Apêndice K — Quando a arquitetura alvo fecha e começa o problema da migração

**Camada:** compreensão e síntese editorial; não substitui Planning C ou Planning D.  
**Data editorial:** 2026-09-07  
**Estado autoritativo consultado:** Planning C `CLOSED / PASS`; Planning D `ACTIVE / OPEN`, com D0 e D1 `CLOSED / PASS`.

> `ChapterVersion != ArchitectureRevision != SystemRevision`.

## 1. O problema humano: decidir o destino não move a empresa até ele

Há uma diferença importante entre saber **como o sistema deveria ser** e saber **como chegar até esse sistema sem destruir o que já funciona**.

É semelhante a reformar uma empresa que continua aberta. A planta final do prédio pode estar aprovada, mas ainda faltam perguntas operacionais: qual parede pode ser removida primeiro? O setor continua funcionando durante a obra? O sistema antigo e o novo coexistem por quanto tempo? Como sabemos quais usuários, dados, providers ou runtimes já migraram? O que acontece quando metade da população está no estado novo e metade ainda depende do antigo?

Essa é a mudança de fase que a Generation 2 acaba de atravessar.

**DECIDIDO:** Planning C foi encerrado como `CLOSED / PASS` depois da reconciliação anti-stale de C0, C1, C2 e C3.1–C3.28. Isso significa que as decisões locais de arquitetura alvo foram reavaliadas transversalmente e consideradas coerentes para o gate de Planning C.

Isso **não** significa que a G2 esteja pronta para Construction.

```text
pesquisa e síntese
      ↓
boundaries / owners
      ↓
Planning C
arquitetura alvo coerente
      ↓
Planning D
como migrar e em que dependências
      ↓
Planning E
como provar produto/aceitação
      ↓
fases posteriores de decomposição e construção
```

A nova pergunta é: **como transformar o SB existente na arquitetura alvo preservando semântica, autoridade, dados, operação e capacidade de retorno durante a transição?**

## 2. O fechamento de Planning C não foi apenas “28 arquivos concluídos”

Durante C3, cada capability recebeu uma decisão de arquitetura alvo. Mas vinte e oito decisões individualmente razoáveis ainda poderiam formar um conjunto contraditório.

Por isso o fechamento exigiu uma **reconciliação transversal anti-stale**.

O termo *anti-stale* significa, aqui, evitar que uma decisão antiga permaneça sendo tratada como atual depois que decisões posteriores mudaram o contexto em que ela foi tomada.

**EXEMPLO DIDÁTICO:** suponha que uma decisão inicial descreva autorização sem considerar uma primitive de currentness que só foi consolidada posteriormente em Trust, Observability ou Lifecycle. A decisão inicial não pode ser considerada automaticamente válida apenas porque já havia recebido `PASS`. O fechamento precisa confrontá-la com o conjunto mais novo.

Assim:

```text
28 decisões locais
        !=
28 decisões automaticamente coerentes

28 decisões locais
        +
reconciliação cross-decision
        ↓
Planning C CLOSED / PASS
```

A consequência pedagógica é importante: **completude enumerativa não é coerência arquitetural**.

## 3. Arquitetura alvo não é estratégia de migração

Uma arquitetura alvo descreve responsabilidades, contratos, owners, primitives, planos de verdade e relações que o sistema deve preservar.

Uma estratégia de migração precisa acrescentar tempo.

Ela pergunta:

- o que precisa existir antes de outra coisa;
- quais componentes antigos e novos precisam coexistir;
- quando uma população pode entrar em shadowing;
- quando um cutover é admissível;
- como detectar cohorts residuais;
- quando rollback ainda é semanticamente possível;
- quando apenas roll-forward ou reconciliação manual permanecem seguros;
- que evidência prova que a transição realmente ocorreu.

Portanto:

`TargetArchitecture != MigrationStrategy`.

Essa desigualdade evita um erro recorrente em modernizações: desenhar corretamente o estado final e tratar a passagem entre os estados como simples sequência de deploys.

## 4. D0: migração como grafo de pré-requisitos, não como lista cronológica

**DECIDIDO:** Planning D0 estabeleceu uma constituição de migração e um grafo transversal de dependências.

O ponto central é que dependência de migração não significa apenas “pacote A importa pacote B”. Existem tipos diferentes de pré-requisito, porque sistemas empresariais dependem de mais do que código.

O vocabulário autoritativo de Planning D inclui, entre outros:

- `SEMANTIC_PREREQUISITE` — um significado precisa estar definido/adotado antes;
- `AUTHORITY_PREREQUISITE` — a autoridade necessária precisa estar válida;
- `REVISION_PREREQUISITE` — determinada revisão precisa ser conhecida/aplicável;
- `EVIDENCE_PREREQUISITE` — é necessário possuir evidência qualificada antes de avançar;
- `PROVIDER_PREREQUISITE` — uma realização externa precisa estar qualificada/disponível;
- `DATA_PREREQUISITE` — dados ou sua transformação precisam estar prontos;
- `OPERABILITY_PREREQUISITE` — a transição precisa ser observável e operável;
- `TRUST_PREREQUISITE` — confiança, chaves, certificados ou relações equivalentes precisam estar qualificadas;
- `LOCALITY_PREREQUISITE` — restrições de localidade/residência/topologia precisam ser satisfeitas.

Isso muda a leitura de “ordem de implementação”.

```text
A antes de B
```

pode significar coisas completamente diferentes:

```text
A fornece o significado que B referencia
A fornece a autoridade sob a qual B pode agir
A produz a evidência que permite promover B
A torna o provider de B admissível
A prepara os dados que B precisa interpretar
```

Sem tipar a dependência, o cronograma parece correto enquanto a transição permanece semanticamente impossível.

## 5. Os estados de migração: sair do binário “migrado / não migrado”

Planning D adota um vocabulário de estados que reconhece a natureza gradual da mudança. Entre os estados autoritativos estão:

```text
DISCOVERED
QUALIFIED
COEXISTENCE_READY
SHADOWING
PARTIAL_CUTOVER
CUTOVER
RESIDUAL_DRAIN
RECONCILED
CLOSED
```

Há também estados que representam impedimento ou resultado excepcional, como `BLOCKED`, `CONFLICTED`, `ABORTED`, `ROLLED_FORWARD`, `ROLLED_BACK_WHERE_REVERSIBLE` e `MANUAL_RECONCILIATION_REQUIRED`.

Por que isso importa?

Porque uma migração empresarial raramente muda toda a população no mesmo instante.

**EXEMPLO DIDÁTICO:** imagine a migração de um modelo de identidade de Station. O novo modelo pode estar tecnicamente disponível, mas apenas algumas Stations podem ter sido qualificadas. Outras ainda podem operar com representação Brownfield. Nesse período:

```text
novo modelo existe
        !=
toda população o utiliza
        !=
toda população produz evidência sob ele
        !=
modelo antigo pode ser removido
```

O estado `RESIDUAL_DRAIN` existe conceitualmente para tornar visível esse intervalo entre o cutover principal e a eliminação dos resíduos relevantes.

## 6. D1: o substrato semântico precisa poder coexistir com o conhecimento anterior

**DECIDIDO:** D1 trata Semantic Substrate e Elicitation como uma migração incremental, não como uma substituição instantânea de todo o conhecimento existente.

A G2 possui uma Elicitation Knowledge Base (EKB) versionada e auditável, informação tipada, contradições explícitas, provenance/currentness e mecanismos de coverage. Mas o mundo real já contém informação em formulários, documentos, entrevistas, código, bancos de dados, convenções humanas e sistemas Brownfield.

O erro seria declarar:

> “A partir de hoje, somente aquilo que já está formalizado na EKB existe.”

Isso apagaria conhecimento justamente durante a fase em que o novo modelo ainda está sendo adotado.

D1, portanto, preserva coexistência entre semântica owner-qualified e evidência/free-form/Brownfield durante a transição.

Uma forma didática de enxergar:

```text
conhecimento Brownfield
        ↓ descoberta / qualificação
EKB + informação tipada
        ↓ shadowing / comparação
adoção owner-qualified
        ↓ residual drain
estado reconciliado
```

A seta não significa que todo texto livre vira automaticamente verdade canônica. Significa que existe uma rota governada para compreender, qualificar, comparar e eventualmente adotar conhecimento sem confundir **evidência sobre o negócio** com **verdade canônica do negócio**.

## 7. Shadowing: observar o novo sem entregar autoridade cedo demais

*Shadowing* é uma técnica de transição na qual o novo caminho acompanha, calcula ou avalia o comportamento esperado sem necessariamente se tornar imediatamente o caminho autoritativo que produz o efeito empresarial.

**EXEMPLO DIDÁTICO:** um novo mecanismo de roteamento de perguntas de elicitação pode sugerir quais perguntas deveriam vir a seguir enquanto o fluxo antigo continua determinando a interação efetiva. As divergências podem ser estudadas antes da promoção.

Isso permite perguntar:

- o novo modelo entende os mesmos casos?
- produz contradições onde o antigo ocultava conflito?
- perde informação relevante?
- muda coverage de forma explicável?
- sua evidência está suficientemente current?

Mas há uma limitação importante:

`shadow result != promotion authority`.

Shadowing gera comparação e evidência. A autoridade para promover o novo caminho continua pertencendo ao gate/owner competente.

## 8. Coexistência é uma propriedade planejada, não um acidente tolerado

Em sistemas grandes, coexistência costuma aparecer como dívida temporária: “por enquanto temos dois caminhos”. Na G2, Planning D trata coexistência como parte explícita da estratégia.

Isso é importante porque dois mundos ativos criam perguntas próprias:

- qual revisão produziu este resultado?
- qual owner qualificou esta representação?
- qual população ainda usa o caminho anterior?
- uma referência criada no mundo novo pode ser entendida no antigo?
- um efeito pode atravessar a fronteira entre revisões?
- qual evidência prova que o cohort antigo foi drenado?

A coexistência planejada precisa carregar identidade, revisão, provenance e critérios de saída.

Caso contrário, “temporário” pode virar permanente sem que ninguém consiga demonstrar quando a migração terminou.

## 9. Coverage de elicitação e Production Readiness continuam separados

D1 preserva uma separação importante já consolidada anteriormente: compreender suficientemente o sistema não é a mesma coisa que provar que ele está pronto para produção.

Uma organização pode possuir boa cobertura sobre processos, regras, dados, atores e exceções e ainda não ter:

- secrets qualificados;
- trust estabelecido;
- observabilidade suficiente;
- providers admitidos;
- recovery comprovado;
- capacidade operacional;
- autoridade atual para determinadas ações.

Logo:

`ElicitationCoverage != ProductionReadinessCoverage`.

Essa separação evita transformar “entendemos o processo” em “podemos colocá-lo em produção”.

## 10. O próximo problema: autoridade, identidade, trust e secrets

**EM PESQUISA/PLANEJAMENTO:** o próximo estágio autorizado é D2 — Authority, Identity, Trust and Secrets prerequisites.

O livro não deve antecipar a decisão de D2. Mas já é possível compreender por que essa etapa vem cedo.

Uma migração pode copiar dados e instalar software e ainda assim ser insegura ou semanticamente inválida se:

- identidades antigas e novas não puderem ser correlacionadas com confiança;
- permissões residuais sobreviverem ao cutover;
- certificados ou trust roots estiverem em epochs incompatíveis;
- secrets antigos continuarem efetivos em caches ou workloads residuais;
- uma Station offline operar sob autoridade cuja currentness não pode mais ser provada.

Em outras palavras, migrar comportamento sem migrar corretamente **quem pode agir, em nome de quem e sob qual confiança** cria uma plataforma funcionalmente moderna e institucionalmente insegura.

D2 deverá decidir a estratégia correspondente; este apêndice apenas registra o problema e o lugar dele na cadeia.

## 11. O que muda na leitura do Capítulo 23

O Capítulo 23 v1.0.0 foi publicado quando a pesquisa adversarial ainda estava ativa e Planning C permanecia bloqueado. Sua estrutura — pesquisa → síntese → boundaries → arquitetura → migração → prova → decomposição → construção — continua válida.

O que mudou é o estado epistemológico de partes dessa cadeia.

Hoje podemos afirmar:

- **DECIDIDO:** a pesquisa adversarial fechou `CLOSED / SATURATED / PASS`;
- **DECIDIDO:** Planning C fechou `CLOSED / PASS` após reconciliação transversal anti-stale;
- **DECIDIDO:** Planning D está `ACTIVE / OPEN`;
- **DECIDIDO:** D0 e D1 estão `CLOSED / PASS`;
- **ABERTO:** D2 e etapas posteriores de Planning D ainda não fecharam;
- **BLOQUEADO:** Planning E permanece bloqueado até o fechamento de Planning D.

Isso torna CHAPTER_23 candidato a revisão editorial bounded: não porque sua tese central esteja errada, mas porque frases que descreviam Planning C como futuro já ficaram historicamente desatualizadas.

## 12. O que você deve guardar deste apêndice

A principal ideia é simples:

> **Arquitetura alvo responde “como o sistema deve ser”; estratégia de migração responde “como chegamos lá sem perder verdade, autoridade e operação no caminho”.**

Planning C fechou porque as decisões de arquitetura alvo foram reconciliadas transversalmente. Planning D começou porque agora é necessário ordenar dependências e governar coexistência, shadowing, cutover, residual drain e reconciliação.

Guarde também estas desigualdades:

```text
28 decisões locais != coerência global automática
TargetArchitecture != MigrationStrategy
new model available != population migrated
cutover != residual drain complete
shadow result != promotion authority
ElicitationCoverage != ProductionReadinessCoverage
rollback != universally possible
```

O ponto mais profundo é que **migração também é arquitetura temporal**. Ela precisa preservar semantic ownership, revision identity, authority, evidence, trust e operability enquanto o sistema atravessa estados em que o antigo e o novo coexistem.

---

## Referências autoritativas consultadas

Este apêndice sintetiza, sem substituir, principalmente:

- `project_docs/generation-2/RESEARCH_PIPELINE_STATE.json`;
- `project_docs/generation-2/planning/PLANNING_C_TARGET_ARCHITECTURE_CLOSURE_RECONCILIATION.md`;
- `project_docs/generation-2/planning/PLANNING_D_DEPENDENCY_MIGRATION_STRATEGY_ENTRY_FRAMEWORK.md`;
- `project_docs/generation-2/planning/PLANNING_D_D0_MIGRATION_CONSTITUTION_CROSS_CUTTING_DEPENDENCY_GRAPH.md`;
- `project_docs/generation-2/planning/PLANNING_D_D1_SEMANTIC_SUBSTRATE_ELICITATION_COEXISTENCE.md`;
- `project_docs/generation-2/book/chapters/CHAPTER_23_COMO_TRANSFORMAR_PESQUISA_EM_ARQUITETURA_WBS_CONSTRUCAO.md`.

Em caso de divergência, os artefatos autoritativos prevalecem.