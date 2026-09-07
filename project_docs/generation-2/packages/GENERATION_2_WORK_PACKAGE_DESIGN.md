# Generation 2 — Work Package Design

Status: `WORK_PACKAGE_DESIGN / DESIGNED / PASS_FOR_HANDOFF`

Authority: `RESEARCH_PIPELINE_STATE.json` with `WBS_DECOMPOSITION` and `WBS_DEPENDENCY_GRAPH` already `CLOSED / PASS`. This artifact groups the 26 WBS planning nodes into non-executive Work Package design units. It does **not** authorize Work Package execution, executive TASKs, Construction, product code, migrations, executable tests, deployment, or remediation.

## 1. Package-design constitution

Every package inherits the following constraints without modification:

- preserve all 28 canonical capability ownership boundaries; package grouping never merges semantic owners and creates no 29th capability;
- preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, and `Signal != ConfirmedConflict`;
- preserve the hybrid, versioned, auditable Elicitation Knowledge Base as cross-cutting infrastructure, not a static questionnaire and not a canonical capability;
- preserve Typed Semantic Graph, identity/revision/currentness, provenance/lineage, Inter-System/Federated Graph, local/Station/Fleet truth boundaries, and graph-transformation non-strengthening;
- preserve `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, producing-revision pinning, effect identity, workflow soundness/completion proof domains, `PARTIAL/UNKNOWN`, and `UNKNOWN -> reconcile-before-retry`;
- preserve mathematical/rule/analytical semantics including units/dimensions, precision/rounding, temporal windows, vectors/bases, uncertainty and causal non-promotion;
- preserve source-of-truth movement as explicit coexistence/cutover/reconciliation with fencing, residual cohorts and finite drainage;
- preserve provider qualification: feature-name/API/protocol parity is not semantic equivalence, trust, admission, authority or currentness;
- keep Physical/Peripheral strictly in the integration/governance plane; no package may infer generic direct physical actuation authority;
- preserve finite queue/capacity/backpressure and residual-drainability obligations;
- keep Product Proof obligations distinct from executed proof, and Production Readiness Coverage distinct from feature completeness;
- package closure is planning closure only. `DESIGNED` or `HANDOFF_READY` never means implemented, verified in product, deployed or production-ready.

## 2. Package boundary rules

A Work Package design unit is a bounded planning container with: WBS ownership references, typed entry prerequisites, allowed concurrency, explicit exclusions, carried proof obligations, and closure evidence requirements. WBS nodes remain the semantic planning authorities inside each package.

Package edges inherit the nine authorized dependency kinds:

`SEMANTIC_PREREQUISITE`, `AUTHORITY_PREREQUISITE`, `REVISION_PREREQUISITE`, `EVIDENCE_PREREQUISITE`, `PROVIDER_PREREQUISITE`, `DATA_PREREQUISITE`, `OPERABILITY_PREREQUISITE`, `TRUST_PREREQUISITE`, `LOCALITY_PREREQUISITE`.

A package edge constrains planning/closure. It does not require a false total execution sequence. Packages may overlap in discovery, interface drafting and proof-design work when closure-precedence dependencies remain respected.

## 3. Designed Work Packages

### G2-WP-01 — Semantic Constitution & Federated Revision Base

**WBS ownership:** `G2-WBS-01`.

**Purpose:** establish the common semantic substrate needed by all later package contracts: stable identity, typed graph semantics, revision/currentness, evidence/provenance, temporal coordinates, inter-system/federated graph and local/Station/Fleet truth boundaries.

**Entry:** Architecture/WBS chain already CLOSED/PASS.

**Closure obligations:** stable semantic identity under external/provider churn; immutable/historically addressable revisions; population/locality-qualified currentness; owner-preserving/non-strengthening graph transformations; federation cannot strengthen remote claims.

**Excludes:** domain-specific authorization, provider mechanics, workflow behavior, implementation.

### G2-WP-02 — Elicitation Knowledge Base & System Understanding

**WBS ownership:** `G2-WBS-02`.

**Purpose:** carry the versioned capability-aware/context-aware EKB, adaptive questioning, evidence/currentness, contradiction ledger, negative-space discovery, stakeholder coverage, semantic routing, derived story/use-case/scenario/requirement/proof traceability and dimensional sufficiency.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`.

