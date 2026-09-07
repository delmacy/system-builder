# Generation 2 — Planning D D1 Semantic Substrate & Elicitation Coexistence

Status: **DECIDED / PASS FOR D1**  
Phase: `PLANNING_D_DEPENDENCY_MIGRATION_STRATEGY`  
Scope: D1 migration/coexistence planning only. No Planning E, Architecture Reconciliation phase, WBS, Work Packages, executive TASKs, Construction, remediation or product code.

## 1. Authority and decision question

This record executes only the D1 action authorized by `RESEARCH_PIPELINE_STATE.json`, under the D0 migration constitution. Planning C C0 and C1 remain target-architecture authority; Planning B remains current-state authority. Research remains `CLOSED / SATURATED / PASS` with 408 inherited material findings (284 edge scenarios + 124 reusable `ConflictPattern`s).

Constitutional distinctions remain unchanged: `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`, `provenance != truth != currentness != authority`, and `AI inference = candidate`.

D1 answers:

> How can owner-qualified semantic identity/revision/reference semantics and the versioned Elicitation Knowledge Base be introduced alongside existing free-form and Brownfield material without big-bang conversion, historical rewriting, contradiction erasure, authority amplification or false elicitation/production-readiness completeness?

## 2. Decision summary

D1 adopts **incremental dual-representation coexistence with a single explicit semantic owner per predicate**.

Legacy/free-form artifacts remain immutable evidence sources and historical referents. Structured C0/C1 records are introduced as new owner-qualified semantic projections and governed information records. A structured projection never silently replaces its source, and coexistence never means two canonical truths.

The migration path is:

`source discovery -> provenance/currentness qualification -> owner-qualified semantic identity -> typed candidate/information projection -> shadow linkage -> contradiction/lossiness review -> owner adoption where applicable -> structured canonical revision -> residual free-form/reference coexistence -> reconciliation -> closure disposition`.

## 3. D1-DEC-001 — Identity before normalization

Before a material free-form statement, question, requirement, process note, spreadsheet field, imported document fragment, AI summary or Brownfield observation can participate in structured semantics, the migration must establish:

- source artifact/occurrence identity;
- source/respondent/observer when known;
- capture/observation time and currentness limits when material;
- tenant/enterprise/Station/site/object scope;
- candidate semantic owner;
- target `CanonicalSemanticIdentityRef` or an explicit unresolved identity candidate;
- producing/source revision references where available;
- transformation/mapping revision and lossiness.

Normalization without owner/identity qualification is not migration progress. Equal labels, field names or values do not prove semantic identity.

## 4. D1-DEC-002 — Free-form + structured coexistence is first-class

D1 forbids a big-bang rewrite of notes/documents/current elicitation into structured records.

During coexistence:

1. original free-form/Brownfield material remains addressable and immutable except through its own source lifecycle;
2. structured records reference source spans/artifacts rather than copying away provenance;
3. structured edits do not retroactively rewrite what a source originally said;
4. a free-form source may support multiple structured records and one structured record may depend on multiple sources;
5. unsupported or lossy mappings remain explicit;
6. residual unstructured populations remain measurable migration debt, not hidden completion;
7. later source changes create new evidence/currentness events and may reopen prior structured coverage.

`structured != authoritative` and `unstructured != obsolete`.

## 5. D1-DEC-003 — Typed information kinds cannot be collapsed during migration

The C1 kinds remain distinct:

`Fact | Claim | Assumption | InferredCandidate | Decision | Requirement | Constraint | OpenQuestion | Conflict | Unknown | OutOfScope | Deferred`.

Migration rules:

- imported prose defaults to the narrowest justified kind; ambiguity remains unresolved;
- AI extraction/summarization produces `InferredCandidate` unless independently qualified;
- stakeholder text is not promoted to `Fact` merely because it is explicit;
- `Unknown` cannot become empty/null/false/zero;
- `Deferred` cannot become `Resolved` because migration omitted it;
- `OutOfScope` cannot become `NOT_APPLICABLE` without applicability rationale;
- conflicting records remain separately addressable and linked through an unresolved `Conflict` record;
- promotion between kinds requires an explicit governed transition and provenance.

## 6. D1-DEC-004 — Question knowledge and question occurrences migrate independently

