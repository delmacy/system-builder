# Generation 2 — Planning C Target Architecture Entry Framework

Status: `ACTIVE / ENTRY FRAMEWORK`
Phase: `PLANNING_C_TARGET_ARCHITECTURE`
Scope: target-architecture planning only. No product implementation, Work Packages, executive TASKs, Construction or remediation.

## Entry authority

Planning C is entered only because the authoritative Generation 2 pipeline state closed `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION` as `CLOSED / SATURATED / PASS` after Full Passes 1–8, 28/28 canonical capabilities, 12/12 mandatory high-risk clusters, and the final adversarial negative-space review.

The inherited adversarial inventory is fixed at the entry boundary:

- 284 material edge scenarios;
- 124 reusable `ConflictPattern`s;
- 408 material adversarial findings total;
- 0 HIGH/CRITICAL finding without a semantic owner, proof obligation, or detection route.

Planning C consumes those findings as architecture constraints and proof obligations. It does not silently turn research findings into remediations or `ConflictInstance`s.

Standing invariants remain mandatory:

- `Research != remediation`;
- `ConflictPattern != ConflictInstance`;
- `Signal != ConfirmedConflict`;
- `observed behavior != intended process != approved canonical process`;
- `provider reported state != physical truth`;
- `AI inference = candidate`, never authority;
- `question answered != concept resolved != evidence sufficient != contradiction cleared != implementation-ready != production-ready`.

## Planning C goal

Planning C must produce a coherent, decision-backed target architecture for Generation 2 in which target planes, universal primitives, portable semantic definitions/IR, execution/evidence models, provider/binding boundaries, lifecycle/revision semantics, and cross-capability ownership are explicit enough for Planning D migration ordering and Planning E product proofs.

Planning C must not optimize for current implementation convenience. Planning B remains the authority for current repository truth; Planning C defines the target while recording deliberate compatibility/coexistence constraints that Planning D will later sequence.

## Architecture decision layers

Planning C will proceed in dependency order rather than capability-list order where architecture decisions are shared.

### C0 — Architecture constitution and universal semantic substrate

Decide the architecture-wide contracts that multiple capabilities depend upon before capability-specific target decisions:

- Typed Semantic Graph and graph identity/reference rules;
- `ExecutionEnvelope` / execution state / journal / external-effect state;
- semantic ownership and cross-capability references;
- definition/revision identity and valid-time/transaction-time where applicable;
- provenance/lineage/evidence/currentness primitives;
- analytical kinds, units, multidimensional/vector and uncertainty semantics;
- decision/rule/calculation separation;
- control-flow and workflow completion/soundness obligations;
- inter-system/federated graph semantics;
- provider/binding/adapter qualification and portable-versus-provider-specific extension rules;
- graph transformation/revision and supersession model;
- queue/backpressure/capacity semantics where they cross capability boundaries;
- local runtime versus Fleet/global observation/authority boundaries.

C0 must explicitly prevent semantic-kind erasure, authority amplification, false currentness, and proof claims that exceed their evidence population.

### C1 — Elicitation & System Understanding architecture

Planning C must decide the disposition and ownership of the cross-cutting Elicitation/System Understanding research without automatically promoting it to a 29th canonical capability.

Required decisions:

