# Generation 2 — Architecture Reconciliation as a Capability — Revisit 01

## Research question
How should System Builder represent architecture decisions, executable conformance obligations, evidence, drift, exceptions and remediation so architecture remains evolvable and auditable without collapsing human architectural judgment into CI rules or allowing prose-only invariants to drift from runtime reality?

## Representatives
1. ArchUnit — executable architecture rules over code structure and dependencies.
2. Open Policy Agent / Conftest — policy-as-code against repository/configuration/runtime-shaped evidence.
3. AWS Well-Architected Tool — architecture review lenses, workload assessments, milestones and improvement plans.
4. GitHub CODEOWNERS / protected review rules — repository-native ownership and governed approval boundaries.
5. Architectural fitness functions (Thoughtworks / evolutionary architecture) — continuous objective checks over architectural characteristics.
6. MADR / ADR practice — explicit architectural decision records and lifecycle-oriented decision documentation.

## Evidence/source ledger
- ArchUnit: architecture rules can automatically check dependencies, layers, slices and cycles using ordinary test infrastructure. Source of truth is executable rule plus inspected code artifact.
- OPA/Conftest: policy-as-code can validate repository/IaC/configuration artifacts in CI and can evaluate runtime-shaped JSON/YAML evidence. Source of truth is policy revision + evaluated input + result.
- AWS Well-Architected Tool: lenses consistently measure workloads against best practices; workloads can retain milestones, risks and improvement plans. Source of truth is workload revision + lens revision + review evidence.
- GitHub CODEOWNERS/protected reviews: repository paths can imply review authority, and branch/ruleset policy can require owner approval before merge. Source of truth is repository policy revision + changed paths + review result.
- Architectural fitness functions: architectural characteristics can be represented as continuously evaluated objective functions rather than periodic prose review only.
- MADR/ADR: architectural decisions are durable records; a decision record is not itself proof that the implementation conforms.

## Identity model
Distinct identities are required for:
- ArchitectureDecision: intent/rationale/constraints/non-goals and status.
- ArchitectureObligation: a normative invariant derived from one or more decisions.
- ConformanceRule: executable or reviewable realization of an obligation.
- EvidenceSnapshot: bounded observation of repository/runtime/configuration state.
- ConformanceEvaluation: rule + evidence + revisions + result.
- Waiver/ExceptionDecision: bounded authority to tolerate a known violation for scope/time/revision.
- DriftFinding: mismatch between effective architecture obligation and observed realization.
- RemediationDisposition: decision to harden/generalize/providerize/integrate/replace/defer/do-not-build or otherwise reconcile the drift.

## Lifecycle and versioning
Architecture decisions may be PROPOSED → ACCEPTED → SUPERSEDED/RETIRED, while obligations derived from them can have a different lifecycle and rollout window. Rules must be revision-bound and migration-safe: a new obligation may initially operate in observation/warn mode, then become blocking only after applicability and compatibility windows are explicit. Superseding an ADR does not retroactively invalidate historical conformance evidence; it changes which obligations are effective for future evaluations.

## Failure semantics
A failed conformance check means the evaluated evidence violated the evaluated rule under that rule revision. It does not by itself prove product failure, architectural invalidity, or authorization to repair. False positives, stale evidence, partial repository visibility and rule-engine failure require distinct outcomes such as VIOLATION, NOT_APPLICABLE, INCONCLUSIVE, ENGINE_ERROR and EVIDENCE_STALE.

## Extensibility and provider boundaries
Rules may be implemented through code-aware tools, generic policy engines, repository metadata, human review or runtime probes. The universal primitive is the obligation/evaluation/evidence contract, not ArchUnit, Rego, GitHub or any single provider. Provider replacement must preserve obligation semantics and evidence lineage.

## Governance
Waivers are governed decisions with issuer, authority scope, target obligation/finding, bounded subject, justification, expiry/review trigger and revision context. A waiver must not mutate or weaken the underlying architectural obligation for everyone else. Human architectural review remains authoritative where semantics cannot be reduced safely to deterministic rules.

## Observability
Conformance should expose: effective obligation revision, rule realization revision, evidence timestamp/freshness, result, affected scope, waiver status, drift age and remediation state. Repeated inconclusive or stale evaluations are themselves operational findings.

## Portability and lock-in
Architecture governance must remain portable across CI vendors, repository hosts and deployment providers. Repository-native mechanisms may implement enforcement but cannot become the semantic identity of the architecture rule. A rule expressed only as a proprietary workflow without provider-neutral obligation identity creates governance lock-in.

## Product-specific mechanisms vs universal primitives
Product-specific: ArchUnit predicates, Rego policies, CODEOWNERS patterns, AWS lenses, CI status checks.
Universal: decision, obligation, applicability scope, conformance rule realization, evidence snapshot, evaluation, waiver, drift finding, remediation disposition, provenance.

## Convergent patterns
- Architecture becomes durable when intent and executable checks are linked but remain distinct.
- Rules need explicit evaluated input/evidence; policy existence alone is not proof.
- Continuous automated checks complement, not replace, human architectural review.
- Governance requires explicit exception authority and traceable review outcomes.
- Architecture evaluation is revision- and scope-sensitive.