**Mandatory model boundaries:** `QuestionDefinition != QuestionOccurrence`; `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope`, `Deferred` remain distinct; `AI inference = candidate`; `observed behavior != intended process != approved canonical process`.

**Closure obligations:** adaptive follow-ups are gap/context-driven; unresolved contradictions have owner/evidence/decision route; HIGH/CRITICAL gaps prevent false complete; coverage uses dimensional states rather than scalar quality; capability-specific lenses route answers without duplicating semantic ownership.

### G2-WP-03 — Mathematical, Rule, Temporal, Vector & Uncertainty Semantics

**WBS ownership:** `G2-WBS-22`.

**Purpose:** define portable cross-cutting analytical semantics used by data, execution, capacity, AI, governance, commercial and FinOps domains.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`; `WP-02 [EVIDENCE_PREREQUISITE]` for purpose/input/unit/uncertainty discovery.

**Closure obligations:** dimensional consistency; explicit basis/order for vectors; precision/rounding and temporal windows; uncertainty/UNKNOWN preserved; transforms preserve provenance/revision/owner; `correlation != causation` and causality remains research-only.

### G2-WP-04 — Identity, Authorization, Trust, Secrets & Recovery

**WBS ownership:** `G2-WBS-03`, `G2-WBS-04`.

**Purpose:** bind identity/authentication/federation/authorization to trust/PKI/secrets/config/security/recovery without collapsing their ownership boundaries.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, LOCALITY_PREREQUISITE]`; `WP-02 [EVIDENCE_PREREQUISITE, AUTHORITY_PREREQUISITE]` for unresolved authority discovery.

**Internal partial order:** WBS-03 authority contract precedes WBS-04 closure for authority over trust/config material; WBS-04 qualifies authentication/federation/session trust realization without becoming owner of authorization semantics.

**Closure obligations:** `authentication != authorization`; no authority amplification through delegation/break-glass/provider mapping; revocation/deprovision drains sessions/tokens/caches/offline cohorts; rotation/recovery cannot resurrect stale authority; desired config != consumer-effective config.

### G2-WP-05 — Canonical Data, Schema & Source-of-Truth Migration

**WBS ownership:** `G2-WBS-05`.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, DATA_PREREQUISITE]`; `WP-02 [EVIDENCE_PREREQUISITE]`; `WP-03 [SEMANTIC_PREREQUISITE]`; `WP-04 [AUTHORITY_PREREQUISITE, TRUST_PREREQUISITE]` where applicable.

**Purpose:** directional schema compatibility, historical/current populations, reader/writer coexistence, source-of-truth fencing, backfill/CDC/dual-write boundaries and units/precision/presence semantics.

**Closure obligations:** `ABSENT != NULL != DEFAULT != DELETE`; dual-write never creates two canonical truths; migration success != convergence; backfill/CDC preserve lineage; source-of-truth transfer is explicit and residual cohorts remain visible.

### G2-WP-06 — Provider, Brownfield & Bounded Physical/Peripheral Integration

**WBS ownership:** `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10`.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`; `WP-02 [EVIDENCE_PREREQUISITE]`; `WP-04 [AUTHORITY_PREREQUISITE, TRUST_PREREQUISITE]`; `WP-05 [DATA_PREREQUISITE]` for structured legacy assimilation.

**Internal partial order:** provider semantic qualification may proceed alongside Brownfield discovery, but Brownfield adoption cannot close without applicable domain/source-of-truth mappings; Physical/Peripheral integration cannot close without provider, authority, trust, locality and operability qualification.

**Closure obligations:** support vectors remain multidimensional; provider substitution/coexistence has cutover and residual drainage; observed legacy behavior remains evidence/candidate until disposition; external-ID reuse cannot reconnect history; Station/Fleet aggregation cannot replace local truth; no generic physical actuation semantics are introduced.

### G2-WP-07 — Durable Execution, Storage & Finite-Flow Semantics

