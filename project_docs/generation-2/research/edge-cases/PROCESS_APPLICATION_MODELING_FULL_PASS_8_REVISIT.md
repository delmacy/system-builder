# Generation 2 — Process & Application Modeling — Full Pass 8 Revisit

Status: ACTIVE — ELIGIBLE NO-NEW-MATERIAL LOCAL + CLUSTER REVISIT
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Capability: Process & Application Modeling
Mandatory cluster exercised: Process/Application × Workflow × Data/Schema
Prior authority: `PROCESS_APPLICATION_MODELING_EDGE_CASE_REGISTER.md` and Full Pass 2–7 revisit dossiers
Conflict-classification authority: `PROCESSUAL_SEMANTIC_CONFLICT_CLASSIFICATION.md`
Reusable ConflictPattern inventory screened: 124

Research only. Preserve `Research != remediation`, `ConflictPattern != ConflictInstance`, `Signal != ConfirmedConflict`, `observed behavior != intended process != approved canonical process`, and `AI inference = candidate`. This revisit authorizes no product code, Work Package, TASK, Construction, target-architecture decision or pre-emptive remediation.

## 1. Full-Pass-8 method

This revisit uses an **epistemic-sufficiency, contradiction and operability-fracture lens** materially different from Full Pass 7's temporal-graph/operational-dynamics analysis. The target is not merely whether a process graph can execute, but whether the evidence used to claim that the process/application is understood is sufficiently current, multi-source, exception-complete and operationally qualified.

The probes were:

1. **stakeholder/source subtraction** — remove operator/support/security/data-owner evidence while retaining sponsor/process-owner stories, then test false `RESOLVED` or architecture-readiness claims;
2. **contradictory narrative versus Brownfield trace** — stakeholder says path `A→B→C`, while logs/spreadsheets/email show frequent `A→D→C`; preserve both as evidence until owner-qualified reconciliation rather than silently choosing one;
3. **N/A abuse on exceptions/recovery** — mark alternate/failure/offline/recovery dimensions `NOT_APPLICABLE` without rationale/evidence and test whether coverage can falsely close;
4. **happy-path state-gap extraction** — derive a story/use case with main flow complete but omit transition guards, terminal semantics, retry, cancellation, compensation, partial effect or recovery;
5. **stale/uncertain predicate qualification** — branch condition depends on stale fact, interval/distribution, forecast, optimization or AI inference but is narrated as deterministic business truth;
6. **model-versus-runtime/event evidence drift** — declared process remains unchanged while runtime/event observations show new orderings, missing activities, manual bypass or residual old-revision cohorts;
7. **superseded-answer dependency fracture** — an elicitation answer is superseded yet generated story/use case/workflow/schema/acceptance artifact remains marked current;
8. **Production Readiness Coverage subtraction** — feature behavior is fully described, but monitoring, capacity, failure detection, escalation, backup/restore, retry/reconciliation or rollout evidence is absent;
9. **in-flight revision crossing** — process instance begins under elicitation/model revision `N`, then a question/decision/schema/workflow revision changes to `N+1`; test silent reinterpretation;
10. **nested queue/capacity coupling under elicitation omission** — local workflow steps have owners but shared service centers/providers, arrival rates, service-time variance and backlog headroom are never elicited;
11. **federated responsibility gap** — autonomous systems exchange work under a versioned contract but no stakeholder owns timeout, `UNKNOWN`, schema mismatch, reconciliation or failure responsibility;
12. **AI/low-code early termination** — fluent AI conversation produces stories/use cases/process graph and declares understanding despite critical unanswered authority, source-of-truth, failure, privacy or readiness dimensions;
13. **Physical/Peripheral integration-plane scope fracture** — camera/VMS/access/BMS/PDV integration is elicited as read/provision/broker, but generated process silently assumes generic physical actuation or provider-reported state as physical truth;
14. **Legacy Mirroring authority fracture** — observed spreadsheet/formula/email sequence is promoted from Brownfield evidence into canonical process/rule without semantic-owner approval;
15. **question-to-capability routing loss** — a process interview discovers retention, authorization, formula or provider semantics and the process model clones ownership instead of referencing the appropriate semantic owner;
16. **coverage-state averaging attack** — many `RESOLVED` low-risk dimensions hide one `CONFLICTED/BLOCKED` authority/source-of-truth/external-effect dimension behind a synthetic completeness score.

The mandatory `Process/Application × Workflow × Data/Schema` cluster is materially exercised by probes 2–7, 9, 10, 14 and 15.

## 2. Evidence refresh

External evidence is used as adversarial evidence, not target-architecture prescription.

