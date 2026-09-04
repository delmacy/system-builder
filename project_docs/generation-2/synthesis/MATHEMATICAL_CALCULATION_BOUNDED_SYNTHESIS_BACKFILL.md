# Bounded Synthesis Backfill — Mathematical Expressions, Rules & Calculation

Status: COMPLETE / BOUNDED
Date: 2026-09-04
Authority: post-Planning-B math research closure only. This addendum does not reopen unrelated capability synthesis.

## Decision

Generation 2 does **not** add a 29th canonical capability for calculation. Instead, it records a **cross-cutting portable calculation semantics subcapability** under `Universal Capability Architecture`, with evaluator mechanics eligible for providerization.

## Canonical primitive set added by synthesis backfill

The following names are architecture-level primitive candidates/owners for later target design; they are not product implementation commitments:

- `FormulaDefinition`
- `FormulaRevision`
- `EvaluationContext`
- `TypedValue`
- `UnitOfMeasure`
- `Money` / `CurrencyAmount`
- `Rate` / `Percentage` / `Ratio`
- `CalculationResult`
- `CalculationEvidence`
- `FormulaDependencyGraph`
- `EvaluationPolicy`
- `RoundingPolicy`
- `MaterializationPolicy`
- `HistoricalApplicability`
- `TemporalResolutionPolicy`
- `ProviderSemanticProfile`

Required invariants remain: `StoredFact != DerivedValue`; `FormulaDefinition != FormulaEvaluation`; `FormulaRevision != CalculationResult`; live recomputation != historical snapshot; provider identity != canonical formula identity.

## Ownership map

- **Universal Capability Architecture:** portable calculation semantic primitives and invariants.
- **Provider / Binding / Capability Negotiation:** qualification, binding and substitution of evaluator realizations.
- **Standards / Interoperability / API Contracts:** semantic-profile/conformance corpus and compatibility evidence.
- **Lifecycle / Versioning / Evolution / Migration:** revision applicability, evolution and migration mechanics.
- **Artifact / Release / SBOM / Provenance + Governance/Audit:** evidence/provenance integration where required.
- **Process & Application Modeling / Workflow / Data / UI / AGWS / Commercial / FinOps / domain owners:** retain semantic ownership of what each formula means and whether/where it is applicable.

## Non-goals

- no universal business-formula god-object;
- no arbitrary scripting/runtime escape hatch;
- no calculation-owned authorization or approval semantics;
- no automatic adoption of provider-specific AST/function IDs as canonical identity;
- no forced absorption of optimization, ML, simulation, cryptography, analytics policy or accounting policy.

## Synthesis result

`KEEP_AS_CROSS_CUTTING_SUBCAPABILITY + PROVIDERIZE_MECHANICS_WITH_PORTABLE_SEMANTICS`.

This bounded addendum is sufficient to carry the research decision forward without reopening unrelated canonical-capability synthesis.