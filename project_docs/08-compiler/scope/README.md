# Escopo — Compiler

## Inclui
Geração de manifests/schemas/migrations, build frontend/backend, bundling, assets, environment schema, hashes e packaging.

## Não inclui
Decidir comportamento de negócio, gerenciar lifecycle de release ou segredos de ambiente.

## Entradas
Validated AssemblyPlan e toolchain/version set.

## Saídas
ReleaseArtifact reproduzível e metadata de build.

## Critério de conclusão
Inputs e versões idênticos produzem resultado logicamente idêntico e verificável.