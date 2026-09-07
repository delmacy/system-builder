# Generation 2 — Planning C — C3.23 Standards / Interoperability / API Contracts Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Standards / Interoperability / API Contracts**
Decision: `C3.23`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, Planning C C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, the closed Planning A/B artifacts for this capability, C3.22 Provider / Binding / Capability Negotiation, the already-decided C3 targets through C3.22, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

The entry state was re-read before work and the branch head was revalidated at `e4539a0a27600fd2a565cbc5bc5f4aa5dd1c2ee3`.

Constitutional distinctions remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `schema valid != semantic correct`;
- `protocol conformance != business postcondition`;
- `compatible parse != compatible meaning`;
- `advertised version != current effective contract`;
- `2xx/ACK != downstream effect`;
- `same endpoint/operation/feature name != semantic equivalence`;
- `syntactic compatibility != structural compatibility != behavioral compatibility != semantic compatibility`;
- `contract published != consumer adopted != consumer effective != residual cohort drained`;
- `provider support != contract conformance != provider admission != operation authorization`;
- `external identifier != canonical semantic identity`;
- `historical conformance evidence != current conformance`;
- `Fleet aggregate != local contract truth`;
- `AI mapping/spec generation != contract/adoption authority`;
- `attempted != accepted != applied/effective != converged != validated`;
- `provenance != truth != currentness != authority`;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

## 2. Planning A/B anchor and target disposition

Planning A established Standards / Interoperability / API Contracts as the canonical owner of contract identity/revision, layered conformance, directional compatibility, negotiation, extension/downgrade boundaries, operation-level request/response/error/idempotency semantics, conformance profiles/evidence and adapter/protocol realization separation. It explicitly kept domain semantics, provider admission, authorization, data migration, delivery truth and effective outcomes with their owning capabilities.

Planning B found meaningful current foundations on fresh main:

- versioned provider-neutral public artifact envelopes;
- JSON Schema 2020-12 public/domain contracts;
- explicit logical artifact and schema identity separate from provider-native identifiers;
- strict fail-closed version/field validation in AI Gateway contracts;
- deterministic normalization/canonicalization;
- provider-neutral request/response/capability contracts behind adapters;
- bounded optional/required extension mechanics;
- structured-output validation and canonical request correlation.

Planning B did **not** find a generalized reusable model for multidimensional conformance, revision/profile compatibility matrices, negotiated downgrade, effect dispositions, currentness-qualified conformance evidence, reconcile-before-retry, contract withdrawal/coexistence or residual consumer drainage.

C3.23 therefore adopts:

**KEEP + HARDEN + GENERALIZE + INTEGRATE + PROVIDERIZE WIRE/PROTOCOL MECHANICS**.

It rejects any architecture in which a schema registry, OpenAPI document, protobuf descriptor, AsyncAPI document, provider SDK, endpoint path, HTTP status, broker ACK or generated adapter becomes the semantic owner of the transported domain.

## 3. Target decision

**DECISION C3.23-D1 — establish a revision-qualified Standards / Interoperability / API Contract Plane that owns canonical interoperability contract identity, immutable revision, contract profiles, protocol/schema/media/event realization descriptors, layered conformance, directional compatibility, capability/content/version negotiation, operation semantics, conformance evidence/currentness, extension/deprecation/coexistence rules and contract-adoption lineage, while transported domain meaning, provider admission, authorization, effective outcomes and lifecycle orchestration remain owned elsewhere.**

The plane has nine linked semantic surfaces:

1. **Contract Identity & Revision Plane** — stable logical contract identity plus immutable revision/content identity.
2. **Contract Profile Plane** — bounded semantic/use profiles and required operation/capability subsets.
3. **Realization Plane** — protocol, schema dialect, media type, event envelope, RPC/HTTP/resource mapping and adapter descriptors.
4. **Conformance Plane** — syntactic, structural, behavioral and semantic conformance dimensions.
5. **Compatibility & Negotiation Plane** — directional compatibility matrices and negotiated realization selection.
6. **Operation Semantics Plane** — request/response/error/problem, pagination/filtering/streaming/batch, ordering, retry/idempotency and ambiguity expression.
7. **Evidence & Currentness Plane** — test/evidence lineage, applicability, revision vector and validity horizon.
8. **Evolution Plane** — extension, deprecation, coexistence, sunset and residual producer/consumer cohort evidence consumed by Lifecycle.
9. **Brownfield & Federation Plane** — discovered legacy/external API/protocol normalization and cross-system contract qualification without silent semantic adoption.

