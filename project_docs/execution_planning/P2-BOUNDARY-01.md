# P2-BOUNDARY-01 — Executable Boundary Hardening

Status: COMMITTED

## Sprint Goal

Harden the executable P1 factory boundaries before Runtime work by proving canonical schema conformance, establishing the canonical EnvironmentProfile contract consumed by Deploy, and consolidating deterministic canonicalization/hash behavior without changing existing artifact identities.

## Base and branch

- base: `main` at `4bd5df639329f29d71d8cfcf3e2a6c0833cb4f63` (P2-PACKAGE-01 planning merged by PR #157)
- branch: `sprint/P2-BOUNDARY-01`

## Predecessor gate

PASS. P1-PACKAGE-01 and its Integration & Technical Debt Review are merged; P2-PACKAGE-01 is merged; explicit execution authorization was received for the next Sprint.

## Committed TASKs

1. TASK-055 — canonical schema-conformance harness for executable factory outputs.
2. TASK-056 — canonical EnvironmentProfile / environment-binding contract and Deploy consumption.
3. TASK-057 — shared deterministic canonicalization/hash utility with regression vectors.

Dependency order: `TASK-054 -> TASK-055 -> TASK-056 -> TASK-057`.

## Explicit contract authority

This Sprint explicitly authorizes bounded L3 contract work only for TASK-056: defining the canonical EnvironmentProfile/environment-binding contract required by ADR-0007 and updating Deploy/tests to consume it.

This authority does not permit changing Release/Environment/Deployment separation, Builder/Runtime topology, public factory artifact semantics, or any other L4 architecture decision. Any L4 discovery stops the Sprint for ADR/human review.

## Growing integration proof

Retain the actual-module P1 vertical and extend it so emitted AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord are independently checked against canonical JSON schemas. Add canonical EnvironmentProfile conformance and prove Deploy consumes that boundary. After TASK-057, repeated vertical executions must preserve deterministic identities using the shared utility.

## Final validation

`npm run verify`

GitHub Deterministic CI is the objective remote validation. Local command execution is not claimed unless separately observed.

## Stop / escalation conditions

Stop before implementation or continuation if:

- TASK-056 requires an L4 change instead of the bounded L3 contract authorized here;
- a required edit falls outside a TASK's allowed_paths or into forbidden_paths;
- schema conformance reveals that satisfying the canonical contract requires semantic redesign rather than a bounded defect correction;
- shared canonicalization would intentionally change published identity semantics instead of preserving current canonical hashes;
- security/governance would be weakened;
- repository authorities conflict and cannot be resolved from repository memory.

Routine test/type/lint fixes within a TASK's declared scope may be corrected autonomously.
