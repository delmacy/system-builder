# Generation 2 — Architecture Reconciliation as a Capability — Revisit 02

## Research question
How should System Builder continuously reconcile architectural intent with repository, generated-runtime, provider and Station reality while preserving decision/authority boundaries, evidence freshness, portability and offline operation — and without turning conformance tooling into an unauthorized implementation/remediation path?

## Representatives
1. **ArchUnit 1.4.x** — executable structural architecture rules over code dependencies/layers/slices.
2. **Open Policy Agent (OPA)** — revisioned policy bundles, distributed evaluation, decision logs, status and offline/local evaluation.
3. **Argo CD** — continuous desired-vs-live reconciliation, explicit `OutOfSync`, diff strategies and manual/automatic sync separation.
4. **Terraform / HCP Terraform drift & health assessments** — configuration/state/real-world distinction, refresh-only drift observation and review-before-state mutation.
5. **AWS Well-Architected Tool** — revisioned lenses, immutable workload milestones and improvement-plan-oriented human architectural assessment.
6. **ADR/MADR practice** — durable decision identity/supersession distinct from conformance evidence.

## Evidence / source ledger
| Representative | Evidence relevant to this revisit | Source of truth / interpretation |
|---|---|---|
| ArchUnit | Architecture constraints can be encoded as tests over imported bytecode and evaluated with ordinary test infrastructure. | Rule revision + inspected artifact; useful realization, not universal architecture identity. Source: https://www.archunit.org/ |
| OPA | Decision logs include queried policy, input, bundle revision, result and timestamp; bundles support revision metadata/signatures and can execute locally; management APIs separate policy distribution, status and decision telemetry. | Policy bundle revision + bounded evaluated input + decision event; telemetry completeness must be evaluated separately because logs may be masked/dropped/rate-limited. Sources: https://www.openpolicyagent.org/docs/management-decision-logs , https://www.openpolicyagent.org/docs/management-bundles , https://www.openpolicyagent.org/docs/management-introduction |
| Argo CD | Continuously compares desired Git state with live state; deviation is `OutOfSync`; reporting and sync are distinct, and sync may be manual or automatic. Diff behavior itself is configurable. | Desired revision + observed live state + diff strategy/options + sync decision. Sources: https://argo-cd.readthedocs.io/en/stable/ , https://argo-cd.readthedocs.io/en/latest/user-guide/sync-options/ |
| Terraform | Refresh-only operations observe provider-reported reality and can expose drift without modifying infrastructure; applying refreshed state is a separate governed action. Misconfigured provider credentials can produce misleading observations. | Configuration + prior state + provider observation + plan/refresh mode + operator decision. Sources: https://developer.hashicorp.com/terraform/tutorials/state/refresh , https://developer.hashicorp.com/terraform/tutorials/state/resource-drift |
| AWS Well-Architected Tool | Lenses provide consistent assessment criteria; milestones preserve immutable workload-state snapshots and risks at a point in time; improvement plans remain distinct from the assessment snapshot. | Lens revision + workload assessment + immutable milestone + improvement disposition. Sources: https://docs.aws.amazon.com/wellarchitected/latest/userguide/lenses.html , https://docs.aws.amazon.com/wellarchitected/latest/userguide/milestones.html |
| ADR/MADR | Decision records preserve rationale and lifecycle/supersession, but do not themselves prove repository/runtime conformance. | ArchitectureDecision revision/status + separately obtained evidence. |

## Source of truth
Architecture reconciliation has no single physical source of truth. The semantic source of truth is a **revisioned ArchitectureDecision/ArchitectureObligation graph** plus the applicability rules that make obligations effective for a scope. Repository, provider, runtime, Station and human-review observations are evidence about effective realization, not replacements for the architecture decision itself.

A conformance statement is valid only when it closes the tuple:

`ObligationRevision × ApplicabilityRevision × EvidenceSnapshot × EvidenceInterpreter/RuleRevision × SubjectRevision → Evaluation`

