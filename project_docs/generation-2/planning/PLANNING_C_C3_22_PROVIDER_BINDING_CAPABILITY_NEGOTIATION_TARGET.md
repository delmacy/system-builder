# Generation 2 — Planning C — C3.22 Provider / Binding / Capability Negotiation Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Provider / Binding / Capability Negotiation**
Decision: `C3.22`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, the Planning C entry framework, C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for Provider / Binding / Capability Negotiation, the already-decided C3 capability targets through C3.21, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

The entry state was re-read immediately before persistence and the branch head was revalidated at `9569597b9b093c92946b9e684fc98978d6a013aa`.

Constitutional distinctions remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `provider available != capability qualified`;
- `provider advertised != provider qualified != provider admitted != binding effective`;
- `same API/feature name != semantic equivalence`;
- `binding exists != authorized/effective`;
- `provider credential/scope != canonical authority`;
- `provider health != downstream effect proof`;
- `fallback configured != semantic equivalence != safe cutover`;
- `provider acknowledgement != business effect`;
- `Fleet aggregate != local binding truth`;
- `AI mapping proposal != binding/admission authority`;
- `CanonicalSemanticIdentity != Provider/External/RuntimeRealizationIdentity`;
- `attempted != accepted != applied/effective != converged != validated`;
- `provenance != truth != currentness != authority`;
- `cryptographic validity != semantic authorization`;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

## 2. Current-state anchor and target disposition

Planning B found a strong but narrow Generation 1 provider abstraction in the AI Gateway: provider-neutral model I/O, `ModelProviderAdapter`, deterministic capability/limit descriptors, explicit routing/fallback rules, fail-closed response normalization and product evidence that two adapters can preserve the tested canonical request/response semantics.

That seam is retained. What is not yet generalized in current SB is a canonical provider descriptor and binding identity, multidimensional support qualification, admission lifecycle, scoped currentness, residual-provider cohort drainage, generic remote effect disposition, reconcile-before-retry for ambiguous mutation, safe substitution/coexistence/cutover, Station-scoped administration or generalized provider evidence qualification.

C3.22 therefore adopts **KEEP + HARDEN + GENERALIZE + INTEGRATE + PROVIDERIZE MECHANICS**.

It explicitly rejects:

- provider feature-name equality as semantic equivalence;
- provider-native IDs as canonical domain identity;
- hidden/default provider authority;
- provider reachability as admission;
- provider health as domain success;
- global scalar portability/readiness scores that erase unsupported dimensions;
- automatic retry of ambiguous remote mutation without reconciliation;
- fallback as automatic substitute semantics;
- provider-specific extensions leaking into portable canonical contracts without qualification;
- generic direct physical actuation inferred from the existence of a Physical/Peripheral provider.

## 3. Target decision

**DECISION C3.22-D1 — establish a revision-qualified Provider / Binding / Capability Negotiation Plane that owns provider discovery, provider descriptor identity, support evidence, multidimensional support qualification, provider admission, canonical binding identity, realization mapping, binding lifecycle/currentness, provider substitution/coexistence/withdrawal and provider-effect evidence, while semantic capability truth, authorization, trust, domain success and lifecycle predicates remain owned by their canonical capabilities.**

The capability owns eight linked semantic planes:

1. **Provider Identity & Discovery Plane** — stable provider descriptor identity, provider revision/API/profile identity, discovery source and discovery evidence.
2. **Requirement & Support Qualification Plane** — owner-issued `CapabilityRequirement` evaluated against a provider `CapabilitySupportVector`.
3. **Admission Plane** — provider candidate qualification against authorization, governance, trust, privacy, economic, environment and operational constraints.
4. **Binding & Realization Plane** — canonical `ProviderBinding` plus explicit provider-native realization mappings and scoped parameters.
5. **Currentness & Readiness Plane** — evidence-qualified support/currentness/health/readiness with explicit applicability and validity horizon.
6. **Effect & Reconciliation Plane** — provider operation attempts, remote effect disposition and reconcile-before-retry behavior.
7. **Substitution / Coexistence / Withdrawal Plane** — candidate qualification, parallel cohorts, cutover, validation, drainage and historical retention.
8. **Extension & Brownfield Adoption Plane** — provider-specific extensions, legacy/manual provider adoption and evidence-producing normalization without semantic leakage.

No plane becomes a universal semantic owner. Provider/Binding qualifies realizations; the domain capability decides what semantic operation/result means.

## 4. Canonical identities and revision model

The target introduces or qualifies identities such as:

