# Generation 2 — Elicitation & System Understanding Methodology Research

Status: `CROSS-CUTTING RESEARCH HYPOTHESIS / NOT CANONICALIZED`
Phase: `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`
Scope: methodology/knowledge-base/authoring semantics for understanding systems before abstraction, architecture, implementation, publication and operation. No product implementation or Planning C decision.

## Research question

How should Generation 2 maximize the quantity and quality of questions answered so that a client system can be generated, controlled, operated, monitored, governed and evolved without confusing conversational completeness with semantic understanding?

The research does **not** support a static questionnaire as the primary model. The strongest candidate is a versioned `Elicitation Knowledge Base` (EKB): capability-aware, context-aware, adaptive, auditable, provenance-qualified and usable by humans, Wizards and AI.

Candidate invariant under research:

`question answered != concept resolved != evidence sufficient != contradiction cleared != artifact implementation-ready != production-ready`

## Evidence basis

- IIBA/BABOK separates preparation, conducting elicitation, confirmation of elicitation results, communication and stakeholder collaboration; it also treats requirements traceability, maintenance, change assessment and approval as lifecycle activities rather than one-time intake. https://www.iiba.org/knowledgehub/the-business-analysis-standard/5-applying-business-analysis-tasks/5-3-business-analysis-knowledge-areas/elicitation-and-collaboration/ and https://www.iiba.org/knowledgehub/business-analysis-body-of-knowledge-babok-guide/key-concepts/ (accessed 2026-09-06).
- IIBA defines traceability as tracking relationships from stakeholder need through requirements/designs to implemented solution, supporting impact analysis when change occurs. https://www.iiba.org/knowledgehub/the-business-analysis-standard/4-implementing-business-analysis/4-4-understanding-requirements-and-designs/ and https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/glossary/ (accessed 2026-09-06).
- IIBA stakeholder guidance emphasizes that stakeholder sets overlap across systems/processes and that elicitation should be planned to avoid redundant or siloed engagement. https://www.iiba.org/professional-development/knowledge-centre/ba-connection/business-analysis-for-the-parent-and-child-project-structure/ (accessed 2026-09-06).
- Contextual inquiry/field study evidence supports observing real work in context because tacit behaviors and workarounds are often absent from interview statements. https://www.nngroup.com/videos/contextual-inquiry/ (accessed 2026-09-06).
- OWASP threat-model guidance starts by modeling actors, components, data stores, flows, trust zones/boundaries and assumptions, then asks what can go wrong and whether residual issues remain. Business-logic threat modeling explicitly probes out-of-order, repeated and concurrent actions. https://owasp.org/www-project-threat-modeling/ and https://cheatsheetseries.owasp.org/cheatsheets/Business_Logic_Security_Cheat_Sheet.html (accessed 2026-09-06).
- Process-mining/conformance work distinguishes the prescribed model from observed event-log behavior and uses their mismatch to reveal violations or outdated models. https://www.processmining.org/old-version/conf-checker.html (accessed 2026-09-06).
- Google SRE launch-readiness material requires concrete questions about capacity, dependencies, failure detection, retries, backup/restore, monitoring and rollout. https://sre.google/sre-book/launch-checklist/ (accessed 2026-09-06).
- NIST Privacy Framework treats privacy over the complete data lifecycle and expects reassessment as systems continue operating, reinforcing lifecycle/currentness rather than one-time signoff. https://www.nist.gov/privacy-framework/getting-started-0 and https://www.nist.gov/privacy-framework/using-privacy-framework-11 (accessed 2026-09-06).

## Candidate Elicitation Knowledge Base

The EKB is a versioned knowledge model, not a list of prose prompts. A candidate `QuestionDefinition` carries:

- stable question identifier and revision;
- purpose and question family;
- applicability expression and exclusions;
- capability/object/context bindings;
- concepts expected to be discovered or qualified;
- preconditions and prerequisites;
- follow-up rules triggered by answer kind, ambiguity, contradiction, missing evidence or material risk;
- ambiguity and contradiction signals;
- expected evidence classes and freshness/currentness expectations;
- unresolved severity if unanswered/unsupported;
- downstream artifacts that depend on the answer;
- semantic owner/routing target;
- provenance: why the question was asked, which gap triggered it, which KB revision generated it and who/what supplied the response.

A candidate `QuestionOccurrence` is distinct from its definition. It binds the question to a concrete client/workspace/site/capability/object/revision/stakeholder and records answers/evidence/currentness without mutating the reusable question definition.

`QuestionDefinition != QuestionOccurrence != Answer != Finding != Decision`.

