# Planning A Bounded Backfill — Mathematical Expressions, Rules & Calculation

Status: COMPLETE / PASS_FOR_BOUNDED_BACKFILL
Date: 2026-09-04
Scope: only boundaries affected by the post-Planning-B mathematical research decision.

## Owner

`Universal Capability Architecture` owns the portable, cross-cutting calculation semantic primitives and invariants. It does not own the business meaning of formulas.

## Boundaries

### With semantic owners

Process/Application Modeling, Workflow, Data, UI/Generated Experience, Adaptive Governed Work Surfaces, Commercial, FinOps and domain-specific capabilities define formula meaning, allowed inputs, applicability and consequences. The calculation subcapability supplies typed evaluation semantics, dependency/revision/evidence mechanics and a portable evaluator contract.

A successful calculation never authorizes an action. Workflow transition use does not transfer semantic ownership of the formula to Workflow. Commercial/FinOps formulas remain Commercial/FinOps truth, not calculator truth.

### With Provider / Binding

Provider/Binding owns evaluator support qualification, admission, binding, substitution and withdrawal. Provider-specific engine identity, AST identity and function identity are non-canonical. Replacement requires semantic-profile conformance evidence with `SUPPORTED/PARTIAL/UNSUPPORTED/INCONCLUSIVE` outcomes.

### With Standards / Interoperability

Standards/Interoperability owns the conformance-profile/corpus mechanics for decimal, failures, money/rates, units, temporal behavior, dependency/recomputation, resource bounds, security and evidence shape.

### With Lifecycle

Lifecycle owns revision/evolution mechanics. Calculation contributes `FormulaRevision` and `HistoricalApplicability` requirements but must not redefine global lifecycle semantics.

### With Authorization / Governance / AI / AGWS

`Enterprise → Station → Role → Person` may only narrow formula authoring/function/data authority. AI or low-code authoring is proposal/materialization under existing authority, never authority amplification. Generic formulas cannot resolve secrets, perform arbitrary queries/IO, mutate domain state, grant entitlement or approve work.

## Source of truth distinctions

- stored business facts remain with their domain/data owner;
- formula definition/revision is owned by the semantic owner using the UCA portable semantic contract;
- provider execution representation is realization evidence, never canonical formula identity;
- `CalculationResult` used as historical evidence binds the applicable formula revision and input/context revisions;
- current formula/current timezone/calendar/provider profile do not overwrite historical applicability.

## Temporal boundary

The portable contract distinguishes instant, local civil time, timezone identity, offset, date-based period, time-based duration, business-calendar revision, deadline inclusivity and DST gap/overlap resolution. Timezone-rule currentness/version is evidence when historical reproducibility depends on it.

## Resource/failure boundary

Evaluation is bounded. Resource-limit exhaustion is an explicit typed failure and cannot become an authoritative partial result. `Missing`, `Null`, `Unknown` and `Error` remain distinct unless an explicit revisioned semantic-owner policy defines a coercion.

## Non-goals

- new canonical Calculation capability;
- arbitrary scripting/rule-action engine;
- global semantic ownership of every formula;
- hidden provider defaults;
- implicit historical recomputation with latest formula/context;
- specialized solver/ML/simulation/cryptographic ownership.

## Result

Bounded Planning-A reconciliation: **PASS**. No unrelated capability boundary is reopened. This satisfies the taxonomy/boundary backfill required by the math exit gate.