## Divergent patterns
- ArchUnit is code-structure-specific; OPA is generic structured-policy evaluation.
- AWS Well-Architected centers guided human review and risk tracking rather than hard merge blocking.
- GitHub enforcement is repository-host-specific and useful as a realization, not as the universal architecture model.

## Subcapabilities
- Architecture decision lifecycle and supersession.
- Obligation derivation and applicability.
- Executable fitness/conformance rules.
- Evidence freshness and provenance.
- Drift detection and aging.
- Waiver/exception lifecycle.
- Human review integration.
- Migration-safe enforcement rollout.
- Cross-plane conformance.
- Provider-neutral rule realization.

## Limited comparison with fresh main
A repository search for architecture/ADR/conformance/fitness terminology did not return sufficiently specific evidence for a defensible repository-wide comparison in this run. This is NOT evidence of absence. Detailed repository archaeology remains reserved for PLANNING_B_SB_CURRENT_STATE_RECONCILIATION.

## Reconciliation hypotheses
- KEEP: repository-native checks/reviews where they already encode useful product invariants.
- HARDEN: bind every architecture check to explicit obligation identity, revision, applicability and evidence.
- GENERALIZE: model conformance result/evidence independently of CI/tool implementation.
- PROVIDERIZE: allow multiple rule/evidence engines behind provider-neutral contracts.
- INTEGRATE: connect ADRs, findings, waivers, CI/runtime evidence and remediation lineage.
- REPLACE: prose-only invariant enforcement where a deterministic, safe fitness function exists.
- DEFER: rules whose semantics cannot yet be evaluated without repository archaeology.
- DO_NOT_BUILD: a universal proprietary policy language when existing rule engines can realize the contract.

## Adaptive Governed Work Surfaces composition
The following must become architecture obligations with executable or reviewable evidence rather than prose-only guidance:
- Effective surface resolution is monotonic across Enterprise → Station → Role → Person.
- Lower layers cannot remove or weaken mandatory superior components/invariants.
- Surface authoring remains constrained to semantic components/allowed layout primitives.
- AI materialization cannot create canonical domain/schema/process changes without escalation.
- Personal automation effective authority is bounded by Station/Role plus actor/binding/action policy.
- Provider-bound components remain semantically provider-neutral.
- Station/Role changes trigger personalization revalidation.
- Promotion Personal→Team/Role/System requires governed evidence and a new revision.

Each obligation requires applicability, deterministic evidence where possible, explicit human-review fallback where not, and waiver authority that cannot silently broaden Station/Role permissions.

## Repo-validation questions
1. Which current invariants exist only in documentation versus tests/CI/runtime validation?
2. Is there a stable repository identity for architecture decisions or only milestone/sprint prose?
3. Which CI checks can report structured evidence rather than pass/fail only?
4. Are exceptions/waivers represented separately from rule changes?
5. Can provider/runtime conformance be evaluated independently from provider selection?
6. Which AGWS Station/Role/AI boundaries are already encoded in contracts or tests?
7. Which rules require migration-safe warn→block rollout rather than immediate enforcement?

## Symbiotic Proof
A Generation-2 architecture reconciliation mechanism is symbiotically complete when the same provider-neutral ArchitectureObligation can be evidenced by at least two distinct realizations where appropriate (for example repository static rule and runtime probe), while preserving decision provenance, scope, revision, waiver semantics and remediation lineage. Replacing the enforcement provider must not change the architectural meaning of the obligation.

## Stable findings
- G2-FINDING-ARAC-11 — Architecture Decision, Architecture Obligation and Conformance Rule Are Distinct Identities.
- G2-FINDING-ARAC-12 — Conformance Is a Revision-, Scope- and Evidence-Bound Evaluation, Not a Timeless Boolean Property.
- G2-FINDING-ARAC-13 — Waiver/Exception Must Be a Governed Bounded Decision and Must Not Mutate the Underlying Obligation.
- G2-FINDING-ARAC-14 — Architecture Rule Rollout Requires Migration-Safe Applicability and Enforcement Modes.
- G2-FINDING-ARAC-15 — Automated Fitness Functions Complement but Cannot Universally Replace Human Architectural Review.
- G2-FINDING-ARAC-16 — Adaptive Work-Surface and AI Authority Boundaries Must Be Testable Architecture Obligations with Provenance.

## Candidate capabilities
- G2-CAPABILITY-CANDIDATE-ARCHITECTURE-OBLIGATION-CONFORMANCE-EVIDENCE — CROSS_CUTTING.
- G2-CAPABILITY-CANDIDATE-GOVERNED-ARCHITECTURE-WAIVER-LIFECYCLE — CROSS_CUTTING.
- G2-CAPABILITY-CANDIDATE-MIGRATION-SAFE-CONFORMANCE-RULE-ROLLOUT — CROSS_CUTTING.

## Value / risk / priority / next question
Value: converts architecture from passive documentation into governed, observable and evolvable product evidence.
Risk: over-automating architectural judgment, stale evidence, provider-specific policy lock-in and brittle blocking rules.
Priority: HIGH/CROSS-CUTTING because every later planning phase depends on trustworthy architecture reconciliation.
Next question: after cycle-2 closure, restart RESEARCH_ELICITATION rotation at the least-covered/oldest non-saturated capability and continue toward minimum_full_cycles=7; do not enter synthesis merely because cycle 2 completed.