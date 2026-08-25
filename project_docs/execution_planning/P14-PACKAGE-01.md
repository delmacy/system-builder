# P14-PACKAGE-01 — Evidence Identity & Transformation Lineage

Status: CONSTRUCTION A INTEGRATED / CONSTRUCTION B MATERIALIZED PENDING PLANNING GATE
Milestone: M14 Evidence & Provenance
Primary WBS: 14.1.1-14.2.3
Planning base: `4d113432c089621c5f327aed50843b6fd2c8321a`
Construction A merge-main: `2ba94b028819e5daf8d4ff63bebe94209675774d`
Post-Construction-A propagation-gap merge-main: `4923892f66bc3dc0bd1915b96c336b5e7301c4c3`
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
TASKs: TASK-267..273.
Reviewed head `eb881c9a07882cba9ec1d9068056166c922779c4`; Deterministic CI #717 PASS; Heavy Product Tests #142 PASS; merge-main `2ba94b028819e5daf8d4ff63bebe94209675774d`; reviewed/merged tree `8fcd51469846fe7ab11aedf62ec18720fea0a2c6`.
Result: additive provider-neutral evidence-provenance extension, deterministic normalization, stable non-artifact source references, optional classification/confidence, transformation descriptors, compatible lineage round trips, historical compatibility and no-leak proof.

## Post-Construction-A revalidation
Integrated by PR #334 / main `4923892f66bc3dc0bd1915b96c336b5e7301c4c3`. It confirms Construction A closes contract semantics but representative product producer/transformer surfaces still do not propagate the namespace. A real multi-stage chain remains necessary for the Package Goal.

## Construction B — P14-EVIDENCE-PROVENANCE-PROPAGATION-01
Status: COMMITTED / MATERIALIZED / NOT EXECUTED; execution blocked until this Planning & Materialization increment integrates.
TASKs: TASK-274..279.
Goal: propagate the integrated provenance contract through actual Compiler -> Release -> Deploy -> Observe transformations and prove preservation across the real multi-stage chain.
Growing proof: actual module APIs only where executable producers exist; backward-compatible absence; explicit malformed-input failure; deterministic preservation; no secret/provider/storage leakage; provenance remains evidence only.
Execution branch after planning merge: `sprint/P14-EVIDENCE-PROVENANCE-PROPAGATION-01`.

## Optional Construction C candidate
Status: FORECAST ONLY / NOT MATERIALIZED.
Promote only if fresh-main post-Construction-B evidence proves a bounded package-goal gap remains. It is not automatic.

## Package Integration & Review gate
After all required constructions are integrated, regress WBS 14.1-14.2, contract/schema drift, extension compatibility, provider/storage neutrality, no-leak behavior, actual lineage preservation and need for optional Construction C. Missing required product capability returns to explicit construction/change control.

## Documentation & Closure gate
Reconcile `PROJECT_STATE`, `CURRENT_MILESTONE`, `NEXT_WORK`, package/Sprint reports, WBS evidence and carried debt. No new product behavior during closure.

## Risks and controls
- **R14-01 Core-envelope overreach:** additive namespaced extension only; ADR-0009 core meaning is unchanged.
- **R14-02 Provenance becomes execution authority:** provenance remains evidence only.
- **R14-03 Sensitive/provider data leakage:** no secrets, credentials, mandatory provider resource IDs or storage locators.
- **R14-04 Hand-authored lineage proof:** Construction B must exercise real module APIs.
- **R14-05 Scope collision with Audit Trail:** Runtime action audit remains out of scope.

## Explicit non-goals
Runtime Audit Trail replacement; mandatory sensitive payload capture; provider-specific registry/storage topology; new authorization semantics; WBS 14.3 implementation; TD-P13-01..04 absorption.