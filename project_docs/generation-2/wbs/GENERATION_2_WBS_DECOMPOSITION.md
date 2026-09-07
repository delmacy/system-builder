# Generation 2 — WBS Decomposition

Status: `WBS_DECOMPOSITION / DECOMPOSED / PASS_FOR_ENTRY`

Authority: `RESEARCH_PIPELINE_STATE.json` at branch head `8fda7474a7a347d4face20df6862be7402bc8f51`, with Architecture Reconciliation `CLOSED / PASS`.

This artifact decomposes the CLOSED/PASS Generation 2 architecture into planning work. It does **not** authorize implementation, Work Packages, executive TASKs, Construction, product code, executable tests, or the WBS dependency-graph phase.

## 1. Constitutional constraints inherited by every WBS item

Every item below inherits these non-negotiable constraints:

- preserve the 28 canonical capability ownership boundaries; no 29th capability is created;
- the hybrid, versioned, auditable Elicitation Knowledge Base is cross-cutting infrastructure;
- `answered != understood`; stakeholder claim, observed behavior, user story, use case, acceptance criterion and AI inference do not become canonical truth by implication;
- elicitation coverage is dimensional (`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | DEFERRED | NA`), never a scalar completeness score;
- HIGH/CRITICAL unresolved elicitation gaps or contradictions without disposition prohibit false-complete;
- preserve Typed Semantic Graph/Execution, semantic identity/revision, `ExecutionEnvelope`, `ExecutionState`, `ExecutionJournal`, control-flow/workflow proof domains, provenance/evidence/currentness and historical producing revisions;
- preserve mathematical, units, vector, uncertainty, temporal and graph-transformation semantics; causality remains research-only;
- preserve `PARTIAL/UNKNOWN`, `UNKNOWN -> reconcile-before-retry`, scoped idempotency, source-of-truth movement, coexistence and residual cohorts;
- provider availability/feature-name parity does not imply qualification or semantic equivalence;
- Physical/Peripheral remains a bounded integration/governance plane and does not create generic actuation authority;
- queue/capacity claims require finite drainability under declared assumptions;
- Product Proof traceability remains separate from executed proof; Production Readiness Coverage remains a separate multidimensional gate;
- `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`.

## 2. WBS hierarchy

The decomposition uses `G2-WBS-xx` planning IDs. These IDs are decomposition nodes, **not TASK IDs** and not execution authorization.

### G2-WBS-01 — Semantic substrate, revision and graph constitution

**Scope:** canonical semantic identity/revision model; typed nodes/edges; graph invariants; temporal/currentness coordinates; provenance/evidence references; inter-system/federated graph semantics; local/Station/Fleet truth boundaries.

**Dependencies to carry:** Architecture Reconciliation; Planning C C0; D0/D1; E1.

**Proof obligations:** identity survives provider/external-ID churn; revisions are immutable/historically addressable; currentness is population/locality qualified; graph transformations are owner-preserving/non-strengthening; federation does not strengthen remote claims.

### G2-WBS-02 — Elicitation Knowledge Base and adaptive understanding

**Scope:** QuestionDefinition/QuestionOccurrence; Fact/Assumption/InferredCandidate/Requirement/Policy and disposition semantics; stakeholder/source/provenance/currentness; contradiction ledger; adaptive follow-up/routing; capability-specific elicitation lenses; negative-space discovery; stage sufficiency for abstraction/architecture/implementation/publish-operation.

**Dependencies to carry:** G2-WBS-01 semantics; C1; D1; E1.

**Proof obligations:** no false-complete with HIGH/CRITICAL unresolved gaps; no inference promotion without governed transition; contradiction survives summarization; `OutOfScope != NotApplicable`, `Deferred != Resolved`; cross-capability question ownership is explicit; story/use-case/scenario/workflow/permission/data/acceptance claims can be consistency-checked.

### G2-WBS-03 — Identity, authentication, federation and authorization

**Scope:** canonical principals/subjects; external identity mappings; authentication/session/federation; authorization decisions; delegation; break-glass; SoD; tenant/site/Fleet authority boundaries; revoke/deprovision.

**Dependencies to carry:** G2-WBS-01; G2-WBS-02 critical authority elicitation; trust prerequisites from G2-WBS-04.