Reusable question knowledge migrates to immutable revisioned `QuestionDefinition`s. Historical conversations/forms/checklists/interviews become or link to context-bound `QuestionOccurrence`s only where identity and context can be qualified.

A migrated occurrence must preserve the question-definition revision actually used when knowable. If historical wording cannot be mapped exactly, the migration records a legacy-question identity plus mapping fidelity rather than pretending the current canonical question was asked.

Question-definition evolution never rewrites historical occurrences. Material definition changes can invalidate or reopen coverage derived from older revisions.

## 7. D1-DEC-005 — Adaptive routing shadows before it governs

Deterministic routing/applicability/follow-up rules and AI-assisted routing are introduced in **shadow mode** before they can affect sufficiency gates.

Shadow evaluation records:

- which questions/lenses would have been selected;
- semantic owner routing target;
- applicability result and rationale;
- mandatory-gate implications;
- ambiguity/contradiction signals;
- differences from current human/manual routing;
- unsupported context and `INCONCLUSIVE` outcomes.

Only after rule revisions, owner mappings and critical-loss paths are qualified may structured routing become the governing route for a context. AI remains advisory and cannot close gaps or choose contradiction winners.

## 8. D1-DEC-006 — Owner-preserving cross-capability linkage

A question or answer discovered under capability A but semantically owned by capability B is linked to B using typed references. D1 forbids cloning the predicate into A's EKB namespace.

Cross-capability routing must preserve:

- discovery context;
- question occurrence;
- target semantic owner;
- referenced subject/object;
- blocked downstream artifacts;
- source/evidence lineage;
- routing decision/revision;
- unresolved status until B's owner disposition exists.

This prevents the EKB from becoming a semantic god-object.

## 9. D1-DEC-007 — Contradictions survive normalization and summarization

Competing claims/evidence remain separate records. A migration may create a normalized subject/reference and a `Conflict` projection, but it cannot merge disagreement into a synthetic consensus.

Conflict closure requires semantic owner/resolution authority, evidence/currentness qualification and explicit disposition. Stale evidence may reopen a previously resolved contradiction.

Research `ConflictPattern`s remain reusable research artifacts and are not converted into project/runtime `ConflictInstance`s merely because a migration signal resembles them.

## 10. D1-DEC-008 — Traceability is additive and revision-qualified

D1 incrementally establishes typed traceability:

`Source/Elicitation Evidence -> Answer/Information Record -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model/Capability -> Acceptance Criterion -> Product Proof -> Runtime Evidence`.

A missing historical edge remains `Unknown`/unresolved provenance debt. Backfill may assert only what surviving evidence supports. D1 explicitly forbids invented provenance, fabricated source timestamps, inferred respondent authority or retroactive claims that an artifact was derived from evidence that cannot be demonstrated.

Backfill confidence/lossiness is distinct from semantic truth.

## 11. D1-DEC-009 — Coverage migrates dimensionally, never by scalar conversion

Existing questionnaire completion percentages, checklist totals or document-presence signals cannot be converted directly into C1 sufficiency.

Coverage is rebuilt by applicable object/capability/revision dimensions using:

`UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`.

Legacy completion can be retained as source evidence but not as canonical C1 coverage. `RESOLVED` requires evidence/currentness appropriate to the named gate.

HIGH/CRITICAL unresolved questions, unowned contradictions, missing critical evidence or unjustified `NOT_APPLICABLE` block false completion regardless of aggregate progress.

## 12. D1-DEC-010 — Production Readiness Coverage is a separate migration population

Operability Elicitation metadata and Production Readiness Coverage migrate separately from feature/elicitation coverage.

For each applicable capability/workflow/integration/provider, D1 preserves or elicits explicit records for SLO/SLA, expected/peak/burst load, latency, queue/backlog, timeout/`UNKNOWN`, retry/idempotency, failure modes, dependency health, freshness/currentness, owner/escalation/on-call, alertability, retention, degraded/offline behavior, reconciliation, recovery/rollback, capacity headroom, provider quotas, cost/usage, audit, incident response and post-change validation.

A migrated feature can be semantically understood while production readiness remains `PARTIAL` or `BLOCKED`.

## 13. D1-DEC-011 — Brownfield/Mirroring is evidence-first

Brownfield assimilation uses:

