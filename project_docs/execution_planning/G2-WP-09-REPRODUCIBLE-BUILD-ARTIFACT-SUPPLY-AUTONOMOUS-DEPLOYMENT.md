# G2-WP-09 — Reproducible Build, Artifact Supply & Autonomous Deployment

Status: CONSTRUCTION A INTEGRATED / CONSTRUCTION B PLANNING AUTHORIZED
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Current fresh main: `main@3e762b18f9c8396d6df30ce9a44c82f113f1c9c2`
WBS owners: `G2-WBS-12`, `G2-WBS-13`, `G2-WBS-14`

## Package purpose
Establish provider-neutral, revisioned semantics for reproducible build, canonical artifact/release supply and autonomous deployment without collapsing build success into reproducibility, build output into canonical artifact, signature into trust/admission, or deployment acknowledgement into effective/converged runtime.

## Revalidated prerequisites
WP-01 semantic/revision/evidence, WP-04 trust, WP-05 data compatibility, WP-06 provider/locality, and WP-07 operability prerequisites are canonically closed. The package internal order remains build/material closure -> artifact/release adoption -> deployment/runtime realization.

## Construction A — integrated
Construction A owns `G2-WBS-12` and is integrated as:

`TASK-535 -> TASK-536 -> TASK-537 -> TASK-538`

Fresh-main Construction A Sprint Review PR #738 decided `PASS / CONSTRUCTION B REQUIRED`, identified no bounded rework requirement, and selected `G2-WBS-13` as the next dependency-safe target.

## Construction B — planning boundary
Construction B must materialize only the first dependency-safe `G2-WBS-13` artifact/release/SBOM/provenance lifecycle Sprint after exact revalidation of the pinned WBS/DAG/Work Package Design. TASK decomposition is not committed by this reconciliation.

## Preserved invariants
- declared dependency != resolved dependency != fetched material;
- build success != reproducibility proof;
- build output != canonical artifact != release != deployed/effective runtime;
- signature != trust/admission;
- provider/runner/registry acknowledgement != qualified authority/currentness;
- identity, revision, provenance, trust, provider qualification and locality/currentness remain explicit;
- `PARTIAL/UNKNOWN` never strengthens a claim;
- unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable;
- residual cohorts remain visible until population/currentness-qualified drainage/reconciliation;
- Product Proof remains separate from Production Readiness.

## Rolling-wave boundary
`G2-WBS-14` deployment/runtime/autonomous lifecycle is NOT materialized. Construction C remains optional/forecast only until fresh-main Construction B Sprint Review evidence proves it necessary.

## Explicit exclusions
No concrete CI vendor/runner adapter, package registry SDK, container registry realization, deployment provider/runtime implementation, DB/persistence, apps/UI, production credentials, operational capacity tuning, Production Readiness implementation, WP-10+ ownership, or DEFER/DO_NOT_BUILD finding is absorbed.