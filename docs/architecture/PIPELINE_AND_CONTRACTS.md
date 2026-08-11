# Pipeline and Contract Map

## Transformation contracts

The target pipeline is artifact-driven:

| Producer | Contract | Consumer |
|---|---|---|
| Mirror | ArtifactEnvelope&lt;ProcessMirror&gt; | Recipe |
| Recipe | ArtifactEnvelope&lt;BusinessRecipe&gt; | Analysis |
| Analysis | ArtifactEnvelope&lt;SystemAnalysis&gt; | Design |
| Design | ArtifactEnvelope&lt;SystemDefinition&gt; | Assembly |
| Assembly | ArtifactEnvelope&lt;AssemblyPlan&gt; | Validation/Compiler |
| Validation | ArtifactEnvelope&lt;ValidationEvidence&gt; | Release gate |
| Compiler | ArtifactEnvelope&lt;ReleaseArtifact&gt; | Release |
| Release | ArtifactEnvelope&lt;PublishedRelease&gt; | Deploy |
| Deploy | ArtifactEnvelope&lt;DeploymentRecord&gt; | Observe/operations |

`ArtifactEnvelope<T>` is the public boundary shape accepted in ADR-0009. The
existing names in angle brackets remain the logical payload contracts.

## Contract requirements

Each public contract must use the ADR-0009 envelope and declare:

- a stable namespaced artifact type and payload-schema identifier;
- independent SemVer versions for the envelope, payload schema and logical
  artifact;
- a schema/version migration policy that creates a new artifact version instead
  of overwriting a published revision;
- producer/consumer expectations;
- validation schema;
- backward and forward compatibility rules within a supported major version;
- required provider-neutral provenance metadata and input artifact references;
- namespaced optional and required extension points, including safe handling of
  unknown extensions;
- examples/fixtures.

Consumers must reject unsupported major versions and unknown required extension
semantics. They may accept a newer compatible minor/patch only when unknown
information is ignored for behavior and preserved losslessly. No contract may
require a provider, registry, database or storage-engine identifier in its core
envelope.

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
