# Generation 2 — Planning C — C3.25 Extension / Plugin / Marketplace Architecture Target

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Extension / Plugin / Marketplace Architecture**
Decision: `C3.25`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction, remediation, Planning D/E execution, Architecture Reconciliation, WBS or worker handoff is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, Planning C C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for Extension / Plugin / Marketplace Architecture, prior C3 decisions, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

The authoritative state and branch head were re-read immediately before persistence. Entry head: `2344ff4feb29bbc63a2955b70147df769793759a`.

Constitutional distinctions remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `extension installed != admitted != authorized != effective`;
- `marketplace listed != trusted != admitted`;
- `signed != safe != compatible != authorized`;
- `requested capability != granted authority != effective reachability`;
- `same extension name/version != semantic equivalence`;
- `dependency resolved != semantic compatibility`;
- `sandbox label != proven containment`;
- `provider support != host admission`;
- `disable requested != residual authority drained`;
- `catalog removal != uninstall != revoke != convergence`;
- `publisher reputation != artifact provenance != enterprise trust decision`;
- `provider/runtime identity != canonical extension identity`;
- `historical admission != current readiness`;
- `provenance != truth != currentness != authority`;
- `AI proposal != admission/grant/activation authority`;
- `observed behavior != intended behavior != approved canonical extension semantics`;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

Physical / Peripheral integrations remain bounded by C2 integration/governance semantics. An extension may expose, configure or consume qualified integration-plane operations, but extension installation never creates a generic direct physical-actuation capability or bypasses safety/authority owners.

## 2. Planning A/B anchor and target disposition

Planning A established Extension / Plugin / Marketplace Architecture as owner of canonical extension identity/revision, extension declarations and host attachment, requested/granted/effective capability relations, admission/trust qualification, extension lifecycle, containment expectations, host/API/dependency compatibility, catalog/distribution relations, provider-backed realization mapping and extension-specific migration/rollback/residual-cohort semantics. It explicitly did **not** absorb Artifact/Release, Build, generic Authorization, Security, Governance, Lifecycle, Deployment/Runtime, Provider/Binding, API-contract semantics, marketplace commerce or domain semantic ownership.

Planning B found narrower but valuable predecessors: provider-neutral adapter seams, explicit versioned contracts, deterministic capability/provider/version materializer lookup, fail-closed unsupported selections and bounded public-contract extension mechanics. It found no generalized first-class extension identity, permission/admission lifecycle, signing qualification, sandboxing, marketplace governance, rollback qualification or residual-cohort drainage.

C3.25 therefore adopts:

**KEEP + HARDEN + GENERALIZE + INTEGRATE + PROVIDERIZE EXTERNAL MARKETPLACE/RUNTIME MECHANICS**.

It rejects a universal package manager, a registry-coordinate-as-identity model, a marketplace-as-authority model, AI-managed self-installation, provider-native permission semantics as canonical policy, and an extension framework that can silently steal ownership from the capability whose semantics it extends.

## 3. Target decision

**DECISION C3.25-D1 — establish a provider-neutral, revision-qualified Extension Governance & Realization Plane that separates extension identity/declaration from artifacts and listings; requested authority from granted/effective authority; discovery from admission; installation from activation; compatibility from loadability; and lifecycle intent from effective residual-cohort convergence.**

The plane has twelve linked semantic surfaces:

1. **Extension Identity & Revision Plane** — stable canonical extension identity plus immutable revisions and lineage.
2. **Manifest / Semantic Declaration Plane** — host attachments, dependencies, requested capabilities, configuration/data expectations and realization requirements.
3. **Extension Point Plane** — typed, revisioned host attachment contracts whose semantic owners remain the owning capabilities.
4. **Dependency / Conflict Plane** — explicit extension-to-extension, host, contract, schema, runtime and provider constraints.
5. **Admission & Qualification Plane** — current evidence-qualified eligibility for a revision, scope and host revision vector.
6. **Authority Plane** — requested, granted and effective capability/operation reachability kept distinct.
7. **Lifecycle Plane** — discovered, admitted, installed, active, suspended, updating, revoked, withdrawn and removed semantics without collapsing realization effects.
8. **Containment & Resource Plane** — sandbox/isolation requirements, host API exposure, resource budgets, blast-radius boundaries and failure propagation contracts.
9. **Catalog / Marketplace Plane** — discovery, publisher/listing metadata and distribution references without converting listing into trust/admission/entitlement.
10. **Provider / Runtime Realization Plane** — local or provider-backed realizations preserving canonical extension identity across substitution/coexistence.
11. **Evolution / Residual Cohort Plane** — update, coexistence, rollback eligibility, revocation drainage and residual extension cohorts.
12. **Operability / Evidence / Elicitation Plane** — observability, incident/kill-switch boundaries, evidence provenance, adaptive elicitation and multidimensional readiness.

