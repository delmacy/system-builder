# Generation 2 — Planning C — C3.24 Lifecycle / Versioning / Evolution / Migration Target Architecture

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Capability: **Lifecycle / Versioning / Evolution / Migration**
Decision: `C3.24`
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction, remediation, Planning D/E execution, Architecture Reconciliation, WBS or worker handoff is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, Planning C C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for Lifecycle / Versioning / Evolution / Migration, C3.1–C3.23, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

The authoritative state and branch head were re-read immediately before persistence. Entry head: `b81dd9ddad84b1ffc5e03d9d27c230e408b50c66`.

Constitutional distinctions remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `revision exists != effective adoption`;
- `published != deployed != migrated != converged != validated`;
- `backward parse compatibility != semantic migration safety`;
- `old artifact retained != rollback eligible`;
- `backup exists != restore qualified`;
- `migration step ACK != migration postcondition`;
- `desired cutover != effective cutover != residual cohort drainage`;
- `provider acceptance != authoritative effect`;
- `Fleet aggregate != Station-local migration truth`;
- `historical evidence != current readiness`;
- `provenance != truth != currentness != authority`;
- `AI migration proposal != execution/adoption authority`;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

Physical / Peripheral migration remains bounded by C2 integration/governance semantics. This capability does not infer generic direct physical actuation.

## 2. Planning A/B anchor and target disposition

Planning A made Lifecycle the cross-capability owner of **change semantics**, not the owner of domain truths or realization mechanics. It owns lifecycle subjects/revision vectors, transition plans, compatibility/coexistence claims, migration readiness/currentness, staged cutover, deprecation/withdrawal, correction/supersession lineage, rollback eligibility and residual authoritative cohort drainage. Data/Schema, Workflow, Deployment, Provider/Binding, Standards/API Contracts, Artifact/Release, Security/Recovery, Privacy and Governance retain their own truths and actuation.

Planning B found unusually strong SB foundations: provider-neutral process artifact/revision identity, immutable publication and overwrite guards, predecessor/supersession lineage, lifecycle states, process-to-analysis-to-SystemDefinition-to-release-to-deployment lineage, release lifecycle, stale-active fencing and retained-history deployment proofs. It did not find a generalized cross-capability revision vector, current migration-readiness model, staged coexistence/cutover/convergence model, residual-authoritative-cohort closure, generalized rollback-eligibility assessment or cross-owner `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` transition semantics.

C3.24 therefore adopts:

**KEEP + HARDEN + GENERALIZE + INTEGRATE + PROVIDERIZE OWNER-SPECIFIC MIGRATION MECHANICS**.

It rejects a global scalar version service, a central migration engine that steals owner semantics, and any architecture that treats retained history, provider success, a deployment rollout, a schema parse, a backup or a Fleet summary as sufficient proof of lifecycle completion.

## 3. Target decision

**DECISION C3.24-D1 — establish a revision-qualified Lifecycle Evolution & Migration Coordination Plane that owns cross-capability revision succession, applicability/currentness, migration intent and plan coordination, readiness, coexistence, staged cutover, residual cohort drainage, deprecation/withdrawal, correction/supersession and current rollback eligibility, while semantic owners retain domain truth and realization owners retain migration/rollback/recovery actuation.**

The plane has ten linked semantic surfaces:

1. **Lifecycle Subject Plane** — stable references to owner-defined logical subjects and immutable owner revisions.
2. **Revision Vector Plane** — sparse vectors of independently changing revisions relevant to a transition.
3. **Applicability / Compatibility / Currentness Plane** — evidence-qualified claims over scope, cohort and time.
4. **Migration Intent & Plan Plane** — revisioned intent, plan, dependency DAG, steps, checkpoints and proof obligations.
5. **Readiness Plane** — preconditions and current qualification before a transition or cutover.
6. **Coexistence & Cutover Plane** — canary/phased adoption, bounded translation/dual operation, fencing and effective-owner transfer.
7. **Residual Cohort Plane** — explicit populations still capable of old-revision behavior or authoritative effects.
8. **Rollback / Roll-forward Eligibility Plane** — current qualified claims distinct from actuation and state recovery.
9. **Deprecation / Withdrawal / Supersession Plane** — lifecycle windows, sunset, correction and immutable historical lineage.
10. **Federated / Brownfield Reconciliation Plane** — Station/Fleet/offline divergence and discovered legacy/manual migration evidence.

