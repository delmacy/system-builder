# Mathematical Expressions, Rules & Calculation — Evidence Ledger

Status: IN_PROGRESS — increments 1–2
Phase: RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION
Scope authority: `POST_PLANNING_B_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION_RESEARCH.md`
Evidence date: 2026-09-04

## Research question

What portable semantic contract is required for enterprise formulas, derived values and computed conditions so that calculation engines can be replaced without changing business meaning, historical truth or authority boundaries; and does that contract require a new canonical capability, a cross-cutting subcapability, an existing-owner primitive, or providerized mechanics?

This evidence ledger is intentionally bounded. Increment 1 established representative evidence for typed numerical semantics, deterministic evaluation, units, time, rounding, materialization and engine substitution. Increment 2 deepens null/missing/error/unknown behavior, dependency graphs/cycles/recomputation, historical applicability, bulk/offline execution and provider conformance. It still does not close the phase or promote a capability.

## Semantic invariants under test

- `StoredFact != DerivedValue`.
- `FormulaDefinition != FormulaEvaluation`.
- `FormulaRevision != CalculationResult`.
- live recomputation != historical snapshot.
- provider/expression-engine identity != canonical formula identity.
- calculation success != business authorization.
- syntactic validity != semantic/type validity.
- business decimal/money semantics must not silently degrade to binary floating point.
- the generic evaluator computes; the semantic owner defines what the formula means.

## Evidence ledger — increment 1

| ID | Representative / source | Evidence observed | Architectural implication | Coverage |
|---|---|---|---|---|
| MATH-E01 | OMG DMN 1.5 / FEEL — https://www.omg.org/spec/DMN/1.5 | FEEL is a standardized expression language with explicit semantic types including number, boolean, null, date, time, date-time, day-time duration and year-month duration. DMN separates decision expression semantics from surrounding decision model ownership. | A portable expression contract can carry typed temporal/null semantics without making the evaluator the owner of the business decision. FEEL is a strong interoperability representative for conditions and decision calculations. | DEEP for type families; PARTIAL for precision/provider substitution. |
| MATH-E02 | Common Expression Language (CEL) specification — https://github.com/cel-expr/cel-spec and `doc/langdef.md` | CEL is side-effect-free, terminating, memory-safe and strongly/gradually typed; supports typed AST serialization and control-plane compilation vs data-plane evaluation. Core numbers are int64/uint64/IEEE-754 double; overflow is an error for integer range. Timestamp and Duration are abstract types. | Sandboxed deterministic evaluation is practical and portable, but CEL's numeric profile is not sufficient as an unqualified business-money profile. Canonical formula semantics must declare a numeric/precision profile rather than inheriting an engine default. Serialized type-checked ASTs show a useful separation between formula identity/revision and provider execution representation. | DEEP for sandbox/type-check/evaluation boundary; PARTIAL for business decimal. |
| MATH-E03 | Microsoft Power Fx — https://learn.microsoft.com/en-us/power-platform/power-fx/data-types and formula references | Power Fx distinguishes Decimal from Float; Decimal is base-10 exact and recommended for most business calculations, while Float is IEEE-style binary approximation. Rounding functions have explicit behavior. Formula language is embedded in low-code hosts rather than owning the host's domain semantics. | Enterprise calculation needs decimal-first semantics where business precision matters and an explicit `RoundingPolicy`; engine replacement cannot be qualified merely by accepting the same formula text. Low-code authoring can remain constrained while domain ownership stays outside the formula engine. | DEEP for decimal/low-code arithmetic; PARTIAL for revision lineage. |
| MATH-E04 | PostgreSQL numeric + generated columns — https://www.postgresql.org/docs/current/datatype-numeric.html and https://www.postgresql.org/docs/current/ddl-generated-columns.html | `numeric/decimal` provides exact selectable precision; scale coercion performs rounding and overflow can error. Generated columns distinguish derived values from directly writable stored facts, recompute from row inputs, and restrict generation expressions to immutable functions and current-row dependencies. PostgreSQL 18 distinguishes virtual vs stored generated columns. | Exact decimal, overflow behavior, immutable-expression restrictions and stored-vs-live derivation are independent dimensions that belong in portable semantics. Database generated columns are a realization, not the canonical formula identity, and cannot cover cross-record/business historical applicability alone. | DEEP for exact decimal/materialization boundary; PARTIAL for cross-record dependency graph. |
| MATH-E05 | JSONata — https://docs.jsonata.org and https://docs.jsonata.org/date-time | JSONata is an expression/transformation language over JSON. `$now()`/`$millis()` capture evaluation time once per expression, so repeated calls within one evaluation observe the same instant. Date/time convention is ISO-8601-oriented over JSON strings/milliseconds. | Evaluation context must capture non-input contextual values such as evaluation time once and record them in evidence if results need replay. Determinism is contextual: a function can be stable within one evaluation while historical replay still requires captured context. | DEEP for evaluation-time context; PARTIAL for type/precision. |
| MATH-E06 | UCUM 2.2 — https://ucum.org/ucum | UCUM defines machine-readable unit expressions with precise semantics, dimensional equivalence/commensurability and computationally verifiable conversions. It explicitly targets electronic communication across science, engineering and business; currency is outside UCUM scope. | `UnitOfMeasure` should use portable semantic identity and dimensional compatibility rather than provider/display strings. Units and money are separate typed domains; a generic evaluator must reject or qualify incompatible dimensions rather than multiply arbitrary strings. | DEEP for units; N_A for currency. |
| MATH-E07 | ISO 4217 currency codes — https://www.iso.org/iso-4217-currency-codes.html | ISO 4217 defines canonical alphabetic/numeric currency identifiers and, for currencies with minor units, the decimal relationship between currency and fractional unit. The maintenance authority updates code tables over time. | `Money` needs currency identity/revision/currentness separate from numeric magnitude. Currency exponent/minor-unit metadata does not itself define the business rounding policy, which must remain explicit and historically applicable. | DEEP for currency identity; PARTIAL for rounding semantics. |

