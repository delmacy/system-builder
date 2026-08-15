# Product 10-Sprint Plan — first testable vertical slice

Status: **COMMITTED EXECUTION SEQUENCE after Sprint Mode is merged**.

Purpose: move product development forward in small, independently testable Sprint branches while preserving the canonical product chain. The sequence intentionally prioritizes reaching a deployable synthetic vertical slice before expanding to Observe/Support.

The suite map defines the product chain as Mirror → Recipe → Analysis → Design → Catalog → Assembly → Validation → Compiler → Release → Deploy → Observe → Support. ProcessMirror already has its first contract task completed, so this ten-Sprint sequence starts at Recipe and drives the product through Deploy.

## Global Sprint rules

For every Sprint:

- branch from synchronized `main` as `sprint/<SPRINT-ID>`;
- one primary product TASK per Sprint, except an explicitly declared contract-enabler Sprint;
- keep implementation bounded to the Sprint goal;
- run TASK-declared validation during execution;
- run `npm run verify` before Sprint closure;
- produce a short Sprint Report from `project_docs/schedule/SPRINT_REPORT_TEMPLATE.md`;
- open one PR to `main` and stop for Sprint Review;
- do not automatically begin the next Sprint before the previous Sprint is integrated.

## Sprint 01 — Recipe contract

**ID:** `P1-SPRINT-01`

**Primary module:** SB-02 Recipe

**Primary TASK:** `TASK-005 — BusinessRecipe Contract`

**Goal:** publish the technology-independent BusinessRecipe contract with traceability to ProcessMirror evidence.

**Test target:** valid/invalid fixtures, version/extension rules, evidence-reference validation, repository-wide verification.

**Exit proof:** a synthetic ProcessMirror-derived approved recipe validates deterministically.

## Sprint 02 — Analysis contract

**ID:** `P1-SPRINT-02`

**Primary module:** SB-03 Analysis

**Primary TASK:** `TASK-006 — SystemAnalysis Contract`

**Goal:** publish the contract that maps approved recipe requirements to capability matches, gaps and adaptation findings.

**Test target:** match/gap/custom-need fixtures, requirement traceability, rejection of premature concrete assembly choices, repository-wide verification.

**Exit proof:** a synthetic BusinessRecipe produces a machine-validatable SystemAnalysis fixture chain.

## Sprint 03 — Design contract

**ID:** `P1-SPRINT-03`

**Primary module:** SB-04 Design

**Primary TASK:** `TASK-007 — SystemDefinition Contract`

**Goal:** publish the logical client-system definition without Builder internals or environment secrets.

**Test target:** boundary tests, secret exclusion, Recipe/Analysis traceability, versioned SystemDefinition fixtures, repository-wide verification.

**Exit proof:** ProcessMirror → BusinessRecipe → SystemAnalysis → SystemDefinition validates end to end.

## Sprint 04 — Downstream contract spine

**ID:** `P1-SPRINT-04`

**Primary area:** cross-module contract enabler for SB-06 through SB-10

**Primary TASK:** `TASK-008 — Assembly and Release Boundary Contracts`

**Goal:** define the minimal downstream public contracts needed to test factory execution without prematurely implementing the engines.

**Test target:** synthetic linked fixtures for AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord; provenance/hash/environment separation tests; end-to-end contract-chain test.

**Exit proof:** a single synthetic artifact chain validates from ProcessMirror through DeploymentRecord.

**Why this is the one exception:** the existing repository task intentionally establishes several downstream boundaries together. Splitting it before execution would weaken the already-accepted M1 contract-spine design.

## Sprint 05 — Catalog minimal registry

**ID:** `P1-SPRINT-05`

**Primary module:** SB-05 Catalog

**Task to materialize:** minimal provider-neutral capability/component registry and deterministic lookup.

**Scope target:** start with software capabilities/components only; keep business/software catalog separation explicit.

**Test target:** register/query versioned entries, dependency metadata, compatibility identity, duplicate rejection and provider-neutral lookup.

**Exit proof:** the SystemAnalysis fixture can resolve at least one capability candidate from a synthetic Catalog without accessing implementation internals.

