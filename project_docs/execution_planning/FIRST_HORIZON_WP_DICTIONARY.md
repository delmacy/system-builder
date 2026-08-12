# First Horizon — Work Package Dictionary

## Purpose
Refine the existing M1 contract spine into controlled Work Packages without replacing the authoritative task specs.

## WP-FH-01 — Artifact Envelope executable contract
- Parent: contract/provenance foundation.
- Source task: TASK-010.
- Objective: materialize the accepted ArtifactEnvelope semantics as deterministic schema, fixtures and offline validation.
- Predecessor: TASK-003 completed.
- Outputs: reusable envelope schema; valid/invalid fixtures; deterministic compatibility tests.
- Acceptance: identical to TASK-010 acceptance criteria.
- Downstream consumers: ProcessMirror and every later public artifact contract.
- Status: READY.

## WP-FH-02 — ProcessMirror public contract
- Parent: 01 Process Mirror.
- Source task: TASK-004.
- Objective: define the smallest portable ProcessMirror artifact that preserves observation/evidence semantics.
- Gates: ArtifactEnvelope public contract available and accepted for reuse.
- Outputs: schema, export, fixtures, deterministic tests.
- Downstream consumer: BusinessRecipe.
- Status: CONDITIONALLY_READY pending envelope integration gate.

## WP-FH-03 — BusinessRecipe public contract
- Parent: 02 Business Recipe.
- Source task: TASK-005.
- Objective: formalize approved business knowledge independently of software implementation.
- Gates: ProcessMirror contract passes and traceability reference is stable.
- Outputs: recipe schema/fragments, fixtures, export and tests.
- Downstream consumer: SystemAnalysis.
- Status: BLOCKED.

## WP-FH-04 — SystemAnalysis public contract
- Parent: 03 System Analysis.
- Source task: TASK-006.
- Objective: represent matches, gaps, adaptations, integrations, security and sizing findings with recipe traceability.
- Gates: BusinessRecipe public contract stable.
- Outputs: SystemAnalysis schema, fixtures, export and tests.
- Downstream consumer: SystemDefinition.
- Status: BLOCKED.

## WP-FH-05 — SystemDefinition public contract
- Parent: 04 System Design.
- Source task: TASK-007.
- Objective: define the logical source of a client system without Builder internals or secrets.
- Gates: SystemAnalysis contract stable; architecture boundaries remain consistent with accepted ADRs.
- Outputs: SystemDefinition schema, boundary fixtures/tests and export.
- Downstream consumers: Catalog/Assembly planning.
- Status: BLOCKED.

## WP-FH-06 — Assembly/Release boundary contract chain
- Parent: 06 Assembly + 09 Release/10 Deploy boundaries.
- Source task: TASK-008.
- Objective: complete the public contract spine through AssemblyPlan, validation evidence, ReleaseArtifact, PublishedRelease and DeploymentRecord.
- Gates: SystemDefinition contract stable.
- Outputs: downstream schemas, linked fixtures, end-to-end contract-chain test.
- Status: BLOCKED.

## Scope gap note
Identity/Auth, runtime engines and capability implementation are not predecessors of this M1 contract-spine horizon. They become later execution lanes. Adding them now would create false dependencies.
