# Generation 2 — Planning C — C3.17 Secrets / Configuration / Environment Portability Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Secrets / Configuration / Environment Portability**
Decision: `C3.17`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by:

- `RESEARCH_PIPELINE_STATE.json` as phase/current-focus/next-action authority;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- C0 Universal Capability Architecture / Semantic Substrate;
- C1 Elicitation & System Understanding Architecture;
- C2 Physical / Peripheral Integration Boundary;
- `PLANNING_A_SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_BOUNDARIES.md`;
- `PLANNING_B_SECRETS_CONFIGURATION_ENVIRONMENT_PORTABILITY_SB_CURRENT_STATE.md`;
- relevant earlier C3 decisions for Identity, Authorization, Governance, Security/Recovery, Trust/PKI, Privacy, Data, Storage, Messaging and Observability;
- the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions:

- `secret reference != secret value`;
- `configuration definition != realized value != effective runtime state`;
- `desired configuration != applied configuration != consumer-effective configuration`;
- `provider accepted != all consumers converged`;
- `rotation requested != new value created != old value revoked != old value drained`;
- `possession != authorization != trust`;
- `missing != ABSENT != null != default`;
- `cached value != current authority`;
- `environment label != semantic profile`;
- `provider object identity != canonical reference identity`;
- `Fleet aggregate != local applied configuration`;
- `AI suggestion != configuration/secret authority`;
- `visibility != authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict`.

## 2. Problem and current-state anchor

Generation 1 already has a valuable bounded foundation: canonical `EnvironmentProfile`, symbolic `secret-reference` bindings, provider-neutral `SecretResolver`, process-environment and file-backed realizations, deterministic fail-closed resolution, ephemeral runtime injection, redaction from durable evidence and autonomous runtime behavior after activation.

The missing target semantics are broader: typed configuration definitions and overlays, independent revisions/effective-time, configuration presence semantics, secret version/lease/currentness, rotation/revocation/adoption/drainage, provider qualification/substitution, remote ambiguous effect handling, local/offline stale horizons, evidence of consumer-effective convergence, residual generations and Brownfield/manual configuration assimilation.

C3.17 therefore generalizes the existing foundation rather than replacing it.

## 3. Target decision

**DECISION C3.17-D1 — establish a provider-neutral, revision-qualified Configuration & Secret Realization Plane that owns canonical reference/definition semantics, overlay/effective-value derivation, resolution/materialization/currentness lineage, rotation/revocation/drainage and environment portability, while provider mechanics remain qualified realizations.**

The capability owns six linked truth planes:

1. **Definition & Reference Plane** — canonical configuration/secret references, schemas, constraints, sensitivity and requiredness.
2. **Profile & Overlay Plane** — environment/profile composition, scope, precedence, inheritance, explicit overrides and effective-time.
3. **Resolution & Materialization Plane** — provider binding, resolution, realized version, injection/mount/file/environment/process-memory materialization.
4. **Consumer-Effective & Currentness Plane** — evidence that intended consumers actually adopted an eligible realization and remain within currentness horizon.
5. **Rotation / Revocation / Drainage Plane** — generation coexistence, lease renewal, revocation, residual copies, bounded stale use and proof of drainage.
6. **Portability / Reconciliation Plane** — provider substitution, environment migration, drift detection, local/Fleet views and governed convergence.

No concrete vault path, cloud secret ARN, parameter-store key, environment-variable name, file path or provider version ID becomes canonical semantic identity merely because it is stable in one realization.

## 4. Canonical identities and revision model

The target introduces or qualifies identities such as:

- `ConfigurationReferenceId`;
- `ConfigurationDefinitionId` and `ConfigurationDefinitionRevisionId`;
- `SecretReferenceId`;
- `SecretDefinitionId` and `SecretDefinitionRevisionId`;
- `EnvironmentProfileId` and `EnvironmentProfileRevisionId`;
- `OverlayDefinitionId` and `OverlayRevisionId`;
- `ProviderBindingRef`;
- `RealizedValueRef` / `RealizedSecretVersionRef` without exposing secret bytes;
- `MaterializationId`;
- `ConsumerAdoptionId`;
- `CurrentnessAssessmentId`;
- `RotationIntentId` / `RevocationIntentId`;
- `ResidualGenerationCohortId`;
- `ConfigurationReconciliationId`.

Canonical identities remain stable across provider substitution where semantic intent is unchanged. Revision identity changes when schema, constraints, precedence, applicability, rotation policy, exposure policy or other semantic behavior changes.

Effective-time and transaction-time/current-record time are separable where historical replay matters. A profile revised today does not rewrite the historical profile under which a workload previously executed.

## 5. Configuration definition and presence semantics

**DECISION C3.17-D2 — configuration values are typed, schema-qualified and presence-aware; `ABSENT`, explicit `null`, defaulted value and deletion/reset intent are distinct semantic states.**

A configuration definition may declare:

- semantic type/kind;
- unit/dimension where numeric semantics require it;
- allowed domain/range/format;
- requiredness;
- sensitivity/classification;
- default semantics, including whether a default is provider-independent or environment-specific;
- mutability/reload expectations;
- owning capability/object reference;
- applicable tenant/Station/site/runtime/cohort scope;
- validation revision;
- deprecation/migration metadata.

A default is not silently materialized as if explicitly authored. Evidence should preserve whether an effective value arose from explicit declaration, inherited overlay, default evaluation, provider fallback or runtime-local substitution.

Unknown keys, unsupported semantics or invalid values do not silently degrade into text blobs. Their disposition must be explicit: rejected, unsupported, deferred, quarantined or admitted under a declared compatibility profile.

## 6. Environment profiles, overlays and precedence

**DECISION C3.17-D3 — environment/profile overlays are revisioned semantic transformations with explicit scope and precedence, not implicit file/text merge behavior.**

A profile can compose:

`base definition -> enterprise constraints -> tenant/Station specialization -> site/runtime cohort specialization -> explicitly permitted local override`

subject to monotonic authority. Lower scopes cannot weaken superior security, privacy, trust, retention, provider-admission or mandatory configuration constraints.

Every overlay edge records:

- source and target profile revisions;
- applicability scope;
- precedence rule;
- override eligibility;
- effective period;
- provenance/author/decision reference;
- affected semantic keys;
- conflict outcome when two overlays make incompatible claims.

`environment = production` is merely a label unless linked to a revisioned semantic profile. Labels such as dev/stage/prod cannot substitute for explicit policy, provider, trust, privacy, capacity or runtime requirements.

## 7. Secret value non-disclosure and evidence model

Secret bytes are not durable canonical evidence. Durable records carry references, realized-version metadata, provider binding, timestamps, currentness and cryptographic/non-secret fingerprints only where safe and necessary.

Evidence must support statements such as:

- which canonical reference was requested;
- which provider/binding and provider object/version satisfied it;
- whether resolution succeeded without disclosing the value;
- where/how it was materialized;
- which consumer cohort reported adoption;
- currentness/lease/expiry horizon;
- whether a superseded generation remains capable of authoritative use;
- whether revocation/drainage is complete, partial or unknown.

Logs, traces, exception messages, diagnostics, support bundles and AI summaries must preserve non-disclosure. Redaction is a semantic requirement, not merely UI formatting.

## 8. Resolution, materialization and consumer-effective lineage

**DECISION C3.17-D4 — portable lineage distinguishes provider resolution from consumer-effective adoption.**

Minimum lineage:

`declared reference -> authorized resolution request -> provider resolution outcome -> realized version -> materialization -> consumer reload/restart/adoption -> currentness validation -> converged cohort`

A process start can prove initial materialization but not continuing currentness after rotation. A file write does not prove a process reloaded it. A provider response does not prove all sites/consumers received it.