## 4. Canonical identity, immutable revision and realization identities

**DECISION C3.25-D2 — canonical extension identity is stable and independent of package, marketplace, provider, deployment and runtime identities.**

Canonical identities include:

- `ExtensionId` — stable logical extension identity;
- immutable `ExtensionRevisionId`;
- `ExtensionManifestRevisionId`;
- `ExtensionPointId` / immutable `ExtensionPointRevisionId`;
- `ExtensionAttachmentId`;
- `ExtensionAdmissionAssessmentId`;
- `ExtensionGrantId` / immutable grant revision where applicable;
- `ExtensionInstallationOccurrenceId`;
- `ExtensionActivationOccurrenceId`;
- `ExtensionRealizationId`;
- `ExtensionResidualCohortId`;
- `ExtensionReconciliationId`.

Realization identities may include package coordinates/digests, repository tags, marketplace listing IDs, publisher-native IDs, provider integration IDs, runtime process/container IDs, deployment unit IDs and client bundle hashes. They are typed references, not aliases silently promoted to canonical identity.

A materially different extension cannot overwrite an existing immutable revision merely because the provider reuses a semantic version string or marketplace coordinate. Correction creates explicit correction/supersession lineage.

## 5. Manifest is a declaration, not authority or proof

**DECISION C3.25-D3 — the extension manifest is revisioned declared intent and requirements; it is not admission, compatibility, provenance, authority or runtime truth.**

A canonical manifest can declare, when applicable:

- canonical extension identity/revision reference;
- publisher identity reference and provenance pointers;
- host capability/extension-point attachments;
- semantic dependencies and minimum/maximum qualified revision constraints;
- requested operations/capabilities and resource scopes;
- data/schema/configuration/secret ownership expectations;
- UI/workflow/integration/provider contributions;
- event/hook subscriptions and invocation semantics;
- lifecycle hooks with effect/idempotency requirements;
- isolation/sandbox/resource requirements;
- network/external-system requirements;
- local/offline support requirements;
- migration/update/rollback declarations;
- observability and support obligations;
- commercial/entitlement references where applicable.

Provider-native manifests map into this model through typed mappings. Unmapped or lossy semantics remain explicit `PARTIAL/INCONCLUSIVE`; import tooling and AI may propose mappings but cannot canonically adopt them without authority.

## 6. Semantic ownership and extension contribution graph

**DECISION C3.25-D4 — extensions contribute typed references into owner-controlled semantic graphs; they do not create a second semantic ownership system.**

An extension may provide or realize:

- UI components or projections owned semantically by UI/AGWS;
- workflow activities owned by Workflow;
- integrations/adapters owned by Integration;
- provider realizations qualified by Provider/Binding;
- schema/data material owned by Data;
- storage/media handlers owned by Storage;
- notification transports/handlers owned by Messaging;
- standards/protocol adapters owned by Standards/API Contracts;
- operational/economic evidence consumed by Observability/FinOps.

The Extension capability owns the **attachment, admission, lifecycle and realization relationship**, not the meaning of every contributed domain object.

Typed Semantic Graph edges therefore include explicit roles such as `EXTENDS`, `REALIZES`, `DEPENDS_ON`, `ATTACHES_TO`, `REQUESTS`, `GRANTED_FOR`, `PROVIDES_REALIZATION_FOR`, `SUPERSEDES`, `CONFLICTS_WITH`, `CONSTRAINED_BY`, `OBSERVED_AS` and `DRAINED_BY` rather than untyped plugin metadata.

If an answer, manifest field or discovered behavior semantically belongs to another capability, the Elicitation Knowledge Base routes a typed reference to that owner; it must not duplicate canonical ownership inside the extension record.

