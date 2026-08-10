# Pipeline and Contract Map

## Transformation contracts

The target pipeline is artifact-driven:

| Producer | Contract | Consumer |
|---|---|---|
| Mirror | ProcessMirror | Recipe |
| Recipe | BusinessRecipe | Analysis |
| Analysis | SystemAnalysis | Design |
| Design | SystemDefinition | Assembly |
| Assembly | AssemblyPlan | Validation/Compiler |
| Validation | ValidationEvidence | Release gate |
| Compiler | ReleaseArtifact | Release |
| Release | PublishedRelease | Deploy |
| Deploy | DeploymentRecord | Observe/operations |

## Contract requirements

Each public contract should eventually declare:

- stable identifier;
- semantic version;
- schema/version migration policy;
- producer/consumer expectations;
- validation schema;
- compatibility rules;
- provenance metadata;
- extension points;
- examples/fixtures.

## Dependency rule

Consumers depend on contracts, not producer internals.

Forbidden pattern:

`compiler -> mirror/internal-parser`

Expected pattern:

`compiler -> AssemblyPlan contract`

## Traceability

The platform should preserve a chain such as:

```text
BusinessRecipe requirement
 -> SystemAnalysis requirement/match
 -> SystemDefinition workflow/entity/view
 -> AssemblyPlan capability
 -> tests/evidence
 -> Release
```

This trace becomes the functional proof that a release implements an approved recipe.

## Business vs software catalogs

Business Recipe Modules describe how organizations work. Software Capabilities describe technical mechanisms that implement needs. They must not be collapsed into the same abstraction.
