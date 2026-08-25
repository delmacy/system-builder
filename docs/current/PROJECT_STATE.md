# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. P12 and P13-PACKAGE-01..03 are CLOSED. M13 Autonomous Runtime is CLOSED at WBS 13.1-13.3.

## Current execution horizon — M14 Evidence & Provenance
`P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` is active and covers WBS 14.1.1-14.2.3 only.

Construction A `P14-EVIDENCE-PROVENANCE-CONTRACT-01` / TASK-267..273 is COMPLETE / SPRINT REVIEW PASS / INTEGRATED. Final reviewed head `eb881c9a07882cba9ec1d9068056166c922779c4` passed Deterministic CI #717 and Heavy Product Tests #142 and integrated as `2ba94b028819e5daf8d4ff63bebe94209675774d` with identical reviewed/merged tree `8fcd51469846fe7ab11aedf62ec18720fea0a2c6`.

Post-Construction-A reconciliation/revalidation is integrated through PR #334 / main `4923892f66bc3dc0bd1915b96c336b5e7301c4c3` and confirms the required real producer/transformer propagation gap.

Construction B `P14-EVIDENCE-PROVENANCE-PROPAGATION-01` is now COMMITTED / MATERIALIZED / NOT EXECUTED in the current Planning & Materialization branch with TASK-274..279. Its bounded chain is Compiler -> Release -> Deploy -> Observe using existing module APIs. Product execution remains forbidden until this materialization passes exact-head gates and integrates.

Optional Construction C remains FORECAST ONLY / NOT MATERIALIZED and evidence-gated. WBS 14.3.1-14.3.3 remains outside P14-PACKAGE-01 and forecast for successor P14 planning.

## Security and architecture boundary
Evidence/provenance is traceability, not execution authority. Runtime Audit Trail is not replaced. ADR-0009 core artifact-envelope meaning remains authoritative. No secret value, credential, mandatory provider resource identifier or mandatory storage locator belongs in portable provenance. Construction B may make only bounded additive/backward-compatible L3 propagation changes inside its committed chain; no new L4 topology is authorized.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by M14 work.
