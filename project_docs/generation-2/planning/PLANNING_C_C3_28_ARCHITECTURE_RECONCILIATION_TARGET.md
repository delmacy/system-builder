# Generation 2 — Planning C — C3.28 Architecture Reconciliation Target

Status: **DECIDED / PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Capability: **Architecture Reconciliation as a Capability**  
Decision: `C3.28`  
Scope: target-architecture planning only. No product implementation, Work Package, executive TASK, Construction, remediation, Planning D/E execution, Architecture Reconciliation phase, WBS or worker handoff is authorized by this record.

## 1. Decision authority and inherited constraints

This decision is governed by `RESEARCH_PIPELINE_STATE.json`, C0 Universal Capability Architecture / Semantic Substrate, C1 Elicitation & System Understanding, C2 Physical / Peripheral Integration Boundary, Planning A/B for Architecture Reconciliation, C3.1–C3.27, and the closed adversarial inventory of **284 material edge scenarios + 124 ConflictPatterns = 408 material findings**.

Entry head revalidated immediately before persistence: `f3afae73c86c80ad3e539b205c8ff11804444887`.

Constitutional distinctions remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `observation != canonical truth`;
- `drift signal != confirmed conflict`;
- `reconciliation != remediation`;
- `desired != accepted != applied/effective != converged != validated`;
- `aggregate != dimensional completeness`;
- `healthy Fleet aggregate != local convergence`;
- `provider state != semantic equivalence`;
- `AI normalization proposal != authority`;
- `answered != understood != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

Physical / Peripheral operations remain bounded by C2. Reconciliation may compare intended integration/governance state with qualified peripheral/provider evidence, but it gains no generic direct physical actuation authority.

## 2. Planning A/B anchor and target disposition

Planning A assigned Architecture Reconciliation ownership of evidence-qualified comparison between explicitly identified desired/product truth and observed/effective truth, drift identity/classification, owner routing, ambiguous-outcome reconciliation, governed normalization/adoption proposal lineage, correction/supersession and scoped closure. It explicitly denied ownership of the underlying semantic truths, provider/runtime actuation, telemetry production, governance policy, recovery qualification and domain semantics.

Planning B found strong repository-first reconciliation discipline: repository-as-memory, fresh-main revalidation, exact-head evidence binding, explicit architecture review, bounded findings/debt/exclusions, ADR rationale and stale-memory closure blocking. It did not find a generalized first-class reconciliation subject, typed drift/effect model, currentness-qualified evidence model, correction/reopen graph, residual-cohort closure or machine-readable owner routing.

C3.28 therefore adopts:

**KEEP REPOSITORY-FIRST RECONCILIATION DISCIPLINE + HARDEN CURRENTNESS/CONTRADICTION/CLOSURE + GENERALIZE A PROVIDER-NEUTRAL RECONCILIATION SEMANTIC PLANE + INTEGRATE OWNER ROUTING WITHOUT CENTRALIZING DOMAIN AUTHORITY**.

## 3. Target decision

**DECISION C3.28-D1 — establish a provider-neutral, revision-qualified Architecture Reconciliation Plane that compares owner-declared canonical intent with qualified observed/effective evidence, records multidimensional drift without inventing truth, routes unresolved relations to the correct owner, and closes only on scoped evidence-backed conformance.**

The plane contains ten semantic surfaces:

1. **Reconciliation Subject Plane** — stable subject identity, semantic owner, applicability and comparison profile.
2. **Revision Vector Plane** — desired, binding/provider, deployment/runtime, schema/workflow/policy and evidence revisions relevant to the comparison.
3. **Qualified Evidence Plane** — provenance, coverage, currentness, uncertainty and observation horizons.
4. **Comparison & Drift Plane** — graph- and vector-qualified conformance relations.
5. **Ambiguous Effect Plane** — `APPLIED / NOT_APPLIED / PARTIAL / UNKNOWN` classification and reconcile-before-retry.
6. **Routing & Authority Plane** — semantic-owner/realization-owner routing without authority amplification.
7. **Normalization / Adoption Proposal Plane** — governed proposals when observed reality may legitimately become canonical.
8. **Residual Cohort & Federation Plane** — local/Station/Fleet divergence, offline evidence and old authoritative populations.
9. **Queue / Capacity / Operability Plane** — bounded reconciliation work, backlog, age, retries and headroom.
10. **Closure / Reopen / Proof Plane** — scoped terminal dispositions, evidence-backed closure and currentness-triggered reopen.

## 4. Canonical reconciliation identities

**DECISION C3.28-D2 — reconciliation records reference owner truths; they never copy observed state into a new universal source of truth.**

Canonical identities include, as applicable:

- `ReconciliationSubjectId`;
- `ReconciliationAssessmentId` and immutable assessment revision;
- `ComparisonProfileId` / immutable revision;
- `DesiredRevisionVector`;
- `ObservedEvidenceSetId`;
- `DriftRecordId`;
- `EffectDispositionId`;
- `OwnerRoutingRecordId`;
- `NormalizationAdoptionProposalId`;
- `ResidualReconciliationCohortId`;
- `ReconciliationClosureClaimId`;
- `ReconciliationReopenRecordId`.

A subject identifies semantic owner, canonical subject reference, applicability scope, intended revision vector, relevant realization/binding coordinates, comparison profile and evidence horizon. Provider/external identifiers remain realization references unless the semantic owner authorizes adoption.

## 5. Graph- and vector-qualified drift

**DECISION C3.28-D3 — drift is a typed relation over explicit dimensions, not a boolean or scalar health score.**

A comparison may produce `CONFORMANT`, `DRIFTED`, `PARTIAL`, `INCONCLUSIVE` or `BLOCKED` for each relevant dimension. Drift classes include missing realization, unexpected realization, incompatible revision, stale realization, unauthorized realization, unsupported realization, residual old cohort, evidence mismatch, ambiguous effect, graph-topology mismatch, semantic-value mismatch and applicability mismatch.

Graph comparisons preserve node/edge identity, semantic owner, revision and relation type. Vector comparisons preserve dimensions independently: one conformant dimension cannot average away a critical drift in another.

`aggregate healthy != all dimensions conformant`.

A drift signal remains evidence requiring qualification. It is not automatically a `ConflictInstance`; confirmed conflict requires the applicable contradiction/conflict rules and evidence threshold of the owning semantics.

## 6. Evidence, currentness and uncertainty

**DECISION C3.28-D4 — every reconciliation conclusion is evidence-horizon qualified.**

Evidence preserves subject, producer, producing revision, observation/event/ingestion/evaluation times where relevant, applicability scope, population/cohort coverage, provenance, support profile, uncertainty, completeness and supersession lineage.

Missing, stale, partial, contradictory or incorrectly scoped evidence yields `PARTIAL`, `INCONCLUSIVE` or `BLOCKED`; never implicit PASS. Historical evidence remains replayable against producing revisions but cannot silently prove current conformance.

Currentness is dimensional. A provider binding can be current while local runtime state is stale; a Fleet aggregate can be current while one Station is unknown.

## 7. Ambiguous effects and reconcile-before-retry

**DECISION C3.28-D5 — UNKNOWN remote or distributed mutation effects create a reconciliation obligation before unsafe retry unless idempotency is explicitly qualified for the same subject/revision/scope.**

The plane may correlate receipts, provider state, runtime evidence, domain postconditions and lineage to classify the prior attempt as `APPLIED`, `NOT_APPLIED`, `PARTIAL` or still `UNKNOWN`. It does not acquire mutation authority by performing this classification.

Retry, compensation, rollback, correction or reissue remains owned by the capability that owns the operation and its authority.

## 8. Ownership, routing and non-amplification

**DECISION C3.28-D6 — reconciliation routes; it does not remediate by default.**

Each drift record identifies semantic owner, realization owner where distinct, required authority, blocked artifacts/workflows and proof obligations. Enterprise → Station → Role → Person remains monotonic. Reconciliation visibility or access to a remediation surface does not grant permission to change the underlying truth.

If no authorized owner is available, the record remains open/blocked. Architecture Reconciliation cannot manufacture authority, weaken policy, waive governance, mutate schema, redeploy runtime or actuate physical systems to make its own dashboard green.

## 9. Governed normalization and adoption

**DECISION C3.28-D7 — observed/provider state may become canonical only through an explicit adoption proposal decided by the semantic owner.**

A proposal records source evidence, observed semantics, intended canonical mapping, revision vector, uncertainty, affected artifacts, migration/coexistence implications and required authority. Approval creates a new owner-controlled canonical revision; it does not rewrite history.

Brownfield/Legacy Mirroring uses the same rule: discovered configuration, data, process, ACL, provider state or tacit practice enters as `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Conflict`, `Unknown` or other C1 epistemic class as appropriate. Mirrored observation is not desired architecture by default.

AI may propose normalization, mappings and likely owners. `AI inference = candidate`, never authority.

## 10. Local / Station / Fleet / federation semantics

**DECISION C3.28-D8 — reconciliation is locality-aware and federation-safe.**

Local runtime/Station evidence remains locally scoped until federation qualification. Fleet views preserve per-member currentness, evidence coverage, revision vector and unresolved cohorts. A healthy aggregate cannot prove a disconnected or stale Station converged.

Offline operation may produce locally authoritative evidence for its declared scope. Reconnection creates reconciliation work: evidence merge, revision crossing, conflict detection, residual cohort discovery and owner routing. It does not authorize latest-wins normalization.

## 11. Provider substitution and residual cohorts

**DECISION C3.28-D9 — provider substitution remains open until intended populations are reconciled and residual authoritative cohorts are explicitly drained, accepted or dispositioned.**

Coexisting providers may differ in feature support, semantics, timing, identity and observation quality. Reconciliation compares against portable semantic obligations and provider support profiles; it never infers equivalence from similarly named features.

Residual resources, messages, identities, sessions, data copies, old deployments, credentials, policies or economic records can keep closure open when still applicable.

## 12. Queueing, backpressure and reconciliation capacity

**DECISION C3.28-D10 — reconciliation is an operational workload with bounded capacity, not a free background assumption.**

Production evidence includes arrival rate of reconciliation obligations, queue depth and age, service/reconciliation time, retry/redrive rate, blocked-owner age, provider quota pressure, reconnect bursts, residual-cohort age and headroom. Priority must preserve critical/security/privacy/authority-sensitive work without starving lower classes indefinitely.

`low queue depth != low reconciliation debt` when age, hidden populations or blocked owners are material.

Overload cannot convert `UNKNOWN` to success, silently drop drift, broaden stale horizons or suppress critical gaps to preserve apparent health.

## 13. Closure, reopen and supersession

**DECISION C3.28-D11 — closure is scoped, revision-qualified and revocable by new applicability/currentness facts.**

Closure requires an explicit comparison scope and current qualified evidence for the allowed terminal disposition. Remediation request accepted is insufficient. Where applicable, effective state, convergence, semantic validation and residual-cohort drainage must be evidenced.

A prior closure reopens when material desired revisions, provider/binding changes, applicability changes, evidence expiry, corrected evidence, newly discovered populations or contradiction findings invalidate its proof horizon.

Correction and supersession preserve the original assessment/evidence lineage; history is never rewritten to make prior conclusions appear stronger than they were.

## 14. C1 Elicitation Lens for Architecture Reconciliation

**DECISION C3.28-D12 — Architecture Reconciliation receives a capability-specific adaptive Elicitation Lens coordinated by C1.**

Questions must discover at least:

- what canonical/desired truths exist and who owns each;
- what observed/effective states exist and who produces their evidence;
- which revision vectors and applicability scopes matter;
- what constitutes conformance, drift, partial evidence and inconclusive state;
- what evidence is expected and how current/complete it must be;
- which populations/cohorts/sites/providers can remain hidden;
- what UNKNOWN effects can occur and how they are reconciled safely;
- who can normalize/adopt observed state and who can remediate;
- which local/Station/Fleet divergences are acceptable and for how long;
- what provider substitutions/coexistence modes exist;
- expected/peak reconciliation load, queue/backlog/age, quotas and headroom;
- ownership/escalation/on-call for blocked or stale reconciliation;
- what evidence proves closure and what events force reopen;
- which HIGH/CRITICAL unanswered questions block abstraction, architecture, implementation or publish/operation.

Follow-ups are triggered by ambiguity, contradiction, stale evidence, missing owner, partial population, unexplained N/A, residual cohort, UNKNOWN effect or cross-capability routing. A textual answer alone never marks the dimension `RESOLVED`.

## 15. Production Readiness Coverage

**DECISION C3.28-D13 — reconciliation readiness is multidimensional and separate from feature completeness.**

Coverage includes at least subject inventory, owner coverage, comparison-profile coverage, evidence/currentness, contradiction handling, local/Fleet coverage, UNKNOWN handling, queue/capacity, residual cohorts, provider substitution, security/privacy, audit/provenance, recovery/reopen, operational ownership and proof/acceptance.

States remain `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`, each with evidence/currentness. No averaged score may hide a HIGH/CRITICAL gap.

Separate gates remain: sufficient for abstraction, candidate architecture, implementation, and publish/operation. None means absolute completeness.

## 16. Planning D constraints carried forward

Planning D must later preserve incremental coexistence between current repository/document reconciliation and structured records; free-form findings/ADRs/reviews must remain readable while structured subjects/evidence/drift/routing are introduced. Provenance backfill must be bounded: unknown historical evidence, owner, currentness or revision data stays unknown rather than fabricated. Migration must not centralize domain truth in the reconciliation subsystem.

This section is a constraint only; Planning D is not executed here.

## 17. Planning E proof candidates

Planning E must later define product proofs for at least:

1. observed state cannot silently overwrite canonical truth;
2. stale/partial evidence cannot produce false conformance;
3. drift signal is not promoted automatically to confirmed conflict;
4. graph mismatch preserves node/edge/revision identity;
5. vector drift cannot be hidden by aggregate health;
6. UNKNOWN effect blocks unsafe retry absent qualified idempotency;
7. owner routing does not grant remediation authority;
8. normalization/adoption requires semantic-owner authority and preserves lineage;
9. Fleet aggregate cannot hide a stale/non-converged Station;
10. offline reconnect does not use silent latest-wins;
11. provider substitution preserves support differences and residual cohorts;
12. residual authoritative cohorts can keep closure open;
13. reconciliation overload cannot drop critical drift or turn unknown into success;
14. closure requires evidence beyond remediation ACK;
15. stale closure reopens on material revision/currentness/applicability change;
16. Brownfield observed practice remains evidence/candidate until governed adoption;
17. AI proposals cannot manufacture evidence, authority or PASS;
18. HIGH/CRITICAL elicitation gaps block false `complete`;
19. Physical/Peripheral reconciliation does not create generic actuation authority;
20. repository-first review/ADR evidence can coexist with structured reconciliation without historical fabrication.

This section records proof obligations only; Planning E is not executed here.

## 18. Non-goals

Architecture Reconciliation is not a universal CMDB, policy engine, telemetry store, deployment controller, migration engine, incident manager, compliance authority, recovery controller, workflow engine, provider controller, data owner or physical control plane. It does not create a universal architecture score and does not repair systems merely because it detects drift.

## 19. C3.28 decision

**PASS_FOR_CAPABILITY / TARGET_ARCHITECTURE_DECIDED.**

Architecture Reconciliation becomes a bounded cross-capability semantic plane for revision-qualified desired-versus-observed comparison, multidimensional drift, evidence/currentness/uncertainty, ambiguous-effect classification, owner routing, governed normalization/adoption proposals, local/Fleet/provider coexistence, residual cohorts, queue/capacity and evidence-backed closure/reopen. It preserves every domain owner's truth and every realization owner's actuation boundary.

C3 target-architecture capability coverage is now **28/28 by decision artifact**, but this artifact does **not** close Planning C. A separate anti-stale state/head reconciliation must decide whether Planning C may be closed and whether the next ordered phase may begin.