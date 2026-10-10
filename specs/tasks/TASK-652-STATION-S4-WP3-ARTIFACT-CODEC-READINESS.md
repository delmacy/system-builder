---
id: TASK-652
title: Station S4 WP3 Portable Composition Codec Readiness
status: verification
priority: 652
milestone: STATION-S4-WP3-LOCAL-ARTIFACT
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-651
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/CONTRACT_INDEX.md
  - project_docs/execution_planning/STATION-S4-WP3-LOCAL-ARTIFACT-PLANNING-01.md
  - apps/station/web/app/station-editor-catalog.ts
allowed_paths:
  - specs/tasks/TASK-652-STATION-S4-WP3-ARTIFACT-CODEC-READINESS.md
forbidden_paths:
  - apps/**
  - packages/**
  - tests/**
  - .github/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 1
validation:
  - npm run verify
---

# TASK-652 — Station S4 WP3: Portable Composition Codec Readiness

State: READINESS DOCUMENTATION IMPLEMENTED; completion gated on validated resolution PR integration
Predecessor: WP2 closed at main@9768c06e; WP3 planning merged at main@864692c4.
Scope: proposed Construction A, bounded preparation only.

## Goal
Prepare the separately scoped implementation of a safe, versioned, portable **composition artifact** codec using existing Station composition graph/descriptor contracts, without writing to Station window preferences or Core. WP3's broader local persistence phase is not covered by this task.

## Readiness gate
- Inventory repository-wide resource/file extension, composition graph and serialization contracts before selecting extension or format.
- Distinguish source-defined catalog descriptors from user-supplied serialized graphs; never trust an imported descriptor or arbitrary executable component.
- State explicit file size/node count bounds, schema version migration policy, app/composition identity and revision policy.
- Record immutable validation and recovery rules, without replacing the current session on failure.
- Approve an Addendum governing external input and local storage before product code. Any change to shared contracts requires separate architecture review.

## Construction A test targets
- Valid deterministic round trip of existing admitted example and ButtonGroup graphs.
- Reject unknown schema versions, malformed/truncated JSON, oversized files, duplicate/unknown node references, illegal slots/span bounds, forged application identity, unexpected fields and unsafe object keys.
- Reject stale incompatible revision without overwriting a valid editor session.
- Test that the exported artifact does not contain UI preferences, session focus or provider secrets.
- Maintain WP2 browser regression and exact-head/current merge candidate CI.

## Delivery gates
Planning approval -> separately bounded codec implementation commit -> unit tests -> Chromium proof where relevant -> review/merge. Do not advertise durable Save/Open until an independent WP3 Construction B explicitly implements and proves it.

## Objective
Prepare a versioned portable composition codec under an explicitly reviewed future contract; this task changes documentation only.

## Context
WP2 and WP3 planning are integrated, but the editor Save remains session-only and accepts source-owned catalog entries.

## Current behavior
Graph editing uses admitted composition descriptors and does not import external files. Window settings intentionally exclude editor data.

## Required change
Inventory resource/file contracts and define validation, migration and security gates before implementation in a separate bounded construction task.

## Inputs / contracts
WP3 planning baseline, Station composition graph and editor session APIs, existing resource/file format contracts, and document authority.

## Outputs / contracts
A readiness checkpoint and test requirements, not a new accepted schema, importer, or persistence API.

## Acceptance criteria
- Existing resource and composition contracts are inventoried before implementation.
- Strict schema, bounded size, identities, revision, versioning and fail-closed recovery are specified.
- Exact-head and current merge-candidate checks succeed before integration.

## Non-goals
Product code, durable storage, Core changes, app deployments, external execution, unrelated window preferences or complete Studio functionality.

## Evidence expected
Reviewed TASK commit, deterministic CI and browser regression, PR integration trace.

## Escalation
Stop for forbidden-file changes, shared contract drift, worker collision, or insufficiently specified import trust boundary.

## Readiness resolution — 2026-10-10

Fresh base: main@5300763aafa3aac162d1a3e59535bc8a256545ac. This TASK's authoritative commit changes this specification only (allowed_paths unchanged, max_files 1); no product code.

### Inventory and compatibility
- Accepted ADR-0009 and specs/contracts/artifact-envelope/artifact-envelope.schema.json define portable public identity/version/provenance. The proposed composition export is public interchange, so reuse that envelope. The previously proposed flat fields become the typed payload; no ADR exception or replacement schema.
- TASK-010 and tooling/agent-harness/tests/artifact-envelope.test.ts provide schema and compatibility fixtures, not a production validator API. Construction must not import test/harness internals into Station. Existing tests/product/artifact-envelope-provenance-integrity-roundtrip.test.ts proves metadata preservation.
- packages/station-composition/graph.ts, graph-validation.ts and validation.ts define graph and descriptor span/slot validation. Graph validation does not establish cycles/connectivity or multi-child single-slot occupancy; the external-input adapter must enforce these before existing graph validation.
- apps/station/web/app/station-editor-catalog.ts supplies exactly two source-owned entries, labels, registry and revision 7. packages/station-editor/session.ts supplies Station-only session/currentness semantics. Imported descriptors are never a registry.
- docs/architecture/STATION_FRONTEND_FOUNDATION.md excludes composition graphs from window preferences. Recursive repository path inventory was not truncated; no dedicated Station portable composition format was found among the inspected contract/resource paths. Use a compound .composition.json download suffix and JSON content; extension is only a hint, never validation authority. .process remains deferred.

### Decisions for the reviewed contract resolution
- Public envelopeVersion 1.0.0 on export; artifactType urn:system-builder:station:composition; schema.id urn:system-builder:station:composition:payload; schema.version 1.0.0. Payload fields are applicationRef, compositionRef, baseRevision and graph only. No redundant format/schemaVersion.
- Artifact URI, artifact SemVer, UTC provenance and producer are explicit caller metadata; the pure codec does not generate time/UUIDs, allocate versions, or infer identity from compositionRef. Preserve identity/version/provenance on round-trip; changed meaning requires caller-supplied new artifactVersion. baseRevision is the installed catalog revision, never artifactVersion or editor draftRevision.
- Require exact installed application/composition identity and catalog baseRevision. Wrong, stale or future baseRevision rejects. No automatic migration.
- Preserve optional extension/provenance data losslessly as inert JSON, including unknown optional extensions; reject every unsupported required extension before interpreting payload. Reject unknown payload/graph/node/placement fields. For envelope 1.0.0, apply existing schema's top-level field policy; a later compatible 1.x may only be accepted when all unknown optional core fields can be preserved. Unsupported major rejects.
- New codec-specific admission budgets: inclusive 1,048,576 UTF-8 bytes, 256 graph nodes, 32 JSON container levels (root counts as 1), and 256 Unicode code points per graph identity/slot token. These are conservative bounded-work policies, not discovered existing system-wide constants. Current source examples have 3 nodes each. Entire envelope, including opaque metadata, counts toward byte/depth limits. Check bytes before JSON.parse and nesting before recursive traversal; iterative scans/graph validation prevent stack exhaustion. Test each limit at N-1/N/N+1.
- Reject unsafe object keys __proto__/prototype/constructor throughout metadata and payload before copy/merge. Parse only JSON data; no evaluation/network resolution.
- Preserve node array order (semantic rendering order), exact source root/ref/component/parent/slot topology for this span-only editor slice, and source-owned labels. Only permitted columnSpan/rowSpan changes are portable. Validate cycles, rooted connectivity, unique refs and slot cardinality independently before comparing source topology; structural authoring is not admitted here.
- Pure codec returns typed accepted/rejected values and a fully validated immutable document; it never mutates sessions, preferences or storage. Export validates too. Canonical serialization sorts object keys with a locale-independent ordering, preserves array order, and produces identical bytes for identical input metadata/graph.
- Construction A exits with real catalog -> editor span mutation -> envelope encode/decode -> initializeEditorSession proof. Construction B remains forecast for browser file actions, dirty-state confirmation and durable provider decisions.

### Handoff
Contract clarification and separate Construction A manifest/TASK must be reviewed and integrated with this readiness result before product writes. Validation remains npm run verify through observed exact-head/current-base Actions. No implemented codec, durable save or completed WP3 is claimed.