**Proof obligations:** `authentication != authorization`; provider identity does not become canonical identity; delegation/break-glass cannot amplify authority; revoke/deprovision drains sessions/tokens/caches/offline cohorts; historical decisions retain producing revisions.

### G2-WBS-04 — Trust, PKI, secrets, configuration, security and recovery

**Scope:** trust domains/anchors; key/certificate/credential lifecycle; secrets/config desired/effective state; degraded-mode authority; fencing/epochs; backup/restore/recovery cuts; residual security/trust cohorts.

**Dependencies to carry:** G2-WBS-01; G2-WBS-03 authority; provider qualification from G2-WBS-09 where realization is external.

**Proof obligations:** cryptographic validity does not imply trust/authorization; rotation/revocation converges over declared populations; restore cannot resurrect stale authority/trust; degraded operation cannot expand authority; backup existence does not prove restorable/current service.

### G2-WBS-05 — Data, schema, migration and canonical persistence semantics

**Scope:** schema identity/revision; directional compatibility; reader/writer coexistence; source-of-truth fencing; backfill/CDC/dual-write boundaries; units/precision/null/delete/default semantics; historical/current populations.

**Dependencies to carry:** G2-WBS-01; G2-WBS-02 data elicitation; G2-WBS-03/04 authority/trust where applicable.

**Proof obligations:** old/new readers/writers have explicit compatibility; source-of-truth movement is explicit; dual-write never implies two canonical truths; backfill/CDC preserve lineage; lossiness/default/unit transformations are qualified.

### G2-WBS-06 — Workflow, durable execution and external-effect semantics

**Scope:** workflow definition/revision; durable execution; `ExecutionEnvelope/State/Journal`; in-flight revision pinning; effect identity; retry/compensation/recovery; reconciliation; partial outcomes.

**Dependencies to carry:** G2-WBS-01; G2-WBS-05; G2-WBS-03/04.

**Proof obligations:** in-flight work is not silently reinterpreted by latest revision; `accepted != processed != converged`; effect identity is separate from attempt/delivery identity; `UNKNOWN -> reconcile-before-retry`; idempotency is qualified by key authority, scope, payload equivalence and retention horizon.

### G2-WBS-07 — Messaging, events, notifications and integration automation

**Scope:** producer/source/subject/subscription semantics; event/message/delivery/attempt identity; ordering/partition/epoch; replay/DLQ; callbacks; integration mappings; provider coexistence; offline buffering.

**Dependencies to carry:** G2-WBS-06 effect semantics; G2-WBS-09 provider bindings; G2-WBS-11 queue/capacity.

**Proof obligations:** provider ACK is not business effect; replay preserves producing revision and occurrence lineage; batch partiality is visible; ordering scope is explicit; residual subscriptions/messages/callbacks drain before closure.

### G2-WBS-08 — Storage, documents and media

**Scope:** canonical object identity; content identity; logical/metadata revisions; provider realizations/copies; multipart/resumable/offline transfer; dedup; retention/hold/residency; disposition.

**Dependencies to carry:** G2-WBS-01; G2-WBS-04 security/trust; G2-WBS-09 provider qualification; G2-WBS-11 capacity.

**Proof obligations:** object key/hash/provider copy do not collapse canonical identity; upload ACK does not prove durable/integrity-qualified availability; dedup does not merge authority/lifecycle; deletion/disposition covers all qualified populations and residual copies.

### G2-WBS-09 — Provider, binding, standards and interoperability

**Scope:** discovery/advertisement/qualification/admission/binding/effective realization; multidimensional support vectors; API/schema/protocol contract revisions; directional compatibility; provider substitution/coexistence; residual provider cohorts.

**Dependencies to carry:** G2-WBS-01 semantic contracts; G2-WBS-03/04 authority/trust; G2-WBS-02 provider elicitation.

**Proof obligations:** feature-name/API parity does not prove semantic equivalence; support is multidimensional and can be PARTIAL/INCONCLUSIVE; admission is separate from technical support; external-ID reuse cannot reconnect history; substitution requires cutover, validation and residual-cohort drainage.

### G2-WBS-10 — Bounded Physical / Peripheral integration and site/fleet operations

**Scope:** device/peripheral identity and integration metadata; local site/Station operation; Fleet aggregation; offline closure; telemetry/control integration boundaries; provider/device binding without generic actuation semantics.