## 4. Logical subject identity and immutable revisions

Lifecycle does not mint a second competing identity for objects already owned elsewhere. A `LifecycleSubjectRef` points to the stable logical identity owned by the relevant canonical capability. A `LifecycleRevisionRef` points to an immutable revision of that owner-defined subject.

Canonical lifecycle coordination identities include:

- `LifecycleTransitionId`;
- immutable `LifecycleTransitionRevisionId`;
- `RevisionVectorId` or deterministic vector digest where useful;
- `MigrationIntentId` / immutable `MigrationIntentRevisionId`;
- `MigrationPlanId` / immutable `MigrationPlanRevisionId`;
- `MigrationStepId`;
- `MigrationCheckpointId`;
- `MigrationReadinessAssessmentId`;
- `CompatibilityApplicabilityAssessmentId`;
- `CutoverDecisionId` / `CutoverOccurrenceId`;
- `ResidualCohortId`;
- `DrainageAssessmentId`;
- `RollbackEligibilityAssessmentId`;
- `DeprecationNoticeId` / `WithdrawalOccurrenceId`;
- `CorrectionSupersessionLinkId`;
- `LifecycleReconciliationId`.

Mutable aliases such as `latest`, `stable`, `current`, provider channel names or environment labels are discovery/projection conveniences. Authoritative transition decisions pin immutable revisions or explicit owner-qualified ranges.

The identity invariant is:

`logical subject != immutable subject revision != lifecycle transition != realization occurrence`.

## 5. RevisionVector is sparse, owner-qualified and cohort-aware

**DECISION C3.24-D2 — lifecycle compatibility, readiness and adoption are evaluated over a sparse `RevisionVector`; no single global version number is semantically sufficient.**

A transition vector may include, when applicable:

- business/process/model revision;
- schema/data contract revision;
- workflow definition revision and in-flight workflow cohort;
- UI/AGWS surface revision;
- authorization/policy revision;
- governance/privacy obligation revision;
- trust/certificate profile revision;
- configuration and secret-reference revisions;
- build/dependency/toolchain revision;
- artifact/release revision;
- deployment/runtime generation;
- provider/binding/profile revision;
- interoperability/API contract revision;
- notification/event/message schema/profile revision;
- storage/document/media representation revision;
- observability/readiness profile revision;
- FinOps/economic constraint revision;
- tenant/Station/site topology revision;
- evidence/test-suite revision;
- effective-time/currentness horizon.

The vector is sparse: irrelevant dimensions are absent, not silently defaulted. `ABSENT`, `NOT_APPLICABLE`, `UNKNOWN` and a known explicit revision are different states.

Different cohorts may legitimately have different effective vectors during coexistence. Therefore `effectiveRevisionVector(subject, cohort, scope, time)` is a qualified claim, not a property globally attached to the subject.

## 6. Compatibility, applicability and currentness

**DECISION C3.24-D3 — lifecycle compatibility is directional, applicability-scoped, evidence-qualified and non-transitively inferred.**

A lifecycle assessment consumes owner claims rather than recreating them. Examples:

- C3.13 qualifies schema/data compatibility and migration correctness;
- C3.23 qualifies contract/profile compatibility;
- C3.22 qualifies provider realization/support/admission;
- C3.5 qualifies workflow in-flight semantics;
- C3.20 qualifies deployment/runtime realization;
- C3.11/C3.17 qualify trust/config/secret currentness;
- C3.9/C3.12 qualify governance/privacy constraints.

Lifecycle composes these claims for a particular transition without converting them into semantic equivalence.

Assessment states include at least:

- `QUALIFIED`;
- `PARTIAL`;
- `INCOMPATIBLE`;
- `BLOCKED`;
- `STALE`;
- `UNKNOWN`;
- `INCONCLUSIVE`;
- `NOT_APPLICABLE` with explicit rationale/evidence.