## Sprint 06 — Assembly minimal resolver

**ID:** `P1-SPRINT-06`

**Primary module:** SB-06 Assembly

**Task to materialize:** deterministic minimal AssemblyPlan resolver over synthetic Catalog entries.

**Scope target:** capability/provider selection, direct dependencies, deterministic conflict/gap diagnostics and BOM/source references; no broad optimizer.

**Test target:** successful resolution fixture, missing capability, incompatible version, deterministic repeated output and cycle/conflict rejection where supported by the bounded slice.

**Exit proof:** SystemDefinition + Catalog fixtures deterministically produce a valid AssemblyPlan or a reproducible diagnostic.

## Sprint 07 — Validation traceability gate

**ID:** `P1-SPRINT-07`

**Primary module:** SB-07 Validation

**Task to materialize:** minimal ValidationEvidence engine for the first vertical slice.

**Scope target:** schema/version checks, Recipe → Analysis → Definition → Assembly traceability matrix, declared test results and deterministic gate decision.

**Test target:** valid chain passes; broken traceability, invalid contract version and failed declared test produce explicit failure evidence.

**Exit proof:** the first assembled synthetic system receives a reproducible PASS/FAIL ValidationEvidence artifact.

## Sprint 08 — Compiler synthetic artifact

**ID:** `P1-SPRINT-08`

**Primary module:** SB-08 Compiler

**Task to materialize:** smallest deterministic compiler/package path from AssemblyPlan to ReleaseArtifact.

**Scope target:** materialize a minimal generated project/artifact, environment schema without secrets, content manifest and hashes; do not build the full production compiler.

**Test target:** repeat build from identical inputs produces equivalent manifest/content identity; secret values are structurally excluded; invalid AssemblyPlan is rejected.

**Exit proof:** a validated AssemblyPlan produces a reproducible synthetic ReleaseArtifact.

## Sprint 09 — Release lifecycle

**ID:** `P1-SPRINT-09`

**Primary module:** SB-09 Release

**Task to materialize:** minimal immutable release registration and lifecycle.

**Scope target:** register artifact/version/provenance/ValidationEvidence, publish a PublishedRelease and prohibit overwriting an already-published revision.

**Test target:** publish, duplicate/overwrite rejection, provenance preservation, lifecycle transition validation and manifest retrieval.

**Exit proof:** the compiler artifact becomes an immutable PublishedRelease with verifiable provenance.

## Sprint 10 — Deploy dry-run vertical proof

**ID:** `P1-SPRINT-10`

**Primary module:** SB-10 Deploy

**Task to materialize:** environment binding plus deterministic local/dry-run deployment proof.

**Scope target:** bind PublishedRelease to an Environment profile, resolve configuration references without mutating the artifact, execute bounded health/acceptance checks and emit DeploymentRecord. Real production infrastructure provisioning is out of scope.

**Test target:** release/environment compatibility, secret-reference separation, successful dry-run, failed acceptance check, rollback/result recording and immutable release identity.

**Exit proof:** the repository can demonstrate the complete first synthetic vertical slice:

`ProcessMirror → BusinessRecipe → SystemAnalysis → SystemDefinition → Catalog resolution → AssemblyPlan → ValidationEvidence → ReleaseArtifact → PublishedRelease → DeploymentRecord`.

## After Sprint 10

Do not broaden the first ten Sprints to force Observe or Support before the deployable chain works. The next natural sequence is:

- SB-11 Observe — consume Deployment/runtime events and produce findings;
- SB-12 Support/Evolution — incident/change loop back into product/process improvement;
- then richer runtime, UI, persistence and real deployment capabilities according to dependency readiness.

## Reporting contract

Each Sprint closes with a compact report containing:

- Sprint ID and goal;
- primary TASK and commit(s);
- files/components changed;
- validation commands and result;
- test cases added/passed;
- architecture/scope deviations, if any;
- discoveries/backlog findings;
- final status: `READY_FOR_REVIEW`, `BLOCKED` or `FAILED`.

The report is the human review summary; detailed evidence remains in code, tests, contracts and CI.