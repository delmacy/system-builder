# Generation 2 — Planning C C3.6: Integration & Automation Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: `Integration & Automation`  
Decision scope: canonical target architecture only. No implementation, Planning D/E execution, WBS, Work Packages, executive TASKs, Construction or product code.

Entry branch head revalidated before persistence: `cbadec869a250b8764161c02a194e990d234b123`.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `RESEARCH_PIPELINE_STATE.json` — C3.6 is the only authorized next decision;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `PLANNING_C_C1_ELICITATION_SYSTEM_UNDERSTANDING_ARCHITECTURE.md`;
- `PLANNING_C_C2_PHYSICAL_PERIPHERAL_INTEGRATION_BOUNDARY.md`;
- `PLANNING_A_INTEGRATION_AUTOMATION_BOUNDARIES.md`;
- `PLANNING_B_INTEGRATION_AUTOMATION_SB_CURRENT_STATE.md`;
- inherited adversarial inventory: 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings, with zero HIGH/CRITICAL lacking owner/proof/detection route.

External conceptual precedents used to challenge the target semantics, not as implementation mandates:

- CloudEvents keeps event identity source-qualified and treats event occurrence, event envelope and resulting action as distinct concepts;
- SCIM demonstrates that atomicity can differ by operation scope: PATCH is atomic at the resource operation while bulk processing can have per-operation outcomes;
- the existing research on replay, provider substitution, residual cohorts, queueing/capacity, provenance/currentness, uncertainty and physical/peripheral boundaries remains controlling.

Standing invariants:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `integration receipt != business effect`;
- `event delivery != automation admission != automation completion`;
- `attempted != accepted != applied/effective != converged != validated`;
- `provider credential/scope != canonical authority`;
- `retry != safe replay`;
- `observed external behavior != approved canonical semantics`;
- `provider reported state != physical truth`;
- `AI inference/proposal = candidate`, never integration mutation authority.

## 2. Decision summary

Planning C adopts a **provider-neutral, revision-qualified Integration & Automation semantic layer** specialized over C0 execution/effect primitives.

Integration owns the intentional crossing of the System Builder semantic boundary into an external system and the qualified interpretation of the result. It owns trigger/admission semantics, external-operation definitions, connector realization contracts, invocation/attempt/effect lineage, provider receipts, target-specific idempotency/deduplication and reconciliation facts, external provisioning/synchronization semantics, and external-effect evidence.

It does **not** own durable business workflow state, generic message transport, canonical process/application truth, canonical data/schema truth, authorization policy, provider admission/binding lifecycle, secrets ownership, protocol conformance ownership, or generic physical control.

The target model is deliberately not a universal connector DSL. It is a typed semantic contract family that allows domain owners and providers to expose portable operations without flattening provider-specific behavior.

## 3. C3.6-DEC-001 — Canonical identities are separated by semantic role

Integration requires distinct identities for at least:

- `IntegrationDefinitionRef` — stable canonical integration definition identity;
- `IntegrationDefinitionRevisionRef` — immutable revision of that definition;
- `TriggerDefinitionRef` / revision — semantic trigger/admission definition;
- `SubscriptionRealizationRef` — provider/broker realization of a trigger/subscription;
- `ExternalOperationDefinitionRef` / revision — portable external operation contract;
- `AutomationInvocationRef` — admitted occurrence of integration/automation intent;
- `IntegrationAttemptRef` — one concrete attempt to realize the intent;
- `ExternalEffectRef` — semantic identity of the intended external effect, when meaningful;
- `ProviderReceiptRef` — receipt/job/request/ack identity returned by a realization;
- `ExternalResourceRealizationRef` — provider-qualified resource/account/device/job identity;
- `ReconciliationOccurrenceRef` — one readback/reconciliation attempt;
- C0 `ProviderBindingRef`, `AuthorityEnvelope`, `RevisionVector` and evidence references.