## Identity
Maintain distinct identities for:
- `ArchitectureDecision` — rationale, constraints, alternatives, non-goals, status.
- `ArchitectureObligation` — normative requirement derived from decisions/policy.
- `ObligationApplicability` — scopes/profiles/versions/Stations/environments where the obligation is effective.
- `ConformanceRealization` — ArchUnit rule, Rego policy, CI check, runtime probe or human review protocol implementing evaluation.
- `EvidenceSnapshot` — bounded repository/runtime/provider/configuration/Station observation with source and freshness metadata.
- `ConformanceEvaluation` — immutable evaluation binding exact obligation/applicability/realization/evidence revisions.
- `ArchitectureDriftFinding` — discrepancy between desired/effective architecture and observed realization.
- `ArchitectureException` — bounded waiver with issuer authority, scope, rationale, expiry/review trigger and affected revision.
- `ReconciliationDisposition` — KEEP/HARDEN/GENERALIZE/PROVIDERIZE/INTEGRATE/REPLACE/DEFER/DO_NOT_BUILD or other authorized planning disposition.
- `RemediationProposal` — candidate change; not authority to execute.

## Lifecycle and versioning
1. Decision: `PROPOSED → ACCEPTED → SUPERSEDED | RETIRED`.
2. Obligation: derived/approved independently; may have `OBSERVE → WARN → ENFORCE → RETIRE` enforcement modes.
3. Evidence: immutable snapshot with observation time and collection/interpretation provenance.
4. Evaluation: immutable; later evidence creates a new evaluation rather than rewriting history.
5. Drift: `OPEN → ACKNOWLEDGED → DISPOSITIONED → REMEDIATED/ACCEPTED_EXCEPTION → VERIFIED_CLOSED`.
6. Exception: `PROPOSED → APPROVED → ACTIVE → EXPIRED/REVOKED/SUPERSEDED`.
7. Remediation: candidate plan/change must pass normal authority, migration and execution gates; reconciliation itself never gains implementation authority.

Superseding an ADR or obligation does not retroactively rewrite prior evaluations. Applicability windows allow coexistence while generated systems, providers or Stations migrate across revisions.

## Failure semantics
Required result vocabulary includes at minimum:
- `CONFORMANT`
- `VIOLATION`
- `NOT_APPLICABLE`
- `INCONCLUSIVE`
- `EVIDENCE_STALE`
- `EVIDENCE_INCOMPLETE`
- `INTERPRETER_ERROR`
- `PROVIDER_OBSERVATION_FAILED`
- `EXCEPTION_ACTIVE`
- `UNKNOWN_EFFECTIVE_REALIZATION`

Absence of violation evidence is not conformance. A stale/missing probe is not success. A provider-reported observation may be wrong because of credential/scope/configuration failure; Terraform documents this risk directly. Automated reconciliation therefore requires evidence-quality semantics and never silently converts unknown into compliant.

## Extensibility and provider boundaries
Architecture conformance realization is providerized. Static analyzers, policy engines, CI systems, repository hosts, runtime probes and human assessment tools can all provide evidence. The universal contract is the obligation/evidence/evaluation model.

Provider replacement must preserve:
- semantic obligation identity;
- applicability/profile semantics;
- revision lineage;
- result/failure vocabulary mapping;
- evidence provenance/freshness;
- exception linkage;
- subject identity.

No provider may infer implementation authority from its ability to detect drift. Argo CD is instructive because observation (`OutOfSync`) and synchronization are separable; for SB the separation must be constitutional across all reconciliation providers.

## Governance
### Authority separation
`DecisionAuthority ≠ ObligationAuthority ≠ EvidenceCollectionAuthority ≠ EvaluationAuthority ≠ ExceptionAuthority ≠ RemediationApprovalAuthority ≠ ExecutionAuthority`.

An automated checker can detect or classify drift but cannot silently revise the architecture decision, grant an exception, mutate canonical domain/process definitions, install a provider, deploy a runtime or edit a Station.

