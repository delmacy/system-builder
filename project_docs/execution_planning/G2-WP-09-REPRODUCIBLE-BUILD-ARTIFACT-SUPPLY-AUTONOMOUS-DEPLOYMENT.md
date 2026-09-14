# G2-WP-09 — Reproducible Build, Artifact Supply & Autonomous Deployment

Status: CONSTRUCTION A INTEGRATED / CONSTRUCTION B INTEGRATED / CONSTRUCTION C FIRST SPRINT INTEGRATED / SPRINT REVIEW READY
Planning authority: `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`
Planning base: `main@d5478b4cb48c7b601ab151d2021d8bfca6ead8ff`
WBS owners: G2-WBS-12, G2-WBS-13, G2-WBS-14

## Package purpose
Establish provider-neutral, revisioned semantics for reproducible build, canonical artifact/release supply and autonomous deployment without collapsing build success into reproducibility, build output into canonical artifact, signature into trust/admission, or deployment acknowledgement into effective/converged runtime.

## Construction A — integrated
G2-WBS-12 is integrated as TASK-535..538. Fresh-main Construction A Sprint Review PR #738 decided PASS / CONSTRUCTION B REQUIRED with no bounded rework.

## Construction B — integrated
G2-WBS-13 is integrated as `TASK-539 -> TASK-540 -> TASK-541 -> TASK-542`: canonical artifact identity/adoption; SBOM/provenance qualification; release adoption/coexistence/residual drainage; integrated Product Proof. Fresh-main Sprint Review PR #752 decided `PASS / CONSTRUCTION C REQUIRED`.

## Construction C — first Sprint integrated
G2-WBS-14 first Sprint is integrated as `TASK-543 -> TASK-544 -> TASK-545 -> TASK-546`. TASK-543 integrated by PR #754 after bounded semantic repair making observed and effective currentness independently evidence-bearing. TASK-544 integrated by PR #758 after bounded semantic repair preventing stale/unknown/later-generation evidence from authorizing unsafe replay. TASK-545 integrated by PR #761 after bounded semantic repair requiring explicit prior generation and directionally valid roll-forward/rollback coexistence. TASK-546 integrated by PR #764 as proof-only composition of the already-owned deployment/runtime semantics. Fresh-main Construction C Sprint Review is now required before any further materialization.

## Preserved invariants
Declared/resolved/fetched dependencies remain distinct; build success != reproducibility proof; build output != canonical artifact != release != deployment != observed runtime != effective/converged runtime; signature != trust/admission; provider/runner/registry acknowledgement != qualified authority/currentness/effective truth; identity, revision, provenance, trust, provider qualification and locality/currentness remain explicit; desired/observed/effective generation/currentness remain independently evidence-bearing; PARTIAL/UNKNOWN/INCONCLUSIVE never strengthens a claim; unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable; rollback actuation != release rollback eligibility; coexistence requires explicit prior/target generation identity and directionally valid transition semantics; residual cohorts remain visible until population/currentness-qualified drainage/reconciliation; Product Proof remains separate from Production Readiness.

## Rolling-wave boundary
The materialized TASK-543..546 Construction C Sprint is integrated. No successor is promoted by this document. Concrete deployment providers, generalized topology/traffic/scaling infrastructure, hierarchical authority, DB/runtime-core rewrites, apps/UI, Production Readiness, WP-10+ ownership and DEFER/DO_NOT_BUILD findings remain outside scope until separately materialized through the authorized DAG/gates.

## CI evidence model
Exact-head evidence (`Deterministic CI`, `Heavy Product Tests`) and synthetic merge-candidate evidence (`Merge Candidate CI`) are separate obligations. A main advance invalidates an older merge-candidate proof. Workflow changes additionally require `Workflow Lint`; `npm run verify` includes `check:docs`.