A summary UI may exist, but a scalar average cannot hide any required `INCOMPATIBLE`, `BLOCKED`, `UNKNOWN`, `INCONCLUSIVE`, stale critical evidence or unresolved HIGH/CRITICAL elicitation gap.

## 7. Lifecycle transition state is not a one-bit migrated flag

**DECISION C3.24-D4 — a lifecycle transition exposes distinct intent, preparation, realization, convergence, validation and drainage states.**

The portable lifecycle is conceptually:

`PROPOSED -> PREPARING -> QUALIFYING -> READY_CANDIDATE -> STAGED/COEXISTING -> CUTOVER_REQUESTED -> CUTOVER_IN_PROGRESS -> EFFECTIVE_CANDIDATE -> CONVERGING -> VALIDATION_PENDING -> VALIDATED -> DRAINING -> CLOSED`.

Cross-cutting dispositions may include:

- `BLOCKED`;
- `PARTIAL`;
- `INCONCLUSIVE`;
- `ABORTED`;
- `ROLL_FORWARD_REQUIRED`;
- `ROLLBACK_CANDIDATE`;
- `RECONCILE_REQUIRED`.

No state name is itself proof. Every strong transition state references current evidence and the revision/cohort population it describes.

A transition cannot reach `CLOSED` while a residual cohort can still produce authoritative old-revision effects unless that cohort has an explicit accepted terminal disposition that removes its authority or makes its continued existence harmless under owner-defined invariants.

## 8. Migration intent, plan, steps, checkpoints and evidence

**DECISION C3.24-D5 — migration is represented as a revisioned plan DAG whose nodes are owner-qualified changes and evidence checkpoints, not as an opaque imperative script.**

A `MigrationIntentRevision` declares:

- source and target revision vectors;
- purpose and business/operational rationale;
- affected capabilities and semantic owners;
- population/cohort scope;
- authority/approval scope;
- compatibility assumptions and unresolved questions;
- migration risk dimensions;
- deprecation/sunset intent;
- rollback/roll-forward policy hypothesis;
- required owner proofs.

A `MigrationPlanRevision` declares:

- ordered/partially ordered `MigrationStep`s;
- preconditions and postconditions owned by the appropriate capability;
- explicit dependency edges;
- checkpoints and pause gates;
- cutover/fencing conditions;
- reconciliation routes;
- abort/roll-forward/rollback decision points;
- observability requirements;
- capacity and rate controls;
- expected residual cohorts and drainage obligations.

A step records `attempted`, protocol/provider acknowledgement when relevant, effect disposition `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN`, owner validation and evidence currentness separately. `ACK` can never be promoted to a stronger postcondition without the owner-defined contract proving that equivalence.

`UNKNOWN` mutating effects require reconcile-before-retry unless operation-scoped idempotency is explicitly qualified for the exact revision, identity and time scope.

## 9. Readiness is current evidence, not historical certification

**DECISION C3.24-D6 — transition and cutover readiness are reevaluated current claims over revision vector, cohort, dependencies and evidence horizon.**

Readiness can require, as applicable:

- target artifact/release admitted and retrievable;
- schema/data migration preconditions;
- provider/contract compatibility;
- trust/config/secrets current and available;
- authorization/governance/privacy constraints satisfied;
- required capacity/headroom;
- observability and reconciliation routes operational;
- rollback or roll-forward contingency qualified;
- backup/restore evidence where recovery depends on it;
- affected stakeholder/owner approvals;
- Station/offline populations accounted for;
- current residual-cohort inventory.

A readiness result can become stale because topology, certificate validity, provider support, schema population, legal hold, queue backlog, consumer cohort or evidence changes. Historical `PASS` never grants perpetual cutover eligibility.

## 10. Canary, phased cutover and coexistence

**DECISION C3.24-D7 — staged adoption is cohort-explicit and semantics-preserving; canary/phased cutover is a lifecycle coordination pattern, not a universal deployment-only mechanism.**

