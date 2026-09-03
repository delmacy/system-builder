# Generation 2 — Planning A: Process & Application Modeling Boundaries

Status: COMPLETE_FOR_CAPABILITY — PLANNING_A_TAXONOMY_BOUNDARIES
Capability: Process & Application Modeling
Authority inputs: `project_docs/generation-2/synthesis/CAPABILITY_SYNTHESIS.md`, authoritative Generation 2 research corpus, Universal Capability Architecture Planning A, and AGWS Planning A.

This document defines taxonomy ownership and boundaries only. It does not assert current System Builder implementation, choose providers, define target modules, materialize WBS/TASKs, execute Construction, or enter Planning B.

## 1. Canonical ownership

Process & Application Modeling owns the canonical semantic description of a business/application model before realization: process definitions, application composition intent, domain-facing model references, process/application identity, model revisions and lineage, explicit imports and normalization decisions, and the semantic relationships needed for downstream Workflow, Data, UI, AGWS and Integration consumers.

It owns what the modeled process/application *means*. It does not own durable execution, physical schema realization, rendered UI, provider bindings, external automation execution, policy decisions, or generic lifecycle infrastructure.

## 2. Source of truth

The source of truth is the revisioned canonical process/application model plus explicit lineage connecting authored, imported, normalized, superseded and adopted revisions. Provider-native definitions, discovered brownfield structures, runtime observations, generated UI, workflow histories and database schemas are evidence or realizations unless an authorized adoption/normalization transition makes their semantics canonical.

Canonical truth therefore cannot be silently reconstructed from whichever provider or runtime is currently reachable.

## 3. Identity and lineage

Canonical process/application identities are stable semantic identities and are distinct from BPM engine IDs, external application IDs, table/schema IDs, route IDs, provider resource IDs or generated artifact IDs. External identities are carried through typed bindings with provider/tenant/resource context and revision/currentness evidence.

Imports preserve origin and transformation lineage. Normalization must record source identity/revision, transformation or mapping revision, unresolved constructs, resulting canonical revision and evidence. Ambiguous identity or mapping yields `PARTIAL` or `INCONCLUSIVE`; name matching or first-match behavior cannot establish canonical equivalence.

## 4. Brownfield/import boundary

Brownfield ingestion may discover processes, schemas, forms, APIs, workflows and application structures, but discovery is not adoption. Process & Application Modeling owns semantic normalization of imported process/application intent and the decision boundary between:

- faithfully represented canonical semantics;
- provider-specific realization detail retained as an external binding/extension;
- unresolved or lossy semantics requiring explicit review;
- intentionally excluded implementation detail.

Importers/adapters belong to Integration or provider-specific realization where appropriate; they cannot silently mutate canonical process/application truth.

## 5. Revision, concurrency and evolution

Process & Application Modeling owns domain-specific compatibility and invariants between model revisions. Universal Capability Architecture supplies revision-vector and qualified-evidence structures; Lifecycle owns cross-capability coexistence/migration/withdrawal relations.

Concurrent edits require explicit base revision, conflict detection and lineage-preserving resolution. A stale proposal cannot overwrite a newer canonical revision merely because it is syntactically valid. Material semantic conflicts require reconciliation or `INCONCLUSIVE`, not last-write-wins by default.

A model revision becoming current does not imply that workflow instances, schemas, surfaces, integrations or deployed runtimes have converged to it. Those owners must independently qualify migration/effectiveness.

## 6. Relationship to Workflow & Durable Execution

Process Modeling owns canonical process semantics and execution intent; Workflow owns durable execution state, timers, retries, human-task runtime, redrive and in-flight evolution. A workflow-engine definition is a realization of process semantics, not automatically the canonical process model.

Process revision and workflow-runtime version may coexist independently. Migration of in-flight instances requires Workflow/Lifecycle qualification and cannot be inferred from model publication.

## 7. Relationship to Data / Schema / Migrations

Process/Application Modeling may reference domain concepts and required information but does not own physical/logical persistence schema lifecycle. Data/Schema owns schema/data identity, compatibility, migration/backfill/cutover and data-state evolution.

A modeling request that requires a new canonical entity/field/schema invariant must cross the owning domain/data authority boundary rather than smuggling schema mutation through UI, AGWS, AI or import normalization.

## 8. Relationship to UI and AGWS

UI / Generated Experience owns semantic projection, rendering, accessibility and component realization. AGWS remains a distinct CORE owner of governed work-surface semantics, inherited mandatory components, effective overlays and Station capability exposure.

Process/Application Modeling may expose semantic actions, tasks, data needs and navigation intent to those consumers, but does not own layout/rendering or personal work-surface specialization. AGWS personalization cannot mutate canonical process/application semantics without explicit authority escalation.

`Enterprise → Station → Role → Person` remains monotonic: a Station can expose a subset of modeled capabilities, and lower layers can specialize only delegated surface behavior. Omission or presentation changes do not rewrite canonical process truth.

## 9. Relationship to Integration & Automation

Integration owns external triggers, adapters, subscriptions, automation execution, receipts/replay and external-system interaction. Process/Application Modeling may declare semantic integration needs or references but does not own transport/provider execution.