**WBS ownership:** `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11`.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`; `WP-03 [SEMANTIC_PREREQUISITE]`; `WP-04 [AUTHORITY_PREREQUISITE, TRUST_PREREQUISITE]`; `WP-05 [DATA_PREREQUISITE]`; `WP-06 [PROVIDER_PREREQUISITE]` for provider-backed storage.

**Purpose:** durable workflow/external-effect semantics; document/media identity and provider copies; queue/capacity/backpressure/replay/drainage as a finite-flow constraint plane.

**Closure obligations:** in-flight work retains producing revision; effect identity != attempt/delivery identity; unsafe `UNKNOWN` requires reconciliation before retry; idempotency scope/horizon is explicit; canonical document/object identity does not collapse to provider key/hash; queue capacity is units/population qualified and demonstrably drainable under declared assumptions.

### G2-WP-08 — Messaging, Events, Notifications & Integration Automation

**WBS ownership:** `G2-WBS-07`.

**Typed prerequisites:** `WP-06 [PROVIDER_PREREQUISITE]`; `WP-07 [SEMANTIC_PREREQUISITE, EVIDENCE_PREREQUISITE, OPERABILITY_PREREQUISITE]`.

**Purpose:** event/message/subscription/delivery semantics, replay/DLQ, callbacks, integration mappings, provider coexistence and offline buffering.

**Closure obligations:** provider ACK != business effect; ordering scope/epoch explicit; replay preserves producing revision and occurrence lineage; batch partiality remains visible; residual subscriptions/messages/callbacks drain before closure.

### G2-WP-09 — Reproducible Build, Artifact Supply & Autonomous Deployment

**WBS ownership:** `G2-WBS-12`, `G2-WBS-13`, `G2-WBS-14`.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`; `WP-04 [TRUST_PREREQUISITE]`; `WP-05 [DATA_PREREQUISITE]` for schema/data rollout compatibility; `WP-06 [PROVIDER_PREREQUISITE, LOCALITY_PREREQUISITE]`; `WP-07 [OPERABILITY_PREREQUISITE]`.

**Internal partial order:** build/material closure -> canonical artifact/release adoption -> deployment/runtime realization, while interface/proof design may overlap.

**Closure obligations:** declared/resolved/fetched dependencies remain distinct; build success != reproducibility; build output != canonical artifact; signature != trust/admission; deployment ACK != effective/converged runtime; rollback availability != semantic reversibility; residual runner/registry/runtime cohorts remain tracked to drainage/reconciliation.

### G2-WP-10 — Generated Experience & AI-Mediated Assistance

**WBS ownership:** `G2-WBS-15`, `G2-WBS-16`.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE]`; `WP-02 [EVIDENCE_PREREQUISITE]`; `WP-03 [SEMANTIC_PREREQUISITE]` for AI-proposed analytical structures; `WP-04 [AUTHORITY_PREREQUISITE, TRUST_PREREQUISITE]`; `WP-05 [DATA_PREREQUISITE]`; `WP-06 [PROVIDER_PREREQUISITE]`; `WP-07 [SEMANTIC_PREREQUISITE, OPERABILITY_PREREQUISITE]`.

**Closure obligations:** projection != truth; visibility != authority; generated UI cannot strengthen authority/status; stale/unknown/conflicted states remain representable; AI output remains candidate until governed disposition; summaries preserve negation/contradiction; generated artifacts retain source/evidence/revision lineage.

### G2-WP-11 — Observability, Incident, Reconciliation & Operator Surfaces

**WBS ownership:** `G2-WBS-17`, `G2-WBS-18`.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, EVIDENCE_PREREQUISITE]`; `WP-04 [AUTHORITY_PREREQUISITE, TRUST_PREREQUISITE]`; `WP-06 [LOCALITY_PREREQUISITE, EVIDENCE_PREREQUISITE]`; `WP-07 [EVIDENCE_PREREQUISITE, OPERABILITY_PREREQUISITE]`; `WP-08 [EVIDENCE_PREREQUISITE]`; `WP-09 [LOCALITY_PREREQUISITE, OPERABILITY_PREREQUISITE, EVIDENCE_PREREQUISITE]`.