- `ProviderDescriptorId` and immutable `ProviderDescriptorRevisionId`;
- `ProviderProfileId` / `ProviderProfileRevisionId`;
- `ProviderDiscoveryOccurrenceId`;
- `CapabilityRequirementId` / `CapabilityRequirementRevisionId`;
- `ProviderSupportAssessmentId`;
- `ProviderAdmissionDecisionId` / `ProviderAdmissionRevisionId`;
- `ProviderBindingId` / immutable `ProviderBindingRevisionId`;
- `ProviderRealizationBindingId`;
- `ProviderOperationId` / `ProviderOperationAttemptId`;
- `ProviderReconciliationId`;
- `ProviderMigrationId` / `ProviderCutoverOccurrenceId`;
- `ResidualProviderCohortId`;
- `ProviderExtensionProfileId` / `ProviderExtensionRevisionId`.

Provider-native account IDs, subscription IDs, cluster IDs, queue names, model IDs, endpoint URLs, tenant IDs, cloud resource IDs, device IDs or protocol handles remain **realization identities** unless a semantic owner explicitly adopts them through a qualified mapping.

A single provider marketing/version string is insufficient. Revision qualification may require a sparse `RevisionVector` containing, where applicable:

- provider descriptor/profile revision;
- provider API/protocol revision;
- adapter/plugin revision;
- semantic capability requirement revision;
- binding revision;
- security/trust/credential revision;
- configuration/environment revision;
- contract/schema revision;
- provider policy/feature configuration revision;
- tenant/site/region/topology revision;
- current support/evidence horizon.

`provider version equal` does not imply `binding semantics equal`.

## 5. Discovery is evidence, not qualification

**DECISION C3.22-D2 — discovery records what a provider exposes or advertises; it does not establish semantic support, permission, trust, readiness or current applicability.**

Provider discovery may collect:

- provider identity/issuer/endpoint information;
- API groups/resources/operations;
- advertised feature/capability names;
- versions and lifecycle signals;
- constraints, quotas and limits;
- regions/locality and residency attributes;
- authentication/trust metadata;
- supported protocols/schema formats;
- provider-reported health/status;
- provider-native extensions.

Every discovered datum is source-, time-, revision- and scope-qualified. Discovery source may be a standards endpoint, provider API, documentation, configuration, marketplace metadata, administrator claim, observed Brownfield system or manually entered evidence.

Examples reinforce the boundary. Kubernetes Discovery publishes resource names, scopes, endpoint URLs and supported verbs; that is useful discovery metadata, but it does not by itself prove that an application-level semantic requirement is satisfied. OAuth/OpenID metadata similarly publishes issuer/endpoints/capabilities so a client can interact with a provider, but metadata presence alone is not a Generation 2 admission or domain-equivalence proof.

Discovery can therefore yield `DISCOVERED` or `ADVERTISED`; it cannot jump to `QUALIFIED`, `ADMITTED`, `BOUND` or `EFFECTIVE`.

## 6. Capability semantics versus provider feature names

**DECISION C3.22-D3 — canonical capability requirements are owner-defined semantic vectors; provider feature names are evidence inputs only.**

A `CapabilityRequirement` is issued by the semantic owner and may specify dimensions such as:

- semantic operation and object kind;
- success/postcondition semantics;
- input/output/schema fidelity;
- consistency/convergence requirements;
- failure and `PARTIAL/UNKNOWN` semantics;
- idempotency/retry/reconciliation requirements;
- ordering/delivery guarantees;
- lifecycle/version compatibility;
- authority/trust/security requirements;
- privacy/residency/data-handling requirements;
- evidence/audit/observability requirements;
- capacity, quota, rate, latency or SLA dimensions;
- locality/site/tenant/environment constraints;
- offline/degraded behavior;
- recovery/backup/revoke/deprovision semantics where applicable.

The provider side exposes a `CapabilitySupportVector` across matching dimensions. The target qualification result is not a boolean and supports at least:

- `SUPPORTED`;
- `PARTIAL`;
- `UNSUPPORTED`;
- `INCONCLUSIVE`.

Each dimension also records rationale/evidence/currentness and, for `PARTIAL`, the exact unsupported or degraded semantics.

A provider can advertise the same feature name as another provider and still differ in ordering, error behavior, limits, rollback, consistency, revocation, residency, offline behavior or evidence. Therefore string/name matching may accelerate discovery but never establishes portability.

## 7. Support vectors are multidimensional and non-scalar

**DECISION C3.22-D4 — support qualification remains a vector; no aggregate score may hide a required unsupported dimension.**

The support vector must preserve, where applicable:

- semantic fidelity;
- operation support;
- resource/role/scope fidelity;
- data/schema fidelity;
- lifecycle/version support;
- failure/partial/unknown semantics;
- idempotency/retry/reconciliation;
- consistency and currentness behavior;
- ordering/delivery guarantees;
- limits/rate/quota/capacity;
- locality/tenant/site/environment isolation;
- security/trust/credential constraints;
- privacy/residency/retention behavior;
- evidence/audit/observability coverage;
- recovery/backup/rollback characteristics;
- offline/degraded behavior;
- provider-specific extension dependence;
- economic/entitlement constraints where relevant.

A dashboard may summarize for navigation, but admission and binding gates must operate on the applicable required dimensions. A `95% portable` scalar cannot override one unresolved CRITICAL authority, privacy, revocation or recovery dimension.

Support evidence can expire or become stale after provider revision, account policy change, region change, credential rotation, quota/entitlement change, adapter revision, trust change or capability requirement revision.

## 8. Provider admission is a governed decision distinct from support qualification

**DECISION C3.22-D5 — a provider can be technically capable yet inadmissible for a concrete enterprise/site/environment/resource scope.**

Provider admission evaluates the qualified support vector plus external owner decisions/references for:

- canonical authorization and delegation;
- Governance/Compliance policy;
- Security/Resilience posture;
- PKI/Trust requirements;
- Privacy/Data Governance/Residency constraints;
- Secrets/Configuration references;
- environment/site/Station constraints;
- Technology Economic Governance / FinOps constraints;
- lifecycle/support-window constraints;
- operational readiness and recovery obligations.

Provider/Binding references those decisions; it does not redefine them.

Admission result supports at least:

- `ADMITTED`;
- `ADMITTED_WITH_CONSTRAINTS`;
- `REJECTED`;
- `INCONCLUSIVE`;
- `SUSPENDED`;
- `WITHDRAWN`.

Admission is scope-qualified. A provider admitted for Enterprise A / Station X / environment production / resource class R is not globally admitted for all tenants, sites or resources.

`credential works != provider admitted` and `provider admitted != operation authorized`.

## 9. Binding is a revisioned semantic-to-realization contract

**DECISION C3.22-D6 — `ProviderBinding` is the explicit relation between a canonical capability requirement/semantic subject and an admitted provider realization for a bounded scope and revision vector.**

A binding records, where applicable:

- canonical capability/semantic-owner references;
- requirement revision;
- provider descriptor/profile revision;
- provider admission decision reference;
- tenant/enterprise/site/Station/environment/resource scope;
- provider account/project/subscription/resource realization references;
- adapter/protocol/contract revision;
- secret/config/trust references, never secret values;
- capability support assessment reference;
- allowed operation subset;
- limits/quotas and applicable horizon;
- currentness and evidence profile;
- fallback/coexistence policy reference;
- lifecycle state and supersession lineage.

Binding lifecycle is explicitly:

`discovered -> assessed -> qualified -> admitted -> bound -> active/effective -> degraded/suspended -> draining -> withdrawn`.

Not every provider needs every state, but the architecture may not collapse `discovered`, `advertised`, `qualified`, `admitted`, `bound` and `effective` into a single boolean.

## 10. Provider credentials and trust remain foreign owner truth

Provider/Binding may reference credentials, sessions, certificates, trust anchors, identity federation and secret/config material, but their values and authority semantics remain owned by Identity, Authorization, Trust/PKI and Secrets/Configuration.

A binding can become inapplicable because:

- credentials expired or were revoked;
- account/tenant scope changed;
- trust anchors/certificates rotated;
- identity federation mapping changed;
- authorization/policy revision changed;
- provider account was deleted/recreated;
- provider-native external ID was reused;
- local/offline cached credential horizon expired.

`cryptographically valid != currently admitted != authorized for this operation`.

The target keeps provider identity distinct from actor/user/workload identity even when the provider API uses the same string or subject internally.

## 11. Binding currentness and semantic readiness

**DECISION C3.22-D7 — provider health/reachability is one evidence dimension; semantic readiness is a qualified claim over the binding's required population and revision vector.**

A binding-readiness assessment may need evidence for:

- endpoint/network reachability;
- provider-reported service health;
- authentication/credential validity;
- admission/current policy validity;
- required operation support under current provider revision;
- quota/capacity headroom;
- required external resources existing in expected revision/state;
- required callbacks/subscriptions/mappings being current;
- data/schema/contract compatibility;
- trust/security/privacy constraints;
- unresolved provider incidents/deprecations;
- relevant residual cohorts from prior bindings;
- downstream semantic owner readiness where the claim explicitly includes it.