### 2.1 Elicitation techniques are context-dependent and stakeholder-dependent

A systematic literature review of requirements elicitation found that effective technique selection depends on product context, stakeholder characteristics and the type of information sought; it does not support one universal questionnaire as sufficient.

Source refreshed 2026-09-06:
- https://ietresearch.onlinelibrary.wiley.com/doi/10.1049/iet-sen.2017.0144

Portable consequence: Process/Application understanding should use capability/context-aware question selection and multi-source evidence, not infer completeness from conversational volume.

### 2.2 AI can improve articulation but stakeholder validation remains essential

Recent empirical work reports that LLM-assisted reformulation can surface tacit details and improve perceived clarity/alignment, while explicitly retaining stakeholders in the validation loop. A separate 2026 controlled study found strong results for collaborative stakeholder elicitation plus AI-supported synthesis compared with direct LLM-only generation.

Sources refreshed 2026-09-06:
- https://arxiv.org/abs/2601.16699
- https://arxiv.org/abs/2606.24060

Portable consequence: AI is useful for question/follow-up/artifact candidate generation, but fluent synthesis cannot become authority or close unresolved semantic gaps automatically.

### 2.3 Observed process behavior is evidence, not the intended/canonical process

Process-mining conformance checking explicitly compares observed event-log behavior against the process model and treats deviations as information requiring analysis; observation and specification are distinct objects.

Source refreshed 2026-09-06:
- https://www.processmining.org/conformance.html

Portable consequence: Brownfield traces, shadow spreadsheets and event logs can challenge or enrich a process narrative, but neither observation nor the declared model silently wins. Contradiction needs owner/evidence/currentness and a decision route.

### 2.4 Event occurrence time and observation time are distinct

OpenTelemetry's current log/event data model distinguishes `Timestamp` (when the event occurred at the source) from `ObservedTimestamp` (when the collection system observed it), and explicitly allows delayed/out-of-order observations.

Sources refreshed 2026-09-06:
- https://opentelemetry.io/docs/specs/otel/logs/data-model/
- https://opentelemetry.io/docs/specs/semconv/general/events/

Portable consequence: process conformance/currentness cannot infer business ordering solely from ingestion/observation time, especially for offline, federated, Mirroring or peripheral event sources.

## 3. Candidate findings and duplicate-screen against 124 ConflictPatterns

No candidate survived duplicate-screen as a distinct 125th reusable ConflictPattern.

### 3.1 Process marked understood after stakeholder/source subtraction

Candidate: sponsor/process-owner answers cover purpose and happy path, while operator/support/security/data-owner classes are missing, yet the process is marked `RESOLVED`.

Disposition: existing evidence-boundedness/currentness, semantic-owner, human-procedure and proof-claim families. Detection candidate: stakeholder/source coverage by dimension plus blocked-artifact linkage. Blast radius: process/system depending on omitted class. Reversibility: usually bounded before publication, potentially migration/incident after deployment. Currentness: respondent/evidence timestamp and effective period required. Proof obligation: a readiness claim must name the dimensions and evidence supporting it; missing mandatory stakeholder/evidence classes remain visible.

### 3.2 Observed Brownfield trace conflicts with intended narrative

Candidate: observed sequence materially differs from stakeholder-described intended procedure.

Disposition: existing conformance, Brownfield provenance, semantic-owner and contradiction families. Detection candidate: process-model/event-log alignment with relation kind `observed`, `declared`, `approved`; divergence is a signal only. Blast radius: workflow/process and downstream data semantics. Reversibility: bounded while candidate; migration may be required after adoption. Currentness: trace window and process revision must be explicit. Proof obligation: `observed behavior != intended process != approved canonical process`.

### 3.3 Exception/recovery dimensions closed as N/A without evidence

Candidate: failure/offline/recovery is marked `NOT_APPLICABLE` merely because no stakeholder mentioned it.

Disposition: existing false-completeness, negative-space, recovery and proof-claim families. Detection candidate: N/A requires rationale, owner and applicability evidence for mandatory dimensions. Blast radius: process to system. Reversibility: easy pre-publication, potentially high after external effects. Currentness: re-evaluate on provider/topology/revision change. Proof obligation: no `complete` or publish-ready state may be inferred from unsupported N/A.

### 3.4 Happy-path story hides state/terminal gaps

Candidate: story/use case describes successful intent but workflow has unspecified terminal state, cancellation, partial effect, timeout or recovery semantics.

