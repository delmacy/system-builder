# Palantir Architecture Benchmark — G4

Status: `RESEARCH_ACTIVE / NON_EXECUTABLE`
Date: 2026-09-23
Scope: public-architecture benchmark only.

This corpus studies publicly documented Palantir Foundry/AIP/Apollo mechanisms as comparative evidence for System Builder G4. It does not authorize implementation, provider adoption, WBS, Work Packages, Sprints or TASKs. It does not treat product similarity as semantic equivalence and does not copy proprietary implementation.

## Constitutional comparison frame

System Builder repository authority requires `BusinessRecipe != SystemDefinition`, `Builder != Runtime`, autonomous published runtimes, compatibility before replacement, open-by-architecture portability, replaceable suite modules, explicit bounded-context contracts, and `AI inference != authority`.

Palantir is therefore used as evidence for mature patterns and failure classes, not as target architecture.

## Artifacts

- `PALANTIR_ARCHITECTURE_MAP.md` — Foundry/Ontology/AIP/Apollo public architecture map.
- `PALANTIR_APOLLO_AGENT_STUDY.md` — Hub/Spoke/Agent, Plans, constraints, reported state, connectivity and rollout.
- `PALANTIR_ONTOLOGY_SEMANTIC_LAYER_STUDY.md` — Ontology language/engine/toolchain, interfaces, actions and evolution.
- `PALANTIR_APPLICATION_BUILDING_STUDY.md` — OSDK, Developer Console, SuperRepo, Marketplace and branching.
- `PALANTIR_AIP_AGENT_STUDY.md` — AI logic, permissions, evaluations and authority boundaries.
- `PALANTIR_SB_COMPARISON_MATRIX.md` — bounded comparison against current SB architecture.
- `PALANTIR_PORTABILITY_LOCKIN_ANALYSIS.md` — interoperability versus platform/runtime dependency.
- `PALANTIR_TRANSFERABLE_PATTERN_REGISTER.md` — classified findings and follow-up proof obligations.

## Source policy

Primary sources are current official Palantir documentation. Findings record public mechanisms only. Claims about undocumented internals are prohibited. Absence from public documentation is recorded as `NOT ESTABLISHED`, never as proof that a capability does not exist.

## Initial maturity

Coverage is materially useful but not saturated. Strong first-pass evidence exists for Ontology, OSDK/SuperRepo, Apollo Plans/Agents/connectivity/release safety, Marketplace packaging, interfaces and AIP Logic. Remaining high-value gaps include air-gap bundle semantics, secrets/JIT access, agent upgrade/compromise recovery, multi-Hub authority, schema+deployment rollback coupling, detailed lineage/writeback reconciliation, AIP output/log classification propagation, and exact portability boundary of generated applications.