# Generation 2 — Canonical Capability Synthesis

Status: COMPLETE — CAPABILITY_SYNTHESIS gate artifact
Authority inputs: `RESEARCH_PIPELINE_STATE.json`, research dossiers, `FINDING_INDEX.md`, `CAPABILITY_DISCOVERY_REGISTER.md`, `REPRESENTATIVE_COVERAGE.md`, `CAPABILITY_PROOF_MATRIX.md`, Enterprise Completeness / Negative-Space artifacts, and late synthesis reconciliation evidence.

This artifact synthesizes research. It is not target-architecture Planning A authority and does not materialize Work Packages, TASKs, Construction, or product code.

## 1. Canonical capability taxonomy

Generation 2 closes research with **28 active taxonomy capabilities**: the 24 original macro-capabilities plus four evidence-backed structural promotions. Hypotheses and composition/proof constructs that were researched but not promoted remain explicit inputs, not hidden capabilities.

### A. Semantic/product-model owners
1. **Universal Capability Architecture** — shared architecture contracts/primitives; never a semantic god-object.
2. **Process & Application Modeling** — canonical process/application semantics, imports, evolution and model lineage.
3. **UI / Generated Experience / Low-code Builder** — governed semantic projections/rendering, accessibility and component realization.
4. **Adaptive Governed Work Surfaces (AGWS)** — **CORE and distinct from generic UI**; governed work surfaces over `Enterprise → Station → Role → Person`, bounded capability exposure and delegated administration; AI/AGWS cannot amplify authority.
5. **Workflow & Durable Execution** — durable process execution, timers, retries, human tasks, redrive and in-flight evolution.
6. **Integration & Automation** — triggers, subscriptions, adapters, automation execution, receipts/replay and external-system interaction.

### B. Identity, authority, governance and trust owners
7. **Identity / Authentication / Federation** — stable identity, authentication assurance, federation and trust relationships.
8. **Authorization / Policy / Organization / Multitenancy** — policy evaluation, organizational/tenant boundaries, delegated and temporary authority, Station isolation.
9. **Governance / Compliance / Audit** — obligation/control applicability, evidence, exceptions, remediation and audit lineage.
10. **Security / Resilience / Failure Recovery** — security posture, fencing, recovery qualification, degraded modes and failure semantics.
11. **Enterprise Trust / PKI / Certificate Lifecycle** — **CROSS_CUTTING / promoted / SATURATED**; trust anchors, path/revocation qualification, issuance, renewal/rotation, workload/service certificates and trust-provider substitution.
12. **Privacy / Data Governance / Retention / Legal Hold / Residency** — **CROSS_CUTTING / promoted / SATURATED**; purpose/use qualification, retention/disposition, hold precedence, residency/replication/backup obligations and provider-qualified enforcement.

### C. Data, state and communication owners
13. **Data / Schema / Migrations** — schema/data identity, compatibility, migration/backfill/cutover, CDC and data-state evolution.
14. **Storage / Documents / Media** — logical object identity, versions, integrity, media/document persistence and provider migration.
15. **Notifications / Events / Messaging** — delivery attempts, ordering, replay, deduplication, subscriptions and provider migration.
16. **Secrets / Configuration / Environment Portability** — reference/value separation, rotation/revocation, configuration realization, stale-cache behavior and portable environment binding.

### D. Build, supply chain, deployment and runtime owners
17. **Build / Dependency Graph / Reproducibility** — deterministic dependency closure, material identity/integrity, caches, rebuilds and runner/toolchain substitution.
18. **Artifact / Release / SBOM / Provenance** — artifact/release identity, SBOM/provenance, signatures, promotion/rollback and distribution trust.
19. **Deployment / Environment / Runtime** — desired/effective/observed runtime state, rollout/readiness, placement/scaling, rollback and runtime autonomy.
20. **Developer / Operator Experience / Self-hosting** — bootstrap, diagnostics, disconnected maintenance, simple-to-mature topology ergonomics and self-hosted operational closure.

### E. Provider, interoperability, lifecycle and reconciliation owners
21. **Provider / Binding / Capability Negotiation** — provider discovery, capability/support qualification, admission, binding, fallback, cutover and coexistence.
22. **Standards / Interoperability / API Contracts** — syntactic/structural/behavioral/semantic conformance, protocol contracts, compatibility and downgrade/extension boundaries.
23. **Lifecycle / Versioning / Evolution / Migration** — revision vectors, coexistence, migration readiness/currentness, withdrawal and rollback/state-recovery distinctions.
24. **Architecture Reconciliation as a Capability** — desired/product truth vs observed/effective truth, drift, ownership, conformance, ambiguous outcomes and governed normalization.