`discover -> identify source/revision -> extract -> map -> fidelity classify -> preserve unresolved semantics -> propose -> owner adopt -> canonical revision`.

Observed forms, logs, schemas, scripts, spreadsheets, dashboards, workarounds, manual approvals, verbal practices and off-channel procedures remain evidence/candidates. `observed behavior != intended process != approved canonical process`.

Tacit knowledge receives explicit source/person/context/currentness metadata where available and remains a `Claim`/candidate until owner qualification. Absence of documentation is negative-space evidence, not proof that a behavior or obligation does not exist.

## 14. D1-DEC-012 — Migration state guards

The D0 state machine is specialized for D1:

- `DISCOVERED`: source population inventoried with provenance handle;
- `QUALIFIED`: owner/identity/scope/currentness and mapping fidelity sufficiently known;
- `COEXISTENCE_READY`: structured representation can exist without breaking source interpretation;
- `SHADOWING`: structured routing/coverage/traceability evaluated without authority transfer;
- `PARTIAL_CUTOVER`: selected contexts use structured EKB as governing authoring route while residual contexts remain explicit;
- `CUTOVER`: target EKB/semantic structures are governing for the declared population;
- `RESIDUAL_DRAIN`: legacy write/routing paths and unmapped populations are being dispositioned;
- `RECONCILED`: owner/evidence/currentness/coverage residuals are reconciled;
- `CLOSED`: declared population has no hidden HIGH/CRITICAL migration gap and residuals have explicit disposition.

`BLOCKED`, `CONFLICTED`, `ABORTED`, `ROLLED_FORWARD`, `ROLLED_BACK_WHERE_REVERSIBLE` and `MANUAL_RECONCILIATION_REQUIRED` remain valid.

## 15. D1-DEC-013 — Writer movement and fencing

Structured EKB adoption does not automatically transfer semantic ownership.

For EKB-owned metadata (question definitions, occurrences, routing, coverage projections, unresolved inbox metadata), writer movement follows D0 source-of-truth protocol. For domain truth discovered through elicitation, the EKB writes references/candidates and the canonical capability owner performs any authoritative adoption.

When legacy and new authoring surfaces coexist, each context declares which surface may create/update EKB-owned state. Old writers are fenced or explicitly bounded before cutover. Hidden dual writers block closure.

## 16. D1-DEC-014 — Revision/currentness invalidation is explicit

D1 carries a sparse `RevisionVector` across question definition, semantic owner definition, schema, policy, provider, topology, trust, deployment and other relevant dimensions.

A material revision can invalidate:

- question applicability;
- answer/evidence currentness;
- contradiction disposition;
- traceability-derived artifacts;
- elicitation sufficiency;
- Production Readiness Coverage.

Invalidation reopens affected dimensions; it does not erase historical `RESOLVED` evidence under its producing revision.

## 17. D1-DEC-015 — Local / Station / Fleet coexistence

Offline/local elicitation and Brownfield discovery may continue only within explicit local closure and provenance/currentness horizons. Disconnection does not broaden authority.

Reconnect is a reconciliation boundary: locally captured question occurrences/evidence/claims retain producing revisions and are merged by identity/revision rules, not `latest-wins`. Contradictions and duplicate-looking records remain qualified until reconciled.

Fleet/global visibility is an observation/projection and cannot prove local elicitation completeness or local evidence currentness.

## 18. D1-DEC-016 — Queue, capacity and convergence are migration obligations

D1 migration work can accumulate in extraction, mapping, owner review, contradiction resolution, evidence requalification, question routing, traceability backfill and residual-drain queues.

Each material migration population must expose at least scope, queue depth **and age**, arrival/admission assumptions, processing capacity, retry/review horizon, blocked-owner age, residual population, currentness objective and escalation path.

`high conversion count != finite drainability`; `accepted for review != owner disposition != reconciled`.

## 19. D1-DEC-017 — Wizard / AI UX migration boundaries

Greenfield remains `AI-first + Wizard-validated + Expert-direct`; Brownfield remains `Mirroring-first + AI-assisted + Human-mapped + Wizard-completed`.

Master Wizard and capability sub-wizards are projections over the same structured EKB. Expert-direct editing does not bypass provenance/authority rules. AI may propose questions, follow-ups, mappings, stories, use cases, scenarios and abstractions but all such outputs retain candidate status until the appropriate qualification path completes.