Disposition: existing workflow soundness/terminal-semantics, UNKNOWN-effect, recovery and artifact-traceability families. Detection candidate: derive coverage obligations from external effects and durable control-flow kinds. Blast radius: workflow/process/external parties. Reversibility: bounded until effects occur. Proof obligation: user story alone is not sufficient specification; terminal and failure semantics must be separately evidenced.

### 3.5 Stale or uncertain predicate promoted to deterministic branch truth

Candidate: process branch uses stale telemetry, interval/distribution/forecast/optimization/AI result as deterministic fact.

Disposition: existing analytical-kind conflation, uncertainty, temporal/currentness and decision-owner families. Detection candidate: predicate input kind/unit/currentness and explicit decision-policy binding. Blast radius: branch to process/external effect. Reversibility: effect-dependent. Proof obligation: uncertainty cannot silently collapse to scalar fact; `AI inference = candidate`.

### 3.6 Runtime observations drift from the process model

Candidate: declared model remains current while event evidence repeatedly shows bypass/manual workaround/order drift.

Disposition: existing conformance, currentness, manual-bypass and Brownfield families. Detection candidate: revision-qualified conformance trend and explicit model/evidence currentness. Blast radius: process/system. False-positive risk: emergency or exceptional paths may be approved. Signal remains distinct from ConfirmedConflict.

### 3.7 Superseded elicitation answer leaves dependent artifacts current

Candidate: authority/source-of-truth/failure answer is superseded but story, use case, workflow, schema or proof obligation retains old meaning without invalidation.

Disposition: existing supersession/provenance, revision/currentness, graph-transformation and proof-invalidation families. Detection candidate: traceability dependency graph from QuestionOccurrence/Answer/Decision to derived artifacts plus affected-subgraph closure. Proof obligation: only artifacts covered by an explicit preservation relation remain current after source revision.

### 3.8 Feature-complete process lacks Production Readiness Coverage

Candidate: functional path is completely specified but operational dimensions are untouched/partial.

Disposition: existing operability/readiness, evidence-boundedness and proof-claim families. Detection candidate: separate feature-semantic coverage from Production Readiness Coverage; no single average score. Blast radius: system/enterprise/external customers after launch. Reversibility: potentially costly after publication. Proof obligation: implementation readiness and publish/operation sufficiency are distinct gates.

### 3.9 In-flight instance silently inherits N+1 elicitation/model meaning

Candidate: an instance pinned to N is reinterpreted after source answer, process, schema or decision revision N+1.

Disposition: existing temporal/currentness, coexistence, historical-recomputation and revision-vector families. Detection candidate: instance-pinned semantic/model revision vector and explicit migration/requalification. Proof obligation: historical/current/in-flight/planned graph projections remain distinct.

### 3.10 Queue/capacity coupling was never elicited

Candidate: each task is valid, but shared provider/team/database queues make the system unstable or SLA-infeasible and no elicitation dimension captured workload/service assumptions.

Disposition: existing resource/capacity, queue stability, objective and proof-claim families. Detection candidate: Production Readiness Coverage gap plus shared-service topology and workload envelope. Currentness: workload/service distribution assumptions must be dated. Proof obligation: definition soundness does not imply capacity/SLA feasibility.

### 3.11 Federated failure responsibility is absent

Candidate: autonomous systems have a valid handoff contract but no owner for timeout, UNKNOWN effect, reconcile/retry, or cross-company failure disposition.

Disposition: existing `FEDERATED-CONTINUITY`, human-responsibility and UNKNOWN-effect families. Detection candidate: bilateral contract revision plus explicit responsibility matrix per effect disposition. Blast radius: cross-system/external parties. Reversibility: potentially hard after irreversible effects. Proof obligation: federation does not require shared mutable state, but responsibility/evidence/correlation must be explicit.

### 3.12 AI conversation terminates before critical gaps are resolved

Candidate: AI generates coherent process artifacts and reports completion although authority, source-of-truth, sensitive-data policy, reconciliation or readiness remains unresolved.

Disposition: existing AI non-amplification, false completeness, evidence-boundedness and semantic-owner families. Detection candidate: deterministic mandatory-gap rules and unresolved-question inbox independent of assistant fluency. Proof obligation: AI may propose, never strengthen authority or convert `PARTIAL/UNKNOWN/CONFLICTED` into `RESOLVED` without qualifying evidence/decision.

### 3.13 Physical/peripheral integration scope expands into control

Candidate: process asks to synchronize VMS/access/BMS/PDV users/resources/events, then generated flow assumes direct generic actuation or treats provider status as physical truth.

