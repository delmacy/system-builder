# P14-EVIDENCE-PROVENANCE-PROPAGATION-01 — Construction B

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Work Package: P14-PACKAGE-01
Milestone: M14 Evidence & Provenance
Primary WBS: 14.1.1-14.2.3
Planning base: `4923892f66bc3dc0bd1915b96c336b5e7301c4c3`
Execution branch after materialization merge: `sprint/P14-EVIDENCE-PROVENANCE-PROPAGATION-01`
TASK order: TASK-274 -> TASK-275 -> TASK-276 -> TASK-277 -> TASK-278 -> TASK-279

## Sprint goal
Propagate the integrated provider-neutral evidence-provenance extension through representative real Compiler, Release, Deploy and Observe transformations, preserving backward compatibility and no-leak boundaries, and prove a real multi-stage artifact chain using actual module APIs.

## Predecessor gate
Construction A `P14-EVIDENCE-PROVENANCE-CONTRACT-01` is integrated. Post-Construction-A revalidation is integrated by PR #334 / main `4923892f66bc3dc0bd1915b96c336b5e7301c4c3` and confirms the propagation gap. No product work may execute until this materialization PR integrates.

## Committed TASKs
1. TASK-274 — propagate normalized provenance through Compiler ReleaseArtifact output.
2. TASK-275 — preserve provenance through Release publication.
3. TASK-276 — preserve provenance through Deploy transformation to DeploymentRecord.
4. TASK-277 — preserve provenance through Observe transformation/serialization.
5. TASK-278 — prove Compiler -> Release -> Deploy propagation with actual APIs.
6. TASK-279 — prove full Compiler -> Release -> Deploy -> Observe multi-stage lineage, backward compatibility and no-leak behavior.

## Growing proof
The Sprint starts from the actual Compiler API and carries one explicit normalized evidence-provenance extension through real Release, Deploy and Observe transformations. Historical calls with no provenance remain byte/shape compatible where existing contracts require it; malformed provenance fails explicitly at the boundary that accepts it; optional compatible metadata is preserved; no credential/secret/provider resource identifier/storage locator becomes mandatory; provenance remains evidence only.

## Final validation
- `npm run test:product`
- `npm run check:tasks`
- `npm run check:architecture`
- `npm run verify`

## Stop/escalation conditions
Stop if implementation requires a new L4 module boundary/topology, changing ADR-0009 core envelope semantics, making provenance authorization, replacing Runtime Audit Trail, introducing mandatory provider/storage metadata, touching WBS 14.3, or absorbing TD-P13-01..04. Bounded additive L3 changes inside the committed chain are authorized by the Work Package and user delegation.

## Forecast boundary
Optional Construction C remains FORECAST ONLY / NOT MATERIALIZED. Package Integration & Review remains the next package-level gate after Construction B is integrated and fresh-main revalidation determines whether C is necessary.