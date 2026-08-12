# AgentFactory — Ignition Project

Projeto ignitivo subordinado ao System Builder. Objetivo: automatizar planejamento executável, seleção de trabalho, execução via OpenCode, validação, evidência e atualização do DAG sem transformar a esteira em um produto independente.

## Estrutura
Cada módulo possui `README.md`, `WBS.md` e `scope/README.md`.

## Regra de saída
O foco principal retorna ao System Builder assim que a fábrica atingir I2/I3 com confiabilidade suficiente. I4–I7 são evolução incremental, não pré-requisito para desenvolvimento do produto.

## Cadeia
Governance -> Planning Model -> DAG -> Task Decomposition -> Sprint Planning -> Model Routing -> OpenCode -> Harness -> Validation -> Evidence -> GitHub -> Ledger -> Replanning -> Review -> Metrics -> Operations.
