---
id: TASK-250
title: Materialize deterministic renderer-agnostic generated view and form documents
status: ready
priority: 250
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-249]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-GENERATED-EXPERIENCE-RENDERING-01.md
  - packages/runtime-core/generated-view-bindings.ts
  - packages/compiler/runtime-model.ts
allowed_paths:
  - packages/runtime-core/**
  - tests/product/**
  - specs/tasks/TASK-250-P13-GENERATED-VIEW-RENDER-DOCUMENT.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Produce a deterministic renderer-agnostic Runtime document for explicitly bound generated views/forms using the integrated view kind, binding metadata and supplied record data.

# Context
Construction C closes only the remaining WBS 13.2.3 rendering gap after Construction B integrated explicit generated view bindings and authority-gated interaction. TASK-249 preserves the already-declared view kind through Compiler/RuntimeModel; this task consumes that internal projection without changing the public SystemDefinition contract or introducing UI-framework semantics.

# Current behavior
Construction B exposes explicit generated view bindings and authority-gated interaction, but Runtime has no renderer-agnostic document abstraction that materializes those bindings plus caller-supplied record data into deterministic generated view/form output.

# Inputs / contracts
- Integrated RuntimeModel generated view declarations including the view kind projected by TASK-249.
- Existing explicit generated bindings for entity, field and action references.
- Bounded caller-supplied entity record data only; no provider-resolved values or hidden defaults.

# Outputs / contracts
- A Runtime-only serializable renderer-agnostic generated view/form document.
- Output contains only explicitly declared view/entity/field/action references and bounded caller-supplied field values.
- The abstraction remains framework-neutral and does not introduce a public SystemDefinition contract.

# Required change
Add a Runtime-only materializer that consumes explicit generated bindings and bounded supplied entity record data and emits a serializable render document containing only declared view/entity/field/action references plus field values supplied by the caller.

# Acceptance criteria
- Output is deterministic and declaration-order independent.
- Only explicitly bound fields/actions appear.
- Unknown view/entity/field/action references fail closed through existing binding behavior.
- View kind is preserved; no kind/field/action is inferred from names/order.
- Missing record values remain explicitly absent/null according to the bounded representation; no implicit default business values are invented.
- Output is framework-neutral and contains no component implementation, CSS, browser runtime dependency, secret, credential or resolved binding value.
- Positive and negative product tests cover list/detail/form representative kinds where existing contract values allow them.

# Evidence expected
Product proof demonstrates deterministic list/detail/form document materialization from explicit bindings, negative fail-closed cases, framework neutrality, and absence of secret/resolved-value leakage.

# Non-goals
No React/Next/browser framework, styling/design system, HTTP delivery layer, public schema change, authorization change, persistence layer or P13-PACKAGE-03 work.

# Escalation
Stop if a public contract or L4 change is required.
