---
id: TASK-083
title: Resolve bounded Catalog version constraints deterministically
status: ready
priority: 391
milestone: M6
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-082
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P5-PACKAGE-01.md
  - project_docs/execution_planning/P5-CATALOG-CONSTRAINTS-01.md
  - specs/tasks/TASK-082-CATALOG-DEPENDENCY-REQUIREMENTS.md
  - project_docs/05-catalog/WBS.md
  - project_docs/06-assembly/WBS.md
  - packages/catalog/index.ts
  - packages/assembly/index.ts
  - tests/product/catalog-resolution.test.ts
  - tests/product/assembly.test.ts
  - specs/tasks/TASK-083-CATALOG-VERSION-CONSTRAINTS.md
allowed_paths:
  - packages/catalog/index.ts
  - tests/product/catalog-resolution.test.ts
  - specs/tasks/TASK-083-CATALOG-VERSION-CONSTRAINTS.md
forbidden_paths:
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/contracts/**
  - apps/**
  - tooling/agent-harness/**
  - docs/adr/**
  - .github/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Extend Catalog candidate resolution with a bounded deterministic version-constraint model suitable for later Assembly dependency resolution while preserving the existing exact-version request API.

# Context

TASK-082 introduces structured dependency requirements. Catalog resolution currently supports only optional exact `version` plus compatibility matching.

# Current behavior

`resolveCatalogCandidates` filters by capability, exact version when supplied, and compatibility equality. Candidate order is deterministic by capability/provider/version.

# Required change

Add bounded version-constraint matching to Catalog. The committed scope is intentionally small: support explicit `exact` and `minimum` constraints over normalized `major.minor.patch` versions. Preserve the existing `version` field as exact-match predecessor behavior.

Constraint parsing/comparison must fail explicitly for malformed versions rather than silently guessing. Do not implement ranges beyond the committed exact/minimum model.

# Inputs / contracts

TASK-082 structured requirement, Catalog resolution API, WBS 5.2.2/5.2.3 and 6.1.2.

# Outputs / contracts

Deterministic Catalog candidate filtering and reproducible unsatisfied-constraint diagnostics. No Assembly graph solving and no canonical contract change.

# Acceptance criteria

- exact constraint returns only exact matching versions;
- minimum constraint accepts normalized versions at or above the threshold;
- malformed requested/catalog versions used by constraint matching fail explicitly;
- unsatisfied bounded constraint returns a reproducible diagnostic carrying capability and normalized constraint identity;
- compatibility filtering composes deterministically with the version constraint;
- result ordering is registration-order independent;
- legacy `version: "x.y.z"` exact request behavior remains unchanged;
- no transitive dependencies, cycles or provider selection policy beyond candidate filtering is introduced.

# Non-goals

Caret/tilde/wildcard ranges, prerelease/build metadata policy, transitive closure, conflict solving, durable registries, Compiler materialization.

# Evidence expected

Positive exact/minimum tests, malformed/unsatisfied negative tests, compatibility composition and predecessor exact-resolution tests plus repository-wide verify.

# Escalation

Stop if a general SemVer policy or canonical cross-suite contract is required beyond this bounded internal Catalog model.
