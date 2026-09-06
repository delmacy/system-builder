# Generation 2 — Planning C C1: Elicitation & System Understanding Architecture

Status: **DECIDED / C1 COMPLETE**  
Phase: `PLANNING_C_TARGET_ARCHITECTURE`  
Decision scope: Elicitation & System Understanding architecture only.  
Entry branch head revalidated before persistence: `99b06ef035c6a909c44b191f9df4de248d61eeac`.

This record decides the cross-cutting target architecture for elicitation/system understanding. It does not create a 29th canonical capability, implement product code, decide storage/package technology, execute C2/C3, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs or Construction.

## 1. Authorities and inherited constraints

Authoritative inputs:

- `RESEARCH_PIPELINE_STATE.json` — C1 is the authorized next action;
- `PLANNING_C_TARGET_ARCHITECTURE_ENTRY_FRAMEWORK.md`;
- `PLANNING_C_C0_UNIVERSAL_CAPABILITY_ARCHITECTURE_SEMANTIC_SUBSTRATE.md`;
- `ELICITATION_SYSTEM_UNDERSTANDING_METHODOLOGY_RESEARCH.md`;
- `ELICITATION_QUESTION_TAXONOMY.md`;
- `ELICITATION_ARTIFACTS_TRACEABILITY_RESEARCH.md`;
- `ELICITATION_COVERAGE_SUFFICIENCY_RESEARCH.md`;
- `OPERABILITY_ELICITATION_LENS_RESEARCH.md`;
- inherited adversarial inventory: 284 edge scenarios + 124 reusable `ConflictPattern`s = 408 material findings.

