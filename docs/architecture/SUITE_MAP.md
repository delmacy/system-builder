# System Builder Suite Map

The suite is organized like a family of specialist applications. Each module owns one portion of the system-production lifecycle and can evolve independently behind contracts.

| ID | App | Responsibility | Primary output |
|---|---|---|---|
| SB-01 | Mirror | Discover/structure real work | ProcessMirror |
| SB-02 | Recipe | Formalize approved business behavior | BusinessRecipe |
| SB-03 | Analysis | Requirements, gaps, capability matching, sizing | SystemAnalysis |
| SB-04 | Design | Logical application/system design | SystemDefinition |
| SB-05 | Catalog | Index business knowledge and software capabilities | registry entries |
| SB-06 | Assembly | Resolve dependencies and concrete composition | AssemblyPlan |
| SB-07 | Validation | Traceability, architecture, security and quality gates | validation evidence |
| SB-08 | Compiler | Build/package reproducible software | ReleaseArtifact |
| SB-09 | Release | Version/provenance/lifecycle management | PublishedRelease |
| SB-10 | Deploy | Bind release to environment | Deployment |
| SB-11 | Observe | Runtime/business telemetry | observations/findings |
| SB-12 | Support | Incidents, maintenance, evolution loop | support/evolution records |

## Product apps vs technical packages

`SB App` is a functional/product boundary. It does not automatically mean a separate process, repository, container or Next.js application.

Initial implementation should prefer bounded packages inside one monorepo and one Builder shell where appropriate.

## Optionality

A complete local installation may enable all modules, but partial use must remain an architectural goal. Example:

```text
External process miner -> ProcessMirror contract -> SB Recipe -> SB Analysis -> external designer -> SystemDefinition contract -> SB Assembly
```

Optionality is achieved by stable contracts, not by forcing every internal component to become a network service.
