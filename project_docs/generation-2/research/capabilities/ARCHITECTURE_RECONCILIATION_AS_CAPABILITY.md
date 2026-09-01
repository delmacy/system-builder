# Architecture Reconciliation as a Capability

## Research question
How should Generation 2 continuously reconcile intended architecture, repository/runtime evidence and architectural decisions without allowing documentation, automated checks or the Builder control plane to become product-runtime authority?

## Representatives and evidence ledger

| Representative | Coverage | Evidence | Contribution |
|---|---|---|---|
| ADR lifecycle / MADR-style practice | DEEP | Stable decision identity; proposed/accepted/deprecated/superseded lifecycle; supersession preserves history rather than rewriting it. | Decision identity, rationale, consequences and lineage. |
| Evolutionary Architecture fitness functions | DEEP | Architecture characteristics can be expressed as continuously evaluated fitness functions rather than one-time review assertions. | Executable conformance evidence and continuous drift detection. |
| ArchUnit-style architecture tests | DEEP | Architecture rules can be encoded as tests over dependency/package structure and fail deterministically. | Automated evidence for a bounded subset of architecture intent. |
| Kubernetes API compatibility/deprecation governance | DEEP | Explicit compatibility, version-skew and deprecation rules constrain evolution; round-trip compatibility is an objective property rather than prose intent. | Governed compatibility windows, evolution evidence and ownership. |
| Repository-native architecture governance | PARTIAL | Decisions, tests, contracts and evidence can coexist in version control while retaining separate identities. | Portable reconciliation ledger and review boundary. |

Primary external evidence for this pass includes Kubernetes Version Skew Policy and API Deprecation Policy, plus established ADR lifecycle and evolutionary-architecture/fitness-function practice. Kubernetes explicitly constrains supported component skew and upgrade ordering; its deprecation policy requires lossless round-trip between served API versions in a release. These are examples of architecture intent becoming objectively testable compatibility obligations rather than mutable documentation.

## Source of truth
Architecture reconciliation has no single universal source of truth. It joins distinct authorities without collapsing them:

1. **Architecture intent** — accepted ADRs, constitutional invariants, bounded architecture rules and declared non-goals.
2. **Implemented truth** — repository contracts, dependency graph, generated artifacts, tests and deployed/runtime evidence.
3. **Reconciliation truth** — an immutable/revisioned record that states which intent and evidence revisions were compared, what drift/gap was found, its disposition, ownership and proof obligation.

A reconciliation record may report inconsistency; it must not silently mutate either architectural intent or implementation truth.

## Identity
Universal identities should remain distinct: `ArchitectureDecision`, `ArchitectureRule/FitnessFunction`, `EvidenceSnapshot`, `ReconciliationRun`, `ArchitectureFinding`, `ArchitectureGap`, `DispositionDecision`, `ProofObligation` and `Exception/Waiver`. A finding is an observation; a gap is an interpreted delta against intended state; a disposition is an authorized decision about that gap.

## Lifecycle
`intent revision -> evidence snapshot -> evaluation/reconciliation run -> finding -> gap classification -> disposition -> proof obligation -> implementation elsewhere -> fresh evidence -> verification -> closure/supersession`.

Closed findings remain historical evidence. New evidence can reopen the underlying condition as a new run/finding without rewriting history.

## Versioning
Every reconciliation result must bind exact revisions/digests of architecture intent, rules and implementation/runtime evidence. An accepted ADR can later be deprecated or superseded, but prior reconciliation records remain bound to the revision/status applicable at evaluation time. Fitness functions and conformance rules are versioned inputs, not timeless truth.

## Failure semantics
- Missing or stale evidence => `INCONCLUSIVE`, never compliant by default.
- Rule execution failure => evaluation failure distinct from architecture violation.
- Conflicting authorities => ownership conflict requiring human disposition, not automatic precedence invention.
- Finding without an authoritative target => unresolved taxonomy/ownership gap.
- Waived finding => still a finding; waiver records scope, authority, reason and expiry.
- Passing automated rules => evidence only for the properties encoded by those rules, not proof of total architectural conformance.

## Extensibility and provider boundaries
Evidence collectors and conformance evaluators are provider-like mechanisms behind portable contracts. Git dependency analysis, schema compatibility checks, CI tests, runtime observations and policy engines can contribute evidence, but none owns architecture truth. Product/runtime providers must remain replaceable; generated runtime autonomy must not require live access to the Builder's reconciliation service.

## Governance and authority
Automated mechanisms may collect evidence and deterministically evaluate pre-authorized rules. They may not create/supersede constitutional architecture decisions, widen scope, approve exceptions or choose material KEEP/HARDEN/GENERALIZE/PROVIDERIZE/INTEGRATE/REPLACE/DEFER/DO_NOT_BUILD dispositions unless that authority is explicitly delegated. Material architectural change remains an accountable decision.

## Observability
A reconciliation run should expose: intent/rule revisions, evidence provenance/freshness, evaluator version, findings by severity/class, unresolved ownership conflicts, waivers/expiry, proof-obligation status and dependency impact. Metrics are summaries; the auditable record remains the source for each conclusion.

## Portability and lock-in
Portable primitives are decision/rule references, evidence envelopes, findings, gaps, dispositions and proof obligations. Specific scanners, CI systems, graph analyzers or policy engines are replaceable providers. Reconciliation must export enough evidence and lineage to be independently inspected after migration away from the Builder.

## Product-specific mechanism vs universal primitive
Product-specific: GitHub checks, repository scripts, dependency scanners, schema diff tools, deployment observers, particular ADR templates.