## Increment 1 convergence

1. **Typed semantics beat untyped expression text.** DMN/FEEL, CEL and Power Fx all make types material to evaluation. Equivalent-looking source text is not sufficient evidence of equivalent behavior across engines.
2. **Business decimal cannot inherit engine defaults.** CEL's core floating type is IEEE-754 double, while Power Fx and PostgreSQL provide decimal/exact arithmetic. Substitution therefore requires a declared numeric profile and conformance tests, not provider-name replacement.
3. **Purity/sandboxing is a first-class portability boundary.** CEL deliberately forbids side effects and nontermination; PostgreSQL generated expressions require immutability. Formula evaluation should not become an arbitrary action/integration escape hatch.
4. **Materialization policy is distinct from formula semantics.** PostgreSQL makes virtual/stored derived values explicit. The canonical model must distinguish live derivation from persisted historical result.
5. **Context can affect determinism.** JSONata stabilizes time within one evaluation, showing that deterministic replay requires captured contextual inputs, not merely formula source.
6. **Units and currency require semantic identifiers.** UCUM supplies dimensional semantics; ISO 4217 supplies currency identity/minor-unit metadata. Neither should be reduced to display labels.
7. **Semantic ownership remains outside the evaluator.** A formula engine can calculate a result but does not decide whether that result represents labor cost, a billing charge, an approval threshold, inventory valuation policy or authorization.

## Evidence ledger — increment 2: failure semantics, DAG/recomputation and history