The result supports `READY`, `DEGRADED`, `NOT_READY` and `INCONCLUSIVE`, with explicit claim scope.

A green provider dashboard cannot prove a specific resource or site binding is semantically ready. Likewise a Fleet/global provider view cannot prove Station-local binding truth when local evidence is stale/missing.

## 12. Remote provider mutation and effect semantics

**DECISION C3.22-D8 — every mutating provider operation separates invocation, provider acknowledgement, external effect disposition, reconciliation and owner-validated semantic outcome.**

Portable progression:

`intent -> authority/admission/binding qualification -> operation attempt -> provider response/ack -> EffectDisposition -> reconciliation observation -> domain-owner validation`.

Effect disposition is:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

`UNKNOWN -> reconcile-before-retry` remains the default where repeating the mutation could produce duplicate or harmful effects, unless operation-specific idempotency/effect identity is separately qualified.

Batch or bulk operations preserve per-operation/resource outcomes. Aggregate `success` cannot erase partial application.

Idempotency is scope- and horizon-qualified. A provider idempotency key may be bounded by account, endpoint, resource type, time horizon or provider revision; it is not universal duplicate-safety evidence.

## 13. Reconciliation is owner-aware and non-strengthening

Provider reconciliation may compare:

- intended canonical binding state;
- provider-reported state;
- provider resource identities/revisions;
- external-effect evidence;
- callbacks/events/subscriptions;
- local caches/offline state;
- domain-owner observed postconditions.

Provider/Binding can establish realization convergence only to the extent supported by its evidence profile. It cannot strengthen a provider observation into business completion, workflow success, physical truth or canonical policy compliance.

Reconciliation result supports `CONVERGED`, `DIVERGED`, `PARTIAL`, `UNKNOWN` and `INCONCLUSIVE` where applicable.

For C2 Physical/Peripheral integrations, provider/device acknowledgements and observed provider state remain bounded integration/governance evidence. They do **not** create generic direct actuation authority or prove physical-world effect without separately owned evidence.

## 14. Fallback is an explicit policy over qualified alternatives

**DECISION C3.22-D9 — fallback may select among already-qualified alternatives only under owner-approved constraints; fallback does not create semantic equivalence.**

A fallback policy identifies:

- originating binding and failure/degradation conditions;
- candidate alternate bindings;
- exact support-vector deltas;
- allowed semantic degradation, if any;
- authority/governance/economic constraints;
- state/data/session migration requirements;
- idempotency/effect-reconciliation obligations;
- currentness horizon;
- reversion/escalation behavior;
- observability/evidence expectations.

Fallback can be `AUTO_ELIGIBLE`, `HUMAN_APPROVAL_REQUIRED`, `BLOCKED`, or `INCONCLUSIVE` depending on the owner's policy and the qualified alternative.

Automatic fallback is forbidden when a required semantic dimension is unsupported/unknown or when unresolved effect state makes double execution unsafe.

## 15. Provider substitution and coexistence

**DECISION C3.22-D10 — provider substitution is a revisioned migration with explicit coexistence and cohort drainage; it is not adapter pointer replacement.**

Substitution progression:

`candidate discovery -> requirement/support qualification -> admission -> trial/binding creation -> compatibility/reconciliation evidence -> coexistence -> cutover eligibility -> cutover -> validation -> residual cohort drainage -> withdrawal -> historical retention`.

Coexistence may be necessary for:

- in-flight sessions/workflows;
- old callbacks/webhooks/subscriptions;
- queue partitions/messages;
- external identities/accounts;
- provider-native resource copies;
- delegated grants/roles;
- caches/tokens;
- offline Stations/devices;
- historical artifacts/releases/deployments;
- pending reconciliation jobs.

Cutover does not rewrite producing history. Historical occurrences retain the binding/provider revision that actually produced them.

A provider can be withdrawn for new work while residual cohorts continue under an explicitly bounded drain state.

## 16. Residual provider cohorts are first-class

A `ResidualProviderCohort` records remaining effect-producing or truth-relevant populations from a superseded/withdrawn provider binding, including:

- cohort kind;
- provider/binding revision;
- tenant/site/environment/resource scope;
- population size/coverage where known;
- last observed/currentness horizon;
- allowed operations;
- required drainage/revoke/deprovision/reconcile action;
- terminal criteria;
- owner/escalation route;
- unresolved `UNKNOWN/PARTIAL` state.

Withdrawal cannot be marked complete while a HIGH/CRITICAL residual cohort has no disposition.

Deletion/recreation or external-ID reuse must not accidentally bind a new provider object to historical canonical identity merely because a provider-native ID value matches.

## 17. Local / offline / Fleet provider semantics