Conversational completion, high model confidence or lack of further AI questions never establishes sufficiency.

## 20. Typed dependencies

D1 consumes these D0 edges:

| Dependency | D1 requirement |
|---|---|
| `SEMANTIC_PREREQUISITE` | owner-qualified identity, typed references and semantic kinds precede normalization/adoption |
| `REVISION_PREREQUISITE` | immutable question/source/semantic revisions and relevant `RevisionVector` dimensions precede coexistence claims |
| `EVIDENCE_PREREQUISITE` | source/provenance/currentness and mapping fidelity precede structured certainty |
| `AUTHORITY_PREREQUISITE` | EKB metadata ownership is distinct from domain semantic authority |
| `OPERABILITY_PREREQUISITE` | routing/reconciliation/backfill queues and Production Readiness Coverage remain observable |
| `LOCALITY_PREREQUISITE` | offline/local evidence preserves scope/currentness and reconnect reconciliation |

D1 produces prerequisites for later D2+ records: stable owner-qualified references, typed evidence/information semantics, explicit unresolved/contradiction state, revision-aware traceability and a non-scalar readiness/coverage substrate.

## 21. Planning E proof obligations carried forward

D1 registers, but does not execute, proof obligations including:

1. free-form source survives structured projection with exact provenance link;
2. no normalization promotes Claim/Assumption/AI candidate into Fact without governed evidence;
3. `Unknown`, `Deferred` and `OutOfScope` survive round-trip migration distinctly;
4. conflicting sources remain separately addressable after summarization/import;
5. historical QuestionOccurrence remains pinned to producing QuestionDefinition revision;
6. question-definition change reopens only affected coverage dimensions;
7. cross-capability routing preserves semantic owner without cloning owner truth;
8. AI routing cannot close mandatory/high-severity gaps;
9. legacy completion percentage cannot manufacture C1 sufficiency;
10. `NOT_APPLICABLE` requires rationale and applicability evidence;
11. traceability backfill cannot invent absent provenance;
12. Brownfield observed behavior remains distinct from intended/approved semantics;
13. feature completeness cannot satisfy Production Readiness Coverage;
14. stale evidence invalidates affected current qualification without rewriting history;
15. offline/local elicitation reconciles by identity/revision rather than latest-wins;
16. Fleet aggregate cannot prove Station-local completeness/currentness;
17. hidden dual writers block EKB cutover closure;
18. residual unstructured populations remain visible through drain/explicit disposition;
19. contradiction resolution requires owner authority and can reopen on stale/superseded evidence;
20. migration backlog depth/age and owner-review capacity demonstrate finite convergence rather than accumulating hidden elicitation debt.

## 22. Physical / Peripheral boundary

D1 may elicit and structure device/provider/topology/permission/telemetry/command-effect/currentness/safety evidence only within the C2 integration/governance boundary. It creates no generic direct physical actuation capability. A Brownfield physical action observed in evidence remains a provider/domain-qualified candidate until its specialized owner/authority is established.

## 23. D1 closure result

**Result: PASS_FOR_D1.**

The D1 coexistence strategy is coherent with C0, C1 and D0: owner-qualified identity precedes normalization; free-form and structured evidence coexist; information kinds and contradictions survive migration; adaptive routing shadows before governing; EKB metadata ownership cannot absorb domain truth; coverage and Production Readiness remain separate and multidimensional; Brownfield remains evidence-first; local/Fleet currentness and migration queues remain explicit.

No product migration has been executed. No Planning E proof has been run.

### Next ordered Planning D action

Proceed only to **D2 — Authority, Identity, Trust and Secrets prerequisites** in a later action. Plan coexistence/migration for Identity/Authentication/Federation, Authorization/Policy/Organization/Multitenancy, Enterprise Trust/PKI/Certificate Lifecycle, Secrets/Configuration/Environment Portability and Security/Resilience/Failure Recovery. Preserve non-amplifying authority, external identity/group evidence vs canonical truth, session/token/credential residual cohorts, revocation/rotation currentness, break-glass/delegation/SoD, provider mappings, offline/local closure, `UNKNOWN`, reconciliation queues and Production Readiness Coverage. Do not execute D3 or later phases in the same action.