A cohort may be based on tenant, Station/site, actor population, workflow creation time, runtime replica, provider binding, data partition, consumer group, contract client, region, feature exposure or another owner-defined partition.

Each staged cohort records source vector, target vector, exposure/adoption state, evidence and currentness. Promotion to a larger cohort requires explicit qualification; success in one canary does not prove another cohort equivalent.

Coexistence is permitted only when the relevant owners define safe interaction between old and new revisions. Examples include:

- old and new contract consumers simultaneously supported;
- dual schema readers during an additive transition;
- old workflow instances finishing under pinned definitions while new instances use a successor;
- blue/green or canary runtime cohorts;
- provider old/new bindings during bounded cutover;
- telemetry dual emission for a migration window.

## 11. Dual-read, dual-write and translation are qualified techniques, not defaults

**DECISION C3.24-D8 — dual-read/write/emit and translation are allowed only with explicit owner-defined equivalence, precedence, conflict and drainage semantics.**

Lifecycle may coordinate these techniques but does not decide their semantic safety.

A dual-write plan must define at minimum:

- authoritative source during each phase;
- identity/equivalence relation;
- write ordering/atomicity limitations;
- retry/idempotency behavior;
- conflict detection and resolution owner;
- partial-write disposition;
- reconciliation/backfill route;
- cutoff/fence condition;
- residual old-store drainage;
- privacy/governance implications.

A translator/adapter must preserve semantic loss explicitly. A value that can be parsed or transformed syntactically is not thereby migration-safe.

## 12. Fencing and authoritative cutover

**DECISION C3.24-D9 — cutover requires an explicit authority/effect boundary that prevents old cohorts from silently remaining authoritative after the new target is declared effective.**

Possible realization mechanisms include generation checks, leases, epochs, compare-and-promote, routing fences, write fences, consumer generation, provider binding generation or owner-specific admission tokens. Lifecycle owns the need and evidence for fencing; the owning capability implements/realizes the actual mechanism.

A residual cohort may continue to exist in a read-only, archival, compatibility or observational role. What it cannot do after authoritative cutover is continue producing old-revision authoritative effects unless the migration plan explicitly permits that coexistence and its reconciliation semantics.

## 13. In-flight populations require explicit revision-crossing policy

**DECISION C3.24-D10 — every revision-bearing in-flight population declares what happens when a successor revision becomes effective.**

Population classes include:

- workflow/process instances;
- human tasks and approvals;
- authenticated sessions and delegated authority;
- messages/events/retries/redrive queues;
- data rows/partitions/backfill and CDC streams;
- contract/API clients;
- provider bindings and remote jobs;
- runtime replicas/routes/workers;
- caches and configuration/credential consumers;
- document/media transformations;
- offline Station operations and locally buffered effects.

Permitted policies are owner-qualified, for example:

- `PIN_AND_DRAIN`;
- `GRANDFATHER_UNDER_EXPLICIT_LIMITS`;
- `REVALIDATE_BEFORE_NEXT_EFFECT`;
- `TRANSLATE_AT_BOUNDARY`;
- `SUSPEND`;
- `CANCEL_AND_COMPENSATE`;
- `FORCE_MIGRATION_WITH_OWNER_PROOF`;
- `QUARANTINE_AND_RECONCILE`.

Lifecycle does not silently rewrite workflow history, session authority, message meaning, data identity or provider job state.

## 14. Residual cohorts are first-class closure conditions

**DECISION C3.24-D11 — transition closure requires explicit residual cohort inventory, age/currentness and drainage disposition.**

A `ResidualCohort` records:

- subject/revision vector;
- population identity and estimated/observed size;
- tenant/Station/site/provider scope;
- whether it can still create authoritative effects;
- oldest/newest relevant observation;
- expected drainage mechanism/rate;
- blocker/exception state;
- owner/escalation;
- evidence and currentness horizon.

Counts alone are insufficient. Queue/cohort **age** matters: a small but ancient critical cohort may represent greater migration debt than a large rapidly draining benign cohort.

`zero observed` is not equivalent to `proven zero` when inventory coverage is partial or stale.

## 15. Offline, Station and Fleet divergence