An external system's process or application representation remains external until explicitly normalized/adopted. Ambiguous remote mutations preserve `UNKNOWN` effect semantics and require reconciliation before unsafe retry.

## 10. Relationship to Provider / Binding / Capability Negotiation

Provider/Binding owns provider discovery, support qualification, admission, binding, fallback, coexistence, cutover and withdrawal. Process/Application Modeling owns the provider-neutral semantic requirement that a realization must satisfy.

Provider IDs are non-canonical unless explicitly adopted by the semantic owner. Provider substitution may preserve canonical process/application identity while changing realization identities and support vectors. Unsupported or partially supported semantics must remain visible rather than being flattened into `supported=true`.

## 11. Relationship to Lifecycle / Versioning / Evolution / Migration

Process/Application Modeling owns model-specific compatibility predicates and semantic postconditions. Lifecycle owns generic revision coexistence, migration readiness/currentness, withdrawal and rollback/state-recovery distinctions.

Historical model revisions remain lineage-addressable. Rollback is a current qualified capability requiring compatible downstream workflow/data/UI/integration/runtime state; historical existence alone is not rollback eligibility.

## 12. Relationship to Universal Capability Architecture

UCA provides reusable identity, revision, qualified claim/evidence, effect disposition, support-vector, authority and correction/supersession structures. It cannot define a universal process/application model or decide process-specific compatibility.

Process/Application Modeling is therefore a semantic owner consuming UCA contracts, not a specialization hidden inside UCA.

## 13. AI proposal vs authority boundary

AI may elicit intent, propose process/application structures, suggest normalization mappings and generate candidate revisions. AI is not canonical authority.

Every AI-produced change is a proposal tied to a base revision, evidence/provenance and an authority envelope. AI cannot silently:

- create or alter canonical domain/schema invariants;
- adopt an external/provider identity as canonical;
- widen Station/Role/Person authority;
- bypass policy/governance approval;
- convert ambiguous import mappings into asserted equivalence;
- treat provider capability discovery as permission to change canonical semantics.

Requests outside delegated authority must be detected and escalated.

## 14. Failure and `INCONCLUSIVE` semantics

First-class non-success outcomes include unresolved import semantics, ambiguous identity mapping, stale base revision, incompatible concurrent edits, missing provider support evidence, lossy normalization, unavailable required source evidence and downstream realization state that cannot be qualified.

These conditions yield explicit rejection, `PARTIAL`, `UNKNOWN` effect where mutation ambiguity exists, or `INCONCLUSIVE` where evidence is insufficient. They must not be coerced into successful canonical adoption.

## 15. Non-goals

Process & Application Modeling does not own:

1. durable workflow execution/history;
2. database/schema migration execution;
3. UI rendering or AGWS personalization;
4. provider discovery/admission/binding;
5. integration transport/automation runtime;
6. authorization/policy decisions;
7. generic lifecycle orchestration;
8. architecture-wide common primitives;
9. provider-native model formats as universal truth;
10. an AI-controlled canonical mutation path.

## 16. Preserved proof obligations

Later phases must prove at minimum:

1. canonical process/application identity survives provider/runtime substitution;
2. brownfield import preserves origin and transformation lineage;
3. unresolved/lossy mappings remain explicit and cannot silently become canonical;
4. concurrent/stale edits cannot overwrite canonical truth without reconciliation;
5. model publication does not falsely imply downstream workflow/data/UI/runtime convergence;
6. provider support differences remain visible through qualified support vectors;
7. AI proposals cannot exceed delegated authority or smuggle domain/schema changes;
8. AGWS personalization cannot mutate canonical process semantics;
9. rollback/evolution is qualified across affected downstream owners rather than inferred from revision history.

## 17. Planning B repository-validation questions

Record only for later `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`:

1. Where does current SB store canonical process/application definitions and revision lineage?
2. Are imported/brownfield/provider definitions distinguished from adopted canonical semantics?
3. Are external/provider IDs used as canonical process/application identity anywhere?
4. How are concurrent/stale model edits detected and reconciled?
5. Are process-model revisions incorrectly coupled to workflow-engine, schema, UI or artifact versions?
6. Can generated UI/AGWS/AI paths mutate process/domain semantics without an explicit authority transition?
7. Are lossy/ambiguous imports represented as `PARTIAL/INCONCLUSIVE` or flattened into success?
8. Are provider capability differences and model realization constraints explicit?
9. Is rollback eligibility qualified across workflow/data/integration/runtime state?

These questions must not be answered during Planning A.

## 18. Planning A capability decision

**PASS_FOR_CAPABILITY.** Process & Application Modeling has explicit canonical ownership, source-of-truth limits, brownfield/import normalization boundary, identity/lineage rules, revision/concurrency responsibilities, neighbor-owner boundaries, AI non-amplification, failure semantics, non-goals and preserved proof obligations.

No new capability, finding or synthesis contradiction is created by this boundary pass. AGWS remains distinct; `Enterprise → Station → Role → Person`, Station delegated capability exposure, provider IDs as non-canonical-by-default and UCA anti-god-object constraints remain preserved.
