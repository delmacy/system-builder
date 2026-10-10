# Station portable composition artifact — contract resolution 01

Date: 2026-10-10
State: EFFECTIVE via validated #1045 at eaad7ef3; implemented/proven/integrated by A #1046
Authority: accepted ADR-0009; Addendum 004; TASK-652 readiness inventory
Base: main@5300763aafa3aac162d1a3e59535bc8a256545ac

## Decision

Composition export/import is public data interchange. Reuse the public artifact envelope from `specs/contracts/artifact-envelope/artifact-envelope.schema.json`. Do not create an alternative top-level envelope. No ADR is changed or excepted. This resolves the Addendum's explicitly provisional envelope, within its admitted data-only scope.

| Envelope field | Composition meaning |
|---|---|
| envelopeVersion | Export 1.0.0; consumer supports major 1 under ADR compatibility rules |
| artifactType | urn:system-builder:station:composition |
| artifactId | Caller-supplied immutable logical artifact URI; UUID URN recommended |
| artifactVersion | Caller-supplied SemVer of artifact meaning, distinct from catalog/draft revisions |
| schema | id urn:system-builder:station:composition:payload, version 1.0.0 |
| provenance | Required caller-supplied UTC creation, producer identity/version and input references |
| requiredExtensions | Empty on initial export; any unrecognized required semantics reject |
| extensions | Inert optional namespaced JSON preserved losslessly |
| payload | Strict applicationRef, compositionRef, baseRevision, graph |

Payload schema version 1.0.0 has no migrations. Reject any other payload schema version before graph interpretation. Graph contains rootRef and nodes; nodes contain ref, componentRef and optional placement; placement contains parentRef, slotRef, columnSpan, rowSpan. Required fields are required even if falsy; unknown payload/graph/node/placement fields reject. Descriptors, labels, code, HTML/CSS, secrets and window/session presentation state are never exported from the editor.

The common envelope keeps ADR-0009 compatibility: unknown optional extensions and permissible provenance metadata are retained without behavior. Envelope 1.0.0 obeys its existing schema top-level field policy. Compatible later 1.x envelopes require lossless preservation of unknown optional core fields and understood required extensions; otherwise explicit compatibility rejection. A valid JSON Schema is necessary but not sufficient for compatibility.

## Identity, source and revision

Resolve installed source-owned catalog before accepting payload; never import registries/descriptors. Require exact applicationRef/compositionRef and exact baseRevision equal to the resolved catalog revision. Wrong/stale/future revisions reject. artifactVersion must not be guessed from numeric baseRevision or draftRevision.

This initial span-only slice preserves the installed root, node ref/component identities, parent/slot topology and node order. Spans may change within installed descriptor constraints. Source labels remain source-owned. A structurally different document fails with an incompatible-source result; future structural authoring requires separately admitted work.

The codec receives explicit caller metadata for export. It does not generate timestamps, UUIDs or versions; identical metadata and graph produce identical bytes. A decode/encode round-trip preserves the artifact identity tuple, provenance and inert metadata. Changing meaning must be emitted under a new caller-supplied artifactVersion; the codec does not allocate or persist versions.

## Bounded external input

Inclusive codec admission limits: 1,048,576 UTF-8 bytes for the entire document; 256 nodes; 32 JSON container levels with root level 1; 256 Unicode code points per graph ref/component/parent/slot token. These are new conservative codec policies, not claimed repository-wide constants. They bound memory/graph work while the current catalog contains three-node examples. Byte/depth limits include optional opaque metadata.

Check byte size and nesting before recursive normalization. Use iterative traversal for deep JSON and graph connectivity. Reject __proto__, prototype and constructor keys anywhere before copy/merge. Validate finite JSON values, exact shapes, safe integer revisions/spans, duplicate refs, cycles, rooted connectivity, known components, valid parent/slot references and single-child slot cardinality before source compatibility/session creation. No URI is fetched, code evaluated or extension activated.

Tests exercise N-1/N/N+1 for bytes/nodes/depth/tokens. Node budget tests isolate shape/budget admission from later source topology rejection; the current three-node catalog does not prove acceptance of a 256-node composition.

## Determinism and recovery

Pure typed encode/decode APIs return success with an immutable validated document or rejection with a stable reason. No session/store/preferences/DOM mutation is allowed. Caller replacement occurs only after full success and later explicit UI confirmation. Sort object keys using locale-independent code-unit order, preserve array order, and preserve unknown metadata values. No mutation or partial normalization of the original document.

File hint: .composition.json, MIME application/json. Filename/MIME do not confer trust. No .process format, filesystem authority, storage provider, server/Core writes or durable Save/Open is introduced.

## Implementation and proof

Construction A TASK-653 is a pure codec in the existing station-editor package with app-local catalog adaptation and positive/negative/predecessor product tests. No new dependency or package boundary. Validate common-envelope required fields and semantics against existing schema/fixtures; test/harness internals are not production APIs. Existing schema, ADR and provenance contracts remain unchanged.

Proof must call the real source catalog, initializeEditorSession and applyEditorSessionMutation, then encode/decode and initialize a fresh session. Unknown extensions/provenance must round-trip without granting authority. Every rejected import leaves original objects unchanged. WP2 Chromium regression and exact-head/current merge-candidate verification remain mandatory.

Construction B stays forecast until A integrates, with explicit file actions/dirty-state confirmation and a separately reviewed persistence decision. Full File Manager, structural component authoring, network sync, publish/deploy and Core business authority stay outside this contract.
