# 000-base — Reconstructed Founding Contract

Status: RECONSTRUCTED / ACCEPTED REPOSITORY BASELINE
Contract kind: base scope increment
Reconstruction date: 2026-09-26

## Purpose

This increment records the durable founding scope that predates the chronological contract-increment model. It is a provenance reconstruction from already accepted repository authority and implemented evidence; it does **not** introduce new product scope.

Later scope additions belong in numbered addenda and must not be backfilled into this base merely because they are now implemented.

## Founding product identity

System Builder is a factory/assembler for producing and evolving client systems from explicit operational/business knowledge and software capabilities. The Builder is distinct from the generated Runtime: the factory is not the product it manufactures.

The founding model preserves the separation between business/process meaning and technical system definition (`BusinessRecipe != SystemDefinition`) so business knowledge can survive implementation changes.

## Founding boundaries

The reconstructed base admits these durable boundaries:

1. **Builder != Runtime.** Generated client systems are products/artifacts of the Builder, not hosted extensions that require the Builder to remain alive.
2. **Published runtime autonomy.** A generated client runtime must continue ordinary operation when the Builder is unavailable.
3. **Compatibility before replacement.** Existing/legacy systems may be integrated rather than requiring forced migration.
4. **Open/portable architecture.** Contracts, data and generated artifacts must remain portable; open source alone is not sufficient to satisfy this boundary.
5. **Replaceable suite modules.** A suite module is a reference implementation behind explicit contracts, not an unavoidable runtime dependency where interoperability is possible.
6. **Explicit bounded-context contracts.** Modules must not acquire authority by reaching through another module's internals.
7. **Repository-backed durable decisions.** Durable product/architecture decisions terminate in repository artifacts such as contracts, ADRs, specs, tests or code.

## Founding transformation spine

The base product direction admits an explicit transformation from operational/business description toward a generated system and autonomous runtime. Exact intermediate schemas, providers, editors, studios, workflows, deployment mechanisms and UI surfaces are **not** frozen by this reconstruction; those details remain governed by accepted ADRs/contracts and later admitted increments.

At minimum, the founding separation is:

```text
operational/business knowledge
        ↓
BusinessRecipe / equivalent durable business representation
        ↓
SystemDefinition / equivalent technical definition
        ↓
assembly / generation / release
        ↓
autonomous client Runtime
```

## Explicit non-claims

This reconstruction does not by itself admit or promote:

- Generation 3 or Generation 4 research findings;
- Station-specific editors, desktop/window composition, Launcher/AppManifest authority or UI implementation details;
- particular provider technologies, orchestration engines, databases, deployment vendors or language choices;
- later milestone/WBS/package/task scope merely because it appears in historical execution planning;
- new Core/business authority;
- any research hypothesis not already accepted through repository authority.

Those require an accepted later increment and/or the normal ADR/contract authority appropriate to their change level.

## Provenance

This reconstruction is grounded in accepted repository authority and corroborating implementation/execution evidence, principally:

- `AGENTS.md` constitutional invariants, including `BusinessRecipe != SystemDefinition`, `Builder != Runtime`, published runtime autonomy, compatibility-before-replacement, portability, replaceable modules and explicit bounded-context contracts;
- accepted architecture/ADR material referenced by the repository authority chain;
- integrated execution evidence that preserves autonomous Runtime behavior and the BusinessRecipe/SystemDefinition separation.

Historical execution plans are corroborating evidence only; their old scheduling/status language is not promoted to present authority.

## Supersession and amendments

This file is the chronological root of scope provenance. It should change only to correct reconstruction errors or improve provenance without silently importing later scope.

Material scope accepted after the founding baseline belongs in `docs/contracts/001-*`, `002-*`, and subsequent addenda. In conflicts, explicit accepted supersession in a later increment controls according to `docs/DOCUMENT_AUTHORITY.md`.
