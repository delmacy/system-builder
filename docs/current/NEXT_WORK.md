# Next Work — G2-WP-06 Construction A / TASK-515

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-05` are CANONICALLY CLOSED. G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

## Integrated predecessors
TASK-510 is integrated by PR #655. TASK-511 is integrated by PR #658 from authoritative head `cfb1abd4a128d07a866a8e3e068f8b1da2b7d6f4`. TASK-512 is integrated by PR #660 from authoritative head `f626839f8982dabc93cf86cf76de087cfdf4fc0f`. TASK-513 is integrated by PR #662 from exact head `a0f2a6039de91383a5759a34a3145c73bcf06944`. TASK-514 is integrated by PR #665 from exact head `b1b0774773c2137d11c17a26d4552d55495aa8b1` after Deterministic CI #1624 PASS, Heavy Product Tests #1205 PASS and Automation Handoff #1952 PASS; expected-head-protected squash produced authoritative main commit `6d55d9e665fe2fdb9be72534ff1f73e10fc520ce`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, with `RESEARCH_PIPELINE_STATE.json` at `READY_FOR_WORKER_HANDOFF / PASS`. WP-06 owns `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10` and consumes closed WP-01/WP-02/WP-04/WP-05 semantics.

## Next mandatory gate
TASK-515 is dependency-safe and READY after TASK-514 integration. Execute only TASK-515 from fresh main. Its scope is integrated positive/negative/adversarial/recovery Product Proof across TASK-510..514, with no new semantic ownership and no Production Readiness claim.

Preserve conservative `PARTIAL/UNKNOWN`, currentness/locality, AI/discovery evidence != authority, external-ID reuse/rebinding protection, single canonical truth with visible residual cohorts, Local/Station/Fleet boundaries, and the separation observation -> requested intent -> external authorization -> confirmed physical effect. Do not absorb concrete adapters/devices, deployment, WP-07+ or DEFER/DO_NOT_BUILD findings.