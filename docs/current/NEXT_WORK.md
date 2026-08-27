# Next Work — P17 Package 01 post-correction fresh-main gate

M16 AI Gateway and `P16-PACKAGE-03` are canonically CLOSED. `P17-PACKAGE-01 — Knowledge Classification & Use Policy Foundation` Planning & Materialization is integrated via PR #427 / merge `ef01f54c30ac5dabe9be54150a5e25a232211304`.

Construction A `P17-KNOWLEDGE-CLASSIFICATION-CONTRACT-01` integrated via PR #428, then received bounded conformance correction TASK-362 through PR #432. The correction requires canonical M15 Decision Boundary verification with `expectedCategory: "human-decision"`, rejects deterministic/probabilistic substitution, and requires `decisionActorRef` to match verified `authorityRef`. PR #432 passed exact-head Deterministic CI #990 and Heavy Product Tests #435 and integrated as `9a14c7bed8a45f5ff5a4fd39515aa3e9cef6581d`; reviewed-head and merge-main have zero file differences.

Construction A is CORRECTED / INTEGRATED. Construction B remains FORECAST / NOT MATERIALIZED; Construction C remains optional/evidence-gated. WBS 17.2/17.3 remain FORECAST / NOT MATERIALIZED.

## Required next action
1. reconstruct fresh `main` after the TASK-362 correction and repository-memory reconciliation;
2. re-read `P17-PACKAGE-01`, Construction A report and WBS 17.1 authority;
3. inspect representative existing knowledge-candidate/evidence consumers for a bounded WBS 17.1 integration gap;
4. materialize `P17-KNOWLEDGE-CLASSIFICATION-INTEGRATION-01` only if fresh-main evidence explicitly demonstrates that gap;
5. otherwise proceed to the next Package gate allowed by the Package policy without inventing Construction B work.

## Boundaries
No WBS 17.2 enforcement, WBS 17.3 promotion/anonymization, automatic reuse approval, provider topology/credential lifecycle, unrelated conformance/productization finding or TD-P13-01..04 absorption, Decision Boundary public-contract change, or undeclared L4 change.
