# P14-PACKAGE-01 — Evidence Identity & Transformation Lineage

Status: PLANNING MATERIALIZED / CONSTRUCTION A COMMITTED / NOT EXECUTED
Milestone: M14 Evidence & Provenance
Primary WBS: 14.1.1-14.2.3
Planning base: `4d113432c089621c5f327aed50843b6fd2c8321a`
Predecessor: M13 / P13-PACKAGE-01..03 CLOSED

## Package goal
Make evidence origin and transformation lineage portable, deterministic and query-ready across bounded-context artifacts without replacing Runtime Audit Trail, requiring sensitive payloads, or coupling the public artifact envelope to a provider, storage engine, tool vendor or registry.

## Baseline authority
- `project_docs/14-evidence-provenance/WBS.md`
- `project_docs/14-evidence-provenance/scope/README.md`
- `docs/adr/ADR-0009-public-artifact-envelope.md`
- `specs/contracts/artifact-envelope/artifact-envelope.schema.json`
- `project_docs/WORK_PACKAGE_CATALOG.md` (`WP-X01`)
- `project_docs/schedule/SPRINT_GENERATION_POLICY.md`
- `project_docs/schedule/SPRINT_MODE.md`

## Fresh-main gap matrix
- **14.1.1 — PARTIAL:** `artifactId` already provides stable logical artifact identity, but there is no reusable source-reference vocabulary for non-artifact origins.
- **14.1.2 — PARTIAL:** `provenance.createdAt` and `producer` are required by ADR-0009/envelope 1.0.0; portable origin/source details beyond input artifacts remain unstandardized.
- **14.1.3 — GAP:** confidence/classification is not yet represented by a bounded portable contract.
- **14.2.1 — PARTIAL:** `provenance.inputs` already references input artifact identity tuples and optional qualified digests.
- **14.2.2 — GAP:** transformation/tool/provider evidence is allowed by ADR-0009 but has no bounded provider-neutral schema/normalization semantics.
- **14.2.3 — GAP:** no canonical namespaced extension contract and round-trip proof currently guarantees lineage preservation through compatible readers/serializers.
- **14.3.1-14.3.3 — FORECAST / OUTSIDE THIS PACKAGE:** integrity/query navigation and migration/serialization certification will be planned as successor `P14-PACKAGE-02` after this package is integrated and fresh-main is revalidated.

## Boundary decision
Do **not** revise the ADR-0009 core envelope fields merely to satisfy M14. Use the envelope's existing additive provenance/extension policy. A new namespaced evidence-provenance extension may be introduced as an additive L3 contract; it must not reinterpret `artifactId`, `producer`, `inputs`, `requiredExtensions`, or `extensions`.

## Construction A — P14-EVIDENCE-PROVENANCE-CONTRACT-01
Status: COMMITTED / MATERIALIZED / NOT EXECUTED.
TASKs: TASK-267..273 in dependency order.
Goal: establish a provider-neutral evidence-provenance extension vocabulary, deterministic validation/normalization and lossless round-trip proof over the existing public artifact envelope.
Exit proof: representative artifacts can carry stable source references, optional classification/confidence, transformation descriptors and lineage links deterministically while historical envelope 1.0.0 documents remain compatible and no sensitive/provider-bound values are required.

## Construction B forecast
Candidate ID: `P14-EVIDENCE-PROVENANCE-PROPAGATION-01`.
Status: FORECAST / NOT MATERIALIZED.
Goal: propagate the integrated provenance contract through representative existing producers/transformers using actual module APIs and extend the growing proof across at least one real multi-stage artifact chain.
Promotion gate: Construction A integrated; fresh-main revalidation proves propagation gaps remain necessary for this Package Goal.

## Optional Construction C candidate
Status: FORECAST ONLY / NOT MATERIALIZED.
Candidate purpose: bounded remediation only if post-Construction-B evidence proves a remaining package-goal gap that cannot be closed in Package Review. It is not automatic.

## Growing package proof
1. Contract-level deterministic extension validation and backward compatibility.
2. Lossless unknown-compatible extension preservation and no-leak evidence.
3. Construction B, if promoted, must use actual producers/transformers rather than hand-authored downstream artifacts.
4. Package Review regresses provenance semantics, compatibility, security/no-leak, architecture boundaries and technical debt.

## Package Integration & Review gate
After required constructions are integrated, regress WBS 14.1-14.2, contract/schema drift, extension compatibility, provider/storage neutrality, no-leak behavior, actual lineage preservation and need for optional Construction C. Missing required product capability returns to explicit construction/change control.

## Documentation & Closure gate
Reconcile `PROJECT_STATE`, `CURRENT_MILESTONE`, `NEXT_WORK`, package/Sprint reports, WBS evidence and carried debt. No new product behavior during closure.

## Risks and controls
- **R14-01 Core-envelope overreach:** control by using additive namespaced extension semantics and preserving ADR-0009 core meaning.
- **R14-02 Provenance becomes execution authority:** provenance remains evidence only; authorization/audit boundaries are unchanged.
- **R14-03 Sensitive/provider data leakage:** contracts must not require secrets, credentials, provider resource IDs or storage locators; add negative tests.
- **R14-04 Hand-authored lineage proof:** growing proof must exercise real serializer/validator/module APIs when executable predecessors exist.
- **R14-05 Scope collision with Audit Trail:** Runtime action audit remains out of scope.

## Explicit non-goals
- Runtime Audit Trail replacement;
- mandatory sensitive payload capture;
- provider-specific registry/storage topology;
- new authorization semantics;
- WBS 14.3 implementation in this package;
- absorption of TD-P13-01..04.
