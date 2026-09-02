# Generation 2 — Capability Proof Matrix

Status: ACTIVE / RETROACTIVE BACKFILL REQUIRED
Authority: `ARCHITECTURE_PROOF_QUALITY_METHOD.md`

Purpose: track proof obligations for every active capability and mandatory cross-capability hypothesis. This matrix does not claim that tests already exist. It records mandatory backfill debt before Product Proof / Acceptance can close.

Legend: `BACKFILL_REQUIRED`, `PARTIAL`, `READY_FOR_ACCEPTANCE_TRANSLATION`, `N_A` (individual proof class only with rationale).

| Capability / hypothesis | Status | Minimum proof emphasis |
|---|---|---|
| Universal Capability Architecture | BACKFILL_REQUIRED | primitive reuse; semantic identity vs realization; evidence qualification; authority separation; provider-neutrality |
| Process & Application Modeling | BACKFILL_REQUIRED | model lineage/validation/migration; brownfield mapping; incomplete-model negatives |
| UI / Generated Experience / Low-code Builder | BACKFILL_REQUIRED | constrained generation; semantic binding; accessibility; no arbitrary domain mutation; rollback/diff |
| Adaptive Governed Work Surfaces | PARTIAL | nine existing proofs + Station/Role revalidation; mandatory components; personal automation authority; promotion/rollback |
| Workflow & Durable Execution | BACKFILL_REQUIRED | in-flight revision; retry/redrive; human tasks; migration/provider replacement; recovery |
| Integration & Automation | BACKFILL_REQUIRED | trigger/subscription revision; retry/DLQ/replay; receipt != domain acceptance; idempotency; provider replacement |
| Identity / Authentication / Federation | BACKFILL_REQUIRED | identity stability; authn failure/recovery; federation/trust rotation; provider substitution; assurance |
| Authorization / Policy / Organization / Multitenancy | BACKFILL_REQUIRED | non-amplifying authority; policy revision; tenant/Station isolation; temporary/delegated authority |
| Data / Schema / Migrations | BACKFILL_REQUIRED | compatibility; migration/backfill/cutover; CDC/order; normalization; rollback/recovery; provider substitution |
| Storage / Documents / Media | BACKFILL_REQUIRED | logical identity; integrity/versioning; migration; partial failure/recovery; isolation |
| Notifications / Events / Messaging | BACKFILL_REQUIRED | attempts; ordering; duplicate/replay; provider migration; subscription state; local replay closure |
| Build / Dependency Graph / Reproducibility | BACKFILL_REQUIRED | deterministic graph; partial rebuild; cache qualification; reproducibility; runner substitution; local closure |
| Artifact / Release / SBOM / Provenance | BACKFILL_REQUIRED | digest vs release identity; SBOM/provenance; signing/trust; promotion/rollback; registry replacement |
| Deployment / Environment / Runtime | BACKFILL_REQUIRED | desired/effective/observed; rollout/readiness; provider replacement; scaling/placement; autonomy; rollback |
| Observability / Operations / Incident | BACKFILL_REQUIRED | freshness/coverage; INCONCLUSIVE; SLI/SLO; incident/remediation lineage; telemetry failure; recovery |
| Extension / Plugin / Marketplace Architecture | BACKFILL_REQUIRED | admission/trust; install/wire/enable/activate; authority; update/revocation; compatibility |
| Governance / Compliance / Audit | BACKFILL_REQUIRED | control applicability; evidence integrity; exception/expiry; tamper evidence; remediation authority; retention |
| Secrets / Configuration / Environment Portability | BACKFILL_REQUIRED | reference vs value; rotation/revocation; workload identity; stale cache; migration; local recovery closure |
| Provider / Binding / Capability Negotiation | BACKFILL_REQUIRED | discovery→compatibility→admission→binding→satisfaction; fallback; cutover; incompatible provider; coexistence |
| Standards / Interoperability / API Contracts | BACKFILL_REQUIRED | backward/forward compatibility; conformance vs claim; downgrade; extensions; provider replacement |
| Lifecycle / Versioning / Evolution / Migration | BACKFILL_REQUIRED | revision vectors; coexistence; readiness freshness; migration; routing rollback vs state recovery; withdrawal |
| Security / Resilience / Failure Recovery | PARTIAL | explicit proof set below: semantic recovery, split-brain fencing, readiness invalidation, compromised/stale trust, non-amplifying degraded mode, persisted/in-flight reconciliation, local recovery closure |
| AI-native Engineering / Agents / Approvals | BACKFILL_REQUIRED | bounded authority; approval lineage; adversarial input; deterministic validation; rollback; model substitution |
| Developer / Operator Experience / Self-hosting | BACKFILL_REQUIRED | installation simplicity; offline closure; upgrade/recovery; provider config safety; operator errors; observability |
| Architecture Reconciliation as a Capability | BACKFILL_REQUIRED | drift detection; freshness; non-actuating detection; disposition; repair proof; unknown cases |
| Executable Capability Composition & Cumulative Context | PARTIAL | semantic operation graph; cumulative context; authorized projections; branch/merge; provenance; adapters; Gate semantics |
| Transaction / Consistency / Concurrency | PARTIAL | invariants; concurrent mutation; duplicate/reorder/replay; atomicity; compensation; split-brain/offline reconciliation |
| Topology / Build / Runtime Realization | PARTIAL | simple collapse; split/scale; build once/replicate many; provider substitution; partial build; topology migration |
| Tenant Fleet / Edge / Ingress / Routing | PARTIAL | 20+ routing; unknown-host denial; isolation; hybrid placement; TLS; tenant migration; edge substitution |
| Commercial Metering / Entitlements / Rating / Billing / Payment | BACKFILL_REQUIRED | entitlement; usage evidence; rating reproducibility; quotas; billing evidence; payment boundary; dispute/replay |