| ID | Representative / source | Evidence observed | Architectural implication | Coverage |
|---|---|---|---|---|
| MATH-E08 | CEL language definition / cel-go partial evaluation — https://github.com/cel-expr/cel-spec/blob/master/doc/langdef.md and https://github.com/google/cel-go | CEL makes `null` a distinct runtime type rather than generic absence; dynamic inputs can still produce runtime type errors. CEL also distinguishes **unknown** from **error** during partial evaluation, and commutative boolean operators can sometimes resolve a result despite unknown/error inputs. Checked ASTs retain source positions and partial evaluation can produce residual expressions. | `Missing`, `Null`, `Unknown` and `Error` cannot be normalized to one sentinel. A portable profile needs explicit dispositions plus evidence of which inputs remain unresolved. Provider conformance must test truth tables and short-circuit/partial-state behavior, not only successful values. | DEEP for null/error/unknown distinction and partial evaluation. |
| MATH-E09 | Microsoft Power Fx formula-level error handling — https://learn.microsoft.com/en-us/power-platform/power-fx/error-handling | Power Fx has explicit error values and error propagation, but Blank is distinct and arithmetic can coerce Blank to zero in some contexts. `IfError` can replace selected errors; unobserved branches can contain errors without surfacing them. Formula-level error handling is configurable historically for older apps. | Provider defaults may silently turn missing/blank into numeric zero or suppress unobserved errors. Portable enterprise semantics therefore need **no implicit blank-to-zero/false coercion unless formula policy explicitly requests it**, plus engine-profile evidence recording error-mode assumptions. | DEEP for Blank/error coercion hazard. |
| MATH-E10 | Drools DMN / FEEL implementation — https://kie.apache.org/docs/10.1.x/drools/drools/DMN/index.html | Drools implements FEEL numbers using Decimal128/BigDecimal semantics with 34 digits precision; invalid numeric conditions can yield `null`. Drools extends DMN in some type/function areas. | Even standards-aligned engines carry implementation profiles/extensions. Standards conformance alone does not prove provider equivalence; precision, null/error mapping and extensions need a qualified engine profile. | DEEP for implementation-profile divergence; PARTIAL for historical revision. |
| MATH-E11 | HyperFormula 3.4 dependency graph — https://hyperformula.handsontable.com/docs/guide/dependency-graph.html | HyperFormula models formula/cell/range dependencies as a directed graph and evaluates prerequisites before dependents. It performs dependency-aware recalculation rather than treating formulas as isolated calls. | Cross-formula calculation requires a first-class dependency graph and stable formula/input identities. Recalculation scope can be derived from dependency closure; ad-hoc “recalculate everything” is not the only viable model. | DEEP for dependency graph. |
| MATH-E12 | HyperFormula batch/volatile execution — https://hyperformula.handsontable.com/docs/api/classes/hyperformulans.html and https://hyperformula.handsontable.com/docs/guide/volatile-functions.html | Batch operations can defer evaluation so multiple mutations trigger one necessary recomputation set. Volatile functions such as NOW/TODAY/RAND are recalculated on defined actions and therefore explicitly escape pure input-only determinism. | Recalculation policy needs trigger/batch semantics and volatile/contextual-function classification. Historical replay cannot rely on reevaluating volatile functions; captured context/result lineage is required. | DEEP for batch/recompute/volatility. |
| MATH-E13 | HyperFormula headless server-side execution — https://hyperformula.handsontable.com/docs/ and https://github.com/handsontable/hyperformula | HyperFormula is headless, runs in browsers and Node.js, supports hundreds of spreadsheet-compatible formulas and can be integrated server-side without a UI or mandatory remote service. | Offline/self-hosted evaluator mechanics are feasible. Provider substitution can include local engines, but licensing and function-profile compatibility remain qualification dimensions rather than canonical identity. | DEEP for local/offline; PARTIAL for semantic equivalence. |
| MATH-E14 | Camunda DMN / History — https://camunda.com/platform/decision-engine/ and https://docs.camunda.io/docs/components/modeler/dmn/ | Camunda executes DMN/FEEL decisions at scale and exposes historical decision information including past inputs, rules triggered and outputs. DMN models and decision requirements graphs separate decision dependencies from process orchestration. | Historical evidence is a first-class concern: authoritative replay/audit requires the decision/formula revision plus inputs and outputs, not just recomputing today's model. Decision history is evidence, not replacement for canonical business-record ownership. | DEEP for history/evidence; PARTIAL for revision-addressing details. |
| MATH-E15 | Stripe Price object — https://docs.stripe.com/api/prices/create | Stripe treats price-bearing commercial definitions as separately identified Price objects; price updates are bounded, and changing the economic amount is modeled by creating another Price rather than mutating arbitrary historical meaning in place. | A commercial formula/rate change should be revisioned/adopted with historical applicability. This is supporting evidence for `FormulaRevision != CalculationResult` and for retaining prior records against prior revisions, while Commercial remains semantic owner. | PARTIAL supporting pattern; provider-specific commercial semantics are not canonical calculation semantics. |
| MATH-E16 | Drools rule engine agenda — https://docs.jboss.org/drools/release/latest/drools-docs/drools/rule-engine/index.html | Rules can react to working-memory changes and repeatedly activate other rules; the agenda and conflict-resolution strategy control execution order. Rule consequences may mutate facts and cause further evaluation. | Generic **formula evaluation** should stay separate from state-mutating rule/action execution. A calculation DAG should reject implicit cycles unless a specifically owned fixed-point/iterative policy exists; Drools-style action loops are not a safe default for derived-value formulas. | DEEP boundary evidence between pure calculation and stateful rules. |

