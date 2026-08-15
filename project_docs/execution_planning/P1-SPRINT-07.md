# P1-SPRINT-07 — Validation Traceability Gate

## Goal
Deliver the first testable SB-07 Validation slice: deterministic traceability/quality evidence for the synthetic vertical chain.

## Primary task
To be materialized from the Validation WBS after P1-SPRINT-06 integration.

## Module
SB-07 Validation.

## Dependency
P1-SPRINT-06 Assembly slice integrated.

## Branch
`sprint/P1-SPRINT-07`

## Scope target
- contract/schema/version checks;
- Recipe → Analysis → Definition → Assembly traceability matrix;
- declared test result recording;
- deterministic PASS/FAIL gate;
- reproducible ValidationEvidence.

## Test target
- valid chain passes;
- broken traceability fails explicitly;
- invalid/unknown required contract semantics fail;
- failed declared test produces failure evidence;
- final `npm run verify`.

## Exit proof
The synthetic assembled system receives a reproducible ValidationEvidence artifact and gate decision.

## Closure
Produce `P1-SPRINT-07.report.md`, open one PR to `main`, and stop for Sprint Review.
