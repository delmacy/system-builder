# Activity Definition Rules

Após Work Packages, a próxima decomposição temporal não é diretamente Sprint: primeiro definimos **activities/tasks executáveis**.

## Work Package → Activities
Cada activity deve ter: ID; parent WP; output; predecessor lógico; owner/executor class; estimate range; acceptance/evidence; rollback/recovery note quando relevante.

## Sequenciamento
Usar Finish-to-Start como default lógico. Paralelizar quando contratos estabilizados eliminarem bloqueio. Evitar Start-to-Start implícito entre agentes sem interface formal.

## Critical path lógico
Antes de duração real, manter um `logical critical path`: cadeia de predecessores sem a qual não existe primeira prova vertical. Depois das estimativas de duração/recursos, derivar o critical path temporal.

## Sprint
Sprint é contêiner de activities/tasks READY. Não é elemento da WBS e não cria dependência.