## 7. Requested, granted and effective authority

**DECISION C3.25-D5 — extension authority is a three-stage, revision/scope/currentness-qualified relation: `requested -> granted -> effective`; no stage may be inferred from installation, publisher trust, marketplace entitlement or runtime reachability alone.**

`RequestedCapabilitySet` is manifest intent. `GrantedCapabilitySet` is the result of Authorization/Policy plus applicable Governance/Security/Trust constraints for subject, extension revision, tenant/Station/site, resource, operation and effective period. `EffectiveCapabilitySet` is observed/qualified reachability after current runtime/provider/binding/containment state.

Core invariants:

- `effective ⊆ granted`;
- a grant may be narrower than requested;
- a provider/runtime may realize less than granted without widening authority;
- offline/degraded mode cannot widen grants;
- stale local grants cannot override newer revocation beyond an explicitly qualified offline authority horizon;
- Enterprise → Station → Role → Person remains monotonic;
- extension-generated UI or AI actions never become an authority source.

Permission changes may require explicit re-consent/re-admission. A revision that newly requests a sensitive operation cannot inherit prior approval by semantic-version proximity.

## 8. Admission is multidimensional and current

**DECISION C3.25-D6 — admission is a current applicability-scoped assessment, not a boolean package property.**

Admission consumes qualified evidence across dimensions such as:

- artifact identity/integrity/provenance/SBOM/signature;
- publisher/trust qualification;
- host capability and extension-point compatibility;
- dependency/conflict closure;
- API/schema/runtime/provider revision compatibility;
- requested-versus-permitted authority;
- security/isolation profile;
- privacy/governance/residency constraints;
- tenant/Station/site scope;
- configuration/secret/data readiness;
- resource/quota/capacity requirements;
- offline/autonomy closure where required;
- lifecycle/migration readiness;
- operability/observability/support obligations;
- commercial entitlement where that is a precondition to use, without making commercial entitlement itself an authorization grant.

Assessment outcomes include at least `QUALIFIED`, `PARTIAL`, `BLOCKED`, `INCOMPATIBLE`, `STALE`, `UNKNOWN`, `INCONCLUSIVE` and `NOT_APPLICABLE` with evidence.

No scalar quality score may hide a required `BLOCKED`, `INCOMPATIBLE`, `UNKNOWN`, `INCONCLUSIVE`, stale critical evidence or unresolved HIGH/CRITICAL elicitation gap.

## 9. Extension points and compatibility

**DECISION C3.25-D7 — extension points are typed, revisioned contracts whose compatibility is directional, scoped and owner-qualified.**

An `ExtensionPointRevision` references the owning capability and may define required semantic contract, input/output/event shapes, authority expectations, lifecycle constraints, execution/failure semantics and realization hooks. Standards/API Contracts owns generic conformance; Extension Architecture owns whether a particular extension attachment is eligible for that host point.

Compatibility may depend on a sparse `RevisionVector` including host capability revision, extension point/API/schema/workflow/runtime/provider/security profile and extension revision. Lexical version comparison or successful dynamic loading cannot substitute semantic qualification.

A host change may invalidate prior extension admission. Compatibility is not transitively inferred from `A compatible with B` and `B compatible with C` unless the owning contracts explicitly prove that relation.

## 10. Dependency and conflict graph

**DECISION C3.25-D8 — extension dependency resolution is a typed dependency/conflict graph with explicit semantic ownership, not provider order or last-writer-wins.**

Dependency edges can target:

- extension revisions;
- host capabilities/extension points;
- API/protocol contracts;
- schemas/data contracts;
- runtime/toolchain features;
- provider support vectors;
- trust/security profiles;
- configuration/secrets;
- other owner-defined resources.

The graph records required/optional/alternative dependencies, revision/applicability constraints, locality, evidence currentness and conflict semantics. Cycles or conflicting constraints remain explicit and may block admission. Provider resolution success cannot silently convert an unresolved semantic conflict into PASS.

Ordering is explicit only where semantics require it. Hook priority is not a universal business ordering primitive and cannot silently override Workflow/Decision/Authorization owners.

## 11. Install, activate, suspend, revoke and uninstall lifecycle

