# Next Work — Generation 2 / G2-WP-12 Construction B

Generation 2 remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01..G2-WP-11 are canonically closed. G2-WP-12 Construction A / `G2-WBS-19` is integrated through TASK-566. Construction B / `G2-WBS-20` was materialized from live `main@6e4050a82dcc085f17df5791cd8ec97323fd8db5` against exact planning authority `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`.

## Current executable gate
TASK-567 is the sole dependency-safe Construction B product task. Execute it from fresh main only after this materialization PR's exact-head and current merge-candidate gates are green and the materialization is integrated. TASK-568 depends on TASK-567; TASK-569 depends on TASK-568; TASK-570 depends on TASK-569 and is cumulative Product Proof closure.

## Materialized chain
- TASK-567 — product/offer/plan/price/contract revision and effective-time semantics — READY.
- TASK-568 — subscription and commercial entitlement semantics — BLOCKED_BY TASK-567.
- TASK-569 — meter/usage/rating/charge/invoice/payment evidence and correction/rerating lineage — BLOCKED_BY TASK-568.
- TASK-570 — cumulative G2-WBS-20 Product Proof — BLOCKED_BY TASK-569.

## Successor rule
Do not promote Construction C automatically; G2-WBS-21 remains a forecast candidate until Construction B integrates and fresh-main evidence proves it necessary. Do not absorb G2-WP-13.

## Boundary
Preserve governance evidence != authority/compliance truth; commercial entitlement != operational authorization; measured != qualified != rated != billed != invoiced != paid; missing usage != zero; settlement/provider ACK != customer-commercial truth; PARTIAL/UNKNOWN non-strengthening; effective-dated revision/scope/currentness/provenance; correction/rerating lineage; residual populations and provider-migration obligations; source-of-truth/coexistence/residual drainage; replaceable provider qualification; Local/Station/Fleet semantics; AI inference != authority; Product Proof distinct from Production Readiness. Do not absorb FinOps/G2-WBS-21, autonomous-agent authority, generic direct side-effect authority, unmaterialized DEFER/DO_NOT_BUILD findings or unrelated product scope.
