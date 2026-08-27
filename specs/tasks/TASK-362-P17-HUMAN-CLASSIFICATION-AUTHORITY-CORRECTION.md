---
id: TASK-362
title: Bind knowledge classification decisions to canonical human authority
status: verification
priority: 362
milestone: M17
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-361
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P17-PACKAGE-01.md
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.md
  - project_docs/17-knowledge-boundary/WBS.md
  - project_docs/15-deterministic-human-probabilistic-boundary/WBS.md
  - packages/contracts/decision-boundary/**
  - packages/contracts/knowledge-boundary/**
allowed_paths:
  - packages/contracts/knowledge-boundary/**
  - tests/product/**
  - tooling/agent-harness/src/architecture.ts
  - tooling/agent-harness/tests/architecture.test.ts
  - project_docs/execution_planning/P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01.report.md
  - specs/tasks/TASK-362-P17-HUMAN-CLASSIFICATION-AUTHORITY-CORRECTION.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Correct the Construction A authority gap where a non-empty `decisionActorRef` could satisfy the Knowledge Boundary final classification record without canonical proof that the decision belongs to the existing Decision Boundary `human-decision` category.

# Context
TASK-357 and TASK-361 require assisted/probabilistic proposals to remain non-authoritative until an explicit human decision exists. The prior normalizer validated only the presence of `decisionActorRef`/`decisionRef`; therefore `model:*` or another arbitrary actor reference could be accepted as a final decision. M15 already provides the canonical Decision Boundary distinction and `verifyDecisionBoundary(... expectedCategory: "human-decision")`; this correction consumes that authority rather than inventing a new actor-prefix convention.

# Current behavior
Construction A is already integrated on `main`, but its final classification decision contract proves only that actor and decision references are non-empty. The contract does not prove that the actor occupies the canonical Decision Boundary `human-decision` category, so probabilistic/deterministic or arbitrary actor identity can be substituted without failing the Knowledge Boundary normalizer.

# Inputs / contracts
- WBS 17.1.2 manual/assisted classification authority;
- the integrated `KnowledgeClassificationDecision` and assisted-proposal contracts;
- the existing M15 Decision Boundary public API, especially `verifyDecisionBoundary`, `human-decision` category metadata and authority references;
- TASK-357/TASK-359/TASK-361 intent and proof requirements.

# Outputs / contracts
- corrected `KnowledgeClassificationDecision` requiring canonical Decision Boundary human-authority evidence;
- fail-closed normalization linking `decisionActorRef` to the verified human `authorityRef`;
- product evidence for valid human decisions and invalid deterministic/probabilistic/arbitrary substitutions;
- semantic architecture/CI protection against reintroducing actor-only classification authority.

# Required change
Require every manual or assisted `KnowledgeClassificationDecision` to carry explicit Decision Boundary input sufficient for `verifyDecisionBoundary` to validate the decision as `human-decision`. Normalize that proof through the existing Decision Boundary API, fail closed unless verification returns `valid` with category `human-decision`, and require `decisionActorRef` to match the resulting authority reference. Assisted mode must still require a distinct `proposalRef`; proposal confidence/model data remains non-authoritative.

Add a semantic architecture gate that rejects Knowledge Boundary classification decision contracts that expose `decisionActorRef` while lacking canonical Decision Boundary human-category verification. The gate must detect the prior anti-pattern without introducing a generic naming convention for human IDs.

# Acceptance criteria
- a probabilistic or deterministic Decision Boundary category cannot satisfy a manual or assisted final classification decision;
- an arbitrary non-empty actor reference alone is insufficient;
- a canonical `human-decision` verification result is required and its authority reference matches `decisionActorRef`;
- assisted proposal remains separate and non-authoritative;
- existing four knowledge classes, ownership and purpose/use contracts remain compatible;
- no Decision Boundary public contract change, WBS 17.2/17.3 behavior, promotion authority or L4 change;
- CI/architecture tests reproduce and reject the prior actor-only anti-pattern;
- declared validations pass.

# Non-goals
No new human-identity naming convention, Decision Boundary public-contract change, WBS 17.2 isolation enforcement, WBS 17.3 promotion/anonymization, consumer integration, automatic reuse authorization, provider topology/credentials, Runtime/compiler change, unrelated technical-debt absorption or L4 architecture change.

# Evidence expected
Focused product tests for manual/assisted valid human authority, deterministic/probabilistic substitution rejection, authority-reference mismatch and growing proof regression; architecture-unit fixture proving the semantic gate.

# Escalation
Stop if the correction requires changing the M15 Decision Boundary public contract, inventing a new authority source, expanding beyond WBS 17.1 classification semantics, or modifying Runtime/compiler/enforcement/promotion behavior. Otherwise complete as a bounded conformance correction before any Construction B materialization.

# Handoff gate
`P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01` remains CORRECTION_PENDING and must not enter successor Planning/Construction B or a new READY handoff until TASK-362 is completed, exact-head Deterministic CI + Heavy Product Tests pass, the correction is integrated on fresh main and repository memory is reconciled.