**DECISION C3.22-D11 — local/offline provider bindings operate only inside an explicit qualified local closure; Fleet views remain qualified observations, not omniscient binding truth.**

A local closure records the retained provider descriptor/binding revision, adapter/protocol, trust/credential references, policy horizon, required local endpoints/resources, support-vector assumptions, quota/capacity assumptions, reconciliation obligations and expiry/currentness rules.

While disconnected:

- no missing enterprise evidence is silently treated as current;
- authority does not broaden;
- provider status may remain `INCONCLUSIVE` after its evidence horizon;
- queued mutations preserve effect identities and retry/reconciliation semantics;
- local provider substitution is allowed only if pre-qualified by an applicable owner policy/closure.

Reconnect sequence compares local and enterprise revision/currentness vectors, classifies residual/unknown effects, reconciles and requalifies before local state becomes enterprise-current truth.

`Fleet healthy != every Station binding healthy/current`.

## 18. Provider-specific extensions without semantic leakage

**DECISION C3.22-D12 — provider extensions are explicit, namespaced, revisioned and excluded from portable-equivalence claims unless adopted by a semantic owner.**

Provider extensions may expose richer provider-native operations, diagnostics, topology, optimizations or metadata. They must declare:

- provider/extension identity and revision;
- applicability scope;
- semantic owner or provider-qualified namespace;
- portable capability relation, if any;
- non-portable assumptions;
- failure/currentness/evidence behavior;
- lifecycle/deprecation status.

A provider-specific field cannot silently appear in the canonical capability contract and force all other providers to emulate it. If a repeated extension represents a real cross-provider semantic need, it must return through semantic-owner governance and Planning/architecture evolution rather than leaking upward by convenience.

## 19. Brownfield provider adoption and Legacy Mirroring

Brownfield adoption follows:

`discover actual providers/accounts/endpoints -> capture source/revision/currentness -> map provider-native identities/resources/operations -> classify semantic fidelity -> surface unsupported/ambiguous dimensions -> identify authority/trust/credential/source-of-truth -> identify residual/manual/shadow paths -> propose binding/admission candidates -> owner review -> qualified adoption`.

Observed provider configuration, spreadsheets, runbooks, scripts, copied credentials, manual console steps, verbal approvals or undocumented fallback routes become evidence/candidates, not canonical admission truth.

Negative-space probes specifically look for:

- unmanaged provider accounts/subscriptions;
- unofficial admin users or shared credentials;
- console-only changes not represented in canonical binding state;
- shadow integrations or direct SDK/API calls bypassing adapters;
- undocumented fallback providers;
- stale webhooks/callbacks;
- orphaned external resources/grants;
- copied provider IDs embedded in business data;
- manual quota/limit assumptions;
- provider-specific recovery procedures held by one key person;
- offline/local provider configurations invisible to Fleet.

## 20. Elicitation Lens — Provider / Binding / Capability Negotiation

C1 applies a capability-specific lens. The wizard/AI/expert path must not mark this capability sufficiently understood merely because a provider name, API key and feature list were supplied.

Applicable dimensions include at least:

- provider/contract owner and decision authority;
- provider identity, issuer/account/project/subscription/resource namespaces;
- canonical semantic capability requirement;
- discovery source and evidence currentness;
- advertised versus actually tested behavior;
- tenant/site/environment/resource applicability;
- source-of-truth boundaries;
- authentication/credential/trust lifecycle;
- authorization and delegated administration;
- required operations and postconditions;
- failure, timeout, `PARTIAL`, `UNKNOWN`, retry and reconciliation;
- idempotency scope/horizon;
- ordering/consistency/delivery guarantees;
- quota/rate/capacity/backpressure;
- privacy/residency/security/compliance constraints;
- observability/audit/evidence;
- backup/recovery/rollback/revoke/deprovision;
- lifecycle/deprecation/version/provider change;
- offline/local/Fleet behavior;
- fallback/substitution/coexistence/withdrawal;
- residual external identities/resources/grants;
- provider-specific extensions;
- Brownfield/manual/shadow paths;
- abuse/misuse cases for privileged provider operations.

Stakeholder coverage may require business/process owner, implementer, operator/support, security/trust, privacy/compliance, finance/procurement, provider/vendor owner, site/Station owner and actual users of the integration. One stakeholder's assertion is not canonical provider truth when another owner controls the material semantic dimension.

Critical unanswered questions remain visible per object/capability/dimension as `UNTOUCHED`, `PARTIAL`, `CONFLICTED`, `BLOCKED`, `DEFERRED` or `NOT_APPLICABLE` with rationale. No aggregate percentage can erase a HIGH/CRITICAL provider-authority, source-of-truth, revocation, privacy, recovery or `UNKNOWN` gap.

