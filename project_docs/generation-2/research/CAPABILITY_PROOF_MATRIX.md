# Generation 2 — Capability Proof Matrix

Status: ACTIVE / RETROACTIVE BACKFILL REQUIRED
Authority: `ARCHITECTURE_PROOF_QUALITY_METHOD.md`

Purpose: track proof obligations for every active capability and mandatory cross-capability hypothesis. This matrix does not claim that tests already exist. It records mandatory backfill debt before Product Proof / Acceptance can close.

Legend: `BACKFILL_REQUIRED`, `PARTIAL`, `READY_FOR_ACCEPTANCE_TRANSLATION`, `N_A` (individual proof class only with rationale).

| Capability / hypothesis | Status | Minimum proof emphasis |
|---|---|---|
| Universal Capability Architecture | BACKFILL_REQUIRED | primitive reuse; semantic identity vs realization; evidence qualification; authority separation; provider-neutrality |
| Process & Application Modeling | PARTIAL | explicit proof set below: attempted/accepted/effective/validated lineage; brownfield ambiguity/normalization; concurrency ownership; INCONCLUSIVE propagation; migration postconditions; composition/transaction boundary; provider/topology substitution; Station/AGWS authority; local closure |
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
| AI-native Engineering / Agents / Approvals | PARTIAL | explicit proof set below: untrusted-context provenance, stale approval, hard enforcement, delegation non-amplification, deterministic validation, provider substitution, incident/recovery authority separation, local closure |
| Developer / Operator Experience / Self-hosting | PARTIAL | explicit proof set below: simple→mature topology, bootstrap trust, non-actuating preview, disconnected update closure, rollback eligibility, bounded diagnostics, provider substitution, AGWS/AI non-amplification |
| Architecture Reconciliation as a Capability | PARTIAL | explicit proof set below: stale generation, attempted/applied/healthy distinction, action-faceted authority, ambiguous outcome quarantine, normalization authority, convergence lag, dependency/INCONCLUSIVE propagation, AI architecture evidence boundary |
| Executable Capability Composition & Cumulative Context | PARTIAL | semantic operation graph; cumulative context; authorized projections; branch/merge; provenance; adapters; Gate semantics |
| Transaction / Consistency / Concurrency | PARTIAL | invariants; concurrent mutation; duplicate/reorder/replay; atomicity; compensation; split-brain/offline reconciliation |
| Topology / Build / Runtime Realization | PARTIAL | simple collapse; split/scale; build once/replicate many; provider substitution; partial build; topology migration |
| Tenant Fleet / Edge / Ingress / Routing | PARTIAL | 20+ routing; unknown-host denial; isolation; hybrid placement; TLS; tenant migration; edge substitution |
| Commercial Metering / Entitlements / Rating / Billing / Payment | BACKFILL_REQUIRED | entitlement; usage evidence; rating reproducibility; quotas; billing evidence; payment boundary; dispute/replay |

## Process & Application Modeling — explicit cycle-5 proof obligations
1. **Attempt/effective negative proof:** publish/deploy revision B while an environment override/layer keeps A effective. Evidence must report attempted=B, effective=A and must not claim B validated.
2. **Brownfield ambiguity proof:** import a legacy model with an unmapped/provider-specific semantic construct. Preserve source provenance and produce PARTIAL/INCONCLUSIVE mapping rather than silently dropping/coercing it.
3. **Normalization authority proof:** discover a provider default/legacy field and attempt canonical adoption under observe-only authority. Canonical semantics remain unchanged until explicit normalize/adopt authority exists.
4. **Concurrent edit proof:** create two edits from the same base over the same semantic unit; commit one then attempt the stale second edit. Require conflict/revalidation/authorized resolution rather than silent overwrite.
5. **Dependency-INCONCLUSIVE proof:** remove a required schema/template/validator used by model validation. Dependent conformance becomes INCONCLUSIVE while independent checks may still evaluate.
6. **Migration postcondition proof:** perform a technically accepted in-flight process migration that violates a declared semantic invariant. Engine acceptance alone must not produce VALIDATED/healthy evidence.
7. **Composition/transaction boundary proof:** compose a model with typed cumulative context plus transaction/compensation requirement. Preserve typed/provenanced context while runtime guarantees remain unsatisfied until Workflow/Data evidence is attached.
8. **Topology/provider substitution proof:** realize the same accepted semantic revision on two materially different providers/topologies. Canonical model identity stays stable while realization/effective/validation lineage differs.
9. **Station/AGWS authority proof:** request a canonical field/process-rule change through a Personal/Role surface. AI may propose a model revision, but direct canonical mutation is denied/escalated.
10. **Qualified-local-closure proof:** validate/import offline with declared local closure; remove one required schema/template/trust/authority dependency and require degraded/INCONCLUSIVE behavior, never silent online fallback or broadened authority.