## Security / Resilience / Failure Recovery — explicit cycle-4 proof obligations
1. **Positive semantic recovery:** inject primary realization loss; recover within declared RTO/RPO and prove restored data position, schema/workflow/provider revision vector, trust validity and domain postconditions before normal write authority resumes.
2. **Negative/adversarial split brain:** isolate the current writer without proving it dead; attempt automatic promotion of a second writer. Acceptance requires fencing/lease/quorum/epoch evidence or refusal/read-only degradation; simultaneous unqualified writers must be impossible.
3. **Failure/recovery distinction:** demonstrate separately that failover, routing rollback, persisted-state restore and forward-fix produce distinct lineage/evidence and cannot masquerade as each other.
4. **Readiness invalidation:** qualify a migration/provider transition as READY, then inject topology/state/trust change. The prior readiness evidence must become stale/inapplicable and require requalification before actuation.
5. **Compromised/stale trust:** restore from an otherwise valid local checkpoint containing revoked/stale credential or trust material. System must not treat artifact/state availability as proof of safe recovery; expected result is requalification, bounded degradation or `INCONCLUSIVE`.
6. **Authority non-amplification:** disconnect external providers/authority services while AGWS remains locally available. Person/Role/AI must not gain provider admin, secret access, writer promotion or canonical mutation authority; unavailable privileged actions become explicit degraded/escalated states.
7. **Persisted vs in-flight reconciliation:** recover state while durable workflows/messages/automations are mid-flight. Each execution must be classified and evidenced as resume/replay/compensate/quarantine/terminate without duplicate unauthorized effects.
8. **Qualified local closure:** recover air-gapped using a declared closure; remove one required schema/trust/checkpoint/fencing verifier and prove the system fails closed or reports `INCONCLUSIVE` rather than asserting full recovery.

These obligations also cross-test `Topology / Build / Runtime Realization` and `Tenant Fleet / Edge / Ingress / Routing`: failover/cutover must preserve tenant identity/routing while changing backend placement, and failure-domain isolation must prevent one tenant/Station recovery from acquiring another tenant's writer or authority context.

## Backfill policy
1. Later revisits add proofs without reducing research depth.
2. Capability Synthesis consolidates duplicate proofs/shared suites.
3. Planning E cannot close with unresolved `BACKFILL_REQUIRED`/`PARTIAL` entries without explicit disposition and executable mapping.
4. Work Packages inherit proof obligations by dependency.
5. Proofs target architectural claims, not code coverage.

## Cross-capability growing product proof set
Canonical growing set remains defined in `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: greenfield simple system, provider replacement, brownfield coexistence, durable workflow evolution, cumulative context, transaction/consistency, simple-to-mature topology, 20+ tenant fleet/edge routing, Station/AGWS authority, offline/autonomous closure, build/release provenance and failure/recovery.