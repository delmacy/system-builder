---
id: TASK-484
title: Define revisioned analytical definition identity and typed input bindings
status: ready
priority: 484
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/execution_planning/G2-WP-03-MATHEMATICAL-SEMANTICS.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
  - packages/contracts/semantic-substrate/**
  - packages/contracts/elicitation-knowledge-base/**
allowed_paths:
  - packages/contracts/mathematical-semantics/**
  - tests/product/g2-mathematical-semantics*.test.ts
  - specs/tasks/TASK-484-G2-MATH-IDENTITY-INPUTS.md
  - project_docs/execution_planning/G2-MATH-SEMANTIC-FOUNDATION-01.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/elicitation-knowledge-base/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Introduce additive revisioned analytical-definition identity and explicit typed input bindings without acquiring source-domain truth authority.

# Context
G2-WP-01 provides semantic identity/revision/currentness/locality substrate and G2-WP-02 provides evidence semantics. This TASK is the first Construction A slice and may only add the mathematical-semantics public boundary declared by the materialized Sprint.

# Current behavior
No public mathematical-semantics contract family currently provides revisioned analytical definition identity and source-owner-preserving typed input bindings.

# Required change
Create the minimum public `mathematical-semantics` contract version and structural types/validators for stable analytical definition identity, immutable definition revision, definition kind (`EXPRESSION | RULE | MODEL | DERIVATION` or the minimum justified equivalent), and input bindings that reference explicit source identity/revision/owner and declared value type.

# Inputs / contracts
Consume only public semantic-substrate and elicitation-knowledge-base concepts needed to preserve source identity, revision, owner, evidence/currentness and locality. Do not mutate those predecessor contracts.

# Outputs / contracts
Produce additive `packages/contracts/mathematical-semantics/**` contracts plus focused deterministic proof for analytical definition identity/revision and typed source input bindings.

# Acceptance criteria
- definition identity and revision are distinct and historically addressable;
- evaluation/derivation input binds the exact producing analytical revision;
- source owner/revision is explicit and cannot be replaced by an analytical owner;
- blank/ambiguous identity, revision, owner or input kind fails closed;
- latest-revision substitution is rejected;
- equal labels or external IDs cannot collapse analytical identity;
- no predecessor contract mutation.

# Negative/adversarial proof
Reject omitted source owner/revision, producing-revision substitution, identity-kind collapse and analytical ownership strengthening.

# Non-goals
Units, precision, temporal windows, vectors, uncertainty mechanics, evaluation runtime, persistence, AI/provider execution, causality.

# Evidence expected
Focused product proof plus `npm run test:product`, `npm run check:tasks`, `npm run check:architecture`, `npm run typecheck` and `npm run verify`, all against the authoritative TASK head.

# Escalation
Stop and request bounded change control if implementation requires mutation of predecessor contracts, a new persistence/runtime/provider boundary, causal authority, or any public architecture beyond the already materialized additive `mathematical-semantics` family.