Materialization modes may include environment variables, mounted files/objects, process memory, sidecar/agent delivery, generated configuration files or provider-specific equivalents. They remain realization mechanics behind the same semantic lineage.

## 9. Rotation, renewal, revocation and residual cohorts

**DECISION C3.17-D5 — rotation and revocation are cohort-aware convergence processes, not provider-side single events.**

A rotation may progress through:

`PROPOSED -> AUTHORIZED -> NEW_GENERATION_CREATED -> DISTRIBUTION_STARTED -> PARTIAL_ADOPTION -> CONSUMER_EFFECTIVE -> OLD_GENERATION_REVOKED/FENCED -> RESIDUALS_DRAINED -> VALIDATED`

States may differ by provider capability, but stronger completion claims require equivalent proof.

Residual cohorts include:

- process environment blocks and process memory;
- mounted files and node-local caches;
- sidecar/agent caches;
- generated manifests and bootstrap bundles;
- CI/CD variables;
- offline replicas;
- queued work carrying old credentials/config assumptions;
- paused/suspended workers;
- integration/peripheral gateways;
- backup/restore material still eligible to reintroduce an old generation.

Revocation is incomplete while a residual cohort can still produce authoritative effects unless policy explicitly tolerates the residual and records its bounded horizon/risk.

## 10. Leases, stale caches and offline closure

Local/offline operation may use cached material only under an explicit support profile defining:

- cache eligibility;
- maximum stale/currentness horizon;
- lease renewal dependencies;
- failure/degraded behavior after horizon expiry;
- required trust/PKI state;
- authorization assumptions;
- allowed operation classes;
- reconnect reconciliation.

`offline availability != indefinite authority`.

When currentness cannot be re-established, state becomes `STALE`, `PARTIAL`, `INCONCLUSIVE` or an owner-defined denied/degraded condition; it must not silently remain current.

Physical/Peripheral credentials/configuration remain bounded to the C2 integration/governance plane. Offline possession of a peripheral credential does not infer generic direct physical actuation authority.

## 11. Remote mutation and ambiguous outcomes

Provider-side create/update/delete/rotate/revoke operations use explicit effect semantics:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

`UNKNOWN -> reconcile-before-retry` unless idempotency is explicitly qualified for the exact operation, provider identity, target reference and evidence horizon.

A timeout after a rotate request cannot be treated as either failure or success without reconciliation. Blind retries may create multiple versions, revoke the wrong generation or produce conflicting aliases.

## 12. Source-of-truth and provider binding

Canonical semantic truth belongs to the configuration/secret definition and revision, not the provider object. Provider Binding owns provider discovery/qualification/admission/cutover mechanics; C3.17 declares the support vector it requires.

A provider support vector can include:

- lookup/read semantics;
- version pinning;
- dynamic secret/lease support;
- renewal;
- rotation;
- revocation/delete semantics;
- alias/current-version behavior;
- consistency/propagation characteristics;
- audit/evidence support;
- offline/cache behavior;
- maximum object/value sizes;
- rate/queue limits;
- residency and cryptographic properties;
- export/migration support.

Matching feature names do not establish semantic equivalence.

## 13. Provider substitution and coexistence

Provider substitution is an explicit lifecycle:

`qualify target -> dual bind/coexist -> seed/migrate definitions or generations -> validate resolution -> shift consumer cohorts -> reconcile -> revoke/fence old authority -> drain residual copies -> withdraw old provider`

Canonical references need not change when semantic intent remains the same.

During coexistence, both provider realizations may be technically reachable. Authority over which realization is current remains explicit and revision-qualified. A weaker target provider cannot inherit stronger rotation/revocation/offline/audit claims without evidence.

## 14. Trust / PKI crossings

Enterprise Trust / PKI remains owner of trust anchors, certificate/path validity, issuance, renewal and revocation semantics.

