# P2-BOUNDARY-01 — Executable Boundary Hardening

Status: FORECAST
Package: `P2-PACKAGE-01`

## Goal

Harden the public executable boundaries inherited from P1 before a real Runtime or external Deploy adapter depends on them.

## Candidate TASKs

### TASK-055 — Canonical schema-conformance harness

Intent: validate actual `AssemblyPlan`, `ValidationEvidence`, `ReleaseArtifact`, `PublishedRelease` and `DeploymentRecord` outputs against their canonical JSON schemas inside product tests.

Expected tests:
- positive conformance for the real P1 vertical outputs;
- negative mutation for each boundary class;
- predecessor integration through actual module producers.

### TASK-056 — Canonical EnvironmentProfile contract

Intent: define the shared Environment/Profile + binding boundary required by Deploy without embedding secret values in immutable release content.

Change level: L3 contract. Must be explicitly authorized when this Sprint is committed.

Expected tests:
- valid config/secret-reference bindings;
- reject inline secret values and malformed references;
- Deploy consumes the canonical shape rather than inventing an internal competing structure.

### TASK-057 — Shared deterministic canonicalization/hash utility

Intent: remove duplicated stable-object/hash logic from executable modules while preserving deterministic identities.

Expected tests:
- regression vectors for object-key ordering/nesting/arrays;
- equivalent inputs hash identically;
- actual P1 full-vertical identities remain reproducible after migration.

## Dependency order

`TASK-055 -> TASK-056 -> TASK-057`

## Exit proof

The real full-vertical outputs conform to canonical contracts, Deploy uses the canonical EnvironmentProfile boundary, and deterministic identity generation remains reproducible with one shared canonicalization primitive.

## Commitment gate

Before changing status to COMMITTED:

1. re-read `AGENTS.md`, state/milestone, Sprint Generation Policy, Sprint Mode and `P2-PACKAGE-01.md`;
2. materialize/revalidate TASK-055..057 with `context_paths`, `allowed_paths`, `forbidden_paths`, `max_files`, dependencies and validation commands;
3. inspect the current canonical schemas and module outputs;
4. confirm L3 authority for TASK-056;
5. create `sprint/P2-BOUNDARY-01` from synchronized `main` and freeze the manifest before implementation.