Message IDs, webhook IDs, provider request IDs, HTTP request IDs, provider job IDs and resource IDs are realization evidence by default. They do not become canonical integration or business identity through equality of values.

An event identifier identifies the delivered event envelope within its qualified source scope; it does not automatically identify the business occurrence, automation invocation or external effect. Correlation relations must therefore be explicit.

## 4. C3.6-DEC-002 — Portable integration definition/IR is operation-centric and bounded

The canonical target IR includes typed definitions for:

- trigger/admission condition;
- source/subject applicability and correlation contract;
- canonical input/output references and mapping revision;
- external operation semantic kind;
- side-effect class;
- required authority scope;
- required provider capability/support dimensions;
- timeout/deadline/budget semantics;
- idempotency/deduplication characteristics;
- retry/replay/redrive eligibility predicates;
- effect observation/reconciliation method;
- callback/poll/readback semantics where applicable;
- expected evidence/receipt profile;
- failure/partial/unknown taxonomy;
- lifecycle/coexistence constraints;
- tenant/site/resource qualification;
- privacy/security/trust requirements;
- provider-specific extension references.

The IR does not contain arbitrary provider SDK behavior as canonical semantics. Provider-only operations/fields are explicit namespaced extensions with support-vector qualification.

## 5. C3.6-DEC-003 — Trigger delivery, admission and execution are separate states

Integration distinguishes:

1. an external observation/event/message exists;
2. a transport delivers it;
3. trigger applicability is evaluated;
4. an automation invocation is admitted or rejected;
5. one or more attempts occur;
6. an external effect is dispositioned;
7. convergence/postcondition is reconciled and, where required, validated.

Notifications / Events / Messaging owns generic publication/delivery/replay/ordering. Integration owns whether a delivered observation is sufficient to create an admitted integration invocation and what semantic external action follows.

Duplicate transport delivery may map to the same event identity yet still require separate admission/dedup evaluation. No exactly-once transport claim is upgraded into exactly-once external effect.

## 6. C3.6-DEC-004 — Effect state specializes C0 `EffectDisposition`

Potentially mutating external operations preserve at least:

- `NOT_APPLIED`;
- `APPLIED`;
- `PARTIAL`;
- `UNKNOWN`.

Capabilities may also represent `REJECTED`, `INCONCLUSIVE`, `CONVERGED`, `VALIDATED` or domain-specific substates, but those cannot erase the core distinction.

`UNKNOWN` means the external mutation may or may not have occurred. Unless a qualified idempotency/deduplication contract proves repeated application safe, the default is:

`UNKNOWN -> reconcile-before-retry`.

Provider success, HTTP 2xx, queue ACK, webhook receipt or job acceptance proves only the contractually warranted acceptance/receipt fact. It is not automatically `APPLIED`, `CONVERGED` or a business postcondition.

For batch operations, effect disposition is representable per semantic sub-operation/resource. Aggregate batch success cannot hide a partial result population.

## 7. C3.6-DEC-005 — Idempotency and deduplication are operation-, scope- and horizon-qualified

There is no global `idempotent=true` semantic.

An operation may declare:

- semantic idempotency class;
- idempotency/effect key derivation;
- deduplication owner/provider;
- tenant/site/resource scope;
- provider binding/profile revision;
- deduplication horizon/expiry;
- persistence and failover guarantees;
- equivalence predicate for repeated input;
- response semantics for recognized duplicates;
- conditions that invalidate safe reuse.

A previously safe key may become unsafe after provider substitution, mapping revision, credential/resource recreation, horizon expiry or semantic input change. Retry safety is evaluated against the current qualified operation contract and known prior effect disposition.

## 8. C3.6-DEC-006 — Replay/redrive creates new attempt lineage; it never erases ambiguity

Replay/redrive preserves the original invocation/effect identity relationship and creates a new governed attempt with explicit parent/prior-attempt linkage.

Redrive cannot reset history or imply the old attempt was `NOT_APPLIED`. If prior state is `UNKNOWN`, either reconciliation must resolve it first or the operation's qualified duplicate-safety contract must prove the redrive cannot cause an unsafe repeated effect.

