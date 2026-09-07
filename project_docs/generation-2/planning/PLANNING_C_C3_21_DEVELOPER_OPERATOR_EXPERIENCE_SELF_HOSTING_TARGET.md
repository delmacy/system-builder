# Generation 2 — Planning C — C3.21 Developer / Operator Experience / Self-hosting Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Developer / Operator Experience / Self-hosting**
Decision: `C3.21`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction or remediation is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, the Planning C entry framework, C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for this capability, C3.17 Secrets / Configuration / Environment Portability, C3.18 Build / Dependency Graph / Reproducibility, C3.19 Artifact / Release / SBOM / Provenance, C3.20 Deployment / Environment / Runtime, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Constitutional distinctions remain mandatory:

- `ergonomics != authority`;
- `operator workflow state != underlying capability truth != provider acknowledgement != consumer/runtime-effective truth`;
- `command accepted != effect != convergence != validated outcome`;
- `diagnostic signal != canonical truth`;
- `one-click != hidden semantic coupling`;
- `self-hosted != exempt from currentness, trust, security, privacy, governance or provenance obligations`;
- `local administrator access != enterprise authority`;
- `Fleet aggregate != Station/local state`;
- `support bundle complete-looking != evidence complete/current`;
- `AI/operator-assistant proposal != maintenance authority`;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.

## 2. Current-state anchor and disposition

Generation 1 already contains a disciplined bounded operator seam: local-first repository bootstrap, deterministic engineering/operator commands, a versioned `FactoryOperatorBootstrap` contract, fail-closed prerequisite validation, canonical identity/provenance references in operator progress, bounded actionable failure classes and generated-runtime autonomy from Builder/Observe availability in covered proofs.

Planning B correctly established that this baseline does **not** yet prove generalized installation profiles, support-bundle semantics, mature self-hosting topologies, air-gap lifecycle, typed ambiguous administrative effects, currentness-aware diagnostics, complete authority hierarchy or recovery qualification.

C3.21 therefore adopts **KEEP + HARDEN + GENERALIZE + INTEGRATE + PROVIDERIZE MECHANICS**. It preserves the existing operator/bootstrap seam and promotes its truth-preserving discipline into a portable Operator & Developer Experience Plane without creating a second runtime, provider, security, governance, configuration or recovery truth store.

## 3. Target decision

**DECISION C3.21-D1 — establish a revision-qualified Operator & Developer Experience Plane that owns guided bootstrap/install/upgrade/diagnostic/repair/support workflows, operational-profile ergonomics, self-hosted closure presentation, safe administrative affordances and evidence/effect presentation, while every underlying fact, authority decision and external effect remains owned by its canonical capability.**

The capability owns seven linked experience planes:

1. **Operational Profile Experience Plane** — profile selection, prerequisites, burden, topology and support visibility.
2. **Guided Workflow Plane** — revisioned bootstrap/install/upgrade/maintenance/repair/support runbooks.
3. **Administrative Safety Plane** — scope display, authority preflight, preview/dry-run qualification, maintenance mode and break-glass UX.
4. **Diagnostics & Evidence Plane** — evidence composition, provenance/currentness/coverage presentation and support-bundle packaging.
5. **Effect & Reconciliation Plane** — operator-visible `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`, convergence and reconcile-before-retry guidance.
6. **Self-hosted / Local Closure Plane** — human-facing retained-closure contract for local, disconnected and air-gapped operation.
7. **Capability Discovery & Assistance Plane** — provider/capability support visibility, mapping guidance and AI-assisted proposals without authority amplification.

## 4. Canonical identities and revision vectors

The target introduces or qualifies identities such as:

- `OperationalProfileId` and immutable `OperationalProfileRevisionId`;
- `OperatorWorkflowId` and `OperatorWorkflowRevisionId`;
- `OperatorJourneyId` / `OperatorStepOccurrenceId`;
- `MaintenanceWindowId` / `MaintenanceWindowRevisionId`;
- `MaintenanceModeId` / `MaintenanceModeOccurrenceId`;
- `AdministrativeActionIntentId` and `AdministrativeActionAttemptId`;
- `BreakGlassGrantRef` / `BreakGlassUseOccurrenceId`;
- `DiagnosticSessionId` and `DiagnosticEvidenceSetId`;
- `SupportBundleId` / `SupportBundleRevisionId`;
- `RepairPlanId` / `RepairPlanRevisionId`;
- `SelfHostedClosureId` / `SelfHostedClosureRevisionId`;
- `LocalSupportClosureId`;
- `OperatorReconciliationId`.

