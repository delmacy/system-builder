# Escopo — Files / Object Storage

## Inclui
File/object identity, upload/download, metadata, version/reference, hashes, retention hooks, provider abstraction e access URLs/tokens quando aplicável.

## Não inclui
Usar DB relacional como requisito para blobs nem vazar bucket/provider IDs em contratos de negócio.

## Entradas
File content/stream, metadata e storage policy.

## Saídas
Object reference, integrity metadata e lifecycle events.

## Critério de conclusão
Provider pode ser trocado e referências lógicas permanecem válidas/migráveis.