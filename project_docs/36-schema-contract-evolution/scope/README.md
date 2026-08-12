# Escopo — Schema & Contract Evolution Engine

## Inclui
SemVer policies, compatibility matrices, migration transforms, deprecation, supported ranges, extension preservation e consumer/provider compatibility checks.

## Não inclui
Sobrescrever artifact revision publicada ou aceitar breaking change silencioso.

## Entradas
Schemas/contracts/versions e migration definitions.

## Saídas
Compatibility decisions, migrated artifacts e evolution evidence.

## Critério de conclusão
Consumidor sabe aceitar/rejeitar/migrar versões de forma determinística e lossless quando prometido.