### F. Operations and economics owners
25. **Observability / Operations / Incident** — telemetry/evidence freshness and coverage, SLI/SLO, incident/remediation lineage, diagnostics and operational evidence semantics.
26. **Extension / Plugin / Marketplace Architecture** — extension admission, requested/granted/effective capabilities, lifecycle, containment, update/revocation and extension-provider boundaries.
27. **Commercial Metering / Entitlements / Rating / Billing / Payment** — entitlement, usage evidence, customer-commercial rating, billing/payment boundaries and dispute/replay.
28. **Technology Economic Governance / FinOps** — **CROSS_CUTTING / promoted / SATURATED**; provider-neutral technology-economic normalization, allocation/shared-cost policy, internal rates/cost models, budgets/forecasts, commitment exposure, unit economics and showback/chargeback evidence. It does not own statutory accounting, customer-commercial billing, or procurement execution.

## 2. Macro/sub/cross-cutting map

The taxonomy is intentionally not a flat module list. Cross-cutting semantics are realized through explicit owner/consumer relations:

- **AGWS** consumes UI, Process, Authorization, Identity, Governance, Integration, Workflow and Observability while preserving its own governed-surface semantics and `Enterprise → Station → Role → Person` hierarchy.
- **Enterprise Trust/PKI** cross-cuts Identity, Secrets, Deployment, Provider, Security and offline/self-hosting without transferring ownership of those domains.
- **Privacy/Data Governance** cross-cuts Data, Storage, Governance, Authorization, Provider and Lifecycle; deletion/migration/replication are eligible only after applicable obligation resolution.
- **Technology Economic Governance/FinOps** consumes provider, runtime, observability and qualified technical measures; economic interpretation remains separate from customer billing and statutory accounting.
- **Provider/Binding** is the realization boundary for multiple capabilities, but provider IDs/mechanisms are never canonical business identity by default.
- **Lifecycle/Versioning** supplies revision/coexistence semantics used by all owners; each owner retains domain-specific compatibility and postconditions.
- **Architecture Reconciliation** observes/qualifies desired vs effective state across owners but cannot silently normalize canonical truth without authority.
- **Security/Resilience** qualifies recovery/failure behavior across owners but does not become the owner of every underlying state transition.

Research hypotheses such as Executable Capability Composition & Cumulative Context, Transaction/Consistency/Concurrency, Topology/Build/Runtime Realization, and Tenant Fleet/Edge/Ingress/Routing remain **cross-capability architecture/proof inputs** unless Planning A establishes a distinct semantic-owner need. They are not added to the 28-capability count by synthesis alone.

## 3. Universal primitives register

These are reusable contracts repeatedly supported across independent capability research. They are primitives, not new semantic owners.

1. **Typed semantic identity vs realization identity** — canonical subject identity is distinct from provider/external/runtime realization identity.
2. **Applicability-scoped qualified claim** — a result is meaningful only for its subject/scope, producing revisions, support profile, population/coverage and evidence horizon.
3. **Revision vector** — compatibility/currentness may depend on multiple independently evolving revisions rather than one global version.
4. **Attempted → accepted → effective/applied → converged → validated lineage** — transport/provider acceptance cannot be collapsed into semantic effectiveness or health.
5. **Explicit effect disposition** — remote/ambiguous mutation outcomes require `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`; `UNKNOWN` requires reconciliation before unsafe retry.
6. **Qualified evidence envelope** — provenance, producer revision, subject, applicability, freshness/currentness, coverage, uncertainty and replay horizon remain explicit.
7. **`INCONCLUSIVE` as first-class outcome** — missing/stale/partial evidence is not silently coerced into PASS/ALLOW/healthy.
8. **Source-of-truth ownership** — observations, derived assessments and provider facts do not overwrite canonical truth without an authorized normalization/adoption transition.
9. **Capability/support vector** — portability is multidimensional; matching feature names do not imply equivalent semantics, limits, containment, offline support or authority.
10. **Provider binding contract** — discover → qualify/admit → bind → actuate → observe → reconcile → drain/withdraw.
11. **Residual cohort drainage** — cutover is incomplete while old sessions, workers, caches, subscriptions, credentials, replicas, clients or other consumers can still produce authoritative effects.
12. **Evidence/currentness horizon** — historical evidence remains replayable against producing revisions but cannot automatically qualify a changed current state.
13. **Non-amplifying authority** — effective actuation authority is explicit and bounded; AI, AGWS, delegation, provider discovery, degraded mode and offline operation cannot create new authority.
14. **Governed delegation hierarchy** — `Enterprise → Station → Role → Person`; Station capability exposure/delegated administration remains bounded by inherited policy and explicit authority.
15. **Qualified local/offline closure** — offline/autonomous operation declares retained closure and degrades/fails closed when required trust/schema/policy/artifact/evidence dependencies are absent.
16. **Rollback eligibility** — rollback is a current qualified capability dependent on retained compatible artifacts/state/trust/schema, not a historical fact.
17. **Lineage-preserving correction/supersession** — corrections supersede/annotate evidence and state without erasing the producing history required for replay/audit.
18. **Measurement/evaluation profile relation** — reusable structural relation between a consumer-owned information need, revisioned profile, source evidence and immutable qualified assessment; no universal scalar/evaluator is implied.

