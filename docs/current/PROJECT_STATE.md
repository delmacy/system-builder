# Project State

Date: 2026-08-25

`delmacy/system-builder` is canonical. M13 is CLOSED. `P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` is CLOSED; WBS 14.1.1-14.2.3 is SATISFIED / CLOSED.

## Current execution horizon — M14 Evidence & Provenance
`P14-PACKAGE-02 — Evidence Integrity & Provenance Query` is active for WBS 14.3.1-14.3.3.

Construction A `P14-EVIDENCE-INTEGRITY-FOUNDATION-01` / TASK-280..286 is COMPLETE / SPRINT REVIEW PASS / INTEGRATED. Exact reviewed head `89ecedfdedfdf3ceed225c1137420794c070fcf0` passed Deterministic CI #755 and Heavy Product Tests #182 and integrated as `a9165da3acc2ae6092188729d8bd76739b30fb49`; both reviewed head and merge-main resolve to tree `ee70f603b01a8dffca78c637de7daa7634aced32`.

Post-Construction-A revalidation exact head `1fa7482651b3c380e591d06ff1e73135bcc6f83d` passed Deterministic CI #756 and Heavy Product Tests #184 and integrated as `c07656775da38c34a85365ea23a008e5b136e066`; both revalidation head and merge-main resolve to tree `ecd5635344b6064633990160142bfc64d70f4be7`.

Fresh-main evidence confirms WBS 14.3.1 is satisfied and WBS 14.3.2 remains a real bounded gap: explicit provenance references exist, but no deterministic bidirectional source→artifact / artifact→source navigation projection/query exists.

Construction B `P14-EVIDENCE-PROVENANCE-NAVIGATION-01` is therefore JUSTIFIED / FORECAST / NOT MATERIALIZED and awaits a separate promotion/materialization gate. Construction C remains OPTIONAL / EVIDENCE-GATED for any residual 14.3.3 migration-preservation capability after Construction B.

## Security and architecture boundary
Evidence/provenance remains traceability, not execution authority. Runtime Audit Trail is not replaced. ADR-0009 core artifact-envelope meaning remains authoritative. No secret value, credential, mandatory provider resource identifier or mandatory storage locator belongs in portable provenance. No graph database or provider/storage topology is implied or authorized.

## Carried debt
TD-P13-01..04 remain carried and are not absorbed or re-ranked by M14 work.