**Closure obligations:** `Signal != ConfirmedConflict`; signal != condition != alert != incident; telemetry gaps/currentness visible; reconciliation evidence population-qualified; command/API/job ACK != converged effect; emergency/manual operator paths preserve authority/evidence and reconnect reconciliation.

### G2-WP-12 — Governance, Privacy, Commercial & FinOps Derivations

**WBS ownership:** `G2-WBS-19`, `G2-WBS-20`, `G2-WBS-21`.

**Typed prerequisites:** `WP-01 [SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, EVIDENCE_PREREQUISITE]`; `WP-03 [SEMANTIC_PREREQUISITE]`; `WP-04 [AUTHORITY_PREREQUISITE]`; `WP-06 [PROVIDER_PREREQUISITE]`; `WP-07 [OPERABILITY_PREREQUISITE, DATA_PREREQUISITE]`; `WP-11 [EVIDENCE_PREREQUISITE]`.

**Internal partial order:** governance/privacy evidence and authority boundaries constrain commercial semantics; qualified commercial/provider/capacity evidence can then feed FinOps derivations. Analytical mechanics remain owned by WP-03 rather than duplicated here.

**Closure obligations:** `policy != decision != enforcement != evidence != assessment`; absence of evidence != compliance; waivers bounded by authority/scope/expiry; commercial entitlement != operational authorization; measured != qualified != rated != billed != invoiced != paid; missing usage != zero; provider invoice != normalized cost evidence != customer-commercial truth; allocation conserves qualified cost and no universal scalar quality/risk/complexity score is introduced.

### G2-WP-13 — Product Proof, Production Readiness & Architecture Reconciliation

**WBS ownership:** `G2-WBS-24`, `G2-WBS-25`, `G2-WBS-26`.

**Typed prerequisites:** evidence/proof contributions from `WP-01..WP-12`; operability evidence from `WP-07`, `WP-09`, `WP-11`; governance/readiness constraints from `WP-12`. Exact producer-owned proof ownership remains at source packages.

**Purpose:** close traceability of Product Proof obligations, separate multidimensional Production Readiness Coverage, and perform final architecture-level reconciliation/routing without becoming a semantic god-object.

**Closure obligations:** evidence is revision/population/currentness/locality qualified; positive, negative, adversarial and recovery proofs remain distinguishable; Elicitation Evidence -> Finding/Answer -> Requirement/Constraint -> Story/Use Case/Scenario -> Semantic Model -> Capability/Workflow/Data/etc. -> Acceptance Criterion -> Product Proof -> Runtime Evidence traceability is representable; readiness dimensions remain independent; reconciliation may route gaps/conflicts to owners but cannot silently remediate, strengthen or canonicalize them.

## 4. Package-level partial order and concurrency

The design deliberately avoids a total sequence.

**Constitutional entry:** `WP-01`.

**Early parallel lane after WP-01 contracts stabilize:** `WP-02`, `WP-03`, and authority-contract work inside `WP-04` may elaborate concurrently. WP-04 closure remains trust/authority mutually qualified as described above.

**Foundation realization lane:** `WP-05` and provider-qualification portions of `WP-06` may proceed with typed prerequisites satisfied. Brownfield discovery in WP-06 may start early, but canonical adoption waits for its domain owners.

**Execution/supply lanes:** `WP-07` and qualified provider portions of `WP-06` unlock `WP-08`; `WP-09` can elaborate build interfaces once its prerequisites are stable, while deployment closure waits on artifact/data/provider/operability contracts.

**Experience lane:** `WP-10` may elaborate projections and AI/Wizard contracts against stable semantic/EKB/authority/domain interfaces without waiting for every downstream package to close.

**Operations/governance lane:** `WP-11` consumes runtime/effect/locality evidence; `WP-12` may elaborate governance/economic schemas early but cannot close claims whose evidence/operability prerequisites remain open.