## 4. Canonical identity and immutable revision

The target introduces or qualifies identities such as:

- `InteroperabilityContractId`;
- immutable `InteroperabilityContractRevisionId`;
- `ContractContentDigest` where deterministic content addressing is applicable;
- `ContractProfileId` / immutable `ContractProfileRevisionId`;
- `ContractOperationId` scoped to contract identity;
- `ContractRealizationId` / immutable `ContractRealizationRevisionId`;
- `ConformanceProfileId` / immutable revision;
- `ConformanceAssessmentId`;
- `CompatibilityAssessmentId`;
- `NegotiationOccurrenceId`;
- `ContractAdoptionId` / `ContractAdoptionRevisionId`;
- `ContractDeprecationId` / `ContractSunsetOccurrenceId`;
- `ResidualContractCohortId`;
- `ExternalContractMappingId`.

The identity boundary is:

`canonical domain identity != canonical interoperability contract identity != protocol/provider realization identity`.

An endpoint URL, HTTP path, media type, event topic, queue, protobuf package, GraphQL operation, OpenAPI `operationId`, provider-native version, schema URI or SDK method may be a realization identifier. It does not become canonical semantic identity merely because it is stable or globally unique.

Every immutable revision must preserve lineage to its logical contract identity and supersession/predecessor relations. Mutable labels such as `latest`, provider API aliases or floating schema references are discovery aids only; authoritative decisions pin an immutable revision or a qualified revision range with explicit semantics.

## 5. RevisionVector and effective contract currentness

**DECISION C3.23-D2 — compatibility and conformance claims are qualified over a revision vector, not one version string.**

A sparse `RevisionVector` may include:

- contract revision;
- profile revision;
- protocol/schema dialect revision;
- realization/adapter revision;
- producer implementation revision;
- consumer implementation revision;
- provider binding revision;
- security/trust/auth profile revision;
- domain semantic requirement revision;
- environment/site/tenant topology revision;
- extension set revision;
- evidence/test-suite revision;
- time/currentness horizon.

Thus:

`advertised version == expected version` does not prove `effective contract == expected contract`.

A consumer may have parsed a newly advertised revision while still executing an older generated client, cached schema, offline bundle, adapter or provider route. Currentness is population-qualified and can be `CURRENT`, `STALE`, `PARTIAL`, `UNKNOWN` or `INCONCLUSIVE` depending on evidence.

## 6. Layered conformance remains vector-valued

**DECISION C3.23-D3 — conformance is multidimensional and must never be collapsed into schema-valid=true.**

At minimum, the target preserves:

- `SYNTAX` — framing, encoding, grammar and wire representation;
- `STRUCTURE` — fields, types, cardinalities, schema constraints and required/optional shape;
- `BEHAVIOR` — sequencing, operation lifecycle, retry/idempotency, error and state-transition rules;
- `SEMANTICS` — meaning, invariants, units, reference populations, effect interpretation and owner-defined postconditions;
- `SECURITY_TRUST_PROFILE` — required interoperable carrier/profile obligations without owning trust/authorization truth;
- `OPERATIONAL_CONTRACT` — quotas, timing/currentness horizons, pagination/streaming/backpressure and failure-expression obligations when contractually relevant.

Each dimension supports at least:

- `CONFORMANT`;
- `PARTIAL`;
- `NON_CONFORMANT`;
- `INCONCLUSIVE`;
- `NOT_APPLICABLE` where justified.

A summary UI may exist, but no scalar score can override a required `NON_CONFORMANT`, `PARTIAL` or `INCONCLUSIVE` dimension.

JSON Schema 2020-12 is a valid realization for structural validation and vocabulary/dialect declaration. It remains intentionally insufficient as semantic proof. OpenAPI, AsyncAPI, protobuf descriptors, GraphQL schema, Avro, XML Schema and similar ecosystems are also realizations, not semantic authorities.

## 7. Directional compatibility algebra

