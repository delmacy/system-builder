# Next Work — P14 Construction B materialization gate

Construction A of `P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` is integrated. Post-Construction-A revalidation is integrated by PR #334 / main `4923892f66bc3dc0bd1915b96c336b5e7301c4c3` and confirms a real producer/transformer propagation gap.

Construction B `P14-EVIDENCE-PROVENANCE-PROPAGATION-01` is now COMMITTED / MATERIALIZED / NOT EXECUTED with TASK-274..279 in a separate Planning & Materialization increment.

## Required next action
1. Validate this materialization on its exact PR head with Deterministic CI + Heavy Product Tests and no blocking review findings.
2. Merge only if the exact head remains stable and all required gates pass.
3. Reconstruct fresh `main` and verify planning-head -> merge-main tree equivalence.
4. Create `sprint/P14-EVIDENCE-PROVENANCE-PROPAGATION-01` exactly from the integrated planning merge.
5. Execute TASK-274 first, then TASK-275..279 strictly in dependency order with one authoritative commit per TASK.
6. At Sprint completion run repository-wide verification, produce the Sprint Report and open the single Sprint Review PR.
7. After Construction B integrates, fresh-main revalidation decides whether optional Construction C is necessary or Package Integration & Review is next.

## Committed bounded chain
Compiler -> Release -> Deploy -> Observe. The Sprint must propagate only the already-integrated provider-neutral evidence-provenance extension through these actual APIs and prove a real multi-stage chain. Historical absence remains backward compatible; malformed explicit provenance fails; no secrets/credentials/provider resource IDs/storage locators become required; provenance remains evidence only.

## Boundaries
P14-PACKAGE-01 covers WBS 14.1.1-14.2.3 only. ADR-0009 core envelope semantics remain authoritative. Do not replace Runtime Audit Trail, add provider/storage topology, make provenance authorization, absorb TD-P13-01..04, execute WBS 14.3, or promote Construction C without fresh integrated evidence.
