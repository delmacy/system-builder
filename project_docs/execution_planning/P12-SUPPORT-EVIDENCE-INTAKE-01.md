# P12-SUPPORT-EVIDENCE-INTAKE-01 — Support Evidence Intake Contract

Status: CONSTRUCTED / TASK-161..172 VERIFICATION / SPRINT REVIEW CORRECTION GATE
Base: `d119480e4e665f53103832da9e47dfa897d1f4e2`
Branch: `sprint/P12-SUPPORT-EVIDENCE-INTAKE-01`
Package: `P12-PACKAGE-01`
Milestone: M12
PR: #227

## Sprint Goal
Establish a provider-neutral deterministic `SupportEvidenceIntake` artifact accepting Observe finding references or human-originated request/feedback evidence, preserving provenance/correlation, validating fail-closed, serializing losslessly and never carrying resolved secret/credential/CA values. No automatic remediation, classification, prioritization or production mutation.

## Predecessor gate
SATISFIED. P11 construction and package review are merged. PR #226 merged at `d119480e4e665f53103832da9e47dfa897d1f4e2` after Deterministic CI #427 / run `32548830575` PASS.

## Direction selection
Selected: **Support evidence intake contract**. Later triage/classification and resolution/evolution linkage remain FORECAST.

## Committed TASK set
TASK-161 contract; TASK-162 source model; TASK-163 validation; TASK-164 serialization; TASK-165 finding mapping; TASK-166 human capture; TASK-167 no-leak; TASK-168 positive tests; TASK-169 negative tests; TASK-170 integrated E2E; TASK-171 growing proof/closure; TASK-172 Sprint Review provenance-completeness correction.

TASK-172 was added during Sprint Review after a bounded defect was found: both source kinds could omit all source-specific provenance even though partial provenance already failed closed. It does not widen product scope.

## Growing proof achieved
`DeploymentRecord -> DeploymentObservation -> DeploymentFinding -> SupportEvidenceIntake -> complete explicit source provenance -> fail-closed validation -> lossless serialization -> downstream Support/Evolution evidence handoff -> no auto-production mutation -> no resolved secret/credential/CA value`

An actual public P11 `DeploymentFinding` is consumed by the public Support/Evolution adapter in TASK-170 E2E; Support implementation does not import Observe internals.

## Validation evidence
GitHub Deterministic CI #429 through #435 PASS for TASK-161..167, #437 PASS for the cumulative TASK-168/169 head, #438 PASS for TASK-170 E2E, and #456 PASS for the TASK-171 closure head. CI #436 was cancelled only because the PR head advanced and its content was validated by #437.

The TASK-172 correction head must pass GitHub Deterministic CI before Sprint Review can be approved for merge.

## Sprint report
`project_docs/execution_planning/P12-SUPPORT-EVIDENCE-INTAKE-01.report.md`.

## Current gate
**Sprint Review correction validation on PR #227.** No successor Sprint is committed or authorized by this state.

## Stop / escalation
Stop for canonical cross-context contract changes, L3/L4/ADR, destructive migration, security/governance weakening, Observe-internal imports, automatic remediation/triage/priority, or edits to `.github/**`, `tooling/**`, Runtime, Deploy, Release or Artifact Store.