**DECISION C3.23-D4 — compatibility is a directional relation between a producer revision/profile and a consumer revision/profile under an explicit operation subset and extension/security/currentness context.**

The canonical relation is conceptually:

`Compatible(P_r, C_s, Profile_q, OperationSet_o, ExtensionSet_e, Constraints_k, Evidence_h) -> CompatibilityVector`.

It is not symmetric:

`Compatible(A, B)` does not imply `Compatible(B, A)`.

The vector distinguishes at least:

- readable/parse compatibility;
- required-field/data compatibility;
- behavioral compatibility;
- semantic compatibility;
- error/problem compatibility;
- extension compatibility;
- security/trust-profile compatibility;
- operational compatibility where quotas/streaming/backpressure are material;
- current evidence sufficiency.

Composition is also not automatic. If A is compatible with B and B with C, A need not be compatible with C. The graph must preserve explicitly evaluated edges rather than infer transitive equivalence.

This prevents graph algebra from accidentally turning partial interoperability paths into semantic equivalence classes.

## 8. Negotiation selects a qualified realization; it does not rewrite meaning

**DECISION C3.23-D5 — content/version/capability negotiation chooses among already-defined compatible realizations and profiles; negotiation cannot manufacture missing semantics or weaken superior invariants.**

Negotiable dimensions may include:

- protocol/API version;
- media type/content encoding;
- schema/profile revision;
- operation/capability subset;
- event envelope/profile;
- compression/stream representation;
- extension set;
- locale where semantically safe;
- transport realization;
- optional quality/degradation profile where owner-approved.

Negotiation outcome records proposed alternatives, selected alternative, compatibility assessment, current evidence and rejection rationale.

Downgrade is allowed only if the selected older profile still satisfies all mandatory semantic, authority, trust, security, privacy, audit and recovery requirements. `PARTIAL` or `INCONCLUSIVE` cannot silently become `SUPPORTED` because the remote side accepted a lower version.

Provider negotiation remains distinct: C3.22 decides whether a provider realization is qualified/admitted/bound; C3.23 decides whether a concrete contract realization is interoperable for the requested scope.

## 9. Request, response, acknowledgement and effect semantics

HTTP, RPC, messaging and provider protocols all expose transport/protocol outcomes. These are evidence, not universal domain postconditions.

**DECISION C3.23-D6 — every operation contract distinguishes protocol acceptance from semantic effect where the operation can outlive or diverge from the immediate response.**

The portable chain is:

`request intent -> protocol acceptance/rejection -> processing state if exposed -> EffectDisposition -> reconciliation evidence -> domain-owner validation`.

Effect dispositions reuse UCA semantics:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

A `200`, `202`, successful RPC return, broker ACK, webhook delivery response or provider SDK success can only be mapped to `APPLIED` when the exact qualified contract says that response proves the required effect. Otherwise the response retains its narrower meaning.

For HTTP realizations, RFC 9110 method/status semantics and RFC 9457 Problem Details are useful portable mechanics. Problem Details provides machine-readable problem occurrence semantics, but a problem type or status code still does not replace domain-owned effect truth.

## 10. Error/problem semantics and ambiguity preservation

Errors are typed contract outcomes, not free-form strings.

A contract may define:

- canonical problem/error type identity;
- occurrence identity/correlation;
- retryability classification;
- safe-to-display versus sensitive detail;
- field/path-level validation evidence;
- dependency/provider failure evidence;
- quota/rate-limit evidence;
- currentness/staleness indication;
- partial-batch member outcomes;
- reconciliation route;
- escalation/operator guidance references.

Protocol adapters must preserve unknown/unmapped remote errors as explicit unsupported/inconclusive evidence rather than coercing them into a familiar semantic error.

Security/privacy rules apply to error payloads: diagnostic value never authorizes secret, personal, credential or infrastructure overexposure.

## 11. Idempotency, retry and duplicate semantics

**DECISION C3.23-D7 — idempotency is explicit per operation, identity scope, equivalence relation, lifetime and provider/consumer cohort.**

A portable operation contract may declare:

- idempotency key namespace and scope;
- key lifetime/retention horizon;
- duplicate-request equivalence fields;
- result identity and read-back route;
- whether retries are safe before/after timeout;
- retryable error classes;
- maximum/structured retry policy constraints;
- reconciliation operation;
- replay behavior across provider/adapter revision changes.