## Information-kind discipline

Elicitation records must preserve semantic kind rather than collapse all prose into “requirements”:

- `Fact`: asserted observable/domain fact with source/currentness.
- `Claim`: stakeholder/system assertion not yet sufficiently established as fact.
- `Assumption`: proposition temporarily relied upon with explicit owner/risk/revalidation trigger.
- `InferredCandidate`: machine/human inference awaiting confirmation; AI output begins here unless independently established.
- `Decision`: governed choice with authority, alternatives/context and revision.
- `Requirement`: needed outcome/behavior/quality with owner/source and validation route.
- `Constraint`: limitation or boundary that restricts valid solution space.
- `OpenQuestion`: unresolved information obligation.
- `Conflict`: incompatible claims/requirements/decisions/observations requiring classification; still `ConflictPattern != ConflictInstance` where applicable.
- `Unknown`: explicitly unavailable/indeterminate state, not an empty string.
- `OutOfScope`: excluded with owner/reason/scope revision.
- `Deferred`: applicable but intentionally postponed with owner/trigger/debt.

Promotion between kinds must be explicit and traceable. `Assumption -> Fact` cannot occur merely because the same text was repeated by multiple sources; source independence, evidence and currentness matter.

## Adaptive elicitation loop

Candidate loop:

1. establish context and scope slice;
2. select universal + capability-specific lenses;
3. identify stakeholder/evidence sources and coverage gaps;
4. ask a bounded batch with cognitive-load-aware sequencing;
5. classify responses by information kind;
6. attach evidence/currentness/provenance;
7. detect ambiguity, contradiction, negative space and missing semantic owners;
8. generate follow-ups and cross-capability routes;
9. derive/update artifacts without losing source linkage;
10. evaluate multidimensional sufficiency gates;
11. reopen questions when material revisions invalidate prior evidence.

AI may prioritize and propose follow-ups, but `AI inference = candidate`, not authority. Deterministic rules should own mandatory-gate logic, semantic-kind constraints and high-severity unresolved blocking.

## Stakeholder and evidence coverage

A single stakeholder cannot be treated as universal truth source. Candidate source roles include sponsor/process owner, actual operator/end user, domain SME, operational support/on-call, security/privacy/compliance, data owner/steward, finance/commercial, integration/provider owner, implementer/maintainer, tester/assurance, regulator/auditor where applicable, and observed-system evidence.

Coverage must distinguish stakeholder categories from individual identities and must record where one person fills multiple roles. Tacit knowledge requires observation, artifacts, logs, examples, screenshots/forms, event traces, runbooks, reports, APIs/schemas/configuration and brownfield mirroring evidence in addition to interviews.

Contradiction rule candidate: independent sources that disagree create a governed unresolved state; the system does not select a winner by confidence score alone.

## Greenfield and brownfield modes

### Greenfield

`AI-first + Wizard-validated + Expert-direct`.

AI can propose system decomposition and likely questions; Master Wizard routes to capability sub-wizards; experts may edit structured models directly. Mandatory gaps remain visible regardless of conversational fluency.

### Brownfield

`Mirroring-first + AI-assisted + Human-mapped + Wizard-completed`.

Observed artifacts/events/configuration/process behavior are first-class evidence. AI suggests mappings into canonical concepts, humans validate semantic ownership, and Wizards target unresolved/contradictory/negative-space gaps. Existing behavior is evidence of current state, not automatic desired requirement.

## Master Wizard and sub-wizards

Avoid a monolithic questionnaire. Candidate UX:

- Master Wizard owns scope, context, stakeholder/evidence map, coverage view and unresolved-question routing;
- capability-specific sub-wizards own specialized question lenses;
- cross-capability router avoids duplicate ownership while surfacing shared dependencies;
- `Unresolved Questions Inbox` exposes severity, owner, context, evidence/currentness, blocked artifacts and follow-up route;
- expert-direct mode permits structured authoring without forcing wizard traversal;
- AI conversation may front the experience but cannot hide unresolved mandatory dimensions.

## Artifact derivation semantics

Elicitation may derive or qualify:

- User Stories: intention/value/context, never standalone complete specification;
- Use Cases: actor, trigger, preconditions, main/alternate/failure/recovery flows, external effects and postconditions;
- Scenarios: happy, alternate, boundary, failure, abuse/misuse, recovery, offline, concurrency, temporal/version-change;
- Requirements/Constraints: functional, non-functional, operational, governance/compliance;
- Acceptance Criteria and Product Proof obligations;
- Semantic References to capabilities, actors, authority, data, workflows, decisions, formulas, UI, providers, evidence and risks.