C3.17 may store/materialize key and certificate references/bytes but cannot declare trust because they exist. Secret rotation involving certificates/keys must coordinate with PKI issuance/validity/revocation lineage rather than invent parallel trust semantics.

Bootstrap trust dependencies are explicit. A system cannot claim autonomous secret resolution if the resolver itself requires unavailable trust material or a remote authority that is outside the declared local closure.

## 15. Authorization and multitenant scoping

Authorization/Organization owns who can:

- view references;
- view/reveal values;
- bind providers;
- edit configuration;
- rotate/revoke secrets;
- widen stale-cache horizons;
- adopt a Brownfield provider object;
- override an inherited configuration;
- change profile precedence.

Visibility of a key/reference does not imply permission to reveal or rotate its value. Possession by a workload does not confer administrative authority.

All operations remain tenant/Enterprise/Station/site/runtime scoped. Cross-tenant accidental name collision must not merge canonical identity.

## 16. Drift and reconciliation

Drift compares desired canonical revision against qualified provider/runtime evidence without overwriting either side.

Candidate drift classes include:

- desired definition differs from provider realization;
- provider current alias points to unexpected generation;
- runtime materialization is stale;
- one site/cohort missed an overlay/profile update;
- old generation remains effective after revocation intent;
- provider binding changed without governed adoption;
- local manual edit exists outside canonical lineage;
- restored runtime reintroduced historical configuration.

Reconciliation records proposed/authorized/requested/accepted/effective/converged/validated stages and remains subject to authority. Architecture Reconciliation may detect/qualify drift; it does not silently normalize canonical truth.

## 17. Queue, propagation and capacity semantics

Configuration/secret propagation has capacity and backlog behavior of its own. Evidence may include:

- pending consumers;
- age of oldest unapplied revision;
- distribution/renewal rate;
- provider throttling/rate-limit state;
- failed/unknown mutation queue;
- offline cohort count;
- lease expiry distribution;
- residual-generation count;
- cache refresh backlog;
- reconciliation queue age.

A low average update latency does not prove tail cohorts are current. A fleet-level `99% converged` summary cannot hide a critical site/cohort holding an expired or revoked secret.

## 18. Brownfield / Legacy Mirroring assimilation

Brownfield discovery can observe:

- `.env` files;
- shell/profile exports;
- service-manager environment entries;
- config files;
- spreadsheets/manual runbooks;
- CI/CD variables;
- provider secret stores;
- handwritten deployment scripts;
- local operator overrides;
- embedded credentials or hard-coded configuration;
- offline/bootstrap bundles.

Observed values/references become evidence/candidates, not canonical definitions. `observed behavior != intended process != approved canonical process` remains mandatory.

Assimilation sequence:

`discover -> classify sensitive material without leaking it -> map to candidate semantic references -> identify scope/currentness/owners -> detect contradictions/shadow copies -> explicit adopt/defer/out-of-scope decision -> create governed lineage`

No migration may require copying secret values into research/planning artifacts.

## 19. Elicitation Lens

C3.17 consumes the C1 Elicitation Knowledge Base through a capability-specific lens rather than a hardcoded questionnaire.

Adaptive questions include:

- What configuration/secret concept does this value control, and which capability owns that concept?
- Is the value secret, sensitive, ordinary configuration or merely a provider locator?
- Who may view the reference, reveal the value, change it, rotate it or revoke it?
- What is the source of truth today, and is that source approved or merely observed?
- Is `missing` different from `null`, empty string or default?
- Which defaults/overlays exist, and what is their precedence by Enterprise/Station/site/runtime?
- Does a change require restart, reload, rolling update or dynamic refresh?
- How is consumer-effective adoption proven?
- Can old and new generations coexist? For how long?
- What is the offline/stale-cache horizon?
- What happens when renewal or provider access fails?
- Which residual copies can survive rotation/revocation?
- Are there shadow `.env` files, spreadsheets, manual overrides, emergency credentials or undocumented operator procedures?
- Which provider-specific behavior would be lost during substitution?

