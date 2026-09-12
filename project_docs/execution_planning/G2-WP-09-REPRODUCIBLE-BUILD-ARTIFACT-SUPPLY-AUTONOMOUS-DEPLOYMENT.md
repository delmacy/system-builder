# G2-WP-09 — Reproducible Build, Artifact Supply & Autonomous Deployment

Status: PLANNING & MATERIALIZATION / CONSTRUCTION A MATERIALIZED
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Planning base: `main@20c428c5ad42a9cd37d1c445bdcd549dabefcb9d`
WBS owners: `G2-WBS-12`, `G2-WBS-13`, `G2-WBS-14`

## Package purpose
Establish provider-neutral, revisioned semantics for reproducible build, canonical artifact/release supply and autonomous deployment without collapsing build success into reproducibility, build output into canonical artifact, signature into trust/admission, or deployment acknowledgement into effective/converged runtime.

## Revalidated prerequisites
WP-01 semantic/revision/evidence, WP-04 trust, WP-05 data compatibility, WP-06 provider/locality, and WP-07 operability prerequisites are canonically closed. The package internal order remains build/material closure -> artifact/release adoption -> deployment/runtime realization.

## Construction A — materialized scope
Construction A owns only the first dependency-safe `G2-WBS-12` semantic slice:

`TASK-535 -> TASK-536 -> TASK-537 -> TASK-538`

- TASK-535: declared/resolved/fetched dependency and build-material identity/lineage;
- TASK-536: toolchain/runner/input-boundary/currentness and controlled-impurity qualification;
- TASK-537: reproducibility claim, cache lineage and residual runner/cache drainage semantics;
- TASK-538: integrated Construction A Product Proof.

Only TASK-535 is READY. Successors remain predecessor-gated.

## Preserved invariants
- declared dependency != resolved dependency != fetched material;
- build success != reproducibility proof;
- cache hit != provenance/currentness proof;
- runner/toolchain/provider acknowledgement != qualified build authority;
- identity, revision, provenance, trust, provider qualification and locality/currentness remain explicit;
- `PARTIAL/UNKNOWN` never strengthens a reproducibility claim;
- unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable;
- residual runners/caches remain visible until population/currentness-qualified drainage/reconciliation;
- Product Proof remains separate from Production Readiness.

## Rolling-wave boundary
G2-WBS-13 artifact/release/SBOM/provenance/lifecycle and G2-WBS-14 deployment/runtime/autonomous lifecycle are NOT materialized by Construction A. Their Construction B/C need is decided only by fresh-main Sprint Review evidence after Construction A.

## Explicit exclusions
No concrete CI vendor/runner adapter, package registry SDK, container registry realization, deployment provider/runtime implementation, DB/persistence, apps/UI, production credentials, operational capacity tuning, Production Readiness implementation, WP-10+ ownership, or DEFER/DO_NOT_BUILD finding is absorbed.