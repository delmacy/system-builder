# Generation 2 — Capability Proof Matrix

Status: ACTIVE / RETROACTIVE BACKFILL REQUIRED
Authority: `ARCHITECTURE_PROOF_QUALITY_METHOD.md`

Purpose: track proof obligations for every active capability and mandatory cross-capability hypothesis. This matrix does not claim that tests already exist. It records the mandatory backfill debt that must be resolved before Product Proof / Acceptance can close.

Legend:
- `BACKFILL_REQUIRED` — capability predates the proof method or lacks a complete proof set.
- `PARTIAL` — some explicit proofs exist but required classes remain uncovered.
- `READY_FOR_ACCEPTANCE_TRANSLATION` — research proof obligations are sufficiently explicit to be converted into executable test plans in Planning E.
- `N_A` — only for an individual proof class with rationale, never for the whole capability by convenience.

| Capability / hypothesis | Status | Minimum proof emphasis |
|---|---|---|
| Universal Capability Architecture | BACKFILL_REQUIRED | primitive reuse across domains; semantic identity vs realization; evidence qualification; authority separation; provider-neutrality |
| Process & Application Modeling | BACKFILL_REQUIRED | mirror/recipe/definition lineage; model validation; semantic migration; brownfield mapping; negative incomplete-model cases |
| UI / Generated Experience / Low-code Builder | BACKFILL_REQUIRED | constrained generation; semantic binding; accessibility/usability; no arbitrary domain mutation; rollback/diff |
| Adaptive Governed Work Surfaces | PARTIAL | nine existing proofs + Station/Role revalidation; mandatory components; personal automation authority; promotion/rollback |
| Workflow & Durable Execution | BACKFILL_REQUIRED | in-flight revision binding; retry/redrive; human task continuity; migration; provider/runtime replacement; failure recovery |
| Integration & Automation | BACKFILL_REQUIRED | trigger/subscription revision; retry/DLQ/replay; transport receipt != domain acceptance; idempotency/correlation; provider replacement |
| Identity / Authentication / Federation | BACKFILL_REQUIRED | identity stability; authn failure/recovery; federation/trust rotation; provider substitution; session/assurance boundaries |
| Authorization / Policy / Organization / Multitenancy | BACKFILL_REQUIRED | non-amplifying authority; decision != execution authority; policy revision; tenant/Station isolation; temporary/delegated authority |
| Data / Schema / Migrations | BACKFILL_REQUIRED | schema compatibility; migration/backfill/cutover; CDC/order; state normalization; rollback/recovery; provider/storage substitution |
| Storage / Documents / Media | BACKFILL_REQUIRED | logical content identity; integrity; versioning; provider migration; partial failure; recovery; access isolation |
| Notifications / Events / Messaging | BACKFILL_REQUIRED | delivery attempts; ordering; duplicate/replay; provider migration; subscription state; local replay closure |
| Build / Dependency Graph / Reproducibility | BACKFILL_REQUIRED | deterministic graph; partial rebuild; cache qualification; reproducibility; provider runner substitution; local build closure |
| Artifact / Release / SBOM / Provenance | BACKFILL_REQUIRED | artifact digest vs release identity; SBOM/provenance correctness; signing/trust; promotion/rollback; registry replacement |
| Deployment / Environment / Runtime | BACKFILL_REQUIRED | desired/effective/observed; rollout/readiness; provider replacement; scaling/placement; runtime autonomy; rollback |
| Observability / Operations / Incident | BACKFILL_REQUIRED | evidence freshness/coverage; INCONCLUSIVE; SLI/SLO; incident/remediation lineage; telemetry failure; recovery proof |
| Extension / Plugin / Marketplace Architecture | BACKFILL_REQUIRED | admission/trust; install/wire/enable/activate separation; sandbox/authority; update/revocation; provider/host compatibility |
| Governance / Compliance / Audit | BACKFILL_REQUIRED | control applicability; evidence package integrity; exception/expiry; audit tamper evidence; remediation authority; retention |
| Secrets / Configuration / Environment Portability | BACKFILL_REQUIRED | secret reference vs value; rotation/revocation; workload identity; stale cache; provider migration; local recovery closure |
| Provider / Binding / Capability Negotiation | BACKFILL_REQUIRED | discovery->compatibility->admission->binding->effective satisfaction; fallback; cutover; partial/incompatible provider; coexistence |
| Standards / Interoperability / API Contracts | BACKFILL_REQUIRED | backward/forward compatibility; conformance vs claim; negotiation/downgrade; extension namespaces; provider replacement |
| Lifecycle / Versioning / Evolution / Migration | BACKFILL_REQUIRED | revision vectors; mixed-version coexistence; readiness freshness; migration; routing rollback vs state recovery; withdrawal/drainage |
| Security / Resilience / Failure Recovery | BACKFILL_REQUIRED | threat/failure injection; degraded authority; failover/restore/forward-fix; split-brain prevention; compromised trust; RPO/RTO plus semantic conformance |
| AI-native Engineering / Agents / Approvals | BACKFILL_REQUIRED | bounded agent authority; approval lineage; hallucination/adversarial input; deterministic validation gates; rollback; provider/model substitution |
| Developer / Operator Experience / Self-hosting | BACKFILL_REQUIRED | installation simplicity; offline/self-host closure; upgrade/recovery; provider configuration safety; operator error paths; observability |
| Architecture Reconciliation as a Capability | BACKFILL_REQUIRED | drift detection; evidence freshness; non-actuating detection; governed disposition; repair proof; false-positive/unknown cases |
| Executable Capability Composition & Cumulative Context | PARTIAL | semantic operation graph; cumulative context; minimum authorized projections; branch/merge; provenance; adapter boundary; Gate semantics |
| Transaction / Consistency / Concurrency | PARTIAL | invariants; concurrent mutation; duplicate/reorder/replay; atomicity boundaries; compensation; split-brain/offline reconciliation |
| Topology / Build / Runtime Realization | PARTIAL | simple collapse; split/scale; build once/replicate many; provider substitution; partial build; topology migration; simple operations |
| Tenant Fleet / Edge / Ingress / Routing | PARTIAL | 20+ customer routing; unknown-host denial; shared-runtime isolation; hybrid placement; TLS lifecycle; tenant migration; edge-provider substitution |
| Commercial Metering / Entitlements / Rating / Billing / Payment | BACKFILL_REQUIRED | entitlement correctness; usage evidence; rating reproducibility; quota enforcement; billing evidence; provider payment boundary; dispute/replay |

## Backfill policy

1. Later revisits should add proof obligations to the selected capability when this can be done without reducing research depth.
2. Capability Synthesis must consolidate duplicate proofs and identify shared conformance suites.
3. Planning E must not close while any active capability remains `BACKFILL_REQUIRED` or `PARTIAL` without explicit rationale and executable acceptance mapping.
4. Work Packages must inherit proofs by dependency; proof obligations are part of scope/acceptance, not post-hoc QA.
5. Proofs must target architectural claims, not merely code coverage.

## Cross-capability growing product proof set

The canonical growing set is defined in `ARCHITECTURE_PROOF_QUALITY_METHOD.md` and currently includes: greenfield simple system, provider replacement, brownfield coexistence, durable workflow evolution, cumulative context, transaction/consistency, simple-to-mature topology, 20+ tenant fleet/edge routing, Station/AGWS authority, offline/autonomous closure, build/release provenance and failure/recovery.
