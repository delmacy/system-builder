# Mathematical Expressions, Rules & Calculation — Increment 3 Final Reconciliation

Status: CLOSED / PASS
Phase: RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION
Date: 2026-09-04
Scope: research/planning only; no product implementation authority.

## Question resolved

What portable semantic contract is required for enterprise formulas and calculated conditions, and does Generation 2 need a new canonical Calculation capability?

## Evidence added in increment 3

### Temporal and calendar semantics

1. OMG DMN 1.5 / FEEL distinguishes **years-and-months duration** from **days-and-time duration**. These are not interchangeable scalar seconds. Source: https://www.omg.org/spec/DMN/1.5/PDF
2. Java `Period` and `Duration` make the same material distinction operationally: a `Duration` day is exactly 24 hours, while a date-based `Period` day preserves local civil time and can therefore differ across DST transitions. Source: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/Period.html
3. Java `ZonedDateTime` documents three local-time cases: one valid offset, a DST **gap** with no valid offset, and an **overlap** with two valid offsets; default resolution choices exist but are policy, not universal business truth. Source: https://docs.oracle.com/en/java/javase/26/docs/api/java.base/java/time/ZonedDateTime.html
4. IANA TZDB is periodically revised as political bodies change offsets, boundaries and daylight-saving rules. As of this evidence pass, the published latest release is `2026c` dated 2026-07-08. Source: https://www.iana.org/time-zones
5. Power Fx distinguishes user-local and time-zone-independent values and exposes explicit timezone offset conversion. Source: https://learn.microsoft.com/en-us/power-platform/power-fx/data-types

**Required portable semantics:** temporal calculation evidence must distinguish instant, local date/time, zone identity, offset, date-based period, time-based duration, business-calendar revision, deadline inclusivity/exclusivity, DST gap/overlap resolution policy and timezone-rule dataset/version where historical reproducibility requires it. Silent provider defaults are not portable semantics.

### Formula/model revision deployment and historical applicability

- Camunda business-rule tasks expose decision binding modes `latest`, `deployment`, and `versionTag`. This is concrete evidence that model identity and **which revision is applicable to an execution** are distinct concerns. Source: https://docs.camunda.io/docs/components/modeler/bpmn/business-rule-tasks/
- Stripe models pricing through separately identified Price objects attached to Products, allowing multiple prices rather than requiring economic meaning to be mutated in place. Source: https://docs.stripe.com/payments/checkout/migrating-prices

**Required portable semantics:** `FormulaRevision` is immutable/revisioned; `HistoricalApplicability` binds an evaluation/business record to the revision and contextual revisions that were applicable. `latest` is an explicit adoption policy, never an implicit historical-replay rule.

### Large DAG, bulk evaluation and resource exhaustion

- CEL is non-Turing-complete, side-effect free, and designed for predictable bounded expression evaluation; its host controls exposed functions. Source: https://github.com/cel-expr/cel-go
- Kubernetes' production use of CEL adds deterministic runtime cost accounting and stops evaluation when the configured cost budget is exceeded. Source: https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md

A portable `EvaluationPolicy` therefore needs explicit bounds or qualified defaults for at least: expression/AST size and depth, input/container cardinality, comprehension/iteration cost, dependency-graph nodes/edges/depth, evaluation cost/time/cancellation, memory/output size, and bulk batch cardinality. Crossing a bound yields a typed resource-limit failure. A partial value must not be promoted as an authoritative `CalculationResult`; bulk execution may report item-scoped outcomes plus an explicit batch `PARTIAL`, but absent items cannot be silently treated as zero/success.

## Provider semantic-conformance corpus

A provider/engine may be admitted only against a declared semantic profile. The minimum corpus is:

| Vector | Mandatory cases | Qualification |
|---|---|---|
| Numeric | exact decimal, scale, overflow, division, rounding point/mode | SUPPORTED/PARTIAL/UNSUPPORTED/INCONCLUSIVE |
| Failure algebra | Missing, Null, Unknown, Error, short-circuit/coercion | same |
| Money/rates | currency identity, incompatible currency, percentage/rate basis | same |
| Units | dimensional compatibility and conversion | same |
| Temporal | instant/local, period vs duration, DST gap/overlap, zone-rule revision, inclusive/exclusive deadline | same |
| Dependency | DAG order, duplicate dependency, cycle rejection, bounded recomputation | same |
| Revision/history | formula revision, input/context revisions, snapshot vs live, historical replay | same |
| Security | no arbitrary IO/action/dynamic code; host-function allowlist; secret/query boundary | same |
| Resources | AST/input/DAG/bulk/cost/output limits and cancellation | same |
| Evidence | deterministic result envelope, provider profile/version, captured context, error disposition | same |
| Runtime mode | local/offline/self-hosted capability and external dependency declaration | same |