### Exceptions
Exceptions must specify:
- target obligation/finding/revision;
- subject and scope;
- issuer and proof of authority;
- rationale/risk acceptance;
- compensating controls when applicable;
- start/expiry or review trigger;
- whether it affects evaluation presentation only or blocks automated enforcement;
- required revalidation after environment/Station/provider/revision change.

An exception never mutates the underlying obligation for unrelated subjects.

## Observability and evidence freshness
Every architecture posture view should expose:
- effective desired architecture revision;
- observed subject revision;
- evidence source and `observed_at`;
- ingestion/evaluation time separately;
- collection coverage and blind spots;
- rule/interpreter revision;
- result and confidence/quality classification;
- active exceptions;
- drift age;
- remediation/disposition state.

Architecture evidence freshness must be policy/profile-specific. A code-dependency evaluation may remain valid until repository revision changes; runtime/provider topology evidence may expire quickly. `FreshnessPolicy` is therefore an explicit relation, not a universal duration.

## Desired architecture vs effective realization
Argo CD and Terraform converge on a crucial primitive: **declared/desired state, remembered state and observed reality are distinct**. For Generation 2 this expands beyond infrastructure:

`DesiredArchitecture → EffectiveDefinition/IR → GeneratedArtifact → DeployedRuntime → ProviderRealization → StationExposure → ObservedEvidence`

Each transition can drift independently. Reconciliation needs subject-specific lineage rather than one global `architecture_compliant=true` flag.

## Cross-plane reconciliation
Architecture obligations can apply across:
- repository/package dependencies;
- portable definition/IR;
- generated artifact/runtime;
- provider binding/effective realization;
- deployment/environment topology;
- evidence/provenance chain;
- `Enterprise → Station → Role → Person` capability/surface resolution.

A cross-plane finding must identify the earliest known divergence boundary rather than attributing all failures to the final runtime symptom.

## Offline / self-hosted reconciliation
Incorporating `G2-FINDING-DOESH-17..22`:
- qualified offline operation requires local closure of obligation definitions, applicability profiles, interpreters/rules, trust material and evidence schemas;
- local evaluation must continue without SaaS control planes where the profile requires it;
- architecture evidence must be exportable for later review without losing revision/provenance identity;
- provider-specific diagnostics may enrich evidence but cannot be the only means to interpret architectural posture;
- bootstrap/upgrade/recovery evidence must bind the effective environment realization and its transition lineage.

## AI-native reconciliation
Incorporating `G2-FINDING-AIN-17..22`:
- AI may summarize evidence, classify candidates and produce a remediation proposal;
- approval binds exact effective obligation/policy/tool/input/candidate revisions and becomes stale after material change;
- AI-produced repository/runtime mutations remain candidate artifacts;
- tool discovery does not grant credentials or execution authority;
- reproducibility requires reconstructable revision-bound evidence and postconditions, not deterministic token replay;
- offline AI assistance is optional realization, never prerequisite for local conformance evaluation unless a profile explicitly says so.

## Lifecycle / migration reconciliation
Incorporating `G2-FINDING-LVEM-17..22`:
- desired semantic revision, effective realized revision and runtime availability are independent evidence;
- compatibility is profile/operation/direction/window-scoped;
- deprecation/sunset/withdrawal are separate lifecycle facts;
- migration and recovery may branch lineage;
- architecture reconciliation across coexistence windows must evaluate each subject against the obligation version actually applicable to it, not merely the latest desired revision.

## Adaptive Governed Work Surfaces composition
AGWS remains distinct from generic UI authoring. Architecture reconciliation imposes executable/reviewable obligations over:
- monotonic `Enterprise → Station → Role → Person` authority resolution;
- mandatory superior components/invariants remaining non-removable;
- constrained semantic components/layout only;
- Station-scoped capability exposure and delegated administration;
- AI escalation for canonical domain/schema/process/provider/deployment changes;
- personal automation bounded by effective Station/Role authority;
- provider-neutral component/action bindings;
- revalidation after Station/Role/revision changes;
- lineage/version/diff/reset/rollback;
- evidence-governed promotion Personal → Team/Role/System.