## 21. Adaptive questioning and contradiction handling

Provider elicitation must generate deterministic follow-up when answers are ambiguous, for example:

- “Provider supports retries” -> ask idempotency scope/horizon and effect-reconciliation behavior.
- “Provider is HA” -> ask failure domain, RTO/RPO, consistency and current evidence.
- “Same API as provider B” -> ask semantic differences, limits, error model, ordering, lifecycle and tested equivalence evidence.
- “Fallback exists” -> ask who authorizes it, degradation semantics, state transfer and double-effect prevention.
- “It works offline” -> ask retained trust/credential/config/support-vector horizons and reconnection reconciliation.
- “Provider can delete users/resources” -> ask revoke/deprovision semantics, residual grants/copies and proof of completion.
- “Vendor says supported” -> preserve as `Claim` until evidence/owner qualification.

Contradictory provider documentation, observed behavior, administrator claims and test evidence remain separate records with explicit owner/disposition route. AI summarization may not hide a contradiction or promote a provider claim to fact.

## 22. Cross-artifact consistency checks

Planning E should prove consistency across at least:

- capability requirement vs provider support vector;
- provider admission vs Authorization/Governance/Security/Privacy/FinOps decisions;
- binding scope vs tenant/site/environment/resource scope;
- binding vs Secrets/Configuration/Trust references;
- binding vs Standards/API contract conformance;
- fallback policy vs support-vector deltas;
- provider mutation use case vs `UNKNOWN`/retry/reconciliation semantics;
- provider migration plan vs residual cohorts and Lifecycle target;
- operator runbook vs binding currentness and authority;
- user story/acceptance criterion vs actual provider postcondition evidence;
- Fleet view vs Station-local evidence/currentness;
- Brownfield discovered provider state vs approved canonical binding state.

A story or acceptance test saying “switch provider successfully” is incomplete if it omits residual cohorts, semantic delta, source-of-truth transfer, reconciliation and owner-validated outcome.

## 23. Production Readiness Coverage

Production readiness is separate from feature/binding existence. At minimum it tracks independently:

- current qualified support vector;
- current admission decision;
- authority/delegation readiness;
- credential/trust currentness;
- environment/site/tenant binding scope;
- required provider resources/current mappings;
- quota/rate/capacity headroom;
- observability/audit evidence;
- failure/retry/reconciliation readiness;
- fallback/substitution constraints;
- revoke/deprovision capability;
- recovery/rollback evidence;
- privacy/residency/security constraints;
- residual cohort disposition;
- offline/Fleet closure where applicable;
- provider deprecation/support-window risk;
- operator/runbook/support readiness.

A single `READY` badge may be a projection only; it cannot substitute for these underlying dimensions or hide `INCONCLUSIVE/PARTIAL` critical obligations.

## 24. Queueing, capacity and economic constraints

Provider qualification includes queueing/capacity only when semantically material; it does not turn Provider/Binding into the FinOps or Observability owner.

Evidence may include:

- provider rate/quota ceilings;
- burst limits;
- concurrency limits;
- backlog/reconciliation queue depth;
- expected arrival/service rates;
- retry amplification;
- provider throttling/error behavior;
- drain time during migration;
- capacity headroom under failover/fallback;
- economic/entitlement constraints referenced from FinOps/Commercial owners.

A fallback provider that is semantically compatible but lacks capacity for the transferred load is not production-ready. Conversely, abundant capacity does not compensate for an unsupported authority/privacy/semantic dimension.

## 25. Typed Semantic Graph, provenance, temporal and uncertainty integration

Provider identities, bindings, support assessments, admissions, operation attempts, reconciliation occurrences, migrations and residual cohorts are typed nodes/relations in the C0 graph with owner-qualified references.

Temporal semantics distinguish discovery time, observation time, effective/admission interval, provider operation time, acknowledgement time, reconciliation time and withdrawal/cutover time.

Provenance records who/what asserted provider support and from which evidence. It never promotes the assertion into truth/authority.

Uncertainty remains typed:

- missing support evidence;
- stale provider metadata;
- ambiguous external effect `UNKNOWN`;
- incomplete residual cohort population;
- uncertain capacity/headroom;
- provider-documented but untested behavior;
- local/Fleet observation gaps.

These uncertainties cannot be collapsed into one confidence score.

## 26. Formal assurance and proof-domain boundaries

Formal or machine-checkable reasoning may establish properties of the canonical binding/substitution graph such as:

