---
id: TASK-010
title: Implement the deterministic public artifact envelope schema
status: ready
priority: 35
milestone: M1
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: opencode
depends_on:
  - TASK-003
context_paths:
  - AGENTS.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - specs/tasks/TASK-010-ARTIFACT-ENVELOPE-SCHEMA.md
allowed_paths:
  - specs/contracts/artifact-envelope/**
  - tooling/agent-harness/tests/artifact-envelope.test.ts
  - package.json
  - package-lock.json
forbidden_paths:
  - packages/**
  - apps/**
  - docs/adr/**
max_files: 8
validation:
  - npm run verify
---

# TASK-010 — Deterministic Public Artifact Envelope Schema

## Objective

Materialize ADR-0009 as a deterministic JSON Schema and fixtures without
introducing a runtime, provider or storage dependency.

## Context

TASK-003 accepted the envelope semantics. Downstream M1 artifact contracts need
one executable representation before their schemas can reuse it.

## Current behavior

The normative semantics exist in ADR-0009, but no machine-readable envelope
schema or fixture validation exists.

## Required change

- Add one JSON Schema 2020-12 definition for the public artifact envelope.
- Add focused valid and invalid fixtures for identity, SemVer, provenance,
  compatible optional extensions and unsupported required extensions.
- Add a deterministic offline test that validates the fixtures and the
  ignore/preserve versus reject rules from ADR-0009.
- Add only the minimum validation dependency needed by that test, if the
  repository does not already provide one.

## Inputs / contracts

ADR-0009 and the public pipeline contract map.

## Outputs / contracts

A reusable artifact-envelope schema, fixtures and deterministic validation.

## Acceptance criteria

- Required envelope fields and identity/version formats are schema-enforced.
- Provenance permits an empty input list and rejects provider/storage-specific
  fields as mandatory core data.
- Unknown optional extensions validate and round-trip losslessly in the test.
- An unknown entry in `requiredExtensions` produces an explicit compatibility
  rejection in the test.
- Tests run without OpenCode, a real provider, a storage service or internet.
- `npm run verify` passes.

## Non-goals

Define pipeline-specific payload schemas, select persistence, implement artifact
migration or change ADR-0009.

## Evidence expected

Schema and fixture diffs plus passing deterministic test and repository verify
output.

## Escalation

Stop if implementation requires changing the accepted envelope semantics or
introducing a new package/module boundary.

