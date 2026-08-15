# P1-SPRINT-09 — Release Lifecycle

## Goal
Deliver the first testable SB-09 Release slice: immutable registration/publication of a validated ReleaseArtifact with verifiable provenance.

## Primary task
To be materialized from the Release WBS after P1-SPRINT-08 integration.

## Module
SB-09 Release.

## Dependency
P1-SPRINT-08 Compiler slice integrated.

## Branch
`sprint/P1-SPRINT-09`

## Scope target
- artifact/version identity;
- provenance links to Recipe/Definition/compiler/runtime/capability metadata available in the slice;
- ValidationEvidence association;
- minimal publication/lifecycle state;
- prohibit overwrite of a published revision.

## Test target
- publish valid artifact;
- reject duplicate/overwrite attempt;
- preserve provenance and manifest identity;
- validate lifecycle transitions;
- retrieve verifiable release metadata;
- final `npm run verify`.

## Exit proof
The compiler artifact becomes an immutable PublishedRelease with preserved validation/provenance evidence.

## Closure
Produce `P1-SPRINT-09.report.md`, open one PR to `main`, and stop for Sprint Review.