- no binding active without an applicable admission reference;
- authority scope is not widened by provider substitution;
- unsupported mandatory support dimensions prevent admission/binding activation;
- residual cohorts prevent withdrawal closure until dispositioned;
- historical occurrences retain producing binding revision;
- no provider-native identity is promoted to canonical identity without explicit mapping/adoption;
- no `UNKNOWN` mutating effect becomes safe retry without reconciliation or qualified idempotency;
- local/offline closure expiry cannot silently widen authority/currentness;
- fallback candidate selection respects declared support constraints.

Such proofs establish structural properties of the modeled graph. They do not prove provider real-world behavior, current health, business effect or physical outcome unless those proof domains have their own evidence.

## 27. Planning D migration/coexistence constraints

Planning D must preserve these constraints:

1. retain the current AI Gateway provider-neutral request/response seam and adapter replaceability evidence;
2. generalize descriptors/support vectors without breaking existing provider adapters;
3. introduce canonical provider descriptor/binding identities additively;
4. keep provider credentials/secret values outside canonical semantic contracts;
5. add qualification/admission before treating discovered providers as effective;
6. migrate existing provider-specific config into explicit realization/binding records without silently canonicalizing legacy fields;
7. preserve current explicit fallback policy while adding support-vector qualification and residual-cohort semantics;
8. introduce effect disposition/reconciliation where provider operations are mutating/ambiguous;
9. support coexistence during provider migration rather than hard switch by default;
10. retain historical provider/binding lineage after withdrawal;
11. separate global/Fleet observation from Station-local truth/currentness;
12. keep C2 Physical/Peripheral provider use bounded to integration/governance semantics;
13. avoid a central provider god-object that absorbs Authorization, Standards, Secrets, Deployment, Integration or domain semantic truth.

These are Planning D constraints only; no migration is executed here.

## 28. Planning E proof obligations

Planning E must materialize acceptance/proof routes for at least these obligations:

1. **Provider identity separation proof** — provider-native/external IDs cannot become canonical domain identity by value coincidence.
2. **Discovery non-strengthening proof** — discovery/advertisement cannot directly produce qualified/admitted/bound/effective state.
3. **Feature-name non-equivalence proof** — equal feature/API names do not satisfy a semantic requirement without dimension-level qualification.
4. **Support-vector completeness proof** — all mandatory requirement dimensions are dispositioned as `SUPPORTED/PARTIAL/UNSUPPORTED/INCONCLUSIVE` with evidence/currentness.
5. **No scalar masking proof** — an aggregate score cannot override a required unsupported/critical unresolved dimension.
6. **Admission separation proof** — technical support does not imply Governance/Authorization/Security/Privacy/FinOps admission.
7. **Scope isolation proof** — admission/binding for one tenant/site/environment/resource cannot leak to another scope.
8. **Credential/authority non-amplification proof** — valid provider credentials do not create canonical operation authority.
9. **Binding identity/revision proof** — binding revision is distinct from capability, provider resource and provider API revisions.
10. **Binding currentness proof** — relevant revision/credential/trust/policy/provider changes invalidate or requalify stale readiness claims.
11. **Provider-health non-strengthening proof** — provider health/reachability cannot prove domain-effective result or Station-local truth outside covered scope.
12. **Remote effect proof** — mutating provider operations preserve `APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN` separately from acknowledgement.
13. **Reconcile-before-retry proof** — `UNKNOWN` mutation cannot be retried automatically absent reconciliation or qualified idempotency.
14. **Scoped idempotency proof** — provider idempotency horizon/scope cannot be universalized beyond its evidence.
15. **Batch partiality proof** — aggregate success cannot hide per-operation/resource partial or unknown effects.
16. **Fallback qualification proof** — fallback only selects an alternative satisfying the applicable support/admission constraints or records explicit governed degradation.
17. **Substitution non-equivalence proof** — provider cutover cannot be declared solely from adapter/API compatibility.
18. **Residual cohort drainage proof** — sessions, queues, callbacks, mappings, grants, resources and offline populations remain visible until terminal disposition.
19. **External-ID reuse proof** — delete/recreate or provider ID reuse cannot bind new realization to old canonical identity without explicit adoption.
20. **Historical lineage proof** — past occurrences retain their producing provider/binding revision after migration/withdrawal.
21. **Offline/local closure proof** — disconnected use cannot outlive credential/trust/policy/support horizons silently.
22. **Fleet/local separation proof** — Fleet aggregate health/currentness cannot prove each Station binding.
23. **Extension non-leakage proof** — provider-specific extensions cannot silently redefine portable canonical semantics.
24. **Brownfield non-canonicalization proof** — observed provider config/manual behavior remains evidence/candidate until owner adoption.
25. **Elicitation no-false-complete proof** — HIGH/CRITICAL unresolved support/authority/source-of-truth/revoke/privacy/recovery/UNKNOWN gaps block elicitation completion.
26. **Cross-artifact contradiction proof** — requirement/support/admission/binding/runbook/acceptance contradictions cannot be silently summarized away.
27. **AI non-strengthening proof** — AI provider mapping/support proposals remain `InferredCandidate` until owner-governed qualification/admission.
28. **C2 physical non-actuation proof** — provider qualification for physical/peripheral integration cannot infer generic direct physical actuation authority or physical-effect proof.
29. **Queue/capacity readiness proof** — fallback/migration readiness must include current drainability/headroom where capacity is material.
30. **Trust/provenance separation proof** — signed/attested provider metadata can support provenance/trust but cannot alone prove semantic equivalence or authorization.

