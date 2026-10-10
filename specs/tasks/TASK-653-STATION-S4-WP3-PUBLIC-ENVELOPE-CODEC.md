---
id: TASK-653
title: Station S4 WP3 Public Envelope Composition Codec
status: completed
priority: 653
milestone: STATION-S4-WP3-LOCAL-ARTIFACT
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-652
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/current/NEXT_WORK.md
  - docs/contracts/004-station-portable-composition-artifacts/ADDENDUM.md
  - docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-01.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - specs/contracts/artifact-envelope/artifact-envelope.schema.json
  - tooling/agent-harness/tests/artifact-envelope.test.ts
  - packages/station-composition/graph.ts
  - packages/station-composition/graph-validation.ts
  - packages/station-composition/validation.ts
  - packages/station-composition/registry.ts
  - packages/station-editor/session.ts
  - apps/station/web/app/station-editor-catalog.ts
  - project_docs/execution_planning/STATION-S4-WP3-LOCAL-ARTIFACT-PLANNING-01.md
  - project_docs/execution_planning/STATION-S4-WP3-CONSTRUCTION-A-01.md
allowed_paths:
  - packages/station-editor/artifact-codec.ts
  - packages/station-editor/index.ts
  - apps/station/web/app/station-editor-artifact.ts
  - tests/product/station-editor-artifact-codec.test.ts
  - specs/tasks/TASK-653-STATION-S4-WP3-PUBLIC-ENVELOPE-CODEC.md
  - project_docs/execution_planning/STATION-S4-WP3-CONSTRUCTION-A-01.report.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - docs/adr/**
  - specs/contracts/**
  - packages/contracts/**
  - packages/station-settings/**
  - packages/station-composition/**
  - .github/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 7
validation:
  - npm run verify
  - npm run station:build
  - npx playwright test --config tests/browser/station-editor.playwright.config.ts
---

# TASK-653 — WP3 Construction A: public-envelope composition codec

State: IMPLEMENTED_ON_SPRINT_BRANCH; exact-head Actions and validated integration required.
Scope provenance: Addendum 004 and RESOLUTION-01; no ADR/schema changes.

## Objective
Implement a pure, bounded, deterministic codec for the public composition artifact, reusing installed catalog/graph/editor contracts.

## Context
TASK-652 resolved public interchange compatibility by reusing ADR-0009. WP2 offers source-owned three-node examples and session-only Save. Construction B UI/persistence remains forecast.

## Current behavior
No external artifact codec exists. Graph validation trusts typed inputs and does not enforce all external shape/topology boundaries.

## Required change
In the existing station-editor package expose typed data-only encode/decode results with stable failure reasons, validated immutable success documents and explicit trusted source input. Add app-local adapter resolving source catalog before calling the package API; package code must not import app internals. Use RESOLUTION-01's exact envelope, payload, identity/revision/version, strict graph/source, key safety, UTF-8 byte/node/depth/token limits, deterministic ordering and compatibility rules. Validate exports too. No automatic metadata generation, migration or version allocation.

## Inputs / contracts
RESOLUTION-01 is normative. ADR-0009/common envelope remains unchanged. Trusted source provides installed application/composition identity, baseRevision, graph and ComponentRegistry; untrusted bytes never provide a registry. Caller provides explicit artifactId/artifactVersion/provenance for new export; re-emission preserves accepted optional metadata.

## Outputs / contracts
Pure codec APIs and catalog adapter. Success returns a fully validated immutable document/serialized bytes; rejection is typed and leaves input/session/store/preferences unchanged. No production import from tooling/tests and no Node filesystem requirement in browser package code.

## Acceptance criteria
- Both installed catalogs export/parse/re-emit deterministically with valid edited spans through real editor mutation.
- Artifact identity, SemVer, provenance and unknown optional extension data survive round-trip; unsupported required extension/major/payload schema rejects before use.
- Missing/unknown fields, unsafe keys, malformed/truncated JSON, oversize/deep payload, bad tokens/numbers/revisions/identity, duplicate refs, unknown components, cycles, disconnected graph, illegal parent/slot/spans/cardinality and incompatible source topology reject.
- Test every budget at N-1/N/N+1, isolating budget checks from source compatibility where needed; no fabricated 256-node acceptance claim from a three-node catalog.
- Pure failure paths prove original editor/session/metadata are unchanged; export excludes UI preferences, selection, labels, executable definitions and secrets.
- Growing proof calls real catalog -> initializeEditorSession -> applyEditorSessionMutation -> encode/decode -> initializeEditorSession, with real descriptor validation.
- Existing envelope schema/fixtures and all WP1/WP2 regression remain passing.
- Declared validations, triggered Actions, Station Windows/Ubuntu builds and browser regression pass before integration; attach exact-head/current-base evidence.

## Non-goals
Browser file controls, download/upload UI, durable storage, structural graph authoring, .process, full File Manager, deployment, Core/business, new dependencies or shared envelope/ADR changes.

## Evidence expected
One authoritative TASK implementation commit (all allowed implementation/report/status changes), Sprint report, one Construction A PR, exact-head/current merge candidate checks, builds/browser artifacts. No local proof claim unless observed.

## Escalation
Stop for forbidden paths, worker collision, failure requiring new dependencies/schema/ADR or relaxation of contract admission. Record adjacent discoveries; do not broaden this TASK.

## Integrated completion
TASK-653 IMPLEMENTED / PROVEN / INTEGRATED through #1046 at 1c39ee81; seven final-head workflows passed. Earlier checkpoints are historical.
