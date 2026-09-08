---
id: TASK-475
title: Qualify EKB records by semantic owner evidence currentness and locality
status: ready
priority: 475
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-474
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
  - packages/contracts/elicitation-knowledge-base/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-475-G2-EKB-EVIDENCE-CURRENTNESS.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/evidence-provenance/**
  - packages/contracts/knowledge-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Bind EKB question/information records to qualified owner, evidence/provenance/currentness and locality references while preserving `provenance != truth != currentness != authority`.

# Required change
Add only the structural references/qualification needed for EKB records to carry semantic owner, source/evidence refs, producing revision/currentness horizon and locality/scope using existing public semantic-substrate and evidence-provenance contracts.

# Acceptance criteria
- evidence/provenance references remain distinct from the EKB information kind and from domain authority;
- stale/unknown/insufficient currentness remains explicit and cannot silently produce current Fact/Decision/Requirement status;
- historical producing revision remains addressable when current qualification changes;
- locality/scope is explicit where material; Fleet/global evidence cannot establish Station/local currentness;
- equal provider/source values do not substitute semantic owner or canonical identity;
- predecessor semantic-substrate/evidence-provenance contracts remain unchanged.

# Negative/adversarial proof
Reject owner/revision substitution, stale evidence promotion, missing material locality/currentness and Fleet/global-to-local strengthening.

# Non-goals
Evidence collection mechanics, provider integration, persistence, contradiction resolution, sufficiency policy, domain truth adoption.

# Escalation
Stop if proof requires changing evidence-provenance semantics, creating an authority broker, provider facade or persistence topology.