Parser compatibility or provider name alone never qualifies substitution. Provider identity remains non-canonical.

## Math-specific security and authority pass

### Expected safe behavior

- expressions read only values explicitly admitted into `EvaluationContext`;
- functions/operators are profile-allowlisted and pure unless a different semantic owner explicitly owns a state-changing operation outside calculation;
- secret resolution, arbitrary database queries, network calls, filesystem access, dynamic code execution and workflow/domain mutation are unavailable to generic formula evaluation;
- evaluation returns a typed value/failure plus evidence and cannot grant authorization, approval or entitlement;
- AI/low-code authoring may propose formula revisions, but materialization requires type checking, dependency/cycle validation, semantic-profile validation, authority validation and revisioned provenance;
- Enterprise → Station → Role → Person can narrow available formulas/functions/data and authoring authority but lower layers cannot weaken higher invariants.

### Forbidden behavior

- coercing unknown/missing inputs to false/zero to bypass approval or billing controls;
- evaluating against secrets or fields the caller/semantic owner could not otherwise access;
- arbitrary provider functions that perform hidden IO or mutation;
- silently adopting a newer formula, calendar, timezone rule, currency/rate or rounding policy for historical authoritative results;
- accepting a provider replacement because source text parses when semantics differ;
- materializing partial/resource-exhausted bulk output as complete authoritative truth.

## Negative-space pass

The following concerns were challenged and do **not** justify a new canonical owner:

- spreadsheet compatibility functions: provider/profile-specific mechanics unless a semantic owner requires them;
- statistics/window analytics: Analytics/BI semantic ownership with reusable calculation primitives;
- inventory valuation: domain/accounting policy owns meaning; calculator supplies typed arithmetic/revision/evidence;
- commercial rating/commission: Commercial capability owns meaning and applicability;
- FinOps allocation/unit-cost: Technology Economic Governance owns economic semantics;
- workflow conditions/deadlines: Workflow owns transition use, while calendar/domain policy owns meaning and calculation supplies mechanics;
- optimization/solver/ML/simulation: distinct specialized algorithms/providers, not silently absorbed into deterministic formula semantics;
- cryptography/security policy: Security/Trust owners; calculation engine is not a crypto authority;
- geospatial/scientific specialty functions: provider/domain extensions requiring explicit semantic profiles.

No material enterprise calculation category remains without a semantic owner after this pass.

## Enterprise proof closure

The prior sixteen `MATH-PROOF-*` obligations remain authoritative. Increment 3 closes the architectural-level gaps needed to carry them forward: SLA/deadline proof now requires calendar revision + zone-rule revision/currentness + explicit DST resolution + inclusivity; historical business results require formula/input/context revision lineage; provider substitution requires the conformance corpus above; large/bulk evaluation requires typed resource-limit behavior.

## Final disposition

**KEEP_AS_CROSS_CUTTING_SUBCAPABILITY + PROVIDERIZE_MECHANICS_WITH_PORTABLE_SEMANTICS.**

Do **not** promote a 29th canonical capability. The portable calculation contract is a cross-cutting subcapability/primitive set under **Universal Capability Architecture**, reused by semantic owners such as Process/Application Modeling, Workflow, Data, UI/AGWS, Commercial and FinOps. Provider/Binding owns qualification/binding/substitution of evaluator realizations; Standards/Interoperability owns conformance profile/corpus mechanics; Lifecycle owns revision/evolution mechanics; Evidence/Provenance concerns remain integrated. The semantic owner of each formula remains responsible for what the result means.

## Exit-gate assessment

1. Multi-representative research — PASS.
2. Formula/calculation semantic owner explicit — PASS.
3. Typed number/money/unit/time/failure semantics — PASS at architecture-planning level.
4. Formula revisioning and historical lineage — PASS.
5. Snapshot versus recomputation — PASS.
6. Provider substitution/portability — PASS via explicit conformance qualification.
7. Low-code/AI authoring boundaries — PASS.
8. Affected taxonomy/boundaries — requires and is satisfied by the bounded synthesis and Planning-A addenda committed with this reconciliation.
9. Enterprise proof obligations — PASS; `MATH-PROOF-01..16` retained.

Result: `RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION = CLOSED / PASS`. Next phase per authoritative order is `RESEARCH_ADVERSARIAL_EDGE_CASE_SATURATION`; Planning C remains blocked.