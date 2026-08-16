# P2-RUNTIME-01 — Runnable Artifact and Autonomous Runtime Bootstrap

Status: FORECAST
Package: `P2-PACKAGE-01`

## Goal

Turn the synthetic ReleaseArtifact into the first reproducible runnable client-runtime package and prove startup/health with configuration supplied externally and System Builder unavailable.

## Candidate TASKs

### TASK-058 — Minimal autonomous Runtime bootstrap/package boundary

Intent: establish the bounded Runtime bootstrap required by ADR-0002 and Autonomous Runtime WBS without coupling ordinary operation to Builder/Observe.

Expected proof:
- runtime entrypoint starts independently;
- external configuration is loaded through the canonical EnvironmentProfile/binding boundary;
- a minimal health surface is available;
- no Builder call is required for startup or health.

### TASK-059 — Compiler emits runnable Runtime package

Intent: extend Compiler materialization from a synthetic artifact to a deterministic Node runtime package suitable for the bounded autonomous proof.

Expected tests:
- same inputs produce byte/content-equivalent runtime package manifest and hashes;
- artifact contains no secret values;
- runtime/toolchain versions remain recorded in ReleaseArtifact evidence;
- generated runtime package starts using the TASK-058 bootstrap.

### TASK-060 — Autonomous startup/health proof

Intent: execute the generated Runtime from the emitted ReleaseArtifact plus external environment/configuration and prove Builder independence.

Expected tests:
- successful startup and health;
- missing required environment binding fails explicitly;
- runtime health remains independent of Builder/Observe availability;
- predecessor integration uses the actual Compiler output rather than a hand-authored runtime package.

## Dependency order

`TASK-057 -> TASK-058 -> TASK-059 -> TASK-060`

## Exit proof

`ReleaseArtifact -> runnable Runtime package -> external configuration -> autonomous startup -> health PASS`

The Sprint proves Runtime packaging and autonomy, not full generated business functionality.

## Commitment gate

This Sprint remains FORECAST until `P2-BOUNDARY-01` is merged. Before commitment, revalidate the canonical EnvironmentProfile and hash/conformance outputs, materialize TASK-058..060 with complete path/validation metadata, and freeze `sprint/P2-RUNTIME-01` from synchronized `main`.
