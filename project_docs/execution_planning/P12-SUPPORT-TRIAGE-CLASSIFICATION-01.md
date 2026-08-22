# P12-SUPPORT-TRIAGE-CLASSIFICATION-01 — Support Triage Classification

Status: COMMITTED / MATERIALIZED / NOT_YET_CONSTRUCTED
Base: `91936363d7322c80424b67a3dcfbbcda6f98e82b`
Branch: `sprint/P12-SUPPORT-TRIAGE-CLASSIFICATION-01`
Package: `P12-PACKAGE-01`
Milestone: M12

## Sprint Goal
Establish a deterministic, provider-neutral `SupportTriageDecision` that links a validated `SupportEvidenceIntake` to an explicit `Support | Maintenance | Evolution` classification plus stable impact, criticality, SLA, priority and context references, with triage provenance and lossless validation/serialization. The Sprint records an explicit decision; it does not invent automatic scoring/classification policy, remediate, mutate production, or execute an Evolution change.

## Predecessor gate
SATISFIED. Sprint 1 PR #227 merged to `main` at `91936363d7322c80424b67a3dcfbbcda6f98e82b` after final Deterministic CI #459 PASS. Fresh-main revalidation confirms WBS 12.1.1/11.3.3 intake handoff is integrated and 12.1.2-12.1.3 are the immediate bounded gap.

## Explicit authority / change level
This Sprint explicitly authorizes an additive Support/Evolution module API exported only from `packages/support-evolution`. TASK-174 is treated as L3/additive public-module contract work and is review-gated by this Sprint. No shared `packages/contracts` schema, suite boundary, Builder/Runtime relation or L4 architecture change is authorized. No ADR is required unless execution discovers such a change.

## Policy boundary
Repository authority defines the classification set but does not define automatic priority/SLA algorithms or impact/criticality taxonomies. Therefore this Sprint carries `impactRef`, `criticalityRef`, `slaRef`, `priorityRef` and context references as explicit stable references supplied by an authorized caller. No engine infers them.

## Committed TASK set
TASK-174 contract; TASK-175 context/prioritization refs; TASK-176 validation; TASK-177 serialization; TASK-178 intake linkage; TASK-179 no-value-leak; TASK-180 positive coverage; TASK-181 negative coverage; TASK-182 Observe-origin E2E; TASK-183 human-origin E2E; TASK-184 closure/growing proof.

Dependency order:
`174 -> 175 -> 176 -> 177 -> 178 -> 179 -> {180,181} -> {182,183} -> 184`

## Growing proof expected
`DeploymentRecord -> DeploymentObservation -> DeploymentFinding -> SupportEvidenceIntake -> SupportTriageDecision(classification + context refs) -> validated/lossless triage evidence -> no automatic remediation or production mutation`

Human path:
`request|incident|feedback -> SupportEvidenceIntake -> explicit SupportTriageDecision -> validated/lossless triage evidence`

## Final validation
`npm run verify` on the Sprint closure head plus GitHub Deterministic CI on the Sprint PR head.

## Stop / escalation
Stop for automatic classification/scoring policy, direct Evolution execution, production mutation, changes to Observe/Deploy/Runtime/Release/shared contracts, destructive migration, security/governance weakening, or any undeclared L3/L4/ADR requirement.