The default invariant remains:

`UNKNOWN mutating effect -> reconcile-before-retry`

unless the exact current contract and provider realization qualify duplicate safety for the relevant scope/horizon.

Retry without idempotency is an explicit operability defect/coverage gap, never silently corrected by transport middleware.

## 12. Pagination, filtering, batch and partial traversal

**DECISION C3.23-D8 — collection and bulk contracts must expose completeness semantics sufficient to distinguish empty, partial, truncated, stale and unknown populations.**

Pagination contracts qualify:

- cursor/token identity and lifetime;
- stable versus unstable ordering assumptions;
- snapshot versus live traversal semantics;
- page size limits;
- next/previous continuation behavior;
- token invalidation/restart behavior;
- duplicate/missing-item risks across concurrent mutation;
- terminal completeness evidence;
- partial provider failure behavior.

A successful last received page does not prove full population traversal unless the contract provides and the consumer verifies a terminal-completeness condition.

Filtering contracts define field/operator semantics, case/unit/timezone behavior and unsupported predicates. Unsupported filters cannot be silently dropped.

Batch operations preserve member-level effect disposition; aggregate `success` cannot erase `PARTIAL` or `UNKNOWN` members.

## 13. Streaming, events and ordering semantics

OpenAPI 3.2 can describe streaming representations such as SSE/JSON Lines, and AsyncAPI/CloudEvents-like realizations can describe asynchronous APIs/events. C3.23 treats these as wire/protocol realizations only.

**DECISION C3.23-D9 — streaming/event contract conformance does not inherit delivery, ordering, deduplication, replay or consumer-effect guarantees unless those are explicitly qualified in the owning Messaging/Integration semantics.**

Contract metadata may express:

- event/envelope version;
- subject/type/source/correlation semantics;
- partition/ordering key meaning;
- sequence domain and reset conditions;
- replay/cursor/checkpoint semantics;
- duplicate identity/equivalence;
- schema/profile negotiation;
- stream termination/reconnect semantics;
- backpressure/flow-control expectations.

But:

`source-local sequence != global order != causality`

and

`event envelope conformant != event semantically valid != consumer effect complete`.

Notifications / Events / Messaging remains the owner of durable delivery truth.

## 14. Extensions and vendor fields without semantic leakage

**DECISION C3.23-D10 — extensions are namespaced, revisioned, classified by portability and prohibited from silently redefining canonical semantics.**

An extension profile records:

- namespace/owner;
- revision;
- applicable base contract/profile;
- required versus optional status;
- ignore/forward/preserve/reject behavior;
- semantic owner if one exists;
- security/privacy implications;
- downgrade behavior;
- provider dependence;
- current adoption population.

Unknown extensions may be ignored only when the base contract explicitly allows it and doing so cannot alter required semantics.

Provider-specific fields remain realization-specific until the relevant canonical owner explicitly adopts/generalizes the semantic concept. AI may propose such a mapping but cannot perform the adoption transition.

## 15. Contract conformance evidence and currentness

**DECISION C3.23-D11 — conformance is a QualifiedClaim with evidence lineage and expiry/invalidation conditions, not a permanent certification badge.**

A `ConformanceAssessment` includes, where applicable:

- contract/profile revision;
- producer/consumer/provider/adapter implementation revision;
- tested operation/population subset;
- test suite/tool/probe revision;
- environment/topology/site/tenant assumptions;
- external dependency/provider revision;
- evidence timestamps and clocks;
- conformance vector;
- unsupported/untested dimensions;
- provenance;
- validity/currentness horizon;
- invalidation triggers.

Invalidation triggers include contract/implementation/provider revision, configuration/security/trust change, schema/profile change, environment/topology change, dependency revision, test-suite supersession or expiry of the evidence horizon.

`previously conformant != currently conformant`.

Synthetic conformance probes can supply current evidence, but probe success proves only the exercised path/profile/population.

## 16. Contract adoption and consumer-effective state

Publication of a contract revision is not enough.

The target models:

`DRAFT/CANDIDATE -> PUBLISHED -> AVAILABLE -> ADOPTED_BY_POPULATION -> EFFECTIVE_BY_POPULATION -> DEPRECATED -> SUNSET_CANDIDATE -> WITHDRAWN`

