# WBS — 19 Pre-Alpha Productization

## 19.0 Pre-Alpha Productization
Status: FORECAST / NOT MATERIALIZED

Predecessor gate: M18 Process Versioning is canonically CLOSED, including WBS 18.3.

### 19.1 Integrated Factory Journey
- **19.1.1** Define one canonical reference journey from approved BusinessRecipe revision through Analysis/Definition, capability resolution, Assembly, Validation, Compiler, Release and Deployment.
- **19.1.2** Compose the existing bounded modules deterministically through public contracts and reject missing, stale, incompatible or lineage-broken predecessor artifacts.
- **19.1.3** Prove a reproducible end-to-end factory run from a clean checkout/environment without hand-authored downstream fixtures.

Work Package: `P19-PACKAGE-01 — Integrated Factory Vertical Slice`.

### 19.2 Operator Bootstrap & Autonomous Handoff
- **19.2.1** Provide a minimal operator-facing bootstrap surface with declared inputs/configuration, deterministic entrypoint, progress/result output and actionable diagnostics.
- **19.2.2** Materialize and launch the generated runtime in the existing initial topology with external configuration/secrets and immutable published artifact.
- **19.2.3** Prove Builder-off operation plus restore/evolve/upgrade/rollback continuity from the same release lineage.

Work Package: `P19-PACKAGE-02 — Pre-Alpha Bootstrap & Autonomous Handoff`.

### 19.3 Dogfood Acceptance & Pre-Alpha Release
- **19.3.1** Build/deploy one real maintainer-owned reference process/system through the integrated factory path without bypasses.
- **19.3.2** Evolve that process through a successor approved revision/release and prove autonomous runtime upgrade/rollback with lineage preserved.
- **19.3.3** Execute the pre-alpha release gate: clean bootstrap, core + heavy verification, E2E journey, autonomy, release/deploy integrity, known-limitations classification, operator documentation and immutable pre-alpha version/tag evidence.

Work Package: `P19-PACKAGE-03 — Dogfood Validation & Pre-Alpha Release`.

## Completion definition
M19 is complete when maintainers can run one real process through the supported factory path into an autonomous generated runtime, repeat the path from a clean environment, evolve it with lineage preserved, diagnose bounded failures and point to an immutable pre-alpha candidate with explicit limitations.

## Excluded unless proven blocker
Production-grade visual builder/polish; SaaS multi-tenancy; billing; marketplace; external-customer onboarding; additional deployment topologies; generalized performance optimization; unrelated technical debt; second unrelated client-system proof; production SLA/readiness.

Any discovered L4 requirement requires an ADR and cannot be hidden inside integration/productization.