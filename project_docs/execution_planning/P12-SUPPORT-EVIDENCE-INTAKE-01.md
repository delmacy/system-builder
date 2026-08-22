# P12-SUPPORT-EVIDENCE-INTAKE-01 — Support Evidence Intake Contract

Status: CONSTRUCTED / TASK-161..173 VERIFICATION / FINAL SPRINT REVIEW GATE
Base: `d119480e4e665f53103832da9e47dfa897d1f4e2`
Branch: `sprint/P12-SUPPORT-EVIDENCE-INTAKE-01`
Package: `P12-PACKAGE-01`
Milestone: M12
PR: #227

## Sprint Goal
Establish provider-neutral deterministic `SupportEvidenceIntake` for Observe findings and human requests/incidents/feedback, with complete provenance, fail-closed validation, lossless serialization and no resolved-value leakage; no remediation, classification, prioritization or production mutation.

## Achieved proof
`DeploymentRecord -> DeploymentObservation -> DeploymentFinding -> SupportEvidenceIntake -> complete source provenance -> fail-closed validation -> lossless serialization -> Support/Evolution evidence handoff -> no automatic production mutation -> no resolved secret/credential/CA value`

Actual P11 `DeploymentFinding` -> public P12 adapter E2E is covered; Support implementation does not import Observe internals.

## Review correction
Sprint Review found that a source kind could omit all source-specific provenance. TASK-172 requires `findingCode + observationId` for every `observe_finding` and `requestKind + actorRef + channelRef` for every `human_request`.

- initial correction `d1f73ffd02bb3bf674c771589ab25a9f26a11dc5`: CI #457 FAIL because validation precedence changed one existing negative diagnostic;
- bounded repair `84446b01b1c41fae2c20c2672f0e6df4c6b3bf3d`: preserves malformed base-field precedence while retaining mandatory provenance; CI #458 PASS.

The two-commit TASK-172 history is an explicit deviation caused by the connector refusing a force-rewrite of the failed correction commit; no scope widening occurred.

## Validation evidence
CI #429-#435 PASS; #437 PASS for TASK-168/169 cumulative head; #438 PASS for TASK-170 E2E; #456 PASS for TASK-171 closure; #457 FAIL as documented above; #458 PASS after bounded repair. CI #436 was superseded/cancelled and its content was validated by #437.

## Current gate
TASK-173 is docs-only repository-memory reconciliation. Its PR-head Deterministic CI must pass externally; after that, PR #227 is ready for the authorized human Sprint Review merge.

No P12 Sprint 2 is committed or authorized by this state.