## 4. Representative contribution map

Representative research contributes mechanisms; System Builder retains universal semantics only where multi-representative convergence exists.

| Representative family | Primary contribution retained | Product-specific mechanism not canonized |
|---|---|---|
| Kubernetes / cloud-native controllers | desired/effective state, reconciliation, readiness, generation, rollout, certificate/runtime rotation | Kubernetes resource/controller shapes as universal domain model |
| Crossplane / provider controllers | managed-vs-external identity, provider binding, ambiguous create reconciliation | provider-specific annotations/external-name conventions |
| Durable workflow engines | durable execution, retries/redrive, in-flight state and version coexistence | one engine's history/event API as canonical process model |
| OpenAPI / HTTP / gRPC / schema ecosystems | layered interoperability, idempotency/retry boundaries, contract evolution | protocol-specific status/transport details as domain truth |
| SLSA / Sigstore / SBOM ecosystems | build material/provenance identity, admission verification and supply-chain trust | one registry/signing implementation as mandatory realization |
| SPIFFE / X.509 / ACME / PKI providers | trust-domain/path/currentness, issuance/rotation/revocation lifecycle | one CA/provider hierarchy as enterprise trust truth |
| OPA / Cedar / relationship-policy systems | explicit policy/evaluation revisions, applicability and authorization evidence | evaluator DSL/storage topology as canonical authorization model |
| OpenTelemetry / operations platforms | provider-neutral evidence vocabulary, freshness/coverage and operational observation | vendor health/complexity score as portable truth |
| FinOps Framework / FOCUS / OpenCost / cloud cost systems | normalized economic evidence, allocation conservation, rates, amortization/unit economics | provider invoice/category taxonomy as canonical enterprise economics |
| GDPR / records-management / cloud-residency controls | purpose, retention, hold, disposition and residency obligation precedence | provider region/control names as universal privacy policy |
| Extension/plugin ecosystems | requested/granted/effective capability separation, extension lifecycle and containment diversity | marketplace-specific install/update APIs as universal extension semantics |
| Nix / Bazel / Docker / serverless/container platforms | dependency closure, reproducibility and workload-driven runtime realization | one package/container/serverless topology as required runtime form |

## 5. Contradiction and unresolved-evidence register

### Resolved contradictions/dispositions
- **Generic UI vs AGWS:** resolved by keeping AGWS distinct. Generic rendering/layout cannot erase Station/Role/Person governance, inherited mandatory components or authority boundaries.
- **Workload-driven runtime realization as capability:** **MERGE / NOT_PROMOTED**. Minimal runtime closure and profile/topology realization are obligations spanning Build, Deployment, Provider and Lifecycle.
- **Operational Profile Separation:** **required architecture contract / NOT_A_CAPABILITY**.
- **AI Evaluation / Model / Prompt / Safety Governance:** no ownerless top-level capability remains; qualification/evidence contracts merge into AI-native Engineering, Governance, Provider, Security and universal evidence primitives.
- **Economic Governance / FinOps / Procurement:** parent split. Technology Economic Governance/FinOps promoted; procurement/sourcing/vendor-contract execution remains specialized/domain; customer-commercial billing remains Commercial Metering.
- **Relative Operational Complexity / Metering / Rating:** **DO_NOT_PROMOTE** as a top-level owner. Retain multidimensional/profile-driven qualified measurement/assessment primitives; Observability owns observed evidence, Architecture Reconciliation consumes/qualifies architecture evidence, FinOps owns internal economic interpretation, Commercial Metering owns customer rating/billing.
- **Universal evaluator / universal scalar complexity score:** rejected. Generalize only qualified claim/evidence/profile structures; predicates, thresholds and semantics remain domain-owned.