**DECISION C3.25-D9 — extension lifecycle separates canonical intent, realization occurrences and effective convergence.**

Portable lifecycle states may include:

`DISCOVERED -> DECLARED -> QUALIFYING -> ADMITTED -> INSTALL_REQUESTED -> INSTALLED_CANDIDATE -> ACTIVATION_REQUESTED -> ACTIVE_CANDIDATE -> EFFECTIVE`.

Cross-cutting states include `PARTIAL`, `INCONCLUSIVE`, `BLOCKED`, `SUSPENDED`, `UPDATE_IN_PROGRESS`, `REVOKE_REQUESTED`, `REVOKED_CANDIDATE`, `DRAINING`, `WITHDRAWN`, `REMOVE_REQUESTED`, `REMOVED_CANDIDATE`, `RECONCILE_REQUIRED` and `CLOSED` where applicable.

State labels do not prove postconditions. Install/activation/deactivation/uninstall occurrences use `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal` and effect disposition `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` when distributed or external effects are possible.

`UNKNOWN -> reconcile-before-retry` unless operation-scoped idempotency is qualified for the exact identity/revision/scope.

## 12. Lifecycle hooks, events and idempotency

**DECISION C3.25-D10 — lifecycle hooks and extension events are typed execution/integration contracts, not arbitrary privileged callbacks.**

Hooks such as install, enable, disable, update, migrate or uninstall must declare:

- invocation identity;
- revision and scope;
- authority needed;
- preconditions/postconditions;
- external effects;
- retry/idempotency qualification;
- timeout/UNKNOWN semantics;
- compensation/reconciliation route;
- evidence emitted;
- ordering/concurrency assumptions.

Message/event occurrence, delivery attempt, hook invocation and external business effect remain distinct identities. Duplicate delivery does not prove duplicate effect; successful callback does not prove host convergence.

## 13. Containment, sandboxing and resource budgets

**DECISION C3.25-D11 — extension containment is a qualified contract over effective reachability and shared-state coupling; process/container separation is only one realization mechanism.**

Containment requirements may bound:

- host APIs and operations;
- network destinations;
- filesystem/storage/data domains;
- secrets/configuration access;
- tenant/Station/site resources;
- CPU/memory/storage/IO/concurrency/rate budgets;
- background tasks/workers/schedules;
- event subscriptions;
- provider calls and external effects;
- logging/telemetry visibility;
- generated UI/workflow injection surfaces.

Security/Resilience owns security qualification; Authorization owns grants; Deployment/Runtime owns process/container realization. Extension Architecture composes their current evidence into extension eligibility.

Resource-budget exhaustion can produce degradation, suspension or partial functionality but never authority widening. Fail-open behavior for privileged hooks is prohibited unless the owning policy explicitly authorizes the exact degraded semantics.

## 14. Marketplace/catalog is discovery, not trust or authority

**DECISION C3.25-D12 — marketplace/catalog semantics remain informational/distribution relations; listing, ranking, review, purchase or download never implies host admission, trust, authorization or effective installation.**

Catalog entries may reference:

- canonical extension identity/revision mappings;
- publisher identities;
- artifact/release/provenance references;
- compatibility/support claims with provenance/currentness;
- commercial metadata/entitlements;
- distribution locations;
- deprecation/withdrawal notices.

Artifact/Release owns artifact signatures/SBOM/provenance. Commercial owns entitlement/rating/billing/payment. Governance/Security/Trust qualify enterprise acceptance. Extension Architecture relates those facts to extension admission and lifecycle.

Marketplace/provider-specific moderation, rankings and review scores are provider evidence, not universal trust primitives.

## 15. Publisher, signature, provenance and supply-chain trust

**DECISION C3.25-D13 — publisher identity, artifact signature, provenance, SBOM and extension admission are separate qualified dimensions.**

A valid signature proves only what its trust model and verification evidence establish. It does not prove semantic compatibility, absence of malicious behavior, sufficient permissions, runtime containment or enterprise admission.

Current qualification may depend on trust-anchor/revocation state, provenance producer, build materials, artifact digest, SBOM, vulnerability/security evidence and policy applicability. Trust rotation or artifact withdrawal can invalidate current admission while historical evidence remains replayable.

