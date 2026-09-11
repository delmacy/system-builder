# Next Work — G2-WP-06 Construction A Sprint Review

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-05` are CANONICALLY CLOSED. G2-WP-06 Planning & Materialization is integrated. Construction A is materialized as `TASK-510 -> TASK-511 -> TASK-512 -> TASK-513 -> TASK-514 -> TASK-515`; Construction B/C remain `NOT MATERIALIZED`.

## Integrated Construction A
TASK-510 is integrated by PR #655. TASK-511 is integrated by PR #658 from authoritative head `cfb1abd4a128d07a866a8e3e068f8b1da2b7d6f4`. TASK-512 is integrated by PR #660 from authoritative head `f626839f8982dabc93cf86cf76de087cfdf4fc0f`. TASK-513 is integrated by PR #662 from exact head `a0f2a6039de91383a5759a34a3145c73bcf06944`. TASK-514 is integrated by PR #665. TASK-515 is integrated by PR #667 from exact head `aa75507cc0c0de25adc6d03d9a0f930e1c6f0b89` after Deterministic CI #1626 PASS, Heavy Product Tests #1209 PASS and Automation Handoff #1966 PASS; squash integration produced authoritative main commit `cd6838ae77d35a4c38a63790c5d2ccbcbcb7e247`.

## Revalidated authority
Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, with the Generation 2 research state and handoff authority at `READY_FOR_WORKER_HANDOFF / PASS`. WP-06 owns `G2-WBS-09`, `G2-WBS-23`, `G2-WBS-10` and consumes closed WP-01/WP-02/WP-04/WP-05 semantics.

## Next mandatory gate
Perform **Construction A Sprint Review** against fresh `main@cd6838ae77d35a4c38a63790c5d2ccbcbcb7e247` and integrated TASK-510..515 evidence. Do not materialize Construction B/C unless that review produces fresh-main evidence for dependency-safe work already within the authorized WP design.

Preserve conservative `PARTIAL/UNKNOWN`, currentness/locality, AI/discovery evidence != authority, external-ID reuse/rebinding protection, single canonical truth with visible residual cohorts, Local/Station/Fleet boundaries, source-of-truth/coexistence/residual drainage, and the separation observation -> requested intent -> external authorization -> confirmed physical effect. Product Proof is not Production Readiness. Do not absorb concrete adapters/devices, deployment, WP-07+ or DEFER/DO_NOT_BUILD findings.