A reconciliation dashboard may expose findings and propose authorized actions, but AGWS composition must not become a bypass to modify architecture obligations or execute remediation.

## Product-specific mechanism vs universal primitive
**Product-specific mechanisms:** ArchUnit predicates, Rego, Argo diff/sync, Terraform refresh-only plans, AWS Well-Architected lenses/milestones, GitHub status checks/CODEOWNERS.

**Universal primitives:** ArchitectureDecision, Obligation, Applicability, DesiredArchitectureRevision, EffectiveRealizationObservation, EvidenceSnapshot, FreshnessPolicy, ConformanceEvaluation, DriftFinding, Exception, ReconciliationDisposition, RemediationProposal, authority/provenance lineage.

## Convergent patterns
- Desired state and observed reality are separate identities.
- Observation/detection can be non-mutating and should precede remediation.
- Evidence is revision- and scope-bound.
- Historical snapshots are valuable and should be immutable.
- Automated rules complement human assessment.
- Exceptions need explicit governed scope and lifecycle.
- Provider/tool identity should not own architecture semantics.

## Divergent patterns
- ArchUnit evaluates code structure; OPA evaluates structured policy inputs; neither inherently reconciles runtime/provider drift.
- Argo CD couples optional reconciliation actuation to desired/live drift, while SB must preserve a stronger authority boundary before any mutation.
- Terraform refresh-only can update remembered state only after explicit apply; architecture reconciliation may instead retain conflicting observations without rewriting desired architecture.
- AWS Well-Architected is assessment/improvement-plan oriented and intentionally human-heavy rather than deterministic enforcement.

## Limited comparison with fresh `main`
`main`'s `AGENTS.md` provides bounded evidence of repository-level constitutional architecture governance: repository memory is authoritative; applicable accepted ADRs and the master blueprint are required reading when architecture is involved; no silent L4 architecture change is permitted; L4 always requires an ADR; deterministic evidence is preferred over prose claims; unresolved architecture decisions stop implementation rather than permitting invented policy.

This supports KEEP/HARDEN hypotheses for decision authority and repository-memory discipline, but it does **not** establish repository-wide implementation of structured `ArchitectureObligation`, `EvidenceSnapshot`, freshness, waiver or cross-plane drift contracts. Absence is not inferred from this bounded inspection. Full archaeology remains reserved for `PLANNING_B_SB_CURRENT_STATE_RECONCILIATION`.

## Reconciliation hypotheses
- **KEEP** repository-memory/ADR authority and existing deterministic architecture checks.
- **HARDEN** architecture checks with obligation/applicability/evidence/freshness identity and unknown-state semantics.
- **GENERALIZE** desired-vs-effective architecture reconciliation across repository, runtime, provider and Station planes.
- **PROVIDERIZE** static rules, policy engines, runtime probes and assessment mechanisms behind provider-neutral evidence contracts.
- **INTEGRATE** findings, exceptions, migration windows, runtime/provider evidence and planning dispositions through lineage.
- **REPLACE** prose-only invariants with executable/reviewable evidence when semantics are safely reducible.
- **DEFER** automatic remediation until authority, migration and rollback contracts are proven.
- **DO_NOT_BUILD** a proprietary universal policy language or autonomous architecture-repair engine that bypasses normal execution authority.

## Repo-validation questions
1. Which constitutional or module-boundary invariants on fresh `main` have deterministic checks, and what exact evidence do those checks persist?
2. Can existing test/CI results be associated with a stable architecture-obligation identity and evaluated subject revision?
3. How are ADR applicability/supersession and migration windows represented today?
4. Are architecture exceptions/temporary deviations represented independently from changing an ADR or task scope?
5. Which repository/runtime/provider observations can become stale, incomplete or misleading because of visibility/credential/provider failure?
6. Can generated artifacts/runtime instances be traced to the architecture/definition revision against which they should be evaluated?
7. Can Station exposure and AGWS hierarchy be evaluated without granting the evaluator administrative authority?
8. What local/offline evidence survives when GitHub, provider control planes or System Builder control plane are unavailable?
9. Which conformance checks currently mutate state as part of observation and should be split into detect/reconcile actions?