Workflow may schedule or orchestrate retry/redrive, but Integration owns the target-specific safety facts used by Workflow.

## 9. C3.6-DEC-007 — Callback, webhook and asynchronous external jobs use explicit correlation contracts

Long-running external operations may realize completion by callback, webhook, polling, event subscription or readback. The target model must preserve:

- canonical invocation/effect identity;
- provider job/request identity;
- callback/subscription realization identity;
- expected source/tenant/site/resource scope;
- correlation key semantics;
- authentication/trust evidence;
- expiry/currentness horizon;
- duplicate/out-of-order behavior;
- terminal/non-terminal provider states;
- reconciliation fallback when callbacks are lost or ambiguous.

A callback received after provider cutover or revision supersession remains historical evidence and must be evaluated against the producing cohort; it cannot mutate the new cohort merely because identifiers collide.

## 10. C3.6-DEC-008 — Provisioning, synchronization and reconciliation are first-class integration operation families

For external users/accounts/resources/grants/configuration, Integration models desired-state intent and provider realization without stealing canonical ownership from Identity, Authorization, Data or the domain owner.

State may include, where applicable:

`REQUESTED -> ACCEPTED/REJECTED -> APPLIED/NOT_APPLIED/PARTIAL/UNKNOWN -> OBSERVED -> RECONCILED`.

Drift is a qualified difference between canonical desired state and an external observation under explicit source-of-truth direction. A drift signal is not automatically a `ConfirmedConflict`; it requires the owner-defined reconciliation policy and evidence.

Deletion/deprovision/revoke requires the same rigor as creation. Provider acknowledgement does not prove sessions, grants, cached tokens, callbacks, shadow resources or downstream copies are drained.

## 11. C3.6-DEC-009 — Source-of-truth and currentness are declared per semantic concern

Integration rejects a single omniscient external truth store.

Each integration concern declares the authoritative direction and evidence semantics. Examples:

- canonical user identity remains Identity-owned;
- canonical permission remains Authorization-owned;
- provider-local resource existence/config may be provider-owned;
- replicated business data may remain Data/domain-owned despite synchronization;
- external effect truth may require provider readback or independent evidence;
- physical truth may remain `UNKNOWN` under the C2 boundary.

Observations carry provider/binding/profile revision, source, observation time, effective time where applicable, currentness/freshness, population completeness and supersession lineage.

Absence in a partial/paginated/stale response is not deletion proof. `PARTIAL` and `UNKNOWN` remain first-class.

## 12. C3.6-DEC-010 — Provider/Binding owns admission; Integration owns semantic realization requirements

Integration publishes `CapabilityRequirement`s for external operations. Provider/Binding evaluates candidate providers/bindings using C0 `CapabilitySupportVector` dimensions such as:

- operation coverage;
- consistency/transactionality;
- idempotency/dedup behavior;
- reconciliation/readback;
- ordering/callback behavior;
- limits/rate/pagination;
- batch/partial semantics;
- tenant/site/resource isolation;
- authentication/trust;
- privacy/residency;
- offline/local support;
- observability/evidence;
- lifecycle/API revision support;
- export/migration;
- capacity/SLO.

Provider substitution never implies semantic equivalence. Cutover may create old/new cohorts. Old subscriptions, credentials, webhook endpoints, sessions, pending jobs, retries, caches and callbacks remain explicit residual populations until drained or dispositioned.

## 13. C3.6-DEC-011 — Federation, local/offline operation and Fleet preserve local truth boundaries

Federated integration contracts preserve producer/consumer ownership and bilateral qualification. `producer handed off != consumer applied != consumer postcondition`.

Site-local/edge integration may continue during disconnection only inside C0 `QualifiedLocalClosure` constraints. Offline buffers preserve producing source, revision, observation time and ordering limitations. Reconnect triggers requalification and reconciliation rather than silently treating delayed observations as current.

