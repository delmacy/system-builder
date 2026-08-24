---
id: TASK-251
title: Validate generated form input against explicit bound fields
status: ready
priority: 251
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-250]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-GENERATED-EXPERIENCE-RENDERING-01.md
  - packages/runtime-core/generated-view-bindings.ts
  - packages/runtime-core/**
allowed_paths:
  - packages/runtime-core/**
  - tests/product/**
  - specs/tasks/TASK-251-P13-GENERATED-FORM-INPUT-VALIDATION.md
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
Validate generated form input only against fields explicitly bound to the generated form/view and fail closed for unknown, duplicate or unbound input.

# Current behavior
Runtime can resolve explicit generated view bindings but does not yet provide a bounded form-input normalization/validation path tied to those explicit field bindings.

# Inputs / contracts
- The explicit generated form/view binding or renderer-agnostic document produced by prior Construction C work.
- Caller-supplied field values keyed/referenced only through explicit bound field references.
- Existing field metadata already present in the integrated runtime model; no new validation DSL or public schema semantics.

# Outputs / contracts
- A deterministic Runtime-only validation/normalization result for submitted bounded field values.
- Unknown, duplicate, ambiguous or unbound field input is rejected fail-closed with deterministic reasons.
- Output contains only bounded submitted values and references/reasons; no secret/provider-resolved values.

# Required change
Add a Runtime-only bounded form-input normalizer/validator that accepts an explicit generated binding/document and caller-supplied field values, preserving only explicitly bound fields and rejecting unbound/ambiguous field references.

# Acceptance criteria
- Unknown or unbound field input fails closed.
- Duplicate/ambiguous field input fails closed.
- No field is inferred from display order, labels or names outside explicit fieldRefs.
- No permissive type coercion or business default is invented.
- Required-field absence is reported deterministically from the already-materialized field metadata.
- Evidence/output contains references/reasons and submitted bounded values only; never credentials/secrets/resolved provider values.
- Product tests cover valid form input, missing required field, extra field and ambiguous input.

# Evidence expected
Focused product tests and repository verification prove valid bounded form input, required-field failure, extra/unbound input rejection, ambiguity rejection, deterministic output and absence of implicit coercion/defaults or sensitive leakage.

# Non-goals
Do not execute actions, mutate persistence, add public schemas, introduce UI framework behavior, add validation DSL, or broaden authority semantics.

# Escalation
Stop if satisfying this task requires new public contract semantics or L4 architecture.