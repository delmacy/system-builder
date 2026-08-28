---
id: TASK-395
title: Integrate canonical process revision identity into representative catalog admission
status: completed
priority: 395
milestone: M18
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-01.md
  - project_docs/execution_planning/P18-PROCESS-VERSION-IDENTITY-INTEGRATION-01.md
  - project_docs/18-process-versioning/WBS.md
  - project_docs/18-process-versioning/scope/README.md
  - packages/catalog/**
  - packages/contracts/process-versioning/**
  - tsconfig.json
allowed_paths:
  - packages/catalog/**
  - tests/product/**
  - tsconfig.json
  - specs/tasks/TASK-395-P18-CATALOG-PROCESS-REVISION-ADMISSION.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
  - packages/contracts/decision-boundary/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add a bounded additive catalog-facing process-revision admission seam that consumes the canonical WBS 18.1 process-versioning contracts.

# Context
Construction A established canonical process artifact/revision identity, publication evidence and lifecycle contracts. Fresh-main post-A revalidation proved that no representative production consumer currently consumes those contracts.

# Current behavior
`packages/catalog/**` exposes software catalog and knowledge admission behavior, but process business revision identity is not admitted through a catalog consumer seam. Existing `SoftwareCatalogRecord.version` is provider software SemVer and must remain unrelated.

# Inputs / contracts
- `normalizeProcessArtifactIdentity`, `normalizeProcessRevisionIdentity`, `normalizeProcessRevisionPublicationEvidence` and `normalizeProcessRevisionLifecycleDescriptor` from the public process-versioning contract;
- WBS 18.1.1–18.1.3 and P18 Package boundaries;
- existing catalog public behavior as backward-compatibility surface.

# Outputs / contracts
An additive catalog-facing WBS 18.1 admission result exposing only canonical artifact/revision/lifecycle references needed by later Construction B tasks, with no semantic-change or process-to-system authority.

# Required change
Create an additive catalog helper/module that accepts process artifact/revision publication and lifecycle descriptors, canonicalizes them using the public process-versioning contract functions, and returns only stable artifact/revision/lifecycle references required by downstream WBS 18.1 handling. Caller-injected validators are not allowed. Ensure the existing public process-versioning package surface is resolvable through the repository TypeScript path mapping used by production package imports.

# Acceptance criteria
- canonical public process-versioning APIs perform normalization;
- the public `@system-builder/contracts/process-versioning` surface resolves through repository TypeScript configuration without relative cross-package imports;
- artifactRef, revisionRef, revisionNumber, previousRevisionRef and lifecycle truth remain explicit and payload-minimal;
- malformed fields, extra payload/content fields and inconsistent publication/lifecycle identity fail closed;
- existing SoftwareCatalogRegistry registration/resolution behavior is unchanged;
- process business revision identity remains distinct from `SoftwareCatalogRecord.version`;
- no semantic-diff classification, process-to-system lineage or Git-as-business-version authority is introduced;
- declared validations pass.

# Non-goals
No persistence redesign, runtime wiring, WBS 18.2 semantic change, WBS 18.3 lineage, Decision Boundary change or L4 authority.

# Evidence expected
Product tests with positive canonical admission plus malformed/extra-field and software-SemVer-confusion negatives; exact-head Deterministic CI and Heavy Product Tests before TASK-396.

# Escalation
Stop if integration requires changing existing software catalog version semantics, WBS 18.2/18.3 behavior, storage topology or public authority boundaries.
