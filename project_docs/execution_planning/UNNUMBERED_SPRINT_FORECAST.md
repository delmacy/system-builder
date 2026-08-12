# Unnumbered Sprint Forecast — First Horizon

These are forecast packages, not committed sprint numbers. They are regenerated from current evidence after every sprint/review.

## Candidate — Artifact Foundation
**Goal:** produce the reusable executable ArtifactEnvelope foundation required by downstream public contracts.
- Operational prerequisite when using OpenCode: TASK-011 hotfix merged/validated.
- Primary work: WP-FH-01 / TASK-010.
- Optional parallel architecture preparation: non-conflicting ACT-02A/02B analysis for ProcessMirror, without closing WP-FH-02 before the envelope gate.
- Exit: schema + fixtures + offline deterministic tests + repository verification evidence.

## Candidate — Process Knowledge Contract
**Goal:** close a portable ProcessMirror contract against the executable envelope.
- Primary work: remaining WP-FH-02 / TASK-004 activities.
- Exit: ProcessMirror schema/export/fixtures/tests; observation vs approval boundary proven; envelope integration gate green.

## Candidate — Approved Knowledge to Analysis
**Goal:** establish the traceable bridge from approved BusinessRecipe to SystemAnalysis.
- Primary work: WP-FH-03 then WP-FH-04 when predecessor gates clear.
- May be split into two committed sprints if task sizing/review capacity indicates; the forecast groups them as one increment, not one guaranteed sprint.
- Exit: recipe and analysis contracts both machine-validatable with traceability tests.

## Candidate — System Definition Boundary
**Goal:** establish the logical source-of-system contract while preserving Recipe != SystemDefinition and Builder/Runtime separation.
- Primary work: WP-FH-05.
- Exit: SystemDefinition schema/export/fixtures/boundary tests and secret exclusion proof.

## Candidate — Assembly/Release Contract Spine
**Goal:** complete the M1 public contract chain through assembly, validation evidence, release and deployment boundaries.
- Primary work: WP-FH-06.
- Exit: linked synthetic fixtures and end-to-end contract-chain validation.

## Integration & Technical Debt Review Candidate
Trigger after the configured construction cadence or earlier if contract drift/integration failures appear.
- Re-run end-to-end contract chain.
- Check schema duplication, versioning/extension consistency, traceability continuity, architecture fitness, documentation and CI health.
- Generate explicit corrective work rather than reopening completed sprints.

## Commitment rule
Only the next candidate whose tasks are READY is committed. Later candidates remain forecast and may be split, merged or reordered when the DAG/estimates change; their approved Work Package scope remains traceable.