with owner-governed transitions and evidence.

A `ContractAdoption` ties a producer/consumer/adapter/provider cohort to the effective revision/profile and records the evidence/currentness horizon.

Residual cohorts are first-class. A migration/cutover is incomplete while old clients, offline Stations, queued messages, generated runtimes, callbacks, adapters, provider routes or Brownfield systems can still authoritatively participate under the old contract and influence valid operations.

Lifecycle / Versioning / Evolution / Migration owns generic coexistence/cutover/withdrawal orchestration. C3.23 supplies contract-specific compatibility, adoption, deprecation and residual-cohort facts.

## 17. Federation and cross-system contract currentness

Federated systems may have independent rollout clocks, providers, sites, tenants and offline intervals.

**DECISION C3.23-D12 — cross-system interoperability requires both sides' contract/adoption evidence plus relationship-qualified currentness; one side's advertised metadata cannot establish mutual effective compatibility.**

A federated compatibility claim may require:

- both logical contract identities/revisions;
- external-to-canonical mapping identity;
- producer/consumer revision vectors;
- active profile/extension sets;
- trust/security relationship revision;
- provider/adapter revisions;
- observed handshake/traffic evidence;
- last reconciliation time;
- tolerated staleness horizon;
- residual offline populations.

Network partition or stale discovery can yield `UNKNOWN` or `INCONCLUSIVE`. Cached compatibility may remain usable only within an explicitly bounded local/offline horizon.

## 18. Local/offline closure and Fleet interaction

A generated runtime or Station may remain locally operable without Builder/Fleet availability only when it holds a `QualifiedLocalContractClosure` sufficient for the operations it must perform.

That closure may include pinned:

- contract/profile revisions;
- schema/protocol realizations;
- compatibility/admission decisions needed locally;
- trust/security material references;
- idempotency/reconciliation rules;
- local evidence/currentness horizon;
- fallback/degraded profiles;
- recovery/runbook metadata.

Fleet may aggregate contract adoption, conformance, error, queue, drift and residual-cohort observations. It does not become the source of local contract truth.

`Fleet says 99% upgraded` cannot prove a specific Station is on the expected effective contract.

Reconnect must reconcile divergent local/federated contract/adoption states before authoritative convergence claims.

## 19. Brownfield / Legacy Mirroring

Brownfield APIs, protocols, CSV exchanges, database views, manual file drops, vendor SDKs, webhooks, shared folders, scripts, spreadsheets and human procedures are discovery/evidence sources.

**DECISION C3.23-D13 — Brownfield discovery creates `ExternalContractEvidence` and candidate normalized mappings; it never automatically promotes observed behavior to canonical contract semantics.**

Discovery should preserve:

- observed endpoints/protocols/formats;
- sampled payloads and schema candidates;
- undocumented optional/required fields;
- error and timeout behavior;
- pagination/partial traversal evidence;
- retry/duplicate observations;
- provider/source-of-truth ownership;
- authentication/permission behavior;
- timing/currentness/maintenance windows;
- version/revision drift;
- human fallback/reconciliation procedures;
- unsupported/unknown semantic scope.

Legacy Mirroring may infer candidate structure/process/contract maps, but uncertainty is preserved. Similar field/operation names never prove semantic equivalence.

## 20. Provider / Binding interaction

C3.22 and C3.23 intentionally form a directional relation:

- **C3.23** owns contract/profile conformance and compatibility semantics;
- **C3.22** consumes those facts as dimensions of provider support qualification/admission/binding;
- **C3.22** owns provider discovery/admission/effective binding;
- **C3.23** may consume bound realization revision/currentness when qualifying conformance.

Neither absorbs the other.

A provider may be protocol-conformant yet semantically `PARTIAL` for a capability requirement. Conversely, an admitted capable provider may need an adapter to realize a canonical contract.

`same provider API version != same enabled features != same account policy != same contract-effective behavior`.

## 21. Physical / Peripheral integration boundary

All physical/peripheral protocols remain subordinate to C2's bounded integration/governance plane.

C3.23 may define/qualify contracts for:

- device/gateway discovery;
- telemetry ingestion;
- command-intent envelopes where C2 permits a bounded specialized-system operation;
- acknowledgement/status/error events;
- configuration/provisioning APIs;
- protocol/version negotiation;
- reconciliation evidence.