- `Elicitation Knowledge Base` ownership and storage/semantic model;
- `QuestionDefinition` versus `QuestionOccurrence` identity and revisioning;
- question taxonomy and capability/context applicability;
- adaptive follow-up routing and deterministic versus AI responsibilities;
- answer/information kinds: `Fact`, `Claim`, `Assumption`, `InferredCandidate`, `Decision`, `Requirement`, `Constraint`, `OpenQuestion`, `Conflict`, `Unknown`, `OutOfScope`, `Deferred`;
- evidence, source/respondent/owner, timestamp/effective period, confidence/status, artifact support and supersession lineage;
- contradiction handling without silent winner selection;
- `Unresolved Questions Inbox` semantics, owner/severity/context/blocked-artifact linkage;
- stakeholder/evidence coverage and missing-stakeholder detection;
- multidimensional coverage states `UNTOUCHED`, `DISCOVERING`, `PARTIAL`, `RESOLVED`, `CONFLICTED`, `BLOCKED`, `NOT_APPLICABLE`, `DEFERRED`;
- sufficiency gates for abstraction, candidate architecture, implementation, and publish/operation without a single false quality score;
- derivation models for User Stories, Use Cases, Scenarios, Requirements/Constraints, Acceptance Criteria and Product Proof obligations;
- typed traceability relations from source evidence through semantic model, proof and runtime evidence;
- capability-specific elicitation lenses and cross-capability answer routing;
- Master Wizard, capability sub-wizards, expert-direct and AI-assisted boundaries;
- separate Production Readiness Coverage so feature discovery cannot masquerade as operability readiness;
- Brownfield path `Mirroring-first + AI-assisted + Human-mapped + Wizard-completed` and greenfield path `AI-first + Wizard-validated + Expert-direct`.

Planning C must compare at minimum static questionnaire, fully conversational AI, deterministic wizard, capability-specific schemas and hybrid knowledge-base approaches. The research-leading hypothesis is hybrid, auditable and extensible, but Planning C must record the actual decision and rejected alternatives.

### C2 — Physical / Peripheral Integration boundary

Planning C must decide a deliberately bounded integration/governance-plane architecture for external specialized physical systems.

Canonical semantic distinctions to decide/include where applicable:

- semantic capability;
- specialized external system/control plane;
- device class and device instance;
- provider adapter/protocol/edge gateway;
- external account/user/subject mapping;
- external permission/grant/group/site/resource scope;
- event/telemetry/read/query state with provenance and freshness;
- optional physical effect as a separately governed operation class.

Default target boundary to evaluate:

- System Builder owns semantic/integration/governance concerns: inventory, identity/resource mapping, user/account provisioning lifecycle, permission/grant synchronization, least privilege, revoke/deprovision, access brokering, read/query/status/event ingestion, source-of-truth declaration, drift detection, reconciliation, audit/provenance and currentness;
- VMS, access-control platform, BMS/HVAC, PDV, industrial controller or device-management platform remains specialized media/control plane for streaming, codecs, recording, control loops, fiscal/payment terminal behavior, low-level actuation, biometric matching and other domain-specialized mechanics;
- provider-specific features remain explicit extensions and cannot contaminate portable canonical semantics;
- edge/site gateway may bridge locality/protocol/offline buffering but is not a central device controller by default.

Planning C must make a separate explicit decision on whether **any** direct physical actuation capability exists. Absence of such a decision means actuation is not inherited from generic Integration. If an actuation capability is admitted, it requires separate safety/authority/proof obligations and must remain provider-/domain-qualified.

### C3 — Canonical capability target architecture

After C0–C2 stabilize shared semantics, each of the 28 canonical capabilities receives a target-architecture decision record against:

- canonical responsibility and non-responsibility;
- owned semantic types and referenced foreign types;
- portable definition/IR;
- runtime/execution boundary;
- provider/binding boundary;
- authority and tenant/site scope;
- data/source-of-truth/currentness;
- lifecycle/revision/coexistence;
- failure/`PARTIAL`/`UNKNOWN`/reconciliation semantics;
- provenance/evidence/audit;
- security/privacy/trust;
- operability/observability/capacity;
- elicitation lens and critical unresolved dimensions;
- inherited adversarial patterns/proof obligations;
- Planning D migration constraints;
- Planning E product-proof candidates.

Capability target decisions must preserve Planning A boundaries unless Planning C records an explicit architecture-level contradiction requiring later Architecture Reconciliation. Planning C does not silently rewrite taxonomy.

## Cross-cutting architecture obligations carried from research

The following remain first-class constraints throughout Planning C:

1. Typed Semantic Graph must preserve semantic kind and ownership rather than flattening capability models into arbitrary JSON or UI schemas.
2. Execution must distinguish invocation, attempt, provider acknowledgement, observed state and business/external effect; durable journal/evidence semantics must support `APPLIED`, `NOT_APPLIED`, `PARTIAL`, `UNKNOWN` or equivalent qualified states where required.
3. Workflow semantics must cover control-flow primitives, terminal/completion semantics, retry, cancellation, compensation, concurrency, offline/late work and proof/soundness obligations.
4. Mathematical/analytical semantics remain cross-cutting/providerized mechanics with portable semantic kinds for formulas, units, dimensions, vectors, uncertainty, rounding/precision and provenance.
5. Temporal/dynamic graph and revision semantics must preserve historical behavior, in-flight pinned revisions, supersession/coexistence and retroactive correction without rewriting history silently.
6. Inter-system/federated graph semantics must qualify local/global authority, observation/currentness, ownership, identity and proof populations.
7. Legacy Mirroring/Brownfield Assimilation must preserve evidence-versus-authority: discovered behavior/configuration/data/workarounds are candidates/evidence until mapped and governed.
8. Autonomous builds/Fleet must preserve local-runtime autonomy while Fleet/global surfaces remain qualified observations/control intents rather than omniscient truth.
9. Provider portability must separate canonical semantics from vendor mechanics, with migration/coexistence and provider-specific capability matrices left explicit.
10. Operability/Production Readiness must be independently elicited and evidenced: feature acceptance cannot close failure/recovery/observability/capacity gaps.
11. AI/low-code must not amplify authority, erase uncertainty, suppress contradictions or promote inferred candidates into authoritative requirements/decisions.
12. Causal/counterfactual research remains research/analytical semantics unless separately governed; analytical output is not decision authority by default.

## Decision record requirements

Every material Planning C decision should record:

- decision identifier and status;
- problem and inherited research/Planning A/Planning B authorities;
- chosen target model;
- alternatives considered;
- semantic owner(s);
- invariants and non-goals;
- compatibility/coexistence assumptions deferred to Planning D;
- proof obligations deferred to Planning E;
- affected capabilities and cross-cutting models;
- unresolved questions/conflicts, without silently resolving contradictory evidence;
- evidence/provenance references.

A Planning C document can be `PROPOSED`, `DECIDED`, `BLOCKED`, or `SUPERSEDED`. `DECIDED` means architecture decision complete for its scope, not implemented.

## Gate model for Planning C

Planning C may close only when all architecture-wide decisions and all 28 canonical capability target decisions have a recorded disposition and no architecture-level HIGH/CRITICAL obligation lacks an owner and a Planning D/Planning E route.

Required closure evidence includes at least:

- coherent architecture planes and universal primitives;
- portable semantic definition/IR and provider/binding model;
- execution/evidence/provenance/currentness model;
- revision/coexistence and federated/local/Fleet boundaries;
- Elicitation Knowledge Base/Wizard/AI/coverage/traceability decisions;
- bounded Physical/Peripheral decision, including explicit actuation disposition;
- all 408 adversarial findings mapped to target constraints/proof routes without being mislabeled as remediated;
- per-capability target architecture coverage 28/28;
- unresolved architecture conflicts explicitly blocked/routed rather than hidden.

Planning D remains forbidden until this gate is explicitly `CLOSED / PASS`.

## First decision sequence

The next Planning C action should begin **C0 — Universal Capability Architecture / Semantic Substrate** because downstream Elicitation, Physical/Peripheral and per-capability target records depend on stable ownership/reference/revision/evidence/provider semantics.

The first target record should therefore decide the architecture-level semantic substrate and planes, while carrying Elicitation and Physical/Peripheral requirements as consumers/constraints rather than attempting to finalize those two areas prematurely.

## Non-goals of this entry action

This entry framework intentionally does not:

- implement product code;
- create Work Packages or TASKs;
- perform remediation;
- reopen adversarial saturation without material novelty;
- create a 29th canonical capability;
- decide the EKB implementation technology;
- decide that physical actuation exists;
- collapse provider platforms into System Builder;
- claim all Planning C architecture decisions are complete.