### Inputs intentionally deferred to later phases
- Repository-validation questions remain for **Planning B**; synthesis does not infer present SB implementation from external research.
- Proof matrix entries marked `PARTIAL` or `BACKFILL_REQUIRED` remain authoritative obligations for **Planning E / Product Proof**, not a reason to reopen broad research.
- Exact package/module boundaries and dependency direction are **Planning A/C/D** decisions, not silently fixed here.
- Provider selections are realization decisions; synthesis preserves provider-neutral boundaries rather than choosing vendors.

No unresolved external semantic-owner gap remains that requires reopening Research Elicitation.

## 6. Symbiotic Completeness candidate matrix

| Candidate / concept | Synthesis disposition | Reason |
|---|---|---|
| Adaptive Governed Work Surfaces | **KEEP / ACTIVE CORE** | Distinct governed work-surface semantics and Station hierarchy are not reducible to generic UI. |
| Enterprise Trust / PKI / Certificate Lifecycle | **KEEP / ACTIVE CROSS_CUTTING** | Independent trust/path/issuance/rotation/revocation owner proven and saturated. |
| Privacy / Data Governance / Retention / Legal Hold / Residency | **KEEP / ACTIVE CROSS_CUTTING** | Obligation precedence and disposition/residency semantics are independent and saturated. |
| Technology Economic Governance / FinOps | **KEEP / ACTIVE CROSS_CUTTING** | Provider-neutral economic normalization/allocation/rates/unit-economics owner proven and saturated. |
| AI Evaluation / Model / Prompt / Safety Governance | **GENERALIZE + MERGE** | Qualified evaluation primitives are reusable; semantic ownership remains distributed. |
| Workload-Driven Runtime Realization | **GENERALIZE + MERGE** | Required behavior spans Build/Deployment/Provider/Lifecycle; no independent canonical truth owner. |
| Minimal Capability Runtime Closure | **GENERALIZE** | Universal proof/realization property, not semantic capability. |
| Operational Profile Separation | **KEEP AS ARCHITECTURE INPUT** | Required profile contract; not a capability. |
| Runtime Realization Evolution | **MERGE** | Lifecycle + Deployment + Provider responsibility. |
| Relative Operational Complexity Measurement/Rating | **DO_NOT_PROMOTE / GENERALIZE PROFILE PRIMITIVES** | Multidimensional consumer-owned measurement; avoid aggregation magnet/Goodhart scalar. |
| Procurement / Sourcing / Vendor Contract Execution | **SPECIALIZE / DOMAIN** | Enterprise-domain workflow; not required as universal SB platform semantic owner. |
| Provider-native marketplace/billing/trust/control mechanisms | **PROVIDERIZE** | Preserve adapter/realization mechanisms without canonical lock-in. |

Symbiotic completeness therefore means: SB has an explicit semantic owner for each universal enterprise/platform concern while external/provider systems may realize capabilities behind contracts, and simple/local systems can collapse topology without changing semantic identities or authority.

## 7. Saturation and gate report

Research authority at synthesis entry:
- 24 initial macro-capabilities.
- 28 active taxonomy capabilities after four structural promotions.
- 7 full research cycles complete.
- Enterprise Completeness / Negative-Space gate: **CLOSED / six criteria PASS**.
- Centralized proof debt: **empty**.
- Enterprise Trust/PKI: **SATURATED / 2-of-2 post-promotion no-material revisits**.
- Privacy/Data Governance: **SATURATED / 2-of-2**.
- Technology Economic Governance/FinOps: **SATURATED / 2-of-2**.
- AGWS: retained as active CORE promotion; its existing dossier/proof obligations remain authoritative.
- No pending Research Elicitation capability remains.

### Capability Synthesis gate decision
**PASS / COMPLETE.** The required synthesis products are present in this canonical artifact: taxonomy, macro/cross-cutting map, universal primitives, representative contribution map, contradiction/unresolved-evidence register, Symbiotic Completeness candidate matrix and saturation report.

This closes only `CAPABILITY_SYNTHESIS`. The next execution may enter `PLANNING_A_TAXONOMY_BOUNDARIES`; this execution does not.