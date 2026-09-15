---
id: TASK-552
title: Define replaceable model provider binding qualification
status: completed
priority: 552
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-551
context_paths:
  - AGENTS.md
  - specs/tasks/TASK-551-G2-AI-WORKSPACE-PROVENANCE.md
  - packages/contracts/ai-mediated-assistance/**
allowed_paths:
  - packages/contracts/ai-mediated-assistance/**
  - tests/product/g2-ai-mediated-assistance-product-proof.test.ts
  - specs/tasks/TASK-552-G2-AI-PROVIDER-BINDING-QUALIFICATION.md
forbidden_paths:
  - packages/db/**
  - packages/runtime-core/**
  - apps/**
  - .github/workflows/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define replaceable model/provider binding and qualification semantics without implementing or canonizing any concrete vendor.

# Context
G2-WBS-16 requires model/provider replaceability and qualification-aware use while preserving G2-WP-06 provider ownership and the non-authoritative character of AI inference.

# Current behavior
The materialized AI workspace may reference future model/provider execution, but there is no G2-WBS-16 binding contract that independently records binding identity/revision/currentness and qualification evidence without implying concrete provider support or authority.

# Required change
Add only provider-binding references, revision/currentness and qualification evidence required by the AI-mediated contract. A binding may describe eligibility to produce a candidate but must not imply provider support, authority or Production Readiness.

# Inputs / contracts
Consume TASK-551 workspace/provenance contracts and existing provider qualification/currentness owners by reference. Provider capability, support and qualification remain owned outside G2-WP-10 and must not be inferred from model feature or API parity.

# Outputs / contracts
Replaceable provider/model binding references with explicit identity/revision/currentness and qualification evidence, plus deterministic Product Proof showing non-strengthening and no provider ownership transfer.

# Acceptance criteria
- model/provider binding is replaceable and revision-aware;
- qualification evidence is explicit and inspectable rather than inferred from feature/API parity;
- stale or UNKNOWN qualification cannot be promoted to supported/current;
- binding does not transfer provider ownership into G2-WP-10;
- candidate production remains non-authoritative;
- no concrete vendor adapter or credential behavior is introduced.

# Non-goals
Vendor SDKs, provider adapters, credentials/secrets, autonomous execution, persistence, runtime-core, apps or Production Readiness.

# Evidence expected
Deterministic Product Proof for replaceability, qualification/currentness and non-strengthening behavior.

# Implementation evidence
- `packages/contracts/ai-mediated-assistance/index.ts` references the existing provider qualification owner and records binding/model identity, revision and currentness without claiming provider support.
- Product Proof covers replaceability, exact qualification-binding lineage, stale/PARTIAL/UNKNOWN/INCONCLUSIVE/UNSUPPORTED non-strengthening and rejection of inferred support.
- No concrete provider realization, credential behavior or provider ownership transfer is introduced.

# Escalation
Any concrete provider realization or change to provider qualification ownership returns to the owning package/review instead of expanding this TASK.