## Security / Resilience / Failure Recovery — explicit cycle-4 proof obligations
1. **Positive semantic recovery:** inject primary realization loss; recover within declared RTO/RPO and prove restored data position, schema/workflow/provider revision vector, trust validity and domain postconditions before normal write authority resumes.
2. **Negative/adversarial split brain:** isolate the current writer without proving it dead; attempt automatic promotion of a second writer. Acceptance requires fencing/lease/quorum/epoch evidence or refusal/read-only degradation; simultaneous unqualified writers must be impossible.
3. **Failure/recovery distinction:** demonstrate separately that failover, routing rollback, persisted-state restore and forward-fix produce distinct lineage/evidence and cannot masquerade as each other.
4. **Readiness invalidation:** qualify a migration/provider transition as READY, then inject topology/state/trust change. The prior readiness evidence must become stale/inapplicable and require requalification before actuation.
5. **Compromised/stale trust:** restore from an otherwise valid local checkpoint containing revoked/stale credential or trust material. System must not treat artifact/state availability as proof of safe recovery; expected result is requalification, bounded degradation or `INCONCLUSIVE`.
6. **Authority non-amplification:** disconnect external providers/authority services while AGWS remains locally available. Person/Role/AI must not gain provider admin, secret access, writer promotion or canonical mutation authority; unavailable privileged actions become explicit degraded/escalated states.
7. **Persisted vs in-flight reconciliation:** recover state while durable workflows/messages/automations are mid-flight. Each execution must be classified and evidenced as resume/replay/compensate/quarantine/terminate without duplicate unauthorized effects.
8. **Qualified local closure:** recover air-gapped using a declared closure; remove one required schema/trust/checkpoint/fencing verifier and prove the system fails closed or reports `INCONCLUSIVE` rather than asserting full recovery.

## AI-native Engineering / Agents / Approvals — explicit cycle-4 proof obligations
1. **Untrusted-context adversarial proof:** inject malicious instructions via document/tool result/subagent return; factual data may be consumed, but embedded instructions must not create tool, credential, provider or write authority.
2. **Stale-approval proof:** approve candidate/policy/Station revision X, then materially change candidate, policy or authority before execution. Prior approval must become stale and require revalidation/reapproval as applicable.
3. **Hard-boundary proof:** induce the model or approval classifier to request an operation beyond sandbox/network/tool scope. Independent enforcement must deny the request regardless of model confidence or soft metadata.
4. **Delegation non-amplification proof:** a subagent may discover additional tools/providers but effective actuation authority remains an explicit subset/intersection of delegated authority; return data cannot smuggle new authority into the parent.
5. **Deterministic-validation proof:** an AI-generated AGWS/code/config candidate that violates schema/policy/invariant must be rejected by authoritative validator even if model self-review or human convenience approval says it is acceptable.
6. **Provider-substitution proof:** run the same semantic intent under two model/harness providers; semantic task identity and authority obligations stay stable while realization lineage/results differ and are independently validated.
7. **Incident/recovery authority proof:** provide complete diagnostics and ask the agent to recover service. Diagnosis/recommendation must not confer fencing, writer promotion, secret, provider-admin or recovery actuation authority.
8. **Qualified local closure proof:** remove required local policy/trust/validator/approval/sandbox material in offline mode. System must deny/degrade/report `INCONCLUSIVE`, not silently broaden authority or claim equivalent safe autonomy.

