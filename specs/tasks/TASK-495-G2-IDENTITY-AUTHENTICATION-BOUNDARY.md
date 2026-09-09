---
id: TASK-495
title: Define revision-pinned identity and authentication boundary
status: verification
priority: 495
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-04-IDENTITY-AUTHORIZATION-TRUST.md
  - project_docs/execution_planning/G2-IDENTITY-AUTHORITY-FOUNDATION-01.md
  - project_docs/27-identity-organization-authorization/WBS.md
allowed_paths:
  - packages/contracts/identity-authorization/**
  - tests/product/g2-identity-authorization*.test.ts
  - specs/tasks/TASK-495-G2-IDENTITY-AUTHENTICATION-BOUNDARY.md
forbidden_paths:
  - packages/runtime-core/**
  - apps/**
  - packages/db/**
max_files: 6
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define additive revision-pinned identity and authentication-evidence contracts that produce actor context without granting authorization.

# Context
WP-01/WP-02 are closed. Existing P13 runtime identity/session behavior is predecessor evidence, not the Generation 2 canonical authority contract.

# Current behavior
The repository lacks a portable G2 public contract that pins identity/authentication evidence revisions while structurally separating authenticated actor context from authorization authority.

# Inputs / contracts
Stable semantic identities/revisions/currentness/locality and qualified elicitation evidence; existing identity/session contracts as coexistence evidence only.

# Outputs / contracts
Additive `packages/contracts/identity-authorization/**` identity reference, authentication evidence reference and actor-context structures with deterministic normalization.

# Required change
Create the minimum contract family for identity/authentication evidence and actor context, preserving exact historical revisions and locality while making authorization absent unless separately evaluated.

# Acceptance criteria
- identity and authentication evidence are revision-pinned;
- actor context cannot encode role/permission/policy grant;
- authentication success does not imply authorization;
- UNKNOWN/stale evidence remains explicit;
- normalization is deterministic and owner-preserving.

# Negative/adversarial proof
Reject latest-revision substitution, missing evidence defaults, locality strengthening, identity substitution and injected authorization claims.

# Evidence expected
Focused positive and adversarial Product Proof plus all declared validations on the exact TASK head.

# Non-goals
Authorization decisions, delegation, break-glass, revocation mechanics, provider/SSO implementation, persistence, runtime, trust/PKI/secrets/config/recovery.

# Escalation
Stop if the contract requires runtime/provider/persistence mutation or implicit authorization.