Brownfield unsigned/manual extensions are not silently rejected or promoted by architecture. They enter as discovered evidence with explicit trust/provenance gaps and may remain `INCONCLUSIVE/BLOCKED` until governed disposition.

## 16. Data, configuration and secret ownership

**DECISION C3.25-D14 — extension-owned or extension-associated state must have explicit semantic owner, lifecycle, export/migration and deletion/retention behavior; uninstall cannot silently orphan or destroy state.**

For each state surface the target model identifies:

- canonical data/config/secret owner;
- source of truth;
- revision/currentness;
- tenant/Station/site scope;
- retention/legal-hold/privacy constraints;
- migration/export/import semantics;
- deactivation behavior;
- uninstall disposition;
- residual copies/caches;
- rollback compatibility.

`secret reference != secret value`; extensions receive only bounded references/materialization permitted by the current grant and execution context. Configuration defaults do not convert `ABSENT`, `null`, explicit default and delete into the same semantic state.

## 17. Provider-backed realization and portability

**DECISION C3.25-D15 — extension realization may be local, remote or hybrid, while canonical extension identity and host semantics survive provider substitution.**

Provider/Binding owns provider discovery/support/admission/binding/cutover. Extension Architecture declares extension requirements and consumes support vectors. Matching provider feature names do not imply semantic equivalence.

Provider substitution/coexistence requires requalification of:

- extension requirements/support vector;
- authority scopes;
- trust/credentials;
- API/data/event semantics;
- latency/capacity/offline behavior;
- external-effect reconciliation;
- state migration;
- observability and residual cohorts.

A provider ACK cannot prove extension-level business effect. Remote ambiguous mutation remains `UNKNOWN` until reconciled.

## 18. Evolution, coexistence, rollback and residual cohorts

**DECISION C3.25-D16 — extension update/revocation closure is cohort-aware and depends on effective convergence, not control-plane intent.**

Lifecycle C3.24 supplies reusable revision/coexistence/cutover/rollback semantics. Extension-specific residual cohorts may include:

- running extension processes/isolates;
- in-flight workflows/hooks;
- sessions or delegated grants;
- browser/client bundles;
- workers/jobs/schedulers;
- subscriptions/callbacks/webhooks;
- cached modules;
- credentials/tokens/certificates;
- provider bindings/remote jobs;
- extension-created data/config state;
- offline Station/site copies.

Each cohort records revision, locality, effective authority, age/currentness, remaining effect capability, drainage mechanism and evidence. Disable/revoke/uninstall cannot close while an unaccepted residual cohort can still produce authoritative effects.

Rollback eligibility is current and depends on artifact, host/API/schema/config/data/trust/authority/provider compatibility plus residual-effect state. Retaining an old package is not proof of rollback eligibility.

## 19. Offline, self-hosted, Station and Fleet semantics

**DECISION C3.25-D17 — extension distribution/admission can operate in self-hosted or disconnected contexts only with explicit retained closure and authority/currentness horizons.**

A Station may retain an admitted revision, required trust material, manifests, artifacts, policies, configuration and dependency closure for bounded autonomous operation. It must degrade or fail closed when required evidence/authority exceeds its qualified horizon.

Fleet views are qualified aggregates. `Fleet says disabled` does not prove every Station has drained an extension. Reconnect reconciliation compares immutable revisions, admission/grant state, effective realizations and residual cohorts rather than applying last-writer-wins.

Marketplace unavailability must not make a previously qualified autonomous runtime dependent on Builder/marketplace availability unless that dependency is explicitly declared.

## 20. Observability, incident response and kill-switch boundaries

**DECISION C3.25-D18 — extension operability exposes current evidence without making telemetry or a kill-switch a second authority system.**

Operational evidence should identify extension revision, realization, tenant/Station/site, host/runtime/provider revision, authority profile, effect identity and currentness where relevant. Useful dimensions include lifecycle state, admission staleness, error/rate/latency, resource budget, queue/backlog age, dependency health, denied operations, crash/restart loops, residual cohort age and reconciliation backlog.

A kill-switch is an authorized lifecycle/security action with scope, revision, expiration/owner and effect evidence. `kill-switch requested != all extension effects stopped`; residual cohorts and external effects still require reconciliation/drainage.

Incident tooling may quarantine/suspend according to pre-authorized policy, but incident severity or AI diagnosis cannot invent revocation authority.