## Increment 2 convergence

### 1. Failure values are a semantic algebra, not one nullable slot

Cross-engine evidence materially diverges:

- CEL: `null` is a real type; **unknown** and **error** are distinct evaluation states.
- Power Fx: Blank and Error are distinct, but some arithmetic contexts coerce Blank to zero.
- Drools/FEEL: invalid numeric evaluation may materialize as `null` under FEEL implementation semantics.

Therefore a provider-neutral profile must at least distinguish `PRESENT(value)`, `MISSING`, `NULL`, `UNKNOWN`, and `ERROR`; domain owners may further constrain which states are legal. Silent mapping `MISSING|NULL|UNKNOWN|ERROR -> 0|false|""` is forbidden unless an explicit, revisioned formula policy declares that coercion.

### 2. Formula dependencies require acyclic-by-default graph semantics

HyperFormula demonstrates an explicit directed dependency graph with dependency-aware recomputation. Stateful rule engines demonstrate that mutation-driven rule activation is a different execution model. The portable calculation layer should therefore treat formula dependencies as a DAG by default and reject cycles at validation/materialization time. A fixed-point/iterative cycle, if ever needed, must be an explicit domain-owned algorithm with convergence/iteration bounds and cannot arise accidentally from low-code references.

### 3. Recalculation policy is independently revisioned behavior

Batching and volatile-function evidence show that “when does this recompute?” is separate from “what does this formula mean?”. A formula may be recomputed on source change, transaction close, explicit command, schedule, or not at all after authoritative snapshot materialization. Volatile/contextual inputs such as clock/calendar/randomness require captured context and cannot be silently replayed against current values.

### 4. Historical evidence must bind revision + inputs + context + result

Decision-history and price-versioning patterns reinforce that authoritative historical truth is not reconstructed by “run latest formula now”. A `CalculationResult` used as evidence should bind at minimum the canonical formula revision, input identities/revisions (or immutable normalized snapshot), relevant contextual revisions (calendar, currency/rate/rounding policy, evaluation instant), provider semantic-profile qualification, and output/error disposition.

### 5. Provider substitution is a conformance problem, not parser compatibility

Two engines are substitutable only for the declared semantic profile. Required conformance vectors include:

- type system and null/missing/error/unknown truth tables;
- decimal precision, overflow and rounding mode/application point;
- money/currency and rate semantics;
- units and dimensional conversion;
- date/time/duration/calendar semantics;
- function/operator behavior and evaluation order where observable;
- volatile/contextual inputs;
- dependency/cycle/recomputation behavior;
- deterministic serialization/evidence output;
- sandbox/purity and resource limits;
- offline/bulk capability and engine-version currentness.

Conformance outcome should be qualified as `SUPPORTED`, `PARTIAL`, `UNSUPPORTED` or `INCONCLUSIVE`; provider IDs remain non-canonical.

