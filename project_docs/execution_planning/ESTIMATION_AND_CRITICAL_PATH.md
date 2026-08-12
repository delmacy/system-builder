# First Horizon — Relative Estimation and Critical Path

No calendar duration is claimed yet. Estimates are relative planning units (PU) used only to compare sequencing/uncertainty until actual agent/review throughput is calibrated.

PERT-like estimate: `(O + 4M + P) / 6`, where O/M/P are optimistic/most-likely/pessimistic relative units.

| WP | O | M | P | Expected PU | Notes |
|---|---:|---:|---:|---:|---|
| WP-FH-01 | 1 | 2 | 3 | 2.00 | bounded schema/test work; tooling gate may delay execution but is not product effort |
| WP-FH-02 | 2 | 3 | 5 | 3.17 | architecture-sensitive semantics and envelope integration |
| WP-FH-03 | 2 | 3 | 5 | 3.17 | central business/software boundary |
| WP-FH-04 | 2 | 3 | 5 | 3.17 | bridge contract with traceability |
| WP-FH-05 | 3 | 5 | 8 | 5.17 | high boundary complexity and secret/runtime constraints |
| WP-FH-06 | 3 | 5 | 8 | 5.17 | multiple linked public artifacts and end-to-end chain test |

## Logical critical chain
WP-FH-03 -> WP-FH-04 -> WP-FH-05 -> WP-FH-06 is strictly serial after ProcessMirror closure. WP-FH-01 and WP-FH-02 may progress in parallel, but WP-FH-02 closure joins on WP-FH-01 validation.

With unlimited parallel capacity, the relative path to M1 contract-spine closure is approximately:
`max(WP-FH-01, WP-FH-02) + FH-03 + FH-04 + FH-05 + FH-06` = about `19.85 PU`.

With sequential-first capacity, effort is approximately the sum of all six = about `21.85 PU`, plus review/integration overhead and any TASK-011 tooling correction/merge overhead.

## Calibration rule
After each completed WP capture implementation, review, CI, rework and integration actuals. Replace these provisional PU assumptions with empirically calibrated ranges before deriving calendar dates.
