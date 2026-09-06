# Generation 2 — Elicitation Coverage & Sufficiency Research

Status: `RESEARCH SUB-ARTIFACT / NOT CANONICALIZED`
Parent: `ELICITATION_SYSTEM_UNDERSTANDING_METHODOLOGY_RESEARCH.md`

## Principle

Do not use a single completeness/quality percentage as the primary truth. Elicitation sufficiency is multidimensional, object/capability/revision-specific and evidence-qualified.

Candidate coverage states:

`UNTOUCHED | DISCOVERING | PARTIAL | RESOLVED | CONFLICTED | BLOCKED | NOT_APPLICABLE | DEFERRED`

Every nontrivial state should preserve evidence/currentness, owner and rationale where applicable.

## Candidate coverage dimensions

For each applicable capability/object/workflow/integration/provider:

- purpose/outcome;
- actors/stakeholders;
- authority/responsibility;
- inputs;
- outputs/external effects;
- source of truth;
- state/transitions;
- time/currentness/SLA;
- exception/boundary behavior;
- failure/recovery/reconciliation;
- integrations/providers;
- security/trust;
- privacy/data governance;
- evidence/audit/provenance;
- lifecycle;
- versioning/change;
- scale/capacity;
- observability/operations;
- UX/forms/interactions;
- acceptance/product proof.

Additional capability-specific dimensions may exist, but they must not overwrite universal ownership.

## State semantics

- `UNTOUCHED`: no meaningful elicitation yet.
- `DISCOVERING`: active evidence/question collection; model intentionally incomplete.
- `PARTIAL`: material semantics exist but one or more applicable obligations remain unresolved.
- `RESOLVED`: sufficiently explicit for the named gate/context, with expected evidence/currentness; not a guarantee of runtime correctness.
- `CONFLICTED`: incompatible claims/requirements/evidence remain; not automatically a confirmed runtime defect.
- `BLOCKED`: resolution requires missing authority/evidence/dependency.
- `NOT_APPLICABLE`: applicability evaluated and excluded with rationale/owner/revision.
- `DEFERRED`: applicable obligation intentionally postponed with owner, debt and re-entry trigger.

`RESOLVED` is gate-relative. A dimension can be resolved for abstraction but insufficient for implementation or operation.

## Separate sufficiency gates

Candidate gates:

1. `SUFFICIENT_FOR_ABSTRACTION` — enough semantic evidence to identify bounded concepts/capabilities without inventing ownership.
2. `SUFFICIENT_FOR_CANDIDATE_ARCHITECTURE` — enough constraints/interactions/nonfunctional obligations to compare architectures responsibly.
3. `SUFFICIENT_FOR_IMPLEMENTATION` — implementation-critical behavior/contracts/authority/data/failure/version semantics are resolved or explicitly dispositioned.
4. `SUFFICIENT_FOR_PUBLISH_OPERATION` — operational ownership/readiness, monitoring/currentness, capacity, failure/recovery/reconciliation, security/privacy and acceptance/product proof are sufficiently evidenced.

No gate means “complete forever”. Material change can invalidate prior qualification.

## False-complete blockers

A gate must not pass silently when:

- any applicable HIGH/CRITICAL unanswered question lacks disposition;
- HIGH/CRITICAL contradiction remains unresolved/unowned;
- required stakeholder/source category is missing for a critical semantic claim;
- critical answer lacks expected evidence/currentness;
- `NOT_APPLICABLE` is used without qualified rationale;
- derived artifact has no traceable source for a critical claim;
- feature completeness is used to substitute for Production Readiness Coverage;
- an AI-generated inference is the sole authority for a critical fact/decision;
- brownfield observed behavior is treated as desired semantics without governed adoption.

## Elicitation/Coverage Debt

Candidate debt record:

- object/capability/dimension;
- unresolved question or missing evidence;
- severity;
- owner;
- why deferred/blocked;
- affected downstream artifacts/gates;
- currentness/recheck trigger;
- acceptable interim assumptions, if any;
- expiry/escalation condition.

Debt must remain drillable; it cannot be hidden by averaging unrelated dimensions.

## Stakeholder/source coverage

Coverage should track roles/source classes separately from question count. A hundred answers from one stakeholder do not substitute for operational support, end-user, security/privacy, provider, finance or observed-system evidence where those perspectives are applicable.

Candidate negative-space check: identify critical semantic dimensions whose evidence comes from only one non-independent source.

## Relationship to Production Readiness Coverage

`OPERABILITY_ELICITATION_LENS_RESEARCH.md` defines a separate readiness matrix. Elicitation coverage and Production Readiness Coverage overlap in evidence but remain distinct views:

`feature/semantic elicitation coverage != production readiness coverage != runtime health`.

## Adversarial proofs

Later product proofs should demonstrate:

- a single overall percentage cannot hide a BLOCKED critical dimension;
- stale evidence reopens or invalidates the affected gate;
- contradictory sources prevent false RESOLVED;
- `NOT_APPLICABLE` requires rationale;
- capability-specific lenses can add obligations without duplicating cross-capability ownership;
- Brownfield/Mirroring evidence can improve coverage without becoming desired semantics automatically;
- AI cannot close a gate based solely on conversational confidence.

## Research disposition

Retain as cross-cutting sufficiency semantics for Planning C classification. No implementation or canonical-capability promotion.