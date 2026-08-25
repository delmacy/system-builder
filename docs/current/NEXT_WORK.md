# Next Work — P14 Construction B planning gate

Construction A of `P14-PACKAGE-01 — Evidence Identity & Transformation Lineage` is integrated. Post-Construction-A fresh-main revalidation confirms that a real producer/transformer propagation gap remains necessary to satisfy the current Package Goal.

## Required next action
1. Integrate the post-Construction-A revalidation evidence on exact-head CI/Heavy/review gates.
2. Reconstruct fresh `main` and verify revalidation-head -> merge-main tree equivalence.
3. Perform a separate Planning & Materialization step for `P14-EVIDENCE-PROVENANCE-PROPAGATION-01` using actual existing producer/transformer surfaces and the integrated evidence-provenance contract.
4. Materialize only the bounded Construction B TASK set needed to propagate provenance through representative real producers/transformers and extend the growing proof across at least one actual multi-stage artifact chain.
5. Do not execute Construction B until that materialization passes required gates and integrates.
6. Keep optional Construction C forecast-only unless fresh integrated evidence after Construction B proves it necessary.

## Revalidation finding
The integrated evidence-provenance namespace is present in the contract, fixtures and product proofs, but no representative real producer/transformer product surface currently propagates it. Construction A therefore closes contract semantics but not the package-level propagation requirement across bounded-context artifacts.

## Authority and boundaries
P14-PACKAGE-01 covers WBS 14.1.1-14.2.3 only. ADR-0009/artifact-envelope 1.0.0 predecessor semantics remain authoritative. WBS 14.3.1-14.3.3 remains outside the package and forecast-only.

Construction B is eligible for separate Planning & Materialization but is not yet materialized and grants no execution authority. Do not replace Runtime Audit Trail, introduce provider/storage topology, make provenance authorization, require secrets/credentials/provider resource identifiers/storage locators, absorb TD-P13-01..04, or promote optional Construction C without fresh integrated evidence.
