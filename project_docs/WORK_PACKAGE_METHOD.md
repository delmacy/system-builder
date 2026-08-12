# Work Package Method

## Fluxo pré-cronograma
`Scope/WBS → dependency/interface review → Work Packages/Planning Packages → WBS Dictionary → Scope Baseline → milestone/release planning → execution backlog → tasks → sprint scheduling`.

## Decomposição
Um L3 pode gerar um ou vários Work Packages. Quebrar quando houver: dependências distintas; interfaces distintas; validação independente; risco alto; possibilidade de paralelismo; ou tamanho grande demais para uma unidade controlável.

## Definition of Ready do Work Package
- objetivo verificável;
- boundaries explícitas;
- predecessor(s) identificados;
- contratos/interfaces conhecidos;
- acceptance/evidence definidos;
- downstream consumer conhecido;
- sem decisão arquitetural crítica delegada ao executor.

## Definition of Done do Work Package
- todos os outputs previstos existem;
- critérios de aceitação passam;
- evidência anexável/reproduzível existe;
- contracts/documentação atualizados;
- downstream consumer consegue consumir o resultado;
- nenhum predecessor/constraint foi burlado.

## Espiral incremental
Cada ciclo deve preferir uma fatia vertical pequena: contrato → implementação → validação → integração → evidência → aprendizado → próxima fatia. Não concluir dezenas de módulos horizontalmente antes de provar integração ponta a ponta.
