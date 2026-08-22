# P12-SUPPORT-EVIDENCE-INTAKE-01 — Support Evidence Intake Contract

Status: COMMITTED / MATERIALIZED (manifest + TASK specs) / NOT_YET_CONSTRUCTED
Base: `d119480e4e665f53103832da9e47dfa897d1f4e2`
Branch: `sprint/P12-SUPPORT-EVIDENCE-INTAKE-01`
Package: `P12-PACKAGE-01`
Milestone: M12

## Sprint Goal
Establish a provider-neutral deterministic `SupportEvidenceIntake` artifact accepting Observe finding references or human-originated request/feedback evidence, preserving provenance/correlation, validating fail-closed, serializing losslessly and never carrying resolved secret/credential/CA values. No automatic remediation, classification, prioritization or production mutation.

## Predecessor gate
SATISFIED. P11 construction and package review are merged. PR #226 merged at `d119480e4e665f53103832da9e47dfa897d1f4e2` after Deterministic CI #427 / run `32548830575` PASS.

## Direction selection
Selected: **Support evidence intake contract**. Later triage/classification and resolution/evolution linkage remain FORECAST.

## Committed TASK set
TASK-161 contract; TASK-162 source model; TASK-163 validation; TASK-164 serialization; TASK-165 finding mapping; TASK-166 human capture; TASK-167 no-leak; TASK-168 positive tests; TASK-169 negative tests; TASK-170 integrated E2E; TASK-171 growing proof/closure.

## Growing proof
`DeploymentRecord -> DeploymentObservation -> DeploymentFinding -> SupportEvidenceIntake -> validated/lossless downstream evidence handoff -> no auto-production mutation -> no resolved secret/credential/CA value`

## Final validation
GitHub Deterministic CI `npm run verify` on the Sprint closure head.

## Stop / escalation
Stop for canonical cross-context contract changes, L3/L4/ADR, destructive migration, security/governance weakening, Observe-internal imports, automatic remediation/triage/priority, or edits to `.github/**`, `tooling/**`, Runtime, Deploy, Release or Artifact Store.
