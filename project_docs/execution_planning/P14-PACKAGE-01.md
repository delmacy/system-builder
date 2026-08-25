# P14-PACKAGE-01 — Evidence Identity & Transformation Lineage

Status: CONSTRUCTION A INTEGRATED / PROPAGATION GAP CONFIRMED / CONSTRUCTION B PLANNING ELIGIBLE
Milestone: M14 Evidence & Provenance
Primary WBS: 14.1.1-14.2.3
Planning base: `4d113432c089621c5f327aed50843b6fd2c8321a`
Construction A merge-main: `2ba94b028819e5daf8d4ff63bebe94209675774d`
Post-Construction-A memory merge-main: `4a9892448d45e5d3fde200a8102e3198de12fc8d`
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

## Construction A — P14-EVIDENCE-PROVENANCE-CONTRACT-01
Status: COMPLETE / SPRINT REVIEW PASS / INTEGRATED.
TASKs: TASK-267..273 completed in dependency order.
Reviewed head: `eb881c9a07882cba9ec1d9068056166c922779c4`.
Gates: Deterministic CI #717 PASS; Heavy Product Tests #142 PASS; zero blocking review threads.
Merge-main: `2ba94b028819e5daf8d4ff63bebe94209675774d`.
Tree equivalence: reviewed head and merge-main both resolve to tree `8fcd51469846fe7ab11aedf62ec18720fea0a2c6`.
Result: additive provider-neutral evidence-provenance extension, deterministic normalization, stable non-artifact source references, optional classification/confidence, transformation descriptors, compatible lineage round trips, historical envelope compatibility and no-leak proof are integrated without changing ADR-0009 core semantics.

## Post-Construction-A fresh-main truth
Post-Construction-A repository memory reconciliation PR #333 passed Deterministic CI #718 and Heavy Product Tests #143 on exact head `d0c604d148e2ff445dec504729acea0b53d5acae` and integrated as `4a9892448d45e5d3fde200a8102e3198de12fc8d`.

Fresh-main revalidation confirms a required propagation gap remains. The integrated evidence-provenance namespace is exercised by the contract, fixtures and product proofs, but repository-wide search finds no representative existing product producer/transformer surface yet propagating that provenance through actual module APIs. Construction A therefore closes contract semantics, but the Package Goal still requires real bounded-context propagation and at least one real multi-stage artifact-chain proof.

## Construction B — P14-EVIDENCE-PROVENANCE-PROPAGATION-01
Status: ELIGIBLE FOR SEPARATE PLANNING & MATERIALIZATION / NOT MATERIALIZED / NOT AUTHORIZED FOR EXECUTION.
Candidate goal: propagate the integrated provenance contract through representative existing producers/transformers using actual module APIs and extend the growing proof across at least one real multi-stage artifact chain.
Promotion evidence: Construction A is integrated and fresh-main revalidation proves the propagation gap is real and necessary for this Package Goal.
Execution gate: a separate Planning & Materialization step must define the bounded TASK set and integrate before any Construction B product execution.

## Optional Construction C candidate
Status: FORECAST ONLY / NOT MATERIALIZED.
Candidate purpose: bounded remediation only if later evidence proves a remaining package-goal gap that cannot be closed in Package Review. It is not automatic.

## Growing package proof
1. Contract-level deterministic extension validation and backward compatibility — integrated by Construction A.
2. Lossless unknown-compatible extension preservation and no-leak evidence — integrated by Construction A.
3. Construction B, after separate materialization, must use actual producers/transformers rather than hand-authored downstream artifacts and prove at least one real multi-stage artifact chain.
4. Package Review regresses provenance semantics, compatibility, security/no-leak, architecture boundaries and technical debt.

## Package Integration & Review gate
After all required constructions are integrated, regress WBS 14.1-14.2, contract/schema drift, extension compatibility, provider/storage neutrality, no-leak behavior, actual lineage preservation and need for optional Construction C. Missing required product capability returns to explicit construction/change control.

## Documentation & Closure gate
Reconcile `PROJECT_STATE`, `CURRENT_MILESTONE`, `NEXT_WORK`, package/Sprint reports, WBS evidence and carried debt. No new product behavior during closure.

## Risks and controls
- **R14-01 Core-envelope overreach:** use additive namespaced extension semantics and preserve ADR-0009 core meaning.
- **R14-02 Provenance becomes execution authority:** provenance remains evidence only; authorization/audit boundaries are unchanged.
- **R14-03 Sensitive/provider data leakage:** contracts must not require secrets, credentials, provider resource IDs or storage locators.
- **R14-04 Hand-authored lineage proof:** Construction B must exercise real serializer/validator/module APIs when executable predecessors exist.
- **R14-05 Scope collision with Audit Trail:** Runtime action audit remains out of scope.

## Explicit non-goals
- Runtime Audit Trail replacement;
- mandatory sensitive payload capture;
- provider-specific registry/storage topology;
- new authorization semantics;
- WBS 14.3 implementation in this package;
- absorption of TD-P13-01..04.
