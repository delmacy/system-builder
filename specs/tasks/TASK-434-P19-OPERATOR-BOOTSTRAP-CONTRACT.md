---
id: TASK-434
title: Define operator bootstrap contract and prerequisites
status: ready
priority: 434
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-OPERATOR-BOOTSTRAP-01.md
  - project_docs/19-pre-alpha-productization/WBS.md
  - package.json
  - scripts/**
  - packages/contracts/factory-boundary/**
  - tests/product/**
allowed_paths:
  - packages/contracts/factory-boundary/**
  - tests/product/**
  - specs/tasks/TASK-434-P19-OPERATOR-BOOTSTRAP-CONTRACT.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/postgres/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the smallest stable operator-bootstrap input/prerequisite/result contract needed to wrap the integrated canonical factory E2E command without introducing a second orchestration model.

# Context
WBS 19.1.3 already provides the supported deterministic `factory:e2e` path. WBS 19.2.1 requires only the minimum maintainer/operator bootstrap over that existing source of truth.

# Current behavior
The repository exposes the canonical factory E2E journey, but no dedicated bootstrap boundary yet declares and validates maintainer prerequisites/configuration before invoking it.

# Required change
Add only the additive contract/schema required to declare supported prerequisites and operator configuration, validate them deterministically, and represent the bootstrap result boundary. Reuse existing canonical factory input/lineage types instead of duplicating them.

# Inputs / contracts
Existing canonical factory E2E input/lineage contracts plus explicitly declared bootstrap prerequisite/configuration fields. Business/factory identity remains owned by the existing factory-boundary contracts.

# Outputs / contracts
A deterministic bootstrap validation/result boundary that references canonical factory identities, rejects undeclared or invalid configuration, and does not expose protected values.

# Acceptance criteria
- prerequisites/config fields are explicit, deterministic and schema-validatable;
- canonical business/factory inputs remain owned by existing contracts and are referenced rather than copied;
- missing/unknown/invalid prerequisite or config data fails closed before journey invocation;
- secrets are neither persisted nor included in success/error output;
- no runtime launch, publication/deployment execution, persistence, network dependency or new bounded context;
- positive, malformed/unknown input, missing capability/config and deterministic validation proofs exist;
- declared validations pass.

# Negative/adversarial cases
Missing required prerequisite, unknown config key, malformed value, stale/substituted canonical factory input and attempted secret echo must fail or be excluded deterministically before side effects.

# Non-goals
CLI wiring, mutable progress jobs, production UX, environment provisioning, runtime materialization/handoff, daemon/service topology, unrelated TD/findings or inferred L4.

# Evidence expected
Focused product/contract proof for valid bootstrap validation, malformed or unknown input, missing prerequisite/capability, stale or substituted canonical input, deterministic repeatability, and absence of secret echo or external side effects; all declared validation commands must pass.

# Escalation
Stop if a new bounded context, runtime authority, topology change or destructive public-contract replacement is required.