**DECISION C3.24-D12 — lifecycle state is locality-qualified; Fleet summaries are projections and never replace Station-local migration truth.**

A Station may operate with a qualified local closure while disconnected. Its revision vector, evidence horizon and allowed offline actions must be explicit. Enterprise-side target revision changes do not retroactively mutate local reality.

Reconnect reconciliation compares:

`enterprise intended vector -> Station observed/effective vector -> buffered local effects -> authority/currentness -> conflict set -> reconciliation plan -> validated convergence`.

Possible local states include `CURRENT`, `BEHIND_WITHIN_ALLOWED_WINDOW`, `PARTIAL`, `DIVERGED`, `UNKNOWN`, `BLOCKED`, `RECONCILE_REQUIRED`.

A Fleet statement such as “99% migrated” may be operationally useful, but it cannot hide a critical Station that is stale, unknown or still authoritative under the old vector.

## 16. Deprecation, withdrawal, sunset, correction and supersession

**DECISION C3.24-D13 — deprecation and withdrawal are revisioned lifecycle decisions with applicability windows and residual-consumer evidence; they are distinct from deletion or physical unavailability.**

The model distinguishes:

- successor publication;
- deprecation notice;
- migration/adoption window;
- support window;
- withdrawal/sunset decision;
- effective withdrawal;
- residual consumer/client cohort;
- archival/history retention;
- physical deletion/disposition owned elsewhere.

Security, privacy, legal, trust or governance events may require an accelerated withdrawal that overrides a normal support window. Such acceleration must preserve explicit authority and evidence rather than being disguised as routine version progression.

Correction/supersession never rewrites history. Evidence produced under revision `R` remains attributable to `R` even when `R+1` becomes current.

## 17. Rollback, roll-forward and state recovery are distinct

**DECISION C3.24-D14 — rollback eligibility is a current evidence-qualified lifecycle claim; rollback actuation, roll-forward and restore/state recovery remain distinct operations with different owners and proof obligations.**

A `RollbackEligibilityAssessment` may need to qualify:

- retained prior artifact/release availability and provenance;
- prior contract/provider compatibility still being supported;
- schema/data reversibility or forward-compatibility;
- irreversible data transformations already applied;
- in-flight workflow/session/message populations;
- configuration/secret/trust validity;
- current authorization/governance/privacy constraints;
- infrastructure/runtime capability;
- external provider state that may not be reversible;
- residual target-revision effects;
- capacity/headroom for rollback traffic;
- current backup/restore qualification if state recovery is part of the strategy.

Therefore:

`old artifact retained != rollback eligible`.

`backup exists != restore qualified`.

`rollback deployment succeeded != business/domain state restored`.

`restore completed != current revision vector valid`.

A restored snapshot can resurrect stale credentials, schemas, policies, legal constraints, provider references or old data populations; requalification is mandatory before stronger lifecycle claims.

When rollback is unsafe, the correct path may be `ROLL_FORWARD_REQUIRED` rather than pretending reversibility.

## 18. Queueing, flow, capacity and migration headroom

**DECISION C3.24-D15 — migrations are capacity-consuming flows whose safety depends on queue/backlog/headroom evidence, not only correctness of individual steps.**

Relevant measurements include:

- migration/backfill arrival rate `lambda_m`;
- effective service/drain rate `mu_m` under explicit assumptions;
- queue depth and age;
- CDC/replication lag;
- retry/redrive amplification;
- dual-write/dual-emit amplification factor;
- provider/API quotas;
- worker concurrency;
- database/storage/network headroom;
- reconnect burst size;
- canary dwell time;
- residual cohort drainage rate;
- projected time-to-drain with uncertainty.

If arrival/retry pressure is not sustainably below effective service capacity for the relevant class, a plan cannot infer eventual drainage from one healthy sample. Capacity evidence is population-, topology- and time-qualified.

FinOps/economic constraints can bound rates or timing, but cost optimization cannot silently weaken correctness, security, privacy, recovery or proof obligations.

## 19. Cross-capability ownership and handoffs

Lifecycle coordinates but does not absorb these owners:

| Capability | Owner truth consumed by Lifecycle |
| --- | --- |
| Workflow & Durable Execution | in-flight history, definition pinning, cancellation/compensation and workflow migration safety |
| Data / Schema / Migrations | schema/data identity, compatibility, backfill/CDC correctness, population postconditions |
| Storage / Documents / Media | representation/state migration and durable storage effects |
| Notifications / Events / Messaging | producer/consumer revision, delivery/redrive populations, ordering/idempotency semantics |
| Observability / Operations / Incident | current operational evidence, incident/degradation and validation signals |
| Secrets / Configuration | effective config/secret reference cohorts and rotation/revocation convergence |
| Build / Dependency Graph | reproducible dependency/toolchain closure and compatibility evidence |
| Artifact / Release / SBOM | immutable artifact/release identity, provenance, admission/distribution/withdrawal mechanics |
| Deployment / Runtime | rollout, placement, readiness, traffic, deployment rollback actuation |
| Provider / Binding | provider support/admission/binding/coexistence/cutover realization |
| Standards / API Contracts | protocol/profile compatibility, negotiation, operation semantics |
| Authorization | action authority, delegation and policy revision crossing |
| Governance / Compliance / Audit | obligation/control applicability, exception and compliance evidence |
| Security / Resilience / Recovery | containment, failover/restore/rebuild qualification and return-to-service evidence |
| Enterprise Trust / PKI | trust chain/profile validity and credential lifecycle evidence |
| Privacy / Data Governance | purpose, retention, hold, residency, disposition constraints and residual populations |
| Technology Economic Governance / FinOps | cost/usage budgets and economic constraints without safety override |

Cross-capability graph edges are semantic references, not duplicated ownership.

## 20. Brownfield assimilation and manual migration evidence

Brownfield discovery follows `Mirroring-first + AI-assisted + Human-mapped + Wizard-completed`.

Existing scripts, runbooks, spreadsheets, release notes, operator sequences, database jobs, provider consoles, maintenance windows, incident histories and tribal knowledge are evidence/candidates. They are epistemically classified as `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope` or `Deferred`.

Observed historical order does not automatically become desired migration semantics. A manual step that “usually works” stays a claim until authority, preconditions, effect, evidence and recovery semantics are understood.

Provenance backfill has limits: Generation 2 must not invent historical evidence, exact timing or authority that cannot be recovered from sources.

## 21. Lifecycle Elicitation Lens

The universal C1 question taxonomy is specialized for lifecycle change. At minimum, adaptive questioning should discover:

- what logical subject is changing and who owns its meaning;
- source and target revisions for every material dimension;
- why change is needed and what must remain invariant;
- what populations are already on each revision;
- what can remain in coexistence and for how long;
- what compatibility is actually proven, directionally and for which cohort;
- what cannot be safely translated or dual-operated;
- which in-flight instances/sessions/messages/jobs/data populations cross the revision boundary;
- what must be fenced at cutover;
- what evidence establishes readiness now;
- what evidence establishes effective adoption, convergence and validation;
- what residual cohorts can still create authoritative effects;
- what is the drainage mechanism and acceptable age/lag;
- what state can become `PARTIAL`, `UNKNOWN` or `INCONCLUSIVE`;
- what requires reconcile-before-retry;
- who owns escalation when drainage stalls;
- what SLO/SLA, maintenance window, load and capacity constraints apply;
- what provider quotas/cost constraints can throttle migration;
- what offline Stations/sites exist and what divergence is permitted;
- what rollback, roll-forward or restore paths exist and which are currently qualified;
- what irreversible effects make rollback unsafe;
- what governance/privacy/security/trust constraints can block or accelerate change;
- how success is proven after deploy/cutover;
- what would falsify the claim “migration complete?”.

Follow-ups are triggered by gaps, contradictions, stale evidence, owner disagreement, discovered residual populations, ambiguous provider effects or any unsupported `N/A`. A textual answer alone never marks the dimension resolved.

## 22. Coverage and Production Readiness

Lifecycle coverage is multidimensional and per transition/cohort. Candidate dimensions include:

- subject/revision identity;
- owners/authority;
- source/target vector;
- compatibility/applicability;
- readiness evidence/currentness;
- migration plan/dependencies;
- in-flight populations;
- coexistence/translation;
- cutover/fencing;
- failure/UNKNOWN/reconciliation;
- rollback/roll-forward/recovery;
- residual cohort inventory/drainage;
- offline/Station/Fleet divergence;
- security/privacy/governance/trust;
- observability;
- queue/capacity/headroom;
- cost/quotas;
- validation/product proof.

Coverage states remain `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`, each with evidence/currentness.

Separate gates are preserved:

- `sufficient for abstraction`;
- `sufficient for candidate architecture`;
- `sufficient for implementation`;
- `sufficient for publish/operation`.

No gate means absolute completeness. HIGH/CRITICAL unanswered questions, unresolved contradictions, stale critical readiness evidence or unknown authoritative residual cohorts prevent false-complete.

Production Readiness Coverage is separate from feature completeness and includes at least SLO/SLA, peak load, queue/backlog age, timeout/UNKNOWN, retry/idempotency, provider/dependency health, ownership/on-call, alertability, capacity headroom, degraded/offline behavior, reconciliation, recovery, post-change validation and current rollback/roll-forward contingency.

## 23. Wizard / AI boundaries

Greenfield follows `AI-first + Wizard-validated + Expert-direct`. Brownfield follows `Mirroring-first + AI-assisted + Human-mapped + Wizard-completed`.

A Master Wizard can coordinate Lifecycle-specific sub-wizards for revision inventory, compatibility/readiness, residual cohorts, rollback eligibility and production readiness. It must not become a monolithic migration questionnaire.

AI may:

- propose revision mappings;
- detect likely residual cohorts;
- generate follow-up questions;
- suggest migration DAGs and checkpoints;
- derive candidate scenarios/use cases/requirements;
- highlight contradictions or stale evidence;
- estimate capacity under explicit assumptions;
- propose rollback/roll-forward alternatives.

AI outputs remain `InferredCandidate` until adopted by the appropriate authority. AI cannot grant migration authority, invent compatibility/currentness evidence, close unresolved questions, approve rollback, weaken governance/privacy/security constraints or declare adoption/convergence.

## 24. Physical / Peripheral bounded integration

C2 remains controlling. Lifecycle may coordinate changes to external-system bindings, protocol/profile mappings, device-class mappings, edge gateways and integration/governance evidence. It may track residual site/device/provider cohorts and offline divergence.

It does **not** acquire generic authority to actuate physical systems, bypass vendor safety interlocks, infer physical truth from provider ACKs or reinterpret specialized system state. Any provider/domain-qualified physical operation remains owned by its bounded integration/domain authority.

## 25. Planning D constraints carried forward — not executed here

Planning D must later design an incremental migration strategy that respects:

1. current strong process revision/release/deployment lineage is retained and adapted rather than replaced wholesale;
2. lifecycle coordination can coexist with owner-local lifecycle/migration records during transition;
3. free-form notes/runbooks/manual procedures coexist with structured evidence until deliberately migrated;
4. provenance/currentness must be attached incrementally without fabricating historical authority;
5. revision vectors can begin sparse and expand as owners adopt them;
6. residual cohort discovery can initially be partial but must expose incompleteness explicitly;
7. historical retained artifacts remain history, not precomputed rollback eligibility;
8. provider/schema/workflow/deployment migration mechanics remain with their owners;
9. cross-capability lifecycle references must be additive/backward-compatible where feasible;
10. no migration strategy may require all capabilities to switch atomically before useful lifecycle evidence exists.

These are constraints for Planning D only; no Planning D work is performed by C3.24.

## 26. Planning E product-proof candidates — not executed here

C3.24 carries forward **40 proof candidates**:

1. stable logical subject identity remains distinct from immutable revision identity;
2. two independently changing owner revisions form a vector without scalar collapse;
3. absent vector dimension does not become implicit default/current;
4. compatibility is directional;
5. compatibility is not inferred transitively without evidence;
6. stale compatibility/readiness evidence cannot authorize cutover;
7. textual readiness claim without evidence remains unresolved/inconclusive;
8. migration step ACK does not prove owner postcondition;
9. timeout/ambiguous mutation produces `UNKNOWN` and reconcile-before-retry;
10. canary success does not prove untested cohort success;
11. coexistence records different effective vectors by cohort;
12. unsafe dual-write is rejected when authority/conflict semantics are absent;
13. partial dual-write remains `PARTIAL` and is reconciled;
14. translation loss is surfaced rather than silently coerced;
15. cutover fencing blocks unauthorized old-revision authoritative writes;
16. old workflow instances can remain pinned while new instances adopt successor definition;
17. revision crossing can force revalidation/suspension/cancellation where owner policy requires;
18. residual old message/retry cohorts prevent false closure when still authoritative;
19. zero observed residual cohort does not equal proven zero under partial inventory;
20. cohort age exposes stalled drainage hidden by small counts;
21. offline Station remains explicitly behind/diverged rather than Fleet-complete;
22. reconnect reconciles intended/observed vectors plus buffered effects;
23. Fleet aggregate cannot override a critical local `UNKNOWN`;
24. deprecation does not equal withdrawal;
25. withdrawal does not equal physical deletion;
26. correction/supersession preserves historical producing revision;
27. retained artifact alone does not qualify rollback;
28. backward parse compatibility alone does not qualify rollback/migration safety;
29. backup existence alone does not qualify restore;
30. restored state is requalified against current config/trust/policy/privacy revisions;
31. irreversible data effect can force roll-forward instead of false rollback;
32. rollback deployment success does not prove domain-state restoration;
33. provider migration success does not close lifecycle while residual provider jobs/cohorts remain;
34. migration queue/backlog age and headroom can block readiness despite functional correctness;
35. retry amplification can invalidate projected drainage capacity;
36. privacy/legal hold can block a nominal lifecycle disposal/deprecation step;
37. trust/security event can accelerate withdrawal only with explicit authority/evidence;
38. Brownfield observed scripts remain evidence/candidates, not canonical plan by observation;
39. AI-generated migration plan remains proposal-only until owner adoption;
40. no false `complete` state is possible while HIGH/CRITICAL coverage gaps, contradictions, stale critical evidence or unknown authoritative residual cohorts remain.

These are proof obligations for later Planning E, not tests or implementation authorized by this decision.

## 27. Inherited adversarial obligations

The closed adversarial research remains authoritative. C3.24 specifically preserves defenses against:

- false convergence from control-plane ACKs;
- old/new revision split-brain;
- stale compatibility/currentness evidence;
- version-vector scalarization;
- workflow/session/message revision crossing;
- retry after unknown external effect;
- provider substitution residual cohorts;
- partial schema/data migration;
- offline/Fleet false completeness;
- rollback assumptions after irreversible effects;
- backup/restore false equivalence;
- queue instability and retry amplification;
- governance/privacy/trust change during migration;
- Brownfield assumption-to-fact promotion;
- AI early termination or authority amplification;
- cross-capability semantic ownership duplication.

No new Research finding, ConflictPattern, ConflictInstance or remediation is created by Planning C.

## 28. Final C3.24 decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Generation 2 adopts Lifecycle / Versioning / Evolution / Migration as the canonical cross-capability coordinator of explicit change. The target keeps strong existing process/release/deployment lineage foundations, generalizes them into sparse revision vectors and evidence-qualified transition records, makes staged coexistence/cutover and residual cohorts first-class, and defines rollback eligibility as a current qualified claim rather than historical availability.

The capability is deliberately not a global version service, not a schema migrator, not a deployment controller, not a provider adapter and not a recovery engine. Semantic owners keep truth; realization owners keep actuation; Lifecycle composes their evidence to answer a narrower but essential question: **which revision is effectively authoritative for which population now, what remains in transition, and what evidence allows the system to advance, drain, roll forward, roll back or stop?**

C3 target-architecture coverage becomes **24/28** when the state machine records this decision. C3.25 and later decisions remain out of scope for this action.