Detection routes include schema/graph validators, admission/binding state-machine checks, revision/currentness invalidation tests, property-based qualification tests, mutation/reconciliation fault injection, migration cohort ledgers, scope-isolation tests, cross-artifact consistency checks, offline/Fleet simulation, Brownfield assimilation review and Elicitation Coverage gate evaluation.

No new `ConflictPattern` or `ConflictInstance` is created by these obligations. They route the inherited adversarial inventory into later acceptance proof.

## 29. External research anchors

Planning C uses external standards only as informative precedents, not as canonical internal authority:

- Kubernetes API Discovery publishes supported group versions/resources plus resource scope, endpoint and verbs. This demonstrates that discovery can expose machine-readable provider/API surface while still remaining distinct from application-semantic qualification: https://kubernetes.io/docs/concepts/overview/kubernetes-api/
- OpenID Connect Discovery defines provider metadata such as issuer, endpoints and supported configuration. It demonstrates provider metadata discovery and identity qualification primitives without implying Generation 2 semantic admission: https://openid.net/specs/openid-connect-discovery-1_0.html
- RFC 8414 defines OAuth Authorization Server Metadata, including issuer, endpoints and capabilities. It also allows signed metadata, illustrating that provenance/integrity of metadata is still a separate concept from application-level semantic support and authorization: https://www.rfc-editor.org/rfc/rfc8414

## 30. Adversarial carry-forward disposition

This Planning C decision creates:

- **0 new material edge findings**;
- **0 new ConflictPatterns**;
- **0 ConflictInstances**;
- **0 preventive invariants recorded as research remediation**;
- **0 canonical capability promotions**.

The inherited research remains `CLOSED / SATURATED / PASS` at Full Pass 8, 28/28 capabilities and 12/12 mandatory clusters. The 284 edge scenarios + 124 ConflictPatterns = 408 material findings remain active as architectural constraints and Planning E proof routes.

Candidate elicitation conflict classes including `FALSE_ELICITATION_COMPLETENESS`, `STAKEHOLDER_COVERAGE_GAP`, `ASSUMPTION_PROMOTED_TO_FACT`, `UNRESOLVED_CONTRADICTION_HIDDEN`, `HAPPY_PATH_ONLY_SPECIFICATION`, `ELICITATION_PROVENANCE_BREAK`, `CROSS_CAPABILITY_QUESTION_ROUTING_GAP` and `AI_INFERENCE_PROMOTED_TO_REQUIREMENT` remain duplicate-screened against the existing conflict inventory; this decision does not create fresh IDs.

## 31. Capability result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

C3.22 establishes a provider-neutral, revision-qualified Provider / Binding / Capability Negotiation Plane that generalizes the strong existing AI provider seam without turning provider mechanics into domain semantics. Discovery, advertisement, qualification, admission, binding, effectiveness and withdrawal remain distinct. Support is multidimensional, provider-specific extensions cannot silently leak into portable contracts, remote mutations preserve explicit `PARTIAL/UNKNOWN`, fallback/substitution require qualified semantic evidence and residual cohorts, and local/Fleet currentness remains bounded.

The capability-specific Elicitation Lens prevents provider name/API-key/feature-list collection from being mistaken for understanding. Planning E receives explicit no-false-complete and cross-artifact proof obligations.

Planning C coverage becomes **22/28**. Planning C remains `ACTIVE / OPEN`; Planning D remains blocked until all 28 C3 capability decisions and the Planning C global gate are closed/pass.

## 32. Authorized next action

The next authorized decision is **C3.23 — Standards / Interoperability / API Contracts** only.

Do not execute C3.24 or later capability decisions, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction or product code in the same action.