It does **not** create a generic physical actuation capability or infer that protocol conformance proves physical effect, safety, interlock state or authority.

`device/gateway ACK != physical-world effect` remains mandatory.

## 22. Operability Elicitation Lens

Every contract/profile/operation/integration/provider realization must answer, as applicable:

- **Como saberemos que está funcionando?** Which conformance/effect/currentness evidence proves the required path?
- **Como saberemos que está degradado?** Which error rate, latency, queue age, stale evidence, incompatibility, partial pagination, residual cohort or unsupported profile indicates degradation?
- **Quem é responsável?** Who owns the semantic contract, producer, consumer, adapter, provider binding, conformance suite, escalation and reconciliation?
- **Que evidência precisamos?** Which contract revision, population, test/probe, provider response, consumer effect, logs/traces/events and audit lineage are sufficient?
- **Qual estado pode permanecer UNKNOWN?** For how long, under which local/offline/degraded conditions, and what operation becomes blocked when the horizon expires?
- **Qual perda/atraso é aceitável?** What message/data/event loss, sync lag, stale schema, version skew or pagination gap is tolerable?
- **Como recuperar?** How are consumers/producers restored, caches/schema bundles rebuilt, cursors reset and incompatible cohorts fenced?
- **Como reconciliar?** What authoritative read-back or comparison resolves ambiguous provider/consumer effect?
- **Como validar depois de mudança/deploy?** Which synthetic probes, conformance suites, compatibility checks, consumer canaries and residual-cohort checks establish post-change safety?

Additional mandatory elicitation dimensions include:

- SLO/SLA for API/contract paths;
- expected throughput and peak/burst assumptions;
- latency percentiles and timeout semantics;
- queue depth **and queue age** where requests/events are buffered;
- retry policy and idempotency scope/lifetime;
- dependency health and provider quotas/rate limits;
- source-of-truth and sync/currentness horizons;
- partial pagination/event-gap detection;
- external permission and contract/API revision drift;
- degraded/offline behavior;
- reconciliation ownership;
- recovery/rollback and maintenance windows;
- capacity headroom;
- cost/usage dimensions and anomaly signals without creating pricing authority;
- audit/evidence retention;
- incident ownership and response.

A feature/API can be fully specified yet operationally unready if any required dimension remains ownerless or unevidenced.

## 23. Queueing / flow / capacity semantics

Interoperability paths often form queue networks across gateway, adapter, provider, broker, consumer and reconciliation stages.

Where queueing assumptions are used, they must name:

- arrival rate `λ` and measurement window;
- service rate/capacity `μ` and concurrency model;
- utilization `ρ = λ/μ` only where the model is applicable;
- burst magnitude/duration;
- queue depth and queue age distributions;
- timeout/deadline budget across stages;
- retry amplification factor;
- fan-out/fan-in multiplier;
- provider quota/rate-limit ceilings;
- offline buffering and reconnect burst;
- headroom assumptions.

`low average utilization != bounded latency != burst tolerance != stable headroom`.

A metric without unit, population, window, topology and currentness cannot support an authoritative capacity or readiness decision.

## 24. Temporal / uncertainty semantics

Every interoperability observation is time-qualified.

The target distinguishes, where available:

- occurrence/event time;
- producer observation time;
- intermediary ingestion time;
- SB observation time;
- reconciliation time;
- evidence validity horizon.

Clock skew and delayed delivery are explicit uncertainty sources. A dashboard or discovery endpoint without a freshness/currentness indication cannot be treated as current operational truth.

`UNKNOWN`, `INCONCLUSIVE`, `PARTIAL` and `STALE` are preserved instead of collapsed into healthy/unhealthy.

## 25. Causality research-only boundary

Graph/timeline evidence may support causal hypotheses about compatibility failure, provider drift or contract rollout impact, but C3.23 does not create causal authority.

A correlated deployment followed by API errors is a signal. It becomes a confirmed causal statement only under separately qualified evidence/methodology and owner decision.

AI may propose root-cause paths, incompatible mappings or remediation candidates, but it cannot strengthen correlation into causation or authorize change.

## 26. Security and privacy-safe interoperability

