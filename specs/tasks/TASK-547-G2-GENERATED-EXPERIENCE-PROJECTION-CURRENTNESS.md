---
id: TASK-547
title: Define generated experience projection identity and currentness semantics
status: completed
priority: 547
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-10-GENERATED-EXPERIENCE-AI-MEDIATED-ASSISTANCE.md
  - project_docs/generation-2/packages/GENERATION_2_WORK_PACKAGE_DESIGN.md
  - packages/ui/**
  - packages/contracts/**
allowed_paths:
  - packages/contracts/generated-experience/**
  - tests/product/g2-generated-experience-projection-proof.test.ts
  - specs/tasks/TASK-547-G2-GENERATED-EXPERIENCE-PROJECTION-CURRENTNESS.md
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
Define provider/framework-neutral generated-experience projection identity and currentness semantics without allowing a rendered view to become canonical truth.

# Context
G2-WBS-15 begins from the established separation between canonical semantic/data/workflow truth and generated presentation. Construction A must make projection identity and currentness explicit before any authority or AI-mediated behavior is materialized.

# Current behavior
Existing UI and contract layers may render canonical state, but G2 has no dedicated generated-experience contract that independently records projection identity, source revision/currentness and projection revision/currentness.

# Required change
Introduce only the semantic contract needed to represent a generated projection, its canonical source references, source revision/currentness and projection revision/currentness as distinct evidence-bearing identities.

# Inputs / contracts
Existing canonical semantic, identity, data, workflow and evidence/currentness contracts remain authoritative; generated experience may reference them but must not replace or strengthen them.

# Outputs / contracts
A provider-neutral generated-experience projection contract plus deterministic Product Proof for identity, revision, currentness and historical lineage boundaries.

# Acceptance criteria
- `projection != source truth` and projection identity is distinct from entity/workflow/data identity;
- source revision/currentness and projection revision/currentness are explicit and independently stale-able;
- stale/PARTIAL/UNKNOWN/INCONCLUSIVE source evidence cannot be rendered as stronger truth;
- regeneration cannot rewrite historical projection lineage;
- local/Station/Fleet qualification is preserved when present;
- existing UI packages remain compatible and are not rewritten;
- deterministic Product Proof covers stale source, stale projection, missing source evidence and projection-ID collision.

# Non-goals
Action authorization, AI/model generation, concrete UI framework migration, persistence, apps redesign, operator surfaces or Production Readiness.

# Evidence expected
Deterministic Product Proof demonstrating independent source/projection identity and currentness, non-strengthening uncertain evidence and immutable regeneration lineage, plus exact-head repository validation.

# Escalation
If the contract requires new canonical identity, authorization, workflow, persistence or AI ownership, stop and return the finding to Sprint Review rather than expanding TASK-547.