Disposition: existing provider-semantic mismatch, authority amplification, physical/integration-plane boundary and evidence-currentness families. Detection candidate: provider capability profile distinguishes read/query/provision/broker/event from actuation; physical effect is provider-specific/high-risk. Proof obligation: `provider reported state != physical truth`; actuation requires separate Planning-C decision and safety/authority proofs if ever admitted.

### 3.14 Mirrored legacy behavior becomes canonical process automatically

Candidate: spreadsheet formula, macro, manual email approval or observed sequence is ingested and promoted directly to canonical rule/workflow.

Disposition: existing Brownfield inferred-semantics, provenance, semantic-owner and AI-strengthening families. Detection candidate: mapping/derivation relation kind plus human owner approval and unresolved suspicion flags. Proof obligation: `inferred semantics = candidate` and connected source does not gain canonical authority.

### 3.15 Process elicitation clones semantics owned by another capability

Candidate: retention, authorization, formula or provider rule discovered in process interview is duplicated inside Process/Application rather than routed/referenced.

Disposition: existing semantic-ownership and cross-capability duplication families. Detection candidate: concept-to-owner routing and duplicate rule/fact detection. Blast radius: cross-capability divergence. Reversibility: bounded before publication; migration later. Proof obligation: capture-at-discovery does not imply ownership-at-discovery.

### 3.16 Coverage averaging hides a critical unresolved dimension

Candidate: a synthetic score reports 95% complete although authority or source-of-truth is `CONFLICTED/BLOCKED`.

Disposition: existing proof-claim/false-completeness and objective/scalarization families. Detection candidate: multidimensional coverage states (`UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`) with gate-specific blocking. Proof obligation: no single quality/completeness scalar may erase critical unresolved dimensions.

## 4. Conflict-assessment disposition

Result after screening all 124 reusable patterns:

- new local material edge scenarios: **0**;
- new cross-capability material scenarios: **0**;
- new reusable ConflictPatterns: **0**;
- new ConflictInstances asserted: **0**;
- new preventive invariant candidates: **0**;
- HIGH/CRITICAL without owner/proof/detection route introduced: **0**;
- bounded synthesis / Planning-A backfill required: **no**;
- implementation/remediation work opened: **0**.

All candidates remain `CATALOGUE + CLASSIFY + DETECTION_CANDIDATE + FUTURE_REMEDIATION_ROUTE` variants of existing families. Contradictions, process-mining deviations, telemetry gaps and incomplete stakeholder coverage remain **signals** until applicability, evidence/currentness and semantic ownership establish a concrete conflict.

## 5. Elicitation & System Understanding disposition

The dedicated Elicitation methodology remains a **cross-cutting research hypothesis / not canonicalized**. This revisit reinforces rather than changes its current model:

- `QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`;
- information kinds remain distinct: `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope`, `Deferred`;
- adaptive questioning should be driven by capability/object/context, prior answers, ambiguity, contradiction, evidence/currentness and unresolved severity;
- stakeholder coverage and evidence-source coverage are separate dimensions;
- Brownfield mode remains `Mirroring-first + AI-assisted + Human-mapped + Wizard-completed`;
- greenfield remains `AI-first + Wizard-validated + Expert-direct` as a candidate UX split;
- derived User Stories, Use Cases, Scenarios, Requirements, Acceptance Criteria and Product Proof obligations must preserve many-to-many revision-qualified provenance;
- cross-capability routing should capture where discovered but reference the semantic owner rather than clone ownership;
- `sufficient for abstraction`, `candidate architecture`, `implementation`, and `publish/operation` are distinct sufficiency gates;
- Production Readiness Coverage remains separate from feature completeness/runtime health/business convergence;
- an `Unresolved Questions Inbox` and question provenance remain candidate mechanisms, not authorized product work.

No new subartifact is needed because the methodology, taxonomy, traceability and coverage/sufficiency artifacts already carry these semantics; creating another would duplicate repository memory.

## 6. Semantic/modeling research disposition

No standing semantic/modeling front is promoted to a canonical capability in this revisit.

Typed Semantic Graph + ExecutionEnvelope/ExecutionState/ExecutionJournal + Inter-System/Federated Graph + temporal/provenance/decision/unit/uncertainty/graph-revision semantics + WorkflowCompletionCertificate/ProcessProofBundle remain **ARCHITECTURE HYPOTHESES / IN RESEARCH**.

Carry-forward remains:

