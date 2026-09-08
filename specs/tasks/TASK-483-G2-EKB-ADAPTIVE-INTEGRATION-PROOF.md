---
id: TASK-483
title: Prove integrated adaptive EKB understanding and coexistence
status: ready
priority: 483
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-482
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-02-ELICITATION-KNOWLEDGE-BASE.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
  - packages/contracts/elicitation-knowledge-base/**
  - packages/contracts/semantic-substrate/**
  - packages/contracts/knowledge-boundary/**
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/elicitation-knowledge-base/**
  - tests/product/g2-elicitation-knowledge-base*.test.ts
  - specs/tasks/TASK-483-G2-EKB-ADAPTIVE-INTEGRATION-PROOF.md
  - project_docs/execution_planning/G2-EKB-ADAPTIVE-UNDERSTANDING-01.md
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
Close Construction B with an integrated deterministic proof across adaptive follow-up, capability-lens routing, negative-space/stakeholder coverage and derived traceability on top of the immutable Construction A foundation.

# Context
TASK-479..482 materialize the four bounded Construction B concerns. This closure task must prove their coexistence with Construction A and predecessor contracts without strengthening authority, currentness, locality, sufficiency or epistemic state and without modifying predecessor-owned contract families.

# Current behavior
Before this task, the four Construction B concerns are independently specified/proved but there is no single integrated closure proof demonstrating that their composition preserves conservative states, lineage, ownership and dependency direction across adversarial combinations.

# Required change
Add the single integrated deterministic Construction B proof, plus only minimal additive EKB contract adjustments if the proof strictly requires them, to demonstrate composition of TASK-479..482 with the immutable Construction A and predecessor authorities while preserving fail-closed state, revision/currentness/locality and dependency direction.

# Inputs / contracts
- TASK-479 adaptive follow-up contract/proof;
- TASK-480 capability-lens routing contract/proof;
- TASK-481 negative-space/stakeholder coverage contract/proof;
- TASK-482 derived traceability contract/proof;
- immutable Construction A EKB foundation and read-only predecessor semantic/knowledge/evidence contracts.

# Outputs / contracts
- integrated focused product proof under `tests/product/g2-elicitation-knowledge-base*.test.ts`;
- only minimal additive EKB contract adjustments if strictly required by the proof and within allowed paths;
- no predecessor edits, reverse dependency, persistence, runtime/service topology, UI/Wizard, provider execution or WP-03+ implementation.

# Evidence expected
The integrated proof must cover happy, negative, adversarial and recovery/coexistence cases across gap/context-driven follow-up, multi-candidate owner-preserving routing, conservative missing stakeholder/source coverage, revision/provenance/currentness-preserving derivation, HIGH/CRITICAL unresolved blockers, Fleet/local separation and immutable predecessor dependency direction. Every mandatory adversarial case below must be exercised explicitly rather than inferred from nearby assertions.

# Acceptance criteria
- follow-up selection remains gap/context/stage driven and fails inconclusive when required inputs are absent;
- lens routing never clones semantic ownership or chooses winners by ordering/confidence;
- missing stakeholder/source coverage remains conservative UNKNOWN/PARTIAL/UNTOUCHED and cannot be scalar-masked;
- derived traceability preserves source/target revisions, provenance, currentness, contradiction and epistemic state;
- HIGH/CRITICAL unresolved obligations still prevent false stage PASS;
- Fleet/global evidence cannot strengthen local coverage;
- predecessor contracts remain unchanged with no reverse dependency;
- no persistence, UI/Wizard, AI/provider execution, domain adoption, WP-03+ or Production Readiness claim is introduced.

# Mandatory adversarial cases
Missing context defaulting; owner cloning; first-match routing; missing stakeholder == N/A; no evidence == zero; stale source promoted; traceability == authority; latest-revision substitution; contradiction erased by summary; scalar completion masking.

# Non-goals
Persistence/database design, UI/Master Wizard implementation, AI/provider mechanics, Brownfield import, canonical domain adoption, authorization/trust implementation, workflow execution, provider qualification, Production Readiness closure, WP-03+ implementation, TD-P13-01..04 and unrelated findings.

# Escalation
Any need for new runtime/service topology, persistence owner, destructive predecessor edit, foreign semantic ownership, provider qualification or Production Readiness semantics must be recorded for later planning rather than absorbed.