Contract telemetry, errors and conformance artifacts must minimize data collection and redact secrets, credentials, tokens, personal data and sensitive infrastructure details unless explicitly required and authorized.

Contracts should express privacy/security requirements and evidence carriers without making observability an overcollection excuse.

Required considerations include:

- credential/session expiry/revocation behavior;
- suspicious protocol/authentication activity signals;
- access audit for contract/schema/admin actions;
- privacy-safe sampling and payload capture;
- redaction/minimization rules;
- retention of conformance/error evidence;
- external permission drift;
- trust/certificate currentness references;
- sensitive problem-detail suppression.

## 27. Commercial / cost boundary

The capability may expose usage evidence needed to understand interoperability pressure:

- request/event volume;
- egress/ingress bytes;
- provider operation counts;
- schema/registry/adapter service usage;
- rate-limit/quota consumption;
- retry amplification;
- reconciliation cost;
- storage/retention cost of evidence;
- anomalous usage.

Technology Economic Governance / FinOps and Commercial capabilities remain owners of economic policy, rating, billing and pricing semantics.

`usage evidence != price authority`.

## 28. Production Readiness Coverage

Feature/semantic completeness and Production Readiness Coverage are separate vectors.

C3.23 uses the standard dimensions:

- `OBSERVABILITY`;
- `OWNERSHIP`;
- `FAILURE_HANDLING`;
- `RECOVERY`;
- `CAPACITY`;
- `CURRENTNESS`;
- `SECURITY`;
- `RECONCILIATION`;
- `CHANGE_SAFETY`;
- `COST`;
- `DOCUMENTATION`.

Each dimension uses:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

No scalar health/readiness score is authoritative. A contract can be semantically complete while `OWNERSHIP`, `RECOVERY` or `CURRENTNESS` is `BLOCKED`.

## 29. Adversarial requirements carried into the target

The target explicitly rejects false completeness in cases such as:

- feature fully specified but no operational owner;
- integration without timeout/reconciliation semantics;
- dashboard without freshness/currentness;
- retry without qualified idempotency;
- alert without action owner/runbook;
- metric without unit/population/window/context;
- failure mode without recovery route;
- rollout without rollback/fencing/drainage;
- capacity claim without peak/burst assumptions;
- audit/compliance evidence without retention;
- paginated collection without terminal completeness evidence;
- partial batch normalized into success;
- unknown provider extension silently ignored despite semantic effect;
- schema-valid payload mapped into semantic equivalence;
- mutually parseable revisions treated as bidirectionally compatible;
- old offline consumers erased from migration closure;
- provider/adapter substitution performed before residual cohort drainage;
- external permission drift ignored because endpoint health is green;
- protocol ACK treated as physical effect in C2 integrations.

No item here is a new ConflictInstance or remediation. These are inherited target obligations derived from the closed adversarial research.

## 30. Planning D migration constraints

Planning D must preserve coexistence and migration safety rather than assume an atomic cutover. It must account for:

1. existing JSON Schema/public envelope contracts and AI Gateway version contracts as KEEP foundations;
2. introduction of canonical contract/profile identity without rewriting domain ownership;
3. exact-version current consumers coexisting with future compatibility matrices;
4. adapter/provider revisions and residual client/runtime cohorts;
5. old/new schema/profile coexistence;
6. offline/generated-runtime contract bundles;
7. staged conformance evidence generation;
8. deprecation/sunset windows and fencing criteria;
9. provider-binding interaction with C3.22;
10. unknown/partial remote effects and reconciliation paths;
11. Brownfield external API mappings that remain evidence until adopted;
12. bounded Physical/Peripheral integrations under C2 only.

No migration step may infer semantic equivalence from syntax or provider feature names.

## 31. Planning E proof candidates

Planning E should derive executable/documentary proofs including at least:

