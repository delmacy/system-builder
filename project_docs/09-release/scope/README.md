# Escopo — Release

## Inclui
Lifecycle DRAFT→VALIDATED→BUILT→STAGING→PRODUCTION→DEPRECATED→ARCHIVED, metadata, hashes, provenance, promotion e depreciação.

## Não inclui
Executar runtime ou carregar configuração secreta de ambiente.

## Entradas
ReleaseArtifact, ValidationEvidence e políticas de release.

## Saídas
PublishedRelease imutável e rastreável.

## Critério de conclusão
Toda release publicada pode ser reconstruída/auditada até Recipe, Definition, capabilities, toolchain e evidências.