Question provenance records the gap that triggered the question and which downstream artifacts are blocked without resolution.

AI may propose mappings, questions and profile candidates but every inference remains `InferredCandidate` until authorized evidence/adoption changes status.

## 20. Elicitation coverage and sufficiency

Coverage remains dimensional using `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED` with evidence/currentness.

Relevant dimensions include:

- purpose/owner;
- reference/value classification;
- actors/authority;
- source-of-truth;
- schema/type/presence/default semantics;
- overlay/precedence;
- environment/site/runtime scope;
- provider binding/support;
- resolution/materialization;
- refresh/adoption/currentness;
- rotation/revocation;
- failure/recovery;
- offline/cache;
- trust/PKI;
- privacy/residency/retention;
- evidence/audit;
- lifecycle/versioning;
- capacity/propagation;
- observability;
- acceptance/proof.

No scalar completeness score is canonical.

### Sufficient for abstraction

Canonical owner, reference/value distinction, primary scopes, source-of-truth candidate, presence semantics and materialization class are known well enough to model without silently inventing provider semantics.

### Sufficient for candidate architecture

Overlay/precedence, authority, provider support needs, currentness, failure/UNKNOWN, offline behavior, rotation/revocation and adjacent-owner boundaries are resolved or explicitly blocked.

### Sufficient for implementation

Schemas/revisions, concrete profiles, binding contracts, materialization/reload semantics, migration/coexistence, residual cohorts and acceptance obligations are resolved for the chosen realization.

### Sufficient for publish/operation

Current provider/runtime evidence proves required consumers are eligible/current; critical residuals are drained/fenced/tolerated explicitly; recovery/rollback paths are qualified; observability and incident ownership exist; no critical unresolved question is hidden by a `complete` flag.

## 21. Critical-gap detection

Automatic gap detection should flag at least:

- secret value stored where only a reference is permitted;
- unknown authority for reveal/change/rotate/revoke;
- ambiguous source-of-truth;
- unspecified `missing/null/default` semantics;
- overlay conflict or precedence not defined;
- secret/config without revision/currentness semantics;
- integration/provider mutation without timeout/`UNKNOWN` handling;
- rotation without consumer-effective adoption evidence;
- revocation without residual-cohort drainage/fencing;
- offline cache without bounded stale horizon;
- provider substitution without coexistence/cutover/drainage semantics;
- sensitive material without privacy/residency/retention policy where applicable;
- PKI material treated as trusted merely because present;
- runtime effective state assumed from desired configuration;
- Brownfield secret/config observed but silently adopted;
- Fleet summary lacking local/cohort currentness evidence.

## 22. Derived artifacts and traceability

C3.17 follows the C1 traceability chain:

`Source/Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model -> Configuration/Secret/Profile/Binding semantics -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`

User Stories capture intent/value/context only. Use Cases include preconditions, trigger, main/alternate/failure/recovery flows and postconditions. Scenarios must cover happy, alternate, failure, boundary, abuse/misuse, recovery, offline, concurrency and historical/version-change cases.

Security-sensitive examples must use references/non-secret fixtures rather than real secret material.

## 23. Production Readiness Coverage

Production readiness is vector-valued. Required dimensions include, where applicable:

- definition/schema readiness;
- authority readiness;
- provider-binding qualification;
- materialization/reload readiness;
- currentness/lease readiness;
- rotation/revocation readiness;
- residual-cohort drainage readiness;
- offline/degraded readiness;
- trust/PKI readiness;
- privacy/governance readiness;
- rollback/recovery readiness;
- observability/incident readiness;
- propagation/capacity readiness;
- evidence/proof readiness.

A capability may be publish-blocked by one critical dimension even if the others are resolved. No universal quality score replaces this vector.

## 24. Planning D carry-forward

Planning D must migrate incrementally from the existing Generation 1 foundation:

1. preserve current `EnvironmentProfile` and `SecretResolver` behavior as a compatibility baseline;
2. introduce revisioned semantic reference/definition records without requiring immediate provider migration;
3. allow existing `secret://...` references to map into canonical reference identities;
4. coexist with current env/file-based resolvers while qualified provider capabilities are added;
5. introduce typed configuration/presence/default semantics incrementally;
6. add overlay/profile lineage without a big-bang replacement of existing environment definitions;
7. instrument resolution/materialization/adoption evidence without leaking secret values;
8. add rotation/revocation/currentness and residual-cohort semantics before claiming convergence;
9. migrate Brownfield free-form/manual configuration into structured evidence/adoption progressively;
10. preserve self-hosted/local operation and avoid making a remote secret/config store mandatory for all systems.

Planning D must not reinterpret prior historical evidence as if it had the new semantics unless an explicit backfill/provenance rule qualifies it.

## 25. Planning E proof candidates

Planning E must define product proofs for at least:

- canonical secret/config reference identity survives provider substitution;
- secret values never enter durable evidence where only references are permitted;
- `ABSENT`, `null`, default and delete/reset remain distinguishable;
- overlay precedence is deterministic, scope-qualified and non-authority-amplifying;
- desired configuration is not reported as runtime effective without adoption evidence;
- rotation can prove intended cohort adoption and identify residual old generations;
- revocation cannot claim completion while authoritative residual copies remain;
- `UNKNOWN -> reconcile-before-retry` for ambiguous provider mutation;
- bounded offline cache expires/degrades according to declared policy;
- provider substitution preserves canonical identity while exposing degraded/unsupported semantics;
- PKI trust is not inferred from materialized key/certificate bytes;
- Brownfield discovery produces candidate evidence, not automatic canonical adoption;
- Fleet aggregation preserves local/cohort currentness and does not hide critical stale consumers;
- Elicitation adaptive routing, contradiction/unresolved handling and critical-gap detection work without false `complete`;
- AI suggestion does not reveal values or gain configuration/secret authority;
- Physical/Peripheral credential/config flows stay inside C2 integration/governance boundary.

## 26. Capability boundary summary

- **Identity / Authentication / Federation** owns principal identity and authentication assurance.
- **Authorization / Policy / Organization / Multitenancy** owns administrative/reveal/rotate/revoke authority and scope.
- **Enterprise Trust / PKI** owns trust/path/issuance/revocation semantics.
- **Privacy / Data Governance** owns purpose, retention, residency, hold and sensitive-data obligations.
- **Security / Resilience / Recovery** owns security posture, degraded operation, fencing and recovery qualification.
- **Deployment / Runtime** owns placement, activation and desired/effective runtime lifecycle.
- **Provider / Binding** owns provider discovery, qualification, admission, binding and cutover mechanics.
- **Lifecycle / Versioning** provides reusable revision/coexistence primitives.
- **Architecture Reconciliation** owns qualified desired-vs-observed drift reconciliation, not silent normalization.
- **Observability** consumes non-secret currentness/propagation evidence and never gains value reveal authority.
- **UCA** supplies reusable identity/revision/evidence/effect/support-vector primitives without absorbing this semantic owner.
- **C2 Physical / Peripheral boundary** limits credentials/configuration for physical/peripheral integrations to integration/governance semantics and grants no generic actuation authority.

## 27. Decision result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

C3.17 establishes a portable, auditable and provider-neutral semantic owner for secrets/configuration/environment realization while preserving the strong Generation 1 reference/value and provider-boundary foundation. It explicitly models revisions, overlays, presence/default semantics, consumer-effective adoption, currentness, rotation/revocation, residual cohorts, offline closure, provider substitution, Brownfield assimilation, Elicitation Lens and Production Readiness without storing secret material as canonical evidence or amplifying authority.

No new capability is promoted. No `ConflictInstance`, remediation, Work Package, TASK, Construction or product code is created by this decision.