- capability/operation reuse, `CapabilityUse/Invocation` and subworkflow-as-composite semantics need explicit ownership in Planning C;
- current/historical/future/planned graphs and in-flight pinned revisions remain distinct;
- `StoredFact != DerivedValue`; deterministic derivation, statistical estimate, optimization result, AI inference and human decision remain different analytical/epistemic kinds;
- scalar/vector/matrix/tensor/interval/distribution/time-series results retain dimensions, units, normalization, precision and provenance;
- process/workflow, decision and calculation remain semantically separable even if represented in one typed IR;
- provenance/lineage relation is not authority or causal proof;
- graph transformation N→N+1 requires semantic diff, affected-subgraph closure, migration/revalidation and proof/invariant preservation/invalidation decisions;
- completion proof remains decomposed into definition soundness, termination, execution conformance, journal integrity and external-effect evidence;
- PostgreSQL relational graph remains a plausible baseline; current research still does not require GraphDB; GraphDB remains optional/provider-level;
- Canvas/Fleet remain projections, not automatic authority sources;
- autonomous builds and federated systems need contract-versioned continuity without mandatory shared mutable state.

## 7. Legacy Mirroring and Physical/Peripheral boundaries

Legacy Mirroring remains broader than import and may include one-time migration, read-only projection, periodic/event/CDC sync, bidirectional coexistence, staged cutover, external-source-of-truth, SB-source-of-truth and archive-only ingestion. This pass reinforces that inferred schema/process/rule semantics are candidates requiring provenance and semantic-owner review.

Physical/Peripheral Operations remains deliberately bounded to an integration/governance plane: external-system/device/resource inventory, user/account provisioning, permission/grant synchronization, access brokering, read/query/event ingestion, currentness/provenance and reconciliation. Specialized VMS/access/BMS/PDV/device-control planes remain provider-side by default. Generic physical actuation is a non-goal/exceptional extension unless later explicitly justified and safety/authority qualified.

## 8. Planning C/D/E and Architecture Reconciliation carry-forward

Planning C must consume the existing Elicitation Knowledge Base, question taxonomy, information-kind model, adaptive routing, provenance/currentness, contradiction handling, capability lenses, multidimensional coverage/sufficiency gates, derived-artifact traceability and Wizard/AI boundaries. It must also decide Process/Application versus Workflow/Data/Decision/Calculation ownership without embedding every discovered concern in the process model.

Planning D must preserve free-form notes and Brownfield evidence while progressively introducing structured QuestionOccurrences, provenance, semantic references and supersession/invalidation without big-bang migration.

Planning E must require proofs of adaptive questioning, contradiction/unresolved handling, capability-specific routing, story/use-case/scenario derivation, provenance/currentness, critical-gap detection, process-model versus observed-event divergence, no false `complete`, and separation of feature completeness from publish/operation readiness.

Architecture Reconciliation must compare static questionnaire, fully conversational AI, deterministic wizard, capability-specific schemas and hybrid knowledge-base approaches; the current evidence continues to favor evaluating a hybrid, auditable, extensible model rather than assuming one interaction style.

## 9. Saturation disposition

This is an eligible no-new-material Process & Application Modeling revisit in Full Pass 8 and a material exercise of `Process/Application × Workflow × Data/Schema`.

- Process & Application Modeling local no-material streak remains capped at **2**;
- mandatory cluster streak remains capped at **2**;
- Full Pass 8 capability coverage becomes **2/28**;
- Full Pass 8 mandatory-cluster coverage becomes **2/12**;
- completed full passes remain **7/8 minimum**;
- inventory remains **284 material edge findings + 124 ConflictPatterns = 408 material findings**;
- HIGH/CRITICAL without owner/proof/detection route remains **0**;
- negative-space status remains `NOT_STARTED`;
- saturation remains `NOT_SATURATED`;
- Planning C remains blocked.

## 10. Next action

Continue only `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION` Full Pass 8 with **Workflow & Durable Execution** and explicitly exercise **Workflow × Integration × Messaging × external mutation**.

Use materially different probes emphasizing durable-instance epistemic and effect boundaries: retry/redrive after `UNKNOWN`, effect identity versus message/delivery identity, child sync/async completion, waits/timers across revisions, cancellation versus external adoption, partial fan-in/join, compensation after downstream adoption, stale/uncertain decisions, event occurrence versus observation time, backpressure/deadline pressure, provider substitution/residual callbacks, federated responsibility, Brownfield observed workflow versus intended procedure, missing stakeholder/operability dimensions, external user/grant provisioning where relevant, and AI/low-code early completion or evidence strengthening.

Duplicate-screen all 124 patterns. Workflow and mandatory-cluster streaks are already capped at 2; do not inflate absent material novelty. Do not enter Planning C. Full Pass 8 must still complete all 28 capabilities and 12 mandatory clusters before the minimum-pass gate can be met; final negative-space/saturation closure remains required afterward.
