# WBS — 19 Pre-Alpha Productization

## 19.0 Pre-Alpha Productization

Status: FORECAST / NOT MATERIALIZED

Purpose: convert the already implemented System Builder bounded capabilities into one runnable, evidence-backed pre-alpha product journey without reopening closed architecture milestones or hiding new architecture inside integration work.

Predecessor gate: M18 Process Versioning must be canonically CLOSED, including WBS 18.3 process→system lineage. Forecast does not authorize execution.

### 19.1 Integrated Factory Journey — FORECAST / NOT MATERIALIZED
- **19.1.1** Define one canonical pre-alpha reference journey from approved BusinessRecipe version through SystemAnalysis/SystemDefinition, capability resolution, AssemblyPlan, ValidationEvidence, ReleaseArtifact, PublishedRelease and DeploymentRecord.
- **19.1.2** Implement deterministic composition/orchestration across the existing bounded modules using only public contracts; reject missing, stale, incompatible or lineage-broken predecessor artifacts explicitly.
- **19.1.3** Prove one reproducible end-to-end factory run on a fresh environment, with complete artifact/version/provenance lineage and no hidden dependency on historical fixtures or manual in-memory stitching.

Candidate Work Package: `P19-PACKAGE-01 — Integrated Factory Vertical Slice`.

Exit proof: a fresh checkout can execute one declared reference journey using repository-supported commands/entrypoints and produce a verifiable deployment candidate through the real module chain.

### 19.2 Pre-Alpha Operator Bootstrap & Runtime Handoff — FORECAST / NOT MATERIALIZED
- **19.2.1** Provide a minimal operator-facing bootstrap surface for the reference journey: required inputs, environment/config validation, deterministic command/API entrypoint, progress/result output and actionable failure diagnostics.
- **19.2.2** Materialize and launch the generated autonomous runtime in the declared initial target topology, binding external configuration/secrets without mutating the published artifact and without requiring the Builder after handoff.
- **19.2.3** Prove stop-Builder/start-runtime/operate/observe/upgrade/rollback continuity from the same generated release lineage, including clean-environment repeatability and documented recovery boundaries.

Candidate Work Package: `P19-PACKAGE-02 — Pre-Alpha Bootstrap & Autonomous Handoff`.

Exit proof: an operator who is not reconstructing internal test fixtures can run the documented path from inputs to an independently operating generated runtime and diagnose bounded failures.

### 19.3 Dogfood Acceptance & Pre-Alpha Release Gate — FORECAST / NOT MATERIALIZED
- **19.3.1** Build and deploy one real maintainer-owned reference system/process through the integrated factory path; capture defects and missing capability as explicit evidence rather than bypassing the pipeline.
- **19.3.2** Execute the autonomous-system acceptance slice applicable to pre-alpha: operate with Builder unavailable, restore Builder, evolve the approved process/definition, publish a successor release and perform bounded upgrade/rollback with lineage preserved.
- **19.3.3** Define and execute the pre-alpha release gate: clean bootstrap, core + heavy product verification, end-to-end reference journey, runtime autonomy, release/deploy integrity, known-blocker classification, operator documentation and immutable pre-alpha version/tag evidence.

Candidate Work Package: `P19-PACKAGE-03 — Dogfood Validation & Pre-Alpha Release`.

Exit proof: a repository-tagged pre-alpha candidate exists whose limitations are explicit, whose reference journey is reproducible, and whose generated runtime remains operational independently of the Builder.

## Scope boundaries

M19 is integration/productization, not a license to redesign the architecture. It must reuse the existing Mirror/Recipe/Analysis/Definition/Catalog/Assembly/Validation/Compiler/Release/Deploy/Runtime/Observe/Support contracts where sufficient.

Explicitly outside the pre-alpha gate unless fresh evidence proves a hard blocker:
- broad UI/visual polish or a production-grade low-code canvas;
- multi-tenant SaaS control plane;
- marketplace/ecosystem packaging;
- additional deployment topologies beyond the declared initial target;
- generalized performance optimization without a measured blocker;
- unrelated technical-debt absorption;
- reopening closed M13–M17 behavior merely to simplify orchestration;
- production SLA, billing, commercial onboarding or public-beta requirements.

Any required L4 change discovered while materializing M19 must stop the affected construction path and obtain an ADR rather than being smuggled into integration.

## Package sequencing baseline

Expected path to pre-alpha from the current M18 state:

1. `P18-PACKAGE-02` — Semantic Process Change Classification & Approval Evidence (current).
2. `P18-PACKAGE-03` — Process→System Lineage / WBS 18.3.
3. `P19-PACKAGE-01` — Integrated Factory Vertical Slice.
4. `P19-PACKAGE-02` — Pre-Alpha Bootstrap & Autonomous Handoff.
5. `P19-PACKAGE-03` — Dogfood Validation & Pre-Alpha Release.

The package count is a baseline forecast, not a commitment. Each successor remains subject to fresh-main derivation and the repository rolling-wave policy.