Standing invariants remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`;
- `question answered != concept resolved != evidence sufficient != contradiction cleared != implementation-ready != production-ready`;
- `observed behavior != intended process != approved canonical process`;
- `AI inference = candidate`, never authority;
- `feature completeness != Production Readiness Coverage != runtime health != business convergence`.

## 2. C1 decision summary

Planning C adopts a **hybrid, versioned, auditable Elicitation Knowledge Base (EKB)** as cross-cutting authoring/knowledge infrastructure over the C0 Typed Semantic Graph and Evidence/Provenance/Currentness primitives.

The EKB is **not** a 29th canonical business capability and is **not** a monolithic questionnaire. It is a reusable knowledge and routing layer consumed by the 28 canonical capabilities and by Master Wizard, capability sub-wizards, expert-direct authoring and AI-assisted interaction.

The target model combines:

1. reusable revisioned `QuestionDefinition`s;
2. context-bound `QuestionOccurrence`s;
3. typed `InformationRecord`s preserving semantic kind;
4. qualified evidence/provenance/currentness;
5. deterministic applicability, mandatory-gate and routing rules;
6. AI-assisted candidate generation/prioritization/summarization with non-amplifying authority;
7. explicit contradiction and unresolved-question semantics;
8. multidimensional Elicitation Coverage plus separate Production Readiness Coverage;
9. revision-qualified traceability from evidence through requirements/semantic models to acceptance/product proofs;
10. greenfield and Brownfield paths that share the same semantic truth discipline.

## 3. C1-DEC-001 — EKB ownership is cross-cutting authoring infrastructure, not canonical domain ownership

**Decision:** DECIDED.

The EKB owns reusable question definitions, elicitation occurrences, routing metadata, coverage projections, unresolved-question workflow metadata and traceability relations required to conduct elicitation.

It does **not** own the business truth discovered by elicitation. A discovered retention rule is owned by Privacy/Data Governance; a discovered approval permission is owned by Authorization; a discovered provider binding requirement is owned by Provider/Binding; a discovered workflow invariant is owned by Workflow; an operational SLO is routed to the semantic owner of the operated capability/workload.

Cross-capability discovery uses owner-preserving references from C0 rather than cloning foreign semantics into EKB-owned records.

The EKB therefore acts as a structured elicitation/evidence/derivation plane over canonical owners.

## 4. C1-DEC-002 — `QuestionDefinition` and `QuestionOccurrence` are distinct revisioned identities

**Decision:** DECIDED.

`QuestionDefinition` is reusable knowledge. It has stable identity plus immutable revision identity and may carry:

- purpose/question family;
- applicability expression and exclusions;
- capability/context bindings;
- semantic concepts expected to be discovered;
- prerequisites;
- deterministic follow-up triggers;
- ambiguity/contradiction signals;
- expected evidence classes/currentness;
- unresolved severity;
- downstream artifact/proof dependencies;
- semantic owner/routing target;
- rationale/provenance for why the question exists.

`QuestionOccurrence` binds one `QuestionDefinitionRevisionRef` to a concrete context, such as enterprise/client/workspace/site/capability/object/provider/stakeholder/revision slice. It owns occurrence lifecycle, responses/evidence references, applicability disposition, current status and reopen/supersession lineage.

Changing a reusable question produces a new definition revision. Historical occurrences retain the revision that produced them. Material question-definition change may invalidate or require requalification of prior coverage; it never silently rewrites historical elicitation.

## 5. C1-DEC-003 — Information kinds are typed and promotion is explicit

**Decision:** DECIDED.

C1 adopts these portable information kinds:

- `Fact`;
- `Claim`;
- `Assumption`;
- `InferredCandidate`;
- `Decision`;
- `Requirement`;
- `Constraint`;
- `OpenQuestion`;
- `Conflict`;
- `Unknown`;
- `OutOfScope`;
- `Deferred`.

They are not interchangeable prose labels.

Each material information record must support, where applicable, semantic owner, source/respondent, evidence references, producing revision vector, observation/effective time, currentness, tenant/site/object scope, confidence/uncertainty kind, applicability, status and correction/supersession lineage.

Promotion between kinds is an explicit governed transition with provenance. AI output begins as `InferredCandidate` unless independently established through an owner-governed qualification path. Repetition by multiple dependent sources does not automatically promote a claim to fact.

`Unknown` is a first-class state and cannot be represented by empty text, zero, false or omitted fields when the distinction is semantically material.

## 6. C1-DEC-004 — Adaptive routing is hybrid: deterministic gates, AI-assisted exploration

**Decision:** DECIDED.

The target routing model is hybrid.

Deterministic semantics own:

- applicability evaluation where a rule is defined;
- mandatory question families for a gate/context;
- semantic-owner routing;
- high-severity unresolved blockers;
- coverage-state transitions requiring objective obligations;
- `NOT_APPLICABLE` rationale requirement;
- contradiction preservation;
- evidence/currentness invalidation triggers;
- stage-specific sufficiency gate evaluation;
- authority-sensitive control paths.

AI may:

- propose decomposition;
- prioritize likely high-information questions;
- generate bounded follow-up candidates;
- summarize evidence while preserving dissent/source links;
- propose semantic mappings;
- detect likely ambiguity/negative space/contradiction signals;
- recommend capability lenses.

AI cannot close mandatory gaps, choose a silent winner in contradictions, promote itself into an authoritative decision, infer `NOT_APPLICABLE` without qualified rationale, or turn conversational fluency/confidence into sufficiency.

## 7. C1-DEC-005 — Contradiction handling preserves competing claims and creates unresolved governed state

**Decision:** DECIDED.

When independent claims/evidence/requirements/decisions conflict, the system preserves the competing records and creates or updates an unresolved contradiction record referencing them. No confidence score, recency heuristic or AI summary silently overwrites the others.

A contradiction record must be able to carry:

- subject/context;
- conflicting record references;
- conflict kind;
- semantic owner/resolution authority;
- severity/impact;
- affected downstream artifacts/gates;
- evidence/currentness status;
- resolution route;
- disposition and supersession lineage.

This architectural `Conflict` information kind does not turn a reusable research `ConflictPattern` into a runtime/project `ConflictInstance`. Those concepts remain distinct.

## 8. C1-DEC-006 — `Unresolved Questions Inbox` is a governed projection, not a separate truth store

**Decision:** DECIDED.

C1 adopts an `Unresolved Questions Inbox` projection over unresolved `QuestionOccurrence`s, conflicts, missing evidence, stale evidence and elicitation debt.

Each item should expose, where applicable:

- owner;
- severity;
- context/capability/object;
- question/claim/evidence references;
- currentness/revision;
- reason unresolved;
- blocked artifacts/gates;
- follow-up or escalation route;
- deferred/blocked expiry or re-entry trigger.

The inbox may be filtered and prioritized but may not erase low-frequency critical blockers through aggregation or scoring.

## 9. C1-DEC-007 — Stakeholder and evidence coverage are first-class and independent of question count

**Decision:** DECIDED.

Coverage tracks source/stakeholder classes and evidence diversity rather than only number of answered questions.

Applicable source classes can include sponsor/process owner, actual operator/end user, domain SME, operations/support/on-call, security/privacy/compliance, data owner/steward, finance/commercial, provider/integration owner, implementer/maintainer, tester/assurance, auditor/regulator and observed-system evidence.

One person may fill multiple roles, but that does not create source independence. A high answer count from one source cannot substitute for missing perspectives where those perspectives own material semantics.

Observed artifacts/events/configuration/logs/forms/reports/runbooks/APIs/schemas and Brownfield mirroring evidence are explicit evidence classes, while remaining distinct from intended/approved canonical semantics.

## 10. C1-DEC-008 — Elicitation Coverage is multidimensional and gate-relative

**Decision:** DECIDED.

C1 adopts coverage states:

`UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`.

Coverage is tracked by object/capability/revision and by applicable dimension, not collapsed into a single authoritative completeness percentage.

Universal dimensions include at least purpose/outcome, actors/stakeholders, authority/responsibility, inputs, outputs/effects, source of truth, states/transitions, time/currentness, exceptions, failure/recovery/reconciliation, providers/integrations, security/trust, privacy/data governance, evidence/audit, lifecycle, versioning/change, scale/capacity, observability/operations, UX/interactions and acceptance/product proof.

`RESOLVED` is gate-relative and evidence-qualified. It does not mean “correct forever”. Material revisions can reopen or invalidate affected dimensions.

## 11. C1-DEC-009 — Four stage-specific sufficiency gates are adopted

**Decision:** DECIDED.

C1 adopts distinct gates:

1. `SUFFICIENT_FOR_ABSTRACTION`;
2. `SUFFICIENT_FOR_CANDIDATE_ARCHITECTURE`;
3. `SUFFICIENT_FOR_IMPLEMENTATION`;
4. `SUFFICIENT_FOR_PUBLISH_OPERATION`.

Each gate evaluates the dimensions and obligations relevant to that stage. No global average may override a critical `CONFLICTED`/`BLOCKED` dimension.

A gate cannot silently pass when an applicable HIGH/CRITICAL unresolved question lacks disposition, critical contradiction is unowned, required critical evidence/currentness is absent, a critical derived claim lacks traceability, `NOT_APPLICABLE` lacks rationale, AI inference is the sole critical authority, Brownfield behavior is promoted without governed adoption, or feature completeness is substituted for operational readiness.

## 12. C1-DEC-010 — Production Readiness Coverage is a separate first-class view

**Decision:** DECIDED.

C1 promotes the Operability Elicitation Lens from research hypothesis into Planning C target architecture as a **cross-cutting readiness model**, still not a 29th capability.

Production Readiness Coverage dimensions are:

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

Per-dimension states are:

`UNTOUCHED | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NA`.

`NA` requires explicit rationale and applicability context. `RESOLVED` means the readiness obligation is sufficiently specified/evidenced for the named gate/revision, not that runtime is healthy.

Readiness records must be revision/currentness-aware. Provider, schema, policy, build, deployment, topology, trust or workload changes may invalidate earlier readiness qualification.

The architecture explicitly asks, when applicable:

- Como saberemos que está funcionando?
- Como saberemos que está degradado?
- Quem é responsável?
- Que evidência precisamos?
- Qual estado pode permanecer `UNKNOWN`?
- Qual perda/atraso é aceitável?
- Como recuperar?
- Como reconciliar?
- Como validar depois de mudança/deploy?

It further elicits SLO/SLA, throughput/peak/burst, latency, queues/backlog, timeout/retry/idempotency, dependencies, currentness, retention, alerts/escalation, maintenance windows, provider quotas, degraded/offline behavior, recovery/rollback, headroom, cost/usage, audit and incident response.

## 13. C1-DEC-011 — Traceability is typed, many-to-many, revision-qualified and non-causal by default

**Decision:** DECIDED.

C1 adopts typed traceability relations across:

`Source/Elicitation Evidence -> Answer/Information Record -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model/Capability references -> Acceptance Criterion -> Product Proof -> Runtime Evidence`.

Relations must declare their kind, such as supports, derived-from, contradicts, refines, constrains, validated-by, invalidated-by or supersedes. A trace link does not imply truth, causality or authority beyond its declared relation.

Derived artifacts preserve source/evidence/revision lineage and can be requalified when upstream evidence becomes stale or superseded.

## 14. C1-DEC-012 — Structured derivation models are adopted for stories/use cases/scenarios/requirements/proofs

**Decision:** DECIDED.

Generated User Stories, Use Cases, Scenarios, Requirements, Constraints and Acceptance/Product Proof obligations are typed derived artifacts, not free-text endpoints.

At minimum:

- User Stories preserve actor/intention/value/context and links to source obligations;
- Use Cases preserve actor, trigger, preconditions, main/alternate/failure/recovery paths, external effects and postconditions;
- Scenarios may represent happy, alternate, boundary, failure, abuse/misuse, recovery, offline, concurrency, temporal/revision-change and overload cases;
- Requirements/Constraints preserve owner/source, semantic kind, applicability, revision and validation route;
- Acceptance/Product Proof obligations declare exactly what evidence would establish the claim and what remains outside their proof domain.

No derivation may erase `Unknown`, `Conflict`, assumption, provider qualification or source dissent.

## 15. C1-DEC-013 — Capability-specific elicitation lenses extend, never duplicate, canonical ownership

**Decision:** DECIDED.

Each canonical capability may expose an elicitation lens composed of:

`universal subset + capability-specific questions + follow-up rules + expected evidence + anti-patterns + required scenarios + coverage obligations`.

A question discovered in one lens that belongs to another canonical owner is routed by semantic reference. Capability lenses cannot create duplicate owner truth.

The universal taxonomy includes operational, capacity, temporal, security/privacy, lifecycle, provider, Brownfield, Physical/Peripheral integration, commercial/cost, acceptance/proof and negative-space families so happy-path feature discovery cannot become false completeness.

## 16. C1-DEC-014 — Master Wizard, sub-wizards, expert-direct and AI are projections over the same semantic model

**Decision:** DECIDED.

The target authoring surfaces are:

- **Master Wizard** — scope/context, stakeholder/evidence map, overall multidimensional coverage and unresolved routing;
- **capability sub-wizards** — capability-specific lenses and specialized structured authoring;
- **expert-direct mode** — direct structured editing for qualified users without mandatory wizard traversal;
- **AI-assisted conversational mode** — front-end exploration, candidate follow-ups/mappings/summaries and guidance.

All surfaces read/write the same owner-preserving EKB/semantic structures subject to authority. None may maintain an independent hidden truth model.

AI or Wizard presentation cannot hide unresolved critical dimensions or mark the system complete through conversational completion.

## 17. C1-DEC-015 — Brownfield and greenfield use different discovery order but the same truth discipline

**Decision:** DECIDED.

Greenfield path:

`AI-first + Wizard-validated + Expert-direct`.

Brownfield path:

`Mirroring-first + AI-assisted + Human-mapped + Wizard-completed`.

Brownfield observed behavior/configuration/data/workarounds enter as evidence/candidates with provenance and currentness. They are not desired semantics until a governed semantic owner adopts them.

Legacy contradictions between documented process, observed process and stakeholder intent remain explicit. Migration intent is a separate decision from observation.

## 18. C1-DEC-016 — Autonomous Builds/Fleet and local-first operation remain epistemically separated

**Decision:** DECIDED.

Elicitation and readiness must preserve:

`semantic topology != build topology != deployment topology != runtime truth != local journal/evidence != exported telemetry != Fleet aggregate != control authority`.

Readiness questions and evidence may be scoped to build/release/deployment/provider/site cohorts. Fleet views are qualified aggregates with coverage/currentness metadata. Failure to export Fleet telemetry creates an observability gap; it does not by itself block locally qualified autonomous execution.

Any operational control surfaced from elicitation/readiness metadata remains subject to owner-issued authorization and cannot be inferred from visibility.

## 19. C1-DEC-017 — Queue/capacity and analytical semantics are typed elicitation obligations, not free-form numbers

**Decision:** DECIDED.

Where workload/capacity is material, elicitation records expected arrivals/throughput, peak/burst assumptions, service capability, concurrency, queue/backlog age/depth, quotas, sustainable capacity, transient burst tolerance and headroom with units/populations/time windows.

Little's Law, queueing approximations, forecasts, optimization and uncertainty remain qualified analytical kinds inherited from C0. A metric without unit/context/population/currentness cannot resolve a capacity/readiness obligation.

Scalar health/readiness/capability scores may exist only as explicitly owner-defined projections and cannot erase vector dimensions, missingness, blocked states or constraints.

## 20. C1-DEC-018 — Physical/Peripheral elicitation is bounded to integration-plane semantics until C2

**Decision:** DECIDED FOR C1 BOUNDARY ONLY.

C1 may ask about VMS/BMS/access/PDV/biometric/device inventory, identity/resource/user/grant mappings, source-of-truth, provider health, event gaps, sync lag, rate limits, currentness, drift, offline evidence, reconciliation ownership and explicit operation scope.

C1 does not decide direct physical actuation. Visibility, provider permissions or discovered device capabilities do not imply canonical actuation/control authority. C2 remains the sole authorized Planning C stage to decide the Physical/Peripheral target boundary and any explicit actuation disposition.

## 21. Alternatives considered

### Static questionnaire as primary model — REJECTED

Rejected because it couples knowledge to presentation order, handles applicability poorly, encourages question-count completeness and does not naturally preserve revision/currentness/cross-capability ownership.

### Fully conversational AI as primary semantic authority — REJECTED

Rejected because fluency/confidence cannot own mandatory gates, evidence qualification, contradiction preservation, authority or stable revisioned semantics.

### Deterministic monolithic wizard only — REJECTED

Rejected because enterprise elicitation has large negative-space and context-dependent follow-up needs; a fixed flow would become brittle and hard to extend across 28 capabilities and Brownfield evidence.

### Capability-local schemas only — REJECTED AS SOLE MODEL

Useful as lenses, but insufficient alone because shared evidence, owner references, cross-capability routing, traceability and readiness would fragment or duplicate ownership.

### Hybrid EKB + deterministic gates + AI assistance + multiple authoring projections — ADOPTED

Adopted because it preserves auditable semantics, deterministic safety/coverage obligations and extensibility while allowing adaptive interaction and direct expert authoring.

## 22. C1 architecture invariants

1. No 29th canonical capability is created.
2. EKB owns elicitation knowledge/routing, not discovered domain truth.
3. Definition identity and occurrence identity remain distinct.
4. Historical occurrences remain pinned to producing question/revision context.
5. Evidence/provenance/currentness do not become truth/authority automatically.
6. Contradictions are preserved until governed resolution.
7. AI begins from candidate semantics and cannot amplify authority.
8. Elicitation coverage is multidimensional and gate-relative.
9. Production Readiness Coverage is separate from feature/semantic coverage.
10. `NOT_APPLICABLE`/`NA` require rationale and applicability context.
11. Brownfield observation is evidence, not desired-state authority.
12. Traceability does not imply causality.
13. Fleet observation does not imply local truth or remote-control authority.
14. Operational metrics require units/context/population/currentness.
15. Physical/Peripheral remains integration-plane only until C2 explicitly decides otherwise.

## 23. Planning D carry-forward

Planning D must later sequence coexistence/migration from free-form notes/forms/documents and current repository structures toward structured EKB semantics without fabricating historical provenance. It must preserve incremental authoring, bounded backfill, definition/occurrence revisions, derived artifact coexistence and explicit stale/unqualified legacy evidence.

No Planning D ordering is decided in C1.

## 24. Planning E proof obligations

Planning E must later define product/executable proofs demonstrating at least:

- deterministic mandatory-gap/gate behavior;
- adaptive follow-up without AI authority amplification;
- contradiction preservation and unresolved routing;
- stakeholder/evidence coverage gaps;
- stale evidence/currentness invalidation;
- `NOT_APPLICABLE`/`NA` rationale enforcement;
- story/use-case/scenario/requirement/proof traceability;
- Brownfield observed-vs-desired distinction;
- separate feature coverage versus Production Readiness Coverage;
- operational questions for failure/recovery/alert/currentness/reconciliation/capacity;
- no scalar score hiding a critical blocked dimension;
- local/Fleet evidence qualification;
- physical integration visibility not becoming actuation authority.

No product proof is executed in C1.

## 25. C1 disposition

`C1 — Elicitation & System Understanding architecture: DECIDED / PASS FOR C1`.

The cross-cutting Elicitation/System Understanding research is adopted as **hybrid EKB/authoring/coverage/traceability infrastructure**, not promoted to a 29th canonical capability. C0 primitives are consumed for identity, revision, evidence, provenance, currentness, authority, uncertainty, provider and Fleet qualification.

Planning C remains open. The next authorized architecture decision is **C2 — Physical / Peripheral Integration boundary**. C3, Planning D/E, Architecture Reconciliation, WBS, Work Packages, executive TASKs, Construction and product code remain out of scope until their respective gates authorize them.