**Dependencies to carry:** G2-WBS-03/04 authority/security; G2-WBS-09 provider/binding; G2-WBS-11 operability/capacity.

**Proof obligations:** Fleet aggregate does not replace local truth; offline Station authority/currentness is qualified; device integration does not invent generic actuation authority; physical effects preserve external-effect reconciliation and safety boundaries.

### G2-WBS-11 — Queueing, capacity, backpressure and finite convergence

**Scope:** queue identities/populations; arrival/service assumptions; backpressure; admission/rate/limit semantics; replay/recovery horizons; residual cohort drainage; capacity evidence.

**Dependencies to carry:** G2-WBS-01 units/time; all queue-producing capabilities.

**Proof obligations:** capacity is units-bearing and population-qualified; finite drainability is demonstrated under declared assumptions; backlog/telemetry loss is not hidden by aggregates; recovery/replay cannot create unbounded duplicate work.

### G2-WBS-12 — Build, dependency graph and reproducibility

**Scope:** build definition; declared/resolved/fetched dependencies; material identity; toolchain/runner; input boundary; hermeticity/controlled impurity; cache lineage; reproducibility claims.

**Dependencies to carry:** G2-WBS-01 revisions/provenance; G2-WBS-04 secrets/security; G2-WBS-09 provider realization; G2-WBS-11 capacity.

**Proof obligations:** declared/resolved/fetched dependencies remain distinct; cache hit is not provenance/currentness proof; build success is not reproducibility proof; reproducibility claims are revision/environment/population qualified; residual runners/caches drain on substitution.

### G2-WBS-13 — Artifact, release, SBOM, provenance and lifecycle

**Scope:** build-output adoption; canonical release/artifact identity; immutable revisions; SBOM/provenance/attestation; signing; promotion/rollback/withdrawal; registry replication; lifecycle state.

**Dependencies to carry:** G2-WBS-12; G2-WBS-04 trust; G2-WBS-09 provider/registry; G2-WBS-11 capacity.

**Proof obligations:** build output != release != deployed/effective runtime; signature validity != release authorization; SBOM/provenance coverage/currentness is qualified; publication `PARTIAL/UNKNOWN` is reconciled; residual registry copies and withdrawn cohorts remain visible.

### G2-WBS-14 — Deployment, runtime topology and autonomous lifecycle

**Scope:** deployment intent/realization/effective state; environment/site/Station/Fleet topology; rollout/coexistence; rollback/roll-forward; autonomous/self-hosted lifecycle; recovery/currentness.

**Dependencies to carry:** G2-WBS-13; G2-WBS-04; G2-WBS-09; G2-WBS-11.

**Proof obligations:** deployment ACK != effective/converged runtime; rollback availability != semantic reversibility; producing revisions survive rollout; offline/local populations reconcile; residual runtime cohorts drain before closure.

### G2-WBS-15 — UI, low-code and generated experience

**Scope:** UI projection/view-model semantics; low-code authoring; generated experience; governed actions; revision/currentness presentation; user-visible uncertainty/conflict states.

**Dependencies to carry:** G2-WBS-01; G2-WBS-02; G2-WBS-03 authority; domain owners G2-WBS-05/06/08.

**Proof obligations:** projection != truth; visibility != authority; generated UI cannot strengthen permissions or epistemic status; stale/unknown/conflicted state remains representable; story/use-case/acceptance traceability reaches semantic owners.

### G2-WBS-16 — AGWS / AI-mediated generation and assistance

**Scope:** AI gateway/workspace semantics; model/provider binding; prompt/context/evidence provenance; candidate generation; human/owner disposition; safety/currentness; generated artifact traceability.

**Dependencies to carry:** G2-WBS-02 EKB; G2-WBS-03/04 authority/security; G2-WBS-09 provider qualification; G2-WBS-11 capacity/cost signals.

**Proof obligations:** AI output/inference remains candidate until governed disposition; summary does not erase negation/contradiction; provider/model substitution is qualified; AI cannot mark elicitation complete against unresolved critical coverage; generated artifacts preserve source/revision lineage.

### G2-WBS-17 — Observability, incident and reconciliation operations

**Scope:** telemetry/signal/condition/alert/incident identities; SLI/SLO revisions; incident lifecycle; reconciliation jobs; telemetry gaps/currentness; operator evidence.