## 21. Commercial, governance, privacy and FinOps relations

Commercial entitlement, marketplace purchase and billing are separate from security/authorization. An extension can be commercially entitled but technically inadmissible or unauthorized; it can also be technically admissible but commercially unavailable.

Governance/Privacy constraints can affect extension admission, data use, region/provider choice, logging, retention, export and residual copies. Evidence must preserve provenance/currentness without leaking sensitive data or secrets.

FinOps may consume extension-attributed usage/cost evidence where qualified, including shared-resource allocation policy. Cost optimization cannot silently weaken isolation, trust, recovery, evidence or authority requirements.

## 22. Legacy Mirroring / Brownfield Assimilation

**DECISION C3.25-D19 — brownfield plugin/module ecosystems enter through discovery and mapping, not canonical adoption by observation.**

Sources may include package manifests, runtime registrations, source trees, plugin folders, admin consoles, database tables, scripts, spreadsheets, tickets, documentation, logs and operator interviews.

Discovered items are classified as `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope` or `Deferred` with provenance/currentness. Observed load order, implicit privileges, manual install steps, shadow configuration and emergency disable procedures are evidence of actual behavior, not proof of intended or approved canonical semantics.

Canonical adoption requires explicit mapping of identity, owner, dependencies, authority, data/config, lifecycle, compatibility, trust and residual behavior. Conflicting stakeholders or sources produce a recorded conflict with owners/evidence/decision route; the system never silently chooses one answer.

## 23. Elicitation Knowledge Base lens for extensions

**DECISION C3.25-D20 — Extension / Plugin / Marketplace Architecture has a capability-specific elicitation lens built from universal questions plus adaptive extension-specific follow-ups.**

Candidate question classes include Universal, Capability-specific, Actor/Identity, Authority/Permission, Data, Workflow/Process, Integration/Provider, Mirroring/Legacy, Security, Privacy/Compliance, Audit/Provenance, Failure/Recovery, Offline/Connectivity, Performance/Capacity, Observability, Versioning/Change, Commercial/Metering, Lifecycle and Negative-space.

Representative adaptive paths:

- **What does this extension add?** -> which canonical capability owns that semantic contribution? -> extension point/revision? -> artifact/provider realization? -> source of truth?
- **Who may install it?** -> who may admit it? -> who may grant each requested capability? -> tenant/Station/site scope? -> temporary/break-glass? -> revoke/deprovision? -> audit?
- **What permissions does it request?** -> operations/resources? -> all contexts or only lifecycle states? -> sensitive data/secrets? -> external effects? -> re-consent on update?
- **What happens on disable/uninstall?** -> running work? -> callbacks/subscriptions? -> sessions/tokens? -> data/config? -> provider jobs? -> residual cohorts? -> reconciliation proof?
- **How is compatibility known?** -> host/API/schema/runtime/provider revisions? -> direction? -> evidence/currentness? -> partial support? -> `UNKNOWN/INCONCLUSIVE` handling?
- **How is it distributed?** -> marketplace/private registry/local package? -> offline mirror? -> publisher/provenance? -> entitlement? -> trust/admission separation?
- **What fails?** -> host degradation? -> extension isolation? -> partial external effects? -> retry/idempotency? -> emergency disable? -> recovery and current return-to-service proof?

Each candidate question carries `question_id`, purpose, concepts/capabilities discovered, applicable contexts, preconditions, follow-up rules, ambiguity signals, expected evidence, answer types, contradictions to detect, unresolved severity, mandatory/conditional/advisory status, question provenance and downstream artifacts blocked/impacted.

AI may suggest mappings, questions, stories, use cases, scenarios and abstractions; every AI inference remains `InferredCandidate`, never authority. The Master Wizard routes to capability-specific sub-wizards and an `Unresolved Questions Inbox` with severity/owner/context/blocked artifacts.

## 24. Coverage and sufficiency without a false complete score

Extension elicitation/readiness is evaluated by dimensions, each carrying status/evidence/currentness, for example:

- purpose and semantic contribution;
- canonical owner and extension points;
- actors/publisher/administrators;
- requested/granted/effective authority;
- dependencies/conflicts;
- data/config/secrets ownership;
- lifecycle and residual cohorts;
- compatibility/revision vectors;
- provider/marketplace realization;
- security/isolation/resource budgets;
- privacy/governance/audit;
- failure/recovery/reconciliation;
- offline/self-hosted/Fleet behavior;
- scale/capacity/quotas;
- observability/support/incident handling;
- commercial/entitlement/FinOps;
- update/rollback/withdrawal;
- acceptance/product proof.

Allowed dimension states are `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED` with evidence/currentness. There is no single quality percentage that can manufacture completeness.

Sufficiency gates are distinct:

- **sufficient for abstraction** — identity, semantic owners, extension purpose, major attachments/dependencies and unresolved critical unknowns are explicit;
- **sufficient for candidate architecture** — authority, lifecycle, compatibility, trust, state ownership, failure/offline/provider boundaries and major scenarios are represented;
- **sufficient for implementation** — contracts, revisions, grants, migration paths, state/config/data rules, reconciliation/idempotency and acceptance obligations are resolved enough for scoped construction;
- **sufficient for publish/operation** — current admission, authority, trust/provenance, capacity, observability, rollback/recovery, residual cohorts and operational evidence meet owner-defined proof obligations.

Critical-gap detection blocks false completeness when, among others, authority is unknown, extension-point owner is ambiguous, source-of-truth is unclear, sensitive data lacks policy, external effect lacks reconciliation, integration timeout/UNKNOWN is undefined, revoke/deprovision is absent, residual authoritative cohort is unaccounted, rollback is historically assumed, marketplace trust is substituted for enterprise admission, or historical behavior lacks revision semantics.

## 25. Derived stories, use cases, scenarios and traceability

Elicitation may derive:

- **User Stories** for actor intent/value/context, never as sufficient specification alone;
- **Use Cases** with actor/system preconditions, trigger, main flow, alternatives, failure/recovery and postconditions;
- **Scenarios** spanning happy, alternate, failure, boundary, abuse/misuse, recovery, offline, concurrency and historical/version-change cases;
- functional, non-functional, operational, governance and compliance Requirements/Constraints;
- Acceptance Criteria and Product Proof obligations.

Semantic references connect every derived artifact to extension identity/revision, host owner/extension point, actors, authority, data/config/secrets, workflow/integration/provider references, evidence and risks.

Candidate traceability remains:

`Source/Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model -> Extension/Owner Capability/Workflow/Data/etc. -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`.

This chain is revisioned and lineage-preserving; a superseded answer does not erase the historical requirement/proof basis.

## 26. Product proof obligations carried to Planning E

Planning E must later define executable product proofs for at least:

1. canonical extension identity survives registry/provider/marketplace substitution;
2. materially different content cannot overwrite an immutable revision;
3. manifest request does not imply grant;
4. grant does not imply effective reachability;
5. effective reachability never exceeds current grant;
6. marketplace listing does not imply admission/trust/authorization;
7. signature/provenance success does not bypass compatibility/security/policy;
8. host/API/schema/runtime revision mismatch yields explicit non-PASS state;
9. dependency cycles/conflicts are explicit, not silently ordered away;
10. partial provider support remains `PARTIAL/INCONCLUSIVE`;
11. install success does not imply activation/effectiveness;
12. ambiguous activation/deactivation returns `UNKNOWN` and reconciles before unsafe retry;
13. duplicate lifecycle hook delivery does not create duplicate authoritative effect when idempotency is qualified;
14. extension sandbox/resource boundary cannot widen authority under failure/degradation;
15. extension cannot read data/secrets outside explicit scope;
16. update that requests new privilege triggers requalification/re-consent where policy requires;
17. rollback eligibility becomes false when dependent current conditions invalidate it;
18. revoke/disable cannot close while residual authoritative cohorts remain;
19. offline Station cannot exceed retained authority/currentness horizon;
20. Fleet disabled aggregate cannot masquerade as Station-local convergence;
21. extension-owned state has explicit uninstall/retention/migration disposition;
22. provider substitution preserves canonical identity and requalifies semantics/support;
23. Brownfield discovery remains candidate/evidence until governed adoption;
24. contradictory elicitation answers create unresolved conflict instead of silent selection;
25. AI-generated extension mappings remain candidates until authority adopts them;
26. critical elicitation gaps prevent false `complete` state;
27. capability-specific question routing avoids duplicate semantic ownership;
28. story/use-case/scenario generation preserves semantic references and evidence lineage;
29. kill-switch request remains distinct from effective drainage;
30. Physical/Peripheral extension contribution cannot bypass C2 bounded integration/governance plane.

