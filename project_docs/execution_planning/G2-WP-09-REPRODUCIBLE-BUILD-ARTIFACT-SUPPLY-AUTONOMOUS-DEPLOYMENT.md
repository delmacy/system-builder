# G2-WP-09 — Reproducible Build, Artifact Supply & Autonomous Deployment

Status: CONSTRUCTION A INTEGRATED / CONSTRUCTION B ACTIVE
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Planning base: `main@d5478b4cb48c7b601ab151d2021d8bfca6ead8ff`
WBS owners: G2-WBS-12, G2-WBS-13, G2-WBS-14

## Package purpose
Establish provider-neutral, revisioned semantics for reproducible build, canonical artifact/release supply and autonomous deployment without collapsing build success into reproducibility, build output into canonical artifact, signature into trust/admission, or deployment acknowledgement into effective/converged runtime.

## Construction A — integrated
G2-WBS-12 is integrated as TASK-535..538. Fresh-main Construction A Sprint Review PR #738 decided PASS / CONSTRUCTION B REQUIRED with no bounded rework.

## Construction B — materialized first Sprint
G2-WBS-13 is materialized only as `TASK-539 -> TASK-540 -> TASK-541 -> TASK-542`: canonical artifact identity/adoption; SBOM/provenance qualification; release adoption/coexistence/residual drainage; integrated Product Proof. TASK-539 is INTEGRATED by PR #743 on `main@71745ce78d9e9b40760a0dadc1f5d31d573cc118`. TASK-540 is READY; TASK-541..542 remain predecessor-gated.

## Preserved invariants
Declared/resolved/fetched dependencies remain distinct; build success != reproducibility proof; build output != canonical artifact != release != deployed/effective runtime; signature != trust/admission; provider/runner/registry acknowledgement != qualified authority/currentness; identity, revision, provenance, trust, provider qualification and locality/currentness remain explicit; PARTIAL/UNKNOWN never strengthens a claim; unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable; residual cohorts remain visible until population/currentness-qualified drainage/reconciliation; Product Proof remains separate from Production Readiness.

## Rolling-wave boundary
G2-WBS-14 deployment/runtime/autonomous lifecycle is NOT MATERIALIZED. Construction C remains optional/forecast until fresh-main Construction B Sprint Review evidence proves it necessary.

## Explicit exclusions
No concrete CI/registry/signing/deployment provider realization, DB/persistence, apps/UI, production credentials, operational capacity tuning, Production Readiness implementation, WP-10+ ownership or DEFER/DO_NOT_BUILD finding is absorbed.
