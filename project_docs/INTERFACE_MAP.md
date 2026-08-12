# Interface Map — fronteiras que devem permanecer explícitas

## Knowledge → Design
- ProcessMirror
- BusinessRecipe
- SystemAnalysis
- SystemDefinition

## Design → Factory
- SystemDefinition
- capability requirements
- catalog references
- AssemblyPlan

## Factory → Runtime
- validated assembly
- ReleaseArtifact
- EnvironmentProfile
- Deployment record

## Runtime → Learning
- business events
- technical telemetry
- audit/evidence
- support/evolution feedback

## Cross-cutting interfaces
- ArtifactEnvelope/version identity
- Evidence/Provenance references
- Actor/Subject/Organization identity
- Time/calendar contract
- File/document reference
- Event/action contract
- Policy decision contract
- Capability manifest/version
- trace/lineage identifiers

## Regra
Consumidores dependem de interfaces/contratos públicos, não dos internos do produtor. Interfaces acima devem ser estabilizadas antes de permitir paralelismo que dependa delas.
