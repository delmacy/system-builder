# M1 — Vertical Contract Spine

## Objective

Define and validate the smallest versioned contract chain needed to express one synthetic vertical factory cycle without implementing the product applications.

## Ordered tasks

1. TASK-002: local harness handoff smoke proof.
2. TASK-003: contract envelope/versioning ADR and conventions.
3. TASK-004: ProcessMirror contract.
4. TASK-005: BusinessRecipe contract.
5. TASK-006: SystemAnalysis contract.
6. TASK-007: SystemDefinition contract.
7. TASK-008: AssemblyPlan and downstream release-boundary contracts.

Each task remains serial because downstream semantics depend on the preceding public contract. Contract work uses the architecture tier; schema implementation may be split into cheaper follow-up tasks only after the decision is explicit.

## Exit gate

- every artifact has a stable identity/version/provenance envelope;
- schemas and fixtures validate deterministically;
- traceability IDs survive the full contract chain;
- no runtime depends on Builder authoring internals;
- one synthetic chain can be validated end-to-end without compilation or deployment behavior.

## Non-goals

UI, persistence, production compiler, deployment, real Gestão Técnica migration and parallel implementation of all suite modules.