These are proof candidates only. Planning E is not executed here.

## 27. Planning D carry-forward constraints

Planning D must later design incremental coexistence/migration without big-bang replacement, preserving current narrow provider-neutral adapters, versioned contracts and deterministic materializer registration while introducing canonical extension semantics additively.

Migration constraints include:

- do not rename existing provider tuples into canonical ExtensionIds by inference;
- permit free-form/manual/legacy plugin metadata to coexist with structured extension evidence during assimilation;
- map provider/registry/listing identities through typed realization references;
- introduce requested/granted/effective authority without assuming current registrations were historically authorized extensions;
- retain existing generated-runtime autonomy;
- support mixed cohorts where only some extension types have structured manifests/admission evidence;
- preserve old runtime/provider cohorts until explicit drainage;
- make lifecycle/admission/evidence currentness additive and replayable;
- avoid a flag-day marketplace or package-manager dependency;
- providerize external registry/marketplace/runtime mechanics;
- route domain semantics to existing owners instead of migrating them into extension records.

Planning D is not executed by this decision.

## 28. Alternatives considered

### A. Static package/plugin registry as the architecture
Rejected. It collapses registration, identity, compatibility, authority and lifecycle and cannot safely express provider substitution, residual cohorts or evidence currentness.

### B. Fully provider-native marketplace/plugin model
Rejected. It creates vendor lock-in and makes provider IDs/features/permissions canonical semantics.

### C. Fully dynamic unrestricted plugin runtime
Rejected. It cannot provide bounded authority, semantic ownership, containment evidence, revision compatibility or production-readiness proofs.

### D. Deterministic hardcoded extension schemas per capability
Rejected as universal architecture. Capability-specific schemas/lenses are valuable, but hardcoding all extension semantics duplicates ownership and blocks extensibility.

### E. Hybrid knowledge/semantic graph + typed manifests + qualified admission + providerized realization
**Chosen.** It preserves portability, auditability, adaptive elicitation, deterministic authority boundaries, owner routing, brownfield assimilation and provider/runtime flexibility without turning the extension layer into a semantic god-object.

## 29. Architecture boundaries and non-goals

Extension / Plugin / Marketplace Architecture is **not**:

- a universal package manager or build system;
- an artifact registry or provenance owner;
- a generic authorization/policy engine;
- a replacement for Security/Trust/Governance;
- a deployment orchestrator/runtime scheduler;
- a provider broker;
- a marketplace billing engine;
- a universal API-contract/schema owner;
- a domain semantic owner for everything implemented by extensions;
- a generic workflow engine or physical control plane;
- an AI-autonomous installer/approver.

It must not normalize `installed`, `admitted`, `authorized`, `effective`, `healthy`, `trusted`, `entitled`, `compatible` or `converged` into one state.

## 30. Architecture-level unresolved questions

No architecture-level HIGH/CRITICAL contradiction was discovered that requires reopening Research, altering the 28-capability taxonomy, creating a ConflictInstance or entering remediation.

Planning D still must choose concrete migration sequencing and coexistence mechanisms. Planning E still must choose executable proofs. Architecture Reconciliation later must verify this target against all Planning C capability decisions and reject any ownership collision or hidden second source of truth.

## 31. Planning C decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

C3.25 establishes a provider-neutral, revision-qualified Extension Governance & Realization Plane with canonical extension identity/revision, typed manifests/extension points, explicit semantic-owner routing, dependency/conflict graph, multidimensional admission, requested/granted/effective authority separation, governed lifecycle, containment/resource boundaries, marketplace discovery separated from trust/admission, provider-backed realization, cohort-aware evolution/revocation, offline/Station/Fleet reconciliation, Brownfield assimilation, Elicitation Knowledge Base lens, multidimensional sufficiency and traceable Product Proof obligations.

No product code, Work Package, executive TASK, Construction, remediation, Planning D/E execution, 29th capability or generic direct physical-actuation capability was created.