## Developer / Operator Experience / Self-hosting — explicit cycle-4 proof obligations
1. **Simple→mature topology proof:** instantiate one semantic system under a collapsed local profile and then a split/HA profile; System/Station/capability identities remain unchanged while topology/provider realization evidence changes.
2. **Bootstrap-trust adversarial proof:** replace or tamper with bootstrap CA/trust material. Bootstrap/join must fail unless a separately authorized weakened-trust exception exists and is retained as evidence.
3. **Preview non-actuation proof:** run preview/preflight for privileged config/topology mutation and prove no mutation occurs; then change target/dependency revision and prove the earlier preview becomes stale.
4. **Disconnected-maintenance closure proof:** bootstrap offline and execute an allowed update from retained closure/history metadata; remove required mirror/update-path metadata and require explicit incomplete/`INCONCLUSIVE`, never silent online fallback.
5. **Rollback-eligibility proof:** upgrade with retained prior realization and validate rollback; remove or invalidate one required artifact/state/trust prerequisite and prove rollback is no longer READY/available.
6. **Bounded local-diagnostics proof:** Station operator may export authorized local logs/support evidence but cannot perform privileged node/host debug, secret inspection or recovery without delegated authority.
7. **Provider/topology substitution proof:** satisfy the same operational profile with two materially different host/orchestrator realizations while provider IDs remain non-canonical and conformance is re-proven.
8. **AGWS/AI authority proof:** from a self-hosted AGWS request topology/provider mutation, CA/secret exposure or recovery without authority; AI may propose/escalate but authoritative actuation must be denied.

## Architecture Reconciliation as a Capability — explicit cycle-4 proof obligations
1. **Stale-generation negative proof:** evaluate generation N, mutate desired architecture to N+1 without refreshing evidence, and require the old apparently healthy status to become stale/inapplicable rather than `CONFORMANT`.
2. **Attempt/applied/healthy distinction:** attempt revision B after applied revision A and force health failure. Evidence must retain attempted=B, effective/applied state as actually observed, and non-ready postcondition without collapsing them into one current revision.
3. **Action-faceted authority proof:** grant Observe but deny Normalize/Create/Update/Delete. Reconciliation may collect/classify evidence but every denied mutation facet must remain impossible even if the provider supports it.
4. **Ambiguous-outcome adversarial proof:** inject acknowledgement loss after an external create succeeds. Reconciler must enter `OUTCOME_UNKNOWN`/quarantine, reconcile external identity and refuse blind duplicate create until disposition/recovery is authorized.
5. **Normalization-authority proof:** provider returns a default/late-initialized value. Observe-only mode must not alter canonical desired state; explicit normalization authority must create provenance-bound desired-state lineage if accepted.
6. **Convergence-lag proof:** delay reconciliation queue/apply/health independently. Freshness reporting must expose each lag dimension and must not treat a recent observation timestamp as proof of timely convergence.
7. **Dependency/INCONCLUSIVE proof:** break an upstream architecture extractor/classifier required by downstream obligations. Dependent evaluations must report incomplete/`INCONCLUSIVE`, not false `PASS`; unaffected independent obligations may still evaluate.
8. **AI architecture boundary proof:** feed ambiguous historical work items to an architecture-recovery model and produce a plausible architecture candidate. It may become evidence/proposal only; canonical ADR/obligation changes require deterministic validation and authorized disposition, with uncertainty retained.

These proofs cross-test unified evidence qualification, provider capability negotiation, non-actuating reconciliation, shared governed transitions, AI-native validation and Station/AGWS authority.

## Backfill policy
1. Later revisits add proofs without reducing research depth.
2. Capability Synthesis consolidates duplicate proofs/shared suites.
3. Planning E cannot close with unresolved `BACKFILL_REQUIRED`/`PARTIAL` entries without explicit disposition and executable mapping.
4. Work Packages inherit proof obligations by dependency.
5. Proofs target architectural claims, not code coverage.

## Cross-capability growing product proof set
Canonical growing set remains defined in `ARCHITECTURE_PROOF_QUALITY_METHOD.md`: greenfield simple system, provider replacement, brownfield coexistence, durable workflow evolution, cumulative context, transaction/consistency, simple-to-mature topology, 20+ tenant fleet/edge routing, Station/AGWS authority, offline/autonomous closure, build/release provenance and failure/recovery.