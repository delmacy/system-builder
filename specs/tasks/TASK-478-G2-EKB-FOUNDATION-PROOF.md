---
id: TASK-478
title: Prove integrated EKB foundation and predecessor coexistence
status: ready
priority: 478
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-477
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
  - packages/contracts/elicitation-knowledge-base/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-478-G2-EKB-FOUNDATION-PROOF.md
  - project_docs/execution_planning/G2-EKB-CONTRACT-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction A with one integrated deterministic proof that the EKB foundation preserves question revision, typed information state, evidence/currentness, contradictions/routing and multidimensional sufficiency without absorbing predecessor or domain authority.

# Required change
Expose the coherent public `elicitation-knowledge-base` contract surface and add a focused growing product proof composed only from public contracts.

# Acceptance criteria
- historical occurrence remains pinned to producing question revision and context;
- all C1 information kinds remain distinct and governed transition lineage is explicit;
- AI-origin material cannot become authoritative solely by confidence/repetition;
- evidence/provenance/currentness/locality remain qualification, not truth/authority amplification;
- competing records and contradiction/unresolved route survive normalization;
- cross-capability routing preserves target owner without cloning owner truth;
- a critical blocked/conflicted/unqualified coverage dimension prevents stage sufficiency PASS;
- scalar completion cannot override critical unresolved state;
- stale evidence/current question/Fleet aggregate cannot rewrite historical/local qualified truth;
- semantic-substrate, knowledge-boundary and evidence-provenance remain unchanged and authoritative in their existing proof domains;
- no persistence, Runtime/Builder topology, provider behavior, AI execution or Production Readiness claim is introduced.

# Mandatory negative/adversarial cases
Current-question substitution; implicit information-kind promotion; Unknown coercion; contradiction winner-by-recency/confidence; N/A without rationale; stale evidence PASS; owner cloning; scalar masking; Fleet/global-to-local strengthening; predecessor reverse dependency.

# Non-goals
Construction B consumer migration, UI/Wizard, AI/provider mechanics, Brownfield importer, persistence, domain adoption, WP-03+ work.

# Escalation
Stop if the integrated proof exposes a need for destructive predecessor changes, new authority ownership, persistence or L4 topology; record bounded follow-up instead of absorbing it.