The revision vector may pin operator workflow revision, target capability revisions, release/artifact revision, runtime generation, config/secret/trust/security/policy revisions, provider-binding/support-vector revision, schema/data compatibility, site/Station scope, evidence horizon and maintenance/break-glass qualification.

Provider CLI names, shell commands, process IDs, Kubernetes resource names, VM IDs, cloud console operations or root sessions are realizations or evidence, not canonical operator workflow identity.

## 5. Operational profiles: simple local through mature distributed

**DECISION C3.21-D2 — self-hosting is a portable operational-profile family over the same canonical semantics, not a weaker semantic universe.**

Profiles may include, where applicable:

- developer-local;
- simple single-host self-hosted;
- durable single-site;
- multi-node/distributed;
- managed-provider-backed;
- hybrid;
- disconnected/air-gapped;
- edge/Station-local with bounded retained closure.

Each profile exposes an explicit support/dependency vector: required artifacts, runtime, persistence, configuration/secrets, trust, identity, networking, provider bindings, observability, backup/recovery, upgrade path, capacity expectations, offline horizon, authority model and operational burden.

A simpler topology may reduce mechanics, but cannot silently weaken semantic guarantees. A richer topology may add redundancy/provider features, but cannot strengthen guarantees beyond qualified evidence.

`one machine != simple semantics` and `distributed != automatically resilient`.

## 6. Bootstrap, install and first operational closure

**DECISION C3.21-D3 — bootstrap/install is a revisioned operator journey whose visible completion is derived from qualified owner results, never from installer exit status alone.**

Minimum lineage:

`profile selected -> prerequisites evaluated -> authority/policy qualified -> required artifact/config/trust/provider/runtime dependencies qualified -> actuation attempted -> effects reconciled -> runtime observed -> readiness/effective service qualified -> operational closure recorded -> operator completion disposition`.

The workflow may collect inputs and invoke owner capabilities, but it does not own their truth. Missing or stale prerequisites remain `PARTIAL`, `INCONCLUSIVE` or blocked rather than being converted into convenience defaults.

Bootstrap must explicitly surface circular dependencies where the control plane is not yet available. Retained local bootstrap material and trust roots must be qualified by their owners.

## 7. Developer experience without semantic shortcuts

Developer-facing tooling may offer project bootstrap, local execution, schema inspection, build diagnostics, capability discovery, generated client/runtime inspection, fixture/test orchestration and provider adapters. Convenience surfaces must keep canonical identity, revision and evidence visible enough to avoid hidden coupling.

Generated code, local emulators and test doubles are realizations. Passing a local test or mock does not prove provider/runtime semantic equivalence. Developer workflows should surface support vectors and unresolved semantics when moving from local to target environments.

`works locally != production-qualified`.

## 8. Diagnostics, triage and support evidence

**DECISION C3.21-D4 — diagnostics compose qualified evidence but never become a new source of operational truth.**

A diagnostic evidence item carries, where applicable:

- evidence type and producing capability;
- source and collection method;
- subject/object identity;
- source revision/runtime generation;
- occurrence/observation/collection time;
- effective period/currentness horizon;
- coverage/population;
- confidence/status;
- privacy/redaction/minimization state;
- supporting artifact or provider reference;
- supersession/correction lineage.

Diagnostic sessions may derive hypotheses, but hypotheses remain `InferredCandidate`/`Claim`, not `Fact`. Contradictory evidence is preserved and routed to the owner; the UI does not silently choose one source.

Absence of telemetry is not proof of absence of failure.

## 9. Support bundles and partial completeness

A support bundle is a portable evidence package, not a snapshot of canonical truth. It records requested scope, collected scope, collection failures, redactions, omitted classes, time horizon and producing revisions.

Bundle disposition supports at least:

- `COMPLETE_FOR_REQUESTED_SCOPE`;
- `PARTIAL`;
- `INCONCLUSIVE`;
- `BLOCKED`.

Privacy, authorization, secrets, retention, legal-hold and residency constraints may prevent collection/export. Those constraints are visible as reasons, not silently represented as “no issue found”.

## 10. Administrative actions, effect semantics and safe retry

**DECISION C3.21-D5 — every mutating operator action is an authority-qualified intent whose command/tool result is separate from provider effect, system convergence and validated business/operational outcome.**

Portable action progression:

`proposed -> scope resolved -> authority/policy qualified -> preconditions qualified -> attempt -> provider/tool outcome -> EffectDisposition -> observed convergence -> postcondition proof`.

Effect disposition is:

- `APPLIED`;
- `NOT_APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

For `UNKNOWN`, the default is `reconcile-before-retry` unless operation-level idempotency is separately qualified. A CLI return code, HTTP 2xx, provider job acceptance or “success” toast cannot collapse this progression.

Operator workflow state may say “waiting for reconciliation”; it cannot rewrite the underlying effect.

## 11. Preview, dry-run and impact explanation

Preview/dry-run is qualified by the underlying provider/capability. A preview may report:

- resolved target scope;
- intended revisions/transitions;
- authority/policy checks;
- known dependencies;
- projected provider operations;
- expected external effects;
- unresolved/unknown effects;
- affected populations/cohorts;
- rollback/recovery assumptions;
- maintenance-window constraints.

`dry-run available != complete prediction`. Provider-native dry-run cannot prove downstream business effects, asynchronous callbacks, queue propagation, hidden external dependencies or physical outcomes unless the relevant owners provide that proof.

## 12. Maintenance modes and maintenance windows

**DECISION C3.21-D6 — maintenance mode is a revisioned, scoped operational state transition with explicit authority, start/end semantics, allowed actions, traffic/workflow implications, expiry and evidence; it is not a global bypass flag.**

A maintenance mode may constrain writes, pause selected workflows, drain traffic, block new sessions, disable integrations or expose read-only access, but each behavior is explicit and owned by the relevant capability.

Maintenance windows carry scope, effective interval, owner, approval/authority references, expected work, capacity/availability impact, entry criteria, exit criteria and abort/escalation route.

An expired window does not automatically preserve exceptional authority.

## 13. Break-glass crossings

Break-glass is a governed exceptional authority crossing, not a UI privilege. The operator experience may initiate/request/use a break-glass path only when Authorization/Governance/Security owners qualify it.

Required presentation includes:

- reason and incident/emergency context;
- scope and affected resources;
- granting authority;
- start/expiry;
- additional authentication/trust requirements where applicable;
- permitted actions;
- evidence/audit obligations;
- post-use reconciliation/review;
- residual credentials/sessions/grants requiring revocation or drainage.

`root access != break-glass authority` and `break-glass granted != unlimited authority`.

## 14. Upgrade, maintenance and repair workflows

Upgrade UX composes release eligibility, deployment actuation, config/secret adoption, schema/data compatibility, trust/security/policy currentness, provider support and recovery prerequisites. The workflow owns sequencing/presentation, not those truths.

Repair UX distinguishes diagnostic hypothesis, proposed repair, authorized action, effect disposition, convergence and validation. “Fix all” cannot bypass owner-specific authority or collapse independent repairs.

Rollback UX must distinguish:

- release rollback eligibility;
- runtime rollback actuation;
- data restore/recovery;
- configuration/trust restoration;
- provider/resource rollback;
- validated service/business recovery.

## 15. Self-hosted operational closure and control-plane independence

**DECISION C3.21-D7 — a self-hosted profile is operable only through an explicit `SelfHostedClosure` that references the minimum retained dependencies, authority/currentness horizons and recovery material needed for the declared operating condition.**

Closure may include:

- release/artifact/SBOM/provenance material;
- runtime and persistence dependencies;
- configuration/secret references and permitted cached generations;
- trust anchors/certificates and rotation horizon;
- local identity/authentication requirements;
- authorization/policy snapshot and expiry/currentness rules;
- schema/data state and storage dependencies;
- observability/diagnostic collection;
- backup/recovery assets and runbooks;
- provider/runtime adapter dependencies;
- support/maintenance tools;
- upgrade/import packages;
- reconciliation obligations after reconnection.

Control-plane independence means the generated/runtime system can continue within a qualified retained closure; it does not mean indefinite authority, infinite trust validity or absence of external dependencies.

## 16. Disconnected and air-gapped operation

Offline/local operation records what is retained, what becomes stale, what can still be refreshed locally, what mutations are queued and what actions must fail closed or degrade when horizons expire.

Reconnection sequence is explicit:

`re-establish trust -> compare revision/currentness vectors -> discover local/enterprise deltas -> classify conflicts/UNKNOWN effects -> reconcile -> requalify authority/provider/runtime/support -> publish current state`.

Stale local evidence cannot become enterprise truth simply because connectivity returns.

## 17. Provider-neutral tooling and provider-specific diagnostics

Operator UX defines portable intents such as install, inspect, reconcile, drain, rotate, upgrade, backup request, restore request, support export and provider migration. Provider adapters may expose richer diagnostics and mechanics, but provider-specific status names do not become canonical truth.

Provider/Binding owns capability discovery and support-vector qualification. C3.21 consumes that information to show:

- supported;
- supported-with-constraints;
- partially supported;
- unsupported;
- unknown/stale support;
- provider-specific extension.

A provider diagnostic may be displayed verbatim as evidence while remaining non-canonical.

## 18. Capability discovery and support visibility

Operators and developers need a queryable view of what a profile/provider/site can actually do under current revisions. This view references Provider/Binding support vectors, Authorization scopes, policy constraints, runtime topology, offline/currentness horizons and required proof obligations.

The UX must distinguish “capability exists”, “capability is bound”, “capability is authorized”, “capability is operationally ready” and “capability is currently effective”.

## 19. Fleet, Station and local authority boundaries

Fleet may aggregate profile, runtime, diagnostic, maintenance, support and closure status across Stations/sites. Every aggregate preserves coverage and currentness. Fleet cannot infer a local Station state that was not observed within an applicable horizon.

Central operator requests toward an offline/partitioned Station can be `UNKNOWN` or pending; UI may not mark them applied before local evidence.

A local administrator may possess OS/provider privileges but enterprise-level operator actions still require current semantic authority. Local emergency procedures are captured as governed Brownfield evidence until explicitly adopted.

## 20. Queueing, backlog, capacity and maintenance evidence

Operator/developer work itself forms queue networks: bootstrap operations, deployments, repair actions, reconciliation, support-bundle collection, incident triage, backup/restore, upgrade waves and offline resynchronization.

Evidence may include:

- action arrival rate and service rate with units;
- queue depth and oldest age;
- `UNKNOWN` action backlog and age;
- unresolved diagnostic hypotheses;
- support-bundle collection duration/failure rate;
- maintenance-window utilization and overrun;
- upgrade/repair stage dwell time;
- provider/API quota pressure;
- retry amplification;
- residual cohort/session/grant count and age;
- local/offline resynchronization backlog;
- operator concurrency and change-collision indicators.

A “green dashboard” is not capacity proof. Currentness, population and tail behavior remain explicit.

## 21. Brownfield / Legacy Mirroring assimilation

Brownfield discovery may observe shell scripts, SSH procedures, cloud-console clicks, cron jobs, spreadsheets, wiki runbooks, chat approvals, verbal maintenance instructions, shared administrator accounts, personal notebooks, rescue USB media, direct database fixes, manual backups, vendor support procedures and undocumented emergency sequences.

These are evidence/candidates, not canonical operator policy.

Assimilation sequence:

`discover -> identify actors/actions/targets -> capture observed procedure and evidence -> identify implicit authority/dependencies -> detect contradictions/negative space -> classify Fact/Claim/Assumption/InferredCandidate -> map to canonical capability owners -> explicit adopt/defer/out-of-scope decision -> establish lineage`.

Mandatory distinction:

`observed administration != intended procedure != approved canonical operation`.

## 22. Elicitation Lens

C3.21 consumes C1's versioned Elicitation Knowledge Base and defines a capability-specific lens. Adaptive questions include:

- Who installs, upgrades, repairs, diagnoses and supports each environment/site?
- What authority is required for each administrative action, and how is it revoked/deprovisioned?
- What operator actions have external or irreversible effects?
- Which actions can return ambiguous outcomes, and how are they reconciled?
- Which topologies/profiles are actually required, and what burden is acceptable?
- What must remain operational when the Builder/control plane/network/provider is unavailable?
- What currentness/trust/authorization horizons bound disconnected operation?
- Which diagnostics are authoritative evidence versus hints?
- What sensitive data can diagnostics/support bundles expose?
- What maintenance windows, freezes, approvals and break-glass routes exist?
- What scripts/manual procedures/shadow tools are used today?
- What is the backup/restore/recovery procedure and what evidence proves recovery?
- What provider-specific tools are indispensable, and what happens during substitution?
- Which local administrators exist outside the canonical enterprise model?
- What rare high-impact emergency cases are absent from standard runbooks?

Follow-ups route answers to the semantic owner rather than duplicating ownership. Example: an answer about “restart after secret rotation” creates/links evidence to Secrets/Configuration and Deployment while C3.21 owns only the operator workflow relationship.

AI may suggest questions, mappings, runbooks, commands, diagnostic hypotheses, stories, use cases and scenarios; every inference remains a candidate until validated by evidence/authority.

## 23. Elicitation coverage and sufficiency

Coverage uses per-dimension states `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`, each with evidence/currentness.

For this capability, dimensions include purpose, operator classes, authority, profiles/topologies, prerequisites, runtime/provider dependencies, install/bootstrap, upgrade, diagnostics, repair, support, backup/recovery UX, maintenance, break-glass, offline/local closure, external effects, evidence/privacy, capacity/backlog, versioning, acceptance/proof and Brownfield/manual procedures.

No single quality/completeness score is authorized.

Sufficiency is staged:

- **sufficient for abstraction** — actors, main workflows, target profiles and key truth boundaries are known;
- **sufficient for candidate architecture** — dependencies, authority, evidence/effect semantics, offline horizons and failure/recovery routes are resolved enough to choose a design;
- **sufficient for implementation** — workflow revisions, action/evidence contracts, provider support, sensitive-data policy and critical ambiguous-effect handling are resolved;
- **sufficient for publish/operation** — runtime/profile-specific proofs, runbooks, current authority, support/recovery paths and no critical unresolved gap for the declared operating context.

Critical gaps include unknown administrative authority, provider mutation without `UNKNOWN` semantics, self-hosted profile without retained closure, support export without privacy policy, break-glass without expiry/audit, diagnostics without provenance/currentness, restore UX without recovery proof, local admin without enterprise mapping, offline mode without horizon, and one-click action hiding multiple independently failing effects.

## 24. Derived artifacts and traceability

C3.21 requires elicitation-derived artifacts where applicable:

- User Stories for operator/developer intent and value;
- Use Cases with preconditions, triggers, main/alternate/failure/recovery flows and postconditions;
- Scenarios covering happy path, failure, boundary, abuse/misuse, recovery, offline, concurrency and historical/version-change behavior;
- functional, non-functional, operational, governance and compliance requirements/constraints;
- Acceptance Criteria and Product Proof obligations;
- semantic references to actors, authority, data, workflow, provider, evidence, risks, config/trust/runtime and affected capabilities.

Candidate traceability:

`Source/Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> Story/Use Case/Scenario -> Operator Workflow Semantic Model -> owning Capability/Runtime/Provider/etc. -> Acceptance Criterion -> Test/Product Proof -> Runtime/Operator Evidence`.

## 25. Production Readiness Coverage

Production readiness remains multidimensional and capability-scoped. Candidate dimensions include:

- profile/install readiness;
- authority/admin readiness;
- artifact/config/secret/trust readiness;
- runtime/provider readiness;
- diagnostic/evidence readiness;
- upgrade/maintenance readiness;
- support readiness;
- backup/recovery runbook readiness;
- offline/local closure readiness;
- capacity/backlog readiness;
- privacy/governance readiness;
- provider substitution readiness;
- Brownfield/manual-operation containment;
- proof/acceptance readiness.

No aggregate “100% ready” state may hide a `CONFLICTED`, `BLOCKED` or unresolved critical dimension.

## 26. Physical / Peripheral boundary

Operator tooling for gateways, device registries, peripheral providers, edge agents and physical integration stays inside C2's bounded integration/governance plane. C3.21 may expose discovery, provisioning requests, diagnostics, event subscriptions, configuration, health, reconciliation and provider-specific evidence where authorized.

It does **not** create generic direct physical actuation authority. A UI button, CLI command, AI assistant or maintenance mode cannot infer a portable `ACTUATE` capability absent an explicitly qualified provider/domain-specific semantic owner and authority path.

## 27. Planning D carry-forward

Planning D must migrate without big-bang and preserve coexistence:

1. retain existing root/local bootstrap and `FactoryOperatorBootstrap` contracts;
2. introduce revisioned operator workflow/profile identities around existing commands;
3. coexist CLI-first flows with future UI/Wizard/AI-assisted surfaces;
4. add evidence/currentness/effect disposition incrementally without rewriting owner truth;
5. represent existing manual docs/runbooks as free-form evidence alongside structured workflow records;
6. adopt self-hosted profiles progressively from proven local path outward;
7. providerize diagnostics/install mechanics behind support vectors;
8. preserve provider/runtime IDs as realization identities;
9. introduce support-bundle/privacy metadata incrementally;
10. migrate local/offline and break-glass procedures only after authority/currentness semantics are explicit.

Planning D remains blocked until Planning C closes 28/28.

## 28. Planning E proof candidates

Planning E should define product proofs including at least:

1. bootstrap completion cannot be emitted before owner-qualified readiness;
2. installer/CLI success does not imply convergence;
3. mutating action can surface `UNKNOWN` and blocks blind retry;
4. reconciliation resolves an already-applied ambiguous effect without duplication;
5. partial support bundle remains visibly partial;
6. redaction/minimization is represented without pretending omitted evidence is absent;
7. diagnostic evidence retains source/revision/currentness;
8. contradictory diagnostics remain unresolved rather than silently selected;
9. simple local profile preserves superior security/governance constraints;
10. self-hosted operation survives control-plane loss only within declared retained closure;
11. expired offline horizon degrades/fails closed as declared;
12. reconnection does not promote stale local state without reconciliation;
13. Fleet aggregate cannot prove unreachable Station state;
14. local admin access does not bypass enterprise authority;
15. maintenance mode is scoped, expiring and non-authority-amplifying;
16. break-glass use is bounded, expiring, auditable and reconciled;
17. upgrade UX separates release eligibility, runtime actuation, schema/data and recovery truth;
18. rollback UX does not equate runtime rollback with data recovery;
19. provider-specific diagnostics remain evidence rather than canonical status;
20. provider substitution surfaces unsupported/partial semantics;
21. one-click workflow preserves independently failing subeffects;
22. AI proposal cannot execute or strengthen maintenance authority;
23. Brownfield shell/manual procedure is imported as evidence/candidate, not canonical truth;
24. support/capability discovery distinguishes existence, binding, authority, readiness and effectiveness;
25. queue/backlog evidence preserves units, populations and currentness;
26. Physical/Peripheral tooling does not infer generic direct actuation.

## 29. Architecture reconciliation notes

The target intentionally rejects four extremes:

- **CLI-only authority** — commands are useful realizations, not semantic ownership;
- **monolithic deterministic wizard** — cannot model every capability/provider/failure without hidden coupling;
- **fully conversational AI operator** — adaptive but unauditable as sole authority and unsafe for ambiguous effects;
- **provider-console mirroring** — preserves provider coupling and collapses canonical semantics.

The favored architecture is hybrid and auditable: deterministic semantic contracts and owner-qualified claims/effects, capability-specific workflow schemas and lenses, provider adapters for mechanics, Wizard/CLI/UI surfaces for validation and AI for candidate generation/explanation only.

## 30. Capability boundary summary

- **UCA/C0** owns typed identity, revision, evidence/currentness, support vectors and effect dispositions.
- **C1 Elicitation** owns EKB/questioning/coverage/provenance semantics; C3.21 supplies its lens.
- **Authorization/Policy** owns administrative authority; C3.21 presents/invokes it.
- **Deployment/Runtime** owns runtime desired/observed/effective state and actuation.
- **Provider/Binding** owns provider discovery/support/admission/binding.
- **Observability** owns telemetry/evidence/incident semantics.
- **Security/Resilience** owns posture, containment and recovery qualification.
- **Secrets/Configuration** owns config/secret truth and adoption/currentness.
- **Build/Artifact/Release** own build closure and release/provenance truth.
- **Data/Schema** owns data/schema compatibility/migration truth.
- **Lifecycle** owns revision/coexistence/migration/withdrawal primitives.
- **Governance/Privacy** constrain operator evidence/actions.
- **C2 Physical/Peripheral** bounds physical integration/governance semantics.

C3.21 owns the portable human/operator/developer workflow semantics that coordinate these owners without absorbing them.

## 31. Decision result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.** Developer / Operator Experience / Self-hosting is a bounded portable experience plane over canonical capability truth. Existing Generation 1 bootstrap discipline is retained and generalized. Self-hosting becomes an explicit operational-profile family with retained closure and bounded currentness; operator actions preserve authority/effect/convergence separation; diagnostics remain evidence; support bundles preserve partiality/provenance/privacy; maintenance/break-glass are scoped governance crossings; local/Fleet boundaries remain explicit; AI stays proposal-only; and Physical/Peripheral tooling remains inside C2's bounded integration/governance plane.

No new research finding, ConflictPattern, ConflictInstance, remediation, Work Package, executive TASK, Construction or product code is created by this decision.