**Dependencies to carry:** G2-WBS-01; G2-WBS-06 external effects; G2-WBS-11 capacity; domain-specific owners.

**Proof obligations:** `Signal != ConfirmedConflict`; signal != condition != alert != incident; dashboard aggregate cannot hide stale/unknown cohorts; SLI/SLO history is revisioned; telemetry loss/backpressure is explicit; reconciliation evidence is population/currentness qualified.

### G2-WBS-18 — Developer, operator and self-hosting surfaces

**Scope:** CLI/API/admin/operator surfaces; diagnostics; local/self-hosted operation; air-gap/offline procedures; change/recovery workflows; documentation/evidence linkage.

**Dependencies to carry:** G2-WBS-14; G2-WBS-17; G2-WBS-03/04.

**Proof obligations:** command exit/HTTP/job ACK != converged effect; operator surfaces do not bypass authority/evidence; reconnect reconciles revisions/currentness; manual/emergency paths remain auditable and do not become hidden canonical truth.

### G2-WBS-19 — Governance, compliance, audit and privacy/data governance

**Scope:** policy/decision/enforcement/evidence/assessment separation; exceptions/waivers; audit lineage; privacy classifications; retention/legal hold/residency; disposition across copies/exports/backups/analytics/offline populations.

**Dependencies to carry:** G2-WBS-01 provenance/revision; G2-WBS-03 authority; G2-WBS-08 storage populations; G2-WBS-17 evidence.

**Proof obligations:** `policy != decision != enforcement != evidence != assessment`; absence of evidence is not compliance; policy is effective-dated; waivers have authority/scope/expiry; privacy/hold/residency survives provider migration and residual populations.

### G2-WBS-20 — Commercial, monetization and entitlements

**Scope:** product/offer/plan/price/contract/subscription/entitlement/meter/usage/rating/charge/invoice/payment; effective-dated pricing; correction/rerating; settlement/dispute/refund.

**Dependencies to carry:** G2-WBS-01 units/time/revisions; G2-WBS-03 authorization boundary; G2-WBS-09 providers; G2-WBS-11 capacity; G2-WBS-19 governance/privacy.

**Proof obligations:** commercial entitlement != operational authorization; measured != qualified != rated != billed != invoiced != paid; missing usage evidence does not become zero; settlement is qualified evidence, not provider ACK; corrections preserve supersession lineage.

### G2-WBS-21 — Technology Economic Governance / FinOps

**Scope:** normalized cost evidence; provider invoice separation; allocation/shared-cost conservation; budgets/forecasts/commitments; unit economics; showback/chargeback; relative operational complexity as bounded multidimensional profile.

**Dependencies to carry:** G2-WBS-01 units/time; G2-WBS-09 provider evidence; G2-WBS-11 capacity; G2-WBS-20 commercial boundary; G2-WBS-19 governance.

**Proof obligations:** provider invoice != normalized cost evidence != customer-commercial truth; currency/rates/effective time/provenance are explicit; allocation conserves qualified cost including rounding residual; no universal scalar quality/risk/complexity score.

### G2-WBS-22 — Mathematical, rule, analytical, temporal, vector and uncertainty substrate

**Scope:** expression/rule/model identity+revision; typed inputs; units/dimensions; precision/rounding; temporal windows; vector basis/order/dimension; uncertainty; graph transformations; analytical derivations.

**Dependencies to carry:** G2-WBS-01 semantic substrate; source domain owners.

**Proof obligations:** units/dimensions are checked; vector basis/order is not silently lost; UNKNOWN/PARTIAL/INCONCLUSIVE is not coerced to precision; analytical transforms preserve provenance/owner/revision; `correlation != causation`; causality remains research-only.

### G2-WBS-23 — Legacy Mirroring / Brownfield assimilation

**Scope:** discovery of existing systems, shadow systems, spreadsheets, workarounds, manual/verbal procedures, historical data and unofficial exceptions; evidence-first mirroring; coexistence and migration qualification.

**Dependencies to carry:** G2-WBS-02 EKB; G2-WBS-01 provenance; domain owner WBS nodes; migration constraints D0-D8.