## Enterprise proof extensions — increment 2

### MATH-PROOF-09 — SLA/calendar deadline

Example intent: `Deadline = BusinessCalendar.add(OpenedAt, SLA_Duration)`.

Proof obligations:

- `OpenedAt` is a stored timestamp with zone/offset semantics; `SLA_Duration` is typed duration, not a display string;
- the applicable business-calendar revision/holiday set/time-zone/DST rule is explicit evidence;
- missing calendar or stale/unqualified calendar yields `INCONCLUSIVE`/error, never fallback to 24x7 by accident;
- replay of an old SLA uses the historically applicable calendar revision unless an explicit correction is authorized;
- Workflow may consume the deadline, but does not own the calendar/formula semantics merely because the result gates a transition.

### MATH-PROOF-10 — computed approval threshold

Example intent: `RequiresApproval = EffectiveAmount > ApplicableApprovalThreshold`.

Proof obligations:

- amount and threshold use compatible Money/currency semantics;
- threshold revision/effective period is explicit;
- `UNKNOWN` amount or threshold never coerces to `false` and bypasses approval;
- calculation success does not grant approval authority; Authorization/Policy remains owner of who may approve.

### MATH-PROOF-11 — commission/rate

Example intent: `Commission = QualifiedBase × ApplicableRate`.

Proof obligations:

- rate is a typed percentage/rate with explicit basis and scale;
- rate/formula revision is selected by historical applicability;
- rounding point and mode are explicit and reproducible;
- later rate changes do not silently mutate historical commission snapshots;
- Commercial/HR/domain policy owns commission meaning; calculator provides mechanics.

### MATH-PROOF-12 — inventory valuation

Example intent: a domain-owned valuation policy may use weighted-average or another bounded method.

Proof obligations:

- inventory domain owns lot/movement/value semantics and policy selection;
- quantities carry compatible units; money carries currency; conversion/FX is separately qualified;
- dependency graph can show which movement/source revisions contributed to the derived valuation;
- correction/revaluation is explicit lineage, not overwrite of prior evidence;
- provider engine cannot invent accounting policy from generic arithmetic support.

### MATH-PROOF-13 — derived form field

Example intent: UI shows `Total = Quantity × UnitPrice` while editing.

Proof obligations:

- preview is a live `DerivedValue`, not automatically an authoritative persisted fact;
- missing quantity/price follows explicit display/form semantics and does not silently become authoritative zero;
- the canonical formula revision is not a UI-control/provider ID;
- if the record is saved with an authoritative snapshot, the saved result carries formula/input lineage;
- low-code/AI authoring cannot reference unauthorized data/functions or mutate schema/policy as a formula side effect.

## Provider semantic-conformance evidence requirements

For a candidate evaluator/provider to be qualified for a canonical formula profile, evidence should include:

1. engine/version and adapter/profile revision;
2. canonical conformance corpus ID/revision;
3. normalized formula revision and provider execution-material hash, kept distinct;
4. pass/fail/partial/inconclusive results over typed boundary vectors;
5. exact expected and observed values/dispositions for decimal, rounding, null/missing/error/unknown, units, time/calendar and cycle cases;
6. resource/sandbox limits and prohibited functions/effects;
7. bulk/offline capability and determinism constraints;
8. currentness/applicability period of the qualification;
9. substitution comparison against the currently effective provider profile;
10. explicit non-equivalence surfacing rather than fallback to a “closest” provider behavior.

## Provisional ownership assessment after increment 2

Evidence is now stronger for **cross-cutting portable calculation semantics + providerized evaluator mechanics**, reused by semantic owners, rather than a standalone calculation god-object. No evidence in this increment requires a new top-level canonical capability: formula meaning remains naturally owned by Process/Application, Data, Workflow conditions, Commercial, FinOps, UI-derived fields or other domains, while the reusable concern is the typed/evidence-bearing calculation contract and engine conformance boundary.

