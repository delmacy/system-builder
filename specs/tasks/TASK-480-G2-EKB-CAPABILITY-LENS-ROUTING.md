---
id: TASK-480
title: Define capability lens routing without owner cloning
status: ready
priority: 480
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-479
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
  - packages/contracts/elicitation-knowledge-base/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-480-G2-EKB-CAPABILITY-LENS-ROUTING.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define capability-specific elicitation lenses and semantic routing that select relevant question families while preserving the external canonical owner of discovered predicates.

# Context
Construction B needs capability-aware elicitation without converting the EKB into a semantic owner. Routing must consume the adaptive follow-up foundation from TASK-479 while preserving existing owner, revision, locality and population boundaries.

# Current behavior
The EKB can identify unresolved follow-up needs but has no dedicated capability-lens routing contract that distinguishes lens identity from semantic-owner identity or represents ambiguous multi-owner routing without choosing a winner.

# Inputs / contracts
- TASK-479 adaptive follow-up references;
- existing EKB occurrence/revision/context and locality/population references;
- external semantic-owner references exposed by predecessor contracts without modifying those owners.

# Outputs / contracts
- additive capability-lens and routing contract(s) under `packages/contracts/elicitation-knowledge-base/**`;
- focused deterministic product proof for owner preservation, ambiguity and locality behavior;
- no canonical capability creation, authorization policy or foreign predicate ownership.

# Evidence expected
Focused proof must cover deterministic routing, lens revision identity, multiple candidate owners, cross-capability occurrence lineage, ambiguous `MULTI_CANDIDATE/INCONCLUSIVE` outcomes, locality preservation, and adversarial rejection of owner cloning, first-match/confidence winners, feature-name equivalence and Fleet-to-local strengthening.

# Acceptance criteria
- lens identity/revision is explicit and separate from semantic owner identity;
- routing may reference multiple candidate owners without copying their business predicates into EKB ownership;
- cross-capability questions preserve source occurrence and target owner refs;
- ambiguous routing yields explicit MULTI_CANDIDATE/INCONCLUSIVE rather than winner-by-order/confidence;
- locality/population qualifiers are preserved where routing depends on them;
- no 29th capability or domain authority is created.

# Negative cases
Owner cloning; first-match winner; feature-name parity used as semantic equivalence; Fleet/global route strengthening Station/local truth; lens revision rewriting historical routing.

# Non-goals
Authorization policy, provider qualification, UI navigation, persistence, WP-03+ implementation.