**Closure lane:** `WP-13` is a proof/readiness/reconciliation sink. Proof definitions may be authored alongside source packages, but final closure cannot precede producer-owned evidence routes and readiness dispositions.

No line above authorizes simultaneous implementation or execution. It defines only safe planning concurrency and closure precedence.

## 5. Cross-package Elicitation obligations

Every package must expose an `elicitation_lens_ref` rather than hardcoding a monolithic questionnaire. The lens must support:

- Universal plus capability/object-specific questions selected by context and prior answers;
- question provenance: triggering gap, purpose, blocked artifacts and semantic owner;
- metadata including `question_id`, purpose, concepts/capabilities, contexts, preconditions, follow-up rules, ambiguity signals, expected evidence, answer types, contradiction detection, unresolved severity, mandatory/conditional/advisory class and downstream artifacts;
- evidence source/respondent/owner/timestamp/effective period/confidence/status/supporting artifact/supersession lineage;
- multi-source evidence from interviews, workshops, observation, documents, policies, tickets, logs, email/forms/spreadsheets, legacy systems, APIs/databases/telemetry/process mining/Mirroring;
- negative-space routes for shadow spreadsheets, verbal/manual approvals, key-person dependencies, off-system communication, unofficial processes, duplicate controls, emergency procedures and rare high-impact cases;
- explicit contradiction records with owners, evidence, decision route and unresolved status; never a silent winner;
- coverage states `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED` with evidence/currentness;
- distinct sufficiency gates for abstraction, candidate architecture, implementation and publish/operation without claiming absolute completeness;
- unresolved-question routing when an answer semantically belongs to another package/capability, without copying canonical ownership.

Greenfield remains `AI-first + Wizard-validated + Expert-direct`; Brownfield remains `Mirroring-first + AI-assisted + Human-mapped + Wizard-completed`. AI may propose questions, mappings, stories, use cases, scenarios and abstractions, but never becomes authority by inference.

## 6. Critical-gap blockers inherited by package design

A package cannot claim planning closure for an affected object when unresolved material evidence shows, where applicable:

- unknown authority or missing revoke/deprovision semantics;
- ambiguous source-of-truth or uncontrolled source-of-truth movement;
- absent failure/recovery semantics;
- external effect without reconciliation route;
- sensitive data without privacy/security/retention policy;
- workflow without terminal/soundness semantics;
- integration/provider effect without timeout/`UNKNOWN` handling;
- metric/formula without units/currentness/precision semantics;
- historical behavior without producing-revision semantics;
- residual cohort with no disposition/drainage route;
- queue/capacity assumption with no finite-drainability basis;
- Physical/Peripheral integration that would require generic actuation authority not present in the canonical architecture.

## 7. Handoff contract — planning only

The thirteen packages are **design records**, not executable packages. A later handoff/materialization phase, if separately authorized by pipeline state, must derive package-specific planning manifests while preserving:

- WBS-node membership and canonical capability ownership;
- typed entry/closure dependencies and safe concurrency;
- allowed/forbidden scope boundaries;
- Elicitation Lens and unresolved-gap routing;
- migration/coexistence/residual-cohort constraints;
- Product Proof obligations and separate Production Readiness Coverage;
- explicit `NOT EXECUTED` state until a future authority independently permits execution.

No executive TASK IDs, code paths, Construction instructions or executable test commands are created here.

## 8. Design result

`PASS_FOR_HANDOFF`.

All 26 WBS planning nodes are covered exactly by the thirteen non-executive Work Package design units:

- WP-01: 01
- WP-02: 02
- WP-03: 22
- WP-04: 03,04
- WP-05: 05
- WP-06: 09,10,23
- WP-07: 06,08,11
- WP-08: 07
- WP-09: 12,13,14
- WP-10: 15,16
- WP-11: 17,18
- WP-12: 19,20,21
- WP-13: 24,25,26

Coverage is complete with no duplicated WBS ownership. Cross-cutting references do not transfer semantic ownership. WORK_PACKAGE_DESIGN may therefore close as planning-only and authorize only the next repository-memory/handoff phase defined by `RESEARCH_PIPELINE_STATE.json`; it does not authorize Work Package execution.