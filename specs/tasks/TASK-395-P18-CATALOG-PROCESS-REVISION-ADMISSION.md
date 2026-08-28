---
id: TASK-395
title: Integrate canonical process revision identity into representative catalog admission
status: blocked
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
allowed_paths:
  - packages/catalog/**
  - tests/product/**
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
Create an additive catalog helper/module that accepts process artifact/revision publication and lifecycle descriptors, canonicalizes them using the public process-versioning contract functions, and returns only stable artifact/revision/lifecycle references required by downstream WBS 18.1 handling. Caller-injected validators are not allowed.

# Acceptance criteria
- canonical public process-versioning APIs perform normalization;
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

# Blocked evidence
Fresh main `2ed098203090478c907992d56074f996fd377c08` contains the canonical implementation at `packages/contracts/process-versioning/index.ts`, but `tsconfig.json` exposes no public `@system-builder/contracts/process-versioning` path. Existing architecture policy rejects relative cross-package imports. Because this TASK's `allowed_paths` excludes `tsconfig.json` and any contracts/public-surface file, TASK-395 cannot consume the required canonical public process-versioning API without an out-of-scope public-surface change. No catalog implementation was retained; TASK-396 must not start until this blocker is resolved through an authorized bounded planning/correction gate.