Fleet/global surfaces display qualified observations and may issue authorized control intent, but Fleet status or command distribution is not proof that every local integration applied or converged it.

## 14. C3.6-DEC-012 — Authority is intersection-based and non-amplifying

Every privileged integration attempt consumes an Authorization-owned decision/reference through C0 `AuthorityEnvelope`.

Effective actuation scope cannot exceed the intersection of:

- canonical delegated authority;
- applicable policy/SoD/approval constraints;
- tenant/site/resource scope;
- admitted provider binding scope;
- credential technical capability;
- operation-specific constraints/currentness.

A provider credential with broad rights never widens System Builder authority. Credential presence, successful authentication, provider role membership, AGWS visibility, AI recommendation, economic entitlement or Fleet reachability are not authorization.

Break-glass/emergency procedures, when applicable, must remain explicit governed authority paths with separate evidence and expiry, not implicit exception bypasses.

## 15. C3.6-DEC-013 — Data/schema/privacy/security/trust remain owner-preserving cross-capability constraints

Integration mappings are revision-qualified against source/target schemas and declare lossiness, unsupported fields, transformations and adoption boundaries. Integration never becomes canonical Data/Schema owner by synchronizing a copy.

Privacy/data-governance constraints include minimization, purpose/scope, retention, residency, sensitive-field treatment and downstream-copy/revoke obligations where applicable.

Security/trust constraints include credential/reference lifecycle, endpoint/provider identity, callback authenticity, trust material revision/currentness, replay protection and isolation. Cryptographic validity establishes only the relevant authenticity/integrity claim; it does not establish business authority or semantic correctness.

## 16. C3.6-DEC-014 — Failure, recovery, circuit, backpressure and capacity are semantic operability dimensions

Integration exposes target-specific failure classes instead of collapsing everything into generic retryable/non-retryable errors.

Material dimensions include:

- unsupported operation/mapping;
- denied/stale authority;
- unavailable/expired credential or binding;
- timeout with effect ambiguity;
- partial batch effect;
- callback loss/duplication/out-of-order arrival;
- provider rate/consistency limits;
- stale capability evidence;
- reconciliation mismatch;
- queue/backlog growth;
- residual old-provider cohort;
- local/offline currentness loss;
- privacy/security/trust failure;
- insufficient evidence (`INCONCLUSIVE`).

Circuit breaking/backoff protects resources but does not resolve semantic effect ambiguity. Queue health is not merely performance metadata when backlog can delay revoke/deprovision, make evidence stale or prevent convergence. Capacity/SLO therefore includes arrival/service assumptions, backlog/age, retry amplification, reconciliation drainability and priority/starvation considerations when material.

## 17. C3.6-DEC-015 — Evidence/audit is claim-scoped and non-strengthening

Each material operation can produce qualified evidence linking:

- canonical intent/invocation;
- authority reference;
- definition/revision vector;
- provider/binding/profile;
- attempt;
- request/receipt;
- external observation/readback;
- effect disposition;
- reconciliation result;
- relevant data/mapping revisions;
- currentness/population scope;
- supersession/correction lineage.

An Integration proof bundle may prove request construction, admission, attempt integrity, provider acknowledgement and reconciliation evidence, but may not claim stronger workflow/business/physical truth unless the required foreign-owner proof is included and verified.

Provenance/correlation is not causality. Causal/counterfactual analysis remains research/analytical output unless separately governed.

## 18. C3.6-DEC-016 — Physical/Peripheral integration remains bounded by C2

Integration may support inventory, identity/account/resource/grant provisioning, read/query/status/event ingestion, drift/reconciliation and provider-/domain-qualified external operations against specialized physical systems.

It does **not** admit a generic direct physical actuation capability.

Provider-/domain-qualified operations that may have physical effects remain explicitly classified and must preserve site/device scope, stale-state constraints, authority, provider revision, safety/interlock obligations where domain-relevant, timeout/idempotency/`UNKNOWN`, human confirmation/SoD where required, audit and independent physical-effect qualification when that claim matters.