## Symbiotic Proof
Architecture Reconciliation is symbiotically complete when one semantic `ArchitectureObligation` can be evaluated against at least two heterogeneous realization planes/providers where applicable — for example repository dependency evidence plus runtime/provider observation — while preserving obligation/applicability revision, subject identity, freshness, result semantics, exception lineage and authority separation. Replacing the evaluator/provider must not alter the meaning of the obligation. Detecting a violation must not itself authorize remediation.

## Stable findings
- **G2-FINDING-ARAC-17 — Architecture Reconciliation Requires Desired, Remembered and Observed Realization Identities Rather Than a Global Conformance Boolean.**
- **G2-FINDING-ARAC-18 — Evidence Freshness and Coverage Are Policy/Profile-Specific Inputs to Conformance; Missing or Stale Evidence Must Produce Unknown/Inconclusive States.**
- **G2-FINDING-ARAC-19 — Drift Detection, Reconciliation Disposition, Remediation Approval and Execution Authority Are Distinct and Must Never Collapse Into Automatic Authority Escalation.**
- **G2-FINDING-ARAC-20 — Architecture Exceptions Are Revision-Bound Governed Objects and Must Be Revalidated When Subject, Station, Provider, Environment or Obligation Applicability Changes.**
- **G2-FINDING-ARAC-21 — Cross-Plane Architecture Reconciliation Requires Lineage Across Definition/IR, Artifact, Runtime, Provider Realization and Station Exposure to Locate the Earliest Divergence Boundary.**
- **G2-FINDING-ARAC-22 — Offline/Self-hosted Architecture Governance Requires a Portable Local Closure of Obligations, Applicability, Interpreters, Trust and Exportable Evidence.**

## Capability candidates
- `G2-CAPABILITY-CANDIDATE-DESIRED-EFFECTIVE-ARCHITECTURE-REALIZATION-EVIDENCE` — **CROSS_CUTTING / CANDIDATE**. Promotion condition: synthesis confirms reusable desired/effective/observed evidence identity across Deployment, Lifecycle, Provider, Architecture Reconciliation and DOESH.
- `G2-CAPABILITY-CANDIDATE-ARCHITECTURE-EVIDENCE-FRESHNESS-COVERAGE-QUALITY` — **CROSS_CUTTING / CANDIDATE**. Promotion condition: Observability/Governance/Product Proof confirm reusable evidence-quality semantics rather than architecture-only concern.
- `G2-CAPABILITY-CANDIDATE-NON-ACTUATING-RECONCILIATION-AUTHORITY-SEPARATION` — **CORE / CANDIDATE**. Promotion condition: AI/Authorization/Governance/Deployment synthesis confirms one constitutional separation of detection, disposition, approval and execution across reconciliation domains.

No candidate is promoted in this pass.

## Value / risk / priority / next question
**Value:** makes architecture continuously observable and evolvable across generated/runtime/provider/Station boundaries without turning tools into semantic owners.

**Risk:** false confidence from stale/partial evidence; automated authority inversion; provider-specific drift semantics; exception sprawl; remediation loops; loss of offline interpretability.

**Priority:** HIGH / CROSS-CUTTING. All later Generation-2 planning and acceptance phases need a trustworthy evidence→finding→reconciliation chain.

**Next question:** cycle 3 is complete after this pass. Begin revisit cycle 4 with the least-covered/oldest non-saturated capability according to persisted rotation state. Do not enter `CAPABILITY_SYNTHESIS`: `completed_full_cycles` remains below `minimum_full_cycles=7`, and Enterprise Completeness / Negative-Space remains not yet eligible.