This remains **provisional / no taxonomy promotion yet**. Remaining research should still close temporal/calendar edge semantics, formula revision/adoption mechanics, bulk/resource-exhaustion limits, cross-engine conformance corpus design, and whether bounded synthesis/Planning-A backfill is necessary to name the cross-cutting subcapability explicitly.

## Proof obligations opened by increment 1

- MATH-PROOF-01: same decimal business formula produces equivalent canonical result/evidence across two engines with different native numeric defaults, or substitution is rejected as non-equivalent.
- MATH-PROOF-02: rounding mode/scale changes are revisioned and old historical results remain tied to the old policy.
- MATH-PROOF-03: zero, missing, null, unknown and error inputs have distinct explicit dispositions; none silently become zero/false.
- MATH-PROOF-04: unit-incompatible arithmetic is rejected; valid UCUM-equivalent units normalize without changing business meaning.
- MATH-PROOF-05: labor hourly cost rejects mixed currency without explicit qualified conversion and division by zero productive hours.
- MATH-PROOF-06: service-order labor cost replays using the historically applicable hourly-cost/formula/input revisions rather than the current formula.
- MATH-PROOF-07: a provider-specific function/AST cannot leak into canonical formula identity; unsupported semantics yield `PARTIAL`, `UNSUPPORTED` or `INCONCLUSIVE` rather than false equivalence.
- MATH-PROOF-08: AI/low-code formula authoring can propose/edit only within delegated formula authority and permitted inputs/functions; a request requiring domain/schema/policy change escalates instead of being materialized as a formula side effect.

## Proof obligations opened by increment 2

- MATH-PROOF-09: SLA/calendar deadlines replay with the historically applicable calendar/time-zone/holiday revision and never default missing calendar evidence to 24x7.
- MATH-PROOF-10: computed approval conditions fail closed or remain inconclusive on unknown inputs and never grant approval authority.
- MATH-PROOF-11: commission/rate calculations bind rate revision, basis and rounding policy; historical snapshots survive later rate changes.
- MATH-PROOF-12: inventory valuation preserves domain ownership, movement/input lineage and explicit correction/revaluation rather than overwriting history.
- MATH-PROOF-13: derived form previews remain distinct from authoritative stored snapshots and obey data/authoring authority boundaries.
- MATH-PROOF-14: dependency cycles are rejected by default; any iterative/fixed-point semantics require an explicit owner, convergence rule, resource bound and proof.
- MATH-PROOF-15: provider substitution runs the same conformance corpus and rejects/marks `PARTIAL|INCONCLUSIVE` when failure, decimal, temporal, unit or recomputation semantics diverge.
- MATH-PROOF-16: bulk/offline evaluation preserves the same canonical results/evidence as single-evaluation semantics within declared resource limits; exhaustion produces explicit failure, not partial silent values.

## Remaining questions for next increment

1. Deepen temporal/calendar semantics: DST gaps/overlaps, month/year duration, business calendars, time-zone database revision and deadline inclusivity.
2. Compare formula/model revision deployment and historical applicability in at least two mature decision/rating systems.
3. Define canonical dependency/cycle diagnostics and bounded resource-exhaustion behavior for large DAGs/bulk evaluation.
4. Build a concrete provider-conformance matrix/corpus outline for two semantically different engines.
5. Decide whether the evidence is sufficient for `KEEP_AS_CROSS_CUTTING_SUBCAPABILITY + PROVIDERIZE_MECHANICS_WITH_PORTABLE_SEMANTICS` and, if so, identify the minimum bounded synthesis/Planning-A boundary backfill.
6. Perform a negative-space pass over math-specific security/authority issues before closing the math gate.

## Current gate disposition

`RESEARCH_MATHEMATICAL_EXPRESSIONS_RULES_CALCULATION = IN_PROGRESS`.

Increment 2 materially improves the exit-gate evidence but does not close it. Planning C remains blocked. Adversarial Edge-Case Saturation remains queued until this research and any bounded taxonomy/Planning-A backfill close.