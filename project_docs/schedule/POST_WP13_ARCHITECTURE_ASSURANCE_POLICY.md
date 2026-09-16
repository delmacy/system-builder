# Post-WP13 Architecture Assurance & Standards Conformance Policy

Status: **FORECAST POLICY / NOT EXECUTION AUTHORITY**

## Purpose

After `G2-WP-13 — Product Proof, Production Readiness & Architecture Reconciliation` is canonically closed, Generation 2 planning must create a bounded Architecture Assurance / Standards Conformance program before the project may claim architecture-standard conformance or external-audit readiness.

This policy does not materialize a successor Work Package, does not change the current typed DAG, and does not authorize implementation before WP-13 closure. It constrains the next baseline/forecast planning step.

The objective is **reasonably integral, evidence-backed conformity**, not a cosmetic checklist and not an automatic certification claim.

## Normative target set

At the post-WP13 planning gate, revalidate the current published editions and supersession state of the target standards. The baseline as of 2026-09 is:

- `ISO/IEC/IEEE 42010:2022` — Architecture description;
- `ISO/IEC/IEEE 42020:2019` — Architecture processes;
- `ISO/IEC/IEEE 42030:2019` — Architecture evaluation framework;
- `ISO/IEC 25010:2023` — Product quality model.

If a newer published edition supersedes one of these before materialization, planning must explicitly assess migration to the new edition. Draft/AWI revisions are informative only until published unless repository authority explicitly adopts them.

Supporting standards such as ISO/IEC/IEEE 12207 or 15288 may be referenced where they materially clarify lifecycle/process interfaces, but they do not silently expand the conformance scope.

Full normative assessment should use lawfully available/current standard text. Repository artifacts should store requirement identifiers, paraphrased obligations, applicability decisions and evidence references rather than reproducing copyrighted normative text unnecessarily.

## Mandatory post-WP13 planning outcomes

Fresh-main planning must produce a standards-assurance baseline containing at least:

1. **Entity and scope definition** — entities of interest, system boundaries, architecture description scope, lifecycle scope, products/runtimes/factory surfaces in or out of assessment.
2. **Standards applicability matrix** — each applicable requirement classified as `CONFORMANT`, `PARTIAL`, `GAP`, `NOT_APPLICABLE`, or `DEFERRED_WITH_RISK`, with rationale, owner, evidence and currentness.
3. **Stakeholder/concern model** — explicit stakeholders, concerns, obligations, conflicts and coverage rather than relying on implicit prose.
4. **Architecture Description Framework** — viewpoints, views, model kinds, correspondences, conventions, decision/rationale linkage and evidence references sufficient to assess 42010 conformance.
5. **Architecture process model** — governance, management, conceptualization, evaluation, elaboration and enablement responsibilities, triggers, inputs/outputs, authorities and records sufficient to assess 42020 coverage.
6. **Architecture evaluation framework** — evaluation objectives, subjects, stakeholders, criteria, methods, evidence, findings, risk/value assessment, dispositions and repeatability sufficient to assess 42030 coverage.
7. **ISO/IEC 25010 quality model adoption** — applicable product-quality characteristics/subcharacteristics mapped to measurable quality objectives, measures, thresholds, test/evidence routes and residual risks.
8. **Traceability matrix** — `standard requirement -> concern -> architecture element/view/decision -> implementation/control -> test/measure -> evidence -> disposition`.
9. **Gap remediation DAG** — deficiencies routed to their real semantic/module owners; the assurance program must not become a semantic god-object or bypass existing ownership.
10. **Audit dossier design** — reproducible evidence bundle, version/currentness rules, accepted deviations, residual risks and an explicit statement of what can and cannot be claimed.

## Required assurance Work Package coverage

The planner must create dependency-safe Work Packages after WP-13 that collectively cover the following outcomes. The exact number and identifiers are determined from fresh evidence; numeric adjacency alone is not authority.

### A. Standards Baseline & Architecture Description Normalization

Cover standards applicability, assessment scope, stakeholder/concern registry, Architecture Description Framework, viewpoints/views/model kinds/correspondences, terminology, architecture rationale and ADR normalization.

Exit evidence must make the architecture description assessable rather than merely understandable.

### B. Architecture Process Governance