1. immutable contract revision identity and lineage;
2. provider/resource identifiers remain non-canonical unless explicitly adopted;
3. schema-valid but semantically-invalid fixture remains rejected/inconclusive at semantic layer;
4. directional compatibility A→B does not imply B→A;
5. compatibility is not transitively inferred without evidence;
6. profile/extension mismatch yields PARTIAL/NON_CONFORMANT/INCONCLUSIVE as appropriate;
7. stale conformance evidence cannot qualify a changed revision;
8. downgrade cannot weaken required security/trust/privacy/authority invariants;
9. 2xx/ACK does not imply APPLIED absent contract proof;
10. ambiguous mutation remains UNKNOWN;
11. UNKNOWN mutation reconciles before unsafe retry;
12. idempotency key scope/lifetime is enforced by contract evidence;
13. retry without qualified idempotency is detectable;
14. batch preserves per-member PARTIAL/UNKNOWN;
15. pagination detects incomplete/expired traversal;
16. unsupported filter is not silently dropped;
17. streaming reconnect preserves declared cursor/duplicate semantics;
18. event-envelope conformance does not imply consumer effect;
19. extension handling follows required ignore/preserve/reject behavior;
20. provider-specific extension cannot silently become portable canonical semantics;
21. contract publication does not imply consumer effective adoption;
22. residual old consumers prevent withdrawal closure when authoritative;
23. offline Station remains within qualified contract/currentness horizon;
24. expired offline horizon produces UNKNOWN/blocked behavior rather than fake currency;
25. Fleet aggregate cannot override Station-local contract evidence;
26. provider API-name equality does not prove semantic equivalence;
27. Brownfield discovered endpoint becomes evidence/candidate, not canonical adoption;
28. currentness/freshness is visible on operational surfaces;
29. alert has action owner/runbook/escalation route;
30. queue depth alone cannot mask excessive queue age;
31. capacity proof states peak/burst/headroom assumptions;
32. post-deploy conformance canary validates selected populations;
33. rollback eligibility is current and revision-qualified;
34. audit/conformance evidence obeys retention/redaction policy;
35. Physical/Peripheral ACK remains bounded integration evidence, not generic actuation/physical truth;
36. AI-generated schema/mapping/test remains proposal/evidence and cannot self-adopt or declare equivalence.

## 32. Standards and interoperability realization notes

Current external standards inform realizations but do not become canonical architecture owners:

- **OpenAPI 3.2.0** (published September 2025) provides a mature HTTP API description realization and added richer streaming representation support; C3.23 consumes this as a descriptive realization, not semantic authority.
- **JSON Schema 2020-12** remains a mature structural-validation dialect and aligns with current SB foundations; validation success remains narrower than semantic correctness.
- **RFC 9110 HTTP Semantics** defines HTTP method/status semantics and reinforces that HTTP operates over resource representations through protocol semantics; application postconditions remain domain-specific.
- **RFC 9457 Problem Details** supplies a portable machine-readable HTTP error/problem shape and warns about security/privacy leakage; problem details enrich protocol outcomes without replacing domain effect truth.
- **AsyncAPI 3.1.0** (released January 2026) is a mature asynchronous API description realization with protocol bindings; it does not by itself establish delivery/ordering/replay semantics beyond what the qualified contract explicitly says.

The architecture intentionally does not mandate one specification family. Protocol/provider mechanics are providerized behind portable semantic contracts.

## 33. AI / low-code non-amplification

AI and low-code surfaces may:

- draft contracts/schemas;
- infer candidate mappings;
- generate adapters/tests;
- explain compatibility diffs;
- suggest migration paths;
- summarize conformance evidence;
- identify likely breaking changes.

They may not:

- declare semantic equivalence from field/name similarity;
- mark stale evidence current;
- suppress PARTIAL/NON_CONFORMANT/INCONCLUSIVE;
- adopt external IDs as canonical identity;
- authorize provider/contract publication;
- select unsafe downgrade;
- infer retry safety without qualified idempotency;
- convert protocol success into domain-effective success;
- perform generic physical actuation;
- strengthen a causal hypothesis into confirmed causality;
- erase residual consumers or unknown states to make a rollout appear complete.

## 34. Decision result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

C3.23 establishes a portable, provider-neutral and revision-qualified interoperability architecture that keeps syntax, structure, behavior, semantics, compatibility, negotiation, conformance evidence, currentness and contract evolution explicitly separate.

The enduring boundary is:

`contract conformance != provider support qualification != authorization != domain semantic equivalence != effective outcome`.

The operational corollary is:

`feature complete != production ready`, and Production Readiness Coverage remains multidimensional rather than a scalar health score.

No product code, Work Package, executive TASK, Construction, remediation, ConflictInstance or new canonical capability was created.