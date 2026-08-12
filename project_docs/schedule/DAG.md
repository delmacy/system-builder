# System Builder — Dependency DAG

## Regra fundamental
O DAG é anterior ao carregamento das sprints. Sprint é janela de execução; dependência pertence ao Work Package/artefato.

## Tipos de aresta
- `R`: REQUIRES — predecessor concluído.
- `C`: CONTRACT_REQUIRES — contrato público estabilizado basta para liberar trabalho paralelo.
- `D`: DATA_REQUIRES — identidade/schema/dado predecessor deve existir.
- `RT`: RUNTIME_REQUIRES — serviço predecessor deve estar executável.
- `V`: VALIDATION_REQUIRES — evidência predecessor necessária para conclusão.
- `I`: INFORMS — não bloqueante.

## Backbone principal
```text
35 Ontology/Semantics
  ->13 Evidence/Provenance
  ->01 Process Mirror
  ->02 Business Recipe
  ->03 System Analysis
  ->04 System Design
  ->05 Catalog
  ->06 Assembly
  ->07 Validation
  ->08 Compiler
  ->09 Release
  ->10 Deploy
  ->11 Observe
  ->12 Support/Evolution
        \->17 Experiment/Improvement ->02/03
```

## Runtime foundations — ramos paralelos
```text
30 Identity/Organization
  -> Authentication/session
  -> Authorization/policy context
  ->21 Workflow
  ->22 Actions
  ->28 Audit

34 Scheduler/Time ------->21 Workflow timers/deadlines
                      \-->31 Notifications temporal delivery

33 Files/Object Storage ->24 Documents/Evidence

25 Capability Registry/SDK ->05 Catalog ->06 Assembly
                          \->48 Extensions (later)

23 Policy/Rule Engine --->21 Workflow
22 Action Engine -------->21 Workflow
26 Integration Layer ---->22 Actions / generated systems
```

## Assurance/factory
```text
55 Architecture Fitness ----------------------------+
42 Security/Trust ----------------------------------+|
36 Contract Evolution -----------------------------+||
                                                   vvv
06 Assembly ->07 Validation ->08 Compiler ->09 Release ->10 Deploy
                 ^               |             |          |
45 Verification Lab-------------+             |          |
46 Runtime Certification----------------------+----------+
47 Continuity/DR ----------------------------------------+
```

## Data/learning
```text
runtime events ->29 Data/Reporting ->11 Observe ->16 Process Economics
                                      |            |
                                      +->40 Process Mining
                                      +->39 Simulation
                                      +->41 Decision Intelligence
                                                     \-> optimization (maturity-gated)
```

## Cross-cutting lineage
`14 Process Versioning`, `19 Knowledge Boundary`, `36 Contract Evolution`, `37 Dependency/Impact Graph`, `38 Digital Thread`, `42 Security/Trust`, `43 Data Governance` são trilhos transversais. Seus hooks/contratos mínimos devem preceder consumidores; implementação avançada pode ocorrer depois.

## Regras de liberação
1. Nenhum sucessor `R/D/RT` entra em execução sem predecessor satisfatório.
2. `C` permite paralelismo somente depois de contrato versionado e teste de contrato mínimo.
3. Ciclo no DAG é defeito: extrair contrato/interface ou redecompor WP.
4. Ramos independentes podem ser executados em paralelo mesmo que sua posição visual/número seja posterior.
5. O caminho crítico é recalculado quando estimativas, dependências ou riscos mudarem.