`provider reported state != physical truth` remains constitutional.

## 19. C3.6-DEC-017 — Brownfield / Legacy Mirroring is evidence-first

Brownfield discovery may ingest APIs, webhooks, logs, spreadsheets, scripts, scheduled jobs, manual procedures, provider dashboards, copied data, shadow integrations and off-channel operational practices.

The target path is:

`discover -> source/revision -> extract -> classify -> map -> unresolved semantics -> owner proposal/adoption -> canonical integration revision`.

Observed external behavior, scripts and provider configuration are `Fact`/`Claim`/evidence or `InferredCandidate` according to provenance; they are not automatically approved integration semantics.

Unsupported or lossy mappings remain explicit. Human workarounds, verbal approvals, manual retries, copy/paste bridges and emergency provider-console actions are negative-space evidence and must not disappear during normalization.

## 20. C3.6-DEC-018 — Capability-specific Elicitation Lens is mandatory

Integration consumes C1 EKB and tracks coverage per object/capability/revision rather than by scalar completeness score.

Applicable critical dimensions include:

- business purpose/outcome and non-goals;
- integration owner, external-system owner and support/provider owner;
- actors/principals and authority/approval/SoD;
- tenant/site/resource boundaries;
- source-of-truth direction;
- trigger source, admission and correlation semantics;
- operation side-effect class;
- idempotency/deduplication scope/horizon;
- timeout, `PARTIAL`, `UNKNOWN`, retry/redrive and reconciliation;
- callback/webhook/polling behavior;
- schemas/mappings/lossiness;
- create/update/delete/revoke/deprovision lifecycle;
- provider limits/pagination/rate/ordering/batch behavior;
- privacy/security/trust/credential lifecycle;
- offline/local/Fleet behavior;
- observability/evidence/audit;
- capacity/backpressure/SLO;
- provider substitution/coexistence/residual cohorts;
- historical behavior/revision/currentness;
- failure/recovery/manual/emergency procedures;
- abuse/misuse/threat scenarios where risk warrants;
- acceptance and Product Proof obligations.

Stakeholder coverage must not listen only to the process sponsor or only to the integrator. Applicable perspectives include operators, support/on-call, security/privacy, data owner, finance/commercial, provider owner, auditors and affected downstream users.

A wizard/AI may not mark Integration elicitation complete while any applicable HIGH/CRITICAL dimension is `UNTOUCHED`, `PARTIAL`, `CONFLICTED` or `BLOCKED` without governed disposition. `NOT_APPLICABLE` requires rationale. `Deferred` is not `Resolved`.

Cross-artifact consistency checks must detect incompatible claims among stories, use cases, workflows, permissions, schemas, mappings, provider support, operational procedures and acceptance criteria.

## 21. Rejected alternatives

### A. Universal generic connector DSL
Rejected because it would flatten semantic ownership, provider-specific constraints and effect safety into arbitrary configuration.

### B. Treat transport/event subsystem as Integration
Rejected because delivery/replay/order semantics differ from admission and external-effect semantics.

### C. Treat Workflow as owner of integration retry/effect truth
Rejected because Workflow may orchestrate attempts but does not own target-specific idempotency, provider ambiguity or reconciliation truth.

### D. Treat provider API/dashboard as source of canonical business truth
Rejected because provider observation and canonical domain truth have distinct owners and currentness semantics.

### E. Infer successful effect from HTTP/provider ACK
Rejected because acceptance and effect are distinct proof domains.

### F. Give AI/low-code autonomous integration mutation authority
Rejected because AI proposals are candidates and authority must remain explicit/non-amplifying.

## 22. Planning D migration constraints

Planning D must later preserve these constraints without implementing them in this C3 decision:

1. keep the existing AI Gateway request/response and adapter seam as a bounded predecessor;
2. generalize only proven reusable external-interaction primitives, not by renaming AI Gateway into a universal integration subsystem;
3. introduce canonical integration/operation/invocation/attempt/effect identities before depending on provider-native IDs;
4. stage C0 execution/effect disposition and reconcile-before-retry semantics before unsafe mutating connectors;
5. preserve current governed pre-send fail-before-send behavior while integrating canonical Authorization/Policy;
6. add provider support qualification before cross-provider substitution/fallback claims;
7. sequence mapping revision/provenance before bidirectional or Brownfield synchronization claims;
8. stage residual-cohort inventory/drainage before connector/provider cutover closure;
9. keep Workflow and Messaging boundaries explicit through migration;
10. preserve C2 bounded physical/peripheral boundary and do not create generic actuation by migration convenience;
11. add readiness/capacity/currentness observability before declaring operational equivalence;
12. migrate Brownfield integrations as evidence/adoption paths, never silent canonical import.

## 23. Planning E proof candidates / proof obligations

Planning E must define product evidence for at least:

1. canonical integration identity survives provider substitution while realization IDs change;
2. event/message delivery cannot by itself prove automation admission or completion;
3. provider receipt cannot by itself prove `APPLIED`, `CONVERGED` or business validation;
4. `UNKNOWN` mutation cannot be unsafely retried without reconciliation or qualified duplicate-safety proof;
5. idempotency/dedup claims are scope/horizon/revision qualified;
6. replay/redrive preserves prior attempt/effect lineage;
7. callbacks/webhooks cannot cross cohort/revision boundaries silently;
8. partial/batch results remain per-operation visible and are not hidden by aggregate success;
9. provider credentials/scopes cannot widen canonical authority;
10. schema/process/data mappings preserve owner/revision/lossiness semantics;
11. provider substitution exposes support-vector differences and residual cohorts;
12. revoke/deprovision cannot be declared converged while residual sessions/grants/resources remain unqualified;
13. local/offline observations retain producing revision/time/currentness and do not become Fleet omniscience;
14. queue/backpressure proofs cover reconciliation/revoke drainability where required;
15. Brownfield observed behavior cannot be promoted to approved canonical integration semantics without owner adoption;
16. physical/peripheral operations cannot acquire generic direct-actuation authority;
17. C1 no-false-complete gate blocks HIGH/CRITICAL unresolved integration dimensions or contradictions without disposition;
18. AI/low-code proposals cannot mutate privileged integrations or promote `UNKNOWN`/inferred state into authoritative truth.

These obligations inherit the 408 adversarial findings as constraints/proof routes; they do not remediate or instantiate research findings.

## 24. Findings / conflict disposition

This Planning C decision creates:

- **0 new research findings**;
- **0 new `ConflictPattern`s**;
- **0 `ConflictInstance`s**;
- **0 remediations**;
- **0 saturation streak changes**.

Candidate concerns encountered during target design — event-vs-effect identity, batch partiality, provider residual cohorts, false elicitation completeness, external-effect ambiguity, physical-state qualification and AI authority amplification — duplicate-screen to inherited research families and are carried as architecture constraints/proof obligations.

## 25. Result

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Integration & Automation owns portable, revision-qualified semantics for triggers/admission, external operations, connector realization contracts, automation invocation/attempt/effect lineage, target-specific idempotency/retry/reconciliation and qualified external provisioning/synchronization. It consumes rather than replaces Workflow, Messaging, Authorization, Provider/Binding, Data/Schema, Security/Trust, Observability and Lifecycle owners.

The target preserves the critical separations:

`integration receipt != business effect`  
`event delivery != automation admission != automation completion`  
`provider credential/scope != canonical authority`  
`retry != safe replay`  
`observed external behavior != approved canonical semantics`  
`provider reported state != physical truth`  
`AI/low-code proposal != integration mutation authority`.

C3.6 is complete architecturally only. Planning C remains OPEN until all 28 C3 capability target decisions are recorded and the global Planning C gate closes explicitly.