Universal: intended-state reference, evidence snapshot/provenance, evaluation result, drift/finding, gap, disposition, waiver, proof obligation, ownership/dependency impact and closure evidence.

## Convergent patterns
- Decisions and implementation evidence have independent identity/lifecycle.
- Architecture conformance is evidence-backed and revision-bound.
- Continuous checks reduce drift but cover only encoded properties.
- Compatibility/deprecation policies become stronger when they expose measurable obligations.
- Historical decisions/findings are superseded or closed, not erased.

## Divergent patterns
ADR practice is primarily human decision provenance; fitness functions/ArchUnit provide executable checks; Kubernetes governance combines policy, compatibility windows and conformance obligations. They should not be collapsed into one mechanism. The universal capability coordinates them through evidence and authority boundaries.

## Subcapabilities
- Architecture intent/decision registry
- Fitness-function and conformance-rule registry
- Evidence collection/provenance
- Intended-vs-implemented comparison
- Drift/finding classification
- Gap/disposition governance
- Waiver/exception lifecycle
- Proof-obligation tracking
- Dependency/ownership impact analysis
- Continuous conformance scheduling and stale-evidence detection

## System Builder comparison — evidence bounded
Fresh `main` visibly contains capability-oriented project documentation directories including validation, compiler, release, deploy, observe, support/evolution, autonomous-runtime, evidence/provenance and deterministic-human-probabilistic-boundary areas. This is evidence of explicit architecture/documentation surfaces, but this pass found no repository-search evidence proving a single first-class architecture-reconciliation contract or subsystem. Therefore do not infer one.

Hypothesis: **KEEP** existing repository-native architecture decisions/contracts/tests; **HARDEN** evidence freshness and rule-to-proof linkage; **GENERALIZE** finding/gap/disposition/proof identities where repeated; **INTEGRATE** deterministic conformance checks as evidence providers; **DEFER** implementation ownership to repository archaeology; **DO_NOT_BUILD** a reconciliation runtime dependency for generated systems.

## Repo-validation questions
1. Which files are authoritative constitutional architecture/ADR sources, and how are supersession/status represented?
2. Which existing CI/architecture tests already encode fitness functions, and which invariants remain prose-only?
3. Is there an existing finding/gap/evidence schema that can own reconciliation identities rather than creating a duplicate?
4. How are conformance findings currently linked to package/sprint corrective work and closure evidence?
5. Can evidence snapshots be pinned to exact repository/release/runtime revisions and independently re-evaluated?
6. Which architecture decisions require ADR authority before Generation 2 planning can reconcile them?

## Symbiotic Proof
A Generation 2 reconciliation is symbiotically complete when an independent reviewer can start from an accepted architecture intent revision, resolve the exact implementation/runtime evidence evaluated, reproduce or inspect the applicable deterministic checks, distinguish missing/stale evidence from violations, trace each material gap to an authorized disposition and proof obligation, and verify closure from newer evidence — while the generated runtime remains operational without the reconciliation control plane.

## Stable findings
- **G2-FINDING-ARAC-01 — Architecture Intent, Implemented Truth and Reconciliation Truth Are Distinct Authorities.**
- **G2-FINDING-ARAC-02 — Architecture Decision, Finding, Gap, Disposition and Proof Obligation Require Independent Identity.**
- **G2-FINDING-ARAC-03 — Conformance Evidence Must Bind Exact Intent, Rule, Evaluator and Implementation/Runtime Revisions.**
- **G2-FINDING-ARAC-04 — Missing or Stale Evidence Produces Inconclusive Status, Never Implicit Conformance.**
- **G2-FINDING-ARAC-05 — Automated Fitness Functions Prove Only the Architectural Properties They Encode.**
- **G2-FINDING-ARAC-06 — Deterministic Detection Does Not Grant Authority to Change Architecture or Choose Material Disposition.**
- **G2-FINDING-ARAC-07 — Architecture Exceptions/Waivers Need Scope, Authority, Rationale and Expiry Without Erasing the Finding.**
- **G2-FINDING-ARAC-08 — Architecture Decisions and Findings Are Superseded/Closed With Lineage, Not Rewritten Out of History.**
- **G2-FINDING-ARAC-09 — Continuous Conformance Requires Freshness and Dependency-Impact Semantics, Not Merely Repeated CI.**
- **G2-FINDING-ARAC-10 — Architecture Reconciliation Is Control/Evidence Plane Capability and Must Not Become Generated-Runtime Authority.**

## Candidate discoveries
- `G2-CAPABILITY-CANDIDATE-ARCHITECTURE-EVIDENCE-SNAPSHOT` — CROSS_CUTTING — portable revision-bound evidence snapshot may generalize across governance, conformance and reconciliation.
- `G2-CAPABILITY-CANDIDATE-PROOF-OBLIGATION-LIFECYCLE` — CROSS_CUTTING — explicit obligation identity/status/closure evidence appears reusable beyond architecture reconciliation.
- `G2-CAPABILITY-CANDIDATE-ARCHITECTURE-WAIVER-LIFECYCLE` — CROSS_CUTTING — governed exception semantics may unify architecture, compliance and policy waivers if later synthesis confirms overlap.

## Value / risk / priority / next question
**Value:** makes architectural evolution auditable and prevents Generation 2 planning from confusing desired architecture with repository truth. **Risk:** over-centralizing governance into a Builder-owned meta-system or treating passing checks as complete proof. **Priority:** HIGH/CROSS-CUTTING. **Next question:** after first-pass coverage is complete, revisit the oldest/lowest-coverage capability and test whether new representatives materially change its stable findings; saturation cannot be declared from this first pass alone.