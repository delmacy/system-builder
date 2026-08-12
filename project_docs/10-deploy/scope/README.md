# Escopo — Deploy

## Inclui
Environment Profiles, binding release+environment, configuração externa, migrations/deploy steps, records, health/rollback hooks.

## Não inclui
Recompilar release para cada ambiente nem embutir secrets no artifact.

## Entradas
PublishedRelease, Environment Profile e referências seguras de configuração.

## Saídas
DeploymentRecord e sistema disponibilizado no ambiente alvo.

## Critério de conclusão
`Release + Environment = Deployment` é reprodutível, auditável e não modifica a release.