**Proof obligations:** observed behavior != intended/canonical process; imported artifacts remain evidence/candidates until disposition; contradictions are retained; source-of-truth movement is explicit; legacy coexistence and residual cohorts are reconciled before closure.

### G2-WBS-24 — Product Proof architecture and traceability

**Scope:** proof obligation registry; evidence routes; positive/negative/adversarial proof classes; revision/population/currentness/locality qualification; traceability from elicitation/artifacts through capability semantics to acceptance.

**Dependencies to carry:** E0-E7; all WBS semantic owners.

**Proof obligations:** Product Proof design != executed proof; acceptance criterion != full product proof; PASS/PARTIAL/INCONCLUSIVE/BLOCKED/FAIL/NA/DEFERRED remain explicit; evidence cannot strengthen authority/currentness; unresolved critical proof obligations block acceptance.

### G2-WBS-25 — Production Readiness Coverage

**Scope:** separate readiness coverage across `OBSERVABILITY | OWNERSHIP | FAILURE_HANDLING | RECOVERY | CAPACITY | CURRENTNESS | SECURITY | RECONCILIATION | CHANGE_SAFETY | COST | DOCUMENTATION`.

**Dependencies to carry:** G2-WBS-17/18 and every production-bearing capability.

**Proof obligations:** no aggregate percentage masks a failed critical dimension; readiness is population/environment/currentness qualified; functional proof cannot substitute for operability/readiness proof.

### G2-WBS-26 — Architecture Reconciliation capability realization

**Scope:** cross-capability consistency, ownership/boundary checks, revision/evidence reconciliation, dependency conflict detection, provider and migration coherence, proof/readiness reconciliation.

**Dependencies to carry:** all G2-WBS-01..25 as inputs, but no implementation ordering is asserted in this phase.

**Proof obligations:** detect incompatible claims across story/use case/workflow/permissions/data/UI/acceptance; preserve `ConflictPattern != ConflictInstance`; preserve `Signal != ConfirmedConflict`; reconciliation cannot silently remediate or strengthen claims.

## 3. Canonical capability ownership mapping

The WBS intentionally decomposes cross-cutting infrastructure separately while retaining exactly 28 canonical capability owners. A WBS node may support several capabilities, but ownership remains with the canonical capability architecture established in Planning A-C. G2-WBS-02, G2-WBS-11, G2-WBS-22, G2-WBS-24 and G2-WBS-25 are cross-cutting decomposition planes, not new canonical capabilities.

No WBS node may claim ownership merely because it hosts a mechanism. Semantic owner, authority owner, evidence owner and provider realization remain distinguishable.

## 4. Elicitation coverage carried into decomposition

Every WBS item that later becomes implementation planning must expose, per applicable object/capability, at least: owner, source-of-truth, stakeholder coverage, provenance/currentness, authority, history/revision, failure, rollback/roll-forward, UNKNOWN/reconciliation, lifecycle/revoke/deprovision, privacy, scale/capacity, observability, exception/abuse/misuse, offline/locality, coexistence, evidence and cross-capability dependencies.

A dimension may be `NA` only with explicit rationale and owner disposition. `DEFERRED` is debt, not resolution. `CONFLICTED` remains visible until disposition. AI-generated summaries and candidates never erase source nuance or negation.

## 5. WBS-decomposition exit criteria

`WBS_DECOMPOSITION` may close only when:

1. every canonical capability is represented by at least one decomposition node and retains its canonical owner;
2. every cross-cutting constitutional concern has an explicit WBS home without becoming a 29th capability;
3. inherited adversarial findings/proof obligations have an owner route rather than being converted into remediation tasks;
4. Elicitation no-false-complete, contradiction/provenance and cross-artifact consistency are carried into applicable nodes;
5. migration/coexistence, residual cohorts, provider substitution, `PARTIAL/UNKNOWN`, local/Station/Fleet, bounded Physical/Peripheral and finite drainability remain represented;
6. Product Proof and Production Readiness remain separate planning planes;
7. no implementation authorization, Work Package, executive TASK, Construction, product code or executable test is created.

## 6. Phase disposition

Result: `PASS_FOR_WBS_DECOMPOSITION`.

This artifact establishes the decomposition vocabulary and scope only. It deliberately does **not** compute or persist the WBS dependency graph. The next phase may analyze dependency edges only after repository state is reconciled to mark this decomposition closed.