No generated artifact may erase uncertainty or origin. A generated story/use case is a derived artifact with provenance and must remain reopenable when its source evidence changes.

## Traceability hypothesis

Candidate chain:

`Source/Elicitation Evidence -> Answer/Finding -> Requirement/Constraint -> User Story/Use Case/Scenario -> Semantic Model -> Capability/Workflow/Data/etc. -> Acceptance Criterion -> Test/Product Proof -> Runtime Evidence`

Traceability is many-to-many and revision-qualified. It is not proof of correctness. A link means “related/derived/validated-by” according to an explicit relation kind, not causality or authority by default.

## Cross-capability routing

Questions may discover concepts owned elsewhere. Candidate rule: capture at point of discovery, then route a semantic reference to the canonical owner rather than cloning ownership.

Examples:

- workflow interview discovers retention rule -> Privacy/Data Governance owns the rule; Workflow references it;
- UI interview discovers approval authority -> Authorization/Governance owner; UI projects it;
- provider interview discovers queue/backlog SLO -> Integration/Provider + Operability lens references it;
- commercial interview discovers formula -> mathematical semantics owner/reference, not duplicated arithmetic in billing prose.

## Negative-space and false-complete prevention

Mandatory probes include:

- who/what is missing from stakeholder/evidence coverage?
- what happens before/after the described happy path?
- what may fail, race, repeat, arrive late, remain `UNKNOWN`, be operated offline or cross a revision boundary?
- what external effect is assumed but not evidenced?
- which answer is stale or merely copied from prior documentation?
- which dimension was marked `N/A` without evidence/rationale?
- which generated artifact has no source/owner/currentness?
- what contradiction exists between story, use case, workflow, data, authority, provider or operational evidence?

A question with text is not automatically resolved. `RESOLVED` requires the gate-specific semantics/evidence expected for that question/context.

## Relationship to Operability Elicitation

`OPERABILITY_ELICITATION_LENS_RESEARCH.md` remains a specialized cross-cutting lens. Feature elicitation and Production Readiness Coverage are separate. Every material capability/workflow/integration/provider can trigger questions such as:

- How do we know it works end-to-end?
- How do we detect degradation?
- Who responds and escalates?
- Which evidence proves recovery/convergence?
- Which state can remain `UNKNOWN`, and for how long?
- What delay/loss is acceptable?
- How is retry/reconciliation qualified?
- How do we validate after change/deploy?

## Adversarial method proofs

The EKB hypothesis must later prove resistance to:

- stakeholder coverage gaps;
- happy-path-only specification;
- assumption-to-fact promotion;
- hidden contradiction;
- stale evidence reused after revision;
- story/use-case/workflow inconsistency;
- `N/A` abuse;
- `RESOLVED` without expected evidence;
- AI early termination;
- duplicate/conflicting cross-capability ownership;
- false completeness through averaging;
- brownfield behavior promoted automatically into desired requirement;
- operational readiness hidden behind feature completeness.

These are detection candidates/research obligations, not automatic remediations.

## Planning C carry-forward

Planning C must decide, without assuming adoption:

- ownership/model of the Elicitation Knowledge Base;
- question definition/occurrence taxonomy and revision semantics;
- adaptive routing and deterministic versus AI responsibilities;
- evidence/provenance/currentness model;
- information-kind taxonomy and promotion rules;
- UserStory/UseCase/Scenario structured models;
- traceability relation taxonomy;
- contradiction/unresolved-question model;
- capability elicitation lenses;
- coverage/sufficiency gates;
- Master Wizard/sub-wizard/expert-direct surfaces;
- Brownfield/Mirroring ingestion boundary;
- relationship to Operability/Production Readiness Coverage.

Possible disposition remains open: methodology, cross-cutting semantics, knowledge-base/authoring infrastructure, projection, analyzer, provider boundary or `DO NOT BUILD`. No 29th canonical capability is implied.

## Planning D / E carry-forward

Planning D must support incremental coexistence of free-form notes/documents and structured evidence, with bounded provenance backfill and no fabricated historical certainty.

Planning E must require executable/product proofs for adaptive questioning, contradiction/unresolved handling, stakeholder/capability coverage, derived story/use-case/scenario traceability, critical-gap detection, operational-readiness elicitation, evidence/currentness invalidation and no false `complete` state.

## Research disposition

`KEEP AS MATERIAL CROSS-CUTTING RESEARCH HYPOTHESIS`.

No implementation, Work Package, TASK, Construction, automatic remediation, architecture commitment or canonical-capability promotion is authorized by this artifact.