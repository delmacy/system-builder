# P6-DURABLE-RELEASE-ARTIFACT-01 — Durable Release and Artifact Providers

Status: COMMITTED / NOT_STARTED
Package: `P6-PACKAGE-01`
Base SHA: `b6b96120dbb19b00f78b6965cb9590a680f2056f` (P6-DURABLE-CATALOG-01 merged through PR #179)
Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

## Goal

Move PublishedRelease metadata and ArtifactPayload content from process-lifetime storage to replaceable durable provider boundaries with PostgreSQL reference implementations, while preserving every currently integrated Release/ArtifactStore semantic and extending P6 durability proof across provider/process reconstruction.

## Predecessor gate

PASS:

- P6-DURABLE-CATALOG-01 merged through PR #179 at `b6b96120dbb19b00f78b6965cb9590a680f2056f`;
- durable Catalog reconstruction and unchanged Assembly integration are integrated;
- ReleaseRegistry remains process-local and ArtifactPayloadRepository remains provider-neutral with only in-memory concrete implementation;
- WBS 09.3.1 explicitly requires abstract registry/storage publication;
- no predecessor contract or architecture change is required for this Sprint.

## Authority

WBS 09 authorizes Release identity/provenance/lifecycle plus publication through abstract registry/storage. ADR-0002 and ADR-0007 remain controlling and unchanged.

This Sprint authorizes only Release-owned persistence seam/provider work, ArtifactStore provider implementation behind existing interfaces, and restart-safe integration evidence. PostgreSQL is a Factory-side reference implementation detail, not Runtime dependency or canonical architecture requirement.

## Committed TASKs

1. `TASK-094` — internal Release persistence boundary;
2. `TASK-095` — PostgreSQL reference Release provider;
3. `TASK-096` — PostgreSQL reference ArtifactPayloadRepository;
4. `TASK-097` — restart-safe durable Release + Artifact integration evidence.

Dependency order:

`TASK-094 -> TASK-095 -> TASK-096 -> TASK-097`

## Frozen predecessor semantics

Release:
- `PublishedRelease` shape remains unchanged;
- release identity remains `releaseId@version` behavior;
- duplicate publication remains fail-closed;
- `published -> deprecated -> archived` remains the only current lifecycle path;
- retrieval returns immutable/equivalent snapshots;
- artifact hash and ValidationEvidence references remain release provenance;
- no secrets/environment values enter Release.

ArtifactStore:
- `ArtifactPayloadRepository` Reader/Writer/VerifiedReader interfaces remain unchanged;
- publish normalizes/sorts file snapshots as currently defined;
- identical publication remains idempotent;
- conflicting overwrite remains explicit/fail-closed;
- missing artifact behavior remains explicit;
- per-file content hash, manifest paths and aggregate artifact hash verification remain unchanged;
- verified retrieval remains derived from the actual ReleaseArtifact identity.

## Expected growing proof

`durable Catalog predecessor -> deterministic Compiler ReleaseArtifact fixture/API -> durable PublishedRelease + ArtifactPayload publication -> reconstruct providers/process -> equivalent release metadata/lifecycle -> verified ArtifactPayload retrieval`

TASK-097 must use actual ReleaseRegistry/ArtifactPayloadRepository behavior and actual Compiler output where corresponding executable APIs already exist; it must not hand-author a parallel verification path.

## Final validation

Every TASK declares `npm run test:product` and `npm run verify`. GitHub Deterministic CI with PostgreSQL 17.6 is the objective integration evidence.

## Stop / escalation conditions

Stop and escalate if implementation requires:

- changing `PublishedRelease`, ArtifactPayload or canonical shared-contract shapes;
- changing Release identity/lifecycle policy or artifact hash verification semantics;
- modifying Compiler, Deploy, Runtime, Catalog or Assembly source;
- embedding secret/environment values into Release/artifact durable state;
- making PostgreSQL mandatory for ordinary consumers;
- modifying `.github/**` for provider proof;
- destructive/irreversible migration;
- any undeclared L3/L4 boundary change.

## Successor boundary

`P6-DURABLE-FACTORY-E2E-01` and the P6 Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED. This Sprint gives no authority to materialize or execute them.
