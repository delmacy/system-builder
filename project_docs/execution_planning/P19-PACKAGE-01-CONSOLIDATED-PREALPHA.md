# P19-PACKAGE-01 — Consolidated Pre-Alpha Productization

Status: FORECAST / NOT MATERIALIZED
Date: 2026-08-30
Milestone: M19 Pre-Alpha Productization
Predecessor gate: P18-PACKAGE-03 canonically CLOSED
Planning baseline: `dd8b5d909df3fc82a43e0721672b11e3dddb5691`

## Package Goal
Complete the remaining bounded work from the closed M18 process-versioning foundation to a reproducible System Builder pre-alpha candidate in one Work Package. The package composes existing capabilities into one real factory journey, provides a maintainer/operator bootstrap, proves autonomous generated-runtime handoff, exercises one real dogfood process and one successor process/release evolution, and issues immutable pre-alpha evidence only after the declared acceptance gate passes.

This consolidation changes planning granularity, not architecture or product authority. It does not authorize hidden L4 redesign, unrelated debt absorption, business-authority substitution, production UX, SaaS, billing, marketplace or public-beta scope.

## Why one Package
The remaining work is now one continuous productization chain rather than three independent architecture domains. Splitting vertical composition, bootstrap/autonomous handoff and dogfood/release into separate Work Packages adds repeated package planning/review/closure boundaries while the acceptance proof is intrinsically cumulative. A single Package therefore owns the complete pre-alpha outcome while retaining Sprint-level fresh-main gates and bounded TASK manifests.

## Forecast Sprint topology
The counts below are planning hypotheses, not quotas. Sprint size and TASK count must be derived from fresh-main evidence, dependency safety, allowed/forbidden paths, max_files and reviewability. A Sprint may contain fewer TASKs; no agent may invent filler work to reach a number.

### Sprint 1 — `P19-FACTORY-JOURNEY-CONTRACT-01`
Define the canonical reference journey and its supported inputs/outputs from approved BusinessRecipe revision through Analysis/Definition, capability resolution, Assembly, Validation, Compiler, Release and Deployment. Establish fail-closed predecessor/version/lineage rules and the growing product proof.

### Sprint 2 — `P19-FACTORY-COMPOSITION-01`
Compose the existing bounded modules through public contracts. Remove hand-authored downstream fixture stitching from the reference journey and prove deterministic propagation of canonical artifact/version/provenance identity.

### Sprint 3 — `P19-FACTORY-E2E-01`
Provide a repository-supported command/API entrypoint for the complete vertical journey and prove reproducibility from a clean supported checkout/environment, including negative-path evidence for stale, incompatible, missing and lineage-broken inputs.

### Sprint 4 — `P19-OPERATOR-BOOTSTRAP-01`
Provide the minimum maintainer/operator surface: declared prerequisites and inputs, environment/config validation, deterministic invocation, progress/result envelope and actionable bounded diagnostics. This is not a production UI initiative.

### Sprint 5 — `P19-RUNTIME-MATERIALIZATION-HANDOFF-01`
Use existing Compiler/Release/Deploy/Runtime contracts to materialize and launch the generated runtime in the existing initial topology, with external configuration/secrets and immutable published artifacts.

### Sprint 6 — `P19-AUTONOMOUS-RUNTIME-CONTINUITY-01`
Prove Builder-off operation and observation, Builder restoration, lineage-preserving successor release preparation and bounded upgrade/rollback continuity without introducing a Builder runtime dependency.

### Sprint 7 — `P19-DOGFOOD-REFERENCE-PROCESS-01`
Select one bounded real maintainer-owned process, represent it through canonical approved/versioned business inputs and build/deploy it through the supported factory path. Bypassing the factory to make the demonstration pass is forbidden.

### Sprint 8 — `P19-DOGFOOD-EVOLUTION-01`
Introduce one approved successor process revision, regenerate/publish a successor system release and prove runtime upgrade/rollback while preserving process -> analysis/definition -> release -> deployment lineage and historical reconstruction.

### Sprint 9 — `P19-PREALPHA-INTEGRATION-ACCEPTANCE-01`
Run the complete pre-alpha integration gate: clean bootstrap, core and applicable heavy verification, real E2E journey, runtime autonomy, successor evolution/rollback, Release/Deploy integrity, security/trust and secret/config boundaries, diagnostics, reproducibility and explicit blocker/limitation classification. Any missing product capability returns to bounded corrective construction; review cannot become functional overflow.

### Sprint 10 — `P19-PREALPHA-DOCUMENTATION-CLOSURE-01`
If and only if Sprint 9 is GO, reconcile repository memory, operator documentation and exact reviewed evidence, and create immutable pre-alpha version/tag/release evidence tied to the reviewed commit/artifacts and explicit known limitations. If Sprint 9 is NO-GO, this Sprint remains blocked and no pre-alpha claim is made.

## TASK sizing policy
`~20 TASKs per Sprint` is an upper planning hypothesis only, not a target. Materialization must prefer the smallest dependency-safe TASK set that provides auditable commits and objective validation. TASKs must not be split artificially to inflate count or merged so broadly that authority, allowed paths or verification become ambiguous. The package may therefore finish with materially fewer than 200 TASKs.

## Growing acceptance proof
Approved/versioned BusinessRecipe -> SystemAnalysis/SystemDefinition -> capability resolution -> AssemblyPlan -> ValidationEvidence -> Compiler/ReleaseArtifact -> PublishedRelease -> DeploymentRecord -> generated autonomous Runtime -> Builder unavailable -> continued operation/observation -> Builder restored -> approved successor process revision -> successor release -> safe upgrade/rollback -> immutable pre-alpha evidence.

## Package gates
- P18-PACKAGE-03 must be canonically CLOSED before Sprint 1 materialization.
- Each Construction Sprint is materialized only after its predecessor is integrated and fresh-main revalidation confirms the next bounded slice.
- Sprint-wide exact-head Deterministic CI and applicable Heavy Product Tests remain objective review evidence.
- Any discovered L4 requirement stops the affected materialization for ADR/authority review.
- Sprint 9 is the Package Integration & Technical/Product Review gate and cannot hide implementation overflow.
- Sprint 10 is Documentation & Closure/release evidence and cannot repair product capability.

## Non-goals
Production-grade visual builder/polish; SaaS multi-tenancy; billing; marketplace; commercial/external-customer onboarding; public beta; production SLA/readiness; additional deployment topologies; generalized performance optimization; second unrelated client-system acceptance; unrelated technical debt/findings including carried TD-P13-01..04 unless separately authorized as a proven blocker.

## Completion definition
P19 closes only when a maintainer can start from documented prerequisites and canonical business inputs, reproduce one real system through the supported factory, deploy and operate the generated runtime independently of the Builder, evolve the process through a traceable successor release, execute safe upgrade/rollback, diagnose bounded failures, and point to an immutable reviewed pre-alpha candidate with explicit limitations.
