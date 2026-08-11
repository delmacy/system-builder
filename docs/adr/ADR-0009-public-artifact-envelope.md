# ADR-0009 — Public artifact envelope and versioning policy

Status: Accepted

## Context

Every public artifact in the System Builder pipeline needs portable identity,
version, provenance and compatibility semantics. Those semantics must work when
a third-party tool replaces a suite module and when artifacts move between file,
object, relational or other storage implementations.

A schema identifier alone does not identify the artifact instance or its
history. Conversely, adopting an event or registry protocol as the universal
artifact shape would make transport or storage concerns part of the public
contract.

## Conventions considered

| Convention | Strengths | Why it is not the universal envelope |
|---|---|---|
| JSON Schema `$id` plus schema version | Open, deterministic validation and broad tooling | Identifies a schema, not a logical artifact, artifact revision, provenance chain or extension policy. |
| CloudEvents envelope | Mature event identity, source, type and extension conventions | Pipeline artifacts are durable documents, not necessarily events; mandatory event-source and transport semantics would be misleading. |
| OCI descriptor/manifest | Strong media-type, digest and distribution conventions | Registry, blob and content-addressing assumptions are not appropriate for every logical artifact or storage engine. |
| Minimal System Builder artifact envelope | Keeps durable artifact semantics explicit while borrowing open URI, SemVer and namespaced-extension conventions | Requires one project-owned schema and compatibility policy. |

## Decision

Adopt a minimal, provider-neutral public artifact envelope for every artifact
crossing a bounded-context boundary. The envelope is a logical contract; JSON is
the canonical interchange representation, but modules may use any internal
representation that round-trips without information loss.

The envelope has these required top-level concepts:

| Field | Meaning |
|---|---|
| `envelopeVersion` | SemVer version of this envelope contract. |
| `artifactType` | Stable, namespaced type identifier for the payload contract. |
| `artifactId` | Globally unique, immutable URI identifying the logical artifact across its versions. |
| `artifactVersion` | SemVer version of the logical artifact. |
| `schema` | Stable URI and SemVer version of the schema that validates `payload`. |
| `provenance` | Creation time, producer identity/version and zero or more input artifact references. |
| `requiredExtensions` | Names of extensions whose semantics a consumer must understand. It is empty when omitted. |
| `extensions` | Namespaced, JSON-compatible extension values. It is empty when omitted. |
| `payload` | The contract-specific artifact content. |

The deterministic JSON Schema, fixtures and executable validation are delegated
to TASK-010. That task may make representation details stricter but may not
change the semantics accepted here.

### Artifact identity

- `artifactId` is stable for the lifetime of one logical artifact. A UUID URN is
  the recommended form. It must not encode a database primary key, bucket,
  repository path, provider account or network location.
- The immutable identity of a serialized artifact revision is the tuple
  (`artifactType`, `artifactId`, `artifactVersion`). A producer must not publish
  different payloads under the same tuple.
- `artifactType` and `schema.id` are stable namespaced identifiers. Third-party
  namespaces are valid; System Builder does not reserve all artifact types to
  its own implementation.
- Storage locators and content digests may accompany a reference, but neither
  replaces the logical identity tuple. A digest, when present, carries its
  algorithm explicitly and must not assume one storage system.

### Semantic versioning

`envelopeVersion`, `artifactVersion` and `schema.version` use SemVer 2.0.0, but
describe different things:

- `envelopeVersion` versions the common envelope fields and their semantics.
- `schema.version` versions the payload contract identified by `schema.id`.
- `artifactVersion` versions consumer-visible meaning of one logical artifact.

For the envelope and payload schema, a major increment means a consumer may need
to change to read or preserve the document. A minor increment is additive and
backward compatible: it may add optional information or optional extension
semantics but must not remove, rename or reinterpret existing data. A patch
increment corrects documentation or validation without changing required
consumer behavior or the set of semantically valid documents.

For an artifact revision, a major increment represents an intentionally
incompatible change to consumer-visible meaning, a minor increment adds
backward-compatible meaning, and a patch increment corrects the artifact without
changing its declared behavior. Pre-release versions are allowed for unpublished
work; published release inputs must use stable versions.

### Backward and forward compatibility

- **Backward compatibility:** a consumer supporting a given major version must
  accept documents produced under earlier minor and patch versions of that same
  major, subject to its normal business validation.
- **Forward compatibility:** a consumer may accept a later minor or patch of the
  same major only when it can preserve unknown fields, understands every entry in
  `requiredExtensions`, and does not depend on newly introduced optional meaning.
  Otherwise it must fail explicitly before interpreting the payload.
- A consumer must reject an unsupported major version. It must not guess,
  silently downgrade or partially interpret one.
- Producers may emit a newer compatible minor version, but must not assume that
  an older consumer uses newly introduced optional information.
- Migration creates a new artifact version and records the source artifact in
  provenance. It never overwrites a previously published identity tuple.

### Extensions

- Extension names use a namespace controlled by their owner, expressed as a URI
  or reverse-domain name. Extension values are JSON-compatible data and must not
  shadow or reinterpret core fields.
- An unknown extension absent from `requiredExtensions` must be ignored for
  behavior and preserved losslessly by consumers that read and re-emit the
  artifact.
- A consumer that does not recognize an extension listed in
  `requiredExtensions` must reject the artifact with an explicit compatibility
  error. It must not execute or authorize behavior it does not understand.
- Unknown optional core fields in a compatible major version follow the same
  ignore-and-preserve rule. A consumer unable to preserve them must reject the
  newer document rather than silently discard them.

### Provenance

`provenance` is required and contains:

- `createdAt`, an RFC 3339 UTC timestamp;
- `producer`, with a stable provider-neutral identifier and producer version;
- `inputs`, a possibly empty list of references containing the input artifact
  identity tuple and, when available, an algorithm-qualified digest.

Provenance may add portable actor, operation, correlation or integrity metadata.
It is evidence and traceability, not execution authority. It must not contain
credentials, secret values, mandatory provider resource identifiers or a
mandatory storage locator.

### Provider and storage independence

- No provider SDK, hosted service, registry, database, object store or filesystem
  is required to create, validate, exchange or interpret an envelope.
- Provider-specific metadata belongs in an optional namespaced extension.
- Persistence adapters may index or map envelope fields internally, but exported
  artifacts must recover the complete public envelope without depending on
  internal keys or joins.
- External references use portable logical identities. Resolution of an optional
  URI or locator is an adapter concern, not a core contract requirement.

## Consequences

- Every transformation contract shares one explicit identity, version,
  provenance and extension policy.
- Compatible readers must preserve information they do not understand, while
  required unknown semantics fail safely.
- Provider and storage choices remain replaceable at contract boundaries.
- The envelope adds some metadata and requires deterministic validation before
  downstream public schemas can be considered complete.

