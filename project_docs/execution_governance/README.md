# Execution Governance Package

## Purpose
This package is the control layer between the approved System Builder scope/DAG and autonomous execution by AgentFactory/OpenCode.

It follows PMI/PMBOK control principles without turning delivery into document-heavy bureaucracy. Policies are intended to become machine-checkable wherever practical.

## Authority
Existing ADRs, contracts/specifications, Scope Baseline, WBS/WBS Dictionary and approved DAG remain authoritative. This package controls execution; it does not silently redefine product scope or architecture.

## Package
- `REQUIREMENTS_TRACEABILITY.md` — RTM and end-to-end traceability.
- `READINESS_AND_DONE.md` — Definition of Ready and Definition of Done.
- `QUALITY_MANAGEMENT_PLAN.md` — quality gates and independent verification.
- `RISK_MANAGEMENT.md` — risk register, escalation and risk-based routing.
- `AGENT_RACI.md` — authority and responsibility matrix.
- `CHANGE_CONTROL.md` — operational change classification and handling.
- `CONFIGURATION_MANAGEMENT.md` — baselines, contracts, versions and migrations.
- `EVIDENCE_PROTOCOL.md` — machine-readable executor handoff/result contract.
- `MODEL_ROUTING.md` — model tier selection by risk and task type.
- `AGENT_SECURITY.md` — autonomous-agent threat model and controls.
- `CAPACITY_AND_COST.md` — throughput, WIP and true delivery cost.
- `PROJECT_EXECUTION_PLAN.md` — integrated operating model.
- `EXECUTION_READINESS_REVIEW.md` — final gate before autonomous execution.

## Principle
> Scope broadly, govern explicitly, make readiness deterministic, execute narrowly, verify independently, preserve evidence, then recompute the DAG.
