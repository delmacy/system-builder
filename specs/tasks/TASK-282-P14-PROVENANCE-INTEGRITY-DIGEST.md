---
id: TASK-282
title: Compute deterministic provenance integrity digest
status: ready
priority: 282
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-281]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-INTEGRITY-FOUNDATION-01.md
  - packages/deterministic/index.ts
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - packages/deterministic/**
  - tests/product/**
  - specs/tasks/TASK-282-P14-PROVENANCE-INTEGRITY-DIGEST.md
forbidden_paths: [.github/**, docs/adr/**]
max_files: 8
validation: [npm run test:product, npm run check:tasks, npm run check:architecture, npm run verify]
---
# Objective
Compute integrity digests from the canonical provenance representation.
# Context
WBS 14.3.1 requires integrity metadata where necessary using existing deterministic hash conventions.
# Current behavior
Generic digest capability exists but is not bound to provenance canonicalization.
# Required change
Expose the smallest provenance-specific digest computation using the algorithm authorized by TASK-280 and canonicalization from TASK-281.
# Inputs / contracts
Canonical provenance representation and integrity descriptor.
# Outputs / contracts
Deterministic digest metadata suitable for later verification.
# Acceptance criteria
Same canonical input yields same digest; changed input changes digest; unsupported algorithm fails explicitly; output contains no sensitive/provider/storage data.
# Non-goals
No signatures, PKI, authorization, remote attestation or query storage.
# Evidence expected
Known-value and mutation product tests plus repository verification.
# Escalation
Stop if cryptographic signing/key management or L4 infrastructure becomes necessary.