Cover the applicable ISO/IEC/IEEE 42020 process set, including roles/authority, process triggers, lifecycle integration, change control, architecture governance/management, conceptualization, elaboration, evaluation and enablement records.

Existing Sprint/Work Package/ADR/repository-memory mechanisms should be reused where they satisfy obligations; do not create duplicate bureaucracy merely to mirror standard vocabulary.

### C. Architecture Evaluation & Fitness Evidence

Define and execute a repeatable architecture evaluation framework aligned to 42030. It must evaluate stakeholder concerns, intended purpose, architecture qualities, trade-offs, risks and progress using explicit evidence.

Architecture fitness checks already encoded in CI should become evidence inputs, not the whole evaluation.

### D. Product Quality Requirements & Measurement

Adopt ISO/IEC 25010:2023 as the product-quality reference model. For each applicable characteristic/subcharacteristic, define scope, measurable objective, measurement method, threshold/acceptance criterion, environment/population, evidence freshness and owner.

Do not convert multidimensional quality into one universal scalar score. Aggregated dashboards may summarize, but failing critical dimensions cannot be hidden by averages.

### E. Conformance Gap Closure & External-Audit Readiness

Close or explicitly disposition material gaps from A-D. Produce a version-pinned conformance matrix and audit dossier with reproducible evidence.

A repository review may conclude `INTERNAL CONFORMANCE EVIDENCE COMPLETE` or equivalent. It must not claim certification/accreditation by ISO, IEEE or an external body unless an authorized independent process actually establishes that claim.

## Quality and evidence rules

- Conformance is **requirement-by-requirement and evidence-backed**; document existence alone is not proof.
- Architecture description conformance and architecture quality are distinct claims.
- Product Proof, Production Readiness, standards conformance and external certification are distinct states.
- `NOT_APPLICABLE` requires bounded rationale; it is not a shortcut for unimplemented work.
- `DEFERRED_WITH_RISK` must carry owner, reason, consequence, review trigger and expiry/reassessment point.
- Evidence must identify revision, population/environment, locality where relevant, producer, timestamp/currentness and reproducible verification route.
- Existing architecture invariants remain authoritative; standards work cannot silently weaken anti-lock-in, runtime autonomy, authority boundaries, non-strengthening semantics or owner separation.
- Where standard guidance conflicts with an accepted architectural invariant or product constraint, record the conflict and resolve it through explicit architecture/change control rather than silent reinterpretation.

## Measurement expectations

The post-WP13 plan must prioritize presently under-evidenced quality attributes, especially where real operation is required to substantiate them. At minimum assess whether evidence is sufficient for:

- functional suitability;
- performance efficiency;
- compatibility/interoperability;
- interaction capability;
- reliability/resilience/recoverability;
- security;
- maintainability/modularity/testability;
- flexibility/adaptability;
- safety where applicable to a concrete generated product or integration.

A characteristic may remain `PARTIAL` until representative runtime/dogfood evidence exists. Planning must not manufacture thresholds solely to obtain a green status.

## Relationship to G2-WP-13

WP-13 remains the Generation 2 proof/readiness/reconciliation sink defined by the current planning authority. This policy does not retroactively enlarge WP-13.

After WP-13 canonical closure:

`fresh-main DAG revalidation -> standards applicability baseline -> assurance Work Package design -> dependency-safe materialization -> evaluation/remediation -> conformance closure`

The standards program may discover product or architecture defects. Material remediation must return to the owning capability/package through ordinary planning/change control; review/documentation Sprints cannot conceal functional construction.

## Closure criterion for the assurance program

The program may close only when:

- all target-standard requirements in scope have an explicit applicability/disposition;
- every `CONFORMANT` claim has current evidence;
- every material `PARTIAL/GAP` is either remediated or explicitly accepted/deferred by proper authority with risk;
- architecture description, process and evaluation artifacts are mutually traceable;
- ISO/IEC 25010 objectives have measurement/evidence routes for all applicable quality dimensions;
- repository checks can detect material drift in the assurance artifacts where deterministic enforcement is practical;
- an independent reviewer can reconstruct the assessment from repository evidence without relying on chat history or undocumented decisions.

The desired end state is **audit-ready, reasonably integral standards alignment with bounded residual exceptions**, not a false claim of perfect or universal compliance.